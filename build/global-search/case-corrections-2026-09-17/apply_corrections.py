#!/usr/bin/env python3
"""Corrects C44843, C44847 and C44850 to name a work order that ACTUALLY EXISTS AND CAN BE OPENED.

WHY: all three named `S2-15276`. There is no such work order on sv9160 and there cannot be - work
order numbers are assigned by the branch. A tester typing it gets nothing back and records a FAILED
against a perfectly good product.

WHY NOT THE FIRST SUBSTITUTE I PROPOSED: `S2-15440`. It LOOKS right - the palette returns it, pinned,
with every normalization variant working. It is not right: `GET /api/work-orders/view/<its id>`
answers **400 workOrderId Not found** at BOTH workplaces this login can reach. The work order lives at
a third workplace, so the search (which is organisation-scoped) shows it while the tester cannot open
it. A case built on it would pass step 1 and die at step 2. **The palette returning a row is not
evidence the record is reachable** - Rule 110 again, in a new disguise.

WHAT WAS VERIFIED ABOUT THE REPLACEMENT, live on v26.36.7-29ca209, 2026-09-17:
  * `S2-15430` is pinned as the top hit on an exact search
  * it OPENS: /api/work-orders/view -> 200, number S-15430, status Paid, at Staging Heavy Duty
  * every normalization variant returns it: S215430, S2 15430, s2-15430, 15430
  * the near misses return NOTHING: S2-15431, S2-15432, S2-15435
  * it is PRE-EXISTING staging data and it SURVIVED the redeploy that wiped every seeded record,
    which is the evidence that it will still be there next week

WHY NOT ONE OF OUR OWN SEEDED WORK ORDERS: they are consecutive, so every near-miss number EXISTS
(S-17653, S-17654 … all return a row) and C44847's whole point is that the near miss returns nothing.
Their space-variant also fails: `S 17652` returns nothing while `S2 15430` works. Measured, not assumed.
"""
import sys, json, re, html
sys.path.insert(0, '/tmp')
import trlib

OLD_EXISTS, NEW_EXISTS = 'S2-15276', 'S2-15430'
OLD_MISS,   NEW_MISS   = 'S2-15286', 'S2-15431'
SUBS = [
    ('S2-15276', 'S2-15430'), ('S215276', 'S215430'), ('S2 15276', 'S2 15430'),
    ('s215276', 's215430'),   ('S2-15286', 'S2-15431'),
]
FIELDS = ('custom_preconds', 'custom_steps', 'custom_expected')

NOTE = ("<br /><br /><strong>Note on the number:</strong> the search box shows this work order as "
        "'S2-15430' and its own page shows it as 'S-15430' - that is the same work order, shown with "
        "and without the shop prefix, and it is not a mismatch. If 'S2-15430' ever returns nothing, "
        "open the Work Orders list, pick any work order and note its number, then use a number one "
        "digit different from it (check that the different one returns nothing before relying on it).")

def apply(cid, add_note_to=None):
    c = trlib.api(f'get_case/{cid}')
    payload, changed = {}, []
    for f in FIELDS:
        v = c.get(f)
        if not isinstance(v, str): continue
        nv = v
        for a, b in SUBS: nv = nv.replace(a, b)
        if nv != v:
            payload[f] = nv; changed.append(f)
    if add_note_to and add_note_to in payload:
        payload[add_note_to] = payload[add_note_to] + NOTE
    elif add_note_to:
        payload[add_note_to] = (c.get(add_note_to) or '') + NOTE
    if not payload:
        print(f'  C{cid}: nothing to change'); return True
    trlib.api(f'update_case/{cid}', payload)
    # READ BACK and compare at CONTENT level - TestRail appends a trailing newline and sometimes a
    # stray </p>, so a byte comparison produces false alarms (playbook O4).
    back = trlib.api(f'get_case/{cid}')
    ok = True
    for f in changed:
        got, want = back.get(f) or '', payload[f]
        if OLD_EXISTS in got or OLD_MISS in got:
            print(f'  C{cid}.{f}: 🔴 OLD NUMBER STILL PRESENT'); ok = False
        elif NEW_EXISTS not in got and NEW_MISS not in got:
            # 🔴 THE FIRST VERSION OF THIS CHECK RAISED A FALSE ALARM ON ITS OWN WORK. It demanded
            # the REAL number in every changed field, but C44847's steps legitimately name only the
            # NEAR MISS - the case is about typing a number that does not exist, so the real one has
            # no business being in the steps. The edit was correct and the checker was wrong. A
            # field is now satisfied by carrying EITHER new number.
            print(f'  C{cid}.{f}: 🔴 NEITHER NEW NUMBER PRESENT'); ok = False
    print(f"  C{cid}: updated {changed} -> {'✅ verified' if ok else '🔴 VERIFY FAILED'}")
    return ok

allok = True
allok &= apply(44843, add_note_to='custom_preconds')
allok &= apply(44847, add_note_to='custom_preconds')
allok &= apply(44850, add_note_to='custom_preconds')
print('\nALL VERIFIED' if allok else '\n🔴 SOMETHING DID NOT LAND')

print('\n=== read back, plain text ===')
def txt(s):
    s = re.sub(r'<br\s*/?>', '\n', s or ''); s = re.sub(r'</p>', '\n', s); s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(s).replace('\r', '').strip()
for cid in (44843, 44847, 44850):
    c = trlib.api(f'get_case/{cid}')
    print(f"\n--- C{cid} {c['title']}")
    for f in FIELDS:
        if c.get(f): print(f"  [{f}] {txt(c[f])[:420]}")
