import json, re, html, sys
from collections import Counter
H="apply-tidy"; scope=json.load(open(f"{H}/scope.json"))
PRD=open("CONFLUENCE-788430850-v48-2026-10-14c.md").read()
def ws(s): return re.sub(r"\s+"," ",s.replace("**","").replace("\\","")).strip()
ANCH={}
for line in PRD.splitlines():
    m=re.match(r"^\s*\\?[-*]\s+\*\*(S\d+-[A-Z]+\d+[a-z]?)(?: \([^)]*\))?:\*\*\s*(.*)$",line)
    if m: ANCH[m.group(1)]=ws(m.group(2))
PRDW=ws(PRD); TP=ws(open("../sources/Dashboard-v1-Technical-Implementation-Plan.md").read())
BOARD=re.compile(r"\b(?:\d\d_[A-Za-z]+_[A-Za-z]+|Main|[a-z-]+-[a-z-]+\.png)\b")
out=[]; bc=Counter(); srcpat=Counter()
for c in scope:
    d=json.load(open(f"{H}/snap-start/C{c}.json")); e=d["custom_expected"]
    allt=" ".join(d[f] or "" for f in ("custom_preconds","custom_steps","custom_expected"))
    src=re.findall(r"<strong>Source[^<]*</strong>(.*?)</p>",e,re.S)
    quotes=re.findall(r"<li><strong>([^<]+?):</strong>\s*&ldquo;(.*?)&rdquo;</li>",e,re.S)
    qbad=[]
    for a,q in quotes:
        qq=ws(html.unescape(q))
        if a in ANCH: ok = qq==ANCH[a] or qq in PRDW
        elif a.lower().startswith("tech plan"): ok = qq in TP
        else: ok = qq in PRDW
        if not ok: qbad.append(a)
    boards=sorted(set(BOARD.findall(html.unescape(allt))))
    for b in boards: bc[b]+=1
    rem=re.findall(r"[^.;(]*remembers your choice[^.;)]*",html.unescape(allt))
    out.append(dict(c=c,atm=d["custom_atmstatus"],nsrc=len(src),src=html.unescape(src[0]) if src else None,
        codes=[a for a,_ in quotes],dupq=[a for a,n in Counter(a for a,_ in quotes).items() if n>1],qbad=qbad,boards=boards,remember=rem,
        lastchk=re.findall(r"<p>(Last checked[^<]*)</p>",e), marker=re.findall(r"AUTOMATION:[^<]*",e), v42=allt.count("v42"),
        sv8311=allt.count("SV-8311"), layout="Setup" in d["custom_preconds"], link="Setup (manual QA tester" in d["custom_preconds"]))
json.dump(out,open(f"{H}/survey.json","w"),indent=1,ensure_ascii=False)
print("board refs",bc.most_common())
print("quote mismatches",[(o["c"],o["qbad"]) for o in out if o["qbad"]])
print("dup quotes",[(o["c"],o["dupq"]) for o in out if o["dupq"]])
print("nsrc!=1",[o["c"] for o in out if o["nsrc"]!=1])
print("remember",[(o["c"],o["remember"]) for o in out if o["remember"]])
print("lastchk",Counter(tuple(o["lastchk"]) for o in out))
print("marker",Counter(tuple(o["marker"]) for o in out))
print("v42 count",Counter(o["v42"] for o in out), "sv8311",Counter(o["sv8311"] for o in out))
print("layout old(Setup)",sum(o["layout"] for o in out),"doc link",sum(o["link"] for o in out))
