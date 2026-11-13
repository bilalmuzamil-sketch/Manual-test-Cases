"""Round 4 (13 Nov 2026): PRD v1.3 (12 Nov 2026, Milos Vasic) and design version 1794510020-d4ec, plus the fixes of the full read
(po-answers-2026-11-12/full-read/). Loaded after every other case module. PRD v1.2/v1.3: Close Work Order closes on one press with no
confirmation; "Posting date" and the posting summary sit on the Finance tab; a dialog opens only for a missing original work order or a
vendor bill cost move (S3-R1, S3-R2); the Settings tab keeps one hint line (S1-R3). Every change is listed per case in V13_CHANGES
(PASS-REPORT.md, Rule 134). Cases that only tested the removed Close confirmation are retired and proposed for deletion (RETIRE_V13)."""
import re
from iwo_lib import C, CASES, MARKER, NOMAN, CODE
from common import *

BY = {c["key"]: c for c in CASES}
V13_CHANGES = {}
RETIRE_V13 = {}
def _log(k, w): V13_CHANGES.setdefault(k, []).append(w)

OPEN = re.compile(r"^(In tab 1, c|C)lick Close Work Order( in the work order header| in the header| in the menu| on the Finance tab)?\.$|^Click the step's Close Work Order button\.$")
CONFIRM = re.compile(r"Close Work Order in the (confirmation|window)\.$")
TRIVIAL = {"The Close confirmation opens.", "The confirmation opens.", "The Close window opens."}


def one_press(c):
    """PRD v1.3 S3-R1: Close Work Order closes on the press. An 'open the confirmation' step whose only result is that the confirmation
    opens, followed by 'Click Close Work Order in the confirmation', becomes one step with the second step's results."""
    i = 0; n = 0
    while i < len(c["steps"]) - 1:
        if OPEN.search(c["steps"][i]) and c["res"][i] and all(r in TRIVIAL for r in c["res"][i]) and CONFIRM.search(c["steps"][i + 1]):
            c["res"][i] = c["res"][i + 1]; del c["steps"][i + 1]; del c["res"][i + 1]; n += 1
        i += 1
    if n: _log(c["key"], f"one press (S3-R1 v1.3): {n} 'open the confirmation' + 'Close Work Order in the confirmation' step pair(s) made one step")


for c in CASES: one_press(c)


SUMMARY_WORDS = [("The Close confirmation shows", "The posting summary shows"), ("The confirmation shows", "The posting summary shows"),
                 ("The confirmation reads", "The posting summary reads"), ("The confirmation lists", "The posting summary lists"),
                 ("The confirmation's sentence reads", "The sentence under the posting summary reads"),
                 ("The sentence reads", "The sentence under the posting summary reads"), ("The rows show", "The posting summary's rows show"),
                 ("\"This completes the work order, posts the parts cost and shop supplies to your books and marks it", "\"Closing posts the parts cost and shop supplies to your books and marks the work order"),
                 ("\"This posts the parts cost", "\"Closing posts the parts cost"), ("\"This marks the work order", "\"Closing marks the work order"),
                 ("A window titled \"Close work order [number]?\" opens with a posting date field set to today.", "The Finance tab shows the field \"Posting date\" set to today."),
                 ("The confirmation opens with today's date.", "The \"Posting date\" field shows today's date."),
                 ("The confirmation opens.", "The \"Posting date\" field shows today's date."), ("The Close confirmation opens.", "The \"Posting date\" field shows today's date.")]
FINANCE_STEP = "Open the Finance tab."
CLOSE_STEP = "Click Close Work Order on the Finance tab."


def summary_first(c, keep_dialog=False):
    """PRD v1.3 S3-R2: what the confirmation showed (posting date, rows, sentence) sits on the Finance tab before Close; the press closes.
    'Click Close Work Order' (whose result was the confirmation) + any middle steps + 'Click Close Work Order in the confirmation' become
    'Open the Finance tab' (the summary) + the middle steps + 'Click Close Work Order on the Finance tab' (the result after Close)."""
    st, rs = c["steps"], c["res"]; i = 0; n = 0
    while i < len(st):
        if OPEN.search(st[i]):
            j = next((x for x in range(i + 1, min(i + 4, len(st))) if CONFIRM.search(st[x])), None)
            if j is not None:
                summ = []
                for r in rs[i]:
                    for a, b in SUMMARY_WORDS: r = r.replace(a, b)
                    summ.append(r)
                fin_before = i > 0 and st[i - 1] == FINANCE_STEP
                new_st = ([] if fin_before else [FINANCE_STEP]) + st[i + 1:j] + [CLOSE_STEP]
                new_rs = ([] if fin_before else [summ]) + rs[i + 1:j] + [rs[j]]
                if fin_before: rs[i - 1] = rs[i - 1] + summ
                st[i:j + 1] = new_st; rs[i:j + 1] = new_rs; n += 1
                i += len(new_st); continue
        i += 1
    if n: _log(c["key"], f"posting summary first (S3-R2 v1.3): {n} Close confirmation sequence(s) rewritten as Finance tab summary, then one press")
    return n

DIALOG_CASES = {"S3-11", "S3-55", "S3-47", "S3-48", "REL-06", "API-25", "D-42", "D-44", "D-61", "S3-53", "S3-54"}
for c in CASES:
    if c["key"] not in DIALOG_CASES: summary_first(c)


def summary_only(c):
    """A step that opened the confirmation only to read it (no Close after it): the same rows are read on the Finance tab (S3-R2 v1.3)."""
    st, rs = c["steps"], c["res"]; n = 0
    for i in range(len(st)):
        if OPEN.search(st[i]) and not any(CONFIRM.search(x) for x in st[i + 1:i + 4]) and not all(r in TRIVIAL for r in rs[i]) \
                and re.search(r"confirmation|row|sentence|note|Posting date|posting date|Stock parts|Labor", " ".join(rs[i])) and "Closed" not in " ".join(rs[i]):
            out = []
            for r in rs[i]:
                for a, b in SUMMARY_WORDS: r = r.replace(a, b)
                out.append(r)
            if i > 0 and st[i - 1] == FINANCE_STEP:
                rs[i - 1] = rs[i - 1] + out; st[i] = None
            else:
                st[i] = FINANCE_STEP; rs[i] = out
            n += 1
    if n:
        keep = [k for k, s in enumerate(st) if s is not None]
        c["steps"] = [st[k] for k in keep]; c["res"] = [rs[k] for k in keep]
        _log(c["key"], f"posting summary (S3-R2 v1.3): {n} step(s) that opened the Close confirmation to read it now read the Finance tab")

for c in CASES:
    if c["key"] not in DIALOG_CASES: summary_only(c)
