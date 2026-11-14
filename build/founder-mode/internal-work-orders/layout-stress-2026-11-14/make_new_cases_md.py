"""Writes NEW-CASES.md (the list for the QA lead) from ../authoring/proposals.json, ../questions-2026-11-14/sheet_rows.py and the gate
results passed on the command line.   python3 make_new_cases_md.py "<build line>" "<readiness line>" """
import os, re, sys, json, runpy
H = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, H)
import render_text as R
P, S = R.P, R.STRESS_NEW
Q = runpy.run_path(f"{H}/../questions-2026-11-14/sheet_rows.py")
BUILD, TRC = (sys.argv[1:3] + ["(not given)", "(not given)"])[:2]
NEEDS = {"D-94": "yes (a new sign-up organization, as S1-02)", "D-129": "yes (a new sign-up organization, as S1-02)", "D-99": "yes (phone or 390 px window)",
         "D-100": "yes (QuickBooks location)", "D-104": "yes (QuickBooks location)", "D-114": "yes (QuickBooks location)", "D-115": "yes (QuickBooks location)",
         "D-126": "yes (QuickBooks closed period, as D-81)", "D-125": "yes (AccountingHub, as D-84)", "D-119": "yes (portal contact login, as D-65)",
         "D-130": "yes (QuickBooks location)", "D-131": "yes (QuickBooks location)", "D-138": "yes (QuickBooks location)",
         "D-112": "yes (technician login, as D-78)", "D-141": "yes (about 40 closed work orders)", "D-117": "yes (shop logo set)", "D-118": "yes (shop logo set)"}
rows = []
for k, pid in S.items():
    v = P[k]
    m = re.search(r"question (\d+)", v["automation"])
    held = f"yes, question {m.group(1)}" if v["held"] else "no"
    rows.append(f"| {k} | {pid} | {v['title']} | {v['section_name']} ({v['section_id']}) | {held} | PRD v1.3 {', '.join(v['codes'])} | {NEEDS.get(k, 'yes')} |")
n = len(S); nh = sum(P[k]["held"] for k in S)
CHECKS = {
 "17": [("a", "Precedence", "Passed. The PRD's own rule (\"Where a frame and this text disagree, the text wins\") cannot settle it: the text says nothing about where these columns sit; no other precedence statement applies."),
        ("b", "Suggested-answer test", "Passed. No source backs \"keep their place\": PRD v1.3 has only the one-line sentence for the report (S9-R2, tested in S9-49); the design library has no sentence on column positions (its 20 always/never lines checked)."),
        ("c", "Silence is not a gap when another source speaks", "Passed, kept. The design and the library speak only by drawing and by code (columns sized to their content; only On Site and Status fixed), not by a stated rule; skill 21 §6d line 10 sends a move the sources do not settle to the product owner. The same move was raised as a defect on A/R and A/P (SV-12763), so leaving it unasked risks a late defect."),
        ("d", "Design library over a single frame", "Passed. No library always/never sentence covers column positions (\"Tables in the product scroll.\" is about pages, not widths)."),
        ("e", "Untestable goes to the list", "Passed. Testable by hand with a screenshot and a comparison: four cases (D-139 to D-142)."),
        ("f", "Right owner", "Passed. The PRD names no other owner; the feature adds the Classification chip, the Closed status, the report and the Technician Efficiency chip that change these rows."),
        ("g", "Behaviour first", "Passed. The behaviour (do the columns move) is the point, not wording."),
        ("h", "Final filter on the merged list", "Passed. Run on both new questions together and against questions 1 to 16 (all answered): no overlap; 17 and 18 are kept apart because they cover different screens and different causes (rows and filters against a line's chip and hidden price columns).")],
 "18": [("a", "Precedence", "Passed for what remains. The text-wins rule settles the menu: S12-R5 keeps the three-dots menu on a no-charge line (Flow 6 board 03 drops it; board 04 draws it), and S2-R4 hides Rate, Margin and Total on a no-charge work order (register IWO-D17). Both parts were taken out of the question and are tested now (D-143, D-144, D-137). The positions of the remaining columns are not in the text."),
        ("b", "Suggested-answer test", "Passed. No source says the columns stay; the design's own after-picture with the menu (board 04) still moves Actual/Estimate and Status about 40 px (measured against board 01 on 14 Nov 2026)."),
        ("c", "Silence is not a gap when another source speaks", "Passed, kept. The design contradicts itself (board 03 against board 04) and moves the columns in both; no library rule; skill 21 §6d line 10 sends the move to the product owner."),
        ("d", "Design library over a single frame", "Passed. No library always/never sentence on column positions."),
        ("e", "Untestable goes to the list", "Passed. Testable by hand: two cases (D-143, D-144)."),
        ("f", "Right owner", "Passed. Story 12 and Story 2 belong to this PRD; no other owner named."),
        ("g", "Behaviour first", "Passed. Behaviour, not wording."),
        ("h", "Final filter on the merged list", "Passed. Narrowed on this pass: the scan's draft also asked about the menu column, which S12-R5 settles (check a); only the column positions remain.")]}
out = [f"# Internal Work Orders: layout stress cases (draft, 14 Nov 2026)", "",
       "The QA lead's decision of 14 Nov 2026: **\"Draft all 87 + 4 questions (Recommended)\"**. This is the Internal Work Orders part: every case the layout stress gap scan proposes (`build/founder-mode/LAYOUT-STRESS-GAP-SCAN-2026-11-13.md`, part I3) and its two questions for Milos Vasic. **Draft only: nothing was written to TestRail, Jira, Slack or Google, and nothing was committed.** The list goes to the QA lead before any TestRail write.", "",
       "## Counts", "",
       f"| | |", "|---|---|",
       f"| Scan proposals | 53 (36 typed text, 17 state changes) |",
       f"| New cases drafted | **{n}** (I-P16 split in three: Board card, Schedule card, Tech View, as the scan's own title says and Rule 136 allows) |",
       f"| Design cases (\"Design — how it looks\", 136719) | {sum(P[k]['story_sec']=='DESIGN' for k in S)} (D-94 to D-144) |",
       f"| Story cases | 4: S9-49, S9-50, S9-51 (Reports, 136710), S12-49 (No-charge line, 136712) |",
       f"| Held on a new question | **{nh}** (D-139 to D-142 on question 17, D-143 and D-144 on question 18) |",
       f"| For run 559 | {n - nh} (union only, then every test assigned to user 6) |",
       f"| NO_MANUAL (a tester cannot set it up) | **0**. I-P01 and I-S02 need an organization where the setting was never on: the suite's own precedent is a new sign-up (S1-02 C1111834, S1-90 C1112417, D-02 C1112320, all in TestRail). QuickBooks, AccountingHub and portal cases follow today's suite (D-81, D-84, D-65 are in TestRail). |",
       f"| Existing cases changed | **0** (the 665 existing proposals are byte-identical to the committed proposals.json) |", "",
       "## Decisions taken while drafting (for the QA lead to see)", "",
       "1. **Held cases stay in \"Design — how it looks\", not WAIT-PO.** The brief said held cases go to WAIT-PO 136720 \"as the FOLDER logic does\". build.py's FOLDER logic skips design cases, and sections.json records the QA lead's choice that waiting design cases stay in the design folder. All six held cases are design cases, so all six go to 136719 and none to WAIT-PO. If you want them in WAIT-PO, it is a one-line change in build.py (I recommend leaving them where the standing choice puts them).",
       "2. **The stress names carry no \"ZZAUTOTEST\".** The suite's build.py refuses that word in tester text (an example record name). The names keep the scan's shapes: long with spaces (66 characters), long with no spaces (59; 60 for a category, the PRD limit), and & \" ' < >. All share the word \"Plainsview\", so one search shows them together. Where a window shows one record at a time, two records are used: customer A long with spaces and the special characters, customer B long with no spaces. Every case says \"if a name field stops before the end, use the longest name it takes\".",
       "3. **Wrapping versus \"...\" is never asked** (skill 07 §6.0 check g). Only two PRD layout sentences are tested word for word: S9-R2 one line at 1440 and 1536 pixels (S9-49) and S3-R5 \"on the left and never over the logo\" (D-117, D-118).",
       "4. **D-139 and D-140 use their own word** (\"Quillmont\" in the example) so the other cases' \"Plainsview\" records can never break them (Rule 137).",
       "5. **D-141 scrolls instead of paging**: the design library says \"pagination: Not designed. Tables in the product scroll.\"",
       "6. **D-136 checks only the filters, summary strip and tabs**; the table headings when the rows change are in held D-141 (question 17).",
       "7. **The scan's I-S09 quote was not word for word** (it joined \"Change category\" and \"Mark as Billable\" without the words between). The case quotes S12-R5 whole. Every other scan quote (35 fragments) was found word for word in PRD v1.3.",
       "8. **Question 18 was narrowed**: the menu column is settled by S12-R5 and S2-R4 hides the price columns (check a); only the positions of the remaining columns are asked. Question 17 is kept (see the checks). No question was dropped.", "",
       "## The cases", "",
       "| Key | Scan id | Title | Folder | Held? | Source quoted | Set up by hand? |", "|---|---|---|---|---|---|---|"] + rows + ["",
       "Every quote is a whole PRD v1.3 requirement line (or a User Feedback Summary row), checked word for word by build.py against `sources/CONFLUENCE-942243841-v1.3-read-2026-11-12.md`. Design references cite version 1794561577-f903 (boards byte-identical to 1794510020-d4ec); pictures from `design-2026-11-12/images/` (v13 pictures where the board was redrawn). Marker: `AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026` (the suite's standard, as D-93); held: `AUTOMATION: HOLD - waiting on the PO (question n)`.", "",
       "## Questions for Milos Vasic (rows 17 and 18 of the existing sheet)", "",
       f"Sheet `{Q['SHEET']}`, rows added at the bottom (Rule 131) under a batch heading, in a new colour: **{Q['COLOUR']['name']} ({Q['COLOUR']['hex']})**, with the colour-guide line \"{Q['COLOUR_GUIDE']}\". Columns as `questions-2026-11-12/sheet_rows.py`: # · Topic · Question for you · What we know today · Your answer · Where we found it. Draft only: the coordinator adds the rows (`questions-2026-11-14/sheet_rows.py`, `sheet-values.json`). They are also rows 17 and 18 of `authoring/po_questions.py`, which holds the six cases.", "",
       f"Batch heading row: {Q['BATCH']}", ""]
for r in Q["ROWS"]:
    out += [f"### Question {r[0]}", "", f"- **Topic:** {r[1]}", f"- **Question for you:** " + r[2].replace("\n", "<br>"), f"- **What we know today:** {r[3]}", f"- **Your answer:** (empty, for Milos Vasic)", f"- **Where we found it:** {r[5]}", "",
            "Skill 07 §6.0 checks:", "", "| Check | | Result |", "|---|---|---|"] + [f"| {a} | {b} | {c} |" for a, b, c in CHECKS[r[0]]] + [""]
out += ["## Gate results", "", f"- `python3 authoring/build.py`: {BUILD}", f"- `python3 build/testing-tools/tester_readiness_check.py build/founder-mode/internal-work-orders`: {TRC}",
        "- Every new case read in full (preconditions, steps, results, notes, design block, marker), all 55; quote bodies checked by build.py's word-for-word gate. Fixes from the read: the \"Show archived\" link no longer assumes a count (D-101, D-131); each document output named on its own (D-117, D-118); controls a tester can see for three \"no longer\" results (D-107, D-114, D-132); own search word for D-139 and D-140; scrolling for D-141.",
        "- The readiness check's 30 \"does not / never\" results on the new cases were read: each sits in the same step as a positive result the tester can see (the name, chip, badge or window itself).",
        "- `layout-stress-2026-11-14/create_layout_stress.py` dry run: 55 to add (DESIGN 51, S9 3, S12 1), 6 held, 49 for run 559, 78 picture uploads (52 files, all present), readiness check passed. Not run with --apply.", "",
        "## Files", "",
        "- `authoring/cases_zzzz_stress.py` (new): the 55 cases",
        "- `authoring/po_questions.py`: questions 17 and 18 appended (rows 1 to 16 untouched)",
        "- `authoring/proposals.json`: rebuilt by build.py (720 cases; the 665 existing entries unchanged)",
        "- `questions-2026-11-14/sheet_rows.py`, `sheet-values.json`: the two sheet rows",
        "- `layout-stress-2026-11-14/create_layout_stress.py`: the create script (not run); `render_text.py`, `make_new_cases_md.py`: this file", "",
        "## Reading coverage", "",
        "| Source | Read |", "|---|---|",
        "| LAYOUT-STRESS-GAP-SCAN-2026-11-13.md | lines 1-90 and 249-460 (summary, stress data, the whole Internal Work Orders part, notes, reading coverage); 100% of the IWO part |",
        "| PRD v1.3 (sources/CONFLUENCE-942243841-v1.3-read-2026-11-12.md) | every requirement line quoted, read whole (S1-R1 to S1-R16, S1-N4, S2-R1/R2/R4/R5/R6/R8/R10/R11/R14/R18, S3-R2/R5/R6/N4, S4-R2, S5-R1/R4, S7-N3, S8-R3/N2, S9-R1 to R4/R6/R10/R11/R13/N1/N3, S12-R1 to R7/R9/E8, UFS rows 05/14/15/17/22/38/39); the 36 scan quote fragments checked by script |",
        "| LESSONS-REGISTER.md | rows L-20, L-21 |", "| skills/21-DESIGN-DRIVE-PROTOCOL.md §6d | lines 7-10 |", "| skills/07-PO-QUESTIONS.md §6.0 | lines 252-300 |",
        "| rules/RULES-61-96.md | Rules 113, 114, 117 fourteenth and fifteenth amendments, 135-139, in full |",
        "| A/R suite cases_demo_2026_11_13.py | lines 1-60 and 185-266 (D-90 to D-95) |",
        "| design-2026-11-12/DESIGN-VISUAL-INVENTORY.md | lines 1-90 (V01-V80) |",
        "| design pictures viewed | flow4-05, flow6-01, flow6-03, flow6-04, flow0-04, flow0-08, flow1-14, flow3-01 (positions compared by eye) |",
        "| design library _ds_bundle.js (v4) | grep: every always/never line (20), the GAPS block (lines 7268-7285) |",
        "| suite machinery | build.py, iwo_lib.py, common.py, design_refs.py, design_v3.py, create.py, po_questions.py (structure), cases_zzz_v13.py (round 4 additions), write scripts of 13 Nov 2026 |", "",
        "## OUTSTANDING — what I need from you", "",
        "1. **Your go-ahead to write** the 55 cases (49 into run 559) with `create_layout_stress.py --apply` (Rule 6). Recommended: yes, after reading this list.",
        "2. **Send questions 17 and 18** to Milos Vasic by adding the two rows to the sheet (Rule 66: the sheet goes last). Recommended: send both; they hold six cases.",
        "3. **Folder for the six held cases**: \"Design — how it looks\" (Recommended, the standing choice) or WAIT-PO 136720.",
        "", "Waiting on the PO (Rule 132): Internal Work Orders sheet, questions 1 to 16 all answered; questions 17 and 18 are drafts, not yet sent (six cases would wait on them)."]
open(f"{H}/NEW-CASES.md", "w").write("\n".join(out) + "\n\n## Full text of every new case\n\n" + "\n".join(R.case(k) for k in S))
print("NEW-CASES.md written", n, "cases")
