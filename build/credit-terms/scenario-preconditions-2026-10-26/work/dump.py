import sys, os, importlib, re
sys.path.insert(0, "/home/user/Manual-test-Cases/build/credit-terms/authoring")
import ct_lib as L
import build_mods
from collections import Counter
for m in ["cases_s1","cases_s2","cases_s3","cases_s4","cases_s5","cases_s6","cases_s7","cases_s8","cases_s9","cases_s10","cases_s11","cases_s12","cases_data","cases_design"]:
    importlib.import_module(m)
out = open(sys.argv[1], "w")
for c in L.CASES:
    out.write(f"## {c['key']} | {c['title']}\n")
    for a, b in c["pre"][:-1]:
        out.write(f"- {a}" + (f" || {b}" if b else "") + "\n")
    out.write("  STEPS: " + " / ".join(c["steps"])[:300] + "\n")
firsts = Counter(c["pre"][0][0][:60] for c in L.CASES)
for k, v in firsts.most_common(): print(v, k)
allp = " ".join(a + " " + (b or "") for c in L.CASES for a, b in c["pre"])
for w in ["QA lead", "ask your", "Ask ", "set aside", "ask the", "Ask the"]:
    print(w, allp.count(w))
