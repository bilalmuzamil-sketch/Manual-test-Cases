import json, os, base64, urllib.request, urllib.error, time
C=json.load(open('/tmp/testrail/creds.json'))
BASE=f"https://{C['host'].replace('https://','').replace('http://','').rstrip('/')}/index.php?/api/v2" if not C['host'].startswith('http') else C['host'].rstrip('/')+"/index.php?/api/v2"
AUTH=base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
def call(path, data=None, tries=4):
    url=f"{BASE}/{path}"
    body=json.dumps(data).encode() if data is not None else None
    for t in range(tries):
        req=urllib.request.Request(url, data=body, method='POST' if data is not None else 'GET')
        req.add_header('Authorization', 'Basic '+AUTH)
        req.add_header('Content-Type','application/json')
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                return r.status, json.loads(r.read().decode() or 'null')
        except urllib.error.HTTPError as e:
            txt=e.read().decode()[:300]
            if e.code==429 or e.code>=500:
                time.sleep(2*(t+1)); continue
            return e.code, txt
        except Exception as e:
            time.sleep(2*(t+1))
            if t==tries-1: return 0, str(e)
    return 0,'retries exhausted'
