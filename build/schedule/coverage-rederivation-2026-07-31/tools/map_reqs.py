#!/usr/bin/env python3
"""Phase 2 - map every enumerated requirement to case(s).

Two independent signals (so a mistyped anchor cannot create a false gap):
  A) ANCHOR: the case's refs/spec_ref cites this requirement's section.
  B) TEXT:   content-word overlap between the requirement text and the case body
             (title + preconditions + steps + expected + notes). Score =
             |shared distinctive words| / |requirement distinctive words|.
Ranked candidates are emitted per requirement for human judgement.
"""
import json, glob, re, pathlib, collections

BASE = pathlib.Path('build/schedule/coverage-rederivation-2026-07-31')
reqs = json.load(open(BASE / 'requirements-enumerated.json'))

cases = []
for f in sorted(glob.glob('build/schedule/cases/*.json')):
    d = json.load(open(f))
    cs = d if isinstance(d, list) else d.get('cases', d)
    for c in cs:
        if str(c.get('viu_status', '')).startswith('Retired'):
            continue
        cases.append(c)

STOP = set('''a an the and or of to in on for with is are be been being that this these those it its as at by from not no
             so each every any all can could may might will would shall should must when where which who whom whose what
             if then than there here also only just more most other others both same such per via up down out into
              onto over under after before while during about above below between through across their they them his her
              you your we our i me my one two three them does do did done has have had having but yet still because
              since however therefore e g i.e etc'''.split())

def words(t):
    t = t.lower()
    t = re.sub(r'[^a-z0-9§\.\- ]', ' ', t)
    return set(w for w in t.split() if len(w) > 2 and w not in STOP)

def case_blob(c):
    parts = [c.get('title', ''), c.get('area', ''), c.get('notes', '') or '',
             ' '.join(c.get('preconditions', []) or []),
             ' '.join(c.get('steps', []) or []),
             ' '.join(c.get('expected', []) or [])]
    return ' '.join(parts)

case_words = {c['id']: words(case_blob(c)) for c in cases}
case_anchors = {}
for c in cases:
    a = set(re.findall(r'§(\d+(?:\.\d+)?)', (c.get('refs', '') or '') + ' ' + str(c.get('spec_ref', '') or '')))
    case_anchors[c['id']] = a

out = []
for r in reqs:
    rw = words(r['text'])
    sec = r['section']
    parent = sec.split('.')[0]
    cands = []
    for c in cases:
        cid = c['id']
        anchor = sec in case_anchors[cid]
        anchor_parent = (not anchor) and (parent in case_anchors[cid])
        ov = rw & case_words[cid]
        score = len(ov) / max(1, len(rw))
        if anchor or anchor_parent or score >= 0.34:
            cands.append(dict(case=cid, title=c.get('title', ''), anchor=anchor,
                              anchor_parent=anchor_parent, score=round(score, 2),
                              shared=sorted(ov)))
    cands.sort(key=lambda x: (-(x['anchor'] * 1.0 + x['score']), x['case']))
    out.append(dict(**r, n_anchor=sum(1 for c in cands if c['anchor']),
                    best=round(max([c['score'] for c in cands], default=0), 2),
                    candidates=cands[:8]))

json.dump(out, open(BASE / 'requirement-case-candidates.json', 'w'), indent=1)
weak = [r for r in out if r['n_anchor'] == 0 or r['best'] < 0.3]
print('requirements:', len(out))
print('with >=1 anchored case:', sum(1 for r in out if r['n_anchor']))
print('needing manual judgement (no anchored case OR best text score <0.30):', len(weak))
for r in weak:
    print('  %-12s %-9s %s' % (r['id'], r['kind'], r['text'][:110]))
