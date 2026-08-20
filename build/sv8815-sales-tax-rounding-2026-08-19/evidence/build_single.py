# ONE complete, standalone Jira comment for a QA-PASSED ticket.
# House format: overall status first, then what was tested, then the annotated evidence,
# then a rule, then the technical detail last. No correction/apology framing - it reads as
# the QA result, because that is what it is.
import json

RAW=('https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/'
     'claude/heic-upload-iphone-test-sz7h5p/build/sv8815-sales-tax-rounding-2026-08-19/evidence/')

adf=json.load(open('/tmp/sv8815/adf-final.json'))
checks=json.load(open('/tmp/sv8815/checks-table.json'))
caps=json.load(open('/tmp/sv8815/captions.json'))

def t(s,marks=None):
    n={"type":"text","text":s}
    if marks: n["marks"]=[{"type":m} for m in marks]
    return n
def p(*k): return {"type":"paragraph","content":list(k)}
def h(l,s): return {"type":"heading","attrs":{"level":l},"content":[t(s)]}
def panel(kind,*k): return {"type":"panel","attrs":{"panelType":kind},"content":list(k)}
def rule(): return {"type":"rule"}
def img(fn,cap):
    return [{"type":"mediaSingle","attrs":{"layout":"full-width"},
             "content":[{"type":"media","attrs":{"type":"external","url":RAW+fn}}]},
            p(t(cap,["em"]))]
def cellnode(txt,head):
    marks=["strong"] if (not head and txt.strip().startswith('PASSED')) else None
    return {"type":"tableHeader" if head else "tableCell","attrs":{},
            "content":[p(t(txt if txt.strip() else " ",marks))]}
def tbl(rows):
    return {"type":"table","attrs":{"isNumberColumnEnabled":False,"layout":"default"},
            "content":[{"type":"tableRow","content":[cellnode(c,i==0) for c in r]}
                       for i,r in enumerate(rows)]}
def olist(items): return {"type":"orderedList","content":[{"type":"listItem","content":[p(*x)]} for x in items]}
def blist(items): return {"type":"bulletList","content":[{"type":"listItem","content":[p(*x)]} for x in items]}

# reuse the AC + open-question tables verbatim from the earlier write-up
def find_tables(n,out):
    if isinstance(n,dict):
        if n.get('type')=='table': out.append(n)
        for v in n.values(): find_tables(v,out)
    elif isinstance(n,list):
        for v in n: find_tables(v,out)
def flat(n):
    if isinstance(n,dict):
        if n.get('type')=='text': return n['text']
        return ''.join(flat(c) for c in n.get('content',[]))
    if isinstance(n,list): return ''.join(flat(c) for c in n)
    return ''
ts=[]; find_tables(adf,ts)
ac_rows=[[flat(c) for c in r['content']] for r in ts[0]['content']]
oq_rows=[[flat(c) for c in r['content']] for r in ts[1]['content']]

passed=[r for r in checks[1:] if r[0].strip().isdigit()]
assert len(passed)==30, len(passed)
new_rows=[
 ["31","Return 1 of 3 received parts on an \"Invoice total\" invoice - the issued invoice is unchanged (244.00 / 23.79 / 267.79)","PASSED"],
 ["32","The same return on a \"Line by line\" invoice, run as a control - identical, also unchanged","PASSED"],
 ["33","Post the vendor credit for that returned part - the issued invoice is still unchanged","PASSED"],
]
gap_rows=[
 ["-","Taxable fee or discount on a work order",
  "NOT TESTABLE - both entry points reach the full dialog, but Add is disabled and the API refuses until a QuickBooks Fee/Discount item is mapped, and no QuickBooks company is attached to this org so that mapping cannot be created here"],
 ["-","The QuickBooks side - the $0.01 open balance the banner warns about",
  "NOT TESTABLE - needs a QuickBooks-connected company; a manual-tester task"],
]
check_rows=[checks[0]]+passed+new_rows+gap_rows

C=[]
C.append(panel("success",
  p(t("OVERALL QA STATUS: PASSED",["strong"])),
  p(t("All 6 acceptance criteria met, and 33 of 33 checks that could be run on this branch passed. Tested on "),
    t("sv8815.qa.shopview.com",["code"]),t(", build "),t("v3.8-1f5fb3c",["strong"]),
    t(" (last-modified Wed 19 Aug 2026 14:02:26 GMT, etag a9e66ecc2174eb6d889221f4d976ef24). "
      "Two areas could not be tested on this branch and neither is a defect in this change; both are "
      "pinned down precisely in the technical section at the bottom."))))

C.append(h(3,"The ticket's own acceptance criteria - 6 of 6 met"))
C.append(tbl(ac_rows))
C.append(h(3,"And the four open questions, as answered on 18 August"))
C.append(tbl(oq_rows))
C.append(h(3,"Everything tested, in detail"))
C.append(tbl(check_rows))

C.append(rule())
C.append(h(3,"Evidence"))
C.append(p(t("Every figure below is on an "),t("invoiced",["strong"]),
  t(" work order, so it is frozen - opening it tomorrow shows the same number. Each image carries its "
    "work-order number and the build marker in the header band, and every box is drawn from the real "
    "on-screen geometry of the value it points at. A work order that is not yet invoiced re-prices "
    "against its location's current setting, so it is not valid evidence.")))
for c in caps: C+=img(c['file'],c['caption'])
extra=[
 ("EXHIBIT-R1-part-received-then-returned.png",
  "15. S-16001 - a vendor part received on this branch, then 1 of 3 returned. This is the setup for the two exhibits below."),
 ("EXHIBIT-R2-return-invoice-total-frozen.png",
  "16. S-15999, billed under \"Invoice total\" - the issued invoice document read AFTER returning one of the three parts: subtotal $244.00, tax $23.79, total $267.79, exactly what it was billed."),
 ("EXHIBIT-R3-return-line-by-line-frozen.png",
  "17. The same test run as a control on \"Line by line\" (S-16001) - identical result, so a part return does not rewrite an issued invoice under either rounding method (AC6)."),
 ("EXHIBIT-R7-credit-screen-vendor-credit.png",
  "18. The credit for a returned part (Parts > Returns > Receive Credit > Process Return). It is a VENDOR credit: priced at the part's $10.00 cost rather than its $80.00 sell price, with Tax pre-filled at 5% of that cost from the workplace rate - not this location's 9.75% sales-tax model. It read identically under both rounding modes, so this setting does not reach it."),
 ("EXHIBIT-R6-fee-discount-gated.png",
  "19. Add Part Fee / Discount on S-16003, showing the full dialog including the Taxable control, and Add Fee disabled behind the QuickBooks mapping banner. The work-order kebab route behaves identically."),
]
for fn,cap in extra: C+=img(fn,cap)

C.append(rule())
C.append(h(3,"Technical details for developers"))
C.append(p(t("Three things worth folding into the QA handoff",["strong"]),t(":")))
C.append(olist([
 [t("The accepted wire value for the setting is "),t("total_rounded",["code"]),t(", not "),t("invoice_total",["code"]),
  t(". "),t("POST /api/workplaces/change",["code"]),t(" with "),t("invoice_total",["code"]),t(" or "),
  t("total",["code"]),t(" returns 400 \"Invalid sales tax rounding method.\" The UI and the handoff both "
  "call the option \"Invoice total\", so automation has to discover this. "),
  t("GET /api/workplaces",["code"]),t(" reports it back as "),t("salesTaxRoundingMode",["code"]),t(".")],
 [t("GET /api/invoices/{workOrderId}/details",["code"]),
  t(" is a live re-price of the work order, not the issued invoice. For the February-2025 invoice S-4802 "
  "it returned today's date, the location's current tax model and a different subtotal, while "),
  t("GET /api/invoices/{invoiceId}/view",["code"]),
  t(" returned the real frozen invoice. Anyone checking \"did the invoice move?\" against details will "
  "report a false alarm.")],
 [t("POST /api/work-orders/create",["code"]),
  t(" ignores the workplace_id in the payload and uses the session's active location. If they differ, the "
  "work order picks up the wrong location's tax and - because canned lines are location-scoped - the "
  "canned-line dropdown returns \"No results\" and lines fail to save with no error shown.")],
]))
C.append(p(t("The fee / discount gate",["strong"]),
  t(" - both entry points behave identically: the work-order kebab (Add Work Order Fee / Discount) and the "
  "part row's kebab (Add Part Fee / Discount). Both open the dialog and its live preview computes; both "
  "leave "),t("button_add_adjustment",["code"]),t(" disabled, and "),
  t("POST /api/work-orders/adjustments/add",["code"]),
  t(" answers 409 \"Connect a QuickBooks item for fees before adding a fee.\" Front end and back end "
  "enforce the same guard, so it is not a front-end-only gate.")))
C.append(p(t("Worth a look: the mapping-status flag disagrees with the rest of the state.",["strong"]),t(" "),
  t("GET /api/bookkeeping/adjustment-item-mapping-status",["code"]),t(" reports "),
  t("quickBooksConnected: true",["code"]),t(", but "),
  t("GET /api/bookkeeping/products-and-services",["code"]),t(" returns 400 \"Bookkeeping is not configured\", "),
  t("GET /api/bookkeeping/integration",["code"]),
  t(" returns an Intuit OAuth URL still waiting to be used, and the admin page offers only a Connect "
  "button. Three signals say no QuickBooks company is attached, which means the Fee/Discount item mapping "
  "cannot be created from inside ShopView at all. Ruled out as bypasses: an adjustment template (creates "
  "fine, 201, still blocked), passing templateId on the add call, the line-level labour adjustment button, "
  "and "),t("PUT /api/bookkeeping/settings",["code"]),t(" (500).")))
C.append(p(t("Receiving a part and returning it - the calls that work",["strong"]),t(":")))
C.append(blist([
 [t("Receive: "),t("POST /api/inventory/orders/receive-view {workOrderId, vendorIds:[...]}",["code"]),
  t(" gives 200, then the route "),t("/order/{poId}?receive=1&returnTo=WorkOrder&returnId=...",["code"]),
  t(" - fill "),t("input_invoice_{poId}",["code"]),t(" and "),t("input_qty_{itemId}",["code"]),t(", then "),
  t("button_receive_po_{poId}",["code"]),t(" calls "),t("POST /api/orders/receive-requested-parts",["code"]),
  t(" and returns 200 with the part at Received.")],
 [t("Putting a part on a line: "),t("POST /api/work-orders/part/make-request",["code"]),t(" takes "),
  t("work_order",["code"]),t(" and "),t("line",["code"]),
  t(" as the field names, not work_order_id / line_id.")],
 [t("Returning it: "),
  t("POST /api/work-orders/part/make-return-request {part_id, work_order_id, quantity, return_reason}",["code"]),
  t(" returns 200. Two traps for the automation: "),t("part_id",["code"]),t(" is the part "),
  t("object's",["em"]),t(" id from "),t("GET /api/work-orders/lines/{WO}",["code"]),
  t(" rather than the part-request id, and "),t("return_reason",["code"]),
  t(" is required. The request comes back with status \"returned\" straight away - there is no approve step.")],
 [t("The credit: Parts > Returns > tick "),t("return_request_checkbox_<id>",["code"]),t(" > "),
  t("button_receive_credit",["code"]),t(" > "),t("/parts/confirm-return?ids=<id>&isManualReturn=0",["code"]),
  t(" > "),t("button_post_credit",["code"]),t(" calls "),t("POST /api/inventory/returns/create",["code"]),
  t(" and returns 200. The payload carries "),t("workplace_tax: 5",["code"]),
  t(", which is where the credit's tax comes from. Entering a restocking fee reduces the subtotal and the "
  "tax recomputes on the reduced base ($0.98 fee gives $9.02 / $0.45 / $9.47).")],
 [t("Two automation hazards on the Process Return screen: "),
  t("the Restocking Fee input and the Tax input share data-test-id=\"input_base\"",["strong"]),
  t(", so a script aiming at the tax field silently edits the fee instead; and the vendor invoice number "
  "field rejects anything over "),t("21 characters",["strong"]),
  t(", which reads like a receive failure and is not one.")],
 [t("Noted, not raised: "),t("POST /api/inventory/orders/accept",["code"]),
  t(" - the save behind the Parts > Deliveries / "),t("/accept-delivery",["code"]),
  t(" screen - returns "),t("500",["strong"]),
  t(" for a work-order part request. That screen is not the path the product drives a work-order part "
  "request through (the part row's Receive button above is), so it is not reachable this way in normal "
  "use. Request ids if useful: 7b8f7c1c, b32c9979, a31d8bdc, ea4f1863, 5ead1dce, 52a43345.")],
]))
C.append(p(t("One question rather than a finding",["strong"]),
  t(": the handoff asks that a credit against an \"Invoice total\" invoice pro-rate its credited tax from "
  "the frozen invoice tax. The build instead charges the workplace purchase rate on the part's cost, and "
  "the ticket itself says nothing about credits - so "),
  t("is the vendor credit meant to carry the workplace purchase tax as built, or the customer's frozen "
  "sales tax as the handoff reads?",["strong"])))
C.append(p(t("Test data",["strong"]),
  t(": customer Aaborough Works (contact Jeffrey Burns), asset 2020 Ford Transit VIN 86J8FAC1VALJ43SJY, "
  "locations Staging Heavy Duty - 9919 and Staging Lethbridge - 4310, labour type \"ZZ8815 Unit\" at "
  "$1.00/hour so a line can be dialled to the cent, and tax models created for the run: ZZ8815 8pct, "
  "ZZ8815 9.75pct, ZZ8815 Stacked (4%+3%+1%), ZZ8815 GSTPST (5%+7%). The part-return work orders are "
  "S-15999 "),t("dc99ddd7-b85a-4162-91bf-207fd736f7aa",["code"]),t(" and S-16001 "),
  t("3eb92281-9cff-4c4d-9256-02655161aa04",["code"]),t("; the fee/discount one is S-16003 "),
  t("67e72b2d-3234-4779-b395-9f5214f5e536",["code"]),
  t(". Every exhibit's work order is named in its header band so any figure here can be re-opened and re-read.")))
C.append(p(t("On the build",["strong"]),
  t(": the marker above was read at the start of the run, at the end, and again before this comment - "
  "unchanged each time, so every verdict here belongs to one build.")))

doc={"version":1,"type":"doc","content":C}
json.dump(doc,open('/tmp/sv8815/adf-single.json','w'),indent=1)
def cnt(n,a):
    if isinstance(n,dict):
        if n.get('type')=='media': a.append(n['attrs']['url'])
        for v in n.values(): cnt(v,a)
    elif isinstance(n,list):
        for v in n: cnt(v,a)
a=[]; cnt(doc,a)
print('nodes:',len(C),'| bytes:',len(json.dumps(doc)),'| media:',len(a))
for u in a: print('   ',u.split('/')[-1])
