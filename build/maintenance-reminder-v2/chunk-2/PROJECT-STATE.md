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

## STATUS 2026-10-02: subfolders created (26636-26644); authoring pending.
