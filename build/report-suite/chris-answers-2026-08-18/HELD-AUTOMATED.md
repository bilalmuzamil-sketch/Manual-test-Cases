# HELD — Automated WIP cases affected by Chris's Q2=B (Rule 71, ask-first + build-verify-coupled)

**Two WIP cases are TestRail-flagged Automated (`custom_atmstatus = 3`), so under Standing Rule 71 they
are NOT edited in this metadata/reword pass** — an Automated case is the contract Vladimir Tomovic's
automation runs against, and it is edited **only coupled to a live build-verify pass** so the steps it
produces are confirmed runnable before they reach him. **Build verification is DEFERRED this pass, so
both are HELD.** Confirmed live `custom_atmstatus = 3` for both (2026-08-18).

Both need the SAME line-state reword the four manual cases received (Chris Ward's answer Q2=B, 2026-08-18,
"we're treating WIP as a sum of lines, not work orders"; spec v21 §3 Key Decisions per SV-9027). The exact
intended reword is recorded below so the build-verify pass can **edit + build-verify together** in one
step, then set the marker (`READY`, or `READY - EXPECT FAIL (SV-xxxx)` on a live-backed ticketed failure)
and hand the case number to Vlad (§5.4 / Rule 65).

**Ask-first still gates the edit even coupled with build verification.**

---

## C30462 · WIP-PLACE-01 · "Status-to-tab mapping: Estimate, Complete, In Progress and Review work orders"
- **Live now:** `custom_atmstatus = 3`, marker `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026`, refs `SV-8656 (WIP spec v21 2026-08-17 S3; status-to-tab mapping on the as-of date)`.
- **⚠️ ALSO A REFS DEFECT (found via Rule 41 whole-case re-verify):** refs cites **SV-8656 = "Tech Util - Story 9 - Location Filter"**, which is the WRONG story. The owning WIP tab-placement story is **SV-8659 (WIP Story 3 - Tab Placement)**. Fix in the same pass.
- **Why B touches it:** items assert each work order appears in one tab "and nowhere else", keyed on status; the ambiguity note references the unresolved two-model question (now resolved by Chris).

### Intended reworded Expected Results (for the build-verify pass)
```
1. The Estimate work order's unapproved lines place it in the "Estimates" tab.
2. The Complete work order's completed lines place it in the "Completed" tab.
3. The In Progress and Review work orders' started lines place them in the "Approved - Partially Completed" tab.
4. Each of these work orders has all its lines in one state, so each appears in a single tab. A work order carrying lines in more than one state would appear in more than one tab, each showing only that tab's slice of its money; the status column still shows the work order's true status.

---
This is the expected behaviour as per Chris Ward's answer of 18 August 2026 (option B: the report treats a work order as a sum of lines, not work orders), recorded in his answers in this file: <LINK>, and epic SV-8582 and story SV-8659 (WIP Story 3), both read on <build-verify date>, and the Work In Progress report specification version 21 (§3 Key Decisions, per SV-9027), read on <build-verify date>. Last checked against build <marker> on <date>.
This differs from the older wording in the same specification (Story 3, S3-R1..R4), which places a whole work order in one tab by its overall status. Chris Ward confirmed on 18 August 2026 that placement follows each line's state, so that newest answer is followed here.

AUTOMATION: <READY or READY - EXPECT FAIL (SV-xxxx), set by the build-verify pass>
```
- **Intended refs:** `SV-8659 (WIP Story 3; WIP spec v21 §3 Key Decisions per SV-9027 - line-state placement; single-state work orders each appear in one tab, a mixed-state work order in several; Chris Ward 2026-08-18 answer B)`
- **Remove** the existing ambiguity "Note for the tester" paragraph (resolved by Chris's answer).
- **Marker:** currently the deferred marker; the build-verify pass lifts it to `READY` once runnable (no live-backed ticket exists → not EXPECT-FAIL, §15.1).

## C30452 · WIP-TAB-02 · "Four tabs in a fixed order with the partially-completed tab selected"
- **Live now:** `custom_atmstatus = 3`, marker `AUTOMATION: READY`, refs `SV-8657 (WIP … S1-R2; S1-R3; §3 Key Decisions (no on-screen status filter) — … Story 1 S1-R4)` (refs correct — SV-8657 = WIP Story 1).
- **Why B touches it:** only item 3's parenthetical `(the tab a job lands in is derived from its status and whether any work has started)` implies single-tab-by-status. The primary assertions (four tab labels + order + default tab + counts) are unaffected by B.

### Intended change (parenthetical only)
Replace item 3's parenthetical with a line-state phrasing:
```
3. There is NO on-screen status filter — the four tabs take the place of a status filter (a job's lines are placed into tabs by each line's state, so a job with lines in more than one state appears in more than one tab).
```
- Add the Rule-56 divergence sentence (older Story-3 "derived from its status" wording superseded by Chris's 2026-08-18 answer B) and re-stamp the provenance line.
- **Marker:** currently `AUTOMATION: READY`. Under Rule 69 a content change with build deferred substitutes the deferred marker for a plain `READY`; but since this is coupled to build verification, the build-verify pass sets it live (`READY` once the four-tab layout + line-state note are confirmed runnable — no live-backed ticket → not EXPECT-FAIL).

---

**`<LINK>` = `https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-answers-2026-08-18/chris-answers-fetched-2026-08-18.txt`**

**FOR VLAD (Rule 65):** neither case was changed this pass; both are HELD. When the build-verify pass
edits them, the tell-Vlad hand-off fires then.
