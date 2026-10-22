#!/usr/bin/env python3
"""Build and check every Splitting Sales Representatives case. python3 build.py [--md]"""
import sys, json, os, importlib, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ssr_lib
MODS = [m for m in ["cases_s1_s2", "cases_s3_s4", "cases_s5_s8", "cases_tp", "cases_rs", "cases_rel", "cases_design"] if os.path.exists(f"{ssr_lib.D}/{m}.py")]
for m in MODS: importlib.import_module(m)
probs = [p for c in ssr_lib.CASES for p in ssr_lib.check(c)]
keys = [c["key"] for c in ssr_lib.CASES]
dups = {k for k in keys if keys.count(k) > 1}
if dups: probs.append(f"duplicate keys {dups}")
from collections import Counter
print("cases", len(ssr_lib.CASES), dict(Counter(c["sec"] for c in ssr_lib.CASES)))
codes = set(ssr_lib.CODE); used = {x for c in ssr_lib.CASES for x in c["q"] if isinstance(x, str)}
print("PRD codes", len(codes), "covered", len(codes & used), "not yet covered:", sorted(codes - used, key=lambda s: (int(s.split('-')[0][1:]), s)))
# DESIGN GATE (19 Oct 2026, after the QA lead caught design cases with no design references): every "Design — how it looks"
# case must attach its design pictures, name them in the preconditions and quote the design's own words; every design board must
# be attached to at least one case. The build refuses otherwise.
import glob as _g
for c in ssr_lib.CASES:
    if c["sec"] == "DESIGN":
        if not c["pictures"]: probs.append(f"{c['key']}: design case with no attached design picture")
        if not any(isinstance(x, tuple) and x[0].startswith("Design — board") for x in c["q"]): probs.append(f"{c['key']}: design case quotes no design text")
        pre = " ".join(a for a, _ in c["pre"])
        for p in c["pictures"]:
            if p not in pre: probs.append(f"{c['key']}: picture {p} not named in the preconditions")
_boards = {os.path.basename(x) for x in _g.glob(f"{ssr_lib.P}/design-drive-2026-10-19/unpacked/png/*.png")}
_used = {p for c in ssr_lib.CASES for p in c["pictures"]}
if _boards - _used: probs.append(f"design boards attached to no case: {sorted(_boards - _used)}")
print("design gate: boards", len(_boards), "attached", len(_boards & _used), "| design cases", sum(c['sec'] == 'DESIGN' for c in ssr_lib.CASES))
# REFERENCES-FROM-DESIGN GATE (Rule 117, tenth amendment, 19 Oct 2026)
for c in ssr_lib.CASES:
    h = ssr_lib.render(c)["custom_expected"]
    top = h.split("References from Design")[0]
    if any(w in top for w in ("Claude design canvas", "Design — board", "Design pictures attached")) or ssr_lib.DESIGN_WORDS.search(re.sub(r"<[^>]+>", " ", top.split("</ul>", 1)[1].split("Exact quotes from the source")[0])): probs.append(f"{c['key']}: design reference above the References from Design block")
    if ("Design — board" in h or c["pictures"]) and "<p></p><p><strong>References from Design</strong></p>" not in h: probs.append(f"{c['key']}: design references without their own block")
# SOURCE-IN-QUOTES GATE (Rule 117, eleventh amendment, 19 Oct 2026): no separate Source paragraph; every quoted document has its
# own "From:" line with its version directly above its quotes; the build line follows the quotes.
for c in ssr_lib.CASES:
    h = ssr_lib.render(c)["custom_expected"]
    if "Source &mdash;" in h or "where this behaviour comes from" in h: probs.append(f"{c['key']}: separate Source paragraph")
    q = h.split("Exact quotes from the source")[1].split("References from Design")[0]
    if not q.split("</strong></p>", 1)[1].startswith("<p>From: "): probs.append(f"{c['key']}: quotes do not start with a From line")
    if q.count("<p>From: ") != q.count("<ul>"): probs.append(f"{c['key']}: a quote group without its own From line")
    if "Epic SV-10890" not in q or ssr_lib.NOBUILD not in q: probs.append(f"{c['key']}: tickets or build line missing")
    if not re.search(r"version \d+|dated ", q): probs.append(f"{c['key']}: document version missing")
for p in probs: print("PROBLEM", p)
out = {c["key"]: dict(sec=c["sec"], fields=ssr_lib.render(c)) for c in ssr_lib.CASES}
json.dump(out, open(f"{ssr_lib.D}/proposals.json", "w"), indent=1, ensure_ascii=False)
sys.exit(1 if probs else 0)
