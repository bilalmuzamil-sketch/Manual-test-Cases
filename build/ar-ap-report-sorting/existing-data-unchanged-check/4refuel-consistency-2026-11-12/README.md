# 4Refuel bills: does the new A/P report match the app's own open bills? (12 Nov 2026, staging, Rule 120)

**Answer: yes, bill for bill, and the three "missing" bills were PAID by the E2E automation after the "before" snapshot.**

| Location | Report's 4Refuel bills (new A/P Aging Detail, as of 11/12/2026, 16:52Z) | App's open bills (vendor's unpaid list, read at that location) | Same |
|---|---|---|---|
| Staging Heavy Duty - 9919 | 373 | 373 (+21 bills with a $0.00 balance, nothing to age) | 373 |
| Staging Lethbridge - 4310 | 209 | 209 | 209 |

The three bills (`payments-lethbridge.json`, 4Refuel's Lethbridge vendor account, read 17:20Z as tech/Admin at Lethbridge):

| Bill | Paid | Payment | Reference (time it encodes) |
|---|---|---|---|
| E2E-INV-1794217548388 | $100.00, paid in full, 12 Nov 2026, Cash | "E2E auto-payment (fixture)" | E2E-PAY-1794467869273 (07:17:49Z) |
| E2E-P8197vr | $100.00, paid in full, 12 Nov 2026, Cash | "E2E auto-payment (fixture)" | E2E-PAY-1794470719152 (08:05:19Z) |
| E2E-Pitcq2q | $100.00, paid in full, 12 Nov 2026, Cash | "E2E auto-payment (fixture)" | E2E-PAY-1794480113000 (10:41:53Z) |

All three were paid after the staging "before" snapshot (06:46Z) and before the "after" check, so the report was right to
leave them out. **Not a bug, not the feature.**

**Our own mistake, corrected (Rule 120):** the vendor account is per location (`ListUnpaidByVendorAccountQueryHandler`
filters `va.workplace_id` by the active location). The 15:39Z payment search and the 16:55Z Lethbridge unpaid read used the
HEAVY DUTY account id at Lethbridge, so they read 0 payments / 0 bills. That "empty Lethbridge list" was our method, not
staging. `check_4refuel.py` now reads the account id at each location. Also: the bills are $100.00 each, not $1.00.
