<!-- SOURCE: user upload 2026-07-29 — engineering technical implementation plan (Schedule Module Rewrite).
     Copied VERBATIM below this header from cc63b9eb-ScheduleModuleRewriteTechnicalImplementationPlan.md.
     Ingested for TECH-PLAN RECONCILIATION against the Schedule test suite (177 active cases). LOCAL only — no TestRail writes. -->

# Schedule Module Rewrite — Technical Implementation Plan

**Date:** 2026-07-22
**Requirements source:** [PRD "Schedule"](https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/713031682/Schedule) (v1.0, incl. Branko's Q&A footer comment) + the [Schedule design project on claude.ai](https://claude.ai/design/p/d3cdcf5c-83df-45ea-ba75-7ddedb5124b5?via=share&file=Schedule.dc.html) (see § Design Source below for access). No `/prd`-derived requirements doc exists; FR/NFR IDs below are derived here (see §9). All the locked decisions and carried-forward behavior are restated inline in §2 — this plan is self-contained and does not depend on any local scratch doc.
**Tech stack:** BE PHP 8.5 / Symfony 7.4 / Doctrine (DDD + Hexagonal); FE Vue 3.5 `<script setup>` + TS / Quasar 2 / TanStack Query; FullCalendar 6 (premium Scheduler); E2E Playwright.
**Estimated complexity:** High (XL — new module + 4 cross-module prerequisites + data migration + interactive grid).

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Not started (plan only)
- **Current phase:** —
- **Last completed:** —
- **Open questions / blockers:** (1) ✅ **FullCalendar commercial license — SECURED.** The key lives in **AWS Secrets Manager, `ca-central-1`, secret name `FullCalendar/LicenseKey`**. Wiring notes: this is a **build-time** value (Vite bakes `FULLCALENDAR_LICENSE_KEY` into the `schedule` chunk), so the **CI build job** needs it — not the running container. Either give the FE build job IAM read on that secret, or mirror it into a GH Actions secret consumed by the workflow; then it flows through `app/variables/.env.*` → `app/variables/parser.js` → the component. *(Confirm `process.env` vs `import.meta.env` exposure — the POC used `process.env`.)* Note the key is a client-side license string and will be present in the shipped bundle by design — that is how FullCalendar licensing works, not a secret leak. **Original text for reference:** The env var is `FULLCALENDAR_LICENSE_KEY` (consumed in the POC's `FullCalendarSchedule.vue`; declared but empty in `app/variables/.env.local.dist:13`, `.env.production:9`, `.env.qa:8`, `.env.staging:9` on the CRM branches). Remaining wiring, NOT a purchase blocker: (a) put the real key value into the `app/variables/.env.*` slots (uncommitted `.env.local` for devs) + a **GH Actions secret** for CI/staging/prod builds — never commit the raw key; (b) verify whether our Vite parser (`app/variables/parser.js` → `vite.config.mts`) surfaces it as `import.meta.env.FULLCALENDAR_LICENSE_KEY` vs the POC's `process.env.` form and align the consumer; (c) confirm the purchased tier's developer count covers the team (FullCalendar licenses by developer headcount, not machines/seats — one embedded key, unlimited machines/environments/end-users, no runtime activation). **Not a dev/test/QA blocker — the distinction is legal, not functional.** Premium plugins render fully regardless of key. The POC falls back to `DEFAULT_LICENSE_KEY = 'CC-Attribution-NonCommercial-NoDerivatives'`, which FullCalendar accepts and renders **clean (no watermark)** — but it is only valid for **non-commercial/evaluation** use. So: implementation, unit/E2E tests, and **QA/local/CI** can run on the CC fallback indefinitely; **commercially deployed environments (prod, and staging as a commercial pre-prod) must carry the purchased key** for licensing compliance. Only a *missing/invalid/expired* key shows the "valid license key" watermark — the CC fallback does not, so devs see no watermark either way. E2E: never assert on the watermark or place a locator under it. (2) Product sign-off on the rollback exposure (post-cutover shifts aren't back-migrated if we revert — §7). (3) ✅ **RESOLVED — FullCalendar is confirmed as the path (D0 stands), and the `app/package.json` addition of the 6 FullCalendar v6 packages is approved** (eng lead, 2026-07-23). Phase 0 is unblocked. (4) Confirm the renameable color-label store is in v1 scope (FE says yes; BE had it as Phase 8 pending confirmation — resolved in this plan as in-scope Phase 8). (5) ✅ **RESOLVED — mobile deferred**: out of scope for v1; reuse the existing legacy mobile-menu shape as the default, and the implementer must **ask the user** before building it in case a different approach/design is available (no mobile design frames exist). (6) ✅ **RESOLVED — D5 capacity boundaries**: both documented defaults stand (dept-assigned events don't count toward a single tech; unbounded all-day events are visual-only). (7) ✅ **RESOLVED — unresolvable rows**: `workplace_id` is nullable and nothing is skipped; prod audit shows only **61 rows (0.09%)** unresolvable and those are already invisible in today's UI. No blocker. (8) ✅ **RESOLVED — one release**: schema migrations → data migrator → new code serves traffic, all in a single release; only the `calendar_task` table drop is a fast-follow.

- **Data facts measured in prod (2026-07-23)** — 67,219 `calendar_task` rows (57,535 service / 9,684 event), 693 future-dated, 0 workplaces missing a timezone, ~130 staff with multiple active enrollments and an unreliable `is_default` flag (some have zero defaults, some several). Location resolution is **work-order-first** (§3). Full detail in §3; query kept at `docs/tech-plans/schedule-calendar-task-workplace-audit.sql`.

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), the mandatory E2E ask, and phase-by-phase hands-off execution. Free-hand implementation skips all of it.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore this note and continue.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins.

> 🎨 **Design access — read this before any FE phase.** The authoritative design is **not** a file in this repo and there is no committed local copy — do not look for one. It lives only in the [claude.ai Design project "Schedule"](https://claude.ai/design/p/d3cdcf5c-83df-45ea-ba75-7ddedb5124b5?via=share&file=Schedule.dc.html) (id `d3cdcf5c-83df-45ea-ba75-7ddedb5124b5`, owner Branko, shared org-wide to ShopView, comment access). It is **not** fetchable with `WebFetch`/`curl` (403). Read it with the **`DesignSync` MCP tool** (`list_files` / `get_file` against that projectId) authenticated via a **ShopView claude.ai login**; tokens trace to the ShopView Design System Figma (reachable via the Figma MCP).
> **Subagents (`fe-implementer`/`be-implementer`) have NEITHER tool** — so at implementation time the **orchestrator** must pull the relevant frames/spec/tokens live via `DesignSync` and hand them to the implementer inline in the prompt (or write them to that run's working directory). There is no persistent staged copy to rely on. Never dispatch a "build to the prototype" phase without first pulling the live artifact and passing it along. Full inventory, access details, and token values are in **§ Design Source & Consumption** below.

---

## Design Source & Consumption (READ BEFORE ANY FE WORK)

**Source of truth = the claude.ai Design project, not a local file and not Figma-directly.** The design is the Claude design project **"Schedule"** (id `d3cdcf5c-83df-45ea-ba75-7ddedb5124b5`, owner Branko), shared to "Anyone in ShopView with the link" (comment access). Its design tokens derive from the **ShopView Design System Figma** (`https://www.figma.com/design/4v5M4z7Xj1Uw6qxrM61ktB/ShopView-Design-System`).

**How to access it (this matters — the naive path fails):**
- ❌ `WebFetch` / `curl` on the `claude.ai/design/p/…` share → **403** (SPA behind auth).
- ✅ The **`DesignSync` MCP tool**, authenticated via a **ShopView claude.ai login** (the share is org-wide, so any ShopView login can read it): `list_files` / `get_file` against the projectId above. `get_file` is capped at 256 KiB — the big `Schedule.dc.html` (~331 KB) **exceeds it and cannot be fetched whole**; read it instead via the 44 individually-fetchable `screenshots/*.png` frames plus the smaller focused prototypes (`Line Drag Scheduling.dc.html`, `Line Picker Popover.dc.html`, both well under the cap). The `colors_and_type.css` tokens and the smaller `.dc.html` files fetch fine.
- ✅ The underlying **ShopView Design System Figma** is reachable via the Figma MCP (`get_design_context` / `get_screenshot`) if a token/component needs confirming at source.

**Implementer handoff (important — subagents can't reach it themselves):** `fe-implementer` / `be-implementer` only have `Read/Grep/Glob/Bash/Edit/Write` — **no `DesignSync`, no Figma MCP**. So at implementation time the **orchestrator** pulls the relevant frames/spec live via `DesignSync` and passes them to the implementer **inline in the prompt**, or writes them into that run's own working directory (e.g. the implementer's worktree scratch) — pulled fresh each run, never assumed to already exist on disk. Do not hand an implementer a phase that says "build to the prototype" without first pulling the live artifact and passing it along.

All assets below are fetched **live** via `DesignSync get_file` against the projectId (paths are project-relative):

| Asset (project path) | Consume for |
|---|---|
| `Schedule.dc.html` | Interaction detail. >256 KiB → read via screenshots + focused prototypes (above). Monolith layout: template ~L9–1606, logic ~L1608–4110; line ranges cited in the FE component tree (spread ~L1477–1575, shift modal ~L919–1116, line picker ~L1134–1238). |
| `screenshots/*.png` (44) | Pixel/layout intent — map below. Each is individually fetchable. |
| **`Hours Settings.dc.html`** | ⚠️ Currently a **SHELL** (top bar + theme toggle, empty body — hours UI not drawn as of 2026-07-22). No field specs to harvest for Phase 2/3; build from the design-system conventions + the FE component plan. Re-fetch at build time in case it's fleshed out. |
| **`Edit Staff Member.dc.html`** | Phase 3 staff working-hours placement in the staff dialog (verify it isn't also a shell when you fetch it). |
| **`Edit Modals.dc.html`** | Dialog conventions (Phases 7–8 modals). |
| `Line Drag Scheduling.dc.html`, `Line Picker Popover.dc.html` | Phase 7 drag + LinePicker (small — fetch whole). |
| `Schedule PRD.dc.html` | Cross-check only — the live Confluence PRD + Branko's Q&A win on any conflict. |
| `_ds/shopview-design-system-…/colors_and_type.css` + `README.md` | Design tokens (below). |
| `_ds/shopview-design-system-…/colors_and_type.css` + README | Live `get_file`. Design tokens (CSS vars) + an `_adherence.oxlintrc.json` lint config. | Token values below; map to Quasar theme. |

### Design tokens (from the bundled ShopView Design System — map to Quasar theme vars, don't hardcode)
- **Color:** primary `#257CFF` (hover `#1752C0`, active `#042260`, disabled `#B7D5FF`); text `#364152`; grey ladder `#F8FAFC → #0F111A` (11 steps); success `#36B360`/fill `#ABF5C4`/text `#108737`; warning `#EC9E00`/fill `#FFF5E0`/text `#B47A00`; error `#EF4444`/fill `#FCA397`/text `#B52020`; info fill `#E5EDFF`/text `#0868A7`. The schedule's 7-color shift palette (FR-012) draws from the extended teal/cyan/violet/pink data-viz colors — confirm exact hexes against `colors_and_type.css` at build time.
- **Type:** Inter (18pt = `Inter`, 28pt = `Inter Display`). Scale: H1 30/38, H2 24/32, H3 20/28, H4 16/24, Body1 14/20, Body2 12/16, Caption 10/14. Min 12px.
- **Spacing:** 4px grid (4/8/12/16/20/24/32/40/48/64…). **Radii:** 8px (buttons/inputs/menus/modals/cards), 12px (large panels/modal outer), full-pill badges, circle avatars. **Shadows:** sm `0 1px 2px rgba(16,24,40,.05)`, md `0 4px 8px rgba(11,23,51,.08)`, lg `0 12px 24px rgba(11,23,51,.10)`; focus ring 4px `rgba(37,124,255,.24)` + 2px blue border.
- **Theming:** the design system is **light/dark aware** — it exposes `--sv-*` CSS variables (`--sv-surface`, `--sv-surface-canvas`, `--sv-surface-hover`, `--sv-border-default`, `--sv-text-primary/-secondary/-muted`, `--sv-accent`, `--sv-font-ui`) toggled by `window.ShopviewTheme` / `[data-theme="dark"]`. The hex values above are the *light* source values; **the FE must consume the app's own theme tokens (Quasar theme vars / the app's `--sv-*` equivalents), not hardcoded hexes**, so the schedule renders correctly in both themes. Verify the schedule (and every new dialog/popover) in dark mode as part of the browser-walk.
- **Rules the FE must honor:** badges = tint bg + darker text (pills, not solid chips); one primary button per view; color never communicates status alone (pair with text/icon — matters for conflict + capacity-OT indicators); no gradients/emoji/frosted glass; outlined line icons (Lucide-style, `currentColor`); motion 120–160ms ease-out, hover = shadow lift not scale.

**Screenshot → phase/component map** (all under `screenshots/`):

| Frame(s) | Phase | Component |
|---|---|---|
| `day-view`, `day-now`, `day-overflow` | 7 | `ScheduleCalendar` Day (`resourceTimelineDay`), `nowIndicator`, `eventMaxStack:3` lane stacking + "+N more", `shiftBlockContent` |
| `week-view`, `week-21`, `dept-week` | 7 | Week (`resourceTimelineWeek`), department resource grouping, `timelineSlotLabel` (day header + capacity bar) |
| `month-view`, `month-cap`, `month-fixed`, `month-lanes*`, `month-tip`, `month-21-*` | 7 | Month (`dayGridMonth`), `monthDayCellContent` (capacity bar + OT), `dayMaxEvents:3` overflow |
| `series-week`, `series-month`, `banner-*` | 7 | Series render-grouping ("week i of N" blocks; month multi-day banners) |
| `conflicts`, `modal-conflict` | 7 | `ConflictsPopover` + conflict styling on blocks |
| `cap-tooltip`, `month-cap` | 7 | `CapacityBar`, `CapacityTooltipContent`, `CapacityDialog` |
| `spread` | 7 | `SpreadDialog` (5 schedule options + week preview) |
| `delete-scope` | 7 | `DeleteScopeDialog` (this / this & following / entire series) |
| `popover`, `popover-v2..v4` | 7 | `LinePickerPopover` (whole-WO vs multi-line) |
| `dropdown` | 8 | color/label select (`ColorLabelPicker`) |
| `modal-approved`, `modal-bottom`, `modal-v2`, `modal-estimate-*`, `labor-rows` | 8 | `ShiftDetailDialog` + `ShiftLinesTable` — ⚠️ see caveat |

**🔴 Three caveats the implementer MUST apply — do NOT copy the prototype/screenshots verbatim:**
1. **`$` is removed (D6).** `labor-rows.png`, `modal-estimate-badge.png`, `modal-estimate-final.png` show labor/total/$ figures in the shift modal. These are **dropped** — build the modal with the lines table but **no monetary columns**. The screenshots are stale on this point.
2. **PRD wins over prototype drift:** sidebar has **no Assigned/Unassigned tabs** and **no Tech/Dept toggle**; reassign is **drag-only** (no modal reassign action). Build the PRD version even though the prototype/`popover` frames may show the older shape.
3. **These prototype behaviors are bugs, not spec — do not copy them:** closures aren't actually skipped in spread; series is uncapped; reassign corrupts the roster; working hours/weekend are hard-coded; "My Shifts" is hard-coded to one tech and "New Work Order" is a toast stub. Each has an explicit fix owner in §5 — treat "just do what the prototype does" in these six spots as introducing a bug.

**Keeping the design in sync:** the only source of truth is the live claude.ai Design project (id/link above) — there is no committed copy, so always re-pull the current state via `DesignSync get_file` at implementation time rather than trusting any cached snapshot. Comment access on the share means feedback can be posted back on the design itself.

---

## 1. Architecture Overview

This is a **straight replacement** of the live, in-prod Schedule (QCalendar on `develop`, backed by the `CalendarTask` aggregate in `api/src/TaskManagement/Calendar/`): a full rewrite delivered as **one release** that cuts over for everyone at once, with the existing `calendar_task` data migrated into a new model. **No feature flag** (D-0b). The release's **deploy order** is what de-risks it: **(1)** run schema migrations → **(2)** run the data migrator → **(3)** new code serves traffic. The only step deliberately deferred is **dropping the `calendar_task` table**, which happens as a fast-follow so rollback stays possible.

```
  BEFORE (today)                                    AFTER (one release — single path, no branch)

  pages/Schedule.vue (1478 L)                       pages/Schedule.vue
    └▶ components/ts/schedule/ (15 cmp)               └▶ components/ts/schedule-next/SchedulePage.vue
         └▶ api/calendar ─▶ calendar_task                 └▶ api/schedule ─▶ schedule_shift
                                                                             schedule_shift_line
  ══ legacy CODE deleted in the same release ══                              schedule_event
     (rollback = redeploy previous image, which still contains it)                    ▲
     calendar_task TABLE retained, unwritten → dropped in a fast-follow               │
                          FullCalendar 6 premium                                     │ server-authoritative
                          Day/Week = resourceTimeline (tech rows, dept groups)        │ conflict/capacity engine
                          Month    = dayGridMonth (aggregate)                         │ (WorkingWindowResolver +
                                                                                      │  ShiftConflictDetector +
          resolved-hours hierarchy: Tech hours > Business hours > Default (7–19) ──────┤  CapacityCalculator +
                                                                                      │  SeriesSpreader)
  PREREQUISITES (new, cross-module, sequenced first):                                 │
   • Staff working hours (Staff ctx)          ─────────────────────────────────────────┤
   • Shop business hours + closures (Org ctx) ─────────────────────────────────────────┘
   • Per-line multi-tech roster (WorkOrders ctx) ── LineRosterSynchronizer (derive membership from live shifts)
   • WO priority High/Med/Low (WorkOrders ctx) ──── sidebar filter + WO form

  OTHER calendar_task CONSUMERS — both cut over in the same release, no fallback path:
   • Dashboard/Application/Query/Schedule/ScheduleQueryHandler.php (3 raw-SQL sites) ─▶ schedule_shift
   • VehicleService/WorkOrders/Application/Create/CreateCommandHandler.php (appointment-on-WO-create) ─▶ schedule_shift
```

New BE module: `api/src/TaskManagement/Schedule/` (canonical `Domain / Application / Infrastructure / UI` layout). New FE dir: `app/src/components/ts/schedule-next/` + `app/src/api/schedule/`. The legacy **code** (`TaskManagement/Calendar/`, `components/ts/schedule/`, `api/calendar/`, the `pages/Schedule.vue` body) is deleted **in this same release** — rollback is a redeploy of the previous container image, which still contains it, so retaining dead code in-tree would buy nothing. The `calendar_task` **table** is the exception: it stays in place (no longer written to) and is dropped in a **fast-follow cleanup ticket**, because that drop is the one genuinely irreversible step.

---

## 2. Technical Decisions

- **D0 — Build on FullCalendar premium (`resource-timeline`), not on QCalendar.** The PRD is an interaction-heavy resource scheduling grid — tech rows × time, external drag from the sidebar, drag-between-rows reassign, resize, overlapping-shift lane stacking with "+N more" overflow, now-indicator, auto-scroll, aggregate month with multi-day series banners. FullCalendar's `resourceTimeline`/`dayGridMonth` give all of that natively; those are exactly the most expensive and **flake-prone** parts to hand-roll. QCalendar (`@quasar/quasar-ui-qcalendar`, what the live schedule uses) is a *rendering* grid with **no** built-in drag/drop/resize/overlap-layout/overflow — reaching the PRD on it means writing a mini-FullCalendar (drag math, hit-testing, stacking algorithm), which collides with ShopView's zero-tolerance E2E-flakiness bar. FullCalendar removes the hardest interactive-grid problem (~the reason to pay for it); the domain logic (conflict engine, spread, capacity, series) is custom either way. Cost is a per-developer license (key in hand — see §0) and a heavy bundle kept in the lazy route chunk (NFR-006). De-risk: the CRM POC already proved this path in-repo (adapter + DnD composables, reference-only). *Reconsider only if the license couldn't be secured or scope were cut to a static month/agenda view — neither applies.*

- **D-0b — NO feature flag: one release, de-risked by deploy ordering.** This is a replacement of an existing feature, not a parallel experiment, so we do not build a flag switch, a `LegacySchedulePage` extraction, or dual write paths. **Trade-off, stated honestly:** we give up instant rollback-by-toggle, gradual canary rollout, and the ability to leave legacy running for stragglers; in exchange the code has one path (no flag branches, no dual-write, no mixed-fleet SQL fallbacks) and there is no flag-debt cleanup. The lost safety is replaced by three cheap mechanisms: **(1) ordered deploy within the release** — schema migrations → data migrator (verify counts) → new code serves traffic, so no user meets the new UI before their data is in the new tables. **(2) The retained `calendar_task` table IS the rollback net** — the migrator is copy-only, so the legacy data stays intact and current; rollback is a redeploy of the previous image (which still contains the legacy code) against still-valid data. This is now the strongest argument for D1's new-table choice. **(3) A staging rehearsal** of the exact deploy sequence against production-shaped data beforehand. *Consequence to accept: the E2E schedule suite breaks in this release with no flag-off grace period — see §6; that work is mandatory and uncapped, not deferrable.*

- **D1 — New `Shift` + `ScheduleEvent` aggregates, NOT extending `CalendarTask`.** New module `api/src/TaskManagement/Schedule/`, new tables. Rationale: (a) **it preserves the only rollback net we have** now that there's no flag — the new tables are written while `calendar_task` stays intact and readable, so the release can be reverted by redeploying the previous image against still-valid data; mutating `calendar_task` in place would make the cutover destructive and irreversible, and would put every legacy write path (`Create/Change/Delete/Carryover/CustomEvent`) at regression risk during the transition; (b) `calendar_task` has **no tenant column** (`DbalStaffFetcher` scopes via a `staff_enrollment` join; `CalendarTaskRepository` loads by bare id with no decorator — a 🔴 tenant-scoping gap we don't want to inherit) — a `workplace_id` column + `WorkplaceDecorator` is trivial on a new table; (c) new semantics (nullable time positioning = all-day capacity block, `seriesId`, and shift→line coverage) don't retrofit cleanly onto `scheduled_start NOT NULL` + WO-id-only linkage; (d) events participate differently from shifts (capacity yes, conflicts no — see D5) so the `calendarTaskType service|event` conflation is the modeling mistake we get to undo — a separate `ScheduleEvent` keeps the **conflict** detector's input type-safe (`Shift[]` only — events cannot be conflict-flagged by construction), while capacity accepts both types explicitly; (e) the legacy module violates current API standards (controllers under `Application/`, Commands doubling as request payloads) — a fresh module is canonical from day one; (f) the `CalendarTask → Shift` rename is free with a new aggregate, expensive in place. **Terminology:** `CalendarTask(service)` → `Shift`; `CalendarTask(event)` → `ScheduleEvent`; "Series" = shared `series_id` string, render-time grouping, **no table**; rowKey = `staff_id XOR department_id` (carry forward the existing mutual-exclusivity invariant).

- **D2 — Time model: UTC-canonical instants + local wall-clock config.** `Shift.starts_at`/`ends_at` are UTC `DATETIME` (matches UTC-everywhere rule + the existing `calendar_task` shape → migration & Dashboard back-compat are column-compatible). `is_all_day` + `duration_minutes` alongside. Working-hours/business-hours store **local minutes-from-midnight** (`start_minute`/`end_minute`) — they are inherently local; converting to UTC would corrupt them across DST. Spread materializes each day's shift individually, converting "8am local" → UTC per-day via `Workplace.timezone`, so a DST-crossing series stays at 8am local every day. **Wire format = UTC ISO-8601** on all shift/event fields; the FE converts to shop-local for FullCalendar using the existing SV-8038 remap helpers (`parseLocalDate` / `formatDateLocalToUTC` in `app/src/api/calendar/queries.ts`) — this supersedes the FE draft's local-`date`+`startTime` DTO so there is one canonical representation.

- **D3 — Conflict/capacity computed on READ, server-authoritative; FE mirrors for optimism.** No persisted `is_conflict` column (editing a tech's Tuesday hours would otherwise force recompute of every future Tuesday shift). The board query runs the resolver+detector over fetched shifts (O(n) + two small config lookups). Write endpoints run the same services on affected rows and return fresh conflict state so the FE optimistic update reconciles without a full refetch. The board response includes a `workingWindows` block (resolved hours per tech per day) so the FE's drag-time client engine checks against the **same** resolved hierarchy the server used — no divergent reimplementation. Shared constant: **Default = 07:00–19:00 local** must match on both sides.

- **D4 — Conflict = outside resolved working window only.** Hierarchy **Tech hours > Business hours > Default (7–19)** per weekday. Saturday with tech Saturday hours set is **not** a conflict. Tech double-booking (overlap, same tech, different WO) is flagged by the FE engine as a soft warning but is **not** a hard "conflict" per the locked definition; the BE detector reports only outside-window/closure/non-working-day. (The old repo's broken overlap check is not carried forward.)

- **D5 — Events count toward capacity, but are NOT conflict-checked** (answer to one of our questions in the **PRD Confluence Q&A comment thread**, 2026-07-23 — this **revises** the earlier "events are visual-only, not in capacity" answer #1). An event occupies a technician's time, so it consumes capacity; but events are not flagged for conflicts "for now." Concretely: `CapacityCalculator` sums **shift durations + staff-assigned event durations** for a tech/day; `ShiftConflictDetector` still takes **`Shift[]` only** (events can't be conflict-flagged, enforced by type). Boundaries to confirm with product before Phase 7/8 (assume the noted default otherwise): (1) **department-assigned events** have no single tech, so they **don't** contribute to per-tech capacity (default: excluded — same as dept-lane placeholder shifts); (2) **all-day / multi-day events** — default: attribute each event's `ends_at − starts_at` minutes to the day(s) it covers, same per-day split as shifts; an all-day event with no bounded duration is excluded from the numeric capacity sum (shown visually only). Capacity is computed on read, so this is a read-side sum change, not a new write path.

- **D6 — No monetary data anywhere.** No schedule query SELECTs any pricing column; no DTO carries `$`. This makes the masked-pricing-echo bug class structurally impossible in this module (nothing masked can be echoed back). The shift modal drops all `$`/labor/total figures. WO-derived fields (customer, unit, VIN, lines) are omitted server-side when the caller lacks Work Orders:View.

- **D7 — Spread is server-side materialized.** `POST /api/schedule/shifts` with a `spread` object; the server resolves working windows, skips closures + non-working days (real skipping — the prototype never skipped closures), assigns one `seriesId`, caps the series, writes N rows + roster sync in one transaction, and returns the full materialized set with conflicts computed. FE-driven N-POSTs rejected (non-atomic, duplicates skip logic, N round-trips). The FE renders a matching client-side preview via `useSeriesSpread`.

- **D8 — Series cap: 8-week soft + 120-shift hard.** Beyond **8 weeks (56 calendar days)** the create endpoint rejects with `SeriesTooLongError` (409) unless `acknowledgeLongSeries=true` (the FE renders the warning and re-submits). An absolute **120-shift-per-gesture** hard cap is never overridable. Enforced BE-authoritative (API consumers/E2E factories must not bypass "warn").

- **D9 — Concurrency: optimistic + refetch (LWW), no live push in v1.** Carries forward current behavior (no Mercure on the schedule today). Write responses return authoritative state; `onSettled` invalidates. Mercure live boards are an additive future item (flag to product).

- **D10 — Undo: commit-immediately + compensating mutation.** The real mutation fires now (a tab close must not lose the action); the 4–7s toast's Undo issues a compensating mutation (delete created / restore deleted / move back), not a cache rollback. Requires a BE `restore` endpoint for undo-of-delete.

- **D11 — Roster membership derived from live shifts.** `LineRosterSynchronizer` (WorkOrders ctx): shift create upserts `(line, tech, source='shift')`; reassign/delete removes `(line, oldTech)` **only if** no other live shift covers that line for that tech AND `source != 'manual'`. Fixes the prototype's unconditional roster-strip corruption. `Line.techAssignedId` stays as "lead tech" for back-compat; roster reads fall back to it when the table is empty (no backfill migration).

- **New dependencies (FE):** `@fullcalendar/core`, `@fullcalendar/vue3`, `@fullcalendar/interaction`, `@fullcalendar/daygrid`, `@fullcalendar/resource`, `@fullcalendar/resource-timeline` (v6.x). Justification: the `resourceTimeline` views are the exact "tech-rows × time" primitive; native `dayGridMonth` handles the aggregate month incl. multi-day series banners + `dayMaxEvents` overflow. **Not** adding `timegrid`/`resource-timegrid` (the locked view mapping doesn't use them). The CRM POC (`6dcceccc95`) is a **Vue 2 / Quasar 1 / `@fullcalendar/vue`** artifact — harvest adapter *concepts* (resource-id prefixing, revert-on-invalid, `Draggable` lifecycle, `calendarKey` remount) but port zero code.

---

## 3. Database Changes

> ⚠️ Migrations are hand-written and verified a no-op with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"). DBAL's schema tools choke on functional/expression indexes in this repo, so the real migration is produced by the implementer against the live schema. Hand-authored FKs must be registered in `ExpressionIndexFilteringMySQLSchemaManager::MANUALLY_MANAGED_FOREIGN_KEYS` with their backing index declared in the XML mapping; index names must be globally unique (SQLite functional tests). See `api/.claude/reference/database.md`.

### New tables

| Table | Purpose | Key columns / indexes |
|---|---|---|
| `schedule_shift` | Shift aggregate | `id`, `workplace_id` (NOT NULL, tenant), `work_order_id` (nullable), `staff_id`/`department_id` (nullable, XOR), `starts_at`/`ends_at` (UTC DATETIME), `is_all_day`, `duration_minutes`, `series_id VARCHAR(36) NULL`, `color`, `note TEXT NULL`, timestamps. Idx: `(workplace_id, starts_at, ends_at)`, `(staff_id, starts_at)`, `(department_id, starts_at)`, `(work_order_id)`, `(series_id)` |
| `schedule_shift_line` | shift→line coverage (drives roster sync + "N lines") | `shift_id`, `line_id`, unique `(shift_id, line_id)`. FK `line_id ON DELETE CASCADE` (line deleted → coverage row goes, shift survives = "no orphan-on-line-delete") |
| `schedule_event` | ScheduleEvent aggregate (feeds capacity, not conflicts) | `workplace_id`, `staff_id`/`department_id` (XOR), `starts_at`/`ends_at`, `title`, `color`, `note`; idx `(workplace_id, starts_at)`. Duration for capacity = `ends_at − starts_at` (no separate column). |
| `staff_working_hours` | Prereq: per-weekday tech hours | `staff_id`, `workplace_id`, `day_of_week TINYINT(0–6)`, `is_working`, `start_minute SMALLINT`, `end_minute SMALLINT`; unique `(staff_id, workplace_id, day_of_week)` |
| `workplace_business_hours` | Prereq: shop hours | `workplace_id`, `day_of_week`, `is_open`, `open_minute`, `close_minute`; unique `(workplace_id, day_of_week)` |
| `workplace_closure` | Prereq: closures/holidays | `workplace_id`, `starts_on DATE`, `ends_on DATE`, `name`; idx `(workplace_id, starts_on, ends_on)` |
| `work_order_line_technician` | Prereq: per-line roster | `line_id`, `staff_id`, `source VARCHAR('manual'\|'shift')`; unique `(line_id, staff_id)`, idx `(staff_id)` |

### Modified tables

| Table | Change |
|---|---|
| `work_order` | Add nullable `priority VARCHAR(6)` (`high\|medium\|low`, default NULL). Index only if the sidebar/WO-list filter EXPLAIN needs it (workplace+status is the driving predicate). Mapping: `WorkOrder.orm.xml`. |

```sql
-- Illustrative shape only, NOT the migration to copy-paste
CREATE TABLE schedule_shift (
  id CHAR(36) NOT NULL, workplace_id CHAR(36) NOT NULL, work_order_id CHAR(36) NULL,
  staff_id CHAR(36) NULL, department_id CHAR(36) NULL,
  starts_at DATETIME NOT NULL, ends_at DATETIME NOT NULL,
  is_all_day TINYINT(1) NOT NULL DEFAULT 0, duration_minutes INT NOT NULL,
  series_id VARCHAR(36) NULL, color VARCHAR(32) NULL, note TEXT NULL,
  created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY (id)
);
ALTER TABLE work_order ADD priority VARCHAR(6) DEFAULT NULL;
```

Ids use `Uuid` directly in the new module (no `WorkOrderId`-style wrapper VOs — the old module's wrappers are not current standard).

### Data migrations

**Mechanism: an idempotent, re-runnable CLI command — not a Doctrine migration** — `app:schedule:migrate-calendar-tasks [--organization=<id>] [--dry-run]` (`UI/CLI/MigrateCalendarTasksCommand.php`; logic in an Application `CalendarTaskMigrator` service so the command stays untested wiring). Why not inside a Doctrine migration: (a) a bulk row copy shouldn't hold the migration lock during deploy; (b) it must be **re-runnable** — safe to retry if it fails partway, and safe to run again if the deploy is repeated; (c) it must report verifiable counts before the new code goes live, with `--dry-run` for rehearsal. It runs as **deploy step 2** (after schema migrations, before the new code serves traffic) — the same deploy-command pattern the release flow already uses for ECS. `--organization` is retained as a batching/testing aid (staging rehearsal, spot-checking one org), not as a rollout mechanism.

Row mapping: `calendar_task_type='service'` → `schedule_shift`; `='event'` → `schedule_event` (`event_title`→`title`); `scheduled_start/end`→`starts_at/ends_at` (already UTC, `is_all_day=0`); `time_estimate`→`duration_minutes`; `assigned_staff_id`/`assigned_department_id`→`staff_id`/`department_id`; `work_order_id`/`note`/`color` copied; `series_id=NULL` (legacy rows are singletons, contribute nothing to rosters). Idempotent: reuse `calendar_task.id` as the new row id + select-before-insert / `ON DUPLICATE KEY UPDATE` — so a retried or repeated run never duplicates rows.

**`workplace_id` is NULLABLE, resolved WORK-ORDER-FIRST.** **Nothing is ever skipped** — every legacy row migrates, so the copy is 100% lossless; unresolvable rows carry a NULL workplace and stay invisible on location-scoped boards, which is *exactly* their behavior today.

**Measured against prod (2026-07-23, `schedule-calendar-task-workplace-audit.sql`)** — 67,219 total `calendar_task` rows (57,535 service / 9,684 event; 48,613 in the last 12 months; only **693 future-dated**):

| Bucket | Distinct rows | Share | Handling |
|---|---|---|---|
| Staff-assigned, active enrollment exists | ~64,797 | 96.4% | WO workplace when the row has a WO; else single default enrollment |
| Department-assigned (dept lane) | 1,936 | 2.9% | Department render path's workplace |
| Staff-assigned, no enrollment, but WO has workplace | 425 | 0.6% | WO fallback |
| Staff-assigned, no enrollment, no WO workplace | **61** | 0.09% | → `workplace_id = NULL`; **already invisible today** (10 service / 51 event) |

> ⚠️ **Audit-query caveat:** Q1's `COUNT(*)` **over-counts** because the `LEFT JOIN staff_enrollment` fans out one row per enrollment (it reported 176,299 for bucket A vs. ~64,797 distinct — a ~2.7× multiplier). The bucket-A distinct figure above is derived as `67,219 − 425 − 61 − 1,936`; buckets B/C/D are unaffected (no matching enrollment ⇒ one row each). Use `COUNT(DISTINCT ct.id)` if re-running.

**Resolution chain — WORK ORDER IS PRIMARY** (eng lead, 2026-07-23; domain rule):

1. **If the row has a `work_order_id` → `work_order.workplace_id`. Authoritative, no exceptions.** A work order belongs to exactly one location and cannot be opened at another, and a technician cannot be assigned to a WO unless enrolled at that location. The WO therefore *defines* the shift's location; enrollment is a weaker, mutable signal.
2. **No work order** (custom events, dept-lane blocks — recall **9,684** event rows carry no WO) → the assigned tech's **default enrollment** (`is_default = 1`) workplace, **only when exactly one such default exists**.
3. **Otherwise → `NULL`.** No default, several defaults, no enrollment, or a department-assigned row with no WO (departments are org-scoped and have no workplace of their own — confirmed in `Department.orm.xml`). NULL rows migrate but stay invisible on location boards, exactly as today.

**Deliberately no "most recent enrollment" / "lowest id" tie-break** — guessing a location is worse than leaving it NULL, and NULL is honest and reproducible.

> **Correction to an earlier draft of this plan:** an earlier version made enrollment primary, citing "7,105 rows where the WO workplace differs from the enrollment workplace" (audit Q4). **That figure is inflated by the same enrollment fan-out that inflated Q1** — it joins *every* active enrollment, so a multi-enrolled tech contributes a "differs" row for each enrollment that isn't the WO's location, which is expected rather than anomalous. Q4 cannot distinguish that from a genuine mismatch, so it does not justify enrollment-first. Use **Q7** (added to the audit file) to test the actual invariant: rows where the WO's workplace is not among **any** of the tech's active enrollments. Expected ≈ 0; a non-zero result means the assignment invariant has drifted and is worth investigating independently of this migration.
>
> **Known, intended behavior change:** for a tech enrolled at multiple locations, today's schedule renders their task on **every** enrolled workplace board (the read is `FROM staff_enrollment`). With WO-primary, the shift appears on **the WO's location only** — which is the correct behavior, and removes duplicate rendering. Call this out in QA notes so it isn't filed as a bug.

**Why store `workplace_id` on the shift at all rather than deriving it from enrollment at read time** (eng lead call): a stored value is **stable and indexable**. Deriving it per-read would (a) require joining through `staff_enrollment` on every board query, and (b) mean that transferring a technician to another location silently **relocates all their historical shifts** — the past would rewrite itself. Denormalizing the location onto the shift row pins each shift to where it was actually scheduled and makes the range query a simple indexed filter.

> **Context on how the legacy read differs:** the live Schedule renders staff-assigned rows via `DbalStaffFetcher` (`FROM staff_enrollment se … LEFT JOIN calendar_task ct ON s.id = ct.assigned_staff_id`), workplace-scoped on **`se.workplace_id`** — i.e. location is derived from *enrollment* at read time, and a multi-enrolled tech's task therefore appears on several boards. The new model stores the location on the shift instead, resolved from the work order (see the chain below). This is an intentional correctness improvement, not a port of the old behavior. Note `calendar_task.id` is `binary_uuid`; the new tables must use the same id type for id-reuse (and thus idempotency) to work. **Do not mutate or delete `calendar_task` rows** (copy-only) — that's what keeps the cutover revertible.

#### Backward compatibility — precisely what is and isn't

**The migration itself is fully backward compatible; the cutover deliberately is not.**

- ✅ **Schema is purely additive** — 7 new tables + one nullable `work_order.priority` column. No drops, renames, type changes, or index changes on existing tables. Legacy code is unaffected.
- ✅ **The data migration is non-destructive** — copy-only, never mutating or deleting `calendar_task`. After it runs, the legacy Schedule, the Dashboard, and WO-create all still work **identically**. The pre-cutover state can sit in production indefinitely with no user-visible change.
- ✅ **The field mapping is lossless** — verified against `CalendarTask.orm.xml`: every legacy column (`work_order_id`, `scheduled_start`, `scheduled_end`, `assigned_staff_id`, `assigned_department_id`, `time_estimate`, `calendar_task_type`, `color`, `note`, `event_title`) has a target. There is no carryover/recurrence column to lose — carryover is implemented as cloned rows, so each clone migrates as its own independent shift (matching the "shifts are independent records" rule).
- ✅ **No row is skipped, so the copy is lossless** (resolved — eng lead). `workplace_id` is nullable: rows we can't resolve migrate with `workplace_id = NULL`. They stay invisible on location-scoped boards, which **matches their behavior today** — the live UI renders `calendar_task` only through the staff path (`ct.assigned_staff_id` → enrolled active tech in a `display_on_schedule` department) or the department path (`ct.assigned_department_id` with `assigned_staff_id IS NULL`), so a row resolving to neither is *already* unrenderable. **Measured: 61 such rows (0.09%)** — dead rows, not data at risk.
- ✅ **No timezone gap** — prod has **0** workplaces with a NULL/empty timezone, so the per-day local→UTC conversion (D2) has a valid zone for every row.
- ⚠️ **Two data-quality issues to expect (pre-existing, not caused by this work):** (1) **far-future garbage dates** — `MAX(scheduled_start)` is **2600-01-01** (and 2400-01-01 in the dept lane); these migrate as-is (lossless) but are worth a cleanup pass, since they're clearly bad input. (2) **Unreliable `is_default`** on multi-workplace enrollments (see the resolution chain above).
- ⚠️ **Visible side effect of D5 at cutover:** there are **9,684 existing event rows**. Because events now count toward capacity, migrated events will immediately contribute to capacity bars — so post-cutover utilization will read higher than the legacy schedule implied. Expected, but worth telling product so it isn't reported as a bug.
- ⚠️ **Forward-only once the release lands.** After cutover, writes go to `schedule_shift` only and `calendar_task` freezes. The stores diverge from that moment: a revert restores a *working* legacy schedule, but one missing any scheduling done post-cutover (§7 rollback caveat) — bounded by how quickly a problem is caught.

---

## 4. API Changes

All new endpoints follow canonical layout: Controller in `UI/HTTP/<Feature>/`, RequestDto in `UI/HTTP/<Feature>/DTO/` implementing `RequestPayload`, pure Command/Query in `Application/…`, `data.*` envelope, camelCase, ISO-8601 UTC, `WorkplaceDecorator` in **every** Infrastructure query (trivial on `ss.workplace_id`), `#[IsGranted]` + voter where own-data scoping applies. **No new permission atoms** — everything reuses `ROLE_SCHEDULE_*`, `ROLE_WORK_ORDER_*`, `ROLE_USER_CREATE_AND_EDIT`, `ROLE_WORKPLACE_CHANGE`. A new `ManageShiftVoter` (new module) mirrors `CreateCalendarTaskVoter` logic (`ROLE_SCHEDULE_CREATE_AND_EDIT` + `isRestrictedToOwnData()` → own `staffId`) rather than importing the old module's voter.

### New endpoints — Schedule board & writes

| Method & path | Purpose | Auth |
|---|---|---|
| `GET /api/schedule/board?from=&to=` | One composite grid read: `resources` (dept groups → staff), `shifts`, `events`, `capacity` (per tech/day = shifts **+ staff-assigned events**), `workingWindows` (resolved hours per tech/day), `closures`. Conflicts computed on read (`isConflict`, `conflictReasons[]` per shift — **shifts only**). WO-derived fields null when caller lacks WO:View. | `ROLE_SCHEDULE_VIEW` |
| `GET /api/schedule/shifts/{id}` | Shift-detail modal payload: covered lines (name/status/timeEstimate/techTime — **no `$`**), note, series info. Line block requires WO:View. | `ROLE_SCHEDULE_VIEW` |
| `GET /api/schedule/work-orders?search=&status[]=&priority[]=&assignment=&page=&rowsPerPage=` | Sidebar: schedulable WOs with lines + roster + priority, **server-side search + pagination** + filter counts. No pricing. | `ROLE_SCHEDULE_VIEW` |
| `POST /api/schedule/shifts` | Create single **or** series (spread). Body: `{ workOrderId, lineIds[], staffId XOR departmentId, startDate, startTime?, spread:{mode:'single'\|'series', totalMinutes?, perDayMinutes?}, color?, note?, acknowledgeLongSeries? }`. Server materializes (skips closures/non-working days), one `seriesId`, caps, roster-sync — one transaction. Returns `201` + materialized shift list with conflicts. | `ROLE_SCHEDULE_CREATE_AND_EDIT` + `ManageShiftVoter` |
| `PATCH /api/schedule/shifts/{id}` | Move / resize / reassign / recolor / note. Body: `{ startsAt?, durationMinutes?, isAllDay?, staffId?, departmentId?, color?, note?, scope:'shift'\|'day'\|'series' }`. Reassign = new `staffId` (drag-only). Roster-sync on reassign. Returns affected shifts + fresh conflicts. | `ROLE_SCHEDULE_CREATE_AND_EDIT` + voter |
| `DELETE /api/schedule/shifts/{id}?scope=shift\|following\|series` | `204`. Roster-sync (safe-remove). | `ROLE_SCHEDULE_DELETE` + voter |
| `POST /api/schedule/shifts/restore` | Undo-of-delete compensation: re-insert previously-deleted shifts by preserved id/payload. `201`. | `ROLE_SCHEDULE_CREATE_AND_EDIT` + voter |
| `POST /api/schedule/events` · `PATCH /api/schedule/events/{id}` · `DELETE /api/schedule/events/{id}` | Event CRUD `{ title, staffId XOR departmentId, startsAt, endsAt, color?, note? }`. **No** roster or conflict involvement; **staff-assigned events DO count toward capacity** — but capacity is computed on read, so there's no write-side recompute (the next board read reflects it). | create/edit `ROLE_SCHEDULE_CREATE_AND_EDIT`, delete `ROLE_SCHEDULE_DELETE`, + voter twin |

**Error cases (shifts):** `SeriesTooLongError` → 409 (retry with `acknowledgeLongSeries=true`); hard 120-shift cap → 422 (non-overridable); cross-tech own-data violation → 403 (voter); missing/foreign shift id → 404 (workplace-scoped load); validation → 422.

### New endpoints — prerequisites & settings

| Method & path | Purpose | Auth |
|---|---|---|
| `GET/PUT /api/staff/{id}/working-hours` | 7-row per-weekday `{dayOfWeek,isWorking,startMinute,endMinute}`, workplace-scoped; PUT full-replace. | PUT `ROLE_USER_CREATE_AND_EDIT`; GET also `ROLE_SCHEDULE_VIEW` |
| `GET/PUT /api/workplaces/business-hours` | Authenticated workplace (no `{id}` — location-specific). | PUT `ROLE_WORKPLACE_CHANGE`; GET also `ROLE_SCHEDULE_VIEW` |
| `GET /api/workplaces/closures` · `POST` · `DELETE /api/workplaces/closures/{id}` | Closure/holiday date ranges. | same split |
| `GET /api/work-orders/{id}/line-technicians` · `PUT /api/work-orders/lines/{lineId}/technicians` | Roster read/write (PUT writes `source='manual'`; shift-derived rows engine-owned). | `ROLE_WORK_ORDER_VIEW` / `ROLE_WORK_ORDER_CREATE_AND_EDIT` |
| `POST /api/work-orders/change-priority` | `{ workOrderId, priority:'high'\|'medium'\|'low'\|null }` (follows the `change-*` feature-folder family, e.g. `ChangeBay`). Also add `priority` to WO create command + WO view/listing DTOs + sidebar + WO-list filter. | `ROLE_WORK_ORDER_CREATE_AND_EDIT` |
| `GET/PUT /api/schedule/color-labels` | Per-shop renameable 7-color labels (Phase 8). | GET `ROLE_SCHEDULE_VIEW`; PUT `ROLE_SCHEDULE_CREATE_AND_EDIT` |

### Modified endpoints

- **WO create** (`api/src/VehicleService/WorkOrders/Application/Create/CreateCommandHandler.php:12,29`): the appointment-at-creation currently goes through `WorkOrderCreateCalendarTaskService` (injected via constructor; the legacy service returns an internal HTTP `Response` that the handler JSON-decodes — a pattern worth dropping). Introduce a port `AppointmentScheduler` (Application interface in WorkOrders) with a single `schedule_shift`-writing implementation, and swap the dependency in **Phase 9 (cutover)**. No per-flag branch and no dual-write (dual-write would duplicate appointments in the Dashboard).
- **Dashboard** (`api/src/Dashboard/Application/Query/Schedule/ScheduleQueryHandler.php`, at cutover / Phase 9): the three raw-SQL sites (`fetchTodaysSchedule` ~L143, `fetchSchedule` ~L248, `fetchTechnicianAssignedWorkOrders` ~L359) are **repointed directly** from `calendar_task` to `schedule_shift` — no `COALESCE` fallback needed, since the cutover is atomic for all orgs (revert = redeploy the previous image, which restores the old query too). **Fix a pre-existing row-multiplication bug** in the same change: `LEFT JOIN calendar_task ct ON ct.work_order_id = wo.id` yields N rows for a WO with N tasks (spread makes N=20+ routine) — join a `GROUP BY work_order_id` derived table (`MIN(starts_at)`, `MAX(ends_at)`, `SUM(duration_minutes)`). This visibly changes behavior for multi-task WOs (one aggregated row instead of N) — surface to product as a fix.

---

## 5. Implementation Phases

Phases are ordered by dependency: prerequisites → schedule model + migration → reads → engine + writes → events + dashboard → detail modal + polish. Every schema phase ends with the `migrations:diff` no-op gate.

| Phase | Size | Depends on | Can parallelize with |
|---|---|---|---|
| Phase | Size | Depends on | Can parallelize with |
|---|---|---|---|
| 0 Plumbing (FC deps + license) | S | — (gates **only** 7.2, the FullCalendar grid shell) | 1, 2, 3, 4 |
| 1 WO priority | S–M | — | 0, 2, 3, 4 |
| 2 Business hours + closures | M | — | 0, 1, 3, 4 |
| 3 Staff working hours | M | — | 0, 1, 2, 4 |
| 4 Per-line roster | L | — | 0, 1, 2, 3 |
| 5 Schedule model + migration | M | 1–4 | — |
| 6 Read endpoints + FE api/engines | L | 5 | — |
| 7 Engine + writes + interactive grid | **XL** (ships in slices 7.1–7.5 — see below) | 5–6; **7.2 also needs Phase 0** | 7.1 ∥ 7.2 |
| 8 Events + modal + polish | L | 7 | — |
| **9 CUTOVER + legacy code removal** | M (but highest risk) | 8 | — |
| 10 Drop `calendar_task` table | S | fast-follow, after soak | — |

**Phases 0–4 are all independent** and can run fully in parallel — Phase 0 is just FE dependency/license plumbing (nothing else needs FullCalendar until slice 7.2), and prereqs 1–4 are separate bounded contexts touching different modules. Phase 5 is the first real join point (the schedule model references priority, hours, closures, and roster). Phase 7 is the bulk of the feature and ships in slices. Rough sizes are relative effort, not estimates.

**Release mapping (no feature flag — D-0b): Phases 0–9 ship as ONE release.** Phases 0–8 are **inert** (new tables + endpoints + components exist, but `pages/Schedule.vue` still renders the legacy UI), so they can merge continuously without a flag — nothing user-facing changes until Phase 9 flips the references in the same release. **Deploy order inside that release: (1) schema migrations → (2) `app:schedule:migrate-calendar-tasks` (verify counts) → (3) new code serves traffic.** **Phase 10** is a small **fast-follow** ticket that only drops the `calendar_task` table once the release has soaked.

---

### Phase 0: Plumbing (dependencies + license wiring)
**Implements:** NFR-006
**Depends on:** Nothing (starting point)

> No feature-flag scaffold and no `LegacySchedulePage` extraction (D-0b) — the legacy page is left **entirely untouched** until Phase 9, where it is swapped and the legacy code deleted. Nothing in Phase 0 is user-visible.

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/package.json` + lockfile | Modify | Add the 6 FullCalendar v6 packages (**needs explicit user approval**). |
| `app/variables/.env.local.dist`, `.env.qa`, `.env.staging`, `.env.production` + GH Actions secret | Modify | `FULLCALENDAR_LICENSE_KEY` (see §0 — the slot exists on the CRM branches; port it and fill the real value via secret). Confirm `process.env` vs `import.meta.env` exposure through `app/variables/parser.js` (`vite.config.mts`). |

#### Verification:
- FE `npm ci` clean, eslint + `vue-tsc` pass, existing Schedule Vitest specs untouched and still green (nothing was edited).
- Compile gate: Vite up, no errors; bundle check that FullCalendar lands only in the lazy `schedule` chunk (NFR-006).
- Browser-walk: `/schedule` (admin) still renders the **existing** schedule unchanged — Phase 0 must be invisible.

---

### Phase 1: Prerequisite — WO priority
**Implements:** FR-P4
**Depends on:** Phase 0

#### Database:
| Change | Description |
|---|---|
| `api/migrations/VersionXXX.php` | `work_order.priority` nullable VARCHAR(6). |

#### Backend (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/VehicleService/WorkOrders/Domain/Priority.php` | Create | VO `high\|medium\|low`. |
| `WorkOrders/Domain/WorkOrder.php` + `Infrastructure/…/WorkOrder.orm.xml` | Modify | Nullable `priority` field + mapping. |
| `WorkOrders/Application/ChangePriority/{ChangePriorityCommand,Handler}.php` + `UI/HTTP/ChangePriority/…` | Create | Per the `ChangeBay` sibling pattern. |
| WO create command/handler, WO view + listing DTOs, WO-list filter query handler | Modify | Thread `priority` through; add filter column (coordinate with — do **not** couple to — the parked `wo-list-filters` branch). |

#### Frontend (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/work-orders/ts/WorkOrderDialog.vue`, `components/ts/work-orders/WorkOrder.vue` | Modify | High/Med/Low select (default unset). |
| `app/src/api/work-orders/WorkOrdersModel.ts` + queries | Modify | Payload/row types + change-priority mutation. |

#### Tests: `Priority` VO unit; functional change-priority (happy + 403 without edit perm); Vitest for the WO select; FE regression on WO create from both WO module and (later) schedule.
#### Verification: BE static + migration no-op + smoke; FE compile + browser-walk (set priority on a WO, reload).

---

### Phase 2: Prerequisite — shop business hours + closures
**Implements:** FR-P3
**Depends on:** Phase 0

#### Database: `workplace_business_hours`, `workplace_closure` (migrations).
#### Backend (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Organization/Workplaces/Domain/{BusinessHours,BusinessDay,Closure}.php` + repo interfaces | Create | Domain model. |
| `…/Infrastructure/Doctrine/*` + `*.orm.xml` | Create | Persistence + mappings. |
| `…/Application/BusinessHours/{View,Change}`, `…/Application/Closures/{Listing,Create,Delete}` + `UI/HTTP/BusinessHours/`, `UI/HTTP/Closures/` | Create | Canonical layout. |

#### Frontend (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/ts/administration/ScheduleSettings.vue` | Create | Business hours per weekday + closures CRUD; reachable from `AdminLeftMenuNav.vue`; also the "Schedule Settings" link target from the calendar's ViewOptions. |
| `app/src/api/administration/*` | Modify | Endpoints + query/mutation composables. |

#### Tests: functional GET/PUT + closures CRUD (permission split); Vitest settings form.
#### Verification: BE static + migration no-op + smoke; FE compile + browser-walk (set hours + a closure).

---

### Phase 3: Prerequisite — staff working hours
**Implements:** FR-P2
**Depends on:** Phase 0

#### Database: `staff_working_hours` (migration).
#### Backend (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Staff/Staff/Domain/WorkingHours.php` + repo interface | Create | Aggregate: staff+workplace+7 days. |
| `…/Infrastructure/Doctrine/*` + mapping | Create | Persistence. |
| `…/Application/WorkingHours/{View,Change}` + `UI/HTTP/WorkingHours/` | Create | GET/PUT full-replace. |

#### Frontend (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/office/ts/StaffWorkingHours.vue` | Create | Per-weekday enable + start/end incl. Sat/Sun; child of `StaffDialog.vue` (716 lines) to keep the dialog manageable. |
| `app/src/components/office/ts/StaffDialog.vue` | Modify | Mount the working-hours section. |
| `app/src/api/office/OfficeModel.ts` + queries | Modify | Endpoints + composables. |

#### Tests: functional GET/PUT (permission); Vitest for the weekday grid; **regression on staff create/edit** (shared dialog).
#### Verification: BE static + migration no-op + smoke; FE compile + browser-walk (set a tech's Sat hours).

---

### Phase 4: Prerequisite — per-line multi-tech roster
**Implements:** FR-P1, D11
**Depends on:** Phase 0

#### Database: `work_order_line_technician` (migration; FK per rules).
#### Backend (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/VehicleService/WorkOrders/Domain/Line/LineTechnician.php` + repo interface | Create | Roster entry. |
| `…/Domain/Line/Service/LineRosterSynchronizer.php` | Create | Derive-from-shifts sync (upsert on create; safe-remove on reassign/delete; never remove `source='manual'`). |
| `…/Infrastructure/Doctrine/*` + mapping | Create | Persistence; fetcher falls back to `Line.techAssignedId` when the table is empty (no backfill). |
| `…/UI/HTTP/Line/…` (`line-technicians` GET/PUT) | Create | Read/write. |

> Do **not** overload the existing `work_order_task` table (`Domain/Task/Task.php`) — it carries its own scheduling semantics and live consumers (`ListMyTasks`, `AvailableTechnicians`, `LinesDetailProvider`, reporting). Dedicated table only.

#### Frontend (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/ts/work-orders/LineDialog.vue` (1329 lines) | Modify | Replace single-`TechnicianSelect.vue` usage with a multi-select roster control (avatars + add/remove). |
| roster display in line lists | Modify | "Needs techs" badge + roster avatars — the schedule's read source. |

#### Tests: `LineRosterSynchronizer` unit (the Q3 matrix: remove-when-last-shift, keep-when-other-shift-exists, never-remove-manual); functional roster GET/PUT; **enumerate `TechnicianSelect.vue` consumers before replacing**; regression on line create/edit + tech-assignment/timesheet flows.
#### Verification: BE static + migration no-op + smoke; FE compile + browser-walk (add 2 techs to a line).

---

### Phase 5: Schedule model + data migration
**Implements:** FR-015, D1, D2, NFR-001
**Depends on:** Phases 1–4 (model references priority, hours, closures, roster)

#### Database: `schedule_shift`, `schedule_shift_line`, `schedule_event` (migrations + `MANUALLY_MANAGED_FOREIGN_KEYS` entries).
#### Backend (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/TaskManagement/Schedule/Domain/Model/{Shift,ScheduleEvent,ShiftLine,Color}.php` | Create | XOR invariant + intent methods `move()`, `resize()`, `reassign()`, `recolor()`; `Uuid` ids directly. |
| `…/Domain/Repository/{ShiftRepository,ScheduleEventRepository}.php` | Create | Interfaces; `findById` **workplace-scoped** (assert `WorkplaceDecorator::assertSameWorkplace`). |
| `…/Domain/Event/{ShiftCreated,ShiftReassigned,ShiftDeleted}.php` | Create | Feed roster sync (direct orchestration in handlers for transactional consistency; events for future consumers). |
| `…/Infrastructure/Persistence/Repository/Doctrine/*` + `*.orm.xml` | Create | Persistence. |
| `…/Application/Migration/CalendarTaskMigrator.php` + `…/UI/CLI/MigrateCalendarTasksCommand.php` | Create | Idempotent per-org migrator (§3). |

#### Tests: `Shift` invariants (XOR, duration>0); `CalendarTaskMigrator` unit (mapping table, workplace-resolution fallback chain, idempotent re-run, event vs service routing); **integration tenant-scoping tests are mandatory** (org-A cannot read org-B — the security delta being introduced).
#### Verification: BE static + **migration gate** (`migrate` then `migrations:diff` no-op) + run the migrator against a seeded calendar_task set and assert row counts/mapping. No FE.

---

### Phase 6: Read endpoints — board, shift detail, sidebar
**Implements:** FR-002 (data), FR-003 (data), FR-011 (data), NFR-004, D6
**Depends on:** Phase 5

#### Backend (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `…/Application/Query/Board/{BoardQuery,Handler,ScheduleBoardAssembler,DTOs}` | Create | Composite board payload; assembler glues fetchers + (Phase-7) engine. |
| `…/Application/Query/ShiftView/…`, `…/Application/Query/SidebarWorkOrders/…` | Create | Detail + sidebar. |
| `…/Infrastructure/Persistence/Query/Dbal/{DbalShiftFetcher,DbalScheduleEventFetcher,DbalScheduleResourceFetcher,DbalSidebarWorkOrderFetcher}.php` | Create | All `WorkplaceDecorator`-scoped on the root table; resource fetcher reuses the `staff_enrollment`/`department.display_on_schedule` join shape but splits resources from tasks. Sidebar adds `SearchDecorator` (wo.number/vin/contact/company/unit + tech) + `data.pagination`. **No pricing columns selected anywhere.** |
| `…/UI/HTTP/{Board,ShiftView,SidebarWorkOrders}/…` | Create | Controllers + RequestDtos. |

#### Frontend (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/api/schedule/{Model,index,keys,queries}.ts` + `tests/` | Create | Wire contract (UTC ISO → shop-local via SV-8038 remap); `scheduleQueryOptions({start,end})` staleTime:0 imperative fetch (mirror `api/calendar/queries.ts`); `sidebarWorkOrdersQueryOptions`; `useWorkingHoursQuery`/`useBusinessHoursQuery`. Barrel in `api/index.ts`. |
| `app/src/components/ts/schedule-next/composables/{useScheduleViewState,useConflictEngine,useCapacityEngine,useSeriesSpread}.ts` + tests | Create | Pure logic, testable before UI. Both resolve against Tech>Business>Default(7–19). `useConflictEngine` = **shifts only** (events never flagged); `useCapacityEngine` = shifts **+ staff-assigned events** (D5). |

#### Tests: BE functional board GET (shape + 403 without `ROLE_SCHEDULE_VIEW`), sidebar search+pagination, integration range-boundary + tenant scoping; FE Vitest for the engines (hierarchy, Saturday-with-hours, conflict=shifts-only, capacity=shifts+staff-events, OT boundary) + api module.
#### Verification: BE static + smoke (new GETs); FE compile.

---

### Phase 7: Conflict/capacity engine + shift writes + spread + interactive grid
**Implements:** FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-013, D3, D4, D7, D8, D10
**Depends on:** Phases 5–6

> ⚠️ **This is the largest phase — ship it in these ordered, independently-testable slices, not as one drop.** Each slice has its own DoD gate; don't start a slice before its dependency lands.
> - **7.1 — BE engine + write endpoints** (BE only): the 4 `Domain/Service` classes (unit-test-first), `Shift` Create/Change/Delete/Restore handlers, spread materialization, `ManageShiftVoter`, `AppointmentScheduler` port. Testable via functional tests with no FE. *Blocks 7.3–7.5.*
> - **7.2 — FE grid shell + views** (FE, read-only; depends on Phase 6 reads): FullCalendar host, Day/Week/Month view switch, renderers, dept grouping/collapse, weekend toggles, now-indicator, auto-scroll, My-Shifts filter. Browser-walk = views render real data. *Independent of 7.1.*
> - **7.3 — Sidebar + drag-to-create + move/resize/reassign + undo** (FE; depends on 7.1 writes + 7.2 shell): sidebar, `useExternalDrag`, LinePicker, optimistic mutations, `UndoToastHost`, reassign confirm, real `CellMenu` New-WO.
> - **7.4 — Conflicts + capacity display** (FE; depends on 7.1 engine output in the board response + 7.2): conflict styling, `ConflictsPopover` jump-to, capacity bars/OT/dialog.
> - **7.5 — Spread/series UI + scoped delete** (FE; depends on 7.1 spread/delete endpoints + 7.3): `SpreadDialog` (5 options + week preview + real closure-skip + 8-week cap), series render-grouping, `DeleteScopeDialog`, series undo.

#### Backend (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `…/Domain/Service/{WorkingWindowResolver,ShiftConflictDetector,CapacityCalculator,SeriesSpreader}.php` + `SeriesTooLongError` | Create | Pure, stateless, **unit-test-first** — the highest-value test surface. Resolver = Tech>Business>Default(7–19); detector = outside-window/closure/non-working, **`Shift[]` only** (all-day shift skips time check); capacity = Σ (shift + staff-assigned event) durations vs window (D5 — events count, dept-events excluded); spreader = closure/non-working skipping + 56-day soft + 120 hard cap. |
| `…/Application/Command/Shift/{Create,Change,Delete,Restore}/…` handlers | Create | Transactional; roster-sync port call inside the transaction; scope expansion (shift/day/series) server-side. |
| `…/Infrastructure/Security/ManageShiftVoter.php` | Create | Mirror `CreateCalendarTaskVoter`. |
| `…/UI/HTTP/Shift/…` (POST/PATCH/DELETE/restore) | Create | Controllers + RequestDtos. |
| WorkOrders `AppointmentScheduler` port + `schedule_shift` impl | Create | Define the port + implementation here; the actual dependency **swap** in `CreateCommandHandler` happens in Phase 9 so earlier phases stay inert. |
| Board assembler | Modify | Wire resolver/detector/capacity outputs into the board response. |

#### Frontend (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `schedule-next/composables/{useUndoableScheduleMutation,useExternalDrag}.ts` | Create | Commit-immediately + compensating-mutation undo (snapshot → optimistic → real mutation → 7s/4s toast → onSettled invalidate `scheduleKeys.all`); `Draggable` lifecycle. |
| `schedule-next/calendar/ScheduleCalendar.vue` + `renderers/*` | Create | FullCalendar host (one `<FullCalendar :options>`, computed view switch, `:key=range+date` remount). `eventContent` block renderer (3/4-line: customer+conflict icon / unit / VIN / lineName\|"N Lines"\|"week i of N"), `resourceLabelContent`, `monthDayCellContent` (capacity bar + OT), `timelineSlotLabel`. `eventMaxStack:3` lane stacking, `dayMaxEvents:3` overflow, `nowIndicator`, `scrollTime`, per-resource `businessHours`, `hiddenDays` weekend toggles. External drop → **always `revert()`** then own the create (LinePicker / placeScope). `eventDrop`/`eventResize` validate → revert-or-mutate. |
| `schedule-next/{SchedulePage,ScheduleToolbar}.vue` + toolbar popovers | Create | Layout shell + Today/prev/next/range toggle + Conflicts/Dept/ViewOptions popovers (My Shifts hidden when `userService.getStaffId()` undefined — fixes prototype `t1` stub). |
| `schedule-next/sidebar/{ScheduleSidebar,SidebarFilterPopover,SidebarWorkOrderCard,SidebarLinePanel}.vue` | Create | **Flat list + filter** (no tabs), virtualized, drill-in; drag sources. |
| `schedule-next/dialogs/{LinePickerPopover,SpreadDialog,DeleteScopeDialog,ReassignConfirmDialog}.vue`, `CellMenu.vue`, `capacity/*`, `UndoToastHost.vue` | Create | Drop → LinePicker; spread (5 options + week preview + **real closure skip** + 8-week cap warn/block); scoped delete; reassign confirm; CellMenu "New Work Order" opens the real `WorkOrderDialog.vue` (not a toast). |

#### Tests: BE unit (resolver full hierarchy matrix incl. Saturday-with-hours; detector inside/outside/straddle/all-day/closure, **shifts-only — event never produces a conflict**; capacity OT boundary + **staff-assigned event counts, dept-event excluded**; spreader closure-skip + DST-week + 56/120 caps; `LineRosterSynchronizer` matrix; `ManageShiftVoter`), Application handler unit (rollback, roster-sync invocation, scope expansion), functional (spread happy path N-rows-one-seriesId-closure-skipped, reassign own-data 403, delete scope=series, restore). FE Vitest (undo composable snapshot/compensate/error; series generator; adapters shifts→FC incl. month series merge; resources incl. dept lanes).
#### Verification: BE static + migration no-op + smoke; FE compile + **browser-walk** (drag WO to tech → create; move; resize; reassign confirm; spread a 2-week job across closures; scoped delete + undo; conflict styling on an out-of-hours drop). Watch console for red errors.

---

### Phase 8: Events + Dashboard back-compat + polish
**Implements:** FR-010, FR-012, FR-014, FR-016, D5, D9
**Depends on:** Phase 7

#### Backend (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `…/Application/Command/Event/{Create,Change,Delete}/…` + `…/UI/HTTP/Event/…` + voter twin | Create | No roster/conflict involvement; staff-assigned events feed capacity on read (D5). |
| `…/Application/ColorLabels/{View,Change}` + `UI/HTTP/ColorLabels/` | Create | Org/workplace 7-row renameable label store. |
| EXPLAIN pass on `GET /api/schedule/board` + `smoke-test.sh` additions | Modify | Index tuning against prod-sized data. |

#### Frontend (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `schedule-next/dialogs/{EventFormDialog,EventViewDialog,ShiftDetailDialog,ShiftLinesTable,ColorLabelPicker,ShiftNotes}.vue`, `ScheduleBlockTooltip.vue`, `capacity/CapacityDialog.vue` | Create | Event CRUD blocks (calendar-icon variant; counted in capacity, never conflict-flagged — D5); shift modal (**no `$`**, WO fields gated by `permissionService.canView('workOrders')`, drag-only reassign — no modal reassign action); color/label picker; hover tooltip. |
| view-state persistence, empty/loading states, **mobile (deferred — reuse existing)** | Modify | **Mobile is explicitly out of scope for v1** (eng lead). Default approach: **reuse the existing legacy mobile pattern** — legacy ships `ScheduleMobileMenu.vue` (a `q-menu` with date picker + view controls, async-loaded at `pages/Schedule.vue:31,258`), which is a lightweight menu rather than a full mobile grid; port that same shape over the new page so mobile users keep a usable control surface. **Implementer: before building it, ASK the user whether they have a different mobile design/approach to provide** — don't invent one. No mobile design frames exist in the design project as of 2026-07-22. |

#### Tests: BE functional event CRUD + working/business/closures; FE Vitest each dialog (render + emit spies) + tooltip.
#### Verification: BE static + smoke; FE compile + browser-walk (create/edit/delete event — confirm it moves the capacity bar but never shows a conflict; open shift modal — confirm zero `$`; rename a color label). Dark-mode pass on every new dialog/popover.

---

### Phase 9: CUTOVER — flip the references and delete the legacy code
**Implements:** FR-001, FR-016, NFR-008
**Depends on:** Phase 8

> The final phase of the **same release**. Everything here lands together; nothing is partially cut over. Rehearse the full deploy sequence on staging against production-shaped data first (D-0b).

| File | Action | Description |
|------|--------|-------------|
| `app/src/pages/Schedule.vue` | Modify | Replace the 1478-line legacy body with a thin host rendering `schedule-next/SchedulePage.vue`. Route + `requiredCheck` permission unchanged (`app/src/router/routes.ts`). |
| `api/src/Dashboard/Application/Query/Schedule/ScheduleQueryHandler.php` | Modify | Repoint all three raw-SQL sites to `schedule_shift` (aggregated `GROUP BY work_order_id`) — no fallback join (§4). |
| `api/src/VehicleService/WorkOrders/Application/Create/CreateCommandHandler.php` | Modify | Swap `WorkOrderCreateCalendarTaskService` → the `AppointmentScheduler` port writing `schedule_shift` (§4). |
| `e2e/**` (see §6) | Modify | **Mandatory, uncapped** reference-breakage rewrite — all legacy schedule specs + page objects retargeted to the new UI **in this same PR**; there is no flag-off grace period. |
| **Legacy code deletion** — `api/src/TaskManagement/Calendar/` (~72 files), `WorkOrderCreateCalendarTaskService`, `app/src/components/ts/schedule/` (15 components + 14 Vitest specs), `app/src/api/calendar/` | Delete | Same release: rollback is a redeploy of the previous image, which still contains this code, so keeping it in-tree buys nothing. FE consumers are confined to that folder + `pages/Schedule.vue`, so removal is self-contained; run the orphan check per `docs/patterns/vuex-module-removal.md`. **Do NOT drop the `calendar_task` table here** — that's Phase 10. |

#### Deploy sequence (ordered — this is the safety mechanism):
1. **Schema migrations** — additive; verify `doctrine:migrations:diff --allow-empty-diff` = "No changes detected".
2. **`app:schedule:migrate-calendar-tasks`** — run `--dry-run` first, then for real; verify mapped counts and the NULL-workplace count against the pre-run audit; confirm `calendar_task` row count **unchanged** (copy-only).
3. **New code serves traffic.**

#### Verification (all must pass before declaring cutover done):
- Full BE + FE static gates; `bin/smoke-test.sh` clean; migration diff a no-op.
- **Dashboard regression:** today/schedule/technician sections correct from `schedule_shift` (multi-task WOs now render one aggregated row — the intended fix).
- **WO-create smoke:** creating a WO with an appointment produces a `schedule_shift` row that appears on the board.
- **Full E2E schedule suite green** against the new UI.
- Browser-walk as admin + technician (own-data scoping) + a pricing-blind user (zero `$`); dark mode.
- `calendar_task` row count unchanged — proves the rollback net is intact.

---

### Phase 10: Drop the `calendar_task` table (fast-follow, separate ticket)
**Depends on:** the release soaked in prod (recommend ≥1 week, no rollback triggered)

The **only** deferred step, because it is the only irreversible one — while the table exists, a redeploy of the previous image is a complete rollback. Requires a verified backup and an explicit go/no-go. Also retire any now-unreferenced E2E dialog page objects.
- BE: delete `api/src/TaskManagement/Calendar/` (~72 files), remove `WorkOrderCreateCalendarTaskService`, **then** drop `calendar_task` (last, and only after a verified backup).
- FE: delete `app/src/components/ts/schedule/` (15 components + 14 Vitest specs) and `app/src/api/calendar/` — consumers are all inside that folder plus `pages/Schedule.vue`, so it's a self-contained removal; run the orphan check per `docs/patterns/vuex-module-removal.md`.
- E2E: delete the retired legacy dialog page objects once nothing references them.

---

## 6. Testing Strategy

### Unit tests
- **BE (bulk of value):** `WorkingWindowResolver` full matrix (tech/business/default × weekday × weekend; Saturday-with-tech-hours ⇒ working), `ShiftConflictDetector` (inside/outside/straddle/all-day-skip/closure/non-working; `Shift[]` only — an event input is impossible by type), `CapacityCalculator` (OT boundary, zero-window days, **staff-assigned event contributes, dept-event does not**), `SeriesSpreader` (closure skip, DST-crossing keeps local start, 56-day soft + `acknowledgeLongSeries`, 120 hard), `Shift` invariants, `LineRosterSynchronizer` (Q3 matrix), `Priority` VO, `ManageShiftVoter`, `CalendarTaskMigrator`. PHPUnit class-based syntax, attributes not annotations; no CLI-command tests (migrator tested via its service).
- **FE:** conflict engine (hierarchy, Saturday-with-hours, double-book, same-WO-nesting, **events never flagged**), capacity engine (per-tech OT, aggregate spill, **staff-assigned events included**), series generator (closures, cap warn/block, DST week), FC adapters (shifts→events incl. month series merge; resources incl. dept lanes), undo composable (snapshot/compensate/error), sidebar filter logic, each dialog (render + emit spies).

### Integration tests
- Each new Dbal fetcher — **tenant scoping mandatory** (org-A ≠ org-B), range-boundary correctness, sidebar search+pagination. FE↔API contract via the api-module tests (UTC↔local remap).

### Manual testing checklist
1. **Pre-cutover (build-up):** `/schedule` still renders the legacy schedule, unchanged; new endpoints return migrated data when called directly. 2. Three views render, dept grouping/collapse, weekend toggles, now-indicator, auto-scroll. 3. Drag WO→tech (line picker), drag line direct, spread across a closure (skipped), 8-week warn/block. 4. Move/resize/reassign (confirm) + undo within window. 5. Scoped delete (shift/following/series) + undo. 6. Conflict styling on out-of-hours drop; Saturday NOT flagged when tech has Sat hours; Conflicts popover jump-to. 7. Capacity bars + OT in day header / week columns / month cells; capacity dialog. 8. Events create/edit/delete — **moves the capacity bar, never shows a conflict** (D5). 9. Shift modal — **zero `$`**; WO fields hidden without WO:View. 10. My Shifts hidden for non-tech user. 11. **At cutover:** Dashboard today/schedule/tech sections correct from `schedule_shift` (multi-task WO = one aggregated row); WO-create appointment lands on the board. 12. Migrator idempotent re-run + `calendar_task` row count unchanged. 13. Dark mode across the whole feature. 14. Mobile width (per the Phase-8 parity decision).

### E2E tests
See per-phase `#### E2E tests` blocks and §9 rows.

**⚠️ Reference-breakage — mandatory, uncapped, and it all lands in the Phase 9 cutover PR.** Without a feature flag there is **no flag-off grace period**: the moment `pages/Schedule.vue` swaps, every spec below fails. This is the single largest consequence of D-0b and must be budgeted as part of Phase 9, not discovered during it. Full inventory (grep-verified):

| Surface | Files |
|---|---|
| Schedule specs (7) | `e2e/tests/ui/schedule/{assign-work-order-timeslot,custom-event-create,custom-event-edit,early-slot-timezone-render,event-info-edit,event-info-remove-carryover,navigation-bar}.spec.ts` |
| Page object (363 L) | `e2e/src/pages/schedule.page.ts` |
| Dialog page objects (3) | `e2e/src/pages/dialogs/{event-info,custom-event,time-slot}.dialog.ts` |
| Cross-module specs | `e2e/tests/ui/work-orders/scheduled-work-order-create.spec.ts`, `e2e/tests/ui/login.spec.ts` (nav assertion) |
| Permission specs | `e2e/tests/permissions/schedule-timeclock-portals.spec.ts`, `e2e/tests/permissions/custom/{schedule-enforcement,role-persona-enforcement}.spec.ts`, `e2e/src/permissions/chaos-monkey/permission-registry.ts`, `e2e/src/pages/permissions/permissions-helper.page.ts` |

Sequencing that keeps this tractable: build the new page objects during Phase 7 (against the new UI as it lands in dev), so Phase 9 is a **retarget + delete**, not a from-scratch rewrite under cutover pressure.

**New coverage (value-ranked, `batchCap = 5` per run):**

- **Test: Drag a work order onto a technician creates a shift** (Happy path, FR-004)
  1. Log in as admin; open `/schedule` (Day view). 2. Drag a sidebar WO card onto a tech row. 3. In the Line Picker, choose "Schedule whole work order". 4. Confirm.
  - **Expected:** a shift block appears on that tech's row with the WO customer/unit; `schedule_shift_block` present with `data-shift-id`; capacity bar increments.
- **Test: Spread a multi-day job skips a closure** (Happy path/Edge, FR-006)
  1. Seed a closure (e.g. next Friday) via settings. 2. Drag a >1-day-estimate line onto a tech; choose a series in the Spread dialog spanning that Friday.
  - **Expected:** the week preview omits Friday; created series has no shift on the closure day.
- **Test: Series length beyond 8 weeks warns/blocks** (Edge case, FR-006/D8)
  1. Spread a very long estimate past 8 weeks.
  - **Expected:** warning shown at the cap; submit without ack is blocked (or requires ack).
- **Test: Scoped delete of a series + undo** (Happy path, FR-007/FR-013)
  1. Create a series. 2. Delete with scope "Entire series". 3. Click Undo in the toast.
  - **Expected:** all series shifts removed on delete; all restored on undo.
- **Test: Out-of-hours shift is flagged; Saturday with tech hours is not** (Edge case, FR-008)
  1. Give a tech Saturday working hours. 2. Drop a shift on Saturday (no conflict) and one before shop open on a weekday (conflict).
  - **Expected:** Saturday block unflagged; early weekday block shows conflict styling + appears in the Conflicts popover.

**Backlog (deferred beyond batchCap — track for a follow-up run):** month "+N more" overflow interaction; **event counts-toward-capacity but is-not-conflict-flagged assertion** (D5); reassign-confirm cross-tech drag; My-Shifts-hidden-for-non-tech; shift-modal-no-`$` assertion; sidebar server-side search/pagination; color-label rename.

---

## 7. Rollout, Cutover & Rollback

### One-release cutover runbook (no feature flag — D-0b)

**Build-up (Phases 0–8) — merges continuously, invisible in prod.** Schema migrations, the new BE endpoints, and the whole new FE component tree can ship as they're finished: `pages/Schedule.vue` still renders the legacy UI, so nothing is user-reachable and no flag is needed. Note the schema migrations may deploy ahead of cutover — they're additive and inert.

**Staging rehearsal (mandatory) — do this before the prod cutover.** Restore production-shaped data to staging and execute the exact deploy sequence below end-to-end, including the migrator and the full E2E suite. This is what replaces a canary org.

**Cutover release (Phase 9) — ordered deploy:**
  1. **Schema migrations** (if not already deployed) — confirm `doctrine:migrations:diff --allow-empty-diff` = "No changes detected".
  2. **`app:schedule:migrate-calendar-tasks --dry-run`** → review the report → **run for real**. Verify against the audit baseline: total migrated ≈ 67,219; NULL-workplace rows ≈ 61; `calendar_task` row count **unchanged** (copy-only ⇒ rollback net intact). Re-run freely if anything looks off — it's idempotent.
  3. **New code serves traffic** (FE page swap + Dashboard repoint + `AppointmentScheduler` swap + legacy code deletion + rewritten E2E suite).
  4. **Verify immediately** per Phase 9's gate list (dashboard sections, WO-create appointment, board loads real data, E2E green).
  5. **Watch** Sentry + the schedule endpoints for the rest of the day. **Timing: low-traffic window, early in the week, team available** — not a Friday.

> The migration is small (67k rows, ~48.6k of them within the last 12 months and only 693 future-dated), so step 2 is fast — no batching or long-lock concerns.

**Fast-follow (Phase 10):** drop the `calendar_task` table after soak. This is the only step that ends revertibility.

### Rollback
- **Primary rollback = redeploy the previous container image.** The cutover changes only *references* (which page renders, which table the Dashboard reads, which service WO-create calls), and the migrator is copy-only — so the prior image still contains a fully working legacy schedule and `calendar_task` is intact and current up to the cutover moment. Legacy code being deleted from the branch is irrelevant: the image is immutable and still has it. **Cost vs a flag: minutes (a deploy) instead of seconds (a toggle), and it's fleet-wide — you cannot revert one org.** That is the accepted price of D-0b.
- **Data caveat (needs product sign-off):** shifts/events created in the new model *after* cutover are **not** back-migrated to `calendar_task` on a revert — that window's scheduling would be missing from the legacy view (the rows survive in `schedule_shift`, so a re-cutover loses nothing). A reverse-migration command is a bounded add-on if product won't accept the exposure; how quickly a problem is caught bounds the window.
- **Per-migration rollback:** every schema change is additive (new tables / one nullable column); down-migrations drop the new objects. `work_order.priority` is nullable → harmless if left behind.
- **Point of no return = Phase 10.** Dropping `calendar_task` ends revertibility; require a verified backup and an explicit go/no-go.

---

## 8. Security Considerations

- **NFR-001 Tenant scoping.** Every new Dbal query is `WorkplaceDecorator`-scoped on the new `workplace_id` column; `ShiftRepository::findById` asserts same-workplace (`WorkplaceDecorator::assertSameWorkplace`). This is a **security improvement** over the legacy module (whose write repo loaded by bare id with no decorator — a latent 🔴 tenant gap). Integration tenant-scoping tests are mandatory (Phases 5–6).
- **NFR-002 / D6 No pricing leak.** No schedule query SELECTs a pricing column and no DTO carries `$` — the masked-pricing-echo bug class is structurally impossible here. WO-derived fields (customer/unit/VIN/lines) are omitted server-side when the caller lacks Work Orders:View.
- **NFR-003 Permissions.** Reuse existing atoms only (`ROLE_SCHEDULE_VIEW/CREATE_AND_EDIT/DELETE`, `ROLE_WORK_ORDER_*`, `ROLE_USER_CREATE_AND_EDIT`, `ROLE_WORKPLACE_CHANGE`); `ManageShiftVoter` enforces own-data scoping for technician-template users (`isRestrictedToOwnData()`). No new permission plumbing.
- **No 🔴 Golden-Rule departures.** DTOs at all boundaries; canonical Controller/RequestDto/Command layout; UTC-canonical persistence. If any unavoidable exemption arises during implementation, record it in the PR's "Golden Rule Exemptions" block.

---

## 9. Requirement Traceability

> Derived requirements (no `/prd` doc). FR = functional, FR-P = prerequisite, NFR = non-functional.

| Requirement | Phase | Layer | Files | Status |
|-------------|-------|-------|-------|--------|
| FR-001 Full replacement (no flag) | 9 | App/API | `app/src/pages/Schedule.vue` (page swap), Dashboard repoint, `AppointmentScheduler` swap | Planned |
| FR-P4 WO priority | 1 | API/App | `WorkOrders/Domain/Priority.php`, `…/ChangePriority`, `WorkOrderDialog.vue`, `WorkOrdersModel.ts` | Planned |
| FR-P4 | 1 | E2E | (covered via sidebar filter, Backlog) | Planned |
| FR-P3 Business hours + closures | 2 | API/App | `Workplaces/Domain/{BusinessHours,Closure}`, `ScheduleSettings.vue`, `api/administration` | Planned |
| FR-P2 Staff working hours | 3 | API/App | `Staff/Domain/WorkingHours.php`, `StaffWorkingHours.vue`, `OfficeModel.ts` | Planned |
| FR-P1 Per-line roster | 4 | API/App | `Line/LineTechnician.php`, `LineRosterSynchronizer.php`, `LineDialog.vue` | Planned |
| FR-015 calendar_task migration | 5 | API | `Schedule/Application/Migration/CalendarTaskMigrator.php`, `UI/CLI/MigrateCalendarTasksCommand.php` | Planned |
| NFR-001 Tenant scoping | 5,6 | API | `Schedule/Infrastructure/Persistence/*`, `ShiftRepository` | Planned |
| FR-002 Three views | 6,7 | API/App | `Query/Board`, `ScheduleCalendar.vue`, renderers | Planned |
| FR-002 | 7 | E2E | `e2e/tests/ui/schedule/*` (rewritten at flag-flip) | Planned |
| FR-003 Sidebar flat+filter | 6,7 | API/App | `Query/SidebarWorkOrders`, `sidebar/*` | Planned |
| NFR-004 Sidebar search/pagination | 6 | API | `DbalSidebarWorkOrderFetcher` | Planned |
| FR-004 Drag-to-create | 7 | API/App/E2E | `Command/Shift/Create`, `useExternalDrag`, `LinePickerPopover.vue`, drag E2E | Planned |
| FR-005 Move/resize/reassign | 7 | API/App | `Command/Shift/Change`, `ScheduleCalendar.vue`, `ReassignConfirmDialog.vue` | Planned |
| FR-006 Spread/series | 7 | API/App/E2E | `SeriesSpreader.php`, `useSeriesSpread`, `SpreadDialog.vue`, spread E2E | Planned |
| FR-007 Scoped delete | 7 | API/App/E2E | `Command/Shift/Delete`, `DeleteScopeDialog.vue`, delete+undo E2E | Planned |
| FR-008 Conflict engine | 7 | API/App/E2E | `WorkingWindowResolver.php`, `ShiftConflictDetector.php`, `useConflictEngine`, conflict E2E | Planned |
| FR-009 Capacity viz | 7 | API/App | `CapacityCalculator.php`, `useCapacityEngine`, `capacity/*` | Planned |
| FR-013 Undo | 7 | API/App/E2E | `Command/Shift/Restore`, `useUndoableScheduleMutation`, `UndoToastHost.vue` | Planned |
| FR-010 Events | 8 | API/App | `Command/Event/*`, `EventFormDialog.vue`, `EventViewDialog.vue` | Planned |
| FR-011 Shift detail modal (no `$`) | 6,8 | API/App | `Query/ShiftView`, `ShiftDetailDialog.vue` | Planned |
| FR-012 Color labels | 8 | API/App | `Application/ColorLabels`, `ColorLabelPicker.vue` | Planned |
| FR-014 My Shifts / dept / weekend toggles | 7,8 | App | `useScheduleViewState`, toolbar popovers | Planned |
| FR-016 Dashboard repoint to `schedule_shift` | 9 | API | `Dashboard/Application/Query/Schedule/ScheduleQueryHandler.php` | Planned |
| NFR-002 No pricing leak | 6,8 | API/App | all schedule fetchers/DTOs, `ShiftDetailDialog.vue` | Planned |
| NFR-003 Permissions/own-data | 7 | API | `ManageShiftVoter.php` | Planned |
| NFR-005 UTC/DST | 5,6,7 | API/App | `Shift` time model, `SeriesSpreader`, SV-8038 remap in `api/schedule/queries.ts` | Planned |
| NFR-006 FC lazy chunk + license | 0 | App | `package.json`, `variables/*`, route chunk | Planned |
| NFR-007 Optimistic+refetch, caps | 7 | API/App | `SeriesSpreader` caps, `useUndoableScheduleMutation` | Planned |
| NFR-008 Revertible cutover (ordered deploy + retained table) | 9,10 | API/App | copy-only migrator, additive migrations, table retained until the Phase 10 fast-follow | Planned |
| NFR-009 E2E reference-breakage rewrite | 9 | E2E | `e2e/src/pages/schedule.page.ts`, `e2e/src/pages/dialogs/*`, `e2e/tests/ui/schedule/*`, permission specs (§6 inventory) | Planned |