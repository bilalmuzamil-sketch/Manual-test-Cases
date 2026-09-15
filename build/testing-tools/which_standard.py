#!/usr/bin/env python3
"""Say, per case, WHICH STANDARD it is judged against — and refuse to let one be assumed for a set.

Why this exists. On an upgrade project two kinds of case live side by side, often in the SAME RUN:

  * REGRESSION cases   — "a person can do this on the live product today; can they still?"
                          The shipped old version is the standard.
  * FEATURE cases      — "does the new version do what was specified?"
                          Standing Rule 57: the DOCUMENTS are the standard, never the build.

Run 415 is exactly this: 164 tests, of which 62 are the regression set and 102 are not. Judge the
102 against "what production does" and every deliberate improvement becomes a defect. Judge the 62
against the V2 document and every lost capability becomes acceptable. Both blunders are silent.

THE DISCRIMINATOR IS THE CASE'S OWN SOURCE LINE, NEVER THE RUN, FOLDER OR PROJECT. A regression
case says so in its own Expected text — this suite's say "THIS CASE IS TESTED AGAINST V1, NOT
AGAINST THE V2 SPECIFICATION". A case that does not say it is not one, whatever its neighbours say.

    python3 build/testing-tools/which_standard.py --cases <CASES-FULL.json>
    python3 build/testing-tools/which_standard.py --cases <file> --assert-all regression

`--assert-all` exits 1 if the set is mixed or is not the kind you claimed, which is the point: a
session about to apply one standard to a whole suite has to prove the suite is all one kind.
"""
import argparse, json, re, sys

# A regression case declares its own standard. These are the forms seen so far; add to them only
# when a new one is SEEN, never speculatively.
DECLARES_OLD_VERSION = re.compile(
    r'TESTED AGAINST V1,\s*NOT AGAINST THE V2'
    r'|the shipped V1 product IS the specification'
    r'|as per the V1 product itself'
    r'|Standing Rule 109',
    re.I)


def classify(cases):
    out = {'regression': [], 'feature': [], 'unreadable': []}
    for cid, c in cases.items():
        if not isinstance(c, dict) or 'expected' not in c:
            out['unreadable'].append(cid)
            continue
        text = c.get('expected') or ''
        out['regression' if DECLARES_OLD_VERSION.search(text) else 'feature'].append(cid)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cases', required=True, help='a JSON map of C-id -> case, with full expected')
    ap.add_argument('--assert-all', choices=['regression', 'feature'],
                    help='exit 1 unless every case is of this kind')
    ap.add_argument('--list', action='store_true')
    a = ap.parse_args()

    cases = json.load(open(a.cases))
    g = classify(cases)
    total = sum(len(v) for v in g.values())

    print('%d cases in %s' % (total, a.cases))
    print('  %3d judged against the SHIPPED OLD VERSION (regression)' % len(g['regression']))
    print('      -> the old version on production is the standard; the new spec is context only')
    print('  %3d judged against the DOCUMENTS (Standing Rule 57)' % len(g['feature']))
    print('      -> spec, stories, PO answers, design; the build gives labels and a verdict, nothing more')
    if g['unreadable']:
        print('  %3d could not be read - NOT classified, do not assume' % len(g['unreadable']))
    if a.list:
        for k in ('regression', 'feature', 'unreadable'):
            if g[k]:
                print('\n%s: %s' % (k, ', '.join(sorted(g[k]))))

    if g['regression'] and g['feature']:
        print('\n*** THIS SET IS MIXED. *** There is no single standard for it. Judge each case by '
              'its own source line.\n    Applying one standard to all of them is the blunder this '
              'tool exists to stop.')

    if a.assert_all:
        others = {k: v for k, v in g.items() if k != a.assert_all and v}
        if others:
            print('\nREFUSED: you claimed every case is "%s", but %s'
                  % (a.assert_all,
                     '; '.join('%d are %s' % (len(v), k) for k, v in others.items())))
            sys.exit(1)
        print('\nOK: every case is "%s"' % a.assert_all)


if __name__ == '__main__':
    main()
