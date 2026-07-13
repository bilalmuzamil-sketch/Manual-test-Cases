# Chris Ward — Round-2 Answers (source snapshot)

**Fetched:** 2026-07-13 (this worker run) from the Round-2 Google Sheet
`https://docs.google.com/spreadsheets/d/1WZvlqZhNFG5F4KpfqKLavaiWHoLHyE24/edit?gid=171147771`
via the xlsx/csv export endpoints (HTTP 200 both). Verbatim binary/CSV saved as
`chris-round2-answers-source.xlsx` / `.csv`.

## Sheet state at fetch: REACHABLE but UNANSWERED

- The sheet loaded cleanly (not login-walled). One tab: **"Questions for PO"**.
- The **4 questions match OUR Round-2 questions exactly** (verified line-by-line):
  - Q1 = over-sized discount saves silently (no warn/confirm)
  - Q2 = typing 0 as a fee's maximum removes the limit
  - Q3 = very small percentages quietly rounded up
  - Q4 = a processing fee's minimum amount is quietly thrown away
- **The "Your answer" column (cells F5–F8) is COMPLETELY EMPTY.** No cell comments,
  no hidden sheets, no other gid. Chris Ward has **not yet filled in any answer.**

## Answers captured

| Q | Topic | Chris's answer (cell F) |
|---|---|---|
| Q1 | Over-sized discount silent save | **(blank — not answered)** |
| Q2 | Max cap of 0 | **(blank — not answered)** |
| Q3 | Tiny-% rounding | **(blank — not answered)** |
| Q4 | Processing-fee minimum | **(blank — not answered)** |

## Consequence

The pre-decided §0.1 action map in `PROJECT-STATE.md` **cannot be applied** — it is
keyed on Chris's option choices, which are absent. The project stays **PAUSED** on
this input. See `spec-v2-reconciliation.md` §A for the per-question "pending"
disposition. Inputs 2 (new spec doc) and 3 (Chris's changelog) are independent of
these answers and were fully reconciled.
