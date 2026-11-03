# QA lead decisions, 3 Nov 2026

| Item | Decision (QA lead, 3 Nov 2026) | Effect |
|---|---|---|
| Dashboard full re-check on v26.43.5-d10ef51 (last run 28 Oct on v26.43.2-f8698cb) | "NO need for now" | Not run |
| Question 11 — Timesheet Activities shows "N/A" instead of "Deleted work order" (5 old rows, Heavy Duty, Apr–Jun) | "I will follow your recomendation" (= leave it) | No ticket |
| F3 / F5 — lines added to Paid/Invoiced work orders through the server only | "No" | No ticket |
| New deposit ticket (evening deposit saved a day early; SV-11970 already worked on, SV-11573 Done) | "can we create a new ticket for the issue you are referrring to?" | Draft SF2; filed only if tonight's re-check (after 7 PM Toronto, current build) reproduces it |
| Rule 101 (waiting-for-answer names the document/comment) | "YES" | Recorded in build/rules/RULES-61-97.md + CLAUDE.md |
| SV-11922's two old 28-Oct pictures (63183, 63182) | "I would suggest replacing the correct pictures" | Replace with a fresh Heavy Duty picture in Karachi time on today's build, then delete both old ones. Needs fresh staging cookies (container restart wiped /tmp on 3 Nov) |
