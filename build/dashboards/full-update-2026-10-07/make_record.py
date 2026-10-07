#!/usr/bin/env python3
"""Write FULL-UPDATE-2026-10-07.md: every case touched or added, with title, C-id, link, marker and section."""
import json, glob, re
L = json.load(open("applied/apply-log.json"))
live = {json.load(open(f))["id"]: json.load(open(f)) for f in glob.glob("live-after/*.json")}
U = "https://shopview.testrail.io/index.php?/cases/view/"
def mk(c): return re.findall(r"AUTOMATION: [^<]*", c["custom_expected"])[0].replace("AUTOMATION: ", "")
rows = []
for x in L:
    cid = int(x["case"][1:]); c = live[cid]
    rows.append((c["section_id"], x["op"], cid, c["title"], mk(c), "yes" if x.get("automated") else ""))
rows.sort()
out = ["# Dashboard v1 — full update, 7 October 2026 (written to TestRail)", "",
 "QA lead order: *\"Update Dashboard. Also make sure that you never do anything in DELTA mode, you fully drive the design and create/edit the test cases as needed to make them runnable for the manual QA tester.\"*", "",
 f"**{sum(r[1]=='update' for r in rows)} of our cases rewritten in full** (every one of our 61, not only where the sources changed) and **{sum(r[1]=='add' for r in rows)} new cases added**. Every write was snapshotted before and after and read back: {sum(x['verified'] for x in L)}/{len(L)} match. Foreign cases (C137997, C137998, C137999, C327128 — Vladimir's) were not touched.", "",
 "Sources: PRD v42 (Confluence 788430850, read 7 Oct 2026, 100%), the PO's Slack decision on empty states (Chris Ward, 7 Oct 2026), design canvas Wae9DFQ8PJQBy8mbLsL5ge (50 boards), before/after page KqefWwaQHKjXed3hPULU8Z, tech plan (100%).", "",
 "| Section | Change | Case | Title | Automation marker | Automated in TestRail |", "|---|---|---|---|---|---|"]
for s, op, cid, t, m, a in rows:
    out.append(f"| {s} | {'rewritten' if op=='update' else 'NEW'} | [C{cid}]({U}{cid}) | {t} | {m} | {a} |")
open("FULL-UPDATE-2026-10-07.md", "w").write("\n".join(out) + "\n")
print(len(rows), "rows")
# appendix: every worker note, verbatim, so nothing is lost
app = ["", "## Coverage against PRD v42", "",
 "146 of 146 v42 anchors are quoted by at least one case (`coverage_v42_after.py` → `coverage-v42-after.json`). The script's 21 'stale' flags are all formula-table rows (S3-R2) or context notes quoted under their anchor; each was confirmed word for word in v42 by `apply_full_update.py` before writing. The six genuinely stale quotes found before the update (S3-E3 in C88603/C88640/C88646, S4-R11 in C88606/C88647/C88650) are gone.", "",
 "## Every note the three drafting passes raised (verbatim)", ""]
for f in sorted(glob.glob("proposals-*.json")):
    d = json.load(open(f)); app += [f"### {f}", "", f"Reading coverage: {d.get('reading_coverage','')}", ""] + [f"- {n}" for n in d.get("notes", [])] + [""]
open("FULL-UPDATE-2026-10-07.md", "a").write("\n".join(app) + "\n")
