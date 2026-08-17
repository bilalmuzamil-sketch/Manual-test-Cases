"""Report Suite Fabian-review completion — shared transform/verify helpers."""
import sys,json,datetime,re
sys.path.insert(0,'/tmp'); import tr

MARKER="AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026"
REPORTS={
 'SBC':('Sales By Customer',20),'SBR':('Sales By Representative',22),
 'WIP':('Work In Progress',21),'PV':('Parts Velocity',10),
 'TU':('Technician Utilization',9),'IV':('Inventory Value',10),
}
SEC=json.load(open('/tmp/sec_names.json'))
def report_of(sec):
    n=SEC.get(str(sec),'')
    for k in REPORTS:
        if n.startswith(k+' ') or n.startswith(k+' —') or n.startswith(k+'—'): return k
    if 'Work In Progress' in n: return 'WIP'
    if 'Sales By Customer' in n: return 'SBC'
    if 'Sales By Representative' in n: return 'SBR'
    if 'Parts Velocity' in n: return 'PV'
    if 'Technician Utilization' in n: return 'TU'
    if 'Inventory Value' in n: return 'IV'
    raise SystemExit('cannot map section '+str(sec)+' name='+n)

def now(): return datetime.datetime.utcnow().isoformat()+'Z'

def split_expected(e):
    """Return (body, prov, marker_line). body = text before the '---' separator line."""
    lines=e.split('\n')
    # find separator line that is exactly '---'
    sep=None
    for i,ln in enumerate(lines):
        if ln.strip()=='---': sep=i; break
    if sep is None: raise ValueError('no --- separator')
    # marker line
    mi=None
    for i in range(len(lines)-1,-1,-1):
        if lines[i].startswith('AUTOMATION:'): mi=i; break
    if mi is None: raise ValueError('no AUTOMATION marker')
    body='\n'.join(lines[:sep]).rstrip()
    prov='\n'.join(lines[sep+1:mi]).strip()
    marker=lines[mi]
    return body,prov,marker

def build_prov(prov_sentences):
    """prov_sentences: list of full sentences (each already carrying its own read-date)."""
    return ' '.join(s.strip() for s in prov_sentences)

def assemble(body, prov, marker=MARKER):
    return body.rstrip()+"\n\n---\n"+prov.strip()+"\n\n"+marker

def norm_refs(s): return ','.join(p.strip() for p in (s or '').split(','))

def get_live(cid):
    st,c=tr.req(f'get_case/{cid}')
    if st!=200: raise SystemExit(f'get_case {cid} -> {st}')
    return c

def update_and_verify(cid, payload, log, snapshot):
    """payload has keys among title,custom_preconds,custom_steps,custom_expected,refs.
    snapshot = pre-write live case. Byte-verify changed fields == payload; unchanged fields == snapshot."""
    # ensure all three text fields present
    for k in ('custom_preconds','custom_steps','custom_expected'):
        if k not in payload: payload[k]=snapshot.get(k) or ''
    log(f"INTENT {now()} update_case C{cid} fields={sorted(payload.keys())}")
    st,body=tr.req(f'update_case/{cid}', payload)
    if st!=200:
        log(f"  FAIL HTTP {st} C{cid} -> {json.dumps(body)[:250]}"); log("STOP"); raise SystemExit(2)
    live=get_live(cid)
    mism=[]
    for k,v in payload.items():
        a = norm_refs(v) if k=='refs' else v
        b = norm_refs(live.get(k)) if k=='refs' else live.get(k)
        if a!=b: mism.append((k,v,live.get(k)))
    # untouched fields must equal snapshot
    for k in ['title','custom_preconds','custom_steps','custom_expected','refs','custom_atmstatus','section_id','type_id']:
        if k in payload: continue
        if (snapshot.get(k) or '')!=(live.get(k) or '') and snapshot.get(k)!=live.get(k):
            mism.append(('UNTOUCHED:'+k,snapshot.get(k),live.get(k)))
    if mism:
        for k,a,b in mism: log(f"  MISMATCH {k}\n   intended={a!r}\n   live    ={b!r}")
        log(f"STOP: byte mismatch C{cid}"); raise SystemExit(3)
    log(f"  OK C{cid} HTTP 200 verified {sorted(payload.keys())} byte-identical; untouched fields == snapshot; atm={live.get('custom_atmstatus')}")
    return live
