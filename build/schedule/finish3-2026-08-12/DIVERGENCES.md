# Schedule — divergences, 2026-08-12 (finish3 pass)

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag `3250d285ffcf50626363a578fe273071` ·
`index.html` sha256 `9348ca09d6167375dc52bfc29bf3b9f8c4163dede2ea5ea62269b186c9cc5f6f`. **Unmoved.**

**One SUBSTANTIVE divergence, affecting three cases. One case of OUR OWN over-specification,
repaired. One ticket that no longer reproduces.** Both texts are quoted for every row.

---

## 1 · SUBSTANTIVE — there is no Unassigned row in the grid

**Cases:** SCH-START-05 = [C29973](https://shopview.testrail.io/index.php?/cases/view/29973) ·
SCH-START-06 = [C29974](https://shopview.testrail.io/index.php?/cases/view/29974) ·
SCH-START-07 = [C29975](https://shopview.testrail.io/index.php?/cases/view/29975)

**WHAT THE SOURCE SAYS** — Schedule specification version 27, §3.2, verbatim:

> **Unassigned placeholder.** An unassigned row sits within the grid (not a separate
> tray) and holds shifts that are not yet tied to a technician. Dragging a shift from
> this row down onto a technician assigns it.

and §4.2, verbatim:

> Unassigned shifts are created by dropping a work order (or line) onto the grid's
> Unassigned placeholder row (an in-grid lane, not a separate tray).

**WHAT THE BUILD OFFERS** — nothing that answers to that description. The grid renders
**30 lanes**: three department headings (`WORK ORDER STATUS`, `SERVICE/PARTS`, `SERVICE`)
and 27 technician rows. **No lane is named Unassigned**, and **the word "unassigned"
appears zero times anywhere on the page.**

**THE THREE INNOCENT EXPLANATIONS WERE RULED OUT FIRST, in this order:**

| Ruled out | How |
|---|---|
| *"there are no unassigned shifts, so the row is empty and hidden"* | **13 shifts on this board have `staffId: null`** — the state the cases need genuinely exists here. Examples: S-12876 starting 2026-08-06T13:30:00Z, S-13053 2026-08-07T08:00:00Z, S-13014 2026-08-10T12:00:00Z |
| *"a toolbar toggle is hiding it"* | Both toolbar menus were opened and read in full. **View options** offers only *Business Hours · Tech Hours · Capacity Planning · Events · Show Saturday · Show Sunday*. **Filter & display** offers only *Service · Work order status · Service/Parts · My Shifts · VIN Number*. **Neither mentions unassigned.** |
| *"it is below the fold"* | The lane query is **DOM-wide, not viewport-bound**, and returned all 30 lanes by name. A full-page screenshot was taken as well (`evidence/unassigned.png`). |

**WOULD A READER OF THE SOURCE RECOGNISE WHAT THE BUILD OFFERS AS THE SAME THING?**
**No.** The source describes a named, droppable in-grid lane. There is no lane, named or
otherwise, and no route by which a tester can carry out step 1 of any of the three cases.

**WHAT WAS DONE.** The cases were **not rewritten** — they keep what the specification
requires (Standing Rule 57). Each now carries a plain tester note —

> *What you should see today: there is no Unassigned row in the grid, so this test cannot be
> carried out at all. The grid shows only department headings and technician rows. Mark this
> test BLOCKED - not failed - and do not raise a new problem for it; it is being reported
> separately.*

— and its marker moved to `AUTOMATION: HOLD - the Unassigned row does not exist in the build,
so this cannot be run`.

**WHAT IS OWED.** A defect ticket. **NOT FILED** — the creation hold is active (Standing
Rule 62 and the QA lead's 2026-08-10 ruling, verbatim *"Do not create anything until my next
order."*). Ready-to-file text is in `FINDINGS.md`.

---

## 2 · OUR OWN DEFECT — a case that would have failed a specification-compliant build

**Case:** SCH-DEL-08 = [C30064](https://shopview.testrail.io/index.php?/cases/view/30064)

**WHAT OUR CASE SAID** (expected result 1, and the title):

> *1. Untouched, a toast that has an Undo action persists about **7 seconds**; a toast without
> Undo persists about 4 seconds, before dismissing.*
> Title: *"Toast lasts ~7s with Undo (about 4s without); stays on hover, goes on leave"*

**WHAT THE SPECIFICATION SAYS** — version 27, §7, verbatim:

> **Toast notifications.** Every create, delete, move, and reassign action produces a
> toast with an Undo option. **The toast persists for 4 to 7 seconds**, stays while the
> cursor is over it, and dismisses on mouse-leave.

and §11, verbatim:

> **Undo.** Every destructive action (delete, move, reassign) is undoable for **4 to 7
> seconds** via a toast that persists while hovered.

**WHAT WAS MEASURED.** Polled every 500 ms with the cursor parked away from the toast:
**gone at 4038 ms**, and it **did** carry an Undo action. A second, independent measurement
after the hover test agreed: **gone 4032 ms after the cursor left.** Two consistent readings
of ~4.0 s.

**THE POINT.** 4.0 s is **inside** the specification's *"4 to 7 seconds"*. The build is
compliant. **Our case invented a 7s-with-Undo / 4s-without split that no source states**, so a
tester following it would have **failed a passing build** — the same class of defect as the
SBR export gap in the standing rules.

**WHAT WAS DONE.** The unsupported assertion was **removed and replaced with the source's own
wording** (Standing Rules 25 / 42 / 57 — the repair is removal or scope-conditional wording,
**never** substituting what the build does):

> *1. Untouched, the toast stays on screen for between 4 and 7 seconds and then disappears on
> its own.*

The **title carried the same unsupported claim** and was retitled with it (Standing Rule 41 —
touching a case means re-verifying the whole of it): *"Toast stays 4 to 7 seconds, stays while
hovered, goes when the cursor leaves"* (76 characters).

**Expected results 2 and 3 PASS as written**: the toast was still present after **14 seconds**
of hovering, and went **4032 ms** after the cursor left.

---

## 3 · A TICKET THAT NO LONGER REPRODUCES — Standing Rule 61, outcome 3

**Case:** SCH-SPREAD-03 = [C29980](https://shopview.testrail.io/index.php?/cases/view/29980) ·
**Ticket:** [SV-9005](https://shopview.atlassian.net/browse/SV-9005)

**WHAT THE CASE SAID:**

> *Note on point 2: this half was not re-checked on the current build. There is an open report,
> SV-9005, that the finish-by control may not respond at all. If pressing the arrows does not
> change the date or the preview, mark this test FAILED and say it is SV-9005 rather than
> raising anything new.*

**WHAT WAS MEASURED.** The Finish-by control responds fully:

| Action | `text_spread_until_date` | preview summary | cadence |
|---|---|---|---|
| on arrival | Tue, Aug 11 | 1 shift · 76h 36m | Aug 11 · 76h 36m |
| forward ×5 | **Sun, Aug 16** | **4 shifts** · 76h 36m | Aug 11 to Aug 14 · 19h 9m/day, Tue–Fri |
| forward ×5 | **Fri, Aug 21** | **9 shifts** · 76h 36m | Aug 11 to Aug 21 · 8h 31m/day, Mon–Fri |
| back ×3 | **Tue, Aug 18** | — | — |

**The date moves in both directions and the preview follows it.** Under Standing Rule 61 that
is **outcome 3: the fix has shipped.** The stale conditional note was replaced with an accurate
one keeping the three-outcome shape, and **the QA lead should be told so SV-9005 can be closed.**

---

## 4 · Not called a divergence — recorded, with the reason

**SCH-DND-06 = [C29960](https://shopview.testrail.io/index.php?/cases/view/29960), expected 2
— the drag ghost.** Expected results 1 and 3 **PASS**: the cell under the cursor carries
`schedule-drop-target` and it tracks the cursor (measured at three points, and visible as a
dashed outline in `evidence/ghost-22.png`); releasing over the sidebar created nothing
(board 675 → 675). **Expected 2 splits:** dragging a **work-order card** does produce a ghost —
a clone of the card reparented to `<body>`, reading *"S8685-12876 / 1 line · 1h Est. / Pamill
Paving / 713"* — which carries the **hours** but names the line **count**, not the line's name.
Dragging a **line out of the drill-down** produced no such element in a whole-tree hunt at two
points mid-drag, and none is visible in the screenshot. **Not called**, because a native HTML5
drag image is compositor-drawn and invisible to both checks, and this is a wording-precision
question rather than a functional gap.

**SCH-CONF-04 = [C30024](https://shopview.testrail.io/index.php?/cases/view/30024).** The build
**does** compute the working-day rule — **67 shifts across the range carry
`conflictReasons: ["non_working_day"]`**, alongside `before_hours` 57, `after_hours` 107 and
`double_booked` 105. The toolbar pill reads *"38 conflicts"* and the dropdown lists reasons in
sentence form. **The specific on-screen sentence for a working-day conflict was not read**, so
expected 1's wording half is recorded as **not fully verified**, not as a failure.

---

## Nothing else diverged

Every other case walked this pass matched its source. The full case-by-case record is in
`RUNNABILITY.md`.
