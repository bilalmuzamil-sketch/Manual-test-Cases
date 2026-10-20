import json,base64,urllib.request,sys,subprocess
c=json.load(open('/tmp/testrail/creds.json')); H=c['host'].rstrip('/'); A='Basic '+base64.b64encode(f"{c['email']}:{c['password']}".encode()).decode()
def api(p,body=None):
    rq=urllib.request.Request(f"{H}/index.php?/api/v2/{p}",data=json.dumps(body).encode() if body is not None else None,headers={'Authorization':A,'Content-Type':'application/json'},method='POST' if body is not None else 'GET'); return json.load(urllib.request.urlopen(rq))
def allres(run):
    out=[];off=0
    while True:
        r=api(f'get_results_for_run/{run}&limit=250&offset={off}'); b=r['results'] if isinstance(r,dict) else r; out+=b
        if len(b)<250: break
        off+=250
    return out
TEST=int(sys.argv[1]); tag=sys.argv[2]
t=api(f'get_test/{TEST}'); RUN=t['run_id']
print('test',TEST,'case',t['case_id'],'run',RUN,'status',t['status_id'],'|',t['title'])
if len(sys.argv)<4:
    print('REFS',t.get('refs')); print('EXPECTED:\n',(t.get('custom_expected') or '')[:2500]); sys.exit()
files=sys.argv[4:]
before=allres(RUN); json.dump(before,open(f'{tag}-run{RUN}-before.json','w')); print('results before',len(before))
r=api(f'add_result/{TEST}',{'status_id':1,'comment':open(sys.argv[3]).read()}); rid=r['id']; print('added result',rid,r['status_id'])
for f in files:
    o=subprocess.run(['curl','-s','-u',f"{c['email']}:{c['password']}",'-F',f'attachment=@{f}',f"{H}/index.php?/api/v2/add_attachment_to_result/{rid}"],capture_output=True,text=True).stdout; print('attach',f.split('/')[-1],o[:80])
after=allres(RUN); json.dump(after,open(f'{tag}-run{RUN}-after.json','w'))
bi={x['id']:x for x in before}; ai={x['id']:x for x in after}
miss=[i for i in bi if i not in ai]; ch=[i for i in bi if i in ai and json.dumps(bi[i],sort_keys=True)!=json.dumps(ai[i],sort_keys=True)]; new=[i for i in ai if i not in bi]
print('after',len(after),'missing',len(miss),'changed',len(ch),'new',new,'| test now',api(f'get_test/{TEST}')['status_id'])
