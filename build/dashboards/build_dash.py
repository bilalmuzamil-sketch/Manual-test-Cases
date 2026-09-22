#!/usr/bin/env python3
"""Dashboards suite authoring. Expected = QA-lead 2026-09-22 layout (plain results / Source /
exact verbatim quotes). Run: python3 build_dash.py <S#>   (no arg = all)."""
import sys, json, urllib.request, base64
sys.path.insert(0,'/tmp')
from dash_anchor_lib import ANCH, esc
PLAIN={}
for _l in open('/tmp/dash_plain.txt',encoding='utf-8'):
    _l=_l.rstrip('\n')
    if ' ::= ' in _l: k,v=_l.split(' ::= ',1); PLAIN[k]=v
c=json.load(open("/tmp/testrail/creds.json"))
AUTH=base64.b64encode(f"{c['user']}:{c['password']}".encode()).decode()
def post(path,payload):
    req=urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/{path}",
        data=json.dumps(payload).encode(),headers={'Authorization':f'Basic {AUTH}','Content-Type':'application/json'},method='POST')
    return json.load(urllib.request.urlopen(req,timeout=60))
SEC={
 'S1':(12167,'SV-9573','Access & Entry Point'),'S2':(12168,'SV-9574','One Fixed Layout'),
 'S3':(12169,'SV-9575','Measure Formulas & Report Parity'),'S4':(12170,'SV-9576','KPI Hero Tiles'),
 'S5':(12171,'SV-9577','Count Tiles — Sales by Customer & At Risk'),'S6':(12172,'SV-9578','Expanding a Tile'),
 'S7':(12173,'SV-9579','Per-Tile Date Ranges'),'S8':(12174,'SV-9580','Chart Filters'),
 'S9':(12175,'SV-9581','Chart Behavior'),'S10':(12176,'SV-9582','Report Drill-In'),
 'S11':(12177,'SV-9583','Chart on the Report Page'),'S12':(12178,'SV-9584','Visual Conformance'),
}
def block(lines): return "<p>"+"<br>".join(esc(x) for x in lines)+"</p>"
def expected(scode, anchors):
    secid,story,sname=SEC[scode]
    for a in anchors:
        if a not in ANCH: raise SystemExit("MISSING anchor "+a)
        if a not in PLAIN: raise SystemExit("MISSING plain "+a)
    results="".join(f"<li>{esc(PLAIN[a])}</li>" for a in anchors)
    quotes="".join(f"<li><strong>{a}:</strong> &ldquo;{esc(ANCH[a])}&rdquo;</li>" for a in anchors)
    return ("<p><strong>Expected results</strong></p>"
            f"<ul>{results}</ul>"
            "<p><strong>Source &mdash; where this behaviour comes from</strong><br>"
            f"Epic SV-490, story {story} ({scode} &mdash; {esc(sname)}); Dashboard v1 specification, "
            f"Confluence page 788430850, section {scode}; read on 22 September 2026.</p>"
            "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
            f"<ul>{quotes}</ul>"
            "<p>AUTOMATION: HOLD - not yet build-verified on the sv8311 QA build</p>")
def C(scode,title,pre,steps,anchors,atype=2):
    secid=SEC[scode][0]
    return (scode,secid,{'title':title,'custom_preconds':block(pre),'custom_steps':block(steps),
            'custom_expected':expected(scode,anchors),'custom_automation_type':atype,'custom_atmstatus':1})
CASES=[]
PRE_ACCESS="1. Sign in to the QA build (sv8311.qa.shopview.com) as a user who has the Reports permission, in an organization with the Dashboard feature (DashboardAdministrator) turned on."

# ---------------- S1 ----------------
CASES += [
 C('S1',"Dashboard entry, landing, placement and workplace scope",
   [PRE_ACCESS, "2. Have at least two workplaces selectable in the top navigation."],
   ["1. Look at the top navigation for a 'Dashboard' entry, and confirm it sits immediately to the right of 'Reports'.",
    "2. Select 'Dashboard' and confirm the dashboard screen opens.",
    "3. Log out and log back in; confirm you land on the dashboard.",
    "4. Confirm the figures shown are for the workplace currently selected in the top navigation."],
   ['S1-R1','S1-R2','S1-R3','S1-R4','S1-R5']),
 C('S1',"Access gates and server-side enforcement",
   [PRE_ACCESS],
   ["1. Confirm the 'Dashboard' entry appears only when both gates are true — the reportsPageAccess permission and the DashboardAdministrator organization feature.",
    "2. Note for the tester: proving the server itself refuses a dashboard request when the entry is merely hidden cannot be done by hand — it is a developer/automated check. By hand, confirm that a user missing either gate has no 'Dashboard' entry and is taken to Work Orders (below).",
    "3. As a user who fails a gate, log in and confirm you land on Work Orders; then enter the dashboard address directly and confirm it redirects to Work Orders rather than showing an error page."],
   ['S1-R6','S1-R7','S1-R8']),
 C('S1',"Access negatives — missing permission or missing feature",
   ["1. Two test users: one without the Reports permission; one with the Reports permission but in an org where the Dashboard feature is off."],
   ["1. As the user without the Reports permission, confirm no 'Dashboard' entry and no way to open the dashboard, and that they do not land on it at login.",
    "2. As the user in an org without the Dashboard feature, confirm no 'Dashboard' entry even though they have the Reports permission, and that they cannot open the dashboard by any route."],
   ['S1-N1','S1-N2','S1-N3','S1-N4']),
 C('S1',"The shop logo is inert branding, not navigation",
   [PRE_ACCESS, "2. Have a desktop screen and a small screen (browser window under 1024px)."],
   ["1. On desktop, select the shop logo in the top navigation and confirm it is not a link and does nothing.",
    "2. On a small screen, confirm the shop logo is separate from the menu button (tapping the logo does not open the menu), and the menu button has its own menu icon and opens the menu when tapped.",
    "3. Note for the tester: confirming the logo sends no analytics event is a developer/automated check, not a manual step."],
   ['S1-N5','S1-N6','S1-N7','S1-N8','S1-N9']),
 C('S1',"Workplace edge cases — switching and none selected",
   [PRE_ACCESS, "2. Two workplaces available; and the ability to have no workplace selected."],
   ["1. Switch the selected workplace in the top navigation and confirm the dashboard reloads its figures for the newly selected workplace.",
    "2. With no workplace selected, confirm the dashboard does not load data."],
   ['S1-E1','S1-E2']),
]
# ---------------- S2 ----------------
CASES += [
 C('S2',"The fixed tile set and order",
   [PRE_ACCESS],
   ["1. Open the dashboard and confirm the top row shows four KPI tiles left to right: Revenue, Billing Efficiency, Technician Efficiency, Technician Utilization.",
    "2. Confirm the row below shows two count tiles left to right: Sales by Customer, At Risk Customers.",
    "3. Sign in as a different user and confirm the same tile set and order, and that all six tiles are shown to every user who can open the dashboard."],
   ['S2-R1','S2-R2','S2-R3','S2-R4']),
 C('S2',"No customization controls exist",
   [PRE_ACCESS],
   ["1. Look across the dashboard for any control to add, remove, reorder, or hide/show a tile; confirm none exists.",
    "2. Rearrange nothing, sign out and back in, and confirm no saved layout carries over between sessions (the fixed layout is unchanged)."],
   ['S2-N1','S2-N2','S2-N3','S2-N4','S2-N5']),
]
# ---------------- S3 ----------------
CASES += [
 C('S3',"Report parity — every tile figure equals its report",
   [PRE_ACCESS, "2. A workplace with data for Revenue, Billing Efficiency, Technician Efficiency, Technician Utilization and Sales by Customer.",
    "3. To check a KPI tile against its report, open the matching report with all advisors/technicians selected (no filter)."],
   ["1. For each measure, read the tile's figure for a date range, then open its matching report for the same workplace, date range and filters and read the same figure.",
    "2. Confirm the tile and the report show the same number, and that they never disagree.",
    "3. Note for the tester: proving there is no caching/staleness gap at the code level is a developer/automated check; by hand, confirm the two figures match whenever you compare them."],
   ['S3-R1','S3-N1']),
 C('S3',"Measure formulas",
   [PRE_ACCESS, "2. A workplace with known invoices, labour and clocked-hours data so each measure can be computed by hand."],
   ["1. For a chosen range, compute each measure by the spec formula and compare to the tile: Revenue (invoice subtotals before discount and tax, minus credit memos, to the cent); Billing Efficiency (invoiced hours ÷ worked hours × 100); Technician Efficiency (invoiced tech hours ÷ clocked hours × 100, per-line tech time split by clocked-time share); Technician Utilization (work-order hours ÷ (work-order + internal hours) × 100).",
    "2. Confirm Sales by Customer is the count of distinct customers with sales in the range, At Risk Customers is the count per the at-risk rule, and ELR (on the Billing Efficiency chart) is labour sales ÷ worked hours per advisor.",
    "3. Confirm each measure reads against its named matching report."],
   ['S3-R2']),
 C('S3',"Void exclusion, negative revenue, and the n/a state",
   [PRE_ACCESS, "2. A workplace where you can create a voided invoice, a range where credit memos exceed sales, and a range with zero worked/clocked hours."],
   ["1. With a voided invoice in the range, confirm it is excluded from every figure (Revenue, parts/labor split, invoiced hours, invoiced tech hours, Sales by Customer count, At Risk count including 'most recent invoice').",
    "2. In a range where credit memos exceed sales, confirm Revenue shows the true negative figure (not floored at zero).",
    "3. In a range with a zero denominator, confirm the ratio tile headline reads exactly 'n/a' (lower case, no periods), not '0.00%'."],
   ['S3-E1','S3-E2','S3-E3']),
]
# ---------------- S4 ----------------
CASES += [
 C('S4',"KPI tile anatomy, and the Revenue and Billing Efficiency headlines and supporting lines",
   [PRE_ACCESS, "2. A workplace with revenue and billing-efficiency data for the selected range."],
   ["1. On each KPI tile, confirm it shows a label, a headline value, a sparkline, a date-range control and a report link.",
    "2. On the Revenue tile, confirm the headline is total revenue to the cent and the supporting line reads 'Parts {parts}% · Labor {labor}%' with whole-number percents.",
    "3. On the Billing Efficiency tile, confirm the headline is the percentage to two decimals and the supporting line reads '{invoiced hours} Invoiced / {clocked hours} Clocked'."],
   ['S4-R1','S4-R2','S4-R3','S4-R4','S4-R5']),
 C('S4',"Technician Efficiency and Technician Utilization headlines and supporting lines",
   [PRE_ACCESS, "2. A workplace with technician efficiency and utilization data for the selected range."],
   ["1. On the Technician Efficiency tile, confirm the headline is the percentage to two decimals and the supporting line reads '{invoiced tech hours} Invoiced Tech Hrs / {clocked hours} Clocked'.",
    "2. On the Technician Utilization tile, confirm the headline is the percentage to two decimals and the supporting line reads '{work-order hours} WO Hrs / {clocked hours} Clocked'."],
   ['S4-R6','S4-R7','S4-R8','S4-R9']),
 C('S4',"The KPI sparkline and how it buckets the range",
   [PRE_ACCESS, "2. Ranges of different lengths available (e.g. This Month, This Quarter, Last 12 Months, and a multi-year range); a range with an interior bucket that has no value."],
   ["1. Confirm each KPI tile's sparkline shows the measure trending over the selected range.",
    "2. For ranges of different lengths, confirm the bucket size follows the rule (≤31 days by day; 32-182 by week; 183-731 by month; longer by quarter) and each point matches the measure recomputed over that bucket.",
    "3. Confirm a bucket with no value contributes no point (interior gaps are preserved, not drawn as zero), and the line is not drawn when fewer than two points have values."],
   ['S4-R10','S4-R11']),
 C('S4',"KPI negatives and extreme values",
   [PRE_ACCESS, "2. A Revenue range with no parts-versus-labor split; a report with an extreme value."],
   ["1. Confirm no KPI tile shows a delta indicator (the sparkline is the only comparison).",
    "2. On a Revenue range with no parts/labor split, confirm the supporting line reads '{count} Invoices' instead.",
    "3. With an extreme underlying value, confirm the tile headline still shows the true figure to the report's precision."],
   ['S4-N1','S4-N2','S4-E1']),
]
# ---------------- S5 ----------------
CASES += [
 C('S5',"The Sales by Customer tile",
   [PRE_ACCESS, "2. A workplace with sales to several distinct customers in the range (and a range with exactly one customer)."],
   ["1. Confirm the headline is the count of distinct customers with sales in the selected range, reading '{count} customer' for one and '{count} customers' otherwise.",
    "2. Confirm the supporting line reads 'Top: {top customer name}'.",
    "3. Confirm the tile has its own date-range control and a report link to the Sales By Customer report.",
    "4. Confirm the sparkline shows the customer count over the selected range, bucketed like the KPI sparklines, so headline and sparkline describe the same window."],
   ['S5-R1','S5-R2','S5-R3','S5-R4','S5-R5','S5-R6']),
 C('S5',"The At Risk Customers tile — headline, supporting line and window control",
   [PRE_ACCESS, "2. A workplace with at-risk customers (one, and more than one) for a chosen inactivity window."],
   ["1. Confirm the headline is the count of at-risk customers for the selected window, as a plain number.",
    "2. With exactly one at-risk customer, confirm the supporting line reads '${revenue} (12mo) · {customer name}'; with more than one, '${revenue} (12mo) · {count} customers'.",
    "3. Confirm the inactivity-window control offers 30, 60, 90, 120 and 180 days and defaults to 120.",
    "4. Change the window and confirm the headline, supporting line, sparkline and detail table all update."],
   ['S5-R7','S5-R8','S5-R9','S5-R10','S5-R11','S5-R12']),
 C('S5',"At Risk sparkline, remembered window, and the at-risk definition",
   [PRE_ACCESS, "2. A workplace with at-risk history over the last twelve months; a customer whose 12-month revenue is exactly $0.00 or negative; a customer with two or more lifetime invoices."],
   ["1. Confirm the At Risk sparkline shows twelve monthly points over the trailing twelve months, the twelfth as of now (equalling the headline), recomputed from current data.",
    "2. Change the window, revisit later, and confirm the chosen window is remembered on the next visit (not reset to 120).",
    "3. Confirm 'some revenue in the last twelve months' means greater than $0.00 (a $0.00 or negative 12-month total fails that part but can still qualify on two-or-more lifetime invoices), and that 'days old' is counted in whole calendar days in the workplace timezone from the most recent invoice to now."],
   ['S5-R13','S5-R14','S5-R15']),
 C('S5',"Count-tile negatives and edge cases",
   [PRE_ACCESS, "2. A range with no customer sales; a window with no at-risk customers; the 'no company' invoice path (QA should expect to create this case)."],
   ["1. Confirm neither count tile shows a delta indicator, and the At Risk tile shows no report link.",
    "2. With no sales in the range, confirm Sales by Customer headline shows 0; with no at-risk customers, confirm At Risk headline shows 0.",
    "3. Confirm sales on invoices with no company are counted together as a single 'no company' customer in the Sales by Customer count."],
   ['S5-N1','S5-N2','S5-E1','S5-E2','S5-E3']),
]
# ---------------- S6 ----------------
CASES += [
 C('S6',"View details expands each tile to its own detail content",
   [PRE_ACCESS, "2. A desktop screen; a workplace with data in every tile."],
   ["1. On each tile, confirm a 'View details' control that expands the tile to reveal its detail (chart, table, or both).",
    "2. Confirm the Revenue tile expands to the Revenue chart; Billing Efficiency to the Billing Efficiency chart and the Advisor Analysis table; Technician Efficiency to its chart and table; Technician Utilization to its chart and table.",
    "3. Confirm the Sales by Customer tile expands to the Sales by Customer table."],
   ['S6-R1','S6-R2','S6-R3','S6-R4','S6-R5','S6-R6','S6-R7']),
 C('S6',"The At Risk detail table — ordering and the 500-row cap",
   [PRE_ACCESS, "2. A workplace with several at-risk customers (and, if reachable, a workplace exceeding 500)."],
   ["1. Expand the At Risk Customers tile and confirm the table lists every at-risk customer, ordered by trailing-twelve-month revenue highest first, with customer name as the tiebreaker.",
    "2. Where a workplace exceeds 500 at-risk customers, confirm the table shows the first 500 in that order and says 'Showing 500 of N at-risk customers', while the headline still counts every one (it never truncates silently)."],
   ['S6-R8']),
 C('S6',"One detail open at a time, and controls that do not expand",
   [PRE_ACCESS],
   ["1. Expand one tile, then expand another; confirm at most one tile's detail is open and the previously open detail closes.",
    "2. Confirm only the 'View details' control expands or collapses a tile.",
    "3. Confirm selecting the date-range/inactivity-window control does not expand the tile, and selecting the report link does not expand the tile."],
   ['S6-R9','S6-R10','S6-R11','S6-R12','S6-R13']),
 C('S6',"Loading, per-tile failure, and browser-stored choices",
   [PRE_ACCESS, "2. Ability to observe a tile loading and (if reachable) a tile whose data fails to load."],
   ["1. While figures load, confirm a tile shows a placeholder for its headline/supporting line/sparkline with label and controls readable — never blank and never a stale figure from a previous range.",
    "2. If a tile's data cannot load, confirm it shows it could not load while the other five still render, with no toast or alert.",
    "3. Set an expanded tile, a chart filter, and the At Risk window, then reopen in the same browser (remembered) versus a different browser/private window (back to defaults), confirming these choices are stored per browser and clearing browser data resets them."],
   ['S6-R14','S6-R15','S6-R16']),
 C('S6',"Expansion negatives and small-screen behaviour",
   [PRE_ACCESS, "2. A small screen (browser window under 1024px)."],
   ["1. Confirm there is no 'expand all' / 'collapse all' control and no Panel-versus-Inline view choice.",
    "2. On a small screen, confirm a tile cannot be expanded in place; in place of 'View details' the footer is a 'View Report' link that opens the tile's full report.",
    "3. On a small screen, confirm the At Risk Customers tile shows no footer link (no report) and its detail table is reachable only on a desktop screen."],
   ['S6-N1','S6-N2','S6-E1','S6-E2','S6-E3']),
]
# ---------------- S7 ----------------
CASES += [
 C('S7',"Per-tile date ranges — options, updates and independence",
   [PRE_ACCESS],
   ["1. Confirm each KPI tile and the Sales by Customer tile has its own date-range control offering, in order: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week.",
    "2. Change one tile's range and confirm its headline, sparkline, and (when expanded) its chart and table all update for the new range.",
    "3. Confirm changing one tile's range does not change any other tile's range."],
   ['S7-R1','S7-R2','S7-R3','S7-R4','S7-R5','S7-R6']),
 C('S7',"Default ranges, not remembered, and partial ranges",
   [PRE_ACCESS],
   ["1. Open the dashboard fresh and confirm the four KPI tiles default to This Month and the Sales by Customer tile to Last 12 Months.",
    "2. Change some ranges, leave and revisit, and confirm each tile opens on its default again (ranges are not remembered).",
    "3. On a range that has not finished, confirm the headline and sparkline both describe the same partial window."],
   ['S7-R7','S7-R8','S7-E1']),
]
# ---------------- S8 ----------------
CASES += [
 C('S8',"Technician and advisor chart filters",
   [PRE_ACCESS, "2. Expand the Technician Efficiency, Technician Utilization and Billing Efficiency tiles to their charts; a workplace with several technicians and advisors."],
   ["1. Confirm the Technician Efficiency and Technician Utilization charts each have a Technician filter that lets you select any number of technicians and defaults to all selected.",
    "2. Confirm the Billing Efficiency chart has an Advisor filter that selects a single advisor and shows all advisors when none is chosen (the default).",
    "3. Change a chart filter and confirm the chart reloads scoped to the selection; revisit and confirm the filter selection is remembered for that tile."],
   ['S8-R1','S8-R2','S8-R3','S8-R4','S8-R5','S8-R6']),
 C('S8',"Deselecting every technician hides the chart",
   [PRE_ACCESS, "2. A technician chart expanded."],
   ["1. On a technician chart, deselect every technician and confirm the chart is hidden rather than shown empty (until at least one technician is selected again)."],
   ['S8-N1']),
]
# ---------------- S9 ----------------
CASES += [
 C('S9',"Value-axis scaling and the 200% cap",
   [PRE_ACCESS, "2. A percentage chart expanded; data where one value is far above the rest (an outlier above 200% with the pooled median at or below 200%), and separately data whose highest value is at or below 200%."],
   ["1. Confirm a percentage chart's value axis fits the range of the data shown.",
    "2. With an outlier above 200% while the pooled median across all drawn lines stays at or below 200%, confirm the axis caps at 200%; a clipped value still shows its true value on hover.",
    "3. When the highest value is at or below 200%, confirm the axis simply fits the data and no cap applies."],
   ['S9-R1','S9-R2','S9-R3']),
 C('S9',"Billing Efficiency lines, ELR on hover, and no extra series",
   [PRE_ACCESS, "2. The Billing Efficiency chart expanded with several advisors; the technician charts expanded."],
   ["1. Confirm the Billing Efficiency chart draws one billing-efficiency line per advisor.",
    "2. Hover a point and confirm the tooltip shows that advisor's billing efficiency percent and ELR dollar amount, and that ELR is not drawn as its own line or axis.",
    "3. Confirm each chart draws only the lines its story defines (one per selected technician, or one per advisor) with no shop-average, aggregate or other reference line."],
   ['S9-R4','S9-R5','S9-R6','S9-R7']),
]
# ---------------- S10 ----------------
CASES += [
 C('S10',"Report drill-in from the tiles",
   [PRE_ACCESS, "2. A KPI tile and the Sales by Customer tile with a chosen date range."],
   ["1. Confirm each KPI tile and the Sales by Customer tile shows a report link, and hovering it shows a tooltip naming the report it opens.",
    "2. Select a tile's report link and confirm it opens that tile's matching report, opened with the date range the tile currently shows.",
    "3. Confirm the At Risk Customers tile shows no report link (there is no At Risk report)."],
   ['S10-R1','S10-R2','S10-R3','S10-R4','S10-N1']),
]
# ---------------- S11 ----------------
CASES += [
 C('S11',"Embedded chart on the report page — presence, toggle, report filters, parity, remembered",
   [PRE_ACCESS, "2. Open each report that has an embedded chart: Sales, Service Advisor Analysis, Technician Efficiency, Technician Utilization."],
   ["1. Confirm the report page shows its matching chart above the report's detail table, with a 'Show chart' / 'Hide chart' control.",
    "2. Confirm the embedded chart reflects the report's own active filters (date range and technician/advisor selection) and shows the same figures as the report it sits on.",
    "3. Toggle show/hide, leave and revisit the report, and confirm the choice is remembered per report."],
   ['S11-R1','S11-R2','S11-R3','S11-R7','S11-E1']),
 C('S11',"The embedded chart has no controls of its own",
   [PRE_ACCESS, "2. A report page with its embedded chart shown."],
   ["1. Confirm the embedded chart has no date-range control of its own.",
    "2. Confirm the embedded chart has no technician or advisor filter of its own.",
    "3. Confirm the embedded chart shows no report link."],
   ['S11-R4','S11-R5','S11-R6']),
]
# ---------------- S12 ----------------
CASES += [
 C('S12',"Visual conformance — layout, themes and small-screen stacking",
   [PRE_ACCESS, "2. A desktop screen and a small screen (under 1024px); the ability to switch light and dark themes."],
   ["1. On a desktop screen (1024px or wider), confirm the four KPI tiles sit in one row and the two count tiles in a row below.",
    "2. Confirm the tiles' descriptive text (labels, supporting lines, and the date-range/inactivity-window controls) is near-black in the light theme and near-white in the dark theme, and the dashboard renders correctly in both.",
    "3. Confirm the count tiles show their headline count in a larger size than the KPI tiles' headline.",
    "4. On a small screen (under 1024px), confirm the tiles stack in a single column."],
   ['S12-R1','S12-R2','S12-R3','S12-R4','S12-R5','S12-N1']),
]

# ---- runner / coverage ----
from collections import Counter
want=sys.argv[1] if len(sys.argv)>1 else None
if want=='--cov':
    used=Counter()
    for scode,secid,p in CASES: pass
    # recompute anchors per case by re-reading expected is hard; instead track via a parallel structure
    sys.exit(0)
created=[]
for scode,secid,p in CASES:
    if want and want not in (None,) and scode!=want: continue
    r=post(f"add_case/{secid}",p)
    created.append({'id':r['id'],'section':secid,'scode':scode,'title':p['title']})
    print(f"C{r['id']} <- {secid} ({scode}) | {p['title']}")
if created:
    path=f"build/dashboards/created-{want or 'ALL'}.json"
    json.dump(created,open(path,'w'),indent=2)
    print("wrote",path,"|",len(created),"cases")
