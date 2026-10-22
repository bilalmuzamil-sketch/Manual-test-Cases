# Test mode for a ticket: API or Conventional (Standing Rule 113)

QA lead, 22 Oct 2026, verbatim: *"whenever I give you a ticket, you must ask me if that ticket should be tested through API or the
conventional way. Conventional way= The testing rule and strategy based on which you are currently testing the tickets. If I select API =
That would mean that I want the Time to test to be heavily and significantly reduced while ensuring that to reduce the time to test you DO NOT
miss or SKIP anything while testing that ticket. Make the best plan for both and then let me know, make sure that you do not change anything
into the way you are currently testing the tickets because when I would say "Conventional way" you will start testing thetickets the SAME way
you test today, including the questions for technical section and Video you ask me before testing those tickets."*

## The ask (every new ticket, before testing starts)
Read the ticket (description + every comment) and the environment first, then give the QA lead **both plans** for that ticket and ask:
**API or Conventional?** Wait for the answer. A choice on one ticket is never a choice for the next.

## Conventional = exactly today's method, unchanged
Everything in CLAUDE.md as it stands: Rule 77's sequence, the recording question (Rule 104, voice-over asked only after a yes), the
technical-section question (Rule 84), production before (Rule 86), annotated before/after pictures for every UI check (Rules 64/73),
the variant matrix (Rule 96), the pre-post gate (Rule 72), one complete comment.

## API = the same checks, much less time — nothing skipped
What changes is **how** each check is observed, never **which** checks run.
- **Same checklist.** Build the full variant matrix from the ticket, the comments and the source documents exactly as in Conventional.
  Every row gets an observed result. The matrix is written down before testing and every cell is filled (Rules 50/91/96).
- **Read the app's state by machine instead of by eye.** One script per environment reads every value the check is about (API
  responses, computed styles, element geometry, text) for **all** matching elements at once, instead of opening each one and taking
  a picture. Set-up data is created through the API.
- **The screen still decides the verdict (Rule 89).** Anything the user does on a screen is still driven on the screen — the script
  clicks, drags and types through the real UI where the ticket is about the UI; only the reading is automated.
- **Production before, in one read** of the same values (Rule 86), diffed against the branch for **every** element (Rule 74).
- **Evidence, cut down to what proves it:** one annotated before/after picture per point that has a visible result, plus the full
  table of readings in the comment. No step-by-step picture sets.
- **No screen recording and no technical section** unless the QA lead asks for them on that ticket.
- **Same honesty:** anything that cannot be observed in either mode is named the same way (Rule 85), with who can close it.
- Everything else still applies: build marker read before and after, pre-post gate, human voice, PASSED only at 100%.
