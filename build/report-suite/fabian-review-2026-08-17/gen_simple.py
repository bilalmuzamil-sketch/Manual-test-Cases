import sys,json,re
sys.path.insert(0,'build/report-suite/fabian-review-2026-08-17'); import rslib as R
live=json.load(open('/tmp/live_ours.json'))
SIMPLE=[30152,30162,30221,30226,30230,30231,30236,30287,30291,30306,30309,30481,30495,30512,30513,30525,38894]
def swap(s): return (s or '').replace('Inv. Hrs','Labor Delta').replace('Inv.Hrs','Labor Delta')

def anchors_from_prov(prov):
    m=re.search(r'specification version \d+ \(([^)]*)\)', prov)
    return m.group(1).strip() if m else None
def story_from_refs(refs):
    m=re.match(r'\s*([A-Z]+-\d+(?:;\s*[A-Z]+-\d+)*)', refs or '')
    return m.group(1) if m else 'SV-8582'

out=[]
for cid in SIMPLE:
    c=live[str(cid)]; rep=R.report_of(c['section_id']); name,ver=R.REPORTS[rep]
    e=c['custom_expected']; body,prov,marker=R.split_expected(e)
    anch=anchors_from_prov(prov)
    nbody=swap(body)
    ntitle=swap(c['title']); npre=swap(c.get('custom_preconds','')); nsteps=swap(c.get('custom_steps',''))
    prov_new=f"This is the expected behaviour as per epic SV-8582 and the {name} report specification version {ver} ({anch}), both read on 17 August 2026. The column was renamed from \"Inv. Hrs\" to \"Labor Delta\" per SV-9071; only the name changed."
    nexp=R.assemble(nbody, prov_new)
    story=story_from_refs(c.get('refs',''))
    nrefs=f"{story} ({rep} spec v{ver} 2026-08-17 {anch}; heading renamed to Labor Delta per SV-9071)"
    if len(nrefs)>248:  # trim anchors if needed
        nrefs=f"{story} ({rep} spec v{ver} 2026-08-17; heading renamed to Labor Delta per SV-9071)"
    payload={'title':ntitle,'custom_preconds':npre,'custom_steps':nsteps,'custom_expected':nexp,'refs':nrefs}
    out.append((cid,payload,c))
    if len(nrefs)>248: print('!!! REFS TOO LONG',cid,len(nrefs))
json.dump([(cid,p) for cid,p,_ in out], open('/tmp/simple_payloads.json','w'))
# dry-run print for review
for cid,p,c in out:
    print('='*70,'C'+str(cid),'atm',c.get('custom_atmstatus'))
    print('TITLE:',p['title'])
    print('REFS('+str(len(p['refs']))+'):',p['refs'])
    print('EXPECTED:'); print(p['custom_expected'])
    print()
