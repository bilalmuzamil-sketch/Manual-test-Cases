# Ticket footers (Rule 126 point 10), 14 Oct 2026, night
QA lead: "each ticket should mention the test case related to that Design issue at the bottom of the ticket description after a line break."
13 tickets edited (description only: original body unchanged + a divider + "Test case(s) for this design issue:" list with C-id links).
Map: ../ticket-footers.json. Each edit's response was read back: original text identical, footer present.
- Chris Ward's 10 (SV-11317…SV-11326): plain text bodies, written as Markdown. Exact pre-edit text = ../TICKETS-SV-11317-to-11326.md
  (fetched this morning; re-fetched before the edit and unchanged) and SV-11322-before.md.
- Ahtasham Amjad's 3 (SV-11336, SV-11337, SV-11338): bodies hold inline media (a video and two screenshots). Markdown would drop
  them, so they were read and written as lossless HTML with the Atlassian_MCP connector (getJiraIssue responseContentFormat=html,
  editJiraIssue contentFormat=html). Media ids unchanged after the write: 57b88464… (SV-11336), 21516a2d… (SV-11337),
  5121ac2b… (SV-11338). Pre-edit HTML: SV-11338-before.html (SV-11336/11337 pre-edit HTML is the same body minus the footer,
  as returned in the edit response).
- 2026-10-16: SV-11318 and SV-11320 before-copies (description as fetched in HTML on 16 Oct 08:10 UTC) before moving the test-case footer back to the bottom.
- 2026-10-16: SV-11416 before-copy (HTML as fetched 16 Oct ~16:00 UTC) before adding the C614711 footer (QA lead: "if that is a correct approach then do it").
- SV-11416: before-copy = the current description minus the trailing '<hr><p><strong>Test case for this issue:</strong>…' footer (media id 129ec098… unchanged after the write, read back 16 Oct 16:10 UTC).
