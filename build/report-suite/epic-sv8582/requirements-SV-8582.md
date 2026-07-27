# SV-8582 — Reporting Suite (EPIC)

> **Source (pointer only, login-walled):** https://shopview.atlassian.net/browse/SV-8582
> **Ingested:** 2026-07-27 (via Atlassian MCP, live session as Bilal Muzamil)
> **Key:** SV-8582 · **Type:** Epic · **Epic:** (self) · **PO:** Chris Ward
> **Status:** Open (To Do) · **Priority:** Medium · **Product Area:** Reports & Dashboards
> **Reporter/Creator/Assignee:** Chris Ward · **QA Assignee:** Nebojsa Glavinic, Viktoria Videnovic
> **Created:** 2026-07-26 · **Updated:** 2026-07-27 · **Comments:** 0 · **Attachments:** 0
> **Branch:** `project/reports-suite-bravo`

## Summary
Reporting Suite — Technician Utilization, Sales By Customer, Sales By Representative, Inventory Velocity, Inventory Value, WIP

## Description

### Epic: Reporting Suite

#### Goal
Ship a consolidated reporting suite of **six** shop-management reports that live under one **Reports** nav, share one visual chassis, and give shops a consistent, drillable, exportable view of labor productivity, customer/rep revenue, parts velocity, inventory value, and open work. Built together so they look and behave as one product, not six bolt-ons.

#### Outcome for shops
- One place to answer: *Are my techs productive? Who are my best customers and reps? What parts actually move? What is my inventory worth? What work is open and how much of it is earned?*
- Every report reads the same way — identifier columns left, financials middle, a bold pinned **Subtotal** far right — so there's nothing to relearn per report.
- Drill in (customer → asset → invoice, tech → line), filter by date range and location, and export the on-screen view to CSV/PDF.

#### The six reports
1. **Technician Utilization** — how much of each technician's available time is productive/billed vs. lost. Tech multi-select filter, deep-link to Timesheet Activities, org-wide location filter.
2. **Sales By Customer** — revenue, margin, and labor-delta per customer with a Customer → Asset → Invoice drill and cross-customer asset compare.
3. **Sales By Representative** — sales grouped by sales rep (parts + service reps), with unassigned/House Account handling.
4. **Inventory Velocity** — parts movement / ABC velocity with per-part profitability (unit cost, sell price, revenue, margin, margin %).
5. **Inventory Value** — current on-hand stock valued at cost and sell (qty on hand, unit cost/sell, margin, margin %, extended Total Sell and pinned Total Cost), with an as-of date backed by nightly snapshots.
6. **Work In Progress (WIP)** — open work orders split into earned vs. remaining (True-WIP accounting model), with summary cards and asset/customer filters.

#### Specs (Confluence, login-walled — pointers only)
- **Technician Utilization** — pages/641400833/Technician+Utilization+Report
- **Sales By Customer** — pages/577634305/SBC+Sales+By+Customer+Report
- **Sales By Representative** — pages/585629698/SBR+Sales+By+Representative+Report
- **Inventory Velocity (Parts Velocity)** — pages/620888066/Parts+Velocity+Report
- **Inventory Value** — pages/720142338/Inventory+Value+Report
- **Work In Progress (WIP)** — pages/703660034/WIP+Work+In+Progress+Report

#### Shared chassis (suite-wide, built once)
- Consolidated **Reports** nav; single visual theme (two-tone Tech-Efficiency).
- **Subtotal** column pinned far-right + bolded across header/rows/totals.
- Shared **Labor Delta ("Inv. Hrs")** treatment where applicable.
- Shared date-range selector, org-wide **multi-location filter** (`AccessibleWorkplaceResolver`, requested ∩ accessible), and per-report **filter persistence**.
- CSV + PDF exports mirror the on-screen view.

#### Out of scope / follow-ups
- Server-side rework to safely offer "All Time" on the history-scan reports (SBC / SBR / Tech Utilization) — per engineering review, All Time stays on WIP only until this lands.
- Parts Velocity row-scale (server-side paging / virtual scroll) before it can offer All Time or handle very large tenants.
- Trend/as-of history views for WIP (snapshot rig is forward-capture, write-only).
- E2E (Playwright) coverage is being authored per report as part of the suite.

#### Branch
- `project/reports-suite-bravo` (local suite worktree; source report branches untouched).

## Change-log note (from Jira changelog)
- **2026-07-26 (Chris Ward):** epic description + summary edited FROM a **five-report** suite TO a **six-report** suite — **Inventory Value** was ADDED as report #5 (between Inventory Velocity and WIP). Earlier revision listed only 5 reports (TU, SBC, SBR, Inventory Velocity, WIP) and had no Inventory Value; also earlier "Documentation" section (per-report Confluence + suite RESUME) was dropped in favor of the explicit Specs link list.
- **2026-07-27 (Bilal Muzamil):** QA Assignee set to Nebojsa Glavinic + Viktoria Videnovic.
