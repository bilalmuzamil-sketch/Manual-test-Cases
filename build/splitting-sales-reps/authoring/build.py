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
        pre = ssr_lib.render(c)["custom_preconds"]   # 26 Oct 2026: the pattern's Preconditions name the pictures the tester opens
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
    if any(w in top for w in ("Claude design canvas", "Design — board", "Design pictures attached")) or ssr_lib.DESIGN_WORDS.search(re.sub(r"<[^>]+>", " ", ssr_lib.results_tail(h).split("Exact quotes from the source")[0])): probs.append(f"{c['key']}: design reference above the References from Design block")
    if ("Design — board" in h or c["pictures"]) and "<p></p><p><strong>References from Design</strong></p>" not in h: probs.append(f"{c['key']}: design references without their own block")
# SOURCE-IN-QUOTES GATE (Rule 117, eleventh amendment, 19 Oct 2026): no separate Source paragraph; every quoted document has its
# own "From:" line with its version directly above its quotes; the build line follows the quotes.
for c in ssr_lib.CASES:
    h = ssr_lib.render(c)["custom_expected"]
    if "Source &mdash;" in h or "where this behaviour comes from" in h: probs.append(f"{c['key']}: separate Source paragraph")
    q = re.split(r"Exact quotes from the source|Traceability: the requirements this test checks, quoted exactly", h)[1].split("References from Design")[0]
    if not q.split("</strong></p>", 1)[1].startswith("<p>From: "): probs.append(f"{c['key']}: quotes do not start with a From line")
    if q.count("<p>From: ") != q.count("<ul>"): probs.append(f"{c['key']}: a quote group without its own From line")
    if "Epic SV-10890" not in q or ssr_lib.NOBUILD not in q: probs.append(f"{c['key']}: tickets or build line missing")
    if not re.search(r"version \d+|dated ", q): probs.append(f"{c['key']}: document version missing")
# RULE 136 (22 Oct 2026, PERMANENT; replaces the ask-first part of Rule 127): a case over 10 steps is split where every part stays
# runnable on its own, and otherwise kept whole with its reason recorded as a NOT-SPLIT entry in rule136-2026-10-22/SPLITS.json. A long
# case with its reason is printed as LONG and passes; a long case without one fails the build.
_sp = f"{ssr_lib.P}/rule136-2026-10-22/SPLITS.json"
_splits = json.load(open(_sp)) if os.path.exists(_sp) else {}
longs = [p for p in probs if "Rule 136)" in p]
probs = [p for p in probs if p not in longs]
for p in longs:
    k = p.split(":")[0]
    e = _splits.get(k, {})
    if e.get("verdict") == "NOT-SPLIT" and e.get("why"): print("LONG (Rule 136, kept whole, reason in SPLITS.json)", p.split(" (")[0])
    else: probs.append(p + " — no NOT-SPLIT reason in SPLITS.json")
# PATTERN GATE (Rule 117 fourteenth amendment, 26 Oct 2026, QA lead: "Yes, permanent, all suites"; replaces the Scenario gate of the
# thirteenth amendment): every case, library and design-recheck alike, is in the QA lead's pattern (ssr_lib.pattern_problems): plain
# precondition bullets with no {placeholder}, "For example", "Scenario:" or who-to-ask, the Blocked line last (S1-01, the model the QA
# lead approved word for word, has none and is kept as approved); a "Step N:" heading and bullets per step, a blank paragraph, then the
# quotes, design block and AUTOMATION line, byte-identical to before the pattern (pattern-format-2026-10-26/before-*.json). Every case
# in testrail-id-map.csv must be in the pattern. The design-recheck cases are checked in their draft, pattern-format-2026-10-26/DR-PATTERN.json.
import csv as _csv
_PF = f"{ssr_lib.P}/pattern-format-2026-10-26"
_before = json.load(open(f"{_PF}/before-library-render.json")) if os.path.exists(f"{_PF}/before-library-render.json") else {}
for c in ssr_lib.CASES:
    if not (ssr_lib.LAYOUT_V2.get(c["key"]) or {}).get("pattern"): probs.append(f"{c['key']}: not in the QA lead's pattern"); continue
    probs += ssr_lib.pattern_problems(c["key"], ssr_lib.render(c), (_before.get(c["key"]) or {}).get("fields"))
    probs += ssr_lib.relevance_problems(c["key"], ssr_lib.render(c))
    probs += ssr_lib.independence_problems(c["key"], ssr_lib.render(c))   # INDEPENDENCE GATE (26 Oct 2026, permanent)   # RELEVANCE GATE (26 Oct 2026, permanent): see ssr_lib.relevance_problems
print("independence gate: no case key or C-id in tester text; every record a step or precondition changes is made \"for this test\" in the preconditions")
print("relevance gate: every record a precondition names is used by a step or result, is the record the steps start on, or says why (\"so ...\")")
print("pattern gate: S1-01 keeps the QA lead's approved Preconditions word for word (no Blocked line), as he gave them")
_map = list(_csv.DictReader(open(f"{ssr_lib.P}/testrail-id-map.csv")))
_drp, _drb = f"{_PF}/DR-PATTERN.json", f"{_PF}/before-dr.json"
_dr = json.load(open(_drp)) if os.path.exists(_drp) else {}
_drold = json.load(open(_drb)) if os.path.exists(_drb) else {}
for r in _map:
    if r["key"].startswith("DR-"):
        if r["key"] not in _dr: probs.append(f"{r['key']} (C{r['case_id']}): no pattern draft in DR-PATTERN.json")
        else: probs += ssr_lib.pattern_problems(r["key"], _dr[r["key"]]["fields"], (_drold.get(r["key"]) or {}).get("fields"))
        if r["key"] in _dr: probs += ssr_lib.relevance_problems(r["key"], _dr[r["key"]]["fields"])
        if r["key"] in _dr: probs += ssr_lib.independence_problems(r["key"], _dr[r["key"]]["fields"])
_lib = {c["key"] for c in ssr_lib.CASES}
for r in _map:
    if not r["key"].startswith("DR-") and r["key"] not in _lib: probs.append(f"{r['key']} (C{r['case_id']}): in the id map but not in the library")
print("pattern gate: library cases", len(_lib), "| design-recheck cases", sum(r["key"].startswith("DR-") for r in _map),
      "| cases in testrail-id-map.csv", len(_map), "| unmapped library cases", sorted(_lib - {r["key"] for r in _map}))
for p in probs: print("PROBLEM", p)
out = {c["key"]: dict(sec=c["sec"], fields=ssr_lib.render(c)) for c in ssr_lib.CASES}
json.dump(out, open(f"{ssr_lib.D}/proposals.json", "w"), indent=1, ensure_ascii=False)
sys.exit(1 if probs else 0)
