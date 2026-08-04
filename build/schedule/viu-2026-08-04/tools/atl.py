import json,urllib.request,urllib.error,ssl,http.cookiejar
CTX=ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
raw=json.load(open('/tmp/atlassian/cookies.json'))
items = raw if isinstance(raw,list) else [{'name':k,'value':v} for k,v in raw.items()]
CK='; '.join(f"{c['name']}={c['value']}" for c in items if c.get('name') in
   ('cloud.session.token','tenant.session.token','atlassian.xsrf.token','ajs_anonymous_id'))
BASE='https://shopview.atlassian.net'
def call(path, body=None, method=None, base=BASE, raw_out=False):
    url=base+path
    data=json.dumps(body).encode() if body is not None else None
    h={'Cookie':CK,'Content-Type':'application/json','Accept':'application/json',
       'Origin':BASE,'Referer':BASE+'/','User-Agent':'Mozilla/5.0','X-Atlassian-Token':'no-check'}
    req=urllib.request.Request(url,data=data,method=method or ('POST' if data else 'GET'),headers=h)
    try:
        with urllib.request.urlopen(req,timeout=120,context=CTX) as r:
            t=r.read().decode()
            if raw_out: return r.status,t
            try: return r.status,json.loads(t)
            except: return r.status,t[:800]
    except urllib.error.HTTPError as e:
        t=e.read().decode()
        try: return e.code,json.loads(t)
        except: return e.code,t[:800]
    except Exception as e: return 0,str(e)
