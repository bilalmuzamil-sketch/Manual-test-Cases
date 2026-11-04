# Technician Toggle — questions for Chris Ward (DRAFT, not sent)

**ALL 8 ANSWERED by Chris Ward on 2 Nov 2026** (sheet https://docs.google.com/spreadsheets/d/1nLKkgSgmtqCYu4eu15_9xN38ml32tDnJls42PPq_A4M, column E; copied word for word in po-answers-2026-11-02/ANSWERS-Chris-Ward-2026-11-02.md). He published PRD v18 and design version 1793640819-ff4d with the answers. Nothing is waiting on the PO.

Project: **Technician Toggle** (epic SV-11788, PRD Confluence 977371146 version 17, 2 Nov 2026). For: Chris Ward (PO and design authority). Drafted 2 Nov 2026 by the case-library worker; the coordinator sends it as the colour-coded question sheet (Rule 125 format) once everything else is done (skill 07 §1). Nothing here has been sent.

# Questions from reading the PRD, stories and tech plan (2 Nov 2026)

## Question 1

- **Project / feature:** Technician Toggle — the Public API
- **What the PRD says now:** Story 1 Error Handling: "A request from elsewhere (for example an outside tool) that would switch Technician from off to on in either case is refused with "A technician must have Time Clock on." or "This role can't be a technician." respectively". Story 5 S5-N1: "The technician value cannot be set through the Public API. A staff update that includes it succeeds as today and ignores that value". An outside tool reaches ShopView through the Public API, so the two sentences give opposite answers for the same request.
- **The question:** if an outside tool sends a staff update that switches Technician on for someone whose Time Clock is off (or who is on the Office User or Time Clock User role), should the request be refused with the message, or accepted with the technician value ignored?
- (a) Accepted and ignored, as S5-N1 says; the two refusal messages show only for requests sent by ShopView's own screens (please say which)
- (b) Refused with the message, as Story 1 says; S5-N1 applies only when the value would not be refused
- (c) Something else (please say)
- **Chris's answer (2 Nov 2026, column E):** 1. (a) Accepted, and the Technician value is ignored. Outside tools can read Technician through the Public API but can't set it in this release (S5-N1). The two refusal messages only come from ShopView's own staff window, for example a second tab with old data. I'll fix the "outside tool" example in Story 1 Error Handling so it says that.
- **Status:** answered; API-09 to API-11 rewritten to accepted and ignored; the refusals are tested from an old staff window in a second tab (S1-38 to S1-41).

## Question 2

- **Project / feature:** Technician Toggle — Edit Staff Member
- **What the PRD says now:** S1-R8: "Saving a change to Technician never logs the staff member out. A save that also changes Time Clock logs them out, as a Time Clock change does today." Key Decisions: "Changing Technician never logs anyone out." The PRD names only Time Clock; today a role change on a staff record also logs the person out.
- **The question:** when one save changes Technician and also the role, is the staff member logged out (as a role change does today) or kept signed in?
- (a) Logged out, as a role change does today; only a save that changes nothing but Technician keeps them signed in
- (b) Kept signed in, because the save changes Technician
- (c) Something else (please say)
- **Chris's answer (2 Nov 2026, column E):** 2. (a) Logged out. The role change logs them out, the same as today. A save that changes only Technician keeps them signed in. I'll add the role to S1-R8.
- **Status:** answered; INV-13 released (PRD v18 S1-R8 names the role).

## Question 3

- **Project / feature:** Technician Toggle — Board View and Tech View
- **What the PRD says now:** S3-R10: the "No technicians yet" state shows "When Board View or Tech View has no technician column or group at all ... and neither Assigned to me nor a Technician filter is on". S3-R3: "The Technician filter on Work Orders offers the same people the board gives a column or group to", so at a location with no technicians the filter offers nobody to pick.
- **The question:** how can a Technician filter be on at a location that has no technicians? Does a filter picked at one location stay on when the user switches to a location with no technicians?
- (a) Yes: a filter picked at another location stays on, and then "No technicians yet" does not show
- (b) No: the filter is cleared when the location changes, so this cannot happen (the words are only a safeguard)
- (c) Something else (please say)
- **Chris's answer (2 Nov 2026, column E):** 3. Something else. The Technician filter also offers "Unassigned" and "Deleted technician". If either one is picked, the filter is on, so "No technicians yet" doesn't show. People picked at another location are dropped from the filter when the user switches locations, so they can't cause it. I'll add this to S3-R10.
- **Status:** answered; S3-36 rewritten to the Unassigned choice; S3-49 and S3-50 added (PRD v18 S3-R10).

## Question 4

- **Project / feature:** Technician Toggle — the Technician filter on Work Orders
- **What the PRD says now:** S3-R3: "The Technician filter on Work Orders offers the same people the board gives a column or group to." S3-N1: a person with Technician off "is not offered in the Technician filter". Nothing says what happens to a filter that is already set to that person.
- **The question:** if the filter is already set to a person and that person's Technician is then turned off, what happens to the filter the next time the board loads?
- (a) The filter stays set to them and keeps showing their work
- (b) The filter drops them, as if they had never been picked
- (c) Something else (please say)
- **Chris's answer (2 Nov 2026, column E):** 4. (b) The filter drops them, as if they had never been picked. This is the same as what happens today to someone from another location or a deleted staff member. Their work orders don't move. I'll add this to S3-N1.
- **Status:** answered; S3-48 rewritten to the answer (PRD v18 S3-N1).

# Questions from reading the design (2 Nov 2026; design-2026-11-02/NEW-QUESTIONS.py rows 1 to 4, register TT-D01, TT-D02, TT-D04, TT-D06; merged into this one sheet, Rule 131)

## Question 5

- **Project / feature:** Technician Toggle — New Staff Member window
- **What the PRD says now:** S1-R5: "In New Staff Member, turning Time Clock on pre-fills Technician from the role (S1-R3), unless the user has already switched Technician by hand." The design's page 2 note agrees ("Changing the role or Time Clock sets it again from the role"), but its page 3 note, under a New Staff Member picture, says "Turning Time Clock back on leaves Technician off; the user turns it on." and "Edit behaves the same."
- **The question:** pick the Technician role and switch Time Clock on, and Technician switches on by itself. If Time Clock is then switched off and on again, what should Technician do?
- (a) As the spec: it switches on again by itself from the role, unless the user had already switched Technician by hand
- (b) As the design's page 3 note: it stays off and the user turns it on
- (c) Something else (please say)
- **Chris's answer (2 Nov 2026, column E):** 5. (a) As the PRD says: in New Staff Member it switches back on from the role, unless the user already switched Technician by hand. The page 3 note in the design was written before the pre-fill existed, and I'll fix it. In Edit Staff Member, turning Time Clock back on still leaves Technician off.
- **Status:** answered; S1-16 released; D-33 deleted (DELETE.json).

## Question 6

- **Project / feature:** Technician Toggle — Edit Line window
- **What the PRD says now:** S3-R8: "In Edit Line they show as an ordinary chip that can be removed with its X, unless they have logged time on the line, in which case the chip shows the existing lock". Story SV-11881 agrees ("an ordinary chip (not grayed out)"). The design does not draw the chip; its note under the Add Technician picture says "Anyone already on a line who is not a technician any more stays on it and shows grayed out, the same as a deactivated technician today."
- **The question:** a person was added to a line with Add Technician and later their Technician toggle is turned off. In Edit Line, how should that person's chip look?
- (a) As the spec: an ordinary chip, not grayed out, removable with its X (with the lock if they have logged time)
- (b) As the design's note: grayed out, the same as a deactivated technician today
- (c) Something else (please say)
- **Chris's answer (2 Nov 2026, column E):** 6. (a) As the PRD says: an ordinary chip, not grayed out, removable with its X, with the lock if they have logged time on the line. Grayed out means deactivated, and this person isn't deactivated. I'll fix the page 6 note in the design.
- **Status:** answered; S3-24 to S3-26 and D-27 released; D-34 deleted (DELETE.json).

## Question 7

- **Project / feature:** Technician Toggle — Board View and Tech View empty state
- **What the PRD says now:** S3-R10: the text "Turn Technician on for your technicians in Staff to assign work orders. Until then, every work order stays in Unassigned." The design system (ds/shopview/components.css, EMPTY STATE): "One rule for every empty state in the product: ONE icon from the set, a title, at most one sentence, and the action that fills it." The design draws no empty state for this feature.
- **The question:** the spec gives "No technicians yet" two sentences, and the ShopView design system the design uses allows at most one sentence in an empty state. Which should it show?
- (a) As the spec, both sentences
- (b) One sentence only (please give the words)
- (c) The design system's rule does not apply here; keep (a)
- **Chris's answer (2 Nov 2026, column E):** 7. (c) Keep both sentences. They follow Branko's Work Orders design for this state, which already shipped with two sentences in SV-11555 and passed QA. Technician Toggle only changes the first sentence.
- **Status:** answered; S3-29, S3-30 and D-29 released, both sentences kept.

## Question 8

- **Project / feature:** Technician Toggle — New Staff Member window
- **What the PRD says now:** S1-R3: Technician is pre-filled "when the window opens and again each time the role or Time Clock is changed, until the user switches Technician by hand", and "The toggle as shown is what is saved." The PRD names only "the window's existing Save"; the design shows Save & Add Next and Save & Close in every New Staff Member picture. The stories and the tech plan do not mention Save & Add Next.
- **The question:** after Save & Add Next the window stays open, empty, for the next person. In that next, empty form, how is Technician set?
- (a) As if the window had just opened: set from the role again, and any earlier switch by hand is forgotten
- (b) It keeps the previous person's hand choice until the user changes it
- (c) Something else (please say)
- **Chris's answer (2 Nov 2026, column E):** 8. (a) As if the window had just opened. Save & Add Next clears the form the same way it does today: no role, Time Clock off, Technician off. Any earlier switch by hand is forgotten, and the next person's Technician is set from their own role. I'll add Save & Add Next to S1-R3.
- **Status:** answered; S1-37 rewritten to the answer and released (PRD v18 S1-R3).

## Question 9 (added to Chris's sheet by the coordinator, 2 Nov 2026: tech plan D19 against S6-R1 (a), a time entry with both a department and a work order)

- **Chris's answer (read 4 Nov 2026, column E, row 15):** 9. (a) Yes, it counts. It's time on a work order, so the person did technician work. Release day can only turn Technician on, never off, and the shop can switch it off in Staff. I've added this to S6-R1(a).
- **Status:** answered; PRD v20 (3 Nov 2026) S6-R1 (a) carries it. The release-day cases S6-01 to S6-06 re-quote v20. No manual case for the combined entry: no ShopView screen creates a time entry with both a department and a work order (Chris's question 9 note), so it is listed as not testable by hand in REPORT.md.

## QA-only: what each question holds

| Question | Cases held (keys; C-ids once written) |
|---|---|
| 1 (refusal-route) |  |
| 2 (mixed-save-logout) |  |
| 3 (filter-on-empty) |  |
| 4 (filter-set-to-former) |  |
| 5 (tt-d01) |  |
| 6 (tt-d02) |  |
| 7 (tt-d04) |  |
| 8 (tt-d06) |  |

## Skill 07 §6 check: points not asked, and the source that answers each

- **epic-new-staff-off:** Epic SV-11788's description says "New staff start with it off", but PRD v17 S1-R3 and story SV-11879 (updated 2 Nov 2026, 14:29 UTC, after the epic at 09:33 UTC) pre-fill Technician from the role. Answered by PRD v17 (Change Log v16, 2 Nov 2026: "new staff are pre-filled from their role"); latest wins (Rule 32). Reported to the QA lead, not asked.
- **verification-tasks-role-version:** SV-11962, SV-11964, SV-11965, SV-11967, SV-11968 and SV-11969 describe the role version (PRD v9): a Technician card in Roles & Permissions, "Role is not editable.", the empty-state text "Turn Technician on for a role in Roles & Permissions" and a button that opens Roles & Permissions. PRD v17 replaces each (Change Log v10, 29 Oct 2026). Answered by PRD v17; the tasks are the developers' checklists, so the difference is reported to the QA lead, not asked.
- **warning-part-sales:** Story 2 never counts part sales (S2-E1), but release day counts time on part sales (S6-R1 (a)). The PRD states each on purpose, in its own story, and S6-E2 says part sales do not count only toward (b). Answered by the PRD.
- **same-job-lead-and-line:** Whether a line on a work order the person also leads is counted: S2-R1 (v17) "A line on a work order the person also leads still counts, so that job shows as one work order they lead and one line they are on." Answered.
- **labor-lines-wording:** Why the warning says "labor lines" while counting Add Technician lines: the tech plan records the PRD review answer "Keep \"labor lines\"" (Accepted #2). Answered.
- **assigned-to-me-non-tech:** Whether "Assigned to me" still shows a non-technician's own work: it is not a technician list (Terminology, "Nothing else"), and S3-E1 keeps a non-technician lead's column. Silence on an unchanged screen defaults to "must not change" (Rule 96), and nothing in the PRD touches that filter. Not asked.
- **both-reasons-message:** Which tooltip shows when Time Clock is off and the role is Office User: Story 1 Error Handling (v17) "the message is \"This role can't be a technician.\", both on hover in the window and in the refusal." Answered.

## Skill 07 §6 re-run on the four design questions: why each is kept

- **tt-d01 (question 5):** PRD S1-R5 is explicit, but the design (the other authority) says the opposite in its page 3 note, and the canvas has no date, so latest-wins cannot decide it (register TT-D01). A document-vs-design conflict is the PO's (skill 07 §5).
- **tt-d02 (question 6):** The PRD, story SV-11881 and the tech plan (D1: former technicians are not disabled) agree on an ordinary chip, but the design's own note says grayed out; Rule 130 closes a design difference only with a sent question or a ruling.
- **tt-d04 (question 7):** The PRD text is explicit, but the design system's always-rule is in scope (L-01) and contradicts it; no source rules on which wins.
- **tt-d06 (question 8):** No source mentions Save & Add Next; S1-R3 says the pre-fill runs "when the window opens", and after Save & Add Next the window does not open again, so the PRD does not settle it.

The design worker's own skill 07 §6 drops (TT-D03, TT-D05, TT-D07 to TT-D15 and the 19 not-drawn states) are listed, with the source that settles each, in design-2026-11-02/NEW-QUESTIONS.py and DESIGN-DIVERGENCE-REGISTER.json.
