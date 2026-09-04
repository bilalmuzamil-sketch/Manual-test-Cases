import json
RAW="https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv8733-part-cost-precision-2026-09-04/evidence/"
def t(s,marks=None):
    n={"type":"text","text":s}
    if marks:n["marks"]=marks
    return n
def strong(s):return t(s,[{"type":"strong"}])
def p(*c):return {"type":"paragraph","content":list(c)}
def para(s):return p(t(s))
def rule():return {"type":"rule"}
def h(l,s):return {"type":"heading","attrs":{"level":l},"content":[t(s)]}
def img(fn,cap):
    return [
      {"type":"mediaSingle","attrs":{"layout":"full-width"},
       "content":[{"type":"media","attrs":{"type":"external","url":RAW+fn}}]},
      {"type":"paragraph","content":[t(cap,[{"type":"em"}])]}
    ]
def panel(kind,content):return {"type":"panel","attrs":{"panelType":kind},"content":content}
def cell(*c,head=False):
    return {"type":"tableHeader" if head else "tableCell","attrs":{},"content":list(c)}
def row(cells):return {"type":"tableRow","content":cells}

# status cell colored
def statusP(txt,color):
    return p(t(txt,[{"type":"strong"},{"type":"textColor","attrs":{"color":color}}]))
GREEN="#216934"

doc={"type":"doc","version":1,"content":[]}
C=doc["content"]

# 1. Overall status panel
C.append(panel("success",[
  p(strong("OVERALL QA STATUS: PASSED")),
  p(t("Tested on the SV-8733 QA branch (sv8733.qa.shopview.com, build v26.35.7-65e7373). The reported part-cost inconsistency is resolved — all 6 checks passed. A part cost entered as $45.78900 now stays $45.78900 on reopen and on the Bulk Receive page, with no rounding to $45.79000 or $45.78950."))
]))

# 2. What was tested table
tbl={"type":"table","attrs":{"isNumberColumnEnabled":False,"layout":"default"},"content":[]}
tbl["content"].append(row([cell(para("#"),head=True),cell(para("What I tested"),head=True),cell(para("Result"),head=True)]))
rows=[
 ("1","Edit Part Request: enter cost $45.78900, Save & Close, then reopen the window — cost must not round","PASSED — stays $45.78900 (was $45.79000)"),
 ("2","Reopen the window and press Save & Close changing nothing — the stored cost must not be silently rounded","PASSED — true value stays 45.78900"),
 ("3","Same no-op Save & Close after the part is ordered — the linked purchase order must not be corrupted","PASSED — PO cost stays 45.78900"),
 ("4","Parts tab inline Cost cell (the independent baseline) shows the entered value","PASSED — shows $45.78900"),
 ("5","Bulk Receive (Receive Vendor Parts) page shows the same cost for the same part","PASSED — shows $45.78900 (was $45.78950)"),
 ("6","The cost is consistent across all three screens","PASSED — all show $45.78900"),
]
for n,d,r in rows:
    tbl["content"].append(row([cell(para(n)),cell(para(d)),cell(statusP(r,GREEN))]))
C.append(h(3,"What I tested"))
C.append(tbl)

# 3. Evidence
C.append(h(3,"Evidence"))
C.append(para("I used work order S8733-17358, line \"Repair - CW rotation solenoid valve\", part \"Seal Kit\" (C1095574), vendor GCM Truck Repair - Tysons, and followed the exact steps in the ticket with a cost of $45.78900."))
for fn,cap in [
 ("exhibit-01-entered.png","Step 1 — In the Edit Part Request window I entered a part cost of $45.789 and clicked Save & Close."),
 ("exhibit-02-reopen.png","Step 2 — Reopening the Edit Part Request window: the cost still reads $45.78900. It is NOT rounded to $45.79000. This is the reported rounding-on-reopen bug, and it is fixed."),
 ("exhibit-03-bulk.png","Step 3 — The Bulk Receive (Receive Vendor Parts) page for the same part shows the same $45.78900, not $45.78950. The cost now matches across all three screens."),
]:
    for node in img(fn,cap):C.append(node)

# 4. rule + technical
C.append(rule())
C.append(h(3,"Technical details for developers"))
C.append(p(strong("Environment: "),t("sv8733.qa.shopview.com, build v26.35.7-65e7373 (index.html last-modified Thu 03 Sep 2026 11:58:29 GMT). WO S8733-17358 (d973d775…), part request 15cd3691 (Seal Kit / C1095574).")))
C.append(p(strong("Part request round-trip: "),t("After entering 45.789 via the dialog and saving, the API shows cost=45.79 (legacy 2-decimal column, unchanged behaviour) and cost_decimal=45.789 (true value). Reopening the dialog reads 45.78900 from cost_decimal. A no-op Save & Close leaves cost_decimal=45.789 — the write-back no longer overwrites it with the rounded number.")))
C.append(p(strong("Linked purchase-order item: "),t("Ordering the part created PO S-17358 (order 05d729a8, item 63bc67a1) with price=45.79 and price_decimal=\"45.78900\", total_cost_decimal=45.789. Reopening the Edit Part Request window on the ordered part and pressing Save & Close (changing nothing) leaves the PO item price_decimal at \"45.78900\" — the exact corruption in the root cause no longer happens.")))
C.append(p(strong("Baseline surface: "),t("The Parts-tab inline Cost cell (input_cost) reads 45.78900, matching the dialog and the Bulk Receive page.")))
C.append(p(strong("Out of scope: "),t("The related-not-fixed staged-part path (PartsManager::updatePartsForPartRequest writing setCost without setCostDecimal) was not tested — the dev flagged it for a separate ticket.")))

json.dump({"body":doc},open("comment.adf.json","w"),indent=0)
print("checks rows:",len(rows),"content nodes:",len(C))
