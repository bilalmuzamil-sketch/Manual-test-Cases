# staging API helper. Secrets read from /tmp/staging only; never printed.
import json, subprocess, sys
API='https://api.staging.shopview.com'
CK=open('/tmp/staging/cookie-header.txt').read().strip()
if CK.lower().startswith('cookie:'): CK=CK.split(':',1)[1].strip()
def req(method, path, body=None, raw=False):
    cmd=['curl','-g','-s','-m','90','-X',method,'-H','Cookie: '+CK,'-H','Accept: application/json','-H','Origin: https://app.staging.shopview.com','-H','Referer: https://app.staging.shopview.com/','-w','\n%{http_code}']
    if body is not None: cmd+=['-H','Content-Type: application/json','--data-binary',json.dumps(body)]
    out=subprocess.run(cmd+[API+path],capture_output=True,text=True).stdout
    txt,code=out.rsplit('\n',1)
    if raw: return int(code),txt
    try: return int(code),json.loads(txt)
    except Exception: return int(code),txt[:300]
