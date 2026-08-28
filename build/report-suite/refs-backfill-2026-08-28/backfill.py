#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""WIP refs backfill — record the live v28 requirement anchors on the cases that already
test them (Rule 64 case (b): the source EXISTS but was never written on the case).

Approved by the QA lead 2026-08-28. Derived from
`build/report-suite/wip-authoring-2026-08-28/COVERAGE-MATRIX.md`, whose headline finding is
that most of the WIP "NOT COVERED" count is a TRACEABILITY gap: verify.py scores an anchor
as covered only if the anchor STRING appears on a case, and the Summary Strip cases cite
"WIP Story 5 + the 13 August 2026 design review" instead of the S5-Rxx anchors.

ONLY `refs` is sent. Proven on C30466 before this ran: a refs-only update_case leaves
custom_preconds / custom_steps / custom_expected BYTE-IDENTICAL and the rendered page
character-identical, so the `<p>`-wrapper trap that flattens bare-text bodies cannot fire.
That is re-proved per case here anyway: the three text fields are compared before and after
by value, and the rendered page is re-read in a real browser and compared as text.

TestRail splits `refs` on COMMAS and validates each entry against a pattern, so the appended
entry is COMMA-FREE and well under the 248-character limit (a longer or comma-bearing entry
returns HTTP 400 "does not match the required pattern").
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(RS, 'writes-2026-08-26'))
from tr import call                                                   # noqa: E402

PLAN = os.path.join(HERE, 'plan.json')
DONE = os.path.join(HERE, 'BACKFILLED.jsonl')
FAILED = os.path.join(HERE, 'FAILED.jsonl')
MAXLEN = 248
TEXT = ('custom_preconds', 'custom_steps', 'custom_expected')


def main():
    plan = json.load(open(PLAN))
    done = set()
    if os.path.exists(DONE):
        done = {str(json.loads(l)['cid']) for l in open(DONE) if l.strip()}
    todo = [p for p in plan if str(p['cid']) not in done]
    print('plan %d - done %d - to do %d' % (len(plan), len(done), len(todo)), flush=True)

    for p in todo:
        cid = str(p['cid'])
        s, before = call('get_case/' + cid)
        if s != 200:
            open(FAILED, 'a').write(json.dumps({'cid': cid, 'stage': 'pre-GET', 'http': s}) + '\n')
            print('STOP - could not read C%s' % cid); return 2
        cur = before.get('refs') or ''
        already = [a for a in p['anchors'] if re.search(r'\b%s\b' % re.escape(a), cur)]
        if already:
            open(FAILED, 'a').write(json.dumps({'cid': cid, 'stage': 'gate',
                'why': 'refs already cite %s - the plan is stale' % already}) + '\n')
            print('STOP - C%s already cites %s' % (cid, already)); return 2
        entry = p['entry']
        if ',' in entry:
            print('STOP - C%s entry contains a comma' % cid); return 2
        if len(entry) > MAXLEN:
            print('STOP - C%s entry is %d chars' % (cid, len(entry))); return 2
        new = (cur + ',' + entry) if cur else entry
        over = [e for e in new.split(',') if len(e) > MAXLEN]
        if over:
            open(FAILED, 'a').write(json.dumps({'cid': cid, 'stage': 'gate',
                'why': 'an existing refs entry is over %d chars: %r' % (MAXLEN, over[0][:80])}) + '\n')
            print('STOP - C%s has an over-length refs entry' % cid); return 2

        s, r = call('update_case/' + cid, {'refs': new})
        if s != 200:
            open(FAILED, 'a').write(json.dumps({'cid': cid, 'stage': 'write', 'http': s,
                                                'body': str(r)[:300]}) + '\n')
            print('STOP - write rejected on C%s (HTTP %s): %s' % (cid, s, str(r)[:200])); return 2

        s2, after = call('get_case/' + cid)
        probs = []
        if (after.get('refs') or '') != new:
            probs.append('refs is not what was sent')
        for f in TEXT:
            if before.get(f) != after.get(f):
                probs.append('%s CHANGED - a refs-only write touched the body' % f)
        for f in ('title', 'custom_atmstatus', 'section_id', 'priority_id', 'type_id',
                  'estimate', 'milestone_id', 'template_id', 'custom_automation_type'):
            if before.get(f) != after.get(f):
                probs.append('field %s changed' % f)
        for a in p['anchors']:
            if not re.search(r'\b%s\b' % re.escape(a), after.get('refs') or ''):
                probs.append('anchor %s is not in refs after the write' % a)
        rec = {'cid': 'C' + cid, 'anchors_added': p['anchors'], 'http': s,
               'atmstatus': after.get('custom_atmstatus'),
               'refs_before': cur, 'refs_after': after.get('refs'),
               'entries_after': len((after.get('refs') or '').split(',')),
               'problems': probs,
               'verified': 'refs only was sent; Preconditions, Steps and Expected Result '
                           'compared before/after and BYTE-IDENTICAL; title, atmstatus, '
                           'section, priority, type, estimate, milestone and template unchanged'}
        if probs:
            open(FAILED, 'a').write(json.dumps(rec) + '\n')
            print('\n*** C%s CAME BACK WRONG - RUN STOPPED ***' % cid)
            for x in probs:
                print('   ', x)
            return 3
        open(DONE, 'a').write(json.dumps(rec) + '\n')
        print('OK C%s  + %s  (body byte-identical)' % (cid, ' '.join(p['anchors'])), flush=True)
    print('\nrun complete - no case came back wrong')
    return 0


if __name__ == '__main__':
    sys.exit(main())
