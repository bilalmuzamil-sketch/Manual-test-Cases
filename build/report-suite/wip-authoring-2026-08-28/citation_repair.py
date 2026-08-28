#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""JOB 2 phase B - the EIGHT citation repairs from NINE-ANCHORS-ASSESSMENT.md.

Eight v28 anchors are covered by cases that never name them, so every coverage check
reads them as gaps.  This appends ONE `refs` entry per case naming the anchors that
case already tests.  `refs` is the ONLY field sent; the three body fields are compared
byte-for-byte before and after, and the rendered page is re-read after every write.
"""
import json, os, sys, re, datetime
ROOT = '/home/user/Manual-test-Cases'
HERE = os.path.join(ROOT, 'build/report-suite/wip-authoring-2026-08-28')
sys.path.insert(0, os.path.join(ROOT, 'build/report-suite/repin-2026-08-28'))
sys.path.insert(0, os.path.join(ROOT, 'build/report-suite/writes-2026-08-26'))
from tr import call                                                    # noqa
from classify import login, field_containers, BASE, LITERALS, ENTITIES  # noqa

V = 'WIP spec v28 2026-08-24'
PLAN = [
 (45205, 'SV-8660', ['S4a-R1', 'S4a-N1'],
  'a completed work order moves its whole approved labor and parts value to Earned and holds no Remaining; '
  'under-clocked approved labor still shows its full quoted value'),
 (30489, 'SV-8661', ['S4a-R3'],
  'the summary strip and the table agree for the same work order'),
 (30490, 'SV-8661', ['S4a-R3', 'S4a-N2'],
  'the summary strip and the table agree for the same work order; a completed work order never contributes '
  'to Remaining Work, Work Orders Not Started or Remaining Work on Open Work Orders'),
 (30493, 'SV-8661', ['S5a-R1', 'S5a-R2'],
  'the Remaining Work explanation is the re-worded S5-R12 text signed off in the design review; '
  'the Estimates explanation is locked verbatim'),
 (30491, 'SV-8661', ['S5a-R2'],
  'Estimates counts per line, not per work order, and includes lines awaiting authorization on open work orders'),
 (30452, 'SV-8657', ['S5a-R3'],
  'the four tab labels stay as they are even though the summary figures were renamed'),
 (43821, 'SV-9282', ['S5a-R4'],
  'the Adjustments treatment covers Work In Progress, Sales By Customer and Sales By Representative for this wave'),
]
BODY = ['custom_preconds', 'custom_steps', 'custom_expected']
OUT = os.path.join(HERE, 'CITATION-REPAIRS.jsonl')


def norm(v):
    return ','.join(x.strip() for x in (v or '').split(','))


def main():
    done = set()
    if os.path.exists(OUT):
        done = {json.loads(l)['cid'] for l in open(OUT) if l.strip()}
    op = login()
    for num, story, anchors, gloss in PLAN:
        cid = 'C%d' % num
        if cid in done:
            print('skip', cid); continue
        s, before = call('get_case/%d' % num)
        if s != 200:
            print('STOP - pre-read %s HTTP %s' % (cid, s)); return 2
        entry = '%s (%s %s - %s)' % (story, V, '; '.join(anchors), gloss)
        if all(a in (before.get('refs') or '') for a in anchors):
            print('skip %s - already cites %s' % (cid, anchors)); continue
        new_refs = (before.get('refs') or '').rstrip(',') + ',' + entry
        s, resp = call('update_case/%d' % num, {'refs': new_refs})
        if s != 200:
            print('STOP - write %s HTTP %s %s' % (cid, s, str(resp)[:200])); return 2
        s2, after = call('get_case/%d' % num)
        probs = []
        if norm(after.get('refs')) != norm(new_refs):
            probs.append('refs is not what was sent')
        moved = [k for k in BODY + ['title', 'custom_atmstatus', 'custom_automation_type',
                                    'section_id', 'priority_id', 'type_id', 'template_id']
                 if before.get(k) != after.get(k)]
        if moved:
            probs.append('fields that were NOT sent changed: %s' % moved)
        page = op.open(f'{BASE}/index.php?/cases/view/{num}', timeout=90).read().decode('utf-8', 'replace')
        fc = field_containers(page)
        for label in ('Preconditions', 'Steps', 'Expected Result'):
            cls, htm = fc[label]
            if cls != 'markdown fr-view':
                probs.append('%s container %r' % (label, cls))
            for t in LITERALS:
                if t in htm: probs.append('literal %s visible in %s' % (t, label))
            for t in ENTITIES:
                if t in htm: probs.append('entity %s visible in %s' % (t, label))
        rec = {'cid': cid, 'anchors': anchors, 'automated': after.get('custom_atmstatus') == 3,
               'atmstatus': after.get('custom_atmstatus'), 'http': s,
               'bodies_byte_identical': not [k for k in BODY if before.get(k) != after.get(k)],
               'refs_before': before.get('refs'), 'refs_after': after.get('refs'),
               'when': datetime.datetime.utcnow().isoformat() + 'Z',
               'sent_fields': ['refs'], 'problems': probs}
        if probs:
            print('\n*** %s CAME BACK WRONG - RUN STOPPED ***' % cid)
            for p in probs: print('   ', p)
            json.dump(rec, open(os.path.join(HERE, 'FAILED-%s.json' % cid), 'w'), indent=1); return 3
        open(OUT, 'a').write(json.dumps(rec) + '\n')
        print('OK %s + %s  (bodies byte-identical: %s, atmstatus %s)' %
              (cid, ';'.join(anchors), rec['bodies_byte_identical'], rec['atmstatus']), flush=True)
    print('\nall citation repairs applied and verified')
    return 0


if __name__ == '__main__':
    sys.exit(main())
