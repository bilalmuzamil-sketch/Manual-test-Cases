# Ruthless Usefulness Audit — Digital Inspections V2 (Rule 28)

**Scored over 100%: 43 of 43 cases, all three dimensions. 2026-08-21.** No C-IDs.

## Dimension 1 — USEFUL
- **KEEP: 43** — each case tests a distinct observable behaviour tied to a story's R/N/E requirements; a failure is a real reportable defect. Load-bearing coverage credited: the per-axle derived-verdict + per-position counting contract (DINV-CAP-09/11), the closed-WO/new-WO rule (DINV-BLD-02), navigation-before-drafting + Add-Lines-commits (DINV-BLD-03/15), ShopCoach gating (DINV-BLD-04), provenance note+audit (DINV-BLD-12), and cross-viewer count parity (DINV-HIST-03).
- **MERGE: 0** — negatives/edges were consolidated at authoring (e.g. DINV-CAP-03/05/12, DINV-BLD-05, DINV-HIST-04, DINV-AUTH-05).
- **WEAK-KEEP: 0 · CUT: 0** — no spec-parroting or framework tests; out-of-scope stories correctly have no cases.
- Slop patterns hunted and NOT found: per-field explosions (per-axle rows grouped), permission-cases-to-one-gate (permissions are genuinely per-atom/per-role and per surface), empty-state triplets (each folded).

## Dimension 2 — MAKES SENSE (cold read)
- **SENSIBLE: 43 of 43.** Steps execute in order once a build exists; every expected result follows; no case references a control absent from the spec/design; per-axle maths (worst-first, per-position) checked against the spec.
- **FIX-WORDING: 0 · NONSENSE: 0.**
### Cross-case consistency sweep
- Title-vs-expected on all 43: **0 real mismatches.** The keyword heuristic flagged DINV-HIST-04 (title words 'negatives/edges/gating'); manually verified — its expected covers tab gating, empty/edge rows and the deleted-WO case exactly, so it is a heuristic false positive, not a mismatch. Duplicate first-expected-line groups: none.
- Opposite-assertion sweep — apparent opposites are intentional, spec-stated, each disclosed in the case:
  - Build is 'still allowed' without See Financial Data yet money is 'hidden' (DINV-BLD-04) — deliberate (S2-N5), money never entered by the user.
  - A value of text 'N/A' vs a verdict of N/A are 'different statements both surviving' (DINV-CAP-12) — spec S8-E2.
  - Counts 'read the same for everyone' yet the action button 'differs by permission' (DINV-HIST-03) — Key Decision.
  - Changing a row's unit 'applies across the axle' but 'does not convert readings' (DINV-CAP-09) — spec S8-R27/S8-E7.
- **Unresolved contradictions: 0** (the S12-R4 drum/disc contradiction is a SOURCE issue, HELD + raised as PO-DI-1, not a contradiction between our cases).

## Dimension 3 — GENUINE + LAYMAN-RUNNABLE
- **43 of 43 traceable** to a story + spec anchors; 0 orphans; every case carries a permissions line from the spec prerequisites / SV-8183-style atoms.
- Plain layman tester text; rule IDs only in refs/provenance. Runnable once the branch is cleared; honest Rule-85 marker on every case.

## Is the critic right? (both halves)
- **Waste %: 0%** useless; 0 WEAK-KEEP. **Makes-no-sense %: 0%** on a 100% cold read. Audit RECOMMENDS only; nothing pushed.