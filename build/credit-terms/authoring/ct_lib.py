"""Credit terms — case model, quote lookup, checks and TestRail rendering (23 Oct 2026).
Pattern: build/ar-ap-report-sorting/authoring/ar_lib.py (newest library, 22 Oct 2026). Shape: Rule 117 with all twelve amendments
(two-audience preconditions, {placeholders} with a "For example:" second line, one action per step (Rule 135), one "Step N:" result per
step, "Exact quotes from the source (for reproducibility)" with a "From:" line per document, the build line, "References from Design"
(a hook only: the design pass adds the pictures and the design's own words), the AUTOMATION line last).
Every expected result comes from a verbatim PRD v3 sentence (Rules 57, 113). No build and no tech plan yet."""
import os, re, html, json
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)

def ws(s): return re.sub(r"\s+", " ", html.unescape(s).replace("**", "").replace("\\", "")).strip()

def md_to_text(md):
    """Plain lines: no ** or \\, links reduced to their words, headings unmarked, one table cell per line."""
    out = []
    for line in md.split("\n"):
        t = line.replace("\\", "")
        t = re.sub(r"^>\s*", "", t)
        t = t.replace("**", "")
        t = re.sub(r"(?<![\w*])\*(\S[^*]*?)\*(?![\w*])", r"\1", t)
        t = t.replace("`", "")
        t = re.sub(r"\[([^\]]*)\]\(([^)]*)\)", r"\1", t)
        t = re.sub(r"<[^>]+>", "", t)
        t = re.sub(r"^#+\s*", "", t)
        if t.startswith("|"):
            out += [x.strip() for x in t.strip().strip("|").split("|") if x.strip() and not re.fullmatch(r"-+", x.strip())]
        else: out.append(t)
    return "\n".join(out)

PRD_FILE = f"{P}/sources/CONFLUENCE-963346440-v3-2026-10-23.md"
PRD_MD = open(PRD_FILE).read().split("<!-- Saved")[0]
PRD_TXT = md_to_text(PRD_MD)
PRDW = ws(PRD_TXT)
PRD_RAWW = ws(re.sub(r"<[^>]+>", "", re.sub(r"\[([^\]]*)\]\(([^)]*)\)", r"\1", PRD_MD)))   # keeps table rows "a | b | c"
JIRA_FILE = f"{P}/sources/JIRA-SV-11638-stories-2026-10-23.md"
JIRAW = ws(open(JIRA_FILE).read())

PRD_NAME = 'PRD "Credit terms", Confluence 963346440, version 3 (22 Oct 2026, "Renamed to Credit terms", Chris Ward)'
PRD_READ = "read 23 Oct 2026"

# ---- PRD v5 (28 Oct 2026, QA lead: "Named set", Rule 122 amendment). Only the cases in NAMED_SET and the new cases quote v5 and say
# "version 5" on their From line; every other case keeps its live text, whose v3 quotes are word for word the same in v5 (checked by
# verify_v5_named_set.py), so its From line keeps version 3. Pattern: build/founder-mode/what-why/authoring/wwlib.py (NAMED_SET / on_v16).
# The Change Log (section 9) is never a source of a quote: it is cut off before matching.
PRD5_FILE = f"{P}/sources/CONFLUENCE-963346440-v5-2026-10-28.md"
PRD5_MD = open(PRD5_FILE).read().split("## 9. Change Log")[0]
PRD5_TXT = md_to_text(PRD5_MD)
PRD5W = ws(PRD5_TXT)
PRD5_RAWW = ws(re.sub(r"<[^>]+>", "", re.sub(r"\[([^\]]*)\]\(([^)]*)\)", r"\1", PRD5_MD)))
PRD5_NAME = 'PRD "Credit terms", Confluence 963346440, version 5 (26 Oct 2026, Chris Ward)'
PRD5_READ = "read 28 Oct 2026"
NAMED_SET = {"S2-30", "S2-31", "S2-32", "S2-33", "S2-34", "S10-12", "S10-16",   # A: their v3 quote is no longer word for word in v5
             "S10-08",                                                          # B: checked against v5 S10-E3 and S10-R8
             "S2-36"}                                                           # C: released, v5 S2 Error Handling settles question 3
import csv as _csv
MAPPED = {r["key"] for r in _csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
def on_v5(c):
    """A case in the named set, or a new case (no C-id yet), quotes PRD v5."""
    return c["key"] in NAMED_SET or c["key"] not in MAPPED
EPIC = "SV-11638"
DESIGN_URL = "https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf"
SETUP_URL = ("https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/"
             "credit-terms/CREDIT-TERMS-SETUP-FILE.md")
NOBUILD = "The build is not yet available to check this case against."
MARKER = "AUTOMATION: HOLD - not yet build-verified (no build yet)"
BLOCKED = 'If any record above is missing, mark this test Blocked: "setup not done".'
# 26 Oct 2026, Rule 117 fifteenth amendment (QA lead: "B -> and never add that line in the future test cases too"): no case carries
# the Blocked line or any variant. BLOCKED stays defined only so older pass reports can name it; C() no longer appends it.
DESIGN_HOLD = "AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO"
CLEAN_HOLD = "AUTOMATION: HOLD - needs a test organization holding only ZZAUTOTEST records (the shared test site holds other terms and customers)"
def PO_HOLD(n): return f"AUTOMATION: HOLD - waiting on the PO (question {n})"
def HOLD(reason): return "AUTOMATION: HOLD - " + reason

# ---- requirement codes (S1-R1 ... S12-E3): the requirement line itself, the FIRST line carrying the code -----------------------
CODE = {}
for line in PRD_TXT.split("\n"):
    m = re.match(r"^\s*-?\s*(S\d+-[RNE]\d+[a-z]?):\s*(.*)$", line)
    if m and m.group(1) not in CODE: CODE[m.group(1)] = m.group(2).strip()

CODE5 = {}
for line in PRD5_TXT.split("\n"):
    m = re.match(r"^\s*-?\s*(S\d+-[RNE]\d+[a-z]?):\s*(.*)$", line)
    if m and m.group(1) not in CODE5: CODE5[m.group(1)] = m.group(2).strip()
if len(CODE5) != 212 or set(CODE) - set(CODE5): raise SystemExit(f"PRD v5 has {len(CODE5)} codes; this library expects 212 (v3's 211 plus S1-R17)")

def prd_line(start):
    for line in PRD_TXT.split("\n"):
        t = re.sub(r"^\s*-\s*", "", line).strip()
        if t.startswith(start): return t
    raise KeyError(start)

def prd_sentence(start, n=1):
    """n sentences of the PRD from `start` (each ends at '. ' ), verbatim."""
    i = PRDW.find(start)
    if i < 0: raise KeyError(start)
    j = i
    for _ in range(n):
        k = PRDW.find(". ", j)
        if k < 0: return PRDW[i:]
        j = k + 2
    return PRDW[i:j - 1]

def raw_row(start):
    """A table row of the PRD as it reads, cells joined by ' | '."""
    for line in PRD_MD.split("\n"):
        if line.startswith("|"):
            cells = [ws(x) for x in line.strip().strip("|").split("|")]
            row = " | ".join(cells)
            if row.startswith(start): return row
    raise KeyError(start)

# ---- named PRD items that carry no code (each covered by a case or listed as not testable with the reason) --------------------
NAMED = {}
def _n(key, label, text): NAMED[key] = (label, text)
# Error Handling paragraphs, story by story
_n("EH-S1", "Story 1, Error Handling", prd_line("If the list cannot be loaded"))
_n("EH-S2", "Story 2, Error Handling", prd_line("If a save is refused, the app's standard error alert shows the reason, using these exact texts"))
_n("EH-S3a", "Story 3, Error Handling", prd_line("If Create or Save is refused by the server"))
_n("EH-S3b", "Story 3, Error Handling", prd_line("On Create, a success toast shows"))
_n("EH-S4a", "Story 4, Error Handling", prd_line("If every ticked customer has left the term before the confirm"))
_n("EH-S4b", "Story 4, Error Handling", prd_line("If the chosen \"Move To\" term was deactivated or deleted meanwhile"))
_n("EH-S4c", "Story 4, Error Handling", prd_line("If the move fails partway"))
_n("EH-S5a", "Story 5, Error Handling", prd_line("If the chosen term was deactivated or deleted after the form opened"))
_n("EH-S5b", "Story 5, Error Handling", prd_line("If a limit above $0 is sent for a COD or Credit Hold customer"))
_n("EH-S6", "Story 6, Error Handling", prd_line("No new messages. Vendor save errors are unchanged."))
_n("EH-S7", "Story 7, Error Handling", prd_line("None. Due-date calculation has no user-facing failure."))
_n("EH-S8", "Story 8, Error Handling", prd_line("If QuickBooks refuses to create the term or the record"))
_n("EH-S9", "Story 9, Error Handling", "None. No new messages.")
_n("EH-S10", "Story 10, Error Handling", prd_line("None new. Import and API errors are unchanged."))
_n("EH-S11", "Story 11, Error Handling", prd_line("None. Release has no user-facing failure path."))
_n("EH-S12", "Story 12, Error Handling", prd_line("If the log cannot be loaded"))
# User Feedback Summary rows (Trigger | Message | Behavior), quoted as the row reads
_ufs = []; _inside = False
for line in PRD_MD.split("\n"):
    if line.startswith("## 8. User Feedback Summary"): _inside = True; continue
    if _inside and line.startswith("## "): break
    if _inside and line.startswith("| ") and not line.startswith("| Trigger"):
        _ufs.append(" | ".join(ws(x) for x in line.strip().strip("|").split("|")))
for i, row in enumerate(_ufs, 1): _n(f"UFS-{i}", "User Feedback Summary", row)
# Key Decisions: the testable sentences
KD = {
 "KD-EXIST": ("Existing organizations keep COD as their default at release; organizations created after release start on Due on Receipt.", 2),
 "KD-NEWONLY": ("A changed default applies to new customers only; moving existing customers is a separate, explicit action (Move Customers).", 1),
 "KD-ANYACTIVE": ("The default can be any active term except Credit Hold.", 1),
 "KD-ONELIST": ("One default and one term list per organization, shared by customers and vendors.", 1),
 "KD-OWNNET": ("The shop's own terms behave like Net terms: Charge Account allowed, invoicing never blocked.", 1),
 "KD-LOCK": ("Once a term is in use (by any customer, vendor or invoice), its name and days are locked; it can be deactivated but not deleted.", 2),
 "KD-DEACT": ("Deactivating a term hides it from the customer and vendor pickers only.", 2),
 "KD-DEFAULT": ("The current default cannot be deactivated or deleted; the action is shown disabled with the reason.", 1),
 "KD-NETDEACT": ("Any other standard term (Net 7 to Net 120) can be deactivated to shorten the pickers.", 1),
 "KD-NAMES": ("Shops name their terms freely; the Due column always shows the rule.", 2),
 "KD-RANGE": ("Net terms run from 1 to 365 days.", 1),
 "KD-TABLE": ("The page is one table with Active and Inactive tabs, the default picked from each row's menu.", 1),
 "KD-THREE": ("COD, Due on Receipt and Credit Hold can never be deactivated.", 1),
 "KD-INLINE": ("The page explains every term inline in a Due column; only COD, Due on Receipt and Credit Hold carry an info tooltip.", 1),
 "KD-CONFIRM": ("Deleting a term asks for confirmation; deactivating, reactivating and making a term the default are confirmed only where the result is not obvious.", 4),
 "KD-LOG": ("Every change on the Credit Terms page is recorded in an organization-wide Credit Terms Log", 1),
 "KD-LENIENT": ("Imports and the Public API stay lenient.", 2),
 "KD-NOFLAG": ("No feature flag.", 2),
 "KD-ZERO": ("COD and Credit Hold customers have a $0 credit limit that cannot be changed, in New Customer", 1),
 "KD-ZERO2": ("The rule applies only to customers created or edited after release:", 1),
 "KD-MOVEZERO": ("Moving customers to COD or Credit Hold sets their credit limits to $0 only after a confirmation, and keeps each previous limit in that customer's note.", 1),
 "KD-MOVEGATE": ("Departure: Move Customers keeps a gate from another area on a Settings page.", 2),
 "KD-MODAL": ("Departure: the New Credit Term and Move Customers windows do not close on Escape or a click outside.", 1),
}
for k, (s, n) in KD.items(): _n(k, "Key Decisions", prd_sentence(s, n))
# Key Decisions, the Permissions paragraph, sentence by sentence
PERM = {
 "PERM-PAGE": "Viewing and using the Credit Terms page (the list, New Credit Term, Edit, Make Default, Deactivate, Reactivate, Delete) is governed by 'Settings → Finance', the same permission as Payment Methods.",
 "PERM-MOVE": "Move Customers additionally needs 'Customers → Create & Edit' and 'View and Manage AP/AR Data', because it changes customer records;",
 "PERM-FIELDS": "The Credit Terms and Credit Limit fields on New Customer and Edit Customer, and the Credit Terms field on New Vendor and Edit Vendor, are governed by 'View and Manage AP/AR Data', as the existing Edit fields are.",
 "PERM-IGNORED": "A user without 'View and Manage AP/AR Data' who creates or edits a customer has any term or limit they send ignored by the server (S5-N4).",
 "PERM-LIST": "The organization's credit term list itself (the terms that fill those dropdowns, and which one is the default) loads for every user in the shop, as today,",
 "PERM-NONEW": "No new permission is introduced.",
 "PERM-SCREEN": "On the Roles & Permissions screen these appear as \"Finance\" (a sub-row under \"Settings\" in the page-access toggles), the \"Customers\" row's \"Create & Edit\" column, and the \"View and Manage AP/AR Data\" cross toggle.",
 "PERM-DEFAULTS": "By default 'Settings → Finance' is on for the Admin profile (required, cannot be turned off), Parts Manager and Office User, and off for Service Manager, Senior Service Advisor, Service Advisor, Foreman, Technician, Parts Technician, Sales Representative and Time Clock User.",
 "PERM-OOTB": "Out of the box, Move Customers is therefore available to Admin, Parts Manager and Office User; Service Manager, Senior Service Advisor and Sales Representative hold 'Customers → Create & Edit' and 'View and Manage AP/AR Data' but not 'Settings → Finance', so they cannot open the Credit Terms page.",
}
for k, s in PERM.items():
    i = PRDW.find(s.rstrip(";,"))
    if i < 0: raise KeyError(k)
    _n(k, "Key Decisions, Permissions", s)
# Terminology rules that change behaviour
TERMS = {
 "T-INUSE": ("In use → A term is in use when", 6),
 "T-INACTIVE": ("Inactive → A deactivated term:", 1),
 "T-COUNTER": ("Counter Sale customer → The organization's built-in walk-in customer", 2),
 "T-MDVSMC": ("Make Default vs Move Customers → Make Default changes only", 3),
 "T-DEFAULT": ("Default (default credit term) → The term a new customer starts on.", 2),
 "T-STANDARD": ("Standard term → One of the twelve terms every organization has:", 1),
 "T-OWN": ("The shop's own term → A term the shop created on the Credit Terms page", 1),
 "T-CREDIT": ("Credit term → The term on a customer or vendor", 3),
 "T-VI": ("Vendor invoice → The app's word for a bill received from a vendor.", 2),
 "T-VOCAB": ("Vocabulary. This PRD uses the frontend vocabulary:", 2),
}
for k, (s, n) in TERMS.items(): _n(k, "Terminology", prd_sentence(s, n))
# Assumptions
_n("A-1500", "Assumptions", prd_sentence("A single term can hold more than 1,500 customers", 1))
_n("A-SPELL", "Assumptions", prd_sentence("Stored customer and vendor terms carry inconsistent spellings", 1))
_n("A-DESK", "Assumptions", prd_sentence("The person using the Credit Terms page is an office or admin user at a desktop", 1))
# Goals
GOALS = ["A user with 'Settings → Finance' can set the default term", "A shop can create a \"Net X days\" or \"day of the following month\" term",
         "Creating a customer on a non-default term takes zero extra screens", "Moving any number of customers from one term to another takes one window",
         "The Over Credit warning never appears for a customer on COD", "With no setup at all, existing shops behave exactly as before release"]
for i, s in enumerate(GOALS, 1): _n(f"GOAL-{i}", "Goals", prd_line(s))
# Out of Scope (13 bullets)
OOS = ["A separate default term for new vendors.", "Merging with AccountingHub's own Payment Terms list.", "Early-payment discount terms",
       "Per-location or per-work-type default terms.", "Updating the customer's term inside QuickBooks", "Renaming or changing the days of a term in use.",
       "Editing, renaming or deleting the twelve standard terms.", "A finer-grained permission to stop users editing a customer's sales rep.",
       "Vendor credit limits.", "Statements, the customer portal and A/R aging", "A bulk term change from the Customers list.",
       "A change history for single customers and vendors.", "Release notes.", "AccountingHub and IBS"]
for i, s in enumerate(OOS, 1): _n(f"OOS-{i}", "Out of Scope", prd_line(s))
# Feature Overview bullets quoted where a case needs them
_n("FO-DESIGN", "Feature Overview, Design coverage", prd_line("Design coverage: States with no board"))
_n("FO-VENDOR-COD", "Feature Overview", prd_line("Customers and vendors share one term list."))
# Sub-bullets and table rows that sit under a requirement code
SUB = {
 "S1-R7 COD": ("S1-R7, COD", prd_line("COD: \"Paid when the invoice is created\"")),
 "S1-R7 DOR": ("S1-R7, Due on Receipt", prd_line("Due on Receipt: \"Due on the invoice date\"")),
 "S1-R7 CH": ("S1-R7, Credit Hold", prd_line("Credit Hold: \"Invoicing is blocked\"")),
 "S1-R7 NET": ("S1-R7, a Net term", prd_line("A Net term: \"{X} days after the invoice date\"")),
 "S1-R7 DAY": ("S1-R7, a day of the following month term", prd_line("A \"day of the following month\" term: \"{ordinal day} of the following month\"")),
 "S1-R8 COD": ("S1-R8, COD info icon", prd_line("COD: \"Cash on delivery.")),
 "S1-R8 DOR": ("S1-R8, Due on Receipt info icon", prd_line("Due on Receipt: \"Payment is due on the invoice date.")),
 "S1-R8 CH": ("S1-R8, Credit Hold info icon", prd_line("Credit Hold: \"No invoices can be created")),
 "S2-R1 HEAD": ("S2-R1 table, header row", raw_row("Item (icon)")),
 "S2-R1 EDIT": ("S2-R1 table, Edit row", raw_row("\"Edit\" (pencil)")),
 "S2-R1 MD": ("S2-R1 table, Make Default row", raw_row("\"Make Default for New Customers\" (circle check)")),
 "S2-R1 MOVE": ("S2-R1 table, Move Customers row", raw_row("\"Move Customers\" (person)")),
 "S2-R1 DEACT": ("S2-R1 table, Deactivate row", raw_row("\"Deactivate\" (archive)")),
 "S2-R1 REACT": ("S2-R1 table, Reactivate row", raw_row("\"Reactivate\" (rotate)")),
 "S2-R1 DEL": ("S2-R1 table, Delete Credit Term row", raw_row("\"Delete Credit Term\" (trash, red, last, below a divider)")),
 "S3-R2 NAME": ("S3-R2, Name", prd_line("Name (required), focused on open")),
 "S3-R2 OPTS": ("S3-R2, the two options", prd_line("Two options, one chosen at a time:")),
 "S3-R5 NET": ("S3-R5, Net line", prd_line("Net: \"{Name} means payment is due {X} days")),
 "S3-R5 DAY": ("S3-R5, day of the following month line", prd_line("Day of the following month: \"{Name} means payment is due on the {ordinal X}")),
 "S3-R5 EMPTY": ("S3-R5, empty name and dates", prd_line("With the Name empty, \"{Name}\" reads \"This term\".")),
 "S3-R9 EMPTY": ("S3-R9, Name empty", prd_line("Name empty: \"Enter a name.\"")),
 "S3-R9 LONG": ("S3-R9, 31 characters", prd_line("The Name field stops accepting characters after the 31st.")),
 "S3-R9 STD": ("S3-R9, a standard term's name", prd_line("Name matches a standard term ignoring capitals and spaces")),
 "S3-R9 DUP": ("S3-R9, another of the shop's terms", prd_line("Name matches another of the shop's terms")),
 "S3-R9 DAYS": ("S3-R9, Days", prd_line("Days not a whole number from 1 to 365")),
 "S3-R9 DAY": ("S3-R9, Day", prd_line("Day not a whole number from 1 to 31")),
 "S12-R3 HEAD": ("S12-R3 table, header row", raw_row("Change | Event | Details")),
 "S12-R3 CREATED": ("S12-R3 table, created", raw_row("A term is created")),
 "S12-R3 EDITED": ("S12-R3 table, edited", raw_row("An unused term is edited")),
 "S12-R3 DEACT": ("S12-R3 table, deactivated", raw_row("A term is deactivated")),
 "S12-R3 REACT": ("S12-R3 table, reactivated", raw_row("A term is reactivated")),
 "S12-R3 DEL": ("S12-R3 table, deleted", raw_row("A term is deleted")),
 "S12-R3 DEF": ("S12-R3 table, default changed", raw_row("The default is changed")),
 "S12-R3 MOVED": ("S12-R3 table, customers moved", raw_row("Customers are moved")),
}

# ---- the same named items and sub-items as PRD v5 has them: an item still word for word in v5 is kept; an item v5 changed (Story 2
# Error Handling gained two texts on 26 Oct 2026) is re-copied from the v5 line that starts the same way. Nothing else differs.
def _v5_line(text):
    head = ws(text)[:60]
    hits = [ws(re.sub(r"^\s*-\s*", "", l)) for l in PRD5_TXT.split("\n") if ws(re.sub(r"^\s*-\s*", "", l)).startswith(head)]
    if len(hits) != 1: raise SystemExit(f"PRD v5: {len(hits)} lines start like {head!r}")
    return hits[0]
def _in_v5(t): return ws(t) in PRD5W or ws(t) in PRD5_RAWW
NAMED5 = {k: (lab, t if _in_v5(t) else _v5_line(t)) for k, (lab, t) in NAMED.items()}
NAMED5_CHANGED = sorted(k for k in NAMED if NAMED5[k][1] != NAMED[k][1])
if NAMED5_CHANGED != ["EH-S2"]: raise SystemExit(f"named items that differ in v5: {NAMED5_CHANGED} (expected only EH-S2)")
for _k, (_l, _t) in SUB.items():
    if not _in_v5(_t): raise SystemExit(f"sub-item {_k} is not word for word in PRD v5")
# v5 codes with no manual case, with the reason (coverage gate in build.py; REPORT.md)
NO_MANUAL_REASON = {
 "S1-R17": ("No manual case: the under-1-second page-load target needs the test organization's size (section 6: more than 1,500 "
            "customers on one term) and a timer, which a manual tester does not have; left to the developers' performance check "
            "(engineering plan NFR-1)"),
}

# Items that cannot be turned into a check a tester can run, with the reason (Rule 64: stated, never silently dropped)
NOT_TESTABLE = {
 "EH-S7": "States that due-date calculation has no failure path; there is nothing to trigger. The due-date cases (S7, DATA) cover the behaviour.",
 "EH-S11": "States that release has no failure path; nothing to trigger. The release-day cases (S11) cover the behaviour.",
 "T-VOCAB": "Vocabulary note mapping screen words to back-end words; no behaviour.",
 "A-DESK": "Describes who uses the page (desktop office user); the page cases run in a desktop browser. No separate check.",
 "OOS-8": "A permission that is not built in this release and has no screen; there is nothing a tester can look for.",
 "OOS-13": "Release notes are not part of this PRD; nothing to test.",
 "FO-DESIGN": "Says which states have no design board; it is a note for the design pass, not a behaviour. Each such state is covered by its own case quoting the PRD text.",
 "T-CREDIT": "Defines the word; the AccountingHub Payment Terms list check is OOS-2's case.",
}

# 26 Oct 2026 (QA lead's order): 10 cases deleted from TestRail because a manual tester cannot set them up (snapshots in
# build/tester-readthrough-2026-10-26/deleted/). The requirement each covered: another remaining case, or this exclusion (the coverage gate
# in build.py accepts it; render_outputs.py prints it in REPORT.md).
DELETED_CASES = {"S1-27": "C723891", "S1-28": "C723892", "S2-35": "C723935", "S3-27": "C723963", "S3-28": "C723964", "S4-30": "C723994",
                 "S4-34": "C723998", "S5-23": "C724023", "S5-25": "C724025", "S12-19": "C724126",
                 "S12-18": "C724125", "D-38": "C724185"}  # the last two deleted later on 26 Oct 2026 ("1. Do it")
DELETED_MSG = ("No manual case: deleted 26 Oct 2026 on the QA lead's order (a manual tester cannot set it up); "
               "left to the developers' own checks")
NO_MANUAL = {"S1-E3": "S1-27", "EH-S1": "S1-28", "UFS-1": "S1-28", "UFS-31": "S2-35", "UFS-21": "S3-27", "UFS-26": "S3-28",
             "EH-S4c": "S4-34", "UFS-38": "S4-34", "S5-E3": "S5-23", "EH-S5b": "S5-25", "UFS-45": "S5-25", "EH-S12": "S12-19",
             "S12-N1": "S12-18", "UFS-51": "D-38"}

STORY = {1: ("SV-11670", "Story 1, Credit Terms page and list"), 2: ("SV-11671", "Story 2, Row menu actions"),
         3: ("SV-11672", "Story 3, Create or edit a credit term"), 4: ("SV-11673", "Story 4, Move Customers"),
         5: ("SV-11674", "Story 5, New Customer and Edit Customer"), 6: ("SV-11675", "Story 6, Vendors"),
         7: ("SV-11676", "Story 7, Due dates"), 8: ("SV-11677", "Story 8, QuickBooks sync - credit terms"),
         9: ("SV-11678", "Story 9, Over Credit warning"), 10: ("SV-11679", "Story 10, Imports and Public API"),
         11: ("SV-11680", "Story 11, Release day: what changes for existing users"), 12: ("SV-11681", "Story 12, Credit Terms audit log")}
DESIGN_PAGES = {1: ['"1 List and row menus"', '"3 New credit term and Inactive tab"', '"4 Everything deactivated and an empty tab"'],
                2: ['"1 List and row menus"', '"3 New credit term and Inactive tab"', '"4 Everything deactivated and an empty tab"'],
                3: ['"3 New credit term and Inactive tab"'], 4: ['"2 Move customers to another term"'],
                5: ['"5 New Customer"', '"6 Customer on a deactivated term"'], 6: ['"7 Vendors"'], 7: ['"9 Invoice due date"'], 8: [],
                9: ['"8 Over Credit warning"'], 10: [], 11: ['"1 List and row menus"', '"5 New Customer"', '"8 Over Credit warning"'],
                12: ['"1 List and row menus"']}
NAMED_STORY = {"EH-S1": 1, "EH-S2": 2, "EH-S3a": 3, "EH-S3b": 3, "EH-S4a": 4, "EH-S4b": 4, "EH-S4c": 4, "EH-S5a": 5, "EH-S5b": 5, "EH-S6": 6,
               "EH-S8": 8, "EH-S9": 9, "EH-S10": 10, "EH-S12": 12}

# Rule 117 thirteenth amendment (QA lead, 26 Oct 2026): every case's Preconditions open with one "Scenario:" line (scenarios.py)
from scenarios import SCEN
import relevance as RELEVANCE
import readthrough as READTHROUGH   # 26 Oct 2026 tester read-through (build/tester-readthrough-2026-10-26/)
SCENARIO = "Scenario: "
CASES = []
def C(key, sec, title, pre, steps, res, q, stories=None, note="", marker=None, api=False):
    """pre: list of str or (state, example). res: one 'Step N:' line per step. q: PRD codes, NAMED keys, SUB keys or ('label', 'verbatim').
    api: True for a case whose steps send a Public API request (Rule 4: placed in a section titled with 'API')."""
    pre = [p if isinstance(p, tuple) else (p, None) for p in pre]
    pre, note = RELEVANCE.apply(key, pre, note, steps, res)   # 26 Oct 2026 relevance and independence pass (relevance.py)
    q = list(q) + READTHROUGH.ADD_Q.get(key, [])   # 26 Oct 2026 tester read-through: a control backed by a PRD sentence (check 3)
    steps, res = fold_reads(steps, res)
    res = [visible(r, steps[i] if i < len(steps) else "") for i, r in enumerate(res)]
    clean = marker == CLEAN_HOLD  # the setup file's P-CLEAN recipe applies (the case needs a shop holding only its own records)
    if marker == CLEAN_HOLD:  # 26 Oct 2026 (QA lead): the set-aside organization is the tester's precondition, not a hold
        marker = None  # 26 Oct 2026 (QA lead): "Simply say what is needed" — each case's own preconditions state the state it needs
    CASES.append(dict(key=key, sec=sec, title=title, scen=SCEN.get(key, ""), pre=pre, steps=steps, res=res, q=q,
                      stories=stories, note=note, marker=marker or MARKER, api=api, clean=clean))

TRIVIAL = [
 (r"^the name is typed\.$", "the field shows the name as typed."),
 (r"^the customer is picked\.$", "the window shows {Customer-A} as the customer."),
 (r"^the toast shows\.$", "a green success toast shows."),
 (r"^the customer is created\.$", "the window closes and the new customer is saved."),
 (r"^it has synced\.$", "the invoice is no longer on the QB Unexported report."),
 (r"^both have synced\.$", "neither invoice is on the QB Unexported report."),
 (r"^the invoice has synced\.$", "the invoice is no longer on the QB Unexported report."),
 (r"^the request succeeds\.$", "the request is accepted (no error comes back)."),
 (r"^the request succeeds \(it is not refused\)\.$", "the request is accepted (it is not refused)."),
 (r"^the blue line shows\.$", "the blue information line shows below the options."),
 (r"^the name is empty\.$", "the Name field is empty."),
 (r"^the invoice stays\.$", "the invoice is still listed on the Finance tab."),
 (r"^it closes\.$", "the confirmation closes."),
 (r"^the day option is chosen\.$", 'the "Due day of the following month" option is selected.'),
 (r"^(Net \d+|\{Term-[A-Z]\}|COD|Credit Hold) is chosen\.$", r"the dropdown shows \1."),
 (r"^(Net \d+|\{Term-[A-Z]\}) is selected\.$", r"the dropdown shows \1."),
 (r"^the vendor is on (Net \d+|Credit Hold)\.$", r"the window closes and the vendor is saved on \1."),
 (r"^the customer is on (Net \d+|\{Term-[A-Z]\})\.$", r"the window closes and the customer is saved on \1."),
]
def visible(r, step):
    """Replace a result that only restates the action with what the tester sees (coordinator review, 23 Oct 2026)."""
    m = re.match(r"^(Step \d+: )(.*)$", r)
    if not m: return r
    body = m.group(2)
    for pat, rep in TRIVIAL:
        if re.match(pat, body):
            if "{Customer-A}" in rep and "{Customer-A}" not in step: rep = "the window shows the picked customer."
            body = re.sub(pat, rep, body); break
    return m.group(1) + body

READ_ONLY = re.compile(r"^(Look at|Read|Find|Without clicking)\b(?!.*\b(export|file)\b)")
def fold_reads(steps, res):
    """Rule 136 5(a): a step that only reads what the previous action produced is folded into that action's result."""
    if len(steps) != len(res): return steps, res
    body = [re.sub(r"^Step \d+: ", "", r) for r in res]
    st, bd = [], []
    for s_, b_ in zip(steps, body):
        if st and READ_ONLY.match(s_):
            bd[-1] = bd[-1].rstrip() + " " + b_[0].upper() + b_[1:]
        else:
            st.append(s_); bd.append(b_)
    return st, [f"Step {i}: {b}" for i, b in enumerate(bd, 1)]

def quotes(c):
    out = []
    v5 = on_v5(c)
    codes, named = (CODE5, NAMED5) if v5 else (CODE, NAMED)
    for x in c["q"]:
        if isinstance(x, tuple): out.append(x)
        elif x in codes: out.append((x, codes[x]))
        elif x in named: out.append(named[x])
        elif x in SUB: out.append(SUB[x])
        else: raise KeyError(f"{c['key']}: unknown quote key {x}")
    return out

def codes_of(c):
    out = set()
    for x in c["q"]:
        if isinstance(x, str):
            out.add(x.split(" ")[0] if x in SUB else x)
            if x in SUB: out.add(x)
    return out

def story_nums(c):
    if c["stories"]: return c["stories"]
    s = set()
    for k in codes_of(c):
        m = re.match(r"S(\d+)-", k)
        if m: s.add(int(m.group(1)))
        elif k in NAMED_STORY: s.add(NAMED_STORY[k])
    return sorted(s) or [11]

e = lambda s: html.escape(s, quote=False)

DESIGN_IMAGES = f"{P}/design-2026-10-23/images"
try:
    from design_refs import DREFS            # written by the design worker: key -> {"pages": [...], "pictures": [...], "words": [...]}
except ImportError:
    DREFS = {}

def design_block(c):
    """Rule 117 tenth amendment: design references in their own block below the quotes. With a DREFS entry (design pass): the pages used,
    the pictures attached to this case (readable file names in design-2026-10-23/images/) and the design's own words, quoted. Without one:
    the canvas pages the PRD names for the story, and a note that the design pass adds the pictures."""
    d = DREFS.get(c["key"])
    h = "<p></p><p><strong>References from Design</strong></p>"
    if d:
        pages = d.get("pages") or []
        t = (f'Design canvas "Default Credit Terms" ({DESIGN_URL}), read 23 Oct 2026: ' + (", ".join(pages) if pages else "no page") +
             ". Compare the screen with the pictures below; the expected results above come from the PRD quotes" +
             (", except where this held design case follows the design." if c["sec"] == "DESIGN" else "."))
        h += "<p>" + e(t) + "</p>"
        if d.get("pictures"):
            h += "<p>Design pictures attached to this case:</p><ul>" + "".join(f"<li>{e(x)}</li>" for x in d["pictures"]) + "</ul>"
        if d.get("words"):
            h += "<p>The design's own words:</p><ul>" + "".join(f"<li>&ldquo;{e(w)}&rdquo;</li>" for w in d["words"]) + "</ul>"
        return h + "<p></p>"
    pages = []
    for n in story_nums(c): pages += [p for p in DESIGN_PAGES[n] if p not in pages]
    where = ("canvas pages " + ", ".join(pages) + " (the pages the PRD names for this story)") if pages else \
            "no canvas page (the PRD says this story has no new screens)"
    t = (f'Design canvas "Default Credit Terms" ({DESIGN_URL}): {where}. The design (read in full on 23 Oct 2026) does not draw '
         "this case\'s screen or state, so no design picture is attached; the expected results above come from the PRD.")
    return h + "<p>" + e(t) + "</p><p></p>"

def quotes_block(c):
    prd, jira = [], []
    for l, t in quotes(c): (jira if l.startswith("Jira SV-") else prd).append((l, t))
    sto = ", ".join(f"story {STORY[n][0]} ({STORY[n][1]})" for n in story_nums(c))
    h = "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
    first = True
    for name, group in ((PRD_NAME, prd), ("Jira stories under epic SV-11638 (saved 23 Oct 2026, sources/JIRA-SV-11638-stories-2026-10-23.md)", jira)):
        if not group: continue
        read = PRD_READ
        if name == PRD_NAME and on_v5(c): name, read = PRD5_NAME, PRD5_READ
        h += f"<p>From: {e(name)}, {read}" + (f" &middot; Epic {EPIC}, {e(sto)}" if first else "") + "</p>"
        h += "<ul>" + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(t)}&rdquo;</li>" for l, t in group) + "</ul>"
        first = False
    return h + f"<p>{e(NOBUILD)}</p>"

def render_scenario(c):
    """The layout before 26 Oct 2026 (Scenario line, {placeholders}, "For example:" lines). Kept only so the pass report can show old vs new."""
    pre = (f'<p><strong><a href="{SETUP_URL}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
           "<p><strong>Preconditions</strong></p><ul>" + f"<li>{SCENARIO}{e(c['scen'])}</li>" + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in c["pre"]) + "</ul>")
    exp = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(r)}</li>" for r in c["res"]) + "</ul>"
           + (f"<p>{e(c['note'])}</p>" if c["note"] else "")
           + quotes_block(c) + design_block(c) + f"<p>{e(c['marker'])}</p>")
    refs = ",".join(dict.fromkeys(STORY[n][0] for n in story_nums(c)))
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": refs, "custom_automation_type": 2,
            "custom_atmstatus": 1, "custom_preconds": pre, "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in c["steps"]) + "</ol>",
            "custom_expected": exp}

import pattern as PAT
def render(c):
    """The QA lead's pattern (Rule 117 fourteenth amendment, 26 Oct 2026): plain precondition bullets (no Blocked line, fifteenth amendment), plain steps,
    "Expected Result" with "Step N:" and one bullet per fact, a blank paragraph, then the note, the exact quotes with their From lines,
    References from Design and the AUTOMATION line, exactly as before."""
    p = READTHROUGH.apply(c, PAT.pattern_case(c, BLOCKED))   # tester read-through fixes, 26 Oct 2026 (readthrough.py)
    pre = "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(x)}</li>" for x in p["pre"]) + "</ul>"
    exp = ("<p><strong>Expected Result</strong></p>"
           + "".join(f"<p>Step {i}:</p><ul>" + "".join(f"<li>{e(x)}</li>" for x in r) + "</ul>" for i, r in enumerate(p["results"], 1))
           + "<p></p>"
           + (f"<p>{e(p['note'])}</p>" if p["note"] else "")
           + quotes_block(c) + design_block(c) + f"<p>{e(c['marker'])}</p>")
    refs = ",".join(dict.fromkeys(STORY[n][0] for n in story_nums(c)))
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": refs, "custom_automation_type": 2,
            "custom_atmstatus": 1, "custom_preconds": pre, "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in p["steps"]) + "</ol>",
            "custom_expected": exp}

PH = re.compile(r"\{([A-Z][A-Za-z]*(?:-[A-Za-z]+)*-[A-Z0-9])\}")
JARGON = re.compile(r"\b(API|HTTP|endpoint|database|devtools|DevTools|console|SQL|query string|JSON)\b")
VERBS = r"(click|clicks|open|opens|select|choose|type|enter|press|tick|untick|hover|save|close|clear|switch|sign|reload|refresh|pick|set|change|delete|create|move|deactivate|reactivate|go|scroll|drag|import|upload|send|log|wait|edit|cancel|confirm)"
TWO = re.compile(r"\b" + VERBS + r"\b[^.]*?(,\s*then\s+|\s+and\s+then\s+|\s+then\s+|\s+and\s+)" + VERBS + r"\b", re.I)
ALLOW_AND = re.compile(r"(Create & Edit|Select All|Select None|Search|Save Changes|Save & Close|Set Limits)", re.I)
def two_actions(step):
    """Rule 135 heuristic: two action verbs joined by 'and' / 'then' in one step, or two sentences each starting with an action verb."""
    s = ALLOW_AND.sub("X", step)
    s = re.sub(r'"[^"]*"', '"Q"', s)            # quoted labels and typed text never count as actions
    s = re.sub(r"\([^)]*\)", "", s)
    if TWO.search(s): return True
    sents = [x.strip() for x in re.split(r"(?<=\.)\s+", s) if x.strip()]
    acts = [x for x in sents if re.match(VERBS, x, re.I) and not re.match(r"(do not|don't)", x, re.I)]
    return len(acts) > 1

def check(c):
    p, k = [], c["key"]
    if len(c["title"]) > 80 or ";" in c["title"]: p.append(f"{k}: title {len(c['title'])} chars or has a semicolon")
    if c["sec"] == "DESIGN" and not c["title"].startswith("Design: "): p.append(f"{k}: design title must start 'Design: '")
    if c["sec"] != "DESIGN" and c["title"].startswith("Design"): p.append(f"{k}: a 'Design: ' title outside the design section")
    if len(c["res"]) != len(c["steps"]): p.append(f"{k}: {len(c['res'])} results for {len(c['steps'])} steps")
    for i, r in enumerate(c["res"], 1):
        if not r.startswith(f"Step {i}: "): p.append(f"{k}: result {i} does not start 'Step {i}: '")
    for i, s in enumerate(c["steps"], 1):
        if two_actions(s): p.append(f"{k}: step {i} has two UI actions: {s!r}")
    defined = set(PH.findall(" ".join(a for a, _ in c["pre"])))
    for x in set(PH.findall(" ".join(c["steps"] + c["res"] + [c["note"]]))):
        if x not in defined: p.append(f"{k}: {{{x}}} not defined in preconditions")
    for x in set(PH.findall(" ".join(b or "" for _, b in c["pre"]))):
        if x not in defined: p.append(f"{k}: example line names {{{x}}} that no precondition defines")
    bad = re.findall(r"\{([A-Z][^{}]*)\}", " ".join([a for a, _ in c["pre"]] + c["steps"] + c["res"]))
    for x in bad:
        if not PH.fullmatch("{" + x + "}"): p.append(f"{k}: placeholder {{{x}}} is not name-hyphen-letter or number")
    for a, b in c["pre"]:
        if b and not b.startswith("For example:"): p.append(f"{k}: example line must start 'For example:'")
    tester = " ".join([c["scen"]] + [a for a, _ in c["pre"]] + c["steps"] + c["res"])
    if "ZZAUTOTEST" in tester: p.append(f"{k}: hard-coded record in tester text (examples go on the For example line)")
    if re.search(r"\bS\d+-[RNE]\d+", tester): p.append(f"{k}: requirement code in tester text")
    if not c["api"] and JARGON.search(tester): p.append(f"{k}: technical term in tester text: {JARGON.search(tester).group(0)}")
    if c["api"] and c["sec"] != "S10": p.append(f"{k}: an API case outside the S10 (Imports and Public API) section (Rule 4)")
    for l, t in quotes(c):
        if l.startswith("Jira SV-"):
            if ws(t) not in JIRAW: p.append(f"{k}: quote {l} not verbatim in the saved Jira stories")
        elif on_v5(c):
            if ws(t) not in PRD5W and ws(t) not in PRD5_RAWW: p.append(f"{k}: quote {l} not verbatim in PRD v5")
        elif ws(t) not in PRDW and ws(t) not in PRD_RAWW: p.append(f"{k}: quote {l} not verbatim in PRD v3")
    if not c["q"]: p.append(f"{k}: no source quote (Rule 64)")
    if not c["marker"].startswith("AUTOMATION: "): p.append(f"{k}: marker")
    return p
