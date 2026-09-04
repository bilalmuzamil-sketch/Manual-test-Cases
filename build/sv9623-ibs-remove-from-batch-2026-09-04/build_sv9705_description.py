import json
IMG="https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv9623-ibs-remove-from-batch-2026-09-04/evidence/tooltip-issue.png"
QA="https://sv9623.qa.shopview.com/"
def t(s,m=None):
    n={"type":"text","text":s}
    if m:n["marks"]=m
    return n
def strong(s):return t(s,[{"type":"strong"}])
def link(s,href):return t(s,[{"type":"link","attrs":{"href":href}}])
def p(*c):return {"type":"paragraph","content":list(c)}
def h(s,l=3):return {"type":"heading","attrs":{"level":l},"content":[t(s)]}
def rule():return {"type":"rule"}
def li(*c):return {"type":"listItem","content":list(c)}
def ol(*items):return {"type":"orderedList","content":list(items)}
def media(url):
    return {"type":"mediaSingle","attrs":{"layout":"full-width"},"content":[{"type":"media","attrs":{"type":"external","url":url}}]}
doc={"type":"doc","version":1,"content":[
 # --- Description: as short as the issue allows ---
 p(t("On the IBS Batches -> Sent screen, when a batch contains an unpaid invoice AND a credit, that invoice's \"Remove from batch\" button is correctly greyed out - but the tooltip that explains why says \"Only unpaid invoices can be removed from a batch\", which is misleading because the invoice IS unpaid.")),
 p(t("The real reason it can't be removed is the credit in the batch, so the message should say that instead.")),
 rule(),
 h("How to reproduce"),
 p(strong("Open the QA branch to reproduce the issue: "),link(QA,QA)),
 ol(
   li(p(t("In the top menu click "),strong("Reports"),t(". In the left menu, under ACCOUNTING, click "),strong("IBS Batches"),t("."))),
   li(p(t("Click the "),strong("Sent"),t(" tab."))),
   li(p(t("Find the batch that contains "),strong("two invoices plus a credit"),t(" and click the little arrow on its left to open it. (In the screenshot below this is the batch totalling $403.91 - Glendale Diesel & Fleet Repair, Lamkin Diesel Services Inc, and a North Kensington credit.)"))),
   li(p(t("Move your mouse over the red trash / Remove icon at the far right of one of the two invoices - it is greyed out and can't be clicked."))),
   li(p(t("A small tooltip appears reading \"Only unpaid invoices can be removed from a batch\". Look at that same row's Status - it says \"Unpaid\". So the message does not fit: the invoice IS unpaid."))),
 ),
 p(strong("What you should see instead: "),t("a message that gives the real reason - the batch also has a credit, so this invoice can't be removed on its own.")),
 h("Screenshot"),
 media(IMG),
 p(t("IBS Batches -> Sent. The $403.91 batch (green) has two UNPAID invoices plus a credit. Hovering the greyed-out Remove button on the unpaid Lamkin invoice shows \"Only unpaid invoices can be removed from a batch\" (red) - but both invoices are Unpaid (blue).",[{"type":"em"}])),
 rule(),
 h("Technical details (for the developer)"),
 p(strong("Environment: "),t("sv9623.qa.shopview.com, build v26.35.8-327c626 (the QA branch for SV-9623).")),
 p(strong("Detail: "),t("The button's greyed-out state comes from the backend flag can_remove_from_batch = false. The tooltip is a single fixed string used for every greyed-out Remove button, regardless of the reason. For an unpaid invoice in a batch that also has a credit, POST /api/customers/ibs/remove-from-batch returns 400 \"This invoice can't be removed from the batch: the batch total that would remain is smaller than this invoice. Please reach out to our support team for help.\" - so the back end already knows the real reason; only the tooltip is wrong. For a genuinely paid invoice the same tooltip is correct; it is misleading only in the credit / balance-guard case.")),
 p(strong("Found while testing "),t("SV-9623 (the IBS remove-from-batch feature), which otherwise passed QA.")),
]}
print(json.dumps(doc))
