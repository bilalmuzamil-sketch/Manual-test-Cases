# Jira writes, 4 Nov 2026 (21:20–21:24 UTC): SV-11839 TESTING QA tickets

QA lead's instruction (4 Nov, verbatim): *"The tickets if they turn out to be QA passed, please move their starus to QA complete, assign Bilal Muzamil as a QA assignee and add the existing label to the ticket QAcomplete. Those whoch do not pass the QA move them to rejected from testing status and tye ricket comment should clearly state in clear comment for a layman to u derstand with the annotated screenshot why it failed."*

Verdicts were checked against the committed evidence before anything was written (Rule 86). SV-11826's same-instant reads and SV-11931's and SV-11826's screenshots were opened and checked by hand.

## What was written

For each ticket, three writes were made:

1. a "QA passed" comment
2. labels: the existing labels plus `QAcomplete`
3. QA Assignee (customfield_10385): Bilal Muzamil **added**; Mudassir Qamar was kept where he was already set

Then transition 10 (TESTING QA → QA Complete) was run.

The read-back at 21:24 UTC shows all 12 with status QA Complete, label QAcomplete and Bilal as a QA Assignee.

| Ticket | Comment id | Labels after | QA Assignee after | Status after |
|---|---|---|---|---|
| SV-11691 | 80141 | QA_found, QAcomplete, calculation, reports | Bilal Muzamil, Mudassir Qamar | QA Complete |
| SV-11820 | 80142 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11821 | 80143 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11823 | 80144 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11824 | 80145 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11825 | 80140 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11826 | 80146 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11827 | 80147 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11828 | 80148 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11829 | 80149 | QAcomplete | Bilal, Mudassir | QA Complete |
| SV-11931 | 80150 (edited once to fix the order of a worked sum) | QAcomplete | Bilal | QA Complete |
| SV-11934 | 80151 | QAcomplete | Bilal | QA Complete |

## Not written (left in TESTING QA, no comment)

- **SV-11822**: the ticket's own condition (DVI Test) does not exist on sv11839. It was neither a pass nor a fail, so it is held for the QA lead.
- **SV-11885**: 8 of the 11 downloads were checked and passed. Vendor Credit Memo, Journal Entry, Sales Representative Assignments, QuickBooks and the tab/carriage-return part were not verified. Partial scope, so it is held for the QA lead.

No ticket failed, so no Rejected from Testing transition was made and no failure picture was needed.

No new ticket was filed: the two separate issues need a source first (see `RESULTS.md`).
