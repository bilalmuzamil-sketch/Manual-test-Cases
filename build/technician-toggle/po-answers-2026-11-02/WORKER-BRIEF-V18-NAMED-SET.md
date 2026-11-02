# Worker brief: Technician Toggle named-set update to PRD v18 and Chris's answers (2 Nov 2026)

QA lead, 2 Nov 2026: "Named set (Recommended)" (Rule 122 amendment). You update the case library only: no TestRail, Jira, Slack or
Google writes, no commits. The coordinator reviews, runs the write scripts, reads back and commits.

## Sources (read in full)
- `po-answers-2026-11-02/ANSWERS-Chris-Ward-2026-11-02.md`: Chris's answers 1-8, word for word.
- `sources/CONFLUENCE-977371146-v18-2026-11-02.md` (PRD v18, 2 Nov 2026). Changed vs v17, verified by diff: S1-R3 (Save & Add Next
  sentence added), S1-R8 (role added), S1 Error Handling (second tab / stale window; "The Public API cannot set Technician, so it never
  gets these messages (S5-N1)."), S3-R10 (Unassigned / Deleted technician sentence), S3-N1 (picked person dropped from the filter), and
  the Change Log v18 row. Every other line is word for word v17.
- Design version 1793640819-ff4d: `design-2026-11-02/files-v1793640819/project/` NotATech.dc.html (page 3: new subtitle and the Time
  Clock caption now matches S1-R5), TurnOn.dc.html (page 2: new caption "Save & Add Next starts the next person fresh: …"),
  WorkOrder.dc.html (page 6: chip caption now matches S3-R8). All other design files and every screenshot are unchanged (sizes match).
- Stories re-read after Chris synced them (SV-11879, SV-11880, SV-11881, SV-11884 updated 2 Nov): `sources/JIRA-stories-S1-S2-S3-S6-2026-11-02-pm.md`.

## The named set (56; nothing outside it changes, not even version stamps)
- 50 from codes and holds (`po-answers-2026-11-02/named-50-from-codes.json`): every case tagged S1-R3, S1-R8, S3-R10, S3-N1 or EH-S1,
  and the 17 held on questions 1-8.
- 6 more that quote a changed design caption: D-26, S1-25, S3-09, S3-10, S3-21, S3-23 (plus S1-14, S1-16, S1-19, S3-08, S3-24-26, D-27
  already in the 50).
- **Delete D-33 and D-34** (design-version cases; Chris ruled for the PRD on questions 5 and 6): remove them from the library and list
  them in `po-answers-2026-11-02/DELETE.json` with their C-ids (C897374, C897375).
- Every case in the set is rewritten top to bottom (Rule 134): quotes re-copied from v18 ("From:" line: version 18 (2 Nov 2026, Chris
  Ward), read 2 Nov 2026), a "From:" line for Chris's answer where a case relies on it (sheet link, question number, 2 Nov 2026), design
  references to the new version and its new words, steps and results matching. Held cases on questions 1-8 are released (Rule 69
  marker), or rewritten to the answer. API-09 to API-11 become "accepted, value ignored" (S5-N1, answer 1); the refusal messages are
  reached through ShopView's own staff window in a second tab or a stale window (express as two browser tabs).
- Add a per-case version switch (as the Credit terms library did with `on_v5`): only the set quotes v18.

## New cases (only where no case in the set already covers it; extend instead of duplicating)
- S3-R10 / answer 3: the Technician filter's Unassigned and Deleted technician choices keep "No technicians yet" from showing; people
  picked at another location are dropped when the location changes.
- S3-N1 / answer 4: a person picked in the filter whose Technician is then turned off drops out of the filter on the next load; their
  work orders do not move.
- S1-R3 / answer 8: Save & Add Next starts the next person fresh (no role, Time Clock off, Technician off; an earlier hand switch is
  forgotten; the next person's Technician follows their own role).
- S1-R8 / answer 2: one save changing Technician and the role logs the person out (if not already covered by INV-13).
- S1 Error Handling: a second tab / stale staff window turning Technician on without Time Clock, and on an Office User or Time Clock
  User role, refused with each message; both reasons at once gives the role message.
Each new case gets a new key (next free number in its module), in the pattern, runnable by hand, with design references where a board shows it.

## Gates
`authoring/build.py` 0 PROBLEM lines; `tester_readiness_check.py build/technician-toggle --sample 5` 0 hard (read the sample and every
new "does not / never" line); a script proving every quote in the set is word for word in v18 and every mapped case outside the set
renders exactly like its read-back in `applied/C<id>-after.json`; `ticket_sweep` 0 unhandled with prd_version_handled 18; update
TICKET-LEDGER/TICKET-SWEEP, REPORT.md, the setup file, PO-QUESTIONS-DRAFT.md (questions 1-8 answered, with the answer each) and
DESIGN-DIVERGENCE-REGISTER.json (TT-D01, TT-D02, TT-D04, TT-D06 PO-RULED with the answer). Write an `authoring/update_changed.py`
(dry run by default; lock on the latest read-back, skip any case changed by someone else; Rule 138 guard) and report its plan, and
`create.py` dry run for the new cases.

## Final message (under 250 words)
Cases changed (keys), new keys, deleted keys, gate output, the two dry-run plans, anything you could not do.
