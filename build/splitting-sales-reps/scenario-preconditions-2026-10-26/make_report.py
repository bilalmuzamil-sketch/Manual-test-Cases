#!/usr/bin/env python3
"""26 Oct 2026: PASS-REPORT.md for the scenario-preconditions pass (Rule 117 thirteenth amendment). DRAFT, nothing written anywhere.
Compares, for all 180 cases of testrail-id-map.csv, the rendered fields before (before/proposals-before.json = the live bodies, last
read back; before/C<id>-after.json for the six design-recheck cases) and after (authoring/proposals.json; DR-PROPOSALS.json), shows
old and new Preconditions side by side, proves every field other than custom_preconds is byte-identical, proves every old
precondition line is kept, and checks the setup file's recipe for each case lists exactly the new precondition lines."""
import os, sys, re, json, csv, html
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
B = json.load(open(f"{D}/before/proposals-before.json")); A = json.load(open(f"{P}/authoring/proposals.json"))
DRP = json.load(open(f"{D}/DR-PROPOSALS.json"))
rows = list(csv.DictReader(open(f"{P}/testrail-id-map.csv")))
lines = lambda h: [html.unescape(re.sub(r"<[^>]+>", " ", x.replace("<br>", "\n"))).strip() for x in re.findall(r"<li>(.*?)</li>", h, re.S)]
setup = open(f"{P}/SPLITTING-SALES-REPS-SETUP-FILE.md").read()
def recipe(key):
    m = re.search(rf"^#### SETUP-{re.escape(key)} .*?\nSatisfies these precondition lines, exactly as the case states them:\n(.*?)\nProcedures:", setup, re.S | re.M)
    return [x[2:] for x in m.group(1).split("\n")] if m else None
FIELDS_LIB = ["title", "template_id", "type_id", "priority_id", "refs", "custom_automation_type", "custom_atmstatus", "custom_steps", "custom_expected"]
other_changed, lost, reworded, recipe_bad, out = [], [], [], [], []
for r in rows:
    k, cid = r["key"], r["case_id"]
    if k.startswith("DR-"):
        b = json.load(open(f"{D}/before/C{cid}-after.json")); p = DRP[cid]
        a = dict(b, custom_preconds=p["custom_preconds"])
        extra = [x for x in p if x not in ("key", "custom_preconds", "why")]
        if extra: other_changed.append((k, cid, extra))
        flds = [f for f in b if f != "custom_preconds"]
    else:
        b, a = B[k]["fields"], A[k]["fields"]; flds = [f for f in set(b) | set(a) if f != "custom_preconds"]
    diff = sorted(f for f in flds if b.get(f) != a.get(f))
    if diff: other_changed.append((k, cid, diff))
    ol, nl = lines(b["custom_preconds"]), lines(a["custom_preconds"])
    keep = [x for x in nl if not x.startswith("Scenario: ")]
    gone = [x for x in ol if x not in keep]; new = [x for x in keep if x not in ol]
    if gone or new: reworded.append((k, cid, gone, new))
    words_old = re.sub(r"[^\w{}]+", " ", " ".join(ol)).lower().split(); words_new = re.sub(r"[^\w{}]+", " ", " ".join(keep)).lower().split()
    if sorted(words_old) != sorted(words_new): lost.append((k, cid))
    rc = recipe(k)
    flat = [x.replace("\n", " ") for x in nl]
    if rc != flat: recipe_bad.append((k, cid))
    out.append((k, cid, r["title"], ol, nl))
L = ["# Scenario preconditions pass: Splitting Sales Representatives (26 Oct 2026, DRAFT)", "",
     "QA lead, 26 Oct 2026: *\"Preconditions should be like a scenario, easier for a manual QA tester to understand  to create in the "
     "account.\"* (Rule 117, thirteenth amendment; lesson L-10). **Draft only: nothing was written to TestRail, Jira, Slack or Google; "
     "nothing was committed.**", "",
     "## 1. Result", f"- Cases in `testrail-id-map.csv` (run 547): **{len(rows)}** = {sum(not r['key'].startswith('DR-') for r in rows)} library cases "
     f"(built by `authoring/build.py`, 7 of them on PRD v13 via `V13` in `ssr_lib.py`, unchanged) + {sum(r['key'].startswith('DR-') for r in rows)} "
     "design-recheck cases (`DR-PROPOSALS.json`, made by `dr_scenarios.py`).",
     f"- Cases rewritten (Preconditions now open with one \"Scenario:\" line): **{len(out)}** of {len(rows)}.",
     f"- **Byte-identity check:** cases where any field other than `custom_preconds` changed: **{len(other_changed)}**"
     + (" (none)." if not other_changed else ": " + "; ".join(f"{k} C{c} {d}" for k, c, d in other_changed)),
     f"- Every old precondition word kept (word multiset of the old lines = the new lines without the Scenario line, ignoring capitals): "
     + ("**yes, all cases**." if not lost else "**NO** for " + ", ".join(f"{k} C{c}" for k, c in lost)),
     f"- Setup file recipes list exactly the new precondition lines: " + ("**yes, all cases**." if not recipe_bad else "**NO** for " + ", ".join(f"{k} C{c}" for k, c in recipe_bad)),
     f"- Lines re-worded or split (all others only re-ordered or untouched): {len(reworded)}" + (" — " + "; ".join(f"{k} C{c}: \"{' | '.join(g)}\" became \"{' | '.join(n)}\"" for k, c, g, n in reworded) if reworded else "") + ".",
     "",
     "## 2. What changed, and only this",
     "1. Every case's Preconditions open with **one \"Scenario:\" line**: one plain sentence written for the case (median about 19 words, "
     "longest 29), in the shop's and the screen's words, with no requirement code, placeholder, record name or who-to-ask. Source: "
     "`authoring/scenarios.py` (one entry per case key, DR-xx included); rendered first by `ssr_lib.render`.",
     "2. **Setup order** (`ssr_lib.setup_order`): in the 24 design cases and the 5 release-day cases with design pictures (REL-01, REL-02, "
     "REL-03, REL-06, REL-12), and in the 6 design-recheck cases, the line \"The browser window is …, and the design pictures … are open "
     "beside it …\" now sits directly above \"Starting screen:\" (it was second, between the role and the records, or last, after the "
     "starting screen). The line itself is unchanged.",
     "3. **S4-13** (C665952): the Counter Sale customer's state was inside the Starting screen line; it is now its own line just above it. Same words.",
     "4. Every other precondition line, every example, placeholder and the Blocked line are unchanged. Title, steps, expected results, "
     "quotes, From lines, References from Design, notes, AUTOMATION line, refs and every other field: byte-identical (section 1).",
     "5. Checked and found nothing to remove: no precondition in this suite said who to ask, named the QA lead, held a case for something "
     "a tester obtains, or used a generic line such as a set-aside organization (L-10).",
     "",
     "## 3. Gates",
     "- `authoring/build.py` now also runs the **scenario gate**: every library case and every design-recheck draft has exactly one "
     "\"Scenario:\" line, first, at most 40 words, with no requirement code and no \"QA lead\" / \"ask your\" (also no placeholder or "
     "record name); every key in `testrail-id-map.csv` has a Scenario. Negative-tested (two lines, line not first, 41 words, a code, "
     "\"ask your QA lead\", none: each reported). Run on 26 Oct 2026: 0 PROBLEM lines, exit 0.",
     "- `authoring/render_setup.py` regenerated `SPLITTING-SALES-REPS-SETUP-FILE.md` (each recipe lists the Scenario line and the new lines; the six DR recipes read `DR-PROPOSALS.json`).",
     "",
     "## 4. Reading coverage (Rule 119)",
     "- Every case's Preconditions (174 library cases rendered from `authoring/`, 6 design-recheck bodies from "
     "`design-recheck-2026-10-20/applied/`): 1,038 lines, 159 KB, read in full (lines 1-1038, 100%), plus the steps of the 46 cases whose "
     "scenario needed them. Rule 117 thirteenth amendment and L-10 read in full; the worker brief read in full.",
     "",
     "## 5. What applying this needs (waiting on the QA lead's go-ahead; nothing was written)",
     "- TestRail: 174 `update_case` of `custom_preconds` only, from `authoring/proposals.json`, and 6 from `DR-PROPOSALS.json` (edit lock "
     "on `updated_on`, read back). Run 547: no change (no case added or removed). Automated cases (Rules 65, 71): check the live flag first.",
     "",
     "## 6. Every case: old and new Preconditions", ""]
for k, cid, t, ol, nl in out:
    L.append(f"### {k} — [C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid}) {t}")
    L.append("| Old Preconditions | New Preconditions |"); L.append("|---|---|")
    cell = lambda xs: "<br>".join("• " + x.replace("\n", " ").replace("|", "\\|") for x in xs)
    L.append(f"| {cell(ol)} | {cell(nl)} |"); L.append("")
open(f"{D}/PASS-REPORT.md", "w").write("\n".join(L) + "\n")
print("cases", len(out), "| other fields changed", len(other_changed), "| words lost", len(lost), "| recipe mismatches", len(recipe_bad), "| reworded", [(k, g, n) for k, _, g, n in reworded])
sys.exit(1 if (other_changed or lost or recipe_bad) else 0)
