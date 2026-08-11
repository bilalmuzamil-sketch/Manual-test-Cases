# Schedule — CHANGES MADE — 2026-08-11

Ten TestRail operations. Every one HTTP 200 and byte-verified. **Nothing else was touched:** no
deletion, no section write, no run write, no result logged, no Jira call that creates anything.

---

## In one table

| # | Op | Case | What changed, in one plain phrase |
|---|---|---|---|
| 1 | `update_case` | **[C43582](https://shopview.testrail.io/index.php?/cases/view/43582)** | our own sentence said "steps 1 to 8"; the case has **7** steps |
| 2 | `update_case` | **[C43583](https://shopview.testrail.io/index.php?/cases/view/43583)** | same sentence; the case has **6** steps |
| 3 | `update_case` | **[C43584](https://shopview.testrail.io/index.php?/cases/view/43584)** | same sentence; the case has **7** steps |
| 4 | `update_case` | **[C43585](https://shopview.testrail.io/index.php?/cases/view/43585)** | same sentence; the case has **4** steps |
| 5 | `update_case` | **[C43586](https://shopview.testrail.io/index.php?/cases/view/43586)** | same sentence; the case has **5** steps |
| 6 | `update_case` | **[C43587](https://shopview.testrail.io/index.php?/cases/view/43587)** | same sentence; the case has **7** steps |
| 7 | `update_case` | **[C29998](https://shopview.testrail.io/index.php?/cases/view/29998)** | one new expected item — the "+N more" overflow uses **shape**, not colour — plus §11 added to `refs` and to the provenance anchor |
| 8 | `update_case` | **[C38866](https://shopview.testrail.io/index.php?/cases/view/38866)** | `refs` only: epic → **owning story SV-8700**, the comma removed, and a claim the case never tested dropped |
| 9 | `add_case` | **[C43588](https://shopview.testrail.io/index.php?/cases/view/43588)** = `SCH-EDGE-09` | NEW — dark mode is chosen from the user menu and remembered per user |
| 10 | `add_case` | **[C43589](https://shopview.testrail.io/index.php?/cases/view/43589)** = `SCH-EDGE-10` | NEW — in dark mode pop-ups still look raised above the page |

**Suite: 174 → 176 cases.**

---

## 1–6 · The six Panel collapse cases — a defect in our own text

Every one of the six told the tester *"…so on that build **steps 1 to 8** cannot be carried out and
this test FAILS."* **Five of them do not have eight steps. Nor does the sixth.** The sentence was
copied from C43582, which has eight **expected results** and **seven steps**, so it was wrong on all
six — the brief's "five of them" undercounts by one, and the correction is recorded rather than
quietly absorbed.

**Every count was re-counted from the case's own live `custom_steps`** (leading `N.` markers only, so
a wrapped continuation line cannot inflate it) — not read from the brief and not read from the
staged pack. They came out **7 · 6 · 7 · 4 · 5 · 7**, which happens to agree with the brief, but the
agreement is a check, not the source.

**Why it matters and is not pedantry:** a tester who reads *"steps 1 to 8"* on a four-step case
either thinks the case is truncated or thinks they have lost their place. It is also the first thing
a reviewer notices, and it is on six brand-new cases.

**Nothing else on those six changed** — one digit each, field lengths identical before and after.

---

## 7 · C29998 — the overflow must be tellable by shape, not colour

**New expected item 4**, inserted before the separator; the old item 4 became item 5:

> *"4. You can tell the '+2 more' is something to click without relying on its colour: it carries
> the count as words you can read, and it is drawn as its own distinct shape - a small chip, pill or
> button - not just a differently coloured patch of the lane."*

**Why:** §11 requires *"Overtime and conflict signals are not color-only (OT uses a text tag; **the
overflow uses shape**)"*. The sibling half is covered —
[C30032](https://shopview.testrail.io/index.php?/cases/view/30032) asserts the OT text tag — and
that is exactly why this slipped: at line level the requirement read *covered* and closed. C29998
asserted the overflow **exists** and **opens**, never that it is conveyed by shape, so a build using
colour alone would have passed the whole suite. **The requirement has been in the spec since version
1, 2026-07-15 — 27 days.** It is the oldest uncovered thing the re-derivation found.

`refs`: `SV-8693 (§4.7)` → `SV-8693 (§4.7 lane cap and overflow + §11 the overflow uses shape - spec
v27 2026-08-07)`.

---

## 8 · C38866 — references corrected, assertions untouched

**Gated on proof, and the proof was obtained before the write.** SV-8700 requirement 5, read live:
*"Dark theme: built on design-system color tokens. Surfaces, borders, text, accents, and
elevation/shadow tokens remap automatically. **User-selectable from user menu, persisted per
user.** — (PRD: §11)"*. The story states the requirement and cites §11 itself, so it is the owning
story and the write proceeded.

Three faults, one write: it cited the **epic** where a story owns the requirement · it **claimed
"persisted per user"** while the case's four steps never sign out · and it carried a **comma**, so
TestRail stored it as two references, the second being the fragment `persisted per user))`.

**No assertion, step or precondition was changed** — all three text fields were sent at their exact
pre-write values, as instructed.

---

## 9–10 · The two new dark-theme cases

**C43588 = SCH-EDGE-09 — "Dark mode is chosen from the user menu and is remembered for you".**
C38866 asserts dark-mode **rendering**. It never chooses the theme from the user menu and never
signs out, so **neither "chosen from the user menu" nor "persisted per user" was asserted by any
case** — while C38866's own `refs` claimed the persistence. Requirement in the spec since **v19,
2026-07-23 — 19 days**.

**C43589 = SCH-EDGE-10 — "In dark mode pop-up windows still look raised above the page".**
**Readability and depth are different properties with different failures.** A dialog can be
perfectly readable and still look flat, because a dark shadow drawn on a dark surface disappears.
C38866 asserts readability; nothing asserted depth. Requirement in the spec since **v19**.

**It deliberately does NOT assert that the app uses "elevation/shadow *tokens*"** — an
implementation detail nobody can see on a screen. It asserts the observable consequence the
requirement itself names: *"so depth reads correctly on dark surfaces"*.

Both: section **4280**, `AUTOMATION: READY`, `custom_atmstatus` **1**, no build stamp.

---

## THREE DELIBERATE DEPARTURES FROM THE STAGED MANIFEST — stated plainly, not buried

The staged pack `build/schedule/coverage-gaps-2026-08-11/NEW-CASES.md` is our own document, not a
ruling, so where a Standing Rule and the pack disagreed the rule won. All three departures are
**wording/metadata**; **no source, anchor or assertion was changed from what the pack staged.**

**(a) The provenance line carries a read-date PER CITED SOURCE.** The pack staged *"…and the
Schedule specification version 27 (§11 Dark theme), **both** read on 11 August 2026."* — the
pre-amendment form with one trailing date, and *"both"* does not even match the three sources it
names. All 174 live Schedule cases now carry a read-date per source after Rule 54's 2026-08-11
amendment, so the two new cases were written in that form. The suite stays uniform in one state
rather than splitting into two.

**(b) C29998's provenance anchor gained §11.** The pack said the provenance block was unchanged. But
the new item is sourced from **§11**, not §4.7, and leaving §11 unnamed would have made the case
assert something no source it cites supports — the precise Rule-54 defect that
`COVERAGE-REDERIVATION.md` §8 reports on five other cases. The anchor now reads *"(§4.7 Overlap and
lane stacking and §11 Accessibility - the overflow uses shape)"*. **Sentence 2 was kept verbatim**
and is still true of the case as a whole.

**(c) C38866's `refs` names SV-8698 as well as SV-8700.** The pack's §8 write-up named only SV-8700.
But the case's third assertion — *"Conflict and overtime cues remain distinguishable (they never
rely on colour alone)"* — is a §11 **accessibility** assertion, not a dark-theme one, and the suite
already credits **SV-8698** with *"not color-only"* on C30032. Naming only the dark-theme half would
have reproduced, in a new form, the very fault being fixed: a reference that does not describe what
the case actually asserts.

---

## What was NOT done, and why

* **Run 357 was not written to.** It needs to go 174 → 176, it belongs to Ayesha Khan, and the QA
  lead has not authorised it. The full 176-id union is computed, the snapshots are taken and the
  exact call is staged in `STAGED-RUN-357-SYNC.md`. **A partial `case_ids` list would DELETE the
  omitted tests and their 458 recorded results, so it is union-only or nothing.**
* **No build stamp was added to anything.** No build was observed: `quick-login` and `switch-user`
  were not called, because they rotate the shared session and two siblings are live on this estate.
  A build date nobody earned is a fabricated observation.
* **No `READY - EXPECT FAIL` marker was set** — no live source backs one on any of these ten, and
  Rule 61 as amended today is explicit: no backing, no marker. The tester discovers pass or fail.
* **No Jira ticket, comment or field change.** The creation hold of 2026-08-10 stands; the two Jira
  and Confluence calls this pass made were both reads.
* **No deletion, no retirement, no section change, no foreign case touched** — and there are no
  foreign cases in group 4254 to touch: `created_by` is 3 on all 176.
* **C38866's own provenence line still names the epic rather than SV-8700.** Correcting it is a
  text change to an assertion-bearing field and was outside this pass's scope, which was `refs`
  only. It is written up in `FINDINGS.md` as owed.
