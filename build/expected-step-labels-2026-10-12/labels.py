# One-time job (QA lead, 12 Oct 2026): "under the expected result you must mention the Step - N to tell this is the
# expected result of which Step you followed" — for C368136, C96960 and the 70 Dashboard tests.
# Adds ONLY a plain "Step N: " / "Steps 3, 5 and 7: " in front of each bullet of the Expected results list; the
# expected wording, the source block, the stamp and the AUTOMATION marker stay byte-identical. Not a rule.
import json,base64,urllib.request,time,sys,os,re
D=os.path.dirname(os.path.abspath(__file__))
cr=json.load(open('/tmp/testrail/creds.json')); sec=cr.get('api_key') or cr.get('password')
H={'Authorization':'Basic '+base64.b64encode(f"{cr['user']}:{sec}".encode()).decode(),'Content-Type':'application/json'}
def call(p,data=None):
    for t in range(7):
        try:
            r=urllib.request.Request(f'https://shopview.testrail.io/index.php?/api/v2/{p}',headers=H,data=(json.dumps(data).encode() if data is not None else None))
            return json.load(urllib.request.urlopen(r,timeout=120))
        except urllib.error.HTTPError as e:
            body=e.read().decode()[:200]
            if e.code in (429,500,502,503) or 'deadlock' in body.lower(): time.sleep(2*(2**t)); continue
            raise RuntimeError(f'{e.code} {body}')
        except Exception: time.sleep(2*(2**t))
    raise RuntimeError('retries exhausted')
HEAD='<p><strong>Expected results</strong></p><ul>'
def label_text(steps):
    if steps is None: return ''          # bullet already names its step in its own words: left as is
    if isinstance(steps,str):            # a range such as "2-10"
        a,b=steps.split('-'); return f'Steps {a} to {b}: '
    s=[str(x) for x in steps]
    return f'Step {s[0]}: ' if len(s)==1 else 'Steps '+', '.join(s[:-1])+' and '+s[-1]+': '
def apply(exp,labels):
    assert exp.startswith(HEAD); end=exp.index('</ul>',len(HEAD)); inner=exp[len(HEAD):end]
    items=inner.split('<li>')[1:]; assert len(items)==len(labels),(len(items),len(labels))
    new=''.join('<li>'+label_text(l)+it for l,it in zip(labels,items))
    return HEAD+new+exp[end:]
def strip(exp,labels):  # exact inverse: removes only the labels this job added
    for l in labels:
        t=label_text(l)
        if t: assert '<li>'+t in exp; exp=exp.replace('<li>'+t,'<li>',1)
    return exp
if __name__=='__main__':
    write='--write' in sys.argv; ids=[a for a in sys.argv[1:] if a!='--write']
    log=open(f'{D}/write-log.jsonl','a')
    for a in ids:
        i=int(a); m=json.load(open(f'{D}/map/C{i}.json'))
        cur=call(f'get_case/{i}'); time.sleep(0.8)
        def rec(s,**k): log.write(json.dumps({'id':i,'result':s,**k})+'\n'); print(i,s,k,flush=True)
        if cur['created_by']!=3 or cur['updated_by'] not in (3,): rec('SKIP author/last editor',created=cur['created_by'],upd=cur['updated_by']); continue
        if cur['custom_atmstatus']==3 or cur['custom_automation_type']==1: rec('SKIP automated/e2e'); continue
        if os.path.exists(f'{D}/before/C{i}-before.json') and write and cur['custom_expected']!=json.load(open(f'{D}/before/C{i}-before.json'))['custom_expected']:
            rec('SKIP expected changed since preview'); continue
        new=apply(cur['custom_expected'],m['labels'])
        assert strip(new,m['labels'])==cur['custom_expected']
        json.dump(cur,open(f'{D}/before/C{i}-before.json','w'),indent=1)
        if not write: open(f'{D}/map/C{i}.preview.html','w').write(new); rec('PREVIEW'); continue
        r=call(f'update_case/{i}',{'custom_expected':new}); time.sleep(1.0)
        ok=r['custom_expected']==new and strip(r['custom_expected'],m['labels'])==cur['custom_expected'] and all(r[f]==cur[f] for f in ('custom_steps','custom_preconds','title','custom_atmstatus','custom_automation_type'))
        rec('OK' if ok else 'MISMATCH')
