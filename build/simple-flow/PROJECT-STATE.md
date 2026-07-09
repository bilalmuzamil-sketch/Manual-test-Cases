# Simple Flow — PROJECT STATE (canonical resume snapshot)

> **THIS IS THE CANONICAL STATE DOC for the Simple Flow project.** It is a single
> authoritative snapshot so the project can be resumed with zero re-discovery.
> **Last updated:** 2026-07-09 (**FOLLOW-UP VIU BATCH 8 DONE** — 8 more cases flipped
> VIU-Pending → VIU-Verified via reachable-now + self-served data drives on sv7301:
> SF-WOP-02, SF-REV-12, SF-VAL-10, SF-VEND-04, SF-VMIS-07, SF-COMP-12, SF-RCV-10,
> SF-RCV-06. No new filing-grade bugs; one wording deviation (SF-WOP-02 → Bulk Receive,
> OBS-5). New endpoints: `POST /api/orders/{id}/assign-vendor`, `POST /api/work-orders/
> part/perform-request-status-action`. Settings + Tech restored; 5 throwaway WOs deleted.
> Prior: RE-VIU BATCH 7 — Stories 7/8/9/14 CONFIRMED BUILT; DEV-NOT-BUILT **0**;
> conflicts resolved in favour of spec; BUG-11 downgraded — see §5.E.)
> **BATCH 8 quick facts (2026-07-09):** VIU-Verified **112** / VIU-Pending **45** /
> Open-Question **5** (= 162). Blockers tracker: READY **103** / VIU-PENDING (QA) **38**
> / MILOS **15** / BUG-RULING **6** / DEV-NOT-BUILT **0**. Full evidence:
> `viu-findings.md` BATCH 8; observations in `bugs-log.md` (OBS-1..5 + BUG-11 update).
> No TestRail writes this pass (SF-WOP-02 expected refined locally only; TestRail
> writes need explicit user permission).
> **Source of truth for per-case status:** `SimpleFlow_Blockers_Tracker.md`/`.xlsx`
> (regenerate with `python3 build/simple-flow/gen_blockers.py`). All counts below
> are cited from that tracker — do not invent numbers; re-read the tracker if in doubt.
> Companion docs kept current: `PROJECT-STATUS.md` (narrative log),
> `RESUME-STRATEGY.md` (two-phase finalization), `bugs-log.md`, `viu-findings.md`.

---

## 1. Summary

**What Simple Flow is:** ShopView **"Simple Mode — Streamlined Work Order
Completion & Bulk Receiving"** (Epic **SV-7301**, Owner @Milos Vasic). It shortens
/ skips legacy multi-step work-order completion and parts-receiving flows so users
reach the **same end state faster** — one-confirm WO completion, an in-modal
completion wizard, bulk PO receiving, vendorless/no-PN parts, inline part-number
fix, and an optional review sign-off gate. Behavior is **settings-driven** (the
Work Orders settings tab), **not** feature-flag-gated.

**Spec version:** **V2.4** — "Draft for build" (title gained "Bulk"; V2.3 → V2.4
adds the 2026-07-08 change-log batch: sell-price-at-save, receive-screen parity,
etc.). 17 stories: S1–S15 = SV-7696..SV-7710, S16 = SV-7870, S17 = SV-7876. The
reconciled authoritative inputs are the **V2.4 spec doc** + the **2026-07-08 design
bundle** (last-update-wins over the earlier round-1 Milos answer sheet).
**2026-07-09 latest-batch ingest:** the newly uploaded spec doc is the **SAME V2.4**
(no new version — only HTML-parse artifacts + minor non-material Story-3 clarifying
phrases; `requirements.md` needs no revision). The **design bundle is a refresh**
(design-latest-catalog) that surfaces one open tension: a completion screenshot
warns **"$0.00 sell price, no action needed to continue"**, which conflicts with
spec S5-R1 "sell mandatory at save" (open Q — see §3/§5.E). Full assessment:
`build/simple-flow/spec-epic-diff-latest.md`.

**Overall status:** Cases **authored (162)** and **permissions applied (SV-8183)**.
Deliverables regenerated (workbook, interim TestRail import, blockers tracker). VIU
is **PARTIAL but much further along**. The **v2.4 reconciliation batch + Milos
Round-2 batch were pushed to TestRail** (18 updates + 2 adds; then 5 R2 updates).
**BIG UPDATE (RE-VIU BATCH 7, 2026-07-09):** the Epic was correct — **Stories 7 / 8 /
9 / 14 are now BUILT and were live-verified** on sv7301; **24 cases flipped to
VIU-Verified**, **DEV-NOT-BUILT dropped to 0**, both spec-vs-Epic conflicts were
**resolved in favour of the spec** (vendorless → Vendor-Missing on the WO's own PO,
not a Dummy PO; column = "Waiting On Parts") with **no case changes**, and **BUG-11
was downgraded** (the 500 is confined to the legacy Accept-Delivery path; the new
Bulk Receive pipeline receives WO POs successfully). Remaining work is gated on:
**the 46 VIU-PENDING** (7 reachable-now + 39 needs-data — cores / WO-PO receive via
bulk / invoiced-paid WO / VIN-less asset / QuickBooks; see §8), the **6 BUG/RULING**
+ **15 MILOS-ANSWER** cases, a 2nd/3rd role account for the last SF-PERM-09/10
negatives, and the **5** Jira bug drafts awaiting filing. **Do NOT write to TestRail
without explicit user permission.**

---

## 2. Case inventory

**Total authored cases: 162** (source: Blockers Tracker header).

**By authoring group (`cases/*.json`):**

| Group file | Count | Scope |
|---|---:|---|
| `group-A-settings-completion.json` | 56 | Settings, Completion (Stories 1–4), Cores, Tech story |
| `group-B-receiving-vendor.json` | 57 | Vendorless parts, Vendor-missing PO, PO multi-select, Bulk receive, apply-invoice, PN-fix, Receive/Accept-Delivery |
| `group-C-review-permissions-validation-edge.json` | 49 | Review (Story 16), UX, Permissions, Validation/Edge, QuickBooks/Inventory integrity |
| **TOTAL** | **162** | |

**By blocker category (Blockers Tracker "Summary — counts per category"):**

| Blocker category | Count | Owner |
|---|---:|---|
| READY (VIU-Verified, uploadable now) | 103 | — |
| BLOCKED — DEV NOT BUILT | 0 | Dev team (Stories 7/8/9/14 now BUILT) |
| BLOCKED — VIU PENDING (QA) | 38 | QA |
| BLOCKED — MILOS ANSWER | 15 | Milos (PO) |
| BLOCKED — BUG/RULING | 6 | Dev / PO ruling |
| **TOTAL** | **162** | |

**VIU status field tally across the case JSONs (post-BATCH-8):** VIU-Verified **112**
· VIU-Pending **45** · Open-Question **5** (= 162). Note the difference from "READY =
95": **9 VIU-Verified cases are held** under a ruling/answer (6 BUG/RULING
SF-PERM-02/04/06/07/08 + SF-REV-09, + a few under Milos-answer) — VIU-verified but not
yet uploadable-clean. **DEV-NOT-BUILT dropped 25 → 0** this pass (Stories 7/8/9/14
confirmed built; `gen_blockers.py` classifier updated accordingly).

**DEV-NOT-BUILT — now 0 (Stories 7/8/9/14 CONFIRMED BUILT on sv7301, RE-VIU BATCH 7,
2026-07-09):** the 25 cases previously blocked on these four stories are all built and
were re-VIU'd live; 24 flipped to VIU-Verified and 1 (SF-BULK-10, core Ok/NotOk on the
bulk page) moved to VIU-Pending / needs-data (needs a genuine `is_core` part). For the
record, the four stories that were built:

| Story (Jira) | Cases | Status now |
|---|---|---|
| Story 7 — PO multi-select (SV-7702) | SF-POSEL-01..06 | BUILT — all VIU-Verified |
| Story 8 — PO Bulk Receive page (SV-7703) | SF-BULK-01..10, SF-PERM-03, SF-VAL-09 | BUILT — SF-BULK-01..09 + SF-PERM-03 Verified; SF-BULK-10 (needs-data core) + SF-VAL-09 (needs invoiced/paid WO) VIU-Pending |
| Story 9 — Apply invoice to selected POs (SV-7704) | SF-INV-01..03, SF-VAL-10 | BUILT — SF-INV-01..03 Verified; SF-VAL-10 (reused-invoice#) VIU-Pending reachable-now |
| Story 14 — Waiting-on-Parts column (SV-7709) | SF-WOP-01..03 | BUILT — SF-WOP-01/03 Verified; SF-WOP-02 (click-count→Accept-Delivery) VIU-Pending reachable-now |

**VIU-PENDING (QA) (46) by sub-bucket:**

| Sub-bucket | Count | Meaning |
|---|---:|---|
| reachable-now | ~1 | SF-QB-09 only (Open-Question, needs dev confirm). BATCH 8 cleared the rest: SF-COMP-12, SF-VMIS-07, SF-RCV-10, SF-WOP-02, SF-VAL-10, SF-REV-12 → VIU-Verified. |
| needs-data | ~37 | needs a data state not seedable via the app (special-order cores, invoiced/paid WO [invoicing not drivable in-harness], multi-PO/same-vendor merge collision, VIN-less asset, QB inspection) |
| needs-account | 0 | (none currently) |
| **TOTAL** | **38** | |

**BATCH 8 (2026-07-09) cleared 8 VIU-Pending → VIU-Verified:** SF-WOP-02, SF-REV-12,
SF-VAL-10, SF-VEND-04, SF-VMIS-07, SF-COMP-12, SF-RCV-10, SF-RCV-06. Remaining
needs-data headliners: **SF-VAL-09 / SF-VEND-05** (invoiced/paid WO — invoicing not
drivable: API blocks manual status, UI Create-Invoice needs the builder/IBS flow),
**SF-VEND-02/03** (same-vendor / same-WO merge collision not seedable),
**SF-BULK-10** (special-order is_core part not seedable), **SF-VMIS-03/06 · SF-RCV-08 ·
SF-QB-03..08** (QuickBooks/reports back-end access), **SF-RCV-05/07** (MILOS Q11).

**Blocker owners (who unblocks what):** Milos (PO) → the 15 MILOS-ANSWER cases;
Dev team → BUG-11 (legacy Accept-Delivery 500 — now LOW urgency, a working Bulk
Receive path exists) + the other OPEN fix tickets; QA (fresh sv7301 cookies
admin+tech + seeded data) → the bulk of the 46 VIU-PENDING; a 2nd/3rd role account
(Office/Service Manager/Foreman, some without See Financial Data) → the last
SF-PERM-09/10 negatives; Dev/PO ruling → the 6 BUG/RULING. **DEV-NOT-BUILT is now 0.**

---

## 3. TestRail state

- **Project 1 · Suite 1 "Master"** on `https://shopview.testrail.io`.
- Cases imported under **parent section 4058** (leaf sections per functional area).
- **API sections:** per STANDING RULE 4, API-related cases live in sections whose
  title contains "API": **`API — Work Order Settings` (section 4089)** and
  **`API — Permissions` (section 4090)** — 7 cases: SF-SET-04/07/09/11/12,
  SF-PERM-01/06.
- **Case-ID map:** `build/simple-flow/testrail-id-map.csv` — 161 data rows
  (`ID,sf_id,title,section`). Case IDs run ~C29282..C29440. This is how
  `gen_update.py` produces ID-matched update files.
- **v2.4 batch pushed (2026-07-08):** **18 in-place UPDATEs + 2 ADDs = 20 cases
  touched**, all verified by re-fetch (audit: `testrail-push-v2.4-log.md`):
  - Updates: SF-SET-08, SF-RCV-05, SF-UX-04, SF-SET-13, SF-CORE-01, SF-CORE-02,
    SF-CORE-10, SF-REV-08, SF-REV-11, SF-REV-10, SF-VPART-01, SF-VPART-02,
    SF-COMP-12, SF-COMP-18, SF-COMP-19, SF-PNFIX-04, SF-BULK-06, SF-RCV-06.
  - Adds: **SF-VMIS-07 → C29439** (section 4073, Vendor Missing on WO PO) and
    **SF-RCV-10 → C29440** (section 4079, Accept Delivery). Both carry
    `custom_atmstatus:3` + `custom_automation_type:0`. Both added to the id-map.
  - Refs note: TestRail strips the space after commas in multi-ref lists
    (SF-CORE-01, SF-PNFIX-04, SF-BULK-06) — content identical, not a diff.
- **What's synced:** all 162 authored cases exist in TestRail; the v2.4
  reconciliation deltas are pushed. The interim import files on disk
  (`testrail-import/simple-flow-v1-testrail-import.csv`/`.xlsx`) are the full-suite
  upload; `simple-flow-v2.4-update.xml` / `simple-flow-UPDATE.xml` are the
  update-only artifacts. **Import files remain INTERIM** pending post-VIU +
  dev-answer finalization (two-phase plan in `RESUME-STRATEGY.md`).

---

## 4. Deliverables index (all paths relative to repo root `/home/user/Manual-test-Cases/`)

**Test cases (authored source):**
- `build/simple-flow/cases/group-A-settings-completion.json` — 56 cases (settings/completion/cores/tech story).
- `build/simple-flow/cases/group-B-receiving-vendor.json` — 57 cases (receiving/vendor/bulk/PN-fix).
- `build/simple-flow/cases/group-C-review-permissions-validation-edge.json` — 49 cases (review/perms/validation/QB).

**Human-readable workbooks / CSVs:**
- `build/simple-flow/SimpleFlow_V1_TestCases.xlsx` / `.csv` — the full test-case workbook (tab-per-area + Open Questions).
- `build/simple-flow/SimpleFlow_QA_Execution_Guide.md` — QA execution guide (how to run VIU, env, seeding).
- `build/simple-flow/SimpleFlow_Settings_QuickReference.xlsx` — settings quick-ref (toggles + defaults).

**TestRail import / update artifacts:**
- `testrail-import/simple-flow-v1-testrail-import.csv` / `.xlsx` — full-suite import (all 162; VIU-word-free, feature-flag-free; leaf sections; API-titled sections for API cases).
- `testrail-import/simple-flow-v2.4-update.xml` and `testrail-import/simple-flow-UPDATE.xml` — update-only (ID-matched) files for the cleared/changed cases.
- `build/simple-flow/testrail-id-map.csv` — sf_id ↔ TestRail Case-ID map (161 rows).

**Tracking / status:**
- `build/simple-flow/SimpleFlow_Blockers_Tracker.md` / `.xlsx` — **source of truth** for per-case state + blocker + owner + what's-needed.
- `build/simple-flow/PROJECT-STATE.md` — **this file** (canonical resume snapshot).
- `build/simple-flow/PROJECT-STATUS.md` — narrative status log.
- `build/simple-flow/RESUME-STRATEGY.md` — two-phase finalization + unblock→update loop.
- `build/simple-flow/UPDATE-LOOP-README.md` — the unblock→update loop process.

**Analysis / mapping / diff docs:**
- `build/simple-flow/requirements.md` — spec extract (V2.3 baseline + §9/§10 SV-8183 permissions + V2.4 interpretation notes).
- `build/simple-flow/spec-current-source.md` — readable V2.4 spec source; `build/simple-flow/spec-change-diff.md` — V2.4-vs-V2.3 diff (8 substantive deltas D2–D9).
- `build/simple-flow/design-notes.md` — design catalog; `build/simple-flow/design-change-diff.md` — refreshed-bundle diff (1 new screenshot: Mark-Reviewed dialog).
- `build/simple-flow/design-notes.md` / `sources-log.md` / `spec-fetch-BLOCKED.md` — provenance.
- `build/simple-flow/contradiction-resolution.md` — last-update-wins conflict log (C1 review default, C2 No-PO path, C3 completion lifecycle).
- `build/simple-flow/finding-reclassification.md` — shortcut-principle reclassification of BUG-3/4/9/10/11 + BE-enforcement findings.
- `build/simple-flow/bugs-log.md` — all VIU bugs/deviations (BUG-1..BUG-11 + GAP-A/B).
- `build/simple-flow/viu-findings.md` — full VIU evidence + endpoints; `build/simple-flow/viu-evidence/` — screenshots.
- `build/simple-flow/jira-bug-drafts.md` — **5** ready-to-file Jira bug tickets (see §5.B; refreshed 2026-07-09 after BUG-3 + BUG-9 closed).
- `build/simple-flow/spec-epic-diff-latest.md` — 2026-07-09 latest spec/design/epic ingest + diff + re-VIU proposal (source of §5.E); companions `spec-latest-source.md`, `epic-content.md` (verbatim epic), `design-latest-catalog.md`.

**Milos (PO) question rounds:**
- Round 1 (answered): `build/simple-flow/OpenQuestions-for-Milos.md` / `.xlsx` (11 Q); answers `milos-answers-source.md` / `.csv` / `.xlsx`; mapping `milos-answers-mapping.md`.
- Round 2 (answered + applied 2026-07-09): questions `build/simple-flow/OpenQuestions-for-Milos-Round2.md` / `.xlsx` (5 Q); answers `milos-round2-answers-source.csv` / `.xlsx`; mapping `milos-round2-mapping.md`; 5 cases pushed to TestRail (log in `testrail-push-v2.4-log.md`).
- Permissions source: `build/simple-flow/SV-8183-permissions-source.md`.

**Generators (Python):**
- `gen_import.py` (rebuilds TestRail import CSV **and** the Excel workbook), `gen_blockers.py` (tracker), `gen_update.py` (ID-matched update file), `gen_cases.py`, `build_workbook.py`, `build_settings_quickref.py`, `gen_milos_questions.py`, `gen_milos_questions_r2.py`.

**Audit logs:**
- `build/simple-flow/testrail-push-v2.4-log.md` (the 20-case v2.4 push), `build/simple-flow/testrail-sync-log.md`.

---

## 5. Open threads / what unblocks what

**A. Milos Round-2 (ANSWERED + APPLIED 2026-07-09 — see `milos-round2-mapping.md`,
source `milos-round2-answers-source.csv`/`.xlsx`):** 5 cases pushed live to TestRail
(all update 200, verify 200).
- **Q1 (was R1 Q7)** — Review-note field: **DESCOPED.** Milos removed the optional
  note from the design; v1 = VIN-only. SF-REV-10 expected updated (→ VIU-Verified).
  **BUG-3 CLOSED (not a bug).**
- **Q2 (was R1 Q9)** — Tech-story: **Story 17 CONFIRMED authoritative** (visuals only;
  complete stories individually or several at once). SF-TECH-08 open question closed;
  other SF-TECH already correct.
- **Q3 (was R1 Q2)** — Inventory lifecycle: **CONFIRMED** in-stock parts decrement +
  write Part History on completion. SF-COMP-07 / SF-QB-01 expected already correct
  (no change); still VIU-Pending on a live decrement drive.
- **Q4 (BUG-9)** — Part-request required fields: **Category IS required, Sell Price
  NOT enforced = intended for v1.** SF-VPART-01/02 expected updated (→ VIU-Verified).
  **BUG-9 / GAP-A CLOSED (intended).** Follow-up: See-Financial-Data gate rationale
  overturned — permission gate on vendorless add is an open item.
- **Q5 (SF-PERM-06 / BUG-6 / BUG-7)** — BE enforcement: **RULED — UI gating = PASS for
  v1; API gap stays OPEN** (record "UI pass / API fail"). SF-PERM-06 expected updated;
  settles SF-PERM-02/04/07/08 + SF-REV-09 as UI-PASS. **BUG-6 / BUG-7 remain OPEN fix
  tickets.**

**B. 5 Jira bug drafts pending Atlassian (`jira-bug-drafts.md`, NOT yet filed — no
Atlassian MCP in this env; file from the chat app). All under epic SV-7301,
Product Area = Work Orders (`customfield_10153` id 10120). Refreshed 2026-07-09
after Milos Round-2 (BUG-3 + BUG-9 closed):**
1. TICKET 1 (BUG-5, High) — reviewer can sign off own WO (reviewer≠completer not enforced).
2. TICKET 2 (BUG-6 + BUG-7, Medium) — WO completion & review sign-off enforced UI-only, bypassable via API. **Milos R2 Q5: UI gating = v1 pass; this is the OPEN fix ticket for the API gap.**
3. TICKET 3 (BUG-8, Medium) — required completion fields (mileage/VIN/engine hours) UI-only, not BE-enforced.
4. TICKET 4 (BUG-11, **Low — downgraded 2026-07-09**) — WO-PO receive HTTP 500 on the LEGACY Accept-Delivery path only; the new Bulk Receive pipeline works (`receive-requested-parts` → 200).
5. TICKET 5 (GAP-B, Medium) — wrong first-use settings defaults (Auto-approve/Vendor-invoice).
   - **CLOSED by Milos Round-2 (NOT filed):** BUG-3 (review-note descoped → intended v1, was TICKET 1); BUG-9 / GAP-A (vendorless Category-required / Sell-optional → intended v1, was TICKET 5).
   - **Deliberately NOT filed (earlier):** BUG-1 (No-PO retained per V2.4 = build-lag note), BUG-2 (nice-to-have), BUG-4 & BUG-10 (EXPECTED under the shortcut rule).

**C. Dev dependencies that gate the remaining VIU:**
- **BUG-11 DOWNGRADED (RE-VIU BATCH 7, 2026-07-09):** the HTTP 500 is now confined to
  the **legacy Accept-Delivery path** (`POST /api/inventory/orders/accept`). The **new
  Bulk Receive pipeline works** — receiving a self-created deliverable WO PO via the
  Bulk Receive page ran `POST /api/orders/receive-requested-parts` → **200** (created a
  Delivery / Vendor Bill, moved the order to partial_delivery). So the WO-PO receive
  round-trip is now achievable via the bulk path and the SF-COMP-13/19, SF-VAL-05/06,
  SF-PNFIX-02..06, SF-RCV-08, SF-VPART-07, SF-REV-04/14, SF-CORE-03..07 cases are
  largely **unblocked via Bulk Receive** (re-VIU as budget allows). BUG-11 remains a
  valid but **LOW-urgency** bug for the single-PO Accept-Delivery surface (a working
  path exists).
- **Stories 7 / 8 / 9 / 14 CONFIRMED BUILT (RE-VIU BATCH 7)** — no longer a dependency.
  The 25 formerly-DEV-NOT-BUILT cases were re-VIU'd live: 24 VIU-Verified, 1
  (SF-BULK-10) → needs-data. Story 8's Bulk Receive page also delivers the
  vendor-missing assign-vendor prompt + inline PN-fix UI that earlier VIU-pending
  cases needed. **DEV-NOT-BUILT = 0.**

**D. QuickBooks parked:** all QB/inventory-integrity checks (SF-QB-03..08,
SF-VMIS-03, SF-RCV-08) need QuickBooks/inventory back-end inspection — likely
requires dev/QB access; parked until an inspection path is provided.

**E. Latest spec/design/epic batch (2026-07-09) — RE-VIU BATCH 7 DONE
(full detail `viu-findings.md` BATCH 7, `spec-epic-diff-latest.md`):**

The Epic "What's Been Built" reported **Stories 7 / 8 / 9 / 14 as BUILT** on sv7301,
contradicting our 2026-07-08 VIU. **RE-VIU confirmed the Epic was correct** — all four
were deployed since that pass and are live-verified:

- **Story 7 (PO multi-select) BUILT** — `checkbox_select_all_orders` + per-row
  `checkbox_select_order_{id}`; action bar "N Purchase Orders selected" + Clear +
  Receive Selected → `/bulk-receive?ids=…`. SF-POSEL-01..06 all VIU-Verified.
- **Story 8 (Bulk Receive page) BUILT** — "Receive Vendor Parts" page grouped by
  vendor, per-PO/part checkboxes, qty/cost/sell inputs, per-PO invoice + Receive,
  global Receive All, Vendor-Missing group with `select_assign_vendor_{poId}` +
  `input_part_number_{partId}`. SF-BULK-01..09 + SF-PERM-03 Verified; SF-BULK-10
  (core Ok/NotOk) → needs-data.
- **Story 9 (Apply invoice) BUILT** — per-vendor `input_apply_invoice_{vendorId}` +
  "Apply to selected POs"; vendorless group has no apply control. SF-INV-01..03 Verified.
- **Story 14 (Waiting on Parts column) BUILT** — column selector offers "Waiting On
  Parts" (`toggle_column_unreceivedPartRequestsCount`), off by default, count per WO,
  "—"/no-link when nothing to receive. SF-WOP-01/03 Verified; SF-WOP-02 reachable-now.

**Both spec-vs-build CONFLICTS RESOLVED — in favour of the SPEC (no case changes needed):**
1. **Dummy PO vs shared WO PO → SPEC WINS.** The built app places vendorless parts on
   the **WO's own PO flagged "Vendor Missing"** (self-created S-15787: 2 vendorless
   parts share ONE order_id, vendorMissing=true — **no separate dummy PO**). On the
   Bulk Receive page they appear under a **"Vendor Missing" group** with an inline
   **assign-vendor** prompt; **Receive is shown-but-disabled (not hidden)** and
   vendor-missing POs **are selectable** on the PO list. → SF-VMIS-01/02 and
   SF-POSEL-05 are **correct as written**; the Epic's "Dummy PO / Receive hidden"
   wording is not the shipped behaviour.
2. **"Waiting on Receive" vs "Waiting on Parts" label → SPEC WINS.** The shipped column
   label is **"Waiting On Parts"** (toggle `toggle_column_unreceivedPartRequestsCount`),
   not the Epic's "Waiting on Receive". → SF-WOP-01/02/03 **correct as written**.

Because both conflicts resolved to "built matches our existing spec-based expecteds",
**no case EXPECTED diverged and no TestRail write was required** (and TestRail writes
need explicit user permission).

**Minor observations from RE-VIU BATCH 7 (recorded in `bugs-log.md` OBS-1..4 — notes,
not filing-grade defects):**
- **OBS-1** — the two conflicts above (both resolved in favour of the spec).
- **OBS-2** — the Bulk Receive page renders the **"Vendor Missing" group LAST** (spec
  S12-R3 wants the vendor-missing group to lead on Accept Delivery); flag whether the
  same lead-ordering should apply on the Bulk page (affects SF-RCV-05/07 wording only).
- **OBS-3** — SF-VMIS-05: the order Vendor-Missing flag clears on **vendor assignment
  alone** (before a PN is entered); the part number is enforced as a separate per-part
  receive gate. Functionally equivalent; nuance noted.
- **OBS-4** — SF-POSEL-04: fulfilled POs are **excluded** from the PO list (not
  shown-disabled), so inherently not selectable. Outcome matches; mechanism differs.

**Residual state from RE-VIU BATCH 7 (shared env — note for the next run):**
- **Irreversible received ZZAUTOTEST PO S-15786** (partial_delivery) + its
  Delivery/Vendor-Bill (invoice ZZAUTOTEST-APPLY-1, Aabridge Beverages) remain —
  received deliveries are **not reversible in-app**. The paired vendorless PO S-15787
  and both throwaway WOs (80d52344, 41a9e195) were deleted; 0 stray ZZPN inventory parts.
- **Settings drift:** a **parallel tester on the shared env** flipped
  `autoPickInventoryParts→false` and `requireVendorInvoiceNumber→false` mid-run. This
  pass made **ZERO settings writes**, so nothing was clobbered/restored by us; do not
  assume baseline settings on the next run — re-read `GET /api/organizations/settings`.

**F. Open items queued for the NEXT Milos/dev round (product decisions, not bugs):**
1. **Dummy-PO vs shared-WO-PO terminology conflict — RESOLVED by RE-VIU (§5.E):** the
   shipped app uses the **WO's own PO flagged Vendor Missing** (spec V2.4), not a
   separate Dummy PO, and Receive is **disabled-but-shown**. Remaining (minor, OBS-2):
   should the **Vendor-Missing group LEAD** on the Bulk Receive page (as spec S12-R3
   wants on Accept Delivery), rather than render last? A wording-only Milos/dev confirm
   (affects SF-RCV-05/07 only).
2. **"$0 sell price, no action needed" (design) vs "sell mandatory at save" (spec
   S5-R1) tension** — the latest completion-design screenshot warns "$0.00 sell
   price, no action needed to continue" (allows $0), while spec S5-R1 makes sell
   mandatory at save. (Note: Milos R2 Q4 already ruled sell is NOT enforced on the
   vendorless part-request form; this remaining tension is about the **completion /
   receive** surface's $0-sell handling.) Confirm whether $0 sell is allowed at
   completion. Drives SF-VAL-* / SF-VPART-*.
3. **See-Financial-Data gate on vendorless part-add** — carried from Milos R2 Q4:
   its "sell is mandatory" premise was overturned; whether a permission gate still
   applies is open (SF-VPART-02, SF-PERM-09).

---

## 6. Standing rules learned (Simple Flow) — all recorded in CLAUDE.md

- **Shortcut-interpretation principle (Simple Flow ONLY):** any behavior that
  reaches the same end state by SKIPPING a legacy flow/step is **EXPECTED** — a
  defect only if the skip (a) throws an ERROR or (b) corrupts data/inventory/
  Part-History integrity. Applied: BUG-4 & BUG-10 → EXPECTED; BUG-11 → REAL DEFECT
  (500); BUG-5/6/7/8/9 → OTHER (enforcement/added-requirement, not skips).
- **Last-update-wins contradiction rule:** when spec doc vs answer sheet vs design
  conflict, the MOST RECENT input is authoritative. The **V2.4 spec + 2026-07-08
  design bundle** override the earlier round-1 Milos answers where they disagree
  (e.g. No-PO path RETAINED; review-default = per-cohort not ON-for-all; review
  note is design-intended).
- **Self-service test data & role-switching:** on the disposable QA env, create/
  delete whatever data a case needs; to test role behavior, assign Tech the needed
  role then RESTORE Tech afterward (exact email match `tech@shopview.com`; mark
  throwaway data ZZAUTOTEST).
- **API-folder rule (STANDING RULE 4):** any case with API endpoints/verbs/status
  codes/backend checks goes in a TestRail section whose title contains "API"
  (applied via each case's `api_related` flag → sections 4089/4090).
- Plus the global standing rules: never write to TestRail without explicit user
  permission; confirm the target project on every instruction; never commit
  secrets (/tmp only).

---

## 7. Env & access facts (facts only — NO secret values; secrets live in `/tmp`)

- **QA env:** app `https://sv7301.qa.shopview.com`; API host
  `https://sv7301api.qa.shopview.com` (note `sv7301api`, no dot). This is the POC
  env referenced by the design handoffs.
- **Auth:** `POST /api/quick-login {key:'admin'|'tech'}` — **both now return 200**
  (the earlier tech-403 is FIXED). Gated by cookies `sv_sso_session` / `PHPSESSID`
  / `cf_clearance` (domain `.qa.shopview.com`). quick-login is **stateful on the
  shared PHPSESSID** — probe roles STRICTLY SEQUENTIALLY. Read FE permissions at
  `GET /api/auth/me/fe-permissions` → `{data:{fe_permissions:[<codes>],view_mode,
  cross_toggles}}`.
- **Settings-driven, NO feature flag** — controlled by the Work Orders settings
  tab. Read `GET /api/organizations/settings`; save
  `POST /api/organizations/settings/change` (full settings object).
- **Key routes:** WO settings `/administration/settings` → Work Orders tab; PO list
  `/parts/orders`; deliveries/Accept-Delivery `/parts/deliveries`; shared Accept
  Delivery surface `/accept-delivery/{orderId}`; WOs `/workorders` →
  `/workorders/{id}/lines`.
- **Key endpoints:** PO list `GET /api/inventory/orders`; order detail
  `GET /api/inventory/orders/{id}`; deliveries `GET /api/inventory/deliveries`;
  inventory parts `GET /api/inventory/parts?…&search=`; **legacy single-PO Receive =
  `POST /api/inventory/orders/accept`** (works for inventory POs; **500 for WO POs =
  BUG-11, now LOW urgency**); **Bulk Receive (WORKS for WO POs) =
  `POST /api/orders/receive-requested-parts`** (+ `GET /api/inventory/orders/receive-view`),
  driven from the `/bulk-receive?ids=…` page; simple completion
  `POST /api/work-orders/{id}/simple-complete`;
  change status `POST /api/work-orders/change-status`; remove WO part
  `POST /api/work-orders/parts/delete {part_id,work_order_id}`; new part request
  `POST /api/work-orders/part/make-request`.
- **Tech self-service role-switch (sv7301):** `POST /api/staff/{staff_id}/change`
  with `{first_name,last_name,email,role_id,workplace_id}` (+ job_title/salary/
  billable/clockable to avoid clobber). Tech: user `a7fd0a88-…`, **staff
  `6fb22c1b-…`**, restore role **Technician `131b5274-…`**, workplace
  `b3c8c820-…`, org `d55bc308-…`. EXACT-MATCH `email==='tech@shopview.com'` before
  changing; safety-net `restore-tech.mjs`. **All 11 system roles are real &
  assignable.** Roles list `GET /api/organizations/{org}/roles` (405 on
  `/api/roles`). Role ids: Admin `16fec34c…`, Service Manager `ef6e24c2…`, Senior
  Service Advisor `e03f176f…`, Service Advisor `3874cc56…`, Foreman `897018a5…`,
  Technician `131b5274…`, Parts Manager `5d703b9b…`, Parts Tech `486622b9…`,
  Office `163abe0d…`, Sales Rep `8eb4a1c1…`, Time Clock `0a198766…` (full map
  `/tmp/simple-flow/roles-map-6.json`).
- **Stories 7 / 8 / 9 / 14 are BUILT** (confirmed live RE-VIU BATCH 7, 2026-07-09):
  PO multi-select (`checkbox_select_all_orders` / per-row `checkbox_select_order_{id}`;
  Receive Selected → `/bulk-receive?ids=…`), the Bulk Receive page ("Receive Vendor
  Parts", grouped by vendor, Vendor-Missing group with `select_assign_vendor_{poId}` +
  `input_part_number_{partId}`), Apply-invoice (`input_apply_invoice_{vendorId}`), and
  the "Waiting On Parts" column (`toggle_column_unreceivedPartRequestsCount`, off by
  default). Nothing in Simple Flow is DEV-NOT-BUILT.
- **Cores:** genuine cored inventory part **P550848** (core_charge=1, has
  core_part_id); add via New Part Request → select_part catalog PN (forces
  Source=Inventory; qty via `input_bin_quantity_{binId}`). A genuine special-order
  (vendor-source) core is NOT seedable in-app.
- **Deliverable WO PO recipe (for receive testing):** New Part Request → Source =
  Vendor + real vendor (e.g. Aabridge Beverages) + free-text Part Number → complete
  WO → PO becomes `status:ordered, vendorMissing:false` on `/accept-delivery/{id}`
  (but Receive → 500, BUG-11).
- **NODE_USE_ENV_PROXY gotcha:** node `fetch` is blocked for the TestRail host in
  this env — the v2.4 push used **curl + Basic auth** instead. For UI automation,
  Chromium can't TLS through the egress proxy directly — build a FRESH MITM bridge
  per run (port rotates; read `$HTTPS_PROXY` live) and use the boot2 hydration
  pattern (VIU tools in `/tmp/simple-flow/tools/`).
- VIU tools live in `/tmp/simple-flow/tools/`; secrets are ephemeral (`/tmp` only,
  re-supply per environment).

---

## 8. How to resume

**Confirm the project first** (this workspace holds 3 projects) — instruction must
target **Simple Flow**.

**>>> DONE (RE-VIU BATCH 7, 2026-07-09):** Stories 7/8/9/14 confirmed BUILT & live,
24 cases flipped to VIU-Verified, DEV-NOT-BUILT → 0, both spec-vs-Epic conflicts
resolved in favour of the spec (no case changes), BUG-11 downgraded (§5.C/E). No
TestRail writes (no EXPECTED diverged).

**>>> NEXT ACTION: work down the remaining 46 VIU-PENDING (QA).** With fresh sv7301
cookies (admin + tech) + a rebuilt MITM bridge (Chromium can't TLS the egress proxy
directly; boot2 hydration; tools in `/tmp/simple-flow/tools/`):

1. **reachable-now (7)** — just need another VIU pass, no new inputs / seeding:
   **SF-COMP-12** (background PO count), **SF-VMIS-07** (sell-only part orderable →
   Vendor-Missing PO), **SF-RCV-10** (cost editable on Accept Delivery), **SF-WOP-02**
   (click Waiting-on-Parts count → Accept Delivery — needs a stable WO row with a
   non-zero count), **SF-VAL-10** (reuse one invoice # across POs via Apply-invoice),
   **SF-REV-12** (Ready-for-Review list filter/column), **SF-QB-09** (Part-Sales
   unaffected by shared order/status logic).
2. **needs-data (39)** — need a data state seeded first. Grouped by what to seed:
   - **core part** (genuine `is_core`, not seedable via canned/sub-form): all
     SF-CORE-02..09, SF-BULK-10, SF-REV-14.
   - **WO-PO receive via the Bulk Receive path** (BUG-11 no longer blocks — use
     `/bulk-receive`, not legacy Accept-Delivery): SF-COMP-13/19, SF-VAL-05/06,
     SF-PNFIX-01..06, SF-VPART-07, SF-REV-04, SF-RCV-06.
   - **invoiced/paid WO** (sell-field lock / receive-block guardrails): SF-VAL-09,
     SF-VEND-02..05.
   - **VIN-less asset** (non-review VIN gate): SF-VAL-02.
   - **QuickBooks / reports back-end inspection** (likely dev/QB access): SF-QB-03..08,
     SF-VMIS-03/06, SF-RCV-08.
   - **Accept-Delivery surface specifics:** SF-RCV-05/07 (also gated on Milos Q11
     ordering — see §5.A/OBS-2).
3. **needs-account: 0** — role-switching is self-service (assign Tech the role, then
   restore Technician `131b5274`).
4. After any live confirmation, update `cases/*.json`, re-run `gen_blockers.py` +
   `gen_import.py`, emit an ID-matched `gen_update.py` file, get user approval, then push.

**Other resume paths (as inputs land):**

**When Milos answers Round-2 (`OpenQuestions-for-Milos-Round2.md`):**
1. Record answers verbatim (new `milos-answers-round2-source.*`) and map them in a
   new mapping doc (mirror `milos-answers-mapping.md`).
2. Apply the confirmed outcomes to the case JSONs (`cases/*.json`): flip
   `viu_status`/`expected` for the 15 MILOS-ANSWER cases (+ the 6 BUG/RULING if Q5
   rules on FE-vs-BE enforcement).
3. Re-run `gen_blockers.py`, then `gen_import.py` (rebuilds import CSV + workbook),
   then `gen_update.py <cleared SF ids>` for an ID-matched TestRail update file.
4. **Ask the user before any TestRail write.**

**When the legacy Accept-Delivery BUG-11 500 is fixed (LOW urgency — bulk path works):**
1. Get fresh sv7301 cookies (admin + tech) into `/tmp` and rebuild the MITM bridge.
2. Re-confirm the single-PO `POST /api/inventory/orders/accept` receive on a WO PO
   now returns 201 (the round-trip is already achievable via `/bulk-receive`).

**When fresh QA cookies / role accounts are supplied:**
1. Cookies → work the 46 VIU-PENDING (reachable-now 7 first, then needs-data 39
   as data becomes seedable — see the NEXT ACTION list above).
2. A 2nd/3rd role account (some WITHOUT See Financial Data) → close the last
   SF-PERM-09/10 role-gating negatives; restore Tech to Technician afterward.

**File the 7 Jira bug drafts** (`jira-bug-drafts.md`) from the chat app where
Atlassian is connected (not available in this CLI env).

**Two-phase finalization** (`RESUME-STRATEGY.md`): current TestRail import files
are INTERIM. FINAL = the regenerated post-VIU + dev-answered files. Never write to
TestRail without explicit user permission.
