# WO Board & Tech View — design export of 14 Oct 2026: SPEC-CONFLICT and CASE-NEEDED triage

**Design:** Branko Cicovic's Claude Design project "Work Orders" (787fef1a), export attached by the QA lead on 14 Oct 2026,
`sources/design-2026-10-14-upload/` (103 files). **Spec:** PRD Confluence 845185030, **page version 48** (12 Oct 2026, status
line "PRD v33"), captured `currency-2026-10-14/CONFLUENCE-845185030-2026-10-14.md`; review child 853901313 captured the same day.
**Rule:** expected behaviour comes only from the spec (Rules 57, 113). Where the design differs, the case follows the spec and the
difference is a PO / design question (Rules 56, 58), never a silent pick. Nothing was written to TestRail, Jira, Confluence,
Slack or Google; no ShopView build was opened. PO questions below are **candidates, not sent** (Rule 66 — sent last).

Every row of the text inventory is classified in `inventory/design-text-inventory-2026-10-14-classified.md` (zero unclassified).
This file explains each SPEC-CONFLICT and CASE-NEEDED: the verbatim design text, the verbatim spec text, and the cases affected.
Links: `https://shopview.testrail.io/index.php?/cases/view/<id>`.

---

## A · NEW in this export (not raised before)

### PQ-14-1 · SPEC-CONFLICT — clicking a List row opens a work order preview panel ("Work Order Peek")

**Where:** new board `Work Orders Details.dc.html` (L27–89 markup, L604–689 behaviour); `wo-details/Add Part.html` (changed: L2037–2042,
L5463 peek mode); `.thumbnail` (now pictures the panel); `uploads/Screenshot 2026-10-08 at 15.53.24.png` (the embedded page as the
panel shows it).

**What the design shows (verbatim on-screen texts):**
- the panel's accessible name "Work order preview" (screen label "Work Order Peek"); header = work order number + status badge +
  "customer · unit · asset" (e.g. "Fibrook Equipment · TRK-077 · 2015 Volvo VNL");
- button "Open Work Order" → toast "Opening S1-360" (prototype placeholder for navigation);
- close X with accessible name "Close preview" and hover title "Close (Esc)"; Escape closes; clicking the same row again closes;
  clicking another row switches the content;
- loading skeleton named "Loading work order" (at least 450 ms), slide-and-fade open/close (160 ms), selected row tinted;
- width prop "wide" 960 px (default) / "narrow" 720 px; overview layout prop "columns" / "summary";
- inside: the whole work order page (`wo-details/Add Part.html?embed=1`) with tabs Overview, Lines, Parts, Notes, Stats, Finance and
  every line action (Approve, Decline, Add Part, New Line, time clock, Add Deposit, Create Invoice).

**What the spec says (verbatim):**
- §3 Goals: "List remains the default and is unchanged from production; the only addition to the Work Orders page is the display switcher."
- §5 Terminology (Density): "… in Tech View and Board View (List is unchanged); …"
- S2-R8: "Clicking anywhere on a row, outside its own controls, opens the work order. A drag starts only after the pointer has moved a few pixels, so a click never turns into a drag."
- S3-R6: "Clicking a card (outside the more-actions control) opens the work order."
- Review child 853901313, UX-7: "List is unchanged, so there is no number-only question for List."
- Tech plan (`sources/Tech-Plan-Kanban-Tech-View-Display-Options-2026-10-08-upload.md`, L121, informs, never overrules): "| Untracked design deltas (waiting-on-parts, Undo toast, Unassigned hidden when empty, Details view, Technician/Department chips) | Confluence comment — **delegated to Chris Ward + Branko** (design cleanup) | Planned: the PRD wins |" — the preview replaces the earlier hidden "Details" display.

**Why it is a conflict:** the preview changes what a List row click does, and the spec says List is unchanged and the only page
addition is the display switcher. The spec has no requirement for a preview panel at all.

**Observed in the design (flows D1–D5, D2b):**
1. Only List rows open the preview. Tech View rows and Board View cards open nothing in this prototype (S2-R8 / S3-R6 say they open
   the work order; the prototype has never modelled that, so this is not raised as new).
2. While the preview is open it **covers the toolbar's right side** — the display switcher (Table / By Lead Tech / Board), Columns,
   Row height and New Work Order cannot be clicked, at 1440 px and at 1920 px wide.
3. Switching away from List hides the preview; returning to List shows it again with the same work order.
4. The embedded page is **fully editable** (Approve worked inside the preview). `Add Part.html` gained a read-only "peek" mode
   (`?peek=1`: hides line actions, New Line, Add Part, time clock, Add Deposit / Create Invoice) but the board loads it with `?embed=1`
   only, so that mode is never used. Opened directly with `?embed=1&peek=1`, every one of those controls is hidden (flow D4).
5. An Imported work order (S1-360) opens in the preview like any other (List only, so consistent with S1-R13a).

**Question for Sasha Grosman (PRD owner) / Branko Cicovic (design):** Is the List row-click preview panel part of this release?
- If **no**: the board is out of scope; no case changes.
- If **yes**: the spec needs requirements for it (what opens it, what closes it, whether it is read-only, whether Tech View rows and
  Board cards open the preview or the full work order under S2-R8 / S3-R6, and what happens to the toolbar it covers), and the List
  cases that click a row to open the work order must change.

**Cases affected if it ships** (no edit now — Rule 58 hold; ask first):
[C368200](https://shopview.testrail.io/index.php?/cases/view/368200) Clicking a row's Asset on Site toggle does not open the work order ·
[C368201](https://shopview.testrail.io/index.php?/cases/view/368201) After a status change, Back shows the new status in the List ("click the [WO-1] row to open it") ·
[C368214](https://shopview.testrail.io/index.php?/cases/view/368214) After Back and Forward the List keeps its tab, search and filters ("click the [WO-1] row to open it") ·
[C96932](https://shopview.testrail.io/index.php?/cases/view/96932) Clicking a Tech View row opens the work order ·
[C96946](https://shopview.testrail.io/index.php?/cases/view/96946) Clicking a card opens the work order except on its more-actions button.

---

### PQ-14-2 · SPEC-CONFLICT — Tech View and Board View filtered-empty state has no "Clear all filters" button

**Design (flow probe, Status: Paid + Assigned to me, no search):** List shows "No work orders match these filters" /
"Try removing a filter to widen your results." / **Clear all filters**. Tech View and Board View show the same two lines **with no
button** (`_ds_bundle.js` empty-state component, L3883–3962; the boards pass no clear action).

**Spec (v43, 8 Oct, verbatim):**
- S1-N1: "When the active filters or a search return no work orders, Tech View and Board View show the same empty state as the List, with the same messages and action."
- S1-N1a: "With filters active, with or without a search, the empty state reads “No work orders match these filters”, then “Try removing a filter to widen your results.”, with a Clear all filters button."

Noted as an observation on 8 Oct (design-library reading F-08) but never raised as its own question; the spec now names the button.
**For Branko:** add Clear all filters to the Tech View and Board View empty state. Cases follow S1-N1/S1-N1a (see CN-1).

### PQ-14-3 · SPEC-CONFLICT — filters **and** a search: design shows the search message, spec shows the filters message

**Design (all three displays, Status: Approved + search "zzzz"):** "No results for “zzzz”" / "Try a different search term or remove a
filter." (List also shows Clear all filters; Tech View and Board View show no button).
**Spec S1-N1a (verbatim):** "With filters active, with or without a search, the empty state reads “No work orders match these filters”, then “Try removing a filter to widen your results.”, with a Clear all filters button."
**For Branko / Sasha:** which wins when both are active? Cases follow S1-N1a. New since the spec rewrite of 8 Oct (v43).

### Search only (W-13 now answered by the spec — design still differs)

**Design (all three displays, search "zzzz"):** "No results for “zzzz”" / "Check the spelling, or search by work order number, customer, unit or VIN." (no button).
**Spec S1-N1b (verbatim):** "With only a search active, the empty state reads “No work orders match the search "{search}".” and shows no button."
W-13 asked which text ships; the spec answered it on 8 Oct. The design has not caught up — a design follow-up for Branko, **no new PO
question**. Cases follow S1-N1b (see CN-1).

### Imported work orders (W-3 now answered by the spec — design still differs)

**Design:** the Imported work order S1-360 sits in Tech View's and Board View's Unassigned with a lock and the text
"Imported · review before assigning"; dragging it shows the same text. There is no greyed-out Tech View / Board View option while
Imported is selected, and no greyed-out "Imported" in the Status filter.
**Spec (v48, 12 Oct, verbatim):**
- S1-R13a: "Imported work orders open in List only. While "Imported" is selected in the Status filter in List, the Board View and Tech View options are greyed out with the tooltip "Not available while Imported is selected.""
- S1-R13b: "In Board View and Tech View, "Imported" is greyed out in the Status filter with the tooltip "Imported work orders open in List.""
- Context note: "S4-N9 (a reassign tooltip on imported work orders) is removed because Board View and Tech View never show them."
W-3 is answered; the design lags. Design follow-up for Branko, **no new PO question**. Cases:
[C154648](https://shopview.testrail.io/index.php?/cases/view/154648) covers S1-R13a. **No case in today's snapshots asserts S1-R13b**
(the tooltip "Imported work orders open in List.") → CN-4. The old S4-N9 case C154887 is no longer in today's set, consistent with S4-N9's removal.

---

## B · CASE-NEEDED

| # | Design text (verbatim) | Spec basis (verbatim) | Status in today's 258 snapshots | What is needed |
|---|---|---|---|---|
| CN-1 | "No work orders match these filters" · "Try removing a filter to widen your results." · "Clear all filters"; search-only "No work orders match the search "{search}"." (spec) | S1-N1, S1-N1a, S1-N1b (quoted above) | **No case** asserts S1-N1a or S1-N1b. [C96918](https://shopview.testrail.io/index.php?/cases/view/96918) (8 Oct, asserted the old S1-N1 text "No work orders match your filters") is **not in today's set** | A case per display for filters-only (with the button), filters + search, and search-only, quoting S1-N1a / S1-N1b. Tech View / Board View will fail against today's design (PQ-14-2) |
| CN-2 | "Collapse all" · "Expand all" (Tech View header button) | None for the control — S2-R5 "Allow each technician group to be collapsed or expanded." covers single groups only | [C368162](https://shopview.testrail.io/index.php?/cases/view/368162) (8 Oct) is **not in today's set** | Lead session to confirm whether C368162 was removed on purpose (developer handoff 8 Oct: "not in this release", Blocked not Failed). If removed and still wanted, it is a design-only case — PO question first (no quotable spec sentence, Rule 58) |
| CN-3 | Columns menu: "Find a column" · "No columns match" · "Show all" · "Reset to default" (and "<n> of <m> shown") | S5-R1: "Tech View has its own optional-column selection, separate from List. …" (the controls themselves have no spec wording) | [C368160](https://shopview.testrail.io/index.php?/cases/view/368160) and [C368164](https://shopview.testrail.io/index.php?/cases/view/368164) (8 Oct) are **not in today's set** | Same as CN-2: confirm removal; design-only detail, PO question if still wanted |
| CN-4 | (spec only) "Imported work orders open in List." | S1-R13b (quoted above) | No case | A case for the greyed Imported option in Tech View / Board View Status filter. Will fail against today's design |

**Also missing from today's set (not design-text driven):** [C154887](https://shopview.testrail.io/index.php?/cases/view/154887)
(S4-N9, removed from the spec — expected) and [C368149](https://shopview.testrail.io/index.php?/cases/view/368149) (two dispatchers
reorder the same technician). The six ids are in `source-update-2026-10-08/snapshots-final/` but not in
`currency-2026-10-14/snapshots-before/`; the lead session should confirm in TestRail whether they were deleted or moved, and by whom.

---

## C · KNOWN divergences — still in the 14 Oct export (not re-raised)

| # | PROJECT-STATE / register item | 14 Oct export |
|---|---|---|
| 1 | Density "Row height: Small/Medium/Large" (and Board "Card size: Compact/Detailed") vs S6-R1 "Offer Compact, Regular, and Comfortable density in Tech View and Board View." | **Still shown** (W4) |
| 2 | No separate "Fields to display" picker on Board View | **Still** — Board View shows only "Card size"; no Columns / Fields button (W4, W5) |
| 3 | Switcher tooltips "Table / By Lead Tech / Board" vs S1-R1 "List, Tech View, and Board View" (W-1) | **Still** (sweep, all boards) |
| 4 | Design opens on the All tab; spec S1-R10 made Work Orders the default | Design still opens on All. **The current spec (v42 and v48) has no S1-R10**, so this divergence no longer has a spec sentence behind it — lead session to drop or re-anchor it |
| 5 | Empty group "No work orders assigned" vs S2-R15 “No work orders” | **Still** (Tech View and Board; Board adds "Drag a work order here to assign it") |
| 6 | Restricted-status cards still expose Reassign Lead Tech | **Still** — the menu shows "Reassign Lead Tech" and "Unassign" greyed with the lock note (W2) |
| — | Pin limit 5 ("Up to 5 pinned columns — unpin one first") vs S2-R11 / S3-R8 three | Still (W3) |
| — | Declined locked ("Declined · can’t be reassigned") vs S4-N2 "Declined and Complete work orders can be moved freely, as today." | Still (W3b) |
| — | Toast "S1-702 lead technician set to Ralph Edwards" / "S1-352 assigned to Kristin Watson" / "S1-352 moved to Unassigned" + Undo vs S4-R5 “Lead technician updated” / “Lead technician removed” (Undo ruled out by the PO, 29 Sep) | Still (W2, W3) |
| — | Lock tooltip "Invoiced · can’t be reassigned" vs S4-N6 “The lead technician can’t be changed once a work order is Invoiced or Paid.” | Still (W3b) |
| — | "N open" counts every status vs S4-R15 (Approved, In Progress, Ready for Review, Complete) | Still (code L1313 of the Details board: column length + " open") |
| — | A search opens collapsed groups vs S2-R16 "the group stays collapsed" | Still (Details board L1238) |
| — | Board "Waiting on N parts" chip | Not rendered by the current boards (only in an older screenshot) — consistent with §2 Out of Scope |

The **embedded work order page** shows the work order's lead technician in every line's Labor row ("Unassigned" when there is no
lead) — prototype data mirroring, not a statement about S7-R8–R10; no question. Its Story rows carry no tech-story check mark
(consistent with S8-R1).

**OUTSTANDING — what the QA lead needs to decide or pass on:** PQ-14-1 (preview panel in scope?), PQ-14-2 and PQ-14-3 (empty
states) for Sasha / Branko, sent last with the rest of the W-list (Rule 66); confirm whether C96918, C154887, C368149, C368160,
C368162, C368164 were deleted on purpose; drop or re-anchor known divergence 4 (no S1-R10 in the current spec).
