# Quran video template (QuranlyHub)

Renders one 1920x1080 MP4 per ayah: Arabic ayah on top (Scheherazade New), English translation
below, Urdu translation under that (Noto Nastaliq Urdu), logo in the top-left corner. No AI is used:
the frame is HTML, Chromium screenshots it and FFmpeg adds the recitation audio.

1. Put the recitation at `audio/tilawat.mp3` (not committed).
2. Add each ayah to `ayat.json` with its `start`/`end` time in seconds inside the audio.
3. `npm install`, then `node render.mjs` (all ayat, joined into `out/full.mp4`) or `node render.mjs 15` (one ayah).

Requires `ffmpeg` on PATH.

## Nature / mosque backgrounds (Pexels)

`PEXELS_API_KEY=... node fetch-backgrounds.mjs mosque forest waterfall` downloads landscape clips
into `backgrounds/` (not committed) and lists them under `backgrounds` in `ayat.json`. The clips
rotate across ayat; an ayah can pin its own clip with `"background": "backgrounds/....mp4"`.
A dark shade sits over the footage so the text stays readable. Without clips, the drawn
pattern background is used.
