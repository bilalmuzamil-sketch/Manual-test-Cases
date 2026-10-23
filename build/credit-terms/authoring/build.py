#!/usr/bin/env python3
"""Build and check every Credit terms case. python3 build.py   (exit 1 on any PROBLEM line)
Gates: title <= 80 and no semicolon; steps = results, each "Step N:"; no step with two UI actions (Rule 135); placeholders defined and
named name-hyphen-letter/number; quotes verbatim in PRD v3 (or the saved Jira stories); every PRD code and every named PRD item (error
handling, User Feedback Summary rows, Key Decisions, Permissions, Terminology, Assumptions, Goals, Out of Scope) covered or listed as not
testable with the reason; every User Feedback Summary message used word for word in a step or result; one AUTOMATION line, last;
the "From:" / build line / "References from Design" layout; a held-on-the-PO case names a question that exists.
Writes proposals.json (one entry per case: section key, title, refs, the three HTML fields, automation marker, held flag)."""
import sys, json, os, importlib, re
from collections import Counter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ct_lib as L
from po_questions import QUESTIONS
MODS = ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_s5", "cases_s6", "cases_s7", "cases_s8", "cases_s9", "cases_s10",
        "cases_s11", "cases_s12", "cases_data", "cases_design"]
MODS = [m for m in MODS if os.path.exists(f"{L.D}/{m}.py")]
for m in MODS: importlib.import_module(m)
SECS = json.load(open(f"{L.P}/sections.json"))
probs = [p for c in L.CASES for p in L.check(c)]
keys = [c["key"] for c in L.CASES]
dups = {k for k in keys if keys.count(k) > 1}
if dups: probs.append(f"duplicate keys {sorted(dups)}")
for c in L.CASES:
    if c["sec"] not in SECS: probs.append(f"{c['key']}: section {c['sec']} unknown")
    if not re.match({"DESIGN": r"D-\d\d[b-e]?$"}.get(c["sec"], c["sec"] + r"-\d\d[b-e]?$"), c["key"]): probs.append(f"{c['key']}: key does not match section {c['sec']}")
    for t in c["res"] + [c["note"]]:
        for n in re.findall(r"\bSteps? (\d+)", t):
            if int(n) > len(c["steps"]): probs.append(f"{c['key']}: text points at step {n}, the case has {len(c['steps'])} steps")
    m = re.search(r"question (\d+)", c["marker"])
    if m and not (1 <= int(m.group(1)) <= len(QUESTIONS)): probs.append(f"{c['key']}: marker names question {m.group(1)}, which does not exist")
print("cases", len(L.CASES), dict(Counter(c["sec"] for c in L.CASES)))
# ---- coverage of PRD codes and named items
used = Counter(x for c in L.CASES for x in L.codes_of(c))
allitems = set(L.CODE) | set(L.NAMED)
missing = sorted(allitems - set(used) - set(L.NOT_TESTABLE), key=str)
nt_used = sorted(set(L.NOT_TESTABLE) & set(used))
print("PRD codes", len(L.CODE), "covered", len(set(L.CODE) & set(used)), "| named items", len(L.NAMED), "covered",
      len(set(L.NAMED) & set(used)), "| not testable", len(L.NOT_TESTABLE), sorted(L.NOT_TESTABLE))
for m in missing: probs.append(f"PRD item {m} covered by no case and not listed as not testable")
for m in nt_used: probs.append(f"PRD item {m} is listed as not testable but a case quotes it")
for k in L.NOT_TESTABLE:
    if k not in allitems: probs.append(f"NOT_TESTABLE names {k}, which is not a PRD item")
unused_sub = sorted(set(L.SUB) - set(used))
for s in unused_sub: probs.append(f"sub-item {s} quoted by no case")
# ---- every User Feedback Summary message is used word for word in some case's steps or results (with its trigger)
tester_all = " ".join(" ".join(c["steps"] + c["res"]) for c in L.CASES)
def msgs(row):
    cell = row.split(" | ")[1]
    return [m for m in re.findall(r'"([^"]+)"', cell) if "{" not in m]
for k, (lab, row) in L.NAMED.items():
    if not k.startswith("UFS-"): continue
    for m in msgs(row):
        if m not in tester_all and m.replace("$", "$") not in tester_all: probs.append(f"{k}: message not used word for word in any step or result: {m!r}")
# ---- rendered layout gates (Rule 117 tenth and eleventh amendments; one AUTOMATION line, last)
for c in L.CASES:
    f = L.render(c); h = f["custom_expected"]
    if h.count("AUTOMATION: ") != 1 or not h.endswith(f"<p>{L.e(c['marker'])}</p>"): probs.append(f"{c['key']}: AUTOMATION line not single and last")
    if "Source &mdash;" in h or "where this behaviour comes from" in h: probs.append(f"{c['key']}: separate Source paragraph")
    q = h.split("Exact quotes from the source")[1].split("References from Design")[0]
    if not q.split("</strong></p>", 1)[1].startswith("<p>From: "): probs.append(f"{c['key']}: quotes do not start with a From line")
    if q.count("<p>From: ") != q.count("<ul>"): probs.append(f"{c['key']}: a quote group without its own From line")
    if f"Epic {L.EPIC}" not in q or L.NOBUILD not in q or "version 3" not in q: probs.append(f"{c['key']}: epic, version or build line missing")
    if "claude.ai/artifact" in h.split("References from Design")[0]: probs.append(f"{c['key']}: design reference above the References from Design block")
    if "<p></p><p><strong>References from Design</strong></p>" not in h: probs.append(f"{c['key']}: no References from Design block")
    if not f["custom_preconds"].startswith('<p><strong><a href="'): probs.append(f"{c['key']}: setup-file link not first")
    if not c["pre"][-1][0] == L.BLOCKED: probs.append(f"{c['key']}: the Blocked line is not last")
# ---- design references (design pass): DREFS keys exist, every picture named exists in design-2026-10-23/images/, design cases have refs
for k, d in L.DREFS.items():
    if k not in keys: probs.append(f"DREFS names case {k}, which does not exist")
    if set(d) - {"pages", "pictures", "words"}: probs.append(f"DREFS {k}: unknown fields {sorted(set(d) - {'pages', 'pictures', 'words'})}")
    for pic in d.get("pictures", []):
        if not os.path.isfile(os.path.join(L.DESIGN_IMAGES, pic)): probs.append(f"DREFS {k}: picture {pic} not in design-2026-10-23/images/")
for c in L.CASES:
    if c["sec"] == "DESIGN":
        if not c["title"].startswith("Design: "): probs.append(f"{c['key']}: design case title must start 'Design: '")
        if not L.DREFS.get(c["key"], {}).get("pictures"): probs.append(f"{c['key']}: design case without a picture in DREFS")
print("design refs", len(L.DREFS), "| design cases", sum(1 for c in L.CASES if c["sec"] == "DESIGN"))
markers = Counter(c["marker"] for c in L.CASES)
print("markers", dict(markers))
over = [(c["key"], len(c["steps"])) for c in L.CASES if len(c["steps"]) > 10]
for k_, n_ in over: print(f"OVER-TARGET {k_}: {n_} steps (Rule 117 target about 10; kept whole: the steps need each other, Rule 136)")
for p in probs: print("PROBLEM", p)
out = {}
for c in L.CASES:
    f = L.render(c)
    out[c["key"]] = dict(sec=c["sec"], section_id=SECS.get(c["sec"]), title=c["title"], refs=f["refs"], codes=sorted(L.codes_of(c)),
                         automation=c["marker"], held=c["marker"] != L.MARKER, api=c["api"], fields=f)
json.dump(out, open(f"{L.D}/proposals.json", "w"), indent=1, ensure_ascii=False)
print("PROBLEM lines:", len(probs))
sys.exit(1 if probs else 0)
