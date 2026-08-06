# DELIBERATE-DECISIONS — Report Suite, 2026-08-06 second session

Standing Rule 46: every deliberate non-authoring, every case following a ruling over spec text, every HELD
item and every accepted imperfection is written down **before anyone asks**, with all six fields. An
undocumented deliberate omission is indistinguishable from a miss.

**Risk column, read honestly: HIGH does not mean we are wrong. It means that if this is raised publicly we
have a concession to make, not just an explanation.**

---

### 1 · Sales By Representative's 109 cases were not driven at all

- **Plain answer:** we ran out of session after finishing Sales By Customer and half of Work In Progress; Sales By Representative was not started.
- **Evidence:** 109 of its cases still carry `v3.4.1-3d03023` on 8/4/2026 in their own text, so each one says on itself that it has not been re-checked.
- **Affected cases:** all 109 SBR cases listed in `REMAINING.txt`.
- **Who closes it:** the next pass. Nothing blocks it.
- **Risk: HIGH.** It is the largest single block of outstanding work and it is untouched. There is no way to present that as anything other than incomplete.

### 2 · The second test login was not obtained, though it was authorised

- **Plain answer:** getting a second sign-in means rotating the one shared session on this estate, which would sign out any sibling worker mid-run, so it had to be last — and the session ended first.
- **Evidence:** `CHANGES-MADE-SESSION2.md` records that `switch-user` and `quick-login` were never called; `RECHECK-QUEUE.md` section A lists the 17 cases.
- **Affected cases:** C30098, C30099, C30100, C30101, C30109 (item 5), C43546, C43550, C43558, C39447, C30526, C30527, C30325, C30326, C30327, C30340, C30391, C30603, C30604.
- **Who closes it:** us, in a window when no sibling worker is live on `.qa.shopview.com`. No new access is needed.
- **Risk: HIGH.** The QA lead said "You should unblock yourself" and we did not.

### 3 · Sixteen Location-column cases stay on HOLD even though we now know what the build does

- **Plain answer:** four of the six descriptions state the rule both ways in the same document, so there is no single documented answer to test against — and picking one from the build would be inventing a requirement.
- **Evidence:** SBC S4-R12 versus S13-R4; WIP S4-R3 versus S7-R13; IV S7-R6 versus its own Key Decision; SBR S21-R7. Live behaviour recorded in `RECHECK-QUEUE.md` section D so whoever answers has the facts.
- **Affected cases:** C38912, C38916, C43550, C43551, C30577 and the eleven others already held from the 5 August pass.
- **Who closes it:** Chris Ward, Q5 in `QUESTIONS-FOR-CHRIS.md`. Probably a five-minute edit, since he has already decided — four requirements simply were not tidied up.
- **Risk: MEDIUM.** Holding is correct, but sixteen cases have now been held across three passes.

### 4 · Three unsourced assertions were REMOVED rather than rewritten to match the build

- **Plain answer:** where our own case claimed something no document supports, we deleted the claim and asked the product owner — we did not replace it with a description of what the product does.
- **Evidence:** C30096 (navigation group; S1-R1 is silent), C30114 and C30173 (a zeros totals line when nothing matches; no requirement covers it). Rules 42, 57 and 58.
- **Affected cases:** C30096, C30114, C30173.
- **Who closes it:** Chris Ward, Q1 and Q2.
- **Risk: LOW.** This is the rule working as intended. The cases are now weaker but honest, which is the correct trade.

### 5 · The 12 raw-markup cases keep their OLD build line

- **Plain answer:** we fixed how they are displayed, not what they say, so we left the date they were last checked alone. Claiming today's build would have been a false claim about a case we did not re-run.
- **Evidence:** all 12 still read `Last checked against build v3.4.1-3d03023 on 8/4/2026`; the conversion changed formatting only.
- **Affected cases:** C30451, C30456, C30457, C30460, C30487, C30490, C30491, C30493, C30519, C30522, C30526, C30528.
- **Who closes it:** the next pass that drives Work In Progress.
- **Risk: LOW.**

### 6 · 432 cases name a stale specification version in their References field

- **Plain answer:** the tester-facing lines are current on all but two cases, but the hidden traceability field still names older spec versions on 432 of the 476, and we did not sweep it.
- **Evidence:** IV `spec v3` on 64 cases, PV v4 on 61, SBC v13 on 78, SBR v15 on 105, TU v5 on 57, WIP v6 on 67 — against live versions 4, 5, 15, 17, 6, 9.
- **Affected cases:** 432 of 476.
- **Who closes it:** an authorised metadata sweep. `refs` was not written on any operation in this pass.
- **Risk: MEDIUM.** Standing Rule 42 relies on that version pin to connect a closed list to the requirement that invalidates it, so it is not cosmetic.

### 7 · No already-filed ticket was edited, including three we know could be improved

- **Plain answer:** the QA lead is retrofitting source blocks across the tickets in one pass, and a second writer editing the same tickets would collide with him.
- **Evidence:** SV-8956's real cause is the front end discarding the server's correct file name; SV-8937 is PDF-only and wider than Parts Velocity. Both written up in `FINDINGS-SESSION2.md`, neither added to the ticket.
- **Affected cases:** none directly; the tickets are SV-8956 and SV-8937.
- **Who closes it:** the QA lead, when his retrofit pass reaches them.
- **Risk: LOW.** The information is recorded and findable.

### 8 · Nine defects were filed without waiting for authorisation

- **Plain answer:** the standing authorisation to file defects as they are found is in force; a mid-session instruction to stop was retracted by the QA lead the same hour and was never in effect.
- **Evidence:** his words, *"I take everything back which I said before… Do not take any action or change anything based on the above which I said to you earlier."*
- **Affected cases:** the 11 SBC and 6 WIP cases now marked EXPECT-FAIL against SV-8962…SV-8970.
- **Who closes it:** nothing to close. Each ticket carries its source block and 11 verified fields.
- **Risk: LOW.**

### 9 · The EN-dash-versus-em-dash difference was not filed

- **Plain answer:** it is a single wrong character on a heading line that already carries a real fault, so a second ticket would be noise — and folding it into somebody else's ticket is not ours to do.
- **Evidence:** the PDF heading uses U+2013; `S15-R11` asks for an em dash and gives an em-dash example.
- **Affected cases:** C30167, which is already EXPECT-FAIL against SV-8937 for the wrong end date on the same line.
- **Who closes it:** the QA lead — fold into SV-8937, file separately, or drop. Our recommendation: fold in.
- **Risk: LOW.**

### 10 · The 366-day cap is held, not passed, even though the back end enforces it

- **Plain answer:** the requirement is about the calendar preventing the selection, and we could not drive the calendar that far from this harness — so we proved the back end refuses it and held the on-screen half.
- **Evidence:** 367 days → HTTP 400 "Date range cannot exceed 366 days."; exactly 366 → HTTP 200. The calendar navigation did not produce a range wider than six days.
- **Affected cases:** C30104, now `AUTOMATION: HOLD` with that exact reason.
- **Who closes it:** a pass that can drive the calendar, or a decision that the back-end refusal is enough.
- **Risk: LOW.** Holding is more honest than passing on the wrong half.
