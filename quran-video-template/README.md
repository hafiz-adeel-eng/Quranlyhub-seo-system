# Quran video template (QuranlyHub)

Renders one 1920x1080 MP4 per ayah: Arabic ayah on top (Scheherazade New), English translation
below, Urdu translation under that (Noto Nastaliq Urdu), logo in the top-left corner. No AI is used:
the frame is HTML, Chromium screenshots it and FFmpeg adds the recitation audio.

1. Put the recitation at `audio/tilawat.mp3` (not committed).
2. Add each ayah to `ayat.json` with its `start`/`end` time in seconds inside the audio.
3. `npm install`, then `node render.mjs` (all ayat, joined into `out/full.mp4`) or `node render.mjs 15` (one ayah).

Requires `ffmpeg` on PATH.
