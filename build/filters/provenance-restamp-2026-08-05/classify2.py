import json, re
from collections import Counter
cs=json.load(open('cases-PRE.json'))
rows=[]
for c in cs:
    e=c['custom_expected'] or ''
    blocks=e.split('\n\n')
    pi=[i for i,b in enumerate(blocks) if 'This is the expected behaviour' in b]
    assert len(pi)==1, (c['id'], len(pi))
    i=pi[0]
    blk=blocks[i]
    # the separator
    has_sep = blk.startswith('---\n')
    prov = blk[4:] if has_sep else blk
    tail = blocks[i+1:]
    rows.append(dict(cid=c['id'], has_sep=has_sep, prov=prov, ntail=len(tail),
                     tail=tail, nblocks=len(blocks), prov_idx=i,
                     before=blocks[:i]))
print('cases:',len(rows))
print('separator "---" immediately before provenance:',sum(1 for r in rows if r['has_sep']),'/110')
print('blocks AFTER the provenance block:',dict(Counter(r['ntail'] for r in rows)))
print('provenance is the LAST-BUT-ONE block (marker last):',sum(1 for r in rows if r['ntail']==1),'/110')
print()
print('--- the ones with MORE than just the marker after ---')
for r in rows:
    if r['ntail']>1:
        print('C%s :: %d tail blocks'%(r['cid'],r['ntail']))
        for t in r['tail']: print('    |',t[:110].replace('\n',' / '))
print()
print('--- provenance sentence-count histogram ---')
def nsent(s): return len([x for x in re.split(r'(?<=[.!?]) ', s) if x.strip()])
print(dict(Counter(nsent(r['prov']) for r in rows)))
json.dump(rows, open('classify2.json','w'), indent=1)
