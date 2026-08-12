import json,os,base64,urllib.request,urllib.error,time
C=json.load(open('/tmp/testrail/creds.json'))
HOST=C['host'].rstrip('/'); AUTH=base64.b64encode((C['email']+':'+C.get('password') or C.get('key')).encode()).decode()
def call(path,payload=None,retries=3):
    url=f"{HOST}/index.php?/api/v2/{path}"
    data=json.dumps(payload).encode() if payload is not None else None
    req=urllib.request.Request(url,data=data,headers={'Authorization':'Basic '+AUTH,'Content-Type':'application/json'})
    for a in range(retries):
        try:
            with urllib.request.urlopen(req,timeout=120) as r: return r.status,json.loads(r.read().decode() or 'null')
        except urllib.error.HTTPError as e:
            b=e.read().decode()[:300]
            if e.code==429 and a<retries-1: time.sleep(5); continue
            return e.code,b
        except Exception as e:
            if a<retries-1: time.sleep(4); continue
            return -1,str(e)
def get_case(cid): return call(f'get_case/{cid}')
