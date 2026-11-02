#!/usr/bin/env python3
"""Compare each story's requirement bullets (saved Jira text) with the PRD v17 requirement line of the same code, word for word.
Writes story_diff.json: {code: {"story": key, "same": bool, "story_text": ..., "prd_text": ...}} plus codes missing either side."""
import re, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tt_lib as L
txt = open(L.JIRA_FILE).read()
out, seen = {}, set()
for block in re.split(r"\n# (?=SV-\d+)", txt):
    m = re.match(r"(SV-\d+)", block)
    if not m: continue
    key = m.group(1)
    for mm in re.finditer(r"^\* (S\d+-[RNE]\d+[a-z]?): (.*)$", block, re.M):
        code, t = mm.group(1), mm.group(2)
        # S6-N1 and S6-N2 share one bullet in the story; split them
        parts = re.split(r" (?=S\d+-[RNE]\d+[a-z]?: )", t)
        for i, p in enumerate(parts):
            c2, t2 = (code, p) if i == 0 else p.split(": ", 1)
            seen.add(c2)
            prd = L.CODE.get(c2)
            out[c2] = {"story": key, "same": prd is not None and L.ws(t2) == L.ws(prd), "story_text": L.ws(t2), "prd_text": prd}
missing_in_story = sorted(set(L.CODE) - seen)
json.dump({"codes": out, "missing_in_story": missing_in_story}, open(os.path.join(L.D, "story_diff.json"), "w"), indent=1, ensure_ascii=False)
diff = [c for c, v in out.items() if not v["same"]]
print("story codes", len(out), "same", len(out) - len(diff), "differ", diff, "| PRD codes not in any story", missing_in_story)
for c in diff:
    a, b = out[c]["story_text"], out[c]["prd_text"] or ""
    i = next((k for k in range(min(len(a), len(b))) if a[k] != b[k]), min(len(a), len(b)))
    print(c, "| story:", a[max(0, i - 40):i + 80], "| prd:", b[max(0, i - 40):i + 80])
