

========== C154707 · section 20461 (S1 The Work Order Line Dialog)
TITLE: New Line labels its fields Title and Description, with question hints
--- PRECONDITIONS (TestRail)
- You are signed in as a service writer on the build under test, with a work order open.
--- STEPS
- Click New Line to open the line dialog.
- Read the label of the first free-text field and the second.
- With both boxes empty, read the placeholder text inside each.
- Type a value in each box (e.g. Title "Replace tie rod", Description "excessive play") and watch the placeholder.
--- EXPECTED
Expected results
- The first field is labelled exactly "Title" and the second exactly "Description".
- While empty, the Title box shows the placeholder "What are you doing?" and the Description box shows "Why are you doing it?"; each placeholder disappears as soon as the box has a value.
Source - where this behaviour comes from
Epic SV-9667; story SV-10130 (S1, The Work Order Line Dialog); "What Are You Doing / Why Are You Doing It?" PRD (Confluence 845348896, Locked for build 2026-09-16), Story 1; design boards saved_resource(2)/(5); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S1-R1: “The first field is labeled exactly "Title".”
- S1-R2: “The second field is labeled exactly "Description".”
- S1-R3: “The Title box carries the placeholder "What are you doing?" and the Description box carries "Why are you doing it?". Placeholder text shows while the box is empty and disappears as soon as there is a value.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
(no setup doc; the setup is in the preconditions above)


========== C154708 · section 20461 (S1 The Work Order Line Dialog)
TITLE: The Title label stays put, and the canned line picker is labelled Title
--- PRECONDITIONS (TestRail)
- You are signed in as a service writer on the build under test, with a work order open.
--- STEPS
- Open New Line and note that the dialog puts the cursor in the canned-line picker at the top on open.
- Read the picker's label and the placeholder in its typeahead box before typing.
- Pick or type a canned line (e.g. "Replace - Brake pot"), then clear it.
- Watch the Title label as the picker goes from empty to filled and back.
--- EXPECTED
Expected results
- The canned-line picker is labelled "Title" and carries the placeholder "What are you doing?" in its typeahead box; the dialog focuses this field on open, so the placeholder shows the moment the dialog appears and clears as soon as the user types or picks a canned line.
- The label reads "Title" whether the picker is empty or filled - it never swaps between the question and "Title".
Source - where this behaviour comes from
Epic SV-9667; story SV-10130 (S1, The Work Order Line Dialog); "What Are You Doing / Why Are You Doing It?" PRD (Confluence 845348896, Locked for build 2026-09-16), Story 1; design boards saved_resource(2)/(5); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S1-R4: “The label does not change with the state of the field. It reads "Title" whether the canned-line picker is empty or filled, which replaces a rule that swapped the label between the question and "Title" depending on that state.”
- S1-R5: “The canned-line picker at the top of the dialog is labeled "Title" and carries the placeholder "What are you doing?" in its typeahead box, the same as the free-text Title field. The dialog focuses this field on open, so the placeholder is visible the moment the dialog appears and clears as soon as the user types or picks a canned line.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
(no setup doc; the setup is in the preconditions above)


========== C154709 · section 20461 (S1 The Work Order Line Dialog)
TITLE: An empty Title blocks saving with "Title is a required field"
--- PRECONDITIONS (TestRail)
- You are signed in as a service writer on the build under test, with a work order open.
--- STEPS
- Open New Line, leave the Title empty, fill anything else, and try to save.
- Read the validation message.
--- EXPECTED
Expected results
- Leaving Title empty blocks the save with the message "Title is a required field" (replacing the old "Line Name is a required field"), in the same "X is a required field" form the rest of the app uses.
Source - where this behaviour comes from
Epic SV-9667; story SV-10130 (S1, The Work Order Line Dialog); "What Are You Doing / Why Are You Doing It?" PRD (Confluence 845348896, Locked for build 2026-09-16), Story 1; design boards saved_resource(2)/(5); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S1-R6: “Leaving Title empty blocks the save with the message "Title is a required field", replacing "Line Name is a required field". Every required-field message in the app uses the "X is a required field" form, and this one keeps it.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
(no setup doc; the setup is in the preconditions above)


========== C154710 · section 20461 (S1 The Work Order Line Dialog)
TITLE: Nothing else in the New Line window changes, existing lines stay as they are
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a service writer on the build under test, with a work order open.
- The previously seeded line: a work order line (Title for example "Replace tie rod", Description for example "excessive play", Tech Story for example "Both outer ends worn, replaced and aligned"); its saved title, description and tech story are recorded.
--- STEPS
- Compare the New Line and Edit Line dialogs to today: field set, field order, validation, buttons (Save & Add Part / Save & Add Line / Save & Close / Delete), technician and labor rows.
- Open the previously seeded line in Edit Line and read its saved values.
--- EXPECTED
Expected results
- Nothing else about the dialog changes - the same fields in the same order, the same validation and the same values saved; only the two labels and two placeholders differ.
- No existing line is altered: the seeded line keeps the exact title, description and tech story it was saved with (the rename is on the labels, not on the data).
Source - where this behaviour comes from
Epic SV-9667; story SV-10130 (S1, The Work Order Line Dialog); "What Are You Doing / Why Are You Doing It?" PRD (Confluence 845348896, Locked for build 2026-09-16), Story 1; design boards saved_resource(2)/(5); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S1-R7: “Nothing else about the dialog changes: same fields in the same order, same validation, same values saved.”
- S1-N1: “No existing line is altered. The rename is on the labels, not on the data.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Nothing else in the New Line window changes, existing lines stay as they are
Test case: C154710, FM - What/Why. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a service writer on the build under test, with a work order open.
- The previously seeded line: a work order line (Title for example "Replace tie rod", Description for example "excessive play", Tech Story for example "Both outer ends worn, replaced and aligned"); its saved title, description and tech story are recorded.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a service writer on the build under test, with a work order open.
- Seed a work order line: on the work order click New Line, type a Title (e.g. "Replace tie rod"), a Description (e.g. "excessive play") and a Tech Story (e.g. "Both outer ends worn, replaced and aligned"), and Save & Close. Record its saved title, description and tech story.



========== C154711 · section 20462 (S2 The ShopCoach Line Builder)
TITLE: The ShopCoach line builder labels its fields Title and Description too
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a service writer on the build under test, with a work order open.
- The AI ShopCoach line builder is open (from the line dialog).
--- STEPS
- Read the labels of the builder's two text fields.
- With both empty, read the placeholder in each.
--- EXPECTED
Expected results
- The line builder's two text fields are labelled "Title" and "Description".
- Both carry the same placeholders as the dialog: "What are you doing?" on Title and "Why are you doing it?" on Description.
Source - where this behaviour comes from
Epic SV-9667; story SV-10131 (S2, The ShopCoach Line Builder); PRD (Confluence 845348896), Story 2; design board saved_resource(2); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S2-R1: “The line builder's two text fields are labeled "Title" and "Description".”
- S2-R2: “Both carry the same placeholders as S1-R3.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: The ShopCoach line builder labels its fields Title and Description too
Test case: C154711, FM - What/Why. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a service writer on the build under test, with a work order open.
- The AI ShopCoach line builder is open (from the line dialog).
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a service writer on the build under test, with a work order open.
- Open the AI ShopCoach line builder from the line dialog.



========== C154712 · section 20462 (S2 The ShopCoach Line Builder)
TITLE: ShopCoach still generates the same text, and the line works like any other
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a service writer on the build under test, with a work order open.
- The AI ShopCoach line builder is open.
--- STEPS
- Have ShopCoach generate a line and write it into the work order.
- Compare the generated title, description and narrative to what ShopCoach produced before this change.
- Invoice the line and confirm it follows the Story 3 line-text rules like any other line.
--- EXPECTED
Expected results
- What ShopCoach generates and writes into a line is unchanged; a generated line becomes an ordinary work order line and follows Story 3 (the QuickBooks line-text rules) like any other.
Source - where this behaviour comes from
Epic SV-9667; story SV-10131 (S2, The ShopCoach Line Builder); PRD (Confluence 845348896), Story 2; design board saved_resource(2); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S2-R3: “What ShopCoach generates and writes into a line is unchanged. A generated line becomes an ordinary work order line and follows Story 3 like any other.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: ShopCoach still generates the same text, and the line works like any other
Test case: C154712, FM - What/Why. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a service writer on the build under test, with a work order open.
- The AI ShopCoach line builder is open.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a service writer on the build under test, with a work order open.
- Open the AI ShopCoach line builder.



========== C154713 · section 20463 (S3 What Reaches QuickBooks)
TITLE: Invoice line text joins the three parts with spaced hyphens, no labels
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a service writer on the build under test, with a work order open.
- A work order line (Title for example "Replace tie rod", Description for example "excessive play", Tech Story for example "Both outer ends worn, replaced and aligned").
- Complete and invoice the work order so a Customer Invoice exists (e.g. work order S2-17578).
--- STEPS
- To read the line text a customer/bookkeeper sees: open Export Reports, choose the Customer Invoice report and download it (requires "Invoicing & payments - View"); read the Description column.
- Read the line's text in the Description column against the three values you entered.
- Check the separator between segments character by character; look for any field names or semicolons.
--- EXPECTED
Expected results
- The line's text reads the title, the description and the technician's narrative joined by a spaced hyphen with no labels, e.g. "Replace tie rod - excessive play - Both outer ends worn, replaced and aligned".
- The separator is exactly one space, one hyphen-minus, one space; the narrative is the third and last segment, carries no label of any kind, and no semicolon appears anywhere in the line text.
Source - where this behaviour comes from
Epic SV-9667; story SV-10132 (S3, What Reaches QuickBooks); PRD (Confluence 845348896), Story 3; design board saved_resource(3); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R1: “A line's text joins the title, the description and the technician's narrative with a spaced hyphen and no labels: "Replace tie rod - excessive play - Both outer ends worn, replaced and aligned".”
- S3-R2: “The separator is exactly one space, one hyphen-minus, one space.”
- S3-R5: “The technician's narrative is the third and last segment. It carries no label of any kind, and no semicolon appears anywhere in the line text. The reasoning is in §2.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Invoice line text joins the three parts with spaced hyphens, no labels
Test case: C154713, FM - What/Why. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a service writer on the build under test, with a work order open.
- A work order line (Title for example "Replace tie rod", Description for example "excessive play", Tech Story for example "Both outer ends worn, replaced and aligned").
- Complete and invoice the work order so a Customer Invoice exists (e.g. work order S2-17578).
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a service writer on the build under test, with a work order open.
- Seed a work order line: on the work order click New Line, type a Title (e.g. "Replace tie rod"), a Description (e.g. "excessive play") and a Tech Story (e.g. "Both outer ends worn, replaced and aligned"), and Save & Close.
- Complete and invoice the work order so a Customer Invoice exists (e.g. work order S2-17578).



========== C154714 · section 20463 (S3 What Reaches QuickBooks)
TITLE: A hyphen appears only between two filled-in parts of the line text
--- PRECONDITIONS (TestRail)
- You are signed in as a service writer on the build under test, with a work order open.
- Seed three lines and invoice them: (a) title only (e.g. "Oil change", no description, no tech story); (b) title + description, no tech story; (c) title + tech story, no description (e.g. "Replace tie rod" + "Both outer ends worn, replaced and aligned").
--- STEPS
- To read the line text a customer/bookkeeper sees: open Export Reports, choose the Customer Invoice report and download it (requires "Invoicing & payments - View"); read the Description column.
- Read each of the three lines' text in the Description column.
- For line (c), count the separators and look for any gap where the description would be.
--- EXPECTED
Expected results
- A separator appears only between two segments that are both present: a title-only line carries the title alone; a title+description line ends after the description (no trailing separator, no trailing space).
- A line with a title, no description and a narrative reads "Replace tie rod - Both outer ends worn, replaced and aligned" - one separator, not two, and no gap where the description would have been.
Source - where this behaviour comes from
Epic SV-9667; story SV-10132 (S3, What Reaches QuickBooks); PRD (Confluence 845348896), Story 3; design board saved_resource(3); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R3: “A separator appears only between two segments that are both present. A line with no description joins the title straight to the narrative. A line with no narrative ends after the description. A line with neither carries the title alone. In every case there is no trailing separator and no trailing space.”
- S3-E1: “A line with a title, no description and a narrative reads "Replace tie rod - Both outer ends worn, replaced and aligned": one separator, not two, and no gap where the description would have been.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
(no setup doc; the setup is in the preconditions above)


========== C154715 · section 20463 (S3 What Reaches QuickBooks)
TITLE: The QuickBooks sync and the downloaded report show the same line text
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a service writer on the build under test, with a work order open.
- A work order line (Title for example "Replace tie rod", Description for example "excessive play", Tech Story for example "Both outer ends worn, replaced and aligned").
- Complete and invoice the work order so a Customer Invoice exists (e.g. work order S2-17578).
- The shop has an active QuickBooks Online connection so the invoice also syncs.
--- STEPS
- Read the synced line text in QuickBooks Online for the invoice.
- To read the line text a customer/bookkeeper sees: open Export Reports, choose the Customer Invoice report and download it (requires "Invoicing & payments - View"); read the Description column.
- Compare the two, character for character, for the same line.
--- EXPECTED
Expected results
- The same text is used by the live QuickBooks sync and by the downloadable Customer Invoice report - the two never show different text for the same line.
Source - where this behaviour comes from
Epic SV-9667; story SV-10132 (S3, What Reaches QuickBooks); PRD (Confluence 845348896), Story 3; design board saved_resource(3); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R4: “The same text is used by the live QuickBooks sync and by the downloadable Customer Invoice report. The two can never show different text for the same line.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: The QuickBooks sync and the downloaded report show the same line text
Test case: C154715, FM - What/Why. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a service writer on the build under test, with a work order open.
- A work order line (Title for example "Replace tie rod", Description for example "excessive play", Tech Story for example "Both outer ends worn, replaced and aligned").
- Complete and invoice the work order so a Customer Invoice exists (e.g. work order S2-17578).
- The shop has an active QuickBooks Online connection so the invoice also syncs.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a service writer on the build under test, with a work order open.
- Seed a work order line: on the work order click New Line, type a Title (e.g. "Replace tie rod"), a Description (e.g. "excessive play") and a Tech Story (e.g. "Both outer ends worn, replaced and aligned"), and Save & Close.
- Complete and invoice the work order so a Customer Invoice exists (e.g. work order S2-17578).
- The shop has an active QuickBooks Online connection so the invoice also syncs.



========== C154716 · section 20463 (S3 What Reaches QuickBooks)
TITLE: A missing description is left out, including "Tech story missing."
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as a service writer on the build under test, with a work order open.
- Require Tech Story is turned OFF (Work Order Settings).
- Seed and invoice two lines: (a) title + description, tech story left empty; (b) a line whose tech story is the literal text "Tech story missing." that the dialog writes when nothing was typed.
--- STEPS
- To read the line text a customer/bookkeeper sees: open Export Reports, choose the Customer Invoice report and download it (requires "Invoicing & payments - View"); read the Description column.
- Read both lines' text in the Description column.
- Confirm neither ends with a trailing hyphen or trailing space, and neither shows "Tech story missing.".
--- EXPECTED
Expected results
- A line with no narrative ends after the description, with no trailing hyphen and no trailing space; a narrative that is empty and one that is the literal placeholder "Tech story missing." are treated identically and neither reaches QuickBooks.
- An absent narrative is normal, not exceptional: with Require Tech Story off, completed lines are invoiced without a narrative as a matter of course.
Source - where this behaviour comes from
Epic SV-9667; story SV-10132 (S3, What Reaches QuickBooks); PRD (Confluence 845348896), Story 3; design board saved_resource(3); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R6: “A line with no narrative ends after the description, with no trailing hyphen and no trailing space. A narrative is absent when the value is empty, or when it is the literal placeholder "Tech story missing." that the line dialog writes when nothing was typed; the two are treated identically, and neither reaches QuickBooks.”
- S3-R6a: “A narrative is absent legitimately, not only exceptionally. The organization setting Administration, Work Order Settings, Require Tech Story governs whether the completion gate gets in the way, so a shop with it switched off invoices completed lines with no narrative as a matter of course.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: A missing description is left out, including "Tech story missing."
Test case: C154716, FM - What/Why. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as a service writer on the build under test, with a work order open.
- Require Tech Story is turned OFF (Work Order Settings).
- Seed and invoice two lines: (a) title + description, tech story left empty; (b) a line whose tech story is the literal text "Tech story missing." that the dialog writes when nothing was typed.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as a service writer on the build under test, with a work order open.
- In Administration -> Work Order Settings, turn Require Tech Story OFF.
- Seed and invoice two lines: (a) title + description, tech story left empty; (b) a line whose tech story is the literal text "Tech story missing." that the dialog writes when nothing was typed.



========== C154717 · section 20463 (S3 What Reaches QuickBooks)
TITLE: Line text over 4,000 bytes is shortened from the end, title kept
--- PRECONDITIONS (TestRail)
- You are signed in as a service writer on the build under test, with a work order open.
- Seed and invoice a line whose joined text exceeds 4,000 bytes: a short title (e.g. "Replace tie rod"), a description, and a very long tech story.
- Also seed a matching line whose text is the same on-screen length but written in accented / non-Latin characters.
- The shop has an active QuickBooks Online connection.
--- STEPS
- To read the line text a customer/bookkeeper sees: open Export Reports, choose the Customer Invoice report and download it (requires "Invoicing & payments - View"); read the Description column.
- Read the long line's text: confirm the title (and as much that follows as fits) survives and the narrative is what gets clipped.
- Confirm no character is cut in half at the end.
- Compare where the plain line and the accented line are cut.
- Confirm the invoice reached QuickBooks and did not land in Unexported Items.
--- EXPECTED
Expected results
- When the joined text is longer than 4,000 bytes it is shortened from the end to fit and is never cut in the middle of a character; because the title leads and the narrative trails, the title always survives and the narrative is clipped first (both the sync and the report cut at the same limit).
- The limit is a storage (byte) limit, so an accented / non-Latin line may be shortened more than an English line that looks the same length; two equally-long-looking lines can be cut at different points - correct, not a defect.
- A description long enough to be cut still syncs: the invoice reaches QuickBooks and does not land in Unexported Items.
Source - where this behaviour comes from
Epic SV-9667; story SV-10132 (S3, What Reaches QuickBooks); PRD (Confluence 845348896), Story 3; design board saved_resource(3); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R7: “When the joined text is longer than 4,000 bytes it is shortened from the end to fit, and it is never cut in the middle of a character. The live sync and the downloadable report are both cut at that same limit, so S3-R4 holds on a long line too. Today only the live sync cuts, and it cuts by bytes without regard for where a character ends; the report has no cut at all. Because the title leads and the narrative trails, the title always survives and the narrative is what gets clipped first.”
- S3-R7a: “The limit is a storage limit rather than a count of what a reader sees, so a line written with accented or non-Latin characters may be shortened more than an English line that looks the same length on screen. Two lines that look equally long can therefore be cut at different points. That is correct behavior and not a defect.”
- S3-E3: “A description long enough to be cut still syncs. The invoice reaches QuickBooks; it does not land in Unexported Items.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
(no setup doc; the setup is in the preconditions above)


========== C154718 · section 20463 (S3 What Reaches QuickBooks)
TITLE: Values keep their own hyphens and semicolons as written
--- PRECONDITIONS (TestRail)
- You are signed in as a service writer on the build under test, with a work order open.
- Seed and invoice a line whose values themselves contain punctuation: Title "A/C - recharge", Description "leak; slow", Tech Story "topped up - dye added; retest".
--- STEPS
- To read the line text a customer/bookkeeper sees: open Export Reports, choose the Customer Invoice report and download it (requires "Invoicing & payments - View"); read the Description column.
- Read the line's text and compare each segment to exactly what you typed.
- Confirm the in-value hyphens and semicolons are carried through unchanged and nothing extra is trimmed, re-cased or escaped.
--- EXPECTED
Expected results
- The values themselves are unchanged - nothing is trimmed, truncated, re-cased or escaped beyond the over-length shortening in S3-R7.
- A hyphen (including a spaced hyphen) or a semicolon typed inside any of the three values is carried as written; the separator is not escaped and the text is not quoted, so a reader cannot always tell our separator from one inside a value - accepted deliberately.
Source - where this behaviour comes from
Epic SV-9667; story SV-10132 (S3, What Reaches QuickBooks); PRD (Confluence 845348896), Story 3; design board saved_resource(3); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R8: “The values themselves are unchanged. Nothing is trimmed, truncated, re-cased or escaped that is not trimmed, truncated, re-cased or escaped today, other than the shortening described in S3-R7.”
- S3-R9: “A title, a description or a narrative that itself contains a hyphen, including a spaced hyphen, is carried as written. The separator is not escaped and the text is not quoted, so a reader cannot always tell our separator from theirs. This is accepted deliberately: the alternative is printing a field name to mark the join, which is the thing being removed.”
- S3-R9a: “A semicolon typed inside any of the three values is ordinary punctuation and is carried through untouched. It was ambiguous only while the semicolon was the separator.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
(no setup doc; the setup is in the preconditions above)


========== C154719 · section 20463 (S3 What Reaches QuickBooks)
TITLE: The report hides money for users without financial access, not line text
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- Sign in as a user who cannot see financial data, on the build under test.
- A work order line (Title for example "Replace tie rod", Description for example "excessive play", Tech Story for example "Both outer ends worn, replaced and aligned"), created by a finance user beforehand and then invoiced.
--- STEPS
- To read the line text a customer/bookkeeper sees: open Export Reports, choose the Customer Invoice report and download it (requires "Invoicing & payments - View"); read the Description column. (as the no-finance user)
- Read the money columns (rate, amount, tax, average cost) and the Description column.
--- EXPECTED
Expected results
- For a user who cannot see financial data the downloaded report masks its money columns (rate, amount, tax and average cost) as it does today; the line text is not a money value and is not masked, so the same words reach every reader of the file.
Source - where this behaviour comes from
Epic SV-9667; story SV-10132 (S3, What Reaches QuickBooks); PRD (Confluence 845348896), Story 3; design board saved_resource(3); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R10: “For a user who cannot see financial data, the downloaded report masks its money columns (rate, amount, tax and average cost) as it does today. The line text is not a money value and is not masked, so the same words reach every reader of the file.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: The report hides money for users without financial access, not line text
Test case: C154719, FM - What/Why. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- Sign in as a user who cannot see financial data, on the build under test.
- A work order line (Title for example "Replace tie rod", Description for example "excessive play", Tech Story for example "Both outer ends worn, replaced and aligned"), created by a finance user beforehand and then invoiced.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- Sign in as a user who cannot see financial data, on the build under test.
- Seed a work order line: on the work order click New Line, type a Title (e.g. "Replace tie rod"), a Description (e.g. "excessive play") and a Tech Story (e.g. "Both outer ends worn, replaced and aligned"), and Save & Close. (as a finance user beforehand), then invoice it.



========== C154720 · section 20463 (S3 What Reaches QuickBooks)
TITLE: Only the QuickBooks sync and report use this text, imported history is not
--- PRECONDITIONS (TestRail)
- You are signed in as a service writer on the build under test, with a work order open.
--- STEPS
- Check other reports/exports that show work order line text and confirm none reads this joined line-text builder.
- Import a historical invoice (Administration -> Invoices) and confirm its line text is whatever the import wrote, not re-joined.
--- EXPECTED
Expected results
- No other report or export reads this line text - changing it changes only the live sync and the Customer Invoice report.
- An imported historical invoice never reaches the live QuickBooks sync, so its line text is unaffected whatever the import wrote into it.
Source - where this behaviour comes from
Epic SV-9667; story SV-10132 (S3, What Reaches QuickBooks); PRD (Confluence 845348896), Story 3; design board saved_resource(3); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-R11: “No other report or export reads this line text. Changing it changes these two routes and nothing else.”
- S3-R12: “An imported historical invoice never reaches the live QuickBooks sync, so its line text is unaffected whatever the import wrote into it.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
(no setup doc; the setup is in the preconditions above)


========== C154721 · section 20463 (S3 What Reaches QuickBooks)
TITLE: Existing QuickBooks invoices keep their text, a reversal sends the new text
--- PRECONDITIONS (TestRail)
- You are signed in as a service writer on the build under test, with a work order open.
- An invoice already synced to QuickBooks before release day; a line created before this change; the shop has an active QuickBooks connection.
--- STEPS
- Confirm invoices already in QuickBooks are not re-synced, re-exported or rewritten.
- Invoice a pre-existing line after the change and confirm its text uses the new format, never the old labels/questions.
- Reverse and re-invoice a job after release day and compare the original invoice's text to the new one.
--- EXPECTED
Expected results
- Invoices already in QuickBooks keep the text they were sent with - nothing is re-synced, re-exported or rewritten.
- No line falls back to the old labels or the old questions, including lines created before this change.
- A reversed-and-re-invoiced job after release day carries the new text on the new invoice while the original keeps the old text, so a bookkeeper can see both forms in one set of books on one job.
Source - where this behaviour comes from
Epic SV-9667; story SV-10132 (S3, What Reaches QuickBooks); PRD (Confluence 845348896), Story 3; design board saved_resource(3); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-N1: “Invoices already in QuickBooks keep the text they were sent with. Nothing is re-synced, re-exported or rewritten.”
- S3-N2: “No line falls back to the old labels or the old questions, including lines created before this change.”
- S3-E2: “An invoice that is reversed and re-invoiced after release day carries the new text on the new invoice, while the original keeps the old text. A bookkeeper can therefore see both forms in one set of books, on one job.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
(no setup doc; the setup is in the preconditions above)


========== C154722 · section 20463 (S3 What Reaches QuickBooks)
TITLE: Parts, shop supplies and fee or discount lines are unchanged
--- PRECONDITIONS (TestRail)
- You are signed in as a service writer on the build under test, with a work order open.
- Seed and invoice a work order carrying a parts line, a shop supplies line and a fee or discount line alongside a labor line.
--- STEPS
- To read the line text a customer/bookkeeper sees: open Export Reports, choose the Customer Invoice report and download it (requires "Invoicing & payments - View"); read the Description column.
- Read the parts, shop-supplies and fee/discount lines' text and confirm the title-and-description joining rule does not apply to them.
--- EXPECTED
Expected results
- A parts line, a shop supplies line and a fee or discount line are unaffected: none of them carries a title-and-description pair, so the joining rule does not touch them.
Source - where this behaviour comes from
Epic SV-9667; story SV-10132 (S3, What Reaches QuickBooks); PRD (Confluence 845348896), Story 3; design board saved_resource(3); read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S3-N3: “A parts line, a shop supplies line and a fee or discount line are unaffected: none of them carries a title-and-description pair.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
(no setup doc; the setup is in the preconditions above)


========== C154723 · section 20464 (S4 The Imports)
TITLE: Invoice import columns are renamed to Line Title and Line Description
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as an admin, on the build under test.
- The Invoices page under Administration (the historical invoice import) is open.
--- STEPS
- Read the on-screen column list for the two line columns.
- Download the sample import file and read its header row.
- Confirm this is the only live import carrying these columns (there is no separate work order import for them).
--- EXPECTED
Expected results
- The two columns are named "*Line Title" and "Line Description" (replacing "*Line Title - What are you doing" and "Line Description - Why are you doing it"); both the downloadable sample file and the on-screen column list show the new names.
- There is no separate work order import carrying these columns - Administration -> Invoices is the only live import that does.
Source - where this behaviour comes from
Epic SV-9667; story SV-10133 (S4, The Imports); PRD (Confluence 845348896), Story 4; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S4-R1: “Withdrawn. There is no separate work order import. The only live import carrying these columns is Administration → Invoices, which writes to the imported work order history and is covered by S4-R2. The column names this requirement renamed exist only in code nothing calls, and nothing ships for them.”
- S4-R2: “The historical invoice import's two columns (Administration → Invoices) are named "*Line Title" and "Line Description", replacing "*Line Title - What are you doing" and "Line Description - Why are you doing it".”
- S4-R6: “The downloadable sample file and the on-screen column list both show the new names.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Invoice import columns are renamed to Line Title and Line Description
Test case: C154723, FM - What/Why. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as an admin, on the build under test.
- The Invoices page under Administration (the historical invoice import) is open.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as an admin, on the build under test.
- Open Administration -> Invoices (the historical invoice import).



========== C154724 · section 20464 (S4 The Imports)
TITLE: Old import column names still work, and a file may mix old and new
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as an admin, on the build under test, on the Invoices page under Administration.
- Prepare three import files with otherwise valid rows: (a) both columns under the NEW names; (b) both under the OLD names ("*Line Title - What are you doing" / "Line Description - Why are you doing it"); (c) one column old, the other new.
--- STEPS
- Import file (a), then file (b), then file (c).
- For each, confirm it validates and imports, and compare the imported result of (a) and (b).
- Confirm the old name is never reported as missing or as a column to remove.
--- EXPECTED
Expected results
- The importer accepts the old column names as well as the new ones; a file carrying either spelling validates and imports identically, and a file may mix the two (one column old, the other new).
- The old name is accepted as the column it became - it is neither reported missing nor flagged as a column to remove.
Source - where this behaviour comes from
Epic SV-9667; story SV-10133 (S4, The Imports); PRD (Confluence 845348896), Story 4; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S4-R3: “The importer accepts the old column names as well as the new ones. A file carrying either spelling validates and imports identically.”
- S4-R4: “A file may mix the two spellings, carrying one column under its old name and the other under its new one.”
- S4-R5: “The old name is accepted as the column it became: it is neither reported missing nor reported as a column to remove.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Old import column names still work, and a file may mix old and new
Test case: C154724, FM - What/Why. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as an admin, on the build under test, on the Invoices page under Administration.
- Prepare three import files with otherwise valid rows: (a) both columns under the NEW names; (b) both under the OLD names ("*Line Title - What are you doing" / "Line Description - Why are you doing it"); (c) one column old, the other new.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as an admin, on the build under test, at Administration -> Invoices.
- Prepare three import files with otherwise valid rows: (a) both columns under the NEW names; (b) both under the OLD names ("*Line Title - What are you doing" / "Line Description - Why are you doing it"); (c) one column old, the other new.



========== C154725 · section 20464 (S4 The Imports)
TITLE: Other import columns and their order are unchanged
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are signed in as an admin, on the build under test, on the Invoices page under Administration.
--- STEPS
- Compare every other column name and the required column order against today's template.
- Import a file that adds a genuinely unrecognised column (e.g. "Widget Notes").
--- EXPECTED
Expected results
- Every other column name and the required order of columns is unchanged.
- A genuinely unrecognised column is still rejected - the compatibility rule covers exactly the two renamed columns and nothing else.
Source - where this behaviour comes from
Epic SV-9667; story SV-10133 (S4, The Imports); PRD (Confluence 845348896), Story 4; read 30 Sep 2026. Source-verified 30 September 2026; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S4-R7: “Every other column name, and the required order of columns, is unchanged.”
- S4-N1: “A genuinely unrecognized column is still rejected. The compatibility rule covers exactly the two renamed columns and nothing else.”
AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) and the design canvas; not yet build-verified against a QA build (no QA branch yet)
--- CURRENT SETUP DOC (Part 1)
# Setup: Other import columns and their order are unchanged
Test case: C154725, FM - What/Why. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
Values given as examples ("e.g." or "for example") can be anything: they are not records that already exist in the app. Write down the real values you used, because the test steps refer to them.
## What the setup creates
- You are signed in as an admin, on the build under test, on the Invoices page under Administration.
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
- You are signed in as an admin, on the build under test, at Administration -> Invoices.

