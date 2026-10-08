# Example: the two-audience case layout (QA lead, 8 Oct 2026). A DRAFT for review, not yet the standard.

**QA lead's direction (8 Oct 2026):**
1. One Google Doc per test case, titled "Setup for Claude session".
   - Viewable by anyone with an @shopview.com address.
   - Holds everything a Claude session needs to prepare and run the test without rediscovering anything.
2. A manual QA tester must NOT need that doc to understand and run the case.
3. Expected results, and everything below them, stay exactly as today.
4. The doc is linked at the top of the Preconditions field as "Setup for claude session". After a line break come the Preconditions and Setup written for the manual QA tester.

**Example artefacts:**
- TestRail **C425783** "EXAMPLE LAYOUT - A user who never chose a display sees List".
  - Section 13236; NOT in run 498.
  - It is a copy of C96910. Expected results are byte-identical to C96910's.
  - Display check: RESULT OK.
  - To be retired once reviewed.
- Claude setup doc: https://docs.google.com/document/d/1ZZE5wE_8YDYugVmM6QGFavU-blJjUWoJZAdk7VSaTtQ/edit
- Earlier drafts, superseded, not trashed:
  - v1 https://docs.google.com/document/d/16cCIn7FdUfr6V9Tf8CulXcreUNC_JDF9tieYLoelB5w/edit
  - v2 https://docs.google.com/document/d/1h92KV9dBUO91qoZIdPwkQf-IBqFQSsqYFxGJYVckhG8/edit

**Not done:** the domain-wide sharing. The Drive connector shares only with a named person or group address, so the QA lead sets "General access: ShopView, anyone with the link", or gives a group address.
