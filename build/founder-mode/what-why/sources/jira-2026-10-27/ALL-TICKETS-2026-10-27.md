# Jira — epic SV-11257, its stories, verify tasks and SV-11850 — read 27 Oct 2026

Read with the Atlassian MCP (searchJiraIssuesUsingJql, markdown bodies) on 27 Oct 2026. Descriptions and comments verbatim. Raw JSON beside this file (raw-*.json). SV-11558 (Founder Mode Batch #2) is linked to the epic (Fixes), not a child.

| Key | Status | Updated | Comments |
|---|---|---|---|
| SV-11257 | TESTING QA | 2026-10-27T09:15:07.069-0500 | 3 |
| SV-10130 | Merged to Staging | 2026-10-23T07:02:55.296-0500 | 5 |
| SV-10131 | Merged to Staging | 2026-10-27T09:15:06.112-0500 | 4 |
| SV-10132 | Merged to Staging | 2026-10-23T07:02:58.631-0500 | 6 |
| SV-10133 | Merged to Staging | 2026-10-23T07:03:00.274-0500 | 6 |
| SV-10390 | Done | 2026-10-21T11:29:33.042-0500 | 0 |
| SV-10391 | Done | 2026-10-21T11:29:34.416-0500 | 0 |
| SV-10392 | Done | 2026-10-21T11:29:35.285-0500 | 0 |
| SV-10393 | Done | 2026-10-21T11:29:36.420-0500 | 1 |
| SV-11850 | Open | 2026-10-27T09:19:30.643-0500 | 0 |
| SV-11558 | Open | 2026-10-21T11:15:14.899-0500 | 0 |

---

## SV-11257 — What Are You Doing / Why Are You Doing It?

- Status: TESTING QA · Updated: 2026-10-27T09:15:07.069-0500

### Description (verbatim)

Work order lines get a title and a description: what is being done, and why. Covers the work order line dialog, the ShopCoach line builder, what reaches QuickBooks, and the imports.

PRD: https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=845348896

Split out of SV-9667 (Founder Mode Batch #1) on 2026-10-13.

### Comments (3)

**Nemanja Djuric** — created 2026-10-19T06:43:56.733-0500 (comment id 78997)

<custom data-type="mention" data-id="id-0">@Chris Ward</custom> <custom data-type="mention" data-id="id-1">@Mudassir Qamar</custom> Title and Description now includes the PRD v14 changes and is redeployed for QA on [sv10130](https://sv10130.qa.shopview.com/) and [qb1](https://qb1.qa.shopview.com/). Attached is a walkthrough video of the whole PR (4.5 min): the line dialog and ShopCoach labels, the QuickBooks/report line text before and after, and the invoice import. [PR #3553](https://github.com/ShopView/shopview/pull/3553) has passed self-review; the QA notes are on SV-10130, SV-10132 and SV-10133.

![](blob:https://media.staging.atl-paas.net/?type=file&localId=ebf7d0dc541d&id=f2fe46b8-4e3a-47c0-b071-d85deae0eeea&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)


**Chris Ward** — created 2026-10-19T14:04:52.777-0500 (comment id 79042)

<custom data-type="mention" data-id="id-0">@Nemanja Djuric</custom> thanks, and thanks for the walkthrough video, that makes review easy. <custom data-type="mention" data-id="id-1">@Mudassir Qamar</custom> over to QA on sv10130 and qb1, against PRD v14 and the QA notes on SV-10130, SV-10132 and SV-10133.

**Mudassir Qamar** — created 2026-10-27T09:14:55.876-0500 (comment id 79590)

Staging re-check against PRD v14 before release.

* Story 1 (line dialog): passed. Title / Description labels on top, question placeholders, Title focused on open, "Title is a required field" on empty save.
* Story 3 (QB line text): passed on the Customer Invoice report. 384 labour lines this month, all "Title - Description - Tech story", with no labels, semicolons, "Tech story missing" or trailing separators.
* Story 4 (imports): passed. Column list and template show Line Title / Line Description.
* Story 2 (ShopCoach builder): could not re-verify on staging. `run-assistant` returns "Failed to parse work description into lines" for every input and the UI shows nothing. This looks like a ShopCoach / staging environment issue, not this change. Filed as SV-11850.

QA OK to release on the bugfix schedule, pending a ShopCoach check.

---

## SV-10130 — Title and Description - Story 1 - The Work Order Line Dialog

- Status: Merged to Staging · Updated: 2026-10-23T07:02:55.296-0500

### Description (verbatim)

## Summary

Rename the two work order line fields to Title and Description everywhere a person reads them, and keep the two questions as placeholder text inside the boxes.

## Context

The two fields are labelled with the questions today, "What are you doing?" and "Why are you doing it?". Those are prompts for the writer rather than names of anything, and they are read back to people who never saw the dialog. This story covers the dialog only. What reaches QuickBooks is Story 3.

## Requirements

* S1-R1: The first field is labelled exactly "Title".
* S1-R2: The second field is labelled exactly "Description".
* S1-R3: The Title box carries the placeholder "What are you doing?" and the Description box carries "Why are you doing it?". Placeholder text shows while the box is empty and disappears as soon as there is a value.
* S1-R4: The label does not change with the state of the field. It reads "Title" whether the canned-line picker is empty or filled, replacing a rule that swapped the label between the question and "Title" depending on that state.
* S1-R5: The canned-line picker at the top of the dialog is labelled "Title" and carries the placeholder "What are you doing?" in its typeahead box, the same as the free-text Title field. The dialog focuses this field on open, so the placeholder is visible the moment the dialog appears and clears as soon as the user types or picks a canned line.
* S1-R6: Leaving Title empty blocks the save with the message "Title is required", replacing "Line name is required".
* S1-R7: Nothing else about the dialog changes: same fields in the same order, same validation, same values saved.
* S1-N1: No existing line is altered. The rename is on the labels, not on the data.

## Acceptance Criteria

- [ ] Given the New Line dialog is open, then the canned-line picker is labelled "Title" and its typeahead box shows the placeholder "What are you doing?".
- [ ] Given the New Line dialog is open, then the free-text fields are labelled "Title" and "Description", with placeholders "What are you doing?" and "Why are you doing it?".
- [ ] Given the Edit Line dialog is open on an existing line, then the same two labels are shown and the saved values appear unchanged.
- [ ] Given a user types into Title, then the placeholder disappears and the label still reads "Title".
- [ ] Given a canned line has been picked, then the picker label still reads "Title" and does not change to a question.
- [ ] Given Title is empty, when the user saves, then the save is blocked and the message reads exactly "Title is required".
- [ ] Given a line created before this change, when it is opened, then its title and description values are exactly as they were saved.

## UI/UX

Design: [Line Title And Description - Design Canvas](https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6)

## PRD

[What Are You Doing / Why Are You Doing It? - Product Requirements](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896/What+Are+You+Doing+Why+Are+You+Doing+It)

### Comments (5)

**Nemanja Djuric** — created 2026-10-07T04:29:29.837-0500 (comment id 78035)

**TECH PLAN**  
[Title and Description — Technical Implementation Plan](https://powertools.shopview.com/md-viewer/2cb42c08-54d6-40ef-b98b-696198c19feb)

**Vladimir Tomovic** — created 2026-10-07T06:10:12.871-0500 (comment id 78099)

**Test cases for SV-10130** - TestRail section Founder Mode (September 2026) (§20434), run [R495](https://shopview.testrail.io/index.php?/runs/view/495). 4 case(s): 4 for automation, 0 manual. 4 case(s) are not in a run yet; they link to the case.

**Automation (4: 0 automated, 4 planned)**

* [C154707](https://shopview.testrail.io/index.php?/cases/view/154707) New Line labels its fields Title and Description, with question hints - _automation planned_ - not in a run yet
* [C154708](https://shopview.testrail.io/index.php?/cases/view/154708) The Title label stays put, and the canned line picker is labelled Title - _automation planned_ - not in a run yet
* [C154709](https://shopview.testrail.io/index.php?/cases/view/154709) An empty Title blocks saving with "Title is a required field" - _automation planned_ - not in a run yet
* [C154710](https://shopview.testrail.io/index.php?/cases/view/154710) Nothing else in the New Line window changes, existing lines stay as they are - _automation planned_ - not in a run yet

**Manual (0)**

* none

_"automated" = a Playwright E2E test exists (latest result shown); "automation planned" = assigned for automation, not written yet. Results are from sv9667 (PR #3369 build)._

**Nemanja Djuric** — created 2026-10-08T03:23:11.193-0500 (comment id 78210)

**Ready for QA testing.**

**QA Severity:** Medium

**QA env:** [sv10130.qa.shopview.com](https://sv10130.qa.shopview.com/)  ·  QuickBooks testing (SV-10132): [qb1.qa.shopview.com](https://qb1.qa.shopview.com/)  ·  PR: [#3553](https://github.com/ShopView/shopview/pull/3553)  ·  [PRD](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896)

SV-10130, SV-10131, SV-10132 and SV-10133 ship together in one branch (PR #3553). sv10130 is the QA env for everything; qb1 runs the same code against the sv10130 backend and is only needed for the QuickBooks steps (it is the host QuickBooks can connect to). Log in as admin unless a step says otherwise.

### What changed

* The two work order line fields are labelled Title and Description; the questions "What are you doing?" / "Why are you doing it?" are now the placeholders.
* Saving with an empty Title is blocked and "Title is a required field" now shows under the Title field (the dialog used to hide every field message; other fields still do).

### Test plan: New Line (Work order → Lines → New Line)

* The first field is labelled "Title" with "What are you doing?" inside it, and the cursor is in it when the dialog opens.
* The second field is labelled "Description" with "Why are you doing it?" inside it.
* Tab away from the empty Title: the prompt stays, the label still reads "Title", and no error message shows.
* Click Save & Close with Title empty: the save is blocked and "Title is a required field" shows under Title; the dialog stays open; no other field shows a message.
* Type a title: the prompt disappears and the label is still "Title". Tab away: the typed title stays, with no prompt beside it.
* Pick a canned line from this workplace: the field still reads "Title" and no prompt sits beside the picked name. Save: the line is created with the canned title and description as before.
* Phone width (≤ 600px): the same labels, prompts and message.

### Test plan: Edit Line (click an existing line's title)

* The fields read "Title" and "Description" and the saved values are unchanged.
* Clear the Description: "Why are you doing it?" appears.
* Clear the Title and click Save & Close: blocked with "Title is a required field". Close without saving: the line is unchanged.

### Known gaps (please don't log as new bugs)

* The Jira story says "Title is required"; the PRD (source of truth) says "Title is a required field", which is what ships.
* After a blocked save, emptying the Title again shows the message again until the dialog is saved or closed (normal after-submit behaviour).
* Pre-existing, same on develop: if you tab away from the empty Title before Labor Rate has loaded, Labor Rate stays empty. A follow-up ticket is being drafted.
* The design board shows "Title \*"; there is no asterisk, because today's field never had one and the PRD says nothing else changes.

### E2E coverage

* E2E: the template round trip (C2274) and the visible Title message (C23) are automated. The label/placeholder checks for the line dialog and ShopCoach, and the legacy-header import, are covered by unit and BE functional tests (dev-layer TestRail cases C154707–C154725) instead of E2E.



**Nemanja Djuric** — created 2026-10-19T03:49:06.809-0500 (comment id 78971)

**QA update: develop merged in, PRD v14.**

**QA env:** [sv10130.qa.shopview.com](https://sv10130.qa.shopview.com/)  ·  QuickBooks: [qb1.qa.shopview.com](https://qb1.qa.shopview.com/)  ·  PR: [#3553](https://github.com/ShopView/shopview/pull/3553)  ·  [PRD v14](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896)

The branch now includes the latest develop and the PRD v14 changes (answers to Bilal's QA questions). Everything from the first handoff still applies except where this comment says otherwise.

### What changed

* "Title is a required field" now shows as soon as you leave an empty Title, not only after a blocked save (S1-R6, per SV-10916). Every other field in the dialog also shows its message whenever it is in error.
* A Title over 255 characters shows "Title cannot be longer than 255 characters" from the 256th character; deleting one clears it. Saving is blocked while it shows.

### Replace these test steps

* New Line: tab away from the empty Title. "Title is a required field" shows under Title; the label still reads "Title" and the prompt stays inside the box.
* Edit Line: clear the Title and tab away. The same message shows. Close without saving: the line is unchanged.
* New Line and Edit Line: type 256 characters into Title. "Title cannot be longer than 255 characters" shows and Save & Close is blocked; delete one character and it clears.

### No longer gaps

* "After a blocked save, emptying the Title again shows the message again": this is now the intended behaviour everywhere, not a gap.
* "The design board shows Title \*": the design now has no asterisk either (S1-R1), matching the build.



**Mudassir Qamar** — created 2026-10-20T09:55:03.389-0500 (comment id 79126)

QA – sv10130 (PRD v14) ✅  
New Line:

* Labels "Title" / "Description", placeholders "What are you doing?" / "Why are you doing it?"; cursor in Title on open
* Tab away from empty Title → "Title is a required field", label stays "Title", prompt stays
* Save & Close with empty Title → blocked, dialog stays, only Title shows a message
* 256 chars → "Title cannot be longer than 255 characters", save blocked; delete one → clears
* Typed title → prompt gone, label "Title"
* Canned line (Replace - Brake pot) → label "Title", no prompt; saved as before (2 parts, $224.92)  
  Edit Line (S2-17358 line 1):
* Same labels, saved values unchanged
* Clear Description → "Why are you doing it?"; clear Title + tab → "Title is a required field"
* Close without saving → line unchanged after reload  
  Not run: phone width  
  TestRail: C154707–C154710 passed  
  Video attached.  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=d03613241d18&id=aa3e6012-7d81-4cd4-96f0-327e6241e7b9&&collection=&height=765&occurrenceKey=null&width=1568&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



---

## SV-10131 — 

- Status: Merged to Staging · Updated: 2026-10-27T09:15:06.112-0500

### Description (verbatim)

## Summary

Give the ShopCoach line builder the same two field names and placeholders as the work order line dialog, so the two surfaces do not disagree.

## Context

ShopCoach writes an ordinary work order line. If the builder keeps the questions while the dialog uses the names, the same value is labelled two different ways depending on where the writer started.

## Requirements

* S2-R1: The line builder's two text fields are labelled "Title" and "Description".
* S2-R2: Both carry the same placeholders as S1-R3: "What are you doing?" on Title and "Why are you doing it?" on Description.
* S2-R3: What ShopCoach generates and writes into a line is unchanged. A generated line becomes an ordinary work order line and follows Story 3 like any other.

## Acceptance Criteria

- [ ] Given the ShopCoach line builder is open, then its two fields are labelled "Title" and "Description".
- [ ] Given the ShopCoach line builder is open with both fields empty, then the placeholders read "What are you doing?" and "Why are you doing it?".
- [ ] Given a line is generated by ShopCoach, then the values written into the work order line are the same as before this change.
- [ ] Given a line generated by ShopCoach reaches an invoice, then its line text follows Story 3 with no special handling.

## UI/UX

Design: [Line Title And Description - Design Canvas](https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6)

## PRD

[What Are You Doing / Why Are You Doing It? - Product Requirements](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896/What+Are+You+Doing+Why+Are+You+Doing+It)

### Comments (4)

**Vladimir Tomovic** — created 2026-10-07T06:10:15.992-0500 (comment id 78100)

**Test cases for SV-10131** - TestRail section Founder Mode (September 2026) (§20434), run [R495](https://shopview.testrail.io/index.php?/runs/view/495). 2 case(s): 1 for automation, 1 manual. 2 case(s) are not in a run yet; they link to the case.

**Automation (1: 0 automated, 1 planned)**

* [C154711](https://shopview.testrail.io/index.php?/cases/view/154711) The ShopCoach line builder labels its fields Title and Description too - _automation planned_ - not in a run yet

**Manual (1)**

* [C154712](https://shopview.testrail.io/index.php?/cases/view/154712) ShopCoach still generates the same text, and the line works like any other - _ShopCoach AI output is not deterministic_ - not in a run yet

_"automated" = a Playwright E2E test exists (latest result shown); "automation planned" = assigned for automation, not written yet. Results are from sv9667 (PR #3369 build)._

**Nemanja Djuric** — created 2026-10-08T03:23:41.543-0500 (comment id 78211)

**Ready for QA testing.**

**QA Severity:** Low

**QA env:** [sv10130.qa.shopview.com](https://sv10130.qa.shopview.com/)  ·  QuickBooks testing (SV-10132): [qb1.qa.shopview.com](https://qb1.qa.shopview.com/)  ·  PR: [#3553](https://github.com/ShopView/shopview/pull/3553)  ·  [PRD](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896)

SV-10130, SV-10131, SV-10132 and SV-10133 ship together in one branch (PR #3553). sv10130 is the QA env for everything; qb1 runs the same code against the sv10130 backend and is only needed for the QuickBooks steps (it is the host QuickBooks can connect to). Log in as admin unless a step says otherwise.

### What changed

* The ShopCoach line builder's editors are labelled Title and Description with the same prompts as the line dialog; empty cells read "What are you doing?" / "Why are you doing it?" in sentence case, grey italic.

### Test plan (Work order → Lines → ShopCoach Line Builder → Build Lines)

* Click a suggested line's title cell: the editor is labelled "Title"; empty it and "What are you doing?" shows.
* Click the description cell: the editor is labelled "Description"; empty it and "Why are you doing it?" shows.
* Empty cells read the prompts in sentence case, grey italic; table cells don't grow or shift.
* Add the generated lines to the work order: they are created exactly as before (same titles and descriptions).

### E2E coverage

* E2E: the template round trip (C2274) and the visible Title message (C23) are automated. The label/placeholder checks for the line dialog and ShopCoach, and the legacy-header import, are covered by unit and BE functional tests (dev-layer TestRail cases C154707–C154725) instead of E2E.



**Mudassir Qamar** — created 2026-10-23T06:48:04.698-0500 (comment id 79401)

**QA — PASS** (qb1.qa / sv10130api, 23 Oct 2026, WO S2-17477 → invoice S10130-17477)

| # | Acceptance criterion | What I did | Result |
| --- | --- | --- | --- |
| AC1 | Fields labelled "Title" / "Description" | Opened ShopCoach line builder on WO S2-17477 | ✅ |
| AC2 | Placeholders "What are you doing?" / "Why are you doing it?" | Builder open with both fields empty | ✅ |
| AC3 | Generated values unchanged | Generated "DOT Inspection" line, compared builder output vs saved WO line | ✅ identical |
| AC4 | Generated line follows Story 3 | Invoiced + synced to QBO (CA sandbox) and Customer Invoice export | ✅ "DOT Inspection" (title only, no separator, no labels) |


**Mudassir Qamar** — created 2026-10-23T06:51:51.165-0500 (comment id 79404)

**Update:** Merging to staging.

---

## SV-10132 — 

- Status: Merged to Staging · Updated: 2026-10-23T07:02:58.631-0500

### Description (verbatim)

## Summary

Change the line text that reaches a shop's accounting records so it carries none of our field names: the title, the description and the technician's narrative joined by a spaced hyphen, with no labels and no semicolons.

## Context

A line arrives in QuickBooks today reading "What are you doing?: Replace front brake pads;Why are you doing it?: Customer reports grinding;Tech Story: ". Two customers have asked in writing for this to stop: NCCHD (SV-6862, 15 users, open) and KMS Mechanics (SV-6582, 34 users). One builder produces this text and both routes into QuickBooks use it, the live sync and the downloadable Customer Invoice report, so one change fixes both and the two can never drift apart.

## Requirements

* S3-R1: A line's text joins the title, the description and the technician's narrative with a spaced hyphen and no labels: "Replace tie rod - excessive play - Both outer ends worn, replaced and aligned".
* S3-R2: The separator is exactly one space, one hyphen-minus, one space.
* S3-R3: A separator appears only between two segments that are both present. A line with no description joins the title straight to the narrative; a line with no narrative ends after the description; a line with neither carries the title alone. In every case there is no trailing separator and no trailing space.
* S3-R4: The same text is used by the live QuickBooks sync and by the downloadable Customer Invoice report. The two can never show different text for the same line.
* S3-R5: The technician's narrative is the third and last segment. It carries no label of any kind, and no semicolon appears anywhere in the line text.
* S3-R6: A narrative is absent when the value is empty, or when it is the literal placeholder "Tech story missing." that the line dialog writes when nothing was typed. The two are treated identically and neither reaches QuickBooks.
* S3-R6a: A narrative is absent legitimately, not only exceptionally. The organization setting Administration, Work Order Settings, Require Tech Story governs whether the completion gate demands one, and it is off by default.
* S3-R7: When the joined text is too long for QuickBooks it is shortened from the end before it is sent, and it is never cut in the middle of a character. Because the title leads and the narrative trails, the title always survives and the narrative is clipped first.
* S3-R7a: The limit is a storage limit rather than a count of what a reader sees, so a line written with accented or non-Latin characters may be shortened more than an English line that looks the same length on screen. That is correct behaviour and not a defect.
* S3-R8: The values themselves are unchanged. Nothing is trimmed, truncated, re-cased or escaped that is not trimmed, truncated, re-cased or escaped today, other than the shortening in S3-R7.
* S3-R9: A title, a description or a narrative that itself contains a hyphen is carried as written. The separator is not escaped and the text is not quoted.
* S3-R9a: A semicolon typed inside any of the three values is ordinary punctuation and is carried through untouched.
* S3-R10: For a user who cannot see financial data, the downloaded report masks its money columns as it does today. The line text is not a money value and is not masked.
* S3-R11: No other report or export reads this line text.
* S3-R12: An imported historical invoice never reaches the live QuickBooks sync, so its line text is unaffected whatever the import wrote into it.
* S3-N1: Invoices already in QuickBooks keep the text they were sent with. Nothing is re-synced, re-exported or rewritten.
* S3-N2: No line falls back to the old labels or the old questions, including lines created before this change.
* S3-N3: A parts line, a shop supplies line and a fee or discount line are unaffected: none carries a title-and-description pair.

## Acceptance Criteria

- [ ] Given a line with a title, a description and a narrative, when it reaches QuickBooks, then the description reads "Replace tie rod - excessive play - Both outer ends worn, replaced and aligned" with no labels and no semicolons.
- [ ] Given a line with a title and a description but no narrative, then the text ends after the description with no trailing hyphen and no trailing space.
- [ ] Given a line whose narrative is the literal "Tech story missing.", then the text ends after the description exactly as if the narrative were empty.
- [ ] Given a line with a title and a narrative but no description, then the text reads "Replace tie rod - Both outer ends worn, replaced and aligned": one separator, not two.
- [ ] Given a line with a title only, then the text is the title alone with no separator.
- [ ] Given the organization setting Require Tech Story is off and a line is completed with no narrative, then the invoice syncs and the line text ends after the description.
- [ ] Given a description containing a typed semicolon, then the semicolon is carried through unchanged.
- [ ] Given a title or description containing a spaced hyphen, then it is carried as written and nothing is escaped or quoted.
- [ ] Given a joined text longer than the QuickBooks limit, when it is sent, then it is shortened from the end, the cut does not fall inside a character, the title is intact, and the invoice syncs rather than landing in Unexported Items.
- [ ] Given the same invoice is both synced and downloaded as the Customer Invoice report, then the line text is identical in both.
- [ ] Given an invoice that reached QuickBooks before this change, then its stored text is not re-sent, re-exported or rewritten.
- [ ] Given a parts line, a shop supplies line or a fee or discount line, then nothing about its description changes.

## UI/UX

Design: [Line Title And Description - Design Canvas](https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6)

## PRD

[What Are You Doing / Why Are You Doing It? - Product Requirements](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896/What+Are+You+Doing+Why+Are+You+Doing+It)

### Comments (6)

**Vladimir Tomovic** — created 2026-10-07T06:10:22.792-0500 (comment id 78101)

**Test cases for SV-10132** - TestRail section Founder Mode (September 2026) (§20434), run [R495](https://shopview.testrail.io/index.php?/runs/view/495). 10 case(s): 7 for automation, 3 manual. 10 case(s) are not in a run yet; they link to the case.

**Automation (7: 0 automated, 7 planned)**

* [C154713](https://shopview.testrail.io/index.php?/cases/view/154713) Invoice line text joins the three parts with spaced hyphens, no labels - _automation planned_ - not in a run yet
* [C154714](https://shopview.testrail.io/index.php?/cases/view/154714) A hyphen appears only between two filled-in parts of the line text - _automation planned_ - not in a run yet
* [C154716](https://shopview.testrail.io/index.php?/cases/view/154716) A missing description is left out, including "Tech story missing." - _automation planned_ - not in a run yet
* [C154717](https://shopview.testrail.io/index.php?/cases/view/154717) Line text over 4,000 bytes is shortened from the end, title kept - _automation planned_ - not in a run yet
* [C154718](https://shopview.testrail.io/index.php?/cases/view/154718) Values keep their own hyphens and semicolons as written - _automation planned_ - not in a run yet
* [C154719](https://shopview.testrail.io/index.php?/cases/view/154719) The report hides money for users without financial access, not line text - _automation planned_ - not in a run yet
* [C154722](https://shopview.testrail.io/index.php?/cases/view/154722) Parts, shop supplies and fee or discount lines are unchanged - _automation planned_ - not in a run yet

**Manual (3)**

* [C154715](https://shopview.testrail.io/index.php?/cases/view/154715) The QuickBooks sync and the downloaded report show the same line text - _QuickBooks (QBO E2E is blocked)_ - not in a run yet
* [C154720](https://shopview.testrail.io/index.php?/cases/view/154720) Only the QuickBooks sync and report use this text, imported history is not - _code audit ("no other report reads this text"), not a UI test_ - not in a run yet
* [C154721](https://shopview.testrail.io/index.php?/cases/view/154721) Existing QuickBooks invoices keep their text, a reversal sends the new text - _QuickBooks (QBO E2E is blocked)_ - not in a run yet

_"automated" = a Playwright E2E test exists (latest result shown); "automation planned" = assigned for automation, not written yet. Results are from sv9667 (PR #3369 build)._

**Nemanja Djuric** — created 2026-10-08T03:23:42.724-0500 (comment id 78212)

**Ready for QA testing.**

**QA Severity:** High

**QA env (QuickBooks):** [qb1.qa.shopview.com](https://qb1.qa.shopview.com/) (this branch's code, using the sv10130 backend)  ·  PR: [#3553](https://github.com/ShopView/shopview/pull/3553)  ·  [PRD](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896)

SV-10130, SV-10131, SV-10132 and SV-10133 ship together in one branch (PR #3553). sv10130 is the QA env for everything; qb1 runs the same code against the sv10130 backend and is only needed for the QuickBooks steps (it is the host QuickBooks can connect to). Log in as admin unless a step says otherwise.

### What changed

* A labor line's text in QuickBooks Online and in the Customer Invoice report is now "Title - Description - Tech story" (no field names, no semicolons) instead of "What are you doing?: …;Why are you doing it?: …;Tech Story: …".
* A missing part is skipped, "Tech story missing." is dropped, and a line over 4,000 bytes is shortened from the end without breaking a character, the same way on both routes.

### Test plan (on qb1: connect a QuickBooks sandbox company first)

* Invoice a work order whose labor line has a title, description and tech story: in QuickBooks the line description reads "Title - Description - Tech story".
* A line with no description reads "Title - Tech story" (one separator, no gap).
* With Administration → Work Order Settings → Require Tech Story off and no story typed (or the story "Tech story missing."): the line ends after the description, with no trailing hyphen or space.
* A description of \~5,000 characters with accented letters (é, ü): the invoice syncs (not in QB Unexported Items), the title is intact and the end has no broken character.
* Reports → Export Reports → Customer Invoice for the same dates: ItemDescription is identical to what QuickBooks received, including long lines.
* The same export as a user without "See financial data": the line text is identical and ItemRate / ItemAmount / ItemTaxAmount read "Restricted".
* Part, shop supplies and fee/discount rows: their descriptions are unchanged in QuickBooks and in the export.
* An invoice synced before the deploy is unchanged in QuickBooks (nothing is re-sent).

### Known gaps

* The live QuickBooks sync could not be exercised locally; unit tests prove the sync sends exactly the report's text. qb1 is the place to verify it against a QuickBooks sandbox (also tracked in SV-10390).
* Pre-existing: CSV exports never escape spreadsheet formulas. The labor ItemDescription cell is newly exposed because it no longer starts with "What are you doing?: ", so a title that starts with =, +, - or @ opens as a formula in Excel. QuickBooks itself is unaffected. A follow-up ticket is being drafted.



**Nemanja Djuric** — created 2026-10-19T03:49:23.589-0500 (comment id 78972)

**QA update: develop merged in, PRD v14.**

**QA env (QuickBooks):** [qb1.qa.shopview.com](https://qb1.qa.shopview.com/) (this branch, sv10130 backend)  ·  PR: [#3553](https://github.com/ShopView/shopview/pull/3553)  ·  [PRD v14](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896)

The branch now includes the latest develop and the PRD v14 changes (answers to Bilal's QA questions). Everything from the first handoff still applies except where this comment says otherwise.

### Extra checks (PRD v14 clarifications, already in the build)

* A description made only of spaces counts as empty: the line reads "Title - Tech story", one separator, no gap (S3-R3).
* A tech story made only of spaces counts as empty: the line ends after the description, with no trailing hyphen (S3-R6).
* A tech story ending in spaces or blank lines: the QuickBooks line ends at its last word (S3-R8). Spaces inside the text are kept as typed.
* Download Reports → Export Reports → Customer Invoice for an invoice synced before this deploy: the report shows the new wording, while QuickBooks keeps the old text for that invoice (S3-E4).
* "Tech story missing." is written when Edit Line saves an existing line that has no tech story; a line saved from New Line keeps an empty one. Both read the same in QuickBooks: the line ends after the description (S3-R6).



**Mudassir Qamar** — created 2026-10-23T06:48:05.291-0500 (comment id 79402)

**QA — PASS** (qb1.qa / sv10130api → QBO Sandbox Company CA 3e09, 23 Oct 2026)  
Invoice **S10130-17477** (WO S2-17477), Require Tech Story = OFF. Checked both routes: Customer Invoice export (CSV) and live QBO sync (QBO txnId 260).

| # | Case | Line text in QBO | Export = QBO | Result |
| --- | --- | --- | --- | --- |
| 1 | Title + description + story | Replace tie rod - Excessive play - Both outer ends worn, replaced and aligned | ✅ | ✅ |
| 2 | Title with spaced hyphen, no description, story with `;` | Brake inspection - front axle - Pads at 3mm; rotors OK | ✅ | ✅ one separator, `;` kept |
| 3 | Description with `;`, no story | Wiper blades - Streaking; driver side | ✅ | ✅ no trailing sep/space |
| 4 | Title only | Fluid top-up | ✅ | ✅ |
| 5 | ShopCoach line, title only | DOT Inspection | ✅ | ✅ |
| 6 | Story = "Tech story missing." | Replace - Rear ramp handles␣␣- Broken off | ✅ | ✅ placeholder dropped (see note) |
| 7 | Long line (5,214 bytes, accented chars) | Clipped to 4,000 bytes / 3,446 chars, title intact, no U+FFFD | ✅ | ✅ synced, not in Unexported |
| 8 | Parts + shop supplies lines | FREIGHT : Freight · 202-009: Walk Ramp Handle · Shop supplies | ✅ | ✅ unchanged |
| 9 | No labels / no "What are you doing?" anywhere | All lines | — | ✅ |

**Question for dev:** case 6 shows a double space before the separator because the line title was saved with a trailing space ("Replace "). Values are kept as-is (S3-R8), so this looks by design — confirm OK vs trimming per S3-R3.

**Not covered:** fee/discount line (none on this invoice); S3-N1 re-sync of an invoice exported before the change.

Env note: qb1 had been connected to the US sandbox (tax-code error "TAX or NON"); reconnected to CA 3e09 and remapped — not a code issue.

Evidence: SV-10132_customer_invoice_export_S10130-17477.csv, SV-10132_QBO_CA_invoice_S10130-17477_lines.jpg

**Mudassir Qamar** — created 2026-10-23T06:51:50.577-0500 (comment id 79403)

**Update:** Merging to staging. Trailing-space / double-space question resolved — **keep, by design** (S3-R8). Line end is trimmed, whitespace-only values are skipped. No change for this release.

**Nemanja Djuric** — created 2026-10-23T06:56:21.089-0500 (comment id 79405)

<custom data-type="mention" data-id="id-0">@Mudassir Qamar</custom> **Keep.** The double space is by design, so nothing changes for this release.

* Each value goes through exactly as typed (S3-R8). If a value was saved with a trailing space, it keeps that space, and the ` - ` separator then adds its own.
* S3-R3's "no trailing space" covers only the end of the line. The code trims the end of the joined text, so no line ends in a space.
* A value that is only spaces still counts as empty and is skipped, so it never leaves an empty segment between separators (PRD v14).

If product wants the edges of each value trimmed before they're joined, that's a small change. But it would change S3-R8, so it would go to Chris as a separate ticket rather than into this release.

Thanks for the thorough pass.

---

## SV-10133 — 

- Status: Merged to Staging · Updated: 2026-10-23T07:03:00.274-0500

### Description (verbatim)

## Summary

Rename the two columns in both importers to match the product, and keep every spreadsheet a shop has already saved working by accepting the old column names as well.

## Context

Both importers compare headers strictly, one by exact-set difference and one by ordered equality of the first 24 headers. A plain rename would have failed every file a shop had saved from the old template, so the old names have to keep validating.

## Requirements

* S4-R1: The work order import's two columns are named "Title" and "Description", replacing "What are you doing" and "Why are you doing it".
* S4-R2: The historical invoice import's two columns are named "\*Line Title" and "Line Description", replacing "\*Line Title - What are you doing" and "Line Description - Why are you doing it".
* S4-R3: Both importers accept the old column names as well as the new ones. A file carrying either spelling validates and imports identically.
* S4-R4: A file may mix the two spellings, carrying one column under its old name and the other under its new one.
* S4-R5: The old name is accepted as the column it became: it is neither reported missing nor reported as a column to remove.
* S4-R6: The downloadable sample file and the on-screen column list both show the new names.
* S4-R7: Every other column name, and the required order of columns, is unchanged.
* S4-N1: A genuinely unrecognized column is still rejected. The compatibility rule covers exactly the two renamed columns and nothing else.

## Acceptance Criteria

- [ ] Given a work order import file using the new column names, then it validates and imports.
- [ ] Given a work order import file saved from the old template, then it validates and imports identically, with no warning about a missing or extra column.
- [ ] Given a file carrying one column under its old name and the other under its new name, then it validates and imports.
- [ ] Given a historical invoice import file using either spelling of the two columns, then it validates and imports.
- [ ] Given the sample file is downloaded, then its two columns show the new names.
- [ ] Given the on-screen column list is viewed, then it shows the new names.
- [ ] Given a file carrying a column name that is neither the old nor the new spelling, then it is rejected and the message names the column missing and the column to remove.
- [ ] Given any import file, then every other column name and the required column order behaves exactly as before.

## UI/UX

Design: [Line Title And Description - Design Canvas](https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6)

## PRD

[What Are You Doing / Why Are You Doing It? - Product Requirements](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896/What+Are+You+Doing+Why+Are+You+Doing+It)

### Comments (6)

**Vladimir Tomovic** — created 2026-10-07T06:10:26.225-0500 (comment id 78102)

**Test cases for SV-10133** - TestRail section Founder Mode (September 2026) (§20434), run [R495](https://shopview.testrail.io/index.php?/runs/view/495). 3 case(s): 3 for automation, 0 manual. 3 case(s) are not in a run yet; they link to the case.

**Automation (3: 0 automated, 3 planned)**

* [C154723](https://shopview.testrail.io/index.php?/cases/view/154723) Invoice import columns are renamed to Line Title and Line Description - _automation planned_ - not in a run yet
* [C154724](https://shopview.testrail.io/index.php?/cases/view/154724) Old import column names still work, and a file may mix old and new - _automation planned_ - not in a run yet
* [C154725](https://shopview.testrail.io/index.php?/cases/view/154725) Other import columns and their order are unchanged - _automation planned_ - not in a run yet

**Manual (0)**

* none

_"automated" = a Playwright E2E test exists (latest result shown); "automation planned" = assigned for automation, not written yet. Results are from sv9667 (PR #3369 build)._

**Nemanja Djuric** — created 2026-10-08T03:24:13.497-0500 (comment id 78213)

**Ready for QA testing.**

**QA Severity:** Medium

**QA env:** [sv10130.qa.shopview.com](https://sv10130.qa.shopview.com/)  ·  QuickBooks testing (SV-10132): [qb1.qa.shopview.com](https://qb1.qa.shopview.com/)  ·  PR: [#3553](https://github.com/ShopView/shopview/pull/3553)  ·  [PRD](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896)

SV-10130, SV-10131, SV-10132 and SV-10133 ship together in one branch (PR #3553). sv10130 is the QA env for everything; qb1 runs the same code against the sv10130 backend and is only needed for the QuickBooks steps (it is the host QuickBooks can connect to). Log in as admin unless a step says otherwise.

### What changed

* Administration → Invoices import uses the columns "\*Line Title" and "Line Description" (template and on-screen column list); spreadsheets saved with the old names still import.

### Test plan (Administration → Invoices import)

* The on-screen column list says "Line Title, Line Description".
* Download template: the header has "\*Line Title,Line Description"; every other column and the order are unchanged.
* Fill the downloaded template with one Labor row and import it: "All invoices have been imported successfully.", and the invoice opens with the title and description in the right places.
* Import a file using the old headers ("\*Line Title - What are you doing", "Line Description - Why are you doing it"): it imports the same way, with no missing-column error.
* Import a file mixing one old and one new header: it imports.
* Import a file with an unknown header in that position (e.g. "\*Line Name"): rejected with "Invalid file headers provided!" and "Failed to import all invoices."; nothing is imported.

### Known gaps

* The Jira story still lists S4-R1 and the old S4-N1 criterion; the PRD withdrew S4-R1 (there is no separate work order import) and reworded S4-N1 (an unknown column is still rejected with the existing generic message).
* Row error messages keep the old wording (out of scope): an empty \*Line Title still says "Line name cannot be empty.", and the length error mentions "line description".
* Pre-existing, same on develop: a file saved from Excel as "CSV UTF-8" is rejected as invalid headers (byte-order mark). A follow-up ticket is being drafted.

### E2E coverage

* E2E: the template round trip (C2274) and the visible Title message (C23) are automated. The label/placeholder checks for the line dialog and ShopCoach, and the legacy-header import, are covered by unit and BE functional tests (dev-layer TestRail cases C154707–C154725) instead of E2E.



**Nemanja Djuric** — created 2026-10-19T03:49:24.410-0500 (comment id 78973)

**QA update: develop merged in, PRD v14.**

**QA env:** [sv10130.qa.shopview.com](https://sv10130.qa.shopview.com/)  ·  QuickBooks: [qb1.qa.shopview.com](https://qb1.qa.shopview.com/)  ·  PR: [#3553](https://github.com/ShopView/shopview/pull/3553)  ·  [PRD v14](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896)

The branch now includes the latest develop and the PRD v14 changes (answers to Bilal's QA questions). Everything from the first handoff still applies except where this comment says otherwise.

### Extra check (PRD v14, already in the build)

* Old column names in any capitals, or with spaces around them (for example "\*line title - WHAT ARE YOU DOING" or " Line Description - Why are you doing it "), import the same as the new names (S4-R3).



**Mudassir Qamar** — created 2026-10-20T10:01:22.274-0500 (comment id 79127)

<custom data-type="mention" data-id="id-0">@Nemanja Djuric</custom>  SV-10133 on sv10130: header checks pass (new / old / mixed / any-case old names import with "All invoices have been imported successfully."; "\*Line Name" rejected). But I can't find the imported invoices afterwards (QA10133-NEW-1, -OLD-1, -MIX-1, -CASE-1, customer Andreasen Truck & Equipment Repair, Staging Heavy Duty - 9919, date 10/20/2026, one Labor row). Not in search, customer Work Orders/Invoices, or /api/work-orders. Where do imported invoices show up, and is the import worker running on sv10130?

**Nemanja Djuric** — created 2026-10-21T08:31:02.135-0500 (comment id 79191)

<custom data-type="mention" data-id="id-0">@Mudassir Qamar</custom> thanks, the header checks are what this ticket covers. The import itself worked: the invoices are saved, just not where you looked. Imported invoices are stored apart from regular work orders, so they don't appear in global search, the default Work Orders lists, the customer's Invoices tab, or `/api/work-orders`. To find them:

* **Work Orders → All tab → Status → Imported.** Selecting Imported clears the other statuses and only works in **List** view (in other views it's greyed out: "Imported work orders open in List."). Then search by invoice number or customer name; partial text works, so "QA10133" finds all four.
* **Customer → Work Orders tab → Status → Imported.**
* **Switch to the Staging Heavy Duty - 9919 location first.** The imported list only shows invoices from the location you're currently in.
* **API:** `GET /api/work-orders-imported`, also limited to the current location.

There's no import worker, so nothing has to be running on sv10130: the import finishes during the upload. "All invoices have been imported successfully." only appears once the invoices are saved; a duplicate invoice number shows "Some invoices have failed to import." and the duplicates table instead.

On the customer's Work Orders tab, an imported invoice only shows if the customer name in the file matches an existing customer's name exactly, including capitals (spaces at the start or end are ignored). Otherwise it still shows on the Work Orders list but isn't linked to the customer.

**Mudassir Qamar** — created 2026-10-21T08:48:02.178-0500 (comment id 79193)

@Nemanja Djuric thanks – found them under Status → Imported. PASS on sv10130.

✅ New headers (QA10133-NEW-1): "QA new header title" / "QA new header description" in the right places  
✅ Old headers (OLD-1), mixed (MIX-1), any-case old (CASE-1): all import, title/description correct  
✅ Unknown header "\*Line Name": rejected, "Invalid file headers provided!", nothing imported  
✅ Template column list and order unchanged  


---

## SV-10390 — Title and Description — Verify QuickBooks and report line text

- Status: Done · Updated: 2026-10-21T11:29:33.042-0500

### Description (verbatim)

**What to verify:** Labor line text sent to QuickBooks and to the Customer Invoice report (tech plan, Phase 1). FR-008 to FR-014, NFR-001, NFR-004.

**Checklist**

* \[ \] Unit tests for the new line-text builder pass. They cover every combination of present and absent title, description and tech story, the "Tech story missing." placeholder, hyphens and semicolons inside values, and cutting multibyte text at the 4,000-byte limit.
* \[ \] Staging, QuickBooks-connected org: invoice a work order whose labor line has a title, description and tech story → the QuickBooks line reads `Title - Description - Story`, with no labels and no semicolons.
* \[ \] Require Tech Story **off**, no story typed → the line ends after the description, with no trailing hyphen or space.
* \[ \] A line whose story is "Tech story missing." → the same as no story.
* \[ \] A description of about 5,000 characters including accented text → the invoice syncs and does not land in Unexported Items. The title is intact and the text is cut cleanly (no broken character).
* \[ \] Download the Customer Invoice report for the same range → `ItemDescription` is identical to what QuickBooks received.
* \[ \] A pricing-blind user downloading the report → money columns are masked as before, and the line text is not masked.
* \[ \] Parts, shop supplies and fee/discount lines → unchanged in both routes.
* \[ \] An invoice synced before release → unchanged in QuickBooks.
* \[ \] `bin/smoke-test.sh` → no 500s.

PRD: [What Are You Doing / Why Are You Doing It?](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896/What+Are+You+Doing+Why+Are+You+Doing+It) · Tech plan: Milan has the current copy.

When all four verification tickets for this feature are Done, it's ready for QA.

### Comments (0)

---

## SV-10391 — Title and Description — Verify line dialog and ShopCoach labels and placeholders

- Status: Done · Updated: 2026-10-21T11:29:34.416-0500

### Description (verbatim)

**What to verify:** Tech plan, Phase 3. FR-001 to FR-007, NFR-003.

**Checklist** (log in as `admin`)

- [ ] New Line: the picker is labelled "Title" and shows "What are you doing?" immediately. Tab away while it's empty → the placeholder is still visible. Description shows "Why are you doing it?" while empty.
- [ ] Pick a canned line → the label is still "Title", and no placeholder text appears beside the picked name.
- [ ] Save with an empty Title → "Title is a required field".
- [ ] Edit Line: labels are "Title" and "Description", and placeholders appear when a field is cleared. Saved values are unchanged.
- [ ] Everything else in the dialog is unchanged (fields, order, other validation). The only visible layout change is that labels now always sit above their fields.
- [ ] Phone width → the same words in the same fields.
- [ ] ShopCoach line builder: editors labelled "Title" and "Description", with the same placeholders; empty cells read "What are you doing?" and "Why are you doing it?". Screenshot the table: cells must not grow or shift.
- [ ] What ShopCoach generates is unchanged.
- [ ] No console errors. eslint, vitest and vue-tsc are clean.

PRD: [What Are You Doing / Why Are You Doing It?](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896/What+Are+You+Doing+Why+Are+You+Doing+It) · Tech plan: Milan has the current copy.

When all four verification tickets for this feature are Done, it's ready for QA.

### Comments (0)

---

## SV-10392 — Title and Description — Verify invoices import wording and old-template compatibility

- Status: Done · Updated: 2026-10-21T11:29:35.285-0500

### Description (verbatim)

**What to verify:** Tech plan, Phases 2 and 4. FR-015 to FR-018, NFR-002. Scope is wording only. Better header error messages (S4-N1) are left for a separate imports epic.

**Checklist** (Administration → Invoices import, as `admin`)

* \[ \] The on-screen column list shows "Line Title" and "Line Description".
* \[ \] Download the template → the header row has `*Line Title,Line Description`. All other columns and the column order are unchanged.
* \[ \] Upload the downloaded template with one labor row → imports.
* \[ \] Upload a file with the **old** headers (`*Line Title - What are you doing`, `Line Description - Why are you doing it`) → imports identically.
* \[ \] Upload a file mixing one old and one new header → imports.
* \[ \] Upload a file with a wrong header in that position → still rejected with "Invalid file headers provided!".
* \[ \] Backend and frontend ship in the same release (the backend check is exact, so the new template must never reach users before the backend accepts it).
* \[ \] Column names are S4-R2's (`*Line Title` / `Line Description`), confirmed by Product. S4-R1 is withdrawn.

PRD: [What Are You Doing / Why Are You Doing It?](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896/What+Are+You+Doing+Why+Are+You+Doing+It) · Tech plan: Milan has the current copy.

When all four verification tickets for this feature are Done, it's ready for QA.

### Comments (0)

---

## SV-10393 — Title and Description — Verify E2E coverage updated

- Status: Done · Updated: 2026-10-21T11:29:36.420-0500

### Description (verbatim)

**What to verify:** Tech plan, Phase 5.

**Checklist**

* \[ \] Existing specs this change would break have been updated and pass: the Edit Line dialog locators, the invoice-import CSV helper and header names, `invoices-import` and `imported-invoice-views` specs.
* \[ \] Updated: New Line from canned line asserts the "Title" label and placeholder, then that the placeholder clears on pick (@C26742).
* \[ \] New: Edit Line shows Title and Description, and an empty Title is blocked with "Title is a required field".
* \[ \] Updated: ShopCoach line builder labels.
* \[ \] Updated: the invoices import accepts an old-header file, and the template shows the new headers.
* \[ \] `/e2e-after-change` coverage block is present on the PR.

PRD: [What Are You Doing / Why Are You Doing It?](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896/What+Are+You+Doing+Why+Are+You+Doing+It) · Tech plan: Milan has the current copy.

When all four verification tickets for this feature are Done, it's ready for QA.

### Comments (1)

**Nemanja Djuric** — created 2026-10-08T03:24:14.240-0500 (comment id 78214)

**E2E coverage for Title and Description: done, on** [**PR #3553**](https://github.com/ShopView/shopview/pull/3553)**.**

Per the repo's test-scope rules, items whose behaviour a cheaper layer can observe went to unit / BE functional tests; E2E keeps what only a real browser or a real FE↔BE round trip can catch.

### Checklist, item by item

* Existing specs this change would break: fixed and passing. The Edit Line dialog locators now use input_line_name / input_line_description (C1881, C31/C219, C53595, C26742 pass); the invoice-import CSV helper uses the new header names; invoices-import.spec.ts 17/17; imported-invoice-views.spec.ts 11/12 (C2320 also fails on the baseline, pre-existing and unrelated).
* New Line from canned line, Title label and placeholder clearing on pick (@C26742): covered by FE unit tests (CannedLineSelect.spec.ts placeholder tests, LineDialog.spec.ts), dev cases C154707 and C154708. C26742 itself still passes.
* Edit Line labels, and an empty Title blocked with "Title is a required field": covered by FE unit tests in LineDialog.spec.ts (including visibility: shown after a blocked save, hidden on blur), dev case C154709. E2E C23 now asserts the visible message after a blocked save in the real browser.
* ShopCoach line builder labels: covered by FE unit tests in ShopCoachVehicleLines.spec.ts (editor labels and placeholders, empty cells), dev case C154711.
* Invoices import, old-header file still imports: covered by the BE functional ImportCommandHandlerTest (old, new and mixed headers; wrong or misplaced rejected), dev case C154724. Template shows the new headers: FE unit InvoicesDataImport.spec.ts, dev cases C154723 and C154725. New E2E C2274 imports a file built on the downloaded template's own header row (the only check that the FE template and the BE header list agree).
* /e2e-after-change coverage block is on PR #3553: New @C2274, Updated @C23, Backlog 0.

### TestRail

* C2274 marked Automated (type E2E). C2272 and C2273 stay Not Automated: the repo allows one TestRail case per test, and C2274 owns the round trip. They could be merged into C2274 or retired.



---

## SV-11850 — ShopCoach Line Builder on staging: Build Lines fails with "Failed to parse work description into lines" and the UI shows nothing

- Status: Open · Updated: 2026-10-27T09:19:30.643-0500

### Description (verbatim)

**Env:** staging (app.staging.shopview.com), Staging Heavy Duty - 9919. Found while re-checking SV-11257 (Title and Description).

**Steps**

1. Open WO S2-37674 > Lines.
2. In the ShopCoach Line Builder box, type a work description, e.g. "Oil change" or "Replace front brake pads and rotors, customer reports grinding noise".
3. Click Build Lines.

**Expected**
ShopCoach returns suggested lines (with Title / Description fields per SV-10131). If it can't, the user sees an error message.

**Actual**

* `POST /api/shopcoach/run-assistant` returns HTTP 200 with:
  `{"responseData":{"text":null},"responseMeta":{"status":"ServerError","isError":true,"message":"Failed to parse work description into lines","messageCode":"assistant.server_error"}}`
* The UI shows nothing: no lines, no error, no loading end state.
* Same result for every input tried.

**Impact**

* The Line Builder can't be used on staging.
* SV-10131 (ShopCoach builder labels) could not be re-verified before release.
* The failure is silent, so a user can't tell anything went wrong.  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=139ae766df31&id=f68bad2d-c811-4d77-8ba2-7264afb8e236&&collection=&height=993&occurrenceKey=null&width=1920&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



### Comments (0)

---

## SV-11558 — Founder Mode Batch #2

- Status: Open · Updated: 2026-10-21T11:15:14.899-0500

### Description (verbatim)

This will be the second batch of founder mode features and fixes.  
  
1\. What are you doing / why are you doing it;  
2\. Part Lifecycle;  
3\. Pricing / Categories sorting;  
4\. Splitting sales reps;  
5\. AR/AP sorting / upgrades

### Comments (0)
