#!/usr/bin/env python3
"""READ-ONLY. Measures the organisation-level states the 365 run-557 tests need, on staging (or qa), through the
reports' own data calls. Before the upgrade it reads V1's A/R and A/P Aging Detail (GET reporting/account-receivable/
aging-detail-report, reporting/account-payable/aging-detail-report - app/src/api/reporting/index.ts:382,420, the calls
the V1 report screens make); V1 is organisation-wide with a location on every line (V1 baseline INV-007/092/139).
Writes org-<env>-<utc>.json (names, counts, build marker) - nothing secret.
    python3 measure_org.py staging"""
import collections, datetime, json, os, sys, urllib.request, ssl, re
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'live-run-2026-11-11', 'tools'))
from api import call, ORIGIN, CTX
ENV = sys.argv[1] if len(sys.argv) > 1 else 'staging'
HERE = os.path.dirname(os.path.abspath(__file__))
now = datetime.datetime.now(datetime.timezone.utc)
def marker():
    html = urllib.request.urlopen(ORIGIN[ENV] + '/', context=CTX, timeout=30).read().decode(errors='replace')
    m = re.search(r'app-version" content="([^"]+)"', html); return m.group(1) if m else None
def detail(side, at):
    j = call(ENV, f'/api/reporting/{side}/aging-detail-report?asOfDate={at.strftime("%Y-%m-%dT%H:%M:%S.000Z")}')
    if j['status'] != 200: raise SystemExit(f'{side} {j["status"]} {j["raw"][:200]}')
    return {k: v['transactions'] for k, v in j['json']['data']['buckets'].items() if isinstance(v, dict)}
def stats(b, party):
    lines = [dict(t, bucket=k) for k, v in b.items() for t in v]
    by_p = collections.defaultdict(list)
    for t in lines: by_p[t[party]].append(t)
    locs = collections.Counter(t['locationName'] for t in lines)
    over = {p for p, ts in by_p.items() if any(t['bucket'] != 'current' for t in ts)}
    bal = 'balance' if 'balance' in lines[0] else 'openBalance'
    tot = {p: round(sum(t[bal] for t in ts), 2) for p, ts in by_p.items()}
    names = sorted(by_p, key=lambda s: s.lower())
    return {
        'lines': len(lines), 'lines_per_bucket': {k: len(v) for k, v in b.items()},
        'types_per_bucket': {k: dict(collections.Counter(t['type'] for t in v)) for k, v in b.items()},
        'locations': dict(locs), 'parties_with_open': len(by_p), 'parties_overdue': len(over),
        'parties_both_A_B': sorted(p for p, ts in by_p.items() if {'Staging Heavy Duty - 9919', 'Staging Lethbridge - 4310'} <= {t['locationName'] for t in ts})[:15],
        'parties_long_name_gt40': sorted(p for p in by_p if len(p) > 40)[:15],
        'parties_credit_balance': sorted(p for p, v in tot.items() if v < 0)[:15],
        'parties_starting_eq': [p for p in by_p if p.startswith('=')],
        'max_lines_one_party': max(((len(ts), p) for p, ts in by_p.items()), default=None),
        'parties_gt100_lines': sorted(p for p, ts in by_p.items() if len(ts) > 100),
        'parties_gt20_lines': len([p for p, ts in by_p.items() if len(ts) > 20]),
        'first_5_names': names[:5], 'last_3_names': names[-3:],
    }
out = {'env': ENV, 'utc': now.strftime('%Y-%m-%dT%H:%M:%SZ'), 'build_marker_before': marker()}
for side, party in (('account-receivable', 'customerName'), ('account-payable', 'vendorName')):
    for label, at in (('today', now), ('yesterday', now - datetime.timedelta(days=1))):
        out[f'{side}:{label}'] = stats(detail(side, at), party)
wp = call(ENV, '/api/workplaces')['json']['data']; wp = wp.get('collection', wp)
mine = call(ENV, '/api/staff/my-workplaces')['json']; mine = (mine.get('data', mine) or {}).get('collection', [])
out['workplaces_org'] = sorted(w['name'] for w in wp); out['workplaces_enrolled'] = sorted(w['name'] for w in mine)
out['build_marker_after'] = marker()
fn = os.path.join(HERE, f"org-{ENV}-{out['utc'].replace(':', '')}.json"); json.dump(out, open(fn, 'w'), indent=1, ensure_ascii=False)
print(fn); print(json.dumps(out, ensure_ascii=False)[:6000])
