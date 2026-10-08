# Example: test case with a separate Setup doc (draft for the QA lead, 8 Oct 2026). NOT yet the standard.

The QA lead (8 Oct 2026) asked for this layout:
- Preconditions say what is needed to RUN the test.
- The thorough "how to" is the SETUP, kept in a separate Google Doc attached to the test case.
He asked for an example and said to "Wait" before applying it to any cases.

- Setup doc (v2): https://docs.google.com/document/d/1h92KV9dBUO91qoZIdPwkQf-IBqFQSsqYFxGJYVckhG8/edit
- v1 (https://docs.google.com/document/d/16cCIn7FdUfr6V9Tf8CulXcreUNC_JDF9tieYLoelB5w/edit) has a numbering fault (steps restart after a nested list). It was replaced by v2 and is not trashed.

## The test case (C96910) in this layout

**Preconditions**
- Needs: 2 users · 1 browser, desktop, at least 1024 px wide · about 10 minutes
- [User-B]: a user who has never opened Work Orders, with a role that can view Work Orders (e.g. Service Advisor), at [Loc-1]
- Setup: follow "C96910 Setup" (Google Doc, linked) before step 1

**Steps**
1. Sign in as [User-B].
2. Click Work Orders in the top navigation.
3. Refresh the page.

**Expected results**
- Step 2: the page shows List, the plain work order table (not grouped by technician, not columns of cards), and List is highlighted in the display switcher.
- Step 3: the page still shows List.
- Source, exact quotes and AUTOMATION marker: unchanged.
