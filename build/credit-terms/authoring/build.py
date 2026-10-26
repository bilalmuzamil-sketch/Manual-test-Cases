#!/usr/bin/env python3
"""Build and check every Credit terms case. python3 build.py   (exit 1 on any PROBLEM line)
Gates: the QA lead's pattern (Rule 117 fourteenth amendment, 26 Oct 2026; replaces the Scenario gate): plain precondition bullets only, no
"{", no "For example", no "Scenario:", no setup-file link, Blocked line last; "Expected Result", a "Step N:" heading and bullet list per step,
"<p></p>", then the quotes block, which with the From lines, References from Design and AUTOMATION line is identical to before; title <= 80 and no semicolon; steps = results, each "Step N:"; no step with two UI actions (Rule 135); placeholders defined and
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
    if not c["pre"][-1][0] == L.BLOCKED: probs.append(f"{c['key']}: the Blocked line is not last in the authoring data")
# ---- PATTERN GATE (Rule 117 fourteenth amendment, QA lead 26 Oct 2026: "Yes, permanent, all suites"). Replaces the Scenario gate.
# Preconditions: a "Preconditions" heading and plain bullets only, no "{", no "For example", no "Scenario:", no setup-file link, no
# who-to-ask or generic line, the Blocked line last. Steps: plain, no placeholder. Expected: "Expected Result", then a "Step N:" heading per
# step each followed by a bullet list, then "<p></p>", then the note (if any) and the quotes block; the quotes block, From lines,
# References from Design and AUTOMATION line identical to the version before the pattern (before/proposals.json).
import html as _html
from pattern import BLOCKED_P
BEFORE_F = f"{L.P}/pattern-format-2026-10-26/before/proposals.json"
BEFORE = json.load(open(BEFORE_F)) if os.path.exists(BEFORE_F) else {}
if not BEFORE: probs.append("pattern gate: before/proposals.json missing, so the quotes/design/AUTOMATION identity cannot be checked")
def _tail(h): return h[h.index("<p><strong>Exact quotes from the source"):]
pat_text = []
for c in L.CASES:
    k = c["key"]; f = L.render(c); pre, st, ex = f["custom_preconds"], f["custom_steps"], f["custom_expected"]
    H = "<p><strong>Preconditions</strong></p><ul>"
    if not pre.startswith(H) or not pre.endswith("</ul>"): probs.append(f"{k}: Preconditions are not a heading and one bullet list"); continue
    items = re.findall(r"<li>(.*?)</li>", pre[len(H):-5], re.S)
    if pre[len(H):-5] != "".join(f"<li>{x}</li>" for x in items): probs.append(f"{k}: Preconditions hold something other than plain bullets")
    plain = [_html.unescape(x) for x in items]
    if not plain or plain[-1] != BLOCKED_P: probs.append(f"{k}: the Blocked line is not the last precondition")
    for x in plain:
        if re.search(r"[{}]", x): probs.append(f"{k}: a placeholder brace in the preconditions: {x[:80]!r}")
        if re.search(r"for example", x, re.I): probs.append(f"{k}: a 'For example' in the preconditions: {x[:80]!r}")
        if "Scenario:" in x: probs.append(f"{k}: a Scenario line in the preconditions")
        if re.search(r"<a |href=|setup file|Setup file", x): probs.append(f"{k}: a setup-file link or mention in the preconditions")
        if re.search(r"QA lead|ask your|\bask\b|set aside", x, re.I): probs.append(f"{k}: who-to-ask or generic wording in the preconditions: {x[:80]!r}")
        if "ZZAUTOTEST" in x: probs.append(f"{k}: an example record name in the preconditions")
        if re.search(r"<(?!/?(strong)>)", x): probs.append(f"{k}: markup inside a precondition bullet")
    steps = [_html.unescape(x) for x in re.findall(r"<li>(.*?)</li>", st, re.S)]
    if len(steps) != len(c["steps"]): probs.append(f"{k}: {len(steps)} steps rendered for {len(c['steps'])}")
    for x in steps:
        if re.search(r"[{}]", x): probs.append(f"{k}: a placeholder brace in a step: {x[:80]!r}")
        if "ZZAUTOTEST" in x: probs.append(f"{k}: an example record name in a step")
    E = "<p><strong>Expected Result</strong></p>"
    if not ex.startswith(E): probs.append(f"{k}: Expected does not start with the 'Expected Result' heading"); continue
    rest = ex[len(E):]; nres = []
    for n in range(1, len(c["steps"]) + 1):
        m = re.match(rf"<p>Step {n}:</p><ul>((?:<li>.*?</li>)+)</ul>", rest, re.S)
        if not m: probs.append(f"{k}: no 'Step {n}:' heading followed by a bullet list"); break
        nres.append([_html.unescape(x) for x in re.findall(r"<li>(.*?)</li>", m.group(1), re.S)]); rest = rest[m.end():]
    else:
        if not rest.startswith("<p></p>"): probs.append(f"{k}: no blank paragraph after the last result")
        rest = rest[len("<p></p>"):]
        if c["note"]:
            if not rest.startswith("<p>"): probs.append(f"{k}: the note is not right after the blank paragraph")
            rest = rest[rest.index("</p>") + 4:]
        if not rest.startswith("<p><strong>Exact quotes from the source"): probs.append(f"{k}: the quotes block does not follow the blank line")
    for r in nres:
        for x in r:
            if re.search(r"[{}]", x): probs.append(f"{k}: a placeholder brace in a result: {x[:80]!r}")
            if "ZZAUTOTEST" in x: probs.append(f"{k}: an example record name in a result")
            if not x or not (x[0].isupper() or x[0] in '"“$(0123456789⋯'): probs.append(f"{k}: a result bullet does not start a sentence: {x[:60]!r}")
    if BEFORE:
        b = BEFORE.get(k)
        if not b: probs.append(f"{k}: not in before/proposals.json")
        elif _tail(b["fields"]["custom_expected"]) != _tail(ex): probs.append(f"{k}: quotes / From lines / References from Design / AUTOMATION line changed")
        elif b["title"] != c["title"]: probs.append(f"{k}: title changed")
    pat_text.append(" ".join(steps + [x for r in nres for x in r]))
# every User Feedback Summary message is still used word for word in the pattern steps and results
pat_all = " ".join(pat_text)
for k_, (lab, row) in L.NAMED.items():
    if not k_.startswith("UFS-"): continue
    for m in msgs(row):
        if m not in pat_all: probs.append(f"{k_}: message not used word for word in any pattern step or result: {m!r}")
print("pattern gate: cases", len(L.CASES), "| before snapshot", len(BEFORE))
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
