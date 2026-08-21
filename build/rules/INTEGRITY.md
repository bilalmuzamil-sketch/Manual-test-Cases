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
- `build/rules/RULES-61-93.md` — rules 61-88 (28 rules)
- `build/rules/PROJECT-HISTORY-ARCHIVE.md` — the 7 per-project narrative blocks
- `CLAUDE.md` — rewritten as a loadable INDEX (see its READ THIS FIRST header)

---

## SIZE GUARD — CLAUDE.md is an INDEX and MUST stay under 60,000 bytes

`CLAUDE.md` is an **index**, not the rule book. Its legitimate size is ~28–40 KB.
**If `wc -c CLAUDE.md` exceeds 60,000 bytes it has been RE-INFLATED** — the usual causes are
(a) a rebase or merge resurrecting the pre-restructure content, (b) a worker re-appending full rule
bodies into the index instead of editing `build/rules/`, or (c) a project-index refresh rewriting the
whole file from a stale copy. **Do not commit it.** Repair it from `build/rules/`: the full rule texts
live in `RULES-01-20.md` / `RULES-21-40.md` / `RULES-41-60.md` / `RULES-61-93.md`, the per-project
narratives in `PROJECT-HISTORY-ARCHIVE.md`, and the verbatim pre-split file in
`CLAUDE-FULL-ARCHIVE-2026-08-21.md` (sha256 recorded above — verify it before relying on it).

**Before overwriting CLAUDE.md, assert first that nothing would be lost:** every rule 1..93 has a body
in a `RULES-*.md` file (both directions), and the archive's sha256 still matches the value recorded
above. If either check fails, STOP and report rather than overwrite.

### Diagnosis of 2026-08-21 (the "459,549 bytes" report)

**There was no re-inflation.** A session reported `CLAUDE.md` as 459,549 bytes; the file in the working
tree, at `HEAD` and on `origin` was **34,164 bytes** in correct index form (0 full rule bodies, 91 index
rows). 459,549 is the exact size of `CLAUDE.md` at commit **`c044768d` (2026-08-10, "Record three QA-lead
rulings of 2026-08-10")** — pre-restructure, 69 full rule bodies, highest rule 62, and **693 commits
behind `HEAD`** — i.e. the figure came from a **stale session-context snapshot of the file, not from the
repository.** **Lesson: measure `CLAUDE.md` with `wc -c` on disk before concluding it has grown** — an
injected or cached copy of the file is not evidence about its current state, and "repairing" on that
basis would have discarded 693 commits of legitimate work.
