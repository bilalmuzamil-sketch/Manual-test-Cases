import json, sys, datetime
sys.path.insert(0,'.')
from tr import paged, api
from collections import Counter
print('run 352 post-check UTC', datetime.datetime.utcnow().isoformat()+'Z')
st,run=api('get_run/352'); json.dump(run,open('run352-POST.json','w'),indent=1,sort_keys=True)
pre_run=json.load(open('run352-PRE.json'))
print('include_all: pre',pre_run.get('include_all'),'-> post',run.get('include_all'))
for k in ('passed_count','failed_count','blocked_count','untested_count','retest_count','case_ids'):
    if pre_run.get(k)!=run.get(k): print('  run counter moved:',k,pre_run.get(k),'->',run.get(k))
tests=paged('get_tests/352','tests'); json.dump(tests,open('run352-tests-POST.json','w'),indent=1,sort_keys=True)
pt=json.load(open('run352-tests-PRE.json'))
print('tests: pre',len(pt),'-> post',len(tests))
pre_tid={t['id'] for t in pt}; post_tid={t['id'] for t in tests}
pre_cid={t['case_id'] for t in pt}; post_cid={t['case_id'] for t in tests}
print('test-id sets equal BOTH directions:', pre_tid==post_tid, '| missing', pre_tid-post_tid, '| new', post_tid-pre_tid)
print('case_id sets equal BOTH directions:', pre_cid==post_cid, '| missing', pre_cid-post_cid, '| new', post_cid-pre_cid)
LIVE={c['id'] for c in json.load(open('cases-POST.json'))}
print('run case_ids == our 110 live cases, both directions:', post_cid==LIVE)
res=paged('get_results_for_run/352','results'); json.dump(res,open('run352-results-POST.json','w'),indent=1,sort_keys=True)
pre=json.load(open('run352-results-PRE.json'))
print()
print('result records: pre',len(pre),'-> post',len(res))
PRE={r['id']:r for r in pre}; POST={r['id']:r for r in res}
missing=set(PRE)-set(POST); new=set(POST)-set(PRE)
print('PRIOR results MISSING by ID:',len(missing), sorted(missing)[:10])
print('NEW result records:',len(new))
ECHO={'case_title','case_refs'}
changed=[]
for rid in sorted(set(PRE)&set(POST)):
    a,b=PRE[rid],POST[rid]
    for k in set(a)|set(b):
        if a.get(k)!=b.get(k): changed.append((rid,k,a.get(k),b.get(k)))
echo=[c for c in changed if c[1] in ECHO]; real=[c for c in changed if c[1] not in ECHO]
print('prior results with ANY field changed:',len({c[0] for c in changed}))
print('  declared read-time ECHO fields (case_title/case_refs):',len(echo),'records',len({c[0] for c in echo}))
print('  ANY OTHER field moved (= DAMAGE):',len(real), real[:5])
if new:
    print()
    print('=== NEW results are NOT ours - identifying the author ===')
    for rid in sorted(new):
        r=POST[rid]
        print('  result %d  user_id=%s  created_on=%s (%s UTC)  status_id=%s  test_id=%s'%(
            rid, r['created_by'], r['created_on'],
            datetime.datetime.utcfromtimestamp(r['created_on']).isoformat(), r['status_id'], r['test_id']))
    print('  authors of new records:', dict(Counter(POST[r]['created_by'] for r in new)))
print()
print('our user id is 3; Ahtasham Amjad is user id 7')
print('post status_id histogram:', dict(Counter(r['status_id'] for r in res)))
