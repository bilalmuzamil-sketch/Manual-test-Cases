# 4Refuel bills: does the new A/P report match the app's own open bills? (12 Nov 2026, staging, Rule 120)

| Read | Where | Result |
|---|---|---|
| 15:38Z (tech as Admin, location switch proved) | Lethbridge, vendor's unpaid list | 209 bills; the 3 missing bills NOT in it; control E2E-INV-1791977645410 in it |
| 16:52Z `report.json` | new A/P Aging Detail, org-wide, as of 11/12/2026 | 597 4Refuel rows: Heavy Duty 378, **Lethbridge 209**, QB Location 8, DVI Test 1, ZZAUTOTEST F2 Empty Shop 1; the 3 bills absent |
| 16:54-16:55Z `unpaid-heavy-duty.json` | Heavy Duty, vendor's unpaid list (twice) | 399 rows: 373 bills = the report's 373 exactly; 21 more have balance $0.00 (nothing to age); 5 credits on both sides |
| 16:54-16:55Z `unpaid-lethbridge.json` | Lethbridge (switch proved: the Lethbridge bill opens 200 there, 400 at Heavy Duty) | **0 rows** — at 15:38Z the same read gave 209. NOT explained; the report still lists 209 open Lethbridge bills |

Reading: at 15:38Z the report and the app agreed (209 = 209) and both left the 3 bills out, so the report did not drop
them; they stopped being open bills in the app. The 16:55Z empty Lethbridge list is a separate, unexplained staging
observation outside this feature (the vendor page is not changed by SV-11315); not investigated further. The 3 bills
are staging-only test data made by the E2E automation. Scripts: `check_4refuel.py`, `tech_unpaid.py`, `run_tech_unpaid.sh`.
