"""Demo Day cases of 13 Nov 2026 (QA lead: write the missing cases now, before the 19 Nov 2026 release, as a list to see first).

Why: on 13 Nov 2026 Chris Ward (product owner) posted after Demo Day (Slack thread C0C454MLP0T/1794593840.375719, saved in
sources/SLACK-C0C454MLP0T-demo-day-2026-11-13.md); three bugs were filed: SV-12722 (a long no-space customer name overlaps the next row of
the Customer menu), SV-12763 (the four grouped reports' columns move when groups open or close, and while more lines load) and SV-12764
(on A/R Collection a long no-space name pushes Past Due and Amount off screen while the groups are collapsed). None of our 380 cases caught
them: our long names always had spaces and no case compared two states of the same screen (lessons register L-21; skill 21 §6d lines 9, 10).

Written in the tester's words (Rule 117 fourteenth and fifteenth amendments), one action per step (135), split per Rule 136, every
precondition used or explained (137). Quotes: PRD version 13 (live page, read 13 Nov 2026; the rest of the library stays on version 11
until the QA lead decides a currency pass) and Chris Ward's Slack post, both word for word (Rule 113). Expect-fail blocks follow Rule 61
(open ticket, observed symptom, three outcomes). DRAFT: nothing here is in TestRail yet (demo-day-2026-11-13/NEW-CASES.md)."""
from ar_lib import C, CASES, MARKER, prd13, V13
import v11_layout as V11
from cases_v11 import OPEN

NEW = {}
PIC1 = ("Slack, Chris Ward, Picture #1", "Picture #1 — the long customer name wrap issue (shows up in the filter)")
PIC23 = ("Slack, Chris Ward, Picture #2 + #3", "Picture #2 + #3 — for the reports with chevrons, the tables jump around when they "
         "expand/collapse. would be great if they wouldn’t (though unsure how possible).")
REUSE = ("Key Decisions, reuse rule" + V13, "The reuse rule. Every control on these reports reuses an existing ShopView pattern: the native "
         "filter chips, the native totals row and pinned headline column of the newer reports, the existing location-switch prompt, the "
         "design system's chevron icon. Nothing new is drawn. Basis: d-reuse-existing-pattern.")
HOLD_SCROLL = "AUTOMATION: HOLD - waiting on the PO (columns moving while more lines load)"
MARKER_NEW = "AUTOMATION: Not available on Build to test Yet - Last checked 11/13/2026"

def ef(ticket, symptom):
    """Rule 61: the observed symptom and the three outcomes, in the shape of the suite's 4 Nov 2026 expect-fail blocks."""
    return (f"<p>What you should see today: {symptom} This is a known problem and it is already reported — see "
            f"https://shopview.atlassian.net/browse/{ticket} (filed 13 Nov 2026, after Demo Day).</p>"
            "<p>· If you see exactly that, mark this test FAILED and do not raise anything new.</p>"
            "<p>· If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please report it.</p>"
            "<p>· If it PASSES, the fix has shipped: report it so the ticket can be closed and this note removed.</p>")

def D(key, title, pre, steps, res, q, reports, stories, refs, figs, why, ex=None, marker=None, ef_html=None, note="", words=()):
    """Mirrors cases_v11.N(): pre = the tester's bullets; res = one list of bullets per step; the case model gets the same words."""
    assert len(res) == len(steps), key
    ex = ex or {}
    C(key, "DESIGN", title, [(p, ex.get(i)) for i, p in enumerate(pre)], list(steps),
      [f"Step {i}: " + " ".join(r) for i, r in enumerate(res, 1)], q, reports=reports, stories=stories, note=note,
      marker=marker or MARKER_NEW, design=dict(figs=list(figs), why=why, words=list(words)))
    c = CASES[-1]
    c["new_v11"] = True                     # cites the design as read 10 Nov 2026 (version of 5 Nov 2026)
    c["refs"] = refs
    c["no_old_attachment"] = True         # created after 10 Nov 2026: only the re-shot picture is attached
    if ef_html: c["ef_html"] = ef_html
    assert len(refs) < 250, key
    V11.LAYOUT[key] = dict(title=title, pre=list(pre), steps=list(steps), results=[list(r) for r in res])
    NEW[key] = title

ADMIN = 'Sign in as an Admin user (the "Admin" role).'
W1440 = "Use a desktop browser window 1440 px wide, at 100% zoom."
LONG = "whose name is 120 letters long with no spaces"
SPECIAL = "whose name is more than 60 characters long and includes each of these characters: & \" ' < >"
EITHER = "(wrapped inside the row or shortened with \"...\"; either is a pass)"
COLS = {"ARS": '"Total"', "APS": '"Total"', "ARD": '"Date" to "Open Balance"', "APD": '"Date" to "Open Balance"',
        "ARC": '"Date" to "Open Balance"', "APU": '"Date" to "Open Balance"'}
SCREENSHOT = "Take a screenshot of the page, showing the column headings."
SAME = "Every column heading is in the same place as in your screenshot: none has moved left or right."

# ============================== 1. The Customer and Vendor menus: a long no-space name stays in its own row ==============================
D("D-82", "Design: A/R Customer menu keeps a long no-space name inside its row",
  [ADMIN,
   f"Create, for this test, a customer, customer A, {LONG}, and give them an open invoice dated today, so they are in the Customer menu.",
   f"Create, for this test, a second customer, customer B, {SPECIAL}, and give them an open invoice dated today.",
   W1440, OPEN("A/R Summary")],
  ["Click the Customer chip.",
   "Scroll the list in the menu to customer A's row.",
   "Click customer A's tick box.",
   "Click the tick box in the row directly under customer A's row (if customer A's row is the last one, the row directly above it).",
   "Scroll the list to customer B's row."],
  [['The Customer menu opens: a search box, "All customers", then the list of customers.'],
   [f"Customer A's whole name stays inside its own row {EITHER}.",
    "No part of it is drawn over the row under it or over that row's tick box; that row's name can be read."],
   ["Customer A is ticked.", 'The chip shows customer A\'s name, shortened with "...".'],
   ["The customer in that row is ticked, and customer A stays ticked.", 'The chip reads "Customer: 2 customers".'],
   [f"Customer B's whole name, with its & \" ' < > characters, stays inside its own row {EITHER}.",
    "No part of it is drawn over the row under it or over that row's tick box; that row's name can be read."]],
  [prd13("S5-R13"), PIC1], ["ARS"], [5], "SV-12722, SV-11535, PRD v13 S5-R13",
  ["I41", "I08"],
  "The design draws the Customer menu with short names only (\"Two customers ticked\"); it draws no long name in a menu row. The "
  "expected results come from the PRD and Slack quotes above; the pictures give the menu's rows and labels.",
  ex={1: "For example: customer A is ZZAUTOTESTD82Longcustomernamewithoutanyspacesatalltotestoverflowandtruncationinthemenurowsandchips (120 letters).",
      2: "For example: customer B is ZZAUTOTEST D-82 <b>Bold</b> \"Quoted\" & 'Single' Trucking and Trailer Repair."},
  marker="AUTOMATION: READY - EXPECT FAIL (SV-12722)",
  ef_html=ef("SV-12722", "in step 2, customer A's name wraps onto about 4 lines; the first line is cut off at the top and the last line "
             "is drawn on top of the next customer's row and its tick box. The same happens in Sales By Customer's Customer menu."))

D("D-83", "Design: A/P Vendor menu keeps a long no-space name inside its row",
  [ADMIN,
   f"Create, for this test, a vendor, vendor A, {LONG}, and give them an unpaid bill dated today, so they are in the Vendor menu.",
   f"Create, for this test, a second vendor, vendor B, {SPECIAL}, and give them an unpaid bill dated today.",
   W1440, OPEN("A/P Detail")],
  ["Click the Vendor chip.",
   "Scroll the list in the menu to vendor A's row.",
   "Click vendor A's tick box.",
   "Click the tick box in the row directly under vendor A's row (if vendor A's row is the last one, the row directly above it).",
   "Scroll the list to vendor B's row."],
  [['The Vendor menu opens: "All vendors", then the list of vendors (a search box "Search vendors" above them when there are more than 8 vendors).'],
   [f"Vendor A's whole name stays inside its own row {EITHER}.",
    "No part of it is drawn over the row under it or over that row's tick box; that row's name can be read."],
   ["Vendor A is ticked.", 'The chip shows vendor A\'s name, shortened with "...".'],
   ["The vendor in that row is ticked, and vendor A stays ticked.", 'The chip reads "Vendor: 2 vendors".'],
   [f"Vendor B's whole name, with its & \" ' < > characters, stays inside its own row {EITHER}.",
    "No part of it is drawn over the row under it or over that row's tick box; that row's name can be read."]],
  [prd13("S5-R13"), PIC1], ["APD"], [5], "SV-12722, SV-11535, PRD v13 S5-R13",
  ["I40"],
  "The design draws the Vendor menu with short names only (\"The native Vendor menu\"); it draws no long name in a menu row. The "
  "expected results come from the PRD and Slack quotes above; the picture gives the menu's rows and labels.",
  ex={1: "For example: vendor A is ZZAUTOTESTD83Longvendornamewithoutanyspacesatalltotestoverflowandtruncationinthemenurowsandthechips (120 letters).",
      2: "For example: vendor B is ZZAUTOTEST D-83 <b>Bold</b> \"Quoted\" & 'Single' Parts and Heavy Equipment Supply."})

# ============================== 2. Every column visible at 1440 px with a long no-space name (S8-R3) ==============================
for key, code, rep, party, doc in [("D-84", "ARS", "A/R Summary", "customer", "an open invoice dated today"),
                                   ("D-85", "APS", "A/P Summary", "vendor", "an unpaid bill dated today")]:
    P = party.capitalize()
    D(key, f"Design: {rep} with a long no-space {party} name shows every column",
      [ADMIN, f"Create, for this test, a {party}, {party} A, {LONG}, and give them {doc}.", W1440, OPEN(rep),
       f"Leave the report with only {party} A ticked in the {P} filter."],
      [f"Look at {party} A's row, from the name to \"Total\"."],
      [[f"{P} A's name wraps inside its own cell, onto as many lines as it needs, and does not run into the next column.",
        f"Every column heading from the {party} name to {COLS[code]} is visible without scrolling sideways, and no heading wraps.",
        "There is no sideways scroll bar under the table.",
        '"Total" stays bold at the right edge.']],
      [prd13("S8-R3")], [code], [8], "SV-12764, SV-11538, PRD v13 S8-R3",
      ["I25", "I23"],
      "The design pictures 1440 px with short names only; its caption \"text columns wrap\" is the design's own rule for long values. "
      "The expected results come from the PRD quote above.", words=["Group labels span to the total; text columns wrap. S8-R3."],
      ex={1: f"For example: {party} A is ZZAUTOTEST{key.replace('-', '')}Long{party}namewithoutanyspaces... (120 letters, no spaces)."})

for key, code, rep, party, col, doc in [("D-86", "ARD", "A/R Detail", "customer", "Customer Full Name", "an open invoice dated today, not yet due"),
                                        ("D-87", "APD", "A/P Detail", "vendor", "Vendor Name", "an unpaid bill dated today, not yet due")]:
    P = party.capitalize()
    D(key, f"Design: {rep} with a long no-space {party} name shows every column",
      [ADMIN, f"Create, for this test, a {party}, {party} A, {LONG}, and give them {doc}, so it is in the \"Current\" bucket.", W1440,
       OPEN(rep), f"Leave the report with only {party} A ticked in the {P} filter and every bucket collapsed."],
      ["Look at the column headings and the bottom edge of the table.",
       'Expand the "Current" bucket.'],
      [[f"Every column heading from {COLS[code]} is visible without scrolling sideways, and no heading wraps.",
        "There is no sideways scroll bar under the table."],
       [f"{P} A's line shows; the name in \"{col}\" wraps inside its own cell, onto as many lines as it needs, and does not run into the next column.",
        f"Every column heading from {COLS[code]} is still visible without scrolling sideways, with no sideways scroll bar.",
        '"Open Balance" stays bold at the right edge.']],
      [prd13("S8-R3")], [code], [8], "SV-12764, SV-11538, PRD v13 S8-R3",
      ["I23", "I05"],
      "The design pictures 1440 px with short names only; its caption \"text columns wrap\" is the design's own rule for long values. "
      "The expected results come from the PRD quote above.", words=["Group labels span to the total; text columns wrap. S8-R3."],
      ex={1: f"For example: {party} A is ZZAUTOTEST{key.replace('-', '')}Long{party}namewithoutanyspaces... (120 letters, no spaces)."})

D("D-88", "Design: A/R Collection with a long no-space customer name shows every column",
  [ADMIN, f"Create, for this test, a customer, customer A, {LONG}, and give them an invoice that is overdue on today's date.", W1440,
   OPEN("A/R Collection"), "Leave the report with only customer A ticked in the Customer filter and customer A's group collapsed."],
  ["Look at customer A's group row, the column headings and the Totals row.",
   "Expand customer A's group."],
  [["Customer A's name wraps inside the group row, onto as many lines as it needs.",
    'Every column heading from "Date" to "Open Balance" is visible without scrolling sideways, "Past Due" and "Amount" included, and no heading wraps.',
    "There is no sideways scroll bar under the table, and the Totals row shows its Amount and Open Balance."],
   ["Customer A's overdue invoice shows under the group row.",
    'Every column heading from "Date" to "Open Balance" is still visible without scrolling sideways, with no sideways scroll bar.',
    "Customer A's name still wraps inside the group row."]],
  [prd13("S8-R3")], ["ARC"], [8], "SV-12764, SV-11538, PRD v13 S8-R3",
  ["I14", "I42"],
  "The design pictures A/R Collection at 1440 px with short names only. The expected results come from the PRD quote above.",
  ex={1: "For example: customer A is ZZAUTOTESTD88Longcustomernamewithoutanyspaces... (120 letters, no spaces)."},
  marker="AUTOMATION: READY - EXPECT FAIL (SV-12764)",
  ef_html=ef("SV-12764", "in step 1, customer A's name stays on one line across the group row, the table becomes wider than the page, a "
             "sideways scroll bar shows under it, \"Past Due\" and \"Amount\" are hidden behind the pinned \"Open Balance\" column and the "
             "Totals row shows only Open Balance. In step 2 the columns fit again, but the name still runs on one line."))

D("D-89", "Design: A/P Unpaid Invoices with a 78-character vendor name shows every column",
  [ADMIN, "Create, for this test, a vendor, vendor A, whose name is exactly 78 characters long with no spaces, and give them an unpaid bill dated today.",
   W1440, OPEN("A/P Unpaid Invoices"), "Leave the report with only vendor A ticked in the Vendor filter and vendor A's group collapsed."],
  ["Look at vendor A's group row, the column headings and the bottom edge of the table.",
   "Expand vendor A's group."],
  [["Vendor A's whole name shows in the group row.",
    'Every column heading from "Date" to "Open Balance" is visible without scrolling sideways, and no heading wraps.',
    "There is no sideways scroll bar under the table."],
   ["Vendor A's bill shows under the group row.",
    'On the bill\'s line, the name in "Vendor Name" wraps inside its own cell, onto as many lines as it needs, and does not run into the next column.',
    'Every column heading from "Date" to "Open Balance" is still visible without scrolling sideways, with no sideways scroll bar.',
    '"Open Balance" stays bold at the right edge.']],
  [prd13("S8-R3")], ["APU"], [8], "SV-12764, SV-11538, PRD v13 S8-R3",
  ["I25", "I16"],
  "The design pictures A/P Unpaid Invoices at 1440 px with short names only. The expected results come from the PRD quote above.",
  words=["At 1440 pixels every column fits without sideways scrolling: Date, Location, Transaction Type, No., Vendor Name, Due Date, Past Due, Amount and the pinned, bold Open Balance. Group labels span to the total; text columns wrap. S8-R3."],
  note=("Why 78 characters: on this report a vendor's group row does not wrap, and the PRD allows a much longer vendor name to make the "
        "table scroll sideways here; it says 78 characters still fit."),
  ex={1: "For example: vendor A is ZZAUTOTESTD89Longvendornamewithoutspacesthatisexactlyseventyeightcharacterslong (78 characters)."})

# ============================== 3. Columns keep their place when groups open and close (Slack, SV-12763) ==============================
GROUPED = [("D-90", "ARD", "A/R Detail", "bucket", "buckets",
            "Have open invoices dated on different days so that at least two aging buckets of A/R Detail have lines, so there are groups to open.",
            "the first bucket that has lines",
            '"Location", "ID" and "Customer Full Name" moved 30 to 55 px to the left and "Due Date" about 125 px and "Amount" about 86 px to the right'),
           ("D-91", "ARC", "A/R Collection", "group", "groups",
            "Have at least two customers with overdue invoices on today's date, so the report lists at least two customer groups to open.",
            "the first customer's group",
            '"ID" moved about 146 px and "Due Date" about 167 px to the left'),
           ("D-92", "APD", "A/P Detail", "bucket", "buckets",
            "Have unpaid bills dated on different days so that at least two aging buckets of A/P Detail have lines, so there are groups to open.",
            "the first bucket that has lines",
            '"Vendor Name" moved about 57 px, "Due Date" about 123 px and "Past Due" about 96 px to the right'),
           ("D-93", "APU", "A/P Unpaid Invoices", "group", "groups",
            "Have at least two vendors with unpaid bills on today's date, so the report lists at least two vendor groups to open.",
            "the first vendor's group",
            '"Vendor Name" moved about 42 px, "Due Date" about 140 px and "Past Due" about 110 px to the right')]
for key, code, rep, g, gs, data, first, moved in GROUPED:
    one = "bucket" if g == "bucket" else "group"
    D(key, f"Design: {rep} columns stay in place when {gs} open and close",
      [ADMIN, data, W1440, OPEN(rep),
       f"Leave every {g} collapsed (the chevron at the top left of the table points right)."],
      [SCREENSHOT,
       f"Click the chevron of {first}.",
       f"Click the same {one}'s chevron again.",
       "Click the chevron at the top left of the table (Expand all).",
       "Click the chevron at the top left of the table again (Collapse all)."],
      [["You have a picture of where each column heading sits while every " + g + " is collapsed."],
       [f"The {one} opens and shows its lines, each cell under its own heading.", SAME],
       [f"The {one} closes.", SAME],
       [f"Every {g} opens.", SAME],
       [f"Every {g} closes.", SAME]],
      [prd13("S4-R5"), prd13("S4-R1"), PIC23], [code], [4], "SV-12763, SV-11534, PRD v13 S4-R1, S4-R5",
      ["I14", "I23", "I05"] if code in ("ARD", "APD") else ["I14", "I16"],
      ("The design draws this report's groups collapsed and expanded in separate pictures; on A/P Detail its own pictures already place "
       "\"Vendor Name\" at different points (about 762 px collapsed, 800 px expanded, measured 13 Nov 2026), so the design does not settle "
       "this. The expected results come from Chris Ward's Slack post quoted above; the point is listed for the product owner."),
      marker="AUTOMATION: READY - EXPECT FAIL (SV-12763)",
      ef_html=ef("SV-12763", f"when a {one} opens or closes, and on Expand all and Collapse all, the column widths change, so the headings "
                 f"and lines jump sideways (on the ticket, in a 1536 px window, {moved} on Expand all, and every column jumped back on "
                 "Collapse all). Production already does this on A/R Detail."))

# ============================== 4. Columns while more lines load (held: no source sentence settles it) ==============================
D("D-94", "Design: A/R Detail columns stay in place while more lines load",
  [ADMIN, "Have a bucket in A/R Detail, bucket A, with more than 100 lines on today's date, so its later lines load as you scroll.",
   W1440, OPEN("A/R Detail")],
  ["Expand bucket A.",
   SCREENSHOT,
   "Scroll down past bucket A's 100th line until more lines load."],
  [["Bucket A opens with its first 100 lines."],
   ["You have a picture of where each column heading sits with the first 100 lines shown."],
   ["More lines load under the first 100.", SAME]],
  [prd13("S4-R4"), PIC23], ["ARD"], [4], "SV-12763, SV-11534, PRD v13 S4-R4",
  ["I14", "I15"],
  "The design draws no picture of lines loading while scrolling. No source sentence says whether the columns may move while more lines "
  "load; this case is held until the product owner answers.",
  marker=HOLD_SCROLL,
  note=("Held: the product owner's post speaks of the tables moving when groups expand or collapse; it does not mention lines loading "
        "while scrolling, and no other source does. The question is with the product owner; until it is answered, do not run this test."))

# ============================== 5. The PDF's "Total for" row with a long no-space name (S3-R7b, new in version 12) ==============================
D("D-95", "Design: A/R Collection PDF wraps a long no-space name in its Total row",
  [ADMIN, f"Create, for this test, a customer, customer A, {LONG}, and give them an invoice that is overdue on today's date.", W1440,
   OPEN("A/R Collection"), "Leave the report with only customer A ticked in the Customer filter."],
  ['Click the ⋯ Export button ("Export report") at the right of the title row.',
   'Click "Download (PDF)".',
   "Open the downloaded PDF."],
  [['The menu shows "Download (PDF)" and "Download (CSV)".'],
   ["A PDF file downloads."],
   ['Customer A\'s group ends with a row that reads "Total for " followed by customer A\'s name, with its Amount and Open Balance.',
    "Customer A's name wraps inside that row: no part of it runs over the Amount or Open Balance figures or off the edge of the page.",
    'The word "Subtotal" appears nowhere in the PDF.']],
  [prd13("S3-R1"), prd13("S3-R7b")], ["ARC"], [3], "SV-11533, PRD v13 S3-R7b, SV-12764",
  [],
  "The design pictures the Export menu used in steps 1 and 2, but no PDF file (all 7 boards checked); the PDF results follow the PRD.",
  ex={1: "For example: customer A is ZZAUTOTESTD95Longcustomernamewithoutanyspaces... (120 letters, no spaces)."})
