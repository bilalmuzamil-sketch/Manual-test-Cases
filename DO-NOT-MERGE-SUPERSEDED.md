# ⛔ DO NOT MERGE — this branch is SUPERSEDED by canonical

**Branch:** `claude/global-search-v1-baseline-6ax9ul`
**Status marker written:** 2026-08-28
**Canonical shared-brain branch:** `origin/claude/slack-session-0sxnd9`

## What this branch is (stated honestly)

This branch was cut from an **old point** and is **~56 commits BEHIND** `origin/claude/slack-session-0sxnd9`
(the canonical branch where all shared knowledge — skills, rules, playbook, diagnoses, blockers — actually
lives) and only 2 commits ahead. Those 2 commits are:

- `fbfc1c3` — "Add V1-BASELINE-FROM-SOURCE method (Skill 17 companion) + Global Search V1 baseline"
- `0df9377` — "Record blocker-search-first practice (Skill 14 §0.5 + Rule 68 pointer + matrix N2)"

They edited shared files (`CLAUDE.md`, `build/skills/14-ACCESS-RESILIENCE.md`,
`build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md`, `build/skills/README.md`,
`build/skills/COVERAGE-MATRIX.md`, `build/rules/RULES-61-96.md`) **against versions that canonical has
since moved past.**

## Why it must NOT be merged into canonical

Merging or PR-ing this branch into `origin/claude/slack-session-0sxnd9` would **revert ~56 commits of
newer shared-brain work** and **re-introduce duplicates**. Concretely, canonical already contains, more
completely, everything these 2 commits added:

- **The Global Search V1→V2 regression work** is done on canonical at
  `build/global-search/regression-2026-08-26/` (REGRESSION-IMPACT-MATRIX.md + PO-DECISION-REGISTER.md +
  authored regression cases + TestRail import + push scripts). That matrix was built from the **same
  V1 baseline** produced here (same code SHA `55767168…`, same INV-IDs). The baseline doc on this
  branch is therefore redundant with the canonical product.
- **The blocker-search-first practice** already exists on canonical in `build/PROCESS-AUTHORING-STANDARD.md`
  and every `build/handoffs/HANDOFF-*.md` (they even carry the `git grep … origin/claude/slack-session-0sxnd9`
  instruction). The Skill-14 §0.5 edit here duplicates it.
- The rules file was **renamed on canonical to `build/rules/RULES-61-97.md`** (a Rule 97 was added); the
  edit here targets the old `RULES-61-96.md`.

## What to do instead

- For Global Search V2 test cases and the V1 regression baseline, use canonical:
  `origin/claude/slack-session-0sxnd9:build/global-search/regression-2026-08-26/`.
- Treat this branch as an **isolated, read-only artifact**. It is kept (not deleted) deliberately, because
  deleting a pushed branch could be unsafe for anything that references it; this marker exists so that
  keeping it does not mislead a future reader into thinking its commits are authoritative shared-brain
  updates. **They are not.**

*Authored read-only against canonical evidence; no invention. This marker changes nothing on canonical.*
