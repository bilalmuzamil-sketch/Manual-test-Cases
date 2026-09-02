# 13 · CROSS-SESSION SAFETY — the operator form of Standing Rules 82–87

> Read this **before** the first write of any lane session. It is the **commands and
> the exact sentences**; the reasoning and the incidents live in CLAUDE.md Rules
> 82–87, `build/TESTER-READINESS-CHECKLIST.md` and `build/LOCKS/README.md`.
>
> **Four sessions share one TestRail project, one git branch, one staging login and
> one weekly quota.** Everything here exists because a collision between them is
> **silent** — nothing errors, so nothing warns you.

---

## 1 · THE SECRET-SCAN GATE (Rule 82)

**Install once per clone:**

```sh
cp build/testing-tools/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```

**Before every commit:**

```sh
python3 build/testing-tools/scan_secrets.py --staged        # exit 1 = BLOCKED
```

**Other modes:** no flag = the whole working tree (tracked **and** untracked — a new
file holding a cookie is invisible to `--tracked`) · `--all` / `--tracked` = every
tracked file · `--diff FILE` · **`--selftest`** = prove detection fires.

**FIRST, AT SESSION START:** run `python3 build/testing-tools/make_secret_fingerprints.py`
so the scanner runs in **FULL mode** (structural patterns **plus** the SHA-256 of the
credentials we actually hold — the only thing that catches a secret with no recognisable
shape, such as a short password). **The file it writes lives in `/tmp` and is never
committed** — a hash of a weak secret is brute-forceable, so even hashes stay out of this
PUBLIC repo; it is in `.gitignore` as a second guard. `/tmp` is ephemeral, so **re-run it
in every fresh container**, and again whenever new cookies arrive. Without it the scanner
prints *"no /tmp/secret-fingerprints.json; structural patterns only"* on every run —
which is a **narrower** gate than the one you are about to claim you passed. Preflight
detail: `build/skills/14-ACCESS-RESILIENCE.md` §0.

**If the scanner is missing, that is a FINDING — report it and restore it.** Do **not**
substitute an ad-hoc `grep` and do **not** report *"scan clean"*. The hook fails the
commit when the scanner is absent, deliberately: **a guardrail that silently no-ops is
worse than none, because it gets reported as having run.**

**Say what you actually ran.** *"Secret scan clean — `--staged`, 14 files"* is a claim
you can stand behind. *"Scan clean"* with no mode and no population is not.

**A genuine false positive** gets the marker `scan-secrets:allow` **on that line**,
with the reason in the commit message. Never on real material.

---

## 2 · LANE LOCKS (Rule 83)

**Before ANY TestRail / Jira / branch write to a project:**

```sh
git pull --rebase                       # a claim you have not fetched is invisible
ls build/LOCKS/                         # is there a live foreign claim?
cat build/LOCKS/<project-slug>.lock.md 2>/dev/null
```

**If a live foreign claim exists — DO NOT WRITE.** Report it to the main session and
take other work. **Do not "just do the one case".**

**If none exists — claim, commit and PUSH before the first write:**

```sh
cat > build/LOCKS/filters.lock.md <<'EOF'
# CLAIM — filters
LANE: viu
INTENT: update_case on the 14 raw-markup Filters cases (C29558, C29560, ...).
        No add_case. No run writes. No Jira.
STARTED: 2026-08-21T04:00:00Z
EXPECTED RELEASE: ~90 min, when all 14 are written and byte-verified.
SESSION: <session id> / viu lane
EOF
git add -- build/LOCKS/filters.lock.md && git commit -m "claim: filters (viu lane)" && git push
```

**Release when done** — delete the file, commit, push.

**The browser is a SEPARATE GLOBAL lock:** `build/LOCKS/browser.lock.md`. **Only one
session drives the browser or calls `quick-login` / `switch-user` at a time, whatever
the project** — the session is shared estate-wide, and a second caller **evicts the
first**, who then sees `401 sso_required` and wrongly concludes the estate expired.

**Stale claim (> 6 h):** report it and clear it **with a record** of who cleared it and
why. **Never silently overwrite** — and **never assume a stale claim means the work
finished** (check the committed evidence, §5).

**A lock is not authorisation.** Rule 6 still governs TestRail; Rule 62 governs every
Jira ticket; the creation hold means nothing is created at all.

**Cross-lane finding? ROUTE IT BACK to the main session, which assigns it.** A lane
never repairs another lane's artefact unilaterally.

**On push reject** (the one benign collision — git actually tells you):

```sh
git fetch origin && git rebase origin/claude/slack-session-0sxnd9 && git push
```

---

## 3 · THE TESTER-READINESS GATE (Rule 84)

**Full gate:** `build/TESTER-READINESS-CHECKLIST.md` — ten checks, **scored over 100%
of the set, counts reported.**

**Mechanical subset:**

```sh
python3 build/testing-tools/check_tester_readiness.py --section 4110
python3 build/testing-tools/check_tester_readiness.py --cases 29557,29558 --verbose
python3 build/testing-tools/check_tester_readiness.py --section 5405 --no-build
python3 build/testing-tools/check_tester_readiness.py --selftest
```

Read-only (`get_case` / `get_cases` only). Credentials from
`/tmp/testrail/creds.json` or `TESTRAIL_EMAIL` + `TESTRAIL_PASSWORD` — **never
hardcoded.**

**⚠️ REPORT IT AS WHAT IT IS.** A clean run is **"the mechanical subset passed"**.
It is **NEVER** *"the readiness gate passed"* — **check 6** (the C-id in every
deliverable) and **checks 8 and 9** (steps executable in order; a plain "what needs to
be done" on every non-passed row) are **human cold reads** the script cannot do.

**Run this BEFORE the cold read**, not after: a case that renders as one run-on
paragraph cannot be usefully cold-read, so mechanical failures are cheaper to fix first.

---

## 4 · THE NO-BUILD-YET SENTENCE (Rule 85)

Where **no QA build exists**, use these exact words in every status line, report,
readiness figure and handover:

> **SOURCE-VERIFIED ONLY — NO BUILD EXISTS YET**

Those cases carry **Rule-54 state 1** (sentence 1 only, **no build sentence**) and the
**Rule-69 marker form**. They are **never** called build-verified, VIU'd, or plain
"verified".

**Verify it mechanically** with `--no-build`, which fails any case carrying a build
marker.

**Do not report it apologetically.** Cases traced to a current spec, epic and PO
answers are **exactly as authentic as Rule 20 requires** — what is missing is the
build, and the build is missing because **the product does not exist yet**. State the
limitation; do not apologise for it.

---

## 5 · VERIFY FROM COMMITTED EVIDENCE (Rule 86)

**A lane's summary is a CLAIM.** Before the main session repeats any lane figure
onward, it confirms from **the committed evidence files and the live content** —
counts re-derived, writes byte-verified, "untouched" proven byte-identical.

**So COMMIT YOUR EVIDENCE, do not merely report it:** the execution log, the per-op
results, the pre/post snapshots. **A number that exists only in a chat summary is
unverifiable the moment that session ends — and every session ends.**

**This is the standard we already apply to ourselves:** Rule 50 forbids accepting our
own write as successful on a `200 OK`. A prose summary is weaker evidence than that.

**Budget the shared quota.** The main session allocates a rough per-lane budget; **each
lane reports its spend with its work.** **A lane burning budget on status checks rather
than substantive work STOPS AND REPORTS** (Rule 76) — polling is the most expensive way
to learn nothing.

---

## 6 · SNAPSHOT THE CASE BODIES (Rule 87)

**Periodically, and BEFORE AND AFTER any authorised bulk write:**

```sh
# read-only: get_cases over 100% of the project's cases, committed to git
python3 build/testing-tools/snapshot_case_bodies.py --project <slug> --group <section-id>
git add -- build/<slug>/case-snapshots/ && git commit -m "snapshot: <slug> case bodies <date>"
```

### 6.1 · THE TOOL — `build/testing-tools/snapshot_case_bodies.py` (added 2026-08-28)

**Read-only. GET only. No authorisation needed — it is a read** (not gated by Rule 6, not gated by
the Rule-62 creation hold).

It writes **one JSON per case** — `id`, `title`, `refs`, `preconds`, `steps`, `expected`,
`custom_atmstatus`, `updated_on`, `created_by`, always in that order — to

```
build/<project-slug>/case-snapshots/<YYYY-MM-DD>/C<id>.json
```

plus a `MANIFEST.json` (counts, section ids, the case-id list). **One file per case is deliberate:**
`git diff` then shows which cases moved and which fields inside them, instead of one unreadable blob.
Key order is fixed and non-ASCII is kept literal, so **a re-run over unchanged data produces no diff
at all** — any diff you see is a real change.

```sh
python3 build/testing-tools/snapshot_case_bodies.py --selftest     # 18 offline checks, no network
python3 build/testing-tools/snapshot_case_bodies.py --help
python3 build/testing-tools/snapshot_case_bodies.py --project report-suite --group 4281 --dry-run
```

**It captures FOREIGN cases too, by default** (`--mine-only` opts out) — foreign edits are the whole
point of Rule 87, and a snapshot of only our own cases cannot evidence one.

**⚠️ It pages, and you must not "simplify" that away.** `get_cases` and `get_sections` are paged at
250 and an **unpaged call silently under-returns** — no error, just a short answer. The estate is
**684 sections / 4,580 cases**; an unpaged `get_sections` sees 250 sections and then finds zero cases
in every section it never looked at.

**Baselines that exist (first ones taken 2026-08-28):**

| Project | Group | Cases captured | Path |
|---|---|---|---|
| Custom Roles & Permissions | `3527` | **714** (515 ours, **199 foreign**) | `build/custom-roles/case-snapshots/2026-08-28/` |
| Report Suite | `4281` | **525** (509 ours, **16 foreign**) | `build/report-suite/case-snapshots/2026-08-28/` |

### 6.2 · WHEN TO SNAPSHOT

1. **BEFORE any authorised bulk write** — before the first `update_case` of the pass, never after it
   has started. A snapshot taken mid-pass proves nothing about what you overwrote.
2. **AFTER the same pass completes** — the before/after pair is what makes your OWN pass auditable,
   and it re-baselines the project so the next foreign edit is diffable.
3. **PERIODICALLY on every active project**, independent of any write — at minimum whenever a project
   becomes active, and again at the end of a working week. A stale baseline is a blind window.
4. **BEFORE handing a suite to the manual test team or to the automation engineer**, so a later
   "this case changed" question has an answer.
5. **The moment you SUSPECT a foreign edit** — snapshot first, investigate second. Investigating
   first risks one of our own passes overwriting the evidence.

### 6.3 · HOW TO DIFF A FOREIGN EDIT

```sh
# what changed between two snapshot dates, per case and per field
git diff <commit-A>..<commit-B> -- build/<slug>/case-snapshots/
diff -ru build/<slug>/case-snapshots/2026-08-28 build/<slug>/case-snapshots/2026-09-04

# one case only
git log -p --follow -- build/<slug>/case-snapshots/*/C27792.json
```

Read it in this order:

1. **`created_by`** — is the case ours (`3`) at all? If not, it is **hands-off (Rule 38): report,
   never edit**, and the diff is evidence for the report, not a licence to fix it.
2. **`updated_on`** — pin *when*. Then `get_history_for_case/<id>` gives *who*, which the snapshot
   deliberately does not guess at.
3. **`custom_atmstatus`** — if it is `3`, the case is **Automated: Rules 65/71**. Tell Vlad, and do
   not change it back without his go-ahead.
4. **`expected` / `steps` / `preconds`** — the substance. Rule 44: **a contradicting change is a bug
   report against our suite until disproven**, so establish both sides' sources (Rule 39) before
   deciding who is right.
5. **`refs` / `title`** — cheapest to check, and a changed `refs` often explains the rest.

**The honest limit, stated rather than glossed:** a snapshot tells you **what** the body was on a
date. It does **not** tell you **who** changed it or **why**. `get_history_for_case` supplies the
who; the why is a conversation.

### 6.4 · A CORRECTION TO THIS SECTION'S OWN PREMISE — measured 2026-08-28

§6's long-standing rationale said *"TestRail keeps only the LAST writer. There is no per-field
history."* **That is measurably wrong on this instance, and the correction matters more than the
convenience of leaving it.** `get_history_for_case/<id>` returns **per-change, per-field entries with
`old_value` and `new_value`** — including the **full previous text** of `custom_expected`,
`custom_steps`, `custom_preconds`, `title` and `refs`, not a truncation. Verified 2026-08-28 on
C30518 (5 entries back to 2026-07-30, each carrying whole field bodies).

**Applied to the case the register cites:** Vladimir's 2026-08-27 edits to **C27792** and **C27805**
are **NOT undiffable**. Read live 2026-08-28, each case has **exactly one** history entry:

> `2026-08-27 21:28 UTC · user 1 (Vladimir Tomovic) · custom_atmstatus: 1 "Not Automated" → 4 "Pending"`

**Nothing else on either case was touched** — not the title, not the steps, not the expectation. Both
are still `created_by = 3` (ours). This is the same "Pending" move he made on 20 Schedule cases on
2026-08-17 (see the appendix in `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`):
`4` is **not** `3`, so **Rules 65/71 are not triggered** — but it signals he has queued them for
automation, so **preserve the value and never send that field**.

**So why snapshot at all?** Because history does not cover everything, and four things make the
snapshot worth its cost:

1. **A DELETED case has no history to fetch** — the snapshot is then the only surviving record.
2. **`get_history_for_case` is one API call PER CASE.** Diffing a 714-case group through it is ~714
   calls; the snapshot diffs the same group offline, for free, with `git diff`.
3. **It is committed, timestamped, third-party-verifiable evidence** — Rule 86 says verify from
   committed evidence, not from a session's self-report, and that includes TestRail's own report.
4. **It captures the estate's SHAPE** — which cases existed in a group on a date. History cannot tell
   you a case has appeared or vanished.

**Do both.** Snapshot for the bulk diff and the durable record; use `get_history_for_case` on the
specific cases the diff flags, to get the who and the when.

**Why (CORRECTED 2026-08-28):** **`get_history_for_case` IS THE AUTHORITATIVE RECORD OF WHAT A
FOREIGN EDIT CHANGED** — field by field, with `old_value` and `new_value`, full text bodies included,
and it survives our own later overwrites. **CHECK IT FIRST. Nothing is called unreconstructable
until that call has been made and its output recorded.** The committed snapshot stays useful as a
**fast local diff** and an **offline baseline** (and for the four things §6.4 lists that history
cannot do), but it is **secondary**. Together they turn a Rule 38/39 dispute into **evidence** —
Rule 39 requires both sides' sources on the table, and history puts them there.

> **SUPERSEDED 2026-08-28 — kept visible and dated per Rules 32/33, not deleted. This text is FALSE;
> do not quote or rely on it:** *"**Why:** **TestRail keeps only the LAST writer.** There is no
> per-field history, so the moment one of our own passes writes a case, any trace of an earlier
> foreign edit is **permanently gone**. A committed snapshot turns an unanswerable question into a
> `git diff` …"* — true of `updated_by` / `updated_on`, then wrongly generalised to the whole
> product. `get_history_for_case` had never been called.

**PROOF, ON THE ORIGINATING CASE (2026-08-28).** [C29557](https://shopview.testrail.io/index.php?/cases/view/29557)
— the case Rule 87 was written about, and the one our records said we *"could never establish"* —
returned **17 history entries**, and the foreign edit came back whole: **Ahtasham Amjad (user id 7),
2026-08-05 13:32 UTC, three fields** (`custom_preconds`, `custom_steps`, `custom_expected`), a
rich-text-editor save that **wrapped each field in `<p>…</p>`, flattened the line breaks, and on
Expected Result was LOSSY (687 → 423 chars)** — deleting the "Known and accepted" tester note and
**truncating the marker to `AUTOMATION: READY -`**. Our own pass restored the field the same day at
14:18 UTC. Full history: `build/custom-roles/foreign-edit-C29557/HISTORY.json`.
**Also confirmed: `custom_atmstatus` `4` = `Pending` is DISTINCT from `3` = `Automated`, so a `1 → 4`
move does not trigger Rules 65/71** (§6.4).

**It also protects the other party:** a diff can equally show that a suspected foreign
edit never happened, or that ours was the pass at fault.

**No authorisation needed** — it is a read. Not gated by Rule 6, not gated by the
Rule-62 creation hold.

---

## THE PRODUCT REPOSITORY IS READ-ONLY TO US, ALWAYS

**The ShopView application source repository is READ-ONLY for every QA session.** We read it to
establish what the system **CURRENTLY DOES** (fact) and to build the collateral-risk map
(`17-REGRESSION-IMPACT-V1-TO-V2.md` §3.3/§3.5). **That is the ONLY permitted use.**

- **NEVER commit, push, branch, open a pull request, comment on a PR or issue, or modify ANYTHING in
  the product repository** — not a fix, not a typo, not a test, not a comment. **Our writes go ONLY to
  the QA workspace repo, path-scoped, on our own branch (Rule 29).**
- **The installed GitHub App's permissions may PERMIT writing. Permission is not authorisation.** If a
  task appears to require changing product code, **STOP and report it to the QA lead** — that work
  belongs to the developers, never to QA.
- **Reading product code NEVER makes it a source of EXPECTED behaviour (Rule 57).** Code establishes
  **fact**; documents establish **intent**; a conflict between them is a **PO decision item**
  (`17-REGRESSION-IMPACT-V1-TO-V2.md` §5), never a silently adopted invariant.
- **Cite the file paths and the branch/commit you read** whenever you use code as evidence, so any
  claim about current behaviour is verifiable. **Never paraphrase code you have not actually opened,
  and never cite a path you have not confirmed exists.**

---

## THE PRE-WRITE CHECKLIST — six lines, run them in order

1. `git pull --rebase` — fetch other lanes' claims and work.
2. **Check `build/LOCKS/`** for a live foreign claim on this project. Foreign claim ⇒ **stop**.
3. **Claim** — write, commit and **push** your lock file **before** the first write.
4. **Snapshot** the case bodies you are about to touch, and commit (Rule 87).
5. Do the work; **byte-verify every write** (Rule 50); **commit evidence as you go** (Rule 29).
6. **Scan** (`--staged`), commit, push, **release the lock**.

**Ties to Standing Rules** 6, 12, 29, 38, 39, 41, 49, 50, 54, 60, 62, 69, 75, 76, 77,
79, 80 — and 82–87, which this skill operationalises.

---

## SESSION-START DUTY — READ AND APPLY THE TOKEN DISCIPLINE CHARTER (Rule 95)

**BEFORE the first write of any lane session, and from your FIRST TURN, the
[`TOKEN-DISCIPLINE-CHARTER.md`](TOKEN-DISCIPLINE-CHARTER.md) is in force** — it is a session-start duty of
this skill, alongside the pre-write checklist above. Twelve clauses: strategy first (79); never bulk-read,
script it (88); the reading rule (targeted and bounded, never off-limits); spawn discipline (76/88); never
poll (75); batch writes; piggyback cheap checks (78); never re-do work (77/80); answer in text; the budget
(90); the week-start guard; and **clause 12 — quality is never the thing cut.** **Every handoff embeds the
twelve clauses verbatim; a handoff without them is non-compliant and must not be issued.** Rule text:
`build/rules/RULES-61-99.md`.

---

**Rule 88 — LANE-SESSION CONTEXT DISCIPLINE:** never read `CLAUDE.md` end-to-end (grep it); never bulk-read case bodies or CSVs into context (script it to a file, read a bounded summary); batch writes in a script; long jobs use the Rule-75 detached pattern with progress in commit messages; do NOT spawn subagents for work you can do directly; stop and report at the budget tripwire.

---

## SEARCH BEFORE YOU GIVE UP (Rule 97) — POINTER

**Before reporting ANYTHING as impossible, blocked, unavailable, unreachable or unreconstructable,
GREP THIS WORKSPACE — using the EXACT ERROR TEXT, which is what actually finds it.** Four places, in
order: `build/APP-ACTIONS-PLAYBOOK.md` · [`14-ACCESS-RESILIENCE.md`](14-ACCESS-RESILIENCE.md) ·
`build/ATLASSIAN-JIRA-ACCESS-METHOD.md` · `build/rules/RULES-*.md` (**grep them, never read one end to
end**). Also `ls build/BLOCKED-*.md` — **several are marked RESOLVED and carry the cause** — and
`git log --all --oneline --grep="<keyword>"`. **If you still cannot find it, REPORT THE SEARCHES YOU
RAN**, so the QA lead knows the gap is real rather than unsearched. **One tool failing is a fact about
that tool, never about the task** (Rule 68). **Solve something new ⇒ write it into the playbook or the
relevant skill IN THE SAME PASS** (Rule 93). **The full drill — with the five real 2026-08-28 false
blockers — is INLINE in every handoff and in `build/rules/RULES-61-99.md` (Rule 97).**

---

## ACCESS + QUOTA — added 2026-08-21 (Standing Rules 89 & 90)

> **🔴 [`14-ACCESS-RESILIENCE.md`](14-ACCESS-RESILIENCE.md) — read it BEFORE the first access call of
> this session.** It carries **Standing Rule 89**: the PRIMARY path and FALLBACK ladder for TestRail,
> Jira/Confluence, ShopView QA/staging/production and Figma; the **mandatory session-start preflight**;
> the failure signatures (notably **ShopView `401 sso_required` = dead cookies OR a deploy — check the
> build marker first**); the **five MCP-hygiene hard rules** (above all: **never edit, delete or
> "repair" shared MCP configuration to fix a connection** — a mutated config stays corrupt for every
> future session); and the **unattended BLOCKED protocol** (write and commit `BLOCKED-<system>.md`,
> keep working on what is not blocked, never fabricate a result).
>
> **Standing Rule 90 — the weekly quota is ONE shared pool:** main/orchestrator **15 %** · each lane
> **25 %** · **10 % reserve**. **Report your spend with your work**; at **50 % of your own budget**
> compare spend against work completed and **STOP AND REPORT if spend is outpacing progress**; **never
> consume the reserve without the QA lead's say-so.** Full texts: `build/rules/RULES-61-99.md`.

## CLAUDE.md size guard

**Before committing an edit to `CLAUDE.md`, run `wc -c CLAUDE.md` — it must stay under 60,000 bytes; a
larger file means re-inflation, repair from `build/rules/` instead of committing.** `CLAUDE.md` is an
INDEX (~28–40 KB); the full rule texts live in `build/rules/RULES-*.md` and the verbatim pre-split
archive. Re-inflation comes from a rebase resurrecting pre-restructure content, a worker re-appending
rule bodies into the index, or a refresh rewriting the file from a stale copy. **And measure it on
disk** — on 2026-08-21 a session reported 459,549 bytes from a stale context snapshot while the real
file was 34,164; a "repair" on that reading would have discarded 693 commits. Guard + diagnosis:
`build/rules/INTEGRITY.md` § SIZE GUARD.


---

## LANE BOUNDARIES IN FORCE (check this list before touching any suite)

A lane boundary is not advice — it is the QA lead assigning a suite to one session. Writing into
another session's lane is how work gets destroyed: on 2026-09-01 two sessions edited the Invoice
suite within minutes of each other and **five build-verified routes were overwritten with
design-derived ones**, three of them materially wrong. Nobody noticed until a live re-read.

| Suite / group | Owner | Since | Status |
|---|---|---|---|
| **Invoice UI Refresh** (sections under *Invoice Refresh (Aug 2026)*), branch **sv8218** — manual QA tester **Mudassir Qamar** | **this build-verification session** | 2026-09-01 | the other session was stopped from changing it by the QA lead |
| **Inline Add and Edit Parts (6597)** and **Printer Friendly WO (6617)**, branch **sv9315** — manual QA tester **Viktoria Videnovic** | **this build-verification session** | 2026-09-01 | ✅ **HANDED OVER.** QA lead: *"there is no other session that is currently working on 6597/6617"*, and *"if anyother seasion has written something on any test cases and if you believe that should be overridden … you have a go ahead from my side to edit those test cases too and build verify them too."* **So the other session's route text is overridable where a build-verified route contradicts it** — that is the same call that was right on Invoice, where three design-derived routes were materially wrong. |

**Having the credentials for a branch is not permission to work on it.** The sv9315 cookies and the
corrected `sv_sso_session` name are recorded because they were hard to find, not because the lane is
open. **Ask, or wait to be told.**

**How to check you are not colliding, before any write:** read the case's `updated_on` and compare it
against your own last write. A cadence of edits you did not make — the 2026-09-01 collision showed a
steady one every ~10 seconds — means another session is mid-run. Stop and report it; do not race it.


## WHEN YOU MAY OVERRIDE ANOTHER SESSION'S WRITES

Only when the QA lead has handed you the lane, and then only on the merits. The standing precedent
(Invoice UI Refresh, 2026-09-01) is that **a route OBSERVED on the build outranks one derived from the
design** — three of the five routes another session had written there were materially wrong, and the
observed ones replaced them. Say in the report which ones you overrode and why; never silently.

**Two things a lane handover does NOT cover:**

1. **A case authored by a PERSON rather than a session.** Rule 38 makes a foreign case report-only.
   *"Another session has written something"* is not permission to edit a human colleague's case.
2. **A case TestRail flags as Automated** (`custom_atmstatus = 3`) — Rule 71 needs a go-ahead, and
   Rule 65 needs Vlad told afterwards. A broad lane handover covers the suite's ordinary cases; if an
   Automated case is also someone else's, both rules bite and you ask.

On 6597 this lands on **C45220** — Vladimir Tomovic's case, flagged Automated, and the only case in
the suite failing the runnability gate (it has no steps at all). Both exclusions apply, so it is
**flagged for the QA lead, not edited.**
