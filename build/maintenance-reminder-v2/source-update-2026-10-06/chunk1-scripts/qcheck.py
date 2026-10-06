import json,re,html,sys,collections
B="/home/user/Manual-test-Cases/build/maintenance-reminder-v2/"
cases=json.load(open(B+"snapshots-2026-10-06/chunk2-cases-before.json"))
spec=open(B+"sources/CONFLUENCE-897679389-Chunk2-MR-2026-10-06.md").read()
def clean(s):
    s=s.replace("**","").replace("\\","").replace("`","")
    s=s.replace("->","→").replace(" "," ")
    s=re.sub(r"\s+"," ",s)
    return s.strip()
anc={}
for m in re.finditer(r"^- \*\*(S\d+-[RNE]\d+):\*\* (.*)$",spec,re.M):
    anc[m.group(1)]=clean(m.group(2))
print("current anchors",len(anc))
cited=collections.defaultdict(list)
rows=[]
for c in cases:
    e=c["custom_expected"] or ""
    qs=re.findall(r"<strong>([^<]+?):</strong>\s*&ldquo;(.*?)&rdquo;",e,re.S)
    for a,q in qs:
        a=html.unescape(a).strip(); q=clean(html.unescape(re.sub("<[^>]+>","",q)))
        cited[a].append(c["id"])
        cur=anc.get(a)
        if cur is None: st="ANCHOR-GONE" if re.match(r"S\d+-[RNE]\d+$",a) else "NONANCHOR"
        else:
            parts=[p.strip(" .") for p in re.split(r"\s*(?:\.\.\.|…)\s*",q) if p.strip(" .")]
            st="OK" if all(p in cur for p in parts) else "CHANGED"
        rows.append((c["id"],c["section_name"],a,st,q))
json.dump(rows,open(sys.argv[1],"w"),indent=0)
cnt=collections.Counter(r[3] for r in rows); print(cnt)
for r in rows:
    if r[3]!="OK": print(r[0],r[2],r[3],"|",r[4][:300])
print("UNCITED:",[a for a in anc if a not in cited])
print("CITED-NOT-IN-SPEC:",{a:v for a,v in cited.items() if a not in anc})
