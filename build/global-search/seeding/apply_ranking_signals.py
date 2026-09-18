#!/usr/bin/env python3
"""APPLY THE THREE RANKING SIGNALS THE MANIFEST CANNOT EXPRESS.

A record is not a ranking case. Two rows that match a keyword identically cannot pass or fail - only
the DIFFERENCE between them is under test. The manifest builds the pairs; this applies the one thing
that must differ, for the three signals that are actions rather than records:

    C55710  ZZVENDORPO      one vendor gets an OPEN purchase order, its twin gets none
    C55712  ZZPARTBUSY      one part gets recent activity, its twin stays quiet
    C55716  ZZTIEBREAK      one customer is UPDATED LAST, so it must win the tie

🔴 IDEMPOTENT. Every step measures first: an existing purchase order is not duplicated, and the
tie-break touch is harmless to repeat (it only ever moves the same record to the front).

Run AFTER `SEED_MANIFEST=seed-manifest-ranking.json python3 seed.py --confirm`, then prove it with
verify_ranking.py.
"""
import json, os, sys, urllib.error, urllib.parse, urllib.request, uuid

CONFIRM = '--confirm' in sys.argv
R_, X_ = '\033[31m', '\033[0m'
HERE = os.path.dirname(os.path.abspath(__file__))
C = json.load(open(os.environ.get('SEED_PROFILE', '/tmp/qa/cookies.json')))
CK = '; '.join(f"{k}={C[k]}" for k in ('sv_sso_session', 'PHPSESSID', 'cf_clearance') if C.get(k))

def call(path, method='GET', body=None):
    req = urllib.request.Request(f"https://{C['api']}{path}", method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={'Cookie': CK, 'Accept': 'application/json', 'Content-Type': 'application/json',
                 'User-Agent': 'Mozilla/5.0', 'Referer': f"https://{C['host']}/"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            raw = r.read().decode()
            return r.status, (json.loads(raw) if raw.strip().startswith(('{', '[')) else {})
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:200]
    except Exception as e:
        return 'ERR', repr(e)[:200]

def find_one(list_path, field, value, coll='collection'):
    st, d = call(f"{list_path}?" + urllib.parse.urlencode({'search': value, 'limit': 25}))
    if st != 200 or not isinstance(d, dict): return None
    rows = (d.get('data') or {}).get(coll) or []
    return next((x for x in rows if str(x.get(field) or '') == value), None)

def signal_open_work_orders():
    """🔴 AN ESTIMATE DOES NOT COUNT AS AN OPEN WORK ORDER FOR THE RANKING SIGNAL, AND A CREATED
    WORK ORDER IS AN ESTIMATE. Measured 2026-09-18, and it is the difference between a case that
    works and a case that fails against a working product:

        five estimates vs one estimate  -> the customer with FIVE ranked SECOND (wrong)
        five in_progress vs one         -> the customer with FIVE ranked FIRST  (right)

    Worse, C55709's work order was found sitting at **Paid** - a terminal status - so the "asset on
    an OPEN work order" signal was an asset on a CLOSED one. I could not establish how it got there
    (the Fibridge status scripts read a different ids file and cannot reach these records), so this
    does not rely on knowing: it SETS the status explicitly on every run instead of trusting the
    state a record was created in. That is immune to whatever changed it.

    None of this was visible to the seeder OR to the first verifier - both checked that the records
    existed. Only the ORDER shows it, which is why verify_ranking.py now asserts order."""
    ids_path = os.path.join(HERE, 'seed-ids-ranking-qa.json')
    if not os.path.exists(ids_path):
        return '🔴 no ranking ids file — run seed.py --confirm first'
    ids = json.load(open(ids_path))
    keys = ['wo_custopen', 'wo_assetlift', 'wo_cnt_busy', 'wo_cnt_quiet']
    todo = [(k, w) for k in keys for w in (ids.get(k) or [])]
    if not todo: return '🔴 no seeded work orders found in the ids file'
    if not CONFIRM: return f'   would force {len(todo)} work order(s) to in_progress'
    fixed = skipped = failed = 0
    for k, w in todo:
        st, d = call(f'/api/work-orders/view/{w}')
        cur = ((d or {}).get('data') or {}).get('work_order', {}).get('status') if st == 200 else None
        if str(cur).lower().replace(' ', '_') == 'in_progress':
            skipped += 1; continue
        st2, _ = call('/api/work-orders/change-status', 'POST', {'id': w, 'status': 'in_progress'})
        if st2 in (200, 201): fixed += 1
        else: failed += 1
    return (f"✅ {fixed} set to in_progress, {skipped} already there"
            + (f", {R_}{failed} FAILED{X_}" if failed else ""))

def signal_vendor_po():
    """C55710 — the OPEN purchase order that lifts one vendor above its twin."""
    v = find_one('/api/parts-catalogue/vendors', 'name', 'ZZVENDORPO Supply Open')
    if not v: return '🔴 vendor ZZVENDORPO Supply Open not found — run seed.py --confirm first'
    st, d = call('/api/inventory/orders?limit=250')
    existing = [x for x in ((d.get('data') or {}).get('collection') or [])
                if x.get('vendor_id') == v['id']] if st == 200 else []
    if existing:
        return f"✅ already has {len(existing)} purchase order(s) — nothing to do"
    if not CONFIRM: return '   would create one purchase order'
    part = find_one('/api/parts-catalogue/catalogue-parts', 'part_number', 'ZZSTOCKPART-1001')
    if not part: return '🔴 catalogue part ZZSTOCKPART-1001 not found'
    # A purchase order with NO work order: the only route on this build that can be received, and
    # all this case needs is that the vendor HAS an open order.
    body = {'vendor_id': v['id'], 'note': 'ZZAUTOTEST ranking signal — open PO for C55710',
            'items': [{'id': str(uuid.uuid4()), 'is_core': False,
                       'part_number': 'ZZSTOCKPART-1001', 'quantity': 3, 'price': 19.5,
                       'description': part['name'], 'category': part.get('category')}]}
    st, d = call('/api/inventory/orders/create', 'POST', body)
    return (f"✅ purchase order created ({st})" if st in (200, 201)
            else f"🔴 orders/create {st} {str(d)[:140]}")

def signal_part_activity():
    """C55712 — recent activity on one part, none on its twin. Their stock is identical on purpose,
    so activity is the only thing that can explain a difference in order."""
    p = find_one('/api/inventory/parts', 'part_number', 'ZZPARTBUSY-2001')
    if not p: return '🔴 inventory part ZZPARTBUSY-2001 not found'
    if not CONFIRM: return '   would record activity against ZZPARTBUSY-2001'
    # Opening the part IS the activity the ranking reads - the same recent-entity signal the recent
    # list uses. Its quiet twin is deliberately never opened.
    st, _ = call(f"/api/inventory/parts/{p['id']}")
    st2, _ = call('/api/user/recent-entities/touch', 'POST',
                  {'entity_type': 'part', 'entity_id': p['id']})
    return (f"✅ activity recorded (view {st}, touch {st2}) — twin left untouched"
            if st == 200 else f"🔴 could not open the part: {st}")

def signal_tiebreak():
    """C55716 — both rows match identically; the one updated LAST must win."""
    c = find_one('/api/customers', 'name', 'ZZTIEBREAK Transport Two')
    if not c: return '🔴 customer ZZTIEBREAK Transport Two not found'
    if not CONFIRM: return '   would re-save ZZTIEBREAK Transport Two so it is the newer of the two'
    body = dict(c); body['company_id'] = c['id']
    st, d = call('/api/customers/change', 'POST', body)
    return (f"✅ Transport Two re-saved ({st}) — it is now the most recently updated of the pair"
            if st in (200, 201) else f"🔴 customers/change {st} {str(d)[:140]}")

if __name__ == '__main__':
    if not CONFIRM:
        print('DRY RUN — pass --confirm to apply\n')
    print('C55708/09/22  work orders OPEN       :', signal_open_work_orders())
    print('C55710  vendor open purchase order :', signal_vendor_po())
    print('C55712  part recent activity       :', signal_part_activity())
    print('C55716  tie-break, updated last    :', signal_tiebreak())
    print('\n🔴 Now prove it: python3 verify_ranking.py')
