# For the build verification session: convert existing build-verified cases to the new case structure (8 Oct 2026)

**From the QA lead (8 Oct 2026):**
- The authoring session now writes every new case in a new structure.
- Convert the cases **you have already build-verified** into that same structure.
- **This handoff is about the STRUCTURE ONLY.**
  - It does not ask you to re-verify behaviour, change any verdict, or change what a case tests.
  - Where the move needs a fact you have already proven on the build (a label, a click-path, an id), use it. Do not go looking for new results.

These are task instructions from the QA lead for this conversion. They are not rules for your rule book: do not record, save or adopt anything here as a rule, standard or skill. Your own rules stay exactly as they are.

**Which cases:**
- Only cases you have build-verified that were created by our TestRail user (created_by 3).
- **Never cases created by anyone else** (for example Vladimir Tomovic, created_by 1). Ask the QA lead first, with the C-ids, links, creator and date.
- **When to start:** the QA lead decides. Start only when he says so, with the set he names.

---

## 1 · The target structure of one case

### 1.1 Preconditions field (TestRail "Preconditions"), in this order
1. **First line: a link to the case's setup doc**, with exactly this text: **Setup (manual QA tester and Claude session)**. It must be a clickable link, in bold.
2. **A line break.**
3. **The heading "Preconditions"**, then a bullet list that says clearly and completely what must be true before step 1:
   - **Each bullet is one plain sentence.** Say what must exist, then give it its name in **{braces}**. For example:
     - "An inventory part that has stock on hand. In this test it is called {Part-A} (for example ZZAUTOTEST-SV4802-01 with 5 in stock)."
     - Never start a bullet with a bare "{Part-A}:" label.
   - **The first bullet says who you are signed in as**, and that everything is at one location.
     For example: "You are signed in as an Owner or Admin. Everything below is at the same location."
   - **Every record the test relies on is listed with the state the test needs.** For example: showing "Needs Approval", quantity 1, with stock on hand.
   - **Anything genuinely needed gets its own plain bullet:** a second user, a phone, a minimum window width.
   - **Every example value is marked "(for example …)".** Never write a name, number or location as if it already exists in the app.
   - **Values the test depends on are written as fixed values** (for example "quantity 1", "shows \"Quoted\"").
   - **REMOVE:**
     - the "Needs:" line;
     - "1 desktop browser · about 10 minutes" (any browser count or duration);
     - "Build: the build named in the test run";
     - any build version.
4. **No "Setup" block stays in TestRail.** The setup moves into the doc (§2).

### 1.2 Steps field
- **One simple action per step**, in the order a person does it, starting from where the tester actually begins. For example: "Open {Work-order-A} and go to its Lines tab."
- **No checks in Steps.** Checks belong in Expected results.
- **A "don't" that the test depends on is its own step.** For example: "Wait a few seconds. Do not refresh the page."
- Use the same **{brace}** names as the Preconditions. Use the build's own labels, which you have already proven.

### 1.3 Expected results field
- **Plain expected results:**
  - Every line starts with **"Step N:"** (or "Steps N and M:"), pointing at the step that produces it.
  - Use the same {brace} names.
  - If you split or renumber the Steps, update the "Step N:" numbers to match. Change nothing else about the meaning.
- **NEVER CHANGE any of these. Leave them exactly as they are, byte for byte:**
  - the **Source** paragraph;
  - the **"Exact quotes from the source (for reproducibility)"** list;
  - your **"Last checked against build …"** stamp;
  - the **AUTOMATION:** marker;
  - any author note.

### 1.4 Placeholder renaming (all fields except Source and quotes)
- **Every placeholder is the record name, a hyphen and a capital letter, even when there is only one.** Multi-word names are joined with hyphens.
  - [WO-1] → {Work-order-A}
  - [Line-1] → {Line-A}
  - [Part-A] → {Part-A}, and a second part → {Part-B}
  - [Tech-A] → {Technician-A}
  - [User-B] → {User-B}
  - [Loc-1] → {Location-A}, and a second location → {Location-B}
- **Ids in the setup doc follow the same pattern:** {Work-order-A id}, {Line-A id}.
- **Consistency:** use the same name for the same thing everywhere in the case and in its doc.

---

## 2 · The setup doc (one public Google Doc per case)

**Where:** create it inside the Drive folder **"Setup for Claude session (test case setup docs)"**.
- Folder: https://drive.google.com/drive/folders/1zdj0d1RqpI1julHfiPPhTgDR_iUAKj3e
- Folder id: `1zdj0d1RqpI1julHfiPPhTgDR_iUAKj3e`
- The folder is already public, so every doc created in it is public too.

**Title:** `Setup (manual QA tester and Claude session) - C<id> <case title>`

**How:**
1. Create it with the Drive connector: `create_file` with `contentMimeType: "text/html"`, `parentId` = the folder id, and the doc written as HTML (`<h1>`, `<h2>`, `<ol>`, `<ul>`, `<a>`).
2. Read it back with `read_file_content` and check the numbering.
   - **Never nest a list inside a numbered step**, because Google Docs restarts the numbering after it. Write one field or action per numbered step instead.
3. To correct a doc later, use a Google Docs editor connector if you have one, so the link stays the same.
   - If you have none, create a corrected copy ("v2") in the same folder and repoint the case link.
   - Then trash the old copy, but only after the QA lead says so.

**Never put a cookie, password, token or OTP in a doc.** It is public.

**Contents, in this order** (copy the shape of the reference doc in §4):
1. **Title line and links:** the case (C-id link) and its ticket or story.
2. **One sentence:** "Part 1 is for a manual QA tester. Part 2 is for a Claude session…"
3. **"How to read this document":** names in {braces} stand for records you create or pick; "for example" values can be anything; write down the real value used for each brace name.
4. **"What the setup creates":** the same state as the case's Preconditions, phrased the same plain way.
5. **Part 1, "Setup for manual QA tester":**
   - The **Setup block you are removing from TestRail**, rewritten as short numbered steps, one action each, in the build's own labels.
   - Every example value is marked "(for example …)".
   - The last step is "Check the setup worked: …", saying what to look at and what to do if it does not match.
6. **Part 2, "Setup for Claude session":** everything a fresh Claude session needs to prepare and run this test without rediscovering anything, using **what you have already proven on the build**. It has these sections:
   - **"Brace names used only in Part 2":** every id the calls use ({Work-order-A id}, {Line-A id} …). Each is defined before it is used. Never an undefined {…} inside a path.
   - **What the test must prove,** including whether it must be judged on screen rather than from an API reply.
   - **Environment:** the app and API hosts (QA branch host shape: sv<number>.qa.shopview.com and sv<number>api.qa.shopview.com), the build marker to record, and the browser.
   - **Access:**
     - which cookies to ask the QA lead for, kept in /tmp only;
     - the access check;
     - the warning that quick-login and switch-user sign out other sessions;
     - the location id.
   - **Setup calls:** the exact calls you used, each with a browser fallback that points at a Part 1 step where a call is known to fail.
   - **Check the setup worked.**
   - **Running the test steps:** one item per test step, numbered exactly like the case's Steps. Say how to observe each result.
   - **Evidence and cleanup.**
   - **Mark UNVERIFIED** anything you have not observed yourself.

---

## 3 · Procedure per case
1. **Read the case** with `get_case` and save it to `build/<project>/structure-conversion-2026-10-08/C<id>-before.json`.
2. **Build the new fields and the doc** as in §1 and §2.
   - Moving text is fine. **Losing information a tester needs to run the case is not.** Every fact in the old Setup must land in doc Part 1 or Part 2.
3. **Create the doc** (§2) and read it back.
4. **Update the case** with `update_case`, writing **only** `custom_preconds`, `custom_steps` and the plain expected-result list inside `custom_expected`.
   - Before writing, re-read the case's `updated_on` and refuse to write if it changed since your read, because another session may have edited it.
5. **Read the case back** and check, by comparing before and after:
   - Source, exact quotes, build stamp and marker are byte-identical to the before copy.
   - There are no square-bracket placeholders left.
   - Every result starts "Step N:", and N points at the right step.
   - The doc link is the first line of Preconditions.
6. **Run the display check:**
   - `bash build/testing-tools/ensure_bridge.sh`
   - then `CID=<id> /opt/node22/bin/node build/invoice-design-selection/hs_repair_one.mjs`
   - The result must be "RESULT OK".
7. **Save** `C<id>-after.json`, log one line per case (C-id, doc link, check results), commit and push.
   - Path-scoped `git add`.
   - Run the secret scan before every commit.

**The final question for every case:** *"Could a manual QA tester run this case from TestRail alone, and could a fresh Claude session prepare and run it from the doc alone?"* If either answer is no, it is not finished.

---

## 4 · Reference (the worked example; the case itself was deleted after the QA lead's review)
- **The case as finally approved:** `build/skills/example-layout-2026-10-08/sv4802/C425784-final-before-delete.json` (Preconditions, Steps and Expected HTML).
- **Its doc, as approved:** https://docs.google.com/document/d/1MrEUYh5KA0JD1QkiaN28zYhJXip4j0egjm_1BBgX7L8/edit
- **Exact Preconditions HTML shape:**
  `<p><strong><a href="<doc link>">Setup (manual QA tester and Claude session)</a></strong></p><p></p><p><strong>Preconditions</strong></p><ul><li>…</li></ul>`
- **Exact Steps shape:** `<ol><li>…</li></ol>`.
- **Expected:** the existing `<p><strong>Expected results</strong></p><ul>…</ul>` list, with "Step N:" lines. Everything after it is unchanged.

## 5 · Report back
Give a table with these columns:
- C-id with its link;
- doc link;
- what was moved;
- source, quotes and marker unchanged (yes/no);
- display check;
- anything that could not be converted, and why.

End with "OUTSTANDING — what I need from you".

## Token-Discipline Charter (Rule 95) — embedded verbatim
# TOKEN DISCIPLINE CHARTER — mandatory in every session and every handoff (Standing Rule 95)

**Status:** canonical · created 2026-08-26 · all projects, permanent · authority = **Standing Rule 95**
(`build/rules/RULES-61-ONWARD.md` *(another session's rule file — facts only, never rules; Rule 118)*), which ties Rules 12, 50, 75, 76, 77, 78, 79, 80, 86, 88, 90.

> **THE QA LEAD, 2026-08-21, VERBATIM:** *"Also make sure that this session is smartest one about token
> usage as I do not want once again the weekly tokens to be burnt at the start of the week. Make it a
> general rule for all the sessions we create and the hand offs we create for new sessions"*

**WHY THIS EXISTS.** The weekly pool was nearly exhausted **in a single day**. The causes were
**poll-by-spawn status checks, one tool call per case, bulk reads of cases/specs/archives, autocompact
thrash and redundant re-verification** — **not one of which produced any quality.** The rules that
prevent each of those already existed (75, 76, 77, 78, 79, 88, 90) but were **scattered**, so nothing
guaranteed a new session or a newly-authored handoff actually carried them. This one page is what every
session inherits, and **every handoff embeds it verbatim.**

---

## THE TWELVE CLAUSES

1. **STRATEGY FIRST (79).** Before ANY task, recall or devise the **cheapest correct plan** — not the
   first plan. For anything large, **declare an INTENDED SPEND** (roughly: tokens, spawns, script runs)
   in your first reply. Then begin. One pass, then exit.

2. **NEVER BULK-READ — SCRIPT IT (88).** No case bodies, CSV exports, API dumps, spec bodies or large
   files go into your context. **Write a script, run it to a file, read a bounded SUMMARY.** Inspect
   with `wc -l` / `head -n 20` / `tail -n 20` / `grep -c` / `grep -n` / bounded `sed -n 'A,Bp'`. **Never
   read CLAUDE.md end-to-end** (it is an index) and **never read
   `build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md` or any 100 KB+ artefact whole** — grep it.

3. **THE READING RULE.** The startup reading list is **for startup**. Afterwards, consult **anything the
   task needs** — any rule, skill, project state, spec or ticket — always **targeted and bounded**.
   **Knowledge is never off-limits; only BULK reading is.** Not reading a rule you are about to apply is
   a worse failure than the tokens it would have cost.

4. **SPAWN DISCIPLINE (76 / 88).** An **ORCHESTRATOR** (no file tools) minimises spawns and **batches
   ruthlessly** — every spawn re-loads the whole project context, **observed at 200–380 k tokens each**.
   A **LANE SESSION** (direct tools) **does the work itself** and does **NOT** spawn for anything it can
   do directly. **Never spawn for a trivial check** — piggyback it (clause 7).

5. **NEVER POLL (75).** Long work runs as **ONE detached, idempotent, resumable script** with a
   **checkpoint file**, plus a **committer loop gated on a RUN-FLAG FILE**. **Never `pgrep -f
   <scriptname>`** — it matches itself and the loop never exits. Progress is **SELF-REPORTED IN COMMIT
   MESSAGES**. **Launch and exit**; verify later in one short pass. Polling for status is the single
   most expensive thing a session can do.

6. **BATCH WRITES.** One **scripted run with a per-op log** (operation · C-id · HTTP status ·
   verification result), **never one tool call per case**. The log is the evidence (Rule 50); *"200 OK"*
   alone is non-compliant.

7. **PIGGYBACK CHEAP CHECKS (78).** Fold a cheap verification into the **next substantive task**. Keep a
   **pending-cheap-checks list** and carry it forward. **Never spend a dedicated spawn on one.**

8. **NEVER RE-DO WORK (77 / 80).** Before any verification, VIU or ordered task, **STATE when it was
   last done** (date + build marker / spec version) and **ASK before re-running**. A check within the
   **last 3 builds or 3 source versions still COUNTS**, shown with its date and freshness badge (91).

9. **ANSWER IN TEXT** when a tool call is not needed. A reflexive tool call every turn is a trap: if you
   already know the answer, or the question is about plan/scope/reporting, **just answer**.

10. **THE BUDGET (90).** One shared weekly pool: **main/orchestrator 15 % · each lane 25 % · 10 %
    reserve**, adjustable by the QA lead. **Report cumulative spend WITH every piece of work.** At
    **50 % of your own budget**, compare spend against work completed; if spend is outpacing progress,
    **STOP AND REPORT** — never grind to zero. **Never consume the reserve** without the QA lead's
    say-so.

11. **THE WEEK-START GUARD.** The pool resets weekly and was once **nearly exhausted in ONE DAY**. **No
    lane may spend more than its weekly allocation in the first 48 hours of the week** without explicit
    approval. **A task that will exceed its declared intended spend STOPS and reports** rather than
    continuing.

12. **QUALITY IS NEVER THE THING CUT.** None of clauses 1–11 may be used to justify **sampling instead
    of full coverage (50)**, **inferring instead of observing (12)**, or **skipping a verification gate
    (84, 86)**. **The savings come from HOW the work is executed** — scripts, batching, no polling, no
    re-doing — **never from doing less of it, and never from doing it less rigorously.** If cheap and
    correct conflict, **correct wins and you report the cost.**

---

## THE THIRTY-SECOND SELF-CHECK — run it at session start and before any large task

| Ask | If the answer is wrong |
|---|---|
| Do I have the cheapest correct plan, and have I declared an intended spend? | Stop; plan first (1) |
| Am I about to pull a large file or many records into context? | Script it; read a summary (2) |
| Do I actually need to spawn, or can I do this myself / piggyback it? | Do it yourself (4, 7) |
| Am I about to check on a running job? | Don't — it self-reports in commits (5) |
| Has this verification already been done within 3 builds / 3 source versions? | Say the date and ask (8) |
| What is my cumulative spend, and am I past 50 % of my budget? | Compare against progress; report (10, 11) |
| Is any of this saving tokens by lowering rigour? | Forbidden — revert to the full method (12) |

**OUTSTANDING — what I need from you:** nothing outstanding for this charter; the budget percentages in
clause 10 are the QA lead's to change at any time.
