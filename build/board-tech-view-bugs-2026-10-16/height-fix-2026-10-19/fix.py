import json,subprocess,sys,re
COOK='/tmp/atlassian/cookies.txt'; J='https://shopview.atlassian.net'
key,cid,name,h,T=sys.argv[1:6]
body=json.loads(subprocess.run(['curl','-s','-b',COOK,f'{J}/rest/api/2/issue/{key}/comment/{cid}'],capture_output=True,text=True).stdout)['body']
lines=body.split('\n'); idx=[n for n,l in enumerate(lines) if l.startswith('!'+name+'|') and 'height=' not in l]
assert len(idx)==1, idx
lines[idx[0]]=f"_Updated on {T}: the recording's display size was corrected (it was showing squashed); nothing else changed._\n"+lines[idx[0]].replace('width=1280,',f'width=1280,height={h},',1)
assert f'height={h}' in lines[idx[0]]
open(f'/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/height-fix-2026-10-19/{key}-{cid}.txt','w').write('\n'.join(lines))
