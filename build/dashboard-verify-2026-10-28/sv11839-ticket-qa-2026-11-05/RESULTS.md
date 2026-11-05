# QA of SV-12146, SV-12199, SV-12201 and SV-12202 on sv11839 — 5 Nov 2026

**Branch:** https://sv11839.qa.shopview.com
**Build tested:** **v26.45.0-277b249** (`app-version`, recorded in every run). A read at 04:58:22 UTC still showed v26.45.0-aacb66c; every test step ran on 277b249, which contains aacb66c73, c93ba940d, da8754eca and 277b24901.
No Jira or TestRail write was made. Rule 99 (all four zone settings) is recorded in every evidence file.

| Ticket | Title | Verdict | One-line reason | Evidence |
|---|---|---|---|---|
| [SV-12146](https://shopview.atlassian.net/browse/SV-12146) | Vendor credit larger than the bill is used up | **FAIL** (partly fixed) | The money is right now: slip Credits Included $10.00 / Total $0.00, $90 then $40 stays open, the equal $10/$10 case works. But the **Payments tab still shows the credit as "−$100.00 Applied"** under each payment | `SV-12146/` (FAIL-annotated.png) |
| [SV-12199](https://shopview.atlassian.net/browse/SV-12199) | Customer Invoice export Terms | **PASS** | Invoice made on COD; customer then changed to Net 30; the export shows **COD** | `SV-12199/` |
| [SV-12201](https://shopview.atlassian.net/browse/SV-12201) | Payroll Timesheet overlapping timesheets | **PASS** | Overlapping 8:00–9:00 and 8:30–9:30 PM plus 0.5 h earlier → day total **2.00** (not 2.50) | `SV-12201/` |
| [SV-12202](https://shopview.atlassian.net/browse/SV-12202) | Parts Velocity Last Sale calendar days | *pending* | Part sold on 4 Nov at 11:24 PM (Heavy Duty); same-day control reads 0 days; the after-midnight read runs once at 07:05 UTC | `SV-12202/` |

## Separate issues found (not filed)
1. **The remittance slip shows the next day's date in the evening.** Found while testing **SV-12146**.
   - The slips downloaded at about 11:10 PM on 4 Nov (Heavy Duty) print **"Date: Nov 5, 2026"** and the credit's **"Credit Date: Nov 5, 2026"**.
   - On screen, the same payment and credit are dated **Nov 4, 2026** (the Unpaid Invoices list and the New Payment dialog).
   - The slip seems to use the UTC date instead of the location's date.
   - Evidence: `SV-12146/remittance-*.txt` and `SV-12146/4-unpaid-invoices-after-pay1.png`.
   - **No ticket yet** (related ticket: [SV-12146](https://shopview.atlassian.net/browse/SV-12146)). **My recommendation:** ask Chris whether the slip should print the location's date; if yes, file it as a small defect.

## Notes
- Throwaway data (all ZZAUTOTEST, on sv11839):
  - vendor "ZZAUTOTEST QA11839 Credit Vendor" (bills ZZVC12146-A/B/C, credits C-13668 and C-13669, 3 payments);
  - work orders S11839-17597 (vendor parts and the two SV-12201 timesheets), S11839-17598 (part sale for SV-12202) and S11839-17599 (Terms test);
  - customers "ZZAUTOTEST QA11839 Vendor Credit WO", "… Last Sale" and "… Terms test";
  - inventory part ZZAUTOTEST-PV12202-11050521.
- Every set-up call is logged in `seed-log.jsonl`.
