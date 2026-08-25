# Global Search — Revival Reconciliation (2026-08-21)

**Revival, not greenfield (skill 15 §7).** An 86-case suite was authored 2026-07-16 against PRD page
576978945 (then 6 entities, Show-all link, "Search or ask a question", desktop only), postponed
2026-07-27, never pushed (all C-IDs blank). The QA lead has now assigned Global Search with a **v2
"Unified Search Framework" tech plan**, the **epic SV-9160** (24 children: 16 stories + page-cutover +
7 verify tasks), and the current **PRD (Confluence v8, in-body v1.1, mobile added 8/19)**. PO **Branko
Cicovic**.

## Source currency
- PRD page 576978945 is the SAME page the 86 were built from; now Confluence v8 / in-body v1.1.
- The tech plan is **Product-backed** (Branko's PRD v1.1 + a new 9-entity claude.ai design + resolved
  PRD comments, 2026-08-17/19) and explicitly supersedes stale PRD **body** text. Per Rules 32/57
  (latest authoritative source wins; design + PO answers are sources), v2 governs; the PRD body §2/§4/
  §5.1/§5.2/§6.4 is **stale and mid-edit by Product**.

## What changed v1 (2026-07-16) → v2 — and the case impact

| Area | v1 (86 cases) | v2 (now) | Action |
|---|---|---|---|
| Entity set | 6 (WO, Customers, Assets, Parts, Vendors, Part Sales) | **9** — adds **Contacts, Purchase Orders, Vendor Invoices**; Parts = **inventory** not catalogue | **NEW:** GS-CON-01, GS-PO-01, GS-VI-01; flagged GS-ENT-06/HOVER-04 (inventory) |
| Overflow | "Show all N" link | **Tabs-only**, scoped full list + cursor load-more (D15) | **NEW:** GS-TAB-09; **SUPERSEDES** GS-GRP-03/04 |
| Placeholder | "Search or ask a question" | **Plain search copy, no AI** (D5/D17) | flagged GS-KEY-01/EMPTY-01 |
| Group order | 6-entity order | **9-entity D16 order** | **NEW:** GS-GRP-08; flagged GS-GRP-01 |
| Quick actions | v1 hover set | **Reinstated D18 set** incl. PO→Receive, Part Sale→Add part | **NEW:** GS-HOVER-08 |
| Permissions | 6-entity scoping | **9-entity bundle map + See-Financial-Data masking** (NFR-004/005) | **NEW:** GS-PERM-06; **SUPERSEDES** GS-PERM-01..05 (scope) |
| Recents | UI/bucketing | **Recent-entities API** (touch/get, 30-day, dedup, permission-filtered, deletes excluded) | **NEW:** GS-RECAPI-01 |
| Page search | 2 in-page WO cases | **Cutover: WO/Parts/Customers list served by the unified engine** (Phase 5) + old path removed, no flags | **NEW:** GS-CUT-01/02 |
| Mobile | none | **Mobile design added 8/19** (FR-022) | **NEW:** GS-MOB-01 (HELD — 4 open layout points) |
| Telemetry | PRD §6.4 "schema day 1" | **Deferred to v2 (D20)** | no case (correctly absent) |

## Result
- **11 new v2 delta cases authored** (GS-CON/PO/VI/TAB-09/GRP-08/HOVER-08/PERM-06/RECAPI/CUT-01/CUT-02/MOB-01).
- **13 existing cases flagged** with a v2-supersession note (Show-all, placeholder, catalogue, 6-entity
  permission/group/tab). Their retire/rewrite is the **QA lead's call** (skill 15 §7) — not done
  unilaterally, especially as the PRD body is mid-edit by Product.
- Total suite: **97 cases** (86 v1 + 11 v2 delta); import + id-map regenerated (all C-IDs blank — never pushed).
- The 86 v1 cases' CORE (palette open/close/keyboard, fuzzy §7, ranking §6 signals, result-row anatomy,
  states, API endpoint) remains valid under v2 and is retained.

## Recommendation to the QA lead
1. Confirm the **retire/rewrite set** for the 13 flagged v1 cases (Show-all, ask-a-question, 6-entity
   scope) so I can finish the rewrite in one pass.
2. Answer the PO questions (PO-GS-1..4) — several are Product's own pending edits.
