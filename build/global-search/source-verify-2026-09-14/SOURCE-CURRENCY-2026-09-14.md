# Global Search — SOURCE CURRENCY CHECK, 2026-09-14

**Trigger:** QA lead asked to start source verification for the Global Search suite and confirm the
sources are up to date. Scope note from the QA lead: **do NOT touch** the four folders shown in his
screenshot — "Out of V1 Scope" (sec 6767), "V1 Regression Suite" (sec 6769), "Quick Actions on Hover
(v1)" (sec 6774), "V1 Regression (derived from V1 automated tests)" (sec 8056).

**Last full source-verify:** 2026-09-09, against spec **v1.5** (five-dimension gate, all clean).

## 1. Sources pulled LIVE today (Rule 100/108)
| Source | Live state today | vs last verify (9/9) |
|---|---|---|
| PRD — Confluence **576978945** "Global Search - Product Requirements" | **v1.5, Last Updated 2026-09-08**, author Branko Cicovic; full body + Change Log read | **UNCHANGED** (9/9 was already v1.5 / 9-8) |
| PRD footer comments (Q&A, Rule 108) | 5 threads, newest **2026-08-20** | UNCHANGED — nothing new since 8/20 |
| Epic **SV-9160** (Open) | Updated **2026-09-02**; spec + Claude Design links confirmed | UNCHANGED |
| Child stories | dev-progress moves only, EXCEPT the two below | see §2 |
| Design | Claude Design prototype **fac6efcf** (3 files) linked in PRD header + epic | reference unchanged |

**⇒ The primary source (PRD v1.5) has NOT moved since the 2026-09-09 full verify.** The 90 verifiable
V2 cases were source-verified against this exact spec five days ago; nothing in the spec requires a
re-stamp today.

## 2. Two movements since 9/9 (both from the epic's children, not the PRD)
- **Quick actions on hover — now OBSOLETE / deferred.** Story **SV-9173** "FE — Contextual quick actions
  on result rows" moved to status **OBSOLETE** (updated 2026-09-10), and epic SV-9160's Out-of-scope now
  reads "Contextual quick actions on hover (design-confirmed, later release)." **This conflicts with PRD
  v1.5 §5.4**, which still lists quick actions in v1. **All quick-action cases sit in the EXCLUDED folder
  "Quick Actions on Hover (v1)" (sec 6774, 8 cases) — untouched per the QA lead's instruction.** Flagged
  for a decision, not changed. (Latest-wins, Rule 32, would defer them; but the PRD is the primary spec and
  still says v1 — a PO/spec reconciliation item.)
- **New bug SV-10031 (2026-09-14, Open):** "Part Sales: creating a new Part Sale throws a server error
  (Sentry)…". A defect ticket under the epic, not a spec change. Relevant to Part Sales test *execution*
  when a build exists; no source impact.

## 3. TestRail scope (live counts, suite 1)
- **Verifiable V2 cases (ours, created_by=3): 90** — secs 6721 Palette(10), 6722 Scope Tabs(12),
  6723 Grouped Results(9), 6724 Per-Entity Shape(9), 6725 Fuzzy(11), 6726 Ranking(8), 6727 Empty(2),
  6728 Recent(5), 6729 Persisting(3), 6730 No-Results(2), 6731 Hover Quick-Actions(0), 6732 In-Page WO(2),
  6733 Error(1), 6734 Permissions(6), 6736 Contacts v2(0), 6737 Page-Search Cutover(2), 6738 Mobile(6),
  6739 Purchase Orders(1), 6740 Vendor Invoices(1), 6768 Search Telemetry(0).
- **EXCLUDED per QA lead (untouched): 72** — 6769 V1 Regression Suite(62), 6774 Quick Actions(8),
  6767 Out of V1(1), 8056 V1 Regression derived(1).
- **Foreign (Vladimir, created_by=1): 8** in parent sec 49 — hands-off (Rule 38).
- No Automated cases among ours (all atm=1). No build exists (Rule 85) — source-verify only.

## 4. Conclusion
Sources are **CURRENT** (PRD v1.5 unchanged since the 9/9 full verify). The 90 verifiable cases are
already source-verified against the live spec. No re-stamp needed. Two edge findings flagged (quick-actions
deferral conflict — excluded folder; new Part Sales bug). Awaiting the QA lead's steer on whether to also
re-run the full case-by-case five-dimension gate over the 90, given the spec has not moved (Rule 80).
