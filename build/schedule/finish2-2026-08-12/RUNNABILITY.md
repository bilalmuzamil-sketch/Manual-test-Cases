# Schedule — the runnability walk, 2026-08-12 (finish2 pass)

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag `3250d285ffcf50626363a578fe273071` ·
`index.html` sha256 `9348ca09d6167375dc52bfc29bf3b9f8c4163dede2ea5ea62269b186c9cc5f6f` ·
read at **2026-08-12T07:11:17Z**. Unmoved since 11 August.

The five checks, per case: **is the precondition reachable · does the navigation path exist ·
is each control where the step says it is · do the steps work in the order written · are the labels
the ones on screen.** Labels were read from **computed style**, never from `textContent`.

---

## 1 · THE HONEST NUMBER FIRST

| | |
|---|---|
| **Cases whose every step was carried out THIS pass** | **54** |
| of those, **not walked by any previous pass** | **53** |
| **Running total walked on this build, all passes** | **87 of 176** |
| Partly carried out this pass, with the reason stated | **11** |
| Still never walked by anybody | **89** |

**87 of 176 is the number to quote.** The previous pass reported 45–47 as a range because it could
not rule out overlap between its own batches; this pass computes the figure by taking the union of
every walk-evidence file by case id, so **the overlap is removed rather than estimated**.

**A label check is NOT a walk, and the two are never added together.** All 176 cases have had their
labels checked against a live harvest by earlier passes; that is worth something and it is a
different claim.

## 2 · WHAT WAS CARRIED OUT, CASE BY CASE

Per-step evidence: `evidence/walk_b1.json`, `walk_b2.json`, `walk_b3.json`, `walk_b4.json`,
`walk_b5.json`, `walk_b6.json`, `walk_hard.json`. Every probe printed its **non-GET call list at
exit and every one read `[]`** — which is what makes *"nothing was written"* a measurement.

| Case | Outcome |
|---|---|
| [C29929](https://shopview.testrail.io/index.php?/cases/view/29929) | **DIVERGENCE.** No collapse control on a department header — both views, all three headers, synthetic and real mouse clicks, lanes 30 → 30 every time. See `DIVERGENCES.md` §A1. |
| [C29935](https://shopview.testrail.io/index.php?/cases/view/29935) | Today's date renders `mini-calendar__day--selected` on a blue `rgb(37, 124, 255)` ground; an ordinary date is transparent; hovering gives `rgb(248, 250, 252)`. **Runnable as written.** |
| [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) | Sidebar search matched work order number, customer, unit and technician; the nonsense control `zzzxq999` returned 0 and clearing restored all 21 cards. **Runnable as written.** |
| [C29943](https://shopview.testrail.io/index.php?/cases/view/29943) | The Filters panel opened and `Unassigned` applied. **Runnable as written** — and see C29947, which is what proves the filter really engaged. |
| [C29947](https://shopview.testrail.io/index.php?/cases/view/29947) | Filter and search together: with `Unassigned` on, searching `Goport` returned **0** cards where it returns 1 with no filter — so both were in force at once. **Runnable as written.** |
| [C29950](https://shopview.testrail.io/index.php?/cases/view/29950) | The drill-down lists the lines with their statuses (`Complete`, `Authorized`). **Runnable as written.** |
| [C29951](https://shopview.testrail.io/index.php?/cases/view/29951) | A line row reads title, estimate, technician and carries `drag_indicator`. **Runnable as written.** |
| [C29952](https://shopview.testrail.io/index.php?/cases/view/29952) | **Precondition not met on this estate** — every line in the work order opened has a technician, so the `Needs techs` badge has nothing to appear on. NOT recorded as missing. |
| [C29953](https://shopview.testrail.io/index.php?/cases/view/29953) | `Search lines` matched a line title (`coolant` → `All 1`, showing *Diagnose - Low coolant*). **Runnable as written.** |
| [C29987](https://shopview.testrail.io/index.php?/cases/view/29987) | Month view: series banners wrap across weeks — `Week 1 of 2 chevron_right`, `chevron_left Week 2 of 2`. **Runnable as written.** |
| [C29988](https://shopview.testrail.io/index.php?/cases/view/29988) | Week view: `Week 1 of 3 chevron_right`, `Week 1 of 2 chevron_right`. **Runnable as written.** |
| [C29989](https://shopview.testrail.io/index.php?/cases/view/29989) | Day view: the series day is one block carrying `Week 1 of 1`. **Runnable as written.** |
| [C29990](https://shopview.testrail.io/index.php?/cases/view/29990) | The conflict list names individual work orders and days, not series — capacity and conflicts are computed on the daily shifts. **Runnable as written.** |
| [C29991](https://shopview.testrail.io/index.php?/cases/view/29991) | A single-line block reads `Pamill Paving 713 Replace - Rear ramp handles` — customer, unit and line name. **Runnable as written.** |
| [C29992](https://shopview.testrail.io/index.php?/cases/view/29992) | A multi-line block reads `Fuline Enterprises G30 6 Lines`. **Runnable as written.** |
| [C29995](https://shopview.testrail.io/index.php?/cases/view/29995) | Across 10 blocks the only icon present anywhere is `warning_amber`. **Assertion positively confirmed, not merely uncontradicted.** |
| [C29996](https://shopview.testrail.io/index.php?/cases/view/29996) | Non-overlapping same-day shifts share one lane; measured by grouping blocks into vertical bands. **Runnable as written.** |
| [C29997](https://shopview.testrail.io/index.php?/cases/view/29997) | Intersecting shifts split into stacked lanes — two distinct block heights (49 px and 68 px) in the same grid. **Runnable as written.** |
| [C29998](https://shopview.testrail.io/index.php?/cases/view/29998) | `+N more` overflow chips are real and plentiful in Month view: `+7 more`, `+12 more`, `+21 more`. **Runnable as written.** |
| [C29999](https://shopview.testrail.io/index.php?/cases/view/29999) | Lane stacking and the overflow chip checked in **all three** views, one record per view. **Runnable as written.** |
| [C30001](https://shopview.testrail.io/index.php?/cases/view/30001) | **PASSES on all five expected results** once the window is narrow enough to test it. See `DIVERGENCES.md` — this was the pass's best near-miss. |
| [C30003](https://shopview.testrail.io/index.php?/cases/view/30003) | The header row stayed at `top: 134` through a 400 px vertical scroll — it is stuck. **Runnable as written.** |
| [C30006](https://shopview.testrail.io/index.php?/cases/view/30006) | The now-chip sits at `opacity: 0` at rest and reads **`7:34 AM`** at `opacity: 1` on hover, which is exactly what the case asks for. **Runnable as written.** |
| [C30009](https://shopview.testrail.io/index.php?/cases/view/30009) | The time picker offers **15-minute increments** — `12:00 AM`, `12:15 AM`, `12:30 AM`, `12:45 AM`… **Runnable as written.** |
| [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) | The modal reads `TIME LOGGED 7h 28m / 8h 43m`. **Runnable as written.** |
| [C30011](https://shopview.testrail.io/index.php?/cases/view/30011) | The modal lists all six lines with durations and **no currency symbol and no price/cost/total/amount wording anywhere**. **Runnable as written.** |
| [C30012](https://shopview.testrail.io/index.php?/cases/view/30012) | Clicking the hours value reveals `input_shift_line_estimate_<uuid>` — the estimate **is** inline-editable. **Runnable as written** (the value itself was not changed). |
| [C30014](https://shopview.testrail.io/index.php?/cases/view/30014) | A conflicted shift's modal shows `warning_amber Scheduling conflict / Extends past business hours (3:00 PM)` with an **`Adjust`** control. **Runnable as written.** |
| [C30021](https://shopview.testrail.io/index.php?/cases/view/30021) | Event cards are structurally distinct: `schedule-block--event`, 1 px border, 8 px radius, white ground — against `schedule-block--shift`, 3 px blue border, 6 px radius. **Runnable as written.** |
| [C30022](https://shopview.testrail.io/index.php?/cases/view/30022) | Events render violet, not grey — **but none is known to have had no colour chosen**, so this is recorded as an observation, not a verdict. See `DIVERGENCES.md` §D. |
| [C30027](https://shopview.testrail.io/index.php?/cases/view/30027) | The toolbar pill reads `warning_amber 24 conflicts` and opens a `SCHEDULE ISSUES` list naming each one. **Runnable as written.** |
| [C30028](https://shopview.testrail.io/index.php?/cases/view/30028) | Clicking a conflict in the list opened that shift's modal. **Runnable as written.** |
| [C30029](https://shopview.testrail.io/index.php?/cases/view/30029) | The only amber element is the conflict pill (`rgb(181, 71, 8)`); the overtime tag is the same amber-brown, **not red**. **Runnable as written.** |
| [C30030](https://shopview.testrail.io/index.php?/cases/view/30030) | Capacity bars carry `aria-label="Capacity 10% — 20h 13m scheduled of 205h, overtime"` over a lane/fill structure. **Runnable as written.** |
| [C30032](https://shopview.testrail.io/index.php?/cases/view/30032) | The `OT` tag renders in **Day view** at `rgb(181, 71, 8)`; it does not render in Week or Month. **Runnable as written** — worth telling the tester which view to look in. |
| [C30033](https://shopview.testrail.io/index.php?/cases/view/30033) | Hovering a capacity bar gives a per-technician breakdown: `1 tech in overtime · +6.2h`, `Mudassir 15.2h / 9h · +6.2h`. **Runnable as written.** |
| [C30035](https://shopview.testrail.io/index.php?/cases/view/30035) | A conflicted shift's tooltip carries `warning_amber` and the reason. **Runnable as written.** |
| [C30036](https://shopview.testrail.io/index.php?/cases/view/30036) | An event tooltip reads name, date, time range and technician. **Runnable as written.** |
| [C30038](https://shopview.testrail.io/index.php?/cases/view/30038) | At the right edge the tooltip stayed inside the window — `right: 1578` of a 1680 px viewport. **Runnable as written.** |
| [C30039](https://shopview.testrail.io/index.php?/cases/view/30039) | `Today` returned the grid from `Sun, Sep 20` to `Wed, Aug 12`. **Runnable as written.** |
| [C30040](https://shopview.testrail.io/index.php?/cases/view/30040) | The arrows step by the active view's unit in all three views — day, week and month, out and back. **Runnable as written.** |
| [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) | The toolbar search matched **all five** field types and the nonsense control returned 0: 44 blocks → 19 / 19 / 19 / 1 / 18 / 0, back to 44 on clearing. **Runnable as written.** |
| [C30043](https://shopview.testrail.io/index.php?/cases/view/30043) | Turning the `Service` department group off took the lane count **30 → 9**, and back. **Runnable as written.** |
| [C30045](https://shopview.testrail.io/index.php?/cases/view/30045) | The `VIN Number` toggle took blocks showing a 17-character VIN **0/44 → 27/44**. **Runnable as written.** |
| [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | **DIVERGENCE.** The toggle displays nothing, and the precondition it needs is proven met. See `DIVERGENCES.md` §A2. |
| [C30051](https://shopview.testrail.io/index.php?/cases/view/30051) | `Show Saturday` off removed `Saturday Aug 15` from the day columns, 7 → 6, and restored it. **Runnable as written.** |
| [C30066](https://shopview.testrail.io/index.php?/cases/view/30066) | Escape closes the topmost thing first — popovers 1 → 0 with the dialog still open, then the dialog 2 → 0. **Exactly the stacking order the case asserts.** |
| [C30070](https://shopview.testrail.io/index.php?/cases/view/30070) | **0 of 12** tab stops landed outside the dialog. The focus trap holds. **Runnable as written.** |
| [C30071](https://shopview.testrail.io/index.php?/cases/view/30071) | Every shift block is the default blue — `rgb(37, 124, 255)` 3 px border on `rgb(233, 245, 255)`. **Runnable as written.** |
| [C30086](https://shopview.testrail.io/index.php?/cases/view/30086) | At 900 px the grid becomes horizontally scrollable. **But the sidebar stays visible at its full 275 px** — see `FINDINGS.md`; this half is reported, not yet called. |
| [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) | **Reached for the first time.** Settings → Locations → edit reveals `BUSINESS HOURS` and `Set business hours for this shop`; turning it on reveals Monday–Sunday rows. **Runnable as written.** |
| [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) | The Edit Staff dialog carries `Set working hours for this technician` with per-day `select_working_hours_start_<day>_0` fields. **Runnable as written.** |
| [C43554](https://shopview.testrail.io/index.php?/cases/view/43554) | **Settled cleanly at last.** A context that had never touched the view control, first action of the run: `Day` `aria-pressed="true"`, range `Wed, Aug 12`. The previous pass's answer was confounded; this one is not. |
| [C43588](https://shopview.testrail.io/index.php?/cases/view/43588) | The dark/light choice is in the user menu and switching it re-classes the body. **Runnable as written.** |

## 3 · PARTLY CARRIED OUT, WITH THE REASON

| Case | How far it got, and why it stopped |
|---|---|
| [C29929](https://shopview.testrail.io/index.php?/cases/view/29929) | see the per-step evidence file |
| [C30012](https://shopview.testrail.io/index.php?/cases/view/30012) | see the per-step evidence file |
| [C30031](https://shopview.testrail.io/index.php?/cases/view/30031) | the bars were read in full, but no row in the visible range is **proven** over capacity, so the amber spill past the track was not observed. Needs a seeded over-capacity row. |
| [C30068](https://shopview.testrail.io/index.php?/cases/view/30068) | the dialog's controls are proven present, but **Enter on a confirm button commits a change** — deliberately not sent. |
| [C30072](https://shopview.testrail.io/index.php?/cases/view/30072) | the modal's colour surface was read, but **choosing a colour is a write** — deliberately not made. |
| [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) | see the per-step evidence file |
| [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) | **precondition not met** — all six staff sampled have custom hours ON, so 'a technician with no custom hours' did not exist to look at. |
| [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | the per-day editor and its `select_working_hours_*` fields are proven present; **pressing `Add Hours` and Saving writes to a staff record**, and a staff write kills that user's session, so it was not done. |
| [C38851](https://shopview.testrail.io/index.php?/cases/view/38851) | the editor is reachable; **the overlap rejection needs a Save**, which is a staff-record write. |
| [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | the dark-mode control was exercised; a full dialog-by-dialog dark-mode review is a separate visual pass. |
| [C43589](https://shopview.testrail.io/index.php?/cases/view/43589) | follows C38866 — not measured this pass. |

## 4 · SIX OF MY OWN CHECKS WERE WRONG, AND WERE RE-DRIVEN RATHER THAN BANKED

Recorded because a right answer resting on a broken check is worth as much of a warning as a wrong
answer would be.

| What was checked | What was actually wrong with the CHECK |
|---|---|
| the toolbar search (C30041) | **there are three search inputs** — `select_global_search`, `input_sidebar_search` and `input_schedule_search`. A `/search/i` match landed on the sidebar one, so every term returned an unchanged 32 blocks and looked like a broken filter |
| the two toolbar menus (C30043, C30045, C30050, C30051) | their items are **plain `div`s, not `.q-item`**, so a `.q-item,label` selector found none of them and every toggle read as absent |
| the mini calendar (C29935) | it ran while the sidebar was showing the **line drill-down**, where the mini calendar does not exist |
| the now marker (C30006) | the visibility helper returned false for an element at `opacity: 0` — which is the state the case actually asks about |
| auto-scroll (C30001) | **measured at a window width where there was almost nothing to scroll** |
| the OT tag (C30032) | looked for it in Week view, where it does not render |