# ⚠️ SUPERSEDED 2026-07-31 — do not use this file as the coverage authority

> **This matrix was built against Confluence spec version 18 and its counts (168 authored /
> 167 active) are stale.** The authoritative statement of Schedule coverage is now
> **`build/schedule/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md`**
> (+ `APPENDIX-A-full-matrix.md`), which re-derived coverage from **zero** against the
> **CURRENT spec, Confluence version 23** (2026-07-30): **243 atomic statements enumerated with a
> line-accounting completeness proof**, each mapped to the case(s) that actually assert it —
> **206 COVERED · 4 COVERED-FLAGGED · 30 NOT-TESTABLE (itemised) · 3 GAPS, all 3 now CLOSED**.
> Current tally: **165 ACTIVE cases**, all in TestRail under group 4254, all in run 357.
>
> The text below is retained as prior art / history only.

---

# Schedule (v1) — Coverage Matrix

> Proves completeness: every in-scope requirement of the spec
> (`requirements.md`, v1.0 §1–§14 — SPEC-ONLY project, no designs exist) maps to
> the SCH- case(s) covering it. Cases are authored LOCAL-ONLY (not in TestRail).
> TestRail Case IDs are "pending push" until the user grants explicit permission
> (Standing Rule 6).
>
> Total cases authored: **168** across **26 sections** (166 original + 2 new from
> the 2026-07-22 reconciliation; **167 active** — SCH-REAS-02 is **retire-proposed**,
> retained pending user delete authorization). All functional/UI — see §C for the
> explicit API exclusion.
>
> **RECONCILIATION APPLIED LOCALLY 2026-07-22 (spec_1 + Claude design + Branko Q&A):**
> spec_1 added a **Design link** (body otherwise unchanged) → the **Claude prototype
> `Schedule.dc.html` is now the authoritative design** (Branko Q0); this project is no
> longer spec-only. 6 expected-result edits + events-excluded may-change notes
> (Q1) + VIN §4.13-vs-§9 resolution (design §6) applied; ~48 previously-deferred
> labels/visuals **PINNED by the design** (VIU-confirm hedge removed, design cited);
> 2 new cases added (SCH-EVT-08 event-not-counted; SCH-PERM-12 permission-masking);
> SCH-REAS-02 retire-proposed. Source of truth:
> `spec-v1-2026-07-22/spec-diff-v1-2026-07-22.md` + `design-notes-claude.md`. Details
> per case carry the driver in the case `notes` (Standing Rule 20). **No TestRail
> writes** — the sync is staged in `spec-v1-2026-07-22/testrail-sync-manifest.md`
> pending user authorization.
>
> **Authoring ruling (updated 2026-07-22):** where the design pins a label/visual it
> is now authored to the design's actual wording (still to be VIU-Verified LIVE per
> Rule 12); the remaining genuinely-unpinned items are carried in the trimmed
> **VIU-confirm register** (§D). Nothing was invented (Standing Rules 1/9).

## A. Spec requirement coverage (requirements.md §1–§14, every requirement line mapped)

### §1 Overview / §1.2 Goals
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §1.2 | Conflict detection reduces scheduling errors (double-booking / weekend / after-hours) | SCH-CONF-01..04 |
| §1.2 | Single screen for the week's technician allocation | SCH-NAV-02, SCH-NAV-03 |
| §1.2 | Multi-day "spread" scheduling for 40–160h+ jobs | SCH-SPREAD-01..10 |
| §1.2 | Scheduling a tech automatically adds them to the line's labor roster | SCH-DND-07 (also SCH-SCOPE-02, SCH-REAS-01) |

### §3 Information architecture
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §3 | Schedule is a top-level nav item alongside WO/Customers/Parts/Reports | SCH-NAV-01 |
| §3 | Screen split into two regions (sidebar + grid) | SCH-NAV-02 |

### §3.1 Left panel: work order sidebar
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §3.1 Mini calendar | Month picker, week-highlight, collapsible grid; clicking a date navigates the grid | SCH-MCAL-01, SCH-MCAL-03 (details §5.2 below) |
| §3.1 WO list | Flat scrollable card list; searchable + filterable; NO Assigned/Unassigned tabs | SCH-WOL-01 |
| §3.1 Line drill-down | Click WO replaces list in place; back control | SCH-LINE-01 |
| §3.1 | WO id + line count in the drill-down header | SCH-LINE-02 |
| §3.1 | Only APPROVED lines visible; unapproved don't appear | SCH-LINE-03 |
| §3.1 | Line search box + "All / Unscheduled" chips with counts | SCH-LINE-06, SCH-LINE-07 |
| §3.1 | Line row: independently draggable (drag handle), title, est hours, roster (avatar stack + count, no cap) | SCH-LINE-04 |
| §3.1 | "Needs techs" badge on technician-less lines | SCH-LINE-05 |
| §3.1 Card anatomy | WO number (accent, top-left); line count + hours (top-right); customer bold; unit; lead tech row; status-colored left border | SCH-WOL-02 |
| §3.1 Sidebar search | "Search work orders" matches WO number, customer, unit, technician; real-time | SCH-WOL-03, SCH-WOL-04, SCH-WOL-05 (no-match: SCH-WOL-06) |
| §3.1 Line search | "Search lines" matches line title/name ONLY | SCH-LINE-06 |

### §3.2 Main area: schedule grid
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §3.2 | Day view: 24-hour timeline per tech row, time-positioned blocks | SCH-NAV-03 (interactions §4.8 below) |
| §3.2 | Week view: 7 columns Mon–Sun, Sat/Sun toggleable, stacked chips | SCH-NAV-03, SCH-VIEW-10 |
| §3.2 | Month view: compact calendar, per-day capacity bars + chips | SCH-NAV-03, SCH-CAP-01 |
| §3.2 | Rows grouped by department under collapsible headers; techs beneath | SCH-NAV-04, SCH-NAV-05 |
| §3.2 | Only grid grouping — no tech-only view / Tech-Dept toggle | SCH-NAV-06 |
| §3.2 | Unassigned placeholder row WITHIN the grid (not a tray); drag down assigns; same block anatomy | SCH-NAV-07, SCH-START-05, SCH-START-07 |

### §4.1 Drag-and-drop scheduling
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §4.1 | Single-line WO → shift immediately, scope picker skipped | SCH-DND-01 |
| §4.1 | Multi-line WO → scope picker | SCH-DND-02 |
| §4.1 | Specific line drag → single-line shift directly | SCH-DND-03 |
| §4.1 | Large job (exceeds tech's daily hours) → spread step after scope | SCH-DND-04 |
| §4.1 | Spread step conditional — fits in one working day → skipped | SCH-DND-05 |

### §4.2 Shift start times and unassigned shifts
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §4.2 | Hierarchy 1: technician's configured working hours | SCH-START-01 |
| §4.2 | Hierarchy 2: shop business hours | SCH-START-02 |
| §4.2 | Hierarchy 3: 7:00 AM–7:00 PM general default | SCH-START-03 |
| §4.2 | Day view: start time from drop position | SCH-START-04 |
| §4.2 | Unassigned shift creation on the in-grid Unassigned row | SCH-START-05 |
| §4.2 | Unassigned start-time rules minus tech hours | SCH-START-06 |
| §4.2 | Later drag onto a tech row → that tech's hours apply | SCH-START-07 |
| §4.2/§12 | Every shift has a start time | SCH-START-08 |

### §4.3 Scope picker
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §4.3 | "Schedule whole work order" pinned top, distinct, line count + total hours | SCH-SCOPE-01 |
| §4.3 | Whole order → tech on ALL lines, one whole-order shift | SCH-SCOPE-02 |
| §4.3 | Line-row tap = fast path, immediate, no confirmation | SCH-SCOPE-03 |
| §4.3 | Row shows title, est hours, roster (avatar stack + count) | SCH-SCOPE-04 |
| §4.3 | "Select multiple" → checkboxes + confirm bar with running tally ("Create shift · 2 lines · 6h") | SCH-SCOPE-05 |
| §4.3 | "Select all" = whole order; Cancel returns to the single-tap list | SCH-SCOPE-06 |
| §4.3 | No technician cap, no swap flow — scheduling adds to the roster | SCH-DND-07, SCH-LINE-04 (roster no-cap) |

### §4.4 Shift block anatomy and scope labeling
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §4.4 | 3 text lines: customer (+ conflict icon), unit, line name | SCH-BLOCK-01 |
| §4.4 | Optional VIN line (toggle on; day + week only, month omits) | SCH-BLOCK-03 |
| §4.4 | Last line "N Lines" for multi-line; whole-order and subset identical on block | SCH-BLOCK-02 |
| §4.4 | Color tied to the work order (same-order blocks share color) | SCH-BLOCK-04 |
| §4.4 | No WO number, no scope icons; conflict icon is the only icon | SCH-BLOCK-05 |

### §4.5 Multi-day spread scheduling
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §4.5 | Step 2 of the same modal; header shows scope + "Change scope" back-link | SCH-SPREAD-01, SCH-SPREAD-02 |
| §4.5 | Selector defaults Full estimate; Full estimate / 1 week / 2 weeks apply immediately (progressive disclosure) | SCH-SPREAD-03 |
| §4.5 | "Until a date…" reveals a finish-by date field | SCH-SPREAD-04 |
| §4.5 | "Specific hours…" reveals an hours stepper | SCH-SPREAD-05 |
| §4.5 | Start date defaults to earliest working day; adjustable → sequential second tech | SCH-SPREAD-06 |
| §4.5 | Uses the tech's own hours; skips weekends + shop closures; end date emergent | SCH-SPREAD-07 (closures also SCH-EDGE-05) |
| §4.5 | Preview: collapsed one-line summary; expandable week-by-week, skipped days struck through with reasons | SCH-SPREAD-08 |
| §4.5 | Confirming creates a linked series of daily shifts | SCH-SPREAD-09 |
| §4.5 | Each drop spreads the full estimate independently; no shared remaining counter; no splitting | SCH-SPREAD-10 |
| §4.5 | Scheduled / estimate / actual are three separate quantities, not reconciled | SCH-EDGE-06 (also SCH-EDGE-01) |

### §4.6 Linked series and banners (+ §8.2)
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §4.6 | Month view: continuous wrapping bar, labeled once + tech, faded "continues", empty weekends, breaks around skipped/booked days | SCH-SER-01 |
| §4.6 | Week view: banner across working days, edge chevrons, "week N of M" cue, break around booked day | SCH-SER-02 |
| §4.6 | Day view: single block with "part of an M-week job" cue | SCH-SER-03 |
| §4.6/§8.2 | Series = render-time grouping over N daily shifts; capacity/OT/conflicts operate on individual shifts | SCH-SER-04 |

### §4.7 Overlap and lane stacking
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §4.7 | Non-intersecting shifts share one lane, normal row height | SCH-LANE-01 |
| §4.7 | Intersecting shifts split into stacked lanes; row grows | SCH-LANE-02 |
| §4.7 | 3-lane cap; "+N more" affordance opens a popover of hidden shifts | SCH-LANE-03 |
| §4.7 | Applies in day, week, and month (narrow cells overflow sooner) | SCH-LANE-04 |
| §4.7 | Same-tech overlap is a conflict — stacking reads "resolve me" | SCH-LANE-02, SCH-CONF-01 |

### §4.8 Day view: timeline interactions
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §4.8 | Auto-scroll to working-day start (30–60 min buffer; earliest tech start / business hours / 7 AM) on load + day nav | SCH-DAY-01 |
| §4.8 | Manual scroll not overridden; full 24h timeline intact | SCH-DAY-02 |
| §4.8 | Sticky date/time headers (day + week views) | SCH-DAY-03 |
| §4.8 | Horizontal drag moves start time, 15-minute snap | SCH-DAY-04 |
| §4.8 | Edge resize adjusts duration | SCH-DAY-05 |
| §4.8 | Lane stacking per §4.7 | SCH-LANE-01..04 |
| §4.8 | Lane height grows with VIN toggle (no clipped text) | SCH-DAY-07 |
| §4.8 | Now line with hover label | SCH-DAY-06 |
| §4.8 | Business-hours shading (optional grey overlay) | SCH-VIEW-06 |

### §4.9 Shift detail modal
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §4.9 | Customer, unit, VIN (always visible, below unit/asset), WO id | SCH-MODAL-01 |
| §4.9 | Date + start/end time pickers (15-min increments) | SCH-MODAL-02 |
| §4.9 | Technician; time logged vs estimate progress | SCH-MODAL-03 |
| §4.9 | Scope summary + scheduled line(s): number/title/hours/status pill ONLY — **NO labor, NO total $** (Branko Q3 + design §4c) | SCH-MODAL-04 |
| §4.9 | Estimated hours inline edit | SCH-MODAL-05 |
| §4.9 | Color picker | SCH-COLOR-02 |
| §4.9 | Notes add/edit/delete per work order | SCH-MODAL-06 |
| §4.9 | Conflict banner + "Adjust" when conflicted | SCH-MODAL-07 |
| §4.9 | Actions: **Delete (series-aware) ONLY** — the Reassign-in-modal action is REMOVED (Branko + design §4c); reassignment is drag-only | SCH-MODAL-08 (delete scopes: SCH-DEL-01..06; drag-reassign: SCH-REAS-01). **SCH-REAS-02 = retire-proposed** (removed feature) |

### §4.10 Events
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §4.10 | Create via right-click "New Event" on any cell | SCH-EVT-01 |
| §4.10 | Create by clicking empty day-view space; live preview + drag-to-resize | SCH-EVT-02 |
| §4.10 | Event modal: name, date, start/end, all-day toggle, color category | SCH-EVT-03, SCH-EVT-04 |
| §4.10 | Drag to reassign between techs / move between days | SCH-EVT-05 |
| §4.10 | Event card anatomy: white/neutral, thin even border, no left rail, grey icon chip + 2 text lines; distinct from shifts not by color alone | SCH-EVT-06 |
| §4.10 | Default grey; shared palette; chosen color tints card + chip | SCH-EVT-07 |
| §4.10/§4.11/§4.12 | An event does NOT count toward capacity and does NOT raise a conflict (Branko Q1, design-confirmed; may change) | **SCH-EVT-08 (NEW)** |

### §4.11 Conflict detection
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §4.11 | Double-booked (events excluded from conflict — Branko Q1, may change) | SCH-CONF-01 |
| §4.11 | Outside the tech's configured working DAYS (reframed from fixed Sat/Sun — Branko Q2; a Saturday shift is NOT a conflict if the tech has Saturday hours) | SCH-CONF-02 |
| §4.11 | Before the tech's CONFIGURED working-day start (hierarchy Tech > Business > Default — Branko Q2) | SCH-CONF-03 |
| §4.11 | After the tech's CONFIGURED working-day end (same hierarchy — Branko Q2) | SCH-CONF-04 |
| §4.11 | Warning icon on block; toolbar pill count + dropdown list; continuous scanning | SCH-CONF-05 |
| §4.11 | Clicking a conflict navigates to the tech + day | SCH-CONF-06 |
| §4.11 | Red/alarming styling reserved for conflicts/errors, never overtime | SCH-CONF-07 |

### §4.12 Capacity visualization
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §4.12 | Blue fill = aggregate booked / total available, clamped 100%, equal track widths | SCH-CAP-01 |
| §4.12 | Amber spill past the track edge + tick at 100% | SCH-CAP-02 |
| §4.12 | "OT" text tag on any individual tech exceeding own hours (independent of aggregate) | SCH-CAP-03 |
| §4.12 | Hover tooltip: per-tech breakdown, OT techs in amber | SCH-CAP-04 |

### §4.13 Hover tooltips
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §4.13 | Shift tooltip content (customer+icon; unit/vehicle/VIN; date/time; tech; "N lines · Xh"; line list cap 3 + "+N more lines"; progress "X / Yh") | SCH-TIP-01 |
| §4.13 | Conflict reason in amber | SCH-TIP-02 |
| §4.13 | Event tooltip (name + grey dot; date/time; tech) | SCH-TIP-03 |
| §4.13 | ~300–500ms open delay; dismiss on mouse-leave; read-only; click still opens modal | SCH-TIP-04 |
| §4.13 | Flips above / shifts horizontally to stay in viewport | SCH-TIP-05 |

### §5.1 Work order filters
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §5.1 | "Filter" button + active-count badge; no assignment tabs; narrows flat list | SCH-FILT-01 |
| §5.1 | Assignment: Assigned / Unassigned | SCH-FILT-02 |
| §5.1 | Status: all app-supported WO statuses | SCH-FILT-03 |
| §5.1 | Priority: High / Medium / Low | SCH-FILT-04 |
| §5.1 | "Clear all" resets in one click | SCH-FILT-05 |
| §5.1 | Search + filter combine | SCH-FILT-06 |
| §5.1 | Drill-down's own filters: All / Unscheduled + line search | SCH-LINE-06, SCH-LINE-07 |

### §5.2 Mini calendar
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §5.2 | Month/year picker (month-button grid, year arrows) | SCH-MCAL-02 |
| §5.2 | Collapsible via chevron toggle | SCH-MCAL-03 |
| §5.2 | Selected-date highlight; today indicator; week-row hover highlight | SCH-MCAL-04 |

### §6 Grid toolbar
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §6 | Today button | SCH-TOOL-01 |
| §6 | Left/right arrows by active range; date label ("Jul 14 to 20, 2026") | SCH-TOOL-02 |
| §6 | Conflict pill (count + dropdown) | SCH-CONF-05, SCH-CONF-06 |
| §6 | Search: matches customer/WO number/unit/tech/line; fade + highlight | SCH-TOOL-03 |
| §6 | Filter and Display dropdown (departments / My Shifts / VIN; replaces "Departments") | SCH-VIEW-01 |
| §6 | View Options toggles | SCH-VIEW-05 |
| §6 | Day / Week / Month segmented control | SCH-NAV-03 |

### §7 Interactions and micro-interactions
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §7 | Drag feedback: drop-target highlight + ghost block (line name + hours) | SCH-DND-06 |
| §7 | Shift reassignment by drag: target added to roster, source removed; confirmation modal | SCH-REAS-01 |
| §7 | Right-click cell menu: New Shift, New Event, View Day | SCH-REAS-03, SCH-REAS-04, SCH-REAS-05 (event: SCH-EVT-01) |
| §7 | Toasts with Undo on create/delete/move/reassign; 4–7s; persist on hover; dismiss on leave | SCH-DEL-07, SCH-DEL-08 |
| §7 | Escape closes topmost per stacking order; sub-pickers first inside the shift modal | SCH-KEY-01, SCH-KEY-02 |
| §7 | Enter confirms confirmable dialogs; not inside textareas | SCH-KEY-03, SCH-KEY-04 |
| §7 | Click-to-arm drag alternative | SCH-DND-08 |
| §7 | Series-aware deletion: this only / this-and-after / whole series | SCH-DEL-01..04 |
| §7 | Options adapt to position (first/last = 2 options; middle = 3) | SCH-DEL-05 |
| §7 | Each option states hours returned ("returns 8h") | SCH-DEL-01, SCH-DEL-06 (non-series: no scope prompt) |

### §8 Data model (UI-observable assertions only — no API; see §C)
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §8.1 | Line labor[] roster has no cap | SCH-LINE-04 |
| §8.1 | Unassigned shift has an empty/placeholder tech until moved | SCH-START-05, SCH-START-07 |
| §8.1 | Event fields (name/date/times/allDay/color) | SCH-EVT-03, SCH-EVT-04 |
| §8.1 | Technician belongs to Department (grid grouping) | SCH-NAV-04, SCH-PERM-10 |
| §8.2 | Series shares an id; renders as connected banner; scoped deletion; ordinary daily shifts carry own hours | SCH-SER-01..04, SCH-DEL-01..05 |

### §9 View options and customization
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §9 | Filter and Display: department toggles (default all on) | SCH-VIEW-01, SCH-VIEW-02 |
| §9 | My Shifts (default off): only own shifts; convenience not permission | SCH-VIEW-03 (also SCH-PERM-09) |
| §9 | VIN (default off): blocks (day/week) + tooltips; modal always shows VIN | SCH-VIEW-04, SCH-BLOCK-03, SCH-MODAL-01 |
| §9 | View Options: Business Hours (off) | SCH-VIEW-05, SCH-VIEW-06 |
| §9 | Capacity Bars (on) | SCH-VIEW-05, SCH-VIEW-07 |
| §9 | Events (on) | SCH-VIEW-05, SCH-VIEW-08 |
| §9 | Tech Hours (off) | SCH-VIEW-05, SCH-VIEW-09 |
| §9 | Saturday (on) / Sunday (on) | SCH-VIEW-05, SCH-VIEW-10 |

### §10 Color system
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §10 | Blue default for ALL shifts incl. multi-week | SCH-COLOR-01 |
| §10 | Grey default for events | SCH-EVT-07 |
| §10 | Optional user colors from the shift/event modal picker | SCH-COLOR-02, SCH-EVT-07 |
| §10 | Color labels editable per shop | SCH-COLOR-03 |
| §10 | Three tones (background/text/accent); no fixed semantics beyond defaults | SCH-COLOR-02 |

### §11 Non-functional requirements
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §11 | Smooth render 15 techs × 7 days × several shifts/cell | SCH-EDGE-04 |
| §11 | Sidebar list + drill-down virtualize at 50+ items | SCH-EDGE-03 |
| §11 | 960px minimum width (grid scrolls horizontally below); sidebar collapses when narrow | SCH-EDGE-02 |
| §11 | Keyboard-reachable; focus rings; modal focus trap + Escape; click-to-arm | SCH-KEY-05, SCH-KEY-01, SCH-DND-08 |
| §11 | Signals not color-only (OT text tag, overflow shape) | SCH-CAP-03, SCH-LANE-03, SCH-EVT-06 |
| §11 | Undo on every destructive action, 4–7s hover-persistent toast | SCH-DEL-07, SCH-DEL-08, SCH-DEL-09 |

### §12 Edge cases and constraints
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §12 | Multiple same-day shifts per tech; lanes + 3-cap + "+N more" | SCH-LANE-05, SCH-LANE-03 |
| §12 | Every shift has a start time (hierarchy / drop position) | SCH-START-08 |
| §12 | Shop closures block spread placement | SCH-EDGE-05, SCH-SPREAD-07 |
| §12 | Same WO on multiple techs → independent full-estimate series; over-plan expected | SCH-SPREAD-10, SCH-EDGE-01 |
| §12 | Whole-order + subset both render "N Lines"; modal/tooltip give specifics | SCH-BLOCK-02, SCH-MODAL-04, SCH-TIP-01 |
| §12 | Cross-tech drag reassigns with roster add/remove | SCH-REAS-01 |

### §13 Success metrics
Not testable as UI behavior (product analytics targets: conflict rate, time-to-schedule, adoption, undo usage) — **no cases authored; excluded with reason** (see §C).

### §14 Roles and permissions
| Spec ref | Requirement | SCH- case(s) |
|---|---|---|
| §14 | Three independent levels; Delete requires Edit requires View | SCH-PERM-07 |
| §14.1 | View: full read experience (page, views, mini cal, search, filter, all techs, tooltips, read-only modals) | SCH-PERM-01 |
| §14.1 | View: all editing affordances hidden/disabled | SCH-PERM-02 |
| §14.1 | View OFF → nav item hidden entirely | SCH-PERM-03 |
| §14.1 | Edit unlocks all creation/modification interactions | SCH-PERM-04 |
| §14.1 | Delete unlocks removal incl. series scopes; without it delete + trash icon hidden | SCH-PERM-05, SCH-PERM-06 |
| §14.2 | Work Orders: View dependency — sidebar hides WO list/drill-down; mini cal remains; grid still usable; no new drags | SCH-PERM-08 |
| §14.2 | Work Orders: View OFF — WO-derived data on the shifts themselves (customer/lines/money fields) hidden or masked on block, tooltip, and modal (Branko Q3) | **SCH-PERM-12 (NEW)** |
| §14.3 | No own-only restriction; My Shifts = convenience filter, not a boundary | SCH-PERM-09, SCH-VIEW-03 |
| §14.4 | Grid rows department-based (staff record), not role-based | SCH-PERM-10 (also SCH-NAV-04) |
| §14.4 | Clock-in gated by the staff "Time Clock" setting, not permissions | SCH-PERM-11 |

## B. Design coverage (design NOW available — 2026-07-22)

**Design available:** the Claude prototype `Schedule.dc.html` (spec_1 added the
Design link; Branko Q0 confirmed it is authoritative) — captured in
`spec-v1-2026-07-22/design-notes-claude.md`. This is a coded interactive prototype,
not a Figma file. A **design-reconciliation pass was run 2026-07-22**: every case's
`design_ref` now cites the Claude prototype, ~48 previously-deferred labels/visuals
are folded to the design's actual wording (see §D), the VIN §4.13-vs-§9 conflict is
resolved (design §6), and the removed Reassign-in-modal feature is retire-proposed.
**Rule 12 caveat:** design-pinned ≠ VIU-Verified — the LIVE build must still confirm
each label/behaviour once the QA branch + Epic key exist (OQ-2/OQ-3). The prototype
simplifies the conflict hours model (hardcoded Mon–Fri/8–17); the authoritative rule
is Branko Q2's per-tech hierarchy (design §5 notes the simplification).

## C. Excluded — explicitly NOT covered by cases (with reasons; Standing Rule 17)

| Item | Reason |
|---|---|
| **API coverage: NOT AUTHORED** | The spec v1.0 contains **no API contract** — zero endpoints, HTTP methods, or status codes anywhere (unlike Global Search / Simple Flow / Fees & Discounts). Authoring API cases would mean inventing endpoints (Standing Rules 1/9 forbid). **Ask Branko/dev for the backend contract if API cases are wanted**; they would then go in an "API — <leaf>" section per Standing Rule 4 (gen_import.py already routes `api_related` cases there). |
| §15 Technician availability and PTO | Spec-declared future consideration — OUT OF SCOPE for V1. |
| §15 Auto-scheduling (suggested assignments) | Spec-declared future consideration — OUT OF SCOPE for V1. |
| §15 Recurring events | Spec-declared future consideration — OUT OF SCOPE for V1. |
| §15 Skill matching (certification warnings) | Spec-declared future consideration — OUT OF SCOPE for V1. |
| §15 Spread around existing bookings (auto-flow around booked days) | Spec-declared future consideration — OUT OF SCOPE for V1. V1 behavior (manager handles conflicts manually; banner breaks around booked days) IS covered: SCH-SER-01/02, SCH-CONF-01. |
| §15 Long-job cap (single assignment span instead of daily shifts) | Spec-declared future consideration — OUT OF SCOPE for V1. V1 materializes every daily shift: SCH-SPREAD-09. |
| §13 Success metrics | Product analytics targets, not UI behavior — not manually testable as authored cases. |
| §2 User personas | Context only — no testable requirements beyond those mapped above. |
| Feature-flag / rollout cases | The spec has no flag/rollout/phasing section (OQ-3: QA env + flag/settings status unknown — ask the user at VIU). Import is flag-free per user rule anyway. |
| Mobile-specific cases | The spec defines desktop responsiveness only (960px minimum, horizontal scroll, sidebar collapse — covered by SCH-EDGE-02). No mobile UI is specified — nothing invented. |

## D. VIU-confirm register (trimmed 2026-07-22 — design now pins most items)

**What changed:** with the Claude prototype now authoritative, roughly **~48 of the
~62 previously-deferred items are PINNED by the design** — their cases were folded to
the design's actual labels/visuals and the "VIU-confirm / no designs" hedge removed
(the driver is cited in each case's `notes`). **Rule 12 caveat:** design-pinned is
NOT VIU-Verified — the LIVE build must still confirm every label at the VIU pass.

### D.0 Now PINNED by the design (folded — no longer in the open register)
| Block | Examples pinned |
|---|---|
| Scope picker | "Schedule whole work order", "Select multiple"/"Select all"/"Unselect all"/"Cancel", "Create shift · N lines · Xh", "Whole order · Xh" (design §4a) |
| Spread | "STEP 2 · SPREAD", "Change scope", "Full estimate"/"1 week"/"2 weeks"/"Until a date…"/"Specific hours…", preview one-liner (design §4b) |
| Delete scopes | "Remove from series", "This shift only"/"This and everything after"/"The whole series", "returns Nh", "Part of a 6-week job · 20 shifts" (design §4e) |
| Blocks / series | "N Lines", conflict-icon-only, color-tied-to-WO, "↳ continues", "week N of M", "Part of an N-week job", 3-lane cap + "+N more" (design §3) |
| Toolbar / view | "Today", date-label "Jul 12 – 18, 2026"/"July 2026", "Filter and Display", **"VIN Number"** (was "VIN"), View Options six toggles (design §1) |
| Conflict copy | reason sentences ("Double-booked with <customer>", weekend/before/after) — replace the spec's type NAMES (design §7) |
| Modal | line rows = number/title/hours/status pill only (NO $), "Adjust", trash-icon Delete, no Reassign (design §4c) |
| Tooltip | "N lines · Xh", "+N more lines", "X / Yh", 3-line cap, flip/shift positioning; VIN shown unconditionally (design §4c/§6) |
| Capacity / events | blue fill + amber spill + tick, "OT" tag, per-tech hover breakdown, event-card anatomy (design §3) |
| Sidebar | "Search work orders", "Search lines", "Needs techs", "All"/"Unscheduled", WO card anatomy, mini-cal highlights (design §2) |
| Reassign / keyboard | drag-reassign confirm modal (Cancel/Confirm), Escape 13-layer stacking order (design §4d/code) |
| 15-min snap · 3-lane cap · tooltip 3-line cap · color palette + editable-label surface (design code/§3) |

### D.1 STILL needs a LIVE build check (~18 items — the trimmed register)
| Item | Why still open | Case(s) |
|---|---|---|
| "Filter" vs "Filters" sidebar button caption | design screenshot shows "Filters", template shows "Filter" | SCH-FILT-01 |
| Right-click menu wording "New Shift" / "View Day" | design does not fully pin these two labels | SCH-REAS-03, SCH-REAS-04, SCH-REAS-05 |
| Sidebar Status-filter option enumeration | spec defers to "all app-supported statuses" (tenant/app data) | SCH-FILT-01, SCH-FILT-03 |
| Department names | tenant data (design examples SERVICE/ADMINISTRATION illustrative) | SCH-NAV-04 |
| Schedule permission naming in the roles admin | tenant/app data — ask user at VIU | SCH-PERM-01..07 |
| Tooltip open delay ~300–500ms | approximate; not pinned by prototype | SCH-TIP-04 |
| Toast lifetime 4–7s | approximate | SCH-DEL-08 |
| Auto-scroll buffer 30–60 min | approximate | SCH-DAY-01 |
| 960px min width + sidebar collapse breakpoint | threshold not pinned | SCH-EDGE-02 |
| **7:00 AM–7:00 PM default working day** | **⚠ prototype hardcodes 8–17/9h — spec-vs-design discrepancy to resolve LIVE** | SCH-START-03, SCH-START-06 |
| Virtualization at 50+ (observable = smoothness) | implementation detail | SCH-EDGE-03 |
| Direct-URL access with Schedule: View OFF | spec pins only nav hidden | SCH-PERM-03 |
| Department-less staff row handling | contrapositive derivation | SCH-PERM-10 |
| Notes per-work-order sharing across shifts | scoping not pinned | SCH-MODAL-06 |
| Hidden-weekend-column behaviour for existing weekend shifts | not pinned | SCH-VIEW-10 |
| Now line on non-today days | not pinned | SCH-DAY-06 |
| "Until a date…" overflow when the estimate can't fit by the date | behaviour not pinned (label IS pinned) | SCH-SPREAD-04 |
| Standalone-shift delete confirmation (any?) | not pinned | SCH-DEL-06 |
| 'Hidden vs disabled' per editing affordance for View-only | spec allows either; record which | SCH-PERM-02 |

## E. Open items affecting cases (tracked in requirements.md OQs)

- **OQ-2 Epic/Jira key** — NOT available; **ASK THE USER at VIU** (do not invent).
- **OQ-3 QA branch/env + feature-flag/settings status** — NOT available; ASK THE
  USER; VIU + TestRail push wait on it.
- **OQ-4 Designs** — none; if Figma arrives, run a design-reconciliation pass.
- **OQ-5 Spec-internal ambiguities** — carried per-case in §D above.
- **API contract** — ask Branko/dev whether API-level cases are wanted (§C).
- Per Standing Rule 11, ASK which process(es) to run before any VIU pass.
