import json,csv,content_lib as C,sys
sys.path.insert(0,'/tmp'); import tr
idmap={}
for r in csv.DictReader(open('../testrail-id-map.csv')): idmap[int(r['testrail_case_id'][1:])]=r['internal_id']
inv={v:k for k,v in idmap.items()}
oplog=open('oplog-content.txt','a'); oplog.write("\n=== SBC/SBR COUNT (nine->ten SBC toggleable cols; seven->eight SBR metric cols; Adjustments added) ===\n")
JOBS={
 'SBC-COL-02': {'steps':[('Turn all nine toggles off','Turn all ten toggles off')],
                'body':[('All nine columns can be hidden','All ten columns can be hidden')]},
 'SBC-PERS-05':{'body':[('All nine toggleable columns visible.','All ten toggleable columns visible.')]},
 'SBR-PERS-04':{'body':[('all seven metric columns visible','all eight metric columns visible')]},
}
for iid,spec in JOBS.items():
    cid=inv[iid]; st,fresh=tr.req(f'get_case/{cid}'); assert st==200,st
    ns=fresh.get('custom_steps') or ''
    for a,b in spec.get('steps',[]):
        assert a in ns, f'{iid} steps missing {a!r}'; ns=ns.replace(a,b)
    def bt(body,pairs=spec.get('body',[])):
        for a,b in pairs:
            assert a in body, f'{iid} body missing {a!r}'; body=body.replace(a,b)
        return body
    pay=C.restamp(cid,fresh,new_steps=ns if spec.get('steps') else None,body_transform=bt)
    C.write_verify(cid,pay,fresh,oplog)
oplog.write("=== SBC/SBR COUNT DONE ===\n"); print('SBC/SBR content done')
