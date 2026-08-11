# SOURCE-CURRENCY — Filters / SV-9041 — 2026-08-11

**Standing Rule 31. Every source established live BEFORE the work, and Rule 59's second read
performed immediately before the writes.**

| Source | Identifier | Version / last-updated | Checked (UTC) | Verdict |
|---|---|---|---|---|
| **Ticket** | [SV-9041](https://shopview.atlassian.net/browse/SV-9041) | created 2026-08-07T13:28:17Z; `updated` 2026-08-11T12:59:16Z (labels only) | 2026-08-11 | **CURRENT** |
| **Specification** | Confluence page 572030978 "Filters" | **Confluence version 19**, published 2026-08-06T11:48:47Z | 2026-08-11 | **CURRENT** |
| **Epic + children** | SV-8785 | **21 children**, verified two independent ways | 2026-08-11 | **CURRENT** |
| **PO answers** | Branko, 31 July Round-3 Q5=A; Branko on SV-9076, 2026-08-10 | both read live | 2026-08-11 | **CURRENT** |
| **Designs** | Figma 11854-23562 / Claude design | not re-fetched this pass | — | **PARTIAL — see below** |
| **Tech plan** | `build/filters/tech-plan-2026-07-29/` | not re-fetched this pass | — | **PARTIAL — see below** |
| **Build** | `sv8785.qa.shopview.com` | not opened this pass | — | **NOT OBSERVED — deliberate** |

## Spec version — confirmed by BODY CHECKSUM, not by the version field

The page's **in-body "Version:" field reads `1.6`** and is the Rule 31(a) trap. The **Confluence
version number is 19**.

```
live body sha256 : 2382aa20ee24586fd264e1294c3ef4513b463ecf4ea2b092e001501664e1d4fe   (57,028 chars)
saved  raw-v19   : 2382aa20ee24586fd264e1294c3ef4513b463ecf4ea2b092e001501664e1d4fe
IDENTICAL        : True
```

So the spec has **not moved** since the killed pass captured it, and the 19 archived version bodies
used for dating below are the genuine article.

## PARTIAL sources — the exact shortfall, stated rather than waved through

- **Designs.** Not re-fetched. SV-9041 is a written ticket condition, not a visual one, and no design
  artefact was cited by it or by the two cases changed. **The shortfall: if a design shows the toggle
  on a single-filter page, that is a PRD/design mismatch this pass would not have seen** (Rule 57 as
  amended — the design is authoritative too). No Rule-35 fetch queue is open.
- **Tech plan.** Not re-fetched. Nothing in scope turned on it.
- **Build.** Deliberately not opened. **No verdict in this pass is a build observation** and none is
  claimed (Rule 12). The two cases keep their existing Rule-54 sentence 2 untouched.

## Rule 59 — the second read, immediately before the writes

| | |
|---|---|
| Sources read at pass start | 2026-08-11, before any planning |
| Sources RE-READ at write start | 2026-08-11, `exec.py` re-reads each case with `get_case` and byte-compares all four text fields against the snapshot before writing |
| Verdict of the second read | **UNCHANGED** — both cases matched the snapshot on `custom_preconds`, `custom_steps`, `custom_expected` and `refs`. Had either moved, the executor would have stopped |

## Epic — Rule 37 Tier-1 (the cheap check; no full re-read was needed or done)

```
parent = SV-8785        -> 21 children
"Epic Link" = SV-8785   -> 21 children
sets equal both ways    -> True (a\b = [], b\a = [])
paging remainder        -> none; both queries fully paged
```

**Our records said 20. It is 21.** Two children are new to our records:

| Key | Type | Status | Created | Material? |
|---|---|---|---|---|
| **SV-9041** | Task | TESTING QA | 2026-08-07 | **Yes — the subject of this pass** |
| **SV-9076** | Task | **Done** | 2026-08-10 | **Yes — carries a Branko ruling; see FINDINGS.md** |

Also present and not in our written records: **SV-8901** (Story, Open, misc QA-environment issues,
flagged non-Filters) and **SV-8906** (Task, **Board Backlog**, *"Clarification Required: empty-state
inconsistency across…"*) — **SV-8906 is an unanswered clarification and is logged as outstanding.**
