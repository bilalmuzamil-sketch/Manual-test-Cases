#!/usr/bin/env python3
"""
GLOBAL SEARCH ONLY - the post-release clean-up the QA lead ordered on 2026-10-05:

  "the fixes will be moved to Production and the plan is to delete ALL the test cases which will still
   be appearing FAILED. Because after the current fixes anything which is PASSED will be considered the
   feature for now and the rest of the tests which failed will not be considered the part of the
   feature so we will delete them."   (and: "This is for Global search only, do not save it as your rule")

This script turns ONE deciding run of the e2e suite (Playwright JSON, run on Production after the fixes
shipped) into a deletion plan, and - only when told to, with the plan he approved - carries it out.

  plan   python3 plan_deletions.py plan <e2e-results.json> <build-marker> [--run 415]
         Reads run 415 LIVE, reads every case live, writes:
           DELETION-PLAN-<date>.md   the list he approves, in plain words, with links
           DELETION-PLAN-<date>.json the same list, machine-readable (what `apply` executes)
           archive-<date>/C<id>.json the FULL body of every case on the list, before anything is touched
         Writes NOTHING to TestRail.

  apply  python3 plan_deletions.py apply DELETION-PLAN-<date>.json --approved "<his words and date>"
         Deletes exactly the cases in that file, re-checking each one live first, then reads each back.
         Run this ONLY after he has approved that list (a TestRail write needs his go-ahead, Rule 6).

How a case is judged (a case can have several tests):
  - FAILED     any of its tests failed, or a known fault still reproduced (test.fail() read as "expected")
  - PASSED     every test passed (a known fault that did NOT reproduce counts as passed)
  - NOT RUN    every test stood down (skipped) - it could not be judged, so it is NOT deleted; it gets
               another try (default the QA lead was offered on 2026-10-05)
  - NO TEST    the case is in the run but no automated test covers it - not judged, not deleted
Protected, never deleted, listed separately:
  - created_by == 1 (Vladimir Tomovic) - his cases are never changed (Rule 38)
  - custom_atmstatus == 3 (flagged Automated) - held for the QA lead's say (Rule 71)
"""
import datetime, json, os, re, sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'testing-tools'))
HERE = os.environ.get('CLEANUP_OUT') or os.path.dirname(os.path.abspath(__file__))   # CLEANUP_OUT: trial runs
TR = 'https://shopview.testrail.io/index.php?/'


def parse_results(path):
    """{case id: [(test title, verdict, spec file, reason)]} from a Playwright JSON report."""
    out = {}

    def walk(s, f=None):
        f = s.get('file', f)
        for sp in s.get('suites', []):
            walk(sp, f)
        for spec in s.get('specs', []):
            title = spec['title']
            cids = re.findall(r'@C(\d{5,6})', title) or re.findall(r'\bC(\d{5,6})\b', title)
            for t in spec.get('tests', []):
                st = t.get('status')                   # expected | unexpected | skipped | flaky
                ann = {a.get('type'): a.get('description', '') for a in (t.get('annotations') or [])}
                known = 'fail' in ann or re.search(r'expected to fail: SV-\d+', title)
                if st == 'skipped':
                    v = 'NOT RUN'
                elif known:
                    v = 'FAILED' if st == 'expected' else 'PASSED'      # the fault reproduced / did not
                elif st in ('expected', 'flaky'):
                    v = 'PASSED'
                else:
                    v = 'FAILED'
                for c in cids:
                    out.setdefault(int(c), []).append((re.sub(r'\s*@C\d+', '', title).strip(), v, f,
                                                       ann.get('skip', '')))
    for s in json.load(open(path)).get('suites', []):
        walk(s)
    return out


def verdict(tests):
    vs = {v for _, v, _, _ in tests}
    if 'FAILED' in vs:
        return 'FAILED'
    if vs == {'NOT RUN'}:
        return 'NOT RUN'
    return 'PASSED'


def run_tests(T, run):
    tests, off = [], 0
    while True:
        st, body = T._req('GET', f'get_tests/{run}&limit=250&offset={off}')
        if st != 200:
            sys.exit(f'get_tests/{run} answered {st}: {str(body)[:200]}')
        chunk = body['tests'] if isinstance(body, dict) and 'tests' in body else body
        tests.extend(chunk)
        if len(chunk) < 250:
            return tests
        off += 250


def plan(results, build, run):
    import tr_client as T
    today = datetime.date.today().isoformat()
    judged = parse_results(results)
    in_run = run_tests(T, run)
    rows, buckets = [], {}
    for t in in_run:
        cid = t['case_id']
        tests = judged.get(cid)
        v = verdict(tests) if tests else 'NO TEST'
        st, case = T.get_case(cid)
        if st != 200:
            sys.exit(f'get_case/{cid} answered {st} - stopping: a plan built on a partial read is not a plan')
        protected = ('Vladimir Tomovic (user 1) - never changed, Rule 38' if case.get('created_by') == 1 else
                     'flagged Automated - held for the QA lead, Rule 71' if case.get('custom_atmstatus') == 3 else '')
        r = dict(case_id=cid, test_id=t['id'], title=case['title'], verdict=v, protected=protected,
                 created_by=case.get('created_by'), section_id=case.get('section_id'),
                 tests=[dict(title=a, verdict=b, spec=c, reason=d) for a, b, c, d in (tests or [])])
        rows.append(r)
        key = ('PROTECTED' if v == 'FAILED' and protected else v)
        buckets.setdefault(key, []).append(r)
        if v == 'FAILED' and not protected:
            os.makedirs(os.path.join(HERE, f'archive-{today}'), exist_ok=True)
            json.dump(case, open(os.path.join(HERE, f'archive-{today}', f'C{cid}.json'), 'w'), indent=1,
                      ensure_ascii=False)
    delete = buckets.get('FAILED', [])
    meta = dict(made=today, build=build, run=run, results=os.path.abspath(results),
                counts={k: len(v) for k, v in buckets.items()}, total_in_run=len(in_run))
    json.dump(dict(meta=meta, delete=[r['case_id'] for r in delete], rows=rows),
              open(os.path.join(HERE, f'DELETION-PLAN-{today}.json'), 'w'), indent=1, ensure_ascii=False)

    link = lambda r: (f"[C{r['case_id']}]({TR}cases/view/{r['case_id']}) · "
                      f"[test in run {run}]({TR}tests/view/{r['test_id']})")
    md = [f'# Global Search - cases to delete after the release ({today})', '',
          f'Judged on build **{build}**, run of the automated suite on Production. '
          f'Run {run}: {TR}runs/view/{run}', '',
          'The QA lead ordered (2026-10-05, Global Search only): after the fixes reach Production, every case '
          'that still fails is deleted; what passes is the feature from now on.', '',
          '| What | Cases | What happens |', '|---|---|---|',
          f"| Still failing - **to delete** | {len(delete)} | deleted once he approves this list; full text saved first in `archive-{today}/` |",
          f"| Still failing but protected | {len(buckets.get('PROTECTED', []))} | NOT deleted - listed below with the reason |",
          f"| Passed | {len(buckets.get('PASSED', []))} | kept - this is the feature now |",
          f"| Could not run (stood down) | {len(buckets.get('NOT RUN', []))} | NOT deleted - gets another try |",
          f"| No automated test covers it | {len(buckets.get('NO TEST', []))} | NOT judged by this run, NOT deleted |",
          f'| **Total in run {run}** | **{len(in_run)}** | |', '']
    for key, head in (('FAILED', 'To delete'), ('PROTECTED', 'Failing but protected - not deleted'),
                      ('NOT RUN', 'Could not run - not deleted'), ('NO TEST', 'No automated test - not judged')):
        if not buckets.get(key):
            continue
        md += [f'## {head}', '', '| Case | Title | Why |', '|---|---|---|']
        for r in buckets[key]:
            why = r['protected'] or '; '.join(sorted({f"{t['verdict']}: {t['title'][:60]}" for t in r['tests']})) or '-'
            md.append(f"| {link(r)} | {r['title'][:80]} | {why.replace('|', '/')[:200]} |")
        md.append('')
    md += ['## The automated tests that go with the deleted cases', '',
           'Remove these from `build/global-search/e2e/tests/` in the same change, so nobody keeps running a '
           'test for a case that no longer exists. A test that also carries a KEPT case is edited, not removed.', '']
    for r in delete:
        for t in r['tests']:
            md.append(f"- C{r['case_id']} - `{os.path.basename(t['spec'] or '')}` - {t['title'][:90]}")
    open(os.path.join(HERE, f'DELETION-PLAN-{today}.md'), 'w').write('\n'.join(md) + '\n')
    print(json.dumps(meta, indent=1))


def apply(plan_file, approved):
    import tr_client as T
    p = json.load(open(plan_file))
    log = []
    for cid in p['delete']:
        st, case = T.get_case(cid)
        if st != 200:
            log.append(dict(case_id=cid, op='skip', why=f'read answered {st} (already gone?)')); continue
        if case.get('created_by') == 1 or case.get('custom_atmstatus') == 3:
            log.append(dict(case_id=cid, op='skip', why='became protected since the plan was made')); continue
        archived = os.path.join(HERE, f"archive-{p['meta']['made']}", f'C{cid}.json')
        if not os.path.exists(archived):
            log.append(dict(case_id=cid, op='skip', why='no archived copy - refusing to delete')); continue
        st, body = T.post(f'delete_case/{cid}', {})
        back, _ = T.get_case(cid)
        log.append(dict(case_id=cid, op='delete_case', http=st, read_back=back,
                        verified=(st == 200 and back == 400)))
    out = plan_file.replace('.json', '-APPLIED.json')
    json.dump(dict(approved=approved, at=datetime.datetime.utcnow().isoformat() + 'Z', log=log), open(out, 'w'), indent=1)
    ok = sum(1 for x in log if x.get('verified'))
    print(f'deleted and confirmed gone: {ok} of {len(p["delete"])}; log: {out}')
    sys.exit(0 if ok == len(p['delete']) else 1)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['plan'] and len(a) >= 3:
        plan(a[1], a[2], int(a[a.index('--run') + 1]) if '--run' in a else 415)
    elif a[:1] == ['apply'] and len(a) >= 2 and '--approved' in a:
        apply(a[1], a[a.index('--approved') + 1])
    else:
        sys.exit(__doc__)
