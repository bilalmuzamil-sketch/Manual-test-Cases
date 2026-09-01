#!/usr/bin/env python3
"""The QA lead's 2026-09-01 list: items 2, 3 and 4.

  2. the five AUTOMATED cases made runnable (per-case go-ahead given; Rule 65 report owed to Vlad)
  3. the over-length titles fixed
  4. the two API cases moved to an API section, and made runnable too

Every route below was OBSERVED on sv8218 v26.35.5-8c3cc21 by this session:
  * the customer card is the panel down the LEFT of a work order; Authorizer sits below Contact and
    Phone (walked, and read as a select for an editor / a static field for a restricted user)
  * on a PAID work order the Authorizer select is disabled - observed as q-field--disabled, which is
    S3-R8 working
  * a part sale's customer card carries Contact, Phone and Authorizer too (read live)
  * part sale route: Parts -> Part Sales -> the row (walked); Customers -> Part Sales tab also works
NOTHING here is invented. Expected Results are untouched (Rule 57).
"""

CARD = ('The customer card is the panel down the left-hand side of the work order. The "Authorizer" '
        'row sits inside it, below the "Contact" and "Phone" rows.')
OPEN_WO = 'Click "Work Orders" in the top menu and open the work order (click its row).'
APPROVES = ('To mark a contact as one who approves work: click "Customers" in the top menu, open the '
            'customer, click the "Contacts" tab, click the edit icon at the right of the contact\'s '
            'row, tick "Approves Work" and click "Save".')
NOT_INVOICED = ('Use a work order that has NOT been invoiced - one still reading Estimate, Approved, '
                'In progress, Review or Complete. Once a work order is invoiced the Authorizer is '
                'locked and cannot be changed, so the check cannot be done on it.')

CASES = {
# ---------------- the five AUTOMATED cases ----------------
'44919': dict(pre=[
  'You are signed in to ShopView.',
  'You need a customer with at least one contact who approves work AND at least one who does not. ' + APPROVES,
  'You need one of that customer\'s work orders. ' + NOT_INVOICED,
  OPEN_WO, CARD],
 steps=[
  'Click "Work Orders" in the top menu and open the work order.',
  'Look at the customer card down the left-hand side and find the "Authorizer" row - check where it sits relative to the "Contact" and "Phone" rows above it, and whether it is styled the same way.',
  'Click the "Authorizer" row to open its list.',
  'Read every name the list offers, and compare that against the customer\'s full contact list on the "Contacts" tab.',
  'Try to type a name of your own into the field.']),

'44920': dict(pre=[
  'You are signed in to ShopView.',
  'You need a customer who has at least one contact who approves work. ' + APPROVES,
  'You need one of that customer\'s work orders with no Authorizer chosen yet. ' + NOT_INVOICED,
  OPEN_WO, CARD],
 steps=[
  'Click "Work Orders" in the top menu and open the work order.',
  'Look at the "Authorizer" row in the customer card on the left and note what it shows before anything is chosen.',
  'Click the row to open its list and read the options offered at the top of it.',
  'Choose a name from the list, and check the row now shows it.',
  'Click the row again and choose the option that clears it, then look at the row once more.']),

'44921': dict(pre=[
  'You are signed in to ShopView.',
  'You need a customer with two contacts who approve work: one WITH a telephone number on the contact record and one WITHOUT. ' + APPROVES + ' The telephone is on the same contact form.',
  'You need one of that customer\'s work orders. ' + NOT_INVOICED,
  OPEN_WO, CARD],
 steps=[
  'Click "Work Orders" in the top menu and open the work order.',
  'Click the "Authorizer" row in the customer card on the left and choose the contact who HAS a telephone number.',
  'Look at the card directly below the authorizer\'s name and note whether a telephone number is shown there, and whether it is styled like the Contact\'s own phone above it.',
  'Click the "Authorizer" row again and choose the contact who has NO telephone number.',
  'Look directly below the authorizer\'s name again.']),

'44922': dict(pre=[
  'You are signed in to ShopView.',
  'You need one work order that has been INVOICED. To invoice one: click "Work Orders" in the top menu, open a work order that is Complete, click its "Finance" tab and create the invoice.',
  'It is worth looking at the same work order BEFORE you invoice it, so you can see the difference.',
  OPEN_WO, CARD],
 steps=[
  'Click "Work Orders" in the top menu and open a work order that is NOT yet invoiced. Click the "Authorizer" row in the customer card on the left and confirm the list opens and a name can be chosen.',
  'Click the "Finance" tab on that work order and create the invoice.',
  'Go back to the work order and click the "Authorizer" row in the customer card again.',
  'Note whether the row responds at all, and whether it now looks greyed out rather than selectable.',
  'If you can reverse or void that invoice (the invoice\'s three-dot menu on the "Finance" tab offers "Reverse"), do so and then look at the "Authorizer" row once more.']),

'44985': dict(pre=[
  'You are signed in to ShopView.',
  'You need a customer with at least one contact who approves work. ' + APPROVES,
  'You need one of that customer\'s parts sales that has NOT been invoiced yet. To find one: click "Parts" in the top menu, open "Part Sales", and open a row that is not yet Paid.',
  'A parts sale has a customer card down the left-hand side just as a work order does, with the "Authorizer" row below "Contact" and "Phone".',
  'To see the parts sale document: on the part sale, click the "Finance" tab.'],
 steps=[
  'Click "Parts" in the top menu, open "Part Sales", and open the parts sale.',
  'Look at the customer card down the left-hand side and find the "Authorizer" row. Click it and read the names offered.',
  'Choose one of them, then click the "Finance" tab and create the invoice for the parts sale.',
  'Go back and click the "Authorizer" row again - note whether it still responds.',
  'If you can reverse or void that invoice, do so and click the "Authorizer" row once more.',
  'Click the "Finance" tab to put the parts sale document on screen and read the reference fields near the top for the authorizer\'s name.']),

# ---------------- the two API cases ----------------
'45169': dict(pre=[
  'You are signed in to ShopView. You also need a way to send a request to the system directly, outside the screens - a developer or the automation engineer will have this.',
  'You need one work order that has been INVOICED and has not since been voided or reversed. To invoice one: click "Work Orders" in the top menu, open a work order that is Complete, click its "Finance" tab and create the invoice.',
  'You need the customer to have a contact who approves work. ' + APPROVES,
  OPEN_WO + ' ' + CARD,
  'This case deliberately checks the back end rather than the screen. On screen the Authorizer is already locked once the work order is invoiced; the point here is that the lock still holds when the screen is bypassed altogether.'],
 steps=[
  'Click "Work Orders" in the top menu and open the invoiced work order. Look at the "Authorizer" row in the customer card on the left and write down the name it shows.',
  'Send a change-authorizer request straight to the system, bypassing the screen: POST /api/work-orders/change-authorizer with body {"workOrderId": "<the work order id>", "authorizerContactId": "<the id of a contact who approves work>"}.',
  'Read the response code and message the system sends back.',
  'Return to the work order in the app, reload the page, and look at the "Authorizer" row again to see whether the name changed.']),

'45170': dict(pre=[
  'You are signed in to ShopView. You also need a way to send a request to the system directly, outside the screens - a developer or the automation engineer will have this.',
  'You need one work order that has NOT been invoiced. ' + OPEN_WO,
  'You need two contacts to try, and neither should be allowed as an authorizer: (a) a contact of the SAME customer who does NOT approve work, and (b) a contact belonging to a DIFFERENT customer. To see and set these: click "Customers" in the top menu, open the customer, click the "Contacts" tab - the "Approves Work" column shows Yes or No for each contact, and the edit icon on a row opens the contact to change it.',
  'Note down the two contact ids you intend to try, and open the work order first so you can see the "Authorizer" row before and after. ' + CARD],
 steps=[
  'Click "Work Orders" in the top menu and open the work order that has not been invoiced. Look at the "Authorizer" row in the customer card on the left and write down what it shows.',
  'Send a change-authorizer request straight to the system using contact (a), the same customer\'s contact who does NOT approve work: POST /api/work-orders/change-authorizer with body {"workOrderId": "<the work order id>", "authorizerContactId": "<contact a>"}. Read the response code.',
  'Send the same request again using contact (b), a contact belonging to a different customer. Read the response code.',
  'Return to the work order in the app, reload the page, and look at the "Authorizer" row to see whether either attempt changed it.']),
}

TITLES = {
 # over the ~80 character convention; they truncate on the case page
 '45190': 'Customer card still works on work order, imported work order and part sale',
 '45185': 'A pre-redesign snapshot renders in the new layout with blanks, no error',
 '45170': "Authorizer API rejects a non-approver or another company's contact",
}
