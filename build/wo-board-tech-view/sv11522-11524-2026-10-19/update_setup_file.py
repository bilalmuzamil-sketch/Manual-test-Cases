"""Add C682422 to C682428 (SV-11522 / SV-11524, PRD v66) to WO-BOARD-SETUP-FILE.md. Run once."""
import json, re, sys
sys.path.insert(0, "."); import cases as M
F = "/home/user/Manual-test-Cases/build/wo-board-tech-view/v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md"
s = open(F).read(); probs = []
ids = json.load(open("applied/new-case-ids.json"))
def rep(old, new):
    global s
    if s.count(old) != 1: probs.append(f"{s.count(old)} x {old[:50]}"); return
    s = s.replace(old, new)
def append_row(start, end, row):
    global s
    i, j = s.index(start), s.index(end); s = s[:i] + s[i:j].rstrip("\n") + "\n" + row + "\n\n" + s[j:]
REC = {
"N1": ['**P-TECH**: {Technician-A} "ZZAUTOTEST C{N} Ana".', '**P-CUSTOMER**: "ZZAUTOTEST C{N} Assign Wording", unit "C{N}-U1".', '**P-WO** twice on "C{N}-U1": {Work-order-1} with no lead; {Work-order-2} with lead {Technician-A}.'],
"N2": ['**P-TECH**: "ZZAUTOTEST C{N} Ana" and "ZZAUTOTEST C{N} Ben".', '**P-CUSTOMER**: "ZZAUTOTEST C{N} One Click", unit "C{N}-U1".', '**P-WO**: {Work-order-1} with lead {Technician-A}; no Schedule shift.'],
"N3": ['**P-TECH**: "ZZAUTOTEST C{N} Ana" and "ZZAUTOTEST C{N} Ben".', '**P-CUSTOMER**: "ZZAUTOTEST C{N} Toast Words", unit "C{N}-U1".', '**P-WO** three times: {Work-order-1} no lead; {Work-order-2} and {Work-order-3} with lead {Technician-A}; no shifts.', 'The picture DC-21-toast-light-1440.png is attached to the case (also in `build/wo-board-tech-view/design-look-2026-10-14/compare/`).'],
"N4": ['**P-TECH**: "ZZAUTOTEST C{N} Ana" and "ZZAUTOTEST C{N} Ben".', '**P-CUSTOMER**: "ZZAUTOTEST C{N} Toast Timing", unit "C{N}-U1".', '**P-WO** twice, both with lead {Technician-A}; no shifts.', 'Timing: measure the close with the page clock (performance.now) or a recorded video; 8 s per S4-R16.'],
"N5": ['**P-TECH**: "ZZAUTOTEST C{N} Ana" and "ZZAUTOTEST C{N} Ben".', '**P-CUSTOMER**: "ZZAUTOTEST C{N} Undo Place", unit "C{N}-U1".', '**P-WO** three times with lead {Technician-A}, then drag them in Board View into the order {Work-order-1}, {Work-order-2}, {Work-order-3}; **P-WO** once more with no lead ({Work-order-4}).', 'Audit Log: open the work order, ⋮ (top right, next to New Line) > Audit Log > Work Order Log, entries "Lead tech changed".'],
"N6": ['**P-TECH**: "ZZAUTOTEST C{N} Ana" and "ZZAUTOTEST C{N} Ben".', '**P-CUSTOMER**: "ZZAUTOTEST C{N} Undo Shifts", unit "C{N}-U1".', '**P-WO** with one approved line, lead {Technician-A}.', 'Schedule: drag the work order onto {Technician-A}\'s row, choose "Entire work order": {Shift-A} today starting an hour ago and ending later today; {Shift-B} tomorrow 8:00 to 12:00. UNVERIFIED: whether the Schedule accepts a start time in the past; if not, book {Shift-A} to start a few minutes from now and run the test once it has started.'],
"N7": ['**P-TECH**: "ZZAUTOTEST C{N} Ana" and "ZZAUTOTEST C{N} Ben".', '**P-CUSTOMER**: "ZZAUTOTEST C{N} Undo Invoiced", unit "C{N}-U1" (raise the credit limit if Over Limit).', '**P-WO-REVIEW** with lead {Technician-A}, then "Mark Reviewed" (status Complete); do not invoice.', 'Two browser contexts of the same sign-in side by side; window 2 on the work order\'s Finance tab. Leave New Customer Payment open after Create Invoice (closing it with X takes the invoice back off). The Undo must be clicked within the toast\'s 8 seconds.'],
}
for c in M.CASES:
    n = ids["cases"][c["key"]]; t = ids["tests"][c["key"]]; S = lambda x: x.replace("{N}", str(n)); L = f"[C{n}](https://shopview.testrail.io/index.php?/cases/view/{n})"
    pre = "\n".join(f"- {S(a)}" + (f" {S(b)}" if b else "") for a, b in c["pre"]) + '\n- If any record above is missing, mark this test Blocked: "setup not done".'
    body = (f"#### SETUP-C{n} — {L} {c['title']}\n\n**Satisfies these precondition lines, exactly as the case states them:**\n\n{pre}\n\n**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.\n\n"
            + "\n".join(f"{i}.  {S(x)}" for i, x in enumerate(REC[c["key"]], 1))
            + f"\n{len(REC[c['key']])+1}.  **P-START**: Board View, All tab, Search = the customer name.\n\n**Check:** every precondition line is true on screen.\n\n"
            "**Placeholder values:** the names above; give the tester the real work order numbers after setup.\n\n")
    rep("## 5. Mapping table (execution order)", body + "## 5. Mapping table (execution order)")
    append_row("## 5. Mapping table", "## 6. Dependencies", f"| {L} {c['title']} | ACCOUNT-A | SETUP-ADMIN, SETUP-C{n} |")
    tr = (f"### {L} {c['title']}\n\nSV-11522 / SV-11524 (19 Oct 2026), PRD Confluence 845185030 version 66. Quotes, word for word as in the case:\n\n"
          + "\n".join(f"- **{l}**: “{q}”" for l, q in c["q"]).replace(" #", " \\#") + "\n\n")
    rep("## 9. VIU status", tr + "## 9. VIU status")
    append_row("## 9. VIU status", "## 10. Open questions", f"| {L} | UNVERIFIED: not yet run (test T{t} in run 498). {c['marker']} |")
append_row("## 7. Reset and cleanup", "## 8. Traceability", "- **SETUP-C682422 to SETUP-C682428**: each run moves leads (and C682427 clears and restores shifts, C682428 invoices its work order): make new work orders before the next run.")
append_row("## 10. Open questions", "\x00" if False else "## 10. Open questions", "") if False else None
s = s.rstrip("\n") + ("\n- PO (Chris Ward): PRD v66 changed S4-R5 to \"{work order number} assigned to {technician name}\" / \"{work order number} unassigned\" with Undo, "
     "but the messages table (\"Lead technician updated\", \"Lead technician removed\") and the Story 4 example still read the old words. The new cases follow S4-R5.\n"
     "- S4-R32's failure alert (\"Couldn't undo the change. Please try again.\") needs a forced save failure: not checkable by hand; no manual case.\n")
rep("(26 cases, 16 to 19 Oct 2026)", "(33 cases, 16 to 19 Oct 2026)")
print("problems:", probs)
if not probs: open(F, "w").write(s); print("written")
