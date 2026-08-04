# DEFECT PACK 2026-08-04 — FILED IN JIRA

**Filed 2026-08-04 by Bilal Muzamil (account 712020:6d590212-5c9b-4135-ae11-277f3826110e) via a live Atlassian session.**
All six tickets were filed **verbatim** from the pack files in this folder. Every write was read back and
verified (Rule 50): the stored description is **byte-identical** to the document sent, and every field the
pass did not intend to change was proven byte-identical to its pre-write snapshot.

## The six tickets

| # | Key | Link | Summary | Type | Severity / Priority | Parent (filed) | Parent (pack asked) | Links | Attachments |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **SV-8818** | https://shopview.atlassian.net/browse/SV-8818 | PDF download fails with a server error on a medium-sized report view, on 5 of the 6 reports | Bug | High | SV-8582 | SV-8591 | relates to SV-8591 | 4 |
| 2 | **SV-8819** | https://shopview.atlassian.net/browse/SV-8819 | Parts Velocity: Turns / Yr is overstated on the "This Year" preset — it divides by one day too few | Bug | High | SV-8582 | SV-8645 | relates to SV-8645 | 5 |
| 3 | **SV-8820** | https://shopview.atlassian.net/browse/SV-8820 | Inventory Value reports the stock value for one day AFTER the date asked for | Bug | High | SV-8582 | SV-8672 | relates to SV-8672 | 4 |
| 4 | **SV-8821** | https://shopview.atlassian.net/browse/SV-8821 | Creating an invoice from a completed work order fails with a server error | Bug | High | (none) | (none — standalone) | blocks SV-8582; blocks SV-8592 | 4 |
| 5 | **SV-8822** | https://shopview.atlassian.net/browse/SV-8822 | Saving a customer returns a server error instead of a validation error when a sales-rep id is supplied | Bug | Low | (none) | (none — standalone) | relates to SV-8582 | 3 |
| 6 | **SV-8823** | https://shopview.atlassian.net/browse/SV-8823 | Inventory Value spreadsheet: money arrives as text, and the file ignores the chosen columns and re-orders them | Bug | Medium | SV-8582 | SV-8677 | relates to SV-8677 | 3 |

## Parent deviation — recorded, and why

The pack proposed **Story** parents (SV-8591, SV-8645, SV-8672, SV-8677). Those issues all exist and are the
right subject-matter owners, **but a `Bug` cannot be their child in this Jira**: verified live from
`/rest/api/3/issue/createmeta/SV/issuetypes` — `Bug` is **hierarchy level 0**, so its parent may only be an
**Epic** (level 1). The project's story-level defect type is **`Story Defect`**, which is a **sub-task**
(hierarchy level −1, id 10007; precedents SV-8681, SV-8161, SV-7914, SV-8550 all hang off Stories).

So each Bug was filed with **parent = epic SV-8582** and a **`relates to` link to the exact story the pack
named**, which keeps the attribution the pack argued for without changing the issue type it specified.
**If the QA lead would rather have the story-level attribution as a parent, the change is to re-file (or
convert) those four as `Story Defect` under their stories — his call, not ours.**

## Fields set

- `Product Area` (**required** by the project) — `Reports & Dashboards` for tickets 1, 2, 3, 6 (matching the
  epic's own stories SV-8645/8672/8677), `Work Orders` for ticket 4, `Customers` for ticket 5.
- `Priority` **and** the project's `Severity` field both set to the pack's stated "severity / priority" value.
- Labels exactly as the pack's suggested list.

## Duplicate search — done BEFORE filing, nothing filed over an existing ticket

Searched `/rest/api/3/search/jql` (note: `/rest/api/3/search` is HTTP 410) across: all 60 SV bugs created since
2026-07-01; text/summary sweeps for PDF, download, export, CSV, Turns, Parts Velocity, as-of, Inventory Value,
Create Invoice, customer save, sales rep; and a label sweep on `qa-found`/`reports-suite`/`parts-velocity`/
`inventory-value` (**0 hits — these labels were previously unused in the project**).

**No duplicate exists for any of the six.** One near-miss, checked and ruled out:

- **SV-8737** — *"Error occurs when creating invoice from a completed work order (Can Not Create Invoice. All
  Core Parts must…)"*, **Done**, created 2026-07-28. Same screen as ticket 4 but a **different failure**: a
  core-parts *validation message*, not the HTTP 500 in ticket 4. Not a duplicate; noted here so the assignee
  can see it was considered.

**SV-8780 was not touched** (QA lead's ruling: "Ignore this ticket.").

## Attachments

**23 of 23 attachments uploaded successfully** via
`POST /rest/api/3/issue/{key}/attachments` with header `X-Atlassian-Token: no-check`. Every evidence file each
ticket names in its own "Evidence files" section was attached; the uploaded byte size was checked against the
source file for each. Names encode the repo path (`/` → `__`) so each attachment is traceable to its source.

| Key | Attachment | Source path in this repo |
|---|---|---|
| SV-8818 | `defect-pack-2026-08-04__probe__pdf500-mechanism-probe.json` | `build/report-suite/defect-pack-2026-08-04/probe/pdf500-mechanism-probe.json` |
| SV-8818 | `viu-2026-08-03__batch-pv-tu__evidence__pv__exports__exports-log.jsonl` | `build/report-suite/viu-2026-08-03/batch-pv-tu/evidence/pv/exports/exports-log.jsonl` |
| SV-8818 | `viu-2026-08-03__batch-sbc-sbr__evidence__export-guards.md` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/evidence/export-guards.md` |
| SV-8818 | `viu-2026-08-03__batch-wip-iv__evidence__api__iv-pdf-boundary.json` | `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/api/iv-pdf-boundary.json` |
| SV-8819 | `defect-pack-2026-08-04__probe__turns-ab-probe.json` | `build/report-suite/defect-pack-2026-08-04/probe/turns-ab-probe.json` |
| SV-8819 | `defect-pack-2026-08-04__probe__turns-presets-probe.json` | `build/report-suite/defect-pack-2026-08-04/probe/turns-presets-probe.json` |
| SV-8819 | `defect-pack-2026-08-04__probe__turns-window-probe.json` | `build/report-suite/defect-pack-2026-08-04/probe/turns-window-probe.json` |
| SV-8819 | `viu-2026-08-03__batch-pv-tu__VERDICTS.md` | `build/report-suite/viu-2026-08-03/batch-pv-tu/VERDICTS.md` |
| SV-8819 | `viu-2026-08-03__batch-pv-tu__evidence__pv__calc-checks.json` | `build/report-suite/viu-2026-08-03/batch-pv-tu/evidence/pv/calc-checks.json` |
| SV-8820 | `viu-2026-08-03__batch-wip-iv__VERDICTS.md` | `build/report-suite/viu-2026-08-03/batch-wip-iv/VERDICTS.md` |
| SV-8820 | `viu-2026-08-03__batch-wip-iv__evidence__api__api-wip-iv.json` | `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/api/api-wip-iv.json` |
| SV-8820 | `viu-2026-08-03__batch-wip-iv__evidence__api__iv-pdf-boundary.json` | `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/api/iv-pdf-boundary.json` |
| SV-8820 | `viu-2026-08-03__batch-wip-iv__evidence__exports__iv__MULTI__wholelist__csv.head.txt` | `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/exports/iv__MULTI__wholelist__csv.head.txt` |
| SV-8821 | `viu-2026-08-03__batch-sbc-sbr__ENV-DEFECTS.md` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/ENV-DEFECTS.md` |
| SV-8821 | `viu-2026-08-03__batch-sbc-sbr__VERDICTS.md` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/VERDICTS.md` |
| SV-8821 | `viu-2026-08-03__batch-sbc-sbr__tools__seed_invoiced_wo.mjs` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/tools/seed_invoiced_wo.mjs` |
| SV-8821 | `viu-2026-08-03__batch-sbc-sbr__verdicts.csv` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/verdicts.csv` |
| SV-8822 | `viu-2026-08-03__batch-sbc-sbr__ENV-DEFECTS.md` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/ENV-DEFECTS.md` |
| SV-8822 | `viu-2026-08-03__batch-sbc-sbr__VERDICTS.md` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/VERDICTS.md` |
| SV-8822 | `viu-2026-08-03__batch-sbc-sbr__evidence__deactivation__customer-edit-dialog.md` | `build/report-suite/viu-2026-08-03/batch-sbc-sbr/evidence/deactivation/customer-edit-dialog.md` |
| SV-8823 | `viu-2026-08-03__batch-wip-iv__STAGED-CHANGES.md` | `build/report-suite/viu-2026-08-03/batch-wip-iv/STAGED-CHANGES.md` |
| SV-8823 | `viu-2026-08-03__batch-wip-iv__VERDICTS.md` | `build/report-suite/viu-2026-08-03/batch-wip-iv/VERDICTS.md` |
| SV-8823 | `viu-2026-08-03__batch-wip-iv__evidence__exports__iv__MULTI__wholelist__csv.head.txt` | `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/exports/iv__MULTI__wholelist__csv.head.txt` |

## Provisional-build caveat (Standing Rule 49)

Every one of these six findings was observed on QA branch **`sv8582`**, build **`v3.4.1-0ed4433`**, which
engineering declared **NOT FINAL**. Each ticket carries that caveat in its own text and asks the assignee to
close it saying so if it is already fixed. The re-check queue is
`build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md` and it stays **OPEN**.

## Ticket 6 — a status note the QA lead should see

The pack file `TICKET-6-inventory-value-export-formatting.md` still opens with *"the QA lead asked for this one
FLAGGED FOR AWARENESS rather than filed"*. **It has now been filed** (as SV-8823), because the instruction for
this pass was to file all six and named `SV-8677` — ticket 6's parent — in the list of parents to use. Flagging
it plainly here rather than silently: **if he wanted it left unfiled, SV-8823 is the one to close.**

