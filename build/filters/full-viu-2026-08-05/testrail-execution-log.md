# TestRail execution log — Filters full live VIU, 2026-08-05

**Sources read at pass start: 2026-08-05T19:53:00Z. Sources RE-READ at write start: 2026-08-05T21:34:18Z (Standing Rule 59). Verdict of the second read: UNCHANGED** — build `index.html` byte-identical by sha256 to the pass-start copy, Filters spec still Confluence version 18 (last edited 2026-08-04T18:19:21Z), and every cited ticket at the status the ledger assumes (SV-8843 OBSOLETE, SV-8845 Open, SV-8847 OBSOLETE, SV-8871 Open, SV-8875 Open, SV-8846 Open, SV-8828 OBSOLETE, SV-8832 Open, SV-8883 Open, SV-8912 Open).

## What was written

**110 × `update_case`, on 110 distinct cases. 0 `add_case` · 0 `delete_case` · 0 section changes · 0 run writes · no result logged anywhere.**

Every operation sent **all four fields — `custom_preconds`, `custom_steps`, `custom_expected` and `refs`**. All three text fields go on every payload deliberately: TestRail re-renders any text field omitted from the payload through its HTML pipeline (playbook §J normalisation #3), and this project shows markup literally to the tester.

`refs` is verified under the one declared server transformation — TestRail splits on commas, trims each entry and rejoins with a bare comma — so the comparison is made under `','.join(p.strip() for p in s.split(','))`. Longest single entry after the edit is well inside the 248-character limit that returns HTTP 400.

## Per-operation record

| # | Operation | Case | HTTP | Verification |
|---|---|---|---|---|
| 1 | update_case | C29557 | 200 | MATCH — update_case C29557: 30 fields compared, 4 intended, 0 mismatch |
| 2 | update_case | C29558 | 200 | MATCH — update_case C29558: 30 fields compared, 4 intended, 0 mismatch |
| 3 | update_case | C29559 | 200 | MATCH — update_case C29559: 30 fields compared, 4 intended, 0 mismatch |
| 4 | update_case | C29560 | 200 | MATCH — update_case C29560: 30 fields compared, 4 intended, 0 mismatch |
| 5 | update_case | C29561 | 200 | MATCH — update_case C29561: 30 fields compared, 4 intended, 0 mismatch |
| 6 | update_case | C29562 | 200 | MATCH — update_case C29562: 30 fields compared, 4 intended, 0 mismatch |
| 7 | update_case | C29563 | 200 | MATCH — update_case C29563: 30 fields compared, 4 intended, 0 mismatch |
| 8 | update_case | C29564 | 200 | MATCH — update_case C29564: 30 fields compared, 4 intended, 0 mismatch |
| 9 | update_case | C29565 | 200 | MATCH — update_case C29565: 30 fields compared, 4 intended, 0 mismatch |
| 10 | update_case | C29566 | 200 | MATCH — update_case C29566: 30 fields compared, 4 intended, 0 mismatch |
| 11 | update_case | C29567 | 200 | MATCH — update_case C29567: 30 fields compared, 4 intended, 0 mismatch |
| 12 | update_case | C29568 | 200 | MATCH — update_case C29568: 30 fields compared, 4 intended, 0 mismatch |
| 13 | update_case | C29569 | 200 | MATCH — update_case C29569: 30 fields compared, 4 intended, 0 mismatch |
| 14 | update_case | C29570 | 200 | MATCH — update_case C29570: 30 fields compared, 4 intended, 0 mismatch |
| 15 | update_case | C29571 | 200 | MATCH — update_case C29571: 30 fields compared, 4 intended, 0 mismatch |
| 16 | update_case | C29572 | 200 | MATCH — update_case C29572: 30 fields compared, 4 intended, 0 mismatch |
| 17 | update_case | C29573 | 200 | MATCH — update_case C29573: 30 fields compared, 4 intended, 0 mismatch |
| 18 | update_case | C29574 | 200 | MATCH — update_case C29574: 30 fields compared, 4 intended, 0 mismatch |
| 19 | update_case | C29575 | 200 | MATCH — update_case C29575: 30 fields compared, 4 intended, 0 mismatch |
| 20 | update_case | C29576 | 200 | MATCH — update_case C29576: 30 fields compared, 4 intended, 0 mismatch |
| 21 | update_case | C29577 | 200 | MATCH — update_case C29577: 30 fields compared, 4 intended, 0 mismatch |
| 22 | update_case | C29578 | 200 | MATCH — update_case C29578: 30 fields compared, 4 intended, 0 mismatch |
| 23 | update_case | C29579 | 200 | MATCH — update_case C29579: 30 fields compared, 4 intended, 0 mismatch |
| 24 | update_case | C29580 | 200 | MATCH — update_case C29580: 30 fields compared, 4 intended, 0 mismatch |
| 25 | update_case | C29581 | 200 | MATCH — update_case C29581: 30 fields compared, 4 intended, 0 mismatch |
| 26 | update_case | C29582 | 200 | MATCH — update_case C29582: 30 fields compared, 4 intended, 0 mismatch |
| 27 | update_case | C29583 | 200 | MATCH — update_case C29583: 30 fields compared, 4 intended, 0 mismatch |
| 28 | update_case | C29584 | 200 | MATCH — update_case C29584: 30 fields compared, 4 intended, 0 mismatch |
| 29 | update_case | C29585 | 200 | MATCH — update_case C29585: 30 fields compared, 4 intended, 0 mismatch |
| 30 | update_case | C29586 | 200 | MATCH — update_case C29586: 30 fields compared, 4 intended, 0 mismatch |
| 31 | update_case | C29587 | 200 | MATCH — update_case C29587: 30 fields compared, 4 intended, 0 mismatch |
| 32 | update_case | C29588 | 200 | MATCH — update_case C29588: 30 fields compared, 4 intended, 0 mismatch |
| 33 | update_case | C29589 | 200 | MATCH — update_case C29589: 30 fields compared, 4 intended, 0 mismatch |
| 34 | update_case | C29590 | 200 | MATCH — update_case C29590: 30 fields compared, 4 intended, 0 mismatch |
| 35 | update_case | C29591 | 200 | MATCH — update_case C29591: 30 fields compared, 4 intended, 0 mismatch |
| 36 | update_case | C29592 | 200 | MATCH — update_case C29592: 30 fields compared, 4 intended, 0 mismatch |
| 37 | update_case | C29593 | 200 | MATCH — update_case C29593: 30 fields compared, 4 intended, 0 mismatch |
| 38 | update_case | C29594 | 200 | MATCH — update_case C29594: 30 fields compared, 4 intended, 0 mismatch |
| 39 | update_case | C29595 | 200 | MATCH — update_case C29595: 30 fields compared, 4 intended, 0 mismatch |
| 40 | update_case | C29596 | 200 | MATCH — update_case C29596: 30 fields compared, 4 intended, 0 mismatch |
| 41 | update_case | C29597 | 200 | MATCH — update_case C29597: 30 fields compared, 4 intended, 0 mismatch |
| 42 | update_case | C29598 | 200 | MATCH — update_case C29598: 30 fields compared, 4 intended, 0 mismatch |
| 43 | update_case | C29599 | 200 | MATCH — update_case C29599: 30 fields compared, 4 intended, 0 mismatch |
| 44 | update_case | C29600 | 200 | MATCH — update_case C29600: 30 fields compared, 4 intended, 0 mismatch |
| 45 | update_case | C29601 | 200 | MATCH — update_case C29601: 30 fields compared, 4 intended, 0 mismatch |
| 46 | update_case | C29602 | 200 | MATCH — update_case C29602: 30 fields compared, 4 intended, 0 mismatch |
| 47 | update_case | C29603 | 200 | MATCH — update_case C29603: 30 fields compared, 4 intended, 0 mismatch |
| 48 | update_case | C29604 | 200 | MATCH — update_case C29604: 30 fields compared, 4 intended, 0 mismatch |
| 49 | update_case | C29605 | 200 | MATCH — update_case C29605: 30 fields compared, 4 intended, 0 mismatch |
| 50 | update_case | C29606 | 200 | MATCH — update_case C29606: 30 fields compared, 4 intended, 0 mismatch |
| 51 | update_case | C29607 | 200 | MATCH — update_case C29607: 30 fields compared, 4 intended, 0 mismatch |
| 52 | update_case | C29608 | 200 | MATCH — update_case C29608: 30 fields compared, 4 intended, 0 mismatch |
| 53 | update_case | C29609 | 200 | MATCH — update_case C29609: 30 fields compared, 4 intended, 0 mismatch |
| 54 | update_case | C29610 | 200 | MATCH — update_case C29610: 30 fields compared, 4 intended, 0 mismatch |
| 55 | update_case | C29611 | 200 | MATCH — update_case C29611: 30 fields compared, 4 intended, 0 mismatch |
| 56 | update_case | C29612 | 200 | MATCH — update_case C29612: 30 fields compared, 4 intended, 0 mismatch |
| 57 | update_case | C29613 | 200 | MATCH — update_case C29613: 30 fields compared, 4 intended, 0 mismatch |
| 58 | update_case | C29614 | 200 | MATCH — update_case C29614: 30 fields compared, 4 intended, 0 mismatch |
| 59 | update_case | C29615 | 200 | MATCH — update_case C29615: 30 fields compared, 4 intended, 0 mismatch |
| 60 | update_case | C29616 | 200 | MATCH — update_case C29616: 30 fields compared, 4 intended, 0 mismatch |
| 61 | update_case | C29617 | 200 | MATCH — update_case C29617: 30 fields compared, 4 intended, 0 mismatch |
| 62 | update_case | C29618 | 200 | MATCH — update_case C29618: 30 fields compared, 4 intended, 0 mismatch |
| 63 | update_case | C29619 | 200 | MATCH — update_case C29619: 30 fields compared, 4 intended, 0 mismatch |
| 64 | update_case | C29620 | 200 | MATCH — update_case C29620: 30 fields compared, 4 intended, 0 mismatch |
| 65 | update_case | C29621 | 200 | MATCH — update_case C29621: 30 fields compared, 4 intended, 0 mismatch |
| 66 | update_case | C29622 | 200 | MATCH — update_case C29622: 30 fields compared, 4 intended, 0 mismatch |
| 67 | update_case | C29623 | 200 | MATCH — update_case C29623: 30 fields compared, 4 intended, 0 mismatch |
| 68 | update_case | C29624 | 200 | MATCH — update_case C29624: 30 fields compared, 4 intended, 0 mismatch |
| 69 | update_case | C29625 | 200 | MATCH — update_case C29625: 30 fields compared, 4 intended, 0 mismatch |
| 70 | update_case | C29626 | 200 | MATCH — update_case C29626: 30 fields compared, 4 intended, 0 mismatch |
| 71 | update_case | C29627 | 200 | MATCH — update_case C29627: 30 fields compared, 4 intended, 0 mismatch |
| 72 | update_case | C29628 | 200 | MATCH — update_case C29628: 30 fields compared, 4 intended, 0 mismatch |
| 73 | update_case | C29629 | 200 | MATCH — update_case C29629: 30 fields compared, 4 intended, 0 mismatch |
| 74 | update_case | C29630 | 200 | MATCH — update_case C29630: 30 fields compared, 4 intended, 0 mismatch |
| 75 | update_case | C29631 | 200 | MATCH — update_case C29631: 30 fields compared, 4 intended, 0 mismatch |
| 76 | update_case | C29632 | 200 | MATCH — update_case C29632: 30 fields compared, 4 intended, 0 mismatch |
| 77 | update_case | C29633 | 200 | MATCH — update_case C29633: 30 fields compared, 4 intended, 0 mismatch |
| 78 | update_case | C29634 | 200 | MATCH — update_case C29634: 30 fields compared, 4 intended, 0 mismatch |
| 79 | update_case | C29635 | 200 | MATCH — update_case C29635: 30 fields compared, 4 intended, 0 mismatch |
| 80 | update_case | C38876 | 200 | MATCH — update_case C38876: 30 fields compared, 4 intended, 0 mismatch |
| 81 | update_case | C38877 | 200 | MATCH — update_case C38877: 30 fields compared, 4 intended, 0 mismatch |
| 82 | update_case | C38878 | 200 | MATCH — update_case C38878: 30 fields compared, 4 intended, 0 mismatch |
| 83 | update_case | C38879 | 200 | MATCH — update_case C38879: 30 fields compared, 4 intended, 0 mismatch |
| 84 | update_case | C38880 | 200 | MATCH — update_case C38880: 30 fields compared, 4 intended, 0 mismatch |
| 85 | update_case | C38881 | 200 | MATCH — update_case C38881: 30 fields compared, 4 intended, 0 mismatch |
| 86 | update_case | C38882 | 200 | MATCH — update_case C38882: 30 fields compared, 4 intended, 0 mismatch |
| 87 | update_case | C38883 | 200 | MATCH — update_case C38883: 30 fields compared, 4 intended, 0 mismatch |
| 88 | update_case | C38884 | 200 | MATCH — update_case C38884: 30 fields compared, 4 intended, 0 mismatch |
| 89 | update_case | C38886 | 200 | MATCH — update_case C38886: 30 fields compared, 4 intended, 0 mismatch |
| 90 | update_case | C38888 | 200 | MATCH — update_case C38888: 30 fields compared, 4 intended, 0 mismatch |
| 91 | update_case | C38889 | 200 | MATCH — update_case C38889: 30 fields compared, 4 intended, 0 mismatch |
| 92 | update_case | C38891 | 200 | MATCH — update_case C38891: 30 fields compared, 4 intended, 0 mismatch |
| 93 | update_case | C38893 | 200 | MATCH — update_case C38893: 30 fields compared, 4 intended, 0 mismatch |
| 94 | update_case | C38895 | 200 | MATCH — update_case C38895: 30 fields compared, 4 intended, 0 mismatch |
| 95 | update_case | C38896 | 200 | MATCH — update_case C38896: 30 fields compared, 4 intended, 0 mismatch |
| 96 | update_case | C38897 | 200 | MATCH — update_case C38897: 30 fields compared, 4 intended, 0 mismatch |
| 97 | update_case | C38898 | 200 | MATCH — update_case C38898: 30 fields compared, 4 intended, 0 mismatch |
| 98 | update_case | C38899 | 200 | MATCH — update_case C38899: 30 fields compared, 4 intended, 0 mismatch |
| 99 | update_case | C38900 | 200 | MATCH — update_case C38900: 30 fields compared, 4 intended, 0 mismatch |
| 100 | update_case | C38901 | 200 | MATCH — update_case C38901: 30 fields compared, 4 intended, 0 mismatch |
| 101 | update_case | C38902 | 200 | MATCH — update_case C38902: 30 fields compared, 4 intended, 0 mismatch |
| 102 | update_case | C38903 | 200 | MATCH — update_case C38903: 30 fields compared, 4 intended, 0 mismatch |
| 103 | update_case | C38904 | 200 | MATCH — update_case C38904: 30 fields compared, 4 intended, 0 mismatch |
| 104 | update_case | C38905 | 200 | MATCH — update_case C38905: 30 fields compared, 4 intended, 0 mismatch |
| 105 | update_case | C38906 | 200 | MATCH — update_case C38906: 30 fields compared, 4 intended, 0 mismatch |
| 106 | update_case | C38907 | 200 | MATCH — update_case C38907: 30 fields compared, 4 intended, 0 mismatch |
| 107 | update_case | C38908 | 200 | MATCH — update_case C38908: 30 fields compared, 4 intended, 0 mismatch |
| 108 | update_case | C38909 | 200 | MATCH — update_case C38909: 30 fields compared, 4 intended, 0 mismatch |
| 109 | update_case | C38910 | 200 | MATCH — update_case C38910: 30 fields compared, 4 intended, 0 mismatch |
| 110 | update_case | C38911 | 200 | MATCH — update_case C38911: 30 fields compared, 4 intended, 0 mismatch |

**Totals: 110 operations, 110 × HTTP 200, 110 × byte-verified MATCH, 30 fields compared each, 0 mismatches, 0 collateral changes.** No operation was retried and none failed, so the Rule-50 stop-the-batch path was never taken.

