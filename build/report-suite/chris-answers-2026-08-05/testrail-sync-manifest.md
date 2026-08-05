# TestRail sync manifest — **STAGED, NOT EXECUTED**

> ## ⛔ NOTHING IN THIS FILE HAS BEEN WRITTEN TO TESTRAIL
>
> **Standing Rule 6 is absolute: no TestRail write without the QA lead's explicit permission,
> and he has not given it for this pass.** Every operation below is fully prepared and
> byte-exact, so a single word of go-ahead is enough to execute it. Only read-only `get_*`
> calls were made.

**Report Suite · epic SV-8582 · driven by Chris Ward's answers of 2026-08-05**

Read `ANSWERS-INGESTED.md` for his answers verbatim, and `DELTAS.md` for the reasoning behind
each change. This file is the execution plan.

## The totals

| | Count |
|---|---|
| **`update_case` operations** | **46** |
| `add_case` operations | **0** |
| `add_section` operations | **0** |
| `delete_case` operations | **0** |
| Test-run writes | **0** |
| — of the 46: cases with a wording change | 32 |
| — of the 46: cases with a **title** change | 2 |
| — of the 46: cases where the frozen "DO NOT AUTOMATE" line is removed | 39 |
| — of the 46: cases that were **never frozen** and are being corrected anyway | 7 |

**Fields touched:** `custom_expected` on all 46 · `title` on 2. **Nothing else** — not `refs`,
not `section_id`, not `type_id`, not `priority_id`, not `custom_atmstatus`.

## New cases that are NOT in this manifest — deliberately

`DELTAS.md` §9 identifies **five** pieces of coverage his answers create (N1–N5). **None is
staged here.** Authoring a new case is a separate decision and a separate go-ahead. N1 (a
one-location person must never see the Location option) and N4 (two separate Technician
Utilization spreadsheet downloads) look like real coverage the release would otherwise ship
without.

## Developer tickets that are NOT in this manifest — deliberately

`DELTAS.md` §10 lists **five** defects his answers call for (B1–B5). **None has been filed.**
All five are user-facing rather than API-only, so Standing Rule 51 does not bar them, but
filing still needs the go-ahead. When authorised they would be parented to **epic SV-8582**,
linked to the owning story, and filed at priority **Low** (Standing Rules 52, 53).

---

## How to execute, and how it must be verified (Standing Rule 50)

The exact payloads are in **`staged-operations.json`** beside this file — one entry per case,
each holding `before_expected` and `after_expected` in full, so execution is deterministic and
does not depend on re-deriving anything from this prose.

1. **Snapshot first.** `get_case` for all 46, plus `get_tests` and `get_results_for_run` for
   run **R359**, written to disk before the first write.
2. **Confirm `before_expected` still matches live, byte for byte, for all 46.** If any case has
   moved since 2026-08-05, **stop** — someone else has edited it.
3. **`update_case` sending only `custom_expected` (and `title` on the two).**
4. **After every write, re-`get_case` and compare all 28 fields:** the changed field byte-equal
   to `after_expected`, and **every other field byte-identical to the snapshot**, including
   `refs`, `section_id` and `type_id`. On any mismatch **stop the batch** — do not continue,
   do not retry blindly.
5. **Prove run R359 untouched:** the case-id sets equal in **both** directions and **every
   prior result present BY ID**, not by count (Standing Rules 34, 47). **This manifest makes no
   run write, so R359 must be byte-identical afterwards.**
6. **Prove the 5 foreign cases untouched** — C38919–C38923, byte-identical including
   `updated_on` and `updated_by` (Standing Rules 38, 50).
7. **Re-count the frozen line afterwards:** it must fall from **47** to **8**, and the 8 must be
   exactly C30096, C30186, C30310, C30315, C30440, C30491, C30502, C30564.
8. **Then regenerate the deliverables** — and note the standing gotcha: `gen_import.py` blanks
   the id-map C-ids and drops the `refs` column on every rerun, so both must be re-merged from
   live afterwards.

**Declared normalisation (Standing Rule 50):** none applies here. `refs` is not being written
by any operation in this manifest, so the comma-splitting behaviour of that field is not in
play.

---

## The provenance line — what each variant says, and why (Standing Rule 54)

Chris **authorised** treating the descriptions as out of date: item T3-2, answer **A**. So
every case his answers govern cites **his file**. But a provenance line that claims a source
the source does not support is worse than none, so there are four honest variants and one
deliberate non-variant:

| Variant | Used | What the line says |
|---|---|---|
| **his decision IS the basis, and the build already agrees** | 13 cases | names the build and date, then says his decision of 8/5/2026 is the authority where the specification differs, with the file link |
| **his decision IS the basis, and the build does NOT agree yet** | 19 cases | leads with his decision and the file link, then states plainly that it does **not** match the build of 8/4/2026 and the change is with the developers |
| **his decision IS the basis, and no build has shown it** | 2 cases | names his decision and the file, and says the specification is **silent** and it has not been confirmed on a build |
| **the specification is the basis; he merely CONFIRMED it** | 10 cases | keeps the specification wording and adds "Chris Ward confirmed this on 8/5/2026 in his answers in this file" |
| **his answers do NOT govern the case** | 2 cases | **the existing line is left exactly as it is, and NO file link is added.** Pasting his link onto a case he did not rule on manufactures false authority |

**The build date stays 8/4/2026 and the marker stays `v3.4.1-3d03023`.** This pass made **no
live observation**, so no line may claim a build date of today. And the Rule-49 re-check queue
stays **OPEN** — the branch is still not final, so every one of these verdicts is provisional.

---

## THE 46 OPERATIONS, IN FULL

Each entry gives the target, the driving answer, the exact before text and the exact after
text. `staged-operations.json` holds the same payloads machine-readably.

### Driven by item T1-1

#### Operation 1 of 46 — `update_case` on **TU-HRS-02** = [C30401](https://shopview.testrail.io/index.php?/cases/view/30401)

- **Case title:** Headers in fixed order; Total, WO and Internal Hours show clocked hours (2 dp)
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** His rule C2 - line 6 says the opposite (NOT frozen today)
- **Frozen line removed:** no — this case was never frozen
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. With a single location in scope the headers appear in exactly this order: Technician, Total Hours, WO Hours, Internal Hours, Utilization %, Est. Lost Labor.
2. Total Hours = all time the technician was clocked in for the range.
3. WO Hours = time clocked directly to work orders; Internal Hours = time clocked to internal, non-billable activities.
4. Internal Hours includes ALL internal time - including hours at a location with no configured labor rate.
5. Hours show two decimal places with NO thousands separator (e.g. "107.70"), rounded from the unrounded hours using round-half-up (a tie rounds away from zero - 0.005 → 0.01).
6. When more than one location is in scope the automatic Location column also appears, leftmost before Technician — it is not in the Column Selection control and its presence is expected.
---
This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Technician Utilization report specification version 5 (S2-R1, S2-R2, S2-R3, S2-R4, S2-R5, S9-R9).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. With a single location in scope the headers appear in exactly this order: Technician, Total Hours, WO Hours, Internal Hours, Utilization %, Est. Lost Labor.
2. Total Hours = all time the technician was clocked in for the range.
3. WO Hours = time clocked directly to work orders; Internal Hours = time clocked to internal, non-billable activities.
4. Internal Hours includes ALL internal time - including hours at a location with no configured labor rate.
5. Hours show two decimal places with NO thousands separator (e.g. "107.70"), rounded from the unrounded hours using round-half-up (a tie rounds away from zero - 0.005 → 0.01).
6. When more than one location is in scope the Location column also appears, leftmost before Technician. Location is one of the columns in the column-selection control, and with more than one location SELECTED it is already switched on for you - you do not have to turn it on. You can still switch it off. If the signed-in person only has access to ONE location, Location is not offered in the column-selection list at all.
---
Note for the tester: on this build the column does not yet behave this way - record what you see and carry on. The change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Technician Utilization report specification version 5 (S2-R1, S2-R2, S2-R3, S2-R4, S2-R5, S9-R9) differs, his decision is the authority.
```

#### Operation 2 of 46 — `update_case` on **TU-EXP-04** = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437)

- **Case title:** Downloads cover only selected technicians, locations, and date range
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** His rule C2 - line 6 says the opposite (NOT frozen today)
- **Frozen line removed:** no — this case was never frozen
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. Every download includes ONLY the technicians currently selected in the technician filter - the deselected technician is absent from all three files.
2. Every download covers the location(s) currently selected in the location filter and the date range currently active on the report.
3. With every technician selected, the download covers all technicians for the range at the selected location(s).
4. Every download (each PDF and the CSV) carries a "Locations:" line naming the location(s) the report was scoped to (exact position in the file is confirmed in the build).
5. Every download also mirrors the columns currently shown on screen — a column hidden in the Column Selection control is absent from the files, and a re-shown column comes back.
6. Note for the tester: when you have more than one location in scope, the files also carry a Location column even though it is not in the Column Selection control. That is correct - it appears by itself. With a single location in scope there is no Location column, and that is also correct.
---
This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Technician Utilization report specification version 5 (S7-R8, S7-R9, S7-R10, S7-R13, S7-E1, S9-R8).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. Every download includes ONLY the technicians currently selected in the technician filter - the deselected technician is absent from all three files.
2. Every download covers the location(s) currently selected in the location filter and the date range currently active on the report.
3. With every technician selected, the download covers all technicians for the range at the selected location(s).
4. Every download (each PDF and the CSV) carries a "Locations:" line naming the location(s) the report was scoped to (exact position in the file is confirmed in the build).
5. Every download also mirrors the columns currently shown on screen — a column hidden in the Column Selection control is absent from the files, and a re-shown column comes back.
6. Note for the tester: when more than one location is in scope the files also carry a Location column. Location is one of the columns in the column-selection control, and with more than one location SELECTED it is already switched on for you - you do not have to turn it on. You can still switch it off. If the signed-in person only has access to ONE location, Location is not offered in the column-selection list at all. With a single location in scope there is no Location column in the files.
---
Note for the tester: on this build the column does not yet behave this way - record what you see and carry on. The change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Technician Utilization report specification version 5 (S7-R8, S7-R9, S7-R10, S7-R13, S7-E1, S9-R8) differs, his decision is the authority.
```

#### Operation 3 of 46 — `update_case` on **WIP-COL-01** = [C30466](https://shopview.testrail.io/index.php?/cases/view/30466)

- **Case title:** With all toggleable columns on, the fixed column order and alignment hold
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** Order assertion only - his rule changes visibility, not position
- **Frozen line removed:** YES
- **Provenance basis:** a specification / earlier ruling, which he has now confirmed
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The columns appear in this order: WO #, Status, Customer, Asset, VIN, Location, Advisor, Days Open, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Earned, Remaining, Inv. Hrs, Total.
2. WO #, Status, Customer, Asset, VIN, Location, and Advisor are left-aligned.
3. Every other column (Days Open, Last Activity, and all money/number columns through Total) is right-aligned.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Work In Progress report specification version 6 (S4-R1, S4-R3, S4-R4); on this point that specification currently states otherwise and a product decision is still awaited, so treat the behaviour described above as what the build does today.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The columns appear in this order: WO #, Status, Customer, Asset, VIN, Location, Advisor, Days Open, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Earned, Remaining, Inv. Hrs, Total.
2. WO #, Status, Customer, Asset, VIN, Location, and Advisor are left-aligned.
3. Every other column (Days Open, Last Activity, and all money/number columns through Total) is right-aligned.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Work In Progress report specification version 6 (S4-R1, S4-R3, S4-R4). Chris Ward confirmed this on 8/5/2026 in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 4 of 46 — `update_case` on **WIP-COL-02** = [C30467](https://shopview.testrail.io/index.php?/cases/view/30467)

- **Case title:** First visit shows the default columns; the rest are in the column selector
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** His rule C1 - "off by default" is wrong when several locations are selected
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The visible columns on first visit are: WO #, Status, Customer, Asset, Advisor, Days Open, Earned, Remaining, and Total.
2. Every other column (VIN, Location, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Inv. Hrs) is available in the column-selection control and off by default.
3. Location IS offered in the column-selection control, between VIN and Advisor, and is off by default. Turning it on adds a Location column that names each job's location; turning it off removes it again.
4. Note for the tester: the Location column does NOT appear on its own when you have more than one location selected - you have to switch it on yourself. That is what the build does today.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Work In Progress report specification version 6 (S4-R2, S4-R3, S8-R3, S8-R4); on this point that specification currently states otherwise and a product decision is still awaited, so treat the behaviour described above as what the build does today.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The visible columns on first visit are: WO #, Status, Customer, Asset, Advisor, Days Open, Earned, Remaining, and Total.
2. Every other column (VIN, Location, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Inv. Hrs) is available in the column-selection control and off by default.
3. Location is one of the columns in the column-selection control, and with more than one location SELECTED it is already switched on for you - you do not have to turn it on. You can still switch it off. If the signed-in person only has access to ONE location, Location is not offered in the column-selection list at all. When it is on, the Location column sits between VIN and Advisor and names each job's location.
4. Note for the tester: on this build the column does not yet behave this way - record what you see and carry on. The change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Work In Progress report specification version 6 (S4-R2, S4-R3, S8-R3, S8-R4) differs, his decision is the authority.
```

#### Operation 5 of 46 — `update_case` on **WIP-EXP-02** = [C30511](https://shopview.testrail.io/index.php?/cases/view/30511)

- **Case title:** Downloads keep shown columns, honor filters, include the tab's Totals row
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** His rule C1 - line 5 denies default-on (NOT frozen today)
- **Frozen line removed:** no — this case was never frozen
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total last. One exception on this build: if you turn Inv. Hrs on, the download is refused - that column cannot be exported yet.
2. Both downloads honor the current date range and location filter, and include only the jobs left visible by the advisor, customer, and asset filters.
3. Both downloads include a Totals row matching the on-screen Totals row for the tab.
4. Each download (PDF and CSV) carries a "Locations:" line naming the location(s) the report was scoped to (exact position in the file is confirmed in the build).
5. Note for the tester: the file carries the location column only when you have switched Location ON in the column-selection control - it does not appear just because you have more than one location selected. In the file it is headed "Branch", not "Location", and the asset column is headed "Unit". Both of those names are correct.
---
This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Work In Progress report specification version 6 (S9-R2, S9-R3, S9-R4, S9-R10a, S7-R13, S9-E1).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total last. One exception on this build: if you turn Inv. Hrs on, the download is refused - that column cannot be exported yet.
2. Both downloads honor the current date range and location filter, and include only the jobs left visible by the advisor, customer, and asset filters.
3. Both downloads include a Totals row matching the on-screen Totals row for the tab.
4. Each download (PDF and CSV) carries a "Locations:" line naming the location(s) the report was scoped to (exact position in the file is confirmed in the build).
5. Note for the tester: the file carries the Location column whenever it is showing on screen. Location is one of the columns in the column-selection control, and with more than one location SELECTED it is already switched on for you - you do not have to turn it on. You can still switch it off. If the signed-in person only has access to ONE location, Location is not offered in the column-selection list at all. In the file it is headed "Branch", not "Location".
---
Note for the tester: on this build the column does not yet behave this way - record what you see and carry on. The change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Work In Progress report specification version 6 (S9-R2, S9-R3, S9-R4, S9-R10a, S7-R13, S9-E1) differs, his decision is the authority.
```

#### Operation 6 of 46 — `update_case` on **IV-COL-01** = [C30551](https://shopview.testrail.io/index.php?/cases/view/30551)

- **Case title:** With every column on they appear in the fixed order with the set alignment
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** His rule C1/C3 - the default-on half is missing
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. With a single location in scope the columns appear in this order: Part #, Description, Category, Vendor, Qty, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost.
2. Part #, Description, Category, and Vendor are left-aligned.
3. Every other column is right-aligned.
4. Location is one of the columns in the column-selection control; when it is turned on the Location column appears between Vendor and Qty, left-aligned.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Inventory Value report specification version 3 (S3-R1, S3-R2, S7-R6); on this point that specification currently states otherwise and a product decision is still awaited, so treat the behaviour described above as what the build does today.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. With a single location in scope the columns appear in this order: Part #, Description, Category, Vendor, Qty, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost.
2. Part #, Description, Category, and Vendor are left-aligned.
3. Every other column is right-aligned.
4. Location is one of the columns in the column-selection control, and with more than one location SELECTED it is already switched on for you - you do not have to turn it on. You can still switch it off. If the signed-in person only has access to ONE location, Location is not offered in the column-selection list at all. When it is on, the Location column appears between Vendor and Qty, left-aligned.
Note for the tester: on this build the column does not yet behave this way - record what you see and carry on. The change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Inventory Value report specification version 3 (S3-R1, S3-R2, S7-R6) differs, his decision is the authority.
```

#### Operation 7 of 46 — `update_case` on **IV-COL-04** = [C30554](https://shopview.testrail.io/index.php?/cases/view/30554)

- **Case title:** On a first visit the default columns show and the rest stay available
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** His rule C1/C3 - the default-on half is missing
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. On first visit with a single location in scope the visible columns are: Part #, Description, Category, Vendor, Qty, Unit Cost, Unit Sell, Margin %, and Total Cost.
2. The Margin and Total Sell columns are hidden by default.
3. Both can be turned on from the column-selection control and then appear in their fixed positions.
4. Location is one of the columns in the column-selection control; when it is turned on the Location column shows between Vendor and Qty.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Inventory Value report specification version 3 (S3-R12, S3-R13, S8-R3, S7-R6); on this point that specification currently states otherwise and a product decision is still awaited, so treat the behaviour described above as what the build does today.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. On first visit with a single location in scope the visible columns are: Part #, Description, Category, Vendor, Qty, Unit Cost, Unit Sell, Margin %, and Total Cost.
2. The Margin and Total Sell columns are hidden by default.
3. Both can be turned on from the column-selection control and then appear in their fixed positions.
4. Location is one of the columns in the column-selection control, and with more than one location SELECTED it is already switched on for you - you do not have to turn it on. You can still switch it off. If the signed-in person only has access to ONE location, Location is not offered in the column-selection list at all. When it is on, the Location column shows between Vendor and Qty.
Note for the tester: on this build the column does not yet behave this way - record what you see and carry on. The change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Inventory Value report specification version 3 (S3-R12, S3-R13, S8-R3, S7-R6) differs, his decision is the authority.
```

#### Operation 8 of 46 — `update_case` on **IV-PERS-02** = [C30580](https://shopview.testrail.io/index.php?/cases/view/30580)

- **Case title:** Toggling columns never reorders them
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** Order assertion only - his rule changes visibility, not position
- **Frozen line removed:** YES
- **Provenance basis:** a specification / earlier ruling, which he has now confirmed
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. Whatever columns are shown, they appear in the fixed left-to-right order - with Location, when it is turned on in the column-selection control, between Vendor and Qty (Part #, Description, Category, Vendor, Qty, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost) - toggling visibility never reorders columns.
2. Total Cost is always the last column.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Inventory Value report specification version 3 (S8-R4, S3-R1, S7-R6); on this point that specification currently states otherwise and a product decision is still awaited, so treat the behaviour described above as what the build does today.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. Whatever columns are shown, they appear in the fixed left-to-right order - with Location, when it is turned on in the column-selection control, between Vendor and Qty (Part #, Description, Category, Vendor, Qty, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost) - toggling visibility never reorders columns.
2. Total Cost is always the last column.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Inventory Value report specification version 3 (S8-R4, S3-R1, S7-R6). Chris Ward confirmed this on 8/5/2026 in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 9 of 46 — `update_case` on **IV-EXP-02** = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588)

- **Case title:** Downloads keep shown columns and order, honor filters, and include Totals
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** His rule C1 - line 5 denies default-on
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total Cost last.
2. Both downloads honor the current date, category, vendor, location, and part-search filters, and apply the current sort.
3. Both downloads include a totals row labeled "Totals" matching the on-screen totals (the full-filtered-set totals).
4. Each download (PDF and CSV) carries a "Locations:" line naming the location(s) the report was scoped to (exact position in the file is confirmed in the build).
5. Note for the tester: the files carry the Location column when Location is turned ON in the column-selection control (it sits between Vendor and Qty). It does not appear just because you have more than one location selected.
On this build the spreadsheet file ignores the columns you picked and puts them in a different order from the screen, so point 1 above will not match - record what you see and carry on.
Known issue: the product does not currently do this. It has been filed for a fix here: https://shopview.atlassian.net/browse/SV-8823
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Inventory Value report specification version 3 (S10-R3, S10-R4, S10-R5, S10-R6, S10-R15).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total Cost last.
2. Both downloads honor the current date, category, vendor, location, and part-search filters, and apply the current sort.
3. Both downloads include a totals row labeled "Totals" matching the on-screen totals (the full-filtered-set totals).
4. Each download (PDF and CSV) carries a "Locations:" line naming the location(s) the report was scoped to (exact position in the file is confirmed in the build).
5. Note for the tester: the files carry the Location column whenever it is showing on screen (it sits between Vendor and Qty). Location is one of the columns in the column-selection control, and with more than one location SELECTED it is already switched on for you - you do not have to turn it on. You can still switch it off. If the signed-in person only has access to ONE location, Location is not offered in the column-selection list at all.
On this build the spreadsheet file ignores the columns you picked and puts them in a different order from the screen, so point 1 above will not match - record what you see and carry on.
Known issue: the product does not currently do this. It has been filed for a fix here: https://shopview.atlassian.net/browse/SV-8823
Note for the tester: on this build the column does not yet behave this way - record what you see and carry on. The change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Inventory Value report specification version 3 (S10-R3, S10-R4, S10-R5, S10-R6, S10-R15) differs, his decision is the authority.
```

#### Operation 10 of 46 — `update_case` on **SBC-LOC-04** = [C38912](https://shopview.testrail.io/index.php?/cases/view/38912)

- **Case title:** The Location column shows only with more than one location; Multiple on totals
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** His rule C2/C3: the column IS in the selector, conditionally
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. With more than one location in scope a Location column is shown, positioned immediately after the Date column.
2. A customer or asset row whose invoices are all at one location shows that location's name.
3. A customer or asset row whose invoices come from more than one location shows "Multiple".
4. An invoice row always shows its own exact location — never "Multiple".
5. Location is NOT offered in the column selector — it appears and disappears on its own, following the location scope.
6. With a single location in scope the Location column is hidden and the surrounding columns close up with no gap.
7. Every one of the four downloads also contains the Location column, in the same position it holds on screen, showing the same values you just read: a location name on a row whose invoices are all at one location, "Multiple" on a row that aggregates more than one, and the invoice's own location on an invoice row. (Exactly where the column sits inside each file is confirmed in the build.)
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Customer report specification version 13 (S4-R12, S4-R12a, S4-R13, S20-R19).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. With more than one location in scope a Location column is shown, positioned immediately after the Date column.
2. A customer or asset row whose invoices are all at one location shows that location's name.
3. A customer or asset row whose invoices come from more than one location shows "Multiple".
4. An invoice row always shows its own exact location — never "Multiple".
5. Location is one of the columns in the column-selection control, and with more than one location SELECTED it is already switched on for you - you do not have to turn it on. You can still switch it off. If the signed-in person only has access to ONE location, Location is not offered in the column-selection list at all.
6. With a single location in scope the Location column is hidden and the surrounding columns close up with no gap.
7. Every one of the four downloads also contains the Location column, in the same position it holds on screen, showing the same values you just read: a location name on a row whose invoices are all at one location, "Multiple" on a row that aggregates more than one, and the invoice's own location on an invoice row. (Exactly where the column sits inside each file is confirmed in the build.)
Note for the tester: on this build the column does not yet behave this way - record what you see and carry on. The change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Sales By Customer report specification version 13 (S4-R12, S4-R12a, S4-R13, S20-R19) differs, his decision is the authority.
```

#### Operation 11 of 46 — `update_case` on **SBR-LOC-05** = [C38913](https://shopview.testrail.io/index.php?/cases/view/38913)

- **Case title:** The Location column shows only with more than one location; rep rows Multiple
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** His rule C2/C3 adds the selector half this case never had
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. With more than one location in scope a Location column is shown, positioned immediately after the Status column and before Inv. Hrs.
2. A rep summary row whose invoices are all at one location shows that location's name.
3. A rep summary row whose invoices span more than one location shows "Multiple".
4. An invoice detail row shows that invoice's own exact location — never "Multiple".
5. The Unassigned summary row follows the same rule as any rep summary row.
6. The pinned Subtotal column is still rightmost — the Location column never displaces it.
7. With a single location in scope the Location column is hidden.
8. All four downloads include the Location column in the same position it occupies on screen. In the Summary files a rep's row carries that rep's location and reads "Multiple" when the rep spans more than one location; in the Expanded View files each invoice row carries that invoice's own exact location.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Representative report specification version 15 (S21-R7, S21-R8, S18-R13, S14-R20).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. With more than one location in scope a Location column is shown, positioned immediately after the Status column and before Inv. Hrs.
2. A rep summary row whose invoices are all at one location shows that location's name.
3. A rep summary row whose invoices span more than one location shows "Multiple".
4. An invoice detail row shows that invoice's own exact location — never "Multiple".
5. The Unassigned summary row follows the same rule as any rep summary row.
6. The pinned Subtotal column is still rightmost — the Location column never displaces it.
7. With a single location in scope the Location column is hidden.
8. All four downloads include the Location column in the same position it occupies on screen. In the Summary files a rep's row carries that rep's location and reads "Multiple" when the rep spans more than one location; in the Expanded View files each invoice row carries that invoice's own exact location.
Location is one of the columns in the column-selection control, and with more than one location SELECTED it is already switched on for you - you do not have to turn it on. You can still switch it off. If the signed-in person only has access to ONE location, Location is not offered in the column-selection list at all.
Note for the tester: on this build the column does not yet behave this way - record what you see and carry on. The change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Sales By Representative report specification version 15 (S21-R7, S21-R8, S18-R13, S14-R20) differs, his decision is the authority.
```

#### Operation 12 of 46 — `update_case` on **PV-FILT-14** = [C38914](https://shopview.testrail.io/index.php?/cases/view/38914)

- **Case title:** The Location column shows only with more than one location, leftmost before Type
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** His rule C2 - flatly contradicted by line 4 (NOT frozen today)
- **Frozen line removed:** no — this case was never frozen
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Type.
2. Each inventory row shows its own location's name (an inventory row is one part at one location).
3. The merged Special Order row shows "Multiple", because it is summed across the selected locations.
4. Location is NOT one of the 20 columns in the picker — it is managed by the location scope, not by you.
5. With a single location in scope the Location column is hidden.
6. Both downloads include the Location column in the same position it holds on screen (leftmost, before Type), with the same values — each inventory row's own location, and "Multiple" on the merged Special Order row.
---
This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Parts Velocity report specification version 4 (S2-R12, S3-R10, S7-R8, S6-R11).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Type.
2. Each inventory row shows its own location's name (an inventory row is one part at one location).
3. The merged Special Order row shows "Multiple", because it is summed across the selected locations.
4. Location is one of the columns in the column-selection control, and with more than one location SELECTED it is already switched on for you - you do not have to turn it on. You can still switch it off. If the signed-in person only has access to ONE location, Location is not offered in the column-selection list at all.
5. With a single location in scope the Location column is hidden.
6. Both downloads include the Location column in the same position it holds on screen (leftmost, before Type), with the same values — each inventory row's own location, and "Multiple" on the merged Special Order row.
---
Note for the tester: on this build the column does not yet behave this way - record what you see and carry on. The change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Parts Velocity report specification version 4 (S2-R12, S3-R10, S7-R8, S6-R11) differs, his decision is the authority.
```

#### Operation 13 of 46 — `update_case` on **TU-LOC-06** = [C38915](https://shopview.testrail.io/index.php?/cases/view/38915)

- **Case title:** The Location column shows only with more than one location; Summary row blank
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** His rule C2 - flatly contradicted by line 6 (NOT frozen today)
- **Frozen line removed:** no — this case was never frozen
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Technician.
2. A technician whose hours were all clocked at one location shows that location's name.
3. A technician whose hours span more than one selected location shows "Multiple".
4. An expanded day row shows the exact location when that day's hours were all at one location, and "Multiple" when the day spans more than one.
5. The Summary row leaves the Location cell blank.
6. Location is never listed in the Column Selection control — it follows the location scope on its own.
7. With a single location in scope the Location column is hidden.
8. Every download — both PDF views and the CSV — includes the Location column in its on-screen leftmost position, carrying the same values you just read on screen.
---
This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Technician Utilization report specification version 5 (S9-R9, S9-R10, S8-R15, S10-R4, S7-R13).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. With more than one location in scope a Location column is shown as the LEFTMOST column, before Technician.
2. A technician whose hours were all clocked at one location shows that location's name.
3. A technician whose hours span more than one selected location shows "Multiple".
4. An expanded day row shows the exact location when that day's hours were all at one location, and "Multiple" when the day spans more than one.
5. The Summary row leaves the Location cell blank.
6. Location is one of the columns in the column-selection control, and with more than one location SELECTED it is already switched on for you - you do not have to turn it on. You can still switch it off. If the signed-in person only has access to ONE location, Location is not offered in the column-selection list at all.
7. With a single location in scope the Location column is hidden.
8. Every download — both PDF views and the CSV — includes the Location column in its on-screen leftmost position, carrying the same values you just read on screen.
---
Note for the tester: on this build the column does not yet behave this way - record what you see and carry on. The change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Technician Utilization report specification version 5 (S9-R9, S9-R10, S8-R15, S10-R4, S7-R13) differs, his decision is the authority.
```

#### Operation 14 of 46 — `update_case` on **WIP-FLT-09** = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916)

- **Case title:** The Location column is automatic and never reads Multiple on a work-order row
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** His rule C1 - lines 1/4/5 assert toggle-only visibility
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. Location is offered in the column-selection control, between VIN and Advisor, and is off by default. Turning it on adds the Location column in that fixed position, left-aligned.
2. Each row names its own work order's location.
3. NO row ever shows "Multiple" — a work order belongs to exactly one location, and this report has no grouped or drill-down rows.
4. The column does not appear or disappear on its own when you change the location selection - it follows the column-selection toggle only.
5. With the toggle off the Location column is not shown, whatever the location selection is.
6. In both downloads the column is headed "Branch" (a known naming difference from the screen — do not raise it as a bug).
7. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Work In Progress report specification version 6 (S7-R13, S7-R14, S4-R3, S9-E1, S10-R5a); on this point that specification currently states otherwise and a product decision is still awaited, so treat the behaviour described above as what the build does today.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. Location is one of the columns in the column-selection control, and with more than one location SELECTED it is already switched on for you - you do not have to turn it on. You can still switch it off. If the signed-in person only has access to ONE location, Location is not offered in the column-selection list at all. When it is on, the Location column sits between VIN and Advisor, left-aligned.
2. Each row names its own work order's location.
3. NO row ever shows "Multiple" — a work order belongs to exactly one location, and this report has no grouped or drill-down rows.
4. Note for the tester: on this build the column does not yet behave this way - record what you see and carry on. The change is with the developers.
5. With the toggle off the Location column is not shown, whatever the location selection is.
6. In both downloads the column is headed "Branch" (a known naming difference from the screen — do not raise it as a bug).
7. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Work In Progress report specification version 6 (S7-R13, S7-R14, S4-R3, S9-E1, S10-R5a) differs, his decision is the authority.
```

#### Operation 15 of 46 — `update_case` on **IV-LOC-06** = [C38917](https://shopview.testrail.io/index.php?/cases/view/38917)

- **Case title:** The Location column sits after Vendor and never reads Multiple
- **Driving answer:** item **T1-1** of Chris's sheet
- **Why:** His rule C1 - line 4 says visibility follows the toggle only
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. With Location turned on in the column-selection control, a Location column is shown, inserted between Vendor and Qty.
2. Each row names the location that row's stock is held at.
3. NO row ever shows "Multiple" — each row is one part at one location.
4. Location IS one of the columns offered in the column-selection control - its visibility follows that toggle, not the location selection.
5. With the Location toggle off the column is not shown and the surrounding columns close up.
6. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
7. Both downloads include the Location column in the same position it holds on screen (between Vendor and Qty), naming each row's own location.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Inventory Value report specification version 3 (S7-R6, S7-R7, S3-R1, S12-R10, S10-R15); on this point that specification currently states otherwise and a product decision is still awaited, so treat the behaviour described above as what the build does today.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. With Location turned on in the column-selection control, a Location column is shown, inserted between Vendor and Qty.
2. Each row names the location that row's stock is held at.
3. NO row ever shows "Multiple" — each row is one part at one location.
4. Location is one of the columns in the column-selection control, and with more than one location SELECTED it is already switched on for you - you do not have to turn it on. You can still switch it off. If the signed-in person only has access to ONE location, Location is not offered in the column-selection list at all.
5. With the Location toggle off the column is not shown and the surrounding columns close up.
6. The Location filter control keeps the same width whichever label it shows — one location, several, or "All locations" — so the toolbar does not shift as you change the selection.
7. Both downloads include the Location column in the same position it holds on screen (between Vendor and Qty), naming each row's own location.
Note for the tester: on this build the column does not yet behave this way - record what you see and carry on. The change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Inventory Value report specification version 3 (S7-R6, S7-R7, S3-R1, S12-R10, S10-R15) differs, his decision is the authority.
```

### Driven by item T2-1

#### Operation 16 of 46 — `update_case` on **SBC-LOC-01** = [C30109](https://shopview.testrail.io/index.php?/cases/view/30109)

- **Case title:** Location filter: rightmost, lists accessible locations, All locations on top
- **Driving answer:** item **T2-1** of Chris's sheet
- **Why:** Answer B keeps our wording; the product must change, not the test
- **Frozen line removed:** YES
- **Provenance basis:** a specification / earlier ruling, which he has now confirmed
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The location filter is the rightmost filter in the toolbar.
2. It lists the locations the signed-in user has access to.
3. An "All locations" option is pinned to the top.
4. Activating "All locations" selects every listed location at once; activating it again clears them all at once.
5. For a user with access to only one location the Location filter is NOT shown at all — the report simply shows that one location's data.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Customer report specification version 13 (S4-R1, S4-R2, S4-R3); where the wording of that specification differs, the behaviour above follows a later product decision, which is the authority.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The location filter is the rightmost filter in the toolbar.
2. It lists the locations the signed-in user has access to.
3. An "All locations" option is pinned to the top.
4. Activating "All locations" selects every listed location at once; activating it again clears them all at once.
5. For a user with access to only one location the Location filter is NOT shown at all — the report simply shows that one location's data.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Customer report specification version 13 (S4-R1, S4-R2, S4-R3). Chris Ward confirmed this on 8/5/2026 in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 17 of 46 — `update_case` on **SBR-LOC-04** = [C30216](https://shopview.testrail.io/index.php?/cases/view/30216)

- **Case title:** Sales By Representative: Location filter hidden for a one-location user
- **Driving answer:** item **T2-1** of Chris's sheet
- **Why:** Answer B keeps our wording; the product must change, not the test
- **Frozen line removed:** YES
- **Provenance basis:** a specification / earlier ruling, which he has now confirmed
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's data.
2. For the user with access to two or more locations the Location filter IS shown.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Representative report specification version 15 (S21-N1); where the wording of that specification differs, the behaviour above follows a later product decision, which is the authority.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's data.
2. For the user with access to two or more locations the Location filter IS shown.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Representative report specification version 15 (S21-N1). Chris Ward confirmed this on 8/5/2026 in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 18 of 46 — `update_case` on **PV-FILT-13** = [C30340](https://shopview.testrail.io/index.php?/cases/view/30340)

- **Case title:** Parts Velocity: the Location filter is hidden for a one-location user
- **Driving answer:** item **T2-1** of Chris's sheet
- **Why:** Answer B keeps our wording; the product must change, not the test
- **Frozen line removed:** YES
- **Provenance basis:** a specification / earlier ruling, which he has now confirmed
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's data.
2. For the user with access to two or more locations the Location filter IS shown.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Parts Velocity report specification version 4 (S2-E4); where the wording of that specification differs, the behaviour above follows a later product decision, which is the authority.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's data.
2. For the user with access to two or more locations the Location filter IS shown.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Parts Velocity report specification version 4 (S2-E4). Chris Ward confirmed this on 8/5/2026 in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 19 of 46 — `update_case` on **TU-LOC-05** = [C30446](https://shopview.testrail.io/index.php?/cases/view/30446)

- **Case title:** Technician Utilization: Location filter hidden for a one-location user
- **Driving answer:** item **T2-1** of Chris's sheet
- **Why:** Answer B keeps our wording; the product must change, not the test
- **Frozen line removed:** YES
- **Provenance basis:** a specification / earlier ruling, which he has now confirmed
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's data.
2. For the user with access to two or more locations the Location filter IS shown.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Technician Utilization report specification version 5 (S9-N1); where the wording of that specification differs, the behaviour above follows a later product decision, which is the authority.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's data.
2. For the user with access to two or more locations the Location filter IS shown.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Technician Utilization report specification version 5 (S9-N1). Chris Ward confirmed this on 8/5/2026 in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 20 of 46 — `update_case` on **WIP-FLT-06** = [C30503](https://shopview.testrail.io/index.php?/cases/view/30503)

- **Case title:** Location filter: rightmost multi-select with All locations, reloads on change
- **Driving answer:** item **T2-1** of Chris's sheet
- **Why:** Answer B keeps our wording; the product must change, not the test
- **Frozen line removed:** YES
- **Provenance basis:** a specification / earlier ruling, which he has now confirmed
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The Location filter is the rightmost toolbar filter, a multi-select listing the locations the signed-in user can access, with an "All locations" / "Clear all" toggle.
2. On a first visit it defaults to the user's currently active location.
3. Selecting one, several, or all locations reloads the report scoped to that set (rows from the added location appear).
4. The page itself shows which location(s) the report is currently scoped to (the new on-screen scope indicator - exactly where and how it appears is confirmed in the build).
5. For a user with access to only one location the Location filter is NOT shown at all — the report simply shows that one location's work orders.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Work In Progress report specification version 6 (S7-R9, S7-R10); where the wording of that specification differs, the behaviour above follows a later product decision, which is the authority.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The Location filter is the rightmost toolbar filter, a multi-select listing the locations the signed-in user can access, with an "All locations" / "Clear all" toggle.
2. On a first visit it defaults to the user's currently active location.
3. Selecting one, several, or all locations reloads the report scoped to that set (rows from the added location appear).
4. The page itself shows which location(s) the report is currently scoped to (the new on-screen scope indicator - exactly where and how it appears is confirmed in the build).
5. For a user with access to only one location the Location filter is NOT shown at all — the report simply shows that one location's work orders.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Work In Progress report specification version 6 (S7-R9, S7-R10). Chris Ward confirmed this on 8/5/2026 in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 21 of 46 — `update_case` on **IV-LOC-04** = [C30577](https://shopview.testrail.io/index.php?/cases/view/30577)

- **Case title:** Inventory Value: the Location filter is hidden for a one-location user
- **Driving answer:** item **T2-1** of Chris's sheet
- **Why:** Answer B keeps our wording; the product must change, not the test
- **Frozen line removed:** YES
- **Provenance basis:** a specification / earlier ruling, which he has now confirmed
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's stock.
2. For the user with access to two or more locations the Location filter IS shown.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Inventory Value report specification version 3 (S7-N1); where the wording of that specification differs, the behaviour above follows a later product decision, which is the authority.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. For the single-location user the Location filter is NOT shown at all — the report simply shows that one location's stock.
2. For the user with access to two or more locations the Location filter IS shown.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Inventory Value report specification version 3 (S7-N1). Chris Ward confirmed this on 8/5/2026 in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

### Driven by item T2-2

#### Operation 22 of 46 — `update_case` on **SBC-LBL-01** = [C30134](https://shopview.testrail.io/index.php?/cases/view/30134)

- **Case title:** Asset identified by VIN, falling back to Unit #, then plate
- **Driving answer:** item **T2-2** of Chris's sheet
- **Why:** Answer B is limited to Work In Progress, so this Sales By Customer case stands
- **Frozen line removed:** YES
- **Provenance basis:** a specification / earlier ruling, which he has now confirmed
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. Asset (a) is identified by its VIN.
2. Asset (b) (no VIN) is identified by its Unit # instead.
3. Asset (c) (no VIN or Unit #) is identified by its plate instead.
4. For asset (d) (no VIN, Unit #, or plate), note what the label shows - what stands in when all three are missing is confirmed in the build (the older rule showed "Unknown Asset").
5. Note whether the year/make/model text still appears anywhere in the row - the update says the VIN identifier REPLACES the year/make/model label; confirm the exact rendering in the build.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Customer report specification version 13 (S8-R7, S8-R8, S8-R9, S8-R10); where the wording of that specification differs, the behaviour above follows a later product decision, which is the authority.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. Asset (a) is identified by its VIN.
2. Asset (b) (no VIN) is identified by its Unit # instead.
3. Asset (c) (no VIN or Unit #) is identified by its plate instead.
4. For asset (d) (no VIN, Unit #, or plate), note what the label shows - what stands in when all three are missing is confirmed in the build (the older rule showed "Unknown Asset").
5. Note whether the year/make/model text still appears anywhere in the row - the update says the VIN identifier REPLACES the year/make/model label; confirm the exact rendering in the build.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Customer report specification version 13 (S8-R7, S8-R8, S8-R9, S8-R10). Chris Ward confirmed this on 8/5/2026 in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 23 of 46 — `update_case` on **WIP-COL-05** = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470)

- **Case title:** Asset cell identifies the asset by VIN, falling back to Unit #, then plate
- **Driving answer:** item **T2-2** of Chris's sheet
- **Why:** Answer B: the unit number leads on this report
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build already matches it
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The Asset cell identifies the asset by its VIN.
2. When the asset has no VIN, the cell shows its Unit # instead; when it has no VIN or Unit #, it shows its plate instead.
3. Note what the cell's second line shows now that the VIN is the main identifier (the older layout put the VIN on a muted second line) - the exact rendering is confirmed in the build; record what you see.
4. The VIN column (off by default) shows the VIN on its own line as a separate, sortable column.
5. Note for the tester: the field is labelled VIN. For assets that are not vehicles (for example a generator), this is the unit's serial number.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Work In Progress report specification version 6 (S4-R7, S4-R8, S4-R10); where the wording of that specification differs, the behaviour above follows a later product decision, which is the authority.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The Asset cell identifies the asset by its Unit # on the first line in bold, with the VIN underneath in a smaller, muted style.
2. When the asset has no Unit #, the cell shows its VIN instead; when it has neither, it shows its plate instead.
3. The product owner has confirmed this two-line layout is correct for this report and is already built, so the unit number leading is the expected result - do not raise it.
4. The VIN column (off by default) shows the VIN on its own line as a separate, sortable column.
5. Note for the tester: the field is labelled VIN. For assets that are not vehicles (for example a generator), this is the unit's serial number.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023). Where the Work In Progress report specification version 6 (S4-R7, S4-R8, S4-R10) says something different, the behaviour above follows Chris Ward's decision of 8/5/2026 instead, which is the authority - that decision is recorded in his answers, in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 24 of 46 — `update_case` on **WIP-SORT-03** = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485)

- **Case title:** Columns sort by underlying values; Asset sorts by the identifier shown
- **Driving answer:** item **T2-2** of Chris's sheet
- **Why:** Answer B: sorting follows the unit number here
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build already matches it
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. Money and numeric columns sort by their underlying numeric value (so $1,100.00 is treated as more than $900.00, not compared as text).
2. Days Open sorts by its day count.
3. Status sorts by its displayed label.
4. The Asset column sorts by the identifier it shows - the VIN, falling back to Unit #, then plate.
5. WO #, Customer, Asset, VIN, Location, and Advisor sort as text.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Work In Progress report specification version 6 (S4-R27, S4-R9); where the wording of that specification differs, the behaviour above follows a later product decision, which is the authority.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. Money and numeric columns sort by their underlying numeric value (so $1,100.00 is treated as more than $900.00, not compared as text).
2. Days Open sorts by its day count.
3. Status sorts by its displayed label.
4. The Asset column sorts by the identifier it shows - the Unit #, falling back to the VIN, then plate.
5. WO #, Customer, Asset, VIN, Location, and Advisor sort as text.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023). Where the Work In Progress report specification version 6 (S4-R27, S4-R9) says something different, the behaviour above follows Chris Ward's decision of 8/5/2026 instead, which is the authority - that decision is recorded in his answers, in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 25 of 46 — `update_case` on **WIP-FLT-03** = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500)

- **Case title:** Asset filter matches VIN, Unit #, or plate; "All assets" when empty
- **Driving answer:** item **T2-2** of Chris's sheet
- **Why:** Answer B: the asset filter identifies by unit number first here
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build already matches it
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. With no asset selected, the filter reads "All assets" and every job is shown.
2. Each option identifies the asset by its VIN, falling back to Unit #, then plate (the exact option text is confirmed in the build).
3. The typed text matches against the asset's identifier - the VIN, and the Unit # where the asset has one (the exact fields matched are confirmed in the build).
4. Selecting assets narrows the visible jobs on screen only (no reload); a single "Clear" action appears once at least one asset is selected and returns the filter to "All assets".
5. Note for the tester: the field is labelled VIN. For assets that are not vehicles (for example a generator), this is the unit's serial number.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Work In Progress report specification version 6 (S7-R4, S7-R5); where the wording of that specification differs, the behaviour above follows a later product decision, which is the authority.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. With no asset selected, the filter reads "All assets" and every job is shown.
2. Each option identifies the asset by its Unit #, falling back to the VIN, then plate (the exact option text is confirmed in the build).
3. The typed text matches against the asset's identifier - the Unit #, and the VIN where the asset has one (the exact fields matched are confirmed in the build).
4. Selecting assets narrows the visible jobs on screen only (no reload); a single "Clear" action appears once at least one asset is selected and returns the filter to "All assets".
5. Note for the tester: the field is labelled VIN. For assets that are not vehicles (for example a generator), this is the unit's serial number.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023). Where the Work In Progress report specification version 6 (S7-R4, S7-R5) says something different, the behaviour above follows Chris Ward's decision of 8/5/2026 instead, which is the authority - that decision is recorded in his answers, in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 26 of 46 — `update_case` on **WIP-EXP-07** = [C30516](https://shopview.testrail.io/index.php?/cases/view/30516)

- **Case title:** Export headers read "Unit" and "Branch" — documented limitation, do not file
- **Driving answer:** item **T2-2** of Chris's sheet
- **Why:** Answer B: the export header note about VIN is no longer in play
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build already matches it
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. On screen the headers read "Asset" and "Location".
2. In BOTH the PDF and the CSV, the same two columns are headed "Unit" and "Branch".
3. This on-screen-vs-export label difference is the EXPECTED, documented v1 behavior.
4. Note: the on-screen Asset cell now identifies the asset by its VIN (falling back to Unit #, then plate); whether the export header text changes from "Unit" is confirmed in the build - record what it shows, do not file a bug either way.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Work In Progress report specification version 6 (S9-E1); where the wording of that specification differs, the behaviour above follows a later product decision, which is the authority.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. On screen the headers read "Asset" and "Location".
2. In BOTH the PDF and the CSV, the same two columns are headed "Unit" and "Branch".
3. This on-screen-vs-export label difference is the EXPECTED, documented v1 behavior.
4. The on-screen Asset cell leads with the Unit #, which is what the export header "Unit" already reflects - so no header change is expected here.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023). Where the Work In Progress report specification version 6 (S9-E1) says something different, the behaviour above follows Chris Ward's decision of 8/5/2026 instead, which is the authority - that decision is recorded in his answers, in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

### Driven by item T2-3 + T2-4 + T3-3

#### Operation 27 of 46 — `update_case` on **SBR-EXP-10** = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)

- **Case title:** Summary CSV: file name, UTF-8 BOM, verbatim headers, one row per rep
- **Driving answer:** item **T2-3 + T2-4 + T3-3** of Chris's sheet
- **Why:** Heading word accepted (T2-3=A); 13 columns kept (T2-4=A); Summary position pinned (T3-3=A)
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The file is named "sales-by-representative-summary.csv" and starts with a UTF-8 BOM.
2. With a single location in scope the headers, in order, are exactly: Sales Representative, # Invoices, # Customers, Hrs Worked, Hrs Invoiced, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal.
3. There is one header row plus one row per rep in the current filtered view, in the report's currently-active order.
4. "# Invoices" equals the on-screen (N); "# Customers" counts distinct customers across those invoices (de-duplicated across locations when several are selected).
5. The CSV has NO totals row.
6. Note for the tester: the product owner has ruled that the full word "Sales Representative" replaces the short "Sales Rep" everywhere. If the screen or file still shows "Sales Rep", mark this test Failed and report it as the pending rename — do not change the test.
7. When more than one location is in scope the file also carries a Location column, with the identifying columns ahead of the metric columns; a rep whose invoices span more than one location reads "Multiple". (This file has no Status column for it to follow — confirm its exact position in the build.)
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Representative report specification version 15 (S14-R15, S14-R18, S14-R20); where the wording of that specification differs, the behaviour above follows a later product decision, which is the authority.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The file is named "sales-by-representative-summary.csv" and starts with a UTF-8 BOM.
2. With a single location in scope the headers, in order, are: Representative, # Invoices, # Customers, Hrs Worked, Hrs Invoiced, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal. On this build only nine of them arrive - Representative, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal - because # Invoices, # Customers, Hrs Worked and Hrs Invoiced are missing by mistake. Record what you see; the four missing columns are with the developers.
3. There is one header row plus one row per rep in the current filtered view, in the report's currently-active order.
4. "# Invoices" equals the on-screen (N); "# Customers" counts distinct customers across those invoices (de-duplicated across locations when several are selected).
5. The CSV has NO totals row.
6. Note for the tester: the heading in this file reads simply "Representative". The product owner has confirmed that is correct and not slang, so do not fail the test for it.
7. When more than one location is in scope the file also carries a Location column, immediately after the Representative name and before the money columns; a rep whose invoices span more than one location reads "Multiple".

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Sales By Representative report specification version 15 (S14-R15, S14-R18, S14-R20) differs, his decision is the authority.
```

### Driven by item T2-3

#### Operation 28 of 46 — `update_case` on **SBR-EXP-11** = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286)

- **Case title:** Expanded CSV: file name, verbatim headers, one row per invoice
- **Driving answer:** item **T2-3** of Chris's sheet
- **Why:** Heading word accepted (T2-3=A)
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build already matches it
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The file is named "sales-by-representative-expanded.csv" and starts with a UTF-8 BOM.
2. With a single location in scope the headers, in order, are exactly: Sales Representative, Date, Invoice #, Customer, Status, Hrs Worked, Hrs Invoiced, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal.
3. There is one header row plus one row per invoice, flattened across all reps in the report's currently-active order, for the current filtered view.
4. Note for the tester: the product owner has ruled that the full word "Sales Representative" replaces the short "Sales Rep" everywhere. If the screen or file still shows "Sales Rep", mark this test Failed and report it as the pending rename — do not change the test.
5. When more than one location is in scope the file also carries a Location column immediately after Status — the position it holds on screen — and every row shows that invoice's own exact location, never "Multiple".
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Representative report specification version 15 (S14-R16, S14-R20); where the wording of that specification differs, the behaviour above follows a later product decision, which is the authority.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The file is named "sales-by-representative-expanded.csv" and starts with a UTF-8 BOM.
2. With a single location in scope the headers, in order, are: Representative, Date, Invoice #, Customer, Status, Hrs Worked, Hrs Invoiced, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal.
3. There is one header row plus one row per invoice, flattened across all reps in the report's currently-active order, for the current filtered view.
4. Note for the tester: the heading in this file reads simply "Representative". The product owner has confirmed that is correct and not slang, so do not fail the test for it.
5. When more than one location is in scope the file also carries a Location column immediately after Status — the position it holds on screen — and every row shows that invoice's own exact location, never "Multiple".

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023). Where the Sales By Representative report specification version 15 (S14-R16, S14-R20) says something different, the behaviour above follows Chris Ward's decision of 8/5/2026 instead, which is the authority - that decision is recorded in his answers, in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

### Driven by item T2-5

#### Operation 29 of 46 — `update_case` on **SBC-DATE-01** = [C30102](https://shopview.testrail.io/index.php?/cases/view/30102)

- **Case title:** Date range picker offers eleven options in the specified order
- **Driving answer:** item **T2-5** of Chris's sheet
- **Why:** Answer A: keep the product - nine periods plus a calendar
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build already matches it
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. A date range picker is visible in the report toolbar.
2. It offers eleven options, in this order: Today, Yesterday, This Week, Last Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom.
3. There is no "All Time" option.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Customer report specification version 13 (S2-R1, S2-R2).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. A date range picker is visible in the report toolbar.
3. The named periods use the application's standard shared calendar boundaries - this is one shared chooser used by all six reports.
3. There is no "All Time" option.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023). Where the Sales By Customer report specification version 13 (S2-R1, S2-R2) says something different, the behaviour above follows Chris Ward's decision of 8/5/2026 instead, which is the authority - that decision is recorded in his answers, in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 30 of 46 — `update_case` on **SBC-DATE-03** = [C30104](https://shopview.testrail.io/index.php?/cases/view/30104)

- **Case title:** Custom range opens a start/end date dialog and cannot exceed a 366-day span
- **Driving answer:** item **T2-5** of Chris's sheet
- **Why:** Answer A: the body already matched the build; only the TITLE was wrong
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build already matches it
- **Fields written:** `custom_expected` and `title`

**TITLE — before:**

```
Custom range opens a start/end date dialog and cannot exceed a 366-day span
```

**TITLE — after:**

```
Building a custom range on the calendar cannot exceed a 366-day span
```

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The date range picker shows a month calendar inside it — that is how a custom start and end date are chosen on this build. There is no separate "Custom" item to choose.
2. A range of 366 days or fewer applies normally.
3. A range wider than 366 days cannot be applied — the report prevents the selection rather than loading the wider range.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Customer report specification version 13 (S2-R3, S2-R4, S2-N2).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The date range picker shows a month calendar inside it — that is how a custom start and end date are chosen on this build. There is no separate "Custom" item to choose.
2. A range of 366 days or fewer applies normally.
3. A range wider than 366 days cannot be applied — the report prevents the selection rather than loading the wider range.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023). Where the Sales By Customer report specification version 13 (S2-R3, S2-R4, S2-N2) says something different, the behaviour above follows Chris Ward's decision of 8/5/2026 instead, which is the authority - that decision is recorded in his answers, in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 31 of 46 — `update_case` on **SBC-EXP-02** = [C30160](https://shopview.testrail.io/index.php?/cases/view/30160)

- **Case title:** Download file names carry the version and the active date range
- **Driving answer:** item **T2-5** of Chris's sheet
- **Why:** Answer A: the file-name map listed periods that do not exist (NOT frozen today)
- **Frozen line removed:** no — this case was never frozen
- **Provenance basis:** his decision, and the build already matches it
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The Summary file name is sales-by-customer-summary-{range}.csv and the Expanded file name is sales-by-customer-expanded-{range}.csv — so the file says which version it is.
2. {range} follows this map: Today → today; Yesterday → yesterday; This Week → this_week; Last Week → last_week; This Month → this_month; Last Month → last_month; This Year → this_year; Last Year → last_year; This Quarter → this_quarter; Last Quarter → last_quarter; Custom → custom.
3. For Custom the literal word "custom" is used — the actual start and end dates are not in the file name.
4. The file is plain comma-separated text with a .csv extension that opens as rows and columns in a spreadsheet — not an .xlsx workbook and not a JSON file.
5. The two PDF downloads follow the same names with a .pdf extension — for example, sales-by-customer-summary-this_month.pdf and sales-by-customer-expanded-custom.pdf.
---
This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Customer report specification version 13 (S14-R14, S14-R15, S15-R6); where the wording of that specification differs, the behaviour above follows a later product decision, which is the authority.
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The Summary file name is sales-by-customer-summary-{range}.csv and the Expanded file name is sales-by-customer-expanded-{range}.csv — so the file says which version it is.
2. {range} follows the period you picked, using the nine periods the chooser actually offers: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week. Record the exact word the file uses for each - the mapping is confirmed in the build.
3. For a range you built yourself on the calendar, record what the file name uses in place of a period name - the exact wording is confirmed in the build.
4. The file is plain comma-separated text with a .csv extension that opens as rows and columns in a spreadsheet — not an .xlsx workbook and not a JSON file.
5. The two PDF downloads follow the same names with a .pdf extension — for example, sales-by-customer-summary-this_month.pdf and sales-by-customer-expanded-custom.pdf.
---

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023). Where the Sales By Customer report specification version 13 (S14-R14, S14-R15, S15-R6) says something different, the behaviour above follows Chris Ward's decision of 8/5/2026 instead, which is the authority - that decision is recorded in his answers, in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 32 of 46 — `update_case` on **SBR-DATE-01** = [C30201](https://shopview.testrail.io/index.php?/cases/view/30201)

- **Case title:** Date range picker is in the toolbar and offers the standard presets plus Custom
- **Driving answer:** item **T2-5** of Chris's sheet
- **Why:** Answer A: keep the product
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build already matches it
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. A date range picker is visible in the report toolbar.
2. The standard presets are offered: Today, Yesterday, This Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom.
3. There is no "All Time" option (removed by the 2026-07-16 spec round).
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Representative report specification version 15 (S2-R1, S2-R2).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. A date range picker is visible in the report toolbar.
2. The chooser offers nine ready-made periods, in this order: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week. Beside them it shows a month calendar you click dates on to build your own range, a live readout of how many days the range covers, and an Apply button. There is no "Today", no "Yesterday" and no item called "Custom" - you build your own range on the calendar instead. There is no "All Time" option.
3. The named periods use the application's standard shared calendar boundaries - this is one shared chooser used by all six reports.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023). Where the Sales By Representative report specification version 15 (S2-R1, S2-R2) says something different, the behaviour above follows Chris Ward's decision of 8/5/2026 instead, which is the authority - that decision is recorded in his answers, in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 33 of 46 — `update_case` on **PV-FILT-03** = [C30330](https://shopview.testrail.io/index.php?/cases/view/30330)

- **Case title:** Date range selector offers exactly the eleven bounded options and no All Time
- **Driving answer:** item **T2-5** of Chris's sheet
- **Why:** Answer A: keep the product
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build already matches it
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The options are exactly: Today, Yesterday, This Week, Last Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom.
2. There is NO 'All Time' option - the report always operates over a bounded date window (deliberate, per the spec's Out of Scope).
3. Selecting a non-custom option immediately reloads the report data.
4. The named ranges use the application's standard shared calendar boundaries (the same boundaries every report's date picker uses).
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Parts Velocity report specification version 4 (S2-R2).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The chooser offers nine ready-made periods, in this order: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week. Beside them it shows a month calendar you click dates on to build your own range, a live readout of how many days the range covers, and an Apply button. There is no "Today", no "Yesterday" and no item called "Custom" - you build your own range on the calendar instead. There is no "All Time" option.
2. The report always operates over a bounded date window, which is why no All-Time period is offered.
3. Selecting a non-custom option immediately reloads the report data.
4. The named ranges use the application's standard shared calendar boundaries (the same boundaries every report's date picker uses).

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023). Where the Parts Velocity report specification version 4 (S2-R2) says something different, the behaviour above follows Chris Ward's decision of 8/5/2026 instead, which is the authority - that decision is recorded in his answers, in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 34 of 46 — `update_case` on **WIP-FLT-04** = [C30501](https://shopview.testrail.io/index.php?/cases/view/30501)

- **Case title:** The date range offers the presets plus Custom; This Week default; no All Time
- **Driving answer:** item **T2-5** of Chris's sheet
- **Why:** Answer A: keep the product; the This Week default is unaffected
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build already matches it
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. On a fresh visit the date range defaults to "This Week".
2. The options offered are: "Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year", "This Quarter", "Last Quarter", and "Custom".
3. "All Time" is NOT offered.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Work In Progress report specification version 6 (S7-R6).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. On a fresh visit the date range defaults to "This Week".
2. The chooser offers nine ready-made periods, in this order: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week. Beside them it shows a month calendar you click dates on to build your own range, a live readout of how many days the range covers, and an Apply button. There is no "Today", no "Yesterday" and no item called "Custom" - you build your own range on the calendar instead. There is no "All Time" option.
3. The named periods use the application's standard shared calendar boundaries - this is one shared chooser used by all six reports.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023). Where the Work In Progress report specification version 6 (S7-R6) says something different, the behaviour above follows Chris Ward's decision of 8/5/2026 instead, which is the authority - that decision is recorded in his answers, in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

#### Operation 35 of 46 — `update_case` on **IV-DATE-01** = [C30561](https://shopview.testrail.io/index.php?/cases/view/30561)

- **Case title:** Date range offers the standard presets plus Custom; no All Time option
- **Driving answer:** item **T2-5** of Chris's sheet
- **Why:** Answer A: keep the product
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build already matches it
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The control offers the standard presets: "Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year", "This Quarter", "Last Quarter", and "Custom".
2. "All Time" is NOT offered — because the report is valued as of a single date, an All-Time option would be meaningless; its absence is the documented v1 behavior.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Inventory Value report specification version 3 (S5-R1).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The chooser offers nine ready-made periods, in this order: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week. Beside them it shows a month calendar you click dates on to build your own range, a live readout of how many days the range covers, and an Apply button. There is no "Today", no "Yesterday" and no item called "Custom" - you build your own range on the calendar instead. There is no "All Time" option.
2. Because the report is valued as of a single date, an All-Time period would be meaningless; its absence is the documented behaviour.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023). Where the Inventory Value report specification version 3 (S5-R1) says something different, the behaviour above follows Chris Ward's decision of 8/5/2026 instead, which is the authority - that decision is recorded in his answers, in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

### Driven by item T2-6

#### Operation 36 of 46 — `update_case` on **TU-EXP-01** = [C30434](https://shopview.testrail.io/index.php?/cases/view/30434)

- **Case title:** Three-dot menu is leftmost, then Column Selection; three download options
- **Driving answer:** item **T2-6** of Chris's sheet
- **Why:** Answer B: the longer wording, brought into line with the other two reports
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The three-dot download menu sits LEFTMOST in the toolbar's action cluster, with the Column Selection control immediately after it.
2. The menu holds: "Download Summary (PDF)", "Download Expanded View (PDF)", and "Download (CSV)".
3. The labels match exactly - only the expanded option carries the word "View" (the shipped strings, documented as-is).
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Technician Utilization report specification version 5 (S7-R1, S7-R2, S7-R3, S7-R4, S8-R2).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The three-dot download menu sits LEFTMOST in the toolbar's action cluster, with the Column Selection control immediately after it.
2. The menu holds four items, worded exactly as they are on Sales By Customer and Sales By Representative: "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)" and "Download Expanded View (CSV)".
3. Note for the tester: on this build the four items are worded more briefly - "Summary (PDF)", "Summary (CSV)", "Expanded (PDF)" and "Expanded (CSV)" - without the word "Download". The product owner has decided they must match the other two reports, so record what you see; the change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Technician Utilization report specification version 5 (S7-R1, S7-R2, S7-R3, S7-R4, S8-R2) differs, his decision is the authority.
```

#### Operation 37 of 46 — `update_case` on **TU-EXP-02** = [C30435](https://shopview.testrail.io/index.php?/cases/view/30435)

- **Case title:** The Summary PDF holds the technician rows plus the Summary
- **Driving answer:** item **T2-6** of Chris's sheet
- **Why:** Released only - the menu wording does not touch what the file contains
- **Frozen line removed:** YES
- **Provenance basis:** unchanged - his answers do not govern this case
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The Summary PDF shows the technician rows and the Summary row (no day rows); it downloads as "Technician-Utilization-Summary.pdf".
2. The Expanded PDF shows the technician rows, EACH technician's per-day breakdown, and the Summary row; it downloads as "Technician-Utilization-Expanded.pdf".
3. The PDF filenames are Title-Case as shipped.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Technician Utilization report specification version 5 (S7-R5, S7-R6, S7-R12).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The Summary PDF shows the technician rows and the Summary row (no day rows); it downloads as "Technician-Utilization-Summary.pdf".
2. The Expanded PDF shows the technician rows, EACH technician's per-day breakdown, and the Summary row; it downloads as "Technician-Utilization-Expanded.pdf".
3. The PDF filenames are Title-Case as shipped.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Technician Utilization report specification version 5 (S7-R5, S7-R6, S7-R12).
```

### Driven by item T2-7

#### Operation 38 of 46 — `update_case` on **IV-EXP-04** = [C30590](https://shopview.testrail.io/index.php?/cases/view/30590)

- **Case title:** PDF header shows report name; org; period and an as-of line; logo if set
- **Driving answer:** item **T2-7** of Chris's sheet
- **Why:** Answer A: the as-of line belongs in the spreadsheet too
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build already matches it
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The PDF header shows the report name "Inventory Value", the organization name, the selected period, and an "as of" line naming the day the values represent (or a message that no snapshot is available for the period).
2. The PDF shows the shop logo at the top when one is set.
3. The CSV never includes a logo.
4. Note for the tester: the two files phrase the as-of line differently - the PDF reads "As of 2026-08-04", and in the spreadsheet it is one of the short summary lines that sit above the column headings, reading "As of: 2026-08-04" (with a colon). Both are correct; do not raise the difference, and do not count the summary lines - more of them may be added.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Inventory Value report specification version 3 (S10-R8, S10-R9).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The PDF header shows the report name "Inventory Value", the organization name, the selected period, and an "as of" line naming the day the values represent (or a message that no snapshot is available for the period).
2. The PDF shows the shop logo at the top when one is set.
3. The CSV never includes a logo.
4. Note for the tester: the two files phrase the as-of line differently - the PDF reads "As of 2026-08-04", and in the spreadsheet it is one of the short summary lines that sit above the column headings, reading "As of: 2026-08-04" (with a colon). Both are correct; do not raise the difference, and do not count the summary lines - more of them may be added.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023). Where the Inventory Value report specification version 3 (S10-R8, S10-R9) says something different, the behaviour above follows Chris Ward's decision of 8/5/2026 instead, which is the authority - that decision is recorded in his answers, in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

### Driven by item T3-1 + T3-3

#### Operation 39 of 46 — `update_case` on **SBR-EXP-03** = [C30278](https://shopview.testrail.io/index.php?/cases/view/30278)

- **Case title:** Summary PDF: one rolled-up row per rep with a recomputed grand totals row
- **Driving answer:** item **T3-1 + T3-3** of Chris's sheet
- **Why:** Answer A confirms the export half; answer T3-3=A pins the Summary position
- **Frozen line removed:** YES
- **Provenance basis:** his decision, on a point the specification never covered, not yet seen on a build
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The PDF is A4 portrait, edge-to-edge, with a header strip on the first page showing the workplace name and address, the organization logo, the report title "Sales By Representative," and the selected date range.
2. There is one rolled-up row per rep, in the report's currently-active order; a toggled-off contributor's name carries the "(Inactive)" tag.
3. With a single location in scope the columns are: Rep / Inv. Hrs / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Margin / Margin % / Subtotal. When more than one location is in scope a Location column is added with the identifying columns ahead of Inv. Hrs, and a rep who spans more than one location reads "Multiple" (this file has no Status column for it to follow — confirm its exact position in the build).
4. Subtotal is bolded across the header, the body rows, and the grand totals row; Inv. Hrs keeps its green/red/default coloring.
5. The grand totals row reads "Totals" in the Rep cell and aggregates every summary row in the document (including the Unassigned row when Show Unassigned is on); its Margin % is RECOMPUTED as total Margin ÷ total Subtotal (shown "—" when that Subtotal is zero or below), never the sum or average of the rows' percentages.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Representative report specification version 15 (S14-R3, S14-R5, S14-R20, S2-R5).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The PDF is A4 portrait, edge-to-edge, with a header strip on the first page showing the workplace name and address, the organization logo, the report title "Sales By Representative," and the selected date range.
2. There is one rolled-up row per rep, in the report's currently-active order; a toggled-off contributor's name carries the "(Inactive)" tag.
3. With a single location in scope the columns are: Rep / Inv. Hrs / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Margin / Margin % / Subtotal. When more than one location is in scope a Location column is added immediately after the Representative name and before the money columns, and a rep who spans more than one location reads "Multiple".
4. Subtotal is bolded across the header, the body rows, and the grand totals row; Inv. Hrs keeps its green/red/default coloring.
5. The grand totals row reads "Totals" in the Rep cell and aggregates every summary row in the document (including the Unassigned row when Show Unassigned is on); its Margin % is RECOMPUTED as total Margin ÷ total Subtotal (shown "—" when that Subtotal is zero or below), never the sum or average of the rows' percentages.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. The Sales By Representative report specification version 15 (S14-R3, S14-R5, S14-R20, S2-R5) is silent on this point, and it has not yet been confirmed on a build.
```

### Driven by item T3-1

#### Operation 40 of 46 — `update_case` on **SBR-EXP-04** = [C30279](https://shopview.testrail.io/index.php?/cases/view/30279)

- **Case title:** Expanded View PDF: one page-block per rep with its own totals; no grand
- **Driving answer:** item **T3-1** of Chris's sheet
- **Why:** Answer A confirms the newer instruction wins over the older fixed list
- **Frozen line removed:** YES
- **Provenance basis:** a specification / earlier ruling, which he has now confirmed
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. There is one page-block per rep, in the report's currently-active order, with a page break before each new rep after the first.
2. Each block shows the header strip (workplace name and address, organization logo, title "Sales By Representative," the selected date range), the rep's name, and a per-invoice table with columns: Date / Invoice / Customer / Status / (Location, only when more than one location is in scope, carrying that invoice's own location) / Inv. Hrs / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Margin / Margin % / Subtotal.
3. The Status column renders the same colored badge as on screen, vertically centered.
4. Invoices are ordered newest first (the same order as the on-screen expansion: invoice date descending, numeric invoice-number tie-break).
5. Each block ends with a per-rep totals row — "Totals" in the Date cell; Invoice/Customer/Status blank; each metric aggregated; Margin % recomputed.
6. There is NO grand-totals row across all reps at the end of the document.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Representative report specification version 15 (S14-R6, S14-R8, S14-R20, S6-R9).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. There is one page-block per rep, in the report's currently-active order, with a page break before each new rep after the first.
2. Each block shows the header strip (workplace name and address, organization logo, title "Sales By Representative," the selected date range), the rep's name, and a per-invoice table with columns: Date / Invoice / Customer / Status / (Location, only when more than one location is in scope, carrying that invoice's own location) / Inv. Hrs / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Margin / Margin % / Subtotal.
3. The Status column renders the same colored badge as on screen, vertically centered.
4. Invoices are ordered newest first (the same order as the on-screen expansion: invoice date descending, numeric invoice-number tie-break).
5. Each block ends with a per-rep totals row — "Totals" in the Date cell; Invoice/Customer/Status blank; each metric aggregated; Margin % recomputed.
6. There is NO grand-totals row across all reps at the end of the document.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Representative report specification version 15 (S14-R6, S14-R8, S14-R20, S6-R9). Chris Ward confirmed this on 8/5/2026 in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true
```

### Driven by item T3-3

#### Operation 41 of 46 — `update_case` on **SBC-EXP-16** = [C38856](https://shopview.testrail.io/index.php?/cases/view/38856)

- **Case title:** Summary and Expanded View downloads exist for both PDF and CSV
- **Driving answer:** item **T3-3** of Chris's sheet
- **Why:** Answer A pins the position his description never gave
- **Frozen line removed:** YES
- **Provenance basis:** his decision, on a point the specification never covered, not yet seen on a build
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The menu offers exactly four items: "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", "Download Expanded View (CSV)".
2. Each Summary file gives ONE row per customer, without the asset or invoice detail rows.
3. Each Expanded View file contains the full Customer, then Asset, then Invoice breakdown.
4. All four files reflect exactly the filtered data shown on screen.
5. With a single location in scope the Summary files have these ten columns in this exact order: Customer, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal — no Asset, Invoice # or Date columns. When more than one location is in scope a Location column is added with the identifying columns, ahead of the money columns (the Summary files have no Date column for it to follow — confirm its exact position in the build).
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Customer report specification version 13 (S14-R1, S14-R2, S14-R4, S15-R1, S15-R2, S15-R4, S15-R5, S4-R13).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The menu offers exactly four items: "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", "Download Expanded View (CSV)".
2. Each Summary file gives ONE row per customer, without the asset or invoice detail rows.
3. Each Expanded View file contains the full Customer, then Asset, then Invoice breakdown.
4. All four files reflect exactly the filtered data shown on screen.
5. With a single location in scope the Summary files have these ten columns in this exact order: Customer, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal — no Asset, Invoice # or Date columns. When more than one location is in scope a Location column is added immediately after the Customer name and before the money columns.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. The Sales By Customer report specification version 13 (S14-R1, S14-R2, S14-R4, S15-R1, S15-R2, S15-R4, S15-R5, S4-R13) is silent on this point, and it has not yet been confirmed on a build.
```

### Driven by item T3-4

#### Operation 42 of 46 — `update_case` on **SBC-EXP-10** = [C30168](https://shopview.testrail.io/index.php?/cases/view/30168)

- **Case title:** PDF logo is embedded, scales without distortion
- **Driving answer:** item **T3-4** of Chris's sheet
- **Why:** His rule C: no logo uploaded means NO logo, not the bundled one
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. With an uploaded logo, that logo appears pinned to the top-right, scaled to fit its area without distortion.
2. With no uploaded logo, the bundled ShopView logo is used.
3. When no logo is available at all, the logo column is not rendered and the text column fills the full width.
4. The logo is embedded in the PDF (renders offline, not loaded from a network address).
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Customer report specification version 13 (S15-R12, S15-R13, S15-R14, S15-R15, S15-R16, S15-R17, S15-R18).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. With an uploaded logo, that logo appears pinned to the top-right, scaled to fit its area without distortion.
2. With a logo uploaded, that logo appears. If a logo is set but fails to load, the built-in ShopView logo is used instead. If no logo is uploaded at all, NO logo is printed and the text fills the space.
3. When no logo is printed, the logo column is not rendered and the text column fills the full width.
4. The logo is embedded in the PDF (renders offline, not loaded from a network address).
Note for the tester: on this build a report with no uploaded logo still prints the built-in ShopView logo. The product owner has decided it should print no logo at all, so record what you see; the change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Sales By Customer report specification version 13 (S15-R12, S15-R13, S15-R14, S15-R15, S15-R16, S15-R17, S15-R18) differs, his decision is the authority.
```

#### Operation 43 of 46 — `update_case` on **SBR-EXP-06** = [C30281](https://shopview.testrail.io/index.php?/cases/view/30281)

- **Case title:** PDF footer on every page, default-logo fallback, and deterministic PDF filenames
- **Driving answer:** item **T3-4** of Chris's sheet
- **Why:** His rule C: line 3 asserts the bundled fallback (NOT frozen today)
- **Frozen line removed:** no — this case was never frozen
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The files are named exactly "sales-by-representative-summary.pdf" and "sales-by-representative-expanded.pdf".
2. A footer reading "Software Powered by ShopView" appears on EVERY page of both PDFs.
3. With no configured logo, the logo region falls back to the default ShopView logo and the PDF still generates normally.
---
This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Sales By Representative report specification version 15 (S14-R3a, S14-R4, S14-R11).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The files are named exactly "sales-by-representative-summary.pdf" and "sales-by-representative-expanded.pdf".
2. A footer reading "Software Powered by ShopView" appears on EVERY page of both PDFs.
3. With a logo uploaded, that logo appears. If a logo is set but fails to load, the built-in ShopView logo is used instead. If no logo is uploaded at all, NO logo is printed and the text fills the space. The PDF still generates normally either way.
---
Note for the tester: on this build a report with no uploaded logo still prints the built-in ShopView logo. The product owner has decided it should print no logo at all, so record what you see; the change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Sales By Representative report specification version 15 (S14-R3a, S14-R4, S14-R11) differs, his decision is the authority.
```

#### Operation 44 of 46 — `update_case` on **PV-EXP-05** = [C30379](https://shopview.testrail.io/index.php?/cases/view/30379)

- **Case title:** PDF: filename, A3 landscape, title, text truncation, and the shop logo
- **Driving answer:** item **T3-4** of Chris's sheet
- **Why:** His rule C: line 5 asserts the bundled fallback
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The file downloads as velocity-report.pdf.
2. The PDF is formatted for A3 landscape and titled Parts Velocity.
3. Description, Category, and Vendor are truncated to 18 characters in the PDF.
4. Part # is NOT truncated.
5. The shop logo shows at the top of the PDF when one is set. With no uploaded logo the PDF shows the bundled ShopView default logo instead of a blank space, the same as the other reports in this suite. The CSV never includes a logo.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Parts Velocity report specification version 4 (S6-R5, S6-R6).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The file downloads as velocity-report.pdf.
2. The PDF is formatted for A3 landscape and titled Parts Velocity.
3. Description, Category, and Vendor are truncated to 18 characters in the PDF.
4. Part # is NOT truncated.
5. With a logo uploaded, that logo appears. If a logo is set but fails to load, the built-in ShopView logo is used instead. If no logo is uploaded at all, NO logo is printed and the text fills the space. The CSV never includes a logo.
Note for the tester: on this build a report with no uploaded logo still prints the built-in ShopView logo. The product owner has decided it should print no logo at all, so record what you see; the change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Parts Velocity report specification version 4 (S6-R5, S6-R6) differs, his decision is the authority.
```

#### Operation 45 of 46 — `update_case` on **PV-EXP-06** = [C30380](https://shopview.testrail.io/index.php?/cases/view/30380)

- **Case title:** CSV is named velocity-report.csv and holds full untruncated text values
- **Driving answer:** item **T3-4** of Chris's sheet
- **Why:** Released only - its only logo statement is about the spreadsheet, untouched
- **Frozen line removed:** YES
- **Provenance basis:** unchanged - his answers do not govern this case
- **Fields written:** `custom_expected`

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. The file downloads as velocity-report.csv.
2. The CSV carries the FULL, untruncated Description / Category / Vendor values (unlike the PDF's 18-character cut).
3. Last Sale is a raw integer in the CSV (e.g. 42) - the 'N days' wording is PDF/on-screen only.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Parts Velocity report specification version 4 (S6-R5, S6-R6, S6-R8).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. The file downloads as velocity-report.csv.
2. The CSV carries the FULL, untruncated Description / Category / Vendor values (unlike the PDF's 18-character cut).
3. Last Sale is a raw integer in the CSV (e.g. 42) - the 'N days' wording is PDF/on-screen only.

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Parts Velocity report specification version 4 (S6-R5, S6-R6, S6-R8).
```

#### Operation 46 of 46 — `update_case` on **TU-EXP-06** = [C30439](https://shopview.testrail.io/index.php?/cases/view/30439)

- **Case title:** PDF logo: the uploaded logo, else the bundled ShopView logo; CSV never
- **Driving answer:** item **T3-4** of Chris's sheet
- **Why:** His rule C: the title and line 3 both assert the bundled fallback
- **Frozen line removed:** YES
- **Provenance basis:** his decision, and the build does NOT match it yet
- **Fields written:** `custom_expected` and `title`

**TITLE — before:**

```
PDF logo: the uploaded logo, else the bundled ShopView logo; CSV never
```

**TITLE — after:**

```
PDF logo follows the uploaded logo; the spreadsheet never carries one
```

**`custom_expected` — BEFORE (verbatim from live TestRail, 2026-08-05):**

```
1. With an uploaded logo, BOTH PDF views show that logo at the top of the report.
2. The CSV never includes the logo.
3. With NO uploaded logo, the PDF views show the bundled ShopView logo instead — not a blank space and not an error.
---
DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. Automating it now could lock in the wrong behaviour.
The open question is in: Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx — https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/report-suite/chris-consolidated-2026-08-04/Report-Suite_Questions-and-Decisions-for-Chris-Ward_2026-08-04.xlsx

This is the expected behaviour as per the build tested on 8/4/2026 (build v3.4.1-3d03023), and as per the Technician Utilization report specification version 5 (S7-R11, S7-N2, S7-N3).
```

**`custom_expected` — AFTER (exactly what would be sent):**

```
1. With an uploaded logo, BOTH PDF views show that logo at the top of the report.
2. The CSV never includes the logo.
3. With a logo uploaded, that logo appears. If a logo is set but fails to load, the built-in ShopView logo is used instead. If no logo is uploaded at all, NO logo is printed and the text fills the space.
Note for the tester: on this build a report with no uploaded logo still prints the built-in ShopView logo. The product owner has decided it should print no logo at all, so record what you see; the change is with the developers.

This is the expected behaviour as per Chris Ward's decision of 8/5/2026, recorded in his answers in this file: https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true. It does NOT match the build tested on 8/4/2026 (build v3.4.1-3d03023) - that change is with the developers - and where the Technician Utilization report specification version 5 (S7-R11, S7-N2, S7-N3) differs, his decision is the authority.
```

---

## NOT STAGED — the 8 cases that stay frozen

No operation touches these. Five of the eight carry a "waiting on the product owner" line that
we believe is wrong (see `DELTAS.md` §7) — but removing it changes what a tester does, so it
needs the QA lead's decision, not ours.

| Case | Waiting on |
|---|---|
| **SBC-NAV-01** = [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) | item T3-7, which he left blank |
| **SBC-VIS-02** = [C30186](https://shopview.testrail.io/index.php?/cases/view/30186) | **nothing** — no item governs it; frozen in error |
| **SBR-WO-01** = [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) | item T3-9, which he left blank |
| **SBR-WO-06** = [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) | item T3-9, which he left blank |
| **TU-EXP-07** = [C30440](https://shopview.testrail.io/index.php?/cases/view/30440) | **nothing** — no item governs it; frozen in error |
| **WIP-SUM-05** = [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) | **a developer**, not him — frozen in error |
| **WIP-FLT-05** = [C30502](https://shopview.testrail.io/index.php?/cases/view/30502) | **nothing** — the question was never asked |
| **IV-DATE-04** = [C30564](https://shopview.testrail.io/index.php?/cases/view/30564) | **a developer** — already SV-8820, Ready to Fix |

---

## Manifest status

**STAGED — NOT EXECUTED.** No `update_case`, `add_case`, `add_section`, `delete_case`, run
write or result write has been made. When this manifest is executed, this header must be
changed to EXECUTED and a per-operation audit log written beside it, recording for each
operation the target C-id, the HTTP status and the byte-verification result — a log that
records only "200 OK" is non-compliant (Standing Rule 50).
