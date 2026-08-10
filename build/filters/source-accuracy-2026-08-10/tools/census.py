import json, re, sys
sys.path.insert(0,'/tmp/testrail'); import tr
from restamp import unmarkup, MARKER_RE, LISTMK
from reqx import flat
from secx import sections
from scope import group
F19=flat('spec/572030978-v19.json'); S27=sections('spec/713031682-v27.json')
LIVE={'Filters':'19','Schedule':'27'}
VERP={'Filters': r'Filters specification at Confluence version (\d+)',
      'Schedule': r'Schedule specification version (\d+)'}
out={}
for root,name in ((4110,'Filters'),(4254,'Schedule')):
    ours=[c for c in group(root) if c['created_by']==3]
    rows=[]; bad={'stale_prov':[], 'stale_refs':[], 'bad_anchor':[], 'no_prov':[],
                  'multi_prov':[], 'multi_marker':[], 'marker_not_last':[], 'no_marker':[],
                  'no_jira':[], 'no_anchor_refs':[], 'refs_long':[]}
    for c in ours:
        st, full = tr.get_case(c['id']); assert st==200
        exp=full.get('custom_expected') or ''; refs=full.get('refs') or ''
        t=unmarkup(exp)
        provs=[l.strip() for l in t.splitlines() if l.strip().startswith('This is the expected behaviour')]
        marks=MARKER_RE.findall(t)
        cid=full['id']
        if len(provs)==0: bad['no_prov'].append(cid)
        if len(provs)>1: bad['multi_prov'].append(cid)
        if len(marks)==0: bad['no_marker'].append(cid)
        if len(marks)>1: bad['multi_marker'].append(cid)
        if marks and not t.rstrip().splitlines()[-1].strip().startswith('AUTOMATION:'):
            bad['marker_not_last'].append(cid)
        pv=re.findall(VERP[name], provs[0] if provs else '')
        if pv and any(v!=LIVE[name] for v in pv): bad['stale_prov'].append(cid)
        rv=re.findall(r'\bspec v(\d+)', refs)
        if rv and any(v!=LIVE[name] for v in rv): bad['stale_refs'].append(cid)
        if name=='Filters':
            anch=set(re.findall(r'S\d+[A-Za-z]?-[A-Z]+\d+[a-z]?', (provs[0] if provs else '')+' '+refs))
            miss=[a for a in anch if a not in F19]
        else:
            anch=set(re.findall(r'§\s*(\d+(?:\.\d+)*)', (provs[0] if provs else '')+' '+refs))
            miss=[a for a in anch if a not in S27]
        if miss: bad['bad_anchor'].append((cid,miss))
        if not re.search(r'SV-\d+', refs): bad['no_jira'].append(cid)
        if not anch: bad['no_anchor_refs'].append(cid)
        for e in refs.split(','):
            if len(e)>248: bad['refs_long'].append(cid)
        rows.append({'cid':cid,'title':full['title'],'prov_ver':pv,'refs_ver':rv,
                     'anchors':sorted(anch),'markup':bool(LISTMK.search(exp)),
                     'marker':marks[0] if marks else '', 'refs':refs,
                     'prov':provs[0] if provs else ''})
    out[name]={'rows':rows,'bad':bad,'n':len(ours)}
    print(f'== {name}: {len(ours)} ours')
    for k,v in bad.items(): print(f'   {k}: {len(v)}' + (f'  {v}' if v and len(v)<12 else ''))
json.dump(out, open('census.json','w'), indent=1)
