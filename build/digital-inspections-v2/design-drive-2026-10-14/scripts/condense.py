"""Condensed reading copy of a design .dc.html: keeps every text, tag, attribute and line of logic; drops only
styling values (style=".." attrs, CSS declarations, CSS-valued JS strings) and SVG geometry. Line numbers kept as
prefix (Lnnn) so every row points to the original file."""
import re,sys,os
src=open(sys.argv[1],encoding='utf-8',errors='ignore').read()
out=[]
lines=src.split('\n')
mode=None
CSSVAL=re.compile(r"""(['"])(?:(?!\1).)*?(?:#[0-9A-Fa-f]{3,8}\b|\d(?:px|%|em|rem|ms|s)\b|rgba?\(|solid|inset|flex|inline-|cubic-bezier|linear-gradient)(?:(?!\1).)*?\1""")
dropped=0
for i,l in enumerate(lines,1):
    s=l
    low=s.lower()
    if mode is None and re.search(r'<style\b',low) and '</style>' not in low:
        mode='css'; out.append(f"L{i}: <style>"); continue
    if mode=='css':
        if '</style>' in low: mode=None; out.append(f"L{i}: </style>"); continue
        if re.search(r'/\*|content\s*:|:hover|:focus|display\s*:\s*none|@media|visibility|opacity\s*:\s*0\b|::(before|after)',s):
            out.append(f"L{i}: [css] "+s.strip()[:300])
        else: dropped+=1
        continue
    s=re.sub(r'<svg\b.*?</svg>','[svg]',s)
    s=re.sub(r'\s(?:style|style-hover|style-active|style-focus)="[^"]*"','',s)
    s=re.sub(r"\s(?:style|style-hover)='[^']*'",'',s)
    s=re.sub(r'\s(?:d|viewBox|stroke-width|stroke-linecap|stroke-linejoin|fill|stroke|width|height|cx|cy|r|x|y|x1|x2|y1|y2|points|rx|ry)="[^"]*"','',s)
    s=CSSVAL.sub("'·'",s)
    s=re.sub(r'\s+',' ',s).strip()
    if s in ('','</div>','<div>','</span>','</sc-if>','</sc-for>','</button>','</section>','[svg]','<div class="board">'):
        if s: dropped+=1
        continue
    out.append(f"L{i}: {s}")
open(sys.argv[2],'w').write('\n'.join(out)+'\n')
print(f"{os.path.basename(sys.argv[1])}\tlines={len(lines)}\tkept={len(out)}\tbytes_in={len(src)}\tbytes_out={len(chr(10).join(out))}")
