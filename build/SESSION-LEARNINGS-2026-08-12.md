# Session learnings — 2026-08-12

> **Written to be read COLD, by someone who was not here.** Every section is self-contained and is
> structured to become **one Skill**. Nothing below is written from memory: each claim names the
> **committed evidence** (a pass folder, a file and section, or a commit hash) that supports it, and
> **where a claim cannot be evidenced it says so** rather than being asserted (Standing Rule 12).
>
> **Origin, USER DIRECTIVE (2026-08-12), verbatim:** *"record to yourself whatever you have learnt
> until today"* — and, on how to structure it: *"In future we have to convert this whole session into
> multiple Skills, one skill per session, so I want you to manage this session accordingly."*
>
> **Scope caveat, stated up front:** this file records **what this session learned**, drawn from the
> passes committed on 11–12 August 2026. It is **not** a status report on any project, and it does
> **not** restate the Standing Rules — it records the *incidents behind them*, which is the part that
> does not survive in a rule's headline. Where a lesson already **is** a Standing Rule, the rule
> number is given so the two never drift apart.

---

## HOW TO USE THIS FILE

| If you are about to… | Read section |
|---|---|
| write to TestRail, or trust that a write landed | **1 · Verification traps** |
| write any probe, selector or "is X present?" check | **2 · Probes that cannot fail** |
| set up state before measuring something | **3 · Our own instrumentation changing the measurement** |
| correct a label, or diff labels against a build | **4 · Reading the interface correctly** |
| decide what a case should expect | **5 · Source discipline** |
| write "blocked" or "waiting on" anywhere | **6 · Blockers** |
| commit, push, or resume after someone else worked | **7 · A shared, moving branch** |
| start a long batch, or recover from a dead one | **8 · Session survival** |

**The one-line through-line, and it is worth reading twice:** *almost every signal a pass naturally
trusts — its own memory, a clean git tree, an HTTP status, a timestamp, a liveness check, a selector
returning zero — lied at least once in these two days.* **The only things that did not lie were
committed records and live content read back.**

---

## 1 · VERIFICATION TRAPS — a passing check is not a correct outcome

### 1.1 🔑 The byte-check passes when the *payload* is wrong

**This is the most important item in the file, because it defeats the control we rely on most.**
Standing Rule 50 requires every TestRail write be re-read and byte-compared against the intended
payload. **That check proves the SERVER stored what we SENT. It says nothing about whether what we
sent was right.**

**Two instances, both today, both caught before execution — and neither by the byte-check:**

| # | What the payload would have written | Evidence |
|---|---|---|
| 1 | A re-stamp regex `Last checked against build [^\n]*?\.` was **non-greedy to the first `.`, which lands INSIDE the build marker `v3.5-65d6500`**, producing `…build v3.5-65d6500 on 8/12/2026.5-af3a6e1 on 8/11/2026.` | `build/schedule/build-viu-2026-08-12/CHANGES-MADE.md` |
| 2 | A stray full stop — `on 12 August 2026**.**; the wording above…` — on C30041, and a tripled blank line on C29929 | `build/schedule/finish2-2026-08-12/testrail-execution-log.md` |

Both were found by **printing the built payloads in a dry run and reading them**. The second file
states it exactly: *"would have passed the byte-check, because the payload itself was wrong."*

**A third instance predates this session and shows the same failure landing in production data:**
on 2026-08-06 a writer **appended** a second provenance line and a second marker to C30341 instead
of replacing them, because the case stored raw HTML and none of the plain-text patterns matched —
**and the byte-check PASSED, because the write was faithful to the payload**
(`build/report-suite/full-viu-2026-08-06/CHANGES-MADE.md`; also `build/APP-ACTIONS-PLAYBOOK.md` §J).

**⇒ THE PRACTICE, TWO PARTS:**
- **DRY-RUN AND READ THE BUILT PAYLOADS BEFORE SENDING.** Not the diff, not the count — the actual
  strings. This caught 3 of the 3 above.
- **MAKE THE WRITER REFUSE INPUT IT CANNOT HANDLE.** After the C30341 incident `rebuild()` was
  changed to **refuse outright** on any case containing raw markup. A writer that silently does the
  wrong thing on unexpected input will do it again.
- **AND ANCHOR REGEXES ON SOMETHING THAT CANNOT OCCUR INSIDE THE FIELD.** Trap 1 was fixed by
  anchoring on the trailing date (`build \S+ on \d{1,2}/\d{1,2}/\d{4}\.`) rather than on "the first
  full stop", because build markers contain full stops.

### 1.2 A fresh `updated_on` is not proof your write landed

On 2026-08-11 **three cases showed a fresh `updated_on` whose intended write never happened**
(`build/NO-WORK-LOSS-STRATEGY.md`, failure #6, citing `build/loss-audit-2026-08-11/VERDICT.md`). The
converse also holds: **TestRail re-renders text without moving the timestamp at all** — a sibling
pass found 14 Report Suite cases whose text changed while `updated_on` stood still.

**⇒ VERIFY BY CONTENT, NEVER BY TIMESTAMP — in both directions.** A timestamp is evidence of nothing.

### 1.3 An HTTP 500 (or 502) can come back from a write that succeeded

Recorded in `build/filters/verify-final-2026-08-12/RESUME.md` and demonstrated live today: a
transient **HTTP 502 `policy unavailable`** hit the pre-write snapshot READ for C30010; the batch
**stopped**, as Rule 50 requires, and C30010 was then **read back live and confirmed unwritten**
before the run resumed (`build/schedule/finish2-2026-08-12/testrail-execution-log.md`).

**⇒ NEVER BLIND-RETRY A FAILED WRITE. READ THE LIVE STATE FIRST.** A blind retry after a 500 that
actually landed writes over a landed change — and the byte-check will happily confirm the second one.

### 1.4 A resume can apply the same edit twice — and the guard that prevents it must be about the *content*, not about the *case*

`restamp.py` skipped any case already naming the running build but **exempted the note-carrying cases
from that skip** — correct on a first run, **wrong on a resume**. C29929 came back with its tester
note **duplicated**. It was found **by reconciling the operation count against the plan (39 writes
over 38 cases), not by chance**, and the skip condition was rewritten to test *"the note is already
present"* rather than *"this case is exempt"*
(`build/schedule/finish2-2026-08-12/testrail-execution-log.md`).

**⇒ TWO TRANSFERABLE RULES:** an idempotence guard tests **the content it is about to write**, never
a class of case; and **reconcile the op count against the plan at the end of every batch** — that,
not luck, is what caught it.

### 1.5 What a "0 changes" claim actually requires

The passes that made untouched-proofs stand up did them **by content and by id**: run 357 proven
untouched as *"176 tests, 529 results, 0 missing by id, 0 graded fields moved, 0 new, `case_id` sets
equal both ways, `include_all` still false"* (`build/schedule/finish5-2026-08-12/COMPLETION-REPORT.md`).

**⇒ SET EQUALITY IN BOTH DIRECTIONS, AND PRESENCE BY ID — never matching totals.** Two sets of the
same size can differ.

---

## 2 · PROBES THAT CANNOT FAIL — the defining discipline of this work

**More than forty false absences were caught in two days** —
`build/filters/finish4-2026-08-12/RUNNABILITY.md` states that figure and the reason it keeps this
discipline. **Individually-recorded batches include** Filters **eleven** in one pass
(`finish-2026-08-12/RUNNABILITY.md`), Report Suite **four**
(`data-preconditions-2026-08-12/RESUME.md`), Schedule **three** (`finish4`) and **four** (`finish5`).

**⚠️ THOSE PER-PASS FIGURES ARE NOT ADDED TO THE "more than forty" — the first three almost certainly
SIT INSIDE IT, and summing them would DOUBLE-COUNT.** Only `finish5`'s four are demonstrably later
than the pass that recorded the forty. **So the defensible statement is "more than forty over the two
days, plus four after that" — NOT a tidy total**, and this file will not invent one. *(This
correction is recorded rather than quietly applied, for the same reason CLAUDE.md keeps its own
433/331 arithmetic correction visible: a figure that fails its own gate is a finding.)*

**Not one of them was a product fault. Every single one was our own probe.**

### 2.1 The failure mode, in one sentence

**A selector that matches nothing returns an empty list, and an empty list reads exactly like
"the feature is absent."** The check reports a clean, confident negative and **cannot ever report a
positive**, so it is not a check at all.

### 2.2 The catalogue — every one of these was live, and each cost a run

| The probe said | What was actually true | Evidence |
|---|---|---|
| *"The status menu has no options"* / *"nothing is ticked"* | **Two different markups, one detector.** Status and Asset options are `q-checkbox` with `aria-checked`; **Customer, Lead Technician and Service Advisor are `q-item`/`role=listitem` with NO `aria-checked` at all** — selection appends a check glyph. An aria-only detector returned `[]` for every row | `build/filters/finish3-2026-08-12/RUNNABILITY.md` |
| *"The page search box doesn't exist"* | The toggle is **`page_search_toggle`**, not `page_search_button` | same |
| *"The Asset chip is missing"* | It is **`filter_chip_vehicleHere`**, not `filter_chip_vehicle` | `build/filters/finish4-2026-08-12/RUNNABILITY.md` §4 |
| *"The endpoint is broken (HTTP 400)"* | The Lead Technician field is **`tech_assigned_id`**, not `lead_technician_id`. **A wrong field name returns 400, which reads exactly like a broken endpoint** | same |
| *"Only 4 rows / only 1 row"* | **A bare `tbody` reports 1 row for an 18-row table**; `q-table` renders several tbodies and `[data-test-id^=table_]` is a **div**. Separately, `tbody tr` counted **4** rows for a status holding **1** work order and **2** on a page showing the empty state | `build/report-suite/finish-2026-08-12/RESUME.md`; `build/filters/finish4-2026-08-12/RUNNABILITY.md` §4 |
| *"The results didn't change"* | The desktop table is a **Quasar VIRTUAL SCROLL that RECYCLES rows** — a constant row count means recycling, not absence. Scroll `.q-table__middle.q-virtual-scroll`, never `window`; **compare work-order numbers, never counts** | `build/filters/finish4-2026-08-12/RUNNABILITY.md` §4 |
| *"Nothing is ticked"* (again) | **A leftover search term in the dropdown leaves only matching rows in the DOM**, so a tick count silently under-reports | same |
| *"Sorting is broken"* | A `header_*`-only sort probe **cannot fail on Work In Progress, which names no `header_*` test-ids**; and a sort probe that measured **0 rows** establishes nothing | `build/report-suite/finish-2026-08-12/RESUME.md` |
| *"No inventory or special-order parts exist"* | The probe sorted Parts Velocity by demand **ASCENDING** and read the 250 *lowest*-demand rows, all zero by construction. Descending: **9,933 + 470 = 10,403** | `build/report-suite/data-preconditions-2026-08-12/RESUME.md` §3 |
| *"No rep spans locations"* | The probe selected two locations; **the rep who spans locations spans a different pair.** Over all six, Viktoria Videnovic reads `location=Multiple` | same |
| *"No zero-time technician exists"* | The precondition is **a property of the RANGE**, not of the estate: over a year **39** technicians clocked time; over a 2-day window, **1** | same |
| *"This is a one-location organisation"* | **An unfiltered report call returns the ACTIVE WORKPLACE ONLY** — 245 rows, every one Heavy Duty | `build/report-suite/data-preconditions-2026-08-12/evidence/API-FACTS.md` |
| *"The bar has no chips"* | `ensureBarOpen` **probed one chip that is absent on the Estimates and Completed tabs**, and so **collapsed a bar that was already open** | commit `e882d1c6` |
| *"The batch is still running"* | **`pgrep -f` matched the watching shell's own command line** and returned *true* forever, while the batch had **silently never run** | `build/NO-WORK-LOSS-STRATEGY.md` #5; `build/report-suite/refs-pins-2026-08-11/FINDINGS.md` |
| *"The fetch failed — there's no version field"* | **Six Confluence pages genuinely have no in-body version field.** Absence of the field is the fact, not a failed read | `build/report-suite/read-dates-2026-08-11/SOURCE-CURRENCY.md` |

### 2.3 🔑 THE DISCIPLINE — three things, and the third is the one people skip

1. **STATE WHAT MAKES THE CURRENT STATE ONE WHERE THE THING *SHOULD* APPEAR.** *"I am on the tab
   that has this control, with data loaded, at this width."* Most false absences die here.
2. **RUN A CONTROL THAT PROVES THE DETECTOR CAN FIRE.** The canonical worked example: asked whether
   a long customer tag truncates, the pass measured a **185-character** seeded customer at three
   widths — the **tag** never truncated (`text-overflow: clip`, all 185 chars present) while the
   **bar chip** truncated at every width with `ellipsis` and a literal `...`. **The control fired**,
   so *"the tag does not truncate"* is **a measurement, not a failure to look**
   (`build/filters/finish4-2026-08-12/RUNNABILITY.md` §1).
3. **GRADE A PROBE THAT ERRORS AS `NOT_ESTABLISHED`, NEVER AS `ABSENT`.** The Report Suite
   data-precondition pass carried this as an explicit convention and used it five times — including
   `ABSENT_IN_SAMPLE` for *"an invoice number over 18 characters"*, where the length histogram made
   it look structurally impossible **but it was still only 100 rows of an unknown total**
   (`build/report-suite/data-preconditions-2026-08-12/RESUME.md` §2).

**A probe should carry its own guard.** One did: it emitted `check_could_fail: false`, and the pass
**recorded a failed check rather than a pass** (`build/filters/finish2-2026-08-12/RUNNABILITY.md`).

### 2.4 Why this matters more than it sounds

**A false absence does not look like a bug in the probe. It looks like a finding.** It is
well-formed, confidently negative, and it goes straight into a defect draft, a `HOLD` marker, or a
"this feature is not built" line. On a **final** branch it becomes a defect ticket against a working
product — which is the exact thing the QA lead has said *"badly bit"* him (Standing Rule 52's
2026-08-12 evidence bar).

---

## 3 · OUR OWN INSTRUMENTATION CHANGING THE THING BEING MEASURED

**Section 2 is about probes that see nothing. This is the nastier sibling: probes that see something
they created themselves.**

### 3.1 The preference scare — a persistence "defect" that was our own leftover state

While driving C29626 the saved filter preference **did not move** when a filter was applied, across
two different user actions. **Filter persistence is precisely where SV-8871 and SV-8905 live, and it
was the evening before a release** — so this had every quality of a serious find.

**It was ours.** From a **proven-clean baseline** (`filters: []`) the same action saved perfectly:
the preference gained the expected id and `updatedAt` moved. The earlier non-update came from
**state a previous probe of ours had left behind** — a preference already holding a value for the
very field being set. Full write-up: `build/filters/finish4-2026-08-12/RUNNABILITY.md` §3.

**Two things that pass did right and are worth copying:**
- It **did not report the defect**, and it **did not bury the residue either**: what remains honestly
  unresolved (whether re-applying a *different* value for an already-saved field persists) is
  recorded as **not established**, because the evidence for it was confounded by an erroneous click
  in the same sequence.
- It **re-ran from a proven-clean baseline** rather than reasoning about whether the state mattered.

### 3.2 The same shape, one day earlier, in the opposite direction

A pass **seeded a default workplace** to get past the app's `/no-location` redirect, then observed
work-order-number **links** working where a normally-signed-in session had faithfully seen plain
text. **Its own setup had created the evidence** — the shipped guard withholds the link from any user
whose `defaultWorkplace` is null. Caught before three cases were changed
(`build/report-suite/build-verify-2026-08-10/BUILD-VERIFICATION-2026-08-10.md` §4; the incident is
recorded in `CLAUDE.md` under the default-location convention).

### 3.3 🔑 THE LINE — and Standing Rule 14 draws it exactly

**Seeding the DATA a case needs is permitted and expected. MANUFACTURING THE CONDITION UNDER TEST is
not.** The second makes our own setup, rather than the build, the source of the result.

**⇒ THE PRACTICE:**
- **Establish and record the baseline BEFORE the action, not just the state after it.** A
  before/after pair is the minimum; a proven-clean baseline is better.
- **When a result surprises you in an area that already has open tickets, re-run from clean first.**
  The prior-probability that it is your own residue is high, and the cost of being wrong there is a
  false defect on a feature the team already knows is sensitive.
- **Name every environment mutation the pass made, in the pass's own record**, so the next reader can
  tell setup from finding.

---

## 4 · READING THE INTERFACE CORRECTLY

### 4.1 🔑 `textContent` versus the computed style — and **both** readings are needed

**The near-miss:** a `textContent`-only label sweep would have **"corrected" five Work In Progress
cases into wording no tester will ever see — on a FINAL report, hours before release.**

The tab labels carry `text-transform: capitalize`. **`textContent` gives
`Approved - partially completed`; the tester reads `Approved - Partially Completed`. Our cases said
the second, and they were right.** Evidence: `build/report-suite/build-viu-2026-08-12/FINDINGS.md`
§3 and its `LABEL-DIFF.md`.

**What makes this genuinely hard is that the OPPOSITE trap is also real and already recorded.** The
playbook's own Trap 1 says a **screenshot lies about casing** and the fix is to read `textContent`.
**This is the reverse case.** So:

> **NEITHER READING ALONE IS "THE LABEL". READ BOTH — the DOM string and the computed
> `text-transform` — and reconcile them before changing a single character.**

**A related trap:** the `text-transform` may sit on a **child** of the element you are measuring, so
the element itself computes `none` (`build/report-suite/finish-2026-08-12/RESUME.md`, trap 5).

### 4.2 The accessible name is not the visible label

*"A label diff must prefer the visible string over the accessible name, or it will certify the wrong
label with confidence"* (`build/schedule/build-viu-2026-08-11/LABEL-DIFF.md`). Live example: a
control whose **accessible name** is `Expand all customers` while the spec pins the **tooltip**
`"Expand all"` — and **the build shows no tooltip at all**. Accepting the accessible name would have
certified a label the tester never sees and hidden a real deviation
(`build/report-suite/label-vs-behaviour-2026-08-11/CLASSIFICATION.md`, C30128).

### 4.3 Punctuation inside quote marks is not a label mismatch

The same classification pass explicitly graded several rows as **checker artefacts**: *"the label
itself is on the build; the trailing full stop or comma is sentence punctuation the author put inside
the quote marks"* (rows 93–94, C30421). **A label differ must strip authorial punctuation or it
generates noise that buries its real hits.**

### 4.4 An error message can name a field that does not exist

Recorded during the Schedule shift-delete incident: the API's own validation error **named a field
that is not in the payload contract**
(`build/schedule/finish-2026-08-12/INCIDENT-shift-delete-2026-08-12.md`). **Do not reverse-engineer a
contract from an error string.**

---

## 5 · SOURCE DISCIPLINE — where an expectation may and may not come from

**Nothing in this section is new law; it is Standing Rules 9, 25, 31, 32, 57, 58 and 61. It is here
because the *incidents* are what make the rules stick.**

### 5.1 The build supplies the ROUTE. It never supplies the ASSERTION, and it never supplies the COVERAGE

The 2026-08-12 amendment to Standing Rule 9 splits this cleanly and the split is the thing to carry:

- **Preconditions · steps · navigation · labels** → **learned from the sources, then VERIFIED
  runnable against the build.**
- **Expected behaviour** → **from the documents only.** QA lead, verbatim: *"YES the expected behavior
  should come from the sources rather than the build."*
- **And the second guard, which is easier to breach without noticing:** *the build is the CHECK, never
  the AUTHOR.* **A pass that walks the build and writes down what it finds has let the product choose
  its own coverage** — producing a suite that passes handsomely and covers whatever was easiest to
  reach.

**Two live examples from today, both ours:**
- **C38926 (Schedule)** sent the tester to the roles-list three-dot menu to use `Reset to template`
  — **that menu offers only `View Permissions`**; the control lives on the role's own edit screen.
  **A tester would have been stuck on the very case that resets every role before permission
  testing** (`build/schedule/build-viu-2026-08-12/FINDINGS.md` §F2).
- **C43561 (Filters)** told the tester to *"open the **Sales Tax** report, choose the **Collected**
  tab"* — **a report and a tab in that shape the specification does not describe**; `S13-R19` names
  *"Sales Tax (Collected)"* as ONE surface. The case was `READY` and untested
  (`build/filters/build-viu-2026-08-12/CHANGES-MADE.md` §1).

### 5.2 🔑 The dangerous new edge: a substantive divergence "fixed" into a runnable step

Now that correcting steps against the build is **required**, a substantive divergence quietly
repaired into a runnable step **looks like diligent maintenance** — and the resulting case is
genuinely runnable, genuinely build-accurate, and passes every check except the one that matters:
**the source said something the build does not do, and now nothing records it.**

**THE TEST, ASKED EVERY TIME A STEP IS CORRECTED:** *would a reader of the source recognise what the
build offers as the same thing?* **Yes → cosmetic, correct it and log it. No → SUBSTANTIVE: record
both texts, mark `AUTOMATION: HOLD` with a "mark BLOCKED, not failed" line, and RAISE it.**

The Schedule and Filters passes both applied this test explicitly and by name
(`build/schedule/finish-2026-08-12/DIVERGENCES.md` opens with it), which is why their divergence
files are usable evidence rather than a list of edits.

### 5.3 A page's version number says nothing about a requirement's age

**The mirror image of the better-known trap.** A spec page republished yesterday can carry a
requirement untouched for five months. On 2026-08-06 two Filters cases (C29609, C29610) were flipped
off a PO ruling onto spec text, reasoning that *"the specification is the newer authoritative
source"* — measured from the **page's** publication date. The rule was then fetched from **ten spec
versions** and found **byte-identical in all ten, unchanged since 2026-05-14 — two and a half months
BEFORE the answer.** Latest-wins pointed the other way (`CLAUDE.md` Rule 31 trap (c);
`build/filters/vlad-gap-review-2026-08-06/ROOT-CAUSE.md`).

**⇒ TO DATE A REQUIREMENT, DIFF THAT REQUIREMENT'S OWN TEXT ACROSS VERSIONS.** It is one extra fetch
per version and it settled the case above in about two minutes.

**The same pass committed the other half of that defect: it overturned a recorded QA-lead ruling
without citing it**, deleting the very `refs` entry that named it. **The check that catches it: before
overriding a case, read what its OWN `refs` credits.**

### 5.4 A closed ticket is not a spec change; ticket status is not evidence about the build

Five evidenced failures of status-as-proxy are catalogued at Standing Rule 61 — including **a fix
that shipped while its ticket stayed Open** (SV-8851, C30050 now passes), **two tickets closed
OBSOLETE that still reproduce byte-identically** (SV-8843, SV-8847), and **a ticket that
mis-describes the very failure it exists to explain** (SV-8827).

**⇒ The expect-fail marker is an INSTRUCTION, not a prediction**: name the exact observable symptom
and all three outcomes, so the **next automated run** reports a shipped fix (outcome 3) or a
**changed** failure (outcome 2) at no cost. **Outcome 2 is the one that stops a NEW defect hiding
behind an old one.**

### 5.5 Confirm a source's own currency before relying on it — and again before you write

Chris Ward edited **all six** Report Suite specs mid-pass on 2026-08-05, one of them **a minute
before it was fetched**, and four of them **flipped the exact anchors the pass had cited**. Hence
Standing Rule 59's second currency check at write time. **The honest footnote is part of the lesson:**
our own first write-up of the related SV-8825 incident said the gap was *"28 minutes"* and **that was
wrong — a `-0500` timestamp read as UTC; the real gap was five and a half hours.** **Timestamps carry
offsets; convert them, do not eyeball them.**

---

## 6 · BLOCKERS — the short form of Standing Rule 68

**Recorded here because it was this session's most expensive single habit.** Full rule, evidence and
six requirements: **`CLAUDE.md` Standing Rule 68** (added 2026-08-12).

**The mistake:** across today's Filters work, **23 cases were reported as remaining and 14 were
classified "waiting on Branko" and treated as untouchable. They were not.** A missing PO write-up
leaves the **expected behaviour** unsourced; it does **not** stop us verifying that **a tester can
execute the preconditions and steps**. **Roughly 60% of a reported remainder was self-inflicted.**
Claim: `build/filters/finish4-2026-08-12/COMPLETION-REPORT.md` §7(a)+(b). Correction: commits
`e882d1c6` (the Status-chip four walked) and `b3e3aeb6` (all 14 Parts/Reports surfaces walked).
**Honest limit: those commits prove the surfaces were WALKED; the corrected per-case write-up was
still in flight when this was recorded, so nothing here claims the 14 are closed** — only that they
were never unwalkable.

**Two more of the same shape, the same day:**
- **A cost treated as a wall.** C29581 and C29588 need a staff record deactivated, which destroys
  every holder's session — **true, but that is a SEQUENCING problem**: do everything else first,
  commit, then make the edit last. The cost was being **avoided rather than scheduled**.
- **An ask that should never have reached the QA lead.** *"Three role assignments"* was escalated as
  the thing that would unblock ten Schedule cases, when Rules 5/14/26 already authorise doing it
  ourselves (`build/schedule/verify-final-2026-08-12/DIVERGENCES.md` §A). **The next pass attempted
  it and that is the instructive part** — it turned a vague ask into a precise one (*a role-definition
  edit invalidates every holder's session ONE WAY and does not come back when the permissions are
  restored; so create the users, permission them, and only THEN sign in and mint cookies*) — **and it
  cost the Technician session, because it was done before everything needing that session was
  finished** (`build/schedule/finish-2026-08-12/DIVERGENCES.md` §A).

**⇒ The two halves are not in tension: clear it yourself (requirement 3), and schedule the
destructive part LAST (requirement 4).** One instance breached (4) by never doing it; the other by
doing it first.

**The six requirements, in one line each:** name what the blocker actually blocks · prove it real AND
total · check it is not self-serviceable · a cost is a scheduling decision · state the residual
explicitly · escalate only what is truly his.

**Why it costs more than it looks:** a falsely-blocked case **looks like someone else's problem and
stops being worked**, then **migrates** — into a Rule-67 *"what is left"* row, into the outstanding
register, into an ask forwarded to a PO — **gathering authority at every hop while nobody re-tests
the premise.**

---

## 7 · WORKING ON A SHARED, MOVING BRANCH

### 7.1 A clean tree is not a current tree

On 2026-08-11 a checkout reported **`clean`** and **`1 ahead`** while it was **110 commits behind**
`origin`. A recovery pass then concluded **all six passes' work was lost** — false, and withdrawn
(`build/RECOVERY-2026-08-11/STATE.md`; `build/NO-WORK-LOSS-STRATEGY.md` R3).

**⇒ `git fetch` + `git merge --ff-only` AT THE START OF EVERY PASS.** Never trust the local tracking
ref or a clean status as evidence of currency.

### 7.2 Parallel workers share one git index — commit PATH-SCOPED

**A bare `git commit` takes the WHOLE INDEX, including another worker's staged files.** It has swept
a sibling's staged work **three times**. One documented instance: a worker staged correctly
path-scoped to `build/schedule/`, then committed with a bare `git commit -q -F /tmp/cm4.txt` and
**swept in nine files staged by the live Report Suite worker**
(`build/APP-ACTIONS-PLAYBOOK.md`; `build/NO-WORK-LOSS-STRATEGY.md` R7).

**⇒ `git add <explicit paths>` — never `-A`, never `.` — then `git commit -m "…" -- <paths>`, then
`git show --stat` to confirm what actually landed, then push the explicit SHA.** Note the asymmetry
the playbook records: **path-scoped `add` protects other people's files from you; only path-scoped
`commit` protects you from an un-scoped sibling.**

**Live during this very session:** a sibling committed `c82afbe8` between this worker's `git log` and
its own commit. The path-scoped commit landed cleanly on top and **swept nothing** — the mechanism
works.

### 7.3 A bug-fix deploy does not make a prior pass stale

Ruled 2026-08-12 (Standing Rule 60's bug-fix-deploy amendment). QA lead, verbatim: *"they are just
fixing the reported bugs … and not adding any functionality to the build, so that does not make your
previous pass as stale."*

**⇒ The re-check trigger is a SPECIFIC, OBSERVED CONTRADICTION — never a changed app-version string.**
Previously verified labels, routes, preconditions and steps **stay verified**, and their build stamps
stay honest records of a real check.

**The honest limit is part of the lesson: a marker cannot tell you which kind of deploy it was.** So
**do not pre-emptively discard a pass** — and where functionality demonstrably changed, Rule 60(b)
applies as written. **What this repairs:** reports saying *"only N of M rest on the build now
running"* as though the rest were worthless were **understating** the position.

### 7.4 Another author's work is hands-off, and the account is shared

Edits made under the shared account are **indistinguishable from ours in the changelog** — which is
why an unexplained field change is **read as someone's deliberate triage and asked about, never
reversed** (Standing Rule 53's corollary, earned by a `High → Low → High → Low` round trip on four
tickets). The same logic governs foreign test cases (Rule 38) and tickets other people convert.

---

## 8 · SESSION SURVIVAL

**Canonical document: `build/NO-WORK-LOSS-STRATEGY.md` — seven checkable requirements, each written
against a real 2026-08-11 failure, audited in `build/loss-audit-2026-08-11/VERDICT.md`.** Summarised
here only so this file stands alone.

| # | Requirement | The failure it was written against |
|---|---|---|
| **R1** | **The per-operation log is written BEFORE or AS each write, and is committed** | a pass wrote for ~40 minutes with no checkpoint; an oplog written at the end is worthless to a run that dies in the middle |
| **R2** | **Commit AND push every 25 write ops or 10 minutes of wall clock, whichever first** | *"regularly"* is exactly what the 40-minute silence was already doing |
| **R3** | **`git fetch` + `merge --ff-only` at pass start** | the 110-commits-behind checkout (§7.1) |
| **R4** | **Verification evidence is COMMITTED, never left in `/tmp`** | **the only thing actually lost on 2026-08-11** — the writes landed, the proof did not |
| **R5** | **Resume by re-establishing position from LIVE, by content** | a fresh `updated_on` is not proof; a 500 can follow a success; a liveness check is not progress |
| **R6** | **The pre-kill state save** — DONE · IN FLIGHT with its re-run recipe · AWAITING WHOM | a staged exact-string plan must be **REBUILT, not replayed** — a sibling may have moved its anchors |
| **R7** | **Path-scoped commits** | a bare commit has swept a sibling's staged work three times (§7.2) |

**The test that decides whether R1 is really being met:** *if this worker is killed right now, can the
next one find its exact position from **git alone**?*

**Proven again today.** `build/report-suite/data-preconditions-2026-08-12/RESUME.md` records six
facts (F33–F38) that *"ran at 14:02, minutes before the pass died, and their results existed only in
`/tmp`"* — **recovered because a later pass went looking, which is luck, not architecture.** And
`build/filters/finish5-2026-08-12` needed a dedicated recovery commit (`c82afbe8`) *"to commit the
orphaned probe output the container restart left uncommitted."* **`/tmp` loses evidence. Every time.**

---

## APPENDIX · THE PASS FOLDERS THIS FILE DRAWS ON

All committed on this branch. Listed so a cold reader can go to the primary source rather than trust
this summary.

| Project | Folders (2026-08-12 unless noted) |
|---|---|
| **Filters** | `build/filters/build-viu-2026-08-12` · `finish-` · `finish2-` · `finish3-` · `finish4-` · `finish5-` · `verify-final-` · (2026-08-06) `vlad-gap-review-2026-08-06` |
| **Schedule** | `build/schedule/build-viu-2026-08-12` · `drag-retry-` · `finish-` · `finish2-` · `finish3-` · `finish4-` · `finish5-` · `verify-final-` · (2026-08-11) `build-viu-2026-08-11`, `assertion-forensics-2026-08-11` |
| **Report Suite** | `build/report-suite/build-viu-2026-08-12` · `data-preconditions-` · `finish-` · `verify-final-` · (2026-08-11) `label-vs-behaviour-2026-08-11`, `read-dates-2026-08-11`, `refs-pins-2026-08-11`, (2026-08-10) `build-verify-2026-08-10` |
| **Cross-project** | `build/NO-WORK-LOSS-STRATEGY.md` · `build/APP-ACTIONS-PLAYBOOK.md` §J · `build/loss-audit-2026-08-11/VERDICT.md` · `build/RECOVERY-2026-08-11/STATE.md` · `build/rulings-2026-08-12/` |

---

## WHAT THIS FILE DOES **NOT** CLAIM

Stated explicitly, because a learnings document that hides its own gaps is the same failure it warns
about (Standing Rules 12 and 46).

1. **THERE IS NO SINGLE FALSE-ABSENCE TOTAL, AND §2 DELIBERATELY DOES NOT GIVE ONE.** The *"more than
   forty over two days"* figure is one pass's own count
   (`build/filters/finish4-2026-08-12/RUNNABILITY.md`); the per-pass figures quoted beside it
   (Filters 11, Report Suite 4, Schedule 3, Schedule 4) **are not additive** — the first three
   plausibly sit inside the forty. **No census was run and no de-duplication was attempted**, so the
   honest claim is an order of magnitude, not a count. **A first draft of this file summed them to
   "well over forty-five"; that was a double-count and it was corrected before commit.**
2. **The 14 Filters cases are NOT claimed to be closed** — only walked, on the evidence of two commit
   messages and their committed probe output (§6).
3. **Nothing here was re-verified live by this entry.** This is a **documentation pass**: zero
   TestRail calls, zero Jira calls, zero application access. Every factual claim is **as recorded by
   the pass that made it**, and inherits that pass's own caveats — including the ones those passes
   flagged as *not established*.
4. **No claim is made about any project's current completion state.** Those figures move within a
   single pass (Standing Rule 67(c)) and belong in a Rule-67 completion table derived live, not here.
