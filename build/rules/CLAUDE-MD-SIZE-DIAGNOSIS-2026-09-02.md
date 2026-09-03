# CLAUDE.md SIZE GUARD — BREACH DIAGNOSIS, 2026-09-02

> **📁 PATH NOTE, 2026-09-03 — `build/rules/RULES-61-99.md` NO LONGER EXISTS; IT IS NOW
> `build/rules/RULES-61-ONWARD.md`.** The old name is left in this dated report **on purpose** — it
> records what was measured on 2026-09-02. Substitute the new name when following a path below.
> The range-in-filename convention was retired; see `build/rules/INTEGRITY.md`.

**DIAGNOSIS ONLY. NOTHING WAS CUT FROM `CLAUDE.md` IN THIS PASS AND `CLAUDE.md` WAS NOT EDITED.**
Every figure below was measured on disk at `HEAD` on `claude/slack-session-0sxnd9`, not recalled from
a session snapshot — which is the lesson `build/rules/INTEGRITY.md` already records from the
2026-08-21 "459,549 bytes" false alarm.

---

## 1 · THE MEASUREMENT

| | Bytes |
|---|---|
| `wc -c CLAUDE.md` now (`856639a7`) | **67,466** |
| Guard recorded in `build/rules/INTEGRITY.md` §SIZE GUARD | **60,000** |
| Stated legitimate size in the same guard | **~28,000 – 40,000** |
| Overage vs the guard | **+7,466 (12.4 % over)** |
| Overage vs the stated legitimate ceiling | **+27,466 (69 % over)** |

**Size at every commit that touched `CLAUDE.md` since it was last inside the guard** (`git show
<sha>:CLAUDE.md | wc -c`). The guard was crossed at **`9b9a1e61`, 2026-09-02 03:25 UTC**.

| commit | authored (UTC) | bytes | Δ | over guard? |
|---|---|---|---|---|
| `d45901e8` | 08-31 17:07 | 46,352 | — | |
| `f65fbf44` | 08-31 17:09 | 47,949 | +1,597 | |
| `66cd8334` | 08-31 18:35 | 48,408 | +459 | |
| `6c316ef5` | 09-01 02:16 | 48,795 | +387 | |
| `b6899536` | 09-01 03:36 | 49,989 | +1,194 | |
| `66eb7671` | 09-01 04:39 | 50,845 | +856 | |
| `a47ae809` | 09-01 04:30 | 51,486 | +641 | |
| `74551230` | 09-01 05:20 | 51,861 | +375 | |
| `e79d3e61` | 09-01 06:08 | 51,995 | +134 | |
| `924ee158` | 09-01 08:48 | 54,241 | +2,246 | |
| `7daad464` | 09-01 10:34 | 55,212 | +971 | |
| `02fcdbcb` | 09-01 13:11 | 56,885 | +1,673 | |
| `65716b9b` | 09-01 14:49 | 57,665 | +780 | |
| `4fb74e63` | 09-01 16:59 | 58,890 | +1,225 | |
| **`9b9a1e61`** | **09-02 03:25** | **60,423** | **+1,533** | **🔴 BREACH** |
| `3c5e560d` | 09-02 05:37 | 61,913 | +1,490 | 🔴 |
| `5b6f0f8d` | 09-02 07:27 | 63,324 | +1,411 | 🔴 |
| `b50ff2b2` | 09-02 08:39 | 64,855 | +1,531 | 🔴 |
| `bf48aa9f` | 09-02 10:27 | 66,360 | +1,505 | 🔴 |
| `856639a7` | 09-02 12:30 | 67,466 | +1,106 | 🔴 |

**Growth rate: +21,114 bytes in 43h23m = ~487 bytes/hour = ~11.7 KB/day.** On 2026-09-02 alone six
commits added **+8,576 bytes**.

---

## 2 · WHICH COMMITS ADDED WHAT — AND WHERE

**Every byte of the 2026-09-02 growth is a new bullet appended to §1 CRITICAL CORE.** Not one of
today's commits touched §2, §3, §4 or §5 except `5b6f0f8d`, which also renumbered the rule index.

| commit | what it added | bytes | lands in |
|---|---|---|---|
| `9b9a1e61` | `🎨 A DESIGN REFERENCE IS A LINK *AND* A ROUTE` (QA lead 09-01) — now L227-241, 1,532 B | +1,533 | §1 |
| `3c5e560d` | `🛑 COUNT FROM THE SYSTEM OF RECORD…` (L112-121, 924 B) + `🛑 A RULE'S AMENDMENT IS PART OF THE RULE` (L122-127, 564 B) | +1,490 | §1 |
| `5b6f0f8d` | `🛑 EVERY ASK IS SELF-CONTAINED AND EXECUTABLE (99…)` (L202-214, 1,276 B); also rule-count renumber 97→99 across §2/§6 | +1,411 | §1 + §2 + §6 |
| `b50ff2b2` | `🛑 A LABEL IS READ FROM THE SMALLEST ELEMENT THAT OWNS IT` (L89-103, 1,530 B) | +1,531 | §1 |
| `bf48aa9f` | `🛑 THE MISTAKE-PREVENTION MECHANISM IS TWO FILES, NOT A CHECKLIST` (L128-142, 1,504 B) | +1,505 | §1 |
| `856639a7` | `🛑 NEVER CALL QUICK-LOGIN ON A SESSION YOU DID NOT MINT` (L177-187, 1,105 B) | +1,106 | §1 |

**Current composition of the file:**

| Section | Lines | Bytes | Share |
|---|---|---|---|
| Title + READ THIS FIRST + WHY THIS INDEX EXISTS | 1-30 | 1,768 | 2.6 % |
| **§1 CRITICAL CORE** (34 bullets) | 31-305 | **26,424** | **39.2 %** |
| §2 RULE INDEX — header + rules 1-60 tables | 306-386 | 5,999 | 8.9 % |
| §2 RULE INDEX — rules 61-99 table | 387-429 | 4,913 | 7.3 % |
| §2 RULE INDEX — trailing narrative on rules 89/90/91/95/96/97 | 430-473 | 3,399 | 5.0 % |
| §3 PROJECT INDEX | 474-515 | 6,544 | 9.7 % |
| §4 SKILLS INDEX | 516-575 | 5,918 | 8.8 % |
| §5 DELIVERABLE CONVENTIONS | 576-700 | 11,044 | 16.4 % |
| §6 WHERE THE REST WENT | 701-723 | 1,444 | 2.1 % |

**The growth mechanism is NOT the one the guard was written to catch.** `INTEGRITY.md` names three
causes — a rebase resurrecting pre-restructure content, a worker re-appending full rule bodies, or a
project-index refresh from a stale copy. **None of them happened.** What happened is legitimate: every
QA-lead ruling of the last two days was written into §1 as a self-contained ~1.2 KB bullet carrying its
own verbatim quote and worked example. Each one is individually correct and individually defensible.
Twenty of them in a row breach the guard.

---

## 3 · RANKED TRIM CANDIDATES

**Nothing below touches §1 CRITICAL CORE.** §1 exists so a session that reads nothing else is still
safe; it is excluded from this list by instruction and on merit. Candidates are ranked by
(bytes saved ÷ risk).

### C1 — §2 trailing narrative, L430-473 · saves ~3,150 B · RISK: LOW
Six paragraphs explaining when rules 89, 90, 91, 95, 96 and 97 were added, which file they went into,
and what that file used to be called. This is **provenance narrative, not rule text**. Every operative
sentence in it is already carried twice over: the rule bodies are in `build/rules/RULES-61-99.md`, the
rename history is in `INTEGRITY.md`, and the substance is already in §1 CRITICAL CORE bullets
("THE TOKEN-DISCIPLINE CHARTER BINDS EVERY SESSION…(95)", "A V2 / UPGRADE PROJECT MUST DERIVE…(96)",
"NEVER DECLARE A BLOCKER WITHOUT SEARCHING THE REPO FIRST (97)").
**Replace with:** a three-line pointer naming the operator-form file for each (`TOKEN-DISCIPLINE-CHARTER.md`,
`17-REGRESSION-IMPACT-V1-TO-V2.md`, `14-ACCESS-RESILIENCE.md`, `verification_badge.py`).
**Residual risk:** the Rule 91 correction ("the branches are NOT final") would lose its restatement
here — but it is stated in full in `00-COMMON-CORE.md` §16.0, which §4 already points at, and in Rules
49/60. Keep the ✅/🟠/🔴/❌ badge thresholds line (one line) rather than deleting it.

### C2 — §5 `🛑 THE API-WRITE ESCAPING-CONTAINER TRAP`, L669-686 · saves ~1,400 B · RISK: MEDIUM
1,812 B, of which roughly 1,400 is the evidence story (the v13→v16 pass, the 76 reformatted Inline
cases, the two container class names, the three repair-directory paths). **The bullet itself already
ends by pointing at the canonical location — "Full evidence + the served-page scanner:
`build/APP-ACTIONS-PLAYBOOK.md` §J."**
**Keep, in ~400 B:** (a) an API write leaves the field in the escaping container, (b) only a UI save
flips it to `fr-view`, (c) repair through the UI editor and never by another API write, (d) do not
"upgrade" readable plain text to block HTML via the API, (e) the §J pointer.
**Risk is MEDIUM and real:** this trap has already produced 76 unreadable cases. Cut the narrative, keep
all five imperatives verbatim.

### C3 — §5 `🛑 TESTRAIL CASE-FIELD FORMATTING`, L657-668 · saves ~880 B · RISK: MEDIUM
1,283 B. Same shape and the same closing pointer ("Full trap + round-trip evidence:
`APP-ACTIONS-PLAYBOOK.md` §J"). It overlaps C2 heavily — both explain the same container mechanism.
**Keep, in ~400 B:** `<p>` / `<ol>`/`<ul><li>` / `<hr />` only; never inline tags; never a bare `\n\n`;
`<br>` is origin-dependent and must never be emitted by an API payload; provenance below an `<hr />`.
**Merging C2 and C3 into one formatting bullet is the better move** — together they would save ~2,300 B
and remove a duplication that is already drifting.

### C4 — §3 PROJECT INDEX table-cell history · saves ~1,200-1,500 B · RISK: LOW-MEDIUM
The seven rows total 4,292 B; several carry embedded corrections-of-the-record
(`Corrected 2026-08-28: the row said 509, which was wrong…` 171 B; `Corrected 2026-08-28: the row said
"86 cases in group 4094"…` 207 B) plus per-row evidence narrative (Global Search row alone = 1,106 B,
Report Suite = 817 B). §3's own header already says **"the detail lives in each project's own
`PROJECT-STATE.md`"** and the section is banner-marked **"REFERENCE ONLY — NOT a backlog and does not
authorise action (Rule 92)"**, which makes it the least load-bearing prose in the file.
**Move to:** `build/rules/PROJECT-HISTORY-ARCHIVE.md` and each `build/<project>/PROJECT-STATE.md`.
**Keep in the row:** project · epic · status word · case count · both badges with dates · PO · resume doc.
**Residual risk:** a session that reads only CLAUDE.md loses the "this number was wrong before" warning.
Mitigate by keeping a single sentence at the head of §3 saying the counts were re-derived live on
2026-08-21 and pointing at `PROJECT-INDEX-REFRESH-2026-08-21.md` — which is already there.

### C5 — §4 router-history paragraph, L548-555 · saves ~550 B · RISK: LOW
695 B narrating a 2026-08-21 refactor: that `10`/`11`/`12` used to be standalone skills, that they
duplicated `01`-`06`, that the two copies had started to disagree, and where three specific merged
items landed. The only forward-looking sentence is the last one.
**Keep, in ~140 B:** *"`10`/`11`/`12`/`16` are thin routers: they hold no procedure. Procedure found
inside a router is a bug in that router — the canonical text is in `00`-`08`."*

### C6 — §4 FINALITY paragraph, L556-560 · saves ~200 B · RISK: LOW
351 B restating `00-COMMON-CORE.md` §16.0 vs §16.1. Compress to one line: *"Finality:
`00-COMMON-CORE.md` §16.0 (current) — the branches are NOT final; §16.1 is the superseded 2026-08-11
text."*

**Total available from C1-C6: ~7,400-7,700 bytes**, which lands the file at **~59,800-60,100** — i.e.
**exactly at the guard, with zero headroom, and back over it within one working hour** at the measured
rate of 487 B/h. **That is the finding, not the trim.**

---

## 4 · IS 60,000 STILL THE RIGHT NUMBER?

**The honest answer is that 60,000 is not a truncation cliff, and no one has ever claimed it was — but
the file is now being described as if it were, and that will mislead the next session.**

### 4a · Where auto-load actually truncated, measured

The recorded failure is real and is the reason this index exists: the 738 KB CLAUDE.md **truncated on
auto-load at Rule 62**, so rules 63-88 were silently absent. That gives us a measurable cliff, because
the pre-split file is preserved byte-for-byte:

| Fact | Measurement |
|---|---|
| `build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md` | **738,210 bytes** |
| Byte offset of Rule 62's body in that archive | **534,488** |
| Byte offset of Rule 63's body in that archive | **548,807** |
| ⇒ observed truncation point | **between ~534 KB and ~549 KB** (≈ 72-74 % of the file) |

*(Offsets obtained with `grep -bo` on the rule titles; the archive was not read.)*

**So auto-load carried at least ~534 KB before it stopped — roughly 8× the current guard and 7.9× the
current file.** `CLAUDE.md` at 67,466 bytes is **not** at risk of the 2026-08-21 failure. A session that
says "we are near the truncation point" is wrong by an order of magnitude, and that error is dangerous
in its own right: it invites a panic trim of content that is load-bearing.

### 4b · What the guard is actually for

The guard's own words give it away — *"`CLAUDE.md` is an **index**, not the rule book. Its legitimate
size is ~28-40 KB."* **60,000 was never a technical limit; it was a 50 % tolerance band above the
intended 40 KB, chosen as a re-inflation tripwire.** Its real job is twofold and both jobs are still
valid:

1. **It keeps CLAUDE.md an index.** The moment rule bodies live in two places they drift — this repo has
   already paid that bill twice (the `10`/`11`/`12` routers, and the C2/C3 duplication above).
2. **It is a per-session token tax.** CLAUDE.md loads on every turn of every session. 67,466 bytes is
   roughly **17,000 tokens**, up from ~11,600 at 46,352. That is ~5,400 tokens per session per turn of
   pure growth in 43 hours, and Rule 95's Token-Discipline Charter makes that a cost the project has
   explicitly decided to manage.

### 4c · Recommendation

**Do not raise the guard to the truncation point, and do not silently raise it at all. Do three things:**

1. **Restate the guard honestly rather than renumber it.** Amend `INTEGRITY.md` §SIZE GUARD to say what
   it now knows: the number is a **token-budget and index-discipline threshold, not a truncation
   cliff**; the measured truncation point is **~534 KB** (evidence above); and the legitimate target is
   still **28-40 KB**. Without this, the next session either panics or dismisses the guard entirely.
2. **Raise the tripwire to 72,000 bytes with an explicit expiry.** 60,000 no longer reflects what §1
   must carry: §1 alone is 26,424 B and is the section the project has deliberately chosen to grow.
   72,000 gives one week of headroom at the measured rate. **A number alone only defers the breach by
   days** — the growth is +11.7 KB/day, so 72,000 is reached on ~2026-09-02+0.4 d and 100,000 by
   ~2026-09-05. **The number must therefore ship with (3), or it is theatre.**
3. **Add the missing mechanism: a §1 admission gate.** The real defect is that §1 has no entry
   criterion, so every new QA-lead ruling arrives as a fresh ~1.2 KB bullet with its own verbatim quote
   and worked example. Proposed gate, to be put to the QA lead under Rule 72 before it is recorded:
   - a §1 bullet is **≤ 400 bytes** and states the imperative only;
   - the **verbatim quote, the worked example and the evidence** go in the rule body or the skill, and
     the bullet carries a pointer;
   - a new ruling that is a **refinement of an existing bullet amends that bullet** rather than adding
     a 35th;
   - §1 has a **hard ceiling of 20,000 bytes**; reaching it forces a consolidation pass, not an
     exception.
   Applied to the seven bullets added on 2026-09-02 (8,435 B combined) this would have cost ~2,800 B —
   the guard would never have been breached, and nothing would have been lost, because the full text
   would live in the rules and skills files where it is greppable.

**In short: the guard is still the right idea, the number is stale, and the number is not the fix.**

---

## 5 · ONE THING FOUND IN PASSING (not fixed here)

`build/rules/INTEGRITY.md` is itself stale on rule counts: its §SIZE GUARD repair instructions say
*"rules 1..97"* (twice) and its file list says *"`RULES-61-99.md` — rules 61-97 (**37 rules**)"*, while
`CLAUDE.md` §2 now indexes **99** rules and rules 98 and 99 exist. The no-loss assertion it prescribes
("every rule 1..97 has a body in a `RULES-*.md` file") would therefore pass while missing two rules.
**Reported, not changed** — it is outside this pass's scope.

---

## OUTSTANDING — what I need from you

1. **Approve or reject the §1 admission gate (item 4c-3).** It is a change to how CLAUDE.md is written,
   so under Rule 72 it must be proposed before it is recorded. Without it, raising the number buys days.
2. **Approve the guard restatement and the new number (4c-1, 4c-2).** Recommended: keep the guard,
   restate it as a token-budget threshold with the ~534 KB truncation evidence, set the tripwire to
   72,000 bytes.
3. **Approve the trim list C1-C6, in whole or in part.** No cut was made in this pass. C1 (~3,150 B,
   low risk) and the C2+C3 merge (~2,300 B, medium risk, removes an active duplication) are the two
   worth doing first.
4. **Decide who fixes `INTEGRITY.md`'s stale rule counts (§5 above).**
