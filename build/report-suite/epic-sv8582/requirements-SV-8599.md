# SV-8599 — [Reports Suite][B6] Sales By Representative (SBR) report + rep schema + staff dialog

> **Source (pointer only, login-walled):** https://shopview.atlassian.net/browse/SV-8599
> **Ingested:** 2026-07-27 (via Atlassian MCP, live session)
> **Key:** SV-8599 · **Type:** Story · **Epic:** SV-8582 · **PO:** Chris Ward
> **Status:** OBSOLETE · **Relates to report:** SBR
> **Labels:** (none) · **Comments:** 0 · **Attachments:** 0

## Summary
[Reports Suite][B6] Sales By Representative (SBR) report + rep schema + staff dialog

## Description
**Plan:** Reports Suite Tech Plan — Part B / B6. **Spec:** SBR page 585629698. Depends on A2, **A4**, A5. **Complexity: Highest** (net-new rep schema chain + WO field + staff dialog + 4-format export). Built last.

**Scope:**

* DB (net-new, forward-only, NO backfill): `staff.is_sales_rep` BOOLEAN; `work_order.sales_rep_id` (+ index); `invoice.sales_rep_id` + `invoice.sales_rep_name` (+ index). 🔴 **No dual parts/service rep fields exist** (spec build-note describes a dead prototype) — build single-rep chain fresh.
* 🔴 **Identity decision (most bug-prone point):** `work_order.service_advisor_id` = staff.id but `company.sales_rep_id` = user.id. Pick ONE identity for the new rep columns (**staff.id recommended**) + translate customer fallback via `staff.user_id`.
* BE: rep snapshot write at invoice creation (WO rep → customer rep → null); **must NOT recompute in updateInvoice** (immutable). Per-rep rows GROUP BY sales_rep_id; Unassigned pinned top; contributor gate; (Inactive) marker. 🔴 **Payment 5→3 mapping** — `balance_owed ≠ total_balance − paid_balance` (deposits excluded from paid_balance per SV-6616); prepaid branch needs deposit-contribution join or every prepaid invoice misclassifies (coordinate with Minja's payments rewrite). WO rep assignment endpoint (clone ChangeServiceAdvisor); rep selector listing (is_sales_rep=1); staff-deactivation precondition count (keys on user.id). Sales Rep Assignments export stays on legacy JSON-wrapped convention (NOT D5). Summary/Expanded PDF+CSV via A3 scaffold.
* FE: all-white theme, per-rep lazy detail, payment badge (feed MAPPED display key — colorCoding('overpaid') is wrong), responsive grand totals (desktop sticky row / mobile external bar), 4-item export menu. WO "Sales Rep" field in OrderStatusCard.vue (save via mutation, gate Part-Sale WOs). Staff deactivation type-YES dialog (net-new) — 🔴 S13-R8 wants Esc-to-dismiss but Golden Rule #9 forbids Esc — surface as decision. `is_sales_rep` toggle in StaffDialog.vue. Nav at bottom of Performance group + padding fix.

**E2E:** reference-breakage scan + happy paths (expand rep, badge, filter, sort, 4 exports, assign WO rep→credited, assignments CSV) + edge (Unassigned, (Inactive) still credited, deactivation dialog blocks until yes, empty).

Depends on: A2, A4, A5.
