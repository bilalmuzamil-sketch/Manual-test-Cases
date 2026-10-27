# WORKING COPY for the design check only — PRD 845348896 version 15 (2026-10-14T16:32:35Z), section 5 "Requirements", read 27 Oct 2026
# with the Atlassian tools (markdown, detail full). Not a source file: Phase A saves the canonical copy in sources/.
# Verified against the v13 copy by script (only the v14 Change Log codes differ): see inventory/prd-v13-v15-req-diff.txt.

### Story 1: The Work Order Line Dialog

- **S1-R1:** The first field is labeled exactly "Title", with no asterisk.
- **S1-R2:** The second field is labeled exactly "Description".
- **S1-R3:** The Title box carries the placeholder "What are you doing?" and the Description box carries "Why are you doing it?". Placeholder text shows while the box is empty and disappears as soon as there is a value. The labels Title and Description always sit at the top of their boxes, empty or filled, with the placeholder underneath; in production the label sat inside the empty box. This is the one layout change in the dialog.
- **S1-R4:** The label does not change with the state of the field. It reads "Title" whether the canned-line picker is empty or filled, which replaces a rule that swapped the label between the question and "Title" depending on that state.
- **S1-R5:** The canned-line picker at the top of the dialog is labeled "Title" and carries the placeholder "What are you doing?" in its typeahead box, the same as the free-text Title field. The dialog focuses this field on open, so the placeholder is visible the moment the dialog appears and clears as soon as the user types or picks a canned line. (Corrected 2026-09-10: the first build gave the picker no placeholder, so the prompt never appeared on a new line.)
- **S1-R6:** Leaving Title empty blocks the save with the message "Title is a required field", replacing "Line Name is a required field". Every required-field message in the app uses the "X is a required field" form, and this one keeps it. The message shows under the Title box whenever Title is in error, including when the user leaves it empty, the same as every other field in the dialog (SV-10916).
- **S1-R7:** Nothing else about the dialog changes, other than the label position in S1-R3: same fields in the same order, same validation, same values saved.

**Negative cases:**

- **S1-N1:** No existing line is altered. The rename is on the labels, not on the data.

### Story 2: The ShopCoach Line Builder

- **S2-R1:** The line builder's two text fields are labeled "Title" and "Description".
- **S2-R2:** Both carry the same placeholders as S1-R3.
- **S2-R3:** What ShopCoach generates and writes into a line is unchanged. A generated line becomes an ordinary work order line and follows Story 3 like any other.

### Story 3: What Reaches QuickBooks

- **S3-R1:** A line's text joins the title, the description and the technician's narrative with a spaced hyphen and no labels: "Replace tie rod - excessive play - Both outer ends worn, replaced and aligned".
- **S3-R2:** The separator is exactly one space, one hyphen-minus, one space.
- **S3-R3:** A separator appears only between two segments that are both present. A line with no description joins the title straight to the narrative. A line with no narrative ends after the description. A line with neither carries the title alone. In every case there is no trailing separator and no trailing space. A segment made only of spaces counts as absent.
- **S3-R4:** The same text is used by the live QuickBooks sync and by the downloadable Customer Invoice report. Built at the same moment, the two never show different text for the same line. An invoice already in QuickBooks keeps its old text there (S3-N1, S3-E4).
- **S3-R5:** The technician's narrative is the third and last segment. It carries no label of any kind, and no semicolon appears anywhere in the line text. The reasoning is in §2.
- **S3-R6:** A line with no narrative ends after the description, with no trailing hyphen and no trailing space. A narrative is absent when the value is empty, is made only of spaces, or is the literal placeholder "Tech story missing."; the three are treated identically, and none reaches QuickBooks. The Edit Line window writes the placeholder when an existing line with no tech story is saved from it; a line saved from New Line keeps an empty tech story. Neither depends on completion or on Require Tech Story.
- **S3-R6a:** A narrative is absent legitimately, not only exceptionally. The organization setting Administration, Work Order Settings, Require Tech Story governs whether the completion gate gets in the way, so a shop with it switched off invoices completed lines with no narrative as a matter of course. Shops created since the setting was introduced (June 2025) start with it off; shops that existed then started with it on. Each shop keeps the value it has set, and this change does not touch it.
- **S3-R7:** When the joined text is longer than 4,000 bytes it is shortened from the end to fit, and it is never cut in the middle of a character. The live sync and the downloadable report are both cut at that same limit, so S3-R4 holds on a long line too. Today only the live sync cuts, and it cuts by bytes without regard for where a character ends; the report has no cut at all. Because the title leads and the narrative trails, the title always survives and the narrative is what gets clipped first.
- **S3-R7a:** The limit is a storage limit rather than a count of what a reader sees, so a line written with accented or non-Latin characters may be shortened more than an English line that looks the same length on screen. Two lines that look equally long can therefore be cut at different points. That is correct behavior and not a defect.
- **S3-R8:** The values themselves are unchanged. Nothing is trimmed, truncated, re-cased or escaped that is not trimmed, truncated, re-cased or escaped today, other than the shortening described in S3-R7 and the removal of spaces and line breaks at the very end of the whole line (S3-R3).
- **S3-R9:** A title, a description or a narrative that itself contains a hyphen, including a spaced hyphen, is carried as written. The separator is not escaped and the text is not quoted, so a reader cannot always tell our separator from theirs. This is accepted deliberately: the alternative is printing a field name to mark the join, which is the thing being removed.
- **S3-R9a:** A semicolon typed inside any of the three values is ordinary punctuation and is carried through untouched. It was ambiguous only while the semicolon was the separator.
- **S3-R10:** For a user who cannot see financial data, the downloaded report masks its money columns (rate, amount, tax and average cost) as it does today. The line text is not a money value and is not masked, so the same words reach every reader of the file.
- **S3-R11:** No other report or export reads this line text. Changing it changes these two routes and nothing else.
- **S3-R12:** An imported historical invoice never reaches the live QuickBooks sync, so its line text is unaffected whatever the import wrote into it.

**Negative cases:**

- **S3-N1:** Invoices already in QuickBooks keep the text they were sent with. Nothing is re-synced to QuickBooks or rewritten there.
- **S3-N2:** No line falls back to the old labels or the old questions, including lines created before this change.
- **S3-N3:** A parts line, a shop supplies line and a fee or discount line are unaffected: none of them carries a title-and-description pair.

**Edge cases:**

- **S3-E1:** A line with a title, no description and a narrative reads "Replace tie rod - Both outer ends worn, replaced and aligned": one separator, not two, and no gap where the description would have been.
- **S3-E2:** An invoice that is reversed and re-invoiced after release day carries the new text on the new invoice, while the original keeps the old text. A bookkeeper can therefore see both forms in one set of books, on one job.
- **S3-E3:** A description long enough to be cut still syncs. The invoice reaches QuickBooks; it does not land in Unexported Items.
- **S3-E4:** The downloadable Customer Invoice report is built each time it is downloaded, so an invoice made before the release shows the new text in it, while QuickBooks keeps the text that invoice was sent with (S3-N1).

### Story 4: The Imports

- **S4-R1:** **Withdrawn.** There is no separate work order import. The only live import carrying these columns is Administration → Invoices, which writes to the imported work order history and is covered by S4-R2. The column names this requirement renamed exist only in code nothing calls, and nothing ships for them.
- **S4-R2:** The historical invoice import's two columns (Administration → Invoices) are named "\\\*Line Title" and "Line Description", replacing "\\\*Line Title - What are you doing" and "Line Description - Why are you doing it".
- **S4-R3:** The importer accepts the old column names as well as the new ones. A file carrying either spelling validates and imports identically. Column names are matched regardless of capital letters and surrounding spaces, as every column already is.
- **S4-R4:** A file may mix the two spellings, carrying one column under its old name and the other under its new one.
- **S4-R5:** The old name is accepted as the column it became: it is neither reported missing nor reported as a column to remove.
- **S4-R6:** The downloadable sample file and the on-screen column list both show the new names.
- **S4-R7:** Every other column name, and the required order of columns, is unchanged.

**Negative cases:**

- **S4-N1:** A genuinely unrecognized column is still rejected. The compatibility rule covers exactly the two renamed columns and nothing else.
