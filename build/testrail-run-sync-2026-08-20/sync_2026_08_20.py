#!/usr/bin/env python3
"""
sync_2026_08_20.py — Run-sync pass (Standing Rule 34 + Rule 47), 2026-08-20.

Scope: the THREE ACTIVE runs ONLY — 359 (Report Suite / group 4281),
357 (Schedule / group 4254), 352 (Filters / group 4110).

Per run: AUDIT (read-only) -> SNAPSHOT -> (if gap>0 & include_all False) UNION update_run
-> VERIFY by-id (every prior result present, 0 graded status_id changed, both directions
set-equal). Add-only; never a partial case_ids list (Rule 34: a partial update_run DELETES
the omitted tests AND their results). Case-membership only — NEVER writes a result (Rule 6).

Our ACTIVE cases = cases under the group whose created_by == 3 (Bilal Muzamil).
Foreign cases (created_by != 3) are excluded from the gap (Rule 38) but PRESERVED in the
run because the union keeps every current case_id.

Usage:
    python3 sync_2026_08_20.py                # audit + snapshot only (no writes)
    python3 sync_2026_08_20.py --authorized   # audit + snapshot + union update_run
"""
import os, sys, json, base64, time, urllib.request, urllib.error, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, 'snapshots')
BASE = 'https://shopview.testrail.io/index.php?/api/v2/'
PROJECT, SUITE = 1, 1
OUR_UID = 3

PLAN = [(359, 'Report Suite', 4281), (357, 'Schedule', 4254), (352, 'Filters', 4110)]

C = json.load(open('/tmp/testrail/creds.json'))
SECRET = C.get('password') or C.get('key')
AUTH = base64.b64encode(f"{C['email']}:{SECRET}".encode()).decode()
H = {'Authorization': 'Basic ' + AUTH, 'Content-Type': 'application/json'}


def _req(path, payload=None):
    for attempt in range(5):
        try:
            data = json.dumps(payload).encode() if payload is not None else None
            req = urllib.request.Request(BASE + path, data=data, headers=H)
            with urllib.request.urlopen(req, timeout=180) as r:
                return r.status, json.loads(r.read().decode() or '{}')
        except urllib.error.HTTPError as e:
            return e.code, {'error': e.read().decode()[:400]}
        except Exception:
            if attempt == 4:
                raise
            time.sleep(3 * (attempt + 1))


def get(path):
    return _req(path)[1]


def getall(path, key):
    out, offset = [], 0
    sep = '&' if '?' in path or '/' in path else '?'
    while True:
        d = get(f'{path}{sep}limit=250&offset={offset}')
        chunk = d if isinstance(d, list) else d.get(key, [])
        out.extend(chunk)
        if len(chunk) < 250:
            break
        offset += 250
    return out


def build_group_index():
    secs = getall(f'get_sections/{PROJECT}&suite_id={SUITE}', 'sections')
    byid = {s['id']: s for s in secs}
    groups = {g for _, _, g in PLAN}

    def grp(sid):
        seen = set()
        while sid and sid not in seen:
            if sid in groups:
                return sid
            seen.add(sid)
            sid = byid.get(sid, {}).get('parent_id')
        return None
    return grp


def main():
    authorized = '--authorized' in sys.argv
    os.makedirs(SNAP, exist_ok=True)
    grp = build_group_index()

    cases = getall(f'get_cases/{PROJECT}&suite_id={SUITE}', 'cases')
    # group -> set of OUR active case ids (created_by == 3)
    ours_by_group, foreign_by_group = {}, {}
    for c in cases:
        g = grp(c['section_id'])
        if g is None:
            continue
        if c.get('created_by') == OUR_UID:
            ours_by_group.setdefault(g, set()).add(c['id'])
        else:
            foreign_by_group.setdefault(g, set()).add(c['id'])

    report = {'captured_utc': datetime.datetime.utcnow().isoformat() + 'Z',
              'authorized': authorized, 'runs': []}

    for rid, proj, gid in PLAN:
        run = get(f'get_run/{rid}')
        tests = getall(f'get_tests/{rid}', 'tests')
        results = getall(f'get_results_for_run/{rid}', 'results')
        current = {t['case_id'] for t in tests}
        ours = ours_by_group.get(gid, set())
        foreign = foreign_by_group.get(gid, set())

        # SNAPSHOT (always, even in audit mode)
        snap = {'captured_utc': datetime.datetime.utcnow().isoformat() + 'Z',
                'run_id': rid, 'project': proj, 'group_id': gid,
                'include_all': run['include_all'], 'is_completed': run['is_completed'],
                'test_count': len(tests),
                'tests': [{'id': t['id'], 'case_id': t['case_id'],
                           'status_id': t['status_id']} for t in tests],
                'results_count': len(results),
                'results': [{'id': x['id'], 'test_id': x['test_id'],
                             'status_id': x['status_id'], 'created_on': x['created_on']}
                            for x in results]}
        json.dump(snap, open(os.path.join(SNAP, f'PRE-run-{rid}.json'), 'w'), indent=1)

        gap = sorted(ours - current)          # our active cases not yet in the run
        # graded results = results with a real status (not blank); status_id present always
        graded_test_ids = {x['test_id'] for x in results}

        rec = {'run_id': rid, 'project': proj, 'group_id': gid,
               'include_all': run['include_all'], 'is_completed': run['is_completed'],
               'before_test_count': len(tests),
               'our_active_total': len(ours), 'foreign_total': len(foreign),
               'current_case_ids_count': len(current),
               'gap_count': len(gap), 'gap_case_ids': [f'C{c}' for c in gap],
               'results_count': len(results),
               'foreign_in_run': sorted(f'C{c}' for c in (current & foreign)),
               'stale_in_run': sorted(f'C{c}' for c in current
                                      if c not in ours and c not in foreign)}

        print(f"\n=== run {rid} ({proj}) group {gid} ===")
        print(f"  include_all={run['include_all']} completed={run['is_completed']}")
        print(f"  before tests={len(tests)}  our-active={len(ours)}  foreign={len(foreign)}"
              f"  results={len(results)}")
        print(f"  GAP (our active not in run) = {len(gap)}: {rec['gap_case_ids']}")
        if rec['foreign_in_run']:
            print(f"  foreign already in run (kept): {rec['foreign_in_run']}")
        if rec['stale_in_run']:
            print(f"  stale in run (not in live cases, kept): {rec['stale_in_run']}")

        if run['include_all']:
            rec['action'] = 'include_all TRUE — new cases auto-appear; verify only'
            print(f"  ACTION: {rec['action']}")
            report['runs'].append(rec)
            continue
        if not gap:
            rec['action'] = 'already complete — nothing to add'
            print(f"  ACTION: {rec['action']}")
            report['runs'].append(rec)
            continue

        union = sorted(current | set(gap))    # UNION — never partial
        assert current.issubset(set(union)), 'union lost a current case — ABORT'
        rec['after_test_count_expected'] = len(union)

        if not authorized:
            rec['action'] = f'DRY-RUN — would union {len(current)} -> {len(union)}'
            print(f"  ACTION: {rec['action']} (no write)")
            report['runs'].append(rec)
            continue

        # WRITE
        status, body = _req(f'update_run/{rid}', {'case_ids': union})
        rec['update_run_http'] = status
        if status != 200:
            rec['action'] = f'WRITE FAILED HTTP {status}: {body}'
            print(f"  *** {rec['action']} ***")
            report['runs'].append(rec)
            json.dump(report, open(os.path.join(HERE, 'audit.json'), 'w'), indent=1)
            sys.exit(f'STOP: update_run/{rid} failed HTTP {status}')

        # VERIFY (Rule 50: exhaustive + exact, by id, both directions)
        tests2 = getall(f'get_tests/{rid}', 'tests')
        results2 = getall(f'get_results_for_run/{rid}', 'results')
        case2 = {t['case_id'] for t in tests2}
        res2_by_id = {x['id']: x for x in results2}
        pre_res_by_id = {x['id']: x for x in results}

        missing_res = [rid_ for rid_ in pre_res_by_id if rid_ not in res2_by_id]
        changed_status = [rid_ for rid_, x in pre_res_by_id.items()
                          if rid_ in res2_by_id
                          and res2_by_id[rid_]['status_id'] != x['status_id']]
        gap_present = [c for c in gap if c in case2]
        set_equal = (set(union) == case2)

        json.dump({'captured_utc': datetime.datetime.utcnow().isoformat() + 'Z',
                   'test_count': len(tests2),
                   'tests': [{'id': t['id'], 'case_id': t['case_id'],
                              'status_id': t['status_id']} for t in tests2],
                   'results_count': len(results2)},
                  open(os.path.join(SNAP, f'POST-run-{rid}.json'), 'w'), indent=1)

        rec.update({'after_test_count': len(tests2),
                    'results_before': len(results), 'results_after': len(results2),
                    'prior_results_missing_by_id': missing_res,
                    'prior_results_status_changed': changed_status,
                    'gap_present_after': len(gap_present),
                    'case_set_equal_both_ways': set_equal})
        ok = (not missing_res and not changed_status
              and len(gap_present) == len(gap)
              and len(tests2) == len(union) and set_equal)
        rec['verify'] = 'VERIFIED' if ok else 'CHECK — SEE FIELDS'
        print(f"  WRITE HTTP {status} | after tests={len(tests2)} (expected {len(union)})")
        print(f"  results {len(results)} -> {len(results2)} | "
              f"prior-missing-by-id={len(missing_res)} | status-changed={len(changed_status)}")
        print(f"  gap-now-present={len(gap_present)}/{len(gap)} | "
              f"set-equal-both-ways={set_equal} | {rec['verify']}")
        report['runs'].append(rec)
        if not ok:
            json.dump(report, open(os.path.join(HERE, 'audit.json'), 'w'), indent=1)
            sys.exit(f'STOP: verification failed for run {rid} — do not proceed.')

    json.dump(report, open(os.path.join(HERE, 'audit.json'), 'w'), indent=1)
    print('\naudit.json written. mode =', 'AUTHORIZED WRITE' if authorized else 'DRY-RUN')


if __name__ == '__main__':
    main()
