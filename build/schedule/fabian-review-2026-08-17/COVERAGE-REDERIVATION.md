# Schedule — COVERAGE RE-DERIVATION (Rules 43/45/40) — 2026-08-17

**Scope of this pass:** the 14 NEW Fabian-review stories **SV-9231…SV-9244** (source (b) = the epic
stories, corroborated by spec (a) v30). Build verification DEFERRED (Rule 69). Both directions run:
requirement→case (new/uncovered) and case→requirement (existing anchors that moved).

**Totals (Rule 43):** 14 stories decomposed into **34 testable requirement rows** →
**19 NEW cases authored** · **~25 existing cases to UPDATE/re-anchor** (6 of them SCH-PANEL re-anchor
only) · **0 not-independently-testable** · **0 blocked.** Reconciles: every row below carries a verdict.

**Read-date of every source cited on the new cases:** spec (a) Confluence v30 **read 17 August 2026**;
epic + stories (b) SV-8685/SV-92xx **read 17 August 2026**.

---

## PART A — the 14 new stories → verdicts

### SV-9231 · Resolved working hours & the app-level default (PRD §4.2, §8.1)
| Requirement (verbatim gist) | Verdict |
|---|---|
| Daily hours resolve in one order: technician's configured hours → shop's business hours → app-level default 7:00 AM–7:00 PM; first level set wins, levels not merged; used everywhere a day's length matters (sizing, spread, capacity denominators, business-hours shading, day-view auto-scroll). App-level default is not a rule — a shift outside it raises no conflict. | **NEW → SCH-START-09** (§4262). Partly touched by SCH-START-01/02/03 (start-time fallback), but the resolution *model* and the specific 7am–7pm default used *everywhere* + "no conflict outside app default" is new. |
| Technician hours = per-weekday list of one or more ranges; a Location entity holds business hours in the same shape. | Covered by SCH-HRS-02/03/05 (Working Hours Settings). **UPDATE SCH-START-03** to name the 7:00 AM–7:00 PM default (currently "a sensible default window"). |

### SV-9232 · Shift sizing from remaining hours (PRD §4.2, §12)
| Requirement | Verdict |
|---|---|
| Shift sized by scope estimate minus hours already clocked, evaluated at creation; not-started = full estimate; per line, summed for scope; applies to direct drop, scope picker, spread. | **NEW → SCH-DND-10** (§4260). |
| Minimum schedulable remaining 0.25h — below it the user is told nothing is left rather than a zero-length shift. Existing shifts never resized when hours clocked later. | **NEW → SCH-DND-11** (§4260). |

### SV-9233 · One hours source for hours conflicts (PRD §4.2, §4.11)
| Requirement | Verdict |
|---|---|
| Exactly one hours source per shift (technician when set, else shop); never both together, so one out-of-hours shift = one conflict; neither set = no hours conflict; "Adjust" clamps to the resolved window that raised it. Conflict type list unchanged. | **NEW → SCH-CONF-08** (§4270). **UPDATE SCH-CONF-02/03** to reflect single-source evaluation (currently imply both). |

### SV-9234 · Unassigned lane: parking a work order (PRD §3.2, §4.2, §4.4, §8.1)
| Requirement | Verdict |
|---|---|
| The department group header row IS that department's unassigned lane (one row, not two); dropping a WO/line creates one unassigned shift covering the whole scope; spread does NOT run; sized by remaining; drop date recorded as target start; no technician, no roster touched. | **NEW → SCH-UNAS-01** (§4262). **UPDATE SCH-NAV-07** (dept header row = unassigned lane). |
| Block renders as a fixed-width chip carrying its hours (not scaled to duration) in day/week/month; stacks under the 3-lane cap and "+N more"; excluded from capacity; raises neither double-booking nor hours conflicts. | **NEW → SCH-UNAS-02** (§4262). Partly touched by SCH-START-05/06. |

### SV-9235 · Assigning a parked shift to a technician (PRD §4.2, §12)
| Requirement | Verdict |
|---|---|
| Dragging an unassigned shift onto a technician runs the same path as a fresh sidebar drop; fits within resolved day → single shift; does not fit → spread opens with start date pre-filled from the recorded target; technician added to labor roster; shift begins counting toward capacity; chip replaced by normal rendering. | **NEW → SCH-UNAS-03** (§4262). Re-anchor/supersede SCH-START-07 (currently the thin version). |

### SV-9236 · Spread modal: remaining hours, Today only, option filtering (PRD §4.5)
| Requirement | Verdict |
|---|---|
| Selector offers six options: Full estimate (default, = remaining), Today only (new), 1 week, 2 weeks, Until a date…, Specific hours…; each fixed option shows its resolved hours in the label; Today only/1wk/2wk offered only when the span's capacity is less than the scope's hours; Until a date…/Specific hours… always available. | **NEW → SCH-SPREAD-12** (§4263). **UPDATE SCH-SPREAD-03** (Full-estimate default + new option set). |

### SV-9237 · Spread modal: single-day scope, derived fields, preview (PRD §4.5)
| Requirement | Verdict |
|---|---|
| When the scope fits one resolved day the selector is not shown; only an editable Hours field pre-filled with remaining hours, 0.25h steps; reducing shows "{N}h left to schedule"; confirming creates a single shift; a selection dropping the scope to ≤1 day creates an ordinary shift not a series. | **NEW → SCH-SPREAD-13** (§4263). |
| Until a date… and Specific hours… derive each other (date→hours, hours→date), carrying the value across; Specific hours… steps by resolved daily hours; header shows work order + technician; summary two lines "{N} shifts · {total}h" / "{start} to {end} · Mon–Fri, per tech hours", collapsed by default, expands to week-by-week; confirm reads "Create {N} shifts". | **NEW → SCH-SPREAD-14** (§4263). **UPDATE SCH-SPREAD-04/05/08** (derive + summary/confirm labels). |

### SV-9238 · Spread generator: weekends only, and series undo (PRD §4.5, §7, §12)
| Requirement | Verdict |
|---|---|
| Generator places day-sized blocks on consecutive days, skipping weekends unconditionally; nothing else skipped (shop closures, public holidays, already-booked days all receive shifts); weekends are the only skip reason shown; confirming produces a toast with Undo that removes the ENTIRE generated series (4–7s, persists while hovered, dismiss on mouse-leave); after expiry uses the existing series-aware delete. | **NEW → SCH-SPREAD-15** (§4263). **VERIFY/UPDATE SCH-SPREAD-07** (already "skips weekends only"; ensure closures-not-skipped is explicit). |

### SV-9239 · Work order card: vehicle, clocked hours, search, peek popover (PRD §3.1, §6, §8.1)
| Requirement | Verdict |
|---|---|
| Sidebar card shows vehicle (year make model) plus customer and unit #, and clocked hours rolled up alongside the estimate; line rows in drill-down show estimated and clocked hours; vehicle added to sidebar search AND grid toolbar search fields. | **NEW → SCH-WOL-07** (§4257). **UPDATE SCH-WOL-02** (vehicle + clocked), **SCH-WOL-04** (vehicle in search). |
| Hovering a card opens a read-only peek panel: lines with status, each line's estimated + clocked hours, lead technician, "+N more" truncation; opens after the grid-tooltip hover delay; dismisses on mouse-leave; clicking still opens drill-down; peek does not interfere with dragging. | **NEW → SCH-WOL-08** (§4257). |

### SV-9240 · Shift modal: per-line Time Logged and typed time entry (PRD §4.9)
| Requirement | Verdict |
|---|---|
| Each scheduled line shows a Time Logged pair (actual vs estimate) PER LINE, not only rolled up; lines with nothing clocked show zero actual against the estimate, not hidden. | **NEW → SCH-MODAL-09** (§4268). **UPDATE SCH-MODAL-03** (per-line, not only rolled-up). |
| Start, end and hours can each be typed to the minute; the 15-minute dropdown remains as a shortcut and stays in sync; typed values parsed/normalized on blur; editing any two of start/end/hours resolves the third; an unparseable entry reverts to the previous value. | **NEW → SCH-MODAL-10** (§4268). **UPDATE SCH-MODAL-02** (typed entry alongside pickers). |

### SV-9241 · Capacity detail modal and truncated tooltip (PRD §4.12)
| Requirement | Verdict |
|---|---|
| Clicking a day's capacity bar opens a modal listing every technician for that day with assigned hours vs capacity, overtime highlighted; hover tooltip truncated to a short list with "+N more · click to view all" opening the same modal; denominators use each technician's resolved working hours; unassigned shifts excluded from both sides (never fill the bar, never raise OT). | **NEW → SCH-CAP-05** (§4271). **UPDATE SCH-CAP-04** (tooltip truncation + click-to-open). |

### SV-9242 · Assign work order modal (PRD §7, §4.10, §14.1)
| Requirement | Verdict |
|---|---|
| Left-click menu on empty grid space gains a third item, "Assign work order", listed FIRST above Create event and New work order; opens a modal with technician + day pre-filled; user picks the work order and lines (scope-picker rules); confirming creates the same shift/series a drag would, sized by remaining hours, opening the spread step when the scope exceeds the day. Supersedes SV-8916. | **NEW → SCH-REAS-08** (§4275). **UPDATE SCH-REAS-03** (menu now has three items, Assign work order first). |

### SV-9243 · Left panel collapse toggle (PRD §5.3, §6, §11)
| Requirement | Verdict |
|---|---|
| Toolbar icon button first, left of Today; borderless panel-left icon, secondary color; icon unchanged between states, tooltip carries meaning ("Hide panel"/"Show panel"); panel animates closed, divider disappears, grid reflows; contents hidden not discarded (calendar date, scroll position, search text, drill-down, selected WO all survive); state session-scoped per user; auto-collapse below 960px; manual choice holds until next resize across the breakpoint; anything positioning clear of the panel falls back to a viewport margin while collapsed. | **COVERED** by **SCH-PANEL-01…06** (C43582–C43587). **RE-ANCHOR refs SV-8686 → SV-9243** (the dedicated story) and verify the detail (960px, session-scoped, contents-survive). **0 new cases.** |

### SV-9244 · Day view: zoom, auto-scroll, snapping, continuation chevrons (PRD §3.2, §4.6, §4.8, §6)
| Requirement | Verdict |
|---|---|
| Day view has a pixels-per-hour zoom control in the toolbar, clamped between the resolved working window and the full 24-hour axis; blocks, lane stacking and the now line rescale; the zoom level holds while navigating between days; day view is a horizontal timeline only. | **NEW → SCH-DAY-08** (§4267). |
| Auto-scroll fires on day-view load, on navigating to a new day, and on changing the grid range → earliest technician's resolved start at the left edge with a 30–60 min buffer; when the viewed date is today it scrolls to the now line; manual scrolling not overridden afterwards. Move and resize snap to 15-minute intervals with a live time chip that disappears on release. | **UPDATE SCH-DAY-01** (auto-scroll triggers + buffer + now-line-if-today), **SCH-DAY-04/05** (15-min snap + live time chip). |
| Any block clipped by the edge of the visible range shows a continuation chevron on the clipped edge (leading, trailing, or both), not only week-view series banners. | **NEW → SCH-DAY-09** (§4267). |

---

## PART B — case → requirement (existing anchors that moved)

Existing cases whose anchor/expectation the new stories change (UPDATE, Rule 41 whole-case re-verify):
SCH-START-03 · SCH-START-07 · SCH-CONF-02 · SCH-CONF-03 · SCH-NAV-07 · SCH-SPREAD-03 · SCH-SPREAD-04 ·
SCH-SPREAD-05 · SCH-SPREAD-07 · SCH-SPREAD-08 · SCH-WOL-02 · SCH-WOL-04 · SCH-MODAL-02 · SCH-MODAL-03 ·
SCH-CAP-04 · SCH-REAS-03 · SCH-DAY-01 · SCH-DAY-04 · SCH-DAY-05 · SCH-PANEL-01…06 (re-anchor).

**None of these is orphaned** (every anchor still exists in spec v30); the change is refinement, not removal.

## PART C — surface matrix note (Rule 40)
The new scope is UI-grid-only: no PDF/CSV/print/API/email surfaces are asserted by SV-9231…SV-9244
(Week Export §5406 and API §5409 sections are untouched by these stories). Mobile/responsive IS a
surface for SV-9243 (960px auto-collapse — covered by SCH-PANEL-04) and is N/A for the rest. Marked
N/A explicitly rather than skipped.

## PART D — new internal IDs → sections (all three-way collision-checked free)
SCH-START-09 (4262) · SCH-DND-10/11 (4260) · SCH-CONF-08 (4270) · SCH-UNAS-01/02/03 (4262) ·
SCH-SPREAD-12/13/14/15 (4263) · SCH-WOL-07/08 (4257) · SCH-MODAL-09/10 (4268) · SCH-CAP-05 (4271) ·
SCH-REAS-08 (4275) · SCH-DAY-08/09 (4267). = 19 new.
