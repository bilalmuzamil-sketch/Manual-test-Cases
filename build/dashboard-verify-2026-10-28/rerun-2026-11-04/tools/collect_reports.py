#!/usr/bin/env python3
"""Collect the five matching reports for every location x range, for the S3-R1 parity check.

SECRET-FREE (cookie from /tmp/cln/sess-admin.txt). Raw → /tmp/cln/dv/rep/<workplace>/<label>__<report>.json.
Two shapes per range:
  * custom   — the dashboard's own from/to as the report's custom window (local 00:00:00.000 →
               23:59:59.999 in the workplace timezone, sent as UTC instants, the SPA's toReportDateWindow)
  * preset   — Sales / Service Advisor Analysis / Technician Efficiency asked for the SAME preset by name,
               so a preset that means different dates in the report than on the dashboard shows up.
"""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
from urllib.parse import urlencode
sys.path.insert(0, os.path.dirname(__file__))
from collect_dashboard import curl, WORKPLACES, ranges, KEYS

OUT = '/tmp/cln/dv/rep'
PRESET_NAME = {'last_12_months': 'last_12_months', 'this_year': 'this_year', 'last_year': 'last_year',
               'this_quarter': 'this_quarter', 'last_quarter': 'last_quarter', 'this_month': 'this_month',
               'last_month': 'last_month', 'this_week': 'this_week', 'last_week': 'last_week'}


def instants(f, t, tz):
    z = ZoneInfo(tz)
    s = dt.datetime.combine(f, dt.time(0, 0), z).astimezone(dt.timezone.utc)
    e = dt.datetime.combine(t, dt.time(23, 59, 59, 999000), z).astimezone(dt.timezone.utc)
    fmt = lambda x: x.strftime('%Y-%m-%dT%H:%M:%S.') + f'{x.microsecond // 1000:03d}Z'
    return fmt(s), fmt(e)


def get(path, params, wid):
    return curl('GET', path + '?' + urlencode(params), extra_headers={'X-Location-ID': wid})


def main(only=None):
    for wid, name, tz in WORKPLACES:
        if only and only not in name:
            continue
        curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
        today = dt.datetime.now(ZoneInfo(tz)).date()
        d = os.path.join(OUT, wid); os.makedirs(d, exist_ok=True)
        page = [('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)]
        for label, (f, t) in ranges(today).items():
            s, e = instants(f, t, tz)
            win = [('range', 'custom'), ('start_date', s), ('end_date', e)]
            calls = {
                'sales': ('/api/reporting/sales/custom', win),
                'saa': ('/api/reporting/service-advisor-analysis/custom', win + page),
                'te': ('/api/reporting/technician-efficiency/custom', win),
                'tu': ('/api/reporting/reports/technician-utilization', win + [('locations', wid)] + page),
                'sbc': ('/api/reporting/reports/sales-by-customer', win + [('productType', 'all'), ('locations', wid),
                        ('pagination[page]', 1), ('pagination[rowsPerPage]', 1000), ('pagination[sortBy]', 'subtotal'),
                        ('pagination[descending]', 'true')]),
            }
            if label in PRESET_NAME:
                p = PRESET_NAME[label]
                calls['sales_preset'] = (f'/api/reporting/sales/{p}', [('range', p)])
                calls['saa_preset'] = (f'/api/reporting/service-advisor-analysis/{p}', [('range', p)] + page)
                calls['te_preset'] = (f'/api/reporting/technician-efficiency/{p}', [('range', p)])
            # paired read: the dashboard figure immediately before its reports, so open clocks cannot drift
            q = [('reports[]', k) for k in KEYS] + [('from', f.isoformat()), ('to', t.isoformat())]
            c, body = get('/api/dashboard/reports', q, wid)
            json.dump({'from': f.isoformat(), 'to': t.isoformat(), 'status': c, 'body': body},
                      open(os.path.join(d, f'{label}__dash.json'), 'w'))
            for rep, (path, params) in calls.items():
                c, body = get(path, params, wid)
                if rep.startswith('saa') and c == 200:            # read EVERY page (1000-row cap)
                    pg = 1
                    while len(body['data']['collection']) == 1000 * pg:
                        pg += 1
                        pp = [x for x in params if not x[0].startswith('pagination')] + [('pagination[page]', pg), ('pagination[rowsPerPage]', 1000)]
                        c2, b2 = get(path, pp, wid)
                        if c2 != 200 or not b2['data']['collection']: break
                        body['data']['collection'] += b2['data']['collection']
                json.dump({'from': f.isoformat(), 'to': t.isoformat(), 'start': s, 'end': e, 'status': c, 'body': body},
                          open(os.path.join(d, f'{label}__{rep}.json'), 'w'))
                print(name, label, rep, c, flush=True)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else None)
