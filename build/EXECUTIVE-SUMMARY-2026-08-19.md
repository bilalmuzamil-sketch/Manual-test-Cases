# EXECUTIVE SUMMARY — build-verification across all three projects (2026-08-19)

**One page for the QA lead. Plain, action-first (Rule 70). Docs-only — no staging/TestRail/Jira write.**

Every case counted "build-verified" is **source-verified and build-accurate in its preconditions,
steps, navigation and labels — the pass/fail behaviour verdict belongs to the manual tester** (Rule 10,
2026-08-11 amendment). Numbers reconcile in `build/BUILD-VERIFICATION-COVERAGE-2026-08-19.md`.

---

## ✅ DONE — all three projects are build-verified

| Project | Build-verified | Held atm=3 (for Vlad) | Total (ours) | Headline |
|---|---|---|---|---|
| **Report Suite** (SV-8582) | **437** | 71 | **508** | Full re-verify sweep across all 6 reports (166 cases) **+ WIP v24 reconciliation** (13 cases, S11-R7 snapshot-read live-confirmed). Old "157 not-verified" backlog CLOSED. |
| **Schedule** (SV-8685) | **190** | 5 | **195** | Batches A/B/C done **+ re-check vs Stefan V's `v3.8-d0e135e` deploy** — 94 cases re-driven live & re-stamped; **Priority-filter fix applied** (Branko's ruling); all 4 Schedule defects re-confirmed still reproducing; View + Edit/Delete permission tiers observed live. |
| **Filters** (SV-8785) | **119** | 5 | **124** | Build-verify COMPLETE — **the 2-day-waiting tester is UNBLOCKED**. Fabian redesign (spec v21) fully present; 57 deferred markers lifted to READY; **SV-8875 verified FIXED** (C29624/C29625). Ready-to-automate 104. |
| **TOTAL** | **746** | **81** | **827** | 746 + 81 = 827 ✓ |

---

## ✅ DONE 2026-08-20 — PV+WIP spec-delta reconciliation (was in-flight)

- **Parts-Velocity CSV number-format rule (RS-PV-1) — DONE**, live-verified on build `v3.8-d0e135e`:
  **C30380** extended with the plain-number CSV rule, **C30381** re-stamped, **C30382 → EXPECT-FAIL**
  against **SV-8818** (the PV **PDF** export still returns HTTP 500). C30348/C30371 spot-verified, no
  change. Committed `b7a28979`, run 359 untouched, byte-verified. **No tally change** — existing cases
  modified in place, so the 508 / 437 / 71 Report-Suite figures above are unchanged.
- **WIP Delta B.1 / B.2 — DONE**: spot-verified at spec v24, no drift, 0 writes.
- **Flagged (no case change):** the Parts-Velocity Vendor TEXT column renders an em-dash for a null value
  in the CSV — a QA-lead question, not a case edit.

## 🔴 BLOCKED — the ONE remaining build-verification item, source-blocked (NOT cookie-blocked)

- **WIP Story-5 Summary-Strip design adoption (RS-WIP-8) — 9 cases + 1 Automated held.** The build has
  shipped the new Summary-Strip (new figure names, grouped +/= math, reworded tooltips), but those exact
  figure names/tooltip wordings are in **NO document we hold** — only the running build, the SSO-walled
  **WIP v24 Confluence page**, and the **2026-08-13 design-review export**. We will NOT invent ratified
  wording from the build (Standing Rules 57/58, quote-back test), so **0 WIP writes; 9 WIP Story-5 cases
  (C30487/89/90/91/93, C43818, C30520, C30524, C43838) + 1 Automated case (C30488) are HELD.** **This is
  the ONLY remaining build-verification item across all three projects.** **To unblock:** supply the
  **WIP v24 Confluence page + the 2026-08-13 design-review export**; then one coupled build-verify pass
  applies it live (that live re-check step will also need a fresh staging session at that point).

---

## 🟡 AWAITING YOUR GO-AHEAD

- **Ratify the 81 Automated (`custom_atmstatus = 3`) held cases** (Report Suite 71 + Schedule 5 +
  Filters 5). Rule 71 — ask-first even though they are ours; they are Vladimir Tomovic's automation
  contract. On approval, lift the deferred/EXPECT-FAIL ones (recorded in each pass's `*-HELD-AUTOMATED.md`)
  and hand the case numbers to Vlad.
- **Flagged defects for Jira (creation on hold, Rule 62 / register H1):** Report Suite —
  **26 REOPEN** (closed OBSOLETE but still reproducing) · **1 FILE-NEW** deviation (TU empty-export toast) ·
  **1 CLOSE-AS-FIXED** (SV-8823) · **2 PO-QUESTION** · **2 RESOLVED** by Chris (WIP tab-placement + aging).
  Schedule — **2 CREATE-NEW** (conflict amber-not-red C30029 · multi-day-spread hours-read) + **2 REOPEN**
  (SV-8870 Month-drag · SV-8957 click-to-arm), **all 4 re-confirmed still reproducing** on Stefan's build.
  Nothing is filed/reopened until the hold lifts. Details:
  `build/report-suite/build-verify-2026-08-18/FLAGGED-DEFECTS-FOR-JIRA.md`.
- **2 Filters empty-state deviations** — DEV-1 (C29607/C38897, generic empty message) + DEV-2
  (C29597/C29599, "Clear filters" recovery): file post-hold or scope the cases down.
- **Chris Ward's 2 remaining PO answers** — invoice number link-vs-plain-text (SBC + SBR) · Parts
  Velocity Location-column position (SV-8938 contested). WIP tab-placement + aging are now RESOLVED.
- **A 2nd non-admin (single-location) sign-in** — for ~20 permission-negative / one-location cases across
  all three projects (or rule to skip the negatives).
- **Interim `<br>` cleanup demark** — owed once the TestRail `update_case` markdown-wrap regression is
  fixed (formatting-only pass over 166 + 13 + 94 + 119 written cases).
- **PV CSV Vendor em-dash question** — the Parts-Velocity Vendor TEXT column renders an em-dash for a
  null value in the CSV export. A QA-lead call (is that the intended rendering, or should it be an empty
  cell?) — flagged, no case change made.
- **Export the live WIP Confluence page (v24) + the 2026-08-13 design-review export** — **this is the
  single remaining build-verification blocker** (see the BLOCKED section above): it clears WIP Story-5
  (RS-WIP-8) and lets the WIP spec mirror (behind at v22, RS-WIP-6) catch up.

---

## ⚙️ KNOWN ENVIRONMENT NOTE

- **Staging sessions die fast** — on every deploy and on a ~24h lifetime. Stefan V deployed twice on
  2026-08-19, which is why the cookies keep expiring; the Schedule re-check and Filters passes both ran
  in a live window, and the remaining PV+WIP reconciliation is waiting on the next one.
- **The TestRail `update_case` markdown-wrap regression** means every write this cycle uses the interim
  literal-`<br>` format (renders correctly on the case page, stored as HTML). Template case: **C30133**.
  A demark to clean numbered lists is owed once the API is fixed. Diagnosis:
  `build/report-suite/build-verify-2026-08-18/UPDATE-CASE-WRAP-DIAGNOSIS-2026-08-19.md`.

---

## ⬇️ DOWNLOAD LINKS (GitHub raw, branch `claude/slack-session-0sxnd9`)

- **Coverage table (per project):**
  https://github.com/bilalmuzamil-sketch/Manual-test-Cases/raw/claude/slack-session-0sxnd9/build/BUILD-VERIFICATION-COVERAGE-2026-08-19.md
- **Defects for testers — Report Suite & Schedule (.xlsx):**
  https://github.com/bilalmuzamil-sketch/Manual-test-Cases/raw/claude/slack-session-0sxnd9/build/report-suite/build-verify-2026-08-18/Defects-for-Testers_ReportSuite-and-Schedule_2026-08-19.xlsx
- **Schedule defects for testers (.xlsx):**
  https://github.com/bilalmuzamil-sketch/Manual-test-Cases/raw/claude/slack-session-0sxnd9/build/schedule/build-verify-2026-08-18/Schedule_Defects-for-Testers_2026-08-19.xlsx
- **Spot-check render sample:**
  https://github.com/bilalmuzamil-sketch/Manual-test-Cases/raw/claude/slack-session-0sxnd9/build/SPOT-CHECK-SAMPLE-2026-08-19.md
- **This executive summary:**
  https://github.com/bilalmuzamil-sketch/Manual-test-Cases/raw/claude/slack-session-0sxnd9/build/EXECUTIVE-SUMMARY-2026-08-19.md
