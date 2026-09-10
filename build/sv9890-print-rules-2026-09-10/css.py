import re,pathlib,sys
def blocks(h):
    out=[]
    for m in re.finditer(r'@media\s+print\s*\{', h):
        i=m.end(); depth=1
        while depth and i<len(h):
            if h[i]=='{': depth+=1
            elif h[i]=='}': depth-=1
            i+=1
        out.append(h[m.start():i])
    return out
for env in sys.argv[1:]:
    h=pathlib.Path(f'inv4219-{env}.html').read_text()
    bs=blocks(h)
    pathlib.Path(f'print-{env}.css').write_text('\n\n/* ==== next @media print block ==== */\n\n'.join(bs))
    print(env,'blocks',len(bs),'total chars',sum(len(b) for b in bs))
