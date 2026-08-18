import sys,json,datetime
sys.path.insert(0,'/tmp'); import tr
import engine
def now(): return datetime.datetime.utcnow().isoformat()+'Z'
def norm_refs(s): return ','.join(p.strip() for p in (s or '').split(','))
wl=json.load(open('worklists.json'))['pin']
start=int(sys.argv[1]); end=int(sys.argv[2])
batch=wl[start:end]
oplog=open('oplog-pin.txt','a')
def log(m): oplog.write(m+'\n'); oplog.flush(); print(m)
log(f"=== PIN BATCH [{start}:{end}] {now()} n={len(batch)} ===")
for cid in batch:
    st,live=tr.req(f'get_case/{cid}')
    if st!=200: log(f"FAIL get_case C{cid} {st}"); raise SystemExit(2)
    pay,meta=engine.process(cid,live)
    # ensure all 3 text fields present
    for k in ('custom_preconds','custom_steps','custom_expected'):
        pay.setdefault(k, live.get(k) or '')
    log(f"INTENT {now()} C{cid} {meta['rp']} marker='{meta['newmarker'][:46]}' fields={sorted(pay.keys())}")
    st,body=tr.req(f'update_case/{cid}',pay)
    if st!=200: log(f"  FAIL HTTP {st} C{cid} {json.dumps(body)[:200]}"); raise SystemExit(2)
    st2,l2=tr.req(f'get_case/{cid}')
    mism=[]
    for k,v in pay.items():
        a=norm_refs(v) if k=='refs' else v
        b=norm_refs(l2.get(k)) if k=='refs' else l2.get(k)
        if a!=b: mism.append((k,repr(v)[:120],repr(l2.get(k))[:120]))
    # untouched: title, custom_atmstatus, section_id, type_id
    for k in ('title','custom_atmstatus','section_id','type_id'):
        if live.get(k)!=l2.get(k): mism.append(('UNTOUCHED:'+k,repr(live.get(k)),repr(l2.get(k))))
    if mism:
        for k,a,b in mism: log(f"  MISMATCH {k} intended={a} live={b}")
        log(f"STOP byte mismatch C{cid}"); raise SystemExit(3)
    log(f"  OK C{cid} HTTP200 verified {sorted(pay.keys())} byte-identical; untouched title/atm/section OK")
log(f"=== BATCH DONE [{start}:{end}] {now()} ===")
