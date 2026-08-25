# Deliberate decisions — Printer Friendly Work Orders
Authority: PRD v8 is the content source of truth (Rule 57). No design/tech plan exists.

## Raised to the PO (questions-2026-08-25/)
- **PO-PFWO-1 — Owner/PO is TBD.** The PRD Owner field reads "TBD". We need the accountable PO so
  questions and sign-off have an owner. (Spec author: Sasha Grosman; requirements from Fabian.)
- **PO-PFWO-2 — No design exists (Design: TBD on every story).** Layout/appearance rules (e.g. "thick
  border + note space" S3-R7, "2-column header grid", plain-text badges S5-R5) are authored from the
  PRD text alone. Confirm whether a design will be produced (which we would then reconcile against) or
  the PRD text is the sole authority for appearance.

## Decisions taken (documented, reversible)
- **DD1 — Appearance from PRD text.** With no design, appearance-oriented rules are tested against the
  PRD's own wording; a later design triggers a reconciliation pass (Rule 41).
- **DD2 — Pricing-exclusion is asserted on both line items and summary** (S3-R3, S4-R2) and as a
  standing negative across the printout — a headline, non-negotiable rule (Fabian).
- **DD3 — Rule 85.** No QA env; every case "Not available on Build to test Yet". Verdicts provisional.
- **DD4 — Print-then-cancel still audits (S6-N1)** is authored as spec-written even though it is
  counter-intuitive; the PRD states the browser cannot report completion.
