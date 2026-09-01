#!/usr/bin/env python3
"""Hand-written UI preconditions and steps for the 13 Invoice cases that were still spec-level.

Every route here is one this session OBSERVED on sv8218 build v26.35.5-8c3cc21 (recorded in
skill 18 and build/invoice-ui-refresh/NAVIGATION-MAP.md). Where a design-derived route already in
the case contradicted what was seen live, the OBSERVED one wins and the difference is noted in
RESULTS.md - a build-verified route is authoritative over a map written without opening the app.

Expected Results are NOT touched (Rule 57). Markers are NOT touched (carried and verified).
"""
WO   = ('To put the document on screen: click "Work Orders" in the top menu, open the work order '
        '(click its row), then click the "Finance" tab. The document appears on the right. Use the '
        '"Estimate / Invoice" toggle above it to switch between the two.')
CRED = ('To open the Credit Invoice: click "Customers" in the top menu, open the customer, click the '
        '"Invoices" tab, find the credit\'s row (its number, for example CM-100, is in the "Invoice #" '
        'column next to ordinary invoice numbers), then click the print icon at the right of that row '
        '(its tooltip reads "Print credit memo").')
OPENONLY = ('If the credit is fully applied, fully refunded or voided, turn the "Open only" filter off '
            'first or its row is not listed.')
LOCATION = ('Your active location must be the location the credit was issued at. Credits are '
            'location-specific: a credit issued at another location does not appear in the customer\'s '
            'Invoices list at all - no row and no print button.')
SIGNED = 'You are signed in to ShopView.'

CASES = {
'44946': dict(pre=[SIGNED,
  'You need one invoice carrying two or more payments taken on different dates by different methods. To set one up: click "Work Orders" in the top menu, open a work order that is Complete, click its "Finance" tab and create the invoice, then use "New Payment" twice - a different method each time.',
  WO],
 steps=['Click "Work Orders" in the top menu, open the work order, and click the "Finance" tab so the Invoice is on screen.',
  'Scroll to the bottom of the document and find the heading above the Balance line.',
  'Read every payment row under that heading: its label, its date and its amount.',
  'Check the order the rows are listed in, and that a payment which was reversed in full is not listed at all.']),

'44948': dict(pre=[SIGNED,
  'You need one invoice that has both a deposit applied and a customer-account credit applied. To set it up: click "Work Orders" in the top menu, open a work order that is Complete, click its "Finance" tab, use "Add Deposit" to take a deposit, then create the invoice; then click "Customers" in the top menu, open that customer, click the "Invoices" tab, use "Issue Credit" to create a store credit, and apply it to the invoice.',
  WO],
 steps=['Click "Work Orders" in the top menu, open the work order, and click the "Finance" tab so the Invoice is on screen.',
  'Find the Payments heading near the bottom of the document.',
  'Read the row that represents the deposit, and the row that represents the applied credit - the label at the start of each row and the date it shows.']),

'44959': dict(pre=[SIGNED,
  'You need one work order from which both an Estimate and an Invoice can be shown - that is, a work order that has been invoiced.',
  WO],
 steps=['Click "Work Orders" in the top menu, open the work order, and click the "Finance" tab.',
  'Set the "Estimate / Invoice" toggle to Estimate and read the document from top to bottom.',
  'Set the same toggle to Invoice and read it from top to bottom again.',
  'Compare the two: the document label, the dates in the masthead, the heading over the work section, the label on the headline figure, and whether a Paid banner, a Payments block and a Balance line are present.']),

'44964': dict(pre=[SIGNED, 'You need a credit on a customer account. Its number begins with "CM-".',
  LOCATION, CRED, OPENONLY],
 steps=['Click "Customers" in the top menu and open the customer.',
  'Click the "Invoices" tab and find the credit\'s row - its "CM-" number is in the "Invoice #" column.',
  'Click the print icon at the right of that row (tooltip "Print credit memo") to open the document.',
  'Read the masthead - the header block across the top of the document - and note the document label, the date label beside it, and whether any money figure appears there.']),

'44978': dict(pre=[SIGNED,
  'You need a document with several numbered jobs, at least one of which carries a fee or discount row. To set one up: click "Work Orders" in the top menu, open a work order with more than one line, and add a fee or discount to one of the lines.',
  WO],
 steps=['Click "Work Orders" in the top menu, open the work order, and click the "Finance" tab so the document is on screen.',
  'Look at the horizontal rule directly under the work-section label.',
  'Look at the rules that separate one numbered job from the next.',
  'Look at the dividers between the charge rows inside a single job, and at the "Labor" and "Parts" sub-headings.',
  'On the line that carries a fee or discount, check where the divider sits relative to that line and its fee/discount rows.']),

'44987': dict(pre=[SIGNED,
  'To open a BATCH invoice: click "Customers" in the top menu, open a customer, click the "Invoices" tab, tick two or more invoice rows using the tick boxes at the left (or the tick box in the header row to take them all). A toolbar appears above the list with "Download", "Send Email" and "Print" buttons.',
  'To open an IMPORTED invoice: click "Work Orders" in the top menu, set the Status filter to "Imported", and open a row. Imported work orders appear only under that filter - they are not in the ordinary Work Orders list. The document is shown on the record itself.',
  'To see a redesigned invoice for comparison: click "Work Orders" in the top menu, open any ordinary work order, and click its "Finance" tab.'],
 steps=['On the customer\'s "Invoices" tab, tick two or more invoice rows and click "Print" in the toolbar above the list. The batch document opens.',
  'Click "Work Orders" in the top menu, set the Status filter to "Imported", open a row, and look at the document shown on it.',
  'Click "Work Orders" in the top menu, open an ordinary work order and click its "Finance" tab, so a redesigned invoice is beside them for comparison.',
  'Compare the wording on all three documents: whether the date at the top reads "Invoice date" or "Invoice Date"; whether a fully settled invoice says "Paid date"; whether the signature line reads "Customer Signature" or "Customer signature:"; whether the footer reads "Powered by ShopView" or "Software Powered by ShopView"; whether the tax line reads "GST (5%)" or "Tax"; and whether the headings "Addresses" and "Summary" appear.']),

'45168': dict(pre=[SIGNED,
  'You need a credit on a customer account at a shop that HAS a remit-to payee configured, so that an ordinary invoice from that shop does show a "Remit Payment To" block.',
  LOCATION, CRED, OPENONLY],
 steps=['Click "Customers" in the top menu, open the customer, click the "Invoices" tab, and click the print icon on the credit\'s row to open the Credit Invoice.',
  'Look at the addresses area near the top of the document.',
  'Check whether a "Remit Payment To" block appears anywhere on it.',
  'Note how much of the width of the addresses area the "Credit To" block takes up.']),

'45169': dict(pre=[SIGNED + ' You also need a way to send a request to the system directly, outside the screens - a developer or the automation engineer will have this.',
  'You need a work order that has been invoiced and has not been voided or reversed. To reach it: click "Work Orders" in the top menu and open the work order.',
  'You need the customer to have a contact who approves work. To check or set that: click "Customers" in the top menu, open the customer, click the "Contacts" tab, click the edit icon on a contact\'s row and tick "Approves Work".',
  'This case deliberately checks the back end rather than the screen: on screen the Authorizer is already locked once the work order is invoiced, and the point here is that the lock also holds when the screen is bypassed.'],
 steps=['Click "Work Orders" in the top menu and open the invoiced work order, so you can see the Authorizer row in the customer card on the left and note the name it currently shows.',
  'Send a change-authorizer request to the system directly, bypassing the screen: POST /api/work-orders/change-authorizer with body {"workOrderId": "<the work order id>", "authorizerContactId": "<the id of a contact who approves work>"}.',
  'Read the response the system gives back.',
  'Return to the work order in the app, reload it, and look at the Authorizer row again.']),

'45181': dict(pre=[SIGNED,
  'You need two credits on customer accounts: one that has been applied in full to invoices, and separately one that has been voided.',
  LOCATION, CRED, OPENONLY + ' Both credits in this case are in exactly that state, so the filter must be off to see them.'],
 steps=['Click "Customers" in the top menu, open the customer, click the "Invoices" tab, and turn the "Open only" filter off.',
  'Find the fully applied credit\'s row and click the print icon at the right of it to open its Credit Invoice.',
  'Read the Balance figure in the totals block.',
  'Go back and do the same for the voided credit: open its Credit Invoice, read the Balance, read the credited items and totals, and read the status shown in the small table at the top.']),

'45185': dict(pre=[SIGNED,
  'You need a work order that was invoiced BEFORE this version was built - check the dates in its history.',
  'To open a saved copy of a document: click "Work Orders" in the top menu, open the work order, and open its History. The entries that keep a saved copy are "Invoice created", "Invoice downloaded", "Invoice emailed" and "Reviewed"; open the saved copy from one of those entries.',
  'For comparison you also want a saved copy made today: click "Work Orders", open a work order that is Complete, click its "Finance" tab and create an invoice, then open the History entry that appears.'],
 steps=['Click "Work Orders" in the top menu, open the old work order, and open its History.',
  'Open the saved copy of the document from an entry dated before this version was built.',
  'Check that the document opens at all, and that no error message appears in place of it.',
  'Read its layout, then save or print it and read that too.',
  'Look at the fields that did not exist when that copy was made - the Authorizer, the licence plate, the estimate date - and check whether they are simply left blank rather than showing an error.']),

'45190': dict(pre=[SIGNED,
  'You need three records: an ordinary work order, an imported work order, and a parts sale.',
  'An ordinary work order: click "Work Orders" in the top menu and open any row.',
  'An imported work order: click "Work Orders" in the top menu, set the Status filter to "Imported", and open a row. Imported work orders appear only under that filter.',
  'A parts sale: click "Parts" in the top menu, open "Part Sales", and open any row.',
  'On all three, the customer card is the panel down the left-hand side of the screen.'],
 steps=['Click "Work Orders" in the top menu, open an ordinary work order, and read the customer card on the left: the Contact row, the Phone row, and whether an Authorizer row is present.',
  'Click "Work Orders" again, set the Status filter to "Imported", open a row, and read the same card on the left.',
  'Click "Parts" in the top menu, open "Part Sales", open a row, and read the same card again.',
  'On each of the three, check the card is intact - nothing overlapping, cut off, or missing its heading - and that its buttons still respond.']),

'45191': dict(pre=[SIGNED,
  'You need a second sign-in belonging to someone whose role does not allow editing work orders. On this system the Technician role is already like that, so any active Technician will do and no role needs changing.',
  'You need a work order that has an Authorizer chosen. To find one: click "Work Orders" in the top menu, open a work order, and look at the "Authorizer" row in the customer card on the left.',
  'Look at that row as yourself first, so you know what the editable version looks like.'],
 steps=['Signed in as yourself, click "Work Orders" in the top menu, open the work order, and look at the "Authorizer" row in the customer card on the left. Note that it can be opened and changed.',
  'Sign out and sign in again as the Technician.',
  'Click "Work Orders" in the top menu and open the same work order.',
  'Look at the "Authorizer" row in the customer card on the left and try to change it.']),

'45196': dict(pre=[SIGNED,
  'You need one invoice settled partly by cash and partly by a customer credit. To set it up: click "Work Orders" in the top menu, open a work order that is Complete, click its "Finance" tab and create the invoice; note the amount owing. Then click "Customers" in the top menu, open that customer, click the "Invoices" tab and use "Issue Credit" to create a store credit worth part of that amount.',
  'Before paying anything, open the document once and note whether the top of it reads "Due date" or "Paid date", so you can tell what changes.',
  WO],
 steps=['Click "Work Orders" in the top menu, open the work order, click the "Finance" tab, and note the date label at the top of the document and the Balance at the bottom.',
  'Use "New Payment" on the Finance tab to pay part of the amount owing in cash.',
  'Settle the remainder by applying the customer\'s credit to the same invoice.',
  'Open the document again on the "Finance" tab.',
  'Read the date label at the top of the document, every row in the Payments block, and the Balance.']),
}
