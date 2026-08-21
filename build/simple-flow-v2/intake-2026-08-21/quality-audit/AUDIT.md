# Ruthless Usefulness Audit — Simple Flow V2 (Rule 28)

**Scored over 100% of the set: 61 of 61 cases, all three dimensions. 2026-08-21.** No C-IDs (nothing pushed).

## Dimension 1 — USEFUL
- **KEEP: 61** — every case tests a distinct observable behaviour tied to a story/AC; a failure is a real workflow defect. Load-bearing coverage credited: the settings sweep + audit (SFV2-SET-06/07), the parts-never-block-completion matrix (SFV2-COMP-01), bulk partial-success + declined-not-swept (SFV2-BULK-05/06), the receive required-fields + deadlock-avoidance (SFV2-RCV-02/05), one-invoice-two-bills (SFV2-RCV-04), the finish-action state table (SFV2-FIN-01), and the permission map application (SFV2-PERM-01..04).
- **MERGE: 0** — negatives were consolidated at authoring (e.g. SFV2-BULK-04 folds several bar negatives; SFV2-RCV-06 folds the receive negatives; SFV2-PERM-04 folds the atom negatives).
- **WEAK-KEEP: 0 · CUT: 0** — no spec-parroting or framework tests. The one out-of-scope area (bulk delete) is a single deliberate boundary negative (SFV2-BULK-08), not slop.
- Slop patterns hunted and NOT found: per-column explosions, sort-direction explosions, empty-state triplets, permission-cases-reducing-to-one-gate (permissions are genuinely per-atom per SV-8183, not a single gate).

## Dimension 2 — MAKES SENSE (cold read)
- **SENSIBLE: 61 of 61.** Steps execute in order once a build exists; every expected result follows; no case references a control absent from the spec/design; no domain nonsense.
- **FIX-WORDING: 0 · NONSENSE: 0.**
### Cross-case consistency sweep
- Title-vs-expected on all 61: **0 mismatches**. Duplicate first-expected-line groups: **none**.
- Opposite-assertion sweep — the apparent opposites are intentional, spec-stated distinctions, each disclosed in the case:
  - A declined line CAN be approved from its own menu (SFV2-ACT-01) but is NEVER swept by a bulk action (SFV2-BULK-05) — spec-stated, not a contradiction.
  - 'Requested' part is COUNTED in Order(n) yet has NO row button (SFV2-ACT-03 / SFV2-BULK-01) — deliberate asymmetry, spec says do not 'fix' it.
  - Money fields are 'required' yet 'removed' for a user without See Financial Data (SFV2-RCV-05 / SFV2-PERM-03) — the prefilled-value rule that avoids the deadlock, spec-stated.
  - Turning a setting ON vs OFF has asymmetric effects (SFV2-SET-05/06) — spec-stated (receiving ON creates work; approval OFF is highest-consequence).
- **Unresolved contradictions: 0.**

## Dimension 3 — GENUINE + LAYMAN-RUNNABLE
- **61 of 61 traceable** to a story (+ SV-8183 where relevant); 0 orphan anchors; every case carries a `permissions_required` line from the SV-8183 map.
- Tester-facing text is plain layman English; atom names appear only in the permissions line and refs, not in steps a tester follows.
- Runnable once a build exists; every case carries the honest Rule-85 deferred marker.

## Is the critic right? (both halves)
- **Waste %: 0%** genuinely useless; 0 WEAK-KEEP. Nowhere near '70% useless'.
- **Makes-no-sense %: 0%** on a 100% cold read.
- The audit RECOMMENDS only; nothing is pushed.