import json
B="https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv9065-sellprice-recalc-2026-09-03/evidence"
def t(s,m=None):
    n={"type":"text","text":s}
    if m:n["marks"]=m
    return n
def strong(s):return t(s,[{"type":"strong"}])
def code(s):return t(s,[{"type":"code"}])
def p(*c):return {"type":"paragraph","content":list(c)}
def h(s,l=3):return {"type":"heading","attrs":{"level":l},"content":[t(s)]}
def rule():return {"type":"rule"}
def panel(k,*c):return {"type":"panel","attrs":{"panelType":k},"content":list(c)}
def status(s):return {"type":"status","attrs":{"text":s,"color":"green" if s=="PASSED" else "red"}}
def cell(*c,head=False):return {"type":"tableHeader" if head else "tableCell","attrs":{},"content":list(c)}
def row(cs):return {"type":"tableRow","content":cs}
def media(url,cap):
    return [{"type":"mediaSingle","attrs":{"layout":"full-width"},"content":[{"type":"media","attrs":{"type":"external","url":url}}]},p(t(cap,[{"type":"em"}]))]
checks=[
 ("Original steps: with a Category + Cost giving an auto-calculated Sell Price, entering a Part Number no longer leaves a stale price. It sets the Category to the part's real category and recalculates the Sell Price to match (reported bug does not reproduce).","PASSED"),
 ("Sell Price recalculates to the selected Category's pricing matrix - same Cost $100 gives 70%Override $170.00, Uncategorized $222.22, HD-Filters $153.85, HD-Fasteners $158.73.","PASSED"),
 ("Switching Category quickly on a throttled connection: the Sell Price always settles to the CURRENT category, never a previous/out-of-order one.","PASSED"),
 ("If the pricing request fails while changing Category: the notice \"Could not recalculate the Sell price for this category.\" appears, the spinner clears, and the previous Sell Price stays (no silent fake recalculation).","PASSED"),
]
trows=[row([cell(p(strong("#")),head=True),cell(p(strong("What I tested")),head=True),cell(p(strong("Result")),head=True)])]
for i,(txt,st) in enumerate(checks,1):
    trows.append(row([cell(p(t(str(i)))),cell(p(t(txt))),cell(p(status(st)))]))
table={"type":"table","attrs":{"isNumberColumnEnabled":False,"layout":"default"},"content":trows}
doc={"type":"doc","version":1,"content":[
 panel("success",
   p(strong("OVERALL QA STATUS: PASSED")),
   p(t("Tested on the QA branch sv9065.qa.shopview.com (build v26.35.8-30a5c8b), in the New Part Request modal. The originally reported issue no longer reproduces (entering a Part Number no longer resets the Category to a stale \"Uncategorized\" - it sets the part's real category and recalculates the Sell Price), and both hardening points from PR #2907 check out: the Sell Price always matches the currently selected Category even when switching quickly on a throttled connection, and when the pricing request fails the app shows a clear error, clears the spinner, and keeps the previous price instead of faking a recalculation. No blocking issues."))),
 h("What I tested"),
 table,
 h("Evidence"),
 *media(B+"/01-price-tracks-category.png","Sell Price tracks the selected Category. Same Cost ($100); switching the Category recalculates the Sell Price to that category's matrix - 70%Override -> $170.00 (41.18%), Uncategorized -> $222.22 (55%)."),
 *media(B+"/02-checkA-partnumber-recalc.png","Original steps. Category 70%Override -> Sell $170.00; after picking a catalogue Part Number the Category became the part's real category (HD-Hose & Fittings, not a stale \"Uncategorized\") and the Sell Price recalculated ($170 -> $6.74). No stale price."),
 *media(B+"/03-checkB-throttled-current-category.png","Throttled rapid switching (all pricing calls delayed 1.5s): 70%override -> Uncategorized -> HD-Fasteners. Despite responses arriving out of order, the Sell Price settled to $158.73 = HD-Fasteners (the current category). The earlier $170 / $222.22 never won."),
 *media(B+"/04-checkC-failed-request-error.png","Pricing request failed while changing Category. The notice \"Could not recalculate the Sell price for this category.\" appears, the spinner clears, and the Sell Price stays at the previous $170.00 rather than pretending to be Uncategorized's $222.22."),
 rule(),
 h("How to reproduce"),
 p(strong("Price tracks category - "),t("Open a Work Order -> a line's three-dots menu -> Request part. Enter a Cost, then switch the Category a few times: the Sell Price recalculates to each category's pricing matrix.")),
 p(strong("Original steps - "),t("Pick Category 70%Override, enter a Cost (Sell Price auto-calculates), then pick a Part Number from the catalogue. The Category becomes the part's real category and the Sell Price recalculates - it does not stay on the old value.")),
 p(strong("Failure path - "),t("With the pricing request failing (e.g. the network dropped for that call), change the Category: you get the \"Could not recalculate the Sell price for this category.\" message, the spinner stops, and the previous Sell Price stays put.")),
 h("Technical details for developers"),
 p(strong("Environment: "),t("sv9065.qa.shopview.com / sv9065api.qa.shopview.com, build v26.35.8-30a5c8b (the env redeployed from v26.35.7 mid-session; everything above was re-run on 30a5c8b with the env awake). Recalc endpoint: GET /api/pricing-rules/calculate-sell-price?category_id=..&cost=..")),
 p(strong("Out-of-order proof: "),t("throttling every pricing call to 1.5s and switching 70%override -> Uncategorized -> HD-Fasteners faster than each call completed, the settled Sell Price was always the current category's ($158.73 for HD-Fasteners); the stale earlier responses did not overwrite it. Minor: during sub-second switching a brief intermediate value can flash before settling - the final value is always correct.")),
 p(strong("Failure handling: "),t("forcing the calc to fail (HTTP 500) surfaces the specific \"Could not recalculate...\" toast, clears the spinner, and keeps the previous price. Two small notes: (1) a 500 also raises the generic \"Ooooops! An error occurred\" toast alongside the specific one; (2) a TOTAL network disconnect (all requests offline) triggers the app's global \"connection lost / redirecting\" reload rather than this calc-specific handler - separate global behaviour, not part of this fix.")),
]}
open("/tmp/sv9065/comment.adf.json","w").write(json.dumps(doc))
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
