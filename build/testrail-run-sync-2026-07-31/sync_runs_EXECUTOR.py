#!/usr/bin/env python3
"""
sync_runs_EXECUTOR.py — the ONE write operation of the run-sync (Standing Rule 34).

*** NOT EXECUTED. Awaiting explicit user authorization (Standing Rule 6). ***

What it does, per run, in this order:
  1. SNAPSHOT  get_run + get_tests + get_results_for_run  ->  pre-write-snapshot/run-<id>.json
  2. UNION     case_ids = sorted(set(current) | set(missing))     <-- never a partial list
  3. WRITE     update_run/<id> with {"case_ids": <FULL union>}
  4. VERIFY    re-get_run (count == expected after) + re-get_results_for_run
               (every previously recorded result still present, same status_id)
  5. LOG       append a row to testrail-execution-log-2026-07-31.md

WHY THE UNION MATTERS: update_run REPLACES the run's case selection. A partial case_ids
list DELETES the omitted tests AND their recorded results. Runs 324 and 325 already have
recorded results — a partial write there destroys real QA history.

Usage (only after the user authorizes):
    set -a && . /tmp/tr-creds.env && set +a
    python3 build/testrail-run-sync-2026-07-31/sync_runs_EXECUTOR.py --dry-run          # safe
    python3 build/testrail-run-sync-2026-07-31/sync_runs_EXECUTOR.py --authorized       # writes
    ... optional: --only 352,357   to sync a subset of runs
"""
import os, sys, json, base64, time, urllib.request, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = 'https://shopview.testrail.io/index.php?/api/v2/'
LOG = os.path.join(HERE, 'testrail-execution-log-2026-07-31.md')
SNAP = os.path.join(HERE, 'pre-write-snapshot')

# run id -> project name (the tester-facing project runs). Deliberately-scoped Custom Roles
# runs 303/304/311/323/331 are NOT in this list — they are narrow-purpose runs by design.
PLAN = [(352, 'Filters'), (357, 'Schedule'), (359, 'Report Suite'),
        (324, 'Fees & Discounts'), (325, 'Simple Flow'), (278, 'Custom Roles')]

AUTH = None


def _auth():
    try:
        return base64.b64encode(
            f"{os.environ['TESTRAIL_USER']}:{os.environ['TESTRAIL_KEY']}".encode()).decode()
    except KeyError:
        sys.exit('TESTRAIL_USER / TESTRAIL_KEY not set — source /tmp/tr-creds.env first.')


def _req(path, payload=None):
    for attempt in range(5):
        try:
            data = json.dumps(payload).encode() if payload is not None else None
            req = urllib.request.Request(
                BASE + path, data=data,
                headers={'Authorization': 'Basic ' + AUTH, 'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=180) as r:
                return r.status, json.loads(r.read().decode() or '{}')
        except urllib.error.HTTPError as e:
            return e.code, {'error': e.read().decode()[:300]}
        except Exception:
            if attempt == 4:
                raise
            time.sleep(3 * (attempt + 1))


def get(path):
    return _req(path)[1]


def getall(path, key):
    out, offset = [], 0
    while True:
        d = get(f'{path}&limit=250&offset={offset}')
        chunk = d if isinstance(d, list) else d.get(key, [])
        out.extend(chunk)
        if len(chunk) < 250:
            break
        offset += 250
    return out


def main():
    global AUTH
    AUTH = _auth()
    dry = '--authorized' not in sys.argv
    only = None
    if '--only' in sys.argv:
        only = {int(x) for x in sys.argv[sys.argv.index('--only') + 1].split(',')}

    audit = json.load(open(os.path.join(HERE, 'audit.json')))
    byid = {r['id']: r for r in audit}
    os.makedirs(SNAP, exist_ok=True)
    rows = []

    for rid, proj in PLAN:
        if only and rid not in only:
            continue
        missing = byid[rid]['groups'][proj]['missing']
        if not missing:
            print(f'run {rid} ({proj}): nothing to add')
            continue

        # 1. SNAPSHOT (always, even in dry-run)
        run = get(f'get_run/{rid}')
        tests = getall(f'get_tests/{rid}', 'tests')
        results = getall(f'get_results_for_run/{rid}', 'results')
        snap = {'captured_utc': datetime.datetime.utcnow().isoformat() + 'Z', 'run': run,
                'tests': [{'id': t['id'], 'case_id': t['case_id'], 'status_id': t['status_id']}
                          for t in tests],
                'results_count': len(results),
                'results': [{'test_id': x['test_id'], 'status_id': x['status_id'],
                             'created_on': x['created_on']} for x in results]}
        json.dump(snap, open(os.path.join(SNAP, f'run-{rid}.json'), 'w'), indent=1)

        current = sorted({t['case_id'] for t in tests})
        union = sorted(set(current) | set(missing))          # 2. UNION — never partial
        assert set(current).issubset(set(union)), 'union lost an existing case — ABORT'
        before, after = len(current), len(union)
        print(f'run {rid} ({proj}): {before} -> {after} (+{len(missing)}), '
              f'{len(results)} recorded results, snapshot saved')

        if dry:
            rows.append((rid, proj, before, after, len(missing), len(results), 'DRY-RUN', '-'))
            continue

        # 3. WRITE
        status, body = _req(f'update_run/{rid}', {'case_ids': union})
        # 4. VERIFY
        run2 = get(f'get_run/{rid}')
        n2 = sum(run2[k] for k in ('passed_count', 'failed_count', 'blocked_count',
                                   'retest_count', 'untested_count'))
        res2 = getall(f'get_results_for_run/{rid}', 'results')
        ok = (status == 200 and n2 == after and len(res2) >= len(results))
        print(f'   HTTP {status} | after={n2} (expected {after}) | '
              f'results {len(results)} -> {len(res2)} | {"OK" if ok else "*** CHECK ***"}')
        rows.append((rid, proj, before, after, len(missing), len(results),
                     f'HTTP {status}', 'VERIFIED' if ok else 'CHECK'))

    with open(LOG, 'a') as f:
        f.write(f'\n## Run-sync {"DRY-RUN" if dry else "EXECUTION"} '
                f'{datetime.datetime.utcnow().isoformat()}Z\n\n')
        f.write('| Run | Project | Before | After | Added | Results before | HTTP | Verify |\n')
        f.write('|---|---|---|---|---|---|---|---|\n')
        for r in rows:
            f.write('| ' + ' | '.join(str(x) for x in r) + ' |\n')
    print('\nlog ->', LOG)
    if dry:
        print('DRY-RUN: no TestRail writes were made. Re-run with --authorized after the '
              'user authorizes (Standing Rule 6).')


if __name__ == '__main__':
    main()
