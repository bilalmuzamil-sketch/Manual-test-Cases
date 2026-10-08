"""Damage check for the new-layout rewrite: compares proposed bodies to the live snapshot before any write."""
import json,re,sys,html,collections
live=json.load(open('/tmp/cln/l253-live.json'))
out={}
for f in sys.argv[1:]:
    out.update({str(k):v for k,v in json.load(open(f)).items()})
def txt(s): return html.unescape(re.sub(r'<[^>]+>',' \n',s or ''))
def head(e): return re.split(r'<p><strong>(?:What you should see today|Source)',e or '')[0]
def nsteps(s): return len(re.findall(r'<li\b',re.split(r'</ol>',s or '')[0])) if s else 0
def top_steps(s):
    # count top-level <li> of the first <ol>
    depth=0;n=0
    for m in re.finditer(r'<(/?)(ol|ul|li)\b',s or ''):
        close,tag=m.group(1),m.group(2)
        if tag in('ol','ul'): depth+= -1 if close else 1
        elif tag=='li' and not close and depth==1: n+=1
    return n
def step_refs(e):
    h=txt(head(e)); refs=set()
    for m in re.finditer(r'\b[Ss]teps?\s+(\d+)(?:\s*(?:to|-|–|and|,)\s*(\d+))*',h):
        for g in re.findall(r'\d+',m.group(0)): refs.add(int(g))
    return refs
def quoted(s): return set(re.findall(r'[“"]([^”"]{2,60})[”"]',txt(s)))
probs=collections.defaultdict(list); cust=collections.defaultdict(list)
for k,v in out.items():
    L=live.get(k)
    if not L: probs[k].append('not in snapshot'); continue
    if L['created_by']==1: probs[k].append('VLADIMIR - never write'); continue
    if 'custom_expected' in v:
        if head(v['custom_expected'])!=head(L['custom_expected']): probs[k].append('EXPECTED HEAD CHANGED')
        e=v['custom_expected']
        if len(re.findall(r'AUTOMATION:',e))!=1: probs[k].append('marker count != 1')
    else: e=L['custom_expected']
    ns=top_steps(v['custom_steps'])
    refs=step_refs(e)
    if refs and max(refs)>ns: probs[k].append(f'Expected refers to step {max(refs)} but only {ns} steps')
    oldq=quoted(L['custom_preconds'])|quoted(L['custom_steps']); newq=quoted(v['custom_preconds'])|quoted(v['custom_steps'])
    lost=[q for q in oldq-newq if not re.match(r'(ZZ|S1-|S\d|Line |e\.g)',q) and not re.search(r'[A-Z][a-z]+ [A-Z][a-z]+$',q)]
    if lost: probs[k].append('quoted labels dropped: '+'; '.join(sorted(lost)[:6]))
    p=v['custom_preconds']
    for need in ['<strong>Preconditions</strong>','<strong>Setup</strong>','Needs:','Check the setup worked']:
        if need not in p: probs[k].append('missing '+need)
    for bad in ['<br','<b>','<i>','<em>','<code>','\n\n']:
        if bad in p+v['custom_steps']: probs[k].append('bad markup '+bad)
    for c in set(re.findall(r'ZZAUTOTEST [A-Z0-9][^"”&<,;.)]{2,50}',txt(p))):
        if re.search(r'\b(Co|Customer|Shop|Columns|Unassigned|Fibridge|Fisquare)\b',c) or ' F1 ' in c or ' F2 ' in c or ' F3 ' in c: cust[c.strip()].append(k)
    if 'e.g.' in txt(v['custom_steps']): probs[k].append('steps still use e.g. names')
dup={c:ids for c,ids in cust.items() if len(set(ids))>1}
print(f'checked {len(out)}; with problems {len(probs)}')
for k,p in sorted(probs.items(),key=lambda x:int(x[0])): print(' C'+k,'|',' / '.join(p))
print('customers used by more than one case:',len(dup))
for c,ids in list(dup.items())[:40]: print('  ',c,'->',['C'+i for i in sorted(set(ids),key=int)])
sys.exit(1 if probs or dup else 0)
