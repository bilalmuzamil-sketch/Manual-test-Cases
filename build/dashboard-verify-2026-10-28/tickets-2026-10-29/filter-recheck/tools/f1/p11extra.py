#!/usr/bin/env python3
"""P1-1 (SV-11931) expected-value check: the Dashboard figures the ticket quotes (TE tile, Billing Efficiency tile,
Fabian Bonjean's row), read for the ticket's window (Oct 25-28), the fresh default (This Month) and the widest
(Last 12 Months), DVI Test, America/Toronto. Read-only. Usage: TZ=America/Toronto p11extra.py"""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from f1env import use, get, dump
loc = use('DVI'); w = loc['wid']; today = dt.datetime.now(ZoneInfo(loc['tz'])).date()
wins = {'i-ticket Oct 25-28': ('2026-10-25', '2026-10-28', 'day'), 'ii-default This Month': (today.replace(day=1).isoformat(), today.isoformat(), 'day'),
        'iii-widest Last 12 Months': ('2025-11-01', today.isoformat(), 'month')}
out = {'loc': loc, 'windows': {}}
for k, (f, t, g) in wins.items():
    q = [('reports[]', r) for r in ('techEfficiencyKpi', 'billingEfficiencyKpi', 'techPerformance')] + [('from', f), ('to', t), ('group', g)]
    c, b = get('/api/dashboard/reports', q, w); d = b.get('data') or {}
    fab = [r for r in (d.get('techPerformance') or []) if 'Fabian' in json.dumps(r)]
    out['windows'][k] = {'status': c, 'techEfficiencyKpi': d.get('techEfficiencyKpi'), 'billingEfficiencyKpi': d.get('billingEfficiencyKpi'), 'fabian': fab}
    print(k, c, '| TE', json.dumps(d.get('techEfficiencyKpi'))[:260], '| BE', json.dumps(d.get('billingEfficiencyKpi'))[:260], '| Fabian', json.dumps(fab)[:200])
dump('srv-P11-extra', out)
