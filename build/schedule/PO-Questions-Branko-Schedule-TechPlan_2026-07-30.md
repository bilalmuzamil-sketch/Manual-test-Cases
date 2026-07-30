# Schedule — Questions for Branko (from the engineering plan) — 2026-07-30

Plain-language product questions only (no bugs, no test jargon). These came up because the engineering build plan describes a few things differently from the product write-up and the design pictures — plus two questions we asked on July 27 that are still open and now matter more.
Please pick an option (or write your own answer) for each.

## Question 1 — Shop closure days: does a multi-day job skip them?

**What happens now:** When a big job is spread across several days, the schedule plans one shift per day. Earlier we were told that shop closure days (holidays, inventory days) do NOT get skipped in the first release - a shift can land on a closure day. The engineering build plan says the opposite: the system will really skip closure days, and the preview will show them as skipped.

**The question:** In the first release, when a job is spread across days that include a shop closure day, should that day be skipped (no work planned on it), or can a shift land on it?

**Options:**

- A) Skip closure days - no shift is planned on a closure day (as the build plan says).
- B) Do not skip them - a shift can land on a closure day in the first release (as we were told earlier).
- C) Something else (please explain).

**Your answer:** ____________________

## Question 2 — Does the conflict counter include double-bookings?

**What happens now:** The schedule flags problems like a shift outside a technician's working hours, and a counter at the top shows how many problems there are. The product write-up also counts a technician being booked on two jobs at the same time ("double-booked") as one of these problems. The engineering plan treats double-booking as a milder heads-up only - shown on the screen, but not counted as a real "conflict" in that counter.

**The question:** When a technician is booked on two jobs at the same time, should that show up in the conflicts counter and list at the top, or only as a milder warning on the shift itself?

**Options:**

- A) Yes - double-bookings count in the conflicts counter and list.
- B) No - double-bookings are only a milder warning on the shift, not in the counter.
- C) Something else (please explain).

**Your answer:** ____________________

## Question 3 — Where do the shop's working hours and closure days live?

**What happens now:** The design pictures we had put the shop's working hours inside the "Edit Location" window (a toggle called "Set business hours for this shop"). The engineering plan instead builds a separate "Schedule Settings" page in the Administration area, which holds the shop's working hours AND its closure days, with a link to it from the schedule's view options.

**The question:** Where should someone go to set the shop's working hours and closure days?

**Options:**

- A) A separate "Schedule Settings" page in Administration (as the build plan says).
- B) Inside the Edit Location window (as the design pictures showed).
- C) Something else (please explain).

**Your answer:** ____________________

## Question 4 — Can a technician have a split working day (two time ranges)?

**What happens now:** The design pictures show an "Add hours" button so a technician's day can have two working ranges (for example 8-12 and 13-17 - a split shift), with a check that the ranges don't overlap. The engineering plan only stores ONE working range per day for each technician - no second range at all.

**The question:** In the first release, can a technician's working day have two separate time ranges (a split shift), or just one range per day?

**Options:**

- A) Just one range per day (as the build plan says) - the "Add hours" idea is for later.
- B) Two (or more) ranges per day, with the overlap check (as the pictures show).
- C) Something else (please explain).

**Your answer:** ____________________

## Question 5 — May a technician change other technicians' shifts?

**What happens now:** Everyone who can see the schedule sees ALL technicians' shifts. For making changes, the engineering plan adds a restriction for certain technician-type users: if their account is set to "own data only", they can create and change ONLY their own shifts - trying to change someone else's is refused. The product write-up does not mention this restriction.

**The question:** Should a technician-type user (with the "own data only" setting) be able to change only their OWN shifts, while seeing everyone's?

**Options:**

- A) Yes - such users can change only their own shifts (as the build plan says). We will then add a test for it.
- B) No - anyone who can edit the schedule can change anyone's shifts.
- C) Something else (please explain).

**Your answer:** ____________________

## Question 6 — Do calendar events use up a technician's time? (asked July 27 - still open, and the newest answer reverses your earlier one)

**What happens now:** We asked this on July 27 and it is still open - and it now needs your confirmation more than before. Earlier you told us events (like meetings) do NOT use up a technician's available time, but you would check. Since then, a comment answer on the requirements page (dated July 23) says the opposite - event hours DO count. The engineering build plan follows that comment: a 2-hour meeting counts as 2 hours less free time for the day (though it never raises a warning by itself). Because this reverses your earlier answer, we need you to confirm it. Also good to know: many old events already in the system would start counting on day one, so technicians may suddenly look busier - that would be expected, not a fault.

**The question:** When a technician has an event (like a 2-hour meeting), should those hours count against how busy that technician looks on the day, or not?

**Options:**

- A) Yes - event hours count toward how busy the technician is (the newer comment's answer, and what engineering is building).
- B) No - events do not count (your earlier answer).
- C) Something else (please explain).

**Your answer:** ____________________

## Question 7 — Should the shift pop-up have a 'Reassign' button? (asked July 27 - still open)

**What happens now:** We asked this on July 27 and it is still open. When you open a scheduled shift, a small pop-up shows its details. The written story still says this pop-up should have a 'Reassign' button to move the shift to a different technician. The newest design pictures removed that button, and the engineering plan is building it WITHOUT the button - moving a shift is done only by dragging it onto another technician.

**The question:** For the first release, should the shift pop-up include a 'Reassign' button, or is dragging the shift the only way to move it to another technician?

**Options:**

- A) Keep the 'Reassign' button in the pop-up (plus dragging) - the written story's way.
- B) No button - moving a shift is done only by dragging it (as the newest pictures show and engineering is building).

**Your answer:** ____________________

---

## QA Internal Mapping (QA-only — not for the PO)

TestRail C-ids are from the project's `testrail-id-map.csv` (Standing Rule 8). Links: https://shopview.testrail.io/index.php?/cases/view/<id>

| Q# | Affected internal case IDs (TestRail C-id) | Source refs | What each answer resolves to |
|---|---|---|---|
| 1 | SCH-EDGE-05 (C30089); SCH-SPREAD-07 (C29983); SCH-SPREAD-08 (C29984); new SCH-SPREAD-11 + SCH-API-02 previews (no C-id yet) | Source: tech-plan-2026-07-29/Questions-for-Branko-dev.md NQ-1. Tech plan D7 ('skips closures + non-working days (real skipping)') + Phase 7 SpreadDialog E2E 'created series has no shift on the closure day' vs Jira SV-8691 delta D2 (2026-07-27): 'shop closures NOT skipped in V1'. Last-update-wins is ambiguous (plan dated 2026-07-22, handed 2026-07-29). | A -> rewrite SCH-EDGE-05 (closure = skipped + struck through in preview) + SCH-SPREAD-07 expected #3 + SCH-SPREAD-08 reason list. B -> cases stand. Verify LIVE either way. |
| 2 | SCH-CONF-01 (C30023); SCH-CONF-05 (C30027) | Source: NQ-2. Tech plan D4: double-booking = FE soft warning, 'not a hard conflict per the locked definition'; BE detector = outside-window/closure/non-working only. vs SV-8697 §4.11 'Double-booked' conflict type + our pill-count expectations. | A -> cases stand. B -> rewrite SCH-CONF-01 expected #3/#4 (icon yes, pill no) and adjust SCH-CONF-05's count basis. |
| 3 | SCH-HRS-01 (C38846); SCH-HRS-02 (C38847) | Source: NQ-3. Tech plan Phase 2 (ScheduleSettings.vue in Administration + closures CRUD + View-Options link) vs design/SV-8699 Edit-Location toggle. Plan itself says the design's Hours Settings file was an empty SHELL. | A -> re-home SCH-HRS-01/02 to the Schedule Settings page + author a closures-CRUD case. B -> cases stand; closures UI location TBD. |
| 4 | SCH-HRS-05 (C38850); SCH-HRS-06 (C38851); SCH-HRS-07 (C38852) | Source: NQ-4. Tech plan §3 staff_working_hours = one start_minute/end_minute per weekday, unique (staff, workplace, day) - no split ranges. vs SV-8699 verbatim 'Add hours appends more to support split shifts'. | A -> retire/park SCH-HRS-05..07 (pending authorization). B -> cases stand and the build plan's model must change. |
| 5 | SCH-PERM-09 (C30082) context; a new negative case would be authored only on answer A | Source: NQ-5. Tech plan NFR-003/§4: ManageShiftVoter own-data scoping for isRestrictedToOwnData() users; error 'cross-tech own-data violation -> 403'. Spec §14 is silent on WRITE scoping (SCH-PERM-09 covers VIEW only - no contradiction, but unconfirmed). | A -> author the own-data write-negative (UI + API halves). B -> no case; confirm no 403 surprises at VIU. |
| 6 | SCH-EVT-08 (C30615); SCH-CAP-01..04 (C30030-C30033); SCH-CONF-01 (C30023) | HELD item D1 (re-ask of PO-Questions-Branko-Schedule-2026-07-27 Q1). RECONCILIATION Delta D1 + tech plan D5: plan BUILDS 'events count toward capacity, but are NOT conflict-checked', citing a PRD Confluence Q&A comment answer of 2026-07-23 that REVERSES Branko's earlier 'No'. Engineering defaults pending product confirm: department-assigned events do NOT count; unbounded all-day events are visual-only. ~9,684 migrated legacy events would raise capacity bars at cutover (expected, not a bug). | A -> rewrite SCH-EVT-08 to 'counts toward capacity but not conflict-checked'; flip the events-excluded note on SCH-CAP-01..04; firm up SCH-CONF-01. B -> keep cases as-is (events excluded from capacity). Verify LIVE at VIU either way (Rule 12). |
| 7 | SCH-MODAL-08 (C30015); SCH-REAS-01 (C30052); SCH-REAS-02 (retired/deleted 2026-07-22, no C-id) | HELD item D4 (re-ask of PO-Questions-Branko-Schedule-2026-07-27 Q2). RECONCILIATION Delta D4: Jira story SV-8695 lists a modal Reassign action; the design prototype removed it (SCH-REAS-02 retired on the design's authority, Branko Q0); tech plan BUILDS drag-only ('no modal reassign action', 'PRD wins over prototype drift') = supports B. | A (story wins) -> re-add a modal-Reassign case (SCH-MODAL-08 back to Delete+Reassign) and un-retire SCH-REAS-02; the plan must change. B (design/plan wins) -> keep cases as-is and the story text should be corrected. Do not change cases until Branko rules. |

### Not re-asked here (for QA reference)

- The other five July-27 questions (Week Export; the New-Work-Order shortcut; the default working day; the hover-note vehicle number; behind-the-scenes testing) are NOT re-asked — they still await Branko's answer in `PO-Questions-Branko-Schedule-2026-07-27.md/.xlsx`. The tech plan INFORMS them (Q3: no export in the plan; Q4: plan builds the New Work Order shortcut opening the real WO window; Q5: plan default = 7 in the morning to 7 in the evening; Q7: the tech plan IS the backend written description — SCH-API-01..04 staged locally, no C-ids yet) but does not settle them — see the QA-internal appendix of the 2026-07-27 sheet.

Verify the C-ids against `build/schedule/testrail-id-map.csv` before quoting them onward.
