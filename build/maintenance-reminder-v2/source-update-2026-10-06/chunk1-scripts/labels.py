import re,json,difflib,pathlib,sys
OUT=pathlib.Path('.')
SRC=pathlib.Path('../../sources')
specs={'Chunk 1':SRC/'CONFLUENCE-886931488-Chunk1-MR-2026-10-06.md','Chunk 2':SRC/'CONFLUENCE-897679389-Chunk2-MR-2026-10-06.md'}
def design_text(b):
    t=(OUT/f'{b}-pages.txt').read_text()
    d=json.load(open(OUT/f'{b}-discovery.json'))
    t+='\n'+'\n'.join(h['text'] for h in d['hidden_inventory'])
    return t
D={b:design_text(b) for b in specs}
allD='\n'.join(D.values())+'\n'+'\n'.join((OUT/f).read_text() for f in ['Maintenance Reminders Demo-pages.txt'] if (OUT/f).exists())
def n(s): return re.sub(r'\s+',' ',s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"')).strip().lower()
ND=n(allD)
dlines=sorted({l.strip() for l in allD.splitlines() if l.strip()})
trig=r'(?:reads?|reading|titled|labelled|labeled|says|headed|button|toast reads|hover:|\(i\):|\(i\) reads|empty state will read|offers|message)'
pat=re.compile(trig+r'\s*:?\s*(.+?)(?:[,;]| with | and the | per S|$)')
for ch,p in specs.items():
    story=''
    for line in p.read_text().splitlines():
        m=re.match(r'#+\s*(S\d+)',line)
        if m: story=m.group(1)
        mm=re.match(r'- \*\*(S\d+-[RNE]\d+)',line.replace('** ','**'))
        rid=mm.group(1) if mm else story
        clean=re.sub(r'\*\*|\\','',line)
        for m in pat.finditer(clean):
            cand=m.group(1).strip().strip('.').strip()
            cand=re.sub(r'^(for example|e\.g\.)\s*','',cand)
            if len(cand)<4 or len(cand)>140: continue
            if n(cand) in ND: continue
            best=difflib.get_close_matches(cand,dlines,n=1,cutoff=0.5)
            print(f'{ch}|{rid}|SPEC: {cand}|DESIGN-CLOSEST: {best[0] if best else "-"}')
