"""auto_net.py — 2 Nov 2026. Every Automated case (custom_atmstatus 3) in the WO Board tree: was its text changed AFTER it was marked
Automated? Measure = NET difference (L0566): each field's text at the moment of automation (the old value of the first later change of
that field in get_history_for_case; a case created already Automated is dated from creation) against the text now. Re-run AFTER this
pass's edits so they are included. Writes auto_net.json: per case — automation date, changed fields, every change after automation
(date, who, field), ticket keys / PRD versions added in the new text."""
import sys, json, re, html, os
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools'); import tr_client as tr
HERE = os.path.dirname(os.path.abspath(__file__))
inv = json.load(open(os.path.join(HERE, 'inventory.json')))
FIELDS = {'title': 'title', 'custom_preconds': 'set-up', 'custom_steps': 'steps', 'custom_expected': 'expected result'}
plain = lambda s: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', str(s or '')))).strip()
users = {}
def uname(i):
    if i not in users:
        s, u = tr.get(f'get_user/{i}'); users[i] = u.get('name', str(i)) if s == 200 else str(i)
    return users[i]
out = []
for r in inv['cases']:
    s, c = tr.get(f'get_case/{r["id"]}')
    if c.get('custom_atmstatus') != 3: continue
    s, h = tr.get(f'get_history_for_case/{r["id"]}'); h = h.get('history', h) if isinstance(h, dict) else h
    h = sorted(h, key=lambda e: e['created_on'])
    auto_at = None
    for e in h:
        for ch in e.get('changes', []):
            if ch.get('field') == 'custom_atmstatus' and str(ch.get('new_value')) == '3' and auto_at is None: auto_at = e['created_on']
    if auto_at is None: auto_at = c['created_on']
    at_auto, after = {}, []
    for e in h:
        if e['created_on'] <= auto_at: continue
        for ch in e.get('changes', []):
            f = ch.get('field')
            if f not in FIELDS: continue
            after.append({'when': e['created_on'], 'who': uname(e.get('user_id')), 'field': FIELDS[f]})
            if f not in at_auto: at_auto[f] = ch.get('old_text') if ch.get('old_text') is not None else ch.get('old_value')
    changed = [FIELDS[f] for f, old in at_auto.items() if plain(old) != plain(c.get(f))]
    if not changed: continue
    added_keys = sorted(set(re.findall(r'SV-\d+', plain(c.get('custom_expected')) + plain(c.get('title')))) - set(re.findall(r'SV-\d+', ' '.join(plain(v) for v in at_auto.values()))))
    out.append({'id': c['id'], 'title': c['title'], 'by': c['created_by'], 'section': r['section'], 'test_id': r['test_id'], 'run': r['run'],
                'automated_on': auto_at, 'changed_fields': changed, 'changes_after': after, 'last_change': after[-1]['when'] if after else None,
                'keys_added': added_keys, 'prd_now': sorted(set(int(v) for v in re.findall(r'[Vv]ersion (\d+)', plain(c.get('custom_expected')))))[-3:]})
json.dump(out, open(os.path.join(HERE, 'auto_net.json'), 'w'), indent=1)
print('automated cases changed after automation (net):', len(out))
