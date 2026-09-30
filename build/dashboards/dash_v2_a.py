# -*- coding: utf-8 -*-
import importlib.util
spec=importlib.util.spec_from_file_location("dash_lib","build/dashboards/dash_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
ACCESS="You are signed in as an owner/admin (or any user with the Reports permission) in an organisation where the Dashboard feature is on, on the build under test (sv8311.qa.shopview.com); a single workplace is selected."
def seed_wo(desc="one invoiced work order in the current month"):
    return (f'Seed {desc} through the app (a manual tester creates it, not the API): Customers > New Customer '
            '(e.g. "ZZAUTOTEST Co"); create a Work Order for that customer and unit; add a labour line and a part; '
            'set it Complete and Invoice it, dating the invoice inside the range under test.')
COLLAPSE='Start with no tile expanded (collapse any open tile so the dashboard shows its default grid).'

C=[
# S1
{"cid":88594,"title":"Dashboard entry, landing, placement and workplace scope",
 "pre":[ACCESS,seed_wo(),COLLAPSE]},
{"cid":88595,"title":"Access gates and server-side enforcement",
 "pre":[ACCESS,'Note for the tester: that the server itself refuses the dashboard endpoints without the permission cannot be proven by hand - it is a developer/automated check. By hand, confirm only who can and cannot reach the dashboard screen.']},
{"cid":88596,"title":"Access negatives - missing permission or missing feature",
 "pre":['On the build under test, have two users to sign in as: one without the Reports permission; and one with the Reports permission but in an org where the Dashboard feature is off (set both under Settings - Staff / Roles and the org feature toggle).']},
{"cid":88597,"title":"The shop logo is inert branding, not navigation",
 "pre":[ACCESS,'Have a desktop screen and a small screen (browser window under 1024px).']},
{"cid":88598,"title":"Workplace edge cases - switching and none selected",
 "pre":[ACCESS,'Two workplaces available in the org, and the ability to have no workplace selected (use the workplace switcher in the header).']},
# S2
{"cid":88599,"title":"The fixed tile set and order",
 "pre":[ACCESS]},
{"cid":88600,"title":"No customization controls exist",
 "pre":[ACCESS]},
# S3
{"cid":88601,"title":"Report parity - every tile figure equals its report",
 "pre":[ACCESS,'A workplace with data for Revenue, Billing Efficiency, Technician Efficiency, Technician Utilization and Sales by Customer (seed invoiced work orders with labour and clocked hours through the app).','To check a KPI tile against its report, open the matching report with all advisors/technicians selected and the same date range.']},
{"cid":88602,"title":"Measure formulas",
 "pre":[ACCESS,'A workplace with known invoices, labour and clocked-hours data so each measure can be computed by hand. Seed via the app: create/invoice work orders with known subtotals and record clock hours against their labour lines.']},
{"cid":88603,"title":"Void exclusion, negative revenue, and the n/a state",
 "pre":[ACCESS,'Seed via the app: a voided invoice; a range where credit memos exceed sales; and a range with zero worked/clocked hours.']},
# S4
{"cid":88604,"title":"KPI tile anatomy; Revenue and Billing Efficiency lines",
 "pre":[ACCESS,'A workplace with revenue and billing-efficiency data for the selected range (seed invoiced work orders with labour, and record clock hours).']},
{"cid":88605,"title":"Technician Efficiency and Utilization headlines and lines",
 "pre":[ACCESS,'A workplace with technician efficiency and utilization data for the selected range (seed work orders with invoiced technician time and recorded clock hours).']},
{"cid":88606,"title":"The KPI sparkline and how it buckets the range",
 "pre":[ACCESS,'Ranges of different lengths available (This Month, This Quarter, Last 12 Months, and a multi-year range - use the tile date-range control); and a range with an interior bucket that has no value.']},
{"cid":88607,"title":"KPI negatives and extreme values",
 "pre":[ACCESS,'Seed via the app: a Revenue range with no parts-versus-labour split; and a report with an extreme value.']},
# S5
{"cid":88608,"title":"The Sales by Customer tile",
 "pre":[ACCESS,'A workplace with sales to several distinct customers in the range, and a range with exactly one customer (seed invoiced work orders for several ZZAUTOTEST customers).']},
{"cid":88609,"title":"The At Risk Customers tile - headline, line, window control",
 "pre":[ACCESS,'A test customer with exactly ONE invoiced work order dated about 90 days ago with positive revenue and nothing since (seed via the app with a backdated invoice date).',COLLAPSE,'Start with the At Risk window control at its default (no remembered risk-days).']},
{"cid":88610,"title":"At Risk sparkline, remembered window, and the definition",
 "pre":[ACCESS,'A workplace with at-risk history over the last twelve months; a customer whose 12-month revenue is exactly $0.00 or negative; and a customer with two or more lifetime invoices (seed via the app).']},
{"cid":88611,"title":"Count-tile negatives and edge cases",
 "pre":[ACCESS,'Seed via the app: a range with no customer sales; a window with no at-risk customers; and a "no company" invoice (create an invoice with no company attached).']},
{"cid":88630,"title":"At Risk line revenue aggregates all at-risk customers, not rows",
 "pre":[ACCESS,'A desktop screen; a workplace with several at-risk customers - enough that the detail table would be capped is ideal (seed several backdated single-invoice customers).']},
# S6
{"cid":88612,"title":"View details expands each tile to its own detail content",
 "pre":[ACCESS,'A test customer with one invoiced work order in the current month, and a billable technician with closed clock hours on that work order\'s labour line (seed via the app).',COLLAPSE]},
{"cid":88613,"title":"The At Risk detail table - ordering and the 500-row cap",
 "pre":[ACCESS,'A workplace with several at-risk customers (and, if reachable, a workplace exceeding 500 at-risk customers) - seed backdated single-invoice customers.']},
{"cid":88614,"title":"One detail open at a time, and controls that do not expand",
 "pre":[ACCESS,'A workplace with data in every tile.']},
{"cid":88615,"title":"Loading, per-tile failure, and browser-stored choices",
 "pre":[ACCESS,'Be able to observe a tile loading and (if reachable) a tile whose data fails to load.']},
{"cid":88616,"title":"Expansion negatives and small-screen behaviour",
 "pre":[ACCESS,'A small screen (browser window under 1024px).']},
{"cid":88627,"title":"Expanded KPI detail tables show the design's columns",
 "pre":[ACCESS,'A desktop screen; a workplace with data in every tile (Advisor Analysis, Technician Efficiency, Technician Utilization). Seed invoiced work orders with labour and clock hours.']},
{"cid":88628,"title":"Expanded count detail tables show the design's columns",
 "pre":[ACCESS,'A desktop screen; a workplace with data in every tile (Sales by Customer with enough customers to page, and At Risk).']},
# S7
{"cid":88617,"title":"Per-tile date ranges - options, updates and independence",
 "pre":[ACCESS,'Exactly one invoiced work order for a test customer, dated inside the CURRENT calendar month and carrying a dominant fixed labour price, with nothing in the previous month (seed via the app).',COLLAPSE]},
{"cid":88618,"title":"Default ranges, not remembered, and partial ranges",
 "pre":[ACCESS,'A workplace with data across several months.']},
# S8
{"cid":88619,"title":"Technician and advisor chart filters",
 "pre":[ACCESS,'A workplace with several technicians and advisors. Expand the Technician Efficiency, Technician Utilization and Billing Efficiency tiles to their charts.']},
{"cid":88620,"title":"Deselecting every technician hides the chart",
 "pre":[ACCESS,'A technician chart expanded (View details on Technician Efficiency).']},
# S9
{"cid":88621,"title":"Value-axis scaling and the 200% cap",
 "pre":[ACCESS,'A percentage chart expanded; seed data where one value is far above the rest (an outlier above 200% with the pooled median at or below 200%), and separately data whose highest value is at or below 200%.']},
{"cid":88622,"title":"Billing Efficiency lines, ELR on hover, and no extra series",
 "pre":[ACCESS,'The Billing Efficiency chart expanded with several advisors, and the technician charts expanded.']},
# S10
{"cid":88623,"title":"Report drill-in from the tiles",
 "pre":[ACCESS,'One invoiced work order for a test customer dated inside LAST calendar month, with a billable technician\'s closed clock hours on its labour line in the same month (seed via the app with a backdated invoice date).',COLLAPSE]},
# S11
{"cid":88624,"title":"Embedded chart on the report page - toggle, filters, parity",
 "pre":[ACCESS,'Open each report that has an embedded chart: Sales, Service Advisor Analysis, Technician Efficiency, Technician Utilization (seed data so each has a figure).']},
{"cid":88625,"title":"The embedded chart has no controls of its own",
 "pre":[ACCESS,'A report page with its embedded chart shown.']},
# S12
{"cid":88626,"title":"Visual conformance - layout, themes and small-screen stacking",
 "pre":[ACCESS,'A desktop screen and a small screen (under 1024px); the ability to switch light and dark themes.']},
{"cid":88629,"title":"New Dashboard visual conformance - cards, panel, pill, icon, themes",
 "pre":[ACCESS,'A desktop screen with a workplace that has data in every tile; also view on a small screen and switch light/dark. (Compare against the "New Dashboard" design variant only, never the "Current" baseline.)']},
# NF
{"cid":88631,"title":"Dashboard performance budget and per-tile circuit breaker",
 "pre":['You are on the dashboard (sv8311, Reports permission + Dashboard feature) with production-scale data for a workplace. Note: the performance budget and the server-side circuit breaker are developer/automated checks; by hand, confirm the observable behaviour (tiles load within the stated budget, a slow tile shows its own failure without taking the page down).']},
{"cid":88632,"title":"Sales and Advisor Analysis report corrections ship with a note",
 "pre":[ACCESS,'A workplace where you can put a voided invoice, and (conceptually) a no-company invoice, into a date range; access to the Sales report and the Service Advisor Analysis report for that workplace/range.']},
]
L.run_light(C)
