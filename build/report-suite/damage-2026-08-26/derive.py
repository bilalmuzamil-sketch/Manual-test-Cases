# -*- coding: utf-8 -*-
"""Derive the INTENDED plain-text content for every damaged case.

Two independent derivations, byte-compared:
  A. de-damage the LIVE (damaged) value  -> strip the <p>/</p> wrapper, <br> -> \n, unescape entities
  B. the 11:53 PRE-WRITE snapshot value
A carries today's approved edits (spec re-pins, re-check sentence); B does not.
Where A and B differ we require the difference to be an INTENDED EDIT (whole-line
add/change), never a lost/garbled character. Anything else -> REVIEW, not repaired.
"""
import json, re, html, sys, difflib
import tr

SNAP = '/home/user/Manual-test-Cases/build/report-suite/source-verify-2026-08-26/data/live-cases.json'
SCOPE = '/home/user/Manual-test-Cases/build/report-suite/damage-2026-08-26/scope.json'
OUT = '/home/user/Manual-test-Cases/build/report-suite/damage-2026-08-26/intended.json'
FMAP = {'custom_preconds': 'pre', 'custom_steps': 'steps', 'custom_expected': 'expected'}
SKIP = {'30197', '30518'}          # repaired already / Automated (Rules 65,71)
TAG = re.compile(r'</?(p|br|ul|li|ol|div|span|b|i|strong|em|table|tr|td)\b[^>]*>', re.I)


def dedamage(v):
    s = v or ''
    s = s.replace('\r\n', '\n')
    if s.endswith('\n'):
        s = s[:-1]
    if s.startswith('<p>') and s.endswith('</p>'):
        s = s[3:-4]
    s = re.sub(r'<br\s*/?>', '\n', s, flags=re.I)
    s = html.unescape(s)
    return s


def main():
    snap = {str(c['id']): c for c in json.load(open(SNAP))}
    scope = json.load(open(SCOPE))
    dmg = [c for c, r in scope.items()
           if 'fields' in r and any(f['damaged'] for f in r['fields'].values())]
    todo = [c for c in dmg if c not in SKIP]
    out, review = {}, []
    for cid in todo:
        st, live = tr.call(f'get_case/{cid}')
        if st != 200:
            review.append((cid, 'GET %s' % st)); continue
        rec = {'cid': cid, 'title': live.get('title'), 'atm': live.get('custom_atmstatus'),
               'fields': {}}
        bad = []
        for api, sk in FMAP.items():
            if not scope[cid]['fields'][api]['damaged']:
                continue
            liveval = live.get(api) or ''
            A = dedamage(liveval)
            B = ((snap.get(cid) or {}).get(sk) or '').replace('\r\n', '\n')
            leftover = sorted(set(m.group(0).lower() for m in TAG.finditer(A)))
            if leftover:
                bad.append('%s: residual tags %s' % (api, leftover))
            # line-level comparison: every differing line must be a whole-line
            # add/replace (an intended edit), never a partial-character corruption
            la, lb = A.split('\n'), B.split('\n')
            sm = difflib.SequenceMatcher(None, lb, la, autojunk=False)
            edits = [(op, lb[i1:i2], la[j1:j2])
                     for op, i1, i2, j1, j2 in sm.get_opcodes() if op != 'equal']
            rec['fields'][api] = {
                'intended': A,
                'snapshot': B,
                'identical_to_snapshot': A == B,
                'edits': [{'op': o, 'was': w, 'now': n} for o, w, n in edits],
                'live_len': len(liveval), 'intended_len': len(A), 'snap_len': len(B),
            }
        if bad:
            review.append((cid, '; '.join(bad)))
            rec['REVIEW'] = bad
        out[cid] = rec
    json.dump(out, open(OUT, 'w'), indent=1)
    # ---- SUMMARY ONLY (Rule 88: never bulk-read) ----
    same = [c for c in out if all(f['identical_to_snapshot'] for f in out[c]['fields'].values())]
    diff = [c for c in out if c not in same]
    print('cases derived      :', len(out))
    print('identical to snap  :', len(same))
    print('carry today edits  :', len(diff))
    print('REVIEW (residual)  :', review)
    # what KINDS of edit exist, deduplicated
    kinds = {}
    for c in diff:
        for api, f in out[c]['fields'].items():
            for e in f['edits']:
                for w, n in zip(e['was'] + [''] * len(e['now']), e['now'] + [''] * len(e['was'])):
                    key = (w[:60], n[:60])
                    kinds.setdefault(key, []).append(c)
    print('distinct edit shapes:', len(kinds))
    for (w, n), cs in sorted(kinds.items(), key=lambda kv: -len(kv[1]))[:25]:
        print('  x%-3d WAS %r\n        NOW %r' % (len(cs), w, n))


if __name__ == '__main__':
    main()
