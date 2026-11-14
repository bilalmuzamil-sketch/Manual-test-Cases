#!/usr/bin/env python3
"""Story 8 named set, found by script (14 Nov 2026). Loads the library as it stood before this pass is applied (or after: the report is the
same), then lists for every case: (1) quotes that are not word for word in the new PRD copy (sources/CONFLUENCE-1003585538-read-2026-11-14.md,
read with the same text rules as the library), (2) quotes of Story 8 codes or of the reworded overview bullet / Key Decision, (3) tester text
naming the band's old unit or vehicle words, (4) References from Design naming page 4 or its old pictures or words.
python3 find_affected.py  -> affected.json and a summary"""
import sys, os, re, json, glob, importlib
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H); D = f"{P}/authoring"
sys.path.insert(0, D); import bt_lib as L
for m in sorted(os.path.basename(f)[:-3] for f in glob.glob(f"{D}/cases_*.py")): importlib.import_module(m)
NEW_MD = open(f"{P}/sources/CONFLUENCE-1003585538-read-2026-11-14.md").read().split("## 9. Change Log")[0]
NEW_MD = re.sub(r"<(https?://[^>\s]+)>", r"\1", NEW_MD)
NEWW = L.ws(L.md_to_text(NEW_MD)); NEW_RAWW = L.ws(re.sub(r"<[^>]+>", "", re.sub(r"\[([^\]]*)\]\((https?:[^)]*)\)", r"\1", NEW_MD).replace("*Basis:*", "Basis:")))
def in_new(t): w = L.ws(t); return w in NEWW or w in NEW_RAWW
BAND_WORDS = re.compile(r"\bUnit 854\b|CV515|INTERNATIONAL|\bUnit\s*<unit>|<year>|\[unit\]|\byear, make\b|\bmake and model\b|\bunit, year\b|\bMake \"|\bModel \"|\" · \"|SERVICE FOR|Service For band|the band", re.I)
OLD_P4 = re.compile(r"bt-p4-\d\d-(before|after)-[a-z-]+\.png")
out = {}
for c in L.CASES:
    k = c["key"]; why = []
    for lab, t in L.quotes(c):
        if lab.startswith("Jira"): continue
        if not in_new(t): why.append(f"quote not in new copy: {lab}")
    codes = L.codes_of(c)
    s8 = sorted(x for x in codes if x.startswith("S8-") or x in ("KD-BAND", "CORE-7"))
    if s8: why.append("quotes " + ", ".join(s8))
    tester = " ".join([c["title"]] + c["pre"] + c["steps"] + [b for r in c["res"] for b in r] + [c["note"]])
    hits = sorted(set(m.group(0) for m in BAND_WORDS.finditer(tester)))
    if hits: why.append("tester text: " + ", ".join(hits))
    d = L.design_for(c) or {}
    blob = json.dumps(d, ensure_ascii=False)
    pics = sorted(set(m.group(0) for m in OLD_P4.finditer(blob)))
    if pics or 'page "4' in blob or "page 4" in blob: why.append("design refs page 4: " + ", ".join(pics))
    if why: out[k] = {"title": c["title"], "held": c["held"], "why": why}
json.dump(out, open(f"{H}/affected.json", "w"), indent=1, ensure_ascii=False)
print(len(out), "cases affected of", len(L.CASES))
for k, v in out.items(): print(f"{k:7} {'HELD ' if v['held'] else ''}{' | '.join(v['why'])[:230]}")
