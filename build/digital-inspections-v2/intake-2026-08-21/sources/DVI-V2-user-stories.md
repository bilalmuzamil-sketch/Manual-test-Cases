# Digital Inspections V2 — user stories

SV-8181 · design hand-off

Every behaviour agreed across the redesign, written as stories so it can be checked line by line against an implementation. Four areas: the template builder, the fill experience on desktop, the fill experience on phones, and the inspection-to-work-order hand-off. Where a story replaces something that exists today, the old behaviour is named so it can be removed rather than left alongside.

**Two rules the whole release rests on.** Nothing is required, so nothing is auto-filled — the neutral state is **Not inspected** and it stays that way until a technician says otherwise. And a verdict belongs to the smallest thing it describes: a single tire position, not a row, not an axle. Every roll-up above that is derived and never stored.

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

*Accepts:* four independent toggles; the last two arrive on for new templates and existing templates keep whatever they have; a summary line under the toggles states in plain words what the technician will be held to.

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

*Accepts:* the file chip sits above the response row, never beside it; opening it gives a full-page modal where the document has the whole window; downloading is never the only way to read it.

### FD-06 · Note and photo
As a technician, I can add a note and a photo to any field, and I am told plainly when they are required.

*Accepts:* note on the left, photo on the right, side by side; the photo side is a drag-and-drop target; each block carries its own Required badge when it applies; the note has a confirm and a cancel; photos are JPG or PNG — no video.

> **REPLACES — remove from the product**
>
> The four-pill verdict row per measurement. The STATUS column and the ROW column. Set-all-positions and set-all-row shortcuts at every level. The axle roll-up badge and the *X of Y positions* counters. The status badge in a card's top-right corner, which only repeated the answer at a smaller size. Row background tints and red card outlines — colour belongs on the value that earned it and on the control being pressed.

---

## 3 · Filling an inspection — phone

### FM-01 · No horizontal scroll
As a technician on a phone, I can fill an axle set without scrolling sideways.

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

> **REPLACES — remove from the product**
>
> The bottom back button — Android draws one and it costs a row of screen. The coloured dot beside a verdict, since the field is already coloured. The dot beside an axle chip. The bottom axle navigation strip, duplicating the sub-header. The requirement bar above the footer. Set all positions.

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
