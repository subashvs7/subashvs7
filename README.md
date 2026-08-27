<!-- ══════════════════════════════════════════════════════════════ -->
<!--   S U B A S H   V   ·   GitHub Profile README                  -->
<!--                                                                -->
<!--   Structure is projects-first by design. Contribution visuals   -->
<!--   (snake / 3D skyline / streak / isocalendar / habits) were     -->
<!--   removed: the public account has ~2 public events, so they     -->
<!--   rendered as empty grids and undersold the actual work.        -->
<!--                                                                -->
<!--   assets/hero.png is generated locally by                       -->
<!--   scripts/gen-social-previews.mjs -- it replaces capsule-render -->
<!--   "venom", which drew a small blob and let the title overflow.  -->
<!--                                                                -->
<!--   Table cells use raw HTML on purpose: markdown inside <td>     -->
<!--   renders inconsistently on GitHub.                             -->
<!-- ══════════════════════════════════════════════════════════════ -->

<div align="center">

<img width="100%" src="./assets/hero.png" alt="Subash V — Full-Stack Developer building ERP, MES and SaaS platforms" />

<br/><br/>

<img src="https://img.shields.io/badge/FOCUS-ERP%20%C2%B7%20MES%20%C2%B7%20SaaS-8B5CF6?style=for-the-badge&labelColor=0F0C29" alt="Focus: ERP, MES, SaaS" />
&nbsp;
<img src="https://img.shields.io/badge/STACK-LARAVEL%20%2B%20REACT-C4B5FD?style=for-the-badge&labelColor=0F0C29" alt="Stack: Laravel + React" />
&nbsp;
<img src="https://img.shields.io/badge/BASED%20IN-INDIA-8B5CF6?style=for-the-badge&labelColor=0F0C29" alt="Based in India" />
&nbsp;
<img src="https://img.shields.io/badge/OPEN%20TO-WORK-22C55E?style=for-the-badge&labelColor=0F0C29" alt="Open to work" />

</div>

<br/>

<!-- ══════════════════════════════════════════════════════════════ -->
<!--                          POSITIONING                           -->
<!-- ══════════════════════════════════════════════════════════════ -->

<table>
<tr>
<td width="58%" valign="top">

<h3>&nbsp;◆&nbsp; What I do</h3>

<p>
I build <b>internal business platforms</b> — approval systems, transport and
cargo operations, project and task management. The kind of software where the
hard part isn't the UI, it's modelling an organisation's rules without
hard-coding them.
</p>

<p>
My work is <b>config-driven</b>: approval chains, org hierarchies and permission
matrices live in the database as rows, not in the codebase as
<code>if</code> statements. Adding a new workflow is a configuration change,
not a deployment.
</p>

<ul>
<li>🏗️ &nbsp;<b>Laravel</b> APIs and <b>React / TypeScript</b> front-ends</li>
<li>🧩 &nbsp;Reusable CRUD engines over hand-written screens</li>
<li>🗄️ &nbsp;From <b>MySQL schema design</b> to pixel polish</li>
<li>🚀 &nbsp;Ships to plain shared hosting — no Docker or queues required</li>
</ul>

</td>
<td width="42%" valign="top">

<img width="100%" src="https://user-images.githubusercontent.com/74038190/229223263-cf2e4b07-2615-4f87-9c38-e37600f8381a.gif" alt="Developer at work" />

</td>
</tr>
</table>

<div align="center">
<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:0F0C29,50:8B5CF6,100:0F0C29&height=3&section=header" alt="" />
</div>

<br/>

<!-- ══════════════════════════════════════════════════════════════ -->
<!--                        FEATURED WORK                           -->
<!-- ══════════════════════════════════════════════════════════════ -->

<div align="center">
<h2>◆ &nbsp;F E A T U R E D &nbsp; W O R K&nbsp; ◆</h2>
</div>

<br/>

<!-- ─────────────  FLAGSHIP  ───────────── -->

<table>
<tr>
<td valign="top">

<h3>🏛️ &nbsp;<a href="https://github.com/subashvs7/approval_project">Enterprise Approval Management System</a> &nbsp;<img src="https://img.shields.io/badge/FLAGSHIP-8B5CF6?style=flat-square&labelColor=0F0C29" alt="Flagship" /></h3>

<p>
A fully database-driven approval platform. Approval categories, types,
workflows and ordered approver steps are all configured at runtime — the engine
reads them, so a new approval chain needs no code change.
</p>

<p>
<b>Request lifecycle:</b> submit · approve · reject · return · forward ·
delegate · cancel · clone, each writing to an auditable timeline.<br/>
<b>Also ships:</b> RBAC with a permission matrix, org hierarchy
(company → branch → department → designation → employee), multi-upload
attachments on private storage with streamed download, role-based dashboards
with dependency-free charts, DB-templated in-app and email notifications, and
reports with group-by dimensions plus CSV/PDF export.
</p>

<p>
<code>Laravel 12</code> <code>PHP 8.3</code> <code>MySQL 8</code>
<code>Sanctum</code> <code>React 19</code> <code>Vite</code>
<code>React Router</code> <code>Bootstrap 5</code>
</p>

<p>
<img src="https://img.shields.io/github/languages/top/subashvs7/approval_project?style=flat-square&color=8B5CF6&labelColor=0F0C29" alt="" />
<img src="https://img.shields.io/github/last-commit/subashvs7/approval_project?style=flat-square&color=C4B5FD&labelColor=0F0C29" alt="" />
<img src="https://img.shields.io/badge/modules-12%20complete%20%26%20verified-22C55E?style=flat-square&labelColor=0F0C29" alt="12 modules complete and verified" />
</p>

</td>
</tr>
</table>

<br/>

<!-- ─────────────  PUBLIC + PRIVATE GRID  ───────────── -->

<table>
<tr>
<td width="50%" valign="top">
<h3>🗂️ &nbsp;<a href="https://github.com/subashvs7/task-management">Task Management</a></h3>
<p>
Real-time Kanban. Drag-and-drop boards built on <code>@dnd-kit</code>, global
state in Redux Toolkit, and live multi-user updates pushed over WebSockets via
Laravel Echo and Pusher.
</p>
<p><code>TypeScript</code> <code>React</code> <code>Redux Toolkit</code> <code>Tailwind</code> <code>Laravel</code></p>
<p>
<img src="https://img.shields.io/github/languages/top/subashvs7/task-management?style=flat-square&color=8B5CF6&labelColor=0F0C29" alt="" />
<img src="https://img.shields.io/github/last-commit/subashvs7/task-management?style=flat-square&color=C4B5FD&labelColor=0F0C29" alt="" />
</p>
</td>
<td width="50%" valign="top">
<h3>📦 &nbsp;Meenachi Express Cargo &nbsp;<img src="https://img.shields.io/badge/PRIVATE-24243E?style=flat-square&labelColor=0F0C29" alt="Private" /></h3>
<!-- TODO(subash): confirm this summary and the stack before publishing. -->
<p>
Cargo booking and consignment platform — shipment entry, tracking through
delivery, and branch-level operational reporting.
</p>
<p><i>Private · client work — walkthrough available on request.</i></p>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h3>🚚 &nbsp;PSS Transport &nbsp;<img src="https://img.shields.io/badge/PRIVATE-24243E?style=flat-square&labelColor=0F0C29" alt="Private" /></h3>
<!-- TODO(subash): confirm this summary and the stack before publishing. -->
<p>
Transport operations system — trip and fleet records, consignment handling and
the billing trail that follows them.
</p>
<p><i>Private · client work — walkthrough available on request.</i></p>
</td>
<td width="50%" valign="top">
<h3>📊 &nbsp;Proman &nbsp;<img src="https://img.shields.io/badge/PRIVATE-24243E?style=flat-square&labelColor=0F0C29" alt="Private" /></h3>
<!-- TODO(subash): confirm this summary and the stack before publishing. -->
<p>
Project management platform — projects, milestones and team assignment with
progress tracking across delivery stages.
</p>
<p><i>Private · client work — walkthrough available on request.</i></p>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h3>🧭 &nbsp;SAS &nbsp;<img src="https://img.shields.io/badge/PRIVATE-24243E?style=flat-square&labelColor=0F0C29" alt="Private" /></h3>
<!-- TODO(subash): I could not read this repo. Replace this line entirely. -->
<p>
Business operations platform built on the same config-driven foundation.
</p>
<p><i>Private · client work — walkthrough available on request.</i></p>
</td>
<td width="50%" valign="top">
<h3>🧰 &nbsp;<a href="https://github.com/subashvs7?tab=repositories">More work</a></h3>
<p>
Laravel admin dashboards, a CRM, e-commerce builds and API clients — the
smaller repos where individual patterns were worked out before landing in the
platforms above.
</p>
<p>
<a href="https://github.com/subashvs7?tab=repositories">
<img src="https://img.shields.io/badge/BROWSE%20ALL%20REPOS-8B5CF6?style=flat-square&labelColor=0F0C29&logo=github&logoColor=white" alt="Browse all repositories" /></a>
</p>
</td>
</tr>
</table>

<div align="center">
<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:0F0C29,50:8B5CF6,100:0F0C29&height=3&section=header" alt="" />
</div>

<br/>

<!-- ══════════════════════════════════════════════════════════════ -->
<!--                          HOW I BUILD                           -->
<!--   Concrete patterns, taken from the approval_project codebase.  -->
<!-- ══════════════════════════════════════════════════════════════ -->

<div align="center">
<h2>◆ &nbsp;H O W &nbsp; I &nbsp; B U I L D&nbsp; ◆</h2>
<i>Decisions I make once, then reuse across every module.</i>
</div>

<br/>

<table>
<tr>
<td width="50%" valign="top">
<h4>◇ &nbsp;One data standard, every table</h4>
<p>
Every business table carries <code>status</code>, <code>is_deleted</code>,
<code>created_by</code>, <code>updated_by</code> and timestamps. Nothing is
ever physically deleted — a global scope filters soft-deleted rows out of every
query automatically, so no feature can forget to.
</p>
</td>
<td width="50%" valign="top">
<h4>◇ &nbsp;One API envelope</h4>
<p>
Every endpoint answers with the same shape —
<code>{ success, message, data, meta }</code> — and errors carry proper status
codes (401 / 403 / 404 / 422 / 429 / 500). The front-end has exactly one
response contract to handle.
</p>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h4>◇ &nbsp;Config over code</h4>
<p>
Approval chains, roles and org hierarchies are rows in the database, not
branches in the source. New workflows are configured by an admin at runtime
rather than shipped in a release.
</p>
</td>
<td width="50%" valign="top">
<h4>◇ &nbsp;Deployable anywhere</h4>
<p>
Targets plain Apache shared hosting — no Docker, Redis, queues or websocket
servers required to run the core product. Constraints picked deliberately, so
clients can host it themselves.
</p>
</td>
</tr>
</table>

<div align="center">
<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:0F0C29,50:8B5CF6,100:0F0C29&height=3&section=header" alt="" />
</div>

<br/>

<!-- ══════════════════════════════════════════════════════════════ -->
<!--                          TECH STACK                            -->
<!-- ══════════════════════════════════════════════════════════════ -->

<div align="center">

<h2>◆ &nbsp;T E C H &nbsp; S T A C K&nbsp; ◆</h2>

<table>
<tr>
<td align="center" width="33%">
<b>Frontend</b><br/><br/>
<img src="https://skillicons.dev/icons?i=react,ts,js,tailwind&theme=dark" alt="React, TypeScript, JavaScript, Tailwind" /><br/>
<img src="https://skillicons.dev/icons?i=redux,vite,html,css&theme=dark" alt="Redux, Vite, HTML, CSS" />
</td>
<td align="center" width="33%">
<b>Backend &amp; Data</b><br/><br/>
<img src="https://skillicons.dev/icons?i=laravel,php,nodejs&theme=dark" alt="Laravel, PHP, Node.js" /><br/>
<img src="https://skillicons.dev/icons?i=mysql,redis,sqlite&theme=dark" alt="MySQL, Redis, SQLite" />
</td>
<td align="center" width="33%">
<b>Tooling</b><br/><br/>
<img src="https://skillicons.dev/icons?i=git,github,docker,linux&theme=dark" alt="Git, GitHub, Docker, Linux" /><br/>
<img src="https://skillicons.dev/icons?i=vscode,postman,nginx&theme=dark" alt="VS Code, Postman, Nginx" />
</td>
</tr>
</table>

<br/>

<!-- No auto-generated "most used languages" panel here on purpose.        -->
<!-- It reads only PUBLIC repos, and the platforms above are private, so   -->
<!-- it reported "PowerShell 100%" (from a helper script in this repo) --  -->
<!-- actively wrong. The curated icons above are accurate; keep it manual. -->

<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:0F0C29,50:8B5CF6,100:0F0C29&height=3&section=header" alt="" />

</div>

<br/>

<!-- ══════════════════════════════════════════════════════════════ -->
<!--                           CONTACT                              -->
<!-- ══════════════════════════════════════════════════════════════ -->

<div align="center">

<h2>◆ &nbsp;L E T ' S &nbsp; T A L K&nbsp; ◆</h2>

<p><i>Open to full-stack roles and freelance platform work.</i></p>

<a href="https://linkedin.com/in/YOUR-LINKEDIN">
<img src="https://img.shields.io/badge/LinkedIn-0F0C29?style=for-the-badge&logo=linkedin&logoColor=0A66C2" alt="LinkedIn" /></a>
&nbsp;
<a href="mailto:subash07070707@gmail.com">
<img src="https://img.shields.io/badge/Email-0F0C29?style=for-the-badge&logo=gmail&logoColor=EA4335" alt="Email" /></a>
&nbsp;
<a href="https://github.com/subashvs7">
<img src="https://img.shields.io/badge/GitHub-0F0C29?style=for-the-badge&logo=github&logoColor=FFFFFF" alt="GitHub" /></a>

<br/><br/>

<i>"Make it work. Make it right. Make it fast."</i>

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:24243E,50:302B63,100:0F0C29&height=140&section=footer" alt="" />

</div>
