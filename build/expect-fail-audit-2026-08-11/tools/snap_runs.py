import sys, json, hashlib
sys.path.insert(0,'/tmp/testrail')
import tr
which=sys.argv[1]
out={}
for rid in (352,357):
    st,run=tr.api(f"get_run/{rid}")
    tests=tr.get_tests(rid); res=tr.get_results_for_run(rid)
    out[rid]={'run':run,'tests':tests,'results':res}
    print(f"run {rid}: include_all={run.get('include_all')} tests={len(tests)} results={len(res)} "
          f"P{run.get('passed_count')} F{run.get('failed_count')} B{run.get('blocked_count')} U{run.get('untested_count')}")
json.dump(out,open(f'runs-{which}.json','w'))
