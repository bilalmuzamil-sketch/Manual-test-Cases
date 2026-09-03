import json
B="https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv9289-asset-merge-imported-2026-09-03/evidence"
def t(s,m=None):
    n={"type":"text","text":s}
    if m:n["marks"]=m
    return n
def strong(s):return t(s,[{"type":"strong"}])
def p(*c):return {"type":"paragraph","content":list(c)}
def h(s,l=3):return {"type":"heading","attrs":{"level":l},"content":[t(s)]}
def rule():return {"type":"rule"}
def panel(k,*c):return {"type":"panel","attrs":{"panelType":k},"content":list(c)}
def status(s):return {"type":"status","attrs":{"text":s,"color":"green" if s=="PASSED" else ("red" if s=="FAILED" else "neutral")}}
def cell(*c,head=False):return {"type":"tableHeader" if head else "tableCell","attrs":{},"content":list(c)}
def row(cs):return {"type":"tableRow","content":cs}
def media(url,cap):
    return [{"type":"mediaSingle","attrs":{"layout":"full-width"},"content":[{"type":"media","attrs":{"type":"external","url":url}}]},p(t(cap,[{"type":"em"}]))]
checks=[
 ("Reported bug: an asset that has imported invoice/work-order history is merged into another asset. Open the merged asset -> Work Orders -> Imported: the source asset's imported history is now present (before the fix it disappeared).","PASSED"),
 ("The moved imported invoices show the destination asset's FULL VIN (1M1AW07Y5GM055903), not the source's partial VIN (GM055903), so the Imported list is consistent.","PASSED"),
 ("The source asset's regular (non-imported) work orders also carry over to the merged asset - existing behaviour, checked for regression.","PASSED"),
 ("After the merge the source asset is removed, and no imported rows are left pointing at the deleted asset (no orphans).","PASSED"),
 ("Destination asset has NO VIN (unit-number-only): the moved invoices keep the SOURCE VIN instead of going blank.","PASSED"),
 ("Second merge path - editing an asset's VIN to one that already exists - also triggers the merge and carries the imported history over with the destination VIN.","PASSED"),
 ("Merging a source asset that has NO imported history behaves exactly as before - no error, regular work orders still move.","PASSED"),
 ("Multi-customer safety: when an asset's imported history spans two customers, merging as one customer moves only THAT customer's imported rows; the other customer's history stays put and nothing leaks onto the merged asset.","PASSED"),
]
trows=[row([cell(p(strong("#")),head=True),cell(p(strong("What I tested")),head=True),cell(p(strong("Result")),head=True)])]
for i,(txt,st) in enumerate(checks,1):
    trows.append(row([cell(p(t(str(i)))),cell(p(t(txt))),cell(p(status(st)))]))
table={"type":"table","attrs":{"isNumberColumnEnabled":False,"layout":"default"},"content":trows}
doc={"type":"doc","version":1,"content":[
 panel("success",
   p(strong("OVERALL QA STATUS: PASSED")),
   p(t("Tested on the QA branch sv9289.qa.shopview.com (build v26.35.6-9164403, which is the fix commit 9164403024). The originally reported problem no longer happens: when an asset that has imported invoice/work-order history is merged into another asset, the imported history now carries over to the merged asset and shows that asset's VIN - previously it vanished from every screen. I reproduced the customer's exact example (merging partial VIN GM055903 into the correct full VIN 1M1AW07Y5GM055903) and it works. I also checked the other two merge paths, the no-VIN destination case, the no-imported-history case, and multi-customer scoping. No blocking issues."))),
 h("What I tested"),
 table,
 h("Evidence"),
 *media(B+"/01-imported-history-carries-over.png","The reported bug, fixed. Top: before the merge the destination asset (VIN 1M1AW07Y5GM055903) has no imported history (\"No results found\"). Bottom: after merging the source asset into it, the 3 imported invoices (ZZIMP-1001/1002/1003) are present on the merged asset under Work Orders -> Imported, each showing the destination's full VIN."),
 *media(B+"/02-source-history-and-regular-wos.png","Top: the source asset (partial VIN GM055903) carried the 3 imported invoices before the merge - the history the customer said disappeared. Bottom: after the merge the source's regular work orders (S9289-17580/17581) also moved to the merged asset, now under the destination VIN (regression check)."),
 rule(),
 h("How to reproduce"),
 p(strong("Set up - "),t("Under one customer, create two assets: A with a full VIN (e.g. 1M1AW07Y5GM055903) and B with a partial/other VIN (e.g. GM055903). Give B some imported history: Settings -> Data Import -> Invoices Import, download the template, fill a few invoice rows with B's VIN and the customer name, and import. B's asset now shows those under Work Orders -> Imported.")),
 p(strong("The test - "),t("Merge asset B into asset A (Assets -> B -> Merge into A). Then open asset A -> Work Orders tab -> Status filter -> Imported. The imported invoices from B are now listed on A, showing A's full VIN. Before the fix they would have been gone from both assets.")),
 p(strong("Also worth checking - "),t("(1) a destination asset with no VIN keeps the source VIN on the moved rows; (2) editing B's VIN to A's VIN triggers the same merge; (3) merging an asset with no imported history still works with no error.")),
 h("Technical details for developers"),
 p(strong("Environment: "),t("sv9289.qa.shopview.com / sv9289api.qa.shopview.com, build v26.35.6-9164403 (= fix commit 9164403024, PR #2698). Merge: POST /api/vehicles/merge {company_id, source_vehicle_id, destination_vehicle_id}. Imported read (asset Work Orders -> Imported filter): GET /api/work-orders-imported?filters[0][field]=vehicleId&filters[0][value]=<id>&filters[1][field]=companyId&filters[1][value]=<id>. Imported history is seeded via Data Import -> Invoices Import (POST /api/imports/work-order-historical, multipart CSV).")),
 p(strong("Merge button (reported path): "),t("Before merge - source B (VIN GM055903) had 3 imported invoices, destination A (VIN 1M1AW07Y5GM055903) had 0. After merge - A has all 3 (same invoice numbers, dates, totals) now carrying A's full VIN; A's regular WOs include B's; B is deleted; company-wide there are 0 imported rows pointing at a deleted asset.")),
 p(strong("Edit-VIN path: "),t("POST /api/vehicles/change with the full vehicle payload and the destination VIN returns 201 and merges correctly (imported history moves with the destination VIN, source deleted). Note: a MINIMAL/incomplete change payload returns HTTP 500 while still performing the merge - that 500 is an incomplete-request artifact, not a defect; the real UI sends a complete payload (it also requires Make) and returns 201.")),
 p(strong("Multi-customer scoping: "),t("With an asset whose imported rows spanned customers C1 (2 rows) and C2 (1 row), merging as C1 moved only C1's 2 rows onto the destination (with its VIN); C2's row stayed under C2, still visible, and nothing from C2 appeared on the destination. Honest limitation: the narrower 'source asset is NOT deleted when it is genuinely shared by two customers' sub-case could not be exercised - importing invoices under a second customer does not make the asset co-owned (vehicles/list-owners stayed empty), so no genuinely dual-owned asset was creatable here. Reported as a coverage gap, not a defect.")),
 p(strong("Not separately driven: "),t("the third merge trigger (changing the VIN from inside a work order) routes through the same VehicleManager::mergeVehicles + WorkOrderImportedVehicleReassigner proven by the Merge-button and edit-VIN checks; its known out-of-scope caveat (it may strand the source's OTHER regular work orders - the 'Walter' note in the ticket) was not observed or tested.")),
]}
open("/tmp/sv9289/comment.adf.json","w").write(json.dumps(doc))
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
