# Schedule — Questions for Branko — 2026-07-30 *(revised 2026-07-31)*

> *(QA STATUS NOTE — internal; not part of what Branko reads. The reader-facing content
> starts at "Plain-language product questions only" below and is mirrored 1:1 in the
> workbook's "Questions for PO" sheet.)*
>
> **STATUS: REVISED 2026-07-31 against the current product write-up (Confluence version
> 23, updated 2026-07-30). 8 questions — 3 confirmations + 1 open choice + 4 new
> questions the write-up does not answer.** Not yet sent.
>
> Since this sheet was first written on 2026-07-30, Branko answered the earlier
> (2026-07-27) sheet. Two questions on this sheet — calendar events using up a
> technician's time, and the 'Reassign' button in the shift pop-up — are **now answered
> and have been removed** (they are recorded, with his exact words, in the QA-only
> section so we never ask them again). One question — whether a technician may change
> other technicians' shifts — has been **removed and re-routed to engineering**, because
> Branko replied that it is not his question. Three questions have been **reframed as
> quick confirmations**, because the current product write-up now already says what our
> tests assume. Four **new** questions were added for things the write-up does not
> cover at all.

Plain-language product questions only (no bugs, no test jargon). These came up because the engineering build plan describes a few things differently from the product write-up and the design pictures, and because a few points are not covered anywhere.
Please pick an option (or write your own answer) for each.

## Question 1 — Shop closure days: does a multi-day job skip them? (please confirm this still stands)

**What happens now:** When a big job is spread across several days, the schedule plans one shift per day. The current product write-up says shop closure days (holidays, inventory days) are NOT skipped in the first release - a shift can land on a closure day, and only weekends are skipped (and only when no working hours are set for them). Our tests are written that way. Two things still disagree with it: a later part of the same product write-up still says closure days stop the schedule from planning work on them, and the engineering build plan builds real closure-day skipping.

**The question:** Please confirm the current write-up stands - in the first release closure days are NOT skipped - and that the other sentence in the write-up and the build plan should be corrected.

**Options:**

- A) Confirmed - do not skip closure days in the first release; the other sentence and the build plan should change.
- B) No - closure days should be skipped after all.
- C) Something else (please explain).

**Your answer:** ____________________

## Question 2 — Where do the shop's and technicians' working hours live? (please confirm this still stands)

**What happens now:** The current product write-up says working hours are set in two places: a technician's own hours inside the "Edit Staff Member" window (behind a switch called "Set custom hours for this technician"), and the shop's hours inside the "Edit Location" window (behind "Set business hours for this shop"). Our tests are written that way. The engineering build plan instead builds a separate "Schedule Settings" page in the Administration area, which would hold the shop's hours AND its closure days.

**The question:** Please confirm the current write-up stands - hours are set in Edit Staff Member and Edit Location - and tell us where the shop's closure days are set, since the write-up does not say.

**Options:**

- A) Confirmed - Edit Staff Member and Edit Location; the build plan should change. (Please say where closure days are set.)
- B) No - use a separate "Schedule Settings" page in Administration instead.
- C) Something else (please explain).

**Your answer:** ____________________

## Question 3 — Can a technician have a split working day (two time ranges)? (please confirm this still stands)

**What happens now:** The current product write-up says each day starts with one working time range and an "Add hours" button adds more ranges, so a technician can have a split day (for example 8-12 and then 13-17), with a red warning and a blocked Save if two ranges overlap. Our tests are written that way. The engineering build plan stores only ONE working range per day for each technician - no second range at all.

**The question:** Please confirm the current write-up stands - a technician's day can have more than one working range in the first release - and that the build plan should change.

**Options:**

- A) Confirmed - more than one range per day, with the overlap warning; the build plan should change.
- B) No - one range per day only in the first release; "Add hours" is for later.
- C) Something else (please explain).

**Your answer:** ____________________

## Question 4 — Does the problem counter include double-bookings?

**What happens now:** The schedule flags problems like a shift outside a technician's working hours, and a counter at the top shows how many problems there are. The product write-up also counts a technician being booked on two jobs at the same time ("double-booked") as one of these problems. The engineering build plan treats double-booking as a milder heads-up only - shown on the shift itself, but not counted in that counter at the top.

**The question:** When a technician is booked on two jobs at the same time, should that show up in the problem counter and list at the top, or only as a milder warning on the shift itself?

**Options:**

- A) Yes - double-bookings count in the problem counter and list at the top.
- B) No - double-bookings are only a milder warning on the shift, not in the counter.
- C) Something else (please explain).

**Your answer:** ____________________

## Question 5 — Do meeting hours also count toward the "OT" tag and the hover breakdown?

**What happens now:** You confirmed that meeting hours DO use up a technician's time, so a 2-hour meeting makes the day's busy bar 2 hours fuller. Separately, the schedule shows a small "OT" tag on a day when one single technician goes over their own hours for that day, and a hover note that breaks the day down technician by technician. The product write-up says the day's busy bar includes meeting hours, but it does not say whether meeting hours also feed that "OT" tag and that hover breakdown - it calls the overtime signal "separate and independent".

**The question:** Should meeting hours also count toward the "OT" tag and the per-technician hover breakdown, or only toward the day's overall busy bar?

**Options:**

- A) Yes - meeting hours count everywhere: the busy bar, the "OT" tag, and the hover breakdown.
- B) No - only the day's busy bar; the "OT" tag and the hover breakdown count job shifts only.
- C) Something else (please explain).

**Your answer:** ____________________

## Question 6 — Can a meeting be created for a whole department instead of one technician?

**What happens now:** Today a meeting is placed on one named technician's row. Shops often hold a meeting (a safety briefing, a training session) for a whole department at once. The product write-up does not mention this at all, so we do not know whether to test it. Engineering's working assumption is that a whole-department meeting would NOT use up each technician's time - but that is an engineering guess, not your decision.

**The question:** Should someone be able to create a meeting for a whole department in the first release - and if yes, does it use up each of those technicians' time?

**Options:**

- A) Yes - a whole-department meeting, and it uses up each of those technicians' time.
- B) Yes - a whole-department meeting, but it does not use up their time (it is just shown on their rows).
- C) No - one technician at a time only in the first release.
- D) Something else (please explain).

**Your answer:** ____________________

## Question 7 — Can a meeting cover a whole day, and how should it show on the schedule?

**What happens now:** The meeting window has an "all day" switch, so a meeting can be set for a whole day with no start or end time. Now that meeting hours use up a technician's time, we do not know what a whole-day meeting should do - and the product write-up does not say. It also does not say where a whole-day meeting sits on the schedule, since it has no times to position it by. Engineering's working assumption is that a whole-day meeting is shown but uses up no time - again an engineering guess, not your decision.

**The question:** Should a whole-day meeting use up that technician's whole working day, or just be shown on their row without using up any time - and where should it appear?

**Options:**

- A) It uses up the whole working day, shown as a band across the top of that technician's row.
- B) It is only shown on the row and uses up no time.
- C) Something else (please explain).

**Your answer:** ____________________

## Question 8 — If a user hides meetings from the view, do those hours stop counting?

**What happens now:** There is a display switch called "Events" that shows or hides meetings on the schedule. Meeting hours now count toward each day's busy bar. The product write-up does not say what should happen to that counting when someone switches meetings off - so the busy bars could either shrink or stay the same, and we cannot tell which is correct.

**The question:** When a user hides meetings from the view, should those hours also come OUT of the day's busy bars, or should the bars keep counting them and only the meetings disappear from the screen?

**Options:**

- A) The hours come out too - the busy bars recalculate as if there were no meetings.
- B) Only the meetings disappear from the screen - the busy bars keep counting their hours.
- C) Something else (please explain).

**Your answer:** ____________________

---

## QA Internal Mapping (QA-only — not for the PO)

TestRail C-ids are from the project's `testrail-id-map.csv` (Standing Rule 8). Links: https://shopview.testrail.io/index.php?/cases/view/<id>

**Revision note (2026-07-31):** this sheet was revised against the live product spec —
Confluence page 713031682 **version 23** (2026-07-30). `requirements.md` was promoted from
v18 to v23 the same day. Sources: `spec-current-2026-07-31/SPEC-DIFF.md`,
`branko-answers-2026-07-31/answers-ingested.md`, `tech-plan-2026-07-29/TECH-PLAN-DELTAS.md`.

| Q# | Affected internal case IDs (TestRail C-id) | Source refs | What each answer resolves to |
|---|---|---|---|
| 1 | SCH-EDGE-05 ([C30089](https://shopview.testrail.io/index.php?/cases/view/30089)); SCH-SPREAD-07 ([C29983](https://shopview.testrail.io/index.php?/cases/view/29983)); SCH-SPREAD-08 ([C29984](https://shopview.testrail.io/index.php?/cases/view/29984)); SCH-SPREAD-11 ([C38863](https://shopview.testrail.io/index.php?/cases/view/38863)); SCH-API-02 ([C38873](https://shopview.testrail.io/index.php?/cases/view/38873)) | Was NQ-1 (`tech-plan-2026-07-29/Questions-for-Branko-dev.md`). **REFRAMED to a confirmation 2026-07-31:** spec §4.5 (Confluence v22, still standing in v23) = "Shop closures and public holidays are not skipped in V1.." → the spec now SIDES WITH our cases. Two counter-artefacts remain: spec §12 Edge cases still says closures "block the spread step" (**spec-internal contradiction X1**, flagged in `requirements.md`), and tech plan D7 + Phase-7 E2E build real skipping. | A (confirm) → cases stand as written; raise the §12 sentence + the build plan as corrections. B → rewrite SCH-EDGE-05 (closure = skipped + struck through in preview) + SCH-SPREAD-07 expected #3 + SCH-SPREAD-08 reason list. Verify LIVE either way (Rule 12). |
| 2 | SCH-HRS-02 ([C38847](https://shopview.testrail.io/index.php?/cases/view/38847)); SCH-HRS-03 ([C38848](https://shopview.testrail.io/index.php?/cases/view/38848)); SCH-HRS-04 ([C38849](https://shopview.testrail.io/index.php?/cases/view/38849)) | Was NQ-3. **REFRAMED to a confirmation 2026-07-31:** spec §4.2 "Hours settings" block (Confluence v19, verbatim: "a technician's custom schedule in **Edit Staff Member**, and the shop's business hours in **Edit Location**") → the spec now SIDES WITH our cases. Tech plan Phase 2 builds `ScheduleSettings.vue` in Administration + closures CRUD instead; the plan itself notes the design's Hours Settings file was an empty shell. Closure-day location is **spec-silent** — hence the sub-ask. | A (confirm) → cases stand; the build plan should change; author a closures-CRUD case once he says where closures live. B → re-home SCH-HRS-02/03/04 to the Schedule Settings page. (SCH-HRS-01/C38846 was merged into SCH-HRS-02 + deleted in the 2026-07-31 consolidation.) |
| 3 | SCH-HRS-05 ([C38850](https://shopview.testrail.io/index.php?/cases/view/38850)); SCH-HRS-06 ([C38851](https://shopview.testrail.io/index.php?/cases/view/38851)) | Was NQ-4. **REFRAMED to a confirmation 2026-07-31:** spec §4.2 verbatim "'Add hours' appends more **to support split shifts**, each removable" + the overlap-validation paragraph (Confluence v19) → the spec now SIDES WITH our cases. Tech plan §3 `staff_working_hours` = one `start_minute`/`end_minute` per weekday, unique (staff, workplace, day) — no split ranges. | A (confirm) → cases stand; the build plan's data model must change. B → retire/park SCH-HRS-05/06 (pending authorization, Rule 6). (SCH-HRS-07/C38852 was merged into SCH-HRS-06 + deleted in the 2026-07-31 consolidation.) |
| 4 | SCH-CONF-01 ([C30023](https://shopview.testrail.io/index.php?/cases/view/30023)); SCH-CONF-05 ([C30027](https://shopview.testrail.io/index.php?/cases/view/30027)) | Was NQ-2 — **UNCHANGED, still a genuine open choice.** Spec §4.11 conflict-type table lists "Double-booked" (unchanged in v23); tech plan D4 = double-booking is an FE soft warning, "not a hard conflict per the locked definition", BE detector covers outside-window/closure/non-working only. Not settled by v23. | A → cases stand. B → rewrite SCH-CONF-01 expected #3/#4 (icon yes, pill no) and adjust SCH-CONF-05's count basis. |
| 5 | SCH-CAP-03 ([C30032](https://shopview.testrail.io/index.php?/cases/view/30032)); SCH-CAP-04 ([C30033](https://shopview.testrail.io/index.php?/cases/view/30033)) | **NEW 2026-07-31** (internal id **A1**) — opened by Branko's own events→capacity answer. Spec §4.12 (v19) includes event time in the aggregate total but calls overtime "a separate per-technician signal, and the two are independent" and never says whether event hours feed the OT test or the per-tech hover breakdown. **Spec silent** (Rule 15). Could also be answered by dev. | A → assert event hours in the OT tag + hover breakdown on SCH-CAP-03/04. B → assert shift-hours-only on both. Until answered, both cases assert only what IS pinned (neither outcome). |
| 6 | SCH-CAP-01 ([C30030](https://shopview.testrail.io/index.php?/cases/view/30030)); SCH-CAP-02 ([C30031](https://shopview.testrail.io/index.php?/cases/view/30031)); SCH-CAP-03 ([C30032](https://shopview.testrail.io/index.php?/cases/view/30032)); SCH-CAP-04 ([C30033](https://shopview.testrail.io/index.php?/cases/view/30033)); SCH-EVT-08 ([C30615](https://shopview.testrail.io/index.php?/cases/view/30615)) | **NEW 2026-07-31** (internal id **A2**). Department-level events are **not in the spec at all** (§4.10 Events + §8 Event entity are per-technician: `rowKey` (tech)). The tech plan's working default is "department-assigned events do NOT count toward capacity" — an engineering default, not a product ruling. | A → author a department-event capacity case + extend SCH-CAP-01..04. B → author a department-event display-only case. C → no case; confirm the UI offers no department option at VIU. |
| 7 | SCH-EVT-08 ([C30615](https://shopview.testrail.io/index.php?/cases/view/30615)); SCH-EVT-03 ([C30018](https://shopview.testrail.io/index.php?/cases/view/30018)) | **NEW 2026-07-31** (internal id **A3**). Spec §4.10 gives the Event modal an "all-day toggle" and §8 gives Event an `allDay` field, but nothing says what an unbounded all-day event does to capacity or where it renders. **Spec silent.** Tech plan working default = "visual only". | A → author an all-day-event capacity case (full working day consumed) + a render-position expectation. B → assert display-only, zero capacity, on SCH-EVT-08. |
| 8 | SCH-VIEW-05 ([C30046](https://shopview.testrail.io/index.php?/cases/view/30046)) | **NEW 2026-07-31** (internal id **A7**, found in the Rule-28 sweep). Only became a question once events started consuming capacity (v19). Spec §9 View Options "Events" toggle says only "Shows non-WO event blocks on the grid" — silent on the capacity consequence. **Spec silent.** | A → SCH-VIEW-05 also asserts the capacity bars recalculate. B → SCH-VIEW-05 asserts the bars are unchanged. Today it deliberately asserts only "event blocks disappear from the grid while shifts remain" — neither outcome. |

### ANSWERED 2026-07-31 — REMOVED from the reader-facing sheet, NEVER ASK AGAIN

Both were on this sheet as re-asks (its old Q6 and Q7) of the 2026-07-27 sheet's Q1/Q2.
Branko answered them on the **2026-07-27** sheet, returned 2026-07-31. Verbatim source of
record: `branko-answers-2026-07-31/answers-ingested.md`.

| Was Q# | Internal ID | Question | Branko's VERBATIM answer (2026-07-31) | Status |
|---|---|---|---|---|
| old Q6 | **D1** | Do calendar events use up a technician's time? | > "**A)** §4.12 PRD is explicit: "Event time is included in the utilization total alongside shifts, so meetings and training consume capacity." A 2-hour meeting consumes 2 hours of capacity. Note the split in §4.11: events count toward capacity but are not conflict-checked. The design and the written plan already agree; this only needs confirming, not deciding." | **ANSWERED — option A.** HOLD LIFTS; **reverses** his earlier "No". Corroborated by Confluence v19 §4.12 word-for-word. Affected: SCH-EVT-08 (C30615), SCH-CAP-01..04 (C30030–C30033), SCH-CONF-01 (C30023). Follow-ons became reader-facing Q5/Q6/Q7/Q8 above. |
| old Q7 | **D4** | Should the shift pop-up have a 'Reassign' button? | > "**B - No button**" | **ANSWERED — option B.** HOLD LIFTS; confirms our cases (SCH-MODAL-08 / [C30015](https://shopview.testrail.io/index.php?/cases/view/30015) already reads "Delete only, no Reassign"; SCH-REAS-01 / [C30052](https://shopview.testrail.io/index.php?/cases/view/30052) drag-only). Corroborated by Confluence **v23** deleting "and Reassign to another technician" from §4.9. **Jira SV-8695 still lists a modal Reassign action → SV-8695 is now the stale artefact; tell Branko/dev.** |

**Why this matters:** we have already asked Branko a question a source had answered. Any
question on this sheet must be checked against `branko-answers-2026-07-31/answers-ingested.md`
AND the current Confluence version before it goes out.

### RE-ROUTED TO ENGINEERING / DEV 2026-07-31 — REMOVED from the reader-facing sheet

| Was Q# | Internal ID | Question | Why it left the PO sheet | Where it went |
|---|---|---|---|---|
| old Q5 | **NQ-5** | May a technician-type user with the "own data only" setting change only their OWN shifts, while seeing everyone's? | Branko replied to the sibling backend-scope question "**I'm not sure if this question is for me Bilal.**" — and he is right: this is an enforcement/scoping question, not a product decision. Spec §14.3 rules out own-only **viewing** and is **silent on writing** (re-verified against the live v23 body). Tech plan NFR-003/§4 builds `ManageShiftVoter` own-data scoping ("cross-tech own-data violation → 403"). | **`tech-plan-2026-07-29/Questions-for-Branko-dev.md`** — logged there as needing a **dev** answer. Context case: SCH-PERM-09 ([C30082](https://shopview.testrail.io/index.php?/cases/view/30082)). A new negative case (UI + backend halves) would be authored only if the answer is "yes, scoped". |

### Other QA-side follow-ups from the 2026-07-31 answers (not questions for this sheet)

- **Week Export descoped.** Branko: "No. There is nothing about this in the PRD, not in the future requirements." → **SCH-EXP-01 ([C38853](https://shopview.testrail.io/index.php?/cases/view/38853)) is a retire candidate, HELD — AWAITING EXPLICIT USER AUTHORIZATION** (Rule 6). Nothing deleted. (SCH-EXP-02 / C38854 was already merged away + deleted in the 2026-07-31 consolidation.)
- **Cell menu, default hours, hover VIN** — all three confirmed our existing cases; no reader-facing question needed. Folded into `requirements.md` as `[PO 2026-07-31]` notes.
- **Backend-coverage scope** (old 2026-07-27 Q7) — declined by Branko, **re-routed to engineering / the QA lead**, do not re-ask him. The tech plan IS the written backend description (17 endpoints + error contract); SCH-API-01..04 ([C38872](https://shopview.testrail.io/index.php?/cases/view/38872)–[C38875](https://shopview.testrail.io/index.php?/cases/view/38875)) already exist.
- **Live verification still blocked** — Schedule has no QA branch/environment (OQ-3). Every case stays VIU-Pending; spec-, design- and PO-pinned all ≠ VIU-Verified (Rule 12).

Verify the C-ids against `build/schedule/testrail-id-map.csv` before quoting them onward.
⚠️ Known id-map gap 2026-07-31: **SCH-EXP-01 (C38853) is absent from `testrail-id-map.csv`**
because its local body is flagged Retired, yet the TestRail case is **NOT deleted** (the retire
is held). Quote C38853 from the execution log/manifest until the map is reconciled.
