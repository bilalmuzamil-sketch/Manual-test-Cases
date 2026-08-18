# SV-9279 RECONCILIATION — Filters (2026-08-18)

**Trigger:** QA lead's heads-up that Jira story **SV-9279** was updated today.
**Outcome in one line:** today's SV-9279 edit is an **admin-only status move**; **no test case's
assertion is affected**; the suite is **already current** with SV-9279's content at spec v21
(reconciled 2026-08-17). **0 cases updated, 0 needing permission, 0 new questions raised.**

Build verification DEFERRED (app not opened). Sources read live 2026-08-18: SV-9279 (+changelog),
Filters spec Confluence v21, epic SV-8785. Details: `SOURCE-CURRENCY.md`.

---

## STEP 1 — What actually changed in SV-9279 today

**A STATUS TRANSITION, NOTHING ELSE.** The full 4-entry changelog shows today's only edits are
**Open → In Progress → Ready for QA** (Branko Cicovic, 2026-08-18 03:24 −0500). The **description,
acceptance criteria and summary have NOT changed since the story was created on 2026-08-14.** This is
an admin-only edit (Rule 37 Tier-1 / Rule 31 trap (b)); a status move does not change what a test
case must assert.

**SV-9279 content (verbatim, stable since 2026-08-14):**
> *"Applies the toolbar-row layout, the chip component and the shared panel types to every remaining
> page with a filterable table — all Parts views, all Reports, Customers, Administration — including
> pages with no design of their own. Each page keeps the filters it has today; no filter is added or
> removed. Blocked on the per-view inventory of existing filters from engineering."* — PRD: Story 1.

**Also confirmed live (Rule 31):** Filters spec is **still Confluence v21** (Aug 14) — it did **not**
move today. Epic SV-8785 has **34 children**; SV-9279 is one of them.

---

## STEP 2 — SV-9279 → our cases

SV-9279 governs the **layout rollout to Parts views, all Reports, Customers, Administration**. The
governed set in our suite is the 11 Parts/Reports filter-layout cases below. **Two already cite
SV-9279 directly** (added during the 2026-08-17 v21 reconciliation).

| Internal ID | C-id | Title | Cites SV-9279? |
|---|---|---|---|
| FLT-PARTS-12 | [C38907](https://shopview.testrail.io/index.php?/cases/view/38907) | Parts filters allow several choices and are cleared one filter at a time | **YES** (S16-R6; S8-R1; S8-R2) |
| FLT-PARTS-14 | [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) | Parts and Reports filter chips share by link and work on a phone, no collapse | **YES** (S1-R4; S1-R7; S11-R1; S12-R17) |
| FLT-PARTS-01 | [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | Every Parts list page shows its designed filter buttons | no (cites epic + Branko + Figma) |
| FLT-PARTS-09 | [C38905](https://shopview.testrail.io/index.php?/cases/view/38905) | Part Type filter opens a Core / Non Core list with Clear Selection | no |
| FLT-PARTS-11 | [C38906](https://shopview.testrail.io/index.php?/cases/view/38906) | Choosing a Parts filter narrows the list on that page | no |
| FLT-PARTS-13 | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) | Every filter a page had before is still available in the new filter bar | no |
| FLT-RPTS-01 | [C38909](https://shopview.testrail.io/index.php?/cases/view/38909) | Report filter bars appear on the reports this change covers | no |
| FLT-RPTS-21 | [C38910](https://shopview.testrail.io/index.php?/cases/view/38910) | Choosing a Reports filter narrows the report results | no |
| FLT-RPTS-22 | [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | New Reports filter types behave correctly (Location, Transaction Type, etc.) | no |
| FLT-RPTS-23 | [C38882](https://shopview.testrail.io/index.php?/cases/view/38882) | The date-range panel offers set periods and a custom start and end range | no (cites SV-9276) |
| FLT-PERS-05 | [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | Each page and tab remembers its own filters separately | no (cites SV-8795) |

**All 11 are ours** (`created_by = 3`) and **none is Automated** (`custom_atmstatus = 1`) — see STEP 4.

---

## STEP 3 — Per-case diff + verdict (Rule 45(e))

**VERDICT FOR ALL AFFECTED CASES: NO CHANGE.** Reason, applied uniformly: **today's SV-9279 edit is a
status move, so it alters nothing any case asserts.** The story's *content* (which the two citing cases
already encode) is unchanged since 2026-08-14, and the spec is still v21 — so there is no divergence and
nothing newly quotable to update.

**The one case worth quoting both texts for** — the only plausible contradiction with SV-9279's *"no
filter is added or removed"*:

- **SV-9279 says:** *"Each page keeps the filters it has today; no filter is added or removed. Blocked
  on the per-view inventory of existing filters from engineering."*
- **C38911 (FLT-RPTS-22) says:** item 1 lists new Reports filter buttons (Location, Transaction Type,
  Invoice Status, Type, User, Mention); item 2 *"there is no fixed list to compare against — check that
  the choices you see match the data in your shop"*; item 3 *"They have not been written down anywhere
  yet, so your list becomes the record."*

**No contradiction requiring a fix.** SV-9279's *"no filter added/removed"* scopes the **layout
rollout** (applying the toolbar/chip/panel layout does not, by itself, change a page's filter set); the
**new Reports filter types** are a separate concern sourced to **spec §2 Reports Filters / §4 + Branko's
answers**, and C38911 already treats the exact set as **unpinned** ("no fixed list", "not written down
anywhere yet"), which matches SV-9279's own *"Blocked on the per-view inventory of existing filters
from engineering."* The two documents describe different layers, and our case already handles the open
part scope-conditionally (Rule 42) rather than guessing (Rule 58).

**Direct-cite cases confirmed consistent:**
- **C38907** item 4, verbatim: *"The exact filters a Parts view offers are the ones it has today (the
  per-view list is pending from engineering) - confirm live."* — this **is** SV-9279's core constraint,
  already on the case.
- **C43562** already asserts the app-wide no-collapse + URL-state + mobile behaviour SV-9279 rolls out,
  and cites SV-9279 + SV-9269 at v21.

---

## STEP 4 — Rule 71 gate (Automated-case protection)

`custom_atmstatus` read LIVE for every SV-9279-governed candidate:

| C-id | atmstatus | Automated? | created_by | Rule 71 gate |
|---|---|---|---|---|
| C38904, C38905, C38906, C38907, C38908, C43562, C38909, C38910, C38911, C38882, C38880 | **1** (all) | **No** (all) | **3** (ours, all) | **CLEAR** — none is Automated |

**No ask-first blocker.** And the gate is moot this pass: **nothing diverges, so nothing was to be
written.** (The suite's known Automated cases — e.g. C29600, C29623 — are Work Orders filter cases,
**not** in the SV-9279 rollout set, so they were never candidates here.)

---

## STEP 5 — Writes executed

**NONE.** There is no non-Automated case whose content genuinely diverges from SV-9279 (all verdicts are
NO CHANGE), so there was nothing safe-and-necessary to update. No `update_case`, no marker change, no
provenance re-stamp, no `refs` edit. **No run-352 write. No Jira.** id-map / import **not regenerated**
(no writes → nothing to re-merge).

**Markers deliberately left as-is** (Rule 61 — ticket status is never read as evidence about the build;
Rule 69 — the Rule-69 marker lifts only on a build-verify sync, not on a status move):
- C38907, C43562, C38882 carry **`AUTOMATION: Not available on Build to test Yet - Last checked
  8/17/2026`** — correct while build verification is pending.
- The other 8 carry **`AUTOMATION: HOLD - ...`** waiting on Branko's Parts/Reports write-up — correct,
  because SV-9279 explicitly does **not** supply the per-view filter list ("Blocked on the per-view
  inventory of existing filters from engineering"), so the HOLD reason still stands.

---

## STEP 6 — Split + currency statement

| Metric | Count |
|---|---|
| SV-9279-governed cases examined | **11** |
| Cases **updated** | **0** |
| Cases **needing QA-lead permission** (Automated, would-be-touched) | **0** |
| New **Branko questions** raised | **0** |
| Cases flagged NO CHANGE | **11** |

**Is Filters still fully current with SV-9279?** **YES.** The suite already reflects SV-9279's content
at spec v21 (reconciled 2026-08-17); today's change is admin-only and requires no case change. Two cases
cite SV-9279 directly; the rollout constraint ("keep today's filters; per-view list pending from
engineering") is explicitly encoded.

**What SV-9279's move to "Ready for QA" signals (informational, no action taken):** the layout-rollout
story is now considered ready — so a **future build-verify sync** of the Parts/Reports rollout cases
(to lift the Rule-69 markers on C38907/C43562/C38882) becomes warranted **once a build check is
authorised**. It does **not** lift the HOLD markers on the other 8, because SV-9279 still does not
provide the per-view filter list they wait on.

---

## OUTSTANDING — what I need from you

Nothing **new** is raised by this SV-9279 check. Two **pre-existing** items remain (already in the
register — not re-raised, Rule 36), and SV-9279 reconfirms rather than clears them:

| # | What it is (plain) | Who owes it | What it blocks | Status |
|---|---|---|---|---|
| **FAB-1 / F8** | The **per-view filter list** for Parts / Reports / Customers / Administration. SV-9279 says it is *"Blocked on the per-view inventory of existing filters from engineering"* and Branko's Parts/Reports write-up is still outstanding. | **engineering** (the inventory) + **Branko** (the write-up), via the QA lead | The exact filter buttons per page/report stay "confirm live"; 8 Parts/Reports cases sit on `HOLD` and 3 on the Rule-69 build-deferred marker. | Pre-existing (register FAB-1 / F8); **reconfirmed** by SV-9279, **not cleared**. |
| **(build-verify)** | A future **build-verify sync** of the Parts/Reports rollout cases, now that SV-9279 is "Ready for QA", to lift the Rule-69 markers on C38907 / C43562 / C38882. | **us**, once you authorise a live build check (fresh `sv8785` cookies) | Those 3 cases stay build-deferred (honest, not a defect). | Informational — no action needed until you want the build check run. |
