#!/usr/bin/env python3
"""
Report Suite — VIU push EXECUTOR · 2026-08-04.

35 update_case + 3 add_case + 1 union update_run on run 359.
NO delete_case (forbidden this pass).

Standing Rule 50 verification, PER OPERATION:
  * pre-write snapshot of every target read from snapshots/PRE-cases-group4281.json
  * after the write, re-GET and compare EVERY field:
      - fields we INTENDED to change  -> must equal the intended value byte-for-byte
      - fields we did NOT intend to change -> must be BYTE-IDENTICAL to the pre-write
        snapshot (that is how collateral damage is caught; a 200 cannot tell you)
  * the ONE permitted normalisation is `refs`: TestRail splits on commas, trims each
    entry and rejoins with a bare comma, so refs is compared under
    ','.join(p.strip() for p in s.split(',')).  Asserted explicitly, playbook §J.
  * ON MISMATCH: STOP the batch immediately, print BOTH byte sequences, do not retry.

Standing Rule 38: any target whose created_by != 3 is REFUSED before any write.
Standing Rule 34/47: update_run sends the FULL UNION; a partial list would delete
tests AND their results.

Resumable (Rule 29): every operation is appended to exec-log.jsonl as it completes, so
a killed run can be verified against live TestRail and finished from where it stopped.
"""
import json, os, sys, time, urllib.request, urllib.error, base64

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT)
from new_cases import NEW, payload  # noqa: E402

C = json.load(open('/tmp/testrail/creds.json'))
HOST = C['host'].rstrip('/')
AUTH = 'Basic ' + base64.b64encode(
    f"{C['email']}:{C.get('password') or C.get('key')}".encode()).decode()
OURS = 3                                       # Bilal Muzamil
LOGJ = os.path.join(ROOT, 'exec-log.jsonl')


def api(path, body=None, tries=4):
    url = f'{HOST}/index.php?/api/v2/{path}'
    data = json.dumps(body).encode() if body is not None else None
    last = None
    for a in range(tries):
        req = urllib.request.Request(
            url, data=data, method='POST' if data is not None else 'GET',
            headers={'Authorization': AUTH, 'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return r.status, json.loads(r.read().decode() or 'null')
        except urllib.error.HTTPError as e:
            raw = e.read().decode(errors='replace')
            try:
                parsed = json.loads(raw)
            except Exception:
                parsed = raw
            if e.code in (429, 502, 503, 504) and a < tries - 1:
                time.sleep(2 ** a); last = (e.code, parsed); continue
            return e.code, parsed
        except Exception as e:                                   # network
            last = (0, str(e))
            if a < tries - 1:
                time.sleep(2 ** a); continue
    return last


# `refs`: the one declared normalisation (playbook §J)
def norm_refs(s):
    if s is None:
        return None
    return ','.join(p.strip() for p in s.split(','))


CMP_FIELDS = ['title', 'refs', 'section_id', 'template_id', 'type_id', 'priority_id',
              'milestone_id', 'estimate', 'custom_preconds', 'custom_steps',
              'custom_expected', 'custom_atmstatus', 'custom_automation_type',
              'custom_mission', 'custom_goals', 'custom_ai_type', 'custom_ai_model',
              'custom_steps_separated', 'custom_testrail_bdd_scenario', 'is_deleted']


def verify(cid, pre, intended, live):
    """Exhaustive then exact.  Returns (ok, [detail...])."""
    problems, checked = [], []
    for f in CMP_FIELDS:
        want = intended[f] if f in intended else pre.get(f)
        got = live.get(f)
        if f == 'refs':
            a, b = norm_refs(want), norm_refs(got)
            note = ' (under the declared refs normalisation)'
        else:
            a, b = want, got
            note = ''
        if a != b:
            problems.append(
                f'FIELD {f} MISMATCH{note}\n    INTENDED bytes: {json.dumps(a, ensure_ascii=False)}'
                f'\n    LIVE     bytes: {json.dumps(b, ensure_ascii=False)}')
        else:
            checked.append(f + ('=CHANGED' if f in intended else '=byte-identical'))
    return (not problems), problems, checked


def log(rec):
    with open(LOGJ, 'a') as fh:
        fh.write(json.dumps(rec, ensure_ascii=False) + '\n')


def die(msg):
    print('\n' + '=' * 78 + f'\nSTOPPED: {msg}\n' + '=' * 78)
    sys.exit(1)


def main():
    PRE = {c['id']: c for c in json.load(
        open(os.path.join(ROOT, 'snapshots', 'PRE-cases-group4281.json')))}
    EDITS = {int(k): v for k, v in json.load(
        open(os.path.join(ROOT, 'edit-set.json'))).items()}

    done = set()
    if os.path.exists(LOGJ):
        for line in open(LOGJ):
            r = json.loads(line)
            if r.get('verified') and r['op'] == 'update_case':
                done.add(r['cid'])
        print(f'resume: {len(done)} update_case already verified')

    # ---------- Rule 38 gate ----------
    for cid in EDITS:
        if cid not in PRE:
            die(f'C{cid} is not in the pre-write snapshot')
        if PRE[cid]['created_by'] != OURS:
            die(f'C{cid} created_by={PRE[cid]["created_by"]} — FOREIGN CASE, refused (Rule 38)')
    print(f'Rule 38 gate: all {len(EDITS)} targets are ours (created_by={OURS})')

    # ---------- PHASE 1: update_case ----------
    print(f'\n===== PHASE 1: update_case x{len(EDITS)} =====')
    for i, cid in enumerate(sorted(EDITS), 1):
        if cid in done:
            print(f'[{i}/{len(EDITS)}] C{cid} already verified — skipped')
            continue
        intended = EDITS[cid]
        code, body = api(f'update_case/{cid}', intended)
        if code != 200:
            log(dict(op='update_case', cid=cid, http=code, verified=False, error=str(body)[:600]))
            die(f'update_case C{cid} returned HTTP {code}: {str(body)[:400]}')
        gcode, live = api(f'get_case/{cid}')
        if gcode != 200:
            die(f're-GET of C{cid} returned HTTP {gcode}')
        ok, problems, checked = verify(cid, PRE[cid], intended, live)
        log(dict(op='update_case', cid=cid, http=code, verified=ok,
                 fields_changed=sorted(intended), fields_checked=len(checked),
                 problems=problems))
        if not ok:
            print('\n'.join(problems))
            die(f'BYTE-LEVEL VERIFICATION FAILED on C{cid} — the write FAILED. '
                f'Batch stopped, nothing retried.')
        print(f'[{i}/{len(EDITS)}] C{cid} HTTP 200 · {len(intended)} field(s) changed · '
              f'{len(checked)} fields byte-verified · OK')

    # ---------- PHASE 2: add_case ----------
    print(f'\n===== PHASE 2: add_case x{len(NEW)} =====')
    added = {}
    if os.path.exists(LOGJ):
        for line in open(LOGJ):
            r = json.loads(line)
            if r['op'] == 'add_case' and r.get('verified'):
                added[r['internal_id']] = r['cid']
    for n in NEW:
        if n['internal_id'] in added:
            print(f"  {n['internal_id']} already added as C{added[n['internal_id']]} — skipped")
            continue
        p = payload(n)
        code, body = api(f"add_case/{n['section_id']}", p)
        if code != 200:
            log(dict(op='add_case', internal_id=n['internal_id'], http=code,
                     verified=False, error=str(body)[:600]))
            die(f"add_case {n['internal_id']} returned HTTP {code}: {str(body)[:400]}")
        cid = body['id']
        gcode, live = api(f'get_case/{cid}')
        if gcode != 200:
            die(f're-GET of new C{cid} returned HTTP {gcode}')
        problems = []
        for f, want in p.items():
            got = live.get(f)
            a, b = (norm_refs(want), norm_refs(got)) if f == 'refs' else (want, got)
            if a != b:
                problems.append(f'FIELD {f} MISMATCH\n    INTENDED: {json.dumps(a, ensure_ascii=False)}'
                                f'\n    LIVE    : {json.dumps(b, ensure_ascii=False)}')
        if live['section_id'] != n['section_id']:
            problems.append(f"section_id MISMATCH intended {n['section_id']} live {live['section_id']}")
        if live['created_by'] != OURS:
            problems.append(f"created_by is {live['created_by']}, expected {OURS}")
        log(dict(op='add_case', internal_id=n['internal_id'], cid=cid, http=code,
                 verified=not problems, fields_checked=len(p) + 2, problems=problems))
        if problems:
            print('\n'.join(problems)); die(f"add_case verification FAILED for {n['internal_id']} (C{cid})")
        added[n['internal_id']] = cid
        print(f"  {n['internal_id']} = C{cid} HTTP 200 · {len(p)+2} fields byte-verified · OK")

    json.dump(added, open(os.path.join(ROOT, 'new-case-ids.json'), 'w'), indent=1)

    # ---------- PHASE 3: run 359 UNION sync ----------
    print('\n===== PHASE 3: run 359 union sync (Rule 34/47) =====')
    pre_tests = json.load(open(os.path.join(ROOT, 'snapshots', 'PRE-run359-tests.json')))
    pre_results = json.load(open(os.path.join(ROOT, 'snapshots', 'PRE-run359-results.json')))
    cur_ids = sorted({t['case_id'] for t in pre_tests})
    new_ids = sorted(added.values())
    union = sorted(set(cur_ids) | set(new_ids))
    print(f'  before: {len(pre_tests)} tests / {len(pre_results)} result records / '
          f'{len(cur_ids)} distinct case_ids')
    print(f'  union : {len(union)} case_ids  (= {len(cur_ids)} + {len(set(new_ids) - set(cur_ids))} new)')
    if len(union) != len(cur_ids) + len(set(new_ids) - set(cur_ids)):
        die('union arithmetic is wrong — refusing to write the run')
    if not set(cur_ids).issubset(set(union)):
        die('THE UNION DOES NOT CONTAIN EVERY CURRENT case_id — a partial list would '
            'DELETE tests and their results. Refusing.')

    code, body = api('update_run/359', {'case_ids': union})
    if code != 200:
        log(dict(op='update_run', run=359, http=code, verified=False, error=str(body)[:600]))
        die(f'update_run 359 returned HTTP {code}: {str(body)[:400]}')

    off, post_tests = 0, []
    while True:
        c, b = api(f'get_tests/359&limit=250&offset={off}')
        t = b.get('tests', [])
        post_tests += t
        if len(t) < 250:
            break
        off += 250
    off, post_results = 0, []
    while True:
        c, b = api(f'get_results_for_run/359&limit=250&offset={off}')
        t = b.get('results', [])
        post_results += t
        if len(t) < 250:
            break
        off += 250

    post_ids = {t['case_id'] for t in post_tests}
    pre_res_ids = {r['id'] for r in pre_results}
    post_res_ids = {r['id'] for r in post_results}
    problems = []
    if len(post_tests) != len(pre_tests) + len(set(new_ids) - set(cur_ids)):
        problems.append(f'test count is {len(post_tests)}, expected '
                        f'{len(pre_tests) + len(set(new_ids) - set(cur_ids))}')
    if post_ids - set(union):
        problems.append(f'live has case_ids not in the union: {sorted(post_ids - set(union))}')
    if set(union) - post_ids:
        problems.append(f'union has case_ids missing from the run: {sorted(set(union) - post_ids)}')
    missing = pre_res_ids - post_res_ids
    if missing:
        problems.append(f'{len(missing)} PRIOR RESULT RECORDS ARE GONE (by id): '
                        f'{sorted(missing)[:20]}')
    log(dict(op='update_run', run=359, http=code, verified=not problems,
             tests_before=len(pre_tests), tests_after=len(post_tests),
             results_before=len(pre_results), results_after=len(post_results),
             results_all_present_by_id=not missing,
             case_id_sets_equal_both_ways=(post_ids == set(union)), problems=problems))
    if problems:
        print('\n'.join(problems)); die('RUN SYNC VERIFICATION FAILED')
    print(f'  after : {len(post_tests)} tests / {len(post_results)} result records')
    print(f'  case_id sets equal BOTH directions: {post_ids == set(union)}')
    print(f'  all {len(pre_res_ids)} prior result records present BY ID: {not missing}')

    # ---------- PHASE 4: foreign cases proven untouched (Rule 38 / 50) ----------
    print('\n===== PHASE 4: foreign cases byte-identical =====')
    foreign = [c for c in PRE.values() if c['created_by'] != OURS]
    bad = []
    for c in foreign:
        gc, live = api(f"get_case/{c['id']}")
        if gc != 200:
            die(f"re-GET of foreign C{c['id']} returned HTTP {gc}")
        for f in CMP_FIELDS + ['updated_on', 'updated_by', 'created_on', 'created_by']:
            if c.get(f) != live.get(f):
                bad.append(f"C{c['id']} {f}: pre={c.get(f)!r} live={live.get(f)!r}")
    log(dict(op='verify_foreign_untouched', cids=[c['id'] for c in foreign],
             verified=not bad, problems=bad))
    if bad:
        print('\n'.join(bad)); die('A FOREIGN CASE CHANGED')
    print(f"  {', '.join('C%d' % c['id'] for c in foreign)} — byte-identical "
          f"(updated_on / updated_by included): OK")

    print('\nALL OPERATIONS COMPLETE AND BYTE-VERIFIED.')


if __name__ == '__main__':
    main()
