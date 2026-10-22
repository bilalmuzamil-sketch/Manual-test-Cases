"""DESIGN-DIVERGENCE-REGISTER.json (Rule 130): every design-vs-PRD difference, both ways, with its outcome; the keys
"<code>|<words>" are the rows build/testing-tools/spec_to_design_check.py reads (outcomes QUESTION-SENT, PO-RULED, QA-LEAD-RULED,
DESIGN-SILENT, SHOWN-WHEN-DRIVEN close a row; QUESTION-READY does not, so the tool exits 1 until the drafted questions are sent).
Written by render_outputs.py from design_data.py."""
import design_data as DD

SHEET = "https://docs.google.com/spreadsheets/d/11_3z_TpKkOL-MiAWqxrj1jlHP1rn9QXu_h3uCR0SjVA"
NOTSENT = "drafted 22 Oct 2026 in design-2026-10-22/NEW-QUESTIONS.py, not yet sent (the QA lead adds it to the sheet: Rule 131)"
SILENT_WHERE = "all 7 boards and 45 figures checked, 22 Oct 2026 (design-2026-10-22/TRANSCRIPTS.md); the PRD stands alone"

# spec_to_design_check.py rows (PRD quoted words the design's files and the after-pictures' words do not contain), each closed
TOOL_ROWS = {
 "S1-R2|A-1 Towing": ("DESIGN-SILENT", "a PRD example name; the design's pictures use other names (\"10 Trucking\" before \"2 Trucking\" is drawn, I03). " + SILENT_WHERE),
 "S1-R2|a1 towing": ("DESIGN-SILENT", "a PRD example name, not drawn. " + SILENT_WHERE),
 "S1-R3|Émile's": ("SHOWN-WHEN-DRIVEN", "drawn as \"Émile's Test Fleet\" among the E names on A/R Summary sorted by Location (I36, images/e15cddb093bbdcadbc7736034b730d06.png)"),
 "S3-R1|Export report": ("DESIGN-SILENT", "the ⋯ button's label is not visible on any picture (I09 shows the open menu, I10 the button). " + SILENT_WHERE),
 "S3-R4|As of Oct 15, 2026": ("DESIGN-SILENT", "no PDF is pictured. " + SILENT_WHERE),
 "S3-R4|As of: Oct 15, 2026": ("DESIGN-SILENT", "no CSV is pictured. " + SILENT_WHERE),
 "S3-R5|Locations: All locations": ("DESIGN-SILENT", "no export file is pictured. " + SILENT_WHERE),
 "S3-R5|Locations: ": ("DESIGN-SILENT", "no export file is pictured. " + SILENT_WHERE),
 "S3-R5|Past due: 31-60 days, 91+ days": ("DESIGN-SILENT", "no export file is pictured. " + SILENT_WHERE),
 "S3-R5|Customers: ": ("DESIGN-SILENT", "no export file is pictured. " + SILENT_WHERE),
 "S3-R5|Vendors: ": ("DESIGN-SILENT", "no export file is pictured. " + SILENT_WHERE),
 "S3-R10|Success": ("DESIGN-SILENT", "the Success message is not pictured. " + SILENT_WHERE),
 "S3-R10|Data exported successfully.": ("DESIGN-SILENT", "the Success message is not pictured. " + SILENT_WHERE),
 "S3-R10|Empty export": ("DESIGN-SILENT", "the Empty export warning is not pictured. " + SILENT_WHERE),
 "S3-R10|Export didn't yield any results": ("DESIGN-SILENT", "the Empty export warning is not pictured. " + SILENT_WHERE),
 "S3-N2|This report is too large to export. Choose an earlier as-of date, then try again.": ("DESIGN-SILENT", "only the PDF refusal is pictured (I11); the CSV limit is named in the caption (\"CSV limit 50,000 rows.\"). " + SILENT_WHERE),
 "S5-R1|As of: 10/15/2026": ("SHOWN-WHEN-DRIVEN", "drawn as \"As of: 10/19/2026\" and \"As of: 09/30/2026\": the same format with another date (I03, I37)"),
 "S5-R2|Search locations": ("DESIGN-SILENT", "the Location menu is pictured with two locations only, so no search box (I33, I34). " + SILENT_WHERE),
 "S5-R6|Location: N locations": ("DESIGN-SILENT", "pictured: \"Location: All locations\", one name and \"Location: No locations\" only. " + SILENT_WHERE),
 "S5-R6a|Empty export": ("DESIGN-SILENT", "the Empty export warning is not pictured. " + SILENT_WHERE),
 "S5-R6a|Export didn't yield any results": ("DESIGN-SILENT", "the Empty export warning is not pictured. " + SILENT_WHERE),
 "S5-R13|Search vendors": ("QUESTION-READY", "DD-02: the design shows \"Search vendor\" (I40). Question 12, " + NOTSENT + ". Held design version D-77."),
 "S5-R13|All customers are included. Pick one or more to narrow.": ("DESIGN-SILENT", "the Customer menu is pictured with two customers ticked, where the line is hidden (I41); the Vendor and Past due lines are drawn (I40, I38). " + SILENT_WHERE),
 "S5-R13|Customer: N customers": ("SHOWN-WHEN-DRIVEN", "drawn as \"Customer: 2 customers\" (I41)"),
 "S5-R13|Vendor: N vendors": ("DESIGN-SILENT", "not pictured. " + SILENT_WHERE),
 "S5-R15|Past due: 91+ days": ("DESIGN-SILENT", "pictured: \"Past due: Any\" and \"Past due: 2 ranges\" only. " + SILENT_WHERE),
 "S5-R15|Past due: N ranges": ("SHOWN-WHEN-DRIVEN", "drawn as \"Past due: 2 ranges\" (I39)"),
 "S5-R15|Past due: 4 ranges": ("DESIGN-SILENT", "not pictured. " + SILENT_WHERE),
 "S6-R1|Location full name": ("PO-RULED", "CASE-DIFFERS: today's screen writes \"Location Full Name\" (I12, I26, I31). PRD v5 S6-R1 renames the column \"Location\", so the old label leaves the screen; S6-01 names today's spelling. Ruling: the PRD's own rename (no question needed)."),
 "S8-R6|Something went wrong loading this report. Please try again.": ("DESIGN-SILENT", "the load-error state is not pictured. " + SILENT_WHERE),
}

# by hand (skill 21 §6c step 2, L-02): every dialog, menu, message and empty state the design draws, rows and buttons in order, beside the PRD
BY_HAND = [
 dict(what="Export menu (I09)", design=["Download (PDF)", "Download (CSV)"], prd='S3-R1: "Download (PDF)" and "Download (CSV)" (the ⋯ button "labelled "Export report"")', verdict="same rows and order; the label \"Export report\" is not visible (DESIGN-SILENT)"),
 dict(what="PDF-too-large message (I11)", design=["This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.", "Close"], prd='S3-N1 message; User Feedback Summary "Error toast, as on the other reports"', verdict="same words; one message; red error toast with Close"),
 dict(what="Switch location dialog (I29)", design=["Switch location?", "This work order is in Staging Lethbridge - 4310. Switch your active location to view it?", "Cancel", "Switch Location", "× (top right)"],
      prd='S7-R3: title "Switch location?", message "This work order is in {location}. Switch your active location to view it?", buttons "Switch location" and "Cancel"', verdict="DIFFERENT: button letter case, button order, extra × (DD-01, question 11)"),
 dict(what="Location menu, two locations (I33)", design=["Select all · 2 selected", "Staging Heavy Duty - 9919 (ticked)", "Staging Lethbridge - 4310 (ticked)", "—", "Clear selection"],
      prd='S5-R2: "Select all", "{N} selected", the locations with the ticked ones first, "Search locations" over 8 locations, "Clear selection"', verdict="same rows and order; the chip shows a circled × while open (native)"),
 dict(what="Location menu, one ticked (I34)", design=["Select all (unticked) · 1 selected", "Staging Heavy Duty - 9919 (unticked)", "Staging Lethbridge - 4310 (ticked)", "—", "Clear selection"],
      prd='S5-R2 "the locations with the ticked ones first"', verdict="no conflict: the menu is still open after the untick; checked on reopening (DR-02)"),
 dict(what="Past due menu (I38)", design=["Any (ticked)", "—", "All ranges are included. Pick one or more to narrow.", "1-30 days", "31-60 days", "61-90 days", "91+ days"],
      prd='S5-R15: "Any" row, the native line, then "1-30 days", "31-60 days", "61-90 days", "91+ days"', verdict="same rows and order; range boxes drawn with a dash (look, D-71)"),
 dict(what="Vendor menu (I40)", design=["Search vendor (search box)", "All vendors (ticked)", "—", "All vendors are included. Pick one or more to narrow.", "vendors (not A to Z)"],
      prd='S5-R13: search box ("Search vendors"), "All vendors" row, the native line, the list', verdict="DIFFERENT placeholder (DD-02, question 12); rows and order the same"),
 dict(what="Customer menu, two ticked (I41)", design=["search box with tags 10 Trucking ×, 4 Star Truck Repair × and a clear ×", "All customers (unticked) · 2 selected", "—", "customers A to Z (two ticked)"],
      prd='S5-R13: search box, "All customers" row, the native line while none is ticked, the list', verdict="no conflict: the line is hidden because two are ticked; tags and count are the native extras (DR-04)"),
 dict(what="Empty state, No locations (I35)", design=["Totals $0.00 $0.00", "No record matches these filters", "Try changing filters to widen your results.", "Clear all filters"],
      prd='S5-R6a "no totals and no Location column"; S8-R5 messages and "Clear all filters"', verdict="DIFFERENT: an extra Totals row (DD-03, question 13); words and button the same"),
 dict(what="Description tooltip (I20, I22)", design=["Overdue invoices, unused credit memos and deposits for each customer to help you follow up on payments. Excludes invoices that aren’t due yet."],
      prd='S8-R1 A/R Collection description', verdict="same words; opens below the icon (look, D-60)"),
 dict(what="Collapse all / Expand all tooltip", design=["not drawn (the chevron is: I05 right, I14 down)"], prd='S4-R1 tooltip above the button', verdict="DESIGN-SILENT for the tooltip"),
]

def build():
    reg = {"project": "A/R and A/P Report Sorting, Export and Location Filter", "design": DD.URL, "design_read": True,
           "read": "22 Oct 2026: 7 boards, 45 figures, 43 screenshots viewed (design-2026-10-22/DESIGN-READING-RECORD.md)",
           "note": ("Both directions checked (Rule 130): design to cases (DESIGN-TEXT-INVENTORY, DESIGN-VISUAL-INVENTORY) and PRD to design "
                    "(spec_to_design_check.py on the boards plus the after-pictures' words, AFTER-SCREEN-WORDS.txt, and the by-hand list below). "
                    "Questions 11 to 15 are drafted, not sent: they close their rows once the QA lead adds them to Chris Ward's sheet " + SHEET + " (Rule 131)."),
           "differences": [], "closed_by_ruling": [], "design_silent": [], "by_hand": BY_HAND}
    for d in DD.DIFFS:
        sent = d["q"] == 4
        reg["differences"].append(dict(id=d["id"], kind=d["kind"], prd=d["prd"], design=d["design"], pictures=[DD.pic(DD.FIG_BY_IID[i]) for i in d["figs"]],
                                       outcome="QUESTION-SENT" if sent else "QUESTION-READY",
                                       where=(f"question 4 on {SHEET} (row 9), sent 22 Oct 2026" if sent else f"question {d['q']}, {NOTSENT}"),
                                       held_case=d["held"]))
    for d in DD.RULED:
        reg["closed_by_ruling"].append(dict(id=d["id"], design=d["design"], outcome="PO-RULED", where=d["ruling"], pictures=[DD.pic(DD.FIG_BY_IID[i]) for i in d["figs"]]))
    for c, w in DD.SILENT:
        reg["design_silent"].append(dict(code=c, what=w, outcome="DESIGN-SILENT", where=SILENT_WHERE))
    for k, (o, w) in TOOL_ROWS.items():
        reg[k] = {"outcome": o, "where": w}
    return reg
