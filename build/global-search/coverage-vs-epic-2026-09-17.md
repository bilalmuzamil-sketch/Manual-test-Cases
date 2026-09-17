# Global Search Enhancement — coverage vs epic SV-9160 non-obsolete stories, 2026-09-17

**Source re-checked LIVE:** PRD 576978945 still **v1.5 / Last Updated 2026-09-08** — unchanged.
**Epic SV-9160 stories re-pulled live 2026-09-17.** OBSOLETE (status): SV-9167 telemetry · SV-9173 quick
actions · **SV-9169 scope tabs/grouped results (flipped OBSOLETE today)** · **SV-9306 page-search cutover
(flipped OBSOLETE today)**.

## Non-obsolete stories → test coverage
| Story | What it is | Covered by (folder) | Verdict |
|---|---|---|---|
| SV-9164 | BE matching / fuzzy | Fuzzy Matching (11) | ✅ covered |
| SV-9165 | BE ranking engine | Ranking and Prioritization (8) | ✅ covered |
| SV-9166 | BE recent-entities API | Recent Activity Default State (5) | ✅ covered |
| SV-9168 | FE modal shell (⌘K, 5 states, focus) | Palette (10) + Empty/First-time (2) + No-Results (2) | ✅ covered |
| SV-9170 | FE entity result rows (9 variants, badges, highlight) | Per-Entity Result Shape (9) + Grouped Results (9) + Purchase Orders (1) + Vendor Invoices (1) | ✅ covered |
| SV-9171 | FE keyboard nav + WCAG 2.1 AA | Palette keyboard cases (C44809–C44813) | ✅ covered |
| SV-9172 | FE recent searches + persisting query | Recent (5) + Persisting Query (3) | ✅ covered |
| SV-9174 | FE integration (debounce, error, page-context) | Error State (1) + contextual bias in Ranking (6726) | ✅ covered (debounce/latency = perf NFR, thin) |
| SV-9162 | BE GET /api/search endpoint | exercised through every UI folder | ✅ indirect |
| SV-9163 | BE search index (backfill/maintenance) | results appear/refresh through the UI | ✅ indirect |
| SV-9161 | Search infra ADR (spike) | infra doc — nothing to manual-test | N/A |
| SV-9175 | QA test plan | this suite IS the deliverable | meta |
| SV-9176 | Direct rollout + old-path removal | C44897 (old global-search path removed) | ✅ covered |
| **SV-9594** | **Show unit number + vehicle on SCHEDULE work orders** | **NOT a global-search screen — Schedule surface** | ⚠️ different suite — confirm the Schedule suite covers it |

Cross-cutting coverage also present: Permissions and Role-Based Scoping (6) → NFR §9; Mobile (6) → §5.6.

## Answer
**For the non-obsolete stories, coverage is complete.** Every live feature story has test cases; the two
BE endpoint/index stories are covered indirectly through the UI behaviour; the only item without a GS test
is **SV-9594, which is a Schedule-screen change, not global search** — it belongs to the Schedule suite.

## 🛑 The real finding — PRD vs epic scope conflict
The epic is being scoped DOWN, but the PRD is not. As of today the epic marks **scope tabs / grouped
results (SV-9169)** and **page-search cutover (SV-9306)** OBSOLETE — joining quick actions (SV-9173) and
telemetry (SV-9167). **But PRD v1.5 (unchanged) still fully describes all of them** — scope tabs and
grouped results (§5.2), page-search (§8), quick actions (§5.4). So the PRD and the epic now DISAGREE on
what is in v1.

**We hold ~33 test cases for these now-obsolete stories** — Scope Tabs (12), Grouped Results (9),
In-Page WO List Search (2), Page-Search Cutover (2), Quick Actions on Hover (8), plus the parked telemetry
case. If those features are truly being cut, those tests cover dead scope; if the stories are merely being
restructured, they remain live. **This is a PO/spec-owner reconciliation (PRD vs epic), not a QA coverage
gap** — surfaced for a decision. No cases changed.
