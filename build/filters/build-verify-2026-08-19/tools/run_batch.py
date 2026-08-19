import sys,json,re,time
sys.path.insert(0,'build/filters/build-verify-2026-08-19/tools')
from flt_write import (get, post, extract_plain, to_br, words, refresh_build_sentence,
                       set_marker, BUILD, DATE)
OPLOG='build/filters/build-verify-2026-08-19/filters-bv-oplog.jsonl'

def process(cid, action, marker_override=None, edits=None):
    d=get(f"get_case/{cid}")
    pre=extract_plain(d.get('custom_preconds'))
    steps=extract_plain(d.get('custom_steps'))
    exp=extract_plain(d.get('custom_expected'))
    refs=d.get('refs'); title=d.get('title')
    if edits:  # edits: dict field->(old,new) applied to plain
        for f,(o,n) in edits.items():
            if f=='preconds': pre=pre.replace(o,n)
            elif f=='steps': steps=steps.replace(o,n)
            elif f=='expected': exp=exp.replace(o,n)
            elif f=='title': title=title.replace(o,n)
    # marker + build sentence
    exp=refresh_build_sentence(exp)
    if action=='lift':
        exp=set_marker(exp,'AUTOMATION: READY')
    elif action=='marker' and marker_override:
        exp=set_marker(exp,marker_override)
    # build payload
    payload={'custom_preconds':to_br(pre),'custom_steps':to_br(steps),'custom_expected':to_br(exp),'refs':refs,'title':title}
    r=post(f"update_case/{cid}",payload); time.sleep(0.25)
    d2=get(f"get_case/{cid}")
    # verify
    def chk(field,intended):
        stored=d2.get(field) or ''
        return {'words':words(stored)==words(intended),'no_ol':('<ol>' not in stored and '<li>' not in stored)}
    vp=chk('custom_preconds',pre); vs=chk('custom_steps',steps); ve=chk('custom_expected',exp)
    se=d2.get('custom_expected') or ''
    mks=re.findall(r'AUTOMATION:[^<\n]*',se); provc=se.count('This is the expected behaviour')
    ok=all(v['words'] and v['no_ol'] for v in (vp,vs,ve)) and len(mks)==1 and provc==1 and d2.get('refs')==refs
    rec={'cid':cid,'action':action,'marker':(mks[-1].strip() if mks else None),'ok':ok,
         'v':{'pre':vp,'steps':vs,'exp':ve,'markers':len(mks),'prov':provc,'refs':d2.get('refs')==refs}}
    with open(OPLOG,'a') as f: f.write(json.dumps(rec)+'\n')
    return ok,rec

if __name__=='__main__':
    plan=json.loads(sys.argv[1])  # list of [cid, action, marker_override_or_null]
    results=[]
    for item in plan:
        cid=item[0]; action=item[1]; mo=item[2] if len(item)>2 else None
        edits=item[3] if len(item)>3 else None
        if edits: edits={k:tuple(v) for k,v in edits.items()}
        ok,rec=process(cid,action,mo,edits)
        results.append(rec)
        print(f"C{cid} {action} -> ok={ok} marker={rec['marker'][:45] if rec['marker'] else None} v={rec['v']}")
        if not ok:
            print("!! STOP: verification failed on C%s"%cid)
            print(json.dumps(rec,indent=1))
            break
    print("DONE",sum(1 for r in results if r['ok']),"/",len(results),"ok")
