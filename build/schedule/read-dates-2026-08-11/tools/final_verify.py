import tr, json, re, collections, datetime as dt
PRE=json.load(open('../snapshots/cases-PRE.json')); PLAN=json.load(open('/tmp/stamp_plan.json'))
post={}
for cid in PRE:
    s,d = tr.req(f'get_case/{cid}'); assert s==200,(cid,s); post[cid]=d
json.dump(post, open('../snapshots/cases-POST.json','w'), indent=1)
print('re-read live:', len(post))
fail=[]
for cid,c in post.items():
    want = PLAN[cid]['body']+PLAN[cid]['new']
    if c['custom_expected']!=want: fail.append((cid,'expected'))
    for k in set(PRE[cid])|set(c):
        if k in ('custom_expected','updated_on','updated_by'): continue
        if PRE[cid].get(k)!=c.get(k): fail.append((cid,k))
print('FIELD MISMATCHES:', len(fail), fail[:10])
# read-date census
noread=[cid for cid,c in post.items() if 'read on 11 August 2026' not in c['custom_expected']]
print('cases with NO read-date:', len(noread), noread)
cnt=collections.Counter(c['custom_expected'].count('read on 11 August 2026') for c in post.values())
print('read-dates per case:', dict(sorted(cnt.items())))
# sentence 2 preserved exactly
s2=[cid for cid,c in post.items()
    if (PRE[cid]['custom_expected'].split('Last checked',1)[1:] != c['custom_expected'].split('Last checked',1)[1:])]
print('sentence-2 changed on:', s2)
# invariants
bad=[]
for cid,c in post.items():
    e=c['custom_expected']
    m=[l for l in e.split('\n') if l.strip().startswith('AUTOMATION:')]
    if len(m)!=1: bad.append((cid,'markers',len(m)))
    if e.count('This is the expected behaviour as per')!=1: bad.append((cid,'prov'))
    if re.search(r'</?(p|ol|ul|li|br)\b', e, re.I): bad.append((cid,'markup'))
    if 'as per the build tested on' in e: bad.append((cid,'barred'))
    if not e.rstrip().endswith(('AUTOMATION: READY',)) and 'AUTOMATION: HOLD' not in e and 'EXPECT FAIL' not in e: bad.append((cid,'marker-not-last'))
print('invariant breaches:', bad)
# CORRECTED 2026-08-11: 1 ('Not Automated') is the EXPECTED value on a case we
# created (testrail_add_case.py::verify_created_case); 3 is Vlad's own flag and is
# the EXCEPTION to report (Rule 65), never the pass condition.
print('atmstatus==1 after (expected on cases we created):', sum(1 for v in post.values() if v.get('custom_atmstatus')==1))
print('atmstatus==3 after (Automated - TELL VLAD if we changed any, Rule 65):', [k for k,v in post.items() if v.get('custom_atmstatus')==3])
print('created_by not 3:', [k for k,v in post.items() if v.get('created_by')!=3])
print('verified at', dt.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'))
