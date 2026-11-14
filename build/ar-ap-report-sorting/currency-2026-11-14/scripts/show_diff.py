import json, sys, difflib, re
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-14"
live = {c["id"]: c for c in json.load(open(f"{W}/live-before/live-2026-11-14.json"))["cases"]}
cid = int(sys.argv[1]); f = sys.argv[2]
a = json.load(open(f"{B}/currency-2026-11-10/applied/C{cid}-after.json")).get(f) or ""; b = live[cid].get(f) or ""
sp = lambda s: re.sub(r"(</p>|</li>|<ul>|</ul>)", r"\1\n", s).split("\n")
for l in difflib.unified_diff(sp(a), sp(b), lineterm="", n=0): print(l[:400])
