# SV-8685 — Schedule — Technician Scheduling Module

- **Key:** SV-8685
- **Type:** Epic
- **Status:** Open
- **Labels:** (none)
- **Parent/Epic:** SV-8685
- **Priority:** Medium
- **Canonical Jira URL:** https://shopview.atlassian.net/browse/SV-8685

## Issue links
- relates to: SV-8038 — Schedule rejects WO drop in first two time columns [Done]
- relates to: SV-5339 — Regression BUG-Scheduler scroll position shifts when changing dates [Open]
- relates to: SV-8048 — Custom role with only Schedule View + Create & Edit: "Access restricted" on login (must click Schedule); newly created events disappear; "Assign to existing work order" fails with fetch error and persistent Access restricted until logout + new tab [Ready to Fix]
- relates to: SV-8558 — Schedule: Add week/month calendar view (not only single-day view) with broader timeframe visualization [OBSOLETE]
- relates to: SV-5737 — FR: Support 15-Minute Scheduling Increments with Start & End Times [Board Backlog]
- relates to: SV-3550 — Schedule enhancement requests - multiple in ticket [Board Backlog]
- relates to: SV-3397 — Scheduler Enhancements Round 3 [Board Backlog]
- relates to: SV-5735 — FR: Automatically Assign Work Order Lines When Technician Is Scheduled [Board Backlog]
- relates to: SV-3620 — 7. Department enhancement - Schedule [Board Backlog]
- relates to: SV-5331 — FR – Add Reminders and Team Tags for Custom Schedule Events [Open]

## Description

## Problem Statement

Heavy-duty shops manage dozens of open work orders simultaneously, each with multiple repair lines requiring different technicians and hours. Without a dedicated scheduling tool, managers rely on memory, whiteboards, or ad-hoc spreadsheets, which leads to double-bookings, overtime surprises, and unbalanced workloads across the team.

## Goal

A single-screen, drag-and-drop scheduling interface that assigns technicians to work order lines across days and weeks, respects technician capacity, surfaces conflicts, and keeps the work order system of record in sync. Success means near-zero scheduling conflicts, under 30s per shift creation, and 80% shop adoption within 90 days.

## Scope

### Included

- Visual calendar grid with day, week, and month views

- Work order sidebar with search, filters, and line drill-down

- Drag-and-drop scheduling with scope picker for multi-line WOs

- Multi-day spread scheduling for large jobs (40–160+ hours)

- Linked series with connected banners and series-aware deletion

- Shift block anatomy with consistent labeling

- Overlap and lane stacking (3-lane cap with +N overflow)

- Day view timeline interactions (horizontal drag, edge resize, 15-min snap)

- Shift detail modal with tooltips, notes, color, reassignment

- Events (non-WO time blocks: meetings, training)

- Conflict detection (double-booked, weekend, before/after hours)

- Capacity visualization (aggregate bars, per-tech OT tag)

- Working hours settings (business hours + technician hours)

- View options, color system, and display customization

- Schedule permissions (View / Edit / Delete tiers)

### Deferred

- Technician availability and PTO blocking

- Auto-scheduling (optimal tech assignment suggestions)

- Recurring events (repeating calendar blocks)

- Skill matching (certification warnings)

- Spread around existing bookings (auto-flow around booked days)

- Long-job cap (single assignment span instead of daily shifts)

## Stories (ordered)

- Schedule Grid Layout & Navigation — Core grid with day/week/month views, department rows, toolbar

- Work Order Sidebar & Mini Calendar — WO card list, search, filters, line drill-down

- Drag-and-Drop Scheduling & Shift Creation — DnD from sidebar, shift start-time hierarchy, unassigned shifts

- Scope Picker — Multi-line WO scope selection (whole order, single line, multi-select)

- Shift Block Anatomy & Scope Labeling — Three-line block format, default blue color, conflict icon

- Multi-Day Spread Scheduling — Hour distribution across working days, skipping weekends

- Linked Series & Banners — Connected banners in month/week/day, series-aware deletion

- Overlap & Lane Stacking — Stacked lanes for overlapping shifts, 3-lane cap, +N overflow

- Day View Timeline Interactions — Horizontal drag, edge resize, auto-scroll, sticky headers, now line

- Shift Detail Modal & Hover Tooltips — Full detail panel, reassignment, tooltips with quick peek

- Events — Non-WO time blocks, left-click creation, event card anatomy

- Conflict Detection — Double-booked, weekend, before/after hours scanning and toolbar pill

- Capacity Visualization — Aggregate capacity bars, amber spill, per-tech OT tag

- Working Hours Settings — Business hours and tech hours editors with overlap validation

- View Options, Color System & Display Customization — Filters, toggles, colors, dark theme, keyboard shortcuts

## Key Decisions

- Stories are functional units (no BE/FE splits)

- All shift blocks default to blue; custom colors are optional per shift

- Weekends are skipped by spread scheduling only when business hours are not set for them; shop closures/holidays are not skipped in V1

- Events are not conflict-checked against shifts or other events

- "My Shifts" is a personal convenience filter, not a permission boundary

- Grid rows are department-based (staff record), not role-based

## Related Issues

SV-8038

Done 

, 

SV-5339

Open 

, 

SV-8048

Ready to Fix 

, 

SV-8558

OBSOLETE 

, 

SV-5737

Board Backlog 

, 

SV-3550

Board Backlog 

, 

SV-3397

Board Backlog 

, 

SV-5735

Board Backlog 

, 

SV-3620

Board Backlog 

, 

SV-5331

Open

## Comments (0)

(none)

## Attachments (0)

(none)
