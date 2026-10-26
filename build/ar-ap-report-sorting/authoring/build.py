#!/usr/bin/env python3
"""Build and check every A/R and A/P Report Sorting case. python3 build.py   (exit 1 on any PROBLEM line)
Gates: title <= 80 and no semicolon; design titles start "Design: "; steps = results, each "Step N:"; placeholders defined;
quotes verbatim in PRD v9 (or Chris Ward's answers, the Jira reading record, or the tech plan); every PRD code and every named PRD item (error handling, User Feedback
Summary rows, What changes, Out of Scope, key decisions) covered or listed as not testable with the reason; every report a
requirement names covered; one AUTOMATION line, last; the "From:" / build line / "References from Design" layout; exactly one
"Scenario:" line, first in the Preconditions, at most 40 words, with no requirement code, placeholder, "QA lead" or "ask your"
(Rule 117 thirteenth amendment, 26 Oct 2026)."""
import sys, json, os, importlib, re
from collections import Counter, defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ar_lib as L
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
tester_all = " ".join(" ".join(c["steps"] + c["res"]) for c in L.CASES)
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
    if not f["custom_preconds"].startswith('<p><strong><a href="'): probs.append(f"{c['key']}: setup-file link not first")
# ---- Rule 117 thirteenth amendment (26 Oct 2026): the Preconditions open with exactly one "Scenario:" line, first, at most 40 words,
# plain words only: no requirement code, no placeholder, no "QA lead", no "ask your"
SCEN_BAD = re.compile(r"\bS\d+-[RNE]\d+|\b(?:NFR|OOS|UFS|KD|EH)-?\d|\bSV-\d+|\{|\}|QA lead|ask your|\bask (?:the|a|your)\b|Rule \d", re.I)
for c in L.CASES:
    pc = L.render(c)["custom_preconds"]
    items = pc.split("<p><strong>Preconditions</strong></p><ul>", 1)[1].split("<li>")[1:]
    if pc.count("Scenario:") != 1 or sum(1 for x in items if x.startswith("Scenario:")) != 1:
        probs.append(f"{c['key']}: not exactly one Scenario line"); continue
    if not items[0].startswith("Scenario: "): probs.append(f"{c['key']}: Scenario line not first in Preconditions")
    s = c["scenario"]
    if not s.strip(): probs.append(f"{c['key']}: empty Scenario line")
    if len(s.split()) > 40: probs.append(f"{c['key']}: Scenario line {len(s.split())} words (limit 40)")
    if SCEN_BAD.search(s): probs.append(f"{c['key']}: Scenario line has {SCEN_BAD.search(s).group(0)!r}")
print("scenario lines", sum(1 for c in L.CASES if c["scenario"]), "| longest", max(len(c["scenario"].split()) for c in L.CASES), "words",
      "| over 25 words", sum(1 for c in L.CASES if len(c["scenario"].split()) > 25))
# ---- every column of every report is clicked in a Story 2 case for that report (S2-R1), and some click is a third click (S2-R2)
import common as CM
for code, r in CM.R.items():
    st = [x for c in L.CASES if c["sec"] == "S2" and code in L.reports_of(c) for x in c["steps"]]
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
