#!/usr/bin/env python3
"""Builds the What/Why design-drive outputs of 27 Oct 2026 (Phase D part 1) and checks them:
  inventory/TEXT-INVENTORY-2026-10-27.{md,json}   every on-screen text of the 8 design files, classified (0 unclassified)
  inventory/VISUAL-INVENTORY-2026-10-27.{md,json} every look item (tool rows + hand rows from the boards), classified
  DESIGN-DIVERGENCE-ROWS.json                     register rows (PRD-word rows for spec_to_design_check.py + hand rows)
  QUESTIONS-DESIGN.json                           proposed PO questions (drafts; nothing is sent)
  DESIGN-CASE-PLAN.md                             the "Design — how it looks" case plan
Exit 1 on: an unclassified text or visual row; a backing quote not found verbatim in PRD v15; a design quote not in the board
files; a title over 80 characters or not starting "Design: "; a planned case naming a C-id that is not live."""
import glob, html, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
sys.path.insert(0, HERE)
from design_plan import CASES, Q, TP, DW, DESIGN_LINK
WW = os.path.abspath(os.path.join(HERE, "../.."))
FILES = os.path.join(WW, "sources/design-2026-10-27-artifact/files")
PROBLEMS = []
norm = lambda s: re.sub(r"\s+", " ", html.unescape(s).replace("’", "'")).strip()

# ---------------------------------------------------------------- sources for verification
PRD_FULL = open(os.path.join(WW, "sources/CONFLUENCE-845348896-v15-2026-10-27.md"), encoding="utf-8").read()  # Phase A's saved copy, read only
TECH = open(os.path.join(WW, "sources/tech-plan-Title-and-Description-2026-10-13.md"), encoding="utf-8").read()
board_text = {}
for f in sorted(glob.glob(os.path.join(FILES, "*.dc.html"))):
    s = open(f, encoding="utf-8").read()
    body = re.sub(r"<(style|script)\b.*?</\1>", " ", s, flags=re.S)
    board_text[os.path.basename(f)] = norm(re.sub(r"<[^>]+>", " ", body))
ALL_BOARD = " ".join(board_text.values())
canvas = json.load(open(os.path.join(FILES, "canvas.json"), encoding="utf-8"))
CANVAS_TXT = " ".join(norm(a["text"]) for a in canvas["annotations"])
for k, v in Q.items():
    if norm(v) not in norm(PRD_FULL): PROBLEMS.append(f"backing quote {k} not verbatim in PRD v15")
for k, v in TP.items():
    if v not in TECH: PROBLEMS.append(f"tech plan quote {k} not verbatim in the tech plan")
def squash(s): return re.sub(r"\s+", "", s)
for k, v in DW.items():
    if squash(norm(v)) not in squash(ALL_BOARD + CANVAS_TXT): PROBLEMS.append(f"design quote {k} not in the board files")

# ---------------------------------------------------------------- live cases
live = {}
for f in glob.glob(os.path.join(HERE, "inventory/cases-live/C*.json")):
    j = json.load(open(f)); live[f"C{j['id']}"] = j
CASE_BLOB = norm(" ".join(re.sub(r"<[^>]+>", " ", (j.get("custom_preconds") or "") + " " + (j.get("custom_steps") or "") + " "
                                     + (j.get("custom_expected") or "") + " " + j["title"]) for j in live.values())).lower()
def in_case(t):
    parts = [p for p in re.split(r"\s*[·…]\s*", t.lower()) if len(p) >= 3]
    return bool(parts) and all(p in CASE_BLOB for p in parts)

# ---------------------------------------------------------------- text inventory
dom = json.load(open("inventory/dom-extract-2026-10-27.json", encoding="utf-8"))
rows = {}
def add(t, where):
    t = norm(t)
    if not t: return
    rows.setdefault(t, {"text": t, "where": []})["where"].append(where)
for b, v in dom.items():
    for x in v["texts"]: add(x["text"], f"board {b} ({v['file']})")
for a in canvas["artboards"]: add(a["title"], "canvas.json artboard title")
for p in canvas["pages"]: add(p["name"], "canvas.json page name")
for a in canvas["annotations"]: add(a["text"], f"canvas.json note {a['id']}")
machine = json.load(open("inventory/machine-text-inventory-2026-10-27.json", encoding="utf-8"))
for r in machine["rows"]:  # machine rows not already present as a DOM text (fragments glued differently, sweep text)
    t = norm(r["text"])
    if t not in rows and not any(t in k for k in rows): add(t, "machine " + r["where"].split("/")[-1])
sweep_extra = []
for pf in glob.glob("drive/sweep*/artifact-page-*-pages.txt"):
    for line in open(pf, encoding="utf-8"):
        t = norm(line)
        if t and not t.startswith(("#", "====")) and t not in rows and not any(t in k for k in rows): sweep_extra.append(t)
for t in sorted(set(sweep_extra)): add(t, "sweep page text (canvas viewer)")

BEFORE = "OUT-OF-SCOPE", "", "Before board (1.1 / 1.4): today's screen drawn from staging, not a target; used only as the control in D-01, D-02, D-04"
ANNOT = "OUT-OF-SCOPE", "", "designer's annotation on the board explaining the change; not on any product screen (read in full; agrees with PRD v15)"
C = {}  # text -> (class, ref, reason)
def setc(texts, cls, ref, reason):
    for t in texts: C[norm(t)] = (cls, ref, reason)
# dialog words on the after boards
setc(["New Line"], "CASE-NEEDED", "D-03", "dialog title, header as drawn on board 1.2")
setc(["AI"], "CASE-NEEDED", "D-03, D-06", "purple AI tag in the New Line header and beside the labor guide link")
setc(["SHOPCOACH LINE BUILDER"], "CASE-NEEDED", "D-03, D-07, D-08", "header link, blue capitals")
setc(["Title"], "CASE-NEEDED", "D-01, D-04, D-07..D-10", "field label (S1-R1); also a row label on boards 2.1")
setc(["What are you doing?"], "CASE-NEEDED", "D-01", "Title prompt, sentence case (S1-R3)")
setc(["Description"], "CASE-NEEDED", "D-02, D-05", "field label (S1-R2); also a column header on board 1.3 and a row label on 2.1")
setc(["Why are you doing it?"], "CASE-NEEDED", "D-02, D-05", "Description prompt, sentence case (S1-R3)")
setc(["Save & Add Part", "Save & Add Line"], "CASE-NEEDED", "D-03, D-07, D-08", "unchanged New Line button, drawn in order (S1-R7)")
setc(["Technicians", "Add Technician", "Labor Rate", "Estimated Time", "Tech Time", "Save & Close"],
     "CASE-NEEDED", "D-03, D-06", "unchanged field or button, drawn in order (S1-R7)")
setc(["Edit Line"], "CASE-NEEDED", "D-06", "dialog title, Edit Line header")
setc(["Status", "SHOPCOACH LABOR GUIDE", "Delete"], "CASE-NEEDED", "D-06, D-09, D-10", "unchanged Edit Line element (S1-R7)")
setc(["After hours CP rate", "0", "HD Fleet Rate", "1.50", "1.00", "Authorized", "Replace - Brake pot"], "DATA",
     "", "example value in the drawn dialog (labor rate, times, status, saved title)")
# before boards
setc(["Before · staging today", "Edit Line · before", "What a writer sees today", "The question is worst here",
      "Each field is named by the question it asks. Nothing on screen says what the values are called, so whatever is typed is read back elsewhere as the answer to a question, including in a shop's accounting records."], *BEFORE)
setc(["What Are You Doing?", "Why Are You Doing It?"], "OUT-OF-SCOPE",
     "", "today's Title Case question shown as the label on boards 1.1 / 1.4; the control in D-01 / D-02 checks it is gone (C549079 checks the same for ShopCoach)")
# after-board annotations
for t in ["After · S1-R1 to S1-R5", "Edit Line · after · S1-R1, S1-R2, S1-R4", "The only two things that change", "Two labels, nothing else",
          "The field is now named", "and", "The floating labels now read"]:
    C[norm(t)] = ("OUT-OF-SCOPE", "D-01..D-06 References from Design", "board pill or note heading; the notes are quoted in the D-cases' References from Design")
for k in rows:
    if k.startswith(("and the question moves inside it", ". The name stays put", "Everything else on this dialog is untouched",
                     ", so a filled field is named", "Status, Technicians, the labor row")):
        C[k] = ("OUT-OF-SCOPE", "D-01..D-06 References from Design", "board note, quoted verbatim in the D-cases' References from Design")
    if k.startswith("With a value in the field, the label floats up"): C[k] = BEFORE
# board 1.3
setc(["The line a bookkeeper reads", "Before", "After", "Two customers asked us in writing to remove this: NCCHD (SV-6862) and KMS Mechanics (SV-6582).",
      "Why the narrative carries no label", "Whether a line has a narrative at all is a shop setting"], *ANNOT)
setc(["Qty", "Amount", "1", "285.00", "412.50"], "DATA", "", "QuickBooks invoice table columns and example quantities/amounts (a QuickBooks screen, not ours)")
setc(["Replace tie rod - excessive play - Both outer ends worn, replaced and aligned"], "COVERED", "C154713, C154715",
     "the joined line text (S3-R1); Phase A uses the board's own example and cites board 1.3")
setc(["Front brake pads - Customer reports grinding - Pads at 2mm, rotors turned, bed-in road test"], "COVERED", "C154713, C154715",
     "second example line of the After table (S3-R1)")
setc(["Replace tie rod - excessive play"], "COVERED", "C154716, C549082", "line with no tech story / placeholder ends after the description (S3-R6)")
setc(["Replace tie rod", "excessive play", "Both outer ends worn, replaced and aligned"], "DATA", "", "example title / description / tech story")
setc(["Legacy invoice"], "CASE-NEEDED", "D-11, D-13", "the legacy invoice view as printed (PRD §3, invoice documents untouched)")
setc(["Modern invoice"], "CASE-NEEDED", "D-12, D-14", "the modern invoice view as printed (PRD §3)")
setc(["Scope of work"], "CASE-NEEDED", "D-12", "heading the modern invoice prints above the tech story (PRD §3)")
setc(["Administration, Work Order Settings,", "Require Tech Story", "Require Tech Story ON", "Require Tech Story OFF, none written"], "COVERED",
     "C154716, C154713", "the shop setting named in S3-R6a; used as a precondition by the behaviour cases")
for k in rows:
    if k.startswith(("One builder feeds both routes", "Title, description, then the technician's narrative", "No trailing hyphen and no trailing space",
                     "Because the two invoice views disagree")):
        C[k] = ("OUT-OF-SCOPE", "D-11..D-14 References from Design", "board note; agrees with PRD v15 §3 / S3-R1..R4; the 'Because…' note is quoted in D-11..D-14")
    if k.startswith("Drawn from the templates rather than from memory"):
        C[k] = ("OUT-OF-SCOPE", "", "designer's note naming code templates; design code is never quoted in a case (Rule 124)")
    if k.startswith(": “Tech story will be a required field"):
        C[k] = ("OUT-OF-SCOPE", "", "the setting's existing help sentence (PRD S3-R6a quotes it; the setting is untouched by this change) and a note")
    if k.startswith(("What are you doing?: Replace tie rod;", "What are you doing?: Front brake pads;")):
        C[k] = ("COVERED", "C549086, C154721", "the old text (Before table): S3-N2 no line falls back to it; S3-N1 old QuickBooks invoices keep it")
# board 2.1
setc(["Extreme cases"], *ANNOT)
setc(["S3-R3 · no description", "S3-R9 · the title already contains a hyphen", "The four flavours of tech story that reach the books",
      "Closed by this change · a semicolon typed inside a description", "Line reads", "Tech story", "(empty)"], "OUT-OF-SCOPE", "",
     "card heading or row label of the text-output board 2.1 (an illustration of line text, not a screen)")
setc(["Written at the completion gate · Require Tech Story ON"], "COVERED", "C154713", "line with a tech story")
setc(["Require Tech Story OFF · the shop never wrote one"], "COVERED", "C154716", "no tech story with the setting off")
setc(["Replace tie rod - Both outer ends worn, replaced and aligned"], "COVERED", "C549081", "S3-E1 example, letter for letter")
setc(["Replace tie rod - passenger side", "excessive play - customer waiting", "Torqued to 74 ft-lb, alignment set",
      "excessive play; also checked the drag link", "Drag link within spec"], "DATA", "", "example values typed into a line (board 2.1)")
setc(["Replace tie rod - passenger side - excessive play - customer waiting - Torqued to 74 ft-lb, alignment set"], "COVERED", "C154718",
     "S3-R9: hyphens carried as written")
setc(["Replace tie rod - excessive play; also checked the drag link - Drag link within spec"], "COVERED", "C154718", "S3-R9a: semicolon carried")
setc(["Imported from a previous system · may be empty"], "SPEC-CONFLICT", "DV-04 / DQ-01 / held D-15",
     "design lists an imported line among the texts that reach the books; PRD S3-R12 says imported invoices never reach the live sync")
for k in rows:
    if k.startswith(("What the joined line reads when the inputs are awkward", "One separator, not two.", "Carried as written. Nothing is escaped",
                     "This was an open question while the semicolon")):
        C[k] = ANNOT
    if k.startswith("The “Tech story missing.” placeholder · suppressed"):
        C[k] = ("COVERED", "C549082; D-13, D-14", "placeholder left out of the line text and of both invoice views (S3-R6, PRD §3)")
    if k.startswith("Three of these four end after the description"):
        C[k] = ("SPEC-CONFLICT", "DV-02 (ruled)", "note says the line dialog writes \"Tech story missing.\" when nothing was typed; PRD §3 says the "
                "same, S3-R6 v14/v15 narrows it to Edit Line (Chris Ward answer 6, 14 Oct). Closed by that ruling")
# board 2.2
setc(["The long end of the scale", "Scale, to keep the case honest", "What the build does today", "What the rule asks for",
      "Answered 2026-09-16 · now S3-R7 and S3-R7a", "Shorten until it fits, and never split a character", "Dropped",
      "Title · always survives", "Description · clipped at the limit", "S3-R7 · the cut lands in the description, never the title",
      "characters", "Cutting a fixed number of", "rare", "descriptions are short phrases in practice"], *ANNOT)
setc(["255", "65,535", "characters of title, max", "characters of description, max"], "OUT-OF-SCOPE", "",
     "existing field limits (PRD §4 assumption), unchanged by this feature; C154717/C549083 build their long text within them")
setc(["4,000", "bytes, the cut on both routes; Intuit documents 4,095"], "COVERED", "C154717, C549083, C549084", "the 4,000-byte cut (S3-R7)")
setc(["▾", "[half of é]", "…biellette de direction côté passa", "que and the remaining 1,400 characters"], "DATA", "",
     "illustration glyphs and example text of a cut (the accented example is the basis of C549083)")
for k in rows:
    if k.startswith(("ShopView allows 255 characters", "The title leads the joined string", "The order matters more now",
                     "An accented character costs two bytes", "was considered and rejected")):
        C[k] = (ANNOT[0], "C154717, C549083 (behaviour)", ANNOT[2])
    if k.startswith("excessive play in the steering"): C[k] = ("DATA", "", "example long description")
# canvas
setc(["New Line - before", "Edit Line - before"], "OUT-OF-SCOPE", "", "canvas board title of a Before board")
setc(["New Line - after"], "OUT-OF-SCOPE", "D-01..D-03, D-07, D-08", "canvas board title; named in References from Design")
setc(["Edit Line - after"], "OUT-OF-SCOPE", "D-04..D-06, D-09, D-10", "canvas board title; named in References from Design")
setc(["What reaches QuickBooks"], "OUT-OF-SCOPE", "D-11..D-14", "canvas board title; named in References from Design")
setc(["Awkward inputs"], "OUT-OF-SCOPE", "D-15", "canvas board title; named in References from Design")
setc(["The long end"], "OUT-OF-SCOPE", "", "canvas board title (text-output board, covered by C154717/C549083/C549084)")
setc(["Before and after", "Extreme cases"], "OUT-OF-SCOPE", "", "canvas page name")
for k in rows:
    if k.startswith("Spec: Confluence 845348896, locked 2026-09-15"):
        C[k] = ("OUT-OF-SCOPE", "", "canvas note: scope and spec date (PRD v15 status now 'In development - 2026-09-23'); no screen")
    if k.startswith("Staging renders the questions in Title Case"):
        C[k] = ("OUT-OF-SCOPE", "D-01", "canvas note; agrees with S1-R3 (sentence case); quoted in D-01's References from Design")
    if k.startswith("Both questions on this page are now answered"):
        C[k] = ("OUT-OF-SCOPE", "", "canvas note; agrees with S3-R7, S3-R7a, S3-R9a")
    if k.startswith("LOCKED IN THE PRD, 2026-09-16"):
        C[k] = ("SPEC-CONFLICT", "DV-01 (ruled)", "note says Require Tech Story 'is off by default'; PRD v15 S3-R6a: shops since June 2025 off, "
                "older shops on (Chris Ward answer 8, 14 Oct). Closed by that ruling; behaviour cases test both states")
    if k in ("2 pages", "Read-only") or k.startswith("Spec: Confluence") is False and k in ("Two dialogs carry these fields: New Line, which has the canned-line picker, and Edit Line, which does not. Both drawn from staging.",):
        pass
for t in ["2 pages", "Read-only", "\uf13c", "\uf149", "\uf162", "\uf16c"]:
    C[norm(t)] = ("OUT-OF-SCOPE", "", "canvas viewer chrome (claude.ai), not the design")
C[norm("Two dialogs carry these fields: New Line, which has the canned-line picker, and Edit Line, which does not. Both drawn from staging.")] = \
    ("OUT-OF-SCOPE", "", "second line of the canvas note-scope as the sweep split it; agrees with S1-R5 / tech plan (picker only in New Line)")
C[norm("# artifact-page-2026-10-27.html — visible text per page (hidden tooltip text excluded; it is listed per interaction)")] = ("OUT-OF-SCOPE", "", "not design text: the sweep tool's own header line")
C[norm("Spec: Confluence 845348896, locked 2026-09-15.")] = ("OUT-OF-SCOPE", "", "first line of the canvas note-scope as the sweep split it")

out = []
for t, r in rows.items():
    cls, ref, why = C.get(t, ("", "", ""))
    r.update(in_a_case=in_case(t), cls=cls, ref=ref, reason=why)
    out.append(r)
uncl = [r for r in out if not r["cls"]]
for r in uncl: PROBLEMS.append(f"UNCLASSIFIED text: {r['text'][:90]!r} ({r['where'][0]})")
from collections import Counter
cnt = Counter(r["cls"] for r in out)
json.dump({"rows": out, "counts": cnt, "in_a_case": sum(r["in_a_case"] for r in out)}, open("inventory/TEXT-INVENTORY-2026-10-27.json", "w"), indent=1, ensure_ascii=False)
with open("inventory/TEXT-INVENTORY-2026-10-27.md", "w") as o:
    o.write("# What/Why design text inventory, 27 Oct 2026 (Rule 124 gate)\n\nEvery visible text of the 7 board files (rendered DOM), the canvas "
            "titles, page names and 4 notes, plus every `design_text_inventory.py` row and sweep line not already present. Matched against the "
            f"37 live cases (read-backs of 13 Oct). Distinct texts: {len(out)} · already in a live case: {sum(r['in_a_case'] for r in out)} · "
            f"by class: {dict(cnt)} · **unclassified: {len(uncl)}**\n\n| # | Text | Where | In a live case | Class | Case / ref | Reason |\n|---|---|---|---|---|---|---|\n")
    for i, r in enumerate(out):
        o.write(f"| T{i:03d} | {r['text'][:140].replace('|', '/')} | {'; '.join(sorted(set(r['where'])))[:90]} | {'yes' if r['in_a_case'] else 'no'} | {r['cls']} | {r['ref']} | {r['reason']} |\n")

# ---------------------------------------------------------------- visual inventory (tool rows + hand rows)
tool = json.load(open("inventory/visual-tool/visual-rows.json", encoding="utf-8"))
tool_rows = tool if isinstance(tool, list) else tool.get("rows", [])
VT = {"frame": ("OUT-OF-SCOPE", "", "board canvas background (#8d8d8d grey behind the dialogs, #f4f6f8 behind the text boards): design-tool page, not the product"),
      "overlap": ("CASE-NEEDED", "D-07..D-10", "no overlap / clipping in any board at 1440 and 1536: carried into the width cases")}
vis = []
for r in tool_rows:
    cat = r.get("category", ""); el = r.get("element", "")
    if cat == "icon":
        c = ("CASE-NEEDED", "D-01, D-03, D-06", "16 px grey line icon (1 shape = down-arrow on the Title picker, Add Technician, Labor Rate, Status; 2 shapes = close X)")
    else:
        c = VT.get(cat, ("", "", ""))
    vis.append(dict(id=r.get("id", ""), source="tool", board="all boards", element=f"{cat} · {el}", attribute=r.get("attribute", ""),
                    value=str(r.get("value", ""))[:120], cls=c[0], ref=c[1], reason=c[2]))
H = [  # (board, element, attribute, value from the board file / rendered DOM, class, ref, reason)
 ("1.2", "Title picker box", "background · bottom line · corners", "light grey #d9d9d9 · 2 px dark red #8b0f1d · rounded top only", "CASE-NEEDED", "D-01", "focused field as drawn (S1-R5 focus on open)"),
 ("1.2", "Title label", "position · size · colour", "top left inside the box · 10 px · dark red #8b0f1d", "CASE-NEEDED", "D-01", "S1-R3 label at the top"),
 ("1.2", "Title prompt", "text · colour · case", "\"What are you doing?\" · grey #8b95a3 · sentence case", "CASE-NEEDED", "D-01", "S1-R3; note-case"),
 ("1.2", "Title picker", "icon", "down-arrow (chevron) at the right, grey #5b6472, 16 px", "CASE-NEEDED", "D-01", "drawn picker"),
 ("1.2", "Title label", "asterisk", "none (\"Title\"; the 13 Oct copy read \"Title *\")", "CASE-NEEDED", "D-01", "S1-R1 \"with no asterisk\"; DV-03 closed"),
 ("1.2", "Description box", "border · background · corners", "1 px light grey #c6ccd4 · white · 4 px rounded", "CASE-NEEDED", "D-02", "as drawn"),
 ("1.2", "Description label / prompt", "position · colours", "small grey label #7b8595 at top left, prompt grey #8b95a3 underneath", "CASE-NEEDED", "D-02", "S1-R3"),
 ("1.2", "Title and Description boxes", "width · order", "both full dialog width (455 px dialog), Title directly above Description", "CASE-NEEDED", "D-02, D-03", "S1-R7 order"),
 ("1.2", "Header", "elements left to right", "\"New Line\" 17 px bold · purple #9C27B0 \"AI\" tag (white text) · blue #2276DA capitals \"SHOPCOACH LINE BUILDER\" · grey X far right", "CASE-NEEDED", "D-03", "unchanged header"),
 ("1.2", "Technicians", "layout", "13 px dark label above an outlined \"Add Technician\" box with down-arrow", "CASE-NEEDED", "D-03", "S1-R7"),
 ("1.2", "Labor row", "layout · order", "one row: Labor Rate (widest, down-arrow) · Estimated Time · Tech Time; small grey labels at the top", "CASE-NEEDED", "D-03", "S1-R7"),
 ("1.2", "Buttons", "order · style · alignment", "right-aligned: Save & Add Part, Save & Add Line (white, blue 1 px border, blue text) · Save & Close (solid blue, white text)", "CASE-NEEDED", "D-03", "S1-R7, note 'all three button labels'"),
 ("1.2", "Dialog", "frame", "white card, 8 px corners, shadow, 455 px wide, over a grey backdrop", "CASE-NEEDED", "D-03, D-07, D-08", "dialog frame as drawn; backdrop colour is the board's"),
 ("1.5", "Title box (Edit Line)", "border · background", "1 px light grey border, white (no grey fill, no red line: no picker in Edit Line)", "CASE-NEEDED", "D-04", "1.5 note 2 'no canned-line picker'"),
 ("1.5", "Title label / value", "colours", "small grey \"Title\" #7b8595 at top; saved value dark #1d2129, 14 px", "CASE-NEEDED", "D-04", "S1-R3 filled state"),
 ("1.5", "Description box (empty)", "label / prompt", "small grey \"Description\" at top; grey prompt \"Why are you doing it?\" underneath", "CASE-NEEDED", "D-05", "S1-R3 empty state"),
 ("1.5", "Header", "elements", "\"Edit Line\" 17 px bold · blue #2276DA X at the far right · no AI tag or line builder link", "CASE-NEEDED", "D-06", "unchanged header"),
 ("1.5", "Status", "layout", "outlined box: small \"Status\" label, value, down-arrow", "CASE-NEEDED", "D-06", "S1-R7"),
 ("1.5", "Labor guide link", "position · style", "under the labor row: purple \"AI\" tag + blue capitals \"SHOPCOACH LABOR GUIDE\" (11 px, 600)", "CASE-NEEDED", "D-06", "S1-R7"),
 ("1.5", "Buttons", "order · colour", "right-aligned: Delete (solid red #C10015) then Save & Close (solid blue #2276DA)", "CASE-NEEDED", "D-06", "S1-R7"),
 ("1.2, 1.5", "Whole dialog", "width check", "every label, prompt and button whole, no overlap, at 1440 and at 1536 px (tool: 0 overlaps, 0 clipped at both widths)", "CASE-NEEDED", "D-07, D-08, D-09, D-10", "Rule 126 point 2"),
 ("1.2, 1.5", "Theme", "dark", "not drawn (light only); PRD silent", "OUT-OF-SCOPE", "", "design draws light theme only; no dark-theme source for these dialogs"),
 ("1.2, 1.5", "Phone width", "layout", "not drawn; PRD Form Factor: same words, no separate design", "COVERED", "C549078", "words at phone width; no look source"),
 ("1.3", "Legacy invoice panel", "layout", "title bold 12.5 px dark · description regular grey · tech story regular grey on its own line · no labels", "CASE-NEEDED", "D-11, D-13", "PRD §3"),
 ("1.3", "Modern invoice panel", "layout", "title bold · description · small grey capitals \"SCOPE OF WORK\" heading (11 px, 700, #8b95a3) · tech story", "CASE-NEEDED", "D-12, D-14", "PRD §3"),
 ("1.3", "QuickBooks tables", "columns · styles", "DESCRIPTION / QTY / AMOUNT, monospace description, old text in dark red", "OUT-OF-SCOPE", "", "QuickBooks' own screen, drawn as an illustration; its text is covered by C154713/C154715"),
 ("1.3", "Before / After markers", "dots", "red dot \"BEFORE\", green dot \"AFTER\"", "OUT-OF-SCOPE", "", "board annotation"),
 ("1.1, 1.4", "Before boards", "all looks", "today's dialogs (label inside the box, Title Case questions)", "OUT-OF-SCOPE", "", "Before boards: control only"),
 ("1.1, 1.2, 1.4, 1.5", "Board pills", "style", "white pill, 11 px uppercase, grey (before) / green (after)", "OUT-OF-SCOPE", "", "board annotation"),
 ("2.1", "Cards", "layout", "four white cards, blue rule headings, grey 'Line reads' boxes, green card for the semicolon", "OUT-OF-SCOPE", "", "text-output illustration; texts covered by C549081, C154718, C154713, C154716, C549082"),
 ("2.2", "Cut diagram", "layout", "blue 'Title · always survives', white clipped description with red ▾, pink 'Dropped'", "OUT-OF-SCOPE", "", "illustration of S3-R7; behaviour covered by C154717, C549083, C549084"),
 ("2.2", "Scale figures", "numbers", "255 · 65,535 · blue 4,000 · green rare", "OUT-OF-SCOPE", "", "illustration; 4,000 covered by C154717"),
 ("(no board)", "ShopCoach editor", "label position", "label at the top, prompt underneath (tech plan D5 stack-label on all five fields)", "CASE-NEEDED", "D-16", "S2-R1/R2 + tech plan"),
 ("(no board)", "ShopCoach table", "cell size", "cells must not grow or shift (tech plan Phase 3 walk 5, SV-10391)", "CASE-NEEDED", "D-17", "tech plan"),
 ("(no board)", "ShopCoach empty cell", "style", "grey italic (developer note on SV-10131 only)", "SPEC-CONFLICT", "DQ-02", "no source (PRD and design silent); asked, not asserted"),
 ("(no board)", "Title required message", "position", "under the Title box (S1-R6)", "COVERED", "C154709, C549075", "PRD look sentence with no board; Phase A adds the on-leaving-empty case"),
]
for i, h in enumerate(H):
    vis.append(dict(id=f"H{i+1:03d}", source="hand (board files and rendered DOM, inventory/dom-extract-2026-10-27.json)", board=h[0], element=h[1],
                    attribute=h[2], value=h[3], cls=h[4], ref=h[5], reason=h[6]))
vu = [v for v in vis if not v["cls"]]
for v in vu: PROBLEMS.append(f"UNCLASSIFIED visual row {v['id']} {v['element']}")
vc = Counter(v["cls"] for v in vis)
json.dump({"rows": vis, "counts": vc}, open("inventory/VISUAL-INVENTORY-2026-10-27.json", "w"), indent=1, ensure_ascii=False)
with open("inventory/VISUAL-INVENTORY-2026-10-27.md", "w") as o:
    o.write(f"# What/Why visual inventory, 27 Oct 2026 (Rule 126 point 3)\n\n{len(tool_rows)} rows from `design_visual_inventory.py` (14 states: 7 boards × "
            f"1440/1536, 0 fatal) + {len(H)} hand rows from the board files and the rendered DOM. By class: {dict(vc)} · **unclassified: {len(vu)}**\n\n"
            "| Id | Source | Board | Element | Attribute | Value | Class | Case / ref | Reason |\n|---|---|---|---|---|---|---|---|---|\n")
    for v in vis:
        o.write(f"| {v['id']} | {v['source'][:20]} | {v['board']} | {v['element']} | {v['attribute']} | {v['value'].replace('|', '/')} | {v['cls']} | {v['ref']} | {v['reason']} |\n")

# ---------------------------------------------------------------- divergence register rows and questions
raw = json.load(open("inventory/spec-to-design-raw.json", encoding="utf-8"))
REG = {}
for r in raw:
    where = ("design draws no error state; board 1.2 shows New Line at rest only. Checked 27 Oct 2026 in all 7 boards and the sweep "
             "(44 elements hovered and clicked, nothing exposed a message)") if r["code"] == "S1-R6" else \
            ("design has no board for Story 4 (the Invoices import); checked 27 Oct 2026, all 7 boards and both pages")
    REG[r["key"]] = {"outcome": "DESIGN-SILENT", "where": where, "cases": ["C154709", "C549075"] if r["code"] == "S1-R6" else ["C154723", "C549089"]}
REG["S2-R1/S2-R2|ShopCoach line builder (hand row)"] = {"outcome": "DESIGN-SILENT", "where": "no ShopCoach board (tech plan: Story 2 text-only); the "
    "tool cannot see this because \"Title\"/\"Description\" appear on the dialog boards. Checked by hand 27 Oct 2026", "cases": ["C154711", "C549079"]}
REG["DV-01|Require Tech Story off by default (canvas note-format)"] = {"outcome": "PO-RULED", "where": "Chris Ward answer 8 (14 Oct 2026, Google Doc "
    "1QcT7FRZci6AhYcI33HUac-Oob03-gCnCOKn2NFHMLjA): shops since June 2025 start off, older shops on; PRD v14/v15 S3-R6a. Design note text only, no "
    "screen differs", "cases": ["C154716", "C154713"], "held_case": None}
REG["DV-02|\"Tech story missing.\" written by the line dialog when nothing was typed (board 2.1 note)"] = {"outcome": "PO-RULED", "where":
    "Chris Ward answer 6 (14 Oct 2026): written when an existing line with no tech story is saved from Edit Line; New Line keeps it empty; PRD v14/v15 "
    "S3-R6. PRD §3 still carries the broader sentence the note repeats; no screen differs", "cases": ["C549082"], "held_case": None}
REG["DV-03|\"Title *\" with a star on board 1.2 (13 Oct copy)"] = {"outcome": "PO-RULED", "where": "PRD v14 S1-R1 'with no asterisk' (14 Oct, our FYI); "
    "design re-published by 27 Oct with \"Title\" (Main.dc.html, only change since 13 Oct). Closed: design and PRD agree", "cases": ["C154707"], "held_case": "D-01 checks it"}
REG["DV-04|Imported historical invoice line among the texts that 'reach the books' (board 2.1)"] = {"outcome": "QUESTION-READY", "where":
    "draft DQ-01 (QUESTIONS-DESIGN.json); not sent (Phase D makes no Google writes). Goes to the What/Why question sheet for Chris Ward "
    "(Rule 131: same file 1QcT7FRZ…, new rows at the bottom, new colour)", "cases": ["C549085"], "held_case": "D-15"}
json.dump(REG, open("DESIGN-DIVERGENCE-ROWS.json", "w"), indent=1, ensure_ascii=False)
QS = [
 dict(id="DQ-01", divergence="DV-04", held_cases=["D-15"], question=
      "The design's 'Awkward inputs' board lists a line 'Imported from a previous system' among the texts that reach the books, reading "
      "\"Replace tie rod - excessive play\". Your page says an imported invoice never reaches the live QuickBooks sync and its text is "
      "unaffected whatever the import wrote (S3-R12). (a) Does an imported invoice appear in the downloaded Customer Invoice report? "
      "(b) If it does, should its line read \"Title - Description\" like any other line, as the board shows? (c) If not, what should "
      "the report show for it?"),
 dict(id="DQ-02", divergence=None, held_cases=[], question=
      "In the ShopCoach line builder, an emptied title or description cell shows \"What are you doing?\" / \"Why are you doing it?\". "
      "The developer's note on SV-10131 says the prompt shows in grey italic; your page and the design say nothing about its look. "
      "Should testers expect grey italic text there, or is the look of the empty cell not part of this change?"),
 dict(id="DQ-03", divergence=None, held_cases=[], question=
      "On the modern invoice, the tech story prints under a \"Scope of work\" heading (your page, section 3). When a line has no tech "
      "story, or it reads \"Tech story missing.\", the page says the narrative is dropped. Is the \"Scope of work\" heading dropped as "
      "well, so nothing under the description is printed?"),
]
json.dump(QS, open("QUESTIONS-DESIGN.json", "w"), indent=1, ensure_ascii=False)

# ---------------------------------------------------------------- case plan
for c in CASES:
    if len(c["title"]) > 80 or not c["title"].startswith("Design: "): PROBLEMS.append(f"{c['key']} title: {len(c['title'])} chars")
    for e in c["existing"]:
        if e not in live: PROBLEMS.append(f"{c['key']} names {e}, not a live case")
    for b in c["backing"]:
        if b not in Q: PROBLEMS.append(f"{c['key']} backing {b} not in Q")
with open("DESIGN-CASE-PLAN.md", "w") as o:
    o.write("# What/Why — \"Design — how it looks\" case plan, 27 Oct 2026 (Phase D part 1, DRAFT)\n\n"
            f"Design: {DESIGN_LINK} (re-read 27 Oct 2026; 8 files; only change since 13 Oct: \"Title *\" → \"Title\" on New Line - after). "
            "Expected looks come from PRD 845348896 v15 (14 Oct 2026) where it has a sentence, otherwise from the named board (Rule 126 point 5); "
            "the tech plan (23 Sep 2026) informs. Every backing quote below is checked verbatim by `build_design_outputs.py`. Part 2 writes "
            "these in `authoring/cases_design.py` in the QA lead's pattern (Rule 117 fourteenth and fifteenth amendments): plain bullets, "
            "one action per step, \"Step N:\" results, quotes with From: lines, References from Design (board picture attached, board words "
            "quoted), AUTOMATION line last. Section: new \"Design — how it looks\" under What/Why 20437.\n\n"
            f"**{len(CASES)} cases planned** ({sum(1 for c in CASES if c.get('held'))} held design-version case). Boards with a case: 1.2 (D-01, "
            "D-02, D-03, D-07, D-08), 1.5 (D-04, D-05, D-06, D-09, D-10), 1.3 (D-11 to D-14), 2.1 (D-15, held). Boards without a look case and why: "
            "1.1 and 1.4 are Before boards (today's screens: used as the control in D-01, D-02, D-04); 2.1's other cards and 2.2 draw line text, "
            "not a screen, and every example on them is checked letter for letter by a behaviour case (C549081, C154718, C154713, C154716, "
            "C549082, C154717, C549083, C549084), which Phase A must give the board's own example values and cite under References from Design. "
            "Every board picture is attached to at least one case: 1.1 → D-01/D-02, 1.4 → D-04, 2.2 → C154717 (Phase A).\n\n"
            "## Summary\n\n| Key | Title | Board | Backing | Existing cases that already check part of it |\n|---|---|---|---|---|\n")
    for c in CASES:
        o.write(f"| {c['key']} | {c['title']} | {c['board']} | {', '.join(c['backing'] + ['tech plan ' + t for t in c.get('tp', [])])} | "
                f"{', '.join(c['existing']) or 'none'}{' · HELD' if c.get('held') else ''} |\n")
    for c in CASES:
        o.write(f"\n## {c['key']} · {c['title']}\n\n- **Board:** {c['board']}" + (f" · width {c['width']} px" if c.get("width") else "") + "\n")
        o.write("- **Preconditions (sketch):** " + " ".join(c["pre"]) + "\n- **Steps (sketch):** " +
                " ".join(f"{i+1}. {s}" for i, s in enumerate(c["steps"])) + "\n- **What the tester checks:**\n")
        for k in c["checks"]: o.write(f"  - {k}\n")
        o.write("- **Backing (PRD 845348896 v15, verbatim):**\n")
        for b in c["backing"]: o.write(f"  - {b}: \"{Q[b]}\"\n")
        for t in c.get("tp", []): o.write(f"  - Tech plan 23 Sep 2026, {t}: \"{TP[t]}\"\n")
        if c["design"]:
            o.write("- **Design's own words (References from Design):**\n")
            for d in c["design"]: o.write(f"  - board {d.split()[0]}: \"{DW[d]}\"\n")
        o.write(f"- **Existing cases that already check part of it:** {', '.join(c['existing']) or 'none'}\n")
        if c.get("note"): o.write(f"- **Note:** {c['note']}\n")
        if c.get("held"): o.write("- **Marker:** `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO` (not added to the run while held)\n")

print(f"text rows {len(out)} ({dict(cnt)}), in a live case {sum(r['in_a_case'] for r in out)}, unclassified {len(uncl)}")
print(f"visual rows {len(vis)} ({dict(vc)}), unclassified {len(vu)}")
print(f"register rows {len(REG)}; questions {len(QS)}; planned cases {len(CASES)}")
print(f"PROBLEM lines: {len(PROBLEMS)}")
for p in PROBLEMS: print("PROBLEM", p)
sys.exit(1 if PROBLEMS else 0)
