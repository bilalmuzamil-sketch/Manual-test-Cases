#!/usr/bin/env python3
"""Build and check every Technician Toggle case.   python3 build.py   (exit 1 on any PROBLEM line)
Loads every authoring/cases_*.py module (so a later cases_design.py is picked up), then prints a PROBLEM line for: a title over 80
characters or with a semicolon; steps that do not equal results; a step with two UI actions (Rule 135); a quote not word for word in
PRD v17 (or the saved Jira tickets / tech plan); a PRD code or named item neither covered nor listed as not testable with its reason;
a User Feedback Summary message not used word for word in a step or result; the AUTOMATION line missing, doubled or not last; a
{placeholder}, "For example:" or Blocked line in tester text; a case id in tester text; preconditions that are unrelated or not made
fresh (Rule 137); the "From:" / build line / "References from Design" layout; a held-on-the-PO case naming a question that does not
exist; an unknown section or a key that does not match its section. Writes proposals.json (one entry per case)."""
import sys, os, json, re, glob, importlib, html
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import tt_lib as L
from po_questions import QUESTIONS
MODS = sorted(os.path.basename(f)[:-3] for f in glob.glob(f"{D}/cases_*.py"))
ORDER = ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_api", "cases_s6", "cases_inv"]
MODS = [m for m in ORDER if m in MODS] + [m for m in MODS if m not in ORDER]
for m in MODS: importlib.import_module(m)
SECS = json.load(open(f"{L.P}/sections.json"))["sections"]

probs = [p for c in L.CASES for p in L.check(c)]
keys = [c["key"] for c in L.CASES]
for k in sorted({k for k in keys if keys.count(k) > 1}): probs.append(f"duplicate key {k}")
for c in L.CASES:
    if c["sec"] not in SECS: probs.append(f"{c['key']}: section {c['sec']} unknown")
    rx = {"DESIGN": r"D-\d\d[b-e]?$"}.get(c["sec"], re.escape(c["sec"]) + r"-\d\d[b-e]?$")
    if not re.match(rx, c["key"]): probs.append(f"{c['key']}: key does not match section {c['sec']}")
    for t in [b for r in c["res"] for b in r] + [c["note"]]:
        for n in re.findall(r"\bSteps? (\d+)", t):
            if int(n) > len(c["steps"]): probs.append(f"{c['key']}: text points at step {n}; the case has {len(c['steps'])} steps")
    m = re.search(r"question (\d+)", c["marker"])
    if m and not 1 <= int(m.group(1)) <= len(QUESTIONS): probs.append(f"{c['key']}: marker names question {m.group(1)}, which does not exist")
    if "waiting on the PO" in c["marker"] and not c["held"]: probs.append(f"{c['key']}: held on the PO but not flagged held")

# ---- coverage of PRD codes, named items and sub-items
used = Counter(x for c in L.CASES for x in L.codes_of(c))
items = set(L.CODE) | set(L.NAMED) | set(L.SUB)
for k in sorted(items - set(used) - set(L.NOT_TESTABLE)): probs.append(f"PRD item {k} covered by no case and not listed as not testable")
for k in sorted(set(L.NOT_TESTABLE) & set(used)): probs.append(f"PRD item {k} is listed as not testable but a case quotes it")
for k in L.NOT_TESTABLE:
    if k not in items: probs.append(f"NOT_TESTABLE names {k}, which is not a PRD item")
# ---- every User Feedback Summary message is used word for word in some case's steps or results
tester_all = " ".join(" ".join(c["steps"] + [b for r in c["res"] for b in r]) for c in L.CASES)
for k, (lab, row) in L.NAMED.items():
    if not k.startswith("UFS-"): continue
    for msg in re.findall(r'"([^"]+)"', row.split(" | ")[1]):
        if "[" in msg: continue
        if msg not in tester_all: probs.append(f"{k}: message not used word for word in any step or result: {msg!r}")
# ---- rendered layout gates
for c in L.CASES:
    f = L.render(c); h = f["custom_expected"]; k = c["key"]
    if h.count("AUTOMATION: ") != 1 or not h.endswith(f"<p>{L.e(c['marker'])}</p>"): probs.append(f"{k}: AUTOMATION line not single and last")
    if not h.startswith("<p><strong>Expected Result</strong></p><p>Step 1:</p><ul>"): probs.append(f"{k}: Expected does not open with 'Expected Result' and 'Step 1:'")
    for i in range(1, len(c["steps"]) + 1):
        if f"<p>Step {i}:</p><ul>" not in h: probs.append(f"{k}: no 'Step {i}:' heading with bullets")
    if "<p></p><p><strong>Exact quotes" not in h and "<p></p><p>" + L.e(c["note"]) + "</p><p><strong>Exact quotes" not in h:
        probs.append(f"{k}: no blank line between the results and the quotes")
    q = h.split("Exact quotes from the source")[1].split("References from Design")[0]
    if not q.split("</strong></p>", 1)[1].startswith("<p>From: "): probs.append(f"{k}: quotes do not start with a From line")
    if q.count("<p>From: ") != q.count("<ul>"): probs.append(f"{k}: a quote group without its own From line")
    if f"Epic {L.EPIC}" not in q or L.NOBUILD not in q or "version 17" not in q: probs.append(f"{k}: epic, PRD version or build line missing")
    if "claude.ai/artifact" in h.split("References from Design")[0]: probs.append(f"{k}: a design reference above the References from Design block")
    if "<p></p><p><strong>References from Design</strong></p>" not in h: probs.append(f"{k}: no References from Design block")
    pre = f["custom_preconds"]
    if not (pre.startswith("<p><strong>Preconditions</strong></p><ul><li>") and pre.endswith("</li></ul>")): probs.append(f"{k}: Preconditions not one heading and one bullet list")
    if c["api"] and not re.search(r"\b(GET|PATCH|POST|PUT)\b|Public API", " ".join(c["steps"])): probs.append(f"{k}: an API case whose steps name no request")

# ---- report and write
by_sec = Counter(c["sec"] for c in L.CASES); held = [c["key"] for c in L.CASES if c["held"]]
print("modules", MODS)
print("cases", len(L.CASES), dict(by_sec), "| held", len(held))
print("PRD codes", len(L.CODE), "covered", len(set(L.CODE) & set(used)), "| named items", len(L.NAMED), "covered", len(set(L.NAMED) & set(used)),
      "| sub-items", len(L.SUB), "covered", len(set(L.SUB) & set(used)), "| not testable", sorted(L.NOT_TESTABLE))
print("markers", dict(Counter(re.sub(r"\(question \d+\)", "(question n)", c["marker"]) for c in L.CASES)))
out = {}
for c in L.CASES:
    f = L.render(c)
    out[c["key"]] = {"sec": c["sec"], "section_name": SECS.get(c["sec"], {}).get("name"), "section_id": SECS.get(c["sec"], {}).get("id"),
                     "title": c["title"], "refs": f["refs"], "codes": sorted(x for x in L.codes_of(c)), "automation": c["marker"],
                     "held": c["held"], "api": c["api"], "fields": f}
json.dump(out, open(f"{D}/proposals.json", "w"), indent=1, ensure_ascii=False)
for p in probs: print("PROBLEM", p)
print("PROBLEM lines:", len(probs))
sys.exit(1 if probs else 0)
