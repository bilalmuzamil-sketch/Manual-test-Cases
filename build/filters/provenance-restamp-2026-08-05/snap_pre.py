import json, sys, datetime
sys.path.insert(0,'.')
from tr import paged, api
from collections import Counter
print('UTC', datetime.datetime.utcnow().isoformat()+'Z')
secs = paged('get_sections/1&suite_id=1','sections')
by_id={s['id']:s for s in secs}
def anc(s):
    out=[]; cur=s
    while cur: out.append(cur['id']); cur=by_id.get(cur.get('parent_id'))
    return out
filt=[s for s in secs if 4110 in anc(s)]
print('sections total', len(secs), '| filters subtree', len(filt))
ids={s['id'] for s in filt}
cases = paged('get_cases/1&suite_id=1','cases')
ours=[c for c in cases if c['section_id'] in ids]
print('cases in suite', len(cases), '| under group 4110:', len(ours))
print('created_by histogram:', dict(Counter(c['created_by'] for c in ours)))
json.dump(ours, open('cases-PRE.json','w'), indent=1, sort_keys=True)
# run 352
st,run=api('get_run/352'); print('run352 http',st,'include_all',run.get('include_all'),'name',run.get('name'))
json.dump(run, open('run352-PRE.json','w'), indent=1, sort_keys=True)
tests=paged('get_tests/352','tests'); print('run352 tests', len(tests))
json.dump(tests, open('run352-tests-PRE.json','w'), indent=1, sort_keys=True)
res=paged('get_results_for_run/352','results'); print('run352 result records', len(res))
json.dump(res, open('run352-results-PRE.json','w'), indent=1, sort_keys=True)
print('result authors:', dict(Counter(r['created_by'] for r in res)))
print('status_id histogram:', dict(Counter(r['status_id'] for r in res)))
