#!/usr/bin/env python3
"""Build and check every A/R and A/P Report Sorting case. python3 build.py   (exit 1 on any PROBLEM line)
Gates: title <= 80 and no semicolon; design titles start "Design: "; steps = results, each "Step N:"; placeholders defined;
quotes verbatim in PRD v5 (or the Jira reading record); every PRD code and every named PRD item (error handling, User Feedback
Summary rows, What changes, Out of Scope, key decisions) covered or listed as not testable with the reason; every report a
requirement names covered; one AUTOMATION line, last; the "From:" / build line / "References from Design" layout."""
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
    if not re.match({"DATA": r"DATA-\d\d$", "REL": r"REL-\d\d$", "DESIGN": r"D-\d\d$"}.get(c["sec"], c["sec"] + r"-\d\d$"), c["key"]):
        probs.append(f"{c['key']}: key does not match section {c['sec']}")
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
    if "Epic SV-11315" not in q or L.NOBUILD not in q or "version 5" not in q: probs.append(f"{c['key']}: epic, version or build line missing")
    top = h.split("References from Design")[0]
    if "claude.ai/artifact" in top: probs.append(f"{c['key']}: design reference above the References from Design block")
    if "<p></p><p><strong>References from Design</strong></p>" not in h: probs.append(f"{c['key']}: no References from Design block")
    if not f["custom_preconds"].startswith('<p><strong><a href="'): probs.append(f"{c['key']}: setup-file link not first")
# ---- every column of every report is clicked in a Story 2 case for that report (S2-R1), and some click is a third click (S2-R2)
import common as CM
for code, r in CM.R.items():
    st = [x for c in L.CASES if c["sec"] == "S2" and code in L.reports_of(c) for x in c["steps"]]
    for col in r["cols"]:
        lab = CM.namecol(code) if col == "name" else f'"{col}"'
        if not any(x.startswith("Click the") and lab in x for x in st): probs.append(f"{code}: column {col} is never clicked in a sort case")
    if not any("a third time" in x for x in st): probs.append(f"{code}: no third click in a sort case")
markers = Counter(c["marker"] for c in L.CASES)
print("markers", dict(markers))
for p in probs: print("PROBLEM", p)
out = {c["key"]: dict(sec=c["sec"], section_id=SECS.get(c["sec"]), title=c["title"], refs=L.render(c)["refs"],
                      reports=[L.REPORTS[r] for r in L.reports_of(c)], codes=sorted(L.codes_of(c)), fields=L.render(c)) for c in L.CASES}
json.dump(out, open(f"{L.D}/proposals.json", "w"), indent=1, ensure_ascii=False)
# Rule 126: the design cases' sources also live in cases/design/
os.makedirs(f"{L.P}/cases/design", exist_ok=True)
json.dump({k: v for k, v in out.items() if v["sec"] == "DESIGN"}, open(f"{L.P}/cases/design/DESIGN-CASES.json", "w"), indent=1, ensure_ascii=False)
print("PROBLEM lines:", len(probs))
sys.exit(1 if probs else 0)
