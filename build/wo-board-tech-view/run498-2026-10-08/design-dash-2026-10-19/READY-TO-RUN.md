# Design- cases (section "Design — how it looks", 73780) — ready-to-run sheet, 19 Oct 2026 (staging v26.40.19-c850386)

Chris Ward answered all rows of "WO Board and Tech View Feature Squad – Questions on design differences" (sheet 1coGNz1ZNj1GiFA4rS7pt9nwKsNgE8bCLpuutygK4iQs), read 19 Oct 2026 ~22:15 UTC. Each held case says: "If he rules for the design, it is released; if he rules for the PRD, it is removed."
Build readings: `c6824-held.mts` (runner admin, ZZAUTOTEST data), evidence `c6824-held*.json`, pictures `C6824xx-held-*.png`. Nothing posted.

| Case | Sheet rows → ruling | Fate per the case's own rule | Build today (c850386) | If run today |
|---|---|---|---|---|
| C682429 Lead menu Assign Tech / Reassign Lead Tech | D01 → (b) PRD | REMOVE | No-lead card menu AND dialog read "Reassign lead technician" (PRD says "Assign lead technician" there — covered by PRD case C682422) | — |
| C682430 Messages, Assignment undone, 2.6 s | D02 a, D03 a, D04 a, D05 a (+ stays while hovered) | RELEASE (needs adding to run 498) | "Lead technician removed" / "Lead technician updated", no Undo, message gone after ~6.4 s, no bar | Fail (build not updated to the design yet) |
| C682431 Locked notes, Declined locked | D06 a, D07 b, D08 b, D09 a — MIXED | REWORD to the mix before running (Expected change → QA lead's go-ahead, 114(c)) | Invoiced: item greyed, note "The lead technician can't be changed once a work order is Invoiced or Paid." (PRD words, ruling wants design words); Declined: moves freely (= ruling); Imported: not on the board (= ruling); view-only drag note: not yet read | Invoiced and permission parts would fail |
| C682432 Five pins | D10 → (b) PRD | REMOVE | Pin limit 3: 4th–6th pin buttons disabled, no message seen | — |
| C682433 Row height / Card size | D11 b, D12 b | REMOVE | "Density: Compact, Regular, Comfortable" in both views; Board View has "Fields to display" | — |
| C682434 "No work orders assigned" | D13 → (b) PRD | REMOVE | Empty group reads "No work orders" | — |
| C682435 Search opens group, N open counts all | D14 b, D15 b | REMOVE | Dialog shows "Current · 2 open" for a technician leading Approved + Estimate + Declined (PRD rule gives 1); whether search opens a collapsed group NOT proven (collapse click not confirmed) | — |
| C682436 No technicians yet / Nothing here yet | D16 → (a) design (+ button only for users who can add staff) | RELEASE (needs adding to run 498) | Location with work orders, no technicians: "No technicians yet / Add technicians to assign work orders. Until then, every work order stays in Unassigned." but NO "Add Technician" button (runner is Admin); empty location "ZZAUTOTEST Location Empty" (made 19 Oct): "No work orders yet / Create a work order and assign a technician to see it here." | Fail on the button and on the empty-location page |

Knock-on: the PRD-version cases added the same evening (C682422–C682428, untested) were written to PRD v66; Chris's answers D02–D05 change the messages, Undo message and timing (PRD v67 pending/updated). C682424 ("message names the work order and technician, with Undo") and C682425 ("stays while hovered and closes after 8 seconds") now conflict with D05 (2.6 s) and need their author to re-check them against PRD v67 before they are run.
Not yet seeded: C682430's "Ben already on a line" (lines/change refused: "Labor or fixed prices must be set", then 500) — do it on screen (work order > line > Edit Line > Technician) when the case runs.
