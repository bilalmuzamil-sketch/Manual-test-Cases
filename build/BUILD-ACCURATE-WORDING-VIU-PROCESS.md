# Build-Accurate Wording + VIU Process (reusable, cross-project)

> **A repeatable method to make every test case build-accurate + layman-friendly AND
> VIU-verify its behavior, then sync the corrected cases to TestRail — area by area.**
> First proven on **Fees & Discounts** (2026-07-13; all 183 cases, all pushed, 0 errors).
> **Apply this to any project (Fees & Discounts / Simple Flow / Custom Roles / future) ONLY
> WHEN THE USER ASKS.** Ties directly to **CLAUDE.md Standing Rule 9** (build-accurate,
> layman-friendly wording — **and, since its 2026-08-12 amendment, RUNNABILITY: preconditions
> and steps verified against the build**) and Standing Rules 6/8/9 (TestRail is the only real
> system; per-day authorization; TestRail Case ID + Link columns in deliverables), plus
> **Standing Rule 57** (the expected behaviour comes from the documents, never the build) and
> **Standing Rule 10** (whose behaviour-verdict half passed to the manual tester on 2026-08-11).

---

## Purpose

Deliver test cases a **new, non-technical manual tester** can run with zero prior context:
- Every **Title / Preconditions / Steps / Expected** uses the **EXACT** on-screen build
  labels (button/tab/dialog/field/toast/menu text), taken directly from the live build —
  never invented, paraphrased, or guessed — in plain layman English.
- Every case is **VIU-verified** (behavior exercised live) with a one-line evidence note
  and a `fresh_run` date.
- The corrected wording + status is **synced to TestRail** (update_case only), with a
  per-case audit log, so TestRail matches the source of truth.

> **⇒ AMENDED 2026-08-12 (CLAUDE.md Standing Rule 9) — THE TEST OF THIS PROCESS IS
> *RUNNABILITY*, NOT JUST LABELS. EVERY PRECONDITION AND EVERY STEP MUST BE **VERIFIED
> AGAINST THE BUILD** so a manual tester can execute the case as written.**
> QA lead, verbatim: *"steps of reproduction MUST be verified from the build to 100% ensure
> that when manual tester would run the test he will be able to run it."* and *"if the steps
> of reproduction and preconditions are not runnable as they differ from what is there in the
> build then the manual tester can not test that test."*
>
> **🔑 THE BUILD IS THE CHECK, NEVER THE AUTHOR.** Steps come from **what the case exists to
> test**; the build **confirms they can be run**. **Never rewrite the case around what the build
> makes convenient, and never invent a step.** Writing steps by walking the build lets the
> product choose our coverage: the suite ends up testing whatever was easiest to reach.
>
> **🔗 THE CHAIN HAS THREE LINKS: LEARNED FROM THE SOURCES → VERIFIED RUNNABLE ON THE BUILD →
> ANY DIVERGENCE RAISED TO THE QA LEAD.** A failing step is **COSMETIC** (correct it and log it)
> or **SUBSTANTIVE** (the build does not have what the source describes → the smallest change that
> stops a tester being stranded, with the marker chosen by **🔻 THE MARKER DECISION** in step (2a) —
> **a HOLD only where the steps genuinely cannot be executed**,
> "mark BLOCKED, not failed", **and RAISE it**). **The deciding question: *would a reader of the
> source recognise what the build offers as the same thing?*** Full table in **step (2a)**;
> deliverable **`DIVERGENCES.md`**. QA lead, verbatim: *"If any precondition learned from the
> sources is not doable on the build should be raised to me."*
>
> **🛑 AND THE EXPECTED BEHAVIOUR STILL COMES ONLY FROM THE DOCUMENTS (Standing Rule 57) —
> restated intact, because "take the steps from the build" is exactly the clause that could be
> over-read into "take the expectation from the build too", which is the failure that cost 748
> cases on 5 August 2026.** His own words in the same directive: *"YES the expected behavior
> should come from the sources rather than the build."*
>
> **📊 THE STANDARD IS 100%, AND THE COUNT IS HONEST: an unverified step is an unverified case.**
> Report **how many cases had EVERY step verified, on which build marker** — never how many were
> "looked at". The five-check runnability test is in **step (2a)** below.

---

## Preconditions (before starting a run)

1. **Fresh env cookies in `/tmp` only** — never in the repo; `chmod 600`. Re-supply per
   session (they are ephemeral). Confirm the domain/host matches the target project's env.
2. **Confirm backend health** — wake the env if it sleeps, then poll the API root for 200.
   If every request 500s, mint a fresh session (poisoned-shared-session fix per the
   project's playbook).
3. **Per-project TestRail authorization from the user** — get **explicit, fresh one-day
   write authorization** BEFORE any push. The rule: **never write to TestRail without
   explicit user permission** (TestRail is the only real/production system).
4. **Re-derive the live roles matrix FIRST** if any permission/role cases are in scope —
   shared envs **drift** (e.g. Technician gaining/losing perms). Capture the fresh matrix
   to a dated file (`roles-matrix-<date>.md`) before writing/adjudicating any
   permission-gated case; note any drift that makes a negative case not testable.

---

## Method — area by area (checkpoint each area so it becomes "tester-ready")

Work **one functional area at a time** (an area = a TestRail leaf section / a case-ID
prefix, e.g. FD-WO, FD-CALC). For each area, do all five steps, then declare the area
tester-ready before moving on. This makes the run **resumable** at area granularity.

**(1) Capture EXACT build labels.**
Open the relevant build screen(s) **once**. Capture the exact on-screen text —
button/tab/dialog/field/toast/menu/column labels — into a **label glossary**
(`wording-glossary-<date>.md`) plus **screenshots** (`screenshots/wording-<date>/`).
Record the delta where the build wording differs from the old case wording.

**(2) Rewrite each case to those exact build terms, in plain layman language.**
Update Title / Preconditions / Steps / Expected of every case in the area:
- Use the **exact build labels** captured in step 1 (if a UI term is unavoidable, use it
  exactly as the build shows it).
- Numbered lines with line breaks (Preconditions / Steps / Expected each numbered).
- **NO "VIU" / "verified" wording** in tester-facing fields.
- **NO "Feature Flag ON" preconditions** (settings-driven preconditions are fine when the
  behavior is settings-driven).
- **Strip spec-ref / design jargon** (story IDs, §-refs, enum names, bug codes, HTTP terms
  from tester-facing fields).
- **Never invent** — if a term cannot be confirmed from the build, **FLAG it** rather than
  guess.
- **The EXPECTED RESULT is rewritten for WORDING ONLY.** Its assertion comes from the
  documents (Standing Rule 57) and **does not change in this step** — if a rewrite would
  alter what the case asserts, **stop**: that is a sourcing decision, not a wording one.

**(2a) VERIFY RUNNABILITY — the five checks, on EVERY case (Standing Rule 9, 2026-08-12).**
Steps come from **what the case exists to test**; this step **verifies them against the
build** so a tester can actually execute them. **The build is the check, never the author.**
Fail any one of these and the case is not runnable:
1. **Is the precondition reachable?** Does the data state exist, or can it be seeded
   (Standing Rule 14)? **If genuinely unreachable — and only then, per 🔻 THE MARKER DECISION below** →
   `AUTOMATION: HOLD` with a plain reason
   **plus a tester-facing "mark BLOCKED, not failed" line** — never a silent pass.
2. **Does the navigation path exist?** Every screen, tab and menu the steps name.
3. **Does each named control exist WHERE THE STEP SAYS IT IS** — not merely somewhere on
   the page? *(Live 2026-08-12: `C38926` sent the tester to the roles-list three-dot menu
   for `Reset to template`; that menu holds only `View Permissions` — the control is on the
   role's own edit screen. A tester would have stalled on the case that resets every role
   before permission testing.)*
4. **Do the steps work in the order written?** A step depending on a state no earlier step
   creates is **not runnable**, however correct each line looks alone.
5. **Are the labels the ones actually on screen — read the COMPUTED STYLE, not
   `textContent`?** *(Live 2026-08-12: WIP tab labels carry `text-transform: capitalize`;
   `textContent` gives "Approved - partially completed" while the tester reads "Approved -
   Partially Completed". A `textContent`-only sweep nearly "corrected" five cases on a FINAL
   report into being wrong, hours before release. **Both readings are needed — neither alone
   is "the label".**)*

**Where a step fails a check, FIRST DECIDE WHICH KIND OF DIVERGENCE IT IS — the two are
handled differently, and getting this wrong is how a defect disappears:**

**The question that decides it: *would a reader of the source recognise what the build
offers as the same thing?***

| | **(a) COSMETIC** — yes, it is recognisably the same | **(b) SUBSTANTIVE** — no, the source describes something the build does not have |
|---|---|---|
| Examples | renamed control · moved menu item · changed label · same route by a slightly different path | the route does not exist · the precondition's state cannot be set up at all, even with seeding (Standing Rule 14) |
| Handling | **correct it** so the tester can run the case, **and log it** | **NEVER silently rewritten.** Record as a **DIVERGENCE** with **both texts quoted** (Rule 45(e)) + the **C-ids** (Rule 8), then apply the **smallest change that stops a tester being stranded** — **which marker that is, is decided by 🔻 THE MARKER DECISION below, not assumed** |
| Escalation | none | **RAISE IT TO THE QA LEAD** and log it in the **OUTSTANDING-ITEMS REGISTER** (Rule 36) |

### 🔻 THE MARKER DECISION — the one place this document decides it

**🛑 CORRECTED 2026-08-13, THIS DOCUMENT ALIGNED 2026-08-28 WITH THE QA LEAD'S APPROVAL. SUPERSEDED
WORDING, KEPT VISIBLE AND DATED:** this document used to say a substantive divergence gets
*"normally `AUTOMATION: HOLD`"*. **That was wrong and it points the wrong way in most cases.**

**WHY IT MATTERS MORE THAN IT LOOKS: `AUTOMATION: HOLD` TELLS THE TESTER TO MARK THE CASE BLOCKED.**
So a hold on a case whose steps **do** run **removes that case's ability to fail** — exactly as surely
as writing the build's behaviour into the expected result does. **The difference is only that it looks
like caution instead of like a mistake.** A blocked case stops being worked, migrates into a "what is
left" row, and nobody re-tests the premise.

**⇒ SO DECIDE FROM THE STEPS, NEVER FROM HOW BADLY THE CASE LOOKS LIKE FAILING:**

| What is true of the STEPS | Marker | Why |
|---|---|---|
| The tester **cannot execute** them — the route, screen or precondition genuinely does not exist, and seeding cannot create it | **`HOLD - <plain reason>`** + a *"mark BLOCKED, not failed"* line | They would be stranded |
| The tester **can** execute them; the build fails the requirement; **a LIVE OPEN ticket describes it** | **`READY - EXPECT FAIL (SV-xxxx)`** + the symptom and all three outcomes | It stays armed: **if the fix ships the case passes and the tester tells us — which a HOLD can never do** |
| The tester **can** execute them; the build fails the requirement; **NO live ticket** (none, closed or obsolete) | **plain `READY`**, and **change nothing else** | The case keeps its documented expectation and **the tester fails it, which is correct.** An unbacked expect-fail marker is barred (core §15.1) |
| **Most** steps run; **ONE** cannot be performed | **plain `READY`** + a **verdict-free** note naming that one step: *"mark that step blocked and record the rest normally"* | A hold would throw away every result the runnable steps produce |

**⚠️ AND A HOLD WHOSE REASON IS OUR OWN FILING PROBLEM IS NOT A RUNNABILITY HOLD AT ALL** — *"needs
permission before a ticket exists to point at"* describes **our** constraint, not the tester's. Those
are one edit from `READY - EXPECT FAIL` once a ticket exists.

**Full four-row treatment, the worked examples and the live case ids: core §15.1a and skill `03`.**
**This block is the only place this document states the decision** — the other mentions point here, so
there is one thing to maintain and nothing to drift.

> **⚠️ A PRECONDITION THE SOURCES REQUIRE BUT THE BUILD CANNOT ACHIEVE IS VERY OFTEN EVIDENCE
> THAT THE *BUILD* IS WRONG, NOT THE CASE.** Rewriting the case to match the build there does
> not fix a test — **it deletes the finding.**
>
> **🔥 THIS IS THE DANGEROUS EDGE OF THE WHOLE PROCESS. Now that correcting steps is REQUIRED,
> category (b) is the new hiding place: a substantive divergence quietly "fixed" into a runnable
> step LOOKS LIKE DILIGENT MAINTENANCE and reads as careful work** — the same shape as the
> failure that cost 748 cases on 5 August 2026, one layer down, and **harder to spot**, because
> the resulting case is genuinely runnable and build-accurate. **Ask the category question every
> time a step is corrected** — never skipped because the fix was obvious, never resolved in
> favour of (a) because (b) is more work or the release is close.

Record per case whether **every** step was verified — **an unverified step is an unverified
case**, and the pass reports **N of M with the build marker**, never a rounded-up total.

**QA lead's stated goal, and the one-line test of this step:** *"A tester should not find a step
coming from mars (which does not exist)"* … *"we need to make sure that the testers find a
runnable test to execute."* **No case may send a tester to something that does not exist —
either corrected, or clearly marked not runnable with the reason. Never left silently broken,
and never quietly rewritten into something the sources never asked for.**

**(3) VIU the behavior — LIVE UI-OBSERVED, with evidence, never inferred.**
Exercise the case **live in the UI** and capture evidence **that run** (a screenshot
and/or the captured API response). For **permission/role** cases, FIRST **reset every
in-scope role to its template/default** ('Reset To Template') and record the before→after
drift diff (per **Standing Rule 26**) so live observation is against spec-default
permissions, not drift/over-grants left by prior or parallel-session testing on a shared org;
then actually
logging in / driving the UI **AS the actual role** and **OBSERVING the control**, PER
role, PER environment — **never** inferred from role definitions, `fe_permissions`,
atoms, prior data, or source code. Set `viu_status` on the case JSON (Verified /
Deviation / Blocked-* / Pending) + a **one-line evidence note** + the
`fresh_run: <date>` stamp. A case is **Verified ONLY when its behavior was directly
observed live with evidence**; anything not directly observed is **Blocked / NOT
VERIFIED** with the reason stated — never silently derived and passed off as done. If
a live check cannot be completed (session/cookie expired, screen unreachable, env
down), **STOP** and report plainly what could not be verified and what is needed
(e.g. fresh cookies); do NOT substitute inference to appear complete. (This is
Standing Rule 12 — verified means observed, never inferred; it governs this step
absolutely.)

**(4) Commit the area, then push it to TestRail.**
- **Commit by explicit pathspec** (only the files you changed — rebase-safe; never
  `git add .`).
- Push the area to TestRail via **`update_case`** only:
  - **curl only** against `shopview.testrail.io`; **Basic auth from env / `/tmp` only**
    (never hard-code or commit credentials).
  - Loop: **GET current case (keep it as the PRE-WRITE SNAPSHOT) → diff → update only changed
    fields → re-GET → BYTE-LEVEL verify**. **Skip no-ops** (don't rewrite unchanged cases).
  - **EXHAUSTIVE FIRST (Standing Rule 50, Part 1 — the QA lead's own gloss on "byte-level" is
    "not to miss anything"):** the pass covers **EVERY case in the area and EVERY field of each case**
    (title · preconditions · every step · every expected result · refs · section · type · notes) —
    **no sampling, no "the important ones", no spot-check reported as the whole.** A large area
    changes the **schedule**, not the **scope**: batch + checkpoint (Rule 29) and **finish it**, and
    state the **exact number verified and the exact remainder**. A sample is acceptable **only if the
    QA lead asks for one**, and must be labelled as a sample with its size and population.
  - **THEN EXACT — BYTE-LEVEL VERIFICATION IS MANDATORY (Standing Rule 50, Part 2) — a 200 OK is NOT
    verification.**
    Byte-compare the **intended payload** against **what the re-GET returned, field by field**, AND
    prove **every field you did not intend to change is byte-identical to the pre-write snapshot**
    (that is how collateral damage is caught). **On ANY mismatch the write FAILED: stop the batch,
    do not proceed to the next case, report both byte sequences — never retry blindly, never log it
    as success.**
  - **DECLARED NORMALISATIONS — the honest caveat.** A server may legitimately transform a value on
    write, so a raw byte compare can differ for a *correct* write. Accept that **only** when it is a
    **KNOWN, RECORDED** behaviour, and **assert it explicitly as the expected transformation** —
    never "close enough". The recorded one: **TestRail's `refs` splits on commas, trims each entry
    and rejoins with a bare comma, and rejects any single entry > 248 chars with HTTP 400 `Field
    :refs does not match the required pattern.`** (a *pattern* error, not a length error; 248
    passes, 249 fails) — so verify `refs` under `','.join(p.strip() for p in s.split(','))` and say
    so in the log. Details in `build/APP-ACTIONS-PLAYBOOK.md` §J. **Any NEWLY discovered
    normalisation must be recorded in the playbook with its evidence BEFORE it is relied on.**
  - **Respect the API-section rule** (Standing Rule 4): any case with API endpoints / HTTP
    methods / status codes / backend request-response checks stays in an **API-titled
    section**; UI-only cases stay in their functional sections.
  - Append a **per-case audit log** (`testrail-wording-viu-log.md`): what changed, status,
    push result (e.g. "N updated · 0 error"). **Per Rule 50 each entry records the operation · the
    target C-id · the HTTP status · the BYTE-LEVEL verification result (and any declared
    normalisation applied) — an entry that says only "200 OK" is non-compliant.** Keep the
    pre-write snapshot and the post-write re-GET as evidence.

**(4b) STAMP OR REFRESH EVERY CASE'S PROVENANCE LINE (Standing Rule 54) — part of this push, not a
later tidy.**
> **🛑 CORRECTED 2026-08-28, QA LEAD APPROVED. THE ONE-SENTENCE FORM BELOW IS SUPERSEDED AND MUST NOT
> BE USED.** It is kept visible and dated (the Rules 32/33 pattern) because a silently-erased shape is
> how a session re-derives it. **What was wrong with it:** it merged the source and the check into ONE
> sentence and put **the build first**, as though the build were the source of the expectation. **Rule
> 54 as amended 2026-08-11 requires TWO SENTENCES THAT ARE NEVER MERGED, and bars the phrase *"as per
> the build tested on …"* outright** (core §14). Merging them is the exact error that took **748 cases**
> to undo on 2026-08-05.
>
> **SUPERSEDED — DO NOT USE:** *"This is the expected behaviour as per the build tested on 8/4/2026, and
> as per the Sales By Customer report specification version 13 (S4-R13)."*

**THE FORM IN FORCE — two sentences, never merged (Rule 54, core §14):**

**SENTENCE 1 — THE SOURCE. MANDATORY. NAMES ONLY DOCUMENTS**, each with **the date we read it**
(Rule 54 as amended 2026-08-11, core §14.1): the specification **with its version** and the
requirement anchor, and/or the epic and/or the owning story, and/or the PO's answer **with its file
link and date**, and/or the design or Figma. **THE BUILD IS NEVER NAMED HERE — not as a source, not as
corroboration, not in passing.** Where a case cites more than one source, **each carries its own
read-date**; a source this pass did not actually re-read **keeps its previous date** (back-filling
today's date onto an unopened source is a fabricated observation, Rule 12).

**SENTENCE 2 — THE RECORD OF CHECKING. OPTIONAL. NAMES THE BUILD ONLY AS WHAT THE CASE WAS CHECKED
AGAINST**, in neutral language: *"Last checked against build v3.5-be42149 on 8/5/2026."* **A case not
yet checked against any build OMITS sentence 2** entirely — it does not get a hedge, and it never
claims a check that did not happen. **A case that FAILS on the build must not say "passed" or
"verified"**; sentence 2 records only that the check occurred.

**Worked example of the form in force:** *"This is the expected behaviour as per epic SV-8582 and the
Sales By Customer report specification version 13, section S4-R13, read on 4 August 2026. Last checked
against build v3.5-be42149 on 4 August 2026."*

### 🧑‍🔧 WHAT THE TESTER ACTUALLY SEES — the part that makes this line USEFUL rather than just compliant

**The provenance line sits inside Expected Results, so a manual tester reads it on every case.** Three
things follow, and each of them is how this line stops guiding the tester if it is got wrong.

**(i) WHERE IT SITS IS FIXED, AND THE MARKER IS ALWAYS LAST.** In order, top to bottom:
the **numbered expected items** → a **separator line** → the **provenance line** → a **blank line** →
the **`AUTOMATION:` marker**, which is the very last thing in the field, with a line break after it
(core §15). **Exactly one provenance line and exactly one marker per case** — the stamper REPLACES,
never appends a second. Run the post-batch invariant census that proves it (core §2.4): the case that
taught us this, **C30341**, stored its text as raw HTML, so the writer's plain-text patterns matched
nothing and it **APPENDED a second provenance line and a second marker — and the byte-check PASSED**,
because the write was faithful to the payload.

**(ii) 🔑 WRITE THE BREAKS AS `<br>`, OR THE TESTER READS ONE UNREADABLE RUN-ON PARAGRAPH.** This
project renders markup **literally**, and a bare `\n` inside a `<p>` with no `<br>` **collapses the
whole field into a single run-on block** — provenance line, marker and all. **So put `<br>` into every
multi-line field on every write, pre-emptively; do not wait to see whether the re-render fires**
(core §2.1a, corrected 2026-08-25). **And note the trap that correction exists for: "a field sent
explicitly is stored verbatim" is FALSE.** A single authorised title-only repair on **C44864** sent all
three text fields at their exact snapshot values, returned HTTP 200, and **still came back collapsed**.
**The byte-check is therefore not optional even on a "safe" one-field edit**, and a case's markup state
is **an output of your write, not a property you inherited** — so census the markup **after** writing,
not only before.

**(iii) 🛑 THE SPEC VERSION AND THE REQUIREMENT ANCHOR STAY. DO NOT "CLEAN" THEM OUT AS JARGON.**
Rules 7/9 keep tester-facing text free of spec anchors and internal codes, and **the provenance line is
a deliberate, QA-lead-instructed EXCEPTION to that** — so a later tidy-up pass that strips the version
and the anchor for reading like jargon is **destroying the line's whole purpose**, not improving it.
His reason, verbatim: *"that must tell the Manual QA guy or anyone who is auditing those test cases
that these are the sources of the expected behavior, make sure to mention the date of the source when
that source of truth was taken from each source, so that in future if someone changes the source of
truth I can guard myself telling that the refrence taken from the source of truth was from the state of
that source which was at this certain date."* **Everything ELSE the tester reads stays plain layman
English** — the numbered steps and expected items carry no anchors, no case IDs, no HTTP terms, and
**never the word "VIU"**.

**⇒ THE ANTI-INVENTION GUARDS, restated because this is the field where invention hides.** A read-date
is **the date we actually opened that source**, never today's by default — **back-filling one onto a
source this pass did not open is a fabricated observation** (Rule 12) and it defeats the entire point,
because the date's value is evidentiary. A line **asserting a source that does not support the
expectation is worse than no line at all** (Rule 32), because it makes an unsourced assertion look
audited. And **a provenance line is never evidence of a check that did not happen**: if the build was
not opened, sentence 2 is absent — not softened.

Rules: **date = ONE generator variable**, spec versions = a **per-report map**;
**IDEMPOTENT — replace the existing line, never append a second**; **never the word "VIU"** or a flag
name (imports stay VIU-word-free); and where the case deliberately follows a **later product decision**
instead of the spec text, the line **says so** rather than claiming plain spec agreement (Rule 32 —
a line asserting a source that does not support the expectation is worse than none). **A push that
corrects wording but leaves a stale or absent provenance line is NOT complete.**

**(4c) LINK THE FILED TICKET ON EVERY CASE THE BUILD BREACHES — but VERIFY THE TICKET IS STILL OPEN
FIRST (QA lead, 2026-08-04).**
Where a case's expected result is correct and the **build** is wrong, and a ticket exists, the case
carries one plain line **below the numbered expected items and directly above the provenance line**:
`Known issue: the product does not currently do this. It has been filed for a fix here: <url>`.
**Read the ticket's CURRENT status from Jira before writing the link** (`GET
/rest/api/3/issue/<key>?fields=status,resolution`). **NEVER link a closed / withdrawn / OBSOLETE
ticket as though a fix were coming** — that tells a tester something untrue and the case carries the
lie indefinitely (Rule 12); omit the line and report the omission instead. Take the ticket→case
mapping from the defect pack, never from memory. **The case's assertions are NOT touched** — the QA
lead's ruling governs: *"where there is a bug and you found that, do not change those test cases,
because you found the bug due to those test cases."* Corollary worth stating: a case must never be
written so that **the defect is its pass condition** — on a fixed build the tester would have to mark
it Failed, and automation would encode the bug as correct.

**(4d) NAME THE TOOL IN EVERY CASE THAT NEEDS ONE — in the preconditions (QA lead, 2026-08-04).**
A case needing a tool is not un-runnable; it is **silent about what to use**. Every such case names
the tool **and where to get it**, in the preconditions, in Rule-7 plain words: the browser's own
developer tools (**F12 → Network tab**, nothing to install) · **NVDA** (free, Windows) or
**VoiceOver** (built into macOS) for anything checking what a blind user hears · the PDF viewer's own
**Ctrl+F** for file-content checks · and for a genuine external dependency (a QuickBooks-connected
company) say plainly that the test **cannot** run without it and to mark it **Blocked**, never guess.
Where a value lives only on the server, say that a **developer must read it back** — do not imply the
browser can show it. **Do not add a tool line to a case whose measurement you have just removed**
(the by-eye repair) — that contradicts the repair; and when you remove a measurement, **re-read the
preconditions too**, because a stale *"with dev tools available"* precondition contradicts an expected
result that says no tool is needed (found exactly this way on 2026-08-04 by the Rule-28 sweep).

**(5) Report the area as tester-ready.**
State the area's per-status counts and that its cases are wording-corrected + VIU'd +
pushed.

---

## Traceability = authenticity (Standing Rule 20)

Every case created / VIU'd / updated must be provably linked to (a) its Jira ticket(s) and
(b) its spec section, so its existence and its expected result are always justifiable. Keep
these in the **metadata/traceability layer, never the tester-facing fields**. The TestRail
case **References (`refs`)** field carries **BOTH together** in the format
**`<TICKET(S)> (<spec-anchor>)`** (e.g. `SV-7696 (S1-R3 (Vendor invoice Optional/Required))`,
`SV-7865 (§5-R3)`) — **per-story precision ALWAYS, and ticket-only is never acceptable (the
spec reference must never be dropped)**. Mirror the same combined value into the per-project
`testrail-id-map.csv` + coverage matrix; the audit log also records it. Tester-facing
Title/Preconditions/Steps/Expected stay jargon-free (Rules 7 & 9). Every change cites its
driving ticket (Done/Not-Done) + spec section in the audit log. A case with neither a ticket
nor a spec anchor is flagged missing-traceability, not left unsourced.

## Honesty rules

- **Leave genuine blockers blocked** with a **precise reason** — never fake a pass. Examples:
  - QuickBooks invoice line-item internals need a **human logged into QuickBooks** (no QB
    read API).
  - **Non-seedable data** (data you cannot create yourself in the disposable env).
  - **Env 500s** (e.g. line-create 500, unmap PUT 500) — record the endpoint + requestId.
- **Note anything a shared live tester prevents** — e.g. a flag-off window can't be taken
  while a manual tester is active on the shared env; a role negative isn't testable because
  the shared role has drifted. Record it as an action, not a fake result.
- Only mark **Verified** what you actually exercised (or re-validated with fresh evidence).
- **AN UNVERIFIED STEP IS AN UNVERIFIED CASE (2026-08-12).** A suite may be called runnable
  **only to the extent its steps have actually been verified against the build** — one
  unchecked step disqualifies the whole case from the count, because that is the step the
  tester stops on. Report **how many cases had EVERY step verified, on which build marker** —
  never "swept", "looked at", or "expected to be fine".
- **DESCRIBE THE RESULT HONESTLY.** With Rule 10's 2026-08-11 amendment the **manual QA tester**
  records pass or fail, not us — so a suite in this state is
  **"source-verified and build-accurate in its preconditions, steps, navigation and labels —
  with the behaviour verdict belonging to the tester"**, and **NOT "VIU complete"**. Plainly:
  *"Every case says what the documents require, and every case can actually be run on the build
  as written. Whether the build does what the documents require is the tester's call — and that
  is by design."*

---

## Resume safety

- The **checkpoint is the committed `cases/*.json` `viu_status` + `fresh_run:<date>`** plus
  the **wording-viu audit log** (`testrail-wording-viu-log.md`).
- On resume, **skip areas already logged tester-ready for that run date** (the log lists
  each completed area with `N updated · 0 error`).
- Because each area is committed by pathspec before the next starts, an interrupted run
  loses at most the in-progress area.

---

## Deliverables (regenerate at the end)

Regenerate the interim artifacts from the updated cases:
- **TestRail import CSV + XLSX** (`gen_import.py`) — VIU-word-free + feature-flag-free.
- **Blockers Tracker** (`gen_blockers.py`, `.md` + `.xlsx`) — the per-case source of truth.
- **Fresh-VIU results workbook** (`gen_fresh_viu_workbook.py`, `.xlsx` + `.csv`) — a tab per
  result status + a Summary tab.
- All case-listing deliverables **MUST keep the TestRail Case ID (C#####) column + a
  clickable TestRail Link** (`https://shopview.testrail.io/index.php?/cases/view/<id>`),
  sourced from the per-project `testrail-id-map.csv` (Standing Rule 8).

- **`DIVERGENCES.md` — REQUIRED since 2026-08-12 (Standing Rule 9's third step).** Every case
  where a **source-learned step or precondition did not hold on the build**, i.e. every
  **category (b)** finding from step (2a). **Written for the QA LEAD, not for the repo:** plain
  layman words (Rule 7), **both texts quoted side by side** — what the source says and what the
  build actually offers (Rule 45(e)) — the **C-id + TestRail link** per case (Rule 8), what was
  done to stop a tester being stranded, and **what is being asked of him**. Mirror each row into
  the **OUTSTANDING-ITEMS REGISTER** (Rule 36) with Rule 48's five fields.
  **If there are none, say so explicitly — never omit the file**, so "nothing diverged" is
  distinguishable from "nobody checked". **Raising is REPORTING, not filing** — no Jira ticket is
  created without the QA lead's permission (Rule 62, and the creation hold at its tail).

**ALWAYS state the TestRail update status explicitly in the final result** (per user rule)
— e.g. "all N cases pushed via update_case, 200/200, 0 errors" or "no TestRail write (not
authorized)".

---

## One-page checklist

1. Cookies in `/tmp` (chmod 600) · backend healthy · **fresh TestRail authorization** ·
   re-derive roles matrix if perms in scope.
2. For each area: capture labels + screenshots → rewrite Title/Precond/Steps/Expected to
   exact build terms (layman; no VIU/flag words; flag unconfirmables; **the expectation's
   assertion does NOT change — wording only**) → **VERIFY RUNNABILITY: the five checks on
   every case (step 2a) — precondition reachable · path exists · control where the step says
   · steps work in order · labels read from computed style** → VIU + set
   `viu_status`/evidence/`fresh_run` → **classify every failed check COSMETIC (correct + log)
   or SUBSTANTIVE (the smallest change, marker per 🔻 THE MARKER DECISION in step (2a) — HOLD **only**
   if the steps cannot be run at all, then + "mark BLOCKED, not failed" + RAISE) — *would a reader of the source
   recognise what the build offers as the same thing?*** → commit by pathspec → push via
   `update_case` (GET→diff→update→200/200; skip no-ops; API-section rule) + audit log → report
   tester-ready **with the honest N-of-M: how many cases had EVERY step verified, on which
   build marker**.
3. Leave real blockers blocked with precise reasons; note shared-tester limits.
4. Regenerate import + Blockers Tracker + results workbook (keep Case ID + Link columns)
   **+ `DIVERGENCES.md` for the QA lead — or state explicitly that there were none**.
5. **State the TestRail update status explicitly** in the final report.

## Self-seed to unblock — never stay blocked on data (Standing Rule 14)
This process MUST self-seed any missing data state rather than declare "blocked" or ask the user to
provide data. Playbook (learned 2026-07-23): (a) don't rely on the user to fix env/data/workplace
issues — find the switcher or another usable record yourself; (b) if the UI is flaky (Quasar
dialogs/selects intercepting clicks) switch to the API, and if the API is scoped/awkward switch to
the UI; (c) discover endpoints by probing — POST an empty/partial body and read the validation error
for required fields (e.g. `POST /api/work-orders/create` needs company_id+vehicle_id+workplace_id+
start_date+`is_vehicle_here:true`); (d) create the WOs/lines/parts/adjustments/roles/customer-defaults
needed (a customer default makes fees auto-apply); (e) for Quasar UI click by element-center
coordinate (`page.mouse.click`) not Playwright actionability clicks; (f) clean up ZZAUTOTEST data and
restore roles afterwards. Only a genuinely un-provisionable dependency (a server 500 on create, an
external device) is a real blocker — characterise it with evidence (endpoint + requestId), never bare
"NOT VERIFIED", and hand the user a layman step-by-step data-setup sheet for the one thing only a
human/dev can supply. User rule: "there is nothing like 'require seeding data' — make everything in
the build; do not find an excuse to keep yourself blocked."
