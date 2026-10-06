# Maintenance Reminder — CHUNK 2 — PROJECT-STATE (cold-resume)

**Started:** 2026-10-02. **PO:** Milos Vasic. **Same feature as Chunk 1** (Maintenance Reminders,
epic SV-3780), split into two chunks by size. **Keep the two chunks' cases SEPARATE, always** (QA lead).

## TestRail
- Chunk 1 suite: group **19397** "Maintenance Reminder (Chunk 1 - September 2026)" — 81 cases, S1-S9/S13/S14/S21 + numeric. DO NOT touch.
- Chunk 2 root: group **26635** "Maintenance Reminder (Chunk 2 - September 2026)", a subfolder UNDER 19397.
- Chunk 2 subfolders created 2026-10-02 (map: `../chunk2-sectionmap.json`):
  | Story | Section | Jira |
  |---|---|---|
  | S10 Enter a reading | 26636 | SV-10567 |
  | S11 Rate, estimate and confidence | 26637 | SV-10568 |
  | S12 Due date resolution | 26638 | SV-10569 |
  | S16 Maintenance panel on a work order | 26639 | SV-10572 |
  | S17 Add a service to a work order | 26640 | SV-10573 |
  | S18 Complete a service and reset the cycle | 26641 | SV-10574 |
  | S19 Customer reminder email (sent by hand) | 26642 | SV-10575 |
  | S22 Origin reporting | 26643 | SV-10577 |
  | Numeric and date accuracy (Rule 116) | 26644 | — |

## Sources (Rule 57) — currency confirmed 2026-10-02
- **PRD — Confluence 897679389 "Chunk 2 MR"**, owner Milos Vasic, **last modified 2026-10-02 (finalised:
  "handed to engineering… design and this page checked against each other on 2 October 2026")**. This is
  THE authoritative source. (Earlier in the day it was a "placeholder/draft"; now final.)
- **Design** — `Chunk-2-design.dc.html` (Claude design "Chunk 2", MR V2 project 4411588b…), saved here.
  Rule 115: drive it end-to-end for each visual story.
- **Epic SV-3780**; all 8 Chunk-2 stories Open (not built).

## Key spec facts carried from the 2026-10-02 PRD
- **S19 is now MANUAL in v1** — "Customer reminder email, sent by hand" via the contact card Send reminder
  (one asset at a time). AUTOMATIC sending is DEFERRED TO V2 (decided 2026-10-02); the old auto rules are
  parked at the end of S19 for v2. (This REVERSES the earlier draft, where S19 was automatic.)
- **S11 confidence TABLE locked 2026-10-01** (age-of-last-reading × usable-pairs → Low/Med/High/No data);
  rate = sum of last 3 usable pairs ÷ days they span (S11-R2). Heavy Rule-116 numeric cases.
- **S16 cross-location copy** (R21-R25): Add Service at a non-home location copies the same work at this
  location's rates, parts not copied, internal line note explains.
- **S18 "Mark complete resets now"** (resets at once from a chosen date; lines-added path resets on invoice).

## 🔴 Overlap to resolve (earlier this session)
Gap-fill QA-Additions MR cases authored 2026-10-01 in section 25600 (C195859-C195875 for S10/S16/S17/S18/
S22) and the deferred auto-email cases (C195880-C195892, section 25610) were authored from the DRAFT and
from the AUTO-email assumption. They are now **superseded/partly stale** by this finalised Chunk-2 suite
(esp. S19 auto→manual). Decision pending with QA lead: retire those, or leave them.

## Method
Per story: author from the finalised PRD anchors (verbatim quotes, Rule 113), runnable by a manual tester
(Rule 114), Rule-117 shape (concise title, seeded values as examples, build glossary, runnable
observations). Drive the Chunk-2 design (Rule 115). Rule-116 numeric cases in 26644. No QA build yet ⇒
AUTOMATION: HOLD (source-verified only). Render-repair (fr-view) each. Keep separate from Chunk 1.

## STATUS 2026-10-02: ALL 8 STORIES + NUMERIC AUTHORED — 86 cases (C204102-C204187)
Live count per section: S10 (26636) 9 · S11 (26637) 12 · S12 (26638) 8 · S16 (26639) 16 · S17 (26640) 6 ·
S18 (26641) 13 · S19 (26642) 9 · S22 (26643) 5 · Numeric & date accuracy (26644) 8 = **86**, all
created_by=3, 0 format defects, all AUTOMATION: HOLD (no MR build), rendered fr-view.
Builder: `mr2_lib.py` (idempotent); authors `author_batch1..5.py`; log `created-chunk2.json`.
S19 authored as the v1 MANUAL send (automatic deferred to v2, not authored). Chunk 1 untouched.

**Retired (Option A, user-authorised 2026-10-02):** the superseded gap-fill MR cases C195859-C195875 and
the auto-email cases C195880-C195892 (30 total) were deleted, with their empty sections (25600 subtree,
25610). The DI gap-fill (25601), Fixed Rules (25609) and QBO (25611) folders remain.

**Outstanding:** build verification when an MR QA build exists (all HOLD); a test run for Chunk 2 if the
QA lead wants one.

## 2026-10-06 — technical plans received; every page in the Confluence tree is a source (QA lead)
- **Technical plans now PROVIDED** (supersedes "NOT PROVIDED"): Plan 1 "Track, act, clear" (covers Chunk 1 and the
  S10/S11/S12 + S16/S17/S18/S22 Plan-1 subset) and Plan 2 "The work order and the customer" (Chunk 2), saved in
  `sources/tech-plan/`. Read for tester-visible behaviour; they inform, never overrule the specification.
- **QA lead instruction:** every page under the Confluence heading "Maintenance Reminders V1" (833290250) is a source,
  now and as pages are added in future. Tree on 2026-10-06: 833290250 (main: key decisions, reusable components, open
  questions, change log) · 841678852 Review Decisions + 844431363 Run log · 886931488 Chunk 1 MR · 892305428 Review
  Decisions — Chunk one + 891519016 Run log · 891944985 Review Decisions — Chunk three + 891977734 Run log ·
  897679389 Chunk 2 MR. **Chunk 2 MR holds the specification for both chunks** (QA lead). Always list the tree's
  descendants (`getConfluencePageDescendants 833290250`) at every source check, so a new page is never missed.
- New design: `MR_V2_2.zip` → `sources/design-MR_V2_2-2026-10-06/` (Chunk 1 and Chunk 2 boards changed; new boards
  "Canned lines per location - proposal" and "Maintenance Reminders Demo").
- Review in progress: `source-update-2026-10-06/`.
