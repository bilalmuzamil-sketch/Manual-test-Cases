#!/usr/bin/env python3
"""Per-environment facts the seeder, the status board and the browser run all share - READ-ONLY.

    python3 envinfo.py staging        # refresh workplaces-staging.json from the API and print it

Location roles: A is the location every case runs at, B is the second location some cases need.
The workplace ids are the same on the QA branch and on staging (the QA organisation is a copy of
staging's), but the TIME ZONE and the SHOP NUMBER are not: on 12 Nov 2026 location A was
America/Edmonton + shop 11315 on QA and Asia/Karachi + shop 2 on staging. So both are READ from the
app's own GET staff/my-workplaces (app/src/api/auth/index.ts:64) on every run, never hard-coded.
The file it writes holds ids, names, time zones and shop numbers only - nothing secret."""
import datetime, json, os, sys
from zoneinfo import ZoneInfo
from api import workplaces
HERE = os.path.dirname(os.path.abspath(__file__))
ROLES = {'qa': {'A': 'b3c8c820-f815-4cf1-8938-10956c5ee71a', 'B': 'f8a8b802-7780-4b16-bf10-343caeb616b2'},
         'staging': {'A': 'b3c8c820-f815-4cf1-8938-10956c5ee71a', 'B': 'f8a8b802-7780-4b16-bf10-343caeb616b2'}}
def path(env): return f'{HERE}/workplaces-{env}.json'
def refresh(env):
    live = workplaces(env)
    out = {}
    for role, wid in ROLES[env].items():
        if wid not in live: raise SystemExit(f'{env}: location {role} ({wid}) is not among this login\'s workplaces')
        w = live[wid]
        if not w.get('timezone'): raise SystemExit(f'{env}: location {role} has no time zone')
        out[role] = {'id': wid, **w}
    out['_read_utc'] = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    json.dump(out, open(path(env), 'w'), indent=1, sort_keys=True)
    return out
def load(env, fresh=True):
    if fresh: return refresh(env)
    return json.load(open(path(env)))
def local_today(tz, at=None):
    return (at or datetime.datetime.now(datetime.timezone.utc)).astimezone(ZoneInfo(tz)).date()
if __name__ == '__main__':
    env = sys.argv[1] if len(sys.argv) > 1 else 'qa'
    w = refresh(env)
    for role in ('A', 'B'):
        x = w[role]
        print(f"{role}: {x['name']} | {x['timezone']} | shop {x['shop_id']} | {x['country_code']} | today there {local_today(x['timezone'])}")
    same = local_today(w['A']['timezone']) == local_today(w['B']['timezone'])
    print('A and B are on the same calendar day now' if same else 'WARNING: A and B are on DIFFERENT calendar days right now')
