import json,base64,urllib.request,sys,time
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
RUN=498; TEST=4054408
t=api(f'get_test/{TEST}'); print('test',t['id'],t['case_id'],t['title'][:80],'status',t['status_id'],'run',t['run_id'])
before=allres(RUN); json.dump(before,open('testrail/run498-results-before.json','w')); print('results before',len(before))
if len(sys.argv)>1 and sys.argv[1]=='write':
    cm=open('testrail/result-comment.txt').read()
    r=api(f'add_result/{TEST}',{'status_id':1,'comment':cm}); print('added result',r['id'],r['status_id'])
    rid=r['id']
    import subprocess
    out=subprocess.run(['curl','-s','-u',f"{c['email']}:{c['password']}",'-H','Content-Type: multipart/form-data','-F','attachment=@sv11422-01-first-tab-before-after.png',f"{H}/index.php?/api/v2/add_attachment_to_result/{rid}"],capture_output=True,text=True).stdout; print('attach',out[:200])
    after=allres(RUN); json.dump(after,open('testrail/run498-results-after.json','w'))
    bi={x['id']:x for x in before}; ai={x['id']:x for x in after}
    missing=[i for i in bi if i not in ai]; changed=[i for i in bi if i in ai and json.dumps(bi[i],sort_keys=True)!=json.dumps(ai[i],sort_keys=True)]; new=[i for i in ai if i not in bi]
    print('after',len(after),'missing',len(missing),'changed',len(changed),'new',new)
    print('test now',api(f'get_test/{TEST}')['status_id'])
