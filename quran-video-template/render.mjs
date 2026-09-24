// Renders one MP4 per ayah (and a joined full video) from ayat.json.
// Usage: node render.mjs [ayahNumber]
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const cfg = JSON.parse(readFileSync("ayat.json", "utf8"));
const only = process.argv[2] ? Number(process.argv[2]) : null;
// Stock clips cycle across ayat unless an ayah names its own "background".
const backgrounds = (cfg.backgrounds ?? []).filter(b => existsSync(b));
const ayat = cfg.ayat
  .map((a, i) => ({ ...a, background: a.background ?? (backgrounds.length ? backgrounds[i % backgrounds.length] : null) }))
  .filter(a => only === null || a.number === only);
mkdirSync("out/frames", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto("file://" + resolve("frame.html"));
await page.evaluate(() => document.fonts.ready);

const setClasses = (...names) => page.evaluate(names => { document.body.className = names.join(" "); }, names);
await setClasses("hide-text");
await page.screenshot({ path: "out/frames/bg.png" });
await setClasses("hide-text", "over-video");
await page.screenshot({ path: "out/frames/shade.png", omitBackground: true });
await setClasses("hide-bg");

const clips = [];
for (const a of ayat) {
  await page.evaluate(({ a, cfg }) => window.setAyah({
    ...a, reference: `القرآن - سورۃ نمبر ${cfg.surahNumber} ${cfg.surahUrdu} · آیت نمبر ${a.number}`, logo: cfg.logo,
  }), { a, cfg });
  await page.evaluate(() => document.fonts.ready);
  const text = `out/frames/ayah-${a.number}.png`;
  await page.screenshot({ path: text, omitBackground: true });

  const len = a.end - a.start;
  const dur = len.toFixed(2);
  const out = `out/ayah-${a.number}.mp4`;
  const fadeOut = Math.max(0, len - 0.6).toFixed(2);
  // Background: looping stock clip under a dark shade, or the drawn pattern with a slow zoom.
  const bgInputs = a.background
    ? ["-stream_loop", "-1", "-i", a.background, "-loop", "1", "-framerate", "30", "-i", "out/frames/shade.png"]
    : ["-loop", "1", "-framerate", "30", "-i", "out/frames/bg.png"];
  const t = a.background ? 2 : 1; // index of the text input
  const bgFilter = a.background
    ? `[0:v]fps=30,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,` +
      `fade=in:st=0:d=0.5,fade=out:st=${Math.max(0, len - 0.5).toFixed(2)}:d=0.5[raw];[raw][1:v]overlay=format=auto[bg];`
    : `[0:v]scale=2112:1188,zoompan=z='min(1+0.0002*on,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30[bg];`;
  execFileSync("ffmpeg", ["-y", "-loglevel", "error",
    ...bgInputs,
    "-loop", "1", "-framerate", "30", "-i", text,
    "-ss", String(a.start), "-t", dur, "-i", cfg.audio,
    "-filter_complex",
    bgFilter +
    `[${t}:v]format=rgba,fade=in:st=0.4:d=0.8:alpha=1,fade=out:st=${fadeOut}:d=0.6:alpha=1[tx];` +
    `[bg][tx]overlay=format=auto,format=yuv420p[v]`,
    "-map", "[v]", "-map", `${t + 1}:a`, "-t", dur,
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-c:a", "aac", "-b:a", "192k", out]);
  clips.push(out);
  console.log("rendered", out, a.background ? `(background: ${a.background})` : "");
}
await browser.close();

if (clips.length > 1) {
  writeFileSync("out/list.txt", clips.map(c => `file '${resolve(c)}'`).join("\n"));
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", "out/list.txt", "-c", "copy", "out/full.mp4"]);
  console.log("rendered out/full.mp4");
}
