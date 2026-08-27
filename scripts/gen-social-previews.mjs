/**
 * gen-social-previews.mjs
 * ----------------------------------------------------------------------
 * Renders a 1280x640 social preview card per repo, matching the profile
 * theme, with a deterministic isometric voxel skyline unique to each repo.
 *
 * GitHub's social preview field takes PNG/JPG/GIF only (no SVG), max 1MB,
 * and has no API -- each card must be uploaded by hand under
 * <repo> -> Settings -> Social preview.
 *
 * Usage:
 *     node scripts/gen-social-previews.mjs
 *
 * Output: social-previews/<repo>.png
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, existsSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const OUT = resolve("social-previews");
const TMP = resolve("social-previews/.tmp");

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

// ── The six pinned repos ───────────────────────────────────────────────
const REPOS = [
  {
    repo: "task-management",
    title: "TASK MANAGEMENT",
    tagline: "Board-based task tracker \u2014 assignments, status transitions\nand filtering, fully typed end to end.",
    tags: ["TypeScript", "React", "Kanban"],
  },
  {
    repo: "laravel-dashboard",
    title: "LARAVEL DASHBOARD",
    tagline: "Reusable admin panel \u2014 charts, sortable data tables\nand role-based access control.",
    tags: ["Laravel", "Blade", "Charts"],
  },
  {
    repo: "CRM-ZAZU",
    title: "CRM ZAZU",
    tagline: "Lead pipeline, contact history and follow-up\nscheduling on a Laravel backend.",
    tags: ["PHP", "Laravel", "MySQL"],
  },
  {
    repo: "budgetapp",
    title: "BUDGET APP",
    tagline: "Personal finance tracker \u2014 category budgets,\ntransaction history and monthly rollups.",
    tags: ["Laravel", "Blade", "MySQL"],
  },
  {
    repo: "spicemart",
    title: "SPICEMART",
    tagline: "E-commerce storefront \u2014 catalogue, cart, checkout,\nplus an admin side for inventory and orders.",
    tags: ["Laravel", "PHP", "Blade"],
  },
  {
    repo: "react-reddit",
    title: "REACT REDDIT",
    tagline: "Reddit client on the public API \u2014 live feeds,\nsearch and client-side filtering with hooks.",
    tags: ["React", "JavaScript", "REST"],
  },
];

// ── Deterministic PRNG so each repo gets a stable, unique skyline ──────
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

/** Isometric voxel field: cols x rows cubes, height driven by the seed. */
function isoSkyline(seed, { cols = 8, rows = 8, tw = 46, th = 23 } = {}) {
  const rnd = seededRandom(seed);
  const ox = 300, oy = 150;
  const cubes = [];

  for (let gx = 0; gx < cols; gx++) {
    for (let gy = 0; gy < rows; gy++) {
      // Bias height toward the centre so it reads as a skyline, not noise.
      const dx = (gx - (cols - 1) / 2) / cols;
      const dy = (gy - (rows - 1) / 2) / rows;
      const falloff = 1 - Math.min(1, Math.sqrt(dx * dx + dy * dy) * 1.7);
      const h = Math.max(18, Math.round((rnd() * 58 + 12) * (0.4 + falloff)));
      cubes.push({ gx, gy, h, depth: gx + gy, t: rnd() });
    }
  }

  // Painter's algorithm: back to front.
  cubes.sort((a, b) => a.depth - b.depth);

  const lerp = (a, b, t) => Math.round(a + (b - a) * t);
  const mix = (c1, c2, t) =>
    `rgb(${lerp(c1[0], c2[0], t)},${lerp(c1[1], c2[1], t)},${lerp(c1[2], c2[2], t)})`;

  const VIOLET = [139, 92, 246];   // #8B5CF6
  const PINK   = [240, 171, 252];  // #F0ABFC
  const LILAC  = [196, 181, 253];  // #C4B5FD

  // Each column is extruded its own height PLUS a fixed pad. The pad makes
  // neighbours overlap so no background shows through (short columns alone
  // leave see-through gaps and the field reads as floating tiles), while
  // keeping the base stepped along the isometric diamond -- extruding to a
  // single shared floor instead merges everything into one flat wall.
  const PAD = 72;

  let svg = "";
  for (const { gx, gy, h, t } of cubes) {
    const cx = ox + (gx - gy) * (tw / 2);
    const cy = oy + (gx + gy) * (th / 2) - h;
    const drop = h + PAD;

    const top   = mix(LILAC, PINK, t);
    const left  = mix(VIOLET, [40, 30, 80], 0.45);
    const right = mix(VIOLET, [24, 18, 56], 0.65);

    const topPts   = `${cx},${cy} ${cx + tw / 2},${cy + th / 2} ${cx},${cy + th} ${cx - tw / 2},${cy + th / 2}`;
    const leftPts  = `${cx - tw / 2},${cy + th / 2} ${cx},${cy + th} ${cx},${cy + th + drop} ${cx - tw / 2},${cy + th / 2 + drop}`;
    const rightPts = `${cx + tw / 2},${cy + th / 2} ${cx},${cy + th} ${cx},${cy + th + drop} ${cx + tw / 2},${cy + th / 2 + drop}`;

    svg += `<polygon points="${leftPts}"  fill="${left}"/>`;
    svg += `<polygon points="${rightPts}" fill="${right}"/>`;
    svg += `<polygon points="${topPts}"   fill="${top}" opacity="0.97" stroke="rgba(15,12,41,.30)" stroke-width="1"/>`;
  }
  return svg;
}

function card({ repo, title, tagline, tags }) {
  const skyline = isoSkyline(repo);
  const tagHtml = tags
    .map(t => `<span class="tag">${t}</span>`)
    .join("");
  const taglineHtml = tagline.split("\n").join("<br/>");
  // Long names would overflow the fixed 1280px card, so step the size down.
  const titleSize = title.length > 17 ? 58 : title.length > 13 ? 66 : 74;

  return `<!doctype html>
<meta charset="utf-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:1280px; height:640px; overflow:hidden; }
  body {
    position:relative;
    background:linear-gradient(135deg,#0F0C29 0%,#302B63 52%,#24243E 100%);
    font-family:"Segoe UI",system-ui,sans-serif;
    color:#E9D8FD;
  }
  .grid {
    position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(196,181,253,.055) 1px,transparent 1px),
      linear-gradient(90deg,rgba(196,181,253,.055) 1px,transparent 1px);
    background-size:64px 64px;
  }
  .glow {
    position:absolute; width:760px; height:760px; right:-150px; top:-190px;
    background:radial-gradient(circle,rgba(139,92,246,.42) 0%,transparent 68%);
  }
  .art { position:absolute; right:-40px; top:22px; }
  .content { position:absolute; left:76px; top:0; height:640px; width:660px;
             display:flex; flex-direction:column; justify-content:center; }
  .eyebrow { font-size:19px; letter-spacing:.42em; color:#C4B5FD;
             text-transform:uppercase; margin-bottom:22px; font-weight:600; }
  h1 { font-size:${titleSize}px; line-height:1.04; letter-spacing:.028em;
       font-weight:800; color:#FFFFFF;
       text-shadow:0 3px 30px rgba(139,92,246,.55); }
  .rule { width:118px; height:5px; margin:26px 0 24px;
          background:linear-gradient(90deg,#8B5CF6,#F0ABFC); border-radius:3px; }
  p { font-size:23px; line-height:1.52; color:#CBD5E1; max-width:620px; }
  .tags { margin-top:34px; display:flex; gap:12px; }
  .tag { font-size:17px; font-weight:600; letter-spacing:.05em;
         padding:10px 20px; border-radius:999px; color:#E9D8FD;
         background:rgba(139,92,246,.20);
         border:1px solid rgba(196,181,253,.42); }
  .foot { position:absolute; left:78px; bottom:44px;
          font-family:Consolas,"Cascadia Mono",monospace;
          font-size:18px; color:#8B7FB8; letter-spacing:.06em; }
  .bar { position:absolute; left:0; right:0; bottom:0; height:7px;
         background:linear-gradient(90deg,#0F0C29,#8B5CF6 48%,#F0ABFC 74%,#0F0C29); }
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
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

let ok = 0;
for (const r of REPOS) {
  const html = join(TMP, `${r.repo}.html`);
  const png = join(OUT, `${r.repo}.png`);
  writeFileSync(html, card(r), "utf8");

  try {
    execFileSync(CHROME, [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--window-size=1280,640",
      `--screenshot=${png}`,
      `file:///${html.replace(/\\/g, "/")}`,
    ], { stdio: "pipe", timeout: 60000 });

    const kb = (statSync(png).size / 1024).toFixed(0);
    console.log(`  ok    ${r.repo.padEnd(20)} ${kb} KB`);
    ok++;
  } catch (e) {
    console.error(`  FAIL  ${r.repo} - ${e.message.split("\n")[0]}`);
  }
}

rmSync(TMP, { recursive: true, force: true });

console.log(`\n${ok}/${REPOS.length} cards written to social-previews/`);
console.log("Upload each at: https://github.com/subashvs7/<repo>/settings");
console.log("  -> Social preview -> Edit -> Upload an image");
