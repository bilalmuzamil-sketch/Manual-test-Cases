import json,subprocess
cj=json.load(open('/tmp/atlassian/cookies.json'))
items = cj if isinstance(cj,list) else cj.get('cookies',[])
ck='; '.join(f"{c['name']}={c['value']}" for c in items)
def page(pid, ver, out):
    url=f'https://shopview.atlassian.net/wiki/rest/api/content/{pid}?status=historical&version={ver}&expand=version,body.storage'
    r=subprocess.run(['curl','-s','-o',out,'-w','%{http_code}','-H',f'Cookie: {ck}','-H','Accept: application/json',url],capture_output=True,text=True)
    return r.stdout.strip()
JOBS=[('585629698',v,f'SBR{v}') for v in (15,16,17)] + \
     [('620888066',v,f'PV{v}') for v in (4,5)] + \
     [('720142338',v,f'IV{v}') for v in (3,4)] + \
     [('577634305',16,'SBC16'),('703660034',10,'WIP10')]
for pid,ver,tag in JOBS:
    out=f'/tmp/rs5/conf_{tag}.json'
    code=page(pid,ver,out)
    try:
        d=json.load(open(out)); print(tag,'HTTP',code,'ver',d['version']['number'],'when',d['version']['when'],'bytes',len(d['body']['storage']['value']), '|', (d['version'].get('message') or '')[:90])
    except Exception as e:
        print(tag,'HTTP',code,'ERR',open(out).read()[:200])
