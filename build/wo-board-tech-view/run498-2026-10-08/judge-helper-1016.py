#!/usr/bin/env python3
# Judging helper for the full staging run of run 498 (16-17 Oct 2026): for one queue step, print per test the LIVE case text,
# the step's log lines, the readings from the step's JSON output, the pictures taken during the step, and the latest posted result.
# Usage: python3 judge-helper-1016.py <step> [--short]     (run from anywhere; reads queue.out of logs-full-1016)
import sys, os, re, json, glob, html, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'testing-tools'))
import tr_client as t

EV = os.path.join(HERE, 'evidence', 'staging-full-2026-10-14'); L = os.path.join(EV, 'logs-full-1016'); Q = os.path.join(L, 'queue.out')

def strip(h):
    h = re.sub(r'<(br|/p|/li|/h\d|hr ?/?)>', '\n', h or ''); h = re.sub(r'<li>', '- ', h); h = re.sub(r'<[^>]+>', '', h)
    return re.sub(r'\n\s*\n+', '\n', html.unescape(h)).strip()

def steps():
    """step -> dict(script, only, start, end, rc) with real datetimes (day rolls over when the clock goes back)."""
    out = {}; day = datetime.date(2026, 10, 16); last = None
    for ln in open(Q):
        m = re.match(r'(\d\d):(\d\d):(\d\d) step (\d+) (start|end) (\S+)(.*)', ln)
        if not m: continue
        tm = datetime.time(int(m[1]), int(m[2]), int(m[3]))
        if last and tm < last: day += datetime.timedelta(days=1)
        last = tm; ts = datetime.datetime.combine(day, tm).timestamp(); n = int(m[4])
        d = out.setdefault(n, {'script': m[6]})
        if m[5] == 'start':
            d['start'] = ts; o = re.search(r'ONLY=(\S*)', m[7]); d['only'] = [x for x in (o[1] if o else '').split(',') if x]
        else:
            d['end'] = ts; r = re.search(r'exit (\d+)', m[7]); d['rc'] = r[1] if r else '?'
    return out

def main():
    n = int(sys.argv[1]); short = '--short' in sys.argv; s = steps()[n]
    log = os.path.join(L, f"{n:02d}-{s['script'][:-4]}.log")
    print(f"STEP {n} {s['script']} rc={s.get('rc')} start={datetime.datetime.utcfromtimestamp(s['start']):%H:%M:%S} end={datetime.datetime.utcfromtimestamp(s.get('end', 0)):%H:%M:%S} log={os.path.basename(log)}")
    logtxt = open(log, errors='replace').read() if os.path.exists(log) else ''
    errs = [l for l in logtxt.splitlines() if re.search(r'Error|error|Timeout|timeout|FAIL|throw', l) and not re.match(r'^\d\d:\d\d:\d\d C\d+ \{', l)]
    if errs: print('LOG ERROR LINES:'); [print('  ' + e[:400]) for e in errs[:12]]
    end = s.get('end', 9e12) + 30
    jsons = [f for f in glob.glob(os.path.join(EV, '*.json')) + glob.glob(os.path.join(HERE, 'evidence', '*.json')) if s['start'] - 5 <= os.path.getmtime(f) <= end]
    print('JSON written in step:', [os.path.relpath(f, EV) for f in jsons])
    for cid in s['only']:
        num = cid[1:]; st, c = t._req('GET', f'get_case/{num}')
        print('\n' + '=' * 110 + f'\n{cid}  {c.get("title")}  (updated_by {c.get("updated_by")}, created_by {c.get("created_by")})')
        if not short:
            print('-- PRECONDS:\n' + strip(c.get('custom_preconds'))[:1500])
            print('-- STEPS:\n' + strip(c.get('custom_steps'))[:2500])
        print('-- EXPECTED:\n' + strip(c.get('custom_expected'))[:3500])
        ll = [l for l in logtxt.splitlines() if cid in l]
        print('-- LOG:'); [print('  ' + l[:3000]) for l in ll]
        for f in jsons:
            try: d = json.load(open(f))
            except Exception: continue
            if isinstance(d, dict) and cid in d: print(f'-- JSON {os.path.basename(f)}[{cid}]:\n  ' + json.dumps(d[cid])[:3000])
        pics = sorted(p for p in glob.glob(os.path.join(EV, f'*{cid}*.png')) + glob.glob(os.path.join(HERE, 'evidence', f'*{cid}*.png')) if s['start'] - 5 <= os.path.getmtime(p) <= end)
        print('-- PICTURES:', [os.path.relpath(p, EV) for p in pics])
        st, r = t._req('GET', f'get_results_for_case/498/{num}&limit=1')
        if st == 200 and r.get('results'):
            x = r['results'][0]; cm = strip(x.get('comment')); tk = sorted(set(re.findall(r'SV-[0-9]+', cm))); NL = chr(10)
            print(f"-- LAST RESULT: status {x['status_id']} on {datetime.datetime.utcfromtimestamp(x['created_on']):%d %b %H:%M} tickets {tk}" + NL + '  ' + cm[:900].replace(NL, NL + '  '))

main()
