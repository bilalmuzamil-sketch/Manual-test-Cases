"""Parts Lifecycle — case model, source parsers, quote lookup, per-case checks and TestRail rendering (full pass, 27 Oct 2026).

Modelled on build/credit-terms/authoring/ct_lib.py, but written natively in the QA lead's pattern (Rule 117 fourteenth amendment,
26 Oct 2026, and fifteenth amendment): cases are authored directly as plain precondition bullets, plain steps and "Step N:" result
bullets. There are no {placeholders}, no "For example:" lines, no Scenario line, no setup-file link and no Blocked line in anything a
tester reads. Examples and recipes for Claude sessions go in the `claude=` field, which only render_setup.py prints (setup file).

Sources (the ONLY sources of expected behaviour, Rule 57):
  PRD  "Parts Lifecycle Update", Confluence 829227015, version 33 (sources/CONFLUENCE-829227015-PartLifecycle-v33-2026-10-27.md)
  TECH tech plan of 7 Oct 2026 (informs, never overrules; Rule 30)
  JIRA epic SV-10647 tickets and comments, read 27 Oct 2026 (sources/jira-2026-10-27/ALL-TICKETS-2026-10-27.md)
  PO   Chris Ward's answers (po-answers-2026-10-09/, po-answers-2026-10-14/)
  DESIGN canvas notes (sources/design-2026-10-13-artifact/files/canvas.json; unchanged 27 Oct) — quoted only under References from Design.

Requirement codes are parsed from the requirement lines themselves ("- **S1-R1:** text"), never from the Change Log (which is cut off
before parsing) or from the User Feedback Summary.
"""
import os, re, html, json, csv
D = os.path.dirname(os.path.abspath(__file__))          # authoring/
P = os.path.dirname(D)                                   # build/founder-mode/part-lifecycle/
FP = f"{P}/full-pass-2026-10-27"

def ws(s): return re.sub(r"\s+", " ", html.unescape(s or "").replace("**", "").replace("\\", "")).strip()

def md_to_text(md):
    out = []
    for line in md.split("\n"):
        t = line.replace("\\", "")
        t = re.sub(r"^>\s*", "", t)
        t = t.replace("**", "")
        t = re.sub(r"(?<![\w*])\*(\S[^*]*?)\*(?![\w*])", r"\1", t)
        t = t.replace("`", "")
        t = re.sub(r"\[([^\]]*)\]\(([^)]*)\)", r"\1", t)
        t = re.sub(r"<([^>]*)>", r"\1", t)
        t = re.sub(r"^#+\s*", "", t)
        if t.startswith("|"):
            out += [x.strip() for x in t.strip().strip("|").split("|") if x.strip() and not re.fullmatch(r"-+", x.strip())]
        else: out.append(t)
    return "\n".join(out)

# ---------------------------------------------------------------- PRD v33 and v35
# 28 Oct 2026 (named set, Rule 122 amendment): the QA lead chose a NAMED SET, not a full pass. Cases in the set carry prd=35 and quote
# PRD v35 (Confluence 829227015 version 35, edited 27 Oct 2026 by Chris Ward); every other case keeps prd=33 and renders exactly as it was
# written on 27 Oct 2026 (quotes, From line and version stamp unchanged). Coverage (build.py) runs on the v35 codes.
PRD_FILES = {33: f"{P}/sources/CONFLUENCE-829227015-PartLifecycle-v33-2026-10-27.md", 35: f"{P}/sources/CONFLUENCE-829227015-2026-10-28.md"}
PRD_NAMES = {33: 'PRD "Parts Lifecycle Update", Confluence 829227015, version 33 (23 Oct 2026, owner Chris Ward)',
             35: 'PRD "Parts Lifecycle Update", Confluence 829227015, version 35 (edited 27 Oct 2026 by Chris Ward)'}
PRD_READ = {33: "read 27 Oct 2026", 35: "read 28 Oct 2026"}

def _parse(ver):
    all_ = open(PRD_FILES[ver]).read()
    md = all_.split("## 9. Change Log")[0]            # the Change Log is never a source of a requirement or a quote
    W = ws(md_to_text(md))
    code, code_story, story_title, named = {}, {}, {}, {}
    story = None
    for line in md.split("\n"):
        m = re.match(r"^### Story (\d+): (.*)$", line)
        if m: story = int(m.group(1)); story_title[story] = m.group(2).strip(); continue
        m = re.match(r"^- \*\*(S\d+-[RNE]\d+[a-z]?):\*\* (.*)$", line)
        if m:
            c = m.group(1)
            if c in code: raise SystemExit(f"v{ver}: code {c} appears twice as a requirement line")
            code[c] = ws(md_to_text(m.group(2)))
            code_story[c] = int(re.match(r"S(\d+)-", c).group(1))
            if code_story[c] != story: raise SystemExit(f"v{ver}: {c} sits under Story {story}")
    # ---- named PRD items with no code (quotable; each a full bullet / row / note, verbatim)
    def _n(key, label, text):
        if ws(text) not in W: raise SystemExit(f"NAMED {key} not verbatim in PRD v{ver}: {text[:80]}")
        named[key] = (label, ws(text))
    def _section(title):
        m = re.search(r"^## " + re.escape(title) + r".*?$(.*?)^## ", md, re.M | re.S)
        return m.group(1) if m else ""
    def _bullets(block):
        return [ws(md_to_text(x)) for x in re.findall(r"^- (.*)$", block, re.M)]
    fo = _section("2. Feature Overview")
    for head, pre in (("Core functionality", "FO"), ("Accounting", "ACC"), ("Form factor", "FF"), ("Out of scope", "OOS")):
        m = re.search(r"\*\*" + head + r"\*\*(.*?)(?:\n\*\*|\Z)", fo, re.S)
        for i, b in enumerate(_bullets(m.group(1)), 1): _n(f"{pre}-{i}", f"Feature Overview, {head}", b)
    for i, b in enumerate(_bullets(_section("3. Jobs to be Done / Goals")), 1): _n(f"GOAL-{i}", "Goals", b)
    for i, b in enumerate(_bullets(_section("4. Key Decisions")), 1): _n(f"KD-{i}", "Key Decisions", b)
    for i, b in enumerate(_bullets(_section("5. Terminology")), 1): _n(f"TERM-{i}", "Terminology", b)
    for i, b in enumerate(_bullets(_section("6. Assumptions")), 1): _n(f"ASSUME-{i}", "Assumptions", b)
    # context notes, story by story ("CN-S<n>-<i>")
    story = None; cn = {}
    for line in md.split("\n"):
        m = re.match(r"^### Story (\d+):", line)
        if m: story = int(m.group(1)); continue
        if line.startswith(">") and "Context note" in line:
            t = ws(md_to_text(line)).lstrip("* ").rstrip("*").strip()   # each note is wrapped in Markdown italics: no stray "*" at either end
            cn[story] = cn.get(story, 0) + 1
            _n(f"CN-S{story}-{cn[story]}", f"Story {story}, context note", t)
    # User Feedback Summary rows ("UFS-01" ...), quoted as "Trigger | Message | Behavior"
    ufs = []
    block = _section("8. User Feedback Summary") or md.split("## 8. User Feedback Summary")[1]
    for line in block.split("\n"):
        if line.startswith("| ") and not line.startswith("| **Trigger") and not line.startswith("| ---"):
            ufs.append(" | ".join(ws(md_to_text(x)) for x in line.strip().strip("|").split("|")))
    for i, row in enumerate(ufs, 1): named[f"UFS-{i:02d}"] = ("User Feedback Summary", row)
    # the context note under the User Feedback Summary table is parsed above as CN-S13-3 (it sits after Story 13's heading)
    return dict(ALL=all_, MD=md, W=W, ROWSW=ws(" ".join(ufs)), CODE=code, CODE_STORY=code_story, STORY_TITLE=story_title, NAMED=named, UFS=ufs)

PRDV = {v: _parse(v) for v in PRD_FILES}
if set(PRDV[33]["NAMED"]) != set(PRDV[35]["NAMED"]): raise SystemExit("v33 and v35 name different context notes, bullets or feedback rows")
if set(PRDV[33]["CODE"]) - set(PRDV[35]["CODE"]): raise SystemExit("a v33 code is missing from v35")
if PRDV[33]["STORY_TITLE"] != PRDV[35]["STORY_TITLE"]: raise SystemExit("story titles changed between v33 and v35")
PRD_VERSION = 35                                         # coverage, the requirement map and new cases use v35
_cur = PRDV[PRD_VERSION]
PRD_FILE, PRD_ALL, PRD_MD, PRDW, PRD_ROWSW = PRD_FILES[PRD_VERSION], _cur["ALL"], _cur["MD"], _cur["W"], _cur["ROWSW"]
CODE, CODE_STORY, STORY_TITLE, NAMED, UFS = _cur["CODE"], _cur["CODE_STORY"], _cur["STORY_TITLE"], _cur["NAMED"], _cur["UFS"]
PRD_NAME, READ = PRD_NAMES[33], PRD_READ[33]             # the From line of every case NOT in the 28 Oct named set (unchanged)
NEW_V35 = sorted(set(CODE) - set(PRDV[33]["CODE"]))     # S7-N11, S9-R18a, S10-R11a, S11-E5, S12-R11a, S13-R19e
CHANGED_V35 = sorted(c for c in PRDV[33]["CODE"] if PRDV[33]["CODE"][c] != CODE[c])
EPIC = "SV-10647"
DESIGN_URL = "https://claude.ai/artifact/Vz6rprcWyP16tYxzM1kdeE"
NOBUILD = "The build is not yet available to check this case against."
MARKER = "AUTOMATION: HOLD - not yet build-verified (no build yet)"
DESIGN_HOLD = "AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO"
def PO_HOLD(n, why): return f"AUTOMATION: HOLD - waiting on the PO (question {n}: {why})"
def HOLD(reason): return "AUTOMATION: HOLD - " + reason

STORY_JIRA = {n: f"SV-{10813 + n}" for n in range(1, 14)}   # SV-10814 ... SV-10826, checked against the PRD "Jira:" lines below
for n, k in STORY_JIRA.items():
    if f"**Jira:** {k}" not in PRD_MD: raise SystemExit(f"Story {n} is not {k} in the PRD")
# which story owns each User Feedback Summary row (the gate in build.py needs every message of a written story used word for word)
UFS_STORY = {1: 11, 2: 4, 3: 4, 4: 7, 5: 7, 6: 7, 7: 7, 8: 7, 9: 7, 10: 7, 11: 13, 12: 13, 13: 13, 14: 13, 15: 13, 16: 13, 17: 13,
             18: 13, 19: 13, 20: 13, 21: 13, 22: 13, 23: 13, 24: 13, 25: 13, 26: 13, 27: 13, 28: 10, 29: 10, 30: 10, 31: 10, 32: 2,
             33: 3, 34: 2, 35: 2, 36: 10, 37: 10, 38: 10, 39: 10, 40: 1, 41: 5, 42: 9, 43: 9, 44: 9, 45: 9, 46: 12, 47: 12, 48: 12, 49: 12}
if len(UFS) != len(UFS_STORY): raise SystemExit(f"User Feedback Summary has {len(UFS)} rows, UFS_STORY maps {len(UFS_STORY)}")
NAMED_STORY = {f"UFS-{i:02d}": s for i, s in UFS_STORY.items()}
for k in NAMED:
    m = re.match(r"CN-S(\d+)-", k)
    if m: NAMED_STORY[k] = int(m.group(1))

# ---------------------------------------------------------------- other sources (quotable, each checked verbatim)
TECH_FILE = f"{P}/sources/tech-plan-Parts-Lifecycle-Update-shared-2026-10-08.md"
TECHW = ws(open(TECH_FILE).read().replace("`", ""))
TECH_NAME = ('Tech plan "Parts Lifecycle Update — Technical Implementation Plan" (7 Oct 2026, written against PRD v22; re-shared by '
             'the QA lead on 27 Oct 2026, unchanged)')
JIRA_FILE = f"{P}/sources/jira-2026-10-27/ALL-TICKETS-2026-10-27.md"
JIRAW = ws(re.sub(r"<custom[^>]*>|</custom>", "", open(JIRA_FILE).read()))
JIRA_NAME = "Jira tickets and comments under epic SV-10647 (saved in sources/jira-2026-10-27/ALL-TICKETS-2026-10-27.md)"
PO_FILES = [f"{P}/po-answers-2026-10-09/ANSWERS-Chris-Ward-2026-10-09.md", f"{P}/po-answers-2026-10-14/ANSWERS-Chris-Ward-2026-10-14.md",
            f"{P}/po-answers-2026-10-09/ANSWERS-QA-lead-test-setup-2026-10-09.md"]
POW = ws(" ".join(open(f).read() for f in PO_FILES))
PO_NAME = "Product's answers (Chris Ward, 9 Oct and 14 Oct 2026, saved in po-answers-2026-10-09/ and po-answers-2026-10-14/)"
# Chris Ward's answers to Doc questions 13-27 (27 Oct 2026), copied word for word on 28 Oct 2026 (read only) from the question Doc
PO27_FILE = f"{FP}/ANSWERS-13-27-2026-10-27.md"
PO27W = ws(re.sub(r"<!--.*?-->", "", open(PO27_FILE).read(), flags=re.S))
PO27_DOC = "https://docs.google.com/document/d/1pkAPGqWVTdtYorNN4SVNl9HkHxuuB9czro_y2DbUeEM/edit"
PO27_NAME = (f"Product's answers to questions 13 to 27 (Chris Ward, 27 Oct 2026, Google Doc {PO27_DOC}, saved word for word in "
             "full-pass-2026-10-27/ANSWERS-13-27-2026-10-27.md)")
def PO27(n, text): return ("PO27", f"Chris Ward, 27 Oct 2026, answer {n}", text)
CANVAS = json.load(open(f"{P}/sources/design-2026-10-13-artifact/files/canvas.json"))
BOARD_FILE = {a["title"]: a["file"].replace(".dc.html", ".png") for a in CANVAS["artboards"]}
BOARD_BY_NO = {a["title"].split(" ")[0]: a["title"] for a in CANVAS["artboards"]}
PNG_DIR = f"{P}/sources/design-2026-10-13-artifact/png"
NOTESW = [ws(n["text"]) for n in CANVAS["annotations"]]
DOCS = {"PRD": (PRD_NAME, lambda t: ws(t) in PRDW or ws(t) in PRD_ROWSW),
        "PO27": (PO27_NAME, lambda t: ws(t) in PO27W),
        "TECH": (TECH_NAME, lambda t: ws(t) in TECHW),
        "JIRA": (JIRA_NAME, lambda t: ws(t) in JIRAW),
        "PO": (PO_NAME, lambda t: ws(t) in POW)}
def prd_ok(text, ver):
    """A PRD quote is verbatim in the case's own PRD version (a requirement line, a named item or a feedback row)."""
    return ws(text) in PRDV[ver]["W"] or ws(text) in PRDV[ver]["ROWSW"]

def board(no):
    """'4.1' -> '4.1 The actions menu' (the design's own board title)."""
    if no not in BOARD_BY_NO: raise KeyError(f"no design board {no}")
    return BOARD_BY_NO[no]

# ---------------------------------------------------------------- the case model
CASES = []
def C(key, sec, title, pre, steps, res, q, note="", marker=None, design=None, stories=None, claude=None, part_of=None, prd=33):
    """key: library key (testrail-id-map.csv gives its C-id; a key with no row is a NEW case). sec: S1..S13, IV or DESIGN.
    pre: plain precondition bullets (tester text). steps: one UI action each. res: one entry per step, a list of bullets (or one str).
    q: quotes — a PRD code ("S1-R1"), a NAMED key ("UFS-40", "CN-S4-1", "FO-7"), or a tuple (doc, label, verbatim text) with doc in
       PRD / TECH / JIRA / PO. design: dict(boards=["4.1", ...], words=[verbatim canvas note text], pictures=[png names]) — boards
       default to none; pictures default to the boards' own pictures. claude: setup-file lines (examples, recipes) for Claude sessions
       only. part_of: the key of the case this one was split from (Rule 136; the original keeps its C-id as part 1).
    prd: the PRD version the case quotes (33, or 35 for a case in the 28 Oct 2026 named set and every case added then)."""
    if prd not in PRDV: raise SystemExit(f"{key}: no PRD version {prd}")
    res = [[r] if isinstance(r, str) else list(r) for r in res]
    CASES.append(dict(key=key, sec=sec, title=title, pre=list(pre), steps=list(steps), res=res, q=list(q), note=note,
                      marker=marker or MARKER, design=design or {}, stories=stories, claude=claude or [], part_of=part_of, prd=prd))

def quotes(c):
    """[(doc, label, text)] for a case, each looked up or checked verbatim."""
    out, v = [], PRDV[c.get("prd", 33)]
    for x in c["q"]:
        if isinstance(x, tuple):
            doc, label, text = x
            out.append((doc, label, ws(text)))
        elif x in v["CODE"]: out.append(("PRD", x, v["CODE"][x]))
        elif x in v["NAMED"]: out.append(("PRD",) + v["NAMED"][x])
        else: raise KeyError(f"{c['key']}: unknown quote key {x}")
    return out

def codes_of(c): return {x for x in c["q"] if isinstance(x, str)}

def story_nums(c):
    if c["stories"]: return list(c["stories"])
    s = []
    for x in c["q"]:
        if isinstance(x, str):
            n = CODE_STORY.get(x) or NAMED_STORY.get(x)
            if n and n not in s: s.append(n)
    m = re.match(r"S(\d+)$", c["sec"])
    if m and int(m.group(1)) not in s: s.insert(0, int(m.group(1)))
    return s or [13]

e = lambda s: html.escape(s, quote=False)

try:
    from design_refs import DREFS      # Phase D: key -> {"boards": [...], "pictures": [...], "words": [...]} (adds to the case's own)
except ImportError:
    DREFS = {}

def design_of(c):
    d = dict(boards=list(c["design"].get("boards", [])), pictures=list(c["design"].get("pictures", [])),
             words=list(c["design"].get("words", [])), note=c["design"].get("note", ""))
    x = DREFS.get(c["key"], {})
    for k in ("boards", "pictures", "words"):
        for v in x.get(k, []):
            if v not in d[k]: d[k].append(v)
    if not d["pictures"]:
        d["pictures"] = [BOARD_FILE[board(b)] for b in d["boards"]]
    return d

def held_on_design(c):
    """A held design-version case (Rule 130): DESIGN_HOLD, or a PO hold on a design question."""
    return c["marker"] == DESIGN_HOLD or (c["marker"] != MARKER and any(f"question {q}:" in c["marker"] for q in DESIGN_QUESTIONS))
DESIGN_QUESTIONS = ("Q8", "Q9", "Q10")     # the design-vs-PRD / design-vs-tech-plan questions (Phase D's DQ-01..DQ-03)
def source_sentence(c):
    if c["sec"] != "DESIGN": return "the expected results above come from the quotes above."
    if held_on_design(c): return "the expected results above come from the quotes above, except where this held design case follows the design."
    return ("the expected results above come from the quotes above where the PRD speaks, and from the board pictures where it is silent "
            "about the look.")
def design_block(c):
    """Rule 117 tenth amendment: design references in their own block below the quotes."""
    d = design_of(c)
    h = "<p></p><p><strong>References from Design</strong></p>"
    if d["boards"]:
        t = (f'Design canvas "Parts Lifecycle Update" ({DESIGN_URL}), 13 Oct 2026 copy, unchanged when re-read on 27 Oct 2026: board'
             + ("s " if len(d["boards"]) > 1 else " ") + ", ".join(f'"{board(b)}"' for b in d["boards"])
             + ". Compare the screen with the pictures below; " + source_sentence(c))
        h += "<p>" + e(t) + "</p>"
        if d["note"]: h += "<p>" + e(d["note"]) + "</p>"
        if d["pictures"]:
            h += "<p>Design pictures attached to this case:</p><ul>" + "".join(f"<li>{e(p)}</li>" for p in d["pictures"]) + "</ul>"
        if d["words"]:
            h += "<p>The design's own words:</p><ul>" + "".join(f"<li>&ldquo;{e(w)}&rdquo;</li>" for w in d["words"]) + "</ul>"
    else:
        t = (f'Design canvas "Parts Lifecycle Update" ({DESIGN_URL}), 13 Oct 2026 copy, unchanged when re-read on 27 Oct 2026: '
             + (d["note"] or "no board draws this case's screen or state, so no design picture is attached; the expected results above come from the quotes above."))
        h += "<p>" + e(t) + "</p>"
    return h + "<p></p>"

IV_BUG = "bug SV-10380 (Inventory Value report ignores negative bins and overstates net inventory value; ships with this epic)"
def quotes_block(c):
    groups = {}
    for doc, label, text in quotes(c): groups.setdefault(doc, []).append((label, text))
    sto = ", ".join(f"story {STORY_JIRA[n]} (Story {n}, {STORY_TITLE[n]})" for n in story_nums(c) if n in STORY_JIRA)
    ver = c.get("prd", 33)
    if not sto and c["sec"] == "IV": sto = IV_BUG      # an Inventory Value case quotes no story (stories=[0]): name the bug instead
    h = "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
    first = True
    for doc in ("PRD", "PO", "PO27", "JIRA", "TECH"):
        if doc not in groups: continue
        name = PRD_NAMES[ver] if doc == "PRD" else DOCS[doc][0]
        read = PRD_READ[ver] if doc == "PRD" else (PRD_READ[35] if doc == "PO27" else READ)
        h += f"<p>From: {e(name)}, {read}" + (f" &middot; Epic {EPIC}, {e(sto)}" if first else "") + "</p>"
        h += "<ul>" + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(t)}&rdquo;</li>" for l, t in groups[doc]) + "</ul>"
        first = False
    return h + f"<p>{e(NOBUILD)}</p>"

def render(c):
    """The QA lead's pattern (Rule 117 fourteenth amendment): "Preconditions" + plain bullets; numbered steps; "Expected Result" with a
    "Step N:" paragraph and bullets per step; <p></p>; the note; the quotes with their From lines; the build line; References from Design;
    the AUTOMATION line last."""
    pre = "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(x)}</li>" for x in c["pre"]) + "</ul>"
    exp = ("<p><strong>Expected Result</strong></p>"
           + "".join(f"<p>Step {i}:</p><ul>" + "".join(f"<li>{e(x)}</li>" for x in r) + "</ul>" for i, r in enumerate(c["res"], 1))
           + "<p></p>" + (f"<p>{e(c['note'])}</p>" if c["note"] else "")
           + quotes_block(c) + design_block(c) + f"<p>{e(c['marker'])}</p>")
    refs = ",".join(dict.fromkeys(STORY_JIRA[n] for n in story_nums(c) if n in STORY_JIRA))
    if c["sec"] == "IV": refs = ",".join(dict.fromkeys(["SV-10380"] + ([refs] if refs else [])))
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": refs, "custom_automation_type": 2,
            "custom_atmstatus": 1, "custom_preconds": pre, "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in c["steps"]) + "</ol>",
            "custom_expected": exp}

# ---------------------------------------------------------------- per-case checks (build.py runs them and the global gates)
VERBS = (r"(click|clicks|open|opens|select|choose|type|enter|press|tick|untick|hover|save|close|clear|switch|sign|reload|refresh|pick|"
         r"set|change|delete|create|move|deactivate|reactivate|activate|go|scroll|drag|import|upload|send|log|wait|edit|cancel|confirm|turn|"
         r"replace|print|remove|add|search)")
TWO = re.compile(r"\b" + VERBS + r"\b[^.]*?(,\s*then\s+|\s+and\s+then\s+|\s+then\s+|\s+and\s+)" + VERBS + r"\b", re.I)
ALLOW_AND = re.compile(r"(Create & Edit|Search and filter|search and filter)", re.I)
def two_actions(step):
    """Rule 135 heuristic: two action verbs joined by 'and' / 'then', or two sentences that each start with an action verb."""
    s = ALLOW_AND.sub("X", step)
    s = re.sub(r'"[^"]*"', '"Q"', s)
    s = re.sub(r"\([^)]*\)", "", s)
    if TWO.search(s): return True
    sents = [x.strip() for x in re.split(r"(?<=\.)\s+", s) if x.strip()]
    return len([x for x in sents if re.match(VERBS, x, re.I) and not re.match(r"(do not|don't)", x, re.I)]) > 1

VAGUE = re.compile(r"\bnative\b|as described\b|looks right|the same style\b|as designed\b|as in the layout being checked|as before\b|"
                   r"looks as it did|as expected\b", re.I)
# "request" is refused as a technical word, but "part request" is the screen's own phrase ("New Part Request", PRD feedback row 16
# "... while it's on an open part request."); merged 27 Oct 2026 from Phase C's pc_common.py
JARGON = re.compile(r"\b(API|HTTP|endpoint|database|devtools|DevTools|console|SQL|JSON)\b|(?<![Pp]art )\brequest\b")
KEYREF = re.compile(r"\b(?:S\d{1,2}-\d{2}[b-e]?|IV-\d{2}[b-e]?|D-\d{2}[b-e]?|C\d{5,6})\b")
BLOCKED_RX = re.compile(r"mark this test Blocked|If you cannot set up any of the above|If any record above is missing|setup not done", re.I)
OLD_LAYOUT = re.compile(r"[{}]|for example|For example|Scenario:|docs\.google\.com|Setup file|setup file|ZZAUTOTEST|ask your|QA lead")
NOT_MANUAL = re.compile(r"not checked by hand|cannot be checked by hand|manual tester cannot|outside the (?:dialog|screen|page)|by any other route|"
                        r"request made outside|automated check|cannot set up", re.I)

def tester_strings(c):
    return [c["title"]] + c["pre"] + c["steps"] + [b for r in c["res"] for b in r] + ([c["note"]] if c["note"] else [])

def check(c):
    p, k = [], c["key"]
    t = c["title"]
    if len(t) > 80 or ";" in t: p.append(f"{k}: title {len(t)} chars or has a semicolon")
    if c["sec"] == "DESIGN" and not t.startswith("Design: "): p.append(f"{k}: a design case title must start 'Design: '")
    if c["sec"] != "DESIGN" and t.startswith("Design"): p.append(f"{k}: a 'Design' title outside the design section")
    if not c["pre"]: p.append(f"{k}: no preconditions")
    if not c["steps"]: p.append(f"{k}: no steps")
    if len(c["res"]) != len(c["steps"]): p.append(f"{k}: {len(c['res'])} result groups for {len(c['steps'])} steps")
    for i, r in enumerate(c["res"], 1):
        if not r or any(not b.strip() for b in r): p.append(f"{k}: step {i} has an empty result")
        for b in r:
            if re.match(r"Steps? \d", b): p.append(f"{k}: result bullet starts with its own 'Step' label (render adds it): {b[:50]!r}")
            if not (b[0].isupper() or b[0] in '"“$(0123456789'): p.append(f"{k}: a result bullet does not start a sentence: {b[:50]!r}")
            for n in re.findall(r"\bsteps? (\d+)", b, re.I):
                if int(n) > len(c["steps"]): p.append(f"{k}: a result points at step {n}; the case has {len(c['steps'])} steps")
    for i, s in enumerate(c["steps"], 1):
        if two_actions(s): p.append(f"{k}: step {i} has two UI actions (Rule 135): {s!r}")
        if re.match(r"(Look at|Read|Find|Check|Note|Write down)\b", s): p.append(f"{k}: step {i} only reads; fold it into the previous result (Rule 136 5a): {s!r}")
    for x in tester_strings(c):
        if BLOCKED_RX.search(x): p.append(f"{k}: the 'mark this test Blocked' line or a variant (Rule 117 fifteenth amendment)")
        m = OLD_LAYOUT.search(x)
        if m: p.append(f"{k}: old-layout or example wording in tester text ({m.group(0)!r}): {x[:70]!r}")
        if VAGUE.search(x): p.append(f"{k}: vague look word in tester text (L-16): {x[:70]!r}")
        if KEYREF.search(x): p.append(f"{k}: a case key or C-id in tester text (Rule 137): {x[:70]!r}")
        if NOT_MANUAL.search(x): p.append(f"{k}: wording of a check a manual tester cannot make (L-14): {x[:70]!r}")
        if re.search(r"\bS\d+-[RNE]\d+", x): p.append(f"{k}: a requirement code in tester text: {x[:70]!r}")
        if JARGON.search(x): p.append(f"{k}: technical term in tester text: {JARGON.search(x).group(0)}")
    for b in c["pre"]:
        if not re.match(r"(Sign in|Use|Have|Create|Make sure|Open|Give|Keep|Start|Set|Turn|Import|Log in|Add|Write down|Delete)\b", b):
            p.append(f"{k}: a precondition that does not tell the tester what to set up ('Sign in as …', 'Have …', 'Create … for this test', 'Make sure …'): {b[:70]!r}")
    if not c["q"]: p.append(f"{k}: no source quote (Rule 64)")
    for doc, label, text in quotes(c):
        if doc not in DOCS: p.append(f"{k}: unknown source document {doc}")
        elif doc == "PRD" and not prd_ok(text, c["prd"]): p.append(f"{k}: quote {label} is not verbatim in PRD v{c['prd']}")
        elif doc != "PRD" and not DOCS[doc][1](text): p.append(f"{k}: quote {label} is not verbatim in {doc}")
    for w in design_of(c)["words"]:
        if ws(w) not in NOTESW and not any(ws(w) in n for n in NOTESW): p.append(f"{k}: design words not verbatim in the canvas notes: {w[:60]!r}")
    for b in design_of(c)["boards"]:
        try: board(b)
        except KeyError: p.append(f"{k}: unknown design board {b}")
    for pic in design_of(c)["pictures"]:
        if not os.path.isfile(os.path.join(PNG_DIR, pic)) and not os.path.isfile(os.path.join(FP, "design", "images", pic)):
            p.append(f"{k}: picture {pic} not found")
    if not c["marker"].startswith("AUTOMATION: "): p.append(f"{k}: marker")
    return p

# ---------------------------------------------------------------- the TestRail map (keys <-> C-ids)
MAP_FILE = f"{P}/testrail-id-map.csv"
def id_map():
    return {r["key"]: r for r in csv.DictReader(open(MAP_FILE))} if os.path.exists(MAP_FILE) else {}
SECTIONS = json.load(open(f"{P}/section-map.json")); SECTIONS["IV"] = 54274
# DESIGN: "Design — how it looks" under Part Lifecycle 20439. The coordinator creates it in TestRail and writes its id into
# ../section-map.json as "DESIGN"; until then it is None and apply.py adds no design case (it never creates the section itself).
SECTIONS["DESIGN"] = SECTIONS.get("DESIGN") or None
DELETED = {"C425659": "dashboard inventory figure (removed in PRD v29, Product answer 7 of 14 Oct)",
           "C425758": "dashboard inventory figure (removed in PRD v29, Product answer 7 of 14 Oct)",
           "C425639": "dashboard Critical Reorder list (S5-R14 removed in PRD v27, Product answer 13 of 9 Oct)",
           "C425759": "dashboard Critical Reorder list (S9-E12 removed in PRD v27, Product answer 13 of 9 Oct)",
           "C154761": "single-part deactivation from the old dialog footer (S2-R18, removed before v26; now Story 13's Part Status)",
           "C425602": "server error during a bulk change (not something a manual tester can cause)",
           "C425622": "part request refusals that name the Part Library (reachable only outside the screen)",
           "C425629": "refusals of a tracked part with no bin, which the dialog never sends; import Unassigned bin covered by S7",
           "C425701": "public API rename", "C425723": "server errors in the part dialog", "C425755": "public API create refusal",
           "C425776": "public API description change"}
