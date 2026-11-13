---
name: test-case-creation
description: Write manual test cases for a ShopView feature from its sources (PRD, Jira epic and stories, design, technical plan, product-owner answers) so that a manual tester can run each case from the case alone, and so that every expected result is traceable to a quoted source sentence. Use when asked to create, extend or update test cases for a feature, to bring a suite up to date after a source changed, or to prepare cases for TestRail.
---

# Test case creation

This skill turns a feature's sources into manual test cases that:

- a manual QA tester can set up, run and judge **from the case alone**;
- never take their expected behaviour from the running build;
- carry the **exact source sentence** behind every expected result, so anyone can trace and re-check it;
- carry a single automation line that says whether the case can be automated.

Read this file first, then the reference files when you reach the step that needs them:

| File | Read it when |
|---|---|
| `references/case-format.md` | Writing or rewriting any case: the exact layout, with a worked example |
| `references/checks-before-writing.md` | Before any write to TestRail, and before sending any question to the product owner |
| `references/pitfalls.md` | Before starting a new suite, a design pass or an update after a source change |

---

## 1. Principles

1. **Expected behaviour comes from the documents, never from the build.** Sources are the PRD/spec, the epic and its
   stories, the product owner's written answers, the design (including its design library), the technical plan and any
   other written statement shared for the feature. From the build you take only two things: the on-screen labels and
   navigation, and the pass/fail verdict. If the build differs from a source, the case keeps the source's expectation and
   the difference is reported as a defect.
2. **Quote, don't paraphrase.** Every expected result is backed by the source's own sentence, copied word for word and
   cited (document, id, version, date, section). The quote changes only when the source changes. Never "tidy" a quote
   or edit it towards what the build does: a case rewritten to match the thing it tests can never fail.
3. **Runnable by a person.** A tester who has never seen the feature must be able to reach the preconditions, do every
   step in the product's UI and decide pass/fail from what they see. No API calls, database, developer tools or code. If
   part of a rule can only be checked outside the UI, say so in the automation line (see §5) or leave that part out of
   the manual case.
4. **Nothing is skipped.** Read every source in full, however long. Read large sources in chunks, but read all of them.
   Every review states what was read (file, size, line ranges).
5. **The design is a source for how things look**, and it is driven, not skimmed: every board, page, state, menu,
   dialog, tooltip and hover. Where the PRD is silent and the design shows something, the case follows the design. Where
   the PRD and design disagree, follow the PRD's own precedence statement if it has one (for example "where a frame and
   this text disagree, the text wins"); otherwise raise a question.
6. **Silence is not permission to change.** For an upgrade of an existing feature, behaviour the new spec does not
   mention is expected to stay as it was. Cover those "must not change" behaviours too.
7. **Every case has a source.** A case with no supporting sentence is either (a) unsupported and removed, (b) missing
   its citation, which you then find and add, or (c) waiting on an open question and held. Tell these apart before
   deleting anything.

---

## 2. Workflow

### Step 1 — Collect and date every source

- Get the PRD (note its version and last-modified date), every ticket under the epic and its stories, the design (note
  its published version), the technical plan, and any product-owner answer sheet.
- Write a short source list: identifier, version or last-updated, date you read it. A source you could not fully read
  is marked PARTIAL with exactly what is missing.
- Sweep **every** ticket under the epic, not only the ones handed to you. Each ticket gets a verdict: new cases / covered
  by existing cases / no case needed (with reason) / question asked.

### Step 2 — Build the requirement map

- One row per requirement (and one row per assertion when a requirement asserts two things), with its verbatim text.
- Give each row exactly one verdict: **covered by case(s)** (quote the requirement beside the case text) · **new case** ·
  **not independently testable** (say why) · **held on a question** (name the question).
- A requirement that spans several screens (list, detail page, mobile card, print, export, email, API) is expanded into
  one row per screen.
- Check both directions: every requirement has a case, and every case has a requirement.

### Step 3 — Drive the design

- Open every board and page, click every clickable, hover every hover target, and open every menu and dialog.
- Make a text inventory: every piece of on-screen text in the design is either in a case or classified (example data /
  covered / out of scope / conflicts with spec / case needed). Leave nothing unclassified.
- Make a visual inventory: every screen and state has a "Design: … looks as in the design" case with the board picture
  attached. Check icons, order of fields and columns, sizes, spacing, colours, widths at 1440 and 1536 px, no overlap and
  no truncation, wherever the design or PRD states them.
- List every menu, dialog, tooltip, toast and empty state by hand (title, rows, options, buttons, in order) and compare
  each row with the PRD. Compare labels letter for letter, including capital letters.
- Use stress data wherever typed text shows (chip, list row, group row, table row, print, export): a long name with spaces,
  a long name with no spaces, and special characters. State what the tester must see (wraps in its own row or ends in "...",
  never over the next row, every column still visible).
- For every state change (open/close a group, Expand/Collapse all, sort, filter, more rows loading), add a before-and-after
  check that headings and columns keep their place. Compare the design's own pictures of each state with each other first.
- Apply design-library "always/never" rules (for example where a tooltip sits, maximum widths, empty-cell dashes) even
  when a single frame breaks them.
- Record every design-vs-PRD difference in a register and close each one: settled by a precedence rule, settled by a
  source, or a sent question with a held "design version" case.

### Step 4 — Write the cases

Follow `references/case-format.md` exactly. In short:

- **Title**: plain words, what the tester will see, at most 80 characters, no semicolons. Design cases start with
  `Design: `.
- **Preconditions**: short plain setup bullets ("Sign in as …", "Use a …", "Have a …"), only what the steps and results
  need, each record created fresh for this case.
- **Steps**: numbered, one UI action per step, in the product's own labels.
- **Expected Result**: for each step a `Step N:` line followed by bullets, one observable fact per bullet.
- Below a blank line: the exact quotes with their `From:` lines, then the "References from Design" block if the design
  is used, then the automation line last.

Rules for splitting and independence:

- **Split** a long case into 2–5 cases when each part checks a different behaviour and can start from its own
  preconditions. **Do not split** when a later step checks an earlier one's effect (save then reload, before/after,
  two browser tabs).
- **No case depends on another case** or on another case's leftover data. A record the case changes is created fresh
  for it. Shared settings are stated as preconditions. No case mentions another case.
- **A tester cannot set it up → it does not go into the manual suite.** Examples: states only reachable by forcing a
  server failure, data volumes no one can create by hand, records that no screen can produce. Keep these in a separate
  "not testable by hand, with reason" list.
- **Never invent an identifier.** Example values (work order numbers, part names) are written as "(for example …)" and
  never presented as if they already exist.
- **No closed lists without a reason.** "The columns are exactly A, B, C" breaks the day the spec adds one. Use
  "includes X in position Y" unless the closed list is itself the requirement.
- **Every "does not appear / nothing happens" result needs a control** the tester can see (a second record that must
  appear, a count that must change, a message that must show), so the check cannot pass just because the action never
  ran.
- **Write what is seen**, never "looks native", "as described", "the same style" or "as in the design" on its own.

### Step 5 — Questions for the product owner (only when truly needed)

Before a question is sent, run the eight checks in `references/checks-before-writing.md` §2. Most apparent gaps are
already settled by a precedence statement, another source, the design library, or are untestable. Only real
disagreements between sources, and risky gaps (money, data loss, security), become questions. Questions are short,
plain, give lettered options with a recommended one, and are added to the suite's existing question sheet.

### Step 6 — Check, then write

- Run the checks in `references/checks-before-writing.md` §1 and fix everything they find.
- Read a random sample of cases in full **and** every "does not appear" result. Green checks are not proof that a person
  can run a case.
- Re-check that every source is still at the version you used. If anything moved, update the cases first.
- Writes to TestRail only with the go-ahead of whoever owns the suite. Log every write (operation, case id, HTTP status,
  read-back result) and read every case back after writing it.
- Add new and changed cases to the suite's test run in the same pass. **Only ever add to a run, never shrink it**: sending
  a partial case list to a run removes the missing tests and their results.
- Stamp the suite's main folder with: "Test cases are current as of MM/DD/YYYY. Before you start testing, check whether
  the PRD, design or any other source has changed since then; if it has, update the test cases first."

### Step 7 — When a source changes later

- Diff the new version against the one the cases were built on, the same day.
- Check **every** case against the change: CONFIRMED / CHANGE / RETIRE / NEW.
- A case that needs any change is rewritten **top to bottom** (title, preconditions, steps, results, quotes and `From:`
  lines, design references, automation line, refs, folder), never only the line that prompted it. Record per case which
  parts changed and which were confirmed.
- Cases that only need their version stamp moved are still read in full, and a script confirms that every one of their
  quotes is word for word in the new version.

---

## 3. Folders in TestRail

Each suite has one main folder with one subfolder per story or area, plus these where needed:

| Subfolder | What goes there |
|---|---|
| Design — how it looks | Every design case |
| Waiting on <owner>'s answers | Cases held on an unanswered question (design cases stay in the design folder) |
| Blocked on <release name> | Cases that need another feature or release first, one folder per release |
| Run on Production After Release | Cases that compare "before" and "after" on production |
| API | API-only cases |

Held and blocked cases stay out of the execution run until they are released.

---

## 4. Refs field

`refs` holds the ticket(s) and the spec anchor, for example `SV-12345 (S3-R2)`. Ticket **and** spec, never the ticket
alone. No commas inside an anchor, and fewer than 250 characters in total.

---

## 5. The automation line

Every case ends with exactly one automation line. It is the last line of Expected Result, written exactly as below, so
that it can be found by script:

| Line | Meaning |
|---|---|
| `AUTOMATION: READY` | Steps confirmed runnable on a build; can be automated as written |
| `AUTOMATION: Not available on Build to test Yet - Last checked M/D/YYYY` | Written from the sources; not yet checked against a build. Not counted as ready to automate |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | Runnable, and expected to fail today because of the open ticket named. Only used when a live ticket backs it |
| `AUTOMATION: HOLD - <plain reason>` | Something genuinely cannot be obtained (a physical device, an outside account, a forced server failure). Waiting on a question also uses HOLD with the question number |

A tool need (developer tools, reading a PDF or CSV, seeded data, window sizes, theme toggles) never justifies HOLD; those
are all automatable. Arithmetic check for any report: READY + EXPECT FAIL = total − HOLD − not-yet-checked.

---

## 6. Numbers and reports

Wherever a case checks a number (a total, count, percentage, ratio, chart point), it must make a wrong number impossible
to pass:

- Seed known inputs and state the exact expected value, with the arithmetic shown.
- Check the same figure on every screen that shows it (parity).
- Give each hazard its own case: ratios pooled (sum ÷ sum, never an average of percentages); zero or empty denominators
  (shown as the empty token, not a misleading 0); credits, voids and reversals; de-duplicated counts; splits that add
  back up; rounding; date boundaries and time zones; scope (location, filters); freshness right after a change.
- Headline = chart points = table totals.

---

## 7. What this skill does not do

- It does not take expected behaviour from the build, and it does not "fix" a case so that it passes on the build.
- It does not create defect tickets; a build difference is reported for a person to decide.
- It does not edit or delete cases someone else wrote, or cases flagged as automated, without that owner's agreement.
- It does not write to TestRail without the suite owner's go-ahead.
