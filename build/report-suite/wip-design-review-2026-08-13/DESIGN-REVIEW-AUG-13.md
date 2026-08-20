# WIP (Work In Progress) Report — Summary Strip Design Review, 13 August 2026

**SOURCE OF RECORD for the Story-5 "Summary Strip" reconciliation.** This is an
AUTHORITATIVE design source (Standing Rule 57, amended 2026-08-06: the design is a
source of expected behaviour) and the **LATEST authoritative source** (Rule 32), so it
prevails over the earlier WIP specification wording where they differ.

## Provenance
- **Artifact link:** https://claude.ai/code/artifact/42c35f46-2796-467e-9723-7daa5385446e
- **What it is:** the Aug-13 Claude design review = the Loom review call (Chris Ward +
  Fabian, 11 August 2026) + names locked in Slack + Chris Ward's decisions of 12/13
  August 2026.
- **Epic:** SV-8582 · **WIP spec:** Confluence pageId 703660034 (v24, Atlassian-SSO
  walled — the design review is the ratified detail we hold; do NOT fetch the URL).
- **A screen recording of the review exists but is NOT stored in this repo.**

## Resolved before build (locks — 2026-08-13)
- The **Remaining Work** tooltip was re-worded in the review call and **Fabian signed
  off** the re-worded version — the text below is FINAL.
- The **Estimates** tooltip is LOCKED (verbatim below).
- WIP and Inventory Value both move to a single **"as of" date picker** (range presets
  hidden); snapshot-backed.
- **Tab NAMES stay this wave** (only the summary-figure names and the strip layout change).

## FINAL summary-strip boxes — new NAME (was old name) + LOCKED tooltip (verbatim)

| # | Final name | Was (old name) | Locked tooltip (verbatim) |
|---|---|---|---|
| 1 | **Total Completed Work** (the hero) | Total Earned | The total value of all completed work order lines that have not yet been invoiced, including completed lines on work orders that are still in progress and work orders where all work is complete. |
| 2 | **Remaining Work** | Total Remaining | The total value of all approved work that has not yet been completed, including work orders that have not started and incomplete work order lines on work orders already in progress. |
| 3 | **Work Orders Not Started** | Not Started | The total value of approved work orders where no work has started yet. |
| 4 | **Completed Work on Open Work Orders** | Started — Earned | The total value of completed work order lines on work orders that are still in progress. |
| 5 | **Remaining Work on Open Work Orders** | Started — Remaining | The total value of incomplete work order lines on work orders where work has already started. |
| 6 | **Work Orders Ready to Invoice** | Ready to Invoice | The total value of work orders where all work order lines are completed and the work order is ready to be invoiced. |
| 7 | **Estimates** (name unchanged) | Estimates | The total value of all estimate lines that have not yet been approved, including lines awaiting authorization on open work orders. |

- **Box 2 "Remaining Work":** the tooltip above is the FINAL re-worded version Fabian
  signed off in the review call.
- **Box 7 "Estimates":** now **UN-GREYED / full opacity** (was muted), and counted
  **PER LINE** including needs-authorization lines on open work orders.

## Grouped math strip (two boxed equations, plus/equals signs; Estimates sits apart)
- **Completed Work on Open Work Orders  +  Work Orders Ready to Invoice  =  Total Completed Work**
- **Work Orders Not Started  +  Remaining Work on Open Work Orders  =  Remaining Work**
- **Estimates** sits apart from the two equations.

On-screen left-to-right order (from the grouped math + live evidence
`build/report-suite/spec-deltas-2026-08-19/wip-story5-live-evidence-2026-08-20.md`,
build v3.8-d0e135e, 2026-08-20): Completed Work on Open Work Orders · Work Orders Ready
to Invoice · Total Completed Work · Work Orders Not Started · Remaining Work on Open
Work Orders · Remaining Work · Estimates.

## Other decisions from the review (scope split noted per item)
- **Tab click highlights its widgets:** selecting a bucket tab puts a faded **amber
  glow behind the composing widget(s)** — "Approved - partially completed" → both
  Open-Work-Orders widgets; "Approved - not started" → Work Orders Not Started;
  "Completed" → Work Orders Ready to Invoice; "Estimates" → Estimates. Tab NAMES stay
  this wave. *(This is a NEW behaviour — see RECOMMENDED-NEW-CASES.md item 1. Note the
  glow is behind the WIDGETS, not the tab element.)*
- **Labels wrap to two rows** (no mid-word truncation). *(New — RECOMMENDED-NEW-CASES.md.)*
- **Asset column** hides the "(no unit #)" placeholder — shows VIN alone when no unit #.
- **Date range → single "as of" date picker** (range presets hidden); snapshot-backed.
  Same on Inventory Value.
- **F&D shared Adjustments column on WIP and SBC** (WO-level fees +, discounts −;
  line-level F&D stays in its line's Labor/Parts). **WIP:** Adjustments is a whole
  amount; **Total = Earned + Remaining + Adjustments**. **NO Adjustments tile in the
  summary strip.** Chris decided 2026-08-12/13: WIP Total includes adjustments;
  Estimate / Estimates-tab totals include F&D; scope stops at WIP + SBC this wave.

## Live corroboration
Prior read-only live observation `build/report-suite/spec-deltas-2026-08-19/wip-story5-live-evidence-2026-08-20.md`
(build **v3.8-d0e135e**, 2026-08-20) shows all seven final names, the seven locked
tooltips byte-for-byte, and the two grouped equations rendered with + and = operators,
with the arithmetic tying out. Re-probed 2026-08-20 in this pass: the build marker is
still **v3.8-d0e135e** (last-modified Wed 19 Aug 2026 13:27:07 GMT, etag
`aa6ea37f82dd0af1b3fe6da5dfd65573`), i.e. NO redeploy since the evidence was captured —
so that evidence is against the build now running. The authenticated staging session is
dead (401), so nothing new was driven live in this pass; the expected behaviour written
into the cases comes from THIS design review (a document — Rule 57), never from the build.
