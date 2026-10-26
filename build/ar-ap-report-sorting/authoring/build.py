#!/usr/bin/env python3
"""Build and check every A/R and A/P Report Sorting case. python3 build.py   (exit 1 on any PROBLEM line)
Gates: title <= 80 and no semicolon; design titles start "Design: "; steps = results, each "Step N:"; placeholders defined;
quotes verbatim in PRD v9 (or Chris Ward's answers, the Jira reading record, or the tech plan); every PRD code and every named PRD item (error handling, User Feedback
Summary rows, What changes, Out of Scope, key decisions) covered or listed as not testable with the reason; every report a
requirement names covered; one AUTOMATION line, last; the "From:" / build line / "References from Design" layout; the PATTERN GATE
(Rule 117 fourteenth amendment, 26 Oct 2026, the QA lead's own pattern; it replaced the thirteenth amendment's Scenario gate): the
Preconditions are plain bullets only, with no "{", no "For example", no "Scenario:", no setup-file link and no who-to-ask, the Blocked
line last; the Expected Result opens "Expected Result", has a "Step N:" heading per step with a bullet list under it, then one blank
paragraph, then the quotes block, the design block and the AUTOMATION line exactly as ar_lib.tail() writes them."""
import sys, json, os, importlib, re
from collections import Counter, defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ar_lib as L
import pattern as PT
MODS = ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_s5", "cases_s6_s9", "cases_data", "cases_rel", "cases_design"]
MODS = [m for m in MODS if os.path.exists(f"{L.D}/{m}.py")]
for m in MODS: importlib.import_module(m)
SECS = json.load(open(f"{L.P}/sections.json"))
probs = [p for c in L.CASES for p in L.check(c)]
keys = [c["key"] for c in L.CASES]
dups = {k for k in keys if keys.count(k) > 1}
if dups: probs.append(f"duplicate keys {sorted(dups)}")
for c in L.CASES:
    if c["sec"] not in SECS: probs.append(f"{c['key']}: unknown section {c['sec']}")
    # Rule 136 (22 Oct 2026): a split case keeps its key and C-id as part 1; the other parts are new keys "<key>b" to "<key>e"
    if not re.match({"DATA": r"DATA-\d\d[b-e]?$", "REL": r"REL-\d\d[b-e]?$", "DESIGN": r"D-\d\d[b-e]?$"}.get(c["sec"], c["sec"] + r"-\d\d[b-e]?$"), c["key"]):
        probs.append(f"{c['key']}: key does not match section {c['sec']}")
# Rule 136: every split part sits next to its original key; a result or note never points at a step the case does not have
for c in L.CASES:
    m = re.match(r"(.*\d\d)([b-e])$", c["key"])
    if m and m.group(1) not in keys: probs.append(f"{c['key']}: split part without its original case {m.group(1)}")
    for t in c["res"] + [c["note"], c["known"]]:
        for n in re.findall(r"\b[Ss]teps? (\d+)", t):
            if int(n) > len(c["steps"]): probs.append(f"{c['key']}: text points at step {n}, the case has {len(c['steps'])} steps")
print("cases", len(L.CASES), dict(Counter(c["sec"] for c in L.CASES)))
# ---- coverage of PRD codes and named items
used = Counter(x for c in L.CASES for x in L.codes_of(c))
allitems = set(L.CODE) | set(L.NAMED)
missing = sorted(allitems - set(used) - set(L.NOT_TESTABLE), key=str)
print("PRD codes", len(L.CODE), "covered", len(set(L.CODE) & set(used)), "| named items", len(L.NAMED), "covered",
      len(set(L.NAMED) & set(used)), "| not testable", sorted(L.NOT_TESTABLE))
for m in missing: probs.append(f"PRD item {m} covered by no case and not listed as not testable")
# ---- every report a requirement names is covered
cov = defaultdict(set)
for c in L.CASES:
    for x in L.codes_of(c): cov[x] |= set(L.reports_of(c))
for code, need in L.NEEDS.items():
    gap = [L.REPORTS[r] for r in need if r not in cov[code]]
    if gap: probs.append(f"{code}: no case covers {', '.join(gap)}")
# ---- every PRD message is quoted word for word in some case's expected results or steps (brief point 6)
MSGS = ["This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.",
        "This report is too large to export. Choose an earlier as-of date, then try again.", "Switch location?",
        "This work order is in", "This part sale is in", "Collapse all", "Expand all", "Data exported successfully.", "Empty export",
        "Export didn't yield any results", "We couldn't export this report. Please try again.", "No record matches these filters",
        "Try changing filters to widen your results.", "Something went wrong loading this report. Please try again.",
        "All customers are included. Pick one or more to narrow.", "All vendors are included. Pick one or more to narrow.",
        "All ranges are included. Pick one or more to narrow.", "Clear all filters", "Clear selection", "Select all", "Search locations",
        "Search vendors", "Export report", "Download (PDF)", "Download (CSV)", "Switch location", "Cancel", "Multiple", "COD", "Phone: ",
        "Credit term: ", "Location: All locations", "Location: No locations", "Customer: All customers", "Vendor: All vendors",
        "Past due: Any", "Past due: 4 ranges", "91 And Over", "Locations: All locations", "As of Oct 15, 2026", "As of: Oct 15, 2026"]
PAT = {c["key"]: PT.pattern(c) for c in L.CASES}
tester_all = " ".join(" ".join(PAT[c["key"]]["steps"] + sum(PAT[c["key"]]["results"], [])) for c in L.CASES)
for m in MSGS:
    if m not in tester_all: probs.append(f"PRD message not used word for word in any case: {m!r}")
for code in ["S8-R1 " + r for r in L.ALL6]:
    t = L.SUB[code][1].split(": ", 1)[1].strip('"')
    if t not in tester_all: probs.append(f"{code}: description not quoted word for word in a step or result")
# ---- rendered layout gates (Rule 117 tenth and eleventh amendments; one AUTOMATION line, last)
for c in L.CASES:
    f = L.render(c); h = f["custom_expected"]
    if h.count("AUTOMATION: ") != 1 or not h.endswith(f"<p>{L.e(c['marker'])}</p>"): probs.append(f"{c['key']}: AUTOMATION line not single and last")
    if "Source &mdash;" in h or "where this behaviour comes from" in h: probs.append(f"{c['key']}: separate Source paragraph")
    q = h.split("Exact quotes from the source")[1].split("References from Design")[0]
    if not q.split("</strong></p>", 1)[1].startswith("<p>From: "): probs.append(f"{c['key']}: quotes do not start with a From line")
    if q.count("<p>From: ") != q.count("<ul>"): probs.append(f"{c['key']}: a quote group without its own From line")
    if "Epic SV-11315" not in q or L.NOBUILD not in q or "version 9" not in q: probs.append(f"{c['key']}: epic, version or build line missing")
    top = h.split("References from Design")[0]
    if "claude.ai/artifact" in top: probs.append(f"{c['key']}: design reference above the References from Design block")
    if "<p></p><p><strong>References from Design</strong></p>" not in h: probs.append(f"{c['key']}: no References from Design block")
# ---- PATTERN GATE (Rule 117 fourteenth amendment, 26 Oct 2026): replaces the thirteenth amendment's Scenario gate
BAD_PRE = re.compile(r"\{|\}|for example|Scenario:|href=|Setup file|QA lead|ask your|\bask (?:the|a|your)\b|set aside", re.I)
CODE_RE = re.compile(r"\bS\d+-[RNE]\d+|\bSV-\d+|Rule \d")
LI = r"<li>[^<]*</li>"
for c in L.CASES:
    k = c["key"]; f = L.render(c); p = PAT[k]
    pc = f["custom_preconds"]
    if not re.fullmatch(r"<p><strong>Preconditions</strong></p><ul>(?:" + LI + r")+</ul>", pc): probs.append(f"{k}: Preconditions are not plain bullets only")
    if BAD_PRE.search(pc): probs.append(f"{k}: Preconditions hold {BAD_PRE.search(pc).group(0)!r}")
    if p["pre"][-1] != PT.BLOCKED_NEW: probs.append(f"{k}: the Blocked line is not last")
    if len(p["title"]) > 80 or ";" in p["title"]: probs.append(f"{k}: title over 80 characters or has a semicolon")
    if c["sec"] == "DESIGN" and not p["title"].startswith("Design: "): probs.append(f"{k}: design title lost 'Design: '")
    if not re.fullmatch(r"<ol>(?:" + LI + r")+</ol>", f["custom_steps"]) or f["custom_steps"].count("<li>") != len(c["steps"]): probs.append(f"{k}: steps")
    words = " ".join(p["pre"] + p["steps"] + sum(p["results"], []))
    if "{" in words or "}" in words: probs.append(f"{k}: a placeholder in the tester's words")
    if CODE_RE.search(words): probs.append(f"{k}: requirement code or ticket in the tester's words: {CODE_RE.search(words).group(0)}")
    if L.JARGON.search(words): probs.append(f"{k}: technical term in the tester's words: {L.JARGON.search(words).group(0)}")
    if "ZZAUTOTEST" in words: probs.append(f"{k}: ZZAUTOTEST in the tester's words (it belongs in the setup file)")
    h = f["custom_expected"]
    head = "<p><strong>Expected Result</strong></p>" + "".join(f"<p>Step {i}:</p><ul>" + "".join(f"<li>{L.e(x)}</li>" for x in r) + "</ul>"
                                                             for i, r in enumerate(p["results"], 1)) + "<p></p>"
    if len(p["results"]) != len(c["steps"]) or any(not r for r in p["results"]): probs.append(f"{k}: a step without its Step N: bullets")
    if not h.startswith(head): probs.append(f"{k}: Expected Result does not open with the Step N: blocks and the blank paragraph")
    elif h[len(head):] != L.tail(c): probs.append(f"{k}: below the blank paragraph differs from the quotes / design / AUTOMATION block")
    elif not h[len(head):].startswith(("<p>", )) or "<p><strong>Exact quotes from the source" not in h[len(head):]: probs.append(f"{k}: no quotes block after the blank paragraph")
# ---- RELEVANCE AND INDEPENDENCE GATE (QA lead, 26 Oct 2026, permanent): (1) every record a precondition names (customer, vendor,
# invoice, bill, document, location, bucket, date, user, credit memo, deposit, vendor credit, role, work order + letter or number, or
# "the second ...") appears in the steps or expected results, or that bullet says why it is needed with a "so ..." clause; (2) no case
# key or C-id in the tester's words; (3) a step that changes a record (record, create, edit, delete, save, pay, void, receive) and a
# result that adds amounts up ("+" or "−" between amounts) need their records "created for this test" in the preconditions.
KEY_RE = re.compile(r"\b(?:S\d-\d\d|DATA-\d\d|REL-\d\d|D-\d\d)[b-e]?\b|\bC\d{5,7}\b")
CHANGE_RE = re.compile(r"\b(?:Record|Create|Edit|Delete|Save|Pay|Void|Receive)\b")
SUM_RE = re.compile(r"\d\.\d\d \+ |\d\.\d\d − |\+ \$?\d[\d,]*\.\d\d")
for c in L.CASES:
    k = c["key"]; p = PAT[k]
    for x, miss in PT.unrelated(p):
        probs.append(f"{k}: precondition names {', '.join(' '.join(m) for m in miss)}, which no step or result uses, and gives no 'so ...' reason: {x[:90]}")
    words = " ".join(p["pre"] + p["steps"] + sum(p["results"], []))
    if KEY_RE.search(words): probs.append(f"{k}: another case is named in the tester's words: {KEY_RE.search(words).group(0)}")
    pre = " ".join(p["pre"])
    for x in p["steps"]:
        if CHANGE_RE.search(x) and "created for this test" not in pre: probs.append(f"{k}: step changes a record not created for this test: {x[:80]}")
    if SUM_RE.search(" ".join(sum(p["results"], []))) and "created for this test" not in pre:
        probs.append(f"{k}: a result adds up amounts of records not created for this test")
print("relevance gate: precondition bullets", sum(len(p["pre"]) for p in PAT.values()), "| naming records",
      sum(1 for p in PAT.values() for x in p["pre"] if PT.records(x)), "| with a 'so' reason", sum(1 for p in PAT.values() for x in p["pre"] if PT.SO.search(x)),
      "| cases with records created for this test", sum(1 for p in PAT.values() if "created for this test" in " ".join(p["pre"])))
import pattern_layout as PLY
_conv = {b for c in L.CASES for r in PT.convert(c)["results"] for b in r}
for kk in PLY.RES_SPLIT:
    if kk not in _conv: probs.append(f"pattern_layout.RES_SPLIT entry matches no result any more: {kk[:70]}")
for kk in PLY.LAYOUT:
    if kk not in PAT: probs.append(f"pattern_layout.LAYOUT names a case that does not exist: {kk}")
print("pattern: cases", len(PAT), "| precondition bullets", sum(len(p["pre"]) for p in PAT.values()), "(most in one case:",
      max(len(p["pre"]) for p in PAT.values()), ") | result bullets", sum(len(b) for p in PAT.values() for b in p["results"]),
      "| cases corrected by hand", len(PLY.LAYOUT))
# ---- every column of every report is clicked in a Story 2 case for that report (S2-R1), and some click is a third click (S2-R2)
import common as CM
for code, r in CM.R.items():
    st = [x for c in L.CASES if c["sec"] == "S2" and code in L.reports_of(c) for x in PAT[c["key"]]["steps"]]
    for col in r["cols"]:
        lab = CM.namecol(code) if col == "name" else f'"{col}"'
        if not any(x.startswith("Click the") and lab in x for x in st): probs.append(f"{code}: column {col} is never clicked in a sort case")
    if not any("a third time" in x for x in st): probs.append(f"{code}: no third click in a sort case")
# ---- the tech plan (Rules 30, 115, 134): every testable statement has a verdict; every case it names exists; an ADD, CHANGE or DIVERGE
# statement is quoted word for word by a case it names (the quotes are checked against the plan in L.check)
import tech_plan as TP
BYKEY = {c["key"]: c for c in L.CASES}
for st in TP.S:
    if st["verdict"] not in ("CONFIRM", "ADD", "CHANGE", "DIVERGE", "EXCLUDED"): probs.append(f"{st['id']}: unknown verdict")
    if not st["reason"]: probs.append(f"{st['id']}: no reason")
    for k in st["cases"]:
        if k not in BYKEY and not k.startswith("all "): probs.append(f"{st['id']}: names case {k}, which does not exist")
    if st["verdict"] in ("ADD", "CHANGE", "DIVERGE"):
        if not any(isinstance(x, tuple) and x[0].startswith("Tech plan") for k in st["cases"] if k in BYKEY for x in BYKEY[k]["q"]):
            probs.append(f"{st['id']}: no case it names quotes the tech plan")
    if st["verdict"] == "EXCLUDED" and st["cases"]: probs.append(f"{st['id']}: EXCLUDED but names cases")
print("tech plan statements", len(TP.S), dict(Counter(st["verdict"] for st in TP.S)),
      "| cases quoting the tech plan", sum(1 for c in L.CASES if any(isinstance(x, tuple) and x[0].startswith("Tech plan") for x in c["q"])))
markers = Counter(c["marker"] for c in L.CASES)
print("markers", dict(markers))
over = [(c["key"], len(c["steps"])) for c in L.CASES if len(c["steps"]) > 10]
for k_, n_ in over: print(f"OVER-TARGET {k_}: {n_} steps (Rule 117 target about 10; split or kept whole under Rule 136, reason in rule136-2026-10-22/SPLITS.json)")
for p in probs: print("PROBLEM", p)
out = {c["key"]: dict(sec=c["sec"], section_id=SECS.get(c["sec"]), title=c["title"], refs=L.render(c)["refs"],
                      reports=[L.REPORTS[r] for r in L.reports_of(c)], codes=sorted(L.codes_of(c)), fields=L.render(c)) for c in L.CASES}
json.dump(out, open(f"{L.D}/proposals.json", "w"), indent=1, ensure_ascii=False)
# Rule 126: the design cases' sources also live in cases/design/
os.makedirs(f"{L.P}/cases/design", exist_ok=True)
json.dump({k: v for k, v in out.items() if v["sec"] == "DESIGN"}, open(f"{L.P}/cases/design/DESIGN-CASES.json", "w"), indent=1, ensure_ascii=False)
print("PROBLEM lines:", len(probs))
sys.exit(1 if probs else 0)
