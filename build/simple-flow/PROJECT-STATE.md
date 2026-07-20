# Simple Flow — PROJECT STATE (canonical resume snapshot)

> **THIS IS THE CANONICAL STATE DOC for the Simple Flow project.** Single
> authoritative snapshot so the project can be resumed cold with zero
> re-discovery. **Confirm the project first** — this workspace holds 3 projects;
> the instruction must target **Simple Flow** (Epic SV-7301, PO = @Milos Vasic,
> app `sv7301.qa.shopview.com`). **Source of truth for per-case status:**
> `SimpleFlow_Blockers_Tracker.md`/`.xlsx` (regenerate with
> `python3 build/simple-flow/gen_blockers.py`). All counts below are cited from
> that tracker — re-read it if in doubt, never invent numbers.
>
> **Canonical spec (Confluence):** https://shopview.atlassian.net/wiki/spaces/PM/pages/646021121/Simple+Mode+Streamlined+Work+Order+Completion+Bulk+Receiving
> (Atlassian-SSO login-walled — reference pointer only; content must be exported/pasted to ingest, do NOT fetch the URL.)
>
> **Last updated:** 2026-07-17 (spec `_4` / V2.6 APPLIED + pushed to TestRail +
> **ADVERSARIALLY AUDITED CLEAN** — commits df95b70→a578ef9 + audit fix 4398091;
> see §0-BB + the WHAT'S LEFT section below).

---

## ⏭️ WHAT'S LEFT TO DO — read this first (as of 2026-07-20)

**Current tally (post retire execution 2026-07-20, §0-CC — authoritative, counted from
`cases/*.json` viu_status): ACTIVE 184 (187 authored − 3 retired) = VIU-Verified 130 /
VIU-Pending 22 / Blocked-Env 24 / VIU-observed-awaiting-Milos 5 / Deviation 3.
Open-Question = 0.** All 184 active cases are in TestRail (id-map 184/184, 0 blanks).
**RETIRE EXECUTED 2026-07-20 (user ruling 2026-07-17 "Retire"):** SF-CORE-05 (C29317) +
SF-CORE-06 (C29318) + SF-CORE-09 (C29321) deleted from TestRail via delete_case (3/3
HTTP 200, re-GET 400 = verified gone; before-snapshots + audit in
`spec-v4-2026-07-17/testrail-update-log.md` + `retire-snapshots-2026-07-17/`; run 325 +
all other cases untouched). Bodies kept in `cases/*.json` marked Retired; the 3 rows
removed from the id-map; all generators exclude Retired cases (assertions 187→184).
**The Milos spec-V2.6 question sheet is READY to send:**
`PO-Questions-Milos-SpecV26_2026-07-17.xlsx/.md` (gen: `gen_po_questions_specv26.py`) —
Q1 S8-R7 leftover cost sentence vs Δ14 $0-only rule, Q2 Vendors-Expenses exclusion
surface confirm (Δ12), Q3 S10-R2 residue (struck rule vs surviving AC bullets +
guardrails); layman reader tab + QA-only mapping tab (rules 7/8).
**The V2.6 apply pass was ADVERSARIALLY AUDITED 2026-07-17 = CLEAN:**
all 31 touched TestRail cases (13 update + 18 add) re-GET live-vs-local MATCH, run 325 +
the 3 retire candidates untouched, full C-R1..C-R10 + Δ8–Δ16 coverage, tally confirmed
across every deliverable; one defect found+fixed (stale hardcoded "(all 159 cases)"
Blockers-Tracker header → dynamic 187). Audit record appended to
`spec-v4-2026-07-17/testrail-update-log.md`; commits df95b70→a578ef9 + audit fix 4398091.
What remains:

0. ~~RETIRE RULING NEEDED~~ — **CLOSED 2026-07-20: the user ruled "Retire" (2026-07-17)
   and it was EXECUTED 2026-07-20** — SF-CORE-05/06/09 (ex C29317/C29318/C29321) deleted
   from TestRail (delete_case 3/3 HTTP 200, verified gone via re-GET 400), audit-logged,
   local bodies kept marked Retired, active suite = 184, deliverables regenerated. See §0-CC.
0.5. **Story-18 / Δ9-Δ15 re-VIU backlog (22 VIU-Pending):** the 9 new SF-CORE-11..19 +
   the reworded SF-CORE-03/04/07/08 + SF-BULK-10 + SF-REV-14 need the **SV-8353
   pre-resolve build** (probe sv7301 for the resolve step + the pre-resolve endpoint) **+
   a dev-seeded special-order core**; SF-INV-01/02/03 (Δ13 no-Apply-button) + SF-BULK-06
   (Δ14 $0-only cost) were VIU-Verified against the OLD build → re-VIU, likely build
   DEVIATIONS until dev ships; SF-RCV-11/12/13, SF-VEND-07/08, SF-POSEL-07, SF-BULK-11,
   SF-WOP-04, SF-QB-09 are seedable per Rule 14 (part sale with vendor part etc.) but the
   requirements are new — may not be built yet. Spec-inconsistency flags for Milos: S8-R7
   tail ("after lock only cost editable") vs the $0-only rule; the Resolve Cores Flow
   design still codes required-flow resolve-AFTER-receive (vs C-R6).

1. **Milos still owes answers on 5 questions.** His 2026-07-16 sheet answered ONLY the 2
   Round-3 questions (Q1 vendor-missing placement, Q2 new-org Require-Review default). Still
   unanswered: **SF-SET-08, SF-COMP-06, SF-REV-11, SF-UX-04, SF-QB-02**. The bug-confirm
   rulings in `SimpleFlow_Bugs-for-Milos-Confirm.xlsx` also remain unconfirmed.
   → **Action when resuming:** decide whether to re-send just these 5 to Milos (they were
   deliberately dropped from the Round-3 sheet and routed to dev/self-resolution — confirm
   that routing or re-ask).
2. **File the Round-3 dev bug in Jira (SV-7301).** LIVE VIU shows the Receive/Accept-Delivery
   screen renders the "Vendor Missing" group at the **TOP**; per Milos's ruling it should be
   at the **BOTTOM** (Bulk Receive at TOP is correct). Draft is ready in
   `SimpleFlow_Bug-Drafts.xlsx` (bug #5); affects **SF-RCV-05 / C29373** and
   **SF-RCV-07 / C29375**. Needs Atlassian access (fresh session — no Atlassian in this env).
3. **Run 325 (Ayesha Khan) has drifted.** It now reads roughly **96 Passed / 15 Failed /
   17 Blocked / 28 Untested** (was 48/6/13/89); user ID 5 logged Passed results on 07-14/07-15.
   → **Action:** reconcile our findings against the new run-325 status if the user wants it —
   **do NOT write results to run 325 without explicit permission** (it is QA's/Ayesha's run).
4. **SF-REV-15 (C29400) — Blocked-Env.** The new-org "Require Review defaults ON" default is
   unobservable until a freshly-provisioned org exists (org-create endpoints return 404/405 on
   the shared QA org). Verify the live ON default once a brand-new org is available; if it is
   then observed ≠ ON → separate dev bug.
5. **The other 25 Blocked-Env cases (see §0-ZZ / §0-AA).** QuickBooks not connected (needs a
   QB-connected company + a human in QuickBooks); special-order vendor-sourced cores not
   seedable (needs a dev-seeded core); invoiced/paid WO not drivable; merge auto-consolidates;
   VIN-less asset; etc. Includes **SF-AUTO-04** (delete-lines API 500) and **SF-AUTO-06** (UI
   clock-out).
6. **Spec/design flags for Milos — the question sheet IS PRODUCED (2026-07-20), SEND IT:**
   `PO-Questions-Milos-SpecV26_2026-07-17.xlsx/.md` covers (a) the **S8-R7
   leftover-sentence contradiction** (tail "after it locks, only cost remains editable"
   vs the new "cost editable only when $0" rule) = Q1; (b) the **Vendors-Expenses
   exclusion surface confirm** (Δ12 S6-R6) = Q2; (c) the **S10-R2 residue** (struck rule
   vs the surviving Story-10 AC bullets + Technical-guardrails paragraph) = Q3.
   NOT on the sheet (recorded on its QA tab): (d) the Receive-screen **S12-R1 (bottom) vs
   S12-R3 (leads)** text — already answered by Milos Round-3 Q1 (split ruling; residual =
   dev deviation ticket, not a re-ask); (e) the Resolve Cores design still codes
   resolve-AFTER-receive vs C-R6 — a design-rev/dev item, not a PO decision (rule 7).
6.5. **Dev-side observations to route:** **OBS-6** (Part-History HTTP 500 + part-detail
   crash) + **SF-AUTO-04** API-500. (The old SF-VMIS-06 "needs vendor report" dev-route
   item was DROPPED 2026-07-17 — spec `_4` S6-R6 was rewritten to match the code.)
7. ~~SF-QB-09 unmapped in TestRail~~ — **CLOSED 2026-07-17:** SF-QB-09 was rescoped (Δ15
   part-sale order statuses) and added to TestRail = **C29909**; all 187 cases mapped.

---

## 0-CC. RETIRE EXECUTED + MILOS SPEC-V2.6 SHEET PRODUCED (2026-07-20, LATEST)

**Retirement (user ruling 2026-07-17 "Retire", explicit authorization; executed 2026-07-20):**
spec `_4` Δ8 removed the invoice-gate core-resolve module, so the 3 RETIRE-PROPOSED cases
were retired:

| SF ID | ex-TestRail | delete_case | verify | title (for the record) |
|---|---|---|---|---|
| SF-CORE-05 | C29317 | HTTP 200 | re-GET 400 (gone) | invoice-gate resolve module routes to receive the cored line |
| SF-CORE-06 | C29318 | HTTP 200 | re-GET 400 (gone) | cancelling the invoice-gate core resolution |
| SF-CORE-09 | C29321 | HTTP 200 | re-GET 400 (gone) | part-sale auto-resolve vs service manual Ok/Not OK guardrail |

- Before-snapshots + verification evidence: `spec-v4-2026-07-17/retire-snapshots-2026-07-17/`;
  full audit appended to `spec-v4-2026-07-17/testrail-update-log.md`. NOTHING else deleted
  (neighbor spot-checks C29315/C29320/C29909 alive); **run 325 untouched by us** (no results
  written; note TestRail removes a deleted case's tests from active runs by design).
- Local: bodies KEPT in `cases/group-A-settings-completion.json` with
  `viu_status = "Retired — user ruling 2026-07-17, spec _4 Δ8 removed the module"` + a
  RETIRED note carrying the ex-C-ids; the 3 rows removed from `testrail-id-map.csv`
  (mapping preserved here + in the audit log + case notes); ALL generators
  (`gen_blockers.py` / `build_workbook.py` / `build_results_workbook.py` /
  `gen_import.py`) exclude Retired cases; count assertions 187→184.
- **Deliverables regenerated over the 184 active cases:** Blockers Tracker (md/xlsx),
  SimpleFlow_V1_TestCases (xlsx/csv), SimpleFlow_Results (xlsx/csv),
  `testrail-import/simple-flow-v1-testrail-import.csv/.xlsx` (184 rows, VIU/flag-word-free);
  id-map 184/184, 0 blanks.
- **AUTHORITATIVE TALLY (184 active):** VIU-Verified **130** / VIU-Pending **22** /
  Blocked-Env **24** (was 27 — the 3 retired were Blocked-Env) /
  VIU-observed-awaiting-Milos **5** / Deviation **3**. Blockers-Tracker categories:
  READY 126 / MILOS 10 / VIU-PENDING-QA 46 / BUG-RULING 2.

**Milos spec-V2.6 question sheet PRODUCED (ready to send):**
`PO-Questions-Milos-SpecV26_2026-07-17.xlsx` + `.md`
(generator `gen_po_questions_specv26.py`; format mirrors
`SimpleFlow_PO-Decisions-for-Milos_2026-07-14` 1:1 — layman reader tab, no IDs/jargon
per rule 7, + QA-only "Evidence & mapping" tab with TestRail IDs/links per rule 8):
- **Q1** S8-R7 leftover sentence ("after it locks, only cost remains editable") vs the
  Δ14 $0-only cost rule → QA map: SF-BULK-06 / C29355.
- **Q2** Vendors-Expenses exclusion surface confirm (Δ12 / S6-R6 rewrite) → QA map:
  SF-VMIS-06 / C29343.
- **Q3** S10-R2 residue (struck first-class-part rule vs surviving Story-10 AC bullets +
  technical guardrails) → QA map: SF-PNFIX-02/03/06 + SF-QB-08 (C29364/C29365/C29368/C29433).
- Not sent (recorded on the QA tab): S12-R1-vs-R3 placement (already answered Round-3 Q1)
  and the Resolve-Cores design-flow mismatch (design/dev item, rule 7).

---

## 0-BB. SPEC `_4` (V2.6) PASS — Δ8–Δ16 APPLIED + PUSHED + AUDITED CLEAN (2026-07-17)

Applied the 2026-07-17 spec `_4` (self-labeled **V2.6**) per the delta doc
`spec-v4-2026-07-17/spec-diff-v4-2026-07-17.md` (D1 per-case table + D2 new-case plan
followed exactly; the same-day design zip re-share was CONTENT-IDENTICAL to design `_4` —
no design-driven changes). **TestRail authorized this pass** (user: "check if any test
cases need updating, if yes do that").

**TestRail push (all 200 + re-GET MATCH; audit = `spec-v4-2026-07-17/testrail-update-log.md`):**
- **2 add_section:** 4252 "Core parts — Pre-Resolve (Story 18)" + 4253 "API — Core
  Pre-Resolve (Story 18)" (under the Simple Flow group 4058).
- **13 update_case:** SF-CORE-03 (C29315), SF-CORE-04 (C29316), SF-CORE-07 (C29319),
  SF-CORE-08 (C29320), SF-BULK-10 (C29359), SF-REV-14 (C29399), SF-COMP-11 (C29300),
  SF-COMP-14 (C29303), SF-INV-01 (C29360), SF-INV-02 (C29361), SF-INV-03 (C29362),
  SF-BULK-06 (C29355), SF-VMIS-06 (C29343).
- **18 add_case (C29892–C29909):** SF-CORE-11..17 = C29892–C29898 (UI, 4252);
  SF-CORE-18/19 = C29899/C29900 (API, 4253); SF-RCV-11 = C29901 (4078); SF-RCV-12/13 =
  C29902/C29903 (4079); SF-VEND-07/08 = C29904/C29905 (4080); SF-POSEL-07 = C29906
  (4074); SF-BULK-11 = C29907 (4075); SF-WOP-04 = C29908 (4081); **SF-QB-09 = C29909**
  (4086 — the formerly-unmapped Open-Question case, now rescoped + in TestRail).
- **NO writes to run 325; NO deletions.**

**Δ-by-Δ:** Δ8 Story 18 (SV-8353) pre-resolve-before-receive core model — 8 cases
reworded to C-R1..C-R6 (gate = UNDECIDED cores only; supersedes the 2026-07-14 design-#4
un-skippable-core flip of SF-CORE-03) + 9 new cases authored (C-R1/C-R3/C-R4/C-R5/C-R8/
C-R9/invoice-immutability UI + pre-resolve-cores & C-R10 sync-back API); **retire
candidates flagged (NOT deleted): SF-CORE-05/06 (invoice-gate module gone) + SF-CORE-09
(guardrail deleted, spec silent) — awaiting the user's ruling.** Δ9 S11-R4 → new
SF-RCV-11. Δ10 S12-R6 → new SF-RCV-12/13 (does NOT resolve the SF-RCV-05/07 position
deviation — Milos Round-3 ruling stands). Δ11 S13-R8 → new SF-VEND-07/08. Δ12 S6-R6
rewritten-to-match-code → **SF-VMIS-06 rescoped, Deviation RESOLVED (4→3), dev-route item
dropped** (now Blocked-Env: QB export leg; Vendors-Expenses leg seedable — its surface
was not in the 2026-07-14 Reports inventory, confirm live). Δ13 Apply button REMOVED →
SF-INV-01/02/03 reworded, **honestly flipped Verified→VIU-Pending** (old 'Apply to
selected POs' label was live-confirmed 2026-07-13 → expect build deviation until dev
ships). Δ14 S8-R7 cost-editable-only-when-$0 → SF-BULK-06 reworded, Verified→VIU-Pending
(+ S8-R7 tail inconsistency flagged for Milos per Rule 15.5). Δ15 part-sale POs confirmed
in scope → SF-QB-09 rescoped (Open-Question RESOLVED) + new SF-POSEL-07/SF-BULK-11/
SF-WOP-04. Δ16 header V2.4→V2.6 (metadata).

**NEW TALLY (authoritative, from `cases/*.json` viu_status) — 187 cases:**
**VIU-Verified 130 · VIU-Pending 22 · Blocked-Env 27 · VIU-observed-awaiting-Milos 5 ·
Deviation 3 (SF-SET-03, SF-RCV-05, SF-RCV-07) · Open-Question 0.** (Prior: 170 =
134/0/26/5/4/1. Movements: −4 Verified [SF-INV-01/02/03 + SF-BULK-06 → VIU-Pending],
SF-VMIS-06 Deviation→Blocked-Env, SF-QB-09 Open-Question→VIU-Pending, +17 new
VIU-Pending.)

**requirements.md promoted to V2.6** (same style as the `_3` promotion): header pointer,
S3/S4/S8 core sections struck as SUPERSEDED-by-Story-18 (dated), S6-R6/S8-R7/S8-R9/
Story-9 rewritten inline, S11-R4/S12-R6/S13-R8 added, Story-16 core paragraph updated,
full Δ8–Δ16 appendix incl. Story 18 C-R1..C-R10; `spec-v4-2026-07-17/` kept as the delta
record. **Deliverables regenerated** (import CSV/XLSX 187 rows 0-VIU/0-flag-words,
Blockers Tracker, TestCases + Results workbooks — id-map 187/187, 0 blanks; generators:
SV map +18=SV-8353, C-R# tokens excluded from the bare-R#→Story-16 refs heuristic,
assertions 170→187, Story-18 bucket added).

**ADVERSARIAL AUDIT (2026-07-17, same day) — verdict CLEAN.** Independent
full-population re-verification of the apply pass: 31/31 touched TestRail cases
(13 update_case + 18 add_case C29892–C29909) re-GET and field-diffed live-vs-local —
0 mismatches; sections 4252/4253 confirmed live under 4058 (API cases in the
API-titled section per Rule 4); retire candidates C29317/C29318/C29321 confirmed
untouched (old wording, pre-07-17 `updated_on`); run 325 spot-checked — zero results
written; independent tally recount = 130/22/27/5/3/0 = 187, matching PROJECT-STATE,
Blockers Tracker, import CSV (187 rows, 0 VIU/flag words), both workbooks, and the
id-map (187/187); full C-R1..C-R10 + Δ8–Δ16 coverage — no gaps; status honesty
confirmed (the Verified→VIU-Pending flips are correct). ONE defect found + fixed
(deliverable text only, no TestRail): `gen_blockers.py`'s hardcoded "(all 159 cases)"
Tracker-header count made dynamic (187) + Tracker md/xlsx regenerated. Audit record:
end of `spec-v4-2026-07-17/testrail-update-log.md`. Commits: df95b70 (D1 edits) →
d671f8c (17 new cases + V2.6 promote) → 30f6f19 (TestRail push) → a578ef9
(deliverables regen + state docs) + audit fix 4398091.

---

## 0-AA. SPEC `_3` (de-facto V2.5) + DESIGN `_4` PASS — Δ5 / Δ6 / Δ7 + core-block (2026-07-14, LATER)

Ran **BOTH** procedures (build-accurate wording+VIU + spec-relevance reconciliation) on the
2026-07-14 uploads per `spec-relevance-audit-2026-07-14.md` + `spec-diff-2026-07-14.md`.
**TestRail authorized this pass. Cookies `/tmp/simple-flow/cookies-0714.env` (admin+tech
quick-login 200). Settings baseline `settings-baseline-0714.json` captured + restored
BYTE-IDENTICAL after every flip. Admin-only (Tech never role-swapped).**

**TestRail push: 18 `update_case` (all GET→diff→update→verify 200/OK) + 7 `add_case`
(SF-AUTO-01..07 = C29461..C29467) + 2 `add_section` (4092 UI "Auto-Complete Trigger (Story
16 R12/R13)", 4093 "API — Auto-Complete Trigger (Story 16)"). 0 failed. No writes to run 325.**

**NEW TALLY (from `cases/*.json` viu_status; authoritative) — 170 cases:**
**VIU-Verified 134 · VIU-observed-awaiting-Milos 5 · Blocked-Env 26 · Deviation 4 ·
Open-Question 1 = 170.** (2026-07-16 Milos Round-3 applied: SF-RCV-05/07 awaiting-Milos→**Deviation**
[live VIU: vendor-missing group leads at TOP on BOTH surfaces; Bulk Receive TOP matches the ruling,
but the Receive/Accept-Delivery screen should be BOTTOM → dev bug]; SF-REV-15 awaiting-Milos→**Blocked-Env**
[new-org ON default not provisionable in shared QA]. Prior was 134/8/25/2/1.)

**MILOS ROUND-3 (2026-07-16) — reworded + pushed to TestRail (update_case, 3/3, HTTP 200, re-GET MATCH; no run writes):**
SF-RCV-05 (C29373), SF-RCV-07 (C29375), SF-REV-15 (C29400). Evidence: `viu-round3-2026-07-16/`
(observations.json + screenshots); audit: `milos-round3-answers-2026-07-16/testrail-push-log.md`.
**Q1 split ruling** (Bulk=top, Receive/Accept-Delivery=bottom): LIVE VIU shows Bulk Receive
(`/bulk-receive`) = Vendor Missing at TOP ✓, but the Receive/Accept-Delivery surface
(`/order/{id}?receive=1`, WO Receive button) ALSO shows it at TOP → **DEVIATION / dev bug**
(should be BOTTOM). Legacy `/accept-delivery/{orderId}` is a flat single-PO table (no vendor
groups). '+N' indicator lives on the PO list. **Q2:** new-org Require Review Before Completion
default = ON (ruling recorded; not observable in shared QA — org-create returns 405/404).
**Spec-cleanup flag for Milos:** S12-R1 (bottom) vs S12-R3 (leads) still unscoped in the spec text.

**Δ5 — Story 16 R12/R13 auto-complete (NEW):** authored **SF-AUTO-01..07**. VIU-Verified live
(review OFF): single-line (S-15838), bulk (S-15824), split (S-15822) all auto-Complete the WO
on last-line-resolve; review ON (S-15813) → Ready for Review (Review), not Complete; API case
verified the backend status transition (view/{id} status flip). **Blocked-Env:** SF-AUTO-04
(delete-line — delete-lines API 500 in this env, requestId 768518b…, + no Chromium harness),
SF-AUTO-06 (clock-out — per-line clock-out not API-exposed + no Chromium). Sanity clauses added
to SF-COMP-09 + SF-REV-01/05/08/11.

**Δ6 — S1-R9 settings apply on reopen:** **SF-SET-10 (C29284)** VIU-Verified — non-retroactive
to WOs left completed CONFIRMED (untouched completed WO stayed Complete after flipping review
ON); apply-on-reopen OBSERVED (re-triggering the completed WO's last-line-resolve under review
ON routed it Complete→Review). **This resolves the SV-8303 / SF-SET-10 open thread** (Ayesha's
Failed remark cited exactly this coming spec change).

**Δ7 — S10-R2 first-class-part deprecation (APPLIED, QA-lead last-update-wins ruling):**
SF-PNFIX-02/03/06 + SF-QB-08 rescoped (first-class inventory/catalog creation dropped; PN
persists + part-becomes-receivable retained) → all 4 flipped **Blocked-Env → VIU-Verified**.
`requirements.md` V2.4 note #6 marked **REVERSED/deprecated** (dated). *Doc inconsistency
flagged: `_3` strikes R2 but leaves the Story-10 AC bullets + Technical-guardrails paragraph
still describing first-class-part creation — flagged for spec cleanup.*

**Design `_4` — waiting special-order core un-skippable at completion:** **SF-CORE-03 (C29315)
FLIPPED** (Complete Without Receiving now DISABLED + tooltip + Receive Parts while a core waits;
was "stays available"); knock-on caveats/alignment to SF-COMP-11/14 + SF-CORE-05/06/07 +
SF-BULK-10 + SF-REV-14. Wording set to design #4 copy. **The core-behavior VIU stays Blocked-Env
— a special-order (vendor-sourced) core is NOT seedable in this build (P550848 is_core=0;
vendor-sourced request drops the core attribute); needs a dev-seeded special-order core.** The
design #4 tooltip/card copy is pending live confirm.

**Env residue:** 3 pre-existing QA test WOs (S-15838, S-15824, S-15822) were completed during the
Δ5 drive and could not be uncompleted via API (needs the UI three-dot Uncomplete); low-impact,
reversible in-app. The split-created throwaway WO was deleted. Settings restored byte-identical.

**New/changed C-IDs:** SF-AUTO-01=C29461, -02=C29462, -03=C29463, -04=C29464, -05=C29465,
-06=C29466, -07=C29467 (in `testrail-id-map.csv`).

---

## 0-ZZ. VIU GRIND — ALL VIU-PENDING DRIVEN TO A VERDICT (2026-07-14)

Full re-VIU grind over the 33 remaining VIU-Pending cases (plus the Blocked-Env/Milos
residue). **Every case now has a definitive disposition — VIU-Pending = 0.** Admin-only
(Tech never role-swapped; only quick-login used); settings toggled during the run then
**restored BYTE-IDENTICAL** to baseline (verified); cookies `/tmp/simple-flow/cookies.env`
(session f191f2a…) valid throughout; fresh MITM bridge per run.

**NEW TALLY (from `cases/*.json` viu_status; authoritative):**
**VIU-Verified 125 · VIU-observed-awaiting-Milos 8 · Blocked-Env 27 · Deviation 2 ·
Open-Question 1 = 163.** (Was 118 / 33 VIU-Pending / 10 Blocked-Env / 1 Deviation / 1
Open-Question.) 49 cases carry `fresh_run:2026-07-14`.

**Flipped VIU-Pending → VIU-Verified (7):**
- **SF-VAL-11** — unapproved (Needs Approval) line disables the **Complete Work Order**
  button with the GENERIC tooltip "Every line must be approved or declined in order to
  complete the work order." — confirmed identical with Require Vendor Invoice Number ON
  and OFF; approving the line re-enables it. **Build-vs-spec: the disabled-button gate is
  UNIVERSAL, not Story-4-only** (OBS-7; expected, not a defect). Wording error corrected +
  **pushed to TestRail (C29425, update_case, verify 200/OK — the ONLY TestRail write this
  session).**
- **SF-SET-10** — completed WO (S2-15844) not retroactively re-gated after flipping
  Require Vendor Invoice + Require Review ON (future completions only).
- **SF-VEND-06, SF-VEND-04, SF-VAL-06, SF-RCV-06, SF-PNFIX-05** — vendor-missing receive
  gates on the Bulk Receive page (seeded vendor-missing PO S-15845): no vendor → Receive
  disabled; vendor auto-assigned (POST assign-vendor 200, NO merge prompt, QB flag cleared)
  + no PN → disabled; PN + cost/sell=0 → disabled; PN + invoice + cost + sell → receivable.

**VIU-observed-awaiting-Milos (8) — current build behavior recorded, NO pass/fail on the
undecided policy:** SF-SET-08 (first-use defaults — brand-new-org only; no createPurchaseOrders
field), SF-COMP-06 (Create-POs toggle absent, POs always-on), SF-RCV-05 / SF-RCV-07
(Vendor-Missing group renders TOP on Bulk Receive — Q11 ordering), SF-REV-11 (direct sign-off
confirmed; invoicing-block leg = Q8), SF-REV-15 (require-review cohort default — brand-new-org),
SF-UX-04 (close/cancel modal "still to be added"), SF-QB-02 (toggle absent + QB not connected).

**Deviation +1:** **SF-VMIS-06** — the Reports area has NO Vendor-Missing/"needs vendor" PO
report (only PO list/detail flag exists, SF-VMIS-02). Spec S6-R6 not implemented as a report.

**RESIDUE — genuinely NOT VIU-able here (27 Blocked-Env, all precise; the definitive list):**
- **Special-order (vendor-sourced) cores not creatable (9):** SF-CORE-03..09, SF-BULK-10,
  SF-REV-14. Reconfirmed live: a `make-request` with `source=vendor` for the core catalog
  part P550848 returns `is_core=false / core_charge=0` (core attribute only attaches on the
  inventory-source path). Inventory-core resolution stays verified (SF-CORE-01/02/10).
- **Invoiced/paid WO not drivable (3):** SF-VAL-09, SF-VEND-05, SF-PNFIX-04. Finance
  "Create Invoice" / Estimate-Invoice toggle only fires an estimate recompute (is_invoice_created
  stays false); invoice-create APIs 404; marking paid needs a payment step.
- **Inline-PN inventory/Part-History not verifiable (3):** SF-PNFIX-02/03/06. Receive with a
  new PN succeeds (200) but the PN doesn't surface in inventory search and the Part-History/
  part-detail surfaces are OBS-6-blocked (500/crash). Flag for dev.
- **QuickBooks not connected on sv7301 (9):** SF-QB-01 (QB leg; decrement half proven,
  Part-History OBS-6), SF-QB-03/04/05/06/07/08, SF-VMIS-03, SF-RCV-08. No QB in the Admin menu,
  QB APIs 404, no integrations page, invoice_shop_id=null. Needs a QB-connected company + a
  human in QuickBooks.
- **Merge/Keep-Separate collision not reachable (2):** SF-VEND-02/03. Build auto-consolidates
  same-WO vendor-missing parts into ONE PO; assign-vendor auto-assigns with no prompt.
- **VIN-less asset not seedable (1):** SF-VAL-02. Asset-create API 404/405; new-asset UI
  requires a VIN; all existing assets carry a VIN.

**Open-Question (1):** SF-QB-09 — dev BE investigation, not UI-observable, still unmapped in
`testrail-id-map.csv` (no C-ID).

**New log entries:** bugs-log.md OBS-7 (universal unapproved-line gate) + QB-not-connected note;
testrail-wording-viu-log.md (SF-VAL-11 C29425 push). Deliverables regenerated
(`SimpleFlow_Blockers_Tracker.*`, `SimpleFlow_Results.*`) with TestRail ID + Link columns.

**Shared-env residue (harmless, disposable):** throwaway ZZAUTOTEST WOs created/completed this
run (S2-15844/45, S-15846/49/50) with 2 irreversible received deliveries (POs 0ee75c5f, d931d7ec
— received deliveries are not reversible in-app). Settings restored byte-identical (verified);
Tech still Technician.

---

## 0-Z. RUN-325 RE-VERIFY — 5 cases settled (2026-07-14)

Verified live re-VIU pass to settle the 5 run-325 discrepancies (see
`run325-reconciliation-2026-07-13.md` §7 for full detail). Admin-only; boot2 hydration;
settings restored **byte-identical** to baseline; Tech untouched.
- **SF-COMP-02 (C29291) / SF-TECH-02 (C29324) / SF-VPART-06 (C29336)** — all
  **REAFFIRMED VIU-Verified**; Ayesha's fails were **FALSE/STALE** (no new bug). No wording
  change → no TestRail write.
- **SF-COMP-21 (C29310) / SF-COMP-22 (C29311)** — **FLIPPED VIU-Pending → VIU-Verified**
  (required-invoice unapproved line disables "Complete Work Order" + tooltip; confirmed for
  both Auto-approve OFF and ON). **Tooltip wording fix** (build tooltip is generic:
  "Every line must be approved or declined in order to complete the work order." — does not
  name the line) pushed to TestRail: **2 `update_case` (custom_expected), 200/OK, 0 errors.**
- **Tally impact:** VIU-Verified **116 → 118**, VIU-Pending **35 → 33** (net +2 / −2).

---

## 0-A. BUILD-ACCURATE WORDING + VIU PASS — COMPLETE for all 18 areas (2026-07-13, QA-lead authorized)

Combined build-accurate-wording + VIU pass done **area by area across all 163 cases**
(`build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md`). Live labels →
`wording-glossary-2026-07-13.md`; per-case audit → `testrail-wording-viu-log.md`;
screenshots → `screenshots/wording-2026-07-13/`. Every case carries
`fresh_run:2026-07-13`. Env baseline captured + restored **byte-identical** after
every settings flip (`/tmp/simple-flow/settings-baseline-0713.json`); Tech never
role-swapped; roles matrix fresh + no drift (`roles-matrix-2026-07-13.md`).

**Final tally (regenerated by `build_results_workbook.py` / `gen_blockers.py`):**
VIU-Verified **118** · VIU-Pending **33** · Blocked-Env **10** · Deviation **1**
(SF-SET-03) · Open-Question **1** (SF-QB-09) = **163**. Blocker tracker: READY 114 /
BLOCKED — VIU PENDING (QA) 36 / BLOCKED — MILOS ANSWER 13.
(Counts reflect the 2026-07-14 run-325 re-verify flips; see §0-Z.)

**TestRail push (update_case only, curl+Basic auth, GET→diff→update→verify):**
**~171 update_case calls across the 18 areas, every one verified 200/200, 0 errors.**
Only SF-QB-09 was skipped (no C-ID — Open-Question, not in id-map, not created).

**Notable build corrections (wording made build-accurate):** SF-SET-01 dropped the
non-build "new vs existing visually distinct" claim; SF-SET-04 exact verbatim helper
text; review CTA corrected to **"Send To Review"** (SF-REV-02 + SF-SET-14); receive
labels **"Back To Purchase Orders" / "Apply to selected POs" / "Receive All"**;
SF-TECH-07 reworded from the dev `input_tech_story` test-id to a tester check;
story-ref/enum/HTTP jargon stripped from tester-facing fields throughout.

**Build findings surfaced:** SF-SET-03 Deviation (no Create-Purchase-Orders toggle);
**completion modal has NO VIN field even review-off** (only Mileage + Engine Hours) —
broader than V2.4 Δ1 (corrected SF-COMP-16 / SF-VAL-02 / SF-REV-03 / SF-UX-02).

**Genuinely pending/blocked (precise reasons in the audit log):** delta receive-gates
+ vendor-missing cases need a **seeded vendor-missing PO** (SF-VEND-04/06, SF-RCV-06,
SF-PNFIX-05, SF-VAL-06, SF-RCV-05/07, SF-VMIS-06); the required-invoice
**disabled-Complete-button** deltas: SF-COMP-21/22 now **VERIFIED** (run-325 re-verify
2026-07-14, §0-Z); SF-VAL-11 still needs a **Needs-Approval line**;
**special-order cores** non-seedable (SF-CORE-03..09, SF-BULK-10, SF-REV-14);
**invoiced/paid WO** not drivable (SF-VAL-09, SF-VEND-05, SF-PNFIX-04);
**VIN-less asset** non-seedable (SF-VAL-02); **OBS-6 Part-History 500**
(SF-PNFIX-02/03/06, SF-QB-01/04/08); **QuickBooks internals** need a human in QB
(SF-QB-02/03/05/06/07, SF-RCV-08, SF-VMIS-03); **brand-new-org** cohort defaults
non-seedable (SF-SET-08, SF-REV-15). Milos Round-3 still pending.

**FOLLOW-UP:** SF-QB-09 remains unmapped in `testrail-id-map.csv` (no C-ID) — it is an
Open-Question / dev-investigation case, deliberately not created in TestRail; assign a
C-ID only if it is imported after dev confirmation.

**Shared-env residual (harmless, disposable):** completed labor-only WOs S2-15795,
S2-15825, S2-15823, S2-15813 during completion/review surface capture. All settings
flips restored byte-identical (verified); Tech still Technician.

---

## 0-B. SPEC-RELEVANCE AUDIT + FIX (2026-07-13)

A spec-relevance / obsolescence audit (`spec-relevance-audit-2026-07-13.md`) was run
over all 163 cases. **Result: 0 truly-obsolete cases, 0 cases contradicting a resolved
ruling.** The genuine gaps were narrow and are now CLOSED:

- **FIX 1 — 3 missed stale-label cases corrected + re-VIU'd LIVE and pushed to
  TestRail (200/OK):** SF-REV-02 (C29387), SF-REV-05 (C29390), SF-REV-13 (C29398)
  carried the old label "Complete & Send to Review". **Live re-VIU (Require Review ON,
  WOs S2-15827 / S2-15783; admin only, Tech not switched, no settings change)
  established the build-accurate labels:** the clickable primary action button =
  **"Send To Review"** (both ready and part-bearing WOs; replaces "Complete Work
  Order"); for a part-bearing WO clicking it opens a dialog **HEADED "Complete & Send
  to Review"** (body "N part waiting to receive"; buttons Cancel / Receive Parts /
  Send To Review); with an unapproved line the **"Send To Review" button is DISABLED**.
  So "Complete & Send to Review" IS a real build string — the review-dialog HEADER, not
  the button. Cases reworded accordingly and pushed (3 update_case, all verify 200/OK;
  audit `testrail-wording-viu-log.md`). Evidence:
  `screenshots/relevance-fix-2026-07-13/`.
- **FIX 2 — ALL downstream deliverables regenerated from the current `cases/*.json`**
  (they had lagged the delta + wording passes): `testrail-id-map.csv` (27 stale titles
  refreshed; SF-QB-09 still unmapped), `testrail-import/simple-flow-v1-testrail-import.csv`
  + `.xlsx` (via `gen_import.py`; VIU-word-free, flag-free), `simple-flow-UPDATE.xml`
  (full 162-case current-wording update), `simple-flow-v2.4-update.xml` (regenerated to
  current wording + marked SUPERSEDED/dated), `SimpleFlow_Blockers_Tracker.md`/`.xlsx`,
  `SimpleFlow_Results.xlsx`/`.csv`. Also fixed two stale internal-metadata leaks:
  SF-REV-08 `story_ref` ("distinct Reviewed state" → "direct sign-off, no separate
  Complete") and the `gen_blockers.py` Milos-Q descriptor (dropped the `input_review_note`
  test-id). **Grep-clean:** the audit's stale phrases (input_review_note, "mileage, VIN,
  engine hours", "distinct Reviewed state", "optional review note" as an assertion,
  Story-4 "error toast") = ZERO in current-wording deliverables. Remaining "Complete &
  Send to Review" strings are the live-verified build dialog HEADER (build-accurate), and
  the single "optional review note" in the Results Deviation/Bugs tab correctly documents
  the note's REMOVAL.

**PROCESS RULE (now standing):** deliverable-regeneration is part of closing ANY
spec-delta or wording pass — after editing `cases/*.json`, always re-run
`gen_import.py` + `gen_update.py` + `gen_blockers.py` + `build_results_workbook.py`
and refresh `testrail-id-map.csv` titles, so no downstream artifact silently shows
superseded wording.

---

## 0. CURRENT STATE AT A GLANCE (read this first)

**Current tally (2026-07-20 — retire executed on top of the spec `_4` / V2.6 state;
see §0-CC; authoritative — counted directly from `cases/*.json` `viu_status`,
187 authored bodies of which 3 are Retired → 184 ACTIVE):**

| VIU status field (`cases/*.json`) | Count |
|---|---:|
| VIU-Verified | **130** |
| VIU-Pending (Story-18 set + Δ13/Δ14 re-VIU flips + Δ9-Δ11/Δ15 new) | **22** |
| Blocked-Env | **24** |
| VIU-observed-awaiting-Milos | **5** |
| Deviation (SF-SET-03, SF-RCV-05, SF-RCV-07) | **3** |
| Open-Question | **0** |
| **TOTAL ACTIVE** | **184** |
| (Retired — excluded from deliverables: SF-CORE-05/06/09, ex C29317/18/21) | (3) |

(Spec `_4` movements vs the 2026-07-16 tally 134/5/26/4/1: SF-INV-01/02/03 + SF-BULK-06
Verified→VIU-Pending; SF-VMIS-06 Deviation→Blocked-Env; SF-QB-09
Open-Question→VIU-Pending; +17 new VIU-Pending cases.)

Total is 187: the prior 170 + 17 new spec-`_4` cases (SF-CORE-11..19, SF-RCV-11..13,
SF-VEND-07/08, SF-POSEL-07, SF-BULK-11, SF-WOP-04). **ALL 187 cases are current in
TestRail** — SF-QB-09 is now C29909 (the "deliberately not in TestRail" note is
resolved). (Prior 2026-07-14 grind tally was 163 = 125/8/27/2/1;
the spec `_3`/design `_4` pass then added +7 SF-AUTO [5 Verified, 2 Blocked-Env] and
flipped +4 from Blocked-Env→Verified via the Δ7 rescope of SF-PNFIX-02/03/06 +
SF-QB-08 → 134 Verified / 25 Blocked-Env; see §0-AA.)

The blocker-category axis in `SimpleFlow_Blockers_Tracker.md` (READY / VIU-PENDING /
MILOS-ANSWER) is a SEPARATE grouping from `viu_status` and is not a duplicate of the
above — use the `viu_status` tally as the canonical status count.

**✅ DONE (through 2026-07-14) — full VIU-process pass complete, spec `_3`/design `_4`
ingested and BOTH procedures run, all VIU-Pending driven to a verdict, everything
mapped is current in TestRail.** In order:
(a) full **build-accurate wording + VIU pass over ALL 163 cases** per
`build/BUILD-ACCURATE-WORDING-VIU-PROCESS.md` — pushed to TestRail earlier (all
200/200, only SF-QB-09 skipped: no C-ID; §0-A); (b) **V2.4 deltas Δ1-Δ4 APPLIED**
(9 cases + new SF-VEND-06 = C29442, pushed 10 writes 200/200); (c) **reviewer ≠
completer DESCOPED** (Milos ruling — self-review allowed when the role holds the Mark
Reviewed permission; BUG-5 dropped); (d) **spec-relevance reconciliation** — 0
obsolete cases, 3 stale-label cases fixed + re-pushed, all downstream deliverables
regenerated and grep-clean (§0-B); (e) **run-325 (Ayesha Khan) reconciled** — 3
disputed fails REAFFIRMED VIU-Verified (SF-COMP-02/TECH-02/VPART-06), SF-COMP-21/22
flipped VIU-Verified (§0-Z); (f) the **2026-07-14 VIU grind** drove the remaining
VIU-Pending to a verdict — 7 flipped VIU-Verified, 8 recorded VIU-observed-awaiting-
Milos, SF-VMIS-06 became a new Deviation, 17 settled to Blocked-Env (§0-ZZ);
(g) the **spec `_3` (de-facto V2.5) + design `_4` pass (§0-AA, LATER 2026-07-14)** —
BOTH procedures run (relevance reconciliation + build-accurate wording+VIU): Δ5
auto-complete (Story 16 R12/R13 = SV-8303) authored **7 new SF-AUTO cases**
(C29461–C29467; SF-AUTO-01/02/03/05/07 Verified, 04 + 06 Blocked-Env), Δ6 settings-
apply-on-reopen flipped **SF-SET-10** Verified (resolves the SV-8303 / Ayesha run-325
Failed thread), Δ7 S10-R2 first-class-part DEPRECATION rescoped SF-PNFIX-02/03/06 +
SF-QB-08 → Verified, and design `_4` flipped **SF-CORE-03** (special-order core
un-skippable at completion — but core BEHAVIOR still Blocked-Env: no seedable
vendor-sourced core). TestRail: **18 update_case + 7 add_case + 2 add_section, all
200/200, 0 fail; no writes to run 325.** Roles matrix re-derived fresh — **Technician
NOT drifted on sv7301**. **Final tally (pre-Round-3) 134 Verified / 8 awaiting-Milos / 25
Blocked-Env / 2 Deviation / 1 Open-Question = 170; VIU-Pending = 0. → After Milos Round-3
(2026-07-16): 134 Verified / 5 awaiting-Milos / 26 Blocked-Env / 4 Deviation / 1 Open-Question.**

**Build findings for dev:** **OBS-6** — Part-History surface HTTP 500
(`GET /api/inventory/parts/history`) + part-detail page crash (`/parts/inventory/{id}`);
**OBS-7** — the disabled-Complete-Work-Order gate on an unapproved (Needs Approval)
line is UNIVERSAL, not Story-4-only (expected behavior, not a defect). Two Deviations:
**SF-SET-03** (no "Create Purchase Orders" toggle; POs always-on) and **SF-VMIS-06**
(no Vendor-Missing "needs vendor" PO report — spec S6-R6 not implemented as a report).

**Historical — 4 V2.4 spec deltas (Δ1-Δ4) applied to cases + pushed to TestRail**
(`spec-diff-2026-07-13.md`, a byte-identical re-delivery of the 2026-07-10 silent
V2.4 revision). Applied to `requirements.md`, `cases/*.json`, and TestRail
(9 update_case + 1 add_case, all verified 200/200 — audit log
`testrail-delta-push-0713-log.md`):
- **Δ1 — VIN dropped from the Story-4 completion modal** (S4-R3: mileage + engine
  hours; VIN → reviewer/Story 16). Applied: **SF-COMP-16, SF-VAL-02**. VIN NOT
  over-removed — Story 3 (S3-R3) / Story 15 (S15-R2) keep VIN for the review-off
  modal, so SF-UX-02 / SF-REV-03 stayed spec-accurate (no change).
- **Δ2 — Story-4 unapproved-line = Complete button DISABLED + tooltip** (S4-R8),
  **Story 4 only**; Stories 2/3/16 keep the error-toast/active-CTA model. Applied:
  **SF-COMP-21, SF-COMP-22, SF-VAL-11** (each now disambiguates the two flows;
  SF-REV-13 unchanged).
- **Δ3 — NEW receive-time gates S13-R6 (part# required) + S13-R7 (cost/sell
  required)**. Applied: **SF-VEND-04, SF-VAL-06, SF-RCV-06, SF-PNFIX-05** + **NEW
  case SF-VEND-06 = C29442** (dedicated S13-R7 cost/sell receive gate; functional
  Story-13 section, UI-affordance, per rule 4).
- **Δ4 — Mark-Reviewed "optional note" removed** (R7: VIN-only). **SF-REV-06 /
  SF-REV-10** were already note-free (Milos Round-2) so no case-content / TestRail
  change was needed — V2.4 2026-07-13 confirms; the R10 `input_review_note`
  test-id leftover is flagged (not asserted) in requirements.md R7 + both cases.
- The Δ cases were then re-verified live in the **full wording + VIU pass (§0-A,
  DONE 2026-07-13)** — Story-4 modal field set, disabled+tooltip affordance, S13-R6/R7
  receive blocks, Mark-Reviewed note absence. Every case carries `fresh_run:
  2026-07-13`.
- The doc also folds the SV-8183 permissions section into the spec body — content
  we **already** hold in `requirements.md` §9 (no new action). It resolves **none**
  of the Round-3 PO questions and does not moot the $0-sell (Q5) or
  See-Financial-Data-gate (Q6) tensions. Full proposal: `spec-diff-2026-07-13.md`.

**New design bundle (2026-07-10, `890a4d0a-Simple_Flow_Design_2.zip`):**
byte-identical re-delivery of the 2026-07-09 bundle — **NO impact** (0 new / 0
changed design docs; 0 case impacts). Preserved at `design2-2026-07-10/`. Full
diff: `design-diff-2026-07-10.md`.

**What today's (2026-07-10) fresh VIU run accomplished:**
- **9 cases flipped VIU-Pending → VIU-Verified:** inventory-decrement live-proven
  (SF-COMP-07 + SF-QB-01 decrement-half), completion Pick step (SF-COMP-08), the
  bulk-receive cluster (SF-VAL-05, SF-VAL-06, SF-VPART-07, SF-PNFIX-01, SF-COMP-19,
  SF-COMP-13, SF-REV-04). **BUG-11 NOT reproduced** on the Bulk Receive path.
- **reviewer ≠ completer DESCOPED** (Milos ruling, relayed by QA lead): the identity
  block is NOT a v1 requirement — **self-review IS allowed when the role holds the
  Mark Reviewed permission (permission-gated only)**. SF-PERM-04/07 + SF-REV-09
  expecteds corrected (identity assertion removed, permission-gating retained);
  **SF-PERM-08 RE-PURPOSED** into the positive self-review case (NOT obsolete).
  **BUG-5 / TICKET 1 DROPPED** as expected behavior → BUG-RULING 4 → 0, READY 114 → 118.
- **4 cases pushed to TestRail** (QA-lead authorized): SF-PERM-04 (C29408),
  SF-PERM-07 (C29411), SF-PERM-08 (C29412), SF-REV-09 (C29394) — update + verify 200;
  audit `testrail-push-v2.4-log.md`. (Earlier same-week: SF-WOP-02 expected
  refinement pushed, case 29384.)
- **Per-role behavior matrix re-added to `requirements.md` §9** under its canonical
  SV-8183 title (matches §9.2 cell-for-cell — no conflict).
- **NEW env/build defect OBS-6 logged for dev:** the Part-History surface returns
  HTTP 500 (`GET /api/inventory/parts/history` → 500) and the part-detail page
  (`/parts/inventory/{id}`) crashes — blocks the Part-History log half of SF-QB-01
  and the vendor-PN inventory checks (SF-PNFIX-02/03/06).

**Env residual from the run (shared env — do NOT assume baseline):** P550848
inventory net 6→4 (2 units consumed by pick/decrement tests; WOs already gone so
units couldn't be returned); irreversible received ZZAUTOTEST deliveries
S-15797/S-15798 (received deliveries are not reversible in-app). All throwaway WOs
deleted; settings toggled during the run then RESTORED to the run baseline (verified);
Tech never swapped (still Technician).

**Waiting on / blocked (see §5 for detail):**
1. **8 VIU-observed-awaiting-Milos** — behavior observed & recorded, POLICY undecided
   (no pass/fail on the undecided leg): SF-SET-08, SF-COMP-06, SF-RCV-05, SF-RCV-07,
   SF-REV-11, SF-REV-15, SF-UX-04, SF-QB-02. These + the earlier MILOS set gate on
   Milos Round-3 answers.
2. **25 Blocked-Env** — genuinely NOT VIU-able in this harness, each with a precise
   reason (see §0-ZZ / §0-AA): QuickBooks not connected on sv7301 (9:
   SF-QB-01/03/04/05/06/07, SF-VMIS-03, SF-RCV-08 — needs a QB-connected company + a
   human in QB; NOTE SF-QB-08 rescoped out via Δ7); special-order vendor-sourced cores
   not creatable — needs a dev-seeded core (SF-CORE-03..09, SF-BULK-10, SF-REV-14);
   invoiced/paid WO not drivable (3); merge/keep-separate auto-consolidates (2);
   VIN-less asset not seedable (1); **SF-AUTO-04 (delete-lines API 500) + SF-AUTO-06
   (UI clock-out not drivable)** (2). (Was 27; the Δ7 rescope moved SF-PNFIX-02/03/06 +
   SF-QB-08 to Verified, and +2 SF-AUTO Blocked-Env were added → 25.)
3. **3 Milos deliverables READY TO SEND:** `PO-Questions-Round3.xlsx`,
   `SimpleFlow_Bugs-for-Milos-Confirm.xlsx`, `SimpleFlow_Bug-Drafts.xlsx`.
4. **4 active Jira bug drafts (TICKET 2–5) UNFILED** — no Atlassian MCP in this env;
   file from the chat app. Plus **OBS-6** (Part-History 500) and the **SF-VMIS-06
   report gap** to raise with dev.
5. **SF-QB-09** is an Open-Question / dev-investigation case, **unmapped in
   `testrail-id-map.csv` (no C-ID)** — deliberately not created in TestRail; assign a
   C-ID only if imported after dev confirmation. Follow-up.
6. **Jira SV-8303** — a coming spec change flagged by Ayesha on SF-SET-10; ingest in
   the next spec round.
7. TestRail import files remain **INTERIM** (two-phase finalization; finalize after
   Round-3 + the remaining blocked VIU clear). **A QA execution run DOES exist —
   run 325 "Simple Flow - Ayesha Khan -> Specs 7/7/2026"** (project 1 / suite 1;
   snapshot **48 Passed / 6 Failed / 13 Blocked / 89 Untested**; results logged by
   Ayesha 2026-07-13). It was **NOT created by us** — it is Ayesha's/QA's run; **we
   do not write results to it without explicit permission.** We keep NO execution run
   of our own. Reconciliation: `run325-reconciliation-2026-07-13.md` (5 discrepancies
   settled 2026-07-14, §0-Z — the 3 disputed fails reaffirmed Verified, SF-COMP-21/22
   flipped Verified).

---

## 1. Summary

**What Simple Flow is:** ShopView **"Simple Mode — Streamlined Work Order
Completion & Bulk Receiving"** (Epic **SV-7301**, Owner @Milos Vasic). It shortens
/ skips legacy multi-step work-order completion and parts-receiving flows so users
reach the **same end state faster** — one-confirm WO completion, an in-modal
completion wizard, bulk PO receiving, vendorless / no-PN parts, inline part-number
fix, and an optional review sign-off gate. Behavior is **settings-driven** (the
Work Orders settings tab), **not** feature-flag-gated.

**Spec version:** **V2.4** → de-facto **V2.5** via the 2026-07-14 spec `_3` upload
(Δ5/Δ6/Δ7) + design `_4`. 17 stories: S1–S15 = SV-7696..SV-7710, S16 = SV-7870
(now incl. R12/R13 auto-complete = SV-8303), S17 = SV-7876. Authoritative inputs =
the **V2.4 spec doc + spec `_3` deltas** + the **2026-07-14 design `_4`** (last-update-
wins over the earlier round-1 Milos answer sheet + the reversed V2.4 note #6). Future
uploads under the same label may carry uncatalogued edits, so always diff, never trust
the version string.

**Overall status:** Cases **authored (170)** = 163 (162 + SF-VEND-06) + 7 new SF-AUTO,
permissions applied (SV-8183), V2.4 Δ1-Δ4 + spec `_3` Δ5/Δ6/Δ7 + design `_4` applied,
**full build-accurate wording + VIU pass DONE** (§0-A), spec-relevance reconciliation
done (§0-B, re-run 2026-07-14 in §0-AA), run-325 reconciled (§0-Z), the **2026-07-14
VIU grind drove ALL VIU-Pending to a verdict** (§0-ZZ), and the **spec `_3`/design `_4`
pass ran BOTH procedures** (§0-AA). Deliverables regenerated (workbook, interim
TestRail import, blockers tracker). VIU tally now **134 VIU-Verified / 8
VIU-observed-awaiting-Milos / 25 Blocked-Env / 2 Deviation / 1 Open-Question = 170;
VIU-Pending = 0**. Stories 7/8/9/14/16-auto confirmed BUILT & live-verified
(DEV-NOT-BUILT = 0). **All 169 mapped cases are current in TestRail** (SV-8183 batch,
V2.4 reconciliation batch, Milos Round-2 batch, reviewer-descope batch, the 10 Δ1-Δ4
writes, the full wording+VIU pass, and the spec `_3`/design `_4` push = 18 update_case
+ 7 add_case + 2 add_section — all pushed & verified 200/200); only SF-QB-09 (no C-ID)
is not in TestRail. Remaining work is the 8 awaiting-Milos + the earlier MILOS set
(Round-3 answers) + the 25 Blocked-Env (non-seedable data / QuickBooks / invoiced-paid
WO / dev-seeded special-order core / SF-AUTO-04 API-500 + SF-AUTO-06 UI clock-out) +
filing the bug drafts + Phase-2 import finalization. **Do NOT write to TestRail without
explicit user permission.**

---

## 2. Case inventory

**Total authored cases: 170** (source: Blockers Tracker header; 163 [162 + SF-VEND-06]
+ 7 new SF-AUTO C29461–C29467).

**By authoring group (`cases/*.json`):**

| Group file | Scope |
|---|---|
| `group-A-settings-completion.json` | Settings, Completion (Stories 1–4), Cores, Tech story, **Auto-Complete Trigger (Story 16 R12/R13 = SF-AUTO)** |
| `group-B-receiving-vendor.json` | Vendorless parts, Vendor-missing PO, PO multi-select, Bulk receive, apply-invoice, PN-fix, Receive/Accept-Delivery (incl. new SF-VEND-06) |
| `group-C-review-permissions-validation-edge.json` | Review (Story 16), UX, Permissions, Validation/Edge, QuickBooks/Inventory integrity, **SF-AUTO-07 (API auto-complete)** |

**By blocker category (Blockers Tracker "Summary — counts per category"):**

| Blocker category | Count | Owner |
|---|---:|---|
| READY (VIU-Verified, uploadable now) | 130 | — |
| BLOCKED — DEV NOT BUILT | 0 | Dev team (Stories 7/8/9/14/16-auto built) |
| BLOCKED — VIU PENDING (QA) | 27 | QA |
| BLOCKED — MILOS ANSWER | 13 | Milos (PO) |
| BLOCKED — BUG/RULING | 0 | — |
| **TOTAL** | **170** | |

**VIU status field tally across the case JSONs (authoritative; counted directly from
`cases/*.json`, 2026-07-14 after the spec `_3`/design `_4` pass):** VIU-Verified **134**
· VIU-observed-awaiting-Milos **8** · Blocked-Env **25** · Deviation **2** (SF-SET-03,
SF-VMIS-06) · Open-Question **1** (SF-QB-09) (= 170). **VIU-Pending = 0.** The
blocker-category table above uses a separate grouping axis (READY / VIU-PENDING /
MILOS-ANSWER) and does not map 1:1 to `viu_status`. **BUG/RULING is 0** and
**DEV-NOT-BUILT is 0.**

**Stories 7/8/9/14 — CONFIRMED BUILT on sv7301 (RE-VIU BATCH 7, 2026-07-09):**

| Story (Jira) | Cases | Status now |
|---|---|---|
| Story 7 — PO multi-select (SV-7702) | SF-POSEL-01..06 | BUILT — all VIU-Verified |
| Story 8 — PO Bulk Receive page (SV-7703) | SF-BULK-01..10, SF-PERM-03, SF-VAL-09 | BUILT — SF-BULK-01..09 + SF-PERM-03 Verified; SF-BULK-10 (needs-data core) + SF-VAL-09 (needs invoiced/paid WO) VIU-Pending |
| Story 9 — Apply invoice to selected POs (SV-7704) | SF-INV-01..03, SF-VAL-10 | BUILT — all VIU-Verified |
| Story 14 — Waiting-on-Parts column (SV-7709) | SF-WOP-01..03 | BUILT — all VIU-Verified |

**VIU-PENDING (QA) (38) by data need (tracker + §0-A audit):** vendor-missing-PO
seeding (receive-gate deltas: SF-VEND-04/06, SF-RCV-05/06/07, SF-PNFIX-05,
SF-VAL-06, SF-VMIS-06); a Needs-Approval line (SF-COMP-21/22, SF-VAL-11);
non-seedable special-order cores (SF-CORE-03..09, SF-BULK-10, SF-REV-14);
invoiced/paid WO (SF-VAL-09, SF-VEND-05, SF-PNFIX-04); VIN-less asset (SF-VAL-02;
POST /api/vehicles 405); OBS-6 Part-History 500 surface (SF-PNFIX-02/03/06,
SF-QB-01/04/08); QuickBooks internals needing a human in QB (SF-QB-02/03/05/06/07,
SF-RCV-08, SF-VMIS-03); brand-new-org cohort defaults (SF-SET-08, SF-REV-15).

---

## 3. TestRail state

- **Project 1 · Suite 1 "Master"** on `https://shopview.testrail.io`.
- Cases imported under **parent section 4058** (leaf sections per functional area).
- **API sections** (STANDING RULE 4): **`API — Work Order Settings` (section 4089)**,
  **`API — Permissions` (section 4090)**, and the NEW **`API — Auto-Complete Trigger
  (Story 16)` (section 4093)** — plus the new UI leaf **`Auto-Complete Trigger (Story
  16 R12/R13)` (section 4092)**. API cases: SF-SET-04/07/09/11/12, SF-PERM-01/06,
  **SF-AUTO-07**.
- **Case-ID map:** `build/simple-flow/testrail-id-map.csv` — `sf_id,title,section` +
  C-ID rows. New cases SF-VEND-06 = **C29442**; **SF-AUTO-01..07 = C29461..C29467**.
  **SF-QB-09 remains unmapped (no C-ID)** — Open-Question, deliberately not in
  TestRail. `gen_update.py` uses the map to produce ID-matched update files.
- **What's synced (all pushed & re-fetch-verified, 200/200):** the **SV-8183
  permissions batch**; the **V2.4 reconciliation batch** (18 updates + 2 adds); the
  **Milos Round-2 batch**; the **SF-WOP-02 refinement**; the **reviewer-descope
  batch (2026-07-10)**; the **V2.4 Δ1-Δ4 batch (2026-07-13)** — 9 update_case + 1
  add_case (SF-VEND-06 = C29442), audit `testrail-delta-push-0713-log.md`; the
  **FULL build-accurate wording + VIU pass (2026-07-13)** — **~171 update_case
  calls across all 18 areas, every one verified 200/200, 0 errors**, audit
  `testrail-wording-viu-log.md`; and the **spec `_3` (V2.5) + design `_4` pass
  (2026-07-14, §0-AA)** — **18 update_case + 7 add_case (SF-AUTO-01..07) + 2
  add_section (4092, 4093), all 200/200, 0 fail, no writes to run 325**.
- **All mapped cases are current in TestRail — 169/170** (SF-QB-09 unmapped, no
  C-ID; Open-Question, not created). Nothing is proposal-only / unpushed as of
  2026-07-14.
- **QA execution run 325 EXISTS** — **"Simple Flow - Ayesha Khan -> Specs 7/7/2026"**
  (project 1 / suite 1; created by another user 2026-07-07, results logged by Ayesha
  Khan 2026-07-13). Snapshot **48 Passed / 6 Failed / 13 Blocked / 89 Untested**.
  **NOT our run** — Ayesha's/QA's; **do not write to it without explicit permission.**
  Our own per-case VIU status still lives in `cases/*.json` +
  `SimpleFlow_Blockers_Tracker.*` + `SimpleFlow_Results.*` (we do not log VIU pass/fail
  into a TestRail run of our own). Run-325 reconciliation vs our findings:
  `run325-reconciliation-2026-07-13.md` (6 failed + 13 blocked mapped; priority
  "she-failed / we-verified" set called out; no case status changed — needs a verified
  live re-check). **Per-case Ayesha status is cross-referenced in
  `run325-status-map-2026-07-14.md`** (used by the 2026-07-14 audit + wording logs);
  SF-SET-10 was flipped Verified, which resolves Ayesha's SF-SET-10 Failed / SV-8303
  remark.
- Import files (`testrail-import/simple-flow-v1-testrail-import.csv`/`.xlsx`) are the
  full-suite upload; `simple-flow-v2.4-update.xml` / `simple-flow-UPDATE.xml` are
  update-only artifacts. **Import files remain INTERIM** pending post-VIU +
  dev-answer finalization (two-phase plan in `RESUME-STRATEGY.md`).

---

## 4. Deliverables index (paths relative to repo root `/home/user/Manual-test-Cases/`)

**Test cases (authored source):**
- `build/simple-flow/cases/group-A-settings-completion.json` — 56 cases.
- `build/simple-flow/cases/group-B-receiving-vendor.json` — 58 cases.
- `build/simple-flow/cases/group-C-review-permissions-validation-edge.json` — 56 cases (incl. the SF-AUTO Story-16 R12/R13 auto-complete set = 170 total).

**Human-readable workbooks / CSVs:**
- `build/simple-flow/SimpleFlow_V1_TestCases.xlsx` / `.csv` — full test-case workbook (tab-per-area + Open Questions).
- `build/simple-flow/SimpleFlow_QA_Execution_Guide.md` — QA execution guide (VIU / env / seeding).
- `build/simple-flow/SimpleFlow_Settings_QuickReference.xlsx` — settings quick-ref.

**TestRail import / update artifacts:**
- `testrail-import/simple-flow-v1-testrail-import.csv` / `.xlsx` — full-suite import (all 169 mapped; VIU-word-free, feature-flag-free; leaf + API-titled sections).
- `testrail-import/simple-flow-v2.4-update.xml` and `testrail-import/simple-flow-UPDATE.xml` — update-only ID-matched files.
- `build/simple-flow/testrail-id-map.csv` — sf_id ↔ TestRail Case-ID map (169 mapped rows; SF-QB-09 unmapped).

**Tracking / status:**
- `build/simple-flow/SimpleFlow_Blockers_Tracker.md` / `.xlsx` — **source of truth** for per-case state + blocker + owner + what's-needed.
- `build/simple-flow/SimpleFlow_Results.xlsx` / `.csv` — per-status results workbook (tab per status + Summary), built by `build_results_workbook.py`.
- `build/simple-flow/PROJECT-STATE.md` — **this file** (canonical resume snapshot).
- `build/simple-flow/PROJECT-STATUS.md` — narrative status log.
- `build/simple-flow/RESUME-STRATEGY.md` — two-phase finalization + unblock→update loop.
- `build/simple-flow/UPDATE-LOOP-README.md` — the unblock→update loop process.

**Analysis / mapping / diff docs:**
- `build/simple-flow/requirements.md` — COMPLETE spec (V2.4 + §9/§10 SV-8183 permissions incl. re-added per-role behavior matrix + V2.4 interpretation notes).
- `build/simple-flow/spec-current-source.md` — readable V2.4 spec source; `spec-change-diff.md` — V2.4-vs-V2.3 diff.
- `build/simple-flow/spec-diff-2026-07-10.md` — the 4 V2.4-silent-revision deltas (Δ1–Δ4) + Round-3 impact analysis (now APPLIED).
- `build/simple-flow/spec-diff-2026-07-13.md` — **2026-07-13 spec (`_2` doc) + design (`Design_3.zip`) ingest** = byte-identical re-deliveries, Δ1-Δ4 re-confirmed, no new work.
- **Spec `_3` (de-facto V2.5) + design `_4` (2026-07-14) deliverables:**
  `build/simple-flow/spec-source-2026-07-14.md` (readable spec `_3` source);
  `build/simple-flow/spec-diff-2026-07-14.md` (Δ5 auto-complete/SV-8303, Δ6 settings-on-reopen, Δ7 S10-R2 first-class-part DEPRECATED);
  `build/simple-flow/spec-relevance-audit-2026-07-14.md` (whole-suite relevance/obsolescence audit + execution plan);
  `build/simple-flow/design4-2026-07-14/` (design `_4` bundle — special-order core un-skippable at completion);
  `build/simple-flow/run325-status-map-2026-07-14.md` (per-case Ayesha run-325 status cross-reference).
- **Build-accurate wording + VIU pass (2026-07-13) deliverables:**
  `build/simple-flow/wording-glossary-2026-07-13.md` (live-captured on-screen labels);
  `build/simple-flow/testrail-wording-viu-log.md` (per-case wording+VIU audit, ~171 pushes 200/200);
  `build/simple-flow/screenshots/wording-2026-07-13/` (evidence screenshots);
  `build/simple-flow/roles-matrix-2026-07-13.md` (fresh 11-role matrix — Technician NOT drifted; incl. node-fetch-proxy → undici ProxyAgent gotcha).
- `build/simple-flow/spec-epic-diff-latest.md` — 2026-07-09 spec/design/epic ingest + RE-VIU BATCH 7 proposal; companions `spec-latest-source.md`, `epic-content.md`, `design-latest-catalog.md`.
- `build/simple-flow/design-notes.md` — design catalog; `design-change-diff.md` (07-08 refresh); `design-latest-catalog.md` (07-09); `design-diff-2026-07-10.md` — **07-10 bundle = byte-identical re-delivery, no impact**; preserved copy `design2-2026-07-10/`.
- `build/simple-flow/contradiction-resolution.md` — last-update-wins conflict log (C1–C3 + the 2026-07-10 reviewer≠completer descope ruling).
- `build/simple-flow/finding-reclassification.md` — shortcut-principle reclassification.
- `build/simple-flow/run325-reconciliation-2026-07-13.md` — **reconciliation of QA
  run 325 (Ayesha Khan) vs our findings** (6 failed + 13 blocked mapped to SF-IDs /
  our status; priority "she-failed / we-verified" set; read-only, no status changed).
- `build/simple-flow/bugs-log.md` — all VIU bugs/deviations (BUG-1..BUG-11, GAP-A/B, OBS-1..6).
- `build/simple-flow/viu-findings.md` — full VIU evidence + endpoints; `viu-evidence/` — screenshots.
- `build/simple-flow/jira-bug-drafts.md` — **4 active** ready-to-file Jira tickets (TICKET 2–5); BUG-5/TICKET 1 dropped.

**Milos (PO) questions & bug-confirm deliverables:**
- Round 1 (answered): `OpenQuestions-for-Milos.md`/`.xlsx` (11 Q); answers `milos-answers-source.*`; mapping `milos-answers-mapping.md`.
- Round 2 (answered + applied): `OpenQuestions-for-Milos-Round2.md`/`.xlsx` (5 Q); answers `milos-round2-answers-source.*`; mapping `milos-round2-mapping.md`.
- **Round 3 (READY TO SEND, awaiting answers):** `PO-Questions-Round3.md`/`.xlsx` (plain-language scenario stories).
- **`SimpleFlow_Bugs-for-Milos-Confirm.md`/`.xlsx`** — expected-vs-bug PO-confirm view (READY TO SEND).
- **`SimpleFlow_Bug-Drafts.md`/`.xlsx`** — the bug-draft workbook (READY TO SEND / file).
- Permissions source: `SV-8183-permissions-source.md`.

**Generators (Python):** `gen_import.py`, `gen_blockers.py`, `build_results_workbook.py`,
`gen_update.py`, `gen_cases.py`, `build_workbook.py`, `build_settings_quickref.py`,
`gen_milos_questions.py`, `gen_milos_questions_r2.py`, `gen_po_questions_round3.py`,
`gen_bugs_for_milos.py`, `gen_bug_drafts_workbook.py`.

**Audit logs:** `testrail-push-v2.4-log.md`, `testrail-sync-log.md`,
`testrail-delta-push-0713-log.md` (V2.4 Δ1-Δ4 push),
`testrail-wording-viu-log.md` (full wording+VIU pass, ~171 pushes 200/200).

---

## 5. Open threads / what unblocks what

**A. Milos Round-2 (ANSWERED + APPLIED — `milos-round2-mapping.md`):** 5 cases
pushed live (update 200 / verify 200). Q1 review-note DESCOPED (BUG-3 closed); Q2
tech-story Story 17 authoritative; Q3 inventory decrements + writes Part History on
completion; Q4 vendorless part-request Category required / Sell NOT enforced (BUG-9 /
GAP-A closed); Q5 BE-enforcement RULED — UI gating = v1 PASS, API gap stays OPEN
(TICKET 2 / BUG-6/7).

**B. reviewer ≠ completer — RESOLVED (Milos ruling 2026-07-10, `contradiction-
resolution.md`):** the same-user IDENTITY block is **NOT a v1 requirement**;
self-review IS allowed when the role holds the Mark Reviewed permission
(permission-gated only). SF-PERM-04/07 + SF-REV-09 corrected & VIU-Verified;
SF-PERM-08 RE-PURPOSED into the positive self-review case (VIU-Verified). **BUG-5 /
TICKET 1 DROPPED** as expected. 4 cases pushed to TestRail (QA-lead authorized).

**C. 4 active Jira bug drafts (`jira-bug-drafts.md`) — NOT filed** (no Atlassian MCP
in this env; file from the chat app). All under epic SV-7301, Product Area = Work
Orders (`customfield_10153` id 10120):
1. **TICKET 2** (BUG-6 + BUG-7, Medium) — WO completion & review sign-off enforced
   UI-only, bypassable via API. (Milos R2 Q5: UI = v1 pass; this tracks the API-gap fix.)
2. **TICKET 3** (BUG-8, Medium) — required completion fields (mileage/VIN/engine
   hours) UI-only, not BE-enforced.
3. **TICKET 4** (BUG-11, **Low** — downgraded) — WO-PO receive HTTP 500 on the
   LEGACY Accept-Delivery path only; Bulk Receive works (`receive-requested-parts`
   → 200). **Not reproduced on the 2026-07-10 run.**
4. **TICKET 5** (GAP-B, Medium) — wrong first-use settings defaults
   (Auto-approve / Vendor-invoice).
   - CLOSED (Milos R2, not filed): BUG-3, BUG-9/GAP-A. Deliberately not filed:
     BUG-1, BUG-2, BUG-4, BUG-10. Dropped: BUG-5/TICKET 1.
   - **OBS-6 (NEW, for dev)** — Part-History surface HTTP 500
     (`GET /api/inventory/parts/history`) + part-detail page crash
     (`/parts/inventory/{id}`). Blocks SF-QB-01 log-half + SF-PNFIX-02/03/06. Raise
     with dev (possible env/build defect).

**D. BUG-11 status:** confined to the **legacy single-PO Accept-Delivery path**
(`POST /api/inventory/orders/accept`). The **Bulk Receive pipeline works** — WO POs
receive via `POST /api/orders/receive-requested-parts` → 200. LOW urgency (a working
path exists); not reproduced on the 2026-07-10 run.

**E. THE 4 UNAPPLIED SPEC DELTAS (2026-07-10 silent V2.4 revision) — TOP PENDING
WORK (`spec-diff-2026-07-10.md`, proposal-only):** Δ1 VIN dropped from Story-4
completion modal (SF-COMP-16, SF-VAL-02); Δ2 Story-4 unapproved-line = disabled
Complete button + tooltip, Story-4 ONLY (SF-COMP-21/22, SF-VAL-11); Δ3 new
receive-time gates S13-R6 (part#) + S13-R7 (cost/sell) (SF-VEND-04, SF-VAL-06,
SF-RCV-06, SF-PNFIX-05, + possible new case); Δ4 Mark-Reviewed note removed
(SF-REV-06, SF-REV-10). SV-8183 fold-in = already held (no action). Resolves NO
Round-3 question. **Design bundle 2026-07-10 = byte-identical re-delivery, no
impact (`design-diff-2026-07-10.md`).**

**F. Open items queued for NEXT Milos/dev round (Round-3, product decisions — not
bugs; `PO-Questions-Round3.*`):** vendor-missing group ordering on Bulk Receive
(OBS-2, wording; SF-RCV-05/07); **$0 sell price at completion** vs spec S5-R1 (Q5 —
unchanged by the 07-10 doc; note S13-R7 adds a *receive-time* cost/sell gate, a
different surface); See-Financial-Data gate on vendorless part-add (spec §9 asserts
option A but conflicts with Milos R2 Q4 — flag as spec-vs-answer contradiction);
Require-Review default per cohort; close/cancel confirmation modal.

**G. The 31 VIU-PENDING (QA) — genuinely blocked:** QuickBooks-connected access
(SF-VMIS-03/06, SF-RCV-08, SF-QB-03..08); invoiced/paid WO not drivable in-harness
(SF-VAL-09, SF-VEND-05); special-order core not seedable (SF-BULK-10 + core cases);
merge-collision seeding (SF-VEND-02/03); VIN-less asset (SF-VAL-02; POST
/api/vehicles 405); Part-History surface (OBS-6); Milos Q11 group-ordering
(SF-RCV-05/07); SF-QB-09 open question (dev confirm).

**H. Residual disposable-env state (harmless):** irreversible received ZZAUTOTEST
POs/deliveries (RE-VIU BATCH 7/8 + the 2026-07-10 run S-15797/S-15798) remain on the
shared sv7301 env — received deliveries are not reversible in-app. P550848 inventory
net 6→4. All reversible throwaway data deleted. **Shared env — re-read
`GET /api/organizations/settings` before every run; never assume baseline.**

---

## 6. Standing rules learned (Simple Flow) — all recorded in CLAUDE.md

- **Shortcut-interpretation principle (Simple Flow ONLY):** any behavior that
  reaches the same end state by SKIPPING a legacy flow/step is **EXPECTED** — a
  defect only if the skip (a) throws an ERROR or (b) corrupts data/inventory/
  Part-History integrity. (BUG-4 & BUG-10 → EXPECTED; BUG-11 → real defect on the
  legacy path; BUG-5/6/7/8/9 → OTHER.)
- **Last-update-wins contradiction rule:** when spec doc vs answer sheet vs design
  conflict, the MOST RECENT input is authoritative. Always DIFF new spec/design
  uploads — the version string is unreliable (the 2026-07-10 upload was a silent
  V2.4 revision).
- **Self-service test data & role-switching:** on the disposable QA env,
  create/delete whatever data a case needs; to test role behavior assign Tech the
  needed role then RESTORE Tech (exact email match `tech@shopview.com`; mark
  throwaway data ZZAUTOTEST).
- **API-folder rule (STANDING RULE 4):** any case with API endpoints/verbs/status
  codes/backend checks goes in a TestRail section whose title contains "API"
  (sections 4089/4090).
- Global: never write to TestRail without explicit user permission; confirm the
  target project on every instruction; never commit secrets (/tmp only); PO/dev
  questions in plain layman language, TestRail Case IDs in every deliverable.

---

## 7. Env & access facts (facts only — NO secret values; secrets live in `/tmp`)

- **QA env:** app `https://sv7301.qa.shopview.com`; API host
  `https://sv7301api.qa.shopview.com` (note `sv7301api`, no dot).
- **Auth:** `POST /api/quick-login {key:'admin'|'tech'}` — **both return 200** (the
  earlier tech-403 is FIXED). Gated by cookies `sv_sso_session` / `PHPSESSID` /
  `cf_clearance` (domain `.qa.shopview.com`). quick-login is **stateful on the shared
  PHPSESSID** — probe roles STRICTLY SEQUENTIALLY. FE permissions at
  `GET /api/auth/me/fe-permissions` → `{data:{fe_permissions:[<codes>],view_mode,
  cross_toggles}}`.
- **Settings-driven, NO feature flag** — Work Orders settings tab. Read
  `GET /api/organizations/settings`; save `POST /api/organizations/settings/change`
  (full settings object). Settings atom IS backend-enforced (tech settings-change → 403).
- **Key routes:** WO settings `/administration/settings` → Work Orders tab; PO list
  `/parts/orders`; deliveries `/parts/deliveries`; shared Accept Delivery
  `/accept-delivery/{orderId}`; **Bulk Receive `/bulk-receive?ids=…`**; WOs
  `/workorders` → `/workorders/{id}/lines`.
- **Key endpoints:** PO list `GET /api/inventory/orders`; order detail
  `GET /api/inventory/orders/{id}`; deliveries `GET /api/inventory/deliveries`;
  inventory parts `GET /api/inventory/parts?…&search=`; **legacy single-PO Receive =
  `POST /api/inventory/orders/accept`** (500 for WO POs = BUG-11, low urgency);
  **Bulk Receive (WORKS for WO POs) = `POST /api/orders/receive-requested-parts`**
  (+ `GET /api/inventory/orders/receive-view`), from `/bulk-receive`; simple
  completion `POST /api/work-orders/{id}/simple-complete`; change status
  `POST /api/work-orders/change-status`; remove WO part
  `POST /api/work-orders/parts/delete {part_id,work_order_id}`; new part request
  `POST /api/work-orders/part/make-request`; assign vendor
  `POST /api/orders/{id}/assign-vendor`; part request status action
  `POST /api/work-orders/part/perform-request-status-action`. **OBS-6:** Part-History
  `GET /api/inventory/parts/history` → 500; part-detail `/parts/inventory/{id}` crashes.
- **Tech self-service role-switch (sv7301):** `POST /api/staff/{staff_id}/change`
  with `{first_name,last_name,email,role_id,workplace_id}` (+ job_title/salary/
  billable/clockable to avoid clobber). Tech: user `a7fd0a88-…`, **staff
  `6fb22c1b-…`**, restore role **Technician `131b5274-…`**, workplace `b3c8c820-…`,
  org `d55bc308-…`. EXACT-MATCH `email==='tech@shopview.com'` before changing;
  safety-net `restore-tech.mjs`. All 11 system roles are real & assignable. Roles
  list `GET /api/organizations/{org}/roles` (405 on `/api/roles`). Role ids: Admin
  `16fec34c…`, Service Manager `ef6e24c2…`, Senior Service Advisor `e03f176f…`,
  Service Advisor `3874cc56…`, Foreman `897018a5…`, Technician `131b5274…`, Parts
  Manager `5d703b9b…`, Parts Tech `486622b9…`, Office `163abe0d…`, Sales Rep
  `8eb4a1c1…`, Time Clock `0a198766…` (full map `/tmp/simple-flow/roles-map-6.json`).
- **Stories 7/8/9/14 BUILT** — PO multi-select (`checkbox_select_all_orders` /
  `checkbox_select_order_{id}`; Receive Selected → `/bulk-receive?ids=…`), Bulk
  Receive page ("Receive Vendor Parts", grouped by vendor, Vendor-Missing group with
  `select_assign_vendor_{poId}` + `input_part_number_{partId}`), Apply-invoice
  (`input_apply_invoice_{vendorId}`), Waiting-On-Parts column
  (`toggle_column_unreceivedPartRequestsCount`, off by default). Nothing is DEV-NOT-BUILT.
- **Cores:** genuine cored inventory part **P550848** (core_charge=1, has
  core_part_id); add via New Part Request → select_part catalog PN (forces
  Source=Inventory; qty via `input_bin_quantity_{binId}`). A genuine special-order
  (vendor-source) core is NOT seedable in-app.
- **Deliverable WO PO recipe (receive testing):** New Part Request → Source = Vendor
  + real vendor (e.g. Aabridge Beverages) + free-text Part Number → complete WO → PO
  becomes `status:ordered, vendorMissing:false`; receive via **Bulk Receive** (BUG-11
  blocks only the legacy Accept-Delivery path).
- **Harness gotchas:** node `fetch` is blocked for the TestRail host — push via
  **curl + Basic auth**. Chromium can't TLS through the egress proxy directly — build
  a **FRESH MITM bridge per run** (port rotates; read `$HTTPS_PROXY` live) and use the
  **boot2 hydration pattern** (seed cookies + localStorage, THEN navigate; the DEV
  login buttons don't reliably work). VIU tools in `/tmp/simple-flow/tools/`. Wake /
  poisoned-session recovery notes in `build/APP-ACTIONS-PLAYBOOK.md`. Secrets are
  ephemeral (`/tmp` only, re-supply per environment).

---

## 8. How to resume (ordered checklist)

**Confirm the project first** (this workspace holds 3 projects) — the instruction
must target **Simple Flow**.

**>>> DONE (through 2026-07-14):** Stories 7/8/9/14/16-auto built & live (DEV-NOT-BUILT
= 0); spec-vs-Epic conflicts resolved; BUG-11 downgraded & not reproduced;
reviewer≠completer descoped (BUG-5 dropped); per-role matrix re-added; OBS-6/OBS-7
logged. V2.4 Δ1-Δ4 APPLIED (9 cases + new SF-VEND-06 = C29442, pushed 200/200); a
**FULL build-accurate wording + VIU pass over ALL 163 cases** (§0-A, all 200/200);
**spec-relevance reconciliation** (§0-B, 0 obsolete, 3 label cases fixed, deliverables
grep-clean); **run-325 reconciled** (§0-Z); the **2026-07-14 VIU grind drove ALL
VIU-Pending to a verdict** (§0-ZZ); and the **spec `_3` (de-facto V2.5) + design `_4`
pass** (§0-AA) — BOTH procedures run, Δ5 auto-complete authored 7 new SF-AUTO cases
(C29461–C29467), Δ6 flipped SF-SET-10 Verified (resolves SV-8303/run-325), Δ7 S10-R2
DEPRECATION rescoped SF-PNFIX-02/03/06 + SF-QB-08 → Verified, design `_4` flipped
SF-CORE-03 (core BEHAVIOR still Blocked-Env), TestRail 18 update + 7 add + 2 section
all 200/200. Roles matrix re-derived (Technician NOT drifted). **Final tally 134
Verified / 8 awaiting-Milos / 25 Blocked-Env / 2 Deviation / 1 Open-Question = 170;
VIU-Pending = 0. 169/170 current in TestRail (SF-QB-09 unmapped).**

**>>> NEXT ACTIONS (priority order):**
1. **Send Milos Round-3 + the bug-confirm sheets** — `PO-Questions-Round3.xlsx`,
   `SimpleFlow_Bugs-for-Milos-Confirm.xlsx`, `SimpleFlow_Bug-Drafts.xlsx` (all READY).
2. **Apply Round-3 answers when returned** — record verbatim + map (mirror
   `milos-round2-mapping.md`), flip `viu_status`/`expected` for the 8
   VIU-observed-awaiting-Milos cases (SF-SET-08, SF-COMP-06, SF-RCV-05, SF-RCV-07,
   SF-REV-11, SF-REV-15, SF-UX-04, SF-QB-02) + the earlier MILOS set, re-run
   generators, emit an ID-matched update file, ask before pushing.
3. **Clear the 25 Blocked-Env** as data/access allows — get fresh sv7301 cookies
   (admin + tech) into `/tmp` + rebuild the MITM bridge; the definitive per-case data
   need is in §0-ZZ / §0-AA (QuickBooks-connected company + a human in QB for the 9 QB
   cases; **dev-seeded special-order (vendor-sourced) core** for the core-block cases
   incl. SF-CORE-03; invoiced/paid WO; inline-PN/OBS-6; merge-collision
   auto-consolidates; VIN-less asset; **SF-AUTO-04 needs the delete-lines API-500 fix,
   SF-AUTO-06 needs live UI clock-out driving**).
4. **File the active Jira bug drafts** (TICKET 2–5, `jira-bug-drafts.md`) from the
   chat app where Atlassian is connected; raise **OBS-6** (Part-History 500), the
   **SF-VMIS-06** report gap, and the **SF-AUTO-04 delete-lines API 500** with dev.
5. **Resolve SF-QB-09** with dev; assign a C-ID + import only after confirmation
   (still unmapped in `testrail-id-map.csv`, no C-ID).
6. **SV-8303 ingested** (spec `_3` Δ5, §0-AA) — but **flag the doc self-contradiction
   for Milos:** `_3` strikes S10-R2 (Δ7) yet the Story-10 AC bullets + technical
   guardrails paragraph still describe first-class-part creation. Raise for spec
   cleanup. For any further spec upload, ALWAYS ask which process to run (Standing
   Rule 11).
7. **Finalize the TestRail import (Phase 2)** once Round-3 + the remaining Blocked-Env
   clear (`RESUME-STRATEGY.md` two-phase plan); create an execution run only if the
   user wants VIU pass/fail logged. **Never write to TestRail without explicit user
   permission** (per-day authorization; run 325 is Ayesha's/QA's — do NOT write to it
   without permission).

**Env/access reminders:** app `sv7301.qa.shopview.com` / API `sv7301api.qa.shopview.com`;
cookies ephemeral (`/tmp` only); **SHARED env** — re-read `GET /api/organizations/settings`
before runs and restore byte-identical after; **node-fetch ignores the proxy → use undici
ProxyAgent** (push to TestRail via curl + Basic auth); harmless ZZAUTOTEST residue remains
(received deliveries are not reversible in-app).
