#!/usr/bin/env python3
"""Writes ../DESIGN-DIVERGENCE-REGISTER.json (Rule 130: every design difference closed, never parked) for Tiered Pricing, phase 1, 14 Nov 2026.
Both directions: (A) PRD -> design, from spec_to_design_check.py run on PRD v37 against all 273 board files (a bolded copy of the PRD so the
tool can read the requirement lines; curly and straight apostrophes treated alike), stories 1-4; (B) design -> PRD, by hand from every
dialog, menu, toast, tooltip and empty state of pages 1-4 (proof §6) and every board picture (viewed 14 Nov 2026); (C) the design proof's
own lists: §7b's 11 design-to-design inconsistencies, §8's design behaviours the PRD may not have, §6b's 49 movements, §6c's stress
findings, and the two intake notes (20.20 CSV "Tier 2" rows, 7.9 info icon).
Outcomes: NO-DIFFERENCE / CLOSED (closed_by: the PRD sentence or precedence that settles it, the case that checks it) / PO-CANDIDATE (a held
"design version" case and a question candidate in po_questions.py; nothing is sent until skill 07 §6.0 passes) / LATER-BATCH (outside
stories 1-4: listed for the next authors with what to do). Precedence (QA lead, 14 Nov 2026): PRD > PO answers > design for the look where
the PRD is silent > tech plan; PRD §7 intro: "Layout, styling, sort indicators, scrolling and pinned columns follow the design canvas; this
section states only what QA tests"."""
import json, os
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
PREC = 'PRD v37 §7: "Layout, styling, sort indicators, scrolling and pinned columns follow the design canvas; this section states only what QA tests."'
rows = []
def add(id, direction, where, prd, design, outcome, closed_by=None, cases=(), question=None, held_case=None, in_scope=True, todo=None):
    rows.append({k: v for k, v in dict(id=id, direction=direction, where=where, prd=prd, design=design, outcome=outcome, closed_by=closed_by,
                                       cases=list(cases), question=question, held_case=held_case, in_scope=in_scope, todo=todo).items() if v not in (None, [])})

# ---- (A) PRD -> design (spec_to_design_check, stories 1-4) -------------------------------------------------------------------------
SILENT = "DESIGN-SILENT: the design draws no version of this state; the case follows the PRD sentence."
EX = "EXAMPLE DATA: the PRD's example names/values; the design shows the same form with its own data"
A = [
 ("S1-E13", '"General Matrix (old)"', "CLOSED", SILENT + " Release-day data; no board shows a pre-release matrix called General Matrix.", ["S1-22"]),
 ("S2-R3", '"Fixed price is used by the reports. Choose another name."', "CLOSED", EX + ' (2.15 "Manual is used by the reports. Choose another name.").', ["S2-23", "D-09"]),
 ("S2-R26", '"<tier> is reactivated. It\'s now the last tier, Tier <n>."', "NO-DIFFERENCE", "Shown on 2.27 with a curly apostrophe.", ["S2-42", "D-13"]),
 ("S2-R7", '"move all to another tier"', "CLOSED", "The PRD names an action that must NOT exist; 2.19 draws none (agrees).", ["S2-27"]),
 ("S2-R13", '"<tier> priced parts on <n> saved lines, so it can\'t be deleted. Archive it instead."', "CLOSED", SILENT + " (2.8 draws only the open-work-orders reason).", ["S2-36", "S2-38"]),
 ("S2-R14", '"No archived tiers yet."', "CLOSED", SILENT, ["S2-13"]),
 ("S2-R23", '"Set <tier>\'s Rule?"', "NO-DIFFERENCE", "Shown on 2.53-2.55 with a curly apostrophe.", ["S2-64", "D-22"]),
 ("S2-R23", '"<tier> already uses <rule> in those matrices"', "CLOSED", SILENT + ' (2.60 draws the one-matrix form "in that matrix").', ["S2-66", "D-23"]),
 ("S2-R27", '"<tier>\'s rules are back."', "NO-DIFFERENCE", "Shown on 2.58 with a curly apostrophe.", ["S2-73", "D-22"]),
 ("S2-N7", '"Enter an amount of $0.00 or more" / "Enter a value of 0 or more"', "CLOSED", SILENT + " (2.51/2.52 draw the % Off and Margin % messages only).", ["S2-76", "S2-77"]),
 ("S2-E5", '"Can\'t undo: <matrix> was saved after this rule was set."', "CLOSED", SILENT, ["S2-74"]),
 ("S3-R18", '"All categories without a matrix (n)"', "NO-DIFFERENCE", 'Shown as "All categories without a matrix (12)" on 1.2 (count in its own element).', ["S1-01", "S3-19"]),
 ("S3-R18", '"Discard these changes?"', "CLOSED", 'CASE-DIFFERS: the design writes "Discard These Changes?" (3.16, 4.23). Settled by the PRD itself, S19-R9: "Every column title, modal header, page title, tab and button uses Title Case."', ["S3-08", "S3-10", "D-30"]),
 ("S3-R16", '"$25.01 to [end]"', "CLOSED", EX + ' ("$100.01 to $ 10000", 4.6).', ["S3-27"]),
 ("S3-R23", '"Same as the rule above"', "CLOSED", SILENT + " (no board draws the last range's tooltip).", ["S3-29"]),
 ("S3-R8", '"(copy 2)"', "CLOSED", SILENT + " (3.27 draws the first copy only; the copy itself is Q10).", ["S3-37"]),
 ("S3-N3", '"The General Matrix can\'t be deleted. You can edit it."', "NO-DIFFERENCE", "Shown on 6.12 with a curly apostrophe.", ["S3-42"]),
 ("S4-R3", '"$5 off" / "Cost + $5.50"', "CLOSED", EX + ' ("5% off", "Cost + $40", 3.2, 4.4).', ["S4-05", "S4-06"]),
 ("S4-R3", '"Uses previous tier, 2 · Wholesale." / "... Priced by 2 · Wholesale\'s rule."', "CLOSED", EX + ' ("Uses previous tier, 1 · Default.", 4.2; the chain form is a data-tip in the files).', ["S4-07", "S4-08", "D-37"]),
 ("S4-R3", '"How it\'s priced"', "CLOSED", "The PRD names a row that must NOT exist; no board draws it (agrees).", ["S4-05"]),
 ("S4-R12", '"1 change: Tier 5 is 28% margin." / "3 changes: ..."', "PO-CANDIDATE", 'The design writes "1 change: Tier 2 $0.00–$100.00: 22% margin." (3.12).', ["S4-27", "S4-28"], "Q14", "D-59"),
 ("S4-R15", '"Retail" / "Off Retail price"', "CLOSED", SILENT + " (no board renames Default).", ["S4-29", "S2-04"]),
 ("S4-R30", '"Change Default\'s Prices?" (singular "this tier prices … so it changes too")', "CLOSED", 'Shown: 3.7 (plural), 3.14 (singular "this tier prices from Default in this matrix, so it changes too").', ["S4-30", "S4-31"]),
 ("S4-R32", '"Default prices live parts, so it can\'t be changed in the archived view."', "NO-DIFFERENCE", "Shown on 4.27 with a curly apostrophe.", ["S4-39", "D-46"]),
]
for i, x in enumerate(A, 1):
    code, words, out, why, cases = x[:5]
    add(f"TPD-A{i:02d}", "PRD->design", code, words, why if out != "PO-CANDIDATE" else why, out, None if out == "PO-CANDIDATE" else why, cases,
        question=x[5] if len(x) > 5 else None, held_case=x[6] if len(x) > 6 else None)

# ---- (B) design -> PRD by hand, pages 1-4 --------------------------------------------------------------------------------------------
B = [
 ("2.11, 2.17, 2.32, 2.46, 3.2, 4.26", "S2-R28, S3-R26: breadcrumbs Settings › Pricing › …", 'Breadcrumbs start "Pricing ›"', "Q5", "D-50", ["S2-53", "S2-54", "S2-58", "S3-01", "S3-05"]),
 ("2.29", 'S2-R30: "the question is just "Delete <tier>?" with the same last line"', 'Adds "This can\'t be undone."', "Q6", "D-51", ["S2-35"]),
 ("2.53", 'S2-R23: "<tier> becomes <rule> in <n> matrices"', '"in all 7 matrices (2 inactive)"', "Q7", "D-52", ["S2-64"]),
 ("2.11-2.17, 2.32, 2.44", 'S2-R20 / Terminology: the tier\'s Pricing tab uses the grid\'s words, "Uses previous tier"', '"Same as previous tier"', "Q8", "D-53", ["S2-56"]),
 ("2.42", "S2-R20: Default's tab lists Work Order Matrix and Part Sale Matrix; S4-R31 labels", 'One column; "3 rules · markup"', "Q9", "D-54", ["S2-57"]),
 ("3.27", 'S3-R8: Duplicate makes the copy "in the library" and opens it', "An unsaved copy with Cancel / Create Matrix", "Q10", "D-55", ["S3-37"]),
 ("4.11", 'S4-R7: "% Off and $ Off start empty in every range"', '0 in every range ("% Off starts at 0% in every range")', "Q11", "D-56", ["S4-14"]),
 ("4.11", 'S4-R4: "each column whose rule type differs counts as one change"', '"3 changes" after one type change', "Q12", "D-57", ["S4-11", "S4-12"]),
 ("4.20", 'S3-R16: "Add Range adds a range before the last one."', '"A new last range"', "Q13", "D-58", ["S3-27"]),
 ("3.15, 4.18", 'S3-R6 messages ("Enter a % from 0 to 99.99")', '"Save is blocked" banner; "Tier 5: enter a % from 0 to 99.99 in every range."; "Work Order Matrix: Rule 1: …"', "Q15", "D-60", ["S3-22", "S3-23", "S3-24"]),
 ("1.4, 3.2, 4.1 (view)", 'S3-R16: "$10,000.01 and up"', '"$10,000.01 +" in view', "Q16", "D-61", ["S3-27"]),
 ("3.25", "S3-R6: taken new matrix name shows an inline error under the name", '"A matrix called Stop 40 already exists." in the banner', "Q17", "D-62", ["S3-25"]),
 ("3.5→3.25, 3.10→4.7, 3.22→3.23", "§6d line 10: no source settles whether these screens may move", "Simulator columns 70 px wider in edit; the category list pushes the grid 221 px down", "Q18", "D-63", ["D-64"]),
 ("4.6, 4.21, 3.11", "S3-R32: a delete button on every range except the last", "Trash on every range except the first, the last included", "Q19", "D-65", ["S3-28"]),
]
for i, (where, prd, design, q, hc, cases) in enumerate(B, 1):
    add(f"TPD-B{i:02d}", "design->PRD", where, prd, design, "PO-CANDIDATE", None, cases, q, hc)
CL = [
 ("3.16, 4.23 notes", 'S3-R18 / S19-R3 "Discard these changes?"', 'Notes write "Keep editing / Discard changes"; the dialogs write "Keep Editing" / "Discard Changes"', 'The dialogs match the PRD; the canvas notes are annotations. S19-R9 Title Case.', ["S3-08", "D-30"]),
 ("3.20", 'S3-R27 "Turn Off Part Sale Pricing?"', 'Note and aria-label "Turn off Part Sale pricing?"; visible title "Turn Off Part Sale Pricing?"', "The visible title matches the PRD; the note and screen-reader label differ only in letter case (no tester-visible text).", ["S3-35", "D-32"]),
 ("2.45", 'S2-R20 "Edit on a matrix\'s row"', "The whole row is the click target (no Edit label drawn)", PREC + " The PRD's Edit is what QA tests; the target area is layout.", ["S2-58"]),
 ("3.29", 'S3-R9 "asks first, naming the categories it prices"', "Adds which tiers have own rows that go with the matrix", "Compatible: the design adds information the PRD does not forbid; the case checks the PRD part and the design words.", ["S3-39", "D-35"]),
 ("2.19", "S2-R7 dialog content", 'Title "<tier> Can\'t Be Archived Yet", bold count line, explanatory text', "Compatible: the PRD fixes the content (customers, channels, Remove Customers, Close); the design supplies the words where the PRD is silent.", ["S2-27", "D-11"]),
 ("2.24, 2.30, 2.37, 3.18", "PRD silent (no toast text for archive, delete, rename, Part Sale on)", "Toasts drawn with their own words", "Design is the source of the look and words where the PRD is silent (QA lead's precedence).", ["S2-31", "S2-35", "D-13", "D-14", "D-17", "S3-33", "D-32"]),
 ("3.10, 3.22", 'S3-R28 "plain gray text"', '"Inactive: No categories use this matrix"', "Compatible: the gray text says Inactive with the reason; the design words are checked.", ["S3-12", "D-27"]),
 ("2.13, 2.36", 'S2-R3 "an inline error" (no words)', '"A tier called Tier 3 already exists." / "… Click away to keep Tier 2."', "Design supplies the words the PRD leaves open.", ["S2-21", "S2-26", "D-17"]),
 ("3.24", 'S19-R1 "{Field} is a required field"', 'Field "Matrix name is a required field" (no period); banner line with a period (proof §7b #3)', "The field message matches S19-R1; the banner line is part of Q15's banner question.", ["S3-25", "D-34"]),
 ("2.2", 'S2-R1 "Once Default is renamed, its new name carries the Default badge."', "Default row with no badge (not renamed)", "Agrees (note 2.2: \"Default has no badge: its name says it\").", ["S2-04", "D-03"]),
 ("3.11 vs 3.12", "—", "3.11 has three ranges, the saved 3.12 shows two (design-to-design)", "No verdict depends on it: the cases check the message and the highlight, not the range count of these boards.", ["S4-27"]),
 ("tp-app.css comment vs variables", 'S4-R27 "never narrower than 128px or wider than 176px"', 'Comment "136px at 1920 … never wider than 142px"; variables 128-176 (proof §7b #7)', "Settled by S4-R27 (the variables and boards agree with it).", ["S4-02", "S4-04"]),
 ("2.33, 2.35, 3.3, 3.5", "PRD silent on Esc", '"Press Enter or click away to save. Esc cancels."; pencil on hover', "Design is the source where the PRD is silent.", ["D-16", "D-25"]),
 ("2.9", "PRD silent", "The last row's menu opens upward", "Design is the source of the look.", ["D-07"]),
]
for i, (where, prd, design, why, cases) in enumerate(CL, 1):
    add(f"TPD-C{i:02d}", "design->PRD", where, prd, design, "CLOSED", why, cases)

# ---- (C) the proof's own lists -------------------------------------------------------------------------------------------------------
INC = [
 (1, "Letter case, notes vs dialogs (Discard These Changes?)", True, "CLOSED by S19-R9 (TPD-C01)", ["D-30"]),
 (2, "Turn off Part Sale pricing? note/aria-label vs visible title", True, "CLOSED (TPD-C02)", ["D-32"]),
 (3, "Punctuation: 20.22 note, 6.8 tooltip period, 3.24 field vs banner", True, "3.24: CLOSED (TPD-C09). 20.22 and 6.8: LATER-BATCH (reports, Story 6)", ["D-34"]),
 (4, "20.10 vs 20.11 two date-range texts", False, None, []),
 (5, '"Sales Type" names two filters (9.3 vs 20.9)', False, None, []),
 (6, "Search empty-state buttons and period differ (9.2, 9.13, 6.10, 7.6)", False, None, []),
 (7, "tp-app.css column-width comment vs variables", True, "CLOSED by S4-R27 (TPD-C12)", ["S4-02"]),
 (8, "14 frames shorter than their boards (9.28-9.37, 10.6, 10.7, 10.9, 12.9, 14.8)", False, None, []),
 (9, "CU04b-TierChosen off the canvas (old 8.4b, equals 9.33)", False, None, []),
 (10, "Line 10 movements of the design's own pictures", True, "Pages 1-4: D-76, D-77, D-79 (settled: headings keep their left-right place), D-63/D-64 held on Q18. Other pages: LATER-BATCH", ["D-76", "D-63", "D-64"]),
 (11, "Line 9 stress probe findings", True, "Pages 1-4: D-70 to D-75. Other pages: LATER-BATCH", ["D-70", "D-71", "D-74"]),
]
for n, what, ins, how, cases in INC:
    add(f"TPD-I{n:02d}", "design-to-design", f"proof §7b #{n}", None, what, ("CLOSED" if ins else "LATER-BATCH"), how if ins else None, cases,
        in_scope=ins, todo=None if ins else "Next batch: compare with the PRD story of those pages; close by a PRD sentence or a PO question with a held design-version case.")
EIGHT = [
 ("2.9 menu opens upward on the last row", True, "D-07"), ("2.11 New Tier opens a page, cursor in the name", True, "S2-14"),
 ("2.15 reserved names in any letter case", True, "S2-23"), ("2.27 / 9.23 Reactivate with no confirmation, last", True, "S2-42"),
 ("2.33 / 3.3 rename pencil on hover; Enter or click-away saves, Esc cancels", True, "D-16"),
 ("2.48 select-all includes inactive; \"all <n>\" only when all are checked", True, "S2-61 (and Q7, D-52)"),
 ("2.56 toast 20 s, pauses while pointed at, Undo", True, "S2-70"), ("2.60 a rule it already has asks nothing", True, "S2-66"),
 ("3.16 per-tab Edit/Save/Cancel, discard prompt on tab switch", True, "S3-10"),
 ("4.7-4.8 auto-fill follows the last range entered; gray not counted", True, "S4-23"), ("4.13 Alt+Down opens a From cost picker", True, "S4-21"),
 ("4.19-4.21 ranges by their end; Add Range / delete one change each", True, "S4-12"), ("4.22 bar counts only edited cells", True, "S4-11"),
 ("5.3 cost 0 / empty / not a number -> every column \"—\"", False, None), ("5.4 simulator uses unsaved grid values", False, None),
 ("6.4 tier numbers with names on hover", False, None), ("6.9 / 7.5 search matches names", False, None),
 ("7.9-7.11 Edit grayed on a shared matrix, Go to the matrix", False, None), ("8.3 Uncategorized can't be renamed, moved or deleted", False, None),
 ("9.5 tab tooltips instead of a message", False, None), ("9.11 Select All skips customers already on the tier", False, None),
 ("9.31 / 9.37 tier fields only with 2+ tiers", False, None), ("9.39 phone below 768 px", False, None), ("10.5 only a typed price has an icon", False, None),
 ("10.11 no cost -> $0.00 under the tier", False, None), ("12.4 Priced by after Sell Price", False, None), ("14.6 no amber note on the same tier", False, None),
 ("15.1 one warning, space kept", False, None), ("20.8 Location always blue", False, None), ("20.13 sort cycle", False, None),
 ("20.15 hidden column remembered", False, None), ("20.18 PDF up to 2,000 rows, CSV up to 50,000", False, None),
 ("20.20 CSV starts with title, date range and every filter", False, None), ("info icons on prices only on row hover", False, None),
 ("tooltips copy the Work In Progress report's style", True, "D-04 (tooltip look on pages 1-4; other pages LATER-BATCH)"),
]
for i, (what, ins, case) in enumerate(EIGHT, 1):
    add(f"TPD-E{i:02d}", "design behaviour", "proof §8", None, what, "CLOSED" if ins else "LATER-BATCH",
        ("Covered by the PRD and checked by " + case + "; where the PRD is silent the design is the source (QA lead's precedence).") if ins else None,
        [case.split(" ")[0]] if ins else [], in_scope=ins,
        todo=None if ins else "Next batch (its story's author): find the PRD sentence that covers it (cite it) or, if the PRD is silent, write the design case from the board; if the PRD differs, a PO question and a held design-version case.")
LATER = [
 ("20.20 CSV stand-in", 'RPT-S1-R11 / RPT-S4-R3: Priced By labels "2 · Fleet" with tier numbers', 'Priced By rows "Tier 2", "Tier 3" with no number; line order Priced By before Category (Q4)', "Reports batch: PO question candidate with a held design-version case; coordinate with Q4."),
 ("7.9 info icon", 'S7-R15: "Above the grid, a line names the other categories"', '"The Fluids 30 matrix also prices 1 other category: Oil." in an info icon by the matrix name', "Story 7 batch: PO question candidate with a held design-version case."),
 ("proof §6b movements outside pages 1-4", "§6d line 10", "Work-order lines 19-71 px during Quick Add (10.6, 10.7, 10.9) and 1-7 px (10.8, 11.7, 12.2); notice pushes 79 px (12.9, 14.8); Manage Customers 11/83 px (9.12, 9.13), bar 92 px; New Category +26 px (8.7); Sales by Tier 58-94 px on open rows and 20-36 px on empty states; Sales by Category 7-10 px; filter chips shift as a chip widens", "Each story's batch: before-and-after cases; a move no source settles goes to the PO (skill 07 §6.0 first)."),
 ("proof §6c stress outside pages 1-4", "§6d line 9", "Categories list rows grow; category page fields overrun (7.8, 8.1); Customers columns move (9.28); Manage Customers cells cut without … (9.6); Sales by Tier Priced By pushes Parts Margin % off the edge; filter lists cut names without … (20.5-20.7) (L-21 pattern)", "Each story's batch: a stress case per surface."),
]
for i, (where, prd, design, todo) in enumerate(LATER, 1):
    add(f"TPD-L{i:02d}", "design->PRD", where, prd, design, "LATER-BATCH", in_scope=False, todo=todo)

# ---- parallel batches: register_rows_<batch>.json files (a JSON list of rows in the same shape) are appended; an id may appear once.
import glob
for f in sorted(glob.glob(f"{D}/register_rows_*.json")):
    extra = json.load(open(f))
    clash = {r["id"] for r in extra} & {r["id"] for r in rows}
    if clash: raise SystemExit(f"{os.path.basename(f)}: register ids already used: {sorted(clash)}")
    later = {r["id"] for r in extra if r.get("replaces")}
    rows = [r for r in rows if r["id"] not in {x.get("replaces") for x in extra}] + extra

out = {"project": "Tiered Pricing", "made": "2026-11-14", "phase": "1 (stories 1-4 closed; the rest listed for the next batches)",
       "design": "Tiered Pricing Design 1794631438-539a (files identical in 1794638838-cd70)", "prd": "Confluence 938213378 page v37",
       "precedence": "PRD > PO answers > design (look, where the PRD is silent) > tech plan (informs). " + PREC,
       "sent": "nothing sent: no PO sheet exists yet for Tiered Pricing (Rules 66, 131); unsent PO candidates are counted in PHASE-1-REPORT.md",
       "differences": rows}
json.dump(out, open(f"{P}/DESIGN-DIVERGENCE-REGISTER.json", "w"), indent=1, ensure_ascii=False)
from collections import Counter
print(len(rows), dict(Counter(r["outcome"] for r in rows)), "in scope", sum(r["in_scope"] for r in rows))
