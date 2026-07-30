#!/usr/bin/env python3
"""Secondary gap detector: which distinctive words of each requirement appear
NOWHERE in the whole active case corpus (title+preconds+steps+expected+notes)?
A requirement whose key nouns are absent corpus-wide is a strong gap candidate."""
import json, glob, re, pathlib
BASE = pathlib.Path('build/schedule/coverage-rederivation-2026-07-31')
reqs = json.load(open(BASE / 'requirements-enumerated.json'))
corpus = []
for f in sorted(glob.glob('build/schedule/cases/*.json')):
    d = json.load(open(f)); cs = d if isinstance(d, list) else d.get('cases', d)
    for c in cs:
        if str(c.get('viu_status','')).startswith('Retired'): continue
        corpus.append(' '.join([c.get('title',''), c.get('notes','') or '',
                                ' '.join(c.get('preconditions',[]) or []),
                                ' '.join(c.get('steps',[]) or []),
                                ' '.join(c.get('expected',[]) or [])]))
blob = re.sub(r'[^a-z0-9 ]', ' ', ' '.join(corpus).lower())
have = set(blob.split())
STOP=set('a an the and or of to in on for with is are be to that this these those it its as at by from not no so each every any all can could may might will would shall should must when where which who what if then than there here also only just more most other others both same such per via up down out into onto over under after before while during about above below between through across their they them you your we our one two three does do did done has have had having but yet still because since however therefore'.split())
rows=[]
for r in reqs:
    ws=[w for w in re.sub(r'[^a-z0-9 ]',' ',r['text'].lower()).split() if len(w)>3 and w not in STOP]
    miss=sorted(set(w for w in ws if w not in have))
    if miss: rows.append((r['id'], r['section'], miss, r['text']))
print('requirements with >=1 corpus-absent distinctive word:', len(rows))
for i,(rid,sec,miss,txt) in enumerate(rows):
    print('%-12s missing=%s' % (rid, ','.join(miss)))
    print('    ' + txt[:150])
