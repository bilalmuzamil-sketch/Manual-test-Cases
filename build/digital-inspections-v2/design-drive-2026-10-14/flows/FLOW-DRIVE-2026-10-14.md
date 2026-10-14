# DVI V2 — targeted flow drive, 14 Oct 2026 (Rule 124 gate (c))

Driven by script with Playwright/Chromium against the locally served package (`scripts/flows.py`, `scripts/flows2.py`). Each flow starts from a fresh load; the visible text after every step is recorded in `flows-2026-10-14.json`, and `FLOW-STEPS-2026-10-14.md` lists, per step, the lines that appeared and disappeared. A step whose target is missing is recorded as FAILED, never skipped. Results were read step by step: a step "not failed" was only accepted when the expected text actually appeared.

Flows: 46 scripted + 3 extra checks (rename, attach/remove, A6 hover and menu). Steps: 153. Step failures in the first run: 2 (TB-03 rename: the readonly input selector; FD-02: a selector) — both re-driven in `flows-extra-2026-10-14.json` and confirmed.

| Flow | Board | Steps | What was confirmed |
|---|---|---|---|
| FI-01 Mark axle OK then Undo | Prototype - Fill Inspection | 2 | "10 positions marked OK" + Undo; Undo restores "2 of 12 positions" |
| FI-02 Mark section OK then Undo | Prototype - Fill Inspection | 2 | "31 answers marked OK" + Undo (unit mixes positions and answers: SC-12) |
| FI-03 Not OK opens note + instruction, acknowledge | Prototype - Fill Inspection | 3 | NOTE Required + INSTRUCTION Required + file + Acknowledge; outstanding 5→4; second press clears it again (SC-14) |
| FI-04 OK shows Instruction marker, open and Hide | Prototype - Fill Inspection | 3 | OK → footer "Instruction" marker → opens with "Hide" → collapses |
| FI-05 Verdict dropdown on a tire value | Prototype - Fill Inspection | 2 | menu head "Left outer tire · Tire pressure · 42 psi", pick Monitor |
| FI-06 Add axle, remove axle, Single/Dual | Prototype - Fill Inspection | 4 | "+ Add Axle" → Axle 4; "Remove this axle"; Single then Dual restores inner columns |
| FI-07 Axle tabs and top view | Prototype - Fill Inspection | 3 | axle tabs switch the single shown axle (SC-19) |
| FI-08 Next section, submit with items, outstanding list, go to first | Prototype - Fill Inspection | 3 | Next → section 2 → Submit & Generate Report opens "4 items before submitting" (kind first) → Go to the first one lands on the axle field |
| FI-09 Outstanding button toggles list, close | Prototype - Fill Inspection | 2 | Outstanding button toggles the list |
| FI-10 Complete everything and submit | Prototype - Fill Inspection | 4 | Mark section OK ×2 → Submit → "Inspection submitted" end screen |
| FI-11 Monitor needs note and ack, outstanding kinds | Prototype - Fill Inspection | 6 | Monitor opens NOTE Required + INSTRUCTION Required + Leak-test-steps.pdf; typing the note and Acknowledge drop the count 5→3 |
| FI-12 Reference file viewer | Prototype - Fill Inspection | 2 | reference file Open → viewer → Close (SC-11) |
| FI-13 Instruction file viewer | Prototype - Fill Inspection | 3 | instruction file name opens the viewer → Close |
| FI-14 Collapse and expand section | Prototype - Fill Inspection | 2 | Collapse section → "Show 2 fields" → expands (SC-26) |
| FI-15 Phone: verdict sheet and last-section action | Prototype - Fill Inspection | 6 | phone: verdict bottom sheet; last section action reads "Review & Sign" (SC-13); list "4 items before submitting" incl. "Note … Not OK" |
| FI-16 Change answer drops acknowledgement | Prototype - Fill Inspection | 4 | Not OK → Acknowledge → Monitor (instruction and ack dropped) → Not OK (asks afresh) |
| FI-17 Reset | Prototype - Fill Inspection | 2 | Reset restores the start state |
| TB-01 Follow-up toggles and acknowledgement | Prototype - Template Builder | 4 | follow-up switch off/on; N/A follow-up checkbox shows "No text yet"; Require acknowledgement toggle (Monitor/Not OK only) |
| TB-02 Include Monitor off/on | Prototype - Template Builder | 2 | Include Monitor off removes Monitor from the canvas sub-line and note rule text |
| TB-03 Rename response | Prototype - Template Builder | 2 | pencil makes the response editable; renamed "Pass" shows on the canvas (extra run) |
| TB-04 Attach and remove follow-up file | Prototype - Template Builder | 3 | follow-up Attach File adds a file, Remove file removes it (extra run) |
| TB-05 Validation toggles and summary | Prototype - Template Builder | 4 | validation toggles change the summary sentence; photo rules mutually exclusive |
| TB-06 Add field picker, Per axle, Checkbox | Prototype - Template Builder | 4 | + Add Field → FIELD TYPE → Per axle ("Per axle measurements", SC-06) / Checkbox ("New checkbox") |
| TB-07 Per axle editor rows, units, scope, axles | Prototype - Template Builder | 5 | rows editor: + Add Measurement Row adds "New measurement" (SC-07), unit select, scope select "Every tire/Each side" (SC-05), Delete row |
| TB-08 Duplicate and delete field | Prototype - Template Builder | 2 | Duplicate Field "(copy)", Delete Field → "Select a field to edit its properties." |
| TB-09 Preview, click a card returns to Edit | Prototype - Template Builder | 3 | Preview shows every section read-only; clicking a card returns to Edit with that field selected |
| TB-10 Publish toast | Prototype - Template Builder | 2 | Publish → "Published" + toast "Template published · new inspections use this version" |
| TB-11 Add section | Prototype - Template Builder | 1 | + Add Section → "Section 3" |
| TB-12 General reference file remove/attach | Prototype - Template Builder | 2 | general reference file remove → "PDF, JPG or PNG · up to 10 MB" (SC-09) → attach |
| TB-13 Disabled field types | Prototype - Template Builder | 3 | disabled field types do nothing (title "<type> is not part of this prototype") |
| TB-14 Phone: properties sheet and Done | Prototype - Template Builder | 3 | phone: properties sheet with "Done" (SC-22) |
| TB-15 Change field type | Prototype - Template Builder | 1 | change type to Per axle resets the field |
| WO-01 Build lines on this work order, review, uncheck, add | Prototype - Work Order Handoff | 5 | Build lines → BUILD THE LINES ON → This work order → drafting (1.8 s) → review, untick one → "Add 2 Lines" → toast "2 lines added to S-81", Lines (2) |
| WO-02 Build lines on a new work order | Prototype - Work Order Handoff | 4 | A new work order → review title "… to a new work order" → toast "… new work order S-82" (prototype shows the lines on S-81) |
| WO-03 Discard drafts | Prototype - Work Order Handoff | 4 | Discard closes the review, nothing added |
| WO-04 Uncheck all lines disables Add | Prototype - Work Order Handoff | 7 | untick all → "Add 0 Lines" inert (S15-N4) |
| WO-05 ShopCoach off | Prototype - Work Order Handoff | 3 | ShopCoach off: no Build lines on inspection, note or asset rows; plain line (stale wording SC-18) |
| WO-06 Work order Notes tab, open inspection, PDF | Prototype - Work Order Handoff | 5 | Go to work order → Notes → View PDF viewer → Close → Open Inspection |
| WO-07 Build from Notes | Prototype - Work Order Handoff | 5 | Build lines from the Notes card → review → Add 3 Lines |
| WO-08 Asset inspections tab, View, Build lines | Prototype - Work Order Handoff | 5 | Customers → asset Inspections (5) "1 of 5 has findings…" (SC-18) → View → back → row Build lines |
| WO-09 Other tabs | Prototype - Work Order Handoff | 4 | Parts/Timesheets/Finance: "This tab is not part of the prototype." |
| WO-10 Phone: target sheet | Prototype - Work Order Handoff | 4 | phone: bottom sheet "Build the lines on" |
| WO-11 After lines added, Build lines gone | Prototype - Work Order Handoff | 6 | after Add Lines, Build lines is gone from the note and the asset row (S2-R13) |
| FD-01 A6 live: Mark field OK tooltip, press, Undo | Inspection Fill V2 - Desktop | 2 | A6: press Mark field OK → "2 positions marked OK" + Undo; hover tooltip (extra run) "Marks every position in this field OK. 2 still Not inspected. Verdicts already picked stay. Values are never filled in." |
| FD-02 A6 live: Single/Dual, verdict menu | Inspection Fill V2 - Desktop | 4 | A6: Single → chip "1 position Monitor", Dual restores; verdict menu head "Left inner tire · 98 psi" (extra run) |
| HUB-01 Hub links | Prototype - Hub | 1 | Hub card opens the Template Builder prototype |

## Static boards (no script): flows read as ordered artboards and their in-board links

Conditional Follow-up V2 (CI1c → CI1b → CI1e → CI1d → CI3 1–7 → CI4 → CI5 → CI6 → CI7 → CI8 → CI9), ShopCoach Line Builder V2 (A → B → B3 → B4 → B4b → B2 → B2b → C1 → C2 → C3 → C4 → D → E → E2 → E3 → F → P1 → P1b → P2 → P2b → P3 → P4), Template Builder V2 (TB1 → TB2 → TB2b → TB3 → TB7), Fill Desktop (A1 → A2 → A3 → A3b → A5 → A5b → A6 → D3 → D4), Fill Mobile (M1 → M8), Mark OK Explorations (Now, 1a–1d, 2a–2c), Inspection Report PDF (R1, 2 pages). Their anchor links (41 in ShopCoach, 62 in All Screens, 6 in Conditional Follow-up, 4 in Mark OK Explorations) were all clicked by the one-click sweep and landed on existing targets.

## Drags

No file of the package defines a drag (no `draggable`, no drag handlers; the builder's grip icons have no handler). Drags tried: 0, because the design defines none — this is a finding about the design, not a gap in the drive.

## Flows not finished

None. Prototype limits recorded as design notes, not gaps: the Work Order Handoff prototype shows the lines of "A new work order" on the S-81 screen; its Parts/Timesheets/Finance tabs are placeholders; the Template Builder disables Text/Measurement/Photo/Instructions; the Fill prototype has no unit change, no photo upload and no clear-axle action.
