# Setup lists for the 14 tests of 14 Nov 2026 (C1145247-C1145260), reusing the pass-2 Book recipes (apply2/setup.py).
# DRAFT until every recipe used here is walked again on staging (the QA site sv11315 is gone); STAGING_SEEN lists what was.
import sys, os, re, html
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(D, '..', 'apply2'))
import setup as S
N120 = 'ZZAUTOTEST' + 'Abcdefghij' * 11                      # 120 letters, no spaces
V78 = 'ZZAUTOTEST' + ('Abcdefghij' * 7)[:68]                 # exactly 78 characters, no spaces
B60 = 'ZZAUTOTEST Smith & Sons \'Heavy\' Truck "Repair" <North> Alberta Branch'   # 69 characters with & " \' < >
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
        out[k] = (items, unseen, un)
    return out
if __name__ == '__main__':
    import json
    P = plan(json.load(open(f'{D}/before.json')))
    for k, (it, un, u) in P.items():
        print('C' + k, len(it), 'items', 'UNHANDLED' if u else '', u[:2])
