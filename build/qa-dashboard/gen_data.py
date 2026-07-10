#!/usr/bin/env python3
"""Build dash-data JSON for the QA dashboard template from raw ticket pulls.

Inputs (in the working dir passed as argv[1], default scratchpad):
  tickets-unique.json   deduped ticket records (see REFRESH-RUNBOOK.md)
  story-epic-map.json   parentStory -> epic map
  asof (argv[2])        snapshot date YYYY-MM-DD
Output: dash-data.json (embed into qa-dashboard-template.html at "__DATA__")
"""
import json, sys
from collections import Counter

W = sys.argv[1] if len(sys.argv) > 1 else '.'
ASOF = sys.argv[2]

FIRST = {'mudassir':'Mudassir Qamar','viktoria':'Viktoria Videnovic','nebojsa':'Nebojsa Glavinic',
'ahtasham':'Ahtasham Amjad','nemanja':'Nemanja Djuric','stefan':'Stefan Vukovic',
'bilal':'Bilal Muzamil','bilalmuzamil':'Bilal Muzamil','ayesha':'Ayesha Khan',
'dusan':'Dusan Bulovan','vladimir':'Vladimir Tomovic'}

def person_from(tok):
    tok = tok.strip('_').lower()
    if not tok: return None
    return FIRST.get(tok.split('_')[0]) or FIRST.get(tok)

recs = json.load(open(f'{W}/tickets-unique.json'))
semap = json.load(open(f'{W}/story-epic-map.json'))

epics, out = {}, []
variants = Counter(); mismatch = 0; bare = 0; lower = 0; inprog = 0
for r in recs:
    ep = en = None
    if r['parentType'] == 'Epic':
        ep, en = r['parent'], r['parentSummary']
    elif r['parent'] and r['parent'] in semap and semap[r['parent']]['epic']:
        ep, en = semap[r['parent']]['epic'], semap[r['parent']]['epicSummary']
    if ep: epics[ep] = en or ep
    lc, lip, sv, rj = [], [], False, False
    for l in r['labels']:
        ll = l.lower()
        if ll.startswith('qacomplete'):
            p = person_from(l[len('qacomplete'):])
            variants[l] += 1
            if not l.startswith('QAComplete'): lower += 1
            if p: lc.append(p)
            else: bare += 1
        elif ll.endswith('_inprogress'):
            p = person_from(l[:-len('_inprogress')])
            inprog += 1
            if p: lip.append(p)
        elif ll == 'staging_verified': sv = True
        elif ll == 'rejected_staging': rj = True
        elif ll.startswith('prod_verified'):
            p = person_from(l[len('prod_verified'):])
            if p: lc.append(p)
    if lc and r['qa'] and not set(lc) & set(r['qa']): mismatch += 1
    dn = r['catchange'] if r['statusCat'] == 'Done' else None
    out.append({'k':r['key'],'s':r['summary'][:96],'st':r['status'],'ty':r['type'],
        'pr':r['priority'],'ep':ep,'qa':r['qa'],'rep':r['reporter'],'lc':sorted(set(lc)),
        'lip':sorted(set(lip)),'sv':sv,'rj':rj,'cr':r['created'],'up':r['updated'],'dn':dn,
        'cat':r['statusCat']})

per_person = Counter()
for lbl, n in variants.items():
    p = person_from(lbl[len('qacomplete'):]) if lbl.lower().startswith('qacomplete') else None
    if p: per_person[p.split(' ')[0]] += n

data = {'asof': ASOF, 'tickets': out, 'epics': epics,
        'hygiene': {'inprog': inprog, 'bare': bare, 'lower': lower, 'mismatch': mismatch,
                    'per_person': dict(per_person.most_common())}}
json.dump(data, open(f'{W}/dash-data.json', 'w'), separators=(',', ':'))
print('tickets', len(out), 'epics', len(epics), 'hygiene', data['hygiene'])
