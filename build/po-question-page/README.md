# PO question page (preview, 16 Nov 2026)

A reusable question page to replace the colour-coded Google Sheet, built on the QA lead's request ("make our artifact free of the
weaknesses ... better or equal to the spreadsheet ... if not I will stick with google sheet").

- Page: https://claude.ai/artifact/6sDXCxNuVKN4YsNSkj3gsJ (private preview; the 31 Tiered Pricing questions, which were sent to Matt
  in the Google Sheet, so answers here are not used).
- Source: index.html (generic: title, people and questions come from the page's database, so one page serves any project).
- Data: questions/<qNN> (question, options, suggested option and why, what we know today, where we found it, design pictures,
  number of tests waiting), meta/page (title, for whom, sent date, intro, preview note). Seed files in seed/.
- Answers: answers/<person id>/log/<auto id> = {q, n, choice, note, by, at}. Append-only: each person writes only under their own id,
  nobody (only the owner) can change someone else's entry, a changed mind is a new entry, the latest is the answer, earlier ones show as
  history. Claude reads them with ArtifactData.
- Access rules: questions and meta read by everyone who can open the page, written only by Editors/owner; answers read by everyone,
  each person writes their own. Who can answer is set in the page's Share menu: the PO and QA people as Contributor, the organization as
  Viewer.
- Checked 16 Nov 2026: a Viewer reads the questions; a Contributor cannot change a question (refused). Saving an answer as a person was
  not exercised (needs a real viewer).
