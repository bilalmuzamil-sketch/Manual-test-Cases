"""Technician Toggle — case model, quote lookup, checks and TestRail rendering (2 Nov 2026).
Base: build/credit-terms/authoring/ct_lib.py (quote machinery: quotes pulled by requirement code and checked word for word against the
saved PRD, never from the Change Log). Case bodies are written directly in the QA lead's pattern (Rule 117 fourteenth and fifteenth
amendments, example C665915): plain precondition bullets ("Sign in as ...", "Have a ...", "Make sure ..."), numbered steps with one UI
action each (Rule 135), "Expected Result" with "Step N:" and one bullet per observable fact, a blank line, then "Exact quotes from the
source" with a "From:" line per document (eleventh amendment), the build line, "References from Design" (an empty hook until the design
round adds cases_design.py / design_refs.py), and the AUTOMATION line last. Every expected result comes from PRD v17 (Rules 57, 113)."""
import os, re, html
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)


def ws(s): return re.sub(r"\s+", " ", html.unescape(s).replace("**", "").replace("\\", "")).strip()


def md_to_text(md):
    """Plain lines: no ** or \\, links reduced to their words, headings unmarked, one table cell per line."""
    out = []
    for line in md.split("\n"):
        t = line.replace("\\", "")
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


PRD_FILE = f"{P}/sources/CONFLUENCE-977371146-v17-2026-11-02.md"
PRD_FULL = open(PRD_FILE).read()
PRD_MD = PRD_FULL.split("## 9. Change Log")[0]          # the Change Log is never a source of a quote
PRD_TXT = md_to_text(PRD_MD)
PRDW = ws(PRD_TXT)
PRD_RAWW = ws(re.sub(r"<[^>]+>", "", re.sub(r"\[([^\]]*)\]\(([^)]*)\)", r"\1", PRD_MD)))   # keeps table rows "a | b | c"
JIRA_FILE = f"{P}/sources/JIRA-SV-11788-tickets-2026-11-02.md"
JIRAW = ws(open(JIRA_FILE).read() + " " + open(f"{P}/sources/JIRA-SV-11879-qa-handoff-2026-11-03.md").read())
PLAN_FILE = f"{P}/sources/tech-plan-Technician-Toggle-2026-11-02.md"
PLANW = ws(open(PLAN_FILE).read())

PRD_NAME = 'PRD "Technician Toggle", Confluence 977371146, version 17 (2 Nov 2026, Chris Ward)'
PRD_READ = "read 2 Nov 2026"
JIRA_NAME = "Jira tickets under epic SV-11788 (saved 2 Nov 2026, sources/JIRA-SV-11788-tickets-2026-11-02.md)"
PLAN_NAME = ("Technician Toggle technical implementation plan, 28 Oct 2026, written for PRD version 9 (sources/tech-plan-Technician-"
             "Toggle-2026-11-02.md; QA lead 2 Nov 2026: \"No newer plan; go ahead\"); quoted only where it still matches PRD version 17")
EPIC = "SV-11788"
DESIGN_URL = "https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R"
NOBUILD = "The build is not yet available to check this case against."
TODAY = "11/2/2026"
# Rule 69: a case that cannot yet be build-verified (no build exists) carries this marker, not READY; a later build check lifts it.
MARKER = f"AUTOMATION: Not available on Build to test Yet - Last checked {TODAY}"
def HOLD(reason): return "AUTOMATION: HOLD - " + reason
def PO_HOLD(n): return HOLD(f"waiting on the PO (question {n})")
# Credit terms precedent (cases_s11.py, QA lead 26 Oct 2026): release-day cases take their "before" values on production shortly
# before the release and are run there after it.
PRE_REL = HOLD("needs the before values taken on production shortly before the release reaches production; run on production after the release")

# ---- requirement codes: the requirement line itself, the FIRST line carrying the code -------------------------------------------
CODE = {}
for line in PRD_TXT.split("\n"):
    m = re.match(r"^\s*-?\s*(S\d+-[RNE]\d+[a-z]?):\s*(.*)$", line)
    if m and m.group(1) not in CODE: CODE[m.group(1)] = m.group(2).strip()
if len(CODE) != 68: raise SystemExit(f"PRD v17 has {len(CODE)} requirement codes; this library was written for 68")


def prd_line(start):
    for line in PRD_TXT.split("\n"):
        t = re.sub(r"^\s*-\s*", "", line).strip()
        if t.startswith(start): return t
    raise KeyError(start)


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


# ---- named PRD items without a code (each covered by a case or listed as not testable with the reason) ------------------------
NAMED = {}
def _n(key, label, text): NAMED[key] = (label, text)
_n("EH-S1", "Story 1, Error Handling", prd_line("The window never sends Technician on without Time Clock"))
_n("EH-S2", "Story 2, Error Handling", prd_line("If the counts cannot be loaded"))
_n("EH-S3", "Story 3, Error Handling", prd_line("No new failure paths: each list loads and fails as it does today."))
_n("EH-S4", "Story 4, Error Handling", prd_line("No new failure paths: the staff list loads and fails as it does today."))
_n("EH-S5", "Story 5, Error Handling", "No new failure paths.")
_n("EH-S6", "Story 6, Error Handling", prd_line("No user-facing failure path."))
_ufs = []; _inside = False
for line in PRD_MD.split("\n"):
    if line.startswith("## 8. User Feedback Summary"): _inside = True; continue
    if _inside and line.startswith("## "): break
    if _inside and line.startswith("| ") and not line.startswith("| Trigger"):
        _ufs.append(" | ".join(ws(x) for x in line.strip().strip("|").split("|")))
if len(_ufs) != 6: raise SystemExit(f"User Feedback Summary has {len(_ufs)} rows; expected 6")
for i, row in enumerate(_ufs, 1): _n(f"UFS-{i}", "User Feedback Summary", row)
KD = {
 "KD-TOGGLE": ("Technician is a toggle on each staff member, in the staff window next to Sales Representative.", 1),
 "KD-TWO": ("Who is a technician is defined by two things only: the person's Technician toggle and their Time Clock.", 2),
 "KD-BILL": ("Billable is not used to decide who is a technician, and Technician never changes Billable.", 2),
 "KD-REL": ("Release day keeps every shop as it is: Technician is turned on per person, from evidence.", 1),
 "KD-NEW": ("New staff start with Technician set from their role: on for the built-in Technician and Foreman roles, off for every other role.", 1),
 "KD-WARN": ("Turning Technician off warns and then allows; it never unassigns.", 1),
 "KD-LISTS": ("Only the lists used to assign work, and Board View and Tech View, change.", 2),
 "KD-OFFER": ("Technician also decides only who is offered, not who can be assigned or record time: assignment and clocking are checked as today.", 1),
 "KD-LOGOUT": ("Changing Technician never logs anyone out.", 1),
 "KD-NOFLAG": ("No feature flag.", 2),
}
for k, (s, n) in KD.items(): _n(k, "Key Decisions", prd_sentence(s, n))
PERM = {
 "PERM-GOV": "Changing a staff member's Technician toggle, and seeing the staff list with its Technician column and notice, are governed by 'Settings → App Settings', the existing permission for Staff.",
 "PERM-NONEW": "No new permission is introduced.",
 "PERM-NOACCESS": "Technician grants no access.",
}
for k, s in PERM.items():
    if ws(s) not in PRDW: raise KeyError(k)
    _n(k, "Key Decisions, Permissions", s)
TERMS = {
 "T-TECH": ("Technician → in this PRD, a staff member whose Technician toggle is on and whose Time Clock is on.", 2),
 "T-THREE": ("Time Clock, Billable and Technician → three different settings on the staff member.", 4),
 "T-LISTS": ("Technician lists → Board View columns, Tech View groups", 2),
 "T-OPEN": ("Open work → in the turn-off warning,", 2),
 "T-TECHVIEW": ("Tech View → the Work Orders display with one group per technician.", 2),
 "T-VOCAB": ("Vocabulary. This PRD uses the frontend vocabulary", 2),
}
for k, (s, n) in TERMS.items(): _n(k, "Terminology", prd_sentence(s, n))
OOS = ["Billable and Sales Representative. No new rules", "Clocking in on a job.", "Reports. Technician Efficiency",
       "Schedule. Schedule lanes keep following departments", "Who can see or edit work.", "Bulk editing or filtering staff by Technician."]
for i, s in enumerate(OOS, 1): _n(f"OOS-{i}", "Out of Scope", prd_line(s))
GOALS = ["A shop can take a Parts Manager", "On release day no shop loses a technician", "Existing shops need no setup",
         "Nobody is logged out by the release"]
for i, s in enumerate(GOALS, 1): _n(f"GOAL-{i}", "Goals", prd_line(s))
SUB = {
 "S2-R3 1/0": ("S2-R3, 1 work order, no lines", prd_line('1 work order, no lines:')),
 "S2-R3 0/1": ("S2-R3, no work orders, 1 line", prd_line('No work orders, 1 line:')),
 "S2-R3 1/1": ("S2-R3, 1 work order, 1 line", prd_line('1 work order, 1 line:')),
 "S2-R3 0/5": ("S2-R3, no work orders, 5 lines", prd_line('No work orders, 5 lines:')),
 "S2-R3 3/0": ("S2-R3, 3 work orders, no lines", prd_line('3 work orders, no lines:')),
 "S6-R1 a": ("S6-R1 (a)", prd_line("(a) has a time entry on a work order")),
 "S6-R1 b": ("S6-R1 (b)", prd_line("(b) leads, has labor on")),
 "S6-R1 c": ("S6-R1 (c)", prd_line("(c) has Billable on.")),
}
# Items that cannot be turned into a check a manual tester can run, with the reason (Rule 64: stated, never silently dropped)
NOT_TESTABLE = {
 "S1-N3": ("States that the feature adds no history of who changed Technician or when. There is no screen where such a history would "
           "appear, so a tester has nothing to look at and no control to prove the check ran (L-15)."),
 "EH-S4": ("Says the staff list loads and fails as today, with no new failure path. The one testable part, the notice placement when the "
           "list fails to load, is in S4-R4 and has its own (held) case."),
 "EH-S5": "Says the Public API has no new failure paths; there is nothing new to trigger.",
 "T-VOCAB": "A vocabulary note mapping the screen word location to the back-end word workplace; no behaviour.",
 "KD-NOFLAG": ("No feature flag exists to switch, so there is nothing to look for beyond the release-day cases, which already run with no "
               "setting switched on."),
}

# ---- PRD v18 (2 Nov 2026, Chris's answers 1-8) and the QA lead's "Named set" (Rule 122 amendment). Only the named set and new cases
# quote v18 and say "version 18" on their From line; every other case keeps its live text (v17 quotes, which are word for word in v18:
# checked by verify_v18_named_set.py). Pattern: build/credit-terms/authoring/ct_lib.py (NAMED_SET / on_v5). The Change Log is cut off.
PRD18_FILE = f"{P}/sources/CONFLUENCE-977371146-v18-2026-11-02.md"
PRD18_MD = open(PRD18_FILE).read().split("## 9. Change Log")[0]
PRD18_TXT = md_to_text(PRD18_MD)
PRD18W = ws(PRD18_TXT)
PRD18_RAWW = ws(re.sub(r"<[^>]+>", "", re.sub(r"\[([^\]]*)\]\(([^)]*)\)", r"\1", PRD18_MD)))
PRD18_NAME = 'PRD "Technician Toggle", Confluence 977371146, version 18 (2 Nov 2026, Chris Ward)'
CODE18 = {}
for line in PRD18_TXT.split("\n"):
    m = re.match(r"^\s*-?\s*(S\d+-[RNE]\d+[a-z]?):\s*(.*)$", line)
    if m and m.group(1) not in CODE18: CODE18[m.group(1)] = m.group(2).strip()
CHANGED18 = sorted(k for k in CODE if CODE18.get(k) != CODE[k])
if set(CODE18) != set(CODE) or CHANGED18 != ["S1-R3", "S1-R8", "S3-N1", "S3-R10"]: raise SystemExit(f"PRD v18 codes changed: {CHANGED18}")
def _v18_line(text):
    head = ws(text)[:60]
    hits = [ws(re.sub(r"^\s*-\s*", "", l)) for l in PRD18_TXT.split("\n") if ws(re.sub(r"^\s*-\s*", "", l)).startswith(head)]
    if len(hits) != 1: raise SystemExit(f"PRD v18: {len(hits)} lines start like {head!r}")
    return hits[0]
def _in18(t): return ws(t) in PRD18W or ws(t) in PRD18_RAWW
NAMED18 = {k: (lab, t if _in18(t) else _v18_line(t)) for k, (lab, t) in NAMED.items()}
NAMED18_CHANGED = sorted(k for k in NAMED if NAMED18[k][1] != NAMED[k][1])
if NAMED18_CHANGED != ["EH-S1"]: raise SystemExit(f"named items that differ in v18: {NAMED18_CHANGED} (expected only EH-S1)")
for _k, (_l, _t) in SUB.items():
    if not _in18(_t): raise SystemExit(f"sub-item {_k} is not word for word in PRD v18")
import csv as _csv, json as _json
_MAPF = f"{P}/testrail-id-map.csv"
MAPPED = {r["key"]: r["case_id"] for r in _csv.DictReader(open(_MAPF))} if os.path.exists(_MAPF) else {}
NAMED_SET = (set(_json.load(open(f"{P}/po-answers-2026-11-02/named-50-from-codes.json")))
             | {"D-26", "S1-25", "S3-09", "S3-10", "S3-21", "S3-23"}) - {"D-33", "D-34"}   # D-33, D-34 deleted (answers 5, 6)
DELETED = {"D-33": "C897374", "D-34": "C897375"}
NO_MANUAL = {"S2-34", "S2-35", "S2-36", "S3-47", "S4-07"}   # QA lead 2 Nov 2026: "Leave them out" (NO-MANUAL-CASES.md); library only, outside the set
V18_NEW = {"S1-38", "S1-39", "S1-40", "S1-41", "S3-49", "S3-50"}   # round 3 new cases, live since 2 Nov 2026 (C897376-C897381)
V18_KEYS = NAMED_SET | V18_NEW

# ---- PRD v20 (3 Nov 2026; v19 S3-N1 filter rule, v20 S6-R1 (a) department + work order, Chris's answer 9) and the QA lead's
# "Yes, named sets" (4 Nov 2026). Only the v20 named set and new cases quote v20; v18 cases keep v18; every other case keeps v17.
PRD20_FILE = f"{P}/sources/CONFLUENCE-977371146-v20-2026-11-04.md"
PRD20_MD = open(PRD20_FILE).read().split("## 9. Change Log")[0]
PRD20_TXT = md_to_text(PRD20_MD)
PRD20W = ws(PRD20_TXT)
PRD20_RAWW = ws(re.sub(r"<[^>]+>", "", re.sub(r"\[([^\]]*)\]\(([^)]*)\)", r"\1", PRD20_MD)))
PRD20_NAME = 'PRD "Technician Toggle", Confluence 977371146, version 20 (3 Nov 2026, Chris Ward)'
PRD20_READ = "read 4 Nov 2026"
CODE20 = {}
for line in PRD20_TXT.split("\n"):
    m = re.match(r"^\s*-?\s*(S\d+-[RNE]\d+[a-z]?):\s*(.*)$", line)
    if m and m.group(1) not in CODE20: CODE20[m.group(1)] = m.group(2).strip()
CHANGED20 = sorted(k for k in CODE18 if CODE20.get(k) != CODE18[k])
if set(CODE20) != set(CODE18) or CHANGED20 != ["S3-N1"]: raise SystemExit(f"PRD v20 codes changed vs v18: {CHANGED20}")
def _in20(t): return ws(t) in PRD20W or ws(t) in PRD20_RAWW
def _v20_line(text):
    head = ws(text)[:40]
    hits = [ws(re.sub(r"^\s*-\s*", "", l)) for l in PRD20_TXT.split("\n") if ws(re.sub(r"^\s*-\s*", "", l)).startswith(head)]
    if len(hits) != 1: raise SystemExit(f"PRD v20: {len(hits)} lines start like {head!r}")
    return hits[0]
NAMED20 = {k: (lab, t if _in20(t) else _v20_line(t)) for k, (lab, t) in NAMED18.items()}
if any(NAMED20[k] != NAMED18[k] for k in NAMED18): raise SystemExit("a named item changed in v20")
SUB20 = {k: (lab, t if _in20(t) else _v20_line(t)) for k, (lab, t) in SUB.items()}
if sorted(k for k in SUB if SUB20[k] != SUB[k]) != ["S6-R1 a"]: raise SystemExit("v20 sub-items changed other than S6-R1 (a)")
NAMED_SET20 = {"S3-01", "S3-02", "S3-03", "S3-04", "S3-07", "S3-08", "S3-11", "S3-48", "S3-50",
               "S6-01", "S6-02", "S6-03", "S6-04", "S6-05", "S6-06", "INV-06",
               "S1-05", "S4-10"}   # S1-05, S4-10 released 4 Nov 2026 (QA lead "Yes release them")
NEW20 = {"S3-51", "S3-52", "S3-53"}   # created 4 Nov 2026 (C913764-C913766); keep them on v20 once mapped   # created 4 Nov 2026 (C913764-C913766); keep them on v20 once mapped
def prd_version(c):
    k = c["key"]
    if k in NAMED_SET20 or k in NEW20 or (k not in MAPPED and k not in NO_MANUAL): return 20
    if k in V18_KEYS: return 18
    return 17
def on_v18(c):
    """PRD v18 or later (the v18 named set, the round 3 cases, the v20 named set and new cases): answers, design version 1793640819-ff4d."""
    return prd_version(c) >= 18
ANS_FILE = f"{P}/po-answers-2026-11-02/ANSWERS-Chris-Ward-2026-11-02.md"
ANSW = ws(open(ANS_FILE).read())
ANS = {int(m.group(1)): m.group(0) for m in re.finditer(r"(\d)\. .*", re.sub(r"\*\*Answer: ", "", open(ANS_FILE).read().replace("**", "")))
       if m.group(0)[:2] in {f"{i}." for i in range(1, 9)}}
if sorted(ANS) != list(range(1, 9)): raise SystemExit(f"answers file: {sorted(ANS)}")
ANS = {k: ws(v) for k, v in ANS.items()}
ANS_NAME = ('Chris Ward\'s answers, Google Sheet "Technician Toggle – questions for Chris Ward (2 Nov 2026)", '
            "https://docs.google.com/spreadsheets/d/1nLKkgSgmtqCYu4eu15_9xN38ml32tDnJls42PPq_A4M, column E, answered 2 Nov 2026 "
            "(po-answers-2026-11-02/ANSWERS-Chris-Ward-2026-11-02.md)")
def A(n): return (f"Answer {n} (question {n})", ANS[n])

STORY = {1: ("SV-11879", "Story 1, Technician toggle on a staff member"), 2: ("SV-11880", "Story 2, Warning before turning Technician off"),
         3: ("SV-11881", "Story 3, Who appears on the technician lists"), 4: ("SV-11882", "Story 4, Technician column and notice on the staff list"),
         5: ("SV-11883", "Story 5, Public API - technician value on staff"), 6: ("SV-11884", "Story 6, Release day")}
NAMED_STORY = {"EH-S1": 1, "EH-S2": 2, "EH-S3": 3, "EH-S4": 4, "EH-S5": 5, "EH-S6": 6,
               "UFS-1": 4, "UFS-2": 1, "UFS-3": 1, "UFS-4": 2, "UFS-5": 1, "UFS-6": 1, "PERM-GOV": 1, "PERM-NONEW": 1, "PERM-NOACCESS": 1,
               "T-OPEN": 2, "T-LISTS": 3, "T-TECH": 3, "T-TECHVIEW": 3, "T-THREE": 1, "KD-TOGGLE": 1, "KD-TWO": 1, "KD-BILL": 1,
               "KD-NEW": 1, "KD-WARN": 2, "KD-LISTS": 3, "KD-OFFER": 3, "KD-LOGOUT": 1, "KD-REL": 6,
               "OOS-1": 1, "OOS-2": 3, "OOS-3": 3, "OOS-4": 3, "OOS-5": 1, "OOS-6": 4, "GOAL-1": 3, "GOAL-2": 6, "GOAL-3": 6, "GOAL-4": 6}

CASES = []
def C(key, sec, title, pre, steps, res, q, marker=None, note="", stories=None, api=False, held=None):
    """pre: list of plain precondition bullets. steps: list of one-action steps. res: one list of bullets per step.
    q: PRD codes, NAMED keys, SUB keys, or (label, verbatim text) where label starts 'Jira SV-' or 'Tech plan' for those sources."""
    if not marker and (key in NAMED_SET20 or key in NEW20 or (key not in MAPPED and key not in NO_MANUAL)):
        marker = MARKER.replace(TODAY, "11/4/2026")   # Rule 69: the v20 pass ran on 4 Nov 2026 without a build
    marker = marker or MARKER
    if marker.startswith("PO:"):                      # a case held on a PO question names it by slug (po_questions.py)
        from po_questions import QN
        marker = PO_HOLD(QN[marker[3:]])
    CASES.append(dict(key=key, sec=sec, title=title, pre=list(pre), steps=list(steps), res=[list(r) for r in res], q=list(q),
                      marker=marker, note=note, stories=stories, api=api,
                      held=held if held is not None else marker.startswith("AUTOMATION: HOLD")))


def quotes(c):
    out = []
    ver = prd_version(c)
    codes, named, sub = {20: (CODE20, NAMED20, SUB20), 18: (CODE18, NAMED18, SUB), 17: (CODE, NAMED, SUB)}[ver]
    for x in c["q"]:
        if isinstance(x, tuple): out.append(x)
        elif x in codes: out.append((x, codes[x]))
        elif x in named: out.append(named[x])
        elif x in sub: out.append(sub[x])
        else: raise KeyError(f"{c['key']}: unknown quote key {x}")
    return out


def codes_of(c):
    out = set()
    for x in c["q"]:
        if isinstance(x, str):
            out.add(x)
            if x in SUB: out.add(x.split(" ")[0])
    return out


def story_nums(c):
    if c["stories"]: return c["stories"]
    s = set()
    for k in codes_of(c):
        m = re.match(r"S(\d+)-", k)
        if m: s.add(int(m.group(1)))
        elif k in NAMED_STORY: s.add(NAMED_STORY[k])
    return sorted(s) or [3]


e = lambda s: html.escape(s, quote=False)

from design_refs import DREFS, for_case as _for_case   # key -> {"pages", "pictures", "words", "notes"}; for_case applies design v1793640819-ff4d
def design_for(c): return _for_case(c["key"], on_v18(c))


def design_block(c):
    """Rule 117 tenth amendment: design references in their own block below the quotes (round 2, 2 Nov 2026): the board/page and picture
    names, the pictures attached to the case, the design's own words quoted, and any difference with its register id. A case whose
    screen no board draws has no entry in DREFS and gets no References from Design heading at all (coordinator, round 2)."""
    d = design_for(c)
    if not d: return ""
    h = "<p></p><p><strong>References from Design</strong></p>"
    if d.get("pages"): h += "<p>" + e(d["pages"]) + "</p>"
    if d.get("pictures"): h += "<p>Design pictures attached to this case:</p><ul>" + "".join(f"<li>{e(x)}</li>" for x in d["pictures"]) + "</ul>"
    if d.get("words"): h += "<p>The design's own words:</p><ul>" + "".join(f"<li>&ldquo;{e(w)}&rdquo;</li>" for w in d["words"]) + "</ul>"
    for n in d.get("notes") or []: h += "<p>" + e(n) + "</p>"
    return h


# every word quoted from the design must be in the design package (board files, the design system's files, or the figure captions)
_DESIGN_DIR = f"{P}/design-2026-11-02/files/project"
_DESIGN_DIR18 = f"{P}/design-2026-11-02/files-v1793640819/project"      # design version 1793640819-ff4d (2 Nov 2026, after answers 5, 6, 8)
_dtext = []
for _root, _dirs, _files in list(os.walk(_DESIGN_DIR)) + list(os.walk(_DESIGN_DIR18)):
    for _f in _files:
        if _f.endswith((".html", ".css", ".json", ".md")): _dtext.append(open(os.path.join(_root, _f), errors="replace").read())
DESIGNW = ws(re.sub(r"\s*\*\s+", " ", re.sub(r"<[^>]+>", " ", " ".join(_dtext))))
DESIGNW_RAW = ws(" ".join(_dtext))
DESIGN_IMAGES = f"{P}/design-2026-11-02/images"


def quotes_block(c):
    groups = {"prd": [], "jira": [], "plan": [], "ans": []}
    for l, t in quotes(c):
        groups["jira" if l.startswith("Jira SV-") else "plan" if l.startswith("Tech plan") else "ans" if l.startswith("Answer ") else "prd"].append((l, t))
    sto = ", ".join(f"story {STORY[n][0]} ({STORY[n][1]})" for n in story_nums(c))
    h = "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
    first = True
    prd_name, prd_read = {20: (PRD20_NAME, PRD20_READ), 18: (PRD18_NAME, PRD_READ), 17: (PRD_NAME, PRD_READ)}[prd_version(c)]
    for name, read, g in ((prd_name, prd_read, groups["prd"]), (ANS_NAME, PRD_READ, groups["ans"]), (JIRA_NAME, PRD_READ, groups["jira"]),
                          (PLAN_NAME, PRD_READ, groups["plan"])):
        if not g: continue
        h += f"<p>From: {e(name)}, {read}" + (f" &middot; Epic {EPIC}, {e(sto)}" if first else "") + "</p>"
        h += "<ul>" + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(t)}&rdquo;</li>" for l, t in g) + "</ul>"
        first = False
    return h + f"<p>{e(NOBUILD)}</p>"


def refs_of(c):
    r = [STORY[n][0] for n in story_nums(c)]
    for l, _ in quotes(c):
        m = re.match(r"Jira (SV-\d+)", l)
        if m: r.append(m.group(1))
    return ",".join(dict.fromkeys(r))


def render(c):
    pre = "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(x)}</li>" for x in c["pre"]) + "</ul>"
    exp = ("<p><strong>Expected Result</strong></p>"
           + "".join(f"<p>Step {i}:</p><ul>" + "".join(f"<li>{e(x)}</li>" for x in r) + "</ul>" for i, r in enumerate(c["res"], 1))
           + "<p></p>" + (f"<p>{e(c['note'])}</p>" if c["note"] else "")
           + quotes_block(c) + design_block(c) + f"<p>{e(c['marker'])}</p>")
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": refs_of(c), "custom_automation_type": 2,
            "custom_atmstatus": 1, "custom_preconds": pre, "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in c["steps"]) + "</ol>",
            "custom_expected": exp}


# ---- gates ------------------------------------------------------------------------------------------------------------------------
JARGON = re.compile(r"\b(HTTP|endpoint|database|devtools|DevTools|console|SQL|JSON|payload|backend|server)\b")
VERBS = (r"(click|clicks|open|opens|select|choose|type|enter|press|tick|untick|hover|save|close|clear|switch|sign|reload|refresh|pick|"
         r"set|change|delete|create|move|deactivate|reactivate|go|scroll|drag|drop|upload|send|log|wait|edit|cancel|confirm|search|pin|unpin|"
         r"remove|turn|add|approve|start|stop|unassign|assign)")
TWO = re.compile(r"\b" + VERBS + r"\b[^.]*?(,\s*then\s+|\s+and\s+then\s+|\s+then\s+|\s+and\s+)" + VERBS + r"\b", re.I)
ALLOW = re.compile(r"(Save & Close|Create & Edit|Settings → App Settings|Board View and Tech View|Time Clock and Technician)", re.I)
def two_actions(step):
    s = ALLOW.sub("X", step)
    s = re.sub(r'"[^"]*"|“[^”]*”', '"Q"', s)
    s = re.sub(r"\([^)]*\)", "", s)
    if TWO.search(s): return True
    sents = [x.strip() for x in re.split(r"(?<=\.)\s+", s) if x.strip()]
    return len([x for x in sents if re.match(VERBS, x, re.I)]) > 1

KEYRX = re.compile(r"\b(S\d{1,2}|API|INV|D|DATA|REL|DR)-\d{1,3}[a-e]?\b|\bC\d{5,6}\b")
LABEL = re.compile(r"\b(staff member|work order|line|location|role|part sale|user|technician|customer) ([A-Z]|\d)\b")
BANNED_PRE = [(r"[{}]", "a placeholder brace"), (r"For example:", "a 'For example:' line"), (r"Scenario:", "a Scenario line"),
              (r"mark this test Blocked|setup not done|If you cannot set up|If any record above is missing", "the Blocked line"),
              (r"QA lead|ask your|\bask\b|set aside", "who-to-ask or generic wording"), (r"ZZAUTOTEST", "an example record name"),
              (r"setup file|docs\.google", "a setup-file mention")]
VAGUE = re.compile(r"\bnative\b|as described\b|looks right|the same style\b|as designed\b", re.I)


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
        if not c["api"] and JARGON.search(x): p.append(f"{k}: technical term in tester text: {JARGON.search(x).group(0)}")
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
    # Rule 137 independence: a record the steps change is made fresh for this test
    for x in c["pre"]:
        if re.match(r"(Have|Create) (a|an|two|three|four|five|six) ", x) and LABEL.search(x) and "for this test" not in x and "any " not in x:
            p.append(f"{k}: a precondition record that is not said to be made for this test: {x[:70]!r}")
    for l, tq in quotes(c):
        if l.startswith("Jira SV-"):
            if ws(tq) not in JIRAW: p.append(f"{k}: quote {l} not verbatim in the saved Jira tickets")
        elif l.startswith("Tech plan"):
            if ws(tq) not in PLANW: p.append(f"{k}: quote {l} not verbatim in the saved tech plan")
        elif l.startswith("Answer "):
            if ws(tq) not in ANSW: p.append(f"{k}: quote {l} not word for word in Chris's answers")
        elif prd_version(c) == 20:
            if not _in20(tq): p.append(f"{k}: quote {l} not verbatim in PRD v20")
        elif on_v18(c):
            if not _in18(tq): p.append(f"{k}: quote {l} not verbatim in PRD v18")
        elif ws(tq) not in PRDW and ws(tq) not in PRD_RAWW: p.append(f"{k}: quote {l} not verbatim in PRD v17")
    if not any(isinstance(x, str) or not x[0].startswith(("Jira", "Tech plan", "Answer ")) for x in c["q"]):
        p.append(f"{k}: no PRD quote (Rule 57: the PRD is the source of every expected result)")
    if not c["marker"].startswith("AUTOMATION: "): p.append(f"{k}: marker")
    d = design_for(c)
    if c["sec"] == "DESIGN" and not d: p.append(f"{k}: a design case without References from Design")
    if d:
        for x in d.get("pictures") or []:
            if not os.path.exists(f"{DESIGN_IMAGES}/{x}"): p.append(f"{k}: design picture {x} not in design-2026-11-02/images/")
        for w in d.get("words") or []:
            if ws(w) not in DESIGNW and ws(w) not in DESIGNW_RAW: p.append(f"{k}: design words not found in the design package: {w[:70]!r}")
        if not (d.get("pages") or "").startswith('Design canvas "Technician Toggle"'): p.append(f"{k}: References from Design does not name the canvas")
        if on_v18(c) and "1793629882-06f7" in d["pages"]: p.append(f"{k}: a named-set or new case still names the old design version")
        if on_v18(c) and any(o in w for o in ("leaves Technician off; the user turns it on", "shows grayed out, the same as a deactivated", "Edit behaves the same") for w in d.get("words", []) + d.get("notes", [])):
            p.append(f"{k}: a named-set or new case still quotes the design's superseded words")
    return p
