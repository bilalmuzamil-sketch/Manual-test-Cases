"""Shared plain precondition bullets and step strings for the What/Why cases (tester text: what to set up, never how).
Screen words come from PRD v15, the design boards ("New Line - after", "Edit Line - after": AI SHOPCOACH LINE BUILDER, Title, Description,
Technicians, Add Technician, Labor Rate, Estimated Time, Tech Time, Save & Add Part, Save & Add Line, Save & Close, Status, SHOPCOACH
LABOR GUIDE, Delete), the developers' QA notes in Jira (Build Lines, ItemDescription, "Restricted", "All invoices have been imported
successfully.", "Invalid file headers provided!", "Failed to import all invoices.", Work Orders → All → Status → Imported, List view)
and labels observed on other suites (Settings → Work Orders tab → Require Tech Story; Settings sidebar → Data Import → Invoices;
Reports → Export Reports → "Export Report" dialog → Report Name; Reports → QB Unexported). Labels no source confirms are listed in
PHASE-A-HANDOFF.md §7 for the build verification session."""
import wwlib as L

ADMIN = "Sign in as an Admin at the test location."
TECH_ON = "Make sure Require Tech Story is on (Settings, then the Work Orders tab)."
TECH_OFF = "Make sure Require Tech Story is off (Settings, then the Work Orders tab)."
SHEETS = "Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly."
START_LINES = "Start on work order 1, on its Lines tab."
START_EXPORT = "Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open."
QBO = "Use a test location whose QuickBooks Online connection is active, linked to a QuickBooks sandbox company you can sign in to."
QBO_TAB = "Keep the QuickBooks sandbox company open in a second browser tab."
NEW_LINE = "Click New Line."
SAVE_CLOSE = "Click Save & Close."
CLICK_LINE1 = "Click line 1's title."
PICK_CI = "Pick Customer Invoice in the Report Name list."
TODAY = "Set the date range to today."
DOWNLOAD = "Click Download."
OPEN_SHEET = "Open the downloaded file in Google Sheets."
LEN = "In an empty cell, enter =LEN() with line 1's ItemDescription cell inside the brackets."
REPORT = [PICK_CI, TODAY, DOWNLOAD]
R_PICK = "Customer Invoice is picked in Report Name."
R_TODAY = "The date range shows today's date."
R_DOWNLOAD = "A Customer Invoice file downloads."

T1, D1, N1 = "Replace tie rod", "excessive play", "Both outer ends worn, replaced and aligned"   # the PRD's own example line (S3-R1)

def wo_line(title=T1, desc=D1, extra=""):
    """'Create a work order for this test, work order 1, with one labor line, line 1, titled "…" with the description "…".'"""
    d = f' with the description "{desc}"' if desc else " with no description"
    return f'Create a work order for this test, work order 1, with one labor line, line 1, titled "{title}"{d}{extra}.'

def invoiced(story=None, when="today"):
    s = (f'Have line 1 completed with the tech story "{story}"' if story else "Have line 1 completed with no tech story")
    return s + f", and work order 1 completed and invoiced {when} as invoice A."

def cell(text):
    return f'In line 1\'s row (work order 1\'s invoice A) the ItemDescription cell reads exactly "{text}".'

def count(text):
    """The =LEN result with the arithmetic shown, from the joined text's own segments."""
    return f"The cell shows {len(text)}."

def nbsp(s): return s

# the design's own words (checked verbatim against the board files and canvas notes by wwlib.check)
def words(stem, start, end=None):
    t = L.BOARD_TEXT[stem]
    i = t.find(start)
    if i < 0: raise KeyError(f"{start!r} not on board {stem}")
    j = t.find(end, i) + len(end) if end else len(t)
    return t[i:j]
def note(start):
    for n in L.CANVAS["annotations"]:
        if L.ws(n["text"]).startswith(start): return L.ws(n["text"])
    raise KeyError(start)
