# Confluence comments — page 845348896 "What Are You Doing / Why Are You Doing It?" — captured 2026-10-13

**Page:** https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896 (Confluence version 13 at capture)
**Calls (Atlassian MCP, read-only):**
- `getConfluencePageFooterComments` (status current, includeReplies true, repliesPerComment 25, limit 100, markdown) → **1 top-level footer comment, 1 reply**; no further page (no cursor returned).
- `getConfluencePageInlineComments` with resolutionStatus **open**, **resolved**, **dangling** and **reopened** (includeReplies true) → **0 inline comments in every state**.

**Authors:** `712020:aa00b8d6-a71f-4259-8919-82a304227c20` is **Chris Ward** (the page author/owner per page metadata).
`557058:ead5f72a-46e9-4c4c-adfc-6860a050ad56` is not named by the comments API; it is the tech-planning author.
Jira SV-10403 (Price/Category epic) states that Confluence comment 882475016, which has this same account id,
was "Raised by Milan Zivanovic during tech planning", so this account is **Milan Zivanovic** (attribution taken from
that Jira text; the comments API itself returns only the id).

**Newer than our 30 Sep 2026 capture?** No. Both comments are dated 2026-09-23, before the 2026-09-30 capture.
Bodies are reproduced verbatim as returned (markdown).

---

## Thread 1 — footer comment 882147348

**Author:** Milan Zivanovic (account 557058:ead5f72a-46e9-4c4c-adfc-6860a050ad56) · **Created:** 2026-09-23T08:23:46.388Z · **Status:** current
**Link:** https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896/What+Are+You+Doing+Why+Are+You+Doing+It?focusedCommentId=882147348

**Tech planning notes (FYI, nothing here blocks the build)**

1. **Starting point.** The "first build" referenced in §3 and in the Story 3 context note ("Title: ...;Description: ...") isn't in the released code or in develop. Both still send "What are you doing?: ...;Why are you doing it?: ...;Tech Story: ...". We're building straight from that to the S3-R1 format, so there's no intermediate format to migrate from.
2. **S1-R6 wording.** The current message is "Line Name is a required field", not "Line name is required". Every required-field message in the app uses the "X is a required field" form, so we'll ship "Title is a required field". If you want exactly "Title is required", it's a one-line change, but this would be the only field in the app worded that way.
3. **Story 4: one importer, not two.** The only live import carrying these columns is Administration → Invoices import, which writes to the imported work-order history. There's no separate work order import; the column names S4-R1 renames exist only in unused code. We're giving that importer S4-R2's names ("\*Line Title" / "Line Description"), with the old names still accepted (S4-R3 to S4-R5). If you meant S4-R1's plain "Title" / "Description" for it instead, let us know.
4. **The downloaded report gets shortened too.** Today only the live sync cuts long lines, and it cuts by bytes, so it can split a character (what S3-R7 rules out). The report has no cut, so the two already differ on very long lines. To keep S3-R4 (same text on both routes), the report will be shortened at the same limit. This only affects lines over roughly 4,000 bytes, which are rare.
5. **"Tech story missing."** Confirmed it reaches QuickBooks today on both routes. S3-R6 stops that.

### Reply 883261444

**Author:** Chris Ward (account 712020:aa00b8d6-a71f-4259-8919-82a304227c20) · **Created:** 2026-09-23T13:49:34.343Z · **Parent:** 882147348 · **Status:** current
**Link:** https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896/What+Are+You+Doing+Why+Are+You+Doing+It?focusedCommentId=883261444

**Answers, in your order.**

**2. S1-R6.** Ship "Title is a required field". Matching every other required-field message in the app beats the PRD's wording. S1-R6 will be updated to that exact string.

**3. Story 4.** Use the S4-R2 names on the Administration → Invoices importer: "\*Line Title" and "Line Description", with the old names still accepted per S4-R3 to S4-R5. Not the plain S4-R1 names.

**4. Shortening.** 4,000 **bytes** on both routes, never splitting a character. Today's sync limit stays as it is and the downloaded report gets the same cut, so S3-R4 holds. The PRD currently says 4,000 characters; that is the line being corrected, not your plan.

**1 and 5.** Understood, nothing needed.

The PRD will be updated to match all of the above.

---

## Inline comments

None — 0 open, 0 resolved, 0 dangling, 0 reopened.
