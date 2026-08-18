# 06 · DEFECT-PREP — build a defect ticket that cannot be challenged, then stop at the button

> **🔴 READ [`00-COMMON-CORE.md`](00-COMMON-CORE.md) FIRST** — especially **§11.1, the active creation
> hold**.

---

## 🛑 READ THIS BEFORE ANYTHING ELSE

**NOTHING IS FILED. THE JIRA CREATION HOLD IS ACTIVE.**

QA lead, 2026-08-10, verbatim: ***"Do not create anything until my next order."***
And on 2026-08-12, in the same breath as raising the evidence bar: ***"However for now the Jira ticket
creation is still on hold."***

**This skill prepares. It does not file.** The prepared pack sits in the repository, logged in the
outstanding register, waiting for his order.

**⏳ A session reading this weeks later must NOT treat the hold as standing law — check whether it has
been lifted.** When it lifts, **Standing Rule 62 resumes as the governing rule**: permission is still
required, **per ask**, and an earlier batch approval never covers a later ticket.

**🔴 AND WHEN IT LIFTS, RESUME ONE TICKET AT A TIME (Standing Rule 73, 2026-08-17).** The QA lead asked
that this be recorded **because previously-created tickets *"did bite us."*** The moment he explicitly
asks to resume: **create ONE ticket → he verifies it → ONLY THEN create the next.** **Never a batch,
never the second before the first is confirmed.** One-at-a-time makes each ticket separately answerable
— which is the whole reason a weak ticket in a batch discredited the good ones beside it.

---

## PURPOSE, IN PLAIN ENGLISH

**Turn a finding into a ticket that an engineering manager cannot throw back — and if it cannot be
made that strong, say so and hold it.**

**Why this is a skill of its own, and not a paragraph inside another one:** the QA lead asked for it in
these words — ***"they did badly bite me and my job is on threat due to that."*** A defect ticket is
**immediately visible to the whole engineering organisation** and **cannot be cleanly undone**: a
withdrawn ticket stays on the record for good. **So a weak ticket does not cost us a correction — it
costs him credibility, and credibility is what lets every other finding we raise be believed.**

**The asymmetry is the whole argument:** a finding held back for one more day of evidence **costs
nothing and is fully recoverable**; a challengeable ticket **cannot be recovered at all**, and it
discredits the ninety good ones filed beside it.

---

## TRIGGER PHRASES

> *"Prepare a ticket for [finding]"* · *"write this up as a defect"* · *"is this filable?"* ·
> *"draft the bug report"* · *"the defect pack for [project]"* ·
> *"re-check the prepared defects against the bar"*

---

## KICKOFF PROMPT

```
Run DEFECT-PREP for [FINDING], on [PROJECT].

What I observed: [one sentence]
Where the expectation comes from: [document + version + anchor] — or "I don't know yet"
Build access to reproduce: [yes, cookies for <branch> | no]
Screenshots: [available | need capturing | cannot be captured because <reason>]
```

---

## ORIGINATING INSTRUCTIONS AND CORRECTIONS

| Date | Verbatim | Effect |
|---|---|---|
| **2026-08-17** | Instructed that a **defect-ticket quality standard + a one-at-a-time resume process** be RECORDED as a rule, **because previously-created tickets *"did bite us."*** Hold restated: *"Lets hold them until we are done with Build verification ... Even then we will keep a hold on creating tickets until I allow you to create the tickets."* | **The mandatory quality checklist (below) + ONE ticket at a time on resume** (Standing Rule 73) |
| **2026-08-12** | *"The Engineering manager had raised a concern over creating tickets which does not make sense, so we have to make sure that the defects or tickets which we create do NOT bite us like it did, and must have solid references for the expected behavior, and should have the annotated screenshots in them … you have to amend your rule to make sure that the defects you create can not be challenged and should not bite me, they did badly bite me and my job is on threat due to that. However for now the Jira ticket creation is still on hold."* | **The eight-item bar**, and the hold restated in the same breath |
| **2026-08-10** | *"Just One NEW rule, DO NOT create the Tickets in Jira but ask for my permission first."* | Permission required, **per ask** |
| **2026-08-04** | *"do not create the tickets which are related to API , if there are any ASK me (ask again if I have previously given a go ahead for the API tickets with the Non API tickets)"* | **A batch approval does not cover the API item inside it** |
| **2026-08-04** | *"This is not reproducible with the canned line I used, either you used a different canned line (You should always name the canned line you used)"* | **Item 3** — name the exact test data |
| **2026-08-05** | *"whenever you create a ticket it should be attached to the parent ticket as its epic and that ticket should be created as STORY DEFECT"* | The shape |
| **2026-08-06** | *"please keep the priority of the tickets which you create to Medium instead of keeping them to LOW"* | Priority `Medium`. **`High` remains barred** |
| **2026-08-06** | *"Yes this source block MUST exist for every ticket you created."* | The source block at the bottom is not optional |

---

# 🛑 THE MANDATORY GATE — THE 2026-08-17 DEFECT-TICKET QUALITY CHECKLIST (Standing Rule 73)

**THIS CHECKLIST IS THE GATE OF THIS SKILL. A TICKET THAT FAILS ANY ITEM IS NOT READY to be proposed
for creation — and saying so is the correct outcome, not a failure of the pass.** The QA lead asked
for it in these words: **previously-created tickets *"did bite us."*** It is the **eight-item evidence
bar below, re-expressed as his 2026-08-17 gate**, hardening three points — one-at-a-time resume,
verbatim-in-quotation-marks source, and easiest-possible-for-a-non-technical-PO reproduction. **Satisfy
this checklist AND the eight-item bar; where they overlap they are the same requirement.**

| # | Gate item | Pass condition |
|---|---|---|
| **1** | **Story Defect of the RELATED STORY** | `issuetype` = `Story Defect`, `parent` = the OWNING STORY; also `relates to` the story; no Product Area; priority `Medium` (`High` barred). *(Full shape: Rules 52/53.)* |
| **2** | **NOT a duplicate** | Duplicate search run **first**; the JQL recorded; **what was ruled out stated.** |
| **3** | **Runnable, the EASIEST possible to reproduce** | Steps a **non-technical PO can actually run** — exact on-screen labels, the steps that CREATE any needed data, the **exact test data named**, what was ruled out. **No API calls in the steps.** |
| **4** | **Relevant annotated screenshots** | Marked up (arrow/box/caption), **embedded so they render** — not a file list. |
| **5** | **Expected behaviour, then — after a line break — its source** | The source is named immediately below the expected behaviour. |
| **6** | **Expected behaviour WORD-BY-WORD from the source, IN QUOTATION MARKS** | **No invented expectation, no interpretation.** Quoted literally, in quotation marks, from a named document with its version/date. **No quotable document → NO TICKET.** |
| **7** | **Concise — not too lengthy** | No unnecessary information; to the point. |

**RATIONALE (recorded — it is why each item exists):** previous tickets bit us (the QA lead said his
job was on threat because of it) because they were **too lengthy with unnecessary information, had
missing screenshots, had steps of reproduction that non-technical POs could not run, and cited sources
by reference while quoting NOTHING verbatim from them.** Item 7 closes the length, item 4 the
screenshots, item 3 the runnability, and items 5/6 the verbatim-quoted source.

**ON RESUME: ONE TICKET AT A TIME.** When the hold lifts and he asks to resume — **create ONE ticket →
he verifies it → ONLY THEN the next. Never a batch.** *(Standing Rules 62/73; the hold itself is still
active — see the top of this skill.)*

**Cross-references: Rule 51 (API tickets asked separately, every time) · Rule 52 (the shape + the
eight-item bar) · Rule 53 (priority Medium) · Rule 62 (the creation hold; per-ask permission).**

---

# 🔴 THE EVIDENCE BAR — EIGHT ITEMS, ALL CHECKABLE

**A rule nobody can fail is a rule nobody follows.** **A ticket that cannot show all eight is NOT
READY TO BE PUT TO HIM — and saying so is the correct outcome**, not a failure of the pass.
**These eight items are the detailed backing for the mandatory gate above** — satisfy both.

### (1) THE EXPECTED BEHAVIOUR IS QUOTED VERBATIM FROM A NAMED SOURCE, WITH ITS VERSION AND DATE

The PRD **with its Confluence version number** (never the in-body one) · an **epic story** · a **PO
answer with its file and date** · the **design or Figma** · the **technical design**.

> **🛑 IF THE EXPECTATION CANNOT BE QUOTED BACK TO A DOCUMENT, THERE IS NO TICKET.**

**This single test would have prevented most of what went wrong, and it is deliberately absolute.**
*"The build ought to behave this way"*, *"any reasonable product would"*, *"it is obviously wrong"* are
**not sources** — and a ticket resting on one of them **is precisely the ticket an engineering manager
throws back as not making sense. He would be right, and we would have handed him the argument.**

### (2) ANNOTATED SCREENSHOTS

The actual behaviour **captured and marked up** — arrow, box, caption — so a reader **sees the fault
without reproducing it**. **A bare screenshot is not an annotated one, and a file list is not an
embedded image.**

**⚠️ RECORDED HAZARD, AND IT HAS ALREADY COST US ONE IMAGE.** Editing a Jira description over the REST
API **DESTROYS any pasted image whose `media` node is not carried forward into the new body — and Jira
logs the ADDITION of such an image but NOT its deletion**, so the loss is invisible in the changelog
and provable only from a pre-write snapshot. **One image was destroyed this way on SV-8818 and is
unrecoverable** (`GET /rest/api/3/attachment/59255` now returns 404).

**⇒ THE WORKING METHOD: LIFT THE EXISTING NODES VERBATIM, DO NOT REBUILD THEM.** Walk the current
description's ADF, **deep-copy every `mediaSingle` / `mediaGroup` node whole**, place the copies into
the new body, then **assert `media_ids(new) ⊇ media_ids(old)` and REFUSE TO WRITE if it does not
hold** — a refusal costs nothing, a write costs the file. *(Rebuilding from the media id is safe for
the file but silently loses width, height, `localId` and layout.)* **Verify after every write by
comparing the `attachment` array ATTACHMENT ID BY ATTACHMENT ID — never by count, because a count match
hides a swap.** Code and the read-only auditor:
`build/ticket-reformat-2026-08-06/{attachment-audit,closed-tickets}/tools/`.

### (3) EXACT, NAMED TEST DATA

**Every** canned line · customer · **contact** · part · asset · work-order state · location · role/user
· date range — **named exactly as it appears on screen — plus what was tried and RULED OUT.**

- ❌ *"Create a work order with a canned line."* — **non-compliant.**
- ✅ *"Create a work order and add canned line **HD CVIP air brake trailer single/tandem** (fixed
  labour, $350.00). The total should read **$406.09**."* — compliant.

**AN UNNAMED VARIABLE IS AN UNVERIFIED VARIABLE:** the reader picks a different one, gets a different
result, and closes the ticket.

**THE SCAR — this is exactly how SV-8821 was lost.** Its steps said *"choosing a pre-set (canned) job
so it carries a price"*, naming none. The seeding script behind the evidence had silently filtered the
catalogue to **11 of 79** canned lines, so the report rested on a narrow slice nobody could see. The QA
lead used a different one, saw it work, and closed the ticket. **Re-testing then showed the canned line
was never the variable at all: the real condition was that the work order had NO CONTACT PERSON**,
which disables the Finance tab entirely. **Naming the data would have surfaced that in the first hour.**

**Write "any" ONLY where you have PROVEN it does not matter — and say how you proved it.** A short
table of *"these behave the same"* saves the reader the work you already did **and is the proof the
variable is not the cause.** If a value could not be tried, say which and why.

### (4) THE BUILD MARKER AND THE ENVIRONMENT

The **app-version string** (`<meta name="app-version">`) · the **QA branch/URL and API host** · the
**date and time observed** · and the **true viewing context** — *"desktop browser, signed in as an
Administrator"*. **State the role you were REALLY in, not the role the case assumes.**

### (5) A DUPLICATE SEARCH RUN FIRST, WITH THE QUERIES RECORDED

Not *"we looked"* — **the JQL, in the pack.** **Several tickets we filed already existed**, and a
duplicate is the cheapest possible way to look careless in front of the people whose queue it lands in.

### (6) THE SHAPE THE POs AND THE ENGINEERING MANAGER ASKED FOR

**Concise description · steps of reproduction · current behaviour in plain words · expected behaviour
in plain words · a line break, then the source.** **The source block at the bottom is not optional.**

This sits **inside**, and does not replace, the **seven-section format** (below), which remains the
mechanical layout.

### (7) A PRE-FILING SELF-CHALLENGE, WRITTEN DOWN

**Answer in writing: *what is the strongest argument that this is NOT a defect?***

> **If the honest answer is *"the source does not actually say that"* or *"I cannot reproduce it from
> my own steps"* — DO NOT FILE IT.**

Record **the challenge and the answer** in the pack. **The argument gets made either way: either we
make it first, in private, or the engineering manager makes it in public.**

### (8) CHECK IT IS NOT A RULE-24 PASS

**A control hidden in the UI while the API still allows the action is a PASS, not a defect.** Filing
one of those is **the literal definition of a ticket that "does not make sense"**, and it is an easy
mistake to make from a network capture.

**The inverse — the front end EXPOSING what the back end blocks — IS a defect** and stays filable.

**And check the other three things that make a ticket nonsense, because (8) is only the commonest:**
- **a CLOSED ticket is not a spec change.** The build failing a requirement whose ticket was closed
  *accepted* is still a deviation, **but it needs the expect-fail treatment, not a new ticket**;
- **ticket status is never evidence about the build** — five evidenced failures of status-as-proxy are
  on record, including **a fix that shipped while its ticket stayed Open** (SV-8851) and **two tickets
  closed OBSOLETE that still reproduced byte-identically** (SV-8843, SV-8847);
- **an API-only finding is classified by the reachability test and asked about separately**, whatever
  else is approved.

---

## THE API REACHABILITY TEST — and why it is asked separately every time

> **If the defect is invisible to a user AND to a manual tester — reachable only by calling an
> endpoint directly with a request the product's own screens never send — it is API-RELATED.**
> **If the same failure ALSO occurs through the product's own screens, it is a USER-FACING defect**
> that merely happens to be characterised technically. **A 500 in a response is technical evidence; it
> is not what makes a ticket API-related.**

**Judge by REACHABILITY FROM THE PRODUCT, never by whether our evidence happens to be an endpoint
capture.**

**The pack lists API-related findings in their OWN SEPARATE SECTION**, with the reachability reason per
item, and **the ask goes separately, in plain words: what the defect is, that it cannot be reached from
any screen, and the explicit question — file it or not?**

**The worked contrast, and it IS the test in practice:** **SV-8822** (a server error on saving a
customer, reachable only by sending a request shape the dialog never produces) was **withdrawn —
transitioned to OBSOLETE with a plain closing comment, never deleted**; **SV-8821** stayed **open**
precisely because it **also fails through the product's own screen.**

**Withdrawal, when he rules for it:** **CLOSE via a workflow transition with a plain-language comment,
NEVER DELETE** — a withdrawn ticket with its reasoning on the record is worth more than a deleted one,
and deletion is irreversible. **Keep the underlying finding written up in the pack: we withdraw the
TICKET, not the FINDING.**

---

## THE SHAPE, ONCE PERMISSION IS GIVEN

**Five things, no ambiguity between them:**

| Field | Value |
|---|---|
| `issuetype` | **`Story Defect`** (10007) |
| `parent` | **THE OWNING STORY** — never the epic |
| `priority` | **`Medium`** — **`High` is barred**, always |
| link | **also link the owning story `relates to`** |
| Product Area | **do NOT send it** — the field does not exist on this type |

**⚠️ NEVER use `Story Defect - Archive`** (10279) — a legacy type at the wrong hierarchy level, whose
lookalike name silently reproduces the old shape.

**Why a story parent and not the epic:** a `Story Defect` is a **subtask (hierarchy level −1)** and
**Jira refuses an Epic parent outright** — `HTTP 400 "Please select valid parent issue."` — while the
identical body with a Story parent returns **201**. Of all 502 Story Defects in the project, **0 are
parented to an Epic**.

**⚠️ AND A FACTUAL CORRECTION WORTH KNOWING, because our own rule text got it wrong once:** a Story
Defect is **NOT** returned by `parent = <epic>`. It is reachable from its epic **only via a two-hop
join** (defect → story → epic). **The shape is still the QA lead's instruction and stands** — this is
a fact in the reasoning, not a reason to change the shape.

**Keep adding the `relates to` story link even though it duplicates the parent** — the organisation's
"Change work type" wizard lands a converted ticket on **the story we LINKED**, so our habit is
precisely what makes other people's conversions land correctly.

**NO STANDALONE TICKETS.** Every ticket has a parent, **including a defect whose underlying cause sits
in another team's area** — *"it is not really a reporting bug"* is not a reason to leave it parentless.
**Where there is genuinely no owning story, ASK which story it belongs under.** Say in the technical
section where the fault actually lives, and keep any `blocks` link that explains why we raised it.

**NEVER CONVERT SOMEONE ELSE'S TICKET.** Conversion is **UI-only** (the REST API refuses it), it
**silently wipes Product Area with no changelog entry**, and other people are actively converting
tickets themselves. **It is the QA lead's call, never ours.**

---

## THE SEVEN-SECTION FORMAT — the mechanical layout

| # | Section | What goes in it |
|---|---|---|
| 1 | **Description** | Plain layman words. **No jargon, no codes, no endpoints.** What is wrong, and **why it matters** |
| 2 | **Branch / Environment** | Stated explicitly, never assumed: branch URL, API host, **build marker**, org/location ids, **date and time observed** |
| 3 | **Steps to reproduce** | **Real numbered steps a layman can follow**, using the **exact on-screen labels**. **If data is needed, include the steps that CREATE it.** **NAME THE EXACT TEST DATA** (item 3). **NO API calls here.** If the fault genuinely cannot be reached from any screen, **say exactly that** and point at section 7 |
| 4 | **Expected behaviour** | In plain words, **quoting the governing requirement** |
| 5 | **Current behaviour** | In plain words |
| 6 | **Images** | Attach **and embed inline so they RENDER** — not a file list. If none exists, **say so and say why** |
| 7 | **Technical details for developers** | **LAST.** All codes, endpoints, request/response bodies, request ids, row counts, spec references, evidence paths — **everything technical, and nothing technical above** |

### 🛑 TWO THINGS THAT MUST NEVER APPEAR IN A TICKET

1. **No reference to our test cases** — no internal IDs, no C-ids, no TestRail links, no "cases
   affected" section. **That mapping stays in OUR records** (`CASE-IMPACT.md` in the pack).
2. **No "this branch is not final / this finding is provisional" disclaimer.** His reasoning, recorded:
   *every QA branch is always non-final — they keep changing it — so saying so adds nothing, and it is
   OUR job to keep the test cases accurate, not the developer's job to caveat our findings.*
   **A defect hedged as provisional invites dismissal.**
   > **⚠️ DO NOT OVER-APPLY #2.** It drops the **Jira-facing text only.** The internal re-check
   > obligation stands: the `RECHECK-QUEUE.md` files stay exactly as they are.

### Inline images — the mechanism that actually works

A hand-built ADF `media` node **fails** (400 `ATTACHMENT_VALIDATION_ERROR`) because the media `id` must
be a **media-services UUID**, not the attachment id. The working route is **wiki markup through API
v2**:
1. `POST /rest/api/3/issue/{KEY}/attachments` (multipart, header `X-Atlassian-Token: no-check`) — note
   the `id` and **check `size` against the source file**.
2. `PUT /rest/api/2/issue/{KEY}` with `description` as a **wiki-markup STRING** containing
   `!file-name.png|width=900!` → 204.
3. **VERIFY IT RENDERS, do not assume:** the stored ADF must contain a **`mediaSingle` › `media`** node
   whose `attrs.id` is a **36-char UUID**, **and** `renderedFields.description` must contain a real
   `<img src=".../attachment/content/<id>">`. **Attached but not inline fails this format.**

---

## THE DELIVERABLE — the prepared pack

`build/<project>/defect-pack-<date>/`:

| File | Contents |
|---|---|
| `TICKET-<n>-<short-name>.md` | The full seven-section body, ready to paste, **with the eight bar items evidenced above it** |
| `SELF-CHALLENGE.md` | Per finding: **the strongest argument that this is not a defect**, and our answer |
| `DUPLICATE-SEARCH.md` | **The JQL queries run**, and what each returned |
| `API-SPLIT.md` | API-related findings in their own section, **with the reachability reason per item**, and the separate ask |
| `CASE-IMPACT.md` | Which of our cases this affects — **kept OUT of the ticket** |
| `evidence/` | Annotated screenshots, captured responses — **redacted at the point of capture** (core §10) |
| `NOT-FILED.md` | Findings deliberately **not** offered, and why — so a deliberate non-filing can never look like a miss |

**Then, in the report to the QA lead:** what the defect is, in plain layman words · the evidence · the
source quoted verbatim · **our recommendation** · and the **ready-to-file text**. **We do the whole job
of preparing the ticket and stop at the button.**

**Log it in `build/OUTSTANDING-ITEMS-REGISTER.md`.** An unanswered ask is a **missing input** and stays
outstanding — never quietly dropped, never re-decided by us.

*Canonical example: `build/report-suite/defect-pack-2026-08-04/` (`TICKET-1…6*.md`, `API-SPLIT.md`,
`FILED.md`, `repro-sv8821/`).*

---

## THE STEPS

1. **Core §0 pass-start checklist.**
2. **Confirm the hold still stands** before doing anything that assumes filing. *(Asked to confirm it
   before raising a ticket, he answered: **"Good catch, be like this always."**)*
3. **Rule out our own probe first** (skill `03`) — **a false absence looks exactly like a finding.**
   **More than forty were caught in two days and NOT ONE was a product fault.**
4. **Rule out our own instrumentation** (skill `03`) — re-run from a **proven-clean baseline** when the
   result surprises you in an area that already has open tickets.
5. **Find the source and quote it** — item 1. **If you cannot, STOP: there is no ticket.**
6. **Reproduce it, naming every piece of data** — item 3 — **and record what you ruled out.**
7. **Capture and annotate** — item 2.
8. **Run the duplicate search and record the JQL** — item 5.
9. **Write the self-challenge** — item 7. **Be willing to lose here.**
10. **Apply the four nonsense checks** — item 8.
11. **Classify API vs user-facing** by reachability, and split the pack.
12. **Write the seven-section body** and the pack.
13. **Score it against the mandatory gate** (the 2026-08-17 checklist) — **a fail on any item = NOT
    READY; say which item failed.**
14. **Report it with the recommendation, and stop.** Log it in the register.
15. **ON RESUME ONLY (hold lifted + his go-ahead): ONE TICKET AT A TIME** — create one, he verifies it,
    only then the next. **Never a batch** (Standing Rules 62/73).

---

## GUARDRAILS

- **G1 — Nothing is filed. The hold is active** (core §11.1). When it lifts, permission is still
  required **per ask**.
- **G2 — A finding being real, sourced and obviously worth filing is NOT permission.** How good the
  finding is and whether we may file it are **two unrelated questions**.
- **G3 — An API item is asked about separately, even inside an approved batch.**
- **G4 — Never delete a ticket.** Withdraw by transition, with a plain comment.
- **G5 — Never edit or convert another author's ticket** (core §5, and the Product Area wipe above).
- **G6 — Never file a Rule-24 pass** (item 8).
- **G7 — Never file on "it is obviously broken".** The honest question is not *"am I right?"* but
  ***"can I prove it from a document, and can a stranger reproduce it from my own steps?"*** — and if
  the answer to either is no, **hold it and say so.**
- **G8 — Priority `Medium`. `High` is never ours to set.** Severity belongs in the ticket's words and
  in the `Severity` field, not in `Priority`. *(And never "restore" a priority the QA lead changed —
  that produced an embarrassing `High → Low → High → Low` round trip on four tickets, all under our
  shared account, where his edits are indistinguishable from ours in the changelog.)*
- **G9 — 🛑 If an instruction for this pass conflicts with a rule here, STOP and surface it BEFORE
  acting** (core §11.6, Standing Rule 63). **What he instructed, quoted verbatim · what the rule
  requires, quoted, with its number · an explicit ask: which should we follow?** **Neither silent path
  is available** — not silently following the new instruction, not silently keeping the old rule. **A
  tightening or a layering is NOT a conflict**; escalating those trains him to wave escalations
  through. *He endorsed the practice by name: **"Good catch, be like this always."***
- **G10 — On resume, ONE TICKET AT A TIME — never a batch** (Standing Rule 73). Create one → he
  verifies it → only then the next. A weak ticket filed in a batch discredits the good ones beside it;
  one-at-a-time makes each separately answerable and keeps Rule 62's per-ask permission true in fact.
---

## HONESTY NOTES

- **"Cannot clear the bar" is a legitimate, correct outcome.** Say which item failed. **Withdraw a
  weak finding from the pack rather than offering it weaker.**
- **✅ RE-CHECKED 2026-08-13 — the open item this skill owned is DISCHARGED, and the count was SIX,
  not five.** The prepared Report Suite defects live in
  **`build/report-suite/full-viu-2026-08-06/DEFECTS-FOR-PERMISSION.md`** (D1–D5 **plus "Defect 6"**,
  added later the same day — the long-repeated *"five prepared defects"* was stale). The first cold run
  of this skill scored all six against the eight items —
  **`build/report-suite/defect-recheck-2026-08-13/SCORECARD.md`**: **D1 holds** (offer as a
  reopen/broaden of SV-8954) · **D2 and Defect 6 hold** (new tickets) · **D3 and D4 are NOT filable as
  new tickets** (closed SV-8943/SV-8967 still reproduce — reopen asks, per item 8) · **D5 is WITHDRAWN
  as a ticket** (cosmetic, plausibly the document's error — a PO question). Common debts before any is
  offered: written self-challenges (none existed), recorded JQL duplicate searches (none existed),
  paste-ready bodies with C-ids stripped, and **annotated screenshots re-captured after the next
  Reports build lands** (every existing capture is bare, and D4's cited `wip-checks.png` does not
  exist). **The FILING still waits on the QA lead's hold.**
  **⚠️ SUPERSEDED WORDING, KEPT AND DATED:** until 2026-08-13 this note read *"the five
  already-prepared Report Suite defects were written under the OLD bar… NOT yet re-checked"* — and
  named no path to them, which was this skill's first proven cold-start defect: a fresh session had to
  grep the repository to find what the skill itself owned.
- **⚠️ AND THE BAR MATTERS MORE NOW THAN WHEN IT WAS WRITTEN, BECAUSE ALL THREE BRANCHES ARE FINAL**
  (QA lead, 2026-08-11: ***"The Branches are Final now."***). **A deviation on Schedule, Filters or the
  Report Suite is a REAL DEFECT IN A FINISHED FEATURE, not a possibly-unfinished one** — so the
  hedge that used to soften a weak finding is gone, and **a ticket that fails the bar now lands
  squarely as the "does not make sense" complaint that put the QA lead's job at risk.** **Finality
  raises the standard of evidence; it does not lower the standard of permission.**
- **Withdraw our own invalid ticket when we find it.** One of ours was closed OBSOLETE because it had
  been raised against a shop **with no business hours configured — which the source case's own
  precondition required.**
- **A deliberate non-filing is RECORDED** (`NOT-FILED.md`), so it can never look like a miss.
- **Be explicit about what could not be captured.** *"The no-logo state was never produced because
  this organisation has an uploaded logo"* is the correct sentence — **B5 was not filed for exactly
  that reason.**

---

## WHAT THIS SKILL DOES **NOT** DO

| Not this | Use |
|---|---|
| **File the ticket** | **Nobody, while the hold stands.** Then: the QA lead's permission, per ask |
| Establish whether the source supports the expectation | **[`02-SOURCE-CHECK`](02-SOURCE-CHECK.md)** |
| Prove the finding is not our own probe or our own setup | **[`03-RUN-CHECK`](03-RUN-CHECK.md)** — do this **first** |
| Write or repair the affected cases | **[`01-CASE-BUILD`](01-CASE-BUILD.md)** |
| Put the item in the completion report | **[`05-PROJECT-REPORT`](05-PROJECT-REPORT.md)** |
| Ask the PO whether the behaviour is even wrong | **[`07-PO-QUESTIONS`](07-PO-QUESTIONS.md)** — **if the answer decides whether it IS a defect, it is a question, not a ticket** |
