import os, json, base64, urllib.request, time
U=os.environ['TESTRAIL_USER']; K=os.environ['TESTRAIL_KEY']
BASE='https://shopview.testrail.io/index.php?/api/v2/'
AUTH=base64.b64encode(f"{U}:{K}".encode()).decode()
def get(path):
    for attempt in range(5):
        try:
            r=urllib.request.Request(BASE+path, headers={'Authorization':'Basic '+AUTH,'Content-Type':'application/json'})
            with urllib.request.urlopen(r, timeout=120) as resp:
                return json.loads(resp.read().decode())
        except Exception as e:
            if attempt==4: raise
            time.sleep(3*(attempt+1))
def getall(path, key):
    """paginated GET returning list under key"""
    out=[]; offset=0
    while True:
        sep='&' if '?' in path else '&'
        p=f"{path}{sep}limit=250&offset={offset}"
        d=get(p)
        if isinstance(d, list):
            out.extend(d)
            if len(d)<250: break
            offset+=250; continue
        chunk=d.get(key,[])
        out.extend(chunk)
        if d.get('_links',{}).get('next'): offset+=250
        elif len(chunk)<250: break
        else: offset+=250
    return out
