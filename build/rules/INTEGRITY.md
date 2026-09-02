# INTEGRITY — CLAUDE.md archive + rule split, 2026-08-21

Standing Rule 50 (exhaustive then exact) byte-verification record for the split of
CLAUDE.md into `build/rules/`. Nothing was deleted; the whole former file is archived.

## The archive

- `build/rules/CLAUDE-FULL-ARCHIVE-2026-08-21.md` — sha256 `2d715d75530c41fecbfed34120f5891b8fae02959c2d2c7d1d9d0a2e4718ba9c`
- byte-identical to the CLAUDE.md it was taken from: **YES** (738210 bytes)

## Rule extraction byte-verify

- rule blocks found: **88** (expected 88); numbering exactly 1..88: **YES**
- rules region sliced from the archive — sha256 `9f48f1bd61a1ff970e842f9856646c985670bbc67719a2052e15450c4e505f01`
- the 88 extracted blocks re-concatenated in order — sha256 `9f48f1bd61a1ff970e842f9856646c985670bbc67719a2052e15450c4e505f01`
- **VERDICT: MATCH — nothing lost, nothing altered**

## Project-narrative extraction byte-verify

- project entries found: **7** ([1, 2, 3, 4, 5, 6, 7])
- project region sliced from the archive — sha256 `a0cf28b52db37b755957a0fb1e7a513d6fd9d7d08786dda398b754757eb69782`
- the extracted entries re-concatenated in order — sha256 `a0cf28b52db37b755957a0fb1e7a513d6fd9d7d08786dda398b754757eb69782`
- **VERDICT: MATCH — nothing lost, nothing altered**

## Where the text now lives

- `build/rules/RULES-01-20.md` — rules 1-20 (20 rules)
- `build/rules/RULES-21-40.md` — rules 21-40 (20 rules)
- `build/rules/RULES-41-60.md` — rules 41-60 (20 rules)
- `build/rules/RULES-61-99.md` — rules 61-99 (**39 rules**; 89-90 added 2026-08-21, 91-93 added 2026-08-21, **94 and 95 added 2026-08-26, 96 added 2026-08-26, 97 added 2026-08-28, 98 added 2026-09-01 (`924ee158`), 99 added 2026-09-02 (`5b6f0f8d`)**). **The file has been renamed on every rule addition and has carried, in order, the filenames `RULES-61-93.md` → `-94` → `-95` → `-96` → `-97` → `-98` → `RULES-61-99.md` (current since 2026-09-02).** On each occasion the new rule was appended and the file renamed by `git mv`, and every reference in the repo was updated in the same commit, so **a grep for any of those old filenames must return nothing** — verified 2026-09-02.
- **⚠️ THE FILENAME AND THE COUNTS IN THIS FILE GO STALE EVERY TIME A RULE IS ADDED.** They were 22 days out of date on 2026-09-02 (this file said "rules 61-97, 37 rules" while 98 and 99 existed), which meant **the no-loss assertion below would have PASSED while silently missing two rules** — the same class of failure as the 2026-08-21 truncation. **Whoever appends rule N must update this section in the same commit**, and any session relying on the numbers must re-derive them rather than trust them: `grep -cE '^[0-9]+\. \*\*' build/rules/RULES-*.md`.
- `build/rules/PROJECT-HISTORY-ARCHIVE.md` — the 7 per-project narrative blocks
- `CLAUDE.md` — rewritten as a loadable INDEX (see its READ THIS FIRST header)

---

## SIZE GUARD — CLAUDE.md is an INDEX; the TRIPWIRE is 72,000 bytes (raised from 60,000 on 2026-09-02)

### 🔴 FIRST, THE THING THAT MATTERS MOST: **THIS IS NOT A TRUNCATION LIMIT.**

**The measured auto-load truncation cliff is ~534 KB — roughly EIGHT TIMES this tripwire.** The
2026-08-21 failure that created this index was real (the 738 KB CLAUDE.md truncated on auto-load and
rules 63-88 were silently absent), and because the pre-split file is preserved byte-for-byte the cliff
is measurable:

| Fact | Measurement |
|---|---|
| `CLAUDE-FULL-ARCHIVE-2026-08-21.md` | **738,210 bytes** |
| byte offset of Rule 62's body (the last rule that loaded) | **534,488** |
| byte offset of Rule 63's body (the first that did not) | **548,807** |
| ⇒ observed truncation point | **between ~534 KB and ~549 KB** |

*(Offsets obtained with `grep -bo` on the rule titles; the archive was not read whole — never read it
whole.)* **So a `CLAUDE.md` of 60-70 KB is nowhere near the 2026-08-21 failure, and 60,000 was NEVER a
truncation limit** — it was a 50 % tolerance band above the intended ~40 KB, chosen as a **re-inflation
tripwire**. **A session that says "we are near the truncation point" is wrong by an order of magnitude,
and that error is dangerous in its own right: it invites a panic trim of load-bearing text. DO NOT
PANIC-TRIM. Nothing in §1 CRITICAL CORE is ever eligible for a size trim** — that section exists so a
session that reads nothing else is still safe.

### What the tripwire IS for, and the number

Two jobs, both still valid: **(1) it keeps CLAUDE.md an INDEX** — the moment rule bodies live in two
places they drift, and this repo has already paid that bill twice (the `10`/`11`/`12` routers, and the
duplicated TestRail-formatting bullets merged on 2026-09-02); **(2) it is a per-session token tax**,
because CLAUDE.md loads on every turn of every session (~17,000 tokens at 67 KB), which Rule 95's
Token-Discipline Charter makes a cost the project manages deliberately.

**TRIPWIRE = 72,000 bytes** (raised from 60,000, QA lead 2026-09-02). Legitimate target is still
**~28-40 KB for the index part**, with §1 CRITICAL CORE accounted separately below.
**🛑 A NUMBER ALONE ONLY DEFERS A BREACH.** Growth measured over 2026-08-31 → 2026-09-02 was
**+11.7 KB/day**, so any tripwire is reached again within days. **The actual control is the §1
ADMISSION GATE below** — the number is the alarm, the gate is the mechanism. Raising the number again
without tightening the gate is theatre.

### If the tripwire trips

**If `wc -c CLAUDE.md` exceeds 72,000 bytes, first work out WHICH kind of growth it is.**
**(a) RE-INFLATION** — a rebase or merge resurrecting pre-restructure content, a worker re-appending
full rule bodies into the index instead of editing `build/rules/`, or a project-index refresh rewriting
the whole file from a stale copy. **This is a defect: do not commit it.** Repair from `build/rules/`:
the full rule texts live in `RULES-01-20.md` / `RULES-21-40.md` / `RULES-41-60.md` / `RULES-61-99.md`
(**rules 1..99** — re-derive the range, do not trust this line), the per-project narratives in
`PROJECT-HISTORY-ARCHIVE.md`, and the verbatim pre-split file in `CLAUDE-FULL-ARCHIVE-2026-08-21.md`
(sha256 recorded above — verify it before relying on it).
**(b) LEGITIMATE ACCUMULATION** — real QA-lead rulings arriving as new §1 bullets. This is what
happened on 2026-09-02 and **none of the three (a) causes was present.** The rulings are not the
problem; the FORM they arrive in is. **Do not delete a ruling to make a number. Apply the §1 admission
gate: move the evidence to its rule/skill, verify by grep that it landed, then shorten §1's text.**

**Before overwriting CLAUDE.md, assert first that nothing would be lost:** every rule in the CURRENT
range (**1..99 as of 2026-09-02 — re-derive it with
`grep -cE '^[0-9]+\. \*\*' build/rules/RULES-*.md` and compare against the row count of CLAUDE.md §2;
do not hard-code a range that will silently pass while missing the newest rules**) has a body in a
`RULES-*.md` file, in both directions, and the archive's sha256 still matches the value recorded above.
If either check fails, STOP and report rather than overwrite.

---

## §1 ADMISSION GATE — approved by the QA lead 2026-09-02 (Rule 72)

**The defect this fixes:** §1 CRITICAL CORE had **no entry criterion**, so every new QA-lead ruling
arrived as a fresh, self-contained ~1.2 KB bullet carrying its own verbatim quote and worked example.
Each was individually correct and individually defensible; **twenty in a row breached the guard.** On
2026-09-02 alone, six commits added **+8,576 bytes, every byte of it into §1.**

**THE GATE — five clauses:**

1. **A §1 bullet is ≤ 400 bytes and states the IMPERATIVE ONLY.**
2. **The verbatim quote, the worked example and the incident history live in the rule or the skill**,
   reached by the pointer the bullet carries. **§1 carries the instruction; the authority carries the
   evidence.**
3. **A refinement AMENDS the existing bullet** on that subject — it never adds a second bullet about
   the same thing. (Two bullets on one subject drift: that is exactly how the TestRail case-field
   formatting bullet and the API-write escaping-container bullet ended up disagreeing.)
4. **§1 is hard-capped at 20,000 bytes.** At the cap, **the next admission requires demoting something
   first** — a consolidation pass, not an exception.
5. **NOTHING IS DELETED BY THIS GATE.** Content is **MOVED** to its rule/skill and pointed at, **and
   the move is verified by grep for a distinctive phrase BEFORE the §1 text is shortened.** **A gate
   that loses a ruling has failed** — a ruling that exists in neither place is a worse outcome than an
   oversized file. This is Rule 95 clause 12 applied to CLAUDE.md itself: **quality and authenticity
   are never what gets cut.**

**Applied 2026-09-02 to the seven bullets added that day: 8,678 B → 2,711 B (every one now ≤ 400 B),
with every verbatim quote and worked example verified present in its destination file BEFORE the §1 text
was shortened.** `CLAUDE.md` went **68,624 → 61,205 bytes** in the same pass (which also merged the two
duplicated TestRail-formatting bullets and replaced §2's trailing rule-provenance narrative with a
pointer to this file).

**🟠 LIVE STATE, 2026-09-02: §1 measures 22,521 bytes — ABOVE the 20,000 cap.** It is over because §1
is not eligible for a substance trim (clause 5, and the QA lead's instruction), so the cap is not met by
cutting: **clause 4 is therefore ACTIVE NOW — the next §1 admission must demote an existing bullet to
its rule/skill first.** Report this state; do not resolve it by deleting a ruling.

### Diagnosis of 2026-08-21 (the "459,549 bytes" report)

**There was no re-inflation.** A session reported `CLAUDE.md` as 459,549 bytes; the file in the working
tree, at `HEAD` and on `origin` was **34,164 bytes** in correct index form (0 full rule bodies, 91 index
rows). 459,549 is the exact size of `CLAUDE.md` at commit **`c044768d` (2026-08-10, "Record three QA-lead
rulings of 2026-08-10")** — pre-restructure, 69 full rule bodies, highest rule 62, and **693 commits
behind `HEAD`** — i.e. the figure came from a **stale session-context snapshot of the file, not from the
repository.** **Lesson: measure `CLAUDE.md` with `wc -c` on disk before concluding it has grown** — an
injected or cached copy of the file is not evidence about its current state, and "repairing" on that
basis would have discarded 693 commits of legitimate work.
