#!/usr/bin/env python3
"""Collect RAW clock records (independent of the Reporting code): GET /api/technician-tasks/list
(LabourBilling context), every page, per location (session switched to that location first).
Raw -> /tmp/cln/w1/clocks/<wid>.json
"""
import json, os, sys
from urllib.parse import urlencode
TOOLS = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools'
import w1env  # own session (see w1env.py)
from w1env import curl, WORKPLACES

OUT = '/tmp/cln/w1/clocks'; os.makedirs(OUT, exist_ok=True)
for wid, name, tz in WORKPLACES:
    curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
    rows, page = [], 1
    while True:
        c, b = curl('GET', '/api/technician-tasks/list?' + urlencode([('pagination[page]', page), ('pagination[rowsPerPage]', 1000)]),
                    extra_headers={'X-Location-ID': wid})
        if c != 200:
            print('ERR', name, page, c, str(b)[:200]); break
        col = b['data']['collection']; rows += col
        pg = b['data'].get('pagination', {})
        if len(col) < 1000:
            break
        page += 1
    json.dump({'wid': wid, 'tz': tz, 'rows': rows, 'pagination': pg}, open(f'{OUT}/{wid}.json', 'w'))
    print(name, len(rows), pg, flush=True)
