import sys,json,re,urllib.request,ssl; sys.path.insert(0,'/tmp/sviu')
ck=json.load(open('/tmp/schedule-viu/cookies.json'))
CTX=ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
HOST=ck['host']; API=ck['api']
op=urllib.request.build_opener(urllib.request.HTTPSHandler(context=CTX))
def admin_login():
    CK0=f"sv_sso_session={ck['sv_sso_session']}; PHPSESSID={ck['PHPSESSID']}; cf_clearance={ck['cf_clearance']}"
    req=urllib.request.Request(f'https://{API}/api/quick-login',data=json.dumps({'key':'admin'}).encode(),
      headers={'Cookie':CK0,'Content-Type':'application/json','Accept':'application/json','User-Agent':'Mozilla/5.0','Origin':f'https://{HOST}','Referer':f'https://{HOST}/'})
    with op.open(req,timeout=90) as r:
        body=json.loads(r.read().decode()); setc=r.headers.get_all('Set-Cookie') or []
    php=None
    for c in setc:
        m=re.match(r'PHPSESSID=([^;]+)',c)
        if m: php=m.group(1)
    CK1=f"sv_sso_session={ck['sv_sso_session']}; PHPSESSID={php}; cf_clearance={ck['cf_clearance']}"
    open('/tmp/sviu/cookie.txt','w').write(CK1)
    json.dump({'phpsessid':php,'user':body,'token':body.get('data',{}).get('token')},open('/tmp/sviu/session.json','w'))
    return php
