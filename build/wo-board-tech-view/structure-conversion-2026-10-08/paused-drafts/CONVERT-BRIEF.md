# Brief for a conversion helper (WO Board / Tech View, 8 Oct 2026)
Repo /home/user/Manual-test-Cases. You convert a batch of build-verified test cases into the QA lead's new case structure and create one public
Google Doc per case. You do NOT write to TestRail, do NOT open the test site, do NOT commit. The coordinator writes TestRail after checking.

READ FIRST (short): build/wo-board-tech-view/structure-conversion-2026-10-08/HANDOVER-STRUCTURE-CONVERSION-2026-10-08.md (the task instructions),
build/wo-board-tech-view/structure-conversion-2026-10-08/PART2-FACTS.md (the ONLY facts allowed in Part 2), the reference case
REFERENCE-C425784-final.json in that folder, and the reference doc (Drive read_file_content fileId 1MrEUYh5KA0JD1QkiaN28zYhJXip4j0egjm_1BBgX7L8).

LANE LIMIT: this is a STRUCTURE conversion only. Do not re-verify behaviour, change any verdict, change what a case tests, or add any new
label/route/click-path. Every label and route you use must already be in the case text or in PART2-FACTS.md / OBSERVED-UI-LABELS-sv10043.md.
Information is moved, never lost: every fact of the old Setup block lands in doc Part 1 (and Part 2 where useful).

## Per case (cases are in build/wo-board-tech-view/structure-conversion-2026-10-08/C<id>-before.json — print ONE case at a time with a script)
1. Old Preconditions has a "Preconditions" block (with a "Needs:" line etc.) and a "Setup" block. Build:
   - custom_preconds = `<p><strong><a href="DOCLINK">Setup (manual QA tester and Claude session)</a></strong></p><p></p><p><strong>Preconditions</strong></p><ul><li>…</li></ul>`
     First bullet: "You are signed in as … . Everything below is at the same location." Keep the exact role/permission facts, window width, second
     user/browser etc. as their own bullets. Remove "Needs:", browser counts, durations, "Build: …" and any build version. No Setup block.
   - custom_steps = `<ol><li>…</li></ol>`: one action per step, no checks (a "Read …"/"Look at …" step that only observes stays as an action like
     "Look at {X}'s column." — the check itself belongs in Expected). Keep the step numbering the Expected refers to unless a step must be split;
     if you split/renumber, update every "Step N" in the expected head.
   - expected_head = the case's existing `<p><strong>Expected results</strong></p><ul>…</ul>` (the part BEFORE `<p><strong>What you should see today`
     or `<p><strong>Source`) with each line starting "Step N:" / "Steps N and M:" and the {brace} names applied. Change nothing else about meaning.
     NEVER include or touch anything after that list (What you should see today, Source, quotes, stamp, marker) — the coordinator splices it back
     byte for byte.
   - Placeholders: rename every [X] / example record into the §1.4 form ({Work-order-A}, {Line-A}, {Technician-A}, {User-B}, {Customer-A},
     {Location-A}, {Part-A}, {Part-sale-A}, {Role-A} …). Pattern = Capitalised word, then lower-case words joined by hyphens, then -LETTER. Example
     names from the old text become "(for example …)" beside the brace name where it is defined. Same name for the same thing everywhere.
     If the Expected names a specific value without "e.g." (e.g. a technician the source names), keep that value as the "(for example …)" of the
     brace AND say in the bullet "use exactly this name".
2. Doc HTML (h1/h2/p/ol/ul/li/a only, NO list nested inside a numbered step): title line, links (case link
   https://shopview.testrail.io/index.php?/cases/view/<id>; story/ticket from the Source paragraph, e.g. SV-10043 https://shopview.atlassian.net/browse/SV-10043),
   the "Part 1 is for a manual QA tester. Part 2 is for a Claude session…" sentence, "How to read this document", "What the setup creates",
   "Part 1. Setup for manual QA tester" (the old Setup block as short numbered steps, one action each, last = "Check the setup worked: …"),
   "Part 2. Setup for Claude session" with sections: Brace names used only in Part 2 · What the test must prove (and that it is judged on screen) ·
   Environment · Access · Setup calls (browser steps = "Drive Part 1 step N in the browser"; proven reads only from PART2-FACTS.md) · Check the setup
   worked · Running the test steps (one numbered item per test step, same numbers, how to observe each) · Evidence and cleanup. Mark UNVERIFIED
   anything not in the case text or PART2-FACTS.md.
   Create: mcp__Google_Drive__create_file with title "Setup (manual QA tester and Claude session) - C<id> <case title>", contentMimeType "text/html",
   parentId "1zdj0d1RqpI1julHfiPPhTgDR_iUAKj3e", textContent = the HTML. DOCLINK = https://docs.google.com/document/d/<id>/edit .
   Read back with mcp__Google_Drive__read_file_content and confirm Part 1 numbering runs 1..N without restarting. If it restarts, create a fixed
   "v2" doc and use its link (note the old doc id in notes; do NOT trash anything).
3. Append the case to your output file (a JSON object keyed by case id string):
   {"doc_id","doc_link","custom_preconds","custom_steps","expected_head","moved":"one line: what moved where","notes":"anything not converted and why"}
   Save after EVERY case (it is your checkpoint). Then run `python3 /tmp/cln/conv_check.py <your output file>` every ~10 cases and fix what it flags.
Never put cookies/passwords/tokens in a doc. Never touch Vladimir's cases (none are in your batch).
Final reply (short): output path, count done, doc count, any case not converted and why.
