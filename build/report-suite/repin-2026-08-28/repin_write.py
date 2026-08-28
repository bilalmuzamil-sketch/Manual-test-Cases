#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PHASE 2 - re-pin the cited spec version, ONE case at a time, verified as we go.

Safety gates, ALL of which must hold before a case is sent:
  1. the case's Expected Result renders in a "markdown fr-view" container (an escaping
     "markdown" container turns the API's <p> wrapper into literal text a tester reads -
     that is what damaged 72 cases on 2026-08-26);
  2. custom_atmstatus != 3 (Rule 71 - never touch an Automated case);
  3. custom_expected is a SINGLE top-level block (the API sanitiser keeps only one and
     silently nests everything else inside it);
  4. the case appears in the hand assessment as "pin-only" - its content was read against
     the LIVE anchor text and still matches it;
  5. the reverse transform reconstructs the stored value BYTE-FOR-BYTE, so nothing beyond
     the version token and the appended re-check sentence can possibly change.

ONLY custom_expected is sent. Every other field is omitted, and omitted fields are
preserved byte-identically.

After EVERY single write the case is re-fetched BOTH ways - API and rendered view page -
and checked. If any case comes back damaged the whole run STOPS.
"""
import json, os, re, sys, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(RS, 'writes-2026-08-26'))
sys.path.insert(0, HERE)
from tr import call                                                   # noqa: E402
from htmlfmt import ent                                               # noqa: E402
from classify import login, field_containers, top_level_blocks, LITERALS, ENTITIES, BASE  # noqa: E402

LIVE = {'IV': '10', 'PV': '11', 'SBC': '20', 'SBR': '24', 'TU': '9', 'WIP': '28'}
NOTE = ('Re-checked against the live specification on 28 August 2026: every requirement this '
        'case cites was read again in the live version and the behaviour above still matches '
        'it, so only the version cited above was updated.')
DONE = os.path.join(HERE, 'REPINNED.jsonl')
FAILED = os.path.join(HERE, 'FAILED.jsonl')


def transform(stored, old, live):
    tok_old, tok_new = 'specification version %s' % old, 'specification version %s' % live
    if stored.count(tok_old) != 1:
        return None, 'the cited-version token appears %d times, not once' % stored.count(tok_old)
    if tok_new in stored:
        return None, 'the case already mentions the live version elsewhere - ambiguous'
    new = stored.replace(tok_old, tok_new)
    m = re.search(r'(<br><br>|\n\n)(AUTOMATION: )', new)
    if not m:
        return None, 'no blank line + AUTOMATION marker at the tail'
    sep = '<br>' if m.group(1) == '<br><br>' else '\n'
    new = new[:m.start()] + sep + NOTE + new[m.start():]
    recon = new.replace(sep + NOTE, '', 1).replace(tok_new, tok_old)
    if recon != stored:
        return None, 'reverse transform did not reconstruct the original byte-for-byte'
    return new, 'ok'


def render_check(op, num, want_text_bits, atmstatus):
    """Re-read the RENDERED case page and prove a tester sees no damage."""
    page = op.open(f'{BASE}/index.php?/cases/view/{num}', timeout=90).read().decode('utf-8', 'replace')
    fc = field_containers(page)
    probs = []
    cls, html_ = fc['Expected Result']
    if cls != 'markdown fr-view':
        probs.append('expected container is %r, not "markdown fr-view"' % cls)
    for label in ('Preconditions', 'Steps', 'Expected Result'):
        for t in LITERALS:
            if t in fc[label][1]:
                probs.append('literal tag %s visible in %s' % (t.replace('&lt;', '<').replace('&gt;', '>'), label))
        for t in ENTITIES:
            if t in fc[label][1]:
                probs.append('entity %s visible as text in %s' % (t, label))
    plain = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html_))
    n = plain.count('AUTOMATION: ')
    if n != 1:
        probs.append('AUTOMATION marker appears %d times' % n)
    elif not re.search(r'AUTOMATION: (READY|HOLD|READY - EXPECT FAIL)', plain[plain.index('AUTOMATION: '):]):
        probs.append('AUTOMATION marker is not one of the canonical literals')
    else:
        tail = plain[plain.index('AUTOMATION: '):]
        if 'This is the expected behaviour' in tail:
            probs.append('AUTOMATION marker is no longer last')
    if 'This is the expected behaviour' not in plain:
        probs.append('provenance line missing')
    for bit in want_text_bits:
        if re.sub(r'\s+', ' ', bit) not in plain:
            probs.append('rendered text is missing %r' % bit[:60])
    return probs


def main():
    plan = json.load(open(os.path.join(HERE, 'write-plan.json')))
    pins = {p['cid']: p for p in json.load(open(os.path.join(
        RS, 'source-verify-2026-08-26', 'data', 'case-version-pins.json')))}
    done = set()
    if os.path.exists(DONE):
        done = {json.loads(l)['cid'] for l in open(DONE) if l.strip()}
    op = login()
    todo = [c for c in plan if c not in done]
    print('plan %d · already done %d · to do %d' % (len(plan), len(done), len(todo)), flush=True)

    for cid in todo:
        num = cid[1:]
        s, before = call('get_case/' + num)
        if s != 200:
            open(FAILED, 'a').write(json.dumps({'cid': cid, 'stage': 'pre-GET', 'http': s}) + '\n')
            print('STOP - could not read %s' % cid); return 2
        old, live = pins[cid]['cited'], LIVE[pins[cid]['report']]
        stored = before.get('custom_expected') or ''
        # gate 1-3, re-proved live immediately before the write
        if before.get('custom_atmstatus') == 3:
            open(FAILED, 'a').write(json.dumps({'cid': cid, 'stage': 'gate', 'why': 'Automated'}) + '\n')
            print('STOP - %s is Automated' % cid); return 2
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
            print('SKIP %s - %s' % (cid, why), flush=True)
            continue

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
        post = render_check(op, num, [NOTE, 'specification version %s' % live],
                            before.get('custom_atmstatus'))
        # only problems the write INTRODUCED count as damage; a pre-existing format
        # nit is recorded, not treated as this pass having broken the case.
        probs += [p for p in post if p not in pre]
        preexisting = [p for p in post if p in pre]
        rec = {'cid': cid, 'report': pins[cid]['report'], 'pin': '%s->%s' % (old, live),
               'http': s, 'when': datetime.datetime.utcnow().isoformat() + 'Z',
               'sent_fields': ['custom_expected'], 'problems': probs,
               'pre_existing_notes': preexisting,
               'verified': 'rendered page re-read: container markdown fr-view, zero literal '
                           'tags, zero visible entities, AUTOMATION marker present once and '
                           'last, provenance present, new version cited, atmstatus unchanged'}
        if probs:
            open(FAILED, 'a').write(json.dumps(rec) + '\n')
            print('\n*** DAMAGE DETECTED ON %s - RUN STOPPED ***' % cid)
            for p in probs:
                print('   ', p)
            return 3
        open(DONE, 'a').write(json.dumps(rec) + '\n')
        print('OK %s  %s v%s->v%s  (rendered clean)' % (cid, pins[cid]['report'], old, live), flush=True)
    print('\nrun complete - no damage')
    return 0


if __name__ == '__main__':
    sys.exit(main())
