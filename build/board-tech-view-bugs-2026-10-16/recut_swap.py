"""Replace a posted film with its idle-cut v2 (Standing Rule 107), dated note, read back.
usage: python3 recut_swap.py KEY commentId old.mp4-name new.mp4-path out.txt "<time>"
"""
import json,subprocess,sys,re
COOK='/tmp/atlassian/cookies.txt'; J='https://shopview.atlassian.net'
key,cid,old,new,out,T=sys.argv[1:7]; newname=new.split('/')[-1]
body=json.loads(subprocess.run(['curl','-s','-b',COOK,f'{J}/rest/api/2/issue/{key}/comment/{cid}'],capture_output=True,text=True).stdout)['body']
lines=body.split('\n'); i=[n for n,l in enumerate(lines) if l.startswith('!'+old+'|')]
assert len(i)==1, i
note=f"_Updated on {T}: replaced with a shorter cut of the same recording (the still pauses were removed; every step and the voice are unchanged)._"
lines[i[0]]=note+'\n'+f'!{newname}|width=1280,height=800,alt="{newname}"!'
open(out,'w').write('\n'.join(lines))
r=json.loads(subprocess.run(['curl','-s','-b',COOK,'-H','X-Atlassian-Token: no-check','-F',f'file=@{new}',f'{J}/rest/api/3/issue/{key}/attachments'],capture_output=True,text=True).stdout)
print('uploaded',[(x['id'],x['filename']) for x in r])
