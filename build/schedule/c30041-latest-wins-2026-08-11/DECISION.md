# C30041 — what was done, and why

**Date:** 2026-08-11 · **Case:** SCH-TOOL-03 =
**[C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** · Schedule group 4254,
section 4273 "Grid Toolbar"

**Ruling applied:** QA lead, verbatim — **"The latest or newer wins here."**
**Dating verdict (full evidence in `DATING.md`): THE PRD DELETION IS NEWER, by 10 days 22 hours 7
minutes 57 seconds.**

---

## 1. OUTCOME IN ONE LINE

## **The case was TRIMMED, not deleted — one `update_case`, byte-verified. The fade/highlight expectation is GONE. The five-field search expectation stays, because it is current live-PRD text and NO OTHER CASE IN THE 174 COVERS IT.**

`delete_case` was **authorised** for this case and the dating condition for it **was met**. It was
**not exercised**, for one measured reason set out in §3. **Deletion remains available to the QA lead
at any time and this report is the ask.**

---

## 2. WHAT CHANGED ON THE CASE

| Field | Before | After |
|---|---|---|
| **title** | *"Toolbar search highlights matching blocks and fades non-matching ones"* | *"Toolbar search matches customer, work order, unit, technician and line names"* (76 chars) |
| **expected 1** | *"Blocks that match the search are highlighted; blocks that do not match fade."* | **REMOVED** → replaced by *"The toolbar search filters the blocks on the grid against what you typed."* |
| **expected 2** | *"All five fields match: customer name, work order number, unit number, technician name, and line name."* | **KEPT**, reworded to name the five explicitly |
| **expected 3** | *"Matching blocks stay in place on the grid (search visually filters; it does not remove or rearrange)."* | **REMOVED** |
| **expected 4** | *"Clearing the search restores all blocks to normal."* | **REMOVED** |
| **new expected 3** | — | a plain tester note: the specification does not say what happens to non-matching blocks, **do not pass or fail on that**, it is an open question with the product owner |
| **steps** | 3 steps, the third *"Clear the search"* | 2 steps — step 3 existed only to set up the deleted point 4 and asserted nothing once it went |
| **refs** | `SV-8686 (§6 (Search))` | `SV-8686 (§6 (Search) - spec v27 2026-08-07)` — **Rule 42 version pin**, because expected 2 closes a list |
| **provenance** | said the case *"still follows the older wording and needs the product owner to confirm which one stands"* | now names the **live** source and **discloses the divergence** (Rule 56) |
| **marker** | `AUTOMATION: READY` | `AUTOMATION: READY` — **unchanged** |

**The three removed points are exactly the three the brief predicted, and the reason differs by point:**

| Point | Verdict | Evidence |
|---|---|---|
| **1** — highlight/fade | **REMOVED — superseded** | in the PRD from v7 to v23; **deleted at v24, 2026-08-06T08:34:03.577Z**; not back in v25/26/27. The story still asks for it but that text is **10 days 22 hours older**. Latest wins. |
| **2** — the five matched fields | **KEPT — verified sourced word for word** | live PRD **v27 §6 Search**: *"Filters grid blocks by matching against customer name, WO number, unit number, technician name, and line name."* Present in **every** version from v7 to v27. |
| **3** — *"stay in place… does not remove or rearrange"* | **REMOVED — unsourced** | `rearrang` appears **0 times** in v27. It is a **corollary of the deleted sentence**, and it is the point that contradicts most directly what the deletion was for. |
| **4** — *"clearing restores all blocks"* | **REMOVED — unsourced** | `restore` **0 times** and `clearing` **0 times** in v27; the story is silent too. A reasonable corollary of any filter — but a corollary is inference, not a source. |

**Every one of those counts was re-measured against the live v27 body by this pass, not carried over
from yesterday's note.**

---

## 3. WHY IT WAS TRIMMED AND NOT DELETED — the one measured fact

**A live census of all 174 Schedule cases found that C30041 is the ONLY case that covers the grid
toolbar search at all.**

| Assertion searched for, across title + preconditions + steps + expected + refs of all 174 | Cases carrying it |
|---|---|
| the five-field search list (`unit number … technician name`) | **1 — C30041 and nothing else** |
| `non-matching` | **1 — C30041 and nothing else** |
| `rearrang` | **1 — C30041 and nothing else** |
| `fade` | **2 — C30041, and C29987 which is unrelated** (see §5) |

The only near neighbours are **C29953** *"'Search lines' matches the line title/name only"*, which is
the **sidebar line drill-down** search and not the toolbar, and **C30074**, a permissions case that
mentions search in passing. **Neither asserts the five fields.**

**So deleting C30041 would have destroyed the sole coverage of a requirement that is CURRENT in the
live specification — irreversibly, and with no way to put it back in this pass, because `add_case` is
barred here.** The QA lead's deletion ruling is conditional on *"if the requirement has been
deleted"*; **one of this case's four points rests on a deleted requirement, and another rests on a
requirement that is very much alive.**

**Standing Rule 25 says the repair for an unsupported assertion is to REMOVE THE ASSERTION, and Rule
42 says to make it scope-conditional — not to delete sourced coverage.** That is what was done. The
case that remains is no longer "the fade case" in any sense: its title, its steps and its expectations
are entirely the surviving requirement.

**⏳ THE ASK, IF HE WANTS THE CASE GONE ENTIRELY:** the five-field search coverage must first be
rehomed into a new case, which needs `add_case` authorisation. Say the word and it is one write —
**but note Standing Rule 62's creation hold, which bars new artefacts until his next order.**

---

## 4. WHAT WAS DELIBERATELY *NOT* ASSERTED

**The live PRD is SILENT on what happens to non-matching blocks.** *"Filters grid blocks by matching
against…"* says nothing about fading or hiding, and the design that would settle it is one we do not
hold.

**Writing *"non-matching blocks disappear"* into the case would have been taking the expectation from
the build**, which **Standing Rule 57** forbids outright, and **Rule 58** forbids settling a silent
source by looking at the build. **No build was opened by this pass at all.**

So the case now carries a plain tester note telling the tester **not to pass or fail on that point**,
and the question stays open with the product owner. It is already drafted as **Q1** in
`build/schedule/spec-v25-2026-08-06/QUESTIONS-FOR-BRANKO.md` and **has still not been sent.**

---

## 5. DOES THE SAME CONFLICT TOUCH ANY OTHER CASE? — NO

**Measured, not sampled: all 174 live Schedule cases, all five text fields each.**

- **`non-matching`: 1 case — C30041.** No other case asserts the fade behaviour.
- **`fade`: 2 cases — C30041 and [C29987](https://shopview.testrail.io/index.php?/cases/view/29987).**
  **C29987 was read in full and is NOT affected:** it is *"Month view: series banner wraps across
  weeks, labeled once, then 'continues'"*, `refs: SV-8692 (§4.6 (Month view))`, and its "fade" is the
  *"faded 'continues'-style label"* on a multi-week series banner. **That is the PRD's one surviving,
  unrelated occurrence of the word** and it is still in v27. **Not touched.**
- **`highlight`: 7 cases.** Six are the mini-calendar week/selected-date highlight, the drag
  drop-target highlight, the amber overtime highlight in a capacity tooltip, and the Day/Week/Month
  button that is switched on. **None is the search highlight.** All still sourced by v27. **Not
  touched.**
- **`restore`/`clearing`: 18 cases.** Seventeen are ordinary "restore the setting afterwards"
  preconditions and unrelated undo/toggle assertions. **Only C30041's was the search corollary.**
- **`SV-8874`: 0 cases** — the obsolete ticket is named nowhere, so nothing is left pointing at a
  defect raised against a requirement that no longer exists.

**So exactly one case needed treatment and exactly one case was touched.**

---

## 6. VERIFICATION (Standing Rule 50 — exhaustive then exact)

- **Pre-write guard:** the live case was proven **byte-identical to the snapshot on all 30 fields**
  before the payload was sent — so the reasoning was done on the text that was actually there.
- **All three text fields sent explicitly** (`custom_preconds`, `custom_steps`, `custom_expected`)
  plus `title` and `refs`, because TestRail **re-renders any text field omitted from the payload**
  through its HTML pipeline.
- **`update_case/30041` → HTTP 200**, then re-GET and byte-compared: **30 fields compared · 5
  intended fields all byte-match the payload · 23 untouched fields byte-identical to the pre-write
  snapshot · 0 collateral changes** (`updated_on`/`updated_by` are stamped by the server on any write
  and are excluded by definition).
- **`refs` verified under the declared TestRail normalisation** `','.join(p.strip() for p in
  s.split(','))`. **The payload contains no comma at all**, so the normalisation is a no-op — chosen
  deliberately, matching the comma-free house style of the newest sibling cases (C43582–C43587).
- **Markup census before and after: 0 raw markup and 0 CRLF in every field, both times.** Read back
  live: **exactly one provenance line, one build stamp, one automation marker, and the marker is the
  last non-empty line.** The barred phrase *"as per the build"* appears **0 times**.
- **`custom_atmstatus` re-verified live as `1` (Not Automated)** — Rule 64's deletion precondition
  checked again at write time, not taken from yesterday's note.
- **Run 357 (Ayesha Khan's) PROVEN UNTOUCHED BY CONTENT:** `include_all` still **false**; **174 tests
  before and after** with the `case_id` sets **equal in both directions**; **458 result records before
  and after, every one present BY ID, 0 new**; **0 graded or real field changes on any of the 458**.
  The **only** movement is `case_title` and `case_refs` on **3 records — all three belonging to
  C30041, the one case we retitled** — which are the **declared read-time echoes** recorded in
  `APP-ACTIONS-PLAYBOOK.md` §J, not stored values. Counters unchanged: 25 Passed / 0 Failed / 1
  Blocked / 148 Untested.
- **Standing Rule 59:** sources read at pass start and **RE-READ at 2026-08-11T10:18:18Z immediately
  before the write** — Confluence still **v27** (`2026-08-07T15:01:20.801Z`) with the fade sentence
  **still absent** and the five-field row **still present**; SV-8686 still **TESTING QA**, `updated`
  still **2026-08-07T01:02:57.009Z**. **Verdict UNCHANGED.**

**Operations: 1 `update_case`. 0 `delete_case`. 0 `add_case`. 0 section ops. 0 run writes. 0 results
logged. 0 Jira calls of any kind that write — SV-8874 was not touched, and no ticket was created,
edited, commented on or transitioned.**

---

## 7. FOREIGN CASES

**None exist here.** An authorship census of the whole Schedule group returns **`created_by = 3` for
all 174 cases** — every case under group 4254 is ours. **Rule 38 had nothing to bite on**, and it is
recorded as a measurement rather than an assumption.

---

## 8. OUTSTANDING — what I need from you

1. **Do you want C30041 deleted outright after all?** The fade requirement it was named for is gone,
   and the dating proves it. **The cost is that it is the only case covering the toolbar search's five
   matched fields, which the live specification still requires** — so deleting it needs the coverage
   rehomed first, and that needs `add_case`, which **Standing Rule 62's creation hold currently bars**.
   *Owner: you. Blocks: nothing today — the case is honest as it stands.*
2. **Branko still owes the search question, and it has never been sent.** *When you search the
   schedule, should the shifts that do not match fade out but stay where they are, or should they
   disappear from the grid until you clear the search?* Drafted as **Q1** in
   `build/schedule/spec-v25-2026-08-06/QUESTIONS-FOR-BRANKO.md`. **Blocks:** the case cannot assert
   anything about non-matching blocks until he answers, so that third of the requirement is untested.
   *Owner: Branko, via you. Outstanding since 2026-08-06.*
3. **Story SV-8686 is now stale against its own specification** — its Requirements **and** its
   Acceptance Criteria still demand the fade behaviour that the PRD deleted on 6 August, and its
   acceptance criterion for it is **ticked DONE**. **Under Rule 38 that is its owner's ticket to
   correct, not ours**, and no Jira write was made. *Owner: whoever owns SV-8686 — worth a word to
   Stefan Vukovic or Milos Vasic, who made the PRD decision.*
4. **Which design artefact is canonical for Schedule** — still outstanding from earlier passes, and it
   is the thing that would settle item 2 without troubling Branko. Stefan's *"per design we show only
   matching"* points at a design we have never been given (an **undated, editable** share link on
   SV-8915/8916/8917). *Owner: you.*

**Not touched deliberately:** `CLAUDE.md`, `build/OUTSTANDING-ITEMS-REGISTER.md` and
`build/schedule/PROJECT-STATE.md` — two other workers are live in this repository and the register is
a shared file. **The four items above are reported here instead of being written into it, so nothing
is lost; folding them into the register is a one-line job when the repo is quiet.**
