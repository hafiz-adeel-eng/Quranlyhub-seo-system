// Renders one MP4 per ayah (and a joined full video) from ayat.json.
// Usage: node render.mjs [ayahNumber]
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const cfg = JSON.parse(readFileSync("ayat.json", "utf8"));
const only = process.argv[2] ? Number(process.argv[2]) : null;
const ayat = cfg.ayat.filter(a => only === null || a.number === only);
mkdirSync("out/frames", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto("file://" + resolve("frame.html"));
await page.evaluate(() => document.fonts.ready);

await page.evaluate(() => document.body.classList.add("hide-text"));
await page.screenshot({ path: "out/frames/bg.png" });
await page.evaluate(() => { document.body.classList.remove("hide-text"); document.body.classList.add("hide-bg"); });

const clips = [];
for (const a of ayat) {
  await page.evaluate(({ a, cfg }) => window.setAyah({
    ...a, reference: `${cfg.surah} · ${cfg.surahNumber}:${a.number}`, logo: cfg.logo,
  }), { a, cfg });
  await page.evaluate(() => document.fonts.ready);
  const text = `out/frames/ayah-${a.number}.png`;
  await page.screenshot({ path: text, omitBackground: true });

  const dur = (a.end - a.start).toFixed(2);
  const out = `out/ayah-${a.number}.mp4`;
  // Background with a slow zoom, text fades in at 0.4s and out 0.6s before the end.
  const fadeOut = Math.max(0, a.end - a.start - 0.6).toFixed(2);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error",
    "-loop", "1", "-framerate", "30", "-i", "out/frames/bg.png",
    "-loop", "1", "-framerate", "30", "-i", text,
    "-ss", String(a.start), "-t", dur, "-i", cfg.audio,
    "-filter_complex",
    `[0:v]scale=2112:1188,zoompan=z='1+0.00025*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30[bg];` +
    `[1:v]format=rgba,fade=in:st=0.4:d=0.8:alpha=1,fade=out:st=${fadeOut}:d=0.6:alpha=1[tx];` +
    `[bg][tx]overlay=format=auto,format=yuv420p[v]`,
    "-map", "[v]", "-map", "2:a", "-t", dur,
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-c:a", "aac", "-b:a", "192k", out]);
  clips.push(out);
  console.log("rendered", out);
}
await browser.close();

if (clips.length > 1) {
  writeFileSync("out/list.txt", clips.map(c => `file '${resolve(c)}'`).join("\n"));
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", "out/list.txt", "-c", "copy", "out/full.mp4"]);
  console.log("rendered out/full.mp4");
}
