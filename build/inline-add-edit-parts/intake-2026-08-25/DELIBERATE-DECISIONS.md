# Deliberate decisions & anticipated challenges — Inline Add and Edit Parts

Authority: PRD v13 is the content source of truth (Rule 57); design is appearance reference;
tech plan informs but never overrules (Rule 30). Latest authoritative source wins (Rule 32).

## Divergences raised to the PO (see questions-2026-08-25/)
- **D1 / PO-IAEP-1 — S3-E1 concurrency detection.** The tech plan (2026-08-18, decision D3) marks
  S3-E1 ("This part was changed by someone else…") **out of scope** for this epic, to be raised
  separately. PRD **v13 (2026-08-24) still specifies S3-E1** as a Story 3 edge case. We authored the
  case to the PRD (IAEP-TEDIT-12) and disclosed the divergence. **Ask Sasha:** is S3-E1 in scope for
  this epic, or deferred? If deferred, the case becomes EXPECT-FAIL/hold.
- **D2 / PO-IAEP-2 — "Imported" status guard.** PRD S1-N1/S1-N2 list **Imported** among the statuses
  that hide Add Part and the Edit control. The tech plan notes Imported is a separate record type, not
  a status, and plans **no such check**. We authored to the PRD (Imported hides — IAEP-BTN-06/07).
  **Ask Sasha/eng:** will the build actually hide on Imported, or is that guard not implemented?

## Decisions taken without a question (documented, reversible)
- **DD1 — Built from PRD text, not the canvas.** The tech plan's design punch list flags the canvas as
  partial/stale (Story 6 unshown, category display:none, "Part added — Requested" toast still shown,
  out-of-scope affordances). PRD v13 §8 states design coverage is now complete and the two copy-only
  messages are to be taken from the table. We take all wording/behaviour from the PRD.
- **DD2 — API-vs-UI layer (tech plan D7).** The tech plan keeps the edit API accepting edits on
  Complete/Invoiced work orders (billing a received part) while S1-N2 hides the inline Edit control on
  those statuses. Our cases assert the **UI** rule (control hidden). The API allowance is a different
  layer this epic's UI does not expose — not a contradiction; no case asserts the API path.
- **DD3 — Rule 85.** No QA env; every case carries "Not available on Build to test Yet". Verdicts are
  provisional until a build exists (Rules 49/60).
- **DD4 — One case per rule group.** Rules that always fire together (e.g. S1-R2+S1-R3) share a case;
  every rule ID still appears in coverage-matrix.md both directions (107/107).
