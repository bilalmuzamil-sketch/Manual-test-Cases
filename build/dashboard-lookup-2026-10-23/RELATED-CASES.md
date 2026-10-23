# Dashboard tests related to SV-11691, SV-11690, SV-11711, SV-11688 — 23 Oct 2026

Read live: the four tickets (Jira, 23 Oct 2026) and every case in TestRail section 12166 "Dashboard (Sep 2026)" and its 14 sub-sections
(126 cases). Script: `find_related.py` (matches.json); whole-word checks done afterwards (the first pass matched "aging" inside "staging").
Dashboard tiles: Revenue, Billing Efficiency, Technician Efficiency, Technician Utilization, Sales by Customer, At Risk Customers — there is
no receivables / A/R tile and no credit-limit tile.

| Ticket | Status (live) | Related Dashboard tests |
|---|---|---|
| SV-11688 Technician Utilization counts open timesheets as 24 h/day; idle days 33.33 % instead of "-" | Ready to Fix | C88641, C88605, C88602, C88603, C88646, C351706, C351707, C88650, C88647 — all **Passed** in run 525 "Dashboards"; none sets up a technician who never clocked out, which is why they pass |
| SV-11690 A/R Aging counts held deposits | Ready to Fix | none — no Dashboard test covers receivables, aging or deposits |
| SV-11691 Invoices marked Paid with $0 payments | Ready to Fix | none directly — Dashboard figures count invoiced sales; payment status is never read |
| SV-11711 "Over Limit" uses a stale balance | Ready to Fix | none test it; C88594, C88607, C88608, C88617, C88623, C88624 only meet it in their set-up ("if a Confirmation says the customer is over their credit limit, click Create") |

Run 525 tests: C88602 3698719 · C88603 3698720 · C88605 3698722 · C351706 3742892 · C351707 3742893 · C88641 3698758 · C88646 3698763 ·
C88647 3698764 · C88650 3698767 (all Passed). Run 500 "Dashboard v1 (SV-490) — Automation + Manual" holds the same cases untested.
Gap: no case covers a forgotten clock-out (PRD Dashboard v1 S3-R2, S3-E3, S4-R11 as cited by SV-11688).
