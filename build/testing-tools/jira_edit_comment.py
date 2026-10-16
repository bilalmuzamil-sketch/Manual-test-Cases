"""Update a posted Jira QA comment in place from its wiki-markup file and read it back (Rule 100: the file must already carry the dated edit note).
usage: python3 jira_edit_comment.py <KEY> <commentId> <comment.txt>"""
import json,subprocess,sys
key,cid,path=sys.argv[1:4]; C='/tmp/atlassian/cookies.txt'; J='https://shopview.atlassian.net'
json.dump({'body':open(path).read()},open('/tmp/_e.json','w'))
r=subprocess.run(['curl','-s','-b',C,'-H','Content-Type: application/json','-H','X-Atlassian-Token: no-check','-X','PUT',f'{J}/rest/api/2/issue/{key}/comment/{cid}','--data','@/tmp/_e.json'],capture_output=True,text=True).stdout
print('updated',json.loads(r).get('updated'))
b=json.loads(subprocess.run(['curl','-s','-b',C,f'{J}/rest/api/3/issue/{key}/comment/{cid}'],capture_output=True,text=True).stdout)['body']
s=json.dumps(b); print('media',s.count('"type": "media"'),'PASSED' in json.dumps(b['content'][0]),'note','Updated on' in s)
