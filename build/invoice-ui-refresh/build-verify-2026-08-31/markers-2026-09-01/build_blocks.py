#!/usr/bin/env python3
"""Build the intended-blocks file for the 2026-09-01 marker push.

Scope, deliberately narrow:
  * PRECONDITIONS and STEPS are rewritten so a layman can follow them from the UI (skill 18).
    Every route below was OBSERVED on sv8218 build v26.35.5-8c3cc21 on 31 Aug / 1 Sep 2026.
    Nothing is invented: where a route was not observed the wording says what was seen.
  * EXPECTED RESULTS keep their requirement lines BYTE-FOR-BYTE (Rule 57 -- expectation comes from
    the documents, never the build) and provenance sentence 1 byte-for-byte (Rule 54). Only two
    things change there: the false "could not be build-verified" line is removed, and sentence 2
    plus the AUTOMATION marker are set.
"""
import json

BUILD_SENTENCE = 'Last checked against build v26.35.5-8c3cc21 on 9/1/2026.'
READY = 'AUTOMATION: READY'
HOLD_45185 = ('AUTOMATION: HOLD - this case fails on a server error that has no ticket yet; '
              'change to READY - EXPECT FAIL (SV-xxxx) once the ticket is filed')

reqs = json.load(open('/tmp/inv6/reqs.json'))

PRE = {
'45197': [
 "1. You are signed in to ShopView.",
 "2. You need a parts return credit whose original invoice has since been reversed. To make one: click Parts in the top menu, open Part Sales, and open a part sale that is Complete but not yet paid. Click its Finance tab and create the invoice. On that same invoice use Issue Credit and return one part. Then, on the invoice's three dot menu, choose Reverse and confirm.",
 "3. Set your active location to the location the credit was issued at. Credits are location specific: a credit issued at another location does not appear in the customer's Invoices list at all, so there is no row and no print button.",
 "4. To open the document: click Customers in the top menu, open the customer, click the Invoices tab, and find the credit's row. Its credit number, for example CM-100, is in the Invoice # column next to ordinary invoice numbers. Click the print icon at the right of that row; its tooltip reads \"Print credit memo\".",
 "5. If the credit has been fully applied or fully refunded, turn the \"Open only\" filter off first, or its row is not listed."],
'44947': [
 "1. You are signed in to ShopView.",
 "2. You need one invoice carrying three payments made three different ways. To set it up: click Parts in the top menu, open Part Sales, open a part sale that is Complete, click its Finance tab and create the invoice.",
 "3. Add the first payment with New Payment, choosing a payment method the shop has set up, for example Visa.",
 "4. Add a second payment made online, so its method is the online one (SHOPPAY).",
 "5. For the third, you need a payment whose method the shop no longer has set up, because the payment screen refuses any method that is not on the shop's list. Do it in this order: add a new payment method in the shop's payment method settings; take a payment using it; then delete that method again. The payment stays, and its method is now one the shop does not have. Ask an administrator if you cannot reach the payment method settings.",
 "6. To read the document: on the work order or part sale, click the Finance tab. The document appears on screen."],
'45196': [
 "1. You are signed in to ShopView.",
 "2. You need one invoice that is settled partly by cash and partly by a customer credit. To set it up: click Parts in the top menu, open Part Sales, open a part sale that is Complete, click its Finance tab and create the invoice. Note the amount owing.",
 "3. Click Customers in the top menu, open that customer, click the Invoices tab and use Issue Credit to give the account a store credit worth part of that amount.",
 "4. Before you pay anything, open the document once and note whether the top of it says \"Due date\" or \"Paid date\", so you can tell what changes.",
 "5. To read the document: on the part sale, click the Finance tab. The document appears on screen."],
'45190': [
 "1. You are signed in to ShopView.",
 "2. You need three records open in turn: an ordinary work order, an imported work order, and a parts sale.",
 "3. An ordinary work order: click Work Orders in the top menu and open any row.",
 "4. An imported work order: click Work Orders in the top menu, set the Status filter to Imported, and open a row. Imported work orders only appear under that filter; they are not in the ordinary list.",
 "5. A parts sale: click Parts in the top menu, open Part Sales, and open any row.",
 "6. On each of the three, the customer card is the panel down the left hand side of the screen."],
'45191': [
 "1. You need two sign ins: your own, and one for a person whose role does not let them edit work orders. On this system the Technician role is already like that, so any active Technician will do.",
 "2. Click Work Orders in the top menu and open a work order that has an Authorizer chosen. The Authorizer row is in the customer card down the left hand side, below Contact and Phone.",
 "3. Look at it as yourself first, so you know what the editable version looks like."],
'44923': [
 "1. You are signed in to ShopView.",
 "2. Click Work Orders in the top menu and open a work order that has NOT been invoiced yet - one that still says Estimate, Approved, In progress, Review or Complete. Once a work order is invoiced the Authorizer is locked and cannot be changed, so the test cannot be done on it.",
 "3. Leave that work order open on screen. Do not reload it at any point.",
 "4. In a second browser tab, click Customers in the top menu, open the same customer, and click the Contacts tab.",
 "5. Pick a contact on that list who does not yet approve work - the Approves Work column reads No."],
'44987': [
 "1. You are signed in to ShopView.",
 "2. For a batch invoice: click Customers in the top menu, open a customer, and click the Invoices tab. Tick two or more invoice rows using the tick boxes on the left, or the tick box in the header row to take them all. A small toolbar appears above the list with Download, Send Email and Print buttons.",
 "3. For an imported invoice: click Work Orders in the top menu, set the Status filter to Imported, and open a row. The document is shown on the record itself.",
 "4. To compare against a redesigned invoice: open any ordinary work order and click its Finance tab."],
'45185': [
 "1. You are signed in to ShopView.",
 "2. Click Work Orders in the top menu and open a work order that was invoiced BEFORE this version was built - check the dates in its history.",
 "3. Open its History. Some entries keep a saved copy of the document as it looked at that moment; Invoice created, Invoice downloaded, Invoice emailed and Reviewed are the entries that do.",
 "4. You will also want one saved copy made today, for comparison: create an invoice on any Complete work order now, then open the History entry it produces."],
}

STEPS = {
'45197': [
 "1. Open the credit document using the route in the preconditions.",
 "2. Read the small table at the top that lists the credit number and its status, and read the Balance.",
 "3. Try to void the credit, if a Void action is offered."],
'44947': [
 "1. Open the document on the Finance tab.",
 "2. Find the Payments block near the bottom, above Balance.",
 "3. Read the method name shown on each of the three payment rows."],
'45196': [
 "1. Pay part of the amount owing in cash, using New Payment on the Finance tab.",
 "2. Settle the rest by applying the customer's credit to the same invoice.",
 "3. Open the document again on the Finance tab.",
 "4. Read the dates at the top of the document, the Payments block, and the Balance."],
'45190': [
 "1. Open each of the three records in turn.",
 "2. On each one, read the customer card down the left hand side: the Contact row, the Phone row, and whether there is an Authorizer row.",
 "3. Check the card looks right on all three - nothing overlapping, cut off or missing its heading."],
'45191': [
 "1. Sign in as the person whose role does not let them edit work orders.",
 "2. Open the same work order and look at the customer card down the left hand side.",
 "3. Try to change the Authorizer."],
'44923': [
 "1. In the second tab, on the Contacts tab, click the edit icon at the right of the contact's row, tick \"Approves Work\", and click Save.",
 "2. Switch back to the first tab, where the work order is still open. Do not reload it and do not save it.",
 "3. Click the Authorizer row in the customer card to open its list."],
'44987': [
 "1. Produce the batch document: on the customer's Invoices tab, tick two or more invoice rows and click Print in the toolbar above the list.",
 "2. Open an imported work order and look at the document shown on it.",
 "3. Open an ordinary work order's Finance tab to see a redesigned invoice next to them.",
 "4. Compare the wording on all three: whether the date at the top reads \"Invoice date\" or \"Invoice Date\", whether a settled invoice says \"Paid date\", whether the signature line reads \"Customer Signature\" or \"Customer signature:\", whether the footer says \"Powered by ShopView\" or \"Software Powered by ShopView\", whether the tax line reads \"GST (5%)\" or \"Tax\", and whether the headings \"Addresses\" and \"Summary\" are present."],
'45185': [
 "1. Open the saved copy of the document from an old History entry.",
 "2. Save or print it.",
 "3. Look at the fields that did not exist when that copy was made - the Authorizer, the licence plate, the estimate date - and check whether they are simply blank."],
}

MARKER = {c: READY for c in reqs}
MARKER['45185'] = HOLD_45185

out = {}
for cid, v in reqs.items():
    exp_blocks = [
        v['reqs'],
        ['---', v['prov'], BUILD_SENTENCE],
        [MARKER[cid]],
    ]
    fields = {
        'custom_preconds': {'blocks': [PRE[cid]]},
        'custom_steps':    {'blocks': [STEPS[cid]]},
        'custom_expected': {'blocks': exp_blocks},
    }
    for f in fields:
        fields[f]['text'] = '\n\n'.join('\n'.join(b) for b in fields[f]['blocks'])
    out[cid] = {'title': v['title'], 'marker_override': MARKER[cid], 'fields': fields}

json.dump(out, open('intended-blocks.json', 'w'), indent=1)
print(f'wrote intended-blocks.json for {len(out)} cases')
for cid in sorted(out): print(' C'+cid, '->', out[cid]['marker_override'][:60])
