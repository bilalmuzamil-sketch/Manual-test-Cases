#!/usr/bin/env python3
"""Compact the full raw check rows (/tmp/cln/w2/full/results-*.json, up to 130 MB) into repo-sized
summaries: per-check PASS/FAIL counts plus every non-PASS row (capped at 300 per check, the cap stated).
Writes ../results-<name>.json. SECRET-FREE (rows carry invoice numbers and figures only)."""
import json, os, glob, collections
OUT = os.path.join(os.path.dirname(__file__), '..')
for p in sorted(glob.glob('/tmp/cln/w2/full/results-*.json')):
    rows = json.load(open(p))
    counts = collections.defaultdict(collections.Counter); srcs = {}
    for r in rows:
        k = (r['report'], r['check']); counts[k][r['result']] += 1; srcs[k] = r.get('source', '')
    bad = collections.defaultdict(list)
    for r in rows:
        if r['result'] != 'PASS': bad[(r['report'], r['check'])].append({k: r[k] for k in ('location', 'range', 'result', 'detail') if k in r})
    out = {'full_rows_at': p, 'rows': len(rows), 'totals': dict(collections.Counter(r['result'] for r in rows)),
           'checks': [{'report': k[0], 'check': k[1], 'source': srcs[k], 'counts': dict(v),
                       'non_pass': bad[k][:300], 'non_pass_total': len(bad[k]), 'non_pass_capped': len(bad[k]) > 300} for k, v in counts.items()]}
    name = os.path.basename(p)
    json.dump(out, open(os.path.join(OUT, name), 'w'), indent=1)
    print(name, len(rows), out['totals'], os.path.getsize(os.path.join(OUT, name)))
