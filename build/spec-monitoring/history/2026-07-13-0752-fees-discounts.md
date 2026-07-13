# Spec change — Fees & Discounts V1 — detected 2026-07-13 07:52 UTC

**Page:** Fees & Discounts V1 (pageId 622297094)
**Baseline compared:** 2026-07-10 snapshot → live now.
**Page lastModified:** ~3 hours ago. **Change-log entry added:** `2026-07-12 @chris / @claude — Permissions pass`.
**Verdict:** CHANGED — substantive (permissions model + new jurisdiction note).

> Encoding-only diff lines (the "⋯" / "↳" glyphs re-encoded) are NOT changes and are excluded below.

## 1. NEW — §5-R15 taxable jurisdiction note  (NEWLY ADDED)
- **AFTER:** New §5-R15: below every Taxable control — the Add/Edit fee-or-discount dialog (S2-R26) and the Processing Fee dialog (S8-R11) — this exact text shows: *"Tax treatment varies by jurisdiction — confirm your local requirements before saving."* Plain advisory, not a UI instruction, not a legal-compliance statement.
- **AFTER:** New **S2-R26a** — "The Taxable jurisdiction note (§5-R15) shows below the Taxable dropdown."
- **S8:** the old context note ("disclosure ... legal sign-off ... the word 'toggle' ...") was **REMOVED** and replaced by new **S8-R13** — "The Taxable jurisdiction note (§5-R15) shows below the Taxable setting."
- **Impact:** no existing case covers this note → **2 new cases needed** (Add/Edit dialog; Processing Fee dialog).

## 2. MODIFIED — history-log viewing permission (S10 / S13-R10)
- **BEFORE:** "Seeing fee and discount entries in the work-order history log requires **View History Logs**."
- **AFTER:** "Viewing a work order's history log ... requires **Work Orders: Create and Edit**. Viewing an individual labor-line or part-line history requires **Work Order Lines: Create and Edit**." (View History Logs no longer gates it.)
- **Impact (from → to = View History Logs → WO/WO-Lines Create&Edit):**
  - **FD-PERM-009 (C28593)** — "seeing fee/discount entries in the WO history log requires View History Logs" → rewrite to WO: C&E (WO log) / WO Lines: C&E (line history).
  - **FD-HIST-006 (C28565)** — "history entries are gated by the View History Logs permission" → same rewrite.
  - Sanity-check FD-HIST-004 (C28563) / FD-HIST-005 (C28564) / FD-FLAG-002 (C28597) wording (they mention the flag/See-Financial-Data gating, not View History Logs — likely unaffected).

## 3. MODIFIED — Part Sale adjustment permission (S11 / S13-R5)
- **BEFORE:** S11 prereq "the user has the Work Order change permission"; S13-R5 "Adding, editing, or removing a part adjustment on a Part Sale requires Part Sales: Create and Edit."
- **AFTER:** S11 prereq now "**Part Sales: Create and Edit** and **See Financial Data**"; S13-R5 expanded — "on the whole sale **or on a part line** ... requires **Part Sales: Create and Edit** (plus **See Financial Data**). Part-sale adjustments do not use any Work Order permission."
- **Impact:** **FD-PERM-004 (C28588)** — confirm it already asserts Part Sales: C&E + See Financial Data and covers the whole-sale scope (add See Financial Data if missing).

## 4. MODIFIED — euphemism → exact Custom-Roles (SV-7388) permission names inline; S13-R11 table removed
- **BEFORE:** Stories 1/3/4/9 prereqs used phrases like "Work Order change permission", "Work Order pricing-view permission", "customer change permission"; S13-R11 held a phrase→permission translation table.
- **AFTER:** each phrase replaced inline by its exact name — Work Orders: Create and Edit; Work Order Lines: Create and Edit; See Financial Data (added as an explicit prereq to S1, S3, S4); Customer Management: Create and Edit + Manage Accounts Payable and Receivable (S9-R13). **S13-R11 translation table deleted.** S13-R2/R8/R9 trailing "this is the ... named in Story N" sentences removed.
- **Impact:** mostly confirmatory — the **FD-PERM** cases (C28585–C28595) already use the concrete names, so they stay valid; verify none still rely on the old euphemisms. Story-level prereq wording is not test-bearing on its own.

## Affected cases summary (TestRail C-ids)
- Rewrite: **FD-PERM-009 (C28593)**, **FD-HIST-006 (C28565)** — history-log permission.
- Verify/adjust: **FD-PERM-004 (C28588)** — part-sale add See Financial Data + whole-sale scope.
- New: 2 cases for the §5-R15 jurisdiction note (Add/Edit dialog + Processing Fee dialog).
- Confirm-only: FD-PERM-001..011 wording still matches exact names.
