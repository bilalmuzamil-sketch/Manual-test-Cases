# Schedule labels-final — what changed, 2026-08-11

**12 cases. Labels and navigation wording only. Not one expected behaviour is changed (Rule 57).**

Where the build differs from what the documents require, the case **keeps the documented
expectation**. Nothing here re-points a case at the build.

---

## The change list

| Internal | C-id | Link | Fields | Change |
|---|---|---|---|---|
| SCH-VIEW-01 | **C30042** | [view](https://shopview.testrail.io/index.php?/cases/view/30042) | title, steps, expected | `'Filter & Display'` → **`'Filter & display'`** · `'VIN'` → **`'VIN Number'`** (×2) |
| SCH-VIEW-05 | **C30046** | [view](https://shopview.testrail.io/index.php?/cases/view/30046) | title, steps, expected | `'View Options'` → **`'View options'`** · `Capacity Bars` → **`Capacity Planning`** (×3) · `Saturday`/`Sunday` → **`Show Saturday`/`Show Sunday`** |
| SCH-VIEW-06 | **C30047** | [view](https://shopview.testrail.io/index.php?/cases/view/30047) | steps | `'View Options'` → **`'View options'`** |
| SCH-VIEW-09 | **C30050** | [view](https://shopview.testrail.io/index.php?/cases/view/30050) | steps | `'View Options'` → **`'View options'`** |
| SCH-VIEW-10 | **C30051** | [view](https://shopview.testrail.io/index.php?/cases/view/30051) | title, steps, expected | `Saturday`/`Sunday` → **`'Show Saturday'`/`'Show Sunday'`** · `'View Options'` → **`'View options'`** |
| SCH-NAV-06 | **C29930** | [view](https://shopview.testrail.io/index.php?/cases/view/29930) | expected | `'Filter and Display'` → **`'Filter & display'`** |
| SCH-VIEW-02 | **C30043** | [view](https://shopview.testrail.io/index.php?/cases/view/30043) | steps | `'Filter and Display'` → **`'Filter & display'`** |
| SCH-VIEW-03 | **C30044** | [view](https://shopview.testrail.io/index.php?/cases/view/30044) | steps | `'Filter and Display'` → **`'Filter & display'`** |
| SCH-VIEW-04 | **C30045** | [view](https://shopview.testrail.io/index.php?/cases/view/30045) | steps | `'Filter and Display'` → **`'Filter & display'`** |
| SCH-PERM-09 | **C30082** | [view](https://shopview.testrail.io/index.php?/cases/view/30082) | steps | `'Filter and Display'` → **`'Filter & display'`** |
| SCH-CONF-03 | **C30025** | [view](https://shopview.testrail.io/index.php?/cases/view/30025) | expected | `'working hours'` → **`'business hours'`** in the two quoted examples |
| SCH-MODAL-08 | **C30015** | [view](https://shopview.testrail.io/index.php?/cases/view/30015) | expected | item 1 rewritten **scope-conditionally** (Rule 42) |

---

## The three that deserve their reasoning stated

### C30025 — the highest-value row, because a tester would search for a phrase that is not on screen

The build's conflict panel says, verbatim: *"Starts before **business hours** (7:00 AM)"* and
*"Extends past **business hours** (3:00 PM)"*. The case quoted *"working hours"*. **`working hours`
appears ZERO times in the 1,184 strings harvested from this build; `business hours` appears 65 times.**

**What was kept, deliberately:** the *"in the spirit of"* framing — that is Rule-42 scope-conditional
wording doing its job, and the case was never making a false assertion, only pointing the tester at
the wrong words. **And the assertion itself is untouched:** that the boundary is measured against
**that technician's own configured hours**, which the build-VIU pass confirmed live on a board where
two technicians have different hours (Alicia Campbell 06:00–15:00 → *"(3:00 PM)"*; MQ Test Tech Qamar
07:00–19:00 → *"(7:00 AM)"*). **Only the word changed.**

### C30015 — a closed enumeration replaced by an absence, not by another closed list

**Before:** *"The modal offers a Delete action (a trash icon in the header) and a close (x) icon -
**and no other actions**."* The build also offers `Add Note`, `Change colour`, `Edit estimated hours`
and `Open work order … in a new tab`, so that sentence had become false.

**After:** the modal's Delete and close are still named, then — *"It offers no way to move the shift
to a different technician - no Reassign action, under that or any other name. Other editing controls
may be present (for example notes, colour, or estimated hours); their presence is not what this test
checks."*

**Why not simply list the six controls the build has today?** Because that **re-arms the same time
bomb** — it breaks again the moment a seventh is added. **The assertion this case exists to make is
the ABSENCE of a reassignment path**, so the repair states that positively and stops enumerating.
**`Reassign` appears ZERO times in the harvest**, so the case's point is confirmed, not weakened.

### C30051 — the toggle is `Show Saturday`; the COLUMN is still Saturday

The distinction is deliberate and is preserved in the text: *"'Show Saturday' off: **the Saturday
column** is removed"*. Renaming the column would have been wrong.

---

## The title change that was NOT on the staged list, and why it is here

**C30051's title** read *"Saturday and Sunday toggles include or exclude the weekend columns"*. The
staged pack listed only its steps and expected results. **Standing Rule 41 requires the whole case to
be re-read when it is touched**, and that read found the title asserting the same two wrong labels the
body did. Leaving it would have shipped a case whose title contradicted its own corrected steps.
**Corrected to `'Show Saturday' and 'Show Sunday' include or exclude the weekend columns`** (72
characters). Recorded here rather than folded in silently.

**The same re-read confirmed C30042's and C30046's titles needed their corrections too** — those two
*were* on the staged list.

---

## What did NOT change, and this is the important half

- **No expected behaviour.** Every assertion is byte-identical apart from the label words inside it.
- **No Rule-54 provenance line.** Not on any of the 12. **Sentence 2 records the build a case was last
  CHECKED against, and this pass observed nothing itself** — the app session is dead (401
  `sso_required`). Re-stamping to `v3.5-65d6500` would have claimed a check we did not perform.
  **The build stamps therefore still read `v3.5-7ec992f on 8/6/2026` (10 cases) and
  `v3.5-d122eef on 8/5/2026` (2 cases).** See `FINDINGS.md` F1 — this is a deliberate refusal, not an
  oversight.
- **No automation marker.** All 12 keep what they had — 10 `AUTOMATION: READY`, and C30044 and C30082
  keep `AUTOMATION: HOLD` with their second-sign-in reasons. **No verdict changed, so no marker
  could** (Rule 61).
- **No `refs` field** was written on any case.
- **No case created, deleted or moved. No section touched. No run touched. No Jira call.**
