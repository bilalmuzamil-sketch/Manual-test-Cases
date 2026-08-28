#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Re-pin the AUTOMATED Report Suite cases whose Expected Result renders in a
"markdown fr-view" container, so an API write is invisible to a tester.

This is repin-2026-08-28/repin_write.py with EXACTLY ONE gate inverted: that script
STOPS on custom_atmstatus == 3 (Rule 71). Vlad gave the go-ahead on 2026-08-28 after
checking the already-updated Automated case C30287 and reporting that the update
"has not changed the formatting and it still looks good on that case", so here
custom_atmstatus == 3 is REQUIRED (anything else is a mismatch and stops the run) and
every case written is logged for the Automated cases register (Rule 65).

Every other gate is unchanged and re-proved live immediately before each write:
  * Expected Result renders in "markdown fr-view";
  * custom_expected is a SINGLE top-level block;
  * the cited-version token appears exactly once and the live token does not appear;
  * the reverse transform reconstructs the stored value BYTE-FOR-BYTE;
  * only custom_expected is sent; every other field is omitted and therefore preserved.

After EVERY single write the case is re-fetched BOTH ways - API and rendered view page.
If any case comes back wrong the whole run STOPS.
"""
import json, os, sys, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.dirname(HERE)
REPIN = os.path.join(RS, 'repin-2026-08-28')
sys.path.insert(0, os.path.join(RS, 'writes-2026-08-26'))
sys.path.insert(0, REPIN)
from tr import call                                                   # noqa: E402
from htmlfmt import ent                                               # noqa: E402
from classify import login, top_level_blocks                          # noqa: E402
from repin_write import transform, render_check, NOTE, LIVE           # noqa: E402

DONE = os.path.join(HERE, 'API-REPINNED.jsonl')
FAILED = os.path.join(HERE, 'API-FAILED.jsonl')


def main():
    plan = json.load(open(os.path.join(HERE, 'api-plan.json')))
    pins = {p['cid']: p for p in json.load(open(os.path.join(
        RS, 'source-verify-2026-08-26', 'data', 'case-version-pins.json')))}
    done = set()
    if os.path.exists(DONE):
        done = {str(json.loads(l)['cid']) for l in open(DONE) if l.strip()}
    op = login()
    todo = [c for c in plan if str(c) not in done]
    print('plan %d - already done %d - to do %d' % (len(plan), len(done), len(todo)), flush=True)

    for num in todo:
        num = str(num)
        cid = 'C' + num
        s, before = call('get_case/' + num)
        if s != 200:
            open(FAILED, 'a').write(json.dumps({'cid': cid, 'stage': 'pre-GET', 'http': s}) + '\n')
            print('STOP - could not read %s' % cid); return 2
        old, live = pins[cid]['cited'], LIVE[pins[cid]['report']]
        stored = before.get('custom_expected') or ''
        # Rule 71 gate, INVERTED under Vlad's 2026-08-28 go-ahead: these MUST be Automated.
        if before.get('custom_atmstatus') != 3:
            open(FAILED, 'a').write(json.dumps({'cid': cid, 'stage': 'gate',
                'why': 'custom_atmstatus is %r, expected 3' % before.get('custom_atmstatus')}) + '\n')
            print('STOP - %s is not Automated any more' % cid); return 2
        if top_level_blocks(stored) != 1:
            open(FAILED, 'a').write(json.dumps({'cid': cid, 'stage': 'gate', 'why': 'multi-block'}) + '\n')
            print('STOP - %s is multi-block' % cid); return 2
        pre = render_check(op, num, [], before.get('custom_atmstatus'))
        if [p for p in pre if 'container' in p]:
            open(FAILED, 'a').write(json.dumps({'cid': cid, 'stage': 'pre-render', 'probs': pre}) + '\n')
            print('STOP - %s does not render fr-view before the write: %s' % (cid, pre)); return 2

        new, why = transform(stored, old, live)
        if new is None:
            open(FAILED, 'a').write(json.dumps({'cid': cid, 'stage': 'transform', 'why': why}) + '\n')
            print('STOP %s - %s' % (cid, why), flush=True); return 2

        want = new if new.endswith('\n') else new + '\n'
        s, d = call('update_case/' + num, {'custom_expected': want})
        if s != 200:
            open(FAILED, 'a').write(json.dumps({'cid': cid, 'stage': 'write', 'http': s, 'body': str(d)[:200]}) + '\n')
            print('STOP - write rejected on %s (HTTP %s)' % (cid, s)); return 2

        s2, after = call('get_case/' + num)
        got = after.get('custom_expected') or ''
        acceptable = {want, ent(want), want.rstrip('\n') + '\n', ent(want).rstrip('\n') + '\n'}
        probs = []
        if got not in acceptable:
            probs.append('stored value is not what was sent')
        moved = [k for k in ['title', 'custom_preconds', 'custom_steps', 'refs', 'custom_atmstatus',
                             'section_id', 'priority_id', 'type_id', 'custom_automation_type',
                             'estimate', 'milestone_id', 'template_id']
                 if before.get(k) != after.get(k)]
        if moved:
            probs.append('untouched fields moved: %s' % moved)
        if after.get('custom_atmstatus') != 3:
            probs.append('custom_atmstatus is no longer 3')
        post = render_check(op, num, [NOTE, 'specification version %s' % live],
                            before.get('custom_atmstatus'))
        probs += [p for p in post if p not in pre]
        preexisting = [p for p in post if p in pre]
        rec = {'cid': cid, 'report': pins[cid]['report'], 'pin': '%s->%s' % (old, live),
               'route': 'API (Expected Result renders markdown fr-view)',
               'atmstatus_before': before.get('custom_atmstatus'),
               'atmstatus_after': after.get('custom_atmstatus'),
               'http': s, 'when': datetime.datetime.utcnow().isoformat() + 'Z',
               'sent_fields': ['custom_expected'], 'problems': probs,
               'pre_existing_notes': preexisting,
               'verified': 'rendered page re-read: container markdown fr-view, zero literal '
                           'tags, zero visible entities, AUTOMATION marker present once and '
                           'last, provenance present, new version cited, atmstatus still 3, '
                           'title/preconditions/steps/refs byte-identical'}
        if probs:
            open(FAILED, 'a').write(json.dumps(rec) + '\n')
            print('\n*** DAMAGE DETECTED ON %s - RUN STOPPED ***' % cid)
            for p in probs:
                print('   ', p)
            return 3
        open(DONE, 'a').write(json.dumps(rec) + '\n')
        print('OK %s  %s v%s->v%s  (rendered clean, still Automated)' % (cid, pins[cid]['report'], old, live), flush=True)
    print('\nrun complete - no damage')
    return 0


if __name__ == '__main__':
    sys.exit(main())
