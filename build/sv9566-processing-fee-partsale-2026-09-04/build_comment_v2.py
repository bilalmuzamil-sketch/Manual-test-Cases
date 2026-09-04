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
def stt(txt,color):return {"type":"status","attrs":{"text":txt,"color":color}}
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
 ('The downstream still works on a QuickBooks-configured org: a Processing Fee applies and computes, and a fee applies on a Part Sale.','PASSED'),
 ('The exact combination — a Processing Fee applied to a Part Sale end-to-end incl. the QuickBooks sync — not directly observed (see note).','NOTE'),
]
trows=[row([cell(p(strong("#")),head=True),cell(p(strong("What I checked")),head=True),cell(p(strong("Result")),head=True)])]
for i,(txt,s) in enumerate(checks,1):
    node=stt("NOTE","neutral") if s=="NOTE" else stt(s,"green")
    trows.append(row([cell(p(t(str(i)))),cell(p(t(txt))),cell(p(node))]))
table={"type":"table","attrs":{"isNumberColumnEnabled":False,"layout":"default"},"content":trows}
doc={"type":"doc","version":1,"content":[
 panel("success",
   p(strong("OVERALL QA STATUS: PASSED")),
   p(t("I reproduced the customer's issue on production (app.shopview.com, build v26.35.9-20b5728): a saved Processing Fee template does not appear when adding a fee on a Part Sale, while it does appear on Work Orders — exactly as Kelly described. On the fix branch (sv9566.qa.shopview.com, build v26.35.8-5248ce9) the same template now appears and fills in correctly on Part Sales, and I also confirmed on a QuickBooks-configured production org that a Processing Fee applies and computes, and that a fee applies on a Part Sale. The one thing not directly observed anywhere is the exact end-to-end combination (a Processing Fee applied to a Part Sale with the QuickBooks sync), because no single environment has both the fix and QuickBooks; details at the bottom."))),
 h("What I tested"),
 table,
 h("Before — the bug on production today"),
 *media(B+"/10-PROD-annotated-partsale-no-results.png","Production, a Part Sale invoice. The org has a Processing Fee template saved, but “Add a Fee” > “Apply From Template” shows “No results” — the Processing Fee is filtered out. This is the customer's exact experience."),
 *media(B+"/11-PROD-annotated-workorder-pf-present.png","Production, a Work Order. The same saved Processing Fee template does appear here. So on production it works on Work Orders but not on Part Sales — word-for-word the customer's report."),
 h("After — the fix on the QA branch"),
 *media(B+"/05-annotated-partsale-dropdown.png","Fix branch, a Part Sale invoice. The Processing Fee template (“ZZAUTOTEST Card Surcharge”) now appears in “Apply From Template”, next to the Fee and Discount templates."),
 *media(B+"/06-annotated-pf-autofill.png","Picking it fills in Type = Processing Fee and Calculation Type = % Of Grand Total, and shows the note “This fee is calculated on the parts-sale grand total…” — worded for a parts sale."),
 *media(B+"/07-annotated-wo-parity.png","The same template still appears on a Work Order on the fix branch — parity is unbroken."),
 h("Extra confidence — the downstream works on a QuickBooks-configured org"),
 p(t("The fix branch's test org has no QuickBooks connection, so its “Add Fee” button is blocked by a “Connect a QuickBooks item for fees” message (the same requirement Kelly's shop already satisfies). To make sure that block is only about setup and not the fix, I checked the machinery on a production test org that does have QuickBooks configured:")),
 *media(B+"/12-PROD-corroboration-pf-applies-no-qb-block.png","Production test org (QuickBooks configured). Adding a Processing Fee to a work order — “Add Fee” is enabled with no QuickBooks block, and it applied: a 100% Processing Fee turned a $110.17 total into $220.34 (100% of the grand total). On the same org, adding a fee to a Part Sale also worked (a $50 fee took a $720.00 sale to $770.00)."),
 p(strong("What this means: "),t("On a QuickBooks-connected org — like the customer's — a Processing Fee applies and computes as a percentage of the grand total, and the Part Sale “add a fee” path works. The fix simply makes the Processing Fee template available on Part Sales (proven above), so once it ships the customer should be able to apply their credit-card Processing Fee to a Part Sale.")),
 rule(),
 h("How to reproduce"),
 p(strong("The bug (production): "),t("With a Processing Fee template saved in Administration → Service → Fees & Discounts, open a Part Sale invoice → three-dot menu (top right) → “Add Parts Sale Fee / Discount” → open “Apply From Template”. The Processing Fee is missing (here, “No results”). Open the same menu on a Work Order and it is listed.")),
 p(strong("The fix (fix branch): "),t("Same steps on a Part Sale → the Processing Fee template is now listed; selecting it fills in Processing Fee / % Of Grand Total with the parts-sale grand-total note.")),
 h("Technical details for developers"),
 p(strong("Environments: "),t("Production app.shopview.com/api.shopview.com build v26.35.9-20b5728 (bug present; QuickBooks configured on the test org). Fix branch sv9566.qa.shopview.com build v26.35.8-5248ce9, PR #2900 (bug fixed; test org without QuickBooks). All work was in internal test orgs.")),
 p(strong("Scope behaviour (matches the fix): "),t("On the fix branch, POST /api/work-orders/adjustments/add with kind=processing_fee at scope=whole_parts_sale is accepted (passes the kind/scope invariant); at scope=line it is rejected with 400 “Invalid adjustment scope.” — the processing fee is allowed at either whole-level scope and still refused on a single line, as AdjustmentScope::isWholeLevel() intends.")),
 p(strong("Production corroboration: "),t("On the production test org (QuickBooks configured, no “map a fee item” block): a Processing Fee applied to a work order via the UI (100% of grand total → $110.17 became $220.34), and a fee applied to a Part Sale via the UI ($720.00 became $770.00). These prove the compute + apply machinery is sound where QuickBooks is set up.")),
 p(strong("Still not directly observed: "),t("A Processing Fee applied to a Part Sale end-to-end with the actual QuickBooks line-item sync — no single environment has both the fix and a QuickBooks connection, and I don't have QuickBooks UI access to confirm the synced line item. This is covered by the dev's automated test C45255; a check on a QuickBooks-connected org would fully close it before the customer's ticket is marked resolved.")),
 p(strong("Processing fees stacking: "),t("Chris confirmed on this ticket that two processing fees on one sale is acceptable (no one-per-document rule) — recorded decision, no code change.")),
]}
open("comment.adf.json","w").write(json.dumps(doc))
print("nodes:",len(doc["content"]),"| images:",sum(1 for n in doc["content"] if n.get("type")=="mediaSingle"))
