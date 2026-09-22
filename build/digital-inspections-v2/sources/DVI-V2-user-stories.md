# Digital Inspections V2 — user stories

SV-8181 · design hand-off

Every behaviour agreed across the redesign, written as stories so it can be checked line by line against an implementation. Four areas: the template builder, the fill experience on desktop, the fill experience on phones, and the inspection-to-work-order hand-off. Where a story replaces something that exists today, the old behaviour is named so it can be removed rather than left alongside.

**Two rules the whole release rests on.** Nothing is required, so nothing is auto-filled — the neutral state is **Not inspected** and it stays that way until a technician says otherwise (a bulk OK is the technician saying otherwise, in one press — FD-07). And a verdict belongs to the smallest thing it describes: a single tire position, not a row, not an axle. Every roll-up above that is derived and never stored.

---

## 1 · Template builder

### TB-01 · Per-axle field type
As a shop manager building a template, I can add a per-axle field so one field covers every axle on the unit instead of my duplicating rows per wheel position.

*Accepts:* the field type appears in the add-field list; adding it creates a measurement-row table; the technician sets the axle count while filling, not me.

### TB-02 · Measurement rows
As a shop manager, I can add, rename, reorder and delete the measurement rows inside a per-axle field.

*Accepts:* rows drag to reorder; renaming happens inline on the row, with a check to keep it and an X to discard; no modal opens for a rename.

### TB-03 · Unit per row
As a shop manager, I can set the unit for each measurement row so tire pressure reads in psi and tread depth in 32nds.

*Accepts:* a unit selector on each row; the row name never carries the unit in brackets; a light-grey *Defaults* line sits between the row name and its options, at the same size as the helper text, so it costs one line of height.

### TB-04 · Per-tire or per-brake scope
As a shop manager, I can say whether a row is measured per tire or once per side, so a dual axle asks for four tire pressures but only two brake-lining readings.

*Accepts:* a two-value scope control on each row; per-tire rows follow the technician's Single/Dual choice; per-side rows always show one value per side regardless.

### TB-05 · Reference file
As a shop manager, I can attach a reference file to any field so the technician has the procedure in front of them whatever they answer.

*Accepts:* the file is always available on the field, not conditional on the answer; accepted types and the size limit are stated before the upload, not after it fails; removing is an X and then attaching again — there is no Replace button.

### TB-06 · Validation rules
As a shop manager, I can require an answer, a photo, a photo only when Not OK, and a note when Monitor or Not OK.

*Accepts:* four independent toggles; only the note rule arrives on for a new template — photo-required-if-Not-OK is off from 2026-09-03 — and existing templates keep whatever they have; a summary line under the toggles states in plain words what the technician will be held to.

### TB-11 · Preview mode
As a shop manager building a template, I can see what the technician will get without publishing it and starting an inspection myself.

*Accepts:* an `Edit` / `Preview` control in the builder sub-header; in Preview the properties panel steps aside and the canvas takes its width, with the sections rail kept; a banner states that nothing is saved and names the axle count the template starts a technician on; the canvas renders the real fill screen from the current draft, unsaved edits included, read-only except the axle control — `+ Add Axle` and the per-axle delete both work and the count writes back to the draft, so Edit shows the new number on the `Axles` control — while values, verdicts, Add Note and Add Photo are inert and a reference file still opens; the three Mark OK actions are not drawn at all; no banner, no submit bar and no per-field edit pill; the phone renders the same preview at phone width, with no device switcher; clicking a field returns to Edit with that field selected, and hovering it shows `Edit this field`; preview never requires publishing and never writes an answer.

### TB-08 · Axles, and what the field covers
As a shop manager building a per-axle field, I can set how many axles a unit usually has, and I can tell that one field covers the whole unit.

*Accepts:* an `AXLES` field directly above `+ Add Measurement Row`, defaulting to 3, with an `ⓘ` tooltip saying the technician starts with that many and can add or remove axles while filling in; the rows section is labelled `MEASUREMENT ROWS · EVERY AXLE`; the type card in the palette carries an `ⓘ` tooltip saying one field covers the whole unit; no preview dialog.

### TB-09 · The word "set" is gone
As a shop manager, I am not misled into creating one field per axle.

*Accepts:* the field type reads `Per axle`; a new field is labelled `New axle measurements`; no screen, label or hint uses "axle set".

### TB-10 · Times used
As a shop manager reading the template list, I can tell how often a template has been used.

*Accepts:* `Times used (30 days)` on the KPI card, `Times used` as the column header, `Used/30d` on the phone chip, `3 times used` as the phone card suffix, `Used 4,218 times · v2` in the action sheet (singularising to `Used 1 time · v2`), and the archived banner reading "Inspections already completed from this template stay counted in reports."

### TB-07 · Starter library
As a shop manager creating a template, I can start from one of the templates the shop already runs instead of an empty canvas.

*Accepts:* six starter slots offered — Class 8 Tractor PM Inspection, DOT Annual Federal Inspection, Air Brake Inspection, Trailer Inspection and Light Duty PM carry content, and only an unnamed equipment starter shows as pending; seeded templates use one per-axle field where the same thing is measured on every wheel position; a card is an icon and a name with no second line; a picked starter is an ordinary editable template; no marketplace and no search. *Open:* how starters reach an organisation — no seeding mechanism exists.

> **REPLACES — remove from the product**
>
> **Conditional follow-up.** A branch per response meant the author wrote four instructions and the technician met one. It is gone: the reference file covers the content need, and validation covers the obligation. Also gone: the follow-up editor, nested follow-up rows in the field list, and acknowledgement toggles.

---

## 2 · Filling an inspection — desktop

### FD-01 · Verdict per position
As a technician, I can judge each tire position separately, so left outer can be Not OK while left inner is OK.

*Accepts:* a dropdown attached to the input it judges, offering OK, Monitor, Not OK and N/A; the value and its verdict read as one control; the position is named in the dropdown so there is never a question which one is being set.

### FD-02 · Not inspected is the start
As a technician, I see every position start as Not inspected and stay that way until I judge it.

*Accepts:* Not inspected is not offered in the dropdown — it is where a position begins, not a choice; nothing is ever auto-filled to N/A; empty stays empty.

### FD-03 · Single and Dual
As a technician, I can switch an axle between Single and Dual at any time without being interrogated about it.

*Accepts:* no confirmation dialog; switching to Single shows one value per side; switching back to Dual restores what was typed, for the session; submitting on Single stamps Single.

### FD-04 · Top view
As a technician, I can see at a glance which wheel on the unit has the problem.

*Accepts:* a tire takes the worst verdict entered for it so far — Not OK beats Monitor beats OK; a tire with no verdict yet is grey; partly-entered is marked distinctly from complete; clicking a tire jumps to its value.

### FD-05 · Reference file on the field
As a technician, I can open the attached procedure without it competing with the answer I am giving.

*Accepts:* the file chip sits above the response row, never beside it; opening it gives a full-page modal where the document has the whole window; PDF and image types render in it; HEIC, TIFF, Word and Excel — which no browser renders — open an honest **This file can only be downloaded** state with a download action instead of a blank page, and never block submit.

### FD-06 · Note and photo
As a technician, I can add a note and a photo to any field, and I am told plainly when they are required.

*Accepts:* note on the left, photo on the right, side by side; the photo side is a drag-and-drop target; each block carries its own Required badge when it applies; the note has a confirm and a cancel; photos are JPG or PNG — no video.

### FD-08 · Note and photo sit together
As a technician, I find Add Photo and Add Note in one place.

*Accepts:* both in the field card footer, never one in the header; the photo block still opens on its own when a Not OK verdict makes a photo required.

### FD-07 · Mark OK in bulk
As a technician whose unit is mostly fine, I can mark everything OK in one action and then change only the positions that are not.

*Accepts:* three levels, each a single click and each named for what it covers — `Mark all OK` on the inspection row, `Mark section OK` on the section row, `Mark field OK` on every field's own card header, whatever its type (a text field has no verdict and carries none); they share one treatment and one right edge, so the level is read from the row and nothing sits in the app chrome; it sets OK and nothing else, with no bulk Monitor and no bulk Not OK; it writes verdicts only and never a measured value; a verdict I already picked is never overwritten; hovering an action tells me exactly what it will change and what it will leave alone, with counts; the row I pressed swaps its action for a check and a count in its own unit — fields on a section or the inspection, positions on a field — and offers Undo until my next edit; every level beneath it shows the same check with its own count, so I can see before and after without opening anything; correcting a position afterwards is the same gesture as any other.

*Open:* what happens to a position with no value entered is not decided — build spec §8, question 1.

> **REPLACES — remove from the product**
>
> The four-pill verdict row per measurement. The STATUS column and the ROW column. The axle roll-up badge and the *X of Y positions* counters. The status badge in a card's top-right corner, which only repeated the answer at a smaller size. Row background tints and red card outlines — colour belongs on the value that earned it and on the control being pressed.

---

## 3 · Filling an inspection — phone

### FM-01 · No horizontal scroll
As a technician on a phone, I can fill an per-axle field without scrolling sideways.

*Accepts:* the grid is abandoned below tablet; one axle at a time; values in a two-by-two grid; each position labelled in full — left outer, left inner, right inner, right outer.

### FM-02 · Tap targets
As a technician wearing gloves, I can hit the control I meant to hit.

*Accepts:* position labels at 11 px semibold; value rows 52 px tall; every interactive target at least 44 px; the verdict dropdown opens a sheet titled with the position, the measurement and the value entered.

### FM-03 · Section navigation
As a technician, I always know where the footer will take me.

*Accepts:* the footer is section navigation and nothing else, naming its destination — Back: Section 1, Next: Section 2; it never shows a greyed-out square; axle switching happens only in the sub-header chips, which swap the page to that axle rather than scrolling to it.

### FM-04 · What is outstanding
As a technician, I can see how much is left before I can sign, and get to it in one tap.

*Accepts:* the count rides on the footer action as a badge rather than occupying its own bar; tapping it lists the outstanding items; tapping an item goes straight to the first unfilled required field, never back to a summary.

### FM-05 · Required evidence
As a technician marking something Not OK, I can tell which note and photo are obligatory.

*Accepts:* the Add note and Add photo labels turn red on a row holding any Not OK position; the container stays neutral; there is no placeholder square beside the button — the action spans the row.

### FM-06 · Mark OK in bulk on the phone
As a technician on a phone, I get the same bulk OK without hunting for it.

*Accepts:* the same three levels, one per surface — a full-width 44px row at the foot of the section header, the field header of the axle-set screen, and the app-bar menu for the whole inspection; the same rule as desktop — OK only, verdicts only, no overwriting a verdict already picked; the footer stays section navigation and gains nothing.

> **REPLACES — remove from the product**
>
> The bottom back button — Android draws one and it costs a row of screen. The coloured dot beside a verdict, since the field is already coloured. The dot beside an axle chip. The bottom axle navigation strip, duplicating the sub-header. The requirement bar above the footer.
>
> Set all positions is **not** on this list any more — see FM-06.

---

## 4 · Inspection to work order

> **Entitlement rule.** Building work order lines from an inspection is a ShopCoach capability. An organisation without ShopCoach does not get it — an inspection then only reports what is wrong and a human builds the work order.

### HO-01 · Without ShopCoach
As a technician in a shop without ShopCoach, I finish an inspection and go to the work order to add lines myself.

*Accepts:* the completed inspection keeps its summary, its findings and its counts; exactly two actions — View PDF and Go to work order; there is no build action at all, not disabled and not behind a tooltip.

### HO-02 · With ShopCoach
As a technician in a shop with ShopCoach, I can turn the findings into work order lines and see that it is the AI producing them before I press it.

*Accepts:* the same screen plus a purple, AI-badged *Build lines* action — the colour and the badge carry the meaning, so the label does not name the product; it offers two targets, this work order or a new one; View PDF and Go to work order remain.

### HO-03 · No prompt
As a technician, pressing the build action never asks me to write anything.

*Accepts:* no prompt, no query box, no configuration step anywhere in the flow; the run starts when the destination is chosen, so the navigation and the drafting happen together.

### HO-04 · The wait
As a technician who pressed one button, I can see what is happening while the lines are drafted.

*Accepts:* I am already on the work order, on the Lines tab; the panel shows one skeleton row per finding, since the count is known before the drafting is; the work order stays usable; Cancel leaves it untouched.

### HO-05 · Reviewing, not instructing
As a technician, I land on finished work I can correct rather than a form I have to fill.

*Accepts:* lines proposed and pre-selected; every title, description, labor figure and part editable in place; each line names the finding it came from; nothing reaches the work order until Add Lines is pressed.

### HO-07 · The summary card
As a service advisor opening a completed inspection, I can see what happened without reading every answer.

*Accepts:* the screen leads with the card — completion line, a count per verdict, and a findings list naming each flagged position as field · axle · row · position with the reading that earned it; a verdict with no findings under it is **not** counted, so an inspection with nothing on Monitor draws no Monitor count; with ShopCoach the footer offers View PDF, Go to work order and Build lines with one line above it naming the product once, and without ShopCoach two actions and a plain line saying the findings are on the customer report and in the work order note feed and that the lines are added on the work order; the section-by-section review of what was entered stays below the card; the service advisor, the start time and per-section progress are not carried onto the screen.

### HO-08 · The build flow on a phone
As a technician who has just finished an inspection on my phone, I can act on the findings without moving to a desktop.

*Accepts:* the same summary card and section review at phone width, with the footer actions stacked full-width and Build lines first; the target choice arrives as a bottom sheet with 56px rows; the drafted lines are reviewed, edited, deselected and added on the phone, with a running total above Add Lines; no horizontal scroll at 390px and no target under 44px; the unlicensed variant carries two actions and the plain line.

### HO-06 · Started from the work order
As a service advisor with no inspection to hand, I can start the Line Builder from the work order itself.

*Accepts:* the same panel, the same treatment, the same review-before-adding footer; lines are drafted from the unit's history and the lines already on the work order; the proposed-lines table is unchanged from the inspection-started flow.

---

## 5 · Roll-up and language

| Level | Where it comes from | Stored? |
| --- | --- | --- |
| Tire position | The technician's own choice | Yes — the only verdict of record |
| Measurement row | Worst of its positions | No — derived |
| Axle | Worst of its rows | No — derived |
| Field | Worst of its axles | No — derived |
| Top-view tire | Worst verdict entered for that tire so far; grey when none | No — derived |

**Language.** *Not inspected* everywhere — never "not judged". Verdicts are *OK*, *Monitor*, *Not OK*, *N/A*. Positions are *left outer*, *left inner*, *right inner*, *right outer* — outer to inner, left to right, matching the top view. The AI is *ShopCoach*, named once at the destination step and otherwise carried by the purple and the badge.
