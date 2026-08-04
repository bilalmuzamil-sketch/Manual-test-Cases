import json,base64,urllib.request,urllib.error,time
C=json.load(open('/tmp/testrail/creds.json'))
S=C.get('password') or C.get('key'); HOST=C['host'].rstrip('/')
AUTH='Basic '+base64.b64encode(f"{C['email']}:{S}".encode()).decode()
def api(path, body=None, method=None):
    url=f'{HOST}/index.php?/api/v2/{path}'
    data=json.dumps(body).encode() if body is not None else None
    req=urllib.request.Request(url,data=data,method=method or ('POST' if data else 'GET'),
        headers={'Authorization':AUTH,'Content-Type':'application/json'})
    for a in range(4):
        try:
            with urllib.request.urlopen(req,timeout=180) as r:
                return r.status,json.loads(r.read().decode() or '{}')
        except urllib.error.HTTPError as e:
            t=e.read().decode()
            if e.code in (429,502,503,504) and a<3: time.sleep(2**a*2); continue
            try: return e.code,json.loads(t)
            except: return e.code,{'error':t}
        except Exception as ex:
            if a<3: time.sleep(2**a*2); continue
            return 0,{'error':str(ex)}
def paged(path, key):
    out=[]; off=0
    while True:
        sep='&' if '?' in path else '?'
        s,b=api(f'{path}{sep}limit=250&offset={off}')
        if s!=200: raise SystemExit(f'{s} {b}')
        chunk=b.get(key,b) if isinstance(b,dict) else b
        out+=chunk
        if isinstance(b,dict) and b.get('_links',{}).get('next'): off+=250
        elif len(chunk)==250: off+=250
        else: break
    return out
