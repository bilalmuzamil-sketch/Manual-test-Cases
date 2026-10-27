# What/Why full pass — Phase D pass record (Rule 134), 27 Oct 2026

Sections DESIGN. Every case is compared part by part with its live read-back of 13 Oct 2026 and checked against PRD "What Are You Doing / Why Are You Doing It?" (Title and Description), Confluence 845348896, version 15 (14 Oct 2026, owner Chris Ward). Counts: {'rewritten': 0, 'split': 0, 'new': 17}.

| Section | rewritten (keeps C-id) | split parts (new) | new behaviour (new) |
|---|---|---|---|
| DESIGN | 0 | 0 | 17 |

## Per case, per part

- **D-01** new — Design: New Line opens with the Title box ready and its grey prompt: all NEW (new requirement); needs a C-id and the run (union only)
- **D-02** new — Design: New Line shows Description above its grey prompt: all NEW (new requirement); needs a C-id and the run (union only)
- **D-03** new — Design: New Line keeps its header, other fields and buttons as drawn: all NEW (new requirement); needs a C-id and the run (union only)
- **D-04** new — Design: Edit Line shows Title above the saved title: all NEW (new requirement); needs a C-id and the run (union only)
- **D-05** new — Design: Edit Line shows Description above the grey prompt when empty: all NEW (new requirement); needs a C-id and the run (union only)
- **D-06** new — Design: Edit Line keeps Status, labor row, link and buttons as drawn: all NEW (new requirement); needs a C-id and the run (union only)
- **D-07** new — Design: New Line shows every label and button whole at 1440 pixels: all NEW (new requirement); needs a C-id and the run (union only)
- **D-08** new — Design: New Line shows every label and button whole at 1536 pixels: all NEW (new requirement); needs a C-id and the run (union only)
- **D-09** new — Design: Edit Line shows every label and button whole at 1440 pixels: all NEW (new requirement); needs a C-id and the run (union only)
- **D-10** new — Design: Edit Line shows every label and button whole at 1536 pixels: all NEW (new requirement); needs a C-id and the run (union only)
- **D-11** new — Design: Legacy invoice prints title, description and tech story with no labels: all NEW (new requirement); needs a C-id and the run (union only)
- **D-12** new — Design: Modern invoice prints the tech story under Scope of work: all NEW (new requirement); needs a C-id and the run (union only)
- **D-13** new — Design: Legacy invoice leaves out "Tech story missing.": all NEW (new requirement); needs a C-id and the run (union only)
- **D-14** new — Design: Modern invoice leaves out "Tech story missing.": all NEW (new requirement); needs a C-id and the run (union only)
- **D-15** new — Design: An imported invoice line reads title - description in the report: all NEW (new requirement); needs a C-id and the run (union only)
- **D-16** new — Design: An emptied ShopCoach editor shows its label above the prompt: all NEW (new requirement); needs a C-id and the run (union only)
- **D-17** new — Design: ShopCoach table rows keep their size when a cell shows its prompt: all NEW (new requirement); needs a C-id and the run (union only)

## Samples, old (13 Oct, live) vs new (this pass), tester text

### S1-01 · C154707

**Old (live since 13 Oct 2026)**

```
New Line shows the fields Title and Description with question prompts
Setup (manual QA tester and Claude session)
Preconditions
 - You are signed in as an Admin (all permissions) at {Location-A} (for example Staging Heavy Duty - 9919) on the What/Why QA build.
 - Customer {Customer-A} (for example ZZAUTOTEST-WW-C154707 Fleet) has a contact person and an asset, {Asset-A} (for example ZZAUTOTEST-WW-C154707 Truck).
 - Work order {Work-order-1} (for example S2-15440) is open for {Customer-A} and {Asset-A} at {Location-A}, not invoiced.
STEPS
- Open {Work-order-1} and go to its Lines tab.
 - Click New Line.
 - Without typing anything, read the label of the first field and the grey text inside it.
 - Read the label of the second field and the grey text inside it.
 - Click into the second field and type a description (for example excessive play).
 - Read the second field's label and what is inside the box.
 - Click into the first field and type a title (for example Replace tie rod). Do not pick a canned line.
 - Read the first field's label and what is inside the box.
 - Close the window without saving.
Expected results
 - Step 2: the New Line window opens with the cursor already in the first field.
 - Step 3: the first field is labeled exactly "Title" and shows the grey prompt "What are you doing?" inside the box.
 - Step 4: the second field is labeled exactly "Description" and shows the grey prompt "Why are you doing it?" inside the box.
 - Step 6: the label still reads "Description". The prompt "Why are you doing it?" is gone and only the typed text shows.
 - Step 8: the label still reads "Title". The prompt "What are you doing?" is gone and only the typed text shows.
```

**New**

```
New Line shows the fields Title and Description with grey question prompts
Preconditions
 - Sign in as an Admin at the test location.
 - Have an open work order, work order 1, that is not invoiced, so you can add a line to it.
 - Start on work order 1, on its Lines tab.
STEPS
- Click New Line.
 - Click the Description box.
 - Type "excessive play".
 - Click the Title box.
 - Type "Replace tie rod".
Expected Result
Step 1:
 - The New Line window opens over work order 1, with the cursor already in the first field.
 - The first field is labeled exactly "Title", with no asterisk, and the label sits at the top of the box.
 - The grey prompt "What are you doing?" shows inside the Title box, under the label.
 - The second field is labeled exactly "Description", with the label at the top of the box.
 - The grey prompt "Why are you doing it?" shows inside the Description box, under the label.
Step 2:
 - The Description label stays at the top of the box.
 - The grey prompt "Why are you doing it?" still shows, because the box is empty.
Step 3:
 - The prompt "Why are you doing it?" is gone and only "excessive play" shows in the box.
 - The label still reads "Description", at the top of the box.
Step 4:
 - The Title label stays at the top of the box.
 - The grey prompt "What are you doing?" still shows, because the box is empty.
Step 5:
 - The prompt "What are you doing?" is gone and only "Replace tie rod" shows in the box.
 - The label still reads "Title", at the top of the box.
Exact quotes from the source (for reproducibility)
From: PRD "What Are You Doing / Why Are You Doing It?" (Title and Description), Confluence 845348896, version 15 (14 Oct 2026, owner Chris Ward), read 27 Oct 2026 · Epic SV-11257, story SV-10130 (Story 1, The Work Order Line Dialog)
 - S1-R1: “The first field is labeled exactly "Title", with no asterisk.”
 - S1-R2: “The second field is labeled exactly "Description".”
 - S1-R3: “The Title box carries the placeholder "What are you doing?" and the Description box carries "Why are you doing it?". Placeholder text shows while the box is empty and disappears as soon as there is a value. The labels Title and Description always sit at the top of their boxes, empty or filled, with the placeholder underneath; in production the label sat inside the empty box. This is the one layout change in the dialog.”
 - S1-R5: “The canned-line picker at the top of the dialog is labeled "Title" and carries the placeholder "What are you doing?" in its typeahead box, the same as the free-text Title field. The dialog focuses this field on open, so the placeholder is visible the moment the dialog appears and clears as soon as the user types or picks a canned line. (Corrected 2026-09-10: the first build gave the picker no placeholder, so the prompt never appeared on a new line.)”
 - Story 1, Prerequisites: “User is adding or editing a line on a work order.”
Not yet checked against a build by us: the QA build (sv10130.qa.shopview.com, QuickBooks host qb1.qa.shopview.com) and staging carry this change, and this case has not been run on either.
References from Design
Design canvas "What Are You Doing / Why Are You Doing It?" (https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6), copy re-read on 27 Oct 2026 (its one change since 13 Oct: the New Line board's "Title *" now reads "Title"): board 1.2 "New Line - after". Compare the screen with the pictures below; the expected results above come from the quotes above.
Design pictures attached to this case:
 - board-1.2-new-line-after.png
The design's own words:
 - “The only two things that change The field is now named Title and the question moves inside it as the prompt, in sentence case: “What are you doing?”. Same for Description . The name stays put whether the picker is empty or filled, which replaces a label that swapped between the question and “Title” depending on state.”
AUTOMATION: HOLD - not yet build-verified on the What/Why QA build
```
