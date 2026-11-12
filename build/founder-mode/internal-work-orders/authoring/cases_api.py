"""Section "API" (Rule 4: every case with API requests, responses or status codes). The core release part (S3-R4: the internal invoice
is never listed and invoice webhooks are never sent; the work order reads `invoiced`) runs with the release; Story 11 (SV-11833) is
built after the Open API refactoring, so its cases open with a BLOCKED ON RELEASE line; invoice creation through the Open API is
disabled today and enabled for general availability. Field names are the PRD's; the steps point at the Open API documentation."""
from iwo_lib import C, NOMAN, API_BANNER, API_HOLD, GA_BANNER, GA_HOLD
from common import *

S = "API"
KEY = "Use an Open API key for the test organization, the Open API documentation, and a tool that sends API requests."
HOOK = "Have a webhook subscription for the test organization pointed at a request-catching page the tester can read."


def api(key, title, pre, steps, res, q, **kw):
    C(key, S, title, [KEY] + pre, steps, res, q, api=True, **kw)


def api11(key, title, pre, steps, res, q, **kw):
    api(key, title, pre, steps, res, q, banner=API_BANNER, marker=API_HOLD, **kw)


api("API-01", "Open API invoice lists never include the internal invoice",
    [ON, icust("A"), iwo(1, "A", "closed"), wo(2, "A", "invoiced", ", billable, made before customer A was flagged, so a listed invoice can be compared")],
    ["Send GET /v1/invoices.", "Send GET /v1/work-orders/[id]/invoices with work order 1's id.", "Send GET /v1/customers/[id]/invoices with customer A's id."],
    [["The response is 200.", "Work order 2's invoice is listed; work order 1's internal invoice is not."], ["The response is 200 and lists no invoice."],
     ["The response is 200; it lists work order 2's invoice and not work order 1's."]],
    ["S3-R4", "S11-R2", "T-INV"])
api("API-02", "Open API answers 404 for the internal invoice by id",
    [ON, icust("A"), iwo(1, "A", "closed", ", whose internal invoice id is taken from the work order's Finance tab address")],
    ["Send GET /v1/invoices/[id] with the id of work order 1's internal invoice."],
    [["The response is 404."]],
    ["S11-R2", ("Jira SV-11976", "The asset's Invoices tab lists the closed record at $0.00; no closed record appears on any receivables list, and the Open API answers 404 for it on `/v1/invoices/{id}`.")])
api("API-03", "Before the Open API story, a closed work order reads invoiced",
    [ON, icust("A"), iwo(1, "A", "closed")],
    ["Send GET for work order 1 through the Open API."],
    [["The response is 200 and the status reads `invoiced`."]],
    ["S11-R2"])
api("API-04", "No invoice webhook is sent when a work order is closed",
    [ON, NO_ACCT, REVIEW_OFF, HOOK + " Subscribe it to invoice.created and invoice.paid.", icust("A"), iwo(1, "A", "Complete"),
     wo(2, "A", "Complete", ", billable, made before customer A was flagged, so an invoice webhook can be seen")],
    ["In ShopView, close work order 1.", "In ShopView, invoice work order 2.", "Open the request-catching page to read the webhook requests."],
    [["Work order 1 is Closed."], ["Work order 2 is invoiced."], ["invoice.created arrived for work order 2.", "Nothing arrived for work order 1."]],
    ["S3-R4", "S11-R3", "S11-N2"])
api("API-05", "The Open API keeps listing ordinary invoices as before",
    [ON, cust("A"), wo(1, "A", "invoiced", ", billable, with one line marked No Charge under Goodwill")],
    ["Send GET /v1/invoices.", "Send GET /v1/invoices/[id] with the id of work order 1's invoice."],
    [["Work order 1's invoice is listed."], ["The response is 200 with the invoice."]],
    ["OOS-14", "S11-R4"])
api11("API-06", "An internal work order carries its classification and category",
      [ON, icust("A"), iwo(1, "A", "Approved")],
      ["Send GET for work order 1 through the Open API."],
      [["The response is 200.", "classification reads internal.", "category gives General Internal's key and name."]],
      ["S11-R1", "S2-R12", "T-CLASS"])
api11("API-07", "A no-charge work order carries its category and originals",
      [ON, cust("A"), "Have a new invoiced work order for this test, work order 2, for customer A, whose line 1 was done by technician A.",
       ncwo(1, "A", "Comeback", "Approved", ", with work order 2's line 1 as its original")],
      ["Send GET for work order 1 through the Open API."],
      [["classification reads no_charge.", "category gives Comeback's key and name.", "original_work_order, original_line and original_technician name work order 2, its line 1 and technician A."]],
      ["S11-R1"])
api11("API-08", "Lines carry the no-charge fields, invoice lines show 0",
      [ON, cust("A"), wo(1, "A", "invoiced", ", billable, whose line 2 was No Charge under Goodwill")],
      ["Send GET for work order 1 through the Open API.", "Send GET for work order 1's invoice through the Open API."],
      [["Line 2 reads no_charge true and no_charge_category Goodwill; line 1 reads no_charge false."], ["The invoice's line 2 reads 0 with the same no-charge fields."]],
      ["S11-R1"])
api11("API-09", "Customers carry internal and assets their internal category",
      [ON, icust("A", ", with one asset, asset 1, whose Internal category is General Internal")],
      ["Send GET for customer A through the Open API.", "Send GET for asset 1 through the Open API."],
      [["internal reads true and default_internal_category gives the customer's category."], ["internal_category gives General Internal."]],
      ["S11-R1"])
api11("API-10", "The classification fields cannot be written through the Open API",
      [ON, cust("A"), wo(1, "A", "Approved", ", billable")],
      ["Send PATCH for work order 1 through the Open API setting classification to no_charge."],
      [["The change is refused.", "A GET of work order 1 still reads classification billable."]],
      ["S11-R1", "S11-R4", "PM-R1"])
api11("API-11", "A closed work order reads closed, and completed after Reopen",
      [ON, NO_ACCT, icust("A"), iwo(1, "A", "closed")],
      ["Send GET for work order 1 through the Open API.", "In ShopView, reopen work order 1 from the Finance tab.", "Send GET for work order 1 again."],
      [["status reads closed with classification internal."], ["Work order 1 is Complete."], ["status reads completed."]],
      ["S11-R2"])
api11("API-12", "The status webhook is sent at Close and at Reopen",
      [ON, NO_ACCT, REVIEW_OFF, HOOK + " Subscribe it to work_order.status_changed.", icust("A"), iwo(1, "A", "Complete")],
      ["In ShopView, close work order 1.", "In ShopView, reopen work order 1.", "In ShopView, close work order 1 again.", "Open the request-catching page to read the webhook requests."],
      [["Work order 1 is Closed."], ["Work order 1 is Complete."], ["Work order 1 is Closed again."],
       ["work_order.status_changed arrived three times: closed, completed, closed, although work order 1 was already Complete before the first Close.", "The classification is internal in each."]],
      ["S11-R3", "S11-E1"])
api11("API-13", "The API keeps the written classification after the flag is removed",
      [ON, icust("A"), iwo(1, "A", "Approved"), "After work order 1 was made, remove customer A's Internal flag."],
      ["Send GET for work order 1 through the Open API."],
      [["classification still reads internal.", "Customer A's internal reads false."]],
      ["S11-R1", "KD-WRITTEN"])
api11("API-14", "A work order created through the Open API for an internal customer is internal",
      [ON, icust("A", ", with one asset, asset 1")],
      ["Send POST to create a work order for customer A on asset 1 with one labor line priced $100.00 and 2.0 hours.", "Open the new work order in ShopView."],
      [["The work order is created."], ['It shows the "Internal" badge.', "Its labor line shows 2.0 hours and no price: the $100.00 was dropped."]],
      ["S11-R4", "S2-E1"])
api11("API-15", "No Charge cannot be set through the Open API",
      [ON, cust("A", ", with one asset, asset 1")],
      ["Send POST to create a work order for customer A on asset 1 with classification no_charge."],
      [["No Charge is not set: the request is refused, or the work order is created billable with no \"No Charge\" badge."]],
      ["S11-R4"])
api11("API-16", "A customer change through the Open API follows the new customer",
      [ON, cust("A"), icust("B"), wo(1, "A", "Approved", f", billable, with {LABOR_2H}")],
      ["Send PATCH for work order 1 through the Open API changing its customer to customer B.", "Open work order 1 in ShopView."],
      [["The change is accepted, with no window."], ['Work order 1 shows the "Internal" badge and no prices.']],
      ["S11-R4", "S2-R7"])
api("API-17", "Creating an invoice for an internal work order through the Open API is refused",
    [ON, REVIEW_OFF, icust("A"), iwo(1, "A", "Complete")],
    ["Send POST /v1/invoices for work order 1."],
    [['The request is refused with the error "This work order is internal or no charge. Close it in ShopView."']],
    ["S11-R4", "UFS-29"], banner=GA_BANNER, marker=GA_HOLD)
api("API-18", "Creating an invoice through the Open API invoices a no-charge line at 0",
    [ON, REVIEW_OFF, cust("A"), wo(1, "A", "Complete", ", billable, whose line 2 is No Charge under Goodwill")],
    ["Send POST /v1/invoices for work order 1.", "Open work order 1's invoice in ShopView."],
    [["The invoice is created."], ['Line 2 shows $0.00 with "Goodwill".']],
    ["S11-R4"], banner=GA_BANNER, marker=GA_HOLD)
api11("API-19", "The changelog announces the new fields and the closed status",
      [ON],
      ["Open the Open API changelog in the documentation.", "Open the work order schema in the documentation."],
      [["An entry announces classification, category, the no-charge line fields, the customer and asset fields and the status closed."],
       ["The schema documents the new fields and the closed status value."]],
      ["S11-R5"])
api11("API-20", "Without Open API V1 nothing changes for the organization",
      [ON, "Use an organization without Open API V1 enabled."],
      ["Send GET for any work order with that organization's key."],
      [["The request is refused as today, with no new fields to see."]],
      ["S11-N1"])
api11("API-21", "The fields stay after the setting is turned off",
      [cust("A"), ncwo(1, "A", "Goodwill", "closed", ", closed while the setting was on"), "Turn the Internal Work Orders setting off."],
      ["Send GET for work order 1 through the Open API."],
      [["classification reads no_charge, category Goodwill and status closed."]],
      ["S11-E2"])
api11("API-22", "The warranty flag of a line follows its No Charge category",
      [ON, cust("A"), wo(1, "A", "Approved", ", billable, with line 1 No Charge under Warranty, line 2 No Charge under Goodwill and line 3 billable"),
       ncwo(2, "A", "Warranty", "Approved", ", with two lines")],
      ["Send GET for work order 1 through the Open API.", "Send GET for work order 2 through the Open API."],
      [["Line 1 reads is_warranty true; line 2 and line 3 read false."], ["Both lines read is_warranty true."]],
      ["S2-R22"])
api("API-23", "Convert to No Charge sends work_order.updated with the lines",
      [ON, HOOK + " Subscribe it to work_order.updated.", cust("A"), wo(1, "A", "Approved")],
      ["In ShopView, convert work order 1 to No Charge under Goodwill.", "Open the request-catching page to read the webhook requests."],
      [['Work order 1 shows the "No Charge" badge.'], ["work_order.updated arrived with work order 1 and its lines in the body."]],
      ["S11-R3"], banner=API_BANNER, marker="PO:work-order-updated")
api("API-24", "The internal invoice list used by the app leaves the closed record out",
    [ON, icust("A"), iwo(1, "A", "closed")],
    ["Send GET /api/invoices/list for the test location."],
    [["Work order 1's internal invoice is not in the response."]],
    ["S3-R6"], marker=NOMAN("this is the app's own request, which needs a signed-in session token a tester does not handle"))
