import sys,json,re,csv
sys.path.insert(0,'/tmp'); import tr
sys.path.insert(0,'..')  # not needed
MARKER="AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026"
CURV={'SBC':20,'SBR':22,'PV':10,'TU':9,'WIP':21,'IV':10}
RNAME={'SBC':'Sales By Customer','SBR':'Sales By Representative','PV':'Parts Velocity','TU':'Technician Utilization','WIP':'Work In Progress','IV':'Inventory Value'}
SEC=json.load(open('/tmp/sec_names.json'))
def report_of(sec):
    n=SEC.get(str(sec),'')
    for k,full in [('WIP','Work In Progress'),('SBC','Sales By Customer'),('SBR','Sales By Representative'),('PV','Parts Velocity'),('TU','Technician Utilization'),('IV','Inventory Value')]:
        if n.startswith(k) or full in n: return k
    raise SystemExit('sec '+str(sec)+' '+n)
def norm_refs(s): return ','.join(p.strip() for p in (s or '').split(','))
def split_expected(e):
    lines=e.split('\n'); sep=None
    for i,ln in enumerate(lines):
        if ln.strip()=='---': sep=i; break
    if sep is None: raise ValueError('no ---')
    mi=None
    for i in range(len(lines)-1,-1,-1):
        if lines[i].startswith('AUTOMATION:'): mi=i; break
    if mi is None: raise ValueError('no marker')
    body='\n'.join(lines[:sep]).rstrip()
    prov='\n'.join(lines[sep+1:mi]).strip()
    marker=lines[mi].strip()
    return body,prov,marker

def bump_prov(prov, rp):
    cur=CURV[rp]; rn=RNAME[rp]
    # split into sentence1(source) and sentence2(build check) by the 'Last checked against build' clause
    # prov may be multi-line
    # 1) bump spec version
    prov2=re.sub(r'(%s report specification version )\d+'%re.escape(rn), r'\g<1>%d'%cur, prov)
    prov2=re.sub(r'(report specification version )\d+', lambda m: m.group(1)+str(cur), prov2)  # fallback
    # 2) bump read-dates that accompany epic + spec (only the source sentence, not build 'on 8/6')
    prov2=re.sub(r'read on \d{1,2} \w+ 202\d', 'read on 17 August 2026', prov2)
    return prov2

def bump_refs(refs, rp):
    cur=CURV[rp]
    r=re.sub(r'spec v\d+ \d{4}-\d{2}-\d{2}', f'spec v{cur} 2026-08-17', refs)
    return r

def strip_sentence2(prov):
    # remove any 'Last checked against build ...' sentence(s)
    # they are separate lines or trailing sentence
    lines=[l for l in prov.split('\n') if not l.strip().startswith('Last checked against build')]
    prov='\n'.join(lines).strip()
    # also inline form: remove ' Last checked against build ... .' if present
    prov=re.sub(r'\s*Last checked against build[^\n]*?\d{4}\.', '', prov).strip()
    return prov

def process(cid, live):
    e=live.get('custom_expected','') or ''
    rp=report_of(live['section_id'])
    body,prov,marker=split_expected(e)
    newprov=bump_prov(prov,rp)
    newrefs=bump_refs(live.get('refs','') or '', rp)
    is_ready = ('EXPECT FAIL' not in marker) and (not marker.startswith('AUTOMATION: HOLD'))
    if is_ready:
        newprov=strip_sentence2(newprov)
        newmarker=MARKER
    else:
        newmarker=marker  # preserve EXPECT-FAIL/HOLD + sentence 2
    newexp=body.rstrip()+"\n\n---\n"+newprov.strip()+"\n\n"+newmarker
    payload={'custom_expected':newexp,'refs':newrefs,
             'custom_preconds':live.get('custom_preconds') or '',
             'custom_steps':live.get('custom_steps') or ''}
    return payload, {'rp':rp,'is_ready':is_ready,'oldmarker':marker,'newmarker':newmarker}

if __name__=='__main__':
    plan=json.load(open('plan.json'))
    live={c['id']:c for c in json.load(open('/tmp/rs_live_cases.json'))}
    # dry-run: one pin case per report
    seen=set()
    for r,items in plan['plan'].items():
        for it in items:
            if it['klass']!='pin' or it['rp'] if False else it['klass']!='pin': continue
        for it in items:
            if it['klass']=='pin' and r not in seen:
                seen.add(r); cid=it['cid']
                pay,meta=process(cid,live[cid])
                print('='*70); print(f"{it['iid']} C{cid} {r} marker->{meta['newmarker'][:50]}")
                print('--- NEW EXPECTED ---'); print(pay['custom_expected'])
                print('--- NEW REFS ---'); print(pay['refs'])
                break
