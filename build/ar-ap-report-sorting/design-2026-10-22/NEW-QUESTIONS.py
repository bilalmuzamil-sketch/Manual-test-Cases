"""New questions for Chris Ward from the design full pass of 22 Oct 2026 (DRAFT, not sent: the QA lead sends them).
Same row shape as questions-2026-10-22/sheet_rows.py ROWS: [number, topic, question with (a)/(b)/(c), what we know today, where we found it,
case keys]. Rule 131: they go into the SAME sheet (11_3z_TpKkOL-MiAWqxrj1jlHP1rn9QXu_h3uCR0SjVA), at the bottom (from row 16), numbered on
from 10, in a colour not used there before, with one dated heading row in that colour and a line added to the colour guide; questions 1-10
and their answers are not touched.
Skill 07 §6 applied first. Dropped as answered by our own sources (recorded in authoring/design_data.py RULED): the Totals row's grey band
(PRD S8-R4: native style, compared with Sales By Customer), the Location menu order while it stays open (no conflict with "ticked ones
first", checked on reopening), the chip prefix with one name ticked, and the Customer menu's tags and "2 selected" (both native, as on
Sales By Customer). The A/R heading capitals are already question 4 (sent): the design's production pictures show today's headings
already use capitals ("Transaction Type", "Due Date", "Past Due", "Open Balance", "Customer Full Name"), so options (a) and (b) of
question 4 now lead to the same headings (for the QA lead; no new row)."""
T = "A/R and A/P Report Sorting: "
BATCH = {"colour": "Light green (#D9EAD3), not used in the sheet before",
         "heading": "New questions added 22 Oct 2026 after reading the design (questions 11 to 15)",
         "colour_guide": "Light green = new questions added 22 Oct 2026, after reading the design (from row 16)",
         "first_row": 16}
DESIGN = "the design canvas \"A/R and A/P Report Sorting\" (https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4)"
ROWS = [
 [11, T + "the buttons of the \"Switch location?\" dialog",
  "When the user clicks an invoice from another location they work at, a \"Switch location?\" dialog opens on the report. The design draws two buttons, \"Cancel\" on the left and \"Switch Location\" (capital L) on the right, plus a close \"×\" at the top right. The spec says the buttons are \"Switch location\" (small l) and \"Cancel\". Which is right?\n(a) As the design: \"Cancel\", then \"Switch Location\" with a capital L, and the \"×\" closes the dialog like \"Cancel\".\n(b) As the spec: \"Switch location\" with a small l (please also say the order of the buttons and whether there is a \"×\").\n(c) Something else (please say).",
  "The spec says: title \"Switch location?\" ... buttons \"Switch location\" and \"Cancel\", and calls it \"the existing location-switch prompt\". The design's picture of the dialog, and its caption \"Switch Location opens it there.\", show the capital L, the button order and the \"×\".",
  "PRD v5 (21 Oct 2026) S7-R3, User Feedback Summary; " + DESIGN + ", page 5 \"Another location asks first\"; Jira SV-11537 (Story 7)",
  ["D-76", "D-39", "D-64", "S7-03", "S7-04", "S7-05"]],
 [12, T + "the search box in the Vendor filter",
  "On the A/P reports, the Vendor filter's menu has a search box at the top. The design shows its hint text as \"Search vendor\"; the spec writes \"Search vendors\". Which is right?\n(a) \"Search vendors\", as the spec says.\n(b) \"Search vendor\", as the design shows.\n(c) Whatever Inventory Value's Vendor filter shows today (the spec says the filter is exactly that one).",
  "The spec says the Vendor filter is \"exactly as Inventory Value's Vendor filter (truck icon, \"Search vendors\")\". The design's picture of the open Vendor menu shows \"Search vendor\".",
  "PRD v5 S5-R13; " + DESIGN + ", page 7 \"The native Vendor menu\"; Jira SV-11535 (Story 5)",
  ["D-77", "D-32", "D-73", "S5-29"]],
 [13, T + "the Totals row when no location is ticked",
  "When the user clears the Location filter (\"Location: No locations\"), the report shows the empty state \"No record matches these filters\". The design also draws a Totals row reading $0.00 above the empty state; the spec says there are no totals. Which is right?\n(a) No Totals row, as the spec says.\n(b) A Totals row of $0.00, as the design shows.\n(c) Something else (please say).",
  "The spec says: \"the native empty state (S8-R5) with \"Clear all filters\", no totals and no Location column\". The design's picture \"Cleared: No locations\" shows \"Totals $0.00 $0.00\" under the column headings.",
  "PRD v5 S5-R6a; " + DESIGN + ", page 4 \"Cleared: No locations\"; Jira SV-11535 (Story 5)",
  ["D-78", "D-68", "S5-14", "S3-24", "S6-03", "D-19", "D-20", "D-21", "D-22", "D-23", "D-24"]],
 [14, T + "order of same-day invoices inside a customer on A/R Collection",
  "On A/R Collection the invoices inside each customer are listed oldest date first. When several invoices have the same date, the spec says they are put in invoice number order. In the design's picture, five invoices of one customer all dated Aug 27, 2026 are not in number order (S3-14690, S3-14693, S3-15660, S3-14691, S3-14692). Which is right?\n(a) Same-day invoices in number order, as the spec says (the picture is out of date).\n(b) Same-day invoices in the order of the time they were invoiced that day, as the picture suggests.\n(c) Something else (please say).",
  "The spec says: \"inside each group, rows open oldest date first, ties by document number\". The design's picture \"The customer row stays pinned\" shows the five Aug 27, 2026 invoices out of number order. On A/R Detail the design's pictures do show ties in number order.",
  "PRD v5 S1-R6, S2-R4; " + DESIGN + ", page 3 \"The customer row stays pinned\"; Jira SV-11531 (Story 1)",
  ["D-79", "S1-10", "S1-11", "S2-12", "S2-20"]],
 [15, T + "how links look (bold or regular)",
  "On the six reports, invoice and bill numbers (and customer and vendor names on the Summaries) are blue links. The spec says links are \"semi-bold\"; in every design picture the links are blue but at the same weight as the plain text beside them. Which is right?\n(a) Semi-bold, as the spec says.\n(b) Regular weight, as the design shows.\n(c) Exactly as Work In Progress's links look today (please say which that is).",
  "The spec says: \"Links use the native report link style (the same blue as Work In Progress, semi-bold, no underline, underlined only on keyboard focus)\". The design's pictures (for example \"Links only where they can open\" and \"A/R Aging Summary opens A to Z\") show the links at regular weight.",
  "PRD v5 S7-R7; " + DESIGN + ", pages 1, 5 and 6; Jira SV-11537 (Story 7)",
  ["D-80", "D-01", "D-04", "D-07", "D-10", "D-13", "D-16"]],
]
if __name__ == "__main__":
    for r in ROWS: print(r[0], r[1])
