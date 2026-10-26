"""26 Oct 2026 — for the QA lead's sheet "tests automated first and then changed, and WHY". For each Automated case in the
23 Oct list (+ any Automated case changed since), read get_history_for_case and, for every change made AFTER it was marked
Automated, record: date, who, fields, PRD version named before -> after, ticket keys added/removed, and a short text diff.
Output: history-why.json (one row per case, list of changes)."""
import sys, re, json, html, difflib, datetime
sys.path.insert(0, 'build/testing-tools'); import tr_client as t
OUT = 'build/wo-board-tech-view/automated-changed-why-2026-10-26/'
ids = [int(x) for x in re.findall(r'cases/view/(\d+)\)', open('build/wo-board-tech-view/AUTOMATED-TESTS-CHANGED-2026-10-23.md').read())]
ids = list(dict.fromkeys(ids))
FIELDS = {'custom_preconds': 'set-up', 'custom_steps': 'steps', 'custom_expected': 'expected result', 'title': 'title'}
def plain(s): return html.unescape(re.sub(r'<[^>]+>', ' ', s or '')).replace('\xa0', ' ')
def vers(s): return sorted(set(int(v) for v in re.findall(r'[Vv]ersion (\d+)', plain(s))))
def keys(s): return sorted(set(re.findall(r'SV-\d+', plain(s))))
rows = []
for cid in ids:
    s, c = t.get(f'get_case/{cid}')
    s, h = t.get(f'get_history_for_case/{cid}')
    h = h.get('history', h) if isinstance(h, dict) else h
    h = sorted(h, key=lambda e: e['created_on'])
    auto_at = None; changes = []
    for e in h:
        for ch in e.get('changes', []):
            if ch.get('field') == 'custom_atmstatus' and str(ch.get('new_value')) == '3': auto_at = e['created_on']
    for e in h:
        if auto_at is None or e['created_on'] <= auto_at: continue
        for ch in e.get('changes', []):
            f = ch.get('field')
            if f not in FIELDS: continue
            o, n = ch.get('old_text') or ch.get('old_value') or '', ch.get('new_text') or ch.get('new_value') or ''
            o, n = str(o), str(n)
            po, pn = plain(o).split(), plain(n).split()
            sm = difflib.SequenceMatcher(None, po, pn, autojunk=False)
            dl = []
            for op, a1, a2, b1, b2 in sm.get_opcodes():
                if op != 'equal': dl.append(('-' + ' '.join(po[a1:a2]))[:160] + ' | +' + ' '.join(pn[b1:b2])[:200])
            changes.append({'date': datetime.datetime.utcfromtimestamp(e['created_on']).strftime('%Y-%m-%d %H:%M'), 'user': e.get('user_id'), 'field': FIELDS[f],
                            'prd_versions': [vers(o), vers(n)], 'keys_added': sorted(set(keys(n)) - set(keys(o))), 'keys_removed': sorted(set(keys(o)) - set(keys(n))), 'diff': dl[:8]})
    rows.append({'cid': cid, 'title': c['title'], 'atm': c.get('custom_atmstatus'), 'section': c['section_id'],
                 'automated_on': datetime.datetime.utcfromtimestamp(auto_at).strftime('%Y-%m-%d') if auto_at else None, 'changes': changes})
    print(cid, rows[-1]['automated_on'], len(changes), flush=True)
json.dump(rows, open(OUT + 'history-why.json', 'w'), indent=1, ensure_ascii=False)
