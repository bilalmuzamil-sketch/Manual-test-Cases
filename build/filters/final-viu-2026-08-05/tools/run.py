import json, sys
sys.path.insert(0,'/tmp/fv')
from tr import api, paged
tag=sys.argv[1]
s,run=api('get_run/352'); print('run352 http',s,'| include_all',run.get('include_all'),'| P',run.get('passed_count'),'F',run.get('failed_count'),'B',run.get('blocked_count'),'U',run.get('untested_count'),'R',run.get('retest_count'))
tests=paged('get_tests/352','tests'); print('tests',len(tests))
res=paged('get_results_for_run/352','results'); print('results',len(res))
json.dump(run,open(f'/tmp/fv/run352-run-{tag}.json','w'),indent=1)
json.dump(tests,open(f'/tmp/fv/run352-tests-{tag}.json','w'),indent=1)
json.dump(res,open(f'/tmp/fv/run352-results-{tag}.json','w'),indent=1)
from collections import Counter
print('by user', dict(Counter(r['created_by'] for r in res)))
print('by status', dict(Counter(r['status_id'] for r in res)))
