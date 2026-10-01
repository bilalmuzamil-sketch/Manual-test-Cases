# Gap-fill — new cases authored for verified coverage gaps (2026-10-01)

Authored in SEPARATE QA-Additions folders (QA lead instruction), never mixed into the existing
suites. All Rule-117 (concise title ≤80, discrete-list preconditions with seeded values shown as
examples, build-glossary steps, runnable Expected observations + verbatim source quotes), every case
`AUTOMATION: HOLD` (stories are Open / no QA build). Every case verified live (format audit) and
render-repaired by the parent session before this was written.

## Maintenance Reminder — QA Additions (section 25600) — 17 cases
| Story | Section | Cases |
|---|---|---|
| SV-10567 Enter a reading — plausibility | 25602 | C195859–C195860 |
| SV-10572 Maintenance panel on a work order (GAP) | 25603 | C195861–C195864 |
| SV-10573 Add a service to an existing work order | 25604 | C195865–C195867 |
| SV-10574 Complete a service & reset its cycle | 25605 | C195868–C195871 |
| SV-10577 Work order origin reporting (GAP) | 25606 | C195872–C195875 |

## Digital Inspection V2 — QA Additions (section 25601) — 10 cases
| Story | Section | Cases |
|---|---|---|
| SV-8347 Delete/reopen an incomplete inspection | 25607 | C195849–C195852 |
| SV-9882 Convert reference files (render in place) | 25608 | C195853–C195858 |

**Total: 27 new cases** (C195849–C195875). Format audit: 27/27 discrete-list preconds, titles ≤80,
verbatim quotes + HOLD marker present, created_by=3.

## 🔴 Provenance flags to raise with the QA lead
1. **MR quotes come from a "placeholder" spec page.** The detailed MR requirement text for S10/S16/S17/
   S18/S22 is NOT in the Chunk-1 capture (886931488) — it lives in **Confluence 897679389 "Chunk 2 MR"**
   (lastModified 29 Sep 2026), which the page itself describes as a placeholder "copied as they stand…
   not yet reviewed for handoff; will be reworked into the Chunk 1 format." The quotes are the spec's
   own words (satisfies Rule 113), but **when Chunk 2 is reworked into the handoff format, these quotes
   must be re-checked** (Rules 31/32/59). Cases cite "Confluence 897679389 (Chunk 2 MR), read 1 Oct 2026."
2. **Non-UI aspects marked HOLD (DI SV-9882):** "download returns the byte-identical original" is not
   hand-verifiable — authored as the UI-observable proxy (downloaded file type/extension vs the
   converted view); true byte-identity needs automation. "Conversion happens on upload, not on view"
   (backend timing) was NOT authored as a case (not manually provable) — flagged, not invented.

## Not authored (recorded, by design)
- Deferred/future: MR SV-10575 (auto reminder email — spec defers this release); FM SV-10403 (ships
  later → then rewrite C154744).
- Out-of-scope separate features: FM SV-10398 (QBO per-fee mapping), FM SV-9729 (Inspection Reports in
  Portal).
- Copy/UX-only (conditions already covered): DI SV-9885, SV-9887.
- Bugs/defects (FM 8, DI 12, WO 1): a separate "add regression cases?" decision, not story coverage.
