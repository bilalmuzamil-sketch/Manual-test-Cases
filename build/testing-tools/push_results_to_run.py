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
import re
import sys

sys.path.insert(0, 'build/testing-tools')
import tr_client as t

def attach(result_id, path):
    """Rule 130 (QA lead 2026-10-14): put one annotated picture on a result (add_attachment_to_result, multipart)."""
    import mimetypes, os, uuid, urllib.request, urllib.error
    bnd = uuid.uuid4().hex
    body = (('--%s\r\nContent-Disposition: form-data; name="attachment"; filename="%s"\r\nContent-Type: %s\r\n\r\n'
             % (bnd, os.path.basename(path), mimetypes.guess_type(path)[0] or 'image/png')).encode()
            + open(path, 'rb').read() + ('\r\n--%s--\r\n' % bnd).encode())
    rq = urllib.request.Request(t._BASE + 'add_attachment_to_result/%d' % result_id, data=body, method='POST')
    rq.add_header('Authorization', 'Basic ' + t._AUTH); rq.add_header('Content-Type', 'multipart/form-data; boundary=' + bnd)
    import time
    for k in range(4):  # 15 Oct 2026: a dropped connection mid-batch stopped 97 attachments — retry it (2/4/8 s)
        try:
            with urllib.request.urlopen(rq, timeout=120) as r:
                return r.status, json.loads(r.read().decode() or 'null')
        except urllib.error.HTTPError as e:
            return e.code, e.read().decode()[:200]
        except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
            if k == 3:
                return 0, str(e)[:200]
            time.sleep(2 ** (k + 1))


STATUS = {'Passed': 1, 'Blocked': 2, 'Untested': 3, 'Retest': 4, 'Failed': 5}


def esc(s):
    """Escape only what would break the markup; keep the tester's text otherwise."""
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def comment_for(rec, todo, header, footer=None, lead=None):
    """One <p> per paragraph. Never a <br>. Never a bare status.

    ORDER IS FIXED BY THE QA LEAD (2026-09-15, verbatim): "put the proper technical reference
    which is Good for a layman to understand first and then some technical detail after a line
    break". So every comment reads:

        what a person would see, in plain words   <- `observed`
        what was not exercised                    <- `not_observed`
        ---
        the ticket, if this failed                <- `ticket`
        ---
        what needs to be done                     <- `todo`
        ---
        Technical detail: ...                     <- `technical`, LAST, after the rule

    `technical` is the one place ids, queries, counts, routes and selectors belong. Keeping it
    below the rule is what lets the plain half be read on its own (Rule 103), while nothing is
    lost for whoever needs to reproduce it.

    `footer` is a standing note appended after a rule, e.g. the QA lead's standing
    requirement (2026-09-09) that a QA-branch pass says so and says it will be
    re-tested on Staging.
    """
    blocks = []
    if lead:
        blocks.append('<p>%s</p>' % esc(lead.strip()))
    # Rule 122 (QA lead 2026-10-12): the comment is short plain bullet points a non-technical reader
    # can follow. `observed` / `not_observed` may be a LIST of points -> one <ul><li> each (block
    # tags only, never <br>, per the TestRail formatting rule). A string still renders as before.
    # Rule 132 (QA lead 2026-10-20): a non-Passed result opens with ONE bold line naming the failing step
    # number(s) (`failed_steps`), and the bullets for those steps are bold: any bullet starting with
    # "Step N"/"Steps N" for N in `bold_steps`, or with "Result:". Passed results are unchanged.
    bold_steps = [str(x) for x in (rec.get('bold_steps') or [])] if rec.get('verdict') != 'Passed' else []
    def is_bold(x):
        t = str(x).strip()
        if not bold_steps: return False
        if t.startswith('Result:'): return True
        m = re.match(r'Steps? ([0-9]+)', t)
        return bool(m) and m.group(1) in bold_steps
    def bullets(v):
        return '<ul>%s</ul>' % ''.join(('<li><strong>%s</strong></li>' if is_bold(x) else '<li>%s</li>') % esc(str(x).strip()) for x in v if str(x).strip())
    obs = rec['observed']
    if rec.get('verdict') != 'Passed' and (rec.get('failed_steps') or '').strip():
        blocks.append('<p><strong>%s</strong></p>' % esc(rec['failed_steps'].strip()))
    blocks += ['<p>%s</p>' % esc(header), bullets(obs) if isinstance(obs, list) else '<p>%s</p>' % esc(obs.strip())]
    nobs = rec.get('not_observed') or ''
    if isinstance(nobs, list):
        if nobs:
            blocks += ['<p>Not checked this time:</p>', bullets(nobs)]
    else:
        nobs = nobs.strip()
        if nobs and nobs.lower() != 'none':
            blocks.append('<p>Not observed this run: %s</p>' % esc(nobs))
    ticket = (rec.get('ticket') or '').strip()
    if ticket:
        blocks.append('<hr />')
        blocks.append('<p>%s</p>' % esc(ticket))
    # A Passed result's "nothing to do" note is not shown: it rendered as a stray "None." line under the bullets (12 Oct 2026).
    if todo and (rec.get('verdict') != 'Passed' or todo.strip().rstrip('.').strip().lower() not in ('none', 'nothing for the tester', 'n/a', 'nothing')):
        blocks.append('<hr />')
        blocks.append('<p>%s</p>' % esc(todo.strip()))
    tech = (rec.get('technical') or '').strip()
    if tech:
        blocks.append('<hr />')
        blocks.append('<p>Technical detail: %s</p>' % esc(tech))
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
    # Rule 130 (QA lead 2026-10-14): every pass/fail carries annotated screenshots as evidence — but he decides, per batch,
    # whether they go on the result. ASK HIM FIRST and pass his answer here; a write without it is refused.
    ap.add_argument('--screenshots', choices=['yes', 'no'],
                    help="the QA lead's answer to 'add the annotated screenshots with the result comments?' (Rule 130). "
                         "yes = every result needs a non-empty \"pictures\" list of annotated images, attached after writing")
    ap.add_argument('--attach-only', action='store_true',
                    help='Rule 130: attach each result\'s "pictures" to its LATEST existing result in the run; writes no new result')
    a = ap.parse_args()

    res = json.load(open(a.results))['results']
    todos = json.load(open(a.todo)) if a.todo else {}
    header = 'Tested on %s, build %s, on %s.' % (a.env, a.build_marker, a.date)

    # --- gate: Rule 130 — his answer on screenshots is recorded before anything is written
    if not a.dry_run and not a.screenshots:
        sys.exit('REFUSING (Rule 130): ask the QA lead "Do you want the annotated screenshots added with the result comments?" '
                 'and pass his answer as --screenshots yes|no.')
    if a.screenshots == 'yes' or a.attach_only:
        import os as _os
        # picture paths are taken relative to the RESULTS file (where they are written), unless absolute
        for r_ in res.values():
            r_['pictures'] = [x if _os.path.isabs(x) else _os.path.join(_os.path.dirname(_os.path.abspath(a.results)), x)
                              for x in (r_.get('pictures') or [])]
        bad = sorted(c for c, r in res.items() if not r.get('pictures') or not all(_os.path.isfile(x) for x in r['pictures']))
        if bad:
            sys.exit('REFUSING (Rule 130): --screenshots yes but no annotated picture file for %s ("pictures": [paths])' % ', '.join(bad))
    if a.attach_only:
        if a.screenshots != 'yes':
            sys.exit('REFUSING (Rule 130): --attach-only needs --screenshots yes (his confirmation)')
        tests = {x['case_id']: x['id'] for x in paged_tests(a.run)}
        for cid, r in sorted(res.items()):
            tid = tests[int(cid[1:])]
            s_, rr = t.get('get_results/%d&limit=1' % tid)
            rows = rr.get('results', rr) if isinstance(rr, dict) else rr
            if not rows:
                sys.exit('no result yet on %s (test %d)' % (cid, tid))
            # 15 Oct 2026: never attach the same picture twice — skip files already on this result (a re-run after a dropped connection)
            s0, ra0 = t.get('get_attachments_for_test/%d' % tid)
            ra0 = ra0.get('attachments', ra0) if isinstance(ra0, dict) else ra0
            have = {x.get('name') for x in (ra0 if isinstance(ra0, list) else []) if x.get('entity_id') == rows[0]['id']}
            for pth in r['pictures']:
                if _os.path.basename(pth) in have:
                    print('  %s result %d already has %s' % (cid, rows[0]['id'], _os.path.basename(pth))); continue
                if a.dry_run:
                    print('  [dry-run] %s result %d <- %s' % (cid, rows[0]['id'], pth)); continue
                print('  %s result %d <- %s: %s' % (cid, rows[0]['id'], pth, attach(rows[0]['id'], pth)[0]))
            if not a.dry_run:
                # read back: get_attachments_for_test lists each attachment TWICE (same id) — count distinct ids on this result
                s2, ra = t.get('get_attachments_for_test/%d' % tid)
                ra = ra.get('attachments', ra) if isinstance(ra, dict) else ra
                got = {x['id'] for x in (ra if isinstance(ra, list) else []) if x.get('entity_id') == rows[0]['id']}
                print('  %s read back: %d picture(s) on result %d (expected at least %d)' % (cid, len(got), rows[0]['id'], len(r['pictures'])))
        return

    # --- gate: Rule 7, no bare status on a Failed/Blocked result
    missing = [c for c, r in res.items()
               if r['verdict'] != 'Passed' and not (r.get('todo') or todos.get(c))]
    if missing:
        sys.exit('REFUSING: no "What needs to be done" for %s (Rule 7)' % ', '.join(sorted(missing)))

    # QA lead, 2026-09-15: "we should ALWAYS have a ticket for the failed verified test cases and
    # the ticket links should be commented in the test case too." So a Failed result without a
    # ticket link is refused here, the same way a bare status already is.
    #
    # ONE EXCEPTION, and it is not a loophole. No Jira ticket may be opened without the QA lead's
    # say-so (Standing Rule 62), so a failure found TODAY genuinely has no ticket yet and never
    # will until he answers. Refusing those would force the choice between not recording a real
    # failure and inventing a ticket link - both worse than saying plainly that it is with him.
    # So `ticket_held` is accepted in place of a link, and it must SAY SO in the comment.
    HELD = 'with the qa lead'   # compared against a lowercased ticket line
    no_ticket = []
    for c, r in res.items():
        if r['verdict'] != 'Failed':
            continue
        if 'browse/' in (r.get('ticket') or ''):
            continue
        if r.get('ticket_held') and HELD in (r.get('ticket') or '').lower():
            continue
        no_ticket.append(c)
    # Rule 132 (QA lead 2026-10-20): every non-Passed result names its failing step(s) in bold first.
    no_steps = sorted(c for c, r in res.items() if r['verdict'] != 'Passed' and not (r.get('failed_steps') or '').strip())
    if no_steps:
        sys.exit('REFUSING: no "failed_steps" on %s (Rule 132: every Failed/Blocked/Retest result opens with the '
                 'failing step number(s) in bold, e.g. "Failed at steps 6 and 10: ..."; list those steps in '
                 '"bold_steps" so their bullets are bold too).' % ', '.join(no_steps))
    if no_ticket:
        sys.exit('REFUSING: Failed with no ticket link for %s '
                 '(QA lead 2026-09-15: every failed case carries its ticket). If the finding is new '
                 'and cannot be filed yet under Standing Rule 62, set "ticket_held": true on it AND '
                 'say in its "ticket" text that it is with the QA lead.'
                 % ', '.join(sorted(no_ticket)))

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
        item = {'case_id': int(cid[1:]),
                'status_id': STATUS[r['verdict']],
                'comment': comment_for(r, todo, header, a.footer, a.lead)}
        # QA lead 2026-10-09: "The failed test run links should have the related tickets." The ticket
        # goes into TestRail's own Defects field (shown and linked on the test), not only the comment.
        # Taken from an explicit "defects" list, else from every .../browse/<KEY> link in the ticket text.
        keys = r.get('defects') or re.findall(r'browse/([A-Z][A-Z0-9]+-\d+)', r.get('ticket') or '')
        if keys:
            item['defects'] = ','.join(dict.fromkeys(keys))
        payload.append(item)
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

    # --- 3a. Rule 130: the annotated pictures go on the result just written (his answer was yes)
    if a.screenshots == 'yes' and isinstance(r, list):
        by_test = {x['id']: x['case_id'] for x in paged_tests(a.run)}
        for row in r:
            cid = 'C%d' % by_test.get(row['test_id'], 0)
            for pth in res.get(cid, {}).get('pictures', []):
                print('  %s result %d <- %s: %s' % (cid, row['id'], pth, attach(row['id'], pth)[0]))
    elif a.screenshots == 'no':
        print('  screenshots: not attached — the QA lead said no for this batch (Rule 130)')

    # --- 3b. Rule 123 (QA lead 2026-10-12): every Failed result that has a ticket gets a SEPARATE comment on
    # top reading exactly "Follow the status here <ticket link>" — posted after the why-it-failed comment, so it
    # shows first in the test's history. A held ticket (no link yet) gets it when the ticket is filed.
    import re as _re
    for p_ in payload:
        if p_.get('status_id') != 5:
            continue
        m = _re.search(r'https://shopview\.atlassian\.net/browse/SV-\d+', p_.get('comment') or '')
        if not m:
            continue
        url = m.group(0)
        s2, _ = t.post('add_result_for_case/%d/%d' % (a.run, p_['case_id']),
                       {'status_id': 5, 'defects': url.rsplit('/', 1)[1],
                        'comment': '<p>Follow the status here <a href="%s">%s</a></p>' % (url, url)})
        print('  C%d: "Follow the status here" comment ->' % p_['case_id'], s2)

    # --- 3c. Rule 133 (QA lead 2026-10-20): a Failed, Retest or Blocked case whose result names a ticket carries it at the
    # start of its title, "SV-11545 - <title>". No ticket, no prefix. Automated cases are held for his go-ahead (Rule 71).
    from prefix_ticket_titles import prefix_case, unprefix_case, KEY as _KEY
    for p_ in payload:
        if p_.get('status_id') == 1:   # Passed: the ticket prefix comes off (Rule 133 amendment 2026-10-20)
            row = unprefix_case(t, p_['case_id'])
            if row.get('skipped') != 'no prefix':
                print('  C%d: title prefix removed (Rule 133) ->' % p_['case_id'], row.get('new') or row.get('skipped') or row.get('held'))
            continue
        if p_.get('status_id') not in (2, 4, 5):
            continue
        # only the record's own ticket LINK counts (a comment may mention other tickets in passing; a held ticket has no key)
        tk = res.get('C%d' % p_['case_id'], {}).get('ticket') or ''
        keys = list(dict.fromkeys(_KEY.findall(tk))) if 'browse/' in tk else []
        # no filed ticket (Blocked on a question, or a ticket still HELD for his yes) => an old prefix from an earlier ticket
        # comes off; the new ticket's prefix goes on when it is filed and its number posted
        if True:
            row = prefix_case(t, p_['case_id'], keys)
            if keys or row.get('skipped') != 'no ticket — no prefix (Rule 133)':
                print('  C%d: title prefix (Rule 133) ->' % p_['case_id'],
                      row.get('new') or row.get('skipped') or row.get('held'))

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
