# Custom Roles & Permissions — PROJECT STATE

**Created 2026-08-28.** This file exists because the project had no `PROJECT-STATE.md` of its own —
its state was scattered across CLAUDE.md §3, `build/custom-roles-run/` and this session's
source-verification. **This is now the canonical live document for the project** (CLAUDE.md §3 is an
index, not the authority).

---

## 1 · Identity

| | |
|---|---|
| **Epic** | **SV-7388** — 269 children |
| **Specification** | Confluence page **565116952** — *"Custom Roles and Permissions"* |
| **Spec version now** | **v54**, last edited **2026-07-16**; confirmed live **2026-08-28** |
| **Spec owner (Confluence)** | Sasha Grosman |
| **PRODUCT OWNER** | **Sasha Grosman** — see §2 |
| **TestRail** | group **3527**; **515 cases ours** (`created_by = 3`) of 714 live, **199 foreign** |
| **Status** | **RECURRING** — the 4-layer permission VIU is re-run after **every** feature release, because it regresses when other features ship |
| **Prior state doc** | `build/custom-roles-run/release-regression-2026-07-27/RELEASE-REGRESSION-STATE-2026-07-27.md` |

## 2 · The Product Owner — RECORDED 2026-08-28

**The PO for Custom Roles & Permissions is Sasha.** The surname **Grosman** is used here because it is
corroborated repeatedly and independently in this repo as the owner/author of this same specification
family:

- `build/custom-roles/source-verify-2026-08-28/SOURCE-VERIFICATION.md` §"the spec *owner* is Sasha Grosman"
- `build/custom-roles/source-verify-2026-08-28/SAFE-OR-NOT-REPORT.md`
- `build/report-suite/specs/sbc-sales-by-customer.md` change log 2026-07-12 — *"Head-of-Product review, Sasha Grosman"*
- `build/printer-friendly-wo/requirements.md` — *"spec drafted by Sasha Grosman"*
- `build/ticket-reformat-2026-08-06/filters-schedule/SOURCE-PROBLEMS.md` — Jira creator **Sasha Grosman**

**One spelling caveat, stated rather than smoothed over:** the TestRail user list records id **9** as
**"Sasha Grossman"** (`product@shopview.com`) — double-s
(`build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md`, `build/skills/00-COMMON-CORE.md` §user
map). Every prose reference in this repo spells it **Grosman**. **The person is the same; the
surname's spelling is not confirmed with him.** Confirm it before his name goes on anything he reads.

**Rule 3 — do not mix PO attributions.** Chris Ward is the Report Suite / Fees & Discounts PO. Branko
is the Filters / Schedule / Global Search PO. Milos is Simple Flow. **Sasha is Custom Roles**, and
none of those names may be substituted for another.

**Previously this record read *"PO UNKNOWN — must be asked"*** in CLAUDE.md §3, which blocked the
Custom Roles PO question sheet from being routed at all.

## 3 · Open PO question for Sasha (as of 2026-08-28)

1. **PRD v54 contradicts itself about the Service Manager and invoice reversal.** The Permission
   Matrix (Work Orders = `V/E/D`), §1a Work Orders → Delete (*"Delete work orders, **Reverse Invoices**
   as long as validation criteria is met"*) and the Change Log of **2026-06-28** (*"Now: For WO requires
   Work Order → Delete"*) all say the Service Manager **can** reverse a work order invoice. The
   *Behavior Changes for Migrating Users* table still says *"Service Manager Loses Invoicing Delete
   (cannot reverse)"*. Please confirm that line is leftover text from before the 28 June move so the
   page can be tidied. **Not resolved from the build (Rule 58)** — it is disclosed in the case instead.
   Evidence: `build/custom-roles/source-verify-2026-08-28/C27776-CORRECTION-APPLIED.md` §4.

## 4 · Latest verification

| What | When | Result |
|---|---|---|
| Source (Confluence 565116952) | **2026-08-28** | **v54** live — matches what the audit was built on |
| Case-vs-matrix audit | 2026-08-28 | `build/custom-roles/source-verify-2026-08-28/` — 1 case needed correction (**C27776**), applied the same day |
| Build verification | **2026-07-27** (🔴 >14 days, Rule 91) | staging has since moved to `v3.10-49b5fe3` — the recurring 4-layer VIU is **due** |
| Rule-87 case-body snapshot | **2026-08-28** | first baseline taken — `build/custom-roles/case-snapshots/2026-08-28/` |

## 5 · Known gaps

- **No `testrail-id-map.csv` exists** for this project, so current scope cannot be reconciled locally
  (also carried as register row **R6**).
- The recurring release regression has not been re-run since **2026-07-27**.

## OUTSTANDING — what I need from you

1. **Confirm the surname spelling** — "Sasha Grosman" (repo prose) vs "Sasha Grossman" (TestRail user
   9, `product@shopview.com`) — before anything carrying his name is sent.
2. **Route the §3 question to Sasha** when the PO question sheet for this project goes out (Rule 66 —
   it goes last).
