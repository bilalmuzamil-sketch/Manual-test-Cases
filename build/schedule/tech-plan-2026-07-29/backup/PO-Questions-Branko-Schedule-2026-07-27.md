# Schedule — Questions for Branko — 2026-07-27

Plain-language product questions only (no bugs, no test jargon).
Please pick an option (or write your own answer) for each.

## Question 1 — Do calendar events use up a technician's time?

**What happens now:** The schedule shows a small bar for each day that fills up as a technician gets busier. It also lets you put meetings and other events on a technician. Earlier you told us events do NOT use up a technician's available time, but you would check. The newest design pictures and the written plan now both say events DO use up the technician's time (a 2-hour meeting counts as 2 hours less free time).

**The question:** When a technician has an event (like a 2-hour meeting), should those hours count against how busy that technician looks on the day, or not?

**Options:**

- A) Yes - event hours count toward how busy the technician is.
- B) No - events do not count toward how busy the technician is.
- C) Something else (please explain).

**Your answer:** ____________________

## Question 2 — Should the shift pop-up have a 'Reassign' button?

**What happens now:** When you open a scheduled shift, a small pop-up shows its details. The written plan says this pop-up should have a 'Reassign' button to move the shift to a different technician. The newest design pictures removed that button - instead you move a shift by dragging it onto another technician.

**The question:** For the first release, should the shift pop-up include a 'Reassign' button, or is dragging the shift the only way to move it to another technician?

**Options:**

- A) Keep the 'Reassign' button in the pop-up (plus dragging).
- B) No button - moving a shift is done only by dragging it (as the newest pictures show).

**Your answer:** ____________________

## Question 3 — Is there a printable 'week' view in the first release?

**What happens now:** The newest design pictures include a clean, printable page that lays out a whole week for each technician (a 'Week Export' / print view). The written plan does not mention this at all, so we are not sure it is part of the first release.

**The question:** Is the printable weekly view part of the first release (so we should test it), or is it for later?

**Options:**

- A) Yes - it is in the first release, please test it.
- B) No - it is for later, do not test it now.
- C) Something else (please explain).

**Your answer:** ____________________

## Question 4 — The right-click shortcut to start a new work order

**What happens now:** The newest design pictures show that when you click an empty spot on the schedule, a little menu pops up. That menu offers 'Create event' and 'New work order'. The written plan mainly describes adding shifts and events this way, and uses slightly different wording, so we are not sure the 'New work order' shortcut is part of the first release or exactly what the menu should say.

**The question:** For the first release, should clicking an empty spot on the schedule offer a 'New work order' shortcut, and what exactly should the menu items say?

**Options:**

- A) Yes - include 'New work order' in the menu (please confirm the exact wording of the menu items).
- B) No - the 'New work order' shortcut is for later; the menu is only for adding an event/shift.
- C) Something else (please explain).

**Your answer:** ____________________

## Question 5 — What is a normal working day - the default hours

**What happens now:** If a shop or a technician has not set their own working hours, the schedule falls back to a default working day. The design pictures use 8 in the morning to 5 in the evening. The written plan says 7 in the morning to 7 in the evening. These two do not match.

**The question:** When no custom hours are set, what should the default working day be?

**Options:**

- A) 8 in the morning to 5 in the evening (as the pictures show).
- B) 7 in the morning to 7 in the evening (as the written plan says).
- C) Something else (please tell us the hours).

**Your answer:** ____________________

## Question 6 — The vehicle-number (VIN) note that appears when you hover

**What happens now:** When you hover over a shift, a small note appears with details about the job, including the vehicle's number (its VIN). Two parts of the written plan disagree: one part says the vehicle number always shows in that hover note; the other part says it only shows when a 'show vehicle number' setting is turned on (and that setting is off to start).

**The question:** In the hover note, should the vehicle number ALWAYS be shown, or should it only appear when the 'show vehicle number' setting is turned on?

**Options:**

- A) Always show the vehicle number in the hover note.
- B) Only show it when the 'show vehicle number' setting is on.

**Your answer:** ____________________

## Question 7 — Do you want us to check the behind-the-scenes saving too?

**What happens now:** Everything we test is on the screen (what you see and click). The schedule also saves shifts and events into the system behind the scenes. We do not yet have a written description of those behind-the-scenes rules, so right now we would only test what is visible on the screen.

**The question:** Do you want us to also test the behind-the-scenes saving and rules (and can you share a written description of them), or is testing what is on the screen enough for the first release?

**Options:**

- A) Yes - also test behind the scenes; a written description exists or will be provided.
- B) No - testing what is on the screen is enough for now.

**Your answer:** ____________________

---

## QA Internal Mapping (QA-only — not for the PO)

Schedule cases are already in TestRail (`build/schedule/testrail-id-map.csv`, Standing Rule 8).

| Q# | Affected internal case IDs (C-id) | Source refs | Resolves to |
|---|---|---|---|
| 1 | SCH-EVT-08 (C30615), SCH-CAP-01 (C30030), SCH-CAP-02 (C30031), SCH-CAP-03 (C30032), SCH-CAP-04 (C30033), SCH-CONF-01 (C30023) | RECONCILIATION.md Delta D1 + DESIGN-RECONCILIATION §4 #1-6. Newest design '_capForDate' code now ADDS technician-assigned event hours to the capacity totals; the written plan (SV-8698/SV-8696) also says events count. But this REVERSES Branko's earlier 'currently No, will check' answer. SCH-EVT-08 currently says events do NOT count toward capacity = now half-wrong. Events still do NOT raise a conflict (that half is correct). | A -> rewrite SCH-EVT-08 (C30615) to 'counts toward capacity but not conflict-checked'; flip the events-excluded note on SCH-CAP-01..04; firm up SCH-CONF-01. B -> keep cases as-is (events excluded from capacity). Verify LIVE at VIU either way (Rule 12). |
| 2 | SCH-MODAL-08 (C30015), SCH-REAS-01 (C30052), SCH-REAS-02 (retired/deleted 2026-07-22, no C-id) | RECONCILIATION.md Delta D4 (design-vs-spec conflict). Written plan (SV-8695) lists a modal Reassign action; the design prototype removed it and we retired SCH-REAS-02 on the design's authority (Branko Q0). SCH-MODAL-08 now says 'Delete only, no Reassign'. Drag-reassign kept as SCH-REAS-01. | A (spec wins) -> re-add a modal-Reassign case (SCH-MODAL-08 back to Delete+Reassign) and un-retire SCH-REAS-02; ask that the plan text stand. B (design wins) -> keep cases as-is and the plan text should be corrected. Do not change cases until Branko rules. |
| 3 | (no case yet - new scope) | DESIGN-RECONCILIATION §5. 'Schedule Week Export' / printable week view is in the newest design ZIP but NOT in the written plan and has ZERO coverage in the 167 cases. | A -> author a new Week Export / Print case group (later, needs authorization + VIU). B -> out of scope for V1; no cases. |
| 4 | SCH-EVT-01 (C30016), SCH-REAS-03 (C30054), (possible new left-click case) | RECONCILIATION.md Delta/Gap D5/G2 + DESIGN-RECONCILIATION §4 #7-8 & §5. Design shows a left-click empty-cell menu {'Create event','New work order'}; our cases have a right-click menu {New Shift, New Event, View Day} and label 'New Event' (design says 'Create Event'). No case for the 'New work order' shortcut. Design-vs-spec wording conflict. | A -> add ~1 case for the left-click {Create event, New work order} menu, align labels, confirm click type. B -> New-work-order shortcut deferred; keep event/shift menu only. Verify labels LIVE (Rule 9/12). |
| 5 | SCH-START-03 (C29971), SCH-START-06 (C29974), SCH-CONF-03 (C30025), SCH-CONF-04 (C30026) | DESIGN-RECONCILIATION §3 #10 (discrepancy persists). Prototype hardcodes 8 AM-5 PM (start:8,end:17); written plan says 7 AM-7 PM. Our start-time + before/after-hours cases depend on the default working day. | A (8-5) -> adjust the default-hours cases to 8 AM-5 PM. B (7-7) -> keep the 7 AM start / adjust to 7 PM end. Confirm LIVE at VIU. |
| 6 | SCH-VIEW-04 (C30045), SCH-TIP-01 (C30034) | PROJECT-STATE OQ-6(a) + §4.13-vs-§9 VIN inconsistency. §4.13 lists the tooltip VIN unconditionally; §9 ties it to the 'VIN Number' toggle (default OFF). We resolved cases in favour of §4.13 (tooltip always shows VIN; the toggle gates the shift BLOCK only) - needs Branko confirmation. | A (always) -> matches how cases are currently written (SCH-TIP-01 tooltip always shows VIN; SCH-VIEW-04 toggle gates the block only). B (toggle-gated) -> rewrite SCH-TIP-01 to hide the tooltip VIN when the toggle is off. Verify LIVE at VIU. |
| 7 | (cross-cutting - all API/backend Schedule cases) | PROJECT-STATE OQ-6(b). No backend/API contract was provided; the suite is screen-behaviour only. Does Branko/dev want backend cases, and if so supply the contract? (Also folds OQ-5 spec-label ambiguities - resolved LIVE at VIU.) | A -> obtain the backend contract; author API cases (Rule 4 places them in 'API'-titled sections). B -> screen-only coverage stands for V1. |
