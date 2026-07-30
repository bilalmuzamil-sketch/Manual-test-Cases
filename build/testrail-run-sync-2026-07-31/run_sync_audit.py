#!/usr/bin/env python3
"""
run_sync_audit.py — READ-ONLY TestRail run-vs-cases sync audit (Standing Rule 34).

Answers: "which ACTIVE test cases exist in TestRail but are MISSING from the run the
tester is working in?" — the false-"no case exists" coverage gap.

100% read-only: only get_runs / get_run / get_tests / get_cases / get_sections / get_plans.
It NEVER calls update_run, add_result, add_case, update_case or delete_case.

Usage:
    set -a && . /tmp/tr-creds.env && set +a
    python3 build/testrail-run-sync-2026-07-31/run_sync_audit.py [--outdir DIR]

Requires env TESTRAIL_USER / TESTRAIL_KEY (never commit these).
"""
import os, sys, json, base64, time, csv, urllib.request

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BASE = 'https://shopview.testrail.io/index.php?/api/v2/'
PROJECT = 1
SUITE = 1

# top-level TestRail section (group) id -> our project name
GROUPS = {
    4281: 'Report Suite',
    4110: 'Filters',
    4254: 'Schedule',
    4058: 'Simple Flow',
    4094: 'Global Search',
    3894: 'Fees & Discounts',
    3527: 'Custom Roles',
}
# project -> (id-map path, case-id column, internal-id column)
IDMAPS = {
    'Report Suite':     ('build/report-suite/testrail-id-map.csv',   'testrail_case_id', 'internal_id'),
    'Filters':          ('build/filters/testrail-id-map.csv',        'testrail_case_id', 'internal_id'),
    'Schedule':         ('build/schedule/testrail-id-map.csv',       'testrail_case_id', 'internal_id'),
    'Simple Flow':      ('build/simple-flow/testrail-id-map.csv',    'ID',               'sf_id'),
    'Fees & Discounts': ('build/fees-discounts/testrail-id-map.csv', 'ID',               'fd_id'),
}
# the tester-facing project runs we care about: run id -> project
PROJECT_RUNS = {359: 'Report Suite', 357: 'Schedule', 352: 'Filters', 347: 'Global Search',
                325: 'Simple Flow', 324: 'Fees & Discounts', 278: 'Custom Roles'}


def _auth():
    try:
        return base64.b64encode(
            f"{os.environ['TESTRAIL_USER']}:{os.environ['TESTRAIL_KEY']}".encode()).decode()
    except KeyError:
        sys.exit('TESTRAIL_USER / TESTRAIL_KEY not set — source /tmp/tr-creds.env first.')


AUTH = None


def get(path):
    for attempt in range(5):
        try:
            req = urllib.request.Request(
                BASE + path,
                headers={'Authorization': 'Basic ' + AUTH, 'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read().decode())
        except Exception:
            if attempt == 4:
                raise
            time.sleep(3 * (attempt + 1))


def getall(path, key):
    """Paginated GET. Handles both the legacy bare-list and the v6.7+ {key: [...]} shape."""
    out, offset = [], 0
    while True:
        d = get(f"{path}{'&' if '?' in path or '/' in path else '?'}limit=250&offset={offset}"
                .replace('?limit', '&limit'))
        chunk = d if isinstance(d, list) else d.get(key, [])
        out.extend(chunk)
        if len(chunk) < 250:
            break
        offset += 250
    return out


def load_idmaps():
    maps = {}
    for proj, (path, cidcol, iidcol) in IDMAPS.items():
        d = {}
        full = os.path.join(REPO, path)
        if not os.path.exists(full):
            continue
        with open(full) as f:
            for row in csv.DictReader(f):
                cid = (row.get(cidcol) or '').strip().lstrip('Cc')
                if cid.isdigit():
                    d[int(cid)] = row.get(iidcol, '')
        maps[proj] = d
    return maps


def main():
    global AUTH
    AUTH = _auth()
    outdir = sys.argv[sys.argv.index('--outdir') + 1] if '--outdir' in sys.argv else \
        os.path.dirname(os.path.abspath(__file__))
    os.makedirs(outdir, exist_ok=True)

    plans = getall(f'get_plans/{PROJECT}', 'plans')
    if plans:
        print(f'NOTE: {len(plans)} test plan(s) exist — runs inside a plan are NOT returned by '
              'get_runs; fetch them via get_plan/{id} entries.')

    runs = (getall(f'get_runs/{PROJECT}&is_completed=0', 'runs')
            + getall(f'get_runs/{PROJECT}&is_completed=1', 'runs'))
    cases = getall(f'get_cases/{PROJECT}&suite_id={SUITE}', 'cases')
    secs = getall(f'get_sections/{PROJECT}&suite_id={SUITE}', 'sections')
    byid = {s['id']: s for s in secs}

    def grp(sid):
        seen = set()
        while sid and sid not in seen:
            if sid in GROUPS:
                return GROUPS[sid]
            seen.add(sid)
            sid = byid.get(sid, {}).get('parent_id')
        return None

    info = {c['id']: (grp(c['section_id']), c['title'],
                      byid.get(c['section_id'], {}).get('name', '')) for c in cases}
    live_by_group = {}
    for cid, (g, _t, _s) in info.items():
        if g:
            live_by_group.setdefault(g, set()).add(cid)

    maps = load_idmaps()
    inv = {int(k): v for m in maps.values() for k, v in m.items()}

    report = []
    for r in runs:
        n = sum(r[k] for k in ('passed_count', 'failed_count', 'blocked_count',
                               'retest_count', 'untested_count'))
        rec = {'id': r['id'], 'name': r['name'], 'include_all': r['include_all'], 'tests': n,
               'completed': r['is_completed'],
               'has_results': (n - r['untested_count']) > 0}
        if not r['include_all']:
            cids = {t['case_id'] for t in getall(f"get_tests/{r['id']}", 'tests')}
            rec['case_ids'] = sorted(cids)
            rec['stale_case_ids'] = sorted(c for c in cids if c not in info)
            rec['groups'] = {}
            for g, liveset in live_by_group.items():
                inrun = cids & liveset
                if inrun:
                    rec['groups'][g] = {'in_run': len(inrun), 'live_total': len(liveset),
                                        'missing': sorted(liveset - inrun)}
        report.append(rec)

    json.dump(report, open(os.path.join(outdir, 'audit.json'), 'w'), indent=1)

    print(f"\n{'RUN':>5} | {'NAME':44} | inc_all | tests | results | coverage")
    total_missing = 0
    for rec in report:
        if rec['include_all'] or not rec.get('groups'):
            continue
        parts = []
        for g, v in sorted(rec['groups'].items()):
            parts.append(f"{g}: {v['in_run']}/{v['live_total']} (missing {len(v['missing'])})")
            if rec['id'] in PROJECT_RUNS and PROJECT_RUNS[rec['id']] == g:
                total_missing += len(v['missing'])
        print(f"{rec['id']:>5} | {rec['name'][:44]:44} | {str(rec['include_all']):7} | "
              f"{rec['tests']:>5} | {'YES' if rec['has_results'] else ' no':7} | {'; '.join(parts)}")

    print(f"\nActive cases missing from the tester-facing project runs: {total_missing}")
    for rid, proj in PROJECT_RUNS.items():
        rec = next((x for x in report if x['id'] == rid), None)
        if not rec or not rec.get('groups', {}).get(proj):
            continue
        miss = rec['groups'][proj]['missing']
        if miss:
            print(f"\n-- run {rid} ({proj}) is missing {len(miss)}:")
            for cid in miss:
                print(f"   {inv.get(cid, '(not in id-map)'):18} C{cid}  {info[cid][1][:70]}")
    print('\nREAD-ONLY: no TestRail writes were made.')


if __name__ == '__main__':
    main()
