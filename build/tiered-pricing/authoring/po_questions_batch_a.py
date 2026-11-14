"""Batch A PO question candidates for Tiered Pricing (owner: Matt Barge), Q20-Q39. NOTHING IS SENT (no sheet exists yet; skill 07, Rules 66
and 131). Each candidate passed skill 07 §6.0 checks a-g here (a: no PRD precedence statement settles it — PRD §7 hands only layout, styling,
sort indicators, scrolling and pinned columns to the design; b: no source backs the design's version; c: the tech plan only restates the PRD
row; d: no design-library rule; e: testable; f: the PO owns it; g: the words differ, they are not missing). Check h runs on the merged sheet.
Each holds a "design version" case in Design — how it looks."""
QUESTIONS = {
 "Q20": "Matrices list, Part Sale Matrix column: the PRD says it shows \"On or Off\" (S6-R1); the design shows \"Same as work orders\" when there is no separate Part Sale side and the Part Sale rules in short (\"2 rules · cost + $, margin\") when there is one (6.2). Which?",
 "Q21": "Search with no match: the PRD's words are 'No matrices match the search \"…\".' (S6-R3) and 'No categories match the search \"…\".' (S7-R4); the design writes \"No matrices match \"zzz\"\" (6.10) and \"No category matches \"zzz\"\" (7.6), with no period. Which words?",
 "Q22": "Category page, other categories on the same matrix: the PRD puts a line above the grid, \"The <matrix> matrix also prices <n> other categories: <A> · <B>.\" (S7-R15); the design puts that sentence in an info-icon tooltip beside the matrix name, with no line (7.9). Line or tooltip?",
}
CANDIDATE = set(QUESTIONS)
QUESTIONS.update({
 "Q23": "New Category page buttons: the PRD says \"It has Save and Cancel\" (S8-R10) and tech plan 1 Phase 16 agrees; the design shows Cancel and \"Create Category\" (8.6, 8.8), like New Tier's \"Create Tier\". Save or Create Category?",
 "Q24": "Category messages: (a) the Delete question in the PRD includes \"Invoices already sent aren't sent again; one synced again later books these parts to Uncategorized's QuickBooks item.\" (S8-R8); design 8.11 leaves that sentence out. (b) The taken-name error in the PRD is \"A category called <name> already exists\" (S8-N3); design 8.4 adds \"Click away to keep Brakes.\" Which words?",
 "Q25": "Uncategorized's page: the PRD says it is read-only \"with no rename, Delete or matrix picker\" and can't be edited (S8-R4); design 8.3 shows a grayed Pricing Matrix box and a grayed Tax Exempt checkbox, and a QuickBooks Products And Services picker that looks editable. Should the matrix field show (grayed), and can Uncategorized's QuickBooks mapping and Tax Exempt be changed?",
})
CANDIDATE = set(QUESTIONS)
