# A/R and A/P Aging Reports, sv11315, 10 Nov 2026 — pass 2: a separate, plain Setup list (Rule 119) for each test whose
# starting state has to be made, built ONLY from that test's own preconditions. Every click named here was seen on
# v26.45.2-6a8b89c this pass (apply2/RECIPES-SEEN.md, probes 09-57). Anything a sentence needs that was NOT seen is
# returned as `unseen` and goes on the test's "Partly checked" line, never guessed.
import re, html
ME = 'the location name and your initials at the top right of the top bar'
LOC_NAME = {'location A': 'Staging Heavy Duty - 9919', 'location B': 'Staging Lethbridge - 4310', 'your current location': 'Staging Heavy Duty - 9919', 'your other location': 'Staging Lethbridge - 4310'}
LOCS = ('Locations to use', 'Use "Staging Heavy Duty - 9919" as location A (it comes first in A to Z order) and "Staging Lethbridge - 4310" as location B. '
        f'To work at location B, click {ME}, then Change Location, then "Staging Lethbridge - 4310"; switch back to "Staging Heavy Duty - 9919" the same way when you are done.')
LINE = lambda amount: f'type a Title, pick Labor Rate "Fixed Line Total" (type "Fixed" in the box to find it), type {num(amount)} in Fixed Line Total, tick Line Approved, then click Save & Close.'
FINISH = ('On the line click Complete; in Tech stories type a story and click Complete All Lines (if Missing Details asks for Mileage, type it and click Complete All Lines again). '
          'Open the Finance tab and click Mark Reviewed (if a window asks for the VIN, type one and click Confirm Review).')
UNPAID = 'reload the page (F5) so the invoice stays unpaid. Do not close that window with its ×: that takes the new invoice away again.'

def cap(x): return x[0].upper() + x[1:]
def num(a): return a.replace(',', '')

def at(loc):
    if loc in (None, 'location A', 'your current location'): return ''
    if loc in ('location B', 'your other location'): return 'While switched to location B (see "Locations to use"): '
    if loc == 'location C': return 'While switched to location C (see "Make location C"): '
    raise ValueError(loc)

def when(days_ago, label):
    if isinstance(days_ago, str): return f'type {days_ago} in {label}'
    if days_ago is None or days_ago == 0: return f'type today\'s date in {label}'
    return f'type the date {days_ago} days before today in {label}'

class Book:
    """Collects Setup items in order, writing the long click-path once and then 'same way as …'."""
    def __init__(s): s.items, s.unseen, s.parties, s.full = [], [], {}, {}
    def add(s, t, b):
        if t not in [x[0] for x in s.items]: s.items.append((t, b))
    def miss(s, u):
        if u not in s.unseen: s.unseen.append(u)
    # ---------- parties ----------
    def customer(s, X, name=None, phone=True, due_on_receipt=False):
        if X in s.parties: return
        s.parties[X] = 'customer'
        nm = f'type the Name {name}' if name else f'type a new Name for {X}'
        ph = ', type a Phone' if phone else ' (leave Phone empty)'
        s.add(f'Make {X}', f'Click Customers in the top bar, then New Customer. {cap(nm)}{ph}, then click Save. '
              f'On the customer\'s page click the edit icon beside the name; in Edit Customer pick Credit Terms "Net 30", pick Taxes "Exempt (0%)" and type 0 in Default Shop Supplies (so totals stay exact), then click Save. '
              'Click Add Contact, type a First name and Last name, then click Save. On the Assets tab click New Asset, pick the Contact, fill Make and the other boxes the window marks as required, then click Save.')
    def vendor(s, X, name=None):
        if X in s.parties: return
        s.parties[X] = 'vendor'
        nm = f'type the Name {name}' if name else f'type a new Name for {X}'
        s.add(f'Make {X}', f'Click Parts in the top bar, then Vendors in the left menu, then New Vendor. {nm[0].upper() + nm[1:]}, pick Credit Terms "Net 30" and Taxes "Exempt (0%)", then click Save & Close.')
    # ---------- A/R documents ----------
    def invoice(s, doc, X, amount, days_ago=None, loc=None, paid=None, due_same_day=False):
        s.customer(X)
        if loc in ('location B', 'your other location'): s.add(*LOCS)
        terms = ''
        if due_same_day:
            terms = (f'First set {X}\'s Credit Terms to "Due on Receipt" (edit icon beside the name, Edit Customer, Save), so this invoice falls due on its own date; '
                     'set them back to "Net 30" right after. ')
        pay = (f'type {num(paid)} in the Payment box on this invoice\'s row, pick a Payment Method, then click Make Payment.' if paid else UNPAID)
        if 'invoice' not in s.full:
            s.full['invoice'] = doc
            body = (f'{at(loc)}{terms}On {X}\'s page click New Work Order, pick the Asset, then click Save (click Ok if a Customer Notes window opens). In the New Line window {LINE(amount)} '
                    f'{FINISH} {cap(when(days_ago, "Invoice Date"))}, then click Create Invoice. When the New Customer Payment window opens, {pay}')
        else:
            body = (f'{at(loc)}{terms}Same way as {s.full["invoice"]}, on {X}\'s page: Fixed Line Total {num(amount)}; {when(days_ago, "Invoice Date")}; '
                    f'then in the New Customer Payment window {pay[0].lower() + pay[1:]}')
        s.add(f'Make {doc}', body)
    def credit_memo(s, doc, X, amount, days_ago=None, loc=None):
        s.customer(X)
        if loc in ('location B', 'your other location'): s.add(*LOCS)
        s.add(f'Make {doc}', f'{at(loc)}On {X}\'s page open the Invoices tab and click Issue Credit. {cap(when(days_ago, "Credit Date"))}, type {num(amount)} in Amount, '
              'click Issue Store Credit (not Issue Refund), type a Reason, then click Issue Credit.')
    def deposit(s, doc, X, amount, loc=None, days_ago=None):
        s.customer(X)
        if loc in ('location B', 'your other location'): s.add(*LOCS)
        cents = float(amount.replace('$', '').replace(',', '')); dep = f'{cents + 1:,.2f}'
        s.add(f'Make {doc}', f'{at(loc)}On {X}\'s page click New Work Order, pick the Asset, click Save, and close the New Line window. Open the Finance tab and click Add Deposit; '
              f'in Create Deposit pick a Payment Method and type {dep} in Deposit Amount, then click Record Deposit. Open the Lines tab and click New Line; in the New Line window {LINE("1.00")} '
              f'{FINISH} Leave Invoice Date as today, click Create Invoice, and reload the page (F5) when the New Customer Payment window opens. '
              f'The invoice is paid from the deposit, and the rest, {amount}, stays as an unused deposit dated today.')
        if days_ago: s.miss('an unused deposit dated an earlier day (the part of a deposit left over is dated the day its invoice is made)')
    def part_sale(s, doc, X, amount='300.00', days_ago=None, loc=None):
        s.customer(X)
        if loc in ('location B', 'your other location'): s.add(*LOCS)
        s.add(f'Make {doc}', f'{at(loc)}Click Parts in the top bar, then Part Sales in the left menu, then New Part Sale; pick {X} in Customer and click Save. Click Add Part: in Part Number type a new part number and click "Add new special order part: …", '
              f'type a Description, 1 in Quantity and a Cost, then click Save & Close; on the part\'s row type {num(amount)} in the Sell Price box. Click Authorize. On the part\'s row pick any Vendor and click Order (the status reads Awaiting), '
              'then click Receive on the row; tick the part, type a Vendor Invoice Number and click Receive Parts (1) (the status reads Received). '
              f'Open the Finance tab, {when(days_ago, "Invoice Date")}, then click Create Invoice; reload the page when the New Customer Payment window opens.')
        if loc in ('location B', 'your other location'): s.miss('a part sale made at location B')
    # ---------- A/P documents ----------
    def bill(s, doc, X, amount, days_ago=None, loc=None, paid=None):
        s.vendor(X)
        if loc in ('location B', 'your other location'): s.add(*LOCS)
        if 'bill' not in s.full:
            s.full['bill'] = doc
            body = (f'{at(loc)}Click Parts in the top bar, then Purchase Orders in the left menu, then New PO. Pick {X} in Vendor. In Part Number type a new part number and click "Add new special order part: …"; '
                    f'type a Description, 1 in Quantity and {num(amount)} in Cost; click Add, then Save & Close. In the Purchase Orders list click Receive on that order (Vendor column: {X}); '
                    f'type a Vendor Invoice # (for example "{doc}"), {when(days_ago, "Invoice Date")}, type 0 in Tax, then click Receive Parts (1).')
        else:
            body = f'{at(loc)}Same way as {s.full["bill"]}, with {X} in Vendor: Cost {num(amount)}; {when(days_ago, "Invoice Date")}.'
        s.add(f'Make {doc}', body)
        s.bills = getattr(s, 'bills', {}); s.bills.setdefault((X, loc or 'location A'), doc)
        if paid: s.miss('paying part of a bill to a vendor')
    def vendor_credit(s, doc, X, amount, days_ago=None, loc=None, from_return=True):
        s.vendor(X)
        if not from_return:
            s.add(f'Make {doc}', f'Make {doc} for {X} without a vendor return.'); s.miss('a vendor credit entered directly, not from a vendor return'); return
        if loc in ('location B', 'your other location'): s.add(*LOCS)
        bills = getattr(s, 'bills', {}); src = bills.get((X, loc or 'location A'))
        if not src:
            src = f'a bill for {X} to return a part from'
            s.bill(src, X, '500.00', 0, loc); s.miss(f'a vendor credit for a vendor with no bill of its own: the part to return comes from an extra bill, which stays open')
        s.add(f'Make {doc}', f'{at(loc)}Click Parts in the top bar, then Returns in the left menu, then Create Return. Pick {X} in Vendor, type a Packaging Slip, pick the part received on {src} in Part Number, '
              f'type {num(amount)} in Price Per Unit, then click Save Return. In the Returns list tick that return and click Receive Credit; type a Credit Memo Number, {when(days_ago, "Credit Date")}, type 0 in Tax, then click Post Credit.')
    # ---------- roles ----------
    def role(s, parts, template=None):
        tpl = f'click {template}, then Apply' if template else 'click Skip (every switch then starts off)'
        s.add('Make the role for this test', f'Click {ME}, then Settings, then Roles & Permissions in the left menu, then Create Custom Role. In "Choose a template" {tpl}. Type a Role Name, then {parts}, then click Create.')
        s.add('Sign in with that role', f'Click {ME}, then Settings, then Staff in the left menu. On the row "Tech ShopView" click the edit icon; in Edit Staff Member pick the new role in Role and click Save & Close. '
              f'Then click {ME}, then Logout, and on the QA site\'s sign-in page click Tech in the quick login panel. After the test, sign in as Admin again and set Tech ShopView\'s Role back to Technician.')
        s.miss('signing in as Tech ShopView after giving it another role')
    def loc_c(s, long_name=False):
        nm = 'a Name longer than the Location chip can show (for example "ZZAUTOTEST Location C with a very long name")' if long_name else 'a Name'
        s.add('Make location C', f'Click {ME}, then Settings, then Locations in the left menu, then New Location. Type {nm}, fill the boxes the window marks as required, then click Save & Close. '
              f'To make documents there, switch to it: click {ME}, then Change Location, then the new location.')
        s.miss('saving a third location and switching to it')

def to_html(items):
    E = lambda x: html.escape(x, quote=False)
    return '<p><strong>Setup</strong></p><ol>' + ''.join(f'<li>{E(a)}: {E(b)}</li>' for a, b in items) + '</ol>'

# ---------------- parsing ----------------
M = r'\$([\d,]+\.\d\d)'
KIND = {'invoice': 'invoice', 'bill': 'bill', 'credit memo': 'credit memo', 'vendor credit': 'vendor credit', 'deposit': 'deposit'}
def frag_docs(text):
    """'an invoice of $1,000.00 at location A 15 days past due, partly paid $200.00 (open $500.00), and an unused credit memo of $150.00 at location A'
    -> [dict(kind, amount, loc, pd, paid, dated)]"""
    out = []
    for m in re.finditer(r'(?:an? )?(?:unused )?(invoice|bill|credit memo|vendor credit|deposit)(?: [A-Z])? of ' + M + r'(.*?)(?=(?:,? and |, )(?:an? )?(?:unused )?(?:invoice|bill|credit memo|vendor credit|deposit)(?: [A-Z])? of |$)', text):
        kind, amt, rest = m.group(1), m.group(2), m.group(3)
        d = {'kind': kind, 'amount': amt, 'loc': None, 'pd': None, 'paid': None}
        l = re.search(r'at (location [ABC])', rest); d['loc'] = l.group(1) if l else None
        p = re.search(r'(\d+) days past due', rest); d['pd'] = int(p.group(1)) if p else None
        if 'not yet due' in rest: d['pd'] = -1
        pp = re.search(r'partly paid ' + M, rest); d['paid'] = pp.group(1) if pp else None
        out.append(d)
    return out
COLS = {'Current': -1, '1-30 Days': 15, '31-60 Days': 45, '61-90 Days': 75, '91 And Over': 100}
def put(b, party, kind_party, d, n):
    X = party; b.cnt = getattr(b, 'cnt', {}); b.cnt[(X, d['kind'])] = b.cnt.get((X, d['kind']), 0) + 1; n = b.cnt[(X, d['kind'])]
    days = None if d['pd'] is None or d['pd'] < 0 else d['pd'] + 30
    if d['kind'] == 'invoice': b.invoice(f'invoice {n} for {X}', X, d['amount'], days, d['loc'], d['paid'])
    elif d['kind'] == 'credit memo': b.credit_memo(f'credit memo {n} for {X}', X, d['amount'], None, d['loc'])
    elif d['kind'] == 'deposit': b.deposit(f'deposit {n} for {X}', X, d['amount'], d['loc'])
    elif d['kind'] == 'bill': b.bill(f'bill {n} for {X}', X, d['amount'], days, d['loc'], d['paid'])
    elif d['kind'] == 'vendor credit': b.vendor_credit(f'vendor credit {n} for {X}', X, d['amount'], None, d['loc'])
SKIP = ('Sign in as an Admin user (the "Admin" role).', 'Use a desktop browser', 'Open A/', 'Leave the report', 'Open Sales By Customer', 'Set the browser', 'Pick an earlier date', 'Pick two as-of dates',
        'Run this test in the evening', 'Set this computer', 'Make sure you have a link to', 'Make sure your role has', 'Open invoice A\'s page in a second', 'Make sure you are enrolled at both locations')
def setup_for(case, MANUAL):
    lines = [html.unescape(re.sub(r'<[^>]+>', '', x)).strip() for x in re.findall(r'<li>(.*?)</li>', case['custom_preconds'] or '', re.S)]
    b = Book(); unhandled = []; ctx = None; n = 0
    hasdocs = any(l.startswith('Document ') for l in lines)
    for l in lines:
        if l.startswith(SKIP): continue
        key = next((k for k in MANUAL if l.startswith(k)), None)
        if key is not None:
            if MANUAL[key] is not None: MANUAL[key](b, dict(case, _line=l))
            continue
        m = re.match(r'(Customer|Vendor) ([A-F]): (.*)\.$', l)
        if m and ctx:
            X = f'{m.group(1).lower()} {m.group(2)}'
            if m.group(1) == 'Customer': b.customer(X)
            else: b.vendor(X)
            cols = re.findall(r'(Current|1-30 Days|31-60 Days|61-90 Days|91 And Over) ' + M, m.group(3))
            if cols:
                for c, a in cols: n += 1; put(b, X, None, {'kind': 'invoice' if m.group(1) == 'Customer' else 'bill', 'amount': a, 'loc': None, 'pd': COLS[c], 'paid': None}, f'{n}')
                continue
            ds = frag_docs(m.group(3))
            if not ds: unhandled.append(l); continue
            for d in ds: n += 1; put(b, X, None, d, f'{n}')
            continue
        if re.match(r'Have (two|three|four|five|six) new (customers|vendors) \(created for this test\)', l) and l.endswith(':'): ctx = 'parties'; continue
        m = re.match(r'Make sure that in (?:that customer\'s|that vendor\'s) group there are three open (invoices|bills), document A, document B and document C:', l)
        if m: ctx = ('same', 'customer A' if m.group(1) == 'invoices' else 'vendor A', m.group(1)[:-1]); continue
        m = re.match(r'Make sure that in the "1-30 days past due" bucket there are three open (invoices|bills), document A, document B and document C, each for a different (customer|vendor)', l)
        if m: ctx = ('diff', m.group(2), m.group(1)[:-1]); continue
        m = re.match(r'Document ([ABC]) is dated (\d+) days ago, due (\d+) days ago, amount ' + M + r', open ' + M + r'\.$', l)
        if m and isinstance(ctx, tuple):
            D, da, du, amt, op = m.group(1), int(m.group(2)), int(m.group(3)), m.group(4), m.group(5)
            X = ctx[1] if ctx[0] == 'same' else f'{ctx[1]} {D}'
            paid = None if amt == op else f'{float(amt.replace(",", "")) - float(op.replace(",", "")):,.2f}'
            if ctx[2] == 'invoice':
                if da - du not in (0, 30): unhandled.append(l); continue
                b.invoice(f'document {D}', X, amt, da, None, paid, due_same_day=(da == du))
            else:
                if da - du not in (0, 30): unhandled.append(l); continue
                if da == du: b.miss('a bill that falls due on its own date (vendor Credit Terms other than Net 30 were not tried)')
                b.bill(f'document {D}', X, amt, da, None, paid)
            continue
        if hasdocs and re.match(r'Have a (customer|vendor) with overdue (invoices|bills) on today\'s date\.$', l): continue
        unhandled.append(l)
    first = [x for x in b.items if x[0] in ('Locations to use', 'Make location C')]
    last = [x for x in b.items if x[0] in ('Make the role for this test', 'Sign in with that role', 'Sign in as an Admin at one location')]
    mid = [x for x in b.items if x not in first and x not in last]
    return first + mid + last, b.unseen, unhandled
