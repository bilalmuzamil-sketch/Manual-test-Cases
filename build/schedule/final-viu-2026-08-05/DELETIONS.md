# Schedule — retirements and deletions, 5 August 2026

## NOTHING WAS DELETED. `delete_case` was called ZERO times.

The pass was authorised to retire anything duplicated, spec-parroting, untestable or PO-descoped.
**Nothing met that bar, and `delete_case` is irreversible, so the conservative answer was taken:
when in doubt, keep and flag.**

## What was considered, and why each was kept

| Candidate | Why it was considered | Why it was KEPT |
|---|---|---|
| The **5 regression cases** SCH-REG-01…05 (C38867–C38871) | Their expectations rest on the **engineering plan only** — the specification is silent on all five. Under the QA lead's ruling that expected behaviour comes from the PRD, the epic or a PO answer, they are un-ratified. | They cover **real release risks** nothing else covers: data migration across the rewrite, the Dashboard collapsing many shifts into one row, work-order appointments reaching the board, cross-location leakage, and work-order priority driving the sidebar. Cutting them would lose genuine coverage to fix a paperwork problem. **They are flagged for Branko's ratification instead** — see DELIBERATE-DECISIONS.md entry 3. |
| **SCH-API-04** = [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | No specification requirement covers location-scoping a shift read. | It tests **cross-location data leakage**, which is a security-shaped risk. Kept and flagged. |
| **SCH-SPREAD-11** = [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) and **SCH-API-02** = [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | The 8-week / 120-shift limits are engineering-plan-only and the build enforces neither. | **The right answer is not ours to pick** — the limits may be real-and-missing, dropped, or future work. Retiring them would silently choose "dropped". Asked instead: see API-ASK.md. |
| **SCH-EDGE-02** = [C30086](https://shopview.testrail.io/index.php?/cases/view/30086) | Tests behaviour **below** the 960px minimum the specification supports, so arguably out of scope. | §11 makes two assertions and one of them — *"the sidebar collapses on narrow viewports"* — is unconditional. The case is a legitimate check of it. Kept. |
| **SCH-EDGE-04** = [C30088](https://shopview.testrail.io/index.php?/cases/view/30088), **SCH-EDGE-03** = [C30087](https://shopview.testrail.io/index.php?/cases/view/30087), **SCH-EDGE-08** = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866), **SCH-KEY-05** = [C30070](https://shopview.testrail.io/index.php?/cases/view/30070) | Flagged **WEAK-KEEP** by the 31 July usefulness audit — honestly thin. | Thin is not useless: they are the only performance, dark-mode and focus-trap guards in the suite. Kept, and still labelled WEAK-KEEP rather than pretended to be strong. |

## The 27 already retired in July were NOT resurrected

They remain in the local case source marked Retired and are excluded from the import and every count.
**Their internal IDs must never be reused** — a worker on another project reused a retired internal ID
today and its resync overwrote the retired record. The IDs to avoid:

`SCH-BLOCK-03` · `SCH-BLOCK-04` · `SCH-CONF-04` · `SCH-DAY-02` · `SCH-DAY-07` · `SCH-DEL-07` ·
`SCH-EDGE-01` · `SCH-EVT-04` · `SCH-EXP-01` · `SCH-EXP-02` · `SCH-HRS-01` · `SCH-HRS-07` ·
`SCH-KEY-02` · `SCH-KEY-04` · `SCH-LANE-05` · `SCH-LINE-02` · `SCH-NAV-02` · `SCH-REAS-02` ·
`SCH-REAS-04` · `SCH-REAS-05` · `SCH-SCOPE-04` · `SCH-SCOPE-06` · `SCH-SPREAD-01` · `SCH-START-08` ·
`SCH-VIEW-07` · `SCH-VIEW-08` · `SCH-WOL-03`

## The three candidate new cases were NOT authored

SV-8863 (which view the module opens on), SV-8870 (drag-create in Month view) and SV-8867 (reassigning
a series member). **Authoring them needs live observation this pass did not have time to do properly**,
and a case authored without observing the behaviour would be exactly the failure this whole pass is
correcting. See OUTSIDE-IN.md for the evidence and the reserved internal IDs.
