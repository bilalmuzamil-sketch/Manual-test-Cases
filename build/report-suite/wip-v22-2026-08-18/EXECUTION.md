# EXECUTION — WIP spec v21 → v22 focused reconciliation — 2026-08-18

**Project:** Report Suite · **report:** Work In Progress · **PO:** Chris Ward · **epic:** SV-8582 ·
**TestRail group:** 4281. **Build DEFERRED (app NOT opened). No Jira. No run writes (no new cases).**
**Foreign = Vladimir Tomovic (id 1) — never touched.** **Git base:** `origin/claude/slack-session-0sxnd9`.

Context: Chris Ward republished the WIP spec (Confluence 703660034) v21 → **v22** on 2026-08-18 17:01
("Story 11 snapshot grain → per work order per tab"). Five WIP cases were stamped at v21 minutes before
v22 published: **C30456, C30458, C30464, C30493, C43979** (C30528 was already fixed to v22 in the recovery
pass). This pass re-stamps those 5 to v22 and reports the remainder.

---

## STEP 1 — v21→v22 DIFF (Rule 43) → `SPEC-DIFF-v21-v22.md`

**Both versions fetched LIVE from Confluence** (`?status=historical&version=21|22&expand=body.storage`,
HTTP 200). Full per-requirement verdict in `SPEC-DIFF-v21-v22.md`; raw evidence `wip-spec-v21-text.txt`,
`wip-spec-v22-text.txt`, `wip-spec-v21-v22.diff`.

**THE ONLY TESTABLE CHANGE v21→v22 IS STORY 11 (nightly snapshot grain):**
- **S11-R1** per-WO → **per-WO-per-tab** (rows keyed by work order, tab, calendar date).
- **S11-R2** now records the tab (line-state bucket) + that tab's Earned/Remaining with underlying
  Labor/Parts amounts.
- **S11-R3** "for a given work order" → "for a given work order **and tab**".
- Scope note / glossary / context note: "per work order per day" → "per work order **per tab** per day".
- New change-log row (provenance only).

**EVERYTHING ELSE MOVED BY ZERO BYTES** — verified line-by-line:
- **Story 2 / Story 3 tab-placement wording is UNCHANGED** — S2-R4 *"exactly once, in exactly one tab"*,
  S3-R1..R4 status→single-tab, the §3 Key Decisions status line, AND the §3 Key Decisions line-state
  model (per SV-9027) are all **byte-identical** v21↔v22.
- **The Estimates tooltip (S5-R12 / S5a-R2) is UNCHANGED.**

**⇒ ANSWER TO THE PASS'S CENTRAL QUESTION: v22 did NOT reconcile the Story 2/Story 3 "exactly once / by
status" wording to line-state.** v22 STILL carries BOTH models. So the reworded placement cases'
expectation is **NOT "now stated directly by v22 as the sole model"** — their Rule-56 divergence against
S2-R4 REMAINS real. **Zero divergence→confirmation conversions.** C30493's Q1=A note stays a confirmation
(tooltip byte-identical in v22).

---

## STEP 2 — 5 CASES RE-STAMPED v21 → v22 (metadata only, byte-verified)

All 5 confirmed LIVE before writing: `custom_atmstatus = 1` (manual), `created_by = 3` (ours).
Sources re-read LIVE at pass start (Rule 59); writes began immediately after.

| C-id | Case | Note kind | Divergence→confirmation? | Marker |
|---|---|---|---|---|
| **C30456** WIP-SCOPE-01 | line-state loading | **divergence KEPT** (S2-R4 still in v22) | no | UNCHANGED |
| **C30458** WIP-SCOPE-03 | line-state, every matching tab | **divergence KEPT** | no | UNCHANGED |
| **C30464** WIP-PLACE-03 | Approved started-boundary | **divergence KEPT** (S3-R4 unchanged) | no | UNCHANGED |
| **C30493** WIP-SUM-07 | Estimates tooltip | **confirmation KEPT** (Q1=A) | n/a | UNCHANGED |
| **C43979** WIP-PLACE-05 | per-tab money slice | **divergence KEPT** | no | UNCHANGED |

**The change on all 5 is metadata-only:** Rule-54 provenance sentence 1 `specification version 21 → 22`
and `refs` `WIP spec v21 → v22`. **The numbered expected-result BODY is byte-identical before and after
on all 5** (dry-run + post-write byte-compare confirmed). **Per the Rule 69 content-vs-metadata
refinement, the `AUTOMATION:` marker on all 5 is UNCHANGED** — each keeps
`AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026`.

**Divergence-note "update to v22":** each divergence note reads *"differs from the older wording in the
same specification (Story 2, S2-R4 …)"* — a **version-neutral** reference to "the same specification".
Once sentence 1 pins v22, "the same specification" = v22, and S2-R4 is byte-identical in v22, so the note
is accurate as written; no note wording change was required or made.

**Byte-verify (Rule 50):** each `update_case` HTTP 200; re-GET compared field-by-field to the intended
payload; `custom_preconds`/`custom_steps` and every unintended field proven byte-identical to the
pre-write snapshot; expected BODY + marker line proven byte-identical. **0 mismatches, 0 collateral.**
Per-op log: `testrail-execution-log.md`. Snapshots: `snapshots/C*.before/after.json`.
**Post-write invariant census:** each of the 5 has exactly 1 provenance line, 1 separator, 1 marker;
cites v22; 0 v21 left. **§2.10 re-audit: 0 material changes** — all 5 fall out by construction (body
byte-identical), so there is nothing to re-audit.

---

## STEP 3 — 2 HELD Automated cases' staged rewords re-pointed to v22 (local doc only)

**C30462 (WIP-PLACE-01)** and **C30452 (WIP-TAB-02)** confirmed LIVE **`custom_atmstatus = 3`**,
`updated_by = 3`, still citing v21 — **HELD and UNTOUCHED** (Rule 71: edited only coupled to a live
build-verify pass). Their staged reword text in
`build/report-suite/chris-answers-2026-08-18/HELD-AUTOMATED.md` was updated **v21 → v22** so the
build-verify pass uses the current spec version:
- intro paragraph `spec v21 → v22` + a note that the re-point was made 2026-08-18 and that **S11 is NOT
  relevant** to these two placement cases (S11 changed; their §3 Key Decisions placement anchor is
  byte-identical v21↔v22);
- C30462 intended provenance `specification version 21 → 22`; intended refs `WIP spec v21 → v22`;
- C30452 intended change now says the re-stamp cites **version 22** (Story 1 S1-R2/R3/R4 + the §3 "no
  status filter" line are byte-identical v21↔v22, so only the version pin moves).

The **"Live now" refs lines** (which record the current live v21 state) were **left as the factual
record**. **No TestRail write to C30462/C30452.**

---

## STEP 4 — REMAINDER (report only; NOT acted on — needs a further go-ahead)

**84 other WIP cases still cite v21** in provenance/`refs` (the 94 WIP cases minus the 5 re-stamped, minus
C30528 already at v22, minus the 2 HELD). A full WIP v22 re-stamp would be **metadata-only for 83 of them**
(version-pin bump — the v22 diff touched none of their assertions).

**Content-affected by the v21→v22 diff = 1 case (beyond C30528, already fixed):**
- **C30530** WIP-API-01 area (atm=1, manual) — its item 1 says the snapshot maths *"can never diverge for
  a given work order on the capture date"*; **it cites S11-R3, which v22 changed to "for a given work order
  and tab"**. So a full re-stamp of C30530 is **NOT metadata-only** — it needs "per work order" → "per work
  order and tab" to match v22 S11-R3. **This is the one remainder case that would need a content reword,
  not just a version bump.** (Not touched this pass — flagged for the QA lead.)

Checked and ruled **NOT content-affected** (metadata-only if re-stamped): the other snapshot/trend cases —
C30455 (S11-R7, Trend absence), C30531 (S11-R4, scope conditions), C30533 (S11-R6, nothing-approved job is
one Estimates-tab row — assertion still true at v22), C43820 (S11-R8/R9, historical Adjustments), C30502
(cites S7, on-screen as-of date). No remainder case carries old grain BODY phrasing.

**Automated (atm=3) among the 84 v21 remainder = 8 cases** — Rule 71 held (ask-first + build-verify-coupled
for any edit): **C30460, C30488, C30498, C30508, C30510, C30515, C30518, C30527.** A full v22 re-stamp would
touch these only metadata-wise, but they are Automated, so they are held with the other Automated WIP cases.

---

## STEP 5 — VERIFY + DELIVER

- **Contradiction sweep (Rule 28):** scanned all 94 WIP case bodies for old single-tab-by-status phrasing.
  **The only hits are the 2 tracked HELD Automated cases (C30452, C30462)** — their line-state reword is
  staged pending the build-verify pass. **0 new contradictions introduced** (my changes are metadata-only).
- **Deliverables regenerated:** import CSV/XLSX (unified + 6 per-report) + id-map. Import diff scoped to
  **only the 5 WIP cases** (5 Expected-column provenance re-stamps + 4 References-column v22 bumps;
  WIP-PLACE-05's `spec_ref` is a file-path anchor so no References change). **Shredding guard: 0.**
  Import header **sha256 = a82ca60c36074512, identical to all 6 peer imports.**
- **id-map:** **508 rows, 0 blank C-ids, 0 blank refs** (C-ids re-merged from the committed backup, refs
  re-merged from the corrected case source); the 5 now show v22.
- **Four-count reconciliation — set-equal BOTH ways:** live OURS **508** = local active **508** (574
  bodies − 66 retired) = id-map **508** = import **508**. id-map C-ids == live-ours ids exactly (0 in one
  not the other).
- **Census group 4281:** **live 522 = ours 508 + foreign 14** (all Vladimir Tomovic, id 1). **0 foreign
  touched** (this pass wrote only to 5 `created_by = 3` cases).

## AUTOMATED CASES CHANGED — FOR VLAD (Rule 65)
**None.** No `custom_atmstatus = 3` case was written this pass (C30462, C30452 were HELD; the 5 written are
all atm=1). The tell-Vlad hand-off fires when the coupled build-verify pass edits the 2 held cases.

## OBSERVATION — pre-existing, NOT fixed (out of v22 scope, flagged)
`spec_ref` (which feeds the import References column) on **WIP-SCOPE-01 (C30456)** and **WIP-PLACE-03
(C30464)** still names the OLD Tech-Utilization stories **SV-8654 / SV-8656**, while their live TestRail
`refs` were correctly fixed to **SV-8658 / SV-8659** in the Chris pass. My v21→v22 bump refreshed the
version in `spec_ref` but did NOT change the story attribution (deciding/propagating that is beyond a
version re-stamp). A future currency/traceability pass should reconcile `spec_ref` to the corrected `refs`.

## OUTSTANDING — what the QA lead needs to decide
| # | What it is (plain) | What YOU do | Why it matters |
|---|---|---|---|
| 1 | **Full WIP v22 re-stamp** of the 83 metadata-only remainder cases still citing v21 | Reply "re-stamp the rest of WIP to v22" | Keeps the whole WIP suite current to v22; all 83 are version-pin only |
| 2 | **C30530 content reword** — cites S11-R3, which v22 changed to "for a given work order **and tab**" | Approve a small content reword (manual, atm=1) | It is the ONE remainder case whose assertion v22 actually changed; a bare re-stamp would leave it stale |
| 3 | **8 Automated WIP cases** in the remainder (C30460/30488/30498/30508/30510/30515/30518/30527) | Approve editing coupled to a build-verify pass (Rule 71) | Any edit to an Automated case is ask-first + build-verify-coupled |
| 4 | **2 HELD Automated cases** C30462, C30452 — line-state reword staged (now v22) | Schedule the coupled build-verify pass when WIP is on a build | Their live text still asserts the old status model |
| 5 | **`spec_ref` story mismatch** (SV-8654/SV-8656 vs live refs SV-8658/SV-8659) on C30456/C30464 | Approve a traceability tidy in a future pass | Import References disagrees with live refs on the story |
| 6 | **Chris spec hygiene** — v22 STILL states both placement models (S2-R4 "exactly once" vs SV-9027 line-state) | Ask Chris to reconcile S2-R4 / Story 3 to line-state | The internal contradiction is Chris's to fix; our cases follow B meanwhile |

**Nothing else outstanding on this pass.**
