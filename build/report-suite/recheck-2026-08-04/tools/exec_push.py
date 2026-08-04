#!/usr/bin/env python3
"""Report Suite RE-CHECK push — Rule 50 EXHAUSTIVE then EXACT.

Per operation:
  1. re-GET the case and prove it still byte-matches the pre-write snapshot (nobody moved it)
  2. update_case with ONLY the intended field(s)
  3. re-GET and compare FIELD BY FIELD:
       - every INTENDED field byte-equal to the intended value
       - every OTHER field byte-identical to the pre-write snapshot (VOLATILE excepted)
  4. a MISMATCH means the write FAILED -> stop the batch, dump both byte sequences, do not retry.

DECLARED NORMALISATION (the only one, recorded in APP-ACTIONS-PLAYBOOK §J):
  `refs` splits on commas, trims, rejoins with a bare comma. We do not write refs in this pass,
  but the guard is kept so a silent normalisation cannot masquerade as success.

Rule 38: refuses any case whose created_by != 3, and hard-refuses the 5 known foreign ids.
"""
import json, os, sys, time, argparse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tr

HERE=os.path.dirname(os.path.abspath(__file__))
DATA=os.path.join(HERE,'..','data')
VOLATILE={'updated_on','updated_by'}

def norm_refs(s): return ','.join(p.strip() for p in (s or '').split(','))

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--limit',type=int,default=0)
    ap.add_argument('--offset',type=int,default=0)
    ap.add_argument('--dry-run',action='store_true')
    a=ap.parse_args()

    snap={str(c['id']):c for c in json.load(open(os.path.join(DATA,'live-cases-START.json')))}
    plan=json.load(open(os.path.join(DATA,'restamp-plan.json')))
    fix=json.load(open(os.path.join(DATA,'c30590-fix.json')))

    # fold the C30590 text correction INTO its re-stamp row so the case is written once
    for row in plan:
        if row['id']==fix['id']:
            assert fix['old'] in row['after'], 'C30590: old text absent from the re-stamped body'
            row['after']=row['after'].replace(fix['old'], fix['new'])
            row['note']='ALSO corrects expected item 4 — the new "Date Range:" line made the "first line" claim false'
    plan.sort(key=lambda r:r['id'])
    if a.offset: plan=plan[a.offset:]
    if a.limit: plan=plan[:a.limit]
    print(f'operations to run: {len(plan)}')
    if a.dry_run:
        for r in plan[:3]: print(' DRY', r['id'], r['after'].splitlines()[-1][:120])
        return

    logp=os.path.join(HERE,'..','exec-log.jsonl')
    ok=0; fail=0
    for i,row in enumerate(plan,1):
        cid=row['id']
        if cid in tr.FOREIGN:
            print(f'REFUSE foreign {cid}'); continue
        pre=snap.get(str(cid))
        if not pre: print(f'REFUSE no snapshot {cid}'); fail+=1; break
        if pre.get('created_by')!=3:
            print(f'REFUSE not ours {cid} created_by={pre.get("created_by")}'); fail+=1; break

        # ---- 1. re-GET and prove unchanged since the snapshot
        s,cur=tr.api(f'get_case/{cid}')
        if s!=200: print(f'FAIL get_case {cid} -> {s} {cur}'); fail+=1; break
        drift=[k for k in set(pre)|set(cur) if k not in VOLATILE and pre.get(k)!=cur.get(k)]
        if drift:
            print(f'FAIL {cid} DRIFTED since snapshot on {drift}'); fail+=1; break

        intended={'custom_expected':row['after']}
        # ---- 2. write
        s,resp=tr.api(f'update_case/{cid}', intended)
        if s!=200: print(f'FAIL update_case {cid} -> {s} {resp}'); fail+=1; break

        # ---- 3. re-GET and verify EVERY field
        s,post=tr.api(f'get_case/{cid}')
        if s!=200: print(f'FAIL re-GET {cid} -> {s}'); fail+=1; break
        mism=[]; compared=0
        for k in sorted(set(pre)|set(post)|set(intended)):
            if k in VOLATILE: continue
            compared+=1
            want = intended[k] if k in intended else pre.get(k)
            got  = post.get(k)
            if k=='refs': want,got = norm_refs(want), norm_refs(got)
            if want!=got: mism.append({'field':k,'want':repr(want)[:400],'got':repr(got)[:400]})
        rec={'op':i,'case_id':cid,'http':200,'fieldsCompared':compared,
             'intendedFields':list(intended),'verified':not mism,
             'note':row.get('note'),'at':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())}
        with open(logp,'a') as f: f.write(json.dumps(rec)+'\n')
        if mism:
            print(f'FAIL {cid} MISMATCH after write:'); 
            for m in mism: print('   ',m)
            fail+=1; break
        ok+=1
        if i%25==0 or i==len(plan): print(f'  ... {i}/{len(plan)}  ok={ok} fail={fail}')
    print(f'DONE ok={ok} fail={fail}')
    return 0 if fail==0 else 1

if __name__=='__main__': sys.exit(main())
