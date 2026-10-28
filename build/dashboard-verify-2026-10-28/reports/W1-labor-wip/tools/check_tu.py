#!/usr/bin/env python3
"""Technician Utilization — full pass checks against the spec (Confluence 641400833 v9, 2026-08-13) and
Chris Ward's 2026-10-22 ruling on SV-11688 (open > 24 h left out). Inputs collected by collect_labor.py and
collect_clocks.py (own session). Independent recompute of WO hours from RAW clock records
(GET /api/technician-tasks/list, LabourBilling context) clipped to each range; internal hours from the
Timesheet Activities department rows; Est. Lost Labor from each location's default labor rate.
Writes results-tu.json and prints a summary.
"""
import json, glob, os, collections, datetime as dt
from zoneinfo import ZoneInfo

L = '/tmp/cln/w1/labor'
OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/reports/W1-labor-wip/results-tu.json'
RATE = {'b3c8c820-f815-4cf1-8938-10956c5ee71a': 14995, 'f8a8b802-7780-4b16-bf10-343caeb616b2': 15995,
        '25a0d576-b371-4b82-bef4-41ba977f31c2': 13500, '39522bc6-abca-4f67-bd12-2840043c2d68': 13500}
res = []


def chk(cid, scope, rng, ok, detail, ref):
    res.append({'check': cid, 'scope': scope, 'range': rng, 'result': 'PASS' if ok else 'FAIL', 'detail': detail, 'spec': ref})


def epoch(s, tz):
    return dt.datetime.strptime(s, '%Y-%m-%d %H:%M:%S').replace(tzinfo=dt.timezone.utc).timestamp()  # list shows UTC (proved vs Timesheet Activities, S2-35476)


def iso(s):
    return dt.datetime.fromisoformat(s.replace('Z', '+00:00')).timestamp()


clocks = {}
for f in glob.glob('/tmp/cln/w1/clocks/*.json'):
    d = json.load(open(f)); clocks[d['wid']] = d

per_loc = collections.defaultdict(dict)   # (range) -> wid -> tu
for f in sorted(glob.glob(f'{L}/*/*__tu.json')):
    scope = f.split('/')[-2]; tu = json.load(open(f)); rng = tu['label']
    if tu['status'] != 200:
        chk('T0-200', scope, rng, False, {'status': tu['status']}, '-'); continue
    rows, sm = tu['rows'], tu['summary']
    ws, we, read = iso(tu['start']), iso(tu['end']) + 0.001, iso(tu['read_at_utc'])
    per_loc[rng][scope] = tu
    # T1 summary = sum of rows (S3-R3, S3-R5)
    for k in ('total_seconds', 'wo_seconds', 'internal_seconds'):
        chk('T1-summary-' + k, scope, rng, sum(r[k] for r in rows) == sm[k], {'rows': sum(r[k] for r in rows), 'summary': sm[k]}, 'S3-R3')
    lost = [r['est_lost_labor_cents'] for r in rows if r['est_lost_labor_cents'] is not None]
    chk('T1-summary-lost-labor', scope, rng, abs(sum(lost) - (sm['est_lost_labor_cents'] or 0)) <= len(lost), {'rows': sum(lost), 'summary': sm['est_lost_labor_cents']}, 'S3-R5 (each row rounded once; summary from unrounded)')
    for r in rows:
        nm = r['technician_name']
        chk('T2-total=wo+internal', scope, rng, r['total_seconds'] == r['wo_seconds'] + r['internal_seconds'],
            {'tech': nm, 't': r['total_seconds'], 'wo': r['wo_seconds'], 'int': r['internal_seconds']}, 'S2-R2..R4 / §4')
        chk('T2b-row-has-time', scope, rng, r['total_seconds'] > 0, {'tech': nm}, 'S1-R2')
        # T8 lost labor = location default rate x internal hours (single-location scopes)
        if scope in RATE:
            exp = round(RATE[scope] * r['internal_seconds'] / 3600)
            got = r['est_lost_labor_cents']
            chk('T8-est-lost-labor=rate*internal', scope, rng, got is not None and abs(got - exp) <= 1,
                {'tech': nm, 'got': got, 'exp_at_current_rate': exp, 'internal_h': round(r['internal_seconds'] / 3600, 4)}, 'S2-R8/S2-R8a/S2-E2')
        # T3 daily rows
        dl = tu['daily'].get(r['staff_id'])
        if isinstance(dl, list):
            for k in ('total_seconds', 'wo_seconds', 'internal_seconds'):
                chk('T3-daily-sum-' + k, scope, rng, sum(x[k] for x in dl) == r[k], {'tech': nm, 'daily': sum(x[k] for x in dl), 'row': r[k]}, 'S4-R2/S4-R3')
            dates = [x.get('date') or x.get('day') for x in dl]
            chk('T3-daily-ascending-in-range', scope, rng, dates == sorted(dates) and all(tu['from'] <= d_ <= tu['to'] for d_ in dates),
                {'tech': nm, 'first': dates[:1], 'last': dates[-1:]}, 'S4-R2')
            chk('T3-daily-no-empty-day', scope, rng, all(x['total_seconds'] > 0 for x in dl), {'tech': nm}, 'S4-N1')
            dl_lost = [x['est_lost_labor_cents'] for x in dl if x.get('est_lost_labor_cents') is not None]
            chk('T3-daily-lost-labor-sum', scope, rng, abs(sum(dl_lost) - (r['est_lost_labor_cents'] or 0)) <= max(1, len(dl_lost)),
                {'tech': nm, 'daily': sum(dl_lost), 'row': r['est_lost_labor_cents']}, 'S4-R3 (per day rounded)')
    # T5 WO seconds recomputed from RAW clock records at this location (clipped to the window)
    if scope in clocks:
        tz = tu['tz']; raw = collections.defaultdict(float); rawr = collections.defaultdict(float); nonbill = collections.Counter(); opens = collections.defaultdict(list)
        cread = os.path.getmtime(f'/tmp/cln/w1/clocks/{scope}.json')
        for c in clocks[scope]['rows']:
            if c['workplace_id'] != scope or not c['start_date_display']:
                continue
            s = epoch(c['start_date_display'], tz)
            e = epoch(c['end_date_display'], tz) if c.get('end_date_display') else None
            if e is None:
                opens[c['staff_id']].append((c['start_date_display'], round((read - s) / 3600, 1)))
                e = read
            ov = max(0.0, min(e, we) - max(s, ws))
            if ov > 0:
                if not c['billable']:
                    nonbill[c['staff_id']] += 1
                # split at local midnights (one piece per day), each piece rounded half-up to 0.01 h
                z = ZoneInfo(tz); a = max(s, ws); b = min(e, we)
                while a < b:
                    ld = dt.datetime.fromtimestamp(a, z).date() + dt.timedelta(days=1)
                    nxt = min(b, dt.datetime.combine(ld, dt.time(0), z).timestamp())
                    rawr[c['staff_id']] += int((nxt - a) / 36 + 0.5) * 36
                    a = nxt
                raw[c['staff_id']] += ov
        tu_ids = {r['staff_id']: r for r in rows}
        for sid in set(raw) | {r['staff_id'] for r in rows if r['wo_seconds'] > 0}:
            r = tu_ids.get(sid)
            got = r['wo_seconds'] if r else None
            exp = round(raw.get(sid, 0)); expr = round(rawr.get(sid, 0))
            if r is None and nonbill[sid]:
                chk('T5a-non-billable-staff-not-listed', scope, rng, True, {'staff': sid, 'records': nonbill[sid], 'raw_h': round(exp / 3600, 2)}, 'formula ref: billable staff only (spec silent)')
                continue
            ok = got is not None and abs(got - expr) <= 36
            chk('T5-wo-seconds-vs-raw-clocks(per-record 0.01h)', scope, rng, ok,
                {'tech': r['technician_name'] if r else sid, 'report_s': got, 'raw_rounded_s': expr, 'raw_exact_s': exp, 'diff_h': round(((got or 0) - expr) / 3600, 3),
                 'open_clocks': opens.get(sid, [])}, 'S2-R3 + S1-E1 / SV-11688 ruling')
            res.append({'check': 'T5x-exact-vs-report-info', 'scope': scope, 'range': rng, 'result': 'INFO', 'detail': {'tech': r['technician_name'] if r else sid, 'diff_s': (got or 0) - exp}, 'spec': '§3 compute from unrounded'})

json.dump(res, open(OUT, 'w'), indent=0)
t = collections.Counter((r['check'], r['result']) for r in res)
for (c, rr), n in sorted(t.items()):
    print(f'{c:40s} {rr} {n}')
print('TOTAL', len(res), 'PASS', sum(r['result'] == 'PASS' for r in res), 'FAIL', sum(r['result'] == 'FAIL' for r in res))
for r in [x for x in res if x['result'] == 'FAIL'][:60]:
    print('FAIL', r['check'], r['scope'][:8], r['range'], json.dumps(r['detail'])[:260])
