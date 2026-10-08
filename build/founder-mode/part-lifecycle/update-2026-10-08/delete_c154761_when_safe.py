# QA lead 2026-10-08 "1. Yes": delete C154761 — only if the full open-run scan proves it is in no run.
import sys, json, time, os; sys.path.insert(0, 'build/maintenance-reminder-v2')
from mr_lib import api
U = 'build/founder-mode/part-lifecycle/update-2026-10-08'
while not os.path.exists(f'{U}/run-membership.DONE'): time.sleep(60)
rows = [json.loads(l) for l in open(f'{U}/run-membership.jsonl') if l.strip()]
holding = [r for r in rows if 154761 in r.get('cases', [])]
early = [r for r in rows if 'cases' not in r and r['part_lifecycle_tests']]  # first-pass rows had counts only
res = {'runs_scanned': len(rows), 'runs_with_any_part_lifecycle_case': [(r['run'], r['name'], r['part_lifecycle_tests']) for r in rows if r['part_lifecycle_tests']]}
if holding or early:
    res['deleted'] = False; res['why'] = 'C154761 (or an unresolved count) is in an open run — not deleted; QA lead to decide'
else:
    c = api('get_case/154761'); assert c['created_by'] == 3
    snap = json.load(open(f'{U}/retired-2026-10-08/C154761.json')); assert c['updated_on'] == snap['updated_on']
    api('delete_case/154761', {})
    try: api('get_case/154761'); res['deleted'] = False; res['why'] = 'still readable after delete'
    except Exception as e: res['deleted'] = True; res['verify'] = f'get_case now fails: {str(e)[:60]}'
json.dump(res, open(f'{U}/applied/c154761-delete-result.json', 'w'), indent=1)
