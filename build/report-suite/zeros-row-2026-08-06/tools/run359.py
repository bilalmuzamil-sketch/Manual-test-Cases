import json, base64, urllib.request, time, sys
CRED = json.load(open('/tmp/testrail/creds.json'))
HOST = CRED['host'].rstrip('/')
if not HOST.startswith('http'): HOST='https://'+HOST
AUTH = base64.b64encode(('%s:%s'%(CRED.get('user') or CRED.get('email'),CRED['password'])).encode()).decode()
def api(uri):
    req=urllib.request.Request('%s/index.php?/api/v2/%s'%(HOST,uri),
        headers={'Authorization':'Basic '+AUTH,'Content-Type':'application/json'})
    for a in range(4):
        try:
            r=urllib.request.urlopen(req,timeout=120); return r.status, json.load(r)
        except urllib.error.HTTPError as e: return e.code, e.read().decode(errors='replace')[:400]
        except Exception:
            if a==3: raise
            time.sleep(2*(a+1))
def paged(uri, key):
    out=[]; off=0
    while True:
        st,d=api('%s&offset=%d&limit=250'%(uri,off))
        assert st==200,(st,d)
        chunk = d[key] if isinstance(d,dict) else d
        out+=chunk
        if len(chunk)<250: break
        off+=250
    return out
if __name__=='__main__':
    tag=sys.argv[1]
    st,run=api('get_run/359'); assert st==200
    tests=paged('get_tests/359','tests')
    res=paged('get_results_for_run/359','results')
    snap={'include_all':run.get('include_all'),
          'counts':{k:run.get(k) for k in ('passed_count','failed_count','blocked_count','untested_count','retest_count')},
          'n_tests':len(tests),'n_results':len(res),
          'test_ids':sorted(t['id'] for t in tests),
          'case_ids':sorted(t['case_id'] for t in tests),
          'results':{str(r['id']):{k:r.get(k) for k in
                     ('test_id','status_id','comment','created_by','created_on','defects','elapsed','version','case_title','case_refs')}
                     for r in res}}
    json.dump(snap,open('/tmp/c30114/run359-%s.json'%tag,'w'),indent=1)
    print('run359 %s: include_all=%s tests=%d results=%d counts=%s'%(tag,snap['include_all'],snap['n_tests'],snap['n_results'],snap['counts']))
