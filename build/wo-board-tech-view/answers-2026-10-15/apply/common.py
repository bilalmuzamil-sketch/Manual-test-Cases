"""Shared helpers for the 15 Oct 2026 update (Chris Ward's answers 12-31, PRD Confluence 845185030 version 54).
Every proposal for a case already in the Rule 117 layout starts from the LIVE case text, parsed byte-exact (parse_live.py),
so this pass changes only what it means to change."""
import json, os, sys
H = "build/wo-board-tech-view/answers-2026-10-15/apply"
sys.path.insert(0, H)
from parse_live import parse
ALL = {c["id"]: c for c in json.load(open(f"{H}/snapshots-before/all-cases.json"))}
A = json.load(open(f"{H}/anchor-quotes-current.json"))
SHEET = "https://docs.google.com/spreadsheets/d/1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU"
MARKER_HOLD = "AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build"
CHECK_OLD = "Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026."
CHECK_CHANGED = ("Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026, before the expected results changed on "
                 "15 Oct 2026; the changed results have not yet been checked against a build.")


def q(code, label=None):
    """A verbatim PRD v54 quote, by requirement code."""
    return [label or code, A[code]]


GOALS_V54 = ("List remains the default and is unchanged from production. The only changes to the Work Orders page are the display "
             "switcher and the icons on the filter chips and Search, which follow the design file in every display option, List "
             "included (S1-R9a). Today’s tabs, toolbar layout and Create Work Order button stay as they are.")
GOALS_V52 = ("List remains the default and is unchanged from production; the only addition to the Work Orders page is the display "
             "switcher.")


def answers_ref(nums):
    nums = list(nums)
    word = "answer" if len(nums) == 1 else "answers"
    lst = nums[0] if len(nums) == 1 else ", ".join(str(n) for n in nums[:-1]) + " and " + str(nums[-1])
    return (f"Product owner answers: Chris Ward, WO Board and Tech View question sheet ({SHEET}), {word} {lst}, "
            "read 15 Oct 2026.")


def base(cid):
    p, _ = parse(ALL[cid])
    assert p and "results" in p, f"C{cid} does not parse"
    p = dict(p, case_id=cid)
    return p


def v54_source(src, answers=(), changed=False, extra=""):
    """Move a source line from PRD version 52 (read 14 Oct) to version 54 (read 15 Oct), add the answer reference and,
    when the expected results changed, say the last build check was made before the change."""
    s = src
    assert "version 52 (14 Oct 2026, Chris Ward)" in s, s[:200]
    s = s.replace("version 52 (14 Oct 2026, Chris Ward)", "version 54 (15 Oct 2026, Chris Ward)")
    i = s.index("version 54 (15 Oct 2026, Chris Ward)")
    j = s.index("read 14 Oct 2026", i)
    s = s[:j] + "read 15 Oct 2026" + s[j + len("read 14 Oct 2026"):]
    s = s.replace("Source-verified 14 October 2026.", ((answers_ref(answers) + " ") if answers else "") + (extra + " " if extra else "")
                  + "Source-verified 15 October 2026.")
    if changed:
        if CHECK_OLD in s:
            s = s.replace(CHECK_OLD, CHECK_CHANGED)
    return s


def requote(p, code, label=None):
    """Replace the quote for `code` (matched by label) with the v54 text; fails loudly if the case does not quote it."""
    lab = label or code
    hit = [i for i, (a, _) in enumerate(p["quotes"]) if a == lab]
    assert hit, f"C{p['case_id']}: no quote labelled {lab}"
    for i in hit:
        p["quotes"][i] = [lab, A[code]]
    return p


def requote_goals(p):
    hit = [i for i, (a, x) in enumerate(p["quotes"]) if a == "Goals"]
    assert hit, f"C{p['case_id']}: no Goals quote"
    for i in hit:
        p["quotes"][i] = ["Goals", GOALS_V54]
    return p


def finish(p, title=None, changed=True, summary=""):
    """Common end of a patch: keep the existing setup doc, set the marker, write the change summary."""
    if title:
        p["title"] = title
    if changed:
        p["marker"] = MARKER_HOLD
    p["change_summary"] = summary
    return p
