#!/usr/bin/env python3
"""Index every field value the seed manifest declares, so a zero result can be checked against
"a record really does carry this value" rather than against my memory of the seed.

This is the positive control for every negative finding in the run (Rule 104): a search returning
nothing is only interesting if the thing being searched for EXISTS. The manifest is declarative and
the seeder is find-or-create, so it is the authority on what each record carries."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SEED = os.path.join(os.path.dirname(HERE), 'seeding')

man = json.load(open(f'{SEED}/seed-manifest.json'))
live = {}
try:
    live = json.load(open(f'{SEED}/seed-state-live.json'))
except Exception:
    pass

index = {}   # lowercase value -> list of (record key, type, field)
for rec in man['records']:
    key, typ = rec['key'], rec.get('type', '?')
    def add(field, value):
        if not isinstance(value, str) or len(value) < 3:
            return
        index.setdefault(value.lower(), []).append({'record': key, 'type': typ, 'field': field})
    f = rec.get('find') or {}
    add(f.get('field', 'find'), f.get('value'))
    for field, value in ((rec.get('create') or {}).get('payload') or {}).items():
        add(field, value)
    for field, value in ((rec.get('patch') or {}).get('fields') or {}).items():
        add(field, value)

def lookup(q):
    """Exact, then containment either way -- a query is often a fragment of a seeded value
    ('Kestrelway' inside an address) or a seeded value is a fragment of the query."""
    ql = (q or '').lower().strip()
    if ql in index:
        return {'match': 'exact', 'carriers': index[ql]}
    part = [{**c, 'value': v} for v, cs in index.items() for c in cs
            if (ql and ql in v) or (len(ql) > 4 and v in ql)]
    return {'match': 'partial', 'carriers': part} if part else {'match': None, 'carriers': []}

if __name__ == '__main__':
    if len(sys.argv) > 1:
        for q in sys.argv[1:]:
            print(f'{q!r}: {json.dumps(lookup(q))}')
    else:
        print(f'{len(index)} seeded values indexed from {len(man["records"])} records')
        for v, cs in sorted(index.items()):
            print(f'  {v!r:52} <- ' + ', '.join(f"{c['record']}.{c['field']}" for c in cs))
        if live:
            print('\nlive ids recorded by the seeder:')
            print(json.dumps(live, indent=1)[:1200])
