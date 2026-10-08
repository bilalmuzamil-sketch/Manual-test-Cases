# Task instructions from the QA lead (8 Oct 2026) — convert build-verified cases to the new case structure
(Task instructions for this conversion only — NOT rules; do not record them as rules, standards or skills.)
QA lead decisions for this run (8 Oct 2026): set = the 229 build-verified WO Board / Tech View cases outside "Not runnable for now", created_by 3;
follow the new structure INCLUDING "Step N:" and {brace} names in the plain expected-result lines (Source, quotes, stamp, marker, author notes
byte-identical); start all 229 now.

## 1 · Target structure
1.1 Preconditions: (1) first line a bold clickable link "Setup (manual QA tester and Claude session)" to the case's setup doc; (2) a line break;
(3) heading "Preconditions" + bullet list, plain sentences, each saying what must exist then naming it in {braces} (never a bullet starting with a bare
"{X}:" label); first bullet = who you are signed in as and that everything is at one location; every record the test relies on with the state it
needs; anything genuinely needed gets its own bullet (second user, phone, minimum window width); every example value "(for example …)", never written
as if it exists; values the test depends on written as fixed values. REMOVE the "Needs:" line, any browser count or duration, "Build: …" lines and any
build version. (4) No Setup block stays in TestRail — it moves into the doc.
1.2 Steps: one simple action per step, in the order a person does it, from where the tester begins; no checks in Steps; a "don't" the test depends on
is its own step; same {brace} names; the build's own proven labels.
1.3 Expected: plain result lines each start "Step N:" / "Steps N and M:" pointing at the producing step; same {brace} names; if Steps are split or
renumbered update N; change nothing else about meaning. NEVER change (byte for byte): the Source paragraph, the "Exact quotes …" list, the "Last checked
against build …" stamp, the AUTOMATION marker, any author note.
1.4 Placeholders (all fields except Source and quotes): record name + hyphen + capital letter, even when only one; multi-word joined with hyphens;
next record of the same kind takes the next letter. [WO-1]→{Work-order-A}; [Line-1]→{Line-A}; [Part-A]→{Part-A}; [Tech-A]→{Technician-A};
[User-B]→{User-B}; [Loc-1]→{Location-A}. A lettered placeholder keeps its letter; a numbered one: 1→A, 2→B… Ids in the doc: {Work-order-A id},
{Line-A id}. Same name for the same thing everywhere in the case and its doc.

## 2 · Setup doc (one public Google Doc per case)
Folder "Setup for Claude session (test case setup docs)": https://drive.google.com/drive/folders/1zdj0d1RqpI1julHfiPPhTgDR_iUAKj3e
(id 1zdj0d1RqpI1julHfiPPhTgDR_iUAKj3e; public). Title: "Setup (manual QA tester and Claude session) - C<id> <case title>".
Create with the Drive connector create_file, contentMimeType text/html, parentId = folder id, written as HTML (h1, h2, ol, ul, a). Read it back with
read_file_content and check the numbering — never nest a list inside a numbered step (Google Docs restarts numbering); one field or action per step.
Corrections: Docs editor connector if available (same link); else a "v2" copy in the folder, repoint the case link, trash the old copy only after the
QA lead says so. Never a cookie, password, token or OTP in a doc.
Contents in order (shape of the reference doc): 1 title line and links (case C-id link, its ticket/story); 2 "Part 1 is for a manual QA tester.
Part 2 is for a Claude session…"; 3 "How to read this document"; 4 "What the setup creates" (same state as the Preconditions); 5 Part 1 "Setup for
manual QA tester" — the removed Setup block as short numbered steps, one action each, build labels, "(for example …)" values, last step "Check the
setup worked: …" with what to do if not; 6 Part 2 "Setup for Claude session": "Brace names used only in Part 2" (every id, defined before use) ·
what the test must prove (incl. whether judged on screen) · Environment · Access (cookies from the QA lead in /tmp only; access check; quick-login /
switch-user signs out other sessions; location id) · Setup calls (the calls used, each with a browser fallback to a Part 1 step) · Check the setup
worked · Running the test steps (one item per test step, numbered like the case's Steps, how to observe each result) · Evidence and cleanup · mark
UNVERIFIED anything not observed.

## 3 · Procedure per case
Read get_case → save C<id>-before.json; build fields and doc; create doc, read back; update_case writing only custom_preconds, custom_steps and the
plain expected list inside custom_expected — refuse if updated_on changed since the read; read back and check: Source/quotes/stamp/marker
byte-identical, no square-bracket placeholders, every result "Step N:" pointing right, doc link first line of Preconditions; display check
`bash build/testing-tools/ensure_bridge.sh` then `CID=<id> /opt/node22/bin/node build/invoice-design-selection/hs_repair_one.mjs` → "RESULT OK";
save C<id>-after.json, log one line per case, commit and push (path-scoped add, secret scan first).
Final question per case: could a manual QA tester run it from TestRail alone, and could a fresh Claude session prepare and run it from the doc alone?

## 4 · Reference
Case as approved: REFERENCE-C425784-final.json (this folder). Doc as approved:
https://docs.google.com/document/d/1MrEUYh5KA0JD1QkiaN28zYhJXip4j0egjm_1BBgX7L8/edit
Preconditions HTML: <p><strong><a href="<doc link>">Setup (manual QA tester and Claude session)</a></strong></p><p></p><p><strong>Preconditions</strong></p><ul><li>…</li></ul>
Steps: <ol><li>…</li></ol>. Expected: <p><strong>Expected results</strong></p><ul>…</ul> with "Step N:" lines; everything after it unchanged.

## 5 · Report: table — C-id + link · doc link · what was moved · source/quotes/marker unchanged · display check · not converted and why;
end with "OUTSTANDING — what I need from you".
