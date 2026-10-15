"""Story 12 report figures computed from the events the QA branch actually sent (recorded per test user), using the PRD's
own definitions (Confluence 845185030 v47, read 12 Oct 2026):
  S12-R4  weekly display usage by distinct users          S12-R11 density distribution
  S12-R10 field selection rate = distinct exposed users selecting / distinct users exposed to that available field
  S12-R7  unavailable financial fields excluded            S12-R13 repeated events from one user are not extra users
Input: evidence/ga-week-2026-10-12/ga-week-users.json (one line per event: time, event, display, key, value, source).
15 Oct 2026: an optional first argument names another folder holding ga-week-users.json (e.g. the staging one,
evidence/staging-full-2026-10-14/ga-week); with no argument it reads the QA-branch folder exactly as before."""
import json, sys, collections
DIR = sys.argv[1] if len(sys.argv) > 1 else 'evidence/ga-week-2026-10-12'
U = json.load(open(DIR + '/ga-week-users.json'))
def parse(line):
    p = line.split(); return {'en': p[1], 'display': p[2] if len(p) > 2 else '', 'key': p[3] if len(p) > 3 else '', 'val': p[4] if len(p) > 4 else '', 'src': p[5] if len(p) > 5 else ''}
def evs(k): return [parse(l) for l in U.get(k, {}).get('events', [])]
out = {}
# C97034 — weekly display usage and density spread (WK1..WK4)
wk = ['WK1', 'WK2', 'WK3', 'WK4']
usage = collections.defaultdict(set); dens = {}
for k in wk:
    for e in evs(k):
        if e['en'] == 'work_orders_display_view': usage[e['display']].add(U[k]['uid'])
        if e['en'] == 'work_orders_density_load' and k not in dens: dens[k] = e['key']
        if e['en'] in ('work_orders_density_change',): dens[k] = e['key']
        if e['en'] == 'work_orders_density_load' and e['src'] == 'saved': dens[k] = e['key']
users_bt = {k for k in wk if any(e['en'] == 'work_orders_display_view' and e['display'] in ('tech_view', 'board_view') for e in evs(k))}
spread = collections.Counter(dens[k] for k in users_bt if k in dens)
out['C97034'] = {'events_per_user': {k: len(evs(k)) for k in wk}, 'distinct_uids': len({U[k]['uid'] for k in wk}),
  'display_usage_distinct_users': {d: len(s) for d, s in usage.items()},
  'density_users': {k: dens.get(k) for k in sorted(users_bt)},
  'density_spread': {d: f'{n} of {sum(spread.values())} = {100*n/sum(spread.values()):.1f}%' for d, n in spread.items()}}
# C97033 — field selection rate (FS1..FS4), Board View
fs = [k for k in ('FS1', 'FS2', 'FS3', 'FS4') if U.get(k, {}).get('events')]
def rate(field):
    exposed, selecting = set(), set()
    for k in fs:
        state = None
        for e in evs(k):
            if e['display'] != 'board_view' or e['key'] != field: continue
            if e['en'] == 'work_orders_field_load': exposed.add(k); state = (e['val'] == 'on') if state is None else state
            if e['en'] == 'work_orders_field_toggle': state = e['val'] == 'on'
        if k in exposed and state: selecting.add(k)
    return {'exposed': sorted(exposed), 'selecting': sorted(selecting), 'rate': f'{len(selecting)} / {len(exposed)} = {100*len(selecting)/len(exposed):.1f}%' if exposed else 'n/a'}
out['C97033'] = {'users_with_events': fs, 'vin': rate('vin'), 'total_price': rate('total_price')}
json.dump(out, open(DIR + '/report-figures.json', 'w'), indent=1); print(json.dumps(out, indent=1))
