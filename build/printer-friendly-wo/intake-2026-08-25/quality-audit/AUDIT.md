# Ruthless Usefulness Audit — Printer Friendly Work Orders (44 cases)
- **KEEP: 44/44.** Each traces to a distinct PRD rule ID (or S3-R8+S3-N3, the identical omit-empty-
  tech-story rule, sensibly combined). Each independently executable once a build exists.
- **CUT: 0.** No within-section duplicates (generator: NONE).
- **NONSENSE: 0.** All expectations from the PRD; none build-derived.
- **WEAK-KEEP: appearance-only rules** (S3-R7, S5-R3, S5-R4) depend on a design that does not exist —
  kept, tested against PRD wording, flagged for reconciliation if a design arrives (PO-PFWO-2).
- **Contradictions:** 0 (no competing sources). Gaps: PO unknown, design absent — both raised.
- **Provenance & marker:** exactly one provenance line + one AUTOMATION marker per case; 0 id leaks;
  0 VIU words; 0 shredded cells (generator-verified).
