#!/usr/bin/env python3
"""Rule 65: WHO set custom_atmstatus on each Automated-flagged case we changed.
Never assume — read get_history_for_case. READ ONLY."""
import json, sys, datetime
sys.path.insert(0, '/tmp/hand12')
from tr import api

CASES = {
    'Filters': [29600, 29614, 29623, 38877],
    'Report Suite': [30107, 30114, 30121, 30123, 30138, 30217, 30221, 30262, 30314, 30326,
                     30328, 30333, 30338, 30346, 30352, 30353, 30390, 30398, 30399, 30401,
                     30404, 30410, 30424, 30429, 30449, 30452, 30460, 30462, 30488, 30498,
                     30508, 30510, 30515, 30518, 30527, 30535, 30557, 30563, 30569, 30583],
}
users = {}
for uid in range(1, 15):
    d, s = api(f'get_user/{uid}')
    if s == 200 and d.get('name'):
        users[uid] = d['name']


def ts(x):
    return datetime.datetime.fromtimestamp(x, datetime.timezone.utc).strftime('%Y-%m-%d')


out = {}
for proj, ids in CASES.items():
    print(f'\n===== {proj}')
    for cid in ids:
        hist, off = [], 0
        while True:
            d, s = api(f'get_history_for_case/{cid}&limit=250&offset={off}')
            if s != 200:
                print(f'  C{cid}: HTTP {s}'); hist = None; break
            items = d.get('history', d) if isinstance(d, dict) else d
            hist += items
            if len(items) < 250:
                break
            off += 250
        if hist is None:
            continue
        setters = []
        for h in hist:
            for ch in (h.get('changes') or []):
                fld = ch.get('field') or ch.get('type_id')
                if 'atm' in str(fld).lower():
                    setters.append({'by': users.get(h.get('user_id'), h.get('user_id')),
                                    'on': ts(h['created_on']),
                                    'old': ch.get('old_text', ch.get('old_value')),
                                    'new': ch.get('new_text', ch.get('new_value'))})
        out[cid] = {'proj': proj, 'setters': setters, 'history_entries': len(hist)}
        if setters:
            s0 = setters[-1]
            print(f'  C{cid}: {len(setters)} atm change(s); last -> {s0["new"]} by {s0["by"]} on {s0["on"]}')
        else:
            print(f'  C{cid}: NO atm entry in {len(hist)} history entries '
                  f'(flag present since creation / not changed via history)')

json.dump(out, open('/tmp/hand12/atmhist.json', 'w'), indent=1, default=str)
