import sys, json; sys.path.insert(0, 'build/maintenance-reminder-v2')
from mr_lib import api as _api
import time
def api(ep):
    for a in range(12):
        try: return _api(ep)
        except Exception as e:
            if '429' in str(e) or 'Rate' in str(e) or a < 11: time.sleep(min(60, 5 * (a + 1))); continue
            raise
U = 'build/founder-mode/part-lifecycle/update-2026-10-08'
ours = set(range(154752, 154841)) | set(json.load(open(f'{U}/applied/new-case-ids.json')))
runs = []; off = 0
while True:
    rs = api(f"get_runs/1&is_completed=0&limit=250&offset={off}")['runs']; runs += rs
    if len(rs) < 250: break
    off += 250
import os, threading
from concurrent.futures import ThreadPoolExecutor
done = set()
if os.path.exists(f'{U}/run-membership.jsonl'):
    done = {json.loads(l)['run'] for l in open(f'{U}/run-membership.jsonl') if l.strip()}
out = open(f'{U}/run-membership.jsonl', 'a'); lock = threading.Lock()
def scan(run):
    off = 0; found = []
    while True:
        ts = api(f"get_tests/{run['id']}&limit=250&offset={off}")['tests']
        found += [t['case_id'] for t in ts if t['case_id'] in ours]
        if len(ts) < 250: break
        off += 250
    with lock:
        out.write(json.dumps({'run': run['id'], 'name': run['name'], 'part_lifecycle_tests': len(found), 'cases': found}) + '\n'); out.flush()
with ThreadPoolExecutor(3) as ex:
    list(ex.map(scan, [r for r in runs if r['id'] not in done]))
open(f'{U}/run-membership.DONE', 'w').write(f'{len(runs)} runs scanned\n')
