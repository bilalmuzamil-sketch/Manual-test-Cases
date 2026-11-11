# How to file this ticket ONCE the QA lead has said yes to it himself (skill 06 route, proven 2026-09-10)

Not run by the preparing session. Nothing below has been executed.

1. Re-check on the build (skill 06 §6e): open A/R Aging Collection with only ZZAUTOTEST OVER100 C ticked, open the group, scroll past invoice 100. Still all 105 at once? Then continue; if it now loads 100 at a time, do NOT file - tell the QA lead.
2. Re-read SV-11531's status live (`jira.sh GET /rest/api/2/issue/SV-11531?fields=status`) - must be Ready for QA / TESTING QA / QA Complete (Rule 112).
3. Create (REST v2 takes wiki markup in `description`): payload
   `{"fields":{"project":{"key":"SV"},"issuetype":{"name":"Story Defect"},"parent":{"key":"SV-11531"},"priority":{"name":"Medium"},"labels":["QA_Found"],"summary":"Aging Reports – Open Customer or Vendor Loads Every Document at Once","description":"<the wiki block from TICKET.md>"}}`
   -> `bash build/atlassian-login/jira.sh POST /rest/api/2/issue /tmp/atlassian/create.json` (201, note the key).
4. Attach `PIC1-ar-collection.png` and `PIC2-ap-unpaid.png` (copies of the two files in PICTURES.txt, renamed) to `/rest/api/3/issue/<KEY>/attachments` (multipart, `X-Atlassian-Token: no-check`).
5. `PUT /rest/api/2/issue/<KEY>` with the same wiki description (so the `!PIC…!` references bind to the attachments), then `python3.12 build/testing-tools/size_pics.py <KEY> PIC1-ar-collection.png PIC2-ap-unpaid.png` and read back `full-width` (Rule 116).
6. Links: `POST /rest/api/2/issueLink` `{"type":{"name":"Relates"},"inwardIssue":{"key":"<KEY>"},"outwardIssue":{"key":"SV-11531"}}` (and the same with SV-11534 if wanted).
7. Read back `GET /rest/api/2/issue/<KEY>?expand=renderedFields&fields=summary,issuetype,parent,priority,issuelinks,description` - type Story Defect, parent SV-11531, Medium, Relates link present, two `<img`, zero `blob:`, no literal `h2.`/`{quote}`.
8. TestRail: follow RUN-COMMENT.md.
