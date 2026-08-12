# Schedule finish4 — divergences

**Build `v3.5-65d6500`**, unmoved across the pass. **18 cases walked.**

## NO SUBSTANTIVE DIVERGENCE WAS FOUND THIS PASS.

Not one case sent the tester to a route or a state the build does not have. That is the honest
result and it is written down as such rather than left implied.

**What a substantive divergence would have been:** the route or the state the source describes does
not exist on the build — the test being *would a reader of the source recognise what the build
offers as the same thing?* Where the answer is no, the case is **never silently rewritten**: it is
recorded with both texts, given `AUTOMATION: HOLD` and a plain *"mark BLOCKED, not failed"* line,
and **raised**. That is what the finish3 pass did with the missing **Unassigned row** (three cases,
`../finish3-2026-08-12/DIVERGENCES.md` §1). Nothing of that kind arose here.

---

## 1 · ONE COSMETIC DIFFERENCE — corrected in the record, not escalated

**Cases:** SCH-HRS group — C38849 = [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) ·
C38850 = [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) ·
C38851 = [C38851](https://shopview.testrail.io/index.php?/cases/view/38851)

**WHAT OUR CASES SAY** (C38850's precondition, verbatim):

> Reach it either from Settings > Locations > **the pencil** on a shop's row > turn on 'Set business
> hours for this shop', or from Settings > Staff > **the pencil** on a technician's row > turn on
> 'Set working hours for this technician'.

**WHAT THE BUILD OFFERS.** The control on a staff row is `data-test-id="staff_edit_button"` and it
renders the Material icon **`edit_note`** — a page-with-pencil glyph — not a bare pencil. Everything
else in that sentence is exact: the route is Settings > Staff > that control, and the form does
carry a toggle labelled **"Set working hours for this technician"** (`toggle_custom_working_hours`),
word for word.

**WOULD A READER OF THE SOURCE RECOGNISE WHAT THE BUILD OFFERS AS THE SAME THING?** **Yes** — it is
the edit control on the technician's row, in the place the case says, and a tester would click it
without hesitating. **COSMETIC. Logged here; no case text changed, nothing escalated.**

---

## 2 · Recorded, and NOT called divergences — with the reason in each case

**C43556's named test data does not exist on this board.** The precondition names work order
**S-9379 (Xiriver Apparel, unit 16604) on technician Jose Young**. That series is not on the board
today. **This is not a build divergence** — the precondition itself says *"If none exists, make one
first"*, and a different series was used and is named in the evidence. **The route is unaffected.**

**C30060's precondition was not reachable until it was seeded.** *"The SAME work order has a series
on technician A and an independent series on technician B"* did not hold — both existing series on
S-14209 sit on the same technician. **Seeding is the first resort, not a blocker**, so a second
series was created through the scheduling API on MQ Test Tech Qamar. **Reachable; not a divergence.**

**C30031's over-capacity day was not seeded.** The bar, its track and its `capacity-bar__spill`
element all exist and the route is runnable; the *appearance* of an amber spill on an over-booked
day is not asserted. **A gap in what this pass drove, not a fault in the build.**

**Three preconditions this pass is BARRED from creating.** C30080 needs a custom role edited,
C30083 needs a staff member's department changed, and C29971 needs the shop's business hours
cleared. All three are **role / staff / settings writes**, which are session-killers on this estate
and were excluded from this pass by instruction. **They are unwalked for a scope reason, not a
product reason**, and they are itemised in `COMPLETION-REPORT.md` rather than dressed up as
divergences.

---

## 3 · THREE FALSE ABSENCES CAUGHT BEFORE THEY WERE WRITTEN DOWN

Recorded because they are the failure mode this pass was warned about, and each was **our harness**:

| What looked missing | What it actually was |
|---|---|
| A series shift could not be opened at all | The id first targeted is **not among the blocks the grid renders** (the lane caps at three with a "+N more"). |
| Clicking the block opened nothing | The block sits at **y = 1371 in a 1080-tall viewport**, so the coordinate click landed outside it and `elementFromPoint` returned `null`. Scrolling into view first fixed it. |
| **C30005 had no resize handles** | The probe read the block **without hovering its edge**. Hovering shows `fc-event-resizer-start` with `cursor: w-resize`. **This one would have been a false defect report on a final branch the day before release.** |

A fourth, milder one: probe F's "pencil" selector matched a **navigation** element
(`page_administration`) rather than a control inside a staff row, so the edit form never opened and
the working-hours toggle read as absent. It is not.
