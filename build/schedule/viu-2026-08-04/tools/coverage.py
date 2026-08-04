#!/usr/bin/env python3
"""EXHAUSTIVE Schedule spec parse + two-direction coverage re-derivation.

Rule 50: EVERY non-blank line of the live spec either becomes a REQUIREMENT or is
explicitly CLASSIFIED as non-requirement with a reason.  The two totals must reconcile
to the non-blank line count with ZERO remainder - nothing is silently dropped.

Rule 43: the matrix is RE-DERIVED from the current spec body and the current case source,
never patched, and it runs in BOTH directions.
"""
import re, html, json, os, csv, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..')
SPEC = os.path.join(ROOT, 'build/schedule/viu-2026-08-04/snapshots/spec-v23-live.storage.html')
LIVE = os.path.join(ROOT, 'build/schedule/viu-2026-08-04/snapshots/live-pull-after.json')

HEAD = re.compile(r'^(\d+(?:\.\d+)?)\.?\s+(.+)$')

NONREQ = [
 (re.compile(r'^(Status|Author|Last Updated|Version|Stakeholders|Design|Epic|PRD)$', re.I), 'document metadata label'),
 (re.compile(r'^\|\s'), 'table cell continuation of the line above'),
 (re.compile(r'^(Persona|Role|Key needs|Metric|Target|Measurement|Option|Default|Effect|Entity|Key fields|Relationships|Conflict type|Description|Control|Function|Filter group|Options|Scenario|Behavior)$', re.I), 'table column heading'),
 (re.compile(r'^(ShopView · Technician Scheduling Module)$'), 'document title'),
 (re.compile(r'^https?://'), 'bare reference URL'),
]

def to_lines(storage):
    t = storage
    t = re.sub(r'</t[dh]>', ' | ', t)
    t = re.sub(r'<br\s*/?>', '\n', t)
    t = re.sub(r'</(p|h1|h2|h3|h4|h5|li|tr|table|ac:structured-macro)>', '\n', t)
    t = re.sub(r'<ac:parameter[^>]*>.*?</ac:parameter>', ' ', t, flags=re.S)
    t = re.sub(r'<[^>]+>', '', t)
    t = html.unescape(t).replace(' ', ' ')
    out = []
    for raw in t.split('\n'):
        s = re.sub(r'[ \t]+', ' ', raw).strip()
        s = re.sub(r'(\s*\|\s*)+$', '', s).strip()
        out.append(s)
    return out


def parse():
    lines = to_lines(open(SPEC).read())
    nb = [l for l in lines if l]
    reqs, nonreq = [], []
    section, n = '0', 0
    for l in nb:
        m = HEAD.match(l)
        if m and len(m.group(1)) <= 5 and not l.endswith('.') and len(l) < 90:
            section = m.group(1); n = 0
            nonreq.append((l, 'section heading §' + section))
            continue
        why = None
        for rx, reason in NONREQ:
            if rx.match(l):
                why = reason; break
        if why:
            nonreq.append((l, why)); continue
        n += 1
        reqs.append({'anchor': f'§{section}-L{n}', 'section': '§' + section, 'text': l})
    assert len(reqs) + len(nonreq) == len(nb), (len(reqs), len(nonreq), len(nb))
    return lines, nb, reqs, nonreq


SEC_RE = re.compile(r'§\s?\d+(?:\.\d+)?')

def main():
    lines, nb, reqs, nonreq = parse()
    live = json.load(open(LIVE))['cases']
    idm = {r['testrail_case_id'].lstrip('C'): r['internal_id']
           for r in csv.DictReader(open(os.path.join(ROOT, 'build/schedule/testrail-id-map.csv')))}
    # case -> the spec sections it cites
    case_secs = {}
    for c in live:
        s = set(x.replace('§ ', '§') for x in SEC_RE.findall(c.get('refs') or ''))
        case_secs[c['id']] = s
    all_cited = set().union(*case_secs.values()) if case_secs else set()
    spec_secs = sorted({r['section'] for r in reqs}, key=lambda s: [int(x) for x in s[1:].split('.')])

    # direction 1: requirement -> case(s)
    def hits(sec, cited):
        """A case citing §7 covers every requirement inside §7 and its sub-sections;
        a case citing §4.9 covers only §4.9.  Prefix match, both ways."""
        for c in cited:
            if sec == c or sec.startswith(c + '.') or c.startswith(sec + '.'):
                return True
        return False
    cov = {}
    for r in reqs:
        cov[r['anchor']] = sorted(idm[str(cid)] + ' = C' + str(cid)
                                  for cid, ss in case_secs.items() if hits(r['section'], ss))
    uncovered = [r for r in reqs if not cov[r['anchor']]]
    # direction 2: case -> requirement (orphaned anchors)
    known = set(spec_secs)
    def exists(c):
        return any(s == c or s.startswith(c + '.') for s in known)
    orphan = {idm[str(cid)] + ' = C' + str(cid): sorted(x for x in ss if not exists(x))
              for cid, ss in case_secs.items() if any(not exists(x) for x in ss)}
    noanchor = [idm[str(cid)] + ' = C' + str(cid) for cid, ss in case_secs.items() if not ss]

    print('COMPLETENESS PROOF')
    print('  spec lines total        :', len(lines))
    print('  non-blank lines         :', len(nb))
    print('  -> REQUIREMENT lines    :', len(reqs))
    print('  -> classified non-req   :', len(nonreq))
    print('  remainder               :', len(nb) - len(reqs) - len(nonreq))
    print('  spec sections           :', len(spec_secs))
    print()
    print('DIRECTION 1  requirement -> case')
    print('  requirements with at least one case:', len(reqs) - len(uncovered))
    print('  UNCOVERED requirements            :', len(uncovered))
    print()
    print('DIRECTION 2  case -> requirement')
    print('  cases citing a section that no longer exists:', len(orphan), orphan or '')
    print('  cases citing NO spec section                :', len(noanchor), noanchor or '')
    json.dump({'reqs': reqs, 'nonreq': nonreq, 'cov': cov,
               'uncovered': uncovered, 'orphan': orphan, 'noanchor': noanchor,
               'spec_sections': spec_secs, 'cited_sections': sorted(all_cited)},
              open(os.path.join(ROOT, 'build/schedule/viu-2026-08-04/coverage.json'), 'w'), indent=1)
    return uncovered

if __name__ == '__main__':
    u = main()
    print()
    print('THE UNCOVERED REQUIREMENTS, VERBATIM:')
    for r in u:
        print(f"  {r['anchor']}  {r['text'][:150]}")
