import sys, json
sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
import tr_client as tr
RUN=359
tag=sys.argv[1]
# get run
st,run = tr.get('get_run/%d'%RUN)
# tests
tests=[]; off=0
while True:
    s,d=tr.get('get_tests/%d&limit=250&offset=%d'%(RUN,off))
    if s!=200: raise SystemExit('get_tests %s %s'%(s,d))
    ch=d['tests'] if isinstance(d,dict) and 'tests' in d else d
    tests.extend(ch)
    if len(ch)==250: off+=250
    else: break
# results for run
res=[]; off=0
while True:
    s,d=tr.get('get_results_for_run/%d&limit=250&offset=%d'%(RUN,off))
    if s!=200: raise SystemExit('get_results_for_run %s %s'%(s,d))
    ch=d['results'] if isinstance(d,dict) and 'results' in d else d
    res.extend(ch)
    if len(ch)==250: off+=250
    else: break
snap={'run_include_all':run.get('include_all'),'run_updated_on':run.get('updated_on'),
      'test_count':len(tests),
      'test_ids':sorted(t['id'] for t in tests),
      'case_ids':sorted(t['case_id'] for t in tests),
      # graded result records keyed by id -> status_id (0/None=comment only)
      'results':{r['id']:{'status_id':r.get('status_id'),'test_id':r.get('test_id')} for r in res},
      'result_count':len(res)}
json.dump(snap, open('run359-%s.json'%tag,'w'), indent=0)
print('run359 %s: include_all=%s tests=%d results=%d'%(tag,snap['run_include_all'],snap['test_count'],snap['result_count']))
