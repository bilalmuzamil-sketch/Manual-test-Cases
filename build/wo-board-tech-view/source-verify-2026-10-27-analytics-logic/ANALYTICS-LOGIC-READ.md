# Analytics tests — logic read-through against PRD v77 (27 Oct 2026, Rule 137, QA lead's choice "B")

Source: PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, **version 77** (26 Oct 2026, Chris Ward), read live 27 Oct 2026 — copy `prd-845185030-v77-read-1027.txt`. Cases read live the same hour — `cases-read-1027.json`. Nothing was changed; this is the list for the QA lead to name from.

Three kinds: **STRICTER** (a correct product fails) · **LOOSER** (a broken product passes) · **IMPOSSIBLE** (no product can meet it).

## Lines that do not match the PRD

The governing sentences, verbatim (v77):
- S3-R11: "Board View shows no Density control in this release (SV-11580). …"
- S6-R1: "Offer Compact, Regular, and Comfortable density in Tech View. Board View has no Density control in this release (S3-R11)."
- S6-R3: "Density belongs to Tech View only. Board View's fast-follow Card size (SV-11581) is saved separately."
- QA lead, 22 Oct 2026 (C97035): work_orders_density_load is 1 — Tech View only.

| Case | Our wording | Kind | Fix that would follow the PRD |
|---|---|---|---|
| C97026 | Precondition: "Work Orders > Board View > Density > pick Comfortable". Steps 2–5 open Board View and look for `work_orders_density_load`. Expected step 3: "field and density events show … default"; step 5: "the dispatcher's density event shows … comfortable … saved" | IMPOSSIBLE | Pick Comfortable in Tech View; open Tech View (not Board View) in steps 2 and 4 so the density events can fire. Expected words for steps 3 and 5 can stay; only "Board View" in the setup/steps changes |
| C97029 | Step 2 opens Work Orders on the dispatcher's saved display, which the precondition leaves as **Board View**. Expected step 2: "fields and density show source saved" | IMPOSSIBLE | Either step 2 also clicks Tech View and reads the density there, or Expected step 2 says density is read after switching to Tech View |
| C97034 | U1 "switch to Board View … Set density to Compact". Expected: "Density spread across users who used Tech View or Board View: Compact 1 (U1) …, so 1 ÷ 3" | IMPOSSIBLE | U1 sets Compact in Tech View (or U1 is left out of the density figures). Expected's "users who used Tech View or Board View" becomes "users who used Tech View" |
| C690648 | Step 2 in Board View: "turn VIN/Serial on, then pick Compact density". Precondition: "In Board View … Density is not Compact". Expected step 4: "Board View, VIN/Serial, Compact … still there" | IMPOSSIBLE | Pick Compact in Tech View; Expected step 4 reads Compact in Tech View |
| C97028 | Same as C690648, plus the old label "Fields to display" (now "Column Selection", S3-R11 / glossary) | IMPOSSIBLE | Same fix; label → Column Selection |

## One sentence the PRD does not settle (Rule 58 — ask, do not decide)

- **C97023 step 7** narrows the window below 1024 px and widens it back; Expected says this is "not a new view". S1-R14: "On a screen narrower than 1024px, the Work Orders page shows List exactly as it does today … with no display switcher." S12-R1: "Measure display usage after successful initial loading and each display or filter-view switch." The PRD does not say whether the page changing to List because of width is a "display switch". Our line may be right; it rests on no sentence.

## Matches the PRD (no change)

C97023 (all other steps — the PRD's "filter view" is the tabs, so a Status filter is not one: S12-R1 + Terminology), C97024, C97025, C97027 (reworded today), C368153, C368155, C368154, C97033, C97035.

All 14 are ours (created_by 3), none flagged Automated (custom_atmstatus 1), none Vladimir's.

## Why these five were missed

All five were last PASSED before density left Board View: C97026 and C97034 on 15 Oct (staging v26.40.17), C690648 on 20 Oct (staging v26.40.19) — Board View still had a Density control then. PRD v73 (21 Oct, S3-R11 / S6-R1, SV-11580) and v75 (23 Oct, "density leftovers now Tech View only") moved density to Tech View only. On 22–23 Oct the QA lead had C97025, C97027, C97035, C368154 and C97029's set-up rewritten to Tech View — the sweep went by the cases that cited the changed rules, and these five (which say "density" but cite S12 rules, not S3-R11/S6-R1) were not found. C97029's step 2 Expected was not touched when its set-up was. Run 498: C97026, C97029, C97034, C97023 and C690648 all Passed (dated results); C97028 is in no run (Fast-follow folder).
