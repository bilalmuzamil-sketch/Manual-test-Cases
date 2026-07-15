# Knowledge Base Change Log

Records every automatic update to the support bot's knowledge, triggered by a
change to the Confluence spec (page 565116952). Newest first.

---

## 2026-07-14 — Learnings mined from resolved defect tickets (Epic SV-7388)

Reviewed the DONE Bug tickets under Epic SV-7388 (page 1 = 100 tickets triaged
by summary) and read the behavior-defining ones in full. Most were internal
implementation fixes (blank pages, 403s, server/app errors, cosmetic) with no
lasting customer-facing rule. Encoded the behavior truths that matter for
support into new KB **§14** plus FAQ B9 and C17b, and corrected the Sales Rep
role:

- **SV-8061 (verified on staging):** Sales Rep is NOT "Reports only" — it has
  Work Orders: View, WO Lines: View, Customers: View + Create & Edit, Part
  Sales: View (Parts Dept ON), plus Reports/See Financial/See AP/AR/Full View.
  Fixed the §9 matrix (Parts Dept ON for Sales Rep) and role description.
- **SV-7942 (verified):** Tech View does not limit which WOs a user sees — techs
  see all WOs for the location; "My Work Orders" is an optional filter.
- Confirmations captured: SV-8018 (WO View can create notes), SV-8002 (Add
  Customer in New WO needs Customer C&E), SV-8050 (customer-only role sees
  WO/PS tabs as non-clickable references), SV-7973/8077/8079 (financial data
  stays hidden/non-editable when See Financial Data off), SV-7799/7801/7902
  (Send to Portal / Send to Terminal gating), SV-8020/8044/8045 (inspection
  reopen/delete needs WO Lines Delete), SV-7958 (Time Clock truly restricted),
  SV-7980 (My Timesheets for all who clock in/out).

**Coverage note (honest):** page-2 bugs (if any beyond the first 100) and the
Story-Defect subtasks under the epic's stories were not all read in full this
pass — the Atlassian connector was intermittently erroring. Behavior-defining
items found so far are encoded; remaining tickets can be mined in a follow-up
when the connector is stable (most are expected to be internal fixes).

**Files touched:** `knowledge-base.md`, `faq.md`, `launcher.html`.
**Support impact:** corrects a real migration-facing error (Sales Rep) and
answers common "why does a tech see all WOs / what is My Work Orders" tickets.
Re-upload BOTH `knowledge-base.md` and `faq.md` (or rely on the Confluence
connector if enabled).

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
