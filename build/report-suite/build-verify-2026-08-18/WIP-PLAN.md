# WIP-PLAN — Work In Progress live build-verification PLAN + access-blocker state (2026-08-18)

**Report 5 of 6 (Work In Progress).** This document is the complete, execution-ready per-case plan
built entirely from staging-independent sources (live TestRail + live Jira + the v22 spec). It is
committed as a work-loss-safe checkpoint **because the live staging build is currently unreachable to
this pass** (see §0). If the session recovers, this is the execution driver; if it does not, this is
the honest record of what was and was not done. **0 TestRail writes have been made** — every write in
a build-verification pass is contingent on a live build observation (Rule 12 / skill 03 §7.2), and no
build observation was possible.

---

## 0. THE ACCESS BLOCKER — recorded honestly (skill 03 §2, core §6.1)

| Fact | Value |
|---|---|
| Build marker (unauth GET, app.staging.shopview.com) | **`v3.8-bd246fd`** |
| — last-modified | Tue, 18 Aug 2026 19:57:31 GMT · etag `c4dd352f91ecfee192844c6a04a643fc` |
| — byte-stable | read 21:58:20Z and re-read 22:03Z — **identical, no redeploy under this pass** |
| Session probe `GET api.staging.shopview.com/api/auth/me/fe-permissions` | **HTTP 401** at 21:58, 21:58, 21:59, 22:01, 22:02, 22:04, 22:05Z (7+ probes) |
| — body | `{"error":"sso_required", …}` — **JSON from the app**, so per core §6.1 the **shared `sv_sso_session` is dead**, not `cf_clearance` (a dead `cf_clearance` gives a Cloudflare HTML challenge, not JSON) |

**Diagnosis (core §6.1 diagnostic order, followed):** the cookie header is one line built correctly;
the `…api.` host was probed (not the app host); the refusal is **JSON `sso_required` from the
application** → the **shared `sv_sso_session` is dead**. **The Technician Utilization pass verified this
exact build live at 21:22–21:51Z on the same cookie file**, so the sign-in died between 21:51 and
21:58Z with **no redeploy in that window** (marker byte-stable). The overwhelmingly likely cause is a
**concurrent sibling worker (report 6 / Inventory Value) calling `quick-login` or `switch-user`, which
rotates the shared `sv_sso_session` and signs every other worker out** (core §6.5). **This pass is
forbidden to call either** (shared-session safety, per its own instruction), so it cannot re-mint the
session, and `quick-login` is itself SSO-gated and would 401 anyway.

**Recovery required (core §6.1):** a **fresh `sv_sso_session`** for `.staging.shopview.com`, supplied
by the QA lead, written to `/tmp/staging-cookie.txt`. A background poller
(`/tmp/wip/poll_session.sh`) is re-probing every 30 s for ~28 min; if the session recovers within that
window this pass executes the plan below immediately.

**Nothing was faked.** No case was build-verified, no marker was lifted, no sentence-2 build stamp was
written — because none of that could be observed (Rule 12). N-of-M build-verified this pass = **0 of
82**.

---

## 1. SCOPE & COUNTS (live TestRail, group 4281, WIP sections 4350–4363, read 2026-08-18 ~22:00Z)

| | Count |
|---|---|
| WIP cases in sections 4350–4363 (live) | **94** |
| **ours** (`created_by = 3`) | **92** |
| **foreign** (`created_by = 1`, Vladimir Tomovic — HANDS-OFF, Rule 38) | **2** — C43572 (atm=3, sec 4351), C38922 (atm=3, sec 4360) |
| ours **NON-Automated** (`atm = 1`) — this pass's write targets | **82** |
| ours **Automated** (`atm = 3`) — HELD, WRITE NOTHING (Rule 71) | **10** |

**ours / live / foreign = 92 / 94 / 2.** All 92 ours present live; 0 missing. **Automated set confirmed
LIVE** exactly `{C30452, C30460, C30462, C30488, C30498, C30508, C30510, C30515, C30518, C30527}` —
matches `wip-v22-2026-08-18/HELD-AUTOMATED.md`.

**Spec currency:** all 82 non-Automated cases are already pinned to **WIP spec v22 2026-08-18** (the
v22 metadata re-stamp ran in `build/report-suite/wip-v22-2026-08-18/FULL-RESTAMP-EXECUTION.md`; the 10
Automated remain at v21, held). So **this build-verify pass owes no spec re-pin** — only the build-facing
layer (sentence-2 build stamp + markers per live observation).

---

## 2. THE PER-CASE PLAN (built offline; executes on live-build recovery)

Marker split of the 82 non-Automated cases (live): **READY 36 · Not-available(deferred) 24 ·
EXPECT-FAIL 15 · HOLD 7.**

### 2.1 READY (36) — confirm runnable live, refresh sentence-2 build stamp; body unchanged
On the live build: walk the case's steps (the five runnability checks), confirm the feature/route is
present and labels match. If runnable and observed → keep `AUTOMATION: READY`, set/refresh Rule-54
sentence 2 → `Last checked against build v3.8-bd246fd on 8/18/2026.` **Body byte-identical.** If a
label/route drifted → cosmetic correction (skill 03 cosmetic-vs-substantive) + sentence 2.

C30451, C30455, C30469, C30471, C30472, C30473, C30474, C30475, C30476, C30477, C30478, C30480,
C30482, C38890, C43592, C43593, C43594, C30483, C30484, C30485, C30486, C30487, C30489, C30490,
C30494, C30503, C30504, C30506, C30509, C30516, C30517, C30520, C30521, C30522, C30524, C30526.

**Calc contract to verify live (S4-R14..R23, v22):** the Earned & Remaining CALC cases (C30474–C30482,
C38890, C43592–C43594) and Summary/Totals cases (C30487/89/90/94) must be checked per-row and in totals
against the v22 formulas — see §4.

### 2.2 DEFERRED — `Not available on Build to test Yet` (24) — live: is the feature present?
Per skill 03 §7.2 decision table. On the live build, prove the detector can fire (§2 false-absence
discipline) before concluding a feature is absent:
- **Feature PRESENT + runs** → LIFT to `AUTOMATION: READY`, add sentence-2 `Last checked … on 8/18/2026.`
- **Feature NOT FOUND** → KEEP the deferred marker, **update the date to `Last checked 8/18/2026`**,
  ensure the under-development line is present (skill 03 §7.3), and log the case to `DEFERRED-RUN.md`.

Most of these are the **Adjustments column cluster (WIP-ADJ-01..08)** and the line-state placement
cases (SCOPE/PLACE) plus Adjustments-dependent Summary/Totals — features that may not yet be on the
build. **The Adjustments column is the newest WIP feature (shared WIP+SBC proposal 2026-08-12, §S4-R29);
its build presence is the key unknown this pass must resolve.**

C30456, C30457, C30458, C30459, C30464, C43979, C30470, C43814, C30479, C43815, C43816, C43817,
C43821, C30493, C43818, C30495, C43819, C30501, C30502, C30507, C43836, C30525, C43838, C43820.

**⚠️ Two of these (C30456, C30458, C30464, C43979) carry a Rule-56 divergence disclosure** against the
older S2-R4 status-placement model (kept, per `wip-v22-2026-08-18/SPEC-DIFF-v21-v22.md` — v22 STILL
carries BOTH models). Do NOT convert the divergence to a confirmation; keep the disclosure.

### 2.3 EXPECT-FAIL (15) — every backing ticket is OBSOLETE/Done (Jira, live 2026-08-18)
**No live backing → marker must come off (Rule 61 / §15.1).** On the live build, per skill 03 §7.2 row
"Feature PRESENT + deviation, NO live-backed ticket": **strip the marker → plain `AUTOMATION: READY`,
remove the symptom / three-outcome block, refresh sentence-2.** If the deviation STILL reproduces →
**flag it in `WIP-FINDINGS.md` with live evidence + a recommendation; FILE NO Jira** (creation hold,
core §11.1). If FIXED → note fixed. **The documented expectation (numbered body) stays** — if it still
fails, the tester fails it and is right to.

| C-id | internal | ticket(s) | ticket status |
|---|---|---|---|
| C30466 | WIP-COL-01 | SV-8987 | OBSOLETE/Done |
| C30468 | WIP-COL-03 | SV-8967 | OBSOLETE/Done |
| C43557 | WIP-COL-09 | SV-8967 | OBSOLETE/Done |
| C30481 | WIP-CALC-08 | SV-8989 | OBSOLETE/Done |
| C30491 | WIP-SUM-05 | SV-8988 | OBSOLETE/Done |
| C30499 | WIP-FLT-02 | SV-8969 | OBSOLETE/Done |
| C30500 | WIP-FLT-03 | SV-8908, SV-8968 | both OBSOLETE/Done |
| C30505 | WIP-FLT-08 | SV-8968 | OBSOLETE/Done |
| C38916 | WIP-FLT-09 | SV-8954 | OBSOLETE/Done *(SV-8954 is a Technician-Utilization Location ticket — cross-referenced; verify the WIP symptom live)* |
| C30511 | WIP-EXP-02 | SV-8907 | OBSOLETE/Done |
| C30512 | WIP-EXP-03 | SV-8907 | OBSOLETE/Done |
| C30513 | WIP-EXP-04 | SV-8907 | OBSOLETE/Done |
| C30514 | WIP-EXP-05 | SV-8907 | OBSOLETE/Done |
| C30519 | WIP-VIS-01 | SV-8970 | OBSOLETE/Done |
| C30523 | WIP-VIS-05 | SV-8967 | OBSOLETE/Done |

**⚠️ Note:** the marker-strip is justified by the Jira fact (ticket closed = no backing, §15.1), but the
choice between **plain READY** (feature present) and **`Not available on Build to test Yet`** (feature
absent) requires the live build — so these are NOT written without live observation.

### 2.4 HOLD (7) — re-verify the reason live; keep HOLD unless now runnable
| C-id | internal | HOLD reason (current) | plan |
|---|---|---|---|
| C30467 | WIP-COL-02 | *"build does not follow the ratified Location rule … needs the QA lead's permission before a ticket exists"* | **⚠️ §15.1a: this is a FILING-problem HOLD, not a runnability hold.** Under the active creation hold (core §11.1) it stays HOLD; **flag in FINDINGS** — one edit from `READY - EXPECT FAIL` once a ticket is authorised |
| C43551 | WIP-PERS-05 | same Location-rule filing HOLD | same — flag, keep HOLD |
| C38918 | WIP-EXP-10 | over-size refusal cannot be produced on this environment | genuine unobtainable state → **keep HOLD** (verify no tab nears the size limit) |
| C30528 | WIP-API-01 | nightly capture is a background process; nothing in the product reads it back | genuine observability HOLD → **keep HOLD** |
| C30530 | WIP-API-03 | same (nightly snapshot) | keep HOLD |
| C30531 | WIP-API-04 | same | keep HOLD |
| C30533 | WIP-API-06 | same | keep HOLD |

### 2.5 AUTOMATED — 10 HELD, verify live but WRITE NOTHING (Rule 71)
See **WIP-HELD-AUTOMATED.md**. Verify live (record intended change), do NOT edit. `custom_atmstatus = 3`
confirmed LIVE for all 10. Their edits are ask-first + build-verify-coupled (skill 03 §6.4).

---

## 3. WIP SPEC SELF-CONTRADICTION + OPEN CHRIS QUESTION (flag, do not force)

- **v22 STILL carries BOTH placement models** (`wip-v22-2026-08-18/SPEC-DIFF-v21-v22.md` rows 8–11):
  **S2-R4 "each qualifying work order appears exactly once, in exactly one tab"** vs the **§3 Key
  Decisions line-state model per SV-9027** (*"A work order carrying lines in more than one state appears
  in each matching tab"*). These are contradictory and **unreconciled in v22.** Our reworded
  cases (SCOPE-01/03, PLACE-03/05) follow the line-state (Chris 2026-08-18 answer B) model and disclose
  the divergence (Rule 56). **This is Chris Ward's spec-hygiene to fix — OPEN QUESTION, do not invent an
  answer.**
- **Open Chris follow-up: WIP aging / Adjustments per-line-vs-per-job.** If a case turns on this, flag
  it for the PO question sheet — do NOT force a verdict.

---

## 4. WIP CALC CONTRACT (v22, to verify live per-row and in totals)

Authoritative expected calculation, WIP spec v22 (Story 4 Definitions S4-R14..R23) — NOT the SBC margin
formulas. Verify against `GET /api/reporting/reports/work-in-progress` (endpoint shape to confirm live).

```
Labor Earned    = Σ over approved labor lines of min(quoted labor value, value covered by clocked time)
Labor Remaining = Σ quoted approved labor value − Labor Earned
                  (Completed tab: Labor Earned = full quoted value; Labor Remaining = $0.00 — S4-R15a/R16a)
Parts Earned    = sell value of approved-line parts already received (core charge included, all tabs)
Parts Remaining = sell value of approved-line parts ordered but not yet received (incl. core charge)
Earned          = Labor Earned + Parts Earned                                    (S4-R19)
Remaining       = Labor Remaining + Parts Remaining                              (S4-R20)
Adjustments     = signed net of whole-WO fees (+) and discounts (−); never split Earned/Remaining (S4-R29)
Total           = Earned + Remaining + Adjustments  (NOT the WO stored grand total)  (S4-R21)
Labor Delta     = quoted labor hours − worked (clocked) labor hours, signed, 1 decimal (S4-R23)
Money format    = "$1,234.56" / "-$1,234.56" / "$0.00", 2dp, thousands sep (S4-R14)
```

**Grain (v22 Story 11 — nightly snapshot only):** *one row per open work order **per tab** per calendar
date.* The on-screen report shows **one row per open work order per tab** (a WO with lines in >1 state
appears in each matching tab showing that tab's slice — §3 Key Decisions per SV-9027).

---

## 5. WHAT EXECUTION WILL PRODUCE (when the build is reachable)
- Live-walk each of the 82 non-Automated cases (the five runnability checks; prove the detector can fire).
- Writes: `update_case` only, all three text fields sent, re-GET byte-compared field-by-field (core §2),
  `custom_atmstatus = 1` preserved, executor dry-run-read before send.
- Post-batch invariant census over all 94 WIP cases (exactly 1 marker, 1 provenance, 0 raw markup).
- Run 359 untouched (no run/result writes). 0 Jira writes (GET only). 0 foreign touched.
- Checkpoint commit + push every ≤15 cases with a per-op log (Rule 29).
- Fill WIP-EXECUTION.md, WIP-FINDINGS.md, WIP-HELD-AUTOMATED.md; append DEFERRED-RUN.md, FOR-VLAD.md.

---

## OUTSTANDING — what I need from you (Rule 36 / 70)

| # | What it is (plain) | What YOU do | Why it matters |
|---|---|---|---|
| 1 | **Staging session is dead** — a sibling worker's sign-in rotated the shared login and signed this pass out; I'm forbidden to re-mint it | **Supply a fresh `sv_sso_session` (staging) to `/tmp/staging-cookie.txt`** — or confirm no other pass is calling quick-login/switch-user so the current one survives | **Nothing in WIP can be build-verified without it** — 0 of 82 cases verified this pass; the plan is ready to execute the moment access returns |
| 2 | **WIP spec still states two contradictory placement models** (S2-R4 "exactly once" vs the SV-9027 line-state Key Decision), unreconciled in v22 | Ask **Chris Ward** to reconcile S2-R4 / Story 3 to the line-state model | Our SCOPE/PLACE cases follow line-state and disclose the divergence; the spec should say one thing |
| 3 | **10 Automated WIP cases** need a coupled build-verify edit (ask-first, Rule 71) | Approve the coupled edit when the build is reachable | Any edit to an Automated case is ask-first + build-verify-coupled |
| 4 | **2 Location-rule HOLD cases** (C30467, C43551) are one edit from EXPECT-FAIL but need a Jira ticket, and **ticket creation is on your hold** | Lift the Jira creation hold (or keep it) | Under the hold they stay HOLD; nothing is filed |

**Nothing else outstanding.**
