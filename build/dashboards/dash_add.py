import json, urllib.request, base64
c=json.load(open("/tmp/testrail/creds.json"))
AUTH=base64.b64encode(f"{c['user']}:{c['password']}".encode()).decode()
def post(path,payload):
    req=urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/{path}",
        data=json.dumps(payload).encode(),headers={'Authorization':f'Basic {AUTH}','Content-Type':'application/json'},method='POST')
    return json.load(urllib.request.urlopen(req,timeout=60))
def esc(s): return s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
def block(lines): return "<p>"+"<br>".join(esc(x) for x in lines)+"</p>"
DES="Design — Dashboard v1 design directions, NEW DASHBOARD variant (Claude design export in sources/design/); read 22 September 2026. PRD 788430850 Story 12 defers the visual detail to this design."
TP="Dashboard v1 — Technical Implementation Plan (sources/Dashboard-v1-Technical-Implementation-Plan.md, 2026-09-16). It informs, it does not overrule the PRD (Rules 30/57)."
def make(secid,title,pre,steps,results,quotes,source,marker="AUTOMATION: HOLD - not yet build-verified on the sv8311 QA build"):
    rl="".join(f"<li>{esc(r)}</li>" for r in results)
    ql="".join(f"<li><strong>{esc(lab)}:</strong> &ldquo;{esc(q)}&rdquo;</li>" for lab,q in quotes)
    html=("<p><strong>Expected results</strong></p>"f"<ul>{rl}</ul>"
          "<p><strong>Source &mdash; where this behaviour comes from</strong><br>"f"{esc(source)}</p>"
          "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"f"<ul>{ql}</ul>"
          f"<p>{esc(marker)}</p>")
    r=post(f"add_case/{secid}",{'title':title,'custom_preconds':block(pre),'custom_steps':block(steps),
        'custom_expected':html,'custom_automation_type':2,'custom_atmstatus':1})
    print(f"C{r['id']} <- {secid} | {title}")
    return r['id']
ids=[]
PRE="1. Sign in to sv8311.qa.shopview.com as a user who can open the dashboard (Reports permission + Dashboard feature), on a desktop screen, with a workplace that has data in every tile."
# D1 — KPI expansion columns (S6, 12172)
ids.append(make(12172,
 "Expanded KPI detail tables show the design's columns (Advisor Analysis, Technician Efficiency, Technician Utilization)",
 [PRE],
 ["1. Expand the Billing Efficiency tile and confirm its detail (Advisor Analysis) table.",
  "2. Expand the Technician Efficiency tile, then the Technician Utilization tile."],
 ["Expanding Billing Efficiency shows the Advisor Analysis table with columns: Advisor, Worked Hours, Invoiced Hrs, Billing Efficiency, ELR.",
  "Expanding Technician Efficiency shows the table with columns: Tech, Clocked Hrs, Invoiced Tech Hrs, Efficiency.",
  "Expanding Technician Utilization shows the table with columns: Tech, WO Hours, Internal Hours, Total Hours, Utilization %.",
  "Each detail table is the matching report's own table, shown in the tile's one full-width detail panel."],
 [("Design (nesting concept)","each one opens to reveal its own chart and detail table — on click"),
  ("Design (Advisor Analysis columns)","Advisor  Worked Hours  Invoiced Hrs  Billing Efficiency  ELR"),
  ("Design (Technician Efficiency columns)","Tech  Clocked Hrs  Invoiced Tech Hrs  Efficiency"),
  ("Design (Technician Utilization columns)","Tech  WO Hours  Internal Hours  Total Hours  Utilization %")],
 DES))
# D2 — count expansion columns (S6, 12172)
ids.append(make(12172,
 "Expanded count detail tables show the design's columns — Sales by Customer (with pagination) and At Risk",
 [PRE],
 ["1. Expand the Sales by Customer tile and read the table columns and its pagination.",
  "2. Expand the At Risk Customers tile and read the table columns."],
 ["Expanding Sales by Customer shows a table with columns: Customer, Invoices, Labor Delta, Subtotal, and it paginates (e.g. '1–10 of 15').",
  "Expanding At Risk Customers shows a table with columns: Customer, Last Invoice Date, Lifetime Invoices, Revenue (12 Mo).",
  "Each detail table is the matching report's own table (At Risk has no report, so its table is the dashboard-only at-risk list)."],
 [("Design (Sales by Customer columns)","Customer  Invoices  Labor Delta  Subtotal"),
  ("Design (Sales by Customer pagination)","1–10 of 15"),
  ("Design (At Risk columns)","Customer  Last Invoice Date  Lifetime Invoices  Revenue (12 Mo)")],
 DES))
# D3 — New Dashboard visual (S12, 12178)
ids.append(make(12178,
 "New Dashboard visual conformance — nested cards, one swapping detail panel, filter pill, report icon, light/dark",
 [PRE, "2. Also view on a small screen and switch light/dark."],
 ["1. Confirm the four hero KPI cards sit in one compact row with Sales by Customer and At Risk as two more hero cards just below, each a headline count rather than a dollar figure.",
  "2. Click a card and confirm its chart + detail table open in a single full-width panel below the row; click another card and confirm the panel swaps (one detail panel open at a time), with cards collapsed by default.",
  "3. Confirm each hero's date filter is a blue filter pill, and its full report opens from an arrow-in-a-square icon beside the hero name.",
  "4. Confirm the dashboard renders natively in both light and dark."],
 ["The KPI heroes sit in one compact row; Sales by Customer and At Risk read as two more heroes below (headline count, not a dollar figure).",
  "Clicking a card opens its chart and detail table in a single full-width panel below the row, and clicking another swaps the panel — one detail panel open at a time, collapsed by default.",
  "The date filter is a blue filter pill; the report opens from an arrow-in-a-square icon beside the hero name.",
  "The dashboard renders in native light and dark."],
 [("Design (nesting concept)","the four hero KPIs sit in one compact row, with Sales by Customer and At Risk Customers as two more heroes just below (a headline count, not a dollar figure). Click any card and its chart + detail table open in a single full-width panel below — click another and the panel swaps. Minimal scroll, one thing in focus at a time."),
  ("Design (affordances)","Each hero's date filter is a blue filter pill, and its full report opens from the arrow-in-a-square icon right beside the hero name."),
  ("Design (mode)","Native light + dark · collapsed by default to cut scrolling · one detail panel open at a time.")],
 DES))
# S5 add — At Risk aggregate revenue (S5, 12171) — tech plan FR-016
ids.append(make(12171,
 "At Risk supporting-line revenue is the aggregate across all at-risk customers, not the displayed rows",
 [PRE, "2. A workplace with several at-risk customers, enough that the detail table would be capped is ideal (or reason about it)."],
 ["1. Read the At Risk tile's supporting line for more than one at-risk customer.",
  "2. Expand the At Risk table and compare the supporting-line revenue against the sum of the rows shown."],
 ["The '${revenue} (12mo)' in the At Risk supporting line is the total trailing-twelve-month revenue across ALL at-risk customers, computed server-side.",
  "It is never the sum of the rows shown in the table — the table can be capped at 500 rows while the aggregate still covers everyone."],
 [("Tech plan FR-016","where that revenue is the total trailing-twelve-month revenue across all at-risk customers (a server-computed aggregate, never a sum of the displayed rows)"),
  ("Tech plan (response contract)","At Risk's meta carries the aggregate trailing-twelve-month revenue across all at-risk customers (S5-R9). The frontend never sums the table rows for it, because the table can be capped while the aggregate must cover everyone.")],
 "Tech plan FR-016 / response contract (sources/Dashboard-v1-Technical-Implementation-Plan.md, 2026-09-16); supports PRD S5-R9 and S6-R8. Informs, does not overrule (Rules 30/57)."))
# T1 — performance NFR-001 (NF, 12179)
ids.append(make(12179,
 "Dashboard performance budget and per-tile circuit breaker (NFR-001)",
 ["1. The dashboard on sv8311 with production-scale data for a workplace."],
 ["1. Note for the tester: the latency budgets below are measured with performance tooling (server timing / APM), not by eye — this is a developer/automated check, not a manual UI step.",
  "2. By hand you can still confirm the behaviour the budget protects: the dashboard first load is fast and, if one tile's query is slow or times out, only that tile shows a load failure while the other five render (per S6-R15)."],
 ["No dashboard query exceeds 500 ms (anything above is a defect and alerted); per-tile server time p95 is at or under 250 ms; the six-tile first load p95 is at or under 1 s.",
  "Every dashboard statement has a 2-second execution-time circuit breaker, and a query that trips it fails only its own tile (not the whole dashboard)."],
 [("Tech plan NFR-001","No dashboard query may exceed 500 ms; anything above is treated as a defect and alerted. Per-tile server time targets p95 ≤ 250 ms; the six-tile first load targets p95 ≤ 1 s (a slight overrun is acceptable). Every dashboard statement carries a 2 s MAX_EXECUTION_TIME circuit breaker, and a query that trips it fails only its own tile (FR-021)")],
 TP,
 marker="AUTOMATION: HOLD - performance NFR; needs load/timing measurement (not a manual UI check) and not yet build-verified on sv8311"))
# T2 — report corrections + release note NFR-010 (NF, 12179)
ids.append(make(12179,
 "Sales and Service Advisor Analysis report corrections (void & no-company) ship with a release note (NFR-010)",
 ["1. sv8311 with a workplace where you can put a voided invoice, and (conceptually) a no-company invoice, into a date range.",
  "2. Access to the Sales report and the Service Advisor Analysis report for that workplace/range."],
 ["1. For a range containing a voided invoice, confirm the Sales report total no longer includes it (and Revenue tile matches), and that a no-company invoice is included in the Sales report.",
  "2. On the Service Advisor Analysis report for such a range, confirm advisor revenue, ELR, the hours columns and Labor Efficiency % have moved, and walk-in sales are included.",
  "3. Confirm the void-then-reinvoice case can move a figure UP (the report had been showing the voided invoice's numbers), and that a plain-language release note ships describing both corrections.",
  "4. Note for the tester: confirming the release note shipped is a process check; the figure changes are verifiable by hand as above."],
 ["The Sales report and the Service Advisor Analysis report both exclude voided invoices and include no-company/walk-in sales; their totals move for ranges containing voided or no-company invoices.",
  "On Service Advisor Analysis, revenue, ELR, the hours columns and therefore Labor Efficiency % move for those periods, and advisor figures gain walk-in sales.",
  "The void-then-reinvoice case can move a figure UP, and both corrections ship under one plain-language release note."],
 [("Tech plan NFR-010","Both report corrections ship with one plain-language release note: Sales report totals move for ranges containing voided or no-company invoices, and on Service Advisor Analysis revenue, ELR and the hours columns, and therefore Labor Efficiency %, move for those periods, while advisor figures gain walk-in sales. It must also call out the void-then-reinvoice case, where a figure can move up")],
 "Tech plan NFR-010 + PRD S3-E2 context note (Chris ruling 2026-09-15/16). Informs, does not overrule (Rules 30/57)."))
json.dump(ids, open("build/dashboards/created-ADD.json","w"), indent=2)
print("created add cases:", ids)
