#!/usr/bin/env python3
"""Outline extractor for the Credit terms design boards (data only; run with python3 -I).
Writes extract/<board>.outline.txt (indented element outline: tag.classes [key style] "text") and extract/<board>.json
(per figure: badge, heading, caption items, img, and every visible text with its file line)."""
import sys, os, re, json, html
from html.parser import HTMLParser
D = sys.argv[1]; OUT = sys.argv[2]
VOID = {"meta","link","img","br","hr","input","source","col","area","base","wbr","path","circle","rect","line","polyline","polygon","ellipse","use","stop"}
STYLE_KEYS = ("color","background","opacity","font-weight","width","border","text-decoration","cursor")
class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.stack=[]; s.lines=[]; s.fig=0; s.figs=[]; s.skip=0; s.texts=[]; s.cur=None; s.incap=0; s.inbadge=0
    def handle_starttag(s, tag, attrs):
        a=dict(attrs); cls=a.get("class","") or ""
        if tag in ("style","script"): s.skip+=1
        if tag=="svg": s.skip+=1; s.lines.append("  "*len(s.stack)+"<svg %s%s>"%(cls, (" aria-label="+a["aria-label"]) if a.get("aria-label") else ""))
        ln=s.getpos()[0]
        if tag=="figure":
            s.fig+=1; s.cur=dict(n=s.fig, line=ln, badge=None, heading=None, captions=[], imgs=[], texts=[]); s.figs.append(s.cur)
        st=a.get("style","") or ""
        hints=[]
        for kv in st.split(";"):
            if ":" in kv:
                k,v=kv.split(":",1); k=k.strip()
                if any(k==x or k.startswith(x) for x in STYLE_KEYS): hints.append(f"{k}:{v.strip()}")
        extra=[f'{k}="{a[k]}"' for k in ("alt","src","aria-label","placeholder","value","title","disabled","checked","type","data-theme") if k in a]
        if not s.skip:
            s.lines.append("  "*len(s.stack)+f"<{tag}{('.'+cls.replace(' ','.')) if cls else ''}{(' '+' '.join(extra)) if extra else ''}{(' ['+'; '.join(hints)+']') if hints else ''}>")
        if tag=="img" and s.cur is not None: s.cur["imgs"].append(dict(src=a.get("src"), alt=a.get("alt"), line=ln))
        if s.cur is not None:
            for k in ("alt","aria-label","placeholder","value","title"):
                if a.get(k): s.cur["texts"].append(dict(text=a[k], line=ln, kind="attr:"+k, ctx=cls))
        if tag=="figcaption": s.incap+=1
        if tag not in VOID: s.stack.append((tag,cls))
        if tag=="svg": pass
    def handle_endtag(s, tag):
        if tag in ("style","script") and s.skip: s.skip-=1
        if tag=="svg" and s.skip: s.skip-=1
        if tag=="figcaption": s.incap-=1
        if tag in VOID: return
        # pop to matching
        for i in range(len(s.stack)-1,-1,-1):
            if s.stack[i][0]==tag: del s.stack[i:]; break
        if tag=="figure": s.cur=None
    def handle_data(s, d):
        if s.skip: return
        t=re.sub(r"\s+"," ",d).strip()
        if not t: return
        ln=s.getpos()[0]; ctx=s.stack[-1][1] if s.stack else ""
        s.lines.append("  "*len(s.stack)+f'"{t}"')
        rec=dict(text=t, line=ln, kind="caption" if s.incap else "text", ctx=ctx, fig=s.cur["n"] if s.cur else 0)
        s.texts.append(rec)
        if s.cur is not None:
            s.cur["texts"].append(rec)
            if "sv-badge" in ctx and s.cur["badge"] is None: s.cur["badge"]=t
            elif s.cur["heading"] is None and s.cur["badge"] is not None and "sv-badge" not in ctx and not s.incap: s.cur["heading"]=t
            if s.incap and s.stack and s.stack[-1][0] in ("li","figcaption","p","span","b","strong","code","em"): pass
os.makedirs(OUT, exist_ok=True)
summary={}
for f in sorted(os.listdir(D)):
    if not f.endswith(".dc.html"): continue
    src=open(os.path.join(D,f),encoding="utf-8").read()
    p=P(); p.feed(src)
    # caption items: re-extract li text per figure
    figs=[]
    for m in re.finditer(r"<figure\b.*?</figure>", src, re.S):
        cap=re.search(r"<figcaption[^>]*>(.*?)</figcaption>", m.group(0), re.S)
        items=[html.unescape(re.sub(r"<[^>]+>","",x)).strip() for x in re.findall(r"<li[^>]*>(.*?)</li>", cap.group(1), re.S)] if cap else []
        if cap and not items: items=[html.unescape(re.sub(r"<[^>]+>","",cap.group(1))).strip()]
        figs.append(items)
    for fg,items in zip(p.figs,figs): fg["captions"]=items
    title=re.search(r"<title>(.*?)</title>",src).group(1)
    h2=html.unescape(re.search(r'<h2 class="sv-h2"[^>]*>(.*?)</h2>',src,re.S).group(1))
    note=html.unescape(re.sub(r"<[^>]+>","",re.search(r'</h2>\s*<p[^>]*>(.*?)</p>',src,re.S).group(1)))
    helm=re.search(r"<helmet>(.*?)</helmet>",src,re.S); helm=helm.group(1) if helm else ""
    json.dump(dict(board=f,title=title,h2=h2,note=note,helmet_css=helm,figures=p.figs,texts=p.texts),open(os.path.join(OUT,f+".json"),"w"),indent=1,ensure_ascii=False)
    open(os.path.join(OUT,f+".outline.txt"),"w").write("\n".join(p.lines))
    summary[f]=dict(figs=len(p.figs), texts=len(p.texts), outline_bytes=sum(len(x)+1 for x in p.lines))
print(json.dumps(summary,indent=1))
