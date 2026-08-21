# SKILL 11 — BUILD VERIFICATION (verifying existing cases against the running build)

> **Lane:** verification. This skill covers driving existing test cases against a live build to
> produce PASS / DEVIATION / HOLD verdicts and a testers' defect list.
> It does **not** cover authoring new cases (see `build/skills/10-TEST-CASE-CREATION.md`) and it is
> **narrower than a full VIU pass** (see `build/skills/12-VIU.md`, which also rewrites wording and
> pushes to TestRail).
> **Created 2026-08-21.**

---

## 0. SHARED CORE BLOCK (identical in skills 10 / 11 / 12 — read it every time)

**(i) SESSION SURVIVAL — Rule 75 (detached-process architecture) + Rule 76 (quota discipline).**
- Long work runs as **ONE detached, idempotent, resumable script** plus a **pure-shell committer**
  gated on a **RUN-FLAG FILE** (`touch /tmp/<job>.RUNNING`; the committer loops while the flag
  exists). **NEVER gate on `pgrep -f <scriptname>`** — the pattern matches the watcher's own command
  line and never terminates.
- The agent **launches and exits**; it does not sit and watch. A **fresh one-pass agent verifies
  later** from the committed output.
- Rule 76: **never spawn for a trivial check.** Self-report progress **in commit messages**. **Batch
  ruthlessly.** **Answer in text** where a file is not actually needed.

**(ii) Rule 79 — STRATEGY FIRST.** Devise or recall the quota-efficient plan before starting: which
cases this pass drives, in what batches, what is deferred, and where the checkpoints are.

**(iii) SECRETS.** Cookies/tokens/passwords live **only in `/tmp`, `chmod 600`**, **never committed**.
**The repo is PUBLIC.** Before any commit:
`git diff --cached | grep -iE 'password|cookie|sv_sso_session|cf_clearance|PHPSESSID|Bearer |token=' && echo POSSIBLE-SECRET || echo SCAN-CLEAN`
— **refuse to commit on POSSIBLE-SECRET.**

**(iv) Rule 29 — NO WORK LOSS.** Commit **and push** after every completed step; **path-scoped
`git add -- <paths>` only, never `git add -A`, never `/tmp`.** Checkpoint **mid-run** on long passes,
and keep per-operation logs so a killed run can be verified against live state and resumed exactly
where it stopped.

**(v) Rule 8 — IDs.** Always pair an internal ID with its C-ID and
`https://shopview.testrail.io/index.php?/cases/view/<id>` — in chat as well as in files.

**(vi) Rule 36 — OUTSTANDING.** Every report **ENDS** with **"OUTSTANDING — what I need from you"**;
say **"nothing outstanding"** if that is true, never omit the section.

> **⚠️ RULE-NUMBER HONESTY.** `CLAUDE.md`'s numbered Standing Rules currently **end at Rule 62**
> (verified 2026-08-21). Rules **69, 71, 72, 74, 75, 76, 77, 79, 80, 81** referenced here come from
> the QA lead's **later instructions** and are recorded from those instructions; they are **not yet
> in CLAUDE.md's numbered list**. Ask him to confirm any point a decision turns on.

---

## 1. THE TWO GATES THAT COME BEFORE ANY WORK

### 1.1 Rule 80 — state the last-done date and the build, then ASK
Before re-running a verification, **say when it was last done and against which build/version**, then
**ASK whether to re-run it.** Do not silently repeat a pass that was done days ago against the same
marker. Sources for the last-done facts: the project's `PROJECT-STATE.md`, the latest
`build-verify-*/` or `full-viu-*/` folder, and the cases' own Rule-54 sentence 2.

### 1.2 Rule 81 (as refined) — never auto-run source verification
The default logic is that **the cases must be source-current before a build verdict means anything**.
But **do NOT auto-run the source verification.** Instead:

1. Tell the QA lead the task needs source-current cases.
2. Give him the **last source-verify date + the source version(s)** it was done against.
3. **ASK whether to proceed WITH source verification or WITHOUT it.**
4. **WAIT for his answer.** Do not start either way.

If he says **WITHOUT**, the deliverable must say plainly that the verdicts rest on cases last
source-verified on `<date>` against `<version>`.

### 1.3 The other ask-first gates
| Gate | Rule | What it means here |
|---|---|---|
| **TestRail writes** | 6 | No `update_case` / `add_case` / `delete_case` / **run result** write without explicit permission. |
| **Jira ticket creation** | 62 + the 2026-08-10 **"create nothing"** HOLD | Write the finding up, log it, present the **ready-to-file** text with a recommendation — **stop at the button.** Permission is **per ask**; an earlier batch approval never covers a later ticket, and the quality of the finding is not permission. |
| **API-only findings** | 51 | Ask **separately**, even inside an approved batch. The test: if the defect is invisible to a user **and** to a manual tester — reachable only by calling an endpoint with a request the product's own screens never send — it is **API-related**. If the same failure also occurs through the screens, it is **user-facing** despite technical evidence. |
| **Automated cases** | 71 | **Never blanket-skip them.** ALWAYS **read-assess first**, **report** what you found, then **HOLD for the QA lead's decision.** |
| **Which process** | 11 | On a new/updated spec or a VIU request, **ASK** which process(es) to run. |
| **Live check + access** | 22 | Ask up front for cookies + env/branch + feature-flag state, naming every item that needs live observation. |

---

## 2. STEP 1 — CAPTURE THE BUILD MARKER, AT BOTH ENDS

At **pass start** and again at **pass end**, read and record:

- `<meta name="app-version">` from `index.html` (e.g. `v3.5-16cf83f`)
- the **`last-modified`** header and the **`etag`** on `index.html`
- the **sha256** of `index.html`
- the **UTC timestamp** of each read

Then **prove they are byte-identical across the reads** — that is what shows **nothing redeployed
under the pass**. Without a build marker a later "re-check" is meaningless, because nobody can tell
whether the build changed.

**Rule 59 — re-read the sources immediately before the writes begin**, not only at pass start. Record
**both** timestamps in the execution log and state the verdict of the second read (unchanged, or what
moved and what was re-derived). A log showing only one source-read timestamp is non-compliant.

---

## 3. STEP 2 — WHAT THE BUILD MAY AND MAY NOT TELL US (Rule 57)

**From the build we take exactly two things:**

1. the **exact on-screen labels and the navigation path** (Rule 9), and
2. the **PASS / FAIL / DEVIATION verdict**.

**Nothing else.** Not the assertion, not the rule, not the "accepted behaviour". If the build differs
from the documented expectation, **the case keeps the documented expectation** and becomes a
**DEVIATION with a ticket**. Never the reverse.

**A closed ticket does not change the expected behaviour.** "Accepted", "obsolete" and "not
reproducible" are triage decisions about whether to **fix** — not spec changes. If the spec requires X
and the build does Y, the case still expects X, and the marker qualifies the closed ticket
(`AUTOMATION: READY - EXPECT FAIL (SV-xxxx)`) so nobody waits for a fix that is not coming.

**Rule 25 — every DEVIATION quotes its source verbatim:** the document, its version, the anchor, the
date, and the exact wording the build departs from. If the expectation turns out **not** to be in any
source (design-only detail, over-specified enumeration), say so — the build is probably compliant and
**the repair is REMOVAL or scope-conditional wording (Rule 42), never substituting what the build
does.**

**Rule 58 — an ambiguous source is never resolved by looking at the build.** Hold, cite the open
question on the case, ask.

---

## 4. STEP 3 — DRIVE THE CASES LIVE

- **Rules 12 + 13 — observed, never inferred.** A verdict is only PASS/FAIL when it was **directly
  observed live with evidence captured that run** (screenshot / captured API response). Anything not
  directly observed is labelled **NOT VERIFIED / Blocked-with-reason** — never silently derived. If
  the session dies mid-run, **STOP and say plainly what could not be verified and what is needed.**
- **Rule 14 — seed, don't block.** "The data state doesn't exist" is **not** an acceptable blocker on
  a disposable environment. Create the state: seed the work order / line / part / core / invoice /
  PO+delivery, assign a customer default, create a fresh staff member. Use the self-seed playbook in
  `build/APP-ACTIONS-PLAYBOOK.md` (Rule 27 — reuse the recorded recipe; never re-discover). Switch to
  the API when the UI is flaky and to the UI when the API is scoped; discover endpoints by probing
  with a partial body and reading the validation error; click Quasar controls by element-centre
  coordinate. Only a genuine, unprovisionable external dependency is a blocker — and then it is a
  **fully-characterised labelled verdict**, never bare "NOT VERIFIED".
- **Rule 74 — the multi-login standard for role/permission work:** **reset the role to template →
  assign that role to the Technician quick-login user → test → restore Technician.** Do the
  before/after permission read so the reset diff is itself recorded.
- **Rule 26 (+26a)** — reset every in-scope role to template **first**, verify each template against
  the spec matrix, and if a role **re-drifts mid-run** (a concurrent session on a shared org),
  **re-reset and continue** — persistently, then immediately re-observe. Leave roles at template.
- **Look twice before calling a defect.** Two near-miss false defects were avoided by re-checking, and
  one of them was ours: a "service is broken" report turned out to be a coordinate click landing on
  nothing because the Save button sat below the fold (`scrollIntoViewIfNeeded()` then click → 201/200).
  **A missed click is not a defect.**

---

## 5. STEP 4 — PROVISIONAL FINDINGS AND THE RE-CHECK QUEUE (Rules 49 / 60 / 61 / 77)

**Rule 49 — a non-final build yields PROVISIONAL findings only.** Four obligations, every time:

1. **Record the build marker** (see §2).
2. **Open a dated `RECHECK-QUEUE.md`** in the pass folder, status header **OPEN/CLOSED**, one row per
   case verdicted: internal ID · C-ID · link · what was observed · what was concluded · date + build
   marker · **the re-check obligation**.
3. **Stamp the provenance on the case** — the build marker lives in **Rule 54 sentence 2 only**.
4. **Never claim completeness** — a non-final build is at best a **PARTIAL** source and must name its
   shortfall.

**What the queue covers (scoped by Rule 61):** the queue carries what the automated suite **cannot**
see — every `AUTOMATION: HOLD`, every never-observed case, and any verdict that was never automated.
Their trigger is **the thing they are actually waiting on** (a PO answer, an access blocker clearing,
a feature shipping, a drag our tooling cannot perform) — **not a deploy.** The close condition is
unchanged: **100% of rows re-verified, no sampling**, and a passing automated run only counts if it
**actually exercises** the row.

**Rule 60 — the layer split (what a redeploy really invalidates):**
- **layer 1** — on-screen labels + navigation path
- **layer 2** — the pass / fail / deviation verdict
- **layer 3** — only the **`HOLD` half** of the markers; plain `AUTOMATION: READY` asserts
  *automatable*, not *currently passing*, so it is **build-independent** and survives a redeploy.
- **Everything else** — the expectation, the requirement anchor, the spec version, the epic/story
  reference, traceability, Rule-54 sentence 1 — is **build-independent** (because expectations come
  from documents, Rule 57).
- **"Final" means handed off / feature-complete, NOT "the code will never change."** A redeploy still
  invalidates layers 1–2 even on a final report. What finality removes is the ambiguity between an
  **unfinished feature** and a **defect**.
- **Never let "the branch is not final" become a blanket caveat** — report exact numbers: *"N of M
  observed on build `<marker>`; the remaining M−N carry their last recorded check."*

**Rule 61 — the automated suite is the monitor.** Each `READY - EXPECT FAIL` case names the exact
observable **symptom** and its **three outcomes**, so a shipped fix (outcome 3) or a changed failure
(outcome 2) is reported by the next automated run — no re-verification pass, no ticket polling.
**Ticket status is NEVER read as evidence about the build.**

**Rule 77 — the validity window.** A verdict taken within **≤ 3 builds** and **≤ 3 source versions**
of the current state **still counts** — but **show the date** (and the build/version) alongside it, so
the reader can judge. Outside that window it is stale and must be re-driven or labelled.

---

## 6. STEP 5 — IF (AND ONLY IF) WRITES ARE AUTHORISED

**Rule 50 — EXHAUSTIVE then EXACT.**
- **Exhaustive:** every case, every field — not only the field you came to change. No sampling, no
  "representative subset", no "the important ones". A large population changes the **schedule**, not
  the scope: batch it, checkpoint it (Rule 29), finish it, and **state the exact number done and the
  exact remainder**.
- **Exact:** re-GET every write and **byte-compare against the intended payload**, with **every field
  you did not intend to change proven byte-identical** to the pre-write snapshot. Every claimed
  **non-write** proven by a byte-identical snapshot **including `updated_on` / `updated_by`**.
- **On a mismatch the write FAILED: STOP the batch**, do not proceed, report both byte sequences.
  Never retry blindly, never log it as success.
- **Declared normalisations** (accept only these, and assert them explicitly): `refs` splits on
  commas, trims, rejoins with a bare comma, and rejects any entry > 248 chars; `case_title` and
  `case_refs` on run **results** are read-time echoes; and **`update_case` re-renders any text field
  you OMIT from the payload** — so **always send all text fields** (`custom_preconds`,
  `custom_steps`, `custom_expected`, plus `refs` when it changes). Any newly-discovered normalisation
  must be **proven and recorded** in `build/APP-ACTIONS-PLAYBOOK.md` §J before it is relied on.
- **The audit log records per operation: the operation · the target C-ID · the HTTP status · the
  verification result.** A log recording only "200 OK" is non-compliant.
- **Reproductions name every piece of test data** by its exact on-screen name — the canned line,
  customer, contact, part, asset, WO state, location, role/user, date range — plus what was tried and
  ruled out. An unnamed variable is an unverified variable.

**Rules 34 + 47 — run sync, UNION ONLY.** `update_run` **REPLACES** the selection, so a partial
`case_ids` list **deletes tests AND their recorded results.** Snapshot `get_tests` +
`get_results_for_run` **before**, send the **full union**, then verify after: test count as expected,
**case_id sets equal in both directions**, and **every prior result present BY ID** with no graded
field changed. Record the test count before→after. Scope: only the active projects' runs; other and
completed projects' runs are ignored entirely.

---

## 7. THE DELIVERABLE

**Primary deliverable: a `Defects-for-Testers` workbook** — the plain-language list a manual tester
can act on. Shape (Rule 16 — mirror the established layout; Rule 19 — human-readable filename):

`build/<project>/build-verify-<date>/<Project>_Defects-for-Testers_<date>.xlsx`

Columns, one row per non-passed case: internal ID · **C-ID** · **TestRail link** · case title ·
what the document requires (with its anchor + version) · **what the build actually does** (observed,
with evidence reference) · verdict (DEVIATION / HOLD / NOT OBSERVED) · ticket key if one exists ·
and a plain **"What needs to be done"** in words a non-technical QA can act on. **Never leave a bare
DEVIATION / Failed / Blocked without that plain next step.**

Alongside it, in the same dated folder:
`FINDINGS.md` · `RECHECK-QUEUE.md` · `SOURCE-CURRENCY.md` · `CHANGES-MADE.md` (if any writes) ·
`testrail-execution-log.md` (per-operation) · `API-ASK.md` (Rule 51 split) · `DELIBERATE-DECISIONS.md`
(Rule 46) · `evidence/`.

**Closest existing canonical example in this repo:**
`build/report-suite/build-verify-2026-08-10/` — `BUILD-VERIFICATION-2026-08-10.md`,
`LABEL-LAYER-2026-08-10.md`, `RESUME.md`, `evidence/`, `tools/`.
*(Honest note: no `*Defects-for-Testers*.xlsx` file exists anywhere in the repo as of 2026-08-21 —
the first one this lane produces sets the template, so build it in the established workbook shape:
a tab per verdict status plus a Summary tab, C-ID + link columns throughout.)*

**Report in the simple format** (Rule: simple-format status updates) — plain layman words under
headings such as *"What I did / What I found / What needs to be done / Other actions"* — and **end
with "OUTSTANDING — what I need from you."**

---

## 8. CROSS-REFERENCES (read these, don't copy them)

- `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` — the wording + VIU method.
- `build/VIU-ACCESS-METHOD.md` — getting live access (egress, the three session cookies, MITM/boot2).
- `build/APP-ACTIONS-PLAYBOOK.md` — the indexed staging action recipes + §J TestRail/API facts.
- `build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md` — the 4-layer live permission method.
- `build/PROD-VS-STAGING-COMPARE-METHOD.md` — 100%-live two-environment comparison.
- `build/TESTING-RUNBOOK.md` · `build/NO-WORK-LOSS-STRATEGY.md` ·
  `build/OUTSTANDING-ITEMS-REGISTER.md` · `build/PROCESS-CATALOG.md`.

**Do NOT read `CLAUDE.md` end to end** — ~5,000 lines, context thrash. `grep -n` for what you need.
