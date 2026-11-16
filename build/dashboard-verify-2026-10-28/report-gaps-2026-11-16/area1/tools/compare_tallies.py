#!/usr/bin/env python3
"""Area 1: compare each re-run results file's PASS/FAIL tallies with the 28 Oct file of the same name (counts only).
Usage: compare_tallies.py <worker folder name>"""
import json, sys, os, glob, collections
B = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28'; w = sys.argv[1]
def tally(j):
    if isinstance(j, dict) and 'tally' in j: return {str(k): v for k, v in j['tally'].items()} if isinstance(j['tally'], dict) else j['tally']
    rows = j.get('rows') if isinstance(j, dict) and isinstance(j.get('rows'), list) else j.get('checks') if isinstance(j, dict) and isinstance(j.get('checks'), list) else j if isinstance(j, list) else None
    if rows is None: return {'keys': list(j.keys())[:8]} if isinstance(j, dict) else None
    c = collections.Counter((r.get('result') or r.get('verdict') or r.get('status') or '?') if isinstance(r, dict) else '?' for r in rows); return dict(c)
for new in sorted(glob.glob(f'{B}/report-gaps-2026-11-16/area1/{w}/results-*.json')):
    n = os.path.basename(new); old = f'{B}/reports/{w}/{n}'
    try: tn = tally(json.load(open(new)))
    except Exception as e: tn = f'ERR {e}'
    to = tally(json.load(open(old))) if os.path.exists(old) else 'no 28 Oct file'
    print(f'{n}\n   28 Oct: {json.dumps(to)[:300]}\n   16 Nov: {json.dumps(tn)[:300]}')
