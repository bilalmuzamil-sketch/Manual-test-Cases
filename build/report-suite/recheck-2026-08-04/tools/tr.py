import json, os, base64, urllib.request, urllib.error, time
CREDS=json.load(open('/tmp/testrail/creds.json'))
HOST=CREDS['host'].rstrip('/')
AUTH='Basic '+base64.b64encode(f"{CREDS['email']}:{CREDS.get('password') or CREDS.get('key')}".encode()).decode()
FOREIGN={38919,38920,38921,38922,38923}
VOLATILE={'updated_on','updated_by'}
def api(path, body=None, method=None):
    url=f'{HOST}/index.php?/api/v2/{path}'
    data=json.dumps(body).encode() if body is not None else None
    req=urllib.request.Request(url,data=data,method=method or ('POST' if body else 'GET'),
        headers={'Authorization':AUTH,'Content-Type':'application/json'})
    for a in range(5):
        try:
            with urllib.request.urlopen(req,timeout=120) as r:
                return r.status, json.loads(r.read().decode() or '{}')
        except urllib.error.HTTPError as e:
            t=e.read().decode()
            if e.code in (429,502,503,504) and a<4: time.sleep(2**a*2); continue
            try: return e.code, json.loads(t)
            except Exception: return e.code, {'raw':t[:500]}
        except Exception as e:
            if a<4: time.sleep(3); continue
            return -1, {'transport':str(e)}
def get_cases(suite=1, project=1, section=None):
    out=[]; off=0
    while True:
        p=f'get_cases/{project}&suite_id={suite}&limit=250&offset={off}'
        if section: p+=f'&section_id={section}'
        s,j=api(p)
        if s!=200: raise SystemExit(f'get_cases {s} {j}')
        cs=j.get('cases',j if isinstance(j,list) else [])
        out+=cs
        if len(cs)<250: break
        off+=250
    return out
