import json,os,re,subprocess,sys,time
TOK=open('/tmp/figma-token').read().strip()
FILE='DR4gEODShYgJqkozs3mF5q'
OUT='/home/user/Manual-test-Cases/build/filters/design-2026-07-31/frames'
os.makedirs(OUT,exist_ok=True)
fr=json.load(open('frames.json'))
# dedupe by node id, prefer the record that has a section path
seen={}
for o in fr:
    if o['id'] not in seen or (not seen[o['id']]['path'] and o['path']): seen[o['id']]=o
uniq=list(seen.values())
print('unique nodes:',len(uniq))
def slug(s):
    s=re.sub(r'[^A-Za-z0-9.]+','-',s or 'unnamed').strip('-')
    return s[:60]
SEC={'Work Order Explorations 14.4.2026':'Work-Order-Explorations-14.4.2026',
     'Work Order Explorations 20.4.2026':'Work-Order-Explorations-20.4.2026',
     'Sorting (Work In Progress)':'Sorting-Work-In-Progress',
     'Components':'Components','Parts Exploarations 20.4.2026':'Parts-Explorations-20.4.2026',
     'Reports Exploarations 21.4.2026':'Reports-Explorations-21.4.2026'}
for o in uniq:
    sec=o['path'].split(' / ')[-1] if o['path'] else ''
    o['section']=SEC.get(sec,'Filters-canvas-top-level' if not sec else slug(sec))
    o['file']=f"{o['section']}__{slug(o['name'])}__{o['id'].replace(':','-')}.png"
json.dump(uniq,open('uniq.json','w'),indent=1)
# render in batches
ids=[o['id'] for o in uniq]
urls={}
B=12
for i in range(0,len(ids),B):
    batch=ids[i:i+B]
    r=subprocess.run(['curl','-sS','-H',f'X-Figma-Token: {TOK}',
        f"https://api.figma.com/v1/images/{FILE}?ids={','.join(batch)}&format=png&scale=2"],
        capture_output=True,text=True,timeout=300)
    d=json.loads(r.stdout)
    if d.get('err'): print('ERR batch',i,d['err']); continue
    urls.update({k:v for k,v in d['images'].items() if v})
    print('batch',i//B+1,'got',sum(1 for v in d['images'].values() if v),'/',len(batch),flush=True)
json.dump(urls,open('imgurls.json','w'),indent=1)
print('urls total:',len(urls),'of',len(ids))
