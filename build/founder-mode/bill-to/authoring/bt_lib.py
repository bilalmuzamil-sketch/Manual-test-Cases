"""Bill To — case model, quote lookup, checks and TestRail rendering (9 Nov 2026).
Base: build/technician-toggle/authoring/tt_lib.py (quote machinery: every quote is pulled by requirement code or by the start of a PRD
line and checked word for word against the saved PRD, never from the Change Log, which is empty). Case bodies follow the QA lead's
pattern (Rule 117 fourteenth and fifteenth amendments, example C665915): plain precondition bullets ("Sign in as ...", "Use a ...",
"Have a ...", "Make sure ..."), numbered steps with one UI action each (Rule 135), "Expected Result" with "Step N:" and one bullet per
observable fact, a blank line, then "Exact quotes from the source" with a "From:" line per document (eleventh amendment), the build
line, "References from Design" (an EMPTY hook in round 1: design_refs.DREFS is filled by the design round), and the AUTOMATION line
last. Every expected result comes from PRD "Bill To" v0.5 (Rules 57, 113). A case blocked on another release opens its Preconditions
with a bold "BLOCKED ON RELEASE" line (QA lead, 4 Nov 2026; example C913771).
PRD version per case: every case quotes v0.5 today. Once a case is mapped to TestRail (testrail-id-map.csv, column prd_version), it
keeps the version it was written for until a named-set update moves it (Technician Toggle lesson, 4 Nov 2026)."""
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


PRD_FILE = f"{P}/sources/CONFLUENCE-1003585538-v0.5-2026-11-09.md"
PRD_FULL = open(PRD_FILE).read()
PRD_MD = PRD_FULL.split("## 9. Change Log")[0]          # the Change Log (empty in v0.5) is never a source of a quote
PRD_TXT = md_to_text(PRD_MD)
PRDW = ws(PRD_TXT)
PRD_RAWW = ws(re.sub(r"<[^>]+>", "", re.sub(r"\[([^\]]*)\]\((https?:[^)]*)\)", r"\1", PRD_MD).replace("*Basis:*", "Basis:")))
JIRA_FILE = f"{P}/sources/JIRA-SV-12289-tickets-2026-11-09.md"
JIRAW = ws(re.sub(r"\[([^\]]*)\]\((https?:[^)]*)\)", r"\1", open(JIRA_FILE).read()))

PRD_VERSION = "0.5"
PRD_NAME = 'PRD "Bill To", Confluence 1003585538, version 0.5 (6 Nov 2026, pending approval, Chris Ward)'
PRD_READ = "read 9 Nov 2026"
JIRA_NAME = "Jira tickets under epic SV-12289 (saved 9 Nov 2026, sources/JIRA-SV-12289-tickets-2026-11-09.md)"
EPIC = "SV-12289"
DESIGN_URL = "https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd"
NOBUILD = "The build is not yet available to check this case against."
TODAY = "11/9/2026"
# Rule 69: a case that cannot yet be build-verified (no build named) carries this marker; a later build check lifts it.
MARKER = f"AUTOMATION: Not available on Build to test Yet - Last checked {TODAY}"
def HOLD(reason): return "AUTOMATION: HOLD - " + reason
def PO_HOLD(n): return HOLD(f"waiting on the PO (question {n})")
# Credit terms precedent (QA lead, 26 Oct 2026): release-day cases take their "before" values on production shortly before the release
# and are run there after it.
PRE_REL = HOLD("needs records made on production before the release reaches production; run on production after the release")
IWO_BANNER = ("BLOCKED ON RELEASE: this test checks Bill To on internal and No Charge work orders, which needs Internal Work Orders "
              "(SV-11665), not released yet. Do not run it now. It can be tested once SV-11665 is released.")
IWO_HOLD = HOLD("waits on the release of Internal Work Orders (SV-11665)")
PORTAL_BANNER = ("BLOCKED ON RELEASE: this test checks a customer portal change that ships in the customer portal app's own release "
                 "(the Bill To PRD's release dependency for the customer portal story). Do not run it now. It can be tested once that "
                 "portal release is out.")
PORTAL_HOLD = HOLD("waits on the customer portal app release named in the PRD's release dependency")

# ---- requirement codes: the requirement line itself, the FIRST line carrying the code -------------------------------------------
CODE = {}
for line in PRD_TXT.split("\n"):
    m = re.match(r"^\s*-?\s*(S\d+-[RNE]\d+[a-z]?):\s*(.*)$", line)
    if m and m.group(1) not in CODE: CODE[m.group(1)] = m.group(2).strip()
if len(CODE) != 178: raise SystemExit(f"PRD v0.5 has {len(CODE)} requirement codes; this library was written for 178")


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
NAMED = {}
def _n(key, label, text): NAMED[key] = (label, text)
_n("EH-S1-1", "Story 1, Error Handling", prd_line("If saving fails, the app's standard error toast shows and the window stays open."))
_n("EH-S1-2", "Story 1, Error Handling", prd_line("Saving a default on Counter Sale is refused"))
_n("EH-S1-3", "Story 1, Error Handling", prd_line("Picking Counter Sale as a default is refused"))
_n("EH-S2", "Story 2, Error Handling", prd_line("Same refusals and messages as Story 1."))
_n("EH-S3-1", "Story 3, Error Handling", prd_line("Picking Counter Sale through any path is refused"))
_n("EH-S3-2", "Story 3, Error Handling", prd_line("If the save fails, the app's standard error toast shows and the field keeps its previous value."))
_n("EH-S10", "Story 10, Error Handling", prd_line("M3 and M5 show as an error toast and no payment is recorded."))
_n("EH-S12", "Story 12, Error Handling", prd_line("If removing the defaults fails"))
_n("EH-S17", "Story 17, Error Handling", prd_line("A failed sync follows today's failure path"))
# §8 User Feedback Summary: the paragraph's sentences and every table row
_n("UFS-H1", "User Feedback Summary", prd_sentence("Error toasts with a button fade after 10 seconds."))
_n("UFS-H2", "User Feedback Summary", prd_sentence("Server refusals without a button show as the app's standard error toast,"))
_n("UFS-H3", "User Feedback Summary", prd_sentence("Buttons and column headers are listed as they render (Title Case)."))
_ufs = []; _inside = False
for line in PRD_MD.split("\n"):
    if line.startswith("## 8. User Feedback Summary"): _inside = True; continue
    if _inside and line.startswith("## "): break
    if _inside and line.startswith("| ") and not line.startswith("| Id") and not line.startswith("|---"):
        _ufs.append(" | ".join(ws(x) for x in line.strip().strip("|").split("|")))
if len(_ufs) != 19: raise SystemExit(f"User Feedback Summary has {len(_ufs)} rows; expected 19")
for i, row in enumerate(_ufs, 1): _n(f"UFS-{i:02d}", "User Feedback Summary", row)
# UFS row numbers, for readability in the case files
UFS = {"M1-one": "UFS-01", "M1-several": "UFS-02", "M1-customers": "UFS-03", "M1-partsale": "UFS-04", "M2": "UFS-05", "M3": "UFS-06",
       "M5": "UFS-07", "M4": "UFS-08", "D3-pick": "UFS-09", "D3-save": "UFS-10", "D8-delete": "UFS-11", "D8-confirm": "UFS-12",
       "S12-R7": "UFS-13", "Help-window": "UFS-14", "Help-edit": "UFS-15", "Pays for": "UFS-16", "Portal": "UFS-17", "Q1": "UFS-18",
       "G3": "UFS-19"}
# 19 rows: M1 x4, M2, M3, M5, M4, D3 x2, D8 x2, S12-R7, Help x2, Pays for, Portal, Q1, G3
KD = {
 "KD-SPLIT": ("Two customers, split by job.", 2),
 "KD-SHOW": ("Bill To shows only where it differs from the customer.", 1),
 "KD-LOCK": ("Invoiced means locked; Reverse and invoice again is the only correction, and Reverse works as today.", 2),
 "KD-DEP": ("Deposits lock the Bill To.", 4),
 "KD-DEF": ("A saved default Bill To, one hop, applied at creation only.", 2),
 "KD-AUTH": ("The authorizer list adds the Bill To's contacts when the Bill To differs.", 1),
 "KD-BAND": ("\"Service For\" band on documents, only when the Bill To differs.", 1),
 "KD-CS": ("Counter Sale is never the Bill To for another customer, and always bills itself by default.", 1),
 "KD-CH": ("The Bill To's Credit Hold blocks invoicing, checked on the server; its credit limit warns but never blocks.", 1),
 "KD-PAY": ("A payment settles only invoices its own customer owes.", 2),
 "KD-CREDIT": ("A credit issued from an invoice reduces the revenue of that invoice's customer, not the Bill To's.", 2),
 "KD-ASSET": ("The asset's Work Orders tab shows its whole history at the current location by default", 1),
 "KD-API": ("The Public API is additive, with one deliberate change:", 1),
 "KD-CC": ("Change Customer never makes a self-billed document bill the old customer.", 2),
 "KD-AH": ("AccountingHub receives the invoice under the Bill To, as QuickBooks does.", 2),
 "KD-ADDR": ("Address 2 on demand ships with Bill To.", 2),
 "KD-TAX": ("Known limitation: tax follows the customer.", 2),
 "KD-REPORTS": ("ShopView's own reports still credit the work to the customer.", 1),
 "KD-PERM-NONEW": ("No new permission.", 1),
 "KD-PERM-DEF": ("Setting or removing a saved default Bill To needs", 1),
 "KD-PERM-WO": ("Changing a work order's Bill To needs", 1),
 "KD-PERM-SEE": ("Anyone who can view the customer or work order sees the Bill To.", 1),
}
for k, (s, n) in KD.items(): _n(k, "Key Decisions", prd_sentence(s, n))
TERMS = {
 "T-CUST": "Customer → the customer the work is for:", "T-BILL": "Bill To → the customer who owes the invoice.",
 "T-DEF": "Saved default Bill To → a customer-level setting", "T-CS": "Counter Sale → the system customer",
 "T-OPEN": "Open / Invoiced → Open means", "T-REV": "Reverse → ShopView's existing action", "T-VOCAB": "Vocabulary. This PRD uses",
}
for k, s in TERMS.items(): _n(k, "Terminology", prd_line(s))
CORE = ["Every work order, part sale and invoice has two customers", "The customer keeps the truck, the service history",
        "The Bill To owns the receivable:", "A customer can have a saved default Bill To.", "Staff pick or change the Bill To on the work order",
        "Once invoiced, the Bill To is locked.", "When the Bill To differs from the customer, printed invoices",
        "The Bill To shows only where it differs from the customer."]
for i, s in enumerate(CORE, 1): _n(f"CORE-{i}", "Feature Overview, Core Bill To", prd_line(s))
INTEG = ["QuickBooks Online: the invoice is sent under the Bill To.", "AccountingHub: the invoice is sent under the Bill To",
         "IBS: the Bill To's IBS account applies", "Customer portal: the Bill To's contacts", "Public API: Bill To is added alongside"]
for i, s in enumerate(INTEG, 1): _n(f"INT-{i}", "Feature Overview, Integrations", prd_line(s))
_n("REL-0a", "Feature Overview, Release day", prd_sentence("Nothing is migrated.", 2))
_n("REL-0b", "Feature Overview, Release day", prd_sentence("Credits on invoices created before release keep today's revenue attribution."))
_n("REL-0c", "Feature Overview, Release day", prd_sentence("Bill To has no feature flag;"))
RELB = ["The asset page's Work Orders tab lists", "Users who can change a work order's customer see", "Users with 'Customers → Create & Edit' and",
        "In New Customer and Edit Customer, an empty Address 2", "The invoice CSV export gains a last column",
        "Credit Hold blocking Create Invoice is now also checked", "Creating an invoice through the Public API for a customer on Credit Hold"]
for i, s in enumerate(RELB, 1): _n(f"REL-{i}", "Feature Overview, Release day", prd_line(s))
SBA = {"SBA-PICK": "Pick or change the Bill To", "SBA-CC": "Change Customer", "SBA-DEP": "Take a deposit", "SBA-INV": "Create the invoice",
       "SBA-PAY": "Take a payment", "SBA-REV": "Reverse the invoice", "SBA-AGAIN": "Invoice again after Reverse"}
for k, s in SBA.items(): _n(k, "Feature Overview, State by action (Action | Open | Invoiced | Internal or No Charge)", raw_row(s))
OOS = ["Ship To.", "A separate payer on each payment", "Credit Terms (SV-11638) and Split Representatives", "Bill To in New Work Order and New Part Sale.",
       "A saved default Bill To in the Public API.", "Setting a Bill To through the Public API.", "Standalone credits",
       "Historical imports and AccountingHub manual invoices.", "Work Orders list, Board View and Tech View.", "Report columns for Bill To",
       "A \"Paid by\" pointer", "Estimate emails and approval links:", "A history of changes to a customer's saved default", "Changing how Reverse works:"]
for i, s in enumerate(OOS, 1): _n(f"OOS-{i:02d}", "Out of Scope", prd_line(s))
GOALS = ["A shop can invoice a customer other than", "The truck's history, pricing and revenue stay", "A saved default bills every new work order",
         "A shop that never picks a different Bill To"]
for i, s in enumerate(GOALS, 1): _n(f"GOAL-{i}", "Goals", prd_line(s))
FF = {"FF-S3": "Mobile-optimized: the same Customer card on phones; the field is", "FF-S4": "Mobile-optimized: the same Customer card on phones.",
      "FF-S5": "Mobile-optimized: tap does what click does", "FF-S7": "Mobile-optimized: the banner and the Create Invoice action"}
for k, s in FF.items(): _n(k, f"Story {k[4:]}, Form factor", prd_line("Form factor: " + s))
_n("DEP-S16", "Story 16, Release dependency", prd_line("Release dependency: the customer portal app ships"))
_n("DEP-S15", "Story 15, Dependency", prd_line("Dependency: applies when Internal Work Orders"))

# Items that cannot be turned into a check a manual tester can run, with the reason (Rule 64: stated, never silently dropped)
NOT_TESTABLE = {
 "UFS-H3": "A note on how the PRD's own table writes buttons and column headers; the cases quote every label in Title Case as the table gives it.",
 "T-VOCAB": "A vocabulary note mapping the screen words customer and location to the back-end words company and workplace; no behaviour.",
 "S18-R2": ("States that the message AccountingHub receives keeps its current format and that AccountingHub needs no change. A tester sees "
            "only AccountingHub's own screens, which the other Story 18 cases check; the message format itself has no screen."),
 "S15-N1": ("Says that before Internal Work Orders (SV-11665) ships every work order is billable and the Story 15 rules have nothing to act "
            "on. There is nothing to look at: every other case runs on billable work orders."),
 "OOS-02": "A separate payer on each payment, split billing, parent and child accounts and tax by service location do not exist; there is no screen to look at.",
 "OOS-11": "A 'Paid by' pointer is a follow-up that does not exist yet; there is no screen to look at.",
 "OOS-13": "A history of changes to a saved default is not in this release; there is no screen to look at.",
}

STORY = {1: ("SV-12303", "Story 1, Saved default Bill To on the customer page"), 2: ("SV-12304", "Story 2, Bill Invoices To in New Customer and Edit Customer"),
         3: ("SV-12305", "Story 3, Bill To on the work order and part sale Customer card"), 4: ("SV-12306", "Story 4, Authorizer list when someone else pays"),
         5: ("SV-12307", "Story 5, Locked Bill To: invoiced and deposits"), 6: ("SV-12308", "Story 6, Change Customer with a Bill To"),
         7: ("SV-12309", "Story 7, Invoicing to the Bill To"), 8: ("SV-12310", "Story 8, \"Service For\" band on invoices and estimates"),
         9: ("SV-12311", "Story 9, Invoice email to the Bill To"), 10: ("SV-12312", "Story 10, Receivables follow the Bill To"),
         11: ("SV-12313", "Story 11, Reverse and invoice again"), 12: ("SV-12314", "Story 12, Deleting a customer that pays for others"),
         13: ("SV-12315", "Story 13, Work Order Log"), 14: ("SV-12316", "Story 14, Asset Work Orders tab: whole history and Customer filter"),
         15: ("SV-12317", "Story 15, Internal and No Charge work orders"), 16: ("SV-12318", "Story 16, Customer portal"),
         17: ("SV-12319", "Story 17, QuickBooks sync"), 18: ("SV-12320", "Story 18, AccountingHub"),
         19: ("SV-12321", "Story 19, IBS, invoice export and Public API")}
NAMED_STORY = {"EH-S1-1": 1, "EH-S1-2": 1, "EH-S1-3": 1, "EH-S2": 2, "EH-S3-1": 3, "EH-S3-2": 3, "EH-S10": 10, "EH-S12": 12, "EH-S17": 17,
               "UFS-01": 5, "UFS-02": 5, "UFS-03": 5, "UFS-04": 5, "UFS-05": 7, "UFS-06": 10, "UFS-07": 10, "UFS-08": 5, "UFS-09": 3,
               "UFS-10": 1, "UFS-11": 12, "UFS-12": 12, "UFS-13": 12, "UFS-14": 1, "UFS-15": 2, "UFS-16": 1, "UFS-17": 16, "UFS-18": 17,
               "UFS-19": 16, "FF-S3": 3, "FF-S4": 4, "FF-S5": 5, "FF-S7": 7, "DEP-S16": 16, "DEP-S15": 15,
               "KD-AUTH": 4, "KD-BAND": 8, "KD-CS": 1, "KD-CH": 7, "KD-PAY": 10, "KD-CREDIT": 10, "KD-ASSET": 14, "KD-API": 19, "KD-CC": 6,
               "KD-AH": 18, "KD-ADDR": 2, "KD-TAX": 7, "KD-DEP": 5, "KD-LOCK": 11, "KD-DEF": 1, "KD-PERM-DEF": 1, "KD-PERM-WO": 3,
               "INT-1": 17, "INT-2": 18, "INT-3": 19, "INT-4": 16, "INT-5": 19, "REL-1": 14, "REL-2": 3, "REL-3": 2, "REL-4": 2, "REL-5": 19,
               "REL-6": 7, "REL-7": 19}

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
        elif x in NAMED: out.append(NAMED[x])
        else: raise KeyError(f"{c['key']}: unknown quote key {x}")
    return out


def codes_of(c): return {x for x in c["q"] if isinstance(x, str)}


def story_nums(c):
    if c["stories"] is not None: return c["stories"]
    s = set()
    for k in codes_of(c):
        m = re.match(r"S(\d+)-", k)
        if m: s.add(int(m.group(1)))
        elif k in NAMED_STORY: s.add(NAMED_STORY[k])
    return sorted(s)


e = lambda s: html.escape(s, quote=False)

from design_refs import DREFS   # key -> {"pages", "pictures", "words", "notes"}; EMPTY in round 1 (the design round fills it)
def design_for(c): return DREFS.get(c["key"])


def design_block(c):
    """Rule 117 tenth amendment: design references in their own block below the quotes. Round 1 leaves this hook empty: a case with no
    entry in DREFS gets no References from Design heading at all (Technician Toggle precedent)."""
    d = design_for(c)
    if not d: return ""
    h = "<p></p><p><strong>References from Design</strong></p>"
    if d.get("pages"): h += "<p>" + e(d["pages"]) + "</p>"
    if d.get("pictures"): h += "<p>Design pictures attached to this case:</p><ul>" + "".join(f"<li>{e(x)}</li>" for x in d["pictures"]) + "</ul>"
    if d.get("words"): h += "<p>The design's own words:</p><ul>" + "".join(f"<li>&ldquo;{e(w)}&rdquo;</li>" for w in d["words"]) + "</ul>"
    for n in d.get("notes") or []: h += "<p>" + e(n) + "</p>"
    return h


def quotes_block(c):
    groups = {"prd": [], "jira": []}
    for l, t in quotes(c): groups["jira" if l.startswith("Jira SV-") else "prd"].append((l, t))
    sn = story_nums(c)
    sto = ", ".join(f"story {STORY[n][0]} ({STORY[n][1]})" for n in sn)
    h = "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
    first = True
    prd_name = PRD_NAME if prd_version(c) == PRD_VERSION else PRD_NAME.replace(f"version {PRD_VERSION}", f"version {prd_version(c)}")
    for name, g in ((prd_name, groups["prd"]), (JIRA_NAME, groups["jira"])):
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
JARGON = re.compile(r"\b(HTTP|endpoint|database|devtools|DevTools|console|SQL|JSON|payload|backend|server|API)\b")
VERBS = (r"(click|clicks|open|opens|select|choose|type|enter|press|tick|untick|hover|save|close|clear|switch|sign|reload|refresh|pick|"
         r"set|change|delete|create|move|deactivate|reactivate|go|scroll|drag|drop|upload|send|log|wait|edit|cancel|confirm|search|pin|unpin|"
         r"remove|turn|add|approve|start|stop|unassign|assign|reverse|print|export|pay|tap|expand|take|record|split|reopen|convert|invoice)")
TWO = re.compile(r"\b" + VERBS + r"\b[^.]*?(,\s*then\s+|\s+and\s+then\s+|\s+then\s+|\s+and\s+)" + VERBS + r"\b", re.I)
ALLOW = re.compile(r"(Save & Close|Create & Edit|View and Manage|Invoicing & payments|Split Work Order|Split Part Sale|Change Bill To|"
                   r"Change Customer|Remove As Default Bill To|Go To Invoice|Open Deposits|Make Payment|New Payment|Add Deposit|Create Invoice|"
                   r"Issue Credit|Add Address 2|Remove Address 2|New Customer|Edit Customer|New Work Order|New Part Sale|Submit Deposit|"
                   r"Search customers|Bill Invoices To|See Financial Data|View History Logs)", re.I)
def two_actions(step):
    s = ALLOW.sub("X", step)
    s = re.sub(r'"[^"]*"|“[^”]*”', '"Q"', s)
    s = re.sub(r"\([^)]*\)", "", s)
    if TWO.search(s): return True
    sents = [x.strip() for x in re.split(r"(?<=\.)\s+", s) if x.strip()]
    return len([x for x in sents if re.match(VERBS, x, re.I)]) > 1

KEYRX = re.compile(r"\b(S\d{1,2}|API|INV|D|DATA|REL|DR)-\d{1,3}[a-e]?\b|\bC\d{5,6}\b")
LABEL = re.compile(r"\b(customer|work order|part sale|invoice|contact|asset|user|location|deposit|role) ([A-Z]|\d)\b")
BANNED_PRE = [(r"[{}]", "a placeholder brace"), (r"For example:", "a 'For example:' line"), (r"Scenario:", "a Scenario line"),
              (r"mark this test Blocked|setup not done|If you cannot set up|If any record above is missing", "the Blocked line"),
              (r"QA lead|ask your|\bask\b|set aside", "who-to-ask or generic wording"), (r"ZZAUTOTEST", "an example record name"),
              (r"setup file|docs\.google", "a setup-file mention")]
VAGUE = re.compile(r"\bnative\b|as described\b|looks right|the same style\b|as designed\b", re.I)
NOTMANUAL = re.compile(r"automated check|means other than the page|request sent outside|outside the (page|window|screen) can reach|"
                       r"cannot be loaded|data repair|slowed network|developer-made failure|manual tester cannot|cannot set up this case", re.I)


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
        if not c["api"] and JARGON.search(x.replace("Public API", "")): p.append(f"{k}: technical term in tester text: {JARGON.search(x).group(0)}")
        if re.search(r"\b(M[1-5]|D3|D8|G3|Q1)\b", x): p.append(f"{k}: a message id in tester text: {x[:60]!r}")
    if c["api"] and c["sec"] != "API": p.append(f"{k}: an API case outside the API section (Rule 4)")
    if not c["api"] and c["sec"] == "API": p.append(f"{k}: a case in the API section that sends no API request")
    # Rule 137 relevance: every labelled record in the preconditions is used in the steps or results, or the bullet says why ("so ...")
    later = " ".join(c["steps"] + [b for r in c["res"] for b in r]).lower()
    for x in c["pre"]:
        for m in LABEL.finditer(x):
            lab = m.group(0)
            explained = any(lab in y and (" so " in y or "so that" in y) for y in c["pre"])
            if lab.lower() not in later and not explained:
                p.append(f"{k}: precondition record '{lab}' is not used in the steps or results and does not say why")
    # Rule 137 independence: a record the case relies on is made fresh for this test
    for x in c["pre"]:
        if re.match(r"(Have|Create) (a|an|two|three|four|five|six|nine|twenty|one) ", x) and LABEL.search(x) and "for this test" not in x and "any " not in x:
            p.append(f"{k}: a precondition record that is not said to be made for this test: {x[:70]!r}")
    for l, tq in quotes(c):
        if l.startswith("Jira SV-"):
            if ws(tq) not in JIRAW: p.append(f"{k}: quote {l} not verbatim in the saved Jira tickets")
        elif ws(tq) not in PRDW and ws(tq) not in PRD_RAWW: p.append(f"{k}: quote {l} not verbatim in PRD v{PRD_VERSION}")
    if not any(isinstance(x, str) or not x[0].startswith("Jira") for x in c["q"]):
        p.append(f"{k}: no PRD quote (Rule 57: the PRD is the source of every expected result)")
    if not c["marker"].startswith("AUTOMATION: "): p.append(f"{k}: marker")
    return p
