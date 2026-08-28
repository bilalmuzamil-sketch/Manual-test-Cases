#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PHASE 3 input builder - one compact dossier per HELD case.

For each held case it emits: the case's own live text, every CHANGED anchor the case
cites, and the word-level diff between the HELD and the LIVE definition of that anchor.
Spec bodies go file-to-file; only the per-anchor diff reaches a reader.

READ ONLY - no TestRail write.
"""
import difflib, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.dirname(HERE)
SV = os.path.join(RS, 'source-verify-2026-08-26')
sys.path.insert(0, os.path.join(SV, 'tools'))
sys.path.insert(0, os.path.join(RS, 'writes-2026-08-26'))
from verify import flatten, anchor_texts, live_body, held_body, definition, R, OUT, DATA  # noqa
from tr import call  # noqa

LIVE = {'IV': '10', 'PV': '11', 'SBC': '20', 'SBR': '24', 'TU': '9', 'WIP': '28'}


def norm(t):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', t or '')).strip()


def wdiff(h, l):
    hw, lw = h.split(), l.split()
    rem, add = [], []
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(a=hw, b=lw, autojunk=False).get_opcodes():
        if tag in ('replace', 'delete'):
            rem.append(' '.join(hw[i1:i2]))
        if tag in ('replace', 'insert'):
            add.append(' '.join(lw[j1:j2]))
    return rem, add


def main():
    targets = json.load(open(sys.argv[1]))
    pins = {p['cid']: p for p in json.load(open(os.path.join(DATA, 'case-version-pins.json')))}
    # per-report anchor tables + changed lists
    tab = {}
    for code in R:
        slug, hslug, hver = R[code]
        lx, lver, _ = live_body(slug)
        la = anchor_texts(flatten(lx))
        ha = anchor_texts(flatten(held_body(hslug, hver)))
        res = json.load(open(os.path.join(OUT, code + '.json')))
        tab[code] = (la, ha, set(res['changed']), res['cites'], lver, hver)

    fresh = {}
    out = []
    for cid in targets:
        s, c = call('get_case/' + cid[1:])
        fresh[cid] = c
        rep = pins[cid]['report']
        la, ha, changed, cites, lver, hver = tab[rep]
        text = norm(' '.join([c.get('title') or '', c.get('custom_preconds') or '',
                              c.get('custom_steps') or '', c.get('custom_expected') or '']))
        cited_anchors = sorted(set(re.findall(r'\bS\d+-(?:R|E|N|Q)\d+[a-z]?\b', text)))
        blk = ['=' * 78,
               '%s  [%s]  pin %s -> %s   https://shopview.testrail.io/index.php?/cases/view/%s'
               % (cid, rep, pins[cid]['cited'], LIVE[rep], cid[1:]),
               'TITLE: ' + (c.get('title') or ''),
               'ANCHORS CITED: ' + (', '.join(cited_anchors) or '(none)'),
               '--- EXPECTED (live stored, tags stripped) ---',
               norm(c.get('custom_expected'))]
        for a in cited_anchors:
            h = definition(ha, a) or ''
            l = definition(la, a) or ''
            state = 'CHANGED' if a in changed else 'unchanged'
            if a not in changed:
                continue
            rem, add = wdiff(h, l)
            blk.append('--- ANCHOR %s (%s, held v%s -> live v%s) ---' % (a, state, hver, lver))
            blk.append('  LIVE TEXT: ' + l[:900])
            blk.append('  REMOVED  : ' + ' // '.join(x for x in rem if x.strip())[:600])
            blk.append('  ADDED    : ' + ' // '.join(x for x in add if x.strip())[:600])
        out.append('\n'.join(blk))
    open(sys.argv[2], 'w').write('\n'.join(out) + '\n')
    json.dump(fresh, open('/tmp/rspin/fresh-held.json', 'w'))
    print('wrote', sys.argv[2], os.path.getsize(sys.argv[2]), 'bytes for', len(targets), 'cases')


if __name__ == '__main__':
    main()
