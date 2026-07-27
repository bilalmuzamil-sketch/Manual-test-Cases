# Report Suite — Epic SV-8582 Reconciliation vs our 515 authored cases

> **Prepared:** 2026-07-27 · **Analysis only** — NO VIU (waiting on QA branch), NO TestRail
> writes, NO case authoring. PO **Chris Ward**. Sources: Jira epic SV-8582 + all 97 child
> stories (ingested via Atlassian MCP, this session), our 6 ingested specs
> (`build/report-suite/specs/*.md`), 6 coverage docs (`coverage-*.md`),
> `testrail-id-map.csv` (515 cases, C30096–C30610), and `PROJECT-STATE.md`.

---

## Bottom line (read this first)

**The user-facing requirement scope in SV-8582 MATCHES our 515 authored cases 1:1. There is
NO new or changed user-facing requirement introduced by the Jira stories, and nothing needs
authoring now.**

- All **97 child stories carry 0 comments and 0 attachments** — no images/videos, nothing to
  analyze; the `attachments/` folder is empty.
- The **80 per-report user stories** (SV-8600–8679) are **thin one-line wrappers that each
  point at the exact same Confluence spec page we already ingested** (identical page IDs:
  577634305 SBC / 585629698 SBR / 620888066 PV / 641400833 TU / 703660034 WIP / 720142338 IV).
  They add **no acceptance criteria, no fields, no labels** beyond the specs our 515 cases were
  authored from. Their story numbers line up with our spec stories (including the same retired
  gaps — see the per-report tables below).
- **Inventory Value** (report #5) was **added to the epic on 2026-07-26** (the epic grew from a
  five-report to a six-report suite). **We are already aligned** — we authored IV (77 cases,
  spec 720142338) back on 2026-07-22, so this is not a gap for us.
- The **9 engineering / tech-plan stories** (PR-1, A2–A5 still Open; B1–B6 now OBSOLETE) are
  **new to us** (we authored spec-only and never saw the implementation plan). They **do not
  change any of our cases**, but they (a) **confirm / resolve several of our open questions**
  and known build-deltas, and (b) give concrete **VIU-confirm targets** for when the QA branch
  lands. A small number **may warrant new targeted regression/VIU cases LATER** (on your go) —
  estimated **~3–6 cases**, none user-facing-scope, all deferred to the QA branch.

**Estimated new/edited cases needed LATER (after QA branch, on your go):**
- **New user-facing cases from the stories: 0.**
- **New targeted regression/backend cases (candidates only): ~3–6** — QB fractional-precision
  regression (PR-1), IV snapshot retention-prune behavior (A5/B4), and confirming the exact
  permission-atom names/theme assignment (may fold into existing cases instead of new ones).
- **Wording/VIU-confirm edits to existing cases: many, but that is the normal VIU pass**, not a
  scope change — done live against the build, not now.

---

## 1. Child-story inventory (97 total, SV-8583 → SV-8679, contiguous)

Enumerated via BOTH `parent = SV-8582` and `"Epic Link" = SV-8582` — **identical 97-issue sets,
single page each** (no pagination). All Story type.

| Group | Keys | Count | Status | What it is | Maps to |
| --- | --- | --- | --- | --- | --- |
| Original per-report placeholders | SV-8583–8588 | 6 | **OBSOLETE** | First-cut one-per-report stubs | superseded by the granular user stories |
| Engineering foundation (Part A + PR-1) | SV-8589–8593 | 5 | Open | Tech-plan build stories (PR-1, A2–A5) | suite chassis / backend |
| Engineering build (Part B) | SV-8594–8599 | 6 | **OBSOLETE** | B1–B6 per-report build stories | superseded by the granular user stories; still carry tech-plan detail |
| SBC user stories | SV-8600–8618 | 19 | Open | Sales By Customer, Stories 1–21 (no 5, no 19) | our SBC spec + 99 cases |
| SBR user stories | SV-8619–8640 | 22 | Open | Sales By Representative, Stories 1–23 (no 7) | our SBR spec + 127 cases |
| Parts Velocity user stories | SV-8641–8647 | 7 | Open | Velocity, Stories 1–7 | our PV spec + 70 cases |
| Technician Utilization user stories | SV-8648–8656 | 9 | Open | Tech Util, Stories 1–9 | our TU spec + 59 cases |
| WIP user stories | SV-8657–8667 | 11 | Open | WIP, Stories 1–11 | our WIP spec + 83 cases |
| Inventory Value user stories | SV-8668–8679 | 12 | Open | Inv Value, Stories 1–12 | our IV spec + 77 cases |

**By status:** OBSOLETE 12, Open 85.

---

## 2. Per-report reconciliation (user stories → our cases)

Legend: **MATCH** = story is fully covered by our existing cases with no scope change.

### 2.1 Sales By Customer (SBC) — MATCH
Jira SBC user stories = Stories **1,2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,18,20,21** (SV-8600–8618).
**Story 5 and Story 19 are absent** — exactly the "2 retired placeholders" our PROJECT-STATE §2.1
already documented. Every present story maps to our SBC coverage (`coverage-sbc.md`, 99 cases
C-ids in id-map). **No delta.** VIU-confirm at build: dedicated permission atom name (see §3).

### 2.2 Sales By Representative (SBR) — MATCH
Jira SBR user stories = Stories **1–6, 8–23** (SV-8619–8640); **Story 7 absent** — matches our
"23 stories, no Story 7" note. All map to `coverage-sbr.md` (127 cases). Includes the three
"beyond-the-report" stories we already covered: Story 13 staff-deactivation dialog (SV-8630),
Story 15 Sales Rep Assignments CSV (SV-8632), Story 19 WO "Sales Rep" assignment (SV-8636).
**No user-facing delta.** Build detail in §3 (single-rep schema, payment mapping, Esc decision).

### 2.3 Parts Velocity (PV) — MATCH
Jira Velocity Stories 1–7 (SV-8641–8647) map 1:1 to `coverage-pv.md` (70 cases). The story
one-liners restate our spec story titles (Report Access & Location; Filters & Search; Data
Table; Columns & Remembered View; Metric Calculations; Exports; Visual Conformance). **No delta.**

### 2.4 Technician Utilization (TU) — MATCH
Jira Tech Util Stories 1–9 (SV-8648–8656) map 1:1 to `coverage-tu.md` (59 cases). **No delta.**

### 2.5 WIP — MATCH
Jira WIP Stories 1–11 (SV-8657–8667) map 1:1 to `coverage-wip.md` (83 cases), including
Story 11 Nightly WIP Snapshot Capture (SV-8667) which we placed in the API section. **No delta.**

### 2.6 Inventory Value (IV) — MATCH
Jira Inv Value Stories 1–12 (SV-8668–8679) map 1:1 to `coverage-iv.md` (77 cases), including
Story 11 Nightly Snapshot Capture (SV-8678, API section). IV was the report *added* to the epic
on 2026-07-26; **we already authored it**, so no gap. **No delta.**

---

## 3. Engineering / tech-plan stories — build facts + question resolutions (NEW to us)

These 9 stories were not visible to us during spec-only authoring. They do **not change our
cases**, but they resolve/confirm several open items and give VIU-confirm targets. Nothing to
author now — the tags below say what to do LATER at the QA branch.

| Story | Status | Build facts that matter to us | Effect on our cases / OQs |
| --- | --- | --- | --- |
| **SV-8589 PR-1** — inventory_changes INT→DECIMAL precision fix + QB correction | Open | `inventory_changes.old_quantity/new_quantity` were INT, truncating fractional units; QB journal sync multiplied the error into dollars. Migration to DECIMAL(10,2), forward-only. Blocks PV "Units Sold" precision. | **NEW candidate case LATER:** a PV/QB fractional-quantity regression (Units Sold + QB journal amount exact from fractional movement). Fold into PV calc coverage or 1 new API/regression case. Not user-facing. |
| **SV-8590 A2** — shared paginated-report contract | Open | **366-day date cap** (367 rejected), server-side pagination/sort-whitelist/page-size clamp, non-void invoice predicate, round-once money rule (SUM unrounded, HalfAwayFromZero). | **Confirms** our suite-wide 366-day-cap + server-side + half-up-from-unrounded cases. VIU-confirm the 367-rejected boundary. No case change. |
| **SV-8591 A3** — export contract + 10k row-cap guard | Open | **Single suite-wide 10,000-row cap** constant; CSV = true file attachment (`Content-Disposition: attachment`) — a deliberate departure from legacy JSON-wrapped export; PDF via WeasyPrint. Empty set = header-only file, guard doesn't fire at 0. SBR "Sales Rep Assignments" export **stays** legacy JSON-wrapped (exception). | **Resolves OQ-4 direction:** engineering treats 10,000 as THE suite constant (IV S10-R12 "confirm value" → 10k). Still confirm wording with Chris. VIU-confirm CSV-attachment vs JSON per export case. No case change. |
| **SV-8592 A4** — denormalized invoice financial columns + clock subscriber | Open | Invoice gets labor_sell/labor_cost/parts_sell/parts_cost/hours_invoiced/hours_worked columns; feeds SBC + SBR SUM/GROUP BY. Clock edit after invoicing recomputes hours_worked/labor_cost on the non-void invoice (sell columns immutable). | Backend mechanism behind SBC/SBR numbers. **VIU-confirm** the "edit clock after invoicing updates hours but not sell" behavior — may add 1 targeted SBC/SBR data-integrity case LATER. |
| **SV-8593 A5** — FE report shell | Open | Shared table/remembered-view/filters/themes/nav. **Theme assignment: two-tone = SBC + PV; all-white = TU, WIP, IV, SBR.** Remembered-view = per-browser localStorage, schema-versioned, **defensive restore** (drops inaccessible location / dead sort column / column-set mismatch), restore beats URL. New **Parts** nav group (PV + IV). | **VIU-confirm the per-report theme** in each report's "Visual conformance" case (SBC/PV two-tone; others all-white). Confirms our remembered-view defensive-restore cases. No case change. |
| **SV-8594 B1 (WIP)** | OBSOLETE | WIP loads the whole open-WO set client-side (not the paged table); earned/remaining money model; nightly snapshot cron (cross-tenant); 4-tab placement; delete dead WIP code. | Confirms our WIP money-model + snapshot cases. Historical detail only (superseded). |
| **SV-8595 B2 (TU)** | OBSOLETE | Est. Lost Labor default rate = a `labour_type` row with `is_default=1` (no unique constraint → workplace may have none → partial/"—"); reconcile-to-the-cent vs Timesheet Activities; sort resets to Technician A–Z on reload (not remembered). | **Confirms** our TU "$0.00 vs — vs partial valuation" semantics (OQ-6 single-rate build-delta). VIU-confirm at build. |
| **SV-8596 B3 (PV)** | OBSOLETE | `part.last_sold_at` denorm column; Units Sold = net over invoicing origins (create +, reverse −); Demand = count of in-window invoicing events; **permission = existing Inventory Reports→View, NO new atom.** | **Confirms PV permission** (no new atom) and our PV calc cases. Depends on PR-1 precision fix. |
| **SV-8597 B4 (IV)** | OBSOLETE | Nightly snapshot cron + **retention: ≤13 months daily → then monthly**; permission `ROLE_REPORT_VIEW`; qty = positive-bins-only AVAILABLE_QUANTITY; sell = fixed / matrix-markup / cost fallback. | **NEW candidate case LATER:** IV snapshot **retention-prune** behavior (daily→monthly) — likely 1 API/backend case. Confirms IV permission + valuation cases. |
| **SV-8598 B5 (SBC)** | OBSOLETE | **Dedicated permission atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW`** (not ROLE_REPORT_VIEW); customer rows GROUP BY company_id; "Parts Sales" bucket = vehicle_id IS NULL; 10k cap counts customers + invoices (two-level). | **Resolves OQ-5 (SBC half):** SBC really does use a dedicated View permission. VIU-confirm the atom exists + gates nav and direct-link. Fold the exact atom name into our SBC permission case metadata (Rule 20) at VIU. |
| **SV-8599 B6 (SBR)** | OBSOLETE | **Single-rep schema built fresh** (staff.is_sales_rep, work_order.sales_rep_id, invoice.sales_rep_id + sales_rep_name) — the spec's "dual parts/service rep" note describes a **dead prototype**; rep snapshot immutable after invoice create; **payment 5→3 mapping** has a deposit-contribution nuance (prepaid misclassifies without it); **S13-R8 Esc-to-dismiss conflicts with Golden Rule #9 (no Esc) → open decision.** | **Confirms OQ-6 SBR build-deltas** (single-rep, contributors-only). **NEW question to flag Chris/dev:** the Esc-to-dismiss vs Golden-Rule-#9 conflict on the deactivation dialog (our SBR Story 13 cases should VIU-confirm actual dismiss behavior, not assume Esc). |

---

## 4. Open questions — status after this ingest

| OQ (from PROJECT-STATE §3) | Status now |
| --- | --- |
| **OQ-1** Epic/Jira key(s) | **RESOLVED:** one epic **SV-8582** for the whole suite; each report = a set of Story-level children (no per-report epics). |
| **OQ-2** QA env/branch/flags | **Partial:** build branch is **`project/reports-suite-bravo`** (from epic + stories). Actual QA/staging URL + feature-flag state still **not given** — ask at VIU. |
| **OQ-3** designs/videos | **Still open:** 0 attachments on the epic and all 97 stories; no Figma/video anywhere in Jira. Design reconciliation still deferred. |
| **OQ-4** IV export-cap value | **Effectively resolved to 10,000** (A3 single suite-wide constant); still confirm the exact wording with Chris before locking. |
| **OQ-5** permission-model inconsistency | **Confirmed as designed:** SBC = dedicated atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` (B5); PV = existing Inventory Reports→View (B3); IV = `ROLE_REPORT_VIEW` (B4); SBR rides Performance group (B6). Confirm intended with Chris; VIU-confirm the exact atoms. |
| **OQ-6** "spec ahead of code" build-deltas | **Confirmed real** and enumerated in the tech plan (SBR single-rep schema; PV reversal netting + precision; TU per-location/single-rate lost labor). Track as expected deviations at VIU, not new bugs. |
| **OQ-7** SBR tech-plan tuning values | Still unpinned until build exists (as before). |

**NEW question surfaced by this ingest (for Chris / dev):** SBR staff-deactivation dialog —
spec S13-R8 wants **Esc-to-dismiss**, but Golden Rule #9 forbids Esc (SV-8599 flags it as a
decision). Confirm the shipped dismiss behavior before finalizing our SBR Story 13 cases.

---

## 5. Traceability capture (Rule 20 — for when cases are authored/updated LATER)

Each of our 6 reports now has a concrete **Jira story anchor** to pair with its spec anchor in
the `refs` metadata when cases are next touched (ticket + spec, never ticket-only):

| Report | Epic | Per-story Jira range | Spec anchor (Confluence pageId) |
| --- | --- | --- | --- |
| SBC | SV-8582 | SV-8600–8618 (Story N → the matching SBC-… case) | 577634305 |
| SBR | SV-8582 | SV-8619–8640 | 585629698 |
| PV | SV-8582 | SV-8641–8647 | 620888066 |
| TU | SV-8582 | SV-8648–8656 | 641400833 |
| WIP | SV-8582 | SV-8657–8667 | 703660034 |
| IV | SV-8582 | SV-8668–8679 | 720142338 |

Suite-wide/chassis cases (nav, date-cap, location filter, remembered view, export, themes) anchor
to the shared engineering stories: **SV-8590 (A2)** contract/date-cap, **SV-8591 (A3)** export/10k,
**SV-8593 (A5)** shell/themes/nav; backend snapshot cases → **SV-8667 (WIP S11)** / **SV-8678 (IV
S11)**; the QB precision regression → **SV-8589 (PR-1)**. Per-story mapping to exact case IDs is a
mechanical step to do at the authoring/VIU pass, not now.

---

## 6. Confirmation of guardrails

- **NO VIU performed** (waiting on the QA branch for the true, live-observed VIU — Rule 22).
- **NO case authoring** — 0 cases created or edited; our 515-case suite is untouched.
- **NO TestRail writes** — no create/update/delete of cases, runs, or results (Rule 6).
- **NO secrets committed** — MCP session used (no cookies/passwords written to the repo).
- All ingested content saved under `build/report-suite/epic-sv8582/` as pointers-only (no
  login-walled content fetched beyond the authenticated MCP read).
