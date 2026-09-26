"""Private live assistant for an online Quran class (Windows).

Listens to the teacher's microphone and to Zoom's sound (the student),
turns speech into text with Groq Whisper, asks a Groq LLM for a short
English answer, and shows it in a small always-on-top window.
"""

import io
import os
import queue
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
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env(HERE / ".env")

API_KEY = os.environ.get("GROQ_API_KEY", "")
CHAT_MODEL = os.environ.get("CHAT_MODEL", "llama-3.3-70b-versatile")
STT_MODEL = os.environ.get("STT_MODEL", "whisper-large-v3-turbo")
# Loudness needed to count as speech. Raise it if noise triggers the assistant.
VOICE_LEVEL = float(os.environ.get("VOICE_LEVEL", "500"))
SILENCE_SEC = float(os.environ.get("SILENCE_SEC", "0.8"))
MIN_SPEECH_SEC = float(os.environ.get("MIN_SPEECH_SEC", "0.5"))
MAX_SPEECH_SEC = float(os.environ.get("MAX_SPEECH_SEC", "20"))
LISTEN_TO_TEACHER = os.environ.get("LISTEN_TO_TEACHER", "yes").lower() != "no"
HISTORY_LINES = 30

SYSTEM_PROMPT = (HERE / "prompt.txt").read_text(encoding="utf-8")

# Text Whisper often "hears" in silence or noise.
FAKE_TEXT = {"", "you", "thank you", "thank you.", "thanks for watching!", "bye.", "."}

segments = queue.Queue()  # (speaker, wav_bytes)
ui_events = queue.Queue()  # (kind, text)
stop = threading.Event()


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


def think(client):
    history = []
    while not stop.is_set():
        speaker, wav = segments.get()
        # The teacher may speak Urdu or Hindi, so only fix the student's language.
        options = {"language": "en"} if speaker == "STUDENT" else {}
        try:
            result = client.audio.transcriptions.create(
                file=("speech.wav", wav), model=STT_MODEL, temperature=0.0, **options)
            text = result.text.strip()
        except Exception as e:
            ui_events.put(("error", f"Speech-to-text error: {e}"))
            continue
        if text.lower() in FAKE_TEXT:
            continue
        line = f"{speaker}: {text}"
        history = (history + [line])[-HISTORY_LINES:]
        ui_events.put(("log", line))
        if speaker != "STUDENT":
            continue
        try:
            reply = client.chat.completions.create(
                model=CHAT_MODEL, temperature=0.2, max_tokens=120,
                messages=[{"role": "system", "content": SYSTEM_PROMPT},
                          {"role": "user", "content": "Live transcript so far:\n" + "\n".join(history)
                           + "\n\nWhat should the teacher say now?"}],
            ).choices[0].message.content.strip()
        except Exception as e:
            ui_events.put(("error", f"AI error: {e}"))
            continue
        if "NO RESPONSE NEEDED" in reply.upper():
            ui_events.put(("log", "   (no response needed)"))
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

    if not API_KEY:
        say.config(text="GROQ_API_KEY is missing. Put it in the .env file.", fg="#ff7070")
        root.mainloop()
        return

    pa = pyaudio.PyAudio()
    try:
        mic, speakers = find_devices(pa)
    except Exception as e:
        say.config(text=f"Audio device problem: {e}", fg="#ff7070")
        root.mainloop()
        return
    add_log(f"Student sound from: {speakers['name']}")
    add_log(f"Teacher mic: {mic['name']}" if LISTEN_TO_TEACHER else "Teacher mic: off")

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
            elif kind == "error":
                add_log(text, "#ff7070")
            else:
                add_log(text)
        root.after(100, poll)

    root.after(300, lambda: hide_from_screen_share(root))
    poll()
    root.protocol("WM_DELETE_WINDOW", lambda: (stop.set(), root.destroy()))
    root.mainloop()
    stop.set()


if __name__ == "__main__":
    main()
