# OUTSTANDING ITEMS REGISTER — everything we are waiting on, across every project

> **This is the single cross-project list of what is missing.** Governed by **Standing Rule 36**
> ("Always remind the user of everything OUTSTANDING for each project").
>
> **READ THIS** before writing any project status report, management deliverable or progress
> update — every one of those must END with an **"OUTSTANDING — what I need from you"** section
> for that project (and must say *"nothing outstanding"* explicitly if that is true, never omit
> the section).
>
> **UPDATE THIS** the moment an item is raised or cleared — same turn, no exceptions. Items are
> removed **only when genuinely satisfied**; a satisfied item moves to **§7 Recently cleared** with
> the date and how it was satisfied, so nothing quietly disappears and nothing gets re-asked.
>
> **Why this exists:** the end goal is **100% authentic test cases**. Most of our remaining
> authenticity gaps are not our own work — they are inputs we are waiting on. A missing epic means
> Rule-20 ticket traceability cannot be satisfied at all. An unanswered PO question means a case
> stays hedged instead of asserted. A missing QA branch means **nothing is live-verified** and a
> whole suite sits VIU-Pending.

**Last updated:** 2026-07-31
**Active projects:** Report Suite · Schedule · Filters (user ruling 2026-07-27)
**Predecessor snapshot (kept for the record):** `build/PROJECTS-NEEDS-2026-07-27.md`
**Companion retrospective:** `build/LESSONS-2026-07-31.md` — what went wrong on 2026-07-31, what it
cost, and the five standing rules (**40–44**) that now prevent each. Several items in this register
are the *asks* those lessons generated (a spec correction from Chris, one live WIP observation).

**Categories used in the tables:** `SOURCE` (a spec, epic, design, tech plan or promised artefact
we do not have) · `QUESTION` (asked, not answered) · `GO-AHEAD` (your authorization needed before
we may write anything) · `ACCESS` (a login, branch, token or connected account) · `DECISION`
(something you or the QA lead held or deferred) · `OTHER TEAM` (a PO, dev or Jira artefact someone
else owes).

---

## THE SHORT VERSION — one line per project

| Project | The single thing I most need from you |
|---|---|
| **Report Suite** | **The QA branch/environment** — all **474** cases are still VIU-Pending and not one has been checked against the real build. |
| **Schedule** | **Send Branko the 8-question sheet** (it is written and ready) — and the QA branch, for the same reason as above. |
| **Filters** | **Tell us whether a Jira epic exists for Filters, or that it genuinely is not ticketed** — without it, none of the 110 cases can cite a ticket. |
| **Cross-project** | **A ruling on "Simple Flow V2" (SV-8683)** — it is Open with 7 children against a project we have marked COMPLETED. |

---

## 1. REPORT SUITE — PO: Chris Ward · Epic **SV-8582** · **ours: 474 active cases, all VIU-Pending** (live folder total 479 — the other 5 are Vladimir Tomovic's automation cases, hands-off per Standing Rule 38)

| Item | Category | Who owes it | What it blocks | Outstanding since |
|---|---|---|---|---|
| **QA branch / environment + feature-flag state.** We know the build branch name (`project/reports-suite-bravo`) but have no URL to log in to and no confirmation the reports are switched on. | ACCESS | **You** (to get it from engineering) | **The whole suite is unverified.** All 474 cases are `VIU-Pending`; every on-screen label taken from a spec is still only "spec-said", not "build-shows" (Rules 12/22). This is the single biggest authenticity gap on the project. | 2026-07-22 (first authoring) |
| **8 spec-text corrections Chris still owes**, headed by the **WIP asset identifier**. He told us on 2026-07-29 he had already edited it; the live spec re-pull on 2026-07-31 shows §4 / S4-R7 / S4-R8 / S4-R9 / S7-R4 **still unit-number-first**. Our WIP cases follow his later answer, so spec and cases are out of step. The other open items are SPEC-WATCH **4, 6, 8, 9, 10, 11**. | OTHER TEAM | **Chris Ward** (PO) | Our cases are currently *more* current than his spec. Anyone auditing us against the written spec will read a mismatch as our error. Two of the items (**4** = location filter hidden, **9** = "Sales Representative" labels) now **actively contradict** rulings he gave us afterwards. | 2026-07-28 (SPEC-WATCH opened); deadline 2026-08-04 **partly met** — the changelog landed, these did not |
| **The sheet is now WRITTEN — 5 questions, ready to send: `build/report-suite/PO-Questions-Chris-ReportSuite-2026-07-31.md`/`.xlsx`.** Q1 his own Sales-By-Rep description contradicts itself on the download columns · Q2 will the seven outstanding description corrections land (incl. the WIP identifier) · Q3 where the location column sits in the two shorter Summary downloads (written down nowhere) · Q4 "the same logo treatment" — three reports describe three different rules · Q5 does "normal reports access" mean ONE reports permission or the existing per-area ones. **Two of the three items previously listed here were WITHDRAWN as already answered** — the "Rep is active?" header and the Assignments file name are both covered by his 2026-07-31 Q5 = A ("slang, let's do representative everywhere"), quoted in the sheet's QA-only withdrawn appendix. | QUESTION | **Chris Ward** — **you only need to send it** | Q1/Q4 are live self-contradictions in his own descriptions that will keep confusing every reader; Q3 leaves 5 export cases hedged; Q5 leaves the two parts reports' permission wording approximate. Nothing is guessed (Rule 32). | 2026-07-31 |
| **PO ACTION LIST written 2026-07-31 (companion to the sheet above): `build/report-suite/What-We-Need-From-Chris-Ward-2026-07-31.md`/`.docx`** — the same asks as an action list rather than a questionnaire: **5 decisions** (the sheet's Q1/Q3/Q4/Q5 + one new: does the on-screen label stay "VIN" for non-vehicle assets, a concern **he raised himself** 2026-07-29 and never settled) + **7 write-it-down items** (WIP identifier · location-filter notes · "Representative" labels · export cap + message · **the Escape spec line** · nav-group/"only report"/mojibake · the TU Column Selection ticket). Reader-facing part is machine-checked jargon-free (0 case IDs, 0 anchors, 0 versions); QA-only appendix carries the item→C-id map. | QUESTION | **You to send · Chris to act** | **Decide whether to send this INSTEAD OF or ALONGSIDE the question sheet** — they overlap by design and sending both risks him answering only one. Suggested: send the action list, attach the sheet for the four A/B answers. | 2026-07-31 |
| ~~**The SBR staff-dialog Escape-key question.**~~ **CORRECTED 2026-07-31 — this row was WRONG: Chris ANSWERED it on 2026-07-28, verbatim "B."** (= Esc must NOT dismiss; `chris-answers-2026-07-28/answers-ingested.md` Q1), and **SBR-DEACT-04 = C30255** ([link](https://shopview.testrail.io/index.php?/cases/view/30255)) **already matches his ruling**. **DO NOT RE-ASK IT.** What genuinely remains is only his SPEC EDIT — the live SBR capture (2026-07-31) still has `S13-R8` dismissing *"on Cancel, X, or Escape"*, and SV-8599 still carries *"surface as decision"*. It is now a write-it-down item (**item 10** of `What-We-Need-From-Chris-Ward-2026-07-31`), not a question. The same stale claim also appears in `PO-Questions-Chris-ReportSuite-2026-07-31.md` ("open 4 days") and `DELIBERATE-DECISIONS.md` D6 — both were written earlier the same day and are flagged there. | OTHER TEAM (was QUESTION) | **Chris Ward** — spec text only | Nothing in our suite: the case is aligned to his ruling. The spec line will keep re-generating this confusion for every reader, and dev is still treating it as open. | Question raised 2026-07-27 · **answered 2026-07-28** · spec edit outstanding since 2026-07-28 |
| **The permission dev-change ticket needs filing.** Chris ruled every report is gated by the ordinary reports permission, but the build ships a dedicated `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` atom. We changed the cases to his ruling, so they will **fail on purpose** against today's build. Draft is ready: `chris-answers-2026-07-31/Q4-permission-dev-note-2026-07-31.md`. | OTHER TEAM | **Dev / you** (raise it against SV-8582) | 3 cases (**SBC-PERM-01 = C30098**, **SBC-PERM-02 = C30099**, **SBC-NAV-01 = C30096**) are deliberately ahead of the build. Without a ticket, a tester will report them as our bug. | 2026-07-31 |
| **The TU spec's new Story 10 (Column Selection) has no Jira ticket.** | OTHER TEAM | **Chris Ward / dev** | **TU-COL-01 = C38859** and **TU-LOC-06 = C38915** cannot cite a story key — Rule 20 traceability is incomplete for them. | 2026-07-31 |
| **Go-ahead to push 2 new cases.** `PV-PREC-01` + `PV-PREC-02` (the SV-8589 QuickBooks / part-of-a-unit precision gap) are authored locally with **blank C-ids** — they need an authorized `add_case` plus a **run-359 resync** (Rule 34). | GO-AHEAD | **You** | 2 real coverage gaps exist only on our disk. They are not in TestRail, so no tester will ever run them. | 2026-07-31 |
| ~~**Go-ahead for a title-trim pass** (288 of 474 titles over 80 characters).~~ **CLEARED 2026-07-31 — this row was STALE.** Re-measured from the live case bodies on 2026-07-31: **0 of 474 titles exceed 80 characters** (longest is exactly 80). The trim was completed in the closing authenticity pass earlier the same day; the row had not been retired. **Do not chase this.** | GO-AHEAD | — **closed** | Nothing. Kept visible rather than deleted so the ask is provably discharged, not silently dropped. | Raised 2026-07-28 · **cleared 2026-07-31** |
| ~~**Designs — confirm none exist.**~~ **CLEARED 2026-07-31 — already answered by Chris on 2026-07-28**, verbatim: *"B -- currently the best is my kickoff video that's pinned in the chat … I'm going to film a much more condensed click-through tonight"* (`chris-answers-2026-07-28/answers-ingested.md` Q3) — i.e. **no pictures or mock-ups exist; the two videos ARE the visual reference**, and we have both (kickoff + the companion delivered 2026-07-30). **Do not re-ask.** Confirmed absent independently: 0 attachments on the epic and all 97 stories, no Figma. | SOURCE | — **closed** | Nothing. Visual detail the videos do not pin stays "confirm in the build", which the QA-branch row above covers. | Raised 2026-07-22 · **answered 2026-07-28 · row cleared 2026-07-31** |
| **Suite-wide logo inconsistency** found by our own sweep: TU says the bundled ShopView default always, SBC has a three-step chain ending in *no logo*, PV has no logo requirement at all — yet Chris promised "same logo treatment all reports". | OTHER TEAM | **Chris Ward** | Flagged, no case changed. Export-header cases across three reports cannot all be right. | 2026-07-31 |
| **5 foreign cases sit in our Report Suite folder — author Vladimir Tomovic** (C38919–C38923, created 2026-07-30, all **Automated**, all with **no References**), confirmed automation coverage. Live folder total is **479 = ours 474 + his 5**; they are in **no run**. **YOUR RULING 2026-07-31: do NOT message Vladimir** — no note, no question. The file is retained marked **NOT SENT** (`build/qa-team-responses-2026-07-31/Note-to-Vladimir-automation-overlap.md`). **What his cases established, for the record:** his **C38923 was CORRECT** and exposed a real defect on OUR side (see the next row); his **C38922** raises a build-conformance question (the row after that). Overlap read otherwise unchanged: C38920 duplicates **PV-FILT-14 = C38914**; C38922 duplicates **WIP-EXP-02 = C30511** + **WIP-EXP-07 = C30516**; C38919 bundles **TU-COL-01 = C38859** + **TU-EXP-04 = C30437**; C38921 is genuine new coverage. | DECISION (settled) | — **closed by your ruling** | **Nothing outstanding on Vlad.** His cases stay untouched forever (Standing Rule 38). Listed here so the ask is visibly discharged, not forgotten. | Raised 2026-07-31 · **ruled 2026-07-31** |
| **ONE SPEC CORRECTION FROM CHRIS — SBR v15 contradicts itself on the CSV headers.** His own new **`S14-R20`** (2026-07-29) says the Location column is *"included in all four exports in the same position it occupies on screen"*, but **`S14-R15`** (Summary CSV) and **`S14-R16`** (Expanded CSV) still enumerate their header lists *"in order"* **without it**. **OUR SIDE IS NOW DONE (2026-07-31, user-authorized):** the export cases follow the newer `S14-R20` — SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285), SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286), SBR-EXP-03 = [C30278](https://shopview.testrail.io/index.php?/cases/view/30278), SBR-EXP-04 = [C30279](https://shopview.testrail.io/index.php?/cases/view/30279) pushed and verified. It is now **Q1 of the 2026-07-31 sheet**. | OTHER TEAM | **Chris Ward** (PO) | **Blocks nothing** — `S14-R20` is newer and wins (Rule 32) and our cases match it. But the contradiction sits live in the spec and will keep re-generating this confusion for every reader. | 2026-07-31 |
| **ONE LIVE OBSERVATION OWED — is `Location` listed in the WIP Column Selection menu?** Our **WIP-FLT-09 = [C38916](https://shopview.testrail.io/index.php?/cases/view/38916)** says it is **not offered** there, grounded three times over in WIP spec **v6** (2026-07-29): `S4-R3` *"not offered in the column selector"*, `S7-R13` *"the user does not toggle it in the column selector"*, and the §3 Key Decision *"automatic, not a manual toggle"* (corroborated by **C30466** + **C30467**). Vladimir's **C38922** step 3 nonetheless **toggles Location on** in that menu, and its title says *"exactly as shipped"* — so the shipped build may still allow it. | ACCESS (needs the QA branch) | **You** (env + fresh cookies + flag state) | **One observation settles it:** with more than one location in scope, is `Location` in the picker? If it is, this is a **build-conformance finding** ("v6's automatic-visibility change has not shipped yet") — **not** an edit to either case. **Our case stands unchanged meanwhile** (Rules 32/33), and per your ruling we are **not asking Vladimir**, so the live check is now the only way to close it. | 2026-07-31 |
| **NOTHING outstanding on requirement coverage** — recorded so it is not re-asked. A full **coverage re-derivation from the six CURRENT descriptions** (2026-07-31) enumerated **895 requirements** and found **888 covered · 6 genuine gaps, all closed · 0 stale or invented references**. The 6 gaps were all one thing: the *export* half of the new per-row Location column. Closed as **extensions, 0 new cases**; 33 `update_case` pushed and verified; run 359 untouched (474/474 tests, 539/539 results). The 7 requirements with no case are deliberate and each has a written reason. Evidence: `build/report-suite/coverage-rederivation-2026-07-31/`. | DECISION (settled) | — **closed** | **Nothing.** Listed so the completeness question has a citable answer if a QA challenges it. | Raised + closed 2026-07-31 |

**In one line:** *Get us the QA branch so 474 cases stop being theoretical — and send Chris the action list: 5 decisions and 7 description edits, led by the WIP identifier fix (due 2026-08-04). The Escape-key item is NOT a question — he answered it 2026-07-28.*

---

## 2. SCHEDULE — PO: Branko · Epic **SV-8685** · **165 active cases, all VIU-Pending**

| Item | Category | Who owes it | What it blocks | Outstanding since |
|---|---|---|---|---|
| **The 8-question Branko sheet is written and READY TO SEND — it has not been sent.** `PO-Questions-Branko-Schedule-TechPlan_2026-07-30.md`/`.xlsx`: **3 confirmations** (shop-closure days on a multi-day job · where working hours live · split working days), **1 genuine open choice** (does the problem counter include double-bookings), **4 new** (do meeting hours feed the OT tag and hover breakdown · department-wide meetings · all-day meetings · does hiding meetings take their hours back out of the capacity bars). | QUESTION | **You to send · Branko to answer** | 8 behaviours are asserted from the spec alone or deliberately left un-asserted. The 4 new ones came out of his own last answer and the spec is silent on all four — we refused to guess (Rule 32). | 2026-07-27 (first version); revised and re-armed 2026-07-31 |
| **QA branch / environment + feature-flag state (OQ-3).** | ACCESS | **You** | All 165 cases are `VIU-Pending`; ~18 on-screen labels are still design-pinned rather than build-confirmed. **Design-pinned is NOT verified** (Rule 12). | 2026-07-21 |
| **The own-data write-scoping question needs an ENGINEERING answer, not a PO answer.** Branko replied *"I'm not sure if this question is for me Bilal."* — and he is right. Re-routed to dev in `tech-plan-2026-07-29/Questions-for-Branko-dev.md`. **No case was authored for it**; the adjacent case **C30082** covers only the read side. | QUESTION | **Dev / engineering** (via you) | A real backend-scoping behaviour has **no test case at all**. We will not author one against a guess. | 2026-07-31 |
| **Jira SV-8695 is stale versus spec v23.** The story still lists a modal **Reassign** action; Confluence v23 (2026-07-30) deleted it and Branko answered *"B — No button"*. Our cases are already correct (**SCH-MODAL-08 = C30015**, "Delete only"). | OTHER TEAM | **Branko / dev** (we do not edit Jira) | Nothing in our suite — but the Jira story now contradicts both the spec and our cases, so it will be cited against us. | 2026-07-31 |
| **Spec-internal contradiction X1 needs Branko.** §4.5 says shop closures are **not** skipped in V1; §12 still says closures **block** the spread step. Both sentences are live in v23. | OTHER TEAM | **Branko** | This is now spec-vs-spec, not spec-vs-us. It makes the closures confirmation question (sheet Q1) more valuable, not less. | 2026-07-31 |
| **Doc hygiene for Branko — 3 spec sentences now contradict his own rulings:** (a) live v23 **§9** still ties the tooltip VIN to the "VIN Number" toggle, contradicting §4.13 and his Q6 answer; (b) **§4.9** still says the shift pop-up lists the lines **"with labor/total figures"**, but he ruled 2026-07-22 (Q3) that no money appears there — our cases follow the ruling (**C30011** shift pop-up = no money fields; **C38874** API = no pricing in any response); (c) **§14.1** still lists a **"right-click context menu"** among the editing controls, after he ruled 2026-07-31 "there is no right click, only left click". | OTHER TEAM | **Branko** | Nothing blocked — resolved for our cases by his rulings (Rule 33). Each mismatch is a future re-review cost and will be cited against us. | (a) 2026-07-31 · (b) + (c) surfaced 2026-07-31 by the coverage re-derivation |
| **Go-ahead: the now-empty TestRail section 5406 "Week Export and Printing".** The Week Export case (C38853) was retired with your authorization; the section is empty but deliberately **not deleted**. | GO-AHEAD | **You** | Nothing blocked — an empty folder in the tree. Wants one authorized cleanup op. | 2026-07-31 |
| **Go-ahead: one latent import defect.** `SCH-HRS-04` precondition 1 leaves a stray `(/02)` in the pushed text because `clean()` strips only the ID, not the whole bracket. | GO-AHEAD | **You** | One case reads slightly oddly to a tester. Needs a code fix in `gen_import.py` **plus** an authorized `update_case`. | 2026-07-31 |
| **A5 — what "New Work Order" actually does** (a toast versus opening the WO window) is still unresolved. | QUESTION | **Branko** | **SCH-REAS-06 = C38855** passes either way, so impact is low — but it is an unresolved behaviour we should not forget. | 2026-07-31 |
| **A6 — migration heads-up for product** (not a question, an FYI you may want to pass on): now that events count toward capacity, roughly **9,684** migrated legacy events will raise capacity bars at cutover. Expected, not a bug. | DECISION | **Product** (informational) | Nothing. Recorded so nobody reports it as a defect on day one. | 2026-07-31 |

**In one line:** *Send Branko the 8 questions that are already written, and get us the QA branch.*

---

## 3. FILTERS — PO: Branko · **NO EPIC EXISTS** · **110 active cases, all live in TestRail, all VIU-Pending**

| Item | Category | Who owes it | What it blocks | Outstanding since |
|---|---|---|---|---|
| **There is no Jira epic for Filters at all.** This is **proven absence, not a failed lookup** — all **170** SV epics were enumerated on 2026-07-31 and none is Filters (`build/epic-recheck-2026-07-31/FILTERS-EPIC-SEARCH.md`). | SOURCE | **You / Branko** — give the key, or confirm the work genuinely is not ticketed | **The worst authenticity gap we have.** **Rule 20 requires every case to cite a ticket AND a spec anchor. With no ticket anywhere, all 110 cases can only ever cite the spec** — half the traceability requirement is unsatisfiable until we know. | 2026-07-17 (first flagged as "ask at VIU"); **proven absent 2026-07-31** |
| **QA branch / environment (OQ-3).** | ACCESS | **You** | All 110 cases `VIU-Pending`; **nothing has ever been checked against a running build.** | 2026-07-17 |
| **The 8-question Branko sheet is written and awaiting answers** — `PO-Questions-Branko-Filters-TechPlan_2026-07-30.md` (revised 2026-07-31, the 2026-07-30 version was never sent): mobile Apply-button behaviour · which tab opens first · the Parts **Vendors** page filters · sorting the WO list · which details the in-page search box looks at · **a request for his latest written description** · page search versus the pop-up search · six newer filter buttons never shown opened. | QUESTION | **You to send · Branko to answer** | Several behaviours stay hedged. The **Vendors-page hedge in FLT-PARTS-01 deliberately survives** because there is no Vendors design to read it from. | 2026-07-30 (revised 2026-07-31) |
| **Q1 of the earlier sheet came back completely BLANK** — the numbered per-page write-up for the Parts and Reports filters. We recorded it as unanswered rather than inferring "A" (Rule 32(iii)). His Q4 answer pointed at the PRD, but the live v1.6 PRD we pulled has **not one `S#-R#` anchor for any Parts view or any report**. | SOURCE + QUESTION | **Branko** | **12 Parts/Reports cases** were written from the designs alone. Their behaviour is design-derived, not spec-derived — genuinely weaker traceability than the rest of the suite. | **2026-07-27 — 4 days** |
| **12 of 85 Figma design boards still have no rendered PNG** (Figma's image endpoint rate-limits at ~10 h). Queue: `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md`, **auto-retrying under Rule 35 — no authorization needed**. All 12 are already described from their node trees, so nothing is guessed. | SOURCE | **Us** (automatic) — **but you must re-supply the Figma token on a fresh container** (`/tmp` is wiped) | Layout/spacing/colour confirmation for 12 boards. The **Filters design pass may not be reported complete** while this queue is OPEN (Rule 35). | 2026-07-30 |
| **The searchable-field list the spec itself cannot supply.** `S13-R23` is marked *"Pending — QA has no baseline"* **in the PRD**, and 5 client-side surfaces have no field list at all. | SOURCE | **Branko / engineering** | **No per-page "searching X finds Y" case was invented** — we refused to make one up. That coverage simply does not exist yet. | 2026-07-17 |
| **Go-ahead HELD: the 19-case dropdown merges (MG1 / MG2 / MG5 / MG6).** They rest on our audit's own **not-live-verified** assumption that the five filter dropdowns are one shared component. | DECISION | **You** — and it genuinely needs the QA branch first | 19 cases stay as they are. Correctly held: merging on an unverified assumption could delete real coverage. | 2026-07-31 |
| **Go-ahead: 39 over-80-character title trims.** Worst: **FLT-TAB-02 = C29609** (179 chars), **FLT-TAB-03 = C29610** (177), **FLT-PERS-02 = C29614** (151), **FLT-COLL-04 = C29604** (128). | GO-AHEAD | **You** | Titles truncate badly in TestRail. | 2026-07-31 |
| **Go-ahead: 3 optional under-merge findings (MG16 / MG17 / MG18) + 2 unapplied fixes (F2, F3).** Not authorized this pass. | GO-AHEAD | **You** | Small consolidation and 2 wording/refs repairs. | 2026-07-31 |
| **PRD-alignment asks for Branko:** the PRD's "hidden" Status-chip prose (6 places) still contradicts his own Q4=B answer; Story 12 versus the mobile "All Filters" / "Apply filters" sheet; **FLT-TAB-06 = C38876**'s Estimates default tab is absent from v1.6. | OTHER TEAM | **Branko** | Cases stand on his rulings; the PRD text needs to catch up. | 2026-07-31 |

**In one line:** *Confirm whether Filters has a Jira epic (or genuinely has no ticket at all) — that one answer decides whether 110 cases can ever be fully traceable.*

---

## 4. CROSS-PROJECT — items that do not belong to one project

| Item | Category | Who owes it | What it blocks | Outstanding since |
|---|---|---|---|---|
| **"Simple Flow V2" — epic SV-8683 is Open with 7 children, against a project we marked COMPLETED.** Milos linked it to SV-7301 on 2026-07-27, the same day he closed SV-7301. **3 of the 7 are already Done** (shipped behaviour changes touching Simple Flow surfaces we have cases for: SV-8497, SV-8581, SV-8680), 1 is Ready-to-Fix (SV-8495), and 2 are net-new enhancement stories (SV-8726 rename "Total Price" → "Total Cost"; SV-8734 Bulk Approve/Decline WO lines). **Nothing was ingested or authored.** | DECISION | **QA lead / you** | If Simple Flow reopens, its 189 cases need a reconciliation pass against 7 stories. If it stays closed, 3 already-shipped changes may silently invalidate existing cases. **This needs a yes/no, not analysis.** | 2026-07-31 |
| **A decision on TestRail run 278 "Custom Permissions"** — 9 active cases are missing from it and it holds **3,521 graded results**. Custom Roles is an **active recurring** project, so the "leave completed runs alone" ruling does not cover it, and you have not ruled. Left untouched. | GO-AHEAD | **You** | 9 cases are invisible to whoever runs 278 — the same false-coverage-gap problem that triggered Rule 34. We will not touch a run with 3,521 graded results without an explicit instruction. | 2026-07-31 |
| **Fabian's sell-price bug ticket key.** The 3 corrective Simple Flow cases are in TestRail with a **placeholder** ref: *"Fabian 2026-07-29 sell-price concern (ticket TBD)"* — **SF-RCV-14 = C38860**, **SF-RCV-15 = C38861**, **SF-VPART-08 = C38862**. | OTHER TEAM | **Fabian / you** (file it or send the key) | 3 cases fail Rule 20 on the ticket half of their traceability until the real key replaces the placeholder. | 2026-07-29 |
| **Live VIU of those same 3 sell-price cases** — needs fresh staging cookies. | ACCESS | **You** | 3 cases are `VIU-Pending` on a project otherwise finished. | 2026-07-29 |
| **Tech plans (Rule 30) — status check, not a gap right now.** All three active projects have one and it has been reconciled (`build/*/tech-plan-2026-07-29/`, plus the 2026-07-30 Filters/Report Suite/Schedule passes). **Nothing outstanding** — listed here so the Rule-30 reminder is visibly discharged rather than forgotten. | SOURCE | — | Nothing. | — |

**In one line:** *One yes/no on Simple Flow V2 (SV-8683), and one on run 278.*

---

## 5. PAUSED / COMPLETED PROJECTS — one line each

| Project | Status | Outstanding, if it is ever resumed |
|---|---|---|
| **Global Search v2** | **POSTPONED** (2026-07-27) | **Epic key still unknown** — the 2026-07-31 sweep found no epic matching the v2 PRD; the only candidates (SV-3770, SV-1495 archived) are not claimed as the project's epic. Also OQ-3 (AI/"ask a question" scope) and no QA env. 86 cases authored, **never pushed to TestRail** (still awaiting permission). Note: the 9 retired Filters palette cases were parked here — and this project is paused, so that coverage is **parked, not running**. |
| **Custom Roles** | **ACTIVE but recurring-only** | **SV-8541 is spec-intended / pending PM.** Standing duty: re-run the permission regression **after every release**, not just on a cadence. SV-8412 ("Sales Representative \| Global Search allows catalog access") is in Code Review under SV-8406. Plus the run-278 decision in §4. |
| **Simple Flow** | **COMPLETED** (2026-07-27) | The SV-8683 V2 decision and the Fabian ticket key, both in §4. 21 Blocked-Env cases remain (QuickBooks not connected; dev-seeded core needed) and 5 questions to Milos were never answered — all frozen with the project. |
| **Fees & Discounts** | **COMPLETED** (2026-07-27) | 21 Blocked-Env cases frozen (a QuickBooks-connected company and a flag-off org were never available). Jira epic SV-7387 is at *Ready for Production*. Nothing being asked of you. |

---

## 6. HOW TO USE THIS FILE IN A REPORT

Copy the project's rows into an **"OUTSTANDING — what I need from you"** section at the END of the
report, in plain language (Rule 7), each item saying: *what is missing · who owes it · what it
blocks · since when.* Lead with the project's one-liner. **If a project genuinely has nothing
outstanding, write "Nothing outstanding" — do not drop the section.**

Before you write the section, sweep all six categories rather than repeating this file from
memory, because items go stale fast in a multi-worker session:

1. **Missing sources** — spec/PRD stale or unshared, no epic, designs missing or a Rule-35 fetch queue OPEN, tech plan not supplied (Rule 30), a promised video/changelog not delivered.
2. **Unanswered questions** — to a PO or to dev; name the sheet + question number, who owes it, and how long it has been outstanding.
3. **Missing go-aheads** — TestRail pushes, retirements, merges, deletions, run syncs, title trims (Rule 6: nothing moves without them).
4. **Access / credentials** — staging or prod cookies, Atlassian access, Figma token, a QuickBooks-connected company, a QA branch + flag state.
5. **Deferred or HELD decisions** — anything marked HELD, PENDING or "your call".
6. **What another team owes** — a PO's spec correction, a dev fix, a missing ticket key, a stale Jira story.

---

## 7. RECENTLY CLEARED — so nothing is re-asked

Items are moved here (not deleted) when genuinely satisfied. *"We have already embarrassed
ourselves once by asking a question a source had already answered."*

| Item | Project | How it was satisfied | Cleared |
|---|---|---|---|
| **Ownership of the 9 page-search / command-palette cases** | Filters | **Branko Q6 = A**: *"Test it under Global Search, not here."* Corroborated three ways (spec v1.6 has no palette requirement; the Filters Figma file has no palette board). The conditional user ruling *"do not delete unless Branko confirms"* therefore **resolved to retire** — FLT-SRCH-01…09 retired locally; none had ever been in TestRail, so nothing was deleted. **Thread CLOSED.** | 2026-07-31 |
| **Schedule: the 75/79 over-80-character titles** | Schedule | Verified **done** — live check 2026-07-31 found **0 of 165** titles over 80 characters (pushed in the closing authenticity pass). Go-ahead no longer needed. | 2026-07-31 |
| **Schedule: "is anything missing from coverage?"** | Schedule | Answered by the **coverage re-derivation vs spec v23** (`build/schedule/coverage-rederivation-2026-07-31/`): 243 statements enumerated, **3 genuine gaps found and closed** (1 new case **C38926** + 1 extension **C29961**), reverse check clean, run 357 synced 164 → 165 with all 429 results intact. | 2026-07-31 |
| **Schedule: the two long-HELD items** — D1 events-count-toward-capacity, D4 modal "Reassign" | Schedule | Branko answered both (events **do** consume capacity; **no** Reassign button). Spec v23 backs him. | 2026-07-31 |
| **Schedule: the Week Export retire (C38853)** | Schedule | You authorized *"Retire from test cases and test run"* — `delete_case` HTTP 200, re-GET confirms gone, run 357 165 → 164 with all 429 results intact. | 2026-07-31 |
| **Report Suite: Chris's 5 TechPlan answers** | Report Suite | All five answered = option A (location dropdown hidden · one suite-wide too-large message · 10,000-row cap on all six · ordinary reports permission · "Sales Representative" in full). 70 cases updated + 7 added, all pushed. | 2026-07-31 |
| **Report Suite: the promised spec changelog** | Report Suite | It landed — all six specs moved on 2026-07-29 with dated Change Log rows (SBC v11→12, SBR v14→15, PV v3→4, TU v4→5, WIP v5→6, IV v2→3). Deadline 2026-08-04 **partly** met: the changelog arrived, but 6 of his 12 promised edits did not (still open in §1). | 2026-07-31 |
| **Report Suite: the promised companion video** | Report Suite | Chris delivered the Loom on 2026-07-30; transcript ingested, 3 firm deltas pushed. | 2026-07-30 |
| **Schedule + Report Suite: epic keys** | both | Schedule = **SV-8685** (15 stories), Report Suite = **SV-8582** (97 stories). Both re-verified current on 2026-07-31. | 2026-07-27 / 2026-07-31 |
| **Schedule: designs "missing"** | Schedule | Not missing — the Claude prototype `Schedule.dc.html` is authoritative (Branko Q0). OQ-4 resolved. | 2026-07-22 |
| **Report Suite: the SV-8589 QuickBooks / fractional coverage gap** | Report Suite | 2 cases authored (PV-PREC-01/02). **Partially cleared only** — they still need your go-ahead to reach TestRail (see §1). | 2026-07-31 |
