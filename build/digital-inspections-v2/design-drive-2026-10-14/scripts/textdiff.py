import re,sys,os,html,json
def texts(path):
    src=open(path,encoding='utf-8',errors='ignore').read()
    res={}  # label -> set
    label='(file header)'
    # map line -> label from data-screen-label
    marks=[(src.count('\n',0,m.start())+1,m.group(1)) for m in re.finditer(r'data-screen-label="([^"]+)"',src)]
    def lab(line):
        l='(file header)'
        for ln,t in marks:
            if ln<=line: l=t
            else: break
        return l
    body=re.sub(r'<style\b[^>]*>.*?</style>',lambda m:'\n'*m.group(0).count('\n'),src,flags=re.S|re.I)
    scripts=[]
    def keep(m):
        scripts.append((src.count('\n',0,m.start())+1 if False else body.count('\n',0,m.start())+1,m.group(1)))
        return '\n'*m.group(0).count('\n')
    body2=re.sub(r'<script\b[^>]*>(.*?)</script>',keep,body,flags=re.S|re.I)
    def add(t,line,lb=None):
        t=html.unescape(re.sub(r'\s+',' ',t)).strip()
        if len(t)<2 or not re.search(r'[A-Za-z]{2}',t): return
        if re.search(r'^[\w.-]+$',t) and not re.match(r'^[A-Z][a-z]+$',t) and not t.isupper(): return
        if re.search(r'#[0-9A-Fa-f]{3,8}\b|\d+px|rgba?\(|var\(--|=>|\bfunction\b|^\.|;\s*$',t): return
        res.setdefault(lb or lab(line),set()).add(t)
    for m in re.finditer(r'>([^<>]+)<',body2):
        add(m.group(1),body2.count('\n',0,m.start())+1)
    for m in re.finditer(r'\s(?:title|placeholder|aria-label|alt|label|value|data-screen-label)="([^"{]*)"',body2):
        add(m.group(1),body2.count('\n',0,m.start())+1)
    for ln,s in scripts:
        for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"|`((?:[^`\\]|\\.)*)`",s):
            t=m.group(1) or m.group(2) or m.group(3) or ''
            t=re.sub(r'\$\{[^}]*\}','{…}',t)
            if ' ' in t or re.match(r'^[A-Z][a-z]+',t): add(t,0,'(script logic)')
    return res
new=texts(sys.argv[1]); old=texts(sys.argv[2]) if os.path.exists(sys.argv[2]) else {}
allnew=set().union(*new.values()) if new else set(); allold=set().union(*old.values()) if old else set()
print(f"# {os.path.basename(sys.argv[1])}\n")
print(f"texts new={len(allnew)} old={len(allold)} added={len(allnew-allold)} removed={len(allold-allnew)}")
nl=list(new); ol=list(old)
print("\n## screen labels added:", [l for l in nl if l not in old])
print("## screen labels removed:", [l for l in ol if l not in new])
for l in nl:
    a=new[l]-allold
    if a: print(f"\n### + [{l}] ({len(a)})"); [print("  + "+t[:220]) for t in sorted(a)]
for l in ol:
    r=old[l]-allnew
    if r: print(f"\n### - [{l}] ({len(r)})"); [print("  - "+t[:220]) for t in sorted(r)]
