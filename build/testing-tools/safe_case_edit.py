"""Edit ONE TestRail case safely (Rule 114(d) rewrites, 12 Oct 2026). Usage:
   python3 safe_case_edit.py <case_id> <json file with any of custom_preconds/custom_steps/custom_expected/title>
Guards: our case only (created_by 3), never Vladimir's (1); snapshot + history saved first; only the given fields are sent;
read-back must equal what was sent; untouched fields must be byte-identical; automation flags unchanged.
The served-page container scan (fr-view) is run separately before and after (served_page_scan.mjs)."""
import sys, json, os
sys.path.insert(0, os.path.dirname(__file__)); import tr_client
cid = int(sys.argv[1]); new = json.load(open(sys.argv[2]))
OUT = os.path.join(os.path.dirname(sys.argv[2]))
st, before = tr_client.get(f'get_case/{cid}'); assert st == 200, st
assert before['created_by'] == 3, f'not our case (created_by {before["created_by"]})'
allowed = {'custom_preconds', 'custom_steps', 'custom_expected', 'title'}
assert set(new) <= allowed, set(new) - allowed
for k, v in new.items():
    if k != 'title': assert '<br' not in v.lower(), f'{k}: no <br> from the API (playbook §J)'
st2, hist = tr_client.get(f'get_history_for_case/{cid}')
json.dump({'case': before, 'history': hist}, open(os.path.join(OUT, f'C{cid}-before.json'), 'w'), indent=1)
ust, ub = tr_client.post(f'update_case/{cid}', new)
st3, after = tr_client.get(f'get_case/{cid}')
res = {'case': cid, 'update_http': ust, 'sent': sorted(new)}
res['readback_equal'] = all(after.get(k) == v for k, v in new.items())
res['untouched_equal'] = all(after.get(k) == before.get(k) for k in allowed - set(new))
res['flags_equal'] = (after.get('custom_atmstatus'), after.get('custom_automation_type')) == (before.get('custom_atmstatus'), before.get('custom_automation_type'))
res['automated'] = before.get('custom_atmstatus') == 3
json.dump({'case': after}, open(os.path.join(OUT, f'C{cid}-after.json'), 'w'), indent=1)
with open(os.path.join(OUT, 'write-log.jsonl'), 'a') as f: f.write(json.dumps(res) + '\n')
print(json.dumps(res)); sys.exit(0 if ust == 200 and res['readback_equal'] and res['untouched_equal'] and res['flags_equal'] else 1)
