import sys,json
sys.path.insert(0,'/tmp/testrail'); import tr
base=json.load(open('/tmp/testrail/run359-BASELINE-2026-08-10.json'))
def pull(path,key):
    out,off=[],0
    while True:
        st,b=tr.api(f"{path}&limit=250&offset={off}")
        if st!=200: raise RuntimeError((path,st,b))
        ch=b[key] if isinstance(b,dict) else b
        out+=ch
        if len(ch)<250: break
        off+=250
    return out
st,run=tr.api("get_run/359")
tests=pull("get_tests/359",'tests'); res=pull("get_results_for_run/359",'results')
bc=set(base['tests']); nc=set(t['case_id'] for t in tests)
bt=set(base['test_ids']); nt=set(t['id'] for t in tests)
print("include_all:",run.get('include_all'))
print("tests  baseline %d  now %d"%(len(base['tests']),len(tests)))
print("case_id sets EQUAL BOTH WAYS:", bc==nc, "| only-baseline",len(bc-nc),"| only-now",len(nc-bc))
print("test_id sets EQUAL BOTH WAYS:", bt==nt, "| only-baseline",len(bt-nt),"| only-now",len(nt-bt))
bmap={r['id']:r for r in base['results']}; nmap={r['id']:r for r in res}
print("results baseline %d  now %d"%(len(bmap),len(nmap)))
missing=[i for i in bmap if i not in nmap]
print("prior results MISSING BY ID:",len(missing))
GRADED=['test_id','status_id','comment','defects','elapsed','version','assignedto_id','created_by','created_on']
chg=[]
for i,b in bmap.items():
    n=nmap.get(i)
    if not n: continue
    for f in GRADED:
        if b.get(f)!=n.get(f): chg.append((i,f,b.get(f),n.get(f)))
print("GRADED-FIELD CHANGES on prior results:",len(chg),chg[:6])
new=[r['id'] for r in res if r['id'] not in bmap]
print("NEW results during our window:",len(new))
