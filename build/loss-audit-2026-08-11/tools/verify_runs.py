import json, glob, os, subprocess
live = json.load(open('/tmp/lossaudit/runs-live.json'))
GRADED = ['status_id','comment','defects','elapsed','version','assignedto_id',
          'created_by','created_on','test_id','case_id','id']
ECHO = ['case_title','case_refs']

def load(p):
    d = json.load(open(p))
    if isinstance(d, dict):
        for k in ('results','tests'):
            if k in d: return d[k]
        return None
    return d if isinstance(d, list) else None

for rid in ('357','352','359'):
    L = {r['id']: r for r in live[rid]['results_raw']}
    files = sorted(set(glob.glob(f'build/**/*run{rid}*result*.json', recursive=True)))
    allhist = {}
    used = 0
    for f in files:
        # skip anything committed by the run-sync pass currently in flight
        if '/run-sync-2026-08-11/' in f: continue
        rows = load(f)
        if not rows or not isinstance(rows[0], dict) or 'status_id' not in rows[0]: continue
        used += 1
        for r in rows:
            if 'id' in r: allhist.setdefault(r['id'], r)
    missing = [i for i in allhist if i not in L]
    graded_diffs = []
    for i, old in allhist.items():
        if i not in L: continue
        new = L[i]
        for fld in GRADED:
            if fld in old and old.get(fld) != new.get(fld):
                graded_diffs.append((i, fld, old.get(fld), new.get(fld)))
    echo_diffs = sum(1 for i,old in allhist.items() if i in L
                     for fld in ECHO if fld in old and old.get(fld)!=L[i].get(fld))
    print(f'RUN {rid}: {used} historical snapshot files | {len(allhist)} distinct historical result IDs')
    print(f'   live results={len(L)} | MISSING BY ID={len(missing)} | GRADED FIELD DIFFS={len(graded_diffs)} | echo-only diffs={echo_diffs}')
    if missing: print('   MISSING IDS:', missing[:20])
    if graded_diffs: print('   GRADED:', graded_diffs[:10])
