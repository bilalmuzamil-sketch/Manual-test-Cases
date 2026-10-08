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
- **8 Oct 2026, plainer wording (QA lead: "still … less friendly"):** each precondition now says what must exist, then names it. Steps are: open, approve, wait without refreshing, refresh. The expected results are renumbered to Steps 2, 3 and 4. The doc's Part 2 still says "test step 1 / test step 2" and is updated once the QA lead approves the wording.
- **8 Oct 2026, sixth amendment (PERMANENT, friendly phrasing):** doc v4 https://docs.google.com/document/d/1MrEUYh5KA0JD1QkiaN28zYhJXip4j0egjm_1BBgX7L8/edit is phrased the same way, and its Part 2 test steps 1–4 match the case. v3 (1ExEWr18…) is superseded and not trashed.
- **8 Oct 2026, QA lead "1. delete it":**
  - C425784 and its section 54276 were deleted; both are verified gone (get_case and get_section answer 400). The body is saved in `sv4802/C425784-final-before-delete.json`.
  - Moved to Drive trash: the superseded docs 16cCIn7F…, 1h92KV9d…, 1ZZE5wE_… (C96910) and 18wB2oHK…, 12puP022…, 1IKNq5uH…, 1ExEWr18… (SV-4802).
  - **Kept** as the reference layout: doc v4 1MrEUYh5… (named in Rule 117 and the handoff).
- **8 Oct 2026, QA lead ("Make a sample test case for this … https://shopview.atlassian.net/browse/SV-5294"):**
  - New sample **C433977** "Picking a Found part on a work order line completes without an error", in new section 55301 "ZZ - Layout samples (to be retired)" (top level). Not in any run. Display check RESULT OK.
  - Sources read in full: SV-5294 (OBSOLETE, duplicate of SV-5293), SV-5293 (Done; Expected "Part is picked"), SV-6952 (clone; Save & Close error; developer: Part Number and Description must be filled before Source). Expected results quote SV-5293 and SV-5294 verbatim.
  - Setup doc (Part 1 manual tester, Part 2 Claude session), in the public folder: https://docs.google.com/document/d/1-Y9ue-2HhusE9yR5k2cICF8o_OyDbR6tI4ptmjrmk8Q/edit
  - Body, script and doc source in `sv5294/`. A first add_case attempt answered 400 (the required automation fields were missing); the section it had already created is the one used.
