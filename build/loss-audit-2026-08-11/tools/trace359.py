import json, glob
live = json.load(open('/tmp/lossaudit/runs-live.json'))
L = {r['id'] for r in live['359']['results_raw']}
missing = set()
src = {}
for f in sorted(glob.glob('build/**/*run359*result*.json', recursive=True)):
    if '/run-sync-2026-08-11/' in f: continue
    d = json.load(open(f))
    rows = d['results'] if isinstance(d,dict) and 'results' in d else d
    if not isinstance(rows,list) or not rows or not isinstance(rows[0],dict) or "status_id" not in rows[0]: continue
    for r in rows:
        if r['id'] not in L:
            missing.add(r['id'])
            src.setdefault(r['id'], []).append((f, r.get('case_id'), r.get('status_id'), r.get('created_on')))
print('missing count:', len(missing))
cases = sorted({v[0][1] for v in src.values()})
print('their case_ids:', cases)
for i in sorted(missing):
    f, cid, st, on = src[i][0]
    print(f'  result {i} | case C{cid} | status {st} | files={len(src[i])} | first={f.split("/")[2]}')
