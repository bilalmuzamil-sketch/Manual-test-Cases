# 03 · RUN-CHECK — prove every precondition and every step can actually be executed on the build

> **🔴 READ [`00-COMMON-CORE.md`](00-COMMON-CORE.md) FIRST** — especially **§6 access mechanics**,
> **§7 environment** and **§11.2 the source of expected behaviour**. This file adds only what is
> specific to driving the build.

---

## PURPOSE, IN PLAIN ENGLISH

**Open the product and prove that a manual tester could actually run each case — every precondition
reachable, every screen present, every control where the step says it is, every label the one on
screen.**

**Nothing else.** This skill does not decide what a case should expect, and it does not write coverage.

The QA lead's own framing, verbatim (2026-08-12): *"if the steps of reproduction and preconditions are
not runnable as they differ from what is there in the build then the manual tester can not test that
test"*, and — the sharpened version, which is the operative one — *"steps of reproduction MUST be
verified from the build to 100% ensure that when manual tester would run the test he will be able to
run it."*

---

## TRIGGER PHRASES

> *"Check the cases run on the build for [project]"* · *"walk the steps for [project]"* ·
> *"are these cases runnable?"* · *"VIU the labels for [project]"* · *"build-verify [project]"* ·
> *"the branch has been rebuilt — re-check"* · *"can a tester pick this up tomorrow?"*

**Note on the word "VIU":** it historically meant the whole method end to end. **Since 2026-08-11 the
pass/fail verdict belongs to the manual tester** (core §1.6), so what remains ours is
**SOURCE-CHECK + RUN-CHECK + build-accurate wording**. Say that, rather than the word.

---

## KICKOFF PROMPT

```
Run RUN-CHECK for [PROJECT].

Cases in scope: [all N | the list at <path> | the ones never observed]
Build access: cookies for [branch], API host [sv<n>api.qa.shopview.com]
Is a sibling worker live on another branch? [yes -> never call quick-login/switch-user | no]
Roles/staff/settings edits authorised? [no | yes, and they are SCHEDULED LAST]
TestRail writes authorised? [none | update_case for label corrections]
```

---

# 🔑 THE RULE THIS SKILL TURNS ON: THE BUILD IS THE *CHECK*, NEVER THE *AUTHOR*

**The chain has three links and all three are mandatory:**

> **LEARNED FROM THE SOURCES → VERIFIED RUNNABLE ON THE BUILD → ANY DIVERGENCE RAISED TO THE QA LEAD**

**· ❌ NOT THIS:** observe the build, then write the steps to describe what it does. **That lets the
build AUTHOR OUR COVERAGE** — the same failure as taking an expectation from it, one layer down. A
case whose steps were written by watching the build **ends up testing whatever the build happens to
make easy, and it will look impeccable while doing it.**

**· ✅ THIS:** the steps come from **what the case exists to test**; **every one is then verified**
against the build so a tester can execute it.

**TWO GUARDS, protecting against OPPOSITE errors — both load-bearing:**
- **GUARD 1 — the build may not supply the EXPECTATION.** The clause *"for the steps of reproduction
  you can take them from the build"* is **exactly the sentence a future session could over-read into
  "take the expectation from the build too"** — the failure that cost **748 cases on 5 August 2026**.
  **The licence is scoped to the ROUTE — how you get there, what the screen is called, what the button
  says. It stops dead at the ASSERTION.**
- **GUARD 2 — the build may not supply the COVERAGE.** Steps are **verified** against the build, never
  **authored** from it. **This is the easier one to breach without noticing**, because the resulting
  case is genuinely runnable and reads as careful work.

**NEITHER MAY BE INVENTED.** His words cover both halves in one breath: *"Steps of reproduction should
not be the invented ones, neither the expected behaviors."* **AN INVENTED STEP IS WORSE THAN A MISSING
ONE, BECAUSE IT LOOKS RUNNABLE** and the tester only discovers otherwise with the case open in front
of them.

---

# THE RUNNABILITY TEST — five checks, and a reviewer may fail a case on any one

1. **IS THE PRECONDITION REACHABLE?** Does the data state exist, or can it be seeded (core §7.2)? **If
   genuinely unreachable, that is `AUTOMATION: HOLD` with a plain reason and a tester-facing "mark
   BLOCKED, not failed" line — NEVER a silent pass.**
2. **DOES THE NAVIGATION PATH EXIST?** Every screen, tab and menu the steps name.
3. **DOES EACH NAMED CONTROL EXIST WHERE THE STEP SAYS IT IS?** — **not merely somewhere on the page.
   A control two screens away is a FAILED check, not a near miss.**
4. **DO THE STEPS WORK IN THE ORDER WRITTEN?** **A step depending on a state no earlier step creates
   is NOT runnable**, however correct each line looks alone.
5. **ARE THE LABELS THE ONES ACTUALLY ON SCREEN?** — read **both** the DOM string and the computed
   style (§4 below).

**🎯 HIS STATED GOAL, AND IT IS THE ONE-LINE TEST OF THIS WHOLE SKILL (QA lead, 2026-08-12,
verbatim):** *"A tester should not find a step coming from mars (which does not exist)"* and *"we need
to make sure that the testers find a runnable test to execute."*
**⇒ SO: NO CASE MAY SEND A TESTER TO SOMETHING THAT DOES NOT EXIST.** It is either **CORRECTED**
(cosmetic) or **CLEARLY MARKED NOT RUNNABLE WITH THE REASON AND RAISED** (substantive). **Never left
silently broken, and never quietly rewritten into something the sources never asked for.**
**AND AN INVENTED STEP IS WORSE THAN A MISSING ONE, BECAUSE IT *LOOKS* RUNNABLE** — the tester only
discovers otherwise with the case open in front of them, and at that point they do not report a
defect, **they simply stop.**

**📊 THE REPORTING CONSEQUENCE — THE STANDARD IS 100%, AND THE COUNT IS NEVER ROUNDED UP.** His words
are *"verified from the build to 100%"*. **AN UNVERIFIED STEP IS AN UNVERIFIED CASE** — one unchecked
step disqualifies the whole case from the runnable count, **because that is the step the tester will
stop on**. The honest report is **how many cases had EVERY step verified** — not how many were
*"looked at"*, *"swept"*, *"covered by a label pass"* or *"expected to be fine"* — stated as **N of M,
on which build marker**. **A case whose steps were never checked is reported as exactly that**, never
folded into a total.

**Two live examples of failing check 2/3, both ours:**
- **C38926 (Schedule)** sent the tester to the roles-list three-dot menu to use `Reset to template` —
  **that menu offers only `View Permissions`**; the control lives on the role's own edit screen.
  **A tester would have been stranded on the very case that resets every role before permission
  testing.**
- **C43561 (Filters)** said *"open the **Sales Tax** report, choose the **Collected** tab"* — **a
  report and a tab in that shape the specification does not describe**; `S13-R19` names *"Sales Tax
  (Collected)"* as ONE surface. The case was marked `READY` and had never been run.

---

# 🔴 COSMETIC vs SUBSTANTIVE — getting this wrong is how a defect DISAPPEARS

### THE TEST, ASKED EVERY TIME A STEP IS CORRECTED

> ### *Would a reader of the SOURCE recognise what the BUILD offers as the same thing?*

**YES → COSMETIC.** A renamed control, a moved menu item, a changed label, the same route by a
slightly different path. **Correct it so the tester can run the case, and LOG it.** No escalation.

**NO → SUBSTANTIVE.** **The route or the state the source describes DOES NOT EXIST on the build, or
cannot be set up at all.** **NEVER SILENTLY REWRITTEN.** Instead:
- **RECORD IT AS A DIVERGENCE WITH BOTH TEXTS QUOTED** and the affected C-ids;
- give the case **the smallest change that stops a tester being stranded** — **and the smallest change
  is usually NOT a hold; read the next block before reaching for one**;
- **RAISE IT TO THE QA LEAD** (his words: *"If any precondition learned from the sources is not doable
  on the build should be raised to me"*) and log it in the outstanding register.

### 🛑 AND THE SMALLEST CHANGE IS RARELY `AUTOMATION: HOLD` — A HOLD ON A RUNNABLE CASE DISARMS IT

**This paragraph is a 2026-08-13 correction to this file, and the superseded wording is kept above,
dated.** It previously read *"normally `AUTOMATION: HOLD` with a plain reason and a 'mark BLOCKED, not
failed' line"* — **which is right only when the tester genuinely cannot execute the steps, and points
the wrong way in every other case.** `HOLD` tells the tester to mark the case **BLOCKED**, so **a hold
on a case whose steps DO run removes its ability to fail** exactly as surely as a build-derived
expectation does. **It simply looks like caution instead of like a mistake.**

**⇒ DECIDE ON THE STEPS, NOT ON HOW BADLY THE CASE LOOKS LIKE FAILING. Core §15.1a carries the full
four-row table and the worked examples; the short form:**

| The tester… | Marker |
|---|---|
| **cannot execute the steps** — route, screen or precondition genuinely absent | **`HOLD`** + *"mark BLOCKED, not failed"* |
| **can execute them; the build fails the requirement; a LIVE ticket describes it** | **`READY - EXPECT FAIL (SV-xxxx)`** + symptom + three outcomes |
| **can execute them; the build fails the requirement; NO live ticket** | **plain `READY`, and change nothing else** — the tester fails it and is right to |
| **can execute most of them; ONE step cannot be performed** | **plain `READY`** + a **verdict-free** note naming that step: *"mark that step blocked, record the rest normally"* |

**All three worked examples are live and from the day before a release**, and two of them are cases
where **a prepared hold was deliberately not applied**: **[C30107](https://shopview.testrail.io/index.php?/cases/view/30107)**
became `READY - EXPECT FAIL (SV-9074)` because a hold would have sent a requirement gap **on a report
handed off as FINAL** through the manual run unreported;
**[C38913](https://shopview.testrail.io/index.php?/cases/view/38913)** kept plain `READY` because
steps 1–7 and 9 all run and only step 8 cannot;
**[C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** was **not edited at all**.

### 🔥 THE DANGEROUS EDGE — and it is new

**Now that correcting steps against the build is REQUIRED, a substantive divergence quietly "fixed"
into a runnable step LOOKS LIKE DILIGENT MAINTENANCE.** The resulting case is genuinely runnable,
genuinely build-accurate, and passes every check except the one that matters: **the source said
something the build does not do, and now nothing anywhere records it.**

**It is the same shape as the 748-case failure, one layer down — and HARDER to spot**, because the
output reads as careful work.

**⚠️ AND A PRECONDITION THE SOURCES REQUIRE BUT THE BUILD CANNOT ACHIEVE IS VERY OFTEN EVIDENCE THAT
THE *BUILD* IS WRONG, NOT THE CASE.** Rewriting the case to match the build there **does not fix a
test — it DELETES THE FINDING**, and nobody downstream can tell it ever existed.

**⇒ THE DEFENCE IS THE CATEGORY QUESTION ABOVE, ASKED EVERY TIME** — never skipped because the fix was
obvious, and **never resolved in favour of cosmetic because substantive is more work or the release is
close.**

---

# 🔑 PROBES THAT CANNOT FAIL — the defining discipline of this work

**More than forty false absences were caught in two days. NOT ONE was a product fault. EVERY SINGLE
ONE was our own probe.**

### The failure mode, in one sentence

**A selector that matches nothing returns an empty list, and an empty list reads exactly like "the
feature is absent."** The check reports a clean, confident negative and **can never report a
positive**, so **it is not a check at all.**

### Why it matters more than it sounds

**A false absence does not look like a bug in the probe. It looks like a FINDING.** It is well-formed,
confidently negative, and it goes straight into a defect draft, a `HOLD` marker, or a *"this feature is
not built"* line. **On a final branch it becomes a defect ticket against a working product** — the exact
thing the QA lead says *"badly bit"* him.

### THE DISCIPLINE — three things, and the third is the one people skip

1. **STATE WHAT MAKES THE CURRENT STATE ONE WHERE THE THING *SHOULD* APPEAR.** *"I am on the tab that
   has this control, with data loaded, at this width."* **Most false absences die here.**
2. **🔑 RUN A CONTROL THAT PROVES THE DETECTOR CAN FIRE.** The canonical worked example: asked whether
   a long customer tag truncates, the pass measured a **185-character** seeded customer at three
   widths — the **tag** never truncated (`text-overflow: clip`, all 185 characters present) while the
   **bar chip** truncated at every width with `ellipsis` and a literal `...`. **The control fired**, so
   *"the tag does not truncate"* is **a measurement, not a failure to look.**
3. **GRADE A PROBE THAT ERRORS AS `NOT_ESTABLISHED`, NEVER AS `ABSENT`.** Use `ABSENT_IN_SAMPLE` where
   you looked at a sample — e.g. *"an invoice number over 18 characters"*, where a length histogram
   made it look structurally impossible **but it was still only 100 rows of an unknown total**.

**A probe should carry its own guard.** One did: it emitted `check_could_fail: false`, and the pass
**recorded a failed check rather than a pass.**

### THE CATALOGUE — every one was live, and each cost a run

| The probe said | What was actually true |
|---|---|
| *"The status menu has no options" / "nothing is ticked"* | **Two different markups, one detector.** Status and Asset options are `q-checkbox` with `aria-checked`; **Customer, Lead Technician and Service Advisor are `q-item`/`role=listitem` with NO `aria-checked` at all** — selection appends a check glyph. An aria-only detector returned `[]` for every row |
| *"The page search box doesn't exist"* | The toggle is **`page_search_toggle`**, not `page_search_button` |
| *"The Asset chip is missing"* | It is **`filter_chip_vehicleHere`**, not `filter_chip_vehicle` |
| *"The endpoint is broken (HTTP 400)"* | The Lead Technician field is **`tech_assigned_id`**, not `lead_technician_id`. **A wrong field name returns 400, which reads exactly like a broken endpoint** |
| *"Only 4 rows / only 1 row"* | **A bare `tbody` reports 1 row for an 18-row table** — `q-table` renders several tbodies and `[data-test-id^=table_]` is a **div**. Separately `tbody tr` counted **4** rows for a status holding **1** work order |
| *"The results didn't change"* | The desktop table is a **Quasar VIRTUAL SCROLL that RECYCLES rows** — a constant row count means recycling, not absence. **Scroll `.q-table__middle.q-virtual-scroll`, never `window`; compare work-order NUMBERS, never counts** |
| *"Nothing is ticked"* (again) | **A leftover search term in the dropdown leaves only matching rows in the DOM**, so a tick count silently under-reports |
| *"Sorting is broken"* | A `header_*`-only sort probe **cannot fail on Work In Progress, which names no `header_*` test-ids**; and a sort probe that measured **0 rows** establishes nothing |
| *"No inventory or special-order parts exist"* | The probe sorted by demand **ASCENDING** and read the 250 *lowest*-demand rows, all zero by construction. Descending: **9,933 + 470 = 10,403** |
| *"No rep spans locations"* | The probe selected two locations; **the rep who spans locations spans a different pair** |
| *"No zero-time technician exists"* | The precondition is **a property of the RANGE**, not of the estate: over a year **39** technicians clocked time; over a 2-day window, **1** |
| *"This is a one-location organisation"* | **An unfiltered report call returns the ACTIVE WORKPLACE ONLY** — 245 rows, every one Heavy Duty |
| *"The bar has no chips"* | `ensureBarOpen` **probed one chip that is absent on the Estimates and Completed tabs**, and so **collapsed a bar that was already open** |
| *"The batch is still running"* | **`pgrep -f` matched the watching shell's own command line** and returned *true* forever, while the batch had **silently never run** |
| *"The fetch failed — there's no version field"* | **Six Confluence pages genuinely have no in-body version field.** Absence of the field is the fact |

**And one more, different in kind:** **an API's own validation error NAMED A FIELD THAT IS NOT IN THE
PAYLOAD CONTRACT.** **Do not reverse-engineer a contract from an error string.**

---

# 🔑 RULE OUT YOUR OWN HARNESS — instrumentation that creates the evidence

**The section above is about probes that see nothing. This is the nastier sibling: probes that see
something they created themselves.**

**THE LINE: seeding the DATA a case needs is permitted and expected. MANUFACTURING THE CONDITION UNDER
TEST is not.** The second makes our own setup, rather than the build, the source of the result.

**Two proven instances, in opposite directions:**

- **A persistence "defect" that was our own leftover state.** While driving C29626 the saved filter
  preference **did not move** when a filter was applied, across two different user actions — in exactly
  the area where two open tickets live, **the evening before a release.** It had every quality of a
  serious find. **It was ours.** From a **proven-clean baseline** (`filters: []`) the same action saved
  perfectly. The earlier non-update came from **state a previous probe of ours had left behind** — a
  preference already holding a value for the very field being set.
- **A pass SEEDED a default workplace** to get past the `/no-location` redirect, then observed
  work-order **links** working where a normally-signed-in session had faithfully seen plain text. **Its
  own setup had created the evidence** — the shipped guard withholds the link from any user whose
  `defaultWorkplace` is null. Caught before three cases were changed.

**⇒ THE PRACTICE:**
- **Establish and record the BASELINE BEFORE the action, not just the state after it.** A before/after
  pair is the minimum; **a proven-clean baseline is better.**
- **When a result surprises you in an area that already has open tickets, RE-RUN FROM CLEAN FIRST.**
  The prior probability that it is your own residue is high, and **the cost of being wrong there is a
  false defect on a feature the team already knows is sensitive.**
- **NAME EVERY ENVIRONMENT MUTATION THE PASS MADE, in the pass's own record**, so the next reader can
  tell setup from finding.
- **Do not bury the residue either.** The persistence pass **did not report the defect** and **did not
  hide what remained unresolved** — whether re-applying a *different* value for an already-saved field
  persists is recorded as **not established**, because the evidence was confounded by an erroneous
  click in the same sequence. **Copy that.**

---

# 4 · READING THE INTERFACE CORRECTLY

### 4.1 🔑 `textContent` versus the computed style — and BOTH readings are needed

**THE NEAR-MISS:** a `textContent`-only label sweep would have **"corrected" five Work In Progress
cases into wording no tester will ever see — on a FINAL report, hours before release.**

The tab labels carry **`text-transform: capitalize`**. `textContent` gives
`Approved - partially completed`; **the tester reads `Approved - Partially Completed`. Our cases said
the second, and they were right.**

**What makes this genuinely hard is that the OPPOSITE trap is also real and already recorded:** the
playbook's own Trap 1 says **a screenshot lies about casing** and the fix is to read `textContent`.
**This is the reverse case.** So:

> **NEITHER READING ALONE IS "THE LABEL". READ BOTH — the DOM string and the computed
> `text-transform` — and RECONCILE THEM BEFORE CHANGING A SINGLE CHARACTER.**

**A related trap: the `text-transform` may sit on a CHILD of the element you are measuring**, so the
element itself computes `none`.

### 4.2 The accessible name is not the visible label

*"A label diff must prefer the visible string over the accessible name, or it will certify the wrong
label with confidence."* **Live example:** a control whose **accessible name** is
`Expand all customers` while the spec pins the **tooltip** `"Expand all"` — **and the build shows no
tooltip at all.** Accepting the accessible name would have certified a label the tester never sees
**and hidden a real deviation** (C30128).

### 4.3 Punctuation inside quote marks is not a label mismatch

Several rows were correctly graded **checker artefacts**: *"the label itself is on the build; the
trailing full stop or comma is sentence punctuation the author put inside the quote marks"* (C30421).
**A label differ must strip authorial punctuation, or it generates noise that buries its real hits.**

### 4.4 An error message can name a field that DOES NOT EXIST

Recorded during the Schedule shift-delete incident: **the API's own validation error named a field
that is not in the payload contract at all**
(`build/schedule/finish-2026-08-12/INCIDENT-shift-delete-2026-08-12.md`).

**⇒ DO NOT REVERSE-ENGINEER A CONTRACT FROM AN ERROR STRING.** An error tells you the request was
refused; **it is not documentation, and it is not a source** (Rule 57 — a build artefact never
supplies an expectation). Read the contract from the sources, or probe it deliberately and record
what each probe returned. **This pairs with the §2 catalogue entry where a wrong field name returned
HTTP 400 and read exactly like a broken endpoint** — in both directions, **the server's complaint is
evidence about the request, never about what the field should have been.**

---

# 5 · PERMISSIONS, ROLES AND DATA

### 5.1 🛑 FE blocks + BE/API allows = a PASS, not a defect (Rule 24)

Where a control is hidden or disabled in the UI for a role **but the same action still succeeds
through the API**, this is **EXPECTED BEHAVIOUR — NOT A DEFECT.** **The front-end gate IS the
tester-facing behaviour and is the pass criterion**; front-end-only enforcement is accepted product
policy — this matches the ShopView model, where granular permissions are largely front-end display
gates the backend does not independently enforce.

**⚠️ READ THAT AS A RULE ABOUT WHETHER IT IS A DEFECT, NOT ABOUT WHO GRADES IT — the two were one
sentence in Rule 24 because Rule 24 predates the 2026-08-11 re-scoping.** **Rule 24 decides *"is this
a bug?"*, and that is ours. *"Did it pass?"* is the tester's** (core §1.6, and G4 below). So this skill
**writes the tester-facing note and does not mark anything Passed**; the note is addressed to the
tester precisely because the grading is theirs.

**Such a case carries a plain tester-facing line:** *"Note for the tester: this action is only hidden
on the screen. If you find it can still be done another way (through the back-end/API), that is
expected — mark this test PASSED and do not raise it as a bug."*

**🔴 THE INVERSE IS NOT A PASS.** If the front end **EXPOSES** something it should not while the
backend blocks it, that is an **FE-exposure DEFECT** (e.g. a View-only user reaching an editable
Bulk-Receive screen, even though the actual write returns 403).

**And filing a Rule-24 pass as a defect is the literal definition of a ticket that "does not make
sense"** — an easy mistake to make from a network capture, and one of the eight things skill `06`
checks before anything is offered.

### 5.2 Reset roles to template FIRST (Rule 26) — and re-reset on drift

Before any permission-or-role-gated verification: **record the current permission set → reset to
template → record the post-reset set**. **The before→after diff is itself a finding** (which roles were
drifted or over-granted). **Verify each template default against the spec matrix and FLAG any role
whose template differs from spec.** **Leave the roles at template afterwards** — that corrected state
is the baseline every session sharing the org depends on.

**If a role RE-DRIFTS mid-test, reset it AGAIN and continue** — persistently, not a capped number of
retries. Only record a blocker if the reset itself fails, or drift recurs so fast that no observation
can complete even with immediate re-reset — and then document it precisely. *(A concurrent session was
observed actively re-drifting the Technician role mid-run.)*

**⚠️ AND SEE CORE §7.3: a role, staff-record or settings edit DESTROYS every holder's session, one
way. SCHEDULE IT LAST** — do everything needing the session first, commit, then make the edit. **The
correct order when new holders are needed: create the users, permission them, and only THEN sign in
and mint cookies — configure first, mint second.** Both failure directions have already happened in
one day: a cost **avoided rather than scheduled**, and an edit done **first** that cost a pass its
Technician session.

### 5.3 Seed, do not block (Rule 14)

Core §7.2 has the full playbook. The short form: **there is no such thing as "requires seeding data"**
— create the work order, pick the cored part, drive the invoice to void, create the purchase order and
delivery, create a fresh staff member. **Probe endpoints by POSTing an empty body and reading the
validation error** to learn the required fields. **Switch UI↔API** whichever way works. **Click by
element-centre coordinate** for Quasar.

**Only after all of that genuinely fails is it a blocker — and then it is fully characterised with
evidence (endpoint + status + requestId), never a bare "NOT VERIFIED".**

**AND LOGGING IN IS SELF-SERVICE TOO (§8.2, Standing Rule 74).** A case that needs a SECOND / DIFFERENT
/ role-specific login is **NOT** a blocker: **log in as whatever user or role it needs** — create a
fresh staff per role and self-login, `switch-user` impersonate, or `quick-login`. The only limit is
**do not disturb a live sibling** (G3 / core §6) — sequence the work, or use a separate browser context
/ a fresh staff login. **Never leave a case un-verified for want of a login.**

---

# 6 · WHEN A DEPLOY DOES AND DOES NOT INVALIDATE A PASS

### 6.1 A BUG-FIX deploy does NOT make a prior pass stale

QA lead, verbatim (2026-08-12): *"they are just fixing the reported bugs … and not adding any
functionality to the build, so that does not make your previous pass as stale."*

**⇒ THE RE-CHECK TRIGGER IS A SPECIFIC, OBSERVED CONTRADICTION — NEVER A CHANGED APP-VERSION STRING.**
Previously verified labels, routes, preconditions and steps **stay verified**, and their build stamps
stay honest records of a real check.

**The honest limit is part of the lesson: a marker cannot tell you which kind of deploy it was.** So
**do not pre-emptively discard a pass** — and **where functionality demonstrably changed, the affected
cases ARE owed** and must be re-checked.

**What this repairs:** reports saying *"only N of M rest on the build now running"* as though the rest
were worthless were **understating** the position — which is the opposite of the point, even though it
errs in the "safe" direction.

### 6.2 What a functional deploy really does invalidate — three layers

Only these go stale when the build genuinely moves:
1. **The on-screen labels and the navigation path.**
2. **The pass / fail / deviation verdict.**
3. **The markers that assert a BUILD FACT** — `READY - EXPECT FAIL (SV-xxxx)` and `HOLD - <not built>`.
   **⚠️ Plain `AUTOMATION: READY` asserts that a case is AUTOMATABLE, not that it currently passes — it
   is BUILD-INDEPENDENT and survives a redeploy untouched.**

**Everything else — the expectation, the requirement anchor, the spec version, the epic reference, the
traceability, the provenance line's SOURCE sentence — is build-independent**, because expectations
come from documents.

**And a stale expect-fail marker is now detected BY THE SUITE ITSELF** (§6.3), not by re-observation.

**⛔ NEVER LET "the branch is not final" BECOME A BLANKET CAVEAT.** A caveat applied to everything
tells the reader nothing. **Say exactly which cases were observed, on WHICH BUILD MARKER, and how many
were not — numbers, not a banner.**

**⚠️ AND ON THESE THREE PROJECTS THAT CAVEAT IS NOW SIMPLY WRONG — ALL THREE BRANCHES ARE FINAL.** QA
lead, 2026-08-11, verbatim: ***"The Branches are Final now."*** (Schedule `sv8685`, Filters `sv8785`
and the Report Suite `sv8582`, the last after *"note that ALL 6 reports have been handed off now."*).
**SO A DEVIATION FOUND BY THIS SKILL IS A REAL DEFECT IN A FINISHED FEATURE, NOT A POSSIBLY-UNFINISHED
FEATURE** — and **a hedge that was correct last week now UNDERSTATES a real finding.** **"Final" still
means HANDED OFF, NOT frozen**: the branches redeploy, not least to fix the very defects we report, so
layers 1–2 above still go stale on a **functional** deploy — while §6.1 governs a bug-fix-only one.
Full text: core §16.

### 6.3 A regression IS possible in a case we already passed — say so

**SCH-DND-08 = [C29962](https://shopview.testrail.io/index.php?/cases/view/29962)'s click-to-arm
alternative to dragging was REMOVED between two builds** — zero controls carried it anywhere, though
it had been proven built days earlier (`button_sidebar_arm_<woId>`, `aria-pressed`). **Its absence was
also why seven further cases could not be re-driven**, the drag not completing through our tooling and
the click route no longer existing.

**And note what did NOT tell us:** **seven cases stopped being failures** because their defects were
fixed — while **every one of those tickets was still Open or Ready to Fix in Jira.** **Ticket status is
never read as evidence about the build** (core §11.2).

**⇒ That is why an EXPECT-FAIL case must name its SYMPTOM and all three outcomes**, so the next
automated run reports a shipped fix or a **changed** failure at no cost:

> *"What you should see today: `<the exact symptom, in plain words>`. This is a known problem and it is
> already reported — see `https://shopview.atlassian.net/browse/SV-xxxx`.*
> *· If you see exactly that, mark this test FAILED and do not raise anything new.*
> *· If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please report
> it.*
> *· If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note
> removed."*

**Outcome 3 makes the automated run itself the detector. Outcome 2 is what stops a NEW defect hiding
behind an old one** — *"it failed, as expected"* reads identically either way without it.

### 6.4 🔑 THE AUTOMATED-CASE HAND-OFF — ask before, correct the marker on success, tell Vlad (Standing Rules 71 / 65, added 2026-08-17/18)

**This skill is the one that BUILD-VERIFIES, so it is where a Rule-69 `Not available on Build to test
Yet` case earns its lift — and where the Automated-case duties bite.**

- **ASK FIRST (core §5.4, Rule 71).** A case whose `custom_atmstatus = 3` ("Automated") is **ask-first
  for ANY change, even our own.** Before correcting a label or lifting a marker on such a case, **STOP
  and get the QA lead's permission** (per case or per batch). **Read the flag LIVE** — it moves.
- **ON SUCCESS, LIFT THE MARKER TO `AUTOMATION: READY`.** When build verification proves the case's
  **steps and preconditions actually run on the build**, its plain-text marker is corrected from
  `AUTOMATION: Not available on Build to test Yet - Last checked <date>` (or from a now-runnable HOLD)
  to **`AUTOMATION: READY`** — or to `READY - EXPECT FAIL (SV-xxxx)` on a live-backed ticketed failure
  (§ above).
- **THEN SHARE THE CASE NUMBER WITH VLADIMIR TOMOVIC (id 1)** so he adjusts his automations. **The
  standing hand-off list is `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`**
  — the durable artifact, in addition to this pass's "AUTOMATED CASES CHANGED — FOR VLAD" section
  (core §5.3, step 11).

**⇒ EDIT AND BUILD-VERIFY TOGETHER — THIS SKILL IS WHERE AN AUTOMATED CASE IS ALLOWED TO CHANGE AT ALL
(Standing Rule 71 refinement, 2026-08-18, QA-lead confirmed).** An Automated case (`custom_atmstatus =
3`) **MAY genuinely need its steps of reproduction, preconditions and expected behaviour updated** to
match the current sources — Rule 71 is **not** "never touch it". But it is **edited ONLY when we can
also build-verify it in the same pass**, so the steps/preconditions produced are **confirmed runnable
on the build before they reach anyone.** **Editing and build-verifying an Automated case happen
TOGETHER, never separately — and this skill is the coupling.**
- **WHY (the whole point):** an Automated case is the **contract Vlad's automation runs against.**
  Editing it WITHOUT build-verifying hands Vlad a **moving, unverified target** — steps that may not
  actually run — so he rebuilds his automation to match them, and **if they are not runnable his work
  breaks and must be redone.** Coupling the edit with build verification means Vlad only ever receives
  **real, runnable, confirmed** steps and adjusts **once, correctly.**
- **CONSEQUENCE for the OTHER skills:** while build verification is deferred (feature not yet on the
  build), an authoring / currency pass **does NOT edit Automated cases — it HOLDS them and lists them
  for permission** (skill `01`, G10). The actual edit is **BATCHED INTO THIS BUILD-VERIFY PASS**: make
  the steps/preconditions build-accurate and runnable, **verify LIVE**, set the correct marker
  (`READY` on success, or `READY - EXPECT FAIL (SV-xxxx)` on a live-backed known bug), then hand the
  case number to Vlad via the register.
- **ASK-FIRST STILL GATES IT:** even coupled with build verification, **get the QA lead's go-ahead
  before editing an Automated case** (per case or per batch, above).

**⇒ COROLLARY — THIS SKILL SETS OR LIFTS A MARKER FROM LIVE VERIFICATION OF CONTENT, NEVER FROM A
METADATA REFRESH (Standing Rule 69, dated refinement 2026-08-18).** A marker moves here because the
build was **observed** to run (or fail) the case's steps and preconditions — never because a provenance
line, spec version or `refs` was re-stamped. The mirror image also holds: a documents-only currency or
authoring pass that only refreshes provenance / refs / version / date on an otherwise-unchanged case
**leaves its marker alone** (skill `01` G13, skill `02` G8). So the deferred `Not available on Build to
test Yet` marker is set only where the build genuinely could not verify the case, and it is lifted to
`READY` (or `READY - EXPECT FAIL (SV-xxxx)` on a live-backed failure) only from live verification here —
never from a metadata refresh elsewhere.

**⇒ METADATA-ONLY CORRECTION vs CONTENT EDIT — UNDOING OUR OWN METADATA ERROR IS A PERMITTED CORRECTION,
NOT A CONTENT EDIT (Standing Rule 71, dated addition 2026-08-18, QA-lead confirmed).** The
edit-and-build-verify coupling above governs a **CONTENT edit** — changing an Automated case's testable
content (title, preconditions, steps, expected BODY). It does **NOT** govern **correcting our OWN
erroneous metadata-only change**: e.g. reverting a marker we wrongly applied on an Automated case whose
**testable content is UNTOUCHED**. That correction **RESTORES the case (and Vlad's expected state)**,
does **not** touch what Vlad's automation runs against, and is therefore **PERMITTED without build-verify
coupling** — but **ask-first still applies** (get the QA lead's go-ahead first). *The scar: 27 Automated
cases had the deferred marker wrongly applied on a metadata-only re-stamp; the QA lead authorised
reverting their markers because content was untouched — a correction, not a content edit.* Ties to Rules
38, 69 (content-vs-metadata), 71 (build-verify coupling for CONTENT) and §6.4's Vlad hand-off.

**⇒ 2026-08-20 REFINEMENT — WHEN AN AUTOMATED CASE IS UPDATED, AND THE MANDATORY "FOR VLAD" HAND-OFF
(Standing Rule 71 dated refinement, QA lead).** Verbatim: *"they need to be changed ONLY if they are
build verified and something in their title/preconditions/steps of reproduction/Epected behavior changed
- If yes then we need to also update them with the sources references so that those changes do not bite
me and then I have to share the test case numbers with Vlad ... any test cases which we update/create and
that goes to Vlad and his automation fails we will be blamed for that and it will bite us."*
- **UPDATE an Automated case (`custom_atmstatus = 3`) ONLY IF BOTH: (a) it is build-verified in this
  pass, AND (b) something in its Title / Preconditions / Steps / Expected genuinely changed.** If
  build-verified and its content is unchanged → **LEAVE IT, do not churn it.**
- **Any Automated case we update — and ANY case (new or updated) that reaches Vlad's automation — MUST
  carry its SOURCE REFERENCES** (Rule 20: `<ticket> (<spec/design anchor>)`) so the change is traceable
  and does not bite us.
- **THE "FOR VLAD" HAND-OFF IS A REQUIRED DELIVERABLE of any pass that touches Automated cases:** per
  case, the **C-id + exactly what changed (which field) + the source reference** — in this pass's
  "AUTOMATED CASES CHANGED — FOR VLAD" section (core §5.3, step 11) **and** the standing register
  `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.
- **WHY:** Vlad is very critical of test-case failures; **any change that reaches his automation and
  breaks it is blamed on us.** A change is communicated with its source reference, or it is not made.

---

# 7 · PROJECT WHOSE FEATURES ARE NOT YET COMPLETE (Standing Rule 69, dated addition 2026-08-18)

**QA lead, verbatim (2026-08-18): *"save it in your skills and rules about how to treat the test cases
for a project whose features are not yet complete."*** This is the state the **upcoming SCHEDULE
build-verification** will use — Schedule is now on staging and some of its features may not be built —
and it applies to **any future project in the same state.** It is exactly how the Report Suite SBC/SBR
build-verify passes already treated similar cases.

### 7.1 🔑 BUILD-VERIFY IS A PROJECT-LEVEL STATE, AND LIVE OBSERVATION — NOT JIRA STORY STATUS — IS THE ARBITER

**When a project's build is on staging but some features are still under development, you STILL
build-verify EVERY case by LIVE OBSERVATION.** **Do NOT gate on Jira story status.** Devs frequently
leave a story `Open` while the feature is in fact **built**; and a feature you **cannot find** in the
build is treated as **not-yet-developed** — even if its story is closed. **The build is the arbiter of
what exists; the ticket never is** (core §11.2, §6.2 layers 1–2). This is the same discipline as §2
above: **prove the detector can fire before you conclude a feature is absent** — a false absence here
becomes a wrong *"not developed"* verdict.

### 7.2 THE PER-CASE DECISION TABLE

| What live observation shows | Marker & action |
|---|---|
| **Feature PRESENT + case runs / passes** | **`AUTOMATION: READY`.** Correct cosmetic label/route drift so the case is build-accurate (§ cosmetic-vs-substantive). Add / refresh Rule-54 **sentence 2** *"Last checked against build `<marker>` on `<date>`."* (sentence 1 stays documents-only). |
| **Feature PRESENT + genuine deviation, backed by a LIVE OPEN ticket** | **`AUTOMATION: READY - EXPECT FAIL (SV-xxxx)`** with the §6.3 symptom + three-outcome block. |
| **Feature PRESENT + genuine deviation, NO live-backed ticket** (closed / obsolete / none) | **Flag the defect in `FINDINGS.md` with live evidence + a recommendation. FILE NO Jira ticket** (creation is on the QA lead's hold — skill `06` / core §11.1). Set the case to **plain `AUTOMATION: READY`** — a stale EXPECT-FAIL marker has no live backing (§ above / core §15.1). |
| **Feature NOT FOUND in the build** | **NOT-YET-DEVELOPED — neither fail nor pass; EVIDENCE OF ABSENCE, recorded** (never inferred; a "not found" counts only if a probe that *could* fire found nothing — §2). **KEEP** the `AUTOMATION: Not available on Build to test Yet` marker, **update its date to the day checked**, add the under-development line below (7.3), and **log the case to `DEFERRED-RUN.md`** (7.4). |

**Automated cases (`custom_atmstatus = 3`) are HELD, not written, during any such pass (§5.4, §6.4,
Rule 71).** Verify them live, record the intended change, and put it to the QA lead for ask-first
ratification — the edit is **batched into the coupled build-verify pass** (§6.4), never made on a
documents-only run.

**Marker discipline is unchanged (§6.4 corollary):** the deferred marker substitutes for a **plain
`AUTOMATION: READY`** marker **ONLY** — it never overwrites an existing `READY - EXPECT FAIL (SV-xxxx)`
or `HOLD` marker; and a **metadata-only re-stamp keeps the existing marker.**

### 7.3 THE EXACT UNDER-DEVELOPMENT LINE (feature not found in the build)

For a case whose feature is not in the build, add — **BELOW the sources, after a line break** — this
tester-facing line, generalising the date and keeping the wording:

> *"This test case could not be build-verified on `<M/D/YYYY>` because the feature it tests was not
> found in the build yet — the related story is still under development. It will be re-checked in the
> separate build-verification run once the feature ships."*

The `AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>` marker still goes **LAST**
(after the Rule-54 provenance line, blank line before and after).

### 7.4 THE SEPARATE DEFERRED BUILD-VERIFICATION RUN LIST — `DEFERRED-RUN.md`, NOT A TESTRAIL RUN

Log every "feature not found" case to a **local `DEFERRED-RUN.md` in this pass's folder** — one row per
case (internal ID + C-id + link, the feature/story it waits on, the date last checked, the build
marker). **It is a local list, NOT a new TestRail run object.** These cases are **re-checked when
staging redeploys or the devs confirm the feature shipped** — **the standing re-check trigger for this
population is THE FEATURE SHIPPING, not a redeploy alone** (§6.1, core §16 Rule 49). On that later run
the marker is lifted to `READY` (or `READY - EXPECT FAIL (SV-xxxx)` on a live-backed failure) via the
§6.4 hand-off, and Automated cases are ratified with Vlad.

**Ties:** core §11.1 (the ticket-creation hold — nothing filed), core §16 / Rule 49 (the re-check
queue), Rule 54 (sentence 2 records the build actually checked), Rule 57 (the expectation still comes
from the documents whatever the build's readiness), Rule 60 (build-verified vs not; live observation
over story status), Rule 61 (the marker family; a stale expect-fail has no backing), Rule 69 (the
deferred marker + substitution/metadata rules), Rule 71 (Automated cases held). Recorded at the tail of
Standing Rule 69 in `CLAUDE.md`.

---

# 8 · 🔴 NO PRESENT FEATURE IS LEFT UN-BUILD-VERIFIED — SEED AND LOG IN AS NEEDED (Standing Rule 74, 2026-08-19)

**QA lead, verbatim (2026-08-19): *"why would you skip build verifying any case … specially when I have
told you how critically we need all the tests build verified. also, I told you not to block yourself
for data seeding issues and seed data the way you want in staging and QA branches because those are all
test accounts/branches. also for multi log in blocked test cases again login as needed and dont get
yourself blocked at all. there should not be such big negative surprises that fails me and get me
bitten for not getting the test cases Runnable for the QA testers."***

**THE ONE-LINE STANDARD: on a build that is on staging/QA, the ONLY acceptable un-build-verified case
is one whose FEATURE IS GENUINELY ABSENT from the build (§7 / Rule 69). A data-state or a login is
NEVER the reason a case is skipped.**

### 8.1 INDIVIDUAL AND EXHAUSTIVE — "the area is present" is not "the case is verified"

**Every case whose feature is present is DRIVEN LIVE and RE-STAMPED (Rule 54 sentence 2), one at a
time (core §2 / Rule 50 Part 1).** Confirming a report or a screen exists tells you nothing about
whether each of its cases runs. **"Present but not individually re-stamped" is UNFINISHED WORK — it is
never reported as a completed pass.** The honest count is **how many cases had EVERY step verified**,
as **N of M on which build marker** — never *"swept"*, *"covered by a label pass"*, or *"expected to be
fine"* (§ THE RUNNABILITY TEST, reporting consequence).

### 8.2 A DATA-STATE OR A LOGIN IS NEVER A BLOCKER — SEED IT, LOG IN AS THE ROLE

**Staging and the QA branches are disposable TEST accounts/branches (core §7.1, Rule 6), so both of
these are self-service (§5.3, core §7.2, Rule 14) and NEVER a skip reason:**
- **SEED any data-state** — WOs, lines, cored parts, invoices in any state, multi-state records, POs,
  deliveries, roles. His words: *"seed data the way you want."*
- **LOG IN AS WHATEVER USER / ROLE THE CASE NEEDS** to observe role / permission / second-user
  behaviour — **create a fresh staff per role and self-login, OR `switch-user` impersonate, OR
  `quick-login`.** His words: *"for multi log in blocked test cases again login as needed and dont get
  yourself blocked at all."*

**⚠️ THIS REFINES G3 / core §6 — the constraint is "DON'T DISTURB A LIVE SIBLING", NOT "DON'T LOG IN".**
The earlier *"never call `quick-login`/`switch-user`"* caution and the *"accept an honest N-of-M when a
second sign-in is needed"* stance are **SUPERSEDED where they would cause a SKIP.** The safeguard is
kept: **do not rotate a session another of OUR OWN concurrent workers is actively using** — sequence
the multi-login work, or use a **SEPARATE BROWSER CONTEXT / a FRESH STAFF LOGIN**, so a sibling is not
disturbed — **but that safeguard may NEVER become the excuse to skip a case.** If no sibling is live,
log in freely.

### 8.2a MULTI-LOGIN STANDARD PRACTICE — the Technician-role-swap method (PREFERRED)

**For any case needing a DIFFERENT role / login** (permission cases, role-negatives, second-user
behaviour), the **preferred, recorded standard** is to swap the role on the **Technician quick-login
user** rather than create a new user. QA lead's directive, 2026-08-19, verbatim: *"instead of creating
a new user assign a different role (as needed) to technician quick log-in and use it. before applying a
role to the technician quick log-in make sure to reset that role to default and save the changes and
then apply that role to technician. once you are done with All the testing, make sure you apply
technician role again to the technician."* **The five steps, in order:**
1. **DO NOT create a new user** — use the Technician quick-login user and swap its role.
2. **RESET the needed role to its template/default and SAVE the change FIRST** (Rule 26 — guarantees
   spec-default perms, not drift, before the role is applied).
3. **ASSIGN that reset-to-template role to the Technician quick-login user.**
4. **RUN the test as the Technician quick-login user** — observe live with evidence (Rules 12/13).
5. **AFTER ALL testing is complete, RESTORE the Technician ROLE back to the Technician user** — Tech
   ends on "Technician".

**`switch-user` impersonation of an existing role-holder is an acceptable SIMPLER FALLBACK**, but the
Technician-role-swap above (reset-to-template first, restore Tech after) is preferred. On the shared
staging org, **re-read the role live before asserting and re-reset if a concurrent actor drifts it
mid-run** (Rule 26a). Concrete ids + endpoints: `build/APP-ACTIONS-PLAYBOOK.md` §G ("STAGING ACTION
RECIPE: multi-login via Technician role-swap"). **This is part of the §8.5 gate: a multi-login case is
not "done" until step 5 has restored Tech to the Technician role — never report a pass complete with
Tech left on a swapped role.**

### 8.3 HARNESS LIMIT ≠ UN-RUNNABLE

If OUR harness cannot perform a gesture (e.g. a mouse drag — see §6.3, C29962) but a **MANUAL QA can**,
the case stays **plain `AUTOMATION: READY`** and build-accurate. **Record our own auto-observation
limit SEPARATELY** (in `RUNNABILITY.md` / `FINDINGS.md`), but **never present a harness limit as "not
runnable" and never leave the case un-verified for it.** Correct its labels/steps from the build so the
tester can run it (§4, Rule 9).

### 8.4 THE ONLY PERMITTED UN-VERIFIED STATE — genuine feature absence (§7 / Rule 69)

A case ends un-verified ONLY when live observation shows its **feature is not in the build** (§7.2 row
4): keep the `AUTOMATION: Not available on Build to test Yet` marker, add the under-development line
(§7.3), log it to `DEFERRED-RUN.md` (§7.4). **Absence is a MEASUREMENT, not an inference** — prove the
detector could fire first (§2). A data-state or a login is not feature absence.

### 8.5 🛑 THE HARD CHECKLIST GATE — before reporting a build-verify pass complete

**CONFIRM 0 CASES WERE SKIPPED FOR DATA-SEEDING OR LOGIN REASONS.** State it explicitly in the pass's
`FINDINGS.md`. If any were skipped for those reasons, **the pass is NOT complete** — seed the data, log
in as needed, and finish them. A case may remain un-verified ONLY under §8.4 (genuine feature absence).
**The goal is the QA lead's stated one: every delivered case RUNNABLE by a non-technical manual QA, no
negative surprises** — because a case left non-runnable for the testers is the surprise that bites him
publicly (Rules 7/9/28).

**RATIONALE, 2026-08-19:** a Report Suite build-verify left **157 cases "present but not individually
re-stamped"** plus **~30 on `HOLD` for a second sign-in or an "unseedable" data-state** — the product
of an over-cautious orchestration instruction (no `quick-login`/`switch-user`; accept an honest N-of-M
for data/login). On a disposable env there is no un-seedable data-state and no un-obtainable login, so
neither was ever a legitimate blocker. **Ties:** core §6 (access; the sibling constraint), core §7.1/7.2
(disposable env; seed rather than block), Rules 5/6/14/22/26/49/50/60/69 and 7/9/28. Recorded as
Standing Rule 74 in `CLAUDE.md`.

---

# THE STEPS

1. **Core §0 pass-start checklist**, then **record the BUILD MARKER**: `<meta name="app-version">`,
   `last-modified`, `etag`, UTC time. **Read it again at the end** and state whether it moved. *(A
   pass proved `index.html` byte-identical by sha256 at three separate reads, so nothing redeployed
   under it — that is the shape of the claim.)*
2. **Establish the session** — core §6. **Probe the `…api.` host. LOG IN AS WHATEVER USER / ROLE THE
   CASES NEED (§8.2, Rule 74)** — fresh staff per role, `switch-user`, or `quick-login`. The only limit
   is **do not disturb a live sibling** (sequence the work, or use a separate browser context / fresh
   staff login). **A login is never a reason a case goes unobserved.**
3. **Take the source position from skill `02`.** Expectations are not yours to decide here.
4. **Reset roles to template** if any case is permission-gated (§5.2) — and **schedule any destructive
   edit LAST** (core §7.3).
5. **Walk each case: the five runnability checks.** For every check, **state what makes the current
   state one where the thing should appear, and run a control that proves the detector can fire.**
6. **Classify every difference COSMETIC or SUBSTANTIVE**, using the recognition test. Correct the
   cosmetic ones; **record and raise the substantive ones.**
7. **Correct labels only after reading BOTH the DOM string and the computed style** (§4.1).
8. **Write `DIVERGENCES.md` — even if it is empty** (see below).
9. **Push label corrections only if authorised** (core §2 — all three text fields, byte-check, stop on
   mismatch, dry-run and read the payloads). **Re-stamp the provenance line's sentence 2** with the
   build actually observed, per case, honestly.
10. **🔑 RUN THE POST-WRITE ASSERTION RE-AUDIT** (core §2.10) over **only the cases this pass materially
    changed** — quote each new assertion back to its cited source, check it is reachable by the case's
    own steps, check the content belongs to **this** case, and **diff the note paragraphs too**.
    **This skill is the likeliest of all seven to breach it**, because correcting steps against the
    build is exactly the activity in which an expectation quietly follows them.
11. **The "AUTOMATED CASES CHANGED — FOR VLAD" section** (core §5.3), and **OUTSTANDING** (core §13).
12. **🛑 THE §8.5 CHECKLIST GATE — before reporting complete, CONFIRM in `FINDINGS.md` that 0 cases
    were skipped for data-seeding or login reasons** (Rule 74). Any that were → not complete: seed, log
    in, finish. A case may remain un-verified ONLY under §8.4 (genuine feature absence, §7 / Rule 69).

---

## THE DELIVERABLE

`build/<project>/<pass>-<date>/` containing:

| File | Contents |
|---|---|
| **`DIVERGENCES.md`** | **WRITTEN EVEN WHEN EMPTY** — see below |
| `RUNNABILITY.md` | Per case: the five checks, what made the state one where the thing should appear, **the control that proved the detector could fire**, and the verdict |
| `FINDINGS.md` | What was observed, **with the build marker on every verdict**, and the honest split: how many were driven **this pass** versus carried forward; **plus the §8.5 gate line — confirm 0 cases were skipped for data-seeding or login reasons (Rule 74)** |
| `LABEL-DIFF.md` | Per label: the DOM string, the computed `text-transform`, the visible string, the source's text, and the verdict — with checker artefacts named as such |
| `CHANGES-MADE.md` | Every case touched and what changed |
| `testrail-execution-log.md` | op · C-id · HTTP · byte-verification result · **and `custom_atmstatus` at write time** |
| `evidence/` | Screenshots and captured responses — **redacted at the point of capture** (core §10) |
| `RECHECK-QUEUE.md` | One row per case whose verdict is provisional, with its build marker and what specifically must be re-confirmed |

### 🔑 `DIVERGENCES.md` IS WRITTEN EVEN WHEN IT IS EMPTY

**An absent divergence file is indistinguishable from a pass that never looked.** If nothing diverged,
the file says **"0 divergences found across N cases walked"** and names the N.

It opens with the category test in its own words, then per divergence:
**the case (internal ID + C-id + link)** · **what the SOURCE says, quoted** · **what the BUILD offers,
quoted** · **COSMETIC or SUBSTANTIVE and why** · **what was changed, or what was held** ·
**what is being raised to the QA lead**.

*Canonical examples: `build/schedule/finish-2026-08-12/DIVERGENCES.md` (which opens with the test by
name — that is why it is usable evidence rather than a list of edits) ·
`build/filters/finish4-2026-08-12/RUNNABILITY.md` (the truncation control) ·
`build/report-suite/build-viu-2026-08-12/FINDINGS.md` §3 + `LABEL-DIFF.md` (the capitalize near-miss).*

---

## GUARDRAILS

- **G1 — Never invent a step, a label or a route.** If it cannot be confirmed, flag it.
- **G2 — Never take an expectation from the build**, in any circumstance, including to break a tie
  (core §11.2).
- **G3 — Never DISTURB a live sibling's session; but DO log in as needed (§8.2, Standing Rule 74).**
  The constraint is "don't rotate a session another of OUR OWN workers is actively using" — NOT "don't
  log in". If a sibling is live, sequence the work or use a **separate browser context / fresh staff
  login**; if none is live, `quick-login`/`switch-user`/fresh-staff freely (core §6). **A login is
  never a reason to skip a case.**
- **G4 — Never grade a case Pass or Fail as though it were our verdict to give** (core §1.6). We
  report what is runnable and what diverges; **the tester marks pass or fail.**
- **G5 — A destructive edit goes LAST, after everything that depends on the session is committed**
  (core §7.3).
- **G6 — `ABSENT` requires a control that fired.** Otherwise it is `NOT_ESTABLISHED`.
- **G7 — Redact at the point of capture.** A capture that stores response bodies **will** eventually
  store a token — that is exactly how 12 JWTs reached a public repo (core §10).
- **G8 — Checkpoint every 25 ops or 10 minutes** (core §8).
- **G9 — 🛑 NEVER LET A PROBE PRESS A DESTRUCTIVE CONTROL TO DISCOVER WHAT IT DOES** (core §7.5).
  **Establish whether a confirmation step exists, then press. Select by ID, never by a displayed
  string. Read `build/<project>/*/INCIDENT-*.md` before writing any probe that clicks**, and make the
  probe **print its non-GET calls at exit**. *The same shift was destroyed twice in two days — the
  second time by a worker who had not read the incident report the first one wrote.*
- **G10 — Never put a case on `HOLD` whose steps run** (§ above, core §15.1a). A hold disarms it.
- **G11 — If an instruction for this pass conflicts with a rule here, STOP and surface it before
  acting** (core §11.6, Standing Rule 63): his words quoted, the rule quoted with its number, and an explicit *"which
  should we follow?"*. **Not in the closing summary — by then the work is done one way.**

---

## HONESTY NOTES

- **"Build-verified" and "steps walked" are different numbers.** Report both. **The second is always
  smaller and always the more honest claim** — *"can a tester pick this up tomorrow and run it?"*
- **Say how many cases were driven THIS pass** versus carried forward from an earlier one on the same
  marker, and **label each case accordingly** rather than averaging.
- **Never report "0 raw markup" as a durable state** (core §3.5) — it is true only of the moment.
- **Two near-miss false defects were avoided by looking twice, and one of them was ours:** a
  *"the working-hours service is broken"* report was **our own missed click** — the Save button sat
  below the fold and the coordinate click landed on nothing. `scrollIntoViewIfNeeded()` then click →
  `201` and `200`, value read back. **Look twice before it becomes a finding.**
- **Withdraw your own bad ticket when you find it.** One of ours was withdrawn as invalid because it
  had been raised against a shop **with no business hours configured — which the source case's own
  precondition required.**

---

## WHAT THIS SKILL DOES **NOT** DO

| Not this | Use |
|---|---|
| Decide what a case should expect | **[`02-SOURCE-CHECK`](02-SOURCE-CHECK.md)** + core §11.2 |
| Write a case that does not exist | **[`01-CASE-BUILD`](01-CASE-BUILD.md)** |
| Cold-read for coherence, or build the tester's skip list | **[`04-TESTER-READY`](04-TESTER-READY.md)** |
| Produce the completion table | **[`05-PROJECT-REPORT`](05-PROJECT-REPORT.md)** |
| Turn a substantive divergence into a ticket | **[`06-DEFECT-PREP`](06-DEFECT-PREP.md)** — this skill **records and raises** it; it never files |
| Ask the PO about an unsourced behaviour | **[`07-PO-QUESTIONS`](07-PO-QUESTIONS.md)** |

**And it never marks a case Passed or Failed** — that verdict is the manual tester's.
