# Simple Flow — Run 325 (Ayesha Khan) Reconciliation vs Our Findings (2026-07-13)

> **Project:** Simple Flow ONLY (Epic SV-7301, PO = Milos, app `sv7301.qa.shopview.com`).
> **Scope:** READ-ONLY on TestRail. Nothing was written to TestRail. No case `viu_status` changed.
> Reconciliation is report-only; any status flip needs a separate, verified live pass.

---

## 0. What run 325 is

- **TestRail run 325** — **"Simple Flow - Ayesha Khan -> Specs 7/7/2026"** (project 1, suite 1
  "Master"). **This run was NOT created by us.** Created by user id 3 on **2026-07-07 21:23 UTC**;
  results logged by **assignee user id 5 (Ayesha Khan) on 2026-07-13** (spread across the day,
  17:19–22:07 UTC — i.e. the SAME day as our full build-accurate wording + VIU pass).
- **Snapshot (live, fetched this task):** 156 tests — **48 Passed · 6 Failed · 13 Blocked · 89
  Untested · 0 Retest.** (Matches the reported 48/13/6/89.)
- **Our memory was wrong:** PROJECT-STATE.md / CLAUDE.md said "no execution run exists." Corrected
  in both docs; run 325 is Ayesha's/QA's — we do not write results to it without permission.
- Data source: `GET /api/v2/get_tests/325` + `GET /api/v2/get_results/{test_id}` (curl + Basic
  auth). Ayesha left an explicit **comment on only ONE test** (C29284, below); all other
  failed/blocked results carry **no comment**.

---

## 1. PRIORITY FOLLOW-UPS — "she FAILED, we marked VIU-Verified" (bucket b)

These are the high-priority discrepancies. **No status was changed** — each needs a live re-check.

| test_id | C-ID | SF-ID | Title (short) | Ayesha | Our status | What our case asserts | Assessment / recommended action |
|---|---|---|---|---|---|---|---|
| 1616614 | C29291 | **SF-COMP-02** | No-parts WO completes in one confirm → Success | **Failed** (no comment) | VIU-Verified | Wizard = Details→Success (no PO/receive/invoice step); Success reads "Order complete" + "Sent to Finance as an invoice-ready draft"; lines→Completed; status→Complete | **HIGH.** We drove this live 2026-07-13 (labor-only WOs S2-15795 / S2-15825 to Success). Her fail w/ no note = unexplained. Possible shared-env config (e.g. Require Tech Story / Require Review ON at her run), a data-specific issue, or a regression. **Re-VIU live** with a fresh no-parts WO and capture the wizard + Success screen; only then consider any status change. |
| 1616647 | C29324 | **SF-TECH-02** | Require tech story ON → every line needs a story before complete | **Failed** (no comment) | VIU-Verified | Completion cannot proceed while any line is missing a tech story; user routed to enter missing stories first | **HIGH.** The tech-story gate is BE-enforced in our evidence (`simple-complete` → 400 "Line can not be completed without a tech story"). Her fail w/ no note is unexplained — possibly the modal-chaining UX (tech story → parts → complete) behaved unexpectedly for her, or Require Tech Story was OFF on the shared env when she ran. **Re-VIU live** with Require Tech Story ON + a story-less line. |
| 1616654 | C29331 | **SF-VPART-01** | Vendorless part requestable w/ desc + qty + category | **Failed** (no comment) | VIU-Verified (BUG-9 / GAP-A) | Part saves w/ desc+qty+category (PN/cost/vendor/sell may be empty); **Category required**; **Sell not enforced**; part is vendorless downstream + orderable | **Likely stale-baseline, tied to known BUG-9.** The run is named "Specs 7/7/2026". Under the 7/7 wording S5-R1 required only **description+quantity+sell** (no category; sell mandatory). Milos Round-2 Q4 (2026-07-09) later ruled **Category IS required / Sell NOT enforced**, and we updated the case to that build-accurate behavior. Her fail most plausibly reflects the **old 7/7 expectation** (or the live Category-required / sell-not-enforced deviation = BUG-9). **Confirm** whether her fail = the documented BUG-9 behavior; if so it is a stale-spec-baseline mismatch, not a new bug. No live change needed to our (already-current) wording. |
| 1616655 | C29332 | **SF-VPART-02** | Add-part blocked when desc/qty/category missing (sell not enforced) | **Failed** (no comment) | VIU-Verified (BUG-9 / GAP-A) | Inline block on empty description / quantity / **category**; save allowed when only sell empty | **Same cluster as SF-VPART-01** — same BUG-9 / 7-7-baseline reasoning. Confirm her fail = known build behavior. |
| 1616659 | C29336 | **SF-VPART-06** | Adding PN + vendor later transitions part out of vendorless | **Failed** (no comment) | VIU-Verified | Once both PN + vendor present, part no longer vendorless; becomes eligible for inventory/QB | **HIGH.** We verified via SF-VMIS-05 / prior VIU (flag clears once vendor+PN present). Her fail w/ no note is unexplained — possibly the QB-eligibility half (not observable without a QB-connected company) or the vendor-missing flag not clearing in her data. **Re-VIU live** the flag-clear transition; the QB-eligibility half may itself be QB-blocked. |

**Do these reveal a new bug or a spec-relevance gap?**
- **SF-VPART-01 / SF-VPART-02** → most likely a **stale-spec-baseline** artifact (run is "Specs 7/7";
  our wording already carries the Milos-R2 ruling). Ties to the **known BUG-9 / GAP-A** deviation —
  not a new bug. Action = confirm, not re-author.
- **SF-COMP-02 / SF-TECH-02 / SF-VPART-06** → **cannot be explained from the data** (no comments).
  They are **potential new bugs OR shared-env config differences OR data-specific fails**. Each
  needs a **live re-check** before any conclusion. Do NOT flip our VIU-Verified status without it.

---

## 2. Other discrepancy — she FAILED, we VIU-Pending (spec-relevance signal)

| test_id | C-ID | SF-ID | Title | Ayesha | Our status | Ayesha's note | Assessment |
|---|---|---|---|---|---|---|---|
| 1616607 | C29284 | **SF-SET-10** | Settings change applies to future completions only | **Failed** | VIU-Pending | *"As discussed with Milos. The specs will be updated. https://shopview.atlassian.net/browse/SV-8303"* | **SPEC-RELEVANCE follow-up.** Ayesha's only commented result. It signals a **coming spec change (Jira SV-8303)** to the "settings change applies to future completions only" behavior. We already had SF-SET-10 VIU-Pending, so her fail is not a contradiction — but **SV-8303 must be ingested** when the spec updates and SF-SET-10 reconciled then (possible expected-result rewrite). Flag for the spec-relevance / next-spec-round pipeline. |

---

## 3. BLOCKED (13) — mapped to our status

| test_id | C-ID | SF-ID | Title (short) | Ayesha | Our status | Match? |
|---|---|---|---|---|---|---|
| 1616636 | C29313 | SF-CORE-01 | Inventory cores resolved via line-level Ok/Not-OK | Blocked | VIU-Verified | **Discrepancy (minor).** She blocked the whole core suite (no core data). We verified via the inventory core part **P550848** line-level control (BUG-10 note). She lacked the seed part. Note only. |
| 1616637 | C29314 | SF-CORE-02 | No-cores WO completes w/ no core sub-lines | Blocked | VIU-Verified | Same — minor discrepancy (she blocked; we verified live on labor-only WOs). Note. |
| 1616638 | C29315 | SF-CORE-03 | Special-order cores leave optional-invoice unchanged | Blocked | VIU-Pending | **MATCH** (special-order core not seedable). |
| 1616639 | C29316 | SF-CORE-04 | Invoice 'Cores pending' flag | Blocked | VIU-Pending | **MATCH.** |
| 1616640 | C29317 | SF-CORE-05 | Resolve cores at Create Invoice gate | Blocked | VIU-Pending | **MATCH.** |
| 1616641 | C29318 | SF-CORE-06 | Cancel invoice-gate core resolution | Blocked | VIU-Pending | **MATCH.** |
| 1616642 | C29319 | SF-CORE-07 | Special-order cores after required-invoice receive | Blocked | VIU-Pending | **MATCH.** |
| 1616643 | C29320 | SF-CORE-08 | Invoice gate detects unresolved special-order core | Blocked | VIU-Pending | **MATCH.** |
| 1616644 | C29321 | SF-CORE-09 | Part-sale auto-resolve vs service manual Ok/Not-OK | Blocked | VIU-Pending | **MATCH.** |
| 1616645 | C29322 | SF-CORE-10 | Core '+$ to invoice' at line level | Blocked | VIU-Verified | **Discrepancy (minor).** She blocked; we verified via P550848 line-level. Note. |
| 1616663 | C29340 | SF-VMIS-03 | Vendor Missing PO excluded from QuickBooks sync | Blocked | Blocked-Env | **MATCH** (QB-connected company needed). |
| 1616666 | C29343 | SF-VMIS-06 | Reports mark Vendor Missing POs 'needs vendor' | Blocked | VIU-Pending | **MATCH/consistent** (needs seeded vendor-missing PO). |
| 1616670 | C29347 | SF-POSEL-04 | Fulfilled POs not selectable | Blocked | VIU-Verified | **Discrepancy (minor).** She blocked (no fulfilled-PO data). We verified via OBS-4 (fulfilled POs are excluded from the list entirely, so inherently not selectable). Note. |

**Blocked summary:** 9 of 13 **MATCH/consistent** (special-order-core cluster + VMIS-03 QB + VMIS-06).
4 are **minor discrepancies** where Ayesha blocked for lack of seed data (whole CORE suite blocked)
while we verified via a seed workaround (P550848) or a stronger mechanism (OBS-4). None indicates a
new bug — they reflect Ayesha not having the seed data we used.

---

## 4. FAILED (6) — full map (repeat, for completeness)

| test_id | C-ID | SF-ID | Ayesha | Our status | Class | Bucket |
|---|---|---|---|---|---|---|
| 1616607 | C29284 | SF-SET-10 | Failed | VIU-Pending | Spec change coming (SV-8303) | §2 |
| 1616614 | C29291 | SF-COMP-02 | Failed | VIU-Verified | Unexplained — re-VIU | §1 (b) HIGH |
| 1616647 | C29324 | SF-TECH-02 | Failed | VIU-Verified | Unexplained — re-VIU | §1 (b) HIGH |
| 1616654 | C29331 | SF-VPART-01 | Failed | VIU-Verified (BUG-9) | Likely stale 7/7 baseline / BUG-9 | §1 (b) |
| 1616655 | C29332 | SF-VPART-02 | Failed | VIU-Verified (BUG-9) | Likely stale 7/7 baseline / BUG-9 | §1 (b) |
| 1616659 | C29336 | SF-VPART-06 | Failed | VIU-Verified | Unexplained — re-VIU | §1 (b) HIGH |

---

## 5. (d) She PASSED cases we could NOT verify (informative — Ayesha unblocked them)

| test_id | C-ID | SF-ID | Title | Ayesha | Our status | Note |
|---|---|---|---|---|---|---|
| — | C29310 | **SF-COMP-21** | Required-invoice unapproved line disables Complete + tooltip (V2.4 Δ2) | **Passed** | VIU-Pending | Ayesha reached the Needs-Approval-line state we could not seed in-harness and it **passed**. Positive signal — candidate to flip to VIU-Verified after our own confirming re-check. |
| — | C29311 | **SF-COMP-22** | Manually-unapproved line disables Complete + tooltip even w/ Auto-approve ON (V2.4 Δ2) | **Passed** | VIU-Pending | Same — Ayesha's pass corroborates Δ2; confirm and consider flipping. |

*(No case that Ayesha passed maps to a Deviation/Blocked-Env of ours other than these two VIU-Pending
cases; SF-SET-03 Deviation is Untested in run 325.)*

---

## 6. Recommended actions (do NOT change any case status in this task)

1. **Live re-VIU the 3 unexplained fails** — SF-COMP-02 (C29291), SF-TECH-02 (C29324),
   SF-VPART-06 (C29336). Fresh sv7301 cookies + boot2 bridge; drive each flow; capture screenshots.
   If confirmed working → status stays VIU-Verified (note the run-325 discrepancy as resolved). If a
   real defect → log a bug + downgrade with evidence.
2. **Confirm SF-VPART-01/02** (C29331/C29332) against the current build — expect the known **BUG-9 /
   GAP-A** behavior (Category required, sell not enforced). If matched, this is a **stale-7/7-baseline**
   fail against our already-current (Milos-R2-ruled) wording — no re-author needed.
3. **Ingest Jira SV-8303** (Ayesha's SF-SET-10 note) when the updated spec lands; reconcile SF-SET-10
   in the next spec-relevance round. Route through Standing Rule 11 (ask which process to run).
4. **SF-COMP-21 / SF-COMP-22** — Ayesha's passes suggest the Needs-Approval-line state is reachable;
   confirm and consider flipping VIU-Pending → VIU-Verified in a verified pass.
5. **Core cluster + VMIS/POSEL blocked discrepancies** — no action beyond noting that Ayesha lacked
   the seed data (P550848 core; fulfilled-PO; vendor-missing PO) we used.

**No TestRail writes were made. No case `viu_status` was changed.** All conclusions above are
report-only and any status change is deferred to a separate, verified live pass.
