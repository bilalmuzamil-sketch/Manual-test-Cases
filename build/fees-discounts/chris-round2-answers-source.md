# Chris Ward — Round-2 Answers (source snapshot)

**Fetched:** 2026-07-14 (this worker run) from the Round-2 Google Sheet
`https://docs.google.com/spreadsheets/d/1WZvlqZhNFG5F4KpfqKLavaiWHoLHyE24/edit?gid=171147771`
via the xlsx/csv export endpoints (HTTP 200 both). Verbatim binary/CSV saved as
`chris-round2-answers-source.xlsx` / `.csv` (this file overwrites the 2026-07-13
blank capture).

## Sheet state at fetch: REACHABLE and ANSWERED

- The sheet loaded cleanly (not login-walled). Tab: **"Questions for PO"**.
- The **4 questions match OUR Round-2 questions exactly** (verified line-by-line):
  - Q1 = over-sized discount saves silently (no warn/confirm)
  - Q2 = typing 0 as a fee's maximum removes the limit
  - Q3 = very small percentages quietly rounded up
  - Q4 = a processing fee's minimum amount is quietly thrown away
- **The "Your answer" column (cells F5–F8) is now FILLED.**

## Answers captured (verbatim)

**Q1 — A discount bigger than the bill saves with no warning → A**

> A — already resolved: the warning exists and is spec-required (S6-R12, "the
> carry is never silent"). It shows before invoicing and before marking the WO
> reviewed/complete, stating the $0.00 floor, that tax on the taxable base is still
> owed, and the exact credit amount, and requires confirmation. It intentionally
> doesn't fire when the adjustment is merely added (nothing committed yet; the add
> dialog's preview shows the resulting totals). No change needed.

**Q2 — Typing 0 as a fee's maximum removes the limit → A**

> A — already resolved by spec: S2-R25 says an entered 0 is treated the same as
> empty, i.e. no maximum. Working as designed; a true $0 cap can only come from
> legacy data (§5-R6 note), never from the UI. No change needed.

**Q3 — Very small percentages are quietly rounded up → A**

> A -- fully anticipated and expected.

**Q4 — A processing fee's "minimum amount" is quietly thrown away → B**

> B — already resolved by spec: S8-N6 forbids a Processing Fee minimum. Premise
> doesn't reproduce: there is no minimum-amount field anywhere in the UI, and the
> API rejects a Processing Fee minimum with an explicit error ("A processing fee
> cannot have a minimum or maximum cap") — nothing is silently dropped. No change
> needed.

## Summary table

| Q | Topic | Chris's answer |
|---|---|---|
| Q1 | Over-sized discount silent save | **A** (warning required; already exists at commit points) |
| Q2 | Max cap of 0 | **A** (0 = no limit; WAD, S2-R25) |
| Q3 | Tiny-% rounding | **A** (rounding fine/expected) |
| Q4 | Processing-fee minimum | **B** (don't support; already made clear via no field + explicit API reject) |

## Consequence

The pre-decided §0.1 action map in `PROJECT-STATE.md` was APPLIED to local
artifacts on 2026-07-14 (see PROJECT-STATE §0.0c). 6 cases are staged for a
TestRail push pending fresh one-day authorization; jira drafts TICKET 4 + TICKET 5
were DROPPED as working-as-designed/expected. No new tickets created (Q1 warning
exists per PO; Q4 no defect).
