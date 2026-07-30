#!/usr/bin/env python3
"""
exec_run_sync_2026-07-31.py — AUTHORIZED run-sync executor (Standing Rule 34 + Rule 6).

Hardened successor of sync_runs_EXECUTOR.py (which stays as the DRY-RUN reference asset).
Adds every check the user's safety contract requires:

  * HARD BLOCKLIST: runs 324 / 325 / 278 can NEVER be written by this script.
  * missing lists are taken from a FRESH live audit.json (re-run run_sync_audit.py first).
  * per run, in order:
      1  get_run          -> assert include_all is False and the run is not completed
         get_tests        -> CURRENT case_id set
         get_results_for_run -> result-record count BEFORE
      2  UNION = current | missing          (NEVER a partial list — update_run REPLACES
         the selection and would delete omitted tests AND their results)
         assert len(union) == len(current) + len(added)
         assert set(current).issubset(union)
      3  fresh pre-write snapshot -> pre-write-snapshot-live/run-<id>.json
      4  update_run/<id> {"case_ids": union}
      5  VERIFY via get_tests: count == before + added, every previous case_id still
         present, and get_results_for_run count UNCHANGED.
         Plus the COMPLETENESS EQUALITY check against the project id-map active set:
         (active - run) == empty  AND  (run - active) == empty   (extras are reported,
         never removed).
      6  append + FLUSH a per-run block to run-sync-execution-log-2026-07-31.md
  * any failed check => STOP the whole chain (do not touch the next run).
  * NEVER add_result / close_run / delete_run / any case write.

Usage:
    set -a && . /tmp/tr-creds.env && set +a
    python3 build/testrail-run-sync-2026-07-31/exec_run_sync_2026-07-31.py --dry-run
    python3 build/testrail-run-sync-2026-07-31/exec_run_sync_2026-07-31.py --authorized
"""
import os, sys, json, csv, base64, time, datetime, urllib.request, urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
BASE = 'https://shopview.testrail.io/index.php?/api/v2/'
LOG = os.path.join(HERE, 'run-sync-execution-log-2026-07-31.md')
SNAP = os.path.join(HERE, 'pre-write-snapshot-live')

# USER-AUTHORIZED 2026-07-31, in this order. Nothing else may be written.
PLAN = [
    (352, 'Filters',      'build/filters/testrail-id-map.csv',      'testrail_case_id', 'internal_id'),
    (357, 'Schedule',     'build/schedule/testrail-id-map.csv',     'testrail_case_id', 'internal_id'),
    (359, 'Report Suite', 'build/report-suite/testrail-id-map.csv', 'testrail_case_id', 'internal_id'),
]
BLOCKED = {324, 325, 278}          # completed projects / graded results — NOT authorized

AUTH = None


def _auth():
    try:
        return base64.b64encode(
            f"{os.environ['TESTRAIL_USER']}:{os.environ['TESTRAIL_KEY']}".encode()).decode()
    except KeyError:
        sys.exit('TESTRAIL_USER / TESTRAIL_KEY not set — source /tmp/tr-creds.env first.')


def _req(path, payload=None):
    last = None
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
        except Exception as e:                              # transient network/proxy
            last = e
            if attempt == 4:
                return 0, {'error': f'network: {last}'}
            time.sleep(3 * (attempt + 1))


def get(path):
    st, body = _req(path)
    if st != 200:
        raise RuntimeError(f'GET {path} -> HTTP {st} {body}')
    return body


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


def idmap_active(relpath, cidcol, iidcol):
    """Active case ids from the project id-map (blank C-id = not yet in TestRail)."""
    ids, blanks = set(), []
    with open(os.path.join(REPO, relpath)) as f:
        for row in csv.DictReader(f):
            v = (row.get(cidcol) or '').strip().lstrip('Cc')
            if v.isdigit():
                ids.add(int(v))
            else:
                blanks.append(row.get(iidcol, ''))
    return ids, blanks


def logw(text):
    with open(LOG, 'a') as f:
        f.write(text)
        f.flush()
        os.fsync(f.fileno())


def main():
    global AUTH
    AUTH = _auth()
    dry = '--authorized' not in sys.argv
    audit = json.load(open(os.path.join(HERE, 'audit.json')))
    byid = {r['id']: r for r in audit}
    os.makedirs(SNAP, exist_ok=True)
    stamp = datetime.datetime.utcnow().isoformat() + 'Z'
    logw(f'\n---\n\n# Run-sync {"DRY-RUN" if dry else "EXECUTION"} — {stamp}\n\n'
         f'Authorized runs (in order): 352 Filters, 357 Schedule, 359 Reports Suite. '
         f'Blocked (never written): {sorted(BLOCKED)}.\n')

    summary = []
    for rid, proj, relmap, cidcol, iidcol in PLAN:
        assert rid not in BLOCKED, 'blocklisted run in PLAN — ABORT'
        missing = sorted(byid[rid]['groups'][proj]['missing'])
        active, blanks = idmap_active(relmap, cidcol, iidcol)

        # ---- 1. fresh live state -------------------------------------------------
        run = get(f'get_run/{rid}')
        if run.get('include_all') is not False:
            logw(f'\n**ABORT run {rid}** — include_all is {run.get("include_all")} '
                 f'(expected False).\n')
            sys.exit(f'ABORT: run {rid} include_all != False')
        if run.get('is_completed'):
            logw(f'\n**ABORT run {rid}** — run is completed.\n')
            sys.exit(f'ABORT: run {rid} is completed')
        tests = getall(f'get_tests/{rid}', 'tests')
        results = getall(f'get_results_for_run/{rid}', 'results')
        current = sorted({t['case_id'] for t in tests})
        n_res_before = len(results)

        # ---- 2. UNION + assertions ----------------------------------------------
        union = sorted(set(current) | set(missing))
        added = sorted(set(missing) - set(current))
        if not set(current).issubset(set(union)):
            logw(f'\n**ABORT run {rid}** — union lost an existing case id.\n')
            sys.exit(f'ABORT: run {rid} union subset check failed')
        if len(union) != len(current) + len(added):
            logw(f'\n**ABORT run {rid}** — arithmetic check failed: '
                 f'{len(union)} != {len(current)} + {len(added)}.\n')
            sys.exit(f'ABORT: run {rid} union arithmetic check failed')
        expected_after = len(current) + len(added)

        # ---- 3. fresh pre-write snapshot ----------------------------------------
        snap = {'captured_utc': datetime.datetime.utcnow().isoformat() + 'Z', 'run': run,
                'tests': [{'id': t['id'], 'case_id': t['case_id'],
                           'status_id': t['status_id']} for t in tests],
                'results_count': n_res_before,
                'results': [{'id': x.get('id'), 'test_id': x['test_id'],
                             'status_id': x['status_id'],
                             'created_on': x['created_on']} for x in results],
                'planned_union': union, 'planned_added': added}
        json.dump(snap, open(os.path.join(SNAP, f'run-{rid}.json'), 'w'), indent=1)

        logw(f'\n## Run {rid} — {proj} — "{run["name"]}"\n\n'
             f'- include_all: `False` (verified) · completed: `False` (verified)\n'
             f'- tests BEFORE: **{len(current)}** · result-records BEFORE: **{n_res_before}**\n'
             f'- cases to add ({len(added)}): {", ".join("C%d" % c for c in added)}\n'
             f'- UNION size: **{expected_after}** — assertions: subset OK, '
             f'{expected_after} == {len(current)} + {len(added)} OK\n'
             f'- snapshot: `pre-write-snapshot-live/run-{rid}.json`\n')

        if dry:
            print(f'run {rid} ({proj}) DRY-RUN: {len(current)} -> {expected_after} '
                  f'(+{len(added)}), results {n_res_before}')
            logw('- **DRY-RUN — no write made**\n')
            summary.append((rid, proj, len(current), expected_after, len(added),
                            n_res_before, n_res_before, 'DRY-RUN', 'n/a'))
            continue

        # ---- 4. WRITE ------------------------------------------------------------
        st, body = _req(f'update_run/{rid}', {'case_ids': union})
        logw(f'- `update_run/{rid}` -> **HTTP {st}**\n')
        if st != 200:
            logw(f'- **ABORT** — body: `{str(body)[:200]}`\n')
            sys.exit(f'ABORT: run {rid} update_run HTTP {st}')

        # ---- 5. VERIFY -----------------------------------------------------------
        tests2 = getall(f'get_tests/{rid}', 'tests')
        after = sorted({t['case_id'] for t in tests2})
        res2 = getall(f'get_results_for_run/{rid}', 'results')
        chk_count = len(after) == expected_after
        lost = sorted(set(current) - set(after))
        chk_kept = not lost
        chk_res = len(res2) == n_res_before
        chk_added = not (set(added) - set(after))
        # completeness equality vs the project id-map active set
        miss_now = sorted(active - set(after))
        extra = sorted(set(after) - active)
        chk_equal = (not miss_now) and (not extra)

        logw(f'- tests AFTER: **{len(after)}** (expected {expected_after}) — '
             f'{"OK" if chk_count else "FAIL"}\n'
             f'- every previously-present case still in the run: '
             f'{"OK" if chk_kept else "FAIL — lost " + str(lost)}\n'
             f'- all {len(added)} added cases present: {"OK" if chk_added else "FAIL"}\n'
             f'- result-records AFTER: **{len(res2)}** (before {n_res_before}) — '
             f'{"UNCHANGED — no history lost" if chk_res else "FAIL — COUNT CHANGED"}\n'
             f'- COMPLETENESS vs id-map active set ({len(active)} cases): '
             f'(active − run) = {len(miss_now)} {miss_now if miss_now else "(empty)"} · '
             f'(run − active) = {len(extra)} {extra if extra else "(empty)"} — '
             f'**{"EQUAL — run holds the complete active suite" if chk_equal else "NOT EQUAL"}**\n')
        if blanks:
            logw(f'- note: {len(blanks)} id-map rows have no TestRail C-id yet '
                 f'(not pushed): {", ".join(blanks[:20])}\n')

        ok = chk_count and chk_kept and chk_res and chk_added
        print(f'run {rid} ({proj}): {len(current)} -> {len(after)} (+{len(added)}), '
              f'results {n_res_before} -> {len(res2)}, equal={chk_equal}, '
              f'{"VERIFIED" if ok else "*** FAILED ***"}')
        summary.append((rid, proj, len(current), len(after), len(added), n_res_before,
                        len(res2), 'HTTP 200',
                        'EQUAL' if chk_equal else f'-{len(miss_now)}/+{len(extra)}'))
        if not ok:
            logw('\n- **STOP — verification failed; remaining runs NOT touched.**\n')
            sys.exit(f'ABORT after run {rid}: verification failed')

    logw('\n## Summary\n\n| Run | Project | Tests before | Tests after | Added | '
         'Results before | Results after | Write | Completeness |\n|---|---|---|---|---|---|---|---|---|\n')
    for s in summary:
        logw('| ' + ' | '.join(str(x) for x in s) + ' |\n')
    logw('\nNo `add_result*`, no `close_run`, no `delete_run`, no case writes were made. '
         'Runs 324 / 325 / 278 untouched.\n')
    print('\nlog ->', LOG)


if __name__ == '__main__':
    main()
