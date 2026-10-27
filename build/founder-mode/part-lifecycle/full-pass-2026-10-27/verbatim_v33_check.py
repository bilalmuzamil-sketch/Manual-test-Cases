"""Every PRD quote in every case is a verbatim substring of the PRD v33 source text (27 Oct 2026 integration check)."""
import sys, re, html, json
import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "authoring"))
import pllib as L, build_mods
raw = open(L.PRD_FILE).read()
body = raw.split("## 9. Change Log")[0]
def norm(s): return re.sub(r"\s+", " ", s.replace("\\", "").replace("**", "").replace("*", "").replace("`", "")).strip()
RAWN = norm(body)
TABLE = norm(" ".join(" | ".join(c.strip() for c in l.strip().strip("|").split("|")) for l in body.split("\n") if l.startswith("|")))
n = bad = star = 0; docs = {}
for c in L.CASES:
    for doc, label, text in L.quotes(c):
        docs[doc] = docs.get(doc, 0) + 1
        if doc != "PRD":
            if not L.DOCS[doc][1](text): bad += 1; print("NOT VERBATIM", c["key"], doc, label)
            continue
        n += 1
        if "*" in text: star += 1; print("STAR", c["key"], label, text[-40:])
        t = norm(text)
        if t not in RAWN and t not in TABLE: bad += 1; print("NOT IN v33", c["key"], label, text[:90])
        if t in norm(raw.split("## 9. Change Log")[1]) and t not in RAWN and t not in TABLE: print("ONLY IN CHANGE LOG", c["key"], label)
print(f"cases {len(L.CASES)} | quotes by document {docs} | PRD quotes checked {n} | with a '*' {star} | not verbatim {bad}")
sys.exit(1 if bad or star else 0)
