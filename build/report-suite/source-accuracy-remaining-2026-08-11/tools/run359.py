import json,sys
sys.path.insert(0,'/tmp/testrail'); import tr
t=tr.get_tests(359); r=tr.get_results_for_run(359)
st,run=tr.api('get_run/359')
json.dump({'run':run,'tests':t,'results':r},open(sys.argv[1],'w'),indent=1,sort_keys=True)
print('run359 include_all',run.get('include_all'),'| tests',len(t),'| results',len(r))
