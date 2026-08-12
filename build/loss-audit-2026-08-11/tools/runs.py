import sys, json; sys.path.insert(0,'/tmp/testrail')
import tr
out={}
for rid in (357,352,359):
    st,run = tr.api(f'get_run/{rid}')
    tests=[]; off=0
    while True:
        s,b = tr.api(f'get_tests/{rid}&limit=250&offset={off}')
        chunk = b['tests'] if isinstance(b,dict) and 'tests' in b else b
        tests += chunk
        if len(chunk)<250: break
        off += 250
    res=[]; off=0
    while True:
        s,b = tr.api(f'get_results_for_run/{rid}&limit=250&offset={off}')
        chunk = b['results'] if isinstance(b,dict) and 'results' in b else b
        res += chunk
        if len(chunk)<250: break
        off += 250
    out[rid]={'include_all':run.get('include_all'),'name':run.get('name'),
              'tests':len(tests),'results':len(res),
              'case_ids':sorted({t['case_id'] for t in tests}),
              'result_ids':sorted({r['id'] for r in res}),
              'results_raw':res,
              'counts':{k:run.get(k) for k in ('passed_count','failed_count','blocked_count','untested_count','retest_count')}}
    print(rid, out[rid]['name'], '| include_all=',out[rid]['include_all'],
          '| tests=',out[rid]['tests'],'| results=',out[rid]['results'], '|', out[rid]['counts'])
json.dump(out, open('runs-live.json','w'))
