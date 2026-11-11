# A/R and A/P aging reports: V1 vs V2 capability check (SV-11315, release 19 Nov 2026)

**Question answered:** after the upgrade, can users still do everything they could do in these reports before,
unless the PRD clearly takes it away?

**Short answer, from the code (nothing observed live yet):** almost everything is kept. **Three things
production can do today are not done by the upgrade's code, and no document says they should go.**

| What | Today (production) | Upgrade's code | Case |
|---|---|---|---|
| Pick a date **after today** to see future aging (also via a saved link) | Allowed | Blocked (date chip, link and server) | V1R-07, V1R-08 |
| An invoice **without a due date** | Aged from the customer's credit term | Aged from the invoice's own date (none exist in production today, per the developer) | V1R-25 (held: cannot be set up in the app) |
| A/R Aging Detail **PDF with an empty bucket** | Prints all five buckets, empty ones with $0.00 | Prints only buckets that hold a document | V1R-35 |

Each is in `POSSIBLE-LOSSES.md` (V1 and V2 code lines, Jira search result: no existing ticket) and in
`PO-QUESTIONS.md` (draft, not sent). No ticket was created.

## Pinned ends

- **V1** = production v26.45.3 = ShopView/shopview commit **fc08f23** (measured 10 and 11 Nov 2026).
- **V2** = branch SV-11315-ar-ap-aging-reports at **8e35ee0d02** (code). QA branch sv11315 runs it (its
  marker v26.45.2-6a8b89c does not identify the deployed commit).
- **PRD** = Confluence 947650561 **v11** (5 Nov 2026, Chris Ward), confirmed current on 11 Nov 2026.

## Numbers

- **128 V1 behaviours** read from the code, each with file and line at fc08f23 (`AR-AP-V1-BASELINE.md`).
  All 206 line citations are checked mechanically against the repository.
- **103 kept**, **20 changed by design**, **1 removed by design** (PDF over 2,000 rows), **4 possibly lost**
  (the three items above; the future date counts twice: chip and link). Every changed or removed row quotes
  the PRD sentence that changes it (`INVARIANT-REGISTER.md`).
- **93 cases** (`cases/CASES.md`, `cases/cases.json`):
  - **V1R-01 to V1R-72, regression cases** (live in TestRail as C1078974 to C1079045): 67 on the six reports,
    5 on other screens the upgrade's shared code reaches. 3 are marked EXPECT FAIL and 1 is HELD.
  - **V1R-73 to V1R-93, planned-change cases** (added 11 Nov 2026 on the QA lead's decision: "If they are
    planned changes, then OK add tests for them too but in the same folder."): one per changed-or-removed
    behaviour. Each quotes the PRD v11 sentence word for word, checks any documented replacement (for
    example the CSV still gives every row when the PDF is refused), checks that the parts the PRD does not
    touch are unchanged (cited at fc08f23), and names the related existing PRD-suite case.
- **15 behaviours are tested only by the existing PRD suite** (group 90418, run 549); they are cited, not
  duplicated. 1 has a written reason (a server failure a tester cannot cause).
- **Screens:** 3 IN (the six reports; Parts Velocity, Technician Utilization and Work In Progress through the
  shared info icon; the work order and part sale pages through the shared location-switch prompt) and 12 shared
  changes ruled OUT with the reason read from the changed lines (`SCOPE.md`).

## How to rebuild and check

```
python3 build/ar-ap-report-sorting/v1-regression/tools/build.py
python3 build/ar-ap-report-sorting/v1-regression/tools/check.py --repo /home/user/shopview
```

`tools/inventory.py` is the single source. `check.py` fails on a missing SOURCE line, a missing or doubled
AUTOMATION marker, a title over 80 characters, a step with two actions, an invariant with no case and no
written reason, a PRD quote that is not word for word in v11, or a V1 citation outside its file.

## What this is not

- **Not observed.** Every "V2" statement is read from code and marked NOT VERIFIED live. Running the cases on
  the upgraded build is the next step (no login was used here).
- **Not in TestRail.** Nothing was written to TestRail or Jira.
- **Planned changes are now tested too.** The 21 changed-or-removed-by-design behaviours have cases V1R-73 to
  V1R-93 (QA lead, 11 Nov 2026). One of them is a real loss of output rather than a reroute: a **PDF over
  2,000 rows** can no longer be produced; V1R-82 checks the refusal and that the CSV still gives every row.
- **Side observation, not a V1 loss:** the date-based day counts moved from UTC to the shop's local day; a
  shop far from UTC may see a document change bucket one day earlier or later than before.
