"""Story 4, The Imports (SV-10133), section 20464. Phase A, 27 Oct 2026, PRD v15.
Live cases rewritten top to bottom (Rule 134): S4-01 C154723 · S4-02 C154724 · S4-03 C154725 · S4-04 C549089 · S4-05 C549090 ·
S4-06 C549091 · S4-07 C549092. New: S4-08 (old column names in other capitals and with spaces around them, v14 S4-R3).
Where imported invoices are found (Work Orders → All tab → List view → Status → Imported, at the location imported into) is from the
developer's answer on SV-10133 (21 Oct 2026); the messages are from the developers' QA notes (SV-10133, SV-10392)."""
from wwlib import C
from common import *

WRITTEN = True
NOBOARD = dict(boards=[], note="the design has no board for the Invoices import (the tech plan: \"No boards for Story 2 / Story 4 — accepted "
               "as text-only\"), so no design picture is attached; the expected results above come from the quotes above.")
START_IMPORT = "Start on Settings, then Invoices under Data Import in the Settings left menu."
OK_MSG = "\"All invoices have been imported successfully.\" shows."
NO_MISSING = "No message says a column is missing or should be removed."
REJECT = ["The file is rejected with \"Invalid file headers provided!\".", "\"Failed to import all invoices.\" shows, and nothing is imported."]
def files(b_headers, a_headers="keeps the template's headers"):
    return ("Create two import files for this test from the downloaded Invoices import template, each with one Labor row for an existing "
            "customer, *Line Title \"Replace tie rod\" and Line Description \"excessive play\": file A " + a_headers + ", with a new invoice "
            "number, invoice A; file B " + b_headers + ", with another new invoice number, invoice B.")
SHARED = "Give invoices A and B numbers that start with the same text, so one search lists both."
FIND = ["Click Work Orders in the top bar.", "Click the All tab.", "Switch the list to List view.", "Pick Imported in the Status filter.",
        "Type the shared start of the two invoice numbers in the Search box.", "Click invoice A.", "Go back to the list.", "Click invoice B."]
FOUND = [["The Work Orders page opens."], ["The All tab is shown."], ["The work orders show as a list."],
         ["Only imported work orders are listed."], ["Invoices A and B are listed."],
         ["Invoice A opens; its line reads \"Replace tie rod\" as the title and \"excessive play\" as the description."],
         ["The list is back, with invoices A and B."],
         ["Invoice B opens; its line reads \"Replace tie rod\" as the title and \"excessive play\" as the description, exactly like invoice A."]]
WHERE = ("JIRA", "SV-10133, Nemanja Djuric, 21 Oct 2026",
         "Work Orders → All tab → Status → Imported. Selecting Imported clears the other statuses and only works in List view (in other views it's greyed out: \"Imported work orders open in List.\"). Then search by invoice number or customer name; partial text works, so \"QA10133\" finds all four.")
DEV_OK = ("JIRA", "SV-10133, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing)",
          "Import a file using the old headers (\"*Line Title - What are you doing\", \"Line Description - Why are you doing it\"): it imports the same way, with no missing-column error.")
DEV_REJECT = ("JIRA", "SV-10133, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing)",
              "Import a file with an unknown header in that position (e.g. \"*Line Name\"): rejected with \"Invalid file headers provided!\" and \"Failed to import all invoices.\"; nothing is imported.")

C("S4-01", "S4", "The Invoices import lists the columns Line Title and Line Description",
  [ADMIN, "Start on Settings."],
  ["Click Invoices under Data Import in the Settings left menu."],
  [["The Invoices import page opens; its on-screen column list names \"Line Title\" and \"Line Description\" next to each other, after Item and before Tech Story.",
    "The column list nowhere says \"What are you doing\" or \"Why are you doing it\".",
    "Data Import has no separate work order import: Invoices is the import that carries these two columns."]],
  ["S4-R2", "S4-R6", "S4-R1", "FO-5", "SURF-5",
   ("JIRA", "SV-10133, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing)", "The on-screen column list says \"Line Title, Line Description\".")],
  design=NOBOARD)

C("S4-02", "S4", "An Invoices import file with the old column names imports like a new one",
  [ADMIN, files('is the same, with its two headers renamed to "*Line Title - What are you doing" and "Line Description - Why are you doing it"'),
   SHARED, START_IMPORT],
  ["Upload file A.", "Upload file B."] + FIND,
  [[OK_MSG], [OK_MSG, NO_MISSING]] + FOUND,
  ["S4-R3", "S4-R5", "KD-11", DEV_OK, WHERE], design=NOBOARD)

C("S4-03", "S4", "The Invoices import template keeps every other column and the column order",
  [ADMIN, "Have a copy of the Invoices import template downloaded before this release, the old template, so its headers can be compared.",
   SHEETS, START_IMPORT],
  ["Click Download template.", "Open the downloaded template in Google Sheets.", "Open the old template in Google Sheets."],
  [["A template file downloads."],
   ["Its header row has 24 columns; column 16 reads \"*Line Title\" and column 17 reads \"Line Description\"."],
   ["The old template's header row also has 24 columns.",
    "Column by column, every header has the same name in the same position in both files, except two: column 16 (\"*Line Title\", was "
    "\"*Line Title - What are you doing\") and column 17 (\"Line Description\", was \"Line Description - Why are you doing it\")."]],
  ["S4-R7", "S4-R2", "ASSUME-1",
   ("TECH", "Tech plan, Phase 4", "Only those two tokens change; the other 22 columns and the order stay byte-identical"),
   ("TECH", "Tech plan, D4", "In WorkOrderHistorical/ImportCommandHandler, REQUIRED_HEADERS slots 15/16 become '*Line Title' / 'Line Description'")],
  design=NOBOARD,
  claude=["Slots 15/16 are counted from 0 in the code: they are columns 16 and 17 (P and Q) in a spreadsheet. An old template can come "
          "from production while it still lists \"Line Title - What are you doing\", or from the QA lead's saved files."])

C("S4-04", "S4", "The Invoices import template has the headers *Line Title and Line Description",
  [ADMIN, SHEETS, START_IMPORT],
  ["Click Download template.", "Open the downloaded template in Google Sheets.", "Search the header row for \"What are you doing\"."],
  [["A template file downloads."],
   ["Right after *Item the header row has \"*Line Title\" and then \"Line Description\" (columns 16 and 17, P and Q), followed by Tech Story."],
   ["\"What are you doing\" is not found in the header row, and neither is \"Why are you doing it\"; \"*Line Title\" is still there."]],
  ["S4-R2", "S4-R6", ("JIRA", "SV-10133, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing)",
                      "Download template: the header has \"*Line Title,Line Description\"; every other column and the order are unchanged.")],
  design=NOBOARD)

C("S4-05", "S4", "An Invoices import file mixing an old and a new column name imports",
  [ADMIN, files('has the headers "*Line Title - What are you doing" (old) and "Line Description" (new)',
                'has the headers "*Line Title" (new) and "Line Description - Why are you doing it" (old)'), SHARED, START_IMPORT],
  ["Upload file A.", "Upload file B."] + FIND,
  [[OK_MSG, NO_MISSING], [OK_MSG, NO_MISSING]] + FOUND,
  ["S4-R4", "S4-R5", "S4-R3", WHERE], design=NOBOARD)

C("S4-06", "S4", "An Invoices import file with Line Title and Line Description swapped is rejected",
  [ADMIN, "Create an import file for this test, file A, from the downloaded Invoices import template, with one Labor row, *Line Title "
   "\"Replace tie rod\" and Line Description \"excessive play\", then swap columns 16 and 17, header and value, so Line Description comes first.",
   START_IMPORT],
  ["Upload file A."],
  [REJECT],
  ["S4-R7", "S4-N1", ("TECH", "Tech plan, Phase 2 tests", "legacy title header placed in slot 16 → rejected"), DEV_REJECT],
  design=NOBOARD)

C("S4-07", "S4", "An Invoices import file with an unknown column name is rejected",
  [ADMIN, "Create an import file for this test, file A, from the downloaded Invoices import template, with one Labor row, *Line Title "
   "\"Replace tie rod\" and Line Description \"excessive play\", then change its column 16 header to \"*Line Name\".", START_IMPORT],
  ["Upload file A."],
  [REJECT],
  ["S4-N1", DEV_REJECT], design=NOBOARD)

C("S4-08", "S4", "Old column names in other capitals or with spaces around them still import",
  [ADMIN, files('is the same, with its two headers changed to " Line Description - Why are you doing it " (a space before and after) in column 17 and "*line title - WHAT ARE YOU DOING" in column 16'),
   SHARED, START_IMPORT],
  ["Upload file A.", "Upload file B."] + FIND,
  [[OK_MSG], [OK_MSG, NO_MISSING]] + FOUND,
  ["S4-R3", "S4-R5", ("JIRA", "SV-10133, Nemanja Djuric, 19 Oct 2026 (QA update, PRD v14)",
                      "Old column names in any capitals, or with spaces around them (for example \"*line title - WHAT ARE YOU DOING\" or \" Line Description - Why are you doing it \"), import the same as the new names (S4-R3)."), WHERE],
  design=NOBOARD)
