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
def st(txt,color):return {"type":"status","attrs":{"text":txt,"color":color}}
def cell(*c,head=False):return {"type":"tableHeader" if head else "tableCell","attrs":{},"content":list(c)}
def row(cs):return {"type":"tableRow","content":cs}
def media(url,cap):
    return [{"type":"mediaSingle","attrs":{"layout":"full-width"},"content":[{"type":"media","attrs":{"type":"external","url":url}}]},p(t(cap,[{"type":"em"}]))]
checks=[
 ('The bug reproduces on production today: a saved Processing Fee template does not appear when adding a fee on a Part Sale.','CONFIRMED'),
 ('On the fix branch, the Processing Fee template now appears when adding a fee on a Part Sale (the reported issue is fixed).','PASSED'),
 ('Picking it fills in Type = Processing Fee, calculated on the parts-sale grand total, with the matching on-screen note.','PASSED'),
 ('Regular Fee and Discount templates still show up on Part Sales (nothing lost).','PASSED'),
 ('A Processing Fee is still not allowed on an individual part/labor line — only on the whole sale or whole work order.','PASSED'),
 ('Work Orders still offer the Processing Fee template (the part that already worked is untouched).','PASSED'),
 ('Applying the fee end-to-end and seeing the dollar figure on the sale, incl. the QuickBooks sync — NOT verified (see note).','NOTE'),
]
trows=[row([cell(p(strong("#")),head=True),cell(p(strong("What I checked")),head=True),cell(p(strong("Result")),head=True)])]
for i,(txt,s) in enumerate(checks,1):
    node=st("NOTE","neutral") if s=="NOTE" else st(s,"green")
    trows.append(row([cell(p(t(str(i)))),cell(p(t(txt))),cell(p(node))]))
table={"type":"table","attrs":{"isNumberColumnEnabled":False,"layout":"default"},"content":trows}
doc={"type":"doc","version":1,"content":[
 panel("success",
   p(strong("OVERALL QA STATUS: PASSED")),
   p(t("I first reproduced the customer's issue on production (app.shopview.com, build v26.35.9-20b5728): a saved Processing Fee template does not appear when adding a fee on a Part Sale, while it does appear on Work Orders — exactly as Kelly described. On the fix branch (sv9566.qa.shopview.com, build v26.35.8-5248ce9) the same template now appears and fills in correctly on Part Sales. Five checks pass and the production bug is confirmed. One thing is NOT verified — actually applying the fee end-to-end and the QuickBooks sync — because our test environments aren't set up to push a fee to QuickBooks; details at the bottom."))),
 h("What I tested"),
 table,
 h("Before — the bug on production today"),
 *media(B+"/10-PROD-annotated-partsale-no-results.png","Production, a Part Sale invoice. The org has a Processing Fee template saved, but “Add a Fee” > “Apply From Template” shows “No results” — the Processing Fee is filtered out. This is the customer's exact experience."),
 *media(B+"/11-PROD-annotated-workorder-pf-present.png","Production, a Work Order. The same saved Processing Fee template does appear here. So on production it works on Work Orders but not on Part Sales — word-for-word the customer's report."),
 h("After — the fix on the QA branch"),
 *media(B+"/05-annotated-partsale-dropdown.png","Fix branch, a Part Sale invoice. The Processing Fee template (“ZZAUTOTEST Card Surcharge”) now appears in “Apply From Template”, next to the Fee and Discount templates."),
 *media(B+"/06-annotated-pf-autofill.png","Picking it fills in Type = Processing Fee and Calculation Type = % Of Grand Total, and shows the note “This fee is calculated on the parts-sale grand total…” — worded for a parts sale."),
 *media(B+"/07-annotated-wo-parity.png","The same template still appears on a Work Order on the fix branch — parity is unbroken."),
 rule(),
 h("How to reproduce"),
 p(strong("The bug (production): "),t("With a Processing Fee template saved in Administration → Service → Fees & Discounts, open a Part Sale invoice → three-dot menu (top right) → “Add Parts Sale Fee / Discount” → open “Apply From Template”. The Processing Fee is missing (here, “No results”). Open the same menu on a Work Order and it is listed.")),
 p(strong("The fix (fix branch): "),t("Same steps on a Part Sale → the Processing Fee template is now listed; selecting it fills in Processing Fee / % Of Grand Total with the parts-sale grand-total note.")),
 h("Technical details for developers"),
 p(strong("Environments: "),t("Production app.shopview.com/api.shopview.com build v26.35.9-20b5728 (bug present). Fix branch sv9566.qa.shopview.com build v26.35.8-5248ce9, PR #2900 (bug fixed). Both checked in the test org, observation only on production.")),
 p(strong("Scope behaviour (matches the fix): "),t("On the fix branch, POST /api/work-orders/adjustments/add with kind=processing_fee at scope=whole_parts_sale is accepted (passes the kind/scope invariant); at scope=line it is rejected with 400 “Invalid adjustment scope.” — the processing fee is allowed at either whole-level scope and still refused on a single line, as AdjustmentScope::isWholeLevel() intends.")),
 p(strong("Not verified — apply + QuickBooks sync: "),t("Adding a fee to a Part Sale on the fix-branch test org returns 409 “Connect a QuickBooks item for fees before adding a fee.” — the same QuickBooks item-mapping requirement Kelly's shop already satisfies, which our test org does not. So I could not click Add Fee, see the computed amount (3% of the parts-sale grand total = parts + tax), or confirm the QuickBooks sync. That end-to-end path is the one remaining gap; it is covered by the dev's automated test C45255, but I recommend a check on a QuickBooks-connected org before the customer's ticket is closed.")),
 p(strong("Processing fees stacking: "),t("Chris confirmed on this ticket that two processing fees on one sale is acceptable (no one-per-document rule) — recorded decision, no code change.")),
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
        return "\n".join(" | ".join("".join(flat(c) for c in cc.get("content",[])).strip() for cc in r["content"]) for r in k)+"\n"
    return inner
print("".join(flat(n) for n in doc["content"]))
