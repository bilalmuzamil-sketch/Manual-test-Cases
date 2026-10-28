#!/usr/bin/env python3
"""Collect every dashboard figure for every location x date range x At Risk window (FULL pass).

SECRET-FREE: reads the session cookie from /tmp/cln/sess-admin.txt (quick-login admin, minted by
/tmp/cln/dv/mint.mjs) so the QA lead's own browser session is never switched to another location.
Raw responses go to /tmp/cln/dv/raw/<workplace>/<range>.json (staging business data stays out of git).

Expected date ranges are computed HERE from the PRD (Dashboard v53, S7-R2, S4-R11c, S10-R8), in each
workplace's own timezone, never copied from the app.  Week start = Sunday (the reports' preset rule;
the PRD is silent and S3-R1 requires the tile to match its report).
"""
import json, os, subprocess, sys, datetime as dt
from zoneinfo import ZoneInfo
from urllib.parse import urlencode

API = 'https://api.staging.shopview.com'
COOKIE = open('/tmp/cln/sess-admin.txt').read().strip()
OUT = '/tmp/cln/dv/raw'
WORKPLACES = [
    ('b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Staging Heavy Duty - 9919', 'Asia/Karachi'),
    ('f8a8b802-7780-4b16-bf10-343caeb616b2', 'Staging Lethbridge - 4310', 'America/Edmonton'),
    ('25a0d576-b371-4b82-bef4-41ba977f31c2', 'QB Location', 'America/Vancouver'),
    ('39522bc6-abca-4f67-bd12-2840043c2d68', 'DVI Test', 'America/Toronto'),
]
KEYS = ['revenueKpi', 'revenueSeries', 'invoicesKpi', 'billingEfficiencyKpi', 'invoicingEfficiencySeries',
        'invoicingEfficiencyByAdvisorSeries', 'billingEfficiencyByAdvisor', 'techEfficiencyKpi',
        'techEfficiencySeries', 'techEfficiencyByTechSeries', 'techPerformance', 'techUtilizationKpi',
        'techUtilizationSeries', 'techUtilizationByTechSeries', 'techUtilization', 'topCustomers']
RISK = [30, 60, 90, 120, 180]


def curl(method, path, body=None, extra_headers=None):
    hdrs = [x for k, v in (extra_headers or {}).items() for x in ('-H', f'{k}: {v}')]
    cmd = ['curl', '-sS', '-4', '-X', method] + hdrs + ['-H', 'Cookie: ' + COOKIE, '-H', 'Accept: application/json',
           '-H', 'Origin: https://app.staging.shopview.com', '-H', 'Referer: https://app.staging.shopview.com/',
           '-w', '\n%{http_code}', API + path]
    if body is not None:
        cmd[1:1] = ['-H', 'Content-Type: application/json', '--data', json.dumps(body)]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
    txt, _, code = r.stdout.rpartition('\n')
    try:
        return int(code), json.loads(txt) if txt else None
    except ValueError:
        return int(code or 0), {'_raw': txt[:2000]}


def ranges(today):
    first = today.replace(day=1)
    q0 = dt.date(today.year, 3 * ((today.month - 1) // 3) + 1, 1)
    lq_end = q0 - dt.timedelta(days=1)
    lq0 = dt.date(lq_end.year, 3 * ((lq_end.month - 1) // 3) + 1, 1)
    lm_end = first - dt.timedelta(days=1)
    wk0 = today - dt.timedelta(days=(today.weekday() + 1) % 7)       # Sunday
    m11 = (today.month - 11 - 1) % 12 + 1
    y11 = today.year - (1 if today.month <= 11 else 0)
    r = {
        'last_12_months': (dt.date(y11, m11, 1), today),
        'this_year': (dt.date(today.year, 1, 1), today),
        'last_year': (dt.date(today.year - 1, 1, 1), dt.date(today.year - 1, 12, 31)),
        'this_quarter': (q0, today),
        'last_quarter': (lq0, lq_end),
        'this_month': (first, today),
        'last_month': (lm_end.replace(day=1), lm_end),
        'this_week': (wk0, today),
        'last_week': (wk0 - dt.timedelta(days=7), wk0 - dt.timedelta(days=1)),
    }
    for n in (1, 31, 32, 182, 183, 366, 367):                        # bucket edges + the 366 cap
        r[f'custom_{n}d'] = (today - dt.timedelta(days=n - 1), today)
    return r


def main():
    stamp = dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')
    index = {'collected_at_utc': stamp, 'workplaces': []}
    for wid, name, tz in WORKPLACES:
        code, _ = curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': tz})
        today = dt.datetime.now(ZoneInfo(tz)).date()
        d = os.path.join(OUT, wid); os.makedirs(d, exist_ok=True)
        entry = {'id': wid, 'name': name, 'tz': tz, 'today': today.isoformat(), 'change_location': code, 'ranges': {}}
        for label, (f, t) in ranges(today).items():
            q = [('reports[]', k) for k in KEYS] + [('from', f.isoformat()), ('to', t.isoformat())]
            c, body = curl('GET', '/api/dashboard/reports?' + urlencode(q))
            json.dump({'from': f.isoformat(), 'to': t.isoformat(), 'status': c, 'body': body},
                      open(os.path.join(d, label + '.json'), 'w'))
            entry['ranges'][label] = {'from': f.isoformat(), 'to': t.isoformat(), 'status': c}
            print(name, label, f, t, c, flush=True)
        for rd in RISK:
            f, t = ranges(today)['last_12_months']
            q = [('reports[]', 'atRiskCustomers'), ('from', f.isoformat()), ('to', t.isoformat()), ('risk_days', rd)]
            c, body = curl('GET', '/api/dashboard/reports?' + urlencode(q))
            json.dump({'risk_days': rd, 'status': c, 'body': body}, open(os.path.join(d, f'atrisk_{rd}.json'), 'w'))
            entry['ranges'][f'atrisk_{rd}'] = {'status': c}
            print(name, 'atrisk', rd, c, flush=True)
        index['workplaces'].append(entry)
    json.dump(index, open(os.path.join(OUT, 'index.json'), 'w'), indent=1)


if __name__ == '__main__':
    main()
