"""What/Why (Title and Description) — case model, source parsers, quote lookup, per-case checks and TestRail rendering
(full pass, 27 Oct 2026). Copied from the Parts Lifecycle library of the same day (build/founder-mode/part-lifecycle/authoring/pllib.py)
and adapted: same pattern, same gates, What/Why sources and keys.

Cases are written natively in the QA lead's pattern (Rule 117 fourteenth amendment, 26 Oct 2026, and fifteenth amendment): plain
precondition bullets, plain steps (one action each) and "Step N:" result bullets. No {placeholders}, no "For example:" lines, no
Scenario line, no setup-file link and no Blocked line in anything a tester reads. Examples and recipes for Claude sessions go in the
`claude=` field, which only render_setup.py prints (WHAT-WHY-SETUP-FILE.md).

Sources (the ONLY sources of expected behaviour, Rule 57):
  PRD  "What Are You Doing / Why Are You Doing It?", Confluence 845348896, version 15 (sources/CONFLUENCE-845348896-v15-2026-10-27.md)
  PO   Chris Ward's 8 answers of 14 Oct 2026 (po-answers-2026-10-14/ANSWERS-Chris-Ward-2026-10-14.md); quoted only where the PRD is silent
  JIRA epic SV-11257, stories SV-10130..SV-10133, verify tasks SV-10390..SV-10393, bug SV-11850, read 27 Oct 2026
       (sources/jira-2026-10-27/ALL-TICKETS-2026-10-27.md) — facts and the developers' notes; never quoted where the PRD speaks
  TECH tech plan of 23 Sep 2026 (informs, never overrules; Rule 30)
  DESIGN canvas Pz1Q6BfvreYFpQwVQZPTE6, 27 Oct copy (sources/design-2026-10-27-artifact/files/) — quoted only under References from Design.

Requirement codes are parsed from the requirement lines themselves ("- **S1-R1:** text"), never from the Change Log (cut off before
parsing)."""
import os, re, html, json, csv
D = os.path.dirname(os.path.abspath(__file__))          # authoring/
P = os.path.dirname(D)                                   # build/founder-mode/what-why/
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

# ---------------------------------------------------------------- PRD v15
PRD_FILE = f"{P}/sources/CONFLUENCE-845348896-v15-2026-10-27.md"
PRD_ALL = open(PRD_FILE).read()
PRD_MD = PRD_ALL.split("## 8. Change Log")[0]            # the Change Log is never a source of a requirement or a quote
PRD_TXT = md_to_text(PRD_MD)
PRDW = ws(PRD_TXT)
PRD_NAME = ('PRD "What Are You Doing / Why Are You Doing It?" (Title and Description), Confluence 845348896, version 15 '
            '(14 Oct 2026, owner Chris Ward)')
PRD_VERSION = 15
READ = "read 27 Oct 2026"
EPIC = "SV-11257"
DESIGN_URL = "https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6"
NOBUILD = ("Not yet checked against a build by us: the QA build (sv10130.qa.shopview.com, QuickBooks host qb1.qa.shopview.com) "
           "and staging carry this change, and this case has not been run on either.")
MARKER = "AUTOMATION: HOLD - not yet build-verified on the What/Why QA build"
DESIGN_HOLD = "AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO"
def PO_HOLD(n, why): return f"AUTOMATION: HOLD - waiting on the PO (question {n}: {why})"
def HOLD(reason): return "AUTOMATION: HOLD - " + reason
def EXPECT_FAIL(ticket): return f"AUTOMATION: READY - EXPECT FAIL ({ticket})"

CODE, CODE_STORY = {}, {}
_story = None
STORY_TITLE = {}
for line in PRD_MD.split("\n"):
    m = re.match(r"^### Story (\d+): (.*)$", line)
    if m: _story = int(m.group(1)); STORY_TITLE[_story] = m.group(2).strip(); continue
    m = re.match(r"^- \*\*(S\d+-[RNE]\d+[a-z]?):\*\* (.*)$", line)
    if m:
        code = m.group(1)
        if code in CODE: raise SystemExit(f"code {code} appears twice as a requirement line")
        CODE[code] = ws(md_to_text(m.group(2)))
        CODE_STORY[code] = int(re.match(r"S(\d+)-", code).group(1))
        if CODE_STORY[code] != _story: raise SystemExit(f"{code} sits under Story {_story}")
STORY_JIRA = {1: "SV-10130", 2: "SV-10131", 3: "SV-10132", 4: "SV-10133"}
for n, k in STORY_JIRA.items():
    if f"[{k}](https://shopview.atlassian.net/browse/{k})" not in PRD_MD: raise SystemExit(f"Story {n} is not {k} in the PRD")
if len(CODE) != 41: raise SystemExit(f"PRD v15 has {len(CODE)} requirement codes; this library was written for 41")

# ---- named PRD items with no code (quotable; each a full bullet / row / note, verbatim)
NAMED = {}
def _n(key, label, text):
    if ws(text) not in PRDW: raise SystemExit(f"NAMED {key} not verbatim in PRD v15: {text[:80]}")
    NAMED[key] = (label, ws(text))
def _section(title):
    m = re.search(r"^## " + re.escape(title) + r".*?$(.*?)^## ", PRD_MD, re.M | re.S)
    return m.group(1) if m else ""
def _bullets(block):
    return [ws(md_to_text(x)) for x in re.findall(r"^- (.*)$", block, re.M)]
_fo = _section("2. Feature Overview")
for head, pre in (("Core functionality", "FO"), ("Out of scope", "OOS")):
    m = re.search(r"\*\*" + head + r"\*\*(.*?)(?:\n\*\*|\Z)", _fo, re.S)
    for i, b in enumerate(_bullets(m.group(1)), 1): _n(f"{pre}-{i}", f"Feature Overview, {head}", b)
for i, b in enumerate(_bullets(_section("3. Key Decisions")), 1): _n(f"KD-{i}", "Key Decisions", b)
for i, b in enumerate(_bullets(_section("4. Assumptions")), 1): _n(f"ASSUME-{i}", "Assumptions", b)
_ff = re.search(r"^## Form Factor\n\n(.*?)\n", PRD_MD, re.M | re.S).group(1)
_n("FF-1", "Form Factor", md_to_text(_ff))
# prerequisites, story by story ("PRE-S<n>-<i>"), and context notes ("CN-S<n>-<i>")
_story = None; _cn = {}; _inpre = False; _pre = {}
for line in PRD_MD.split("\n"):
    m = re.match(r"^### Story (\d+):", line)
    if m: _story = int(m.group(1)); _inpre = False; continue
    if line.startswith("**Prerequisites:**"): _inpre = True; continue
    if line.startswith("**Requirements:**"): _inpre = False; continue
    if _inpre and _story and line.startswith("- "):
        _pre[_story] = _pre.get(_story, 0) + 1
        _n(f"PRE-S{_story}-{_pre[_story]}", f"Story {_story}, Prerequisites", md_to_text(line[2:]))
    if _story and line.startswith(">") and "Context note" in line:
        t = ws(md_to_text(line)).lstrip("* ").rstrip("*").strip()
        _cn[_story] = _cn.get(_story, 0) + 1
        _n(f"CN-S{_story}-{_cn[_story]}", f"Story {_story}, context note", t)
# Surfaces table rows ("SURF-n"), quoted as "Surface | Before | After"
SURF = []
for line in _section("6. Surfaces").split("\n"):
    if line.startswith("| ") and not line.startswith("| Surface") and not line.startswith("| ---"):
        SURF.append(" | ".join(ws(md_to_text(x)) for x in line.strip().strip("|").split("|")))
PRD_ROWSW = ws(" ".join(SURF))
for i, row in enumerate(SURF, 1): NAMED[f"SURF-{i}"] = ("Surfaces", row)
NAMED_STORY = {k: int(re.match(r"(?:PRE|CN)-S(\d+)-", k).group(1)) for k in NAMED if re.match(r"(?:PRE|CN)-S\d+-", k)}

# ---------------------------------------------------------------- other sources (quotable, each checked verbatim)
TECH_FILE = f"{P}/sources/tech-plan-Title-and-Description-2026-10-13.md"
TECHW = ws(open(TECH_FILE).read().replace("`", ""))
TECH_NAME = ('Tech plan "Title and Description — Technical Implementation Plan" (23 Sep 2026; re-shared by the QA lead on 27 Oct 2026, '
             'unchanged)')
JIRA_FILE = f"{P}/sources/jira-2026-10-27/ALL-TICKETS-2026-10-27.md"
JIRAW = ws(re.sub(r"<custom[^>]*>|</custom>", "", open(JIRA_FILE).read()).replace("`", ""))
JIRA_NAME = "Jira tickets and comments under epic SV-11257, and bug SV-11850 (saved in sources/jira-2026-10-27/ALL-TICKETS-2026-10-27.md)"
PO_FILE = f"{P}/po-answers-2026-10-14/ANSWERS-Chris-Ward-2026-10-14.md"
POW = ws(open(PO_FILE).read())
PO_NAME = ("Product's answers to our 8 questions (Chris Ward, 14 Oct 2026, Google Doc 1QcT7FRZci6AhYcI33HUac-Oob03-gCnCOKn2NFHMLjA, "
           "saved in po-answers-2026-10-14/)")
DESIGN_DIR = f"{P}/sources/design-2026-10-27-artifact/files"
CANVAS = json.load(open(f"{DESIGN_DIR}/canvas.json"))
BOARD_BY_STEM = {a["file"].replace(".dc.html", ""): a["title"] for a in CANVAS["artboards"]}
def _board_text(f):
    s = open(f"{DESIGN_DIR}/{f}").read()
    s = re.sub(r"<style.*?</style>|<script.*?</script>", "", s, flags=re.S)
    return ws(" ".join(x for x in html.unescape(re.sub(r"<[^>]+>", "\n", s)).split("\n") if x.strip()))
BOARD_TEXT = {a["file"].replace(".dc.html", ""): _board_text(a["file"]) for a in CANVAS["artboards"]}
NOTESW = [ws(n["text"]) for n in CANVAS["annotations"]]
DESIGN_WORDS = NOTESW + list(BOARD_TEXT.values())
# Phase D (design worker) writes the board pictures here; until then no case names a picture (design_refs.DREFS adds them)
PNG_DIRS = [f"{FP}/design/images", f"{FP}/design/renders", f"{P}/sources/design-2026-10-27-artifact/png"]
# the Phase D worker's board pictures (full-pass-2026-10-27/design/renders/, 27 Oct 2026), numbered page.board as in its proof file
BOARD_NO = {"DialogBefore": "1.1", "Main": "1.2", "QuickBooks": "1.3", "EditBefore": "1.4", "EditAfter": "1.5", "EdgeCases": "2.1",
            "Truncation": "2.2"}
def board_png(stem):
    """'Main' -> 'board-1.2-new-line-after.png' when the Phase D render exists, else None."""
    name = f"board-{BOARD_NO[stem]}-" + re.sub(r"[^a-z0-9]+", "-", BOARD_BY_STEM[stem].lower()).strip("-") + ".png"
    return name if any(os.path.isfile(os.path.join(x, name)) for x in PNG_DIRS) else None
DOCS = {"PRD": (PRD_NAME, lambda t: ws(t) in PRDW or ws(t) in PRD_ROWSW),
        "PO": (PO_NAME, lambda t: ws(t) in POW),
        "JIRA": (JIRA_NAME, lambda t: ws(t) in JIRAW),
        "TECH": (TECH_NAME, lambda t: ws(t) in TECHW)}

def board(stem):
    """'Main' -> 'New Line - after' (the design's own board title)."""
    if stem not in BOARD_BY_STEM: raise KeyError(f"no design board {stem}")
    return BOARD_BY_STEM[stem]

# ---------------------------------------------------------------- Rule 116: the joined line text, computed from known inputs
SEP = " - "
LIMIT = 4000
PLACEHOLDER = "Tech story missing."
def joined(title, description="", story=""):
    """The line text the PRD defines (S3-R1, R2, R3, R5, R6, R7, R8), computed independently of the build: present segments joined by
    " - "; a segment of only spaces, or the narrative "Tech story missing.", is absent; spaces and line breaks at the very end of the
    whole line are removed; a line over 4,000 bytes (UTF-8) is shortened from the end, never inside a character, with no trailing
    separator or space."""
    segs = [x for x in (title, description, None if story == PLACEHOLDER else story) if x and x.strip()]
    t = SEP.join(segs).rstrip(" \n\r\t")
    if len(t.encode("utf-8")) <= LIMIT: return t
    b = t.encode("utf-8")[:LIMIT]
    while True:
        try: t = b.decode("utf-8"); break
        except UnicodeDecodeError: b = b[:-1]
    return re.sub(r"(?: -)+ ?$", "", t.rstrip(" \n\r\t")).rstrip(" \n\r\t")
def nbytes(s): return len(s.encode("utf-8"))

# ---------------------------------------------------------------- the case model
CASES = []
def C(key, sec, title, pre, steps, res, q, note="", marker=None, design=None, stories=None, claude=None, part_of=None, inputs=None):
    """key: library key (testrail-id-map.csv gives its C-id; a key with no row is a NEW case). sec: S1..S4 or DESIGN.
    pre: plain precondition bullets (tester text). steps: one UI action each. res: one entry per step, a list of bullets (or one str).
    q: quotes — a PRD code ("S1-R1"), a NAMED key ("FO-3", "KD-5", "PRE-S3-3", "CN-S3-1", "FF-1", "SURF-4"), or a tuple
       (doc, label, verbatim text) with doc in PRD / PO / JIRA / TECH. design: dict(boards=["Main", ...], words=[verbatim board or
       note text], pictures=[png names], note="...") — boards by file stem (Main, EditAfter, QuickBooks, EdgeCases, Truncation,
       DialogBefore, EditBefore). claude: setup-file lines (examples, recipes) for Claude sessions only. part_of: the key of the case
       this one was split from (Rule 136; the original keeps its C-id as part 1). inputs: (title, description, tech story) a Story 3
       case types, so build.py can recompute every count it states (Rule 116)."""
    res = [[r] if isinstance(r, str) else list(r) for r in res]
    CASES.append(dict(key=key, sec=sec, title=title, pre=list(pre), steps=list(steps), res=res, q=list(q), note=note,
                      marker=marker or MARKER, design=design or {}, stories=stories, claude=claude or [], part_of=part_of, inputs=inputs))

def quotes(c):
    """[(doc, label, text)] for a case, each looked up or checked verbatim."""
    out = []
    for x in c["q"]:
        if isinstance(x, tuple):
            doc, label, text = x
            out.append((doc, label, ws(text)))
        elif x in CODE: out.append(("PRD", x, CODE[x]))
        elif x in NAMED: out.append(("PRD",) + NAMED[x])
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
    return s or [1]

e = lambda s: html.escape(s, quote=False)

try:
    from design_refs import DREFS      # Phase D: key -> {"boards": [...], "pictures": [...], "words": [...], "note": "..."}
except ImportError:
    DREFS = {}

def design_of(c):
    d = dict(boards=list(c["design"].get("boards", [])), pictures=list(c["design"].get("pictures", [])),
             words=list(c["design"].get("words", [])), note=c["design"].get("note", ""))
    x = DREFS.get(c["key"], {})
    for k in ("boards", "pictures", "words"):
        for v in x.get(k, []):
            if v not in d[k]: d[k].append(v)
    if x.get("note"): d["note"] = (d["note"] + " " + x["note"]).strip()
    if not d["pictures"]:
        d["pictures"] = [p for p in (board_png(b) for b in d["boards"]) if p]
    return d

DESIGN_QUESTIONS = ()     # the design-vs-PRD question ids Phase D adds (QUESTIONS.json); a PO hold on one of them is a held design case
def held_on_design(c):
    return c["marker"] == DESIGN_HOLD or (c["marker"] != MARKER and any(f"question {q}:" in c["marker"] for q in DESIGN_QUESTIONS))
def source_sentence(c):
    if c["sec"] != "DESIGN": return "the expected results above come from the quotes above."
    if held_on_design(c): return "the expected results above come from the quotes above, except where this held design case follows the design."
    return ("the expected results above come from the quotes above where the PRD speaks, and from the board pictures where it is silent "
            "about the look.")
TEXT_BOARDS = {"QuickBooks", "EdgeCases", "Truncation"}    # boards that draw line text (Phase D's DESIGN-CASE-PLAN.md), not a screen
def design_block(c):
    """Rule 117 tenth amendment: design references in their own block below the quotes."""
    d = design_of(c)
    h = "<p></p><p><strong>References from Design</strong></p>"
    head = (f'Design canvas "What Are You Doing / Why Are You Doing It?" ({DESIGN_URL}), copy re-read on 27 Oct 2026 (its one change '
            f'since 13 Oct: the New Line board\'s "Title *" now reads "Title")')
    if d["boards"]:
        if all(b in TEXT_BOARDS for b in d["boards"]) and c["sec"] != "DESIGN":   # D-11..D-14 compare board 1.3's printed-invoice panels, a screen
            how = ". These boards draw the line text, not a screen: the case types their example values where they fit; "
        else:
            how = ". Compare the screen with the pictures below; " if d["pictures"] else ". Compare the screen with the board; "
        t = (head + ": board" + ("s " if len(d["boards"]) > 1 else " ")
             + ", ".join(f'{BOARD_NO[b]} "{board(b)}"' for b in d["boards"]) + how + source_sentence(c))
        h += "<p>" + e(t) + "</p>"
        if d["note"]: h += "<p>" + e(d["note"]) + "</p>"
        if d["pictures"]:
            h += "<p>Design pictures attached to this case:</p><ul>" + "".join(f"<li>{e(p)}</li>" for p in d["pictures"]) + "</ul>"
        if d["words"]:
            h += "<p>The design's own words:</p><ul>" + "".join(f"<li>&ldquo;{e(w)}&rdquo;</li>" for w in d["words"]) + "</ul>"
    else:
        t = head + ": " + (d["note"] or "no board draws this case's screen or state, so no design picture is attached; the expected "
                           "results above come from the quotes above.")
        h += "<p>" + e(t) + "</p>"
    return h + "<p></p>"

def quotes_block(c):
    groups = {}
    for doc, label, text in quotes(c): groups.setdefault(doc, []).append((label, text))
    sto = ", ".join(f"story {STORY_JIRA[n]} (Story {n}, {STORY_TITLE[n]})" for n in story_nums(c) if n in STORY_JIRA)
    h = "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
    first = True
    for doc in ("PRD", "PO", "JIRA", "TECH"):
        if doc not in groups: continue
        h += f"<p>From: {e(DOCS[doc][0])}, {READ}" + (f" &middot; Epic {EPIC}, {e(sto)}" if first else "") + "</p>"
        h += "<ul>" + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(t)}&rdquo;</li>" for l, t in groups[doc]) + "</ul>"
        first = False
    return h + f"<p>{e(NOBUILD)}</p>"

def render(c):
    """The QA lead's pattern (Rule 117 fourteenth amendment): "Preconditions" + plain bullets; numbered steps; "Expected Result" with a
    "Step N:" paragraph and bullets per step; <p></p>; the note (an EXPECT FAIL case's symptom and three outcomes go here, Rule 61);
    the quotes with their From lines; the build line; References from Design; the AUTOMATION line last."""
    pre = "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(x)}</li>" for x in c["pre"]) + "</ul>"
    note = "".join(f"<p>{e(x)}</p>" for x in c["note"].split("\n")) if c["note"] else ""
    exp = ("<p><strong>Expected Result</strong></p>"
           + "".join(f"<p>Step {i}:</p><ul>" + "".join(f"<li>{e(x)}</li>" for x in r) + "</ul>" for i, r in enumerate(c["res"], 1))
           + "<p></p>" + note + quotes_block(c) + design_block(c) + f"<p>{e(c['marker'])}</p>")
    refs = ",".join(dict.fromkeys(STORY_JIRA[n] for n in story_nums(c) if n in STORY_JIRA))
    m = re.search(r"EXPECT FAIL \((SV-\d+)\)", c["marker"])
    if m: refs = ",".join(dict.fromkeys(refs.split(",") + [m.group(1)]))
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": refs, "custom_automation_type": 2,
            "custom_atmstatus": 1, "custom_preconds": pre, "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in c["steps"]) + "</ol>",
            "custom_expected": exp}

# ---------------------------------------------------------------- per-case checks (build.py runs them and the global gates)
VERBS = (r"(click|clicks|open|opens|select|choose|type|enter|press|tick|untick|hover|save|close|clear|switch|sign|reload|refresh|pick|"
         r"set|change|delete|create|move|deactivate|reactivate|activate|go|scroll|drag|import|upload|send|log|wait|edit|cancel|confirm|turn|"
         r"replace|print|remove|add|search|download|complete|reverse|narrow|paste|copy)")
TWO = re.compile(r"\b" + VERBS + r"\b[^.]*?(,\s*then\s+|\s+and\s+then\s+|\s+then\s+|\s+and\s+)" + VERBS + r"\b", re.I)
ALLOW_AND = re.compile(r"(Invoicing & payments|Save & Close|Save & Add Part|Save & Add Line|Search and filter)", re.I)
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
JARGON = re.compile(r"\b(API|HTTP|endpoint|database|devtools|DevTools|console|SQL|JSON|payload|UTF-8|byte|bytes)\b")
KEYREF = re.compile(r"\b(?:S\d-\d{2}[b-e]?|D-\d{2}[b-e]?|C\d{5,6})\b")
BLOCKED_RX = re.compile(r"mark this test Blocked|If you cannot set up any of the above|If any record above is missing|setup not done", re.I)
OLD_LAYOUT = re.compile(r"[{}]|for example|For example|Scenario:|docs\.google\.com|Setup file|setup file|ZZAUTOTEST|ask your|QA lead")
NOT_MANUAL = re.compile(r"not checked by hand|cannot be checked by hand|manual tester cannot|outside the (?:dialog|screen|page)|by any other route|"
                        r"request made outside|automated check|cannot set up", re.I)

def tester_strings(c):
    return [c["title"]] + c["pre"] + c["steps"] + [b for r in c["res"] for b in r] + ([c["note"]] if c["note"] else [])

PRE_START = (r"(Sign in|Use|Have|Create|Make sure|Open|Give|Keep|Start|Set|Turn|Import|Log in|Add|Write down|Delete|Make|Download|"
             r"Narrow)\b")
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
            if not (b[0].isupper() or b[0] in '"“$(0123456789='): p.append(f"{k}: a result bullet does not start a sentence: {b[:50]!r}")
            for n in re.findall(r"\bsteps? (\d+)", b, re.I):
                if int(n) > len(c["steps"]): p.append(f"{k}: a result points at step {n}; the case has {len(c['steps'])} steps")
    for i, s in enumerate(c["steps"], 1):
        if two_actions(s): p.append(f"{k}: step {i} has two UI actions (Rule 135): {s!r}")
        if re.match(r"(Look at|Read|Find|Check|Note|Write down|Compare)\b", s): p.append(f"{k}: step {i} only reads; fold it into the previous result (Rule 136 5a): {s!r}")
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
        if not re.match(PRE_START, b):
            p.append(f"{k}: a precondition that does not tell the tester what to set up ('Sign in as …', 'Have …', 'Create … for this test', 'Make sure …'): {b[:70]!r}")
    if not c["q"]: p.append(f"{k}: no source quote (Rule 64)")
    for doc, label, text in quotes(c):
        if doc not in DOCS: p.append(f"{k}: unknown source document {doc}")
        elif not DOCS[doc][1](text): p.append(f"{k}: quote {label} is not verbatim in {doc}")
    if any(d == "PO" for d, _, _ in quotes(c)) and not any(d == "PRD" for d, _, _ in quotes(c)):
        p.append(f"{k}: quotes the PO answers but no PRD line (the PRD v14+ carries the answers; quote the PRD where it speaks)")
    d = design_of(c)
    for w in d["words"]:
        if not any(ws(w) in n for n in DESIGN_WORDS): p.append(f"{k}: design words not verbatim in a board or canvas note: {w[:60]!r}")
    for b in d["boards"]:
        try: board(b)
        except KeyError: p.append(f"{k}: unknown design board {b}")
    for pic in d["pictures"]:
        if not any(os.path.isfile(os.path.join(x, pic)) for x in PNG_DIRS): p.append(f"{k}: picture {pic} not found")
    if not c["marker"].startswith("AUTOMATION: "): p.append(f"{k}: marker")
    if "EXPECT FAIL" in c["marker"]:
        for must in ("What you should see today:", "If you see exactly that, mark this test FAILED", "DIFFERENT way", "If it PASSES"):
            if must not in c["note"]: p.append(f"{k}: EXPECT FAIL without the symptom and all three outcomes (Rule 61): missing {must!r}")
    return p

# ---------------------------------------------------------------- the TestRail map (keys <-> C-ids)
MAP_FILE = f"{P}/testrail-id-map.csv"
def id_map():
    return {r["key"]: r for r in csv.DictReader(open(MAP_FILE))} if os.path.exists(MAP_FILE) else {}
SECTIONS = json.load(open(f"{P}/section-map.json"))
# DESIGN: "Design — how it looks" under What/Why 20437. The coordinator creates it in TestRail and writes its id into ../section-map.json
# as "DESIGN"; until then it is None and apply.py adds no design case (it never creates the section itself).
SECTIONS["DESIGN"] = SECTIONS.get("DESIGN") or None
DELETED = {}     # no What/Why case is retired in this pass (every one of the 37 live cases maps to a key)
