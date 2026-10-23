#!/usr/bin/env python3
"""Writes build/credit-terms/DESIGN-DIVERGENCE-REGISTER.json (Rule 130): every design-vs-PRD v3 difference found both ways on 23 Oct 2026.
- "differences": the hand comparison (every menu, dialog, tooltip, toast, empty state, label and look, design -> PRD and PRD -> design).
- the "<code>|<words>" keys: the rows spec_to_design_check.py reports (PRD words the design does not show), each with its outcome, in the
  shape that tool reads. QUESTION-READY (drafted, not sent) does not close a row: the QA lead sends the sheet.
python3 -I tools/make_register.py"""
import json, os
H = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(os.path.dirname(H), "DESIGN-DIVERGENCE-REGISTER.json")
DESIGN = "https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf (canvas \"Default Credit Terms\", version 1792722751-b285)"
PRD = "PRD v3, Confluence 963346440 (2026-10-22, Chris Ward)"
D = [
 dict(id="CT-D01", kind="wording", board="Main.dc.html (page 1) and every Credit Terms page board (pages 2, 3, 4)",
      picture="images/ct-p1-02-info-tooltip-due-on-receipt.png (the info icon's tooltip, drawn open); the same words are the icon's hover text on every page board",
      design_words="Payment is due on the invoice date, but you can create the invoice without taking payment.",
      prd_words="Payment is due on the invoice date. You can charge the invoice to the customer's account instead of taking payment.",
      prd_code="S1-R8; §8 row \"Hover the info icon on Due on Receipt\"",
      outcome="QUESTION-READY", question="NEW-QUESTIONS.py question 1 (drafted 23 Oct 2026, not sent: the QA lead sends it)",
      held_case="Design-version case planned: DV-01 (AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO)",
      note="The PRD case quotes S1-R8 and names this difference under References from Design. Not settled by 'latest wins': the canvas version id 1792722751 reads as 2026-10-23 02:32 UTC, later than PRD v3 (2026-10-22 17:25 UTC), if it is a time stamp; that is not certain."),
 dict(id="CT-D02", kind="look", board="Empty.dc.html (page 4), figure 3 \"A new shop: Inactive tab empty\"",
      picture="images/ct-p4-03-a-new-shop-inactive-tab-empty.png",
      design_words="The table keeps its column headings (Name, Due, Customers, Vendors) and shows \"No inactive terms\" as one centred row under them; caption: \"With nothing inactive the table shows one line: \"No inactive terms\".\" / \"Source: DS table empty state.\" / \"No build shot: drawn from the rule, not checked against the build.\"",
      prd_words="If the Inactive tab has no terms, it shows the line \"No inactive terms\" in place of the table, and its count reads 0.",
      prd_code="S1-N2; §8 row \"Inactive tab is empty\" (\"Inline line in place of the table\")",
      outcome="QUESTION-READY", question="NEW-QUESTIONS.py question 2 (not sent)",
      held_case="Design-version case planned: DV-02 (held)",
      note="Words match; only whether the column headings stay is different. The PRD case checks the line and the 0 count and names this difference."),
 dict(id="CT-D03", kind="behaviour", board="NewTerm.dc.html (page 3), figure 3 \"Validation errors\" (caption)",
      picture="images/ct-p3-03-validation-errors.png",
      design_words="No sentence shows while a field is invalid.",
      prd_words="While the chosen box holds a valid number, a blue information line below the options explains the term ... The line updates as the user types and disappears while the number is invalid. (With the Name empty, \"{Name}\" reads \"This term\".)",
      prd_code="S3-R5",
      outcome="QUESTION-READY", question="NEW-QUESTIONS.py question 3 (not sent)",
      held_case="Design-version case planned: DV-03 (held): Name invalid (e.g. a standard term's name) with a valid number shows no blue line",
      note="The picture itself cannot decide it: both the Name and the Days box are invalid in it. Under the PRD the line depends on the number only."),
 dict(id="CT-D04", kind="behaviour", board="NewTerm.dc.html (page 3), figure 3 \"Validation errors\" (caption)",
      picture="images/ct-p3-03-validation-errors.png",
      design_words="Errors show only after a field is touched or Create is pressed; the Name field is never red when the window opens.",
      prd_words="The Name is checked only once the user has typed in it (then each time they leave the field) or presses Create / Save. Opening the window, or clicking an option or a box before typing a name, never shows a Name error.",
      prd_code="S3-R10 (and S3-R11: the chosen box re-checks on every change)",
      outcome="QUESTION-READY", question="NEW-QUESTIONS.py question 4 (not sent)",
      held_case="Design-version case planned: DV-04 (held): click into Name, type nothing, click away: \"Enter a name.\" shows",
      note="\"touched\" can mean clicked in and out without typing; under the PRD that never shows the Name error."),
 dict(id="CT-D05", kind="look", board="Main.dc.html … Invoice.dc.html: every \"This design\" figure against every \"Build (local …)\" capture",
      picture="images/ct-p1-01-active-tab-one-table.png against files/project/shots/r16-m-standard.png; images/ct-p2-02-move-customers-from-cod.png against shots/r15-move-cod.png; images/ct-p1-09-make-net-30-the-default.png against shots/r15-delete.png",
      design_words="Drawn boards: Inter font; table headings small grey (12 px, weight 600, grey #697586); Cancel a white button with a grey border; dialog close × grey; Move To a notched outlined select with a chevron; ticked boxes a light blue tint with a blue tick; tooltips grey (#616161 at 92%) with regular text. Build captures on the same boards: another font; table headings bold black; Cancel a grey filled button; × blue; Move To a filled select with a solid caret; ticked boxes solid blue with a white tick.",
      prd_words="(The PRD does not describe these looks. Every board caption says \"layout, wording and states match the build\".)",
      prd_code="none (look only, Rule 126: the design is the source of the look where the PRD is silent)",
      outcome="QUESTION-READY", question="NEW-QUESTIONS.py question 5 (not sent)",
      held_case="none: the look cases name both pictures until the answer; nothing about behaviour differs",
      note="Design-internal difference (two kinds of picture in one design). The design library itself (components.css) says checked boxes use a tinted fill, not solid, and that tabs are pills with counts in brackets; the boards' tabs follow production's Inspection Templates tabs instead (caption of page 1 figure 1)."),
 dict(id="CT-D06", kind="look", board="OverCredit.dc.html (page 8), figure 3 \"Still warns: limit above $0 exceeded\"",
      picture="images/ct-p8-03-still-warns-limit-above-0-exceeded.png against files/project/shots/before-over-credit.png",
      design_words="Confirmation drawn with a red Create and a white, grey-bordered Cancel; caption: \"The dialog itself does not change.\" / \"Create keeps its red (destructive) style.\"",
      prd_words="the existing confirmation shows unchanged: title \"Confirmation\", message \"Are you sure you want to open a new work order? This customer is over their credit limit.\", buttons \"Create\" and \"Cancel\". / Wording and buttons are unchanged.",
      prd_code="S9-R1, S9-R3",
      outcome="SETTLED-BY-PRD", question="none (skill 07 §6: the PRD and the design's own caption both say the dialog is unchanged)",
      held_case="none",
      note="Today's dialog (before-over-credit.png) has a blue filled Cancel. The design case compares the dialog with the production picture, not with the redraw."),
 dict(id="CT-D07", kind="wording (letter case)", board="Invoice.dc.html (page 9), figure 1; OverCredit.dc.html figure 3 caption",
      picture="files/project/shots/before-invoice.png (badge beside Invoiced)",
      design_words="Over Limit (today's badge, capital L, on the production picture); the caption writes \"Over limit\"",
      prd_words="The \"Over limit\" badge on work orders and part sales follows the same rule as S9-R1. / the existing confirmation and \"Over limit\" badge keep their existing mobile variants and only change when they appear.",
      prd_code="S9-R2, S9 Form factor, S9-R3, S11-R8",
      outcome="SETTLED-BY-PRD", question="none: dropped under skill 07 §6 (the PRD says the badge is the existing one, wording unchanged)",
      held_case="none", note="L-04 letter-case check: the cases name the badge as the screen shows it today (\"Over Limit\") and quote the PRD verbatim; no new badge is drawn by the design (NOT SHOWN, see CT-N10)."),
 dict(id="CT-D08", kind="wording (caption out of date)", board="Main.dc.html (page 1), figure 16 \"Credit Terms Log: could not load\"",
      picture="files/project/shots/r15-log-error.png",
      design_words="Caption: \"Differs from the PRD: the build also repeats that sentence inside the table; the PRD says the table shows no rows and no empty-state line.\" The picture shows the sentence in the table and in a red alert.",
      prd_words="If the log cannot be loaded, the app's standard error alert shows \"Something went wrong loading the Credit Terms Log. Please try again.\", the table shows no rows and the same sentence in place of the \"No history here. Yet.\" line, and the Credit Terms page is unaffected.",
      prd_code="S12 Error Handling; §8 row \"Credit Terms Log fails to load\"",
      outcome="SETTLED-BY-PRD", question="none (picture and PRD v3 agree; only the caption is older than PRD v3)",
      held_case="none", note="The design case compares with the picture and quotes PRD v3."),
 dict(id="CT-D09", kind="look (demo data)", board="OverCredit.dc.html (page 8), figure 3; Inactive.dc.html (page 6), figures 2 and 4-6",
      picture="images/ct-p8-03-still-warns-limit-above-0-exceeded.png; images/ct-p6-04-edit-customer-keeps-the-inactive-term.png",
      design_words="\"Still warns: limit above $0 exceeded\" draws the customer card with Credit limit \"$0.00\"; page 6 draws the card with \"$0.00\" while the Edit Customer window for the same customer shows \"$ 5,000.00\".",
      prd_words="The warning and the badge never show when the customer's credit limit is $0 or blank.",
      prd_code="S9-N1 (and S9-R1)",
      outcome="SETTLED-BY-PRD", question="none (demo data; the board heading and caption state a limit above $0)",
      held_case="none", note="Design cases must not ask the tester to compare the card's credit limit on these pictures."),
 dict(id="CT-D10", kind="look (drawing cut off)", board="Inactive.dc.html (page 6), figure 5 \"This customer's picker\"",
      picture="images/ct-p6-05-this-customer-s-picker.png",
      design_words="Caption: \"The active terms, then this customer's own \"Net 10 (Inactive)\" at the end, selected.\" The drawn list is cut off at the top of the frame and stops at Net 90; the \"Net 10 (Inactive)\" row is not visible.",
      prd_words="On Edit Customer, a customer whose term was deactivated shows it as \"{name} (Inactive)\" in the dropdown, selected, listed after the active terms.",
      prd_code="S5-R7",
      outcome="DESIGN-SILENT", question="none: the words agree; the vendor board draws the same row (images/ct-p7-07-edit-vendor-keeps-the-inactive-term.png)",
      held_case="none", note="The customer design case uses the caption's words and the vendor picture's look for the last row."),
]
NOT_SHOWN = [  # PRD -> design: states the PRD requires that no board draws
 ("CT-N01", "S1 Error Handling", "Something went wrong loading credit terms. Please try again.", "PRD §2 Design coverage lists \"the list load error\" among states with no board"),
 ("CT-N02", "S2-R7, S2-R8, S2-R9, S3-R8", "{name} deactivated / {name} reactivated / {name} deleted / {name} saved (toasts)", "PRD §2 Design coverage lists \"toasts\"; the toast look is drawn twice (p1 fig 10, p2 fig 5) and once in a build capture (r15-long-name.png)"),
 ("CT-N03", "S2 / S3 / S4 / S5 Error Handling", "standard error alerts (server refusals)", "PRD §2 lists \"error alerts\"; one error alert is drawn (r15-log-error.png)"),
 ("CT-N04", "S4-R5", "No customers match your search.", "PRD §2 lists \"Move Customers search with no match\""),
 ("CT-N05", "S1-R6", "a sorted column (header click)", "No board draws a sorted table or a sort arrow; S1-R6 says it follows \"the app-wide sorting rule\""),
 ("CT-N06", "S1-E3", "loading state (no \"No inactive terms\" while loading)", "No board draws loading; behaviour only"),
 ("CT-N07", "S4-R7", "Move To starts empty when moving from the default", "No board draws it (p2 moves from COD while Due on Receipt is the default; r15-move-cod moves from Net 7)"),
 ("CT-N08", "S4-R8, S4-R21, S2-R11, S3-R14", "disabled confirm buttons (nothing ticked / saving)", "Only the New Credit Term disabled button is drawn (p3 fig 3); the Move button behind the $0 confirmation shows a spinner in r15-limit-confirm.png"),
 ("CT-N09", "S1-R15, S4-R23, S5-R14, S6-R6, S12-R8", "long names wrapping (table at narrow width, Move window, dropdowns, cards, log)", "Only the 31-character name at 1440 px on one line and its wrapped toast are drawn (r15-long-name.png)"),
 ("CT-N10", "S9-R2", "\"Over limit\" badge under the new rule", "Not drawn; today's badge \"Over Limit\" shows on before-invoice.png; S9 Form factor: the existing badge only changes when it appears"),
 ("CT-N11", "S5-N3, S5-R3", "Credit Hold in the customer dropdown without the Default tag", "The customer pickers are drawn only down to Net 60 / Net 90; Credit Hold is drawn last in the vendor picker (p7 fig 7)"),
 ("CT-N12", "S2-R1", "Inactive tab menu of a term the shop created (Reactivate, Move Customers, divider, Delete Credit Term)", "Only a standard inactive term's menu is drawn (r16-m-inactive.png)"),
 ("CT-N13", "S5 Form factor, S5-R11", "phone width; long term names on printed invoices", "PRD §2 lists \"phone width\" and \"long term names on printed invoices\""),
 ("CT-N14", "S5-E2, S7-N1, S11-E2", "an unknown-text term in Edit Customer; odd spellings (\"NET 30\")", "PRD §2 lists \"an unknown-text term\""),
 ("CT-N15", "S12-R5", "Credit Terms Log search with typed text", "Only the empty search box is drawn"),
]
TOOL = {  # spec_to_design_check.py rows (run on 23 Oct 2026 against the 9 boards + the screenshots' transcribed words)
 "S1-R12|NET 30": ("DESIGN-SILENT", "An odd stored spelling: no board draws one (PRD §2: unknown-text terms follow the PRD text)."),
 "S11-E2|NET 30": ("DESIGN-SILENT", "As S1-R12."),
 "S1-N3|⋯\" menu, because \"": None,
 "S2-R2|Used by 12 customers, 3 vendors and 40 invoices": ("DESIGN-SILENT", "The holders sentence is drawn only for customers and vendors (\"Used by 1 customer and 2 vendors\", r16-m-inuse.png); no board draws an invoice holder."),
 "S2-R2|Used by 5 invoices": ("DESIGN-SILENT", "As above: no invoice-only holder drawn."),
 "S2-N5|Used by ...": ("SHOWN-WHEN-DRIVEN", "Drawn as \"Used by 1 customer and 2 vendors\" on r16-m-inuse.png (checked by hand)."),
 "S2-E3|Net 30 (Inactive)": ("SHOWN-WHEN-DRIVEN", "The same pattern is drawn as \"Net 10 (Inactive)\" on the customer card, Edit Customer, vendor card and Edit Vendor (pages 6 and 7)."),
 "S4-R2|Move 1 Customer": ("DESIGN-SILENT", "Only plural counts are drawn (214, 180, 14)."),
 "S4-R5|No customers match your search.": ("DESIGN-SILENT", "PRD §2 Design coverage: \"Move Customers search with no match\" has no board."),
 "S4-R9|1 customer moved to {term}.": ("DESIGN-SILENT", "Only the plural toast is drawn (\"214 customers moved to Due on Receipt.\")."),
 "S4-R14|Set 1 customer's credit limit to $0?": ("DESIGN-SILENT", "Only the plural title is drawn (\"Set 14 customers' credit limit to $0?\", r15-limit-confirm.png)."),
 "S4-R16|Set Limits to $0 and Move": ("PO-RULED", "PRD v3 S4-R14 (Chris Ward, 22 Oct 2026) itself gives the display form \"Set Limits To $0 And Move\", which the design shows (r15-limit-confirm.png)."),
 "S4-R21|Set Limits to $0 and Move": ("PO-RULED", "As S4-R16."),
 "S10-R3|net 10": ("DESIGN-SILENT", "Imports and the Public API: Story 10 has no canvas page."),
 "S10-R3|NET10": ("DESIGN-SILENT", "As above."),
 "S11-R6|Customer name is a required field": ("DESIGN-SILENT", "The old early error the PRD removes; no board draws a Name error on New/Edit Customer."),
 "S11-R7|Name is a required field": ("DESIGN-SILENT", "As above for New/Edit Vendor."),
}
ARTEFACT = "SHOWN-WHEN-DRIVEN"
ARTEFACT_NOTE = "Not PRD words: the checker took the text BETWEEN two quoted items of the requirement. The quoted items themselves are shown on the boards (checked by hand: \"⋯\", \"Move Customers\", \"New Credit Term\", \"Audit Log\", \"Cancel\", \"Set Limits To $0 And Move\")."
reg = dict(project="Credit terms (epic SV-11638)", design=DESIGN, prd=PRD, made="2026-10-23",
           how="Both ways (Rule 130): spec_to_design_check.py (PRD words the design does not show) plus every menu, dialog, tooltip, toast, empty state, label (letter case, L-04) and look compared by hand, design -> PRD and PRD -> design. Outcomes: QUESTION-READY (drafted, not sent: does not close a row) · SETTLED-BY-PRD (a named PRD v3 sentence decides it; no question) · PO-RULED · DESIGN-SILENT (no board draws that state).",
           unsent_questions=[d["id"] for d in D if d["outcome"] == "QUESTION-READY"],
           differences=D,
           not_shown=[dict(id=i, prd_code=c, prd_words=w, outcome="DESIGN-SILENT", where=n) for i, c, w, n in NOT_SHOWN])
raw = json.load(open(os.path.join(H, "render", "spec-check-raw.json")))
for r in raw:
    v = TOOL.get(r["key"])
    if v is None:
        reg[r["key"]] = dict(outcome=ARTEFACT, where=ARTEFACT_NOTE, cases=[])
    else:
        reg[r["key"]] = dict(outcome=v[0], where=v[1], cases=[])
json.dump(reg, open(OUT, "w"), indent=1, ensure_ascii=False)
print("written", OUT, "differences", len(D), "not shown", len(NOT_SHOWN), "tool rows", len(raw), "unsent", reg["unsent_questions"])
