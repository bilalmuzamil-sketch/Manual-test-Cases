import json, sys, collections
sys.path.insert(0, '/tmp/job12')
from tr import api
c = json.load(open('/tmp/job12/census.json'))
FOREIGN = {'Filters': {43576,43577,43578,43579,43580},
           'Report Suite': {38919,38920,38921,38922,38923,43567,43568,43569,43570,43571,43572,43573},
           'Schedule': set()}
out = {}
for proj, r in c.items():
    holds = [x for x in r['rows'] if x['kind'] == 'HOLD' and x['id'] not in FOREIGN[proj]]
    # group identical reasons
    g = collections.Counter(x['reason'] for x in holds)
    out[proj] = {'holds': holds, 'reason_groups': g.most_common()}
    print(f'===== {proj}: {len(holds)} held')
    for reason, n in g.most_common():
        print(f'   [{n:2}] {reason}')
    # results logged against held cases
    tests = []
    off = 0
    while True:
        d, s = api(f"get_tests/{r['run']}&limit=250&offset={off}")
        ts = d.get('tests', d) if isinstance(d, dict) else d
        tests += ts
        if len(ts) < 250: break
        off += 250
    hid = {x['id'] for x in holds}
    graded = [t for t in tests if t['case_id'] in hid and t.get('status_id') not in (None, 3)]
    print(f'   held cases already GRADED in run {r["run"]}: {len(graded)}')
    for t in graded[:12]:
        print(f'      C{t["case_id"]} status_id={t["status_id"]}  {t["title"][:60]}')
    out[proj]['graded_holds'] = [{'case_id': t['case_id'], 'status_id': t['status_id'], 'title': t['title']} for t in graded]
json.dump(out, open('/tmp/job12/holds.json', 'w'), indent=1, default=str)
