# Prep — 22 new run-557 tests for staging (14 Nov 2026)

Found live in run 557 (https://shopview.testrail.io/index.php?/runs/view/557): 22 Untested tests, cases created 14 Nov 03:50–05:24 UTC by TestRail user 3.
Full texts: `../new-tests-1114-full.json`; list: `../new-tests-1114.json`. Nothing run, nothing posted — waiting for the QA lead's go-ahead.

| Group | Tests (case · test) | Ticket today | Data to seed on staging |
|---|---|---|---|
| Columns stay put on open/close | C1145255·4877795 A/R Detail, C1145256·4877796 A/R Collection, C1145257·4877797 A/P Detail, C1145258·4877798 A/P Unpaid, C1145259·4877799 A/R Detail while loading | SV-12763 (Open) | none (staging data is enough) |
| Long no-space names | C1145247·4877787 Customer menu, C1145248·4877788 Vendor menu, C1145249·4877789 A/R Summary, C1145250·4877790 A/P Summary, C1145251·4877791 A/R Detail, C1145252·4877792 A/P Detail, C1145253·4877793 A/R Collection, C1145254·4877794 A/P Unpaid (78 chars), C1145260·4877800 A/R Collection PDF | SV-12722 (Ready to Fix), SV-12764 (Open) | customer + vendor named with the 120-letter name in the test (invoice/bill today, plus an overdue one); vendor with the 78-char name; customer + vendor >60 chars with & " ' < > |
| PDF "Total for" rows | C1145292·4888593 A/R Detail, C1145293·4888594 A/P Detail, C1145294·4888595 A/R Collection, C1145295·4888596 A/P Unpaid | — (S3-R7b, SV-12547 Done) | a customer and a vendor with one 31-60 and one 1-30 document; special-char customer/vendor with two overdue documents + a second customer/vendor |
| Future as-of date exports | C1145296·4888597 | SV-12545 (Ready to Fix) | any customer with an invoice today |
| One location left hides the chip | C1145297·4888598 | — | an as-of date where A/R lists one location (found by the report's own locations call) |
| Blank bucket cell sorts last | C1145298·4888599 A/R Summary, C1145299·4888600 A/P Summary | — | A: $100 10 days overdue · B: $50 credit 10 days ago · C: special-char name, not yet due |

Blocker found 14 Nov ~06:00 UTC: the QA lead's staging session answers 401 (expired since 12 Nov). A fresh sign-in is needed (Rule 138: https://app.staging.shopview.com).
Scripts ready: `stglib.mjs` (session, Karachi browser, STG_LOC, STG_DPR), `s13_inventory.mjs` (read-only inventory), seeding helpers to adapt from `../exec/seedlib.mjs` (staging workplace ids are the same as sv11315's).
