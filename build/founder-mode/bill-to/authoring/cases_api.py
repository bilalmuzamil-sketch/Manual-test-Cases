"""Story 19, Public API part (SV-12321) — section "API" (Rule 4: every case with API requests, responses or status codes). Field and
parameter names come from the Public API documentation of the build; the PRD names none, so the steps point at the documentation and
the results say what must be in the response. Read and filter only: the Public API cannot set a Bill To or read a saved default."""
from bt_lib import C
from common import *

S = "API"
KEY = "Use a Public API key for the test organization, the Public API documentation, and a tool that sends API requests."
A = cust("A", ", the customer the work is for")
B = cust("B", ", the payer")


def api(key, title, pre, steps, res, q, **kw):
    C(key, S, title, [KEY] + pre, steps, res, q, api=True, **kw)


api("API-01", "Public API work order shows the Bill To and keeps customer as the customer",
    [A, B, wo(1, "A", "in Estimate", "B")],
    ["Send GET for work order 1 through the Public API (the single work order request in the documentation)."],
    [["The response is 200.", "It has a Bill To field naming customer B (its id and name).",
      "The existing customer fields still name customer A, with the same meaning as before the release."]],
    ["S19-R7", "INT-5", "KD-API"])
api("API-02", "Public API invoice shows the Bill To and keeps customer as the customer",
    [A, B, wo(1, "A", "invoiced", "B")],
    ["Send GET for work order 1's invoice through the Public API (the single invoice request in the documentation)."],
    [["The response is 200.", "It has a Bill To field naming customer B.", "The existing customer fields still name customer A."]],
    ["S19-R7", "INT-5"])
api("API-03", "Public API self-billed work order shows itself as Bill To",
    [cust("A", ", that bills itself"), wo(1, "A")],
    ["Send GET for work order 1 through the Public API."],
    [["The response is 200.", "The Bill To field names customer A, the same customer as the existing customer fields."]],
    ["S19-R7", "T-BILL"])
api("API-04", "Public API work order list filters by Bill To",
    [A, B, wo(1, "A", "in Estimate", "B"), "Have a new work order for this test, work order 2, for customer A, in Estimate, that bills itself."],
    ["Send GET for the work order list through the Public API with the Bill To filter set to customer B's id."],
    [["The response is 200.", "Work order 1 is in the list.", "Work order 2 is not in the list, although its customer is also customer A."]],
    ["S19-R8"])
api("API-05", "Public API invoice list filters by Bill To",
    [A, B, wo(1, "A", "invoiced", "B"), "Have a new work order for this test, work order 2, for customer A, invoiced, that bills itself."],
    ["Send GET for the invoice list through the Public API with the Bill To filter set to customer B's id."],
    [["The response is 200.", "Work order 1's invoice is in the list.", "Work order 2's invoice is not in the list, although both invoices are for customer A's work."]],
    ["S19-R8"])
api("API-06", "Public API lists work as before without the Bill To filter",
    [A, B, wo(1, "A", "in Estimate", "B"), "Have a new work order for this test, work order 2, for customer A, in Estimate, that bills itself."],
    ["Send GET for the work order list through the Public API with the customer filter set to customer A's id and no Bill To filter."],
    [["The response is 200.", "Work order 1 and work order 2 are both in the list: the customer filter still means the customer the work is for, although work order 1 is billed to customer B."]],
    ["S19-R8", "S19-R7", "KD-API"])
api("API-07", "A malformed Bill To id in a Public API list filter returns an error",
    [],
    ['Send GET for the work order list through the Public API with the Bill To filter set to "abc".',
     'Send GET for the invoice list through the Public API with the Bill To filter set to "abc".'],
    [["The response is an error.", "No list of work orders is returned."],
     ["The response is an error.", "No list of invoices is returned."]],
    ["S19-R8"])
api("API-08", "The Public API changelog announces the Bill To addition",
    [],
    ["Open the Public API changelog in the documentation."],
    [["An entry announces the Bill To added to work orders and invoices and the optional Bill To filter on their lists."]],
    ["S19-R9"])
api("API-09", "Creating an invoice through the Public API for a payer on Credit Hold is refused",
    [A, cust("B", ", the payer, on the Credit Hold credit term"), wo(1, "A", "in Complete, ready to invoice,", "B")],
    ["Send the Public API request that creates an invoice for work order 1.", "Send GET for work order 1 through the Public API."],
    [["The request is refused with an error response.", "No invoice is created."], ["Work order 1, customer A's work billed to customer B, is still Complete, with no invoice."]],
    ["S19-R10", "KD-API", "KD-CH", "REL-7"])
api("API-10", "Public API invoice for a self-billed customer on Credit Hold is refused",
    [cust("A", ", that bills itself, on the Credit Hold credit term"), wo(1, "A", "in Complete, ready to invoice,")],
    ["Send the Public API request that creates an invoice for work order 1.", "Send GET for work order 1 through the Public API."],
    [["The request is refused with an error response.", "No invoice is created."], ["Work order 1, customer A's, is still Complete, with no invoice."]],
    ["REL-7", "S19-R10"])
api("API-11", "The Public API cannot set a work order's Bill To",
    [A, B, cust("C"), wo(1, "A", "in Estimate", "B")],
    ["Send the Public API request that updates work order 1, with a Bill To of customer C.", "Send GET for work order 1 through the Public API."],
    [["The update does not set the Bill To (it is refused or the Bill To value is ignored)."], ["The Bill To still names customer B, and the customer fields still name customer A."]],
    ["S19-N3", "OOS-06"])
api("API-12", "The Public API does not return a customer's saved default Bill To",
    [B, cust("A", ", whose Bill Invoices To is saved as customer B")],
    ["Send GET for customer A through the Public API."],
    [["The response is 200 and holds customer A.", "No field in it gives customer A's saved default Bill To (customer B)."]],
    ["S19-N3", "OOS-05"])
