# Schedule — SOURCE CURRENCY (Standing Rule 31) — read-dates pass, 2026-08-11

> Established **before** any TestRail write. This pass makes **`update_case` calls only**: no
> `add_case`, no `delete_case`, no section write, no run write, no result, and **zero Jira calls that
> create anything** (Rules 6 and 62, and the active creation hold at Rule 62's tail).

| | |
|---|---|
| **Sources read at pass start** | **2026-08-11 13:09Z – 13:13Z** |
| **Sources re-read immediately before the writes began** | recorded in `testrail-execution-log.md` (Rule 59) |
| **Verdict** | **CURRENT.** Confluence still **v27**; epic still **24** direct children. Nothing moved between our 2026-08-10 baseline and this pass. |

---

## Why every date in this pass is 11 August 2026, and why that is not back-filling

**Rule 12 bars back-filling a read-date.** Every source this pass stamps was **read live, by this
pass, today** — the timestamps are below. No date was copied from another case, inferred from a pass
folder's name, or assumed from a version number.

**All five source types happen to share one date because they were all read in one sitting**, at pass
start, for exactly this purpose. That is a fact about this pass, not a shortcut: a later pass that
re-reads only the specification will move only the specification's date, and the others will still
carry 11 August.

---

## The sources, per Rule 31

| # | Source | Identifier | Version / last-updated | Read at (UTC) | Verdict |
|---|---|---|---|---|---|
| **A** | **The specification** | Confluence page **713031682** "Schedule" | **Confluence version 27**, `version.when` **2026-08-07T15:01:20.801Z**, by **Branko Cicovic**, comment *"Add §5.3 Panel collapse; toolbar row and cross-references"*, body **43,064 chars** | **2026-08-11 13:09:33Z** | **CURRENT — v27, matching our baseline. The sweep proceeds.** |
| **B** | **The build** | `https://sv8685.qa.shopview.com` | **NOT READ THIS PASS** | — | **NOT APPLICABLE, deliberately.** This pass writes **sentence 1 only**, which names documents. Sentence 2 (`Last checked against build …`) is **left exactly as found on every case**; none was added, none was altered, and no build fact is claimed anywhere (Rules 12/54/57). |
| **C** | **The epic** | Jira epic **SV-8685** "Schedule — Technician Scheduling Module", status Open | **24 direct children**, verified two independent ways — `parent = SV-8685` → 24 and `"Epic Link" = SV-8685` → 24, **key sets equal, no paging remainder** | **2026-08-11 13:12:29Z** | **CURRENT — unchanged from 2026-08-10.** |
| **C2** | **The three cited stories** | **SV-8686** Schedule Grid Layout & Navigation (TESTING QA) · **SV-8688** Drag-and-Drop Scheduling & Shift Creation (TESTING QA) · **SV-8692** Linked Series & Banners (QA Complete) | descriptions read in full: 7,909 / 7,606 / 6,484 chars | **2026-08-11 13:12:44Z** | **CURRENT.** These are the only stories any Schedule case names in its provenance line. |
| **D** | **The designs** | The Claude prototype `Schedule.dc.html` (Branko's Q0), plus the Fabian/Sasha design review of 5 August | prototype: **no version, no date** | not read this pass | **PARTIAL, and NOT CITED BY ANY CASE.** Verified: **0 of 174** provenance lines name a design or Figma, so this pass stamps no design read-date. The standing shortfall is unchanged — SV-8915/8916/8917 cite a live editable `claude.ai/design/p/…?via=share` link with no version and no date, which cannot be dated at all (Rule 57 follow-up (i)). Recorded, not resolved. |
| **E** | **The engineering tech plan** | `build/schedule/tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md` | **92,084 bytes**, sha256 `def59e47…`, last changed in git **2026-07-30**; supplied to us, **not re-fetchable** | **2026-08-11 13:14Z** | **PARTIAL as to currency** — no newer version was supplied and there is no source we can poll for one, so "current" is not asserted (Rule 12). **Read today, so a read-date is honest.** **11 cases cite it.** |
| **F** | **PO answers** | `build/schedule/branko-answers-2026-07-31/answers-ingested.md` | **15,394 bytes**, sha256 `fb6b46cc…`, ingested **2026-07-31** | **2026-08-11 13:14Z** | **CURRENT as a record.** **9 cases cite it.** The separate standing item — the 6 August Branko question sheet has never been sent — is unchanged by this pass and stays outstanding. |

---

## What the 174 cases actually cite (measured, not assumed)

| Source named in the provenance line | Cases |
|---|---|
| epic **SV-8685** | **174 of 174** |
| the **Schedule specification version 27** | **174 of 174** |
| the **engineering technical plan** file | **11** |
| **Branko's answers** file | **9** |
| a **story** (SV-8686 ×8, SV-8688 ×1, SV-8692 ×1) | **10 mentions across 9 cases** |
| a **design** or **Figma** | **0** |

**Cases already carrying at least one read-date before this pass: 26** — and **every one of those 26
carried it on the specification only**, leaving the epic (and, where cited, the tech plan and the
answers file) undated. So under the amendment's per-source requirement **none of the 174 was already
complete**.

## Run 357, before the writes

`include_all` **false** · **174** tests · **429** result records. Snapshots in `snapshots/`. The
after-state proof is in `testrail-execution-log.md`.

## Foreign cases

**0.** All **174** cases under group 4254 and its 31 descendant sections are `created_by = 3`
(Bilal Muzamil). The honest two-number report is **ours 174 / live total 174**, so there is no
foreign case to leave untouched and none was touched.

## TestRail's own Automated flag (Rule 65)

**0 of 174** carry `custom_atmstatus = 3`. All 174 read **`1` (Not Automated)** at pass start — the
state left by the 2026-08-11 correction that set the 31 wrongly-flagged Schedule cases back to `1`.
Re-checked at write time per case; see `AUTOMATED-CASES-TOUCHED.md`.
