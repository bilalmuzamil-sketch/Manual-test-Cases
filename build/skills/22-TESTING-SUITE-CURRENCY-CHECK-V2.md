# Skill 22 — Testing Suite Currency Check V2 (and how it differs from V1)

**Status:** canonical · created 2026-10-14 · all projects, permanent · authority = **Standing Rule 125**
(`build/rules/RULES-61-96.md`). Worked example: Digital Inspection V2, 14 Oct 2026
(`build/digital-inspections-v2/currency-2026-10-14/`).

> **THE QA LEAD, 2026-10-14, VERBATIM:** *"So whatever we have done for Digital Inspection V2 including their currency
> check from sources until now, please save it as your learning, and going forward whenever we do the currency check
> ask me the questions whether we want to update the test cases or we want to just inform the QA who is owning this
> testing suite. And for the questions for anything create similar files as you have created for Milos. Lets call this
> process the Testing Suite Currency check V2. So if I ask you to do the currency check or to see if the tests are
> outdated against the Sources. Ask me if they needs to be checked against the currency check V2 or the currency check
> V1 (V1 is how you used to do the currency check before today). And If I ask you whts the difference between V1 and V2
> you must tell me that V2 was devised when it was decided that the feature Squad QA will own the test cases and
> updation of those test cases so if we select V2 the files will be created for the Gaps to share with the QA and files
> will be created for the PO if there is a question related to anything which is blocked on the PO. And for V1 explain
> how you used to do that before the intorudtion of V2"*

---

## 0 · The first thing to do — ASK, every time

Whenever the QA lead asks for a currency check, or asks whether a suite's tests are outdated against the sources, the
**first reply asks one question before any work starts:**

> "Shall I run this as **Currency Check V1** (we update the test cases ourselves) or **Currency Check V2** (we leave the
> test cases alone and prepare files for the QA who owns the suite, plus a question file for the PO if anything is
> waiting on them)?"

Give one line of context for the suite in front of you (for example: who last edited its cases, and whether a Slack or
Jira statement says a feature squad's QA owns it). Do not choose for him. Do not start editing cases before he answers.

## 1 · When he asks "what is the difference between V1 and V2?" — answer with this

**V2** was devised on 14 Oct 2026, when it was decided that the **feature squad's QA owns the test cases and keeps them
up to date** (DVI V2 team sync, Milos Vasic, 12 Oct 2026: "QA on the feature squad owns writing and updating test
cases" — https://shopview.slack.com/archives/C0C39T5MLMB/p1791807912692899). In V2 we do the same full check of every
source, but **we do not edit the test cases**. Instead we create:
- **files for the gaps, to share with the QA who owns the suite** (and the automation owner where cases are automated):
  only the test cases whose expected behaviour really changed, with before/now, plus the new tests the changes need;
- **files for the PO** when anything is blocked on a product decision: plain-language questions, colour-coded, with a
  column for the answer.

**V1** is how we did it before 14 Oct 2026: we checked every source in full, then **updated the suite ourselves in
TestRail** — every case rewritten in full to the current case standard (never only the changed ones), new cases added,
outdated ones moved to "Retire OR retest" on the QA lead's say-so, a setup document per case, every write read back,
the display checked, coverage proven against every source, the test runs kept in step, and PO questions sent at the
end (as a Google Doc). Others' cases and automated cases were edited only with his permission, and the automation owner
was told.

## 2 · What V1 and V2 share — the full source check (no less in V2)

Both versions read **every source in full** (Rule 119) and apply **latest decision wins** (Rule 32):
1. **The spec/PRD**, top to bottom: every section, Key Decisions, glossary, the page's own Change Log, version number
   and last-modified date; every footer and inline comment including resolved ones and replies. Diff every requirement
   code against our last copy by script: added / removed / reworded / same.
2. **Jira**: the epic and every child (stories, verify tasks, story defects, bugs), both `parent =` and `"Epic Link" =`,
   fully paged; every issue changed since our last copy, with description diffs and new comments verbatim. Remove email
   addresses before committing (the repo is public).
3. **Tech plan** versions, diffed; **design** driven to the Rule 124 gates (every file read, sweep, flows, text
   inventory, zero unclassified, changes since the last package); **handoff documents**; **Slack** channel of the
   feature (facts only: decisions, ownership, release dates, environments).
4. **Latest-wins table**: every behaviour discussed more than once, each statement with source and date, and which one
   wins. A developer statement without product sign-off never wins on its own — it becomes a PO question.
5. **Who has touched the suite since we last did**: live TestRail cases, `created_by` / `updated_by`, automation status,
   and each case's history (who changed what, when). Snapshot every case body before anything else (Rule 87).
6. **Every claim carries its source and a link** (Slack permalink, Confluence page, Jira key, TestRail case).

## 3 · V2 — what to produce (steps)

1. **Behaviour-first check of every case** (not only the cases that quote a changed rule): a case is listed only if it
   performs a scenario whose expected behaviour changed AND a tester following it today would either fail a correct
   build or pass a build that still works the old way. Wording-only changes, clarifications, outdated quotes in an
   otherwise-correct case, and changes the case does not exercise are left out.
2. **Independent adversarial check** of every listed case and every proposed new test: start from "this is only a
   wording change" and keep it only if the 22-Sep-style old text and the current text prove a tester would SEE
   something different. Search the WHOLE old spec, so a "new" behaviour that was already written elsewhere is caught.
   Remove unchanged lines, or mark the one needed for the flow "(unchanged)".
3. **When each rule changed**: from the spec's Change Log (named / matches the entry / not named → a date range,
   narrowed by Jira where a ticket already quotes the new text). Older page versions cannot be opened through the tools.
4. **New tests needed**: every behaviour that changed or was added that no case checks (as it is, or once updated),
   each tied to the change and date that make it necessary. Anything resting only on a developer or the tech plan goes
   to the PO file instead, never into a test.
5. **The QA file (Google Sheet)**, named `<Squad> Feature Squad – Test cases with changed behaviour – for <QA name>
   and <automation owner> (<date>)`, tabs:
   - **Read me** — a polite note to each person (why it reaches them, with the ownership source link), counts as
     formulas, links to spec / Slack / TestRail folder.
   - **Test cases to update** — Test case (link) · Test case title · Automated? · What changed · What a tester now sees
     differently · Where this comes from, and when it changed · Expected behaviour before · Expected behaviour now ·
     Steps before · Steps now · Note · Link to the spec. "Before" columns are copied word for word from the case
     (checked by script).
   - **New test cases needed** — Proposed new test case · Why it is needed (what changed) · Where this comes from, and
     when it changed · Before you start · Steps · What you should see · Related existing test case · Note.
   - **Need product decision first** — possible tests that must not be written until the PO answers.
6. **The PO file (Google Sheet)** — for questions of any kind, the same friendly format as the Milos file:
   named `<Squad> Feature Squad – Questions on <topic> – for <PO name> (<date>)`; a title row, a two-sentence greeting,
   a **colour guide** (yellow = please write your answer here, blue = the topic, grey = where we found it), then
   `# · Topic · Question for you · What we know today · Your answer · Where we found it`. Questions in plain words,
   split into (a)/(b)/(c); ticket numbers and spec codes only in the small grey last column.
7. **No TestRail write in V2.** No case edits, no new cases, no run changes.
8. Record everything in the project's `PROJECT-STATE.md` and the dated `currency-<date>/` folder; commit after every
   step.

## 4 · Building the Google Sheets — what works (learned 14 Oct 2026)

- **Use the Google Sheets connector**: create a blank spreadsheet with Drive (`contentMimeType:
  application/vnd.google-apps.spreadsheet`), add/rename tabs with `update_spreadsheet`, write values with
  `update_values` in batches of about 14 KB (one worker, files prepared by script), keep text as text with a leading
  apostrophe, links as `=HYPERLINK(...)`, counts as formulas, then format (header colour, wrap, widths, frozen header).
- **Verify every cell**: read all tabs back in ONE `get_spreadsheet` call with `includeGridData` and
  `formattedValue` only (large enough to be saved to a file), and compare by script against the expected values.
  DVI V2: 423 of 423 cells identical.
- **Do not** upload a large file inside one call: a base64 `.xlsx` copied by hand came out corrupted ("mhow" for
  "show"), and a 124 KB text upload was stopped by a safety check (never work around that). Small CSV uploads
  (under about 10 KB) are fine. Without the Sheets connector, tell the QA lead to turn it on.
- **Rename in place** with Drive `update_file` so the link stays the same.
- **Plain words before sharing**: remove internal labels (verdict names, our file names, rule numbers, "planned
  update"), and use headings a non-technical reader understands ("Related existing test case", "Before you start",
  "What you should see").

## 5 · Traps

- A "currency" pass that only greps rule codes misses cases that test a changed behaviour without quoting it; and it
  over-lists cases where only words changed. Always behaviour-first, then the adversarial check.
- Viktoria-style amendments: another person may already have brought some cases up to date; check them, list only
  what is still wrong.
- A decision made later in Jira than the spec text wins (latest wins), but say in the note that the spec does not carry
  it yet; a developer-only statement never wins.
- Confirm ownership from the source (Slack/Jira) and link it; never assume.
- Ask before re-running anything done recently (Rule 80) and never sign into a QA build from this lane.
