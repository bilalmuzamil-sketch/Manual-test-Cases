"""Check the saved artifact page: its embedded design record (appifact-doc) holds exactly the package files, md5-identical;
its editor runtime (appifact-app) is compared with this morning's; README comment printed; fonts listed.
Usage: python3 -I verify_page.py <new page> <new files dir> <old page>"""
import re,json,sys,hashlib,base64,os
def doc(p):
    s=open(p,encoding='utf-8').read()
    m=re.search(r'<script type="application/json" id="appifact-doc">(.*?)</script>',s,re.S)
    a=re.search(r'<script id="appifact-app">(.*?)</script>',s,re.S)
    return s,json.loads(m.group(1)),a.group(1)
s,d,app=doc(sys.argv[1]); so,do,appo=doc(sys.argv[3])
print('doc keys',list(d.keys())[:10])
def files(d):
    for k in ('files','assets'):
        if k in d: return d[k]
    for v in d.values():
        if isinstance(v,dict) and ('files' in v): return v['files']
    return None
F=files(d); print('type',type(F).__name__, 'n', len(F) if F else None)
items=F.items() if isinstance(F,dict) else [(x.get('path') or x.get('name'),x) for x in F]
bad=[];n=0
for name,v in items:
    c=v if isinstance(v,str) else (v.get('content') or v.get('data') or v.get('text') or '')
    enc=None if isinstance(v,str) else v.get('encoding')
    if isinstance(c,str) and (enc=='base64' or str(name).endswith('.png')):
        try: b=base64.b64decode(c.split(',',1)[-1])
        except Exception: b=c.encode()
    else: b=c.encode() if isinstance(c,str) else json.dumps(c).encode()
    p=os.path.join(sys.argv[2],os.path.basename(str(name)))
    n+=1
    if not os.path.exists(p) or hashlib.md5(open(p,'rb').read()).hexdigest()!=hashlib.md5(b).hexdigest(): bad.append(name)
print('record files',n,'mismatch/missing',bad[:10], 'package files',len(os.listdir(sys.argv[2])))
print('title',d.get('title'), 'comments', d.get('comments'))
print('app runtime chars',len(app),'identical to morning:',app==appo)
print('README comment:',(re.search(r'<!--(.*?)-->',s,re.S).group(1)[:600] if re.search(r'<!--(.*?)-->',s,re.S) else None))
print('font-face count',len(re.findall(r'@font-face',s)), set(re.findall(r'font-family:\s*["\']?([\w -]+)',' '.join(re.findall(r'@font-face\s*{[^}]*}',s)))))
