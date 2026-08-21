# BLOCKED — Confluence version INTEGERS for 12 of 13 spec pages

**Status: BLOCKED as at 2026-08-21** (cost-blocked, not access-blocked). Raised by
`build/PROJECT-INDEX-REFRESH-2026-08-21.md` §3.

## What is blocked

Naming the **Confluence version integer** now live on each spec page — the number Rule 42 requires in
`refs` and Rule 54 requires in a provenance line. **Rule 31(a)** bars using the version printed in the
page body: the Filters page currently prints *"Version: 1.8"* while its real integer was **21**.

## What WAS obtained live (so the pages are not unread)

* **`lastModified` for all 13 pages**, via `searchConfluenceUsingCql` — cheap, no page body. Enough to
  prove **every** project's spec has **moved** since our last recorded source check.
* **One version integer, measured: Inventory Value (page 720142338) = Confluence version 10**, against
  our recorded baseline of **v5** — five versions behind, with uningested **2026-08-12** and
  **2026-08-13** change-log entries.
* **The Filters spec page id, previously "TO CONFIRM": `572030978`** (space `SHOPVIEW`).

## Why it is blocked

Atlassian access is **live and working** (`getAccessibleAtlassianResources` → HTTP 200, Confluence read
+ Jira read scopes). The obstacle is **cost**: the only MCP call that returns `version` is
`mcp__Atlassian__fetch`, which returns the **entire page body** with it. Inventory Value — one of the
shorter specs — cost roughly **8,000 tokens**. Thirteen pages is therefore a task of its own, not a
line item inside an index refresh, and reading twelve of them would have crowded out the rest of this
pass.

## Exactly what is needed — any one of these

1. **A dedicated pass** whose whole budget is the 12 pages: fetch each, record the integer, diff
   against our baseline, and emit the Rule-43 per-requirement verdict rows. This is the right answer,
   because the diff is owed anyway.
2. **An Atlassian API token in `/tmp`** (never committed), which makes
   `GET /wiki/api/v2/pages/{id}?body-format=` a body-free version read — cheap enough to run in any
   pre-flight.
3. **An MCP call that returns metadata without the body**, if one is added.

## The pages still owed an integer

Filters 572030978 · Schedule 713031682 · Global Search 576978945 · SBC 577634305 · SBR 585629698 ·
Parts Velocity 620888066 · Technician Utilization 641400833 · WIP 703660034 · Simple Flow 646021121 ·
Fees & Discounts 622297094 · Custom Roles 565116952. (Inventory Value 720142338 = **v10**, done.)
