# Chris Ward's returned answer sheet — ingested 2026-08-10

**Project: Report Suite · Product Owner: Chris Ward · This is an INGEST AND ANALYSIS pass.**
**Nothing was written to TestRail. No Jira ticket was created. No spec was edited. The application was
never opened.**

Sheet: `Questions-for-Chris-Ward_Report-Suite_2026-08-06.xlsx`, Drive id `1ail4jjCw…`, returned
**2026-08-10T15:01:38Z**. Provenance and completeness proof in `SOURCE-CURRENCY.md`.

---

## The headline

| | |
|---|---:|
| Questions asked | **13** |
| **Answered** | **6** |
| **Left blank** | **7** — every item on tab 3 |
| Answers that settle something | **5** |
| Answers that are partly or wholly ambiguous | **1** (tab 2 item 1) plus one ambiguous caveat (tab 2 item 4) |
| Answers that contradict an **earlier answer of his** | **0** |
| Answers that contradict a **current specification** | **1** (tab 2 item 4 — SBR paper orientation) |

**The seven blanks are not a refusal.** Tab 3 asked him to edit his own descriptions rather than decide
anything, and **all six specifications were edited on 2026-08-06 with a change-log row citing "QA review
workbook (2026-08-06)"** — our sheet. So the work was done in the documents and the tick-boxes were
simply not filled in. **Two of the seven are only partly done** (§3 below), and that is a real
outstanding item, not a quibble.

**Governing discipline (Rule 58).** Every answer below carries an explicit
**UNAMBIGUOUS** or **AMBIGUOUS** classification. Where an answer is ambiguous it has been **left
ambiguous and sent back to him** — it has **not** been resolved by looking at the build, and the build
was not consulted at all. The 2026-08-05 expected-behaviour damage across 748 cases entered through an
answer-ingest pass exactly like this one.

**Rule 56 note, applied throughout.** Four of the five settling answers **agree** with what the
specifications already say. Those are cited as **confirmations** and must **not** be dressed up as
divergences — manufacturing a conflict that does not exist is itself a defect. **Exactly one answer
diverges from a current spec** and is the only one that earns a divergence sentence.

---

## 1 · Tab 1 — the one question that was holding tests

### Item 1.1 — The Location column, all six reports

**What we asked.** *"Is this right — anyone who can see more than one location gets the Location column,
on by default, and can switch it on or off themselves?"*
Options: **A** = yes, it depends on what someone is **allowed to see**, not on what they have picked, and
they can switch it whenever they like · **B** = no, it should appear and disappear on its own depending
on how many locations are picked, and the person should not be able to switch it · **C** = something else.

**His answer, verbatim:**

```
A
```

**Classification: UNAMBIGUOUS. Verdict: SETTLES IT — and it CONFIRMS what the documents already said.**

This is the access-gate + user-toggleable model. It agrees with the decision note now carried in all six
specifications; Technician Utilization v7 §3 states it verbatim:

> *"A per-row Location column is available to any user with access to more than one location. Such a
> user sees it by default and can toggle it on or off from the column selector, **regardless of how many
> locations are currently selected**; a user with access to only one location never sees it."*

**Because spec and answer agree, this is a CONFIRMATION under Rule 56 and the affected cases must NOT
carry a divergence sentence.**

**What it releases — seven cases, all currently `AUTOMATION: HOLD`:**

| Case | C-id | Link | Report | Handed off? |
|---|---|---|---|---|
| WIP-COL-02 | C30467 | https://shopview.testrail.io/index.php?/cases/view/30467 | Work In Progress | **YES** |
| WIP-PERS-05 | C43551 | https://shopview.testrail.io/index.php?/cases/view/43551 | Work In Progress | **YES** |
| SBC-LOC-04 | C38912 | https://shopview.testrail.io/index.php?/cases/view/38912 | Sales By Customer | **YES** |
| IV-COL-01 | C30551 | https://shopview.testrail.io/index.php?/cases/view/30551 | Inventory Value | no |
| IV-COL-04 | C30554 | https://shopview.testrail.io/index.php?/cases/view/30554 | Inventory Value | no |
| IV-EXP-02 | C30588 | https://shopview.testrail.io/index.php?/cases/view/30588 | Inventory Value | no |
| IV-LOC-06 | C38917 | https://shopview.testrail.io/index.php?/cases/view/38917 | Inventory Value | no |

**⚠️ Removing the hold is NOT enough on three of them.** Two cases still *assert the model his answer
overturns*, and one groups the column wrongly:

- **C38912** is titled *"The Location column shows only with more than one location; Multiple on totals"*
  and its first expected line reads *"With more than one location **in scope** a Location column is
  shown."* That is the **scope** model — option B. Under his answer the trigger is **access**, not scope.
  **Title and body both need rewriting**, not just an unhold.
- **C38917** likewise opens *"With more than one location **involved**, a Location column is shown."*
- **C30467** lists Location among *"every other column … available in the column-selection control"* —
  i.e. among the **off-by-default** columns. Under his answer it is **on by default** for a
  multi-location-access user.

All three are staged in `PROPOSED-CHANGES.md`. **Nothing has been written.**

---

## 2 · Tab 2 — the five decisions

### Item 2.1 — Which heading each report sits under in the Reports menu

**What we asked.** *"Is that arrangement the one you want — three under Performance, two under Parts, and
Sales By Customer under Sales?"* Options: **A** = yes, leave them and add the heading to each description
· **B** = no, all six under one heading · **C** = something else.

**His answer, verbatim (line breaks as he typed them):**

```
C -- sales doesn't exist
(to my knowledge);
parts is new with this
FS;

This seems like a
hallucination.

Picture is true on this,
however the goal is
additive/not interruptive
(as in, it doesn't matter
the order, as long as
they don't interfere
with the same spots
people click on before
this is released) Put
them below current
unless in the new section
(parts).
```

**Classification: PART UNAMBIGUOUS, PART AMBIGUOUS. Verdict: SETTLES a general rule; does NOT settle
the question we asked.**

**The unambiguous half — a genuine new product rule, quotable and actionable:**

> *"the goal is additive/not interruptive … it doesn't matter the order, as long as they don't interfere
> with the same spots people click on before this is released. Put them below current unless in the new
> section (parts)."*

That is: **new reports go BELOW the existing links in whatever group they join; existing click targets
must not move; the exception is the new Parts section.** It is corroborated in two places we read live
and did not have to interpret:
- **Parts Velocity v6 S1-R1:** *"**This feature creates the Parts section** — the application has no
  Parts reports today, so the 'Parts' grouping does not exist in the Reports navigation yet and must be
  added."* This confirms his *"parts is new with this FS"* exactly.
- **Sales By Representative v18 §3:** *"**Placement: additive at the bottom of the 'Performance' group**
  in the Reports left sidebar (S1-R2)."* His instruction and this sentence say the same thing.

**The ambiguous half — three things I am NOT resolving:**
1. *"sales doesn't exist (to my knowledge)"* — he disputes that a **Sales** heading exists. Our question
   asserted it as fact, from an earlier live observation.
2. *"This seems like a hallucination."* — he is telling us the arrangement we described looks invented.
3. *"Picture is true on this"* — **the referent of "Picture" cannot be determined from the sheet.** No
   picture was attached to the question. It may mean a screenshot he has, or the general picture we
   painted. It reads as conceding the arrangement is real, one sentence after calling it a
   hallucination.

**And he never answered the question actually asked** — whether the present arrangement is the one he
wants, and he did not name a heading for Sales By Customer.

**This is precisely the shape of ambiguity Rule 58 forbids settling from the build.** I could open the
Reports menu and see which heading Sales By Customer sits under — and that would be the exact mistake
that cost us 748 cases. **It goes back to him** (`FOLLOW-UP-QUESTIONS.md` Q1).

---

#### ⚠️ PROVENANCE INVESTIGATION, 2026-08-10 — item 3 above is resolved, and PART OF OUR QUESTION WAS FABRICATED

The QA lead supplied the picture Chris meant: a screenshot of the live Reports page. It shows **no
`SALES` heading** — "Sales" is a *report name* inside **PERFORMANCE**, which holds eight entries
including Sales By Customer; **PARTS** holds three. All six specs were re-fetched live on 2026-08-10 and
every claim in our question was traced. **The item was four claims, not one:**

| Claim we put to Chris | Verdict |
|---|---|
| *"three under Performance, two under Parts"* | **THE SPECS SAY IT** — SBR `S1-R2`, TU `S1-R1`, WIP `S1-R1` → Performance (3); PV `S1-R1`, IV `S1-R1` → Parts (2). Not invented. |
| *"Sales By Customer sits on its own under SALES"* | **OUR OWN LIVE CAPTURE** — `viu-2026-08-03/evidence/nav-map.json`, QA branch `sv8582`, build `v3.4.1-0ed4433`. Real, but a **build** fact, quoted five days stale with no environment named. |
| *"None of the six written descriptions says which heading a report belongs under"* | **FABRICATED — our defect.** Five of six say it. |
| *"the test records the heading and does not judge it"* | **FALSE — our defect.** C30096 hard-asserts the Performance group and the ordering. |

**Rule 31 trap (c) ruled out:** the Performance/Parts wording was already in our own spec mirrors at
`2902f366^`, the commit before the question sheet. The claim was **false when written**, not overtaken
by a later spec edit.

**Root cause.** A correct, narrow, single-report question (`chris-answers-2026-08-05/OUTSTANDING.md`
item **T3-7**) was widened on 6 August into a claim about all six descriptions, and the premise needed
to justify the widening was written without reading the five descriptions that contradict it — *while
those five had been fetched live that same day*. **Rule 12** (never assert what you did not observe),
**Rule 20** (a claim with no source is not authentic), **Rule 25** (quote the source you rely on) and
**Rule 55** (verify every factual claim before it goes to a PO) **were all available and none was run
on that sentence.** It is the only unsourced factual claim in the sheet, and it is the one Chris
checked. **He was right that something was wrong; he was wrong about which thing.**

**Affected case: SBC-NAV-01 = C30096** —
https://shopview.testrail.io/index.php?/cases/view/30096. **The line above claiming it is
`AUTOMATION: READY`, not on hold, and "repaired to assert only what the specification asserts" is
itself wrong on all three counts.** The local mirror shows `AUTOMATION: HOLD - waiting on an answer
from the product owner`, and expected-result item 1 asserts *"listed in the Performance group … BELOW
the pre-existing entries"* — an assertion the SBC specification does **not** support (its `refs` cite
the PRD video of 2026-07-30). Live TestRail was **not readable this pass** (no credentials), so the
live marker is **unverified** (Rule 12).

**The assertion is correct** — it matches the QA lead's screenshot — so **no expectation changes.**
The only gap is provenance: C30096 is the sole nav case with no specification anchor.
**Recommendation, STAGED NOT WRITTEN (Rule 6):** on Chris's answer **A**, add the SBC `S1-R1` anchor to
`refs` and lift the hold. One `update_case`. **Nothing written this pass.**

### Item 2.2 — Sales By Customer: an invoice the person is not allowed to open

**What we asked.** Options: **A** = no link at all, the invoice number is plain text · **B** = a link
they can click, landing on the "not allowed in" page · **C** = something else.

**His answer, verbatim:**

```
A
```

**Classification: UNAMBIGUOUS. Verdict: SETTLES IT — and CONFIRMS the spec's own requirement.**

Sales By Customer **v16 S9-R1a**, read live today:

> *"The invoice number is rendered as a link **only when the user has permission to open the target** it
> links to (the work order or parts sale); a user without that permission sees the invoice number as
> **plain text**."*

**Confirmation, not divergence — no divergence sentence.**

**⚠️ But the spec still says it both ways, and his answer tells us which side loses.** Still live in
v16:
- **S9-R1** *"Each invoice number on a detail row is a clickable link."* (unqualified)
- **S9-N2** *"If the user lacks permission to open the destination invoice, the destination page shows
  the application's standard access-denied state; the user can press back to return to the report."*

**Under answer A, S9-N2 describes a journey that cannot happen** — there is no link to press. That is a
documentation defect for Chris to tidy, recorded in `FOLLOW-UP-QUESTIONS.md` Q4 and
`DEFECTS-FOR-PERMISSION.md` §1.

**Affected cases:**

| Case | C-id | Link | Effect |
|---|---|---|---|
| SBC-PERM-04 | C30100 | https://shopview.testrail.io/index.php?/cases/view/30100 | **Premise voided — needs re-derivation, see below** |
| SBC-LINK-05 | C43558 | https://shopview.testrail.io/index.php?/cases/view/43558 | PO half answered; **stays held** on a second sign-in |
| SBR-LINK-06 | C43559 | https://shopview.testrail.io/index.php?/cases/view/43559 | Sales By Representative — lower priority |

**C30100 is the one to look at carefully.** It is titled *"Opening an invoice you lack permission for
shows access-denied; back works"* and expects *"The destination page shows the application's standard
access-denied state."* **Under answer A that user has no link to open, so the case as written tests a
journey the product should not offer.** It cannot simply come off hold — it needs re-deriving against
S9-R1a. Staged, not written.

**C43558 does NOT come off hold.** Its hold names two blockers: *"waiting on one answer from the product
owner … **and it needs a second sign-in that cannot open work orders or part sales**."* He answered the
first. The second is unchanged.

### Item 2.3 — Sales By Representative: the link rule never reached the numbered requirements

**His answer, verbatim:**

```
A
```

= *"Yes, please update them so they say the same as Sales By Customer."*

**Classification: UNAMBIGUOUS. Verdict: SETTLES IT — the spec edit is now owed by Chris.**

Confirmed still outstanding in **SBR v18** read live today: §2 carries the permission rule, but the
numbered requirements do not —

> **S12-R1:** *"Each invoice number on a detail row is a clickable link."*
> **S12-R3:** *"Each customer name on a detail row is a clickable link that navigates the current tab to
> the customer's record."*

**Affected: SBR-LINK-06 = C43559.** Sales By Representative — **not handed off, lower priority.**

### Item 2.4 — Sales By Representative: A4 landscape or portrait?

**His answer, verbatim:**

```
A

caveat:
It must all fit on screen
```

= *"A4 landscape, the same as Sales By Customer — and please correct the Sales By Representative
description to say landscape."*

**Classification: the ORIENTATION is UNAMBIGUOUS; the CAVEAT is AMBIGUOUS.**
**Verdict: SETTLES the orientation — and this is the ONE answer that CONTRADICTS a current
specification.**

**SBR v18 S14-R3, read live today, still says portrait:**

> *"Both PDFs are server-rendered and delivered as a file attachment, in **A4 portrait**, edge-to-edge…"*

**Rule 32 — the most recent authoritative source wins.** His answer is dated **2026-08-10**; SBR v18 was
last edited **2026-08-07**. **His answer is newer, so landscape prevails**, and under **Rule 56 the
affected case MUST disclose the divergence** — naming his answer, its date and this file, saying the
description still says portrait, and saying we are following his latest word. Draft wording is in
`PROPOSED-CHANGES.md`.

**The caveat is a separate matter and I am not interpreting it.** *"It must all fit on screen"* is
applied to a **printable download**, where "screen" has no obvious meaning. It plausibly means the
sixteen columns must fit the page width without truncation — but that is a guess, and a guess written
into an expected result is exactly what Rule 58 forbids. **It goes back to him**
(`FOLLOW-UP-QUESTIONS.md` Q2).

**Affected: SBR-EXP-01 = C30278** —
https://shopview.testrail.io/index.php?/cases/view/30278 — asserts *"The PDF is A4 portrait"* word for
word and is currently **`AUTOMATION: READY`**, i.e. queued for automation asserting the wrong thing.
Sales By Representative — **not handed off**, but this one is worth doing early anyway because it is
**READY and wrong**, and automating it would bake in the error.

### Item 2.5 — "Representative" on the screen and on the customer's card

**His answer, verbatim:**

```
A
```

= *"Yes — use the full word everywhere it appears, not only in the downloaded files."*

**Classification: UNAMBIGUOUS. Verdict: SETTLES IT — and it EXTENDS his earlier answer rather than
contradicting it.**

**Checked against his own earlier answers before calling it (Rule 44).** On **2026-08-05** he answered
item 3.0 (the download column heading) with `A)`, and **left item 9.0 — "Representative written out in
full, everywhere" — BLANK**. So today is his **first** answer on the screen and customer-card question.
**This is not a contradiction and must not be written up as one.**

**The spec has not caught up:** SBR v18 uses **"Sales Rep" 27 times**, and the only quoted
`"Representative"` is a change-log line about the **download** heading. Spec edit owed by Chris.

**Affected — two cases come off `AUTOMATION: HOLD`:**

| Case | C-id | Link |
|---|---|---|
| SBR-WO-01 | C30310 | https://shopview.testrail.io/index.php?/cases/view/30310 |
| SBR-WO-06 | C30315 | https://shopview.testrail.io/index.php?/cases/view/30315 |

Sales By Representative — **not handed off, lower priority.**

---

## 3 · Tab 3 — all seven blank, but six of the edits were made anyway

**No cell on tab 3 was filled in.** These asked him to tidy his own descriptions, not to decide anything.
Every one of the six specifications gained a **2026-08-06** change-log row citing **"QA review workbook
(2026-08-06)"**. So the honest reading is: **the request was actioned in the documents; the tick-boxes
were left empty.**

**I checked each of the seven against the live page body — not against the change-log claim, and not via
search (see `SOURCE-CURRENCY.md` §2 on why CQL probing is unsafe).**

| # | Item | Document state today | Verdict |
|---|---|---|---|
| 1 | Parts Velocity — *"is not user-toggleable"* leftover | **Gone** from PV v6; survives only inside the change-log entry describing its removal | **DONE** |
| 2 | Work In Progress — *"the user does not toggle it"* leftover | WIP v10 §3, S4-R3, S7-R13 all state the access-gated toggleable rule | **DONE** |
| 3 | Inventory Value — leftover | **⚠️ INCOMPLETE** | **PARTLY DONE** |
| 4 | Sales By Customer — milder leftover | SBC v16 §2, §3, §4 and S4-R12 all consistent | **DONE** |
| 5 | Sales By Representative — milder leftover | **⚠️ INCOMPLETE** | **PARTLY DONE** |
| 6 | Technician Utilization — milder leftover, two places | TU v7 §2, §3, §4, S9-R9, S10-R4 all consistent | **DONE** |
| 7 | Export size cap into PV, TU and WIP | Present in all three: **TU v7 S7-R14**, **WIP v10 S9-R11**, **PV v6** — each with the verbatim message | **DONE** |

**The two that are incomplete, quoted:**

**Inventory Value v5** — S7-R6 was corrected to the access gate, but two other places still state the
old scope rule:
> **S3-R1:** *"**When the report is scoped to more than one location**, a Location column (S7-R6) is
> inserted between Vendor and Qty on Hand; **it is hidden for a single-location scope**."*
> **§4 Terminology:** *"A per-row column, **shown only when the current scope spans more than one
> location**…"*

**Sales By Representative v18** — S21-R7 was corrected, but two other places were not:
> **§3 Key Decisions:** *"A Location column is **shown only when the current view spans more than one
> location**; when the view is scoped to a single location the column is hidden…"*
> **§4 Terminology:** *"…displayed **only when the current view spans more than one location** (hidden
> for a single-location view)."*

**So two of the six descriptions still state the Location rule both ways.** Neither is a handed-off
report, so neither blocks the priority work — but both are live contradictions inside a ratified
decision, and both are listed for Chris in `FOLLOW-UP-QUESTIONS.md` Q3.

---

## 4 · Cross-check against his earlier answers (Rule 32 / Rule 44)

Checked today's six answers against `chris-answers-2026-08-05/ANSWERS-INGESTED.md` and
`chris-consolidated-2026-08-04/`, **before** writing any verdict.

| Today's answer | Earlier position | Relationship |
|---|---|---|
| Location column = access gate (A) | 2026-08-04 QA-review decision, already in all six specs | **Confirms** |
| SBC invoice link = plain text (A) | 2026-08-05 suite-wide link-permission rule | **Confirms** |
| SBR numbered reqs to match SBC (A) | same 2026-08-05 rule, partially applied | **Confirms and completes** |
| SBR downloads = landscape (A) | no earlier answer; **the spec says portrait** | **Contradicts the SPEC, not an answer** |
| "Representative" everywhere (A) | 2026-08-05 item 9.0 **left blank**; item 3.0 answered `A)` for files only | **Extends — first answer on the screen question** |
| Reports menu placement (C) | 2026-08-05 items 6.0 and 7.0 **both left blank** | **First answer; still incomplete** |

**Result: ZERO contradictions between today's answers and any earlier answer of his.** The single
divergence is answer-versus-specification (item 2.4), and only that one case gets a Rule-56 divergence
sentence.

---

## 5 · What this changes, in one place

**Cases his answers release outright: 4** — C30467, C43551 (Work In Progress), C38912 (Sales By
Customer, after rewrite), C30100 (Sales By Customer, after re-derivation) — plus **4 Inventory Value**
cases (C30551, C30554, C30588, C38917) and **2 Sales By Representative** cases (C30310, C30315) that are
not handed off.

**Cases his answers do NOT release: C43558**, which needs a second sign-in as well.

**Cases his answers make WRONG as written: C30278** (asserts portrait, `AUTOMATION: READY`).

**Everything above is staged in `PROPOSED-CHANGES.md` and awaits the QA lead's go-ahead. Not one
TestRail field has been written.**
