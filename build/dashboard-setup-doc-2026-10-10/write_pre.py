# Guarded write of the Preconditions field only (one-time Dashboard setup-Doc job, 10 Oct 2026).
import json,base64,urllib.request,time,sys,os
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
snap={x['id']:x for x in json.load(open('/tmp/cln/dash-live-1010.json'))}
docs={}
for l in open(f'{D}/docs-created.jsonl'):
    d=json.loads(l); docs[d['id']]=d['doc']
LINKS=json.load(open(f'{D}/heading-links.json')) if os.path.exists(f'{D}/heading-links.json') else {}
def ours_before(i,pre):  # the trial write of 10 Oct (per-test Doc link + same list)
    return f'<p><strong><a href="https://docs.google.com/document/d/{docs[i]}/edit">Setup (manual QA tester and Claude session)</a></strong></p><p></p>'+pre if i in docs else None
log=open(f'{D}/write-log.jsonl','a')
for a in sys.argv[1:]:
    i=int(a); cur=call(f'get_case/{i}'); time.sleep(0.8)
    def rec(s,**k): log.write(json.dumps({'id':i,'result':s,**k})+'\n'); print(i,s,k,flush=True)
    if cur['created_by']!=3: rec('SKIP not ours'); continue
    pre=json.load(open(f'{D}/pre/C{i}.json'))['pre_body']
    if cur['updated_on']!=snap[i]['updated_on'] and not (cur['updated_by']==3 and cur['custom_preconds']==ours_before(i,pre)):
        rec('SKIP changed since snapshot',by=cur['updated_by']); continue
    if cur['custom_atmstatus']==3 or cur['custom_automation_type']==1: rec('SKIP automated/e2e'); continue
    link=LINKS[str(i)]
    new=f'<p><strong><a href="{link}">Setup (manual QA tester and Claude session)</a></strong></p><p></p>'+pre
    r=call(f'update_case/{i}',{'custom_preconds':new}); time.sleep(1.0)
    ok=r['custom_preconds']==new and all(r[f]==cur[f] for f in ('custom_steps','custom_expected','title','custom_atmstatus','custom_automation_type'))
    rec('OK' if ok else 'MISMATCH')
