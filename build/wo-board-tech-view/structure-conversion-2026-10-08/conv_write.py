"""Guarded TestRail write for the structure conversion. Usage: python3 conv_write.py /tmp/cln/conv-out-N.json [only_ids]"""
import json,base64,urllib.request,time,sys,re,os
D='/home/user/Manual-test-Cases/build/wo-board-tech-view/structure-conversion-2026-10-08/'
cr=json.load(open('/tmp/testrail/creds.json')); sec=cr.get('api_key') or cr.get('password')
auth=base64.b64encode(f"{cr['user']}:{sec}".encode()).decode()
H={'Authorization':'Basic '+auth,'Content-Type':'application/json'}
def call(p,data=None):
    for t in range(7):
        try:
            r=urllib.request.Request('https://shopview.testrail.io/index.php?/api/v2/'+p,headers=H,data=(json.dumps(data).encode() if data is not None else None))
            return json.load(urllib.request.urlopen(r,timeout=120))
        except urllib.error.HTTPError as e:
            b=e.read().decode()[:200]
            if e.code in (429,500,502,503) or 'deadlock' in b.lower(): time.sleep(2*2**t); continue
            raise RuntimeError(f'{e.code} {b}')
        except Exception: time.sleep(2*2**t)
    raise RuntimeError('retries')
def split_exp(e):
    m=re.search(r'<p><strong>(What you should see today|Source)',e); return (e[:m.start()],e[m.start():]) if m else (e,'')
out=json.load(open(sys.argv[1])); only=set(sys.argv[2].split(',')) if len(sys.argv)>2 else None
LOG=D+'conversion-log.jsonl'
for k in sorted(out,key=int):
    if only and k not in only: continue
    if os.path.exists(D+f'C{k}-after.json'): continue
    v=out[k]; b=json.load(open(D+f'C{k}-before.json'))
    cur=call(f'get_case/{k}'); time.sleep(0.7)
    if cur['created_by']!=3: rec={'cid':k,'result':'SKIP not ours'}
    elif cur['updated_on']!=b['updated_on']: rec={'cid':k,'result':f"SKIP changed since read (user {cur['updated_by']})"}
    else:
        _,tail=split_exp(b['custom_expected']); newexp=v['expected_head']+tail
        payload={'custom_preconds':v['custom_preconds'],'custom_steps':v['custom_steps'],'custom_expected':newexp}
        r=call(f'update_case/{k}',payload); time.sleep(1.0)
        a=call(f'get_case/{k}'); time.sleep(0.5)
        _,atail=split_exp(a['custom_expected'])
        checks={'fields_written':all(a[f]==payload[f] for f in payload),'source_quotes_stamp_marker_identical':atail==tail,
                'no_square_brackets':not re.search(r'\[[A-Z][A-Za-z-]*-?\d*[A-Z]?\]',a['custom_preconds']+a['custom_steps']+split_exp(a['custom_expected'])[0]),
                'doc_link_first':a['custom_preconds'].startswith('<p><strong><a href="'+v['doc_link'])}
        json.dump(a,open(D+f'C{k}-after.json','w'),indent=1)
        rec={'cid':k,'doc':v['doc_link'],'result':'OK' if all(checks.values()) else 'CHECK FAILED','checks':checks,'moved':v.get('moved',''),'notes':v.get('notes','')}
    open(LOG,'a').write(json.dumps(rec)+'\n'); print(k,rec['result'],flush=True)
