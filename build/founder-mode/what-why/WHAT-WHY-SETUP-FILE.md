# What/Why (Title and Description) — setup file for Claude sessions (a tester does not need it)

Built by `authoring/render_setup.py` from the case library (68 cases). Sources: PRD "What Are You Doing / Why Are You Doing It?" (Title and Description), Confluence 845348896, version 16 (27 Oct 2026, owner Chris Ward), read 27 Oct 2026; Product's answers of 14 Oct 2026; tech plan of 23 Sep 2026; Jira epic SV-11257 read 27 Oct 2026; design canvas https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6 (27 Oct copy). No credential, cookie or session data is written here.

## 1 · Accounts and places (slots)
| Slot | What it is | Notes |
|---|---|---|
| Admin at the test location | the build's Admin user | Every case except S3-07 and S3-18. The developers' QA notes say "Log in as admin unless a step says otherwise". |
| user B (no financial data) | a user whose role has Reports and Invoicing & payments - View on and See financial data off | S3-07. Make the role in Settings → Roles & Permissions. |
| user B (no invoices) | a user whose role has Reports on and Invoicing & payments - View off | S3-18, plus a second browser signed in as the Admin. |
| QuickBooks-connected location | a location whose QuickBooks Online connection is active, to a sandbox company you can sign in to | S3-03, S3-09, S3-14, S3-15, S3-17. On the QA build that is the QuickBooks host (the epic's developer comments name it; it runs the same code against the QA backend). The QA's 23 Oct pass used sandbox company "CA 3e09"; the US sandbox gave a tax-code error ("TAX or NON") and had to be reconnected and remapped. |

## 2 · Shared recipes (screens first; every value below is an example unless the case fixes it)
- **Require Tech Story.** Settings → Work Orders tab → LINE REQUIREMENTS → Require Tech Story → Save Settings (observed on another suite, 9 Sep 2026). Organisation-wide: cases that need it on (S3-01, S3-03, S3-06, S3-11, S3-19, S3-21) and off (the rest of Story 3) cannot run in parallel on one organisation. PRD v15 S3-R6a: shops created since June 2025 start with it off, older shops on.
- **A labor line with exact values.** Work order → Lines tab → New Line → type the title in the Title box (do not pick a canned line) → Description → Save & Close. Long values (5,000 digits, 3,000 é) are pasted: in Google Sheets =REPT("0123456789",500) or =REPT("é",3000), copy the cell, paste.
- **A tech story.** With Require Tech Story on, the completion gate asks for it. With it off, a tech story is typed on the line before completing it (screen label not confirmed by any source: the build verification session records it).
- **"Tech story missing."** PRD v15 S3-R6 / Product answer 6: save an existing line with no tech story once from Edit Line (open → Save & Close). A line saved from New Line keeps an empty tech story.
- **Invoice a work order.** Complete the line(s) → status Complete → Finance tab → Create Invoice → close the New Customer Payment window. On a QuickBooks-connected location the invoice syncs at once; failures land in Reports → QB Unexported.
- **Customer Invoice report.** Reports → Export Reports (Reports left menu, under Accounting) → "Export Report" dialog → Report Name: Customer Invoice → date range → Download. Column with the line text: ItemDescription (developers' notes). Open in Google Sheets (File → Import → Upload) so UTF-8 reads correctly (Excel can show "Ã©" for é in a CSV without a byte-order mark).
- **Invoices import.** Settings → Data Import → Invoices: Download template, fill one Labor row, upload. Messages (developers' notes): "All invoices have been imported successfully."; a wrong header: "Invalid file headers provided!" and "Failed to import all invoices."; a duplicate invoice number: "Some invoices have failed to import.". A file saved from Excel as "CSV UTF-8" is rejected as invalid headers (byte-order mark, pre-existing): save as plain CSV.
- **Find an imported invoice.** Work Orders → All tab → List view → Status → Imported (clears the other statuses; greyed out in other views: "Imported work orders open in List.") → search by invoice number or customer (partial text works). Only the current location's imports show (developer, SV-10133, 21 Oct).
- **Records from before the release.** On staging the four stories were merged on 23 Oct 2026; on the QA build they were deployed 8 Oct (redeployed 19 Oct). Work orders / invoices older than that are "from before this release". An invoice synced to QuickBooks before then still reads "What are you doing?: …;Why are you doing it?: …;Tech Story: …" there.
- **An old Invoices template.** Download one from an environment without this change (for example production until the release), or use a saved copy; column 16 reads "*Line Title - What are you doing", column 17 "Line Description - Why are you doing it".
- **ShopCoach.** Work order → Lines tab → ShopCoach Line Builder box → type the job → Build Lines. Needs an asset with year, make and model. SV-11850 (27 Oct): on staging Build Lines shows nothing for every input.

## 3 · Traps
- The design boards draw staging screens and the PRD's example values; never search the app for the boards' record names.
- CSV formula cells: a title that starts with =, +, - or @ opens as a formula in a spreadsheet (developer note, pre-existing); every title in these cases starts with a letter.
- The report cuts at 4,000 storage units (bytes): LEN in a spreadsheet counts characters, so a line of é shows 2,009 characters for 3,999 bytes.

## 4 · One recipe per case

### S1-01 · C154707 · New Line shows the fields Title and Description with grey question prompts
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, that is not invoiced, so you can add a line to it.
- Start on work order 1, on its Lines tab.
- Any open, uninvoiced work order at the test location will do; nothing is saved.
Quotes: S1-R1, S1-R2, S1-R3, S1-R5, PRE-S1-1. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S1-02 · C154708 · The Title label stays Title when a canned line is picked or cleared
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, that is not invoiced, so you can add a line to it.
- Have a canned line, canned line A, at the test location (Settings, then Canned Lines).
- Start on work order 1, on its Lines tab.
- Canned line example: "Replace - Brake pot" (the one the QA used on sv10130, SV-10130 comment of 20 Oct).
Quotes: S1-R4, S1-R5, S1-R3. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S1-03 · C154709 · New Line will not save without a Title and says "Title is a required field"
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an open work order for this test, work order 1, so that a wrongly saved line would not touch other work.
- Start on work order 1, on its Lines tab.
- Product asked (answer 7, 14 Oct) for a bug if the message shows only after a blocked save. The developer's 19 Oct note says the build now shows it on leaving the field. 28 Oct: the QA lead approved filing it; it is filed only after two reproductions on the QA build (Rule 94), and then this case gets the EXPECT FAIL marker.
Quotes: S1-R6, S1-R7. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S1-03b · C839503 (split from S1-03) · Leaving the Title empty shows "Title is a required field" under it
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, that is not invoiced, so you can add a line to it.
- Start on work order 1, on its Lines tab.
- Split from S1-03 (C154709) for the v14 S1-R6 sentence (SV-10916). Answer 7 of 14 Oct asked for a bug if the build shows the message only after a blocked save; 28 Oct the QA lead approved filing it after two reproductions (Rule 94). The case keeps the PRD's expectation.
Quotes: S1-R6, S1-R3, SV-10130, Nemanja Djuric, 19 Oct 2026 (QA update, PRD v14). Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S1-04 · C154710 · New Line keeps its other fields, their order and its three buttons
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an open work order for this test, work order 1, so a saved line can be added to it.
- Have a canned line, canned line A, at the test location (Settings, then Canned Lines).
- Start on work order 1, on its Lines tab.
Quotes: S1-R7, S1-R3, FO-6. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S1-04b · C839504 (split from S1-04) · Edit Line keeps its other fields, their order and its buttons
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, with a line, line 1, that has a title and a description.
- Start on work order 1, on its Lines tab.
Quotes: S1-R7, S1-R1, S1-R2, S1-R3. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S1-05 · C549075 · Edit Line will not save an emptied Title and says it is required
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Start on work order 1, on its Lines tab.
Quotes: S1-R6, S1-R7, S1-R3, SV-10130, Nemanja Djuric, 19 Oct 2026 (QA update, PRD v14). Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S1-06 · C549076 · A line saved before this change opens with the same title and description
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a work order made before this release, work order 1, with a line, line 1, that has a title and a description.
- Start on work order 1, on its Lines tab.
- Any work order created before the What/Why build reached the environment (on staging, any work order older than 23 Oct 2026, when SV-10130 was merged to staging; the QA used S2-17358 line 1 on sv10130).
Quotes: S1-N1, S1-R7, FO-6. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S1-07 · C549077 · Edit Line names its fields Title and Description and prompts when emptied
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Start on work order 1, on its Lines tab.
Quotes: S1-R1, S1-R2, S1-R3, S1-R4. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S1-08 · C549078 · At phone width the line window shows the same Title and Description words
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, with a line, line 1, that has a title and a description.
- Use a phone, or a desktop browser window narrowed to 600 pixels wide or less.
- Start on work order 1, on its Lines tab.
Quotes: FF-1, S1-R1, S1-R2, S1-R3, SV-10130, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing). Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S1-09 · C847719 · New Line says "Title cannot be longer than 255 characters" at 256
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an open work order for this test, work order 1, so a saved line can be added to it.
- Start on work order 1, on its Lines tab.
- New 28 Oct 2026 (PRD v16 S1-R6, Product answer 9 of 27 Oct). 255-character text: "0123456789" * 25 + "01234".
Quotes: S1-R6, SV-10130, Nemanja Djuric, 19 Oct 2026 (QA update, PRD v14), Answer 9. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S1-10 · C847720 · Edit Line says "Title cannot be longer than 255 characters" at 256
State the tester sets up:
- Sign in as an Admin at the test location.
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Start on work order 1, on its Lines tab.
- New 28 Oct 2026 (PRD v16 S1-R6, Product answer 9 of 27 Oct).
Quotes: S1-R6, S1-R7, SV-10130, Nemanja Djuric, 19 Oct 2026 (QA update, PRD v14), Answer 9. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S2-01 · C154711 · ShopCoach line builder labels its editors Title and Description
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, that is not invoiced, for an asset with its year, make and model filled in, so ShopCoach can suggest lines for it.
- Start on work order 1, on its Lines tab.
- Asset example: any asset with year, make and model (e.g. 2018 Freightliner Cascadia). The QA passed this on qb1/sv10130 on 23 Oct (WO S2-17477); on staging SV-11850 blocks it (27 Oct).
Quotes: S2-R1, SV-10131, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing), SV-10131, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing), SV-10131, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing), SV-11850, Mudassir Qamar, 27 Oct 2026 (Steps), SV-11850, Mudassir Qamar, 27 Oct 2026 (Actual). Marker: AUTOMATION: READY - EXPECT FAIL (SV-11850).

### S2-02 · C154712 · A line added from ShopCoach keeps the title and description the builder showed
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an open work order for this test, work order 1, for an asset with its year, make and model filled in, so ShopCoach can suggest lines for it.
- Start on work order 1, on its Lines tab.
Quotes: S2-R3, S2-R1, SV-10131, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing), SV-11850, Mudassir Qamar, 27 Oct 2026 (Actual). Marker: AUTOMATION: READY - EXPECT FAIL (SV-11850).

### S2-03 · C549079 · Empty ShopCoach title and description show the question prompts
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, that is not invoiced, for an asset with its year, make and model filled in, so ShopCoach can suggest lines for it.
- Start on work order 1, on its Lines tab.
Quotes: S2-R2, S2-R2a, S1-R3, S2-R1, SV-10131, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing), SV-10131, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing), SV-11850, Mudassir Qamar, 27 Oct 2026 (Actual). Marker: AUTOMATION: READY - EXPECT FAIL (SV-11850).

### S2-04 · C549080 · A ShopCoach line reads Title - Description in the Customer Invoice report
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, added from the ShopCoach line builder, with no tech story.
- Write down line 1's title and description exactly as work order 1's Lines tab shows them.
- Have line 1 completed with no tech story, and work order 1 completed and invoiced today as invoice A.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- The QA's 23 Oct pass: ShopCoach line "DOT Inspection" (title only) read "DOT Inspection" in QuickBooks and in the export.
Quotes: S2-R3, S3-R1, S3-R3, S3-R6. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-01 · C154713 · Customer Invoice report shows a line as Title - Description - Tech story
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is on (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Have line 1 completed with the tech story "Both outer ends worn, replaced and aligned", and work order 1 completed and invoiced today as invoice A.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rod', description 'excessive play', tech story 'Both outer ends worn, replaced and align'… → line text by the PRD's rule: 77 characters, 77 bytes: 'Replace tie rod - excessive play - Both outer ends worn, replaced and aligned'.
- The PRD's own example line (S3-R1). Require Tech Story on: the tech story is typed at the completion gate.
Quotes: S3-R1, S3-R2, S3-R5, S3-R6a, KD-3. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-02 · C154714 · A line with only a title shows the title alone in the Customer Invoice report
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Oil change" with no description.
- Have line 1 completed with no tech story, and work order 1 completed and invoiced today as invoice A.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Oil change', description '', tech story '' → line text by the PRD's rule: 10 characters, 10 bytes: 'Oil change'.
Quotes: S3-R3, S3-R6a, KD-5. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-03 · C154715 · QuickBooks Online and the Customer Invoice report show the same line text
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a test location whose QuickBooks Online connection is active, linked to a QuickBooks sandbox company you can sign in to.
- Make sure Require Tech Story is on (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Have line 1 completed with the tech story "Both outer ends worn, replaced and aligned", and work order 1 completed and invoiced today as invoice A, which reaches the QuickBooks sandbox.
- Write down invoice A's number.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Keep the QuickBooks sandbox company open in a second browser tab.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rod', description 'excessive play', tech story 'Both outer ends worn, replaced and align'… → line text by the PRD's rule: 77 characters, 77 bytes: 'Replace tie rod - excessive play - Both outer ends worn, replaced and aligned'.
- QuickBooks host: qb1.qa.shopview.com (sv10130 backend; SV-10130 comment of 8 Oct). The QA's 23 Oct pass used QBO sandbox company CA 3e09 (the US sandbox gives a tax-code error "TAX or NON"; reconnect and remap).
Quotes: S3-R4, S3-R1, FO-4, PRE-S3-1, PRE-S3-4, KD-8. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-04 · C154716 · With Require Tech Story off, the report line ends after the description
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play", approved and not yet completed.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on work order 1, on its Lines tab.
- Typed values: title 'Replace tie rod', description 'excessive play', tech story '' → line text by the PRD's rule: 32 characters, 32 bytes: 'Replace tie rod - excessive play'.
- A line saved from New Line keeps an empty tech story (S3-R6); completing it with Require Tech Story off writes none.
Quotes: S3-R6a, S3-R6, S3-R3, KD-6. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-05 · C154717 · An over-long line is shortened from the end in the report and keeps the title
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" whose description is 0123456789 written 500 times in a row (5,000 characters; paste it in).
- Have line 1 completed with no tech story, and work order 1 completed and invoiced today as invoice A.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rod', description '0123456789012345678901234567890123456789'…, tech story '' → line text by the PRD's rule: 4000 characters, 4000 bytes.
- Generate the description with a spreadsheet: =REPT("0123456789",500), copy the cell, paste into Description.
Quotes: S3-R7, S3-R8, S3-R4, KD-8, ASSUME-3, ASSUME-5. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-06 · C154718 · Hyphens and semicolons typed in a line are carried as written
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is on (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with two labor lines: line 1 titled "Replace tie rod - passenger side" with the description "excessive play - customer waiting", and line 2 titled "Replace tie rod" with the description "excessive play; also checked the drag link".
- Have line 1 completed with the tech story "Torqued to 74 ft-lb, alignment set", line 2 completed with the tech story "Drag link within spec", and work order 1 completed and invoiced today as invoice A.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rod - passenger side', description 'excessive play - customer waiting', tech story 'Torqued to 74 ft-lb, alignment set' → line text by the PRD's rule: 105 characters, 105 bytes: 'Replace tie rod - passenger side - excessive play - customer waiting - Torqued to 74 ft-lb, alignment set'.
- Typed values: title 'Replace tie rod', description 'excessive play; also checked the drag li'…, tech story 'Drag link within spec' → line text by the PRD's rule: 84 characters, 84 bytes: 'Replace tie rod - excessive play; also checked the drag link - Drag link within spec'.
- Values are the board "Awkward inputs" (2.1) examples, letter for letter.
Quotes: S3-R9, S3-R9a, S3-R8, S3-R5. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-07 · C154719 · The report hides money but not line text from a user without financial access
State the tester sets up:
- Sign in as user B, whose role has Reports and Invoicing & payments - View on and See financial data off, at the test location.
- Make sure Require Tech Story is on (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Have line 1 completed with the tech story "Both outer ends worn, replaced and aligned", and work order 1 completed and invoiced today as invoice A, by an Admin.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rod', description 'excessive play', tech story 'Both outer ends worn, replaced and align'… → line text by the PRD's rule: 77 characters, 77 bytes: 'Replace tie rod - excessive play - Both outer ends worn, replaced and aligned'.
Quotes: S3-R10, PRE-S3-3, SV-10132, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing). Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-08 · C154720 · Other downloadable reports do not carry the joined Title - Description text
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Have line 1 completed with no tech story, and work order 1 completed and invoiced today as invoice A.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rod', description 'excessive play', tech story '' → line text by the PRD's rule: 32 characters, 32 bytes: 'Replace tie rod - excessive play'.
Quotes: S3-R11, S3-R4, FO-4. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-09 · C154721 · Invoices already in QuickBooks Online keep the text they were sent with
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a test location whose QuickBooks Online connection is active, linked to a QuickBooks sandbox company you can sign in to.
- Have an invoice made and synced to QuickBooks before this release, invoice A, for customer A, whose labor line, line 1, had a title, a description and a tech story.
- Write down invoice A's number.
- Keep the QuickBooks sandbox company open in a second browser tab.
- Needs an invoice synced from this QuickBooks-connected location before the What/Why build reached it (qb1: before 8 Oct 2026).
Quotes: S3-N1, S3-R4, OOS-3, KD-10. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-10 · C154722 · Parts, shop supplies and fee rows in the report do not take the line text
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play", plus a part (part A), a shop supplies charge and a fee (fee A).
- Have line 1 completed with no tech story, part A received, and work order 1 completed and invoiced today as invoice A.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rod', description 'excessive play', tech story '' → line text by the PRD's rule: 32 characters, 32 bytes: 'Replace tie rod - excessive play'.
Quotes: S3-N3, S3-R1. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-11 · C549081 · A line with no description joins the title straight to the tech story
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is on (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with no description.
- Have line 1 completed with the tech story "Both outer ends worn, replaced and aligned", and work order 1 completed and invoiced today as invoice A.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rod', description '', tech story 'Both outer ends worn, replaced and align'… → line text by the PRD's rule: 60 characters, 60 bytes: 'Replace tie rod - Both outer ends worn, replaced and aligned'.
Quotes: S3-E1, S3-R3. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-12 · C549082 · A tech story of "Tech story missing." is left out of the report text
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Have line 1 opened in Edit Line and saved once with Save & Close, without typing a tech story, so it holds "Tech story missing.".
- Have line 1 completed without typing a tech story, and work order 1 completed and invoiced today as invoice A.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rod', description 'excessive play', tech story 'Tech story missing.' → line text by the PRD's rule: 32 characters, 32 bytes: 'Replace tie rod - excessive play'.
- The developer (SV-10132, 19 Oct): "Tech story missing." is written when Edit Line saves an existing line that has no tech story.
Quotes: S3-R6, KD-7, Chris Ward, 14 Oct 2026, answer 6. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-13 · C549083 · An accented over-long line is cut earlier and never in the middle of a letter
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rods" (16 characters) whose description is the letter é written 3,000 times in a row (paste it in).
- Have line 1 completed with no tech story, and work order 1 completed and invoiced today as invoice A.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rods', description 'éééééééééééééééééééééééééééééééééééééééé'…, tech story '' → line text by the PRD's rule: 2009 characters, 3999 bytes.
- Generate the description with =REPT("é",3000). 16-character title on purpose: 19 units before the description is odd, so the 4,000th unit falls inside an é and the cut has to stop one unit early (3,999).
Quotes: S3-R7, S3-R7a, S3-R4, KD-8. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-14 · C549084 · An over-long line still reaches QuickBooks Online and matches the report
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a test location whose QuickBooks Online connection is active, linked to a QuickBooks sandbox company you can sign in to.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rods" (16 characters) whose description is the letter é written 3,000 times in a row (paste it in).
- Have line 1 completed with no tech story, and work order 1 completed and invoiced today as invoice A, which the QuickBooks sync picks up.
- Write down invoice A's number.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Keep the QuickBooks sandbox company open in a second browser tab.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rods', description 'éééééééééééééééééééééééééééééééééééééééé'…, tech story '' → line text by the PRD's rule: 2009 characters, 3999 bytes.
Quotes: S3-E3, S3-R7, S3-R4, CN-S3-2. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-15 · C549085 · An imported historical invoice is not sent to QuickBooks Online
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a test location whose QuickBooks Online connection is active, linked to a QuickBooks sandbox company you can sign in to.
- Create a regular invoice for this test, invoice B, today at the test location, and let it reach QuickBooks, so you know the sync is running.
- Create an import file for this test, file A, from the downloaded Invoices import template, with one Labor row: a new invoice number (invoice A), an existing customer, *Line Title "Replace tie rod" and Line Description "excessive play".
- Write down the numbers of invoice A and invoice B.
- Keep the QuickBooks sandbox company open in a second browser tab.
- Start on Settings, then Invoices under Data Import in the Settings left menu.
- Imported invoices are found under Work Orders → All tab → Status → Imported (List view only), at the location they were imported into (Nemanja Djuric, SV-10133, 21 Oct).
Quotes: S3-R12, FO-5, SV-10133, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing). Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-16 · C549086 · A line created before this change reaches the report in the new form
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Have a work order made before this release and not yet invoiced, work order 1, with a labor line, line 1, that has a title and a description and no tech story.
- Write down line 1's title and description as work order 1's Lines tab shows them.
- Have line 1 completed with no tech story, and work order 1 completed and invoiced today as invoice A, for this test.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
Quotes: S3-N2, S3-R1, S3-R3, CN-S3-1. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-17 · C549087 · An old invoice reversed and invoiced again sends the new text to QuickBooks
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a test location whose QuickBooks Online connection is active, linked to a QuickBooks sandbox company you can sign in to.
- Have a work order made before this release, work order 1, for customer A, invoiced and synced to QuickBooks before this release as invoice A, with a labor line, line 1, that has a title, a description and a tech story.
- Write down line 1's title, description and tech story.
- Keep the QuickBooks sandbox company open in a second browser tab.
- Start on work order 1, on its Finance tab.
Quotes: S3-E2, S3-N1, KD-10. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-18 · C549088 · Customer Invoice report cannot be downloaded without Invoicing & payments - View
State the tester sets up:
- Sign in as user B, whose role has Reports on and Invoicing & payments - View off, at the test location.
- Have an invoice made today at the test location, invoice A, by an Admin.
- Use a second browser, or a private window, signed in as an Admin at the test location, with the Export Report dialog open, so you can see the same report download for someone allowed.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
Quotes: PRE-S3-3. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-19 · C839505 · A description of only spaces is left out: the title joins the tech story
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is on (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" whose description is three spaces and nothing else.
- Have line 1 completed with the tech story "Both outer ends worn, replaced and aligned", and work order 1 completed and invoiced today as invoice A.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rod', description '   ', tech story 'Both outer ends worn, replaced and align'… → line text by the PRD's rule: 60 characters, 60 bytes: 'Replace tie rod - Both outer ends worn, replaced and aligned'.
Quotes: S3-R3, S3-E1, Chris Ward, 14 Oct 2026, answer 1. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-20 · C839506 · A tech story of only spaces is left out: the line ends after the description
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Have line 1 completed with a tech story of three spaces and nothing else, and work order 1 completed and invoiced today as invoice A.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rod', description 'excessive play', tech story '   ' → line text by the PRD's rule: 32 characters, 32 bytes: 'Replace tie rod - excessive play'.
Quotes: S3-R6, S3-R3. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-21 · C839507 · Spaces and an empty line at the end of the tech story do not reach the report
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is on (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Have line 1 completed with the tech story "Both outer ends worn, replaced and aligned" followed by three spaces and one press of Enter, and work order 1 completed and invoiced today as invoice A.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rod', description 'excessive play', tech story 'Both outer ends worn, replaced and align'… → line text by the PRD's rule: 77 characters, 77 bytes: 'Replace tie rod - excessive play - Both outer ends worn, replaced and aligned'.
Quotes: S3-R8, S3-R3, SV-10132, Nemanja Djuric, 19 Oct 2026 (QA update, PRD v14). Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-22 · C839508 · A space typed at the end of the title is kept before the separator
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" followed by one space, with the description "excessive play".
- Have line 1 completed with no tech story, and work order 1 completed and invoiced today as invoice A.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rod ', description 'excessive play', tech story '' → line text by the PRD's rule: 33 characters, 33 bytes: 'Replace tie rod  - excessive play'.
- The QA's 23 Oct pass, case 6 ("Replace - Rear ramp handles␣␣- Broken off"); the developer and the QA agreed it is by design.
Quotes: S3-R8, S3-R2, SV-10132, Nemanja Djuric, 23 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-23 · C839509 · An invoice made before the release shows the new text in the downloaded report
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an invoice made before this release, invoice A, whose labor line, line 1, has a title, a description and a tech story.
- Write down line 1's title, description and tech story, and invoice A's date.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- QuickBooks keeps invoice A's old text (S3-N1); that half is checked by the QuickBooks case for old invoices.
Quotes: S3-E4, S3-R4, S3-N2. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-24 · C847721 · An imported invoice never appears in the Customer Invoice report
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Have line 1 completed with no tech story, and work order 1 completed and invoiced today as invoice A.
- Import a file made for this test, file A, from the downloaded Invoices import template (Settings, then Invoices under Data Import), with one Labor row dated today: a new invoice number (invoice B), an existing customer, *Line Title "Replace tie rod" and Line Description "excessive play", so invoice B exists only as an imported invoice.
- Write down the numbers of invoice A and invoice B.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- Typed values: title 'Replace tie rod', description 'excessive play', tech story '' → line text by the PRD's rule: 32 characters, 32 bytes: 'Replace tie rod - excessive play'.
- New 28 Oct 2026 (PRD v16 S3-R12, Product answer 12). Replaces the held design case D-15 (C839525, deleted 28 Oct with the QA lead's go-ahead). Imported invoices are found under Work Orders → All → Status → Imported (List view).
Quotes: S3-R12, PRE-S3-1, Answer 12. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-25 · C847722 · The report puts one apostrophe before a line starting with =, +, - or @
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with five labor lines, each with the description "leaking": line 1 titled "=Replace hose", line 2 titled "+Replace hose", line 3 titled "-Replace hose", line 4 titled "@Replace hose" and line 5 titled "Replace hose".
- Have lines 1 to 5 completed with no tech story, and work order 1 completed and invoiced today as invoice A.
- Use a plain text editor (Notepad on Windows, or TextEdit set to plain text on a Mac) to open the downloaded file, so you see its text exactly as it was written.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.
- New 28 Oct 2026 (PRD v16 S3-R8a, Product answer 11). A line starting with a tab or a carriage return cannot be typed as a Title by hand; that part of S3-R8a is the developers' check (requirement_map PART_MANUAL). Product says the build has no guard yet; a ticket is filed only after two reproductions on the QA build (Rule 94), then this case gets EXPECT FAIL.
Quotes: S3-R8a, S3-R4, S3-R8, Answer 11. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S3-26 · C847723 · QuickBooks Online gets no apostrophe before a line starting with =
State the tester sets up:
- Sign in as an Admin at the test location.
- Use a test location whose QuickBooks Online connection is active, linked to a QuickBooks sandbox company you can sign in to.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab).
- Create a work order for this test, work order 1, with one labor line, line 1, titled "=Replace hose" with the description "leaking".
- Have line 1 completed with no tech story, and work order 1 completed and invoiced today as invoice A, which reaches the QuickBooks sandbox.
- Write down invoice A's number.
- Keep the QuickBooks sandbox company open in a second browser tab.
- Typed values: title '=Replace hose', description 'leaking', tech story '' → line text by the PRD's rule: 23 characters, 23 bytes: '=Replace hose - leaking'.
- New 28 Oct 2026 (PRD v16 S3-R8a, Product answer 11). QuickBooks host: qb1.qa.shopview.com.
Quotes: S3-R8a, S3-R4, Answer 11. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S4-01 · C154723 · The Invoices import lists the columns Line Title and Line Description
State the tester sets up:
- Sign in as an Admin at the test location.
- Start on Settings.
Quotes: S4-R2, S4-R6, S4-R1, FO-5, SURF-5, SV-10133, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing). Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S4-02 · C154724 · An Invoices import file with the old column names imports like a new one
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two import files for this test from the downloaded Invoices import template, each with one Labor row for an existing customer, *Line Title "Replace tie rod" and Line Description "excessive play": file A keeps the template's headers, with a new invoice number, invoice A; file B is the same, with its two headers renamed to "*Line Title - What are you doing" and "Line Description - Why are you doing it", with another new invoice number, invoice B.
- Give invoices A and B numbers that start with the same text, so one search lists both.
- Start on Settings, then Invoices under Data Import in the Settings left menu.
Quotes: S4-R3, S4-R5, KD-11, SV-10133, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing), SV-10133, Nemanja Djuric, 21 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S4-03 · C154725 · The Invoices import template keeps every other column and the column order
State the tester sets up:
- Sign in as an Admin at the test location.
- Have a copy of the Invoices import template downloaded before this release, the old template, so its headers can be compared.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Settings, then Invoices under Data Import in the Settings left menu.
- Slots 15/16 are counted from 0 in the code: they are columns 16 and 17 (P and Q) in a spreadsheet. An old template can come from production while it still lists "Line Title - What are you doing", or from the QA lead's saved files.
Quotes: S4-R7, S4-R2, ASSUME-1, Tech plan, Phase 4, Tech plan, D4. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S4-04 · C549089 · The Invoices import template has the headers *Line Title and Line Description
State the tester sets up:
- Sign in as an Admin at the test location.
- Use Google Sheets (File, then Import, then Upload) to open downloaded files, so accented letters and character counts read correctly.
- Start on Settings, then Invoices under Data Import in the Settings left menu.
Quotes: S4-R2, S4-R6, SV-10133, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing). Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S4-05 · C549090 · An Invoices import file mixing an old and a new column name imports
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two import files for this test from the downloaded Invoices import template, each with one Labor row for an existing customer, *Line Title "Replace tie rod" and Line Description "excessive play": file A has the headers "*Line Title" (new) and "Line Description - Why are you doing it" (old), with a new invoice number, invoice A; file B has the headers "*Line Title - What are you doing" (old) and "Line Description" (new), with another new invoice number, invoice B.
- Give invoices A and B numbers that start with the same text, so one search lists both.
- Start on Settings, then Invoices under Data Import in the Settings left menu.
Quotes: S4-R4, S4-R5, S4-R3, SV-10133, Nemanja Djuric, 21 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S4-06 · C549091 · An Invoices import file with Line Title and Line Description swapped is rejected
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an import file for this test, file A, from the downloaded Invoices import template, with one Labor row, *Line Title "Replace tie rod" and Line Description "excessive play", then swap columns 16 and 17, header and value, so Line Description comes first.
- Start on Settings, then Invoices under Data Import in the Settings left menu.
Quotes: S4-R7, S4-N1, Tech plan, Phase 2 tests, SV-10133, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing). Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S4-07 · C549092 · An Invoices import file with an unknown column name is rejected
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an import file for this test, file A, from the downloaded Invoices import template, with one Labor row, *Line Title "Replace tie rod" and Line Description "excessive play", then change its column 16 header to "*Line Name".
- Start on Settings, then Invoices under Data Import in the Settings left menu.
Quotes: S4-N1, SV-10133, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing). Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S4-08 · C839510 · Old column names in other capitals or with spaces around them still import
State the tester sets up:
- Sign in as an Admin at the test location.
- Create two import files for this test from the downloaded Invoices import template, each with one Labor row for an existing customer, *Line Title "Replace tie rod" and Line Description "excessive play": file A keeps the template's headers, with a new invoice number, invoice A; file B is the same, with its two headers changed to " Line Description - Why are you doing it " (a space before and after) in column 17 and "*line title - WHAT ARE YOU DOING" in column 16, with another new invoice number, invoice B.
- Give invoices A and B numbers that start with the same text, so one search lists both.
- Start on Settings, then Invoices under Data Import in the Settings left menu.
Quotes: S4-R3, S4-R5, SV-10133, Nemanja Djuric, 19 Oct 2026 (QA update, PRD v14), SV-10133, Nemanja Djuric, 21 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### S4-09 · C847724 · An import row with an empty *Line Title says "Line Title cannot be empty."
State the tester sets up:
- Sign in as an Admin at the test location.
- Create an import file for this test, file A, from the downloaded Invoices import template, with one Labor row for an existing customer: a new invoice number, invoice A, the *Line Title cell left empty and Line Description "excessive play".
- Write down invoice A's number.
- Start on Settings, then Invoices under Data Import in the Settings left menu.
- New 28 Oct 2026 (PRD v16 S4-R8, Product answer 10). Product says the build still says "Line name cannot be empty."; a ticket is filed only after two reproductions on the QA build (Rule 94), then this case gets EXPECT FAIL. Rows that need no title (shop supplies, misc and credit memo rows) are not tested separately here (requirement_map PART_MANUAL).
Quotes: S4-R8, Answer 10, SV-10133, Nemanja Djuric, 21 Oct 2026. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-01 · C839511 · Design: New Line opens with the Title box ready and its grey prompt
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, that is not invoiced, so you can add a line to it.
- Use a desktop browser window at full screen, at 100% zoom, so the window can be compared with the attached board picture.
- Start on work order 1, on its Lines tab.
- The grey fill and the dark red bottom line are the focused picker as both New Line boards draw it (#d9d9d9 background, 2 px #8b0f1d line; label #8b0f1d 10 px; prompt #8b95a3 14 px). Nothing is saved; close the window afterwards.
Quotes: S1-R1, S1-R3, S1-R5. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-02 · C839512 · Design: New Line shows Description above its grey prompt
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, that is not invoiced, so you can add a line to it.
- Use a desktop browser window at full screen, at 100% zoom, so the window can be compared with the attached board picture.
- Start on work order 1, on its Lines tab.
- Description box as drawn: 1 px #c6ccd4 border, 4 px corners, label #7b8595 10 px, prompt #8b95a3 14 px.
Quotes: S1-R2, S1-R3. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-03 · C839513 · Design: New Line keeps its header, other fields and buttons as drawn
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, that is not invoiced, so you can add a line to it.
- Use a desktop browser window at full screen, at 100% zoom, so the window can be compared with the attached board picture.
- Start on work order 1, on its Lines tab.
- Header: title 17 px bold #1d2129; AI tag #9C27B0; link #2276DA 11 px 600; X #5b6472. Buttons: outlined #2276DA; Save & Close filled #2276DA.
Quotes: S1-R7, S1-R5. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-04 · C839514 · Design: Edit Line shows Title above the saved title
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, with a line, line 1, titled "Replace tie rod" with the description "excessive play".
- Use a desktop browser window at full screen, at 100% zoom, so the window can be compared with the attached board picture.
- Start on work order 1, on its Lines tab.
- Any line works; nothing is saved. Edit Line has no canned-line picker, so its Title box is a plain outlined box.
Quotes: S1-R1, S1-R3. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-05 · C839515 · Design: Edit Line shows Description above the grey prompt when empty
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, with a line, line 1, titled "Replace tie rod" with no description.
- Use a desktop browser window at full screen, at 100% zoom, so the window can be compared with the attached board picture.
- Start on work order 1, on its Lines tab.
- Line 1 is made with a title and no description, as board 1.5 draws it.
Quotes: S1-R2, S1-R3. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-06 · C839516 · Design: Edit Line keeps Status, labor row, link and buttons as drawn
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, with a line, line 1, titled "Replace tie rod" with the description "excessive play".
- Use a desktop browser window at full screen, at 100% zoom, so the window can be compared with the attached board picture.
- Start on work order 1, on its Lines tab.
- X #2276DA; Delete #C10015; Save & Close #2276DA; labor guide link #2276DA 11 px 600 beside the #9C27B0 AI tag.
Quotes: S1-R7. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-07 · C839517 · Design: New Line shows every label and button whole at 1440 pixels
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, that is not invoiced, so you can add a line to it.
- Use a desktop browser window exactly 1440 pixels wide, at 100% zoom.
- Start on work order 1, on its Lines tab.
- Window width 1440 px (browser window, not the screen). The board draws the window 455 px wide; no overlap or clipping was found in the board at 1440 or 1536 px (design/inventory/VISUAL-INVENTORY-2026-10-27.md).
Quotes: S1-R3, S1-R7. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-08 · C839518 · Design: New Line shows every label and button whole at 1536 pixels
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, that is not invoiced, so you can add a line to it.
- Use a desktop browser window exactly 1536 pixels wide, at 100% zoom.
- Start on work order 1, on its Lines tab.
- Window width 1536 px (browser window, not the screen). The board draws the window 455 px wide; no overlap or clipping was found in the board at 1440 or 1536 px (design/inventory/VISUAL-INVENTORY-2026-10-27.md).
Quotes: S1-R3, S1-R7. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-09 · C839519 · Design: Edit Line shows every label and button whole at 1440 pixels
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, with a line, line 1, titled "Replace tie rod" with no description.
- Use a desktop browser window exactly 1440 pixels wide, at 100% zoom.
- Start on work order 1, on its Lines tab.
- Window width 1440 px. Line 1 has no description so the grey prompt is on screen.
Quotes: S1-R3, S1-R7. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-10 · C839520 · Design: Edit Line shows every label and button whole at 1536 pixels
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, with a line, line 1, titled "Replace tie rod" with no description.
- Use a desktop browser window exactly 1536 pixels wide, at 100% zoom.
- Start on work order 1, on its Lines tab.
- Window width 1536 px. Line 1 has no description so the grey prompt is on screen.
Quotes: S1-R3, S1-R7. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-11 · C839521 · Design: Legacy invoice prints title, description and tech story with no labels
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Legacy invoice layout is on (Settings, then Invoice), so work order 1's invoice prints in the legacy layout.
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Have line 1 completed with the tech story "Both outer ends worn, replaced and aligned", and work order 1 completed and invoiced today as invoice A.
- Start on work order 1.
- Legacy invoice layout: Settings → Invoice toggle (off = modern, on = legacy), a fact from the Invoice UI refresh suite; an invoice keeps the layout it was created with, so set the toggle before invoicing. Screen label to confirm on the build.
Quotes: KD-4, OOS-1. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-12 · C839522 · Design: Modern invoice prints the tech story under Scope of work
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Legacy invoice layout is off (Settings, then Invoice), so work order 1's invoice prints in the modern layout.
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Have line 1 completed with the tech story "Both outer ends worn, replaced and aligned", and work order 1 completed and invoiced today as invoice A.
- Start on work order 1.
- Modern layout = Legacy invoice layout off. The heading is drawn as 11 px bold capitals #8b95a3 (board 1.3).
Quotes: KD-4, OOS-1. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-13 · C839523 · Design: Legacy invoice leaves out "Tech story missing."
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Legacy invoice layout is on (Settings, then Invoice), so work order 1's invoice prints in the legacy layout.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab), so line 1 can be completed without a tech story.
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Have line 1 opened in Edit Line and saved once with Save & Close, without typing a tech story, so it holds "Tech story missing.".
- Have line 1 completed without typing a tech story, and work order 1 completed and invoiced today as invoice A.
- Start on work order 1.
- Line 1 holds the placeholder because it was saved once from Edit Line with no tech story (PRD S3-R6, answer 6 of 14 Oct).
Quotes: KD-4, KD-7, S3-R6, OOS-1. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-14 · C839524 · Design: Modern invoice leaves out "Tech story missing."
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Legacy invoice layout is off (Settings, then Invoice), so work order 1's invoice prints in the modern layout.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab), so line 1 can be completed without a tech story.
- Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the description "excessive play".
- Have line 1 opened in Edit Line and saved once with Save & Close, without typing a tech story, so it holds "Tech story missing.".
- Have line 1 completed without typing a tech story, and work order 1 completed and invoiced today as invoice A.
- Start on work order 1.
- Not asserted: whether the "Scope of work" heading still prints with no tech story (no source; proposed question DQ-03).
Quotes: KD-4, KD-7, S3-R6, OOS-1. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.

### D-16 · C839526 · Design: An emptied ShopCoach editor shows its label above the prompt
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, that is not invoiced, for an asset with its year, make and model filled in, so ShopCoach can suggest lines for it.
- Start on work order 1, on its Lines tab.
- Tech plan D5: stack-label on all five fields (picker, Title, Description, and the two ShopCoach editors).
Quotes: S2-R1, S2-R2, S1-R3, D5 (stack-label on all five fields), FR-006 (SV-10131), SV-10131, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing), SV-10391, Milan Zivanovic, 23 Sep 2026 (Checklist), SV-10131, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing). Marker: AUTOMATION: READY - EXPECT FAIL (SV-11850).

### D-17 · C839527 · Design: ShopCoach table rows keep their size when a cell shows its prompt
State the tester sets up:
- Sign in as an Admin at the test location.
- Have an open work order, work order 1, that is not invoiced, for an asset with its year, make and model filled in, so ShopCoach can suggest lines for it.
- Start on work order 1, on its Lines tab.
- Source: tech plan Phase 3 browser-walk step 5 (risk R2) and SV-10391's checklist; the PRD and the design are silent on the table. The grey italic look (developer note on SV-10131) is not asserted here (proposed question DQ-02).
Quotes: S2-R2, FR-006 (SV-10131), Phase 3, browser-walk step 5, SV-10391, Milan Zivanovic, 23 Sep 2026 (Checklist), SV-10131, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing). Marker: AUTOMATION: READY - EXPECT FAIL (SV-11850).

### D-18 · C847725 · Design: Modern invoice prints no Scope of work heading without a tech story
State the tester sets up:
- Sign in as an Admin at the test location.
- Make sure Legacy invoice layout is off (Settings, then Invoice), so work order 1's invoice prints in the modern layout.
- Make sure Require Tech Story is off (Settings, then the Work Orders tab), so line 1 can be completed without a tech story.
- Create a work order for this test, work order 1, with two labor lines: line 1 titled "Replace tie rod" with the description "excessive play", and line 2 titled "Align front axle" with the description "pulls left".
- Have line 1 completed with no tech story and line 2 completed with the tech story "Aligned to spec", and work order 1 completed and invoiced today as invoice A.
- Start on work order 1.
- New 28 Oct 2026 (Product answer 14). Product: a tech story of only spaces prints the heading over a blank block, an existing invoice bug to be ticketed on its own and kept out of these cases.
Quotes: KD-4, OOS-1, Answer 14. Marker: AUTOMATION: HOLD - not yet build-verified on the What/Why QA build.
