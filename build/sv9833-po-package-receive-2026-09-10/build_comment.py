#!/usr/bin/env python3
"""Builds the SV-9833 QA comment as ADF and writes /tmp/sv9833/comment.json.
Images are committed in this folder and embedded as external media (public repo)."""
import json, os

RAW = ("https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/"
       "claude/heic-upload-iphone-test-sz7h5p/build/sv9833-po-package-receive-2026-09-10/ev/")


def txt(s, marks=None):
    n = {"type": "text", "text": s}
    if marks:
        n["marks"] = [{"type": m} for m in marks]
    return n


def p(*kids): return {"type": "paragraph", "content": list(kids)}
def para(s): return p(txt(s))
def strong(s): return txt(s, ["strong"])
def code(s): return txt(s, ["code"])
def rule(): return {"type": "rule"}
def heading(s, lvl=3): return {"type": "heading", "attrs": {"level": lvl}, "content": [txt(s)]}


def panel(kind, *kids):
    return {"type": "panel", "attrs": {"panelType": kind}, "content": list(kids)}


def img(name, alt):
    return {"type": "mediaSingle", "attrs": {"layout": "full-width"},
            "content": [{"type": "media", "attrs": {"type": "external", "url": RAW + name, "alt": alt}}]}


def cell(kids, head=False):
    return {"type": "tableHeader" if head else "tableCell", "attrs": {}, "content": kids}


def row(cells): return {"type": "tableRow", "content": cells}


def table(header, rows):
    trs = [row([cell([p(strong(h))], True) for h in header])]
    for r in rows:
        cs = []
        for i, c in enumerate(r):
            mark = ["strong"] if (i == len(r) - 1 and c.startswith("PASSED")) else []
            cs.append(cell([p(txt(c, mark))]))
        trs.append(row(cs))
    return {"type": "table", "attrs": {"isNumberColumnEnabled": False, "layout": "default"},
            "content": trs}


CHECKS = [
    ["1", "The reported problem: order 1 package of 19 at $10.00 through Add Order Item on a purchase "
          "order that already exists, then receive it", "19 units at $0.53 each", "PASSED"],
    ["2", "The same thing done through the Receive button on the purchase order, which is the way most "
          "people will do it", "19 units at $0.53 each", "PASSED"],
    ["3", "A part that is not in Inventory yet, added as a new special order part with a package",
     "19 units at $0.53 each", "PASSED"],
    ["4", "Two packages of 10 at $100.00 each, received together", "20 units at $10.00 each", "PASSED"],
    ["5", "Two packages received one at a time", "10 units, one package still owing, then 20", "PASSED"],
    ["6", "A package line added while creating the purchase order — the way that already worked before "
          "the fix", "19 units at $7.75 each", "PASSED"],
    ["7", "The per-unit costs land on the figures in your own table", "$0.53 and $7.75", "PASSED"],
    ["8", "The Vendor Invoice still bills quantity 1 at the package price, with the pack size shown "
          "separately", "1.00 at $10.00, pack size 19, total $30.98", "PASSED"],
    ["9", "An ordinary line on the same purchase order is not affected (one ran alongside every case "
          "above)", "2 units at $9.75, unchanged", "PASSED"],
    ["10", "Work order purchase orders are untouched — there is no way to put a package on one",
     "no Add Order Item button at all", "PASSED"],
]

body = [
    panel("success", p(strong("OVERALL QA STATUS: PASSED"))),
    para("Tested on the QA branch sv9833.qa.shopview.com (build v26.36.2-165cc79, 10 September 2026), "
         "with the released behaviour on app.staging.shopview.com (v26.36.2-a678e3c) as the before "
         "picture. 10 of 10 checks passed."),

    para("In plain terms: when you order one pail as a package of 19, ShopView now puts 19 units into "
         "Inventory and works out what each one cost. Before the fix it put in a single unit and gave "
         "that one unit the price of the whole pail, which is why Devon was having to correct the "
         "quantity and divide the cost by hand every time."),
    para("The bill from the vendor has not changed, and that is deliberate — it still shows quantity 1 "
         "at the package price, because that is what the vendor actually charged. The pack size now "
         "appears in its own column beside it."),

    heading("Before and after, same part, same order, same starting stock"),
    img("EX1-reported-bug-before-after.png",
        "The same inventory part showing 1 unit at $10.00 before the fix and 19 units at $0.53 after"),
    para("Synthetic Dexron VI ATF, 1L (POI5730C) — the closest thing in the test data to Devon's 19 "
         "litre pail. Both environments started with none of it in stock at a cost of $6.93. Both had "
         "one package of 19 ordered at $10.00, added through Add Order Item on a saved purchase order, "
         "then received with Quantity Received 1. The released build ends up with 1 unit valued at "
         "$10.00; the fix branch ends up with 19 units valued at $0.53."),

    heading("Everything that was checked"),
    table(["#", "Check", "What happened on the fix branch", "Result"], CHECKS),

    heading("The pack size now reaches the receiving screen and the invoice"),
    img("EX2-receive-screen-before-after.png",
        "The Receive Parts screen with and without the Items Per Package column"),
    para("The receiving screen at Accept Delivery now carries an Items Per Package column, reading 19 "
         "for the package line and a dash for the ordinary line. On the released build that column "
         "does not exist, which is the quickest way to tell that a pack size was never saved."),
    img("EX3-vendor-invoice-before-after.png",
        "The vendor invoice on both builds: same money, pack size only on the fixed build"),
    para("The Vendor Invoice bills exactly the same amount on both builds — quantity 1.00 at $10.00, "
         "total $30.98. The only difference is that the fixed build records the pack size of 19 "
         "alongside it."),

    heading("The other cases you asked for"),
    img("EX4-other-package-cases.png",
        "Multiple packages, partial receiving, and the create-purchase-order path, all on the fix branch"),
    para("Two packages of 10 at $100.00 each came in as 20 units at $10.00. Receiving them one at a "
         "time gave 10 units first, left one package showing as still owing on the purchase order, and "
         "added the other 10 when the second package arrived. A package of 19 at $147.16 added on the "
         "create screen gave 19 units at $7.75, which is the second row of your rounding table."),

    heading("One thing about the fix that is worth knowing"),
    para("The fix has two separate halves, and only one of them is the one described in the ticket."),
    para("For a part that is already in Inventory — which is the case Devon hit — the released build "
         "was in fact sending the pack size when you pressed Add. It was being accepted and then "
         "thrown away, so the order line was stored with no pack size. That is now kept, and that is "
         "what fixes the reported problem."),
    para("Separately, for a part that is not in Inventory yet and gets added as a new special order "
         "part, the released build was not sending the pack size at all. That is now sent too. Both "
         "halves work, so this does not change the result — it is only that the cause was a little "
         "wider than the ticket describes."),

    heading("Three things I looked at and did not treat as faults"),
    para("SV-9721, the request to show the pack size while receiving, is now half built. There are two "
         "receiving screens. The Accept Delivery screen does show the pack size on this branch. The "
         "screen that the Receive button on the purchase order actually opens does not show it, on "
         "either build — so SV-9721 should stay open, but half of it is already done."),
    para("The Edit Order Item dialog has no Package tick box and no Items Per Package field, on both "
         "builds. So once a line is on the purchase order you cannot see or change its pack size. That "
         "is not a regression, and it is exactly why an old line has to be deleted and added again "
         "rather than edited. Worth a product decision one day."),
    para("Very early in testing, one purchase order's receiving screen said everything had already "
         "been received when nothing had. I could not make it happen again on either build, so I am "
         "not raising it — just noting it."),

    heading("What was not covered"),
    para("Devon's own purchase order I-15 was never touched — it is in Summit Fire Apparatus's own "
         "account. Everything above was reproduced on a part that exists identically on the released "
         "and the fixed environment, from the same starting quantity and cost. Everything ran as an "
         "Admin user, so how the package fields behave for other roles was not checked. And the note "
         "that purchase order lines created before the fix will not repair themselves could not be "
         "tested on this branch, because every line here was created after the fix."),

    rule(),
    heading("Technical details for developers", 3),
    p(strong("Builds: "), txt("fix branch sv9833.qa.shopview.com "), code("v26.36.2-165cc79"),
      txt(" (index.html last-modified Thu, 10 Sep 2026 11:16:21 GMT, etag "),
      code("68db9efce85dc1bbe628305249d6a9c6"),
      txt("), re-read unchanged at the end of the pass. Before picture on staging "),
      code("v26.36.2-a678e3c"), txt(" (12:42:51 GMT). The two are clones of the same organisation, so "
      "the part ids match: POI5730C is "), code("16d69ea0-12eb-4729-959f-71f5dd16b943"),
      txt(" on both, starting at quantity 0 / cost $6.93 on both.")),
    p(strong("The server-side half. "),
      txt("For an existing inventory part the staging front end already sent the field: captured "),
      code("POST /api/inventory/orders/add-item"), txt(" body "),
      code('{"order_id":"88d5ccda…","part_number":"POI5730C","quantity_ordered":1,"price":10,'
           '"part_id":"16d69ea0…","itemsPerPackage":19}'),
      txt(" — the same shape as the branch's. The stored order item then read "),
      code("itemsPerPackage: null"), txt(" on staging and "), code("19"),
      txt(" on the branch. Reproduced on a second part, 2--SHL55057739, with the same result.")),
    p(strong("The front-end half. "),
      txt("For a part added with Add new special order part, staging's payload ends "),
      code('"manufacturer_id":""'), txt(" with no "), code("itemsPerPackage"),
      txt(" key at all; the branch sends it. In the deployed "), code("OrderItemModal"),
      txt(" bundle staging has "),
      code("c&&!x.value&&(e.part_id=c,f.value&&(e.itemsPerPackage=D.value))"),
      txt(" and the branch has "),
      code("c&&!M.value&&(e.part_id=c),f.value&&(e.itemsPerPackage=T.value)"),
      txt(" — the assignment moved out of the has-a-part-id guard. "),
      code('x/M = part_type==="new_part"'), txt(" in both.")),
    p(strong("Measurements. "),
      txt("POI5730C 0→19 at $0.53 (branch) versus 0→1 at $10.00 (staging); 19421426 0→20 at $10.00 "
          "(2 packages of 10 at $100); 104775 0→10 then →20 at $10.00 with the line reading received "
          "1.00 / remaining 1 in between and the purchase order at Partial Delivery; 68175338AC 0→19 "
          "at $7.75 ($147.16 ÷ 19); 2--SHL55057739 0→19 at $0.53 via the Receive button path; new part "
          "ZZAUTOTEST-PKG-1 0→19 at $0.53 (branch) versus 0→1 at $10.00 (staging). Control part 122993 "
          "took +2 at $9.75 on every single case, on both builds, with its pack size null throughout. "
          "Sell price is recalculated from cost by both builds, which is why it moved as well.")),
    p(strong("Surfaces compared. "),
      txt("Items Per Package column: present on the branch at "), code("/accept-delivery/{orderId}"),
      txt(" and on the vendor invoice at "), code("/parts/delivery/{deliveryId}"),
      txt("; absent on both builds at "), code("/order/{orderId}?receive=1"),
      txt(", which is where the Receive button and the purchase-order list's Receive link both go. "
          "The New Purchase Order dialog's items table shows the column once a package line exists, "
          "on both builds. The purchase order detail table and the Edit Order Item dialog are "
          "identical on both builds. Vendor invoice amounts $29.50 / $1.48 / $30.98 identical.")),
    p(strong("Test data. "),
      txt("Purchase orders I-1395 to I-1400 on the branch and I-1457 to I-1459 on staging, vendor "
          "Stillwater Diesel Repair, invoice numbers ZZAUTOTEST-9833-1 through -6. Receiving less than "
          "ordered raises a Delivery status dialog offering Receive As Order Fulfilled or Receive As "
          "Partial Delivery, and sends no request until one is chosen.")),
]

doc = {"version": 1, "type": "doc", "content": body}
os.makedirs('/tmp/sv9833', exist_ok=True)
with open('/tmp/sv9833/comment.json', 'w') as fh:
    json.dump({"body": doc}, fh)
print('nodes:', len(body), '| media:', sum(1 for n in body if n.get('type') == 'mediaSingle'),
      '| table rows:', len(CHECKS) + 1)
print('wrote /tmp/sv9833/comment.json')
