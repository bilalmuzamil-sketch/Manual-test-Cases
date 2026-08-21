# SKILL 10 — TEST-CASE CREATION (authoring new cases from sources)

> **Lane:** authoring. This skill covers writing NEW test cases for a project from its sources.
> It does **not** cover verifying cases against a running build (see `build/skills/11-BUILD-VERIFICATION.md`)
> or the build-accurate wording + live VIU pass (see `build/skills/12-VIU.md`).
> **Created 2026-08-21.**

---

## 0. SHARED CORE BLOCK (identical in skills 10 / 11 / 12 — read it every time)

**(i) SESSION SURVIVAL — Rule 75 (detached-process architecture) + Rule 76 (quota discipline).**
- Long work runs as **ONE detached, idempotent, resumable script** plus a **pure-shell committer**
  gated on a **RUN-FLAG FILE** (e.g. `touch /tmp/<job>.RUNNING`, committer loops while the flag
  exists). **NEVER gate on `pgrep -f <scriptname>`** — the pattern matches the watcher's own
  command line, so it never terminates.
- The agent **launches and exits**. It does not sit and watch. A **fresh one-pass agent verifies
  later** by reading the committed output.
- Rule 76: **never spawn a session/subagent for a trivial check.** Self-report progress **in commit
  messages**. **Batch ruthlessly** (one pass, many files). **Answer in text** where a file is not
  actually required.

**(ii) Rule 79 — STRATEGY FIRST.** Before starting, devise or recall the **quota-efficient plan**:
what the single pass will do, what is batched into it, what is deliberately deferred. Write the plan
down (a few lines is enough) and then execute it in one pass.

**(iii) SECRETS.** Credentials (cookies, tokens, passwords, `sv_sso_session`, `PHPSESSID`,
`cf_clearance`, Bearer tokens) live **only in `/tmp`, `chmod 600`**, and are **NEVER committed**.
**This repository is PUBLIC.** Before any commit run the manual staged-diff check:
`git diff --cached | grep -iE 'password|cookie|sv_sso_session|cf_clearance|PHPSESSID|Bearer |token=' && echo POSSIBLE-SECRET || echo SCAN-CLEAN`
— **refuse to commit on POSSIBLE-SECRET.**

**(iv) Rule 29 — NO WORK LOSS.** Commit **and push** after every completed step. **Path-scoped
`git add -- <paths>` only; never `git add -A`; never commit anything under `/tmp`.** Git is the only
durable store; the container and `/tmp` are ephemeral. Detail: `build/NO-WORK-LOSS-STRATEGY.md`.

**(v) Rule 8 — IDs.** Every time an internal ID is named (`FLT-…`, `SCH-…`, `SBC-…`), pair it with
its TestRail Case ID **and** the link: `https://shopview.testrail.io/index.php?/cases/view/<id>`.
A case not yet in TestRail is stated as **"new, no C-ID yet"**. This applies in chat replies and
status tables, not only in files.

**(vi) Rule 36 — OUTSTANDING.** Every report **ENDS** with an **"OUTSTANDING — what I need from
you"** section. If nothing is outstanding, say **"nothing outstanding"** — never omit the section.
Sweep all six categories: missing sources · unanswered PO/dev questions · missing go-aheads ·
access/credentials · deferred/HELD decisions · what another team owes. Register:
`build/OUTSTANDING-ITEMS-REGISTER.md`.

> **⚠️ RULE-NUMBER HONESTY.** `CLAUDE.md`'s numbered Standing Rules currently **end at Rule 62**
> (verified 2026-08-21). Rules **69, 71, 72, 74, 75, 76, 77, 79, 80, 81** referenced in these skills
> come from the QA lead's **later spoken/typed instructions** and are recorded here from those
> instructions. They are **not yet written into CLAUDE.md's numbered list.** Treat the wording here
> as the working record and ask the QA lead to confirm any point that a decision turns on.

---

## 1. WHEN TO USE THIS SKILL

Trigger phrases: *"author the test cases for [project]"* · *"create the cases from this spec"* ·
*"we have a new project — write the suite"* · *"cover this new story/requirement"*.

---

## 2. THE REQUIRED INPUT SET — DO NOT START ON A HALF-SPEC (Rule 1)

Authoring may **not** begin until all of these are in hand, or the missing ones are explicitly
accepted as gaps by the QA lead:

1. **Spec / PRD** — the Confluence page (URL **and** the exported content; Confluence is
   SSO-walled, so either read it via the Atlassian MCP `getConfluencePage` or get an export).
2. **Epic + its child stories** — the Jira key, the story set, each story's status, description,
   acceptance criteria and comments.
3. **Designs** — **all three artefact types count** (Rule 57 as amended 2026-08-06): a **Claude
   design** (prototype export or share page), a **Figma design**, and the **technical design**.
4. **Engineering tech plan** (Rule 30) — if it was never supplied, **REMIND the QA lead**.
5. **The PO's name** — per project, never mixed, never guessed.
6. **QA branch / environment + feature-flag state** — needed later for VIU, asked for up front
   (Rule 22).
7. **The TestRail target** — which section/group the cases belong in.

**If any of 1–5 is missing: STOP and ask (Rule 1).** Partial-spec authoring produces cases nobody
can defend.

---

## 3. STEP 1 — THE RULE-31 SOURCE-CURRENCY PRE-FLIGHT (the FIRST action, always)

Establish and record the currency of **every** source before writing a single case:

| Source | What to check | Trap |
|---|---|---|
| Spec | live **Confluence version number** + last-updated vs our baseline | the in-body "Version: 1.0" field lies — use the Confluence version |
| Epic + stories | story set, statuses, description/comment changes, via the **changelog** | the epic's "updated" date moves for admin-only edits |
| Designs | Claude design / Figma / technical design; an open Rule-35 fetch queue means designs are **NOT** current | an **undated editable share link cannot be dated at all** → record PARTIAL and escalate |
| Tech plan | do we hold the current version? | — |
| PO answers / messages / videos | newest authoritative source wins (Rule 32) | a page being new says nothing about a **requirement's** own age — diff the requirement's text across versions (Rule 31 trap (c)) |

Emit a **SOURCE-CURRENCY block** in the deliverable: per source — identifier, version /
last-updated, date checked, and **CURRENT / STALE / PARTIAL** (a PARTIAL source names the exact
shortfall). **Nothing may claim completeness while a source is STALE.** If a source cannot be
fetched, **STOP and ask for access** — never work off a possibly-stale copy.

---

## 4. STEP 2 — WHERE EXPECTED BEHAVIOUR COMES FROM (Rule 57 — the rule that matters most)

**Expected behaviour comes ONLY from documents. The build is NEVER a source.** The authoritative
list, as widened over time, is **(a)–(g)**:

- **(a)** the PRD / Confluence specification
- **(b)** the epic's stories — description, acceptance criteria, comments
- **(c)** the PO's verified answers (answer sheet or message)
- **(d)** the **design** — Claude design / Figma / technical design (added 2026-08-06)
- **(e)** **Figma** (added 2026-08-06)
- **(f)** **new `.md` files shared with us** — handover and design-review documents (added 2026-08-10)
- **(g)** **any written statement shared with us, when it is newer** — including a message or a
  channel post (added 2026-08-10)

**The list is OPEN-ENDED by the QA lead's instruction** — a new document type does not need a rule
amendment before it counts. The test is: *is it provided to us, is it authoritative, is it the
latest?*

Consequences for authoring:
- **(a)–(g) are expected to AGREE.** Where they disagree, that is a **defect in the documents**:
  raise it as a **PO question** (Rules 7/55) + log it in the outstanding register (Rule 36). The case
  meanwhile follows the **most recent authoritative source** (Rule 32) and **discloses the
  divergence in its own text** (Rule 56 — three parts: where the PO asked for it + link + date;
  where it differs and what the earlier source said; that we take the latest as prevailing).
  **Never add a divergence sentence where nothing diverged** — that manufactures a conflict.
- **Rule 58:** an **ambiguous** source is **never** resolved by looking at the build. Hold the case,
  cite the open question on it, and ask. The **quote-back test**: if the new expectation cannot be
  quoted back to the source text, the edit is **invalid**.
- Where **no source speaks at all**, the case asserts only what a source supports and the gap
  becomes a **PO question** — an unsourced expectation filled in from the build **hides** the gap.

---

## 5. STEP 3 — WRITE THE CASE

### 5.1 Wording (Rules 7 + 9)
- Plain layman English a **new, non-technical manual tester** can follow.
- On-screen labels, button text, field names and screen names must be the **EXACT** build strings —
  taken from the build, never invented or paraphrased.
- **On a spec-only project (no build yet): do NOT invent labels.** Use the spec's verbatim label and
  mark anything unpinned as **"VIU-confirm"**, to be confirmed live once the QA branch exists.
- No jargon, no ticket IDs, no `§`-anchors, no enum names, no HTTP codes, no bug codes, and never the
  word **"VIU"** in tester-facing text.

### 5.2 Structure
- Numbered **Preconditions / Steps / Expected Results**, **one line per step**.
- **Line breaks are `<br>`, NOT bare `\n`.** *(The format-reflow lesson: TestRail re-renders text and
  a bare newline collapses the layout; and `update_case` re-renders any text field you OMIT from the
  payload — so always send all text fields.)*
- **Title ≤ 80 characters** so it displays without truncation. Detail goes in the body, never the
  title.
- **Rule 4:** any case whose preconditions/steps/expected mention an API endpoint, HTTP verb, HTTP
  status code or an explicit backend request/response check goes in a section whose title includes
  **"API"**. UI-only cases stay in their functional section.
- **Rule 42:** no closed enumerations (*"the headers are exactly …"*) without a **version-pinned
  anchor**; prefer **scope-conditional** wording (*"includes X in position Y when Z"*). Give the
  tester the plain conditional too, so a correct build does not read as a failure.

### 5.3 Traceability (Rules 20 + 42)
`refs` carries **BOTH** the ticket and the spec anchor, with the spec version:

```
<TICKET(S)> (<spec-anchor>, spec v<N> <date>)
```

- **Per-story precision always** — the exact story + the exact requirement. The **epic** key is used
  only for a genuinely cross-cutting case with no single-story owner, and that is stated explicitly.
- Ticket-only is **not acceptable**; the spec anchor must never be dropped.
- TestRail's `refs` splits on commas and **rejects any single comma-entry over 248 characters**
  (HTTP 400 *"Field :refs does not match the required pattern."*). House style: **one comma-free
  entry ≤ 248 chars**.
- Mirror the same `refs` into `build/<project>/testrail-id-map.csv` and the coverage matrix.
- A case with **no ticket AND no spec anchor is NOT authentic** — flag it
  (`build/MISSING-TRACEABILITY-PROCESS.md`), never leave it silently unsourced.

### 5.4 The Rule-54 provenance line — LAST content in Expected Results, TWO sentences, never merged
After a separator line:

- **Sentence 1 — the SOURCE. Mandatory. DOCUMENTS ONLY.** The epic and/or owning story + the
  specification with its **version** + the requirement reference, and/or the PO's answer file **with
  its link and date**, and/or the design artefact (an undated editable share link is cited as
  exactly that). **The build is never named here — not as a source, not as corroboration, not in
  passing.**
- **Sentence 2 — the RECORD OF CHECKING. Optional.** *"Last checked against build v3.5-16cf83f on
  8/5/2026."* Neutral checking language only. **"as per the build tested on …" is BARRED.** If the
  case has never been checked against a build, **omit sentence 2** or say plainly that it has not
  been checked.

The requirement reference in parentheses **is** allowed in tester-facing text — a deliberate,
QA-lead-authorised exception to the no-anchors guidance. Do not strip it.

### 5.5 The AUTOMATION marker — the very LAST thing, blank line before and after
Exactly **one** marker per case, a fixed literal, never reworded or abbreviated (the automation
engineer greps for it):

1. `AUTOMATION: READY` — asserts **automatable**, not "currently passing". Build-independent.
2. `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)`
3. `AUTOMATION: HOLD - <short plain reason>`
4. **Rule 69 form — not available on the build:** where the feature/surface the case needs **does
   not exist on the build**, the marker says so plainly in the `HOLD` reason (e.g.
   `AUTOMATION: HOLD - not available on the build`). **NOT-BUILT cases are EXCLUDED from any
   "ready to automate" figure** — they are absent product, not a readiness shortfall.

**A tool flag never justifies HOLD** (devtools, DOM/network inspection, reading a PDF or CSV, seeded
data, theme toggles, viewport sizes are all automatable). Only a **genuinely unobtainable thing** — a
real physical device, an external account we do not have — does.

**Rule 61 — an EXPECT-FAIL case carries the symptom and all three outcomes**, in the tester-facing
text **before** the provenance line:

> *"What you should see today: `<the exact symptom, in plain words>`. This is a known problem and it
> is already reported — see https://shopview.atlassian.net/browse/SV-xxxx.
> · If you see exactly that, mark this test FAILED and do not raise anything new.
> · If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please
> report it.
> · If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note
> removed."*

Outcome (3) makes the automated run itself the detector of a silently-shipped fix; outcome (2) stops
a NEW defect hiding behind an old one. Where the ticket was **closed without a fix**, that qualifier
sits alongside the symptom. **Ticket status is never read as evidence about the build.**

---

## 6. STEP 4 — COVERAGE, BOTH DIRECTIONS (Rules 43 + 45)

**Rule 43 — per-requirement coverage verdict table.** Every requirement (and every added / changed /
removed requirement in a spec diff) gets **its own row**: requirement id + **verbatim text** → **one**
verdict from *covered by case(s) (internal ID + C-id)* · *case extended (name the field)* · *new case
authored* · *not independently testable (state why)* · *blocked (state the blocker + owner)*.
Row count must reconcile with the diff's delta count. **A narrative summary is not acceptable.**
Coverage matrices are **RE-DERIVED per spec version, never patched**, and run **both ways**:
requirement → case (uncovered requirements) and case → requirement (orphaned / stale anchors).

**Rule 40 — surface matrix.** A requirement almost never lives on one screen. Walk the whole
checklist and give **each surface its own verdict**: on-screen · PDF export · CSV/other download ·
print view · API payload · mobile/responsive · email or scheduled delivery · column/field selector ·
filter and sort surfaces · empty/error/zero state · any project-specific surface. Mark N/A
explicitly rather than skipping. A delta doc naming only the cases it touched is incomplete.

**Rule 45 — the outside-in gap hunt.** Before the suite is called current, look at it from outside:
(a) foreign-coverage diff in **both** directions
(`build/gap-rootcause-2026-07-31/reverse_coverage_diff.py`, read-only) — another author's assertion
with no counterpart in ours is a **coverage signal**; (b) the automation-engineer lens (*what would I
assert from the running build?* — state the limit honestly if there is no QA branch); (c) the
hostile-reviewer lens; (d) treat **every** external signal as a coverage input, not a reply;
(e) **a "covered" verdict is only valid with BOTH TEXTS QUOTED SIDE BY SIDE, and a requirement making
two assertions gets ONE ROW PER ASSERTION.** Foreign cases stay **untouched** (Rule 38).

---

## 7. STEP 5 — THE MANDATORY CLOSING GATE: RUTHLESS USEFULNESS AUDIT (Rule 28)

Every authoring pass **ENDS** with `build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md`, scoring **100% of
the cases** (no sampling — Rules 17/50) on **three dimensions together**:

1. **USEFUL** — one verdict each: **KEEP** / **MERGE** (name the group + survivor) / **WEAK-KEEP** /
   **CUT**. Hunt the named slop patterns (near-duplicates across areas, sort-direction and
   per-column explosions, per-column display filler, tooltip present-vs-text splits, empty-state
   triplets, permission cases reducing to one gate, export pairs duplicating a filter matrix) and
   credit the load-bearing coverage (calculation contracts, permission gating, link targets,
   persistence, export-reflects-filters).
2. **MAKES SENSE** — cold-read **every** case: **SENSIBLE / FIX-WORDING / NONSENSE** against the six
   fail conditions (steps not executable in order or precondition unreachable; expected result does
   not follow; internal contradiction; references a control in no source; domain nonsense; not
   actionable). Quote the offending text. Do the **KEEP-but-NONSENSE** embarrassment check.
   **The cold read is NOT a sample** — state the exact number read out of the exact population.
   **Plus the CROSS-CASE CONTRADICTION SWEEP:** group cases by the control/behaviour they assert on
   and diff their expected results; run the opposite-assertion keyword sweep (hidden vs shown /
   disabled, real-time vs on-Apply, editable vs locked); do a **TITLE-vs-EXPECTED** check on every
   case; diff cases sharing a `refs` anchor. Any pair that cannot both be true = **CONTRADICTION**,
   resolved by Rule 33 precedence (PO ruling → QA lead's ruling → our live-verified findings →
   a reviewer's claim) with the **whole group** aligned to the winner, or flagged PENDING a PO
   question. **A suite may not be delivered with an unresolved contradiction.**
3. **GENUINE + LAYMAN-RUNNABLE** — Rule 20 traceability and Rules 7/9 plain wording; a failure here
   is FIX-WORDING or CUT.

Ship the **three-dimension tally** with the suite plus an honest *"is the critic right?"* answer on
both halves (waste % and makes-no-sense %). The audit **only recommends** — no merge, cut, delete or
edit is executed in TestRail without explicit authorisation (Rule 6).

**Rule 46 — the DELIBERATE-DECISIONS / anticipated-challenge register ships with the suite.** One
entry per deliberate non-authoring, PO-ruling-over-spec case, HELD/open item, and accepted
imperfection, each with all six fields: the decision in plain words · a **plain one-sentence answer**
· the evidence (document + version + anchor + date) · the affected cases (internal ID + C-id + link)
· who can close it · an honest **RISK** rating. **Never back-date a miss into the register** — an
undocumented deliberate omission is indistinguishable from a miss, and a back-dated one is worse.

---

## 8. NEW-PROJECT ONBOARDING CONVENTION

Create `build/<project-slug>/` containing:

- `PROJECT-STATE.md` — the canonical cold-resume doc (case inventory + status breakdown, TestRail
  state, deliverables index, open threads, env/access facts, ordered how-to-resume).
- `requirements.md` — the COMPLETE spec, built from what the QA lead provides. Keep the Confluence
  URL as a reference pointer.
- `cases/` — the authored case source, IDs `<PREFIX>-<AREA>-NN`.
- `testrail-id-map.csv` — internal ID ↔ TestRail C-ID map, **with a `refs` column** (Rule 8/20).
- Record the **canonical spec URL + the PO name**. Never mix PO attributions across projects.
- Then add a per-project entry to `CLAUDE.md` with a STATUS line pointing at that `PROJECT-STATE.md`.

---

## 9. DELIVERABLES — MIRROR THE ESTABLISHED FORMAT 1:1 (Rule 16)

- Import: `testrail-import/<project>-v1-testrail-import.csv` (+ `.xlsx`), generated by the project's
  `gen_import.py`, **header byte-identical to its peers** (hash-check it), **VIU-word-free and
  feature-flag-free**, no ID columns (traceability lives in `testrail-id-map.csv`).
- **Known generator gotchas:** a rerun **blanks the id-map C-ID column and drops the `refs`
  column** — re-merge both from live afterwards. And the `joinlines()` shredding bug (a newline
  between every character when the source holds a string rather than a list) — **run the shredding
  guard** and check the output before delivering.
- Human-readable filenames, full names never cryptic abbreviations (Rule 19).
- Any workbook listing cases carries the **TestRail Case ID + link** columns (Rule 8), and every
  non-passed row carries a plain **"What needs to be done"**.

---

## 10. HARD GATES — ASK FIRST

| Gate | Rule | What it means here |
|---|---|---|
| **TestRail writes** | 6 | TestRail is the **only** real production system. **No `add_case` / `update_case` / `delete_case` / run write without explicit permission.** `add_case` requires `custom_atmstatus:1`. |
| **Jira ticket creation** | 62 (+ the 2026-08-10 **"create nothing"** HOLD) | Prepare the ticket text and **stop at the button**. Permission is **per ask** — a batch approval never covers a later ticket. |
| **Which process to run** | 11 | On a new/updated spec **or** a VIU request, **ASK** which process(es) to run. Never assume. |
| **Live-build check + access** | 22 | Identify every item that needs live observation and **ask up front**, requesting cookies + env/branch + flag state. |
| **Run sync after any push** | 34 / 47 | A fixed-selection run (`include_all: false`) never picks up new cases. **UNION only** — a partial `case_ids` list **deletes tests and their results.** Snapshot `get_tests` + `get_results_for_run` first, verify every prior result present **by id** after. Scope: only the active projects' runs. |

---

## 11. CROSS-REFERENCES (read these, don't copy them)

- `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` — the wording + VIU method (skill 12).
- `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` — whole-suite relevance/obsolescence.
- `build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md` — the Rule-28 closing gate.
- `build/MISSING-TRACEABILITY-PROCESS.md` — find + backfill unsourced cases.
- `build/PROCESS-AUTHORING-STANDARD.md` — how to write a process doc (Rule 21).
- `build/PROCESS-CATALOG.md` — the index of every callable process.
- `build/OUTSTANDING-ITEMS-REGISTER.md` — the cross-project waiting-on list.
- `build/QA-QUALITY-PIPELINE-EXPLAINER.md` — the presentable 12-step quality story.
- `build/APP-ACTIONS-PLAYBOOK.md` — proven action recipes (Rule 27: reuse, never re-discover).
- `build/TESTING-RUNBOOK.md` — the staging/TestRail method.
- `build/NO-WORK-LOSS-STRATEGY.md` — checkpoint discipline.

**Do NOT read `CLAUDE.md` end to end** — it is ~5,000 lines and causes context thrash. `grep -n` for
what you need.
