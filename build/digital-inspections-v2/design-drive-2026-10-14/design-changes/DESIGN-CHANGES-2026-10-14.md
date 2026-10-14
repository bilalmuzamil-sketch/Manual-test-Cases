# DVI V2 design — what changed between the 22 Sep and the 14 Oct 2026 packages

Method: md5 per file (`ALL-FILES-md5.txt` vs `OLD-2026-09-22-ALL-FILES-md5.txt`), then a visible-text diff per screen
label for every changed board (`*.diff.txt` in this folder, `scripts/textdiff.py`), then a full reading of every new
and changed board. 184 files now (158 before): 26 new, 21 changed, 137 unchanged. The Markdown documents (PRD,
build spec, user stories, FOLLOWUP-handoff, CLAUDE-CODE-HANDOFF, README) changed too and are reported by the document
worker.

## New files

| New | What it is |
|---|---|
| Prototype - Hub | Start page linking three clickable prototypes and the two static boards |
| Prototype - Fill Inspection | Clickable fill screen (desktop and phone): per-tire verdicts on 3 axles, Mark section OK / Mark axle OK with Undo, checkbox follow-ups with Acknowledge, outstanding list, submit end screen |
| Prototype - Template Builder | Clickable builder (desktop and phone): checkbox and per-axle fields live, follow-up blocks, validation, rows editor, Preview, Publish |
| Prototype - Work Order Handoff | Clickable completed inspection → Build lines → destination menu → drafting → review → Add Lines; work order Notes; asset Inspections tab; ShopCoach on/off switch |
| Inspection Report PDF (+ handoff copy) | The customer report drawn as a letter-size document (R1) |
| Mark OK Explorations | Design options for the Mark OK control (Now, 1a–1d, round 2 2a–2c). Options, not a decision |
| Digital Inspections - Marketing Slides (+ print copy) | Six promotional slides |
| design_handoff_dvi_v2/Conditional Follow-up V2, FOLLOWUP-handoff.md | Handoff copies |
| uploads: 6 screenshots of 29 Sep, 1 PDF, 3 "draw" images | Slack feedback on the report (VIN → VIN/Serial; full company info; "the" technician; "asset" not "truck"), a staging report PDF and crops of it, and three annotated captures of 22 Sep boards with comment pins |
| scraps/p1-bottom.jpg, p1-check.jpg | Crops of the phone completed-inspection screen |
| assets/logo-primary-light.svg, logo-white.svg, symbol-primary.svg | Logos used by the PDF and slides |

## Changed screens, in plain words

**Inspection → work order (ShopCoach Line Builder V2; All Screens section 4)**
- New states: B3 completed inspection after lines were added (footer shows "WO created S-235" instead of Build lines); B4 work order deleted (only View PDF); B4b work order deleted but lines went to a new one ("WO created S-200"); B2b destination menu when the work order cannot take lines (Complete, Invoiced, Paid, Declined, or an invoice exists) — only "A new work order"; C3 "ShopCoach could not draft lines" with Close / Try again; C4 "No lines to propose"; E2 note after lines were added ("Lines added S-58"); E3 note on the new work order when the original was deleted ("Lines built from inspection 1234 · v2 · from work order S-100", tag "Work order deleted"); P1b phone after lines were added; P2b phone sheet with only "A new work order".
- New button "Reopen" in the completed-inspection footer (B, B3, P1, P1b).
- Findings now name the row and every flagged position with its reading: "Brake & tire measurements · Axle 1 · Tire pressure: left outer 42 psi, right outer 40 psi" (was one line per position, values in 32nds).
- Drafted lines changed (C2/P3): "Replace axle 1 left outer tire", "Inflate axle 1 outer tires to spec", "Adjust slack adjuster"; totals now "2.5 hrs labor · 3 parts" (dropped "· nothing on the work order yet"); edit hint now "Click any title, description, labor or part to edit it."
- Asset Inspections tab (F): now sorted most recently completed first (was "what still needs doing first"); 18 inspections, more states in the action column.
- The "What was entered" section review under the card now shows the per-axle grid (each position with its value and verdict, "Axle 1 Drum · Dual"), plus the checkbox and measurement fields, on desktop and phone.

**Filling an inspection, desktop (Inspection Fill V2 - Desktop; section 2)**
- New state A3b: a brake position Not OK ("1 position Not OK").
- Field header chip now counts positions: "2 positions Not OK · 1 Monitor" (was "2 tires Not OK").
- Units lowercase "psi"; tread depth in inches ("in.") instead of 32nds.
- Photo upload accepts HEIC: "JPG, PNG or HEIC".
- Collapse section control added.

**Filling an inspection, phone (Inspection Fill V2 - Mobile; section 3)**
- Last-section action renamed "Submit & Generate Report" (was "Review & Sign"); list title "5 items before submitting" (was "before signing").
- Whole-inspection Mark all OK caption reworded: "34 items are still Not inspected. Only those are marked OK; verdicts already picked stay, and values are never filled in."
- Back button kept on the last section; "Collapse section" added; mixed chip "2 positions Not OK · 1 Monitor" and "Axle: Not OK".

**Template builder (Inspection Template Builder V2 - Desktop; section 1)**
- New state TB2b: Push-rod travel removed, "+ Add Measurement Row" menu offers it back.
- Reference file accepted types now "PDF, JPG, PNG, HEIC, Word or Excel" with no size limit stated (was "PDF, JPG or PNG · up to 10 MB").
- TB1 no longer shows "+ Add Section".
- TB7 Preview reworded: only + Add Axle and delete axle are live (Axle 1 never has delete); Drum/Disc and Single/Dual shown but fixed; no values, verdicts, Add Note, Add Photo or Mark OK; a reference file is shown and does not open; the Save & Exit / Submit bar is gone.
- Intro now says Monitor and Not OK responses "can each carry a follow-up" (the Conditional Follow-up board and the prototype allow a follow-up on every response — an internal inconsistency in the design notes).

**Conditional follow-up (Conditional Follow-up V2; section 5)**
- Acknowledgement now offered on Monitor and Not OK only, on by default; OK and N/A have no acknowledgement toggle (was: toggle on all four, off on OK and N/A). Tooltip and caption updated ("NOT OFFERED ON OK AND N/A").
- New state CI1e: a follow-up that is only a file (canvas line shows the file name).
- New CI3 state 7: Not OK with a file-only follow-up.
- "Complete Inspection" renamed "Submit & Generate Report"; the "View Instruction" button is gone — the file name is the link.
- CI7 Preview: the file is shown and is not a link (was "the file still opens").

**Customer report PDF (new section 6, R1)**
- Report drawn in full: title "Inspection results", no template version, no intro paragraph or tile blurbs, no advisor row, no per-section counts, "WORK ORDER NO. S1-10482" without "#", date without time, CUSTOMER block with company address and phone plus a separate CONTACT row, asset panel (ASSET, UNIT, VIN/SERIAL, PLATE, MILEAGE, HOURS); per-axle blocks per axle with "OUTER + INNER" and "1 PER SIDE" tables; follow-up instruction printed with "Acknowledged by … · date time"; no file link.

**Unchanged:** support.js, doc-page.js, the design-system library and fonts, and all 84 older uploads.
