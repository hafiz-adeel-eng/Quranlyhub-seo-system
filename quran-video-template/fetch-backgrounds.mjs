// Downloads landscape stock clips from Pexels into backgrounds/ and lists them in ayat.json.
// Usage: PEXELS_API_KEY=... node fetch-backgrounds.mjs "mosque" "forest" "mountains" ...
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";

const key = process.env.PEXELS_API_KEY;
if (!key) throw new Error("Set PEXELS_API_KEY (from https://www.pexels.com/api/).");
const queries = process.argv.slice(2).length ? process.argv.slice(2)
  : ["mosque", "forest", "waterfall", "mountains", "clouds sky", "desert", "ocean waves", "rain"];
const perQuery = Number(process.env.PER_QUERY ?? 2);
mkdirSync("backgrounds", { recursive: true });

const saved = [];
for (const q of queries) {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&orientation=landscape&size=medium&per_page=15`;
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) throw new Error(`Pexels ${res.status} for "${q}"`);
  const { videos } = await res.json();
  // Skip clips with visible people; prefer 1920-wide HD files.
  const picks = videos.filter(v => !/people|person|man|woman|girl|boy/i.test(v.url)).slice(0, perQuery);
  for (const v of picks) {
    const file = v.video_files.filter(f => f.file_type === "video/mp4" && f.width >= 1280)
      .sort((a, b) => Math.abs(a.width - 1920) - Math.abs(b.width - 1920))[0];
    if (!file) continue;
    const path = `backgrounds/${q.replace(/\s+/g, "-")}-${v.id}.mp4`;
    if (!existsSync(path)) writeFileSync(path, Buffer.from(await (await fetch(file.link)).arrayBuffer()));
    saved.push(path);
    console.log(`${path}  (by ${v.user.name}, ${v.url})`);
  }
}
const cfg = JSON.parse(readFileSync("ayat.json", "utf8"));
cfg.backgrounds = [...new Set([...(cfg.backgrounds ?? []), ...saved])];
writeFileSync("ayat.json", JSON.stringify(cfg, null, 2) + "\n");
console.log(`${saved.length} clips added to ayat.json`);
