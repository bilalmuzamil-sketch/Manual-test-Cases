#!/usr/bin/env python3
"""Write READTHROUGH-REPORT.md for the Splitting Sales Representatives tester read-through (26 Oct 2026).
Old = the live read-back applied/C<id>-after.json; new = the draft (authoring/proposals.json, pattern-format-2026-10-26/DR-PATTERN.json).
python3 make_report.py"""
import os, sys, json, csv, re, html, difflib, subprocess
H = os.path.dirname(os.path.abspath(__file__)); B = os.path.dirname(os.path.dirname(H)); P = f"{B}/splitting-sales-reps"
sys.path.insert(0, f"{P}/authoring")
import readthrough as RT
exec(open(f"{H}/dump_cases.py").read().split("if __name__")[0])   # tester_text()
build = subprocess.run([sys.executable, f"{P}/authoring/build.py"], capture_output=True, text=True, cwd=f"{P}/authoring")
ident = subprocess.run([sys.executable, f"{H}/check_byte_identity.py"], capture_output=True, text=True)
prop = json.load(open(f"{P}/authoring/proposals.json")); dr = json.load(open(f"{P}/pattern-format-2026-10-26/DR-PATTERN.json"))
nm = json.load(open(f"{P}/NO_MANUAL_CASE.json"))
rows = list(csv.DictReader(open(f"{P}/testrail-id-map.csv")))
link = lambda cid: f"[C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid})"
BL = re.compile(r"setup not done|mark this test Blocked", re.I)
per, diffs, unchanged = [], [], []
for r in rows:
    k, cid = r["key"], r["case_id"]
    old = json.load(open(f"{P}/applied/C{cid}-after.json")); new = (dr[k] if k.startswith("DR-") else prop[k])["fields"]
    a, b = tester_text(old, quotes=False), tester_text(new, quotes=False)
    if a == b: unchanged.append(f"{k} {link(cid)}"); continue
    checks, what = [], []
    if BL.search(old["custom_preconds"]) and not BL.search(new["custom_preconds"]): checks.append(7); what.append('removed the line "If you cannot set up any of the above, mark this test Blocked: "setup not done"."')
    e = RT.RT.get(k)
    if e: checks += e["checks"]; what += e["why"]
    per.append(f"| {k} | {link(cid)} | {', '.join(str(x) for x in sorted(set(checks)))} | {' '.join(what)} |")
    d = [l for l in difflib.unified_diff(a.split("\n"), b.split("\n"), "old (live in TestRail)", "new (draft)", lineterm="", n=0) if not l.startswith("@@")]
    diffs += [f"#### {k} {link(cid)}", "```diff", *d, "```", ""]
fixed = [k for k in RT.RT]
bl_only = len(per) - len(fixed)
L = ["# Splitting Sales Representatives: tester read-through, 26 Oct 2026 (DRAFT: nothing written to TestRail, Jira, Slack or Google)",
 "",
 "Brief: `build/tester-readthrough-2026-10-26/WORKER-BRIEF.md` (QA lead, 26 Oct 2026: \"GO\" to a read-through of every case; \"Make sure that your work does not bite me\"). "
 "Rules read in full first: Rule 117 fourteenth and fifteenth amendments, Rules 113, 114, 116, 134, 135, 136, 137 (`build/rules/RULES-61-96.md`), "
 "`build/LESSONS-REGISTER.md` (L-01 to L-11), the suite's `PROJECT-STATE.md` and its 26 Oct pattern pass (`pattern-format-2026-10-26/`).",
 "",
 "## Reading coverage",
 f"- Cases read: **{len(rows)} of {len(rows)}** (170 library cases + the 6 design-recheck cases DR-01, DR-02, DR-03, DR-04, DR-06 and DR-07; the four deleted cases excluded). Every case's title, preconditions, steps and expected results were read together, as a tester would, from a plain-text render of the drafts (3,579 lines, lines 1 to 3,579, 100% read).",
 "- For the 44 cases where a fix depended on what the sources say, the case's whole quotes block, From: lines and References from Design block were read too (from the live read-backs, `applied/C<id>-after.json`).",
 "- Before the read the drafts were proved equal to the live TestRail read-backs (176 of 176, title, preconditions, steps, expected, refs), so \"old\" below is what is live today.",
 "",
 "## Counts",
 f"- Read: {len(rows)}. Changed: **{len(per)}** ({bl_only} only for check 7, the Blocked line; {len(fixed)} with further fixes). Unchanged: **{len(unchanged)}** ({', '.join(unchanged)}: the QA lead's model case, which never had the Blocked line; only check 7 applies to it).",
 "- Keys removed from the library (deleted from TestRail earlier today on the QA lead's order): **4**, S1-11 (C690666), S5-19 (C715568), S6-05 (C665980), S7-05 (C690670). They are gone from the case modules, `pattern_cases.py`, `scenarios.py`, the setup file (their four recipes and the developer-check account slot) and every output; `apply5.py` (dry run: \"update 169 add []\") can no longer re-create them, and build.py fails if any of them comes back.",
 "",
 "## Requirement coverage after the deletions (`NO_MANUAL_CASE.json`, checked by build.py)",
 "| Requirement | Was covered by | Now |", "|---|---|---|"]
for x in nm["requirements"]: L.append(f"| {x['requirement']} | {', '.join(x['was_covered_by'])} | {x['status']} |")
L += ["", "build.py's REQUIREMENT-COVERAGE GATE accepts a PRD code with no case only when NO_MANUAL_CASE.json records it as \"No manual case: deleted 26 Oct 2026 on the QA lead's order ...\", and fails if such a code is covered again or if any other code loses its case.",
 "",
 "## Gates",
 "`python3 authoring/build.py` (exit " + str(build.returncode) + "):", "```", *[l for l in build.stdout.strip().split("\n") if not l.startswith("LONG")], "```",
 "New gates: BLOCKED-LINE GATE (Rule 117 fifteenth amendment: any case, in any field, or any setup-file line carrying \"setup not done\", \"If you cannot set up any of the above\", \"If any record above is missing\" or \"mark this test Blocked\" fails the build); REQUIREMENT-COVERAGE GATE (above); READ-THROUGH GATE (every fix in `authoring/readthrough.py` names a case of the suite). Every earlier gate is kept.",
 "",
 "Byte identity (`check_byte_identity.py`, exit " + str(ident.returncode) + "):", "```", ident.stdout.strip(), "```",
 "No fix added a quote: every result changed in this pass restates a sentence already quoted in its case (or its design reference), so the quotes block, From: lines, References from Design and the AUTOMATION line are byte-identical in all 176 cases.",
 "",
 "## Changed cases (one line each: key, C-id, checks failed (1 clear setup, 2 vague words, 3 negative check without proof, 4 repeated or bundled steps, 5 related, 6 understandable, 7 Blocked line), what changed)",
 "| Key | C-id | Checks | What changed |", "|---|---|---|---|", *per, "",
 "## Could not make concrete (meaning left unchanged)",
 *[f"- {k}: {v}" for k, v in RT.COULD_NOT_MAKE_CONCRETE.items()], "",
 "## Negative check without a control",
 *[f"- {k}: {v}" for k, v in RT.NEGATIVE_WITHOUT_CONTROL.items()],
 "- Every other \"does not appear / nothing changes\" result was checked: the same case already shows the trigger ran (the dropdown or window that opened, the copied name, the count read before, the row that is listed, the \"Empty export\" message), or the trigger is the tester's own click on what the result describes. S6-04 had none and now shows the printout opening first (S6-R4).",
 "",
 "## Enrolment (check 8)",
 "- Not applicable: check 8 is for A/R and A/P only. No case of this suite mentions enrolment or the \"Switch location?\" prompt.",
 "",
 "## Left as they are, for the QA lead to confirm",
 "- Four cases keep a note below the results that tells the tester when to mark the case Blocked because of something outside the case (not the closing \"setup not done\" line the fifteenth amendment removes): S1-09 (if the build never offers the person in the open list), S2-11 and S4-27 (if Part Sales Update v1 is not on the build), REL-19 (if Part Sales Update v1 was not on the site before the release). They sit in the byte-identical block below the results, so this pass did not touch them; the Blocked-line gate does not flag them. Say if they should go too.",
 "- Two navigation facts came from other suites' recorded cases (Rule 118, facts only): Reports > Export Reports (Accounting) for the Sales Representative Assignments export (report suite C30292) and Settings > Imports for the contacts import (custom roles C26449). No build exists yet, so both are unverified, as is every case of the suite.",
 "",
 "## Old vs new, every changed case (tester-facing text; script-generated from the live read-back and the draft)",
 *diffs]
open(f"{H}/READTHROUGH-REPORT.md", "w").write("\n".join(L) + "\n")
print("report:", len(per), "changed,", len(unchanged), "unchanged; build exit", build.returncode, "; identity exit", ident.returncode)
