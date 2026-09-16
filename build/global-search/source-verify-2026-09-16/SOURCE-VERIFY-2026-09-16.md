# Global Search (Enhancement, Aug 2026) — FULL source verification, 2026-09-16

**Order (QA lead):** source-verify ALL cases of "Global Search - Enhancement (Aug 2026)" EXCLUDING the
three red-boxed folders; then hand off to build verification. **Scope = 91 cases** (all created_by=3,
none Automated, 0 Vladimir).

**Excluded (3 folders, per screenshot):** "Global Search V2 - V1 Regression Suite" (6769),
"Quick Actions on Hover (v1)" (6774), "Global Search V2 - V1 Regression (derived from V1 automated tests)"
(8056). **Included this pass** (differs from the 2026-09-14 exclusion): "Global Search - Out of V1 Scope"
(6767, 1 case = C45140) and "Search Telemetry" (6768, 0 cases).

## Sources pulled LIVE 2026-09-16 (Rule 100/108)
- **PRD 576978945** — **v1.5, Last Updated 2026-09-08, lastModified Sep 08** — full body + change log read.
  **UNCHANGED** since the 2026-09-09 full five-dimension verify and since the 2026-09-14 currency check.
- **Footer comments (Q&A)** — 4 threads, newest **2026-08-20**. UNCHANGED.
- Epic SV-9160 / design (Claude Design fac6efcf) — reference unchanged (per 2026-09-14 record).

## Verification result — 0 content changes; 91 re-stamped
The 91 cases were verified against v1.5 on 2026-09-09 (five-dimension gate, all clean); the spec has not
moved since, so their Expected behaviour is still correct. Re-confirmed today by a stale-vs-v1.5 wording
scan (Sublet/Invoice-type, Contacts-as-own-group, created-in-90-days, full-page-results, quick-create
empty state, telemetry-in-a-v1-case) — every flagged case was found to correctly assert the ABSENCE of the
removed feature (spot-checked C44826, C44814, C44855, C44864, C44900). C45140 correctly parked as
"EXCLUDED FROM V1 — telemetry deferred (SV-9167 to v2)".
- **90 of 91 were last edited 2026-09-14** by the parallel parity / Rules-110-111 pass (plain-words keys,
  seed notes) — that shape work did not diverge the Expected from v1.5.
- **Action taken: read-date re-stamped 9 Sep → 16 September 2026 on all 91** (currency deliverable, Rule
  54/101). No steps/expected/title/marker/automation changes. All verified `markdown fr-view`, marker last
  (sample across every subsection). Run R415 membership unchanged.

## Carried findings (not blockers; unchanged from 2026-09-14)
- Quick-actions-on-hover: PRD §5.4 lists them in v1, but epic story SV-9173 is OBSOLETE / "later release".
  All quick-action cases are in the EXCLUDED "Quick Actions on Hover (v1)" folder — untouched. Spec-owner
  decision, flagged.
- Vendor Invoices badge: C44900 follows the engineering tri-state decision (2026-08-17) and discloses it;
  PRD §4 body still reads "Paid / Unpaid" — spec-body cleanup item for the owner.
- No QA build was observed here; on-screen labels/routes remain PROVISIONAL (Rule 85) — the build-verify
  pass finalises them.

**⇒ Source verification COMPLETE. Suite is source-current against PRD v1.5 as of 16 Sep 2026. Ready for build verification.**
