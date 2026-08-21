# GROUND-TRUTH AUDIT — 2026-08-21

**Purpose.** Read-only establishment of FACTS about this repository, because the session's picture of
it had been wrong twice in one day. Every statement below is the output of a named command, run on
this branch on this date. **No file bodies were pulled into context** — only counts, line numbers and
bounded heads.

**Method.** `git` plumbing, `ls`, `grep -c`, `head`/`sed` with bounded ranges. No TestRail call, no
Jira call, no live build access, and **zero writes to any system of record**.

---

## 1 · BRANCH REALITY

| Fact | Value |
|---|---|
| Current branch | `claude/slack-session-0sxnd9` |
| HEAD | `25eefb07` Rules 82-87 + real secret scanner & pre-commit hook + tester-readiness gate + lane locks + cross-session-safety skill |
| HEAD−1 | `25525a59` Correct the 00-COMMON-CORE "does not exist" claim + record the overlap with the pre-existing 00-08 skill set |
| HEAD−2 | `a02e6201` Three dedicated process skills + copy-paste session handoffs + catalog rows |
| Commits BEHIND `origin/claude/slack-session-0sxnd9` | **0** |
| Commits AHEAD of it | **0** |

**⇒ We are exactly level with origin. Nothing is unpushed and nothing is unpulled.** (`git fetch origin`
run immediately before measuring, so this is not a stale comparison.)

**Every remote branch, newest commit first** (`git for-each-ref --sort=-committerdate refs/remotes`):

| Branch | Last commit date |
|---|---|
| `origin/claude/slack-session-0sxnd9` | 2026-08-21 |
| `origin/claude/heic-upload-iphone-test-sz7h5p` | 2026-08-20 |
| `origin/claude/dashboard-update-4jbw2p` | 2026-08-18 |
| `origin/claude/qa-jira-dashboard-i7zxr1` | 2026-07-24 |
| `origin/claude/support-bot-critical-feature-f1e8wd` | 2026-07-23 |
| `origin/claude/spec-change-monitoring-8w6rvc` | 2026-07-14 |

**Five other `claude/*` branches exist.** Only two of them (`heic-upload…`, `dashboard-update…`) are
recent; three are weeks stale. **There is no `main` branch in this list** — the repo's working line is
`claude/slack-session-0sxnd9`.

---

## 2 · RULE NUMBERING TRUTH

**On our branch, `CLAUDE.md` carries Standing Rules 1 → 87, contiguous, with no gaps.**

Command: `grep -oE '^[0-9]+\. \*\*' CLAUDE.md | grep -oE '^[0-9]+' | sort -n`

```
1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35
36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67
68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87
```

**HIGHEST RULE NUMBER = 87.** (The raw grep also double-reports 1–7 because other numbered lists
elsewhere in the file share that shape; the per-number check below is authoritative.)

**The specific question asked — do 63…74 exist?** Per-number count with `grep -cE "^NN\. \*\*"`:

| Rule | Present? | Rule | Present? |
|---|---|---|---|
| 63 | **PRESENT** (1) | 69 | **PRESENT** (1) |
| 64 | **PRESENT** (1) | 70 | **PRESENT** (1) |
| 65 | **PRESENT** (1) | 71 | **PRESENT** (1) |
| 66 | **PRESENT** (1) | 72 | **PRESENT** (1) |
| 67 | **PRESENT** (1) | 73 | **PRESENT** (1) |
| 68 | **PRESENT** (1) | 74 | **PRESENT** (1) |

**⇒ ALL TWELVE ARE PRESENT. NONE IS ABSENT.** Exactly one occurrence each — no duplicates, no
double-numbering.

### 🔴 2.1 — THE ROOT CAUSE OF THE SESSION'S WRONG PICTURE, AND IT IS WORTH RECORDING

The session's **auto-loaded copy of `CLAUDE.md` ended at Rule 62**, which is why rules 63–87 read as
though they might not exist. **They do exist on disk and in git.** The file is **733,368 bytes (~183k
tokens)**, so the auto-load is being **truncated**, not falsified.

**THE PRACTICAL LESSON, and it is exactly Rule 88's subject:** a session must **`grep -n` `CLAUDE.md`
for the rule it needs** and must **never conclude a rule is absent from what the auto-load happened to
include.** Absence in context is **not** absence in the file. This is the second time today that a
belief about this repo was wrong in the same direction — *assuming something is missing when it is
present* — and both times a one-line `grep -c` settled it.

### 2.2 — RULE COUNTS ON THE OTHER BRANCHES

`git show <branch>:CLAUDE.md | grep -oE '^[0-9]+\. \*\*' | … | tail -1`

| Branch | Highest rule |
|---|---|
| `origin/claude/slack-session-0sxnd9` (ours) | **87** |
| `origin/claude/heic-upload-iphone-test-sz7h5p` | 62 |
| `origin/claude/dashboard-update-4jbw2p` | 61 |
| `origin/claude/qa-jira-dashboard-i7zxr1` | 8 |
| `origin/claude/support-bot-critical-feature-f1e8wd` | 7 |
| `origin/claude/spec-change-monitoring-8w6rvc` | 8 |

**⇒ OUR BRANCH HOLDS THE MOST ADVANCED RULE SET BY A WIDE MARGIN — 87 against a next-best of 62.**
**No other branch carries a rule we lack**, so there is nothing to merge in and no risk that rules
64–87 were written somewhere else and lost. **The three branches at 7–8 are not rule regressions** —
they simply predate the rule set's growth (July dates).

---

## 3 · BUILD-VERIFY REALITY — THE CONTRADICTION, SETTLED

**Both directories EXIST on our branch, in the working tree and in git.**

| Path | On our branch? |
|---|---|
| `build/report-suite/build-verify-2026-08-18/` | **YES** |
| `build/schedule/build-verify-2026-08-18/` | **YES** |

**All build-verify directories tracked on HEAD** (`git ls-tree -r --name-only HEAD`):

| Project | Directories present | **NEWEST** |
|---|---|---|
| Filters | `build-verify-2026-08-11`, `build-verify-2026-08-19` | **2026-08-19** |
| Report Suite | `build-verify-2026-08-10`, `build-verify-2026-08-18` | **2026-08-18** |
| Schedule | `build-verify-2026-08-11`, `build-verify-2026-08-18` | **2026-08-18** |

**ON OTHER BRANCHES: NONE.** `git ls-tree -r --name-only` over
`origin/claude/heic-upload-iphone-test-sz7h5p` and `origin/claude/dashboard-update-4jbw2p` returns
**zero** build-verify directories. **So the build-verification work exists on exactly one branch —
ours — and is not duplicated, forked or stranded anywhere else.**

### 3.1 — `*Defects-for-Testers*` — YES, TEN FILES EXIST

The question was whether **any** such file exists anywhere. It does, on our branch, as **five `.md` +
`.xlsx` twins**:

| File |
|---|
| `build/filters/build-verify-2026-08-19/Filters_Defects-for-Testers_2026-08-20.md` / `.xlsx` |
| `build/report-suite/build-verify-2026-08-18/ReportSuite_Defects-for-Testers_2026-08-20.md` / `.xlsx` |
| `build/report-suite/build-verify-2026-08-18/Defects-for-Testers_ReportSuite-and-Schedule_2026-08-19.md` / `.xlsx` |
| `build/schedule/build-verify-2026-08-18/Schedule_Defects-for-Testers_2026-08-20.md` / `.xlsx` |
| `build/schedule/build-verify-2026-08-18/Schedule_Defects-for-Testers_2026-08-19.md` / `.xlsx` |

**Commit history** (`git log --all --oneline -- '*Defects-for-Testers*'`) shows the shape of the work
plainly: a **combined** Report-Suite-and-Schedule sheet dated **2026-08-19** was **later split into
three per-project workbooks dated 2026-08-20** (commit `3fffe330` — *"Split combined defect sheet into
three per-project Defects-for-Testers workbooks (2026-08-20)"*), and the Schedule sheet was then
revised again (`aeec9945` — *"merge C29945 rows, split into Defects-to-file / Reference tabs"*).

**⚠️ ONE OBSERVATION, REPORTED NOT ACTED ON:** the **superseded combined 2026-08-19 sheet is still
present** alongside the three per-project ones, and **Schedule carries both an 08-19 and an 08-20
version**. That is a **potential ambiguity about which sheet the test team should use** — a tidy-up
question for the QA lead, **not something this read-only audit changes.**

---

## 4 · SKILLS INVENTORY

`ls build/skills/` — **17 entries: 15 `.md` files, 1 directory, and the two meta files.**

| File | Title (from its own first line) |
|---|---|
| `00-COMMON-CORE.md` | COMMON CORE — what every Skill in this set needs, regardless of the task |
| `01-CASE-BUILD.md` | CASE-BUILD — author or extend a test suite from the sources |
| `02-SOURCE-CHECK.md` | SOURCE-CHECK — establish that we hold the CURRENT version of every source |
| `03-RUN-CHECK.md` | RUN-CHECK — prove every precondition and every step can actually be executed on the build |
| `04-TESTER-READY.md` | TESTER-READY — hand a suite to the manual test team so they can pick it up and run it |
| `05-PROJECT-REPORT.md` | PROJECT-REPORT — the per-project completion table, delivered before the next project starts |
| `06-DEFECT-PREP.md` | DEFECT-PREP — build a defect ticket that cannot be challenged, then stop at the button |
| `07-PO-QUESTIONS.md` | PO-QUESTIONS — one sheet, in plain words, sent last |
| `08-RECOVER.md` | RECOVER — establish what a killed pass actually landed, by content, and finish it |
| `10-TEST-CASE-CREATION.md` | SKILL 10 — TEST-CASE CREATION (authoring new cases from sources) |
| `11-BUILD-VERIFICATION.md` | SKILL 11 — BUILD VERIFICATION (verifying existing cases against the running build) |
| `12-VIU.md` | SKILL 12 — VIU (the full build-accurate wording + Verify-In-UI pass) |
| `13-CROSS-SESSION-SAFETY.md` | CROSS-SESSION SAFETY — the operator form of Standing Rules 82–87 |
| `COVERAGE-MATRIX.md` | COVERAGE MATRIX — every session learning, and which Skill file carries it |
| `README.md` | Skills — the eight jobs this workspace does, written to be run cold |
| `STATE.md` | STATE — where the Skill set stands, and what is still open on it |
| `verification-2026-08-13/` | (directory) |

**`build/handoffs/`** holds four files: `HANDOFF-1-TEST-CASE-CREATION.md`,
`HANDOFF-2-BUILD-VERIFICATION.md`, `HANDOFF-3-VIU.md`, `README.md`.

**⚠️ `README.md` says *"the eight jobs this workspace does"* — there are now THIRTEEN skill files
(00–08 plus 10–13).** The README's own headline is **stale against its own directory**. Reported, not
edited.

---

## 5 · THE FINAL-vs-NOT-FINAL CONFLICT — STATED, NOT RESOLVED

**`build/skills/00-COMMON-CORE.md` line 1705** opens:

> `# 16 · FINALITY — all three branches are FINAL, and what that does and does not mean`

and, immediately below:

> **"⚠️ THIS SUPERSEDES THE LONG-STANDING 'the branches will never be declared final' POSITION. The
> old wording is kept dated in `CLAUDE.md` rather than deleted; do not quote it."**

It cites **two QA-lead rulings on 2026-08-11**, verbatim: *"note that ALL 6 reports have been handed
off now."* (making **Report Suite** final) and, later the same day, ***"The Branches are Final now."***
— read as **plural**, extending finality to **Schedule (`sv8685`) and Filters (`sv8785`)**. It then
states that findings are **no longer provisional**, that **Rule-49 queue rows may close on all three**
on the ordinary condition, and that **"an OPEN queue is the normal steady state" is RETIRED.**

### THE CONFLICT, FACTUALLY

| Source | Position |
|---|---|
| `CLAUDE.md` Rule 60 headline | *"THE BUILD WILL NEVER BE DECLARED FINAL"* — amended 2026-08-10 to *"true only PER REPORT"* |
| `CLAUDE.md` Rule 49 tail (2026-08-10 ruling) | Finality is a **PER-REPORT** property: **WIP · TU · SBC final**; **SBR · PV · IV not final**; branch-wide finality **requires all six** |
| `00-COMMON-CORE.md` §16 (2026-08-11 rulings) | **ALL SIX reports handed off**, therefore Report Suite final — **and all three branches final** |

**These are not necessarily contradictory: §16 is DATED ONE DAY LATER and asserts the condition
Rule 49's 2026-08-10 ruling itself set** (*"Once all 6 reports are handded of to the QA only then we
can consider the branch as final"*). On its face **§16 is the later authoritative source and Rule 32
would make it prevail.**

**🛑 BUT TWO THINGS ARE GENUINELY UNSETTLED, AND THEY ARE THE QA LEAD'S CALL, NOT OURS:**
1. **`CLAUDE.md` has not been updated to reflect the 2026-08-11 rulings.** Rules 49 and 60 still read
   per-report / never-final. So **the workspace's two authorities disagree in their text**, and a cold
   session reading `CLAUDE.md` alone would reach the older answer. **§16 tells readers not to quote the
   old wording — but the old wording is still what `CLAUDE.md` says.**
2. **Whether *"The Branches are Final now."* really extended finality to Schedule and Filters is an
   INTERPRETATION recorded in §16, not a quote naming those branches.** The words are plural; the
   branches are not named. **§16 reads the plural as covering all three.** That reading may well be
   right, but it is a reading, and it silently converts every Schedule and Filters deviation from
   provisional to real-defect-in-a-finished-feature.

**NOT RESOLVED HERE, BY INSTRUCTION.** Recorded for the QA lead's decision, with the single question
that settles both: **are Schedule and Filters final, and may `CLAUDE.md` Rules 49/60 be updated to
say so?**

---

## 6 · DUPLICATION MAP — 10 / 11 / 12 AGAINST 01–06

Derived from section headings only, not bodies.

- **`10-TEST-CASE-CREATION`** overlaps **`01-CASE-BUILD`** almost completely (both = author/extend a
  suite from sources), and carries **`02-SOURCE-CHECK`**'s whole job inside its §3 Rule-31 pre-flight,
  plus **`06-DEFECT-PREP`**'s ask-first gate as its §10 "HARD GATES".
- **`11-BUILD-VERIFICATION`** overlaps **`03-RUN-CHECK`** (both = drive cases against the live build,
  build marker at both ends, re-check queue), and its §1 "two gates" duplicates **`02-SOURCE-CHECK`**;
  its §7 deliverable overlaps **`04-TESTER-READY`**.
- **`12-VIU`** is the union of **`03-RUN-CHECK`** (live driving) + **`01-CASE-BUILD`** (rewriting the
  case text) + **`04-TESTER-READY`** (§7 deliverables), and its §4 write-phase duplicates the Rule-50
  byte-verify material that `00-COMMON-CORE` already holds.

**Note for the decision:** 10/11/12 each open with **`## 0. SHARED CORE BLOCK (identical in skills 10
/ 11 / 12)`** — so that block is **triplicated by design**, and 11 and 12 already carry a section
titled *"⚠️ RELATIONSHIP TO THE PRE-EXISTING `00`–`08` SKILL SET (recorded 2026-08-21)"*, meaning
**the overlap was already known and documented rather than discovered here.** **Merge-vs-keep is the
QA lead's call; this audit only maps it.**

---

## 7 · `CLAUDE.md` SIZE — SIZING THE SLIMMING PROPOSAL

| Measure | Value |
|---|---|
| Total bytes | **733,368** |
| Total lines | **7,698** |
| Estimated tokens (chars ÷ 4) | **~183,000** |
| `**STANDING RULES (apply to all projects):**` begins at | **line 2,165** |
| Bytes BEFORE that line (per-project narrative + preamble) | **201,771** (~50,400 tokens) — **27.5%** |
| Bytes FROM that line on (the Standing Rules) | **531,597** (~132,900 tokens) — **72.5%** |

**⇒ THE RULES ARE THE BULK, NOT THE PROJECT NARRATIVE.** A slimming pass aimed only at the
per-project sections would recover **at most ~27%**; the ~133k tokens of Standing Rules are where the
weight is. **And note the honest consequence: at ~183k tokens the file is large enough that the
auto-load truncates it (see §2.1), so slimming is not cosmetic — it is what makes the rules reliably
readable at all.**

**⚠️ NO SLIMMING IS PROPOSED OR PERFORMED HERE.** Deleting or condensing a Standing Rule is a
substantive change to the workspace's law and needs the QA lead's authorisation. This section only
sizes the option.

---

## 8 · WHAT THIS AUDIT DOES NOT CLAIM

- **It did not read any file body in full**, so it makes **no claim about the CORRECTNESS of any
  skill, rule or deliverable** — only about existence, counts, dates and headings.
- **It did not verify any of the build-verify work against TestRail or a live build.** The
  directories exist; whether their findings still hold is not in scope.
- **It did not resolve the finality conflict (§5)** or the sheet-duplication ambiguity (§3.1) or the
  10/11/12 overlap (§6). All three are recorded for the QA lead.
- **Zero writes** to TestRail or Jira. Zero live access. Read-only throughout.
