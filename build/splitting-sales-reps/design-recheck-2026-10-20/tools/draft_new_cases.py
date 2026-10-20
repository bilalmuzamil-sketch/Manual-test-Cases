#!/usr/bin/env python3
"""DRAFT design cases from the 20 Oct 2026 re-check (NOT written to TestRail). Same model and render as authoring/ssr_lib.py and
authoring/cases_design.py, with two changes the re-check needs: quotes come from PRD v10 (Confluence 919928833, 19 Oct 2026) and from
Chris Ward's answers (question sheet of 19 Oct 2026), each with its own "From:" line (Rule 117, eleventh amendment).
Run: PYTHONDONTWRITEBYTECODE=1 python3 -B tools/draft_new_cases.py   (writes only new-design-cases.json in this folder)."""
import sys, os, json, re, html
sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.dirname(HERE)
sys.path.insert(0, f"{P}/authoring")
import ssr_lib
from common import ADMIN, REPS2, REPS3, CUST, WO, START
import cases_design as CD          # gives TITLE, NOTE, pic(), PIC_PRE(), DQ(), DSRC(); registers the 18 existing cases, cleared below
ssr_lib.CASES.clear()

# ---- PRD v10 instead of v8 ----
V10 = open(f"{P}/prd-v10-2026-10-20/CONFLUENCE-919928833-v10-2026-10-20.md").read()
CODE10 = {m.group(1): m.group(2).strip() for m in re.finditer(r"^- \*\*(S\d+-[RNE]\d+[a-z]?):\*\*\s*(.*)$", V10, re.M)}
ssr_lib.CODE.clear(); ssr_lib.CODE.update(CODE10)
ssr_lib.PRDW = ssr_lib.ws(V10)
PRD10 = 'PRD "Splitting Sales Representatives", Confluence 919928833, version 10 (19 Oct 2026, Chris Ward), read 20 Oct 2026'
ANS = {a["no"]: a["answer_verbatim"] for a in json.load(open(f"{HERE}/chris-answers.json"))["answers"]}
ANS_NAME = ("Chris Ward's answers, question sheet of 19 Oct 2026, Google Sheet 17Ry1BtRTPEkecBP5TlgAE0T93Ai1TQewdJ7B7WpWDBQ, tab "
            "\"Questions for Chris\", rows 6-43 (answered 19 Oct 2026, Chris Ward), read 20 Oct 2026")
def AQ(n): return (f"Chris Ward's answer {n}", ANS[n])
EXTRA = {f"Chris Ward's answer {n}": t for n, t in ANS.items()}
HELD = "AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO"
e = ssr_lib.e

def quotes_block(c):
    prd = [(l, t) for l, t in ssr_lib.quotes(c) if not l.startswith(("Design — board", "Chris Ward's answer"))]
    an = [(l, t) for l, t in ssr_lib.quotes(c) if l.startswith("Chris Ward's answer")]
    sto = ", ".join(f"story {ssr_lib.STORY[n][0]} ({ssr_lib.STORY[n][1]})" for n in ssr_lib.story_nums(c))
    h = "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
    first = True
    for name, grp in ((PRD10, prd), (ANS_NAME, an)):
        if not grp: continue
        h += f"<p>From: {e(name)}" + (f" &middot; Epic SV-10890, {e(sto)}" if first else "") + "</p>"
        h += "<ul>" + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(t)}&rdquo;</li>" for l, t in grp) + "</ul>"
        first = False
    return h + f"<p>{e(ssr_lib.NOBUILD)}</p>"
def render(c):
    pre = "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in c["pre"]) + "</ul>"
    exp = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(r)}</li>" for r in c["res"]) + "</ul>"
           + (f"<p>{e(c['known'])}</p>" if c["known"] else "") + quotes_block(c) + ssr_lib.design_block(c) + f"<p>{e(c['marker'])}</p>")
    refs = ",".join(dict.fromkeys(ssr_lib.STORY[n][0] for n in ssr_lib.story_nums(c)))
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": refs, "custom_automation_type": 2, "custom_atmstatus": 1,
            "custom_preconds": pre, "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in c["steps"]) + "</ol>", "custom_expected": exp}

META = {}
def D(key, title, pre, steps, res, q, boards, note="", stories=None, marker=None, known="", gap="", why="", width=None):
    ssr_lib.C(key, "DESIGN", title, pre[:1] + [CD.PIC_PRE(boards, width) if width else CD.PIC_PRE(boards)] + pre[1:], steps, res, q + CD.DQ(boards),
              design_src=CD.DSRC(boards), note=note, pictures=CD.PICS(boards), stories=stories, marker=marker, known=known)
    META[key] = dict(gap=gap, why=why, boards=[f"build/splitting-sales-reps/design-drive-2026-10-19/unpacked/png/{CD.pic(b)}" for b in boards])

W = START("{Work-order-1} is open in that browser window")
SBR = START("Reports > Sales By Representative is open in that browser window, with the date range set to today and Show Unassigned on")
INV_SPLIT = ("Work order {Work-order-1} for {Customer-A} has \"Sales Representative - Labor\" {Sales-rep-A} and \"Sales Representative - Parts\" {Sales-rep-B} and was invoiced today; it has one labor line and one part.",
             "For example: {Work-order-1} is S2-40001.")

D("DR-01", 'Design: invoiced card keeps "Lead technician" and "Service advisor" labels',
  [ADMIN, REPS2,
   ("Work order {Work-order-1} has been invoiced; its card shows \"Sales Representative - Labor\" reading {Sales-rep-A} and \"Sales Representative - Parts\" reading {Sales-rep-B}.", "For example: {Work-order-1} is S2-40001."),
   ("Work order {Work-order-2} is open and not invoiced.", "For example: {Work-order-2} is S2-40002."), W],
  ["Without hovering, read the labels of the four fields on the card and compare them with the picture of board 1.17.",
   "Hover over the four fields.",
   "Open {Work-order-2} and compare its Lead Technician, Service Advisor and Sales Representative labels with the picture of board 1.2."],
  ["Step 1: the labels read \"Lead technician\" and \"Service advisor\" (small second word, as on an invoiced card today), then \"Sales Representative - Labor\" and \"Sales Representative - Parts\" with capital letters; each name sits below its label as plain text, as in the picture.",
   "Step 2: nothing changes: no box, no arrow, no + and no remove x.",
   "Step 3: on the open work order the labels read \"Lead Technician\", \"Service Advisor\" and \"Sales Representative\", as in the picture."],
  ["S2-R17", AQ(8), "S1-R2"], ["1.17", "1.2"], stories=[1, 2], gap="GAP-1",
  why="PRD v10 S2-R17 adds 'Lead Technician and Service Advisor keep today's read-only labels' (answer 8). Board 1.17 shows exactly that, but C666024 and C665932 state only the Sales Representative labels. Alternative to a new case: add step 1's label check to C666024 (QA lead decides).")

D("DR-02", 'Design: a part sale\'s field label still reads "Sales representative"',
  [ADMIN, REPS2, CUST, ("Part sale {Part-sale-1} for {Customer-A} is open and not invoiced.", "For example: {Part-sale-1} is P-30001."),
   START("{Part-sale-1} is open in that browser window")],
  ["Without hovering, read the label of the part sale's representative field.",
   "Hover over the field and compare it with the picture of board 3.2.",
   "Pick {Sales-rep-A} from the field's list."],
  ["Step 1: the label reads \"Sales representative\", with a small \"r\" (not \"Sales Representative\"); there is one field and no + or remove x beside it.",
   "Step 2: the hover look is the part sale field's own (box and arrow across the full width of the card, as in the picture); no + or remove x appears.",
   "Step 3: the field reads {Sales-rep-A} and its label still reads \"Sales representative\"; still no + and no remove x."],
  ["S2-N2", AQ(7)], ["3.1", "3.2", "3.4"], stories=[2],
  known="The part sale's Sales Representative field comes from Part Sales Update v1 (SV-10266). If that is not on the build being tested, mark this case Blocked and say so.",
  note="Boards 3.1 to 3.4 read \"Sales Representative\" with a capital R (checked on a 4x crop of board 3.1). PRD v10 and Chris Ward's answer 7 keep the label \"Sales representative\"; this case follows them, and the design's capital R is not what to expect.",
  gap="GAP-2", why="PRD v10 S2-N2 now says the label stays 'Sales representative' (answer 7). The boards show a capital R; C666030 expects the capital R and C665935 does not check the label. Alternative to a new case: correct C666030 step 1 (QA lead decides; C666030 must change either way).")

D("DR-03", "Design: a part sale row shows a dash in the labor columns",
  [ADMIN, REPS2, CUST, ("Part sale {Part-sale-1} for {Customer-A} has Sales Representative {Sales-rep-A}, one part and no labor, and was invoiced today.", "For example: {Part-sale-1} is P-30001 with one part sold at $50.00."), SBR],
  ["Turn the Sales Type column on in the column selector and expand {Sales-rep-A}.",
   "Read {Part-sale-1}'s row in the Labor Delta, Labor Invoiced and Labor Margin columns and compare it with the picture of board 4.10.",
   "Export the Expanded CSV and read the same row's Hrs Worked, Hrs Invoiced, Labor Delta, Labor Invoiced and Labor Margin cells.",
   "Export the Expanded PDF and read the same cells."],
  ["Step 1: {Part-sale-1} shows as one row with Sales Type \"Part Sales\".",
   "Step 2: each labor column shows a dash (\"—\"), as in the picture (today's report, board 4.3, shows 0.00 and $0.00 there).",
   "Step 3: those cells are blank, as in the picture of board 4.11.",
   "Step 4: those cells show a dash, as in the picture of board 4.12."],
  ["S5-R9", "S5-R3"], ["4.3", "4.10", "4.11", "4.12"], stories=[5], marker=HELD,
  note="This is the design's version, held. The PRD gives the dash rule only for a work order's Labor and Parts rows (S5-R15) and for a part sale's Shop Supplies (S5-R15a); it says nothing about a part sale row's labor columns. Today's report (board 4.3) shows 0.00 / $0.00 there; the design shows a dash and blank cells (boards 4.5, 4.10 to 4.12). Waiting on the product owner: question Q-A in DESIGN-DIVERGENCE-REGISTER.json (drafted 20 Oct 2026, not sent).",
  gap="GAP-3", why="Design-only behaviour change against today's report with no PRD sentence and no answer: Rule 130 item 5 held design-version case.")

D("DR-04", "Design: invoice dates in the Expanded exports match the screen",
  [ADMIN, REPS2, CUST, INV_SPLIT, SBR],
  ["Expand {Sales-rep-A} and {Sales-rep-B} and write down the Date on {Work-order-1}'s two invoice rows.",
   "Export the Expanded CSV and read the Date of the same two rows.",
   "Export the Expanded PDF and read the Date of the same two rows."],
  ["Step 1: both rows show the same date.",
   "Step 2: the CSV shows the same date as the screen on both rows.",
   "Step 3: the PDF shows the same date as the screen on both rows."],
  [AQ(33)], ["4.10", "4.11", "4.12"], stories=[5],
  note="In the design the same invoices read Sep 28 2026 on screen (board 4.10) and Sep 29 2026 in the CSV and the PDF (boards 4.11 and 4.12). Chris Ward ruled this a mistake in the design's sample data: the dates must match (answer 33).",
  gap="GAP-4", why="Answer 33 makes 'the dates must match' a rule; no case compares the export dates with the screen (C666032 compares the look only, with sample data).")

D("DR-05", 'Design: on a phone the reps show under the "Hide Details" toggle',
  [ADMIN, REPS2, ("Work order {Work-order-1} is open and not invoiced; its one \"Sales Representative\" field reads {Sales-rep-A}.", "For example: {Work-order-1} is S2-40001."),
   "You are on a phone (a touch screen with no mouse pointer) about 390 px wide, and the work order card opens with its fields hidden.",
   START("{Work-order-1} is open on the phone")],
  ["Tap the details toggle above the work order card.",
   "Compare the screen with the picture of board 6.2."],
  ["Step 1: the toggle reads \"Hide Details\" and the card shows Lead Technician, Service Advisor and the Sales Representative field.",
   "Step 2: as in the picture: \"Hide Details\" above the card, and \"Sales Representative\" reading {Sales-rep-A} with the + beside it."],
  ["S3-R6", AQ(9)], ["6.0", "6.2"], stories=[3], marker=HELD, width="a phone screen 390 px wide",
  note="This is the design's version, held. PRD v10 S3-R6 and Chris Ward's answer 9 say the fields show after the card is expanded with its edit button, and answer 9 rejected \"Show Details\". Every phone board, today (6.0) and the build (6.2 to 6.7), shows a \"Hide Details\" toggle above the card and no edit button. Waiting on the product owner: question Q-B in DESIGN-DIVERGENCE-REGISTER.json (drafted 20 Oct 2026, not sent). C665937 follows the PRD.",
  gap="GAP-5", why="The design (including its picture of today) shows a different control from the one the PRD and answer 9 name; a ruling covers only what it names, so this is a question plus a held design-version case (Rule 130 item 5).")

D("DR-06", "Design: Sales Type sits between Status and Location",
  [ADMIN, ("A second location, {Location-B}, is open to you, and the report shows its Location column.", "For example: {Location-B} is QA Testing, and both locations are selected in the Location filter."),
   REPS2, ("Work order {Work-order-1} at {Location-A} has \"Sales Representative - Labor\" {Sales-rep-A} and \"Sales Representative - Parts\" {Sales-rep-B} and was invoiced today.", "For example: {Work-order-1} is S2-40001."), SBR],
  ["Turn the Sales Type column on in the column selector.",
   "Read the column headings from Status to the first money column.",
   "Export the Expanded CSV and read the same headings.",
   "Export the Expanded PDF and read the same headings."],
  ["Step 1: a Sales Type column appears.",
   "Step 2: the headings read Status, Sales Type, Location, in that order (the picture of board 4.9 shows Sales Type straight after Status).",
   "Step 3: the CSV headings read Status, Sales Type, Location, in that order.",
   "Step 4: the PDF headings read Status, Sales Type, Location, in that order."],
  ["S5-R19", "S5-R23", AQ(26)], ["4.9", "4.11", "4.12"], stories=[5],
  note="The design draws one location only, so no board shows a Location column (boards 4.9 to 4.12 show Sales Type straight after Status). The order Status, Sales Type, Location comes from PRD v10 and Chris Ward's answer 26.",
  gap="GAP-6", why="PRD v10 S5-R19 and S5-R23 add 'before Location' (answer 26); the design is silent and no case checks Location's place (C665972, C665973, C666031, C666032 say 'after Status' only).")

D("DR-07", "Design: each split row shows its share under Adjustments",
  [ADMIN, REPS2, CUST,
   ("Work order {Work-order-1} for {Customer-A} has labor $600.00, parts $400.00, shop supplies $30.00 and a whole-invoice discount of $50.00, \"Sales Representative - Labor\" {Sales-rep-A} and \"Sales Representative - Parts\" {Sales-rep-B}, and was invoiced today.",
    "For example: {Work-order-1} is S2-40001."), SBR],
  ["Expand {Sales-rep-A} and {Sales-rep-B}.",
   "Read the Adjustments column on {Work-order-1}'s Labor row and on its Parts row.",
   "Export the Expanded CSV and read the Adjustments cells of the same two rows.",
   "Export the Expanded PDF and read the Adjustments cells of the same two rows."],
  ["Step 1: {Work-order-1}'s invoice shows one Labor row under {Sales-rep-A} and one Parts row under {Sales-rep-B}.",
   "Step 2: Adjustments reads ($30.00) on the Labor row and ($20.00) on the Parts row (600 ÷ 1,000 × 50 and 400 ÷ 1,000 × 50): each row shows only its own share; the $30.00 shop supplies sit on the Labor row.",
   "Step 3: the CSV shows the same two shares under Adjustments: the $30.00 discount share on the Labor row and the $20.00 share on the Parts row.",
   "Step 4: the PDF shows the same two shares under Adjustments."],
  ["S5-R6", "S5-R3", AQ(22)], ["4.7", "4.11", "4.12"], stories=[5],
  gap="GAP-7", why="PRD v10 S5-R6 adds 'Each row shows its share in its Adjustments column' (answer 22); boards 4.7, 4.11 and 4.12 show it (Elliot 83.32, Devon 11.03 on S1-12); C665964 still says 'judge the amounts wherever they show' and no case names the column.")

D("DR-08", "Design: a Lead Technician message pushes the fields below it down",
  [ADMIN, REPS2, CUST, WO('its one "Sales Representative" field reads {Sales-rep-A}'), W],
  ["Without any message showing, measure the gaps between Lead Technician, Service Advisor and Sales Representative.",
   "Make the Lead Technician message show.",
   "Look where the message sits and measure the gaps below it.",
   "Make the message go away and measure the gaps again."],
  ["Step 1: every gap is 16 px, as in the picture of board 1.2.",
   "Step 2: a message shows directly below the Lead Technician field.",
   "Step 3: the message sits directly under Lead Technician and pushes Service Advisor and the Sales Representative field down; nothing overlaps.",
   "Step 4: every gap is 16 px again."],
  ["S1-R6a", "S1-R6", AQ(4)], ["1.2"], stories=[1],
  marker="AUTOMATION: HOLD - how to make a Lead Technician message show is not in the sources, waiting on the PO",
  known="Step 2 cannot be carried out yet: no source says what makes a Lead Technician message show. The case stays on hold until the product owner answers (question Q-C).",
  note="No board shows a Lead Technician message (design silent); board 1.2 is the picture for the gaps without a message. Question Q-C in DESIGN-DIVERGENCE-REGISTER.json (drafted 20 Oct 2026, not sent) asks what makes the message show.",
  gap="GAP-8", why="New PRD v10 requirement S1-R6a (answer 4) with no case and no board; the trigger is not in any source, so the case is drafted and held (Rules 58, 114).")

probs = [p for c in ssr_lib.CASES for p in ssr_lib.check(c, EXTRA)]
for c in ssr_lib.CASES:
    if not c["title"].startswith("Design: "): probs.append(f"{c['key']}: title must start 'Design: '")
    h = render(c)["custom_expected"]
    if "<p></p><p><strong>References from Design</strong></p>" not in h: probs.append(f"{c['key']}: no References from Design block")
    if not h.rstrip().endswith("</p>") or "AUTOMATION:" not in h.split("References from Design")[1]: probs.append(f"{c['key']}: AUTOMATION line not last")
    for p_ in c["pictures"]:
        if p_ not in " ".join(a for a, _ in c["pre"]): probs.append(f"{c['key']}: picture {p_} not named in preconditions")
out = []
for c in ssr_lib.CASES:
    f = render(c)
    out.append(dict(key=c["key"], section_id=84277, title=f["title"], custom_preconds=f["custom_preconds"], custom_steps=f["custom_steps"],
                    custom_expected=f["custom_expected"], refs=f["refs"], template_id=1, type_id=7, priority_id=2, custom_automation_type=2,
                    custom_atmstatus=1, boards=META[c["key"]]["boards"], gap=META[c["key"]]["gap"], why=META[c["key"]]["why"],
                    marker=c["marker"], status="DRAFT - not written to TestRail (needs the QA lead's go-ahead, Rule 6; creation hold H1 to be checked)"))
json.dump({"drafted": "2026-10-20", "section": "84277 Design — how it looks (group 84266)", "count": len(out), "check_problems": probs, "cases": out},
          open(f"{HERE}/new-design-cases.json", "w"), indent=1, ensure_ascii=False)
print("drafts", len(out), "problems", len(probs)); [print(" ", p) for p in probs]
for c in out: print(c["key"], len(c["title"]), c["title"], "|", c["marker"][:40])
