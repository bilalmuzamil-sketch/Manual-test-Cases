"""Story 3, What Reaches QuickBooks (SV-10132), section 20463. Phase A, 27 Oct 2026, PRD v15.
Live cases rewritten top to bottom (Rule 134): S3-01 C154713 · S3-02 C154714 · S3-03 C154715 · S3-04 C154716 · S3-05 C154717 ·
S3-06 C154718 · S3-07 C154719 · S3-08 C154720 · S3-09 C154721 · S3-10 C154722 · S3-11 C549081 · S3-12 C549082 · S3-13 C549083 ·
S3-14 C549084 · S3-15 C549085 · S3-16 C549086 · S3-17 C549087 · S3-18 C549088.
New cases for the v14 lines (Chris Ward's answers of 14 Oct): S3-19 (a description of only spaces is absent, S3-R3), S3-20 (a tech story
of only spaces is absent, S3-R6), S3-21 (spaces and an empty line at the very end are removed, S3-R8), S3-22 (a value's own trailing space
is kept, S3-R8), S3-23 (an invoice made before the release shows the new text in the downloaded report, S3-E4).

Rule 116 in spirit: every line text a result quotes is GENERATED here by wwlib.joined() from the case's own typed inputs (the PRD's rule,
never the build), and every "The cell shows N" is checked by build.py against the length of that text. Both routes are covered: the
downloaded Customer Invoice report (most cases, no QuickBooks needed) and the live QuickBooks sync (S3-03, S3-09, S3-14, S3-15, S3-17)."""
from wwlib import C, joined, nbytes
from common import *

WRITTEN = True
QB = dict(boards=["QuickBooks"], words=[words("QuickBooks", "The line a bookkeeper reads", "S3-R1 to S3-R4")])
QB_ONOFF = dict(boards=["QuickBooks"], words=[words("QuickBooks", "Require Tech Story ON", "which is the same rule the description already follows.")])
EDGE = dict(boards=["EdgeCases"], words=[words("EdgeCases", "Extreme cases", "both present.")])
EDGE_NODESC = dict(boards=["EdgeCases"], words=[words("EdgeCases", "S3-R3 · no description", "where the description would have been.") if False else
                                             words("EdgeCases", "One separator, not two.", "no double hyphen behind it.")])
EDGE_HYPHEN = dict(boards=["EdgeCases"], words=[words("EdgeCases", "Carried as written.", "which is the thing two customers asked us to stop doing."),
                                             words("EdgeCases", "With the semicolon gone", "carries through untouched.")])
EDGE_FOUR = dict(boards=["EdgeCases"], words=[words("EdgeCases", "Three of these four end after the description", "none of them leaves a trailing hyphen.")])
LONG = dict(boards=["Truncation"], words=[words("Truncation", "The title leads the joined string", "never the name of the job.")])
LONG_ACC = dict(boards=["Truncation"], words=[words("Truncation", "An accented character costs two bytes", "so that cannot happen.")])

def rep(text, n=None):
    """the report results: pick, dates, download, then the open-file result(s)."""
    return [[R_PICK], [R_TODAY], [R_DOWNLOAD], [cell(text)] + ([] if n is None else n)]
NO_LABELS = ("The cell has none of our field names: no \"What are you doing?:\", \"Why are you doing it?:\", \"Title:\", \"Description:\" "
             "or \"Tech Story:\", and no semicolon.")
def counted(text, parts):
    sums = f"{' + '.join(str(p) for p in parts)} = {len(text)}" if len(parts) > 1 else f"the title's {parts[0]} characters"
    return [f"The cell shows {len(text)} ({sums}), so nothing is added and nothing trails after the last word."]
assert len(joined(T1, D1, N1)) == 15 + 3 + 14 + 3 + 42

# ---------------------------------------------------------------- the three segments, Require Tech Story on
X1 = joined(T1, D1, N1)
C("S3-01", "S3", "Customer Invoice report shows a line as Title - Description - Tech story",
  [ADMIN, TECH_ON, wo_line(), invoiced(N1), SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET, LEN],
  rep(X1, [NO_LABELS, "Each join between two parts is exactly one space, one hyphen, one space: no double space and no other kind of dash."])
  + [counted(X1, [15, 3, 14, 3, 42])],
  ["S3-R1", "S3-R2", "S3-R5", "S3-R6a", "KD-3"], design=QB, inputs=(T1, D1, N1),
  claude=["The PRD's own example line (S3-R1). Require Tech Story on: the tech story is typed at the completion gate."])

# ---------------------------------------------------------------- title only, Require Tech Story off
X2 = joined("Oil change")
C("S3-02", "S3", "A line with only a title shows the title alone in the Customer Invoice report",
  [ADMIN, TECH_OFF, wo_line("Oil change", ""), invoiced(), SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET, LEN],
  rep(X2, ["There is no hyphen and no space after the title."]) + [counted(X2, [10])],
  ["S3-R3", "S3-R6a", "KD-5"], design=EDGE, inputs=("Oil change", "", ""))

# ---------------------------------------------------------------- both routes, the same text (QuickBooks)
C("S3-03", "S3", "QuickBooks Online and the Customer Invoice report show the same line text",
  [ADMIN, QBO, TECH_ON, wo_line(), invoiced(N1) [:-1] + ", which reaches the QuickBooks sandbox.", "Write down invoice A's number.",
   SHEETS, QBO_TAB, START_EXPORT],
  ["In the QuickBooks tab, search for invoice A's number.", "Open invoice A.", "Switch to the ShopView tab."] + REPORT + [OPEN_SHEET],
  [["QuickBooks lists invoice A (work order 1's invoice) for its customer."],
   ["Invoice A opens.", f"Line 1's Description in QuickBooks reads exactly \"{X1}\".", "It has no field names and no semicolon."],
   ["The Export Report dialog is open in ShopView."],
   [R_PICK], [R_TODAY], [R_DOWNLOAD],
   [cell(X1), "It is identical, character for character, to line 1's Description in QuickBooks in step 2."]],
  ["S3-R4", "S3-R1", "FO-4", "PRE-S3-1", "PRE-S3-4", "KD-8"], design=QB, inputs=(T1, D1, N1),
  claude=["QuickBooks host: qb1.qa.shopview.com (sv10130 backend; SV-10130 comment of 8 Oct). The QA's 23 Oct pass used QBO sandbox "
          "company CA 3e09 (the US sandbox gives a tax-code error \"TAX or NON\"; reconnect and remap)."])

# ---------------------------------------------------------------- Require Tech Story off: the line completes and ends after the description
X4 = joined(T1, D1)
C("S3-04", "S3", "With Require Tech Story off, the report line ends after the description",
  [ADMIN, TECH_OFF, wo_line(extra=", approved and not yet completed"), SHEETS, START_LINES],
  ["Complete line 1 without typing a tech story.", "Change work order 1's status to Complete.", "Click the Finance tab.",
   "Click Create Invoice.", "Close the New Customer Payment window without taking a payment.", "Click Reports in the top bar.",
   "Click Export Reports in the Reports left menu."] + REPORT + [OPEN_SHEET, LEN],
  [["Line 1 completes without asking for a tech story."], ["Work order 1 shows Complete."], ["The Finance tab opens."],
   ["A new invoice is created and work order 1 shows Invoiced."], ["The payment window closes."], ["The Reports page opens."],
   ["The Export Report dialog opens."], [R_PICK], [R_TODAY], [R_DOWNLOAD],
   [f'In line 1\'s row (work order 1\'s new invoice) the ItemDescription cell reads exactly "{X4}".', "There is no hyphen and no space after \"excessive play\", and no tech story text."],
   counted(X4, [15, 3, 14])],
  ["S3-R6a", "S3-R6", "S3-R3", "KD-6"], design=QB_ONOFF, inputs=(T1, D1, ""),
  claude=["A line saved from New Line keeps an empty tech story (S3-R6); completing it with Require Tech Story off writes none."])

# ---------------------------------------------------------------- the 4,000 cut, plain digits
DIG = "0123456789" * 500
X5 = joined(T1, DIG)
assert len(X5) == 4000 and nbytes(X5) == 4000 and X5.endswith("2345678901")
C("S3-05", "S3", "An over-long line is shortened from the end in the report and keeps the title",
  [ADMIN, TECH_OFF,
   'Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" whose description is '
   '0123456789 written 500 times in a row (5,000 characters; paste it in).', invoiced(), SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET, LEN, "In another empty cell, enter =RIGHT() with line 1's ItemDescription cell and 10 inside the brackets.",
            "In a third empty cell, enter =LEFT() with line 1's ItemDescription cell and 28 inside the brackets."],
  [[R_PICK], [R_TODAY], [R_DOWNLOAD],
   ["Line 1's row (work order 1's invoice A) is there, and its ItemDescription cell is shorter than the full line of 5,018 characters (15 + 3 + 5,000)."],
   [f"The cell shows {len(X5)}: 15 characters of title + 3 for \" - \" + the first 3,982 characters of the description = 4,000. "
    "A digit or a plain letter takes one unit of the 4,000 limit, so 4,000 characters is exactly the limit."],
   ["The second cell shows \"2345678901\": the description was cut at its end (398 whole runs of 0123456789, then \"01\"), and no hyphen or space trails after it."],
   ["The third cell shows \"Replace tie rod - 0123456789\": the title survives whole, and the cut fell in the description."]],
  ["S3-R7", "S3-R8", "S3-R4", "KD-8", "ASSUME-3", "ASSUME-5"], design=LONG, inputs=(T1, DIG, ""),
  claude=["Generate the description with a spreadsheet: =REPT(\"0123456789\",500), copy the cell, paste into Description."])

# ---------------------------------------------------------------- hyphens and semicolons inside values (board 2.1's own two examples)
T6, D6, N6 = "Replace tie rod - passenger side", "excessive play - customer waiting", "Torqued to 74 ft-lb, alignment set"
T6b, D6b, N6b = "Replace tie rod", "excessive play; also checked the drag link", "Drag link within spec"
X6, X6b = joined(T6, D6, N6), joined(T6b, D6b, N6b)
C("S3-06", "S3", "Hyphens and semicolons typed in a line are carried as written",
  [ADMIN, TECH_ON,
   f'Create a work order for this test, work order 1, with two labor lines: line 1 titled "{T6}" with the description "{D6}", and '
   f'line 2 titled "{T6b}" with the description "{D6b}".',
   f'Have line 1 completed with the tech story "{N6}", line 2 completed with the tech story "{N6b}", and work order 1 completed and '
   "invoiced today as invoice A.", SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET, LEN],
  [[R_PICK], [R_TODAY], [R_DOWNLOAD],
   [cell(X6), f'In line 2\'s row the ItemDescription cell reads exactly "{X6b}".',
    "The hyphens and the semicolon typed inside the values are kept, and nothing is put in quotes or marked with extra characters such as a backslash."],
   [f"The cell shows {len(X6)} ({len(T6)} + 3 + {len(D6)} + 3 + {len(N6)} = {len(X6)}): nothing was added or removed."]],
  ["S3-R9", "S3-R9a", "S3-R8", "S3-R5"], design=EDGE_HYPHEN, inputs=[(T6, D6, N6), (T6b, D6b, N6b)],
  claude=["Values are the board \"Awkward inputs\" (2.1) examples, letter for letter."])

# ---------------------------------------------------------------- money masked, line text not
C("S3-07", "S3", "The report hides money but not line text from a user without financial access",
  ["Sign in as user B, whose role has Reports and Invoicing & payments - View on and See financial data off, at the test location.",
   TECH_ON, wo_line(), invoiced(N1)[:-1] + ", by an Admin.", SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET],
  rep(X1, ["The line text is not masked: user B reads the same words an Admin reads.",
           "On the same row the ItemRate, ItemAmount and ItemTaxAmount cells read \"Restricted\" instead of an amount, and the average cost cell shows no amount."]),
  ["S3-R10", "PRE-S3-3", ("JIRA", "SV-10132, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing)",
                         "The same export as a user without \"See financial data\": the line text is identical and ItemRate / ItemAmount / ItemTaxAmount read \"Restricted\".")],
  design=dict(boards=[], note="no board draws the downloaded report for a user without financial access, so no design picture is attached; "
              "the expected results above come from the quotes above."), inputs=(T1, D1, N1))

# ---------------------------------------------------------------- no other report carries the joined text
C("S3-08", "S3", "Other downloadable reports do not carry the joined Title - Description text",
  [ADMIN, TECH_OFF, wo_line(), invoiced(), SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET, "Download, for today, each other report the Report Name list offers.",
            f'Search each of those files for "{X4}".'],
  [[R_PICK], [R_TODAY], [R_DOWNLOAD], [cell(X4)],
   ["Each other report downloads."],
   [f"No other file contains \"{X4}\". A file may show \"Replace tie rod\" or \"excessive play\" on its own; that is correct."]],
  ["S3-R11", "S3-R4", "FO-4"], design=QB, inputs=(T1, D1, ""))

# ---------------------------------------------------------------- invoices already in QuickBooks keep their text
C("S3-09", "S3", "Invoices already in QuickBooks Online keep the text they were sent with",
  [ADMIN, QBO, "Have an invoice made and synced to QuickBooks before this release, invoice A, for customer A, whose labor line, "
   "line 1, had a title, a description and a tech story.", "Write down invoice A's number.", QBO_TAB],
  ["In the QuickBooks tab, search for invoice A's number.", "Open invoice A."],
  [["QuickBooks lists invoice A exactly once, for customer A: nothing was sent again."],
   ["Invoice A opens.", "Line 1's Description still reads in the old form, starting \"What are you doing?:\" and carrying "
    "\";Why are you doing it?:\" and \";Tech Story:\": nothing was rewritten in QuickBooks."]],
  ["S3-N1", "S3-R4", "OOS-3", "KD-10"], design=dict(boards=["QuickBooks"], words=[words("QuickBooks", "Before", "Tech Story: Both outer ends worn, replaced and aligned")]),
  claude=["Needs an invoice synced from this QuickBooks-connected location before the What/Why build reached it (qb1: before 8 Oct 2026)."])

# ---------------------------------------------------------------- parts, shop supplies and fee rows
C("S3-10", "S3", "Parts, shop supplies and fee rows in the report do not take the line text",
  [ADMIN, TECH_OFF,
   wo_line()[:-1] + ", plus a part (part A), a shop supplies charge and a fee (fee A).",
   "Have line 1 completed with no tech story, part A received, and work order 1 completed and invoiced today as invoice A.",
   SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET],
  [[R_PICK], [R_TODAY], [R_DOWNLOAD],
   [cell(X4), "The part A row, the shop supplies row and the fee A row each have their own ItemDescription.",
    "None of those three cells contains \"Replace tie rod\" or \"excessive play\", and none is joined to them with \" - \"."]],
  ["S3-N3", "S3-R1"], design=dict(boards=[], note="no board draws part, shop supplies or fee rows, so no design picture is attached; "
                                  "the expected results above come from the quotes above."), inputs=(T1, D1, ""))

# ---------------------------------------------------------------- no description
X11 = joined(T1, "", N1)
C("S3-11", "S3", "A line with no description joins the title straight to the tech story",
  [ADMIN, TECH_ON, wo_line(T1, ""), invoiced(N1), SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET, LEN],
  rep(X11, ["There is one separator, not two, and no gap where the description would have been."]) + [counted(X11, [15, 3, 42])],
  ["S3-E1", "S3-R3"], design=EDGE_NODESC, inputs=(T1, "", N1))

# ---------------------------------------------------------------- "Tech story missing."
C("S3-12", "S3", "A tech story of \"Tech story missing.\" is left out of the report text",
  [ADMIN, TECH_OFF, wo_line(),
   "Have line 1 opened in Edit Line and saved once with Save & Close, without typing a tech story, so it holds \"Tech story missing.\".",
   "Have line 1 completed without typing a tech story, and work order 1 completed and invoiced today as invoice A.", SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET, LEN],
  rep(X4, ["The words \"Tech story missing.\" do not appear, and there is no hyphen or space after \"excessive play\"."])
  + [counted(X4, [15, 3, 14])],
  ["S3-R6", "KD-7", ("PO", "Chris Ward, 14 Oct 2026, answer 6",
                     "It's written when an existing line with no tech story is saved from the Edit Line window: open it, save, and the line holds \"Tech story missing.\" A line saved from New Line keeps an empty tech story. Neither depends on completion or on Require Tech Story (S3-R6).")],
  design=EDGE_FOUR, inputs=(T1, D1, "Tech story missing."),
  claude=["The developer (SV-10132, 19 Oct): \"Tech story missing.\" is written when Edit Line saves an existing line that has no tech story."])

# ---------------------------------------------------------------- the 4,000 cut with accented letters (multibyte), report
TA, DA = "Replace tie rods", "é" * 3000
XA = joined(TA, DA)
assert len(XA) == 2009 and nbytes(XA) == 3999 and nbytes(XA + "é") == 4001
C("S3-13", "S3", "An accented over-long line is cut earlier and never in the middle of a letter",
  [ADMIN, TECH_OFF,
   'Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rods" (16 characters) whose '
   'description is the letter é written 3,000 times in a row (paste it in).', invoiced(), SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET, LEN, "In another empty cell, enter =RIGHT() with line 1's ItemDescription cell and 5 inside the brackets."],
  [[R_PICK], [R_TODAY], [R_DOWNLOAD],
   ["Line 1's row (work order 1's invoice A) is there; its ItemDescription cell holds \"Replace tie rods - \" and then a run of é letters.",
    "No odd symbol such as \"�\" or \"Ã©\" appears anywhere in the cell."],
   [f"The cell shows {len(XA)}: 16 + 3 + 1,990 letters é = 2,009. Each é takes two units of the 4,000 limit, so 19 + 1,990 × 2 = 3,999 "
    "units fit, and one more é would need 4,001.",
    "A line of plain digits of the same length on screen would keep 4,000 characters: this line is cut much earlier, and that is correct."],
   ["The second cell shows \"ééééé\": the last letter is a whole é, not half of one and not a \"�\"."]],
  ["S3-R7", "S3-R7a", "S3-R4", "KD-8"], design=LONG_ACC, inputs=(TA, DA, ""),
  claude=["Generate the description with =REPT(\"é\",3000). 16-character title on purpose: 19 units before the description is odd, so the "
          "4,000th unit falls inside an é and the cut has to stop one unit early (3,999)."])

# ---------------------------------------------------------------- the same long line reaches QuickBooks and matches the report
C("S3-14", "S3", "An over-long line still reaches QuickBooks Online and matches the report",
  [ADMIN, QBO, TECH_OFF,
   'Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rods" (16 characters) whose '
   'description is the letter é written 3,000 times in a row (paste it in).',
   invoiced()[:-1] + ", which the QuickBooks sync picks up.", "Write down invoice A's number.", SHEETS, QBO_TAB, START_EXPORT],
  ["In the QuickBooks tab, search for invoice A's number.", "Open invoice A.", "Copy line 1's Description into cell A1 of a new Google Sheet.",
   "In cell B1, enter =LEN(A1).", "Switch to the ShopView tab.", "Click QB Unexported in the Reports left menu.",
   "Click Export Reports in the Reports left menu."] + REPORT + [OPEN_SHEET],
  [["QuickBooks lists invoice A, work order 1's invoice: the over-long line did not stop it from syncing."],
   ["Invoice A opens; line 1's Description starts with \"Replace tie rods - é\" and ends with a whole é."],
   ["Cell A1 holds the Description."],
   [f"Cell B1 shows {len(XA)} (16 + 3 + 1,990 letters é, the most that fit in the 4,000 limit)."],
   ["The ShopView tab is in front, on Reports."],
   ["The QB Unexported list opens on its Customers tab, and invoice A is not in it."],
   ["The Export Report dialog opens."],
   [R_PICK], [R_TODAY], [R_DOWNLOAD],
   ["Line 1's ItemDescription cell is identical to the Description in cell A1: both routes cut the line at the same place."]],
  ["S3-E3", "S3-R7", "S3-R4", "CN-S3-2"], design=LONG_ACC, inputs=(TA, DA, ""))

# ---------------------------------------------------------------- an imported historical invoice never reaches QuickBooks
C("S3-15", "S3", "An imported historical invoice is not sent to QuickBooks Online",
  [ADMIN, QBO, "Create a regular invoice for this test, invoice B, today at the test location, and let it reach QuickBooks, so you know the sync is running.",
   'Create an import file for this test, file A, from the downloaded Invoices import template, with one Labor row: a new invoice number '
   '(invoice A), an existing customer, *Line Title "Replace tie rod" and Line Description "excessive play".',
   "Write down the numbers of invoice A and invoice B.", QBO_TAB,
   "Start on Settings, then Invoices under Data Import in the Settings left menu."],
  ["Upload file A.", "Wait 5 minutes without importing the file again.", "In the QuickBooks tab, search for invoice B's number.",
   "Search for invoice A's number.", "Switch to the ShopView tab.", "Click Reports in the top bar.", "Click QB Unexported in the Reports left menu."],
  [["The import finishes with \"All invoices have been imported successfully.\"."], ["Five minutes have passed."],
   ["QuickBooks lists invoice B: the sync is running."],
   ["QuickBooks has no invoice with invoice A's number: the imported invoice was not sent."],
   ["The ShopView tab is in front."], ["The Reports page opens."],
   ["The QB Unexported list opens; invoice A is not in it on any tab: it was not tried and failed either."]],
  ["S3-R12", "FO-5", ("JIRA", "SV-10133, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing)",
                      "Fill the downloaded template with one Labor row and import it: \"All invoices have been imported successfully.\", and the invoice opens with the title and description in the right places.")],
  design=dict(boards=["EdgeCases"], words=[words("EdgeCases", "Imported from a previous system · may be empty", "Replace tie rod - excessive play")]),
  claude=["Imported invoices are found under Work Orders → All tab → Status → Imported (List view only), at the location they were "
          "imported into (Nemanja Djuric, SV-10133, 21 Oct)."])

# ---------------------------------------------------------------- a line created before the change
C("S3-16", "S3", "A line created before this change reaches the report in the new form",
  [ADMIN, TECH_OFF, "Have a work order made before this release and not yet invoiced, work order 1, with a labor line, line 1, that "
   "has a title and a description and no tech story.", "Write down line 1's title and description as work order 1's Lines tab shows them.",
   "Have line 1 completed with no tech story, and work order 1 completed and invoiced today as invoice A, for this test.",
   SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET],
  [[R_PICK], [R_TODAY], [R_DOWNLOAD],
   ["In line 1's row (work order 1's invoice A) the ItemDescription cell reads line 1's title, a space, a hyphen, a space, then its "
    "description, exactly as written down, and nothing after it.", NO_LABELS]],
  ["S3-N2", "S3-R1", "S3-R3", "CN-S3-1"], design=QB)

# ---------------------------------------------------------------- reversed and re-invoiced after release day
C("S3-17", "S3", "An old invoice reversed and invoiced again sends the new text to QuickBooks",
  [ADMIN, QBO, "Have a work order made before this release, work order 1, for customer A, invoiced and synced to QuickBooks before "
   "this release as invoice A, with a labor line, line 1, that has a title, a description and a tech story.",
   "Write down line 1's title, description and tech story.", QBO_TAB, "Start on work order 1, on its Finance tab."],
  ["Click invoice A's three-dot menu.", "Click Reverse.", "Click Reverse in the confirmation.", "Click Create Invoice.",
   "Close the New Customer Payment window without taking a payment.", "In the QuickBooks tab, search for customer A's invoices.",
   "Open the newest invoice for customer A.", "Open invoice A."],
  [["The menu opens with Reverse."], ["A confirmation opens."], ["Invoice A is reversed and Create Invoice is offered again on work order 1."],
   ["A new invoice for work order 1 is created."], ["The payment window closes."],
   ["QuickBooks lists invoice A and the new invoice for customer A."],
   ["The new invoice's line 1 Description reads line 1's title, \" - \", its description, \" - \" and its tech story, as written down, with no field names and no semicolon."],
   ["Invoice A's line 1 Description still reads in the old form, starting \"What are you doing?:\": both forms now sit in the same books for one job."]],
  ["S3-E2", "S3-N1", "KD-10"], design=dict(boards=["QuickBooks"], words=[words("QuickBooks", "Before", "Tech Story: Both outer ends worn, replaced and aligned")]))

# ---------------------------------------------------------------- the download needs Invoicing & payments - View
C("S3-18", "S3", "Customer Invoice report cannot be downloaded without Invoicing & payments - View",
  ["Sign in as user B, whose role has Reports on and Invoicing & payments - View off, at the test location.",
   "Have an invoice made today at the test location, invoice A, by an Admin.",
   "Use a second browser, or a private window, signed in as an Admin at the test location, with the Export Report dialog open, so you can see the same report download for someone allowed.",
   START_EXPORT],
  REPORT + ["In the second browser, pick Customer Invoice in the Report Name list.", "In the second browser, set the date range to today.",
            "In the second browser, click Download."],
  [["Customer Invoice is offered in the Report Name list for user B and is picked: the entry is not hidden."], [R_TODAY],
   ["No Customer Invoice file downloads for user B."],
   [R_PICK], [R_TODAY], ["A Customer Invoice file downloads for the Admin, with invoice A's rows in it: the report has data, so user B's empty-handed download comes from the missing permission."]],
  ["PRE-S3-3"], design=dict(boards=[], note="no board draws the Export Report dialog, so no design picture is attached; the expected "
                                      "results above come from the quotes above."))

# ---------------------------------------------------------------- v14: a segment made only of spaces counts as absent
X19 = joined(T1, "   ", N1)
assert X19 == X11
C("S3-19", "S3", "A description of only spaces is left out: the title joins the tech story",
  [ADMIN, TECH_ON, 'Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" whose '
   'description is three spaces and nothing else.', invoiced(N1), SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET, LEN],
  rep(X19, ["There is one separator, not two, and no run of spaces where the description would have been."]) + [counted(X19, [15, 3, 42])],
  ["S3-R3", "S3-E1", ("PO", "Chris Ward, 14 Oct 2026, answer 1",
                      "Yes. A tech story made only of spaces counts as no tech story, and the line ends after the description. The same goes for a title or description that is only spaces (S3-R3, S3-R6).")],
  design=EDGE_NODESC, inputs=(T1, "   ", N1))

X20 = joined(T1, D1, "   ")
C("S3-20", "S3", "A tech story of only spaces is left out: the line ends after the description",
  [ADMIN, TECH_OFF, wo_line(), "Have line 1 completed with a tech story of three spaces and nothing else, and work order 1 completed "
   "and invoiced today as invoice A.", SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET, LEN],
  rep(X20, ["There is no hyphen and no space after \"excessive play\"."]) + [counted(X20, [15, 3, 14])],
  ["S3-R6", "S3-R3"], design=EDGE_FOUR, inputs=(T1, D1, "   "))

# ---------------------------------------------------------------- v14: spaces and line breaks at the very end of the line are removed
N21 = N1 + "   \n"
X21 = joined(T1, D1, N21)
assert X21 == X1
C("S3-21", "S3", "Spaces and an empty line at the end of the tech story do not reach the report",
  [ADMIN, TECH_ON, wo_line(), f'Have line 1 completed with the tech story "{N1}" followed by three spaces and one press of Enter, and '
   "work order 1 completed and invoiced today as invoice A.", SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET, LEN],
  rep(X21, ["The cell ends at the word \"aligned\": no spaces and no empty line after it."]) + [counted(X21, [15, 3, 14, 3, 42])],
  ["S3-R8", "S3-R3", ("JIRA", "SV-10132, Nemanja Djuric, 19 Oct 2026 (QA update, PRD v14)",
                      "A tech story ending in spaces or blank lines: the QuickBooks line ends at its last word (S3-R8). Spaces inside the text are kept as typed.")],
  design=EDGE, inputs=(T1, D1, N21))

# ---------------------------------------------------------------- a value's own trailing space is kept (only the end of the whole line is trimmed)
T22 = T1 + " "
X22 = joined(T22, D1)
assert X22 == "Replace tie rod  - excessive play" and len(X22) == 33
C("S3-22", "S3", "A space typed at the end of the title is kept before the separator",
  [ADMIN, TECH_OFF, 'Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" followed '
   'by one space, with the description "excessive play".', invoiced(), SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET, LEN],
  rep(X22, ["There are two spaces between \"rod\" and the hyphen: the space typed in the title, then the separator's own space."])
  + [counted(X22, [16, 3, 14])],
  ["S3-R8", "S3-R2", ("JIRA", "SV-10132, Nemanja Djuric, 23 Oct 2026",
                      "Each value goes through exactly as typed (S3-R8). If a value was saved with a trailing space, it keeps that space, and the - separator then adds its own.")],
  design=EDGE, inputs=(T22, D1, ""),
  claude=["The QA's 23 Oct pass, case 6 (\"Replace - Rear ramp handles␣␣- Broken off\"); the developer and the QA agreed it is by design."])

# ---------------------------------------------------------------- v14 S3-E4: the report is built at each download
C("S3-23", "S3", "An invoice made before the release shows the new text in the downloaded report",
  [ADMIN, "Have an invoice made before this release, invoice A, whose labor line, line 1, has a title, a description and a tech story.",
   "Write down line 1's title, description and tech story, and invoice A's date.", SHEETS, START_EXPORT],
  [PICK_CI, "Set the date range to cover invoice A's date.", DOWNLOAD, OPEN_SHEET],
  [[R_PICK], ["The date range covers invoice A's date."], [R_DOWNLOAD],
   ["In line 1's row (invoice A) the ItemDescription cell reads line 1's title, \" - \", its description, \" - \" and its tech story, "
    "exactly as written down: the new form, although invoice A was made before the release.", NO_LABELS]],
  ["S3-E4", "S3-R4", "S3-N2"], design=QB,
  claude=["QuickBooks keeps invoice A's old text (S3-N1); that half is checked by the QuickBooks case for old invoices."])
