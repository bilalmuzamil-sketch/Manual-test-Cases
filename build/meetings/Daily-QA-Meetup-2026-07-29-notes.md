# Daily QA Meetup — 2026-07-29 — Meeting Notes (Gemini)

**Source file:** `ca06a22d-Daily_QA__Meetup__2026_07_29_17_45_GMT04_00__Notes_by_Gemini.docx` (user upload, notes by Gemini).
**Meeting:** Daily QA - Meetup, Jul 29 2026, 17:45 GMT+04:00.
**Attendees (invited):** Bilal Muzamil, Ayesha Khan, Nebojsa Glavinic, Viktoria Videnovic.
**Extraction:** full text of word/document.xml, verbatim, paragraph-per-block.

---

Jul 29, 2026

Daily QA - Meetup

Invited Bilal Muzamil Ayesha Khan Nebojsa Glavinic Viktoria Videnovic

Attachments Daily QA - Meetup

Summary

Discussion on production release communication and QA workload challenges resulting in process refinement and prioritization.Production Release Communication GapsImproperly marked or validated tickets merged to production cause significant confusion for quality assurance teams. Standard testing processes must be followed to ensure validity.Quality Assurance Capacity ConstraintsHigh expectations and rapid feature switching inhibit deep knowledge retention for quality assurance staff. Maintaining context is difficult with the current high volume of work.Testing Protocols and StrategyTest cases require ongoing maintenance, including marking irrelevant cases as blocked. Edge case testing remains essential to identify feature vulnerabilities beyond standard requirements.

Decisions

Aligned

Test case maintenance workflow defined The test case maintenance process is established, requiring that irrelevant test cases be marked as blocked, duplicate cases be deleted, and relevant test cases be updated with accurate reproduction steps and expected behaviors.

Edge case documentation strategy Findings from edge case and exploratory testing will be consolidated into a separate, dedicated section specifically for regression and edge case documentation.

We've updated the Decisions section using your feedback.

Let us know what you think: Helpful or Not Helpful

Next steps

[Nebojsa Glavinic] Edit Test Cases: Update test cases during the verification process to ensure wording, elements, and expected behaviors match the environment.

[Nebojsa Glavinic] Manage Irrelevant Tests: Mark test cases that are unrelated to features as blocked, then review them to determine if they should be edited or deleted.

[Nebojsa Glavinic] Report Edge Cases: Create tickets for any edge cases or scenarios that break features during manual creative testing.

[Bilal Muzamil] Document QA Process: Review the meeting notes and create a formal document for the team if the current explanation is unclear.

Details

Production Release Communication Issues: Nebojsa Glavinic and Bilal Muzamil discussed concerns regarding tickets that are merged to staging or production without being properly marked or validated. Bilal Muzamil shared an example regarding an error in the "create invoice" feature, which they were unable to reproduce after initially observing it in production, illustrating the difficulties caused by inconsistent testing processes. They highlighted that the established process requiring developers to ensure bugs are tested after being autofixed is being neglected, leading to instances where developers push to production while still tagging QA. This creates confusion for the QA team regarding their responsibilities and the validity of the production code.

QA Workload and Expectations: Bilal Muzamil and Nebojsa Glavinic reflected on the challenges of team capacity and the high expectations placed on QA staff. Nebojsa Glavinic expressed concern that shifting rapidly between features without breaks prevents the team from retaining deep knowledge, making it difficult to answer inquiries about feature functionality instantly as they were previously able to do. Both participants acknowledged the difficulty of maintaining detailed memory of every ticket given the high volume of work, with Bilal Muzamil sharing an experience where they had to request time to review a ticket regarding "custom roles" when asked about it by Sasha.

Test Case Lifecycle and Validation: Bilal Muzamil explained the lifecycle of test cases, which are initially created in a "VIU to mode" reflecting the product requirements. Once a QA branch becomes available, the "VIU" (Validation) process begins, taking approximately four to five hours to reconcile expected behaviors, steps, and wording with the actual environment. Bilal Muzamil noted that these test cases are only as accurate as the initial specifications provided.

Test Case Maintenance Protocol: Regarding the maintenance of test cases, Bilal Muzamil outlined the protocol for the QA team. If a test case is irrelevant to the feature, it should be marked as "blocked". For test cases with minor conflicts—such as incorrect button placement or expected behavior discrepancies—testers are expected to edit and save them. If an edit results in a duplicate, the test case should be deleted; if the edit creates a new unique test scenario, it should be retained.

Edge Case Testing Strategy: Bilal Muzamil distinguished between standard feature testing and edge case testing. They stated that while test cases cover intended feature functionality, edge cases require creative, imaginative testing by QA to attempt to break the features. When testers successfully break a feature, they should report it via a new ticket. These reports can later be converted into a separate, structured section dedicated to regression or edge cases.

Product Engineering Meeting and Well-being: Ahead of a product engineering meeting, Bilal Muzamil offered to raise any concerns on behalf of the team. The conversation shifted to the necessity of taking breaks to avoid burnout, with both parties discussing the importance of time away from routine work for mental refreshment. Bilal Muzamil mentioned their positive experiences with previous employers who encouraged travel and sponsored professional development courses. The meeting concluded with Bilal Muzamil confirming they would document the discussed QA processes for the team if the notes were unclear.

You should review Gemini's notes to make sure they're accurate. Get tips and learn how Gemini takes notes

How is the quality of these specific notes? Take a short survey to let us know your feedback, including how helpful the notes were for your needs.
