# Printer Friendly Work Orders — SOURCE CURRENCY + SPEC-DIFF (read 2026-09-07)

| Source | Identifier | Version / last updated | Date checked | Verdict |
|---|---|---|---|---|
| Specification | Confluence **519176194** | last modified **2026-09-06**; **no in-body version field**; Change Log has NO entry after 2026-04-19 | 2026-09-07 | MOVED (page bumped past v9) but **near-non-substantive** — see diff. Owner field now filled. |
| Epic + stories | **SV-9383** (SV-9384–9389) | 6 stories, unchanged | 2026-09-07 | CURRENT |
| Design | none (TBD every story) | — | 2026-09-07 | none exists (PO-PFWO-2 stands). |
| Tech plan | none | — | 2026-09-07 | MISSING — reminded (Rule 30). |
| PO / Owner | **Milos Vasic / Branko Cicovic** (now named in the spec header; was TBD) | 2026-09-06 | 2026-09-07 | **RESOLVED — PO-PFWO-1 closed.** |

## Diff vs our held baseline (requirements.md v8 / cases build-verified 2026-09-01) — Rule 43
Re-derived rule-by-rule from the live body against requirements.md (45 rule IDs, S1–S6, all present).

| # | Rule | Change | Verdict → case |
|---|---|---|---|
| D1 | **S1-R5** | Status list narrowed **10 → 8** (dropped "Hold" and "Imported"); live lists Estimate, Approved, In Progress, Review, Complete, Invoiced, Paid, Declined. | **case already matched** — C45088 steps already list the 8; only its tester note still said "three out of ten" → **fixed to "eight"**, provenance re-stamped read 2026-09-07. Marker READY unchanged. |
| D2 | **S4-N1** | Added clause: "…and the line items area shows a single placeholder row reading 'No lines on this work order'." | **case updated** — C45116 expected gained the clause; provenance re-stamped. Marker HOLD unchanged (still the no-lines contradiction, HO-3). |
| — | S3-R3 | rationale sentence "…for mechanics doing the work, not for billing" | already in v9 baseline; non-substantive. No change. |
| — | S1-E1 | reworded (skeleton focus); disabled-until-load behaviour still in Key Decisions | materially unchanged. No change. |

**Everything else re-verified against the 2026-09-06 spec and byte-materially IDENTICAL** — no content
change. Following this project's own 2026-08-31 precedent (a non-substantive version bump is not
re-stamped across the whole suite to avoid disturbing the render container), the other 42 cases keep
their existing provenance; only the 2 genuinely-affected cases were re-stamped.

## Automated cases (Rule 71) — both map to UNCHANGED rules, so NOT edited
- **C45107** (S3-N1, atm=3) and **C45123** (S6-R1, atm=3). S3-N1 and S6 are unchanged in this diff, so
  neither needed a source-verify edit; Rule 71 did not bite. (Reported; not touched.)

**Sources read at pass start 2026-09-07; the spec was re-fetched once (single read this pass). No QA
build re-run — the suite is already build-verified (2026-09-01, v26.35.6-598cc8a); this pass is source
verification only.**
