# HANDOFF → Build Verification: Global Search (Enhancement, Aug 2026) — 2026-09-16

**Source gate is satisfied — clear to build-verify.** Confirm from committed evidence (Rule 86):
`build/global-search/source-verify-2026-09-16/SOURCE-VERIFY-2026-09-16.md`.

**Spec:** PRD **576978945 v1.5** (Last Updated 2026-09-08), unchanged since the 2026-09-09 full verify;
Q&A comments unchanged (newest 2026-08-20). Design: Claude Design `fac6efcf`.

**Scope to build-verify — 91 cases**, sections: 6721 Palette · 6722 Scope Tabs · 6723 Grouped Results ·
6724 Per-Entity Shape · 6725 Fuzzy · 6726 Ranking · 6727 Empty/First-time · 6728 Recent · 6729 Persisting ·
6730 No-Results · 6731 Hover Quick-Actions (0 cases) · 6732 In-Page WO List · 6733 Error · 6734 Permissions ·
6736 Contacts v2 (0) · 6737 Page-Search Cutover · 6738 Mobile · 6739 Purchase Orders · 6740 Vendor Invoices ·
6767 Out of V1 Scope (C45140, EXCLUDED — do not execute) · 6768 Search Telemetry (0).
All read "read on 16 September 2026", spec v1.5, `AUTOMATION: Not available on Build to test Yet`.

**EXCLUDE — do not verify or touch:** 6769 V1 Regression Suite · 6774 Quick Actions on Hover (v1) ·
8056 V1 Regression derived. (These are the 3 red-boxed folders.) Vladimir's cases in parent section 49 are
hands-off (Rule 38).

**Watch-outs on the build:**
- No QA build was observed during source verification, so on-screen labels/routes are PROVISIONAL — read
  the real labels off the build and finalise (Rule 18/102).
- V2 search runs on **OpenSearch**, not the app DB (records are copied in; a new record takes a moment to
  become findable; search can be down while the rest of the app works). Seed, then allow index lag.
- C44900 (Vendor Invoices) expects a **tri-state** badge (Paid / Partially paid / Unpaid) per the
  engineering decision; the PRD body still says Paid/Unpaid — read the build label and treat any mismatch
  as the documented tri-state expectation.
- Quick-actions-on-hover is a live spec-vs-ticket conflict (PRD v1 vs SV-9173 obsolete) — but those cases
  are in the excluded folder, so it does not affect this pass.

Run **R415** holds the suite. No source blocker.
