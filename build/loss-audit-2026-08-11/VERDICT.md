# LOSS AUDIT — did the 2026-08-11 limit kill cost us anything?

**The QA lead asked:** *"are you sure that the earlier limit issue which we faced did not cause us to
lose anything, and if we really recovered anything we lost."*

**This is an independent re-proof, not a re-reading of `build/RECOVERY-2026-08-11/STATE.md`.** Every
figure below was established from **live TestRail** (`get_*` only), **live git**, and each pass's own
committed artefacts. **Zero TestRail writes · zero Jira calls.**

**Run at** 2026-08-12 ~01:35–02:05Z. **Live harvest:** 626 sections, 4,096 cases (fully paged), runs
357 / 352 / 359 in full.

---

## THE VERDICT, IN PLAIN WORDS

> ## ✅ NO QA WORK WAS LOST.
> **Every operation the six killed passes intended is now either landed, or was deliberately dropped
> for a documented and better reason. Nothing is in the "never landed and never redone" category.**
> **All three test runs are intact — every graded result still present, by ID.**

**But the honest answer has a second half, and it is not "nothing":**

> ## ⚠️ ONE THING WAS GENUINELY LOST AND CANNOT BE GOT BACK.
> **The follow-up push's contemporaneous byte-comparison output** — the executor's own
> `ops.json` / `exec-log.txt` — **was written to `/tmp` and died with the container.** The two writes
> it covers **did land and are provably correct**, verified field by field against the executor's
> intended literals. But the *original* proof that they verified clean at the moment of writing is
> **gone and unrecoverable**. What stands in its place is an **after-the-fact reconstruction**, and it
> says so on its own first line.
>
> **This is a small loss. It is not a trivial one** — it is exactly the class of loss that is
> invisible from TestRail, because the data is right and only the evidence is missing. It is the
> reason Job 2's strengthened rule requires verification evidence to be **committed to the repository,
> never left in `/tmp`**.

**And two open items that are NOT loss but should not be buried:** the Schedule local case source is
**stale on 6 cases** (§F), and the redacted JWTs **remain in git history** (§G).

---

## A. WHAT WAS IN FLIGHT — established from commit activity, not from the recovery note

The kill landed at roughly **14:23Z**, the timestamp of the sweeper's last commit
(`5b1b573f`). Counting every file touched by a commit in the final ninety minutes
(`13:00–14:30Z`) gives the independent picture of who was working:

| Pass folder | files touched 13:00–14:30 | What it was |
|---|---|---|
| `build/schedule/build-viu-2026-08-11` | 119 | **Pass 4** — Schedule build VIU / label diff |
| `build/schedule/coverage-gaps-2026-08-11` | 75 | staged pack feeding the Schedule push |
| `build/filters/read-dates-2026-08-11` | 71 | Filters read-date stamping |
| `build/filters/sv9041-2026-08-11` | 59 | **Pass 2** — Filters SV-9041 |
| `build/schedule/read-dates-2026-08-11` | 31 | Schedule read-date stamping |
| `build/schedule/staged-push-2026-08-11` | 29 | **Pass 1, phase 1** |
| `build/schedule/build-verify-2026-08-11` | 21 | Schedule build verification |
| `build/automated-flag-fix-2026-08-11` | 21 | Automated-flag correction |
| `build/schedule/assertion-forensics-2026-08-11` | 15 | staged repairs only |
| **`build/schedule/followup-push-2026-08-11`** | **1** | **Pass 1, phase 2 — its executor and nothing else** |

**That last row is the whole story of the kill in one line.** A pass that had already written to
TestRail had committed **one file**: `tools/exec_followup.py`. No findings, no changes-made, no
execution log. It is the only pass that died *between writing and recording*, and it is the only place
anything was actually lost.

**Note on counting:** the recovery calls this "six passes" (six *workers*); the folder count is higher
because one worker owns several folders. The two accounts are consistent — a worker is the unit that
died, a folder is the unit of work.

---

## B. THE PER-OPERATION LEDGER

**Method (Rules 12 / 50):** landing was decided by **comparing live case text against each pass's own
intended payload**, taken from its committed executor or plan. **`updated_on` was never used to decide
anything** — it is reported only as corroboration. That is not pedantry: three Filters cases carried
that day's timestamp from an *unrelated* pass while the intended write had never happened, and a
timestamp-based check would have called all three a success.

### Pass 1, phase 1 — Schedule staged push · 10 operations · **10 landed**

| Case | Intended | How it was checked live | Verdict |
|---|---|---|---|
| [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) | *"steps 1 to 7"* | text reads `steps 1 to 7` | ✅ **LANDED** |
| [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) | *"steps 1 to 6"* | reads `steps 1 to 6` | ✅ **LANDED** |
| [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) | *"steps 1 to 7"* | reads `steps 1 to 7` — see note | ✅ **LANDED** |
| [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) | *"steps 1 to 4"* | reads `steps 1 to 4` | ✅ **LANDED** |
| [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) | *"steps 1 to 5"* | reads `steps 1 to 5` | ✅ **LANDED** |
| [C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | *"steps 1 to 7"* | reads `steps 1 to 7` | ✅ **LANDED** |
| [C29998](https://shopview.testrail.io/index.php?/cases/view/29998) | update | present, `created_by`=3, `custom_atmstatus`=1 | ✅ **LANDED** |
| [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | `refs` | see phase 2 below | ✅ **LANDED** |
| **[C43588](https://shopview.testrail.io/index.php?/cases/view/43588)** | `add_case` — dark mode chosen from the user menu | exists · section **4280** · `created_by`=3 · `atmstatus`=**1** | ✅ **CREATED** |
| **[C43589](https://shopview.testrail.io/index.php?/cases/view/43589)** | `add_case` — dark-mode pop-ups still look raised | exists · section **4280** · `created_by`=3 · `atmstatus`=**1** | ✅ **CREATED** |

> **A near-miss in my own checking, recorded because it is instructive.** A blunt regex for
> `steps 1 to (\d+)` flagged **C43584** as a mismatch: it returns **two** hits, `7` and `4`. Reading
> them in context, both are correct and they mean different things — step 7 of the *steps* field says
> *"Check each of the four things you set up in **steps 1 to 4**"* (a back-reference to the setup
> steps), while the *expected result* says *"**steps 1 to 7** cannot be carried out"* (the whole case,
> which does have 7 steps). **A pattern match is not a verification.** Had I reported the first
> result, I would have manufactured a defect in a correct case.

### Pass 1, phase 2 — Schedule follow-up push · 2 operations · **2 landed, evidence lost**

| Case | Intended (from `exec_followup.py`) | Live content | Verdict |
|---|---|---|---|
| [C29944](https://shopview.testrail.io/index.php?/cases/view/29944) | **remove** the unsourced multi-status assertion | the phrase *"more than one status"* is **absent** | ✅ **LANDED** |
| [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | re-point provenance from the **epic** to the **owning stories**, leaving sentence 2 alone | names **story SV-8700** and **story SV-8698**; build stamp `v3.5-7ec992f` **preserved** | ✅ **LANDED** |

**⚠️ This is where the one real loss sits.** The executor wrote its byte-comparison output to
`/tmp/fu-push`, which did not survive. Its three deliverables were **reconstructed at ~17:55Z** from
the executor's literals, the live text and the recovery note — and
`followup-push-2026-08-11/testrail-execution-log.md` **opens by declaring itself a reconstruction** and
names precisely what cannot be quoted. **That is the right way to handle it**, and it is why this
counts as a loss of *evidence* rather than a loss of *work*.

### Pass 2 — Filters SV-9041 · 3 planned · **0 landed at the kill · fully resolved since**

| Case | Intended by the killed `plan.py` | State at the kill | State now | Verdict |
|---|---|---|---|---|
| [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | tester note + **SV-9041** in provenance | ❌ absent | **SV-9041 present** | ✅ **REDONE** |
| [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | SV-9041 + Rule-56 divergence | ❌ absent | **SV-9041 present** | ✅ **REDONE** |
| [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | add SV-9041 | ❌ absent | **still absent — deliberately** | ✅ **CORRECTLY DROPPED** |
| **[C43590](https://shopview.testrail.io/index.php?/cases/view/43590)** | *(not in the original plan)* | — | created, `atmstatus`=1 | ✅ **NEW COVERAGE** |

**C38882 is not a loss — dropping it was the better answer, and it is argued rather than assumed.**
The redo pass re-derived the scope from the ticket instead of replaying the dead plan, and recorded
its reasoning: C38882 is the **Date Range** case and *"contains no assertion about the collapse toggle
at all"*. Adding SV-9041 to it would have named a source that does not support its expectation — which
**Rule 54** calls *"WORSE THAN NONE… it manufactures false authority"*.

**The redo also found something the original plan had missed:** no case drove SV-9041's *negative*
limb — a page with exactly one filter, where the toggle should be **absent**. **C43590** now does.
**So the kill's net effect on Pass 2 was to make its output better**, because the re-derivation was
forced to start from the source rather than from a stale set of string-surgery anchors.

**The recovery left a question open here — "were the brief's other five cases in scope?" — and it is
now closed.** The redo examined C29602–C29605, C29629 and C38903 individually and recorded why each is
independent of SV-9041. **No open question remains for the QA lead on this point.**

### Pass 3 — Report Suite read-dates · **0 writes at the kill · fully redone**

| Suite | Our cases | Carrying *"read on 11 August 2026"* | Verdict |
|---|---|---|---|
| **Report Suite** | 480 | **480** | ✅ **100%** |
| **Filters** | 115 | **115** | ✅ **100%** |
| **Schedule** | 176 | **176** | ✅ **100%** |

At the kill only **2 of 476** Report Suite cases carried a read-date. The whole job has since been
done, and the Filters and Schedule stamping from the pre-kill passes **survived intact**.

### Pass 4 — Schedule build VIU / labels · **0 writes at the kill (by design) · 12 corrections since pushed**

All **12** staged label corrections were pushed at 17:54Z. I verified each one by comparing the pass's
own committed **POST** snapshot against live, field by field:

`C30042 · C30046 · C30047 · C30050 · C30051 · C29930 · C30043 · C30044 · C30045 · C30082 · C30025 · C30015`

> **12 of 12 — POST snapshot byte-identical to live on `title`, `custom_preconds`, `custom_steps`,
> `custom_expected` and `refs`. Nothing has drifted since the push.**

*(This pass stopped deliberately on discovering the JWT leak. Stopping was correct — see §G.)*

### Pass 5 — secret redaction · **nothing done at the kill · since completed**

**13 files** cleaned, **12 distinct tokens**. The tracked tree is now **clean across 11,696 files**,
confirmed by re-running `build/testing-tools/scan_secrets.py --tracked` myself rather than trusting
the pass's own report.

> **A counting discrepancy, resolved rather than glossed:** the recovery said *"13 files, 28
> occurrences"*; the redaction commit says *"12 tokens"*. **Both are right.** `eyJ` matches **twice
> per JWT** — a token's header *and* its base64-encoded payload both begin `eyJ` — so the raw regex
> hit count is double. The true figures are **13 files · 14 occurrences · 12 distinct tokens**, and the
> redaction report states exactly that.

### Pass 6 — the git sweeper · **complete**

110 commits committed and pushed between ~13:34Z and 14:23:57Z. **This is the single reason the loss
was as small as it was.** Everything the other passes had written to disk was on the remote before the
kill; only what had never been written down was at risk.

---

## C. THE THREE RUNS — every result still present, by ID

Verified against **every** committed historical snapshot of each run, not just the most recent —
52 snapshot files in all. Graded fields compared individually; `case_title` and `case_refs` treated as
the **declared read-time echoes** they are (playbook §J, normalisations #2 and #2b).

| Run | `include_all` | Tests | Results | Historical result IDs checked | Missing **by ID** | **Graded fields changed** |
|---|---|---|---|---|---|---|
| **357** Schedule — Ayesha Khan | **false** | **176** | **529** | 458 | **0** | **0** |
| **352** Filters — Ahtasham Amjad | **false** | **115** | **473** | 473 | **0** | **0** |
| **359** Report Suite — Nebojsa / Viktoria | **false** | **480** | **535** | 545 | **10** | **0** |

### The 10 apparently-missing run-359 results are not loss — traced, not assumed

They belong to **9 cases**: C30182, C30350, C30445, C30453, C30529, C30532, C30544, C30586, C30608.

- **All 9 return HTTP 400 from `get_case` — they were deleted.**
- All 10 records carry **`status_id: 3` (Untested)** — placeholder rows, never graded results.
- Walking every snapshot in date order puts their disappearance **between 2026-08-04 09:42 and 10:12**
  (539 → 529), which is the documented `merges-2026-08-04` consolidation — **a week before the kill**.
- Deleted cases dropping out of a run is the **expected** behaviour under Rule 34.

**Also worth recording:** all three runs were **union-synced by a sibling worker while this audit was
running** (357: 174→176, 352: 114→115, 359: 476→480). I re-read all three afterwards. **The syncs did
no damage — 0 results missing by ID, 0 graded fields changed on any of the three.** The suite/run gaps
the recovery flagged are now closed.

---

## D. THE GIT SIDE — the loss TestRail cannot show

| Check | Result |
|---|---|
| `HEAD` vs `origin/claude/slack-session-0sxnd9` | **0 ahead · 0 behind** (after an explicit `fetch`) |
| Uncommitted or unpushed pass output | **none** |
| Stashes | **0** |
| Untracked files | **4** — all in `build/run-sync-2026-08-11/`, a sibling's **live** work, not orphans |
| Orphaned files from the killed passes | **none** |
| Dangling commits | **2**, both pre-dating the kill — content verified still present |

**The two dangling commits are not lost work, and I checked rather than assumed:** `c1395f23`
(2026-07-31) and `8f6f24ce` (2026-08-05). The latter added **Standing Rule 57** to `CLAUDE.md` — Rule
57 is present today. The former edited the outstanding-items register — its text is present today.
Both are ordinary artefacts of amended commits.

---

## E. THE RECOVERY'S OWN TO-DO LIST — all nine items discharged

Checked one by one against live state, not against anyone's status report.

| # | Item | State |
|---|---|---|
| 1 | Tell the QA lead the repo is public and carries JWTs | ✅ written up — **but the decision is still his** (§G) |
| 2 | Run the secret-redaction pass | ✅ done — tracked tree clean, 11,696 files |
| 3 | **Re-sync Filters local source FROM LIVE** *(the recovery's highest-risk item)* | ✅ done — **0 differences across all 115** |
| 4 | Finish Pass 1's paperwork | ✅ done — and honestly labelled a reconstruction |
| 5 | Re-run Pass 2 with a **rebuilt** plan | ✅ done — 2 written, 1 correctly dropped, 1 new case |
| 6 | Put run 357's sync to the QA lead | ✅ done — union-synced 174 → 176 |
| 7 | Run Pass 3 from the top | ✅ done — 480 of 480 |
| 8 | Decide on Pass 4's 12 label corrections | ✅ done — pushed and verified intact |
| 9 | Record the stale-checkout hazard in the playbook | ✅ done — `APP-ACTIONS-PLAYBOOK.md` §L |

**Item 3 deserves a sentence of its own.** It was the one that could have *created* loss rather than
revealed it: regenerating the Filters deliverables from the stale local source would have pushed the
suite back to spec v18 and stripped the read-dates, silently reverting two completed live passes. **It
was re-synced before anything was regenerated.** The danger passed.

---

## F. ⚠️ OPEN, AND FOUND BY THIS AUDIT — the Schedule local source is stale on 6 cases

**Not loss, but the same class of hazard as item 3 above, and currently live.**

The labels-final pass pushed 12 corrections to TestRail and **did not re-sync its local case source or
regenerate the Schedule import**. Six local bodies still carry the **old** labels while TestRail
carries the **corrected** ones:

| Case | Local (stale) | Live (correct) |
|---|---|---|
| [C29930](https://shopview.testrail.io/index.php?/cases/view/29930) | `'…and Display' dropdown` | `'…& display' dropdown` |
| [C30015](https://shopview.testrail.io/index.php?/cases/view/30015) | *"no 'Reassign' action in the modal"* | *"offers no way to move the shift to a different technician"* |
| [C30025](https://shopview.testrail.io/index.php?/cases/view/30025) | `working hours` | `business hours` |
| [C30042](https://shopview.testrail.io/index.php?/cases/view/30042) | `'VIN'` | `'VIN Number'` |
| [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) | `Bars, Events, Tech Hours, Saturday, Sunday` | `Planning, Events, Tech Hours, Show Saturday, Show Sunday` |
| [C30051](https://shopview.testrail.io/index.php?/cases/view/30051) | `Saturday off` | `'Show Saturday' off` |

`testrail-import/schedule-v1-testrail-import.csv` was last written at **14:17Z — before the push** —
and carries the old wording (`Bars, Events, Tech Hours, Saturday`: 1 hit; `Show Saturday`: 0 hits).

**Why it matters:** these are the **build-accurate labels** a manual tester reads. Anyone regenerating
Schedule deliverables from local, or driving a future pass off it, would revert live TestRail to
wording the build does not use. **Filters and Report Suite are clean** (0 differences on 115 and 480
respectively) — this is Schedule only.

**Recommendation:** a re-sync-from-live of the six bodies plus a deliverables regeneration. **No
TestRail write is needed** — live is already correct. This audit did not do it: it is outside a
read-only brief.

---

## G. ⚠️ OPEN — the JWTs are out of HEAD but still in git history

`git show 5b1b573f:build/schedule/build-viu-2026-08-11/evidence/diag-roles.json` **still returns a
live-shaped token.** The redaction cleaned HEAD; it did not, and could not, clean history — the
redaction report says so plainly and lays out the options.

**This is the only item in this audit with a blast radius outside QA, and it is a decision for the QA
lead, not for us:** rotate the signing secret (which makes the historic copies inert), leave history
alone, or rewrite history — the last of which would rewrite ~491 commits and force-push a branch
several live sessions share from other containers.

---

## H. WHAT I COULD NOT DETERMINE (Rule 12)

**Stated as gaps, because a confident wrong answer here is worse than an honest one.**

1. **Whether Pass 2 issued any TestRail call before it died.** It committed no oplog. That **no write
   landed** on any of its three targets is *proven* from live content; whether a call was attempted and
   rejected, or never made at all, is **not reconstructable** and I have not guessed.
2. **Which phase of Pass 1 last wrote [C38866](https://shopview.testrail.io/index.php?/cases/view/38866).**
   It appears in both op lists and TestRail exposes only the most recent write. **Both ops landed and
   the final content is correct** — the ordering is simply not recoverable.
3. **Whether any killed pass had `/tmp`-only output that nobody has noticed is missing.** I can only
   audit intentions that were written down somewhere. The follow-up push's loss was findable *because*
   its executor was committed and named its output paths. **A pass that committed nothing at all would
   leave no trace of what it was doing** — this is unknowable by construction, and it is the strongest
   argument for the write-the-log-first rule in Job 2.
4. **How many historic secret exposures exist in git history.** I confirmed at least one blob still
   carries a token; I did **not** sweep all ~491 commits. The count could be larger than 13 files.
5. **Why the recovery container's tracking ref was 110 commits stale while reporting the branch as
   *ahead*.** The symptom is established and the fix is known; the mechanism is not, and it may recur.

---

## HOW TO RE-RUN THIS AUDIT

Everything is committed beside this file — **deliberately, since a verification that lives in `/tmp`
is the exact failure this audit is about.**

| Path | What it does |
|---|---|
| `tools/harvest.py` | paged harvest of all sections and cases; per-group ours-vs-foreign counts |
| `tools/runs.py` | full paged read of runs 357 / 352 / 359 |
| `tools/verify_runs.py` | every historical result ID vs live; graded fields compared, echoes excluded |
| `tools/trace359.py` · `tools/when359.py` | traces the 10 run-359 records to their deleted cases and dates the disappearance |
| `tools/localcheck.py` | local case source vs live, per suite (this is what found §F) |
| `evidence/live-proof-set.json` | the harvest headline figures |
| `evidence/run{357,352,359}-ids.json` | the result-ID and case-ID sets behind §C |
