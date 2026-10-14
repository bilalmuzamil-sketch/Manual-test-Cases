import json,re,os,sys,collections
W='/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/dd1014'
d=json.load(open(W+'/inv/design-text-inventory-2026-10-14.json'))
mp={}
for l in open(W+'/inv/transcribed/image-and-pdf-texts.map.tsv'):
    i,img,t=l.rstrip('\n').split('\t',2); mp[int(i)]=img
BUILD_IMG=re.compile(r'2026-08-17 (20\.2[789]|20\.3|20\.4|20\.5|21\.0)|2026-08-18 (12\.2|20\.2[0-5])|2026-08-19 (10\.5|11\.0[0-4]|11\.5[01])|2026-08-20 16\.4[79]|2026-09-03 19|2026-09-21|38e14e29|09-29 at 10\.43|09-29 at 11\.(06|18|20)')
SLACK_IMG=re.compile(r'09-29 at 10\.30')
cache={}
def raw(where):
    m=re.match(r'(.*):(\d+)$',where)
    if not m or where.startswith('sweep'): return ''
    p=os.path.normpath(os.path.join(W+'/inv',m.group(1)))
    if p not in cache: cache[p]=open(p,errors='ignore').read().split('\n')
    L=cache[p]; n=int(m.group(2)); return L[n-1] if n-1<len(L) else ''
PEOPLE=r'William Johns|Kimberly Barnes|Marcus Bell|Marcus Hall|Dana Pruitt|Dana Ruiz|Luis Ortega|Sasha Reyes|Omar Diaz|O\. Demo|Owner Demo|Admin ShopView|Milos Vasic|Savannah Tran|Ken Scott|Connor Gardner|Cody McCarthy|Fabian|Branko'
ORGS=r'ABC Truck Lines|Ridgeway Freight|Northline Truck|Kustoms|Alfa Cargo|Staging Heavy Duty|QA Testing|Short Track|Milos Vasic Company|FOR CLODISU|For Clodisu|Testing Design|Sasha Template|Bendix|Freightliner|Kenworth|Great Dane|Caterpillar'
DATA_RE=re.compile(r'^(?:[\d.,/\s–-]+(?:psi|PSI|in\.|mm|32nds|ft-lbs?|MB|KB|kB|hrs?|hr|mi|%)?(?:\s.*)?|.*\.(pdf|png|PDF|PNG|jpg)\b.*|.*\b(S\d?-\d{2,6}|WO \d+|#S\d?-\d+|S1-\d+)\b.*|(Today|Yesterday)\b.*|.*\b\d{1,2}:\d{2}\b.*|.*\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{1,2}\b.*|.*('+PEOPLE+'|'+ORGS+r').*|Type \d+|Page \d of \d|.*\(\s?\d+\s?\)|Unit \d+.*|.*\b\d{3}\) \d{3}.*|[A-Z0-9]{11,17})$')
CAPTION_CLS={'note','cap','badge','s','t','dids','divider','dtitle','dnum','tocrow','okind'} - {'okind'}
SCREEN_ID=re.compile(r'^(?:[A-Z]{1,3}\d+[a-z]?|[A-Z]\d?)\s')
out=[]
for r in d['rows']:
    if r['in_a_case']: continue
    t=r['text']; w=r['where']; cls=''; why=''
    lib=not r['on_a_board']
    rl=raw(w); tags=set(x.split()[0] for x in re.findall(r'class="([a-z0-9 -]+)"',rl))
    fname=w.split('/')[-1]
    if lib:
        part='support.js/doc-page.js runtime' if ('support.js' in w or 'doc-page.js' in w) else 'design-system library (_ds)'
        cls='OUT-OF-SCOPE'; why=f'{part}: text no DVI V2 board shows (no board uses a bundle component; grep proof in DESIGN-COVERAGE)'
    elif 'image-and-pdf-texts' in w:
        img=mp.get(int(w.rsplit(':',1)[1]),'?')
        if SLACK_IMG.search(img): cls='DESIGN NOTE'; why=f'stakeholder feedback in {img} (adopted as PRD S13-R3/R9/R10; design R1 follows)'
        elif BUILD_IMG.search(img) or img.startswith('2026-08-17 20.27.42'): cls='OUT-OF-SCOPE'; why=f'build reference screenshot {img} (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57)'
        else: cls='DESIGN NOTE'; why=f'superseded earlier design draft or crop: {img} (replaced by the 14 Oct boards)'
    elif 'Marketing Slides' in w:
        cls='OUT-OF-SCOPE'; why='Marketing Slides deck: promotional material, not product UI (no PRD story covers it)'
    elif 'Mark OK Explorations' in w:
        cls='DESIGN NOTE'; why='Mark OK Explorations: design options under study; the decision is PRD S18-R1 (labels Mark all OK / Mark section OK / Mark field OK, no axle level)'
    elif r['class']:
        cls='DATA'; why='date, amount, VIN or time (tool pre-mark)'
    elif tags & CAPTION_CLS or '<h2' in rl or '<p ' in rl or '<p>' in rl or 'data-screen-label' in rl or SCREEN_ID.match(t) or t.startswith('SV-8181') or re.match(r'^\d+ · ',t) or 'glab' in tags and (' · ' in t or t.isupper() and len(t)>14):
        cls='DESIGN NOTE'; why='designer caption/annotation/board title, not product UI text'
    elif DATA_RE.match(t):
        cls='DATA'; why='sample record data (person, company, number, measurement, file, date, work order)'
    out.append({'text':t,'where':w,'class':cls,'reason':why,'tags':','.join(sorted(tags))[:40],'lib':lib})
json.dump(out,open(W+'/inv/triage-pass1.json','w'),indent=0,ensure_ascii=False)
c=collections.Counter(o['class'] or 'UNCLASSIFIED' for o in out); print(c)
res=[o for o in out if not o['class']]
with open(W+'/inv/residual.tsv','w') as f:
    for i,o in enumerate(res): f.write(f"{i}\t{o['text'][:150]}\t{o['where'].replace('../../dvi-new/','')}\t{o['tags']}\n")
print(len(res))
