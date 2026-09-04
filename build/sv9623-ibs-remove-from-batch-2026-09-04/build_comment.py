import json
B="https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv9623-ibs-remove-from-batch-2026-09-04/evidence"
def t(s,m=None):
    n={"type":"text","text":s}
    if m:n["marks"]=m
    return n
def strong(s):return t(s,[{"type":"strong"}])
def p(*c):return {"type":"paragraph","content":list(c)}
def h(s,l=3):return {"type":"heading","attrs":{"level":l},"content":[t(s)]}
def rule():return {"type":"rule"}
def panel(k,*c):return {"type":"panel","attrs":{"panelType":k},"content":list(c)}
def status(s,color=None):
    col=color or ("green" if s=="PASSED" else ("red" if s=="FAILED" else "neutral"))
    return {"type":"status","attrs":{"text":s,"color":col}}
def cell(*c,head=False):return {"type":"tableHeader" if head else "tableCell","attrs":{},"content":list(c)}
def row(cs):return {"type":"tableRow","content":cs}
def media(url,cap):
    return [{"type":"mediaSingle","attrs":{"layout":"full-width"},"content":[{"type":"media","attrs":{"type":"external","url":url}}]},p(t(cap,[{"type":"em"}]))]
checks=[
 ("The reported problem is fixed: an invoice batched and sent in error is no longer stuck. There is now a way to take an unpaid invoice out of a Sent batch and move it back to Ready To Send.","PASSED"),
 ("A \"Remove from batch\" button now appears in a new far-right column in IBS Batches -> Sent, one per invoice inside an expanded batch.","PASSED"),
 ("Clicking it on an unpaid invoice removes it from the Sent batch and moves it back to Ready To Send (a confirm dialog first, then a \"moved back to Ready to Send\" message). The Sent batch's balance recomputes.","PASSED"),
 ("Only unpaid invoices can be removed: for a PAID invoice the button is unavailable (disabled) with a tooltip explaining why, and the back end also refuses it.","PASSED"),
 ("Edge - a credit line inside a batch has no Remove button (only invoices can be removed).","PASSED"),
 ("Edge - removing the only invoice in a batch empties the batch, which then disappears from Sent.","PASSED"),
 ("Edge - once an invoice is moved back to Ready To Send it can be batched again normally.","PASSED"),
 ("Edge - in a batch with several invoices, removing one leaves the rest in the batch and the balance recomputes.","PASSED"),
 ("Minor tooltip-wording issue in one specific case (a batch that also holds a credit) - raised as its own ticket SV-9705, linked. Not a blocker for this feature.","NOTE"),
]
trows=[row([cell(p(strong("#")),head=True),cell(p(strong("What I tested")),head=True),cell(p(strong("Result")),head=True)])]
for i,(txt,st) in enumerate(checks,1):
    stnode=status("NOTE","neutral") if st=="NOTE" else status(st)
    trows.append(row([cell(p(t(str(i)))),cell(p(t(txt))),cell(p(stnode))]))
table={"type":"table","attrs":{"isNumberColumnEnabled":False,"layout":"default"},"content":trows}
doc={"type":"doc","version":1,"content":[
 panel("success",
   p(strong("OVERALL QA STATUS: PASSED")),
   p(t("Tested on the QA branch sv9623.qa.shopview.com (build v26.35.8-327c626). All three points from the ticket work: a \"Remove from batch\" button now appears in a new far-right column in IBS Batches -> Sent; clicking it on an unpaid invoice moves that invoice back to Ready To Send (with a confirm step); and it is allowed only for unpaid invoices - a paid invoice's button is disabled and the back end refuses it too. I also went through the edge cases the developer asked about (a credit inside a batch, removing the last invoice in a batch, re-batching afterwards, and a batch with several invoices) and they all behave sensibly. One minor tooltip-wording observation is noted at the bottom - it is not a blocker."))),
 h("What I tested"),
 table,
 h("Evidence"),
 *media(B+"/01-sent-remove-buttons.png","IBS Batches -> Sent, a batch expanded. Every UNPAID invoice has a Remove button in the new far-right column (red boxes). The PAID invoice (Honest Diesel Performance, $0.00 balance / \"Paid\") has its Remove button disabled - hovering shows the tooltip \"Only unpaid invoices can be removed from a batch\" (orange). A Credit row (green) has no Remove button at all."),
 *media(B+"/02-happy-path-back-to-ready.png","The happy path. Top: clicking Remove on an unpaid invoice (INV-S2-17276, Stebner's Truck Repair) opens a confirm dialog - \"INV-S2-17276 will be moved back to Ready to Send.\" Bottom: after confirming, the invoice has left the Sent batch and is back in Ready To Send (INV-S2-17276, $3,541.07, Unpaid)."),
 rule(),
 h("How to reproduce"),
 p(strong("Set up - "),t("On IBS Batches -> Ready To Send, tick a few unpaid invoices and create a batch (they move to Sent). Pay one of them via the batch so you have a paid invoice too. Also batch one that has a credit against the same customer so you get a credit line in a batch.")),
 p(strong("The test - "),t("Go to IBS Batches -> Sent and expand a batch. Each invoice now has a trash/Remove button in the far-right column. Click it on an unpaid invoice: a \"Remove from batch?\" dialog appears, and after confirming the invoice moves back to Ready To Send and the Sent batch's balance updates. On a paid invoice the button is disabled and hovering shows \"Only unpaid invoices can be removed from a batch\". A credit line has no button.")),
 p(strong("Also worth checking - "),t("(1) remove the only invoice in a batch - the empty batch disappears from Sent; (2) after moving an invoice back, batch it again - it works; (3) in a batch with several invoices, removing one leaves the others.")),
 h("Technical details for developers"),
 p(strong("Environment: "),t("sv9623.qa.shopview.com / sv9623api.qa.shopview.com, build v26.35.8-327c626. Remove action: POST /api/customers/ibs/remove-from-batch {customer_transaction_id} -> 200, moves the invoice out of the Sent batch back to Ready To Send. The button's enabled/disabled state is driven by the backend flag can_remove_from_batch on each transaction.")),
 p(strong("Unpaid vs paid: "),t("For a paid invoice can_remove_from_batch is false, so the button is disabled with the tooltip; calling the endpoint directly on a paid invoice returns 400 \"Only an unpaid invoice can be removed from a batch. Reverse the batch payment first.\" - so the rule is enforced on the back end as well, not only in the UI.")),
 p(strong("Balance / edge cases: "),t("Removing a $2,188.75 invoice from a $12,294.55 Sent batch recomputed the batch to $10,105.80 and left the other invoices in place. Removing the last transaction emptied the batch and it dropped out of Sent. A returned invoice re-batches normally (create-batch -> 201). A credit line has no button; calling remove on a credit returns 400 (not found) - only invoices are removable. This directly supports the ticket's Impact notes (being able to issue a credit against, or re-handle, an invoice that was batched in error).")),
 p(strong("Permission: "),t("The remove action reuses the existing invoicingPayments permission (the same gate as Make Payment / creating a batch), and the whole IBS Batches view is gated by seeApArData - both are pre-existing permissions the fix reuses, not a new permission surface.")),
 p(strong("Minor observation - raised separately as SV-9705 (not a blocker): "),t("In a batch that also has an applied credit (e.g. a batch with 2 unpaid invoices plus a credit, netting to $403.91), those unpaid invoices' Remove buttons are correctly disabled, and the endpoint returns 400 \"...the batch total that would remain is smaller than this invoice...\" - a sensible balance guard. But the button's tooltip in that case still reads \"Only unpaid invoices can be removed from a batch\", which is a little misleading because the invoice IS unpaid - the real reason is the credit/balance guard. I've logged this as its own ticket, SV-9705 (linked as Relates), with an annotated screenshot. The gate itself works correctly - this is only the wording of the disabled-button tooltip.")),
]}
open("/tmp/sv9623/comment.adf.json","w").write(json.dumps(doc))
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
