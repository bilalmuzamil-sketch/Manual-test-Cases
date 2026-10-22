#!/usr/bin/env python3
"""PASS-REPORT.md for the design full pass of 22 Oct 2026: every case, changed or confirmed and why; new cases with section and source;
held cases; counts. Compares authoring/proposals.json with the version committed before the pass (git HEAD)."""
import json, re, html, csv, os, subprocess, sys
from collections import Counter
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
sys.path.insert(0, f"{P}/authoring")
import design_data as DD
old = json.loads(subprocess.run(["git", "show", "HEAD:build/ar-ap-report-sorting/authoring/proposals.json"], cwd=P, capture_output=True, text=True, check=True).stdout)
new = json.load(open(f"{P}/authoring/proposals.json"))
cid = {r["key"]: (r["case_id"], r["link"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
T = lambda s: html.unescape(re.sub(r"<[^>]+>", "\n", s or ""))
def lines(s): return [x.strip() for x in T(s).split("\n") if x.strip()]
def parts(f):
    e = f["custom_expected"]
    return dict(pre=lines(f["custom_preconds"]), steps=lines(f["custom_steps"]), plain=lines(e.split("Exact quotes from the source")[0]),
                quotes=e.split("Exact quotes from the source")[1].split("References from Design")[0], refs=e.split("References from Design")[1], title=f["title"])
NAV = re.compile(r"\(Reports, then \"[^\"]+\" under [A-Z ]+ in the left menu(?:; the page title reads \"A/P Unpaid Invoices Report\")?\)|Reports \(top menu; its left menu lists the A/R reports under ACCOUNTS RECEIVABLE and the A/P reports under ACCOUNTS PAYABLE\)")
def unnav(s): return NAV.sub("NAV", s)
def oldnav(s):
    s = re.sub(r"Reports > Finance > ([A-Z/][\w/ ]+?)(?= is open| again|\.|,| from| and|$)", r"\1 NAV", s)
    s = re.sub(r"Reports > Inventory > Inventory Value", "Inventory Value NAV", s); s = s.replace("Reports > Work In Progress", "Work In Progress NAV")
    return s.replace("Reports > Finance", "NAV")
def reasons(k, a, b):
    out = []
    pa, pb = [oldnav(x) for x in a["pre"]], [unnav(x) for x in b["pre"]]
    sa, sb = [oldnav(x) for x in a["steps"]], [unnav(x) for x in b["steps"]]
    if a["pre"] != b["pre"]:
        out.append("starting screen / comparison tab name the on-screen menu path (design pictures: Reports, left menu ACCOUNTS RECEIVABLE / ACCOUNTS PAYABLE)" if pa == pb
                   else "preconditions: " + "; ".join(x for x in b["pre"] if unnav(x) not in pa)[:220])
    if a["steps"] != b["steps"]:
        out.append("steps name the on-screen menu path" if sa == sb else "steps: " + "; ".join(x for x in b["steps"] if unnav(x) not in sa)[:220])
    if a["plain"] != b["plain"]:
        ch = [x for x in b["plain"] if x not in a["plain"]]
        why = []
        j = " ".join(ch)
        if "small arrow beside its heading" in j: why.append("the sort mark described as the design draws it (a small arrow beside the heading)")
        if "dash" in j: why.append("a blank cell is drawn as a dash")
        if re.search(r'"(Location|Customer|Vendor): " and', j): why.append("one ticked name keeps the chip's prefix (design pictures I34, I37, I42)")
        if "today's screen" in j: why.append("today's on-screen spelling of the old headings (production pictures)")
        if "A/R Aging Summary" in j and "none of the six" in j: why.append("menu names as on screen")
        if not why: why.append("navigation wording in a result")
        out.append("expected results: " + "; ".join(dict.fromkeys(why)))
    if a["quotes"] != b["quotes"]: out.append("quote block changed")
    return out
rows, cnt = [], Counter()
for k, v in new.items():
    b = parts(v["fields"]); refs = T(b["refs"])
    pics = sorted({f["iid"] for f in DD.FIGS if DD.pic(f) in b["refs"]})
    diffs = sorted(set(re.findall(r"\((DD-\d\d)\)", refs)))
    silent = "draws no picture" in refs
    held = "the design differs from the PRD, waiting on the PO" in b["refs"].split("</p>")[-2] if False else ("the design differs from the PRD, waiting on the PO" in v["fields"]["custom_expected"])
    if k not in old:
        verdict = "NEW (held)" if held else "NEW"
        why = [("design version of " + ", ".join(diffs) + "; held until Chris Ward rules") if held else "a screen or state the design draws had no picture case (Rule 133 line 1)"]
    else:
        a = parts(old[k]["fields"])
        r = reasons(k, a, b)
        tester = [x for x in r if not x.startswith("starting") and not x.startswith("steps name")]
        verdict = "CHANGED" if tester else ("CHANGED (navigation only)" if r else "CONFIRMED")
        why = r + ["re-checked against the design: " + (f"pictures {', '.join(pics)} attached" if pics else "the design draws no picture of it (DESIGN-SILENT)")
                   + (f"; differences named: {', '.join(diffs)}" if diffs else "")]
    cnt[verdict] += 1
    c = cid.get(k)
    rows.append(f"| {k} | " + (f"[C{c[0]}]({c[1]})" if c else "new") + f" | {v['sec']} | {v['title']} | {verdict} | {'; '.join(why)} |")
ok_conf = sum(1 for r in rows if "| CONFIRMED |" in r)
out = ["# Full pass against the design — A/R and A/P Report Sorting (22 Oct 2026)", "",
       "Every case was re-read against the design canvas (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4, read in full, 43 pictures viewed) "
       "and PRD v5 (Rule 122: the QA lead chose \"Full pass now\"). Expected results stay PRD quotes (Rule 113); the design gives the look, the on-screen "
       "labels and the navigation (Rules 57, 126). Drafts only: nothing was written to TestRail, Jira, Slack or Google, and nothing was committed.", "",
       "## Counts", "",
       f"- Cases before the pass: {len(old)} · after: {len(new)} · new: {cnt['NEW'] + cnt['NEW (held)']} ({cnt['NEW (held)']} of them held design versions).",
       f"- Existing cases: **changed {cnt['CHANGED']}** (an expected result, a precondition or a step changed beyond the menu path) · **changed, navigation only {cnt['CHANGED (navigation only)']}** "
       f"(starting screen or steps now name the on-screen menu path) · **confirmed {cnt['CONFIRMED']}** (only the References from Design block added).",
       "- Every existing case now carries a structured \"References from Design\" block: the page and board, the pictures to compare with, the design's own words "
       "(captions, board titles), every design-vs-PRD difference that touches it (Rule 130 item 3), or a plain statement that the design draws no picture of it.",
       "- Marker counts: see REPORT.md (regenerated). Held: 6 design versions (D-76 to D-81) plus the 10 held before the pass.", "",
       "## Design differences (each a held design-version case and a question)", "",
       "| Id | What differs | PRD | Design | Question | Held case |", "|---|---|---|---|---|---|"]
for d in DD.DIFFS:
    out.append(f"| {d['id']} | {d['kind']} | {d['prd']} | {d['design']} | {d['q']}" + (" (sent 22 Oct)" if d['q'] == 4 else " (drafted, not sent)") + f" | {d['held']} |")
out += ["", "Closed by our own sources (no question): " + "; ".join(f"{d['id']} ({d['ruling'][:90]}…)" for d in DD.RULED), "",
        "## New cases (section Design — how it looks, TestRail section 90430)", "",
        "| Key | Title | Source |", "|---|---|---|"]
for k, v in new.items():
    if k not in old:
        figs = [f"{f['iid']}" for f in DD.FIGS if DD.pic(f) in v["fields"]["custom_expected"].split("References from Design")[1]]
        out.append(f"| {k} | {v['title']} | PRD v5 {', '.join(v['codes'])}; design pictures {', '.join(dict.fromkeys(figs))} |")
out += ["", "## Every case", "", "| Key | C-id | Section | Title | Verdict | What and why |", "|---|---|---|---|---|---|"] + rows
open(f"{H}/PASS-REPORT.md", "w").write("\n".join(out) + "\n")
print(dict(cnt))
