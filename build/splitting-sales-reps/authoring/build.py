#!/usr/bin/env python3
"""Build and check every Splitting Sales Representatives case. python3 build.py [--md]"""
import sys, json, os, importlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ssr_lib
MODS = [m for m in ["cases_s1_s2", "cases_s3_s4", "cases_s5_s8", "cases_tp", "cases_rel", "cases_design"] if os.path.exists(f"{ssr_lib.D}/{m}.py")]
for m in MODS: importlib.import_module(m)
probs = [p for c in ssr_lib.CASES for p in ssr_lib.check(c)]
keys = [c["key"] for c in ssr_lib.CASES]
dups = {k for k in keys if keys.count(k) > 1}
if dups: probs.append(f"duplicate keys {dups}")
from collections import Counter
print("cases", len(ssr_lib.CASES), dict(Counter(c["sec"] for c in ssr_lib.CASES)))
codes = set(ssr_lib.CODE); used = {x for c in ssr_lib.CASES for x in c["q"] if isinstance(x, str)}
print("PRD codes", len(codes), "covered", len(codes & used), "not yet covered:", sorted(codes - used, key=lambda s: (int(s.split('-')[0][1:]), s)))
for p in probs: print("PROBLEM", p)
out = {c["key"]: dict(sec=c["sec"], fields=ssr_lib.render(c)) for c in ssr_lib.CASES}
json.dump(out, open(f"{ssr_lib.D}/proposals.json", "w"), indent=1, ensure_ascii=False)
sys.exit(1 if probs else 0)
