#!/usr/bin/env python3
"""Schedule suite — Ruthless Usefulness Audit 2026-07-31 — generates per-case-verdicts.csv.

Source snapshot: build/schedule/cases/*.json at git SHA 7eeb74548eae665f5ac5110512fddc0c8550db41
(working tree clean for build/schedule at audit start). NO case files are modified;
NO TestRail writes (Standing Rule 6) — recommendation only.

Population: 191 authored bodies − 1 Retired (SCH-REAS-02, deleted from TestRail
2026-07-22, ex C30053) = 190 ACTIVE scored (Rule 17: 100%, no sampling).

Dimension 1 (usefulness): KEEP / MERGE (member absorbed into a named survivor) /
WEAK-KEEP / CUT. Merge SURVIVORS are KEEP (they gain the members' checks);
merge MEMBERS are MERGE.
Dimension 2 (sense): SENSIBLE / FIX-WORDING / NONSENSE (cold read, 6 fail
conditions; NOTE: this is a SPEC-ONLY suite never seen live — a VIU-confirm flag
is NOT nonsense; nonsense = internally broken/unexecutable/contradictory/
invented-beyond-sources).
Dimension 3 (genuine + layman): refs_ok (Rule 20 ticket+anchor traceability) +
title_over_80 (concise-title rule 2026-07-27 — suite authored 2026-07-21/22,
violations listed for fix-when-next-touched).
Tier: T1 = core regression value (run every cycle); T2 = build-acceptance /
verify-once (anatomy, styling, perf perception, one-time cutover regression).
The KEEP-but-NONSENSE embarrassment check is asserted at the end (must be empty).

HELD-pending-Branko context (PROJECT-STATE §0.0-EPIC): SCH-EVT-08 (C30615) +
SCH-CAP-01..04 (D1 events-count-toward-capacity) and SCH-MODAL-08 (C30015)
(D4 modal 'Reassign') are scored AS AUTHORED with the hold noted in the reason.
"""
import json, glob, csv, collections, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(HERE)  # build/schedule
OUT = os.path.join(HERE, 'per-case-verdicts.csv')
SNAP_SHA = '7eeb74548eae665f5ac5110512fddc0c8550db41'

# ---------------------------------------------------------------- merge groups
# group -> (survivor, [members], what the survivor gains)
MERGES = {
 'G-NAV-LANDING':   ('SCH-NAV-01', ['SCH-NAV-02'],
   'the two-region layout (sidebar with mini calendar + WO list / grid with toolbar) becomes 2 expected lines of the nav/open case'),
 'G-CELL-MENU':     ('SCH-REAS-03', ['SCH-REAS-04', 'SCH-REAS-05'],
   "the menu case asserts the menu contains ONLY 'Create Event' + 'New Work Order' — explicitly no 'View Day' and no 'New Shift' (two removed-item lines fold in)"),
 'G-SIDEBAR-SEARCH':('SCH-WOL-04', ['SCH-WOL-03'],
   'the work-order-number search becomes a fourth search step, so one case proves all four searchable card fields'),
 'G-DRILLDOWN-OPEN':('SCH-LINE-01', ['SCH-LINE-02'],
   'the drill-down header read (work order id + line count matching approved lines) becomes an expected line of the open/back case'),
 'G-SCOPE-CONTENTS':('SCH-SCOPE-01', ['SCH-SCOPE-04'],
   'the line-row contents (title, estimated hours, roster avatar stack + count) become expected lines — one read-the-picker case'),
 'G-SCOPE-MULTI':   ('SCH-SCOPE-05', ['SCH-SCOPE-06'],
   "'Select all' (tally equals the whole order) and Cancel (returns to the single-tap list, creates nothing) become final steps of the checkbox-mode case"),
 'G-SPREAD-HEADER': ('SCH-SPREAD-02', ['SCH-SPREAD-01'],
   "the spread-step header assertions (step 2 of the same modal, chosen scope shown, 'Change scope' present) become expected lines before the back-link is clicked"),
 'G-VIN-TOGGLE':    ('SCH-VIEW-04', ['SCH-BLOCK-03', 'SCH-DAY-07'],
   'the block VIN line in day+week only, month omission, and the day-view lane growing so text is not clipped all fold into the one VIN-toggle case (it already asserts most of this)'),
 'G-SHIFT-COLOR':   ('SCH-COLOR-02', ['SCH-BLOCK-04'],
   'colour is per SHIFT, not per work order (two shifts of the same order do not share a custom colour) becomes an expected line — and the stale per-WO note is corrected'),
 'G-SAMEDAY-LANE':  ('SCH-LANE-01', ['SCH-LANE-05'],
   'the two non-overlapping same-day shifts come from TWO DIFFERENT work orders, proving multi-WO same-day scheduling in the same observation'),
 'G-AUTOSCROLL':    ('SCH-DAY-01', ['SCH-DAY-02'],
   'manual scroll is not overridden + the full 24-hour timeline stays scrollable + only day navigation re-triggers auto-scroll become steps 3-5'),
 'G-EVENT-MODAL':   ('SCH-EVT-03', ['SCH-EVT-04'],
   'the all-day toggle behaviour (time fields not required when on; the event renders as an all-day block) folds in as a step of the modal-fields case'),
 'G-HOURS-CONFLICT':('SCH-CONF-03', ['SCH-CONF-04'],
   'one working-hours-conflict case: drag the same shift to start BEFORE the start and then extend PAST the end — both reason sentences observed in one sitting'),
 'G-VIEW-TOGGLES':  ('SCH-VIEW-05', ['SCH-VIEW-07', 'SCH-VIEW-08'],
   'the two pure show/hide flips (Capacity Bars off/on, Events off/on) become steps after the six-toggle defaults read — one View-Options case'),
 'G-UNDO':          ('SCH-DEL-09', ['SCH-DEL-07'],
   'the toast-appears-with-Undo assertion per action type folds into the undo-restores case (each action already ends with the toast + Undo click)'),
 'G-ESCAPE':        ('SCH-KEY-01', ['SCH-KEY-02'],
   'the in-modal sub-picker escapes (colour picker, time picker, note edit each close first; then the modal) become explicit steps of the stacking-order case'),
 'G-ENTER':         ('SCH-KEY-03', ['SCH-KEY-04'],
   'the Enter-inside-a-textarea exception (inserts a new line, never confirms) becomes the final step of the Enter-confirms case'),
 'G-HRS-LOCATION':  ('SCH-HRS-02', ['SCH-HRS-01'],
   "the 'Set business hours for this shop' toggle label, its off-by-default state, and the reveal become steps 1-2 of the per-day editor case"),
 'G-HRS-VALIDATION':('SCH-HRS-06', ['SCH-HRS-07'],
   'the incomplete-row-ignored rule becomes a second validation scenario of the overlap-validation case (same editor, same sitting)'),
 'G-WEEK-EXPORT':   ('SCH-EXP-01', ['SCH-EXP-02'],
   'the exported content checks (department headers, technician rows, shifts in correct day columns, week date range) fold into the open-the-export case'),
}

# ---------------------------------------------------------------- cuts
CUTS = {
 'SCH-START-08': "Duplicate sweep: its steps literally re-run the other entry-point cases (SCH-START-01 C29954, SCH-START-02 C29955, SCH-START-03 C29956, SCH-START-04 C29957, SCH-START-05 C29958) and each of those already reads the created shift's start time — the 'every shift has a start time' invariant adds no new observation.",
 'SCH-EDGE-01': "Duplicate of SCH-SPREAD-10 (C29986): same setup (spread the same order's full estimate on technician A then B) and the same assertion (over-estimate accepted, no error) — SCH-SPREAD-10's expected line 3 states it verbatim.",
}

# ---------------------------------------------------------------- weak-keeps
WEAK = {
 'SCH-NAV-06': 'Absence-only assertion (no Tech/Dept toggle exists anywhere) — legitimate spec line but a tester can only prove a negative by exhausting the toolbar; low bug-catching value.',
 'SCH-MCAL-04': 'Styling detail (selected/today/week-hover highlights) — failure is cosmetic; kept because the cues are design-pinned.',
 'SCH-WOL-05': 'Live-as-you-type narrowing — the search contract itself lives in the search cases; this adds only the no-Enter-needed nuance (+ the honest server-paging note).',
 'SCH-WOL-06': 'Empty-state case (one per surface is the allowed pattern) — no message text is pinned, so the only hard assertions are no-error + restore-on-clear.',
 'SCH-DND-06': 'Drag micro-feedback (cell highlight + ghost block) — a real usability cue but failure is cosmetic; the drop outcomes are covered by the DND creation cases.',
 'SCH-START-06': 'Derivative of SCH-START-02 for the Unassigned row (no technician whose hours could apply) — one extra assertion on an already-covered fallback.',
 'SCH-SER-03': "Day-view series cue ('part of an M-week job') — a single label assertion; the load-bearing series renderings are the month/week banner cases.",
 'SCH-BLOCK-05': 'Icon-absence detail (conflict icon is the only icon; no WO number, no scope icons) — spec-pinned but failure is cosmetic.',
 'SCH-DAY-03': 'Sticky date/time headers on scroll — real but low-value display behaviour any regression would catch incidentally.',
 'SCH-DAY-06': 'Now-line indicator + hover label — cosmetic time cue; unpinned styling.',
 'SCH-TIP-02': "Conflict-variant of the shift tooltip (icon + amber reason) — one extra state on SCH-TIP-01's surface; kept because conflict visibility matters.",
 'SCH-TIP-05': 'Tooltip viewport flip/shift positioning — edge-case cosmetics; failure = a clipped tooltip.',
 'SCH-EVT-07': 'Event default grey + tint-on-colour — cosmetic colour behaviour; the structural event-vs-shift distinguishability case (SCH-EVT-06) is the load-bearing one.',
 'SCH-CONF-07': 'Styling reservation rule (red only for conflicts, amber for OT) — a real accessibility/severity semantic but observationally thin; the honest hard-to-seed note is kept.',
 'SCH-DEL-06': 'Derived negative (standalone delete asks no series scope) — real but a tester deleting any standalone shift would notice a wrong prompt immediately.',
 'SCH-DEL-08': 'Toast timing (~7s with Undo / ~4s without, hover holds) — stopwatch-level detail; kept because the 7s/4s values were an explicit 2026-07-27 user-directed edit.',
 'SCH-EDGE-03': 'Perception-based performance check (sidebar smooth at 50+) — no crisp pass/fail beyond visible jank; kept as the honest perf probe.',
 'SCH-EDGE-04': 'Perception-based performance check (grid at 15 techs x 7 days) — same as above for the grid.',
 'SCH-EDGE-06': 'Three-quantities-not-reconciled invariant — largely a restatement of the scheduling model; the concrete over-schedule behaviour lives in SCH-SPREAD-10.',
}

# ---------------------------------------------------------------- held-pending-Branko annotations
HELD = {
 'SCH-EVT-08': "[HELD pending Branko D1 — events-count-toward-capacity may change; scored as authored] ",
 'SCH-CAP-01': "[HELD pending Branko D1 — events-in-capacity edit held; scored as authored] ",
 'SCH-CAP-02': "[HELD pending Branko D1 — events-in-capacity edit held; scored as authored] ",
 'SCH-CAP-03': "[HELD pending Branko D1 — events-in-capacity edit held; scored as authored] ",
 'SCH-CAP-04': "[HELD pending Branko D1 — events-in-capacity edit held; scored as authored] ",
 'SCH-MODAL-08': "[HELD pending Branko D4 — modal 'Reassign' question; scored as authored] ",
}

# ---------------------------------------------------------------- KEEP reasons (explicit, per case)
KEEP_R = {
 'SCH-NAV-01': 'Navigation/entry contract — Schedule as a top-level nav item; survivor of G-NAV-LANDING (gains the two-region layout lines).',
 'SCH-NAV-03': 'Core view-switch contract: Day/Week/Month each render a genuinely different grid; the same shifts must survive all three.',
 'SCH-NAV-04': 'Department-grouped rows with all staff of visible departments — the structural row model (§14.4), a wrong-grouping bug is real.',
 'SCH-NAV-05': 'Collapse/expand of a department group — distinct interaction with a concrete restore assertion.',
 'SCH-NAV-07': 'Unassigned lane inside the grid holding technician-less shifts — a distinct structural element with block-anatomy assertions.',
 'SCH-MCAL-01': 'Navigation contract: mini-calendar click drives the main grid to that date — wrong-target bugs are real and common.',
 'SCH-MCAL-02': 'Month/year picker interaction — distinct control with a concrete outcome (navigate to another month/year).',
 'SCH-MCAL-03': 'Chevron collapse/expand of the mini calendar — distinct interactive behaviour freeing sidebar space.',
 'SCH-WOL-01': 'Structural contract: flat card list, NO Assigned/Unassigned tabs (a deliberate product reversal Branko confirmed) — a tabs regression would be real.',
 'SCH-WOL-02': 'Card anatomy as ONE case covering every field + the status left-border — good packaging (the anti-slop pattern done right).',
 'SCH-WOL-04': 'Sidebar search contract across all four card fields; survivor of G-SIDEBAR-SEARCH (gains the WO-number step).',
 'SCH-FILT-01': "Filter surface contract: the three groups (Assignment/Status/Priority) + the active-count badge on 'Filters'.",
 'SCH-FILT-02': 'Assignment filter behaviour (Assigned/Unassigned) — distinct data contract; the only assignment split in the sidebar.',
 'SCH-FILT-03': 'Status filter behaviour + card-border consistency — distinct data contract (status list deferred to the app, honestly).',
 'SCH-FILT-04': 'Priority filter behaviour (High/Medium/Low) — distinct data contract, pairs with the WO-form Priority case SCH-REG-05.',
 'SCH-FILT-05': "'Clear all' resets every filter in one click — distinct action with badge + list assertions.",
 'SCH-FILT-06': 'Search AND filter combined (both active at once) — the combination contract, a classic real-bug spot.',
 'SCH-LINE-01': 'Drill-down open/back navigation contract; survivor of G-DRILLDOWN-OPEN (gains the header id + count read).',
 'SCH-LINE-03': 'Approved-only lines in the drill-down — a critical business rule; an unapproved line leaking into scheduling is a real bug.',
 'SCH-LINE-04': 'Line-row anatomy incl. the no-cap roster (avatar stack + count) and per-line drag handle — one packaged case.',
 'SCH-LINE-05': "'Needs techs' badge lifecycle (shows when rosterless, clears when scheduled) — a real workflow cue.",
 'SCH-LINE-06': 'Line search scoping contract: matches line titles ONLY (negative customer-name probe included).',
 'SCH-LINE-07': 'All/Unscheduled chips with counts — a data-correctness contract (counts must reconcile with the header).',
 'SCH-DND-01': 'The core fast path: single-line drop creates a shift immediately, skipping the picker — plus roster sync + toast.',
 'SCH-DND-02': 'The multi-line trigger: drop opens the scope picker and creates NOTHING until a scope is chosen.',
 'SCH-DND-03': 'Line-level drag from the drill-down — roster scoped to that line only (not the whole order).',
 'SCH-DND-04': 'The large-job trigger: exceeding daily hours opens the spread step; nothing exists until confirmed.',
 'SCH-DND-05': 'The conditional skip: a fitting scope skips the spread step — the boundary of the SCH-DND-04 trigger.',
 'SCH-DND-07': 'Roster-sync integration contract (schedule ↔ work order labor roster) — load-bearing lifecycle integrity.',
 'SCH-DND-08': 'Click-to-arm alternative to dragging — the accessibility path; same picker/spread rules must apply.',
 'SCH-SCOPE-01': 'Scope-picker contents contract (pinned whole-order row, line count + total hours); survivor of G-SCOPE-CONTENTS.',
 'SCH-SCOPE-02': 'Whole-order scope behaviour: one shift covering all lines + technician added to EVERY roster — load-bearing.',
 'SCH-SCOPE-03': 'The single-tap fast path in the picker (no confirmation) — a distinct interaction contract.',
 'SCH-SCOPE-05': "'Select multiple' checkbox mode + running-tally confirm bar + subset roster scoping; survivor of G-SCOPE-MULTI.",
 'SCH-START-01': 'Start-time hierarchy step 1: technician hours win over shop hours — a genuine data-driven contract.',
 'SCH-START-02': 'Start-time hierarchy step 2: business-hours fallback when the technician has no hours.',
 'SCH-START-03': 'Start-time hierarchy step 3: the 7:00 AM default when neither is set (with an honest blocked-with-reason note).',
 'SCH-START-04': 'Day-view drop position overrides the hierarchy — the positional start-time rule.',
 'SCH-START-05': 'Unassigned-row drop creates a technician-less shift, roster untouched — distinct creation path.',
 'SCH-START-07': 'Unassigned → technician assignment via drag: leaves the lane, roster updated, tech hours apply — lifecycle integrity.',
 'SCH-SPREAD-02': "Spread-step navigation ('Change scope' returns without creating); survivor of G-SPREAD-HEADER (gains the header reads).",
 'SCH-SPREAD-03': "How-much selector contract: 'Full estimate' default + the five options + no extra fields for the three quick ones.",
 'SCH-SPREAD-04': "'Until a date…' progressive disclosure — reveals exactly one finish-by field and re-plans the series.",
 'SCH-SPREAD-05': "'Specific hours…' progressive disclosure — reveals the hours stepper and spreads exactly the entered hours.",
 'SCH-SPREAD-06': 'Start-date default + adjustability for sequential two-technician planning — a real scheduling workflow.',
 'SCH-SPREAD-07': 'The core spread calculation contract: daily shifts sized to tech hours; weekends skipped only without hours; closures NOT skipped (V1, SV-8691 latest-wins).',
 'SCH-SPREAD-08': 'Preview contract: one-line summary expanding to a week-by-week breakdown with struck-through skipped days.',
 'SCH-SPREAD-09': 'Confirming the spread materializes the linked series (one shift per working day + toast) — the central creation contract.',
 'SCH-SPREAD-10': 'Independent per-technician spread (no shared remaining-hours counter) — a spec-pinned model rule; absorbs the over-estimate acceptance.',
 'SCH-SPREAD-11': 'The series caps (8-week confirm + 120-shift hard refusal, no partial series) — a real tech-plan guardrail; UI half of SCH-API-02.',
 'SCH-SER-01': 'Month-view series banner (continuous wrap, labeled once, faded continues, breaks) — the series rendering contract.',
 'SCH-SER-02': "Week-view series banner (edge chevrons + 'week N of M' + break around bookings) — genuinely different rendering, not view-filler.",
 'SCH-SER-04': 'Series = grouping of ordinary daily shifts (capacity/conflict/modal operate per shift) — the load-bearing series semantics.',
 'SCH-BLOCK-01': 'Shift block anatomy (customer/unit/line name, no WO number) — the base block contract.',
 'SCH-BLOCK-02': "'N Lines' on whole-order AND subset blocks with the modal spelling out the scope — a real disambiguation contract.",
 'SCH-LANE-01': 'Non-overlap single-lane behaviour (+ no conflict for back-to-back); survivor of G-SAMEDAY-LANE (gains the two-WO setup).',
 'SCH-LANE-02': 'Overlap → stacked lanes + row growth + double-booked flag — the core overlap rendering contract.',
 'SCH-LANE-03': "3-lane cap with '+N more' popover — a spec-pinned boundary (5 shifts → 3 lanes + '+2 more').",
 'SCH-LANE-04': 'One case sweeping the cap-and-overflow model across all three views — packaged correctly (not a per-view explosion).',
 'SCH-DAY-01': 'Day-view auto-scroll to the working-day start; survivor of G-AUTOSCROLL (gains the manual-scroll-not-overridden half).',
 'SCH-DAY-04': 'Horizontal drag moves start time with 15-minute snapping — a load-bearing time-editing contract.',
 'SCH-DAY-05': 'Edge resize changes duration (left/right edge semantics) — distinct time-editing contract.',
 'SCH-MODAL-01': 'Modal identity contract (customer, unit, VIN always visible, WO id) — including the VIN-regardless-of-toggle rule.',
 'SCH-MODAL-02': 'Date + start/end pickers in 15-minute increments, grid reflects the change — the modal editing contract.',
 'SCH-MODAL-03': 'Technician + time-logged-vs-estimate progress — the progress display contract (numbers must reconcile).',
 'SCH-MODAL-04': "Scope summary + scheduled lines with number/title/hours/status ONLY — the no-money-in-the-modal rule (Branko Q3), a real data-exposure contract.",
 'SCH-MODAL-05': 'Inline estimated-hours edit with persistence — a real editing path (with an honest scope-ambiguity flag).',
 'SCH-MODAL-06': 'Notes add/edit/delete per work order — CRUD lifecycle on the modal.',
 'SCH-MODAL-07': "Conflict banner + 'Adjust' action in the modal (and its absence on clean shifts) — conflict resolution entry point.",
 'SCH-MODAL-08': 'Delete-only modal actions — NO Reassign (drag-only reassignment, Branko-confirmed removal) — a real regression guard.',
 'SCH-EVT-01': "Event creation via the right-click 'Create Event' menu with pre-set tech/date — the primary event path.",
 'SCH-EVT-02': 'Day-view click-to-create with live preview + drag-to-size — a distinct creation gesture.',
 'SCH-EVT-03': 'Event modal fields contract (name/date/times/all-day/colour) with save/re-open; survivor of G-EVENT-MODAL.',
 'SCH-EVT-05': 'Event drag to another technician/day with undo toasts — event lifecycle parity with shifts.',
 'SCH-EVT-06': 'Structural event-vs-shift distinguishability (not by colour alone) — a real accessibility/recognition contract.',
 'SCH-EVT-08': 'Events excluded from capacity AND conflicts — load-bearing semantics (Branko Q1), guards a silent capacity distortion.',
 'SCH-CONF-01': 'Double-booked detection with icon + pill count + dropdown listing — the core conflict contract.',
 'SCH-CONF-02': "Working-day conflict keyed to the technician's OWN configured days (Saturday hours ⇒ no flag) — the reconciled per-tech rule.",
 'SCH-CONF-03': 'Before-hours conflict against the configured start (hierarchy tech > business > default); survivor of G-HOURS-CONFLICT (gains the after-hours half).',
 'SCH-CONF-05': 'Conflict pill count + dropdown completeness + continuous re-detection on resolve — the conflict surfacing contract.',
 'SCH-CONF-06': 'Clicking a listed conflict navigates to the right technician/day — a navigation contract.',
 'SCH-CAP-01': 'Capacity bar calculation contract: booked ÷ available, clamped, equal track widths — customer-facing math.',
 'SCH-CAP-02': 'Over-capacity rendering (amber spill past the track + 100% tick) — the over-booking signal.',
 'SCH-CAP-03': 'OT tag independence (per-tech overtime under an under-capacity aggregate) — a genuinely subtle calculation contract.',
 'SCH-CAP-04': 'Capacity hover breakdown per technician with amber OT highlighting — numbers must reconcile with the grid.',
 'SCH-TIP-01': 'Shift tooltip contents as ONE packaged case (identity, VIN-always, times, scope, 3-line cap, progress bar) — anti-slop packaging credit.',
 'SCH-TIP-03': 'Event tooltip contents (name + category dot, times, technician) — distinct entity, one case.',
 'SCH-TIP-04': 'Tooltip behaviour contract: hover delay, dismiss on leave, read-only, click still opens the modal.',
 'SCH-TOOL-01': "'Today' jump — a distinct navigation action per view.",
 'SCH-TOOL-02': 'Arrow navigation stepping by the active range + the date-label contract — core toolbar navigation.',
 'SCH-TOOL-03': 'Toolbar search fade/highlight across all five fields (incl. WO number not printed on the block) — a distinct search model (visual, non-removing).',
 'SCH-VIEW-01': "'Filter & Display' contents + defaults (departments ON, My Shifts OFF, VIN OFF) — the control-surface contract.",
 'SCH-VIEW-02': 'Department toggles show/hide whole groups — structural filtering with restore.',
 'SCH-VIEW-03': "'My Shifts' personal filter + hidden-without-staff-record rule (tech-plan pinned) — a real scoping behaviour.",
 'SCH-VIEW-04': 'The VIN display matrix (block gated by the toggle, day/week only; tooltip + modal always) — survivor of G-VIN-TOGGLE.',
 'SCH-VIEW-05': 'View Options contents + the six spec defaults; survivor of G-VIEW-TOGGLES (gains the two show/hide flips).',
 'SCH-VIEW-06': 'Business Hours shading of non-working hours in day view — distinct rendering with a data dependency.',
 'SCH-VIEW-09': "Tech Hours display next to names matching configured hours — a data-match assertion, not just show/hide.",
 'SCH-VIEW-10': 'Saturday/Sunday toggles restructure the week (7→6→5 columns) — structural view change.',
 'SCH-REAS-01': 'Drag reassignment with confirmation + roster swap (B added, A removed) + undo — the load-bearing reassignment contract.',
 'SCH-REAS-03': "The redesigned cell context menu ('Create Event' + 'New Work Order' ONLY); survivor of G-CELL-MENU (gains the two removed-item negatives).",
 'SCH-REAS-06': "'New Work Order' cell-menu shortcut behaviour — new-scope action pinned by design + SV-8700.",
 'SCH-DEL-01': 'Series delete-scope prompt: three options each stating hours returned — the deletion surface contract.',
 'SCH-DEL-02': "'This shift only': gap kept (no shuffle) + hours returned — a real data-integrity behaviour.",
 'SCH-DEL-03': "'This and everything after': onward removal keeping earlier shifts — distinct scope semantics.",
 'SCH-DEL-04': "'The whole series' is PER TECHNICIAN (the other tech's series untouched) — a genuinely bug-prone boundary.",
 'SCH-DEL-05': 'Scope options adapt to position (first/last show two options) — a subtle, spec-pinned UI logic.',
 'SCH-DEL-09': 'Undo restores the pre-action state incl. the roster after reassign; survivor of G-UNDO — load-bearing lifecycle integrity.',
 'SCH-DEL-10': 'Commit-immediately semantics (refresh does not cancel; Undo = compensating action) with a Rule-24-style tester note — prevents false bug reports.',
 'SCH-KEY-01': 'Escape closes the topmost layer per the stacking order; survivor of G-ESCAPE (gains the in-modal sub-picker steps).',
 'SCH-KEY-03': 'Enter confirms the active dialog (spread/reassign/event/delete-scope); survivor of G-ENTER (gains the textarea exception).',
 'SCH-KEY-05': 'Focus trap + keyboard reachability — the accessibility contract for modals and page controls.',
 'SCH-COLOR-01': 'Default blue for ALL shifts including multi-week series (no auto special colour) — the colour-system base rule.',
 'SCH-COLOR-02': 'Recolouring via the picker with the three-tone rendering; survivor of G-SHIFT-COLOR (gains per-shift-not-per-WO).',
 'SCH-COLOR-03': 'Colour labels editable per shop, shared across shifts and events — a real shop-level setting contract.',
 'SCH-PERM-01': 'Permission gating (allow side): Schedule View grants the full read experience — one case per real gate.',
 'SCH-PERM-02': 'Permission gating (block side): every editing affordance hidden/disabled for View-only — the Edit gate negative.',
 'SCH-PERM-03': 'Permission gating: no View ⇒ the nav item is hidden entirely — the access gate.',
 'SCH-PERM-04': 'Permission gating (allow side): Edit unlocks every creation/modification interaction.',
 'SCH-PERM-05': 'Permission gating (block side): Edit-without-Delete hides every removal path — the Delete gate negative.',
 'SCH-PERM-06': 'Permission gating (allow side): Delete unlocks deletion incl. the series scopes.',
 'SCH-PERM-07': 'Tier dependency in the roles admin (Delete⊇Edit⊇View) — the composition layer of the permission model.',
 'SCH-PERM-08': 'Cross-permission dependency: Schedule without Work Orders View hides the WO list/drill-down, keeps the grid usable.',
 'SCH-PERM-09': "No 'own-only' restriction — every View user sees ALL technicians; 'My Shifts' is convenience, not security.",
 'SCH-PERM-10': 'Row presence is department-based, not role-based (+ the department-less contrapositive, honestly flagged as derived).',
 'SCH-PERM-11': "Clock-in gated by the staff-record 'Time Clock' setting, not the Schedule tier — a real gate boundary.",
 'SCH-PERM-12': 'WO-derived data masked on blocks/tooltips/modal without Work Orders View (Branko Q3) — data-exposure contract; FE half of SCH-API-03.',
 'SCH-EDGE-02': 'Sub-960px horizontal scroll + sidebar collapse — the responsiveness floor (with the honest mobile-out-of-scope note).',
 'SCH-EDGE-05': 'Shop closures do NOT block or get skipped by spread in V1 (SV-8691 Key Decision, reverses the old rule) — a real regression guard (NQ-1 conflict flagged).',
 'SCH-EDGE-07': 'DST integrity: a series keeps the same local wall-clock time across the clock change — a classic real-world scheduling bug.',
 'SCH-EDGE-08': 'Dark-mode readability sweep across the schedule + all its dialogs — tech-plan-mandated pass, real readability bugs.',
 'SCH-HRS-02': 'Per-day Mon-Sun From-To business-hours editor feeding the Schedule; survivor of G-HRS-LOCATION (gains the toggle/default).',
 'SCH-HRS-03': "Technician custom-hours toggle on Edit Staff ('off by default') — the per-tech half of the working-hours settings.",
 'SCH-HRS-04': 'Inheritance rule: no custom hours ⇒ shop business hours apply (ties the settings to the start-time/conflict consumers).',
 'SCH-HRS-05': "'Add hours' split-shift ranges (removable, start empty) — verbatim story behaviour (NQ-4 model conflict honestly flagged).",
 'SCH-HRS-06': 'Overlap validation (red flag + exact message + Save disabled); survivor of G-HRS-VALIDATION (gains the incomplete-row rule).',
 'SCH-EXP-01': 'Week Export printable Department-by-Technician grid; survivor of G-WEEK-EXPORT (scope pending Branko, honestly flagged).',
 'SCH-REG-01': 'Rewrite migration regression: pre-release shifts/events survive losslessly — the highest-stakes cutover check.',
 'SCH-REG-02': 'Dashboard one-row-per-WO after the rewrite (with the tester note preventing a false missing-rows bug).',
 'SCH-REG-03': 'WO-created appointment lands on the Schedule board — a rewired cross-module path with zero other coverage.',
 'SCH-REG-04': "Multi-location technician's shift appears only on the WO's location — intended behaviour change + tester note.",
 'SCH-REG-05': 'The new WO-form Priority field driving the sidebar filter — the setting side the filter depends on (overlap with Filters project noted).',
 'SCH-API-01': 'BE enforcement matrix in ONE case (View/Edit/Delete → GET/POST-PATCH/DELETE, clean 403s) — the backend half of the permission tiers, no per-endpoint explosion.',
 'SCH-API-02': 'API series caps (409 until acknowledged / 422 hard cap / no partial series) — the backend half of SCH-SPREAD-11.',
 'SCH-API-03': 'No pricing in ANY schedule response + WO-derived fields absent without Work Orders View — response-level proof behind SCH-PERM-12.',
 'SCH-API-04': 'Location scoping: foreign-location shift ids return 404, no cross-location read/edit/leak — the tenant-isolation contract.',
}

# ---------------------------------------------------------------- sense: FIX-WORDING
FIXW = {
 'SCH-PERM-02': "Expected line 3 still names the OLD context-menu items — 'no New Shift / New Event / View Day creation entry points' — but the suite's own reconciled menu (SCH-REAS-03, DESIGN-RECONCILIATION #8-10) is 'Create Event' + 'New Work Order'. Fix: reword to 'no creation entries (no Create Event / New Work Order)'.",
 'SCH-PERM-04': "Step 2 says create an event via right-click 'New Event' — the label was renamed 'Create Event' (DESIGN-RECONCILIATION #7, applied in SCH-EVT-01). Fix: update the label.",
 'SCH-EVT-03': "Precondition says the modal is opened 'via right-click 'New Event'' — stale label; the menu item is 'Create Event' (SCH-EVT-01/DESIGN-RECONCILIATION #7). Fix: update the label.",
 'SCH-COLOR-02': "The case note still asks 'whether recoloring one shift recolors all blocks of the same work order (§4.4 ties color to the WO)' — contradicted by the reconciled per-SHIFT colour rule (SV-8690, applied in SCH-BLOCK-04 on 2026-07-27). Fix: drop the stale note; assert per-shift colour (the G-SHIFT-COLOR merge does exactly this).",
 'SCH-REAS-06': "Expected line 3 — 'The exact target flow (toast or navigation) is confirmed during live testing' — is a to-be-confirmed placeholder, not a pass criterion a cold tester can apply. Fix: move it to the notes; keep E1-E2 as the pass bar.",
 'SCH-SPREAD-08': "Expected line 3 says skipped days 'show the reason they are skipped (weekend / closure)' — but the suite's own V1 rule (SCH-SPREAD-07/SCH-EDGE-05, SV-8691) is that closures are NOT skipped, so a 'closure' skip reason cannot occur in V1. Fix: reword to weekend-only (or align once NQ-1 is answered).",
}

SENSIBLE_R = ('Cold-read PASS: preconditions reachable (seeding stated where needed), steps executable in order, '
              'expected follows, no contradiction, every control spec/design/tech-plan-traceable, domain logic sound, '
              'pass/fail observable. (Spec-only suite: VIU-confirm flags are honest, not nonsense.)')

# ---------------------------------------------------------------- tiers (T2 = build-acceptance / verify-once; default T1)
T2 = {
 'SCH-NAV-02','SCH-MCAL-04','SCH-WOL-02','SCH-LINE-02','SCH-LINE-04','SCH-DND-06',
 'SCH-SCOPE-01','SCH-SCOPE-04','SCH-SPREAD-01','SCH-SPREAD-08','SCH-SER-01','SCH-SER-02','SCH-SER-03',
 'SCH-BLOCK-01','SCH-BLOCK-02','SCH-BLOCK-03','SCH-BLOCK-05','SCH-DAY-03','SCH-DAY-06','SCH-DAY-07',
 'SCH-EVT-06','SCH-EVT-07','SCH-TIP-03','SCH-TIP-05','SCH-CONF-07','SCH-EDGE-02','SCH-EDGE-03',
 'SCH-EDGE-04','SCH-EDGE-08','SCH-KEY-05','SCH-COLOR-01','SCH-REG-01','SCH-REG-02','SCH-REG-03','SCH-REG-04',
}

# ---------------------------------------------------------------- load population
def load():
    cases = []
    for f in sorted(glob.glob(os.path.join(BASE, 'cases', 'cases-*.json'))):
        d = json.load(open(f))
        cs = d if isinstance(d, list) else d.get('cases', d)
        for c in cs:
            if c['id'] == 'SCH-REAS-02':
                continue  # Retired 2026-07-22 (deleted from TestRail, ex C30053) — excluded-with-reason
            cases.append(c)
    return cases

def main():
    cases = load()
    assert len(cases) == 190, len(cases)
    idmap = {r['internal_id']: r for r in csv.DictReader(open(os.path.join(BASE, 'testrail-id-map.csv')))}

    member_of = {}
    survivors = {}
    for g, (surv, members, gain) in MERGES.items():
        survivors[surv] = g
        for m in members:
            member_of[m] = g

    rows = []
    counts = collections.Counter()
    sense_counts = collections.Counter()
    keep_nonsense = []
    for c in cases:
        cid = c['id']
        tr = idmap.get(cid, {}).get('testrail_case_id', '').strip()
        link = 'https://shopview.testrail.io/index.php?/cases/view/%s' % tr.lstrip('C') if tr else ''
        held = HELD.get(cid, '')
        mg = ms = ''
        if cid in CUTS:
            verdict, reason = 'CUT', CUTS[cid]
        elif cid in member_of:
            g = member_of[cid]
            surv = MERGES[g][0]
            surv_tr = idmap.get(surv, {}).get('testrail_case_id', '')
            verdict = 'MERGE'
            reason = 'Absorbed into %s (%s) — %s' % (surv, surv_tr, MERGES[g][2])
            mg, ms = g, surv
        elif cid in WEAK:
            verdict, reason = 'WEAK-KEEP', WEAK[cid]
        else:
            verdict = 'KEEP'
            reason = KEEP_R.get(cid, '')
            assert reason, 'missing KEEP reason for %s' % cid
            if cid in survivors:
                mg = survivors[cid]
        reason = held + reason

        if cid in FIXW:
            sense, sreason = 'FIX-WORDING', FIXW[cid]
        else:
            sense, sreason = 'SENSIBLE', SENSIBLE_R
        if verdict == 'KEEP' and sense == 'NONSENSE':
            keep_nonsense.append(cid)

        refs = c.get('refs') or ''
        refs_ok = 'yes' if ('SV-' in refs and '(' in refs) else 'NO'
        rows.append({
            'internal_id': cid, 'testrail_case_id': tr, 'testrail_link': link,
            'section': c.get('area', ''), 'title': c['title'],
            'verdict': verdict, 'reason': reason,
            'merge_group': mg, 'merge_survivor': ms,
            'tier': 'T2' if cid in T2 else 'T1',
            'sense_verdict': sense, 'sense_reason': sreason,
            'refs_ok': refs_ok,
            'title_over_80': 'yes' if len(c['title']) > 80 else '',
        })
        counts[verdict] += 1
        sense_counts[sense] += 1

    with open(OUT, 'w', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

    # ---------------- reconciliation + embarrassment check
    total = sum(counts.values())
    recommended = counts['KEEP'] + counts['WEAK-KEEP']
    print('git snapshot SHA:', SNAP_SHA)
    print('scored:', total, '(191 authored - 1 Retired SCH-REAS-02 excluded)')
    print('usefulness:', dict(counts))
    print('recommended (KEEP + WEAK-KEEP, survivors within KEEP):', recommended)
    print('merge groups:', len(MERGES), '| members absorbed:', len(member_of), '| cuts:', len(CUTS))
    print('sense:', dict(sense_counts))
    print('KEEP-but-NONSENSE (must be []):', keep_nonsense)
    assert not keep_nonsense
    assert total == 190
    assert total == counts['KEEP'] + counts['MERGE'] + counts['WEAK-KEEP'] + counts['CUT']
    assert total == sense_counts['SENSIBLE'] + sense_counts['FIX-WORDING'] + sense_counts.get('NONSENSE', 0)
    assert recommended == total - len(member_of) - len(CUTS)
    bad_refs = [r['internal_id'] for r in rows if r['refs_ok'] != 'yes']
    print('missing-traceability:', bad_refs if bad_refs else 0)
    print('titles >80 chars:', sum(1 for r in rows if r['title_over_80']))
    # per-area tables
    area_v = collections.defaultdict(collections.Counter)
    area_s = collections.defaultdict(collections.Counter)
    for r in rows:
        area_v[r['section']][r['verdict']] += 1
        area_s[r['section']][r['sense_verdict']] += 1
    print('\nper-area (KEEP/MERGE/WEAK-KEEP/CUT | SENSIBLE/FIX-WORDING/NONSENSE):')
    for a in sorted(area_v):
        v, s = area_v[a], area_s[a]
        print(' %-42s %2d/%2d/%2d/%2d | %2d/%2d/%2d' % (a, v['KEEP'], v['MERGE'], v['WEAK-KEEP'], v['CUT'],
              s['SENSIBLE'], s['FIX-WORDING'], s['NONSENSE']))

if __name__ == '__main__':
    main()
