# Schedule — PROJECT STATE (canonical cold-resume doc)

## 0-RECHECK-ATTEMPT-2026-08-05. **THE RE-CHECK COULD NOT RUN — NO SESSION ON THE NEW BUILD. NEWEST STATE.**

**Read this first, then `build/schedule/recheck-2026-08-05/`** (SOURCE-CURRENCY · FINDINGS ·
testrail-execution-log · RECHECK-QUEUE · FILED · WRITE-PLAN + `evidence/`).

A **full Standing Rule 49 re-check of all 165 rows** against the redeployed branch was attempted and
**0 of 165 rows were re-observed.** The Schedule cookies (`/tmp/schedule-viu/cookies.json`, dated
2026-08-04 11:31 UTC, ~24.5 h old) return `HTTP 401 {"error":"sso_required"}`. The **Filters and Report
Suite** sets are dead too, and the Filters cookie also 401s against the Schedule API — so it is the
ordinary **~24-hour expiry across the whole `.qa.shopview.com` estate**, compounded by the deploy, and it
**cannot be worked around from the container.**

**ALL 165 VERDICTS ARE PROVISIONAL AND UNCONFIRMED.** No verdict was inferred to fill the gap (Rule 12).

**Build marker, read three times this pass:** `v3.5-be42149` · `index.html` last-modified **Wed 05 Aug
2026 08:09:19 GMT** · etag `70e496609e155994b93f515db32d0289` — at **12:01:46Z** and **12:09Z**, and the
file was **byte-identical** between the reads, so **nothing redeployed under the attempt**. The 4 August
verdicts were measured on `v3.5-4873abe`, which is gone.

**ZERO WRITES ANYWHERE, and it is proven, not asserted.** All **165 cases byte-identical** before and
after — **30 fields each, `updated_on` and `updated_by` included, 0 differences**. **Run 357 untouched** —
165 tests, **429** result records, **every one present BY ID and byte-identical field by field**,
`case_id` sets equal **both** directions, `include_all` still false. **Jira: 0 writes.** **No foreign
cases exist in group 4254** (all 165 `created_by = 3`).

### What the pass DID establish, live

| Source | Verdict |
|---|---|
| **Spec** — Confluence `713031682` | **CURRENT at version 23**, and proven **exactly**: the live page body was fetched and word-diffed against our mirror — **0 runs of 6+ words exist live and are missing from ours**. The page's **in-body "Version" field reads `1.0`** — the Rule-31(a) trap, confirmed live. |
| **Epic SV-8685** | **CURRENT.** 26 direct children, verified two ways (`parent=` and `"Epic Link"=`) with **equal key sets both directions**. Changelog's last entry is 2026-08-04T07:07 (Stefan Vukovic, Severity + QA Test Plan) — administrative only. |
| **Our 10 tickets SV-8848…SV-8857** | **All still Open**, priority Low, parent the epic, story linked. **Not one is fixed.** Only change: Mudassir Qamar added label `FS-Schedule` to all ten. |
| **Story defects** | **STALE — now refreshed. 22, not 12.** Ten arrived after our ingest: 7 from Ayesha Khan (SV-8863/8864/8865/8867/8868/8869/8870) and 3 from Mudassir Qamar today (SV-8873/8874/8877). |
| **Designs / tech plan / PO answers** | CURRENT; no Rule-35 queue open for Schedule. |
| **The build** | **MOVED, and not observable.** |

### The findings that change our records

1. **Two of our four unticketed deviations now HAVE tickets, raised by other QAs.**
   **[SV-8834](https://shopview.atlassian.net/browse/SV-8834)** covers SCH-MODAL-03 =
   [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) **exactly** (same `1h / 1h`
   symptom) — **so the "eleventh ticket" ask is answered: it would be a duplicate.**
   **[SV-8874](https://shopview.atlassian.net/browse/SV-8874)** covers SCH-TOOL-03 =
   [C30041](https://shopview.testrail.io/index.php?/cases/view/30041), which decisions-register entry 8
   deliberately left unticketed. **Both cases' text still says "no developer ticket yet" — now false,
   queued for repair.**
2. **Two of our PASS verdicts are contradicted by accepted (Ready to Fix) defects, and they are probably
   right.** SV-8873 vs [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) — our evidence
   never says which **form** of the technician name we typed. SV-8868 vs
   [C29944](https://shopview.testrail.io/index.php?/cases/view/29944) — **we proved one status of many
   and called the filter good; one status is a sample.** Carried as open contradictions, not resolved in
   our favour. Their tickets untouched (Rule 38).
3. **Three candidate coverage GAPS** with no counterpart among our 165: SV-8863 (which view the module
   opens on), SV-8870 (drag-create in Month view), SV-8867 (reassigning a series member). **Not
   authored** — needs authorisation and live observation.
4. **Our epic record was wrong in four ways** (corrected in `SOURCE-CURRENCY.md` §2): 26 children not
   28; the 12 "epic-level Bugs" are **Story Defect subtasks of stories**; the SV-8826–8841 range is **16**
   tickets, **4 of them not Schedule at all** (2 Ahtasham Filters defects, 2 Ryan Fyfe unparented Bugs);
   and there are 22 story defects, not 12.
5. **16 raw-markup cases confirmed by searching all 165**, not by trusting the count. All named with
   C-ids in `FINDINGS.md` finding 7.
6. **0 of 165 carry an `AUTOMATION:` marker**; all 165 provenance lines name `v3.5-4873abe` + `8/4/2026`,
   **exactly once each, none doubled**.

### Deliverables: no regeneration needed, and that was verified not assumed

Live **165** = local active **165** (192 bodies − 27 retired) = id-map **165** (**0 blank C-ids**, `refs`
**165/165**) = import **165** rows. **id-map C-ids vs live: sets equal BOTH directions.** **Local vs live
text: 0 field mismatches** across all 165 on title/preconditions/steps/expected. **Shredding guard
PASSED** (0 shredded cells — the `gen_import.py` fix is holding). **Import header sha256
`a45eae40ec73b8ac` — identical to all five peer imports.** Nothing regenerated deliberately: a rerun
would blank the id-map C-ids and drop the `refs` column for no gain.

### How to resume, in order

1. **Get fresh cookies** for `https://sv8685.qa.shopview.com` — `sv_sso_session`, `PHPSESSID`,
   `cf_clearance` for `.qa.shopview.com` → `/tmp/schedule-viu/cookies.json`.
2. Read the build marker (start / mid / end). **If it is not `v3.5-be42149`, it moved again.**
3. Work `build/schedule/recheck-2026-08-05/RECHECK-QUEUE.md` — 165 rows, all `NOT YET`. Start with the
   10 priority rows named at the top of it.
4. Execute `build/schedule/recheck-2026-08-05/WRITE-PLAN.md` as **ONE write per case** — provenance
   re-stamp + automation marker + the 16 formatting repairs + the 2 false "no ticket" sentences.
5. Check the arithmetic gate: **READY + READY-EXPECT-FAIL must equal the ready-to-automate figure.**
6. **Then** build `READINESS-2026-08-05.md` in the Filters template. **It was deliberately NOT written
   today** — a readiness report is a statement about a build, and we could not see the build; publishing
   one would have restated 4 August's numbers under today's date. `READINESS-2026-08-04.md` is kept and
   banner-marked *"its verdicts are no longer confirmed"* rather than superseded, because there is
   nothing newer to supersede it with.

---

## 0-BUILD-MOVED-2026-08-05. **THE QA BRANCH WAS REBUILT. NOTHING WAS WRITTEN. NEWEST STATE.**

**Read this first.** Source: `build/automation-markers-2026-08-05/SCHEDULE-HALTED.md` + `BUILD-MARKERS.md`.

The 5 August automation-marker pass was authorised for Schedule and **deliberately wrote nothing**,
because the branch **redeployed at 08:09 UTC that morning**:

| Field | The 165 verdicts were measured on | Serving now (read 11:34 UTC, 5 Aug) |
|---|---|---|
| `<meta name="app-version">` | `v3.5-4873abe` | **`v3.5-be42149`** |
| `index.html` last-modified | Tue, 04 Aug 2026 14:47:39 GMT | **Wed, 05 Aug 2026 08:09:19 GMT** |
| etag | `9b4b1fc776ebbfb04a9a0ca051d847f7` | **`70e496609e155994b93f515db32d0289`** |

**All 165 cases proven byte-identical before and after, including `updated_on` and `updated_by`** — so
"nothing was written" is evidence, not an assertion. **Run 357 also proven untouched:** 165 tests,
**429** result records, `case_id` sets equal both ways, every prior result present **BY ID** and
byte-identical field by field.

**What is and is not in doubt, honestly.** **142 of the 165 markers were safe** and did not depend on
the build (138 `READY`, which asserts *automatable* not *currently passing*; 2 waiting on Branko for the
shop-closure contradiction; 2 that cannot be set up on this estate). **23 were NOT safe** and are the
whole reason for stopping — **19** would have asserted `READY - EXPECT FAIL (SV-88xx)`, a claim the
product is wrong right now, and **4** would have asserted a feature *"is not in the product yet"* on a
build nobody has looked at. **All ten defect tickets (SV-8848 … SV-8857) were read live and are still
Open**, which makes it likely the 19 still reproduce — but likely is not observed (Rule 12).

**NEXT:** re-run `viu-2026-08-04/RECHECK-QUEUE.md` — **all 165 rows, no sampling** — against
`v3.5-be42149`, then write all 165 markers from the fresh verdicts. Or, on the QA lead's word, write
the 142 build-independent markers now and hold the 23.

> **Read this first to resume the Schedule project.** Single authoritative snapshot.
> Keep this project's memory SEPARATE from other projects; reuse shared infrastructure
> (staging/QA access method, harness scripts, TestRail API patterns, the two process
> docs) across all projects.

## 0. STATUS / WHAT'S LEFT TO DO — read first (Last updated 2026-08-04, after the live VIU + its recovery)

### 0.0-VIU-DONE  **THE LIVE VIU RAN, AND WAS RECOVERED AND FINISHED — 2026-08-04 (READ THIS FIRST; it SUPERSEDES §0.0-QA-ENV, which said no VIU had begun)**

**Resume order:** `build/schedule/READINESS-2026-08-04.md` → `build/schedule/recovery-2026-08-04/STATE.md`
→ `build/schedule/viu-2026-08-04/FINDINGS.md`.

**What happened.** The first-ever live VIU of the Schedule suite ran against QA branch
`sv8685.qa.shopview.com` (API `sv8685api.qa.shopview.com`), build **`v3.5-4873abe`**. The worker
driving it was cut off during its wrap-up; a recovery pass then verified everything it had done
against the live systems and finished the remainder. **Nothing was lost.**

**The headline: all 165 cases carry a DEFINITE verdict. Zero partly-observed, zero unobserved.**

| verdict | count |
|---|---|
| works correctly on the build | **138** |
| broken on the build (a ticket is open) | **19** |
| not built yet | **4** |
| held for Branko (the shop-closure contradiction) | **2** |
| cannot be set up on this estate | **2** |
| **ready to automate today** | **161** |

**Verified, not assumed.**

- **Build marker identical at FOUR reads** (start, mid-run, end, and the recovery re-read):
  `v3.5-4873abe`, `index.html` last-modified Tue 04 Aug 2026 14:47:39 GMT, etag
  `9b4b1fc776ebbfb04a9a0ca051d847f7`. **No redeploy**, so no observation is invalidated.
- **179 `update_case` operations total** — 169 by the original worker + **10 in recovery** — every
  one HTTP 200 and **byte-verified MATCH with 28 fields compared**, each intended field byte-equal
  to intent and every untouched field byte-identical to its pre-write snapshot. **0 mismatches.**
- **Run 357 proven untouched BOTH times:** `include_all` false, **165 tests**, **all 429 result
  records present BY ID**, case-id sets equal in both directions against the snapshot AND against
  the live case list. No case added or retired, so **no `update_run` union was needed**.
- **Provenance at Rule-54 STATE 2 on 165/165** — build date **and** marker — each present **exactly
  once**. **0 foreign cases** under group 4254; every case `created_by: 3`.
- **Four counts reconcile at 165 and are set-equal both ways:** live-ours · local active · id-map
  (0 blanks) · import.
- **0 titles over 80 characters** (longest exactly 80) · **0 cases carrying API content outside the
  API-titled section**.

**10 defects filed: SV-8848 … SV-8857** — all **type `Bug`, priority `Low`, `parent` SV-8685, owning
story linked, status Open**, each read back from Jira. **All ten are now named on their case** with a
link (the recovery fixed eight cases that still said *"has no developer ticket yet"*).

**The epic is now 28 children** — the 15 stories all `Ready for QA`, **SV-8812 Done** (it is this
branch), and **12 `Bug` tickets SV-8826…SV-8841 raised 2026-08-04 by Mudassir Qamar**: 6 confirmed
independently, 2 do not reproduce as written (SV-8830, SV-8827), **2 contradict Branko's own rulings
(SV-8835 VIN, SV-8829 money) — the rulings STAND and nothing was changed on either side**, and
**SV-8831 is a REAL coverage gap we missed** (a corrective case is drafted, not authored).

**⚠️ Rule-49 queue is OPEN.** Engineering has NOT declared `sv8685` final, so **all 165 verdicts are
PROVISIONAL** — `build/schedule/viu-2026-08-04/RECHECK-QUEUE.md`, one row per case, plus a recovery
addendum naming ten rows that now carry an extra obligation (check the ticket's status too).

**FIVE half-states the recovery caught — read these before touching anything:**

1. **A pre-existing shift was left damaged on the branch.** `ebdd3e03…` (work order **S-9379**,
   Xiriver Apparel) had been moved by the Day-view drag test; its **start time was restored but its
   owner and its length were not** — a different technician, 270 minutes instead of 720.
   **RESTORED**, and proven **byte-identical on all 14 fields**, series total back to 1980 minutes.
   **Lesson: a restore is not restored until it is compared FIELD BY FIELD.**
2. **The generated import was corrupt** — a newline between **every single character** of
   preconditions, steps and expected results, in all 165 rows. `gen_import.py`'s `joinlines()` did
   `"\n".join(x)` over its argument, and the live re-sync now writes those fields as **strings**
   where they had been **lists**, so the join iterated them letter by letter. **FIXED** (it splits a
   string first) and regenerated. **⚠️ The IDENTICAL bug is still in the Filters generator and has
   corrupted `testrail-import/filters-v1-testrail-import.csv` (all 110 rows)** — out of that pass's
   scope, on the outstanding register.
3. **The local case source had gone stale** for the four audit-repair cases — re-synced; local now
   byte-matches live on all 165 across title, preconditions, steps, expected and refs.
4. **17 cases claimed a defect had no ticket when 8 of them did** — corrected.
5. **2 cases leaked developer jargon into tester text** in non-API sections — cleaned.

**Reported, deliberately NOT changed:** **16 cases show raw `<ol>`/`<li>` markup** to the tester —
**this PREDATES the pass** (the same 16 are in the pre-write snapshot), and a repair is 16 writes
needing the QA lead's go-ahead; and **SCH-MODAL-03 = [C30010](https://shopview.testrail.io/index.php?/cases/view/30010)**
is a real deviation with **no ticket** (the time-logged bar reads full when nothing was clocked) —
an eleventh ticket is an open ask.

**Environment left clean:** the 3 `ZZAUTOTEST` roles already deleted (the org holds exactly its 11
system roles), the borrowed staff member (Henry Hess) back on **Technician**, seeded shifts on 9–11
Aug all removed, events unchanged at 4, exactly **1** technician with custom working hours and the
original ranges, and the location business-hours toggle still off (the overlapping working windows
are byte-identical to the snapshot).

**Deliverables index:** `READINESS-2026-08-04.md` · `recovery-2026-08-04/{STATE,
testrail-execution-log}.md` + `exec_fixes.py` · `viu-2026-08-04/{FINDINGS, COVERAGE-REDERIVATION,
AUDIT, GAP-HUNT, SURFACE-MATRIX, DELIBERATE-DECISIONS (22 entries · HIGH 3 / MEDIUM 7 / LOW 12),
RECHECK-QUEUE, API-ASK, SOURCE-CURRENCY, testrail-execution-log}.md` + `evidence/` (96 screenshots)
+ `snapshots/` · refreshed `provenance-2026-08-04/PO-RULING-DEFENCE.md` (all four Branko rulings
re-confirmed live).

**One API-only finding is written up and NOT filed** (Rule 51) — `viu-2026-08-04/API-ASK.md`.

### 0.0-QA-ENV  **SCHEDULE HAS A QA BRANCH — ITS FIRST EVER** (supplied 2026-08-04, read this first)

**Facts-and-credentials record only. NO VIU has begun, and none may begin without the QA lead's
explicit go-ahead** — he has **reserved that permission until the Report Suite is finished**.
Nothing on this branch has been touched: **not one network request has been made to it** (no
login, no probe, no page load).

| Fact | Value |
|---|---|
| App URL | **`https://sv8685.qa.shopview.com`** |
| API host | **`https://sv8685api.qa.shopview.com`** — ⚠️ **INFERRED from the `sv<number>api…` naming shape, NOT VERIFIED.** Do not treat it as fact until it answers |
| Branch naming | `sv8685` matches **epic SV-8685**, consistent with `sv8582` → Report Suite SV-8582 and `sv8785` → Filters SV-8785 (see `build/APP-ACTIONS-PLAYBOOK.md`) |
| Credentials | **SUPPLIED 2026-08-04.** They live **only** in **`/tmp/schedule-viu/cookies.json`** (`chmod 600`, directory `chmod 700`) — three cookies for `.qa.shopview.com`. **No value is recorded in this repo, and none ever may be (Standing Rule 6).** `/tmp` is ephemeral, so expect to ask for a fresh set when the VIU is authorised |
| Cookie lifetime | ~**24 hours**, or until a deployment — so a fresh set is likely needed at authorisation time |
| Related ticket | **[SV-8812](https://shopview.atlassian.net/browse/SV-8812)** "Set up a dedicated QA environment for testing" (the epic's 16th child, Board Backlog) — the ticket for this very thing. It was still in Backlog at last read; the branch appearing anyway is worth noting, not assuming |
| VIU status | **NOT STARTED — awaiting the QA lead's explicit go-ahead** |

**WHY THIS MATTERS: this is the FIRST QA branch Schedule has ever had.** Until an authorised VIU
runs against it, **all 165 active cases remain SPEC-VERIFIED ONLY** — nothing in this suite has
ever been observed on a running build, every case stays `VIU-Pending`, and every provenance line
stays deliberately at **Rule 54 state 1 (no build date)**. **Design-pinned is NOT verified**
(Rule 12) — the ~18 design-pinned on-screen labels stay unconfirmed.

**When the go-ahead comes:** ASK which process(es) to run (Rule 11), request a **fresh** cookie
set, and run the Rule-31 pre-flight on all sources first. Because the branch's finality has not
been stated either way, treat **Standing Rule 49** as live until engineering confirms otherwise —
open a `RECHECK-QUEUE.md` and record the build marker (`<meta name="app-version">`).

**OQ-3 is therefore HALF-ANSWERED:** the environment exists; the **feature-flag / settings state
is still unknown** and remains an open ask.

---

### 0.0-PROVENANCE  STANDING RULE 54 PROVENANCE RETROFIT — **EXECUTED 2026-08-04 (read after 0.0-QA-ENV)**

**Folder: `build/schedule/provenance-2026-08-04/`** — `SOURCE-CURRENCY.md` ·
**`PO-RULING-DEFENCE.md`** (the quote-ready defence pack) · `testrail-execution-log.md`
(per-operation) · `plan.json` · `exec-log.jsonl` · `snapshots/` · `tools/`.

**WHAT WAS DONE.** All **165/165** cases now END their Expected Results with a separator
line and one plain sentence naming **epic SV-8685** and the **Schedule specification
version 23**, plus that case's own § anchors taken from its own `refs`. This is Rule 54
**state 1 — NO build date**, because there is still no Schedule QA environment.

**HOW IT WAS VERIFIED (Rule 50).** `update_case` **ONLY** — 0 add, 0 delete, 0 section
move, 0 run write. **165 operations, every one HTTP 200 and byte-verified MATCH, 28 fields
compared per operation**, with every field we did not intend to change proven
byte-identical to its pre-write snapshot. **Run 357 verified untouched:** 165 tests
set-equal both ways, **all 429 result records present BY ID** (not by count),
`include_all` still false, every status count identical.

**WHAT THE RULE-41 WHOLE-CASE RE-READ FOUND.** All 165 cases were cold-read end-to-end
against spec v23. **1 fix:** SCH-HRS-04 = **C38849** — precondition 1 leaked a bare
internal cross-reference `(/02)` into tester-facing text; rewritten in the same write.
**0 other defects:** 0 malformed refs, 0 stale anchors (every cited § exists in v23),
0 titles over 80 chars, 0 empty fields, 0 Rule-4 misplacements, 0 internal-ID or C-id
leaks, 0 duplicate titles. **⚠️ The `gen_import.py` `clean()` bug that CAUSED the `(/02)`
is still unfixed** — it strips the ID but leaves the bracket, so a future regeneration
would reintroduce the pattern on any case carrying one.

**RULE-28 CROSS-CASE SWEEP: 0 contradictions.** 33 anchors are shared by 2+ cases; all 3
title-vs-expected keyword hits were checked individually and are **negation false
positives** (C29940, C30011, C30076 — the "opposite" word appears inside *"no …"* /
*"not …"*). Mixed provenance variants inside one anchor cluster are **correct, not a
defect**: only the case that actually contradicts a clause carries the ruling wording.

**THE HONESTY BREAKDOWN (Rule 54's clause, and the important part).**

| Variant | Cases | Which |
|---|---|---|
| **PO ruling overrides the spec text** | **5** | money: C30011, C30614, C38874 (Branko 2026-07-22 *"We do not show total $ anywhere in the schedule."* vs §4.9 *"with labor/total figures"*) · tooltip VIN: C30034, C30045 (Branko 2026-07-31 *"Vin is always visible on hover regardless of the toggle"* vs the §9 VIN row) |
| **Spec states it BOTH ways, NO ruling** | **3** | shop closures: **C30089 + C29983 (both HIGH risk)** + C29984 — §4.5 *"not skipped in V1"* vs §12 *"block the spread step"*, both live in v23, question **NQ-1 unanswered** |
| **Tech-plan limits** | **2** | C38863, C38873 (8-week / 120-shift caps exist nowhere in the spec) |
| **No spec anchor at all** | **5** | C38867, C38868, C38869, C38870, C38875 (tech-plan only — said in words, never invented) |
| **Plain** | **150** | the spec supports the expectation as written |

**FOUR OF THE FIVE items the QA lead listed turned out NOT to be live conflicts** —
v19–v23 folded Branko's answers in: right-click (spec agrees), modal Reassign (v23
deleted it), Week Export (both cases already deleted from TestRail), default hours (spec
agrees). Only the modal money figures is real. Detail in `PO-RULING-DEFENCE.md`.

**MECHANICS.** The spec version is **ONE constant** in `tools/classify.py`, not 165
strings. The stamper is **IDEMPOTENT — proven over three consecutive runs on all 275
cases across both projects**: a re-stamp REPLACES the line and never appends a second.
Local case source, id-map and import all regenerated; import header sha256 **identical to
all four peer projects**, 165 records, provenance on 100%, 0 VIU/flag words.

**SOURCE CURRENCY (Rule 31).** Spec **v23 CURRENT** (live body 58,584 chars — byte-length
identical to our mirror). Epic **SV-8685 gained a 16th child, SV-8812 "Set up a dedicated
QA environment for testing"** (Task, Board Backlog) — the ticket for the very thing
blocking our VIU; **all 15 stories moved Open → In Progress**, which changes *when* we can
verify, not *what* we expect, so no case content changed.

---

## 0-PRIOR. STATUS / WHAT'S LEFT TO DO (Last updated 2026-07-31)

### 0.0-COVERAGE  COVERAGE RE-DERIVATION vs spec v23 — DONE + PUSHED (2026-07-31, **LATEST — read this first**)

**Deliverables: `build/schedule/coverage-rederivation-2026-07-31/`** — `COVERAGE-REDERIVATION.md`
(the report) · `APPENDIX-A-full-matrix.md` (all 243 statements) · `AUTHORED.md` · `RULE-28-AUDIT.md`
· `testrail-sync-manifest-2026-07-31.md` (EXECUTED) · `testrail-execution-log-2026-07-31.md` ·
`coverage-matrix.json` · `tools/` (re-runnable) · `pre-push-snapshot/`.

**TALLY: 164 → 165 ACTIVE** (192 authored − 27 Retired), all `VIU-Pending`.
**+1 case (SCH-PERM-13 = C38926) · 1 case extended (SCH-DND-07 = C29961) · 0 retired · 0 deleted.**

**WHY:** our coverage matrix was built against Confluence **v18**. Earlier the same day we worked
from the **v18→v23 DIFF**, which proves the CHANGES are covered but **not** that nothing was
already missing. On **Filters** that same exercise found ~26 uncovered requirements. This pass
re-derived Schedule coverage from **zero** against the CURRENT spec.

- **Enumerated 243 atomic statements** from the live v23 body with a **completeness proof**:
  242 non-blank body lines consumed == 242 (every line lands in exactly one statement).
  Per-section totals in the report.
- **Mapped every statement** to case(s) by **anchor + text overlap**, then read every section by
  hand (an anchor proves citation, not assertion), backed by 3 mechanical detectors and a
  50-label spec-string sweep (49/50 present).
- **RESULT: 206 COVERED · 4 COVERED-FLAGGED · 30 NOT-TESTABLE (itemised, with reasons) ·
  3 GENUINE GAPS** = **210 of the 213 testable statements covered (98.6%)**.
- **The 3 gaps, all CLOSED this pass:**
  **G1** §4.3 *"no swap flow"* — only the "no cap" half was covered; nothing observed that a
  SECOND technician dragged onto a line is **added alongside** rather than replacing the
  incumbent → **SCH-DND-07 (C29961) EXTENDED** (+2 steps, +2 expected).
  **G2+G3** §14.1 **default role → Schedule tier mapping** — the 9 role names appear in **no**
  case; SCH-PERM-01..06 test the tiers abstractly, so a build shipping Technicians with Edit
  would have passed the whole permission set → **NEW SCH-PERM-13 = C38926** (one case, not two —
  one observable behaviour).
- **REVERSE CHECK CLEAN:** 0 dangling `§` anchors across all 165 cases; **no** case anchored to
  removed-upstream text (all 8 R1–R8 clauses checked — the only mentions are negative assertions
  or history notes); **6** cases cite no v23 statement and all 6 are **tech-plan-derived**
  (SCH-REG-01..04, SCH-API-04, SCH-EDGE-07) — 0 orphans.
- **3 spec-residue FLAGS for Branko — no case changed** (each resolved by an explicit precedence
  rule, none guessed): **F1** §12 "closures block the spread step" vs §4.5 "not skipped in V1"
  (= contradiction **X1** / his **NQ-1**; §4.5 is the v22 edit → latest-wins, SCH-EDGE-05 is on
  the right side); **F2** §4.9 "line(s) **with labor/total figures**" vs SCH-MODAL-04's no-money
  assertion (his 2026-07-22 Q3 ruling + design + tech-plan D6/NFR-002 win, Rule 33);
  **F3** §14.1 still says "**right-click** context menu" (he ruled left-click only).
- **Rule 28 (3 dimensions + Stage-2b):** 2 KEEP / 2 SENSIBLE / 2 traceable+layman-runnable;
  **0 contradictions**; **1 near-miss pre-empted** — SCH-DND-07 E4 ("the first technician stays")
  vs SCH-REAS-01 E3 ("the source technician is removed") are two different actions, so step 3 now
  says *"drag the line from the sidebar again — do NOT drag the shift block"*.
  **X1–X7 all re-verified STILL RESOLVED.**
- **TestRail (group 4254 + run 357 ONLY): 3 ops, all HTTP 200 + verified, 0 deletes, 0 result
  writes.** 1 `add_case` (C38926, section 4279, `custom_atmstatus` 3 / `custom_automation_type` 0)
  + 1 **PARTIAL** `update_case` (C29961 — steps/expected/refs only; `title` not sent; live body
  re-read and confirmed plain text, so none of the **16 HTML-reformatted** cases was clobbered)
  + **Rule 34 union** of run 357.
- **Rule 34 — run 357** `include_all=false` (the gotcha applies): **164 → 165 tests**, all 164
  prior case_ids still present, **results 429 → 429 UNCHANGED**. Union + length guards asserted
  before the write; tests **and** results snapshotted first.
- **COUNT EQUALITY (all four, live): local active 165 == live under 4254 165 == id-map 165 ==
  import rows 165**; id-map C-ids are exactly the live set (0 missing / 0 extra). Import header
  sha1 byte-identical to all five peer imports; 0 dup titles, 0 titles >80, 0 VIU/flag words,
  4 API cases all in "API — Schedule", 0 API content outside it.
- **SUPERSEDED (banner-marked, kept as prior art):** `build/schedule/coverage-matrix.md` and the
  coverage claims in `epic-sv8685/RECONCILIATION.md` — both v18-era. **The authoritative coverage
  statement is now `coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md`.**
- ⚠️ `gen_import.py` blanks the id-map C-ids on every rerun (known) — all 165 were re-merged.
- **Still `VIU-Pending` across the board: there is no QA branch/environment (OQ-3).** This pass
  proves **spec-to-case coverage**, never verified behaviour (Rules 12/22).

#### SOURCE-CURRENCY (Rule 31) — re-verified for this pass

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| Spec | Confluence **713031682** | **version 23**, 2026-07-30T10:40:32Z (body "Version" field still reads 1.0 — never trust it) | 2026-07-31 | **CURRENT** |
| Epic + stories | **SV-8685** + SV-8686..SV-8700 | UNCHANGED (`build/epic-recheck-2026-07-31/SCHEDULE-EPIC-DELTA.md`, Rule-37 Tier-1) | 2026-07-31 | **CURRENT** |
| Designs | Claude prototype `Schedule.dc.html` (Branko Q0); no Figma for Schedule | `spec-v1-2026-07-22/design-notes-claude.md` | 2026-07-31 | **CURRENT** — no Rule-35 queue open |
| Tech plan | `tech-plan-2026-07-29/` | supplied 2026-07-30 | 2026-07-31 | **CURRENT** |
| PO answers | Branko ×6 (2026-07-31) | `branko-answers-2026-07-31/answers-ingested.md` | 2026-07-31 | **CURRENT** — NQ-1..NQ-5 still unanswered |
| Live build | — | **no QA branch / environment (OQ-3)** | 2026-07-31 | **NOT AVAILABLE** — nothing build-verified |

#### OUTSTANDING — what we need (Rule 36)

1. **Branko — NQ-1..NQ-5** on `PO-Questions-Branko-Schedule-TechPlan_2026-07-30`, incl. **NQ-1 =
   the §12-vs-§4.5 closures contradiction (F1)**. Blocks: SCH-EDGE-05/SCH-SPREAD-07 sit on the
   v22 side by Rule 32 rather than on a ruling.
2. **Branko — 3 spec tidies (F1/F2/F3)** so the PRD stops contradicting his own rulings.
   Blocks nothing today; each mismatch is a future re-review cost.
3. **Jira **SV-8695** is stale** — its text still lists a modal *Reassign* action that v23 deleted.
   Owner: Branko/dev.
4. **Engineering — own-data WRITE scoping (NQ-5).** §14 is silent, so **no case may be authored**;
   SCH-PERM-09 covers only the read side.
5. **QA branch / environment + flag state (OQ-3)** — the big one: **nothing in these 165 cases is
   live-verified**, so the whole suite stays `VIU-Pending`.
6. **Spec-silent S1–S6** (events → OT tag · department-wide events · all-day capacity · Events
   toggle vs capacity · technician editing others' shifts · double-booking severity) — questions,
   not cases, until answered.
7. **Title trims: NOTHING OUTSTANDING — verified done.** Live check this pass: **0 of 165** titles
   exceed 80 characters (they were pushed in the 2026-07-31 authenticity pass), so the old
   "75/79 pending title trims" go-ahead is **cleared**, not carried.

---

### 0.0-AUTHENTICITY CLOSING AUTHENTICITY PASS — DONE + PUSHED (2026-07-31; superseded as "latest" by 0.0-COVERAGE above, still valid)

**Deliverables: `build/schedule/authenticity-2026-07-31/`.**
**TALLY: 164 ACTIVE, all `VIU-Pending`. Unchanged by this pass — 0 cases added, 0 retired.**

The closing pass on the user's 2026-07-31 directive: *every case absolutely authentic —
traceable, sensible, layman-runnable, in its run.* Four gates, all cleared.

#### SOURCE-CURRENCY (Rule 31) — verified LIVE this pass, not assumed

| Source | Identifier | Version / last-updated | Verdict |
|---|---|---|---|
| Spec | Confluence **713031682** | **version 23**, 2026-07-30T10:40:32Z by Branko Cicovic | **CURRENT** = our `requirements.md` |
| Epic + stories | **SV-8685** + SV-8686..SV-8700 | 15 children, **all `Open`**; newest child `updated` 2026-07-27 (older than our 2026-07-28 ingest) | **CURRENT** — 0 new/removed/renamed/status changes |
| Designs | no Figma for Schedule (spec-only, user-confirmed); Claude prototype is the authority (Branko Q0) | `spec-v1-2026-07-22/design-notes-claude.md` | **CURRENT** — no Rule-35 queue open |
| Tech plan | `tech-plan-2026-07-29/` | supplied 2026-07-30 | **CURRENT** |
| PO answers | Branko ×6 | `branko-answers-2026-07-31/answers-ingested.md` | **CURRENT** — nothing newer |

#### 1 · TRACEABILITY (Rule 20) — `TRACEABILITY-AUDIT.md`

All 164 audited (no sampling). The 2026-07-27 refs backfill was written against Confluence
**v18**; v19–v23 removed 8 sentences (appendix R1–R8), so an anchor could name a live section
while describing text that no longer exists. **19 field repairs / 19 cases:**

- **2 genuinely STALE anchors** → re-anchored, neither case obsolete: **SCH-EVT-01 (C30016)** +
  **SCH-REAS-03 (C30054)** `spec_ref` right-click → left-click (R7/R8, v22). `spec_ref` is
  **local-only** (the executor pushes `refs`), so no TestRail write was needed.
- **2 per-story precision repairs:** **SCH-EDGE-03 (C30087)** SV-8686 → **SV-8687** (SV-8687
  owns the sidebar virtualization verbatim); **SCH-EDGE-02 (C30086)** → **SV-8686,SV-8687** (the
  case asserts both halves of §11 Responsiveness and they have different owners).
- **15 epic-key cases now STATE the cross-cutting rationale on the case**, as Rule 20 requires:
  `SV-8685 [epic - cross-cutting, no single-story owner] (<anchor>)`. Verified against the story
  bodies that **none** of SV-8686..SV-8700 is a permissions or regression/migration story.
- **RESULT: 164/164 ticket valid · 164/164 spec anchor present · every anchor section live in
  v23 · 0 stale · 0 possibly-obsolete · 0 refs over the 250-char cap.**
- Honest exceptions, stated: **5 cases** (SCH-REG-01..04, SCH-API-04) anchor to the **tech plan**
  because the Confluence page has no backend contract at all (spec-silent, Rules 15/30);
  SCH-EVT-05 trips the "reassign" fingerprint but is the still-live **event** drag behaviour,
  verbatim in v23 §4.10 — left unchanged.

#### 2 · TITLES — `TITLE-TRIMS.md`

**73 titles were over 80 characters (longest 139) → all trimmed; longest is now exactly 80.**
0 detail lost — every dropped specific was diffed against that case's own Preconditions/Steps/
Expected and was already there (which is *why* the titles were long: they restated their own
expected results). 0 duplicate titles, 0 empty titles.
One finding: **SCH-SER-04 (C29990)**'s old title claimed "capacity, **overtime**, and conflicts"
but its Expected never asserts overtime — the trim *fixed* a pre-existing title over-claim.

#### 3 · RULE-28 THREE-DIMENSION RE-VERIFY — `RULE-28-AUDIT.md` + `per-case-verdicts.csv`

| Dimension | Result over all 164 |
|---|---|
| USEFUL | **145 KEEP · 19 WEAK-KEEP · 0 MERGE · 0 CUT** |
| MAKES SENSE (cold read) | **164 SENSIBLE · 0 FIX-WORDING · 0 NONSENSE** |
| CROSS-CASE CONSISTENCY (2b) | **1 NEW contradiction found · 1 resolved · 0 PENDING** |
| GENUINE + LAYMAN-RUNNABLE | **164 / 164 PASS** (0 jargon hits, 0 numbering breaks) |
| KEEP-but-NONSENSE | **EMPTY** ✅ |

- **NEW contradiction X7 — SCH-CONF-02 (C30024).** Expected 1 quoted the prototype's hardcoded
  *"'Scheduled on a weekend (outside Mon-Fri)'"* — a string in **no** spec/design/ticket/PO
  source, which contradicted **the case's own Expected 2** ("if Saturday hours are configured,
  that day is NOT flagged") **and** its control-group sibling **SCH-CONF-03 (C30025)**, whose
  hardcoded 8:00 AM/5:00 PM the morning pass de-numbered as X5 for exactly this reason.
  Realigned to v23 §4.11 verbatim: *"Weekend shift | Shift scheduled on Saturday or Sunday
  **(outside working days)**"*. **Same failure mode as X6** — one member of a control group gets
  fixed and its neighbour is left on the superseded model; only a re-run of the grouped diff
  finds it.
- **The morning pass's X1–X6: ALL SIX RE-VERIFIED STILL RESOLVED.**
- **The six right-click → left-click repairs: ALL HELD.** A suite-wide scan of every
  tester-facing field finds **exactly one** `right-click` mention left — the deliberate PO-backed
  negative in SCH-REAS-03 (C30054) E5.
- Stage-2b ran **14 control groups** + fuzzy opposite-polarity detection + TITLE-vs-EXPECTED on
  all 164 (critical, since 73 titles were rewritten) + same-anchor clustering over 33 shared
  anchors. **13 candidate pairs surfaced, all 13 cleared with a stated reason.** 0 near-identical
  titles introduced; 1 near-identical Expected pair (SCH-START-01/C29969 ↔ SCH-START-02/C29970)
  **cleared as load-bearing** §4.2 hierarchy coverage, not a merge.
- **Spec-internal contradiction X1 flagged, NOT resolved** (Rule 15): v23 **§4.5** *"Shop
  closures and public holidays are not skipped in V1.."* vs **§12** *"closures … block the spread
  step"*. All **8** closure sentences in the suite were checked: **every one asserts the §4.5
  side, NONE asserts the §12 side**, and SCH-SPREAD-07 (C29983) + SCH-EDGE-05 (C30089) cite both
  sections so the conflict is visible from the metadata. Still Branko question **NQ-1**.

#### 4 · TESTRAIL PUSH — EXECUTED, and the run is in sync

`testrail-sync-manifest-2026-07-31.md` (header = **EXECUTED**) +
`testrail-execution-log-2026-07-31.md` (per-case, with C-ID + link per Rule 8) +
`testrail-op-log-2026-07-31.json` + `pre-push-snapshot/`.

- **84 `update_case`, ALL HTTP 200, ALL re-GET field-verified MATCH, 0 failures.**
  73 `title` + 17 `refs` + 1 `custom_expected`. **0** add_case / delete_case / add_section /
  result writes.
- **Rule 34 — run 357** "Schedule - Ayesha (VIU Pending)": **164 tests vs 164 active cases, 0
  missing, 0 extra, 429 results UNCHANGED.** Already equal **both ways**, so **no `update_run`
  was issued** and no test or result was touched.
- **COUNT EQUALITY: live under group 4254 = 164 == local active 164 == id-map 164 == import
  rows 164.** Import hygiene: header sha1 **byte-identical to all five peer imports**, no C-id
  column, 0 duplicate titles, 0 titles >80, 0 VIU/feature-flag words, API cases in
  **"API — Schedule"** (4) with **0** API content outside an API section (Rule 4).
- ⚠️ `gen_import.py` blanks the id-map C-ids on every rerun (known) — 164/164 were re-merged
  from the pre-run snapshot; id-map `refs` + `title` now mirror the cases exactly.

#### ⚠️ OPEN ITEM FOR THE COORDINATOR — 16 cases were reformatted to HTML in TestRail

The pre-write diff surfaced **48 body-field differences across 16 cases this pass never
touched**. Cause: those cases' Preconditions/Steps/Expected were converted **inside TestRail**
into HTML ordered lists (`<ol><li>`) **by another actor**, while our local mirror holds the plain
`1. 2. 3.` convention. **Content verified IDENTICAL** — normalizing markup away, **48/48 are
markup-only, 0 are content differences.**

Affected (16): SCH-BLOCK-01 · SCH-COLOR-01 · SCH-CONF-01 · SCH-DEL-01 · SCH-DND-01 · SCH-MCAL-01
· SCH-MODAL-01 · SCH-NAV-04 · SCH-NAV-06 · SCH-NAV-07 · SCH-PERM-01 · SCH-REAS-01 · SCH-START-01
· SCH-TIP-01 · SCH-TOOL-01 · SCH-WOL-01.

**We deliberately did NOT touch those body fields** — pushing our plain text would silently
**revert someone else's formatting**, out of scope here. The executor sends **PARTIAL payloads**
(only fields this pass changed) and treats markup-only as no-change; **3 cases dropped out of the
push entirely** (SCH-COLOR-01, SCH-MCAL-01, SCH-TOOL-01), taking 87 candidates → **84**.
**Consequence to decide: local and live differ in MARKUP for those 16, so any future FULL-BODY
push would revert them.** Options: (a) adopt the HTML in our local mirror, (b) keep plain text
and accept the divergence, (c) re-normalize TestRail back to plain. **Not decided by us.**

#### Standing facts confirmed by this pass

- **164 ACTIVE**, all `VIU-Pending`. **Week Export scope is CLOSED** — Branko: *"Not in V1, not
  even in future considerations"*; SCH-EXP-01 (C38853) retired + deleted 2026-07-31, and its
  TestRail **section 5406 "Week Export and Printing" is now EMPTY** (left in place, flagged as a
  removal candidate — not deleted without authorization).
- **NQ-5 (own-data write scoping) is re-routed to ENGINEERING with NO case authored.** §14 of the
  spec is silent on write-scoping (Rule 15), so nothing may be asserted. The adjacent
  **SCH-PERM-09 (C30082)** covers only the **READ** side ("no own-only restriction: a View user
  sees ALL technicians' shifts"). A write-scoping case can only be authored once engineering
  answers.
- **`requirements.md` is at Confluence v23.** **Epic SV-8685 unchanged** since ingest.
- **QA Assignee = Ayesha Khan** (run 357 is hers).
- ⚠️ **Jira SV-8695 is STALE vs v23** — its text still lists a modal **Reassign** action, which
  Confluence v23 (2026-07-30) deleted and Branko confirmed absent ("B - No button"). Our
  SCH-MODAL-08 (C30015) is correct; **the ticket is the stale artefact — tell Branko/dev.**
- **Spec-internal contradiction X1 (§4.5 vs §12) still live and flagged** — Branko NQ-1.
- **STILL OPEN: OQ-3 — no QA branch/environment.** Nothing in this suite is build-verified;
  every case stays `VIU-Pending` (Rule 12). Live VIU is the next real milestone.
- **PENDING (unchanged):** the 8-question Branko sheet
  `PO-Questions-Branko-Schedule-TechPlan_2026-07-30.md`/`.xlsx` is **READY TO SEND**.


### 0.0-SPEC-V23 `requirements.md` PROMOTED TO CONFLUENCE v23 + PO SHEET REVISED (2026-07-31, LATEST — read this first)

**LOCAL DOC WORK ONLY — 0 case edits, 0 TestRail writes, 0 result writes. Tally untouched by
this pass; it is **164 ACTIVE**, all VIU-Pending (165 → 164 via the parallel Week Export retire,
see below).**

Closes two items that were left open by §0.0-BRANKO-ANSWERS (its OPEN items 10 and 6).

**1. `requirements.md` is now at Confluence version 23 — it is no longer stale.**
It was the v18 text; it is now the v23 text. **Read `requirements.md` again as the current
spec** (the "read `spec-current-2026-07-31/` instead" instruction in §0.0-BRANKO-ANSWERS is
**superseded**; that folder remains the verbatim source + version-attributed diff).

- **Spec-currency header added at the top of the file:** source page id 713031682, Confluence
  **version 23**, upstream last-updated **2026-07-30T10:40:32Z by Branko Cicovic**, and our
  ingest date **2026-07-31**.
- **⚠️ THE STALENESS GOTCHA IS NOW RECORDED IN THE FILE ITSELF** — the page **BODY's** own
  `Version` field has read **1.0 / "July 15, 2026"** since Confluence v1 because Branko never
  bumps it. **Only the Confluence version number is a reliable currency marker.** That is
  exactly how we drifted 5 versions behind: we re-read the body header, saw "1.0", and
  concluded "unchanged". The gotcha is called out in the new header AND again beside the body
  header table.
- **All 9 substantive deltas folded in, each tagged inline `[v19]`…`[v23]`:** §4.2 Hours
  settings block · §4.4 default blue + per-shift custom colour · §4.5 closures/holidays NOT
  skipped in V1 · §4.6 series-banner breaks removed · §4.8 now-line "over the grid" · §4.9
  **Reassign DELETED (v23)** · §4.10/§7 left-click menu · §4.11 events not conflict-checked ·
  §4.12 capacity includes event time · §11 Dark theme · header Design + Epic rows.
- **Nothing silently dropped** — new **"APPENDIX — Removed upstream (v19–v23)"** keeps all
  **8** deleted/replaced sentences **verbatim** (R1–R8) with what replaced them and the
  introducing version, plus the additive-only list. Two source typos ("not skipped in V1..",
  "'New work order'..") are reproduced on purpose — do not "fix" them in case wording.
- **Branko's 6 answers folded in as `[PO 2026-07-31]` notes**, each with source + date on the
  record (Rule 32): events consume capacity · no Reassign button · no week export in V1 ·
  left-click only, menu = Create event + New work order · default hours 7:00 AM–7:00 PM · VIN
  always visible on hover.
- **Open-questions section refreshed:** OQ-1/OQ-2 (epic = SV-8685) / OQ-4 (design exists) /
  OQ-6 (tooltip VIN) **RESOLVED**; **OQ-3 (QA branch/env) still open**. Two **spec-internal
  contradictions flagged, not resolved** (Rule 15): **X1** §4.5 "closures not skipped in V1"
  vs §12 "closures block the spread step" — both live in v23; **X2** §9 vs §4.13 on tooltip
  VIN (resolved by Branko, §9 text still needs an upstream tidy). Six **spec-silent** items
  recorded as S1–S6, never assumed either way.
- **New find this pass: contradiction X1.** §12 Edge cases still says shop closures "block the
  spread step from placing shifts on those days", directly contradicting §4.5's "not skipped in
  V1". Branko changed §4.5 in v22 and never updated §12. This makes the closures confirmation
  question **more** valuable, not less — it is now a spec-vs-spec conflict, not just
  spec-vs-plan.

**2. The unsent PO sheet is revised and READY TO SEND — `PO-Questions-Branko-Schedule-TechPlan_2026-07-30.md`/`.xlsx`, now 8 questions.**

| # | Reader-facing question | Kind |
|---|---|---|
| 1 | Shop closure days: does a multi-day job skip them? | **confirm** (was NQ-1) |
| 2 | Where do the shop's and technicians' working hours live? | **confirm** (was NQ-3) |
| 3 | Can a technician have a split working day (two time ranges)? | **confirm** (was NQ-4) |
| 4 | Does the problem counter include double-bookings? | **open choice** (was NQ-2, unchanged) |
| 5 | Do meeting hours also count toward the "OT" tag and the hover breakdown? | **NEW** (A1) |
| 6 | Can a meeting be created for a whole department instead of one technician? | **NEW** (A2) |
| 7 | Can a meeting cover a whole day, and how should it show? | **NEW** (A3) |
| 8 | If a user hides meetings from the view, do those hours stop counting? | **NEW** (A7) |

- **WITHDRAWN — 2 now-answered re-asks removed from the reader-facing sheet** (its old Q6
  events→capacity and Q7 modal Reassign). They are kept in the **QA-only** section marked
  **ANSWERED 2026-07-31** with Branko's **verbatim words**, so they can never be re-asked.
  *(We have already embarrassed ourselves once by asking a question a source had answered.)*
- **REFRAMED — Q1/Q2/Q3 became confirmations**, because the live v23 spec now sides with our
  cases on all three. Each states in plain words what the current write-up says and asks him to
  confirm it stands (and that the engineering build plan should change). A confirmation is
  cheap and protects us.
- **RE-ROUTED — NQ-5 (own-data write scoping) REMOVED from the PO sheet.** Branko replied to
  the sibling backend-scope question "**I'm not sure if this question is for me Bilal.**" — and
  he is right, it is not a product question. It is logged as needing a **DEV** answer in
  `tech-plan-2026-07-29/Questions-for-Branko-dev.md` (banner on the NQ-5 question + owner
  change in its QA table + a new per-question status table). Spec §14.3 rules out own-only
  **viewing** and is **silent on writing** — re-verified against the live v23 body.
- **Format kept 1:1** (Rule 16): same two-sheet workbook — `Questions for PO` (A1 title, blank
  row 2, header row 3, freeze A4, cols # / Topic / What happens now / The question / Options /
  **blank "Your answer"**, widths 4/24/48/42/46/20) + `QA Internal Mapping` (red QA-only
  banner, freeze A4, widths 4/34/52/60). Verified column-by-column against
  `PO-Questions-Branko-Schedule-2026-07-27.xlsx`.
- **Generator (new, reusable):** `gen_po_questions_techplan.py` — regenerates the `.xlsx` and
  **fails the build** if the reader-facing surfaces contain jargon. Its `scan_jargon()` checks
  22 banned patterns (C-ids, internal case IDs, SV-#### keys, `§`, section numbers, S#-R#
  anchors, PRD/spec/story/Figma/TestRail/Jira/API/HTTP/VIU/endpoint/epic/Confluence, "Rule N",
  "test case") across all 33 reader-facing surfaces. **PASSED**, and the same scanner was run
  over the `.md` reader-facing region (lines 22–139) — **PASSED**.

**✅ THE SCH-EXP-01 (C38853) WEEK EXPORT RETIRE IS DONE — executed by a PARALLEL pass, NOT by
this one** (commit `ac089c0`, folder `week-export-retire-2026-07-31/`, user-authorized: "Retire
from test cases and test run"). Verified from its execution log, not assumed: **1
`delete_case`/38853 → HTTP 200, re-GET → HTTP 400 "not a valid test case" = gone**; run 357 165 →
164 tests with set-diff of removed case_ids `{38853}` only and **429 → 429 result records
intact**; live count under group 4254 165 → **164** == id-map == import rows. Section **5406
"Week Export and Printing" is now EMPTY but deliberately NOT deleted** — an empty-section cleanup
candidate for a later authorized pass. Local body kept + marked Retired with the ruling quoted
(backup in that folder).

> **Correction to this section as first written:** it said the retire was "still awaiting your
> authorization" and the tally was 165. Both were **stale** — the parallel pass landed the
> authorized retire while this doc pass was in flight. Facts above re-verified against
> `week-export-retire-2026-07-31/testrail-execution-log-2026-07-31.md` (Rule 12: observed, not
> assumed). **The earlier `branko-answers-2026-07-31/testrail-execution-log-2026-07-31.md`
> "HELD" note is the EARLIER pass and is superseded** — read the `week-export-retire-…` log for
> C38853's final state.

**⚠️ Tell Branko/dev: Jira SV-8695 is now STALE versus spec v23.** The story text still lists a
modal **Reassign** action, but Confluence **v23 (2026-07-30)** deleted "and Reassign to another
technician" from §4.9 and Branko answered "**B - No button**". Our cases are already correct
(SCH-MODAL-08 = C30015 "Delete only"); **SV-8695 is the artefact that needs correcting** — we do
not edit Jira ourselves.

**(An earlier draft of this section flagged an "id-map gap" — `SCH-EXP-01` absent from
`testrail-id-map.csv` while C38853 appeared to still exist. NOT a gap: the parallel retire had
already deleted C38853 and regenerated the map to 164 with all C-ids re-merged, 0 blanks. Its
local `viu_status` "user-authorized retire" is also correct. Nothing to fix.)**

**Files changed this pass:** `requirements.md` (v18 → v23) ·
`PO-Questions-Branko-Schedule-TechPlan_2026-07-30.md` + `.xlsx` (revised) ·
`gen_po_questions_techplan.py` (new) · `tech-plan-2026-07-29/Questions-for-Branko-dev.md` (NQ-5
re-route) · this file.

### 0.0-BRANKO-ANSWERS BRANKO'S ANSWERS INGESTED + APPLIED + PUSHED (2026-07-31 — see §0.0-SPEC-V23 for what changed after it)

**Branko answered the 2026-07-27 question sheet. Both long-HELD items are settled, the local spec
was 5 Confluence versions stale, 24 cases were edited, and 16 `update_case` writes are live in
TestRail (all HTTP 200, all re-GET MATCH). Run 357 verified read-only — 165 tests, 429 result
records unchanged. Nothing deleted.**

**Resume docs for this pass:** `branko-answers-2026-07-31/answers-ingested.md` (his verbatim
answers) → `DELTAS.md` (consequences, §10 = what got pushed, §11 = the new question) →
`audit/AUDIT-2026-07-31.md` (Rule-28) → `testrail-execution-log-2026-07-31.md`.

**SPEC WAS STALE — now current.** `requirements.md` corresponded to Confluence **version 18**
(2026-07-22); live is **version 23** (2026-07-30, Branko). **We were 5 versions behind.** The live
body + a per-version attributed diff are in `spec-current-2026-07-31/`
(`Schedule-spec-current.md`, `SPEC-DIFF.md`). ~~⚠️ `requirements.md` itself is still the v18 text~~ —
**SUPERSEDED 2026-07-31 by §0.0-SPEC-V23: `requirements.md` is NOW AT v23.** (Why it had lagged: the
2026-07-27 epic pass and the 2026-07-30 tech-plan pass edited CASES from Jira/the plan but never
re-ingested the page.) Nine body deltas found; **seven were already reflected in our cases**; the two
that were not are the two HELD items. ~~⚠️ Read `spec-current-2026-07-31/` (not `requirements.md`) as
the current spec~~ — **SUPERSEDED: read `requirements.md` (now v23); `spec-current-2026-07-31/` remains
the verbatim source + version-attributed diff.** **The page-body "Version" field always reads 1.0 —
use the Confluence version number.**

**His answers (7 asked, 6 answered, 1 declined):**
| Q | Topic | Answer |
|---|---|---|
| 1 (**D1**) | Do events consume technician capacity? | **A — yes.** Quotes §4.12 verbatim. **REVERSES his 2026-07-22 "no"** |
| 2 (**D4**) | 'Reassign' button in the shift pop-up? | **B — no button, drag only.** He also deleted the clause from the PRD in v23 |
| 3 | Printable Week Export in V1? | **No** — "nothing about this in the PRD, not in the future requirements" |
| 4 | Cell-menu shortcut + wording | **C** — "there is no right click, only left click"; menu = 'Create event' + 'New work order' |
| 5 | Default working day | **B — 7:00 AM to 7:00 PM** |
| 6 | VIN in the hover note | **A — always visible regardless of the toggle.** Closes OQ-6(a) |
| 7 | Test the backend too? | **NOT ANSWERED** — "I'm not sure if this question is for me Bilal." **Re-route to engineering / the QA lead; do not re-ask him** |

**BOTH HOLDS LIFTED.**
- **D1 = A → a real reversal, not a confirmation.** SCH-EVT-08 (C30615) asserted the opposite and was
  rewritten (title + expected); SCH-CAP-01 (C30030) now names shift+event hours; the stale
  "events excluded" notes cleared on C30031/C30032/C30033/C30023. The tech plan already built it this
  way, so plan + spec + PO now agree.
- **D4 = B → confirmation.** SCH-MODAL-08 (C30015) was already right; only its provenance/refs
  changed. SCH-REAS-02 stays retired. **Jira SV-8695's text is now the stale artefact** (still lists a
  modal Reassign action) — for the story owner, we do not edit Jira.

**Biggest genuine find: the cell menu was unrunnable as written.** The 2026-07-27 pass fixed the menu
ITEMS but left **right-click** in 6 active cases; Branko and the spec (since v22) both say left-click
only. Corrected on C30016, C30017, C30018, C30054, C30075, C30077, C38855.

**16 `update_case` EXECUTED (15 authorized + 1 same-run repair), all 200 + re-GET MATCH:**
SCH-EVT-08 C30615 · SCH-CAP-01 C30030 · SCH-MODAL-08 C30015 · SCH-EVT-01 C30016 · SCH-EVT-02 C30017 ·
SCH-REAS-03 C30054 · SCH-EVT-03 C30018 · SCH-PERM-02 C30075 · SCH-PERM-04 C30077 · SCH-REAS-06 C38855
(×2, the repair) · SCH-CONF-03 C30025 · SCH-SER-01 C29987 · SCH-SER-02 C29988 · SCH-DAY-06 C30006 ·
SCH-EDGE-08 C38866. **0 add_case · 0 add_section · 0 delete_case · 0 update_run · 0 result writes.**
9 further edits are **notes-only and stay LOCAL** (the executor pushes only title / preconds / steps /
expected / refs).

**TALLY UNCHANGED: 165 ACTIVE, all VIU-Pending.** Live count under group 4254 = **165** == the
165-row id-map (165 C-ids, 0 blanks after the re-merge). Import regenerated over 165 — header
byte-identical to all four prior project imports, 0 VIU/flag words, 4 API cases in "API — Schedule".

**Rule-28 audit (`audit/`): 21 KEEP / 2 WEAK-KEEP / 1 CUT · 24 SENSIBLE · 24/24 genuine +
layman-runnable · KEEP-but-NONSENSE empty. The cross-case consistency sweep ran SUITE-WIDE over all
165 cases: 6 contradiction groups found, 6 resolved, 0 delivered unresolved.** Two were invisible to
every other check — **X6** (SCH-EVT-02/C30017 said a left-click STARTS event creation while
SCH-REAS-03 said the same click OPENS A MENU; it reads perfectly cold and is only wrong next to its
neighbour) and SCH-SER-01's step-3 residue. 7 more candidate pairs were checked and CLEARED with
reasons (mostly role-gated preconditions).

**Also folded in:** 4 over-length titles trimmed on cases already being written (SCH-SER-01 137→76,
SCH-SER-02 117→72, SCH-CAP-01 125→80, SCH-MODAL-08 82→60) — **title-trim backlog 79 → 75.**

### ⚠️ OPEN AFTER THIS PASS

1. **HELD RETIRE — needs your ruling: SCH-EXP-01 (C38853) Week Export.** Branko says it is not in V1
   and not in the backlog; the audit rates it CUT. **NOT deleted.** Retiring it is 3 linked ops:
   `delete_case` C38853 + decide the then-empty section **5406 "Week Export and Printing"** +
   a **run-357 resync** (Rule 34).
2. **4 NEW questions his answer opened — spec silent, so deliberately NOT asserted** (`DELTAS.md`
   §8/§11): **A1** do event hours feed the per-technician OT tag / hover breakdown (C30032, C30033)?
   **A2** do department-assigned events consume each tech's time? **A3** does an all-day event consume
   a full day? **A7** does switching the 'Events' display OFF take event hours back out of the
   capacity bars (C30046)?
3. **A4 — Q7 re-route.** Backend-testing scope goes to engineering / the QA lead, not Branko.
4. **A5** — what 'New Work Order' actually DOES (toast vs opens the WO window) is still unresolved;
   SCH-REAS-06 (C38855) passes either way.
5. **A6 — migration heads-up for product:** now that events count, ~9,684 migrated legacy events will
   raise capacity bars at cutover. Expected, not a bug.
6. **NQ-1..NQ-5 still unanswered** — ✅ **DONE 2026-07-31 (§0.0-SPEC-V23): the sheet is REVISED and
   READY TO SEND with 8 questions** — NQ-1/NQ-3/NQ-4 reframed as confirmations (the live v23 spec
   sides with our cases on all three), NQ-2 kept as a genuine open choice, A1/A2/A3/A7 added, the 2
   now-answered re-asks (old Q6/Q7) withdrawn to the QA-only section with Branko's verbatim words, and
   **NQ-5 re-routed to engineering/dev** (Branko: "I'm not sure if this question is for me Bilal.").
   Remaining action: **SEND IT.**
7. **Doc hygiene for Branko:** live v23 **§9 still** ties the tooltip VIN to the 'VIN Number' toggle,
   contradicting §4.13 and his own Q6 answer.
8. **Latent import defect (needs its own authorized write):** `SCH-HRS-04` precondition 1 carries a
   bare `(SCH-HRS-01/02)`; `clean()` strips only the ID and leaves a stray `(/02)` in the pushed
   text. Harden `clean()` in `gen_import.py` to drop the whole parenthetical.
9. **75 over-80-character titles** (was 79) — still needs its own authorized pass.
10. **`requirements.md` re-ingest to v23** — ✅ **DONE 2026-07-31 (§0.0-SPEC-V23).** `requirements.md`
    is now the v23 text with a spec-currency header, the body-"Version 1.0" staleness gotcha recorded,
    all 9 deltas tagged inline, a "Removed upstream (v19–v23)" appendix (R1–R8 verbatim), Branko's
    answers as `[PO 2026-07-31]` notes, and 2 spec-internal contradictions + 6 spec-silent items
    flagged. Read `requirements.md` as the current spec again.
11. **Live VIU still pending the QA branch (OQ-3)** and the Epic key is known (SV-8685). **Rule 12:
    PO-, spec-, design- and tech-plan-pinned ≠ VIU-Verified.**


**TEST RUN SYNCED 2026-07-31 (Standing Rule 34, user-authorized):** run **357 "Schedule -
Ayesha (VIU Pending)"** now contains the COMPLETE active Schedule suite — **+22 cases, 143 →
165 tests**, result records unchanged (429 → 429, nothing lost), and the run's case set is
**EQUAL both ways** to the 165 live cases in `testrail-id-map.csv` (0 missing, 0 extra).
Evidence: `build/testrail-run-sync-2026-07-31/run-sync-execution-log-2026-07-31.md`.

### 0.0-CONSOLIDATION-EXECUTED CONSOLIDATION + WORDING REPAIRS EXECUTED (2026-07-31, LATEST — user-authorized TestRail writes DONE)

**The Rule-28 usefulness-audit recommendations are now EXECUTED (user authorization
2026-07-31): the 20 merge groups + 2 cuts from `quality-audit-2026-07-31/MERGE-PLAN.md`
plus the 6 FIX-WORDING repairs from `USEFULNESS-AUDIT-2026-07-31.md`. 24 `update_case` +
25 `delete_case` = 49 operations, ALL HTTP 200, ALL re-GET verified, 0 failures. Nothing
else written: no add_case, no section writes, NO run writes (run 325 / all runs
untouched), nothing outside group 4254.**

- **NEW TALLY: 165 ACTIVE authored** (was 190) — all still **VIU-Pending** (the suite is
  pre-VIU / spec+design+tech-plan-only; Rule 12 — design-pinned ≠ VIU-Verified).
  **Live count under group 4254 = 165 == the 165-row id-map** (set-equality verified
  C-id-by-C-id, not just a count match).
- **20 merge groups** — each survivor gained the absorbed members' distinct
  steps/expected, with their `refs` unioned in (Rule 20), and **14 survivor titles were
  rewritten to ≤ 80 chars** (concise-title rule). Groups: G-NAV-LANDING, G-CELL-MENU,
  G-SIDEBAR-SEARCH, G-DRILLDOWN-OPEN, G-SCOPE-CONTENTS, G-SCOPE-MULTI, G-SPREAD-HEADER,
  G-VIN-TOGGLE, G-SHIFT-COLOR, G-SAMEDAY-LANE, G-AUTOSCROLL, G-EVENT-MODAL,
  G-HOURS-CONFLICT, G-VIEW-TOGGLES, G-UNDO, G-ESCAPE, G-ENTER, G-HRS-LOCATION,
  G-HRS-VALIDATION, G-WEEK-EXPORT. **0 groups held/skipped.**
- **23 merged-away members + 2 cuts deleted** (`delete_case`, all verified gone):
  members SCH-NAV-02 (C29926), SCH-WOL-03 (C29938), SCH-LINE-02 (C29949),
  SCH-SCOPE-04 (C29966), SCH-SCOPE-06 (C29968), SCH-SPREAD-01 (C29977),
  SCH-BLOCK-03 (C29993), SCH-BLOCK-04 (C29994), SCH-LANE-05 (C30000),
  SCH-DAY-02 (C30002), SCH-DAY-07 (C30007), SCH-EVT-04 (C30019), SCH-CONF-04 (C30026),
  SCH-VIEW-07 (C30048), SCH-VIEW-08 (C30049), SCH-REAS-04 (C30055), SCH-REAS-05 (C30056),
  SCH-DEL-07 (C30063), SCH-KEY-02 (C30067), SCH-KEY-04 (C30069), SCH-HRS-01 (C38846),
  SCH-HRS-07 (C38852), SCH-EXP-02 (C38854); cuts **SCH-START-08 (C29976)** (duplicate
  sweep of SCH-START-01..05) + **SCH-EDGE-01 (C30085)** (duplicate of SCH-SPREAD-10,
  C29986). **All 25 bodies are KEPT locally** marked `viu_status: "Retired - ..."` and
  are additionally backed up in `consolidation-backup-2026-07-31/` — nothing is lost.
- **6 FIX-WORDING repairs** (the residue of the two late spec reversals + one placeholder):
  **SCH-PERM-02 (C30075)** Expected 3 stale menu items → 'Create Event' / 'New Work Order';
  **SCH-PERM-04 (C30077)** step 2 'New Event' → 'Create Event';
  **SCH-EVT-03 (C30018)** precondition 2 'New Event' → 'Create Event';
  **SCH-COLOR-02 (C30072)** stale per-work-order colour open question DROPPED (the
  per-SHIFT rule is now asserted in Expected 3); **SCH-REAS-06 (C38855)** the
  to-be-confirmed placeholder moved out of Expected into the notes (Expected 1–2 are now
  the pass bar); **SCH-SPREAD-08 (C29984)** the impossible '(weekend / closure)' skip
  reason reworded to weekend-only (V1 does not skip closures per SV-8691).
  SCH-EVT-03 and SCH-COLOR-02 were survivor **and** repair → one `update_case` each with
  the final body.
- **⚠️ C-id correction:** the audit report's FIX-WORDING table listed three C-ids one-off
  (SCH-PERM-02 as C30074, SCH-PERM-04 as C30076, SCH-COLOR-02 as C30070). The
  authoritative ids from `testrail-id-map.csv` (and `per-case-verdicts.csv`, which agrees)
  are **C30075 / C30077 / C30072** — those are what was written.
- **HELD-pending-Branko items UNTOUCHED and verified still live:** SCH-EVT-08 (C30615) +
  SCH-CAP-01..04 (C30030–C30033) (events-count-toward-capacity, D1) and SCH-MODAL-08
  (C30015) (modal 'Reassign', D4). Verified programmatically absent from every merge group
  before any edit, and confirmed present in TestRail after.
- **Durable TestRail gotcha learned:** TestRail parses `refs` as a comma-separated
  reference LIST and **stores it with the spaces after commas removed** (`'§3, §3.1'` →
  `'§3,§3.1'`). 13 of the 24 updates read as `refs` "mismatches" purely because of this.
  **When re-GET-verifying `refs`, normalize `", "` → `","` first**, otherwise TestRail's
  own storage format is a false mismatch. Proven benign here: `sent.replace(", ", ",") ==
  stored` for all 13 (0 unexplained), no ticket key or spec anchor lost (Rule 20 intact),
  and 16 of the 49 pre-write snapshots already stored refs that way before this run.
- Deliverables regenerated over 165: `testrail-import/schedule-v1-testrail-import.csv`/
  `.xlsx` (165 rows, header byte-identical vs all four prior project imports, 0 VIU/flag
  words, no dup titles/ids, 4 API cases in "API — Schedule" per Rule 4, no C-id column) +
  `testrail-id-map.csv` (**165 rows, 165 C-ids, 0 blanks**; retired/deleted rows dropped
  per the SCH-REAS-02 convention). ⚠️ `gen_import.py` blanks the id-map C-ids and excludes
  Retired on every rerun — **re-merge the C-ids after any regeneration**.
- Artefacts: plan `quality-audit-2026-07-31/MERGE-PLAN.md` (header = EXECUTED) · report
  `USEFULNESS-AUDIT-2026-07-31.md` (header = EXECUTED) · manifest
  `testrail-execution-manifest-2026-07-31.md` (= EXECUTED) · per-operation audit
  `testrail-execution-log-2026-07-31.md` · pre-write `get_case` snapshots
  `pre-push-snapshot/` (49/49) · pre-edit case bodies + recovery instructions
  `consolidation-backup-2026-07-31/MANIFEST.md`.

**STILL PENDING after this pass (nothing here was authorized or done):**
1. **79 over-80-character titles** — the concise-title backlog. It was 98 before this pass
   and is **79** now (19 over-length titles belonged to merged-away members and a further
   batch was shortened as part of a survivor's new title). **Needs its own authorized
   pass.** Longest remaining: SCH-SPREAD-08 (C29984) at 133 chars.
2. **HELD items** — SCH-EVT-08 (C30615) + SCH-CAP-01..04 (C30030–C30033) (D1
   events→capacity) and SCH-MODAL-08 (C30015) (D4 modal 'Reassign') — awaiting Branko.
3. **19 WEAK-KEEP cases** — the audit recommends KEEP but tagged "build-acceptance /
   verify once" rather than per-cycle regression; no action taken.
4. Everything already open below: **live VIU pending the QA branch (OQ-3)**, the NQ-1..5 +
   Q1/Q2/Q3 sheets to Branko/dev, and Rule 12 (design/tech-plan-pinned ≠ VIU-Verified).


### 0.0-TECHPLAN-EXECUTED TECH-PLAN PUSH EXECUTED (2026-07-30, LATEST — user-authorized TestRail writes DONE)

**The §0.0-TECHPLAN push queue is now EXECUTED (user authorization "Push all three",
2026-07-30): exactly 2 add_section + 13 add_case + 2 update_case per
`tech-plan-2026-07-29/Schedule_TechPlan_ChangeList_2026-07-29.md` §A — ALL HTTP 200,
ALL re-GET verified MATCH, 0 failures. Nothing else written: no deletes, no run
writes (run 325/all runs untouched), no other cases/sections touched.**
- **2 add_section** under group 4254: **Cross-Module and Rewrite Regression = 5408**,
  **API — Schedule = 5409** (Rule 4 — the first API section/cases for Schedule).
- **2 update_case** (pre-push get_case snapshots in
  `tech-plan-2026-07-29/pre-push-snapshot/`; live titles confirmed unchanged):
  SCH-WOL-05 = C29940 (added expected #3 — paged loading of the sidebar list is
  expected, not a fault) + SCH-VIEW-03 = C30044 (added expected #4 — a user with no
  technician record does not see 'My Shifts' at all).
- **13 add_case** (all `custom_atmstatus:3`+`custom_automation_type:0`, VIU-Pending):
  SCH-SPREAD-11 = **C38863** (sec 4263), SCH-DEL-10 = **C38864** (4276),
  SCH-EDGE-07 = **C38865** / SCH-EDGE-08 = **C38866** (4280),
  SCH-REG-01..05 = **C38867–C38871** (5408),
  SCH-API-01..04 = **C38872–C38875** (5409).
- **Live count under group 4254 subtree = 190** (paginated get_cases read-back) ==
  the 190-row id-map. `testrail-id-map.csv` = **190/190 C-ids, 0 blanks** (177
  re-merged + 13 new). Import regenerated over 190 (header byte-identical, 0
  VIU/flag words, no dup titles/ids, 4 API cases in "API — Schedule").
- **HELD/blocked items untouched** per the ChangeList: SCH-EVT-08 (C30615),
  SCH-CAP-01..04 (C30030–C30033), SCH-MODAL-08 (C30015), SCH-EXP-01/02
  (C38853/C38854), and all §C blocked-on-an-answer items (NQ-1..5, Q1/Q2/Q3).
- Executor `exec_sync_techplan_2026-07-30.py`; audit
  `tech-plan-2026-07-29/testrail-execution-log-2026-07-30.md`; ChangeList header =
  EXECUTED.
- **NEXT:** send NQ-1..5 with the open Q1/Q2/Q3 sheet to Branko/dev; live VIU of the
  13 new + 2 edited cases when the QA branch exists (OQ-3) — SCH-REG-01..04 need the
  CUTOVER build.

### 0.0-TECHPLAN ENGINEERING TECH PLAN RECONCILED (2026-07-29 — push EXECUTED 2026-07-30, see §0.0-TECHPLAN-EXECUTED)

**The engineering "Schedule Module Rewrite — Technical Implementation Plan" (user upload
2026-07-29) was ingested VERBATIM + reconciled against the 177-case suite.** Sources of
record: `tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md` (the plan),
`TECH-PLAN-DELTAS.md` (full classification), `Schedule_TechPlan_ChangeList_2026-07-29.md`/`.xlsx`
(sign-off file), `RULE28-AUDIT-2026-07-29.md`, `Questions-for-Branko-dev.md`,
`backup/` + `MANIFEST.md` (pre-edit copies).

- **13 NEW cases authored** (`cases/cases-H-tech-plan.json`, all VIU-Pending, blank
  C-ids — need add_case): SCH-SPREAD-11 (8-week warn + 120-shift hard cap), SCH-DEL-10
  (commit-immediately undo), SCH-EDGE-07 (DST-stable series), SCH-EDGE-08 (dark mode),
  SCH-REG-01..05 (rewrite regression: data survives migration; Dashboard ONE aggregated
  row per WO [intended fix]; WO-create appointment lands on board; multi-location tech
  shift on the WO's location only [intended change]; WO Priority field), SCH-API-01..04
  (first API cases ever for Schedule — the tech plan IS the backend contract: permission
  matrix 403s, series caps 409/422, no-pricing + WO:View server-side omission,
  cross-location 404). Two NEW sections: "Cross-Module and Rewrite Regression",
  "API — Schedule" (Rule 4).
- **16 edits**: 2 tester-facing (SCH-WOL-05/C29940 paged-loading expected line;
  SCH-VIEW-03/C30044 My-Shifts-hidden-for-non-tech line) + 14 notes-only QA flags
  (conflict cautions + confirmations; notes never reach TestRail).
- **HELD items D1 (events→capacity) + D4 (modal Reassign): the plan SPEAKS to both but
  settles NEITHER** — it builds events-count (D5, citing a PRD Q&A comment 2026-07-23)
  and drag-only reassign ("PRD wins over prototype"); product truth stays with Branko.
  Cases untouched; PO-Questions QA-internal appendix updated (also informs Q3 no-export,
  Q4 New-WO opens the real dialog, Q5 default 07:00–19:00, Q7 backend contract exists).
- **5 NEW conflicts flagged, NOT rewritten** (`Questions-for-Branko-dev.md`, layman):
  NQ-1 closure-skip in spread (plan skips; Jira V1 rule says no — hits SCH-EDGE-05/
  SPREAD-07/08), NQ-2 double-booking in the conflicts counter (plan: soft warning only —
  hits SCH-CONF-01/05), NQ-3 business-hours/closures placement (admin "Schedule
  Settings" page vs Edit Location — hits SCH-HRS-01/02), NQ-4 split shifts (plan model =
  ONE range/day — hits SCH-HRS-05..07), NQ-5 own-data write scoping (ManageShiftVoter).
- **VIU-PREP recorded** (DELTAS §E): no feature flag ever (one-release cutover; pre-cutover
  /schedule still renders LEGACY even with new endpoints live); route + atoms unchanged
  (`ROLE_SCHEDULE_VIEW/CREATE_AND_EDIT/DELETE`); DOM hook `schedule_shift_block`/
  `data-shift-id`; 17-endpoint API map + error contract in DELTAS §C.
- **NEW TALLY: 190 ACTIVE authored** (177 + 13). Deliverables regenerated over 190:
  import 190 rows (header byte-identical, 0 VIU/flag words, no dup titles/ids, API
  section emitted), id-map 190 rows (177 C-ids re-merged, 13 blank). Rule-28 audit:
  12 KEEP / 1 WEAK-KEEP / 0 CUT · 15/15 SENSIBLE · all traceable.
- **PUSH QUEUE (awaiting authorization): 2 add_section + 13 add_case + 2 update_case.**
- **NEXT:** authorize the push; send NQ-1..5 with the open Q1/Q2/Q3 sheet; live VIU when
  the QA branch exists (OQ-3) — note SCH-REG-01..04 need the CUTOVER build.

### 0.0-EPIC-EXECUTED EPIC SV-8685 SYNC EXECUTED (2026-07-27 — user-authorized TestRail writes DONE)

**The staged epic sync (§0.0-EPIC manifest) is now EXECUTED (user-authorized, Standing Rule 6):
2 add_section + 10 add_case + 167 update_case, ALL HTTP 200, ALL re-GET verified MATCH, 0 delete.**
- **2 add_section** under group 4254: **Working Hours Settings = 5405**, **Week Export and Printing = 5406**.
- **10 add_case** (new-scope, new C-ids, `custom_atmstatus:3`+`custom_automation_type:0`, non-API):
  SCH-HRS-01=**C38846**, HRS-02=**C38847**, HRS-03=**C38848**, HRS-04=**C38849**, HRS-05=**C38850**,
  HRS-06=**C38851**, HRS-07=**C38852** (all → 5405); SCH-EXP-01=**C38853**, EXP-02=**C38854** (→ 5406);
  SCH-REAS-06=**C38855** (→ existing Reassignment and Context Menu 4275).
- **167 update_case** = 157 metadata-only (refs field only) + 10 tester-facing (refs + title/preconds/
  steps/expected): SCH-FILT-01/C29942, SCH-VIEW-01/C30042, SCH-EVT-01/C30016, SCH-REAS-03/C30054,
  SCH-REAS-04/C30055, SCH-REAS-05/C30056, SCH-DEL-08/C30064, SCH-SPREAD-07/C29983, SCH-EDGE-05/C30089,
  SCH-BLOCK-04/C29994. All re-GET MATCH.
- **D1 (events→capacity) + D4 (modal Reassign) remain HELD — NOT written.**
- **NEW TALLY: 177 ACTIVE, ALL in TestRail with a C-id.** id-map re-merged 177/177 (0 blanks); import
  regenerated over 177 (header byte-identical, 0 VIU/flag words, no dup titles, no C-id column).
- Executor `build/schedule/exec_sync_epic_2026-07-27.py` (+ `exec_sync_epic_resume.py` for a 16-case
  tail after a transient HTTP 000 network drop — idempotent resume, no data loss). Audit:
  `spec-v1-2026-07-22/testrail-execution-log-epic-2026-07-27.md`; manifest header = EXECUTED.
  **Run 325 / all execution runs untouched; no secrets committed.**
- **NEXT:** Branko rulings on D1 + D4 + Week Export V1 scope; then live VIU (QA branch OQ-3). Per
  Rule 12, design-pinned ≠ VIU-Verified.

### 0.0-EPIC EPIC SV-8685 BACKFILL + DESIGN/JIRA DELTAS + NEW-SCOPE APPLIED LOCALLY (2026-07-27 — since EXECUTED, see 0.0-EPIC-EXECUTED)

**Applied LOCAL ONLY (plan item 1); TestRail push STAGED not executed.** Sources:
`build/schedule/epic-sv8685/RECONCILIATION.md` (§3 backfill map, deltas D1–D5, gap G1) +
`build/schedule/design-2026-07-27/DESIGN-RECONCILIATION-2026-07-27.md` (label/menu/timing).

- **EPIC-KEY BACKFILL — all 167 active cases** now carry a Rule-20 `refs` = `<TICKET> (<spec-anchor>)`
  (existing spec anchor kept), per the RECONCILIATION §3 section→story map. Resolves OQ-2.
  Script: `build/schedule/epic-sv8685/backfill_refs.py`. Cross-cutting permission tiers → epic
  **SV-8685**; everything else → its owning story (SV-8686..SV-8700).
- **10 tester-facing edits** (design + Jira agree / Jira deltas), script
  `build/schedule/epic-sv8685/patch_edits.py`: SCH-FILT-01/C29942 ("Filters"), SCH-VIEW-01/C30042
  ("Filter & Display"), SCH-EVT-01/C30016 ("Create Event"), SCH-REAS-03/C30054 (menu = Create
  Event + New Work Order), SCH-REAS-04/C30055 (View Day removed) + SCH-REAS-05/C30056 (New Shift
  removed) — **reworked, NOT retired**, C-ids kept; SCH-DEL-08/C30064 (toast 7s-with-Undo /
  4s-without); **D2** SCH-SPREAD-07/C29983 + SCH-EDGE-05/C30089 (shop closures NOT skipped in V1);
  **D3** SCH-BLOCK-04/C29994 (blocks default blue, custom colour optional per shift, not WO-tied).
- **10 NEW-SCOPE cases authored** (VIU-Pending, behaviours flagged confirm-at-VIU),
  `cases/cases-G-new-scope.json`: **Working Hours Settings ×7** (SCH-HRS-01..07 — SV-8699 gap G1:
  Edit-Location "Set business hours…" toggle, per-day Mon-Sun From→To, Edit-Staff "Set custom
  hours…" toggle + inherit-shop-hours, "Add hours" split shifts removable/empty, overlap red flag
  + "These hours overlap…" + Save disabled, incomplete rows ignored), **Week Export ×2**
  (SCH-EXP-01/02 — printable Dept×Tech week grid; V1 scope PENDING BRANKO), **New Work Order
  shortcut ×1** (SCH-REAS-06). Two new sections: "Working Hours Settings", "Week Export and Printing".
- **HELD (pending Branko — NOT changed):** **D1** events-count-toward-capacity (SCH-EVT-08/C30615
  + SCH-CAP-01..04 / C30030–C30033) — new design reverses Branko's earlier Q1; **D4** modal
  "Reassign" (SCH-MODAL-08/C30015 + the retired SCH-REAS-02/C30053) — Jira-vs-design conflict.
- **NEW TALLY: 177 authored ACTIVE** (167 + 10 new; SCH-REAS-02 still retired/deleted =
  178 authored incl. retired). All VIU-Pending. **Deliverables regenerated over 177:**
  `testrail-import/schedule-v1-testrail-import.csv`/`.xlsx` (177 rows, References now = Rule-20
  refs, header byte-identical to the other project imports; 0 VIU/flag words, no dup titles/ids,
  no missing fields, no C-id column), `testrail-id-map.csv` (177 rows, NEW `refs` column; ALL 177
  C-ids populated after the 2026-07-27 push — the 10 new-scope got C38846–C38855). ⚠️ `gen_import.py` blanks id-map C-ids on rerun + excludes
  Retired — ALWAYS re-merge from the prior id-map afterwards.
- **TestRail sync manifest (now EXECUTED 2026-07-27 — see §0.0-EPIC-EXECUTED):**
  `build/schedule/spec-v1-2026-07-22/testrail-sync-manifest-epic-2026-07-27.md` — **167 update_case**
  (refs backfill; 10 of them also change tester-facing fields) + **10 add_case** (new-scope) +
  **0 delete_case**; D1/D4 HELD.
- **NEXT:** Branko rulings on D1 (events→capacity) + D4 (modal Reassign) + Week Export V1 scope;
  then live VIU (QA branch OQ-3) + authorized TestRail push. Per Rule 12, design-pinned ≠ VIU-Verified.

### 0.0-SYNC-DONE TestRail SYNC EXECUTED (2026-07-22 — user-authorized writes DONE)

**The staged sync is EXECUTED (user-authorized, incl. the delete — Standing Rule 6):
7 update_case + 2 add_case + 1 delete_case, ALL HTTP 200, ALL re-GET verified MATCH.**
- **7 update_case** (all re-GET MATCH): SCH-MODAL-04 (C30011), SCH-MODAL-08 (C30015),
  SCH-CONF-02/03/04 (C30024/25/26), SCH-VIEW-04 (C30045), SCH-TIP-01 (C30034).
  (SCH-CONF-01/C30023 = notes-only, NOT pushed — correct per manifest §A.1.)
- **2 add_case** (new C-ids): **SCH-PERM-12 = C30614** (Permissions §4279, type_id 5/Negative,
  prio 3/High), **SCH-EVT-08 = C30615** (Events §4269, type_id 6/Functional, prio 2/Medium);
  both `custom_atmstatus:3` + `custom_automation_type:0`, non-API.
- **1 delete_case**: **SCH-REAS-02 / C30053** deleted (re-GET gone) — modal-Reassign removed;
  drag-reassign covered by SCH-REAS-01 (C30052). Body kept locally marked Retired; id-map −1.
- **NO execution run written** (run 325 etc. untouched); only Schedule group 4254 touched.
- Executor: `build/schedule/exec_sync_2026-07-22.py`; per-case audit log:
  `spec-v1-2026-07-22/testrail-execution-log-2026-07-22.md`; manifest header = EXECUTED.

### 0.0-APPLIED RECONCILIATION APPLIED LOCALLY (2026-07-22 — superseded by 0.0-SYNC-DONE for TestRail state)

**The spec_1 + Claude-design + Branko-Q&A reconciliation was APPLIED to the case
suite; the staged TestRail sync is now EXECUTED (see 0.0-SYNC-DONE).**
Design is **no longer missing** — the Claude prototype `Schedule.dc.html` is the
authoritative design (Branko Q0); every case `design_ref` now cites it.

- **Tally: 168 authored** (166 original + 2 new). **167 ACTIVE** — SCH-REAS-02
  (former C30053) is now **Retired** (deleted from TestRail 2026-07-22, body kept locally
  for the record; excluded from all deliverables + tally).
- **6 expected-result edits applied:** SCH-MODAL-04 (C30011, no $/labor — number/title/
  hours/status pill only), SCH-MODAL-08 (C30015, Delete-only, no Reassign), SCH-CONF-02/03/04
  (C30024/25/26, per-tech configured working days+hours, hierarchy Tech>Business>Default),
  SCH-VIEW-04 (C30045, "VIN Number" toggle gates the BLOCK only; tooltip+modal always show VIN).
- **VIN §4.13-vs-§9 RESOLVED** in favour of §4.13 (design §6) — SCH-VIEW-04 + SCH-TIP-01
  (C30034) + SCH-MODAL-01 updated; §9 tooltip-gating prose flagged to Branko for doc hygiene.
- **Events-excluded may-change notes (Branko Q1)** added to SCH-CAP-01/02/03/04 +
  SCH-CONF-01/05.
- **~48 design-pinned labels/visuals FOLDED** to the design's actual wording (VIU-confirm
  hedge removed, design cited in `notes`); **~18 items STILL need a LIVE build check** —
  trimmed register in `coverage-matrix.md` §D.1.
- **2 NEW cases** now IN TestRail (VIU-Pending): **SCH-PERM-12 = C30614**
  (permission-masking, Branko Q3, Permissions §4279) and **SCH-EVT-08 = C30615**
  (event-not-counted, Branko Q1, Events §4269).
- **Deliverables regenerated over 167 ACTIVE:** `testrail-import/schedule-v1-testrail-import.csv`/`.xlsx`
  (167 rows, 0 VIU/flag words, no dup titles/ids, no missing fields; header byte-identical to
  the other project imports), `testrail-id-map.csv` (167 rows; ALL C-ids populated incl. the
  2 new C30614/C30615; SCH-REAS-02 row removed), coverage-matrix.md, requirements.md.
  ⚠️ `gen_import.py` blanks the id-map C-id column on rerun + now EXCLUDES Retired — ALWAYS re-merge afterwards.
- **NEXT:** live VIU still pending the QA branch (OQ-3) + Epic key (OQ-2). Per Rule 12,
  design-pinned ≠ VIU-Verified.
- Method: `build/schedule/spec-v1-2026-07-22/apply_reconciliation.py` (re-runnable transform).

### 0.0 SPEC `_1` + CLAUDE DESIGN + BRANKO Q&A INGESTED — ANALYSIS ONLY (2026-07-22, historical — now APPLIED, see 0.0-APPLIED)

**Three new inputs ingested, ANALYSIS-ONLY — 166 cases, import, id-map, and TestRail
UNTOUCHED. AWAITING USER PROCESS CHOICE (Standing Rule 11) before ANY case change;
the live-VIU step is still BLOCKED on the QA branch (OQ-3) + Epic key (OQ-2).**

- **Spec `_1`** (`66b5d64f-Schedule_1.doc`) decoded → `spec-v1-2026-07-22/requirements-v1.md`.
  A full word-level diff vs the `_0` baseline found **ZERO substantive body changes** — the
  ONLY genuine change is a new **`Design`** row added to the header metadata (the Claude
  prototype link). No spec-text-driven case edits result.
- **Claude design RECEIVED — design is NO LONGER MISSING (OQ-4 flips).** `72d051ef-Schedule.zip`
  extracted to `/tmp/schedule-design/` (185 files: authoritative coded prototype
  `Schedule.dc.html`, a rendered PRD, staff/hours settings screens, 44 render screenshots,
  84 PRD screenshots, the design-system bundle). Captured → `spec-v1-2026-07-22/design-notes-claude.md`.
  **Authoritative design = `Schedule.dc.html`** (Branko Q0). ⚠️ Some `screenshots/*.png`
  (`modal-v2`/`dropdown`/`popover-v4`/`spread`) are **STALE** — they show removed $ totals /
  Assigned-Unassigned tabs / Tech-Dept toggle / By-hours spread; do NOT author to them.
- **Branko ↔ Milan Q&A INGESTED (PO rulings, authoritative, latest-wins):** Q1 events
  EXCLUDED from capacity+conflict (design code confirms; may-change); Q2 conflict = per-tech
  configured working weekdays+hours, hierarchy Tech>Business>Default (prototype hardcodes
  Mon–Fri/8–17 → confirm live); Q3 NO total $ anywhere in the schedule + WO-derived data
  masked under the pricing/Work-Orders:View permission (design modal shows line #/title/
  hours/status only, no $/labor, no Reassign button); Minor removals (Assigned/Unassigned
  tabs + Tech/Dept toggle already reflected in our cases; **Reassign-in-modal REMOVED** →
  our modal-Reassign case is stale).
- **Delta rollup (`spec-v1-2026-07-22/spec-diff-v1-2026-07-22.md`):** **~13–15 of 166 cases
  need a change or decision** — 6 expected-result edits (SCH-MODAL-04 C30011 no $/labor;
  SCH-MODAL-08 C30015 Delete-only; SCH-CONF-02/03/04 C30024/25/26 per-tech hours; SCH-VIEW-04
  C30045 VIN-toggle scope), ~4–6 status-notes (Q1 events-excluded on SCH-CAP-01/04 + SCH-CONF-01
  etc.), **1 RETIRE candidate** (SCH-REAS-02 C30053, modal-Reassign removed), **2 NEW candidates**
  (perm-masking; event-not-counted). Tabs/toggle cases need NO edit (already spec-accurate).
- **VIU-confirm register:** of ~62–64 items, **~45–48 now PINNED/resolvable by the authoritative
  design** (all D.1 labels incl. exact **"VIN Number"** toggle + conflict reason sentences; all
  D.4 visuals; ~half of D.2/D.5), **~16–18 still need LIVE build confirm** (tenant enumerations,
  timing thresholds, permission naming, the 7-7-vs-8-17 default discrepancy). Design-pinned ≠
  VIU-Verified (Rule 12 — live build still confirms at VIU).
- **VIN §4.13-vs-§9 inconsistency = RESOLVED by the design** (tooltip shows VIN unconditionally;
  the "VIN Number" toggle gates the shift-BLOCK VIN line only) → resolved in favour of §4.13;
  still recommend flagging the §9 prose to Branko for doc hygiene.
- **Recommended process (Rule 11 — NOT run):** SPEC-RELEVANCE-RECONCILIATION (primary — retire/
  add/notes + regenerate deliverables) + BUILD-ACCURATE-WORDING-VIU (the 6 expected edits +
  fold pinned design labels; live behaviour-VIU deferred until QA branch/Epic exist).
- Artifacts: `build/schedule/spec-v1-2026-07-22/{requirements-v1.md, design-notes-claude.md,
  spec-diff-v1-2026-07-22.md}`.

### 0.1 Prior status (import + authoring)

**IMPORTED TO TESTRAIL BY THE USER 2026-07-21 — id-map populated 166/166
(2026-07-22, READ-ONLY GETs, zero TestRail writes).** The user imported
`testrail-import/schedule-v1-testrail-import.csv` themselves (the Filters
precedent). Live location: project 1 / suite 1 ("Master"), **group section 4254
"Schedule - 2026 (VIU Pending)"** (parent 35), containing our **26 child sections
= ids 4255–4280 in our exact order** (4255 Navigation and Layout … 4280 Edge
Cases and Responsiveness). **Section names match ours 1:1, byte-identical — NO
name variance** (no em-dash/hyphen mangling this time; TestRail kept our
"and"-form titles as authored). Canonical TestRail URL (user-shared 2026-07-22):
https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=4254
Mapping: fetched 166 cases from sections 4255–4280 (get_sections + get_cases,
paginated), matched **166/166 by EXACT title+section** against `cases/*.json` —
0 unmatched, 0 extras; **C-id range C29925–C30090, contiguous**.
`testrail-id-map.csv` now carries all 166 C-ids.
**⚠️ id-map-regen GOTCHA (same as Filters):** `gen_import.py` REWRITES
`testrail-id-map.csv` with BLANK C-ids on every run — after ANY rerun, RE-MERGE
the C-ids (re-match by exact title+section from TestRail or from a saved copy)
before committing.

**STATUS: CASES AUTHORED & ADVERSARIALLY REVIEWED CLEAN 2026-07-21 (SPEC-ONLY — no
designs exist) — 166 cases / 26 sections authored from the v1.0 spec
(`cases/cases-A..F-*.json`, IDs `SCH-<AREA>-NN`; authoring commits 2e524ad→51af802).
The adversarial review found + FIXED 4 defects (commit 64b1813): (1) SCH-CONF-05 —
internal cross-ref mangled by the import cleaner into "(set up via/02)", reworded
id-free; (2) SCH-PERM-07 — math ⊇-notation in a reader-facing expected replaced with
layman wording; (3) SCH-TIP-01 — VIN-toggle case contradiction vs SCH-VIEW-04 fixed
by adding a "VIN toggle ON" precondition (**underlying spec §4.13-vs-§9 VIN-tooltip
inconsistency FLAGGED FOR BRANKO** — §4.13 lists tooltip VIN unconditionally, §9 ties
it to the toggle, default OFF); (4) SCH-START-06 — unobservable conditional expected
(7:00 AM fallback) removed, moved to notes. Coverage: **147 spec §1–§14 requirement
lines → case IDs, 0 gaps** (bidirectional check: 0 unmapped requirements, 0
unreferenced cases) + a **62-entry VIU-confirm register** (`coverage-matrix.md` §D:
all deferred labels/thresholds/enumerations/visuals/open behaviors). Explicit
exclusions: §15 future items + **NO API cases authored — spec has NO API contract,
ask Branko/dev if API coverage is wanted**. Import READY:
`testrail-import/schedule-v1-testrail-import.csv`/`.xlsx` via `gen_import.py` — pure
1:1 with the established format (8 named columns + 2 trailing blanks, header
byte-identical to the fees-discounts / simple-flow / global-search / filters imports —
equality check PASSED), 166 rows, VIU-word-free + feature-flag-free, deterministic.
`testrail-id-map.csv` populated 166/166 (~~blank C-ids~~ → C-ids filled 2026-07-22,
see the IMPORTED block above; the push-pending note is SUPERSEDED by the user's own
import 2026-07-21). VIU pending the QA branch/env (OQ-3) + Epic key
(OQ-2, ask at VIU). Design reconciliation pending IF Figma ever arrives (OQ-4 — none
exists today).**

**PO = Branko** (confirmed 2026-07-21; same PO as Global Search & Filters; full name
TBC). **Epic/Jira key = ⚠️ NOT AVAILABLE — ask the user at VIU.** **QA branch/env +
feature-flag/settings status = ⚠️ NOT AVAILABLE — ask the user at VIU.**
**Figma/design = NONE at the moment (user confirmed 2026-07-21) — SPEC-ONLY project.**

**NOT DONE / NEXT:**
1. ~~TestRail push/import~~ — **DONE 2026-07-21 via USER IMPORT** (group 4254,
   sections 4255–4280); id-map populated 166/166 READ-ONLY 2026-07-22
   (C29925–C30090). Remember the gen_import.py id-map-blanking gotcha above.
2. **VIU PENDING the QA branch** — ⚠️ when VIU begins, ASK THE USER for: the
   **Epic / Jira key** (OQ-2, do NOT invent), the **QA branch/env +
   feature-flag/settings status** (OQ-3 — VIU + TestRail push both wait on this),
   and **which process(es) to run per Standing Rule 11**
   (BUILD-ACCURATE-WORDING-VIU and/or SPEC-RELEVANCE-RECONCILIATION). Then resolve
   the 62-entry VIU-confirm register (`coverage-matrix.md` §D: all spec-quoted
   labels, ~9 numeric/timing thresholds, the app-deferred enumerations
   [Status-filter list, department names, palette], all prose-only visuals, and the
   §D.5 open behaviors).
3. **If Figma/designs arrive** (OQ-4 — user says possible) — capture into
   `design-notes.md` FIRST, then run a design-reconciliation pass over the suite to
   tighten the 62 VIU-confirm items + Rule-9 wording (add design_refs, reconcile
   conflicts, as done for Filters).
4. **Flag to Branko:** (a) the **spec §4.13-vs-§9 VIN-tooltip inconsistency** (§4.13
   lists tooltip VIN unconditionally; §9 ties it to the VIN toggle, default OFF —
   cases currently authored to the toggle-gated reading, SCH-TIP-01/SCH-VIEW-04);
   (b) the **no-API-contract question** — spec v1.0 has zero endpoints; ask
   Branko/dev for the backend contract if API coverage is wanted (`gen_import.py`
   already routes `api_related` cases to an "API — <leaf>" section per Standing
   Rule 4).
5. **Expect spec revisions from the PO** — on each spec update, run
   SPEC-RELEVANCE-RECONCILIATION per Standing Rule 11 (ask first, as always).

## 0.1 Status detail

- Authoring: **DONE 2026-07-21** (SPEC-ONLY per §0.6's assessment — user launched
  authoring; commits 2e524ad→51af802). Verified before commit: 166/166 cases carry
  all schema fields; 0 duplicate ids/titles; import rows == case count (166); header
  equality vs all four prior imports PASSED; 0 VIU/flag words in import cells; no
  invented labels (spec labels verbatim, unpinned items generic + VIU-confirm notes);
  coverage matrix bidirectional check clean (147 requirement lines, 0 gaps).
- Adversarial review: **DONE 2026-07-21, CLEAN after fixes** (commit 64b1813) — found
  + fixed 4 defects: SCH-CONF-05 import-cleaner cross-ref mangle; SCH-PERM-07 math
  notation in reader-facing expected; SCH-TIP-01 VIN-toggle contradiction vs
  SCH-VIEW-04 (spec §4.13-vs-§9 inconsistency flagged for Branko); SCH-START-06
  unobservable expected removed. Import CSV/XLSX + id-map regenerated post-fix (166
  rows, header byte-identical, 0 VIU/flag words, 0 internal-id leaks).
- Spec: **INGESTED (complete)** → `requirements.md`. Source doc
  (`/root/.claude/uploads/.../beb1e7e0-Schedule.doc`) was a Confluence "Export to
  Word" MHTML / quoted-printable file (`Subject: Exported From Confluence`,
  `Content-Transfer-Encoding: quoted-printable`). Decoded with Python `email` (MIME
  walk to the `text/html` part → `get_payload(decode=True)`, which handles the
  quoted-printable) + BeautifulSoup, preserving all headings, lists, and tables. Full
  spec captured verbatim-structured (overview, personas, IA, 13 core-feature
  sub-sections, sidebar, toolbar, interactions, data model, view options, color
  system, NFRs, edge cases, success metrics, roles & permissions, future
  considerations). `file` reported "news or mail, ASCII text" (the MHTML signature) —
  same family as every prior ShopView spec.
- Design: **NONE (user confirmed 2026-07-21).** SPEC-ONLY. No `design-notes.md` (no
  Figma to capture). The spec has no images/Figma links/screenshot refs.
- Cases: **AUTHORED 2026-07-21 — 166 cases / 26 sections**, SPEC-ONLY, in
  `cases/cases-A..F-*.json` (internal IDs `SCH-<AREA>-NN`; schema identical to the
  Filters/Global-Search case JSON; every case `viu_status: VIU-Pending`,
  `api_related: false`, `design_ref: none - SPEC-ONLY`). Per-file split:
  A navigation+sidebar 30 · B dnd/scope/start/spread/series 36 · C
  blocks/lanes/day-view/modal 25 · D events/conflicts/capacity/tooltips 23 · E
  toolbar/views/reassign/delete/keyboard/color 35 · F permissions/edge 17.
- Deliverables: `coverage-matrix.md` (every §1–§14 requirement → cases; §15 + API +
  metrics exclusions; VIU-confirm register §D), `gen_import.py`, canonical import
  `testrail-import/schedule-v1-testrail-import.csv`/`.xlsx` (166 rows; header
  byte-identical to the other four project imports — verified), `testrail-id-map.csv`
  (166 rows, blank C-ids).
- TestRail: **NOT pushed** — `testrail-id-map.csv` C-id column blank. **No TestRail
  writes without explicit user permission** (Standing Rule 6).
- Env/VIU: **NOT available yet** — QA branch/env + flag/settings status unknown. VIU
  deferred until it ships to a testable environment.
- PO: **Branko** (confirmed 2026-07-21; full name TBC). Spec URL recorded (§1).

## 0.5 What is blocking / awaiting

Onboarding + authoring are done; remaining items:
- ⚠️ **This §0.5 block is HISTORICAL (2026-07-21 onboarding view). The current blocking list
  is §0.0-SPEC-V23 + §0.0-BRANKO-ANSWERS "OPEN AFTER THIS PASS".** Since it was written:
  **OQ-2 is RESOLVED (Epic = SV-8685)**, **OQ-4 is RESOLVED (a design exists — the Claude
  prototype, per Branko Q0)**, and `requirements.md` is at **Confluence v23**. Only **OQ-3
  (QA branch / env + flag/settings status)** is genuinely still open, plus the held
  SCH-EXP-01 (C38853) retire authorization and sending the revised PO sheet.
- **⚠️ Epic / Jira key (OQ-2)** — ~~ASK THE USER when VIU begins~~ **RESOLVED = SV-8685.**
- **⚠️ QA branch / env + feature-flag/settings status (OQ-3)** — ASK THE USER; VIU +
  TestRail push wait on this.
- **Figma/designs (OQ-4)** — NONE at the moment (user-confirmed). If tighter
  visual/label fidelity is wanted before authoring, the user can provide Figma exports;
  otherwise author SPEC-ONLY with VIU-confirm placeholders.
- Per **Standing Rule 11**, ASK which process(es) to run before any VIU pass.
- **RESOLVED:** OQ-1 (PO = Branko), canonical spec URL recorded.

## 0.6 AUTHORING-READINESS ASSESSMENT (critical — read before authoring)

**Bottom line: the spec is LARGELY SELF-SUFFICIENT to author PRD-accurate manual test
cases now, WITHOUT designs — it is unusually label-rich and behavior-complete. It is
NOT a half-spec. Full build-accurate wording (Standing Rule 9) and all visual-rendering
details still require a LIVE VIU pass on a QA build (no QA env yet), exactly like every
other project. No part of the spec is genuinely un-authorable for lack of designs; the
gaps are the normal "confirm the exact on-screen label/visual live" gaps, handled with
VIU-confirm placeholders.**

**Why self-sufficient (what the spec DOES give):**
- Rich, explicit **behavior** for every feature: drag-and-drop scenarios (§4.1), scope
  picker (§4.3), multi-day spread (§4.5), linked-series banners (§4.6), overlap/lane
  stacking with the 3-lane cap + "+N more" (§4.7), day-view timeline interactions
  (§4.8), shift detail modal contents (§4.9), events (§4.10), conflict detection with
  the 4 conflict types (§4.11), capacity visualization (§4.12), hover tooltips (§4.13),
  filters (§5.1), toolbar controls (§6), micro-interactions incl. series-aware
  deletion scopes (§7), view options (§9), color system (§10), edge cases (§12).
- Many **on-screen labels are named in the prose**, e.g.: "Search work orders",
  "Search lines", "Needs techs" badge, "All / Unscheduled" chips, "Schedule whole work
  order", "Select multiple", "Select all", "Create shift · 2 lines · 6h", "Change
  scope", spread options ("Full estimate", "1 week", "2 weeks", "Until a date…",
  "Specific hours…"), "+N more", "Today" button, "Filter" button, "Clear all",
  "Filter and Display", "View Options" toggles ("Business Hours", "Capacity Bars",
  "Events", "Tech Hours", "Saturday", "Sunday"), "My Shifts", "VIN", right-click menu
  ("New Shift", "New Event", "View Day"), conflict types ("Double-booked", "Weekend
  shift", "Before hours", "After hours"), delete scopes ("This shift only", "This and
  everything after", "The whole series"), "OT" tag, "Adjust", "Reassign".
- A concrete **data model** (§8) with entities/fields/relationships.
- A complete **roles & permissions** model (§14) — View/Edit/Delete tiers with the
  Delete⊇Edit⊇View dependency, the Work Orders: View sidebar dependency (§14.2), the
  no-"own-only" rule (§14.3), and the department-based grid-row rule (§14.4). This maps
  cleanly to the Custom Roles permission-testing pattern already in this workspace.

**What genuinely needs LIVE VIU (NOT blockers to authoring — normal VIU-confirm; would
be tighter WITH designs but none exist):**
- **Exact on-screen wording** of every label above must be verified against the real
  build per Standing Rule 9 (PRD labels can differ from the shipped build). Author with
  the spec's wording, tag as VIU-confirm, correct live at VIU.
- **Visual-only rendering** described in prose but not shown (no Figma): shift block
  three/four-line anatomy & color tinting (§4.4), event-vs-shift card styling (§4.10),
  connected-series banner rendering across month/week/day (§4.6), lane-stacking growth
  & "+N more" popover (§4.7), capacity-bar blue-fill / amber-spill / OT-tag (§4.12),
  business-hours shading, now-line, drag ghost block. These are testable behaviorally
  from the spec (what appears/when), but pixel/label exactness needs the live build (or
  Figma if later provided).
- **Enumerations the spec defers to the app:** the Status-filter list ("All work order
  statuses currently supported in the app", §5.1) and department names (examples only)
  — source from the app at VIU.
- **Numeric/timing thresholds** to confirm live: 15-min snap, 300–500ms hover delay,
  4–7s toast, 150px/960px responsive breakpoints, auto-scroll buffer 30–60min.

**What is NOT in the spec (flag to user; may need more input):**
- **No API contract** — zero endpoints, HTTP methods, or status codes anywhere (unlike
  Global Search / Simple Flow / Fees & Discounts). If API-level cases are in scope
  (Standing Rule 4), the backend contract must be supplied; otherwise author UI-only.
- **No dev plan / phasing / rollout** section (Global Search had a 5-phase plan).
  Confirm delivery phasing with the PO if it affects scoping.
- **No Figma/designs** — user-confirmed NONE at the moment. Author SPEC-ONLY.

**Recommendation:** authoring can proceed SPEC-ONLY on the user's go-ahead, producing
PRD-accurate cases with VIU-confirm tags for unpinned labels/visuals; then VIU live
once a QA branch exists. If the user prefers maximum visual/label fidelity up front,
they can provide Figma exports first (optional, not required to start).

## 1. Project identity

- **Project:** Schedule — ShopView App · Technician Scheduling Module.
- **Spec doc title:** "Schedule" (Confluence export; Status Complete, v1.0, Last
  Updated July 15, 2026; Author "Product Team"; Stakeholders: Engineering, Design,
  Shop Operations).
- **Canonical spec URL (Confluence):**
  https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/713031682/Schedule
  (Atlassian-SSO login-walled — **reference pointer only; do NOT fetch**; content
  already ingested from the exported `.doc`).
- **Figma / design:** NONE at the moment (user confirmed 2026-07-21) — SPEC-ONLY.
- **PO: Branko** (confirmed 2026-07-21; full name TBC). *(Never mix PO attributions —
  Schedule = Branko; Global Search = Branko; Filters = Branko; Fees & Discounts =
  Chris Ward; Simple Flow = Milos.)*
- **Epic / Jira key:** ⚠️ NOT AVAILABLE YET — ASK the user when VIU begins (OQ-2).

## 2. Feature summary (one paragraph)

A visual **technician scheduling calendar** for shop managers: a top-level nav area
with a left **work-order sidebar** (mini calendar + searchable/filterable WO cards +
per-line drill-down with draggable, approved-only lines) and a main **schedule grid**
(Day / Week / Month, department-grouped technician rows, plus an in-grid Unassigned
lane). The core interaction is **drag-and-drop** of a WO card or line onto a
technician × day/time cell, which creates **shifts** — with a **scope picker** for
multi-line orders and a **multi-day spread** step for large jobs that produces a linked
**series** rendered as a connected banner. It adds **events** (non-WO time blocks),
**conflict detection** (double-booked / weekend / before-hours / after-hours),
**capacity bars**, hover tooltips, overlap **lane-stacking** (3-lane cap + "+N more"),
series-aware deletion, undo toasts, and keyboard support. Scheduling a tech onto a line
keeps the WO **labor roster** in sync. Access is gated by a **Schedule
View/Edit/Delete** custom-role permission tier (Delete⊇Edit⊇View) plus a **Work
Orders: View** dependency for the sidebar; grid rows are **department-based**, not
role-based. No API endpoints appear in the spec.

## 3. Deliverables index (this folder: `build/schedule/`)

- `requirements.md` — COMPLETE structured spec (§1–§15) **at Confluence version 23**
  (promoted from v18 on 2026-07-31; spec-currency header + the body-"Version 1.0"
  staleness gotcha + inline `[v19]`…`[v23]` delta tags + "Removed upstream (v19–v23)"
  appendix + Branko's `[PO 2026-07-31]` notes) + onboarding metadata + refreshed open
  questions (PO = Branko Cicovic; Epic = SV-8685; QA branch/env = still ask; designs
  exist), 2 flagged spec-internal contradictions (X1/X2) and 6 spec-silent items (S1–S6).
- `spec-current-2026-07-31/Schedule-spec-current.md` + `SPEC-DIFF.md` — the verbatim live
  v23 Confluence body + the per-version-attributed v18→v23 diff (evidence for the above).
- `PO-Questions-Branko-Schedule-TechPlan_2026-07-30.md`/`.xlsx` — **revised 2026-07-31,
  READY TO SEND: 8 questions** (3 confirmations + 1 open choice + 4 new spec-silent), 2
  now-answered re-asks withdrawn to the QA-only section with Branko's verbatim words, NQ-5
  re-routed to dev. Generated by `gen_po_questions_techplan.py`, which fails the build on
  reader-facing jargon.
- `cases/cases-A..F-*.json` — **166 authored cases / 26 sections** (SPEC-ONLY,
  2026-07-21), IDs `SCH-<AREA>-NN`, all `VIU-Pending`.
- `coverage-matrix.md` — every spec §1–§14 requirement → case IDs; §C explicit
  exclusions (§15 items, **API NOT AUTHORED — no contract in spec**, §13 metrics,
  no mobile spec); §D VIU-confirm register (labels/thresholds/enumerations/visuals/
  open behaviors).
- `gen_import.py` — canonical import generator (Standing Rules 4/16 baked in).
- `testrail-import/schedule-v1-testrail-import.csv`/`.xlsx` — 166 rows, pure 1:1
  format (header byte-identical to the other four project imports — verified),
  VIU-word-free + feature-flag-free.
- `testrail-id-map.csv` — 166 rows (`internal_id,testrail_case_id,title,section`);
  the sole traceability source per Standing Rule 8; C-ids blank (not pushed).
- `PROJECT-STATE.md` — this file (canonical resume doc).

## 4. Shared infrastructure to reuse (do NOT re-invent)

- **Build-accurate wording + VIU method:** `build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`
  (Standing Rules 9/10) — apply when the user asks and once the feature is VIU-able.
- **Spec-relevance / obsolescence reconciliation:**
  `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` (Standing Rules 10/11).
- **Testing runbook / app-actions:** `build/TESTING-RUNBOOK.md`,
  `build/APP-ACTIONS-PLAYBOOK.md`.
- **Two-env permission-compare method:** `build/PROD-VS-STAGING-COMPARE-METHOD.md`
  (relevant to the §14 role-based access model — live per-role UI observation).
- **Permissions assessment:** `build/PERMISSIONS-ASSESSMENT.md`.
- **Import format template:** any existing `testrail-import/<project>-testrail-import.csv`
  + that project's `gen_import.py` (Standing Rule 16 — mirror 1:1).
- TestRail: project **1** / single suite **1 "Master"**; API v2 Basic auth; `add_case`
  requires `custom_atmstatus:3` + `custom_automation_type:0`; result statuses 1 Passed
  / 2 Blocked / 3 Untested / 4 Retest / 5 Failed. **Standing Rule 4:** any case
  touching API endpoints/methods/status codes → a TestRail section whose title includes
  'API' (NOTE: the Schedule spec currently has NO API content).

## 5. Testing-relevant highlights for future case authoring

- **Areas to cover (candidate `SCH-` groups):** sidebar (mini calendar, WO cards,
  search, filters, line drill-down), grid views (Day / Week / Month, department
  grouping, Unassigned lane), drag-and-drop scheduling, scope picker, shift start-time
  hierarchy, multi-day spread + series banners, shift block anatomy, overlap/lane
  stacking, day-view timeline interactions, shift detail modal, events, conflict
  detection, capacity visualization, hover tooltips, grid toolbar, micro-interactions
  (toasts/undo, keyboard, series-aware delete, reassignment), view options &
  customization, color system, permissions (View/Edit/Delete + WO-View dependency +
  department-based rows), edge cases, NFRs.
- **Permissions (§14):** View / Edit / Delete tiers (Delete⊇Edit⊇View); nav item hidden
  when View is OFF; sidebar hidden when Work Orders: View is OFF; NO "own-only"
  restriction (My Shifts is a convenience filter, not a boundary); grid rows are
  department-based, not role-based; clock-in gated by the staff "Time Clock" setting.
  Will need live per-role UI observation at VIU (Custom Roles pattern).
- **States to cover:** empty/first-time, unassigned shifts, conflicted shifts (each of
  4 types), overtime (OT tag, distinct from capacity), series (first/middle/last shift
  delete adaptivity), overflow ("+N more"), VIN-on vs VIN-off, each toolbar toggle
  on/off, business-hours shading, now-line.
- **Author from spec wording; mark unpinned labels VIU-confirm** (see §0.6). Do NOT
  invent labels. No API cases unless a backend contract is later provided.

## 6. How to resume (ordered)

1. Read this file (§0 first), then `coverage-matrix.md` (coverage + exclusions +
   VIU-confirm register), then `requirements.md` for spec detail. No
   `design-notes.md` (no designs exist).
2. Cases live in `cases/cases-A..F-*.json`; regenerate the import + id-map any time
   with `python3 build/schedule/gen_import.py` (deterministic; runs its own sanity
   checks — dupes, VIU/flag words, empty fields).
3. **⚠️ ASK THE USER for the Epic/Jira key (OQ-2)** and the **QA branch/env +
   flag/settings status (OQ-3)** before/at VIU. If the user later provides Figma,
   capture it into `design-notes.md` first and run a design-reconciliation pass.
4. Per **Standing Rule 11**, ASK which process(es) to run (BUILD-ACCURATE-WORDING-VIU
   and/or SPEC-RELEVANCE-RECONCILIATION) before the VIU pass.
5. VIU pass once on a QA env: verify LIVE with evidence (Standing Rules 10–14),
   resolve the VIU-confirm register (`coverage-matrix.md` §D), correct wording to the
   real build, then regenerate the import.
6. **TestRail push only after** the feature is on a QA env AND the user grants
   explicit TestRail permission (Standing Rule 6). After the push, re-merge the
   assigned C-ids into `testrail-id-map.csv` (gen_import.py blanks the C-id column
   on rerun — same gotcha as Filters).
7. If API cases become in-scope (Branko/dev supplies the contract): author them with
   `api_related: true` — the generator already routes them to an "API — <leaf>"
   section (Standing Rule 4).

## 7. Env / access facts

- **TBD — feature not yet confirmed on any QA environment / branch.** No QA host, no
  quick-login, no feature-flag/settings confirmation recorded yet. Populate this
  section once the user provides the QA env + flag/settings status (OQ-3). Secrets
  (cookies/tokens) go in `/tmp` only — never in this repo.
- **No API endpoints** are given in the spec (populate here if/when a backend contract
  is supplied).
- Reuse the workspace's shared staging/QA access method + harness (undici ProxyAgent /
  MITM bridge / boot2 hydration patterns) once the env is known — see
  `build/TESTING-RUNBOOK.md`.

## 8. Open threads

- **OQ-1 PO = Branko (RESOLVED 2026-07-21); canonical spec URL recorded (RESOLVED).**
- **⚠️ OQ-2 Epic / Jira key — STILL OPEN: ASK THE USER when VIU begins** (not available
  as of 2026-07-21).
- **⚠️ OQ-3 QA branch / env + feature-flag/settings status — STILL OPEN: ASK THE USER**
  (VIU + TestRail push wait on it).
- **OQ-4 Designs / Figma — NONE at the moment (user-confirmed 2026-07-21).** SPEC-ONLY
  authoring; VIU-confirm unpinned labels/visuals. User may provide Figma later
  (optional).
- **OQ-5 Spec-internal ambiguities** (see `requirements.md` open-questions): exact
  on-screen label wording (VIU-confirm), Status-filter enumeration + department names
  (source from app), NO API contract, NO dev/phasing plan.
- **OQ-6 FLAG TO BRANKO (from the 2026-07-21 adversarial review):** (a) spec
  §4.13-vs-§9 VIN-tooltip inconsistency (§4.13 lists tooltip VIN unconditionally, §9
  ties it to the VIN toggle, default OFF — cases authored to the toggle-gated
  reading); (b) the no-API-contract question (does Branko/dev want API cases? supply
  the backend contract if so).
