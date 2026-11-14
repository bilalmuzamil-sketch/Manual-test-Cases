"""Writes QUESTIONS-FOR-MATT-BARGE.md from sheet_rows.py, QUESTION-MAP.json and ../authoring/proposals.json (held cases). python3 make_md.py"""
import json, os, sys
H = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, H)
import sheet_rows as SR
MAP = json.load(open(f"{H}/QUESTION-MAP.json"))["old_to_new"]
PROP = json.load(open(f"{H}/../authoring/proposals.json"))
held = {}
for k, v in PROP.items():
    if v["held_on"]: held.setdefault(v["held_on"], []).append((k, v["section_name"]))
old_of = {}
for o, n in MAP.items(): old_of.setdefault(n, []).append(o)
SRC = {"Q1": "intake draft", "Q2": "intake draft", "Q4": "intake draft"}
for i in range(5, 20): SRC[f"Q{i}"] = "phase 1 (design vs PRD)"
for i in range(20, 31): SRC[f"Q{i}"] = "batch A (design vs PRD)"
for i in (40, 41, 42, 44): SRC[f"Q{i}"] = "batch B (design vs PRD)"
# skill 07 §6.0 a-h, run on the merged list by the consolidation worker, 14 Nov 2026
DESIGN_WORDS = ("a: no PRD precedence sentence settles it (PRD §7 hands only layout, styling, sort indicators, scrolling and pinned columns to the design; "
                "this is {kind}) · b: the suggested option is the PRD's own text, but the design disagrees, so a quote does not close it (Rule 130) · "
                "c: PRD and design disagree; the tech plan only restates the PRD · d: no design-library always/never rule covers it · e: testable on the "
                "screen · f: Product (Matt Barge owns the PRD and the canvas audit of v0.17) · g: {g} · h: kept: not a duplicate of another row, not "
                "settled, testable, his to answer; it holds {cases}")
REC = {
 1: ("navigation text, not layout", "the words differ (they are not missing)"),
 2: ("dialog wording", "the words differ"), 3: ("dialog wording", "the words differ"), 4: ("wording of a state", "the words differ"),
 5: ("what the page lists", "behaviour: which columns and values"), 7: ("behaviour (when a record is created)", "behaviour"),
 8: ("behaviour (where a range goes)", "behaviour"), 9: ("label wording", "the words differ"), 10: ("behaviour (which ranges can be removed)", "behaviour"),
 11: ("error wording and a banner", "behaviour (whether a banner shows) and wording"), 12: ("where an error shows", "behaviour (where)"),
 13: ("behaviour (starting values)", "behaviour"), 14: ("behaviour (a count)", "behaviour"), 15: ("message wording", "the words differ"),
 16: ("cell content", "behaviour: what the column shows"), 17: ("message wording on three screens", "the words differ"),
 18: ("where a sentence shows (PRD Story 7 vs Story 19)", "behaviour (line or tooltip)"), 19: ("button wording", "the words differ"),
 20: ("message wording", "a sentence missing in one and added in the other"), 21: ("what the page allows", "behaviour (editable or not)"),
 22: ("filter options", "behaviour (which customers each option lists)"), 23: ("tooltip or box", "behaviour (always visible or on hover)"),
 25: ("what the user sees after receiving", "behaviour"), 26: ("popover content", "behaviour and wording"), 27: ("which lines a notice counts", "behaviour (a count)"),
 28: ("report labels (the reports PRD's \"Design wording is binding: the labels and messages here ship as written\" can be read for either side)", "label format on every row and download"),
 29: ("behaviour (order)", "behaviour"), 30: ("behaviour (order of download lines)", "behaviour"),
}
SPECIAL = {
 6: ("a: no precedence sentence · b: S3-R12 leans to (a) but S3-R13's \"when the matrix is saved\" reads either way, so no clean quote · c: the tech plan "
     "speaks (picker close) but the PRD is ambiguous, and the move changes prices (money) · d: n/a · e: testable · f: Product · g: behaviour (timing) · "
     "h: kept; the design has no picture of it (checked 14 Nov 2026); it holds {cases}"),
 24: ("a: no PRD sentence covers reopening · b: no source sentence backs either option · c: the tech plan speaks but contradicts the PRD's general rule, "
      "and it decides an invoice price (money) · d: n/a · e: testable (add a line to a paid work order) · f: Product (engineering told Product as an FYI) · "
      "g: behaviour · h: kept; it holds {cases}"),
 31: ("a: PRD §7 says layout follows the design canvas, but that does not say whether a move between two pictures is meant (the pictures may simply be "
      "drawn differently) · b: no source sentence · c: no source speaks · d: no design-library rule found · e: testable by before-and-after screenshots · "
      "f: Product · g: behaviour (layout stays put, checklist line 10, lesson L-21) · h: kept as ONE question: phase 1's Q18, batch B's Q42 and batch A's "
      "Q27 asked the same kind of thing and were merged; it holds {cases}"),
}
out = ["# Tiered Pricing — questions for Matt Barge (PO), merged list, 14 Nov 2026 — DRAFT, NOT SENT", "",
       "**Nothing is sent and no Google Sheet exists yet.** The coordinator creates the sheet from `sheet_rows.py` (values in `sheet-values.json`) after the "
       "QA lead has seen this list (Rule 66: the sheet is the last thing sent). Sharing, as the QA lead asked on 14 Nov 2026: Matt Barge editor and notified; "
       "every QA person editor; everyone else at shopview.com read only.", "",
       f"**{len(SR.ROWS)} questions.** Merged from phase 1 (Q1, Q2, Q4 intake; Q5-Q19 design), batch A (Q20-Q30) and batch B (Q40, Q41, Q42, Q44): "
       "33 candidates → 31 rows. Merged (same kind of question): batch B's Q42 and batch A's Q27 into phase 1's Q18 (question 31, layout moves). Dropped: none "
       "(every remaining candidate passed skill 07 §6.0 a-h on the merged list, record below). Numbered 1-31 in story order; old → new numbers in "
       "`QUESTION-MAP.json`, and every held case's AUTOMATION line now names its new number (\"waiting on the PO (question N)\").", "",
       "Colour-coded format first made for Milos Vasic: title, greeting, colour guide (Yellow = your answer, Blue = the topic, Grey = where we found it), "
       "header #, Topic, Question for you (lettered options, suggested one first), What we know today, Your answer, Where we found it. Every Topic names the "
       "project and the feature.", "", "## The sheet (PO-facing)", "", SR.GREET, "",
       "| # | Topic | Question for you | What we know today | Your answer | Where we found it |", "|---|---|---|---|---|---|"]
cell = lambda t: str(t).replace("|", "\\|").replace("\n", "<br>")
for r in SR.ROWS: out.append(f"| {r[0]} | {cell(r[1])} | {cell(r[2])} | {cell(r[3])} |  | {cell(r[4])} |")
out += ["", "## QA only (not shown to the PO): skill 07 §6.0 record, old numbers and held cases", "",
        "| # | Old number(s) | Came from | Held cases (folder) | §6.0 a-h record (why it is still needed) |", "|---|---|---|---|---|"]
for r in SR.ROWS:
    n = r[0]; q = f"Q{n}"
    hc = held.get(q, [])
    cases = ", ".join(k for k, _ in hc) or "NO CASE"
    folders = sorted({s for _, s in hc})
    if n in SPECIAL: rec = SPECIAL[n].format(cases=cases)
    else:
        kind, g = REC[n]; rec = DESIGN_WORDS.format(kind=kind, g=g, cases=cases)
    olds = sorted(old_of[q], key=lambda x: int(x[1:]))
    out.append(f"| {n} | {', '.join(olds)} | {'; '.join(SRC[o] for o in olds)} | {cases} ({'; '.join(folders)}) | {rec} |")
out += ["", "Candidates dropped earlier, with the check each failed (kept for the record): intake D1-D16 and Q3 (`../PO-QUESTIONS-DRAFT.md`); batch B's "
        "Location \"Clear selection\" (g: settled by the reports PRD's always-a-location rule, register TPD-B416) and the plain \"Sales Type\" chip (merged "
        "into question 28). C-ids are given once the cases are written to TestRail (write/ scripts; the map goes to `../testrail-id-map.csv`).", ""]
open(f"{H}/QUESTIONS-FOR-MATT-BARGE.md", "w").write("\n".join(out))
print("written", len(SR.ROWS))
