# Per-case result text and picture plan for run 557 (QA site sv11315, build v26.45.2-6a8b89c, 11 Nov 2026).
# b = bullets (what was seen, plain words); p = pictures: (evidence file, title, [marks]).
# mark = (needle, kind good|bad, caption, mode)  mode: row | text | nav | top | span (needle "A||B")
G, X = 'good', 'bad'
K = {}

K['V1R-01'] = dict(b=[
 'In the Reports menu, the Finance part has an Accounts Receivable heading listing A/R Aging Summary, A/R Aging Detail and A/R Aging Collection.',
 'Clicking A/R Aging Summary opens the page titled "A/R Aging Summary"; the address ends in /reports/ar-aging-summary.',
 'Clicking A/R Aging Detail opens the page titled "A/R Aging Detail"; the address ends in /reports/ar-aging-detail.',
 'Clicking A/R Aging Collection opens the page titled "A/R Aging Collection"; the address ends in /reports/ar-aging-collection.'],
 p=[('V1R-01 - step 2 Finance part of the Reports menu.png', 'Reports menu, Finance part: the Accounts Receivable heading and its three reports',
     [('ACCOUNTS RECEIVABLE||A/R Aging Collection', G, 'Accounts Receivable lists A/R Aging Summary, A/R Aging Detail and A/R Aging Collection.', 'navspan')]),
    ('V1R-01 - step 4 AR Aging Summary.png', 'A/R Aging Summary opened from the Reports menu',
     [('A/R Aging Summary', G, 'The page title reads A/R Aging Summary.', 'text')]),
    ('V1R-01 - step 6 AR Aging Detail.png', 'A/R Aging Detail opened from the Reports menu',
     [('A/R Aging Detail', G, 'The page title reads A/R Aging Detail.', 'text')]),
    ('V1R-01 - step 8 AR Aging Collection.png', 'A/R Aging Collection opened from the Reports menu',
     [('A/R Aging Collection', G, 'The page title reads A/R Aging Collection.', 'text')])])

K['V1R-02'] = dict(b=[
 'In the Reports menu, the Accounts Payable heading lists A/P Aging Summary, A/P Aging Detail and A/P Unpaid Invoices.',
 'Clicking A/P Aging Summary opens the page titled "A/P Aging Summary"; the address ends in /reports/ap-aging-summary.',
 'Clicking A/P Aging Detail opens the page titled "A/P Aging Detail"; the address ends in /reports/ap-aging-detail.',
 'Clicking A/P Unpaid Invoices opens the page titled "A/P Unpaid Invoices Report"; the address ends in /reports/ap-unpaid-invoices.'],
 p=[('V1R-02 - step 2 Accounts Payable heading.png', 'Reports menu: the Accounts Payable heading and its three reports',
     [('ACCOUNTS PAYABLE||A/P Unpaid Invoices', G, 'Accounts Payable lists A/P Aging Summary, A/P Aging Detail and A/P Unpaid Invoices.', 'navspan')]),
    ('V1R-02 - step 4 AP Aging Summary.png', 'A/P Aging Summary opened from the Reports menu',
     [('A/P Aging Summary', G, 'The page title reads A/P Aging Summary.', 'text')]),
    ('V1R-02 - step 6 AP Aging Detail.png', 'A/P Aging Detail opened from the Reports menu',
     [('A/P Aging Detail', G, 'The page title reads A/P Aging Detail.', 'text')]),
    ('V1R-02 - step 8 AP Unpaid Invoices.png', 'A/P Unpaid Invoices opened from the Reports menu',
     [('A/P Unpaid Invoices', G, 'The page title reads A/P Unpaid Invoices Report.', 'text')])])

K['V1R-03'] = dict(b=[
 'Working at Staging Heavy Duty - 9919 (location A, shown top right).',
 'With every bucket of A/R Aging Detail open, invoice S11315-17835 of ZZAUTOTEST AR R03 Location B is listed with Staging Lethbridge - 4310 (location B) on its line: dated Nov 6, 2026, $33.00, open balance $33.00.',
 'The invoice is dated Nov 6, 2026 rather than today as the setup says; it is open today, which is what the test checks.'],
 p=[('V1R-03 - steps 3-4 location B invoice while working at A.png', 'A/R Aging Detail while working at Staging Heavy Duty - 9919, every bucket open',
     [('Staging Heavy', G, 'You are working at Staging Heavy Duty - 9919 (location A).', 'top'),
      ('S11315-17835', G, 'Invoice S11315-17835 of ZZAUTOTEST AR R03 Location B is listed, with Staging Lethbridge - 4310 on its line.', 'row')])])

K['V1R-04'] = dict(b=[
 'A/R Aging Summary with the date chip set to As of: 10/01/2026.',
 'After switching location to Staging Lethbridge - 4310 in the top right, the page is still A/R Aging Summary and the chip still reads As of: 10/01/2026.'],
 p=[('V1R-04 - step 5 after switching to location B.png', 'A/R Aging Summary after switching location to Staging Lethbridge - 4310',
     [('Lethbridge', G, 'The location is now Staging Lethbridge - 4310.', 'top'),
      ('A/R Aging Summary', G, 'Still on A/R Aging Summary.', 'text'),
      ('As of', G, 'The date chip still reads As of: 10/01/2026.', 'text')])])

_today = 'The date chip shows today, As of: 11/11/2026.'
K['V1R-05'] = dict(b=[
 'A/R Aging Summary opens with the date chip on today: As of: 11/11/2026.',
 'A/R Aging Detail opens with As of: 11/11/2026.',
 'A/R Aging Collection opens with As of: 11/11/2026.',
 'A/P Aging Summary opens with As of: 11/11/2026.',
 'A/P Aging Detail opens with As of: 11/11/2026.',
 'A/P Unpaid Invoices opens with As of: 11/11/2026.'],
 p=[(f, t + ' opened from the Reports menu', [(t, G, 'Report: ' + t + '.', 'text'), ('As of', G, _today, 'text')]) for f, t in [
    ('V1R-05 - step 3 AR Aging Summary date chip.png', 'A/R Aging Summary'),
    ('V1R-05 - step 5 AR Aging Detail date chip.png', 'A/R Aging Detail'),
    ('V1R-05 - step 7 AR Aging Collection date chip.png', 'A/R Aging Collection'),
    ('V1R-05 - step 9 AP Aging Summary date chip.png', 'A/P Aging Summary'),
    ('V1R-05 - step 11 AP Aging Detail date chip.png', 'A/P Aging Detail'),
    ('V1R-05 - step 13 AP Unpaid Invoices date chip.png', 'A/P Unpaid Invoices')]])

K['V1R-06'] = dict(b=[
 'On A/P Aging Summary, the date menu opened from the chip offers no clear or empty choice, and the chip has no clear (x) button.',
 'After closing the menu, the chip still reads As of: 11/11/2026 and the report still lists its vendor rows for that date.'],
 p=[('V1R-06 - step 4 date menu open.png', 'A/P Aging Summary with the date menu open',
     [('As of', G, 'The chip has no clear (x) button, and the menu offers only dates - no way to empty it.', 'text')]),
    ('V1R-06 - step 5 after closing the date menu.png', 'A/P Aging Summary after closing the date menu',
     [('As of', G, 'The chip still reads As of: 11/11/2026.', 'text'),
      ('Vendor', G, 'The report still shows its vendor rows for that date.', 'row')])])

K['V1R-09'] = dict(b=[
 'A/R Aging Detail with the date chip set to As of: 10/15/2026.',
 'After reloading the page the chip still reads As of: 10/15/2026.',
 'After opening A/R Aging Summary and pressing the browser Back button, A/R Aging Detail is back, still on As of: 10/15/2026.'],
 p=[('V1R-09 - step 5 after reload.png', 'A/R Aging Detail after reloading the page',
     [('As of', G, 'After the reload the chip still reads As of: 10/15/2026.', 'text')]),
    ('V1R-09 - step 8 after browser Back.png', 'A/R Aging Detail after A/R Aging Summary and the browser Back button',
     [('A/R Aging Detail', G, 'Back on A/R Aging Detail.', 'text'), ('As of', G, 'The chip still reads As of: 10/15/2026.', 'text')])])

K['V1R-10'] = dict(b=[
 'A/P Unpaid Invoices with the date chip set to As of: 10/01/2026.',
 'After opening Inventory Value and then A/P Unpaid Invoices again from the left list, the chip reads As of: 11/11/2026 (today), not 10/01/2026.'],
 p=[('V1R-10 - step 6 date chip.png', 'A/P Unpaid Invoices opened again from the left list',
     [('As of', G, 'The chip is back on today, As of: 11/11/2026, not 10/01/2026.', 'text')])])

K['V1R-11'] = dict(b=[
 'As of 10/20/2026, A/R Aging Detail lists invoice S11315-17837 of ZZAUTOTEST AR R11 Date Edge, dated Oct 20, 2026 (the as-of date), $60.00.',
 'On that date the customer\'s credit memo CM11315-4202, dated Oct 21, 2026 (the day after), is not listed; the invoice is the customer\'s only line.',
 'As of 10/19/2026 (the day before), the customer has no lines: the invoice is not listed.'],
 p=[('V1R-11 - steps 3-6 as of 2026-10-20.png', 'A/R Aging Detail as of 10/20/2026, every bucket open',
     [('As of', G, 'As of 10/20/2026.', 'text'),
      ('S11315-17837', G, 'Invoice S11315-17837 dated Oct 20, 2026 is listed; the credit memo dated Oct 21 is not.', 'row')]),
    ('V1R-11 - steps 7-9 as of 2026-10-19.png', 'A/R Aging Detail as of 10/19/2026, every bucket open',
     [('As of', G, 'As of 10/19/2026, the day before the invoice: the invoice is not listed.', 'text')])])

K['V1R-12'] = dict(b=[
 'As of 10/20/2026, A/P Aging Detail lists bill ZZAUTOTEST-P12-A of ZZAUTOTEST AP P12 Bill Dates, dated Oct 20, 2026, $51.00.',
 'The vendor\'s bill ZZT-P12-BILLD1, dated Oct 21, 2026 (the day after), is not listed; ZZAUTOTEST-P12-A is the vendor\'s only line.'],
 p=[('V1R-12 - steps 3-6 as of 2026-10-20.png', 'A/P Aging Detail as of 10/20/2026, every bucket open',
     [('As of', G, 'As of 10/20/2026.', 'text'),
      ('ZZAUTOTEST-P12-A', G, 'Bill ZZAUTOTEST-P12-A dated Oct 20 is listed; the bill dated Oct 21 is not.', 'row')])])

K['V1R-13'] = dict(b=[
 'As of 10/12/2026, before the payment, the invoice of ZZAUTOTEST AR R13 Payment After shows Amount $100.00 and Open balance $100.00.',
 'As of 10/15/2026, after the payment, its Open balance is $60.00.'],
 p=[('V1R-13 - step 5 as of D+2 2026-10-12.png', 'A/R Aging Detail as of 10/12/2026, before the payment',
     [('As of', G, 'As of 10/12/2026.', 'text'), ('$100.00', G, 'Amount $100.00 and Open balance $100.00: the later payment is not taken off.', 'row')]),
    ('V1R-13 - step 8 as of D+5 2026-10-15.png', 'A/R Aging Detail as of 10/15/2026, after the payment',
     [('As of', G, 'As of 10/15/2026.', 'text'), ('$60.00', G, 'Open balance $60.00 once the payment date is reached.', 'row')])])

K['V1R-14'] = dict(b=[
 'As of 10/11/2026 (the day before the payment), A/R Aging Summary lists ZZAUTOTEST AR R14 Paid In Full with $80.00 under 1-30 Days; Total $80.00.',
 'As of 10/12/2026 (the payment date), the customer is not listed.'],
 p=[('V1R-14 - step 4 as of the day before P 2026-10-11.png', 'A/R Aging Summary as of 10/11/2026, the day before the payment',
     [('As of', G, 'As of 10/11/2026.', 'text'), ('R14 Paid', G, 'ZZAUTOTEST AR R14 Paid In Full is listed with $80.00.', 'row')]),
    ('V1R-14 - step 6 as of P 2026-10-12.png', 'A/R Aging Summary as of 10/12/2026, the payment date',
     [('As of', G, 'As of 10/12/2026 the customer is no longer listed.', 'text')])])

K['V1R-15'] = dict(b=[
 'As of 10/20/2026 (after the Oct 6 payment, before its reversal), invoice S11315-17839 of ZZAUTOTEST AR R15 Payment Reversed is not listed.',
 'As of 11/11/2026 (the reversal date), the invoice is listed again: dated Oct 1, 2026, Amount $100.00, Open balance $100.00.',
 'The payment was reversed today, 11/11/2026 (the app stamps a reversal with the moment it is made), so the reversal day is today rather than a past day as the setup describes.'],
 p=[('V1R-15 - step 5 as of 2026-10-20 between P and R.png', 'A/R Aging Detail as of 10/20/2026, between the payment and its reversal',
     [('As of', G, 'As of 10/20/2026 invoice S11315-17839 is not listed: it was paid on Oct 6.', 'text')]),
    ('V1R-15 - step 8 as of R 2026-11-11.png', 'A/R Aging Detail as of 11/11/2026, the reversal date',
     [('As of', G, 'As of 11/11/2026.', 'text'), ('S11315-17839', G, 'Invoice S11315-17839 is listed again with Open balance $100.00.', 'row')])])

K['V1R-16'] = dict(b=[
 'As of 10/25/2026 (after the memo date, before the void), credit memo CM11315-4203 of ZZAUTOTEST AR R16 Memo Voided is listed at $-25.00, open balance $-25.00.',
 'As of 11/11/2026 (the void date), it is not listed.',
 'The credit memo was voided today, 11/11/2026 (a void is stamped with the moment it is made), so the void day is today.'],
 p=[('V1R-16 - step 5 as of 2026-10-25.png', 'A/R Aging Detail as of 10/25/2026, before the void',
     [('As of', G, 'As of 10/25/2026.', 'text'), ('CM11315-4203', G, 'Credit memo CM11315-4203 is listed at $-25.00.', 'row')]),
    ('V1R-16 - step 8 as of V 2026-11-11.png', 'A/R Aging Detail as of 11/11/2026, the void date',
     [('As of', G, 'As of 11/11/2026 the voided credit memo is not listed.', 'text')])])

K['V1R-17'] = dict(b=[
 'As of 10/20/2026, credit memo CM11315-4204 of ZZAUTOTEST AR R17 Memo Applied shows Open balance $-30.00.',
 'As of 10/27/2026 (the day it was applied), it is not listed.'],
 p=[('V1R-17 - step 5 as of 2026-10-20.png', 'A/R Aging Detail as of 10/20/2026, before the credit memo was applied',
     [('As of', G, 'As of 10/20/2026.', 'text'), ('CM11315-4204', G, 'Credit memo CM11315-4204 shows Open balance $-30.00.', 'row')]),
    ('V1R-17 - step 8 as of A 2026-10-27.png', 'A/R Aging Detail as of 10/27/2026, the day it was applied',
     [('As of', G, 'As of 10/27/2026 the fully used credit memo is not listed.', 'text')])])

K['V1R-18'] = dict(b=[
 'With every bucket of A/R Aging Detail open, ZZAUTOTEST AR R18 Deposits shows deposit DEP11315-4714 (the $50.00 deposit not tied to a work order) at $-50.00, open balance $-50.00.',
 'The $70.00 work order deposit DEP11315-4713 is not listed; the $50.00 deposit is the customer\'s only line.'],
 p=[('V1R-18 - steps 3-5 every bucket open.png', 'A/R Aging Detail, every bucket open, customer ZZAUTOTEST AR R18 Deposits',
     [('DEP11315-4714', G, 'The $50.00 deposit DEP11315-4714 is listed at $-50.00; the $70.00 work order deposit is not listed.', 'row')])])

K['V1R-19'] = dict(b=[
 'As of 11/10/2026 (the day before the reversal), A/R Aging Collection shows deposit DEP11315-4715 of ZZAUTOTEST AR R19 Deposit Reversed, dated Oct 30, 2026, at $-20.00.',
 'As of 11/11/2026 (the reversal date), the deposit is not listed; the customer now shows only invoice S11315-17850 ($5.00), which the reversed payment had paid.',
 'The deposit was ended by reversing the payment that made it, stamped today, 11/11/2026.'],
 p=[('V1R-19 - steps 3-5 as of the day before R 2026-11-10.png', 'A/R Aging Collection as of 11/10/2026, the day before the reversal',
     [('As of', G, 'As of 11/10/2026.', 'text'), ('DEP11315-4715', G, 'Deposit DEP11315-4715 is listed at $-20.00.', 'row')]),
    ('V1R-19 - steps 6-7 as of R 2026-11-11.png', 'A/R Aging Collection as of 11/11/2026, the reversal date',
     [('As of', G, 'As of 11/11/2026.', 'text'), ('S11315-17850', G, 'Only invoice S11315-17850 is left; the deposit is gone.', 'row')])])

K['V1R-20'] = dict(b=[
 'As of 10/13/2026, A/P Aging Detail shows bill ZZT-P20-BILL of ZZAUTOTEST AP P20 Payment After (dated Oct 12, 2026) with Open Balance $200.00: the later payment is not taken off.',
 'As of 10/16/2026, after the payment, its Open Balance is $120.00.'],
 p=[('V1R-20 - step 5 as of D+1 2026-10-13.png', 'A/P Aging Detail as of 10/13/2026, before the payment',
     [('As of', G, 'As of 10/13/2026.', 'text'), ('ZZT-P20-BILL', G, 'Bill ZZT-P20-BILL shows Open Balance $200.00.', 'row')]),
    ('V1R-20 - step 8 as of D+4 2026-10-16.png', 'A/P Aging Detail as of 10/16/2026, after the payment',
     [('As of', G, 'As of 10/16/2026.', 'text'), ('ZZT-P20-BILL', G, 'Bill ZZT-P20-BILL now shows Open Balance $120.00.', 'row')])])

K['V1R-21'] = dict(b=[
 'As of 10/25/2026, A/P Aging Detail lists vendor credit C-13673 of ZZAUTOTEST AP P21 Credit Used, dated Oct 22, 2026, at $-35.00.',
 'As of 10/30/2026 (the day it was used), it is not listed.'],
 p=[('V1R-21 - step 5 as of 2026-10-25.png', 'A/P Aging Detail as of 10/25/2026, before the credit was used',
     [('As of', G, 'As of 10/25/2026.', 'text'), ('C-13673', G, 'Vendor credit C-13673 is listed at $-35.00.', 'row')]),
    ('V1R-21 - step 8 as of U 2026-10-30.png', 'A/P Aging Detail as of 10/30/2026, the day the credit was used',
     [('As of', G, 'As of 10/30/2026 the used vendor credit is not listed.', 'text')])])

_r22 = [('2026-08-01', '08/01/2026', 'Current', 'D+0'), ('2026-08-31', '08/31/2026', '1-30 Days', 'D+30'), ('2026-09-01', '09/01/2026', '31-60 Days', 'D+31'),
        ('2026-09-30', '09/30/2026', '31-60 Days', 'D+60'), ('2026-10-01', '10/01/2026', '61-90 Days', 'D+61'), ('2026-10-30', '10/30/2026', '61-90 Days', 'D+90'),
        ('2026-10-31', '10/31/2026', '91 And Over', 'D+91')]
K['V1R-22'] = dict(b=['As of %s, ZZAUTOTEST AR R22 Bucket Edges shows $10.00 under %s; Total $10.00.' % (d, c) for _, d, c, _ in _r22],
 p=[('V1R-22 - step %d as of %s %s.png' % (4 + 2 * i, s, iso), 'A/R Aging Summary as of %s' % d,
     [('As of', G, 'As of %s.' % d, 'text'), ('R22 Bucket', G, '$10.00 sits under %s; Total $10.00.' % c, 'row')])
    for i, (iso, d, c, s) in enumerate(_r22) if iso != '2026-09-30'])

K['V1R-23'] = dict(b=[
 'As of 09/16/2026 (the day after the memo date), ZZAUTOTEST AR R23 Memo Aging shows $-15.00 under 1-30 Days and nothing under Current.',
 'As of 10/16/2026 (31 days after the memo date), the $-15.00 is under 31-60 Days.'],
 p=[('V1R-23 - step 4 as of C+1 2026-09-16.png', 'A/R Aging Summary as of 09/16/2026', [('As of', G, 'As of 09/16/2026.', 'text'), ('R23 Memo', G, '$-15.00 under 1-30 Days, nothing under Current.', 'row')]),
    ('V1R-23 - step 6 as of C+31 2026-10-16.png', 'A/R Aging Summary as of 10/16/2026', [('As of', G, 'As of 10/16/2026.', 'text'), ('R23 Memo', G, '$-15.00 now under 31-60 Days.', 'row')])])

K['V1R-24'] = dict(b=[
 'As of 09/03/2026 (the day after the credit\'s date), ZZAUTOTEST AP P24 Credit Aging shows $-12.00 under 1-30 Days and nothing under Current.',
 'As of 11/02/2026 (61 days after), the $-12.00 is under 61-90 Days.'],
 p=[('V1R-24 - step 4 as of C+1 2026-09-03.png', 'A/P Aging Summary as of 09/03/2026', [('As of', G, 'As of 09/03/2026.', 'text'), ('P24 Credit', G, '$-12.00 under 1-30 Days, nothing under Current.', 'row')]),
    ('V1R-24 - step 6 as of C+61 2026-11-02.png', 'A/P Aging Summary as of 11/02/2026', [('As of', G, 'As of 11/02/2026.', 'text'), ('P24 Credit', G, '$-12.00 now under 61-90 Days.', 'row')])])

K['V1R-28'] = dict(b=[
 'A/R Aging Summary lists ZZAUTOTEST AR R28 Credit Only, a customer whose only document is a credit.',
 'Its Total reads $-40.00.'],
 p=[('V1R-28 - steps 3-4 credit-only customer.png', 'A/R Aging Summary, customer ZZAUTOTEST AR R28 Credit Only',
     [('R28 Credit', G, 'The credit-only customer is listed, Total $-40.00.', 'row')])])

K['V1R-29'] = dict(b=[
 'The headings read, left to right: Customer, Location, Current, 1-30 Days, 31-60 Days, 61-90 Days, 91 And Over, Total (Location is new by design).',
 'ZZAUTOTEST AR R29 One Bucket shows $100.00 under 1-30 Days and Total $100.00; its other buckets are blank, not $0.00.'],
 p=[('V1R-29 - step 3 column headings.png', 'A/R Aging Summary column headings',
     [('Customer', G, 'Customer, Location, Current, 1-30 Days, 31-60 Days, 61-90 Days, 91 And Over, Total.', 'row')]),
    ('V1R-29 - steps 4-5 one-bucket customer.png', 'A/R Aging Summary, customer ZZAUTOTEST AR R29 One Bucket',
     [('R29 One', G, '$100.00 under 1-30 Days; the other buckets are blank, not $0.00.', 'row')])])

K['V1R-30'] = dict(b=[
 'ZZAUTOTEST AR R30 Netting shows Current $50.00.',
 'Its 1-30 Days reads $70.00 (the $100.00 invoice less the $30.00 credit).',
 'Its Total reads $120.00.'],
 p=[('V1R-30 - steps 3-6 netting customer.png', 'A/R Aging Summary, customer ZZAUTOTEST AR R30 Netting',
     [('R30 Netting', G, 'Current $50.00, 1-30 Days $70.00, Total $120.00.', 'row')])])

K['V1R-31'] = dict(b=[
 'ZZAUTOTEST AR R31 Thousands shows $1,234.56 under 1-30 Days and Total $1,234.56: dollar sign, thousands comma and two decimals.',
 'The negative Total reads $-12.00, with the minus sign after the dollar sign.'],
 p=[('V1R-31 - step 3 amount over 1000.png', 'A/R Aging Summary, an amount over $1,000',
     [('R31 Thousands', G, '$1,234.56: dollar sign, thousands comma, two decimals.', 'row')]),
    ('V1R-31 - step 4 negative total.png', 'A/R Aging Summary, a negative Total',
     [('$-12.00', G, 'The negative Total reads $-12.00, minus after the dollar sign.', 'row')])])

K['V1R-33'] = dict(b=[
 'A/P Aging Summary with the date chip set to As of: 01/01/2000.',
 'The table reads "No record matches these filters" and "Try changing filters to widen your results."'],
 p=[('V1R-33 - step 4 message on 1 January 2000.png', 'A/P Aging Summary as of 01/01/2000',
     [('As of', G, 'As of 01/01/2000.', 'text'),
      ('No record matches||Try changing', G, '"No record matches these filters" and "Try changing filters to widen your results."', 'span')])])

K['V1R-34'] = dict(b=[
 'The downloaded A/R Aging Summary PDF opens with "A/R Aging Summary", "Staging Foothills Group Inc", "As of Nov 11, 2026" and "Locations: All locations" at the top of page 1.',
 'The pages are landscape; the bottom of page 1 reads "Software Powered by ShopView" in the middle and "Page 1 of 7" on the right.',
 'The last row of page 7 is Totals ($2,926.00 / $101,628.88 / $167,363.30 / $126,336.92 / $118,341.26 / $516,596.36), with customer rows above it; no customer row shows $0.00 - empty buckets are blank.'],
 p='FRESH')

K['V1R-37'] = dict(b=[
 'A/R Aging Detail\'s bucket rows read, top to bottom: 91 or more days past due (70), 61-90 days past due (54), 31-60 days past due (184), 1-30 days past due (268), Current (14) - each with its number of lines in brackets.'],
 p=[('V1R-37 - step 3 bucket rows.png', 'A/R Aging Detail bucket rows',
     [('91 or more||Current (', G, 'Five buckets in fixed order, each with its line count in brackets.', 'span')])])

K['V1R-38'] = dict(b=[
 'The Current bucket starts closed: "Current (14)" with Total $2,862.00 (Amount) and $2,862.00 (Open balance).',
 'After clicking its arrow, its 14 lines are shown.',
 'Clicking the arrow again closes it; the row is back to Current (14), Total $2,862.00 $2,862.00.'],
 p=[('V1R-38 - step 3 Current closed.png', 'A/R Aging Detail, Current closed', [('Current (', G, 'Closed, with Total $2,862.00 $2,862.00.', 'row')]),
    ('V1R-38 - step 5 Current open.png', 'A/R Aging Detail, Current opened', [('Current (', G, 'Opened: its 14 lines are shown below.', 'row')]),
    ('V1R-38 - step 6 Current closed again.png', 'A/R Aging Detail, Current closed again', [('Current (', G, 'Closed again.', 'row')])])

K['V1R-39'] = dict(b=[
 'With 1-30 days past due open, the line after its last document reads "Total for 1-30 days past due", $103,028.88 (Amount) and $101,628.88 (Open balance).',
 'The bottom row reads "Totals", $546,308.68 (Amount) and $516,532.36 (Open balance).'],
 p=[('V1R-39 - steps 4-5 end of 1-30 bucket and Totals.png', 'A/R Aging Detail, end of 1-30 days past due and the Totals row',
     [('Total for 1-30', G, 'Total for 1-30 days past due: $103,028.88 and $101,628.88.', 'row'),
      ('Totals', G, 'Totals: $546,308.68 and $516,532.36.', 'row')])])

K['V1R-40'] = dict(b=[
 'The line of invoice S11315-17835 reads: Nov 6, 2026 - Staging Lethbridge - 4310 - Invoice - S11315-17835 - ZZAUTOTEST AR R03 Location B - due Nov 6, 2026 - Amount $33.00 - Open balance $33.00.'],
 p=[('V1R-40 - step 5 the location B invoice line.png', 'A/R Aging Detail, the location B invoice line',
     [('S11315-17835', G, 'Date, Staging Lethbridge - 4310, Invoice, S11315-17835, the customer\'s full name, due date, Amount and Open balance.', 'row')])])

K['V1R-41'] = dict(b=[
 'The partly paid invoice of ZZAUTOTEST AR R41 Partly Paid shows Amount $250.00 (the invoice total).',
 'Its Open balance reads $150.00 (what is still unpaid).'],
 p=[('V1R-41 - steps 4-6 partly paid invoice.png', 'A/R Aging Detail, partly paid invoice of ZZAUTOTEST AR R41 Partly Paid',
     [('R41 Partly', G, 'Amount $250.00, Open balance $150.00.', 'row')])])

K['V1R-42'] = dict(b=[
 'The credit memo of ZZAUTOTEST AR R42 Memo Line reads CM11315-4209: the number with its location prefix.',
 'Its Due date is Oct 26, 2026, the credit memo\'s own date.',
 'Amount $-5.00 and Open balance $-5.00.',
 'The number CM11315-4209 is plain text: clicking it opens nothing and the page stays on A/R Aging Detail.'],
 p=[('V1R-42 - steps 4-7 credit memo line.png', 'A/R Aging Detail, credit memo of ZZAUTOTEST AR R42 Memo Line',
     [('CM11315-4209', G, 'CM11315-4209, due Oct 26, 2026 (its own date), $-5.00 and $-5.00.', 'row')]),
    ('V1R-42 - step 8 after clicking the ID.png', 'A/R Aging Detail after clicking CM11315-4209',
     [('A/R Aging Detail', G, 'Still on A/R Aging Detail: the number opens nothing.', 'text')])])

K['V1R-43'] = dict(b=[
 'A/R Aging Detail with Current open (14 lines shown).',
 'After setting the date chip to As of: 11/10/2026 (yesterday), every bucket row is closed, from 91 or more days past due down to Current (38).'],
 p=[('V1R-43 - step 5 bucket rows after the date change.png', 'A/R Aging Detail after changing the date to 11/10/2026',
     [('As of', G, 'Date changed to 11/10/2026.', 'text'), ('91 or more||Current (', G, 'Every bucket is closed.', 'span')])])

K['V1R-44'] = dict(b=[
 'A/R Aging Collection shows "ZZAUTOTEST AR R44 Two Past Due (2)", Credit term: COD, with Total $81.00 $81.00.',
 'With the group open, the line after its last document reads "Total for ZZAUTOTEST AR R44 Two Past Due", $81.00 $81.00.',
 'The bottom row reads "Totals", $81.00 $81.00.'],
 p=[('V1R-44 - steps 3-6 customer with two past-due invoices.png', 'A/R Aging Collection, customer ZZAUTOTEST AR R44 Two Past Due opened',
     [('R44 Two Past Due (', G, 'The customer\'s name with (2): its two past-due invoices are below.', 'row'),
      ('Total for', G, 'Total for ZZAUTOTEST AR R44 Two Past Due: $81.00 $81.00.', 'row'),
      ('Totals', G, 'Totals: $81.00 $81.00.', 'row')])])

K['V1R-45'] = dict(b=[
 'With ZZAUTOTEST AR R45 Collection Mix open on A/R Aging Collection, invoice S11315-17856 (Nov 6, 2026, 5 days past due) and credit memo CM11315-4210 (Nov 4, 2026, 7) are listed.',
 'Invoice S11315-17857 (due today) and invoice S11315-17858 (not yet due) are not listed.'],
 p=[('V1R-45 - steps 3-4 lines of the four-document customer.png', 'A/R Aging Collection, customer ZZAUTOTEST AR R45 Collection Mix opened',
     [('S11315-17856', G, 'Past-due invoice S11315-17856 is listed.', 'row'),
      ('CM11315-4210', G, 'Credit memo CM11315-4210 is listed; the invoices due today and not yet due are not.', 'row')])])

K['V1R-46'] = dict(b=[
 'A/R Aging Collection lists "ZZAUTOTEST AR R46 Collection Credit (1)", Credit term: COD, Total $-11.00 $-11.00.',
 'Its only line is credit memo CM11315-4211, Nov 4, 2026, Past due 7, $-11.00 $-11.00.'],
 p=[('V1R-46 - steps 3-4 credit-only customer.png', 'A/R Aging Collection, customer ZZAUTOTEST AR R46 Collection Credit opened',
     [('R46 Collection', G, 'The credit-only customer is listed with (1).', 'row'), ('CM11315-4211', G, 'Credit memo CM11315-4211 is its only line.', 'row')])])

K['V1R-47'] = dict(b=['ZZAUTOTEST AR R47 Oldest First\'s lines read, top to bottom: Oct 13, 2026, Oct 23, 2026, Nov 2, 2026 - oldest first.'],
 p=[('V1R-47 - steps 3-4 date column.png', 'A/R Aging Collection, customer ZZAUTOTEST AR R47 Oldest First opened',
     [('Oct 13, 2026||Nov 2, 2026', G, 'Oct 13, Oct 23, Nov 2: oldest at the top, newest at the bottom.', 'span')])])

K['V1R-48'] = dict(b=[
 'The invoice line of ZZAUTOTEST AR R48 Days Past Due reads: Oct 30, 2026 - Staging Heavy Duty - 9919 - Invoice - S11315-17862 - due Oct 30, 2026 - Past due 12 - $48.00 - $48.00.',
 'The credit memo CM11315-4212 (Nov 8, 2026) shows Past due 3.'],
 p=[('V1R-48 - steps 3-5 invoice and credit memo lines.png', 'A/R Aging Collection, customer ZZAUTOTEST AR R48 Days Past Due opened',
     [('S11315-17862', G, 'Invoice line with date, type, ID, location, due date, Past due 12 and both amounts.', 'row'),
      ('CM11315-4212', G, 'Credit memo CM11315-4212 shows Past due 3.', 'row')])])

K['V1R-49'] = dict(b=[
 'Typing in the Customer chip and picking ZZAUTOTEST AR R36 Collect X leaves only that customer\'s group on A/R Aging Collection.',
 'After reloading the page, still only ZZAUTOTEST AR R36 Collect X is listed.'],
 p=[('V1R-49 - step 6 groups after picking X.png', 'A/R Aging Collection after picking one customer',
     [('Customer:', G, 'Customer chip set to ZZAUTOTEST AR R36 Collect X.', 'text'), ('R36 Collect', G, 'Only ZZAUTOTEST AR R36 Collect X is listed.', 'row')]),
    ('V1R-49 - step 8 groups after reload.png', 'A/R Aging Collection after reloading',
     [('R36 Collect', G, 'After the reload, still only ZZAUTOTEST AR R36 Collect X.', 'row')])])

K['V1R-50'] = dict(b=[
 'With a customer\'s group open on A/R Aging Collection (1 line), setting the date chip to As of: 11/10/2026 closes every group: no document lines are shown.',
 'After opening the group again and picking ZZAUTOTEST AR R36 Collect Z in the Customer chip, every group is closed: only ZZAUTOTEST AR R36 Collect Z is listed, with no lines showing.'],
 p=[('V1R-50 - step 5 groups after date change.png', 'A/R Aging Collection after changing the date to 11/10/2026',
     [('As of', G, 'Date changed to 11/10/2026: every group is closed.', 'text')]),
    ('V1R-50 - step 8 groups after picking Z.png', 'A/R Aging Collection after picking another customer',
     [('R36 Collect', G, 'Only ZZAUTOTEST AR R36 Collect Z, closed.', 'row')])])

K['V1R-51'] = dict(b=[
 'With a customer who has nothing past due picked in the Customer chip, A/R Aging Collection reads "No record matches these filters" and "Try changing filters to widen your results.", with a "Clear all filters" button.',
 'After clicking "Clear all filters", the Customer chip reads "Customer: All customers", customer groups are listed again (30 loaded) and the date stays As of: 11/11/2026.'],
 p=[('V1R-51 - step 4 message.png', 'A/R Aging Collection with a customer who has nothing past due',
     [('No record matches||Clear all filters', G, 'The message and the "Clear all filters" button.', 'span')]),
    ('V1R-51 - step 6 after Clear all filters.png', 'A/R Aging Collection after Clear all filters',
     [('As of', G, 'Date unchanged, As of: 11/11/2026.', 'text'), ('All customers', G, 'Customer: All customers - every customer is back.', 'text')])])

K['V1R-52'] = dict(b=[
 'The headings read: Vendor, Location, Current, 1-30 Days, 31-60 Days, 61-90 Days, 91 And Over, Total (Location is new by design).',
 'ZZAUTOTEST AP P52 Netting shows Current $90.00 and 31-60 Days $280.00 (the $300.00 bill less the $20.00 vendor credit); the other buckets are blank; Total $370.00.'],
 p=[('V1R-52 - step 3 headings.png', 'A/P Aging Summary column headings', [('Vendor', G, 'Vendor, Location, Current, 1-30 Days, 31-60 Days, 61-90 Days, 91 And Over, Total.', 'row')]),
    ('V1R-52 - steps 4-5 vendor row.png', 'A/P Aging Summary, vendor ZZAUTOTEST AP P52 Netting',
     [('P52 Netting', G, 'Current $90.00, 31-60 Days $280.00, others blank, Total $370.00.', 'row')])])

K['V1R-54'] = dict(b=[
 'A/P Aging Detail\'s bucket rows read, top to bottom, each closed with its count in brackets and Total (Amount / Open Balance): 91 or more days past due (11935) $4,044,727.90 / $4,044,727.92; 61-90 days past due (708) $320,924.51 / $320,924.53; 31-60 days past due (723) $269,043.91 / $268,843.91; 1-30 days past due (496) $124,147.02 / $123,547.02; Current (28) $4,327.34 / $4,247.34.'],
 p=[('V1R-54 - step 3 bucket rows.png', 'A/P Aging Detail bucket rows',
     [('91 or more||Current (', G, 'Five closed buckets in fixed order, each with its count and Total.', 'span')])])

K['V1R-55'] = dict(b=[
 'With Current open and scrolled to its end, the line after its last document reads "Total for Current", $4,327.34 (Amount) and $4,247.34 (Open Balance).',
 'The bottom row reads "Totals", $4,763,170.68 and $4,762,290.72.'],
 p=[('V1R-55 - steps 5-6 end of Current and Totals.png', 'A/P Aging Detail, end of Current and the Totals row',
     [('Total for Current', G, 'Total for Current: $4,327.34 and $4,247.34.', 'row'), ('Totals', G, 'Totals: $4,763,170.68 and $4,762,290.72.', 'row')])])

K['V1R-56'] = dict(b=[
 'The bill line reads: Nov 5, 2026 - Staging Lethbridge - 4310 - Invoice - ZZT-P56-BILL - ZZAUTOTEST AP P56 Location B - due Dec 5, 2026 - Past Due -24 - $56.00 - $56.00.'],
 p=[('V1R-56 - step 5 location B bill line.png', 'A/P Aging Detail, the location B bill line',
     [('ZZT-P56-BILL', G, 'Date, Staging Lethbridge - 4310, Invoice, the bill No., vendor name, due date, Past Due, Amount and Open Balance.', 'row')])])

K['V1R-57'] = dict(b=['Under Current, bill ZZT-P57-BILL of ZZAUTOTEST AP P57 Not Yet Due (dated Oct 21, 2026, due Nov 20, 2026) shows Past Due -9.'],
 p=[('V1R-57 - steps 3-5 bill due in 9 days.png', 'A/P Aging Detail, Current opened', [('ZZT-P57-BILL', G, 'Due Nov 20, 2026: Past Due -9.', 'row')])])

K['V1R-58'] = dict(b=[
 'Under 1-30 days past due, vendor credit C-13676 of ZZAUTOTEST AP P58 Credit Line shows Due Date Nov 1, 2026, its own date.',
 'Its Past Due reads 10.',
 'Amount $-25.00 and Open Balance $-25.00.'],
 p=[('V1R-58 - steps 3-7 vendor credit line.png', 'A/P Aging Detail, 1-30 days past due opened',
     [('C-13676', G, 'Due Date Nov 1, 2026 (its own date), Past Due 10, $-25.00 and $-25.00.', 'row')])])

K['V1R-59'] = dict(b=[
 'A/P Aging Detail with Current open (28 lines).',
 'After setting the date chip to As of: 11/10/2026 (yesterday), every bucket row is closed.'],
 p=[('V1R-59 - step 5 buckets after date change.png', 'A/P Aging Detail after changing the date to 11/10/2026',
     [('As of', G, 'Date changed to 11/10/2026.', 'text'), ('91 or more||Current (', G, 'Every bucket is closed.', 'span')])])

K['V1R-60'] = dict(b=[
 'A/P Unpaid Invoices lists vendor groups A to Z - #1 Diesel, -1 Diesel, 10 Trucking, 2 Trucking, @Home Towing, A-1 Towing, a1 towing, Abadi\'s Diesel Repair and on (30 loaded) - each with its count in brackets and Total with Amount and Open Balance.',
 'With #1 Diesel open, the line after its last document reads "Total for #1 Diesel", $36.00 $36.00.',
 'The bottom row reads "Totals", $4,763,170.68 $4,762,290.72.'],
 p=[('V1R-60 - step 3 vendor groups.png', 'A/P Unpaid Invoices vendor groups', [('#1 Diesel', G, 'Vendors from A to Z, each with its count and Total.', 'row')]),
    ('V1R-60 - steps 5-6 first vendor open.png', 'A/P Unpaid Invoices, #1 Diesel opened',
     [('Total for', G, 'Total for #1 Diesel: $36.00 $36.00.', 'row')])])

K['V1R-61'] = dict(b=[
 'ZZAUTOTEST AP P61 Mix lists all three documents: bill ZZT-P61-BILL_LATE (Past Due 10), vendor credit C-13677 (Past Due "—") and bill ZZT-P61-BILL_CUR, not yet due, with Past Due -27.'],
 p=[('V1R-61 - steps 3-4 vendor lines.png', 'A/P Unpaid Invoices, vendor ZZAUTOTEST AP P61 Mix opened',
     [('C-13677', G, 'Vendor credit C-13677 is listed.', 'row'), ('BILL_CUR', G, 'The bill not yet due is listed, Past Due -27.', 'row')])])

K['V1R-62'] = dict(b=['ZZAUTOTEST AP P62 Oldest First\'s lines read, top to bottom: Oct 27, 2026, Nov 1, 2026, Nov 6, 2026 - oldest first.'],
 p=[('V1R-62 - steps 3-4 date column.png', 'A/P Unpaid Invoices, vendor ZZAUTOTEST AP P62 Oldest First opened',
     [('Oct 27, 2026||Nov 6, 2026', G, 'Oct 27, Nov 1, Nov 6: oldest at the top.', 'span')])])

K['V1R-63'] = dict(b=['The vendor credit\'s Due Date reads "—".', 'Its Past Due reads "—".'],
 p=[('V1R-63 - steps 3-6 vendor credit line.png', 'A/P Unpaid Invoices, a vendor credit line',
     [('Vendor Credit', G, 'The vendor credit shows "—" for Due Date and for Past Due.', 'row')])])

K['V1R-64'] = dict(b=[
 'Typing in the Vendor chip and picking ZZAUTOTEST AP P60 Alpha leaves only that vendor\'s group on A/P Unpaid Invoices.',
 'After reloading the page, still only ZZAUTOTEST AP P60 Alpha is listed.'],
 p=[('V1R-64 - step 6 groups.png', 'A/P Unpaid Invoices after picking one vendor',
     [('Vendor:', G, 'Vendor chip set to ZZAUTOTEST AP P60 Alpha.', 'text'), ('P60', G, 'Only that vendor\'s group is listed.', 'row')]),
    ('V1R-64 - step 8 groups after reload.png', 'A/P Unpaid Invoices after reloading', [('P60', G, 'After the reload, still only that vendor.', 'row')])])

K['V1R-65'] = dict(b=[
 'Opening A/P Unpaid Invoices with ?vendorName= and &vendorId= for ZZAUTOTEST AP P60 Alpha added to the address lists only that vendor, and the Vendor chip names it ("Vendor: ZZAUTOTEST AP P...").'],
 p=[('V1R-65 - step 5 after opening the saved link.png', 'A/P Unpaid Invoices opened from a saved vendor link',
     [('Vendor:', G, 'The Vendor chip names the vendor from the link.', 'text'), ('P60', G, 'Only that vendor is listed.', 'row')])])

K['V1R-66'] = dict(b=[
 'Clicking bill number ZZT-P60A-BILL in the ZZAUTOTEST AP P60 Alpha group opens its delivery page: Vendor Invoice ZZT-P60A-BILL, invoice date Nov 3, 2026, due date Dec 3, 2026, vendor ZZAUTOTEST AP P60 Alpha, delivery I-1718.'],
 p=[('V1R-66 - steps 3 vendor group open.png', 'A/P Unpaid Invoices, vendor ZZAUTOTEST AP P60 Alpha opened',
     [('ZZT-P60A-BILL', G, 'The bill number is a link.', 'text')]),
    ('V1R-66 - step 4 after clicking the bill No.png', 'The delivery page opened from the bill number',
     [('ZZT-P60A-BILL', G, 'Vendor Invoice ZZT-P60A-BILL: the delivery page of that bill.', 'any'), ('P60 Alpha', G, 'Vendor ZZAUTOTEST AP P60 Alpha.', 'any')])])

K['V1R-67'] = dict(b=[
 'With the vendor\'s group open (1 line), setting the date chip to As of: 11/10/2026 closes every group: no lines are shown.',
 'After opening it again and picking another vendor in the Vendor chip, every group is closed: no lines are shown.'],
 p=[('V1R-67 - step 5 after date change.png', 'A/P Unpaid Invoices after changing the date to 11/10/2026',
     [('As of', G, 'Date changed to 11/10/2026: every group is closed.', 'text')]),
    ('V1R-67 - step 8 after picking W.png', 'A/P Unpaid Invoices after picking another vendor',
     [('Vendor:', G, 'Another vendor picked: every group is closed.', 'text')])])

K['V1R-71'] = dict(b=[
 'Working at Staging Heavy Duty - 9919, opening the work order link shows the prompt "Switch location?": "This work order is in Staging Lethbridge - 4310. Switch your active location to view it?" with Cancel and Switch Location.',
 'After clicking Cancel, the Work Orders list opens with the message "Switch cancelled. Returning to work orders."; the location stays Staging Heavy Duty - 9919.'],
 p=[('V1R-71 - step 2 prompt.png', 'Opening a work order of another location', [('Switch location?||Switch Location', G, '"Switch location?" asks to switch to Staging Lethbridge - 4310.', 'anyspan')]),
    ('V1R-71 - step 2 after Cancel.png', 'After clicking Cancel', [('Switch cancelled', G, '"Switch cancelled. Returning to work orders." on the Work Orders list.', 'any'),
                                                                   ('Staging Heavy', G, 'Still working at Staging Heavy Duty - 9919.', 'top')])])

K['V1R-73'] = dict(b=[
 'On A/R Aging Summary the date chip is labelled "As of".',
 'It shows today: As of: 11/11/2026.',
 'The date menu offers no way to clear the date, and the chip has no clear (x) button.'],
 p=[('V1R-73 - step 3-4 date chip.png', 'A/R Aging Summary date chip', [('As of', G, 'Labelled "As of", showing today, 11/11/2026.', 'text')]),
    ('V1R-73 - step 6 date menu.png', 'A/R Aging Summary with the date menu open', [('As of', G, 'No clear (x) on the chip and no way to empty the date.', 'text')])])

K['V1R-74'] = dict(b=[
 'On A/R Aging Detail, the $8.00 credit memo dated today (ZZAUTOTEST AR R74 Credit Today) is under Current.',
 'The $6.00 credit memo dated yesterday is under 1-30 days past due.',
 'On A/R Aging Collection, the $8.00 credit memo shows Past Due 0.'],
 p=[('V1R-74 - steps 3-6 two credit memos.png', 'A/R Aging Detail, customer ZZAUTOTEST AR R74 Credit Today',
     [('$-8.00', G, 'The $8.00 credit memo dated today is under Current.', 'row'), ('$-6.00', G, 'The $6.00 credit memo dated yesterday is under 1-30 days past due.', 'row')]),
    ('V1R-74 - steps 7-9 collection.png', 'A/R Aging Collection, customer ZZAUTOTEST AR R74 Credit Today',
     [('$-8.00', G, 'The $8.00 credit memo shows Past Due 0.', 'row')])])

K['V1R-75'] = dict(b=[
 'On A/P Aging Detail, the $9.00 vendor credit dated today (ZZAUTOTEST AP P75 Credit Today) is under Current, with Past Due 0.',
 'The $4.00 vendor credit dated yesterday is under 1-30 days past due.'],
 p=[('V1R-75 - steps 3-7 two vendor credits.png', 'A/P Aging Detail, vendor ZZAUTOTEST AP P75 Credit Today',
     [('$-9.00', G, 'The $9.00 vendor credit dated today: under Current, Past Due 0.', 'row'), ('$-4.00', G, 'The $4.00 credit dated yesterday: under 1-30 days past due.', 'row')])])

K['V1R-77'] = dict(b=[
 'Clicking the Total amount of the first customer row (#1 Diesel) leaves you on A/R Aging Summary.',
 'Clicking the customer name #1 Diesel opens A/R Aging Collection, with the Customer chip reading "Customer: #1 Diesel".'],
 p=[('V1R-77 - step 4 after clicking the Total amount.png', 'A/R Aging Summary after clicking a row\'s Total amount', [('A/R Aging Summary', G, 'Still on A/R Aging Summary: the row does not open.', 'text')]),
    ('V1R-77 - step 6 after clicking the customer name.png', 'After clicking the customer name #1 Diesel',
     [('A/R Aging Collection', G, 'A/R Aging Collection opened.', 'text'), ('Customer:', G, 'Narrowed to Customer: #1 Diesel.', 'text')])])

K['V1R-78'] = dict(b=[
 'A/R Aging Summary set to As of: 10/01/2026.',
 'Clicking the customer\'s name opens A/R Aging Collection.',
 'The date chip there reads As of: 10/01/2026.',
 'The Customer chip names the customer ("Customer: ZZAUTOTEST AR R...").'],
 p=[('V1R-78 - steps 5-7 after clicking the customer.png', 'A/R Aging Collection opened from a customer name on A/R Aging Summary',
     [('A/R Aging Collection', G, 'A/R Aging Collection opened.', 'text'), ('As of', G, 'Same date: As of: 10/01/2026.', 'text'), ('Customer:', G, 'The Customer chip names the customer.', 'text')])])

K['V1R-79'] = dict(b=[
 'A/R Aging Detail has no printer button.',
 'The ⋯ button beside the title, labelled "Export report", offers "Download (PDF)" and "Download (CSV)".',
 'Download (PDF) downloads a file, ar-aging-detail.pdf.',
 'The PDF heading reads "A/R Aging Detail", "Staging Foothills Group Inc", "As of Nov 11, 2026", "Locations: All locations".',
 'The bottom of page 1 reads "Software Powered by ShopView" and "Page 1 of 26".'],
 p=[('V1R-79 - step 4 Export menu.png', 'A/R Aging Detail with the Export menu open',
     [('Download (PDF)||Download (CSV)', G, 'Download (PDF) and Download (CSV); no printer button on the page.', 'span')])])

K['V1R-81'] = dict(b=[
 'With the browser offline, choosing Download (PDF) from the Export menu on A/R Aging Summary downloads nothing and shows exactly one message: "We couldn\'t export this report. Please try again."',
 'After going back online, the report is still on screen with its 31 rows, as before.'],
 p=[('V1R-81 - step 6 messages while offline.png', 'A/R Aging Summary, Download (PDF) while offline',
     [('export this report', G, 'One message: "We couldn\'t export this report. Please try again."', 'any')]),
    ('V1R-81 - step 8 report after network back.png', 'A/R Aging Summary after going back online',
     [('Customer', G, 'The report is still there with its rows.', 'row')])])

K['V1R-82'] = dict(b=[
 'A/P Aging Detail holds 13,890 lines (11,935 + 708 + 723 + 496 + 28).',
 'Download (PDF) downloads nothing and shows "This report is too large for PDF. Export it as CSV, or narrow the filters, then try again."',
 'Download (CSV) gives a file with 13,890 document rows, the five bucket counts added up.',
 'On A/R Aging Detail (under 2,000 lines), Download (PDF) still gives a PDF, ar-aging-detail.pdf.'],
 p=[('V1R-82 - step 5 PDF message.png', 'A/P Aging Detail, Download (PDF) with 13,890 lines',
     [('too large', G, '"This report is too large for PDF. Export it as CSV, or narrow the filters, then try again."', 'any')])])

K['V1R-83'] = dict(b=[
 'A/R Aging Summary set to As of: 10/15/2026.',
 'The downloaded PDF reads "A/R Aging Summary", then "Staging Foothills Group Inc", then "As of Oct 15, 2026": the date picked, not the 16th.'],
 p='FRESH')

K['V1R-84'] = dict(b=[
 'On A/R Aging Detail the 1-30 days past due bucket shows (268).',
 'Opening it shows the first 100 lines.',
 'Scrolling to the end brings in the rest: 268 lines in all, the same as the count.',
 'The line after its last document reads "Total for 1-30 days past due", $103,028.88 $101,628.88.'],
 p=[('V1R-84 - step 5 first load.png', 'A/R Aging Detail, 1-30 days past due opened', [('1-30 days past due (', G, 'The bucket shows (268); the first 100 lines load.', 'row')]),
    ('V1R-84 - step 8 end of bucket.png', 'A/R Aging Detail, end of 1-30 days past due', [('1-30 days past due (', G, 'Scrolled to the end of the bucket; its count reads (268).', 'row'), ('Totals', G, 'The Totals row stays at the bottom.', 'row')])])

K['V1R-85'] = dict(b=[
 'On A/R Aging Detail the invoice\'s Transaction Type reads "Invoice".',
 'The credit memo\'s reads "Credit Memo".',
 'The deposit\'s reads "Deposit".',
 'On A/P Aging Detail the bill\'s reads "Invoice".',
 'The vendor credit\'s reads "Vendor Credit".'],
 p=[('V1R-85 - step 4 invoice type.png', 'A/R Aging Detail, an invoice line', [('Invoice', G, 'Transaction Type: Invoice.', 'row')]),
    ('V1R-85 - step 5 credit memo type.png', 'A/R Aging Detail, a credit memo line', [('Credit Memo', G, 'Transaction Type: Credit Memo.', 'row')]),
    ('V1R-85 - step 6 deposit type.png', 'A/R Aging Detail, a deposit line', [('Deposit', G, 'Transaction Type: Deposit.', 'row')]),
    ('V1R-85 - steps 9-10 bill and vendor credit types.png', 'A/P Aging Detail, a bill and a vendor credit',
     [('Vendor Credit', G, 'Transaction Type: Vendor Credit (the bill reads Invoice).', 'row')])])

K['V1R-86'] = dict(b=[
 'In the customer\'s group on A/R Aging Collection, the credit memo dated today reads "Nov 11, 2026", not "Today".',
 'The older invoice reads "Nov 1, 2026", in the same form as before.'],
 p=[('V1R-86 - steps 3-5 dates.png', 'A/R Aging Collection, a customer with a document dated today',
     [('Nov 11, 2026', G, 'Today written out: Nov 11, 2026.', 'row'), ('Nov 1, 2026', G, 'The older date: Nov 1, 2026.', 'row')])])

K['V1R-88'] = dict(b=[
 'With every customer, A/R Aging Collection\'s Totals row reads $513,542.36 Open Balance.',
 'After picking customer ZZAUTOTEST AR R36 Collect X in the Customer chip, its group\'s Open Balance is $110.00 and the Totals row also reads $110.00.',
 'After clearing the Customer chip the Totals row is back to $513,542.36.'],
 p=[('V1R-88 - step 3 totals.png', 'A/R Aging Collection, all customers', [('Totals', G, 'Totals for all customers: $513,542.36.', 'row')]),
    ('V1R-88 - steps 5-6 X picked.png', 'A/R Aging Collection, one customer picked', [('Totals', G, 'Totals now $110.00, the picked customer\'s Open Balance.', 'row')]),
    ('V1R-88 - step 8 chip cleared.png', 'A/R Aging Collection, Customer chip cleared', [('Totals', G, 'Back to $513,542.36.', 'row')])])

K['V1R-89'] = dict(b=[
 'On A/P Unpaid Invoices, ZZAUTOTEST AP P62 Oldest First\'s group is open with bills ZZT-P62-B_OLD, ZZT-P62-B_MID and ZZT-P62-B_NEW.',
 'After clicking the Amount heading, the group stays open and its lines are ordered by Amount: $73.00, $72.00, $71.00.',
 'After setting the date chip to yesterday, every group is closed: no lines are shown.'],
 p=[('V1R-89 - step 5 after sorting by Amount.png', 'A/P Unpaid Invoices after clicking the Amount heading',
     [('B_OLD||B_NEW', G, 'The group stays open, its lines ordered by Amount.', 'span')]),
    ('V1R-89 - step 7 after date change.png', 'A/P Unpaid Invoices after changing the date', [('As of', G, 'Date changed: every group is closed.', 'text')])])

K['V1R-90'] = dict(b=[
 'A/R Aging Collection shows "ZZAUTOTEST AR R90 Many Lines (101)".',
 'Opening it shows the first 100 lines.',
 'Scrolling to the end brings the 101st line: 101 in all.',
 'The line after its last document reads "Total for ZZAUTOTEST AR R90 Many Lines", $-101.00 $-101.00.'],
 p=[('V1R-90 - step 5 first load.png', 'A/R Aging Collection, customer ZZAUTOTEST AR R90 Many Lines opened', [('R90 Many', G, 'The count reads (101); the first 100 lines load.', 'row')]),
    ('V1R-90 - step 8 end of group.png', 'A/R Aging Collection, end of the group', [('R90 Many', G, 'Scrolled to the end of the group; its count reads (101).', 'row'), ('Totals', G, 'Totals $-101.00 $-101.00: every one of the 101 lines.', 'row')])])

K['V1R-91'] = dict(b=[
 'On screen, A/P Aging Summary\'s headings read Vendor, Location, Current, 1-30 Days, 31-60 Days, 61-90 Days, 91 And Over, Total (Location is new by design).',
 'Download (PDF) from the Export menu gives a file, ap-aging-summary.pdf.',
 'The PDF\'s headings are the same as the screen: Vendor, Location, Current, 1-30 Days, 31-60 Days, 61-90 Days, 91 And Over, Total.',
 'Its last row is Totals: $4,247.34, $123,547.02, $268,843.91, $320,924.53, $4,044,727.92, $4,762,290.72.'],
 p='FRESH')

K['V1R-92'] = dict(b=[
 'A/P Aging Detail\'s buckets read, top to bottom: 91 or more days past due, 61-90 days past due, 31-60 days past due, 1-30 days past due, Current.',
 'With 1-30 days past due open, the vendors run A to Z: #1 Diesel, -1 Diesel, 10 Trucking, 2 Trucking, @Home Towing and on.',
 'After clicking the Past Due heading, the largest Past Due comes first (30, 30, 30 ...).'],
 p=[('V1R-92 - step 5 vendor names.png', 'A/P Aging Detail, 1-30 days past due opened', [('#1 Diesel', G, 'Vendor names from A to Z inside the bucket.', 'row')]),
    ('V1R-92 - step 7 after clicking Past Due.png', 'A/P Aging Detail after clicking the Past Due heading', [('Past Due', G, 'Sorted by Past Due, largest first.', 'text')])])

K['V1R-93'] = dict(b=[
 'Clicking C-13679, the vendor credit from a return, opens that vendor return.',
 'The other vendor credit, C-13680, is plain text (no link).',
 'Clicking the bill\'s number opens its delivery page.'],
 p=[('V1R-93 - step 3 every bucket.png', 'A/P Aging Detail, vendor ZZAUTOTEST AP P93 Credit Links, every bucket open',
     [('C-13679', G, 'C-13679 (from a return) is a link.', 'row'), ('C-13680', G, 'C-13680 (not from a return) is plain text.', 'row')]),
    ('V1R-93 - step 4 vendor return opened.png', 'The vendor return opened from C-13679', [('Return', G, 'The vendor return opens.', 'any')]),
    ('V1R-93 - step 7 bill opened.png', 'The delivery page opened from the bill number', [('Delivery', G, 'The bill\'s delivery page opens.', 'any')])])
