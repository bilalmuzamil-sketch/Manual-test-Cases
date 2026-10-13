# Confluence comments — page 578781186 "Settings "Pricing" And "Categories" Sorting" — captured 2026-10-13

**Page:** https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/578781186 (Confluence version 20 at capture)
**Calls (Atlassian MCP, read-only):**
- `getConfluencePageFooterComments` (status current, includeReplies true, repliesPerComment 25, limit 100, markdown) → **1 top-level footer comment, 3 replies**; no further page (no cursor returned).
- `getConfluencePageInlineComments` with resolutionStatus **open**, **resolved**, **dangling** and **reopened** (includeReplies true) → **0 inline comments in every state**.

**Authors:** `712020:aa00b8d6-a71f-4259-8919-82a304227c20` is **Chris Ward** (page author/owner per page metadata).
`557058:ead5f72a-46e9-4c4c-adfc-6860a050ad56` is not named by the comments API. Jira SV-10403 says Confluence
comment 882475016 (this account) was "Raised by Milan Zivanovic during tech planning", so this account is
**Milan Zivanovic** (attribution taken from that Jira text).

**Newer than our 30 Sep 2026 capture?** No. All four comments are dated 2026-09-23, before the 2026-09-30 capture.
Note: the API returns replies in id order; by creation time the order is 882475010 (09:34), 882475016 (12:07),
882311473 (13:49, Chris Ward's answers to all three). Bodies are reproduced verbatim as returned (markdown).

---

## Thread 1 — footer comment 882311170

**Author:** Milan Zivanovic (account 557058:ead5f72a-46e9-4c4c-adfc-6860a050ad56) · **Created:** 2026-09-23T08:36:11.147Z · **Status:** current
**Link:** https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/578781186/Settings+Pricing+And+Categories+Sorting?focusedCommentId=882311170

**Tech-planning readiness pass — a few items**

Thanks, the PRD is very clear. Reading it against the code, the design canvas and production data turned up these:

1. **FYI, design vs S1-R17.** The second page of the canvas ("The three rules that bite") still draws an unmapped category's QuickBooks cell as empty and sorts it last, and the "Categories – after" caption says the same. That's the rule the 2026-09-15 ruling removed for that column. We're building to the PRD; the boards may just need a touch-up so QA doesn't test the old rule.
2. **S3-R12: the opening order does change.** The server orders part numbers character by character, so under S3-R6 the order on open is different (10GW now comes before 10953464, as the design's own before/after shows). Suggested wording: _"The list opens sorted by Part number ascending (numeric-aware, per S3-R6), and that header shows the ascending arrow."_
3. **Question: the Fixed Rules search box does nothing today.** The server ignores the search term on that tab. Once every rule loads in the browser (S3-R13), the table's built-in search starts filtering on its own, which conflicts with "search keeps working exactly as it does today." Which do you want: **(a)** search works on Fixed Rules, showing matching rows in the current sort; or **(b)** it stays inert for now and gets its own ticket?
4. **Production volumes (FYI).** §6 assumes categories are "tens of rows, not thousands". The largest organization has **1,076** categories (the next are 270 and 249). Fixed Rules peaks at **8,994** rules in one shop (the next are 3,053 and 2,689). Loading everything in the browser still works at those sizes, but the largest shops will see the Fixed Rules tab take a few seconds before it can be sorted. It may be worth updating §6 so QA tests with a large shop.

### Reply 882475010

**Author:** Milan Zivanovic (account 557058:ead5f72a-46e9-4c4c-adfc-6860a050ad56) · **Created:** 2026-09-23T09:34:57.241Z · **Parent:** 882311170 · **Status:** current
**Link:** https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/578781186/Settings+Pricing+And+Categories+Sorting?focusedCommentId=882475010

One more, on wording: we've agreed to use US spelling everywhere, in the app and in the specs and designs behind it. This PRD and its design canvas use UK spelling in a few places ("behaviour" in the Key Decisions, and the canvas page titled "Behaviour"). Could we switch those to US ("behavior") and keep to US spelling in future PRDs, designs and release notes? None of the UI text this feature ships is affected. It's just so the spec, the designs and the release notes match the app.

### Reply 882475016

**Author:** Milan Zivanovic (account 557058:ead5f72a-46e9-4c4c-adfc-6860a050ad56) · **Created:** 2026-09-23T12:07:12.218Z · **Parent:** 882311170 · **Status:** current
**Link:** https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/578781186/Settings+Pricing+And+Categories+Sorting?focusedCommentId=882475016

A few more from a final review of the plan against the PRD:

1. **Fixed rules without a category don't appear at all.** §2 and §4 say a fixed rule can exist without a category (S3-R12b). In practice the Fixed Rules tab only lists rules whose part has a category, so category-less rules are left out of the list entirely. Across every shop that's **3 rules** today. The sort handles an empty category correctly (last in both directions), but there's nothing on screen for S3-R12b to act on, and S3-R13's "all fixed rules load" isn't quite true for those 3. Showing them would change what the server sends, which this PRD rules out. Happy to leave it, or raise it as its own ticket.
2. **S1-R19 and search.** S1-R19 says the Default category stays first "after a search term is typed." Search matches on name, so if the term doesn't match "Uncategorized", it isn't in the results. That's today's behavior, and search is out of scope. We're reading S1-R19 as "first whenever it's in the list." Can you confirm?
3. **S1-N5, "told once."** When the QuickBooks check fails, we'll show "Unable to check QuickBooks connection. Please try again." once. The app's general error handler also shows its own generic error message for the same failure, and that's how it behaves today. Is that OK, or do you want only the one specific message? That's a small extra change.

Until you answer item 3 of the earlier comment, Fixed Rules search stays as it is today (no filtering).

### Reply 882311473

**Author:** Chris Ward (account 712020:aa00b8d6-a71f-4259-8919-82a304227c20) · **Created:** 2026-09-23T13:49:35.829Z · **Parent:** 882311170 · **Status:** current
**Link:** https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/578781186/Settings+Pricing+And+Categories+Sorting?focusedCommentId=882311473

**Answers to all three comments.**

**First comment**

1\. The canvas will be updated to match the PRD. Test S1-R17 as written.

2\. Taking your wording verbatim. S3-R12 will be replaced with: "The list opens sorted by Part number ascending (numeric-aware, per S3-R6), and that header shows the ascending arrow."

3\. **(a)** — let search work on Fixed Rules, matching rows shown in the current sort. A search box that does nothing is a bug, and it comes free with S3-R13. The PRD gains a requirement for it and it goes in the release note.

4\. Yes. §6 will carry the real figures, 1,076 categories and 8,994 fixed rules, and QA should test at that scale. One addition to your plan: while the rules load, the Fixed Rules tab shows a loading indicator and is not interactive until they are ready. A few seconds of a dead-looking tab is the part users will report.

**Second comment**

Agreed. "Behaviour" becomes "behavior" in this PRD and in the canvas page title, and US spelling is now the standing rule for all PRDs, designs and release notes.

**Third comment**

1\. Leave it. S3-R12b and S3-R13 will be reworded to say the tab lists only rules whose part has a category, and the 3 category-less rules get their own ticket. Not this release.

2\. Confirmed: "first whenever it is in the list". S1-R19 will be reworded so it no longer implies we force it into results that do not match.

3\. Only our message. Suppress the generic handler for this failure so S1-N5's "told once" is literally true. The small extra change is worth it.

---

## Inline comments

None — 0 open, 0 resolved, 0 dangling, 0 reopened.
