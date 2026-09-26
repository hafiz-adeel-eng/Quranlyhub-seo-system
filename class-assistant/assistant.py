"""Private live assistant for an online Quran class (Windows).

Listens to the teacher's microphone and to Zoom's sound (the student),
turns speech into text with Groq Whisper, asks a Groq LLM for a short
English answer, and shows it in a small always-on-top window.
"""

import io
import os
import queue
import re
import threading
import time
import wave
from pathlib import Path

import numpy as np
import pyaudiowpatch as pyaudio
import tkinter as tk
from groq import Groq

HERE = Path(__file__).resolve().parent


def load_env(path):
    if not path.exists():
        return
    # utf-8-sig: old Notepad adds a hidden mark at the start of the file.
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


# Windows often hides ".txt", so ".env" may really be ".env.txt".
load_env(HERE / ".env")
load_env(HERE / ".env.txt")

API_KEY = os.environ.get("GROQ_API_KEY", "")
# Groq adds and retires models often, so we pick from what the account can
# use right now, best first. CHAT_MODEL in .env forces a model to the front.
PREFERRED_MODELS = [
    "llama-3.3-70b-versatile",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
    "moonshotai/kimi-k2-instruct",
    "openai/gpt-oss-120b",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "qwen/qwen3-32b",
    "openai/gpt-oss-20b",
    "llama-3.1-8b-instant",
]
if os.environ.get("CHAT_MODEL"):
    PREFERRED_MODELS.insert(0, os.environ["CHAT_MODEL"])
NOT_CHAT = ("whisper", "guard", "tts", "playai", "distil", "compound", "orpheus", "prompt-guard")
STT_MODEL = os.environ.get("STT_MODEL", "whisper-large-v3-turbo")
# Loudness needed to count as speech. Raise it if noise triggers the assistant.
VOICE_LEVEL = float(os.environ.get("VOICE_LEVEL", "500"))
SILENCE_SEC = float(os.environ.get("SILENCE_SEC", "0.8"))
MIN_SPEECH_SEC = float(os.environ.get("MIN_SPEECH_SEC", "0.5"))
MAX_SPEECH_SEC = float(os.environ.get("MAX_SPEECH_SEC", "20"))
LISTEN_TO_TEACHER = os.environ.get("LISTEN_TO_TEACHER", "yes").lower() != "no"
HISTORY_LINES = 40

SYSTEM_PROMPT = ((HERE / "prompt.txt").read_text(encoding="utf-8") + "\n\n"
                 + (HERE / "school-info.txt").read_text(encoding="utf-8"))

# Words Whisper should expect, so "Noorani Qaida" is not heard as something else.
STT_HINT = ("Quran class. Noorani Qaida, Quran, Alif, Baa, Taa, Thaa, Jeem, harakat, "
            "fathah, kasrah, dammah, sukoon, tanween, madd, shaddah, Tajweed, euros.")

# Text Whisper often "hears" in silence or noise.
FAKE_TEXT = {"", "you", "thank you", "thank you.", "thanks for watching!", "bye.", "."}

segments = queue.Queue()  # (speaker, wav_bytes)
ui_events = queue.Queue()  # (kind, text)
stop = threading.Event()
levels = {"STUDENT": 0.0, "TEACHER": 0.0}  # latest loudness, shown as meters


def to_wav(frames, channels, rate):
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(channels)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(b"".join(frames))
    return buf.getvalue()


def record(pa, device, speaker):
    """Cut the audio of one device into spoken pieces and queue them."""
    channels = max(1, min(2, int(device["maxInputChannels"])))
    rate = int(device["defaultSampleRate"])
    block = int(rate * 0.03)
    stream = pa.open(format=pyaudio.paInt16, channels=channels, rate=rate,
                     input=True, input_device_index=device["index"],
                     frames_per_buffer=block)
    frames, speaking, started, last_voice = [], False, 0.0, 0.0
    try:
        while not stop.is_set():
            # Loopback gives no data while nothing plays, so never block on it.
            if stream.get_read_available() < block:
                time.sleep(0.01)
            else:
                data = stream.read(block, exception_on_overflow=False)
                level = np.sqrt(np.mean(np.frombuffer(data, np.int16).astype(np.float32) ** 2))
                levels[speaker] = level
                now = time.monotonic()
                if level > VOICE_LEVEL:
                    if not speaking:
                        speaking, started, frames = True, now, []
                    last_voice = now
                if speaking:
                    frames.append(data)
            now = time.monotonic()
            if speaking and (now - last_voice > SILENCE_SEC or now - started > MAX_SPEECH_SEC):
                speaking = False
                if last_voice - started >= MIN_SPEECH_SEC:
                    segments.put((speaker, to_wav(frames, channels, rate)))
    finally:
        stream.close()


def find_devices(pa):
    mic = pa.get_default_input_device_info()
    wasapi = pa.get_host_api_info_by_type(pyaudio.paWASAPI)
    speakers = pa.get_device_info_by_index(wasapi["defaultOutputDevice"])
    if not speakers["isLoopbackDevice"]:
        for loopback in pa.get_loopback_device_info_generator():
            if speakers["name"] in loopback["name"]:
                speakers = loopback
                break
        else:
            raise RuntimeError("Could not find the speaker loopback device.")
    return mic, speakers


def pick_models(client):
    """Available chat models, best first."""
    try:
        available = [m.id for m in client.models.list().data]
    except Exception as e:
        ui_events.put(("error", f"Could not list Groq models: {e}"))
        return list(PREFERRED_MODELS)
    chat = [m for m in available if not any(word in m.lower() for word in NOT_CHAT)]
    ordered = [m for m in PREFERRED_MODELS if m in chat]
    return ordered + sorted(m for m in chat if m not in ordered)


def ask(client, model, messages):
    options = {}
    if "gpt-oss" in model:
        options["reasoning_effort"] = "low"
    reply = client.chat.completions.create(
        model=model, temperature=0.2, max_tokens=400, messages=messages, **options,
    ).choices[0].message.content or ""
    # Some models write their thinking in <think> tags first.
    return re.sub(r"<think>.*?</think>", "", reply, flags=re.S).strip()


def think(client):
    history = []
    models = pick_models(client)
    ui_events.put(("log", f"AI model: {models[0] if models else 'none found'}"))
    while not stop.is_set():
        speaker, wav = segments.get()
        # The teacher may speak Urdu or Hindi, so only fix the student's language.
        options = {"language": "en"} if speaker == "STUDENT" else {}
        try:
            result = client.audio.transcriptions.create(
                file=("speech.wav", wav), model=STT_MODEL, temperature=0.0,
                prompt=STT_HINT, **options)
            text = result.text.strip()
        except Exception as e:
            ui_events.put(("error", f"Speech-to-text error: {e}"))
            continue
        if text.lower() in FAKE_TEXT:
            continue
        line = f"{speaker}: {text}"
        history = (history + [line])[-HISTORY_LINES:]
        ui_events.put(("log", line))
        messages = [{"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": "Live transcript so far:\n" + "\n".join(history)
                     + f"\n\nThe last line is from the {speaker}. What should the teacher say now?"}]
        reply = None
        for model in list(models):
            try:
                reply = ask(client, model, messages)
                break
            except Exception as e:
                if "model_not_found" in str(e) or "decommissioned" in str(e):
                    models.remove(model)  # retired: never try it again
                    if models:
                        ui_events.put(("log", f"AI model: {models[0]}"))
                    continue
                ui_events.put(("error", f"AI error ({model}): {e}"))
        if not reply:
            continue
        if "NO RESPONSE NEEDED" in reply.upper():
            ui_events.put(("log", "   (no response needed)"))
        elif reply.upper().startswith("NEXT:"):
            ui_events.put(("next", reply[5:].strip()))
        else:
            ui_events.put(("say", reply.replace("SAY:", "").strip()))


def hide_from_screen_share(root):
    """Keep this window out of Zoom screen sharing (Windows 10 2004+)."""
    try:
        import ctypes
        hwnd = ctypes.windll.user32.GetParent(root.winfo_id())
        ctypes.windll.user32.SetWindowDisplayAffinity(hwnd, 0x11)
    except Exception:
        pass


def main():
    root = tk.Tk()
    root.title("Class Helper")
    root.geometry("560x320+40+40")
    root.attributes("-topmost", True)
    root.configure(bg="#111")

    say = tk.Label(root, text="Listening...", font=("Segoe UI", 20, "bold"), fg="#7CFC9A",
                   bg="#111", wraplength=530, justify="left", anchor="nw")
    say.pack(fill="x", padx=12, pady=(12, 6))
    log = tk.Text(root, height=8, font=("Segoe UI", 10), fg="#aaa", bg="#1b1b1b",
                  relief="flat", wrap="word")
    log.pack(fill="both", expand=True, padx=12, pady=(0, 12))

    def add_log(text, color="#aaa"):
        log.insert("end", text + "\n", color)
        log.tag_config(color, foreground=color)
        log.see("end")

    def start():
        start_listening(root, say, add_log)

    if API_KEY:
        start()
    else:
        ask_for_key(root, say, start)
    root.protocol("WM_DELETE_WINDOW", lambda: (stop.set(), root.destroy()))
    root.mainloop()
    stop.set()


def ask_for_key(root, say, on_done):
    """Let the teacher paste the Groq key once; it is saved to .env."""
    say.config(text="Paste your Groq API key below and press Save.", fg="#ffd166")
    row = tk.Frame(root, bg="#111")
    row.pack(fill="x", padx=12, pady=(0, 8), after=say)
    entry = tk.Entry(row, font=("Segoe UI", 11), show="*")
    entry.pack(side="left", fill="x", expand=True, ipady=4)

    def paste():
        entry.delete(0, "end")
        entry.insert(0, root.clipboard_get().strip())

    def save():
        global API_KEY
        key = entry.get().strip()
        if not key.startswith("gsk_"):
            say.config(text="This does not look like a Groq key. It starts with gsk_", fg="#ff7070")
            return
        (HERE / ".env").write_text(f"GROQ_API_KEY={key}\n", encoding="utf-8")
        API_KEY = key
        row.destroy()
        say.config(text="Listening...", fg="#7CFC9A")
        on_done()

    tk.Button(row, text="Paste", command=paste).pack(side="left", padx=(8, 0))
    tk.Button(row, text="Save", command=save).pack(side="left", padx=(8, 0))
    entry.focus_set()


def start_listening(root, say, add_log):
    pa = pyaudio.PyAudio()
    try:
        mic, speakers = find_devices(pa)
    except Exception as e:
        say.config(text=f"Audio device problem: {e}", fg="#ff7070")
        return
    add_log(f"Student sound from: {speakers['name']}")
    add_log(f"Teacher mic: {mic['name']}" if LISTEN_TO_TEACHER else "Teacher mic: off")

    meter = tk.Label(root, font=("Consolas", 10), fg="#888", bg="#111", anchor="w")
    meter.pack(fill="x", padx=12, pady=(0, 8), after=say)

    def bar(value):
        filled = min(10, int(value / VOICE_LEVEL * 5))
        return "#" * filled + "." * (10 - filled)

    threading.Thread(target=record, args=(pa, speakers, "STUDENT"), daemon=True).start()
    if LISTEN_TO_TEACHER:
        threading.Thread(target=record, args=(pa, mic, "TEACHER"), daemon=True).start()
    threading.Thread(target=think, args=(Groq(api_key=API_KEY),), daemon=True).start()

    def poll():
        while not ui_events.empty():
            kind, text = ui_events.get()
            if kind == "say":
                say.config(text="SAY: " + text, fg="#7CFC9A")
                add_log(">> " + text, "#7CFC9A")
            elif kind == "next":
                say.config(text="NEXT: " + text, fg="#8ecbff")
                add_log(">> " + text, "#8ecbff")
            elif kind == "error":
                add_log(text, "#ff7070")
            else:
                add_log(text)
        meter.config(text=f"Student [{bar(levels['STUDENT'])}]   Teacher [{bar(levels['TEACHER'])}]")
        levels["STUDENT"] *= 0.7
        levels["TEACHER"] *= 0.7
        root.after(100, poll)

    root.after(300, lambda: hide_from_screen_share(root))
    poll()


if __name__ == "__main__":
    main()
