/**
 * gen-social-previews.mjs
 * ----------------------------------------------------------------------
 * Renders every self-hosted image the profile uses, so nothing depends on
 * a third-party render server:
 *
 *   assets/hero.png              profile README banner (1280x360)
 *   social-previews/<repo>.png   repo social preview cards (1280x640)
 *
 * The hero replaces capsule-render's "venom" type, which draws a small
 * blob and lets long titles overflow outside it.
 *
 * Each voxel skyline is seeded from its own name, so every image is
 * distinct but stable across rebuilds.
 *
 * Usage:
 *     node scripts/gen-social-previews.mjs
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, existsSync, statSync } from "node:fs";
import { resolve, join, dirname } from "node:path";

const OUT_CARDS = resolve("social-previews");
const OUT_ASSETS = resolve("assets");
const TMP = resolve(".render-tmp");

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find(p => existsSync(p));

if (!CHROME) {
  console.error("No Chrome or Edge found. Install Chrome, or edit the CHROME list.");
  process.exit(1);
}

// ── Theme ──────────────────────────────────────────────────────────────
const THEME = {
  bg: "linear-gradient(135deg,#0F0C29 0%,#302B63 52%,#24243E 100%)",
  violet: [139, 92, 246],   // #8B5CF6
  pink:   [240, 171, 252],  // #F0ABFC
  lilac:  [196, 181, 253],  // #C4B5FD
};

// ── Deterministic PRNG so each skyline is stable across rebuilds ───────
function seededRandom(seed) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return () => {
    h ^= h << 13; h >>>= 0;
    h ^= h >>> 17;
    h ^= h << 5;  h >>>= 0;
    return h / 4294967296;
  };
}

/** Isometric voxel field. */
function isoSkyline(seed, opts = {}) {
  const {
    cols = 8, rows = 8, tw = 46, th = 23,
    ox = 300, oy = 150, maxH = 58, minH = 18, pad = 72,
  } = opts;

  const rnd = seededRandom(seed);
  const cubes = [];

  for (let gx = 0; gx < cols; gx++) {
    for (let gy = 0; gy < rows; gy++) {
      // Bias height toward the centre so it reads as a skyline, not noise.
      const dx = (gx - (cols - 1) / 2) / cols;
      const dy = (gy - (rows - 1) / 2) / rows;
      const falloff = 1 - Math.min(1, Math.sqrt(dx * dx + dy * dy) * 1.7);
      const h = Math.max(minH, Math.round((rnd() * maxH + 12) * (0.4 + falloff)));
      cubes.push({ gx, gy, h, depth: gx + gy, t: rnd() });
    }
  }

  cubes.sort((a, b) => a.depth - b.depth); // painter's algorithm, back to front

  const lerp = (a, b, t) => Math.round(a + (b - a) * t);
  const mix = (c1, c2, t) =>
    `rgb(${lerp(c1[0], c2[0], t)},${lerp(c1[1], c2[1], t)},${lerp(c1[2], c2[2], t)})`;

  // Each column is extruded its own height PLUS a fixed pad. The pad makes
  // neighbours overlap so no background shows through (short columns alone
  // leave see-through gaps and the field reads as floating tiles), while
  // keeping the base stepped along the isometric diamond -- extruding to a
  // single shared floor instead merges everything into one flat wall.
  let svg = "";
  for (const { gx, gy, h, t } of cubes) {
    const cx = ox + (gx - gy) * (tw / 2);
    const cy = oy + (gx + gy) * (th / 2) - h;
    const drop = h + pad;

    const top   = mix(THEME.lilac, THEME.pink, t);
    const left  = mix(THEME.violet, [40, 30, 80], 0.45);
    const right = mix(THEME.violet, [24, 18, 56], 0.65);

    const topPts   = `${cx},${cy} ${cx + tw / 2},${cy + th / 2} ${cx},${cy + th} ${cx - tw / 2},${cy + th / 2}`;
    const leftPts  = `${cx - tw / 2},${cy + th / 2} ${cx},${cy + th} ${cx},${cy + th + drop} ${cx - tw / 2},${cy + th / 2 + drop}`;
    const rightPts = `${cx + tw / 2},${cy + th / 2} ${cx},${cy + th} ${cx},${cy + th + drop} ${cx + tw / 2},${cy + th / 2 + drop}`;

    svg += `<polygon points="${leftPts}"  fill="${left}"/>`;
    svg += `<polygon points="${rightPts}" fill="${right}"/>`;
    svg += `<polygon points="${topPts}"   fill="${top}" opacity="0.97" stroke="rgba(15,12,41,.30)" stroke-width="1"/>`;
  }
  return svg;
}

const BASE_CSS = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { position:relative; background:${THEME.bg};
         font-family:"Segoe UI",system-ui,sans-serif; color:#E9D8FD; }
  .grid { position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(196,181,253,.055) 1px,transparent 1px),
      linear-gradient(90deg,rgba(196,181,253,.055) 1px,transparent 1px);
    background-size:64px 64px; }
  .glow { position:absolute;
    background:radial-gradient(circle,rgba(139,92,246,.42) 0%,transparent 68%); }
  .bar { position:absolute; left:0; right:0; bottom:0; height:7px;
    background:linear-gradient(90deg,#0F0C29,#8B5CF6 48%,#F0ABFC 74%,#0F0C29); }
  .eyebrow { letter-spacing:.42em; color:#C4B5FD; text-transform:uppercase;
             font-weight:600; }
  .rule { background:linear-gradient(90deg,#8B5CF6,#F0ABFC); border-radius:3px; }
`;

// ── Profile hero banner ────────────────────────────────────────────────
function heroHtml() {
  const skyline = isoSkyline("subashvs7-hero", {
    cols: 7, rows: 7, tw: 44, th: 22, ox: 300, oy: 96,
    maxH: 46, minH: 14, pad: 60,
  });

  return `<!doctype html>
<meta charset="utf-8"/>
<style>
  html, body { width:1280px; height:360px; overflow:hidden; }
  ${BASE_CSS}
  .glow { width:660px; height:660px; right:-130px; top:-210px; }
  .art { position:absolute; right:-10px; top:-6px; }
  .content { position:absolute; left:78px; top:0; height:360px; width:700px;
             display:flex; flex-direction:column; justify-content:center; }
  .eyebrow { font-size:17px; margin-bottom:14px; }
  h1 { font-size:82px; line-height:1; letter-spacing:.05em; font-weight:800;
       color:#FFFFFF; text-shadow:0 3px 34px rgba(139,92,246,.55); }
  .rule { width:120px; height:5px; margin:22px 0 20px; }
  p { font-size:22px; line-height:1.5; color:#CBD5E1; }
  .stack { margin-top:22px; font-family:Consolas,"Cascadia Mono",monospace;
           font-size:16px; color:#A78BFA; letter-spacing:.08em; }
</style>
<div class="grid"></div>
<div class="glow"></div>
<svg class="art" width="720" height="380" viewBox="0 0 720 380">${skyline}</svg>
<div class="content">
  <div class="eyebrow">Full-Stack Developer</div>
  <h1>SUBASH V</h1>
  <div class="rule"></div>
  <p>I build ERP, MES and SaaS platforms &mdash; config-driven<br/>systems where the schema defines the interface.</p>
  <div class="stack">REACT &nbsp;&middot;&nbsp; TYPESCRIPT &nbsp;&middot;&nbsp; LARAVEL &nbsp;&middot;&nbsp; MYSQL</div>
</div>
<div class="bar"></div>
`;
}

// ── Repo social preview cards ──────────────────────────────────────────
const REPOS = [
  {
    repo: "approval_project",
    title: "APPROVAL SYSTEM",
    tagline: "Enterprise approval engine \u2014 dynamic workflows, RBAC,\nnotifications and reporting on Laravel 12 + React 19.",
    tags: ["Laravel 12", "React 19", "MySQL"],
  },
  {
    repo: "task-management",
    title: "TASK MANAGEMENT",
    tagline: "Real-time Kanban \u2014 drag-and-drop boards, Redux state\nand live updates over WebSockets.",
    tags: ["TypeScript", "React", "Laravel"],
  },
];

function cardHtml({ repo, title, tagline, tags }) {
  const skyline = isoSkyline(repo);
  const tagHtml = tags.map(t => `<span class="tag">${t}</span>`).join("");
  const taglineHtml = tagline.split("\n").join("<br/>");
  // Long names would overflow the fixed 1280px card, so step the size down.
  const titleSize = title.length > 17 ? 58 : title.length > 13 ? 66 : 74;

  return `<!doctype html>
<meta charset="utf-8"/>
<style>
  html, body { width:1280px; height:640px; overflow:hidden; }
  ${BASE_CSS}
  .glow { width:760px; height:760px; right:-150px; top:-190px; }
  .art { position:absolute; right:-40px; top:22px; }
  .content { position:absolute; left:76px; top:0; height:640px; width:660px;
             display:flex; flex-direction:column; justify-content:center; }
  .eyebrow { font-size:19px; margin-bottom:22px; }
  h1 { font-size:${titleSize}px; line-height:1.04; letter-spacing:.028em;
       font-weight:800; color:#FFFFFF; text-shadow:0 3px 30px rgba(139,92,246,.55); }
  .rule { width:118px; height:5px; margin:26px 0 24px; }
  p { font-size:23px; line-height:1.52; color:#CBD5E1; max-width:620px; }
  .tags { margin-top:34px; display:flex; gap:12px; }
  .tag { font-size:17px; font-weight:600; letter-spacing:.05em;
         padding:10px 20px; border-radius:999px; color:#E9D8FD;
         background:rgba(139,92,246,.20);
         border:1px solid rgba(196,181,253,.42); }
  .foot { position:absolute; left:78px; bottom:44px;
          font-family:Consolas,"Cascadia Mono",monospace;
          font-size:18px; color:#8B7FB8; letter-spacing:.06em; }
</style>
<div class="grid"></div>
<div class="glow"></div>
<svg class="art" width="860" height="600" viewBox="0 0 860 600">${skyline}</svg>
<div class="content">
  <div class="eyebrow">Subash V</div>
  <h1>${title}</h1>
  <div class="rule"></div>
  <p>${taglineHtml}</p>
  <div class="tags">${tagHtml}</div>
</div>
<div class="foot">github.com/subashvs7/${repo}</div>
<div class="bar"></div>
`;
}

// ── Render ─────────────────────────────────────────────────────────────
function shoot(name, html, pngPath, w, h) {
  mkdirSync(dirname(pngPath), { recursive: true });
  const htmlPath = join(TMP, `${name}.html`);
  writeFileSync(htmlPath, html, "utf8");

  try {
    execFileSync(CHROME, [
      "--headless", "--disable-gpu", "--hide-scrollbars",
      "--force-device-scale-factor=1",
      `--window-size=${w},${h}`,
      `--screenshot=${pngPath}`,
      `file:///${htmlPath.replace(/\\/g, "/")}`,
    ], { stdio: "pipe", timeout: 60000 });

    const kb = (statSync(pngPath).size / 1024).toFixed(0);
    console.log(`  ok    ${name.padEnd(22)} ${kb} KB`);
    return true;
  } catch (e) {
    console.error(`  FAIL  ${name} - ${e.message.split("\n")[0]}`);
    return false;
  }
}

mkdirSync(TMP, { recursive: true });
let ok = 0, total = 0;

total++; if (shoot("hero", heroHtml(), join(OUT_ASSETS, "hero.png"), 1280, 360)) ok++;
for (const r of REPOS) {
  total++;
  if (shoot(r.repo, cardHtml(r), join(OUT_CARDS, `${r.repo}.png`), 1280, 640)) ok++;
}

rmSync(TMP, { recursive: true, force: true });

console.log(`\n${ok}/${total} images written.`);
console.log("  assets/hero.png          -> referenced by README.md");
console.log("  social-previews/*.png    -> upload at <repo>/settings -> Social preview");
