# Defects filed 11 Nov 2026 — every failed regression case has a Story Defect

QA lead, 11 Nov 2026: "Everything that failed should have a story defect. Learn how to create a story defect from the
session that is testing the test cases from testrail. And also every failed test case should have the ticket in the
test case run comment."

| Ticket | Parent story | What | Failed cases (run 557, status Failed, ticket in the result's Defects field and comment) |
|---|---|---|---|
| [SV-12544](https://shopview.atlassian.net/browse/SV-12544) | SV-11533 Story 3 | A/R Aging Detail PDF prints dates as "Apr 6, 2026" instead of PRD S3-R7a "Apr 06 2026" (comment: A/R Collection PDF too; first observation 12:10Z) | V1R-80 [C1095436](https://shopview.testrail.io/index.php?/cases/view/1095436) |
| [SV-12545](https://shopview.atlassian.net/browse/SV-12545) | SV-11535 Story 5 | An as-of date after today can no longer be picked or opened from a saved link | V1R-07 [C1078980](https://shopview.testrail.io/index.php?/cases/view/1078980), V1R-08 [C1078981](https://shopview.testrail.io/index.php?/cases/view/1078981) |
| [SV-12546](https://shopview.atlassian.net/browse/SV-12546) | SV-11533 Story 3 | A/R Aging Detail PDF leaves out empty buckets and their $0.00 total lines | V1R-35 [C1079008](https://shopview.testrail.io/index.php?/cases/view/1079008) |
| [SV-12547](https://shopview.atlassian.net/browse/SV-12547) | SV-11533 Story 3 | A/R PDFs print "Subtotal" instead of "Total for <customer or bucket>" | V1R-36 [C1079009](https://shopview.testrail.io/index.php?/cases/view/1079009) |

All four: issue type Story Defect, priority Medium, label QA_Found, "relates to" link to the parent story, images inline
next to the steps, reproduced twice on the unchanged QA build (v26.45.2-6a8b89c; 12:55/12:56Z for SV-12544,
13:04/13:05Z for the others; `evidence/rerun-2026-11-11/run1.json`, `run2.json`) and, for the three losses, observed on
production (v26.45.3-f5ba431). No existing ticket found for any of them (searched incl. closed). SV-12545/46/47 name the
open PO question (sheet rows 19/20/21) — Chris Ward may decide the change is intended, in which case the ticket closes.

## The ticket format learned from the run-557 testing session (facts, from SV-12540 and SV-12539)
- Title "Aging Reports – <Title Case summary>"; issue type Story Defect parented to the owning story; Medium; label `QA_Found`;
  a "relates to" link to the owning story.
- Description sections: **Description** (What the PRD requires, quoted / What happens instead) · **Steps to Reproduce**
  (named data, images inline after the step they show) · **Actual Result** · **Expected Result** · **Environment**
  (site, build marker, location, role, times) · **Sources** (PRD version + requirement) · **Test case** (C-id links).
- "Product Area" is not on the Story Defect create screen (Jira rejects it).
- Differs from our playbook's 7-section format (which forbids test-case links in the ticket) — proposed to the QA lead
  for recording (Rule 72), not yet recorded as a rule.
