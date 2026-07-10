# Fees & Discounts V1 — PROJECT STATE (canonical resume snapshot)

> **THIS IS THE CANONICAL STATE DOC for the Fees & Discounts (F&D V1) project.** It
> is a single authoritative snapshot so the project can be resumed with zero
> re-discovery.
> **Last updated:** 2026-07-10 (PAUSE SNAPSHOT — after the **FRESH FULL VIU PASS
> 2026-07-10** [all 182 cases re-adjudicated live in one day-run; raw probe results in
> `fresh-viu-2026-07-10/`; tester-facing workbook `FeesDiscounts_FreshVIU_2026-07-10.xlsx`]
> and after sending the **Round-2 PO question sheet** to Chris Ward).
> **⏸️ THE PROJECT IS PAUSED — see §0 below for what we're waiting on and the exact
> resume procedure.**
> **Source of truth for per-case status:** the case JSONs `build/fees-discounts/cases/*.json`
> (`viu_status`), tallied by `build/fees-discounts/FeesDiscounts_Blockers_Tracker.md`/`.xlsx`
> (regenerate with `python3 build/fees-discounts/gen_blockers.py`). All counts below
> are cited from those files — do not invent numbers; re-read them if in doubt.
> Companion docs kept current: `PROJECT-STATUS.md` (narrative log), `viu-qb-findings.md`
> + `viu-findings.md` (VIU evidence + FDBUG register), `bugs-log.md`, `viu-recon.md`
> (env map), `RESUME-STRATEGY.md` (two-phase finalization).

---

## 0. PAUSED — WAITING ON (read this first) — pause snapshot 2026-07-10

**The project is PAUSED until Chris Ward (the F&D PO) returns the filled Round-2
question sheet.** This section is the complete pause snapshot: what we're waiting
on, the pre-decided per-answer action map, everything else open at pause, and the
ordered resume checklist. The rest of this doc holds the standing detail.

### 0.1 Waiting on: Chris Ward's answers to `PO-Questions-Round2.xlsx` (4 questions)

- **What was sent:** `build/fees-discounts/PO-Questions-Round2.xlsx` (+ `.md`;
  generator `gen_po_questions_round2.py`) — 4 plain-language product decisions
  raised by the fresh full VIU pass 2026-07-10. **The user will share the filled
  file back** — that is the resume trigger.
- **Resume = apply this PRE-DECIDED action map** (condensed from the Round-2 QA
  Internal Mapping at the bottom of `PO-Questions-Round2.md` — read that for full
  spec refs/evidence). **NOTE: every TestRail edit below requires FRESH one-day
  user authorization at execution time** — the 2026-07-09/10 authorization is
  spent (standing rule: never write to TestRail without explicit permission).

| Q | Topic (internal ref → cases) | Answer → action | TestRail cases to update |
|---|---|---|---|
| **Q1** | Over-discount saves silently, no warn/confirm (**FDBUG-15** → FD-QB-014; companions FD-QB-012 floor / FD-QB-015 credit) | **A (add warning):** keep spec expected on FD-QB-014 (stays Deviation until dev fix); DRAFT + release a **NEW dev ticket** for the missing S6-R12 warn/confirm (no draft exists yet — write it then). **B (silent OK):** case-update FD-QB-014 expected → silent save + exact customer credit; flip to Verified; update C28557 (align C28555/C28558 wording only if touched). | [C28557](https://shopview.testrail.io/index.php?/cases/view/28557) (+ [C28555](https://shopview.testrail.io/index.php?/cases/view/28555), [C28558](https://shopview.testrail.io/index.php?/cases/view/28558) companions) |
| **Q2** | maxCap 0 stored but ignored = "no limit" (**FDBUG-9** → FD-CALC-008, FD-VAL-006, FD-TMPL-011; **held draft = jira-bug-drafts.md TICKET 4**) | **A (0 = no limit):** case-update all 3 expecteds to "0 = no cap"; **DROP TICKET 4**; flip cases to Verified; update the 3 C-cases. **B (cap at $0.00):** **FILE TICKET 4 as drafted** (§5-R6 wins); cases keep spec expected (stay Deviation until fix). **C (refuse 0):** new validation requirement — revise TICKET 4 to "reject 0", case-update all 3 expecteds to rejection; update the 3 C-cases. | [C28575](https://shopview.testrail.io/index.php?/cases/view/28575), [C28604](https://shopview.testrail.io/index.php?/cases/view/28604), [C28512](https://shopview.testrail.io/index.php?/cases/view/28512) |
| **Q3** | Below-minimum percent silently coerced up to 0.01% (**FDBUG-10** → FD-CALC-006; **held draft = TICKET 5**) | **A (rounding fine):** case-update FD-CALC-006 to expect coercion; **DROP TICKET 5**; flip to Verified; update C28573. **B (store exact):** revise TICKET 5 to a store-exact dev change (likely new precision spec); case gets exact-value expected. **C (reject):** **FILE TICKET 5 as drafted**; case keeps spec expected (Deviation until fix). | [C28573](https://shopview.testrail.io/index.php?/cases/view/28573) |
| **Q4** | Processing-fee minimum silently stripped on create (no FDBUG — §8 no-minimum invariant holds; deviation = silent-ignore vs explicit reject → FD-PROC-014, currently Verified with a standing wording note) | **A (support pfee minimums):** spec/data-model change — annotate `requirements.md`, author NEW pfee-minimum cases, update C28532 expected. **B (don't support, but make clear):** case-update FD-PROC-014 to expect explicit reject / absent field (vs today's silent strip); update C28532; optionally a low-sev dev tweak ticket for the silent strip. | [C28532](https://shopview.testrail.io/index.php?/cases/view/28532) |

### 0.2 Current fresh-pass state (2026-07-10)

- **Tally (all 182 cases re-adjudicated live in one run): 114 VIU-Verified / 35
  VIU-Deviation / 12 Blocked-NotBuilt / 20 Blocked-Env / 1 VIU-Pending
  (FD-PART-005).** Every case in `cases/*.json` carries `fresh_run: 2026-07-10` +
  a fresh evidence note. Detail: §2 below.
- **Deliverables at pause** (paths relative to repo root):
  - `build/fees-discounts/FeesDiscounts_FreshVIU_2026-07-10.xlsx` / `.csv` —
    tester-facing fresh-pass workbook (generator `gen_fresh_viu_workbook.py`).
  - `build/fees-discounts/FeesDiscounts_Blockers_Tracker.md` / `.xlsx` — per-case
    source of truth (regenerate: `python3 build/fees-discounts/gen_blockers.py`).
  - `build/fees-discounts/PO-Questions-Round2.md` / `.xlsx` — the sheet sent to
    Chris (PO-facing 4 questions + QA-only internal mapping in the `.md`).
  - `build/fees-discounts/jira-bug-drafts.md` — 11 plain-language dev-ticket
    drafts **with hold flags** (see §0.3; user files via Atlassian — unreachable
    from this env).
  - `build/fees-discounts/testrail-viu-sync-log.md` — 2026-07-10 authorized sync
    audit: 114 Verified cases gated, **0 updates needed (all no-op)**.
  - `build/fees-discounts/fresh-viu-2026-07-10/` — raw probe JSONs (P1–P6 +
    templates baseline; the 4 line-create-500 requestIds live here).
  - Audit logs: `testrail-po-clarify-log.md`, `testrail-caseupdate-log.md`,
    `section-rename-log.md`, `testrail-fd-api-section-move-log.md`.
  - `build/fees-discounts/testrail-id-map.csv` — all 182 FD-ID→C# mappings.

### 0.3 Other open threads at pause

**Dev tickets (`jira-bug-drafts.md`; the USER files them — Atlassian unreachable here):**
- **CLEARED — ready to file now (not gated on Chris):** TICKET 2 (FDBUG-2 pfee
  base includes whole-WO adjustments — re-confirmed live 2026-07-10), TICKET 3
  (FDBUG-3 auto-applied adjustments write no history — re-confirmed), TICKET 6
  (FDBUG-14 part-line dialog label defects), TICKET 7 (BUG-FD-3 whole-WO FE-only
  enforcement — dev-routing; finding stands from pass A but is currently NOT
  re-testable, see role drift below), TICKETS 8–11 (round-1 PO-confirmed defects:
  Stats per-row, Add disabled-until-valid, show-more collapse, missing
  Processing-Fee builder UI).
- **HELD on Chris's Round-2 answers:** TICKET 4 (Q2) and TICKET 5 (Q3); plus a
  potential NEW Q1 ticket (over-discount warning) that exists only if Q1=A.
- **DROP/CLOSE recommended:** TICKET 1 (FDBUG-1 totals bug) — NOT reproduced on
  3 consecutive passes; FD-DOC-011 now Verified; residual work is the GST→US-tax
  re-word of FD-EDIT-002 / FD-DOC-011 / FD-CALC-011 / FD-CALC-014 (reconciliation
  group D), not a bug filing.
- **FDBUG-12 CONFIRMED FIXED** 2026-07-10 (API-created customers now inherit
  auto-apply defaults). **FDBUG-16 NEW** (raw API accepts an empty-name adjustment
  201 while the UI blocks — FE-only guard, low sev; regression vs batch-3's 400):
  no draft yet — decide at resume whether to draft or bundle (same pending call as
  register-only FDBUG-11/FDBUG-13).

**Env issues to hand dev (environment, not F&D code):**
- **WO line-create 500** env-wide — 4 requestIds captured in the
  `fresh-viu-2026-07-10/` probe JSONs; blocks FD-PART-005 + seeding fresh
  invoiceable WOs.
- **QB unmap 500** — `PUT /api/bookkeeping/settings {settings:{feeItemId:null}}`
  500s; the mapping-guard cycle FD-QB-004..008 cannot be driven.
- **QB export failure on duplicate document numbers** (re-invoiced WOs never
  reach QuickBooks).
- **Technician role DRIFTED on the shared qb env** (now has
  `workOrdersCreateAndEdit` + `workOrdersDelete`) — the `/tmp/fdcln/roles-matrix.json`
  derivations are STALE; **re-derive the roles matrix before ANY permission
  retest** (BUG-FD-3 / FD-PERM re-checks are invalid until then).

**Human / env-window items:**
- **~14 QB-UI eyeball checks need a human logged into QuickBooks** (no QB read
  API): FD-QB-001..011, 013, 016 line internals + FD-QB-015's goodwill-memo half
  + FD-CALC-017's penny-cap half.
- **6 flag-off / shared-env cases deliberately NOT run** while the manual tester
  is active on the shared env (FD-FLAG-001/002/003, FD-HIST-004, FD-TMPL-012) —
  need a coordinated flag-off window.
- **Leftover ZZ-tagged shells (harmless, documented in §6):** WO **S-15947**
  (`b7c9e9a5…`; Completed → undeletable, stripped to 0 lines / 0 adjustments / $0)
  and customer **"ZZAUTOTEST FD Fresh710"** (`b881540e…`; empty shell, undeletable
  due to an orphan contact with no discoverable API).

### 0.4 Env / access facts for the resume session

- **Cookies are EPHEMERAL** — re-supply per session into `/tmp` only
  (`sv_sso_session` + `PHPSESSID` + `cf_clearance`, domain `.qa.shopview.com`).
  Never in the repo.
- **The env sleeps** — wake with
  `POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv
  {action:'wake',env:'sv7387'}`, then poll the API root `/` for 200 (~60s).
- **Poisoned-PHPSESSID fix** — if every request 500s, mint a fresh quick-login
  WITHOUT the old PHPSESSID; avoid `POST /api/iam/change-location`. Full working
  recipe: `build/APP-ACTIONS-PLAYBOOK.md`.
- **TestRail sync** — `build/fees-discounts/testrail_viu_sync.py` is idempotent
  (gates on the gen_import.py rules; the 2026-07-10 run was 114 gated / 0 updates,
  all no-op), but **every run needs fresh explicit user authorization that day**.
  ID source: `testrail-id-map.csv`.

### 0.5 How to resume (ordered checklist)

1. **Ingest Chris's filled `PO-Questions-Round2.xlsx`** (the user will share it).
2. **Apply the §0.1 action map:** edit `cases/*.json` expecteds + `viu_status`
   flips per answer; release / drop / revise the held Jira drafts (TICKET 4,
   TICKET 5, potential new Q1 ticket) in `jira-bug-drafts.md`; hand the user the
   cleared tickets (§0.3) to file via Atlassian.
3. **Ask the user for fresh one-day TestRail write authorization.**
4. **Sync TestRail** (`testrail_viu_sync.py` / targeted `update_case`) for the
   §0.1 cases + any newly-Verified cases; append the per-case audit log.
5. **Regenerate deliverables:** `gen_blockers.py` → `gen_fresh_viu_workbook.py`
   → `gen_import.py` + `build_workbook.py` (two-phase finalization per
   `RESUME-STRATEGY.md`).
6. **Then the remaining VIU backlog if the env allows:** 20 Blocked-Env (needs
   the unmap-500 fix for FD-QB-004..008, a human QB-UI eyeball for the ~14 QB
   checks, and a flag-off window for the 6 shared-env cases) + 1 Pending
   FD-PART-005 (needs the line-create-500 fix). **Re-derive the roles matrix
   first** before touching any permission case.

---

## 1. Summary

**What F&D V1 is:** ShopView **"Fees & Discounts V1"** — the ability to add
fees/discounts (and a Processing Fee) at the whole-work-order, labor-line, part-line
and part-sale levels, from reusable admin **templates**, with **customer defaults**
(auto-applied to new WOs), a defined **calculation contract** (§5), rendering on
customer estimates/invoices, a WO **history log**, **QuickBooks** sync, and a
**Story-13 permissions model** (See Financial Data + WO/Lines Create&Edit + Manage
AP/AR gates). Controlled per-org by the **`FeesAndDiscounts` feature flag**.

**Spec status:** `requirements.md` is the working spec extract **incl. Story 13
permissions** and the §5 calculation contract. (Historical note: an earlier source
PDF was truncated at Story 2; the current `requirements.md` covers the stories
exercised by the 182 cases — S1–S14 + §5 + §7/§9/§10/§13.)

**Env:** app `https://qb.qa.shopview.com` · API `https://sv7387api.qa.shopview.com`
(SV-7387) · **`FeesAndDiscounts` flag = ON**. **QuickBooks IS now CONNECTED (2026-07-09
batch-5 finding — supersedes the earlier "not connected"):** org "Staging Foothills Group
Inc", location **Staging Lethbridge - 4310** (= admin default_workplace; both org locations
`bookkeeping_enabled:true`); `adjustment-item-mapping-status` = connected + both items mapped;
real QB chart of accounts + unexported-items returned. **AVOID `POST /api/iam/change-location`** — batch-6
root-caused the recurring "sustained 500 incident": it is a **POISONED SHARED PHPSESSID**
(every request carrying it 500s; a fresh quick-login WITHOUT the old PHPSESSID mints a
working session), and change-location is the prime suspect trigger (500s began minutes
after it in both batch-5 and batch-6; admin default_workplace is already Lethbridge so it
is unnecessary). **The env also SLEEPS**: 302s to `sleep.qa.shopview.com`; wake with
`POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv
{action:'wake',env:'sv7387'}` then poll the API root `/` for 200 (~60s).
Full env/access map: `viu-recon.md`.

**Overall status:** **PAUSED 2026-07-10 awaiting Chris Ward's Round-2 answers (§0).**
**FEATURE LIVE on qb; FRESH FULL VIU PASS DONE 2026-07-10** (all 182
cases re-adjudicated live the day the manual tester started; every `viu_status` now
carries `fresh_run: 2026-07-10` + a fresh evidence note). Tally: **114 VIU-Verified /
35 VIU-Deviation / 12 Blocked-NotBuilt / 20 Blocked-Env / 1 VIU-Pending (FD-PART-005)**.
Fresh-pass deltas vs batch-6: **FD-DOC-011 → Verified** (FDBUG-1 NOT reproduced for the
3rd consecutive pass — doc Subtotal/GST/Total include adjustments and match the API
exactly; treat FDBUG-1 as fixed, residual = GST→US-tax re-word); **FD-QB-015 →
Blocked-Env with its in-app half VERIFIED** (invoicing an over-discounted WO recorded a
customer credit of exactly the excess −117.24; the QB goodwill-memo half is unobservable
— export fails on the duplicate-doc-number env bug and there is no QB read API).
**Re-confirmed live today:** FDBUG-2 (pfee base includes whole-WO adjustments — clean
discriminator: 3% pfee = 0.63 on a WO whose only money is a $20 whole-WO fee),
FDBUG-3 (+FD-HIST-007) auto-applied adjustments write no history, FDBUG-9 (maxCap 0 = no
cap), FDBUG-10 (0.005% coerced to 0.01%), FDBUG-15 (over-discount saves silently, no
warn/confirm), BUG-FD-4 (Add/Create buttons enabled on empty forms), BUG-FD-5 (no
Show-N-more), FDBUG-6 (Stats aggregate), Story 8 builder UI still missing (Type options =
Fee|Discount only), Story 11 Part Sales still absent (fresh part sale created + checked).
**NEW today: FDBUG-16** — the raw API now ACCEPTS an empty-name adjustment (201;
regression vs batch-3's 400) while the UI still blocks it (FE-only guard, low sev).
**FIXED today: FDBUG-12** — API-created customers now DO inherit auto-apply defaults.
**Env bugs persisting 2026-07-10:** WO line-create 500s env-wide (4 requestIds captured;
blocks fresh invoiceable WOs, FD-PART-005 and part-flow re-seeding); QB export of
re-invoiced WOs fails on duplicate document numbers; NEW: `PUT /api/bookkeeping/settings
{settings:{feeItemId:null}}` 500s → the mapping-guard cycle (FD-QB-004..008) cannot be
driven (unmap impossible). Technician role DRIFTED on the shared env (now has
workOrdersCreateAndEdit + workOrdersDelete; roles-matrix.json derivations need a re-pull
before reuse; BUG-FD-3 not re-testable). Remaining gates: **dev** (Stories 8/11 +
code-bug FDBUGs + line-create + duplicate-number export + unmap 500), **PO** (3
PO-question deviations), **QB-side UI inspection** (13 QB line cases + memo half +
penny-cap half), **flag-off window** (not taken — tester active on the shared env).
**TestRail:** the 2026-07-10 fresh-run master-case sync was explicitly authorized and
executed (see `testrail-viu-sync-log.md`); **any further write needs new permission.**

---

## 2. Case inventory

**Total authored cases: 182** (source: the three `cases/*.json` files; tallied by the
Blockers Tracker).

**By authoring group (`cases/*.json`):**

| Group file | Count | Scope |
|---|---:|---|
| `group-A-wo-parts.json` | 61 | WO whole-WO / labor-line / part-line adjustments, inline display, Stats, Financial Info card, Parts-page column + breakdown modal, edit/remove/stacking |
| `group-B-customer-admin-finance.json` | 83 | Customer Fees&Discounts tab + defaults lifecycle, Template admin (create/edit/delete/scoping/validation), Processing Fee, customer documents (estimate/invoice, Shop Supplies), QuickBooks, History log |
| `group-C-calc-permissions-validation.json` | 38 | §5 calculation contract, Story-13 permissions, feature-flag gating, validation / edge |
| **TOTAL** | **182** | |

**By delivery state (Task-1 classification of every case, from the Blockers Tracker):**

| State / bucket | Count | Meaning |
|---|---:|---|
| **VIU-Verified (READY)** | **114** | Fresh-pass 2026-07-10: exercised (or evidence re-validated) and matches spec (FD-DOC-011 flipped in — FDBUG-1 not reproduced) |
| **VIU-Deviation** | **35** | Built but deviates from spec — all re-confirmed or carried with fresh notes 2026-07-10 |
| **Blocked — DEV NOT BUILT** | **12** | RE-CHECKED 2026-07-10: Story 8 Processing-Fee builder UI (4) + Story 11 Part Sales (7) + FD-PERM-004 |
| **Blocked — ENV** | **20** | QuickBooks internals/unmap-500 (14 incl. FD-QB-015's memo half + FD-CALC-017's QB half) + flag-off/shared-env (6: FD-FLAG-001/002/003, FD-HIST-004, FD-TMPL-012) |
| **VIU-Pending** | **1** | FD-PART-005 (receive-transition; line-create 500 persists + completed-line lock) |
| **TOTAL** | **182** | 114 verified + 68 not-yet-verified |

**VIU-Deviation (35) sub-split — fresh pass 2026-07-10** (tallied by the Blockers
Tracker: 6 code-bug + 3 PO-question + 26 case-update):

| Sub-bucket | Count | Cases |
|---|---:|---|
| **code-bug** (needs a dev fix) | 6 | FD-PROC-009 + FD-CALC-013 (FDBUG-2), FD-HIST-001 (FDBUG-3), FD-CALC-006 (FDBUG-10), FD-CALC-008 + FD-VAL-006 (FDBUG-9). (FD-DOC-011/FDBUG-1 dropped — not reproduced, now Verified.) Plus new low-sev **FDBUG-16** (empty-name accepted by the raw API only) noted on Verified cases FD-WO-008/FD-VAL-003. |
| **PO-question** (needs a product ruling) | 3 | FD-STATS-001 (Stats layout, BUG-FD-2), FD-PERM-002 + FD-WO-013 (whole-WO FE-vs-BE enforcement, BUG-FD-3 — not re-testable, Technician role drifted) |
| **case-update** (label/copy/UX drift + PO-accepted behaviors) | 26 | FD-WO-001/005, FD-VAL-001, FD-LABOR-001, FD-PART-001 (FDBUG-14), FD-INLINE-003, FD-STATS-002/004, FD-FIN-004, FD-REMOVE-001, FD-CUST-003/004/005/006/007, FD-TMPL-001/003/004/006/008/010/011, FD-PROC-008, FD-HIST-002/007, FD-QB-014 (FDBUG-15) |

**Not-Built (12) by story — re-checked live 2026-07-10:** Story 8 (Processing-Fee
builder UI; Type options are still only Fee|Discount) = FD-PROC-001..004; Story 11
(Part Sales; fresh part sale created — no F&D column/API surface) = FD-PCOL-001..007 +
FD-PERM-004.

**ENV (20) by sub-bucket:** QuickBooks = FD-QB-001..011, 013, 016 + FD-QB-015 (memo
half; in-app credit half VERIFIED) + FD-CALC-017 (QB penny-cap half; floor half
VERIFIED) — line internals need a QB-UI eyeball; the mapping-guard cycle is blocked by
the unmap 500; export currently fails on duplicate doc numbers. Flag-off / shared-env =
FD-FLAG-001/002/003, FD-HIST-004, FD-TMPL-012 (not taken while the manual tester is
active).

**VIU-Pending (1):** FD-PART-005 (requested→received transition — blocked by the
line-create 500 + the completed-line part-request lock).

---

## 3. TestRail state

- **Project 1 · Suite 1 "Master"** on `https://shopview.testrail.io`.
- **F&D cases imported** under parent section **3894** = "Fees & Discounts
  (VIU-PENDING)" (the brief's older id 3822/3822-prefix was renamed/superseded; 3894
  is the live parent — see `section-rename-log.md`). Leaf sections per functional
  area; the "Fees and Discounts V1 > " prefix was stripped from all 70 sections.
- **API sections (STANDING RULE 4):** the two API-flagged cases were moved into
  API-titled sections under parent 3894 —
  **`API — Customer Fees & Discounts tab — negative` (section 4087)** = FD-CUST-017
  (case 28501) and **`API — Processing Fee — negative` (section 4088)** = FD-PROC-010
  (case 28528). Audit: `testrail-fd-api-section-move-log.md`.
- **F&D Case-ID map:** **BUILT 2026-07-09** → `build/fees-discounts/testrail-id-map.csv`
  (columns `ID,fd_id,title,section`; all **182** cases mapped read-only against the live
  suite under parent 3894). **178** matched on exact (normalized) title; the remaining
  **4** matched via the documented feature-flag-free rename ("feature flag" /
  "FeesAndDiscounts flag" → "Fees & Discounts feature"), each an unambiguous 1:1 pairing:
  FD-HIST-004→28563, FD-PERM-010→28594, FD-FLAG-001→28596, FD-FLAG-002→28597. The 2 API
  cases confirm the earlier log (FD-CUST-017→28501, FD-PROC-010→28528). Use this before
  any ID-matched TestRail update loop. **Never write to TestRail without explicit user
  permission.**
- **Import files remain INTERIM** (`testrail-import/fees-discounts-v1-testrail-import.csv`
  / `.xlsx`, all 182; VIU-word-free + feature-flag-free per user rule) pending
  post-VIU + dev/PO-answer finalization (two-phase plan in `RESUME-STRATEGY.md`).
- **Never write to TestRail without explicit user permission.**

---

## 4. Deliverables index (paths relative to repo root `/home/user/Manual-test-Cases/`)

**Test cases (authored source):**
- `build/fees-discounts/cases/group-A-wo-parts.json` — 61 cases.
- `build/fees-discounts/cases/group-B-customer-admin-finance.json` — 83 cases.
- `build/fees-discounts/cases/group-C-calc-permissions-validation.json` — 38 cases.

**Human-readable workbook / CSV:**
- `build/fees-discounts/FeesDiscounts_V1_TestCases.xlsx` / `.csv` — the full test-case
  workbook (tab-per-area + summary), built by `build_workbook.py`.

**TestRail import artifacts:**
- `testrail-import/fees-discounts-v1-testrail-import.csv` / `.xlsx` — full-suite
  import (all 182; VIU-word-free, feature-flag-free; leaf sections; API-titled
  sections for the 2 API cases), built by `build/fees-discounts/gen_import.py`.

**Tracking / status:**
- `build/fees-discounts/FeesDiscounts_Blockers_Tracker.md` / `.xlsx` — **source of
  truth** for per-case state + blocker category + owner + what's-needed (+ Summary).
- `build/fees-discounts/PROJECT-STATE.md` — **this file** (canonical resume snapshot).
- `build/fees-discounts/PROJECT-STATUS.md` — narrative status log.
- `build/fees-discounts/RESUME-STRATEGY.md` — two-phase finalization + unblock→update loop.

**Analysis / VIU / provenance:**
- `build/fees-discounts/requirements.md` — spec extract (incl. Story 13 permissions + §5 calc contract).
- `build/fees-discounts/design-notes.md` — design catalog.
- `build/fees-discounts/viu-recon.md` — qb env map + per-surface BUILT/NOT-YET table + access.
- `build/fees-discounts/viu-qb-findings.md` — batch-1 deep-VIU scoreboard + **FDBUG register** + API map.
- `build/fees-discounts/viu-findings.md` — pass-A / batch-2 per-priority VIU evidence + endpoints.
- `build/fees-discounts/bugs-log.md` — BUG-FD-1..5 + NOTE-FD-4..7 register (batch-2 current).
- `build/fees-discounts/viu-evidence/` and `build/fees-discounts/screenshots/` — VIU screenshots.
- `build/fees-discounts/section-rename-log.md` — TestRail section rename audit.
- `build/fees-discounts/testrail-fd-api-section-move-log.md` — API-section move audit (sections 4087/4088).
- `build/PERMISSIONS-ASSESSMENT.md` — cross-project permissions assessment (F&D permissions = DEFINED / reuse-only).

**Generators (Python):**
- `build/fees-discounts/gen_import.py` — rebuilds the TestRail import CSV/XLSX.
- `build/fees-discounts/build_workbook.py` — rebuilds the human-readable workbook.
- `build/fees-discounts/gen_blockers.py` — rebuilds the Blockers Tracker (`.md` + `.xlsx`).

---

## 5. Bugs / deviations — the FDBUG register + PO-confirmation set

**FDBUG register** (full detail in `viu-qb-findings.md`; narrative in `bugs-log.md`):

- **FDBUG-1 — MAJOR (totals bug).** WO `total_cost`, Financial-Info Total/Balance
  AND the customer estimate Subtotal/Total all EXCLUDE the net adjustment amount,
  while GST *includes* the adjustments' tax effect → customer-facing money is wrong.
  Case: FD-DOC-011.
- **FDBUG-2 — processing-fee Grand-Total base wrong.** The pfee base includes
  whole-WO fees/discounts + their tax; §5-R4 requires it to EXCLUDE every whole-WO
  adjustment. Cases: FD-PROC-009, FD-CALC-013 (+ Stats FD-STATS-001/002/004).
- **FDBUG-3 — auto-applied adjustments write NO history-log entry** (manual
  add/edit/remove ARE logged). Case: FD-HIST-001. Also the enforcement finding: the
  whole-WO adjustment write + the history endpoint are **FE-only** (see §6/BUG-FD-3).
- Smaller: **FDBUG-9** maxCap 0 accepted as "no cap" (FD-CALC-008, FD-VAL-006);
  **FDBUG-10** percent below minimum silently rounded up not rejected (FD-CALC-006);
  **FDBUG-4/5/6/7** display/UX (Line-Total gross-only, Stats aggregate, no "Show N
  more", customer-default single-select picker); **FDBUG-8** Processing Fee absent
  from the builder UI though the BE supports it; **FDBUG-11** history omits the
  "Type:" line; **FDBUG-12** API-created customers don't seed auto-apply defaults;
  **FDBUG-13** line-scope Add dialog has no template picker.

**New batch-2 bugs/notes (in `bugs-log.md`):** **BUG-FD-4** (Add button not disabled
on an empty form — validates on submit instead; FD-WO-005/FD-VAL-001), **BUG-FD-5**
(no "Show N more" collapse on ≥2 line adjustments; FD-INLINE-003), **NOTE-FD-7**
(Add-dialog Taxable is a toggle not a dropdown; template delete-confirm wording
differs). **NOTE-FD-4** = BE accepts `kind:processing_fee` though the builder UI is
absent (PO to confirm intent).

**Deviation / findings awaiting a PO ruling (the "5" + the pending-flagged set):**

| Case | Status | PO question |
|---|---|---|
| FD-STATS-001 | VIU-Deviation | Stats aggregate layout — intended V1, or is the per-row layout still to build? (BUG-FD-2) |
| FD-PERM-002 | VIU-Deviation | Whole-WO adjustment writes FE-only at BE — enforce or leave FE-gated? (BUG-FD-3) |
| FD-WO-013 | VIU-Deviation | Whole-WO starting-places hidden without WO Create&Edit is FE-only — same ruling |
| FD-CUST-016 | VIU-Verified | Double-add (BUG-FD-1) did NOT reproduce on batch-2 — PO to confirm the S9 fix shipped |
| FD-VAL-007 | VIU-Verified | Double-add validation — PO to confirm fixed / re-scope to single adjustment |

(Plus the 6 VIU-Pending deviations batch-2 flagged for PO: FD-WO-005, FD-VAL-001,
FD-INLINE-003, FD-STATS-002, FD-STATS-004, FD-CUST-005 — see §2.)

---

## 6. Open threads / what unblocks what

- **BATCH-6 LEFTOVER CLEANUP — DONE 2026-07-10 (fresh-pass step 1).** S-15895
  reverse-invoiced (200), both ZZAUTOTEST adjustments removed (204), baseline verified
  (sub 182.76 / GST 9.14 / total 191.90, adjs ["Flat fee"], status Complete — re-verified
  after EVERY probe batch of the fresh pass); failed-export + my credit-memo unexported
  entries marked done; 3 of the 4 line-less WOs deleted (201). **Known residue (harmless,
  ZZ-tagged):** (1) WO **S-15947** `b7c9e9a5…` could NOT be deleted — it was walked to
  Complete and the API refuses both delete ("Completed work order cannot be deleted") and
  any status change back; it is now stripped to 0 lines / 0 adjustments / $0. (2) Customer
  **"ZZAUTOTEST FD Fresh710"** (`b881540e…`) holds one orphan contact whose id is not
  retrievable via any discovered API (no contacts-list endpoint; UI tab makes no list
  call), so `customers/delete` 400s ("Company with a customer") — empty shell, no WOs/
  defaults/financials. (3) The 3 pre-existing unexported entries (S3-15929, S3-15889 ×2)
  belong to OTHER testers — left untouched.

- **Fresh qb cookies → resume VIU.** (Post-fresh-pass the VIU backlog is only the
  **20 Blocked-Env + 1 VIU-Pending** — see §0.5 step 6.) Fresh cookies are also —
  via the self-service staff role-switch — a prerequisite for the remaining role
  work. (Tech quick-login is **FLAKY** on qb — 200 in batch-1/2, 403 in recon —
  retest each run.)
- **Restricted-role accounts → the 4 NEEDS-ACCOUNT Story-13 negatives**
  (FD-PERM-004/008/010, FD-CUST-015). The tech quick-login user is **not in the org
  staff table** on qb and quick-login only supports admin/tech, so the other 9 roles
  cannot be logged in / role-switched here — a real non-Tech account (or a fixed
  login path) is required. Restore Tech afterward. (Batch-2 verified the REST of the
  Story-13 matrix by DERIVING per-role capability from `roles-matrix.json`, which is
  why 9 Story-13 cases flipped to Verified.)
- **Dev → Stories 6 / 8 / 11 + the code-bug deviations.** Story 8 (Processing-Fee
  builder UI) unblocks FD-PROC-001..004; Story 11 (Part Sales) unblocks
  FD-PCOL-001..007; a QuickBooks-connected env (or dev/QB-side inspection) unblocks
  the 13 QB ENV cases. The 7 code-bug deviations (FDBUG-1/2/3/9/10) need dev fixes.
- **PO → deviation confirmations + double-add + NOTE-FD-4.** Rule on the 3
  PO-question deviations (Stats layout; whole-WO FE-vs-BE enforcement), confirm the
  double-add fix (FD-CUST-016/FD-VAL-007), and confirm NOTE-FD-4 (should the BE keep
  accepting `processing_fee` before the UI ships?). Then the 6 pending PO-flagged
  deviations and the 17 case-update deviations can be finalized.
- **Flag-off window (non-shared env) → the 5 flag-off/shared-env ENV cases**
  (FD-FLAG-001/002/003, FD-HIST-004, FD-TMPL-012).

---

## 7. Env & access facts (facts only — NO secret values; secrets live in `/tmp`)

- **QA env:** app `https://qb.qa.shopview.com` · API host
  `https://sv7387api.qa.shopview.com` (note `sv7387api`, **no dot**; found by
  grepping the SPA bundle — `qbapi.qa.shopview.com` does NOT exist). Env = SV-7387.
- **Auth:** `POST /api/quick-login {key:'admin'|'tech'}` gated by cookies
  `sv_sso_session` + `PHPSESSID` + `cf_clearance` (domain `.qa.shopview.com`).
  `{key:'admin'}` → 200. **`{key:'tech'}` is FLAKY** (200 in batch-1/2, 403 in
  recon) — retest each run. Only admin/tech are supported; the other 9 roles need a
  real account. Read FE permissions at `GET /api/auth/me/fe-permissions`.
- **Feature flag:** `GET /api/feature-flags` → `{data:{featureFlags:[…]}}`;
  `FeesAndDiscounts` toggle is ON at `/administration/feature-flags`.
- **QuickBooks (Story 6) — CONNECTED as of 2026-07-09.** Location **Staging Lethbridge - 4310**
  (`f8a8b802-7780-4b16-bf10-343caeb616b2`) = admin default_workplace; Heavy Duty
  (`b3c8c820-f815-4cf1-8938-10956c5ee71a`); both `bookkeeping_enabled:true`. Switch active
  location: `POST /api/iam/change-location {workplace_id}` (key is `workplace_id`; only sets
  the ephemeral session location, NOT the stored default). QB endpoints:
  `GET /api/bookkeeping/adjustment-item-mapping-status`
  (`{quickBooksConnected,feeItemMapped,discountItemMapped}` — the S6-R6 guard's data source),
  `GET /api/bookkeeping/integration` (live QB chart of accounts — flaky/500s),
  `GET/POST /api/bookkeeping/products-and-services`·`code`, `PUT /api/bookkeeping/settings`
  (save Fee/Discount item mapping), `GET /api/bookkeeping/unexported-items` +
  `…/{id}/retry`/`…/{id}/mark-done`. No non-committing QB export preview exists (sync is
  automatic on invoicing). Story-6 behavior VIU pending a healthy env (batch-5 attempt hit a
  sustained sv7387api 500 incident).
- **Enforcement model (Story 13, batch-2 confirmed):** templates admin (Settings→
  Finance) is **BE-enforced** (Tech → 403 list/create); **customer-defaults GET+POST
  are BE-enforced** (403); **See Financial Data** masks financials in the payload
  (`view_mode:tech` → `sub_total:"0.00"`); adds on an Invoiced/Paid WO are
  **BE-enforced** (409). BUT **whole-WO adjustment add/edit/remove is FE-only** (Tech
  without `workOrdersCreateAndEdit` got 201 = BUG-FD-3), and the **WO history
  endpoint is FE-only** (Tech without `viewHistoryLogs` got 200 with entries; F&D
  history persists regardless of SFD because entries carry the SET rate, not a
  resolved total). Per-role FE capability derived in `/tmp/fdcln/roles-matrix.json`.
- **Adjustment API (reverse-engineered, `viu-qb-findings.md` API map):**
  - Templates: `GET/POST /api/adjustment-templates`, `POST …/{id}/change`,
    `DELETE …/{id}`, `GET …/{id}/delete-precondition` → `{affectedCustomerCount}`.
    Fields: `{name, kind:fee|discount|processing_fee, calculationType:flat|pct_labor|
    pct_parts|pct_subtotal|pct_grand_total, defaultAmount, defaultMaxCap, autoApply,
    taxable, description}`.
  - WO adjustments: `POST /api/work-orders/adjustments/add|change|remove`
    (`add`: `{workOrderId, kind, name, calculationType, amount, maxCap,
    scope:whole_wo|labor_line|part_line, targetId, taxable, templateId, description}`;
    `change`: `{adjustmentId, name, amount, maxCap, taxable}`; `remove` → 204).
  - Reads: whole-WO adjustments in `GET /api/work-orders/view/{id}`
    (`work_order.adjustments`, `adjustmentsSummary{…}`); line-level under each line
    in `GET /api/work-orders/lines/{woId}`.
  - Customer defaults: `GET/POST /api/customers/{companyId}/default-adjustments`
    (POST `{templateIds:[…]}` — array OK), `DELETE …/{defaultId}` → 204.
  - QB mapping guard: `GET /api/bookkeeping/adjustment-item-mapping-status`.
  - History: `GET /api/work-orders/{id}/history` (adjustment.added/updated/removed).
- **Key routes:** admin templates `/administration/adjustment-templates` (in-SPA click
  only — under FINANCE); WO detail `/workorders/{id}/lines`; Stats
  `/workorders/{id}/statistics`; customer defaults `/customers/{id}/default-adjustments`;
  part sale `/parts/part-sale/{id}/part-requests`; feature flags
  `/administration/feature-flags`.
- **Gotchas:** (1) **`NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`
  must both be set** for node, else a spurious proxy 403. (2) SPA **deep-links to
  most sub-routes render a blank "Error" page** — navigate in-SPA (`/workorders/{id}/lines`
  deep-links fine). (3) **Concurrent users are active on qb** — never assume env
  state; mark throwaway data ZZAUTOTEST and clean up.
- **Harness / boot2:** `/tmp/fdcln/fd-admin.mjs` (API client), `/tmp/fdcln/fd-boot2.mjs`
  (Chromium boot2 hydration, cookie domain `.qa.shopview.com`; Playwright straight at
  `$HTTPS_PROXY`). Secrets ephemeral (`/tmp` only, re-supply per environment).

---

## 8. How to resume

**Confirm the project first** (this workspace holds 3 projects) — instruction must
target **Fees & Discounts**. **The primary resume path is §0.5** (the project is
paused on Chris Ward's Round-2 answers). The generic per-trigger paths below stay
valid for whatever lands:

**When fresh qb cookies are supplied:**
1. Get admin (+ retest tech) cookies into `/tmp`; rebuild the boot2 harness.
2. Work the remaining VIU backlog — **20 Blocked-Env + 1 VIU-Pending
   (FD-PART-005)** — as the env allows (§0.5 step 6; §2 lists the cases).
3. Flip verified cases to VIU-Verified in `cases/*.json`; re-run
   `gen_blockers.py`, then `gen_import.py` + `build_workbook.py`.

**When a non-Tech role account is supplied:** run the 4 NEEDS-ACCOUNT Story-13
negatives (FD-PERM-004/008/010, FD-CUST-015); restore Tech afterward.

**When dev fixes land (Stories 6/8/11 + FDBUG code fixes):** re-run VIU for the
now-reachable cases (Story 8 → FD-PROC-001..004; Story 11 → FD-PCOL-001..007; a
QB-connected env → the 13 QB cases; the 7 code-bug deviations retest after fix).

**When the PO answers (= the Round-2 sheet comes back):** follow §0.5 — apply the
§0.1 per-answer action map, release/drop the held tickets, then sync + regenerate.
(Round-1's 6 answers are already fully actioned — see `reconciliation-actions.md`
+ `testrail-po-clarify-log.md`.)

**Before any TestRail update loop:** the **F&D Case-ID map is BUILT**
(`testrail-id-map.csv`, all 182) — use it for ID-matched updates. **Ask the user
before any TestRail write (fresh one-day authorization each time).**

**Two-phase finalization** (`RESUME-STRATEGY.md`): the current import files are
INTERIM; FINAL = the regenerated post-VIU + dev/PO-answered files.
