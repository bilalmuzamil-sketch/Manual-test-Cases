"""21 Oct 2026 — QA lead chose (a) for C581895: re-run with technicians whose two names are the same, and correct the out-of-date setup
sentence. Settings > Staff shows the LOGIN name (L0497), so step 2 only gives the staff record name when the two names match. Preconditions
only (Rule 114: custom_expected is never touched). Before/after snapshots beside this file; --write to apply."""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../testing-tools'))
import tr_client as t
D = os.path.dirname(os.path.abspath(__file__)); CID = 581895
OLD = ("<li>Where the site allows it, each technician's staff record name differs from the name on their sign-in account (for example staff record "
       "ZZAUTOTEST Staffname Ana, account ZZAUTOTEST Account Ana). On staging the two names cannot differ, because renaming either one renames both, "
       "so there every name simply has to match Settings &gt; Staff.</li>")
NEW = ("<li>Each technician's staff record name is the same as the name on their sign-in account, because Settings &gt; Staff shows the "
       "sign-in account name and step 2 must give the staff record name.<br>For example: on staging, Esther Howard and Ralph Edwards. "
       "Do not use a technician whose two names differ (on staging, the sign-in account Carol Neal, whose staff record reads David Sparks).</li>")
s, c = t.get(f'get_case/{CID}'); assert s == 200 and c['created_by'] != 1
pre = c['custom_preconds']; assert pre.count(OLD) == 1, 'sentence not found exactly once'
json.dump({'custom_preconds': pre}, open(os.path.join(D, f'C{CID}-before.json'), 'w'), indent=1)
after = pre.replace(OLD, NEW)
if '--write' in sys.argv:
    s, r = t.post(f'update_case/{CID}', {'custom_preconds': after}); print('update_case', s)
    s, c2 = t.get(f'get_case/{CID}'); ok = c2['custom_preconds'] == after and c2['custom_expected'] == c['custom_expected'] and c2['custom_steps'] == c['custom_steps']
    json.dump({'custom_preconds': c2['custom_preconds']}, open(os.path.join(D, f'C{CID}-after.json'), 'w'), indent=1); print('read back ok', ok)
else:
    print('dry run: sentence found; atmstatus', c.get('custom_atmstatus'))
