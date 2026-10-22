# A/R and A/P Report Sorting — question sheet for Chris Ward (22 Oct 2026)

Sheet: https://docs.google.com/spreadsheets/d/11_3z_TpKkOL-MiAWqxrj1jlHP1rn9QXu_h3uCR0SjVA (tab "Questions for Chris", rows 6-15, questions 1-10). Shared with chris.w@shopview.com as Editor on 22 Oct 2026 (QA lead's order). Values read back after writing; permissions read back (chris.w writer, bilal.muzamil owner).

## QA mapping (not for the PO)

| # | Question | Cases that wait on it or name it | Held? |
|---|---|---|---|
| 1 | name order when two names differ only by an accent | [C715279](https://shopview.testrail.io/index.php?/cases/view/715279) (S1-07) | yes |
| 2 | first click on the ID or No. column | [C715297](https://shopview.testrail.io/index.php?/cases/view/715297) (S2-10), [C715301](https://shopview.testrail.io/index.php?/cases/view/715301) (S2-14), [C715305](https://shopview.testrail.io/index.php?/cases/view/715305) (S2-18), [C715309](https://shopview.testrail.io/index.php?/cases/view/715309) (S2-22) | no |
| 3 | rows that tie when a sort is reversed | [C715297](https://shopview.testrail.io/index.php?/cases/view/715297) (S2-10), [C715301](https://shopview.testrail.io/index.php?/cases/view/715301) (S2-14), [C715305](https://shopview.testrail.io/index.php?/cases/view/715305) (S2-18), [C715309](https://shopview.testrail.io/index.php?/cases/view/715309) (S2-22) | no |
| 4 | capital letters in the A/R column headings | [C715484](https://shopview.testrail.io/index.php?/cases/view/715484) (D-04), [C715487](https://shopview.testrail.io/index.php?/cases/view/715487) (D-07) | no |
| 5 | reaching the next 30 customers or vendors | [C715358](https://shopview.testrail.io/index.php?/cases/view/715358) (S4-05), [C715359](https://shopview.testrail.io/index.php?/cases/view/715359) (S4-06), [C715366](https://shopview.testrail.io/index.php?/cases/view/715366) (S4-13), [C715367](https://shopview.testrail.io/index.php?/cases/view/715367) (S4-14), [C715450](https://shopview.testrail.io/index.php?/cases/view/715450) (DATA-01), [C715451](https://shopview.testrail.io/index.php?/cases/view/715451) (DATA-02), [C715452](https://shopview.testrail.io/index.php?/cases/view/715452) (DATA-03), [C715453](https://shopview.testrail.io/index.php?/cases/view/715453) (DATA-04) | no |
| 6 | does the Past due filter keep the sort? | [C715322](https://shopview.testrail.io/index.php?/cases/view/715322) (S2-35) | yes |
| 7 | the filter lines at the top of the PDF and the CSV | [C715343](https://shopview.testrail.io/index.php?/cases/view/715343) (S3-17) | no |
| 8 | CSV column headings for the aging bucket and the customer or vendor | [C715346](https://shopview.testrail.io/index.php?/cases/view/715346) (S3-20), [C715347](https://shopview.testrail.io/index.php?/cases/view/715347) (S3-21), [C715348](https://shopview.testrail.io/index.php?/cases/view/715348) (S3-22), [C715349](https://shopview.testrail.io/index.php?/cases/view/715349) (S3-23) | no |
| 9 | do the Summary and Detail totals agree, and are the figures current? | [C715463](https://shopview.testrail.io/index.php?/cases/view/715463) (DATA-14), [C715464](https://shopview.testrail.io/index.php?/cases/view/715464) (DATA-15) | yes |
| 10 | three Jira stories differ from the spec | — | no |

## Dropped before sending (skill 07 §6: answerable by our own sources or self-service)

- **summary-name-col**: Only the Location column is renamed (What changes for existing users); every other heading stays as today.
- **groups-open**: The PRD does not change how the grouped reports open (S4-R5: behaviour unchanged), so they open as today.
- **link-format**: A tester copies the address after ticking and edits only the list; the wording of the address is a developer detail.
- **chip-one**: The chips are the native ones, exactly as on Sales By Customer (S5-R2, S5-R13): one ticked name reads as it does there.
- **chip-long**: Same native chips: names are shortened at the same length as on Sales By Customer.
- **limits-data**: The PDF 2,000 / 2,001 boundary is reachable on the QA organization with the Vendor filter; the 2,000-customer and 50,000-row boundaries are in the developers' own check tasks (SV-11595, SV-11598).
- **credit-asof**: Out of scope for this release (SV-11441), so today's behaviour must not change (Rule 96); the check stays.
- **overpaid**: Self-service first: the setup records a payment larger than the invoice on the test site; only if the site refuses do we ask.
