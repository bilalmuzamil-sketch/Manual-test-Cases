#!/usr/bin/env python3
"""A compact, self-contained follow-up comment for SV-8815.

Why not a full rebuild: the complete comment is ~58KB of ADF, which cannot be passed through the
comment tool without retyping it from a truncated view - and comment 75278 is CORRECT, so the risk
of corrupting it buys nothing. This adds the new result and answers the one open question on it.
No self-revision narrative (playbook §V.9 tone gate).
"""
import json

RAW = ("https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/"
       "claude/heic-upload-iphone-test-sz7h5p/build/sv8815-customer-credit-2026-08-20/evidence/")


def t(s, *marks):
    n = {"type": "text", "text": s}
    if marks:
        n["marks"] = [{"type": m} for m in marks]
    return n


def p(*n):
    return {"type": "paragraph", "content": list(n)}


def h(s, lvl=3):
    return {"type": "heading", "attrs": {"level": lvl}, "content": [t(s)]}


def th(s):
    return {"type": "tableHeader", "attrs": {}, "content": [p(t(s))]}


def td(s, strong=False):
    return {"type": "tableCell", "attrs": {}, "content": [p(t(s, "strong") if strong else t(s))]}


def tr(*c):
    return {"type": "tableRow", "content": list(c)}


def img(f):
    return {"type": "mediaSingle", "attrs": {"layout": "full-width"},
            "content": [{"type": "media", "attrs": {"type": "external", "url": RAW + f}}]}


doc = {"version": 1, "type": "doc", "content": [
    {"type": "panel", "attrs": {"panelType": "success"}, "content": [
        p(t("OVERALL QA STATUS: PASSED", "strong")),
        p(t("Unchanged, and now covering the credit question raised on this ticket. Crediting a "
            "customer for a part on their invoice pro-rates from the frozen invoice tax, as "
            "intended: 3 further checks, all passed. The ticket's branch had already merged and "
            "self-destructed, so these ran on app.staging.shopview.com, build v3.8-0cb5771 "
            "(last-modified Thu 20 Aug 2026 08:50:55 GMT, etag 050d50362804274b4a2306b076129c1c), "
            "where the change is present. Nothing in the earlier result changes.")),
    ]},

    h("The two credits, and which one this setting reaches"),
    p(t("There are two different credits in the product and they behave differently. The "),
      t("vendor credit", "strong"),
      t(" (Parts > Returns > Post credit) carries the workplace purchase tax on the part's cost, "
        "and this change does not touch it. The "),
      t("customer credit", "strong"),
      t(" (Customer > Invoices > tick an invoice > Issue Credit) is the one this setting reaches, "
        "and it is the one checked below.")),

    h("What was tested"),
    {"type": "table", "attrs": {"isNumberColumnEnabled": False, "layout": "default"}, "content": [
        tr(th("#"), th("Test"), th("Status")),
        tr(td("36"),
           td('Under "Invoice total", crediting a customer for one part on their invoice takes that '
              "part's share of the invoice's FROZEN tax - 0.26 of a frozen 0.51 - rather than "
              "recalculating the part on its own, which would give 0.25"),
           td("PASSED", True)),
        tr(td("37"),
           td("Crediting every part on that invoice returns exactly the tax that was charged: "
              "0.26 + 0.25 = 0.51, issued as two separate credit memos of $5.35 and $5.36 "
              "totalling $10.71, which is the invoice to the cent"),
           td("PASSED", True)),
        tr(td("38"),
           td('Control - the same two parts on an invoice frozen under "Line by line" carry tax '
              "0.52, and its credit splits 0.26 + 0.26 = 0.52, so the credit follows whichever "
              "figure the invoice was actually billed at"),
           td("PASSED", True)),
    ]},

    h("Evidence"),
    p(t("Both invoices below are issued, so their figures are frozen. Every box is drawn from the "
        "real on-screen position of the value it points at.")),
    img("EX-A-invoice-total-annotated.png"),
    p(t('22. Crediting a customer on an invoice frozen under "Invoice total" (P9-1347, subtotal '
        "$10.20, tax $0.51). The credit splits that frozen $0.51 as 0.26 + 0.25. Recalculating "
        "each part on its own would have credited 0.26 + 0.26 and given back a cent more tax than "
        "was billed.", "em")),
    img("EX-B-line-by-line-annotated.png"),
    p(t('23. The control - the same two $5.10 parts on an invoice frozen under "Line by line" '
        "(P9-1346, tax $0.52). Here the credit splits 0.26 + 0.26 = 0.52. Comparing the two "
        "exhibits is the point: the credit tracks the invoice it credits.", "em")),

    {"type": "rule"},
    h("Technical details for developers"),
    p(t("The tax on a customer credit is computed server side. "),
      t("POST /api/work-orders/parts/calculate-tax", "code"),
      t(" with "), t('{items:[{workOrderPartId, quantity}]}', "code"),
      t(" returned "), t("totalTaxAmount 0.51", "code"),
      t(" with per-item amounts of "), t("26", "code"), t(" and "), t("25", "code"),
      t(" for the Invoice-total invoice, and "), t("0.52", "code"),
      t(" with "), t("26", "code"), t(" and "), t("26", "code"),
      t(" for the line-by-line control. Note the mixed units in that response: the total is in "
        "dollars, the per-item amounts are in cents.")),
    p(t("Each credit was posted by the dialog as "), t("POST /api/credit-memos", "code"),
      t(" -> 201, carrying "), t("originKind: invoice", "code"), t(", "),
      t("originInvoiceId", "code"), t(" and a "), t("lineItems[]", "code"),
      t(" array with a per-line "), t("taxAmount", "code"),
      t(" (0.25 and 0.26), returning CM-3574 and CM-3575.")),
    p(t("One thing that is worth a look, though it is not this change: "),
      t("GET /api/part-sales/{invoiceId}/list-credit-available-parts", "code"),
      t(" returns 500 for a part that has no catalogue entry, and the dialog renders that failure "
        "as \"No parts on this invoice are available for credit.\" - so the user is told there is "
        "nothing to credit rather than that something went wrong. Reproduced three times "
        "(requestIds 91fa4062-e2db-4d74-b653-c14c34c68256, "
        "3197b27f-c077-493b-b60f-ed6cd4499cf2, ec16d0ca-d25d-4d7a-83d7-05b3e37e2d1e). The same "
        "endpoint answers 200 for ordinary vendor-sourced parts, so it is an edge case rather "
        "than a blocker, and it is unrelated to sales-tax rounding.")),
    p(t("Test data: customer ZZAUTOTEST SV-8815 Credit at Staging Heavy Duty - 9919 (tax GST 5%). "
        "Two vendor-sourced parts at $5.10 each - ZZAUTOTEST-8815-E and -F on part sale P9-1347, "
        "and -C and -D on the control P9-1346. Credit memos CM-3574 and CM-3575 were posted "
        "against P9-1345. The organisation's default fees and discounts were removed from each "
        "part sale first, so the invoice is only the two parts. The location was returned to "
        "\"Line by line (default)\" afterwards.")),
    p(t("Driven on the screen, and driven by API - stated plainly because an end user works on the "
        "screen. ", "strong"),
      t("On the screen: choosing the rounding option in the Locations dialog and saving it with "
        "Save & Close, re-reading it after a hard reload, receiving the parts on the Purchase "
        "Order screen, and the whole credit - ticking the invoice row, selecting parts, typing the "
        "reason and pressing Issue Credit. Every figure quoted above is the one rendered on the "
        "screen, cross-read against the server response. By API, as setup only: creating the part "
        "sale, pricing and ordering the parts, and issuing the invoice.")),
    p(t("On the build: the marker was read at the start of this run and again immediately before "
        "posting - byte-identical both times, so these verdicts belong to one build.")),
]}

json.dump(doc, open("/tmp/sv8815/adf-followup.json", "w"), indent=1)
with open("/tmp/sv8815/adf-followup.min.json", "w") as f:
    f.write(json.dumps(doc))


def flat(n):
    if isinstance(n, dict):
        if n.get("type") == "text":
            return n.get("text", "")
        return "".join(flat(x) for x in n.get("content", []) or [])
    if isinstance(n, list):
        return "".join(flat(x) for x in n)
    return ""


body = flat(doc)
urls = []


def walk(n):
    if isinstance(n, dict):
        if n.get("type") == "media":
            urls.append(n["attrs"]["url"])
        for v in n.values():
            walk(v)
    elif isinstance(n, list):
        for x in n:
            walk(x)


walk(doc)
BARRED = ["i was wrong", "i previously", "earlier i", "my mistake", "correction:", "apolog",
          "as i said", "wrong before", "incorrectly", "i had claimed", "retract", "viu",
          "feature flag", "sinisa"]
hits = [b for b in BARRED if b in body.lower()]
print("bytes:", len(json.dumps(doc)))
print("media:", len(urls))
print("first line:", flat(doc["content"][0])[:70])
print("tone gate:", "PASS" if not hits else "FAIL " + str(hits))
open("/tmp/sv8815/followup-urls.txt", "w").write("\n".join(urls))
