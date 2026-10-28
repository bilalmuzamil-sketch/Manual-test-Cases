# For the build-verification session (forward by the QA lead) — What/Why, 28 Oct 2026

The QA lead approved filing these four tickets on 28 Oct 2026. They were filed by the test-case session as a one-time exception;
from now on defects go to the "Create defects from testrail…" session. Each was reported by Product (Chris Ward) and **not yet
reproduced by QA**. The QA lead asked that the case markers be left to your session ("Leave it to the other session").

| Ticket | Owning story | What Product reports | Cases it touches (live text is yours, 28 Oct 08:15/10:48 UTC) |
|---|---|---|---|
| SV-11868 | SV-10130 | "Title is a required field" shows only after Save & Close, not on leaving the empty Title (PRD v16 S1-R6) | C154709 (S1-03), C839503 (S1-03b), C549075 (S1-05) |
| SV-11869 | SV-10132 | The downloaded Customer Invoice report adds no apostrophe before a line starting with =, +, - or @ (PRD v16 S3-R8a) | C847722 (S3-25) |
| SV-11870 | SV-10133 | The Invoices import says "Line name cannot be empty." instead of "Line Title cannot be empty." (PRD v16 S4-R8) | C847724 (S4-09) |
| SV-11871 | SV-9386 (QA lead's choice) | Modern invoice: a tech story of only spaces prints the "Scope of work" heading over a blank block (Product: an existing invoice bug, kept out of the What/Why cases) | none |

Suggested (not done): if the behaviour is confirmed on staging, those five cases get `AUTOMATION: READY - EXPECT FAIL (SV-…)` with the
symptom and the three outcomes (Rule 61); if it passes, the ticket can be closed.
