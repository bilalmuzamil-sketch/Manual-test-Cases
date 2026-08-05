# Filters — the deliberate-decisions register, 5 August 2026

Standing Rule 46. Every deliberate non-action, every case that follows one source over another, and
every accepted imperfection, written down **before anyone asks**. Six fields per entry. Read the RISK
column honestly: **HIGH does not mean we are wrong — it means if this is raised in public we have a
concession to make, not just an explanation.**

---

### 1. The five waivers were wrong, and we are saying so rather than explaining them away

- **Decision:** the *"Known and accepted … on purpose for now. Do not raise this as a new problem."*
  paragraph is deleted from all five cases and the documented requirement is restored.
- **Plain answer:** we had let a closed ticket rewrite what the test expects; a closed ticket only
  decides whether something gets fixed, so the tests now expect what the specification says.
- **Evidence:** live Confluence v18 — S1-R1, S1-R5, S8-R3, S8-R4, S8-R5, all quoted verbatim in
  `../expected-behaviour-audit-2026-08-05.md`.
- **Cases:** FLT-BAR-01 [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) ·
  FLT-COLL-02 [C29602](https://shopview.testrail.io/index.php?/cases/view/29602) ·
  FLT-EMPTY-01 [C29606](https://shopview.testrail.io/index.php?/cases/view/29606) ·
  FLT-EMPTY-02 [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) ·
  FLT-PSRCH-09 [C38899](https://shopview.testrail.io/index.php?/cases/view/38899)
- **Who closes it:** closed. Fixed this pass.
- **RISK: HIGH.** Ahtasham raised **SV-8876** about exactly this at 06:17 today, quoting our own note.
  If it comes up, the concession is ours: **we disarmed five tests and an outsider caught it.**

### 2. SV-8843, SV-8845 and SV-8847 are closed while the build still fails them — reported, not reopened

- **Decision:** state the contradiction, qualify the tickets on the cases, reopen nothing.
- **Plain answer:** three problems were reported and the reports were closed, but the app still does
  the wrong thing, so the tests still expect the right thing and warn the tester not to wait for a fix.
- **Evidence:** measured live on `v3.4.2-d00239b` — see `FINDINGS.md`. SV-8843 and SV-8847 were closed
  **under our own shared account** (4 Aug 21:41 and 22:02 −0500); SV-8845 by Ahtasham (5 Aug 04:41).
- **Cases:** C29557 · C29606 · C29607 · C29618 · plus the mobile set.
- **Who closes it:** **the QA lead.** Reopening tickets is his decision, not ours.
- **RISK: MEDIUM.** Recommendation on the record: **SV-8845 is the one worth reopening** — a phone
  ignores every shared filter link and silently substitutes `estimate`, which is a data-correctness
  fault rather than a layout preference.

### 3. The button label follows the build, the behaviour follows the specification

- **Decision:** the cases say **"Apply Filters"** with a capital F, because that is the on-screen text,
  while S12-R6 keeps deciding what the button must *do*.
- **Plain answer:** the tester must read the words that are actually on the screen; the rulebook still
  decides how it should behave.
- **Evidence:** live at 390 × 844 — on-screen text exactly `"Apply Filters"`,
  `data-test-id="apply_filters"`. Confluence v18 §4 and S12-R6 write *"Apply filters"*.
- **Cases:** FLT-MOB-02 [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) ·
  FLT-MOB-03 [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) ·
  FLT-MOB-04 [C29624](https://shopview.testrail.io/index.php?/cases/view/29624)
- **Who closes it:** nobody — Standing Rule 9 settles it.
- **RISK: LOW.** Worth Branko fixing the casing in the PRD so the two stop disagreeing.

### 4. No new ticket was filed, on purpose

- **Decision:** file nothing; every fault observed already has a ticket.
- **Plain answer:** everything we found was already reported by somebody, so filing again would just
  create duplicates.
- **Evidence:** `FILED.md` maps every observed fault to its existing ticket.
- **Cases:** all the deviation cases.
- **Who closes it:** closed.
- **RISK: LOW.** The one judgement call is SV-8875, whose text already names our C29622/C29623/C29624 —
  so it is unambiguously the same defect.

### 5. C29630 lost a note that was not about it

- **Decision:** remove the shared-link "Known issue" note from FLT-MOB-10.
- **Plain answer:** that note described a different problem than the one this test checks, so it would
  have made a passing test look like a failure.
- **Evidence:** the case's own steps reach the empty state **by tapping a filter**, never by opening a
  link; and tapping *Imported* live gave the correct empty state with a Clear Filters link.
- **Cases:** FLT-MOB-10 [C29630](https://shopview.testrail.io/index.php?/cases/view/29630)
- **Who closes it:** closed.
- **RISK: LOW.**

### 6. C38882's ten date periods are out of the expectation, not replaced by the build's

- **Decision:** the assertion becomes scope-conditional (Rule 42); the observed list survives only as
  clearly-labelled orientation.
- **Plain answer:** the rulebook does not say which ready-made date ranges exist, so the test no longer
  checks them against a fixed list — it asks the tester to write down what their report offers.
- **Evidence:** Confluence v18 §4 says only *"standard predefined ranges"* — it never enumerates.
- **Cases:** FLT-RPTS-23 [C38882](https://shopview.testrail.io/index.php?/cases/view/38882)
- **Who closes it:** Branko, if he ever wants the list pinned.
- **RISK: LOW.**

### 7. 81 of the 110 were not re-driven live today

- **Decision:** carry their verdicts forward from the 04:20–04:53Z re-check **and label them as
  carried, case by case**.
- **Plain answer:** we re-tested on the app the parts that were unresolved; the rest were tested
  earlier the same day on the very same version of the app, and each one says so.
- **Evidence:** the build marker was byte-identical at 13:22Z, 14:13Z and 14:25Z and matches the marker
  the 04:20Z pass recorded, so it is the **same build** — but an earlier observation is still an
  earlier observation (Standing Rule 12).
- **Cases:** the 81 named individually in `FINDINGS.md`.
- **Who closes it:** a full 110-row live re-drive, when the QA lead wants one.
- **RISK: MEDIUM.** If asked *"did you observe all 110 today?"* the honest answer is **no, 29** — and
  the document says so rather than implying otherwise.

### 8. The branch is still not declared final

- **Decision:** keep the Rule-49 queue OPEN and call every verdict PROVISIONAL.
- **Plain answer:** the developers say they are still working on this version, so anything we learned
  from it has to be checked again when they finish.
- **Evidence:** no final-build declaration has been given for `sv8785`.
- **Cases:** all 110.
- **Who closes it:** engineering, by declaring the branch final.
- **RISK: LOW** — but it means **no Filters claim is durable yet**, and that must not be dropped from
  any summary.

### 9. `AUTOMATION: HOLD` on 10 cases, and why none of them is a tool excuse

- **Decision:** 8 hold because the feature is **not in the product**; 1 because it needs a **second
  test login**; 1 because the **report filter bars are not built** beyond the first tab.
- **Plain answer:** these are waiting on the product or on a second account, not on a tool.
- **Evidence:** a viewport, devtools, DOM and network inspection, reading a CSV or a PDF, seeded data
  and theme toggles are **all automatable** and none of them was used as a reason to hold. In
  particular **the mobile cases are no longer HOLD** — a 390-pixel screen is automatable.
- **Cases:** C38904–C38911 · C29615 · C38882
- **Who closes it:** the product team (8 + 1) and whoever can provide a second test login (1).
- **RISK: LOW.**
