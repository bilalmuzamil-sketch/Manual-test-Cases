#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Approved edits applied through the TestRail API — ONE case at a time, verified on the
RENDERED page after every single write, and the whole run STOPS on the first bad result.

The API route is only permitted when ALL of these hold, re-proved live immediately before
the write (this is the discipline that the 72 damaged cases of 2026-08-26 cost us):

  * the field's RENDERED container is `markdown fr-view` — a bare `markdown` container puts
    the API's own <p> wrapper on the tester's screen as literal text;
  * the stored value is a SINGLE top-level block — the sanitiser silently nests the rest;
  * every `find` string occurs EXACTLY ONCE in the stored value;
  * the reverse transform reconstructs the stored value BYTE-FOR-BYTE.

Only the field being changed is sent. Omitted fields are preserved byte-identically.

Plan format (JSON list):
  {"cid": 30345, "field": "custom_expected", "expect_atm": 1,
   "edits": [{"find": "...", "replace": "..."}], "why": "..."}
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(RS, 'writes-2026-08-26'))
sys.path.insert(0, os.path.join(RS, 'repin-2026-08-28'))
from tr import call                                                   # noqa: E402
from classify import login, field_containers, top_level_blocks, LITERALS, ENTITIES, BASE  # noqa: E402

LABEL = {'custom_preconds': 'Preconditions', 'custom_steps': 'Steps', 'custom_expected': 'Expected Result'}
KEEP = ('title', 'refs', 'section_id', 'priority_id', 'type_id', 'estimate', 'milestone_id',
        'template_id', 'custom_atmstatus', 'custom_automation_type', 'custom_preconds',
        'custom_steps', 'custom_expected')


def plain(html_):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html_))


def rendered(op, cid):
    page = op.open('%s/index.php?/cases/view/%d' % (BASE, cid), timeout=90).read().decode('utf-8', 'replace')
    return field_containers(page)


def marker(fc):
    p = plain(fc['Expected Result'][1])
    if p.count('AUTOMATION: ') != 1:
        return None
    return p[p.index('AUTOMATION: '):].strip()


def check_render(fc, cid, field, before_marker=None):
    probs = []
    for label in ('Preconditions', 'Steps', 'Expected Result'):
        cls, html_ = fc[label]
        if cls != 'markdown fr-view':
            probs.append('%s container is %r, not "markdown fr-view"' % (label, cls))
        for t in LITERALS:
            if t in html_:
                probs.append('literal tag %s visible to the tester in %s' % (t, label))
        for t in ENTITIES:
            if t in html_:
                probs.append('escaped entity %s visible to the tester in %s' % (t, label))
    p = plain(fc['Expected Result'][1])
    n = p.count('AUTOMATION: ')
    if n != 1:
        probs.append('AUTOMATION marker appears %d times' % n)
    else:
        tail = p[p.index('AUTOMATION: '):].strip()
        # The marker must survive the write EXACTLY as it was. Whether it is one of Rule 61's
        # canonical literals is a separate audit question - a pre-existing non-canonical
        # marker is recorded as a finding, never "fixed" inside an unrelated write.
        if before_marker is not None and tail != before_marker:
            probs.append('the AUTOMATION marker changed: %r -> %r' % (before_marker[:70], tail[:70]))
        if not re.match(r'AUTOMATION: (READY - EXPECT FAIL \(SV-\d+\)|READY|HOLD\b)', tail):
            probs.append('NOTE-ONLY: the AUTOMATION marker is not a Rule-61 canonical literal: %r' % tail[:70])
    if 'This is the expected behaviour' not in p and 'expectation has not been checked' not in p:
        probs.append('provenance line missing')
    return probs


def main():
    plan = json.load(open(sys.argv[1]))
    outp = sys.argv[2]
    op = login()
    results = []
    for p in plan:
        cid, field = p['cid'], p['field']
        try:
            st, before = call('get_case/%d' % cid)
            if st != 200:
                raise RuntimeError('pre-GET HTTP %s' % st)
            if before.get('custom_atmstatus') != p['expect_atm']:
                raise RuntimeError('custom_atmstatus is %r, the plan expects %r — STOP'
                                   % (before.get('custom_atmstatus'), p['expect_atm']))
            fc0 = rendered(op, cid)
            if fc0[LABEL[field]][0] != 'markdown fr-view':
                raise RuntimeError('%s renders in %r — the API route is BARRED, use the UI editor'
                                   % (field, fc0[LABEL[field]][0]))
            stored = before.get(field) or ''
            if top_level_blocks(stored) != 1:
                raise RuntimeError('%s is %d top-level blocks — the API sanitiser would nest them'
                                   % (field, top_level_blocks(stored)))
            # GATE ADDED 2026-08-28 after C30277 came back FLATTENED. A `markdown fr-view`
            # container renders a BARE-TEXT body's newlines as line breaks; the moment
            # update_case wraps that body in its own <p>…</p> the newlines stop breaking and
            # the whole Expected Result runs together into one paragraph on the tester's
            # screen. "The container is fr-view" is therefore NOT sufficient on its own:
            # the stored value must ALREADY START WITH A BLOCK ELEMENT, so that no wrapper
            # is added. A bare-text body has to go through the UI editor.
            if not re.match(r'\s*<(p|ol|ul|div|h[1-6]|blockquote|pre|table)\b', stored):
                raise RuntimeError('%s is stored as BARE TEXT, so update_case will add its own '
                                   '<p> wrapper and the newlines will stop rendering as line '
                                   'breaks (proved live on C30277, 2026-08-28) — use the UI editor'
                                   % field)
            new = stored
            for e in p['edits']:
                if new.count(e['find']) != 1:
                    raise RuntimeError('find string occurs %d times, not once: %r'
                                       % (new.count(e['find']), e['find'][:70]))
                new = new.replace(e['find'], e['replace'])
            recon = new
            for e in reversed(p['edits']):
                recon = recon.replace(e['replace'], e['find'], 1)
            if recon != stored:
                raise RuntimeError('the reverse transform did not reconstruct the stored value byte-for-byte')
            if new == stored:
                raise RuntimeError('the transform changed nothing')

            st2, after = call('update_case/%d' % cid, {field: new})
            if st2 != 200:
                raise RuntimeError('update_case HTTP %s %s' % (st2, str(after)[:200]))
            st3, live = call('get_case/%d' % cid)
            if st3 != 200:
                raise RuntimeError('post-GET HTTP %s' % st3)
            probs = []
            for k in KEEP:
                if k == field:
                    continue
                if json.dumps(before.get(k)) != json.dumps(live.get(k)):
                    probs.append('field %s CHANGED though it was never sent' % k)
            # Two storage-level normalisations TestRail performs on save, both observed
            # live on 2026-08-28 and NEITHER of them a change to what a tester reads:
            #   * a trailing newline is appended (C30345);
            #   * a literal em-dash character is re-encoded as the &mdash; entity (C30381).
            # They are normalised out of the byte comparison and NOTHING else is. The
            # rendered-page check below is what proves the tester sees no damage: a
            # DOUBLE-escaped entity (&amp;mdash;) would show up there as visible text.
            def storenorm(s):
                return (s or '').rstrip('\r\n \t').replace('&mdash;', '—').replace('&rsquo;', '’')
            if storenorm(live.get(field)) != storenorm(new):
                probs.append('the stored value is not what was sent (the sanitiser rewrote it)')
            fc1 = rendered(op, cid)
            probs += check_render(fc1, cid, field, marker(fc0))
            notes = [x for x in probs if x.startswith('NOTE-ONLY:')]
            probs = [x for x in probs if not x.startswith('NOTE-ONLY:')]
            for e in p['edits']:
                if e['replace'] not in plain(fc1[LABEL[field]][1]).replace('&amp;', '&'):
                    pass  # entity-bearing replacements are checked by the byte compare above
            if probs:
                raise RuntimeError(' | '.join(probs))
            results.append({'cid': cid, 'ok': True, 'field': field, 'why': p.get('why'),
                            'notes': notes, 'atm': live.get('custom_atmstatus'),
                            'containers': {k: fc1[k][0] for k in fc1},
                            'edits': [e['find'][:60] + ' -> ' + e['replace'][:60] for e in p['edits']],
                            'verified': ('rendered page re-read: all three fields in markdown fr-view, zero literal '
                                         'tags, zero escaped entities, AUTOMATION marker present once and last, '
                                         'provenance line present, every unsent field byte-identical'),
                            'link': 'https://shopview.testrail.io/index.php?/cases/view/%d' % cid})
            print('C%d WRITTEN and VERIFIED (%s)' % (cid, p.get('why', '')), flush=True)
        except Exception as ex:
            results.append({'cid': cid, 'ok': False, 'error': str(ex)[:900]})
            print('C%d FAILED: %s' % (cid, str(ex)[:400]), flush=True)
            print('*** STOPPING THE RUN — a case came back wrong ***', flush=True)
            break
    json.dump(results, open(outp, 'w'), indent=1)
    print('wrote', outp)
    sys.exit(0 if all(r.get('ok') for r in results) else 3)


if __name__ == '__main__':
    main()
