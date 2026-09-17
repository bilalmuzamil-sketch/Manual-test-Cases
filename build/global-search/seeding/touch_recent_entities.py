#!/usr/bin/env python3
"""Populates the signed-in user's RECENT ACTIVITY list with one record of each entity type, so
section 6728's cases have something to look at.

WHAT THIS CAN AND CANNOT DO — the honest boundary:

  ✅ it CAN fill the **Today** bucket with a genuine mix of types, which is what C44858 ("recent
     activity mixes different entity types using the same row template") and C44859 ("clicking a
     recent item opens that record") actually need.
  🔴 it CANNOT backdate. `POST /api/user/recent-entities/touch` records "just now" and takes no
     timestamp, so the **Yesterday / Past week / Past 30 days** buckets of C44857 and C45128 cannot
     be manufactured. They fill in naturally as the branch is used. Do not fake them.
  🔴 recent activity is PER USER. This fills it for whoever's session runs the script. A tester
     signing in as a different user starts empty - which is itself the C44855 first-time-empty case.

THE ENDPOINT: `POST /api/user/recent-entities/touch {type, id}` -> 204, always. It deliberately
swallows bad input (an unknown type or a non-UUID id records nothing and STILL answers 204), so a
204 is NOT evidence anything was recorded. This script therefore reads the list back and reports
what actually landed.

Run:  python3 touch_recent_entities.py [--confirm]
"""
import json, os, sys, runpy, urllib.parse
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest-gs-v2.json')
_seed = runpy.run_path(f'{HERE}/seed.py', run_name='not_main')
call = _seed['call']
CONFIRM = '--confirm' in sys.argv

# one of each type, taken from the seeded universe by SEARCHING for it - so the ids are always the
# live ones and never a stale list
WANTED = [
    ('work_orders',     'Fibridge Commercial'),
    ('customers',       'Fibridge Commercial'),
    ('assets',          'Fibridge'),
    ('parts',           'Fibridge'),
    ('vendors',         'Fibridge Mining'),
    ('part_sales',      'Fibridge Commercial'),
    ('purchase_orders', 'Fibridge Mining'),
    ('vendor_invoices', 'Fibridge Mining'),
]

def first_of(kind, term):
    r = call('/api/search?q=' + urllib.parse.quote(term))
    d = (r['json'] or {}).get('data', {}) or {}
    g = next((x for x in d.get('groups') or [] if x['type'] == kind), None)
    return (g['items'][0] if g and g['items'] else None)

def recents():
    r = call('/api/user/recent-entities')
    return ((r['json'] or {}).get('data') or {}).get('items') or []

def main():
    # 🔴 RECENT ACTIVITY IS A V2 FEATURE. `/api/user/recent-entities` answers 404 on production,
    # which runs V1 - exactly the same shape of mistake as running the V2 verifier there and
    # reporting a dead environment that is perfectly healthy. Detect it and say so, rather than
    # printing eight red 'still missing' lines about a feature that does not exist here.
    probe = call('/api/user/recent-entities')
    if probe['status'] == 404:
        print('recent activity is a V2 feature and this environment runs V1 '
              '(/api/user/recent-entities -> 404). Nothing to do here, and nothing wrong.')
        return
    if probe['status'] != 200:
        print(f"🔴 /api/user/recent-entities answered {probe['status']} - not proceeding"); return
    before = recents()
    print(f'recent list before: {len(before)} items, types {dict(Counter(i["type"] for i in before))}')
    if not CONFIRM:
        for kind, term in WANTED:
            it = first_of(kind, term)
            print(f'  {kind:17} would touch {str((it or {}).get("primary"))[:34]!r}')
        return
    for kind, term in WANTED:
        it = first_of(kind, term)
        if not it:
            print(f'  {kind:17} 🔴 nothing to touch - search {term!r} returned no {kind}'); continue
        r = call('/api/user/recent-entities/touch', 'POST', {'type': kind, 'id': it['id']})
        print(f'  {kind:17} touch {str(it.get("primary"))[:34]:36} -> {r["status"]}')

    # 🔴 A 204 IS NOT EVIDENCE. The endpoint answers 204 for input it silently discards, so the only
    # proof is the list itself.
    after = recents()
    got = Counter(i['type'] for i in after)
    print(f'\nrecent list after: {len(after)} items')
    print('  types present:', dict(got))
    missing = [k for k, _ in WANTED if k not in got]
    print(f"  {'✅ every entity type is represented' if not missing else '🔴 still missing: ' + str(missing)}")
    json.dump({'count': len(after), 'types': dict(got)},
              open(f'{HERE}/recent-activity-{_seed["ENV_LABEL"]}.json', 'w'), indent=1)

main()
