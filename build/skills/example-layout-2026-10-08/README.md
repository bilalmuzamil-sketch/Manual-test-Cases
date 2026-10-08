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

**Update 8 Oct 2026 (QA lead):** every expected result starts with the step it belongs to ("Step N:").
- C425783 now reads: Step 2 (opens in List) · Step 2 (List highlighted) · Step 3 (still List after refresh).
- Source, quotes and marker are unchanged (checked).
- Display check OK.
- The setup doc moved into the public-folder Drive folder 1zdj0d1RqpI1julHfiPPhTgDR_iUAKj3e (8 Oct). The pattern was recorded PERMANENT as the third Rule 117 amendment of 8 Oct.
- **8 Oct 2026:**
  - C425783 deleted on the QA lead's instruction ("reture the previous test sample case"). Its full body is in `C425783-final-before-delete.json`; it was in no run.
  - New example: **C425784**, the SV-4802 regression, in section 54276 "ZZ - Layout samples (to be retired)", with its Claude doc https://docs.google.com/document/d/18wB2oHKhUYBvrWy2Kq-OCtGdmJoeRjkDRkD3zSNbBaM/edit (in the public-folder Drive folder).
- **8 Oct 2026, QA lead:** removed the "Needs:" line and the "Build: the build named in the test run" line from C425784's Preconditions.
  - Asked one-time or permanent; answer: **"This case only"**. The standard is unchanged: the Needs line still opens Preconditions in every other case (Rule 117, second amendment).
  - Before and after snapshots are in `sv4802/`.
- **8 Oct 2026, fourth amendment (PERMANENT):**
  - C425784's Preconditions now hold the link "Setup (manual QA tester and Claude session)" and five complete precondition lines. There is no Setup block in TestRail.
  - New combined doc, with Part 1 for the manual tester and Part 2 for Claude: https://docs.google.com/document/d/12puP022sjAh3-LgkvogjaYw-WnT4hI62uR1K4HrfkxY/edit
  - The earlier Claude-only doc 18wB2oHK… is superseded and not trashed.
  - Steps and expected results are unchanged; the display check is OK.
- **8 Oct 2026, fifth amendment (PERMANENT):**
  - C425784 now uses {Location}, {Part}, {Work order} and {Line}, with "(for example …)" on every example value.
  - New doc v2: https://docs.google.com/document/d/1IKNq5uHgWp7oSRWEJrI678wZ89_FewPRWtmATFqYHDM/edit
  - Superseded docs, not trashed: 12puP022… and 18wB2oHK….
  - Source, quotes and marker are unchanged; the display check is OK.
- **8 Oct 2026, doc v3:** the API ids in Part 2 are now defined brace names; the case links to https://docs.google.com/document/d/1ExEWr18ID9Iktvy9USwZi9Zfe7jb-FymUxSQ2hbY5Ns/edit. v2 (1IKNq5uH…) is superseded and not trashed.
