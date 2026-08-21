# SKILL 12 — VIU (the full build-accurate wording + Verify-In-UI pass)

> **Lane:** VIU. When the QA lead says **"VIU the test cases"** or **"do the VIU"**, he means
> **run `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` END TO END** (Rule 10). That is more than a
> build verification: it rewrites the case wording to the real build labels, verifies behaviour live,
> pushes to TestRail with a per-case audit log, re-stamps provenance, and regenerates deliverables.
> Authoring new cases is skill 10; a verdict-only pass is skill 11.
> **Created 2026-08-21.**

---

## 0. SHARED CORE BLOCK (identical in skills 10 / 11 / 12 — read it every time)

**(i) SESSION SURVIVAL — Rule 75 (detached-process architecture) + Rule 76 (quota discipline).**
- Long work runs as **ONE detached, idempotent, resumable script** plus a **pure-shell committer**
  gated on a **RUN-FLAG FILE** (`touch /tmp/<job>.RUNNING`; the committer loops while the flag
  exists). **NEVER gate on `pgrep -f <scriptname>`** — it self-matches and never terminates.
- The agent **launches and exits**; a **fresh one-pass agent verifies later** from the committed
  output.
- Rule 76: **never spawn for a trivial check.** Progress is self-reported **in commit messages**.
  **Batch ruthlessly.** **Answer in text** where a file is not needed.

**(ii) Rule 79 — STRATEGY FIRST.** Devise or recall the quota-efficient plan before starting: how many
cases per batch, where the checkpoint commits land, what is deferred, and what the single pass will
finish.

**(iii) SECRETS.** Cookies/tokens/passwords live **only in `/tmp`, `chmod 600`**, **never committed**.
**The repo is PUBLIC.** Before any commit:
`git diff --cached | grep -iE 'password|cookie|sv_sso_session|cf_clearance|PHPSESSID|Bearer |token=' && echo POSSIBLE-SECRET || echo SCAN-CLEAN`
— **refuse to commit on POSSIBLE-SECRET.**

**(iv) Rule 29 — NO WORK LOSS.** Commit **and push** after every completed step and **mid-run** on
long passes; **path-scoped `git add -- <paths>` only, never `git add -A`, never `/tmp`.** Keep
per-operation logs so a killed push can be verified against live TestRail and completed from exactly
where it stopped.

**(v) Rule 8 — IDs.** Always pair an internal ID with its C-ID and
`https://shopview.testrail.io/index.php?/cases/view/<id>`, in chat as well as in files.

**(vi) Rule 36 — OUTSTANDING.** Every report **ENDS** with **"OUTSTANDING — what I need from you"**;
say **"nothing outstanding"** if true, never omit it.

> **⚠️ RULE-NUMBER HONESTY.** `CLAUDE.md`'s numbered Standing Rules currently **end at Rule 62**
> (verified 2026-08-21). Rules **69, 71, 72, 74, 75, 76, 77, 79, 80, 81** referenced here come from
> the QA lead's **later instructions** and are recorded from those; they are **not yet in CLAUDE.md's
> numbered list**. Ask him to confirm any point a decision turns on.

---

## 1. THE GATES BEFORE ANY VIU WORK

### 1.1 Rule 11 — ALWAYS ASK which process(es) to run
On a new/updated spec **or** a VIU request, ask whether the QA lead wants
(1) `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` (per-case wording + behaviour VIU) and/or
(2) `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` (whole-suite relevance/obsolescence +
regenerate all deliverables). **Do not assume — confirm which one(s) before proceeding.** They are
complementary: (1) fixes each case's words and behaviour; (2) decides which cases should exist.

### 1.2 Rule 80 — state the last-done date + build, then ASK
Before re-running a VIU, **say when it was last done and against which build/version**, then **ASK
whether to re-run.** Sources: the project's `PROJECT-STATE.md`, the newest `full-viu-*` /
`final-viu-*` / `build-verify-*` folder, and the cases' own Rule-54 sentence 2.

### 1.3 Rule 81 (as refined) — never auto-run source verification
The default logic is that cases must be **source-current** before a VIU verdict means anything — but
**do not auto-run it.** Instead: tell him the task needs source-current cases; give the **last
source-verify date + version**; **ASK whether to proceed WITH or WITHOUT** source verification; and
**WAIT.** If he says WITHOUT, the deliverable says plainly that the pass rests on cases last
source-verified on `<date>` against `<version>`.

### 1.4 Rule 22 — ask for the live-build check + access UP FRONT
List every item that needs live observation (labels, control presence/absence, behaviour, permission
gates, calculations, states, spec-vs-build) and request **fresh cookies + env/branch + feature-flag
state** before starting. If he declines the live check, proceed but **label every such item "not
live-verified this run"**.

### 1.5 The other hard gates
| Gate | Rule | What it means |
|---|---|---|
| **TestRail writes** | 6 | TestRail is the only real production system. No `update_case` / `add_case` / `delete_case` / run write without explicit permission. |
| **Jira creation** | 62 + the 2026-08-10 **"create nothing"** HOLD | Prepare the ticket text, present it with a recommendation, **stop at the button.** Permission is **per ask**. |
| **API-only findings** | 51 | Asked **separately**, even inside an approved batch. |
| **Automated cases** | 71 | **Never blanket-skip.** Read-assess → report → **HOLD for the QA lead.** |
| **Run sync after a push** | 34 / 47 | **UNION only** — a partial `case_ids` list deletes tests and their results. Snapshot before, verify every prior result by id after. |

---

## 2. WHAT "VIU" MEANS, END TO END (Rule 10 — the eight steps)

1. **Capture the EXACT on-screen labels LIVE** from the build — button text, field names, screen
   names, tab names, dialog titles, the navigation path, the step order. Build the wording glossary.
2. **Rewrite every case's Title / Preconditions / Steps / Expected Results** into build-accurate,
   layman, non-technical wording (Rules 7 + 9). **Never invented, never paraphrased.** Anything that
   **cannot be confirmed from the build is FLAGGED, not invented** (Rule 9).
3. **VIU-verify the behaviour LIVE with evidence captured that run** — screenshot or captured API
   response (Rules 12 + 13). For permission/role cases this means actually driving the UI **as** the
   role, **per role, per environment** — never derived from role definitions, `fe_permissions`, atoms
   or source code. A case is **VIU-Verified** only when its behaviour was directly observed;
   otherwise **Blocked / NOT VERIFIED with the reason stated.**
4. **Checkpoint-commit** (Rule 29) — mid-run, not only at the end.
5. **Push to TestRail via `update_case`** with a **per-case audit log**, subject to that project's
   authorisation. Verification follows **Rule 50** (see §4).
6. **STAMP OR REFRESH the Rule-54 provenance line in the SAME push** (see §5). **A push that corrects
   wording but leaves a stale or absent provenance line is not complete.**
7. **Regenerate deliverables** — Blockers Tracker + results workbook + import, each carrying the
   **TestRail Case ID + Link** columns (Rule 8).
8. **Report each area tester-ready and ALWAYS state the TestRail update status explicitly.**

---

## 3. THE LINE THAT MUST NEVER BE CROSSED (Rules 57 + 58 + 25)

**VIU corrects the LABELS. It never corrects the EXPECTATION.** The QA lead's own words:
*"'the case should be matched to the build' … meant that the test case should be VIU'd from the
build"* — and *"The expected behaviors are NOT the ones 'how the build is behaving'."*

- **From the build we take exactly two things:** the labels/navigation path, and the pass/fail/
  deviation verdict. **Nothing else.**
- Expected behaviour comes only from the documents — **(a)** the PRD/spec · **(b)** the epic's stories
  · **(c)** the PO's verified answers · **(d)** the design (Claude design / Figma / technical design)
  · **(e)** Figma · **(f)** new `.md` files shared with us · **(g)** any newer written statement
  shared with us. **The list is open-ended; the build is never on it.**
- **If the build differs, the case KEEPS the documented expectation** and becomes a **DEVIATION with a
  ticket**. Never the reverse. **If the expectation bends to whatever shipped, the case can no longer
  fail — and a test that cannot fail is not a test.**
- **A closed ticket is not a spec change.** "Accepted" / "obsolete" / "not reproducible" is a decision
  about whether to fix. The marker carries it: `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)`.
- **Rule 58 — an ambiguous source is NEVER resolved by looking at the build.** Hold the case, cite the
  open question on it, and ask (Rule 55). **The quote-back test:** if the new expectation cannot be
  quoted back to the source text, **the edit is invalid** — reverted or held, not shipped with a
  hopeful provenance line.
- **Rule 25 — every deviation quotes the source verbatim** (document + version + anchor + date + the
  exact wording). If the expectation turns out to be in **no** source, say so: the build is probably
  compliant and **the repair is REMOVAL or scope-conditional wording (Rule 42), never substitution.**
- **THE DIAGNOSTIC TO WATCH FOR (the hardest failure to spot):** a case whose **steps were correctly
  VIU'd** while its **expected result was quietly changed in the same edit** looks freshly maintained
  and its provenance line looks current. **That is worse than an obviously stale case.** When
  auditing, diff the **expected result against its cited source**, never against how recently the case
  was touched.

---

## 4. THE WRITE PHASE — RULE 50, AND THE TWO TESTRAIL TRAPS

**Rule 41 — touch a case, re-verify the WHOLE case.** There are no surgical edits. Any case opened for
any reason gets re-read end to end against the current spec before saving, and its `refs` re-validated.
Log per case: **"re-verified whole against `<spec document + version + date>`"** plus the fields
checked (title · preconditions · steps · expected · refs · notes) and any second finding the re-read
produced. **A log naming only the edited field is non-compliant.** Opening a case is the cheapest
chance we get to notice it is stale — and a surgical edit stamps it with a fresh "Updated" date that
makes it **look** current.

**Rule 50 — exhaustive then exact.**
- **Exhaustive:** every case, every field, no sampling. A big population changes the schedule, not the
  scope: batch, checkpoint, finish, and state the exact number done and the exact remainder.
- **Exact:** re-GET each write and **byte-compare against the intended payload**, with every field you
  did **not** intend to change **proven byte-identical** to its pre-write snapshot. Claimed
  **non-writes** proven byte-identical **including `updated_on` / `updated_by`**.
- **On a mismatch the write FAILED: STOP the batch**, report both byte sequences, do not retry blindly.

**TRAP 1 — `update_case` RE-RENDERS ANY TEXT FIELD YOU OMIT.** It wraps omitted `custom_preconds` /
`custom_steps` in `<p>` tags and turns `\n` into `\r\n`. **Therefore send ALL FOUR text fields on
EVERY payload** — `custom_preconds`, `custom_steps`, `custom_expected`, and `refs` when it changes. A
field sent explicitly is stored verbatim.

**TRAP 2 — this project shows markup LITERALLY to the tester.** Raw `<ol>` / `<li>` and raw `<p>` are
visible in the case text, so **use plain numbered text with `<br>` line breaks — NOT bare `\n`, and
not HTML lists.** Sweep for raw markup after the push and report any case that still shows it.

**Declared normalisations (assert them explicitly; accept nothing else):** `refs` splits on commas,
trims each entry, rejoins with a bare comma, and **rejects any single entry over 248 characters**
(HTTP 400 *"Field :refs does not match the required pattern."*); `case_title` and `case_refs` on run
**results** are read-time echoes. Any newly-found normalisation must be **proven and recorded** in
`build/APP-ACTIONS-PLAYBOOK.md` §J before it is relied on.

**Run safety (Rules 34/47):** `update_run` REPLACES the selection — **union only**, snapshot
`get_tests` + `get_results_for_run` first, and afterwards prove the case_id sets equal **both
directions** and **every prior result present BY ID** with no graded field changed. **No result is
ever logged to someone else's run without explicit permission.**

---

## 5. WHAT EVERY VIU'D CASE MUST END WITH

**(a) The Rule-54 provenance line — two sentences, never merged.**
- **Sentence 1 (mandatory) — the SOURCE, documents only:** the epic and/or owning story + the
  specification **with its version** + the requirement reference, and/or the PO's answer file with its
  **link and date**, and/or the design artefact (an undated editable share link cited as exactly
  that). **The build is never named here.**
- **Sentence 2 (optional) — the RECORD OF CHECKING:** *"Last checked against build v3.5-16cf83f on
  8/5/2026."* Neutral language only; **"as per the build tested on …" is BARRED**. A case that FAILS
  on the build must not say "passed" or "verified" — sentence 2 records only that the check happened.
  Never checked against a build ⇒ omit sentence 2 or say so plainly.
- **Re-stamping is part of the push, and idempotent** — it **REPLACES** the line, never appends a
  second. Verify afterwards: exactly one provenance line, one build stamp, one marker per case.

**(b) A Rule-56 divergence sentence — only where there IS a divergence.** Where the case follows a
later decision that differs from an earlier source, one plain sentence saying **where the PO asked for
it** (file + link + date), **where it differs** and what the earlier source said, and **that we take
the latest as prevailing**. **Never add it where nothing earlier contradicted the decision** — that
manufactures a conflict and is itself a defect. A source that merely **agrees** is cited as a
**confirmation** under Rule 54, not disclosed as a difference.

**(c) The AUTOMATION marker — the very last line, blank line before and after.** One of:
`AUTOMATION: READY` · `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` · `AUTOMATION: HOLD - <reason>` ·
the **Rule-69** not-available-on-the-build `HOLD` form. A **tool flag never justifies HOLD**; only a
genuinely unobtainable thing does. **NOT-BUILT cases are excluded from any "ready to automate" figure.**
Run the **arithmetic gate** from the live cases, both ways: `READY + READY-EXPECT-FAIL = total − HOLD`.

**(d) Rule 61 on every EXPECT-FAIL case** — the exact observable **symptom** plus the **three
outcomes** (same symptom → fail, don't raise anything new; different failure → NEW problem, report it;
passes → the fix shipped, tell the QA lead), placed **before** the provenance line.

---

## 6. ROLES AND MULTI-LOGIN (Rules 26 / 26a / 74)

- **Rule 26 — reset every in-scope role to its TEMPLATE first.** Record the pre-reset set, reset,
  record the post-reset set — **the before→after diff is itself a finding**. Verify each template
  against the canonical spec matrix and **flag** any template that differs. Leave roles at template
  afterwards.
- **Rule 26a — re-reset on mid-run drift, persistently.** A concurrent session on the shared org can
  re-drift a role mid-run: reset it **again** and continue, then immediately re-observe. Only record a
  blocker if the reset itself fails or drift recurs so fast no observation can complete despite
  sustained persistence — and then document it precisely, never inferring a pass.
- **Rule 74 — the multi-login standard:** **reset the role to template → assign that role to the
  Technician quick-login user → test → restore Technician.** Prefer this over impersonation when a
  sibling worker shares the session, and note in the deliverable which route was used.

---

## 7. DELIVERABLES + REPORTING

Pass folder: `build/<project>/full-viu-<date>/` (or `final-viu-<date>/`) containing
`FINDINGS.md` · `CHANGES-MADE.md` · `testrail-execution-log.md` (per operation: operation · C-ID ·
HTTP status · verification result) · `RECHECK-QUEUE.md` (Rule 49) · `SOURCE-CURRENCY.md` (Rule 31) ·
`DELIBERATE-DECISIONS.md` (Rule 46) · `API-ASK.md` (Rule 51) · `RESUME.md` · `evidence/`.

Regenerated: the import (header **byte-identical** to its peers — hash it), the Blockers Tracker, the
results workbook (a tab per status + a Summary tab), and `testrail-id-map.csv` re-merged from live
(**the generator blanks C-IDs and drops `refs` on every rerun**). **Run the shredding guard** on the
import before delivering.

**Four counts must reconcile and be set-equal in BOTH directions:** live · local active · id-map ·
import.

**Report in the simple format** — plain layman words under headings like *"What I did / What I found /
What needs to be done / Other actions"*, **always state the TestRail update status explicitly**, and
**end with "OUTSTANDING — what I need from you."**

---

## 8. CROSS-REFERENCES (read these, don't copy them)

- `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` — **the method this skill executes.**
- `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` — the Rule-11 alternative/companion.
- `build/VIU-ACCESS-METHOD.md` — live access (egress, the three cookies, MITM/boot2 hydration).
- `build/APP-ACTIONS-PLAYBOOK.md` — action recipes + §J TestRail/API declared facts (Rule 27).
- `build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md` — the 4-layer live permission VIU.
- `build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md` — the Rule-28 gate if wording changes are extensive.
- `build/MISSING-TRACEABILITY-PROCESS.md` — a standard sub-step of any VIU pass.
- `build/TESTING-RUNBOOK.md` · `build/NO-WORK-LOSS-STRATEGY.md` ·
  `build/OUTSTANDING-ITEMS-REGISTER.md` · `build/PROCESS-CATALOG.md`.

**Do NOT read `CLAUDE.md` end to end** — ~5,000 lines, context thrash. `grep -n` for what you need.

---

## ⚠️ RELATIONSHIP TO THE PRE-EXISTING `00`–`08` SKILL SET (recorded 2026-08-21)

`build/skills/` was **empty** when this file was written and the mature, adversarially-audited
`00`–`08` set arrived from another worker on the next fetch. **Nothing has been merged or deleted.**

- **`build/skills/00-COMMON-CORE.md` EXISTS and should be read** — it is the shared core for that set
  (honesty bar · TestRail write discipline and hazards · runs · foreign cases · access mechanics ·
  environment · session survival · git on a shared branch · secrets · authority · reader-facing
  standards · the provenance line · the `AUTOMATION:` marker · the project fact sheet §17 · finality
  §16).
- **Overlapping siblings:** `01-CASE-BUILD.md` (authoring) · `02-SOURCE-CHECK.md` (source currency) ·
  `03-RUN-CHECK.md` (driving the build) · `04-TESTER-READY.md` (handover) · `06-DEFECT-PREP.md`
  (ticket prep), with `COVERAGE-MATRIX.md` as that set's completeness proof.
- **Where this file and its sibling disagree, STOP and ask the QA lead.** Do not pick a side, do not
  merge, do not delete. **One disagreement is already known:** `00-COMMON-CORE.md` §16 states all
  three branches are **FINAL**, while this file carries Rule 60's "never declared final" plus the
  2026-08-10 **per-report** finality ruling — a source-currency question for him.

Also read build/skills/13-CROSS-SESSION-SAFETY.md (Rules 82–87: real secret-scan gate, lane locks, tester-readiness gate, no-build-yet honesty, verify-from-committed-evidence, case-body snapshots).

---

**Rule 88 — LANE-SESSION CONTEXT DISCIPLINE:** never read `CLAUDE.md` end-to-end (grep it); never bulk-read case bodies or CSVs into context (script it to a file, read a bounded summary); batch writes in a script; long jobs use the Rule-75 detached pattern with progress in commit messages; do NOT spawn subagents for work you can do directly; stop and report at the budget tripwire.
