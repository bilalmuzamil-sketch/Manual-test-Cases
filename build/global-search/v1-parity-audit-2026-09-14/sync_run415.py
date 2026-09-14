import json,base64,urllib.request,ssl,time,datetime,sys
c=json.load(open('/tmp/testrail/creds.json'))
HOST=c['host'].rstrip('/');A=base64.b64encode(f"{c['user']}:{c['login_password'] or c['password']}".encode()).decode()
ctx=ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
H={'Authorization':'Basic '+A,'Content-Type':'application/json'}
def api(p,d=None):
    r=urllib.request.Request(f"{HOST}/index.php?/api/v2/{p}",data=json.dumps(d).encode() if d is not None else None,headers=H)
    for a in range(4):
        try: return json.loads(urllib.request.urlopen(r,context=ctx,timeout=60).read())
        except urllib.error.HTTPError as e:
            if a==3: raise RuntimeError(f"HTTP {e.code}: {e.read()[:300]}")
            time.sleep(2**a)
def tests(run):
    out=[];off=0
    while True:
        r=api(f"get_tests/{run}&limit=250&offset={off}")
        t=r['tests'] if isinstance(r,dict) else r
        out+=t
        if len(t)<250: break
        off+=250
    return out
RUN=415; NEW=[55658,55659,55660,55661,55662,55663,55664,55665]
before=tests(RUN); bids=sorted({t['case_id'] for t in before})
print(f"run {RUN} BEFORE: {len(before)} tests / {len(bids)} distinct case_ids")
union=sorted(set(bids)|set(NEW))
print(f"adding {len(set(NEW)-set(bids))} new -> union {len(union)}")
assert set(bids).issubset(set(union)), "UNION VIOLATED - refusing"
if '--confirm' not in sys.argv: print("DRY RUN. pass --confirm"); sys.exit(0)
api(f"update_run/{RUN}",{'include_all':False,'case_ids':union})
after=tests(RUN); aids=sorted({t['case_id'] for t in after})
lost=sorted(set(bids)-set(aids)); added=sorted(set(aids)-set(bids))
print(f"run {RUN} AFTER : {len(after)} tests / {len(aids)} distinct case_ids")
print(f"LOST (must be 0): {len(lost)} {lost}")
print(f"ADDED: {added}")
ts=datetime.datetime.utcnow().strftime('%Y-%m-%dT%H%M%SZ')
json.dump({'when_utc':ts,'run_id':RUN,'mode':'union-only','before_tests':len(before),'after_tests':len(after),
 'before_cases':len(bids),'after_cases':len(aids),'added':added,'lost':lost,'ok':not lost and set(NEW)<=set(aids)},
 open(f'run-sync-parity-{ts}.json','w'),indent=1)
print("OK" if (not lost and set(NEW)<=set(aids)) else "PROBLEM")
