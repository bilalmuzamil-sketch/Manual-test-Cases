import json,subprocess,sys
cj=json.load(open('/tmp/atlassian/cookies.json'))
items = cj if isinstance(cj,list) else cj.get('cookies',[])
ck='; '.join(f"{c['name']}={c['value']}" for c in items)
def page(pid, ver, out):
    url=f'https://shopview.atlassian.net/wiki/rest/api/content/{pid}?status=historical&version={ver}&expand=version,body.storage'
    r=subprocess.run(['curl','-s','-o',out,'-w','%{http_code}','-H',f'Cookie: {ck}','-H','Accept: application/json',url],capture_output=True,text=True)
    return r.stdout.strip()
for pid,ver,tag in [('577634305',15,'SBC15'),('641400833',6,'TU6'),('703660034',9,'WIP9')]:
    out=f'/tmp/conf_{tag}.json'
    code=page(pid,ver,out)
    try:
        d=json.load(open(out)); print(tag,'HTTP',code,'version',d['version']['number'],'bytes',len(d['body']['storage']['value']))
    except Exception as e:
        print(tag,'HTTP',code,'ERR',open(out).read()[:200])
