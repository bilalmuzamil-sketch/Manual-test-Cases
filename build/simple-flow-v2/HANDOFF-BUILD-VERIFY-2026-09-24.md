# HANDOFF — BUILD-VERIFICATION: Simple Flow V2 (authored 2026-09-24)

> **Copy-paste this whole file into a fresh session as its briefing.** Repo: `Manual-test-Cases`
> (PUBLIC). Working dir: `/home/user/Manual-test-Cases`. Branch: `claude/slack-session-setup-7v5itm`.
> This is the **project-specific** build-verification briefing for **Simple Flow V2**. The generic lane
> briefing is `build/handoffs/HANDOFF-2-BUILD-VERIFICATION.md` — read it too; this file adds the
> project facts and does not repeat its §1b (QA-branch login) or §3/§3a/§3b in full.

---

## 0. MISSION (this project only)

Take the **64 existing Simple Flow V2 cases** that are **source-verified but not build-verified** and
**drive them live against the running build**, producing an observed **PASS / DEVIATION / HOLD / NOT
AVAILABLE ON BUILD** verdict per case with evidence captured that run, then correct each case's
`AUTOMATION:` marker and provenance from the real observation, sync the run union-only, and hand a
plain-language **Defects-for-Testers** workbook to the manual QA team.

**You do NOT:** author new cases, rewrite wording / run a VIU, treat the build as the source of expected
behaviour (a build that differs from the documented expectation is a **DEVIATION**, the case keeps its
documented expectation — Rule 57), touch a **foreign** case (Rule 38), change an **Automated** case
without the QA lead (Rule 71), or write to TestRail / Jira beyond what §5 authorises.

---

## 1. IDENTITY (verified live 2026-09-24)

| | |
|---|---|
| **Project** | Simple Flow V2 — **NOT** the completed Simple Flow (SV-7301) |
| **Epic** | **SV-8683** — status **Done** (updated 2026-09-24), PM/PO **Milos Vasic** |
| **Spec** | Confluence **771391574** "Simple Flow V2" — current page = **11 Sep 2026** revision; requirement content = the **8 Sep** content (change log unchanged since 8 Sep). **Source-verified 2026-09-24 (content unchanged).** Verbatim body: `source-verify-2026-09-24/CONFLUENCE-771391574-2026-09-11-body-read-2026-09-24.md` |
| **Permissions** | **SV-8183** — one new atom **"Received later"**; everything else reuses the existing map |
| **Design (v3)** | `sources-design-v3-2026-09-24/` (Shopview App + Purchase Orders pages + **Work Order PRD.md**), driven end-to-end; reconciliation in `source-verify-2026-09-24/DESIGN-RECONCILE-v3-2026-09-24.md` |
| **QA env** | **https://sv8683.qa.shopview.com/** (named on the epic) |
| **TestRail** | suite **1**, parent group **6665**; cases live in the 12 sub-sections, not the folder itself |
| **Run** | **R416** — union-only sync afterwards (Rule 34) |

**Source currency is DONE (Rule 80/81): last source-verified 2026-09-24, spec content unchanged since
the 8 Sep revision.** You do **not** need to re-run source verification — state that date and proceed to
the build. Re-read the sources immediately before any write (Rule 59).

---

## 2. SCOPE — the 64 cases to verify (ours, `created_by=3`), C44549–C53489 (non-contiguous)

| Subfolder (section) | Cases | Count |
|---|---|---|
| Work Order Settings (6666) | C44549–C44559 | 11 |
| Completing a Line (6667) | C44561–C44565 | 5 |
| Line and Part Actions (6668) | C44566–C44570 | 5 |
| Bulk Action Bar (6669) | C44571–C44582, C53486 | 13 |
| Receiving (6670) | C44583–C44588, C53487 | 7 |
| Purchase Order Pages (6671) | C44589–C44591, C53488 | 4 |
| Receive Later (6672) | C44592–C44593, C53489 | 3 |
| Completion Wizard (6673) | C44594–C44598 | 5 |
| Finish Action (6674) | C44599–C44601 | 3 |
| Part Rows and Menus (6675) | C44602–C44603 | 2 |
| Reordering Parts (6676) | C44604–C44605 | 2 |
| Permissions (6677) | C44606–C44609 | 4 |
| **Total ours** | | **64** |

**HANDS-OFF — do not edit, verdict-write, or delete (cite only):**
- **7 Automated cases (Rule 71, atmstatus=3): C44557, C44561, C44575, C44583, C44587, C44604, C44605.**
  Read-assess → report → HOLD for the QA lead; if any pass forces a change, **tell Vlad (Rule 65).**
- **15 foreign cases (Rule 38, `created_by=1`): C45202, C45203, C53490, C53491, C53492, C53493, C53515,
  C53572, C53573, C53574, C53593, C53596, C53597, C55676, C55681.** Report ours (64) / live total (79);
  never touch them. (Foreign grew from 2 → 15 since 2026-09-09 — reconcile ownership with Milos/Vlad.)

Link form for every case: `https://shopview.testrail.io/index.php?/cases/view/<id>` (Rule 8).

---

## 3. STARTING MARKER STATE — READ BEFORE YOU TOUCH A MARKER

**All 64 cases currently read `AUTOMATION: READY` and carry a provenance line "Last checked against
build v26.35.9-5700a76 on 9/9/2026" — but the project record says source-verified-only and there is NO
captured build evidence for that check (Rule 12/110).** Treat the existing `READY` + build line as
**unproven**, not as truth.

**This pass produces the real evidence.** For each case, from the live observation:
- Observed PASS against the documented expectation → `AUTOMATION: READY`, provenance re-stamped with the
  **real** build marker + today's date.
- Observed to fail as the spec predicts / a known open defect → `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)`
  with the symptom and all three outcomes (Rule 61).
- Feature not on the build yet → **Rule 69** marker `AUTOMATION: Not available on Build to test Yet -
  Last checked <M/D/YYYY>` (a finished case, not a blocker).
- Genuinely cannot run by hand / needs a tool a tester lacks → `AUTOMATION: HOLD - <plain reason>`.
- **The build line is named ONLY as what the case was last checked against; "as per the build tested on…"
  is barred (Rule 54).** Do not carry the old v26.35.9 line forward unless you re-observe that build.

Arithmetic gate after the pass: **READY + EXPECT-FAIL = total − HOLD**, read back from the live cases.

**🔑 QA-LEAD DECISION (2026-09-24): THIS SESSION corrects the markers if they are wrong — during the live
pass, from observation.** Do **not** pre-flip them source-only, and do not leave a wrong marker standing:
once you observe a case, set its marker/provenance to the truth (§3 rules). A marker that is already
right is left alone. The unproven `v26.35.9` build line is replaced by the real marker you capture at
sv8683, or removed if a case cannot be observed this pass.

---

## 4. TWO CARRIED CASES — BOTH PO-CONFIRMED CORRECT (2026-09-24); verify against the case as written

Both were open conflicts in the source-verify; **the PO (Milos) confirmed both cases are correct on
2026-09-24** — record: `source-verify-2026-09-24/PO-ANSWERS-2026-09-24.md`. Verify each against its own
(confirmed-correct) Expected; do **not** reopen the conflict or let the build/design rewrite the case.

1. **C44567 — Decline a line that holds received/picked parts.** **PO-confirmed: the case is correct** —
   Decline stays **disabled** while the line holds received/picked parts (*"Return this line's received
   parts before declining it"*). The design v3 `Work Order PRD.md` §2 ("always allowed") is the wrong
   side and is superseded. If the build lets you decline such a line, that is a **DEVIATION** against the
   confirmed expectation — record it with evidence.
2. **C44604 — reorder Undo (Automated, HANDS-OFF).** **PO-confirmed: the case is correct** — the reorder
   Undo **was removed** (2026-09-04), so the confirmation toast is informational only. The Confluence
   spec and the v3 design are stale on this point (Milos to fix the spec sentence). Verify against the
   case as written; **do not edit it** (Rule 71) — if a change is ever needed, tell Vlad (Rule 65).

---

## 5. WHAT IS AUTHORISED TO WRITE (ask the QA lead to confirm before the first write — Rule 6)

- **TestRail result writes into run R416** for the 64 (the verdicts) — the point of the pass.
- **`update_case` on OUR 64** to correct the `AUTOMATION:` marker and re-stamp provenance from real
  observation — this is **correction, permitted** (Rule 6), but confirm the go-ahead before the batch
  and byte-verify every write (Rule 50), one scripted run with a per-op log (operation · C-id · HTTP
  status · verification result).
- **NOT authorised:** any Jira ticket (Rule 62 hold — prepare text, stop at the button); any edit to the
  7 Automated or 15 foreign cases; any new case (hand coverage gaps back, do not author).
- **Secrets: `/tmp` only, `chmod 600`, never committed; run `python3 build/testing-tools/scan_secrets.py
  --staged` before every commit (Rule 82).**

---

## 6. ACCESS — the one real prerequisite

**QA env `https://sv8683.qa.shopview.com/`. App login is currently 401 (`sso_required`) in this
workspace — dead cookie OR a deploy; check the build marker first (Rule 89).** You need a fresh
**`sv_sso_session` cookie ONLY**, host-only, in `/tmp/qa-cookies/sv8683-sso.txt`, `chmod 600`, then the
one-command boot. Full mechanics + the three traps + why a 409 is a re-boot not a blocker:
**`build/handoffs/HANDOFF-2-BUILD-VERIFICATION.md` §1b** and **`build/APP-ACTIONS-PLAYBOOK.md` §A**;
access ladder + preflight: **`build/skills/14-ACCESS-RESILIENCE.md`**.
```
source build/testing-tools/ensure_bridge.sh
node build/testing-tools/qa-branch-boot.mjs sv8683 /work-orders admin
```
**Ask the QA lead for `sv_sso_session` for sv8683 if the stored one is refused** — only he can re-mint it.

---

## 7. SEED, DON'T BLOCK (Rule 14) — the data states this suite needs

A missing data state is **seeded, never parked** on this disposable env. The prototype used two work
orders (S3-25095, S3-26363); the build needs equivalents. Seed / confirm:
- Each of the 8 org settings on **and** off (Require Approval / Receiving / Picking / Review / Tech Story
  / Mileage / Engine Hours / Core Charges), plus **Require Ordering Parts** Manual vs Automatic, plus the
  **Received later** permission on a role and on a role without it (Story 21 permission cases).
- A work order with lines in **each** status: Needs Approval, Approved, Declined, Complete.
- Lines whose parts span **each** part state: In Stock, Picked, Auth To Order, Ordered, Awaiting,
  Received, Returned — including **a line that holds received/picked parts** (for C44567 decline-block)
  and **a part with core charge**.
- A **vendorless part / "Vendor missing" PO** and a multi-vendor receive (Receive modal / Receive vendor
  parts page, Stories 13/14).
- Follow `build/skills/20-FEATURE-DATA-SEEDING.md`; register any keyword under
  `build/global-search/seeding/RESEED.md` conventions if you build a reusable kit.

**Rule 116 (numbers): the bulk-bar counts, the wizard "n parts", the "N open" count, and the receive
page totals (COST TOTAL / PARTS / POS) must be EXACT** — compute by hand from seeded inputs and confirm
the UI equals it; parity across the bulk bar, wizard and receive modal (they derive from one query).

---

## 8. DO IT IN THIS ORDER (canonical procedure — read the skills, don't work from this list alone)

1. **`build/handoffs/HANDOFF-2-BUILD-VERIFICATION.md`** — the generic lane briefing (its §1a, §1b, §3,
   §3a NAVIGATION-MAP, §3b portal HOLD, §7 DoD). Then **`build/skills/11-BUILD-VERIFICATION.md`** (thin
   router) → **`00-COMMON-CORE.md`** (read §14 provenance, §15 markers, §16.0 finality) →
   **`02-SOURCE-CHECK.md` §1** (already current — state the date) → **`03-RUN-CHECK.md`** (drive cases
   live; §6.1 bug-fix-deploy; §7 the NOT-AVAILABLE marker; the Rule-49 queue) → **`04-TESTER-READY.md`
   §6/§6.1** (the Defects-for-Testers workbook) → **`06-DEFECT-PREP.md`**.
2. Capture the **build marker** at pass start (`<meta name="app-version">`, last-modified, etag, sha256
   of index.html, each with UTC time) and again at pass end — prove byte-identical so nothing redeployed
   mid-pass.
3. Build/confirm the seed (§7). Drive each of the 64 cases by hand as a manual tester would; record
   PASS / DEVIATION (quote the source verbatim, Rule 25) / HOLD / NOT-AVAILABLE with evidence that run
   (Rule 12/110: attribution, identity of OUR record, provenance/build marker).
4. Correct markers + provenance from observation (§3), batched with a per-op log; byte-verify (Rule 50).
5. Union-sync R416 (Rule 34 — snapshot before, verify every prior result by id after).
6. Commit + push after every step, path-scoped (`git add -- <paths>`, Rule 29). Leave the env clean
   (ZZAUTOTEST data deleted, roles/settings restored and proven byte-identical).

---

## 9. DEFINITION OF DONE + DELIVERABLES

- Build marker captured both ends and proven identical; **every one of the 64 carries a definite
  outcome**, counted two ways that agree; the honest split stated in numbers (*"N of 64 observed on
  build `<marker>`; the rest carry their last recorded check"*).
- Marker arithmetic gate holds; the 7 Automated read-assessed and HELD (Vlad told if any changed); the
  15 foreign untouched and reported as ours 64 / live 79.
- `build/simple-flow-v2/build-verify-2026-09-24/`:
  `Simple-Flow-V2_Defects-for-Testers_2026-09-24.xlsx` (one row per non-passed case: internal ID · C-ID ·
  link · what the doc requires + anchor/version · what the build does · verdict · ticket-prepared/not
  filed · plain "What needs to be done"; a tab per status + Summary) · `FINDINGS.md` · `RECHECK-QUEUE.md`
  (Rule 49) · `SOURCE-CURRENCY.md` (points to the 2026-09-24 pass) · `testrail-execution-log.md` ·
  `API-ASK.md` · `evidence/`.
- **Every verification claim carries a Rule-91 badge + date + build marker** (✅ ≤7 d · 🟠 8–14 d ·
  🔴 >14 d · ❌ never). Tool: `build/testing-tools/verification_badge.py --today YYYY-MM-DD`.
- Report in the plain format: **What I did · What I found · What needs to be done · Other actions ·
  OUTSTANDING — what I need from you.** Always state the TestRail update status and the build marker.

---

## 10. HARD GATES — ASK FIRST (Rules 6, 11, 22, 51, 62, 71, 80, 81)
Last-done + re-run (80) · source verify (81 — done 2026-09-24, say so) · TestRail writes (6) · Jira
creation (62 hold — stop at the button) · API-only findings asked separately (51) · Automated cases
read-assess→HOLD (71) · which process (11) · live check + access up front (22).

---

## §1a — 🛑 "I CANNOT OBSERVE THIS ON THE BUILD" IS **NOT** "BLOCKED" (verbatim, Rule 69/68/57/14/58/97)

Work in this lane almost never STOPS — it CHANGES SHAPE. When you cannot observe something, pick the
outcome already defined for it, in this order, before the word "blocked" is allowed:

| What you actually hit | The defined outcome |
|---|---|
| **Feature not built yet** | **Rule 69** marker `AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>` + `DEFERRED-RUN.md`. A finished case. (`03-RUN-CHECK.md` §7) |
| **A step/precondition needs a customer-portal screen** | The staging-only HOLD marker (`00-COMMON-CORE.md` §5.0-b; HANDOFF-2 §3b). Judge from preconditions AND steps. |
| **The source is ambiguous** | **Rule 58** — hold the case, add a PO-question row. Never resolved by looking at the build. |
| **A data state you need does not exist** | **Rule 14 — SEED IT** (pre-authorised on a disposable env). Never NOT-VERIFIED for a data state. |
| **Feature there but control not found** | **Rule 97 search drill** + **Rule 26 role reset** (may be permission-gated) + network tab + grep the served JS bundle. |
| **Genuinely your own unfinished work** | Say so plainly — "MINE". Never filed as a blocker. |

**ONLY AFTER ALL OF THE ABOVE does anything earn "blocked" — then Rule 68: DECOMPOSE (part is almost
always testable) and STATE THE RESIDUAL** (*"Blocked for X. Still possible: Y. Impossible until X: Z."*).
**Rule 57 corollary:** from the build we take exactly two things — the on-screen labels/navigation and
the pass/fail verdict; everything else (the expected behaviour) comes from the documents.

---

## SEARCH BEFORE YOU GIVE UP (mandatory — Rule 97)

**QA LEAD DIRECTIVE, 2026-08-28, verbatim:** *"I want that session if it is giving up to go and see if
you ever did something similar and it worked for you and to learn from you then."*

**THE RULE — BEFORE you report ANYTHING as impossible, blocked, unavailable, unreachable or
unreconstructable, SEARCH THIS WORKSPACE** with the **EXACT ERROR TEXT** as the key (the literal string,
not a paraphrase). Most "blockers" were already hit, diagnosed and written down. If you still cannot
find it, **REPORT THE SEARCHES YOU RAN** (commands, keys, files) so the gap is known to be real, not
merely unsearched.

**🔴 STEP 0 IS `git fetch origin`** — never search, measure or report any repository fact before
fetching; a stale checkout answers confidently and wrongly. **Search the canonical branch, not only your
own** (`git grep -n "<text>" origin/claude/slack-session-0sxnd9 -- build/`); "not on this branch" is
never proof something does not exist.

**THE SEARCH DRILL:**
```
git fetch origin                        # STEP 0 — ALWAYS FIRST
grep -rn "<exact error string>" build/ --include=*.md | head -20
git grep -n "<exact error string>" origin/claude/slack-session-0sxnd9 -- build/ | head -20
grep -rn "<endpoint/tool/symptom>" build/APP-ACTIONS-PLAYBOOK.md build/skills/ | head -20
ls build/BLOCKED-*.md ; ls build/*DIAGNOSIS*.md build/*/FINDINGS.md
git log --all --oneline --grep="<keyword>" | head -20
```
**THE FOUR PLACES, IN ORDER:** 1) `build/APP-ACTIONS-PLAYBOOK.md` (recipes + §J TestRail, §K prod) ·
2) `build/skills/14-ACCESS-RESILIENCE.md` (access ladder + preflight, Rule 89) ·
3) `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` (browser/proxy/MITM) · 4) `build/rules/RULES-*.md` (**grep,
never read whole**). Several `BLOCKED-*.md` are marked RESOLVED and carry the cause — open them.
**IF YOU SOLVE SOMETHING NEW, WRITE IT INTO THE PLAYBOOK / SKILL IN THE SAME PASS**, with the exact
error string, before you report and exit. **One tool failing is a fact about that tool, never about the
task (Rule 68).**

---

## TOKEN DISCIPLINE CHARTER (mandatory — Rule 95) — binds this session from its FIRST TURN

Canonical copy: `build/skills/TOKEN-DISCIPLINE-CHARTER.md`. Full rule text: `build/rules/RULES-61-ONWARD.md`.

> **THE QA LEAD, 2026-08-21, VERBATIM:** *"Also make sure that this session is smartest one about token
> usage as I do not want once again the weekly tokens to be burnt at the start of the week. Make it a
> general rule for all the sessions we create and the hand offs we create for new sessions"*

1. **STRATEGY FIRST (79).** Before ANY task, recall or devise the **cheapest correct plan**. For anything
   large, **declare an INTENDED SPEND** in your first reply. Then begin. One pass, then exit.
2. **NEVER BULK-READ — SCRIPT IT (88).** No case bodies, CSVs, API dumps, spec bodies or large files into
   context. **Script it to a file, read a bounded summary** (`wc -l` / `head` / `grep -c` / `grep -n` /
   bounded `sed -n 'A,Bp'`). **Never read CLAUDE.md end-to-end** (it is an index) and **never read any
   100 KB+ artefact whole** — grep it.
3. **THE READING RULE.** The startup list is for startup; afterwards consult **anything the task needs**,
   always targeted and bounded. **Knowledge is never off-limits; only BULK reading is.** Not reading a
   rule you are about to apply is worse than the tokens it would have cost.
4. **SPAWN DISCIPLINE (76 / 88).** An orchestrator (no file tools) minimises spawns and batches
   ruthlessly — every spawn re-loads the project context (200–380 k tokens each). A **lane session
   (direct tools) does the work itself** and does NOT spawn for anything it can do directly.
5. **NEVER POLL (75).** Long work runs as **ONE detached, idempotent, resumable script** with a
   checkpoint file plus a committer loop gated on a RUN-FLAG FILE — **never `pgrep -f <scriptname>`**.
   Progress is **self-reported in commit messages**. Launch and exit; verify later in one short pass.
6. **BATCH WRITES.** One scripted run with a per-op log (operation · C-id · HTTP status · verification
   result) — never one tool call per case. *"200 OK"* alone is non-compliant (50).
7. **PIGGYBACK CHEAP CHECKS (78).** Fold a cheap verification into the next substantive task; keep a
   pending-cheap-checks list. Never spend a dedicated spawn on one.
8. **NEVER RE-DO WORK (77 / 80).** Before any verification / VIU / ordered task, **STATE when it was last
   done** (date + build marker / spec version) and **ASK before re-running**. A check within the last 3
   builds or 3 source versions still COUNTS, shown with its date and badge (91).
9. **ANSWER IN TEXT** when a tool call is not needed — a reflexive tool call every turn is a trap.
10. **THE BUDGET (90).** One shared weekly pool: **main/orchestrator 15 % · each lane 25 % · 10 %
    reserve**, adjustable by the QA lead. **Report cumulative spend WITH every piece of work.** At **50 %
    of your own budget**, compare spend against work completed and **STOP AND REPORT if spend is
    outpacing progress** — never grind to zero. Never consume the reserve without his say-so.
11. **THE WEEK-START GUARD.** The pool resets weekly and was once nearly exhausted in ONE DAY. **No lane
    may spend more than its weekly allocation in the first 48 hours of the week** without explicit
    approval. A task that will exceed its declared intended spend STOPS and reports.
12. **QUALITY IS NEVER THE THING CUT.** None of clauses 1–11 may justify **sampling instead of full
    coverage (50)**, **inferring instead of observing (12)**, or **skipping a verification gate**. The
    savings come from HOW the work is executed — scripts, batching, no polling, no re-doing — never from
    doing less of it or doing it less rigorously. If cheap and correct conflict, **correct wins and you
    report the cost.**

---

## OUTSTANDING — what the build-verify session must get from the QA lead before/at start
1. **`sv_sso_session` for `sv8683.qa.shopview.com`** (current login is 401) — the one hard prerequisite.
2. **Go-ahead to write** result verdicts into R416 and to correct the 64 markers/provenance (Rule 6).
   **Already decided by the QA lead 2026-09-24: THIS session corrects any wrong markers during the live
   pass (§3).**
3. **~~Milos answers on C44567 / C44604~~ — RESOLVED 2026-09-24: both PO-confirmed correct** (§4).
4. **Confirm the build actually carries the feature** (epic is Done + env named, but capture the marker
   and confirm on arrival — Rule 89: 401 could be dead cookie OR a deploy).

## 11. ACCURACY WATCH — enumerations to confirm against the live UI (added 2026-09-24)
A case's Expected can list fewer UI elements than the build actually shows (a real miss: **C44549** said
the settings page has "four toggles"; the build has **eight** in three groups — now fixed, marked HOLD
for you to re-verify). **For every case that enumerates a set (menu items, columns, settings, actions),
confirm the live UI does not show MORE than the case lists** — if it does, that is a case DEVIATION to
fix, not a pass. Source-checked enumerations that still need a live confirm: C44584, C44586, C44589,
C44590, C44591, C44595, C44599, C44602, C44603, C44607, C53486, C53488, C53489. Full record:
`case-corrections-2026-09-24/CASE-CORRECTIONS-2026-09-24.md`.
