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
python3 build/testing-tools/tr_client.py            # or the project's own sync script
git add -- build/<project>/cases/ && git commit -m "snapshot: <project> case bodies"
```

**Why:** **TestRail keeps only the LAST writer.** There is no per-field history, so the
moment one of our own passes writes a case, any trace of an earlier foreign edit is
**permanently gone**. A committed snapshot turns an **unanswerable question into a
`git diff`**, and turns a Rule 38/39 dispute into **evidence** — Rule 39 requires both
sides' sources on the table, which is impossible about an edit we cannot characterise.

**It also protects the other party:** a diff can equally show that a suspected foreign
edit never happened, or that ours was the pass at fault.

**No authorisation needed** — it is a read. Not gated by Rule 6, not gated by the
Rule-62 creation hold.

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

**Rule 88 — LANE-SESSION CONTEXT DISCIPLINE:** never read `CLAUDE.md` end-to-end (grep it); never bulk-read case bodies or CSVs into context (script it to a file, read a bounded summary); batch writes in a script; long jobs use the Rule-75 detached pattern with progress in commit messages; do NOT spawn subagents for work you can do directly; stop and report at the budget tripwire.

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
> consume the reserve without the QA lead's say-so.** Full texts: `build/rules/RULES-61-91.md`.

## CLAUDE.md size guard

**Before committing an edit to `CLAUDE.md`, run `wc -c CLAUDE.md` — it must stay under 60,000 bytes; a
larger file means re-inflation, repair from `build/rules/` instead of committing.** `CLAUDE.md` is an
INDEX (~28–40 KB); the full rule texts live in `build/rules/RULES-*.md` and the verbatim pre-split
archive. Re-inflation comes from a rebase resurrecting pre-restructure content, a worker re-appending
rule bodies into the index, or a refresh rewriting the file from a stale copy. **And measure it on
disk** — on 2026-08-21 a session reported 459,549 bytes from a stale context snapshot while the real
file was 34,164; a "repair" on that reading would have discarded 693 commits. Guard + diagnosis:
`build/rules/INTEGRITY.md` § SIZE GUARD.
