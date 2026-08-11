# Which text is genuinely newer — the PRD deletion, or the story requirement?

**Date:** 2026-08-11 · **Case at issue:** SCH-TOOL-03 =
**[C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** ·
*"Toolbar search highlights matching blocks and fades non-matching ones"*

**THE RULING BEING APPLIED.** QA lead, verbatim: **"The latest or newer wins here."** That is
Standing Rule 32.

---

## 🔴 THE VERDICT, FIRST

## **THE PRD DELETION IS NEWER, BY 10 DAYS 22 HOURS 7 MINUTES AND 57 SECONDS.**

| Side | The event that dates the requirement | Timestamp (UTC) |
|---|---|---|
| **PRD** | Confluence **version 24** — the version that **deleted** *"Non-matching blocks fade; matching blocks highlight"* from §6 | **2026-08-06T08:34:03.577Z** |
| **Story** | **SV-8686 created** — the moment the fade/highlight text entered the description. **It has not been edited since.** | **2026-07-27T10:26:06.606Z** |

**The gap is not marginal, so Rule 32's *"recency cannot be established"* branch does NOT apply and
this does not go to the PO as a tiebreak.** It is not minutes; it is nearly eleven days.

**And the verdict survives the most generous possible reading of the story's side.** Even if one
counted the *latest moment anyone touched the fade line in any way* — Ayesha Khan ticking its
acceptance-criterion checkbox at **2026-08-05T19:22:15.745Z** — that is **still 13 hours 11 minutes
BEFORE** the PRD deletion. **There is no reading of the evidence on which the story is newer.**

---

## 1. How each date was established — the traps, and how each was avoided

**Both of Standing Rule 31's dating traps are live in this question, and taking either surface
timestamp at face value gives the WRONG answer.** The naive comparison is:

> story `updated` = **2026-08-07T01:02:57Z**, which is **AFTER** PRD v24 at 2026-08-06T08:34:03Z
> ⇒ *"the story is newer, the requirement stands, keep the case."*

**That is the wrong answer, and it is exactly what Rules 31(b) and 31(c) exist to stop.**

| Trap | What it would have done here | How it was avoided |
|---|---|---|
| **(b)** an issue's `updated` moves for administrative edits | SV-8686's `updated` **is** later than the deletion. It moved because a QA engineer **ticked an acceptance-criteria checkbox** — **not one word of requirement text changed** | read the **full changelog** (14 entries, API `total=14`, paged to exhaustion) and diffed `fromString` → `toString` on **every** description edit |
| **(c)** a page version dates the PAGE, not the rule inside it | applied in the **mirror direction** here — the rule and its page moved *together* at v24, but that had to be **proven**, not assumed from an empty version comment | fetched **all 27 version bodies** and traced the sentence's own text through every one, then **diffed v23 against v24 line by line** |

---

## 2. The PRD side — the sentence traced through all 27 versions

**Every version body was fetched** (`GET /wiki/rest/api/content/713031682?expand=version,body.storage&version=N`,
`HTTP 200` for N = 1…27) and cached at `evidence/versions/v*.xml`. The tag-stripped text of each was
searched for the sentence itself. **No sampling** (Rule 50).

| Probe | Present in versions | First | Last |
|---|---|---|---|
| `Non-matching blocks fade; matching blocks highlight` | **7, 8, 9, 11, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23** | **v7** | **v23** |
| `Non-matching` anywhere on the page | same 14 versions | v7 | v23 |
| `Filters grid blocks by matching against` (the row that survives) | 7…23 **and 24, 25, 26, 27** | v7 | **v27** |
| `customer name, WO number, unit number, technician name, and line name` | 7…23 **and 24, 25, 26, 27** | v7 | **v27** |

**Versions 10, 12 and 14 are partial saves** (bodies of 6,005 / 6,830 / 4,628 plain characters against
a median of ~30,000) in which the whole section is absent, so their "absence" is a save artefact and
they are excluded from dating. Flagged automatically by the tool, not judged by eye.

**So the sentence lived from v7 to v23 and died at v24.**

- **introduced: v7, 2026-07-17T10:10:41.549Z** — version comment *"Add search specs, WO card anatomy,
  lead tech, Needs techs badge"*, which corroborates it;
- **deleted: v24, 2026-08-06T08:34:03.577Z**;
- **it has NOT come back** — absent from v24, v25, v26 **and v27**.

### 2a. The deletion proven by diff, not by version comment

**The version comment on v24 is EMPTY** — as it is on v17 through v26, ten consecutive blank comments,
which is how four versions of drift once went unnoticed on this page. So the change was established by
diffing the bodies:

```
--- v23
+++ v24
@@ -198,3 +198,3 @@
 Search
-Filters grid blocks by matching against customer name, WO number, unit number, technician name, and line name. Non-matching blocks fade; matching blocks highlight.
+Filters grid blocks by matching against customer name, WO number, unit number, technician name, and line name.
 Filter and Display

changed lines: 2
```

**v23 → v24 changed exactly one line on the whole page, and that line is this one.** Both versions
carry 334 content lines. **v24 was published for this deletion and nothing else.**

### 2b. Nothing later on the PRD side re-opened it

| Diff | Changed lines | What changed | Touches §6 Search? |
|---|---|---|---|
| v24 → v25 | 2 | §4.12 *"labor/total figures"* → *"labor/status figures"* | no |
| v25 → v26 | 2 | §4.12 *"a per-technician breakdown"* → *"a per-assigned technician breakdown"* | no |
| v26 → v27 | 13 | adds §5.3 Panel collapse, the Panel toggle toolbar row, two cross-references | **no — it ADDS a toolbar row above Search and leaves the Search row untouched** |

**The live §6 Search row, quoted from v27 verbatim:**

> *"Filters grid blocks by matching against customer name, WO number, unit number, technician name,
> and line name."*

---

## 3. The story side — the changelog, read in full

`GET /rest/api/3/issue/SV-8686?expand=changelog` → **HTTP 200**;
`GET /rest/api/3/issue/SV-8686/changelog` paged to exhaustion → **14 entries, API `total=14`, 0
remainder.**

**Timestamps: this Jira returns `-0500` offsets and every value below is converted to UTC.** A `-0500`
value read as UTC has already produced one false claim in this workspace, so both forms are printed in
the evidence.

**Of the 14 entries, exactly 6 touch `description`. Not one of the six changed a word of requirement
text.** The `fromString` of the **first** one already contains the fade sentence and the acceptance
criterion, so **the text has been there since the story was created** and Jira has no earlier record
of it because an initial description is not a changelog event.

| # | When (UTC) | Raw | Who | fade sentence | AC fade clause | What actually changed |
|---|---|---|---|---|---|---|
| 1 | 2026-08-04T20:23:36Z | `-0500 15:23:36` | Ayesha Khan | **unchanged-present** | **unchanged-present** | ticked AC 3 (*Today button*) |
| 2 | 2026-08-05T19:22:11Z | `-0500 14:22:11` | Ayesha Khan | **unchanged-present** | **unchanged-present** | ticked AC 4 (*15 technicians × 7 days*) |
| 3 | 2026-08-05T19:22:15Z | `-0500 14:22:15` | Ayesha Khan | **unchanged-present** | **unchanged-present** | **ticked AC 5 — the fade criterion itself** |
| 4 | 2026-08-05T19:22:33Z | `-0500 14:22:33` | Ayesha Khan | **unchanged-present** | **unchanged-present** | ticked AC 6 and AC 7 |
| 5 | 2026-08-07T01:02:37Z | `-0500 06 Aug 20:02:37` | Ayesha Khan | **unchanged-present** | **unchanged-present** | ticked AC 1 (*page loads / Day view*) |
| 6 | 2026-08-07T01:02:57Z | `-0500 06 Aug 20:02:57` | Ayesha Khan | **unchanged-present** | **unchanged-present** | **un**-ticked AC 1 again, 20 seconds later — **a net no-op** |

### 3a. Why the "edits" are checkbox ticks, and how that was proven rather than guessed

The changelog renders the description in wiki markup, where each of these edits looks like a line being
wrapped in `-…-`. **That is Jira's rendering of a completed task item, not an edit to the sentence.**
Proven from the live description's own structure: the Acceptance Criteria is an ADF **`taskList`**, and
its seven **`taskItem`** nodes currently read

```
1. [TODO] Given the schedule page loads, when the user has Schedule: View permission, …
2. [TODO] Given the user clicks Day/Week/Month segmented control, …
3. [DONE] Given the user clicks the Today button, …
4. [DONE] Given 15 technicians × 7 days with multiple shifts per cell, …
5. [DONE] Given the user types in the grid search, when the query matches a customer name,
          then matching blocks highlight and non-matching blocks fade.
6. [DONE] Given the viewport is below 960px, …
7. [DONE] Given a department group header, …
```

**Item 1 is `TODO`, which is edit 5 and edit 6 cancelling out exactly as the diff says.** And a scan of
the live description for `strike` marks returns **zero** — so nothing is struck through; the dashes
were a rendering of task state throughout.

**So all six "description edits" are a QA engineer recording her own testing progress.** They are not
the product owner restating a requirement, and they did not re-write one.

### 3b. Nothing else on the story side is newer

- **Comments: `GET /rest/api/3/issue/SV-8686/comment` → HTTP 200, `total: 0`.** There is no later
  comment re-asserting the behaviour.
- The other 8 changelog entries are a parent association, 2 status moves, a QA-Assignee set and 3
  issue links — **all administrative**, none touching text.
- Status is **TESTING QA**; `updated` **2026-08-07T01:02:57.009Z**. **Both are trap (b) in its purest
  form: the container moved, the rule inside it did not.**

---

## 4. Was anything later on either side missed? — the completeness check

| Question | Answer | How established |
|---|---|---|
| Did the sentence reappear in the PRD after v24? | **No** | absent from the tag-stripped text of v24, v25, v26, v27 |
| Is the PRD still at v27? | **Yes** — v27, `2026-08-07T15:01:20.801Z`, Branko Cicovic | version history re-read live, **27 records** |
| Was the story edited after v24 was published? | **Yes — twice, and both are checkbox ticks that cancel out** | changelog edits 5 and 6 |
| Was the fade text itself edited after v24? | **No — never edited at all, on any date** | present in the `fromString` of edit 1 and in the `toString` of all six |
| Any later comment on the story? | **No** | `total: 0` |
| Any later PO message re-asserting fade? | **None found**, and none is cited by any of our records | — |

---

## 5. The decision trail behind the PRD deletion — why it is a decision and not an accident

Established by the 2026-08-06 spec-v25 pass and unchanged; repeated here because it is what makes the
deletion an *authoritative editorial act* rather than a slip.

| Time (UTC) | Who | What |
|---|---|---|
| 2026-08-05 05:26 | Mudassir Qamar | files **SV-8874** *"Grid search hides non-matching shifts instead of fading them"*, quoting the PRD |
| 2026-08-06 08:15:35 | **Stefan Vukovic** | *"per design we show only shifts/events that are matching the search. **This is a gap between PRD and design.**"* |
| 2026-08-06 08:32:34 | **Milos Vasic** | *"All good on this one **updated the PRD**, i will close this ticket as absolute"* |
| 2026-08-06 08:32:42 | Milos Vasic | SV-8874 → **OBSOLETE / Done** |
| **2026-08-06 08:34:03.577** | **Branko Cicovic** | **Confluence v24 — the sentence is deleted, 81 seconds later** |

**Nobody went back and updated the story.** SV-8686 is the stale artefact — and under Rule 38 it is
another team's ticket to correct, not ours to edit. **No Jira write of any kind was made by this pass.**

---

## 6. What the verdict does and does not license

**It licenses removing the fade/highlight expectation from our case.** The latest authoritative source
no longer carries it.

**It does NOT license asserting the opposite.** The live PRD is **silent** on what happens to
non-matching blocks — *"Filters grid blocks by matching against…"* says nothing about fading or hiding.
Writing *"non-matching blocks disappear"* into the case would be taking the expectation **from the
build**, which **Standing Rule 57 forbids outright**, and **Rule 58** forbids settling that silence by
looking at the build. **So the removal behaviour stays an open question for the product owner** — it is
already drafted as **Q1** in `build/schedule/spec-v25-2026-08-06/QUESTIONS-FOR-BRANKO.md` and **has
still not been sent.**

---

## 7. Source currency (Standing Rule 31), and the Rule-59 re-read

| Source | Identifier | Version / last edited | Checked | Verdict |
|---|---|---|---|---|
| **Specification (a)** | Confluence page **713031682** "Schedule" | **version 27**, `2026-08-07T15:01:20.801Z`, Branko Cicovic | 2026-08-11, and **re-read immediately before the write** | **CURRENT** |
| **Story (b)** | Jira **SV-8686** | status **TESTING QA**, `updated` **2026-08-07T01:02:57.009Z** | 2026-08-11, and **re-read immediately before the write** | **CURRENT** |
| **Design (d)** | `build/schedule/design-2026-07-27/` | **no version, no date on the artefact** | 2026-08-11 | **PARTIAL** — a newer, **undated and editable** design share link is cited on SV-8915/8916/8917 and we do not hold it. **Recorded, not relied on.** Stefan's *"per design we show only matching"* is a statement about a design we have never been given. |
| **Build** | — | — | — | **NOT CONSULTED, deliberately.** This is a documents question; no build access was used and nothing here is a claim about what the product does. |

**The in-body "Version" field of the Confluence page still reads `1.0` and has since version 1** —
Rule 31 trap (a), confirmed again. **Only the Confluence version integer is a currency marker for this
page.**

---

## 8. Honest limits

1. **The design was not consulted, because we do not hold the current one.** If Sasha Grosman's newer
   design artefact is canonical it may source the *removal* behaviour outright — which would not change
   this verdict (the fade expectation goes either way) but **would** answer the open question in §6.
   **Which design artefact is canonical is already outstanding with the QA lead.**
2. **"Nothing later re-asserted the requirement" is a measurement of the PRD's 27 versions, the story's
   full changelog and its comments.** It is not proof that no document anywhere says otherwise.
3. **No build was opened.** Nothing in this document is a statement about current product behaviour.
