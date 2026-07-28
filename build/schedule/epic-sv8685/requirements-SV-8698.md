# SV-8698 — Capacity Visualization

- **Key:** SV-8698
- **Type:** Story
- **Status:** Open
- **Labels:** (none)
- **Parent/Epic:** SV-8685
- **Priority:** Medium
- **Canonical Jira URL:** https://shopview.atlassian.net/browse/SV-8698

## Description

## Summary

Per-day capacity bars in column headers show aggregate utilization at a glance, with overtime detection per technician — so managers can see which days are overloaded before problems occur.

## Context

Capacity bars appear in day column headers when enabled via View Options (on by default). Event time counts toward utilization. Overtime is a per-technician signal independent of aggregate fill.

## Requirements

- Blue fill: aggregate technician-hours booked (shifts + events) / total available (sum of all techs' working hours). Clamped at 100%. Track width equals capacity and is identical across all days. — ( PRD: §4.12 )

- Amber spill: when aggregate exceeds capacity, amber segment extends past the right edge with a tick at 100%. — ( PRD: §4.12 )

- "OT" tag: appears when any individual technician exceeds their daily hours, even if aggregate is under capacity. Text tag, not color-only. — ( PRD: §4.12 )

- Hover tooltip: per-technician breakdown (assigned vs capacity), overtime technicians highlighted in amber. — ( PRD: §4.12 )

- Capacity Bars toggle in View Options (default: on). — ( PRD: §9 )

## Acceptance Criteria

- Given 5 techs with 8h each (40h total) and 32h booked, when the capacity bar renders, then blue fill shows 80%.

- Given 45h booked against 40h capacity, when rendered, then amber spill extends past the 100% tick.

- Given Tech A has 10h booked on an 8h day but aggregate is 35/40h, when rendered, then the "OT" tag appears even though aggregate is under capacity.

- Given the user hovers the capacity bar, when the tooltip appears, then it lists each tech's assigned vs capacity hours.

- Given a 2h meeting event for Tech B, when capacity is calculated, then those 2h count toward the aggregate.

- Given Capacity Bars toggle is off, when viewing the grid, then no capacity bars appear in column headers.

## UI/UX

Schedule Design

## Comments (0)

(none)

## Attachments (0)

(none)
