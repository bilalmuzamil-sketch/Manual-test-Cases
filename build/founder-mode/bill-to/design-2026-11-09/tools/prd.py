"""PRD v0.5 helper: every requirement line by code and every §8 row, verbatim (data only)."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, "..", "..", "sources", "CONFLUENCE-1003585538-v0.5-2026-11-09.md")
TEXT = open(PATH, encoding="utf-8").read()
REQ = {}
for m in re.finditer(r"^- \*\*(S\d+-[RNE]\d+):\*\* (.+)$", TEXT, re.M):
    REQ[m.group(1)] = m.group(2).strip()
S8 = []
_SEC8 = TEXT.split("## 8. User Feedback Summary")[1].split("## 9.")[0]
for line in _SEC8.split("\n"):
    if line.startswith("| ") and not line.startswith("| Id") and not line.startswith("|---"):
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) == 4:
            S8.append(dict(id=cells[0], trigger=cells[1], message=cells[2], behavior=cells[3]))
STORY = {}
for m in re.finditer(r"^### Story (\d+): (.+)$", TEXT, re.M):
    STORY[int(m.group(1))] = m.group(2).strip()
def quote(code):
    return REQ[code]
if __name__ == "__main__":
    print(len(REQ), "requirement lines;", len(S8), "§8 rows;", len(STORY), "stories")
    for s in S8: print(" ", s["id"], "|", s["trigger"][:50])
