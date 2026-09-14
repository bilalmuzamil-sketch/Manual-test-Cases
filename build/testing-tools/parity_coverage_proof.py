#!/usr/bin/env python3
"""Proves a V1->V2 parity suite is complete, LIVE against TestRail (Skill 19 §3, Rule 109).

Three checks, and it exits non-zero if any fails:
  FORWARD   every V1 capability maps to a case, and that case exists
  IN-RUN    every mapped case is actually in the test run
  BACKWARD  every case in the section serves a capability
            (a case serving none is dead weight, or a sign Rule 109 was stretched into V2-only work)

USAGE
  python3 parity_coverage_proof.py --config parity.json [--json out.json]

CONFIG SHAPE
{
  "suite_id": 1,
  "section_id": 6769,
  "run_id": 415,
  "baseline": "ShopView/shopview @ 55767168",
  "capabilities": [
    {"kind": "field",     "capability": "Customer - postal code",
     "evidence": "FetchDataQueryHandler.php:230 c.postal_code", "cases": [53582]},
    {"kind": "behaviour", "capability": "INV-10 minimum two characters",
     "evidence": "useGlobalSearch.ts:69-71", "cases": [45161]}
  ]
}

Credentials: /tmp/testrail/creds.json  {host, user, login_password|password}   (Rule 82: /tmp only)
"""
import json, base64, urllib.request, urllib.error, ssl, time, sys, argparse

CA = '/root/.ccr/ca-bundle.crt'

def make_api(creds):
    host = creds['host'].rstrip('/')
    pw = creds.get('login_password') or creds['password']
    auth = base64.b64encode(f"{creds['user']}:{pw}".encode()).decode()
    try:
        ctx = ssl.create_default_context(cafile=CA)
    except FileNotFoundError:
        ctx = ssl.create_default_context()
    def api(path):
        # TRAP: TestRail takes '&' separators ONLY - a second '?' returns HTTP 400.
        req = urllib.request.Request(f"{host}/index.php?/api/v2/{path}",
                                     headers={'Authorization': 'Basic ' + auth})
        for attempt in range(4):
            try:
                return json.loads(urllib.request.urlopen(req, context=ctx, timeout=60).read())
            except urllib.error.HTTPError as e:
                if e.code < 500 or attempt == 3:
                    raise SystemExit(f"TestRail HTTP {e.code} on {path}: {e.read()[:200]!r}")
                time.sleep(2 ** attempt)
            except Exception:
                if attempt == 3:
                    raise
                time.sleep(2 ** attempt)
    return api

def paged(api, path, key):
    out, off = [], 0
    while True:
        r = api(f"{path}&limit=250&offset={off}")
        chunk = r[key] if isinstance(r, dict) else r
        out += chunk
        if len(chunk) < 250:
            return out
        off += 250

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--config', required=True)
    ap.add_argument('--creds', default='/tmp/testrail/creds.json')
    ap.add_argument('--json', help='write the full result here')
    a = ap.parse_args()

    cfg = json.load(open(a.config))
    api = make_api(json.load(open(a.creds)))
    suite, section, run = cfg['suite_id'], cfg['section_id'], cfg['run_id']

    cases = {c['id']: c for c in paged(api, f"get_cases/1&suite_id={suite}&section_id={section}", 'cases')}
    in_run = {t['case_id'] for t in paged(api, f"get_tests/{run}", 'tests')}

    caps = cfg['capabilities']
    missing, not_in_run, no_evidence = [], [], []
    mapped = set()
    for c in caps:
        if not c.get('evidence'):
            no_evidence.append(c['capability'])
        for cid in c['cases']:
            mapped.add(cid)
            if cid not in cases:
                missing.append((c['capability'], cid))
            elif cid not in in_run:
                not_in_run.append((c['capability'], cid))
    unmapped = {cid: cases[cid]['title'] for cid in cases if cid not in mapped}

    print(f"baseline                : {cfg.get('baseline', '(not stated - STATE IT)')}")
    print(f"capabilities enumerated : {len(caps)}")
    print(f"cases live in section   : {len(cases)}")
    print(f"tests in run {run:<11}: {len(in_run)}")
    print()
    print(f"FORWARD  capability -> a case that does not exist : {len(missing)}")
    for cap, cid in missing:
        print(f"           MISSING C{cid}  <- {cap}")
    print(f"IN-RUN   mapped case absent from the run          : {len(not_in_run)}")
    for cap, cid in not_in_run:
        print(f"           NOT IN RUN C{cid}  <- {cap}")
    print(f"BACKWARD case serving no V1 capability            : {len(unmapped)}")
    for cid, t in sorted(unmapped.items()):
        print(f"           C{cid}  {t[:70]}")
    if no_evidence:
        print(f"\nCAPABILITIES WITH NO CODE CITATION (Rule 109a)   : {len(no_evidence)}")
        for cap in no_evidence:
            print(f"           {cap}")

    ok = not (missing or not_in_run or unmapped or no_evidence)
    print("\n" + ("PASS - coverage is complete and provable." if ok else
                  "FAIL - the suite is NOT complete. Fix the rows above."))
    if a.json:
        json.dump({'baseline': cfg.get('baseline'), 'capabilities': len(caps),
                   'cases': len(cases), 'run_tests': len(in_run), 'missing': missing,
                   'not_in_run': not_in_run, 'unmapped': unmapped,
                   'no_evidence': no_evidence, 'pass': ok}, open(a.json, 'w'), indent=1)
        print(f"written: {a.json}")
    sys.exit(0 if ok else 1)

if __name__ == '__main__':
    main()
