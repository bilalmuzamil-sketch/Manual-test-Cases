"""Supplementary lenient text inventory (covers the shared tool's three filter gaps). Sources: every .dc.html board
(HTML text nodes, visible attributes, script string literals), rendered sweep text, flow-drive states, image/PDF
transcriptions. Keeps any text with a letter except pure code/CSS/binding. Output: texts NOT already rows of the main
inventory, with whether a case of ours mentions them."""
import re,glob,json,html,os,sys
S='/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad'; W=S+'/dd1014'
main=json.load(open(W+'/inv/design-text-inventory-2026-10-14.json'))
have={r['text'] for r in main['rows']}
def norm(s):
    s=html.unescape(s).replace('\\n',' ').replace("\\'","'").replace('’',"'")
    return re.sub(r'\s+',' ',s).strip()
CODE=re.compile(r'^[a-z][a-zA-Z0-9_$]*$|^[\w$.-]+\(|=>|[{};]$|^#[0-9a-fA-F]{3,8}$|\d(px|rem|ms)\b|rgba?\(|var\(--|^\.|^@|^[a-z-]+:[^ ]|^(none|ok|mon|bad|na|tire|side|lo|li|ri|ro|l|r|true|false|null|axle|checkbox|text|meas|photo|instr|req|photoBad|noteBad|edit|preview|desktop|phone|fill|done|inspection|wo|asset|lines|notes|parts|time|fin|gen|review|section|field|left|right|pointer|transparent|dashed|solid|none|absolute|relative|flex|grid|block|inline-flex|center|hidden|auto|nowrap|inherit|bold|normal)$')
found={}
def add(t,where):
    t=norm(t)
    if not t or not re.search(r'[A-Za-z]',t) or len(t)>400: return
    if re.fullmatch(r'\{\{[^}]*\}\}',t) or CODE.search(t): return
    if re.search(r'[a-z-]+\s*:\s*[^;]+;',t) and ' ' not in t.replace('; ',''): return
    found.setdefault(t,where)
for f in sorted(glob.glob(S+'/dvi-new/*.dc.html')):
    src=open(f,errors='ignore').read(); name=os.path.basename(f)
    for m in re.finditer(r'<script\b[^>]*data-dc-script[^>]*>(.*?)</script>',src,re.S):
        base=src.count('\n',0,m.start(1))+1
        for q in re.finditer(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"",m.group(1)):
            t=q.group(1) if q.group(1) is not None else q.group(2)
            if re.search(r'[A-Za-z]',t or '') and not re.search(r'[:;]\s*$|^[\w-]+:\s',t): add(t,f'{name}:{base+m.group(1).count(chr(10),0,q.start())}')
    body=re.sub(r'<(script|style)\b[^>]*>.*?</\1>',lambda m:'\n'*m.group(0).count('\n'),src,flags=re.S|re.I)
    for m in re.finditer(r'>([^<>]+)<',body): add(m.group(1),f'{name}:{body.count(chr(10),0,m.start())+1}')
    for m in re.finditer(r'\s(?:title|placeholder|aria-label|alt|value|data-tip)\s*=\s*"([^"{]*)"',body): add(m.group(1),f'{name}:{body.count(chr(10),0,m.start())+1}')
for f in sorted(glob.glob(W+'/sweep/*/*-pages.txt')):
    for i,l in enumerate(open(f,errors='ignore'),1):
        if not l.startswith('#') and not l.startswith('== '): add(l,f'sweep {os.path.basename(f)}:{i}')
for fl in json.load(open(W+'/flows/flows.json')):
    for s in fl['steps']:
        for l in s['text'].split('\n'): add(l,f"flow {fl['flow'][:5]}")
for i,l in enumerate(open(W+'/inv/transcribed/image-and-pdf-texts.txt'),1): add(l,f'image-and-pdf-texts.txt:{i}')
cases=' '.join(html.unescape(re.sub(r'<[^>]+>',' ',(j.get('custom_preconds') or '')+(j.get('custom_steps') or '')+(j.get('custom_expected') or '')+j.get('title',''))) for j in (json.load(open(f)) for f in glob.glob('/home/user/Manual-test-Cases/build/digital-inspections-v2/currency-2026-10-14/snapshots-before/C*.json')))
cases=re.sub(r'\s+',' ',cases.replace('’',"'")).lower()
def mentioned(t):
    tl=t.lower()
    if len(tl)<=3: return bool(re.search(r'(?<![a-z])'+re.escape(tl)+r'(?![a-z])',cases))
    parts=[p.strip(' .,:;-') for p in re.split(r'\{…\}|\{\{[^}]*\}\}',tl)]; parts=[p for p in parts if len(p)>=2]
    return bool(parts) and all(p in cases for p in parts)
new=[{'text':t,'where':w,'in_a_case':mentioned(t)} for t,w in found.items() if t not in have]
json.dump(new,open(W+'/inv/supplement-2026-10-14.json','w'),indent=0,ensure_ascii=False)
print('lenient texts',len(found),'not in main inventory',len(new),'of which in a case',sum(n['in_a_case'] for n in new))
