"""Splitting Sales Representatives — case model, quote lookup, checks and TestRail rendering (19 Oct 2026; PRD v10 and Chris Ward's answers, 20 Oct 2026).
Shape: Rule 117 ninth amendment (two-audience), WITHOUT the setup-file link (QA lead, 19 Oct 2026: "do not attach that claude file …
but keep it prepared"). Every expected result comes from a verbatim source sentence (Rules 57, 113); the build is not yet available."""
import os, re, html, json
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
def ws(s): return re.sub(r"\s+", " ", html.unescape(s).replace("**", "").replace("\\", "")).strip()
def md_to_text(md):
    """PRD v10 is saved as markdown (20 Oct 2026). Turn it into the plain lines the v8 text had: no ** or \\, no blockquote mark,
    links reduced to their words, an italic context note "> *\\* Context note ...*" back to "* Context note ...", one table cell per line."""
    out = []
    for line in md.split("\n"):
        t = line.replace("\\", "")
        t = re.sub(r"^>\s*", "", t)
        t = re.sub(r"^\*\*\s*(Context note.*?)\*?\s*$", r"* \1", t)
        t = t.replace("**", "")
        t = re.sub(r"\[([^\]]*)\]\(([^)]*)\)", r"\1", t)
        t = re.sub(r"<(https?://[^>]*)>", r"\1", t)
        t = re.sub(r"^#+\s*", "", t)
        if t.startswith("|"):
            out += [x.strip() for x in t.strip().strip("|").split("|") if x.strip() and not re.fullmatch(r"-+", x.strip())]
        else: out.append(t)
    return "\n".join(out)
PRD_TXT = md_to_text(open(f"{P}/prd-v11-2026-10-22/CONFLUENCE-919928833-v11-2026-10-22.md").read())
PRDW = ws(PRD_TXT)
TPW = ws(open(f"{P}/sources/Tech-Plan-Splitting-Sales-Representatives-2026-10-19-upload.md").read())
SBRW = ws(open(f"{P}/report-specs/SBR-585629698-v28-2026-10-19.txt").read())
SBCW = ws(open(f"{P}/report-specs/SBC-577634305-v21-2026-10-19.txt").read())
import json as _json
_DI = _json.load(open(f"{P}/design-drive-2026-10-19/design-text-inventory-2026-10-19.json"))
DESW = ws(" ".join(x["text"].replace(" / ", " ") for x in _DI if x["src"] in ("A-title", "A-note")))
SPEC_NAMES = {"Sales By Representative spec": "\"SBR (Sales By Representative) Report\" spec, Confluence 585629698, version 28 (12 Oct 2026)", "Sales By Customer spec": "\"SBC (Sales By Customer) Report\" spec, Confluence 577634305, version 21 (6 Oct 2026)"}
TP_NAME = "Tech plan \"Splitting Sales Representatives — Technical Implementation Plan\" (dated 14 Oct 2026, planned against PRD version 8; uploaded 19 Oct 2026 and again, byte-identical, 22 Oct 2026)"
CODE = {}
for line in PRD_TXT.split("\n"):
    m = re.match(r"^-?\s*(S\d+-[RNE]\d+[a-z]?):\s*(.*)$", line)
    # 22 Oct 2026, Rule 136 pass: the first line is the requirement itself; a later cell of the PRD's change-log table can start with
    # the same code (PRD v11: "S4-R21: the Deactivate window line reads ... v10.") and must not replace it.
    if m and m.group(1) not in CODE: CODE[m.group(1)] = m.group(2).strip()
# 23 Oct 2026: Chris Ward answered question 41 and the PRD moved to version 13 (only S4-R7 and S4-R8 changed). The QA lead chose the
# named set: only the cases in V13 quote version 13 (and Chris Ward's answer 41); every other case keeps its version 11 quotes, which
# are word for word the same in version 13.
PRD13_TXT = md_to_text(open(f"{P}/prd-v13-2026-10-23/CONFLUENCE-919928833-v13-2026-10-23.md").read())
PRDW13 = ws(PRD13_TXT)
CODE13 = {}
for line in PRD13_TXT.split("\n"):
    m = re.match(r"^-?\s*(S\d+-[RNE]\d+[a-z]?):\s*(.*)$", line)
    if m and m.group(1) not in CODE13: CODE13[m.group(1)] = m.group(2).strip()
PRD13_NAME = 'PRD "Splitting Sales Representatives", Confluence 919928833, version 13 (23 Oct 2026, Chris Ward)'
ANS13_NAME = "Chris Ward's answers to the Splitting Sales Representatives question sheet (answers 1 to 38, 19 Oct 2026; answers 39 and 40, 21 Oct 2026; answer 41, 23 Oct 2026)"
V13 = {"S3-03", "S4-03", "S4-03b", "S4-04", "S4-04c", "D-11", "D-13", "S1-01"}  # S1-01 rebuilt from v13 on 26 Oct 2026
def prd_line(start):
    for line in PRD_TXT.split("\n"):
        t = re.sub(r"^-\s*", "", line).strip()
        if t.startswith(start): return t
    raise KeyError(start)
STORY = {1: ("SV-11265", "Story 1, Give a work order its sales representative"),
         2: ("SV-11266", "Story 2, Give a work order a separate Labor and Parts representative"),
         3: ("SV-11267", "Story 3, Set the representatives on a phone"),
         4: ("SV-11268", "Story 4, Give a customer default representatives"),
         5: ("SV-11269", "Story 5, Credit each side on the invoice and in Sales By Representative"),
         6: ("SV-11270", "Story 6, Print both representatives on the work order"),
         7: ("SV-11271", "Story 7, Record representative changes in the work order log"),
         8: ("SV-11272", "Story 8, Filter both sales reports by Sales Type")}
DESIGN_PAGE = {1: "1", 2: "1", 3: "6", 4: "2", 5: "4", 6: "1", 8: "4 and 5"}
PRD_NAME = 'PRD "Splitting Sales Representatives", Confluence 919928833, version 11 (21 Oct 2026, Chris Ward)'
# Chris Ward's answers to our question sheet (Google Sheet 17Ry1Bt..., rows 6-43), saved 20 Oct 2026 (design-recheck-2026-10-20/chris-answers.json)
ANS_NAME = "Chris Ward's answers to the Splitting Sales Representatives question sheet (answers 1 to 38, 19 Oct 2026; answers 39 and 40, 21 Oct 2026)"
ANS = {a["no"]: a["answer_verbatim"] for a in json.load(open(f"{P}/design-recheck-2026-10-20/chris-answers.json"))["answers"]}
def AQ(n, part=None):
    """Quote Chris Ward's answer n (verbatim, or one verbatim sentence of it)."""
    return (f"Chris Ward's answer {n}", part or ANS[n])
READ = {"PRD": "read 22 Oct 2026", "Chris Ward's answer": "read 22 Oct 2026", "Tech plan": "read in full 22 Oct 2026"}
NOBUILD = "The build is not yet available to check this case against."
MARKER = "AUTOMATION: HOLD - not yet build-verified (no build yet)"
BLOCKED = 'If any record above is missing, mark this test Blocked: "setup not done".'
CASES = []

def setup_order(pre):
    """26 Oct 2026, Rule 117 thirteenth amendment: the preconditions read in the order a tester sets the account up (who you are, the
    records, their state, then the screen). The design cases' browser-window line (window width, zoom and the attached design pictures)
    describes where the test is watched, so it sits directly above the "Starting screen:" line (which may say "in that browser window")
    instead of between the role and the records, or after the starting screen. No line is changed, added or dropped."""
    win = [x for x in pre if x[0].startswith("The browser window is ")]
    rest = [x for x in pre if x not in win]
    i = next((n for n, x in enumerate(rest) if x[0].startswith("Starting screen:")), len(rest))
    return rest[:i] + win + rest[i:]

def C(key, sec, title, pre, steps, res, q, stories=None, extra_src="", note="", marker=None, known="", pictures=None, design_src=""):
    """pre: list of str or (state, example). res: one 'Step N:' line per step. q: list of PRD codes or ('label', 'verbatim text').
    The case's "Scenario:" line (26 Oct 2026) lives in scenarios.py and is rendered first in the Preconditions."""
    CASES.append(dict(key=key, sec=sec, title=title, pre=setup_order([p if isinstance(p, tuple) else (p, None) for p in pre]) + [(BLOCKED, None)],
                      steps=steps, res=res, q=q, stories=stories, extra_src=extra_src, note=note, marker=marker or MARKER, known=known, pictures=pictures or [], design_src=design_src))

def quotes(c):
    out = []
    for x in c["q"]:
        if isinstance(x, tuple): out.append(x)
        else: out.append((x, (CODE13 if c["key"] in V13 else CODE)[x]))
    return out

def story_nums(c):
    if c["stories"]: return c["stories"]
    return sorted({int(re.match(r"S(\d+)-", x).group(1)) for x in c["q"] if isinstance(x, str)})

def source(c):
    st = story_nums(c)
    sto = "; ".join(f"story {STORY[n][0]} ({STORY[n][1]})" for n in st)
    codes = [x for x in c["q"] if isinstance(x, str)]
    other = [x[0] for x in c["q"] if isinstance(x, tuple)]
    refs = ", ".join(codes + [l for l in other if not l.startswith(("Design —", "Tech plan", "Sales By Representative spec", "Sales By Customer spec"))])
    s = f"Epic SV-10890; {sto}; {PRD_NAME}, {refs}, read 20 Oct 2026."
    if any(l.startswith("Tech plan") for l in other): s += f" {TP_NAME}, " + ", ".join(l for l in other if l.startswith("Tech plan")) + ", read 19 Oct 2026."
    for k, v in SPEC_NAMES.items():
        ls = [l.split(", ", 1)[1] for l in other if l.startswith(k)]
        if ls: s += f" {v}, " + ", ".join(ls) + ", read 19 Oct 2026."
    if c["extra_src"]: s += " " + c["extra_src"]
    return s + " Source-verified 20 October 2026. " + NOBUILD

def design_ref(c):
    """The design references of a case, shown under their own title "References from Design" (QA lead, 19 Oct 2026)."""
    if c.get("design_src"): return c["design_src"]
    pg = sorted({DESIGN_PAGE[n] for n in story_nums(c) if n in DESIGN_PAGE})
    if not pg and 7 in story_nums(c):
        return ('Claude design canvas "Splitting Sales Representatives" (https://claude.ai/artifact/8MHqwyffAYtqZ6EccS5RUm), page 1, '
                'board 1.19 "The log records every rep change", export read 19 Oct 2026. The PRD\'s Story 7 says "Design: none", yet this board '
                'shows the log; its wording is checked in the "Design — how it looks" case for the log.')
    if not pg: return ""
    return ('Claude design canvas "Splitting Sales Representatives" (https://claude.ai/artifact/8MHqwyffAYtqZ6EccS5RUm), '
            + (("pages " if " and " in pg[0] else "page ") + pg[0] if len(pg) == 1 else "pages " + ", ".join(pg[:-1]) + " and " + pg[-1])
            + ' (cited by the story), export read 19 Oct 2026, used for on-screen labels; the look itself is checked in the "Design — how it looks" cases.')

e = lambda s: html.escape(s, quote=False)
DESIGN_WORDS = re.compile(r"\b[Dd]esign\b|\bboards?\b|\bpictures?\b|\bcanvas\b")
def design_note(c):
    """A note comparing the design with the PRD belongs under "References from Design", never above it (QA lead, 19 Oct 2026)."""
    return bool(c["note"]) and bool(DESIGN_WORDS.search(c["note"]))
def design_block(c):
    dq = [(l, t) for l, t in quotes(c) if l.startswith("Design — board")]
    ref = design_ref(c)
    if not (ref or dq or c["pictures"] or design_note(c)): return ""
    h = "<p></p><p><strong>References from Design</strong></p>"
    if ref: h += f"<p>{e(ref)}</p>"
    if design_note(c): h += f"<p><strong>Where the design and the PRD differ:</strong> {e(c['note'])}</p>"
    if c["pictures"]: h += "<p>Design pictures attached to this case: " + e(", ".join(c["pictures"])) + ".</p>"
    if dq: h += "<ul>" + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(t)}&rdquo;</li>" for l, t in dq) + "</ul>"
    return h + "<p></p>"

DOCS = [("PRD", None), ("Chris Ward's answer", ANS_NAME), ("Tech plan", TP_NAME)] + [(k, v) for k, v in SPEC_NAMES.items()]
def doc_of(label):
    for k, _ in DOCS[1:]:
        if label.startswith(k): return k
    return "PRD"
def quotes_block(c):
    """Rule 117 eleventh amendment (QA lead, 19 Oct 2026, PERMANENT): no separate Source paragraph. Each document quoted gets one
    "From:" line (name, version, date, read date) directly above its own quotes; the epic and story go on the first "From:" line;
    the build line follows the last quote."""
    groups = {}
    for l, t in quotes(c):
        if l.startswith("Design — board"): continue
        groups.setdefault(doc_of(l), []).append((l, t))
    sto = ", ".join(f"story {STORY[n][0]} ({STORY[n][1]})" for n in story_nums(c))
    tickets = f"Epic SV-10890, {sto}"
    h = ("<p><strong>Traceability: the requirements this test checks, quoted exactly</strong></p>" if LAYOUT_V2.get(c["key"], {}).get("iso")
         else "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>")
    first = True
    for k, name in DOCS:
        if k not in groups: continue
        if c["key"] in V13 and k in ("PRD", "Chris Ward's answer"):
            name, rd = (PRD13_NAME if k == "PRD" else ANS13_NAME), "read 23 Oct 2026"
        else: rd = READ.get(k, 'read 19 Oct 2026')
        h += f"<p>From: {e(name or PRD_NAME)}, {rd}" + (f" &middot; {e(tickets)}" if first else "") + "</p>"
        h += "<ul>" + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(t)}&rdquo;</li>" for l, t in groups[k]) + "</ul>"
        first = False
    return h + f"<p>{e(NOBUILD)}</p>"

from scenarios import SCENARIO
SCEN_PREFIX = "Scenario: "
def scenario_line(key):
    return SCEN_PREFIX + SCENARIO[key] if key in SCENARIO else None
def scenario_problems(key, preconds_html):
    """SCENARIO GATE (Rule 117 thirteenth amendment, 26 Oct 2026): exactly one "Scenario:" line, the first line of the Preconditions,
    at most 40 words, with no requirement code and no "QA lead" / "ask your" / who-to-ask wording."""
    p = []
    items = [html.unescape(re.sub(r"<[^>]+>", " ", x)).strip() for x in re.findall(r"<li>(.*?)</li>", preconds_html, re.S)]
    if preconds_html.count("Scenario:") != 1: p.append(f"{key}: Preconditions hold {preconds_html.count('Scenario:')} Scenario lines (must be exactly one)")
    if not items or not items[0].startswith(SCEN_PREFIX): p.append(f"{key}: the first precondition is not the Scenario line")  # in the trial layout the Scenario is the first list item, after the Objective paragraph
    else:
        t = items[0][len(SCEN_PREFIX):]
        w = len(t.split())
        if w > 40: p.append(f"{key}: Scenario line has {w} words (at most 40)")
        if re.search(r"\bS\d+-[RNE]\d+", t): p.append(f"{key}: requirement code in the Scenario line")
        if re.search(r"QA lead|ask your|\bask\b|set aside", t, re.I): p.append(f"{key}: who-to-ask or generic wording in the Scenario line")
        if re.search(r"\{[A-Z][^{}]*\}|ZZAUTOTEST", t): p.append(f"{key}: placeholder or record name in the Scenario line")
    return p

SPACE_AFTER_RESULTS = {"S1-01"}  # trial case first (26 Oct 2026); widened once the QA lead approves the style
from trial_layout import LAYOUT_V2
def render_pre_v2(c, L):
    """Trial layout (26 Oct 2026): Objective, Scenario, Test data, Before you start; the Blocked line closes it."""
    return ("<p><strong>Objective</strong></p><p>" + e(L["objective"]) + "</p>"
            + "<ul><li>" + e(scenario_line(c["key"])) + "</li></ul>"
            + "<p><strong>Test data (create these in the account first)</strong></p><ul>"
            + "".join(f"<li><strong>{e(n)}</strong>: {e(w)}.<br>For example: {e(x)}.</li>" for n, w, x in L["data"]) + "</ul>"
            + "<p><strong>Before you start</strong></p><ul>" + "".join(f"<li>{e(x)}</li>" for x in L["before"])
            + f"<li>{e(BLOCKED)}</li></ul>")
def render_pre_iso(c, L):
    """ISO/IEC/IEEE 29119-3 trial (26 Oct 2026, QA lead: "Follow this ISO 29119-3 standard ... One tells what to do and other tells
    what to expect"): Objective, Priority, Preconditions as numbered actions (what to do before the test), Test inputs, Blocked line."""
    return ("<p><strong>Objective</strong></p><p>" + e(L["objective"]) + "</p>"
            + "<ul><li>" + e(scenario_line(c["key"])) + "</li></ul>"
            + "<p><strong>Priority</strong>: " + e(L["priority"]) + "</p>"
            + "<p><strong>Preconditions: do these before you start</strong></p><ol>" + "".join(f"<li>{e(x)}</li>" for x in L["setup"]) + "</ol>"
            + "<p><strong>Test inputs</strong></p><ul>" + "".join(f"<li><strong>{e(n)}</strong>: {e(x)}.</li>" for n, x in L["inputs"]) + "</ul>"
            + "<p>If you cannot complete any precondition above, mark this test Blocked: \"setup not done\".</p>")
def render(c):
    sc = scenario_line(c["key"]); L = LAYOUT_V2.get(c["key"])
    pre = (render_pre_iso(c, L) if L.get("iso") else render_pre_v2(c, L)) if L else ("<p><strong>Preconditions</strong></p><ul>" + (f"<li>{e(sc)}</li>" if sc else "") + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in c["pre"]) + "</ul>")
    exp = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(r)}</li>" for r in c["res"]) + "</ul>"
           + (f"<p><strong>Pass / fail criteria</strong></p><p>{e(L['passfail'])}</p>" if L and L.get("iso") else (f"<p><strong>{e(L['passfail'])}</strong></p>" if L else ""))
           + ("<p></p>" if c["key"] in SPACE_AFTER_RESULTS else "")  # 26 Oct 2026, QA lead: "keep a space after the expected results end"
           + (f"<p>{e(c['known'])}</p>" if c["known"] else "")
           + (f"<p>{e(c['note'])}</p>" if c["note"] and not design_note(c) else "")
           + quotes_block(c)
           + design_block(c)
           + f"<p>{e(c['marker'])}</p>")
    refs = ",".join(dict.fromkeys(STORY[n][0] for n in story_nums(c)))
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": refs, "custom_automation_type": 2,
            "custom_atmstatus": 1, "custom_preconds": pre, "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in c["steps"]) + "</ol>",
            "custom_expected": exp}

PH = re.compile(r"\{([A-Z][^{}]*)\}")
def check(c, extra_sources=None):
    p, k = [], c["key"]
    if len(c["title"]) > 80 or ";" in c["title"]: p.append(f"{k}: title {len(c['title'])}")
    if len(c["res"]) != len(c["steps"]): p.append(f"{k}: {len(c['res'])} results for {len(c['steps'])} steps")
    for i, r in enumerate(c["res"], 1):
        if not r.startswith(f"Step {i}: "): p.append(f"{k}: result {i} does not start 'Step {i}: '")
    defined = set(PH.findall(" ".join(a for a, _ in c["pre"])))
    for x in set(PH.findall(" ".join(c["steps"] + c["res"] + [c["known"]]))):
        if x not in defined: p.append(f"{k}: {{{x}}} not defined in preconditions")
    for a, b in c["pre"]:
        if b and not b.startswith("For example:"): p.append(f"{k}: example line must start 'For example:'")
    tester = " ".join([a for a, _ in c["pre"]] + c["steps"] + c["res"])
    if "ZZAUTOTEST" in tester: p.append(f"{k}: hard-coded record in tester text")
    if re.search(r"\bS\d+-[RNE]\d+", tester): p.append(f"{k}: requirement code in tester text")
    for l, t in quotes(c):
        if l.startswith("Chris Ward's answer"):
            n = int(l.split()[-1])
            if ws(t) not in ws(ANS[n]): p.append(f"{k}: quote {l} not verbatim")
            continue
        src = DESW if l.startswith("Design — board") else TPW if l.startswith("Tech plan") else SBRW if l.startswith("Sales By Representative spec") else SBCW if l.startswith("Sales By Customer spec") else ((PRDW13 if k in V13 else PRDW) if not (extra_sources and l in extra_sources) else ws(extra_sources[l]))
        if ws(t) not in src: p.append(f"{k}: quote {l} not verbatim")
    if len(c["pre"]) > 7: p.append(f"{k}: {len(c['pre'])} preconditions")
    if len(c["steps"]) > 10: p.append(f"{k}: {len(c['steps'])} steps (over 10: split it, or record in SPLITS.json why it stays whole, Rule 136)")
    return p
