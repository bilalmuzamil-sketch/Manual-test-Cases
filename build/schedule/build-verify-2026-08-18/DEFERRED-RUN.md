# DEFERRED build-verification run list — Schedule (2026-08-18)

> Local list (NOT a TestRail run). One row per Schedule case whose feature was **not found in the
> build** during live build-verification (Standing Rule 69 / skill `03-RUN-CHECK.md` §7.4). These keep
> the `AUTOMATION: Not available on Build to test Yet - Last checked <date>` marker + the
> under-development line, and are re-checked when the feature ships (the trigger is the **feature
> shipping**, not a redeploy alone). On success the marker lifts to `READY` (or
> `READY - EXPECT FAIL (SV-xxxx)` on a live-backed failure) via the §6.4 Vlad hand-off.

Build under test at scoping: **`v3.8-bd246fd`** (2026-08-18 19:57:31 GMT).

| C-id | internal | section | feature / story it waits on | last checked | build marker |
|---|---|---|---|---|---|
| SCH-FILT-04 | [C29945](https://shopview.testrail.io/index.php?/cases/view/29945) | 4258 Sidebar - WO Filters | Priority filter (High/Med/Low) — story SV-8687 §5.1 | 8/18/2026 | v3.8-bd246fd |
| SCH-DAY-05 | [C30005](https://shopview.testrail.io/index.php?/cases/view/30005) | 4267 Day View Timeline | Shift edge-resize (no fc-event-resizer handles) — SV-8694/SV-9244 §4.8 | 8/18/2026 | v3.8-bd246fd |
| SCH-DAY-08 | [C43812](https://shopview.testrail.io/index.php?/cases/view/43812) | 4267 Day View Timeline | Day-view pixels-per-hour zoom control — SV-9244 §3.2/§4.6/§4.8/§6 | 8/18/2026 | v3.8-bd246fd |
| SCH-DAY-09 | [C43813](https://shopview.testrail.io/index.php?/cases/view/43813) | 4267 Day View Timeline | Day-view continuation chevron on a clipped block (NOT-ESTABLISHED: mechanism seen in Week view; day-view clip not producible) — SV-9244 §3.2/§4.6/§4.8/§6 | 8/18/2026 | v3.8-bd246fd |

---

## Batch B (Scheduling core — Drag/Scope/Spread/Shift lifecycle, 66 cases) — **0 NEW DEFERRED**

Batch B added **no** "feature not found" rows. Every feature area in scope rendered live on
`v3.8-bd246fd`, so all 25 batch-B cases that had carried the `Not available on Build to test Yet`
marker from the 2026-08-17 authoring pass were **lifted to `AUTOMATION: READY`** (see
`B-EXECUTION.md` "Marker transitions"). Two cases assert behaviour the build does not perform
(C29962 click-to-arm, C43555 Month-view drag) but their features (drag, Month view) ARE built — they
are recorded as deviations in `B-FINDINGS.md §2`, not as deferred/not-built, and stay `READY` so the
manual tester runs and records them (§15.1). **Nothing from batch B is on this deferred list.**

---

## Batch C (Events · Conflicts · Capacity · Deletion · Keyboard · Permissions · Edge · Working Hours · Cross-Module · API, 68 cases) — **0 NEW DEFERRED**

Batch C added **no** "feature not found" rows. Every feature area in scope rendered/served live on
`v3.8-da72171`: events (create-event menu + modal + colored/distinct event cards), conflict detection
(5 double-booked shifts + `conflicts-pill` + navigable dropdown), capacity bars (bar + OT tag + hover
breakdown + per-tech detail modal), series-delete scope dialog (3 scopes), undo toast, keyboard
(Escape/focus-trap), permissions (View tier live via quick-login; tier model via roles API), dark mode,
responsive panel, business-hours per-day editor, cross-module (WO priority field), and the Schedule API
(no-pricing + cross-location-404 confirmed). All 64 non-Automated cases were **lifted to / kept
`AUTOMATION: READY`**. The 4 Automated cases (C38847-50) are HELD (write nothing, `C-HELD-AUTOMATED.md`);
two of them (C38848/C38849) are **observation-limited by a Staff-admin-table render quirk, which is a
harness limit — NOT feature absence** (the staff API returns a populated collection), so they are **not**
deferred/not-built either. **Nothing from batch C is on this deferred list.**

---

## 2026-08-19 RE-CHECK (build v3.8-d0e135e) — DEFERRED / carry-forward

This bug-fix redeploy (same v3.8 minor, Rule 60) was re-checked by driving the front-end screens Stefan
touched. **94 cases were re-driven+re-stamped** to `v3.8-d0e135e`; the following are DEFERRED to a
follow-up build-verify sync and **carry their prior `v3.8-bd246fd`/`da72171` stamp** (verdicts provisional):

1. **Sections NOT individually re-driven this pass (honest N-of-M, Rule 74):** 4259 Line Drill-Down ·
   4260 Drag-and-Drop mechanics (except defects C43555/C29962) · 4261 Scope Picker · 4262 Shift Start &
   Unassigned · 4268 Shift Detail Modal · 4269 Events · 4272 Hover Tooltips · 4275 Reassignment & Context
   Menu · 4276 Deletion/Undo · 4277 Keyboard · 4278 Color · 4280 Edge/Responsive · 5405 Working Hours ·
   5408 Cross-Module · 5409 API. Feature areas confirmed present in batch A/B/C; not per-case re-observed
   on v3.8-d0e135e. **Trigger: a follow-up full build-verify sync.**

2. **Deferred/not-built (Rule 69) — features still ABSENT, keep "Not available on Build" marker:**
   C30005 (shift edge-resize), C43812 (day-view pixels-per-hour zoom), C43813 (day-view continuation
   chevron on a clipped block). Re-check when those features ship.

3. **RAW-MARKUP repair (demark) needed — 3 cases carry pre-existing raw `<ol>/<li>` in stored text
   (authoring defects predating this pass):** C43554 (got its v3.8-d0e135e stamp; markup unchanged),
   C43806, C43807. Need a formatting-only demark → plain numbered lines. NOTE: while the TestRail
   `update_case` wrap block is active, cases are written in the interim `<br>` format; a proper demark of
   these three should be done in the same pass that lifts the wrap block (or accept the `<br>` interim).

4. **Permission tiers NOT isolated this pass (rest on the live-proven FE-gate + confirmed model):**
   C30076 (nav-off — needs a no-scheduleView login; no active Sales-Rep holder, Tech role-swap staff_id
   unresolvable on org d55bc308), C30078 (Edit-without-Delete — needs a custom role), C30081 / C30614
   (Schedule without Work Orders:View — needs a custom role). A follow-up pass with a resolvable Tech
   staff_id, or seeded custom roles, isolates each tier.
