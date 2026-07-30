# Schedule consolidation — PRE-EDIT BACKUPS — 2026-07-31

**What this folder is.** A byte-for-byte copy of EVERY Schedule case body as it stood immediately
BEFORE the 2026-07-31 user-authorized consolidation (20 merge groups + 2 cuts) and the 6 wording repairs.
One file per case, named `<internal-id>.json`, content = that case's exact JSON object from
`build/schedule/cases/cases-*.json` at pre-edit state.

**Authorization.** User-authorized 2026-07-31 (execution of the recommendations in
`build/schedule/quality-audit-2026-07-31/MERGE-PLAN.md` + the 6 FIX-WORDING items in
`USEFULNESS-AUDIT-2026-07-31.md`). Standing Rule 6 satisfied.

**Scope guard.** The HELD-pending-Branko cases were NOT touched: SCH-EVT-08 (C30615), SCH-CAP-01..04
(C30030–C30033), SCH-MODAL-08 (C30015). None of them appears in any merge group (verified
programmatically against `per-case-verdicts.csv` before any edit).

**Counts.** 190 active before → **165 active after** (23 merged-away members + 2 cuts retired).
49 pre-edit bodies backed up = 20 survivors + 23 members + 2 cuts + 6 repair targets (SCH-EVT-03 and
SCH-COLOR-02 are in two buckets each, so the union is 49).

## Recovery instructions

To restore any case exactly as it was before this pass:

```bash
# restore ONE case (e.g. SCH-NAV-01) back into its cases-*.json
python3 - <<'PY'
import json, glob
cid = 'SCH-NAV-01'
orig = json.load(open(f'build/schedule/consolidation-backup-2026-07-31/{cid}.json'))
for f in glob.glob('build/schedule/cases/cases-*.json'):
    lst = json.load(open(f))
    for i, c in enumerate(lst):
        if c['id'] == cid:
            lst[i] = orig
            json.dump(lst, open(f, 'w'), indent=2, ensure_ascii=False)
            print('restored', cid, 'in', f)
PY
```

A retired/merged-away member is ALSO recoverable in TestRail only by re-`add_case` (its C-id was
`delete_case`d and TestRail does not resurrect ids) — the body here is the authoritative source for that.
The local JSON keeps every retired body in place (never deleted), marked `viu_status: "Retired - ..."`,
so nothing is lost even without this folder; this folder additionally preserves the SURVIVORS' pre-fold state.

## Merge groups — member → survivor → what the survivor gained

| Group | Survivor (kept) | Survivor title after | Absorbed (retired + deleted) | What the survivor gained |
|---|---|---|---|---|
| G-AUTOSCROLL | SCH-DAY-01 — C30001 (https://shopview.testrail.io/index.php?/cases/view/30001) | Day view auto-scrolls to the working-day start; manual scrolling stands | SCH-DAY-02 — C30002 (https://shopview.testrail.io/index.php?/cases/view/30002) | manual scroll is not overridden; the full 24-hour timeline stays scrollable; only day navigation re-triggers auto-scroll (steps 2-4, Expected 3-5) |
| G-CELL-MENU | SCH-REAS-03 — C30054 (https://shopview.testrail.io/index.php?/cases/view/30054) | Right-click a grid cell opens a menu with Create Event and New Work Order | SCH-REAS-04 — C30055 (https://shopview.testrail.io/index.php?/cases/view/30055)<br>SCH-REAS-05 — C30056 (https://shopview.testrail.io/index.php?/cases/view/30056) | the menu contains ONLY 'Create Event' + 'New Work Order' — explicitly no 'View Day' and no 'New Shift' (Expected 3-4) |
| G-DRILLDOWN-OPEN | SCH-LINE-01 — C29948 (https://shopview.testrail.io/index.php?/cases/view/29948) | Work order card opens the line drill-down in place, with header and back control | SCH-LINE-02 — C29949 (https://shopview.testrail.io/index.php?/cases/view/29949) | the drill-down header read — work order id + line count matching the approved lines (step 3, Expected 2-3) |
| G-ENTER | SCH-KEY-03 — C30068 (https://shopview.testrail.io/index.php?/cases/view/30068) | Enter confirms the active dialog, but not inside a note textarea | SCH-KEY-04 — C30069 (https://shopview.testrail.io/index.php?/cases/view/30069) | the Enter-inside-a-textarea exception — Enter inserts a new line in the note and never confirms (step 5, Expected 3-4) |
| G-ESCAPE | SCH-KEY-01 — C30066 (https://shopview.testrail.io/index.php?/cases/view/30066) | Escape closes the topmost open modal or popover, following the stacking order | SCH-KEY-02 — C30067 (https://shopview.testrail.io/index.php?/cases/view/30067) | the in-modal sub-picker escapes (colour picker, time picker, note edit each close first, then the modal) as explicit layers (steps 1-3, Expected 1-3) |
| G-EVENT-MODAL | SCH-EVT-03 — C30018 (https://shopview.testrail.io/index.php?/cases/view/30018) | Event modal fields all save; the all-day toggle creates an all-day event | SCH-EVT-04 — C30019 (https://shopview.testrail.io/index.php?/cases/view/30019) | the all-day toggle behaviour — time fields not required, event renders as an all-day block (steps 3-4, Expected 4-5) |
| G-HOURS-CONFLICT | SCH-CONF-03 — C30025 (https://shopview.testrail.io/index.php?/cases/view/30025) | Before-hours and after-hours shifts are flagged against the tech's hours | SCH-CONF-04 — C30026 (https://shopview.testrail.io/index.php?/cases/view/30026) | the after-hours mirror — same shift extended past the working-day end, second reason sentence observed in the same sitting (steps 3-4, Expected 2) |
| G-HRS-LOCATION | SCH-HRS-02 — C38847 (https://shopview.testrail.io/index.php?/cases/view/38847) | Business-hours toggle reveals a per-day (Mon-Sun) From-To editor | SCH-HRS-01 — C38846 (https://shopview.testrail.io/index.php?/cases/view/38846) | the 'Set business hours for this shop' toggle label, its off-by-default state and the reveal (steps 1-2, Expected 1-2) |
| G-HRS-VALIDATION | SCH-HRS-06 — C38851 (https://shopview.testrail.io/index.php?/cases/view/38851) | Overlapping hour ranges block Save; incomplete rows are ignored | SCH-HRS-07 — C38852 (https://shopview.testrail.io/index.php?/cases/view/38852) | the incomplete-row-ignored rule as a second validation scenario in the same editor (steps 3-4, Expected 4-5) |
| G-NAV-LANDING | SCH-NAV-01 — C29925 (https://shopview.testrail.io/index.php?/cases/view/29925) | Schedule opens from the top-level navigation into a sidebar + grid layout | SCH-NAV-02 — C29926 (https://shopview.testrail.io/index.php?/cases/view/29926) | the two-region layout read — sidebar (mini calendar + WO list) / grid (technician rows + toolbar) (step 3, Expected 3-4) |
| G-SAMEDAY-LANE | SCH-LANE-01 — C29996 (https://shopview.testrail.io/index.php?/cases/view/29996) | Non-overlapping same-day shifts share one lane, even from different orders | SCH-LANE-05 — C30000 (https://shopview.testrail.io/index.php?/cases/view/30000) | the two non-overlapping same-day shifts now come from TWO DIFFERENT work orders, proving multi-WO same-day scheduling in the same observation |
| G-SCOPE-CONTENTS | SCH-SCOPE-01 — C29963 (https://shopview.testrail.io/index.php?/cases/view/29963) | Scope picker contents: the pinned whole-order row and the line rows | SCH-SCOPE-04 — C29966 (https://shopview.testrail.io/index.php?/cases/view/29966) | the line-row contents — line title, estimated hours, roster avatar stack + count (step 3, Expected 4-5) |
| G-SCOPE-MULTI | SCH-SCOPE-05 — C29967 (https://shopview.testrail.io/index.php?/cases/view/29967) | 'Select multiple' checkbox mode: running tally, Select all, and Cancel | SCH-SCOPE-06 — C29968 (https://shopview.testrail.io/index.php?/cases/view/29968) | 'Select all' (tally equals the whole order) and Cancel (returns to the single-tap list, creates nothing) (steps 4-5, Expected 3-4) |
| G-SHIFT-COLOR | SCH-COLOR-02 — C30072 (https://shopview.testrail.io/index.php?/cases/view/30072) | Shift modal color picker recolors that shift only, in matching tones | SCH-BLOCK-04 — C29994 (https://shopview.testrail.io/index.php?/cases/view/29994) | colour is per SHIFT not per work order — the sibling shift from the same order keeps its default blue (step 4, Expected 3); the stale per-WO open question dropped |
| G-SIDEBAR-SEARCH | SCH-WOL-04 — C29939 (https://shopview.testrail.io/index.php?/cases/view/29939) | 'Search work orders' matches work order number, customer, unit, and technician | SCH-WOL-03 — C29938 (https://shopview.testrail.io/index.php?/cases/view/29938) | the work-order-number search as a fourth search, so one case proves all four searchable card fields (step 1, Expected 1) |
| G-SPREAD-HEADER | SCH-SPREAD-02 — C29978 (https://shopview.testrail.io/index.php?/cases/view/29978) | Spread step header shows the scope; 'Change scope' returns to the picker | SCH-SPREAD-01 — C29977 (https://shopview.testrail.io/index.php?/cases/view/29977) | the spread-step header assertions — step 2 of the same modal, chosen scope shown, 'Change scope' present — before the back-link is clicked (step 2, Expected 1-3) |
| G-UNDO | SCH-DEL-09 — C30065 (https://shopview.testrail.io/index.php?/cases/view/30065) | Every create/delete/move/reassign toasts with Undo, and Undo restores | SCH-DEL-07 — C30063 (https://shopview.testrail.io/index.php?/cases/view/30063) | the toast-appears-with-Undo assertion per action type (create/delete/move/reassign) folded into the undo-restores case (step 1, Expected 1) |
| G-VIEW-TOGGLES | SCH-VIEW-05 — C30046 (https://shopview.testrail.io/index.php?/cases/view/30046) | 'View Options': six toggles with defaults; Capacity Bars and Events flip | SCH-VIEW-07 — C30048 (https://shopview.testrail.io/index.php?/cases/view/30048)<br>SCH-VIEW-08 — C30049 (https://shopview.testrail.io/index.php?/cases/view/30049) | the two pure show/hide flips (Capacity Bars off/on, Events off/on) as steps after the six-toggle defaults read (steps 3-4, Expected 3-4) |
| G-VIN-TOGGLE | SCH-VIEW-04 — C30045 (https://shopview.testrail.io/index.php?/cases/view/30045) | 'VIN Number' toggle gates the block VIN only - tooltip and modal always show it | SCH-BLOCK-03 — C29993 (https://shopview.testrail.io/index.php?/cases/view/29993)<br>SCH-DAY-07 — C30007 (https://shopview.testrail.io/index.php?/cases/view/30007) | the block VIN line in day+week only, the month omission, and the day-view lane growing so text is not clipped (steps 3-4, Expected 2-4) |
| G-WEEK-EXPORT | SCH-EXP-01 — C38853 (https://shopview.testrail.io/index.php?/cases/view/38853) | Week Export opens a printable Department-by-Technician week grid | SCH-EXP-02 — C38854 (https://shopview.testrail.io/index.php?/cases/view/38854) | the exported-content checks — department headers, technician rows, shifts in the correct day columns, week date range (step 3, Expected 3-5) |

Survivor titles that CHANGED (all ≤ 80 chars per the 2026-07-27 concise-title rule):

- **SCH-DAY-01** (C30001 (https://shopview.testrail.io/index.php?/cases/view/30001)): `Day view auto-scrolls on load and day navigation so the working-day start sits at the left edge (with a small buffer)` → `Day view auto-scrolls to the working-day start; manual scrolling stands` (71 chars)
- **SCH-LINE-01** (C29948 (https://shopview.testrail.io/index.php?/cases/view/29948)): `Clicking a work order card replaces the list in place with that order's lines, with a back control` → `Work order card opens the line drill-down in place, with header and back control` (80 chars)
- **SCH-KEY-03** (C30068 (https://shopview.testrail.io/index.php?/cases/view/30068)): `Enter confirms the active confirmable dialog (delete scope, reassign, spread, event create/edit)` → `Enter confirms the active dialog, but not inside a note textarea` (64 chars)
- **SCH-EVT-03** (C30018 (https://shopview.testrail.io/index.php?/cases/view/30018)): `Event modal offers name, date, start/end time, an all-day toggle, and a color category` → `Event modal fields all save; the all-day toggle creates an all-day event` (72 chars)
- **SCH-CONF-03** (C30025 (https://shopview.testrail.io/index.php?/cases/view/30025)): `Before hours: a shift starting before the technician's configured working-day start is flagged` → `Before-hours and after-hours shifts are flagged against the tech's hours` (72 chars)
- **SCH-HRS-02** (C38847 (https://shopview.testrail.io/index.php?/cases/view/38847)): `Edit Location shows a per-day (Mon-Sun) From-To business-hours editor` → `Business-hours toggle reveals a per-day (Mon-Sun) From-To editor` (64 chars)
- **SCH-HRS-06** (C38851 (https://shopview.testrail.io/index.php?/cases/view/38851)): `Overlapping hour ranges flag red with a message and disable Save` → `Overlapping hour ranges block Save; incomplete rows are ignored` (63 chars)
- **SCH-NAV-01** (C29925 (https://shopview.testrail.io/index.php?/cases/view/29925)): `Schedule appears as a top-level navigation item` → `Schedule opens from the top-level navigation into a sidebar + grid layout` (73 chars)
- **SCH-LANE-01** (C29996 (https://shopview.testrail.io/index.php?/cases/view/29996)): `Shifts whose times do not overlap share a single lane - the row keeps its normal height` → `Non-overlapping same-day shifts share one lane, even from different orders` (74 chars)
- **SCH-SCOPE-01** (C29963 (https://shopview.testrail.io/index.php?/cases/view/29963)): `'Schedule whole work order' is pinned at the top, visually distinct, labeled with line count and total hours` → `Scope picker contents: the pinned whole-order row and the line rows` (67 chars)
- **SCH-SCOPE-05** (C29967 (https://shopview.testrail.io/index.php?/cases/view/29967)): `'Select multiple' switches rows to checkboxes with a confirm bar showing a running tally` → `'Select multiple' checkbox mode: running tally, Select all, and Cancel` (70 chars)
- **SCH-COLOR-02** (C30072 (https://shopview.testrail.io/index.php?/cases/view/30072)): `Choosing a color from the shift modal's picker recolors the shift with matching background, text, and accent tones` → `Shift modal color picker recolors that shift only, in matching tones` (68 chars)
- **SCH-WOL-04** (C29939 (https://shopview.testrail.io/index.php?/cases/view/29939)): `'Search work orders' matches customer name, unit number, and technician name` → `'Search work orders' matches work order number, customer, unit, and technician` (78 chars)
- **SCH-SPREAD-02** (C29978 (https://shopview.testrail.io/index.php?/cases/view/29978)): `'Change scope' returns from the spread step to the scope picker` → `Spread step header shows the scope; 'Change scope' returns to the picker` (72 chars)
- **SCH-DEL-09** (C30065 (https://shopview.testrail.io/index.php?/cases/view/30065)): `Undo restores the state before the action - for delete, move, and reassign` → `Every create/delete/move/reassign toasts with Undo, and Undo restores` (69 chars)
- **SCH-VIEW-05** (C30046 (https://shopview.testrail.io/index.php?/cases/view/30046)): `'View Options' popover offers Business Hours, Capacity Bars, Events, Tech Hours, Saturday, Sunday with the spec defaults` → `'View Options': six toggles with defaults; Capacity Bars and Events flip` (72 chars)
- **SCH-VIEW-04** (C30045 (https://shopview.testrail.io/index.php?/cases/view/30045)): `The 'VIN Number' toggle adds the VIN to shift blocks (day/week) only; the hover tooltip and the detail modal always show the VIN` → `'VIN Number' toggle gates the block VIN only - tooltip and modal always show it` (79 chars)

Survivor titles left UNCHANGED (still accurate after the fold): SCH-REAS-03 (C30054 (https://shopview.testrail.io/index.php?/cases/view/30054)), SCH-KEY-01 (C30066 (https://shopview.testrail.io/index.php?/cases/view/30066)), SCH-EXP-01 (C38853 (https://shopview.testrail.io/index.php?/cases/view/38853)).

## Outright cuts (retired + deleted, bodies kept)

| Case | C-id | Why cut |
|---|---|---|
| SCH-START-08 | C29976 (https://shopview.testrail.io/index.php?/cases/view/29976) | Duplicate sweep — its steps re-run SCH-START-01..05, each of which already reads the created shift's start time; the 'every shift has a start time' invariant adds no new observation. Refs for the trail: `SV-8688 (§4.2, §12)`. |
| SCH-EDGE-01 | C30085 (https://shopview.testrail.io/index.php?/cases/view/30085) | Duplicate of SCH-SPREAD-10 (C29986 (https://shopview.testrail.io/index.php?/cases/view/29986)) — same setup and same assertion; SCH-SPREAD-10's Expected 3 states it verbatim. Refs for the trail: `SV-8691 (§12, §4.5)`. |

## The 6 wording repairs (FIX-WORDING)

| Case | C-id | Field | Before | After |
|---|---|---|---|---|
| SCH-PERM-02 | C30075 (https://shopview.testrail.io/index.php?/cases/view/30075) | expected[3] | 3. The right-click context menu does not appear (no New Shift / New Event / View Day creation entry points). | 3. The right-click context menu does not appear (no creation entries - no 'Create Event' and no 'New Work Order'). |
| SCH-PERM-04 | C30077 (https://shopview.testrail.io/index.php?/cases/view/30077) | steps[2] | 2. Right-click a cell and create an event via 'New Event'; in day view, click empty space to create. | 2. Right-click a cell and create an event via 'Create Event'; in day view, click empty space to create. |
| SCH-EVT-03 | C30018 (https://shopview.testrail.io/index.php?/cases/view/30018) | preconditions[2] | 2. You are on the Schedule page with the event modal open (via right-click 'New Event'). | 2. You are on the Schedule page with the event modal open (via right-click 'Create Event'). |
| SCH-COLOR-02 | C30072 (https://shopview.testrail.io/index.php?/cases/view/30072) | notes | Whether recoloring one shift recolors all blocks of the same work order (§4.4 ties color to the WO) - observe and record. | REMOVED (per-SHIFT rule now asserted in Expected 3) |
| SCH-REAS-06 | C38855 (https://shopview.testrail.io/index.php?/cases/view/38855) | expected[3] | 3. The exact target flow (toast or navigation) is confirmed during live testing. | MOVED to notes (Expected 1-2 are now the pass bar) |
| SCH-SPREAD-08 | C29984 (https://shopview.testrail.io/index.php?/cases/view/29984) | expected[3] | 3. Skipped days are struck through and show the reason they are skipped (weekend / closure). | 3. Skipped days are struck through and show the reason they are skipped - in V1 the only skip reason is a weekend day with no working hours set. |

> Note: the audit report's FIX-WORDING table listed three C-ids one-off (SCH-PERM-02 as C30074,
> SCH-PERM-04 as C30076, SCH-COLOR-02 as C30070). The authoritative values from
> `build/schedule/testrail-id-map.csv` (and `per-case-verdicts.csv`, which agrees with it) are
> **C30075 / C30077 / C30072** — those are the ids used for every write in this pass.

## Not done in this pass (still pending)

- **Title trims:** the over-80-character title backlog was NOT the subject of this pass. It stood at 98
  titles before; it is **79** after (19 of the over-length titles belonged to merged-away members, and a
  further batch was shortened as part of a survivor's new title). Still pending as its own authorized pass.
- **HELD items:** SCH-EVT-08 (C30615) + SCH-CAP-01..04 (C30030–C30033) events-count-toward-capacity, and
  SCH-MODAL-08 (C30015) modal 'Reassign' — untouched, still awaiting Branko.
- **19 WEAK-KEEP cases:** flagged by the audit, recommendation is KEEP (tag as build-acceptance /
  verify-once); no action authorized or taken.
