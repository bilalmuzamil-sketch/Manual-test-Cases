# What/Why — Chris Ward's answers to questions 9-14 (27 Oct 2026)

Source: Google Doc "What/Why (Title and Description) – questions for Chris Ward (14 Oct 2026)",
https://docs.google.com/document/d/1QcT7FRZci6AhYcI33HUac-Oob03-gCnCOKn2NFHMLjA/edit, section "New questions, 27 October 2026".
Answered by Chris Ward on 27 Oct 2026 (Doc last modified 2026-10-27T18:21Z); read 28 Oct 2026 via Drive read_file_content.
Copied word for word. Chris folded answers 9-13 into PRD v16 (Confluence 845348896, 27 Oct 2026).

**Answer: 9. (a) Yes, "Title cannot be longer than 255 characters", from the 256th character, and the line can't be saved while it shows. (b) Yes, before it said "Line name cannot be longer than 255 characters long", so only the wording changed (S1-R6).**

**Answer: 10. (a) Yes. An empty \*Line Title should say "Line Title cannot be empty." The build still says "Line name cannot be empty.", so please log that as a bug against new S4-R8. The other import messages already use the new names and stay as they are.**

**Answer: 11. Testers should expect plain text. In the downloaded Customer Invoice report, a line starting with =, +, -, @, a tab or a carriage return gets one apostrophe in front, the same guard our newer report downloads use. QuickBooks never gets the apostrophe. The build has no guard yet, so please log a bug against new S3-R8a.**

**Answer: 12. (a) No. The report only lists invoices created in ShopView, and imported invoices are stored separately, so they never appear in it (S3-R12). (b) and (c) don't apply. The design board's example is illustrative; the page wins.**

**Answer: 13. Yes, grey italic is expected. An empty Title cell shows "What are you doing?" and an empty Description cell shows "Why are you doing it?", both grey italic. Before, the empty Title cell showed "What Are You Doing?" in normal text (new S2-R2a).**

**Answer: 14. Yes, the "Scope of work" heading is left out with the tech story, so nothing prints under the description. The invoice itself isn't part of this change. Separately: a tech story of only spaces prints the heading over a blank block. That's an existing invoice bug, so please log it as its own ticket and keep it out of the What/Why test cases.**

Closing line under the Doc's sign-off: "Boom! One more down boss!"
