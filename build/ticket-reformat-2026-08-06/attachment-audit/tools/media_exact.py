#!/usr/bin/env python3
"""The exact half of Rule 50 for the images: a preserved media node must be BYTE-IDENTICAL,
not merely present. Compares each media node's full attrs dict before vs now, and confirms
the one destroyed attachment really is gone from Jira (HTTP 404), not merely absent from a list.
"""
import json, os, sys, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE)
import jira as J

RS, FS = os.path.join(ROOT, 'report-suite'), os.path.join(ROOT, 'filters-schedule')
AUD = json.load(open(os.path.join(HERE, '..', 'snapshots', 'attachment-audit.json')))


def nodes_full(adf):
    out = []

    def walk(n):
        if isinstance(n, dict):
            if n.get('type') == 'media':
                out.append(n.get('attrs', {}))
            for v in n.values():
                walk(v)
        elif isinstance(n, list):
            for v in n:
                walk(v)

    walk(adf or {})
    return {a.get('id'): a for a in out}


def before_adf(key, half):
    if half == 'Report Suite':
        p = os.path.join(RS, 'snapshots', 'pre-edit', f'{key}.adf.json')
        return json.load(open(p)) if os.path.exists(p) else None
    p = os.path.join(FS, 'snapshots', 'pre-edit', f'{key}.json')
    d = json.load(open(p))
    return (d.get('fields', d) or {}).get('description')


rows = []
for r in AUD['rows']:
    if not r['media_nodes_before'] and not r['media_nodes_now']:
        continue
    key, half = r['ticket'], r['half']
    live = json.load(open(os.path.join(HERE, '..', 'snapshots', 'live', f'{key}.json')))
    nb = nodes_full(before_adf(key, half))
    nn = nodes_full(live['fields'].get('description'))
    for mid, attrs in nb.items():
        if mid in nn:
            same = json.dumps(attrs, sort_keys=True) == json.dumps(nn[mid], sort_keys=True)
            diff = None
            if not same:
                diff = {k: [attrs.get(k), nn[mid].get(k)] for k in set(attrs) | set(nn[mid])
                        if attrs.get(k) != nn[mid].get(k)}
            rows.append({'ticket': key, 'media_id': mid, 'alt': attrs.get('alt'),
                         'state': 'PRESERVED', 'attrs_byte_identical': same, 'diff': diff})
        else:
            rows.append({'ticket': key, 'media_id': mid, 'alt': attrs.get('alt'),
                         'state': 'REMOVED-FROM-BODY', 'attrs_byte_identical': False})
    for mid, attrs in nn.items():
        if mid not in nb:
            rows.append({'ticket': key, 'media_id': mid, 'alt': attrs.get('alt'),
                         'state': 'NEWLY-REFERENCED', 'attrs_byte_identical': None})

# the destroyed attachment: prove it is gone from Jira itself, by id
code, body = J.get('/rest/api/3/attachment/59255', '/tmp/_aa_59255.json')
gone = {'attachment': '59255', 'http': code,
        'message': (body.get('errorMessages') if isinstance(body, dict) else str(body))}

out = {'media_node_rows': rows,
       'preserved': sum(1 for r in rows if r['state'] == 'PRESERVED'),
       'preserved_byte_identical': sum(1 for r in rows
                                       if r['state'] == 'PRESERVED' and r['attrs_byte_identical']),
       'removed_from_body': [r for r in rows if r['state'] == 'REMOVED-FROM-BODY'],
       'newly_referenced': [r for r in rows if r['state'] == 'NEWLY-REFERENCED'],
       'destroyed_attachment_reread': gone}
json.dump(out, open(os.path.join(HERE, '..', 'snapshots', 'media-exactness.json'), 'w'), indent=1)
for r in rows:
    print(f"{r['ticket']:9} {r['media_id'][:8]} {r['alt']!s:55.55} {r['state']:18} "
          f"byte-identical={r['attrs_byte_identical']}"
          + (f" DIFF={r['diff']}" if r.get('diff') else ''))
print(f"\npreserved {out['preserved']}, of which byte-identical {out['preserved_byte_identical']}")
print(f"removed from body: {[r['media_id'][:8] for r in out['removed_from_body']]}")
print(f"newly referenced: {[(r['ticket'], r['media_id'][:8]) for r in out['newly_referenced']]}")
print(f"attachment 59255 re-read: HTTP {gone['http']} {gone['message']}")
