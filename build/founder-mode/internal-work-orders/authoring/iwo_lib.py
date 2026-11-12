"""Internal Work Orders — case model, quote lookup, checks and TestRail rendering (12 Nov 2026, round 1: the PRD and the Jira tickets).
Base: build/founder-mode/bill-to/authoring/bt_lib.py (quote machinery: every quote is pulled by requirement code, by the start of a PRD
line or sentence, or from a table row, and checked word for word against the saved PRD; the Change Log holds no requirement and is never
quoted). Case bodies follow the QA lead's pattern (Rule 117 fourteenth and fifteenth amendments, example C665915): plain precondition
bullets ("Sign in as ...", "Use a ...", "Have a ...", "Make sure ..."), numbered steps with one UI action each (Rule 135), "Expected
Result" with "Step N:" and one bullet per observable fact, a blank line, then "Exact quotes from the source" with a "From:" line per
document (eleventh amendment), the build line, "References from Design" (an EMPTY hook in round 1: design_refs.DREFS is filled by the
design round), and the AUTOMATION line last. Every expected result comes from PRD "Internal Work Orders (PRD)" Final v1.0 (Rules 57, 113).
A case blocked on another release opens its Preconditions with a bold "BLOCKED ON RELEASE" line (QA lead, 4 Nov 2026)."""
import os, re, html, csv
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)


def ws(s): return re.sub(r"\s+", " ", html.unescape(s).replace("**", "").replace("\\", "")).strip()


def md_to_text(md):
    """Plain lines: no ** or \\, links reduced to their words, headings unmarked, one table cell per line."""
    out = []
    for line in md.split("\n"):
        t = line.replace("\\", "").replace("**", "")
        t = re.sub(r"(?<![\w*])\*(\S[^*]*?)\*(?![\w*])", r"\1", t)
        t = t.replace("`", "")
        t = re.sub(r"\[([^\]]*)\]\((https?:[^)]*)\)", r"\1", t)
        t = re.sub(r"<[^>]+>", "", t)
        t = re.sub(r"^#+\s*", "", t)
        if t.startswith("|"):
            out += [x.strip() for x in t.strip().strip("|").split("|") if x.strip() and not re.fullmatch(r"-+", x.strip())]
        else: out.append(t)
    return "\n".join(out)


PRD_FILE = f"{P}/sources/CONFLUENCE-942243841-read-2026-11-12.md"
PRD_FULL = open(PRD_FILE).read()
PRD_MD = PRD_FULL.split("## 9. Change Log")[0]          # the Change Log holds no requirement and is never a source of a quote
PRD_TXT = md_to_text(PRD_MD)
PRDW = ws(PRD_TXT)
PRD_RAWW = ws(re.sub(r"<[^>]+>", "", re.sub(r"\[([^\]]*)\]\((https?:[^)]*)\)", r"\1", PRD_MD)))
JIRA_FILE = f"{P}/sources/JIRA-SV-11665-tickets-2026-11-12.md"
JIRAW = ws(re.sub(r"\[([^\]]*)\]\((https?:[^)]*)\)", r"\1", open(JIRA_FILE).read()))
# Round 2a (12 Nov 2026): the tech plan. A case may cite a plan statement the tech plan worker classified (TECH-PLAN-TESTABLE.json) by its
# id ("TP-123"); the quote is the statement's verbatim text, checked again here against the plan line it cites. The plan informs and
# never overrules the PRD (Rules 30, 57): every case still quotes the PRD, and DIVERGE statements are never quoted as expectations.
import json as _json
PLAN_FILE = f"{P}/sources/TECH-PLAN-Internal-Work-Orders-upload-2026-11-12.md"
PLAN_LINES = open(PLAN_FILE).read().split("\n")
TPJ = _json.load(open(f"{P}/tech-plan-2026-11-12/TECH-PLAN-TESTABLE.json"))
TP = {x["id"]: x for x in TPJ["statements"]}
PLAN_NAME = ('"Internal Work Orders technical implementation plan", 2026-10-28, last updated 2026-11-10 (revision 5, built on PRD v1.0), '
             'sources/TECH-PLAN-Internal-Work-Orders-upload-2026-11-12.md')

PRD_VERSION = "1.0"
PRD_NAME = 'PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.0 final (9 Nov 2026, Milos Vasic)'
PRD_READ = "read 12 Nov 2026"
JIRA_NAME = "Jira tickets under epic SV-11665 (saved 12 Nov 2026, sources/JIRA-SV-11665-tickets-2026-11-12.md)"
EPIC = "SV-11665"
DESIGN_URL = "https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo"
NOBUILD = "The build is not yet available to check this case against."
TODAY = "11/12/2026"
# Rule 69: a case that cannot yet be build-verified (no build named) carries this marker; a later build check lifts it.
MARKER = f"AUTOMATION: Not available on Build to test Yet - Last checked {TODAY}"
def HOLD(reason): return "AUTOMATION: HOLD - " + reason
def PO_HOLD(n): return HOLD(f"waiting on the PO (question {n})")
# Precedent (Credit terms 26 Oct 2026, Bill To 10 Nov 2026): release-day cases take their "before" values on production shortly before
# the release and are run there after it ("Run on Production After Release" folder).
PRE_REL = HOLD("needs records and figures noted on production before the release reaches production; run on production after the release")
# Cases a manual tester cannot set up (QA lead's standing decision: not written to TestRail; listed in NO-MANUAL-PROPOSAL.md)
def NOMAN(reason): return HOLD("a tester cannot set this up through the screens: " + reason)
API_BANNER = ("BLOCKED ON RELEASE: this test checks the Open API story of Internal Work Orders (SV-11833), which is built after the Open "
              "API refactoring and does not ship with the core release. Do not run it now. It can be tested once SV-11833 is released.")
API_HOLD = HOLD("waits on the release of the Open API story SV-11833 (built after the Open API refactoring)")
GA_BANNER = ("BLOCKED ON RELEASE: this test sends a request to create an invoice through the Open API, which is disabled today and is "
             "enabled for general availability. Do not run it now. It can be tested once invoice creation through the Open API is released.")
GA_HOLD = HOLD("waits on invoice creation through the Open API being enabled (disabled today, enabled for general availability)")
MR_BANNER = ("BLOCKED ON RELEASE: this test checks work orders created from a maintenance reminder, which needs Maintenance Reminders, "
             "not released yet. Do not run it now. It can be tested once Maintenance Reminders are released.")
MR_HOLD = HOLD("waits on the release of Maintenance Reminders")

# ---- requirement codes: the requirement line itself, the FIRST line carrying the code -------------------------------------------
CODE = {}
for line in PRD_TXT.split("\n"):
    m = re.match(r"^\s*-?\s*(S\d+-[RNE]\d+[a-z]?):\s*(.*)$", line)
    if m and m.group(1) not in CODE: CODE[m.group(1)] = m.group(2).strip()
if len(CODE) != 205: raise SystemExit(f"PRD v1.0 has {len(CODE)} requirement codes; this library was written for 205")


def prd_line(start):
    hits = []
    for line in PRD_TXT.split("\n"):
        t = re.sub(r"^\s*-\s*", "", line).strip()
        if t.startswith(start): hits.append(t)
    if len(hits) != 1: raise KeyError(f"{len(hits)} PRD lines start with {start!r}")
    return hits[0]


def prd_sentence(start, n=1):
    """n sentences of the PRD from `start` (each ends at '. '), verbatim."""
    i = PRDW.find(start)
    if i < 0: raise KeyError(start)
    j = i
    for _ in range(n):
        k = PRDW.find(". ", j)
        if k < 0: return PRDW[i:]
        j = k + 2
    return PRDW[i:j - 1]


def raw_row(start):
    """One table row of the PRD, cells joined by ' | ', verbatim."""
    hits = []
    for line in PRD_MD.split("\n"):
        if line.startswith("| ") and ws(line.strip().strip("|")).startswith(start):
            hits.append(" | ".join(ws(x) for x in line.strip().strip("|").split("|")))
    if len(hits) != 1: raise KeyError(f"{len(hits)} rows start with {start!r}")
    return hits[0]


# ---- named PRD items without a code (each covered by a case or listed as not testable with the reason) ------------------------
NAMED = {}; NAMED_STORY = {}
def _n(key, label, text, story=None):
    NAMED[key] = (label, text)
    if story: NAMED_STORY[key] = story

EH = {
 "EH-S1-1": (1, "If saving the flag fails"), "EH-S1-2": (1, "If Make internal (S1-R11) fails"), "EH-S1-3": (1, "While a save is in progress"),
 "EH-S2-1": (2, "If converting, or changing the category, fails"), "EH-S2-2": (2, "While the change is in progress"),
 "EH-S3-1": (3, "If Close fails before the internal invoice is created"), "EH-S3-2": (3, "While Close is in progress"),
 "EH-S4-1": (4, "If Reopen fails"), "EH-S4-2": (4, "While Reopen is in progress"),
 "EH-S5": (5, "If saving fails, the existing QuickBooks settings error handling"), "EH-S6": (6, "If saving fails, the existing Account Mappings"),
 "EH-S7": (7, "Failures follow the existing QB Unexported path"), "EH-S8": (8, "Failures follow the Held path of S8-N2"),
 "EH-S9": (9, "None beyond the existing report error handling."), "EH-S10": (10, "If saving the amount fails"),
 "EH-S11": (11, "Existing Open API error handling applies, unchanged."), "EH-S12": (12, "If marking, changing the category or marking billable fails"),
}
for k, (s, start) in EH.items(): _n(k, f"Story {s}, Error Handling", prd_line(start), s)
# §8 User Feedback Summary: every table row (Trigger | Message | Behavior)
_ufs = []; _inside = False
for line in PRD_MD.split("\n"):
    if line.startswith("## 8. User Feedback Summary"): _inside = True; continue
    if _inside and line.startswith("## "): break
    if _inside and line.startswith("| ") and not line.startswith("| Trigger") and not line.startswith("| ---"):
        _ufs.append(" | ".join(ws(x) for x in line.strip().strip("|").split("|")))
if len(_ufs) != 42: raise SystemExit(f"User Feedback Summary has {len(_ufs)} rows; expected 42")
UFS_STORY = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 7, 3, 3, 3, 3, 8, 3, 3, 2, 4, 9, 9, 5, 3, 11, 12, 12, 12, 12, 12, 12, 12, 12, 1, 1, 1, 2, 1]
for i, row in enumerate(_ufs, 1): _n(f"UFS-{i:02d}", "User Feedback Summary", row, UFS_STORY[i - 1])
# Key Decisions: the decision sentence(s) of each bullet (the rationale is context, not a check)
KD = {
 "KD-FLAG": ("Internal is a flag on the customer, not on the work order, not a work order type and not a new status.", 1, 1),
 "KD-NC": ("Goodwill, comebacks, policy and warranty work on a customer's unit are one No Charge mark", 1, 2),
 "KD-CLOSE": ("Under the hood, Close creates an invoice marked internal or no charge.", 2, 3),
 "KD-NOPRICE": ("Internal and no-charge work orders have no sell prices; cost is shown under the existing financial-data permission.", 1, 2),
 "KD-COST": ("Part cost goes straight to the expense account, not to cost of goods sold first, one entry per part as invoicing posts today.", 1, 7),
 "KD-ACCT": ("One expense account per category, mapped per location in QuickBooks", 1, 5),
 "KD-LABOR": ("Labor is hours only in this version.", 1, 9),
 "KD-ALWAYS": ("Close always succeeds (the one refusal is a work order that changed under the open confirmation, S3-E5).", 2, 3),
 "KD-LOCK": ("The classification can change until the work order is closed or invoiced.", 2, 2),
 "KD-WRITTEN": ("The classification is written on the work order, never read live from the customer flag.", 1, 1),
 "KD-OFFER": ("Flagging a customer offers to make its open billable work orders internal;", 1, 1),
 "KD-REVIEW": ("The existing Require Review Before Completion setting is the accounting review step.", 1, 3),
 "KD-ONEPRESS": ("Closing posts immediately and takes one press, like Create invoice.", 1, 3),
 "KD-REPORT": ("One report for free work; the money reports leave internal and no-charge work orders out with no filter.", 1, 9),
 "KD-SUPPLIES": ("Shop supplies on internal and no-charge work orders are a flat amount, defaulted from the customer's Min", 1, 10),
 "KD-BOTH": ("Built for QuickBooks Online and AccountingHub both, plus exports for shops with neither.", 1, 9),
 "KD-ORG": ("The setting is organization-wide, like every other Work Orders setting;", 1, 1),
 "KD-NOFLAG": ("No feature flag.", 2, 13),
 "KD-PERM": ("Permissions. No new permission.", 3, 1),
 "KD-CAT": ("Categories are shop-managed and carry the account; the work order never asks an accounting question.", 2, 2),
 "KD-LINE": ("A no-charge line stays on its billable work order and shows $0.00 on one invoice", 2, 12),
 "KD-ORIG": ("The original work order and, optionally, the original line are stored with every Warranty and Comeback job", 1, 9),
 "KD-PRICE": ("The books receive only what the shop paid for a part, never a derived sell price:", 1, 2),
}
for k, (s, n, st) in KD.items(): _n(k, "Key Decisions", prd_sentence(s, n), st)
# The permissions matrix: every row, and the two rules under it
PERM = {"PM-01": ("Turn the setting on or off; the first-time modal", 1), "PM-02": ("Flag customers in the first-time modal", 1),
        "PM-03": ("Internal customer checkbox on Edit Customer", 1), "PM-04": ("See the Internal badge on the customers list", 1),
        "PM-05": ("Make internal (dialog after flagging)", 1), "PM-06": ("Change the customer on a work order", 2),
        "PM-07": ("No Charge at creation, Convert to No Charge", 2), "PM-08": ("Edit the shop supplies amount", 10),
        "PM-09": ("Close Work Order |", 3), "PM-10": ("Reopen Work Order |", 4), "PM-11": ("Cost on lines, in the Close confirmation", 2),
        "PM-12": ("QuickBooks rows", 5), "PM-13": ("AccountingHub rows", 6), "PM-14": ("Internal Work Orders report, the Technician Efficiency chip", 9),
        "PM-15": ("Customer portal |", 2)}
for k, (s, st) in PERM.items(): _n(k, "Key Decisions, Permissions (Action | Needs | Without it)", raw_row(s), st)
_n("PM-R1", "Key Decisions, Permissions", prd_sentence("(1) Every write in the matrix is refused by the server with 403", 2), 1)
_n("PM-R2", "Key Decisions, Permissions", prd_sentence("(2) The categories page and the category dialog (S1-R13, S1-R14) use", 1), 1)
TERMS = {
 "T-IWO": ("Internal work order → a work order whose customer", 2), "T-NCWO": ("No-charge work order → a work order on a regular customer", 2),
 "T-IC": ("Internal customer → one of the shop's existing customers", 1), "T-CLASS": ("Classification → the three values", 2),
 "T-CLOSE": ("Close Work Order → the finish action", 3), "T-CLOSED": ("Closed · Internal / Closed · No Charge → how running text", 3),
 "T-INV": ("Internal invoice → the record created by Close.", 3), "T-NC": ("No Charge → the text used where a price would be", 9),
 "T-REASON": ("Reason → the earlier name of the No Charge category", 2), "T-HOURS": ("Hours → the labor hours on the lines", 3),
 "T-NAME": ("Internal Work Orders → the name of the setting", 9), "T-CATACCT": ("Category expense account → the expense account", 5),
 "T-SSACCT": ("Shop supplies account → where the shop supplies amount", 10), "T-REVIEW": ("ShopView Review → the expense account", 7),
 "T-PDATE": ("Posting date → the date in the Close confirmation", 3), "T-PARTS": ("Inventory part / special-order part / sublet →", 7),
 "T-STATUS": ("Statuses are named as the app names them:", 3), "T-VOCAB": ("Vocabulary. This PRD uses the frontend vocabulary", 1),
 "T-CAT": ("Category → a shop-managed entry", 1), "T-ORIG": ("Original work order → the earlier work order", 2),
 "T-ORIGL": ("Original line → the line on the original work order", 2), "T-NCL": ("No Charge line → a line of a billable work order", 12),
}
for k, (s, st) in TERMS.items(): _n(k, "Terminology", prd_line(s), st)
OV = {
 "OV-0": ("Two kinds of work order, one way to close them.", 1), "OV-IC": ("Internal work orders come from internal customers.", 1),
 "OV-NC": ("No Charge is a mark with a category.", 2), "OV-LOOK": ("Both look and work like a normal work order until the end.", 2),
 "OV-CLOSE": ("Both close the same way.", 3), "OV-ACCT": ("Accounting is one expense account per category.", 5),
 "OV-LABOR": ("Labor is hours only.", 9), "OV-SS": ("Shop supplies are a flat amount.", 10),
 "OV-REP": ("Reports: dollars out, hours in, per work order and per line.", 9), "OV-NOT": ("Not in this version.", 9),
}
for k, (s, st) in OV.items(): _n(k, "Feature Overview", prd_line(s), st)
OOS = [("A percentage shop supplies charge", 10), ("Billing a manufacturer or a third party", 3), ("Monthly batch posting, backdating", 3),
       ("Splitting cost by vehicle or class", 7), ("Sell prices, an internal pricing tier", 2), ("Capitalizing rebuilds, use tax", 2),
       ("Cost per asset.", 3), ("Automatically re-marking past $0 invoices.", 9), ("Moving labor cost at technician pay.", 5),
       ("Internal work orders in the customer portal", 2), ("A filter on the customers list.", 1), ("Part sales. A part sale to an internal", 2),
       ("Closing several work orders at once.", 3), ("Regular work orders, invoicing, payments, discounts", 2), ("Policy as a starting No Charge category.", 1),
       ("Moving a line to a separate work order from the line menu.", 12), ("Labor cost posting (the parts and labor split)", 9)]
for i, (s, st) in enumerate(OOS, 1): _n(f"OOS-{i:02d}", "Feature Overview, Out of Scope", prd_line(s), st)
GOALS = [("An advisor can take an internal or no-charge job", 2), ("A closed internal or no-charge work order creates no receivable", 3),
         ("For a shop on QuickBooks Online or AccountingHub, the month-end", 7), ("Sales and margin reports exclude internal", 9),
         ("Setup is one toggle, one flagged customer", 1)]
for i, (s, st) in enumerate(GOALS, 1): _n(f"GOAL-{i}", "Goals", prd_line(s), st)
FF = {"FF-S1": ("Desktop only by rule. This surface is a settings toggle and the customer dialog;", 1),
      "FF-S2": ("Mobile-optimized. The only new elements on the work order are the badge", 2),
      "FF-S3": ("As Create invoice today: desktop, plus the icon button in the mobile header.", 3),
      "FF-S10": ("Mobile-optimized for the field on the work order", 10),
      "FF-S12": ("Mobile-optimized. The line menu item, the chip and the $0.00 price follow the line", 12)}
for k, (s, st) in FF.items(): _n(k, f"Story {st}, Form factor", prd_line("Form factor: " + s), st)
_n("ENTRY", "Story 1, Entry points", prd_line("Not on New Customer, not in a Settings list and not on the work order itself"), 1)

# Items that cannot be turned into a check a tester can run, with the reason (Rule 64: stated, never silently dropped)
NOT_TESTABLE = {
 "T-VOCAB": "A vocabulary note mapping the screen words location and customer to back-end words; no behaviour.",
 "T-REASON": "Says the old name Reason is superseded by Category; every case uses Category, and no screen shows the old word to check.",
 "EH-S9": "Says there is no error handling beyond the existing one for reports; there is no new message or state to look at.",
 "EH-S11": "Says the existing Open API error handling applies unchanged; the API cases check the one new error message.",
 "OOS-03": "Monthly batch posting, backdating and an accounting approval screen do not exist; there is no screen to look at (the posting date rules are checked in Story 3).",
 "OOS-04": "Splitting cost by vehicle or class, department profit and loss: nothing to look at in this release.",
 "OOS-06": "Capitalizing rebuilds, use tax, co-pay and partial warranty do not exist in the product; there is no screen to look at.",
 "OOS-09": "Moving labor cost at technician pay is a later option; there is no screen to look at.",
 "OOS-17": "Labor cost posting, rates in dollars and AI insights are not in this version; there is no screen to look at.",
 "OV-NOT": "Lists what is not in this version (labor posting, comeback numbers in dollars); nothing to look at. The fields it says are stored are checked through the report and the hub record.",
 "KD-BOTH": "A scope statement (both integrations, plus exports); each integration and the export are checked by their own stories.",
 "S6-R2": None,   # replaced below: covered by REL and S13 cases (kept here only as a reminder; removed at import)
}
NOT_TESTABLE.pop("S6-R2")

STORY = {1: ("SV-11758", "Story 1, Turn on Internal Work Orders, flag internal customers, manage categories"),
         2: ("SV-11759", "Story 2, An internal or no-charge work order from creation to Close"),
         3: ("SV-11760", "Story 3, Close an internal or no-charge work order"), 4: ("SV-11761", "Story 4, Reopen a closed internal or no-charge work order"),
         5: ("SV-11762", "Story 5, QuickBooks Online account mapping"), 6: ("SV-11763", "Story 6, AccountingHub account mapping"),
         7: ("SV-11764", "Story 7, QuickBooks Online sync"), 8: ("SV-11765", "Story 8, AccountingHub, the closed work order and its parts cost"),
         9: ("SV-11766", "Story 9, Reports, dashboard and exports"), 10: ("SV-11767", "Story 10, Shop supplies on internal and no-charge work orders"),
         11: ("SV-11833", "Story 11, Open API and webhooks"), 12: ("SV-12226", "Story 12, A no-charge line on a billable work order"),
         13: ("SV-12295", "Story 13, Release day, seeding and migration"), 14: ("SV-12296", "Story 12 (portal), The no-charge line in the customer portal")}

_MAPF = f"{P}/testrail-id-map.csv"
MAPPED = {r["key"]: (r.get("prd_version") or PRD_VERSION) for r in csv.DictReader(open(_MAPF))} if os.path.exists(_MAPF) else {}
def prd_version(c):
    """A mapped case keeps the PRD version it was written for (testrail-id-map.csv column prd_version); a new case quotes the current one."""
    return MAPPED.get(c["key"], PRD_VERSION)

CASES = []
def C(key, sec, title, pre, steps, res, q, marker=None, note="", stories=None, api=False, held=None, banner=""):
    """pre: plain precondition bullets. steps: one-action steps. res: one list of bullets per step.
    q: PRD codes, NAMED keys, or (label, verbatim text) where label starts 'Jira SV-' for the saved tickets."""
    marker = marker or MARKER
    if marker.startswith("PO:"):
        from po_questions import QN
        marker = PO_HOLD(QN[marker[3:]])
    CASES.append(dict(key=key, sec=sec, title=title, pre=list(pre), steps=list(steps), res=[list(r) for r in res], q=list(q),
                      marker=marker, note=note, stories=stories, api=api, banner=banner,
                      held=held if held is not None else marker.startswith("AUTOMATION: HOLD")))


def quotes(c):
    out = []
    for x in c["q"]:
        if isinstance(x, tuple): out.append(x)
        elif x in CODE: out.append((x, CODE[x]))
        elif x in TP:
            from tp_quote_fix import TPFIX     # round 2c: only the code-free behaviour wording of the plan line (none: quote dropped)
            for t in (TPFIX[x] if x in TPFIX else [TP[x]["quote"]]): out.append((f"Tech plan line {TP[x]['plan_line']} ({x})", t))
        elif x in NAMED: out.append(NAMED[x])
        else: raise KeyError(f"{c['key']}: unknown quote key {x}")
    return out


def codes_of(c): return {x for x in c["q"] if isinstance(x, str) and not x.startswith("TP-")}
def tps_of(c):
    from tp_quote_fix import TPFIX
    return {x for x in c["q"] if isinstance(x, str) and x.startswith("TP-") and TPFIX.get(x, True) != []}


def story_nums(c):
    if c["stories"] is not None: return c["stories"]
    s = set()
    for k in codes_of(c):
        m = re.match(r"S(\d+)-", k)
        if m: s.add(int(m.group(1)))
        elif k in NAMED_STORY: s.add(NAMED_STORY[k])
    if c["sec"] == "S12P": s.add(14)
    return sorted(s)


e = lambda s: html.escape(s, quote=False)

from design_refs import DREFS, for_case as _for_case   # round 1: an empty hook; the design round fills it
_DCACHE = {}
def design_for(c):
    if c["key"] not in _DCACHE: _DCACHE[c["key"]] = _for_case(c)
    return _DCACHE[c["key"]]


def design_block(c):
    """Rule 117 tenth amendment: design references in their own block below the quotes. Empty in round 1 (no heading at all)."""
    d = design_for(c)
    if not d: return ""
    h = "<p></p><p><strong>References from Design</strong></p>"
    if d.get("pages"): h += "<p>" + e(d["pages"]) + "</p>"
    if d.get("pictures"): h += "<p>Design pictures attached to this case:</p><ul>" + "".join(f"<li>{e(x)}</li>" for x in d["pictures"]) + "</ul>"
    if d.get("words"): h += "<p>The design's own words:</p><ul>" + "".join(f"<li>&ldquo;{e(w)}&rdquo;</li>" for w in d["words"]) + "</ul>"
    for n in d.get("notes") or []: h += "<p>" + e(n) + "</p>"
    return h


def quotes_block(c):
    groups = {"prd": [], "jira": [], "plan": []}
    for l, t in quotes(c): groups["jira" if l.startswith("Jira SV-") else "plan" if l.startswith("Tech plan") else "prd"].append((l, t))
    sn = story_nums(c)
    sto = ", ".join(f"story {STORY[n][0]} ({STORY[n][1]})" for n in sn)
    h = "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
    first = True
    prd_name = PRD_NAME if prd_version(c) == PRD_VERSION else PRD_NAME.replace(f"version {PRD_VERSION}", f"version {prd_version(c)}")
    for name, g in ((prd_name, groups["prd"]), (JIRA_NAME, groups["jira"]), (PLAN_NAME, groups["plan"])):
        if not g: continue
        h += f"<p>From: {e(name)}, {PRD_READ}" + ((f" &middot; Epic {EPIC}" + (f", {e(sto)}" if sto else "")) if first else "") + "</p>"
        h += "<ul>" + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(t)}&rdquo;</li>" for l, t in g) + "</ul>"
        first = False
    return h + f"<p>{e(NOBUILD)}</p>"


def refs_of(c):
    r = [STORY[n][0] for n in story_nums(c)] or [EPIC]
    for x in c["q"]:
        if isinstance(x, tuple):
            m = re.match(r"Jira (SV-\d+)", x[0])
            if m: r.append(m.group(1))
    return ",".join(dict.fromkeys(r))


def render(c):
    pre = (f"<p><strong>{e(c['banner'])}</strong></p>" if c["banner"] else "") + \
          "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(x)}</li>" for x in c["pre"]) + "</ul>"
    exp = ("<p><strong>Expected Result</strong></p>"
           + "".join(f"<p>Step {i}:</p><ul>" + "".join(f"<li>{e(x)}</li>" for x in r) + "</ul>" for i, r in enumerate(c["res"], 1))
           + "<p></p>" + (f"<p>{e(c['note'])}</p>" if c["note"] else "")
           + quotes_block(c) + design_block(c) + f"<p>{e(c['marker'])}</p>")
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": refs_of(c), "custom_automation_type": 2,
            "custom_atmstatus": 1, "custom_preconds": pre, "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in c["steps"]) + "</ol>",
            "custom_expected": exp}


# ---- gates ------------------------------------------------------------------------------------------------------------------------
JARGON = re.compile(r"\b(HTTP|endpoint|database|devtools|DevTools|console|SQL|JSON|payload|backend|server|API|webhook)\b")
VERBS = (r"(click|clicks|open|opens|select|choose|type|enter|press|tick|untick|hover|save|close|clear|switch|sign|reload|refresh|pick|"
         r"set|change|delete|create|move|deactivate|reactivate|go|scroll|drag|drop|upload|send|log|wait|edit|cancel|confirm|search|pin|unpin|"
         r"remove|turn|add|approve|start|stop|unassign|assign|reverse|print|export|pay|tap|expand|take|record|split|reopen|convert|invoice|"
         r"mark|archive|restore|download|email|receive|clock|run|apply)")
TWO = re.compile(r"\b" + VERBS + r"\b[^.]*?(,\s*then\s+|\s+and\s+then\s+|\s+then\s+|\s+and\s+)" + VERBS + r"\b", re.I)
ALLOW = re.compile(r"(Save & Close|Create & Edit|Make internal|Keep billable|Do this later|Convert to No Charge|Convert to Billable|"
                   r"Change category|Close Work Order|Reopen Work Order|Mark as No Charge|Mark as Billable|Mark Reviewed|Create invoice|"
                   r"Add Work Order Fee / Discount|Save settings|Remove flag|Set account|Show archived|New Internal Category|"
                   r"New No Charge Category|Edit Customer|Edit Asset|Edit Line|New Line|Send to Portal|Request IBS Approval|Issue Credit|"
                   r"Add Deposit|Invoicing & Payments|Reports — Page Access|Include internal and no-charge work orders|"
                   r"Hide / Only internal / Show all|Only internal|Show all|By work order and line|By technician|Mark as Exported|Export Reports|"
                   r"Customer Invoice|Change Customer|New Work Order|Original work order|Original line|Not in ShopView|Default internal category|"
                   r"Internal customer|Requires the original work order|Default category|Internal and no-charge work orders|Internal Work Orders|"
                   r"Add Line|Accounting Events|Account Mappings|Retry|Restore|Archive|Edit line|Delete line|Download|Print|Approve|Decline|"
                   r"Parts and labor|parts and shop supplies|cost and hours|costs and hours|hours and parts)", re.I)
def two_actions(step):
    s = ALLOW.sub("X", step)
    s = re.sub(r'"[^"]*"|“[^”]*”', '"Q"', s)
    s = re.sub(r"\([^)]*\)", "", s)
    if TWO.search(s): return True
    sents = [x.strip() for x in re.split(r"(?<=\.)\s+", s) if x.strip()]
    return len([x for x in sents if re.match(VERBS, x, re.I)]) > 1

KEYRX = re.compile(r"\b(S\d{1,2}|S12P|API|INV|D|DATA|REL)-\d{1,3}[a-e]?\b|\bC\d{5,6}\b")
LABEL = re.compile(r"\b(customer|work order|part sale|invoice|contact|asset|user|location|deposit|role|line|vendor bill|technician|category) ([A-Z]|\d)\b")
BANNED_PRE = [(r"[{}]", "a placeholder brace"), (r"For example:", "a 'For example:' line"), (r"Scenario:", "a Scenario line"),
              (r"mark this test Blocked|setup not done|If you cannot set up|If any record above is missing", "the Blocked line"),
              (r"QA lead|ask your|\bask\b|set aside", "who-to-ask or generic wording"), (r"ZZAUTOTEST", "an example record name"),
              (r"setup file|docs\.google", "a setup-file mention")]
VAGUE = re.compile(r"\bnative\b|as described\b|looks right|the same style\b|as designed\b", re.I)
NOTMANUAL = re.compile(r"automated check|means other than the page|request sent outside|outside the (page|window|screen) can reach|"
                       r"cannot be loaded|data repair|slowed network|developer-made failure|manual tester cannot|cannot set up this case", re.I)


BASELINE = re.compile(r"\bas before\b|\bas today\b|\bas it does today\b|where (it|they) (was|were)|\bunchanged\b|\bas usual\b|"
                      r"\bthe usual\b|\bas it was\b|\bas they were\b|today's (columns|file)|\bthe same as before\b|\bas on a billable\b", re.I)


def check(c):
    p, k = [], c["key"]
    t = c["title"]
    if len(t) > 80 or ";" in t: p.append(f"{k}: title {len(t)} chars or has a semicolon")
    if c["sec"] == "DESIGN" and not t.startswith("Design: "): p.append(f"{k}: design title must start 'Design: '")
    if c["sec"] != "DESIGN" and t.startswith("Design"): p.append(f"{k}: a 'Design: ' title outside the design section")
    if len(c["res"]) != len(c["steps"]): p.append(f"{k}: {len(c['res'])} results for {len(c['steps'])} steps")
    if not c["steps"]: p.append(f"{k}: no steps")
    for i, r in enumerate(c["res"], 1):
        if not r: p.append(f"{k}: step {i} has no result bullet")
    for i, s in enumerate(c["steps"], 1):
        if two_actions(s): p.append(f"{k}: step {i} has two UI actions: {s!r}")
    if not c["pre"]: p.append(f"{k}: no preconditions")
    if c["banner"] and not c["banner"].startswith("BLOCKED ON RELEASE: "): p.append(f"{k}: a banner that is not a release block")
    if c["banner"] and not c["held"]: p.append(f"{k}: blocked on a release but not held")
    for x in c["pre"]:
        for rx, what in BANNED_PRE:
            if re.search(rx, x, re.I if what.startswith("who") else 0): p.append(f"{k}: {what} in the preconditions: {x[:70]!r}")
    tester = [t] + c["pre"] + c["steps"] + [b for r in c["res"] for b in r] + [c["note"]]
    for x in tester:
        if re.search(r"[{}]", x): p.append(f"{k}: a placeholder brace in tester text: {x[:70]!r}")
        if re.search(r"(?m)^\s*For example:", x): p.append(f"{k}: a 'For example:' line in tester text")
        if re.search(r"mark this test Blocked|setup not done", x): p.append(f"{k}: the Blocked line in tester text")
        if KEYRX.search(x): p.append(f"{k}: a case id in tester text: {KEYRX.search(x).group(0)} in {x[:60]!r}")
        if re.search(r"\bS\d+-[RNE]\d+", x): p.append(f"{k}: a requirement code in tester text: {x[:60]!r}")
        if "ZZAUTOTEST" in x: p.append(f"{k}: an example record name in tester text")
        if VAGUE.search(re.sub(r'"[^"]*"', '""', x)): p.append(f"{k}: a vague look word in tester text: {x[:70]!r}")
        if NOTMANUAL.search(x): p.append(f"{k}: 'cannot be done by hand' wording in tester text (the AUTOMATION line carries it): {x[:70]!r}")
        if not c["api"] and JARGON.search(x.replace("Open API", "")): p.append(f"{k}: technical term in tester text: {JARGON.search(x).group(0)}")
    if c["api"] and c["sec"] != "API": p.append(f"{k}: an API case outside the API section (Rule 4)")
    if not c["api"] and c["sec"] == "API": p.append(f"{k}: a case in the API section that sends no API request")
    # Rule 137 relevance: every labelled record in the preconditions is used in the steps or results, or the bullet says why ("so ...")
    later_raw = " ".join(c["steps"] + [b for r in c["res"] for b in r] + [c["note"]]); later = later_raw.lower()
    # a record is needed when the steps or results name it, or when a precondition that builds a needed record names it (the customer
    # a needed work order belongs to, the work order a needed line sits on): needed-by is followed until nothing new is added
    used = {m.group(0).lower() for m in re.finditer(LABEL.pattern, later_raw, re.I)}
    grow = True
    while grow:
        grow = False
        for x in c["pre"]:
            labs = {m.group(0).lower() for m in LABEL.finditer(x)}
            if labs & used and not labs <= used: used |= labs; grow = True
    for x in c["pre"]:
        for m in LABEL.finditer(x):
            lab = m.group(0)
            explained = any(lab in y and (" so " in y or "so that" in y) for y in c["pre"])
            if lab.lower() not in used and not explained:
                p.append(f"{k}: precondition record '{lab}' is not used in the steps or results and does not say why")
    # Rule 137 independence: a record the case relies on is made fresh for this test
    for x in c["pre"]:
        if re.match(r"(Have|Create) (a|an|two|three|four|five|six|nine|eleven|twelve|twenty|one) ", x) and LABEL.search(x) and "for this test" not in x and "any " not in x:
            p.append(f"{k}: a precondition record that is not said to be made for this test: {x[:70]!r}")
    for l, tq in quotes(c):
        if l.startswith("Jira SV-"):
            if ws(tq) not in JIRAW: p.append(f"{k}: quote {l} not verbatim in the saved Jira tickets")
        elif l.startswith("Tech plan"):
            tid = l.split("(")[1].rstrip(")")
            if TP[tid]["verdict"] == "DIVERGE": p.append(f"{k}: quotes the DIVERGE statement {tid} (the PRD wins; quote the PRD)")
            if tq not in PLAN_LINES[TP[tid]["plan_line"] - 1]: p.append(f"{k}: quote {tid} not verbatim on plan line {TP[tid]['plan_line']}")
            from tp_quote_fix import CODEISH
            if CODEISH.search(tq): p.append(f"{k}: plan quote {tid} carries code or a file path ({CODEISH.search(tq).group(0)!r}): quote the behaviour, or the PRD alone")
        elif ws(tq) not in PRDW and ws(tq) not in PRD_RAWW: p.append(f"{k}: quote {l} not verbatim in PRD v{PRD_VERSION}")
    if not any((isinstance(x, str) and not x.startswith("TP-")) or (isinstance(x, tuple) and not x[0].startswith("Jira")) for x in c["q"]):
        p.append(f"{k}: no PRD quote (Rule 57: the PRD is the source of every expected result)")
    for i, r in enumerate(c["res"], 1):
        for b in r:
            if BASELINE.search(b): p.append(f"{k}: step {i} judges against an unseen baseline ({BASELINE.search(b).group(0)!r}): name what the tester sees, compare with production, or note it in an earlier step")
    if not c["marker"].startswith("AUTOMATION: "): p.append(f"{k}: marker")
    return p


def qnum(c):
    """The PO question a held case waits on, else None."""
    m = re.search(r"waiting on the PO \(question (\d+)\)$", c["marker"])
    return int(m.group(1)) if m else None
