# -*- coding: utf-8 -*-
import importlib.util
spec=importlib.util.spec_from_file_location("dash_lib","build/dashboards/dash_lib.py")
L=importlib.util.module_from_spec(spec); spec.loader.exec_module(L)
BASE=("You are signed in on the build under test (sv8311.qa.shopview.com) with a single workplace selected "
      "(Reports permission + Dashboard feature on). Numeric-accuracy case (Rule 116): seed the exact records "
      "through the app so the correct answer is known and can be computed by hand (Rule 14), then read the figure "
      "back and compare to the stated precision - never eyeball.")
def C(cid,title,seed): return {"cid":cid,"title":title,"pre":[BASE,"Seed through the app: "+seed]}
CASES=[
C(88633,"Revenue - exact value to the cent, and equals the Sales report",
  "a range with several invoices of known subtotals, at least one discount, tax, and a credit memo."),
C(88634,"Revenue - credit memos and a true negative figure",
  "a range where credit memos exceed sales."),
C(88635,"Revenue - voided/no-company invoices excluded, matching the report",
  "a range with a voided invoice (and, if creatable, a no-company invoice)."),
C(88636,"Revenue - Parts/Labor whole-number split and no-split fallback",
  "a range with known parts and labour totals; and a range with no parts-vs-labour split."),
C(88637,"Billing Efficiency - exact to 2dp, equals Advisor Analysis report",
  "a range with known invoiced hours and worked hours."),
C(88638,"Billing Efficiency - total-over-total, not average of advisor %",
  "advisors with uneven hour volumes (one with many hours at a low %, one with few hours at a high %) so the mean of per-advisor percentages differs from the pooled total."),
C(88639,"Technician Efficiency - exact to 2dp, equals the report",
  "a range with known invoiced technician hours and clocked hours."),
C(88640,"Technician Efficiency - per-line tech time split by clocked share",
  "a work order line worked by two technicians with a known clocked split (e.g. 70/30); and a line with invoiced tech time but zero clocked time."),
C(88641,"Technician Utilization - exact to 2dp, equals the report",
  "a range with known work-order hours and internal hours."),
C(88642,"Sales by Customer - distinct count, voids excluded, no-company grouped",
  "a range where one customer has several invoices, plus a voided invoice, plus (if creatable) a no-company invoice."),
C(88643,"At Risk count - window boundary, OR test, revenue>$0, voids",
  "a customer whose last invoice is exactly N days ago and one N-1 days ago; a customer at exactly $0.00 12-month revenue and one negative but with 2+ lifetime invoices; and a customer whose latest invoice is voided."),
C(88644,"At Risk - day boundary in the workplace timezone",
  "a workplace with a known timezone and a customer on the day boundary."),
C(88645,"At Risk - twelve sparkline points recomputed from current data",
  "a workplace with at-risk history, and the ability to void an older invoice."),
C(88646,"Ratio measures - a zero denominator reads 'n/a', never 0.00%",
  "ranges with zero worked hours, zero clocked hours, and zero (WO+internal) hours."),
C(88647,"Sparkline - one point per bucket, correct size at each boundary",
  "ranges hitting the boundaries (31 vs 32 days, 182 vs 183, 731 vs 732) and a range with an interior empty bucket."),
C(88648,"Parity holds at every one of the nine date ranges",
  "data spanning 2+ years so every one of the nine ranges returns a figure."),
C(88649,"Filtered parity - a filtered chart equals the report filtered same",
  "a workplace with several advisors and technicians, so a chart/measure filtered to one equals the report filtered the same way."),
C(88650,"Internal consistency - headline, sparkline and table reconcile",
  "a tile with data for a chosen range, then expanded so the headline, the sparkline window and the detail table can be reconciled."),
C(88651,"Workplace scoping - every figure is for the selected workplace only",
  "two workplaces with different, known data."),
C(88652,"No stale window - the tile equals the report right after a change",
  "data you can change live (add/void an invoice or add a clock record) then immediately re-read both the tile and the report."),
]
L.run_light(CASES)
