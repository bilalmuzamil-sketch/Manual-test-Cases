import json,subprocess,sys,re
from PIL import Image
COOK='/tmp/atlassian/cookies.txt'; J='https://shopview.atlassian.net'; T=sys.argv[1]
JOBS=[('SV-11405','78951','sv11405-01-card-pill',True,'Board View is not on Production, and this ticket has no screenshot'),
 ('SV-11402','78920','sv11402-01-header-drag',True,'Tech View is not on Production, and this ticket has no screenshot'),
 ('SV-11406','78922','sv11406-01-held-header-push',True,'Tech View is not on Production, and this ticket has no screenshot'),
 ('SV-11407','78932','sv11407-01-back-top-item',True,'these views are not on Production, and this ticket has no screenshot'),
 ('SV-11409','78924','sv11409-01-avatar-names',True,'these views are not on Production, and this ticket has no screenshot'),
 ('SV-11408','78923','sv11408-01-first-run',False,None),
 ('SV-11422','78952','sv11422-01-first-tab',False,None)]
for key,cid,old,nobefore,why in JOBS:
    body=json.loads(subprocess.run(['curl','-s','-b',COOK,f'{J}/rest/api/2/issue/{key}/comment/{cid}'],capture_output=True,text=True).stdout)['body']
    m=re.search(r'!'+re.escape(old)+r'\.png\|width=(\d+),height=(\d+)!',body); assert m,(key,old)
    w=int(m.group(1)); new=old+'-v2.png'; im=Image.open(new); h=round(im.height*w/im.width)
    body=body.replace(m.group(0),f'!{new}|width={w},height={h}!')
    if nobefore:
        assert '*Before and after*' in body
        body=body.replace('*Before and after*',f'*What it looks like now (after the fix)*\n_Updated on {T}: this section was titled "Before and after", but the picture shows only the fixed build. There is no before picture: {why}. The picture now says this at the top._',1)
    else:
        body=body.replace('*Before and after*',f'*Before and after*\n_Updated on {T}: the picture now says which part is BEFORE the fix and which is AFTER._',1)
    open(f'{key}-{cid}.txt','w').write(body)
    r=json.loads(subprocess.run(['curl','-s','-b',COOK,'-H','X-Atlassian-Token: no-check','-F',f'file=@{new}',f'{J}/rest/api/3/issue/{key}/attachments'],capture_output=True,text=True).stdout)
    e=subprocess.run(['python3','/home/user/Manual-test-Cases/build/testing-tools/jira_edit_comment.py',key,cid,f'{key}-{cid}.txt'],capture_output=True,text=True).stdout.strip().split('\n')[-1]
    print(key,cid,'uploaded',r[0]['id'],new,w,h,'|',e)
