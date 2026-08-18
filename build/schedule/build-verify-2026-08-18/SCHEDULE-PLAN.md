# SCHEDULE build-verification — SCOPING PLAN (2026-08-18)

> Read-only scoping pass. Sets up the Schedule (epic **SV-8685**, PO **Branko Cicovic**) build-verify
> that follows the just-completed Report Suite build-verify. Treatment for not-yet-complete features =
> **Standing Rule 69 / skill `03-RUN-CHECK.md` §7** (live observation over Jira story status;
> feature-not-found → keep the `AUTOMATION: Not available on Build to test Yet` marker + the
> under-development line + a `DEFERRED-RUN.md` row).
>
> **0 TestRail writes · 0 Jira writes** this pass. All figures read live. No cookie/token/secret is
> recorded here (repo is PUBLIC — core §10).

---

## 1. SESSION — which cookie is alive

| Cookie source | `GET /api/staff/my-workplaces` | Verdict |
|---|---|---|
| `/tmp/staging-cookie.txt` (header form) | **HTTP 200** | **ALIVE — primary** |
| `/tmp/cln/cookies.json` (json form) | **HTTP 200** | **ALIVE — backup** |

Both target `.staging.shopview.com` and authenticate. `GET /api/auth/me/fe-permissions` → **HTTP 200,
42 permissions, `view_mode: full`**, and the three Schedule permission atoms are present live:
**`scheduleView` · `scheduleCreateAndEdit` · `scheduleDelete`**. Org = **`d55bc308`** (the shared
staging org). Read at **2026-08-18T23:45–23:52Z**.

## 2. BUILD — marker under test

| Field | Value |
|---|---|
| App | `app.staging.shopview.com` / `api.staging.shopview.com` |
| **`<meta name="app-version">`** | **`v3.8-bd246fd`** |
| `last-modified` | **Tue, 18 Aug 2026 19:57:31 GMT** |
| `etag` | `c4dd352f91ecfee192844c6a04a643fc` |
| read at (UTC) | 2026-08-18T23:45:56Z |

This is the **end-of-Report-Suite-pass redeploy** (`v3.8-2bf8d14` → `v3.8-bd246fd`, 19:57:31 GMT). It
is the build the Schedule batches run against unless it moves again — **re-read at each batch start**.

### Schedule module renders? — API-route level YES; UI render BLOCKED this pass (see §7 / OUTSTANDING)

The `/schedule` route loads (no redirect on the API side), and the Schedule module is **built
server-side** — proven live on `v3.8-bd246fd`, workplace **Staging Heavy Duty - 9919**
(`b3c8c820…`, the standing default):

| Endpoint | Result | Means |
|---|---|---|
| `GET /api/schedule/board?from=…Z&to=…Z` | **200** — `{range, resources, shifts, events, series, capacity}` | Grid + shifts + events + series + capacity all serve |
| `GET /api/schedule/work-orders` | **200** — 100 work orders + `pagination` + `facetCounts` | Sidebar WO list + filters built |
| `GET /api/schedule/color-labels` | **200** — 7 labels | Color system built |
| `POST /api/schedule/shifts`, `/events` | route exists (405 on GET) | Create/edit routes present |
| `GET /api/schedule/board` (no params) | 400 `from/to Missing required parameter` (UTC ISO instants) | Route present; param contract known |

**⚠️ The SPA UI could not be rendered this scoping pass.** With the raw session cookies alone the SPA
redirects to `/login` (it needs `localStorage.user` + `token`, which normally come from the dev
`quick-login` response — there is no `/api/auth/me`-style endpoint; `/api/me`, `/api/users/me`,
`/api/auth/user`, `/api/auth/session` all 404). **quick-login was deliberately NOT used** (the pass
instruction forbade it; sibling-worker safety). So per-control UI PRESENT/ABSENT is deferred to the
batches — see the OUTSTANDING decision at the end.

## 3. SPEC CURRENCY (Rule 31) — **CURRENT**

| Source | Live | Our baseline | Verdict |
|---|---|---|---|
| Confluence page **713031682** "Schedule" | **version 30** (REST `version.number`), `when=2026-08-13T22:48:26Z` by Branko, msg *"Restore Business hours labelling"* | `build/schedule/requirements.md` = **Confluence version 30** (ingested 2026-08-17, Fabian-review pass) | **CURRENT — v30 = v30** |

**Trap avoided (Rule 31(a)):** the page **body** now shows `Version | 1.1` / `Last Updated August 7,
2026`, and the MCP viewer shows `lastModified Aug 14, 2026`. **These are the documented lie** — Branko
does not keep the in-body header truthful. The reliable marker is the REST `version.number` = **30**,
which equals our baseline. **No spec delta; no currency pass owed.** The live spec is the new
"Technician Scheduling Module" (15 §-stories + the v29 "Schedule V2" additions), matching our v30
requirements.md exactly.

## 4. EPIC — SV-8685

- **SV-8685** "Schedule — Technician Scheduling Module", type **Epic**, status **Open**, updated
  2026-08-12, assignee **Branko Cicovic** (PO).
- **39 direct children** (JQL `parent = SV-8685`). Story set = the original **SV-8686…SV-8700** (15)
  + the **SV-9231…SV-9244** "Schedule V2" stories (14) + ~10 tasks/bugs.
- Story statuses range **Open / TESTING QA / QA Complete** (e.g. SV-8686 = TESTING QA; SV-8687–8690 =
  QA Complete). **Per skill §7.1 build-verify does NOT gate on story status** — live observation is the
  arbiter. Recorded, not a gate.
- The epic description's 15-story list and Included/Deferred scope match the live spec.

## 5. CASE SCOPE (Rule 38) — TestRail group **4254** "Schedule - 2026"

| Metric | Value |
|---|---|
| **Total cases under 4254** | **195** |
| **Ours (`created_by = 3`)** | **195** |
| **Foreign (not id 3)** | **0** |
| Sections (leaf, with cases) | 29 |
| `custom_atmstatus`: **1 Not Automated** | 170 |
| `custom_atmstatus`: **4 Pending** | 20 |
| **`custom_atmstatus`: 3 Automated** | **5** |

**The 5 Automated cases (Rule 71 — ask-first, HELD, hand to Vlad):** all flagged by **user 1
(Vladimir Tomovic)** per `get_history_for_case`, so they are genuinely his automation contract:
- **C43811** (Reassignment and Context Menu, §4275) — Vlad set `1→3`.
- **C38847 · C38848 · C38849 · C38850** (Working Hours Settings, §5405) — set `3→1` by us on
  2026-08-11 then **re-flagged `1→3` by Vlad**.

Batches **do NOT edit these five** on a documents-only basis: verify live, record the intended change,
**ask the QA lead first**, and edit only **coupled with build-verification** in the same pass, then
hand the case number to Vlad via `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`
(skill §6.4).

### Section → case map (29 sections, 195 cases)

| Section id | Name | # | Automated (atm3) | Pending (atm4) |
|---|---|---|---|---|
| 4255 | Navigation and Layout | 7 | — | 4 |
| 4256 | Sidebar - Mini Calendar | 4 | — | 1 |
| 4257 | Sidebar - Work Order List and Search | 7 | — | 3 |
| 4258 | Sidebar - Work Order Filters | 6 | — | 2 |
| 4259 | Sidebar - Line Drill-Down | 6 | — | 5 |
| 4260 | Drag-and-Drop Scheduling | 11 | — | — |
| 4261 | Scope Picker | 4 | — | — |
| 4262 | Shift Start Times and Unassigned Shifts | 11 | — | — |
| 4263 | Multi-Day Spread Scheduling | 14 | — | — |
| 4264 | Linked Series and Banners | 4 | — | — |
| 4265 | Shift Block Anatomy | 3 | — | — |
| 4266 | Overlap and Lane Stacking | 4 | — | — |
| 4267 | Day View Timeline | 7 | — | — |
| 4268 | Shift Detail Modal | 10 | — | — |
| 4269 | Events | 7 | — | — |
| 4270 | Conflict Detection | 7 | — | — |
| 4271 | Capacity Bars | 5 | — | — |
| 4272 | Hover Tooltips | 5 | — | — |
| 4273 | Grid Toolbar | 8 | — | 2 |
| 4274 | Filter and Display and View Options | 8 | — | 3 |
| 4275 | Reassignment and Context Menu | 5 | **C43811** | — |
| 4276 | Deletion, Series Scopes and Undo | 9 | — | — |
| 4277 | Keyboard Interactions | 3 | — | — |
| 4278 | Color System | 3 | — | — |
| 4279 | Permissions | 13 | — | — |
| 4280 | Edge Cases and Responsiveness | 10 | — | — |
| 5405 | Working Hours Settings | 5 | **C38847-38850** | — |
| 5408 | Cross-Module and Rewrite Regression | 5 | — | — |
| 5409 | API — Schedule | 4 | — | — |

Per-section C-id lists are in `/tmp/sched_sections.json` (regenerate read-only from `tr_client`).

## 6. AREA SURVEY — PRESENT / ABSENT / PARTIAL (API-route level; UI deferred)

**Honesty (Rule 12 / skill §2):** this survey is at the **server-route level** — the live evidence
above. It is strong evidence a feature exists in the build, **but it is NOT a UI walk**; the per-control
PRESENT/ABSENT (labels, modals, drag handles, menus, the removed click-to-arm, etc.) is what the
batches establish live, and a "not found" verdict on any control must come from a probe that *could*
fire (skill §2). No feature is marked ABSENT here — nothing was observed absent.

| Feature area | Verdict (route level) | Live evidence |
|---|---|---|
| Schedule nav + grid (Day/Week/Month) | **PRESENT** | `board` 200 → `range/resources/shifts/events/series/capacity` |
| WO sidebar (list + search + filters + drill-down) | **PRESENT** | `work-orders` 200 → 100 WOs + `facetCounts` |
| Shifts (create/edit) | **PRESENT** | `shifts` route exists (405 GET); `board.shifts` serves |
| Events | **PRESENT** | `events` route exists (405 GET); `board.events` serves |
| Linked series | **PRESENT** | `board.series` present |
| Capacity | **PRESENT** | `board.capacity` present |
| Color system | **PRESENT** | `color-labels` 200 → 7 labels |
| Working-hours / business-hours settings | **PARTIAL — UNCONFIRMED** | org `settings` 200; per-day hours editors not route-probed — **batch C confirms live** |
| Scope picker · spread · conflict pill · tooltips · reassignment · deletion scopes · keyboard · panel collapse · mobile | **PARTIAL — UNCONFIRMED (UI-only)** | not visible at route level — **batches confirm live in the UI** |
| Permission tiers (View/Edit/Delete) | **PRESENT (atoms) — UI gating UNCONFIRMED** | fe-permissions carries all three atoms; per-role UI gating needs a 2nd sign-in (likely DEFERRED) |

## 7. PROPOSED BATCH SPLIT — 3 sequential build-verify batches (195 cases)

Balanced ~65 cases each, grouped so each worker owns a coherent feature cluster. Each batch follows
skill `03-RUN-CHECK.md` end-to-end (five runnability checks; cosmetic-vs-substantive; Rule-69 deferred
treatment for any feature not found live; `DEFERRED-RUN.md` + `FOR-VLAD.md` appends; provenance
sentence-2 re-stamp on `v3.8-bd246fd`).

### Batch A — Navigation · Sidebar · Toolbar · Read-display (61 cases)
Foundation, mostly view/read/filter — the areas already route-confirmed PRESENT. Contains most of the
20 Pending cases.
- 4255 Navigation and Layout (7) · 4256 Mini Calendar (4) · 4257 WO List & Search (7) ·
  4258 WO Filters (6) · 4259 Line Drill-Down (6) · 4273 Grid Toolbar (8) ·
  4274 Filter and Display & View Options (8) · 4267 Day View Timeline (7) · 4272 Hover Tooltips (5) ·
  4278 Color System (3)

### Batch B — Scheduling core: create/scope/spread/shift (66 cases)
The drag-and-drop and shift-creation interactions. **Highest harness risk** — drag may not complete
via tooling and the **click-to-arm alternative was removed in a prior build (SV-8957 / C29962
regression, skill §6.3)**; the batch worker must confirm the arm control live and use §G9 destructive-
click discipline for delete/undo. Contains **C43811 (Automated — HELD, ask-first)**.
- 4260 Drag-and-Drop (11) · 4261 Scope Picker (4) · 4262 Shift Start Times & Unassigned (11) ·
  4263 Multi-Day Spread (14) · 4264 Linked Series & Banners (4) · 4265 Shift Block Anatomy (3) ·
  4266 Overlap & Lane Stacking (4) · 4268 Shift Detail Modal (10) ·
  4275 Reassignment & Context Menu (5, **C43811**)

### Batch C — Events · Conflicts · Capacity · Deletion · Settings · Permissions · API (68 cases)
- 4269 Events (7) · 4270 Conflict Detection (7) · 4271 Capacity Bars (5) ·
  4276 Deletion, Series Scopes & Undo (9) · 4277 Keyboard (3) · 4279 **Permissions (13 — likely
  DEFERRED, needs 2nd non-admin sign-in; do not quick-login/switch-user if a sibling is live)** ·
  4280 Edge Cases & Responsiveness (10) · 5405 Working Hours Settings (5, **C38847-38850 Automated —
  HELD, ask-first**) · 5408 Cross-Module & Rewrite Regression (5) · 5409 API — Schedule (4, drivable
  directly via cookie)

**61 + 66 + 68 = 195. ✓**

## 8. OUTSTANDING — what the coordinator must resolve before fan-out

1. **UI RENDER PATH (blocker for every batch).** The SPA needs a seeded `user`+`token` to render;
   with cookies alone it redirects to `/login`. The normal source is the dev **`quick-login`**
   response (the Report Suite build-verify used `quick-login` — grep-confirmed). The pass instruction
   forbade quick-login here for sibling safety. **Decide:** may the batches use `boot2` (SV_KEY=admin
   quick-login) when no sibling is live, or must they seed the user/token another way? Without this the
   batches cannot walk the UI. *(API-only cases in §5409 and any route-level check can proceed without
   the UI.)*
2. **Default location** = Staging Heavy Duty - 9919 (`b3c8c820…`) — present in this org's workplace
   list; use it for every observation unless a case needs another (record the location alongside the
   build marker).
3. **Permissions (§4279, 13 cases)** need a second non-administrator sign-in — likely DEFERRED (same
   blocker that has recurred on all three projects). Confirm whether a 2nd login is available.
4. **The 5 Automated cases** (C43811, C38847-38850) are Vlad's — Rule 71 ask-first; edited only coupled
   with build-verify, then handed to Vlad.

## Provenance of this scoping pass
Session cookies `/tmp/staging-cookie.txt` (alive). Build `v3.8-bd246fd`. Spec Confluence v30 (live REST,
read 2026-08-18). Epic SV-8685 (live Jira, read 2026-08-18). TestRail group 4254 read via `tr_client`
(read-only, 0 writes). Run 357 (Schedule, Ayesha's) untouched.
