# Knowledge Base Change Log

Records every automatic update to the support bot's knowledge, triggered by a
change to the Confluence spec (page 565116952). Newest first.

---

## 2026-07-14 — spec clarifications (labels + invoice reversal)

Confluence spec edited 2026-07-13. Changes were clarifications, not new
behavior:

1. **"View History Logs" is now officially labeled "View Part History"** and is
   no longer listed among the Cross-Cutting Toggles in the role editor (it sits
   under Part Sales). The knowledge base already used the new label — no
   customer-facing answer changes.
2. **Invoice reversal split made explicit:** reversing a *work order* invoice
   requires Work Orders: Delete; reversing a *part sale* invoice requires Part
   Sales: Delete. Tightened the Work Orders: Delete description in
   `knowledge-base.md` so it no longer implies WO Delete also reverses part-sale
   invoices. FAQ answer C12 was already correct.

**Files touched:** `knowledge-base.md`. `faq.md` unchanged (already accurate).
**Support impact:** negligible — wording precision only. No re-training needed;
re-upload `knowledge-base.md` to the claude.ai Project at your convenience.
