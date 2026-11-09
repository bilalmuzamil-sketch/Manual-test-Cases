#!/usr/bin/env python3
"""Writes DESIGN-CASE-PLAN.md (Bill To design cases, round 1 drafts for the case worker). PRD quotes are pulled verbatim from PRD v0.5 by
code (tools/prd.py); every design quote is checked to occur word for word in a board file; picture names come from the figures list.
Run: python3 -I tools/make_case_plan.py (exits 1 on any failed check)."""
import os, sys, json, re
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); sys.path.insert(0, HERE)
import prd as P
from cases_data import CASES
FIGS = json.load(open(os.path.join(ROOT, "DESIGN-FIGURES-2026-11-09.json")))["list"]
FIG = {(f["page"], f["n"]): f for f in FIGS}
BOARDTXT = " ".join(json.load(open(os.path.join(ROOT, "extract", b + ".json")))["note"] + " " + " ".join(
    " ".join(fg["captions"]) for fg in json.load(open(os.path.join(ROOT, "extract", b + ".json")))["figures"])
    for b in ("DefaultBillTo.dc.html", "BillJob.dc.html", "Blocked.dc.html", "ServiceFor.dc.html", "GettingPaid.dc.html", "DeletePayer.dc.html", "AssetTab.dc.html"))
BOARDTXT = re.sub(r"\s+", " ", BOARDTXT)
PAGES = {1: "1 Set a customer's default Bill To", 2: "2 Bill a work order or part sale to someone else", 3: "3 When the Bill To is blocked",
         4: "4 Service For band on invoices and estimates", 5: "5 Getting paid", 6: "6 Deleting a customer that pays for others", 7: "7 Asset Work Orders tab"}
FROM = "From: PRD \"Bill To\", Confluence 1003585538, version 0.5 (status 6 Nov 2026, last modified 7 Nov 2026, Chris Ward), read 9 Nov 2026 · Epic SV-12289, {stories}"
DESIGN = "Design canvas \"Bill To design\" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794239066-4906, read 9 Nov 2026"
HOLD = "AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO"
errs = []
def q(code):
    if code.startswith("§8 "):
        rid, _, trig = code[3:].partition(" / ")
        rows = [r for r in P.S8 if r["id"] == rid and (not trig or r["trigger"].startswith(trig))]
        if not rows: errs.append("no §8 row " + code); return ""
        r = rows[0]; return "- §8 %s (%s): “%s” — %s" % (r["id"], r["trigger"], r["message"], r["behavior"])
    if code not in P.REQ: errs.append("no PRD code " + code); return ""
    return "- %s: “%s”" % (code, P.REQ[code])
def story(n): return "story SV-%d (Story %d, %s)" % (12302 + n, n, P.STORY[n])
out, table = [], []
for c in CASES:
    t = c["title"]
    if not t.startswith("Design: ") or len(t) > 80 or ";" in t: errs.append("title rule: " + t)
    figs = [FIG[(p, n)] for p, n in c["figs"]]
    pics = [f["figure_picture"].split("/")[-1] for f in figs]
    for w in c.get("words", []):
        if re.sub(r"\s+", " ", w) not in BOARDTXT: errs.append("%s design quote not in boards: %s" % (c["id"], w[:60]))
    for s in c["steps"]:
        if re.search(r"\b(and then|, then)\b", s): errs.append("%s step bundles actions: %s" % (c["id"], s))
    if len(c["results"]) != len(c["steps"]): errs.append("%s results/steps mismatch" % c["id"])
    marker = HOLD if c["id"].startswith("DV") else "AUTOMATION: READY"
    table.append("| %s | %s | %s | %s |" % (c["id"], t, ", ".join(pics), marker))
    L = ["## %s · %s" % (c["id"], t), "", "**Title:** " + t, "", "**Preconditions**"]
    L += ["- " + p for p in c["pre"]] + ["- Open the attached picture%s %s at 100%% zoom beside the screen." % ("s" if len(pics) > 1 else "", ", ".join(pics))]
    L += ["", "**Steps**"] + ["%d. %s" % (i, s) for i, s in enumerate(c["steps"], 1)] + ["", "**Expected Result**"]
    for i, res in enumerate(c["results"], 1):
        L.append("Step %d:" % i); L += ["- " + r for r in res]
    L += ["", "Exact quotes from the source (for reproducibility)", FROM.format(stories=", ".join(story(n) for n in c["stories"]))]
    L += [q(x) for x in c["quotes"]] + ["Not yet checked against a build.", "", "References from Design"]
    L.append("- %s: page \"%s\", pictures %s." % (DESIGN, " / ".join(sorted({PAGES[f["page"]] for f in figs})),
             ", ".join("\"%s\" (%s)" % (f["heading"], f["badge"]) for f in figs)))
    L.append("- Pictures to attach: %s." % ", ".join(pics))
    if c.get("words"): L += ["- The design's own words:"] + ["  - “%s”" % w for w in c["words"]]
    if c.get("diff"): L.append("- Difference: " + c["diff"])
    L += ["", marker, ""]
    out += L
dc = sum(1 for c in CASES if c["id"].startswith("DC")); dv = len(CASES) - dc
head = ["# Design-case plan — Bill To (9 Nov 2026, round 1 drafts for the case worker)", "",
 "For the TestRail section **\"Design — how it looks\"** under section 132467 \"Bill To\" (Rule 126), local sources `build/founder-mode/bill-to/cases/design/`. Written in full in the QA lead's pattern (Rule 117 fourteenth and fifteenth amendments, model C665915): title starting \"Design: \" (at most 80 characters, no semicolons), plain \"Sign in as … / Use a … / Have a …\" preconditions, numbered steps with one action each, \"Step N:\" results with bullets, a blank line, the exact PRD quotes under their \"From:\" line and the build sentence, then **References from Design** (tenth amendment), the AUTOMATION line last. No \"mark this test Blocked\" line (fifteenth amendment). Expected behaviour comes from PRD v0.5; the design gives the look (Rule 126.5) and is named with its own words under References from Design. Generated by `tools/make_case_plan.py` from `tools/cases_data.py`: every PRD quote is pulled from the saved PRD by code, every design quote is checked word for word against the board files, titles and one-action steps are checked by script.", "",
 "Notes for the case worker: pictures to attach are in `design-2026-11-09/images/` (figure pictures with the design's caption); the bare screenshots are in `files/project/shots/`. Light theme only (no board draws dark). The pictures are 1440 x 900 unless named otherwise; cases where the layout could wrap add 1536 px. Each case that changes a record creates its own customer or work order (Rule 137). Demo names in the pictures (Buda, Valders, A & J, S2-17579 …) are the designer's data, never preconditions. Held cases (DV-xx) are not run and not added to the run until the PO answers (Rule 130.5). PRD v0.5 is pending approval: re-check every quote when it moves (Rule 129).", "",
 "**Count: %d look cases (DC) + %d held design-version cases (DV) = %d.**" % (dc, dv, len(CASES)), "", "| Id | Title | Pictures | Marker |", "|---|---|---|---|"]
open(os.path.join(ROOT, "DESIGN-CASE-PLAN.md"), "w").write("\n".join(head + table + [""] + out))
print("cases", len(CASES), "DC", dc, "DV", dv, "errors", len(errs)); [print(" ", e) for e in errs]
sys.exit(1 if errs else 0)
