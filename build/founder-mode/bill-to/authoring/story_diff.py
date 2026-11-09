#!/usr/bin/env python3
"""Compare each story (saved Jira text, SV-12303..SV-12321) with PRD v0.5, word for word: every requirement, negative, edge code; every
Error handling line; every "Messages (exact text)" line against the User Feedback Summary row; Context lines (prerequisites, form factor,
dependency, trigger) against the PRD story. Writes story_diff.json and prints the differences. Latest wins (Rule 32): the PRD was last
modified 7 Nov 2026, the stories 6 Nov 2026 18:52 -0500, the epic 6 Nov 2026 14:25 -0500."""
import re, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bt_lib as L
txt = open(L.JIRA_FILE).read()
blocks = {m.group(1): b for b in re.split(r"\n# (?=SV-\d+)", txt) for m in [re.match(r"(SV-\d+)", b)] if m}
out, seen, other = {}, set(), []
for key, block in blocks.items():
    for mm in re.finditer(r"^\* (S\d+-[RNE]\d+[a-z]?): (.*)$", block, re.M):
        code, t = mm.group(1), re.sub(r"\s*\(\[PRD: Story \d+, \w+\]\([^)]*\)\)\s*$", "", mm.group(2))
        if code in seen: continue          # the "Messages (exact text)" list reuses the code S12-R7 as a message label
        seen.add(code)
        prd = L.CODE.get(code)
        out[code] = {"story": key, "same": prd is not None and L.ws(t) == L.ws(prd), "story_text": L.ws(t), "prd_text": prd}
    for mm in re.finditer(r"^\* Error handling: (.*)$", block, re.M):
        t = L.ws(mm.group(1))
        if t not in L.PRDW: other.append({"story": key, "kind": "error handling", "text": t, "in_prd": False})
    for mm in re.finditer(r"^\* (Prerequisite|Form factor|Dependency|Trigger): (.*)$", block, re.M):
        kind, t = mm.group(1), L.ws(re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", mm.group(2)))
        if t not in L.PRDW and t not in L.PRD_RAWW:
            other.append({"story": key, "kind": kind, "text": t, "in_prd": False})
    for mm in re.finditer(r"^\* (M\d|D\d|G\d|Q\d|Help|Pays for|Portal|S12-R7): (.*)$", block, re.M):
        msg = re.findall(r'"([^"]+)"', L.ws(mm.group(2)))
        for x in msg[:1]:
            if x not in L.PRDW and x not in L.PRD_RAWW: other.append({"story": key, "kind": "message", "text": x, "in_prd": False})
missing_in_story = sorted(set(L.CODE) - seen)
diff = sorted((c for c, v in out.items() if not v["same"]), key=lambda c: (int(c[1:].split("-")[0]), c))
epic = L.ws(blocks["SV-12289"])
epic_notes = [
 {"text": "Release dependencies: AccountingHub change (Hub team) and the customer portal deposit check.",
  "in_epic": "AccountingHub change (Hub team)" in epic,
  "prd": L.CODE["S18-R2"] + " / " + L.NAMED["KD-AH"][1],
  "verdict": "CONFLICT resolved by latest wins (Rule 32): the PRD (last modified 7 Nov 2026; owning PM ruling 6 Nov 2026) says no "
             "AccountingHub change is needed; the epic text (updated 6 Nov 2026 14:25 -0500) is older. Cases follow the PRD (Story 18)."},
 {"text": "QuickBooks invoice under the Bill To, customers linked by ID; customer portal; IBS.", "in_epic": "customers linked by ID" in epic,
  "prd": L.CODE["S17-R2"], "verdict": "SAME meaning (S17-R2: a linked customer always syncs to its QuickBooks customer)."},
 {"text": "Stories carry \"Status: Pending approval from Mat and Amani. Do not start until approved.\"", "in_epic": True,
  "prd": "PRD status: Pending approval from Mat and Amani (v0.5, 2026-11-06).", "verdict": "SAME (both pending approval)."},
]
json.dump({"codes": out, "missing_in_story": missing_in_story, "other_lines_not_in_prd": other, "epic": epic_notes},
          open(os.path.join(L.D, "story_diff.json"), "w"), indent=1, ensure_ascii=False)
print("story codes", len(out), "same", len(out) - len(diff), "differ", diff, "| PRD codes not in any story", missing_in_story)
print("other story lines not word for word in the PRD:", len(other))
for o in other: print("  ", o["story"], o["kind"], "|", o["text"][:150])
for c in diff:
    a, b = out[c]["story_text"], out[c]["prd_text"] or ""
    i = next((k for k in range(min(len(a), len(b))) if a[k] != b[k]), min(len(a), len(b)))
    print(c, "| story:", a[max(0, i - 40):i + 80], "| prd:", b[max(0, i - 40):i + 80])
for n in epic_notes: print("epic:", n["text"][:80], "|", n["verdict"][:90])
