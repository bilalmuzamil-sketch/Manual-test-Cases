import json,urllib.request,ssl,urllib.error
ck=json.load(open('/tmp/schedule-viu/cookies.json'))
CK=open('/tmp/sviu/cookie.txt').read().strip()
CTX=ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
API=ck['api']; HOST=ck['host']
def call(path, body=None, api=True, method=None, extra=None):
    base = API if api else HOST
    url=f'https://{base}{path}'
    data=json.dumps(body).encode() if body is not None else None
    h={'Cookie':CK,'User-Agent':'Mozilla/5.0','Content-Type':'application/json','Accept':'application/json',
       'Origin':f'https://{HOST}','Referer':f'https://{HOST}/'}
    if extra: h.update(extra)
    req=urllib.request.Request(url,data=data,method=method or ('POST' if data else 'GET'),headers=h)
    try:
        with urllib.request.urlopen(req,timeout=90,context=CTX) as r:
            t=r.read().decode()
            try: return r.status,json.loads(t)
            except: return r.status,t[:600]
    except urllib.error.HTTPError as e:
        t=e.read().decode()
        try: return e.code,json.loads(t)
        except: return e.code,t[:600]
    except Exception as e:
        return 0,str(e)
