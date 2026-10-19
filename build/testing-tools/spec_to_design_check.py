#!/usr/bin/env python3
"""Spec-to-design check (Rule 124, twelfth-pass amendment of 19 Oct 2026). The design drive's text inventory only asks "is every word
the DESIGN shows in a case?". This asks the other way: "does the design show every word and element the PRD REQUIRES?". Anything the
PRD requires that the design does not show is a design-vs-PRD difference, and every difference must sit in the project's divergence
register with a real outcome. Exit 1 while any is missing from the register.

Why it exists: on WO Board the design (export of 14 Oct 2026) had "Assign Tech", a lead dialog with no Unassigned row and no confirm
button, and a toast "S1-352 assigned to Kristin Watson" with Undo. The PRD said "Reassign lead technician", "Unassigned is the first
row", "Confirming the dialog" and "Lead technician updated". The words were filed as "KNOWN, cases follow the spec"; the missing row and
button were never compared at all. No question went to the PO for the label or the dialog, and no case existed for the design's
version, so when the designer raised SV-11522 / SV-11524 and the PO moved the PRD to the design (v66, 19 Oct 2026), nothing was ready.

  python3 build/testing-tools/spec_to_design_check.py --prd PRD.md --design FILE [FILE ...] --register REGISTER.json [--out OUT.json]

PRD.md: the saved PRD (requirement lines "- **S4-R12:** ..."). FILE: the design export's .html files. REGISTER.json:
  {"<code>|<words>": {"outcome": "QUESTION-SENT|PO-RULED|QA-LEAD-RULED", "where": "sheet/row or quote+date", "cases": ["C…"]}}
"KNOWN" is not an outcome: a difference is closed only by a sent question or a ruling.
Elements the PRD names without quotes (a row, a button, an order) are not machine-checkable: the design drive lists each dialog's,
menu's and toast's rows and buttons by hand (skill 21, step "spec to design") and adds any difference to the same register."""
import argparse, glob, html, json, re, sys
ap = argparse.ArgumentParser()
ap.add_argument("--prd", required=True); ap.add_argument("--design", nargs="+", required=True)
ap.add_argument("--register", required=True); ap.add_argument("--out")
a = ap.parse_args()
prd = open(a.prd, encoding="utf-8").read()
files = [f for p in a.design for f in glob.glob(p)]
des = html.unescape(" ".join(open(f, encoding="utf-8", errors="replace").read() for f in files)).lower()
reg = json.load(open(a.register)) if glob.glob(a.register) else {}
OK = {"QUESTION-SENT", "PO-RULED", "QA-LEAD-RULED"}
rows = []
for line in prd.split("\n"):
    m = re.match(r"- \*\*(S\d+-[RNE]\d+[a-z]?):\*\*\s*(.*)", line)
    if not m: continue
    for q in re.findall(r"[“\"]([^”\"]{2,90})[”\"]", m.group(2)):
        probe = q.split("{")[0].strip()
        if len(probe) < 3 or probe.lower() in des: continue
        key = f"{m.group(1)}|{q}"; r = reg.get(key, {})
        rows.append(dict(key=key, code=m.group(1), words=q, outcome=r.get("outcome"), closed=r.get("outcome") in OK))
open_rows = [r for r in rows if not r["closed"]]
print(f"design files {len(files)}; PRD words not shown by the design: {len(rows)}; not closed in the register: {len(open_rows)}")
for r in open_rows: print(f"OPEN {r['code']}: \"{r['words']}\"" + (f" (outcome '{r['outcome']}' is not a closing outcome)" if r["outcome"] else ""))
if a.out: json.dump(rows, open(a.out, "w"), indent=1, ensure_ascii=False)
sys.exit(1 if open_rows else 0)
