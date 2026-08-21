# Ruthless Usefulness Audit — Invoice UI Refresh (Rule 28)

**Scored over 100% of the set: 87 of 87 cases, all three dimensions. 2026-08-21.** No C-IDs (nothing pushed).

## Dimension 1 — USEFUL (KEEP / MERGE / WEAK-KEEP / CUT)
- **KEEP: 85** — every case tests a distinct observable behaviour tied to a spec rule or a named assertion; a failure of any is a real, reportable document defect. Load-bearing coverage credited: calculation contracts (INV-PAID-05 Balance, INV-CRED-05 restocking math, INV-FSUM-05 visible-math identity), the portal/shop banner gate (INV-PAID-06/09), the render-time paid-date recompute (INV-EIS-04), and the credit-status Balance table (INV-CRED-06).
- **WEAK-KEEP: 2** — INV-VIS-04 (typography weights) and INV-VIS-09 (section-label px hierarchy) are fine-grained appearance checks that a shop might prefer as one dev checklist item; kept because Story 12 exists precisely to make them independently verifiable (SV-9151). Flagged in DELIBERATE-DECISIONS D5.
- **MERGE: 0** — negatives were already consolidated at authoring (e.g. INV-OREF-06 merges S3-N2/N3/N5; INV-MAST-07 merges S1-N1 fields; INV-FSUM-06 merges S7-N1/N2), so no post-hoc merge is needed.
- **CUT: 0** — no spec-parroting, framework-testing, or PO-descoped cases; the one out-of-scope area (batch/imported) is a single deliberate boundary NEGATIVE (INV-PART-08), not slop.

Slop patterns hunted and NOT found: per-column explosions (asset/order-ref fields grouped, not one-per-field), sort-direction explosions (n/a — no sortable tables), empty-state triplets (each negative is one consolidated case), tooltip present-vs-text splits (n/a), permission-cases-reducing-to-one-gate (n/a — access is a single sign-in precondition).

## Dimension 2 — MAKES SENSE (cold read: SENSIBLE / FIX-WORDING / NONSENSE)
- **SENSIBLE: 87 of 87** on cold read. Steps are executable in order once a build exists; every expected result follows from its steps; no case references a control absent from the spec/design; no domain-nonsense (the money math in INV-PAID-05, INV-CRED-05, INV-FSUM-05 is checked against the spec's own worked examples).
- **FIX-WORDING: 0 · NONSENSE: 0.**
- No unanchored absolute enumeration (Rule 42): every exact-list case pins its spec anchor and is scope-conditional where the spec is (e.g. INV-VIS-02 palette is a *closed set* because S12-R2 makes the closed list the requirement).

### Cross-case consistency sweep (mandatory)
- Title-vs-expected check on all 87: **0 mismatches**.
- Opposite-assertion keyword sweep (hidden/shown, full/half width, locked/editable, always/hide-when-empty): the apparent opposites are all **intentional, spec-stated distinctions**, each disclosed in the case itself —
  - two intentional 'Labor'/'Parts' summary rows (S7-R5) - INV-FSUM-04 states it explicitly
  - parentheses (discount, S5-R8) vs leading-minus (credit, S11-R4) - INV-WORK-06 & INV-CRED-04 each note the two conventions must not be unified
  - Terms always shows (S3-R2) vs other order-ref fields hide-when-empty (S3-N2/N3/N5) - by design, stated in INV-OREF-02/06
- Duplicate first-expected-line groups: **none**.
- **Unresolved contradictions: 0.** (The one spec-internal contradiction — Credit Balance S11-R6a vs Terminology §6 — is a SOURCE issue, resolved in favour of the specific rule and raised as PO-1; it is not a contradiction between our cases.)

## Dimension 3 — GENUINE + LAYMAN-RUNNABLE
- **87 of 87 traceable** to ticket + spec anchor (every `refs` carries SV-xxxx + S-rule; 0 orphan anchors).
- Tester-facing text is plain layman English: no rule IDs, no HTTP/endpoint terms, no internal jargon in preconditions/steps/expected; spec rule IDs live only in `refs` and the provenance line.
- Runnable by a non-technical tester **once a build exists** — every case carries the honest `Not available on Build to test Yet` marker (Rule 85); no case claims build-verification.

## Is the critic right? (both halves)
- **Waste %: 0%** genuinely useless; 2/87 (2.3%) WEAK-KEEP (fine-grained visual), disclosed. Nowhere near the '70% useless' claim.
- **Makes-no-sense %: 0%** — 0 NONSENSE on a 100% cold read.
- The audit RECOMMENDS only; no merge/cut/edit is executed in TestRail without authorisation (nothing is pushed).