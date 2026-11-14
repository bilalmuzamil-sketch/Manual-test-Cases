"""PRD v1.4 (13 Nov 2026, Milos Vasic) and design version 1794565397-7f4c: the NAMED SET (14 Nov 2026). Loaded after every other case module.

The QA lead's decision of 14 Nov 2026, verbatim option chosen: "Named set, drop S12-49 (Recommended)" - "Rewrite, re-quote or re-picture the
34 touched cases, write the 54 drafts on v1.4 (S12-49 dropped), sync the run and stamp the folder. The other 606 keep their v1.3 From line."
Plan: po-answers-2026-11-12/V1.4-IMPACT.md. What v1.4 changes: S12-R3 (the chip of a no-charge line reads "No Charge", with the tooltip
"Category: [category]" on hover; the category is not printed in the chip), S2-R22 and S12-E8 (Print Work Order prints the "No Charge" chip),
section 8 row "No-charge line" ("No Charge" (tooltip "Category: [category]")). The design changed the same chip text on 6 boards and draws
no tooltip.

This module switches ONLY the named set to v1.4, by a PER-CASE override (c["prd"] = "1.4", c["design"] = "v14"; iwo_lib.quotes,
quotes_block, check and design_for read them). Every other case builds to exactly its v1.3 text (proved by
po-answers-2026-11-12/v14/prove_unchanged.py).
- CHANGE (16): rewritten top to bottom (Rule 134): the chip reads "No Charge"; where the case judges the chip, a hover step whose result is
  the tooltip "Category: [category]" and a result that the chip itself shows no category name; S12-R3 v1.4 quoted; v14 pictures.
- RE-QUOTE (8): the quote is re-taken from v1.4 (S12-E8, S2-R22); steps and results unchanged.
- DESIGN REFERENCE (10): the flow6-3/hf-32 and flow6-4/hf-33 pictures become the -v14 ones and the design words "No Charge · Warranty"
  become the board's v1.4 words "No Charge"; the design line names 1794565397-7f4c; the quotes are re-read from v1.4 (word for word the same).
- CONFIRM (1): S12-24 is not touched (it stays on v1.3).
- The 54 layout stress drafts (S12-49 dropped in cases_zzzz_stress.py): built on v1.4 and 1794565397-7f4c; D-113 and D-143 rewritten.
Every touched case and every new case that is not held carries the 11/14/2026 marker. V14_CHANGES lists what changed per case (the pass
report adds the per-part CHANGED/CONFIRMED record, computed from proposals.json before and after)."""
import re
from iwo_lib import CASES, MARKER, MARKER14
from common import NAME_NOTE
import design_refs as DR
import cases_zzzz_stress as ST

BY = {c["key"]: c for c in CASES}
V14_CHANGES = {}
def _log(k, w): V14_CHANGES.setdefault(k, []).append(w)

CHANGE = ["D-68", "S12-04", "S12-11", "S12-13", "S12-15", "S12-21", "S12-27", "S12-28", "S12-30", "S12-33", "S12-36", "S12-43",
          "S12-46", "S2-100", "S2-35", "S7-20"]
REQUOTE = ["API-22", "API-27", "S12-23", "S12-25", "S12-35", "S12-37", "S12-38", "S12-39"]
DESIGNREF = ["D-69", "S12-05", "S12-07", "S12-08", "S12-09", "S12-14", "S12-44", "S12-47", "S12-48", "S12P-08"]
CONFIRM = ["S12-24"]
TOUCHED = CHANGE + REQUOTE + DESIGNREF                      # the 34 live cases the write script updates
DRAFTS = [k for k in ST.STRESS_NEW]                         # the 54 layout stress drafts (S12-49 dropped)
assert len(TOUCHED) == 34 and len(set(TOUCHED)) == 34 and len(DRAFTS) == 54 and "S12-49" not in BY, (len(TOUCHED), len(DRAFTS))

NOCAT = 'The chip shows only the words "No Charge", with no category name in it.'
def TIP(cat): return f'A tooltip reads "Category: {cat}".'
def HOVER(where="line 2"): return f'Hover over the "No Charge" chip on {where}.'
N45 = ('Register IWO-N45 on S12-R3 (design silent): the boards draw the chip "No Charge" but no tooltip; PRD v1.4 S12-R3 states the tooltip '
       '"Category: [category]" on hover, so this case follows the PRD.')
D63 = ('Difference IWO-D63 on S12-R3 (chip text): closed, the design (version 1794565397-7f4c) draws the chip "No Charge" as PRD v1.4 S12-R3 says.')


def setc(k, why, **kw):
    c = BY[k]
    for f, v in kw.items():
        c[f] = [list(r) for r in v] if f == "res" else (list(v) if isinstance(v, (list, tuple)) else v)
    _log(k, why)


def addq(k, code):
    c = BY[k]
    if code not in c["q"]: c["q"].append(code); _log(k, f"quotes {code} (PRD v1.4) for the chip text")


# =============================================== CHANGE (16) =========================================================================
c = BY["D-68"]
setc("D-68", "chip text \"No Charge\" (S12-R3 v1.4); hover step for the tooltip \"Category: Warranty\"; the chip shows no category; title",
     title="Design: A no-charge line shows the No Charge chip and $0.00, no work order badge",
     steps=["Open the billable work order.", HOVER("the second line")],
     res=[['The second line shows the chip "No Charge" next to its title; its Rate, Total and every part on it show $0.00 and Margin shows nothing.',
           NOCAT, "The work order header has no badge and no orange style."],
          [TIP("Warranty")]])
c["design_notes14"] = [D63, N45]

setc("S12-04", "chip text \"No Charge\" (S12-R3 v1.4, section 8 row 35 v1.4); hover step for the tooltip; the chip shows no category; title",
     title="A marked line shows the No Charge chip and $0.00, the work order stays billable",
     steps=BY["S12-04"]["steps"] + [HOVER()],
     res=BY["S12-04"]["res"][:4]
         + [['Line 2 shows the chip "No Charge" next to its title.', NOCAT, "Its Rate, Total and part show $0.00; Margin shows nothing.",
             "Its 1.5 hours, technician and status stay.", "The work order shows no badge and no orange header card.",
             "The original work order and line are not shown on the line."],
            [TIP("Goodwill")]])
BY["S12-04"]["design_notes14"] = [D63, N45]

setc("S12-11", "chip text \"No Charge\" (S12-R3 v1.4); hover step for the tooltip; the chip shows no category",
     steps=BY["S12-11"]["steps"] + [HOVER("the new line")],
     res=BY["S12-11"]["res"][:5] + [['The new line shows the chip "No Charge" and $0.00.', NOCAT], [TIP("Goodwill")]])
addq("S12-11", "S12-R3")

_s, _r = BY["S12-13"]["steps"], BY["S12-13"]["res"]
setc("S12-13", "chip text \"No Charge\" (S12-R3 v1.4); the new category is read in the tooltip (hover step) instead of the chip",
     steps=_s[:5] + [HOVER()] + _s[5:],
     res=_r[:4] + [['Line 2 still shows the chip "No Charge".', NOCAT], [TIP("Comeback")]] + _r[5:])
addq("S12-13", "S12-R3")
BY["S12-13"]["design_notes14"] = [N45]

_s, _r = BY["S12-15"]["steps"], BY["S12-15"]["res"]
setc("S12-15", "chip text \"No Charge\" (S12-R3 v1.4); hover step for the tooltip \"Category: Comeback\"; the chip shows no category",
     steps=_s[:7] + [HOVER()] + _s[7:],
     res=_r[:6] + [['Line 2 shows the chip "No Charge".', NOCAT], [TIP("Comeback")]] + _r[7:])
addq("S12-15", "S12-R3")

_s, _r = BY["S12-21"]["steps"], BY["S12-21"]["res"]
setc("S12-21", "chip text \"No Charge\" (S12-R3 v1.4); hover step for the tooltip; the chip shows no category",
     steps=[_s[0], HOVER(), _s[1]],
     res=[['Line 2 shows the chip "No Charge" and no prices, as prices are hidden for this user.', NOCAT], [TIP("Goodwill")], _r[1]])
addq("S12-21", "S12-R3")

_s, _r = BY["S12-27"]["steps"], BY["S12-27"]["res"]
setc("S12-27", "chip text \"No Charge\" (S12-R3 v1.4); the kept category is read in the tooltip (hover step)",
     steps=_s[:3] + [HOVER("line 2 of the new work order")] + _s[3:],
     res=_r[:2] + [['Line 2 shows the chip "No Charge" on the new work order.', NOCAT], [TIP("Goodwill")]] + _r[3:])
addq("S12-27", "S12-R3")

_s, _r = BY["S12-28"]["steps"], BY["S12-28"]["res"]
setc("S12-28", "chip text \"No Charge\" (S12-R3 v1.4); the kept category is read in the tooltip (hover step)",
     steps=_s[:4] + [HOVER()] + _s[4:],
     res=_r[:3] + [['Line 2 still shows the chip "No Charge".', NOCAT], [TIP("Comeback")]] + _r[4:])
addq("S12-28", "S12-R3")

_s, _r = BY["S12-30"]["steps"], BY["S12-30"]["res"]
setc("S12-30", "chip text \"No Charge\" (S12-R3 v1.4); the archived category is read in the tooltip (hover step)",
     steps=[_s[0], HOVER()] + _s[1:],
     res=[['Line 2 still shows the chip "No Charge".', NOCAT], [TIP("[category A's name]")]] + _r[1:])
addq("S12-30", "S12-R3")

_r = BY["S12-33"]["res"]
assert _r[2][1] == 'Under the part\'s name it reads "No Charge · Goodwill".'
setc("S12-33", "the result 'Under the part's name it reads \"No Charge · Goodwill\"' is removed: no PRD sentence backs it (S12-E7 names no "
     "label) and its only basis, tech plan TP-490 (revision 5, built on PRD v1.0), copies the old chip text that PRD v1.4 S12-R3 takes the "
     "category out of; TP-490 moves to cases_tp.TP_OUT with the reason (candidate PO point in the pass report)",
     res=_r[:2] + [[_r[2][0]]] + _r[3:], q=[x for x in BY["S12-33"]["q"] if x != "TP-490"])
import cases_tp
cases_tp.TP_OUT["TP-490"] = ("Issue Credit showing \"No Charge · [category]\" under the part name: tech plan revision 5 (built on PRD v1.0) copies "
                             "the old chip text; PRD v1.4 S12-R3 takes the category out of the chip and S12-E7 names no label, so no expected "
                             "result rests on it (14 Nov 2026; candidate PO point in po-answers-2026-11-12/V1.4-NAMED-SET-PASS-REPORT.md).")

setc("S12-36", "print chip \"No Charge\" (S2-R22, S12-E8 v1.4); the printed chip shows no category; title",
     title="Print Work Order prints the No Charge chip next to the no-charge line",
     res=[BY["S12-36"]["res"][0],
          ['The print shows the chip "No Charge" next to line 2; line 1 prints with no chip.',
           'The chip on line 2 shows only the words "No Charge", with no category name in it.']])

setc("S12-43", "chip text \"No Charge\" (S12-R3 v1.4); Tech View in a desktop browser with a hover step for the tooltip; the phone checks "
     "the chip text only (PRD v1.4 says the tooltip shows on hover and says nothing about a phone: candidate PO point); title, preconditions",
     title="The No Charge chip shows in Tech View and on the phone",
     pre=["Sign in as an Admin at the test location.", "Make sure the Internal Work Orders setting is on in Settings > Work Orders.",
          "Use a desktop browser at least 1440 pixels wide.",
          "Have a phone signed in to ShopView as the same Admin, or a second browser window narrowed to 390 pixels wide.",
          "Have a new customer for this test, customer A, with its own labor rate of $120.00 an hour.",
          "Have a new work order for this test, work order 1, for customer A, in status Approved, billable, with line 1 of 2.0 hours at $120.00 an hour and line 2 of 1.5 hours with one stock part costing $40.00, line 2 marked No Charge under Goodwill."],
     steps=["Open work order 1 in the desktop browser.", "Switch to the Tech View display.", HOVER(), "Open work order 1 on the phone."],
     res=[["Work order 1 opens."], ['Line 2 shows the chip "No Charge" in Tech View.', NOCAT], [TIP("Goodwill")],
          ['Line 2 shows the chip "No Charge" and $0.00 on the phone layout.', NOCAT]])
BY["S12-43"]["design_notes14"] = [N45]

_s, _r = BY["S12-46"]["steps"], BY["S12-46"]["res"]
setc("S12-46", "chip text \"No Charge\" (S12-R3 v1.4); the kept category is read in the tooltip after the reload (hover step)",
     steps=_s + [HOVER()],
     res=[['Line 2 shows the chip "No Charge".'], _r[1], ['Line 2 still shows the chip "No Charge" and $0.00.', NOCAT], [TIP("Goodwill")]])
addq("S12-46", "S12-R3")

_s, _r = BY["S2-100"]["steps"], BY["S2-100"]["res"]
setc("S2-100", "chip text \"No Charge\" (S12-R3 v1.4); the starting Comeback mark is read in the tooltip (hover step); the last result names the chip by its v1.4 text",
     steps=[_s[0], HOVER("line 1")] + _s[1:],
     res=[['Line 1 shows the chip "No Charge".', NOCAT], [TIP("Comeback")]] + _r[1:7]
         + [['Line 1 and line 2 are both billable and priced; line 1 shows no "No Charge" chip.']])
addq("S2-100", "S12-R3")

_r = BY["S2-35"]["res"]
setc("S2-35", "chip text: line 1's own chip is named by its v1.4 text \"No Charge\" (S12-R3 v1.4); the replaced category is still checked in the note",
     res=_r[:4] + [[_r[4][0], 'Line 1 no longer shows its own "No Charge" chip: every line is now No Charge under Goodwill.']] + _r[5:])
addq("S2-35", "S12-R3")

_s, _r = BY["S7-20"]["steps"], BY["S7-20"]["res"]
setc("S7-20", "chip text \"No Charge\" (S12-R3 v1.4); the kept category is read in the tooltip on the reopened work order (hover step)",
     steps=_s[:3] + [HOVER()] + _s[3:],
     res=_r[:2] + [['Line 2 still shows its "No Charge" chip on the reopened work order.', NOCAT], [TIP("Goodwill")]] + _r[3:])
addq("S7-20", "S12-R3")

# =============================================== the 54 drafts: D-113 and D-143 rewritten ============================================
setc("D-113", "the long-category stress moves from the chip to its tooltip (S12-R3 v1.4): each chip reads \"No Charge\" only; hovering shows "
     "\"Category: [name]\" in full and on screen; the columns stay visible; title; v14 pictures",
     title="Design: Long category names show in full in the No Charge chip's tooltip",
     steps=["Open work order 1.", HOVER("line 1"), HOVER("line 2"), "Resize the browser window to 1536 pixels wide."],
     res=[['Line 1 and line 2 each show the chip "No Charge" next to their titles.', NOCAT.replace("The chip shows", "Each chip shows"),
           "Each title and its chip stay inside the Name/Description cell; neither runs over Actual/Estimate.",
           "On both lines Actual/Estimate, Status, Rate ($0.00), Total ($0.00) and the three-dots menu are visible.", ST.EXACT],
          ["A tooltip reads \"Category: [category B's name]\" with the whole name: nothing is cut off and the tooltip stays inside the browser window."],
          ["A tooltip reads \"Category: [category C's name]\", inside the browser window.",
           "The category name shows exactly as you typed it: the characters " + ST.SPECIAL + " show as typed, not as \"&amp;\" or other codes."],
          ['Each chip still reads "No Charge" and stays inside the Name/Description cell; every column and the three-dots menus are visible.']])
BY["D-113"]["design_notes14"] = [N45]

_r = BY["D-143"]["res"]
assert _r[5][0] == 'Line 2 shows the chip "No Charge · Goodwill" and $0.00.'
setc("D-143", "chip text \"No Charge\" (S12-R3 v1.4) in step 6; the note's column move is about 12 pixels on the v14 pictures (was about 40); v14 pictures",
     res=_r[:5] + [['Line 2 shows the chip "No Charge" and $0.00.'] + _r[5][1:]] + _r[6:])
_dr = DR.DREFS["D-143"]
assert "about 40 pixels" in _dr["notes"][0]
_dr["notes"] = [_dr["notes"][0].replace("about 40 pixels", "about 12 pixels")]

# =============================================== stamps: PRD v1.4, design 1794565397-7f4c, the 11/14/2026 marker =====================
for k in TOUCHED + DRAFTS:
    c = BY[k]; c["prd"] = "1.4"; c["design"] = "v14"
    if c["marker"] == MARKER: c["marker"] = MARKER14
    for f in ("pre", "steps"):
        c[f] = [x if not any(o in x for o in DR.V14_PIC) else re.sub("|".join(map(re.escape, DR.V14_PIC)), lambda m: DR.V14_PIC[m.group(0)], x) for x in c[f]]
    if k in REQUOTE: _log(k, "quotes re-taken from PRD v1.4 (" + ", ".join(sorted({x for x in c["q"] if x in ("S12-E8", "S2-R22")})) + "); steps and results unchanged")
    if k in DESIGNREF: _log(k, "References from Design: design 1794565397-7f4c, the -v14 pictures of the changed boards and the board words \"No Charge\"; quotes re-read from PRD v1.4 (unchanged words)")
    if k in DRAFTS and k not in ("D-113", "D-143"): _log(k, "built on PRD v1.4 and design 1794565397-7f4c (From line, design line, marker); no other change")
import iwo_lib as _L
_L._DCACHE.clear()          # any block built before the flags were set is rebuilt with them
