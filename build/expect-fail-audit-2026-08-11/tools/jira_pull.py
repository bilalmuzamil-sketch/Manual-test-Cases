import json, subprocess, sys
tickets=sorted({t for x in json.load(open('ef.json')) for t in x['tickets']})
def jget(path):
    r=subprocess.run(['bash','/tmp/atlassian/jira.sh','GET',path],capture_output=True,text=True,cwd='/tmp/atlassian')
    o=r.stdout
    code=o.rsplit('__HTTP:',1)[1].strip() if '__HTTP:' in o else '?'
    body=o.rsplit('\n__HTTP:',1)[0]
    try: return code, json.loads(body)
    except Exception: return code, body
out={}
for k in tickets:
    c,b=jget(f"/rest/api/3/issue/{k}?fields=summary,status,resolution,resolutiondate,issuetype,priority,parent,updated,created,reporter,description,comment&expand=renderedFields")
    out[k]={'http':c,'data':b}
    f=b.get('fields',{}) if isinstance(b,dict) else {}
    st=(f.get('status') or {}).get('name'); rs=(f.get('resolution') or {}).get('name')
    print(f"{k}  HTTP {c}  status={st}  resolution={rs}  type={(f.get('issuetype') or {}).get('name')}  :: {f.get('summary')}")
json.dump(out,open('jira.json','w'),indent=1)
