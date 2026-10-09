import json,base64,urllib.request,time,sys,collections,os
cr=json.load(open('/tmp/testrail/creds.json')); sec=cr.get('api_key') or cr.get('password')
auth=base64.b64encode(f"{cr['user']}:{sec}".encode()).decode()
H={'Authorization':'Basic '+auth,'Content-Type':'application/json'}
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
snap=json.load(open('/tmp/cln/dash86-live.json'))
src=sys.argv[1]; tag=sys.argv[2]; only=set(sys.argv[3].split(',')) if len(sys.argv)>3 and sys.argv[3] else None
new=json.load(open(src)); log=[]; before={}
for k in sorted(new,key=int):
    if only and k not in only: continue
    cur=call(f'get_case/{k}'); time.sleep(0.9)
    if cur['created_by']==1: log.append((k,'SKIP Vladimir')); continue
    # QA lead 2026-10-09: YES to rewrite these 7 last edited by Nebojsa (user 2)
    if cur['updated_on']!=snap[k]['updated_on']: log.append((k,f"SKIP changed since snapshot by user {cur['updated_by']}")); continue
    payload={f:new[k][f] for f in ('custom_preconds','custom_steps','custom_expected') if f in new[k] and new[k][f]!=cur.get(f)}
    if not payload: log.append((k,'NOCHANGE')); continue
    before[k]=cur
    r=call(f'update_case/{k}',payload); time.sleep(1.2)
    log.append((k,'OK' if all(r[f]==payload[f] for f in payload) else 'MISMATCH',sorted(payload)))
    print(k,log[-1][1],flush=True)
json.dump(before,open(f'/tmp/cln/{tag}-before.json','w')); json.dump(log,open(f'/tmp/cln/{tag}-log.json','w'),indent=0)
print(collections.Counter(x[1] for x in log))
