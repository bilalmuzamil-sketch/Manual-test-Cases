import json,os,re,subprocess,time,sys
TOK=open('/tmp/figma-token').read().strip()
FILE='DR4gEODShYgJqkozs3mF5q'
OUT='/home/user/Manual-test-Cases/build/filters/design-2026-07-31/frames'
uniq=json.load(open('uniq.json'))
urls=json.load(open('imgurls.json')) if os.path.exists('imgurls.json') else {}
def dl(o):
    p=os.path.join(OUT,o['file'])
    if os.path.exists(p) and os.path.getsize(p)>1000: return True
    u=urls.get(o['id'])
    if not u: return False
    r=subprocess.run(['curl','-sS','-L','-o',p,u],capture_output=True,text=True,timeout=180)
    return os.path.exists(p) and os.path.getsize(p)>1000
# first download whatever urls we already have
for o in uniq: dl(o)
B=8
for attempt in range(1,25):
    todo=[o for o in uniq if not (os.path.exists(os.path.join(OUT,o['file'])) and os.path.getsize(os.path.join(OUT,o['file']))>1000)]
    print(f'--- attempt {attempt}: remaining {len(todo)}',flush=True)
    if not todo: break
    for i in range(0,len(todo),B):
        batch=todo[i:i+B]
        ok=False
        for t in range(6):
            r=subprocess.run(['curl','-sS','-H',f'X-Figma-Token: {TOK}',
              f"https://api.figma.com/v1/images/{FILE}?ids={','.join(o['id'] for o in batch)}&format=png&scale=2"],
              capture_output=True,text=True,timeout=300)
            try: d=json.loads(r.stdout)
            except Exception: d={'err':'badjson:'+r.stdout[:100]}
            if d.get('err'):
                w=20*(t+1); print('  retry in',w,'s ->',d['err'],flush=True); time.sleep(w); continue
            urls.update({k:v for k,v in d['images'].items() if v}); ok=True; break
        json.dump(urls,open('imgurls.json','w'),indent=1)
        got=sum(1 for o in batch if dl(o))
        print(f'  batch {i//B+1}/{-(-len(todo)//B)} downloaded {got}/{len(batch)}',flush=True)
        time.sleep(8)
todo=[o['file'] for o in uniq if not os.path.exists(os.path.join(OUT,o['file']))]
print('DONE. downloaded',len(uniq)-len(todo),'/',len(uniq))
print('MISSING:',todo)
