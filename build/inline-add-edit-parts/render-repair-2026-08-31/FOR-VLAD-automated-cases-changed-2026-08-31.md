# FOR VLAD — Automated cases changed on 2026-08-31 (Rule 65)

**Project:** Inline Add and Edit Parts on Work Order Lines (group 6597, epic SV-9315)
**Change type:** render-container repair (UI save → `markdown fr-view`) + provenance re-stamp v13→v16
**Authorised by:** QA lead, explicit go-ahead 2026-08-31 (UI-repair-to-fr-view; Rule-71 skip lifted for
these two cases only). No other Automated case was touched.

## Why these two are flagged here
Both are TestRail-flagged **Automated** (`custom_atmstatus = 3`), authored/flagged by **Vladimir
Tomovic**. Rule 65 requires telling Vlad whenever a pass writes to an Automated case. Rule 71 normally
holds such cases; that hold was lifted by the QA lead for exactly these two.

## The two cases — what actually happened this session
| Internal ID | C-ID | Link | Rule | Change made this session |
|---|---|---|---|---|
| IAEP-TEDIT-04 | C45026 | https://shopview.testrail.io/index.php?/cases/view/45026 | S3-R5 | **CHANGED** — container was escaping (`markdown`, tester read literal `<ol><li>`); UI-repaired to `markdown fr-view`, content re-stamped **v13 → v16** ("read on 31 August 2026") |
| IAEP-TADD-08 | C45005 | https://shopview.testrail.io/index.php?/cases/view/45005 | S2-R9 | **NO CHANGE** — verified live already `markdown fr-view` with v16 provenance and the marker last; nothing was written to it |

## What changed on C45026 (the only one written)
| Field | Before | After |
|---|---|---|
| Render container (served view page) | `markdown` (block HTML **escaped** — tester read literal `<ol><li>`) | `markdown fr-view` (renders cleanly) |
| Provenance version cited | spec **v13** (skipped in the 2026-08-31 v13→v16 write pass under the old Rule-71 hold) | spec **v16**, "read on 31 August 2026" |
| Behaviour / expected results | — | **UNCHANGED** — S3-R5 was not amended in v16 |
| `custom_atmstatus` (Automated flag) | 3 | **3 (unchanged)** — verified before/after |
| Title | — | unchanged |
| AUTOMATION marker (in-body literal) | last line | last line, unchanged text |

The repair set the identical human-readable content through the TestRail web editor (numbered
steps/preconditions, expected results + source block), so the only substantive change is the version
string in the provenance line; everything the automation would assert is identical.

## Note (separate, not changed)
The **foreign** Automated case **C45220** "Adding a part to a completed line reopens the line"
(also Vladimir Tomovic) was **NOT touched** (Rule 38 hands-off). It was not part of this repair.

Evidence: `build/inline-add-edit-parts/render-repair-2026-08-31/REPAIRED.jsonl` (per-case before/after
container + atmstatus).
