# What/Why — Chris Ward's answers to our 8 questions (14 Oct 2026), copied verbatim

Source: Google Doc "What/Why (Title and Description) – questions for Chris Ward (14 Oct 2026)",
https://docs.google.com/document/d/1QcT7FRZci6AhYcI33HUac-Oob03-gCnCOKn2NFHMLjA/edit — read 27 Oct 2026 with the Drive tools
(read_file_content, comments included: none). The answers below are copied word for word from the "Answer:" lines. PRD v14 (same day)
carries answers 1-8 as requirement text; v15 changed only the Status row.

1. Yes. A tech story made only of spaces counts as no tech story, and the line ends after the description. The same goes for a title or description that is only spaces (S3-R3, S3-R6).

2. Yes. Spaces and line breaks at the very end of the whole line are removed. Nothing inside the values is touched (S3-R8).

3. Yes. Title and Description always sit at the top of their boxes, empty or filled, with the grey question underneath, as in the design. It's the one layout change in the dialog (S1-R3, S1-R7).

4. Yes. Column names are matched regardless of capital letters and surrounding spaces, as every column already is, so the old names in any capitalization import without an error (S4-R3).

5. The new wording. The report is built each time it's downloaded, so an invoice made before the release shows the new text. QuickBooks keeps the text that invoice was originally sent with (S3-R4, S3-N1, new S3-E4).

6. It's written when an existing line with no tech story is saved from the Edit Line window: open it, save, and the line holds "Tech story missing." A line saved from New Line keeps an empty tech story. Neither depends on completion or on Require Tech Story (S3-R6).

7. The message shows under the Title box whenever Title is in error, including when the user leaves it empty, the same as every other field in the dialog since SV-10916 (S1-R6). The current build shows it only after a blocked save, so please log that as a bug against S1-R6.

8. Shops created since the setting was introduced in June 2025 start with it off. Shops that existed then started with it on. We are not changing any shop's setting with this release, so please test both states (S3-R6a).

FYI line of the sheet (ours, not an answer): "The design shows the Title box as "Title \*" (with a star). The developer says no star ships ... Our test cases follow your page: "Title", with no star." — the 27 Oct design re-read shows "Title" (no star) on Main.dc.html.

QA lead, 27 Oct 2026: "Not now" to filing the S1-R6 bug of answer 7 — so the S1-R6 cases keep the PRD's expectation, with no EXPECT FAIL (no ticket, Rule 61).
