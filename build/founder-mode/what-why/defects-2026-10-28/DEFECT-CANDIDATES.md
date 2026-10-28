# What/Why — four defect candidates (28 Oct 2026)

QA lead, 28 Oct 2026: approved filing all four ("Title message timing, Report apostrophe guard, Import empty-title message,
Spaces-only tech story"). Shape when filed: Story Defect, parent = owning story, relates to the owning story, priority Medium (Rules 52, 53).
**Not filed yet.** Rule 94 A1 needs two reproductions on the current QA build, with the build marker recorded at the start and the end.
That is blocked: this container's network policy refuses sv10130.qa.shopview.com, api.sv10130.qa.shopview.com and staging.shopview.com
(proxy CONNECT 502, 28 Oct 2026), and the QA build's sign-in is Google (cookies from a browser are needed).

A4 (already reported?), 28 Oct 2026: one JQL over project SV for "Title is a required field", "Line name cannot be empty",
"Line Title cannot be empty", "apostrophe formula", "Scope of work", "CSV injection", "formula injection", all statuses, closed included
(`A4-search-2026-10-28.json`, 30 issues). None reports any of the four. Re-run the search right before filing.

| # | Candidate | Owning story | Expectation (verbatim, PRD v16 unless noted) | Case that reproduces it | Product's words |
|---|---|---|---|---|---|
| 1 | "Title is a required field" shows only after a blocked save, not when the user leaves Title empty | SV-10130 | S1-R6: "The message shows under the Title box whenever Title is in error, including when the user leaves it empty, the same as every other field in the dialog (SV-10916)." | S1-03b C839503 | Answer 7 (14 Oct): "The current build shows it only after a blocked save, so please log that as a bug against S1-R6." The developer's 19 Oct note says the build now shows it on leaving the field: reproduce before filing. |
| 2 | The downloaded Customer Invoice report puts no apostrophe before a line starting with =, +, - or @ | SV-10132 | S3-R8a: "In the downloadable Customer Invoice report only, a line text that starts with =, +, -, @, a tab or a carriage return gets one apostrophe in front of it, so a spreadsheet opens it as text and never as a formula." | S3-25 C847722 | Answer 11 (27 Oct): "The build has no guard yet, so please log a bug against new S3-R8a." A3 note: S3-R8a was added to the page on 27 Oct; Product calls it a bug, not new work. |
| 3 | The Invoices import says "Line name cannot be empty." for an empty *Line Title | SV-10133 | S4-R8: "A row whose *Line Title is empty is refused with \"Line Title cannot be empty.\", replacing \"Line name cannot be empty.\"." | S4-09 C847724 | Answer 10 (27 Oct): "The build still says \"Line name cannot be empty.\", so please log that as a bug against new S4-R8." |
| 4 | A tech story of only spaces prints the "Scope of work" heading over a blank block on the modern invoice | the invoice (not What/Why); owning story to find before filing (invoice design work, e.g. SV-9872 / SV-9386 area) | Product's answer 14 (27 Oct): "a tech story of only spaces prints the heading over a blank block. That's an existing invoice bug, so please log it as its own ticket and keep it out of the What/Why test cases." | none (kept out of the What/Why cases, as Product asked) | Answer 14 |

When a ticket exists: S1-03b, S3-25 and S4-09 get `AUTOMATION: READY - EXPECT FAIL (SV-…)` with the symptom and the three outcomes (Rule 61).
