import json,base64,urllib.request,time,sys
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
        except Exception:
            time.sleep(2*(2**t))
    raise RuntimeError('retries exhausted')
before=json.load(open('/tmp/cln/ps104-live.json')); new=json.load(open('/tmp/cln/ps-new.json'))
log=[]
for k in sorted(new,key=int):
    cur=call(f'get_case/{k}'); time.sleep(1.0)
    if cur['created_by']==1: log.append((k,'SKIP Vladimir-created')); continue
    if cur['updated_by']==2: log.append((k,'SKIP Nebojsa-edited')); continue
    if cur['updated_on']!=before[k]['updated_on']: log.append((k,f"SKIP changed since snapshot by user {cur['updated_by']}")); continue
    payload={f:new[k][f] for f in ('custom_preconds','custom_steps','custom_expected') if new[k][f]!=before[k][f]}
    r=call(f'update_case/{k}',payload); time.sleep(1.4)
    ok=all(r[f]==payload[f] for f in payload)
    log.append((k,'OK' if ok else 'MISMATCH', sorted(payload)))
    print(k,log[-1][1],flush=True)
json.dump(log,open('/tmp/cln/ps-write-log.json','w'),indent=0)
import collections; print(collections.Counter(x[1] for x in log))
