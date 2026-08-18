# Schedule — Aug-5 design-review reconciliation (B1/B4/B5 + E1–E16) — 2026-08-18

**Source doc reconciled:** `eaa183d3-scheduledesignreview20260805.md` — *"Schedule Feature — Design
Review Findings"*, Fabian / Sasha weekly, **dated Aug 5, 2026**. 3 filed bugs (B1/B4/B5) + 16
enhancements (E1–E16, each carrying an explicit in-scope signal).

**Build verification is DELIBERATELY DEFERRED this pass** (coordinator instruction). The application
was NOT opened; no behaviour was observed; no case names a build. Every case already carries the
`AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` marker (Standing Rule 69).

**Headline:** the Schedule suite **already fully reflects the Aug-5 review's V1 scope**, because the
prior pass (`fabian-review-2026-08-17`) ingested spec **v30**, which subsumes the review. **0 gaps,
0 new cases, 0 case edits.** Every review "Yes"/V1 item is covered; every out-of-scope item has no
V1 case; the only review items NOT in the suite (carryover cluster + the whole-WO preference) are
**also absent from spec v30** — divergences to raise with Branko, not gaps to author (Rules 32/57/58).

---

## SOURCE CURRENCY (Standing Rules 31 / 59) — read live 2026-08-18T07:31Z

| # | Source | Identifier | Version / last-updated | Read (this pass) | Verdict |
|---|---|---|---|---|---|
| A | **Specification** | Confluence page **713031682** "Schedule" | **version 30** (`version.number`), upstream last edited **2026-08-13T22:48:26.711Z** by Branko Cicovic, msg *"Restore Business hours labelling"* | **2026-08-18T07:31Z, live HTTP 200** | **CURRENT** — matches `requirements.md` v30 baseline. v30 (Aug 13) is NEWER than the Aug-5 review, so on any overlap **v30 wins** (Rule 32). |
| B | **The build** | `sv8685.qa.shopview.com` | **NOT READ — deliberately deferred** | — | **DEFERRED** (Rule 12/69). Nothing observed, nothing claimed. |
| C | **Epic + child stories** | Jira epic **SV-8685** | **39 direct children** (`parent=SV-8685` → 39, live), incl. all 15 new-scope stories **SV-9231…SV-9245** | **2026-08-18T07:32Z, live** | **CURRENT.** The 14 testable new stories SV-9231…SV-9244 are the V2/v30 scope that subsumes the review's enhancements. |
| D | **The Aug-5 design review** | `eaa183d3-scheduledesignreview20260805.md` | Aug 5, 2026 | 2026-08-18 | **CURRENT as the review-of-record**, but **OLDER than spec v30** — used only to (a) catch V1 items v30 requires but the suite misses, (b) confirm out-of-scope items, (c) note the 3 bugs. |
| E | **Design (prototype)** | `build/schedule/design-2026-07-27/Schedule.dc.html` | no version/date on the artefact | not re-fetched | **PARTIAL** — unchanged from 2026-08-06. ~48 labels pinned from it are marked "VIU-confirm"; a newer undated editable Sasha share link exists but cannot be dated (Rule 32 inapplicable). |
| F | **Engineering tech plan** | `tech-plan-2026-07-29/…` | 2026-07-29 | not re-fetched | **PARTIAL** — no newer tech plan supplied for the review scope (Rule 30 — OUTSTANDING). |

**Suite census (live TestRail, group 4254, 2026-08-18):** ours **195** / live total **195** / foreign
**0** / `custom_atmstatus == 3` (Automated) **0**. Marker distribution: **194** Rule-69
"Not available on Build to test Yet" + **1** HOLD (SCH-DND-09 / C43555, the Month-view-drag PO hold).

**Live status of the 3 review bugs (Jira, read 2026-08-18):**
- **SV-8915** (B1) — Bug, **OBSOLETE / resolution Done**, High.
- **SV-8916** (B4) — Bug, **Blocked**, Medium. Superseded by **SV-9242** (Assign work order modal).
- **SV-8917** (B5) — Bug, **TESTING QA** (live/open), Medium.

---

## PER-ITEM VERDICTS

Legend: **COVERED** (V1 & a case asserts it) · **GAP** (V1 & uncovered → author) · **OUT-OF-SCOPE**
(no V1 case; confirmed absent) · **DIVERGENCE / PO-Q** (review said V1 but spec v30 is silent →
raise, do not author, Rule 32/58) · **BUG-NOTED** (covering case identified; bug recorded for the
build-verify sync).

### Bugs

| # | Jira | Review says | Verdict | Covering case(s) & basis (Rule 45(e)) |
|---|---|---|---|---|
| **B1** | **SV-8915** (OBSOLETE/Done) | View opens at midnight not first business hour; should open at first business hour, fall back 7am, or earliest shift | **BUG-NOTED — COVERED, ticket CLOSED** | Correct v30 behaviour asserted by **SCH-DAY-01 / C30001** (*"the timeline auto-scrolls so the earliest technician's resolved start sits at the left edge … a small buffer (roughly 30 to 60 minutes) before it … technician hours, else business hours, else the 7:00 AM app-level default … so no shifts sit off-screen"*) and **SCH-START-09 / C43795** (the tech→shop→7am hours hierarchy). v30 §4.8 formalises this via SV-9231/SV-9244. **SV-8915 is closed OBSOLETE → no expect-fail backing (Rule 15.1/57); nothing owed to the sync.** No case edit. |
| **B4** | **SV-8916** (Blocked) | "Add Existing Work Order" button missing from build | **BUG-NOTED — COVERED (superseded)** | **SCH-REAS-08 / C43811** (body already states *"This is the same capability as the old 'Add Existing Work Order' button (SV-8916), re-specified as a menu item"*) + **SCH-REAS-03 / C30054** (menu's first item "Assign work order"). v30 §7 (SV-9242) *"Supersedes SV-8916"*. No action. |
| **B5** | **SV-8917** (TESTING QA — **live**) | Conflict label reads "working hours" instead of "business hours" | **BUG-NOTED — COVERED, live → for the sync** | Correct label asserted by **SCH-CONF-03 / C30025** (*"a reason in the spirit of 'Starts before business hours' … measured against … the shop's business hours"*), corroborated by **SCH-CONF-02 / C30024**, **SCH-CONF-08 / C43798**, tooltip **SCH-TIP-02 / C30035**, modal banner **SCH-MODAL-07 / C30014**. v30 v30-change was literally *"Restore Business hours labelling"*. **Recorded in `KNOWN-FAILURES-FOR-SYNC-aug5review.md`** so the build-verify sync sets `READY - EXPECT FAIL (SV-8917)` if it reproduces. No case edit / no EXPECT-FAIL now (build deferred). |

### Enhancements

| # | Enh | Review in-scope signal | Verdict | Covering case(s) / basis |
|---|---|---|---|---|
| **E1** | Hover pill on WO cards | *Out of Scope / Founder Mode FS* | **COVERED (scope reversed by newer story)** | Review said out-of-scope, but **newer story SV-9239 (peek popover) brought it INTO V1** (Rule 32 latest-wins). **SCH-WOL-08 / C43807** (*"Hovering the card opens a read-only peek panel … opens after the same hover delay … dismisses on mouse-leave … does not interfere with dragging"*). |
| **E2** | Per-line hours on hover | *Yes* (aggregate V1) | **COVERED** | **SCH-WOL-08 / C43807** (peek shows *"each line's estimated and clocked hours"*) + **SCH-MODAL-09 / C43808** + **SCH-MODAL-03 / C30010** (Time Logged per line & rolled up). |
| **E3** | Default "Schedule Whole Work Order" | *Yes* | **COVERED** | v30 §4.3: *"'Schedule whole work order' is pinned at the top, visually distinct"*. **SCH-SCOPE-01 / C29963** (picker contents: pinned whole-order row) + **SCH-SCOPE-02 / C29964** (whole-order → one shift). |
| **E4** | "Schedule by Line" secondary view | *Yes* | **COVERED (functional)** | v30 §4.3 line rows fast-path + "Select multiple". **SCH-SCOPE-03 / C29965** + **SCH-SCOPE-05 / C29967**. *Nuance:* the review's separate "dedicated view for 25+ line orders" is **not** a distinct v30 requirement (v30 uses the scope-picker popover) — not a gap. |
| **E5** | Use remaining hours, not total estimate | *Yes* | **COVERED** | v30 §4.2/§12 (SV-9232). **SCH-DND-10 / C43796** + **SCH-DND-11 / C43797**; spread **SCH-SPREAD-03 / C29979**, **SCH-SPREAD-12 / C43802**. |
| **E6** | User-level "always schedule whole WO" preference | *Yes — **open question**, decide before V1* | **DIVERGENCE / PO-Q** | **v30 is SILENT** (0 hits). No V1 case (confirmed NONE). The review itself flags it unresolved. → **raise with Branko; do not author** (Rule 58 — no inventing from silence). |
| **E7** | Rename "Carryover" | *Yes — TBC* | **DIVERGENCE / PO-Q** | **v30 SILENT on carryover entirely** (0 hits for carryover/add-a-day/extend). No V1 case. → raise with Branko. |
| **E8** | Multi-day carryover extends one day only | *Yes* | **DIVERGENCE / PO-Q** | v30 SILENT on carryover. No V1 case. → raise with Branko. |
| **E9** | Drag a shift to the next day in week view | *Yes* | **DIVERGENCE / PO-Q** | v30 SILENT on this carryover-by-drag. Reassignment across tech rows is covered (SCH-REAS-01 / C30052) and day-view horizontal move (SCH-DAY-04 / C30004), but week-view cross-day drag as carryover is not a v30 requirement. → raise with Branko (bundled with the carryover cluster). |
| **E10** | Business-hours-aware default viewport | *Yes (V1)* | **COVERED** | v30 §4.8 (SV-9231/9244). **SCH-DAY-01 / C30001** + **SCH-START-09 / C43795**. (Same behaviour as the B1 fix.) |
| **E11** | Constrain width to business hours + buffer | *Yes* | **COVERED** | v30 §4.8 zoom + buffer. **SCH-DAY-08 / C43812** (*"pixels-per-hour zoom … clamped between the resolved working window and the full 24-hour axis"*) + **SCH-DAY-01 / C30001** (30–60 min buffer; full 24h remains scrollable). |
| **E12** | Persist view options per user | *Yes* | **COVERED (to v30 extent)** | v30 §11 theme *"persisted per user"* → **SCH-EDGE-09 / C43588**; panel state session-scoped (SV-9243) → **SCH-PANEL-06 / C43587**. *Nuance:* the review's broader "persist capacity toggle / department visibility across sessions in cache" is **not** independently specified in v30 beyond theme + panel — not a gap; noted. |
| **E13** | Visual indicator for explicitly-assigned lines | *Founder Mode FS* | **OUT-OF-SCOPE (confirmed)** | No V1 case (grep = NONE). Correct — founder-mode fast-follow. |
| **E14** | Single tech selector + "Add Tech" | *Founder Mode FS* | **OUT-OF-SCOPE (confirmed)** | No V1 case (NONE). v30 §4.3 explicitly keeps *"no swap flow … no technician cap"* — the multi-select→single change is a founder-mode WO-line UI item. |
| **E15** | Restore the carryover button (was B3) | *Yes* | **DIVERGENCE / PO-Q** | v30 SILENT on carryover. No V1 case. → raise with Branko (carryover cluster). |
| **E16** | Vertical orientation for Day View | *Fast-follow, not this V1* | **OUT-OF-SCOPE (confirmed)** | No V1 case asserting vertical orientation. **SCH-DAY-08 / C43812 explicitly affirms** *"Day view is a horizontal timeline only - there is no vertical column layout"* — v30 confirms vertical is deferred. |

---

## COUNTS (reconciles to 19 review items: 3 bugs + 16 enhancements)

| Category | Count | Items |
|---|---:|---|
| **Already covered (V1)** | **11** | B1, B4, B5, E1, E2, E3, E4, E5, E10, E11, E12 |
| **Newly authored (V1 gap)** | **0** | — |
| **Out-of-scope / fast-follow / founder-mode confirmed (no V1 case)** | **3** | E13, E14, E16 |
| **Divergence — review said V1, spec v30 silent → Branko PO question (not authored)** | **5** | E6, E7, E8, E9, E15 |
| **Automated cases needing a change (Rule 71 → QA-lead permission)** | **0** | — (0 Automated cases in the suite) |

**Does Schedule now fully reflect the Aug-5 review's V1 scope?** **Yes, relative to the ratifying
authority (spec v30).** Every review item that v30 carries into V1 is covered by an existing case; every
out-of-scope item is confirmed absent. **The one qualifier:** 5 review "Yes"/TBC items (the carryover
cluster E7/E8/E9/E15 + the whole-WO preference E6) are **absent from spec v30** — so under Rule 32
(newest authoritative source wins) they are **not currently V1**, and under Rule 58 we do not author
them from a silent source. **They need one confirmation from Branko** to close the review out fully.

---

## QUALITY GATE (Rule 28) + contradiction sweep

**0 new cases authored, 0 existing cases edited, 0 TestRail writes.** Therefore **0 new contradictions
introduced**; the suite's prior 0-live-contradiction state (established `fabian-review-2026-08-17`) is
unchanged. The reconciliation itself was cold-read against the live suite and the live v30 spec; every
"COVERED" verdict quotes both the requirement and the covering case's own text (Rule 45(e)).

---

## OUTSTANDING — what I need from you

| # | What it is (plain) | What you do | Why it matters | Priority |
|---|---|---|---|---|
| 1 | **Carryover / "Add a Day" (E7, E8, E9, E15).** The Aug-5 review lists these as V1, but the newer spec v30 (Aug 13) does not mention carryover at all. | Ask **Branko**: is carryover (rename + one-day extend + week-view drag + restore the button) in V1, or dropped in the V2 redesign? If V1, share the requirement so we can author cases. | Until answered, these stay unauthored (Rule 32 — v30 wins; Rule 58 — no inventing from silence). | **Medium** |
| 2 | **User-level "always schedule whole WO" preference (E6).** Review marks it an open question; v30 is silent. | Ask **Branko** for the decision. | One case would follow the answer; currently unauthored. | **Medium** |
| 3 | **Live bug SV-8917 (B5) — conflict label "working hours".** Covering cases identified; recorded for the build-verify sync. | Nothing now. At the build-verify sync, SCH-CONF-03/02/08 (+ tooltip/modal) get `READY - EXPECT FAIL (SV-8917)` if it reproduces — **subject to the Jira/ticket path already in place** (the ticket exists, so no creation-hold issue). | So the sync doesn't re-discover it. | **Low** |
| 4 | **Build-verify sync (Rule 69).** All 195 cases carry "Not available on Build to test Yet". | Provide a fresh `.qa.shopview.com` sign-in so a later worker build-verifies and lifts the markers. | The only thing between the suite and an "Automation Ready" figure. | **High (shared with the other passes)** |
| 5 | **Design finality + tech plan (Rules 30/57).** Is Sasha's newer (undated) Schedule design final? No tech plan supplied for the review scope. | Confirm design finality; supply the tech plan if it exists. | Pins the ~48 "VIU-confirm" labels; strengthens edge/API coverage. | **Low** |

*(B1/SV-8915 is closed OBSOLETE and B4/SV-8916 is superseded-and-covered — neither is outstanding.)*
