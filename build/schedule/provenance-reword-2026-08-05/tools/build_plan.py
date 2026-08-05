import json,re
cs=json.load(open('snap/PRE-cases.json'))
SEP='\n\n---\n'
MARK=re.compile(r'\n\nAUTOMATION: (READY - EXPECT FAIL \([^)]*\)|READY|HOLD - [^\n]*)\n?$')
# consume the ENTIRE checking sentence: from " It was ... against ... build" to the end of the block
CHK=re.compile(r' It was (?:last checked|verified) against (?:the )?build .*$', re.S)
plan=[]
for c in cs:
    e=c['custom_expected']
    m=MARK.search(e)
    body_end=e.find(SEP)
    body=e[:body_end]
    block=e[body_end+len(SEP):m.start()]
    marker=m.group(0)
    assert len(CHK.findall(block))==1, c['id']
    old=CHK.search(block).group(0)
    # the removed text must contain nothing but the checking sentence(s)
    assert old.rstrip().endswith('.'), (c['id'], old[-80:])
    if 'It was verified against' in old:
        s2=' Last checked against build v3.5-be42149 on 8/5/2026.'
        basis='observed live 2026-08-05 on v3.5-be42149'
    else:
        s2=' Last checked against build v3.5-4873abe on 8/4/2026.'
        basis='carried forward from 2026-08-04 on v3.5-4873abe'
    newblock=block[:CHK.search(block).start()]+s2
    new=body+SEP+newblock+marker
    plan.append(dict(cid=c['id'], old_expected=e, new_expected=new,
                     removed=old.strip(), new_check=s2.strip(), basis=basis,
                     marker=m.group(1), changed=(new!=e)))
json.dump(plan,open('plan.json','w'),indent=1)
print('plan rows',len(plan),'changed',sum(1 for p in plan if p['changed']))
from collections import Counter
print(Counter(p['new_check'] for p in plan))
BARRED=['as per the build','verified against','tested on','as the build behaves','It was last checked','rebuilt to','re-checked against it']
for b in BARRED:
    n=sum(1 for p in plan if b.lower() in p['new_expected'].lower())
    print(f'  new text contains {b!r}: {n}')
assert all(p['new_expected'].count('This is the expected behaviour')==1 for p in plan)
assert all(p['new_expected'].count('AUTOMATION:')==1 for p in plan)
assert all(p['new_expected'].count('Last checked against build')==1 for p in plan)
assert all(p['new_expected'].count(SEP)==1 for p in plan)
# the ONLY difference vs old must be inside the provenance block
for p in plan:
    ob=p['old_expected'][:p['old_expected'].find(SEP)]
    nb=p['new_expected'][:p['new_expected'].find(SEP)]
    assert ob==nb, p['cid']
print('structure asserts PASS; case body before the separator byte-identical on all 165')
print()
for tag in ('carried','observed'):
    s=[p for p in plan if p['basis'].startswith(tag)][0]
    print('SAMPLE',tag.upper()); print(repr(s['new_expected'][-300:])); print()
