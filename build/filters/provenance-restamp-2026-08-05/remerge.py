#!/usr/bin/env python3
"""Re-merge the id-map's testrail_case_id AND refs columns FROM LIVE after gen_import.py
blanked/dropped them. Header restored byte-identical to the committed predecessor."""
import csv, json, io
ROOT='/home/user/Manual-test-Cases'
P=f'{ROOT}/build/filters/testrail-id-map.csv'
LIVE={c['id']:c for c in json.load(open('cases-POST.json'))}
before=list(csv.DictReader(open('idmap-BEFORE.csv')))
HDR_BEFORE=open('idmap-BEFORE.csv').readline()
i2c={r['internal_id']: r['testrail_case_id'] for r in before}
gen=list(csv.DictReader(open(P)))
print('generated rows',len(gen),'| committed predecessor rows',len(before))
assert {r['internal_id'] for r in gen}=={r['internal_id'] for r in before}, 'internal_id set changed!'
out=[]; tmis=[]
for r in gen:
    iid=r['internal_id']; cids=i2c[iid]; cid=int(cids.lstrip('C'))
    lv=LIVE[cid]
    if lv['title']!=r['title']: tmis.append((iid,cid,r['title'],lv['title']))
    out.append({'internal_id':iid,'testrail_case_id':cids,'title':r['title'],
                'section':r['section'],'refs':lv.get('refs') or ''})
print('title mismatches generated-vs-live:',len(tmis), tmis[:3])
with open(P,'w',newline='') as fh:
    w=csv.DictWriter(fh, fieldnames=['internal_id','testrail_case_id','title','section','refs'])
    w.writeheader(); w.writerows(out)
# proofs
rows=list(csv.DictReader(open(P)))
print()
print('rows:',len(rows))
print('blank C-ids:',sum(1 for r in rows if not r['testrail_case_id'].strip()))
print('refs populated:',sum(1 for r in rows if r['refs'].strip()),'/',len(rows))
print('header byte-identical to committed predecessor:', open(P).readline()==HDR_BEFORE)
# refs + titles byte-equal to live, both directions
nr=sum(1 for r in rows if (LIVE[int(r['testrail_case_id'].lstrip('C'))].get('refs') or '')==r['refs'])
nt=sum(1 for r in rows if LIVE[int(r['testrail_case_id'].lstrip('C'))]['title']==r['title'])
print('refs byte-equal to live:',nr,'/110 | titles byte-equal to live:',nt,'/110')
idset={int(r['testrail_case_id'].lstrip('C')) for r in rows}
print('id-map C-id set == live case set, BOTH directions:', idset==set(LIVE),
      '| missing',set(LIVE)-idset,'| extra',idset-set(LIVE))
# did refs change vs the committed predecessor?
b2={r['internal_id']:r['refs'] for r in before}
ch=[(r['internal_id'],b2[r['internal_id']],r['refs']) for r in rows if b2[r['internal_id']]!=r['refs']]
print('refs values differing from the committed predecessor:',len(ch), ch[:3])
