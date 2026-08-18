import json,csv,content_lib as C,engine,sys,datetime
sys.path.insert(0,'/tmp'); import tr
def now(): return datetime.datetime.utcnow().isoformat()+'Z'
def norm_refs(s): return ','.join(p.strip() for p in (s or '').split(','))
idmap={}
for r in csv.DictReader(open('../testrail-id-map.csv')): idmap[int(r['testrail_case_id'][1:])]=r['internal_id']
inv={v:k for k,v in idmap.items()}
oplog=open('oplog-content.txt','a'); oplog.write("\n=== TU Total-Hours link scope-gate (SV-9064, S6-R1/R5/R6) ===\n")
def log(m): oplog.write(m+'\n'); oplog.flush(); print(m)

# --- pin-only (no content change): route through engine.process ---
for iid in ['TU-LINK-02','TU-LINK-03','TU-LINK-04','TU-NAV-06','TU-VIS-02']:
    cid=inv[iid]; st,fresh=tr.req(f'get_case/{cid}'); assert st==200
    pay,meta=engine.process(cid,fresh)
    for k in ('custom_preconds','custom_steps','custom_expected'): pay.setdefault(k,fresh.get(k) or '')
    st,b=tr.req(f'update_case/{cid}',pay); assert st==200,(cid,st,b)
    st2,l2=tr.req(f'get_case/{cid}')
    for k,v in pay.items():
        a=norm_refs(v) if k=='refs' else v; bb=norm_refs(l2.get(k)) if k=='refs' else l2.get(k)
        assert a==bb, f'MISMATCH {iid} {k}'
    assert fresh.get('title')==l2.get('title') and fresh.get('custom_atmstatus')==l2.get('custom_atmstatus')
    log(f"  OK(pin) C{cid} {iid} marker='{meta['newmarker'][:40]}'")

# --- content rewrites (scope gate) ---
GATE_DIV=("Note for the tester: an earlier version of this report showed Total Hours as a link in every scope. "
          "The current Technician Utilization report specification (version 9, S6-R1/S6-R6, per SV-9064) makes it a link "
          "ONLY in the default view where the location scope is your active shop; in any other scope it is plain text. Follow the current specification.")
# TU-LINK-01
cid=inv['TU-LINK-01']; st,f=tr.req(f'get_case/{cid}'); assert st==200
def t01(b):
    old="1. Every technician row's Total Hours is rendered as a link (every rendered row has clocked time > 0, so the link always applies)."
    new=("1. A technician row's Total Hours is rendered as a link ONLY when the report's location scope is exactly your active shop (the default view). "
         "Under any other scope — a different single location, or multiple locations — the value renders as plain text, styled like the other hour columns (no link).")
    assert old in b; return b.replace(old,new)
C.write_verify(cid,C.restamp(cid,f,body_transform=t01,divergence=GATE_DIV),f,oplog)
# TU-LINK-05
cid=inv['TU-LINK-05']; st,f=tr.req(f'get_case/{cid}'); assert st==200
def t05(b):
    new=("1. Total Hours is a link ONLY in the default view where the location scope is your active shop; under that scope the drill-through reconciles to the cent.\n"
         "2. In any other scope — a single location that is not your active shop, or multiple locations — Total Hours is plain text, not a link, so there is no drill-through and no reconciliation mismatch to worry about.\n"
         "3. This resolves the earlier \"reconciliation exception (b)\": because the link no longer appears outside the active-shop scope, the mismatch it described can no longer occur (per SV-9064).")
    return new
C.write_verify(cid,C.restamp(cid,f,body_transform=t05,divergence=GATE_DIV),f,oplog)
# TU-LINK-06
cid=inv['TU-LINK-06']; st,f=tr.req(f'get_case/{cid}'); assert st==200
def t06(b):
    add=("\n3. This day-row link appears only under the default active-shop scope (the same scope gate as the technician row, per SV-9064); "
         "under any other scope the day row's Total Hours is plain text, not a link.")
    return b.rstrip()+add
C.write_verify(cid,C.restamp(cid,f,body_transform=t06,divergence=GATE_DIV),f,oplog)
oplog.write("=== TU DONE ===\n"); print('TU done')
