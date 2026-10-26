#!/usr/bin/env python3
"""26 Oct 2026, Rule 117 thirteenth amendment (QA lead: "Preconditions should be like a scenario ..."), DRAFT ONLY, nothing written.
The six design-recheck cases live outside the library; their live bodies are design-recheck-2026-10-20/applied/C<id>-after.json.
For each, build the new Preconditions: the "Scenario:" line (authoring/scenarios.py) first, then the same lines in setup order (the
browser-window and design-pictures line moved to just above "Starting screen:", as the library does). Nothing else is changed: the
other fields are carried byte for byte. Output: DR-PROPOSALS.json {case_id: {custom_preconds, why}}."""
import os, sys, re, json, csv, html
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/authoring")
from scenarios import SCENARIO
A = f"{P}/design-recheck-2026-10-20/applied"
HEAD, TAIL = "<p><strong>Preconditions</strong></p><ul>", "</ul>"
out, probs = {}, []
for r in csv.DictReader(open(f"{P}/testrail-id-map.csv")):
    if not r["key"].startswith("DR-"): continue
    a = json.load(open(f"{A}/C{r['case_id']}-after.json"))
    h = a["custom_preconds"]
    if not (h.startswith(HEAD) and h.endswith(TAIL)): probs.append(f"{r['key']}: unexpected Preconditions HTML"); continue
    lis = re.findall(r"<li>.*?</li>", h[len(HEAD):-len(TAIL)], re.S)
    if HEAD + "".join(lis) + TAIL != h: probs.append(f"{r['key']}: Preconditions do not split cleanly into lines"); continue
    win = [x for x in lis if x.startswith("<li>The browser window is ")]
    rest = [x for x in lis if x not in win]
    i = next(n for n, x in enumerate(rest) if x.startswith("<li>Starting screen:"))
    new = HEAD + "<li>" + html.escape("Scenario: " + SCENARIO[r["key"]], quote=False) + "</li>" + "".join(rest[:i] + win + rest[i:]) + TAIL
    assert sorted(lis) == sorted(re.findall(r"<li>.*?</li>", new, re.S)[1:]), r["key"]  # every old line kept, none added but the Scenario
    out[r["case_id"]] = {"key": r["key"], "custom_preconds": new,
                         "why": "Rule 117 thirteenth amendment (26 Oct 2026): Scenario line added first; the browser-window and design-pictures line moved to just above the starting screen. No other line or field changed."}
json.dump(out, open(f"{D}/DR-PROPOSALS.json", "w"), indent=1, ensure_ascii=False)
for p in probs: print("PROBLEM", p)
print("design-recheck cases with new Preconditions:", len(out))
sys.exit(1 if probs else 0)
