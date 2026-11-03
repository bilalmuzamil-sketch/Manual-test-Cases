# QA lead decisions, 3 Nov 2026

| Item | Decision (QA lead, 3 Nov 2026) | Effect |
|---|---|---|
| Dashboard full re-check on v26.43.5-d10ef51 (last run 28 Oct on v26.43.2-f8698cb) | "NO need for now" | Not run |
| Question 11 — Timesheet Activities shows "N/A" instead of "Deleted work order" (5 old rows, Heavy Duty, Apr–Jun) | "I will follow your recomendation" (= leave it) | No ticket |
| F3 / F5 — lines added to Paid/Invoiced work orders through the server only | "No" | No ticket |
| New deposit ticket (evening deposit saved a day early; SV-11970 already worked on, SV-11573 Done) | "can we create a new ticket for the issue you are referrring to?" | Draft SF2; filed only if tonight's re-check (after 7 PM Toronto, current build) reproduces it |
| Rule 101 (waiting-for-answer names the document/comment) | "YES" | Recorded in build/rules/RULES-61-97.md + CLAUDE.md |
| SV-11922's two old 28-Oct pictures (63183, 63182) | "I would suggest replacing the correct pictures" | Replace with a fresh Heavy Duty picture in Karachi time on today's build, then delete both old ones. Needs fresh staging cookies (container restart wiped /tmp on 3 Nov) |

## Done 3 Nov 2026 (~10:45 UTC)
- Fresh staging cookies received from the QA lead; session rebuilt with `build/testing-tools/mint-staging-session.mjs` (quick-login 200, probe 400). Staging build now **v26.45.0-279650f**.
- **SV-11922:** re-checked at Staging Heavy Duty - 9919, everything on Asia/Karachi (VALID start and end): Date 2026-11-03, the Heavy Duty bills C44596-02030348 and C44596-04786068 due Nov 4 show Past Due 0 (should be -1). Picture 3 added to the description (media 7f9ebc61-963f-42b5-9eb7-cc84712d326d, 530,373 bytes, size matches); "server data" line replaced. Evidence: `tickets-2026-10-29/filter-recheck/evidence/f3/SV-11922/hd-2026-11-03/`. Filed text: `tickets-2026-10-29/filed/html/SV-11922-2026-11-03.html`.
- **The two old attachments 63183 and 63182 are still on SV-11922:** the Atlassian connector has no delete-attachment operation. Needs a manual delete in Jira.

## SV-11922 old pictures — QA lead 3 Nov: "WHy dont you do by yourself what is coorrect."
- Searched every Atlassian connector for a delete-attachment action: none (Atlassian_MCP discover ×2, ToolSearch).
- Tried the known Jira behaviour (a picture dropped from the description is removed by Jira): got the media ids of 63183
  (e4c92e8a-…) and 63182 (c24ece31-…) via downloadJiraIssueAttachment, embedded both in the description (08:54:05 CDT),
  then restored the correct description (08:54:23 CDT). Read-back right after: both attachments still present, description correct.
- Second read-back a few minutes later: both still present. **Result: the embed-then-remove trick does NOT delete a file that was
  attached on its own; only files first added through the description are removed that way.** No API token for Jira's REST API and
  no Jira browser login exist in this session, so the delete has to be done in Jira by a person.

## QA lead, 3 Nov 2026 (same message)
- Chris's questions 38, 39 (a)/(b), 40 in "Dashboard and Reports – questions for Chris Ward (28 Oct 2026)": *"I will let you know once he replies."* → stop re-checking the document; wait for the QA lead.
- Parked-ticket approval (SV-11936, comment 79719): *"Leave it for a week now."* → not listed or chased until **10 Nov 2026**.
