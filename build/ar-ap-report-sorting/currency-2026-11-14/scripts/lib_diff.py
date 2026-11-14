"""Library before (currency-2026-11-14/proposals-before.json) vs after (authoring/proposals.json): what changed per case, by line kind."""
import json, re, difflib
from collections import Counter
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-14"
A = json.load(open(f"{W}/proposals-before.json")); N = json.load(open(f"{B}/authoring/proposals.json"))
sp = lambda s: [x for x in re.sub(r"(</p>|</li>|<ul>|</ul>|<ol>|</ol>)", r"\1\n", s or "").split("\n") if x]
F = ["title", "custom_preconds", "custom_steps", "custom_expected", "refs"]
out = {}; sig = Counter()
for k in N:
    if k not in A: out[k] = {"kind": "NEW"}; sig["NEW"] += 1; continue
    kinds = set(); ch = {}
    for f in F:
        a, b = A[k]["fields"].get(f) or "", N[k]["fields"].get(f) or ""
        if a == b: continue
        rem, add = [], []
        for l in difflib.unified_diff(sp(a), sp(b), lineterm="", n=0):
            if l[:3] in ("---", "+++") or l.startswith("@@"): continue
            (rem if l[0] == "-" else add).append(l[1:])
        ch[f] = {"removed": rem, "added": add}
        for l in rem + add:
            if l.startswith("<p>From: PRD"): kinds.add("from-line")
            elif "Design canvas" in l: kinds.add("design-read-line")
            elif l.startswith("<p>Difference from the PRD (DD-08)"): kinds.add("DD-08")
            elif re.match(r"<li><strong>(S\d-[RNE]\d+[a-z]?):", l): kinds.add("quote")
            else: kinds.add(f"{f}:other")
    s = "+".join(sorted(kinds)) or "unchanged"; sig[s] += 1
    out[k] = {"kind": s, "changes": ch}
json.dump(out, open(f"{W}/library-diff.json", "w"), indent=1, ensure_ascii=False)
for s, n in sig.most_common(): print(n, s)
demo = [k for k in N if k.startswith("D-") and "D-82" <= k <= "D-95"]
print("demo D-82..D-95 changed:", [k for k in demo if out[k]["kind"] != "unchanged"])
