# PROJECT-STATE — Search Results Integrity

**Last updated:** 2026-09-29 · **Project:** Global Search (epic SV-9160), row-display defect family
**PO:** Branko Cicovic (PRD author) · Milos Vasic authored v1.5 · **QA lead:** Bilal Muzamil

## Where this came from

Opened 2026-09-29 on the QA lead's instruction, after SV-10619 and SV-10551 and a rising count of
minor search complaints from UAT and support. His words: *"we need to find the ways to catch those
problems before the customers find them"*, and the cases *"need to be based on Logical searching
expectations of an end user"*, in a separate folder.

## Status

| | |
|---|---|
| Cases authored | **110**, across 9 files |
| Pushed to TestRail | **NO** — Rule 62 creation hold. Nothing has been created |
| Held pending PO answer | **32** (all Class C, PO question Q1) |
| PO questions raised | **10**, in `PO-QUESTIONS.md`, not yet sent |
| Source verified | ✅ 2026-09-29 — PRD **v1.5 (2026-09-08)**, read live |
| Build verified | ❌ never — no case in this folder has been run |
| Data seeded | ❌ none of the fragment-sharing pairs exist yet |

## Sources, and their currency

| Source | Version | Checked |
|---|---|---|
| Global Search - Product Requirements (page 576978945) | **v1.5**, 2026-09-08 | ✅ 2026-09-29 |
| SV-9170 (story) | updated 2026-09-25 | ✅ 2026-09-29 |
| SV-10619, SV-10551 | Open | ✅ 2026-09-29 |

## What is NOT done, and in what order it should be

1. **Q1 must be answered** before the 32 Class C cases can assert anything. Everything else can run
   without it.
2. **Seed the fragment-sharing pairs.** Class A and Class B both need two records that share a run of
   characters and differ elsewhere — `123786` / `185786` in the QA lead's example. No existing
   manifest builds these. A new manifest in `build/global-search/seeding/` following
   `build/skills/20-FEATURE-DATA-SEEDING.md`; the engine is generic, only the manifest is new.
3. **Run the suite** once seeded, on staging. No verdicts exist for any case.
4. **Decide TestRail placement** — a new section under the Global Search group, once the hold lifts.

## Deliberate decisions

- **Separate folder, separate suite.** Asked for, and right: it re-runs on front-end changes rather
  than ranking changes.
- **Class C written and held rather than skipped.** The spec gap is the finding; an unwritten case is
  how the family escaped.
- **Generated from a table.** ~120 near-identical bodies drift when hand-written. The data is
  hand-checked, the prose is mechanical, and a PRD change is one edit plus a rerun.
- **No case asserts what the build does.** Several build behaviours look *better* than the spec (the
  asset unit number) — they still became PO questions, not assertions (Rule 57).

## OUTSTANDING

**On the QA lead:** answer or route PO question Q1 (see `PO-QUESTIONS.md`); say whether to send the
10 questions to the PO; say whether Q3 goes to engineering.

**On me:** the seeding manifest for the fragment-sharing pairs, once the above is answered — and
rewriting the 32 held Expected Results to quote the PRD after the answer is written into it.
