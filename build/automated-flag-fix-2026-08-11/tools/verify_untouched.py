import json, hashlib
def sha(p): return hashlib.sha256(open(p,'rb').read()).hexdigest()
rep=[]
pre=json.load(open('../snapshots/CASES-PRE.json')); post=json.load(open('../snapshots/CASES-POST.json'))
assert set(pre)==set(post), 'case id set moved'
mismatch=[]; fields=0
for cid in pre:
    a,b=pre[cid],post[cid]
    keys=set(a)|set(b)
    for k in keys:
        fields+=1
        if a.get(k)!=b.get(k): mismatch.append((cid,k,a.get(k),b.get(k)))
rep.append(f"CASES: {len(pre)} cases, {fields} field comparisons, {len(mismatch)} mismatches")
rep.append(f"  includes updated_on/updated_by: {'updated_on' in next(iter(pre.values())) and 'updated_by' in next(iter(pre.values()))}")
for m in mismatch[:20]: rep.append(f"  MISMATCH {m}")
rows=json.load(open('rows.json'))
foreign={str(r['id']) for r in rows if r['created_by']!=3}
rep.append(f"  of which foreign (Rule 38): {len(foreign)} cases, mismatches among them: {sum(1 for m in mismatch if m[0] in foreign)}")

pre=json.load(open('../snapshots/RUNS-PRE.json')); post=json.load(open('../snapshots/RUNS-POST.json'))
for rid in ('352','359'):
    A,B=pre[rid],post[rid]
    ra,rb=A['results'],B['results']
    missing=[i for i in ra if i not in rb]; new=[i for i in rb if i not in ra]
    changed=[(i,k) for i in ra if i in rb for k in set(ra[i])|set(rb[i]) if ra[i].get(k)!=rb[i].get(k)]
    rep.append(f"RUN {rid}: include_all {A['run']['include_all']} -> {B['run']['include_all']}; "
               f"tests {A['test_count']} -> {B['test_count']}; results {A['result_count']} -> {B['result_count']}")
    rep.append(f"  case_id sets equal both ways: {set(A['case_ids'])==set(B['case_ids'])}; "
               f"test_id sets equal both ways: {set(A['test_ids'])==set(B['test_ids'])}")
    rep.append(f"  prior results missing BY ID: {len(missing)}; new results: {len(new)}; "
               f"result fields changed (incl. case_refs/case_title echoes): {len(changed)}")
    rep.append(f"  run counters: passed {A['run']['passed_count']}->{B['run']['passed_count']} "
               f"failed {A['run']['failed_count']}->{B['run']['failed_count']} "
               f"blocked {A['run']['blocked_count']}->{B['run']['blocked_count']} "
               f"untested {A['run']['untested_count']}->{B['run']['untested_count']} "
               f"run.updated_on {A['run']['updated_on']}->{B['run']['updated_on']}")
rep.append(f"FILE SHA256 CASES  PRE {sha('../snapshots/CASES-PRE.json')}")
rep.append(f"FILE SHA256 CASES  POST {sha('../snapshots/CASES-POST.json')}")
rep.append(f"FILE SHA256 RUNS   PRE {sha('../snapshots/RUNS-PRE.json')}")
rep.append(f"FILE SHA256 RUNS   POST {sha('../snapshots/RUNS-POST.json')}")
txt='\n'.join(rep); print(txt); open('../evidence/untouched-proof.txt','w').write(txt+'\n')
