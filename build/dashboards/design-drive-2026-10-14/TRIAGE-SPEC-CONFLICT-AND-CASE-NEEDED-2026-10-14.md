# Dashboard design drive, 14 Oct 2026: triage (SPEC-CONFLICT and CASE-NEEDED)

These come from the text inventory (`design-text-inventory-2026-10-14.md`). The design is the canvas
https://claude.ai/artifact/Wae9DFQ8PJQBy8mbLsL5ge, saved 2026-10-14 and byte-identical to 7 Oct. The spec is PRD Confluence
788430850 **v44** (last modified 13 Oct 2026 18:37). I also used the PO decision of 7 Oct 2026 on empty states.
Nothing here was sent or written anywhere. Each case still follows the PRD (Rules 57, 113). Each PO question goes out
last, after build verification (QA lead, 7 Oct; Rule 66).

## A · SPEC-CONFLICT: the design and the PRD disagree, or the PRD is silent on something the design shows (PO questions)

### Already in the register (D-1..D-10, 7 Oct). The design still shows them; nothing new to add.

| # | What the design shows | What the PRD says (v44, verbatim) | Affected cases |
|---|---|---|---|
| D-10 | A footer reads "Last updated: just now" / "Last updated: 3 minutes ago" / "Last updated: 4 minutes ago" (after-dash-default.png, after-hover-panel-revenueKpi.png, after-phone.png) | S3-R1: "There is no freshness allowance and no "up to N minutes behind" in this spec." No requirement for this footer. | [C88652](https://shopview.testrail.io/index.php?/cases/view/88652) |
| D-4 | At Risk at zero: "$0.00 (12mo) · 0 customers". Sales by Customer at zero shows no "Top:" line (after-empty-tiles.png) | S5-R8: "… "${revenue} (12mo) · {customer name}" when exactly one customer is at risk." S5-R9: "… "${revenue} (12mo) · {count} customers" when more than one customer is at risk." Zero customers is not covered. | [C351714](https://shopview.testrail.io/index.php?/cases/view/351714), [C351715](https://shopview.testrail.io/index.php?/cases/view/351715) |
| D-3 | The expanded At Risk panel has its own "Inactive for" + "120 Days" select, as well as the tile pill (after-open-atRiskHero.png) | S5-R10: "The At Risk Customers tile has an inactivity-window control offering 30, 60, 90, 120, and 180 days." (one control) | [C88628](https://shopview.testrail.io/index.php?/cases/view/88628), the At Risk cases |
| D-1 | Legend hover readout "Marcus Halvorsen 120% · Aug 2026 · avg 107%" while the table reads 110.96% (05/11 Legend boards) | Nothing. The legend readout is a design-only detail. | [C351723](https://shopview.testrail.io/index.php?/cases/view/351723), [C351734](https://shopview.testrail.io/index.php?/cases/view/351734) |

### NEW this pass (not in the register; candidates for the PO sheet)

| # | What the design shows (file) | What the PRD says (v44, verbatim) | Affected cases (they follow the PRD; none needs editing) |
|---|---|---|---|
| **D-11** | The approved row-15 empty-state drawing has **no report link (arrow) on the Technician Efficiency and Technician Utilization tiles**. Revenue, Billing Efficiency and Sales by Customer keep theirs. "Today" drawing before-empty-tiles.png is the same. The live screenshots (after-dash*.png) show the arrow on all five. | S4-R1: "Each KPI tile shows a label, a headline value, a sparkline, a date-range control, and a report link." S10-R1: "Each KPI tile and the Sales by Customer tile shows a report link." S4-R18: "The placeholder changes nothing else on the tile." | Report-link cases [C88604](https://shopview.testrail.io/index.php?/cases/view/88604), [C88623](https://shopview.testrail.io/index.php?/cases/view/88623), [C88629](https://shopview.testrail.io/index.php?/cases/view/88629) and the empty-state cases [C351706](https://shopview.testrail.io/index.php?/cases/view/351706)–[C351715](https://shopview.testrail.io/index.php?/cases/view/351715) |
| **D-12** | Board 02 note (02_Last12_After.dc.html:83): "The card now measures revenue the way Sales By Customer does, from the labor, parts and shop supplies stored on each invoice" (At Risk "$40.50 (12mo)") | S5-R15: ""Some revenue in the last twelve months" means revenue greater than $0.00 over the trailing twelve months, measured the way the Revenue tile measures revenue: invoice subtotals before any discount and before tax, minus credit memos." | At Risk cases citing S5-R15/S5-R8/S5-R9: [C88609](https://shopview.testrail.io/index.php?/cases/view/88609), [C88610](https://shopview.testrail.io/index.php?/cases/view/88610), [C88630](https://shopview.testrail.io/index.php?/cases/view/88630), [C88643](https://shopview.testrail.io/index.php?/cases/view/88643), [C88644](https://shopview.testrail.io/index.php?/cases/view/88644) |
| **D-13** (confirm only) | Board 01 caption (01_Opens_After.dc.html:76): "At Risk opens on 120 days. Every visit opens on these defaults, whatever was chosen last time (S7-R8)." Board 09 caption says the opposite: "It is the one range-like choice the dashboard remembers (S5-R14)." | S5-R14: "The inactivity window the user chose is remembered and applied on their next visit, in place of the 120-day default (S5-R11), under the storage rule in S6-R16." S7-R8 covers date ranges only. | [C88610](https://shopview.testrail.io/index.php?/cases/view/88610), [C88615](https://shopview.testrail.io/index.php?/cases/view/88615), [C88618](https://shopview.testrail.io/index.php?/cases/view/88618). These follow S5-R14 already. |
| **D-14** (spec silent) | In the expanded charts, a dashed line joins months that have no value. The Billing Efficiency, Technician Efficiency and Technician Utilization panels all show this (after-open-*Kpi.png). | The PRD defines gaps only for the sparkline. S4-R11: "A bucket for which the measure has no value (S3-E3) contributes no point, and interior gaps are preserved rather than closed up or drawn as zero." The S4 context note says: "The full chart inside an expanded tile, and the charts on the report pages (Story 11), are unchanged." No rule covers gaps in the full charts, so I wrote no case (Rules 58, 64). | Chart cases [C88621](https://shopview.testrail.io/index.php?/cases/view/88621), [C351719](https://shopview.testrail.io/index.php?/cases/view/351719), [C351720](https://shopview.testrail.io/index.php?/cases/view/351720), [C351724](https://shopview.testrail.io/index.php?/cases/view/351724) |

The register already records these wording differences. Cases follow the PRD and tell the tester not to fail on
capitalisation. This pass found them again: "Hide Chart"/"Show Chart" against the PRD's "Show chart" / "Hide chart"; the menu
says "Advisor Analysis" where the page says "Service Advisor Analysis"; "30 days" against "120 Days"; tooltips show whole
dollars and percents.

## B · CASE-NEEDED: the spec has a rule and no case tests it

None of the CASE-NEEDED rows comes from the design alone. Every design text either appears in a case or falls in another class.
PRD v44 (13 Oct) added three requirements after our v42 cases were written. The design shows two of them, so they belong here
with the PRD rule quoted:

| PRD v44 rule (verbatim) | Where the design shows it | Nearest existing cases (extend or pair) |
|---|---|---|
| **S8-R5a:** "The table under the chart follows the same filter: it lists only the selected technicians, or only the selected advisor. With no advisor chosen it lists every advisor, as the chart does." | after-open-techEfficiencyKpi.png and after-open-techUtilizationKpi.png show "Technician: All technicians" above the table. after-open-billingEfficiencyKpi.png shows "Advisor" above the Advisor Analysis table. | [C88619](https://shopview.testrail.io/index.php?/cases/view/88619), [C88649](https://shopview.testrail.io/index.php?/cases/view/88649), [C351717](https://shopview.testrail.io/index.php?/cases/view/351717) (S8-R5 chart scoping) |
| **S8-N1a:** "In the same case the table under the chart is hidden too, rather than shown with no rows." | Not drawn. No board shows every technician deselected. | [C88620](https://shopview.testrail.io/index.php?/cases/view/88620) (S8-N1) |
| **S4-R11a:** "On Revenue and the count tiles, a bucket with no sales is a point at 0. Only a ratio tile's "-" (S3-E3) contributes no point." | after-dash-default.png: the Revenue This Month sparkline drops back to the baseline between the days that have sales | [C88606](https://shopview.testrail.io/index.php?/cases/view/88606), [C88647](https://shopview.testrail.io/index.php?/cases/view/88647), [C351706](https://shopview.testrail.io/index.php?/cases/view/351706)–[C351708](https://shopview.testrail.io/index.php?/cases/view/351708), [C351713](https://shopview.testrail.io/index.php?/cases/view/351713) (S4-R11 / S4-R12 / S4-R13 / S5-R5) |

I wrote no case. Writing cases and changing the run need the QA lead's go-ahead (Rules 6, 123). A Jira creation hold is also
active (Rule 62). Whoever picks up the 14 Oct currency check should take these three rules from PRD-DIFF-v42-vs-now.md as well.
