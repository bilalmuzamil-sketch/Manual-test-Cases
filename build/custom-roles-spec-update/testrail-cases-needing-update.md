# Custom Roles - (Revised): TestRail cases needing update vs latest spec changes

_Generated 2026-07-05 — READ-ONLY analysis of TestRail (project 1, suite 1). Proposals only; nothing was written to TestRail._

**Scope:** Section "Custom Roles - (Revised)" (id 3527) + 56 descendant sections = 57 sections, 728 test cases reviewed.

## Cases to edit (46)

`27778, 27803, 27828, 27854, 27777, 27802, 27853, 27827, 27764, 27790, 26381, 26475, 27416, 27467, 27565, 26482, 27474, 27490, 27509, 27510, 27513, 27514, 27517, 27519, 27523, 27524, 27531, 27535, 27539, 27541, 27542, 27546, 27547, 27549, 27554, 27555, 27568, 26478, 27757, 27773, 27852, 27858, 26504, 26488, 26489, 26414`

- NEEDS UPDATE (30): 27778, 27803, 27828, 27854, 26381, 26475, 27416, 27467, 27565, 26482, 27474, 27490, 27509, 27510, 27513, 27514, 27517, 27519, 27523, 27524, 27531, 27535, 27539, 27541, 27542, 27546, 27547, 27549, 27554, 27555
- NEEDS CLARIFY (16): 27777, 27802, 27853, 27827, 27764, 27790, 27568, 26478, 27757, 27773, 27852, 27858, 26504, 26488, 26489, 26414

## Summary table

| Spec change | # NEEDS UPDATE | # NEEDS CLARIFY | # GAPS |
|---|---|---|---|
| 1. WORK ORDER > VIEW (Changed) | 4 | 6 | 0 |
| 2. WORK ORDER > DELETE (Changed) | 0 | 0 | 0 |
| 3. ORDER PARTS (Added) | 0 | 0 | 1 |
| 4. ORDER PARTS (Added) | 5 | 0 | 1 |
| 5. WO LINES > CREATE & EDIT (Added) | 0 | 0 | 1 |
| 6. MANAGE AP/AR (Removed gate) | 21 | 7 | 0 |
| 7. VIEW HISTORY LOGS (Clarified) | 0 | 2 | 0 |
| 8. CREATE INVENTORY ITEM (Clarified) | 0 | 1 | 0 |
| **Total** | **30** | **16** | **3** |

> Note: Case **27778** is affected by BOTH change 1 (edit any note via WO View) and change 2 (delete any note via WO Delete); it is counted once under change 1.

---

## Spec change 1 — WORK ORDER > VIEW (Changed): now grants create + edit of ANY note (collaboration)

### NEEDS UPDATE

**27778 — Verify Service Manager cannot edit or delete another user's work order note**  
_Section:_ Regression Suite (By Dev) > Service Manager  
_Current (stale):_ Title: "Verify Service Manager cannot edit or delete another user's work order note"; EXP: "Both editing and deleting another user's note are BLOCKED". (Also spec change 2: SM has WO Delete.)  
_Proposed:_ Verify Service Manager CAN edit AND delete another user's work order note. Editing any note is now granted by Work Orders: View (collaboration); deleting any note is granted by Work Orders: Delete. Service Manager has both, so both actions succeed with no permission error.

**27803 — Verify Service Advisor cannot edit or delete another user's work order note**  
_Section:_ Regression Suite (By Dev) > Service Advisor  
_Current (stale):_ Title: "Verify Service Advisor cannot edit or delete another user's work order note"; EXP: "Both actions are BLOCKED".  
_Proposed:_ Verify Service Advisor CAN edit another user's note (granted by Work Orders: View) but CANNOT delete another user's note (requires Work Orders: Delete, which this role lacks). Edit succeeds; delete is hidden/disabled or returns a permission error.

**27828 — Verify Technician cannot edit or delete another user's work order note**  
_Section:_ Regression Suite (By Dev) > Technician  
_Current (stale):_ Title: "Verify Technician cannot edit or delete another user's work order note"; EXP: "Both actions are BLOCKED". CAVEAT: default Technician template has an own-data restriction (see case 27866).  
_Proposed:_ Verify Technician can edit another user's note per the new WO-View collaboration rule (delete still blocked — no WO Delete). NOTE FOR PO: confirm whether the default Technician own-data restriction overrides WO-View note collaboration; if it does, keep "cannot edit others'" and re-gate wording accordingly.

**27854 — Verify Office cannot edit or delete another user's work order note**  
_Section:_ Regression Suite (By Dev) > Office  
_Current (stale):_ Title: "Verify Office cannot edit or delete another user's work order note"; EXP: "Both actions are BLOCKED".  
_Proposed:_ Verify Office CAN edit another user's note (granted by Work Orders: View) but CANNOT delete another user's note (no Work Orders: Delete). Edit succeeds; delete blocked.

### NEEDS CLARIFY

**27777 — Verify Service Manager can create and edit their own work order note**  
_Section:_ Regression Suite (By Dev) > Service Manager  
_Current:_ Title: "Verify Service Manager can create and edit their own work order note"; precond: "own-note create/edit is gated by Work Orders: View".  
_Proposed:_ Broaden to: "Verify Service Manager can create and edit ANY work order note." Work Orders: View now grants create/edit of any note (collaboration), not just the user's own.

**27802 — Verify Service Advisor can create and edit their own work order note**  
_Section:_ Regression Suite (By Dev) > Service Advisor  
_Current:_ Title: "Verify Service Advisor can create and edit their own work order note".  
_Proposed:_ Broaden to: "Verify Service Advisor can create and edit ANY work order note" (Work Orders: View grants edit of any note).

**27853 — Verify Office can create and edit their own work order note**  
_Section:_ Regression Suite (By Dev) > Office  
_Current:_ Title: "Verify Office can create and edit their own work order note".  
_Proposed:_ Broaden to: "Verify Office can create and edit ANY work order note" (Work Orders: View grants edit of any note).

**27827 — Verify Technician can create and edit their own work order note**  
_Section:_ Regression Suite (By Dev) > Technician  
_Current:_ Title: "Verify Technician can create and edit their own work order note".  
_Proposed:_ Clarify against Technician own-data restriction: if WO-View collaboration applies, retitle to "…can create and edit any work order note"; if the Technician own-data restriction wins, keep "own" and cite that restriction explicitly. Needs PO confirmation.

**27764 — Verify Administrator can edit and delete another user's work order note**  
_Section:_ Regression Suite (By Dev) > Administrator  
_Current:_ Precond: "(editing/deleting ALL notes, including other users' notes, is gated by Work Orders: Delete per spec v33)". Outcome (Admin can edit+delete others) is CORRECT.  
_Proposed:_ Fix attribution: editing any note is gated by Work Orders: View; deleting any note is gated by Work Orders: Delete. Admin has both, so both succeed.

**27790 — Verify Senior Service Advisor can edit and delete another user's work order note**  
_Section:_ Regression Suite (By Dev) > Senior Service Advisor  
_Current:_ Precond: "(edit/delete ALL notes requires Work Orders: Delete per spec v33)". Outcome (SSA can edit+delete others) is CORRECT.  
_Proposed:_ Fix attribution: edit-any-note = Work Orders: View; delete-any-note = Work Orders: Delete. SSA has both.

---

## Spec change 2 — WORK ORDER > DELETE (Changed): now grants delete of ANY note including others'

_No cases require changes under this spec change (see "Reviewed & still correct")._ 

---

## Spec change 3 — ORDER PARTS (Added): now CONTROLS the WO Parts tab

### POSSIBLE GAP / MISSING COVERAGE

- No test case gates the WO **Parts tab** visibility on the Order Parts permission. Existing Order-Parts cases (26381, 26382) test the Order Parts *action*, not the Parts tab. The Parts tab is not exercised anywhere.

---

## Spec change 4 — ORDER PARTS (Added): now REQUIRES See Financial Data

### NEEDS UPDATE

**26381 — Order parts requires only Work orders View, not Create and Edit**  
_Section:_ Work Orders Permissions  
_Current (stale):_ Title: "Order parts requires only Work orders View, not Create and Edit"; precond lists Order parts ON with no See Financial Data.  
_Proposed:_ Retitle: "Order parts requires Work orders View AND See Financial Data (not Create and Edit)." Precond must set See Financial Data ON; enabling Order Parts prompts/requires SFD.

**26475 — Turning See Financial OFF auto-clears Part sales and Invoicing and Payments CRUDs**  
_Section:_ See Financial Data  
_Current (stale):_ Title: "Turning See Financial OFF auto-clears Part sales and Invoicing and Payments CRUDs" — omits Order Parts.  
_Proposed:_ Add Order Parts to the auto-cleared items: "Turning See Financial OFF auto-clears Part sales and Invoicing and Payments CRUDs AND the Order Parts sub-toggle." (Removing SFD removes Order Parts.)

**27416 — CR-C2-011 — Parts orderer / receiver**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – 2 Permissions  
_Current (stale):_ CR-C2-011 — precond "WO View + Order Parts. All other permissions OFF." (no SFD).  
_Proposed:_ Add See Financial Data as an auto-gated (not counted) permission forced ON, since Order Parts now requires SFD. Precond: "WO View + Order Parts; Auto-gate forced ON (not counted): See Financial."

**27467 — CR-C3-012 — Parts runner**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – 3 Permissions  
_Current (stale):_ CR-C3-012 — precond "WO View + Pick Parts + Order Parts. All other permissions OFF." (no SFD).  
_Proposed:_ Add See Financial Data auto-gated ON (Order Parts requires SFD). Precond: "…Auto-gate forced ON (not counted): See Financial."

**27565 — CR-BRK-010 — Pick/Order/Review with WO View only (no WO Edit) — over-gating**  
_Section:_ SV-7388 Combo + Breakage (Master) > Breakage / Adversarial  
_Current (stale):_ CR-BRK-010 — EXP: "All three sub-settings require only WO View, NOT WO Edit". Order Parts now also requires See Financial Data.  
_Proposed:_ Clarify: Pick Parts and Review WOs require only WO View; Order Parts requires WO View AND See Financial Data (not WO Edit). Setup must include See Financial ON for the Order Parts leg.

### POSSIBLE GAP / MISSING COVERAGE

- No case mirrors 26471/26474 for Order Parts — i.e. "Enabling Order Parts while See Financial Data OFF prompts to enable SFD". Add one so the new SFD auto-gate on Order Parts is covered.

---

## Spec change 5 — WO LINES > CREATE & EDIT (Added): now also covers marking core OK/Not-OK and the line "story/history"

### POSSIBLE GAP / MISSING COVERAGE

- No case covers **marking core OK / Not-OK** or the **line "story/history"** under WO Lines Create & Edit. Case 26390 ("WO lines Create and Edit enables add / edit / move parts / authorize / manage part requests") is the natural place to extend, or add dedicated cases. This is missing coverage.

---

## Spec change 6 — MANAGE AP/AR (Removed gate): no longer gates the AR/AP AGING REPORTS — those now follow the REPORTS permission

### NEEDS UPDATE

**26482 — AP/AR OFF + Reports ON: the 6 AP/AR aging reports are hidden from Reports**  
_Section:_ Manage Accounts Payable and Receivable  
_Current (stale):_ Title: "AP/AR OFF + Reports ON: the 6 AP/AR aging reports are hidden from Reports"; EXP: "None of the 6 reports are listed."  
_Proposed:_ Reverse: "AP/AR OFF + Reports ON: the 6 AP/AR aging reports ARE listed and accessible." Aging reports now follow the Reports permission (all-or-nothing); Manage AP/AR no longer gates them.

**27474 — CR-C3-019 — Invoicing + AP/AR**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – 3 Permissions  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27490 — CR-C3-035 — Part sales + AP/AR**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – 3 Permissions  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27509 — CR-PAY-004 — Customer payment viewer**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27510 — CR-PAY-005 — Vendor payment viewer**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27513 — CR-PAY-008 — Part-sales + AP/AR**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27514 — CR-PAY-009 — Invoice + AP/AR viewer**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27517 — CR-PAY-012 — Payments + AP/AR**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27519 — CR-PAY-014 — Part-sales + AP/AR (edit)**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27523 — CR-PAY-018 — WO + invoice + AP/AR view**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27524 — CR-PAY-019 — Vendor invoicing + AP/AR**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27531 — CR-PAY-026 — WO + payments + AP/AR**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27535 — CR-PAY-030 — Customer payments + AP/AR**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27539 — CR-PAY-034 — WO + invoice + AP/AR + history**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27541 — CR-PAY-036 — WO + customer + invoice + AP/AR view**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27542 — CR-PAY-037 — Part sales full + AP/AR**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27546 — CR-PAY-041 — WO + customer + payments + AP/AR**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27547 — CR-PAY-042 — WO writer + payments + AP/AR**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27549 — CR-PAY-044 — Part-sales + payments + AP/AR**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27554 — CR-PAY-049 — WO + payments + AP/AR + history**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

**27555 — CR-PAY-050 — Vendor + part-sales + AP/AR**  
_Section:_ SV-7388 Combo + Breakage (Master) > Combo Testing – Payments  
_Current (stale):_ EXP lists "AP/AR aging reports"/"aging" as accessible, but the role has See AP/AR WITHOUT the Reports permission.  
_Proposed:_ Remove the aging-reports capability from the CAN list (or move to CANNOT): aging reports now require the Reports permission, which this combo does not include. AP/AR tab visibility (Unpaid Invoices/Payments/Credits) stays as-is (still gated by Manage AP/AR).

### NEEDS CLARIFY

**27568 — CR-BRK-013 — AP/AR OFF — Unpaid/Payments/Credits tabs leak (customer & vendor)**  
_Section:_ SV-7388 Combo + Breakage (Master) > Breakage / Adversarial  
_Current:_ CR-BRK-013 — EXP: "…AP/AR aging reports hidden from Reports" attributed to §5b Manage AP/AR OFF. Role also has NO Reports permission.  
_Proposed:_ Keep tab-leak assertions (unchanged, gated by Manage AP/AR). For aging reports, re-attribute: they are hidden because the role lacks the Reports permission, not because Manage AP/AR is OFF.

**26478 — AP/AR ON + Reports ON: all 6 AP/AR aging reports listed**  
_Section:_ Manage Accounts Payable and Receivable  
_Current:_ Title: "AP/AR ON + Reports ON: all 6 AP/AR aging reports listed" — implies Manage AP/AR is required to see aging reports.  
_Proposed:_ Clarify that aging reports are shown by the Reports permission alone; Manage AP/AR is not required. Consider retitling to "Reports ON: all 6 AP/AR aging reports listed (regardless of Manage AP/AR)."

**27757 — Verify Administrator can open all AP/AR reports**  
_Section:_ Regression Suite (By Dev) > Administrator  
_Current:_ Precond attributes AP/AR aging report access to "this role has Manage Accounts Payable and Receivable ON".  
_Proposed:_ Re-attribute the aging-report access to the Reports permission (which this role also has). Manage AP/AR now only gates the customer/vendor AP/AR tabs, not the aging reports.

**27773 — Verify Service Manager can open AP/AR reports**  
_Section:_ Regression Suite (By Dev) > Service Manager  
_Current:_ Precond attributes AP/AR aging report access to "this role has Manage Accounts Payable and Receivable ON".  
_Proposed:_ Re-attribute the aging-report access to the Reports permission (which this role also has). Manage AP/AR now only gates the customer/vendor AP/AR tabs, not the aging reports.

**27852 — Verify Office can open AP/AR reports and customer AP/AR tabs**  
_Section:_ Regression Suite (By Dev) > Office  
_Current:_ Precond attributes AP/AR aging report access to "this role has Manage Accounts Payable and Receivable ON".  
_Proposed:_ Re-attribute the aging-report access to the Reports permission (which this role also has). Manage AP/AR now only gates the customer/vendor AP/AR tabs, not the aging reports.

**27858 — Verify Sales Representative can open AP/AR reports**  
_Section:_ Regression Suite (By Dev) > Sales Representative  
_Current:_ Precond attributes AP/AR aging report access to "this role has Manage Accounts Payable and Receivable ON".  
_Proposed:_ Re-attribute the aging-report access to the Reports permission (which this role also has). Manage AP/AR now only gates the customer/vendor AP/AR tabs, not the aging reports.

**26504 — Sales Representative: Reports + financial data only; no CRUD areas**  
_Section:_ Per-Role Verification  
_Current:_ Sales Representative: step "Confirm access to AP/AR aging reports"; EXP "User can access Reports including AP/AR reports." Attribution implies See AP/AR grants aging reports.  
_Proposed:_ Clarify that aging-report access comes from Reports ON (all-or-nothing); See AP/AR is not what surfaces the aging reports.

---

## Spec change 7 — VIEW HISTORY LOGS (Clarified): WO-level vs line-level history distinction clarified

### NEEDS CLARIFY

**26488 — View History Logs ON: history visible on WO, part sales, parts orders**  
_Section:_ View History Logs  
_Current:_ Title: "View History Logs ON: history visible on WO, part sales, parts orders" — does not distinguish WO-level vs line-level history.  
_Proposed:_ Add the WO-level vs line-level distinction: with View History Logs ON, both the WO-level history and the individual line-level history (line/story history) are visible, plus part sales and parts order history.

**26489 — View History Logs OFF: history hidden everywhere**  
_Section:_ View History Logs  
_Current:_ Title: "View History Logs OFF: history hidden everywhere" — blanket, no WO-level vs line-level distinction.  
_Proposed:_ Clarify: with View History Logs OFF, both WO-level history AND line-level (line/story) history sections are hidden, along with part sale and PO history.

---

## Spec change 8 — CREATE INVENTORY ITEM (Clarified): impact of See Financial Data clarified

### NEEDS CLARIFY

**26414 — Catalog and Inventory Create and Edit enables create / edit / inventory adjustments**  
_Section:_ Parts Department Permissions  
_Current:_ Title: "Catalog and Inventory Create and Edit enables create / edit / inventory adjustments" — no mention of See Financial Data impact when creating an item.  
_Proposed:_ Clarify the See Financial Data relationship: creating an inventory/catalog item is enabled by Catalog and Inventory Create and Edit, but cost/price fields on the new-item form are gated by See Financial Data (hidden/blank when SFD is OFF). Related combos to review: 27409, 27460, 27830, 27840.

---

## Reviewed & judged STILL CORRECT (full coverage)

**Change 1/2 (WO notes):** 27763 (Admin can create + edit/delete own note — positive subset, still holds); 27865 (Time Clock cannot reach notes — no WO View); 27764 & 27790 (edit+delete others by roles WITH WO Delete — outcome correct, only precond attribution needs the change-1 clarify above); delete-others portion of 27803/27828/27854 is correct (those roles lack WO Delete).

**Change 2 (delete any note requires WO Delete):** 27764 (Admin) and 27790 (Sr Service Advisor) correctly require WO Delete for deleting others' notes — CORRECT.

**Change 4 (Order Parts / SFD):** 26380 (Pick parts requires only WO View — unchanged); 26382 (Pick vs Order independence — unchanged); 26471 & 26474 (SFD auto-gate prompt for Part Sales / Invoicing — pattern to mirror for Order Parts); regression 27797, 27808, 27823, 27843 (order-a-part cases — roles already carry SFD, still correct).

**Change 6 (AP/AR aging):** Combos that DO include the Reports permission remain correct — 27421, 27475, 27485, 27505, 27511, 27525, 27528, 27538, 27543, 27553. Backend endpoint cases 26553, 26554, 26558, 26559 already gate aging on the report role (Reports permission), consistent with the new model. Customer/vendor AP/AR TABS cases (26476, 26477, 26485, 27798, 27568 tab portion) remain gated by Manage AP/AR — UNCHANGED.

**Change 7 (history WO vs line):** Backend cases 26561 (WO History), 26562 (Line History), 26563 (Story History) already distinguish WO-level, line-level, and story history — CORRECT (good model for the clarified wording).

**Change 3 & 5:** No existing cases — see GAP notes above.

---

## Appendix A — Sections under "Custom Roles - (Revised)" (57)

| Section ID | Full path |
|---|---|
| 3527 | Custom Roles - (Revised) |
| 3554 | Custom Roles - (Revised) > Backend API and Security |
| 3529 | Custom Roles - (Revised) > Create Custom Role |
| 3553 | Custom Roles - (Revised) > Cross-Permission Combinations |
| 3533 | Custom Roles - (Revised) > CRUD Cascade Rules |
| 3537 | Custom Roles - (Revised) > Customer Management Permissions |
| 3531 | Custom Roles - (Revised) > Delete Role |
| 3646 | Custom Roles - (Revised) > Digital Inspections – Per-Role Access Checks |
| 3647 | Custom Roles - (Revised) > Digital Inspections – Per-Role Access Checks > Administrator |
| 3651 | Custom Roles - (Revised) > Digital Inspections – Per-Role Access Checks > Foreman |
| 3655 | Custom Roles - (Revised) > Digital Inspections – Per-Role Access Checks > Office |
| 3653 | Custom Roles - (Revised) > Digital Inspections – Per-Role Access Checks > Parts Manager |
| 3654 | Custom Roles - (Revised) > Digital Inspections – Per-Role Access Checks > Parts Technician |
| 3656 | Custom Roles - (Revised) > Digital Inspections – Per-Role Access Checks > Sales Representative |
| 3649 | Custom Roles - (Revised) > Digital Inspections – Per-Role Access Checks > Senior Service Advisor |
| 3650 | Custom Roles - (Revised) > Digital Inspections – Per-Role Access Checks > Service Advisor |
| 3648 | Custom Roles - (Revised) > Digital Inspections – Per-Role Access Checks > Service Manager |
| 3652 | Custom Roles - (Revised) > Digital Inspections – Per-Role Access Checks > Technician |
| 3657 | Custom Roles - (Revised) > Digital Inspections – Per-Role Access Checks > Time Clock |
| 3530 | Custom Roles - (Revised) > Edit Role |
| 3539 | Custom Roles - (Revised) > Invoicing and Payments Permissions |
| 3545 | Custom Roles - (Revised) > Manage Accounts Payable and Receivable |
| 3549 | Custom Roles - (Revised) > Migration |
| 3541 | Custom Roles - (Revised) > Page Access Toggles |
| 3538 | Custom Roles - (Revised) > Parts Department Permissions |
| 3548 | Custom Roles - (Revised) > Per-Role Verification |
| 3532 | Custom Roles - (Revised) > Permission Summary |
| 3551 | Custom Roles - (Revised) > QuickBooks Relocation |
| 3666 | Custom Roles - (Revised) > Regression Suite (By Dev) |
| 3667 | Custom Roles - (Revised) > Regression Suite (By Dev) > Administrator |
| 3671 | Custom Roles - (Revised) > Regression Suite (By Dev) > Foreman |
| 3675 | Custom Roles - (Revised) > Regression Suite (By Dev) > Office |
| 3673 | Custom Roles - (Revised) > Regression Suite (By Dev) > Parts Manager |
| 3674 | Custom Roles - (Revised) > Regression Suite (By Dev) > Parts Technician |
| 3676 | Custom Roles - (Revised) > Regression Suite (By Dev) > Sales Representative |
| 3669 | Custom Roles - (Revised) > Regression Suite (By Dev) > Senior Service Advisor |
| 3670 | Custom Roles - (Revised) > Regression Suite (By Dev) > Service Advisor |
| 3668 | Custom Roles - (Revised) > Regression Suite (By Dev) > Service Manager |
| 3672 | Custom Roles - (Revised) > Regression Suite (By Dev) > Technician |
| 3677 | Custom Roles - (Revised) > Regression Suite (By Dev) > Time Clock |
| 3528 | Custom Roles - (Revised) > Roles List Page |
| 3536 | Custom Roles - (Revised) > Schedule Permissions |
| 3544 | Custom Roles - (Revised) > See Financial Data |
| 3542 | Custom Roles - (Revised) > Settings Access |
| 3547 | Custom Roles - (Revised) > Staff Page Role Assignment |
| 3550 | Custom Roles - (Revised) > Staff Record Settings |
| 3641 | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) |
| 3645 | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Breakage / Adversarial |
| 3642 | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – 2 Permissions |
| 3643 | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – 3 Permissions |
| 3644 | Custom Roles - (Revised) > SV-7388 Combo + Breakage (Master) > Combo Testing – Payments |
| 3540 | Custom Roles - (Revised) > Timesheets Permissions |
| 3552 | Custom Roles - (Revised) > User Feedback Strings |
| 3546 | Custom Roles - (Revised) > View History Logs |
| 3543 | Custom Roles - (Revised) > View Mode |
| 3535 | Custom Roles - (Revised) > Work Order Lines Permissions |
| 3534 | Custom Roles - (Revised) > Work Orders Permissions |
