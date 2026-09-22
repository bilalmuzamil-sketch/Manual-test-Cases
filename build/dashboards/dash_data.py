import json, urllib.request, base64, sys
sys.path.insert(0,'/tmp')
from dash_anchor_lib import ANCH, esc
c=json.load(open("/tmp/testrail/creds.json"))
AUTH=base64.b64encode(f"{c['user']}:{c['password']}".encode()).decode()
def post(path,payload):
    req=urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/{path}",
        data=json.dumps(payload).encode(),headers={'Authorization':f'Basic {AUTH}','Content-Type':'application/json'},method='POST')
    return json.load(urllib.request.urlopen(req,timeout=60))
SEC=12180
def block(lines): return "<p>"+"<br>".join(esc(x) for x in lines)+"</p>"
def make(title,pre,steps,results,anchors,extra=None):
    for a in anchors:
        if a not in ANCH: raise SystemExit("missing anchor "+a)
    rl="".join(f"<li>{esc(r)}</li>" for r in results)
    ql="".join(f"<li><strong>{a}:</strong> &ldquo;{esc(ANCH[a])}&rdquo;</li>" for a in anchors)
    if extra: ql+="".join(f"<li><strong>{esc(l)}:</strong> &ldquo;{esc(q)}&rdquo;</li>" for l,q in extra)
    secs=", ".join(sorted({a.split('-')[0] for a in anchors}, key=lambda s:int(s[1:])))
    src=(f"Epic SV-490; Dashboard v1 specification, Confluence page 788430850, section(s) {secs}; "
         f"read on 22 September 2026."+(" Also the Technical Implementation Plan (2026-09-16)." if extra else ""))
    html=("<p><strong>Expected results</strong></p>"f"<ul>{rl}</ul>"
          "<p><strong>Source &mdash; where this behaviour comes from</strong><br>"f"{esc(src)}</p>"
          "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"f"<ul>{ql}</ul>"
          "<p>AUTOMATION: HOLD - not yet build-verified on the sv8311 QA build</p>")
    r=post(f"add_case/{SEC}",{'title':title,'custom_preconds':block(pre),'custom_steps':block(steps),
        'custom_expected':html,'custom_automation_type':2,'custom_atmstatus':1})
    print(f"C{r['id']} | {title}"); return r['id']
P="1. Sign in to sv8311.qa.shopview.com; select a single workplace. 2. Seed the exact records named in each step so the correct answer is known and can be computed by hand (Rule 14)."
PARITY="open the matching report for the SAME workplace, date range and filters (all advisors/technicians selected)"
ids=[]
ids.append(make("Revenue — exact value to the cent, and equals the Sales report",
 [P,"3. Seed a range with several invoices of known subtotals, at least one discount, tax, and a credit memo."],
 ["1. Compute: sum of invoice subtotals BEFORE discount and BEFORE tax, MINUS credit memos.","2. Read the Revenue tile for that range; "+PARITY+"."],
 ["The Revenue headline equals the hand-computed figure exactly, shown to the cent.","The Revenue tile equals the Sales report total for the same inputs."],
 ['S3-R2','S4-R2','S3-R1']))
ids.append(make("Revenue — credit memos and a true negative figure",
 [P,"3. Seed a range where credit memos exceed sales."],
 ["1. Compute the net (subtotals minus credit memos): a negative number.","2. Read the Revenue tile."],
 ["The Revenue tile shows the true negative figure, not floored at zero.","It matches the Sales report for the same range."],
 ['S3-E1','S3-R2']))
ids.append(make("Revenue — voided (and no-company) invoices excluded, matching the corrected Sales report",
 [P,"3. Seed a range with a voided invoice (and, if creatable, a no-company invoice)."],
 ["1. Read Revenue with and without the voided invoice in range.","2. Compare to the Sales report."],
 ["The voided invoice contributes nothing to Revenue.","Revenue equals the Sales report after its void/no-company correction (voided excluded, no-company included).","Whether the report correction shipped is checkable via its release note; the numeric effect is verifiable by the with/without comparison (developer/automated for the code path)."],
 ['S3-E2','S3-R1'],[("Tech plan NFR-010","Sales report totals move for ranges containing voided or no-company invoices")]))
ids.append(make("Revenue — Parts/Labor whole-number split, and the no-split fallback line",
 [P,"3. Seed a range with known parts and labor totals; and a range with no parts-vs-labor split."],
 ["1. Compute parts% and labor% from the range.","2. Read the Revenue supporting line in each range."],
 ["The supporting line reads 'Parts {parts}% · Labor {labor}%' with each percent a whole number matching the computed split.","Where there is no parts-vs-labor split, the supporting line reads '{count} Invoices' instead."],
 ['S4-R3','S4-N2']))
ids.append(make("Billing Efficiency — exact value to two decimals, and equals the Service Advisor Analysis report",
 [P,"3. Seed a range with known invoiced hours and worked hours."],
 ["1. Compute invoiced hours ÷ worked hours × 100.","2. Read the tile; "+PARITY+"."],
 ["The headline equals the computed value to two decimals; the supporting line reads '{invoiced hours} Invoiced / {clocked hours} Clocked'.","It equals the Service Advisor Analysis report."],
 ['S3-R2','S4-R4','S4-R5','S3-R1']))
ids.append(make("Billing Efficiency — shop-wide is total-over-total, NOT the average of advisor percentages",
 [P,"3. Seed advisors with uneven hour volumes (one with many hours at a low %, one with few hours at a high %) so the mean of per-advisor percentages differs from the pooled total."],
 ["1. Compute the pooled figure: SUM(invoiced hours) ÷ SUM(worked hours) × 100 across advisors.","2. Compute the simple average of the per-advisor percentages.","3. Read the tile and compare to both."],
 ["The headline equals the POOLED total-over-total figure, NOT the average of the per-advisor percentages (averaging ratios is a statistical error).","It equals the report with all advisors selected."],
 ['S3-R2','S3-R1']))
ids.append(make("Technician Efficiency — exact value to two decimals, and equals the report",
 [P,"3. Seed a range with known invoiced technician hours and clocked hours."],
 ["1. Compute invoiced tech hours ÷ clocked hours × 100.","2. Read the tile; "+PARITY+"."],
 ["The headline equals the computed value to two decimals; supporting line reads '{invoiced tech hours} Invoiced Tech Hrs / {clocked hours} Clocked'.","It equals the Technician Efficiency report (Invoiced)."],
 ['S3-R2','S4-R6','S4-R7','S3-R1']))
ids.append(make("Technician Efficiency — per-line tech-time split by clocked share; a no-clock line contributes no share",
 [P,"3. Seed a work order line worked by two technicians with a known clocked split (e.g. 70/30); and a line with invoiced tech time but zero clocked time."],
 ["1. Check the allocation of each line's technician time across its technicians.","2. Include the zero-clock line and confirm the total stays finite/correct."],
 ["Each line's technician time is split across technicians in proportion to each technician's clocked-time share on that line (70/30 clocked → 70/30 allocation).","A line with invoiced technician time but no clocked time contributes NO split share (not an infinite one); the figure stays finite and correct."],
 ['S3-R2','S3-E3']))
ids.append(make("Technician Utilization — exact value to two decimals, and equals the report",
 [P,"3. Seed a range with known work-order hours and internal hours."],
 ["1. Compute WO hours ÷ (WO + internal hours) × 100.","2. Read the tile; "+PARITY+"."],
 ["The headline equals the computed value to two decimals; supporting line reads '{work-order hours} WO Hrs / {clocked hours} Clocked'.","It equals the Technician Utilization report."],
 ['S3-R2','S4-R8','S4-R9','S3-R1']))
ids.append(make("Sales by Customer — distinct count (deduped), voids excluded, no-company grouped; equals the report",
 [P,"3. Seed a range where one customer has several invoices, plus a voided invoice, plus (if creatable) a no-company invoice."],
 ["1. Count distinct customers with sales by hand.","2. Read the tile; compare to the Sales By Customer report."],
 ["The headline counts DISTINCT customers (a customer with several invoices counts once).","A voided invoice adds no customer; no-company invoices count as a single 'no company' customer.","It equals the Sales By Customer report, reading '{count} customer' for one and '{count} customers' otherwise."],
 ['S3-R2','S5-R1','S5-R2','S5-E3','S3-E2','S3-R1']))
ids.append(make("At Risk — count logic: window boundary, the two-part OR test, revenue > $0.00, voids affect most-recent invoice",
 [P,"3. Seed: a customer whose last invoice is exactly N days ago and one N-1 days ago; a customer at exactly $0.00 12-mo revenue and one negative but with 2+ lifetime invoices; a customer whose latest invoice is voided."],
 ["1. Test the day boundary at exactly N and N-1 days.","2. Test the OR test and the revenue>$0.00 rule.","3. Void the latest invoice and re-check most-recent-invoice."],
 ["A customer is at-risk when their most recent invoice is AT LEAST the selected days old (N = at risk, N-1 = not).","A customer qualifies with EITHER 2+ lifetime invoices OR revenue > $0.00 in 12 months; exactly $0.00 or negative fails the revenue part but can still qualify on 2+ invoices.","A voided invoice is ignored when deciding the most recent invoice, so voiding the latest can change at-risk status."],
 ['S5-R15','S5-R7','S3-E2']))
ids.append(make("At Risk — day boundary in the workplace timezone",
 [P,"3. A workplace with a known timezone; a customer on the day boundary."],
 ["1. Check 'days old' counting across the shop's midnight.","2. Compare the count seen by two viewers in different locations."],
 ["'Days old' is whole calendar days in the workplace's timezone from the most recent invoice to now.","The count changes at the shop's own midnight, is stable through the working day, and is identical for two viewers of the same workplace."],
 ['S5-R15']))
ids.append(make("At Risk — twelve monthly sparkline points recomputed from current data",
 [P,"3. A workplace with at-risk history; the ability to void an older invoice."],
 ["1. Read the twelve monthly points.","2. Void an invoice in a past month and re-read the points."],
 ["The sparkline shows twelve monthly points, each the at-risk count as of that month's last day in the workplace timezone for the current window; the twelfth is as of now and equals the headline.","A later void changes past points, because every point is recomputed from current data."],
 ['S5-R13']))
ids.append(make("Ratio measures — a zero denominator reads 'n/a', never 0.00%",
 [P,"3. Seed ranges with zero worked hours, zero clocked hours, and zero (WO+internal) hours."],
 ["1. For each ratio measure, put its denominator at zero and read the headline.","2. Compare to a genuine 0.00% (hours recorded, ratio truly zero)."],
 ["With a zero denominator the headline reads exactly 'n/a' (lower case, no periods), never '0.00%'.","A genuine 0.00% is shown as 0.00%, distinct from 'n/a'."],
 ['S3-E3']))
ids.append(make("Sparkline — one correct point per bucket, correct bucket size at each boundary, gaps preserved",
 [P,"3. Ranges hitting the boundaries: 31 vs 32 days, 182 vs 183, 731 vs 732; and a range with an interior empty bucket."],
 ["1. Check bucket size on each side of 31/32, 182/183, 731/732.","2. Check each point vs the measure recomputed over that bucket.","3. Check an empty interior bucket and a <2-point range."],
 ["Bucket size follows the rule: ≤31 days daily, 32–182 weekly, 183–731 monthly, longer quarterly (verified on both sides of each boundary).","Each point equals the measure recomputed over its bucket by the same calculation as the headline.","An empty bucket contributes no point (interior gaps preserved, not zero-filled); the line is not drawn with fewer than two valued points."],
 ['S4-R11']))
ids.append(make("Parity holds at every one of the nine date ranges",
 [P,"3. Seed data spanning 2+ years so every range returns a figure."],
 ["1. For each range option, read each tile and open the matching report for the same range."],
 ["For all nine ranges (Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week) the tile equals its report."],
 ['S3-R1','S7-R2']))
ids.append(make("Filtered parity — a chart/measure filtered to an advisor or technician equals the report filtered the same way",
 [P,"3. A workplace with several advisors and technicians."],
 ["1. Filter the Billing Efficiency chart to one advisor; compare to the report filtered the same.","2. Filter a technician chart to a subset; compare to the report.","3. Check the embedded report chart under the report's active filters."],
 ["A KPI/chart filtered to an advisor or technician equals the matching report filtered the same way.","The embedded chart on a report page shows the same figures as that report under its active filters."],
 ['S3-R1','S8-R5','S11-R7']))
ids.append(make("Internal consistency — headline, sparkline window and expanded table reconcile",
 [P,"3. A tile with data for a chosen range, expanded."],
 ["1. Compare the headline window to the sparkline window (incl. a partial current range).","2. Compare the expanded chart/table range and totals to the headline."],
 ["The headline and sparkline describe the same window, including a partial current range.","The expanded chart and table are for the same range and reconcile with the headline; no point or row contradicts the tile."],
 ['S4-R11','S7-E1','S3-R1']))
ids.append(make("Workplace scoping — every figure is for the selected workplace only",
 [P,"3. Two workplaces with different, known data."],
 ["1. Read every tile for workplace A.","2. Switch to workplace B and back."],
 ["Every tile's figure is for the selected workplace only, with no other workplace's data bleeding in.","Switching workplace reloads all tiles to the new workplace's figures; switching back restores them."],
 ['S1-R4','S1-E1']))
ids.append(make("No stale window — the tile equals the report even right after the data changes",
 [P,"3. The ability to add/void an invoice or add a clock record and immediately re-read both surfaces."],
 ["1. Read a tile and its report (they match).","2. Change the underlying data; immediately re-read both."],
 ["After the change the tile and its report still show the SAME number, with no window in which the tile lags the report.","Proving the cache-invalidation at code level is a developer/automated check; by hand, confirm no observable disagreement after a change."],
 ['S3-R1']))
json.dump(ids, open("build/dashboards/created-DATA.json","w"), indent=2)
print("\nDATA cases created:", len(ids))
