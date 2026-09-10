#!/usr/bin/env python3
"""Builds the SV-9498 QA comment as ADF and writes /tmp/sv9498/comment.json.
Post with:  POST /rest/api/3/issue/SV-9498/comment   (contentFormat handled by the caller)
Images are committed in this folder and embedded as external media (public repo)."""
import json, os

RAW = ("https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/"
       "claude/heic-upload-iphone-test-sz7h5p/build/sv9498-manual-return-cancel-2026-09-10/ev/")

def txt(s, marks=None):
    n = {"type": "text", "text": s}
    if marks: n["marks"] = [{"type": m} for m in marks]
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
            if i == len(r) - 1:
                mark = ["strong"] if c.startswith(("PASSED", "CONFIRMED")) else []
                cs.append(cell([p(txt(c, mark))]))
            else:
                cs.append(cell([para(c)]))
        trs.append(row(cs))
    return {"type": "table", "attrs": {"isNumberColumnEnabled": False, "layout": "default"},
            "content": trs}

CHECKS = [
    ["1", "Cancel the manual return that the customer could not cancel (same record on both builds)",
     "PASSED"],
    ["2", "All three manual returns in the data can be cleaned up, as the customer asked",
     "PASSED"],
    ["3", "Deleting an inventory part that has an open manual return is refused on screen, with a reason",
     "PASSED"],
    ["4", "The same delete is refused by the server, not just hidden on screen",
     "PASSED"],
    ["5", "No second, unguarded way to delete such a part exists anywhere in Parts",
     "PASSED"],
    ["6", "Cancelling a normal manual return still puts the stock back",
     "PASSED"],
    ["7", "Once the return is dealt with, the part can be deleted again",
     "PASSED"],
    ["8", "A part with nothing against it still deletes normally",
     "PASSED"],
    ["9", "A return that has already been credited refuses politely instead of erroring",
     "PASSED"],
    ["10", "The original cause reproduces on the released build, so the fix addresses the real thing",
     "CONFIRMED"],
]

body = [
    panel("success", p(strong("OVERALL QA STATUS: PASSED"))),
    para("Tested on the QA branch sv9498.qa.shopview.com (build v26.36.2-13b91e9, 10 September 2026), "
         "with the released behaviour on app.staging.shopview.com (v26.36.2-617d8d1) as the before "
         "picture. 10 of 10 checks passed."),

    para("In plain terms: the customer can now cancel the manual returns that were stuck, and the "
         "situation that broke them in the first place can no longer happen. If a part still has an "
         "open return or credit against it, ShopView refuses to delete it and tells you to deal with "
         "the return or credit first."),

    heading("Before and after, on the same manual return"),
    img("EX1-reported-bug-before-after.png",
        "The same manual return cancelling with an error before the fix and successfully after"),
    para("The same return — part 19419780, 5W30 Dexos Engine Oil, Hueytown Truck & Trailer Repair, "
         "quantity 2.00, requested 14 August 2026. On the released build it fails with exactly the "
         "message the customer reported and stays in the list. On the fix branch it cancels and "
         "disappears from the list."),

    heading("Everything that was checked"),
    table(["#", "Check", "Result"], CHECKS),

    heading("The part can no longer be deleted while a return is open"),
    img("EX2-part-delete-guard-before-after.png",
        "Delete offered with no warning before the fix; refused with a reason after the fix"),
    para("This is the decision Chris Ward made on 28 August — have the part properly in and out with "
         "the return or credit before deleting it. On the released build the Delete button is offered "
         "with nothing to stop you, and using it is what breaks the return. On the fix branch Delete "
         "refuses and explains why: \"Please complete or cancel the related return or credit first.\" "
         "The server refuses it as well, so it cannot be worked around."),

    heading("Cancelling a return still puts the stock back"),
    img("EX3-restock-on-cancel.png", "Stock 10, then 8 with the return open, then 10 again after cancelling"),
    para("Part 573.D430FH-HV in bin MZH1C: 10 in stock, 8 once a manual return for 2 is created, and "
         "back to 10 once that return is cancelled."),

    heading("Two things worth knowing"),
    para("The fix does more than the decision asked for, and that is a good thing. Chris chose the "
         "option that blocks deleting the part. The build also makes the cancel itself cope with a "
         "part that is already gone — and that is the half that clears the three returns the customer "
         "is stuck with today. Both halves are working."),
    para("A return that has already been credited cannot be cancelled, and that is correct: it is "
         "finished. It now says so plainly instead of failing with an error."),

    heading("What was not covered"),
    para("The customer's own returns were never touched — their data is in their own account. The "
         "already-broken case was proved on a return that exists identically on both the released and "
         "the fixed environment, which is the closest like-for-like available. Everything was run as "
         "an Admin user, so how the new refusal behaves for other roles was not checked."),

    rule(),
    heading("Technical details for developers", 3),
    p(strong("Builds: "), txt("branch sv9498.qa.shopview.com "), code("v26.36.2-13b91e9"),
      txt(" (index.html last-modified Thu, 10 Sep 2026 11:00:34 GMT); staging "),
      code("v26.36.2-617d8d1"), txt(" (11:23:49 GMT); production "), code("v26.36.2-dbe16f4"),
      txt(" (08:54:50 GMT, read-only, used only for the field comparison below).")),
    p(strong("Which build has the fix: "),
      txt("the change is server-side, so the frontend version does not identify it. ")
      , code("GET /api/inventory/parts"), txt(" returns 31 fields on the branch and 29 on staging and "
      "production; the two extras are "), code("has_outstanding_return"), txt(" and "),
      code("has_work_order_part"), txt(".")),
    p(strong("The reported failure: "), code("POST /api/part/manual-return-request/"
      "c798f0f3-4a55-46f0-a07d-0a850ce5d607/cancel"),
      txt(" → staging HTTP 500 (request id 7d161e03-d70b-40d2-8c86-19e7a5712d04); branch HTTP 204. "
          "All three manual returns cancelled on the branch — 901e076a, 92d3c57e, 1661a780 — 204 each, "
          "0 remaining. On staging, 92d3c57e and 1661a780 cancelled normally while c798f0f3 failed, so "
          "only the return whose part had actually been deleted was stuck.")),
    p(strong("The guard: "), txt("creating a manual return against part 2--83-2511PK moved it from "),
      code("{deletable: true, has_outstanding_return: false, qty 46}"), txt(" to "),
      code("{deletable: false, has_outstanding_return: true, qty 44}"), txt(". "),
      code("POST /api/inventory/parts/delete"),
      txt(" → HTTP 400 \"Inventory part with an open return or a pending credit cannot be deleted.\" "
          "The dialog's Delete sends no request and shows the tooltip. After cancelling the return the "
          "flags return to true/false and the delete succeeds (201).")),
    p(strong("Surfaces checked for a second delete route: "),
      txt("Catalog bulk actions offer Set category only; the Inventory actions menu offers Cycle count "
          "and Export only; the part-edit dialog is the single delete surface.")),
    p(strong("Credited return: "), code("POST …/manual-return-request/{id}/cancel"),
      txt(" → HTTP 400 \"Cannot cancel return that has been completed.\" Posting a credit through "
          "Create Credit issues "), code("…/manual-return-request/create"), txt(" then "),
      code("…/manual-return/{id}/create"), txt(", after which the return counts as completed and the "
          "part becomes deletable.")),
    p(strong("Root cause on the released build: "),
      txt("with an open manual return the part still reports "), code("deletable: true"),
      txt(", the delete returns 201, and the return's cancel then returns 500 — the part it needs to "
          "restock is gone.")),
    p(strong("Data written on staging while testing "), txt("(dummy account): inventory parts "),
      code("2--83-2511PK"), txt(" and "), code("4--1493-6C"), txt(" deleted; manual returns "),
      code("92d3c57e"), txt(" and "), code("1661a780"), txt(" cancelled; manual returns "),
      code("7532540d"), txt(" (deliberately orphaned to reproduce the fault) and "), code("10cde749"),
      txt(" left open. Nothing was written on production.")),
]

doc = {"version": 1, "type": "doc", "content": body}
os.makedirs('/tmp/sv9498', exist_ok=True)
with open('/tmp/sv9498/comment.json', 'w') as fh:
    json.dump({"body": doc}, fh)
print('nodes:', len(body), '| media:', sum(1 for n in body if n.get('type') == 'mediaSingle'),
      '| table rows:', len(CHECKS) + 1)
print('wrote /tmp/sv9498/comment.json')
