import re,glob,os,json
SPECS={}
for p in glob.glob('../specs/*-v*.txt'):
    slug=os.path.basename(p).split('-v')[0]
    SPECS[slug]=open(p).read()
def find(ref):
    hits=[]
    for slug,txt in SPECS.items():
        for m in re.finditer(r'(?m)^.*\b'+re.escape(ref)+r'\b.*$', txt):
            line=m.group(0).strip()
            if line.startswith('- '+ref) or line.startswith(ref):
                hits.append((slug,line))
    return hits
out={}
for p in sorted(glob.glob('../ticket-text/SV-*.txt')):
    k=os.path.basename(p)[:-4]
    t=open(p).read()
    refs=sorted(set(re.findall(r'\bS\d{1,2}-[RNE]\d{1,2}[a-z]?\b', t)))
    out[k]=refs
    if refs: print(k, ' '.join(refs))
json.dump(out, open('../refs-cited.json','w'), indent=1)
