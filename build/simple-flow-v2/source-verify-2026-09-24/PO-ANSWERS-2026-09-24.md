# Simple Flow V2 — PO answers (Milos, relayed by QA lead 2026-09-24)

Resolves the two conflicts raised in DESIGN-RECONCILE-v3-2026-09-24.md and APPRAISAL-2026-09-24.md.

## C44567 — Decline a line that holds received/picked parts — **CASE IS CORRECT (PO confirmed)**
- Verdict: the case (and the Confluence spec 771391574) win: **Decline stays disabled while the line
  holds received or picked parts** ("Return this line's received parts before declining it").
- The design v3 `Work Order PRD.md` §2 ("declining is always allowed, no return-the-parts-first guard")
  is therefore **wrong / superseded** on this point — a design bug, not a case change. No case edit.
- Design-vs-spec divergence #1 (decline-with-parts) is **CLOSED in favour of the case/spec.**

## C44604 — Reorder Undo — **CASE IS CORRECT (PO confirmed)**
- Verdict: the reorder **Undo WAS removed** (user request 2026-09-04); the case's Expected is right.
- The Confluence spec ("a drop can be undone") and the v3 design (drop "toasts with undo") are both
  **stale** on this point — the removal decision post-dates them and was not folded back into the spec.
- The case was previously HELD (Rule 58) pending this answer; it is now **PO-confirmed correct**, no
  longer a hold. No content change. (C44604 is an Automated case — any provenance touch to record this
  PO answer is a Rule-71/65 item for the QA lead/Vlad; the case body itself already states the removal.)
- Follow-up (not ours to make): the spec sentence should be corrected by Milos so the source stops
  contradicting the confirmed behaviour.
