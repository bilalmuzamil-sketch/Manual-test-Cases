import sys, json; sys.path.insert(0, 'build/maintenance-reminder-v2')
from mr_lib import api
U = 'build/founder-mode/part-lifecycle/update-2026-10-08'
ours = set(range(154752, 154841)) | set(json.load(open(f'{U}/applied/new-case-ids.json')))
runs = []; off = 0
while True:
    rs = api(f"get_runs/1&is_completed=0&limit=250&offset={off}")['runs']; runs += rs
    if len(rs) < 250: break
    off += 250
out = open(f'{U}/run-membership.jsonl', 'w')
for i, run in enumerate(runs):
    off = 0; found = 0
    while True:
        ts = api(f"get_tests/{run['id']}&limit=250&offset={off}")['tests']
        found += sum(1 for t in ts if t['case_id'] in ours)
        if len(ts) < 250: break
        off += 250
    out.write(json.dumps({'i': i, 'run': run['id'], 'name': run['name'], 'part_lifecycle_tests': found}) + '\n'); out.flush()
open(f'{U}/run-membership.DONE', 'w').write(f'{len(runs)} runs scanned\n')
