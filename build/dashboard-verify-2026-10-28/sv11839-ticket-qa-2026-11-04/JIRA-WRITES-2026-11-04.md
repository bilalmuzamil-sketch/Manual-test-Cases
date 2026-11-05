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

## Follow-up, 5 Nov 2026 (≈03:55 UTC): SV-11885

The QA lead pointed me at the "6. Test Tickets" session (facts only, Rule 98). Its notes plus the product code explained the three gaps:
- **Vendor Credit Memo** lists only credits made through Parts → Returns.
- **Sales rep:** the customer's rep is saved as first/last name text.
- **Journal Entry:** the description always starts "Inventory …", so only the Location cells can start with = + - @.

The worker re-tested on 5 Nov, 03:20–03:45 UTC. Every one of the 11 downloads guards with exactly one apostrophe, including Location columns and a leading tab or carriage return. No unguarded cell, no double apostrophe, no number touched.

Test Location was renamed for 79 s. The read-back after restore is identical to the original record. QuickBooks was skipped on the QA lead's instruction.

Verified from committed evidence before writing (Rule 86):
- `SV-11885/raw-bytes-test-records-2026-11-05.txt`
- `scan-test-location-2026-11-05.json` (0 unguarded / 0 double / 0 guarded numbers)
- `evidence-test-location-rename.json` (`record_identical_after_restore: true`)

| Ticket | Comment id | Labels after | QA Assignee after | Status after |
|---|---|---|---|---|
| SV-11885 | 80170 | QAcomplete | Ayesha Khan, Bilal Muzamil | QA Complete |

Read-back by JQL (`labels = QAcomplete AND cf[10385] = Bilal AND cf[10385] = Ayesha AND status = "QA Complete"`) returned SV-11885. The MCP read tools stopped echoing labels and custom fields on 5 Nov, so JQL is the check now.

**Totals for the 14:** 13 QA Complete, 1 held (SV-11822).

## 5 Nov 2026: questions to Chris Ward (QA lead's instruction: "Send a comment to Chris in Jira, in a layman non technical format ... very concise")
| Ticket | Comment id | Question |
|---|---|---|
| SV-11691 | 80171 | A credit given today shows as "1-30 Days" late in A/R Aging, while a same-day invoice shows "Current". Fix or leave? |
| SV-11885 | 80172 | Export Reports with nothing to export gives no file and no message. Fix or leave? |
Both @mention Chris Ward (712020:aa00b8d6-…). Checked before posting: the A/R Aging picture `SV-11691/5-ar-aging-summary-wellington.png` (row ZZAUTOTEST QA11839 Credit: Current $185.58, 1-30 Days $-25.00) and the empty-export repro of 4 and 5 Nov.

## 5 Nov 2026 (≈05:10 UTC): SV-11822 passed, plus a deploy request
- **SV-11822:** comment 80173; labels → QAcomplete; QA Assignee → Mudassir Qamar + Bilal Muzamil; transition 10 → QA Complete.
  - JQL read-back returned it.
  - Evidence (Rule 86 check): `SV-11822/evidence-DVI-1536x936.json` (all checks visible + on screen + 4 items), `evidence-DVI-1920x1080.json`, `evidence-LB-1536x936.json`, `rule99_at_checks_all_match: true`.
  - DVI Test copied from staging; created on sv11839 with id 93404b24-…, left in place.
- **SV-12199:** comment 80174 to Milomir. sv11839 still runs v26.45.0-aacb66c, which predates the SV-12199/12201/12202 fixes (c93ba940d, da8754eca, 277b24901 on branch SV-11839). Asked him to deploy.

**Totals for the original 14:** all 14 QA Complete.

## 5 Nov 2026 (≈06:39 UTC): Milomir's four new TESTING QA tickets, build v26.45.0-277b249
Verdicts checked against committed evidence first (Rule 86), from `../sv11839-ticket-qa-2026-11-05/`:
- 12199: `customer-invoice-today-extract.csv`, Terms COD.
- 12201: `payroll-timesheet-today-extract.csv`, 2.00.
- 12146: `step-read-after-pay2.json` (−$100.00 Applied twice), `remittance-after-payment-1-text.txt`, and `FAIL-annotated.png`, opened by hand.

| Ticket | Comment id | Labels after | QA Assignee after | Status after |
|---|---|---|---|---|
| SV-12199 | 80178 | QAcomplete | Bilal Muzamil | QA Complete |
| SV-12201 | 80179 | QAcomplete | Bilal Muzamil | QA Complete |
| SV-12146 | 80180, layman comment with the annotated picture embedded (upload size 254858 = file size) | unchanged | unchanged | REJECTED FROM TESTING (transition 15) |

Read-back by JQL (`labels = QAcomplete AND cf[10385] = Bilal AND status = "QA Complete"`) returned SV-12199 and SV-12201.
SV-12202 is pending: the after-midnight Last Sale read runs at 07:05 UTC.

## 5 Nov 2026: SV-11822 reopened by Mudassir Qamar (comment 80176)
- The QA lead deleted our "QA passed" comment 80173. The ticket is now REJECTED FROM TESTING.
- QAcomplete and QA Assignee from our 05:10 write are still on it. This was not changed: it is the QA lead's call.
- Retest: `../sv11839-ticket-qa-2026-11-05/SV-11822-retest/RESULT.md`. 24 checks at DPR 1.25 on sv11839 and staging opened the list every time.
