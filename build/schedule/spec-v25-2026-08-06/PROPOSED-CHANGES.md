# Schedule — PROPOSED CHANGES from Confluence v25 — **STAGED, NOT EXECUTED** — 2026-08-06

> **NOTHING IN THIS FILE HAS BEEN APPLIED.** No `update_case`, no `add_case`, no `delete_case`, no
> section operation, no run write, no result. **Run 357 is Ayesha's and was read once, never written.**
> Every item below waits on the QA lead's go-ahead (Rule 6), and **Rule 11 asks first which
> process(es) he wants run on a new spec version** before any of it is applied.
>
> **Summary: 4 TestRail cases would be touched · 0 new cases needed · 0 deletions · 1 local-only
> record fix.**
>
> | # | Case | Nature of the change | Driving source |
> |---|---|---|---|
> | 1 | **SCH-MODAL-04 = [C30011](https://shopview.testrail.io/index.php?/cases/view/30011)** | provenance + divergence sentence only — **the assertion does not change** | spec **v25** ratifies it |
> | 2 | **SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** | title + 2 expected items + marker — **substantive** | spec **v24** deletes the requirement |
> | 3 | **SCH-CONF-03 = [C30025](https://shopview.testrail.io/index.php?/cases/view/30025)** and **SCH-MODAL-07 = [C30014](https://shopview.testrail.io/index.php?/cases/view/30014)** | on-screen label strings — **label layer only** | **SV-8917**, fixed and deployed 12:56Z |
> | 4 | *(no TestRail write)* | correct wrong C-ids in the `SCH-START-08` retirement note | our own record defect |
> | 5 | **SCH-MODAL-05 = [C30012](https://shopview.testrail.io/index.php?/cases/view/30012)** | **proposed HOLD only, no assertion change** — deliberately parked pending **Q2** | Branko's SV-8829 ruling, ambiguous in scope |

**If applied, every touched case also gets the Rule-41 whole-case re-read and the Rule-54 provenance
re-stamp to spec version 25** — a push that corrects wording and leaves a stale provenance line is not
complete (Rule 10). The build stamp in sentence 2 is a separate matter: see §6.

---

## 1. SCH-MODAL-04 = [C30011](https://shopview.testrail.io/index.php?/cases/view/30011) — the spec caught up, so the divergence sentence is now a lie

**Driving requirement, verbatim, v25 §4.9:**

> *"Scope summary and the scheduled line(s) with **labor/status** figures."*

**Corroborated by a PO ruling 17 minutes later** — Branko on SV-8829, **2026-08-06T09:31:05Z**:

> *"I updated PRD, **for work order lines we just show estimate and status badge, there shouldn't be
> totals.**"*

**What the case says now, verbatim** (`custom_expected` items 2–3):

> *"2. Exactly the 2 scheduled lines are listed (not all 4), each showing its line number, title,
> hours, and **a status pill only**. 3. **No labor figures and no total dollar amount** appear anywhere
> in the modal."*

**→ The assertion is CORRECT and must not be touched.** The spec has moved onto it, not away from it.

**What IS now wrong is the Rule-56 divergence sentence**, which currently reads:

> *"The behaviour above follows a later product owner decision dated 22 July 2026 **rather than that
> specification's wording**, and that decision is recorded in Branko's answers, in this file: …"*

**That was true against v23 and is FALSE against v25 on the "total" half** — the spec no longer says
*total*. Under **Rule 56's honesty half**, a divergence sentence where nothing diverges *manufactures
a conflict* and is itself a defect. Leaving it also teaches the tester to distrust an expectation the
spec now backs.

**PROPOSED replacement — a confirmation, not a divergence:**

> *This is the expected behaviour as per epic SV-8685 and the Schedule specification version 25
> (§4.9, §4.4). The product owner confirmed on 6 August 2026 that work order lines show the estimate
> and the status badge and no totals, and that answer is recorded in Branko's answers, in this file:
> https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/HEAD/build/schedule/branko-answers-2026-07-31/answers-ingested.md*

**⚠️ ONE HONEST RESIDUAL, AND IT IS WHY THIS ITEM IS NOT PURELY COSMETIC.** The new spec phrase is
*"labor/**status** figures"* — **the word "labor" is still in it.** Our case says *"No **labor
figures** … appear anywhere in the modal"* while also requiring the line to show *"hours"*. **So
"labor figures" is doing two jobs in our own text**: forbidden if it means labour *money*, required if
it means labour *hours*. **The spec does not disambiguate and neither does Branko's comment**, so under
**Rule 58 this is not settled from the build or by us** — it is **Q2b** for Branko. The proposed
wording above deliberately says *"the estimate and the status badge and no totals"*, which is Branko's
own phrasing and sidesteps the ambiguous term rather than resolving it silently.

---

## 2. SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) — a deleted requirement, a closed defect, and a positive assertion we may NOT invent

**This is the substantive one.** The case currently reads (live, verbatim):

- **Title:** *"Toolbar search highlights matching blocks and **fades non-matching ones**"*
- **`custom_expected` 1:** *"Blocks that match the search are highlighted; **blocks that do not match
  fade**."*
- **`custom_expected` 3:** *"Matching blocks stay in place on the grid (**search visually filters; it
  does not remove** or rearrange)."*
- **Marker:** `AUTOMATION: READY - EXPECT FAIL (SV-8874)`, with a Rule-61 symptom block describing the
  build removing non-matching blocks.

**All three of those rest on a sentence the PRD deleted at v24**, and **SV-8874 was closed OBSOLETE
81 seconds before the deletion** on Stefan's *"per design we show only shifts/events that are matching
the search. This is a gap between PRD and design"* and Milos's *"updated the PRD"*. Full audit trail:
`SPEC-DIFF.md` §3a.

### What is provable, and what is not — the line this proposal will not cross

| | |
|---|---|
| **PROVABLE, so proposed:** the fade/highlight assertion has been **deliberately de-scoped** and must come out of the case. The EXPECT-FAIL marker must come off — the defect it names is closed, and the behaviour it predicts is no longer a failure. | ✅ |
| **NOT PROVABLE, so NOT proposed:** that *"non-matching blocks are removed"* is the new **requirement**. **The PRD is now SILENT on the visual treatment.** *"Filters grid blocks by matching against…"* is suggestive, not a specification. Stefan's *"per design"* refers to **a design we do not hold** (`DESIGN-SOURCE.md`). **Writing the build's behaviour in as the expectation is precisely what Rule 57 forbids**, and it is what cost us the five Filters waivers the QA lead caught yesterday. | ❌ |

**PROPOSED — option A (recommended): assert only what a source supports, and hold the rest.**

- **Title →** *"Toolbar search matches five fields and keeps matching work on screen"*
- **`custom_expected` →**
  > *1. The search matches all five fields: customer name, work order number, unit number, technician
  > name, and line name.*
  > *2. Blocks for work that matches the search remain visible on the grid.*
  > *3. Clearing the search restores every block to normal.*
  > *4. What happens to blocks that do NOT match is not settled yet — do not pass or fail this test on
  > that. If the non-matching shifts disappear from the grid, note it in your run comment and move on.*
- **Marker →** `AUTOMATION: HOLD - waiting on the product owner to say what happens to blocks that do not match the search`
- **Rule-56 divergence sentence →** records that the requirement *"Non-matching blocks fade; matching
  blocks highlight"* stood in the specification until **version 24 (6 August 2026)**, that it was
  **removed deliberately** when the product owner's team judged the specification to disagree with the
  design, and that **we are following the latest information**.

**Option B (only if the QA lead prefers to keep the case runnable now):** assert *"non-matching blocks
are removed from the grid"* and cite **SV-8874's comment thread** as the source rather than the PRD,
marker `AUTOMATION: READY`. **We do not recommend it:** the source would be an engineer's remark about
an unverifiable design, and the case would be asserting build behaviour with a citation dressed on
top — the exact shape of the defect the QA lead corrected yesterday.

**Either way — the owning story must be reported, not edited.** **SV-8686 still requires
fade/highlight in its Requirements AND its Acceptance Criteria** (`SPEC-DIFF.md` §3a). Under Rule 38
we do not touch another author's ticket; this needs telling to Branko/dev so the story stops
contradicting the PRD. It is **Q1**.

---

## 3. SCH-CONF-03 = [C30025](https://shopview.testrail.io/index.php?/cases/view/30025) and SCH-MODAL-07 = [C30014](https://shopview.testrail.io/index.php?/cases/view/30014) — label layer, from SV-8917

**Not a requirement change** — §4.11 gives conflict *descriptions*, never the on-screen strings
(`DESIGN-SOURCE.md` §2). This is **Rule 9 label work**, and **Rule 60(b) layer 1**, which a redeploy
genuinely does invalidate.

**Source, verbatim** — Stefan Vukovic on SV-8917, **2026-08-06T13:03:11Z**: *"Fixed and deployed to
sv8685.qa. "Starts before working hours" → "Starts before business hours", and the same for "Extends
past …" … the conflicts popover, the block's accessible name, the hover card and the shift modal all
changed together."*

| Case | Current text (verbatim) | Proposed |
|---|---|---|
| **SCH-CONF-03 = [C30025](https://shopview.testrail.io/index.php?/cases/view/30025)** | *"1. … a reason sentence **in the spirit of 'Starts before working hours'**, measured against that technician's own configured working hours"* · *"2. … **in the spirit of 'Extends past working hours'**"* | *'Starts before **business** hours'* and *'Extends past **business** hours'*. **Keep the "in the spirit of" hedge** — it is why this case was not simply wrong before, and the spec still does not pin the string. |
| **SCH-MODAL-07 = [C30014](https://shopview.testrail.io/index.php?/cases/view/30014)** | Rule-61 symptom block: *"On a shift whose reason is 'Double-booked with ...', **'Extends past working hours'** or 'Not …'"* | *'Extends past **business** hours'*. **'Not a working day' stays exactly as it is** — Stefan says he left it deliberately, because it names the DAY, not the hours. |

**⚠️ HONEST LIMIT, and it is why this section is proposed rather than asserted: we have NOT seen the
new labels on screen.** The application is SSO-walled in this pass (`api/auth/me/fe-permissions` →
**HTTP 401**), and `quick-login` / `switch-user` were deliberately not called because they rotate the
shared session and would sign a sibling worker out. **So this is ticket-sourced, not live-verified**
(Rules 12/49). **Recommendation: apply it with the next live pass**, when the strings can be read off
the screen, rather than as a blind write now — a label written from a ticket is still a label we have
not seen.

**Also do NOT sweep the other "working hours" mentions.** 13 of our cases contain the phrase; **most
are correct and must not change** — they refer to the per-technician *setting*, which Stefan
explicitly left alone (*"the spread dialog's 'this technician's working hours' messages — those mean
the per-technician setting, which Settings → Staff also calls working hours"*). **Only the two
conflict-label quotations above are stale.** A find-and-replace here would break more than it fixed.

---

## 4. Local-only: the `SCH-START-08` retirement note cites the wrong C-ids

**No TestRail write.** The note lives in the case source's `viu_status` field
(`build/schedule/cases/*.json`). It reads, verbatim:

> *"Retired - CUT (usefulness audit 2026-07-31, user-authorized): duplicate sweep. Its steps literally
> re-run the entry-point cases SCH-START-01 (**C29954**), SCH-START-02 (**C29955**), SCH-START-03
> (**C29956**), SCH-START-04 (**C29957**) and SCH-START-05 (**C29958**) …"*

**The internal IDs are right; every C-id is wrong.** C29954–C29958 are **SCH-LINE-07** and
**SCH-DND-01..04**. The real ones are **SCH-START-01 = C29969 · -02 = C29970 · -03 = C29971 ·
-04 = C29972 · -05 = C29973**. **Proposed:** correct the five C-ids in place and note the correction.
**Reported rather than silently fixed** because it is a Rule-8 failure inside an audit record, and the
record of the error is worth as much as the fix. The coverage conclusion is unaffected — see
`COVERAGE-REDERIVATION.md`.

---

## 5. SCH-MODAL-05 = [C30012](https://shopview.testrail.io/index.php?/cases/view/30012) — the one I am deliberately NOT changing

**This is the highest-risk item in the pass, and the proposal is to park it.**

The case asserts, verbatim: *"1. **The estimated hours field is editable directly in the modal.**
2. The new value persists after closing and re-opening. 3. Dependent displays (progress vs estimate)
reflect the new value."* Marker: **`AUTOMATION: READY`** — we expect it to **pass**.

**Branko ruled the opposite on 2026-08-06T09:31:05Z:** *"**Estimated badge should not be clickable,
you can change time only in the input fields above.**"* — and he closed **SV-8829**, which reported the
build does not allow the edit, as **OBSOLETE**, i.e. the build is right. **As it stands, this case
would fail a build the PO considers correct.**

**Why it is NOT being flipped:**

1. **The ruling's scope is ambiguous.** He says *"the Estimated **badge**"*. SV-8829's own steps
   distinguish two things: the **line row's** badge (*"only 1h and an Authorized badge"*) and the
   **modal-level** *"Estimated hours with inline edit"*. Whether the ruling kills the modal field or
   only the line badge **cannot be read out of the sentence**.
2. **Rule 58 forbids settling that from the build.** The build not allowing it is exactly the evidence
   we may not use.
3. **Two written sources still say the case is right:** **v25 §4.9 still reads *"Estimated hours with
   inline edit."*** — v25 did **not** touch it — and **SV-8695 still lists it**. Flipping a case off two
   live written sources onto one ambiguous comment would be **this morning's Filters defect in
   reverse**, where two cases were flipped off a PO ruling onto older spec text.

**PROPOSED, minimal and reversible:**

- **assertion unchanged**;
- **marker →** `AUTOMATION: HOLD - waiting on the product owner to confirm whether estimated hours can still be edited in the shift window`;
- **a plain tester line:** *"The product owner said on 6 August 2026 that the estimate badge should not
  be clickable and that the time is changed in the fields above. It is not yet clear whether that also
  covers this field, so do not raise a bug either way — tell the QA lead what you see."*

That is **Q2**, and it is the single most valuable answer available from Branko today: it is the
difference between a case that passes and a case that fails on the same build.

---

## 6. What is deliberately NOT proposed

| Not proposed | Why |
|---|---|
| **Any re-stamp of the build marker (Rule 54 sentence 2) on any case** | The build has moved to **`v3.5-d64ba62`** and **we observed no behaviour on it**. Writing a new build date would claim a check we did not make (Rule 12). The existing per-case stamps naming `v3.5-7ec992f` / `v3.5-d122eef` are **honest history** and stay. |
| **Any flip of a verdict, pass, fail or deviation** | Nothing was observed live. This is a document-side pass and says so. |
| **Closing or adding a row to the Rule-49 queue** | No row was re-verified, so none may be closed (Rule 49's close condition is 100% re-verified, unchanged). |
| **Any new case** | The spec diff produced **0** genuine new-case needs. The only external candidate, **SV-8916**, has **no established source** — the PO says the button is not in the design (`DESIGN-SOURCE.md` §2). |
| **Any deletion or retirement** | `delete_case` is irreversible and nothing here earns it. The 27 July-retired internal IDs remain **never-reuse**. |
| **Editing SV-8686, SV-8695, SV-8874, SV-8829 or any of Sasha's three tickets** | Rule 38 — another author's ticket is theirs. The two stale stories are **reported** as Q1, not corrected by us. |
| **Sweeping the other 11 "working hours" cases** | Stefan deliberately left the per-technician wording alone; changing it would introduce errors. §3. |

---

## OUTSTANDING — what I need from you

| What I need | Why it matters | Blocks |
|---|---|---|
| **Go-ahead to apply §1 (C30011) and §4 (local record fix)** — the two lowest-risk items; §1 is a stale sentence the spec has already overtaken. | A divergence sentence that no longer diverges is a defect under Rule 56. | 1 case + 1 local record |
| **A choice between option A and option B for §2 (C30041)** — I recommend **A**. | Option B would write build behaviour in as an expectation. | 1 case, and the EXPECT-FAIL marker on it is currently wrong either way |
| **Branko's answers to Q1 and Q2** (`QUESTIONS-FOR-BRANKO.md`) | Q2 decides whether C30012 passes or fails; Q1 decides what C30041 should assert. | 2 cases |
| **A decision on §3 timing** — apply the label change blind now, or with the next live pass (recommended). | We have not seen the strings. | 2 cases |
