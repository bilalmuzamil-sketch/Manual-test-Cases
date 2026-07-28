# What we need from you (PO / user) to improve the test cases before VIU

> **Date:** 2026-07-27 · **Scope:** the 3 ACTIVE projects only — Report Suite,
> Schedule, Filters. (Global Search = POSTPONED; Simple Flow + Fees & Discounts =
> COMPLETED, per user ruling 2026-07-27.)
> Only genuinely-OPEN items are listed. Things already resolved are noted at the
> bottom of each project so you don't ask for them again.

---

## 1. REPORT SUITE (PO: Chris Ward · Epic SV-8582)

**What we need from you:**

- **QA test branch / environment + feature-flag state.** We know the build branch is
  **`project/reports-suite-bravo`** (from the Jira epic). We still need the actual QA/staging
  URL to log in to, and whether the reports are turned on (flag/settings) so we can VIU live.
- **Designs / videos** (if any exist). There are NO designs anywhere — 0 attachments on the
  epic and all 97 stories, no Figma, no video in Jira. All 515 cases were written spec-only.
  Two specs (Technician Utilization Story 8, Inventory Value) mention a "companion video" that
  was never provided — please confirm if any design/video exists to check the cases against.
- **A few PO answers from Chris Ward:**
  1. **SBR (Sales By Representative):** the spec wants the staff-deactivation pop-up to close
     with the "Esc" key, but the app's Golden Rule #9 says "no Esc." Which one is correct for
     the shipped build? (This decides how we word the SBR Story 13 cases.)
  2. **Permission model:** confirm it is intended that each report uses a different permission
     (Sales By Customer has its OWN dedicated permission; Parts Velocity + Inventory Value reuse
     the inventory-reports permission; SBR rides the Performance group). We want to confirm
     before finalizing the permission cases.

**~3–6 backend/regression cases we're holding until the QA branch** (not user-facing, on your
go-ahead later): a Parts Velocity + QuickBooks fractional-quantity precision check (from the
INT→DECIMAL fix, story PR-1), an Inventory Value nightly-snapshot retention/prune check
(daily→monthly), and confirming the exact permission names + report themes. These may fold into
existing cases instead of becoming new ones.

**Already resolved — do NOT ask for these:**
- Epic key = **SV-8582** (one epic for the whole suite). ✅
- **Inventory Value export cap = 10,000 rows** — engineering treats 10,000 as the single
  suite-wide constant (story A3). We only need Chris to rubber-stamp the wording. ✅ (largely)
- All 515 cases are already imported + C-id mapped in TestRail (group 4281 "Reports Suite").
- The Jira epic + 97 stories match our 515 cases 1:1 — no new user-facing cases needed.

---

## 2. SCHEDULE (PO: Branko · ShopView App)

**What we need from you:**

- **QA test branch / environment + feature-flag/settings state** (OQ-3) — none available yet.
  Live VIU (and any TestRail changes from it) is blocked until this exists.
- **PO decisions from Branko (may change our cases) — the two design deltas are HELD/staged,
  NOT written, pending his answer:**
  1. **D1 — Do calendar Events count toward a technician's capacity and conflict checks?** The
     design code currently says NO (events excluded), but Branko flagged this "may change."
     **HELD, not written:** SCH-EVT-08 / C30615 + SCH-CAP-01..04. Please confirm final.
  2. **D4 — modal "Reassign" wording.** SCH-MODAL-08 / C30015 is **HELD, not written**, pending
     Branko's confirm.
  3. **Spec wording clean-up — VIN tooltip:** the spec contradicts itself (§4.13 says the VIN
     always shows in the hover tooltip; §9 ties the VIN to a toggle). We authored to the design
     ("VIN Number" toggle gates only the shift-block VIN line; tooltip always shows VIN) — please
     confirm Branko is OK with that reading so the spec can be tidied.
- **Live confirmation of ~18 on-screen labels/visuals** once a QA build exists. The design
  prototype pinned most labels, but ~18 items still need a live check (exact status-filter list,
  department names, color palette, some timing thresholds, the 7–7 vs 8–17 working-hours
  default). This is the normal VIU step, listed so you know it's coming.
- **API coverage decision:** the spec has NO API contract (no endpoints). If you want backend/API
  cases, we need the backend contract from Branko/dev; otherwise we stay UI-only.

**Already resolved — do NOT ask for these:**
- PO = Branko; canonical spec URL recorded. ✅
- **Epic / Jira key = SV-8685** (15 stories SV-8686..SV-8700), ingested 2026-07-27 — OQ-2
  RESOLVED, no longer needed from you. ✅
- Design is NO LONGER missing — the Claude prototype (`Schedule.dc.html`) is the authoritative
  design (Branko Q0); ~48 labels already folded in. ✅
- **177 active cases** authored, imported, and C-id mapped in TestRail (group 4254). The
  spec_1 + design + Branko Q&A **+ epic SV-8685 backfill/deltas/new-scope reconciliation is
  applied and SYNCED to TestRail** (user-authorized 2026-07-27: 167 update_case refs-backfill +
  edits + 10 add_case new-scope C38846–C38855; run 325 untouched). Branko PO-questions doc
  READY: `PO-Questions-Branko-Schedule-2026-07-27.md/.xlsx`. ✅

---

## 3. FILTERS (PO: Branko · Work Order list filtering)

**What we need from you:**

- **Branko's updated PRD** — still awaited (requested 2026-07-17). **UPDATE 2026-07-27: we no
  longer WAIT on it to author** — per Option A we authored the **43 Parts/Reports/page-search
  cases design-level** (see "already resolved" below). The PRD is now needed to (a) CONFIRM the
  behaviours those 43 cases flag as "pending Branko's product write-up", and (b) deliver the
  **two text fixes** Branko promised (the stale write-up sentences from Round-1 Q1). It also
  gates the authorized `add_case` push of the 43 (they sit staged with blank C-ids).
- **Answers to the Branko PO-questions doc** (`PO-Questions-Branko-PartsReports-2026-07-27.md/.xlsx`,
  7 product Qs: PRD request, which chips apply, option lists, new filter-type behaviour, WO-parity,
  page-search scope vs Global Search + AI, per-role filters).
- **Epic / Jira key** (OQ-3) — none available yet; do not have it.
- **QA test branch / environment + feature-flag/API state** (OQ-7) — none available yet. Live VIU
  is blocked until this exists.
- **Live confirmation at VIU** of the 24 "VIU-confirm" placeholder labels + the exact on-screen
  strings for the 3 cases we already updated (permanent persistence FLT-PERS-02 / C29614; the
  disabled pre-filled Status chip on Estimates + Completed tabs FLT-TAB-02 / C29609, FLT-TAB-03 /
  C29610 — especially the Completed tab's pre-filled text, which has no design frame).
- **Canonical Confluence spec URL** (OQ-2) — still to confirm (minor housekeeping).

**Already resolved — do NOT ask for these:**
- Branko's Round-1 answers (Q1–Q4) and Round-2 answers (Q1=A/Q2=A/Q3=A) are all ingested;
  Round-2 needed zero case edits. ✅
- Filter lists are role-independent (OQ-4) — no role-based cases needed. ✅
- Persistence = permanent per-user (OQ-5). ✅
- Design baseline confirmed final (ZIP = final, 50/50 frames captured). ✅
- 79 Work-Orders-page cases authored, imported, and C-id mapped in TestRail (group 4110,
  C29557–C29635). ✅
- **43 NEW Parts/Reports/page-search cases AUTHORED design-level** (Option A, 2026-07-27):
  Parts 12 (FLT-PARTS-01..12), Reports 22 (FLT-RPTS-01..22), page-search 9 (FLT-SRCH-01..09).
  All VIU-Pending, blank C-ids — **STAGED for an authorized `add_case` push** (held pending the
  PRD/answers). **New total = 122 cases.** ⚠️ Every page-search case OVERLAPS the postponed
  Global Search project (86 cases there) — reconcile/de-dupe before any push. ✅ (authored)

---

## Quick summary — the biggest blockers per project

| Project | #1 blocker | Also needed |
| --- | --- | --- |
| **Report Suite** | QA branch/env + flag state (`reports-suite-bravo`) | Chris: SBR Esc vs Golden-Rule, permission-model confirm; confirm no designs/video. Epic SV-8582 known + reconciled ✅ |
| **Schedule** | QA branch/env + flag state (epic SV-8685 known ✅) | Branko: events-count-toward-capacity (D1) + Reassign (D4) + VIN-tooltip spec fix; API contract decision |
| **Filters** | Branko's PRD/answers (confirm the 43 authored cases' behaviours + text fixes) | Epic key + QA branch/env; canonical spec URL |

> **All three are VIU-parked pending their QA branches** (live-only agreement): PO
> questions are DELIVERED/ready (Chris + Branko×2) — answers pending; when a QA branch
> arrives the user supplies fresh staging cookies, then we run the live VIU.

All three projects are **VIU-pending their QA branches** — no live verification can happen until
each feature is on a testable QA environment (and, for Filters, until the PRD arrives to author
the remaining pages).
