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
