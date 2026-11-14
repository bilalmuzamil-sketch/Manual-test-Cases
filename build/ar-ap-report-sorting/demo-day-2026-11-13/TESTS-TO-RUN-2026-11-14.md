# A/R and A/P: tests to run (changed on 14 Nov 2026)

Run 557 "A/R and A/P Report Sorting, Export and Location Filter - Execution": https://shopview.testrail.io/index.php?/runs/view/557
All 14 are new cases (Demo Day, 13 Nov 2026), Untested, assigned to Mudassir, in folder "Setup needed before testing".
Each creates its own customer or vendor with a long name; read the preconditions first.

| Case | Title | Test in run 557 | Case | Expected today |
|---|---|---|---|---|
| D-82 | Design: A/R Customer menu keeps a long no-space name inside its row | https://shopview.testrail.io/index.php?/tests/view/4877787 | C1145247 | fails, SV-12722 |
| D-83 | Design: A/P Vendor menu keeps a long no-space name inside its row | https://shopview.testrail.io/index.php?/tests/view/4877788 | C1145248 | |
| D-84 | Design: A/R Summary with a long no-space customer name shows every column | https://shopview.testrail.io/index.php?/tests/view/4877789 | C1145249 | |
| D-85 | Design: A/P Summary with a long no-space vendor name shows every column | https://shopview.testrail.io/index.php?/tests/view/4877790 | C1145250 | |
| D-86 | Design: A/R Detail with a long no-space customer name shows every column | https://shopview.testrail.io/index.php?/tests/view/4877791 | C1145251 | |
| D-87 | Design: A/P Detail with a long no-space vendor name shows every column | https://shopview.testrail.io/index.php?/tests/view/4877792 | C1145252 | |
| D-88 | Design: A/R Collection with a long no-space customer name shows every column | https://shopview.testrail.io/index.php?/tests/view/4877793 | C1145253 | fails, SV-12764 |
| D-89 | Design: A/P Unpaid Invoices with a 78-character vendor name shows every column | https://shopview.testrail.io/index.php?/tests/view/4877794 | C1145254 | |
| D-90 | Design: A/R Detail columns stay in place when buckets open and close | https://shopview.testrail.io/index.php?/tests/view/4877795 | C1145255 | fails, SV-12763 |
| D-91 | Design: A/R Collection columns stay in place when groups open and close | https://shopview.testrail.io/index.php?/tests/view/4877796 | C1145256 | fails, SV-12763 |
| D-92 | Design: A/P Detail columns stay in place when buckets open and close | https://shopview.testrail.io/index.php?/tests/view/4877797 | C1145257 | fails, SV-12763 |
| D-93 | Design: A/P Unpaid Invoices columns stay in place when groups open and close | https://shopview.testrail.io/index.php?/tests/view/4877798 | C1145258 | fails, SV-12763 |
| D-94 | Design: A/R Detail columns stay in place while more lines load | https://shopview.testrail.io/index.php?/tests/view/4877799 | C1145259 | fails, SV-12763 |
| D-95 | Design: A/R Collection PDF wraps a long no-space name in its Total row | https://shopview.testrail.io/index.php?/tests/view/4877800 | C1145260 | |

Still to come: the cases rewritten for PRD version 13 (about 70, being drafted 14 Nov 2026); their links are added here after the QA lead approves the write.

## 14 Nov 2026 (later): PRD version 13, the 14 changed cases and the 8 new cases (written; QA lead: "Only the 14 + 8")

The 14 changed cases still show their 11-12 Nov result (Passed) in run 557, but what the tester does or sees has changed, so run them again. The 8 new cases are Untested. All 22 are assigned to Mudassir.

| Key | Case | Test in run 557 | Title |
|---|---|---|---|
| D-16 | [C715496](https://shopview.testrail.io/index.php?/cases/view/715496) | [T4563641](https://shopview.testrail.io/index.php?/tests/view/4563641) | Design: A/P Unpaid Invoices at 1440 px in light theme shows every column |
| D-18 | [C715498](https://shopview.testrail.io/index.php?/cases/view/715498) | [T4563643](https://shopview.testrail.io/index.php?/tests/view/4563643) | Design: A/P Unpaid Invoices at 1536 px: no overlap or clipping, light and dark |
| D-25 | [C715505](https://shopview.testrail.io/index.php?/cases/view/715505) | [T4563650](https://shopview.testrail.io/index.php?/tests/view/4563650) | Design: A/R Detail chevron button, tooltips and pinned group row |
| D-26 | [C715506](https://shopview.testrail.io/index.php?/cases/view/715506) | [T4563651](https://shopview.testrail.io/index.php?/tests/view/4563651) | Design: A/R Collection chevron button, tooltips and pinned group row |
| D-27 | [C715507](https://shopview.testrail.io/index.php?/cases/view/715507) | [T4563652](https://shopview.testrail.io/index.php?/tests/view/4563652) | Design: A/P Detail chevron button, tooltips and pinned group row |
| D-28 | [C715508](https://shopview.testrail.io/index.php?/cases/view/715508) | [T4563653](https://shopview.testrail.io/index.php?/tests/view/4563653) | Design: A/P Unpaid Invoices chevron button, tooltips and pinned group row |
| D-56 | [C715538](https://shopview.testrail.io/index.php?/cases/view/715538) | [T4563681](https://shopview.testrail.io/index.php?/tests/view/4563681) | Design: A/R Collection after Expand all matches the design picture |
| D-58 | [C715540](https://shopview.testrail.io/index.php?/cases/view/715540) | [T4563683](https://shopview.testrail.io/index.php?/tests/view/4563683) | Design: A/P Unpaid Invoices pinned vendor row matches the design pictures |
| D-59 | [C715541](https://shopview.testrail.io/index.php?/cases/view/715541) | [T4563684](https://shopview.testrail.io/index.php?/tests/view/4563684) | Design: A/R Collection with groups closed matches the pictures in both themes |
| D-62 | [C715544](https://shopview.testrail.io/index.php?/cases/view/715544) | [T4563687](https://shopview.testrail.io/index.php?/tests/view/4563687) | Design: A/P Unpaid Invoices at 1440 px shows every column, as pictured |
| DATA-27 | [C1062589](https://shopview.testrail.io/index.php?/cases/view/1062589) | [T4667055](https://shopview.testrail.io/index.php?/tests/view/4667055) | A/P Unpaid Invoices: 101 bills count and add up before all are shown |
| S1-21 | [C1062570](https://shopview.testrail.io/index.php?/cases/view/1062570) | [T4667037](https://shopview.testrail.io/index.php?/tests/view/4667037) | A/R Collection: a customer with over 100 documents shows 100 at a time |
| S1-22 | [C1062571](https://shopview.testrail.io/index.php?/cases/view/1062571) | [T4667038](https://shopview.testrail.io/index.php?/tests/view/4667038) | A/P Unpaid Invoices: a vendor with over 100 bills shows 100 at a time |
| S5-37 | [C715579](https://shopview.testrail.io/index.php?/cases/view/715579) | [T4563708](https://shopview.testrail.io/index.php?/tests/view/4563708) | A/P Detail: a date after today ages a bill to that day |
| S3-33 | [C1145292](https://shopview.testrail.io/index.php?/cases/view/1145292) | [T4888593](https://shopview.testrail.io/index.php?/tests/view/4888593) | A/R Detail: the PDF ends each bucket with its "Total for" row |
| S3-35 | [C1145293](https://shopview.testrail.io/index.php?/cases/view/1145293) | [T4888594](https://shopview.testrail.io/index.php?/tests/view/4888594) | A/P Detail: the PDF ends each bucket with its "Total for" row |
| S3-34 | [C1145294](https://shopview.testrail.io/index.php?/cases/view/1145294) | [T4888595](https://shopview.testrail.io/index.php?/tests/view/4888595) | A/R Collection: the PDF ends each customer with its "Total for" row |
| S3-36 | [C1145295](https://shopview.testrail.io/index.php?/cases/view/1145295) | [T4888596](https://shopview.testrail.io/index.php?/tests/view/4888596) | A/P Unpaid Invoices: the PDF ends each vendor with its "Total for" row |
| S5-43 | [C1145296](https://shopview.testrail.io/index.php?/cases/view/1145296) | [T4888597](https://shopview.testrail.io/index.php?/tests/view/4888597) | A/R Detail: the PDF and CSV print an as-of date after today |
| S5-41b | [C1145297](https://shopview.testrail.io/index.php?/cases/view/1145297) | [T4888598](https://shopview.testrail.io/index.php?/tests/view/4888598) | A/R Detail: a new as-of date with one location left hides the chip |
| S2-51 | [C1145298](https://shopview.testrail.io/index.php?/cases/view/1145298) | [T4888599](https://shopview.testrail.io/index.php?/tests/view/4888599) | A/R Summary: a blank bucket cell stays at the bottom in both sort orders |
| S2-52 | [C1145299](https://shopview.testrail.io/index.php?/cases/view/1145299) | [T4888600](https://shopview.testrail.io/index.php?/tests/view/4888600) | A/P Summary: a blank bucket cell stays at the bottom in both sort orders |

Copy-paste list (test links):

"https://shopview.testrail.io/index.php?/tests/view/4563641", "https://shopview.testrail.io/index.php?/tests/view/4563643", "https://shopview.testrail.io/index.php?/tests/view/4563650", "https://shopview.testrail.io/index.php?/tests/view/4563651", "https://shopview.testrail.io/index.php?/tests/view/4563652", "https://shopview.testrail.io/index.php?/tests/view/4563653", "https://shopview.testrail.io/index.php?/tests/view/4563681", "https://shopview.testrail.io/index.php?/tests/view/4563683", "https://shopview.testrail.io/index.php?/tests/view/4563684", "https://shopview.testrail.io/index.php?/tests/view/4563687", "https://shopview.testrail.io/index.php?/tests/view/4667055", "https://shopview.testrail.io/index.php?/tests/view/4667037", "https://shopview.testrail.io/index.php?/tests/view/4667038", "https://shopview.testrail.io/index.php?/tests/view/4563708", "https://shopview.testrail.io/index.php?/tests/view/4888593", "https://shopview.testrail.io/index.php?/tests/view/4888594", "https://shopview.testrail.io/index.php?/tests/view/4888595", "https://shopview.testrail.io/index.php?/tests/view/4888596", "https://shopview.testrail.io/index.php?/tests/view/4888597", "https://shopview.testrail.io/index.php?/tests/view/4888598", "https://shopview.testrail.io/index.php?/tests/view/4888599", "https://shopview.testrail.io/index.php?/tests/view/4888600"
