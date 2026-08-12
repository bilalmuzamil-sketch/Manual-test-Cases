#!/usr/bin/env python3
"""Extract every precondition LINE from the 480 Report Suite cases and cluster them.

The previous pass classified whole preconditions by regex pattern and over-counted
(hand-audit found 3-4 of every 8 wrong).  This works LINE BY LINE and clusters on
normalised text, so the unit of judgement is a distinct requirement rather than a
whole case, and near-identical boilerplate collapses into one row to judge once.
"""
import json, re, html, collections, sys

d = json.load(open('/tmp/rs812/live_now.json'))
SECS = d['sections']
CASES = [c for c in d['cases'] if c['created_by'] == 3]


def path(sid):
    out = []
    while sid and str(sid) in SECS:
        s = SECS[str(sid)]
        out.append(s['name'])
        sid = s.get('parent_id')
    return list(reversed(out))


def report_of(c):
    p = path(c['section_id'])
    return p[1] if len(p) > 1 else (p[0] if p else '?')


def strip_markup(t):
    t = html.unescape(t or '')
    t = re.sub(r'<br\s*/?>', '\n', t)
    t = re.sub(r'</(p|li|ol|ul|div)>', '\n', t)
    t = re.sub(r'<[^>]+>', '', t)
    return t


def lines_of(t):
    t = strip_markup(t)
    out = []
    for ln in t.split('\n'):
        ln = ln.strip()
        ln = re.sub(r'^\d+[\.\)]\s*', '', ln)   # leading "1. "
        ln = re.sub(r'^[-*•]\s*', '', ln)
        ln = ln.strip()
        if ln:
            out.append(ln)
    return out


def norm(ln):
    """Normalise for clustering: lowercase, strip quotes/punctuation variance,
    collapse concrete identifiers so 'customer X' and 'customer Y' cluster."""
    s = ln.lower()
    s = s.replace('’', "'").replace('“', '"').replace('”', '"')
    s = re.sub(r'\bzzautotest[\w\- ]*', 'ZZ', s)
    s = re.sub(r'\b\d{4}-\d{2}-\d{2}\b', 'DATE', s)
    s = re.sub(r'\b\d[\d,\.]*\b', 'N', s)
    s = re.sub(r'[^a-z0-9\' ]+', ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s


rows = []
for c in CASES:
    r = report_of(c)
    for ln in lines_of(c.get('custom_preconds')):
        rows.append({'cid': c['id'], 'report': r, 'line': ln, 'norm': norm(ln)})

clusters = collections.defaultdict(list)
for x in rows:
    clusters[x['norm']].append(x)

out = []
for n, xs in clusters.items():
    out.append({
        'norm': n,
        'count': len(xs),
        'cases': sorted({x['cid'] for x in xs}),
        'reports': sorted({x['report'] for x in xs}),
        'sample': xs[0]['line'],
        'variants': sorted({x['line'] for x in xs})[:4],
    })
out.sort(key=lambda z: -z['count'])

json.dump({'rows': rows, 'clusters': out}, open('/tmp/rs812/preconds.json', 'w'), indent=1)
print(f"cases {len(CASES)}  precondition lines {len(rows)}  distinct clusters {len(out)}")
print(f"clusters covering >=5 cases: {sum(1 for z in out if len(z['cases'])>=5)}")
print(f"singleton clusters: {sum(1 for z in out if len(z['cases'])==1)}")
print()
for z in out[:30]:
    print(f"{len(z['cases']):4d}  {z['sample'][:120]}")
