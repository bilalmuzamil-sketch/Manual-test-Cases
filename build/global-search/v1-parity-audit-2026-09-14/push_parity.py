import json,base64,urllib.request,ssl,time,datetime,sys,re,html
c=json.load(open('/tmp/testrail/creds.json'))
HOST=c['host'].rstrip('/');AUTH=base64.b64encode(f"{c['user']}:{c['login_password'] or c['password']}".encode()).decode()
ctx=ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
def api(path,data=None):
    req=urllib.request.Request(f"{HOST}/index.php?/api/v2/{path}",
      data=json.dumps(data).encode() if data is not None else None,
      headers={'Authorization':'Basic '+AUTH,'Content-Type':'application/json'})
    for a in range(4):
        try: return json.loads(urllib.request.urlopen(req,context=ctx,timeout=60).read())
        except urllib.error.HTTPError as e:
            if a==3: raise RuntimeError(f"HTTP {e.code}: {e.read()[:300]}")
            time.sleep(2**a)
        except Exception:
            if a==3: raise
            time.sleep(2**a)
if '--confirm' not in sys.argv: print("refusing: pass --confirm"); sys.exit(1)
cases=json.load(open('parity-cases.json'))
def strip(s): return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>','',s or ''))).strip()
audit=[]
for c_ in cases:
    body={k:v for k,v in c_.items() if k!='section_id'}
    r=api(f"add_case/{c_['section_id']}",body)
    cid=r['id']
    rb=api(f"get_case/{cid}")
    checks={
      'title': rb['title']==c_['title'],
      'refs': rb.get('refs')==c_['refs'],
      'type_id': rb.get('type_id')==7,
      'priority_id': rb.get('priority_id')==2,
      'atmstatus': rb.get('custom_atmstatus')==1,
      'automation_type': rb.get('custom_automation_type')==0,
      'section': rb.get('section_id')==6769,
      'preconds_content': strip(c_['custom_preconds'])[:120] in strip(rb.get('custom_preconds')),
      'steps_content': strip(c_['custom_steps'])[:120] in strip(rb.get('custom_steps')),
      'expected_has_automation_marker': 'AUTOMATION: Not available on Build to test Yet' in strip(rb.get('custom_expected')),
      'expected_has_po_flag': 'task ticket goes to the Product Owner' in strip(rb.get('custom_expected')),
    }
    ok=all(checks.values())
    audit.append({'case_id':cid,'title':rb['title'],'http':'200 OK','verified':ok,'checks':checks,
                  'url':f"https://shopview.testrail.io/index.php?/cases/view/{cid}"})
    print(("OK  " if ok else "FAIL")+f" C{cid}  {rb['title']}")
    if not ok: print("     failing:",[k for k,v in checks.items() if not v])
ts=datetime.datetime.utcnow().strftime('%Y-%m-%dT%H%M%SZ')
json.dump({'when_utc':ts,'operation':'add_case','section_id':6769,'count':len(audit),
           'all_verified':all(a['verified'] for a in audit),'cases':audit},
          open(f'push-audit-parity-{ts}.json','w'),indent=1)
print(f"\n{len(audit)} created | all_verified={all(a['verified'] for a in audit)} | audit push-audit-parity-{ts}.json")
print("IDS="+",".join(str(a['case_id']) for a in audit))
