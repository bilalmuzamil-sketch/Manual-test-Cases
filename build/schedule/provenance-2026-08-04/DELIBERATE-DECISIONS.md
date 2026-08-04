# Schedule — DELIBERATE-DECISIONS / anticipated-challenge register (Standing Rule 46)

**Pass:** Standing Rule 54 provenance retrofit, 2026-08-04.
**Purpose:** every deliberate omission, every case that follows a ruling over spec text,
every HELD item and every accepted imperfection is written down **before anyone asks** —
because *an undocumented deliberate omission is indistinguishable from a miss.*

> **The PO-ruling half of this register lives in `PO-RULING-DEFENCE.md`** (one row per
> affected case: our quoted assertion · the spec verbatim with anchor and version ·
> Branko's ruling verbatim with date and repo path · why it wins · who closes it · honest
> risk · a paste-ready answer). This file carries the **rest** of the categories so there
> is one place per project.

**HONESTY CLAUSE.** This records what we **decided**, never what we wish we had decided.
The two defects found this pass are logged **as defects, dated**, not relabelled as choices.

## 1. Requirements not asserted because THE SPEC CONTRADICTS ITSELF

| Decision | Plain one-sentence answer | Evidence | Affected cases | Who closes it | Risk |
|---|---|---|---|---|---|
| We did **not** pick a side on whether shop closures block the multi-day spread | *"The spec says closures are not skipped in the first release in one place and that they do block the spread in another; nobody has decided yet, so our tests follow the sentence that is explicitly about the first release and say on their face that a decision is awaited."* | Spec v23 **§4.5** *"Shop closures and public holidays are not skipped in V1."* vs **§12** *"Shop closures … block the spread step from placing shifts on those days."* Both live. Question **NQ-1**, `branko-answers-2026-07-31/answers-ingested.md` | SCH-EDGE-05 [C30089](https://shopview.testrail.io/index.php?/cases/view/30089) · SCH-SPREAD-07 [C29983](https://shopview.testrail.io/index.php?/cases/view/29983) · SCH-SPREAD-08 [C29984](https://shopview.testrail.io/index.php?/cases/view/29984) | **Branko** (NQ-1, on the Round-3 sheet that appears never sent) | **HIGH** ×2 · MEDIUM ×1 — the **engineering tech plan agrees with §12, i.e. against us**, so §4.5 is our only support |

## 2. Cases that follow a PO RULING over the spec text

**5 cases — full detail in `PO-RULING-DEFENCE.md` group A.** Summary: the modal money
figures (3 cases, Branko 2026-07-22) and the tooltip VIN (2 cases, Branko 2026-07-31).
Risk LOW ×4, MEDIUM ×1.

## 3. Requirements deliberately NOT authored

| Decision | Plain answer | Evidence | Who closes it | Risk |
|---|---|---|---|---|
| **No case for backend own-data write-scoping** | *"Whether a technician can change another technician's shift is not written down anywhere, so we did not invent a test for it."* | Spec **§14 is silent** (re-confirmed on live v23); the tech plan builds own-data scoping. Branko declined the question: *"I'm not sure if this question is for me Bilal."* | **Dev / engineering** | MEDIUM — a real backend behaviour has no coverage at all, and we will not guess it |
| **No case for the empty TestRail section 5406 "Week Export and Printing"** | *"The printable week view is not in this release, so its one test case was retired; the empty folder was left in place on purpose."* | Branko 2026-07-31: *"No. There is nothing about this in the PRD, not in the future requirements."* C38853/C38854 verified **absent from TestRail** 2026-08-04 | **QA lead** (one cleanup op) | LOW |

## 4. Assertions taken from the ENGINEERING TECH PLAN rather than the spec

| Decision | Plain answer | Cases | Risk |
|---|---|---|---|
| Spread caps (8-week confirm, 120-shift hard limit) | *"The spec never gives a maximum length for a spread job; these limits come from the engineering plan and the tests say so."* | SCH-SPREAD-11 [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) · SCH-API-02 [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | MEDIUM ×2 — engineering intent, never ratified by the PO (Rule 30) |
| Five regression / API cases with **no spec requirement at all** | *"Five tests cover things the spec does not mention — what happens to existing shifts at the rewrite, how the Dashboard counts a spread job, and how locations are scoped — and each test says so on its face."* | [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) · [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) · [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) · [C38870](https://shopview.testrail.io/index.php?/cases/view/38870) · [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | MEDIUM ×4 · LOW ×1 — C38868 and C38870 describe user-visible **changes** no product doc states |

## 5. Cannot be settled without a live build

**All 165 cases are VIU-Pending and every provenance line is deliberately at state 1 with
NO build date.** There is no Schedule QA environment; the ticket for one is
**SV-8812**, in Board Backlog. ~18 on-screen labels remain design-pinned, and
**design-pinned is NOT verified** (Rule 12). Risk: **this is the largest single gap in the
project** and it is an access ask, not a QA failure.

## 6. Foreign-case overlaps (Rule 38)

**None.** Group 4254 held **0** cases created by anyone but us, verified by a fresh live
read before and after the push (`created_by == 3` on all 165).

## 7. Known imperfections ACCEPTED or SCHEDULED — logged as defects, dated

| Item | Status | Honest note |
|---|---|---|
| **SCH-HRS-04 [C38849](https://shopview.testrail.io/index.php?/cases/view/38849)** leaked a bare internal cross-reference `(/02)` into tester-facing preconditions | **FIXED 2026-08-04** in this pass | Found by the Rule-41 whole-case re-read, **not** by design. It had been sitting in the live suite since 2026-07-31 and was already a known go-ahead item — a whole-case re-read caught it for free while the case was open |
| The **`gen_import.py` `clean()` bug** that caused it — strips the internal ID but leaves the bracket | **STILL OPEN** | Needs the QA lead's go-ahead. A future regeneration would reintroduce the pattern on any case carrying a `(/NN)` cross-reference |
