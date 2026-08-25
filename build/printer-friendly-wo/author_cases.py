#!/usr/bin/env python3
"""Author the Printer Friendly Work Orders suite (epic SV-9383, PRD 519176194 v8).

Expected behaviour from the PRD (Rule 57). No design exists (Design: TBD on every
story) and no tech plan — appearance details are authored from the PRD text and will
be reconciled if a design arrives. Rule 85 (no QA env): every case carries the
"Not available on Build" AUTOMATION marker. Titles <= 80 (asserted). Run from repo
root, then gen_import.py.
"""
import json, os

ROOT = "build/printer-friendly-wo"
CASES = os.path.join(ROOT, "cases")
os.makedirs(CASES, exist_ok=True)

DESIGN = "No design exists yet (PRD marks Design: TBD on every story); authored from PRD text."
SPEC = "requirements.md (Printer Friendly Work Orders spec v8)"

def foot(story, snum, sname, anchors):
    return (
        "\n\n---\n"
        f"This is the expected behaviour as per epic SV-9383 and story {story} "
        f"(Story {snum}, {sname}) and the Printer Friendly Work Orders specification version 8, "
        f"section {anchors}, read on 25 August 2026."
        "\n\nAUTOMATION: Not available on Build to test Yet - Last checked 8/25/2026"
    )

def exp(lines, story, snum, sname, anchors):
    return "\n".join(f"{i+1}. {l}" for i, l in enumerate(lines)) + foot(story, snum, sname, anchors)

PRE_WO = "You are on the work order detail view and can view the work order."
PRE_LINES = "The work order has at least one line item."
PRE_PRINTED = "You have triggered Print Work Order from the work order detail view (print view rendered)."

def C(cid, area, title, pre, steps, expected, refs, story, snum, sname, anchors,
      priority="Medium", ctype="Functional", notes=""):
    assert len(title) <= 80, f"TITLE >80 ({len(title)}): {title}"
    return {
        "id": cid, "area": area, "title": title, "priority": priority, "type": ctype,
        "permissions_required": "View Work Order (no new permission introduced)",
        "preconditions": pre, "steps": steps,
        "expected": exp(expected, story, snum, sname, anchors),
        "design_ref": DESIGN, "spec_ref": SPEC, "refs": refs,
        "viu_status": "source-verified-only", "notes": notes,
    }

files = {}

# AREA 01 — Print option in More menu (Story 1, SV-9384)
A = "Printer Friendly Work Orders - Print Option in More Menu"
S, N, NM = "SV-9384", 1, "Print Option in More Menu"
files["cases-01-print-menu.json"] = [
 C("PFWO-MENU-01", A, "Print Work Order appears in the More menu",
   [PRE_WO],
   ["Open the More (overflow/actions) menu on the work order toolbar."],
   ["A “Print Work Order” option appears in the More menu."],
   "SV-9384 (S1-R1)", S, N, NM, "S1-R1"),
 C("PFWO-MENU-02", A, "Print menu item is labelled Print Work Order with no icon",
   [PRE_WO],
   ["Open the More menu and inspect the Print item."],
   ["The menu item displays the label “Print Work Order”.",
    "It is text only, with no icon, consistent with the other More menu items."],
   "SV-9384 (S1-R2)", S, N, NM, "S1-R2"),
 C("PFWO-MENU-03", A, "Print item sits below Timesheets and above Delete Work Order",
   [PRE_WO],
   ["Open the More menu and note the order of items."],
   ["The Print Work Order item is positioned below the Timesheets option and above the Delete Work Order option."],
   "SV-9384 (S1-R3)", S, N, NM, "S1-R3"),
 C("PFWO-MENU-04", A, "Selecting Print Work Order opens the browser print dialog",
   [PRE_WO, PRE_LINES],
   ["Select “Print Work Order” from the More menu."],
   ["The browser's native print dialog opens."],
   "SV-9384 (S1-R4)", S, N, NM, "S1-R4"),
 C("PFWO-MENU-05", A, "Print option is available on every work order status",
   [PRE_WO],
   ["Open work orders with each status: Estimate, Approved, In Progress, Review, Complete, Invoiced, Paid, Hold, Declined, Imported.",
    "Open the More menu on each."],
   ["The Print option is available on all of those statuses."],
   "SV-9384 (S1-R5)", S, N, NM, "S1-R5"),
 C("PFWO-MENU-06", A, "Print option is available on desktop and mobile",
   [PRE_WO],
   ["Open the More menu on a desktop view.",
    "Open the More menu on a mobile view."],
   ["The Print option is available on both desktop and mobile views."],
   "SV-9384 (S1-R6)", S, N, NM, "S1-R6"),
 C("PFWO-MENU-07", A, "Users without view permission cannot reach the print option",
   ["You do NOT have permission to view the target work order."],
   ["Attempt to open the work order detail page."],
   ["You cannot access the work order detail page and therefore cannot reach the print option (enforced by existing access control)."],
   "SV-9384 (S1-N1)", S, N, NM, "S1-N1"),
 C("PFWO-MENU-08", A, "Print is disabled until line item data has loaded",
   [PRE_WO],
   ["Open the work order and open the More menu while line item data is still loading (or when no line items exist).",
    "Observe the Print item as the UI skeleton appears and then as the real data arrives."],
   ["The Print option is disabled (grayed out and non-clickable) until line item data has finished loading, and while no line items exist.",
    "It does not enable when only the UI skeleton appears — it waits for the actual data to arrive."],
   "SV-9384 (S1-E1)", S, N, NM, "S1-E1"),
]

# AREA 02 — Print layout: header (Story 2, SV-9385)
A = "Printer Friendly Work Orders - Print Layout Header"
S, N, NM = "SV-9385", 2, "Print Layout - Work Order Header"
files["cases-02-header.json"] = [
 C("PFWO-HDR-01", A, "Work order number is shown prominently at the top",
   [PRE_PRINTED],
   ["Look at the top of the printed page."],
   ["The printed page displays the work order number prominently at the top."],
   "SV-9385 (S2-R1)", S, N, NM, "S2-R1"),
 C("PFWO-HDR-02", A, "Work order status is shown next to the work order number",
   [PRE_PRINTED],
   ["Look at the top of the printed page next to the work order number."],
   ["The work order status is displayed next to the work order number."],
   "SV-9385 (S2-R2)", S, N, NM, "S2-R2"),
 C("PFWO-HDR-03", A, "Header shows customer, vehicle, advisor, lead tech and start date",
   [PRE_PRINTED, "The work order has a customer, vehicle, service advisor, lead technician and start date set."],
   ["Read the header area of the printout."],
   ["The header displays: customer name (and company name if present); vehicle year, make, model, VIN, license plate, unit number (if present), mileage, engine hours (if present); service advisor name; lead technician name; and the work order start date."],
   "SV-9385 (S2-R3)", S, N, NM, "S2-R3"),
 C("PFWO-HDR-04", A, "Header omits fields that have no value rather than showing blanks",
   [PRE_PRINTED, "The work order is missing some optional fields (e.g. no engine hours, no license plate)."],
   ["Read the header area of the printout."],
   ["Fields that have no value are omitted from the printout rather than displayed as blank."],
   "SV-9385 (S2-R4)", S, N, NM, "S2-R4"),
 C("PFWO-HDR-05", A, "Header shows the shop or organization name",
   [PRE_PRINTED],
   ["Read the header area of the printout."],
   ["The shop name or organization name appears in the header area to identify the source of the printout."],
   "SV-9385 (S2-R5)", S, N, NM, "S2-R5"),
 C("PFWO-HDR-06", A, "No customer assigned prints an explicit placeholder",
   [PRE_PRINTED, "The work order has no customer assigned."],
   ["Read the customer section of the printout."],
   ["The customer section displays “No customer assigned”."],
   "SV-9385 (S2-N1)", S, N, NM, "S2-N1"),
 C("PFWO-HDR-07", A, "No vehicle assigned prints an explicit placeholder",
   [PRE_PRINTED, "The work order has no vehicle assigned."],
   ["Read the vehicle section of the printout."],
   ["The vehicle section displays “No vehicle assigned”."],
   "SV-9385 (S2-N2)", S, N, NM, "S2-N2"),
]

# AREA 03 — Print layout: line items (Story 3, SV-9386)
A = "Printer Friendly Work Orders - Print Layout Line Items"
S, N, NM = "SV-9386", 3, "Print Layout - Line Items"
files["cases-03-line-items.json"] = [
 C("PFWO-LINE-01", A, "Each line shows number, description, status, time, story and techs",
   [PRE_PRINTED, PRE_LINES],
   ["Read a line item on the printout."],
   ["Each line item displays: line number; line description (name); line status; actual time / estimated time; tech story (if one exists); and assigned technician(s) (if assigned)."],
   "SV-9386 (S3-R1)", S, N, NM, "S3-R1"),
 C("PFWO-LINE-02", A, "Parts under a line show description, part number and quantity",
   [PRE_PRINTED, "A line on the work order has parts."],
   ["Read the parts listed under a line on the printout."],
   ["Parts associated with each line are listed showing: part description, part number, and quantity."],
   "SV-9386 (S3-R2)", S, N, NM, "S3-R2"),
 C("PFWO-LINE-03", A, "Pricing is never shown on line items",
   [PRE_PRINTED, PRE_LINES],
   ["Inspect the line items and parts on the printout for any pricing."],
   ["No pricing is shown — no labor rates, margins, line totals, part sell prices, or part margins.",
    "The Rate, Margin, and Total columns are removed entirely."],
   "SV-9386 (S3-R3)", S, N, NM, "S3-R3"),
 C("PFWO-LINE-04", A, "Action and Progress columns are removed from the printout",
   [PRE_PRINTED, PRE_LINES],
   ["Inspect the line items on the printout."],
   ["The Action column (Approve, Decline, Complete buttons) and the Progress column (progress bars) are removed; the line status text column is present instead."],
   "SV-9386 (S3-R4)", S, N, NM, "S3-R4"),
 C("PFWO-LINE-05", A, "Lines print in the same order as on screen",
   [PRE_PRINTED, "The work order has multiple lines."],
   ["Compare the line order on the printout with the on-screen order."],
   ["Lines are printed in the same order they appear on screen (by line number)."],
   "SV-9386 (S3-R5)", S, N, NM, "S3-R5"),
 C("PFWO-LINE-06", A, "Cancelled lines still print if visible on screen",
   [PRE_PRINTED, "The work order has a line with a Cancelled status that is visible on screen."],
   ["Read the printout for the cancelled line."],
   ["Line items with a status of “Cancelled” still appear on the printout if they are visible on screen, with their status clearly indicated."],
   "SV-9386 (S3-R6)", S, N, NM, "S3-R6"),
 C("PFWO-LINE-07", A, "Line groups are separated by a thick border and note space",
   [PRE_PRINTED, "The work order has multiple lines."],
   ["Look at the separation between one line group and the next on the printout."],
   ["Each work order line group (main line plus its sub-rows for tech story, labor, parts, inspections) is visually separated from the next by a thick border and blank space below, giving room to write notes per line."],
   "SV-9386 (S3-R7)", S, N, NM, "S3-R7"),
 C("PFWO-LINE-08", A, "Empty tech story row is omitted with no placeholder",
   [PRE_PRINTED, "At least one line has no tech story."],
   ["Read a line that has no tech story on the printout."],
   ["The tech story row is omitted entirely — no placeholder text (for example “Add tech story for this line”) appears."],
   "SV-9386 (S3-R8; S3-N3)", S, N, NM, "S3-R8, S3-N3"),
 C("PFWO-LINE-09", A, "No line items prints an explicit placeholder",
   [PRE_PRINTED, "The work order has no line items."],
   ["Read the line items section of the printout."],
   ["The line items section displays “No lines on this work order”."],
   "SV-9386 (S3-N1)", S, N, NM, "S3-N1"),
 C("PFWO-LINE-10", A, "A line with no parts shows no parts section",
   [PRE_PRINTED, "At least one line has no parts."],
   ["Read a line that has no parts on the printout."],
   ["No parts section appears for a line that has no parts."],
   "SV-9386 (S3-N2)", S, N, NM, "S3-N2"),
 C("PFWO-LINE-11", A, "A line with no assigned technicians omits the technician area",
   [PRE_PRINTED, "At least one line has no assigned technicians."],
   ["Read a line with no assigned technicians on the printout."],
   ["The technician area is omitted for a line that has no assigned technicians."],
   "SV-9386 (S3-N4)", S, N, NM, "S3-N4"),
 C("PFWO-LINE-12", A, "Many lines flow across pages without splitting a line if avoidable",
   [PRE_PRINTED, "The work order has 10 or more lines."],
   ["Print and review the multi-page output."],
   ["The printout flows across multiple pages with line items continuing naturally.",
    "No line item is split mid-way across a page break if it can be avoided."],
   "SV-9386 (S3-E1)", S, N, NM, "S3-E1"),
 C("PFWO-LINE-13", A, "A very long tech story wraps and prints in full",
   [PRE_PRINTED, "A line has a tech story of 500+ characters."],
   ["Read the long tech story on the printout."],
   ["The tech story wraps and prints in full; it is not truncated."],
   "SV-9386 (S3-E2)", S, N, NM, "S3-E2"),
]

# AREA 04 — Print layout: summary & footer (Story 4, SV-9387)
A = "Printer Friendly Work Orders - Print Summary and Footer"
S, N, NM = "SV-9387", 4, "Print Layout - Summary and Footer"
files["cases-04-summary-footer.json"] = [
 C("PFWO-SUM-01", A, "Summary shows total actual and estimated time",
   [PRE_PRINTED, PRE_LINES],
   ["Read the summary section that appears after all line items."],
   ["A summary section appears after all line items, displaying total actual time / total estimated time across all lines."],
   "SV-9387 (S4-R1)", S, N, NM, "S4-R1"),
 C("PFWO-SUM-02", A, "Summary never shows pricing",
   [PRE_PRINTED, PRE_LINES],
   ["Inspect the summary section for any pricing."],
   ["No pricing is shown in the summary — no parts subtotal, labor subtotal, shop supplies, tax, or grand total. Only time totals are displayed."],
   "SV-9387 (S4-R2)", S, N, NM, "S4-R2"),
 C("PFWO-SUM-03", A, "Print timestamp appears at the bottom of the printout",
   [PRE_PRINTED],
   ["Look at the bottom of the printout."],
   ["The print timestamp (date and time of printing) appears at the bottom of the printout."],
   "SV-9387 (S4-R3)", S, N, NM, "S4-R3"),
 C("PFWO-SUM-04", A, "Work order number repeats in the footer of each page",
   [PRE_PRINTED, "The printout spans multiple pages."],
   ["Review the footer of each printed page."],
   ["The work order number repeats in the footer of each printed page for multi-page printouts."],
   "SV-9387 (S4-R4)", S, N, NM, "S4-R4"),
 C("PFWO-SUM-05", A, "With no line items the summary shows zero totals",
   [PRE_PRINTED, "The work order has no line items."],
   ["Read the summary section of the printout."],
   ["The summary shows zero totals rather than being hidden."],
   "SV-9387 (S4-N1)", S, N, NM, "S4-N1"),
]

# AREA 05 — Print formatting (Story 5, SV-9388)
A = "Printer Friendly Work Orders - Print Formatting"
S, N, NM = "SV-9388", 5, "Print Formatting - Screen Elements Hidden"
files["cases-05-formatting.json"] = [
 C("PFWO-FMT-01", A, "All interactive and navigation elements are hidden on the printout",
   [PRE_PRINTED],
   ["Inspect the printout for application chrome and interactive controls."],
   ["The following are hidden: application navigation (sidebar, top bar, breadcrumbs); all action buttons (Print, New Line, Reviewed, Send to Portal, etc.); tab navigation (Lines, Part Requests, Notes, Time Sheets, etc.); context menus and dropdown triggers; status change buttons and workflow actions on line items; clock in/out buttons; the Progress column and progress bars; the Action column; and any floating UI elements (tooltips, popovers, modals)."],
   "SV-9388 (S5-R1)", S, N, NM, "S5-R1"),
 C("PFWO-FMT-02", A, "Printout uses black text on white regardless of theme",
   [PRE_PRINTED, "Your app theme is set to dark mode."],
   ["Trigger print and review the rendered print view."],
   ["The printout uses black text on a white background regardless of the user's theme."],
   "SV-9388 (S5-R2)", S, N, NM, "S5-R2"),
 C("PFWO-FMT-03", A, "Text is sized for comfortable reading on paper",
   [PRE_PRINTED],
   ["Review the text size on the printout."],
   ["Text is sized for comfortable reading on paper (no smaller than a 10pt equivalent)."],
   "SV-9388 (S5-R3)", S, N, NM, "S5-R3"),
 C("PFWO-FMT-04", A, "Layout is optimized for portrait US Letter or A4",
   [PRE_PRINTED],
   ["Print with portrait orientation on US Letter or A4 paper and review the layout."],
   ["The layout is optimized for portrait orientation on US Letter or A4 paper."],
   "SV-9388 (S5-R4)", S, N, NM, "S5-R4"),
 C("PFWO-FMT-05", A, "Status badges print as plain text labels not colored chips",
   [PRE_PRINTED, PRE_LINES],
   ["Inspect the status badges on the printout."],
   ["Status badges print as plain text labels (not colored chips) to ensure readability on black-and-white printers."],
   "SV-9388 (S5-R5)", S, N, NM, "S5-R5"),
 C("PFWO-FMT-06", A, "Landscape orientation remains readable without clipping",
   [PRE_PRINTED],
   ["Manually select landscape orientation in the browser print dialog and review the layout."],
   ["The layout remains readable; content does not overflow or clip."],
   "SV-9388 (S5-E1)", S, N, NM, "S5-E1"),
]

# AREA 06 — Audit trail (Story 6, SV-9389)
A = "Printer Friendly Work Orders - Audit Trail"
S, N, NM = "SV-9389", 6, "Audit Trail"
files["cases-06-audit-trail.json"] = [
 C("PFWO-AUDIT-01", A, "Printing logs a Work Order Printed event in audit history",
   [PRE_WO, PRE_LINES],
   ["Select “Print Work Order”.",
    "Open the work order's audit history."],
   ["A “Work Order Printed” event is logged in the work order's audit history."],
   "SV-9389 (S6-R1)", S, N, NM, "S6-R1"),
 C("PFWO-AUDIT-02", A, "Audit entry records the user and the date and time",
   [PRE_WO, PRE_LINES],
   ["Print the work order and open the audit entry."],
   ["The audit log entry records the user who triggered the print and the date/time."],
   "SV-9389 (S6-R2)", S, N, NM, "S6-R2"),
 C("PFWO-AUDIT-03", A, "Print event is visible in the History tab like estimate and invoice prints",
   [PRE_WO, PRE_LINES],
   ["Print the work order and open the History tab."],
   ["The audit log entry is visible in the work order's History tab, consistent with how estimate and invoice print events are displayed today."],
   "SV-9389 (S6-R3)", S, N, NM, "S6-R3"),
 C("PFWO-AUDIT-04", A, "Cancelling the browser print dialog still logs the event",
   [PRE_WO, PRE_LINES],
   ["Select “Print Work Order”, then cancel the browser print dialog without printing.",
    "Open the audit history."],
   ["The “Work Order Printed” event is still logged (the system cannot detect whether the print completed from the browser dialog)."],
   "SV-9389 (S6-N1)", S, N, NM, "S6-N1"),
 C("PFWO-AUDIT-05", A, "Printing multiple times creates a separate entry each time",
   [PRE_WO, PRE_LINES],
   ["Print the same work order three times.",
    "Open the audit history."],
   ["Each print action creates a separate audit log entry."],
   "SV-9389 (S6-E1)", S, N, NM, "S6-E1"),
]

total = 0
for fname, cases in files.items():
    with open(os.path.join(CASES, fname), "w") as f:
        json.dump(cases, f, indent=2, ensure_ascii=False)
        f.write("\n")
    total += len(cases)
    print(f"{fname}: {len(cases)}")
print("TOTAL cases:", total)
