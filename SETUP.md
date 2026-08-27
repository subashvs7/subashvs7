# Profile Setup

Everything here is one-time. Once done, the profile maintains itself.

---

## 1 · Why the images were broken

Three of the render services the old README relied on are **dead**, not slow.
Measured directly:

| Asset | Result | Verdict |
|---|---|---|
| `github-readme-stats.vercel.app` | `503` on 3/3 retries | Public instance exhausted |
| `github-profile-trophy.vercel.app` | `402 DEPLOYMENT_DISABLED` | Vercel disabled the deployment |
| `github-readme-activity-graph.vercel.app` | `402 DEPLOYMENT_DISABLED` | Same |
| `./profile-3d-contrib/*.svg` | `404` | Folder never existed — see §3 |
| snake, capsule-render, typing-svg, skillicons, shields, komarev, streak-stats | `200` | Healthy, kept |

A `402` is not transient — those two apps are gone and will not come back.
So the fix isn't a different URL, it's **not depending on someone else's
server**. `.github/workflows/metrics.yml` now renders the same panels into
`./assets/` inside this repo, where GitHub serves them itself.

---

## 2 · Create `METRICS_TOKEN` *(recommended, 2 minutes)*

The metrics workflow falls back to the built-in `GITHUB_TOKEN`, but that token
can't see private-repo contributions or cross-repo language data — panels will
render thin. To get the full picture:

1. <https://github.com/settings/tokens> → **Generate new token (classic)**
2. Name it `METRICS_TOKEN`, expiry **No expiration**
3. Scopes: **`public_repo`** and **`read:user`**
   *(add **`repo`** if you want private contributions counted)*
4. Copy the token
5. Go to <https://github.com/subashvs7/subashvs7/settings/secrets/actions>
   → **New repository secret** → name `METRICS_TOKEN`, paste the value

---

## 3 · Push, then run the workflows once

```bash
git add -A
git commit -m "fix: self-host profile panels; redesign README"
git push
```

`metrics.yml`, `profile-3d.yml` and `snake.yml` all now trigger on push, so
they start immediately. Watch them at
<https://github.com/subashvs7/subashvs7/actions>.

> **Expect ~3 minutes of broken images right after the push.** The README
> references `./assets/*.svg` and `./profile-3d-contrib/*.svg` before the
> workflows have created them. Once the runs go green, refresh your profile.

`profile-3d.yml` previously had **only** a `schedule:` trigger, which is why it
had never executed and the skyline image 404'd. It now has `push` and
`workflow_dispatch` too.

**If a run fails**, open it and check:
- `metrics.yml` — usually a bad/missing `METRICS_TOKEN`. Plugin errors are
  non-fatal (`plugins_errors_fatal: no`), so partial output still commits.
- `snake.yml` — needs the `output` branch, which already exists here.

---

## 4 · The Repositories tab

GitHub gives you **no styling control** over the Repositories, Projects,
Packages or Stars tabs. There is no CSS, no custom layout. What you control is
the content, and right now yours is empty — of 15 public repos, **11 have no
description and 0 have topics**. That is the entire reason the tab looks bare.

Fix it in one shot:

```powershell
winget install --id GitHub.cli
gh auth login                          # needs the "repo" scope

# Read and correct the descriptions first — they are inferred guesses.
.\scripts\setup-repos.ps1 -WhatIf      # dry run, prints what it would set
.\scripts\setup-repos.ps1              # apply
```

Then, per repo, the three things that actually change how the tab reads:

- **Description** — shown inline in the list. Non-negotiable.
- **Topics** — render as pills under each repo. 4–6 each.
- **Social preview image** — repo *Settings → Social preview*, 1280×640.
  This is what shows when the repo is shared anywhere.

Archive dead repos (*Settings → Archive*) so they sort to the bottom instead of
padding the list.

---

## 5 · Pinned repositories

The strongest lever on the Overview tab. Profile → **Customize your pins**.

Pin exactly six, ordered by what you want judged first:

1. `task-management` — the TypeScript one
2. `laravel-dashboard` — reusable foundation
3. `CRM-ZAZU` — real business domain
4. `budgetapp` — complete small product
5. `spicemart` — e-commerce breadth
6. `react-reddit` — API consumption

A pinned repo with no description is a wasted slot, so run §4 first.

---

## 6 · Per-repo READMEs

`templates/REPO_README_TEMPLATE.md` is a designed README matching the profile
theme — hero banner, stack icons, live shields, features table, setup steps.

Copy it into each pinned repo, replace `{{REPO}}`, `{{TITLE}}`, `{{TAGLINE}}`
and `{{ICONS}}`, and add real screenshots under `docs/`. Start with the six
pinned ones; the rest can wait.

---

## 7 · Projects and Stars tabs

**Projects** — an empty tab is worse than a hidden one. Either build one real
board (<https://github.com/users/subashvs7/projects>) with a description and a
populated backlog, or leave the tab alone. A single well-run board reads better
than four abandoned ones.

**Stars** — GitHub supports **star lists**: named, described collections. Go to
<https://github.com/subashvs7?tab=stars> → **Create list**. Something like
`Laravel Ecosystem`, `React Patterns`, `DevOps & CI`. This is the only tab
besides Overview where you get to write real copy, and almost nobody uses it.

**Packages** — only populates if you publish to npm/Composer/GHCR. Nothing to
design until then; ignore it.

---

## 8 · Fill in the placeholders

Still literal `YOUR-*` values in `README.md`:

- `https://linkedin.com/in/YOUR-LINKEDIN`
- `https://twitter.com/YOUR-HANDLE`

The email is already set to `subash07070707@gmail.com`. Delete the Twitter
badge entirely if you don't use it — a dead link costs more than a missing one.
