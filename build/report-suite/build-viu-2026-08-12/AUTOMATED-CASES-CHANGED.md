# FOR THE AUTOMATION ENGINEER — what moved on 12 August 2026

**Report Suite · build `v3.6-8c28eed` · 5 automation markers changed, 0 cases created, 0 deleted.**

## The five markers that changed — all in the same direction

**`AUTOMATION: READY - EXPECT FAIL (SV-8907)` → `AUTOMATION: READY`**

| Case | Title |
|---|---|
| [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) | Downloads keep shown columns, honor filters, include the tab's Totals row |
| [C30512](https://shopview.testrail.io/index.php?/cases/view/30512) | Downloaded money and Inv. Hrs values keep the on-screen formats |
| [C30513](https://shopview.testrail.io/index.php?/cases/view/30513) | Inv. Hrs green/red coloring appears on screen and in the PDF; not the CSV |
| [C30514](https://shopview.testrail.io/index.php?/cases/view/30514) | Days Open in a download is frozen at the moment the file is generated |
| [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | Export notifications: success caption, "Empty export" warning |

**Why:** `SV-8907` (Work In Progress downloads fail on any tab with rows) **is fixed**. Proven by 8
of 8 successful download attempts across all four tabs, both formats — see `WIP-DOWNLOAD-VERDICT.md`.

**What this means for a suite you have already automated:** if any of these five was carrying an
expected-failure assertion, **invert it**. They should now pass.

## Suite tally, re-read from live after the writes

| marker | before | after |
|---|---:|---:|
| `AUTOMATION: READY` | 338 | **343** |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | 100 | **95** |
| `AUTOMATION: HOLD - <reason>` | 42 | **42** |
| **total** | **480** | **480** |

**The arithmetic gate passes both ways: 343 + 95 = 438 = 480 − 42.** Exactly one marker per case,
0 unmarked, 0 doubled, measured live.

## The request shape you will need for Work In Progress

**Work In Progress does NOT use the `range=` parameters the other five reports use.** Captured from
the product's own menu item with a request listener:

```
GET /api/reporting/reports/work-in-progress/export
    ?format=pdf|csv
    &tab=ApprovedPartiallyCompleted|ApprovedNotStarted|Completed|Estimates
    &from=<full ISO instant>&to=<full ISO instant>
    &locations=<workplace-uuid>
    &columns=wo_number,status,customer,asset,advisor,days_open,earned,remaining,total
    &sortBy=days_open&descending=true
```

Returns **HTTP 200** with the file, and the UI raises **“Success — Data exported successfully.”**
Filenames are **`wip-2-report.pdf`** and **`wip-2-report.csv`** on every tab (they do **not** carry
the tab name).

## Two things worth knowing before you write a label assertion

**1. Four Work In Progress tab labels read differently in the DOM than on screen.** The label carries
`text-transform: capitalize`, so:

| | value |
|---|---|
| `textContent` | `Approved - partially completed` |
| `innerText` / what the tester sees | `Approved - Partially Completed` |
| the downloaded **PDF** title | `Approved - partially completed` |

**An assertion built on `textContent` and an assertion built on the visible text will disagree, and
both will be "correct".** Our cases assert the tester-visible form. Stable selectors exist and are
better: `tab_wip_approved_partially_completed`, `tab_wip_approved_not_started`, `tab_wip_completed`,
`tab_wip_estimates`.

**2. Sales By Customer and Technician Utilization list the same four download items in different
orders** — SBC groups by format, TU groups by view. `C30434` deliberately does not assert TU's order;
`C30159` does assert SBC's. Do not normalise the two.

## Useful test-ids harvested this session

`btn_dropdown_<wip|tu|sbc|sbr|pv|iv>_export` · `action_wip_export_pdf` · `action_wip_export_csv` ·
`button_column_selection` · `date-range-selector_<key>_trigger` ·
`select_multiple_report_location_filter` · `clear_report_location_filter` ·
`table_work_in_progress_report` · `row_wip_totals` · `wip_summary_strip` and its seven
`wip_summary_value_*` figures · `link_wip_wo_<uuid>` per row.

Full per-report dumps: `evidence/harvest-all.json`, `evidence/menus2.json`.

## Nothing of yours was touched

Your 12 cases — **C38919–C38923** and **C43567–C43573** — were **never read for verdicts and never
written**, and were re-read after the batch and proven **byte-identical including `updated_on` and
`updated_by`**. `custom_atmstatus` was **not sent on any payload**; the 40 flagged Report Suite cases
remain yours alone.
