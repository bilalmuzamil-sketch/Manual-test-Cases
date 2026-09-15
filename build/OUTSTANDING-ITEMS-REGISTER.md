# OUTSTANDING — what the QA lead needs to decide

> **🛑 RULE 103 (QA lead, 2026-09-10).** Every item on this page is written in HIS language: what a
> USER would see go wrong, why it matters, the decision, the options with what we would then do, and
> the cost of saying nothing. **No status codes, no endpoint names, no field or tool names, no probe
> numbers.** Case ids and ticket keys go at the END of an item as reference only — never as the thing
> that carries the meaning. If an item cannot be understood on one read without opening anything, it
> is not written yet.
>
> **🛑 RULE 8 AMENDMENT (QA lead, 2026-09-10):** every case number in a reference line carries its
> case link **and the run it was executed in, with that run's link**. Never a case number on its own.

---

# A · SEVEN THINGS ARE ON YOU (2026-09-10)

Both features are fully tested. Four are "may I raise this bug", three are "which of two written
rules is right". Nothing else is waiting on you.

## Four bug reports, written and waiting on your word

You asked for them one at a time, and to hold after each until you have checked it. All four are
finished — steps to reproduce, the exact wording from the written requirements, and what the build
actually does. **None has been raised.**

### 1. A declined job can still be changed
**What a user would see.** When a customer turns a job down it is marked Declined. On this build a
declined job still behaves like a live one — the button for adding a part and the pencil for changing
a part are both still there, and both work. A part added to a declined job really is saved. Nothing
warns you and nothing stops you.
**Why it matters.** Parts keep going onto jobs the customer has already refused, and they are
recorded as real. Paid and Completed jobs are correctly locked. Declined is the only one missed — and
it is missed everywhere: the buttons, adding, and editing.
**The decision.** May I raise this?
| Option | What we would do |
|---|---|
| **Yes, one report (recommended)** | Raise one bug saying Declined is not being treated as a locked stage, naming all four failing checks. One cause, almost certainly one fix, one investigation. Then I stop and wait for you. |
| Yes, but split it | One bug for "the buttons are shown", one for "the saves go through". Two investigations into the same cause. |
| Not yet | It stays written and unraised. |
**If you say nothing.** Four test results stay unwritten and this feature cannot be signed off.
Nothing else is held up.

### 2. A part with no price goes onto the job at nothing
**What a user would see.** If the part chosen has no price recorded against it, the cost box and the
price box fill in with 0.00 instead of staying empty, and the part saves at 0.00 without anyone being
asked to type a price.
**Why it matters.** This is what the customer is charged from. A part can reach an invoice at nothing
and nobody is prompted.
**The decision.** May I raise this? *Yes* → I raise it and stop. *Not yet* → it stays written.
**If you say nothing.** One test result stays unwritten; nothing else is held up.

### 3. Typing letters into the cost box gives the wrong message
**What a user would see.** It says "enter a cost and sell price" — as though the box had been left
empty — instead of telling you the value is not a number. Typing a negative number is handled
correctly.
**Why it matters.** Small. It confuses rather than harms.
**The decision.** May I raise this? *Yes* → I raise it and stop. *Not yet* → it stays written.
**If you say nothing.** One test result stays unwritten; nothing else is held up.

### 4. The printed page has no line between one job and the next
**What a user would see.** On the printout each job's block is followed by a blank band to write notes
in — that part is right. The heavy rule that should sit above that band is missing. Oddly, the fainter
lines *inside* a block did ship.
**Why it matters.** Room to write, clearly divided, is the thing this printing feature was asked for.
**The decision.** May I raise this? *Yes* → I raise it and stop. *Not yet* → it stays written.
**If you say nothing.** One test result stays unwritten; nothing else is held up.

## Three questions for the product owner — decisions, not fixes

### 5. The printing requirements contradict themselves about a job with no work lines
**What is written.** The summary of decisions at the top of the printing document says Print should be
greyed out when a job has no lines. Two of the numbered requirements further down describe exactly
what such a job should print. Both cannot be true.
**What the build does.** It prints, showing "No lines on this work order" with zero totals.
| Option | What we would do |
|---|---|
| Print should be greyed out | That becomes a bug to raise, and the two checks about printing an empty job are retired. |
| Printing an empty job is correct | I correct the wording of one check to drop that half, and it passes as it stands. |
**If you say nothing.** One check stays unresolved. Two related checks are already recorded as good.

### 6. A job cannot exist with no customer, and cannot exist with no vehicle
**What is written.** Two checks describe what should print when a job has no customer, and when it has
no vehicle.
**What the build does.** It refuses to create such a job at all — it says the customer and the vehicle
are both required. So neither situation can ever arise, and neither check can ever be run here.
| Option | What we would do |
|---|---|
| The product should allow it | Raise it, then the two checks become runnable. |
| It should not | Retire both checks. |
**If you say nothing.** Two checks stay unresolved. Nothing else is held up.

### 7. There is no "Cancelled" state for a job line
**What is written.** One check describes what a cancelled line should look like on the printout.
**What the build does.** A line offers only Authorization required, Declined, Authorized and Complete.
There is no Cancelled, and the system refuses anything else.
| Option | What we would do |
|---|---|
| Cancelled should be added | Raise it, then the check becomes runnable. |
| It means Declined | Reword the check to Declined and run it. |
| Neither | Retire the check. |
**If you say nothing.** One check stays unresolved. Nothing else is held up.

---

---REFERENCE---

Runs, always paired with their cases (Rule 8 as amended 2026-09-10):

- **Inline Add and Edit Parts — run 418** · https://shopview.testrail.io/index.php?/runs/view/418
  - Item 1: C44993, C44994, C45035, C45061 — https://shopview.testrail.io/index.php?/cases/view/44993 · /44994 · /45035 · /45061
  - Item 2: C45060 — https://shopview.testrail.io/index.php?/cases/view/45060
  - Item 3: C45058 — https://shopview.testrail.io/index.php?/cases/view/45058
- **Printer Friendly Work Orders — run 419** · https://shopview.testrail.io/index.php?/runs/view/419
  - Item 4: C45105 — https://shopview.testrail.io/index.php?/cases/view/45105
  - Item 5: C45091 — https://shopview.testrail.io/index.php?/cases/view/45091 (and C45107, C45116 recorded as passed)
  - Item 6: C45097, C45098 — https://shopview.testrail.io/index.php?/cases/view/45097 · /45098
  - Item 7: C45104 — https://shopview.testrail.io/index.php?/cases/view/45104

Held drafts: `build/defects-2026-09-10/D1-declined-editable.md` (parent SV-9316) ·
`D2-cost-not-a-number.md` (SV-9319) · `D3-no-price-zero.md` (SV-9319) ·
`D4-no-rule-between-lines.md` (SV-9386). All `Story Defect`, priority `Medium`.
Live-source reconciliation for all four plus item 5: `build/defects-2026-09-10/RECONCILE.md`
(Confluence 782761986 and 519176194, both read 2026-09-10). Build: staging `v26.36.2-617d8d1`.

Standing hold H1 (Rule 62, 2026-08-10) is still in force: no Jira ticket of any type without his
per-ticket go-ahead. TestRail case writes are expressly carved out and are not held.

---

# B · EARLIER ITEMS STILL OPEN (unchanged, carried forward)

The blocked-access notes R1–R6 named in the project index still stand and are unrelated to the two
suites above: `BLOCKED-shopview-app-session.md` (staging-only since 2026-09-02) ·
`BLOCKED-confluence-version-integers.md` (12 of 13 version numbers unreadable through the only call
that carries them) · `BLOCKED-qa-branch-sv8582.md` · `BLOCKED-global-search-build.md`.

A housekeeping note, not a decision for him: §1 of `CLAUDE.md` measures 27,271 bytes against its own
20,000-byte cap. It was already over before today's Rule 8 amendment; nothing has been dropped to fit,
per the gate's own instruction never to weaken a ruling for the number.

---

## P1 — ✅ CLOSED 2026-09-12: the TASK ticket is raised as SV-9978

**Authorised by the QA lead on 12 September 2026** — a per-ask permission under Rule 62, covering this
one ticket only; the hold otherwise stands.

**What:** on an estimate, the Legacy design prints a "Payments" and "Balance" block that the Modern
design does not. Observed on production `v26.36.4-3e1c643` on jobs S2-864 and S2-833. The job's own
figures are identical in both designs.

**Why it is held, not filed now:** he wants it raised only once every one of the 45 cases has a
production result, so the run is finished first.

**Type:** **Task**, never a Story Defect or Bug. **Linked** to the related stories in epic SV-9892.

**Not a failure:** no test case is to be marked Failed because of this. The Product Manager rules on
whether it is expected behaviour or a bug, the QA lead relays that ruling, and only then are the
affected cases marked Passed or Failed.

**Before writing it (DONE):** re-observed on four estimates for jobs that have never been invoiced and
carry no payments — S1-816, S1-818, S1-821, S1-822. The Legacy document prints the Payments heading and
a Balance equal to the whole total on all four; the Modern one prints neither; every figure is identical
between the two. So the finding is **wider** than first thought, not narrower — it is not confined to
already-paid jobs, and the ticket says so.

**Raised as [SV-9978](https://shopview.atlassian.net/browse/SV-9978)** — Task, Medium, Product Area
Work Orders, `relates to` SV-9895 and SV-9897 under epic SV-9892. Nine headings, two annotated images
inline at width 760, sources quoted verbatim with page id and read date, and an explicit statement in
the ticket that **no test case has been failed** for either observation. Rendering verified after the
write, not assumed.

Full detail, the verbatim ruling, the spec quote and the ticket's required shape:
`build/invoice-design-selection/production-2026-09-12/PENDING-TASK-TICKET.md`

---

## P2 — six things the QA lead must decide before the production run can finish (opened 2026-09-13)

**Thirty-five** of the forty-five checks in run 446 carry a production result and **all thirty-five
passed**; of the ten without one, **four were ruled out of production on 13 September** (brand-new
shop and customer portal), leaving **six** — verified test by test against TestRail on 13 September, not counted from local files (the
local tally said thirty-six and was wrong). Ten do not, and every one of them is waiting on him rather
than on anything broken. Each is written out in full,
answerable without opening anything, in
`build/invoice-design-selection/production-2026-09-12/REPORT-FOR-QA-LEAD.md`.

| Ref | Waiting on | Cost of silence |
|---|---|---|
| ~~**P2-a**~~ | **CLOSED 13 September — ruled out of production by the QA lead:** nothing to do with a brand-new shop is tested there. C53523 keeps its staging result | — |
| **P2-b** | A second production sign-in WITHOUT settings access (making one sends a real invitation email) | C53529 stays without one |
| **P2-c** | A foreman/manager review approval plus a customer with no money on account — or his agreement that the behaviour is adequately proved by the two other credits already checked | C53537 stays without one |
| **P2-d** | Permission to change the test customer's contact address to the QA lead's own (`bilal.muzamil@shopview.com`) and then send — the Send dialog pre-ticks `dsfsdf@gmail.com`, a real outside address, and would not untick. Changing the contact is authorised data seeding (Rule 107); SENDING outward is the part that needs his word | C53551 and C53565 stay without a production result. C53545 is now out of scope (portal) |
| ~~**P2-e**~~ | **CLOSED 13 September — ruled out of production by the QA lead:** nothing to do with the customer portal is tested there. C53545, C53567 and C53569 keep their staging results. ⚠️ Note for the record: C53566 (portal on screen and PDF) HAD already been run successfully on production before the instruction — the portal is reachable there and renders under both designs; only the card-payment checks were ever untestable. Left Passed, and he has been told | — |
| **P2-f** | Where an imported invoice appears once the Invoices import has run. The import reported success and the server raised no error, but the record could not be found on the customer's Invoices tab or in the work-order list paged to exhaustion (186). Batch invoices genuinely number zero — the app's own IBS Batches report lists none | C53568 stays without one. Also worth a look in its own right, reported to him as an observation, NOT filed |
| **P2-g** | C53570 is three-quarters observed; the last part needs a job carrying an IBS approval code, and obtaining one sends a real request through the external approval system | C53570 stays held rather than posted |

**None of these blocks anything else**, and none blocks the Invoice Refresh run he wants next — that
one is simply queued behind this suite completing, as he instructed.

---

# B · GLOBAL SEARCH — WHERE IT STANDS NOW (updated 2026-09-15)

**The set of tests that checks everything people could do with the search box in the live product is
finished, bar two things, and both are one word from you.** Sixty-five tests: forty-seven work,
sixteen do not, two are described below.

**The sixteen that do not work are the ten you ruled on plus the six that fall out of them.** Every
one is written up for the developers and none is a duplicate.

## The three things waiting on you

### 1. One test is checking for something we deliberately left out of this version
**What happened, and it is worth a minute.** I had this written up as a new fault and was about to ask
your permission to raise it: choosing something from the search results is no longer recorded
anywhere, so nobody can tell whether people use the search box. I had it measured, and I could point
at it in the product's own code — every other part still records this and search does not.

**Then I read the written requirements as they stand today, before judging it.** They say the
opposite of our test. The goals section puts usage-recording outside this version in as many words,
and the change list records it being taken out of the document altogether. The piece of work that
would build it was moved to a later release and has not started. **The product is doing exactly what
was asked of it.** Raising it would have put a report on a developer's desk for work we ourselves
decided not to do.

**And we already knew.** Another test in the same set carries that exclusion in full and is
deliberately not run. The two are about the same thing; one of them has the ruling on it and the other
does not.

**The decision.** Nothing goes to the developers. What is left is our own test:

| Option | What we would do |
|---|---|
| **Give it the same exclusion as its twin (recommended)** | It is kept for the release in which usage-recording ships, and recorded as not applicable to this version rather than as a failure. |
| Keep it as an old-version expectation and put the difference to the Product Owner | The old version did record this and the new one will not. That is a decision he already took in August; re-opening it is his call. |

**If you say nothing:** one test of the sixty-five stays open. Nothing goes to the developers either
way, and nothing else is held up.

### 2. One test can no longer be run at all — retire it, or lend me a sign-in?
**What it checks.** That someone who has no home branch set can still use search without it breaking.
**What we found.** Such a person can no longer get into the product at all — the sign-in is refused
for them. Two people without a branch were refused and a person with one was let straight in, so it
is the branch that decides. The state cannot be created either: the staff screen requires a branch
and so does the system behind it. Twenty-seven active people on this branch already have no branch
set, and none of them can be signed in as.
**Why it matters.** Either the product now guarantees everyone has a branch, in which case this test
is obsolete, or those twenty-seven people are locked out and that is a bigger problem than search.

| Option | What we would do |
|---|---|
| **Ask the developers whether a person without a branch is still meant to exist (recommended)** | Their answer either retires the test or turns this into a separate report. |
| Give me a sign-in for one of those people | The test runs in a minute and the set is complete. |
| Leave it | The test stays open, marked with the reason. |

**If you say nothing:** one test of the sixty-five stays unfinished. Nothing else is held up.

### 3. The ten you ruled on still read as unanswered questions to the developers
**What they say today.** Each of the ten was written deliberately as a question, not an accusation —
"this is a capability the previous version had and this one does not; is losing it acceptable?" with
two options, and the line *"nothing is being called a fault here"*. That was right when they were
written, because nobody had decided yet.

**What has changed.** You decided. All ten, the same answer: it should still work, log it as a fault
and get it fixed.

**Why it matters.** Anyone opening those ten today reads an open question addressed to you and has no
reason to start work. Your answer is in the spreadsheet you sent back, and nowhere on the tickets.

**The decision.** You told me not to touch tickets that are already raised, so I have not.

| Option | What we would do |
|---|---|
| **Let me add your answer to each (recommended)** | One short note on each: you were asked, you answered on 15 September, it should still work, so this is work rather than a question. Nothing else changes — no status, no wording, no re-filing. |
| You add it yourself | Nothing for me to do; say so and I will leave them alone. |
| Leave them as questions for now | They stay open and nobody starts on them. |

**If you say nothing:** the ten faults you ruled on sit looking like unanswered questions. Nothing else
is held up.

## Closed since yesterday

- **The ten things that stopped working — answered, all ten, and written up.** No duplicates.
- **The six checks about narrower access are all done.** Yesterday's note said nobody on the branch
  held those narrower jobs and that the staff screen would not keep a change. Both are solved: the
  screen does keep it — it asks for confirmation in a second window that had been missed — and where
  no suitable job existed, one was built from scratch for the check and taken away afterwards.
- **Part sales work again**, so the three checks waiting on them are done.
- **Three tests that had never been run at all have been found and run.** Two work. The third is the
  near-spelling problem you already know about, so nothing new was raised.

---REFERENCE---
Run 415 — https://shopview.testrail.io/index.php?/runs/view/415 — Global Search V2 regression set,
QA branch sv9160, build v26.36.4-7869ff2, executed 14-15 September 2026.
Waiting on you: C45160 (usage event not recorded) — https://shopview.testrail.io/index.php?/tests/view/2738741 ·
C45159 (no home branch) — https://shopview.testrail.io/index.php?/tests/view/2738740.
Closed today: C45142, C45143, C45149, C45153, C55684, C55685, C55686.
The ten answered: C53516 · C53582/C53585 · C55662 · C53606 · C53603 · C53601 · C55658 · C55669 ·
C55679 · C55660.

## B-NEW (15 September 2026) — two supplier findings held under the no-filing rule

Found while running the corrected cases on run 415, branch sv9160, build v26.36.4-7869ff2. Neither is
filed; both are put to the QA lead in `build/global-search/reports/STATUS-2026-09-15-old-search-safety-net.md`.

| | Finding | Evidence |
|---|---|---|
| B-N1 | A supplier cannot be found by their **address line 2** although a customer can. The supplier record prints `Address 2: Bay 12C` on screen and typing it returns nothing; the customer's `Dock 7B` returns the customer. | C53604 / test 2959370, and `SUPPLIER-ADDRESS.json` |
| B-N2 | A supplier cannot be found by their **website** (`kestrelsupply-zzt.com`). The customer equivalent is already filed as SV-10003; the supplier side had never been checked. | `SUPPLIER-ADDRESS.json` |

**The whole address picture, measured field by field on 15 September** — so this is one decision, not four:

| Field | Supplier | Customer |
|---|---|---|
| name | found | found |
| address line 1 (and a word from it) | found | found |
| address line 2 | **not found** | found |
| city / town | found | found |
| state | **not found** (SV-10006) | found |
| postcode | **not found** (SV-10005) | **not found** (SV-10002) |
| website | **not found** | **not found** (SV-10003) |
| email | found | — |

**B-N3 — the 99 feature checks in run 415 have never been run.** They test the new search against its
own written requirements rather than against the old product. The QA lead was asked whether to start
them; until he answers they stay untouched.
