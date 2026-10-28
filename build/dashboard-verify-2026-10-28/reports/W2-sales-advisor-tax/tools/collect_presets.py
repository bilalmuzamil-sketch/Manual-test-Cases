#!/usr/bin/env python3
"""Re-read every preset-by-name (Sales Tax Collected, Technician Efficiency both tabs) on THIS worker's own
session, change-location immediately before each location, plus the matching custom window. SECRET-FREE."""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from common import *
from collect_w2 import paged, save, PRESETS
for wid, name, tz in WORKPLACES:
    loc(wid)
    for p in PRESETS:
        c, d = paged('/api/reporting/sales-tax-report', [('dateRange', p)], wid, per=500)
        f, t, s, e = win(wid, p)
        c2, d2 = paged('/api/reporting/sales-tax-report', [('dateRange', 'custom'), ('startDate', s), ('endDate', e)], wid, per=500)
        save(wid, f'tax_preset__{p}', {'status': c, 'data': d}); save(wid, f'tax__{p}__default', {'from': str(f), 'to': str(t), 'status': c2, 'data': d2})
        for tab, base in (('inv', '/api/reporting/technician-efficiency'), ('cmp', '/api/reporting/technician-efficiency-completed')):
            c, b = get(f'{base}/{p}', [('range', p)], wid)
            save(wid, f'te_{tab}_preset__{p}', {'status': c, 'summary': b})
    print(name, 'done', flush=True)
