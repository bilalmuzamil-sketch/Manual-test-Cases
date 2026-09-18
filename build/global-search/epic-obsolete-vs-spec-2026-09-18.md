# Global Search — obsolete epic tickets vs. live spec (2026-09-18)

Epic **SV-9160**, children read LIVE 2026-09-18 (Jira). Spec = PRD **576978945**, **Last Updated
2026-09-08, v1.5** (body read live 2026-09-17; decision-log comments newest 2026-08-20; Claude Design
`fac6efcf` is an undated share link).

## Tickets in OBSOLETE status (5)
| Ticket | Type | Title | Status |
|---|---|---|---|
| SV-9167 | Story | Search telemetry: search_event schema + impression/click logging | OBSOLETE (Done) |
| SV-9169 | Story | FE — Scope tab strip with live counts, grouped results, and scoped-tab load-more | OBSOLETE (Done) |
| SV-9173 | Story | FE — Contextual quick actions on result rows | OBSOLETE (Done) |
| SV-9306 | Story | BE — Page search cutover (WO / Inventory Parts / Customers list search on the search tier) | OBSOLETE (Done) |
| SV-9310 | Task (QA verify) | Verify Phase 4 — search modal: states, rows, keyboard, persistence, quick actions | OBSOLETE (Done) |

## Cross-check: obsolete in the epic BUT still live in the spec/sources
| Ticket | Obsolete in epic? | Still in the spec/sources? | Verdict |
|---|---|---|---|
| **SV-9167** telemetry | Yes | **No** — PRD v1.5 change log: "Telemetry removed entirely"; §2 lists it as a Non-Goal. | **Consistent** — obsolete in both. No mismatch. |
| **SV-9169** scope tabs / grouped results / counts | Yes | **YES** — §5.2 still requires the scope tab strip, per-tab counts and grouped results. Only the "scoped-tab load-more" sub-part is genuinely dead (v1.4 dropped pagination; scoped tab shows up to 20, no load-more). | **MISMATCH** — the ticket is retired, but the scope-tab / grouped-results / counts behaviour is a live requirement. (Covered by our Scope Tabs + Grouped Results folders.) |
| **SV-9173** quick actions on rows | Yes | **YES** — PRD v1.3 change log: "Quick actions are back in v1 scope for every entity, shown unconditionally"; §5.4 and §8 describe them as in-scope for v1. (Engineering flip-flopped: 2026-08-12 "move to v2" → 2026-08-17 "ship in v1 per the design".) | **MISMATCH** — spec keeps quick actions in v1, ticket is obsolete. (Ties to the open PO question on quick-action permission gating; our quick-actions cases sit in the excluded 6774 folder.) |
| **SV-9306** page-search cutover | Yes | **YES (in the decision log)** — engineering comment 2026-08-12: "global search and page search will run on the same search engine and behave identically — same matching, typo tolerance, permissions." The PRD body no longer details it (old §10/§11 were deleted). Note: the *verify* task for it, SV-9311, is still open (Board Backlog) — so the epic contradicts itself. | **MISMATCH / UNCLEAR** — behaviour still described in sources and a live verify task exists, yet the build story is obsolete. Needs a PO/eng confirmation whether page-search cutover ships in v1. (Covered by our Page-Search Cutover folder.) |
| **SV-9310** verify Phase 4 | Yes | n/a — a QA verify TASK, not a product story. Its content (modal states/rows/keyboard/persistence/quick actions) is live in the spec, but the task itself was superseded (our own suite + newer verify tasks). | Housekeeping — not a spec-behaviour mismatch. |

## Summary
- **3 stories are obsolete in the epic while their behaviour is still required by the spec/sources:**
  **SV-9169** (scope tabs, grouped results, counts), **SV-9173** (quick actions), **SV-9306** (page-search cutover).
- **1 story is consistently obsolete** (SV-9167 telemetry — also out of scope in the spec).
- **1 obsolete item is a QA verify task** (SV-9310), not a product story.
- Our suite already covers the live behaviour behind SV-9169 (Scope Tabs 6722, Grouped Results 6723)
  and SV-9306 (Page-Search Cutover 6737). SV-9173's quick-actions cases sit in the EXCLUDED folder 6774
  and carry the open PO question on permission gating.
