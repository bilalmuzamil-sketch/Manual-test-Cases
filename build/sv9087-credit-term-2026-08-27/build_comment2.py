import json
BASE="https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv9087-credit-term-2026-08-27/evidence"
def t(s): return {"type":"text","text":s}
def tb(s): return {"type":"text","text":s,"marks":[{"type":"strong"}]}
def para(*c): return {"type":"paragraph","content":list(c)}
def img(fn,cap):
    return [{"type":"mediaSingle","attrs":{"layout":"full-width"},
             "content":[{"type":"media","attrs":{"type":"external","url":f"{BASE}/{fn}"}}]},
            {"type":"paragraph","content":[{"type":"text","text":cap,"marks":[{"type":"em"}]}]}]
def cell(*c,h=False):
    return {"type":"tableHeader" if h else "tableCell","content":list(c)}
def row(cells): return {"type":"tableRow","content":cells}

doc={"type":"doc","version":1,"content":[]}
C=doc["content"]
C.append({"type":"panel","attrs":{"panelType":"success"},"content":[para(tb("OVERALL QA STATUS: PASSED"))]})
C.append(para(t("I tested this on the "),tb("sv9087"),t(" QA branch (build "),tb("v26.35.4-b216483"),
    t("). For the reported crash I reproduced the customer's exact flow end to end — reverse an invoice, recreate the invoice after the reversal, and change the invoice date back to the original earlier date — on a customer stored with the mis-spelled term “NET 30”. The mis-spelled terms were seeded via the API, since the credit-term dropdown in the UI only ever writes canonical values. All six user-facing checks reachable on this branch pass. The QuickBooks Terms de-duplication (check G) is covered by the developer's unit tests and is deferred for a live QuickBooks Online check — see the notes below.")))

C.append(para(tb("What I tested")))
rows=[
 ("#","Test","Result"),
 ("1","A — Reverse an invoice → re-invoice → change the invoice date back to an earlier date (the reported crash)","PASSED"),
 ("2","B — Impossible-date guard","PASSED"),
 ("3","C — Credit Hold gate (case-insensitive)","PASSED"),
 ("4","D — Charge Account withheld from cash-on-delivery customers","PASSED"),
 ("5","E — Invoice due date computed +30 (back-end)","PASSED"),
 ("6","F — Vendor due dates (Accept Delivery)","PASSED"),
 ("7","G — QuickBooks Term de-duplication","Unit-covered, live check deferred"),
 ("8","H — Canonical-data regression controls","PASSED"),
]
trows=[row([cell(para(tb(x)),h=True) for x in rows[0]])]
for r in rows[1:]:
    trows.append(row([cell(para(t(r[0]))),cell(para(t(r[1]))),cell(para(tb(r[2])))]))
C.append({"type":"table","attrs":{"isNumberColumnEnabled":False,"layout":"default"},"content":trows})

C.append(para(tb("Evidence")))
C+=img("EX-A-reversal-reinvoice-date-change.png","Check A (the reported crash) — the customer's exact flow, with the work-order status and the date at each step: (1) Complete — Aug 27, 2026; (2) Invoiced — badge flips to Invoiced, Aug 27; (3) Reversed — back to Complete, the re-invoice date defaults to today (Aug 27), which is the customer's “it shows today instead of Friday”; (4) Re-invoiced — the invoice date is changed BACK to Aug 21, 2026, the due date recomputes to Sep 20, the page does not blank and shows no error, and the invoice re-creates with the corrected date. On the unfixed build this is where it errored and refused to change the date.")
C+=img("EX-C-credit-hold-annotated.png","Check C — “CREDIT HOLD” / “credit hold” / padded all show the Credit Hold banner, disable Create Invoice, and show the tooltip “Cannot invoice this customer. Customer is on Credit Hold”.")
C+=img("EX-D-charge-account-comparison.png","Check D — cash-on-delivery (cod / COD / whitespace-only) withholds the Charge Account button and payment method; Net 30 / Due On Receipt / Prepaid still show it. Same work order and invoice, differing only by the customer's credit term.")
C+=img("E-invoice-created-payment.png","Check E — invoice created for the NET 30 customer: the document shows Terms NET 30 and a due date 30 days after the issue date.")
C+=img("F-receive-screen.png","Check F — vendor credit term “NET 30”: Accept Delivery records the delivery due date 30 days out.")
C+=img("G-quickbooks-admin.png","Check G — QuickBooks is connected on this org, but the invoice sync currently fails on a tax-code configuration issue unrelated to this ticket (see notes). The term logic is unit-covered.")

C.append({"type":"rule"})
C.append(para(tb("Technical details for developers")))
def bl(*items): return {"type":"bulletList","content":[{"type":"listItem","content":[para(*i)]} for i in items]}
C.append(bl(
 [tb("Environment: "),t("sv9087.qa.shopview.com, build v26.35.4-b216483. Terms seeded via POST /api/customers/change and (vendor) POST /api/parts-catalogue/change-vendor with the full record + a mis-spelled credit_term. A customer contact is required for the invoice preview to render (without one, GET /api/invoices/{wo}/details returns 500 and Create Invoice stays disabled).")],
 [tb("A (reported flow): "),t("WO S9087-15890, customer term “NET 30”. Complete → Invoiced (invoice date Aug 27, due Sep 26) → Reversed (WO returns to Complete, the re-invoice date field defaults to today) → changed the invoice date back to 08/21/2026: the due date recomputed to Sep 20, 2026, no error boundary, no blank, and the invoice re-created with the Aug 21 date. Separately confirmed no crash and correct due dates across net 30 / Net30 / Net 30 Days / Due On Receipt (same-day) / CREDIT HOLD / Prepaid.")],
 [tb("B: "),t("Typed 13/01/2026 into date_input_invoice_date — issue and due dates unchanged on screen, no new invoice/estimate request fired.")],
 [tb("D: "),t("Verified in the auto-opened payment dialog after Create Invoice (reverse + re-create per term). button_charge_account absent for cod / COD / whitespace-only; present for Net 30 / Due On Receipt / Prepaid (pre-selected as the method for the first two).")],
 [tb("E/F: "),t("Created invoice document due date = issue + 30; vendor Accept Delivery due date = invoice date + 30 (2026-08-27 → 2026-09-26).")],
 [tb("G (QuickBooks): "),t("QB is connected on org d55bc308 (QuickBooks admin: Deposit sync enabled, mappings present). The invoice sync currently fails before the term step with “Invalid Line TaxCode ... Valid line TaxCodes for US should be TAX or NON. Supplied value: 3” (Canadian GST vs a US QB company) and QB sync is paused for deposits and fees/discounts — all unrelated to this fix. The credit-term de-dup itself resolves through the same case-folding proven live in checks C and F, and is covered by the unit tests (38 inputs through the real CreditTerms class). A live QuickBooks Online Terms-list check is deferred until a QB-verifiable environment is available.")],
))
print(json.dumps(doc))
