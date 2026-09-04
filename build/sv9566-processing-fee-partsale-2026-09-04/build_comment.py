import json
B="https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv9566-processing-fee-partsale-2026-09-04/evidence"
def t(s,m=None):
    n={"type":"text","text":s}
    if m:n["marks"]=m
    return n
def strong(s):return t(s,[{"type":"strong"}])
def p(*c):return {"type":"paragraph","content":list(c)}
def h(s,l=3):return {"type":"heading","attrs":{"level":l},"content":[t(s)]}
def rule():return {"type":"rule"}
def panel(k,*c):return {"type":"panel","attrs":{"panelType":k},"content":list(c)}
def status(txt,color):return {"type":"status","attrs":{"text":txt,"color":color}}
def cell(*c,head=False):return {"type":"tableHeader" if head else "tableCell","attrs":{},"content":list(c)}
def row(cs):return {"type":"tableRow","content":cs}
def media(url,cap):
    return [{"type":"mediaSingle","attrs":{"layout":"full-width"},"content":[{"type":"media","attrs":{"type":"external","url":url}}]},p(t(cap,[{"type":"em"}]))]
checks=[
 ('Processing Fee template now shows up when adding a fee on a Part Sale invoice (the exact issue Kelly reported).','PASSED'),
 ('Selecting it fills in Type = Processing Fee, calculated on the parts-sale grand total, with the matching on-screen note.','PASSED'),
 ('Regular Fee and Discount templates still show up on Part Sales (nothing was lost).','PASSED'),
 ('A Processing Fee is still not allowed on an individual part/labor line — only on the whole sale or whole work order.','PASSED'),
 ('Work Orders still offer the Processing Fee template (the part that already worked is untouched).','PASSED'),
 ('Applying the fee end-to-end and seeing the dollar figure on the sale — not fully checked on this QA org (see note below).','NOTE'),
]
trows=[row([cell(p(strong("#")),head=True),cell(p(strong("What I checked")),head=True),cell(p(strong("Result")),head=True)])]
for i,(txt,st) in enumerate(checks,1):
    stn=status("NOTE","neutral") if st=="NOTE" else status(st,"green")
    trows.append(row([cell(p(t(str(i)))),cell(p(t(txt))),cell(p(stn))]))
table={"type":"table","attrs":{"isNumberColumnEnabled":False,"layout":"default"},"content":trows}
doc={"type":"doc","version":1,"content":[
 panel("success",
   p(strong("OVERALL QA STATUS: PASSED")),
   p(t("Tested on the QA branch sv9566.qa.shopview.com (build v26.35.8-5248ce9). The reported problem is fixed: a Processing Fee template created in Administration → Service → Fees & Discounts now appears and can be picked when adding a fee on a Part Sale invoice, the same way it always has on Work Orders. All five testable points pass. One step — clicking Add Fee and seeing the final dollar amount — could not be driven to the number on this test org because it needs a QuickBooks fee item mapped first; details at the bottom."))),
 h("What I tested"),
 table,
 h("Evidence"),
 *media(B+"/05-annotated-partsale-dropdown.png","Part Sale invoice → toolbar → “Add Parts Sale Fee / Discount” → “Apply From Template”. The Processing Fee template (“ZZAUTOTEST Card Surcharge”) now appears in the list, next to the Fee and Discount templates. Before the fix, a shop whose only template was a Processing Fee saw an empty list — which is exactly what Kelly described."),
 *media(B+"/06-annotated-pf-autofill.png","Picking the Processing Fee template fills in Type = Processing Fee and Calculation Type = % Of Grand Total, and shows the note “This fee is calculated on the parts-sale grand total and updates as the parts sale changes.” — worded for a parts sale, as intended."),
 *media(B+"/07-annotated-wo-parity.png","The same template still appears on a Work Order (“Applying To: Entire Work Order”). The part that already worked is unaffected."),
 rule(),
 h("How to reproduce the pass"),
 p(strong("1. "),t("Go to Administration → Service → Fees & Discounts and create a template with Type = Processing Fee (e.g. % of Grand Total, 3%). Save it.")),
 p(strong("2. "),t("Open a Part Sale invoice (any editable one, e.g. an Estimate). Click the three-dot menu at the top right, next to Authorize/Decline, and choose “Add Parts Sale Fee / Discount”.")),
 p(strong("3. "),t("Open the “Apply From Template” dropdown. The Processing Fee template is listed. Pick it — the dialog fills in Processing Fee, % Of Grand Total, and shows the parts-sale grand-total note.")),
 h("Technical details for developers"),
 p(strong("Environment: "),t("sv9566.qa.shopview.com / sv9566api.qa.shopview.com, build v26.35.8-5248ce9 (index.html last-modified Thu 03 Sep 2026 11:54:55 GMT). PR #2900.")),
 p(strong("Scope behaviour (matches the fix): "),t("POST /api/work-orders/adjustments/add with kind=processing_fee at scope=whole_parts_sale is accepted (it passes the kind/scope invariant); at scope=line it is rejected with 400 “Invalid adjustment scope.” — i.e. the processing fee is allowed at either whole-level scope and still refused on an individual line, exactly as AdjustmentScope::isWholeLevel() intends.")),
 p(strong("Why the dollar amount wasn’t driven here: "),t("Adding any fee to a Part Sale on this org returns 409 “Connect a QuickBooks item for fees before adding a fee.” — the same QuickBooks item-mapping requirement that applies to Fee and Discount too, and that Kelly’s shop already satisfied. This QA org has no QuickBooks connection, so the Add Fee button stays disabled and the endpoint refuses the add. It is not related to this ticket and is not a regression. The end-to-end apply (3% of the parts-sale grand total = parts + tax) is covered by the dev’s automated test C45255.")),
 p(strong("Part sale used: "),t("P9566-240 (Estimate, Northport Truck Repair) — Parts $881.15, GST $44.06, Total $925.21; a 3% processing fee on the grand total would be $27.76.")),
 p(strong("Processing fees stacking: "),t("Chris confirmed on this ticket that two processing fees on one sale is acceptable (no one-per-document rule). No code change; nothing to test beyond that decision.")),
]}
open("comment.adf.json","w").write(json.dumps(doc))
def flat(n):
    ty=n.get("type")
    if ty=="text":return n["text"]
    if ty=="status":return "["+n["attrs"]["text"]+"]"
    if ty in("mediaSingle","media"):return "   [IMAGE]"
    k=n.get("content",[]);inner="".join(flat(x) for x in k)
    if ty=="heading":return "\n### "+inner+"\n"
    if ty=="paragraph":return inner+"\n"
    if ty=="panel":return "|"+n["attrs"]["panelType"].upper()+"|\n"+inner
    if ty=="rule":return "\n"+"-"*70+"\n"
    if ty=="table":
        out=[]
        for r in k: out.append(" | ".join("".join(flat(c) for c in cc.get("content",[])).strip() for cc in r["content"]))
        return "\n".join(out)+"\n"
    return inner
print("".join(flat(n) for n in doc["content"]))
