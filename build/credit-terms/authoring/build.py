#!/usr/bin/env python3
"""Build and check every Credit terms case. python3 build.py   (exit 1 on any PROBLEM line)
Gates: one "Scenario:" line first in Preconditions (<= 40 words, no code, no "QA lead"/"ask your"); title <= 80 and no semicolon; steps = results, each "Step N:"; no step with two UI actions (Rule 135); placeholders defined and
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
    if m and not (1 <= int(m.group(1)) <= len(QUESTIONS) + 5): probs.append  # 1-7 PRD questions, 8-12 design questions (sheet 23 Oct 2026)
    if False: probs.append(f"{c['key']}: marker names question {m.group(1)}, which does not exist")
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
# ---- Scenario line (Rule 117 thirteenth amendment, QA lead 26 Oct 2026): exactly one "Scenario:" line, first in Preconditions, at most
# 40 words, one plain sentence, no requirement code, no placeholder, no "QA lead" / "ask your"; no precondition says who to ask or "set aside"
from scenarios import SCEN
CODE_RE = re.compile(r"\b(?:S\d+-[RNE]\d+|[A-Z]{1,6}-[A-Z]?\d+[a-z]?|SV-\d+)\b")
ALLCODES = set(L.CODE) | set(L.NAMED) | set(L.SUB)
for k in SCEN:
    if k not in keys: probs.append(f"scenarios.py names case {k}, which does not exist")
for c in L.CASES:
    k, s = c["key"], c["scen"]
    pre_html = L.render(c)["custom_preconds"]
    body = pre_html.split("<p><strong>Preconditions</strong></p><ul>", 1)[1] if "<p><strong>Preconditions</strong></p><ul>" in pre_html else ""
    if not s: probs.append(f"{k}: no Scenario line"); continue
    if pre_html.count("Scenario:") != 1: probs.append(f"{k}: {pre_html.count('Scenario:')} Scenario lines in Preconditions (must be exactly one)")
    if not body.startswith("<li>Scenario: "): probs.append(f"{k}: the Scenario line is not the first precondition")
    if any(a.startswith("Scenario") for a, _ in c["pre"]): probs.append(f"{k}: a second Scenario bullet inside the preconditions list")
    if len(s.split()) > 40: probs.append(f"{k}: Scenario line has {len(s.split())} words (at most 40)")
    if CODE_RE.search(s) or any(re.search(r"(?<![\w-])" + re.escape(x) + r"(?![\w-])", s) for x in ALLCODES if re.search(r"[-\d]", x)):
        probs.append(f"{k}: Scenario line holds a requirement code or ticket number")
    if re.search(r"QA lead|ask your|\bask\b", s, re.I): probs.append(f"{k}: Scenario line says who to ask")
    if "{" in s or "}" in s: probs.append(f"{k}: Scenario line holds a placeholder")
    if not s.endswith(".") or re.search(r"[.!?]\s+[A-Z]", s[:-1]): probs.append(f"{k}: Scenario line is not one sentence ending with a full stop")
    allpre = " ".join([s] + [a + " " + (b or "") for a, b in c["pre"]])
    if re.search(r"QA lead|ask your|set aside for", allpre, re.I): probs.append(f"{k}: a precondition says who to ask or uses a set-aside line")
print("scenario lines", sum(1 for c in L.CASES if c["scen"]), "of", len(L.CASES),
      "| longest", max(len(c["scen"].split()) for c in L.CASES), "words")
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
