import json, subprocess, os
cj=json.load(open('/tmp/atlassian/cookies.json'))
items = cj if isinstance(cj,list) else cj.get('cookies',[])
CK='; '.join(f"{c['name']}={c['value']}" for c in items if 'atlassian' in (c.get('domain') or '')) or '; '.join(f"{c['name']}={c['value']}" for c in items)
def fetch(pid, version=None, out=None):
    url=f'https://shopview.atlassian.net/wiki/rest/api/content/{pid}?expand=version,body.storage'
    if version: url+=f'&status=historical&version={version}'
    out = out or f'/tmp/sa10/spec/{pid}-v{version or "live"}.json'
    os.makedirs(os.path.dirname(out), exist_ok=True)
    r=subprocess.run(['curl','-s','-o',out,'-w','%{http_code}','-H',f'Cookie: {CK}','-H','Accept: application/json',url],capture_output=True,text=True)
    code=r.stdout.strip()
    try:
        d=json.load(open(out)); return code, d
    except Exception: return code, None
if __name__=='__main__':
    import sys
    FILTERS='572030978'; SCHED='713031682'
    for pid,vs in ((FILTERS,[18,19]), (SCHED,[23,24,25,26,27])):
        for v in vs:
            code,d = fetch(pid, v)
            ver = d and d.get('version',{}).get('number')
            when = d and d.get('version',{}).get('when')
            body = d and d.get('body',{}).get('storage',{}).get('value','')
            print(pid, 'req v', v, 'HTTP', code, '-> got version', ver, when, 'bytes', len(body or ''))
