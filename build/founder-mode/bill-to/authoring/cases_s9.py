"""Story 9 — Invoice email to the Bill To (SV-12311): the send window lists the payer's contacts and pre-ticks its Billing contact, else
its first contact A to Z; other contacts and typed addresses as today; "For Customer" attachments as today; the loading state (held);
and today's list when the customer pays for itself. Every contact has an email address the tester can read."""
from bt_lib import C, HOLD
from common import *

S = "S9"
A1 = cust("A", ", the customer the work is for, with one contact, contact A1, whose email address you can read")
SEND = "Open the invoice's email (send) window on the Finance tab."

C("S9-01", S, "The invoice email lists the payer's contacts and ticks its Billing contact",
  [ADMIN, A1,
   cust("B", ", the payer, with two contacts whose email addresses you can read: contact B1, marked Billing, and contact B2, whose first and last names both come before B1's in A to Z order"),
   wo(1, "A", "invoiced", "B")],
  [OPEN_WO, SEND],
  [["Work order 1 opens for customer A."],
   ["The send window lists customer B's contacts, contact B1 and contact B2.", "Contact B1, marked Billing, is ticked.", "Contact B2 is not ticked.",
    "Contact A1 is not listed."]],
  ["S9-R1", "S9-R2", "CORE-3"])
C("S9-02", S, "With no Billing contact the payer's first contact A to Z is ticked",
  [ADMIN, A1,
   cust("B", ", the payer, with no Billing contact and two contacts whose email addresses you can read: contact B1, Adam Baker, and contact B2, Zack Young"),
   wo(1, "A", "invoiced", "B")],
  [OPEN_WO, SEND],
  [["Work order 1 opens for customer A."],
   ["The send window lists customer B's contacts, contact B1 and contact B2.", "Contact B1 (Adam Baker), first A to Z by name, is ticked.", "Contact B2 is not ticked.",
    "Contact A1 is not listed."]],
  ["S9-R2", "S9-R1"])
C("S9-03", S, "Staff can tick another payer contact and type an address",
  [ADMIN, cust("A"),
   cust("B", ", the payer, with two contacts whose email addresses you can read: contact B1, marked Billing, and contact B2"),
   "Have an extra email address you can read that belongs to no contact.", wo(1, "A", "invoiced", "B")],
  [OPEN_WO, SEND, "Tick contact B2.", "Type the extra email address in the address field.", "Click Send."],
  [["Work order 1 opens for customer A."], ["Contact B1, customer B's Billing contact, is ticked."], ["Contact B2 is ticked."], ["The extra address shows in the address field."],
   ["The invoice email arrives at contact B1, contact B2 and the extra address."]],
  ["S9-R3"])
C("S9-04", S, "For Customer attachments start unticked and are not sent unless ticked",
  [ADMIN, cust("A"), cust("B", ", the payer, with contact B1, marked Billing, whose email address you can read"),
   wo(1, "A", "invoiced", "B", ", with one file attached and marked For Customer")],
  [OPEN_WO, SEND, "Click Send."],
  [["Work order 1 opens for customer A."],
   ["\"Include 'For Customer' Attachments in email\" is unticked.", "Contact B1, customer B's Billing contact, is ticked."],
   ["The email arrives at contact B1 without the attached file."]],
  ["S9-R4"])
C("S9-05", S, "A ticked For Customer box sends the attachment to the payer",
  [ADMIN, cust("A"), cust("B", ", the payer, with contact B1, marked Billing, whose email address you can read"),
   wo(1, "A", "invoiced", "B", ", with one file attached and marked For Customer")],
  [OPEN_WO, SEND, "Tick \"Include 'For Customer' Attachments in email\".", "Click Send."],
  [["Work order 1 opens for customer A."], ["The box is unticked and contact B1, customer B's Billing contact, is ticked."], ["The box is ticked."],
   ["The email arrives at contact B1 with the attached file."]],
  ["S9-R4"])
C("S9-06", S, "While the payer's contacts load the window shows a loading state",
  [ADMIN, cust("A", ", with one contact, contact A1"), cust("B", ", the payer, with contact B1"), wo(1, "A", "invoiced", "B")],
  [OPEN_WO, SEND],
  [["Work order 1 opens for customer A."],
   ["Until customer B's contact B1 shows, the window shows a loading state.", "Contact A1 never shows in the list, not even for a moment."]],
  ["S9-R5"], marker=HOLD("the contacts load faster than a person can see the loading state"))
C("S9-07", S, "When the customer pays for itself the email list is today's",
  [ADMIN, cust("A", ", that bills itself, with two contacts whose email addresses you can read: contact A1, marked Billing, and contact A2"),
   cust("B", ", with a contact of its own, so another customer's contacts exist that must not be listed"), wo(1, "A", "invoiced")],
  [OPEN_WO, SEND],
  [["Work order 1 opens for customer A."],
   ["The send window lists contact A1 and contact A2, as it does today.", "The contact ticked is the one ShopView ticks for customer A today.",
    "No contact of customer B is listed."]],
  ["S9-N1"])
