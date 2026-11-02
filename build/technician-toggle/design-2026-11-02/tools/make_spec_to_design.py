#!/usr/bin/env python3
"""PRD -> design check by hand (Rule 130, skill 21 §6c), Technician Toggle, 2 Nov 2026: every PRD v17 requirement of Stories 1-4
(look, screen, label or message), the S3-R10 empty states, the §8 rows and the screen-less Stories 5-6, against the 6 boards and 25
pictures. Verdict: SHOWN (drawn, and the same) / NOT SHOWN (no picture draws it) / DIFFERENT (drawn or described differently: register
id) / NO SCREEN (behaviour with nothing to draw). Run: python3 -I tools/make_spec_to_design.py"""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
prd = open(os.path.join(ROOT, "..", "sources", "CONFLUENCE-977371146-v17-2026-11-02.md"), encoding="utf-8").read()
R = [
 ("S1-R1", "SHOWN", "tt-p2-02, tt-p2-03, tt-p2-05, tt-p2-06, tt-p3-01, tt-p3-02, tt-p4-01", "Toggle labeled Technician, last in one row of its own below Billable (New: Billable alone on its row; Edit: below the Location/Billable row), order Time Clock, Sales Representative, Technician, same toggle style in both windows."),
 ("S1-R2", "SHOWN", "tt-p2-02 (crops/after-new-staff-toggles.png), tt-p5-04 (crops/switcher-new-pill-techview.png)", "New pill at the top right of the word, touching its end; looks like the Work Orders display switcher's New pill (light blue fill, blue border, blue text). End moment: caption only (NOT SHOWN as a state, TT-N17)."),
 ("S1-R3", "SHOWN", "tt-p2-02 (no role, off), tt-p2-03 (Technician role + Time Clock on: on)", "Pre-fill on with the Technician role and Time Clock on; Foreman, other roles and the hand-switch rule are caption only."),
 ("S1-R4", "SHOWN", "tt-p3-01, tt-p2-02", "Off and grayed out with Time Clock off; tooltip verbatim; Time Clock off through the Public API: NO SCREEN."),
 ("S1-R5", "DIFFERENT", "tt-p3-01 caption", "TT-D01: page 3 says turning Time Clock back on leaves Technician off (shown on New Staff Member, 'Edit behaves the same'); S1-R5 v17 pre-fills from the role in New Staff Member. Question 1."),
 ("S1-R6", "SHOWN", "tt-p2-06 (on, not saved; list behind still No), tt-p2-07 (after save: Yes)", "The window's existing save is labelled 'Save & Close' (TT-D05, settled)."),
 ("S1-R7", "SHOWN", "tt-p2-06 caption, tt-p2-07", "No warning on turning on (no warning is drawn between the two pictures)."),
 ("S1-R8", "NO SCREEN", "tt-p2-06 caption", "Never logs out: caption only."),
 ("S1-R9", "SHOWN", "tt-p2-07", "Billable stays No while Technician becomes Yes."),
 ("S1-N1", "SHOWN", "tt-p3-02", "Office User role: off, grayed, tooltip verbatim. Time Clock User role: NOT SHOWN (TT-N03)."),
 ("S1-N2", "NO SCREEN", "-", "Permission as today."),
 ("S1-N3", "NO SCREEN", "-", "No history."),
 ("S1-E1", "NO SCREEN", "tt-p2-03 caption 'Edit Staff Member never does this.'", "Role change in Edit leaves Technician as it is: caption only."),
 ("S1-E2", "NOT SHOWN", "-", "Deactivated staff member: not drawn."),
 ("S1-E3", "NOT SHOWN", "-", "Open screens keep their lists: not drawn."),
 ("S1-E4", "NOT SHOWN", "tt-p2-04, tt-p4-01 (button only)", "Deactivate Account with no warning (TT-N18)."),
 ("S1 Error Handling", "NOT SHOWN", "-", "Refusal messages and the both-apply hover (TT-N01, TT-N02)."),
 ("S2-R1", "SHOWN", "tt-p4-02", "Counts across locations (caption); schedule shift not mentioned (TT-D10, settled)."),
 ("S2-R2", "SHOWN", "tt-p4-02", "Title 'Turn Off Technician'; text 'Emily Madden leads 15 open work orders and is on 141 labor lines. They'll stay on them, but won't be offered as a technician on anything new.' (S2-R2 pattern, verbatim)."),
 ("S2-R3", "NOT SHOWN", "-", "Single-count forms (TT-N04)."),
 ("S2-R4", "SHOWN", "tt-p4-02", "Buttons Cancel then Save (in that order, Save blue), X in the header; loading, outside click and window close during loading NOT SHOWN (TT-N05)."),
 ("S2-R5", "NO SCREEN", "tt-p4-02 caption", "Nothing unassigned: caption only."),
 ("S2-N1", "NO SCREEN", "tt-p4-02 caption", "No warning without open work: caption only."),
 ("S2-N2", "NO SCREEN", "-", "-"),
 ("S2-E1", "NO SCREEN", "-", "-"),
 ("S2-E2", "NO SCREEN", "-", "-"),
 ("S2-E3", "NOT SHOWN", "-", "TT-N06."),
 ("S2 Error Handling", "NO SCREEN", "-", "-"),
 ("S3-R1", "SHOWN", "tt-p5-02, tt-p5-04, tt-p5-06, tt-p5-08, tt-p6-02, tt-p6-04", "Olivia Garrett (toggle off) is offered nowhere; the other four conditions are not drawn (TT-D11, settled)."),
 ("S3-R2", "SHOWN", "tt-p5-02, tt-p5-04", "No column / group for her; names in order; column and group look unchanged."),
 ("S3-R3", "SHOWN", "tt-p5-06", "Technician filter search 'Oli' shows 'No results' (design's words, PRD silent)."),
 ("S3-R4", "SHOWN", "tt-p5-08", "Reassign lead technician, search 'Oli': No technicians match “Oli” (curly quotes); a former lead's entry 'Current · no longer assignable' NOT SHOWN (TT-N08); Assign window and Tech View NOT SHOWN (TT-N14)."),
 ("S3-R5", "SHOWN", "tt-p6-02", "Lead Technician list without her, alphabetical."),
 ("S3-R6", "SHOWN", "tt-p6-04", "Add Technician (Edit Line) without her; New Line and Edit Labor NOT SHOWN (TT-N11); 'Add Labor' wording TT-D03 (settled)."),
 ("S3-R6a", "NO SCREEN", "WorkOrder note", "Part sales: nothing changes (note)."),
 ("S3-R7", "NOT SHOWN", "tt-p6-02 caption", "TT-N07: described, not drawn (the after picture has no lead)."),
 ("S3-R7a", "DIFFERENT (letter case) / NOT SHOWN", "tt-p6-04 left card", "Label drawn 'Lead Technician' vs PRD 'Lead technician' (TT-D07, settled by 'as it does today'); the no-technician state NOT SHOWN (TT-N09)."),
 ("S3-R8", "DIFFERENT", "tt-p6-04 caption", "TT-D02: caption 'shows grayed out' on the Add Technician picture vs S3-R8 ordinary chip in Edit Line. Question 2. Edit Labor list and lock text NOT SHOWN (TT-N10)."),
 ("S3-R9", "NO SCREEN", "WorkOrder note", "TT-D15 (settled)."),
 ("S3-R10", "NOT SHOWN", "-", "TT-N12; library rule TT-D04 (question 3)."),
 ("S3-N1", "SHOWN", "tt-p5-02, tt-p5-04", "-"),
 ("S3-N2", "NO SCREEN", "-", "As today."),
 ("S3-N3", "NO SCREEN", "-", "-"),
 ("S3-E1", "NOT SHOWN", "tt-p5-02 caption", "Described, not drawn."),
 ("S3-E2", "NOT SHOWN", "-", "TT-N13."),
 ("S3-E3", "NO SCREEN", "WorkOrder note", "-"),
 ("S3 Error Handling", "NO SCREEN", "-", "-"),
 ("S4-R1", "SHOWN", "tt-p1-02, tt-p2-07", "Read-only Technician column directly left of Billable, green Yes / red No pills in the Billable style (Active tab). Deactivated tab NOT SHOWN (TT-N15)."),
 ("S4-R1a", "NO SCREEN", "-", "Location independence: not drawn."),
 ("S4-R2", "NOT SHOWN", "tt-p1-02 caption ('sortable')", "No sorted-by-Technician picture."),
 ("S4-R3", "SHOWN", "tt-p1-02 (crops/staff-header-pill.png)", "New pill at the top right of the Technician header, touching the word, inside the column, clear of Billable."),
 ("S4-R4", "SHOWN", "tt-p1-02, tt-p2-07", "Notice below the toolbar and above the Active/Deactivated tabs; text verbatim; blue info style with (i) icon. Error-line version NOT SHOWN (TT-N16)."),
 ("S4-R5", "SHOWN", "tt-p1-02", "No close button; disappearing at the end date NOT SHOWN (TT-N17)."),
 ("S4-N1", "NO SCREEN", "-", "-"),
 ("S4-N2", "NOT SHOWN", "-", "TT-N17."),
 ("S4-E1", "SHOWN", "tt-p1-02", "No control in the cells; caption TT-D09 (settled)."),
 ("S4 Error Handling", "NO SCREEN", "-", "-"),
 ("S5 (all)", "NO SCREEN", "-", "'Design: no new screens'."),
 ("S6 (all)", "NO SCREEN", "page 1 note, tt-p2-05 caption", "Release day; demo data note TT-D08 (settled)."),
 ("§8 row 1 (notice)", "SHOWN", "tt-p1-02", "Verbatim; info notice; cannot be closed."),
 ("§8 row 2 (Time Clock tooltip)", "SHOWN", "tt-p3-01", "Verbatim; tooltip while hovering."),
 ("§8 row 3 (role tooltip)", "SHOWN", "tt-p3-02", "Verbatim; Office User only drawn."),
 ("§8 row 4 (warning)", "SHOWN", "tt-p4-02", "Title and text verbatim; 'Warning window, Cancel or Save'."),
 ("§8 row 5 (Time Clock refusal)", "NOT SHOWN", "-", "TT-N01."),
 ("§8 row 6 (role refusal)", "NOT SHOWN", "-", "TT-N01."),
]
rows = []
for code, verdict, where, note in R:
    m = re.search(r"- \*\*" + re.escape(code) + r":\*\*\s*(.*)", prd)
    rows.append(dict(code=code, verdict=verdict, pictures=where, note=note, prd_text=(m.group(1)[:400] if m else None)))
from collections import Counter
out = dict(made="2026-11-02", prd="PRD v17 (Confluence 977371146)", design="canvas Technician Toggle 1793629882-06f7",
           tool="spec_to_design_check.py: 10 PRD quoted words not literally in the design files or the transcription; all 10 closed in the register (exit 0)",
           counts=dict(Counter(r["verdict"] for r in rows)), rows=rows)
json.dump(out, open(os.path.join(ROOT, "SPEC-TO-DESIGN-2026-11-02.json"), "w"), indent=1, ensure_ascii=False)
print(out["counts"], len(rows))
