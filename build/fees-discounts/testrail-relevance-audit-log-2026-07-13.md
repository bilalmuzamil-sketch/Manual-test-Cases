# F&D — Spec-Relevance audit — TestRail action log (2026-07-13)

> Per-case/section audit of TestRail writes made during the spec-relevance
> reconciliation pass. F&D TestRail wording/relevance writes AUTHORIZED for this
> task. Fees & Discounts project only; NO runs/results/deletions.

### Section rename — 2026-07-13

| Object | Action | Before | After | HTTP (update/verify) |
|---|---|---|---|---|
| Section 3928 (parent 3894; holds only FD-PROC-004 = C28522) | update_section | Processing Fee — taxable + legal disclosure | Processing Fee — taxable + jurisdiction note | 200 / 200 |

Rationale: §16.1 (S8-R13 rewritten) removed the Processing-Fee legal-disclosure
block and replaced it with the §5-R15 taxable-jurisdiction note; the case `area`,
title, and import CSV were already updated, but the live TestRail section name (and
the id-map section column) still carried the removed "legal disclosure" wording.

### Read-only snapshots (get_case) — 2026-07-13

| C-ID | FD-ID | HTTP | Saved to |
|---|---|---|---|
| C28500 | FD-CUST-016 | 200 | testrail-snapshots-relevance-2026-07-13/C28500.json |
| C28605 | FD-VAL-007 | 200 | testrail-snapshots-relevance-2026-07-13/C28605.json |

(RETIRE candidates — DUPLICATE/OVERLAP pair; snapshotted for the QA-lead ruling. NOT
deleted.)

### update_case

None. All tester-facing case content (title/preconds/steps/expected) was already
current in TestRail from the 2026-07-13 build-accurate wording+VIU push — the
relevance sweep found 0 MISSED case-content items, so no case rewrite/push was
required.

**Totals:** 1 update_section (200/200) · 2 get_case (read-only) · 0 update_case ·
0 move · 0 delete · 0 results · 0 runs.
