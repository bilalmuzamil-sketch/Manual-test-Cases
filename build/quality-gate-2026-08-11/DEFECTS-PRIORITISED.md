# DEFECTS — PRIORITISED — quality gate, 2026-08-11

**Ordered by what it costs a manual tester tomorrow morning.** Anything that would make a tester
**fail a conforming build**, or that a tester **cannot execute**, is at the top.

**3 were repaired in this pass** (marked ✅). **The rest are for the QA lead** — every one of them
either turns on a build fact this pass had no session to check, or needs a judgement about what the
product should do, which is not ours to make.

---

# 🔴 P1 — WOULD MAKE A TESTER FAIL A CONFORMING BUILD, OR CANNOT BE RUN

## P1-1 · The Work In Progress download family now contradicts itself — **9 cases, and at least 4 of them are wrong**

**Not repaired. This is the one to look at first, and it cannot be settled without opening the build.**

Nine cases (`WIP-EXP-01`…`WIP-EXP-09`) all test the same feature and all hang off the same defect,
**[SV-8907](https://shopview.atlassian.net/browse/SV-8907)** — *"Work In Progress cannot be
downloaded — a server error whenever the tab has any rows"*. **At the start of today, 8 of the 9
carried `READY - EXPECT FAIL (SV-8907)`. Today the family was split down the middle:**

| Case | Marker at 2026-08-10 23:53 | Marker now | Moved today? |
|---|---|---|---|
| [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | `READY - EXPECT FAIL (SV-8907)` | **`READY`** | ✅ |
| [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | `READY - EXPECT FAIL (SV-8907)` | **`READY`** | ✅ |
| [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | `READY - EXPECT FAIL (SV-8907)` | **`READY`** | ✅ |
| [C30517](https://shopview.testrail.io/index.php?/cases/view/30517) | `READY - EXPECT FAIL (SV-8907)` | **`READY`** | ✅ |
| [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | `HOLD - …Location column…` | **`READY - EXPECT FAIL (SV-8907)`** | ✅ |
| [C30512](https://shopview.testrail.io/index.php?/cases/view/30512) | `READY - EXPECT FAIL (SV-8907)` | unchanged | — |
| [C30513](https://shopview.testrail.io/index.php?/cases/view/30513) | `READY - EXPECT FAIL (SV-8907)` | unchanged | — |
| [C30514](https://shopview.testrail.io/index.php?/cases/view/30514) | `READY - EXPECT FAIL (SV-8907)` | unchanged | — |
| [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | `READY - EXPECT FAIL (SV-8907)` | unchanged | — |

**The suite now says both of these things about the same build at the same time:**

> **C30510, item 2:** *"Each option downloads a file of the current tab in the chosen format."* — and
> it is marked `READY`, i.e. **expected to pass**.

> **C30512 / C30513 / C30514 / C30518:** *"Nothing downloads. Both Download (PDF) and Download (CSV)
> fail on every tab that has any work orders in it — no file arrives… All four tabs behave the same
> way."* — marked **expected to fail**.

**They cannot both be true.** Either way **at least four cases are wrong**, and which four depends on
a fact nobody has:

- **If SV-8907 is fixed** — C30511, C30512, C30513, C30514, C30518 tell a tester to expect total
  failure and to *"mark this test FAILED"* on a **working build**.
- **If SV-8907 is NOT fixed** — C30510, C30515, C30516, C30517 assert that downloads work, and the
  Rule-61 second bullet then tells the tester *"that is a NEW problem — please report it"*, so they
  raise **duplicates of a known defect**.

**🔴 THE FLIP WAS MADE WITH NO BUILD SESSION.** Every Report Suite pass today recorded the build as
unreachable — *"`sv8582api.qa.shopview.com` returned **HTTP 401** — the session is dead"*
(`dated-provenance-2026-08-11/testrail-execution-log.md`), and the label pass likewise
(*"HTTP 401 `sso_required`, so nothing was opened in the application"*). **So the assertion that
SV-8907 is fixed rests on no observation** (Standing Rule 12). The only written basis is a narrative
line in `build/automated-cases-changed-2026-08-11/FOR-VLAD.md` — *"The problem behind them (SV-8907,
Work In Progress downloads failing) has been fixed"* — which appears in a document whose method was
**diffing case text across commits**, not observing the product.

**Note the trap in the numbers:** C30516 and C30517 assert things about **the contents of a
downloaded file** (export header labels; the logo in the PDF). The 5 August queue recorded exactly
this: *"Seven of these nine assert things about the CONTENTS of a downloaded file, and no file can be
produced, so their inner assertions are currently unobservable."* Marking them `READY` asserts that a
file can now be produced.

**WHAT IT NEEDS:** one download attempt on the Work In Progress report, on any tab with rows. That
single observation settles all nine.

---

## P1-2 · C29945 — a precondition a tester cannot satisfy, with no BLOCKED instruction

**Not repaired.** [C29945](https://shopview.testrail.io/index.php?/cases/view/29945) — Schedule,
*"Priority filter offers High, Medium, Low and narrows the list accordingly"*, marker `READY`.

**Precondition 2:** *"Work orders exist with different priorities (High and Low at minimum)."*

**A tester cannot produce that state, and nothing in the case tells them what to do about it:**

- [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) is on
  `HOLD - the Priority field this test needs does not exist in the build` — **the work-order form
  offers no way to set a priority**;
- our own 4 August live check recorded, for this very case: *"Priority offers High, Medium and Low
  with counts and narrows the list; **all three are 0 in this data because no work order carries a
  priority**"* (`build/schedule/viu-2026-08-04/RECHECK-QUEUE.md` row 60).

So **expected item 1** (the group offers High/Medium/Low) is checkable, and **expected item 2**
(*"Only High-priority work orders remain in the list"*) is **not** — there are none. The case offers
no *"if none exists, mark BLOCKED"* path, which sibling cases such as
[C43590](https://shopview.testrail.io/index.php?/cases/view/43590) do give.

**WHAT IT NEEDS — two options, and Standing Rule 14 prefers the first:** **seed a priority** (if any
route exists, e.g. the API) so the case becomes runnable; **or** add a conditional BLOCKED
instruction. Not done here because the data state is a 4 August observation this pass cannot
re-verify, and because Rule 14 says seed rather than block.

**Adjacent, and out of scope only because they were not changed today** — the same shape, each with a
sibling HOLD proving the state cannot be produced: [C30401](https://shopview.testrail.io/index.php?/cases/view/30401)
(needs a location with no default labor rate — cf. C30407/C30408) ·
[C30339](https://shopview.testrail.io/index.php?/cases/view/30339) and
[C30555](https://shopview.testrail.io/index.php?/cases/view/30555) (need a part with no category —
cf. C30547). Worth the same decision.

---

## ✅ P1-3 · C38914 — an EXPECT-FAIL case with no symptom and no instructions — **REPAIRED**

[C38914](https://shopview.testrail.io/index.php?/cases/view/38914). **1 of 107** EXPECT-FAIL cases in
the population, and **the only one**, carrying no Rule-61 symptom and none of the three outcomes. Its
expected result says the Location column is *"the LEFTMOST column, before Type"*; it is sixth. A
tester would have hit an unexplained failure and either filed a duplicate of
[SV-8938](https://shopview.atlassian.net/browse/SV-8938) or waved a genuinely new defect through as
the known one.

**Repaired** using our own recorded live observation on the same build the case already names
(`full-viu-2026-08-06/FINDINGS.md` line 65, `v3.5-16cf83f`), so no new build fact was asserted. See
`testrail-execution-log.md`.

---

## ✅ P1-4 · C30162 and C30287 — symptom blocks describing a **different report** — **REPAIRED**

[C30162](https://shopview.testrail.io/index.php?/cases/view/30162) (Sales By Customer) and
[C30287](https://shopview.testrail.io/index.php?/cases/view/30287) (Sales By Representative) were
given, **today**, a symptom block naming the **Inventory Value** column set — *"Part #, Description,
Category, Vendor, Qty, Unit Cost, Unit Sell, Total Cost, Total Sell"* — and that report's example
figure `$11,176.88`. Neither report has those columns.

A tester cannot match a symptom from another report, and the Rule-61 second bullet then tells them it
is *"a NEW problem — please report it"*. **So the text manufactured duplicate tickets on two
reports.** Confirmed a regression from today: the block is absent from both at the pre-today
baseline. **Repaired** by promoting each case's own already-present correct symptom sentence.

---

# 🟠 P2 — MISLEADS A TESTER OR AN AUTOMATION ENGINEER, BUT NOBODY IS BLOCKED

## P2-1 · Three cases state a known failure in their own words while carrying a plain `READY` marker

Each says on itself that the product does not do what the case expects, and names the ticket — but
the marker does not say `EXPECT FAIL`, and none carries the Rule-61 three outcomes.

| Case | What its body says | Marker |
|---|---|---|
| [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) | *"Known issue: the product does not currently do this. It has been filed for a fix here: SV-8927"* | `READY` |
| [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) | *"Known issue: the product does not currently do this … SV-8823"* | `READY` |
| [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) | **says nothing at all**, though the click-to-arm regression was **re-confirmed live on 11 August** — *"no arm test-id, no `aria-label` containing 'by click', no arm markup anywhere"* ([SV-8957](https://shopview.atlassian.net/browse/SV-8957)) | `READY` |

**C29962 is the sharper of the three**: it gives the tester no hint whatever, and 7 other Schedule
cases are on `HOLD` *because of* the same missing control.

**NOT CHANGED — deliberately.** Setting `EXPECT FAIL` asserts that a case currently fails, and this
pass had no build session; the brief is explicit that no `READY - EXPECT FAIL` may be added without
live backing. **Recommended: `READY - EXPECT FAIL (SV-8927 / SV-8823 / SV-8957)` plus the standard
three-outcome block — one write each.**

## P2-2 · Six new Schedule panel cases marked `READY` for a feature with no UI

[C43582](https://shopview.testrail.io/index.php?/cases/view/43582) ·
[C43583](https://shopview.testrail.io/index.php?/cases/view/43583) ·
[C43584](https://shopview.testrail.io/index.php?/cases/view/43584) ·
[C43585](https://shopview.testrail.io/index.php?/cases/view/43585) ·
[C43586](https://shopview.testrail.io/index.php?/cases/view/43586) ·
[C43587](https://shopview.testrail.io/index.php?/cases/view/43587)

Each records in its own body that on 11 August *"the Schedule toolbar had no panel button at all"*.
The same suite uses `HOLD - <feature> does not exist in the build` for exactly this situation —
C38868 (Dashboard), C38869 (appointment), C38871 (Priority) — and the Report Suite likewise
(*"HOLD - this part of the report is not built yet"*).

**The manual tester is safe** — the body tells them plainly to mark it failed — so this costs the
**automation engineer**, who builds his worklist from `READY` and would automate six cases against a
control that does not exist. **Not changed**: it turns on a build fact this pass cannot verify, and
re-classifying a marker is a judgement, not a repair.

## P2-3 · C30102 — the title promises coverage the expected result does not deliver

[C30102](https://shopview.testrail.io/index.php?/cases/view/30102), *"Date range picker offers **nine
periods in the specified order**, no All Time"*. Its expected result is numbered **1, 3, 3** —
**item 2 is missing**, and **no item enumerates the nine periods**. So the case cannot test what its
title claims, and a reviewer reading the title would believe it covered.

**This one PREDATES today** — the same 1, 3, 3 is in the pre-today baseline — but a pass touched the
case today and Standing Rule 41 makes the whole case its business.

**Not repaired**, because the fix restores a lost requirement item rather than correcting formatting.
**Three sibling cases carry the exact sentence** and it is a copy-paste away —
[C30536-family](https://shopview.testrail.io/index.php?/cases/view/30536) `IV-DATE-01`,
`PV-FILT-03`, `WIP-FLT-04`:

> *"The chooser offers nine ready-made periods, in this order: Last 12 Months, This Year, Last Year,
> This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week. …There is no "All Time"
> option."*

---

# 🟡 P3 — WOULD NOT AFFECT TOMORROW'S RUN

| # | Case | What is wrong | Recommendation |
|---|---|---|---|
| P3-1 | [C30551](https://shopview.testrail.io/index.php?/cases/view/30551) · [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) | *"…non-identity columns.**The question is in the round-3 question sheet:**"* — no space after the full stop, and the sentence that would give *"the question"* an antecedent is missing. C30511 and C30156 carry the complete pattern | restore the missing sentence from C30511's wording |
| P3-2 | [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | Dates **Confluence version 19** to *"the afternoon of 4 August"*. The cached Confluence metadata says v19 is **2026-08-06T11:48:47Z**, and 108 sibling cases agree; 4 August afternoon is **v18** — which is what actually carried the date-filter change this case describes | correct the date to 6 August |
| P3-3 | [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) (+ C29621, C29623, C29625, C29626, C29627, C29628) | `refs` carries the **superseded 4 August** note *"single-filter sheet applies instantly with no Apply button"*, which its own expected result contradicts. The expected result is the correct side (Branko, 5 Aug, SV-8825) | drop the stale clause from `refs`; **a tester never sees `refs`, so nobody is misled tomorrow** |
| P3-4 | [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | The **only case in all 771** whose preconditions and expected result are unnumbered run-on lines; *"(all API-seeded)"* is mild jargon | renumber — **but it is one of Vlad's Automated cases, so Rule 65 applies** |
| P3-5 | [C29584](https://shopview.testrail.io/index.php?/cases/view/29584) | Garbled clause: *"as a small removable tag above the list **in the list**"* | delete the trailing *"in the list"* |
| P3-6 | [C43555](https://shopview.testrail.io/index.php?/cases/view/43555) | Body says *"The question has been put to the product owner on SV-8870"*; the marker says *"the question has not been sent yet"*. Both can be true (the ticket exists, the question sheet is unsent) but it reads as self-contradictory | one clarifying clause |

---

# NOT A DEFECT — recorded so nobody "fixes" it

**`later later` is the BUILD's own typo, and correcting it would have broken six cases.** Six cases
quote *"An error occurred. We're sorry for this inconvenience, please try again a bit later later."*
It reads like our copy-paste slip. It is not: the raw captured response body in
`build/ticket-reformat-2026-08-06/report-suite/snapshots/working-set.json` records the product's own
JSON with the doubled word. Quoting it exactly is **Standing Rule 9 working correctly**. Worth
telling the QA lead only as a **product typo**.
