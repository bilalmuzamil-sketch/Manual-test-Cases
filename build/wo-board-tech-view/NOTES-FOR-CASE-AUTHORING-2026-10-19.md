# Notes for the session that writes Work Orders Board / Tech View tests (from run 498, 19 Oct 2026)

These come from 14 tests that had to be reworded during run 498 on staging. Only the patterns that the writer
could have avoided are here. Tests changed only because the PRD itself changed later are left out on purpose.

**Nothing below changes where expected results come from: they still come from the PRD, the design and the
product owner's answers, never from what the build does.** The only things to take from the product are screen
names, buttons and how to get somewhere.

## Five habits

1. **The starting screen must be one the product actually offers.** Before naming a tab plus a filter, check that
   the filter is on that tab. The Work Orders page offers the Status filter on the **All** tab only (production
   too). Two tests started on the Work Orders tab with Status set, which no tester can set up.
   *(C96916, C368214)*

2. **Counts and lists in an expected result come from the PRD, never from a comment on a ticket.** Three analytics
   tests said Tech View has 15 optional columns because a developer's comment said so; PRD S2-R4 says "the same
   columns as List, plus the Assigned Techs column" = 17. *(C97024, C97035, C368153)*

3. **When the PRD says "same as List" or "as today", do not add a detail List does not have.** A test said
   "Clear all filters" empties the search; the PRD says Tech View and Board View keep List's clear-filter
   behaviour, and List keeps the search. If you need to name such a detail, look at what List does today on
   production. **If production differs from the PRD's own words, raise a question for the product owner instead of
   picking one.** (The PRD says a deleted lead shows blank "as today", but production shows "Unassigned"; the QA
   lead ruled "Unassigned".) *(C590122, C614711)*

4. **After a "try to do X" step whose result the PRD does not define, do not assume where things end up.** A test
   tried to drop a column before Unassigned and then expected one exact final order. The PRD only says
   Unassigned stays first. Have the tester **write down the order after the tries** and compare later steps with
   that. *(C97003)*

5. **Pick example records that the screen can reach.** The technician list on the work order page shows only the
   first ~98 names (alphabetical), so an example technician named "Ralph Edwards" cannot be picked there; use
   names that sort early, e.g. "Aaron Baker". *(C96936)*

## Facts about the product the steps must allow for (checked on staging and production, 19 Oct 2026)

- **Removing someone from a location** is done in Settings > Staff > the person's **Department(s)** button >
  **Manage staff enrollments** > bin icon next to the location. Changing the Location field in Edit Staff Member
  only changes their default; they stay at the old location. *(C368131)*
- **Closing the "New Customer Payment" window with its X right after Create Invoice takes the invoice back off**
  (the work order returns to Complete). To keep it Invoiced, leave that window open. *(C368167)*
- **After Escape on a card's More actions menu, keyboard focus stays on the button**, so it keeps showing until
  you click elsewhere. A step that checks the button disappears must include "click once on an empty part of the
  page". *(C96945)*

## Left out on purpose

- C96929, C590130: changed because the product owner later changed the PRD. Nothing the writer could have done.
- Anything about how my scripts measured things: that is my own tooling, not the writer's concern.
