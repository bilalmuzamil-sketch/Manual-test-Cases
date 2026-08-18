# PLAN — Report Suite build verification, 2026-08-18 (RECON ONLY)

**Project:** Report Suite · **Epic:** SV-8582 · **TestRail group:** 4281 · **Run (theirs):** 359
(Nebojsa Glavinic / Viktoria Videnovic) · **PO:** Chris Ward.
**Context:** Stefan confirmed the QA branch is MERGED TO STAGING → build verification can begin.
**Build observed:** staging `v3.8-2bf8d14`, last-modified 2026-08-18 17:45:12 GMT, read 19:05:08Z.

This document plans the work. **No case was verified, and nothing was written to TestRail or Jira.**

---

## 1. ACCESS VERDICT — **BLOCKED** (need fresh STAGING cookies)

Staging is live and was redeployed today, but **we have no live session**. All cookies in `/tmp` are
for the retired per-branch QA host `.qa.shopview.com`, are 8–14 days old, and are dead against staging
(401 `sso_required` JSON = dead shared `sv_sso_session`); the old QA host no longer connects (HTTP
000). Full evidence: `ACCESS-PROOF.md`.

**To start live verification we need, for the `.staging.shopview.com` domain:**
`sv_sso_session` · `PHPSESSID` · `cf_clearance`. Probe target once supplied:
`https://api.staging.shopview.com/api/auth/me/fe-permissions` (HTTP 200 + permissions array = live).

**Jira access works now** (independent of staging), so the story-status and source-currency work below
can proceed immediately; only the live walk waits on staging cookies.

---

## 2. STORY-STATUS SPLIT (epic SV-8582, read live 2026-08-18)

113 children: **97 Story · 8 Bug · 8 Task**. Status counts across all 113:

| Status | Count | Reading |
|---|---|---|
| Open | 78 | product-acceptance stories (see the caveat below) |
| In Progress | 12 | engineering/infra + shared-control stories |
| OBSOLETE | 10 | closed defects/tasks |
| TESTING QA | 7 | |
| Ready for QA | 2 | |
| QA Complete | 2 | |
| Done | 1 | |
| Board Backlog | 1 | |

### 🔴 THE CAVEAT THAT GOVERNS THE WHOLE PLAN — Jira status is a STALE proxy here

The QA lead confirmed on **2026-08-11** that **all six reports were handed off** and the branch is
final, and Stefan has now confirmed the merge to staging. **Yet 461 of our 508 cases map to stories
still marked "Open".** Those "Open" stories are the **product-acceptance** stories (SBC Story 1–21,
SBR Story 1–23, PV/TU/WIP/IV stories) — the dev team never transitions them out of Open. **Ticket
status is never build evidence** (Rule 57 / core §11.2), so classifying build-verifiability by Jira
status alone would **wrongly defer ~470 cases** to the deferred run, contradicting the handoff+merge.

**The stories that DO get transitioned are the engineering/infra ones**, and only **5 are genuinely
"In Progress"**, touching **9 cases**:

| Story | Cases | Summary |
|---|---|---|
| SV-8593 | 3 | [A5] FE report shell (table / remembered-view / filters) |
| SV-8589 | 2 | [PR-1] inventory_changes INT→DECIMAL precision |
| SV-9214 | 2 | Reports: single "as of" date control (shared) — WIP + Inventory Value |
| SV-8598 | 1 | [B5] Sales By Customer report + dedicated endpoint |
| SV-8599 | 1 | [B6] Sales By Representative report |

**⇒ Build-verifiability CANNOT be decided from Jira status. It is decided by LIVE OBSERVATION on
staging.** Jira "In Progress" is a weak corroborating signal, not the classifier.

---

## 3. CASE → STORY → BUCKET (508 cases)

### 3a. By Jira status literally (shown for completeness — NOT the classifier)

| Report | Total | Build-verifiable (status) | Under-dev (status) | no-story ref |
|---|---|---|---|---|
| Sales By Customer | 96 | 6 | 89 | 1 |
| Sales By Representative | 118 | 4 | 113 | 1 |
| Parts Velocity | 72 | 12 | 60 | 0 |
| Technician Utilization | 61 | 0 | 61 | 0 |
| Work In Progress | 92 | 8 | 84 | 0 |
| Inventory Value | 69 | 6 | 63 | 0 |
| **Total** | **508** | **36** | **470** | **2** |

*(no-story ref: SBC-EMPTY-04 = C30184 refs the epic SV-8582; SBR-CALC-08 = C30236 refs SV-9071, not a
child of this epic — both to be re-anchored, minor.)*

### 3b. By current AUTOMATION marker in the case bodies (the "already-deferred" set matters)

| Report | READY | READY - EXPECT FAIL | Not available on Build to test Yet | HOLD |
|---|---|---|---|---|
| Sales By Customer | 49 | 18 | 19 | 10 |
| Sales By Representative | 71 | 23 | 19 | 5 |
| Parts Velocity | 51 | 9 | 11 | 1 |
| Technician Utilization | 35 | 16 | 4 | 6 |
| Work In Progress | 41 | 16 | 28 | 7 |
| Inventory Value | 34 | 19 | 6 | 10 |
| **Total** | **281** | **101** | **87** | **39** |

- **87 "Not available on Build to test Yet"** — previously deferred for lack of build access. These
  are the immediate candidates to lift to `READY` once staging is verifiable.
- **101 EXPECT-FAIL** — under §15.1 each needs a LIVE open ticket to keep its marker; several backing
  tickets are closed, so these need re-checking against live tickets (and any marker change is gated by
  the ticket-creation hold, §11.1).
- **39 HOLD** — re-judge on the steps (core §15.1a): a hold on a case whose steps run disarms it.

### 3c. The 10 HELD Automated WIP cases (Rule 71 — edit + build-verify TOGETHER)

All map to WIP stories, all currently Jira "Open":

| C-id | internal | story | current marker |
|---|---|---|---|
| C30452 | WIP-TAB-02 | SV-8657 | READY |
| C30460 | WIP-SCOPE-05 | SV-8655 | Not available on Build to test Yet |
| C30462 | WIP-PLACE-01 | SV-8656 | Not available on Build to test Yet |
| C30488 | WIP-SUM-02 | SV-8661 | READY |
| C30498 | WIP-FLT-01 | SV-8663 | READY - EXPECT FAIL (SV-8968) |
| C30508 | WIP-PERS-03 | SV-8664 | Not available on Build to test Yet |
| C30510 | WIP-EXP-01 | SV-8665 | READY |
| C30515 | WIP-EXP-06 | SV-8665 | READY |
| C30518 | WIP-EXP-09 | SV-8665 | Not available on Build to test Yet |
| C30527 | WIP-PERM-02 | SV-8657 | READY |

**⚠️ `custom_atmstatus = 3` (Automated) must be confirmed LIVE from TestRail per case (§5.4) — the flag
moves.** Under Rule 71: (a) ASK the QA lead before editing/lifting any Automated case (per batch is
fine); (b) edit + build-verify in the SAME pass so Vlad receives runnable steps; (c) after success, set
`AUTOMATION: READY` (or `READY - EXPECT FAIL (SV-xxxx)` on a live-backed ticket) and **tell Vladimir
Tomovic (id 1)** via `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.

---

## 4. THE BUCKETING RULE WE PROPOSE (to confirm with the QA lead)

Because Jira status is stale, the bucket is set by **live observation on staging**, corroborated by
story status — never by status alone:

- **VERIFIABLE-NOW** → the report surface/feature is present on staging AND the case's
  preconditions/steps run (the five runnability checks, skill `03`). Run the full RUN-CHECK; correct
  cosmetic label/route drift; record substantive divergences.
- **UNDER-DEVELOPMENT (deferred)** → **live observation shows the feature surface genuinely ABSENT** —
  with a control that proves the detector can fire (skill `03`, "probes that cannot fail"; **≥40 false
  absences in two days were all our own probes, none a product fault**) — **AND** the owning story is
  genuinely in flight (the In-Progress engineering stories above are the prime candidates). Only these
  get the dev-status line + the separate run.

**Do NOT mass-defer the 461 "Open"-status cases.** The expected reality is that most reports are on
staging (handed off + merged); the deferred set should be small and live-confirmed.

---

## 5. THE UNDER-DEVELOPMENT TREATMENT (exact wording + placement)

For a case whose feature is confirmed **not build-verifiable because its story is still under
development**, the Expected Results end like this:

```
… [numbered expected results] …

---
This is the expected behaviour as per epic SV-8582 and the <Report> report specification version <N>,
section <anchor>, read on 18 August 2026 [+ any PO answer file/date].

Note for the tester: this test cannot be build-verified yet because this story is still under
development. It will be checked on the build once the feature is released.

AUTOMATION: Not available on Build to test Yet - Last checked 8/18/2026
```

**Placement rules (QA lead's new instruction + Rules 54/69):**
1. The Rule-54 **sources line (sentence 1 only — documents, with read-dates)** stays; **sentence 2 (the
   build "last checked against …" record) is OMITTED** — the case was not build-verified.
2. The **dev-status line goes BELOW the sources line, after a line break** — plain, tester-facing
   (Rule 7). Proposed exact wording above; confirm the phrasing with the QA lead.
3. **Blank line, then the marker** `AUTOMATION: Not available on Build to test Yet - Last checked
   8/18/2026` (Rule 69). This marker **substitutes for a plain `READY` only** — it must **never**
   overwrite an existing `EXPECT FAIL (SV-xxxx)` or `HOLD - <reason>` marker (§15, dated 2026-08-18).
4. These cases are **excluded from any "ready to automate" figure**.

---

## 6. THE SEPARATE BUILD-VERIFICATION RUN (needs authorization)

The under-development cases go into a **separate TestRail run** to be build-verified later:

- Proposed run name: **"Report Suite — Under-Development (Build-Verify Deferred) — 2026-08-18"**.
- Contents: exactly the live-confirmed under-development case ids (add-only; snapshot first).
- **Run 359 is Nebojsa/Viktoria's** (core §4) — it is NOT modified; the deferred cases simply are not
  claimed as build-verified there.
- **AUTHORIZATION REQUIRED (Rule 6):** creating a TestRail run is a TestRail write. Also flag the
  2026-08-10 "create nothing" hold (§11.1) — confirm a new run is permitted, or whether the deferred
  set should instead be tracked in a local list until the hold lifts.

---

## 7. EXECUTION SEQUENCE once staging cookies arrive

1. Pass-start: `git fetch` + `merge --ff-only`; record the live build marker again; re-confirm epic +
   the six spec versions live (skill `02`, source currency — Rule 31/59).
2. Establish the session (core §6); **do NOT call `quick-login`/`switch-user` while a sibling worker is
   live** (they rotate the shared `sv_sso_session`).
3. Reset in-scope roles to template FIRST for permission-gated cases; schedule any destructive
   role/staff/settings edit LAST (core §7.3).
4. Walk all 508 with the five runnability checks; classify each COSMETIC vs SUBSTANTIVE; every probe
   states what makes the state one where the thing should appear + runs a control that proves the
   detector can fire.
5. Bucket VERIFIABLE-NOW vs UNDER-DEVELOPMENT from what was observed.
6. Apply corrections (authorised `update_case` only): lift the 87 deferred markers where verified;
   re-check the 101 EXPECT-FAIL against live tickets; re-judge the 39 HOLD on the steps; apply the
   dev-status line + Rule-69 marker to the confirmed under-dev cases; re-stamp provenance sentence 2
   with `v3.8-2bf8d14` + date, per case, honestly. All writes: all three text fields, dry-run and read
   payloads, byte-check, stop on mismatch, post-write assertion re-audit (core §2).
7. The 10 Automated WIP cases: confirm `custom_atmstatus=3` live, ask-first, edit+build-verify
   together, tell Vlad.
8. Deliverables: `DIVERGENCES.md` (even if empty), `RUNNABILITY.md`, `FINDINGS.md`, `LABEL-DIFF.md`,
   `CHANGES-MADE.md`, `testrail-execution-log.md`, `evidence/` (redacted at capture),
   `RECHECK-QUEUE.md`, and the "AUTOMATED CASES CHANGED — FOR VLAD" section.

---

## 8. OUTSTANDING — what I need from you

| # | What it is (plain) | What YOU do | Why it matters | Priority |
|---|---|---|---|---|
| 1 | **Fresh staging cookies** — we have none for `.staging.shopview.com`; the old QA ones are dead. | Supply `sv_sso_session`, `PHPSESSID`, `cf_clearance` for `.staging.shopview.com` (to `/tmp`, not the repo). | **Nothing can be build-verified until these arrive.** Jira/source work can proceed meanwhile. | HIGH — blocks the whole live pass |
| 2 | **Bucketing basis** — Jira status is stale (461 "Open" cases despite handoff+merge). | Confirm: bucket by LIVE observation on staging (§4), not by Jira status alone. | Status alone would wrongly defer ~470 cases. | HIGH |
| 3 | **Dev-status line wording** for under-dev cases. | Confirm the exact sentence (§5) or give your preferred phrasing. | It is tester-facing on every deferred case. | MED |
| 4 | **Separate deferred run** — a TestRail write, and the 2026-08-10 "create nothing" hold may still stand. | Say whether to create the run now, or track the deferred set locally until the hold lifts. | Governs where deferred cases live. | MED |
| 5 | **Automated WIP cases** (the 10, + any other `atmstatus=3`) — Rule 71 ask-first. | Approve editing/build-verifying Automated cases in this pass (per batch). | We cannot touch them otherwise. | MED |
| 6 | **TestRail write authorization** for the correction step (§7.6). | Approve `update_case` for build-verify corrections when the live pass runs. | No TestRail write without per-ask permission (Rule 6). | MED (when live) |

**Nothing else is outstanding for the recon itself.**
