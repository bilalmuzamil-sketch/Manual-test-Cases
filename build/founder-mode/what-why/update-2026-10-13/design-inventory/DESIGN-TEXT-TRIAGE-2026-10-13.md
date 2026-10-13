# What/Why — design text inventory and triage, 13 Oct 2026 (Rule 124 as amended 9 Oct)

`design_text_inventory.py` over all 8 files of the 13 Oct design copy against the 37 new cases (preconditions, steps, results, quotes and setup doc Part 1). 112 distinct texts; 28 already in a case; the other 84 classified: {'DESIGN NOTE': 57, 'DATA': 11, 'COVERED': 11, 'SPEC-CONFLICT (minor)': 1, 'OUT-OF-SCOPE': 4}. **Unclassified: 0. CASE-NEEDED: 0.**

| # | Text | Where | Class |
|---|---|---|---|
| 0 | Before · staging today | DialogBefore.dc.html:23 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 1 | After hours CP rate | DialogBefore.dc.html:57 | DATA — example record value or example line text on a board |
| 2 | What a writer sees today | DialogBefore.dc.html:80 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 3 | Each field is named by the question it asks. Nothing on screen says what the values are called, so whatever is | DialogBefore.dc.html:81 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 4 | Extreme cases | EdgeCases.dc.html:25 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 5 | What the joined line reads when the inputs are awkward. Three segments, one separator, and a separator only ev | EdgeCases.dc.html:26 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 6 | S3-R3 · no description | EdgeCases.dc.html:32 | COVERED — A-06 (no description: one separator, S3-R3/S3-E1) |
| 7 | One separator, not two. The empty description leaves no gap and no double hyphen behind it. | EdgeCases.dc.html:41 | COVERED — A-06 (no description: one separator, S3-R3/S3-E1) |
| 8 | S3-R9 · the title already contains a hyphen | EdgeCases.dc.html:45 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 9 | Replace tie rod - passenger side | EdgeCases.dc.html:47 | DATA — example record value or example line text on a board |
| 10 | Torqued to 74 ft-lb, alignment set | EdgeCases.dc.html:49 | DATA — example record value or example line text on a board |
| 11 | Replace tie rod - passenger side - excessive play - customer waiting - Torqued to 74 ft-lb, alignment set | EdgeCases.dc.html:53 | COVERED — C154718 (hyphen typed in a value carried as written, S3-R9) |
| 12 | Carried as written. Nothing is escaped or quoted, so a reader cannot tell our separator from theirs. This is t | EdgeCases.dc.html:54 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 13 | The four flavours of tech story that reach the books | EdgeCases.dc.html:58 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 14 | Written at the completion gate · Require Tech Story ON | EdgeCases.dc.html:61 | COVERED — C154716 / C154713 (Require Tech Story off ends after the description; on carries the narrative, S3-R6/S3-R6a) |
| 15 | Require Tech Story OFF · the shop never wrote one | EdgeCases.dc.html:65 | COVERED — C154716 / C154713 (Require Tech Story off ends after the description; on carries the narrative, S3-R6/S3-R6a) |
| 16 | The “Tech story missing.” placeholder · suppressed, as both invoice views suppress it | EdgeCases.dc.html:69 | COVERED — A-07 ("Tech story missing." left out, S3-R6) |
| 17 | Imported from a previous system · may be empty | EdgeCases.dc.html:73 | COVERED — A-10 (imported historical invoice, S3-R12) |
| 18 | Three of these four end after the description, and none of them leaves a trailing hyphen. The placeholder case | EdgeCases.dc.html:77 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 19 | excessive play; also checked the drag link | EdgeCases.dc.html:84 | COVERED — C154718 (semicolon typed inside a description carried through, S3-R9a) |
| 20 | Drag link within spec | EdgeCases.dc.html:85 | DATA — example record value or example line text on a board |
| 21 | Replace tie rod - excessive play; also checked the drag link - Drag link within spec | EdgeCases.dc.html:89 | COVERED — C154718 (semicolon typed inside a description carried through, S3-R9a) |
| 22 | This was an open question while the semicolon was the separator: a typed one was indistinguishable from a new  | EdgeCases.dc.html:90 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 23 | Edit Line · after · S1-R1, S1-R2, S1-R4 | EditAfter.dc.html:25 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 24 | HD Fleet Rate | EditAfter.dc.html:66 | DATA — example record value or example line text on a board |
| 25 | Two labels, nothing else | EditAfter.dc.html:93 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 26 | The floating labels now read | EditAfter.dc.html:94 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 27 | , so a filled field is named rather than interrogated. The empty Description still prompts with “Why are you d | EditAfter.dc.html:94 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 28 | Status, Technicians, the labor row, the ShopCoach link, Delete and Save & Close are all untouched. Edit mode h | EditAfter.dc.html:95 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 29 | Edit Line · before | EditBefore.dc.html:25 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 30 | The question is worst here | EditBefore.dc.html:92 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 31 | With a value in the field, the label floats up and sits directly above the words it supposedly names. “Replace | EditBefore.dc.html:93 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 32 | After · S1-R1 to S1-R5 | Main.dc.html:23 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 33 | Title * | Main.dc.html:38 | SPEC-CONFLICT (minor) — design shows "Title *" with an asterisk on New Line; the PRD names the label "Title". Cases expect "Title"; PO question added |
| 34 | The only two things that change | Main.dc.html:84 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 35 | The field is now named | Main.dc.html:85 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 36 | and the question moves inside it as the prompt, in sentence case: “What are you doing?”. Same for | Main.dc.html:85 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 37 | Require Tech Story OFF, none written | QuickBooks.dc.html:103 | COVERED — C154716 / C154713 (Require Tech Story off ends after the description; on carries the narrative, S3-R6/S3-R6a) |
| 38 | No trailing hyphen and no trailing space. A separator appears only when there is something on both sides of it | QuickBooks.dc.html:107 | COVERED — C154716 / C154713 (Require Tech Story off ends after the description; on carries the narrative, S3-R6/S3-R6a) |
| 39 | The line a bookkeeper reads | QuickBooks.dc.html:23 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 40 | One builder feeds both routes: the live QuickBooks sync and the downloadable Customer Invoice report · S3-R1 t | QuickBooks.dc.html:24 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 41 | What are you doing?: Front brake pads;Why are you doing it?: Customer reports grinding;Tech Story: Pads at 2mm | QuickBooks.dc.html:40 | DATA — example record value or example line text on a board |
| 42 | Front brake pads - Customer reports grinding - Pads at 2mm, rotors turned, bed-in road test | QuickBooks.dc.html:61 | DATA — example record value or example line text on a board |
| 43 | Title, description, then the technician's narrative, each separated by a spaced hyphen. No semicolons and no f | QuickBooks.dc.html:66 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 44 | Why the narrative carries no label | QuickBooks.dc.html:70 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 45 | Because the two invoice views disagree about the label and agree about everything else. Legacy prints the narr | QuickBooks.dc.html:71 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 46 | Legacy invoice | QuickBooks.dc.html:74 | OUT-OF-SCOPE — legacy and modern invoice views are not changed by this feature (PRD S3-R11; design note "why the narrative carries no label") |
| 47 | Modern invoice | QuickBooks.dc.html:82 | OUT-OF-SCOPE — legacy and modern invoice views are not changed by this feature (PRD S3-R11; design note "why the narrative carries no label") |
| 48 | Scope of work | QuickBooks.dc.html:86 | OUT-OF-SCOPE — legacy and modern invoice views are not changed by this feature (PRD S3-R11; design note "why the narrative carries no label") |
| 49 | Drawn from the templates rather than from memory: legacy at batch-invoice.html.twig lines 679 to 690, modern a | QuickBooks.dc.html:91 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 50 | Whether a line has a narrative at all is a shop setting | QuickBooks.dc.html:95 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 51 | : “Tech story will be a required field before a line can be completed on a work order.” With it on, the comple | QuickBooks.dc.html:96 | OUT-OF-SCOPE — existing Require Tech Story setting text, not changed by this feature |
| 52 | The long end of the scale | Truncation.dc.html:23 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 53 | ShopView allows 255 characters of title and 65,535 of description. Both routes into QuickBooks, the live sync  | Truncation.dc.html:24 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 54 | S3-R7 · the cut lands in the description, never the title | Truncation.dc.html:28 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 55 | Title · always survives | Truncation.dc.html:31 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 56 | Description · clipped at the limit | Truncation.dc.html:35 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 57 | excessive play in the steering, both outer ends replaced, alignment checked and set to spec, road tested twelv | Truncation.dc.html:36 | DATA — example record value or example line text on a board |
| 58 | que and the remaining 1,400 characters | Truncation.dc.html:40 | DATA — example record value or example line text on a board |
| 59 | The title leads the joined string, so whatever survives always begins with it. A shop that writes essays loses | Truncation.dc.html:43 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 60 | The order matters more now that the narrative is the third segment. It is the longest of the three by a wide m | Truncation.dc.html:44 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 61 | Answered 2026-09-16 · now S3-R7 and S3-R7a | Truncation.dc.html:48 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 62 | Shorten until it fits, and never split a character | Truncation.dc.html:49 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 63 | What the build does today | Truncation.dc.html:52 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 64 | …biellette de direction côté passa | Truncation.dc.html:53 | DATA — example record value or example line text on a board |
| 65 | [half of é] | Truncation.dc.html:53 | DATA — example record value or example line text on a board |
| 66 | What the rule asks for | Truncation.dc.html:56 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 67 | Cutting a fixed number of | Truncation.dc.html:61 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 68 | Scale, to keep the case honest | Truncation.dc.html:65 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 69 | characters of title, max | Truncation.dc.html:67 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 70 | characters of description, max | Truncation.dc.html:68 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 71 | bytes, the cut on both routes; Intuit documents 4,095 | Truncation.dc.html:69 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 72 | descriptions are short phrases in practice | Truncation.dc.html:70 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 73 | New Line - before | canvas.json:10 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 74 | Before and after | canvas.json:108 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 75 | New Line - after | canvas.json:19 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 76 | What reaches QuickBooks | canvas.json:28 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 77 | Edit Line - before | canvas.json:37 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 78 | Edit Line - after | canvas.json:46 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 79 | Awkward inputs | canvas.json:55 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 80 | The long end | canvas.json:64 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 81 | Spec: Confluence 845348896, locked 2026-09-15. Two dialogs carry these fields: New Line, which has the canned- | canvas.json:74 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 82 | Staging renders the questions in Title Case. The spec and the branch both say sentence case, so the after boar | canvas.json:82 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
| 83 | LOCKED IN THE PRD, 2026-09-16. Title, description and the technician's narrative, joined by a spaced hyphen, n | canvas.json:98 | DESIGN NOTE — designer commentary or board heading on the canvas, not text the app shows |
