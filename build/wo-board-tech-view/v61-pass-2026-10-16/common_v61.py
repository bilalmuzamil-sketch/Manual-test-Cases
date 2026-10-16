"""Shared helpers for the v61 full pass (16 Oct 2026; PRD Confluence 845185030 version 61). Import in a batch script as
    import sys; sys.path.insert(0, "build/wo-board-tech-view/v61-pass-2026-10-16"); from common_v61 import *
Every quote comes from the v61 anchor map (q) or is copied verbatim from the v61 file (the checker proves it)."""
import json, re, sys
V = "build/wo-board-tech-view/v61-pass-2026-10-16"
sys.path.insert(0, "build/wo-board-tech-view/answers-2026-10-15/apply")
from parse_live import parse                                                    # byte-exact Rule 117 parser
from docparts import SIGNIN, LOCATION, WIDTH, tech, customer, wo, view_only_user, no_shifts, PART2_EVIDENCE
PRE_ADMIN = ("You are signed in as an Owner or Admin user whose role has Work orders > View and Work orders > Create & Edit, at "
             "{Location-A} (for example Staging Heavy Duty - 9919).")
PRE_WIDTH = ("Your browser window is at least 1024 px wide, so the display switcher (List, Tech View, Board View) shows at the right "
             "of the Work Orders toolbar.")
PRE_CLEAR = ("On the Work Orders page nothing is ticked in Status, Asset on Site shows no choice (if its chip shows Yes or No, click "
             "the x on the chip), Assigned to me is off and Search is empty.")
CLEAR_DOC = ("Work Orders > All: clear any Status selection, click the x on the Asset on Site chip if it shows Yes or No, turn "
             "Assigned to me off and empty Search.")
def pre_tech(ph, ex):
    return (f"Technician {{{ph}}} (for example {ex}) is an active staff member at {{Location-A}} with Time Clock on and a Role other "
            "than Office User or Time Clock User.")

ALL = {c["id"]: c for c in json.load(open(f"{V}/snapshots-before/all-cases.json"))}
A = json.load(open(f"{V}/anchor-quotes-current.json"))
PRDTEXT = open(f"{V}/CONFLUENCE-845185030-v61-2026-10-16.md").read()
PRD_NAME = "PRD \"Work Orders — Board View & Tech View Display Options\", Confluence 845185030, version 61 (16 Oct 2026, Chris Ward)"
SHEET = "https://docs.google.com/spreadsheets/d/1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU"
CHANGED_TAIL = ", before the expected results changed on 16 Oct 2026; the changed results have not yet been checked against a build."

def q(code, label=None):
    """A verbatim PRD v61 quote by requirement code (e.g. q("S2-R11a"))."""
    return [label or code, A[code]]

def prd_line(start):
    """A verbatim PRD v61 bullet that is not a coded requirement (Goals, Decisions, Out of Scope ...), found by its opening words.
    Returns the bullet text without markdown bold, exactly as the checker compares it."""
    for line in PRDTEXT.splitlines():
        t = re.sub(r"^\s*\\?[-*]\s+", "", line).replace("**", "")
        if t.startswith(start): return t.strip()
    raise KeyError(start)

def base(cid):
    """Live case already in the Rule 117 layout, parsed into the proposal dict (title, preconditions, steps, results, source,
    quotes, marker, divergence, checked ...)."""
    p, _ = parse(ALL[cid]); assert p and "results" in p, f"C{cid} is not in the Rule 117 layout"
    return dict(p, case_id=cid)

def answers_ref(nums):
    nums = list(nums); w = "answer" if len(nums) == 1 else "answers"
    lst = str(nums[0]) if len(nums) == 1 else ", ".join(map(str, nums[:-1])) + " and " + str(nums[-1])
    return f"Product owner answers: Chris Ward, WO Board and Tech View question sheet ({SHEET}), {w} {lst}, read 15 Oct 2026."

def src(stories, codes, extra="", answers=()):
    """Sentence 1 of the provenance line (documents only, Rule 54)."""
    s = f"Epic SV-10043; {stories}; {PRD_NAME}, {codes}, read 16 Oct 2026."
    if extra: s += " " + extra
    if answers: s += " " + answers_ref(answers)
    return s + " Source-verified 16 October 2026."

def v61_source(s):
    """Move an existing Rule 117 source line (PRD version 48/49/52/54/58) to version 61 read 16 Oct 2026."""
    s2 = re.sub(r"Confluence 845185030, version \d+ \(\d+ Oct 2026, Chris Ward\)", "Confluence 845185030, version 61 (16 Oct 2026, Chris Ward)", s)
    s2 = re.sub(r"(version 61 \(16 Oct 2026, Chris Ward\)[^.]*?)read \d+ Oct 2026", r"\1read 16 Oct 2026", s2, count=1)
    s2 = re.sub(r"Source-verified \d+ October 2026\.?", "Source-verified 16 October 2026.", s2)
    assert "version 61" in s2, s[:160]
    return s2

def checked_line(old, changed):
    """Rule 54 sentence 2: keep the case's own last build check; if the expected results changed, say it predates the change."""
    if not old: return None
    old = old.strip().rstrip(".")
    old = re.sub(r", before the expected results changed on [^;]*; the changed results have not yet been checked against a build$", "", old)
    return old + (CHANGED_TAIL if changed else ".")

def mk(cid, title, pre, steps, results, source, quotes, marker, part1, part2, summary, expected_changed,
       divergence=None, checked=None, reuse_doc=None, expect_fail=None):
    p = {"case_id": cid, "title": title, "preconditions": pre, "steps": steps, "results": results, "source": source,
         "quotes": quotes, "marker": marker, "change_summary": summary, "expected_changed": bool(expected_changed)}
    if reuse_doc: p["reuse_doc"] = reuse_doc
    else: p["doc_part1"] = part1; p["doc_part2"] = part2 + [PART2_EVIDENCE]
    if divergence: p["divergence"] = divergence
    if checked: p["checked"] = checked
    if expect_fail: p["expect_fail"] = expect_fail
    return p

def write(batch, updates, new=()):
    json.dump({"updates": updates, "new": list(new)}, open(f"{V}/proposals/proposals-{batch}.json", "w"), indent=1, ensure_ascii=False)
    print(batch, len(updates), "updates", len(new), "new")

def mark_changed(s):
    """For a source line that carries its own 'Last checked against build …' sentence: when this pass changes the expected results,
    that check predates the change, so restate it with today's date (replaces any earlier 'before the expected results changed …')."""
    m = re.search(r"Last checked against build [^;]*?(?=(, before the expected results changed|\.\s*$|\.\s+[A-Z]))", s)
    if not m: return s
    head = s[:m.end()]; rest = s[m.end():]
    rest = re.sub(r"^, before the expected results changed on [^;]*; the changed results have not yet been checked against a build\.?", "", rest)
    rest = re.sub(r"^\.", "", rest)
    return head + CHANGED_TAIL + rest
