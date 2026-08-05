#!/usr/bin/env python3
"""ShopView QA-branch client using the supplied raw cookies. NEVER calls quick-login."""
import json,subprocess,os
CK=json.load(open('/tmp/rs-viu/cookies.json'))
COOKIE="; ".join(f"{k}={v}" for k,v in CK.items() if k!='domain')
APP="https://sv8582.qa.shopview.com"; API="https://sv8582api.qa.shopview.com"
CA="/root/.ccr/ca-bundle.crt"
def raw(url,method="GET",body=None,extra=None,out=None,hdrs=False):
    a=["curl","-s","-D","/tmp/rs-nr/.hdr","-b",COOKIE,"--cacert",CA,"-X",method,
       "-H","Accept: application/json","-H","Content-Type: application/json",
       "-H",f"Origin: {APP}","-H",f"Referer: {APP}/",
       "-H","User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/147.0.0.0 Safari/537.36",
       "-w","\n__HTTP:%{http_code}"]
    if extra:
        for h in extra: a+=["-H",h]
    if body is not None: a+=["--data-binary",json.dumps(body)]
    if out: a+=["-o",out]
    a.append(url)
    r=subprocess.run(a,capture_output=True,text=True)
    o=r.stdout; i=o.rfind("__HTTP:")
    code=int(o[i+7:].strip()) if i>=0 else 0
    txt=o[:i] if i>=0 else o
    H=open('/tmp/rs-nr/.hdr').read() if os.path.exists('/tmp/rs-nr/.hdr') else ''
    return (code,txt,H) if hdrs else (code,txt)
def api(path,method="GET",body=None,extra=None):
    return raw(API+path,method,body,extra)
def j(path,method="GET",body=None,extra=None):
    c,t=api(path,method,body,extra)
    try: return c,json.loads(t)
    except Exception: return c,{"_raw":t[:600]}
