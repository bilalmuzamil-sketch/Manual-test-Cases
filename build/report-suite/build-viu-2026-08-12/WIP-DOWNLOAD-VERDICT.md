# WIP DOWNLOAD VERDICT — settled by one attempt, as promised

**Report Suite · Work In Progress · build `v3.6-8c28eed` · 12 August 2026**

## The verdict in one line

**The downloads WORK. `SV-8907` is fixed. The four cases that said *"Nothing downloads"* were wrong,
and the ones flipped to plain `READY` yesterday were right — for the wrong reason, but right.**

## What was actually done

**8 attempts: four tabs × two formats. All eight succeeded.**

| Tab | rows on screen | Download (PDF) | Download (CSV) |
|---|---:|---|---|
| Approved - partially completed | **15** | HTTP **200**, `wip-2-report.pdf` **177,684 B** | HTTP **200**, `wip-2-report.csv` **1,366 B** |
| Approved - not started | **3** | HTTP **200**, **176,573 B** | HTTP **200**, **430 B** |
| Completed | **4** | HTTP **200**, **176,725 B** | HTTP **200**, **500 B** |
| Estimates | **15** | HTTP **200**, **178,185 B** | HTTP **200**, **1,399 B** |

Every attempt raised the notification **“Success — Data exported successfully.”** No red toast, no
`500`, on any tab.

### Why this is decisive rather than suggestive

The failing assertion was specific: *“Both Download (PDF) and Download (CSV) fail on **every tab that
has any work orders in it** … All four tabs behave the same way … The one case that DOES produce a
file is a tab with no rows at all.”*

**Every one of the four tabs had rows** — 15, 3, 4 and 15 — so the state under test is exactly the
state the assertion says must fail. **It did not fail once.** And the **file sizes all differ**,
which rules out the obvious alternative explanation that one cached file was handed back four times.

### The files are real, and their content settles four more sub-assertions

The CSV opens with a UTF-8 BOM and reads:

```
"Date Range: Aug 8, 2026 - Aug 12, 2026"
"Locations: Staging Heavy Duty - 9919"
"WO #",Status,Customer,Unit,Advisor,"Days Open",Earned,Remaining,Total
S8582-16710,Approved,TestVT1,,"Admin ShopView","0 days",$145.00,$0.00,$145.00
…
Totals,,,,,,"$2,175.00",$0.00,"$2,175.00"
```

- **C30511 item 3** — a Totals row is present in every file. **Observed.**
- **C30511 item 4** — the `"Locations:"` line is present. **Observed.**
- **C30512 items 1–3** — money is `$1,234.56`-formatted; `"$2,175.00"` is quoted because it carries a
  thousands separator and `$145.00` is bare because it does not. **Observed, both halves.**
- **C30516** — the header really does read **`Unit`**, not *Asset*. **Observed.**
- **C30515** — the filenames really are **`wip-2-report.pdf`** and **`wip-2-report.csv`**. **Observed.**
- **C30518 item 1** — the success caption really is **“Data exported successfully.”** **Observed.**

The PDF is a genuine PDF (WeasyPrint 69.0, one embedded JPEG, title
*“Work In Progress (Approved - partially completed)”*).

## The request shape — taken from the product, never guessed

A request listener recorded what the product's own menu item sends:

```
GET /api/reporting/reports/work-in-progress/export
    ?format=pdf|csv
    &tab=ApprovedPartiallyCompleted
    &from=2026-08-09T00:00:00.000Z
    &to=2026-08-12T23:59:59.999Z
    &locations=<workplace-uuid>
    &columns=wo_number,status,customer,asset,advisor,days_open,earned,remaining,total
    &sortBy=days_open&descending=true
```

This **confirms the record's note**: Work In Progress uses **`from=` / `to=` with full ISO
instants**, not the `range=` parameters the other five reports use. Anyone automating this report
must not copy the other five.

## What was corrected

| Case | Was | Now |
|---|---|---|
| [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | `READY - EXPECT FAIL (SV-8907)` + a false “download fails outright” block | **`READY`**, block removed |
| [C30512](https://shopview.testrail.io/index.php?/cases/view/30512) | `READY - EXPECT FAIL (SV-8907)` + “Nothing downloads” block | **`READY`**, block removed |
| [C30513](https://shopview.testrail.io/index.php?/cases/view/30513) | `READY - EXPECT FAIL (SV-8907)` + “Nothing downloads” block | **`READY`**, block removed |
| [C30514](https://shopview.testrail.io/index.php?/cases/view/30514) | `READY - EXPECT FAIL (SV-8907)` + “Nothing downloads” block | **`READY`**, block removed |
| [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | `READY - EXPECT FAIL (SV-8907)` + “Nothing downloads” block | **`READY`**, block removed |
| [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) · [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) · [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | `READY`, but flipped yesterday **with no build session** | **`READY`, now actually observed** — build line re-stamped |
| [C30517](https://shopview.testrail.io/index.php?/cases/view/30517) | `READY` | **untouched** — see below |

This is **Standing Rule 61 outcome (3)** working exactly as designed: the case told us what to do if
it passes, it passed, so the note comes off and the ticket can be closed.

## 🔴 What is owed to the QA lead

**`SV-8907` should be closed.** It is not ours to close, and under the active creation hold nothing
is written to Jira, so this is a **report, not an action**. The evidence is above.

## Three things this pass did NOT establish — stated plainly

1. **C30517 (the PDF logo) is untouched.** The PDF carries exactly one embedded image, which is
   *consistent* with a logo but is **not an observed logo**. Its build line is left exactly as found.
2. **C30511's item 1 still says *“if you turn Inv. Hrs on, the download is refused.”*** The Inv. Hrs
   toggle **did not take in the harness** — the header row and the export's `columns` parameter were
   both unchanged after the click — so **nothing is claimed about it either way**. A click that
   misses looks exactly like a feature that does nothing, and that mistake has already cost this
   workspace one false “the service is broken” report. **This sentence is an outstanding item, not a
   finding.**
3. **C30518 items 2 and 3** (the *“Empty export”* warning and the failure toast) were not produced —
   no tab on this environment is empty, and nothing failed. Only item 1 was observed.
