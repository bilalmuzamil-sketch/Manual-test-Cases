# THE TWO RULE FILES NUMBER THE SAME RULES DIFFERENTLY — the map

**Both branches now carry both rules. They are DONE, not pending.** This file exists only so nobody
reads "Rule 112" in one place and "Rule 111" in another and thinks one of them is missing.

| The rule | On `claude/slack-session-0sxnd9` (**canonical**, `RULES-61-ONWARD.md`) | On `claude/global-search-v1-baseline-6ax9ul` (`RULES-61-96.md`) |
|---|---|---|
| Correct a stale identifier in a case — **the identifier only** | **112** | 111 |
| Verify against the **real case text**, never a summary | **113** | 112 |

## Why they diverge

The two files' sequences parted earlier and independently:

| # | Canonical file | Parity file |
|---|---|---|
| 109 | V1 IS the specification for a comparison suite | *(same)* |
| 110 | Never use a label without its plain-words meaning | A result is not evidence until attributed, identified and dated |
| 111 | A case is not finished until its data is seeded | Correct a stale identifier — the identifier only |

**Neither file is wrong.** They were written by different sessions on the same day and both were
ordered by the QA lead. The canonical file is the one to quote when the two disagree about a number
(`CLAUDE.md` says so of Rule 109 already).

## How they fit together

The three seeding rules are a chain, and reading them in order is the point:

- **canonical 111** — *the data must EXIST.* A case whose data is missing fails misleadingly.
- **canonical 112** — *the case must NAME the data that exists.* Seeding it and then leaving the case
  pointing at an identifier the branch never assigned just moves the false failure one step along.
- **canonical 113** — *check the CASE, not a summary of it.* This is what triggers 112 honestly: you
  only discover the identifier is stale by reading the case body, and a handoff that says
  "no changes needed" is exactly how the discovery gets skipped.

**Worked example for all three, false starts included:** this folder, plus
`build/global-search/seeding/RESEED-KNOWLEDGE.md`.
