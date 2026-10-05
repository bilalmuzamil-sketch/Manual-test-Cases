# PROJECT-STATE — Founder Mode → Part Sales
## Identity
- TestRail group **20435 "Part Sales"** under 20434 "Founder Mode (September 2026)", suite 1. **57 cases, all
  created_by=3, 0 foreign, 0 automated.** 8 sections: S1 core return(20440) · S3 tax rate(20441) · S4 audit
  log/menu(20442) · S5 sales rep(20443) · S6 actions column(20444) · S7 labels/tab bar(20445) · S8 deposit(20446)
  · DATA accuracy(20447). Link: https://shopview.testrail.io/index.php?/suites/view/1&group_id=20435
- Build-verify env: QA branch **sv9667.qa.shopview.com** · API sv9667api.qa.shopview.com · build **v26.39.2-210868d**.
  Access: 3 cookies → /tmp/cln/sv9667-cookies.json (ephemeral). Routes/glossary: NAVIGATION-MAP.md + OBSERVED-UI-LABELS-sv9667.md.

## Status — 2026-10-01 · BUILD-VERIFICATION COMPLETE
- Observed on build: Part Sales list (/parts/part-sales) · part sale document (/parts/part-sale/<uuid>: tabs
  Parts/Stats/Finance, Sales Representative, Add Deposit/Create Invoice, Estimate/Invoice toggle, Financial Info/
  tax line) · Parts tab (Description/Qty/Price/Core, Order/Return, more_vert) · roles editor ("Part sales" /
  "Invoicing & payments" groups).
- All 57: role perms aligned to build casing ("Part sales"/"Invoicing & payments"), stamped v26.39.2-210868d,
  **flipped HOLD→READY**, Expected substance frozen. Gates: sample stamp/READY 15/15; **served fr-view 57/57 clean**.
- Run hand-off: RUN-HANDOFF-FOUNDER-PART-SALES-2026-10-01.md.
- RESIDUAL (run session confirms live): Add Deposit dialog fields (S8) · tax-rate change control (S3) · audit log
  entries & menu order (S4) · full Actions-column layout + core return row (S6/S1). Entry points confirmed.

## Addendum — 2026-10-01 · Mudassir's QA Additions (group 20481) BUILD-VERIFICATION COMPLETE
- Group **20481 "Part Sales — QA Additions (Mudassir)"** (under Founder Mode 20434): **43 cases, created_by=6
  (Mudassir Qamar, in-scope per Rule 38)**, 0 automated. Sections: S9 deposit audit log(20482) · S10 portal
  deposit(20483) · XC cross-cutting(20484).
- Create Deposit dialog confirmed on build (Deposit Date/Payment Method/Deposit Amount/Reference Number/Memo;
  Record Deposit/Collect In Portal/Cancel). "Collect in Portal"→"Collect In Portal" casing aligned.
- All 43 stamped v26.39.2-210868d, render **fr-view 43/43 clean**. Markers: **38 READY · 5 portal-HOLD**
  (C154849, C154862, C154864, C154869, C154870 — require the customer portal screen, staging-only).
- Run hand-off: RUN-HANDOFF-MUDASSIR-PART-SALES-2026-10-01.md. Deposit glossary: OBSERVED-UI-LABELS-sv9667-DEPOSITS.md.
- RESIDUAL (run session confirms live): QuickBooks settings (Automatically Apply Credits/Payments, Deposit sync
  enabled) · Part Sale Log entries (Deposit received/applied, Delete Deposit) · "Access restricted" gate.

## 2026-10-05 · Rule 115 clarity pass
Ran `check_tester_runnable.py` on all 57. Flagged 1; fixed: C154635 (removed spec-id citation S8-R8/S8-R11 from the step and
Expected head; meaning unchanged, fr-view clean). All 57 now pass.
## 2026-10-05 · Rule 115 — Mudassir's Part Sales additions (group 20481, created_by=6)
Ran the gate on Mudassir's 43. Flagged 3 — NOT rewritten, because they are the designated tester's OWN authored cases and the
flagged terms are the subject, not confusing shorthand: C154871 & C154873 are permission/server-enforcement security tests
(the "server enforces" is the thing under test; direct-request method is the tester's own), and C154883 is a deliberate
"record PRD discrepancies, do not score" note where requirement id S1-R22 is the subject and is already explained in plain words.
Reported to the QA lead for Mudassir rather than changed.

## 2026-10-05 · FULL BUILD-VERIFY on sv9667 v26.40.7-7ffda69 (QA lead order, unattended)
Group 20435 now holds 104 (61 Bilal + 43 Mudassir). Walked the whole core flow through the screen (seeded P9667-370/371).
**82 written** (all except the 22 Vlad-edited Automated cases, held under Rule 71), fr-view 82/82, write log 82/82 OK.
Markers (final, counted live): 46 READY · 22 HOLD QuickBooks (not connected on this branch, proved) · 8 portal-HOLD · 5 HOLD not-manual/old-sign-in · 1 Not available (C154595).
Hand-off: RUN-HANDOFF-PART-SALES-2026-10-05.md. Outstanding: go-ahead for the 22 held automated; Mudassir's 16 READY→QB-HOLD
(tell him); C154601 "Charged" tag absent (three outcomes in case); QuickBooks test company for this branch.
