# Knowledge Base Change Log

Records every automatic update to the support bot's knowledge, triggered by a
change to the Confluence spec (page 565116952). Newest first.

---

## 2026-07-14 — Notes permission rules added (from SV-8003, Sasha Grosman)

Added the full Notes permission model, requested by the user and sourced from
Jira SV-8003 (Sasha's Jul 8 clarification, "spec updated accordingly"; the
authoritative last-word version, confirmed by Viktoria's Jul 13 test comment).

**New KB section §3k "Notes across the app"** plus updates to §3d (Customers)
and the §12 quick table, and FAQ C18–C20:

- Notes are NOT their own permission; each surface follows a governing area's
  CRUD. WO notes → Work Orders; **Customer notes AND Asset notes → Customer**
  (Asset has no separate permission).
- **Notes tab:** View = create + edit anyone's + delete own; Delete = also
  delete other people's. Edit/Delete/Attach on others' notes are HIDDEN (not a
  403) for roles without Delete; everyone can always manage their own notes.
- **Notes field** (Edit Customer/Asset/WO modal) follows normal field CRUD:
  View to see, Create&Edit to change.
- **Notifications** = everyone (no gate); **Reports > Notes** = Reports toggle.
- Recorded the known Customer/Asset enforcement gap (others'-notes edit/delete
  may still 403) as an escalate-if-hit item.

**Files touched:** `knowledge-base.md`, `faq.md`, `launcher.html`.
**Support impact:** meaningful — Notes tickets ("why can't this user edit that
note / why did the option vanish") are now answerable. Re-upload BOTH
`knowledge-base.md` and `faq.md` to the claude.ai Project (or, if the Confluence
connector is enabled, the bot already reads the updated spec live).

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
