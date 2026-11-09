"""Story 2 — Bill Invoices To in New Customer and Edit Customer (SV-12304): the field and its "This customer" reading, its place in the
window (shared with Credit Terms SV-11638 and Split Representatives SV-10890), the Edit Customer help line, the New Customer first option,
saving with the window's Save, Address 2 on demand (+, x, tooltips, a stored Address 2), permissions and Counter Sale."""
from bt_lib import C, HOLD, UFS
from common import *

S = "S2"
NEWC = "Click New Customer."
EDIT_A = "Open customer A's Edit Customer window."
FIELD = 'Click the "Bill Invoices To" field.'
CT = ("Use a build where New Customer and Edit Customer show the Credit Terms and Credit Limit fields beside each other and a Sales "
      "Representative field (they come from the Credit Terms and Split Representatives work).")

C("S2-01", S, "New Customer shows Bill Invoices To reading This customer, with no help line",
  [ADMIN, "Start on the Customers page."],
  [NEWC],
  [['The New Customer window shows a "Bill Invoices To" field reading "This customer".', "No help line shows under the field."]],
  ["S2-R1", "S2-N2", "REL-3"])
C("S2-02", S, "Bill Invoices To sits after Credit Limit and before Sales Representative",
  [ADMIN, CT, "Start on the Customers page."],
  [NEWC],
  [['"Bill Invoices To" sits on the line after Credit Terms and Credit Limit.', '"Sales Representative" comes right after "Bill Invoices To".']],
  ["S2-R2", "OOS-03"])
C("S2-03", S, "Edit Customer shows the field in place with its help line",
  [ADMIN, CT, cust("A", ", that bills itself")],
  [EDIT_A],
  [['"Bill Invoices To" reads "This customer".', '"Bill Invoices To" sits after Credit Terms and Credit Limit and before Sales Representative.',
    'Under the field: "New work orders and part sales bill to this customer. Existing ones don\'t change."']],
  ["S2-R1", "S2-R2", "S2-R3", UFS["Help-edit"], "REL-3"])
C("S2-04", S, "New Customer offers New customer (this customer) before a name is typed",
  [ADMIN, "Start on the Customers page."],
  [NEWC, FIELD],
  [['The "Bill Invoices To" field reads "This customer".'],
   ['The first option reads "New customer (this customer)".', "Other customers follow, A to Z."]],
  ["S2-R4"])
C("S2-05", S, "New Customer's first option follows the name typed so far",
  [ADMIN, "Start on the Customers page."],
  [NEWC, 'In the name field, type "Lone Star Fleet Services".', FIELD],
  [["The New Customer window opens."], ["The name field shows Lone Star Fleet Services."],
   ['The first option reads "Lone Star Fleet Services (this customer)".']],
  ["S2-R4"])
C("S2-06", S, "A payer picked in New Customer is saved with the window's Save",
  [ADMIN, cust("B", ", the payer"), "Start on the Customers page."],
  [NEWC, "Fill in the fields New Customer needs with a new name for this test.", 'In "Bill Invoices To", pick customer B.', SAVE,
   "Open the new customer's Edit Customer window."],
  [["The New Customer window opens."], ["The fields are filled."], ["The field shows customer B's name."],
   ["The window closes and the new customer is created.", 'The new customer\'s left card shows "Bill Invoices To" with customer B\'s name.'],
   ['"Bill Invoices To" shows customer B\'s name.']],
  ["S2-R5", "S1-R1", "KD-DEF"])
C("S2-07", S, "Closing Edit Customer without Save keeps the old Bill Invoices To",
  [ADMIN, cust("A", ", that bills itself"), cust("B")],
  [EDIT_A, 'In "Bill Invoices To", pick customer B.', "Click Cancel.", EDIT_A],
  [['"Bill Invoices To" reads "This customer".'], ["The field shows customer B's name."], ["The window closes."],
   ['"Bill Invoices To" still reads "This customer": the pick was not saved.']],
  ["S2-R5"])
C("S2-08", S, "If any part of saving a new customer fails, no customer is created",
  [ADMIN, cust("B"), "Start on the Customers page."],
  [NEWC, "Fill in the fields New Customer needs with a new name for this test.", 'In "Bill Invoices To", pick customer B.',
   "Click Save while the Bill To part of the save cannot go through."],
  [["The New Customer window opens."], ["The fields are filled."], ["The field shows customer B's name."],
   ["The app's standard error toast shows and the window stays open.", "Searching Customers for the new name finds no customer: nothing was saved."]],
  ["S2-R5", "EH-S1-1"], marker=HOLD("one part of the save cannot be made to fail from the screens"))
C("S2-09", S, "An empty Address 2 is hidden behind a + beside Address 1",
  [ADMIN, "Start on the Customers page."],
  [NEWC, "Hover over the + beside Address 1.", "Click the + beside Address 1."],
  [["Address 2 is not shown.", "A + button shows beside Address 1."], ['The tooltip reads "Add Address 2".'], ["An empty Address 2 field shows."]],
  ["S2-R6", "KD-ADDR", "REL-4"])
C("S2-10", S, "The x on Address 2 hides it and nothing is saved until Save",
  [ADMIN, cust("A", ", with a value saved in Address 2")],
  [EDIT_A, "Hover over the x on Address 2.", "Click the x on Address 2.", "Click Cancel.", EDIT_A],
  [["Address 2 shows its saved value, with an x button."], ['The tooltip reads "Remove Address 2".'],
   ["Address 2 is cleared and hidden.", "The + shows beside Address 1."], ["The window closes."],
   ["Address 2 shows its saved value again: nothing was saved."]],
  ["S2-R7", "S2-R8"])
C("S2-11", S, "Clearing Address 2 with the x and saving removes it",
  [ADMIN, cust("A", ", with a value saved in Address 2")],
  [EDIT_A, "Click the x on Address 2.", SAVE, EDIT_A],
  [["Address 2 shows its saved value."], ["Address 2 is cleared and hidden."], ["The window closes."],
   ["Address 2 is hidden and the + shows beside Address 1: the empty Address 2 was saved."]],
  ["S2-R7", "S2-R6"])
C("S2-12", S, "A customer with Address 2 but no Address 1 opens with Address 2 showing",
  [ADMIN, cust("A", ", with Address 1 empty and a value saved in Address 2")],
  [EDIT_A],
  [["Address 1 is empty.", "Address 2 shows its saved value."]],
  ["S2-R8"])
C("S2-13", S, "Without View and Manage AP/AR Data, New Customer has no Bill Invoices To",
  [role("has 'Customers → Create & Edit' but not 'View and Manage AP/AR Data'"), "Start on the Customers page."],
  [NEWC],
  [["The New Customer window opens with its name and address fields.", 'No "Bill Invoices To" field shows.',
    "No empty gap is left where the field would be: the fields above and below it sit next to each other."]],
  ["S2-N1", "KD-PERM-DEF"])
C("S2-14", S, "Without View and Manage AP/AR Data, Edit Customer keeps the saved payer",
  [role("has 'Customers → Create & Edit' but not 'View and Manage AP/AR Data'"), cust("B"),
   cust("A", ", whose Bill Invoices To is saved as customer B")],
  [EDIT_A, "Change the phone number to a new one.", SAVE, "Open customer A's page."],
  [['No "Bill Invoices To" field and no help line show.', "No empty gap is left where the field would be."],
   ["The phone field shows the new phone number."], ["The window closes."],
   ['The left card still shows "Bill Invoices To" with customer B\'s name: saving did not remove it.']],
  ["S2-N1", "KD-PERM-DEF", "KD-PERM-SEE"])
C("S2-15", S, "Counter Sale's Edit Customer has no Bill Invoices To field",
  [ADMIN, "Use the organization's Counter Sale customer."],
  ["Open the Counter Sale customer's Edit Customer window."],
  [["The window shows its usual fields, such as the name and Credit Limit.", 'No "Bill Invoices To" field and no help line show.']],
  ["S2-N3", "KD-CS"])
C("S2-16", S, "Edit Customer never offers Counter Sale as Bill Invoices To",
  [ADMIN, cust("A", ", that bills itself"), "Use the organization's Counter Sale customer, so its name can be typed."],
  [EDIT_A, "Type the Counter Sale customer's name in the \"Bill Invoices To\" field."],
  [['"Bill Invoices To" reads "This customer".'],
   ['Only "[customer A\'s name] (this customer)" is listed.', "The Counter Sale customer is not offered."]],
  ["EH-S2", "S1-N5", "KD-CS"], note=NAME_NOTE)
