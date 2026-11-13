# Pitfalls to avoid

Each item is a mistake that has happened while writing suites, and what to do instead.

| # | Pitfall | Do this instead |
|---|---|---|
| 1 | Design cases covered the design's words but not its look (icons, sizes, spacing, panels, cell styles, tooltip position, default columns), so visual defects went uncaught | One "looks as in the design" case per screen and state, compared with the board picture; a visual inventory beside the text inventory; design-library rules are in scope |
| 2 | The design was checked one way only (design → cases), so behaviour the design showed but the PRD lacked (a missing list row, a missing confirm button) had no case and no question | Check both directions: design → cases and PRD → design. List every dialog and menu row by row |
| 3 | A label differed only in capital letters between design and PRD and the check ignored case | Compare labels letter for letter, capitals included |
| 4 | A case was edited only where the change prompted it, leaving other parts out of date | Rewrite the whole case top to bottom on any change, and record CHANGED/CONFIRMED per part |
| 5 | Steps bundled two or three actions, so a failure could not be pinned to one | One action per step |
| 6 | Long cases bundled independent checks, so one failure hid the others | Split when each part can run on its own; fold read-only steps into the previous result |
| 7 | Preconditions were pasted from a shared block and named records the case never used | Every precondition is used by a step or result, or says why it is needed |
| 8 | Cases asked the tester to "ask" someone for things the tester can obtain | Write plainly what must exist or be available |
| 9 | Gates were all green, but a read of the cases found some a tester could not act on | Always read a random sample and every negative result in full; gates check words, not meaning |
| 10 | Cases a tester could not set up (forced failures, huge data volumes, records no screen produces) were in manual runs | Keep them out of the manual suite, on a "not testable by hand" list; search for them by meaning, not one phrase |
| 11 | "Nothing appears" results passed even when the action never ran | Give every negative result a visible control |
| 12 | Results said "looks native" or "the same style" | Say what is seen |
| 13 | A model case from the suite owner differed from the rolled-out format in one line, found only after rollout | Compare every part of the format with the model case before rollout and ask about any difference |
| 14 | A check compared a draft with a read-back but treated the two sides differently, and reported false changes | Treat both sides alike; re-run checks after every write |
| 15 | Half of a batch of product-owner questions were already settled by a source, untestable, or for another owner | Run the eight checks in `checks-before-writing.md` §2 on every question, and again on the merged list |
| 16 | The PRD and design were republished while a draft was being prepared, after the first source check | Re-check every source's version immediately before writing; if anything moved, update first |
| 17 | Cases quoted a "before" or "as today" behaviour with nothing the tester could compare against | Give a visible baseline in the case, or capture one beforehand on a "Run on Production After Release" case |
| 18 | A waiting loop matched its own command line and never ended, so queued work silently never started | Wait on a process id, not on a text pattern, and confirm a queued job actually started |
| 19 | Long-name test data always had spaces, so it wrapped neatly; a long name with no spaces later overlapped the next row of a filter list and pushed columns off screen | Wherever typed text shows (chip, list row, group row, table row, print, export), test a long name with spaces, a long name with no spaces, and special characters (& " ' < >) |
| 20 | Table columns moved when a group was opened or closed; the design's own pictures of the two states already showed it, but each picture was only compared with its own screen | Give every state change (open/close a group, Expand/Collapse all, sort, filter, more rows loading) a before-and-after check that headings and columns stay put; compare the design's pictures of each state with each other and ask when something moves |

## TestRail notes

- `get_cases`, `get_sections` and `get_tests` are paged (250 per page). Always follow the paging; an unpaged read silently
  misses data.
- **Test runs: union only.** `update_run` with a `case_ids` list that misses a case removes that test and its results. Read
  the run's current cases first and send the union.
- After adding cases to a run, check that every test is assigned to the right person. Setting the run's assignee to none
  and then back to the person passes it on to new tests.
- `move_cases_to_section/{destination_section_id}` with `{"suite_id": …, "case_ids": […]}`. The path takes the
  **destination section id**, not the suite id. The reply body is empty, so handle an empty reply and confirm by reading
  each case's `section_id` back.
- `delete_case` and `delete_section` also reply with an empty body. A repeat call answers 400; confirm a delete by reading
  the case back (it answers "not found").
- An attachment linked to a closed run cannot be deleted. The API answers 200 with an error message in the body, so read
  the body. Tell testers in the case to ignore an outdated picture you cannot remove.
- `refs` must be under 250 characters.
- Send special characters as HTML entities where needed (a check mark as `&#10003;`), and read back to confirm.
- Never change a case flagged as Automated, or a case someone else created, without that owner's agreement.
