# Analytics field counts — C97024, C97035, C368153 (Rule 106 reconciliation, 19 Oct 2026)
Source read live: PRD Confluence 845185030 **version 64** (16 Oct 2026, Chris Ward), read 19 Oct 2026.
- S12-R2: "Measure selected and unselected fields available to each user, including untouched defaults and restored preferences. Record this snapshot once per display per session, the first time the user opens that display in the session, not on every open. Field changes are still recorded each time they are saved (S12-R3)."
- S2-R4: "Tech View offers the same columns as List, plus the Assigned Techs column (Story 7), through its own column chooser (Story 5)."
- S12-R7: "Exclude unavailable financial fields from field-exposure measurement and its denominator."
The PRD names **no count**. The cases' "Tech View 15" came from Slavcho Mitrov's SV-10593 comment (6 Oct 2026), not the PRD.
Build (staging, 17 Oct, analytics-batch.json → C97024.step4): 17 Tech View field-load events = List's 16 choosable columns (On Site, Waiting On Parts,
Unit, Asset, VIN, Progress, Service Advisor, Lead Technician, Clocked In, Lines, Created On, Total price, Invoiced Date, Days Open, Parts, Returns) + Assigned Techs.
Board View 13 = S5-R11's 13 optional fields — matches the cases.
**Outcome (Rule 106): case disagrees with the source, build matches the source → the CASE is wrong, not the product.** Expected may change only on the
QA lead's naming (114(c)). Proposed: Tech View 17 (C97024 step 4; total 13 + 17 = 30), C97035 field loads 30 and grand total 41, C368153 Tech View 16 (17 − 1), total 12 + 16 = 28.
