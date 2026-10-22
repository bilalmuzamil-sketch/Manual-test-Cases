"""New questions for Chris Ward from the tech plan pass of 22 Oct 2026 (DRAFT, not sent: the QA lead sends them).
Same row shape as questions-2026-10-22/sheet_rows.py ROWS and design-2026-10-22/NEW-QUESTIONS.py: [number, topic, question with
(a)/(b)/(c), what we know today, where we found it, case keys]. Rule 131: they go into the SAME sheet
(11_3z_TpKkOL-MiAWqxrj1jlHP1rn9QXu_h3uCR0SjVA), at the bottom, numbered on from 15 (questions 11 to 15 are the design batch, drafted the
same day), in a colour not used there before, with one dated heading row in that colour and a line added to the colour guide; earlier
rows and answers are not touched.

Skill 07 §6 applied first. Every point where the tech plan speaks and PRD v5 is silent was NOT asked: under the QA lead's ruling of
12 Aug 2026 the tech plan sources the case there (tie order of accented names, question 1; order of locations on the export line,
question 7; a payment showing on reload, question 9 part 2; unknown customers and vendors in a link; the As of date capped at today;
CSV formula guard). Dropped as answered by our own sources:
 - Vendor menu search box only above 8 vendors (tech plan D18) vs PRD S5-R13 "The menu has a search box": PRD S5-R13 also says the
   Vendor filter is "exactly as Inventory Value's Vendor filter", which is what the plan describes; the cases ask for more than 8 vendors.
 - Whether an empty aging bucket's row shows on A/R Detail and A/P Detail (the plan's data always carries five buckets): no case's
   verdict depends on it (skill 07 §6.1).
 - The plan's answers to questions 11, 13 and 14 (it follows the PRD in each) are reported to the QA lead; the questions stay as sent.
Only one statement of the plan contradicts PRD v5: the order of names that start with a punctuation mark (Rule 30, Rule 134 point 5)."""
T = "A/R and A/P Report Sorting: "
BATCH = {"colour": "a colour not used in the sheet before (for example light orange, #FCE5CD)",
         "heading": "New question added 22 Oct 2026 after reading the developers' technical plan (question 16)",
         "colour_guide": "Light orange = new question added 22 Oct 2026, after reading the developers' technical plan",
         "first_row": "the first empty row under question 15"}
ROWS = [
 [16, T + "names that start with a punctuation mark",
  "On all six reports, customers and vendors are listed A to Z. When a name starts with a punctuation mark, which order is right? For example, four customers: \"#1 Diesel\", \"-1 Diesel\", \"10 Trucking\" and \"@Home Towing\".\n(a) Plain character order, as the spec says: \"#1 Diesel\", \"-1 Diesel\", \"10 Trucking\", \"@Home Towing\" (# before -, both before the digits, @ after them).\n(b) The order the developers plan: every punctuation mark before every digit, and - before #: \"-1 Diesel\", then \"#1 Diesel\" and \"@Home Towing\" (the plan does not say which of these two comes first), then \"10 Trucking\".\n(c) Whatever QuickBooks does with these four names (please say, or send a screenshot of them in QuickBooks).",
  "The spec says names sort \"in plain character order: digits and punctuation compare as characters\", the way QuickBooks orders names. The developers' plan says its order keeps every example in the spec, \"but punctuation sorts below digits and punctuation marks order among themselves differently\" (for example - before #), and that a shop reporting a mismatch with QuickBooks on a name starting with a punctuation mark would be the place to look.",
  "PRD v5 (21 Oct 2026) S1-R2 and Key Decisions; tech plan (21 Oct 2026) section 9, Performance; Jira SV-11531 (Story 1)",
  ["S1-16", "S1-01", "S1-02"]],
]
if __name__ == "__main__":
    for r in ROWS: print(r[0], r[1])
