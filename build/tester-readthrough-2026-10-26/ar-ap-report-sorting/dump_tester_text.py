#!/usr/bin/env python3
"""Dump every case's tester-facing text (title, preconditions, steps, Expected Result bullets) of A/R and A/P Report Sorting, one block per
case, for the 26 Oct 2026 tester read-through. python3 dump_tester_text.py OUT.txt [--design] (--design adds each design case's quote
labels and the design's own words, so vague look words can be made concrete from them)."""
import sys, os, re, html, importlib
A = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting/authoring"; sys.path.insert(0, A)
import ar_lib as L, pattern as PT
for m in ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_s5", "cases_s6_s9", "cases_data", "cases_rel", "cases_design"]: importlib.import_module(m)
out = []
for c in L.CASES:
    p = PT.pattern(c)
    out.append(f"=== {c['key']} | {p['title']}")
    out += ["P: " + x for x in p["pre"]]
    for i, (s, r) in enumerate(zip(p["steps"], p["results"]), 1):
        out.append(f"{i}. {s}"); out += [f"   - {b}" for b in r]
    if c["note"]: out.append("NOTE: " + PT.plain(c["note"]))
    if "--design" in sys.argv and c["sec"] == "DESIGN":
        for l, t in L.quotes(c): out.append(f"Q {l}: {t}")
        tail = L.design_block(c)
        words = re.findall(r"<li>(.*?)</li>", tail.split("The design's own words:")[1]) if "The design's own words:" in tail else []
        out += ["W " + html.unescape(w) for w in words]
        for para in re.findall(r"<p>((?:Difference|Design note)[^<]*)</p>", tail): out.append("DD " + html.unescape(para))
open(sys.argv[1], "w").write("\n".join(out) + "\n"); print(len(L.CASES), "cases", len(out), "lines")
