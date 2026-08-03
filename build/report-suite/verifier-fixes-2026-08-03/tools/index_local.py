#!/usr/bin/env python3
"""Build the local(internal id) <-> live(C-id) index for Report Suite. READ-ONLY."""
import json, csv, glob, os, sys

ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
ROOT = os.path.abspath(ROOT)          # build/report-suite
CASES = os.path.join(ROOT, 'cases')

idmap = {}
with open(os.path.join(ROOT, 'testrail-id-map.csv')) as fh:
    for row in csv.DictReader(fh):
        idmap[row['internal_id']] = row

local = {}
for path in sorted(glob.glob(os.path.join(CASES, 'cases-*.json'))):
    arr = json.load(open(path))
    for i, c in enumerate(arr):
        local[c['id']] = {'file': os.path.basename(path), 'index': i, 'case': c}

active = {k: v for k, v in local.items() if v['case'].get('viu_status') != 'Retired'}
print('local objects', len(local), 'active', len(active), 'id-map rows', len(idmap))
missing = [k for k in active if k not in idmap]
extra = [k for k in idmap if k not in active]
print('active not in id-map', missing, '| id-map not in local-active', extra)

# reverse: C-id -> internal
rev = {}
for iid, row in idmap.items():
    cid = int(row['testrail_case_id'].lstrip('C'))
    rev[cid] = iid
json.dump({'by_internal': {k: {'file': v['file'], 'index': v['index']} for k, v in local.items()},
           'cid_to_internal': rev},
          open('/tmp/vf/local-index.json', 'w'), indent=1)
if len(sys.argv) > 1:
    for cid in sys.argv[1:]:
        cid = int(cid.lstrip('Cc'))
        iid = rev.get(cid)
        print('---', cid, iid, local[iid]['file'] if iid in local else 'NOT LOCAL')
        if iid in local:
            print(json.dumps(local[iid]['case'], indent=1, ensure_ascii=False))
