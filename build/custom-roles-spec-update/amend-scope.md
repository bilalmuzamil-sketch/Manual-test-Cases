# Amendment Scope — Re-scoped TestRail Update List

Source: `build/custom-roles-spec-update/testrail-cases-needing-update.csv` (46 flagged cases).
Re-scoping rule: exclude every case whose section falls under **SV-7388 Combo + Breakage (Master)** (section 3641 and descendants 3642, 3643, 3644, 3645).

## Combo + Breakage sections (EXCLUDE tree)

| Section ID | Name | Path |
|---|---|---|
| 3641 | SV-7388 Combo + Breakage (Master) | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) |
| 3642 | Combo Testing – 2 Permissions | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – 2 Permissions |
| 3643 | Combo Testing – 3 Permissions | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – 3 Permissions |
| 3644 | Combo Testing – Payments | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 3645 | Breakage / Adversarial | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Breakage / Adversarial |

## Counts

- Flagged total: **46**
- Excluded (Combo + Breakage): **24**
- Already amended (skipped): **1** (26482)
- In-scope to amend: **21**

## IN-SCOPE to amend (21) — grouped by spec change

### Spec Change #1

| Case ID | Title | Verdict | Section Path |
|---|---|---|---|
| 27764 | Verify Administrator can edit and delete another user's work order note | NEEDS CLARIFY | Custom Roles - (Revised) > Regression Suite (Minja's API file) > Administrator |
| 27777 | Verify Service Manager can create and edit their own work order note | NEEDS CLARIFY | Custom Roles - (Revised) > Regression Suite (Minja's API file) > Service Manager |
| 27778 | Verify Service Manager cannot edit or delete another user's work order note | NEEDS UPDATE | Custom Roles - (Revised) > Regression Suite (Minja's API file) > Service Manager |
| 27790 | Verify Senior Service Advisor can edit and delete another user's work order note | NEEDS CLARIFY | Custom Roles - (Revised) > Regression Suite (Minja's API file) > Senior Service Advisor |
| 27802 | Verify Service Advisor can create and edit their own work order note | NEEDS CLARIFY | Custom Roles - (Revised) > Regression Suite (Minja's API file) > Service Advisor |
| 27803 | Verify Service Advisor cannot edit or delete another user's work order note | NEEDS UPDATE | Custom Roles - (Revised) > Regression Suite (Minja's API file) > Service Advisor |
| 27827 | Verify Technician can create and edit their own work order note | NEEDS CLARIFY | Custom Roles - (Revised) > Regression Suite (Minja's API file) > Technician |
| 27828 | Verify Technician cannot edit or delete another user's work order note | NEEDS UPDATE | Custom Roles - (Revised) > Regression Suite (Minja's API file) > Technician |
| 27853 | Verify Office can create and edit their own work order note | NEEDS CLARIFY | Custom Roles - (Revised) > Regression Suite (Minja's API file) > Office |
| 27854 | Verify Office cannot edit or delete another user's work order note | NEEDS UPDATE | Custom Roles - (Revised) > Regression Suite (Minja's API file) > Office |

### Spec Change #4

| Case ID | Title | Verdict | Section Path |
|---|---|---|---|
| 26381 | Order parts requires only Work orders View, not Create and Edit | NEEDS UPDATE | Custom Roles - (Revised) > Work Orders Permissions |
| 26475 | Turning See Financial OFF auto-clears Part sales and Invoicing and Payments CRUDs | NEEDS UPDATE | Custom Roles - (Revised) > See Financial Data |

### Spec Change #6

| Case ID | Title | Verdict | Section Path |
|---|---|---|---|
| 26478 | AP/AR ON + Reports ON: all 6 AP/AR aging reports listed | NEEDS CLARIFY | Custom Roles - (Revised) > Manage Accounts Payable and Receivable |
| 26504 | Sales Representative: Reports + financial data only; no CRUD areas | NEEDS CLARIFY | Custom Roles - (Revised) > Per-Role Verification |
| 27757 | Verify Administrator can open all AP/AR reports | NEEDS CLARIFY | Custom Roles - (Revised) > Regression Suite (Minja's API file) > Administrator |
| 27773 | Verify Service Manager can open AP/AR reports | NEEDS CLARIFY | Custom Roles - (Revised) > Regression Suite (Minja's API file) > Service Manager |
| 27852 | Verify Office can open AP/AR reports and customer AP/AR tabs | NEEDS CLARIFY | Custom Roles - (Revised) > Regression Suite (Minja's API file) > Office |
| 27858 | Verify Sales Representative can open AP/AR reports | NEEDS CLARIFY | Custom Roles - (Revised) > Regression Suite (Minja's API file) > Sales Representative |

### Spec Change #7

| Case ID | Title | Verdict | Section Path |
|---|---|---|---|
| 26488 | View History Logs ON: history visible on WO, part sales, parts orders | NEEDS CLARIFY | Custom Roles - (Revised) > View History Logs |
| 26489 | View History Logs OFF: history hidden everywhere | NEEDS CLARIFY | Custom Roles - (Revised) > View History Logs |

### Spec Change #8

| Case ID | Title | Verdict | Section Path |
|---|---|---|---|
| 26414 | Catalog and Inventory Create and Edit enables create / edit / inventory adjustments | NEEDS CLARIFY | Custom Roles - (Revised) > Parts Department Permissions |

## EXCLUDED — Combo + Breakage (24)

| Case ID | Title | Section Path |
|---|---|---|
| 27416 | CR-C2-011 — Parts orderer / receiver | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – 2 Permissions |
| 27467 | CR-C3-012 — Parts runner | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – 3 Permissions |
| 27474 | CR-C3-019 — Invoicing + AP/AR | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – 3 Permissions |
| 27490 | CR-C3-035 — Part sales + AP/AR | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – 3 Permissions |
| 27509 | CR-PAY-004 — Customer payment viewer | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27510 | CR-PAY-005 — Vendor payment viewer | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27513 | CR-PAY-008 — Part-sales + AP/AR | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27514 | CR-PAY-009 — Invoice + AP/AR viewer | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27517 | CR-PAY-012 — Payments + AP/AR | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27519 | CR-PAY-014 — Part-sales + AP/AR (edit) | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27523 | CR-PAY-018 — WO + invoice + AP/AR view | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27524 | CR-PAY-019 — Vendor invoicing + AP/AR | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27531 | CR-PAY-026 — WO + payments + AP/AR | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27535 | CR-PAY-030 — Customer payments + AP/AR | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27539 | CR-PAY-034 — WO + invoice + AP/AR + history | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27541 | CR-PAY-036 — WO + customer + invoice + AP/AR view | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27542 | CR-PAY-037 — Part sales full + AP/AR | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27546 | CR-PAY-041 — WO + customer + payments + AP/AR | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27547 | CR-PAY-042 — WO writer + payments + AP/AR | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27549 | CR-PAY-044 — Part-sales + payments + AP/AR | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27554 | CR-PAY-049 — WO + payments + AP/AR + history | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27555 | CR-PAY-050 — Vendor + part-sales + AP/AR | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 27565 | CR-BRK-010 — Pick/Order/Review with WO View only (no WO Edit) — over-gating | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Breakage / Adversarial |
| 27568 | CR-BRK-013 — AP/AR OFF — Unpaid/Payments/Credits tabs leak (customer & vendor) | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Breakage / Adversarial |

Excluded case IDs: 27416, 27467, 27474, 27490, 27509, 27510, 27513, 27514, 27517, 27519, 27523, 27524, 27531, 27535, 27539, 27541, 27542, 27546, 27547, 27549, 27554, 27555, 27565, 27568
