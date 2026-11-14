# Setup lists for the 14 tests of 14 Nov 2026 (C1145247-C1145260), reusing the pass-2 Book recipes (apply2/setup.py).
# Every recipe used here was walked on staging v26.45.4-f3d3d2d on 14 Nov 2026 (probes s02-s07); the one not tried is returned as unseen.
import sys, os, re, html
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(D, '..', 'apply2'))
import setup as S
# Staging (v26.45.4-f3d3d2d, walked 14 Nov, probes s02-s07) finishes a work order differently from the old QA site:
# Complete opens "Missing Details" (VIN) with "Finish Work Order"; there is no Tech stories window and no Mark Reviewed.
S.FINISH = ('On the line click Complete. With the work order settings as on staging (see the Work order settings item) a Missing Details window '
            'asks only for the VIN: type one and click Finish Work Order (the work order then reads Complete). If someone has switched on Require Tech Story, '
            'Require Mileage or Require Engine Hours, that window also asks for the tech story, the mileage or the engine hours: fill them in. Open the Finance tab; '
            'if Require Review Before Completion is on, click Mark Reviewed first (type the VIN there if asked, then Confirm Review).')
WOSET = ('Work order settings', 'Click the location name and your initials at the top right of the top bar, then Settings, then Settings in the left menu, '
         'then the Work Orders tab. Check that Require Review Before Completion, Require Tech Story, Require Mileage and Require Engine Hours are off and '
         'Require Approval for New Lines is on, as on staging on 14 Nov 2026. Leave them as they are; the steps below are written for these settings.')
_cust = S.Book.customer
def _customer(b, X, name=None, phone=True, due_on_receipt=False):
    n = len(b.items); _cust(b, X, name, phone, due_on_receipt)
    b.items[n:] = [(t, x.replace('fill Make and the other boxes the window marks as required', 'pick a Make from its list, fill any other box the window marks as required')) for t, x in b.items[n:]]
S.Book.customer = _customer
N120 = 'ZZAUTOTEST' + 'Abcdefghij' * 11                      # 120 letters, no spaces
V78 = 'ZZAUTOTEST' + ('Abcdefghij' * 7)[:68]                 # exactly 78 characters, no spaces
B60 = 'ZZAUTOTEST Smith & Sons \'Heavy\' Truck Repair <North> Alberta 5" Branch'   # 70 characters with & " \' < >
def long_c(b, X='customer A', days=None, name=N120, what='120 letters, no spaces'):
    b.customer(X, name=f'{name} (copy it from here: {what})'); b.invoice(f'invoice for {X}', X, '100.00', days)
def long_v(b, X='vendor A', name=N120, what='120 letters, no spaces'):
    b.vendor(X, name=f'{name} (copy it from here: {what})'); b.bill(f'bill for {X}', X, '100.00', None)
MANUAL = {
 'Create, for this test, a customer, customer A, whose name is 120 letters long with no spaces, and give them an open invoice dated today': lambda b, c: long_c(b),
 'Create, for this test, a customer, customer A, whose name is 120 letters long with no spaces, and give them an invoice that is overdue': lambda b, c: long_c(b, days=45),
 'Create, for this test, a second customer, customer B, whose name is more than 60 characters long': lambda b, c: long_c(b, 'customer B', None, B60, 'more than 60 characters with & " \' < >'),
 'Create, for this test, a vendor, vendor A, whose name is 120 letters long with no spaces': lambda b, c: long_v(b),
 'Create, for this test, a second vendor, vendor B, whose name is more than 60 characters long': lambda b, c: long_v(b, 'vendor B', B60, 'more than 60 characters with & " \' < >'),
 'Create, for this test, a vendor, vendor A, whose name is exactly 78 characters long with no spaces': lambda b, c: long_v(b, 'vendor A', V78, 'exactly 78 characters, no spaces'),
 # states the staging data must already show (checked on staging, not made):
 'Have open invoices dated on different days so that at least two aging buckets': None,
 'Have at least two customers with overdue invoices on today\'s date': None,
 'Have unpaid bills dated on different days so that at least two aging buckets': None,
 'Have at least two vendors with unpaid bills on today\'s date': None,
 'Have a bucket in A/R Detail, bucket A, with more than 100 lines on today\'s date': None,
 'Open A/': None, 'Leave ': None,
}
def plan(cases):
    out = {}
    for k, c in cases.items():
        items, unseen, un = S.setup_for(c, MANUAL)
        if any(t.startswith('Make invoice') for t, _ in items): items = [WOSET] + items
        if k == '1145248': unseen = unseen + ['a vendor name with & " \' < > in it (a customer name with them was saved)']
        out[k] = (items, unseen, un)
    return out
OLD = '<p>Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.</p>'
STAMP = '<p>Last checked against build v26.45.4-f3d3d2d (staging) on 11/14/2026.</p>'
PRE = 'Partly checked against build v26.45.4-f3d3d2d (staging) on 11/14/2026; not yet seen on that build: '
NA = '<p>AUTOMATION: Not available on Build to test Yet - Last checked 11/13/2026</p>'
def fields(c, items, unseen):
    p, e = c['custom_preconds'], c['custom_expected']
    assert e.count(OLD) == 1 and 'Setup</strong>' not in p and p.rstrip().endswith('</ul>')
    e2 = e.replace(OLD, f'<p>{PRE}{html.escape("; ".join(unseen), quote=False)}.</p>' if unseen else STAMP).replace(NA, '<p>AUTOMATION: READY</p>')
    p2 = p + S.to_html(items) if items else p
    st = c['custom_steps']; st2 = st.replace('Open the downloaded PDF.</', 'Open the downloaded PDF file (from your browser\'s downloads list).</')
    return {k: v for k, v, o in (('custom_preconds', p2, p), ('custom_steps', st2, st), ('custom_expected', e2, e)) if v != o}

if __name__ == '__main__':
    import json
    P = plan(json.load(open(f'{D}/before.json')))
    B = json.load(open(f'{D}/before.json')); PLAN = {}
    for k, (it, un, u) in P.items():
        assert not u, (k, u); PLAN[k] = fields(B[k], it, un); print('C' + k, len(it), 'items', 'partly' if un else '', sorted(PLAN[k]))
    json.dump(PLAN, open(f'{D}/plan.json', 'w'), indent=1)

