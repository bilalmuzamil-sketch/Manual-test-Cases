# SOURCE-CURRENCY — Filters, SV-9279 update check (2026-08-18)

**Pass:** Source-currency + reconciliation triggered by the QA lead's heads-up that Jira story
**SV-9279 was UPDATED TODAY (2026-08-18)**. Filters project, epic **SV-8785**, PO **Branko Cicovic**,
TestRail group **4110**. **Build verification DEFERRED** — the app was not opened (Standing Rule 69).

**Pass folder:** `build/filters/sv9279-2026-08-18/` · oplog + deliverables here (Standing Rule 29 / core §8).

**Git:** `git fetch origin claude/slack-session-0sxnd9` done at pass start; working tree at remote HEAD
`96ab1794` (fast-forward, no divergence).

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31 — every source, per-source verdict)

| # | Source | Identifier | Version / last-changed (LIVE) | Checked (UTC) | Verdict |
|---|---|---|---|---|---|
| 1 | **Trigger story SV-9279** | Jira `SV-9279` | **content unchanged since creation 2026-08-14; today's edit is STATUS ONLY** (changelog below) | 2026-08-18 | **CURRENT** — read live |
| 2 | **Filters spec** | Confluence page `572030978` "Filters" | **version 21, published 2026-08-14T13:00:13Z** | 2026-08-18 | **CURRENT** — we hold v21; did **NOT** move today |
| 3 | **Epic + children** | Jira `SV-8785` "Filters" (Epic, status Open) | **34 children** (list below); SV-9279 present as a child | 2026-08-18 | **CURRENT** — child set read live, two ways implicitly (parent query + SV-9279's own parent field) |
| 4 | **Designs (Figma)** | Figma nodes cited on the Parts/Reports cases (11884-16885, 11903-10573, 11903-10461) | not re-fetched this pass (SV-9279 is a text-only rollout story; no design delta implicated) | — | **PARTIAL (not re-checked)** — no design change is implicated by SV-9279; the per-view filter inventory it depends on is engineering data, not a design frame |
| 5 | **Tech plan / PO answers** | tech plan 2026-07-29; Branko answers 2026-07-31 + 2026-08-04 | already ingested; SV-9279 adds no PO answer | 2026-08-18 | **CURRENT** for this trigger |

**Staleness-marker note (Rule 31 traps):** the SV-9279 "updated" timestamp moved to **2026-08-18** —
but that is trap (b): the changelog shows the move is a **status transition**, not a content edit.
The Confluence page's **version number 21** (not the in-body one) confirms the spec is unchanged.

---

## SV-9279 — what it is, verbatim

- **Key / type / parent:** SV-9279 · **Story** (issuetype 10245) · parent **SV-8785** (the Filters epic).
- **Summary:** *"Roll the filter layout out to all other pages"*
- **Status (live):** **Ready for QA** (moved there today).
- **Created:** 2026-08-14T08:37:14 −0500 · **Updated:** 2026-08-18T03:24:47 −0500.
- **Assignee:** Dusan Radulovic (set 2026-08-17).
- **Description (verbatim, unchanged since 2026-08-14):**
  > *"Applies the toolbar-row layout, the chip component and the shared panel types to every remaining
  > page with a filterable table — all Parts views, all Reports, Customers, Administration — including
  > pages with no design of their own. Each page keeps the filters it has today; no filter is added or
  > removed. Blocked on the per-view inventory of existing filters from engineering."*
  > *PRD: Story 1: Filter Layout & Visibility*
- **Comments:** 0.

## SV-9279 changelog (LIVE, all 4 entries — Standing Rule 37 Tier-1)

| When (−0500) | By | Field | From → To |
|---|---|---|---|
| **2026-08-18 03:24:47** | Branko Cicovic | **status** | In Progress → **Ready for QA** |
| **2026-08-18 03:24:06** | Branko Cicovic | **status** | Open → In Progress |
| 2026-08-17 06:51:18 | Branko Cicovic | assignee | (none) → Dusan Radulovic |
| 2026-08-14 08:37:14 | Branko Cicovic | IssueParentAssociation | (none) → SV-8785 (created under the epic) |

**⇒ TODAY'S EDIT (2026-08-18) IS A STATUS MOVE ONLY** (Open → In Progress → Ready for QA). There is
**no** description / acceptance-criteria / summary change today, and none since the story was created on
2026-08-14. **Per Rule 37 Tier-1 / Rule 31 trap (b): admin-only edit — the "updated" date moved for a
status transition, not a requirement change.**

---

## Epic SV-8785 — 34 children (LIVE 2026-08-18)

Original 14 stories SV-8786–SV-8799 (all QA Complete / Ready for QA / TESTING QA) + tasks
SV-8825/8876/8901/8904/8906/9041/9076 + a **redesign wave** added mid-August:
**SV-9268** (chips into toolbar row) · **SV-9269** (remove collapse toggle) · **SV-9270** (reduce WO
filters) · **SV-9271** (Assigned to Me) · **SV-9272** (WO tab model) · **SV-9273** (chip inline clear) ·
**SV-9274** (remove global Clear filters) · **SV-9275** (Asset on Site single-select) · **SV-9276**
(filter panel types) · **SV-9277** (shared-link banner) · **SV-9278** (mobile stacked rows) ·
**SV-9279** (this story) · **SV-9322** (Estimates tab ordering).

**Scope note:** this pass is SV-9279-specific per the trigger. The redesign wave was already reconciled
into the suite at **spec v21 on 2026-08-17** (the two SV-9279-citing cases and the Parts/Reports
rollout cases were authored/updated that day citing v21 + the specific stories). The wave's continued
existence is recorded here as an observation; it is **not** re-reconciled here (Rule 72 — no autonomous
scope expansion).
