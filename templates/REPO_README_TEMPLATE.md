<!-- ══════════════════════════════════════════════════════════════ -->
<!--  Per-repo README template — matches the profile theme.         -->
<!--  Replace: {{REPO}} {{TITLE}} {{TAGLINE}} {{ICONS}}             -->
<!--  Drop this in each project repo so the Repositories tab has    -->
<!--  something worth clicking into.                                -->
<!-- ══════════════════════════════════════════════════════════════ -->

<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=venom&color=0:0F0C29,40:302B63,100:24243E&height=200&section=header&text={{TITLE}}&fontSize=52&fontColor=E9D8FD&fontAlignY=38&desc={{TAGLINE}}&descAlignY=60&descSize=14&animation=fadeIn" alt="{{TITLE}}" />

<!-- Icon slugs: https://skillicons.dev  e.g. i=laravel,php,mysql -->
<img src="https://skillicons.dev/icons?i={{ICONS}}&theme=dark" alt="Tech stack" />

<br/><br/>

<img src="https://img.shields.io/github/languages/top/subashvs7/{{REPO}}?style=for-the-badge&color=8B5CF6&labelColor=0F0C29" alt="Top language" />
<img src="https://img.shields.io/github/languages/code-size/subashvs7/{{REPO}}?style=for-the-badge&color=C4B5FD&labelColor=0F0C29" alt="Code size" />
<img src="https://img.shields.io/github/last-commit/subashvs7/{{REPO}}?style=for-the-badge&color=F0ABFC&labelColor=0F0C29" alt="Last commit" />
<img src="https://img.shields.io/github/license/subashvs7/{{REPO}}?style=for-the-badge&color=22C55E&labelColor=0F0C29" alt="License" />

</div>

<br/>

## ◆ &nbsp;Overview

One paragraph: what this does, who it's for, and the one thing that makes it
interesting. Lead with the problem it solves, not the framework it uses.

<br/>

## ◆ &nbsp;Features

| | Feature | Notes |
|:--:|---|---|
| 🔐 | Authentication | Session-based, role-aware |
| 📊 | Dashboard | Charts and sortable tables |
| 🔎 | Search &amp; filter | Server-side, paginated |
| 📦 | Export | CSV / PDF output |

<br/>

## ◆ &nbsp;Screenshots

<div align="center">

<!-- Commit real screenshots to docs/ — they double as the social preview. -->
<img width="80%" src="./docs/screenshot-dashboard.png" alt="Dashboard" />

</div>

<br/>

## ◆ &nbsp;Tech Stack

**Frontend** — {{...}}
**Backend** — {{...}}
**Database** — {{...}}

<br/>

## ◆ &nbsp;Getting Started

```bash
git clone https://github.com/subashvs7/{{REPO}}.git
cd {{REPO}}

composer install        # or: npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Open <http://localhost:8000>.

<br/>

## ◆ &nbsp;Configuration

| Variable | Default | Purpose |
|---|---|---|
| `DB_DATABASE` | — | MySQL schema name |
| `APP_URL` | `http://localhost` | Base URL for generated links |

<br/>

## ◆ &nbsp;Roadmap

- [ ] Item one
- [ ] Item two
- [x] Item already shipped

<br/>

## ◆ &nbsp;License

MIT © [Subash V](https://github.com/subashvs7)

<div align="center">
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:24243E,50:302B63,100:0F0C29&height=120&section=footer" alt="" />
</div>
