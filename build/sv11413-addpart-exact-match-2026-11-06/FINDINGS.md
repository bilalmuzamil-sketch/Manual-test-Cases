# SV-11413 - Work Order Add Part search: exact part number first (2026-11-06)
Scope (ticket scope update + handoff in description): ONLY Work Order > Parts > Add Part search. Inventory page,
Returns/Credits picker, hyphen-insensitive, highlighting -> SV-12286 (out of scope).
Mode: API mode default, no recording, no technical section. QA branch https://sv11413.qa.shopview.com
Handoff checks: 1 exact EC1 first; 2 lowercase ec1; 3 starts-with above contains; 4 exact special-order/catalogue above
inventory partials; 5 common word (brake) same set; 6 cleared search default list unchanged; 7 add exact part to WO.
Before = production (Rule 86).
## Status
- In progress.
