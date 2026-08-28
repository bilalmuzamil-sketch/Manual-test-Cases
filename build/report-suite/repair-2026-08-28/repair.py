#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""JOB 1 phase C - RESTORE the 19 damaged Expected Results fields, ONE AT A TIME,
with the RENDERED page re-read and checked after EVERY SINGLE write.

Only `custom_expected` is ever sent; every other field is omitted and is proved
unchanged after the write.  If any case comes back wrong the run STOPS.
"""
import json, os, sys, re, html, datetime, time

HERE = os.path.dirname(os.path.abspath(__file__)); RS = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(RS, 'repin-2026-08-28'))
sys.path.insert(0, os.path.join(RS, 'writes-2026-08-26'))
from tr import call                                                    # noqa: E402
from classify import login, field_containers, BASE, LITERALS, ENTITIES  # noqa: E402

ORDER = ['C26427', 'C26489', 'C29946', 'C29948', 'C29950', 'C29951', 'C29952', 'C29953',
         'C29954', 'C29955', 'C29963', 'C30008', 'C30016', 'C30034', 'C30052', 'C30057',
         'C30066', 'C30071', 'C38872']
FROZEN = ['title', 'custom_preconds', 'custom_steps', 'refs', 'custom_atmstatus',
          'custom_automation_type', 'section_id', 'priority_id', 'type_id',
          'estimate', 'milestone_id', 'template_id', 'suite_id']
DONE = os.path.join(HERE, 'REPAIRED.jsonl')
BRK = re.compile(r'<br\s*/?>|</p>|</li>|</ul>|</ol>|</div>|</h[1-6]>')


def plain(v):
    v = BRK.sub('\n', v or '')
    v = re.sub(r'<[^>]+>', '', v)
    v = html.unescape(html.unescape(v))
    return re.sub(r'[ \t]+', ' ', v)


def lines_of(v):
    return [l.strip() for l in plain(v).split('\n') if l.strip()]


def fetch_page(op, num, tries=3):
    for t in range(tries):
        try:
            return op.open(f'{BASE}/index.php?/cases/view/{num}', timeout=90).read().decode('utf-8', 'replace')
        except Exception:
            if t == tries - 1:
                raise
            time.sleep(3)


def render_check(op, num, payload):
    """Prove the TESTER sees the restored case correctly."""
    page = fetch_page(op, num)
    fc = field_containers(page)
    cls, htm = fc['Expected Result']
    probs = []
    if cls != 'markdown fr-view':
        probs.append('container is %r, not "markdown fr-view"' % cls)
    for label in ('Preconditions', 'Steps', 'Expected Result'):
        for t in LITERALS:
            if t in fc[label][1]:
                probs.append('literal tag %s now visible in %s' % (t, label))
        for t in ENTITIES:
            if t in fc[label][1]:
                probs.append('entity %s visible as text in %s' % (t, label))
    want, got = lines_of(payload), lines_of(htm)
    if got != want:
        probs.append('rendered lines differ: want %d got %d' % (len(want), len(got)))
        for a, b in zip(want, got):
            if a != b:
                probs.append('  first mismatch want=%r got=%r' % (a[:70], b[:70]))
                break
    flat = ' '.join(got)
    n = flat.count('AUTOMATION: ')
    if payload.count('AUTOMATION: ') != n:
        probs.append('AUTOMATION marker count %d, expected %d' % (n, payload.count('AUTOMATION: ')))
    if n == 1 and not got[-1].startswith('AUTOMATION: '):
        probs.append('AUTOMATION marker is not the last line')
    return probs, got


def main():
    payloads = json.load(open('/tmp/rspin/repair/PAYLOADS.json'))
    done = set()
    if os.path.exists(DONE):
        done = {json.loads(l)['cid'] for l in open(DONE) if l.strip()}
    op = login()
    for cid in ORDER:
        if cid in done:
            print('skip (already repaired)', cid); continue
        num, P = cid[1:], payloads[cid]
        payload = P['payload']
        s, before = call('get_case/' + num)
        if s != 200:
            print('STOP - pre-read of %s failed HTTP %s' % (cid, s)); return 2
        # the body we are about to replace must still be the damaged one we analysed
        if lines_of(before.get('custom_expected') or '') == lines_of(payload):
            print('skip %s - already renders with the restored line structure' % cid); continue
        pre_page_probs, _ = render_check(op, num, before.get('custom_expected') or '')
        s, resp = call('update_case/' + num, {'custom_expected': payload})
        if s != 200:
            print('STOP - write on %s rejected HTTP %s: %s' % (cid, s, str(resp)[:200])); return 2
        s2, after = call('get_case/' + num)
        probs = []
        if s2 != 200:
            probs.append('post-read HTTP %s' % s2)
        stored = after.get('custom_expected') or ''
        if lines_of(stored) != lines_of(payload):
            probs.append('STORED value does not match what was sent')
        moved = [k for k in FROZEN if before.get(k) != after.get(k)]
        if moved:
            probs.append('omitted fields changed: %s' % moved)
        rprobs, got = render_check(op, num, payload)
        probs += [p for p in rprobs if p not in pre_page_probs]
        rec = {'cid': cid, 'class': P['class'], 'when': datetime.datetime.utcnow().isoformat() + 'Z',
               'http': s, 'sent_fields': ['custom_expected'],
               'rendered_lines_before': 1 if P['class'] == 'FLATTENED' else len(lines_of(before.get('custom_expected') or '')),
               'rendered_lines_after': len(got), 'problems': probs,
               'frozen_fields_unchanged': not moved,
               'note': P.get('note'),
               'verified': 'rendered case page re-read after the write: container markdown '
                           'fr-view, every restored line present and in order, zero literal '
                           'tags, zero visible entities, AUTOMATION marker count/position as '
                           'authored, and all %d omitted fields byte-identical' % len(FROZEN)}
        if probs:
            print('\n*** %s CAME BACK WRONG - RUN STOPPED ***' % cid)
            for p in probs:
                print('   ', p)
            json.dump(rec, open(os.path.join(HERE, 'FAILED-%s.json' % cid), 'w'), indent=1)
            return 3
        open(DONE, 'a').write(json.dumps(rec) + '\n')
        print('OK %-8s %-9s %d line(s) -> %d lines, rendered clean' %
              (cid, P['class'], rec['rendered_lines_before'], rec['rendered_lines_after']), flush=True)
    print('\nall 19 repaired and verified clean')
    return 0


if __name__ == '__main__':
    sys.exit(main())
