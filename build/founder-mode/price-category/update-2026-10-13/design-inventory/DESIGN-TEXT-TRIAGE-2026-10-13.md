# Price/Category — design text inventory and triage, 13–14 Oct 2026 (Rule 124 as amended 9 Oct)

`design_text_inventory.py` over all 6 files of the 13 Oct design copy against the 37 new cases (preconditions, steps, results, quotes, setup doc Part 1). 65 distinct texts; 14 already in a case; the other 51 classified: {'DESIGN NOTE': 17, 'COVERED': 24, 'DATA': 7, 'OUT-OF-SCOPE': 3}. **Unclassified: 0. CASE-NEEDED: 0.** Labels the steps tell a tester to click were checked against the PRD, design, tech plan, Jira and playbook by script: 0 not found.

| # | Text | Where | Class |
|---|---|---|---|
| 0 | The three rules a developer is most likely to get wrong | Behaviour.dc.html:27 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 1 | Drawn with real values from Automotive - 4700. | Behaviour.dc.html:28 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 2 | S1-R15 and S1-R18 · the sort belongs to the user | Behaviour.dc.html:32 | COVERED — sort survives an edit and a search (S1-R15/S1-R18 cases) |
| 3 | 1. Sort by QuickBooks column | Behaviour.dc.html:35 | COVERED — sort survives an edit and a search (S1-R15/S1-R18 cases) |
| 4 | 2. Edit a category, save | Behaviour.dc.html:42 | COVERED — sort survives an edit and a search (S1-R15/S1-R18 cases) |
| 5 | Today: back to Name A to Z | Behaviour.dc.html:49 | COVERED — sort survives an edit and a search (S1-R15/S1-R18 cases) |
| 6 | S1-R17 · no blanks: never mapped reads Parts | Behaviour.dc.html:61 | COVERED — C154732 (a never-mapped category reads Parts and sorts under P, S1-R17) |
| 7 | Parts · never mapped | Behaviour.dc.html:66 | COVERED — C154732 (a never-mapped category reads Parts and sorts under P, S1-R17) |
| 8 | A category that has never been mapped shows Parts in that column, as the page does today. It sorts under P in  | Behaviour.dc.html:76 | COVERED — C154732 (a never-mapped category reads Parts and sorts under P, S1-R17) |
| 9 | S3-R6 · numbers compare as numbers | Behaviour.dc.html:80 | COVERED — C154743, C154746 (numbers compare as numbers, S3-R6) |
| 10 | Numeric aware | Behaviour.dc.html:91 | COVERED — C154743, C154746 (numbers compare as numbers, S3-R6) |
| 11 | Both columns are sorted ascending and both are correct by their own rule. The left one is what the shop sees t | Behaviour.dc.html:99 | COVERED — C154743, C154746 (numbers compare as numbers, S3-R6) |
| 12 | Before · production today | CategoriesBefore.dc.html:25 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 13 | HD-ABS Comp | CategoriesBefore.dc.html:53 | DATA — real record from the production shop shown on the boards; never used as an example (every case makes its own ZZAUTOTEST data) |
| 14 | HD-Air Brakes & Air Suspension | CategoriesBefore.dc.html:54 | DATA — real record from the production shop shown on the boards; never used as an example (every case makes its own ZZAUTOTEST data) |
| 15 | HD-Belts, Pulleys & Tensioners | CategoriesBefore.dc.html:56 | DATA — real record from the production shop shown on the boards; never used as an example (every case makes its own ZZAUTOTEST data) |
| 16 | What is true here today | CategoriesBefore.dc.html:60 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 17 | Default is pinned to the top. | CategoriesBefore.dc.html:61 | COVERED — Default category pinned at the top under every sort (Story 1 cases) |
| 18 | “Uncategorized” sits above “70%override” whatever its name would sort as. Neither header sorts: clicking Name  | CategoriesBefore.dc.html:61 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 19 | Numbers inside a value compare as numbers, so | FixedRules.dc.html:103 | COVERED — C154743, C154746 (numbers compare as numbers, S3-R6) |
| 20 | come before | FixedRules.dc.html:103 | COVERED — C154743, C154746 (numbers compare as numbers, S3-R6) |
| 21 | Fixed prices print with whatever decimals the value carries: | FixedRules.dc.html:108 | OUT-OF-SCOPE — price formatting is outside this spec (design note; bug SV-10387) |
| 22 | Real part numbers from Automotive - 4700. The order is the whole point. | FixedRules.dc.html:27 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 23 | Pricing Matrices(22) | FixedRules.dc.html:38 | OUT-OF-SCOPE — "before" tab labels of today's production screen (no space before the count); the after labels are in the cases |
| 24 | Fixed Rules(30) | FixedRules.dc.html:39 | OUT-OF-SCOPE — "before" tab labels of today's production screen (no space before the count); the after labels are in the cases |
| 25 | No header sorts. The order comes from the server, character by character, which is why | FixedRules.dc.html:63 | COVERED — C154743, C154746 (numbers compare as numbers, S3-R6) |
| 26 | lands before | FixedRules.dc.html:63 | COVERED — C154743, C154746 (numbers compare as numbers, S3-R6) |
| 27 | After · Story 3 | FixedRules.dc.html:69 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 28 | Pricing matrices (22) | FixedRules.dc.html:74 | COVERED — tab labels with a space before the count, in the Pricing cases (e.g. "Pricing matrices (", "Fixed rules (") |
| 29 | Fixed rules (30) | FixedRules.dc.html:75 | COVERED — tab labels with a space before the count, in the Pricing cases (e.g. "Pricing matrices (", "Fixed rules (") |
| 30 | After · Story 1 | Main.dc.html:26 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 31 | What changes, and what does not | Main.dc.html:64 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 32 | Name sorts, and says so. | Main.dc.html:65 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 33 | The header carries an arrow for the direction applied, ascending on open. | Main.dc.html:65 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 34 | The QuickBooks column sorts too. | Main.dc.html:66 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 35 | A category that has never been mapped shows Parts there and sorts under P with everything else; no row is move | Main.dc.html:66 | COVERED — C154732 (a never-mapped category reads Parts and sorts under P, S1-R17) |
| 36 | Default stays pinned, exactly as it is today. | Main.dc.html:67 | COVERED — Default category pinned at the top under every sort (Story 1 cases) |
| 37 | COC matrix 10/29/2024 | Matrices.dc.html:60 | DATA — real record from the production shop shown on the boards; never used as an example (every case makes its own ZZAUTOTEST data) |
| 38 | Default matrix 07/12/2023 | Matrices.dc.html:65 | DATA — real record from the production shop shown on the boards; never used as an example (every case makes its own ZZAUTOTEST data) |
| 39 | HD - Engine Comp. | Matrices.dc.html:70 | DATA — real record from the production shop shown on the boards; never used as an example (every case makes its own ZZAUTOTEST data) |
| 40 | HD-Dynamic 55 | Matrices.dc.html:75 | DATA — real record from the production shop shown on the boards; never used as an example (every case makes its own ZZAUTOTEST data) |
| 41 | the header sorts and shows its arrow, the sort survives an edit, and the tab label gains a space before the co | Matrices.dc.html:84 | COVERED — tab labels with a space before the count, in the Pricing cases (e.g. "Pricing matrices (", "Fixed rules (") |
| 42 | The column is labeled | Matrices.dc.html:86 | COVERED — the Pricing matrices column is labelled "Matrix Category" (cases use that label) |
| 43 | but holds the matrix name. Drawn as it is rather than quietly corrected. | Matrices.dc.html:86 | COVERED — the Pricing matrices column is labelled "Matrix Category" (cases use that label) |
| 44 | Categories - after | canvas.json:17 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 45 | Fixed rules - before and after | canvas.json:33 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 46 | The three rules that bite | canvas.json:41 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 47 | Drawn from production screenshots of Automotive - 4700, taken 2026-09-15. Every category, matrix and part numb | canvas.json:50 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 48 | Default rows do not move. Categories pins its Default row to the top and keeps doing so under every sort; Pric | canvas.json:57 | COVERED — Default category pinned at the top under every sort (Story 1 cases) |
| 49 | Two of these three are the real work: a sort surviving a reload and a search share one code path today, and th | canvas.json:64 | COVERED — sort survives an edit and a search (S1-R15/S1-R18 cases) |
| 50 | Categories - before | canvas.json:9 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
