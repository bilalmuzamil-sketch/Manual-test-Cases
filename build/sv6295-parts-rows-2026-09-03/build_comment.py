import json
B="https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv6295-parts-rows-2026-09-03/evidence"
def t(s,marks=None):
    n={"type":"text","text":s}
    if marks:n["marks"]=marks
    return n
def strong(s):return t(s,[{"type":"strong"}])
def p(*c):return {"type":"paragraph","content":list(c)}
def h(s,l=3):return {"type":"heading","attrs":{"level":l},"content":[t(s)]}
def rule():return {"type":"rule"}
def panel(k,*c):return {"type":"panel","attrs":{"panelType":k},"content":list(c)}
def status(s):
    col="green" if s=="PASSED" else "red"
    return {"type":"status","attrs":{"text":s,"color":col}}
def cell(*c,head=False):return {"type":"tableHeader" if head else "tableCell","attrs":{},"content":list(c)}
def row(cs):return {"type":"tableRow","content":cs}
def media(url,cap):
    ms={"type":"mediaSingle","attrs":{"layout":"full-width"},"content":[{"type":"media","attrs":{"type":"external","url":url}}]}
    return [ms,p(t(cap,[{"type":"em"}]))]

checks=[
 ("Each partial receive of a part creates a new row on the Parts tab (Work Order)","PASSED"),
 ("Every row keeps its own vendor, quantity and status from the moment it was received","PASSED"),
 ("Changing the vendor on an Awaiting quantity only affects the not-yet-received row - the already-received row keeps its original vendor","PASSED"),
 ("Rows never merge, even after the whole quantity has been received (multiple Received rows remain)","PASSED"),
 ("Returning part of a received row just reduces that row's quantity - no \"Returned\" row appears and the status stays \"Received\"","PASSED"),
 ("The Return box pre-fills the exact quantity of the row you picked","PASSED"),
 ("Part Sales behave the same way - each receive is a separate row and rows don't merge","PASSED"),
 ("Invoiced Part Sale (the scenario in the ticket): receive 4 + 5 + 1, return 3, then Invoice -> the part shows Quantity 7 and status Received (not 4 / \"Returned\")","PASSED"),
 ("Editing the vendor on a vendor invoice updates the matching Parts-tab row only when the Work Order / Part Sale is NOT Invoiced or Paid","PASSED"),
]
trows=[row([cell(p(strong("#")),head=True),cell(p(strong("What I tested")),head=True),cell(p(strong("Result")),head=True)])]
for i,(txt,st) in enumerate(checks,1):
    trows.append(row([cell(p(t(str(i)))),cell(p(t(txt))),cell(p(status(st)))]))
table={"type":"table","attrs":{"isNumberColumnEnabled":False,"layout":"default"},"content":trows}

doc={"type":"doc","version":1,"content":[
 panel("success",
   p(strong("OVERALL QA STATUS: PASSED")),
   p(t("Tested on the QA branch sv6295.qa.shopview.com (build v26.35.7-13e8586), driving each requirement live on both a Work Order and a Part Sale. Every partial receive creates its own row, each row keeps the vendor/quantity it was received with, a vendor change on the Awaiting quantity leaves already-received rows alone, rows never merge, and returned parts are never shown as a \"Returned\" row (the row's quantity just drops and the status stays Received). The scenario from the comments - receive 4+5+1, return 3, then invoice a Part Sale - now ends on Quantity 7 / Received, not 4 / \"Returned\". No blocking issues found."))),
 h("What I tested"),
 table,
 h("Evidence"),
 *media(B+"/WO-annotated-receive-split.png",
   "Each receive makes a new row (Work Order). Receiving 2 of an Awaiting-6 part splits it into a Received row of 2 plus the Awaiting remainder of 4."),
 *media(B+"/WO-annotated-nomerge-two-vendors.png",
   "No merge + vendor kept per row. The same part shows two Received rows with different vendors (received under Stillwater, then re-vendored to Weehawken for the later receipt) - never merged into one line. The Weehawken row was received as 4 then had 2 returned, so it reads 2 with no separate \"Returned\" row."),
 *media(B+"/PS-annotated-invoiced-qty7-received.png",
   "The reported scenario on an INVOICED Part Sale. Received 4+5+1 (=10), returned 3, then Invoiced. The Parts tab shows Quantity 1+2+4 = 7, every row \"Received\", no \"Returned\" row - exactly the expected result (the reported bug showed 4 / \"Returned\")."),
 *media(B+"/T6-WO-invoice-vendor-edit-rows-updated.png",
   "Vendor-invoice edit. Changing the vendor on a vendor invoice updated the matching Parts-tab rows to the new vendor because this Work Order is not invoiced. On an Invoiced Part Sale the same edit did NOT change the rows (they kept their vendor) - matching the requirement."),
 rule(),
 h("How to reproduce the invoiced Part Sale check"),
 p(strong("1. "),t("Parts -> Part Sales -> New Part Sale, pick a customer, Save. Add a part (Quantity 10, Source = vendor, pick a vendor), Save & Close.")),
 p(strong("2. "),t("Click Authorize, then Order the part.")),
 p(strong("3. "),t("Receive it in three goes: 4, then 5, then 1. The Parts tab now shows three Received rows (4, 5, 1) - they do not merge.")),
 p(strong("4. "),t("Open the part's menu on the Line tab -> Return, return 3. The row you returned from drops by 3; no \"Returned\" row appears. The parts now total 7, all Received.")),
 p(strong("5. "),t("Mark the Part Sale Invoiced. Go back to the Parts tab: it still shows Quantity 7 and status Received on every row.")),
 h("Technical details for developers"),
 p(strong("Environment: "),t("sv6295.qa.shopview.com / sv6295api.qa.shopview.com, build v26.35.7-13e8586. Tested as an admin user in workplace \"Staging Heavy Duty - 9919\".")),
 p(strong("Parts-tab data: "),t("GET /api/work-orders/{id}/parts/list-requests-by-line returns the received-wise split (received rows carry a work_order_part_id; the awaiting remainder is a separate entry). This same endpoint powers both Work Order and Part Sale Parts tabs.")),
 p(strong("Invoiced Part Sale result (verified at the endpoint too): "),t("three Received rows of 1 + 2 + 4 = 7, zero rows with a \"Returned\" status, after POST /api/invoices/create returned 201. Financial Info Parts = $280 (7 x $40) corroborates.")),
 p(strong("Return quantity: "),t("the Return dialog's Quantity field pre-fills with the selected row's exact quantity (e.g. a qty-4 row opens the return at 4) - the front-end fix noted in the comments.")),
 p(strong("Vendor-invoice edit (POST /api/inventory/deliveries/change): "),t("on a non-invoiced Work Order the row vendors updated to match; on an Invoiced Part Sale the invoice itself changed but the Parts-tab rows kept their vendor - so the row follows the edit only when not Invoiced/Paid.")),
 p(strong("Note: "),t("sv6295 is a temporary QA branch, so test data was left in place; throwaway records are tagged ZZAUTOTEST.")),
]}
open("/tmp/sv6295/comment.adf.json","w").write(json.dumps(doc))
# text preview
def flat(n):
    ty=n.get("type")
    if ty=="text":return n["text"]
    if ty=="status":return "["+n["attrs"]["text"]+"]"
    if ty in("mediaSingle","media"):return "   [IMAGE]"
    kids=n.get("content",[]);inner="".join(flat(k) for k in kids)
    if ty=="heading":return "\n### "+inner+"\n"
    if ty=="paragraph":return inner+"\n"
    if ty=="panel":return "|"+n["attrs"]["panelType"].upper()+"|\n"+inner
    if ty=="rule":return "\n"+"-"*70+"\n"
    if ty=="table":
        out=[]
        for r in kids:
            out.append(" | ".join("".join(flat(c) for c in cc.get("content",[])).strip() for cc in r["content"]))
        return "\n".join(out)+"\n"
    return inner
print("\n".join(flat(n) for n in doc["content"]))
