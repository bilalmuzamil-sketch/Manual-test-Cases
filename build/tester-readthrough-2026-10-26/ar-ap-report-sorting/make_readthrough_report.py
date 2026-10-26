#!/usr/bin/env python3
"""Tester read-through of A/R and A/P Report Sorting (26 Oct 2026): writes READTHROUGH-REPORT.md next to this script.
Old text = what TestRail holds (applied/C<id>-after.json, the last read-back); new text = authoring/proposals.json (run
authoring/build.py first). Per case: the checks of WORKER-BRIEF.md it failed (1-8) and what changed, then old vs new, line by line.
python3 make_readthrough_report.py"""
import json, csv, re, html, subprocess, difflib, os, sys
S = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, f"{S}/authoring")
import readthrough_layout as RTL, ar_lib as L
prop = json.load(open(f"{S}/authoring/proposals.json"))
ids = {r["key"]: r["case_id"] for r in csv.DictReader(open(f"{S}/testrail-id-map.csv"))}
MARK = "<p><strong>Exact quotes from the source"

def lines(f):
    """Tester-facing text of a case as plain lines: title, preconditions, steps, Step N results, note (everything above the quotes)."""
    li = lambda h: [html.unescape(x) for x in re.findall(r"<li>(.*?)</li>", h)]
    out = [f"Title: {f['title']}"] + [f"P: {x}" for x in li(f["custom_preconds"])]
    out += [f"{i}. {s}" for i, s in enumerate(li(f["custom_steps"]), 1)]
    exp = f["custom_expected"].split(MARK)[0]
    head, _, note = exp.partition("<p></p>")
    for n, u in re.findall(r"<p>Step (\d+):</p><ul>(.*?)</ul>", head): out += [f"   Step {n}: {x}" for x in li(u)]
    out += [f"NOTE: {html.unescape(x)}" for x in re.findall(r"<p>([^<]+)</p>", note)]
    return out

HAND = {  # checks found by reading that the line patterns below cannot see
    "S3-26": (5, "result \"a new export works again\" had no step that shows it: new step 5 downloads the CSV again"),
    "S3-27": (5, "result \"a new export works again\" had no step that shows it: new step 5 downloads the PDF again"),
    "S8-07": (3, "\"the words are not found\" had no proof the search reads the file: new step 3 finds customer A's name (PRD v9 S3-R3 quote added)"),
    "S8-07b": (3, "\"the words are not found\" had no proof the search reads the file: new step 3 finds vendor A's name (PRD v9 S3-R3 quote added)"),
    "S7-05": (4, "step \"Note which rows are at the top and bottom\" (result \"Noted.\") moved into the preconditions; steps renumbered"),
    "S7-20": (4, "step \"Note which rows are at the top and bottom\" (result \"Noted.\") moved into the preconditions; steps renumbered"),
    "S7-12": (4, "step \"Go back to the report and look at invoice B's number\" bundled two actions: invoice B is now looked at first, then invoice A clicked"),
    "S9-01": (4, "step 3 bundled switch tab + read + look: now \"Switch back to the report's tab.\" (results unchanged)"),
    "S4-15": (6, "step 1's result \"Note the report's opening state.\" was not something to see: now says what each chevron shows"),
    "S4-15b": (6, "step 1's result \"Note the report's opening state.\" was not something to see: now says what each chevron shows"),
    "S4-16": (6, "step 1's result \"Note the report's opening state.\" was not something to see: now says what each chevron shows"),
    "S4-16b": (6, "step 1's result \"Note the report's opening state.\" was not something to see: now says what each chevron shows"),
    "S5-07": (5, "\"8 locations or fewer\" did not fit the result \"2 selected\": now no other location has documents, so the list holds only the two"),
    "S5-08": (5, "\"8 locations or fewer\" did not fit the result \"2 selected\": now no other location has documents, so the list holds only the two"),
    "D-39": (5, "step 2 compared with \"the one a work order link from another location shows today\", which nothing set up: a second tab with that prompt is now a precondition"),
    "D-40": (5, "step 2 compared with \"the one a work order link from another location shows today\", which nothing set up: a second tab with that prompt is now a precondition"),
    "DATA-13": (7, "note carried a \"mark this test Blocked: setup not done ... tell the QA lead\" variant: removed (the setup instruction stays)"),
    "DATA-20": (7, "note said \"... and tell the QA lead\" (lesson L-10): now \"..., not Failed\" (the Blocked-not-Failed judgement for a site without a PDF generator stays)"),
    "S5-20": (2, "note cited \"Rule 136\" and pointed at another case: now says only how the address is edited"),
}
def checks(k, old, new):
    c, why = set(), []
    o, n = "\n".join(old), "\n".join(new)
    c.add(7); why.append("Blocked line removed")
    if "enrolled" in o and ("enrolled" not in n or o.count("enrolled") != n.count("enrolled")): c.add(8); why.append("enrolment line removed (PRD v9: organization-wide)")
    elif k in RTL.ENROL_REASON: c.add(8); why.append("enrolment line kept, reason added")
    if ", with location A as your current location." in o and ", with location A as your current location." not in n: c.add(5); why.append("\"current location\" clause no step uses removed")
    if re.search(r"P: Make sure (the report has|each of the|the three A/R|A/R Summary and A/P|the report's Location list)", o) and o != n:
        if any(x in n for x in ("so the report has", "so each of", "so both exports", "so the three", "so sorting by", "so its number", "so the report shows", "so there are", "so the re-sort", "so the Vendor menu", "in every bucket")):
            c.add(1); why.append("\"make sure the report has open documents\" replaced by what to have and why")
    if re.search(r"native|as described|layout being checked|The header shows it|Totals row style|Rule 96", o) and not re.search(r"native|as described|layout being checked|The header shows it|Totals row style|Rule 96", re.sub(r'"[^"]*" \(ar-ap-p[^)]*\)', "", n)):
        c.add(2); why.append("vague words (\"native\", \"as described\", \"as in the layout being checked\", \"the header shows it\", \"Rule 96\") replaced by what the tester sees or compares")
    if old[0] != new[0]: c.add(6); why.append(f"title made concrete")
    if "switch on, so" in n and "switch on, so" not in o: c.add(5); why.append("\"View and Manage AP/AR Data\" line says why (the credit term)")
    if "so its links can be compared" in n and "so its links can be compared" not in o: c.add(5); why.append("Work In Progress tab added: the result compares the link colour with it")
    if "compare the Totals row with Sales By Customer's" in n and "compare the Totals row with Sales By Customer's" not in o: c.add(5); why.append("Sales By Customer tab added: the result compares the Totals row with it")
    if "Make sure the organization has two or more locations" in n and "Make sure the organization has two or more locations" not in o: c.add(5); why.append("two-locations line now names the report whose filter is used")
    if "Have open documents in this report on today's date at two locations" in n and "Make sure the report has open documents at both locations" in o: c.add(4); why.append("two preconditions saying the same thing merged into one")
    if "The empty state reads" in n and "The empty state reads" not in o and k == "S5-32": c.add(2); why.append("\"The empty state shows.\" now says what it reads (the case's own S8-R5 quote)")
    if "Have open documents on today's date (" in n and "several buckets" in o: c.add(1); why.append("\"several buckets\" made concrete: the two expanded buckets, two rows each")
    if k in HAND: c.add(HAND[k][0]); why.append(HAND[k][1])
    return sorted(c), why

def K(*keys):
    """Keys with their C-ids (Rule 8)."""
    return ", ".join(f"{k} (C{ids[k]})" for k in keys)
R, rows, diffs = [], [], []
only_blocked = 0
for k, v in prop.items():
    old = lines(json.load(open(f"{S}/applied/C{ids[k]}-after.json"))); new = lines(v["fields"])
    cs, why = checks(k, old, new)
    if cs == [7]: only_blocked += 1
    rows.append(f"| {k} | C{ids[k]} | {', '.join(map(str, cs))} | {'; '.join(why)} |")
    d = [x for x in difflib.unified_diff(old, new, lineterm="", n=0) if not x.startswith(("---", "+++", "@@"))]
    diffs.append(f"### {k} (C{ids[k]}, https://shopview.testrail.io/index.php?/cases/view/{ids[k]})\n```\n" + "\n".join(d) + "\n```")

build = subprocess.run([sys.executable, f"{S}/authoring/build.py"], capture_output=True, text=True).stdout
gate = [l for l in build.splitlines() if l.startswith(("PROBLEM", "read-through gates", "deleted ", "message only", "cases "))]
ident = subprocess.run([sys.executable, f"{HERE}/check_tail_identity.py"], capture_output=True, text=True).stdout.strip()
enr_before = {}
for k in prop:
    o = "\n".join(lines(json.load(open(f"{S}/applied/C{ids[k]}-after.json"))))
    if "enrolled" in o: enr_before[k] = "\n".join(lines(prop[k]["fields"]))
kept = sorted(k for k, n in enr_before.items() if "enrolled" in n); removed = sorted(k for k in enr_before if k not in kept)

R += ["# A/R and A/P Report Sorting: tester read-through (26 Oct 2026)", "",
      "QA lead, 26 Oct 2026: \"GO\" (read-through of every case) and \"Make sure that your work does not bite me\". Brief: "
      "`build/tester-readthrough-2026-10-26/WORKER-BRIEF.md`. Draft only: nothing written to TestRail, Jira, Slack or Google; nothing committed. "
      "Generated by `make_readthrough_report.py`.", "",
      "## Reading coverage", "",
      "| What | Size | Read |", "|---|---|---|",
      "| Every remaining case, as the tester sees it (title, preconditions, steps, Step N results, notes; design cases also with their quotes, design words and design notes): dump `dump_tester_text.py` | 356 cases, 6,525 lines, 604,135 bytes | 100% (lines 1-6,525), then every changed case re-read in its new form (diff, 884 lines) |",
      "| WORKER-BRIEF.md (with the charter) | 12,928 bytes | 100% |",
      "| RULES-61-96.md: Rule 113, 114, 116, 117 fourteenth and fifteenth amendments, 134, 135, 136, 137 | lines 2391-2542, 2606-2648, 2945-2992, 3506-3620 | 100% of those sections |",
      "| LESSONS-REGISTER.md | 8,558 bytes | 100% |",
      "| PROJECT-STATE.md | 14,402 bytes | 100% |",
      "| pattern-format-2026-10-26/PASS-REPORT.md | 9,356 lines, 1,162,235 bytes | lines 1-3,358 read in full (summary, relevance-pass list, per-case old vs new S1-01 to S4-12b). Lines 3,359-9,356 (per-case blocks S4-13 onward, 238 blocks) NOT read line by line (context limit of this session); their \"new\" preconditions, steps and results verified by script equal to the TestRail read-back for all 237 remaining cases (0 differ), and that text was read in full through the case dump. The QA lead may want those 6,000 lines read by a fresh session (Rule 119: only he can authorize a skip). |",
      "| PO answers, PRD v9 lines quoted where a wording was checked (S3-R2, S3-R3, S7-R1 to S7-N2, S8-N1, S8-R1 descriptions, S9-R2, S9-N2, enrolment lines 73, 125, 131) | targeted | the lines named |", "",
      "## Result", "",
      f"- Cases read: {len(prop)} (all remaining cases; DATA-21 C715470 was deleted by the coordinator today).",
      f"- Changed against TestRail: {len(prop)} (every case loses the \"If you cannot set up any of the above, mark this test Blocked\" line, check 7). "
      f"Of these, {len(prop) - only_blocked} also had read-through corrections and {only_blocked} changed only by the Blocked-line removal. Unchanged: 0.",
      "- Library keys removed: 1 (DATA-21, from cases_data.py (the counter still steps past it, so DATA-22 onwards keep their keys), scenarios.py, pattern_layout.py, tech_plan.py statement lists; recorded in ar_lib.DELETED). "
      "Its requirements: S3-N3 and S3-R9 still covered by DATA-18/DATA-19/DATA-20 (S3-N3 also D-55); S3-N2, User Feedback Summary row 2 (UFS-2, the \"too large to export\" message) and Out of Scope 1 (OOS-1, background exports) are now "
      f"\"{L.DELETED_NOTE}\" (REPORT.md coverage table; build.py accepts exactly these and fails on anything else).",
      "- Quotes block onward (quotes, From: lines, build line, References from Design, AUTOMATION line): byte-identical to TestRail for 354 cases; changed only by one added quote in 2 (below).", "",
      "## Gates", "", "`python3 authoring/build.py` (new gates: Blocked-line gate on every case field, note and the setup file; deleted-case gate; vague-word gate; enrolment gate):", "", "```", *gate, "```", "",
      "## Byte identity (check_tail_identity.py)", "", "```", ident, "```", "",
      f"Cases with an added quote: {K('S8-07','S8-07b')}, each with PRD v9 S3-R3: \"The PDF and the CSV contain exactly the rows on screen for the chosen as-of date, customer or vendor and locations, in the on-screen sort, including a sort changed after an earlier export, without refreshing the page.\" "
      "Their epic From: line now also names story SV-11533 (Story 3) and their refs read SV-11533,SV-11538; their References from Design block is unchanged (pictures pinned to their own codes).", "",
      "## Could not make concrete (meaning left unchanged)", "",
      f"- {K('D-38')}: \"an error toast styled and placed as on the other reports\". The sources say only \"Error toast, as on the other reports\" (User Feedback Summary) and name no report to compare with.",
      f"- {K('D-19b','D-20b','D-21b','D-22b','D-23b','D-24b','S8-10','S8-11')}: \"the standard error message shows as well\". PRD S8-R6 / User Feedback Summary say \"the standard error message\" / \"the standard error toast\" and give no words for it.",
      f"- Totals row look ({K('D-01b','D-04b','D-07b','D-10b','D-13b','D-16b','D-02','D-05','D-08','D-11','D-14','D-17','D-03','D-06','D-09','D-12','D-15','D-18')}): the PRD gives only \"the native totals row style of the newer reports\", and the design pictures disagree on its band colour (design note DR-01). Now a side-by-side comparison with Sales By Customer's Totals row (background colour, text size and weight); no colour is stated because no source gives one.",
      f"- Loading bar ({K('D-19','D-20','D-21','D-22','D-23','D-24','S8-12')}): \"the native table progress bar\". Now \"a progress bar shows on the table\" (and, in D-19 to D-24, compared with Sales By Customer's); the sources give no look.",
      f"- Empty-state look ({K('D-19','D-20','D-21','D-22','D-23','D-24')}): the words are exact; the look is \"laid out the same as Sales By Customer's empty state\" because the PRD says only \"the native empty state\".",
      f"- {K('D-49')}: \"the mobile filter row\" (was \"native\"): Out of Scope gives no look beyond \"the native mobile filter row\"; nothing more concrete exists.",
      f"- {K('D-41','D-42')}: the tooltip is compared with Work In Progress's (colours, text size, position next to the icon); PRD S8-R1 gives no look of its own.", "",
      "## Negative check without a control", "",
      f"- {K('S7-10','S7-11','S7-13','S7-17','S7-18b')}: \"Nothing opens\" after clicking a number or name that the step before shows as plain text. The trigger is the tester's own click; no source sentence names a second visible effect to prove it. (S7-01, S7-02 and S7-06 already have one: the next step's link opens.)",
      f"- {K('S2-19b')}: \"Nothing happens\" on clicking the Vendor Name header. The trigger is the tester's own click; step 2 (no pointer change, no sort mark on hover) is the visible evidence; a Date-header click would test a different behaviour (covered by S2-20).",
      f"- {K('S1-14')} steps 3 and 5: \"The report does not open, as today\". No source says what shows instead.",
      f"- {K('S5-38')} step 5: \"no late answer for an earlier tick replaces them\". No source gives a visible sign that an earlier answer arrived; the case's note says the end state is what a tester checks.",
      "- Controls that already exist and were checked: the warning or error message in every \"nothing downloads\" case (S3-24, S3-25, S3-26, S3-27, DATA-18, DATA-19, DATA-20, D-37, D-55); the sort mark in S2-39; the opening sort mark in S2-36 to S2-38b; the step-1 state in S4-15 to S4-16b; the other message in REL-06.", "",
      "## Enrolment (check 8)", "",
      f"- PRD v9 (Key Decisions; Out of Scope: \"Restricting these reports by the user's location enrollment.\") keeps the reports organization-wide. Cases that carried an enrolment line: {len(enr_before)}.",
      f"- Removed in {len(removed)} cases (no step clicks a document at another location and no result depends on enrolment): {K(*removed)}.",
      f"- Kept in {len(kept)} cases: {K(*kept)}.",
      "  - A document at another location is clicked (the \"Switch location?\" prompt, S7-R3; S7-R8 in a new tab; a bill there, S7-R6): S7-03, S7-04, S7-05, S7-06 (reason added), S7-09, S7-20, REL-07, D-39, D-40, D-64.",
      "  - The result depends on enrolment without a click: D-63 (an invoice at another location must be a blue link, S7-R1/S7-R3; reason added).",
      "  - The location switcher must offer the other location: S5-12, S5-33, S5-34, REL-10 (reasons added), D-65 (its two-locations line already says the switcher names both). Not in the brief's two categories, kept because the steps cannot be done otherwise.",
      "  - Another report's own Location filter must list both locations: REL-12, REL-12b, REL-12c (reasons added; PRD line 125: the standard filter scopes by enrollment). Not in the brief's two categories, kept for the same reason.",
      "  - Cases about a location the user is NOT enrolled in keep their own line: S5-10, S5-11 (\"enrolled only at location A\"), S7-11 (plain text at a location the user is not enrolled in).",
      "- Every case whose steps click a document at another location has the line: gate in build.py (it finds D-39, D-40, D-64, S5-33, S5-34, S7-03, S7-04, S7-06, S7-11 by the clicked document; S7-05, S7-09, S7-20, REL-07 are in the keep list by reading).",
      "- Removed with the line where no step uses it: the clause \", with location A as your current location\" (kept only in S5-10, S5-11, S5-12, S7-20, REL-03, whose steps or results use it). Every record a step or result names is still set up in the preconditions (script check: 0 gaps).", "",
      "## Per changed case", "", "Checks: 1 clear setup, 2 no vague words, 3 negative check proves the trigger, 4 no repeated or bundled steps, 5 related, 6 understandable, 7 Blocked line removed, 8 enrolment.", "",
      "| Key | C-id | Checks failed | What changed |", "|---|---|---|---|", *rows, "",
      "## Old vs new, every case (TestRail read-back vs draft; tester text only, the quotes block onward is checked above)", "", *diffs]
open(f"{HERE}/READTHROUGH-REPORT.md", "w").write("\n".join(R) + "\n")
print("cases", len(prop), "| only Blocked line", only_blocked, "| read-through corrections", len(prop) - only_blocked, "| enrolment kept", len(kept), "removed", len(removed))
