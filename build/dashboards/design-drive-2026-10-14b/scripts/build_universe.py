"""Stage 1: every on-screen text of the Dashboard design package, from (a) the shared tool's rows, (b) a lenient pass over
every board file (text nodes + visible attributes; covers the tool's dropped single words / digit / 'this|let|var|const'
texts), (c) hand transcriptions of all 47 screenshots, (d) the sweep's rendered page text. Each matched against all 123
live case texts (Vladimir's 9 included)."""
import re,glob,json,html,os,sys
S=sys.argv[1]
main=json.load(open(S+'/inv/design-text-inventory-2026-10-14b.json'))
def norm(s): return re.sub(r'\s+',' ',html.unescape(s).replace('’',"'")).strip()
U={}  # text -> dict
def add(t,where,src,kind=''):
    t=norm(t)
    if not t or not re.search(r'[A-Za-z0-9$%\-—•]',t): return
    key=t.lower()
    for k0 in (t,):
        pass
    grp='image' if src=='image' else ('canvas' if kind in ('canvas','sweep') else 'board')
    hit=next((x for x,v in U.items() if v['text'].lower()==key and v['grp']==grp),None)
    if hit: U[hit]['where'].append(where); return
    U[t+'\x00'+grp]={'text':t,'where':[where],'source':src,'kind':kind,'grp':grp}
for r in main['rows']: add(r['text'],r['where'],'tool','board')
# (b) lenient board pass
for f in sorted(glob.glob(S+'/boards/*.dc.html')):
    src=open(f).read(); name=os.path.basename(f)
    body=re.sub(r'<style\b.*?</style>',lambda m:'\n'*m.group(0).count('\n'),src,flags=re.S)
    for m in re.finditer(r'>([^<>]+)<',body): add(m.group(1),f'{name}:{body.count(chr(10),0,m.start())+1}','supp-board','board')
    for m in re.finditer(r'\s(?:alt|title|aria-label|placeholder)\s*=\s*"([^"]*)"',body): add(m.group(1),f'{name}:{body.count(chr(10),0,m.start())+1}','supp-board','board')
# (c) image transcriptions: split compound rows into atomic texts
for i,l in enumerate(open(S+'/transcribe.tsv'),1):
    if i==1: continue
    img,txt,kind=l.rstrip('\n').split('\t')
    if kind=='visual': add(txt,f'{img} (transcription row {i})','image',kind); continue
    for part in re.split(r';\s*',txt):
        part=re.sub(r'\s*\((?:[^()]*(?:legend|axis|filter|title|panel|column|columns|link|ticked|select|pill|chevron|side menu|report|unchanged|cut off|em dash|calendar|old|top bar|see above|more menu|no chart|and \d|sorted|footer|stacked|same|table|chart|toolbar|info icon)[^()]*)\)\s*$','',part).strip()
        add(part,f'{img} (transcription row {i})','image',kind)
# (d) sweep page text
for f in glob.glob(S+'/out-*/**/*-pages.txt',recursive=True):
    for i,l in enumerate(open(f,errors='ignore'),1):
        if l.startswith('#') or l.startswith('== ') or re.match(r'^=+\s*PAGE',l): continue
        rel=os.path.relpath(f,S)
        if rel.startswith('out-boards/'):
            b=rel.split('/')[1]; add(l,f'{b}.dc.html (rendered by sweep {rel}:{i})','sweep-board','board')
        else: add(l,f'sweep {rel}:{i}','sweep','sweep')
# (e) canvas-tool texts from the canvas driver and the supplementary export/play driver
import pathlib
ep=S+'/out-exportplay/export-play.jsonl'
if os.path.exists(ep):
    for l in open(ep):
        r=json.loads(l)
        for m in r.get('export_menu',[]):
            for x in m.split(chr(10)): add(x,'canvas export menu ('+r['board']+')','canvas','canvas')
        for x in r.get('play_text','').split(chr(10)): add(x,'played view chrome ('+r['board']+')','canvas','canvas')
for fn in ('player-controls.json','player-controls-2.json','player-export.json'):
    f=S+'/out-exportplay/'+fn
    if os.path.exists(f):
        d=json.load(open(f))
        for k,v in d.items():
            if isinstance(v,dict):
                for x in v.get('hover_new',[])+v.get('click_new',[])+v.get('hover',[])+v.get('click',[]): add(x,'player control '+k+' ('+fn+')','canvas','canvas')
        if fn=='player-export.json':
            for x in d.get('hover',[])+d.get('click',[]): add(x,'player Export ('+fn+')','canvas','canvas')
cd=S+'/out-canvasdrv/canvas-drive.jsonl'
if os.path.exists(cd):
    for l in open(cd):
        r=json.loads(l)
        if r.get('action')=='play': 
            for x in (r.get('text') or '').split(chr(10)): add(x,'canvas driver play ('+str(r.get('board'))+')','canvas','canvas')
        if r.get('action')=='zoom':
            for x in (r.get('text') or '').split(chr(10)): add(x,'canvas driver zoom menu','canvas','canvas')
for f in glob.glob(S+'/out-canvasfull/*-interactions.jsonl'):
    for l in open(f):
        r=json.loads(l)
        for e in (r.get('exposed_text') if isinstance(r.get('exposed_text'),list) else []):
            if isinstance(e,dict):
                for x in (e.get('text') or '').split(chr(10)): add(x,'sweep '+r.get('action','')+' exposed ('+str(r.get('label',''))[:40]+')','canvas','canvas')
# cases
cs={}
for f in glob.glob(S+'/cases123/*.json'):
    j=json.load(open(f)); t=' '.join(str(j.get(k) or '') for k in ('title','custom_preconds','custom_steps','custom_expected'))
    cs[j['id']]=re.sub(r'\s+',' ',norm(re.sub(r'<[^>]+>',' ',t))).lower()
def hits(t):
    tl=t.lower().strip(' .')
    if len(tl)<=3:
        return [i for i,c in cs.items() if re.search(r'(?<![a-z0-9])'+re.escape(tl)+r'(?![a-z0-9])',c)]
    return [i for i,c in cs.items() if tl in c]
for u in U.values():
    h=sorted(hits(u['text'])); u['cases']=h
json.dump(list(U.values()),open(S+'/inv/universe.json','w'),indent=0,ensure_ascii=False)
tot=len(U); inc=sum(1 for u in U.values() if u['cases'])
print('texts',tot,'in a case',inc)
from collections import Counter
print(Counter(u['source'] for u in U.values()))
