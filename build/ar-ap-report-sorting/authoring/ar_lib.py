"""A/R and A/P Report Sorting, Export and Location Filter — case model, quote lookup, checks and TestRail rendering (22 Oct 2026).
Pattern: build/splitting-sales-reps/authoring/ssr_lib.py. Shape: Rule 117 with all twelve amendments (two-audience preconditions,
{placeholders} with a "For example:" second line, one action per step, one "Step N:" result per step, "Exact quotes from the source
(for reproducibility)" with a "From:" line per document, the build line, "References from Design", the AUTOMATION line last).
Every expected result comes from a verbatim PRD v5 sentence (Rules 57, 113). No build and no design access yet (22 Oct 2026)."""
import os, re, html, json
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)

def ws(s): return re.sub(r"\s+", " ", html.unescape(s).replace("**", "").replace("\\", "")).strip()

def md_to_text(md):
    """Plain lines: no ** or \\, no blockquote mark, links reduced to their words, headings unmarked, one table cell per line."""
    out = []
    for line in md.split("\n"):
        t = line.replace("\\", "")
        t = re.sub(r"^>\s*", "", t)
        t = t.replace("**", "")
        t = re.sub(r"\[([^\]]*)\]\(([^)]*)\)", r"\1", t)
        t = re.sub(r"^#+\s*", "", t)
        if t.startswith("|"):
            out += [x.strip() for x in t.strip().strip("|").split("|") if x.strip() and not re.fullmatch(r"-+", x.strip())]
        else: out.append(t)
    return "\n".join(out)

PRD_FILE = f"{P}/sources/CONFLUENCE-947650561-v5-2026-10-22.md"
PRD_MD = open(PRD_FILE).read().split("<!-- Saved")[0]
PRD_TXT = md_to_text(PRD_MD)
PRDW = ws(PRD_TXT)
PRD_RAWW = ws(re.sub(r"\[([^\]]*)\]\(([^)]*)\)", r"\1", PRD_MD))      # keeps the table rows "a | b | c" for the User Feedback Summary
JIRA_FILE = f"{P}/sources/JIRA-READING-2026-10-22.md"
JIRAW = ws(open(JIRA_FILE).read())

PRD_NAME = 'PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 5 (21 Oct 2026, Chris Ward)'
PRD_READ = "read 22 Oct 2026"
JIRA_NAME = "Developer verify task SV-11597 \"A/R & A/P aging — verify Phase 1: shared report kit\" (updated 21 Oct 2026)"
DESIGN_URL = "https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4"
SETUP_URL = ("https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/"
             "ar-ap-report-sorting/AR-AP-SETUP-FILE.md")
NOBUILD = "The build is not yet available to check this case against."
MARKER = "AUTOMATION: HOLD - not yet build-verified (no build yet)"
PRE_REL = "AUTOMATION: HOLD - needs records and screenshots captured before the release is installed on the test site"
BLOCKED = 'If any record above is missing, mark this test Blocked: "setup not done".'

# ---- requirement codes (S1-R1 ... S9-N2) -------------------------------------------------------------------------------------
CODE = {}
for line in PRD_TXT.split("\n"):
    m = re.match(r"^-?\s*(S\d+-[RNE]\d+[a-z]?):\s*(.*)$", line)
    if m: CODE[m.group(1)] = m.group(2).strip()

def prd_line(start):
    for line in PRD_TXT.split("\n"):
        t = re.sub(r"^\s*-\s*", "", line).strip()
        if t.startswith(start): return t
    raise KeyError(start)

def prd_sentence(start):
    """One sentence of the PRD, from its start to the first full stop that ends it (kept verbatim)."""
    i = PRDW.find(start)
    if i < 0: raise KeyError(start)
    j = PRDW.find(". ", i)
    return PRDW[i: j + 1 if j > 0 else None]

# ---- named PRD items that carry no code (all must be covered or listed as not testable) ----------------------------------------
NAMED = {}
def _n(key, label, text): NAMED[key] = (label, text)
_n("EH", "Story 3, Error Handling", prd_line("If an export fails for any other reason"))
# User Feedback Summary rows (Trigger | Message | Behavior), quoted as the table row reads
_ufs = []
_inside = False
for line in PRD_MD.split("\n"):
    if line.startswith("## 8. User Feedback Summary"): _inside = True; continue
    if _inside and line.startswith("## "): break
    if _inside and line.startswith("| ") and not line.startswith("| Trigger") and not line.startswith("| ---"):
        _ufs.append(" | ".join(x.strip() for x in line.strip().strip("|").split("|")))
for i, row in enumerate(_ufs, 1): _n(f"UFS-{i}", "User Feedback Summary", row)
# What changes for existing users (10 bullets)
_WC = ["A/R reports no longer come out in an unpredictable order", "A/P Detail opens with rows in vendor name order",
       "A/R's Print button becomes the Export menu", "The Totals row on A/R Collection and A/P Unpaid Invoices now follows",
       "The A/R Summary Totals row now adds up exactly", "Clicking a row no longer opens it.",
       "The date filter is labelled", "Re-sorting A/R Collection or A/P Unpaid Invoices no longer collapses",
       "The A/R column \"Location full name\"", "Which rows and amounts each user can see is unchanged"]
for i, s in enumerate(_WC, 1): _n(f"WC-{i}", "What changes for existing users", prd_line(s))
# Out of Scope (9 bullets)
_OOS = ["Background exports for very large reports", "Restricting these reports by the user's location enrollment.",
        "Renaming columns other than Location.", "Other improvements found in research,",
        "Email and a primary contact on the A/R Collection call list.", "Links for A/R credit memos and deposits.",
        "A/P print from a separate print button.", "The location switcher in the top right of ShopView.",
        "A phone or tablet layout."]
for i, s in enumerate(_OOS, 1): _n(f"OOS-{i}", "Out of Scope", prd_line(s))
# Key decisions that add a testable sentence not carried by a code
_n("KD-PERM", "Key Decisions, Permissions", prd_line("Permissions. Viewing all six reports"))
_n("KD-ROW", "Key Decisions, row location", prd_line("A row belongs to the location of its own open document"))
_n("KD-REUSE", "Key Decisions, reuse rule", prd_line("The reuse rule."))
_n("KD-DRILL", "Key Decisions, drill-down", prd_line("Drill-down keeps the report's scope."))
_n("KD-ORG", "Key Decisions, organization-wide", prd_line("The reports stay organization-wide, by decision."))
_n("GOAL-ACCESS", "Goals", prd_line("Nobody gains or loses access to any data, and no setup is needed."))
_n("ASSUME-13540", "Assumptions", prd_line("A shop's A/P Detail can carry well over 10,000 open lines"))
_n("FORM", "Form factor", prd_line("Form factor: Desktop only by rule: these are detailed reports."))
# the S2-R1 and S8-R1 sub-bullets (per report)
SUB = {
    "S2-R1 ARS": ("S2-R1, A/R Summary and A/P Summary columns", prd_line("A/R Summary and A/P Summary: the name column")),
    "S2-R1 ARD": ("S2-R1, A/R Detail columns", prd_line("A/R Detail: Date, Location")),
    "S2-R1 ARC": ("S2-R1, A/R Collection columns", prd_line("A/R Collection: Date, Location")),
    "S2-R1 APD": ("S2-R1, A/P Detail and A/P Unpaid Invoices columns", prd_line("A/P Detail and A/P Unpaid Invoices: Date")),
    "S8-R1 ARS": ("S8-R1, A/R Summary description", prd_line("A/R Summary: \"Each customer")),
    "S8-R1 ARD": ("S8-R1, A/R Detail description", prd_line("A/R Detail: \"Each customer")),
    "S8-R1 ARC": ("S8-R1, A/R Collection description", prd_line("A/R Collection: \"Overdue invoices")),
    "S8-R1 APS": ("S8-R1, A/P Summary description", prd_line("A/P Summary: \"Your unpaid balance")),
    "S8-R1 APD": ("S8-R1, A/P Detail description", prd_line("A/P Detail: \"Unpaid bills")),
    "S8-R1 APU": ("S8-R1, A/P Unpaid Invoices description", prd_line("A/P Unpaid Invoices: \"Unpaid bills")),
}
SUB["S2-R1 APS"] = SUB["S2-R1 ARS"]; SUB["S2-R1 APU"] = SUB["S2-R1 APD"]

# Items that cannot be turned into a check a tester can run, with the reason (Rule 64: stated, never silently dropped)
NOT_TESTABLE = {}

# ---- reports ------------------------------------------------------------------------------------------------------------------
REPORTS = {"ARS": "A/R Summary", "ARD": "A/R Detail", "ARC": "A/R Collection",
           "APS": "A/P Summary", "APD": "A/P Detail", "APU": "A/P Unpaid Invoices"}
ALL6 = list(REPORTS); GROUPED = ["ARD", "ARC", "APD", "APU"]
# Every report a requirement names must be covered by at least one case quoting it (brief, point 1)
NEEDS = {
    "S1-R1": ["ARS", "APS"], "S1-R2": ["ARS", "APS"], "S1-R3": ["ARS", "APS"], "S1-R4": ["ARS", "APS"], "S1-R5": ["ARD", "APD"],
    "S1-R6": ["ARC", "APU"], "S1-R7": ALL6, "S1-R8": ALL6, "S1-N1": ALL6, "S1-E1": ["ARS"],
    "S2-R1": ALL6, "S2-R2": ALL6, "S2-R3": ALL6, "S2-R4": GROUPED, "S2-R5": GROUPED, "S2-R6": ["APU", "APD"], "S2-R7": ALL6,
    "S2-R8": ALL6, "S2-R9": GROUPED, "S2-N1": ["APU"],
    "S3-R1": ALL6, "S3-R2": ALL6, "S3-R3": ALL6, "S3-R4": ALL6, "S3-R5": ALL6, "S3-R6": ALL6, "S3-R7": ["ARS", "APS"],
    "S3-R8": ALL6, "S3-R8a": ["ARC"], "S3-R10": ALL6,
    "S4-R1": GROUPED, "S4-R2": ["ARC", "APU"], "S4-R3": GROUPED, "S4-R4": ["ARD", "APD"], "S4-R5": GROUPED, "S4-R6": GROUPED,
    "S4-R7": GROUPED, "S4-R8": GROUPED, "S4-R9": GROUPED, "S4-N1": GROUPED, "S4-N2": ["ARS", "APS"],
    "S5-R1": ALL6, "S5-R6": ALL6, "S5-R8": ["ARS", "APS"], "S5-R11": ["ARS", "APS", "ARC", "APU"], "S5-R13": ALL6, "S5-R15": ALL6,
    "S5-R16": ["ARD", "ARC", "APD", "APU"], "S5-R17": ["ARS", "APS"], "S5-R18": ALL6,
    "S6-R1": ALL6, "S6-R2": ALL6, "S6-R3": ALL6, "S6-R4": ["ARS", "APS"],
    "S7-R9": ["APD", "APU"], "S8-R1": ALL6, "S8-R3": ALL6, "S8-R4": ALL6, "S8-R5": ALL6,
    "S9-R1": ["ARC"], "S9-R2": ["ARC"], "S9-R3": ["ARC"], "S9-N1": ["ARC"], "S9-N2": ["ARC"],
    "WC-10": ALL6,
}

STORY = {1: ("SV-11531", "Story 1, Reports open in QuickBooks name order"),
         2: ("SV-11532", "Story 2, Sort by clicking any column header"),
         3: ("SV-11533", "Story 3, Export to PDF and CSV"),
         4: ("SV-11534", "Story 4, Collapse all, Expand all and pinned group rows"),
         5: ("SV-11535", "Story 5, Filters: customer or vendor, past due and location"),
         6: ("SV-11536", "Story 6, Location column"),
         7: ("SV-11537", "Story 7, Document links open where they can"),
         8: ("SV-11538", "Story 8, Report descriptions and layout"),
         9: ("SV-11539", "Story 9, A/R Collection call list")}
DESIGN_PAGE = {1: "page 1 (Opening order and header sorting)", 2: "page 1 (Opening order and header sorting)", 3: "page 2 (Export)",
               4: "page 3 (Collapse all and pinned group rows)",
               5: "page 4 (Location filter and Location column) and page 7 (Filters and call list)",
               6: "page 4 (Location filter and Location column)",
               7: "page 5 (Document links and Switch location) and page 7 (vendor credit link)",
               8: "page 6 (Descriptions and pinned column)", 9: "page 7 (Filters and call list)"}
NAMED_STORY = {"EH": 3, "UFS-1": 3, "UFS-2": 3, "UFS-3": 7, "UFS-4": 7, "UFS-5": 4, "UFS-6": 3, "UFS-7": 3, "UFS-8": 3,
               "UFS-9": 8, "UFS-10": 8}

CASES = []
def C(key, sec, title, pre, steps, res, q, stories=None, note="", marker=None, known="", reports=None, design=None):
    """pre: list of str or (state, example). res: one 'Step N:' line per step. q: PRD codes, NAMED keys, SUB keys or ('label', 'verbatim')."""
    CASES.append(dict(key=key, sec=sec, title=title, pre=[p if isinstance(p, tuple) else (p, None) for p in pre] + [(BLOCKED, None)],
                      steps=steps, res=res, q=q, stories=stories, note=note, marker=marker or MARKER, known=known,
                      reports=reports, design=design))

def quotes(c):
    out = []
    for x in c["q"]:
        if isinstance(x, tuple): out.append(x)
        elif x in CODE: out.append((x, CODE[x]))
        elif x in NAMED: out.append(NAMED[x])
        elif x in SUB: out.append(SUB[x])
        else: raise KeyError(f"{c['key']}: unknown quote key {x}")
    return out

def codes_of(c):
    """Every requirement code or named item a case covers."""
    out = set()
    for x in c["q"]:
        if isinstance(x, str):
            out.add(x.split(" ")[0] if x in SUB else x)
        else:
            m = re.match(r"(S\d+-[RNE]\d+[a-z]?)", x[0])
            if m: out.add(m.group(1))
    return out

def story_nums(c):
    if c["stories"]: return c["stories"]
    s = set()
    for k in codes_of(c):
        m = re.match(r"S(\d+)-", k)
        if m: s.add(int(m.group(1)))
        elif k in NAMED_STORY: s.add(NAMED_STORY[k])
    return sorted(s) or [1]

RPAT = {k: re.compile(re.escape(v) + (r"(?! Invoices)" if False else "")) for k, v in REPORTS.items()}
def reports_of(c):
    if c["reports"]: return c["reports"]
    text = " ".join([c["title"]] + [a for a, _ in c["pre"]] + c["steps"] + c["res"])
    return [k for k, v in REPORTS.items() if v in text]

e = lambda s: html.escape(s, quote=False)

def design_block(c):
    """Rule 117 tenth amendment: design references in their own block. The design could not be read on 22 Oct 2026."""
    pages = sorted({DESIGN_PAGE[n] for n in story_nums(c) if n in DESIGN_PAGE})
    ref = (f'Design canvas "A/R and A/P Report Sorting" ({DESIGN_URL}), ' + " and ".join(pages) + " as the PRD names it. "
           "Not yet read: the design was not available to this pass (22 Oct 2026), so nothing here is taken from it. "
           "When the design is driven, this case is re-checked against it (Rules 120, 122).")
    h = "<p></p><p><strong>References from Design</strong></p>" + f"<p>{e(c['design'] or ref)}</p>"
    return h + "<p></p>"

def quotes_block(c):
    """Rule 117 eleventh amendment: each document quoted gets a "From:" line above its own quotes; the epic and the stories go on
    the first "From:" line; the build line follows the last quote."""
    prd, jira = [], []
    for l, t in quotes(c):
        (jira if l.startswith("Jira SV-") else prd).append((l, t))
    sto = ", ".join(f"story {STORY[n][0]} ({STORY[n][1]})" for n in story_nums(c))
    h = "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
    h += f"<p>From: {e(PRD_NAME)}, {PRD_READ} &middot; Epic SV-11315, {e(sto)}</p>"
    h += "<ul>" + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(t)}&rdquo;</li>" for l, t in prd) + "</ul>"
    if jira:
        h += f"<p>From: {e(JIRA_NAME)}, {PRD_READ}</p>"
        h += "<ul>" + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(t)}&rdquo;</li>" for l, t in jira) + "</ul>"
    return h + f"<p>{e(NOBUILD)}</p>"

def render(c):
    pre = (f'<p><strong><a href="{SETUP_URL}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
           "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in c["pre"]) + "</ul>")
    exp = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(r)}</li>" for r in c["res"]) + "</ul>"
           + (f"<p>{e(c['known'])}</p>" if c["known"] else "")
           + (f"<p>{e(c['note'])}</p>" if c["note"] else "")
           + quotes_block(c) + design_block(c) + f"<p>{e(c['marker'])}</p>")
    refs = ",".join(dict.fromkeys(STORY[n][0] for n in story_nums(c)))
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": refs, "custom_automation_type": 2,
            "custom_atmstatus": 1, "custom_preconds": pre, "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in c["steps"]) + "</ol>",
            "custom_expected": exp}

PH = re.compile(r"\{([A-Z][^{}]*)\}")
JARGON = re.compile(r"\b(API|HTTP|endpoint|database|devtools|DevTools|console|SQL|query string|JSON)\b")
def check(c):
    p, k = [], c["key"]
    if len(c["title"]) > 80 or ";" in c["title"]: p.append(f"{k}: title {len(c['title'])} chars or has a semicolon")
    if c["sec"] == "DESIGN" and not c["title"].startswith("Design: "): p.append(f"{k}: design title must start 'Design: '")
    if c["sec"] != "DESIGN" and c["title"].startswith("Design"): p.append(f"{k}: a 'Design: ' title outside the design section")
    if len(c["res"]) != len(c["steps"]): p.append(f"{k}: {len(c['res'])} results for {len(c['steps'])} steps")
    for i, r in enumerate(c["res"], 1):
        if not r.startswith(f"Step {i}: "): p.append(f"{k}: result {i} does not start 'Step {i}: '")
    defined = set(PH.findall(" ".join(a for a, _ in c["pre"])))
    used_pre = PH.findall(" ".join(a for a, _ in c["pre"]))
    for x in set(PH.findall(" ".join(c["steps"] + c["res"] + [c["known"], c["note"]]))):
        if x not in defined: p.append(f"{k}: {{{x}}} not defined in preconditions")
    for x in set(PH.findall(" ".join(b or "" for _, b in c["pre"]))):
        if x not in defined: p.append(f"{k}: example line names {{{x}}} that no precondition defines")
    for a, b in c["pre"]:
        if b and not b.startswith("For example:"): p.append(f"{k}: example line must start 'For example:'")
        if PH.search(a) and not b and a != BLOCKED and not a.startswith("Starting screen") and "{Location-" not in a and "{Role-" not in a:
            pass
    tester = " ".join([a for a, _ in c["pre"]] + c["steps"] + c["res"])
    if "ZZAUTOTEST" in tester: p.append(f"{k}: hard-coded record in tester text (examples go on the For example line)")
    if re.search(r"\bS\d+-[RNE]\d+", tester): p.append(f"{k}: requirement code in tester text")
    if JARGON.search(tester): p.append(f"{k}: technical term in tester text: {JARGON.search(tester).group(0)}")
    for l, t in quotes(c):
        src = JIRAW if l.startswith("Jira SV-") else None
        if src is not None:
            if ws(t) not in src: p.append(f"{k}: quote {l} not verbatim in the Jira reading record")
        elif ws(t) not in PRDW and ws(t) not in PRD_RAWW: p.append(f"{k}: quote {l} not verbatim in PRD v5")
    if not c["q"]: p.append(f"{k}: no source quote (Rule 64)")
    if len(c["pre"]) > 8: p.append(f"{k}: {len(c['pre'])} preconditions")
    if len(c["steps"]) > 10: p.append(f"{k}: {len(c['steps'])} steps (over 10: ask before splitting, Rule 127)")
    if not c["marker"].startswith("AUTOMATION: "): p.append(f"{k}: marker")
    return p
