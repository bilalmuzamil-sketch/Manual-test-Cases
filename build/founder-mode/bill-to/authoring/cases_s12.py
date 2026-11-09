"""Story 12 — Deleting a customer that pays for others (SV-12314): the "Delete Customer" refusal window (message, links, buttons) for one
and for two dependents, the "Remove as default Bill To" confirmation (one and two customers), Remove clears every default, Cancel, deleting
again, a payer that is the Bill To on a work order or part sale (today's message first), permissions, and the failure path (held).
Customer B, the payer, has no work orders, assets or contacts of its own so that only the Bill To rules can stop the delete."""
from bt_lib import C, HOLD, UFS
from common import *

S = "S12"
B = cust("B", ", the payer, with no work orders, part sales, assets or contacts of its own")
DEP_A = cust("A", ", whose Bill Invoices To is saved as customer B")
DEP_C = cust("C", ", whose Bill Invoices To is also saved as customer B")
EDIT_B = "Open customer B's Edit Customer window."
DEL = "Click Delete."
CONF = "Click Delete in the Confirmation window."
R_EDIT = ["Customer B's Edit Customer window opens."]
R_CONF = ['A "Confirmation" window asks "Are you sure you want to delete this company?" with "Cancel" and "Delete".']
WIN1 = ('A "Delete Customer" window opens: "This customer is the default Bill To for [customer A\'s name]. Remove it from that customer first."')
REMOVE = 'Click "Remove As Default Bill To".'

C("S12-01", S, "Deleting a payer that is another customer's default opens Delete Customer",
  [ADMIN, B, DEP_A],
  [EDIT_B, DEL, CONF],
  [R_EDIT, R_CONF,
   [WIN1, "Customer A's name is a link to its page.", 'The window has "Cancel" and "Remove As Default Bill To" buttons.', "Customer B is not deleted."]],
  ["S12-R1", "S12-R2", "S12-R3", UFS["D8-delete"]], note=NAME_NOTE)
C("S12-02", S, "Delete Customer names every dependent customer",
  [ADMIN, B, DEP_A, DEP_C],
  [EDIT_B, DEL, CONF],
  [R_EDIT, R_CONF,
   ['The "Delete Customer" window reads "This customer is the default Bill To for [customer A\'s name], [customer C\'s name]. Remove it from those customers first." (names comma separated)',
    "Customer A's and customer C's names are each a link to their page."]],
  ["S12-R2", UFS["D8-delete"]], note=NAME_NOTE)
C("S12-03", S, "A dependent customer's link opens its page",
  [ADMIN, B, DEP_A],
  [EDIT_B, DEL, CONF, "Click customer A's name in the window."],
  [R_EDIT, R_CONF, [WIN1], ["Customer A's page opens."]],
  ["S12-R2"], note=NAME_NOTE)
C("S12-04", S, "Remove As Default Bill To asks to confirm for one customer",
  [ADMIN, B, DEP_A],
  [EDIT_B, DEL, CONF, REMOVE],
  [R_EDIT, R_CONF, [WIN1],
   ['A window titled "Remove as default Bill To" reads "Remove [customer B\'s name] as the default Bill To for 1 customer? Open work orders keep their Bill To."',
    'It has "Remove" and "Cancel" buttons.']],
  ["S12-R4", UFS["D8-confirm"]], note=NAME_NOTE)
C("S12-05", S, "Remove As Default Bill To counts two customers in its question",
  [ADMIN, B, DEP_A, DEP_C],
  [EDIT_B, DEL, CONF, REMOVE],
  [R_EDIT, R_CONF, ['The "Delete Customer" window names customer A and customer C.'],
   ['The confirmation reads "Remove [customer B\'s name] as the default Bill To for 2 customers? Open work orders keep their Bill To."']],
  ["S12-R4", UFS["D8-confirm"]], note=NAME_NOTE)
C("S12-06", S, "Remove clears the default on every dependent customer",
  [ADMIN, B, DEP_A, DEP_C],
  [EDIT_B, DEL, CONF, REMOVE, 'Click "Remove".', "Open customer A's page.", "Open customer C's page."],
  [R_EDIT, R_CONF, ['The "Delete Customer" window names customer A and customer C.'], ['The "Remove as default Bill To" window opens.'],
   ["The defaults are removed and the delete Confirmation shows again.", "Customer B is not deleted yet."],
   ['Customer A\'s card shows no "Bill Invoices To" line: it bills itself.'], ['Customer C\'s card shows no "Bill Invoices To" line.']],
  ["S12-R5"])
C("S12-07", S, "After removing the defaults the payer can be deleted",
  [ADMIN, B, DEP_A],
  [EDIT_B, DEL, CONF, REMOVE, 'Click "Remove".', CONF, "Search Customers for customer B's name."],
  [R_EDIT, R_CONF, [WIN1], ['The "Remove as default Bill To" window opens.'], ["The delete Confirmation shows again."], ["Customer B is deleted."],
   ["Customer B is not found.", "Searching for customer A's name still finds customer A, so the search works."]],
  ["S12-R6", "S12-R5"], note=NAME_NOTE)
C("S12-08", S, "Cancel in Delete Customer keeps the payer and the default",
  [ADMIN, B, DEP_A],
  [EDIT_B, DEL, CONF, "Click Cancel.", "Open customer A's page."],
  [R_EDIT, R_CONF, [WIN1], ["The window closes and customer B is not deleted."], ['Customer A\'s card still shows "Bill Invoices To" with customer B\'s name.']],
  ["S12-R3"], note=NAME_NOTE)
C("S12-09", S, "A payer that is the Bill To on a work order cannot be deleted",
  [ADMIN, B, cust("A", ", that bills itself"), wo(1, "A", "in Estimate", "B", ", so customer B is the Bill To on a work order")],
  [EDIT_B, DEL, CONF],
  [R_EDIT, R_CONF,
   ['The delete is refused with "Company with a work order cannot be deleted." as the app\'s standard error toast, captioned "Please try to resolve this."',
    "The toast fades after 3 seconds.", "Customer B is not deleted."]],
  ["S12-R7", UFS["S12-R7"], "UFS-H2"])
C("S12-10", S, "A payer that is the Bill To on a part sale cannot be deleted",
  [ADMIN, B, cust("A", ", that bills itself"), ps(1, "A", "open", "B", ", so customer B is the Bill To on a part sale")],
  [EDIT_B, DEL, CONF],
  [R_EDIT, R_CONF, ['The delete is refused with "Company with a work order cannot be deleted."', "Customer B is not deleted."]],
  ["S12-R7"])
C("S12-11", S, "Today's delete refusal comes before the Delete Customer window",
  [ADMIN, B, DEP_A, wo(1, "A", "in Estimate", "B", ", so customer B is both a default and a Bill To on a work order")],
  [EDIT_B, DEL, CONF],
  [R_EDIT, R_CONF,
   ['The delete is refused with "Company with a work order cannot be deleted."', 'No "Delete Customer" window opens.', "Customer B is not deleted."]],
  ["S12-R8", "S12-R7"])
C("S12-12", S, "Without AP/AR Data the Delete Customer window has no Remove button",
  [role("has 'Customers → Create & Edit' and 'Customers → Delete' but not 'View and Manage AP/AR Data'"), B, DEP_A],
  [EDIT_B, DEL, CONF],
  [R_EDIT, R_CONF, [WIN1, 'The window has "Cancel".', 'No "Remove As Default Bill To" button shows.']],
  ["S12-N1", "KD-PERM-DEF"], note=NAME_NOTE)
C("S12-13", S, "Without Customers Create & Edit the Delete Customer window has no Remove button",
  [role("has 'Customers → Delete' and 'View and Manage AP/AR Data' but not 'Customers → Create & Edit'"), B, DEP_A],
  [EDIT_B, DEL, CONF],
  [R_EDIT, R_CONF, [WIN1, 'The window has "Cancel".', 'No "Remove As Default Bill To" button shows.']],
  ["S12-N1", "KD-PERM-DEF"], note=NAME_NOTE)
C("S12-14", S, "If removing the defaults fails, an error toast shows and the confirmation stays",
  [ADMIN, B, DEP_A],
  [EDIT_B, DEL, CONF, REMOVE, 'Click "Remove" while the removal cannot go through.'],
  [R_EDIT, R_CONF, [WIN1], ['The "Remove as default Bill To" window opens.'],
   ["The app's standard error toast shows.", 'The "Remove as default Bill To" confirmation stays open.', "Customer A's default is still customer B."]],
  ["EH-S12"], note=NAME_NOTE, marker=HOLD("a removal failure cannot be caused from the screens; it needs the removal to be made to fail"))
