# RUN HAND-OFF — Founder Mode · Part Sales (group 20435) — build-verified 2026-10-05
Build: QA branch **sv9667.qa.shopview.com**, app **v26.40.7-7ffda69**. Login: Owner/Admin (quick-login `admin`).
Evidence: `build-verify-2026-10-05/` (seed-*.txt/png = the end-to-end walk) · labels: `OBSERVED-UI-LABELS-sv9667.md` (2026-10-05 block).
Write log `build-verify-2026-10-05/write/` (before/after bodies, write-log 82/82 OK, served-scan 82/82 fr-view, patch log 7/7).

## What changed in the cases (substance of every Expected untouched — Rules 57/114)
Every precondition now follows the flow walked on the build: New Vendor needs a **Taxes** value · New Part Sale dialog → **Save**
· **Add Part dialog** (Quantity required, Save & Close; core row "Core for <part>") · **Authorize** before **Order** (rows go
Requested → Auth To Order → Awaiting) · **Receive parts** dialog needs a **part number** and the part **Cost** · Return Core has no
confirmation · **Make Payment** in New Customer Payment, which pre-fills EVERY open invoice of the customer (zero the others) ·
payment reversal = Customers → customer → **Payments** tab → trash icon → **Reverse** · invoice reversal = Finance ⋮ → **Reverse**
· Settings = your initials → Settings · Edit Staff Member (edit icon) → Role / Sales Representative → Save & Close · **Create Work
Order** (not "New Work Order") · Decline = red **Decline** button (declines the whole sale; no per-line Decline) · Move Part lists
part sales only. Vague "signed in as a user with …" roles replaced by Owner/Admin + named permissions.
Stamp on all 82: "Last checked against build v26.40.7-7ffda69 on 10/5/2026."

## Markers (82 written: 61 Bilal-authored, 42 Mudassir-authored minus his 1 held automated = 21+16+5)
- **READY (54):** Bilal C154586 C154589 C154591 C154593 C154594 C154597 C154600 C154601 C154603 C154608 C154611 C154613 C154614
  C154615 C154616 C154618 C154619 C154620 C154624 C154625 C154626 C154627 C154630 C154631 C154632 C154633 C154634 C154635 C154636
  C154641 C236959 C236960 C236962 · Mudassir C154848 C154853 C154860 C154861 C154863 C154865 C154866 C154867 C154868 C154871
  C154872 C154873 C154874 C154875 C154876 C154877 C154879 C154880 C154881 C154882 C154883
- **HOLD — QuickBooks not connected on this QA branch (19):** C154596 C154629 C154640 · Mudassir C154841 C154842 C154843 C154844
  C154845 C154846 C154847 C154850 C154851 C154852 C154854 C154855 C154856 C154857 C154858 C154859 (their precondition needs
  QuickBooks connected with "Deposit sync enabled"; proof `quickbooks-not-connected-claim.json`, blocker gate exit 0).
- **HOLD — customer-portal screen, staging only (8):** C154598 C154628 C236961 · Mudassir C154849 C154862 C154864 C154869 C154870.
- **Not available on Build to test Yet (1):** C154595 (Move Part offers part sales only — no move onto a work order).

## Known build-vs-document difference written into the case (three outcomes, not filed — Rule 62-b)
- **C154601** — the Receive parts dialog shows no "Charged" tag on the core row (seed-05-receive-dialog.png). Tester marks Failed.

## NOT touched — need the QA lead's go-ahead (Rule 71: automated, last edited by Vladimir)
C154587 C154588 C154590 C154592 C154599 C154602 C154604 C154605 C154606 C154607 C154609 C154610 C154612 C154617 C154621 C154622
C154623 C154637 C154638 C154639 C154642 C154878. They carry the same out-of-date setup wording (vague role, "Status Quoted",
row-level Add Part, no Authorize, no part number/cost in Receive). A partial ready-to-apply draft is in
`write/held-22-proposed-PARTIAL.json`; each still needs a per-case read on go-ahead. C154621 also expects "Set Status" in a row
menu — on this build Set Status is in the sale's top menu.

## Tell Vlad (automations to adjust — wording/setup changed, outcomes unchanged)
Automated: C154586 C154589 C154593 C154597 C154601 C154603 C154611 C154618 C154624 · Pending and last edited by Vlad: C154600 C154615 C154616.

## Still not walked on screen this pass (run session confirms; routes are written in the case)
Work order **Complete** button and work-order core flow (C154591/C154601/C154611/C236960 comparison steps) · Pick on an
inventory part (C154603/C154619) · Stats tab content · 768-px tablet layout (C236962) · Sales By Representative report contents.
Gate: `check_tester_runnable.py` clean on all Bilal cases; Mudassir's C154871/C154873/C154883 still carry the server/requirement
wording he chose (put to the QA lead 2026-10-05, not rewritten).
