# Technician Toggle — questions for Chris Ward (DRAFT, not sent)

Project: **Technician Toggle** (epic SV-11788, PRD Confluence 977371146 version 17, 2 Nov 2026). For: Chris Ward (PO and design authority). Drafted 2 Nov 2026 by the case-library worker; the coordinator sends it as the colour-coded question sheet (Rule 125 format) once everything else is done (skill 07 §1). Nothing here has been sent.

## Question 1

- **Project / feature:** Technician Toggle — the Public API
- **What the PRD says now:** Story 1 Error Handling: "A request from elsewhere (for example an outside tool) that would switch Technician from off to on in either case is refused with "A technician must have Time Clock on." or "This role can't be a technician." respectively". Story 5 S5-N1: "The technician value cannot be set through the Public API. A staff update that includes it succeeds as today and ignores that value". An outside tool reaches ShopView through the Public API, so the two sentences give opposite answers for the same request.
- **The question:** if an outside tool sends a staff update that switches Technician on for someone whose Time Clock is off (or who is on the Office User or Time Clock User role), should the request be refused with the message, or accepted with the technician value ignored?
- (a) Accepted and ignored, as S5-N1 says; the two refusal messages show only for requests sent by ShopView's own screens (please say which)
- (b) Refused with the message, as Story 1 says; S5-N1 applies only when the value would not be refused
- (c) Something else (please say)
- **Your answer:** 

## Question 2

- **Project / feature:** Technician Toggle — Edit Staff Member
- **What the PRD says now:** S1-R8: "Saving a change to Technician never logs the staff member out. A save that also changes Time Clock logs them out, as a Time Clock change does today." Key Decisions: "Changing Technician never logs anyone out." The PRD names only Time Clock; today a role change on a staff record also logs the person out.
- **The question:** when one save changes Technician and also the role, is the staff member logged out (as a role change does today) or kept signed in?
- (a) Logged out, as a role change does today; only a save that changes nothing but Technician keeps them signed in
- (b) Kept signed in, because the save changes Technician
- (c) Something else (please say)
- **Your answer:** 

## Question 3

- **Project / feature:** Technician Toggle — Board View and Tech View
- **What the PRD says now:** S3-R10: the "No technicians yet" state shows "When Board View or Tech View has no technician column or group at all ... and neither Assigned to me nor a Technician filter is on". S3-R3: "The Technician filter on Work Orders offers the same people the board gives a column or group to", so at a location with no technicians the filter offers nobody to pick.
- **The question:** how can a Technician filter be on at a location that has no technicians? Does a filter picked at one location stay on when the user switches to a location with no technicians?
- (a) Yes: a filter picked at another location stays on, and then "No technicians yet" does not show
- (b) No: the filter is cleared when the location changes, so this cannot happen (the words are only a safeguard)
- (c) Something else (please say)
- **Your answer:** 

## Question 4

- **Project / feature:** Technician Toggle — the Technician filter on Work Orders
- **What the PRD says now:** S3-R3: "The Technician filter on Work Orders offers the same people the board gives a column or group to." S3-N1: a person with Technician off "is not offered in the Technician filter". Nothing says what happens to a filter that is already set to that person.
- **The question:** if the filter is already set to a person and that person's Technician is then turned off, what happens to the filter the next time the board loads?
- (a) The filter stays set to them and keeps showing their work
- (b) The filter drops them, as if they had never been picked
- (c) Something else (please say)
- **Your answer:** 

## QA-only: what each question holds

| Question | Cases held (keys; C-ids once written) |
|---|---|
| 1 (refusal-route) | API-09, API-10, API-11 |
| 2 (mixed-save-logout) | INV-13 |
| 3 (filter-on-empty) | S3-36 |
| 4 (filter-set-to-former) | S3-48 |

## Skill 07 §6 check: points not asked, and the source that answers each

- **epic-new-staff-off:** Epic SV-11788's description says "New staff start with it off", but PRD v17 S1-R3 and story SV-11879 (updated 2 Nov 2026, 14:29 UTC, after the epic at 09:33 UTC) pre-fill Technician from the role. Answered by PRD v17 (Change Log v16, 2 Nov 2026: "new staff are pre-filled from their role"); latest wins (Rule 32). Reported to the QA lead, not asked.
- **verification-tasks-role-version:** SV-11962, SV-11964, SV-11965, SV-11967, SV-11968 and SV-11969 describe the role version (PRD v9): a Technician card in Roles & Permissions, "Role is not editable.", the empty-state text "Turn Technician on for a role in Roles & Permissions" and a button that opens Roles & Permissions. PRD v17 replaces each (Change Log v10, 29 Oct 2026). Answered by PRD v17; the tasks are the developers' checklists, so the difference is reported to the QA lead, not asked.
- **warning-part-sales:** Story 2 never counts part sales (S2-E1), but release day counts time on part sales (S6-R1 (a)). The PRD states each on purpose, in its own story, and S6-E2 says part sales do not count only toward (b). Answered by the PRD.
- **same-job-lead-and-line:** Whether a line on a work order the person also leads is counted: S2-R1 (v17) "A line on a work order the person also leads still counts, so that job shows as one work order they lead and one line they are on." Answered.
- **labor-lines-wording:** Why the warning says "labor lines" while counting Add Technician lines: the tech plan records the PRD review answer "Keep \"labor lines\"" (Accepted #2). Answered.
- **assigned-to-me-non-tech:** Whether "Assigned to me" still shows a non-technician's own work: it is not a technician list (Terminology, "Nothing else"), and S3-E1 keeps a non-technician lead's column. Silence on an unchanged screen defaults to "must not change" (Rule 96), and nothing in the PRD touches that filter. Not asked.
- **both-reasons-message:** Which tooltip shows when Time Clock is off and the role is Office User: Story 1 Error Handling (v17) "the message is \"This role can't be a technician.\", both on hover in the window and in the refusal." Answered.
