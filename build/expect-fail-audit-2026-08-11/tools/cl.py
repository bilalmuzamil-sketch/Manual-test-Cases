import json, subprocess
def jget(path):
    r=subprocess.run(['bash','/tmp/atlassian/jira.sh','GET',path],capture_output=True,text=True,cwd='/tmp/atlassian')
    o=r.stdout; body=o.rsplit('\n__HTTP:',1)[0]
    try: return json.loads(body)
    except Exception: return {}
ks=['SV-8826','SV-8863','SV-8871','SV-8873','SV-8883','SV-8913']
out={}
for k in ks:
    b=jget(f"/rest/api/3/issue/{k}/changelog")
    out[k]=b
    print(f"=== {k} ===")
    for h in b.get('values',[]):
        for it in h.get('items',[]):
            if it['field'] in ('status','resolution'):
                print(f"  {h['created'][:19]}  {h['author']['displayName'][:22]:22s} {it['field']}: {it.get('fromString')} -> {it.get('toString')}")
json.dump(out,open('changelogs.json','w'),indent=1)
