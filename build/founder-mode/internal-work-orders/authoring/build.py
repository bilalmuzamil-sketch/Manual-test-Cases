#!/usr/bin/env python3
"""Build and check every Internal Work Orders case.   python3 build.py   (exit 1 on any PROBLEM line)
Loads EVERY authoring/cases_*.py module (so the design round's cases_design.py and the tech plan round's additions are picked up without an
edit here), then prints a PROBLEM line for: a title over 80 characters or with a semicolon; steps that do not equal results; a step with
two UI actions (Rule 135); a quote not word for word in PRD v1.0 (or the saved Jira tickets); a PRD code or named item neither covered nor
listed as not testable with its reason; a User Feedback Summary message not used word for word (fixed words exact, bracketed words free,
"..." free) in some step or result, unless it is asked on the PO sheet; the AUTOMATION line missing, doubled or not last; a {placeholder},
"For example:" or Blocked line in tester text; a case id in tester text; preconditions that are unrelated or not made fresh (Rule 137);
the "From:" / build line / "References from Design" layout; a release banner that is not first; a held-on-the-PO case naming a question
that does not exist, or a question that holds no case; an unknown section or a key that does not match its section; a FOLDER entry for a
key that does not exist. Writes proposals.json (one entry per case)."""
import sys, os, json, re, glob, importlib
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import iwo_lib as L
from po_questions import QUESTIONS, QN
MODS = sorted(os.path.basename(f)[:-3] for f in glob.glob(f"{D}/cases_*.py"))
ORDER = [f"cases_s{i}" for i in range(1, 14)] + ["cases_s12p", "cases_api", "cases_data", "cases_rel", "cases_inv", "cases_design"]
MODS = [m for m in ORDER if m in MODS] + [m for m in MODS if m not in ORDER]
for m in MODS: importlib.import_module(m)
SECS = json.load(open(f"{L.P}/sections.json"))["sections"]

probs = [p for c in L.CASES for p in L.check(c)]
keys = [c["key"] for c in L.CASES]
for k in sorted({k for k in keys if keys.count(k) > 1}): probs.append(f"duplicate key {k}")
titles = [c["title"] for c in L.CASES]
for t in sorted({t for t in titles if titles.count(t) > 1}): probs.append(f"duplicate title {t!r}")
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
QHELD = {i: [c["key"] for c in L.CASES if L.qnum(c) == i] for i in range(1, len(QUESTIONS) + 1)}
for i, ks in QHELD.items():
    if not ks: probs.append(f"question {i} holds no case (skill 07 §6: a question must decide a verdict)")

# ---- coverage of PRD codes and named items
used = Counter(x for c in L.CASES for x in L.codes_of(c))
items = set(L.CODE) | set(L.NAMED)
for k in sorted(items - set(used) - set(L.NOT_TESTABLE)): probs.append(f"PRD item {k} covered by no case and not listed as not testable")
for k in sorted(set(L.NOT_TESTABLE) & set(used)): probs.append(f"PRD item {k} is listed as not testable but a case quotes it")
for k in L.NOT_TESTABLE:
    if k not in items: probs.append(f"NOT_TESTABLE names {k}, which is not a PRD item")
# ---- every User Feedback Summary message is used in some case's steps or results: fixed words exact, [bracketed] words free, "..." free
ASKED = {"UFS-01": "modal-text", "UFS-10": "no-charge-document-case"}   # the summary's text differs from the story's: asked on the PO sheet
tester_all = " \n ".join(" ".join(c["steps"] + [b for r in c["res"] for b in r]) for c in L.CASES)
for k, (lab, row) in L.NAMED.items():
    if not re.match(r"UFS-\d\d$", k): continue
    if k in ASKED:
        if ASKED[k] not in QN: probs.append(f"{k}: listed as asked, but question {ASKED[k]} is not on the sheet")
        continue
    for msg in re.findall(r'"([^"]+)"', row.split(" | ")[1]):
        frags = [f.strip() for f in re.split(r"\.\.\.|…", msg) if f.strip()]
        for fr in frags:
            rx = re.sub(r"\\\[[^\]]*\\\]", ".+?", re.escape(fr).replace("\\ ", " "))
            if not re.search(rx, tester_all): probs.append(f"{k}: message not used word for word in any step or result: {fr!r}")
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
    if f"Epic {L.EPIC}" not in q or L.NOBUILD not in q or f"version {L.prd_version(c)}" not in q: probs.append(f"{k}: epic, PRD version or build line missing")
    if "claude.ai/artifact" in h.split("References from Design")[0]: probs.append(f"{k}: a design reference above the References from Design block")
    has = "<p></p><p><strong>References from Design</strong></p>" in h
    if L.design_for(c) and not has: probs.append(f"{k}: no References from Design block although a board applies")
    if not L.design_for(c) and "References from Design" in h: probs.append(f"{k}: a References from Design heading with no board behind it")
    pre = f["custom_preconds"]
    head = (f"<p><strong>{L.e(c['banner'])}</strong></p>" if c["banner"] else "") + "<p><strong>Preconditions</strong></p><ul><li>"
    if not (pre.startswith(head) and pre.endswith("</li></ul>")): probs.append(f"{k}: Preconditions not (banner,) one heading and one bullet list")
    if c["api"] and not re.search(r"\b(GET|PATCH|POST|PUT)\b|Open API|webhook", " ".join(c["steps"])): probs.append(f"{k}: an API case whose steps name no request")

# ---- folders (12 Nov 2026, standing choices applied unattended, as for Bill To on 10 Nov 2026): cases waiting on the PO, blocked on a
# release, or run on production after it live in their own TestRail folders; design cases waiting stay in "Design — how it looks".
FOLDER = {}
for c in L.CASES:
    if c["sec"] == "DESIGN": continue
    if c["marker"] == L.PRE_REL: FOLDER[c["key"]] = "PROD"
    elif c["banner"]: FOLDER[c["key"]] = "BLK"
    elif L.qnum(c): FOLDER[c["key"]] = "WAIT-PO"
for k in FOLDER:
    if k not in keys: probs.append(f"FOLDER names {k}, which is not a case")
    if FOLDER[k] not in SECS: probs.append(f"FOLDER {FOLDER[k]} is not in sections.json")

# ---- report and write
by_sec = Counter(c["sec"] for c in L.CASES); held = [c["key"] for c in L.CASES if c["held"]]
print("modules", MODS)
print("cases", len(L.CASES), dict(by_sec), "| held", len(held))
print("PRD codes", len(L.CODE), "covered", len(set(L.CODE) & set(used)), "| named items", len(L.NAMED), "covered", len(set(L.NAMED) & set(used)),
      "| not testable", len(L.NOT_TESTABLE))
print("markers", dict(Counter(re.sub(r"\(question \d+\)", "(question n)", re.sub(r": .*", ": …", c["marker"])) for c in L.CASES)))
print("folders", dict(Counter(FOLDER.values())))
out = {}
for c in L.CASES:
    f = L.render(c); sec = FOLDER.get(c["key"], c["sec"])
    out[c["key"]] = {"sec": sec, "story_sec": c["sec"], "section_name": SECS.get(sec, {}).get("name"), "section_id": SECS.get(sec, {}).get("id"),
                     "title": c["title"], "refs": f["refs"], "codes": sorted(L.codes_of(c)), "automation": c["marker"],
                     "held": c["held"], "api": c["api"], "prd_version": L.prd_version(c), "fields": f}
json.dump(out, open(f"{D}/proposals.json", "w"), indent=1, ensure_ascii=False)
for p in probs: print("PROBLEM", p)
print("PROBLEM lines:", len(probs))
sys.exit(1 if probs else 0)
