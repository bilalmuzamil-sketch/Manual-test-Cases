# Left out of the report and the Chris question doc — a customer cannot reach these on screen (28 Oct 2026)

QA lead, 28 Oct 2026: *"If there is any error which can not be reproduced on screen and a customer would not reproduce it or see if when working on screen that should be excluded from the report."*

| Item | What it was | Why a customer cannot reach it |
|---|---|---|
| F3 / F5 (dashboard) | Lines added to a Paid / Invoiced work order change invoiced hours and a pending invoice | No *New Line* button on a Paid or Invoiced work order — only the server API can do it |
| W1 N1 | WIP values a line with both an hourly rate and a fixed price at hours × rate | The screen makes the two exclusive; set only through the API |
| W1 N2 / WQ-9 | Shop Efficiency counts a void invoice's hours | An invoice can only be voided through the API |
| W2 O4 | Void invoice S1-38207 still shows $135.00 owing in New Customer Payment | Same: voided through the API only |
| W2 FU1 / SQ-5 | Hidden Follow Up page is blank, data request fails | Not in the menu; reachable only by typing the address |
| W1 WQ-6 | Hidden Payroll Timesheet page is empty, data request fails | Not in the menu; reachable only by typing the address |
| W3 PQ-6 | Past sales of a deleted part disappear from Parts Velocity | A sold part cannot be deleted from the screen |
| DQ-4 (dashboard) | Utilization divides by all clocked time instead of WO + internal | No screen can create a clock that is neither on a work order nor a department, so the two formulas never differ |
| W4 RQ-9 | Export dates one day early at Heavy Duty | Staging set-up artefact (location time zone set to Asia/Karachi on staging) |
| W2 O1 / O2 | Sales By Representative invoice request ignores paging; a hidden server tax total | Not visible on any screen |
