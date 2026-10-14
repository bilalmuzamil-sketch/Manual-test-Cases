# Confluence comments — PRD 845185030 and child 853901313 (captured 2026-10-14)

Read-only, verbatim (mention markup reduced to the name; emails removed). Source: `listConfluenceComments` with `include-replies=true` (flat list of every descendant reply, incl. replies to replies), 250 per page, no further page; footer and inline, open and resolved. Cross-checked against `getConfluencePageFooterComments` / `getConfluencePageInlineComments` for the statuses open, resolved, dangling and reopened (resolved/dangling/reopened returned none). Author names: from account ids (Sasha Grosman 712020:7b606895, Chris Ward 712020:aa00b8d6 — repo records; Milan Zivanovic 557058:ead5f72a — repo records; Slavcho Mitrov 712020:1b27a800 and Branko Cicovic 712020:92c46428 — inferred from the replies that address them by name).

## Summary

- PRD 845185030: **82 comments** (5 footer threads, 28 inline threads, 49 replies). Newest created: **2026-10-07T14:35 UTC**. Edited after creation since 7 Oct: none (every `updatedAt` equals `createdAt` for 7 Oct onward).
- **Created after 7 Oct: none.** On 7 Oct: 925204483 (14:12), 924057650 (14:15), 924221605 (14:29) — before our capture; 924123169 (14:35) — 1 minute after our v42 capture, already folded into the 8 Oct check (S7-R8–R10 / SV-9769).
- Later product decisions were made in Jira and Slack, not in these comments (see `jira-2026-10-14.md` and `SOURCE-CHECK-2026-10-14.md`).
- Child 853901313: 5 inline threads + 1 reply, all 15 Sep 2026, all open. None after 7 Oct.

## PRD 845185030 — every comment, oldest first

### footer thread 866779137 — Milan Zivanovic (engineering), 2026-09-17T13:25 UTC · open
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=866779137

**Engineering tech-plan review — gaps and questions (spec v0.8)**

Hi @Sasha Grosman — engineering has started the technical plan for this spec. None of the items below block planning: where something is open we planned on the stated assumption, so a quick confirm or correction is enough.

**A. Conflicts**

1. Default filter view — S1-R10 and DR-5 say Work Orders is (and remains) the default, but production opens on All for anyone without a saved preference. Users who already saved a tab keep it (today: Work Orders 1,358 users, All 856, Estimates 126, Completed 124). We plan Work Orders as the default for users with no saved preference — please confirm that change is intended.
2. Reordering locked work orders — S4-N2 and S9-N1 block every drag in Invoiced, Paid, Declined and Imported, including reordering within the same technician. The design allows reordering within a technician and blocks only moving to another one. Which applies? (Planned: the PRD rule.)
3. Design items not on the review page's UX list — the current design still shows:
    - "Waiting on N parts" on cards (removed by the 2026-09-03 decision);
    - an Undo action on the reassignment toast (not in S4-R5 / S4-R16; an undo also can't restore lines that moved or shifts that were cleared);
    - Unassigned hidden when it has no work (S2-N1 keeps it as a drop target);
    - a Details view;
    - Technician and Department filter chips (removed from production in SV-8785).

   Please confirm these are out of scope / to be updated in the design. (Planned: the PRD.)

**B. Assumptions to confirm**

1. OQ-2 — When anyone gives a work order a new lead (drag, dialog or detail page), it appears at the bottom of that technician's list in every other user's saved order.
2. SQ-11 — Unpinning returns the technician to their previous position. Pins and manual order belong to the user, not the location; technicians who aren't eligible in the current location simply don't show.
3. MF-3 — "N open" counts work orders where that technician is the lead, in the current location, in Approved / In Progress / Ready for Review, regardless of the page's filters.
4. FF-4 — Removing the lead shows the same shift-clearing prompt as changing it. The lead change and the shift clearing succeed or fail together: if clearing fails, the lead is not changed and the S4-N8 error shows.
5. FF-4 — Clearing removes only the outgoing lead's work-order shifts that haven't ended yet; past shifts stay in the schedule history.
6. SQ-10 — Clicking anywhere on a card or row (outside its controls) opens the work order; a drag starts only after the pointer moves a few pixels.

**C. Unassigned in the All view (production data)**

1. The Work Orders view is small (at most 164 work orders per location among the 15 largest). All is dominated by historical Invoiced/Paid work, and most of it has no lead technician: at the largest location roughly 8,200 of about 9,000 work orders would sit in the fixed Unassigned column/group, and several others have 3,000–6,500. Performance is fine — cards load as you scroll — but on All the first thing a user sees in Kanban or Tech View is a fixed column of thousands of old invoiced jobs. Is that intended, or should the board displays treat All differently (for example, leave Invoiced/Paid out of Unassigned)? S1-R3 currently says a display never changes which work orders are shown, so we planned the spec as written.

**D. FYI — engineering answers**

- FF-4 notifications: no notification is sent on a lead change today, so S4-R6 keeps it that way.
- MF-2, FF-2 and FF-6 are being settled in the technical plan.

#### ↳ reply 886669314 (to 866779137) — Sasha Grosman, 2026-09-24T04:23 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=886669314

**A. Conflicts**

1. Default filter view — S1-R10 and DR-5 say Work Orders is (and remains) the default, but production opens on All for anyone without a saved preference. Users who already saved a tab keep it (today: Work Orders 1,358 users, All 856, Estimates 126, Completed 124). We plan Work Orders as the default for users with no saved preference — please confirm that change is intended.
    1. **SG: **Confirm we default to Work Orders. Sounds like there is a bug in prod, it was not expected to open to All.
2. Reordering locked work orders — S4-N2 and S9-N1 block every drag in Invoiced, Paid, Declined and Imported, including reordering within the same technician. The design allows reordering within a technician and blocks only moving to another one. Which applies? (Planned: the PRD rule.)
    1. **SG: **We should match existing login on the work order. Per user testing it seems if a WO is Invoiced or Paid the user cannot change lead technician. This means that Invoiced and Paid WOs can be dragged around within the Lead Tech they are assigned (or dragged around unassigned if they never were assigned), but cannot be dragged to a new tech or to Unassigned (from a tech).
    2. Work Orders in Complete status can be dragged between techs or to and from unassigned.
3. Design items not on the review page's UX list — the current design still shows:
    - "Waiting on N parts" on cards (removed by the 2026-09-03 decision);
    - an Undo action on the reassignment toast (not in S4-R5 / S4-R16; an undo also can't restore lines that moved or shifts that were cleared);
    - Unassigned hidden when it has no work (S2-N1 keeps it as a drop target);
    - a Details view;
    - Technician and Department filter chips (removed from production in SV-8785).
    - @Chris Ward please work with @Branko Cicovic to clean this up.
4. Please confirm these are out of scope / to be updated in the design. (Planned: the PRD.)
    1. Is this referring to #3? cc @Milan Zivanovic@Chris Ward

**B. Assumptions to confirm**

1. OQ-2 — When anyone gives a work order a new lead (drag, dialog or detail page), it appears at the bottom of that technician's list in every other user's saved order.
    1. **SG: **confirmed.
2. SQ-11 — Unpinning returns the technician to their previous position. Pins and manual order belong to the user, not the location; technicians who aren't eligible in the current location simply don't show.
    1. **SG: **confirmed.
3. MF-3 — "N open" counts work orders where that technician is the lead, in the current location, in Approved / In Progress / Ready for Review, regardless of the page's filters.
    1. **SG: **and also “complete”. **SG: **confirmed.
4. FF-4 — Removing the lead shows the same shift-clearing prompt as changing it. The lead change and the shift clearing succeed or fail together: if clearing fails, the lead is not changed and the S4-N8 error shows.
    1. **SG: **confirmed.
5. FF-4 — Clearing removes only the outgoing lead's work-order shifts that haven't ended yet; past shifts stay in the schedule history.
    1. **SG: **confirmed.
6. SQ-10 — Clicking anywhere on a card or row (outside its controls) opens the work order; a drag starts only after the pointer moves a few pixels.
    1. **SG:** @Chris Ward please work with @Branko Cicovic to confirm.

**C. Unassigned in the All view (production data)**

1. The Work Orders view is small (at most 164 work orders per location among the 15 largest). All is dominated by historical Invoiced/Paid work, and most of it has no lead technician: at the largest location roughly 8,200 of about 9,000 work orders would sit in the fixed Unassigned column/group, and several others have 3,000–6,500. Performance is fine — cards load as you scroll — but on All the first thing a user sees in Kanban or Tech View is a fixed column of thousands of old invoiced jobs. Is that intended, or should the board displays treat All differently (for example, leave Invoiced/Paid out of Unassigned)? S1-R3 currently says a display never changes which work orders are shown, so we planned the spec as written.
    1. **SG: **All is designed to be further filtered down by a user. All is only useful after filtering for any of the view options. It is OK to show this as spec is written.

**D. FYI — engineering answers**

- FF-4 notifications: no notification is sent on a lead change today, so S4-R6 keeps it that way.
- MF-2, FF-2 and FF-6 are being settled in the technical plan.

#### ↳ reply 887160833 (to 866779137) — Milan Zivanovic (engineering), 2026-09-24T10:29 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887160833

@Sasha Grosman

> Please confirm these are out of scope / to be updated in the design. (Planned: the PRD.)
> 
> 1. Is this referring to #3?

Yes

### footer thread 869171201 — Milan Zivanovic (engineering), 2026-09-17T21:04 UTC · open
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=869171201

**Engineering tech-plan review — follow-up from code planning (spec v0.8)**

Hi @Sasha Grosman — the backend and frontend plans are done. These came out of reading the code and don't block us: each says what we planned, so confirming or correcting is enough. Items 12–13 are things users will notice, so they may need a release note.

**A. Rules that conflict or aren't defined**

1. **"Assigned to me" hides Unassigned (S2-R9, S3-N1), but it also matches work orders where I'm the service advisor or work on a line.** Those with no lead technician are visible in List and would vanish in Tech View and Kanban — which S1-R3 says shouldn't happen. Planned: follow the PRD and hide it. Should those work orders stay reachable?
2. **With "Assigned to me" on, should every eligible technician group still appear** (up to 66 empty columns), or only those with matching work? S2-R14 and S3-R9 don't say.
3. **Imported work orders** live in a separate table and have no lead technician, so they can't be grouped. Planned: while the Imported chip is selected, Tech View and Kanban are unavailable with a tooltip, and List shows as it does today.
4. **Pins across locations.** Pins belong to the user, not the location. Planned: pins for technicians at another location are hidden and don't use up the 3 slots there; a pinned technician at this location always gets a column even when inactive or empty, so it can still be unpinned (S3-E3, S3-E5).
5. **Technicians who are active but no longer eligible here** (unenrolled, role changed, clock-in disabled) aren't covered — only "deactivated" is (S2-N3, S3-N4, S4-N5). Planned: treat them like inactive, so nothing can be dropped on them.

**B. Text and fields the PRD names that don't exist**

1. **S4-N6 and Section 9** say the disabled action shows "the same reason text shown on the work order page today". The work order page shows **no** reason text, and it locks only Invoiced and Paid. We need the wording. We're also adding Declined to the work order page so it matches the rule.
2. **S7-R1 "the List/Tech View Assigned Tech column"** — the List column is called **Lead Technician**. Planned: keep it and show the avatar group there. Rename it?
3. **S5-R11 "clocked-in time"** — production has no such field; the List shows clocked-in technician **names**. What should the card show?
4. **S7-R1** — should technicians on **declined** lines appear in the avatar group? Planned: yes, all lines.
5. **OQ-2 "bottom"** — without writing to other users' saved orders, "bottom" means after everything they've manually ordered, then normal sort. Confirm that reading.

**C. Consequences worth knowing**

1. **Analytics volume (S12-R2).** One event per available field per view is roughly 15 events each time someone opens a display, and outcome-based events depart from our usual "record intent" convention. Send exposure once per session instead?
2. **Clearing a shift that is already running** deletes the whole planned block. Keep the part already worked instead?
3. **Changes existing users will notice**, all required by the spec: Declined work orders can no longer have their lead changed (today they can); lines with their own assigned technician stop following a lead change; lines whose time was logged against a task rather than the line stop moving; re-selecting the same lead technician no longer quietly assigns unassigned lines.

**D. Found while planning against the code**

1. **S2-R3 tie-break** — the spec orders identical technician names by "earliest-created **staff** record", but the staff record has no created date. We plan to use the user account's created date instead, then the staff id. A different record; confirm that's acceptable.
2. **Phone and tablet (V-2) cannot be built yet.** UX-20 is still open, so there is no design. In the meantime phones keep today's mobile list and the new displays are withheld below the desktop width — which does **not** satisfy V-2. This is the one requirement in the spec we cannot deliver without design; it needs UX-20 before it can even be estimated.
3. **Default filter view, one detail worth confirming** — alongside the earlier question: a new user will land on Work Orders, but a shared link without a tab in the URL will still open All, so existing links keep their meaning.
4. **Analytics reports need an owner (S12-R4, R10–R13).** Four of Story 12's requirements define *reports* (weekly usage by distinct users, field-selection rate, density distribution, separate cohorts), not events. Engineering ships the events; someone in product analytics needs to own the report definitions, or Story 12 stays unmet even when the code is done.

#### ↳ reply 886374410 (to 869171201) — Sasha Grosman, 2026-09-24T04:32 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=886374410

**A. Rules that conflict or aren't defined**

1. **"Assigned to me" hides Unassigned (S2-R9, S3-N1), but it also matches work orders where I'm the service advisor or work on a line.** Those with no lead technician are visible in List and would vanish in Tech View and Kanban — which S1-R3 says shouldn't happen. Planned: follow the PRD and hide it. Should those work orders stay reachable?
    1. **SG: **@Chris Ward@Branko Cicovic this needs some UX thought. I think all of the Tech view groups, and columns in Board view should remain visible, but somehow become secondary. The groupings and columns with assigned to me work  in them should become primary some how. Please work together to figure this out.
2. **With "Assigned to me" on, should every eligible technician group still appear** (up to 66 empty columns), or only those with matching work? S2-R14 and S3-R9 don't say.
    1. I believe this will be answered by the previous 1.a response / workflow.
3. **Imported work orders** live in a separate table and have no lead technician, so they can't be grouped. Planned: while the Imported chip is selected, Tech View and Kanban are unavailable with a tooltip, and List shows as it does today.
    1. **SG:** that works.Also ‘Imported’ should be disabled as an option on the Status filter on Tech and Board view.
4. **Pins across locations.** Pins belong to the user, not the location. Planned: pins for technicians at another location are hidden and don't use up the 3 slots there; a pinned technician at this location always gets a column even when inactive or empty, so it can still be unpinned (S3-E3, S3-E5).
    1. **SG**: agree.
5. **Technicians who are active but no longer eligible here** (unenrolled, role changed, clock-in disabled) aren't covered — only "deactivated" is (S2-N3, S3-N4, S4-N5). Planned: treat them like inactive, so nothing can be dropped on them.
    1. **SG**: agree.


@Chris Ward@Slavcho Mitrov@Branko Cicovic please work to answer  the open items in:

**B. Text and fields the PRD names that don't exist**

**C. Consequences worth knowing**

**D. Found while planning against the code**

#### ↳ reply 891813918 (to 869171201) — Chris Ward, 2026-09-25T20:29 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891813918

@Milan Zivanovic all open items are answered and the PRD is updated (v29). Summary:

1. **Declined:** lead can still be changed, as in production today. Locked: Invoiced and Paid (reorder within their technician only), and Imported.
2. **Board order:** the order of work orders is shared per location, the same for everyone. Technician group/column order and pins are per user.
3. **Header count:** the work orders currently shown in that group or column, after filters.
4. **Unassigned:** fixed first, and stays visible when empty as a drop target, in both views.
5. **Assigned to me:** only my matching work orders show, but every group, column and Unassigned stays on screen. Mine are highlighted, the rest muted. Branko defines what muted looks like.
6. **Click vs drag:** clicking anywhere outside a row’s or card’s controls opens the work order. A drag starts only after the pointer moves a few pixels.
7. **Phones and tablets:** List exactly as today. Tech View and Board View are desktop only, so no mobile design is needed.
8. **List is out of scope entirely:** it stays exactly as in production, and the only addition is the display switcher. Story 10 is removed (SV-10053 closed), and density, columns and avatars apply only to the new views. The default-tab change is out too.
9. **Smaller items:**
    - The lock message is “The lead technician can’t be changed once a work order is Invoiced or Paid.”
    - The “clocked in” field shows technician names, as List does.
    - Tech View gets a new Assigned Techs column.
    - A running shift is trimmed at the moment of the lead change.
    - Field analytics fire once per display per session.
    - The release note covers the four lead-change behavior changes (R-1).
    - Milos Vasic owns the Story 12 reports.

Jira stories SV-10044 to SV-10052 match the PRD. Still with Branko: the muted look, empty-group wording, column/page scrolling, and pinned-area reordering UI.

#### ↳ reply 896008225 (to 869171201) — Slavcho Mitrov, 2026-09-28T10:18 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=896008225

@Chris Ward thanks, everything is now in the tech plan and all seven gates are ticked. Three small things are left:

1. **Two people reordering at once.** The order is now shared per location (S9-R11), so two dispatchers can reorder the same technician's work at the same moment. We plan last-write-wins: the later save decides, and the other person sees it on their next refresh. Is that OK, or should the other person be told that their order is out of date? That second option is more work.
2. **What counts as desktop (S1-R14).** We plan to decide by screen width, the same way the page picks the phone List today. That means a landscape tablet (about 1024 px and wider) would be offered Tech View and Board View, although drag isn't built for touch. Is that acceptable, or should tablets never see the new views, whatever their width?
3. **Housekeeping:** could you create the Jira story for Story 12 (analytics events plus Milos's reports) under SV-10043? And could you refresh the register on the Review Decisions page? It's still at v10 (21 Sep) and contradicts the PRD in places. For example, UX-1 still calls Column View a proposal, UX-17 still lists Declined as locked, and OQ-2 describes a per-user order.

#### ↳ reply 901873667 (to 869171201) — Slavcho Mitrov, 2026-09-29T14:43 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=901873667

@Sasha Grosman thanks for refreshing the register. Two questions and three answers for it:

1. **"N open" in the Reassign dialog (S4-R15).** The PRD and the register say Approved, In Progress and Ready for Review. On 2026-09-24 Sasha answered MF-3 with "and also complete", so our plan counted Complete as well. Which is it? It's a one-line change on our side, so either is fine.
2. **MF-2 (existing line assignments), engineering's answer:** from the release on, each line records whether its technician came from the lead or was chosen explicitly. Existing lines have no record, and for them the current rule still applies: a line follows a lead change only if its technician is the outgoing lead. We don't backfill.
3. **FF-2 (sort and status filter), engineering's answer:** today the desktop List sorts by customer name A–Z, and the phone List by start date, newest first. Ties are broken by work order id. A saved sort wins, and filtering to Invoiced only sorts by invoiced date, newest first. The Status chip shows only on the All tab; each other tab applies its fixed statuses. Tech View and Board View reuse that sort until someone reorders manually.
4. **Imported work orders (DR-37):** they're locked too. Should the disabled action show the same text ("The lead technician can't be changed once a work order is Invoiced or Paid."), or wording of its own? It rarely shows, because the board views leave Imported out.
5. **FF-4:** Sasha confirmed on 2026-09-24 that removing the lead shows the same shift prompt as changing it, and that the lead change and the shift clearing succeed or fail together. That's what we built. The register still lists both as open; could you mark them answered?

#### ↳ reply 902266881 (to 901873667) — Chris Ward, 2026-09-29T15:56 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=902266881

Thanks. Answers:

1. **N open (S4-R15):** includes Complete, as Sasha said. S4-R15 updated.
2. **MF-2:** accepted as you describe, no backfill.
3. **FF-2:** accepted as you describe.
4. **Imported (DR-37):** its own wording, “The lead technician can’t be changed on an imported work order.” New S4-N9, plus a row in the states table.
5. **FF-4:** marked answered on the register.

One change to plan for: with Assigned to me on, groups and columns without my work orders are now hidden, not muted (Branko’s call). That includes Unassigned and pinned technicians, so “a pinned technician always gets a column” does not apply while Assigned to me is on. See S2-R9, S3-N1, S2-N1, S2-R14, S3-R9, S3-R22 (v35).

#### ↳ reply 902397953 (to 869171201) — Slavcho Mitrov, 2026-09-29T16:25 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=902397953

@Sasha Grosman two small questions about the shared order (G2 / S9), for work orders that don't get there by a drag:

1. **Removing the lead** in the Reassign dialog or on the work order page moves the work order to Unassigned. We plan to put it at the bottom of Unassigned, the same rule as any other lead change (S4). With All selected, that's after every other unassigned work order, which is several thousand at the busiest locations. Is that OK, or should it take its normal place in the default order?
2. **A work order created with a lead** (or split off with one) was never reassigned, so we plan to show it in the default order (customer name A–Z) with the other work orders nobody has ordered, not at the bottom. Is that OK?

Both are one-line switches on our side, so either answer is fine, and we're building with the answers above until you say otherwise.

#### ↳ reply 902463489 (to 902397953) — Chris Ward, 2026-09-29T16:42 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=902463489

Both as planned:

1. **Removing the lead:** bottom of Unassigned. It is the dialog version of dragging to Unassigned, so it follows the same rule as any other lead change from the dialog or detail page (S9-R14). The long Unassigned on All is accepted; on the Work Orders tab it is small.
2. **Created or split off with a lead:** default order with the work orders nobody has ordered (S9-R3). It never got a new lead, so S9-R14 does not apply.

S9-R14 now says the first one explicitly (PRD v37).

#### ↳ reply 908754945 (to 869171201) — Slavcho Mitrov, 2026-10-01T12:04 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=908754945

Hi @Chris Ward, @Sasha Grosman, we compared Board View with Branko's design, and three things in it aren't in the PRD:

1. **The minimap** (the column overview at the bottom right that you can drag to scroll). **We're building it in this release**, as the design shows it.
2. **Position numbers on cards** (1, 2, 3 in each column). We've left them out for now. In the design they count the column's full, unfiltered queue, so with a filter on the numbers jump (1, 4, 9). What should the number mean? It fits best with manual ordering, which comes with drag and drop.
3. **"Add Technician" on the empty board** (an organization with no technicians). We've left the button out; the panel only explains that work orders stay in Unassigned. Should it link to adding staff, and for which roles?

If any of these should be in the PRD, could you add them? Otherwise we'll keep 2 and 3 out.

FYI @Branko Cicovic: where the design and the PRD differ, we followed the PRD, so the design may want updating:

- **Pins:** the limit is 3, not 5.
- **Filtering:** empty technician columns stay visible while a filter is on.
- **Compact density:** spacing only; it doesn't hide the hours or the footer.
- **Long names:** they wrap instead of being cut off with "…".
- **Declined:** not locked, so it gets no lock icon. Only Invoiced, Paid and Imported are locked.
- **Empty column:** the text is "No work orders".

#### ↳ reply 909901825 (to 908754945) — Chris Ward, 2026-10-01T15:20 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=909901825

@Slavcho Mitrov thanks for checking these against the design. The rule is simple: if it's not in the PRD, it's not in the feature. So please leave all three out: the minimap, the position numbers on cards, and Add Technician on the empty board.

@Branko Cicovic could you please update the design file to match the PRD? Please drop those three, and pick up the differences Slavcho listed: pins limit is 3, empty technician columns stay visible while filtering, Compact is spacing only, long names wrap, Declined has no lock icon (only Invoiced, Paid and Imported do), and an empty column reads "No work orders".

#### ↳ reply 909934593 (to 902397953) — Chris Ward, 2026-10-01T15:20 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=909934593

@Slavcho Mitrov sorry for the slow answer on these.

1. Removing the lead: please put it in the normal default order in Unassigned (customer name A to Z), not at the bottom. At the bottom of thousands it's lost. Bottom-of-column is for moving work between technicians, not for taking it off someone.
2. Created or split with a lead: yes, please show it in the default order with everything else nobody has ordered.

Both are now in the PRD.

#### ↳ reply 912752642 (to 869171201) — Slavcho Mitrov, 2026-10-02T09:09 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=912752642

Hi @Chris Ward, @Branko Cicovic, a few questions about Tech View that the PRD doesn't answer. We're building with the answer after each one, so a quick "OK" or a correction is enough:

1. **A search and collapsed groups.** If a search or filter finds work orders inside a group the user collapsed, should that group open by itself? The design does this. **We're keeping it collapsed.** Collapsing is the user's saved choice (S2-R13), and the group's count still shows how many match.
2. **Where pinned technicians sit.** Right after Unassigned and before everyone else, as in Board View? S3-R15 and S3-R16 are written for Board View. **We're using the same order in both views.**
3. **Pins with Assigned to me on.** Board View hides the pin controls while Assigned to me is on (S3-N3). **We're doing the same in Tech View.**
4. **A total row.** The List ends with a row totalling the price of the work orders shown. **Tech View won't have one**; S2-R4 only talks about columns.
5. **The Assigned Techs column** (S7-R1), for Branko: where should it go? **We're putting it right after Lines**, which is its neighbour in the design.
6. **Unassigned on the All tab.** There, Unassigned can hold thousands of work orders before the first technician. Should Tech View open with Unassigned collapsed? **We're opening it expanded** unless the user collapsed it. The group header stays on screen while you scroll, so it can be collapsed from anywhere.

#### ↳ reply 914325506 (to 912752642) — Chris Ward, 2026-10-02T17:32 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=914325506

Hi @Slavcho Mitrov, thanks, these are all good. Going with your defaults:

1. Collapsed groups stay collapsed during a search or filter. The count shows the matches.
2. Pinned technicians sit in the same order as Board View: Unassigned, then pins in the order they were pinned, then everyone else.
3. Pin controls are hidden while Assigned to me is on, same as Board View.
4. No total row in Tech View for V1.
5. Assigned Techs goes right after Lines, as in the design. @Branko Cicovic please shout if you meant somewhere else.
6. Unassigned opens expanded unless the user collapsed it. One thing to confirm, please: on the All tab Unassigned should load in pages as you scroll, like List does, never thousands of rows at once.

These are now in the PRD: S2-R16, S2-R17, S2-R18, S2-N4, S2-N5 and S7-R7.

### inline thread 887521281 — Sasha Grosman, 2026-09-24T13:25 UTC · open
Anchored on: “R4”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887521281

remove ‘across session’ that is misleading. Keep this ‘at user level’.

#### ↳ reply 892502023 (to 887521281) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=892502023

Done in v18: "across sessions" removed. S1-R4 now says the display option is saved per user and follows them after logout/login, on other devices and in other locations.

### inline thread 886931509 — Sasha Grosman, 2026-09-24T13:26 UTC · open
Anchored on: “R5”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=886931509

redundant with prereq

#### ↳ reply 892010522 (to 886931509) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=892010522

Done in v18: S1-R5 removed, since the story prerequisite already covers it.

### inline thread 887619586 — Sasha Grosman, 2026-09-24T13:29 UTC · open
Anchored on: “S1-R7: Restore saved List sort when returning to List.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887619586

Make this a iittle more clear for humans

#### ↳ reply 887652353 (to 887619586) — Sasha Grosman, 2026-09-24T13:30 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887652353

Also include that the sort is shared across all users. Might be covered in story 4.

### inline thread 887357443 — Sasha Grosman, 2026-09-24T13:31 UTC · open
Anchored on: “R”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887357443

clarify or drop

#### ↳ reply 891715676 (to 887357443) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891715676

Done in v18: S1-R12 rewritten. Opening a filter view any way other than browser Back starts the list at the top and all the way to the left.

### inline thread 887455746 — Sasha Grosman, 2026-09-24T13:34 UTC · open
Anchored on: “E1”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887455746

Core requirement

#### ↳ reply 891289933 (to 887455746) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891289933

Done in v18: moved into the requirements list as S1-R13.

### inline thread 887586818 — Sasha Grosman, 2026-09-24T13:35 UTC · open
Anchored on: “Dragging work orders additionally requires the create and edit permission (Story 9).”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887586818

This can be a note. It’s a requirement covered in a later story.

#### ↳ reply 892928011 (to 887586818) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=892928011

Done in v18: the drag permission line is now a context note under the Story 2 and Story 3 prerequisites, pointing to Story 9.

### inline thread 887717890 — Sasha Grosman, 2026-09-24T13:36 UTC · open
Anchored on: “work order count.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887717890

Define which work order statuses are counted.

#### ↳ reply 892108863 (to 887717890) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=892108863

Done in v18: S2-R12 and S3-R12 now define the count as the work orders currently shown in that group or column after the filter view and filters, so it always matches what is listed.

### inline thread 887128068 — Sasha Grosman, 2026-09-24T13:37 UTC · open
Anchored on: “Unassigned”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887128068

re-consider allowing unassigned movable. maybe we don’t need the hard rule? Worth reviewing.

#### ↳ reply 892436491 (to 887128068) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=892436491

Kept fixed. In kickoff part 2 we agreed Unassigned stays pinned, including while technicians are reordered (S9-R8). Branko also confirmed it on Slack. Happy to revisit, but no change for now.

### inline thread 887750658 — Sasha Grosman, 2026-09-24T13:38 UTC · open
Anchored on: “earliest-created staff record for identical names.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887750658

earliest created staff record sorts to the top, latest created to the bottom.

#### ↳ reply 891355161 (to 887750658) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891355161

Done in v18: identical names are ordered by when the user account was created, oldest first, newest last. It uses the user account because the staff record has no created date (Milan found this).

### inline thread 887422979 — Sasha Grosman, 2026-09-24T13:39 UTC · open
Anchored on: “across sessions”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887422979

drop ‘across session'

#### ↳ reply 891584561 (to 887422979) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891584561

Done in v18: "across sessions" removed from S2-R13. Collapse state is saved per user.

### inline thread 886669327 — Sasha Grosman, 2026-09-24T13:41 UTC · open
Anchored on: “, subject to the filtered-empty state in S1-N1.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=886669327

review based on open questions

#### ↳ reply 891519050 (to 886669327) — Chris Ward, 2026-09-25T19:23 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891519050

Settled (v21): with Assigned to me on, only my matching work orders show, but every group and column stays on screen, including Unassigned. Ones holding my work are highlighted, the rest muted. See S2-R9 and S3-N1. Branko defines what muted looks like; it is on his design list.

### inline thread 887816193 — Sasha Grosman, 2026-09-24T13:42 UTC · open
Anchored on: “S2-R15: Label empty technician groups “No work orders”.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887816193

Text here does not match design zero data.

#### ↳ reply 891813921 (to 887816193) — Chris Ward, 2026-09-25T20:31 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891813921

Settled (v30): empty technician groups and columns, and an empty Unassigned, all read "No work orders" in both views (S2-R15, S3-R20). Chris's call.

### inline thread 887291906 — Sasha Grosman, 2026-09-24T13:42 UTC · open
Anchored on: “S2-R16: Do not offer a control to hide empty eligible technician groups.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887291906

remove

#### ↳ reply 892698626 (to 887291906) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=892698626

Done in v18: S2-R16 removed.

### inline thread 887652359 — Sasha Grosman, 2026-09-24T13:42 UTC · open
Anchored on: “R8”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887652359

clarify click target. it is described in the design file.

#### ↳ reply 891453462 (to 887652359) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891453462

Done in v18: S2-R8 now says clicking anywhere on the row, outside its own controls, opens the work order, and a drag only starts after the pointer moves a few pixels.

### inline thread 887685123 — Sasha Grosman, 2026-09-24T13:44 UTC · open
Anchored on: “the group remains available with its empty state as a drop target, subject to S1-N1.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887685123

review open cometns

#### ↳ reply 891715681 (to 887685123) — Chris Ward, 2026-09-25T19:20 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891715681

Settled: an empty Unassigned stays visible as a drop target in both views. Tech View already said so here (S2-N1); Board View now has the same rule as S3-R22 (v20).

### inline thread 887750667 — Sasha Grosman, 2026-09-24T13:47 UTC · open
Anchored on: “S2-R9: Whenever “Assigned to me” is enabled, hide Unassigned.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887750667

review

#### ↳ reply 891945008 (to 887750667) — Chris Ward, 2026-09-25T19:23 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891945008

Settled (v21): with Assigned to me on, only my matching work orders show, but every group and column stays on screen, including Unassigned. Ones holding my work are highlighted, the rest muted. See S2-R9 and S3-N1. Branko defines what muted looks like; it is on his design list.

#### ↳ reply 892436502 (to 887750667) — Chris Ward, 2026-09-25T20:32 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=892436502

@Branko Cicovic one design item for you here: with Assigned to me on, every group and column stays on screen, and the ones holding my work are highlighted while the rest are muted (S2-R9, S3-N1). Could you define what muted looks like? Muted groups and columns must stay readable and still accept dropped work orders.

### inline thread 887324674 — Sasha Grosman, 2026-09-24T13:48 UTC · open
Anchored on: “S2-R10: Hovering a technician header or avatar reveals the technician’s name.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887324674

core requirement

#### ↳ reply 891289928 (to 887324674) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891289928

Done in v18: moved into the main Story 2 requirements, after S2-R8.

### inline thread 887816201 — Sasha Grosman, 2026-09-24T13:48 UTC · open
Anchored on: “S2-R11: Allow up to three pinned technician groups in Tech View.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887816201

core requirement

#### ↳ reply 892305449 (to 887816201) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=892305449

Done in v18: moved into the main Story 2 requirements, after S2-R8.

### inline thread 887324683 — Sasha Grosman, 2026-09-24T13:51 UTC · open
Anchored on: “Unassigned”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887324683

allow the cards to scroll vertically within the column when any column exceeds the board view.

#### ↳ reply 887521289 (to 887324683) — Sasha Grosman, 2026-09-24T13:53 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887521289

@Chris Ward please check with Branko if the page itself should also be scrollable. The design file allows for that, not sure if it’s intentional.

#### ↳ reply 891617298 (to 887324683) — Chris Ward, 2026-09-25T20:32 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891617298

@Branko Cicovic can you confirm the scrolling here (S3-E1)? Each Board View column scrolls on its own when its cards run past the screen. Should the whole page also scroll, as your design file allows, or only the columns?

#### ↳ reply 896270338 (to 887324683) — Branko Cicovic, 2026-09-28T09:32 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=896270338

@Chris Ward No need for the page to be scrollable only content inside the columns. I’m updating that into the design.

### inline thread 887914497 — Sasha Grosman, 2026-09-24T13:55 UTC · open
Anchored on: “Requirements”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=887914497

Check mobile behavior, including responsiveness, and dragabiilty

#### ↳ reply 891650060 (to 887914497) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891650060

Done in v18, per the kickoff: new S1-R14 says phones and tablets stay usable but are not designed for small screens in this release, and new S9-N4 says dragging is not offered there (use Reassign lead technician instead). Phone and tablet layouts are still UX-20 for Branko.

#### ↳ reply 891519055 (to 887914497) — Chris Ward, 2026-09-25T19:25 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891519055

Update (v22): for this release, phones and tablets keep today's List exactly as it is, and Tech View and Board View are offered only on desktop (S1-R14). There is no phone/tablet design (UX-20), and a dedicated mobile effort starts in January, so mobile is left alone here. S9-N4 is removed since there is no board on mobile.

### inline thread 891715585 — Sasha Grosman, 2026-09-25T13:46 UTC · open
Anchored on: “S9-R2: Users with Work Orders view permission can reorder technician groups/columns.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891715585

Revisit with @Chris Ward@Sasha Grosman , directly depends on what level we save the ordering of the groups/columns

#### ↳ reply 891355166 (to 891715585) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891355166

Done in v18: S9-R2 now says group and column order is saved per user, as decided in kickoff part 2.

### inline thread 891781121 — Sasha Grosman, 2026-09-25T13:48 UTC · open
Anchored on: “User has Work Orders view permission and is in Tech View or Board View.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891781121

redundant, covered in different story

#### ↳ reply 891322380 (to 891781121) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891322380

Done in v18: removed from the Story 9 prerequisites.

### inline thread 891584514 — Sasha Grosman, 2026-09-25T13:48 UTC · open
Anchored on: “and the allowed statuses from Story 4.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891584514

can remove

#### ↳ reply 892370960 (to 891584514) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=892370960

Done in v18: "and the allowed statuses from Story 4" removed.

### inline thread 891813890 — Sasha Grosman, 2026-09-25T13:49 UTC · open
Anchored on: “order only within the pinned area.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891813890

Need UI help from @Branko Cicovic

#### ↳ reply 891846674 (to 891813890) — Chris Ward, 2026-09-25T20:32 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891846674

@Branko Cicovic need the UI for this one (S9-R9): pinned technicians can only be reordered within the pinned area. How should that look and behave while dragging?

### inline thread 891256835 — Sasha Grosman, 2026-09-25T13:52 UTC · open
Anchored on: “S9-R4: Append newly eligible technicians after existing unpinned technicians.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891256835

This means, when you create a new staff record that meets the criteria for a ‘technician’. describe the criteria (from earlier story)

#### ↳ reply 892403717 (to 891256835) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=892403717

Done in v18: S9-R4 now spells out the criteria (Clockable, Active, role neither Office nor Time Clock User, enrolled in the current location), with a new staff record as the example.

### inline thread 891912194 — Sasha Grosman, 2026-09-25T13:58 UTC · open
Anchored on: “S4-R19: A Schedule change does not change the work order lead technician.”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=891912194

@Chris Ward sanity check if it does or not, and decide if it should or not.

#### ↳ reply 892272646 (to 891912194) — Chris Ward, 2026-09-25T19:10 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=892272646

Checked the code: the Schedule reads the lead technician but never changes it, so moving or reassigning a shift does not change the lead today. Kept that way; S4-R19 now says so plainly (v18).

### inline thread 896368650 — Slavcho Mitrov, 2026-09-28T10:18 UTC · open
Anchored on: “Branko still owns the Tech View icon”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=896368650

@Branko Cicovic one design item for you (UX-1 / SQ-8): which icon should Tech View use in the display switcher? The board name is settled (Board View), so the Tech View icon is the only piece left. We need it before the switcher offers Tech View, which is late in the build, so there's no rush this week.

### inline thread 896040962 — Slavcho Mitrov, 2026-09-28T10:18 UTC · open
Anchored on: “Story 11: Keyboard access and focus — design questions to resolve”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=896040962

@Branko Cicovic Story 11 (UX-19 / SQ-15) is the largest design item still open. Tech View and Board View are now desktop only (S1-R14), so touch is out of scope. What we still need is keyboard and focus:

- how focus enters a card or row, and how you move between cards, groups and columns (S11-R1, R3)
- what Enter opens and what Escape cancels (S11-R4, R5)
- keyboard access to more-actions, pin/unpin and collapse/expand (S11-R2, R7, R8)
- keyboard reorder and reassignment (S11-R9)
- where focus goes after a dialog closes, and after the focused work order leaves the filter or its technician becomes inactive (S11-R6, E1, E2)

We can build both views without this; keyboard support comes last. When do you think you could have it?

### footer thread 896008228 — Branko Cicovic, 2026-09-28T12:07 UTC · open
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=896008228

Hey @Chris Ward , couple of updates:  
  
1.the muted look - There is no muted look, clicking assigned to me only shows groups of wo’s that are assigned to me. (It’s the same pattern as it is in the other views)  
2.empty-group wording - I believe this is referring to empty state for group without wo’s (Already covered in the design)  
3.column/page scrolling - Done.  
4.pinned-area reordering UI. - Done.  
  
fyi @Sasha Grosman

#### ↳ reply 902234113 (to 896008228) — Chris Ward, 2026-09-29T15:56 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=902234113

Thanks Branko, agreed. No muted look: with Assigned to me on, only the groups and columns that hold my work orders show, Unassigned included. Muted groups would have meant scrolling past every technician with nothing of mine. PRD updated (S2-R9, S3-N1).

One more design clean-up, all out per the PRD:

1. “Waiting on N parts” on cards
2. The Undo action on the reassignment toast
3. Hiding Unassigned when it has no work (it stays on screen as a drop target, except while Assigned to me is on)
4. The Details view
5. The Technician and Department filter chips

### footer thread 921108481 — Slavcho Mitrov, 2026-10-06T09:42 UTC · open
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=921108481

Hi @Chris Ward, six small things for drag and drop (Story 9) and Back restore that the PRD leaves open. We're building with the answer after each one, so a quick "OK" or a correction is enough:

1. **The shift prompt (S4-R11; UX-21 is still with Branko).** It shows only when the outgoing lead has a whole-work-order shift that hasn't ended, including when the lead is removed. Provisional wording:
    - Title: "Clear {Name}'s scheduled shifts?" (without a name: "Clear the lead technician's scheduled shifts?")
    - Text: "{Name} has shifts scheduled for this whole work order. Clearing removes shifts that haven't started and ends one that's under way now. Shifts on individual lines and recorded time don't change."
    - Buttons: "Keep shifts", "Clear shifts" and "Cancel".
    - Cancel (or the X) calls the change off: a dragged card goes back to where it was, and in the Reassign dialog you're back in the dialog with your choice kept.
2. **Where the prompt shows.** It shows on Board View and Tech View, both when dragging and in the Reassign dialog. Changing the lead on the work-order page or from the List doesn't ask, so it keeps today's behaviour there. Say if those should ask too.
3. **A reorder that doesn't save.** S4-N8's message is about changing the lead technician, so a failed reorder within one technician needs its own: **"Couldn't save the new order, please try again."** The card goes back to where it was.
4. **Two messages for a drag that can't be saved.** Both show in the alert, and the card goes back to where it was:
    - The card was dropped next to a work order that someone else has just moved: "The card you dropped this next to has moved. Refresh the board and try again."
    - Two people drop into the same technician at the same moment, and the second one has to wait too long: "The board is busy with another move. Please try again."
5. **"Drag a work order here to assign it"** on an empty column, as the design shows it. It isn't in the PRD, and S3-R20 fixes the empty-column text as "No work orders", so **we're leaving it out.** Say if you want it.
6. **Clicking "Work Orders" in the header while you're already on Board View or Tech View.** S1-R12 says every way into the page other than Back starts at the top-left. Clicking the header link from the board itself doesn't leave the page, though, so **it keeps your place**, just as it does on the List today. Coming from any other page (a work order, Schedule…) starts at the top-left. Say if the header link should also jump back to the top-left.

FYI @Branko Cicovic: for the Tech View icon (UX-1) we're using the one in your design file (user-round) unless you say otherwise. The design export from 2026-10-05 is identical to the one we've been building from since 2026-10-01.

#### ↳ reply 921174020 (to 921108481) — Chris Ward, 2026-10-06T13:46 UTC
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=921174020

Hi @Slavcho Mitrov, answers below. Build with these.

1. Shift prompt: lock your wording as written. Title "Clear {Name}'s scheduled shifts?" (no name: "Clear the lead technician's scheduled shifts?"), the text as you wrote it, buttons Keep shifts / Clear shifts / Cancel. Cancel undoes the move. We own this wording, not Branko.
2. Where it shows: Board View and Tech View only, both when dragging and in the Reassign dialog. The work order page and the List keep today's behavior.
3. Failed reorder: "Couldn't save the new order. Please try again." (two sentences, to match the others). The card goes back.
4. Both conflict messages: OK as written.
5. Empty column: "Drag a work order here to assign it", as the design shows, for users who can reassign work. Users who can view the board but can't reassign see "No work orders". The PRD is updated to say this (S3-R20).
6. Header "Work Orders" click while already on Board or Tech View: keep the user's place, as you have it.

Noted on the Tech View icon (user-round). The PRD is updated with all of the above.

#### ↳ reply 925204483 (to 921174020) — Slavcho Mitrov, 2026-10-07T14:12 UTC 🟡 7 Oct, before our capture
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=925204483

@Chris Ward A small follow-up on S3-R20, the "Drag a work order here to assign it" hint. The column of a technician who is no longer eligible (deactivated, or not enrolled at this location) only appears when someone has pinned them, and it can be empty. A drop there is refused with "This technician can't be assigned work orders.", because new assignments go to eligible technicians only (S3-R1, S4-R12). Read word for word, S3-R20 still shows the hint on that column, which invites a drop that then fails. Should that column say "No work orders" instead? We'd suggest it; it's a one-line change. For now it shows the hint, as written.

#### ↳ reply 924057650 (to 925204483) — Chris Ward, 2026-10-07T14:15 UTC 🟡 7 Oct, before our capture
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=924057650

@Slavcho Mitrov yes, “No work orders” on that column, for every user. The PRD now says so in S3-R20a (v41). The drag hint stays only on columns that can take a drop, for users who can reassign.

### footer thread 924221605 — Slavcho Mitrov, 2026-10-07T14:29 UTC · open 🟡 7 Oct, before our capture
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=924221605

@Chris Ward About [SV-9769](https://shopview.atlassian.net/browse/SV-9769), which you asked us to address inside this FS. On the Lines tab, a line that has technicians scheduled on it (from the Schedule) but no labour technician reads "Unassigned", while Edit Line lists the scheduled technicians.

This FS already counts scheduled technicians as the line's technicians: Board View cards and Tech View's Assigned Techs column show them (S7-R1), and they stay put when the lead changes (S4-R8). So after release a card can show someone as assigned while the Lines tab says that line is Unassigned.

We suggest the Lines row follows the same rule: show the scheduled technicians' names instead of "Unassigned", with no badge. SV-9486 removed the "Needs techs" badge because it fired on ordinary unassigned labour; this brings back names, not the badge. It's a small front-end change. OK to build it, or should the row stay about labour only (Nemanja's option 1)?

#### ↳ reply 924123169 (to 924221605) — Chris Ward, 2026-10-07T14:35 UTC 🟠 **7 Oct, after our v42 capture (14:33 UTC)**
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Board+View+Tech+View+Display+Options?focusedCommentId=924123169

@Slavcho Mitrov OK to build: the Lines row shows the scheduled technicians’ names in place of “Unassigned”, with no badge. A line with neither a labor nor a scheduled technician still reads “Unassigned”. It’s in the PRD as S7-R8 to S7-R10 (v42), and this closes SV-9769.

## Child 853901313 — every comment

### inline thread 858128392 — Branko Cicovic, 2026-09-15T11:33 UTC · open
Anchored on: “Inactive technician states”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions?focusedCommentId=858128392

Not sure what this one is for. If some tech is inactive/deactivated we do not show them in the grid/list.

#### ↳ reply 859176962 — Sasha Grosman, 2026-09-15T13:51 UTC

@Branko Cicovic let’s check, what happens if a lead tech is deactivated today? Are they auto-unassigned?

### inline thread 858128400 — Branko Cicovic, 2026-09-15T11:34 UTC · open
Anchored on: “Three shared pins and saved order”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions?focusedCommentId=858128400

We show max 5 pinned technician. Order is made per who you pinned first.

### inline thread 858652677 — Branko Cicovic, 2026-09-15T12:10 UTC · open
Anchored on: “Card defaults and missing-unit fallback”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions?focusedCommentId=858652677

This works as it should in the design.

### inline thread 858554374 — Branko Cicovic, 2026-09-15T12:13 UTC · open
Anchored on: “Reassign dialog semantics”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions?focusedCommentId=858554374

Not sure what is this about. I’d mark it obsolete.

### inline thread 857767960 — Branko Cicovic, 2026-09-15T12:17 UTC · open
Anchored on: “Implicit versus explicit line assignment indicator”
Link: https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions?focusedCommentId=857767960

Not sure about this one. We only assign/reassign lead techs here.

