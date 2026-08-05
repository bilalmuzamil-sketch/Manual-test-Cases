import json, re, sys, datetime
sys.path.insert(0,'.')
from tr import paged, api
from collections import Counter
print('post-write audit UTC', datetime.datetime.utcnow().isoformat()+'Z')
secs=paged('get_sections/1&suite_id=1','sections'); by={s['id']:s for s in secs}
def anc(s):
    o=[];c=s
    while c: o.append(c['id']); c=by.get(c.get('parent_id'))
    return o
ids={s['id'] for s in secs if 4110 in anc(s)}
cases=[c for c in paged('get_cases/1&suite_id=1','cases') if c['section_id'] in ids]
json.dump(cases, open('cases-POST.json','w'), indent=1, sort_keys=True)
print('LIVE cases under group 4110:', len(cases))
print('created_by histogram:', dict(Counter(c['created_by'] for c in cases)))

PRE={c['id']:c for c in json.load(open('cases-PRE.json'))}
PLAN={p['cid']:p for p in json.load(open('plan.json'))}
BARRED=['as per the build','build tested on','verified by the build','as the build behaves']
MK=re.compile(r'^AUTOMATION: (READY - EXPECT FAIL \(.*\)|READY|HOLD - .*)$')

prob=[]; nprov=Counter(); marks=Counter(); barred_hits=[]
for c in cases:
    cid=c['id']; e=c['custom_expected'] or ''
    # 1. intended text written exactly
    if e!=PLAN[cid]['expected']: prob.append((cid,'expected != planned'))
    # 2. exactly one provenance line
    n=e.count('This is the expected behaviour'); nprov[n]+=1
    # 3. no barred phrasing ANYWHERE in the provenance paragraph
    pv=[b for b in e.split('\n\n') if 'This is the expected behaviour' in b]
    for b in BARRED:
        for blk in pv:
            if b in blk: barred_hits.append((cid,b))
    # 4. marker: exactly one, valid, last line
    ml=[l for l in e.split('\n') if l.startswith('AUTOMATION: ')]
    if len(ml)!=1: prob.append((cid,'marker count %d'%len(ml)))
    elif not MK.match(ml[0]): prob.append((cid,'marker malformed'))
    elif e.rstrip().split('\n')[-1]!=ml[0]: prob.append((cid,'marker not last line'))
    else:
        marks['EXPECT FAIL' if 'EXPECT FAIL' in ml[0] else ('HOLD' if 'HOLD -' in ml[0] else 'READY')]+=1
    # 5. marker identical to pre-write
    pm=[l for l in (PRE[cid]['custom_expected'] or '').split('\n') if l.startswith('AUTOMATION: ')]
    if pm!=ml: prob.append((cid,'MARKER CHANGED'))
    # 6. blank line before + line break after the marker
    if '\n\n'+ml[0] not in e: prob.append((cid,'no blank line before marker'))
    if not e.endswith(ml[0]+'\n') and not e.endswith(ml[0]): prob.append((cid,'no line break after marker'))
    # 7. body (everything before the provenance separator) byte-identical to pre-write
    ob=(PRE[cid]['custom_expected'] or '').split('\n\n---\n')[0]
    nb=e.split('\n\n---\n')[0]
    if ob!=nb: prob.append((cid,'BODY CHANGED'))
    # 8. every OTHER field byte-identical to pre-write
    for k in set(c)|set(PRE[cid]):
        if k in ('updated_on','updated_by','custom_expected'): continue
        if c.get(k)!=PRE[cid].get(k): prob.append((cid,'FIELD MOVED: %s'%k))
print()
print('provenance-line count per case:', dict(nprov), '<- must be {1: 110}')
print('BARRED phrasings remaining:', len(barred_hits), barred_hits[:5])
print('markers:', dict(marks))
print('ARITHMETIC GATE  READY + READY-EXPECT-FAIL =', marks['READY']+marks['EXPECT FAIL'], '(must be 100)')
print('structural / collateral problems:', len(prob), prob[:10])
# divergence sentence
d=[c for c in cases if 'Please note this is a change from what this test used to say' in (c['custom_expected'] or '')]
print('Rule-56 divergence sentence present on:', [c['id'] for c in d], '<- must be [29624]')
