#!/usr/bin/env python3
"""Rule 41 - touch a case, re-verify the WHOLE case. Runs C44843, C44847 and C44850 end to end
against the live build, exactly as a tester would, and reports what a tester would record."""
import os, runpy, sys, urllib.parse
sys.path.insert(0, '/tmp')
HERE = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest-gs-v2.json')
_s = runpy.run_path('/home/user/Manual-test-Cases/build/global-search/seeding/seed.py', run_name='not_main')
call = _s['call']

def srch(q):
    return (call('/api/search?q=' + urllib.parse.quote(q))['json'] or {}).get('data', {}) or {}
def pinned(q): return (srch(q).get('pinned') or {}).get('primary')
def rowcount(q):
    d = srch(q); return sum(len(g['items']) for g in d.get('groups') or []) + (1 if d.get('pinned') else 0)

fails = []
def check(case, desc, got, want):
    ok = got == want
    print(f"  {'✅' if ok else '🔴'} C{case} {desc:52} got={got!r}")
    if not ok: fails.append((case, desc, got, want))

print('=== C44843 · a number matches with or without the dash or a space ===')
for q in ('S2-15430', 'S215430', 'S2 15430'):
    check(44843, f'typing {q!r} finds S2-15430', pinned(q), 'S2-15430')

print('\n=== C44847 · a typo in an identifier returns no fuzzy match ===')
check(44847, "the near miss 'S2-15431' returns nothing", rowcount('S2-15431'), 0)
check(44847, "the real 'S2-15430' does exist (the control)", pinned('S2-15430'), 'S2-15430')

print('\n=== C44850 · the exact match is pinned at the very top ===')
d = srch('S2-15430')
check(44850, 'a pinned row is present', bool(d.get('pinned')), True)
check(44850, 'the pinned row IS the work order', (d.get('pinned') or {}).get('primary'), 'S2-15430')
check(44850, 'the pinned row is a work order', (d.get('pinned') or {}).get('type'), 'work_orders')

print('\n=== the precondition behind all three: the record is REACHABLE, not just indexed ===')
p = d.get('pinned') or {}
v = call(f"/api/work-orders/view/{p.get('id')}") if p.get('id') else {'status': 'NO ID'}
w = ((v.get('json') or {}).get('data') or {}).get('work_order') or {}
check(0, 'the work order actually opens', v.get('status'), 200)
print(f"     it is number {w.get('number')}, status {w.get('status')}, customer {w.get('company_name')}")

print('\n=== summary ===')
print('  ✅ all three corrected cases are runnable as written' if not fails
      else f'  🔴 {len(fails)} check(s) failed: {fails}')
sys.exit(1 if fails else 0)
