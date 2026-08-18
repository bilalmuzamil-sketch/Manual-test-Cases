import sys,json,datetime,re
sys.path.insert(0,'/tmp'); import tr
import engine
def now(): return datetime.datetime.utcnow().isoformat()+'Z'
def norm_refs(s): return ','.join(p.strip() for p in (s or '').split(','))
MARKER=engine.MARKER

def restamp(cid, live, new_title=None, new_preconds=None, new_steps=None, body_transform=None,
            marker_mode='auto', oplog=None, divergence=None):
    """Rewrite a content-stale case. body_transform(old_body)->new_body operates on the expected BODY
    (text before ---). prov re-stamped to current version+read-date, sentence2 dropped.
    Marker: Rule-69 unless keep_hold (then preserve existing HOLD marker)."""
    e=live.get('custom_expected','') or ''
    rp=engine.report_of(live['section_id'])
    body,prov,marker=engine.split_expected(e)
    nb=body_transform(body) if body_transform else body
    if divergence:
        nb=nb.rstrip()+"\n"+divergence.strip()
    newprov=engine.strip_sentence2(engine.bump_prov(prov,rp))
    # marker policy for a content-edited case:
    #  READY (plain) -> Rule-69 ; EXPECT-FAIL / HOLD -> preserve the existing marker.
    # sentence 2 is always dropped for content edits (build not re-verified).
    if marker_mode=='rule69':
        newmarker=MARKER
    elif marker_mode=='preserve':
        newmarker=marker
    else:  # auto
        if ('EXPECT FAIL' in marker) or marker.startswith('AUTOMATION: HOLD'):
            newmarker=marker
        else:
            newmarker=MARKER
    newexp=nb.rstrip()+"\n\n---\n"+newprov.strip()+"\n\n"+newmarker
    pay={'custom_expected':newexp,'refs':engine.bump_refs(live.get('refs','') or '',rp),
         'custom_preconds': new_preconds if new_preconds is not None else (live.get('custom_preconds') or ''),
         'custom_steps': new_steps if new_steps is not None else (live.get('custom_steps') or '')}
    if new_title is not None: pay['title']=new_title
    return pay

def write_verify(cid, pay, live, oplog):
    def log(m): oplog.write(m+'\n'); oplog.flush(); print(m)
    log(f"INTENT {now()} C{cid} fields={sorted(pay.keys())}")
    st,body=tr.req(f'update_case/{cid}',pay)
    if st!=200: log(f"  FAIL HTTP {st} C{cid} {json.dumps(body)[:200]}"); raise SystemExit(2)
    st2,l2=tr.req(f'get_case/{cid}')
    mism=[]
    for k,v in pay.items():
        a=norm_refs(v) if k=='refs' else v
        b=norm_refs(l2.get(k)) if k=='refs' else l2.get(k)
        if a!=b: mism.append((k,repr(v)[:140],repr(l2.get(k))[:140]))
    untouched=['custom_atmstatus','section_id','type_id']+([] if 'title' in pay else ['title'])
    for k in untouched:
        if live.get(k)!=l2.get(k): mism.append(('UNTOUCHED:'+k,repr(live.get(k)),repr(l2.get(k))))
    if mism:
        for k,a,b in mism: log(f"  MISMATCH {k} intended={a} live={b}")
        log(f"STOP mismatch C{cid}"); raise SystemExit(3)
    log(f"  OK C{cid} verified {sorted(pay.keys())} byte-identical")
