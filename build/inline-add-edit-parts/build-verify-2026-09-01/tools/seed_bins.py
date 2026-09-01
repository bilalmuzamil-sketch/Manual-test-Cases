#!/usr/bin/env python3
"""Seed the two bin data states suite 6597 needs and that sv9315 does not have.

WHY THIS IS NEEDED. Every one of the inventory parts the API returns holds EXACTLY ONE bin, so eight
Story 7 cases have nothing to observe: the "+ N" collapse chip (S7-R2), choosing a different bin
(S7-R7), the split label "N bins" (S7-R5), the auto-switch note (S7-R10), re-allocation on a quantity
change (S7-R11), Apply-writes-the-split (S7-R14), an already-negative bin (S7-R15), and the rule that
a split never shows the takes-negative warning (S7-E2). Plus the "Not stocked" card (S7-R2 leg 3) and
"a part with no bins gets no allocation" (S7-N1), which need a part with NO bins.

Rule 6: this branch is disposable. Everything created here is named ZZAUTOTEST and RESTORED by
--restore, which reads the state file this script writes BEFORE it changes anything.

Routes, all taken from the SPA's own API client (never guessed):
    GET    /api/inventory/bin-locations          fetchBinLocations
    POST   /api/inventory/bin-locations          createBinLocation
    DELETE /api/inventory/bin-locations/{id}     deleteBinLocation
    GET    /api/inventory/parts/{id}             viewInventoryPart
    POST   /api/inventory/parts/change           updatePart
"""
import json, sys, os, argparse, urllib.request, urllib.error, ssl, time

API = 'https://sv9315api.qa.shopview.com'
CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
STATE = '/tmp/inl6597/BIN-SEED-STATE.json'
COOKIE = open('/tmp/qa-cookies/sv9315-live-session.txt').read().strip()

def call(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(API + path, data=data, method=method,
        headers={'Cookie': COOKIE, 'Content-Type': 'application/json', 'Accept': 'application/json'})
    for a in range(4):
        try:
            r = urllib.request.urlopen(req, timeout=90, context=CTX)
            b = r.read()
            return r.status, (json.loads(b) if b else {})
        except urllib.error.HTTPError as e:
            b = e.read()
            try: j = json.loads(b or b'{}')
            except Exception: j = b[:300].decode('utf8', 'ignore')
            if e.code in (502, 503, 504) and a < 3: time.sleep(6); continue
            return e.code, j
        except Exception as ex:
            if a < 3: time.sleep(6); continue
            return 0, str(ex)

def find_part(search):
    st, b = call('GET', f'/api/inventory/parts?search={urllib.parse.quote(search)}&rowsPerPage=50')
    coll = (b.get('data') or {}).get('collection') or []
    return st, coll

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--seed', action='store_true')
    ap.add_argument('--restore', action='store_true')
    ap.add_argument('--show', action='store_true')
    a = ap.parse_args()
    os.makedirs('/tmp/inl6597', exist_ok=True)

    if a.show:
        st, bins = call('GET', '/api/inventory/bin-locations?rowsPerPage=250')
        print('bin-locations HTTP', st)
        rows = (bins.get('data') or {}).get('binLocations', [])
        print(f'{len(rows)} bins;', [r.get('name') for r in rows[:25]])
        st, coll = find_part('N68SL-356')
        for p in coll[:3]:
            print(' part', p['part_number'], p['id'], 'qty', p['quantity'],
                  'bins', [(x['name'], x['quantity'], x['isDefault']) for x in (p.get('binLocations') or [])])
        return

    if a.restore:
        if not os.path.exists(STATE):
            print('no state file — nothing to restore'); return
        s = json.load(open(STATE))
        ok = True
        for part in s['parts']:
            st, b = call('POST', '/api/inventory/parts/change', part['restore_payload'])
            print(f"restore part {part['part_number']}: HTTP {st}")
            if st >= 400: ok = False; print('   ', json.dumps(b)[:300])
            st2, after = call('GET', f"/api/inventory/parts/{part['id']}")
            now = [(x['name'], x['quantity'], x['isDefault']) for x in ((after.get('data') or {}).get('binLocations') or [])]
            was = part['bins_before']
            print('    bins now :', now)
            print('    bins were:', was)
            print('    IDENTICAL:', sorted(map(str, now)) == sorted(map(str, was)))
            if sorted(map(str, now)) != sorted(map(str, was)): ok = False
        # the bins were BORROWED, never created, so nothing is deleted. Deleting a pre-existing bin
        # would destroy shop data that has nothing to do with this pass.
        for b_ in s['created_bins']:
            print(f"bin {b_['name']}: pre-existing, left alone (nothing was created)")
        print('RESTORE', 'CLEAN' if ok else 'INCOMPLETE — read the output above')
        return

    # ---------------- seed ----------------
    st, coll = find_part('N68SL-356')
    target = next((p for p in coll if p['part_number'] == 'N68SL-356'), None)
    if not target:
        print('target part not found; HTTP', st); sys.exit(2)
    st, full = call('GET', f"/api/inventory/parts/{target['id']}")
    if st != 200:
        print('viewInventoryPart HTTP', st, json.dumps(full)[:300]); sys.exit(2)
    part = full['data']
    bins_before = [(x['name'], x['quantity'], x['isDefault']) for x in (part.get('binLocations') or [])]
    print('target', part.get('part_number'), 'bins before:', bins_before)

    # NOTHING IS CREATED. The workplace already has a full set of named bins (General Storage, A1A,
    # A1B, ...), so the seed only re-allocates THIS ONE PART across three of them. That keeps the
    # restore to a single updatePart call and leaves no new objects behind at all.
    st, blist = call('GET', '/api/inventory/bin-locations?rowsPerPage=250')
    allbins = (blist.get('data') or {}).get('binLocations', [])
    have = {x['name'] for x in (part.get('binLocations') or [])}
    created = []
    for x in allbins:
        if x['name'] in have or len(created) == 3:
            continue
        created.append({'id': x['id'], 'name': x['name'], 'preexisting': True})
    print('borrowing existing bins:', [c['name'] for c in created])
    if len(created) < 3:
        print('fewer than three spare bins exist — stopping rather than creating any'); sys.exit(2)

    # the restore payload is built from the part as it is NOW, before anything is changed
    def payload(binlist):
        p = dict(part)
        p['binLocations'] = binlist
        for k in ('deletable', 'numberOfHistoryRecords', 'binLocationsSum'):
            p.pop(k, None)
        return p

    restore_bins = [{'binLocationId': x['binLocationId'], 'name': x['name'],
                     'quantity': x['quantity'], 'isDefault': x['isDefault']}
                    for x in (part.get('binLocations') or [])]

    # FOUR bins, deliberately shaped so every uncovered leg becomes observable:
    #   the Default holds 1  -> auto-allocation must move off it for any quantity above 1 (S7-R10)
    #   BINA holds 10        -> a single bin that covers a mid-size quantity (S7-R3)
    #   BINB holds 4         -> a second bin for the split (S7-R5/R13/R14)
    #   BINC holds -2        -> an already-negative bin (S7-R15)
    #   four bins in total   -> the "+ N" collapse chip on the result card (S7-R2)
    want = list(restore_bins)
    for i, (b_, q) in enumerate(zip(created, (10, 4, -2))):
        want.append({'binLocationId': b_['id'], 'name': b_['name'], 'quantity': q, 'isDefault': False})
    for x in want:
        if x['isDefault']:
            x['quantity'] = 1

    st, b = call('POST', '/api/inventory/parts/change', payload(want))
    print('updatePart HTTP', st)
    if st >= 400: print('   ', json.dumps(b)[:400])
    st, after = call('GET', f"/api/inventory/parts/{target['id']}")
    print('bins after:', [(x['name'], x['quantity'], x['isDefault'])
                          for x in ((after.get('data') or {}).get('binLocations') or [])])

    json.dump({'created_bins': created,
               'parts': [{'id': target['id'], 'part_number': part.get('part_number'),
                          'bins_before': bins_before,
                          'restore_payload': payload(restore_bins)}]},
              open(STATE, 'w'), indent=1)
    print('state written to', STATE)

if __name__ == '__main__':
    import urllib.parse
    main()
