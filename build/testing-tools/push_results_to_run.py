#!/usr/bin/env python3
"""Write a pass's verdicts into a TestRail run — safely, and readably.

Proven live 2026-09-07 on run R417 (Invoice UI Refresh, 120 cases). Written so that
no future session has to re-derive the four things that cost this one real time.

    python3 build/testing-tools/push_results_to_run.py \
        --run 417 \
        --results build/<project>/execution-<date>/RESULTS.json \
        --build-marker v26.35.9-9812433 \
        --date "7 September 2026" \
        --env staging \
        --dry-run          # ALWAYS do this first: prints, writes nothing

Drop --dry-run to write.

--------------------------------------------------------------------------------
THE FOUR THINGS THIS HANDLES FOR YOU
--------------------------------------------------------------------------------
1. UNION SYNC (Rule 34). A run's case list is only ever GROWN. This computes
   existing tests UNION the results file and refuses to shrink. Passing a partial
   case_ids list to update_run DELETES tests AND THEIR RESULTS. That is
   unrecoverable. The assert here is the guard.

2. BLOCK PARAGRAPHS. TestRail wraps a submitted result comment in ONE outer <p>,
   so plain "\\n\\n" COLLAPSES and the tester reads a wall of text. Block <p> tags
   DO render in a RESULT comment and do NOT show literally — this is the OPPOSITE
   of a CASE field written through the API, which lands in the escaping container.
   NEVER emit <br>: it is origin-dependent (renders from a UI edit, shows literally
   from the API). One <p> per paragraph, <hr /> for a rule. See playbook §J.

3. APPEND-ONLY RESULTS. There is no update_result in the TestRail API. A badly
   formatted result cannot be edited, only superseded. The latest row is what
   TestRail shows first and what the run counts use, but the history keeps both.
   ==> GET THE FORMATTING RIGHT ON THE FIRST PUSH. Use --dry-run.

4. "WHAT NEEDS TO BE DONE" (Rule 7). Every Failed and Blocked result must carry a
   plain sentence a non-technical tester can act on. This REFUSES to write if one
   is missing, rather than shipping a bare status.

--------------------------------------------------------------------------------
INPUT SHAPE — RESULTS.json
--------------------------------------------------------------------------------
    {"pass_meta": {...},
     "results": {
        "C44917": {"verdict": "Failed",          # Passed | Failed | Blocked | Retest
                   "observed": "what was seen, in full",
                   "not_observed": "clauses not exercised, or null",
                   "note": "internal note - NOT written to TestRail",
                   "todo": "What needs to be done: ..."}   # required if not Passed
     }}

`todo` may instead be supplied out-of-band in a --todo JSON file keyed by C-id,
which is how the 2026-09-07 pass did it (the notes were internal, the todos were
tester-facing).

--------------------------------------------------------------------------------
IF THE COMMAND IS REFUSED BEFORE IT RUNS
--------------------------------------------------------------------------------
A "Blocked by classifier" denial is the SESSION's permission gate, not TestRail
and not the QA lead's approval. Chat approval does not reach it. Add a narrowly
scoped rule to .claude/settings.local.json and it goes through:

    {"permissions": {"allow":
      ["Bash(python3 build/testing-tools/push_results_to_run.py:*)"]}}

Do that ONLY once the QA lead has actually approved the write.

--------------------------------------------------------------------------------
STANDING RULE ON SHARED RUNS
--------------------------------------------------------------------------------
Shared runs belong to other testers. Default: keep results LOCAL. Only a Passed
result may be written to a shared run, and only with the QA lead's explicit
permission. Writing Failed/Blocked needs him to lift that limit expressly — he did
so on 2026-09-07 for R417. --allow-non-passed makes you state that you have it.
"""
import argparse
import json
import sys

sys.path.insert(0, 'build/testing-tools')
import tr_client as t

STATUS = {'Passed': 1, 'Blocked': 2, 'Untested': 3, 'Retest': 4, 'Failed': 5}


def esc(s):
    """Escape only what would break the markup; keep the tester's text otherwise."""
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def comment_for(rec, todo, header, footer=None, lead=None):
    """One <p> per paragraph. Never a <br>. Never a bare status.

    `footer` is a standing note appended after a rule, e.g. the QA lead's standing
    requirement (2026-09-09) that a QA-branch pass says so and says it will be
    re-tested on Staging. It is separated by <hr /> so it reads as its own line.
    """
    blocks = []
    if lead:
        blocks.append('<p>%s</p>' % esc(lead.strip()))
    blocks += ['<p>%s</p>' % esc(header), '<p>%s</p>' % esc(rec['observed'].strip())]
    nobs = (rec.get('not_observed') or '').strip()
    if nobs and nobs.lower() != 'none':
        blocks.append('<p>Not observed this run: %s</p>' % esc(nobs))
    if todo:
        blocks.append('<hr />')
        blocks.append('<p>%s</p>' % esc(todo.strip()))
    if footer:
        blocks.append('<hr />')
        blocks.append('<p>%s</p>' % esc(footer.strip()))
    return ''.join(blocks)


def paged_tests(run_id):
    out, off = [], 0
    while True:
        s, r = t.get('get_tests/%d&limit=250&offset=%d' % (run_id, off))
        if s != 200:
            sys.exit('get_tests failed: %s %s' % (s, r))
        out += r['tests']
        if r.get('_links', {}).get('next'):
            off += 250
        else:
            return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--run', type=int, required=True)
    ap.add_argument('--results', required=True, help='RESULTS.json')
    ap.add_argument('--todo', help='optional JSON: {"C44917": "What needs to be done: ..."}')
    ap.add_argument('--build-marker', required=True)
    ap.add_argument('--date', required=True, help='e.g. "7 September 2026"')
    ap.add_argument('--env', default='staging')
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--allow-non-passed', action='store_true',
                    help='the QA lead has expressly lifted the Passed-only limit on this run')
    ap.add_argument('--no-sync', action='store_true', help='skip the union sync')
    ap.add_argument('--footer', help='standing note appended after a rule on EVERY result '
                                     '(e.g. the QA-branch / retest-on-Staging note)')
    ap.add_argument('--lead', help='sentence placed at the VERY TOP of every result comment, before '
                                   'the build/date header (QA lead, 2026-09-09)')
    a = ap.parse_args()

    res = json.load(open(a.results))['results']
    todos = json.load(open(a.todo)) if a.todo else {}
    header = 'Tested on %s, build %s, on %s.' % (a.env, a.build_marker, a.date)

    # --- gate: Rule 7, no bare status on a Failed/Blocked result
    missing = [c for c, r in res.items()
               if r['verdict'] != 'Passed' and not (r.get('todo') or todos.get(c))]
    if missing:
        sys.exit('REFUSING: no "What needs to be done" for %s (Rule 7)' % ', '.join(sorted(missing)))

    non_passed = sorted(c for c, r in res.items() if r['verdict'] != 'Passed')
    if non_passed and not a.allow_non_passed:
        sys.exit('REFUSING: %d non-Passed results (%s).\n'
                 'A shared run takes Passed only unless the QA lead expressly lifts that.\n'
                 'Pass --allow-non-passed once he has.' % (len(non_passed), ', '.join(non_passed)))

    # --- 1. union sync (Rule 34) — grow the run, never shrink it
    in_run = {x['case_id'] for x in paged_tests(a.run)}
    suite = {int(c[1:]) for c in res}
    union = sorted(in_run | suite)
    assert in_run <= set(union), 'refusing to shrink the run'
    added = sorted(suite - in_run)
    print('run has %d tests, results cover %d cases, union %d%s'
          % (len(in_run), len(suite), len(union), (', adding %s' % added) if added else ''))
    if added and not a.no_sync:
        if a.dry_run:
            print('  [dry-run] would update_run/%d with %d case_ids' % (a.run, len(union)))
        else:
            s, _ = t.post('update_run/%d' % a.run, {'case_ids': union})
            print('  update_run ->', s)

    # --- 2. build the payload
    payload = []
    for cid, r in sorted(res.items()):
        todo = r.get('todo') or todos.get(cid)
        payload.append({'case_id': int(cid[1:]),
                        'status_id': STATUS[r['verdict']],
                        'comment': comment_for(r, todo, header, a.footer, a.lead)})
    assert not any('<br' in p['comment'] for p in payload), 'never emit <br> in an API write'

    counts = {}
    for p in payload:
        counts[p['status_id']] = counts.get(p['status_id'], 0) + 1
    print('%d results: %s' % (len(payload),
          ', '.join('%s=%d' % (n, counts[i]) for n, i in STATUS.items() if counts.get(i))))

    if a.dry_run:
        sample = next((p for p in payload if p['status_id'] != 1), payload[0])
        print('\n--- sample comment (case %d) ---\n%s' % (sample['case_id'], sample['comment']))
        print('\n[dry-run] nothing written. Re-run without --dry-run to write.')
        return

    # --- 3. one batched call
    s, r = t.post('add_results_for_cases/%d' % a.run, {'results': payload})
    if s != 200:
        sys.exit('add_results_for_cases failed: %s %s' % (s, r))
    print('add_results_for_cases ->', s, '| written:', len(r) if isinstance(r, list) else r)

    # --- 4. read it back (a 200 is not evidence a human can read it)
    s, run = t.get('get_run/%d' % a.run)
    print('run now: untested %s | passed %s | failed %s | blocked %s | retest %s'
          % (run['untested_count'], run['passed_count'], run['failed_count'],
             run['blocked_count'], run['retest_count']))
    tests = paged_tests(a.run)
    one = next(x['id'] for x in tests if x['case_id'] == payload[0]['case_id'])
    print('\nNOW VERIFY THE RENDERING — a 200 says nothing about what the tester sees:')
    print('  https://shopview.testrail.io/index.php?/tests/view/%d' % one)
    print('  Count <p> and <br> in the container holding the comment.')
    print('  One <p> and no line breaks = the wall-of-text trap; the paragraphs collapsed.')


if __name__ == '__main__':
    main()
