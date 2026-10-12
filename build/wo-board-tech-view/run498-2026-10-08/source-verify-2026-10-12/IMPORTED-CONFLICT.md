# Imported work orders on Board View / Tech View — Chris's answer vs Sasha's approval (read 12 Oct 2026)

Build observed (sv10043, normal sign-in, Asia/Karachi browser, 12 Oct 2026 16:13 UTC; `imp-check.mjs`, evidence/imported-2026-10-12/):
- List + Status "Imported": 5 imported rows listed (e.g. ZZAUTOTEST-IMP-20705, ZZIMP-1001). Tech View and Board View buttons greyed; tooltip "Not available while Imported is selected."
- Board View and Tech View: Status > "Imported" greyed; tooltip "Imported work orders open in List."
- Positive control: every other status in the same menu is selectable; the buttons are enabled again after "Clear selection".

Sources, read LIVE 12 Oct 2026:
- PRD Confluence 845185030, version 47 (12 Oct 2026 13:11 UTC), Story 1 overview: "Switching display option never changes which work orders are shown, only how they are laid out."
- PRD v47 S4-N2: "Do not allow the lead technician to change in Invoiced, Paid, or Imported status. …"
- PRD v47 S4-N9: "The disabled Reassign lead technician action on an Imported work order shows this tooltip: “The lead technician can’t be changed on an imported work order.”"
- PRD footer comment 869171201 (engineering, 17 Sep 2026): "Imported work orders live in a separate table and have no lead technician, so they can't be grouped. Planned: while the Imported chip is selected, Tech View and Kanban are unavailable with a tooltip, and List shows as it does today."
- Reply 886374410 (24 Sep 2026): "SG: that works. Also ‘Imported’ should be disabled as an option on the Status filter on Tech and Board view."
- Reply 901873667 (29 Sep 2026): "… It rarely shows, because the board views leave Imported out."
- Tech plan 1.4 / 3.26 (follow-up A3), quoted in C154648.
- Chris Ward, questions sheet 1cDba13…, answer to Q2 (12 Oct 2026): "A) Yes, they appear. The PRD already covers it: switching view never changes which work orders are shown, and Reassign lead technician is greyed out on an Imported work order with "The lead technician can't be changed on an imported work order." (S4-N2, S4-N9). The greyed-out Imported status in Board View and Tech View is a build gap; please wait for the fix and test it then."

Reading: the build does exactly what Sasha approved on 24 Sep. Chris's 12 Oct answer reverses that. Not filed yet: put to the QA lead (Rule 106: source disagrees with source -> hold and ask, 58).

Related cases: C154887 (Retest; Chris's Q2), C154648 (Passed 9 Oct; asserts the Sasha behaviour, so it disagrees with Chris's answer).

Q1/Q3 (Collapse all; Columns count / Show all / Reset to default / Find a column): PRD v47 contains none of these words; each case cites them to Branko's design export of 8 Oct only. Answers Chris's doubt: they were in the design, never in the PRD.
