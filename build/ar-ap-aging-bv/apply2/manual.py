# Hand-built Setup for the precondition sentences the parser in setup.py does not read on its own.
# Every entry uses only the Book recipes (seen on sv11315, apply2/RECIPES-SEEN.md). Keys are the sentence's opening words.
import re
LONG = 'ZZAUTOTEST Northern Alberta Heavy Haul and Towing Ltd (more than 40 characters)'
NOTHING = None   # the state was seen on the QA site on 10 Nov 2026; nothing to make
R = 'switch on "Reports" in the Page Access card'

def rename(b, X, name):
    b.items = [(t, x.replace(f'type a new Name for {X}', f'type the Name {name}')) for t, x in b.items]
def long_ar(b, X='customer A', credit=True):
    b.customer(X, name=LONG); b.invoice('invoice 1', X, '100.00', None); b.invoice('invoice 2', X, '200.00', None, 'location B')
    if credit: b.credit_memo('credit memo 1', X, '50.00')
def long_ap(b, X='vendor A', credit=True):
    b.vendor(X, name=LONG); b.bill('bill 1', X, '300.00', None); b.bill('bill 2', X, '200.00', None, 'location B')
    if credit: b.vendor_credit('vendor credit 1', X, '50.00')
def three_locs(b, kind, long_c=False):
    b.loc_c(long_c)
    for i, loc in enumerate(['location A', 'location B', 'location C'], 1):
        (b.invoice if kind == 'ar' else b.bill)(f'{"invoice" if kind == "ar" else "bill"} {i}', 'customer A' if kind == 'ar' else 'vendor A', f'{i}00.00', None, loc)
def named(b, l, kind):
    for nm, who, X in re.findall(r'"([^"]+)" \((customer|vendor) ([A-F])\)', l):
        P = f'{who} {X}'
        if kind == 'ar': b.customer(P, name=nm); b.invoice(f'invoice for {P}', P, '100.00', None)
        else: b.vendor(P, name=nm); b.bill(f'bill for {P}', P, '100.00', None)
def many(b, X, kind, n=20, name=None):
    (b.customer if kind == 'ar' else b.vendor)(X, name=name) if name else (b.customer if kind == 'ar' else b.vendor)(X)
    if kind == 'ar':
        b.invoice(f'invoice 1 for {X}', X, '10.00', 45)
        b.add(f'Make {n - 1} more invoices for {X}', f'Same way as invoice 1 for {X}, {n - 1} more times (any amounts, Invoice Date 45 days before today), so {X} has more overdue invoices than fit on the screen.')
    else:
        b.bill(f'bill 1 for {X}', X, '10.00', 45)
        b.add(f'Make {n - 1} more bills for {X}', f'Same way as bill 1 for {X}, {n - 1} more times (any amounts, Invoice Date 45 days before today).')
def role(parts, template=None):
    return lambda b, c: b.role(parts, template)
def tech_admin(b, c):
    b.add('Sign in as an Admin at one location', 'Click the location name and your initials at the top right of the top bar, then Settings, then Staff in the left menu. On the row "Tech ShopView" (it is enrolled at "Staging Heavy Duty - 9919" only) click the edit icon; in Edit Staff Member pick Admin in Role and click Save & Close. '
          'Then Logout, and on the QA site\'s sign-in page click Tech in the quick login panel. After the test, sign in as Admin again and set Tech ShopView\'s Role back to Technician.')
    b.miss('signing in as Tech ShopView after giving it another role')
def by_report(c):
    return 'ap' if re.search(r'\bA/P\b|vendor', c['title'], re.I) else 'ar'

MANUAL = {
 # ---- already true on the QA site on 10 Nov 2026 (documents at both locations, rows in every report) ----
 'Have open documents in these reports at two locations': NOTHING, 'Have open documents in this report on today\'s date at two locations': NOTHING,
 'Have open documents in this report at two locations': NOTHING, 'Make sure the organization has open documents in this report at your current location and location B': NOTHING,
 'Make sure the report has open invoices on today\'s date, so the PDF has rows.': NOTHING,
 'Have a customer with an overdue invoice and a vendor with an overdue bill on today\'s date': NOTHING,
 'Have a customer with an open invoice and a vendor with an open bill on today\'s date': NOTHING,
 'Open the design picture': NOTHING, 'Open the ShopView home page.': NOTHING,
 'Sign in as an Admin user (the "Admin" role), with location A as your current location.': lambda b, c: b.add(*__import__('setup').LOCS),
 'Make sure the report has more than 30 customers': lambda b, c: b.miss('more than 30 customers with open documents at both locations on today\'s and yesterday\'s date (not counted on this build)'),
 'Make sure the report has more than 30 vendors': lambda b, c: b.miss('more than 30 vendors with open documents at both locations on today\'s and yesterday\'s date (not counted on this build)'),
 # ---- long names ----
 'Have a customer with a long name (more than 40 characters) and open documents at both locations': lambda b, c: long_ar(b),
 'Have a customer, customer A, with a long name (more than 40 characters) and open documents at both locations': lambda b, c: long_ar(b),
 'Have a vendor with a long name (more than 40 characters) and open documents at both locations': lambda b, c: long_ap(b),
 'Have a vendor, vendor A, with a long name (more than 40 characters) and open documents at both locations': lambda b, c: long_ap(b),
 'Have a customer, customer A, with open invoices on today\'s date and a long name': lambda b, c: (b.customer('customer A', name=LONG), b.invoice('invoice 1', 'customer A', '100.00', None)),
 'Have a customer, customer A, with a long name, an overdue invoice, a phone number and a credit term.': lambda b, c: (b.customer('customer A', name=LONG), b.invoice('invoice 1', 'customer A', '100.00', 45)),
 'Make sure the report lists customers at both locations on today\'s date, including at least one with a credit balance': lambda b, c: (b.customer('customer A', name=LONG), b.invoice('invoice 1', 'customer A', '100.00', None), b.credit_memo('credit memo 1 (the only document of customer B)', 'customer B', '80.00', None, 'location B')),
 'Make sure vendor A and vendor B both have long names.': lambda b, c: (rename(b, 'vendor A', LONG), rename(b, 'vendor B', 'ZZAUTOTEST Southern Alberta Fleet Parts and Supply Co (more than 40 characters)')),
 # ---- parties with documents at one or both locations ----
 'Have a customer, customer A, with open documents at both locations.': lambda b, c: (b.invoice('invoice 1', 'customer A', '100.00', None), b.invoice('invoice 2', 'customer A', '200.00', None, 'location B')),
 'Have a vendor, vendor A, with open documents at both locations.': lambda b, c: (b.bill('bill 1', 'vendor A', '100.00', None), b.bill('bill 2', 'vendor A', '200.00', None, 'location B')),
 'Have a customer, customer A, with open invoices only at location A.': lambda b, c: b.invoice('invoice 1 for customer A', 'customer A', '100.00', None),
 'Have a customer, customer B, with open invoices at location A and location B.': lambda b, c: (b.invoice('invoice 1 for customer B', 'customer B', '100.00', None), b.invoice('invoice 2 for customer B', 'customer B', '200.00', None, 'location B')),
 'Have a vendor, vendor A, with open bills only at location A.': lambda b, c: b.bill('bill 1 for vendor A', 'vendor A', '100.00', None),
 'Have a vendor, vendor B, with open bills at location A and location B.': lambda b, c: (b.bill('bill 1 for vendor B', 'vendor B', '100.00', None), b.bill('bill 2 for vendor B', 'vendor B', '200.00', None, 'location B')),
 'Have a vendor, vendor A, with an unpaid bill at your other location.': lambda b, c: b.bill('bill 1 for vendor A', 'vendor A', '100.00', None, 'location B'),
 'Have a vendor, vendor B, with unpaid bills at your current location.': lambda b, c: b.bill('bill 1 for vendor B', 'vendor B', '200.00', None),
 'Have a customer, customer A, with an open invoice made at your other location, more than 90 days past due.': lambda b, c: b.invoice('invoice for customer A', 'customer A', '100.00', 130, 'location B'),
 'Have a customer, customer B, with an unused credit memo at your current location, more than 90 days past due.': lambda b, c: b.credit_memo('credit memo for customer B', 'customer B', '50.00', 100),
 'Have a customer, customer C, with an open invoice at your current location, more than 90 days past due.': lambda b, c: b.invoice('invoice for customer C', 'customer C', '300.00', 130),
 # ---- three locations ----
 'Have open documents in A/R Detail on today\'s date at three locations': lambda b, c: three_locs(b, 'ar'),
 'Make sure the organization has open documents at three locations': lambda b, c: three_locs(b, by_report(c)),
 'Make sure the organization has open A/R documents at three locations, location A, location B and location C; in A to Z order': lambda b, c: three_locs(b, 'ar'),
 'Make sure the organization has open A/R documents at three locations, location A, location B and location C; location C\'s name is longer': lambda b, c: three_locs(b, 'ar', True),
 'Make sure the organization has open A/R documents at three locations, your current location': lambda b, c: three_locs(b, 'ar'),
 'Make sure the organization has open A/P documents at three locations': lambda b, c: three_locs(b, 'ap'),
 # ---- part sales ----
 'Have a customer with an open part sale invoice A made at location B.': lambda b, c: b.part_sale('part sale invoice A', 'customer A', '300.00', None, 'location B'),
 'Have a customer with an overdue work order invoice A and an overdue part sale invoice B, both made at your current location.': lambda b, c: (b.invoice('work order invoice A', 'customer A', '300.00', 45), b.part_sale('part sale invoice B', 'customer A', '300.00', 45)),
 'Have a customer with an open work order invoice A and an open part sale invoice B, both made at your current location.': lambda b, c: (b.invoice('work order invoice A', 'customer A', '300.00', None), b.part_sale('part sale invoice B', 'customer A', '300.00', None)),
 'Have a customer with an overdue part sale invoice A made at your current location.': lambda b, c: b.part_sale('part sale invoice A', 'customer A', '300.00', 45),
 # ---- vendor credits ----
 'Have a vendor with three unused vendor credits': lambda b, c: (b.bill('bill 1', 'vendor A', '300.00', None), b.vendor_credit('vendor credit A', 'vendor A', '40.00'), b.bill('bill 2', 'vendor A', '300.00', None, 'location B'), b.vendor_credit('vendor credit B', 'vendor A', '50.00', None, 'location B'), b.vendor_credit('vendor credit C', 'vendor A', '60.00', None, None, from_return=False)),
 'Have a vendor, vendor A, with two unused vendor credits': lambda b, c: (b.bill('bill 1', 'vendor A', '300.00', None, 'location B'), b.vendor_credit('vendor credit A', 'vendor A', '40.00', None, 'location B'), b.vendor_credit('vendor credit B', 'vendor A', '50.00', None, None, from_return=False)),
 'Have a vendor with an unpaid bill A received at your current location and an unused vendor credit A': lambda b, c: (b.bill('bill A', 'vendor A', '300.00', None), b.vendor_credit('vendor credit A', 'vendor A', '50.00')),
 'Have a vendor with an unpaid bill A received at your current location.': lambda b, c: b.bill('bill A', 'vendor A', '300.00', None),
 'Have a vendor with an unused vendor credit, vendor credit A, dated an earlier day, date A.': lambda b, c: b.vendor_credit('vendor credit A', 'vendor A', '50.00', 5),
 'Have a vendor with one unused vendor credit, vendor credit A, on today\'s date.': lambda b, c: b.vendor_credit('vendor credit A', 'vendor A', '50.00'),
 'Have a vendor, vendor A, with two overdue bills, bill A (due 10 days ago) and bill B (due 20 days ago), and one unused vendor credit': lambda b, c: (b.bill('bill A', 'vendor A', '300.00', 40), b.bill('bill B', 'vendor A', '200.00', 50), b.vendor_credit('vendor credit A', 'vendor A', '50.00')),
 'Have a vendor with an unpaid bill A and an unused vendor credit A, both dated 10 days ago, with bill A due the same day': lambda b, c: (b.miss('a bill that falls due on its own date (vendor Credit Terms other than Net 30 were not tried)'), b.bill('bill A', 'vendor A', '300.00', 10), b.vendor_credit('vendor credit A', 'vendor A', '50.00', 10)),
 'Have a vendor, vendor A, with more unpaid bills than fit on the screen at your location, a long name, and an unused vendor credit A': lambda b, c: (many(b, 'vendor A', 'ap', name=LONG), b.vendor_credit('vendor credit A', 'vendor A', '5.00')),
 # ---- credit memos and deposits ----
 'Have a customer with an unused credit memo, credit memo A, and an unused deposit, deposit A, both dated the same earlier day, date A.': lambda b, c: (b.credit_memo('credit memo A', 'customer A', '50.00', 5), b.deposit('deposit A', 'customer A', '40.00', None, 5)),
 'Have a customer, customer A, with an unused credit memo, credit memo A, dated an earlier day, date A.': lambda b, c: b.credit_memo('credit memo A', 'customer A', '50.00', 5),
 'Have a customer with an open invoice A, an unused credit memo A and an unused deposit A, all dated 10 days ago, with invoice A due the same day': lambda b, c: (b.invoice('invoice A', 'customer A', '300.00', 10, None, None, due_same_day=True), b.credit_memo('credit memo A', 'customer A', '50.00', 10), b.deposit('deposit A', 'customer A', '40.00', None, 10)),
 'Have a customer with an open invoice A, an unused credit memo A and an unused deposit A.': lambda b, c: (b.invoice('invoice A', 'customer A', '300.00', None), b.credit_memo('credit memo A', 'customer A', '50.00'), b.deposit('deposit A', 'customer A', '40.00')),
 'Have a customer with an unused credit memo A and an unused deposit A at your current location.': lambda b, c: (b.credit_memo('credit memo A', 'customer A', '50.00'), b.deposit('deposit A', 'customer A', '40.00')),
 'Have a customer with only an unused credit memo, credit memo A, of $150.00.': lambda b, c: b.credit_memo('credit memo A', 'customer A', '150.00'),
 'Have a new customer (created for this test) that has, on today\'s date, an invoice A made at location A for $500.00 and partly paid ($200.00) by a payment taken at location B': lambda b, c: (
     b.invoice('invoice A', 'customer A', '500.00', None),
     b.add('Pay $200.00 of invoice A at location B', 'While switched to location B (see the Locations to use item): on customer A\'s page click New Payment, type 200 in the Payment box on invoice A\'s row, pick a Payment Method, then click Make Payment.'),
     b.credit_memo('credit memo A', 'customer A', '50.00', None, 'location B'), b.deposit('deposit A', 'customer A', '40.00', 'location B')),
 'Have a new customer (created for this test), customer A, with an invoice of $100.00 paid $120.00 (overpaid)': lambda b, c: (b.invoice('invoice 1', 'customer A', '100.00', None, None, '120.00'), b.miss('paying more than an invoice\'s balance'), b.invoice('invoice B', 'customer A', '500.00', None)),
 # ---- dates and buckets ----
 'Have a customer with three open invoices, each due 30 days after its own date': lambda b, c: [b.invoice(f'invoice {d}', 'customer A', a, n) for d, a, n in (('A', '100.00', None), ('B', '200.00', 1), ('C', '300.00', 2))],
 'Have a vendor with three open bills, each due 30 days after its own date': lambda b, c: [b.bill(f'bill {d}', 'vendor A', a, n) for d, a, n in (('A', '100.00', None), ('B', '200.00', 1), ('C', '300.00', 2))],
 'Have a vendor with two unpaid bills on today\'s date: bill A due 9 days after today and bill B due today.': lambda b, c: (b.bill('bill A', 'vendor A', '100.00', 21), b.bill('bill B', 'vendor A', '200.00', 30)),
 'Have a customer, customer A, with three overdue invoices: invoice A at location B dated 40 days ago': lambda b, c: [b.invoice(f'invoice {d}', 'customer A', a, n, loc, None, due_same_day=True) for d, a, n, loc in (('A', '100.00', 40, 'location B'), ('B', '200.00', 20, None), ('C', '300.00', 30, None))],
 'Have a customer with an open invoice, invoice A, dated date A and due 30 days later.': lambda b, c: b.invoice('invoice A', 'customer A', '100.00', 'date A'),
 'Have a customer, customer A, with open invoices on an earlier date, date A.': lambda b, c: (b.invoice('invoice 1', 'customer A', '100.00', 20), b.add('Date A', 'Use the date 10 days before today as date A (invoice 1 was already open then).')),
 'Have a new customer (created for this test), customer A, with two overdue invoices on today\'s date: invoice A, dated a day you note as date A': lambda b, c: (b.invoice('invoice A', 'customer A', '1250.50', 75), b.invoice('invoice B', 'customer A', '75.00', 45), b.add('Date A', 'Note invoice A\'s Invoice Date (75 days before today) as date A.')),
 'Have a new vendor (created for this test), vendor A, with two overdue bills on today\'s date: bill A, dated a day you note as date A': lambda b, c: (b.bill('bill A', 'vendor A', '1250.50', 75), b.bill('bill B', 'vendor A', '75.00', 45), b.add('Date A', 'Note bill A\'s Invoice Date (75 days before today) as date A.')),
 'Have a new customer (created for this test), customer A, with open invoices on today\'s date of $1,250.50 that is 1 to 30 days past due and $99.00': lambda b, c: (b.invoice('invoice 1', 'customer A', '1250.50', 45), b.invoice('invoice 2', 'customer A', '99.00', 130)),
 'Have a new vendor (created for this test), vendor A, with open bills on today\'s date of $1,250.50 that is 1 to 30 days past due and $99.00': lambda b, c: (b.bill('bill 1', 'vendor A', '1250.50', 45), b.bill('bill 2', 'vendor A', '99.00', 130)),
 'Have a new customer (created for this test) with eight open invoices on today\'s date': lambda b, c: [b.invoice(f'invoice {i}', 'customer A', a, n) for i, (a, n) in enumerate([('10.00', None)] + [(f'{d}.00', d + 30) for d in (1, 30, 31, 60, 61, 90, 91)], 1)],
 'Have a new vendor (created for this test) with eight open bills on today\'s date': lambda b, c: [b.bill(f'bill {i}', 'vendor A', a, n) for i, (a, n) in enumerate([('10.00', None)] + [(f'{d}.00', d + 30) for d in (1, 30, 31, 60, 61, 90, 91)], 1)],
 'Have a new customer (created for this test), customer A, with one open invoice, invoice A, of $500.00 on today\'s date': lambda b, c: b.invoice('invoice A', 'customer A', '500.00', None),
 'Have a new vendor (created for this test), vendor A, with exactly 101 unpaid bills of $10.00 each': lambda b, c: (b.bill('bill 1', 'vendor A', '10.00', 45), b.add('Make bills 2 to 101', 'Same way as bill 1, 100 more times: Cost 10.00, Invoice Date 45 days before today, a different Vendor Invoice # each time.')),
 'Have five new customers (created for this test)': lambda b, c: [b.invoice(f'invoice for customer {x}', f'customer {x}', f'{i}00.00', None) for i, x in enumerate('ABCDE', 1)],
 'Have open documents on today\'s date (invoices, credit memos and deposits) in the "31-60 days past due" and "1-30 days past due" buckets': lambda b, c: (
     [b.invoice(f'invoice {i}', 'customer A', a, n) for i, (a, n) in enumerate((('400.00', 70), ('250.00', 80), ('300.00', 40), ('150.00', 50)), 1)],
     b.credit_memo('credit memo 1', 'customer A', '60.00', 40), b.credit_memo('credit memo 2', 'customer A', '70.00', 20),
     b.miss('deposits in those buckets (the part of a deposit left over is dated the day its invoice is made)')),
 'Have open documents on today\'s date (bills and vendor credits) in the "31-60 days past due" and "1-30 days past due" buckets': lambda b, c: (
     [b.bill(f'bill {i}', 'vendor A', a, n) for i, (a, n) in enumerate((('400.00', 70), ('250.00', 80), ('300.00', 40), ('150.00', 50)), 1)],
     b.vendor_credit('vendor credit 1', 'vendor A', '60.00', 40), b.vendor_credit('vendor credit 2', 'vendor A', '70.00', 20)),
 'Make sure the report has open invoices, credit memos and deposits in at least three aging buckets': lambda b, c: (b.invoice('invoice 1', 'customer A', '100.00', None), b.invoice('invoice 2', 'customer A', '200.00', 45), b.invoice('invoice 3', 'customer A', '300.00', 75), b.credit_memo('credit memo 1', 'customer A', '50.00', 20), b.deposit('deposit 1', 'customer A', '40.00')),
 'Make sure the report has open bills and vendor credits in at least three aging buckets': lambda b, c: (b.bill('bill 1', 'vendor A', '100.00', None), b.bill('bill 2', 'vendor A', '200.00', 45), b.bill('bill 3', 'vendor A', '300.00', 75), b.vendor_credit('vendor credit 1', 'vendor A', '50.00', 20)),
 'Have two customers with open invoices on today\'s date and different totals': lambda b, c: (b.invoice('invoice for customer A', 'customer A', '100.00', None), b.invoice('invoice for customer B', 'customer B', '250.00', None)),
 'Have two vendors with open bills on today\'s date and different totals': lambda b, c: (b.bill('bill for vendor A', 'vendor A', '100.00', None), b.bill('bill for vendor B', 'vendor B', '250.00', None)),
 'Have a customer, customer A, with open invoices on today\'s date.': lambda b, c: b.invoice('invoice 1', 'customer A', '100.00', None),
 'Have a vendor, vendor A, with unpaid bills on today\'s date.': lambda b, c: b.bill('bill 1', 'vendor A', '100.00', None),
 'Have a customer, customer A, with an overdue invoice, a phone number and a credit term.': lambda b, c: b.invoice('invoice 1', 'customer A', '100.00', 45),
 'Have a customer, customer A, with an overdue invoice and no phone number': lambda b, c: (b.customer('customer A', phone=False), b.invoice('invoice for customer A', 'customer A', '100.00', 45)),
 'Have a customer, customer B, with an overdue invoice and no phone.': lambda b, c: (b.customer('customer B', phone=False), b.invoice('invoice for customer B', 'customer B', '200.00', 45)),
 'Make sure customer A, first in name order, has an overdue invoice, an unused credit memo': lambda b, c: (b.customer('customer A', name='000 ZZAUTOTEST First Customer (a name that sorts first)'), b.invoice('invoice 1', 'customer A', '100.00', 45), b.credit_memo('credit memo 1', 'customer A', '50.00')),
 'Make sure that on today\'s date the report has two customers next to each other in name order': lambda b, c: (many(b, 'customer A', 'ar', name='ZZAUTOTEST Call List A'), many(b, 'customer B', 'ar', name='ZZAUTOTEST Call List B')),
 'Make sure that on today\'s date the report has a customer, customer A, with more overdue invoices than fit on the screen': lambda b, c: many(b, 'customer A', 'ar'),
 'Make sure that at least ten customers have overdue invoices on today\'s date': lambda b, c: (b.invoice('invoice for customer 1', 'customer 1', '100.00', 45), b.add('Make customers 2 to 10', 'Same way as customer 1 and its invoice, nine more times (a new Name, a Phone and Credit Terms "Net 30" each), so ten customers have an overdue invoice.')),
 # ---- names ----
 'Have four customers with open invoices on today\'s date, named': lambda b, c: named(b, c['_line'], 'ar'),
 'Have four vendors with open bills on today\'s date, named': lambda b, c: named(b, c['_line'], 'ap'),
 'Have six customers with open invoices on today\'s date, named': lambda b, c: named(b, c['_line'], 'ar'),
 'Have six vendors with open bills on today\'s date, named': lambda b, c: named(b, c['_line'], 'ap'),
 'Have two customers with open invoices on today\'s date, whose names differ only in capitals': lambda b, c: [(b.customer(X, name=n), b.invoice(f'invoice for {X}', X, '100.00', None)) for X, n in (('customer A', 'ZZAUTOTEST Capital Test'), ('customer B', 'ZZAUTOTEST CAPITAL TEST'))],
 'Have two vendors with open bills on today\'s date, whose names differ only in capitals': lambda b, c: [(b.vendor(X, name=n), b.bill(f'bill for {X}', X, '100.00', None)) for X, n in (('vendor A', 'ZZAUTOTEST Capital Test'), ('vendor B', 'ZZAUTOTEST CAPITAL TEST'))],
 'Have two customers with open invoices on today\'s date whose names differ only by an accent': lambda b, c: [(b.customer(X, name=n), b.invoice(f'invoice for {X}', X, '100.00', None)) for X, n in (('customer A', 'Emile\'s Towing'), ('customer B', 'Émile\'s Towing'))],
 'Have four customers with open invoices on today\'s date: customer A, customer B, customer C and customer D. After the same first words': lambda b, c: [(b.customer(X, name=n), b.invoice(f'invoice for {X}', X, '100.00', None)) for X, n in (('customer A', 'ZZAUTOTEST Fleet #1'), ('customer B', 'ZZAUTOTEST Fleet -1'), ('customer C', 'ZZAUTOTEST Fleet 1'), ('customer D', 'ZZAUTOTEST Fleet @1'))],
 'Have a new customer (created for this test), customer A, with only these open documents on today\'s date: an invoice A of $500.00, 20 days past due, and an unused credit memo A of $120.00 dated today.': lambda b, c: (b.invoice('invoice A', 'customer A', '500.00', 50), b.credit_memo('credit memo A', 'customer A', '120.00')),
 'Have a new vendor (created for this test), vendor A, with only these open documents on today\'s date: a bill A of $500.00, 20 days past due, and an unused vendor credit A of $120.00 dated today.': lambda b, c: (b.bill('bill A', 'vendor A', '500.00', 50), b.vendor_credit('vendor credit A', 'vendor A', '120.00')),
 # ---- roles and sign-in ----
 'Sign in as a user whose custom role has "Reports" in the Page Access card but not "Vendor and order management': role(f'{R} (leave everything else off)'),
 'Sign in as a user whose custom role has "Reports" in the Page Access card and nothing else, with "See Financial Data" off.': role(f'{R}, and leave "See Financial Data" and everything else off'),
 'Sign in as a user whose custom role has every permission except "Reports"': role('switch off "Reports" in the Page Access card', 'Admin'),
 'Sign in as a user whose custom role has "Reports" in the Page Access card, "Invoicing & payments → View", "Work orders → View" but not "Part sales': role(f'{R}, tick View in the "Invoicing & payments" card and View in the "Work orders" card, and leave the Parts Department switch off'),
 'Sign in as a user whose custom role has "Reports" in the Page Access card, "Work orders → View", "Part sales → View"': role(f'{R}, tick View in the "Work orders" card, switch on Parts Department and tick View in "Part sales", and leave "Invoicing & payments" unticked'),
 'Sign in as a user whose custom role has "Reports" in the Page Access card, "Invoicing & payments → View", "Part sales → View"': role(f'{R}, tick View in the "Invoicing & payments" card, switch on Parts Department and tick View in "Part sales", and leave "Work orders" unticked'),
 'Sign in as a user whose custom role has "Reports" in the Page Access card, "Vendor and order management → View"': role(f'{R}, switch on Parts Department and tick View (not Create & Edit) in "Vendor and order management"'),
 'Sign in as a user whose custom role has "Reports" in the Page Access card, "Vendor and order management → Create & Edit"': lambda b, c: (b.role(f'{R}, switch on Parts Department and tick Create & Edit (not View) in "Vendor and order management"'), b.miss('ticking Create & Edit without View in a custom role')),
 'Sign in as a user whose custom role has "Reports" in the Page Access card and "Customers → View".': role(f'{R} and tick View in the Customers card'),
 'Sign in as a user whose custom role has "Reports" in the Page Access card but not "Customers → View".': role(f'{R} and leave the Customers card unticked'),
 'Sign in as a user whose custom role has "Reports" in the Page Access card and the "View and Manage AP/AR Data" switch off.': role(f'{R} and leave "View and Manage AP/AR Data" off'),
 'Sign in as an "Admin" user enrolled at one location only.': tech_admin,
 'Have a customer with an open invoice A made at another location, one this user is not enrolled in.': lambda b, c: b.invoice('invoice A', 'customer A', '100.00', None, 'location B'),
 'Open a link to a work order made at location B': lambda b, c: (b.add(*__import__('setup').LOCS), b.add('Make a work order at location B', 'While switched to location B: open the page of any customer that has an asset (its Assets tab lists one), click New Work Order, pick the Asset and click Save; copy the work order\'s address from the address bar, then switch back to location A.')),
}
