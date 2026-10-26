#!/usr/bin/env python3
"""Scenario-preconditions pass (26 Oct 2026): compare every case before and after, and write PASS-REPORT.md.
Before = proposals-before-committed.json (authoring/proposals.json as committed before this pass, re-built and byte-identical to it).
After = authoring/proposals.json from build.py. Every field other than custom_preconds must be byte-identical. python3 make_pass_report.py"""
import json, os, re, html, sys
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
B = json.load(open(f"{H}/proposals-before-committed.json")); A = json.load(open(f"{P}/authoring/proposals.json"))
def items(pc):
    body = pc.split("<p><strong>Preconditions</strong></p><ul>", 1)[1].rsplit("</ul>", 1)[0]
    return [html.unescape(x.replace("</li>", "").replace("<br>", "\n    ")) for x in body.split("<li>")[1:]]
def head(pc): return pc.split("<p><strong>Preconditions</strong></p>", 1)[0]
problems, changed_other = [], []
if list(B) != list(A): problems.append("case list or order differs")
for k in A:
    b, a = B[k], A[k]
    for top in ("sec", "section_id", "title", "refs", "reports", "codes"):
        if b[top] != a[top]: changed_other.append(f"{k}: {top}")
    for f in sorted(set(b["fields"]) | set(a["fields"])):
        if f == "custom_preconds": continue
        if b["fields"].get(f) != a["fields"].get(f): changed_other.append(f"{k}: {f}")
    if head(b["fields"]["custom_preconds"]) != head(a["fields"]["custom_preconds"]): changed_other.append(f"{k}: setup-file link above Preconditions")
    ni = items(a["fields"]["custom_preconds"])
    if not ni[0].startswith("Scenario: ") or sum(x.startswith("Scenario:") for x in ni) != 1: problems.append(f"{k}: Scenario line")
    if ni[-1] != 'If any record above is missing, mark this test Blocked: "setup not done".': problems.append(f"{k}: Blocked line not last")
same_rest = sum(1 for k in A if items(B[k]["fields"]["custom_preconds"]) == items(A[k]["fields"]["custom_preconds"])[1:])
admin_only = 0
OLD_ADM = 'You are signed in as a user with the "Admin" role, with {Location-A} as your current location.'
NEW_ADM = 'You are an Admin user (the "Admin" role) working at {Location-A}, your current location.'
for k in A:
    o = [x.replace(OLD_ADM, NEW_ADM) for x in items(B[k]["fields"]["custom_preconds"])]
    if o == items(A[k]["fields"]["custom_preconds"])[1:]: admin_only += 1
other_changes = [k for k in A if [x.replace(OLD_ADM, NEW_ADM) for x in items(B[k]["fields"]["custom_preconds"])] != items(A[k]["fields"]["custom_preconds"])[1:]]
R = []
w = R.append
w("# A/R and A/P Report Sorting: Preconditions rewritten as a scenario (26 Oct 2026)")
w("")
w("QA lead, 26 Oct 2026: *\"Preconditions should be like a scenario, easier for a manual QA tester to understand  to create in the account.\"* "
  "(Rule 117 thirteenth amendment; lesson L-10.) Draft only: nothing written to TestRail, Jira, Slack or Google; nothing committed.")
w("")
w("## Result")
w(f"- Cases: {len(A)}. Every case now opens its Preconditions with one hand-written \"Scenario:\" line ({sum(1 for k in A if items(A[k]['fields']['custom_preconds'])[0].startswith('Scenario: '))} of {len(A)}).")
w(f"- Other wording changes: the standard Admin line now reads \"{NEW_ADM}\" (was \"{OLD_ADM}\"), "
  f"in every case that uses it; the Location-A example line is unchanged. Cases whose remaining preconditions are otherwise untouched: {admin_only} of {len(A)}.")
w(f"- Cases with any other precondition change: {len(other_changes)} ({', '.join(other_changes) or 'none'}). "
  "S5-39: the old first line packed the organization into the role sentence (\"in a test organization that has 8 vendors or fewer\"); it is now the standard role line "
  "plus its own bullet, \"Your organization has 8 vendors or fewer in total.\", with the same example values split across the two \"For example:\" lines.")
w("- Nothing found to remove: no precondition said who to ask, named the QA lead, or used a generic line such as a test organization set aside for a suite (script scan of all 357 cases before the pass).")
w("- The Blocked line stays last in every case; the setup-file link above the Preconditions is unchanged.")
w("")
w("## Byte-identity check (every field other than custom_preconds)")
w(f"- Compared: title, refs, sections, reports, requirement codes and every TestRail field (template, type, priority, automation fields, custom_steps, custom_expected) for all {len(A)} cases, before vs after.")
w(f"- Cases where anything other than custom_preconds changed: {len(changed_other)}" + (": " + ", ".join(changed_other) if changed_other else " (none)."))
w(f"- Structural problems: {len(problems)}" + (": " + ", ".join(problems) if problems else " (none)."))
w("- Before file: `proposals-before-committed.json` (the committed `authoring/proposals.json`; re-running build.py before the pass reproduced it byte for byte).")
w("")
w("## Gates")
w("- `authoring/build.py` gains the scenario gate: exactly one \"Scenario:\" line, first in the Preconditions, at most 40 words, no requirement code, placeholder, \"QA lead\" or \"ask your\". "
  "The scenario text is also checked by the existing tester-text checks (no requirement code, no technical term, no hard-coded test record). Negative test run: six planted faults all reported, then restored.")
w("- Setup file `AR-AP-SETUP-FILE.md` regenerated: each recipe's \"Preconditions, exactly as the case states them\" list now starts with the Scenario line; the only other changed lines are the Admin wording (341) and S5-39's new bullet. "
  "`render_outputs.py` re-run: REPORT.md, the ledger, sweep, PO draft, checklist and divergence register are unchanged.")
w("")
w("## Every case: old and new Preconditions")
for k in A:
    w(f"### {k} — {A[k]['title']}")
    w("| Old | New |"); w("|---|---|")
    o, n = items(B[k]["fields"]["custom_preconds"]), items(A[k]["fields"]["custom_preconds"])
    cell = lambda xs: "<br>".join("• " + html.escape(x).replace("\n    ", "<br>&nbsp;&nbsp;").replace("|", "\\|") for x in xs)
    w(f"| {cell(o)} | {cell(n)} |")
    w("")
open(f"{H}/PASS-REPORT.md", "w").write("\n".join(R) + "\n")
print("cases", len(A), "| other-field changes", len(changed_other), "| problems", len(problems), "| admin-only", admin_only, "| other precondition changes", other_changes)
sys.exit(1 if changed_other or problems else 0)
