# Chris Ward — Report Suite permissions sheet + chat ruling: ANSWERS INGESTED (2026-08-01 round)

**Ingested:** 2026-08-03 · **Ingested by:** QA (this pass) · **Project:** Report Suite ·
**PO:** Chris Ward · **Epic:** SV-8582 · **Related defect:** SV-8780

**EXECUTED NOTHING.** No TestRail write, no case-source edit, no Jira post. TestRail and
Confluence were read **read-only**. Every proposed change is staged in
`staged-case-plan.md` awaiting the QA lead's authorisation (Standing Rule 6).

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| # | Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|---|
| 1 | **The filled question sheet** | Google Doc `1C0QKks_cXtFOaJPOnuOPQR5hTIhhfNO5xvJUngotENA` | Raised 2026-07-31; answers present at our read | 2026-08-03 | **CURRENT** — full text fetched, mirrored verbatim in `SOURCE-google-doc-export-2026-08-03.txt` |
| 2 | **Chris's chat message** | Quoted verbatim below, supplied by the QA lead | 2026-08-01 round (as relayed) | 2026-08-03 | **CURRENT** |
| 3 | **SBC spec** | Confluence `577634305` "SBC (Sales By Customer) Report" | lastModified **Jul 31, 2026**; change log's newest row **2026-07-31** | 2026-08-03 | **CURRENT** — read live via Confluence MCP; **S1-R2 has been corrected** (see §3) |
| 4 | **SV-8780 / SV-8598** | Jira, project SV | SV-8780 updated **2026-08-02**, status **Ready to Fix**; SV-8598 status **Open** | 2026-08-03 | **CURRENT** — read live via Atlassian MCP |
| 5 | **The 12 affected TestRail cases** | Live `get_case` on each C-id | Read live | 2026-08-03 | **CURRENT** |
| 6 | **Run 359** | TestRail run 359 "Reports Suite - Nebojsa/Viktoria (VIU Pending)" | `include_all=false`, **474 tests, all Untested** (0 passed / 0 failed / 0 blocked / 0 retest) | 2026-08-03 | **CURRENT** — verified live |
| 7 | **The build** | QA branch `project/reports-suite-bravo` | — | — | **STALE / ABSENT** — **no QA branch has ever been available to QA.** Nothing in this document is live-observed on a running build. All 474 cases remain VIU-Pending (Rules 12/22) |
| 8 | **PV / TU / WIP / IV specs** | Confluence pages per PROJECT-STATE §1 | Last captured **2026-07-31** (v4 / v5 / v6 / v3) | 2026-07-31 | **PARTIAL** — not re-fetched this pass. Shortfall: the Q2=A ruling below implies a spec edit on **PV S1-R4 / S1-N2**, **IV S1-R4** and the TU/WIP permission prerequisites, and we have **not** re-read those four pages today to see whether Chris has already made it. Flagged as an outstanding verification, not asserted either way |

**Nothing here claims completeness while source 7 is absent.**

---

## HOW THE DOCUMENT WAS OBTAINED (route, as asked)

| Route | Result |
|---|---|
| **(a) Google Drive MCP** `read_file_content` | **BLOCKED** — returned `MCP error -32003: MCP tool call requires approval`. Not used. If you want this route enabled for future Drive files, it needs a one-time approval. |
| **(b) `curl .../export?format=txt`** | ✅ **THIS IS THE ROUTE THAT WORKED.** HTTP 200, 2,613 bytes, UTF-8 with BOM. Verified real content (not an HTML sign-in page): it begins with the document's own title line and contains both questions, both option tables and both filled answer blanks. `format=docx` was not needed. |

The full export is committed verbatim as
**`SOURCE-google-doc-export-2026-08-03.txt`** so the answers can never be disputed against a
paraphrase.

**Honest limit:** the text export carries **no revision history and no comments**, so the exact
date/time Chris typed the two answers is **not established** — only that they are present in the
document as of our read on 2026-08-03, and that his chat message ("Both answers are A") corroborates
them. We have not invented a date for them.

---

## WHICH SHEET THIS IS — it is NOT the 5-question sheet

This matters, because "Both answers are A" could otherwise be misread onto the wrong questions.

The document is titled:

> **"Report Suite — Permissions Question Sheet for Chris Ward (PO)"**
> *"Date raised: 2026-07-31 · Raised by: Bilal Muzamil (QA) · Feature: Sales By Customer report
> (SV-8598) · Related defect: SV-8780"*

It holds **exactly TWO questions** — Q1 and Q2 — and nothing else. It is a **separate, narrower
permissions-only sheet**, not either of the two sheets in the repo:

| Sheet in the repo | Questions | Is this it? |
|---|---|---|
| `build/report-suite/PO-Questions-Chris-ReportSuite-2026-07-31.md` / `.xlsx` | 5 questions (SBR export columns · spec updates · Summary-download location position · logo rule · permission granularity) | ❌ **No.** Different title, different date line, five questions not two. |
| `build/report-suite/What-We-Need-From-Chris-Ward-2026-07-31.md` | 12 items | ❌ **No.** That is a needs list, not a question sheet with option tables. |

**But its Q2 IS one of the five.** The document's **Q2 is the same question, same polarity**, as
**Question 5** of the 5-question sheet:

| | Document Q2 | 5-question sheet Question 5 |
|---|---|---|
| Option A | *"Collapse all report access into a single Reports permission"* | *"One single reports permission for all six — if someone can see reports, they can see all six of these."* |
| Option B | *"Keep the separate per-area reports permissions as they are"* | *"Keep the existing per-area reports permissions…"* |

So the net effect on the 5-question sheet is: **Question 5 is now ANSWERED = A. Questions 1, 2, 3
and 4 of that sheet remain UNANSWERED.**

---

## THE TWO ANSWERS — "Both answers are A", established exactly

### Q1 — How should Sales By Customer (SBC) be permission-gated?

**The question, verbatim:**

> *"Q1 — How should Sales By Customer (SBC) be permission-gated?
> The build and the spec both give SBC its own dedicated permission. Your ruling is that reports
> open on ordinary reports access, with no report-specific permission. These conflict, so we need
> your call on record."*

**Option A, verbatim (with its own stated follow-on):**

> **A** — *"Gate SBC on ordinary reports access, like the other five reports"*
> Follow-on: *"Engineering drops the dedicated atom; you update spec S1-R2; confirm the atom
> doesn't linger in the Custom Roles matrix"*

**Chris's answer, verbatim from the document:** `☐ A   ☐ B   — ___A___________________________________________`

**ANSWER PRESENT: YES → A.**

**What it settles:** nothing new. This is the **third** time he has ruled the same way
(2026-07-28 *"these should be gated by normal reports access"*; 2026-07-31 Q4 *"A - the intention is
to not hide these from normal reports access. These were specced before CRP was built :)"*; now
again). The sheet existed only to capture the ruling **against the current source** so the build
change and the spec edit could be justified. **Consequence: CONFIRMS WHAT WE ALREADY HOLD** — no
observable expectation changes. See §1 for the important qualification his chat message adds.

---

### Q2 — Should the other five reports collapse into a single Reports permission?

**The question, verbatim:**

> *"Q2 — Should the other five reports collapse into a single Reports permission? (not blocking Q1)
> Today each of the other five reports cites a different existing per-area reports permission (e.g.
> Inventory Reports View → Parts Velocity & Inventory Value; timesheet-reports → Technician
> Utilization; WIP reports → Work In Progress). These are all "ordinary reports" permissions, so
> your stated intent is already met — but we never asked whether you want them merged into one
> Reports permission or left as separate per-area permissions."*

**The options, verbatim:**

> **A** — *"Collapse all report access into a single Reports permission"*
> **B** — *"Keep the separate per-area reports permissions as they are"*

**Chris's answer, verbatim from the document:** `☐ A   ☐ B   — _____A_________________________________________`

**ANSWER PRESENT: YES → A.**

**What it settles: this is the NEW ruling and it is the consequential one.** It is **not** a
confirmation of anything we hold — it **reverses** the model **8 live cases** were authored to.
Nine more of our cases were authored on the assumption that per-area reports permissions survive.
Full consequence in §2 and in `staged-case-plan.md`.

---

## HIS CHAT MESSAGE — verbatim, treated as an authoritative PO ruling (Rule 32)

> *"Of course my friend, will also surface this in standup shortly. I really appreciate your help,
> you being able to use your talented set of eyes on these goes a long way to making sure the
> product is what we want.*
>
> *Both answers are A, by the way.*
>
> *But it's important that (if it's already built), we just hide the new permissions from FE (they
> can exist and not do anything for now -- no wasted time) :)*
>
> *During the design/build of CRP originally -- it was intended to be modular, and we started
> thinking of ways that we could potentially add to it later on. SBC actually has several features
> that we dropped almost right before the squad assembled, and is a good example of some of the
> items that SHOULD be gated behind an additional permission set. That being said, the requirements
> should have dropped with the additional features dropping, I own that."*

It carries **three distinct rulings/statements**, taken one at a time below.

---

## §1 — THE FE-HIDE RULING, AND WHY IT IS *NOT* A RULE 24 SITUATION

**His words:** *"if it's already built, we just hide the new permissions from FE (they can exist and
not do anything for now -- no wasted time)"*

**What it changes:** not the *outcome*, the *fix route*. The Q1 option-A follow-on printed in the
sheet said *"Engineering drops the dedicated atom."* **He has now overruled his own sheet's
follow-on:** the atom does **not** have to be ripped out. If it is already built it may **stay in
the back end, hidden from the front end, doing nothing.** That is a cheaper fix and it is his call
to make.

**Rule 24 reasoning, done properly rather than pattern-matched.** Rule 24 says: front end blocks +
back end / API allows = **PASS**, no defect. Its inverse — front end exposes what the back end
blocks — is an **FE-exposure defect**. **This is neither**, and it is worth being precise about why:

| | Rule 24 pass case | Rule 24 inverse (defect) | **What Chris has ruled here** |
|---|---|---|---|
| Front end | **blocks** the action | **exposes** the action | **nothing to block** — the report opens normally; the *permission control itself* is hidden from the FE |
| Back end | **allows** it | **blocks** it | **does nothing at all** — the atom is inert; it gates nothing |
| Observable effect | a gap between the two surfaces | a gap between the two surfaces | **no gap, and no observable effect anywhere** |

So the correct classification is a **third thing: an INERT ARTEFACT.** A permission that is invisible
in the front end and enforces nothing in the back end has **no tester-facing behaviour at all**.
Two consequences follow, and they pull in opposite directions:

1. **It generates NO test case of its own.** There is nothing a manual tester could observe, pass or
   fail about an inert atom. It would be wrong to author a case for it, and wrong to call it a
   Rule 24 "PASS" — a PASS implies something was observed. (Recorded so that nobody later reads the
   absence of a case as a coverage gap — Standing Rule 46.)
2. **"Hidden from the FE" IS itself observable, and we currently have no case for it.** He has ruled
   that the new permission must **not appear in the front end**. A tester *can* check that: open the
   role/permission editor and confirm no "Sales By Customer" report permission is offered. That is a
   genuine, new, checkable assertion created by this ruling. **Proposed as ONE new case** in
   `staged-case-plan.md` (SBC-PERM-03, no C-id yet) — **not authored, awaiting your authorisation.**

### Effect on the three SBC permission cases — stated plainly

**Verified live in TestRail today** (`get_case`, read-only); all three are ours (`created_by 3`).

| Internal ID | C-id | Link | Verdict |
|---|---|---|---|
| **SBC-PERM-01** | **C30098** | https://shopview.testrail.io/index.php?/cases/view/30098 | **LEAVE THE TESTER-FACING EXPECTATION ALONE. Metadata + note edit only.** |
| **SBC-NAV-01** | **C30096** | https://shopview.testrail.io/index.php?/cases/view/30096 | **LEAVE THE TESTER-FACING EXPECTATION ALONE. Note edit only.** |
| **SBC-PERM-02** | **C30099** | https://shopview.testrail.io/index.php?/cases/view/30099 | **LEAVE THE TESTER-FACING EXPECTATION ALONE. Metadata + note edit only.** |

**Plainly: they do not need retiring, and they do not need rewording of what the tester checks.**
All three already assert exactly the behaviour Chris has ruled — C30098's expected result reads
*"Ordinary reports access alone is enough — this report does NOT need a permission of its own"*,
which is his ruling word for word. The FE-hide instruction changes **how engineering gets there**,
not **what the tester sees**. Nothing about the observable outcome moved.

**But two things on them are now stale, and both were caught by re-reading the whole case
(Standing Rule 41):**

1. **The `refs` on C30098 is factually out of date.** It reads *"SBC spec Story 1 S1-R2 — OVERRULED
   by Chris Ward answer 2026-07-31 Q4=A …; **S1-R2 + the build still use a dedicated permission**"*.
   The **spec half of that sentence is no longer true** — S1-R2 was corrected on 2026-07-31 (§3
   below, verified live). Leaving it would tell the next reader the spec still contradicts the case
   when it agrees with it. C30099's `refs` carries the same stale clause.
2. **The tester-facing note on all three is now under-informed.** It currently says *"If the build
   still demands a separate Sales By Customer permission, mark this test Failed and report it as the
   known pending change."* That is still correct advice, but it does not name **SV-8780** (now
   **Ready to Fix**) and it does not tell the tester the new fact that **the permission should not be
   visible in the front end either**. A tester who spots the permission listed in the role editor
   would currently have no idea that is reportable.

Both are wording/metadata edits, staged not executed.

---

## §2 — THE Q2=A CONSEQUENCE: the per-area reports permissions collapse

**This is the largest piece of work in this round, and it is the one nobody had scoped.**

Q2=A means: *one single Reports permission for all six reports.* Our suite currently asserts the
**opposite** in eight active cases and mentions the per-area permission in four more. Full sweep of
the case source, field-scoped (title / preconditions / steps / expected), **13 active hits** — the
counts and ids are in `staged-case-plan.md`. In summary:

| Group | Cases | Consequence |
|---|---|---|
| **Assert a named per-area permission as the gate** | PV-PERM-01 **C30325**, IV-PERM-01 **C30603**, IV-PERM-02 **C30604**, TU-NAV-07 **C30398**, WIP-PERM-01 **C30526**, WIP-PERM-02 **C30527** | **CASE EDIT NEEDED** — the permission *name* changes; the pass/fail outcome does not |
| **Whose entire premise Q2=A destroys** | PV-PERM-03 **C30327**, PV-API-04 **C30391** | **RETIRE-OR-RESCOPE CANDIDATE.** Both test the state *"has Reports access but NOT Inventory Reports View"*. Under a single Reports permission **that state cannot exist**, so there is nothing left to test |
| **Mention it only in a precondition** | PV-NAV-01 **C30322**, IV-NAV-01 **C30534**, TU-NAV-01 **C30392**, WIP-TAB-01 **C30451** | **CASE EDIT NEEDED** — precondition line only |
| **Already on the unified model** | SBC-PERM-01 **C30098** | **NO CHANGE** to the expectation (see §1) |

### The part I will NOT infer — and it is important

Q2=A has a **blast radius beyond this project**, and his chat sentence does not settle it:

- *"hide the **new** permissions from FE"* — the SBC atom **is** new. But **"Inventory Reports →
  View" is NOT new.** It exists in Custom Roles **today** and is used by reports **outside** the
  Report Suite. "Hide the new ones" therefore cannot be applied to it.
- So does Q2=A mean **(i)** the six Report Suite reports all read from one Reports permission while
  the pre-existing per-area permissions carry on serving their other consumers, or **(ii)** the
  per-area reports permissions are **merged/retired in Custom Roles**, which is a permission-matrix
  change with customer-role migration consequences and is **not the Report Suite squad's to make**?

Both readings fit his words. **Standing Rule 32(iii) says that when the newest source is ambiguous
we ASK the PO rather than pick a side**, so this is asked, not assumed, and no PV/IV/TU/WIP case is
staged for retirement on the strength of a reading. It is the first item Chris now owes.

There is also a **process consequence** worth stating: Q2=A almost certainly needs its own dev
ticket (it is a different change, in a different place, from SV-8780's single atom). **Not filed** —
that is a decision for you, and it should wait for the ambiguity above to be closed.

---

## §3 — "The requirements should have dropped with the features": the honest finding is ZERO retire candidates

**His words:** *"SBC actually has several features that we dropped almost right before the squad
assembled, and is a good example of some of the items that SHOULD be gated behind an additional
permission set. That being said, the requirements should have dropped with the additional features
dropping, I own that."*

**Two readings, and they lead to very different work:**

- **Reading (i) — "the requirements" = the DEDICATED-PERMISSION requirement.** The dedicated SBC
  permission was justified *by* those premium features; when they were cut, S1-R2 should have been
  cut with them. This reading fits the sentence's own logic (the preceding sentence is entirely
  about what *should* be gated behind an extra permission set) and it is **already fully resolved**
  by Q1=A plus the 2026-07-31 spec edit.
- **Reading (ii) — "the requirements" = every requirement describing the dropped features**, some
  of which might still linger in the SBC spec and therefore in our cases.

**We checked reading (ii) against the live spec and the live case source rather than speculating.**

**What the live SBC spec change log records as dropped** (Confluence 577634305, read 2026-08-03 —
verbatim, Standing Rule 25):

| Date | Verbatim change-log text (extract) | Still specified? |
|---|---|---|
| 2026-07-12 | *"Removed the customer comparison list and 'Show only comparing' (old Story 18) … Removed the side-by-side asset comparison entirely (old Story 19 — the modal, asset pins, the 'Compare N' chip, and its CSV/PDF exports); asset comparison is deferred to a future dedicated report."* | **No.** Story 19 is a clean placeholder: *"### Story 19: (removed — asset comparison deferred)"* with no requirements under it |
| 2026-07-15 | *"Removed the report's use of the application's global search bar … Retired Story 5 (global-search narrowing) to a placeholder."* | **No.** Story 5 is a clean placeholder: *"### Story 5: (removed — search consolidated into the Customer filter)"* |
| 2026-07-16 | *"Removed the 'All Time' date range (D1) and all All-Time-specific behavior."* | **No** |
| 2026-07-29 | *"removed Print"* | **No.** `Story 16: (removed — Print retired)` |

**And what our cases do with them:**

| Descoped feature | Any case still testing it? |
|---|---|
| Print | **No — already retired.** SBC-EXP-13's own record reads *"Retired 2026-07-28 (video P25 Print removed from Sales By Customer; delete_case authorized 2026-07-28)"* |
| "All Time" range | **No.** SBC-DATE-01 asserts the *absence*: *"There is no 'All Time' option."* That is legitimate descoped-negative coverage, not a stale case |
| Customer comparison / "Show only comparing" | **No case found** |
| Side-by-side asset comparison / asset pins / "Compare N" chip | **No case found** |
| Global search narrowing | **No case found** |

### **CONCLUSION: ZERO retire candidates. The list is empty, and that is the finding.**

I was asked to list descoped-requirement candidates with ids and verbatim spec text. **There are
none to list.** Every SBC feature his change log records as dropped has already been swept out of
both the spec body and our suite — the spec keeps only intentional placeholders and out-of-scope
notes, and our one affected case (Print) was retired on 2026-07-28. **I am not going to manufacture
a retire list to fill the section** (Standing Rule 12).

**Which leaves the real open question:** he says features dropped *"almost right before the squad
assembled"* and that requirements should have dropped with them. Our records account for four
descoping rounds during 2026-07 — but **we cannot know whether he means those, or an earlier set we
never saw.** So the ask is precise and small: **which features does he mean?** If they are the four
above, this item is already closed and he can be told so. If they are others, we will re-derive.
**Nothing is retired on either reading** (Standing Rules 6 and 12).

**One thing worth recording for later** (Standing Rule 46): he says those dropped features *"SHOULD
be gated behind an additional permission set."* So if any of them ever returns, **the dedicated
permission becomes justified again** — this ruling is scoped to the feature set as it stands today,
not a permanent architectural verdict. That is a note, not case work.

---

## §4 — EVERY ANSWER, CLASSIFIED

The document holds only two answers, so this table is short by nature; each is cross-checked against
what he has **already** said so we do not manufacture work (as instructed).

| # | Answer | Cross-check against what we already hold | **Consequence** |
|---|---|---|---|
| **Q1** | **A** — gate SBC on ordinary reports access | **Third statement of the same ruling** (2026-07-28 · 2026-07-31 Q4=A · now). Our cases were already authored to it on 2026-07-31 | **NO CHANGE to any tester-facing expectation.** Metadata/notes only: 2 stale `refs` clauses (C30098, C30099) + the tester note on all 3 (C30096/98/99), because SV-8780 is now Ready to Fix and the spec now agrees |
| **Q1-b** | The **FE-hide** instruction in chat | **NEW.** It overrules the sheet's own printed follow-on (*"Engineering drops the dedicated atom"*) | **CASE EDIT** (the tester note, as above) **+ ONE NEW CASE NEEDED** — that the permission is not offered in the front end (SBC-PERM-03, no C-id yet). Also a **scope change on SV-8780** (§5) |
| **Q2** | **A** — collapse into a single Reports permission | **NEW and CONTRARY.** = Question 5 of the 5-question sheet. 8 active cases assert the per-area model; 4 more mention it | **CASE EDITS (10) + 2 RETIRE-OR-RESCOPE CANDIDATES + STILL AMBIGUOUS** on blast radius (§2) |
| **Q3** | *"the requirements should have dropped with the features"* | Checked live against the spec change log and the case source | **NO CASE CHANGE. Zero retire candidates** (§3). **STILL AMBIGUOUS** — needs him to name the features |

**Nothing in this round touches** the SBR export columns, the Summary-download Location position, the
logo rule, the VIN chain, the 10,000-row cap, or the "Representative" rename. Those sit on the
5-question sheet (Q1–Q4) and his earlier answers, **untouched by this document.**

---

## §5 — SV-8780: UPDATE IT, DO NOT CLOSE IT

**Live state, read today** (Atlassian MCP, read-only):

| Field | Value |
|---|---|
| Key | **SV-8780** — *"SBC report gated by its own permission"* |
| Type | **Story Defect** (subtask) · Parent **SV-8598** *"[Reports Suite][B5] Sales By Customer (SBC) report + dedicated permission"* (status **Open**) · Epic **SV-8582** |
| **Status** | **Ready to Fix** — **not** "Open" as our own dev-ticket draft still records. Corrected here |
| Created / Updated | 2026-07-30 · **updated 2026-08-02** |
| Chris's comment, **2026-07-31**, verbatim | *"Surfaced in stand-up . the answer is: Yes. Spec updated accordingly. Great catch @Bilal Muzamil"* |

**RECOMMENDATION: UPDATE — do not close, do not re-scope away.**

- **The ticket is still valid.** Its finding (the build gates SBC on a dedicated atom while the
  product wants ordinary reports access) is unchanged, and Chris has now **agreed with it three
  times** and moved it to **Ready to Fix**.
- **What changed is the acceptable fix.** The ticket's Expected section asks engineering to drop the
  dedicated gate. Chris's chat ruling says: **if it is already built, don't rip it out — hide it from
  the front end and let it sit inert.** Engineering could otherwise do the expensive removal he
  explicitly said he does not want (*"no wasted time"*). **That is worth a comment, promptly.**
- **Do not widen it to Q2=A.** The single-Reports-permission collapse is a different change in a
  different place with a Custom-Roles blast radius (§2). Folding it into a subtask about one SBC atom
  would bury it. It needs its own ticket **after** the ambiguity is closed.
- **Do not close it.** The ruling did not invalidate the finding, and nothing has been observed on a
  build (no QA branch), so we cannot say the behaviour is already correct.

**The unposted comment draft is at
`build/dev-tickets-2026-07-31/SV-8780-followup-draft.md`. It has NOT been posted** — posting to Jira
is outward-facing and waits on your explicit go-ahead.

**One correction to our own records, for honesty:** `DEV-TICKET-SBC-permissions.md` states *"Status
on creation: Open"* (true) and its outstanding table row 3 asks for the S1-R2 spec correction — **that
row is now satisfied** (§3/§6). The ticket file itself is left unedited this pass; the corrections
live here and in the draft.

---

## §6 — THE SPEC-WATCH ITEM: unchanged, but a separate debt IS discharged and a new one opens

`build/report-suite/SPEC-WATCH-2026-07-28.md` tracks **12 video-driven items** with a **2026-08-04**
deadline; its 2026-07-31 re-diff left **7 open** (1b, 4, 6, 8, 9, 10, 11).

**Does anything here discharge or change it? Essentially no.**

- **The SBC permission gate was never a SPEC-WATCH item** — the watch covers items from the
  walkthrough **video**, and this came from the tech plan and his answers. So none of the 7 open
  items is touched, and **the 2026-08-04 deadline stands exactly as it was.** I have deliberately
  **not** edited SPEC-WATCH this pass.
- **A different, separately-tracked debt IS discharged.** The ask *"Chris to correct SBC spec
  S1-R2"* (`DEV-TICKET-SBC-permissions.md` outstanding row 3, and the matching register row) is
  **DONE — verified live today**, not taken on his word. S1-R2 now reads:

  > **S1-R2:** *"The report is gated by ordinary reports access, not by a report-specific
  > permission. Any user with standard reports access can open it; there is no dedicated Sales By
  > Customer View permission."*
  > — SBC spec, Confluence 577634305, change-log row **2026-07-31**, read live 2026-08-03

  His *"Spec updated accordingly"* was accurate. Worth saying plainly, because on **2026-07-29** he
  believed he had made the WIP identifier edit and had **not** — so his self-reports are checked, and
  **this one checks out.**
- **A NEW spec debt opens.** Q2=A means **PV S1-R4 / S1-N2**, **IV S1-R4** and the TU/WIP permission
  prerequisites now say the opposite of his newest ruling. **We have not re-read those four spec
  pages today** (source 8 = PARTIAL), so we are **not** asserting they still contradict him — only
  that they did as of the 2026-07-31 capture and that this must be re-diffed. **Recommendation: add
  this as a new SPEC-WATCH row** when the register/watch is next authorised for editing.

---

## FOR THE RECORD — the format is endorsed

The QA lead reports that **everyone in the meeting liked this way of sharing scenarios**, so the
question-sheet / Google-Doc format (plain layman wording, one question per decision, A/B options with
a blank answer, the spec and engineering citations shown beside them — Standing Rule 7) is
**endorsed by the team and should be reused** for future PO questions on every project.

---

## OUTSTANDING — what I need from you

Cross-project register: `build/OUTSTANDING-ITEMS-REGISTER.md` (Standing Rule 36).

### From you (QA lead) — authorisations. All five Rule-48 fields given.

| # | What I need | Which ruling froze it (verbatim) | When / what it answered | What it blocks (named cases) | Was it right? | What unblocks it |
|---|---|---|---|---|---|---|
| 1 | **Authorisation for the staged case plan** — 10 edits + 1 new case + a decision on 2 retire-or-rescope candidates | *"EXECUTE NOTHING: no TestRail writes, no case-source edits, no Jira posts."* | This pass, 2026-08-03, answering how far to take Chris's answers | Every row of `staged-case-plan.md`: C30096, C30098, C30099, C30322, C30325, C30327, C30391, C30392, C30398, C30451, C30526, C30527, C30534, C30603, C30604 + new SBC-PERM-03 | **Yes — and more so than usual.** The Q2=A blast radius is genuinely unresolved (§2); executing now would bake in a reading Chris has not confirmed | Your go-ahead **after** Chris answers ask A below — for the SBC note/refs edits you could authorise those separately today, since they do not depend on Q2 |
| 2 | **Go-ahead to post the SV-8780 comment** | The same instruction — *"DRAFT a comment but DO NOT POST IT … posting to Jira is outward-facing and needs the QA lead's explicit go-ahead"* | This pass, 2026-08-03 | Engineering may do the expensive atom removal Chris explicitly said he does not want (*"no wasted time"*). SV-8780 is **Ready to Fix**, so this is time-sensitive | **Yes** — but the cost of the delay is real here, unlike most held items | One word from you; the draft is written and needs no further work |
| 3 | **A ruling on the 2 retire-or-rescope candidates** — PV-PERM-03 **C30327**, PV-API-04 **C30391** | — (no prior ruling; this is new) | — | Both test a state Q2=A abolishes. Retiring them is a real coverage reduction if reading (ii) of Q2 turns out to be wrong | — | Chris's answer to ask A, then your call |

### From Chris Ward — what he now owes

| # | What we need | Why | What it blocks | Since |
|---|---|---|---|---|
| **A** | **How far does Q2=A reach?** Do the six reports simply read one Reports permission, or are the existing per-area reports permissions actually merged/retired in Custom Roles? | His words fit both readings; the second is a permission-matrix change affecting consumers outside this project (§2) | **10 case edits + 2 retire-or-rescope decisions** across PV, IV, TU, WIP; and whether a second dev ticket is needed | 2026-08-03 (new) |
| **B** | **Which SBC features dropped "right before the squad assembled"?** | He says the requirements should have dropped with them and owns that. Our check finds **zero** lingering requirements and **zero** stale cases (§3) — so this may already be closed, but only he can confirm which features he means | Nothing today. It stays open only so a descoped requirement cannot be sitting somewhere we have not looked | 2026-08-03 (new) |
| **C** | **The spec edit he owns for Q2=A** — PV S1-R4/S1-N2, IV S1-R4, and the TU/WIP permission prerequisites | Otherwise the next reader rebuilds the per-area model, exactly as happened with the SBC dedicated permission | Our PV/IV/TU/WIP permission cases stay out of step with his ruling | 2026-08-03 (new) |
| **D** | **Questions 1, 2, 3 and 4 of the 5-question sheet** (`PO-Questions-Chris-ReportSuite-2026-07-31.md`) — SBR export columns · will the descriptions be updated · Location position in the Summary downloads · the single logo rule | **Question 5 is now answered (=A); the other four are not.** This document did not touch them | ~15 cases across SBR, SBC, TU, PV stay hedged or contradictory | 2026-07-31 |
| **E** | **The 7 open SPEC-WATCH items** (1b, 4, 6, 8, 9, 10, 11) — deadline **2026-08-04**, i.e. tomorrow | Unchanged by this round (§6) | The spec text contradicts rulings our cases follow | 2026-07-28 |

**Cleared this pass:** *"Chris to correct SBC spec S1-R2"* — **DONE**, verified live in the spec body
and its change log, not taken on his word (§6).

### The single biggest gap, unchanged

**There is still no QA branch or environment for the Report Suite** (`project/reports-suite-bravo`),
so **all 474 cases have never been run against a real build** and nothing in this document is
live-observed. Everything about the permission model — including whether the dedicated atom exists at
all — is spec- and plan-derived (Standing Rules 12/22). We also need fresh login cookies when the
branch appears.
