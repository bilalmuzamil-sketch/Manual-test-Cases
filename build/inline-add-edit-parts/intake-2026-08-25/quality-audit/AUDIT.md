# Ruthless Usefulness Audit — Inline Add and Edit Parts (96 cases)

Three dimensions (Rule 28): KEEP / CUT / NONSENSE; contradictions resolved.

- **KEEP: 96/96.** Each case traces to a distinct PRD rule ID or a rule group that fires together,
  and each is independently executable by a manual tester once a build exists.
- **CUT: 0.** No duplicates within a section (generator check: NONE). Rules that overlap by reference
  (e.g. S3-R4 → Story 2 behaviour) are authored once in the owning story and cross-referenced, not
  duplicated as full cases.
- **NONSENSE: 0.** No case asserts build-derived behaviour; all expectations are from documents.
- **WEAK-KEEP: 2** — IAEP-TEDIT-12 (S3-E1) and IAEP-BTN-06/07 "Imported" leg: both depend on open PO
  questions; kept but flagged, will firm up on Sasha's answers.
- **Contradictions:** 2 doc-level divergences (tech plan vs PRD) — disclosed, not silently resolved
  (DELIBERATE-DECISIONS D1/D2). 0 unresolved.
- **Provenance & marker:** generator confirms exactly one provenance line + one AUTOMATION marker per
  case; 0 internal-id leaks; 0 VIU words; 0 shredded cells.
