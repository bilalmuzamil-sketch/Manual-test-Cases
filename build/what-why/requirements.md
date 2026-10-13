# What Are You Doing / Why Are You Doing It — REQUIREMENTS (verbatim source set)

> **🔴 EVERY REQUIREMENT BELOW IS THE SOURCE'S OWN SENTENCE, COPIED VERBATIM (Rule 113).**
> Nothing here is paraphrased, tidied, merged or split. Where two sources word the same requirement
> differently, **both wordings are shown side by side and the conflict is listed in §4** — it is a PO
> question, never something this file resolves. **No wording was taken from the build** (Rule 57).
> Plain-language restatements for testers are **not** in this file; they are added after the quote in
> the case body, clearly marked as our restatement (Rules 7/9/113).

**Ingested 2026-10-13.** Sources read live that day; identifiers, versions and dates in §1.

---

## 1 · THE SOURCES THIS FILE QUOTES

| # | Source | Identifier | Version / date read | Notes |
|---|---|---|---|---|
| **A** | PRD — *"What Are You Doing / Why Are You Doing It?"* | Confluence page **`845348896`**, space `~712020aa00b8d6a71f4259891982a304227c20` ("Chris Ward") | **Confluence version `13`**, read 2026-10-13 | Page created 2026-09-10T04:52:40Z; author Chris Ward. In-body status line reads *"Locked for build - 2026-09-16"* — **that is the in-body field, not the version integer** (Rule 31 trap (a)). Canonical URL in §5. |
| **B** | Epic **SV-11257** description | `https://shopview.atlassian.net/browse/SV-11257` | created 2026-10-13T10:13:35-05:00, read 2026-10-13 | Split out of SV-9667 on 2026-10-13. |
| **C** | Story **SV-10130** — The Work Order Line Dialog | `https://shopview.atlassian.net/browse/SV-10130` | created 2026-09-16, description read 2026-10-13 | |
| **D** | Story **SV-10131** — The ShopCoach Line Builder | `https://shopview.atlassian.net/browse/SV-10131` | created 2026-09-16, description read 2026-10-13 | |
| **E** | Story **SV-10132** — What Reaches QuickBooks | `https://shopview.atlassian.net/browse/SV-10132` | created 2026-09-16, description read 2026-10-13 | |
| **F** | Story **SV-10133** — The Imports | `https://shopview.atlassian.net/browse/SV-10133` | created 2026-09-16, description read 2026-10-13 | |
| **G** | Design — Claude artefact `Pz1Q6BfvreYFpQwVQZPTE6` | `https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6` | **NOT READ BY THIS PASS** | Covered by a parallel worker; see `BLOCKED-design-artifact-2026-10-13.md` and `DESIGN-REFERENCE-2026-10-13.md`. **No requirement in this file is sourced from the design.** |
| **H** | Engineering tech plan — *"Title and Description — Technical Implementation Plan"* | `https://powertools.shopview.com/md-viewer/2cb42c08-54d6-40ef-b98b-696198c19feb` | **NOT READABLE** — Google-SSO login wall (302 → `accounts.google.com`, `hd=shopview.com`) | Linked by Nemanja Djuric on SV-10130, 2026-10-07. Carries **FR-001…FR-018** and **NFR-001…NFR-004** and a five-phase plan, named in SV-10390/10391/10392/10393. **None of those identifiers is quotable until the plan is supplied** (Rule 30). |

**Authority order applied here:** the **PRD (A)** is the spec; the **stories (C–F)** are the epic's
stories. Both are Rule-57 sources. Where they disagree, this file **shows both and asks** (Rule 58) —
see §4. It does **not** pick a side, even though the dev team's own note on SV-10130 says the PRD is
the source of truth; that note is a comment, not a source amendment.

---

## 2 · THE PRD'S REQUIREMENT SET — quoted verbatim, individually addressable

The PRD numbers its own requirements. **Those identifiers are the source's, not ours**, and are used
unchanged. Each row is one quotable sentence or sentence-group exactly as §5 of the PRD carries it.

### 2.1 · Story 1 — The Work Order Line Dialog *(PRD §5, Story 1; Jira SV-10130)*

**User story, verbatim:**
> "**As a** service writer, **I want** the two line fields named for what they hold, **so that** what I type is not read back to anyone as an answer to a question."

**Prerequisite, verbatim:**
> "User is adding or editing a line on a work order."

| ID | Requirement — PRD v13, §5 Story 1, VERBATIM |
|---|---|
| **S1-R1** | "The first field is labeled exactly \"Title\"." |
| **S1-R2** | "The second field is labeled exactly \"Description\"." |
| **S1-R3** | "The Title box carries the placeholder \"What are you doing?\" and the Description box carries \"Why are you doing it?\". Placeholder text shows while the box is empty and disappears as soon as there is a value." |
| **S1-R4** | "The label does not change with the state of the field. It reads \"Title\" whether the canned-line picker is empty or filled, which replaces a rule that swapped the label between the question and \"Title\" depending on that state." |
| **S1-R5** | "The canned-line picker at the top of the dialog is labeled \"Title\" and carries the placeholder \"What are you doing?\" in its typeahead box, the same as the free-text Title field. The dialog focuses this field on open, so the placeholder is visible the moment the dialog appears and clears as soon as the user types or picks a canned line. (Corrected 2026-09-10: the first build gave the picker no placeholder, so the prompt never appeared on a new line.)" |
| **S1-R6** | "Leaving Title empty blocks the save with the message \"Title is a required field\", replacing \"Line Name is a required field\". Every required-field message in the app uses the \"X is a required field\" form, and this one keeps it." |
| **S1-R7** | "Nothing else about the dialog changes: same fields in the same order, same validation, same values saved." |
| **S1-N1** | "No existing line is altered. The rename is on the labels, not on the data." |

### 2.2 · Story 2 — The ShopCoach Line Builder *(PRD §5, Story 2; Jira SV-10131)*

**User story, verbatim:**
> "**As a** service writer using ShopCoach, **I want** the same two names there, **so that** the builder and the dialog do not disagree."

| ID | Requirement — PRD v13, §5 Story 2, VERBATIM |
|---|---|
| **S2-R1** | "The line builder's two text fields are labeled \"Title\" and \"Description\"." |
| **S2-R2** | "Both carry the same placeholders as S1-R3." |
| **S2-R3** | "What ShopCoach generates and writes into a line is unchanged. A generated line becomes an ordinary work order line and follows Story 3 like any other." |

### 2.3 · Story 3 — What Reaches QuickBooks *(PRD §5, Story 3; Jira SV-10132)*

**User story, verbatim:**
> "**As a** bookkeeper, **I want** our line text to read like an invoice line, **so that** our accounting records do not carry another product's field names."

**Prerequisites, verbatim (four, each individually addressable as S3-P1…S3-P4 — OUR numbering, the PRD gives these none):**

| Our ref | PRD §5 Story 3 "Prerequisites", VERBATIM |
|---|---|
| **S3-P1** | "An invoice's line text is being produced, either by the live QuickBooks sync or by the downloadable Customer Invoice report." |
| **S3-P2** | "The text is produced for an **invoice**. An estimate never reaches QuickBooks: the live sync runs against one invoice at a time, when that invoice is created." |
| **S3-P3** | "Downloading the report requires **Invoicing & payments - View**. The gate is enforced on the server, not by hiding the entry in the Export Reports dialog." |
| **S3-P4** | "The live sync needs no user permission of its own. It runs automatically when an invoice is created, for a shop whose QuickBooks connection is active." |

| ID | Requirement — PRD v13, §5 Story 3, VERBATIM |
|---|---|
| **S3-R1** | "A line's text joins the title, the description and the technician's narrative with a spaced hyphen and no labels: \"Replace tie rod - excessive play - Both outer ends worn, replaced and aligned\"." |
| **S3-R2** | "The separator is exactly one space, one hyphen-minus, one space." |
| **S3-R3** | "A separator appears only between two segments that are both present. A line with no description joins the title straight to the narrative. A line with no narrative ends after the description. A line with neither carries the title alone. In every case there is no trailing separator and no trailing space." |
| **S3-R4** | "The same text is used by the live QuickBooks sync and by the downloadable Customer Invoice report. The two can never show different text for the same line." |
| **S3-R5** | "The technician's narrative is the third and last segment. It carries no label of any kind, and no semicolon appears anywhere in the line text. The reasoning is in §2." |
| **S3-R6** | "A line with no narrative ends after the description, with no trailing hyphen and no trailing space. A narrative is absent when the value is empty, or when it is the literal placeholder \"Tech story missing.\" that the line dialog writes when nothing was typed; the two are treated identically, and neither reaches QuickBooks." |
| **S3-R6a** | "A narrative is absent legitimately, not only exceptionally. The organization setting Administration, Work Order Settings, Require Tech Story governs whether the completion gate gets in the way, so a shop with it switched off invoices completed lines with no narrative as a matter of course." |
| **S3-R7** | "When the joined text is longer than 4,000 bytes it is shortened from the end to fit, and it is never cut in the middle of a character. The live sync and the downloadable report are both cut at that same limit, so S3-R4 holds on a long line too. Today only the live sync cuts, and it cuts by bytes without regard for where a character ends; the report has no cut at all. Because the title leads and the narrative trails, the title always survives and the narrative is what gets clipped first." |
| **S3-R7a** | "The limit is a storage limit rather than a count of what a reader sees, so a line written with accented or non-Latin characters may be shortened more than an English line that looks the same length on screen. Two lines that look equally long can therefore be cut at different points. That is correct behavior and not a defect." |
| **S3-R8** | "The values themselves are unchanged. Nothing is trimmed, truncated, re-cased or escaped that is not trimmed, truncated, re-cased or escaped today, other than the shortening described in S3-R7." |
| **S3-R9** | "A title, a description or a narrative that itself contains a hyphen, including a spaced hyphen, is carried as written. The separator is not escaped and the text is not quoted, so a reader cannot always tell our separator from theirs. This is accepted deliberately: the alternative is printing a field name to mark the join, which is the thing being removed." |
| **S3-R9a** | "A semicolon typed inside any of the three values is ordinary punctuation and is carried through untouched. It was ambiguous only while the semicolon was the separator." |
| **S3-R10** | "For a user who cannot see financial data, the downloaded report masks its money columns (rate, amount, tax and average cost) as it does today. The line text is not a money value and is not masked, so the same words reach every reader of the file." |
| **S3-R11** | "No other report or export reads this line text. Changing it changes these two routes and nothing else." |
| **S3-R12** | "An imported historical invoice never reaches the live QuickBooks sync, so its line text is unaffected whatever the import wrote into it." |
| **S3-N1** | "Invoices already in QuickBooks keep the text they were sent with. Nothing is re-synced, re-exported or rewritten." |
| **S3-N2** | "No line falls back to the old labels or the old questions, including lines created before this change." |
| **S3-N3** | "A parts line, a shop supplies line and a fee or discount line are unaffected: none of them carries a title-and-description pair." |
| **S3-E1** | "A line with a title, no description and a narrative reads \"Replace tie rod - Both outer ends worn, replaced and aligned\": one separator, not two, and no gap where the description would have been." |
| **S3-E2** | "An invoice that is reversed and re-invoiced after release day carries the new text on the new invoice, while the original keeps the old text. A bookkeeper can therefore see both forms in one set of books, on one job." |
| **S3-E3** | "A description long enough to be cut still syncs. The invoice reaches QuickBooks; it does not land in Unexported Items." |

**PRD context notes attached to Story 3, verbatim:**
> *"Context note: the Batch 1 branch first built this change as \"Title: ...;Description: ...\". It never reached develop or a release, so the released product and develop both still send \"What are you doing?: ...;Why are you doing it?: ...;Tech Story: ...\", and this change goes straight from that to S3-R1. There is no intermediate format to migrate from. The complaint being answered is not which field names print, it is that any of our field names print at all. That is also why the narrative lost its \"Tech Story:\" label on 2026-09-16: the label was the same defect, sitting in the same field."*

> *"Context note on S3-R7: SV-9921 is the live example of the alternative. A value too long for a QuickBooks field put a customer's record in Unexported Items with a raw validation message that does not say which field failed."*

### 2.4 · Story 4 — The Imports *(PRD §5, Story 4; Jira SV-10133)*

**User story, verbatim:**
> "**As a** shop importing history, **I want** the column names to match the product, **so that** the template makes sense, **and I want** my existing spreadsheet to keep working."

| ID | Requirement — PRD v13, §5 Story 4, VERBATIM |
|---|---|
| **S4-R1** | "**Withdrawn.** There is no separate work order import. The only live import carrying these columns is Administration → Invoices, which writes to the imported work order history and is covered by S4-R2. The column names this requirement renamed exist only in code nothing calls, and nothing ships for them." |
| **S4-R2** | "The historical invoice import's two columns (Administration → Invoices) are named \"\*Line Title\" and \"Line Description\", replacing \"\*Line Title - What are you doing\" and \"Line Description - Why are you doing it\"." |
| **S4-R3** | "The importer accepts the old column names as well as the new ones. A file carrying either spelling validates and imports identically." |
| **S4-R4** | "A file may mix the two spellings, carrying one column under its old name and the other under its new one." |
| **S4-R5** | "The old name is accepted as the column it became: it is neither reported missing nor reported as a column to remove." |
| **S4-R6** | "The downloadable sample file and the on-screen column list both show the new names." |
| **S4-R7** | "Every other column name, and the required order of columns, is unchanged." |
| **S4-N1** | "A genuinely unrecognized column is still rejected. The compatibility rule covers exactly the two renamed columns and nothing else." |

> **Quoting note on S4-R2 (not a change to the quote).** The page's stored markup escapes the leading
> asterisk, so the raw body reads `\\\*Line Title`. The sentence as a reader sees it, and as quoted
> above, is `*Line Title`. **No other character was altered.**

**PRD context note attached to Story 4, verbatim:**
> *"Context note: the importer compares headers strictly, so a rename without S4-R3 would have failed every spreadsheet a shop had saved from the old template."*

### 2.5 · The PRD's SURFACE table *(PRD §6, "Surfaces"), verbatim*

> "Every place the two names appear, and what happens to each."

| Surface | Before | After |
| --- | --- | --- |
| Work order line dialog | "What are you doing?" / "Why are you doing it?" as labels | Title / Description as labels, questions as placeholders |
| ShopCoach line builder | Same two questions as labels | Title / Description, same placeholders |
| Live QuickBooks sync | "What are you doing?: ...;Why are you doing it?: ...;Tech Story: ..." | "Replace tie rod - excessive play - Both outer ends worn, replaced and aligned", shortened to fit if it is too long (S3-R7) |
| Customer Invoice report (download) | The same text as the sync | The same text as the sync |
| Historical invoice import columns | \*Line Title - What are you doing / Line Description - Why are you doing it | \*Line Title / Line Description, old names still accepted |
| Estimate, invoice and credit documents | Never printed either question | Unchanged |
| Database and API field names | line_name, description | Unchanged |

**This table is the Rule-96 invariant seed.** Its last two rows and the four §2 "Out of scope"
bullets in §2.6 are statements that something **must not change** — exactly the silences a delta-only
suite will not catch.

### 2.6 · Explicit OUT-OF-SCOPE statements *(PRD §2, "Out of scope"), verbatim*

| Our ref | VERBATIM |
|---|---|
| **OOS-1** | "The customer-facing estimate, invoice and credit documents. They have never printed either question and are untouched." |
| **OOS-2** | "Field names in the database and the API. This is a naming change on the surfaces a person reads, not a schema change." |
| **OOS-3** | "Anything already in QuickBooks. Nothing is re-sent, re-exported or rewritten." |
| **OOS-4** | "**Whether a technician's narrative belongs in a shop's accounting records at all.** It is carried today, it is carried after this change, and that question is not reopened here. What changes is only how it is joined and labeled, which is the same wording problem the two questions were. (@chris ruling, 2026-09-16, reversing the 2026-09-15 call that put the segment entirely out of scope.)" |
| **OOS-5** | "**Credit memos.** A credit memo builds its own line descriptions from the credited line items and from the credit event itself, so it never carried the two questions and nothing about it changes here." |
| **OOS-6** | "Any other QuickBooks mapping work. SV-6862's broader field-mapping request stays where it is; only the wording half is answered here." |

### 2.7 · ASSUMPTIONS *(PRD §4, "Assumptions"), verbatim*

| Our ref | VERBATIM |
|---|---|
| **A-1** | "Import templates are kept and reused by shops for years, so header stability matters more than tidiness." |
| **A-2** | "Nothing downstream parses this line text looking for the old question strings. The \"Title:\" and \"Description:\" labels were only ever on the Batch 1 branch and never reached a shop, so nothing downstream has seen them either." |
| **A-3** | "Intuit documents 4,095 for a QuickBooks Online line description without saying whether that counts characters or storage. The product carries its own limit of 4,000, which is under 4,095 on either reading, so the rule in S3-R7 is safe whichever it turns out to be. Establishing which unit Intuit means is worth one test against the sandbox someday, so the limit is chosen on evidence rather than on caution. It does not block this change." |
| **A-4** | "QuickBooks Online line descriptions are plain text. There is no bold, no italic and no markup of any kind, so a long joined line cannot be made easier to read by formatting it. Verified 2026-09-16 against Intuit's own guidance; the only formatting a description field accepts is a line break." |
| **A-5** | "A work order line's description can be far longer than that limit: ShopView allows 65,535 characters, against a 255-character line name. In practice descriptions are short phrases, so the cut is an edge case rather than a routine one." |

### 2.8 · FORM FACTOR *(PRD, "Form Factor"), verbatim*

> "The work order line dialog is a core work-order surface and is used on a phone by technicians, so it carries a mobile variant already. This spec changes two labels and two placeholders inside it and nothing else: the mobile variant shows the same words, in the same fields, with no separate design work owed. Every other surface here is either a downloaded file or a background sync, neither of which has a form factor."

### 2.9 · THE PRD's OWN OPEN QUESTIONS *(PRD §7), verbatim*

> "Nothing here blocks build. Both questions that did block were answered on 2026-09-15 and are recorded in §2 and §3."

**Still open (one):**
> "Who downloads the Customer Invoice report, and why? Searching Jira and Slack found no customer using it to feed QuickBooks Desktop, and every complaint on record about this line text is about the live sync. There is no telemetry to settle it: opening the Export Reports dialog fires a navigation event, but nothing records which report was pulled. This does not block the change, because both routes share one builder and are fixed together. **Owner:** the owning PM, with customer support. **Blocks:** nothing."

**Answered and closed (six), verbatim:**
1. "*Should the export carry field labels at all?* No. Answered 2026-09-15, see §3 and S3-R1."
2. "*Does the fix reach the live QuickBooks sync as well as the downloadable report?* Yes, and it always did, because one builder feeds both. Answered 2026-09-15, see S3-R4."
3. "*Should the Tech Story segment change too?* Yes, after all. Answered 2026-09-16, reversing the 2026-09-15 answer: it loses its label and its semicolon and becomes the third hyphen-joined segment (S3-R5). The question of whether a narrative belongs in a shop's books at all remains out of scope, see §2."
4. "*What happens to a semicolon typed inside a description?* Nothing, it is carried through untouched. The question existed only while the semicolon was the separator. Closed 2026-09-16 by S3-R9a."
5. "*Does QuickBooks support bold or italic text, so a long joined line could be made easier to read?* No. Line descriptions are plain text, with no bold, no italic and no markup of any kind; the only formatting the field accepts is a line break. Verified 2026-09-16 against Intuit's own guidance."
6. "*Does the release note cover one change or two?* One note, covering both routes, since one change moves both. A shop on the live sync sees its QuickBooks line text change shape, and a shop that downloads the report sees the same text change there."

**§8 Change Log is an EMPTY TABLE** — header row only, no entries, at version 13. Nothing can be
quoted from it, and the PRD therefore carries **no self-recorded revision history**.

---

## 3 · THE EPIC AND ITS STORIES — quoted verbatim

### 3.1 · Epic SV-11257 description, VERBATIM

> "Work order lines get a title and a description: what is being done, and why. Covers the work order line dialog, the ShopCoach line builder, what reaches QuickBooks, and the imports.
>
> PRD: https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=845348896
>
> Split out of SV-9667 (Founder Mode Batch #1) on 2026-10-13."

### 3.2 · SV-10130 — Story 1 — The Work Order Line Dialog

**Summary, verbatim:** "Rename the two work order line fields to Title and Description everywhere a person reads them, and keep the two questions as placeholder text inside the boxes."

**Context, verbatim:** "The two fields are labelled with the questions today, \"What are you doing?\" and \"Why are you doing it?\". Those are prompts for the writer rather than names of anything, and they are read back to people who never saw the dialog. This story covers the dialog only. What reaches QuickBooks is Story 3."

**Requirements, verbatim (story wording — compare with §2.1):**
- **S1-R1:** "The first field is labelled exactly \"Title\"."
- **S1-R2:** "The second field is labelled exactly \"Description\"."
- **S1-R3:** "The Title box carries the placeholder \"What are you doing?\" and the Description box carries \"Why are you doing it?\". Placeholder text shows while the box is empty and disappears as soon as there is a value."
- **S1-R4:** "The label does not change with the state of the field. It reads \"Title\" whether the canned-line picker is empty or filled, replacing a rule that swapped the label between the question and \"Title\" depending on that state."
- **S1-R5:** "The canned-line picker at the top of the dialog is labelled \"Title\" and carries the placeholder \"What are you doing?\" in its typeahead box, the same as the free-text Title field. The dialog focuses this field on open, so the placeholder is visible the moment the dialog appears and clears as soon as the user types or picks a canned line."
- **S1-R6:** "Leaving Title empty blocks the save with the message \"Title is required\", replacing \"Line name is required\"."  ← **CONFLICTS WITH PRD S1-R6. See §4, Q1.**
- **S1-R7:** "Nothing else about the dialog changes: same fields in the same order, same validation, same values saved."
- **S1-N1:** "No existing line is altered. The rename is on the labels, not on the data."

**Acceptance Criteria, verbatim (each individually addressable as SV-10130-AC1…AC7):**
1. "Given the New Line dialog is open, then the canned-line picker is labelled \"Title\" and its typeahead box shows the placeholder \"What are you doing?\"."
2. "Given the New Line dialog is open, then the free-text fields are labelled \"Title\" and \"Description\", with placeholders \"What are you doing?\" and \"Why are you doing it?\"."
3. "Given the Edit Line dialog is open on an existing line, then the same two labels are shown and the saved values appear unchanged."
4. "Given a user types into Title, then the placeholder disappears and the label still reads \"Title\"."
5. "Given a canned line has been picked, then the picker label still reads \"Title\" and does not change to a question."
6. "Given Title is empty, when the user saves, then the save is blocked and the message reads exactly \"Title is required\"."  ← **CONFLICTS WITH PRD S1-R6. See §4, Q1.**
7. "Given a line created before this change, when it is opened, then its title and description values are exactly as they were saved."

### 3.3 · SV-10131 — Story 2 — The ShopCoach Line Builder

**Summary, verbatim:** "Give the ShopCoach line builder the same two field names and placeholders as the work order line dialog, so the two surfaces do not disagree."

**Context, verbatim:** "ShopCoach writes an ordinary work order line. If the builder keeps the questions while the dialog uses the names, the same value is labelled two different ways depending on where the writer started."

**Requirements, verbatim:**
- **S2-R1:** "The line builder's two text fields are labelled \"Title\" and \"Description\"."
- **S2-R2:** "Both carry the same placeholders as S1-R3: \"What are you doing?\" on Title and \"Why are you doing it?\" on Description."
- **S2-R3:** "What ShopCoach generates and writes into a line is unchanged. A generated line becomes an ordinary work order line and follows Story 3 like any other."

**Acceptance Criteria, verbatim (SV-10131-AC1…AC4):**
1. "Given the ShopCoach line builder is open, then its two fields are labelled \"Title\" and \"Description\"."
2. "Given the ShopCoach line builder is open with both fields empty, then the placeholders read \"What are you doing?\" and \"Why are you doing it?\"."
3. "Given a line is generated by ShopCoach, then the values written into the work order line are the same as before this change."
4. "Given a line generated by ShopCoach reaches an invoice, then its line text follows Story 3 with no special handling."

### 3.4 · SV-10132 — Story 3 — What Reaches QuickBooks

**Summary, verbatim:** "Change the line text that reaches a shop's accounting records so it carries none of our field names: the title, the description and the technician's narrative joined by a spaced hyphen, with no labels and no semicolons."

**Context, verbatim:** "A line arrives in QuickBooks today reading \"What are you doing?: Replace front brake pads;Why are you doing it?: Customer reports grinding;Tech Story: \". Two customers have asked in writing for this to stop: NCCHD (SV-6862, 15 users, open) and KMS Mechanics (SV-6582, 34 users). One builder produces this text and both routes into QuickBooks use it, the live sync and the downloadable Customer Invoice report, so one change fixes both and the two can never drift apart."

**Requirements (story wording).** S3-R1 through S3-R5, S3-R8, S3-R9a, S3-R11, S3-R12, S3-N1, S3-N2
and S3-N3 are **substantively the same sentences as §2.3** (British/American spelling aside). The
three that differ materially are quoted here and listed in §4:

- **S3-R6 (story):** "A narrative is absent when the value is empty, or when it is the literal placeholder \"Tech story missing.\" that the line dialog writes when nothing was typed. The two are treated identically and neither reaches QuickBooks."  *(The story drops the PRD's leading sentence about no trailing hyphen and no trailing space.)*
- **S3-R6a (story):** "A narrative is absent legitimately, not only exceptionally. The organization setting Administration, Work Order Settings, Require Tech Story governs whether the completion gate demands one, **and it is off by default**."  ← **the "off by default" clause is NOT in the PRD. See §4, Q2.**
- **S3-R7 (story):** "When the joined text is too long for QuickBooks it is shortened from the end before it is sent, and it is never cut in the middle of a character. Because the title leads and the narrative trails, the title always survives and the narrative is clipped first."  ← **the story names NO number; the PRD names 4,000 bytes. See §4, Q3.**
- **S3-R10 (story):** "For a user who cannot see financial data, the downloaded report masks its money columns as it does today. The line text is not a money value and is not masked."  *(The story omits the PRD's naming of the four columns.)*

**Acceptance Criteria, verbatim (SV-10132-AC1…AC12):**
1. "Given a line with a title, a description and a narrative, when it reaches QuickBooks, then the description reads \"Replace tie rod - excessive play - Both outer ends worn, replaced and aligned\" with no labels and no semicolons."
2. "Given a line with a title and a description but no narrative, then the text ends after the description with no trailing hyphen and no trailing space."
3. "Given a line whose narrative is the literal \"Tech story missing.\", then the text ends after the description exactly as if the narrative were empty."
4. "Given a line with a title and a narrative but no description, then the text reads \"Replace tie rod - Both outer ends worn, replaced and aligned\": one separator, not two."
5. "Given a line with a title only, then the text is the title alone with no separator."
6. "Given the organization setting Require Tech Story is off and a line is completed with no narrative, then the invoice syncs and the line text ends after the description."
7. "Given a description containing a typed semicolon, then the semicolon is carried through unchanged."
8. "Given a title or description containing a spaced hyphen, then it is carried as written and nothing is escaped or quoted."
9. "Given a joined text longer than the QuickBooks limit, when it is sent, then it is shortened from the end, the cut does not fall inside a character, the title is intact, and the invoice syncs rather than landing in Unexported Items."
10. "Given the same invoice is both synced and downloaded as the Customer Invoice report, then the line text is identical in both."
11. "Given an invoice that reached QuickBooks before this change, then its stored text is not re-sent, re-exported or rewritten."
12. "Given a parts line, a shop supplies line or a fee or discount line, then nothing about its description changes."

### 3.5 · SV-10133 — Story 4 — The Imports

**Summary, verbatim:** "Rename the two columns in both importers to match the product, and keep every spreadsheet a shop has already saved working by accepting the old column names as well."

**Context, verbatim:** "Both importers compare headers strictly, one by exact-set difference and one by ordered equality of the first 24 headers. A plain rename would have failed every file a shop had saved from the old template, so the old names have to keep validating."

**Requirements, verbatim (story wording — compare with §2.4):**
- **S4-R1:** "The work order import's two columns are named \"Title\" and \"Description\", replacing \"What are you doing\" and \"Why are you doing it\"."  ← **the PRD WITHDREW S4-R1. See §4, Q4.**
- **S4-R2:** "The historical invoice import's two columns are named \"\*Line Title\" and \"Line Description\", replacing \"\*Line Title - What are you doing\" and \"Line Description - Why are you doing it\"."
- **S4-R3:** "**Both importers** accept the old column names as well as the new ones. A file carrying either spelling validates and imports identically."  ← **"both importers" vs the PRD's one. See §4, Q4.**
- **S4-R4:** "A file may mix the two spellings, carrying one column under its old name and the other under its new one."
- **S4-R5:** "The old name is accepted as the column it became: it is neither reported missing nor reported as a column to remove."
- **S4-R6:** "The downloadable sample file and the on-screen column list both show the new names."
- **S4-R7:** "Every other column name, and the required order of columns, is unchanged."
- **S4-N1:** "A genuinely unrecognized column is still rejected. The compatibility rule covers exactly the two renamed columns and nothing else."

**Acceptance Criteria, verbatim (SV-10133-AC1…AC8):**
1. "Given a work order import file using the new column names, then it validates and imports."  ← **depends on the withdrawn S4-R1. See §4, Q4.**
2. "Given a work order import file saved from the old template, then it validates and imports identically, with no warning about a missing or extra column."  ← **same.**
3. "Given a file carrying one column under its old name and the other under its new name, then it validates and imports."
4. "Given a historical invoice import file using either spelling of the two columns, then it validates and imports."
5. "Given the sample file is downloaded, then its two columns show the new names."
6. "Given the on-screen column list is viewed, then it shows the new names."
7. "Given a file carrying a column name that is neither the old nor the new spelling, then it is rejected and the message names the column missing and the column to remove."  ← **a dev comment on SV-10133 says the PRD reworded this and the shipped message is the existing generic one. See §4, Q5.**
8. "Given any import file, then every other column name and the required column order behaves exactly as before."

### 3.6 · The four verification TASKS (SV-10390 · SV-10391 · SV-10392 · SV-10393)

These are **engineering verification tickets, not requirements**. They are recorded here because they
**name a source we do not hold** and because they state scope decisions:

- All four read, verbatim: "Tech plan: Milan has the current copy." and "When all four verification tickets for this feature are Done, it's ready for QA."
- **SV-10390** — "**What to verify:** Labor line text sent to QuickBooks and to the Customer Invoice report (tech plan, Phase 1). FR-008 to FR-014, NFR-001, NFR-004."
- **SV-10391** — "**What to verify:** Tech plan, Phase 3. FR-001 to FR-007, NFR-003."
- **SV-10392** — "**What to verify:** Tech plan, Phases 2 and 4. FR-015 to FR-018, NFR-002. Scope is wording only. Better header error messages (S4-N1) are left for a separate imports epic." and, in its checklist: "Column names are S4-R2's (`*Line Title` / `Line Description`), confirmed by Product. S4-R1 is withdrawn."
- **SV-10393** — "**What to verify:** Tech plan, Phase 5."

**FR-001…FR-018 and NFR-001…NFR-004 are requirement identifiers in a document this workspace does not
hold.** Until the tech plan is supplied, **18 functional and 4 non-functional requirements referenced
by the epic's own tasks cannot be quoted, traced or covered** (Rule 30, Rule 20).

---

## 4 · WHERE THE SOURCES DISAGREE — PO/QA-lead questions, not resolved here

**Rule 58: an ambiguous or conflicting source is never resolved by looking at the build.** Each row
below holds the case open. **None of these was decided by this pass.**

| Q | Conflict | PRD v13 says | Story says | Why it matters |
|---|---|---|---|---|
| **Q1** | The blocked-save message | **S1-R6:** "…the message \"Title is a required field\", replacing \"Line Name is a required field\". Every required-field message in the app uses the \"X is a required field\" form…" | **SV-10130 S1-R6 and AC6:** "…the message reads exactly \"Title is required\"", replacing "Line name is required" | **Two different literal strings for a message a tester must match exactly.** A case quoting the wrong one is a false FAILED. The dev comment on SV-10130 (2026-10-08) states the PRD wins and that "Title is a required field" is what ships — **but a comment is not a source amendment**; the story still carries the other string. Needs a ruling, and the story needs correcting at source. |
| **Q2** | Default of **Require Tech Story** | **S3-R6a** says only that the setting "governs whether the completion gate gets in the way" — **no default stated** | **SV-10132 S3-R6a** adds "**and it is off by default**" | Determines whether the no-narrative path is the default state a tester will meet, and whether seeding must flip a setting. The PRD is silent; silence is not a default (Rule 96). |
| **Q3** | The length limit | **S3-R7:** "longer than **4,000 bytes**"; **A-3** explains the 4,000-vs-4,095 reasoning | **SV-10132 S3-R7:** "too long for QuickBooks" — **no number**; AC9 says "longer than the QuickBooks limit" | A case has to type a specific payload size. The PRD's number is the only quotable one. |
| **Q4** | Is there a work order import? | **S4-R1: "Withdrawn.** There is no separate work order import." — and **S4-R3** covers "The importer" (singular) | **SV-10133 S4-R1** still renames a work order import's columns; **S4-R3** says "**Both importers**"; **AC1 and AC2** test a work order import file | **A whole surface either exists or does not.** SV-10392's checklist says "S4-R1 is withdrawn", agreeing with the PRD. **The story is stale and should be corrected at source** — otherwise someone writes two cases against a surface that does not ship. |
| **Q5** | The rejection message for an unknown column | **S4-N1:** "A genuinely unrecognized column is still rejected." — says nothing about the message | **SV-10133 AC7:** "…it is rejected and **the message names the column missing and the column to remove**" | AC7 asserts message content the PRD does not require. A dev comment on SV-10133 says the PRD reworded this and the shipped message is the existing generic "Invalid file headers provided!". **Quoting AC7 would make the case fail on wording the spec never demanded.** |
| **Q6** | Where does the "off by default" / Require-Tech-Story truth live? | — | — | Related to Q2: the epic's foreign cases **C2359 "Work Orders - Require Tech Story OFF"** and **C2361 "Work Orders - Require Tech Story ON"** already assert this setting's behaviour and are **not ours** (Rule 38). Direction needed on whether our Story-3 cases restate it or reference it. |
| **Q7** | S3-R11's scope claim is untestable from documents | **S3-R11:** "No other report or export reads this line text." | — | This is a **negative existence claim across the whole product**. It cannot be proved from the PRD; it needs either the tech plan or a code audit. Our existing case **C154720** already carries it and is marked by the dev team as "code audit…, not a UI test". Needs an owner. |

**Open question inherited from the PRD itself (§2.9):** *"Who downloads the Customer Invoice report,
and why?"* — PRD states it **blocks nothing**; recorded for completeness.

---

## 5 · CANONICAL IDENTIFIERS (recorded per Skill 15 §3 / Skill 01 §11)

- **Canonical spec URL:** `https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896/What+Are+You+Doing+Why+Are+You+Doing+It`
- **Confluence page id:** **`845348896`** · **space id** `526057474` · **space key** `~712020aa00b8d6a71f4259891982a304227c20`
- **Confluence version at ingest:** **13** (read 2026-10-13)
- **Epic:** **SV-11257** · **Stories:** SV-10130 · SV-10131 · SV-10132 · SV-10133 · **Tasks:** SV-10390 · SV-10391 · SV-10392 · SV-10393
- **PO / spec owner:** **Chris Ward** (PRD "Owner" field; epic reporter, creator and assignee)
- **TestRail:** suite 1, section group **20437** ("What/Why") under section **20434** ("Founder Mode (September 2026)")
