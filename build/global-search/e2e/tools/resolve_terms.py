#!/usr/bin/env python3
"""Match every search word the tests use to the seeded records that contain it.

Reads the six seeding plans (../seeding/seed-manifest*.json) and indexes every value each record
writes (its finder value and every string in its create payload). A test's word is "seeded" when
at least one record holds it; otherwise it relies on data no plan creates - the gap list.

    python3 tools/resolve_terms.py WORD [WORD ...]     -> which records hold each word
"""
import json, glob, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SEED = os.environ.get('GS_SEEDING_DIR') or os.path.join(HERE, '..', '..', 'seeding')

def manifests(exclude=()):
    for f in sorted(glob.glob(os.path.join(SEED, 'seed-manifest*.json'))):
        if os.path.basename(f) in exclude: continue
        tag = os.path.basename(f)[len('seed-manifest'):-len('.json')].strip('-') or 'v1reg'
        yield tag, json.load(open(f))

def strings(x):
    if isinstance(x, str): yield x
    elif isinstance(x, dict):
        for v in x.values(): yield from strings(v)
    elif isinstance(x, list):
        for v in x: yield from strings(v)

def index(exclude=()):
    idx = []
    for tag, m in manifests(exclude):
        for r in m.get('records', []):
            vals = set(strings((r.get('find') or {}).get('value'))) | set(strings((r.get('create') or {}).get('payload')))
            idx.append((f'{tag}:{r["key"]}', [v for v in vals if v]))
        for po in ((m.get('purchase_orders') or {}).get('rows') or []):
            idx.append((f'{tag}:#po', [v for v in strings(po) if v]))
    return idx

def holders(word, idx=None):
    idx = idx or index()
    w = re.sub(r'[^a-z0-9]', '', word.lower())
    return [k for k, vals in idx if any(w and w in re.sub(r'[^a-z0-9]', '', v.lower()) for v in vals)]

if __name__ == '__main__':
    idx = index()
    for w in sys.argv[1:]:
        h = holders(w, idx)
        print(f'{w!r}: {len(h)} record(s)' + (f' — {", ".join(h[:8])}{" …" if len(h) > 8 else ""}' if h else ' — NOT SEEDED BY ANY PLAN'))
