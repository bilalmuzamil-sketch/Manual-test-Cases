#!/usr/bin/env python3
"""Deliverable checks: shredding guard, id-map re-merge from live, four-count set equality,
import header hash against peers."""
import json,os,sys,csv,hashlib,glob,re
HERE=os.path.dirname(os.path.abspath(__file__)); D=os.path.dirname(HERE); RS=os.path.dirname(D); ROOT=os.path.dirname(os.path.dirname(RS))
IMPORT=os.path.join(ROOT,'testrail-import')
POST={c['id']:c for c in json.load(open(f'{D}/POST/cases-4281.json')) if c['created_by']==3}
IDMAP=os.path.join(RS,'testrail-id-map.csv')
# ---- 1. shredding guard: a newline between EVERY character
def shredded(s):
    if not s or len(s)<12: return False
    seg=s[:120]
    letters=sum(1 for ch in seg if ch not in '\n\r')
    nl=seg.count('\n')
    return nl>0 and letters>0 and nl >= letters-2
bad=[]
for f in sorted(glob.glob(os.path.join(IMPORT,'*eport-Suite*csv')))+[os.path.join(IMPORT,'report-suite-v1-testrail-import.csv')]:
    with open(f,newline='',encoding='utf-8-sig') as fh:
        for i,row in enumerate(csv.reader(fh)):
            if i==0: continue
            for j,cell in enumerate(row):
                if shredded(cell): bad.append((os.path.basename(f),i,j)); break
print("SHREDDING GUARD: rows carrying the signature =",len(bad), bad[:3] if bad else "-> PASSED")
# ---- 2. id-map: re-merge C-ids + refs from live (the generator blanks/drops them)
rows=list(csv.DictReader(open(IDMAP)))
live_by_title={}
for cid,c in POST.items(): live_by_title.setdefault(c['title'],[]).append(cid)
blank=[r for r in rows if not r.get('testrail_case_id')]
norefs=[r for r in rows if not r.get('refs')]
print(f"id-map BEFORE remerge: rows={len(rows)} blank C-ids={len(blank)} missing refs={len(norefs)}")
if blank or norefs:
    prev=None
    # recover from git HEAD version of the id-map
    import subprocess
    old=subprocess.run(['git','show','HEAD:build/report-suite/testrail-id-map.csv'],capture_output=True,text=True,cwd=ROOT).stdout
    oldrows={r['internal_id']:r for r in csv.DictReader(old.splitlines())}
    added={a['internal_id']:a for a in json.load(open(f'{D}/added-cases.json'))}
    plan={a['internal_id']:a for a in json.load(open(f'{D}/writeplan.json'))['adds']}
    for r in rows:
        iid=r['internal_id']
        if not r.get('testrail_case_id'):
            if iid in added: r['testrail_case_id']='C%d'%added[iid]['case_id']
            elif iid in oldrows: r['testrail_case_id']=oldrows[iid]['testrail_case_id']
        cid=int(r['testrail_case_id'].lstrip('C'))
        r['refs']=POST[cid]['refs'] or ''
    with open(IDMAP,'w',newline='') as fh:
        w=csv.DictWriter(fh,fieldnames=['internal_id','testrail_case_id','title','section','refs'])
        w.writeheader()
        for r in rows: w.writerow({k:r[k] for k in w.fieldnames})
    rows=list(csv.DictReader(open(IDMAP)))
print(f"id-map AFTER  remerge: rows={len(rows)} blank C-ids={len([r for r in rows if not r['testrail_case_id']])} refs present={len([r for r in rows if r['refs']])}")
# refs + titles byte-equal to live
mm=[r['internal_id'] for r in rows if POST[int(r['testrail_case_id'].lstrip('C'))]['refs']!=(r['refs'] or None) and (POST[int(r['testrail_case_id'].lstrip('C'))]['refs'] or '')!=r['refs']]
tt=[r['internal_id'] for r in rows if POST[int(r['testrail_case_id'].lstrip('C'))]['title']!=r['title']]
print("id-map refs differing from live:",len(mm),"| titles differing from live:",len(tt), (mm+tt)[:4])
# ---- 3. FOUR COUNTS, set-equal BOTH directions
liveids={'C%d'%c for c in POST}
mapids={r['testrail_case_id'] for r in rows}
localids=set()
for f in glob.glob(os.path.join(RS,'cases','*.json')):
    for c in json.load(open(f)):
        if not str(c.get("viu_status","")).startswith("Retired"): localids.add(c["id"])
mapiids={r['internal_id'] for r in rows}
imp=0
with open(os.path.join(IMPORT,'report-suite-v1-testrail-import.csv'),newline='',encoding='utf-8-sig') as fh:
    imp=sum(1 for i,_ in enumerate(csv.reader(fh)) if i>0)
print(f"\nFOUR COUNTS: live-ours {len(liveids)} | local-active {len(localids)} | id-map {len(rows)} | import rows {imp}")
print("  live vs id-map C-ids: only-live",sorted(liveids-mapids)[:5],"only-map",sorted(mapids-liveids)[:5])
print("  local vs id-map internal ids: only-local",sorted(localids-mapiids)[:5],"only-map",sorted(mapiids-localids)[:5])
print("  ALL FOUR EQUAL:", len(liveids)==len(localids)==len(rows)==imp and liveids==mapids and localids==mapiids)
# ---- 4. import header sha256 vs peers
def hdr(p):
    with open(p,'rb') as fh: return hashlib.sha256(fh.readline().rstrip(b'\r\n')).hexdigest()
peers=['fees-discounts-v1-testrail-import.csv','simple-flow-v1-testrail-import.csv',
 'global-search-v2-testrail-import.csv','filters-v1-testrail-import.csv','schedule-v1-testrail-import.csv']
mine=hdr(os.path.join(IMPORT,'report-suite-v1-testrail-import.csv'))
print("\nimport header sha256:",mine[:16])
for p in peers:
    fp=os.path.join(IMPORT,p)
    print(f"   {p:44s} {'IDENTICAL' if os.path.exists(fp) and hdr(fp)==mine else 'DIFFERS/absent'}")
