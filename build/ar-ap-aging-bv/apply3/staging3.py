# Option A (QA lead, 14 Nov 2026): the 133 Setup lists of 10 Nov rewritten for staging v26.45.4-f3d3d2d and restamped.
# Reuses the pass-2 generator (apply2/setup.py + apply2/manual.py) with the differences walked on staging today
# (probes s02-s19; build/OBSERVED-UI-LABELS-staging.md). Anything not tried on staging is returned as unseen.
import sys, os, re, html, json
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(D, '..', 'apply2'))
import setup as S, manual as MM
ME = S.ME
# --- work order finish follows Settings > Settings > Work Orders (QA lead, 14 Nov) ---
S.FINISH = ('On the line click Complete. With the work order settings as on staging (see the Work order settings item) a Missing Details window '
            'asks only for the VIN if the vehicle has none: type one and click Finish Work Order (the work order then reads Complete). If someone has switched on '
            'Require Tech Story, Require Mileage or Require Engine Hours, that window also asks for the tech story, the mileage or the engine hours: fill them in. '
            'Open the Finance tab; if Require Review Before Completion is on, click Mark Reviewed first (type the VIN there if asked, then Confirm Review).')
WOSET = ('Work order settings', f'Click {ME}, then Settings, then Settings in the left menu, then the Work Orders tab. Check that Require Review Before '
         'Completion, Require Tech Story, Require Mileage and Require Engine Hours are off and Require Approval for New Lines is on, as on staging on 14 Nov 2026. '
         'Leave them as they are; the steps below are written for these settings.')
S.LOCS = ('Locations to use', 'Use "Staging Heavy Duty - 9919" as location A (in A to Z order it comes before Lethbridge) and "Staging Lethbridge - 4310" as '
          f'location B. Start at location A: if the top bar shows another location, click {ME}, then Change Location, then "Staging Heavy Duty - 9919". '
          'To work at location B, switch to "Staging Lethbridge - 4310" the same way, and switch back to "Staging Heavy Duty - 9919" when you are done.')
_cust = S.Book.customer
def _customer(b, X, name=None, phone=True, due_on_receipt=False):
    n = len(b.items); _cust(b, X, name, phone, due_on_receipt)
    b.items[n:] = [(t, x.replace('fill Make and the other boxes the window marks as required', 'pick a Make from its list, fill any other box the window marks as required')) for t, x in b.items[n:]]
S.Book.customer = _customer
def _part_sale(s, doc, X, amount='300.00', days_ago=None, loc=None):
    s.customer(X)
    if loc in ('location B', 'your other location'): s.add(*S.LOCS)
    s.add(f'Make {doc}', f'{S.at(loc)}Click Parts in the top bar, then Part Sales in the left menu, then New Part Sale; pick {X} in Customer and click Save. Click Add Part: leave Part Number empty, '
          f'type a Description, 1 in Quantity and a Cost, then click Save & Close; on the part\'s row type {S.num(amount)} in the Sell Price box. Click Authorize if it shows. On the part\'s row pick any Vendor and click Order (the status reads Awaiting), '
          'then click Receive on the row; in the Receive parts window type a part number in the empty box above the part\'s description, a Vendor Invoice Number, tick the part and click Receive Parts (1) (the status reads Received). '
          f'Open the Finance tab, {S.when(days_ago, "Invoice Date")}, then click Create Invoice; reload the page (F5) when the New Customer Payment window opens.')
    if loc in ('location B', 'your other location'): s.miss('a part sale made at location B')
S.Book.part_sale = _part_sale
LOCC = ('Location C', f'Use "ZZAUTOTEST V1R-87 Location C" as location C: it is in the Change Location list ({ME}, then Change Location) and the reports already show open documents there.')
LOCC_LONG = ('Location C', f'Use "ZZAUTOTEST R365 Location C with a name longer than the chip" as location C (its name is longer than the Location chip can show); to make documents there, switch to it: {ME}, then Change Location, then that location.')
def _loc_c(s, long_name=False):
    s.add(*(LOCC_LONG if long_name else LOCC))
    if long_name: s.miss('making a document at a third location')
S.Book.loc_c = _loc_c
def _three(b, kind, long_c=False):
    b.loc_c(long_c)
    locs = ['location A', 'location B'] + (['location C'] if long_c else [])
    for i, loc in enumerate(locs, 1):
        (b.invoice if kind == 'ar' else b.bill)(f'{"invoice" if kind == "ar" else "bill"} {i}', 'customer A' if kind == 'ar' else 'vendor A', f'{i}00.00', None, loc)
MM.three_locs = _three
# a payment at location B: the customer page's New Payment is greyed out on staging and a location A invoice cannot be opened from location B
k = next(x for x in MM.MANUAL if x.startswith('Have a new customer (created for this test) that has, on today\'s date, an invoice A made at location A'))
MM.MANUAL[k] = lambda b, c: (b.invoice('invoice A', 'customer A', '500.00', None),
    b.add('Pay $200.00 of invoice A at location B', 'While switched to location B (see the Locations to use item): take a payment of 200.00 on invoice A in a New Customer Payment window (Payment Method, the Payment box on invoice A\'s row, Make Payment).'),
    b.miss('a payment taken at location B for an invoice made at location A (on staging the customer page\'s New Payment button was greyed out, and invoice A\'s work order opens only at location A)'),
    b.credit_memo('credit memo A', 'customer A', '50.00', None, 'location B'), b.deposit('deposit A', 'customer A', '40.00', 'location B'))
L54 = 'ZZAUTOTEST Northern Alberta Heavy Haul and Towing Ltd (53 characters, with spaces)'
L53 = 'ZZAUTOTEST Southern Alberta Fleet Parts and Supply Co (53 characters, with spaces)'
B60 = 'ZZAUTOTEST Smith & Sons \'Heavy\' Truck Repair <North> Alberta 5" Branch'
def _long_ap(b, X='vendor A'):
    b.vendor(X, name=L54); b.bill('bill 1', X, '300.00', None); b.bill('bill 2', X, '200.00', None, 'location B'); b.vendor_credit('vendor credit 1', X, '50.00')
MM.MANUAL.update({
 'Have a vendor, vendor A, with a long name of 41 to 78 characters, with spaces, and open documents at both locations': lambda b, c: _long_ap(b),
 'Have a vendor with a long name of 41 to 78 characters and open documents at both locations': lambda b, c: _long_ap(b),
 'Create, for this test, a second vendor, vendor B, whose name includes each of these characters': lambda b, c: (b.vendor('vendor B', name=B60 + ' (copy it from here)'), b.bill('bill for vendor B', 'vendor B', '100.00', None), b.miss('a vendor name with & " \' < > in it (a customer name with them was saved)')),
 'Have a vendor, vendor A, with more unpaid bills than fit on the screen at your location, a long name of 41 to 78 characters': lambda b, c: (MM.many(b, 'vendor A', 'ap', name=L54), b.vendor_credit('vendor credit A', 'vendor A', '5.00')),
 'Make sure vendor A and vendor B both have long names of 41 to 78 characters.': lambda b, c: (MM.rename(b, 'vendor A', L54), MM.rename(b, 'vendor B', L53)),
})
OLD_STAMP = '<p>Last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026.</p>'
OLD_PRE = re.compile(r'<p>Partly checked against build v26\.45\.2-6a8b89c \(QA site sv11315\) on 11/10/2026; not yet seen on that build: [^<]*</p>')
STAMP = '<p>Last checked against build v26.45.4-f3d3d2d (staging) on 11/14/2026.</p>'
PRE = 'Partly checked against build v26.45.4-f3d3d2d (staging) on 11/14/2026; not yet seen on that build: '
def new_fields(c):
    p0 = c['custom_preconds'].split('<p><strong>Setup</strong>')[0]
    items, unseen, un = S.setup_for(dict(c, custom_preconds=p0), MM.MANUAL)
    assert not un, (c['id'], un)
    if any('Finish Work Order' in x for _, x in items): items = [WOSET] + items
    e = c['custom_expected']; n_old = e.count(OLD_STAMP) + len(OLD_PRE.findall(e)); assert n_old == 1, (c['id'], n_old)
    line = f'<p>{PRE}{html.escape("; ".join(unseen), quote=False)}.</p>' if unseen else STAMP
    e2 = OLD_PRE.sub(line, e.replace(OLD_STAMP, line))
    p2 = p0 + S.to_html(items) if items else p0
    return {f: v for f, v, o in (('custom_preconds', p2, c['custom_preconds']), ('custom_expected', e2, e)) if v != o}, unseen
if __name__ == '__main__':
    LIVE = json.load(open(os.path.join(D, '..', 'new14', 'live133-2026-11-14.json')))
    PLAN, U = {}, {}
    SKIP = {'715462'}   # edited by another session at 06:01 today, after its last committed A/R write: hands off
    for k, c in LIVE.items():
        if k in SKIP: continue
        try: f, un = new_fields(c)
        except AssertionError as e: print('NEEDS LOOK', e); continue
        PLAN[k] = f; U[k] = un
    json.dump(PLAN, open(f'{D}/plan.json', 'w'), indent=1)
    import collections; C = collections.Counter(u for v in U.values() for u in v)
    print('tests', len(PLAN), '| partly', sum(1 for v in U.values() if v), '| with work order settings item', sum('Work order settings' in v.get('custom_preconds', '') for v in PLAN.values()))
    for u, n in C.most_common(): print(n, '|', u[:150])
