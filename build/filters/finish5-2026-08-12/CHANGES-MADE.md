# CHANGES MADE — Filters finish5, 2026-08-12

## IN TESTRAIL — TWO CASES, ONE FIELD EACH

| Case | Change | Verified |
|---|---|---|
| [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | Rule-54 **sentence 2** re-stamped `v3.4.2-d00239b` (8/5/2026) → **`v3.7-20e801b`, 12 August 2026** | HTTP 200, 28 fields byte-compared, 0 collateral |
| [C43560](https://shopview.testrail.io/index.php?/cases/view/43560) | Rule-54 **sentence 2** *"has not yet been checked against any build"* → **`v3.7-20e801b`, 12 August 2026** | HTTP 200, 28 fields byte-compared, 0 collateral |

**Nothing else was changed on either case** — no title, no precondition, no step, no expectation, no
`refs`, no `AUTOMATION` marker, no `custom_atmstatus`. Full log and proofs:
`testrail-execution-log.md`.

---

## IN THE REPOSITORY

| File | What it is |
|---|---|
| `RUNNABILITY.md` | The 14 cases held on Branko, walked. **11 runnable, 3 not** — with the five of our own harness faults that looked like build faults. |
| `RESTORE-CONTRADICTION.md` | The finish3-vs-finish4 disagreement settled. **finish3 was right.** |
| `HOLD-REASONS.md` | The four already-held cases, each reason checked against live data. **One is a filing reason on a runnable case.** |
| `DIVERGENCES.md` | 3 substantive · 2 cosmetic · 1 correction to our own text · 1 build observation. **None applied.** |
| `AUTOMATED-CASES-CHANGED.md` | Rule 65 — **one** Automated case changed, and Vlad set that flag himself. |
| `COMPLETION-REPORT.md` | Rule 67 — the table, every figure derived live. |
| `RESUME.md` | Where this pass got to and what the next one picks up. |
| `testrail-execution-log.md` | Two operations, with the run-352 and foreign-case proofs. |
| `evidence/probe{Q1,Q1b,Q2,Q3,Q4,Q5,Q6,R1,R2,R3,S1,S2,S3,S4,S5,S6}.json` + run logs | Every measurement, including **the runs that could not fail**, kept deliberately. |
| `tools/probe*.cjs`, `tools/restamp5.py`, `tools/harness.cjs`, `tools/lib.cjs` | The drivers, re-runnable. |

---

## WHAT WAS DELIBERATELY **NOT** CHANGED

**1 · The 14 cases held on Branko were not written to at all.**
Their runnability was established and recorded **off the case**. The brief bars touching their
expected results, and the Rule-54 provenance line lives in that field. **Their `AUTOMATION: HOLD`
markers all stand** — the hold is about the unsourced expectation, and it is not ours to lift.

**2 · Every step correction in `DIVERGENCES.md` is recommended, not applied.**
Two reasons, and the second is the stronger one: these are held cases that no tester is running
today, and **Branko's Parts/Reports write-up is likely to rewrite these very steps** — a second edit
on release eve costs more risk than the first one removes.

**3 · C29614's parenthetical "(to confirm live once built)" was left in place.**
Its expectation 3 still carries that hedge, and this pass has now confirmed it live — the filters do
come back on a different browser profile. **Removing it is an expectation edit, not a stamp**, so it
is recommended for the next authorised pass rather than taken here.

**4 · No `AUTOMATION` marker was changed anywhere, on any case.**

**5 · Nothing was filed in Jira.** The creation hold at Standing Rule 62's tail is active, re-stated
by the QA lead on 2026-08-12 in the same breath as raising the evidence bar. **The one candidate
this pass produced** — a shared report address that filters the data while its button shows no value
— is written up in `DIVERGENCES.md` §7 with its evidence, ready to file when the hold lifts.

**6 · Nothing was seeded, and nothing needed to be.** Every data state the walk required already
existed and was used read-only. **No `ZZAUTOTEST` data exists from this pass** because none was ever
created. No role, no setting and no staff record was touched — the three cases that need a staff
change are scheduled last, on purpose (see `RESUME.md`).

---

## THE ENVIRONMENT AS THIS PASS LEAVES IT

**Two page preferences hold values this pass set through the interface**, on
`admin@shopview.com`'s own account:

* **Work Orders** — `status: [estimate]`, `company_id: [Iibay Landscaping]`, from C43560's step 5.
* **Parts / Inventory** — a `Category` selection, from C43562's step 4.
* **Timesheet Activities** — a `Filter by Staff` selection and a custom date range.

**These are the ordinary product state a tester's own use produces, not seeded data**, and the
cases' own steps put them there. They are recorded rather than cleared because **clearing them is
itself a write, and the next pass may want the state**. Anyone can clear them with the
`Clear Filters` control on each page.
