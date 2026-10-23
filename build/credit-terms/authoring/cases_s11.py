"""Story 11 — Release day and what must not change (S11-R1 to S11-R17, S11-N1, S11-N2, S11-E1, S11-E2), plus the must-not-change cases
for every "as today" / "unchanged" sentence and the Out of Scope items a tester can see (Rule 96, brief point 4)."""
from ct_lib import C, HOLD, CLEAN_HOLD, PO_HOLD
from common import *
from po_questions import QN

PRE_REL = HOLD("needs records and screenshots captured on the test site before the release is installed")
def rl(key, title, pre, pairs, q, note="", marker=None, who=None):
    st = [a for a, _ in pairs]; rs = [f"Step {i}: {b}" for i, (_, b) in enumerate(pairs, 1)]
    C(key, "S11", title, [who or ADMIN()] + pre, st, rs, q, note=note, marker=marker)
EXIST = ("The organization existed before the release, and nobody has used the Credit Terms page since.", None)

rl("S11-01", "An existing shop keeps COD as its default after the release",
   [("The organization existed before the release, and its default has never been changed: the Credit Terms Log holds no \"Default changed\" row.", None),
    ("A name for a new customer, {Customer-A}.", "For example: {Customer-A} is ZZAUTOTEST S11-01 Customer."), ("Starting screen: the Settings page.", None)],
   [('Click "Credit Terms" in the Finance group.', 'the page opens (no feature setting had to be switched on); COD carries the "Default" tag.'),
    ('Click the "⋯" page menu beside "New Credit Term".', "the menu opens."), ('Click "Audit Log".', 'there is no "Default changed" row, so the default has been COD since the release.'),
    ("Open the Customers page.", "the page opens."), ('Click "New Customer".', "Credit Terms is prefilled with COD (Default)."), ("Type {Customer-A} in Customer Name.", "the field shows {Customer-A}."),
    ("Click Save.", "the customer is created on COD, as before the release.")],
   ["S11-R1", "S11-R5", "KD-EXIST", "KD-NOFLAG", "GOAL-6", "S11-R4"])

rl("S11-02", "No existing customer, vendor or invoice changes at release",
   [("Before the release was installed, these were written down (with screenshots): customer {Customer-A}'s term and credit limit, vendor {Vendor-A}'s term and credit limit, and invoice {Invoice-A}'s term and due date, and vendor invoice {Vendor-invoice-A}'s due date.",
     "For example: {Customer-A} is ZZAUTOTEST S11-02 Customer on Net 30 with $1,000.00, {Vendor-A} is ZZAUTOTEST S11-02 Vendor on Net 45 with $2,000.00, {Invoice-A} is due Nov 4, 2026 and {Vendor-invoice-A} is due Nov 19, 2026.")],
   [("Open {Customer-A}'s customer page.", "the term and credit limit are exactly as written down."), ("Open {Vendor-A}'s vendor page.", "the term and credit limit are exactly as written down."),
    ("Open {Invoice-A}.", "its term and due date are exactly as written down (never re-dated)."), ("Open {Vendor-invoice-A}.", "its due date is exactly as written down.")],
   ["S11-R2", "S11-N1", "S11-R13", "S7-E2", "KD-EXIST", "KD-NOFLAG"], marker=PRE_REL)

rl("S11-03", "The Counter Sale customer stays on COD whatever the default",
   [("Net 30 is the shop's default for new customers.", None), ("The organization's built-in Counter Sale customer is {Customer-A}.", "For example: {Customer-A} is the customer named Counter Sale."), PAGE],
   [("Open {Customer-A}'s customer page.", 'the "Credit term" reads COD, although the default is Net 30.'),
    ('On the Credit Terms page, click the "⋯" at the right of the "COD" row.', "the menu opens."), ('Click "Move Customers".', "the window opens (or Move Customers is greyed if no other customer is on COD)."),
    ("Type {Customer-A}'s name in \"Search customers\".", '"No customers match your search." — the Counter Sale customer is never listed, so it can never be moved.')],
   ["S11-R2", "T-COUNTER", "S5-R15"])

rl("S11-04", "At release all twelve standard terms are active and the shop has none of its own",
   [EXIST, PAGE],
   [("Read the Active tab.", "it lists exactly the twelve standard terms: COD, Due on Receipt, Net 7, Net 15, Net 20, Net 30, Net 45, Net 50, Net 60, Net 90, Net 120, Credit Hold, and its count reads 12."),
    ('Click the "Inactive" tab.', 'it reads "No inactive terms" with a count of 0.')],
   ["S11-R3", "T-STANDARD", "GOAL-6"], marker=CLEAN_HOLD)

rl("S11-05", "COD at invoicing works as before, with no Charge Account",
   [("Customer {Customer-A} holds COD and work order {Work-order-1} for it is complete and ready to invoice.", "For example: {Customer-A} is ZZAUTOTEST S11-05 Cash and {Work-order-1} is S2-15440.")],
   [("Open {Work-order-1}'s Finance tab.", "Create Invoice is enabled."), ("Click Create Invoice.", "the payment window opens, as before the release."),
    ("Look at the payment methods.", "Charge Account is not offered."), ("Close the payment window without paying.", "the new invoice is removed again, as before the release; the work order is back to ready to invoice.")],
   ["S11-R10", "S1-R7 COD", "S1-R8 COD"])

rl("S11-06", "Every other term still opens the payment window with Charge Account",
   [("Customers {Customer-A} on Due on Receipt and {Customer-B} on Net 30 each have a complete work order, {Work-order-1} and {Work-order-2}.",
     "For example: {Customer-A} is ZZAUTOTEST S11-06 Receipt, {Customer-B} is ZZAUTOTEST S11-06 Net and the work orders are S2-15441 and S2-15442.")],
   [("On {Work-order-1}'s Finance tab, click Create Invoice.", "the payment window opens and Charge Account is offered."), ("Close the payment window without paying.", "the invoice stays."),
    ("On {Work-order-2}'s Finance tab, click Create Invoice.", "the payment window opens and Charge Account is offered."), ("Close the payment window without paying.", "the invoice stays.")],
   ["S11-R10", "S1-R8 DOR"])

rl("S11-07", "An existing COD customer keeps its old limit on release day",
   [("Customer {Customer-A} held COD with a credit limit of $1,000.00 before the release (written down then).", "For example: {Customer-A} is ZZAUTOTEST S11-07 Cash.")],
   [("Open {Customer-A}'s customer page.", "the credit limit still reads $1,000.00 (the release did not change it).")],
   ["S11-R11", "KD-ZERO2"], marker=PRE_REL)

rl("S11-08", "The first edit of an old COD customer shows and saves $0",
   [("Customer {Customer-A} holds COD and keeps a credit limit of $1,000.00 stored from before the release.", "For example: {Customer-A} is ZZAUTOTEST S11-08 Cash.")],
   [("Open Edit Customer for {Customer-A}.", "Credit Limit shows $0.00, disabled."), ("Click Save.", "the customer saves."), ("Open {Customer-A}'s customer page.", "the credit limit now reads $0.00.")],
   ["S11-R16", "S5-R9", "KD-ZERO2", ("Jira SV-11674 acceptance criterion", "Given a COD customer with a pre-release limit of $1,000, when Edit Customer opens, then the limit shows $0.00, disabled, and saving saves $0 (S5-R9).")])

rl("S11-09", "An old COD customer moved to Credit Hold gets $0, its limit kept in the note",
   [("Customer {Customer-A} holds COD and keeps a credit limit of $1,000.00 stored from before the release.", "For example: {Customer-A} is ZZAUTOTEST S11-09 Cash."),
    ("Your user name is {User-A}.", "For example: {User-A} is ZZAUTOTEST S11-09 Admin."), DEFAULT_COD, PAGE],
   [('Click the "⋯" at the right of the "COD" row.', "the menu opens."), ('Click "Move Customers".', "the window opens with every COD customer ticked."),
    ('Click "Select None".', '"0 selected".'), ("Type {Customer-A}'s name in \"Search customers\".", "only {Customer-A} is listed."), ("Tick {Customer-A}.", '"1 selected".'),
    ('Choose "Credit Hold" in "Move To".', 'the line "Their credit limit will be set to $0." shows.'),
    ('Click "Move 1 Customer".', 'the confirmation "Set 1 customer\'s credit limit to $0?" opens.'), ('Click "Set Limits To $0 And Move".', 'the toast "1 customer moved to Credit Hold." shows.'),
    ("Open {Customer-A}'s customer page.", 'the "Credit term" reads Credit Hold and the credit limit reads $0.00.'),
    ('Click the "Notes" tab.', 'the note reads "Credit term changed from COD to Credit Hold by {User-A} (Move Customers). Credit limit $1,000.00 → $0."')],
   ["S11-R17", "S4-R20", "S4-R14"])

rl("S11-10", "A new organization created after the release starts on Due on Receipt",
   [("An organization {Organization-A} created after the release, never changed on the Credit Terms page, and you are its Admin.", "For example: {Organization-A} is ZZAUTOTEST S11-10 Shop."), PAGE],
   [("Look at the Name column.", 'Due on Receipt carries the "Default" tag.'), ("Open the Customers page.", "the page opens."), ('Click "New Customer".', "Credit Terms is prefilled with Due on Receipt (Default).")],
   ["S11-R12", "KD-EXIST", "GOAL-6"], marker=HOLD("needs an organization created after the release; how a tester gets a new organization on the test site is to be confirmed with the QA lead"))

rl("S11-11", "An organization with no settings record behaves as COD",
   [("An organization {Organization-A} that has no settings record yet.", "For example: {Organization-A} is a newly migrated test organization."), ("Starting screen: the Customers page.", None)],
   [('Click "New Customer".', "Credit Terms is prefilled with COD, as before the release, until a default is picked.")],
   ["S11-E1"], marker=HOLD("a tester cannot make or recognise an organization with no settings record"))

rl("S11-12", "A credit memo's due date on a statement counts on the location's calendar",
   [("Customer {Customer-A} holds Net 30 at {Location-A}, whose time zone has daylight saving time, and has a credit memo {Credit-memo-A} dated Oct 20, 2026.",
     "For example: {Customer-A} is ZZAUTOTEST S11-12 Customer, {Location-A} is in Edmonton and {Credit-memo-A} is CM-3576.")],
   [("Open {Customer-A}'s statement.", "the credit memo's due date reads Nov 19, 2026 (Oct 20 + 30 days; the Nov 1 clock change does not move it). Before the release this screen could show one day less; the later date is the correct one."),
    ("Open the customer's unpaid transactions list.", "the credit memo's due date reads Nov 19, 2026, the same.")],
   ["S11-R14", "S7-E2", "OOS-10", "S7-R6"])

rl("S11-13", "Customers stored as \"NET 30\" keep that text and count under Net 30",
   [("Customer {Customer-A} is stored with the text \"NET 30\".", "For example: {Customer-A} is ZZAUTOTEST S11-13 Upper."), PAGE],
   [("Note the Net 30 row's Customers count.", "it includes {Customer-A}."), ("Open {Customer-A}'s customer page.", 'the "Credit term" reads "NET 30", the stored text (the release did not rewrite it).')],
   ["S11-E2", "S11-R9", "A-SPELL", ("Jira SV-11680 acceptance criterion", "Given customers stored as \"NET 30\", then the stored text is kept, they count under Net 30 on the page and their card shows \"NET 30\" (S11-E2).")])

rl("S11-14", "Nothing is re-sent to QuickBooks at release",
   [("The organization is connected to a QuickBooks Online sandbox. Before the release, the QB Unexported report and the sandbox's invoice list were captured.", None)],
   [("Open the QB Unexported report.", "it holds the same records as before the release, and none was added by the release."),
    ("In QuickBooks, open the invoice list.", "no invoice was re-sent or changed by the release (same count and same last-changed dates as captured).")],
   ["S11-N1"], marker=PRE_REL)

rl("S11-15", "Statements, the portal and A/R aging show no credit term screens",
   [("Customer {Customer-A} holds the shop's own term {Term-A} and has an open invoice {Invoice-A}.", "For example: {Customer-A} is ZZAUTOTEST S11-15 Customer and {Term-A} is ZZAUTOTEST S11-15 Fourteen.")],
   [("Open {Customer-A}'s statement.", "it has no new screen and shows no credit term name."), ("Open {Invoice-A} in the customer portal.", "the portal page shows no credit term name."),
    ("Open the invoice document from the portal.", "the printed invoice shows {Term-A}, as any printed invoice does."), ("Open Reports, A/R Aging Summary.", "no new credit term screen or column appears.")],
   ["OOS-10"])

rl("S11-16", "AccountingHub's own Payment Terms list is untouched",
   [("The organization uses AccountingHub; before the case, the Payment Terms list in Accounting Settings was written down.", None),
    ("A new name {Term-A} that no term has.", "For example: {Term-A} is ZZAUTOTEST S11-16 Fourteen."), PAGE],
   [('Click "New Credit Term".', "the window opens."), ("Type {Term-A} in Name.", "the name is typed."), ("Type 14 in the Days box.", "the blue line shows."),
    ('Click "Create Credit Term".', 'the toast "{Term-A} created" shows.'), ("Open Accounting Settings, Payment Terms.", "the list is exactly as written down; {Term-A} does not appear there.")],
   ["OOS-2"])

rl("S11-17", "The Customers list has no bulk credit term change",
   [("Starting screen: the Customers page.", None)],
   [("Look at the Customers list's buttons, menus and row actions.", "there is no action to change the credit term of several customers; Move Customers lives only on the Credit Terms page.")],
   ["OOS-11"])

rl("S11-18", "Changing one customer's term leaves no note and no log row",
   [("Customer {Customer-A} holds Net 30.", "For example: {Customer-A} is ZZAUTOTEST S11-18 Customer.")],
   [("Open Edit Customer for {Customer-A}.", "the window opens."), ('Choose "Net 45" in Credit Terms.', "Net 45 is chosen."), ("Click Save.", "the customer is on Net 45."),
    ('Click the "Notes" tab.', "no new note about the credit term was written (only Move Customers writes one)."),
    ("Open the Credit Terms page.", "the page opens."), ('Click the "⋯" page menu beside "New Credit Term".', "the menu opens."), ('Click "Audit Log".', "no row was written for this change.")],
   ["OOS-12", "S12-N3"])

rl("S11-19", "The twelve standard terms can never be edited, renamed or deleted",
   [STD_ACTIVE, PAGE],
   [('Click the "⋯" at the right of the "Net 30" row.', 'the menu has no "Edit" and no "Delete Credit Term".'), ("Press Escape.", "the menu closes."),
    ('Click the "⋯" at the right of the "Credit Hold" row.', 'the menu has no "Edit" and no "Delete Credit Term".')],
   ["OOS-7", "S2-N1"])

rl("S11-20", "Other screens showing a customer's term: plain name or (Inactive)",
   [("Customer {Customer-A} holds Net 60, which is deactivated, and has an open invoice and an open work order {Work-order-1}.", "For example: {Customer-A} is ZZAUTOTEST S11-20 Customer and {Work-order-1} is S2-15447.")],
   [("Open Reports, A/R Aging Collection.", "the report opens."), ("Find {Customer-A}'s row.", 'its "Credit term:" reads "Net 60" or "Net 60 (Inactive)", as the PO answers.'),
    ("Open {Work-order-1}.", "where the customer's term shows on the work order, it reads as the PO answers.")],
   ["S5-R8"], marker=PO_HOLD(QN["inactive-elsewhere"]),
   note=f"The PRD names only the customer card, the Edit windows and the printed documents. Question {QN['inactive-elsewhere']} on Chris Ward's sheet (shared with him 23 Oct 2026) asks about the other screens; held until he answers.")
