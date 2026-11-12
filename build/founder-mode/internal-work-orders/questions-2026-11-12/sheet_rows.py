"""Internal Work Orders question sheet for Milos Vasic, 12 Nov 2026. Same layout as the Chris Ward sheets (Bill To 1o55Q5O5…):
title, greeting, colour guide, header, one row per question; questions 12-16 (from the design) as their own batch in light green.
Rows come from ../PO-QUESTIONS-DRAFT.md (the markdown table)."""
import json, os, re
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
MD = open(f"{P}/PO-QUESTIONS-DRAFT.md").read().split("\n## QA-only")[0]
TITLE = "Internal Work Orders – questions for Milos Vasic (12 Nov 2026)"
GREET = ("Hello sir, while we were writing the Internal Work Orders test cases from the final PRD (v1.0, 9 Nov), its Jira stories, the "
         "developers' plan and the design \"Internal Work Orders · All flows v6\", a few points came up that only you can decide. Each one "
         "decides whether a test passes; everything else on the same screens is written and ready. Each has a suggested answer, so a letter "
         "such as (a) in the yellow column is plenty.")
ROWS = []
for line in MD.splitlines():
    m = re.match(r"\| (\d+) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|  \| (.*?) \|$", line)
    if not m: continue
    n, topic, q, know, opts, where = m.groups()
    opts = opts.replace("<br>", "\n")
    ROWS.append([int(n), "Internal Work Orders: " + topic, q + "\n" + opts, know, where])
assert [r[0] for r in ROWS] == list(range(1, 17)), [r[0] for r in ROWS]
def values():
    v = [[TITLE, "", "", "", "", ""], [GREET, "", "", "", "", ""],
         ["Colour guide:", "Yellow = please write your answer here", "Blue = the topic", "Grey = where we found it",
          "Light green = questions from reading the design (from row 18)", ""],
         ["", "", "", "", "", ""], ["#", "Topic", "Question for you", "What we know today", "Your answer", "Where we found it"]]
    v += [[str(r[0]), r[1], r[2], r[3], "", r[4]] for r in ROWS[:11]]
    v += [["Questions from reading the design (12 Nov 2026), questions 12 to 16", "", "", "", "", ""]]
    v += [[str(r[0]), r[1], r[2], r[3], "", r[4]] for r in ROWS[11:]]
    return v
if __name__ == "__main__":
    json.dump(values(), open(f"{H}/sheet-values.json", "w"), ensure_ascii=False, indent=1)
    for r in ROWS: print(r[0], r[1][:70], "|", r[4][:50])
