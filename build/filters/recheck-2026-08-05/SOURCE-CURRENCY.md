# Filters — SOURCE-CURRENCY block (Standing Rule 31), 5 August 2026

Established **before** any work was done, as the first action of the task.

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| **Specification** | Confluence page **572030978** "Filters", space SHOPVIEW | **Confluence version 18**, published **2026-08-04T18:19:21Z** by **Branko Cicovic**, version note *"Date-range filter: reflect current in-app default range and standard predefined ranges (Feature Overview + Key Decisions)"*. Page body still reads **"Version: 1.6"**. **128** numbered requirements. | 2026-08-05, fetched live over Confluence REST, HTTP 200, body saved to `evidence/spec-v18.xml` | **CURRENT** — and it had moved since our baseline, so the delta was folded in FIRST. One case (FLT-RPTS-23) had to change. |
| **Epic and its child stories** | **SV-8785** "Filters" | 21 children read live. 14 stories SV-8786…SV-8799 (SV-8795 and SV-8796 **Ready for QA**, the rest Open), 1 clarification story SV-8825 (**Open, 0 comments**), 5 bugs SV-8843…SV-8847, and our new SV-8871 | 2026-08-05, `parent = SV-8785`, HTTP 200 | **CURRENT** — no story added or removed since 4 August; two bugs closed OBSOLETE and one retitled, all read individually |
| **Designs** | Figma file `DR4gEODShYgJqkozs3mF5q`, node 11854-23562 | 85 of 85 boards captured 2026-07-31; the Rule-35 fetch queue is **CLOSED** | 2026-08-05, `ls build/*/design-*/PENDING-FIGMA-FETCH.md` — no OPEN queue anywhere | **CURRENT** |
| **Engineering tech plan** | Filters tech plan, reconciled 2026-07-29 (`build/filters/tech-plan-2026-07-29/`) | unchanged; Branko answered all 9 of its questions on 2026-08-04 | 2026-08-05 | **CURRENT** |
| **PO / stakeholder answers** | `build/filters/branko-answers-2026-08-04/answers-ingested.md` | 9 of 9 answered 2026-08-04; **no newer answer exists**, and SV-8825 is still unanswered | 2026-08-05 | **CURRENT**, with one **known gap**: the mobile Apply-button question is open, which is why 8 cases stay held |
| **The BUILD, treated as a source (Rule 49)** | branch `sv8785.qa.shopview.com`, API `sv8785api.qa.shopview.com` | **`v3.4.2-d00239b`**, `index.html` last-modified **Tue, 04 Aug 2026 22:51:02 GMT**, etag `b9ab1d41718b5e871432064ed914e2e7`. Read at **03:38**, **04:30** and **04:42 UTC** — identical all three times. | 2026-08-05, read first-hand before anything was touched | **PARTIAL** — the branch has **not been declared final by engineering**, so every verdict is PROVISIONAL and the re-check queue stays OPEN. That is the exact shortfall. |
| **Test run** | TestRail run **352** (Ahtasham Amjad's Filters run) | 110 tests, 425 result records, `include_all` false. 23 Passed / 7 Failed / 80 Untested; **he is actively executing it** — his 30 results were logged 2026-08-04 between 08:27 and 19:34 UTC | 2026-08-05, snapshotted before and after our writes | **CURRENT** — and proven byte-identical afterwards |

## The staleness traps, checked rather than assumed

- **The specification's in-body version number is stale and would have misled us.** The body says
  **"Version: 1.6"** while the real Confluence version is **18**. Going by the body would have said
  "no change since 28 July", and the date-filter rule had in fact been reversed. **We went by the
  Confluence version number**, which is the trap Standing Rule 31(a) exists for.
- **Two epic bugs showed a moved "updated" date for administrative edits only** — SV-8843 and
  SV-8847 were closed, and SV-8844 was retitled and reassigned by someone else. Each was opened and
  read individually rather than judged by its timestamp.
- **A proven-absence finding was NOT cached.** Parts and Reports filter bars were re-checked live
  rather than assumed still missing — they are still missing, but that is now an observation from
  today, not a memory from yesterday.

## Nothing claimed complete while a source is PARTIAL

The build is **PARTIAL** (not declared final), so this pass is reported as **complete for the build
that is serving now** and **provisional in durability** — never as final. The re-check queue is
`RECHECK-QUEUE.md`, status **OPEN**, 110 rows.
