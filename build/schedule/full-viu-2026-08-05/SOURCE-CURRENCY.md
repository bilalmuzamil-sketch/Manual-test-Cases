# Schedule — SOURCE CURRENCY (Standing Rule 31), full live VIU pass 2026-08-05

Every source below was fetched LIVE at the start of this pass. Nothing here is
carried forward from a previous pass's record.

| Source | Identifier | Version / last-updated | Checked (UTC) | Verdict |
|---|---|---|---|---|
| Specification | Confluence page **713031682** "Schedule" | **Confluence version 23**, created 2026-07-30T10:40:32Z, edit message empty | 2026-08-05 19:55Z | **CURRENT** |
| Epic | **SV-8685** | **16 direct children**, verified two independent ways | 2026-08-05 19:57Z | **CURRENT** |
| Our own defect tickets | SV-8848…SV-8857 + SV-8886 | all **11 still Open**, resolution null, priority Low | 2026-08-05 19:57Z | **CURRENT** |
| Build | `https://sv8685.qa.shopview.com` | **`v3.5-d122eef`**, last-modified Wed 05 Aug 2026 15:35:43 GMT, etag `dd1c57e2fb4beba9758b62a29afdeaab` | 2026-08-05 19:51Z | **CURRENT — but NOT declared final (Rule 49)** |
| Designs | none | Schedule is a SPEC-ONLY project — the user confirmed 2026-07-21 there is no Figma | n/a | **N/A, stated** |
| Engineering tech plan | ingested 2026-07-29, `build/schedule/tech-plan-2026-07-29/` | unchanged | 2026-08-05 | **CURRENT** |
| PO answers | Branko, `build/schedule/branko-answers-2026-07-31/` | unchanged; the shop-closures question has **never been sent** | 2026-08-05 | **PARTIAL — see shortfall below** |

## Specification — proven current by CONTENT, not by version number

The Rule-31(a) trap is confirmed live again: the page BODY's own "Version" field
reads **1.0** while the real Confluence page version is **23**. The version
number in the document is worthless; the Confluence version is the truth.

Content proof, done independently of the earlier pass:

* The live storage body was fetched (58,584 characters), stripped to plain text
  (32,023 characters) and split into 269 sentences of more than 25 characters.
* Each sentence was normalised (lower-cased, all non-alphanumeric characters
  removed) and searched for in our mirror `build/schedule/requirements.md`,
  normalised the same way.
* **8 of 269 were not found.** Each was then checked by hand. **7 are boundary
  artefacts** — the sentence splitter had merged a heading into the following
  sentence, so the text IS in the mirror under different formatting. Each was
  confirmed present by direct search:

  | Phrase searched in the mirror | Hits |
  |---|---|
  | `drop it onto a technician` | 1 |
  | `configured working hours take precedence` | 1 |
  | `three lines of text` | 1 |
  | `apply immediately` | 1 |
  | `up to 15 technicians` | 1 |
  | `Technician availability and PTO` | 1 |
  | `Non-work-order time blocks` | 1 |

* The **8th** is the page's own header block ("Status Complete · Author Product
  Team · Last Updated July 15, 2026 · Version 1.0 · Stakeholders…"), which our
  mirror deliberately does not reproduce verbatim. It is metadata, not a
  requirement, and it is the source of the in-body "1.0" trap.

**Conclusion: 0 requirements present live and missing from our mirror.** The
spec is genuinely current at Confluence v23.

## Epic — verified two independent ways, sets equal

* `parent = SV-8685` → **16** issues, `isLast: true` (no paging remainder).
* `"Epic Link" = SV-8685` → **16** issues, `isLast: true`.
* **The two key sets are EQUAL in both directions** (0 in one and not the other).

The children are the 15 stories SV-8686…SV-8700 plus the Task SV-8812 ("Set up a
dedicated QA environment for testing", Done — this branch).

**The child count dropped from 26 to 16, and that is fully explained, not a
loss.** Ten of the 26 were our own defect tickets, which had been parented to the
epic. Another author (Mudassir Qamar) converted **nine** of them into `Story
Defect` subtasks under their owning stories, and **SV-8848 now has no parent at
all**. 26 − 10 = 16. Nothing was deleted.

**Three stories have moved status since the last check:** SV-8686, SV-8687 and
SV-8688 are now **TESTING QA** (they were Ready for QA). The other twelve stories
are still Ready for QA. A status move changes no requirement text, so no case
content is affected.

## Our ten defect tickets — read live, one by one

| Ticket | Type now | Parent now | Status | Resolution | Priority |
|---|---|---|---|---|---|
| SV-8848 | Bug | **NONE** | Open | null | Low |
| SV-8849 | Story Defect | SV-8692 | Open | null | Low |
| SV-8850 | Story Defect | SV-8693 | Open | null | Low |
| SV-8851 | Story Defect | SV-8700 | Open | null | Low |
| SV-8852 | Story Defect | SV-8697 | Open | null | Low |
| SV-8853 | Story Defect | SV-8700 | Open | null | Low |
| SV-8854 | Story Defect | SV-8687 | Open | null | Low |
| SV-8855 | Story Defect | SV-8691 | Open | null | Low |
| SV-8856 | Story Defect | SV-8694 | Open | null | Low |
| SV-8857 | Story Defect | SV-8687 | Open | null | Low |
| SV-8886 | Story Defect | SV-8689 | Open | null | Low |

**Not one is fixed.** No ticket closure therefore forces a verdict change on any
case. That is *not* the same as saying the defects still reproduce — a fault can
be fixed without the ticket being closed, so every one was still re-driven live
this pass (see `FINDINGS.md`).

## PARTIAL — the exact shortfall

**PO answers are PARTIAL for one reason only:** the specification states the
shop-closure behaviour **both ways** in two different places, no PO ruling
exists, and **the question has never been sent to Branko.** The blocker is us,
not him. Two cases are held on it — SCH-SPREAD-07 = C29983 and SCH-EDGE-05 =
C30089. Written up in `build/schedule/branko-questions-2026-08-05/`.

## The build is a source, and it is NOT final (Rule 49)

The `sv8685` branch has **not** been declared final. The marker moved **three
times today**: `v3.5-4873abe` → `v3.5-be42149` → `v3.5-d122eef`. Every verdict in
this pass is therefore **PROVISIONAL**, and `RECHECK-QUEUE.md` stays **OPEN**.
