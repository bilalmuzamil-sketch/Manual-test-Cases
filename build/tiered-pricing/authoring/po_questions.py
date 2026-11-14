"""PO questions for Tiered Pricing (owner: Matt Barge). NOTHING IS SENT: no sheet exists yet (skill 07, Rules 66 and 131). Q1, Q2 and Q4 are
the intake drafts (PO-QUESTIONS-DRAFT.md, 14 Nov 2026); Q5 onward are design-vs-PRD candidates found in phase 1 (Rule 130), each holding a
"design version" case in "Design — how it looks" until the PO rules. Every candidate still has to pass skill 07 §6.0 checks a–h on the merged
sheet before it is sent (lesson L-20). ANSWERED lists questions with a recorded answer (none yet)."""
QUESTIONS = {
 "Q1": "A paid work order that is reopened: which tier prices the parts added to it (PRD S10-R14 vs tech plan 1 A4)? [Story 10, batch]",
 "Q2": "Matrix page: does a category picked on the Categories line move when the matrix is saved (PRD S3-R13) or when the picker closes (tech plan D21)?",
 "Q4": "Download header lines: Category before Priced By (reports PRD S4-R7) or Priced By before Category (design 20.20)? [reports, batch]",
 "Q5": "Breadcrumbs: the PRD writes Settings › Pricing › Tiers › <tier> and Settings › Pricing › Matrices › <matrix> (S2-R28, S3-R26); every design board starts at Pricing › … (2.11, 2.32, 2.46, 3.2, 4.26). Which is right?",
 "Q6": "Delete <tier>? dialog: the PRD says the question is just \"Delete <tier>?\" with \"Parts already on work orders keep their prices.\" (S2-R30); design 2.29 adds \"This can't be undone.\". Keep the extra line?",
 "Q7": "Set Rule question with every matrix checked: the PRD writes \"in <n> matrices\" (S2-R23); design 2.53 writes \"in all 7 matrices (2 inactive)\". Add \"all\"?",
 "Q8": "A tier's Pricing tab (and the New Tier page) shows a tier with no rules of its own as \"Same as previous tier\" in the design (2.11-2.17, 2.32, 2.44); the PRD says the tab uses the grid's words, \"Uses previous tier\" (S2-R20, Terminology). Which words?",
 "Q9": "Default's page: the PRD lists every matrix with Work Order Matrix and Part Sale Matrix columns and the grid's summary words (S2-R20, S4-R31: \"% markup\"); design 2.42 shows one Work Order Matrix column with \"3 rules · markup\". Which?",
 "Q10": "Duplicate: the PRD makes \"<name> (copy)\" in the library and opens it (S3-R8); design 3.27 opens an unsaved \"Stop 40 (copy)\" with Cancel and Create Matrix. Is the copy created at once or only on Create Matrix?",
 "Q11": "Picking % Off or $ Off for a column: the PRD says the column starts empty in every range (S4-R7); design 4.11 shows 0 in every range (note: \"% Off starts at 0% in every range\"). Empty or 0?",
 "Q12": "Edit bar count after picking a new rule type for a column: the PRD counts \"each column whose rule type differs\" as one change (S4-R4) but also counts each changed cell; design 4.11 shows \"3 changes\" for one type change on a 3-range column. What number?",
 "Q13": "Add Range: the PRD adds the new range before the last one (S3-R16); design 4.20 adds a new last range (note: \"A new last range\"). Where does it go?",
 "Q14": "Save toast wording: the PRD's example reads \"1 change: Tier 5 is 28% margin.\" (S4-R12); design 3.12 reads \"1 change: Tier 2 $0.00–$100.00: 22% margin.\". Which form?",
 "Q15": "Grid errors: the PRD's messages are \"Enter a % from 0 to 99.99\" and \"Enter a margin from 0 to 99.99\" (S3-R6); the design shows a \"Save is blocked\" banner with \"Tier 5: enter a % from 0 to 99.99 in every range.\" (3.15) and \"Work Order Matrix: Rule 1: Enter a margin from 0 to 99.99\" (4.18). Which words, and is there a banner?",
 "Q16": "Last range label in view: the PRD writes \"$10,000.01 and up\" (S3-R16); the design's view boards write \"$10,000.01 +\" (1.4, 3.2, 4.1) and \"and up\" only in edit. Which?",
 "Q17": "A taken matrix name on New Matrix: the PRD shows an inline error under the name (S3-R6); design 3.25 shows \"A matrix called Stop 40 already exists.\" in the \"Save is blocked\" banner, not under the name. Where?",
 "Q19": "Range delete buttons: the PRD gives every range EXCEPT THE LAST a delete button (S3-R32: \"The last range ... can't be removed\"); the design draws a trash icon on every range except the FIRST, the last \"and up\" range included (4.6, 4.21, 3.11). Which?",
 "Q18": "Layout moves the design shows with no source settling them (checklist line 10): the Price Part Simulator's columns move between view and edit (Part Cost 70 px wider in edit, 3.5→3.25, 3.10→4.7), and opening the Categories picker on New Matrix pushes the tabs and grid down 221 px (3.22→3.23). Intended?",
}
ANSWERED = {}
CANDIDATE = {k for k in QUESTIONS if k not in ("Q1", "Q2", "Q4")}
