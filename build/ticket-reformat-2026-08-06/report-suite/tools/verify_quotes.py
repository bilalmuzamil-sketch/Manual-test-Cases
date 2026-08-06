#!/usr/bin/env python3
"""Every specification quote in an authored record must be found VERBATIM in the
spec text fetched live today, and its anchor must exist. Normalises only the
characters that cannot carry meaning: quote glyphs, dash glyphs, whitespace runs.

Exit 1 if any quote or anchor is not found -- a source we cannot verify is never
written to a ticket (Rule 12 / Rule 57).
"""
import json, os, re, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
SPECS = os.path.join(HERE, '..', 'specs')
AUTH = os.path.join(HERE, '..', 'authored')

_TEXT = {}


def spec_text(slug):
    if slug not in _TEXT:
        f = glob.glob(os.path.join(SPECS, f'{slug}-v*.txt'))[0]
        _TEXT[slug] = norm(open(f).read())
    return _TEXT[slug]


def norm(s):
    s = s.replace('“', '"').replace('”', '"').replace('‘', "'").replace('’', "'")
    s = s.replace('—', '-').replace('–', '-').replace('−', '-')
    s = s.replace(' ', ' ')
    s = re.sub(r'\s+', ' ', s)
    return s


def check(key, rec):
    rows = []
    for e in rec.get('source', []):
        if e[0] not in ('spec', 'spec_note'):
            rows.append({'ticket': key, 'kind': e[0], 'verdict': 'n/a (not a spec quote)',
                         'detail': (e[1] if len(e) > 1 else '')[:70]})
            continue
        slug, anchor, quote = e[1], e[2], e[3]
        txt = spec_text(slug)
        qfound = norm(quote) in txt
        # anchor: for 'spec' entries the id itself must appear in the document
        afound = True
        if e[0] == 'spec':
            afound = re.search(re.escape(anchor) + r'\s*:', txt) is not None
        rows.append({'ticket': key, 'kind': 'spec', 'spec': slug, 'anchor': anchor,
                     'anchor_found': afound, 'quote_found': qfound,
                     'verdict': 'PASS' if (qfound and afound) else 'FAIL',
                     'quote_head': quote[:80]})
    # any anchor mentioned inside a note must also exist
    for e in rec.get('source', []):
        if e[0] == 'note':
            for m in re.finditer(r'\bS\d+-[RNE]\d+[a-z]?\b', e[1]):
                a = m.group(0)
                hits = [s for s in ('sbc', 'sbr', 'pv', 'tu', 'wip', 'iv')
                        if re.search(re.escape(a) + r'\s*:', spec_text(s))]
                rows.append({'ticket': key, 'kind': 'note-anchor', 'anchor': a,
                             'found_in': hits, 'verdict': 'PASS' if hits else 'FAIL'})
    return rows


def main():
    keys = sys.argv[1:] or sorted(os.path.basename(f)[:-5]
                                  for f in glob.glob(os.path.join(AUTH, 'SV-*.json')))
    allrows, fails = [], 0
    for k in keys:
        rec = json.load(open(os.path.join(AUTH, k + '.json')))
        for r in check(k, rec):
            allrows.append(r)
            if r['verdict'] == 'FAIL':
                fails += 1
                print('FAIL', r)
    json.dump(allrows, open(os.path.join(HERE, '..', 'snapshots', 'quote-verification.json'), 'w'), indent=1)
    checked = [r for r in allrows if r['verdict'] != 'n/a (not a spec quote)']
    print(f'{len(keys)} tickets, {len(checked)} source checks, {len(checked)-fails} PASS, {fails} FAIL')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
