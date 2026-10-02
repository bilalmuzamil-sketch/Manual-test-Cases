#!/usr/bin/env python3
"""OFFLINE TEST: a refused create is a second look, not a failure - and never a wrong adoption.

No network, no session: seed.py's call() and find() are replaced with fakes. Run from anywhere:
    python3 build/global-search/seeding/test_adopt_after_refusal.py      (exit 0 = all pass)
"""
import json, os, runpy, sys, tempfile
HERE = os.path.dirname(os.path.abspath(__file__))
prof = os.path.join(tempfile.mkdtemp(), 'cookies.json')          # a dummy profile, no secret in it
json.dump({'host': 'x.invalid', 'api': 'x.invalid'}, open(prof, 'w'))
os.environ['SEED_PROFILE'] = prof; os.environ.setdefault('SEED_MANIFEST', 'seed-manifest-e2e.json')
os.chdir(HERE)
g = runpy.run_path(os.path.join(HERE, 'seed.py'), run_name='not_main')
adopt = g['_adopt_after_refusal']; G = adopt.__globals__
G['time'].sleep = lambda s: None
refused = {'status': 400, 'raw': 'Customer with this name already exists'}
def run(name, rec, find_seq, search_groups, want):
    seq = list(find_seq)
    G['find'] = lambda spec, k=None: (seq.pop(0) if seq else [], None)
    G['call'] = lambda path, *a, **k: {'status': 200, 'json': {'data': {'groups': search_groups}}}
    got = adopt(rec, 'k', refused)
    ok = got == want
    print(('PASS' if ok else 'FAIL'), name, '->', got); return ok
cust = {'find': {'mode': 'search', 'list': '/api/customers', 'value': 'ZZSPEC Alpha Freight'}}
part = {'find': {'mode': 'search', 'list': '/api/inventory/parts', 'value': 'ZZSH-8101'}}
contact_row = [{'type': 'contacts', 'items': [{'id': 'C1', 'primary': 'Jo Smith', 'secondary': 'ZZSPEC Alpha Freight'}]}]
cust_row = contact_row + [{'type': 'customers', 'items': [{'id': 'CU9', 'primary': 'ZZSPEC Alpha Freight', 'secondary': ''}]}]
parts_row = [{'type': 'parts', 'items': [{'id': 'P1', 'primary': 'ZZSH-8101', 'secondary': ''}]}]
r = [
 run('found on the second look', cust, [[], [{'id': 'CU9'}]], [], [{'id': 'CU9'}]),
 run('found only through global search, customers list', cust, [], cust_row, [{'id': 'CU9'}]),
 run('a contact row naming the customer is NOT adopted', cust, [], contact_row, []),
 run('a part is never adopted from the shared parts list', part, [], parts_row, []),
 run('genuinely absent -> reported failure', cust, [], [], []),
]
sys.exit(0 if all(r) else 1)
