#!/usr/bin/env python3
"""Independent coverage proof on the LIVE Maintenance Reminders suites after the 6 Oct update (L5 / Rule 43)."""
import sys, re, html, json
sys.path.insert(0, "build/maintenance-reminder-v2")
from mr_lib import api
S = "build/maintenance-reminder-v2/sources"
MARK = "AUTOMATION: HOLD - not yet build-verified on a Maintenance Reminders QA build"
def anchors(path):
    out = {}
    for line in open(path):
        l = line.replace("\\-", "-", 1).replace("**", "")
        l = l.replace("\\\\\\<", "<").replace("\\\\\\>", ">").replace("\\\\<", "<").replace("\\\\>", ">")
        l = re.sub(r"\\([\[\]()*_>#.!`<-])", r"\1", l).replace("`", "").strip()
        m = re.match(r"^[-*]\s*(S\d+-[RNE]\d+[a-z]?)\s*:\s*(.+)$", l)
        if m: out[m.group(1)] = m.group(2).strip()
    return out
def norm(s): return re.sub(r"\s+", " ", s.replace("->", "→").replace("’", "'").replace("“", '"').replace("”", '"')).strip()
secs = []; off = 0
while True:
    r = api(f"get_sections/1&suite_id=1&limit=250&offset={off}"); s = r["sections"]; secs += s
    if len(s) < 250: break
    off += 250
def sub(root):
    k = {root}; ch = True
    while ch:
        ch = False
        for s in secs:
            if s["parent_id"] in k and s["id"] not in k: k.add(s["id"]); ch = True
    return k
c2 = sub(26635); c1 = sub(19397) - c2
cases = []; off = 0
while True:
    r = api(f"get_cases/1&suite_id=1&limit=250&offset={off}"); c = r["cases"]; cases += [x for x in c if x["section_id"] in c1 | c2]
    if len(c) < 250: break
    off += 250
for name, ks, spec, stories in (("Chunk 1", c1, f"{S}/CONFLUENCE-886931488-Chunk1-MR-2026-10-06.md", r"S(1|2|3|4|5|6|7|8|9|13|14|21)-"),
                                ("Chunk 2", c2, f"{S}/CONFLUENCE-897679389-Chunk2-MR-2026-10-06.md", r"S(10|11|12|16|17|18|19|22)-")):
    A = {k: v for k, v in anchors(spec).items() if re.match(stories, k)}
    cs = [x for x in cases if x["section_id"] in ks]
    cited = set(); bad = []; mk = 0; flag = []
    for c in cs:
        e = c["custom_expected"] or ""
        mk += (e.count("AUTOMATION:") == 1 and MARK in e)
        if "maintenance_reminders" in (c["custom_preconds"] or "") + e or "Flag on" in (c["custom_preconds"] or ""): flag.append(c["id"])
        for a, q in re.findall(r"<strong>(S\d+-[RNE]\d+[a-z]?):</strong>\s*&ldquo;(.*?)&rdquo;", e, re.S):
            cited.add(a); q = html.unescape(re.sub("<[^>]+>", "", q)).replace("`", "")
            if a in A and not all(norm(p) in norm(A[a]) for p in re.split(r"\s*(?:\.\.\.|…)\s*", q) if p.strip()):
                bad.append((c["id"], a))
    print(f"{name}: live cases {len(cs)} | correct single marker {mk}/{len(cs)} | flag text left {len(flag)} {flag[:5]}")
    print(f"   spec requirements {len(A)} | cited {len(cited & set(A))} | NOT cited {sorted(set(A) - cited)}")
    print(f"   spec quotes not verbatim vs 6 Oct spec: {len(bad)} {bad[:8]}")
    print(f"   by author: {sorted(set(x['created_by'] for x in cs))} | Automated: {sum(x['custom_atmstatus']==3 for x in cs)}")
