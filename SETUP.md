# Profile Setup

The README is now **projects-first**. Everything below is one-time.

---

## 1 · Why images kept breaking, and what replaced them

Measured directly, not guessed:

| Asset | Result | Outcome |
|---|---|---|
| `github-readme-stats.vercel.app` | `503` on 3/3 retries | Public instance exhausted — dropped |
| `github-profile-trophy.vercel.app` | `402 DEPLOYMENT_DISABLED` | Vercel disabled it — dropped |
| `github-readme-activity-graph.vercel.app` | `402 DEPLOYMENT_DISABLED` | Same — dropped |
| capsule-render `type=venom` | Renders a small blob; title overflows outside it | Replaced by `assets/hero.png` |
| Self-hosted metrics languages panel | Rendered **"PowerShell 100%"** | Removed — see §2 |
| shields.io, skillicons, capsule-render (`rect`/`waving`) | `200` | Kept |

A `402` is not transient — those apps are gone. The fix was to stop depending
on other people's servers: `assets/hero.png` and the social cards are generated
locally and committed here.

---

## 2 · Why there are no auto-generated stats

This is the part worth not undoing.

Your public account has **~2 public events**. Every activity visual — snake,
3D skyline, isocalendar, streak, habits — rendered as an empty grid. Five
sections all advertising the same emptiness, while your actual work (a 12-module
approval platform, a real-time Kanban, four client systems) went unmentioned
until halfway down the page.

The languages panel was worse. Without a PAT the action can only see *this*
repo, so it reported **"1 Language: PowerShell 100%"** — picked up from
`scripts/gen-social-previews.mjs`. Even with a PAT it counts public repos only,
and your main platforms are private, so the figure would still mislead.

So: no activity panels, no generated language chart. The README uses a curated
skillicons stack, which is accurate. `metrics.yml`, `snake.yml` and
`profile-3d.yml` are kept but set to `workflow_dispatch` only — dormant, not
deleted, with the reasoning in each file's header. Delete them (plus the
`output` branch and `profile-3d-contrib/`) if you'd rather.

**If public activity grows later:** add a `METRICS_TOKEN` secret (classic PAT,
scopes `public_repo` + `read:user`) at
<https://github.com/subashvs7/subashvs7/settings/secrets/actions>, restore the
`schedule`/`push` triggers, and re-add the `<img>` tags. Keep
`output_action: commit` — see §7.

---

## 3 · Finish the README

Four private projects carry inferred one-line summaries. **Correct them before
pushing** — they're marked in the source with `TODO(subash)`:

```bash
grep -n "TODO(subash)" README.md
```

- **Meenachi Express Cargo** — confirm summary
- **PSS Transport** — confirm summary
- **Proman** — confirm summary
- **SAS** — I could not read this repo at all; replace the line entirely

Also still literal:

- `https://linkedin.com/in/YOUR-LINKEDIN`

The Twitter badge was removed and email is set to `subash07070707@gmail.com`.

Then:

```bash
git add -A
git commit -m "redesign: projects-first profile, self-hosted hero"
git push
```

---

## 4 · Regenerating the images

```bash
node scripts/gen-social-previews.mjs
```

Renders via headless Chrome (auto-detected):

- `assets/hero.png` — 1280×360 profile banner, referenced by README.md
- `social-previews/approval_project.png` — 1280×640
- `social-previews/task-management.png` — 1280×640

Each isometric skyline is seeded from its own name, so images are unique but
stable across rebuilds. Edit the `REPOS` array and `heroHtml()` in
[`scripts/gen-social-previews.mjs`](scripts/gen-social-previews.mjs) to change
copy, or to add cards for more repos.

---

## 5 · Upload the social previews

**Manual — GitHub has no API for this field.** Per repo:

1. `https://github.com/subashvs7/<repo>/settings`
2. **Social preview** → **Edit** → **Upload an image**
3. Pick `social-previews/<repo>.png`

These show in link unfurls on LinkedIn, Slack, Discord, X and iMessage. They do
**not** appear in the Repositories tab.

---

## 6 · The Repositories tab

GitHub gives you **no styling control** over the Repositories, Projects,
Packages or Stars tabs — no CSS, no README hook, no injected HTML. You cannot
put the 3D skyline, or any image, on that list. Only these render: name,
description, topics, language, stars, forks, updated date, license.

Of your 15 public repos, **11 have no description and 0 have topics**. That is
why the tab looks bare. Fix it in one pass:

```powershell
winget install --id GitHub.cli
gh auth login                          # needs the "repo" scope

# Read and correct the descriptions first -- most are inferred guesses.
.\scripts\setup-repos.ps1 -WhatIf      # dry run
.\scripts\setup-repos.ps1              # apply
```

Archive dead repos (*Settings → Archive*) so they sort to the bottom.

### Pinned repositories

Profile → **Customize your pins**. Private repos can be pinned but are visible
only to you, so pin public ones. Lead with the flagship:

1. `approval_project` — the 12-module platform
2. `task-management` — TypeScript + real-time
3. `laravel-dashboard` — reusable foundation
4. `CRM-ZAZU` — business domain
5. `spicemart` — e-commerce breadth
6. `budgetapp` — complete small product

Run the script above first — a pinned repo with no description wastes the slot.

### Per-repo READMEs

`templates/REPO_README_TEMPLATE.md` matches the profile theme. Note that
`approval_project` already has an excellent README — leave it alone. Start with
`task-management`, whose README is currently just `# task-management`.

While you're there: `task-management` has a committed `backend.zip`. Build
artifacts don't belong in git — delete it and add it to `.gitignore`.

### Projects and Stars

**Projects** — an empty tab is worse than a hidden one. Build one real board
with a populated backlog, or leave it.

**Stars** — GitHub supports named **star lists**
(<https://github.com/subashvs7?tab=stars> → **Create list**), e.g.
`Laravel Ecosystem`, `React Patterns`. Almost nobody uses them, and it's the
only tab besides Overview where you write real copy.

**Packages** — only populates if you publish to npm/Composer/GHCR. Ignore it.

---

## 7 · Known trap: `output_action`

Recorded so it isn't reintroduced. The first `metrics.yml` run failed at the
commit step even though all five panels rendered. With `output_action: none`,
lowlighter/metrics writes the SVG to `/metrics_renders/` **inside its
container**, never to the workspace — so a follow-up `git add -A assets`
matches nothing and exits non-zero.

`output_action: commit` writes through the GitHub API instead. Never pair
`none` with a manual commit step. `output_condition: changed` prevents empty
commits.
