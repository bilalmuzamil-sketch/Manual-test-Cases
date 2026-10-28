#!/usr/bin/env python3
"""Advisor filter (Advisor Analysis) and Customer filter (Sales) for every location, last 12 months:
one request per advisor / per customer -> /tmp/cln/w2/<wid>/saa_staff__*.json, sales_company__*.json.
SECRET-FREE."""
import json, os, sys
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(__file__))
from common import *
for wid, name, tz in WORKPLACES:
    d = os.path.join(RAW, wid); os.makedirs(d, exist_ok=True)
    f, t, s, e = win(wid, 'last_12_months')
    W = [('range', 'custom'), ('start_date', s), ('end_date', e)]
    c, adv = get('/api/service-advisors', [('includeInactive', '1')], wid)
    json.dump({'status': c, 'body': adv}, open(os.path.join(d, 'advisors.json'), 'w'))
    advisors = (adv or {}).get('data', {}).get('collection', []) if c == 200 else []
    def one_adv(a):
        sid = a.get('id') or a.get('staff_id')
        rows, pg = [], 1
        while True:
            c, b = get('/api/reporting/service-advisor-analysis/custom', W + [('staffId', sid), ('pagination[page]', pg), ('pagination[rowsPerPage]', 1000)], wid)
            if c != 200: return {'advisor': a, 'status': c, 'body': b}
            rows += b['data']['collection']
            if len(b['data']['collection']) < 1000: break
            pg += 1
        return {'advisor': a, 'status': 200, 'rows': rows, 'totals': b['data']['totals']}
    with ThreadPoolExecutor(4) as ex:
        res = list(ex.map(one_adv, advisors))
    json.dump(res, open(os.path.join(d, 'saa_staff__last_12_months.json'), 'w'))
    sales = json.load(open(f'/tmp/cln/dv/rep/{wid}/last_12_months__sales.json'))['body']['data']['collection']
    names = sorted({r['customer_service'] for r in sales if not r['is_credit']})
    c, opts = get('/api/companies/options', [], wid)
    json.dump({'status': c, 'body': opts}, open(os.path.join(d, 'company_options.json'), 'w'))
    print(name, 'advisors', len(advisors), 'company options', c, flush=True)
