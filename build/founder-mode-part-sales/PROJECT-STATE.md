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
