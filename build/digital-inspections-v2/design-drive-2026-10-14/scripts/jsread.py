"""Script-assisted reading copy of a JS/CSS/JSON library file: every comment, every string literal that contains a
letter, and every function/class/component declaration, with line numbers. Code punctuation/geometry is dropped."""
import re,sys
src=open(sys.argv[1],encoding='utf-8',errors='ignore').read()
out=[]
for i,l in enumerate(src.split('\n'),1):
    keep=[]
    for m in re.finditer(r'/\*.*?\*/|//[^\n]*',l): keep.append(m.group(0)[:300])
    for m in re.finditer(r'(?:function\s+\w+|class\s+\w+|const\s+[A-Z]\w*\s*=|export\s+\w+\s+\w+)',l): keep.append('DECL '+m.group(0))
    for m in re.finditer(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"|`((?:[^`\\]|\\.)*)`",l):
        t=m.group(1) or m.group(2) or m.group(3) or ''
        if re.search(r'[A-Za-z]{2}',t) and not re.match(r'^M[\d .,-]|^[mlhvcsqtaz][\d .,-]',t) and not re.search(r'^#|\d(px|rem|%)|rgba|var\(--',t):
            keep.append('"'+t[:200]+'"')
    if keep: out.append(f"L{i}: "+' | '.join(keep))
open(sys.argv[2],'w').write('\n'.join(out)+'\n')
print(sys.argv[1].split('/')[-1], len(src.split('\n')), 'lines ->', len(out), 'kept,', sum(len(x) for x in out), 'bytes')
