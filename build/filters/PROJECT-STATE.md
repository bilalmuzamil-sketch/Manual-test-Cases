# Filters (Work Order List Filtering) — PROJECT STATE
**Canonical cold-resume doc. Read this first to resume the Filters project.**

---


## §0-RUN-SYNC-2026-08-05 — run 352 checked and ALREADY COMPLETE; nothing was written

**Paper: `build/testrail-run-sync-2026-08-05/`.**

The QA lead authorised a run sync across the three active projects. **Run 352 was checked and needed
nothing: 110 of 110 of our cases are already in it**, proven by **set equality in both directions**
(nothing live is missing from the run, nothing in the run is absent from group 4110). **No
`update_run` was called.**

**Proven untouched, not merely asserted:** re-read after the sibling write to run 359 and diffed
against the committed pre-write snapshot — **110 tests, all result records present BY ID and
byte-identical field for field, 0 graded-field changes, 0 new results, 0 movement on the declared
`case_title` / `case_refs` echoes** (expected — this pass made no case writes).

**⚠️ ONE NUMBER TO CORRECT: run 352 now holds 443 result records, not the 438 recorded earlier
today.** Ahtasham Amjad has graded **five more** since that figure was taken and he was working in
the run during this pass. Nothing of his was disturbed — all 443 verified byte-identical — but it is
a live run, which is exactly why snapshot → union → verify is not optional.

**Four counts reconcile: live 110 · run 352 = 110 · id-map 110 · import 110.** **No foreign cases
exist in group 4110** — all 110 are `created_by = 3` (ours), re-confirmed live this pass.

**⚠️ `include_all` is `false`, so the run freezes at its current selection** — re-run the sync after
any authorised `add_case` (Rules 34/47). Note this bites here if the **9 retired FLT-SRCH palette
cases** ever land as Global Search coverage, or if any Parts/Reports authoring follows Branko's PRD.

---

## §0-FINAL-VIU-2026-08-05 — THE CANONICAL RESUME POINT (read this first)

**Resume order:** `expected-behaviour-audit-2026-08-05.md` → `final-viu-2026-08-05/FINDINGS.md` →
`final-viu-2026-08-05/testrail-execution-log.md` → `READINESS-2026-08-05.md` (banner first).

### What happened, in one paragraph

The QA lead found that **FLT-BAR-01 = C29557** stated what the build does instead of what the
specification requires, and asked whether the fault was systemic. **It was, in five cases.** An audit of
**all 110** classified every case — **A=5 build-derived over a documented requirement · B=0 spec silent ·
C=104 legitimate · D=1 over-specified** — and it was committed **before** any repair so the evidence
stands alone. Separately, a fresh QA sign-in arrived, so **the eight phone cases were finally observed on
the running app** after two passes could not reach it. **All 110 cases were then rewritten in one write
each, every one byte-verified.**

### The five that were wrong, and what they said

Each carried *"Known and accepted: … The product behaves this way **on purpose for now. Do not raise this
as a new problem.**"* over a requirement the specification states plainly. **Nothing supported "on
purpose".** The tickets behind them had been *closed*, and a closed ticket is a decision about whether to
fix — never an amendment to the specification.

| Case | Requirement it waived |
|---|---|
| FLT-BAR-01 [C29557](https://shopview.testrail.io/index.php?/cases/view/29557) | **S1-R1** — the bar is displayed **below** the tab row |
| FLT-COLL-02 [C29602](https://shopview.testrail.io/index.php?/cases/view/29602) | **S1-R5** — the table expands into the reclaimed space |
| FLT-EMPTY-01 [C29606](https://shopview.testrail.io/index.php?/cases/view/29606) | **S8-R3** — the message names the filters **and the search** |
| FLT-EMPTY-02 [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | **S8-R4 / S8-R5** — clear the query as well, independently |
| FLT-PSRCH-09 [C38899](https://shopview.testrail.io/index.php?/cases/view/38899) | **S8-R4** — and the paragraph was about a screen **this case does not test**; it had been pasted onto a debounce case |

**Class B is zero**, so every one had a documented requirement to return to and **none needs Branko**.

**Two findings the QA lead should see:** **SV-8843 and SV-8847 were closed OBSOLETE under our own shared
account** (Bilal Muzamil, 4 Aug 21:41:31 and 22:02:41 −0500) — his triage, indistinguishable from ours in
the changelog. And **Ahtasham raised [SV-8876](https://shopview.atlassian.net/browse/SV-8876) at 06:17
today saying the same thing**, quoting C29557's waiver note: *"a test case has waived it without the PRD
being updated"*. **He found it before we did.** Untouched (Rule 38); it is Branko's question.

### The steps-VIU'd-but-expectation-altered sweep

Asked for separately. **26 commits replayed**, comparing steps against the **assertion body only**
(provenance, marker, HTML and numbering stripped). **16 cases had both change together; 14 are legitimate
label work** (*"funnel icon"* → *"filter icon"*, *"Search customer"* → *"Search"*, hedges becoming
assertions because Branko answered) **and 2 are genuine reversals, both driven by a document**: C38882 by
Confluence v18 published the previous evening, and C29609/C29610 by S9-R2/S9-R3 superseding Branko's own
17 July answer. **The five waivers were NOT camouflaged** — the steps text is byte-identical across the
commit that introduced each one. **The tell to reuse: if the new expectation cannot be quoted back to a
document, the case has been disarmed.**

### The phone cases — settled

Observed at **390 × 844 with touch**. **The combined "All Filters" sheet defers correctly** (ticking two
statuses fired **zero** list requests and left the address bar untouched; the button then applied both).
**A single filter's own sheet does not** — tapping *Paid* changed the address bar at once, the sheet
closed, and **there is no Apply button anywhere in the document**. Covered by **SV-8875**, so nothing was
filed. **THE BUTTON'S EXACT LABEL IS `Apply Filters` — CAPITAL F**, `data-test-id="apply_filters"`, while
the specification writes *"Apply filters"*.

### Three closed tickets that still reproduce

- **SV-8843** — measured: tabs y81–121, filter bar y86–116, **flex siblings in one row**. The bar is
  beside the tabs. **But its own claim "collapsing frees no space" is WRONG** — collapsing moved the
  table top y184 → y144 and hid all five chips, so **S1-R5 passes** and only C29557 is the deviation.
- **SV-8847** — both halves reproduce. **One thing passes:** pressing Clear Filters leaves the search in
  place, exactly as S8-R5 requires.
- **SV-8845** — **still reproduces and worse than reported: on a phone EVERY filter link is ignored and
  `filters[0][value]=estimate` is sent instead** (proven on declined, paid and imported), while the chips
  read *"Status (1)"*. The same link on desktop correctly returned 7 Declined rows. **Closed OBSOLETE by
  Ahtasham this morning. Not reopened — the QA lead's call. Our recommendation: this is the one worth
  reopening.**

### Numbers

**MARKERS, read back from live: `READY` 82 + `READY - EXPECT FAIL` 18 + `HOLD` 10 = 110.**
**READY-TO-AUTOMATE = 100** (was 93: +8 phone cases observed, −1 for C38882 correctly moving to HOLD).
The arithmetic gate holds.

**110 `update_case`, every one HTTP 200 + byte-verified MATCH, 28 fields compared each, 0 mismatches.**
0 add / 0 delete / 0 section / **0 run writes**. **No test result was logged anywhere.**

**RUN 352 PROVEN UNDAMAGED** — `include_all` still false, 110 tests, test-id and case_id sets equal both
directions, **438 result records before and after with 0 missing BY ID**, counters unchanged at 36 Passed
/ 2 Failed. **The only field that moved is `case_refs` on 10 records**, traced to exactly C29609 and
C29610, the only two cases whose `refs` we edited — a **derived read-time echo**, the same class as the
declared `case_title` echo. No graded field moved on any of the 438. Ahtasham logged nothing during the
write window.

**FOUR COUNTS: live 110 · local active 110 · id-map 110 · import 110, set-equal BOTH directions.** id-map
0 blanks, refs 110/110, header byte-identical, refs and titles byte-equal to live 110/110. Shredding
guard **PASSED** and independently re-checked (0 rows carry the signature). Import header sha256
identical to **all five** peer imports.

### A NEW TESTRAIL NORMALISATION — worth putting in the playbook

**`update_case` re-renders any TEXT field you OMIT from the payload through TestRail's HTML pipeline** —
it wrapped `custom_preconds` and `custom_steps` in `<p>` and turned `\n` into `\r\n` on the very first
write. **A field sent explicitly is stored verbatim.** This matters here because **this project shows
markup literally to the tester**. The byte-check caught it on case 1 of 110, **the batch stopped as Rule
50 requires**, the two fields were restored byte-exact, and every later payload carried all three text
fields. **Belongs in `build/APP-ACTIONS-PLAYBOOK.md` §J — not edited from this worker, flagged instead.**

### Honest limits

- **29 of the 110 were driven live this pass**, not all 110. The other **81** carry forward from the
  04:20–04:53Z re-check **on the same build marker**, and each says so in `FINDINGS.md`.
- **The branch is NOT declared final**, so **every verdict is PROVISIONAL** and
  `final-viu-2026-08-05/RECHECK-QUEUE.md` is **OPEN**.

### Queue status

- `cleanup-2026-08-05/RECHECK-QUEUE.md` — **CLOSED**, all 8 phone rows observed.
- `cleanup-2026-08-05/PENDING-LIVE-CHECK.md` — **CLOSED**, the check was run.
- `recheck-2026-08-05/RECHECK-QUEUE.md` — banner-marked SUPERSEDED, **still OPEN** (branch not final).
- `final-viu-2026-08-05/RECHECK-QUEUE.md` — **OPEN**, the live queue.

### Outstanding

1. **Reopen SV-8845?** Our recommendation is yes. QA lead's call.
2. **Branko owes an answer on SV-8876** — the PRD, the design and the build disagree on where the bar sits.
3. **A second test login** for FLT-PERS-03 C29615 — the only genuinely un-settable case.
4. **The branch declared final**, to close the Rule-49 queue.
5. **The playbook §J note** on the omitted-field re-render, from a worker that owns that file.
6. **Branko's Parts/Reports PRD** — 8 cases HOLD on absent product; the QA lead ruled *"lets wait for
   Brankos PRD"*, so no new Parts/Reports coverage was authored.

## 0-MARKERS-2026-08-05. **AUTOMATION MARKERS WRITTEN — 102 of 110 cases. NEWEST STATE.**

**Read this first.** Source: `build/automation-markers-2026-08-05/` —
`{BUILD-MARKERS,testrail-execution-log-filters,RUN-PROOF,SV-8825-ANSWERED,SCHEDULE-HALTED}.md`.

The QA lead asked for one machine-findable line per case telling the automation engineer whether to
automate it. It sits at the **very end of Expected Results, after the provenance line**, with a blank
line before it and a line break after it (his wording, followed exactly).

| | |
|---|---|
| Build confirmed at the start | **`v3.4.2-d00239b`** · last-modified **Tue, 04 Aug 2026 22:51:02 GMT** · etag `b9ab1d41718b5e871432064ed914e2e7` — **byte-identical on all three markers to the build the 110 verdicts were measured on**, so nothing moved under us |
| Cases written | **102 of 110** · `update_case` only · **0** add · **0** delete · **0** section · **0 run writes** |
| Markers | **74 `AUTOMATION: READY`** · **19 `AUTOMATION: READY - EXPECT FAIL (<ticket>)`** · **9 `AUTOMATION: HOLD - <reason>`** (8 not-built + 1 needing a second test login) |
| Arithmetic check | **READY + READY-EXPECT-FAIL = 93 = the readiness report's ready-to-automate figure.** PASSED |
| Verification | every op **HTTP 200 + byte-verified MATCH, 30 fields compared each**; **0 collateral changes**; the whole body before the marker proven byte-identical. `refs` **not written on any op**, so the comma-normalisation exception did not arise |
| Runs 352 + 357 | **PROVEN UNTOUCHED both times** — 110/165 tests, **427/429** result records, `case_id` sets equal **both** ways, **every prior result present BY ID and byte-identical field by field**, 0 new results |
| Provenance lines | **NOT re-stamped** — the verdicts were not re-observed in this pass, so changing the tested-on date would have been a false claim (Rule 12) |

**⚠️ THE 8 PHONE CASES WERE DELIBERATELY NOT WRITTEN — and this is the most important thing on this
page.** **Branko ANSWERED and CLOSED [SV-8825](https://shopview.atlassian.net/browse/SV-8825) at
2026-08-05T05:18:22Z** — *"This is updated in the filters prd, I'm closing it."* — **28 minutes after
`READINESS-2026-08-05.md` was finished saying the question was still open with zero comments.** Spec
**v18** now rules it plainly (§4 Key Decisions + **S12-R6**: mobile *"does not filter in real time…
the table updates only when the user taps an 'Apply filters' button"*, and *"This confirms intent"*).
So FLT-MOB-01/02/03/04/05/06/07/10 (C29621–C29627, C29630) are **no longer waiting on the product
owner**, their existing *"waiting on an answer… the question is open as SV-8825"* line is **now
false**, and their verdict is **unknown** — the build applies as you tap, which now contradicts a
ratified requirement. **Needs one authorised pass:** correct the 8, raise one Low defect on epic
SV-8785 with story SV-8797 linked, set their markers to READY-EXPECT-FAIL. **That would take the
ready figure from 93 to 101 of 110.** Full write-up: `automation-markers-2026-08-05/SV-8825-ANSWERED.md`.

**Deliverables re-verified:** local source re-synced **FROM LIVE first** (exactly **102** `expected`
fields moved — matching the 102 writes and nothing else); shredding guard **PASSED**; the import
differs from its previous version in **one column, 102 rows, only by the appended marker**; **all four
counts = 110 and set-equal both directions** (live / local source / id-map / import rows); the id-map
came back **byte-identical** after the re-merge (**0 blanks, refs 110/110**); import header **sha256
identical to all 5 peer imports**. **⚠️ Rule-49 queue still OPEN — the branch is not declared final,
so all 110 verdicts remain PROVISIONAL.**

**Two things found wrong in our own data, reported not silently fixed:** (1) the GitHub links inside
the case provenance lines point at **`bmuzamil-shopview/Manual-test-Cases`, which does not resolve
(HTTP 403)** — the repository is `bilalmuzamil-sketch/Manual-test-Cases`; (2) **10 cases show raw
`<ol>`/`<li>` markup to the tester** (C29557, C29560, C29566, C29568, C29573, C29575, C29582, C29613,
C29625, C38911) — this **predates this pass** (same 10 in the pre-write snapshot).

---

## 0-RECHECK-2026-08-05. **THE FULL RULE-49 RE-CHECK AGAINST THE REBUILT BRANCH — DONE. 110/110.**

**Read this first — it is the newest state.** Sources:
`build/filters/recheck-2026-08-05/{FINDINGS,RECHECK-QUEUE,testrail-execution-log,FILED,SOURCE-CURRENCY,BUILD-MARKER}.md`
and `build/filters/READINESS-2026-08-05.md`.

| | |
|---|---|
| Build re-checked against | **`v3.4.2-d00239b`** · `index.html` last-modified **Tue, 04 Aug 2026 22:51:02 GMT** · etag `b9ab1d41718b5e871432064ed914e2e7` · read at **03:38 / 04:30 / 04:42 UTC — identical all three times, so no redeploy under us** |
| Previous build | `v3.4.2-4f8211c` — **gone** |
| Rows re-checked | **110 of 110, no sampling.** **91 CONFIRMED · 19 CHANGED** |
| Operations | **110 × `update_case`** · **0** add · **0** delete · **0** section · **0 run writes** |
| Verification | **every one HTTP 200 + byte-verified MATCH, 28 fields compared each**; every field not intended to change proven byte-identical to its pre-write snapshot (Rule 50) |
| Provenance | **110/110 now name `v3.4.2-d00239b` and the 5 August date, exactly once each.** 0 cases name the old build; 0 doubled lines |
| Run 352 | **PROVEN UNTOUCHED, before and after** — 110 tests, **425 result records**, `case_id` sets equal both ways, **every prior result present BY ID**, and every record byte-identical field by field. **Ahtasham Amjad's 30 results (23 Passed / 7 Failed) exactly as he left them.** No `update_run` needed |
| Foreign cases | **0** in group 4110 — all 110 `created_by: 3` (Rule 38) |
| New verdict tally | **PASS 74 · DEVIATION 19 · HELD 8 · NOT BUILT 8 · held for a second sign-in 1 = 110** (was 60/32/8/9/1) |
| Ready to automate | **89 of 110** (was 88) |
| Rule-49 queue | **STILL OPEN** — engineering has not declared the branch final, so all 110 verdicts remain **PROVISIONAL** |

### The 19 that changed

| Change | Cases | Why |
|---|---|---|
| **DEVIATION → PASS, 12 cases** | FLT-STAT-03/04/05, FLT-CUST-03/05/07, FLT-TECH-03/05, FLT-ADV-03/05, FLT-ASSET-05, FLT-CHIP-01 | **SV-8824 is FIXED** — the dropdown now stays open, proven on all five buttons (second and third values tickable without reopening). Jira agrees: the ticket is **Ready for QA**. The now-false known-issue line was removed from all twelve. **This was our judgement call, applying the QA lead's own rule; flagged for his confirmation.** |
| **DEVIATION → PASS, 3 cases** | FLT-PSRCH-10/11/12 | **SV-8844 is FIXED** — no `search` key in the saved preference, no save request sent, a fresh browser returns the full 30-row list. Line **deleted outright** per the QA lead's decision 1. |
| **NOT BUILT → PASS, 1 case** | FLT-RPTS-23 [C38882] | The Reports date filter **is built** and matches the newer spec exactly. Case rewritten (title, preconditions, steps, expected, refs) scope-conditionally per Rule 42. |
| **PASS → DEVIATION, 1 case** | FLT-PERS-01 [C29613] | **New defect SV-8871** — a restored Customer/Lead Technician/Service Advisor button comes back without its value name. |
| **PASS → DEVIATION, 1 case** | FLT-PERS-04 [C29616] | **Our 4 August PASS was WRONG.** Seeded properly, the deleted customer is still applied to the table — Ahtasham's Failed result is right (SV-8832). |
| **DEVIATION, second reason added** | FLT-URL-02 [C29618] | Same label loss on the desktop shared-link route (SV-8871) on top of the phone problem (SV-8845). |

### The five tickets on the new build

**SV-8843 still reproduces** (closed OBSOLETE with the note *"Not Reproducible Anymore"* — **the
build contradicts that reason**, recorded in `provenance-2026-08-04/PO-RULING-DEFENCE.md`) ·
**SV-8844 FIXED** · **SV-8845 still reproduces** (Open) · **SV-8846 still reproduces** (Open) ·
**SV-8847 still reproduces** (closed OBSOLETE, no reason recorded). The 5 cases on SV-8843/8847
carry the QA lead's accepted-behaviour wording; the 3 on SV-8844 lost their line entirely.

### New ticket filed: [SV-8871](https://shopview.atlassian.net/browse/SV-8871)

Bug · priority **Low** · parent **SV-8785** · Product Area **Work Orders** · linked to SV-8792 and
SV-8795 · **Open**. Duplicate search run first, none found; every field read back from Jira.
**Not API-related** (fully visible on screen), so Rule 51 does not bite. **Honest limit: not
callable a regression** — the previous pass tested persistence only with the two unaffected filters.

### Other answers this pass produced

- **SV-8825 (mobile Apply button) is STILL UNANSWERED** — Open, **0 comments**, last touched
  2026-08-04 05:58. The 8 mobile cases keep their "do not automate yet" line.
- **Nothing new shipped on Parts or Reports filter bars** — observations byte-identical, so the 8
  remaining not-built cases stay not-built.
- **Spec is Confluence version 18** (2026-08-04T18:19:21Z). The page body still says
  **"Version: 1.6"** — the Rule-31(a) trap; we went by the Confluence number.
- **SV-8828 still not reproducible** on this build either. Question for Ahtasham, not a verdict.

### Deliverables regenerated

Local case source **re-synced FROM live before regenerating** (114 fields updated). Import
regenerated, **character-shredding guard PASSED**. The generator's known gotcha fired again — it
blanks the id-map C-ids **and drops the `refs` column** on every rerun — so both were re-merged from
live: **110 rows, 0 blanks, refs on all 110**. **All four counts are 110 and set-equal in both
directions** (live TestRail · local source · id-map · import rows), and the import header hashes
**identically to all four peer project imports**.

### Environment left clean

Throwaway customer *ZZAUTOTEST Filters Recheck* deleted and **proven absent two ways**. All filters
cleared; the Reports date range put back to **This month**. One sign-in, reused throughout.

---

## 0-BRANKO-EXEC. **BRANKO'S 2026-08-04 ANSWERS ARE NOW LIVE IN TESTRAIL — 12 `update_case`, EXECUTED**

**Read this first — it is the newest state.** Audit:
`build/filters/branko-answers-2026-08-04/testrail-execution-log.md`.

| | |
|---|---|
| Operations | **12 × `update_case`** · **0** add · **0** delete · **0** section · **0 run writes** |
| Verification | **every one HTTP 200 + byte-verified MATCH, 28 fields compared each**, every field not intended to change proven byte-identical (Rule 50) |
| Active cases | **110 → 110** (nothing added, nothing retired) |
| Run 352 | **PROVEN UNTOUCHED** — 110 tests (`case_id` **and** `test` id sets equal both ways) · **396 result records, every prior result present BY ID** · 1 Passed / 109 Untested · `include_all` still false |
| Foreign cases | **0** in group 4110 — all 110 `created_by: 3` (Rule 38) |
| QA branch | **NOT TOUCHED — not one request** (VIU still reserved by the QA lead until Report Suite is complete) |

### THE NEW STANDING PRACTICE THIS PASS CREATED (now Standing Rule 54 in `CLAUDE.md`)

The QA lead's ruling, verbatim: *"If Branko said this in his new file then yes, but below the expected
behavior give the file link and mention that this is coming from Branko's responses here. Anyting that
you do if that has the reference from the file only - follow the same practice."*

So **where a case's expectation rests on a named source FILE rather than the specification, the
provenance line names that file and gives its link.** **12 of 110 Filters cases now do** —
**10 citing it as the GOVERNING source** and **2 as a CONFIRMATION** of a spec-backed expectation.
The other **98 kept the ordinary line**, deliberately: a link on a case the file does not govern
manufactures false authority just as surely as omitting a source (Rule 54 honesty clause). The link
in tester-facing text is a **QA-lead-authorised exception** to Rules 7/20.

### WHAT CHANGED, CASE BY CASE

| Case | C-id | What changed |
|---|---|---|
| FLT-MOB-01/02/03/05/06/07/08 | [C29621](https://shopview.testrail.io/index.php?/cases/view/29621) · [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) · [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) · [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) · [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) · [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) · [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | new variant **`design_po_ruled`** — the design provenance is **kept** (live v1.6 contains *"Apply filters"* **0 times** and *"All Filters"* **0 times**) and *"a product owner decision is still awaited"* is replaced by his approval of **2026-08-04** + the file link. `refs` records his Q1. **Assertions unchanged.** |
| FLT-MOB-04 | [C29624](https://shopview.testrail.io/index.php?/cases/view/29624) | **the one case whose provenance got SIMPLER, and that is the honest outcome.** With no Apply button on the single-filter sheet the behaviour agrees with the spec **outright** — `S12-R3` + `S12-R2` + `S2-R6`, all re-read verbatim live — so it is now **`plain`**, with his answer cited as a **confirmation**. **`S2-R6` added to `refs`**, because that is what the assertion rests on. **Body reflowed** out of its broken paste markup (`<li data-pasted="true">`, four steps on one line): title/steps/preconditions/expected, **assertions unchanged**. |
| FLT-TAB-06 | [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | new variant **`po_ruling_no_anchor`** — `po_ruling` would imply the spec covers the default tab (**it does not**: swept live for *default tab*, *Estimates tab*, *last-used*, *remembered*, *first visit*), and `no_anchor` would credit engineering for a **product** decision. Both halves now true in one sentence. `refs`: *"confirmation requested"* → his Q2 ruling. |
| FLT-PARTS-01 | [C38904](https://shopview.testrail.io/index.php?/cases/view/38904) | **the false Vendors hedge REMOVED** (§below). |
| FLT-PARTS-13 · FLT-RPTS-22 | [C38908](https://shopview.testrail.io/index.php?/cases/view/38908) · [C38911](https://shopview.testrail.io/index.php?/cases/view/38911) | the two **optional** operations were **DONE**, because his **Q8** is load-bearing for both. **C38911 deliberately KEEPS its 2026-07-31 date** — Q8 confirms only that *no option list exists*, not the multi-select/no-Apply behaviour — so its citation is **confirming**, not governing. |

### THE VENDORS FINDING — engineering's reading was wrong, and I checked it myself

Branko: *"Disign for vendors exists in figma. Check it"*. Read as **pixels**,
`design-2026-07-31/frames/Parts-Explorations-20.4.2026__Vendors__11903-10461.png` shows page title
**Vendors**, the **Vendors** nav item highlighted **below a separate "Vendor Invoices" item**, a
**New Vendor** button, vendor columns (Name / Telephone / Email / Address / City / State-Province /
Zip), and **exactly two filter chips: `Vendor` and `State/Province`**.

**So the claim recorded in that case's own notes — that node `11903:10461` is Vendor Invoices and
that Vendors filters would not be built until a design was delivered — is WRONG.** Three sources
agree against it: **PRD v1.6 §2** (which lists Vendors among the Parts views that get a filter bar),
the **design board**, and the **PO**. **HONEST CONSEQUENCE, and it is the QA lead's to accept: this
case can now legitimately FAIL if the build has not shipped the Vendors filter bar** — the correct
outcome, because under Rule 45 the hedge was a **false all-clear** that would have let a genuinely
missing filter bar pass.

### TWO FINDINGS THE RULE-41 WHOLE-CASE RE-READ PRODUCED (recorded, not quietly fixed)

1. **The staged plan had MISSED its own headline edit.** The first build of this pass's plan
   re-stamped C38904's provenance and **left the false hedge in place** — the very thing Group C
   exists to remove. Caught by the whole-case re-read and added as operation 10.
2. **The provenance stamper was NOT idempotent on FLT-PERS-01
   ([C29613](https://shopview.testrail.io/index.php?/cases/view/29613)).** A manual TestRail edit had
   converted that case to HTML, turning `---` into `<hr />` and wrapping the sentence in `<p>`, so
   `strip_provenance()` could not see the block and **a future full re-stamp would have APPENDED A
   SECOND provenance line**. The stripper is **hardened**. **C29613 itself was NOT written** — its
   wording is word-identical and correct and Branko's answers do not touch it, so re-writing it would
   have been an unauthorised markup-only edit. **STAGED for a future authorised pass.**

### THE LOCAL SOURCE IS NOW RECONCILED TO LIVE — and this was a real trap

`build/filters/cases/*.json` feeds the import, so a stale local body can be **regenerated over the
correct live text**. Audited **all 110** local↔live pairs on **every** field:

* **1 case was genuinely drifted — FLT-MOB-04**, whose local body still asserted *"The bottom button
  reads 'Apply filter' (singular)"*, the exact opposite of Branko's ruling and of live TestRail. **Now
  reconciled to live** (live wins: it is what the tester reads and what the byte-verified push wrote).
* **1 case differs in MARKUP ONLY** — C29613, **word-level identical** (verified), left alone.
* **3 stale `notes` flags resolved** — C29624's *"CONFLICT - PENDING BRANKO/DEV"*, C38876's *"PENDING
  BRANKO … If Branko rules the default should be All, flip expected 1"*, and C38904's Vendors
  engineering claim. A note still saying PENDING after he has answered is the same false-source
  problem, one layer down.

### RECONCILING COUNTS — set equality proven BOTH directions

| Pair | Result |
|---|---|
| live TestRail group 4110 (110) ↔ id-map C-ids (110) | **EQUAL** |
| local ACTIVE cases (110) ↔ id-map internal ids (110) | **EQUAL** |
| import row titles (110) ↔ id-map titles (110) | **EQUAL** |
| live group 4110 (110) ↔ run 352 test `case_id`s (110) | **EQUAL** |

Local files hold **110 active + 36 retired = 146 authored**. Import **110** data rows; header SHA
identical to **all five** peer imports (`a82ca60c36074512`); **0** VIU words · **0** feature-flag
words · **0** duplicate titles · **0** internal-ID leaks · **0** C-id leaks · **0** blank C-ids ·
**0** blank refs · **0** titles over 80 characters (longest exactly 80).

**Rule-28 cross-case sweep: 0 contradictions introduced.** The one real risk was checked explicitly —
C29622/29623/29625 assert an *"Apply filters"* button while C29624 asserts there is **none**. **Not a
contradiction: different screens**, and each case's own route says which. C29625/26/27 all
precondition on *"The All Filters sheet is open"* (the **combined** sheet); C29624 step 1 is *"Tap the
Status chip (**not** the 'All Filters' chip)"*. All 110 carry **exactly one** provenance line (0
missing, 0 duplicated) and **0** still say *"a product owner decision is still awaited"*.

---

## 0-QA-ENV. **FILTERS HAS A QA BRANCH — ITS FIRST EVER** (supplied 2026-08-04)

**Read this alongside section 0.** This is a **facts-and-credentials record only. NO VIU has
begun, and none may begin without the QA lead's explicit go-ahead** — he has **reserved that
permission until the Report Suite is finished**. Nothing on this branch has been touched: **not
one network request has been made to it** (no login, no probe, no page load).

| Fact | Value |
|---|---|
| App URL | **`https://sv8785.qa.shopview.com`** — the filter bar lives on **`/workorders`** (the QA lead supplied `https://sv8785.qa.shopview.com/workorders`) |
| API host | **`https://sv8785api.qa.shopview.com`** — ⚠️ **INFERRED from the `sv<number>api…` naming shape, NOT VERIFIED.** Do not treat it as fact until it answers |
| Branch naming | `sv8785` matches **epic SV-8785**, consistent with `sv8582` → Report Suite SV-8582 and `sv8685` → Schedule SV-8685 (see `build/APP-ACTIONS-PLAYBOOK.md`) |
| Credentials | **SUPPLIED 2026-08-04.** They live **only** in **`/tmp/filters-viu/cookies.json`** (`chmod 600`, directory `chmod 700`) — three cookies for `.qa.shopview.com`. **No value is recorded in this repo, and none ever may be (Standing Rule 6).** `/tmp` is ephemeral, so expect to ask for a fresh set when the VIU is authorised |
| Cookie lifetime | ~**24 hours**, or until a deployment — so a fresh set is likely needed at authorisation time |
| VIU status | **NOT STARTED — awaiting the QA lead's explicit go-ahead** |

**WHY THIS MATTERS: this is the FIRST QA branch Filters has ever had.** Until an authorised VIU
runs against it, **all 110 active cases remain SPEC-VERIFIED ONLY** — nothing in this suite has
ever been observed on a running build, every case stays `VIU-Pending`, and every provenance line
stays deliberately at **Rule 54 state 1 (no build date)**. **Design-pinned and spec-pinned are
NOT verified** (Rule 12). The ~18 design-sourced on-screen labels stay unconfirmed.

**When the go-ahead comes:** ASK which process(es) to run (Rule 11), request a **fresh** cookie
set, and run the Rule-31 pre-flight on all sources first. Because the branch's finality has not
been stated either way, treat **Standing Rule 49** as live until engineering confirms otherwise —
open a `RECHECK-QUEUE.md` and record the build marker (`<meta name="app-version">`).

---

## 0. LATEST — **STANDING RULE 54 PROVENANCE RETROFIT: EXECUTED** (2026-08-04)

**Read this section first.** Folder **`build/filters/provenance-2026-08-04/`** —
`SOURCE-CURRENCY.md` · **`PO-RULING-DEFENCE.md`** (the quote-ready defence pack) ·
`STAGED-REPAIRS.md` · `testrail-execution-log.md` (per-operation) · `plan.json` ·
`exec-log.jsonl` · `snapshots/` · `tools/`.

### 🔴 THE HEADLINE: **FILTERS HAS A JIRA EPIC — SV-8785**

The single most important fact change on this project. Our long-standing *"no epic exists,
proven by enumerating all 170 SV epics"* finding was **true on 2026-07-31 and went stale
within hours**: the epic was created **2026-07-31T07:51:51-0500 = 12:51 UTC**, AFTER that
enumeration ran, and Branko linked it into the spec at 13:07 / 13:10 UTC. Found by the
Rule-31 pre-flight of this pass; **verified live** (`GET /rest/api/3/issue/SV-8785` →
HTTP 200, type **Epic**, hierarchy 1, status Open).

**Rule-37 Tier-1 check, two independent ways, no paging remainder:** `parent = SV-8785`
→ **14**; `"Epic Link" = SV-8785` → **14**; same keys. The 14 children map **1:1 by title
and in order** onto the spec's 14 stories, so **`Story n → SV-(8785 + n)`** deterministically.
**SV-8795 (Filter Persistence) and SV-8796 (URL State) are already `Ready for QA`** — the
first hint a QA environment may be near. **Nothing is live-verified yet.**

**Consequence: all 110 cases carry a REAL TICKET for the first time.** The literal
`Filters (no Jira epic)` in every `refs` field was replaced — **66** cases get their single
owning story key, **44** get the epic marked `[epic]` (cross-cutting or unanchored). The
compact `[epic]` marker is deliberate: TestRail rejects any `refs` comma-entry over 248
characters with HTTP 400, and these refs already ran to 248. Mirrored into a **NEW `refs`
column** on `testrail-id-map.csv` (110/110 populated, 0 blanks). **Rule 20 is satisfiable
for Filters for the first time.**

### What was done

All **110/110** cases now END their Expected Results with a separator line and one plain
sentence naming **epic SV-8785** and the **Filters specification version 1.6**, plus that
case's own anchors. Rule 54 **state 1 — NO build date** (no Filters QA environment exists).

### How it was verified (Rule 50)

`update_case` **ONLY** — 0 add, 0 delete, 0 section move, 0 run write. **110 cases / 111
operations, every one HTTP 200 and byte-verified MATCH, 28 fields compared per operation**;
each wrote `custom_expected` **and** `refs`, with every unintended field proven
byte-identical. `refs` compared under the **declared** TestRail normalisation (split on
comma, trim, rejoin bare comma). **Run 352 verified untouched:** 110 tests set-equal both
ways, **all 395 result records present BY ID**, `include_all` still false.

### What the Rule-41 whole-case re-read found

All 110 cold-read end-to-end against v1.6. **One real defect: FLT-MOB-04 = C29624 is
paste-corrupted** — two preconditions on one line, four steps run together, and the whole
expected result inside a stray `<li data-pasted="true">` with no `<ol>`. Its **`refs`
artefact was FIXED** in the same write (`,-,` → ` ; `). Its **BODY reflow is STAGED, NOT
EXECUTED** (`STAGED-REPAIRS.md`) because the case sits in the frozen mobile cluster and
reflowing it would restate the very assertion Branko has not ruled on. **0 other defects**
across the suite.

### Rule-28 cross-case sweep: 0 contradictions — and it caught one of ours

39 anchors are shared by 2+ cases; 0 title-vs-expected hits. It did find one coherence
issue **of our own making**: **FLT-MOB-08 = C29628** had been classified `plain`, but its
own precondition 2 reads *"at least one filter applied **via the sheet**"* — its route
depends on the same design-only screen as its six siblings. Reclassified
`plain → design_awaiting` and re-pushed. The first re-push attempt was **correctly refused
by the drift guard** (the plan's snapshot predated our own earlier write); snapshot
refreshed, re-pushed, MATCH, and confirmed live to carry **exactly one** provenance sentence.

### The honesty breakdown (Rule 54's clause)

| Variant | Cases | Which |
|---|---|---|
| **PO ruling overrides the spec text** | **4** | Status chip on Estimates/Completed: C29559, C29609, C29610, C29612 — Branko 2026-07-17 Q4=B *"Shown but greyed out, pre-filled …"* vs **five** live requirements still saying "hidden"/"not shown" (S1-N1, S2-N1, S2-N2, S9-R2, S9-R3). Risk **LOW** — the QA lead ruled 2026-07-30 that the two readings describe the same behaviour |
| **Spec covers the area in prose only; PO answers supply the detail** | **9** | Parts/Reports: C38904/05/06/07/08, C38909/10/11, C38882 — spec §7 has **no Parts story and no Reports story**, so there is not one `S#-R#` anchor for them; Branko 2026-07-31 Q2/Q3/Q5/Q7 |
| **Agreed design, spec silent/contrary, NO ruling** | **8** | mobile "All Filters" + "Apply filters": C29621–C29628. **C29622 and C29623 are HIGH risk** — S2-R6 says verbatim *"no confirm/apply button needed"*. **The ask has NEVER been sent.** If Branko rules mobile behaves like desktop, **we concede those two** |
| **No numbered requirement at all** | **2** | C38876 (default/last-used tab — **HIGH**, engineering-plan-only) · C38881 (one-off migration) |
| **Plain** | **87** | the spec supports the expectation as written |

### Two items on the QA lead's list were NOT real conflicts

1. **Permanent persistence — NO LONGER a conflict.** Branko **fixed the spec**: v1.6
   **S10-R2** now reads *"…stored server-side against the user account. They survive logout
   and sync across the user's devices … does not expire with a browser session"*. So
   **FLT-PERS-02 = C29614** and siblings agree with the spec outright and carry the **plain**
   line.
2. **The pop-up / ⌘K search ownership ruling — no case among the 110 is affected.** The nine
   `FLT-SRCH` cases it governs have **never been pushed** to TestRail. The 13 `FLT-PSRCH`
   cases *are* in TestRail but they are the **page toolbar search** (spec Story 13, 29
   numbered requirements) — a different feature, fully spec-backed.

**One group the QA lead did NOT name is the highest-risk in this suite:** the mobile
Apply-button cluster (8 cases, no ruling of any kind).

### Source currency (Rule 31)

Spec live **Confluence version 14** vs our v12 mirror — but a full body diff shows the only
change is the header link block plus the added epic link: **131 requirement anchors,
SET-EQUAL both directions, no requirement text changed**, and the body's own version line
still reads **1.6**. Designs: the Rule-35 Figma queue is **CLOSED at 85/85** (CLAUDE.md's
"OPEN NOW 73/85" preamble pointer was stale and has been corrected).

---

## 0-PRIOR. **CLOSING AUTHENTICITY PASS: EXECUTED + RECONCILED** (2026-07-31)

**Read this section first.** Everything lives in **`authenticity-2026-07-31/`**:
`TRACEABILITY-AUDIT.md` (Phase 2) · `RULE28-THREE-DIMENSION-AUDIT.md` (Phase 4) ·
`traceability-per-case.csv` · `rule28-per-case-verdicts.csv` · `title-trims.csv` ·
`testrail-sync-manifest-2026-07-31.md` (**EXECUTED**) ·
`testrail-execution-log-2026-07-31.md` (per-op) · `pre-write-snapshot/` +
`post-push-verify/` · scripts `phase1_fix_defects.py`, `phase2_repair_refs.py`,
`phase3_trim_titles.py`, `phase4_repairs.py`, `phase4_sense_repairs.py`,
`sweep_2b_closing.py`, `gen_rule28_verdicts.py`, `exec_push_2026-07-31.py`,
`reconcile_2026-07-31.py`.

### Counts — unchanged in size, changed in quality
**146 authored → 110 ACTIVE / 36 Retired.** Live under group **4110 = 110**; id-map
**110 rows / 110 C-ids / 0 blank**; import **110 rows**; run **352 = 110 tests, 395
result records (untouched)**. All three reconcile **equal both ways**. Every case is
still **VIU-Pending** — **no live-build check was possible: Filters still has no QA
branch/env** (Rules 12/22).

### What was done
1. **The 3 known pre-existing defects fixed** (flagged 2026-07-31 but outside that
   pass's authorization): **FLT-STAT-07 = C38877** and **FLT-API-06 = C38895** stale
   `spec v1.3` refs re-pointed to the ratified v1.6 anchors (S2-R7/S2-N4 and
   S10-R2/S10-R3); **FLT-EMPTY-02 = C29607** internal-id leak removed from References.
   All three re-read live after the push.
2. **Traceability audit of all 110** → **80 of 110 refs were defective**: 76 cited the
   **V1.0 `requirements.md`** ingest (8 Confluence versions stale), 2 cited spec v1.3, 1
   leaked an internal id, 1 had no anchor statement. **All repaired.** Valid-in-v1.6
   anchors **30 → 100**; the other 10 are 9 verified v1.6 prose sections (Parts/Reports
   have no numbered requirements) + 1 declared "no requirement exists". **0 anchors point
   at a requirement v1.6 removed** (it removed none). All 4 changed requirements
   (S8-R3/S8-R4/S10-R2/S12-R4) re-read against every citing case.
3. **THE TICKET SITUATION, on the record:** **Filters has no Jira epic and no stories** —
   170 SV epics enumerated, SV-4913 ruled out (`build/epic-recheck-2026-07-31/`). A ticket
   key **does not exist** and **none was invented**; the ticket half now reads
   **`Filters (no Jira epic)`** (same 22 chars as the old misleading `Epic key TBD`).
   Spec-anchor-only is the **maximum achievable** here — an **UPSTREAM** gap, not an
   authoring gap.
4. **Titles: 37 over 80 chars → 0** (longest was 179). 6 more re-worded for vocabulary
   drift/plainness ("malformed" → "broken"). Longest active title now **80**. No
   distinguishing detail lost — each removed phrase was confirmed present in that case's
   steps/expected.
5. **Rule-28 three-dimension re-verify of all 110:** **80 KEEP / 26 MERGE (held) / 3
   WEAK-KEEP / 1 CUT (held)** · **108 SENSIBLE + 2 FIX-WORDING both repaired in-pass → 0
   NONSENSE** · **110/110 genuine + layman-runnable**. Based on a **cold read of all 110
   full bodies (83,699 chars)**. Stage-2b sweep = **1,959 assertions, 0 failures**;
   **5 contradictions found, 5 resolved, 0 unresolved**. Palette-cluster contradiction
   **confirmed still CLOSED** (0 active Command-K cases; all 9 FLT-SRCH still Retired and
   still out of the id-map).
6. **TestRail: 110 `update_case`, ALL HTTP 200, ALL re-GET verified MATCH, 0 failures.**
   0 add, 0 delete, 0 section ops, **0 run/result writes**. Fields: refs ×110, title ×40,
   `custom_steps` ×1 (C38891), `custom_expected` ×1 (C29621). Pre-write `get_case`
   snapshot per case. Run 352 verified equal both ways before and after; **395 results
   preserved**.

### STILL OPEN after this pass
- **NEW follow-up — a markup-only anomaly on 7 cases.** In TestRail
  **C29557, C29560, C29566, C29568, C29573, C29575, C29582** store
  Preconditions/Steps/Expected as **HTML `<ol><li>`** while the other 103 store the
  house-standard plain numbered lines. **Content is byte-identical** (machine-verified on
  all 21 field pairs). **Deliberately NOT pushed:** if TestRail renders those fields as
  Markdown the tester sees literal `<ol><li>` tags (worth fixing); if it renders HTML they
  are fine and a rewrite is churn. **One look at a TestRail case page decides it.**
- **26 MERGE + 1 CUT recommendations remain HELD** (13 groups; `RULE28-…AUDIT.md` §3).
  19 of them hinge on whether the five filter dropdowns share **one component** — a
  **live-build** question, so merging now would be guessing.
- **No live VIU is possible** — no QA branch/env. ~18 on-screen labels stay design-sourced
  and explicitly hedged in the case text.
- **Branko:** NEW-Q1 (confirm Story 13 stays in this release), NEW-Q2 (the board that pins
  the 6 new filter types), NEW-Q3 (number Parts/Reports into the requirements), plus the 6
  unanswered questions in `PO-Questions-Branko-Filters-TechPlan_2026-07-30.md`, plus the
  epic-key ask (or confirmation the work is tracked outside Jira).
- `requirements.md` is **still the stale V1.0 ingest** — re-ingest from
  `spec-current-2026-07-31/Filters-spec-current.md`. No case cites it any more.
- `branko-answers-2026-07-31/sweep_2b.py` is marked **SUPERSEDED** (its check 13 asserts
  the retired `Epic key TBD` convention) — run `authenticity-2026-07-31/sweep_2b_closing.py`
  instead.

---

## 0.05 PRIOR — BRANKO'S PARTS/REPORTS/PAGE-SEARCH ANSWERS **APPLIED + PUSHED** (2026-07-31)

**Read this section first.** Source docs: `branko-answers-2026-07-31/` —
`answers-ingested.md` (his verbatim words), `DELTAS.md` (analysis), `APPLY-PLAN.md` (the
change list, now marked APPLIED), `RULE28-AUDIT-2026-07-31.md` (the quality gate),
`testrail-sync-manifest-2026-07-31.md` + `testrail-execution-log-2026-07-31.md` (EXECUTED),
`backup/` + `pre-push-snapshot/` + `run352/` (evidence).

**SPEC BASELINE: v1.6** — Confluence page **572030978**, version **12**, updated
**2026-07-28** (Rule 31; local copy `spec-current-2026-07-31/Filters-spec-current.md`,
pulled live 2026-07-31). ⚠️ `requirements.md` is still the **stale V1.0 ingest** — re-ingest
from the v1.6 pull.

### NEW TALLY: **146 authored → 110 ACTIVE / 36 Retired** — and for the first time **ALL 110 ARE LIVE IN TESTRAIL**
`testrail-id-map.csv` = **110 rows, 110 C-ids, ZERO blank** (was 118 rows / 102 C-ids / 16
blank). Live count under group **4110 = 110**, reconciled **equal both ways** (0
live-not-in-map / 0 map-not-live, plus section and title agreement 110/110). **Run 352 =
110 tests.** Every case is still `VIU-Pending` — **no live-build check was run** (Rules
12/22): Filters still has no QA branch.

### What Branko settled (6 of 7 answered; Q1 left blank)
**Q2=A** every chip shown filters that page · **Q3** *"support all the filters we have right
now in the app as well as all choices per filter. There is no specific list of choices"* ·
**Q4** a pointer only (*"fully displayed in the design"*) · **Q5=A** full Work-Orders parity
with 2 named exceptions (per-view/per-tab scoping; date-range is a single range) ·
**Q6=A** the pop-up palette is **Global Search's**, not Filters' · **Q7=A** role changes
neither chips nor options.

### What was executed
1. **9 local case edits (A1–A9).** Every *"Behaviour to confirm — pending Branko's product
   write-up"* hedge REPLACED with the settled assertion; `permissions_required` replaced with
   the Q7=A ruling on all 12 Parts/Reports cases; `refs` re-pointed from Figma-only /
   *"spec v1.3 export awaited"* to live v1.6 anchors + Branko's answers.
   **The Vendors-page hedge in FLT-PARTS-01 DELIBERATELY SURVIVES** — Q2=A speaks about chips
   *shown in the design* and there **is no Vendors design**; that stays open.
2. **1 new case — FLT-PARTS-13 = [C38908](https://shopview.testrail.io/index.php?/cases/view/38908)**
   *"Every filter a page had before is still available in the new filter bar"*: the Q3
   scope/parity ruling **nothing in the 110-case suite asserted** — no case checked that the
   redesign did not silently DROP a filter shops use today. **ONE case covering both Parts and
   Reports**, not one per page (Rule 28).
3. **The 9 `FLT-SRCH` command-palette cases RETIRED (local only).** See the ruling block below.
4. **Rule-28 three-dimension gate + the mandatory Stage-2b cross-case sweep.**
   **10 KEEP / 0 MERGE / 0 WEAK-KEEP / 0 CUT · 7 SENSIBLE / 3 FIX-WORDING (all repaired
   in-pass) / 0 NONSENSE · 10/10 GENUINE + layman.** The sweep is scripted as **475
   assertions, 475 PASS, 0 FAILED** (`branko-answers-2026-07-31/sweep_2b.py` + captured output). It
   caught 3 cases where new expected lines asserted behaviour the look-only steps never drove
   — **on cases the plan's own per-item pre-check had scored SENSIBLE** — repaired by adding
   FLT-PARTS-01 step 10, FLT-RPTS-01 step 16 and rewording FLT-PARTS-12 step 2.
5. **TestRail: 2 `add_section` + 8 `add_case` + 2 `update_case` + 1 `move_cases_to_section`,
   every op HTTP 200 + re-GET verified MATCH, 0 mismatches. 0 `delete_case`, 0 result
   writes.** New sections **Parts Page Filters = 5411** and **Reports Page Filters = 5412**
   (group 4110 now has 17 children). New cases **C38904–C38911**. Both `update_case` were
   **`refs`-only** (live bodies were diffed against local first and MATCHED, so no
   tester-facing text moved). **C38882 moved 4117 → 5412** — this **closes the 2026-07-30
   "FLT-RPTS-23 section move" follow-up**.
6. **Run 352 synced (Rule 34): 102 → 110 tests**, all 102 prior case_ids present, 0 extra,
   **result records unchanged 395 → 395**, `include_all` still false. No other run touched.

### ✅ THE 9 PALETTE CASES — RULING APPLIED, THREAD CLOSED
The QA-lead's ruling was conditional — verbatim: *"If those searches are also part of filters
then lets keep if filters project has nothing to do with them and they are not mentioned in
the specs then we can leave them to be tested with global search."* **The condition resolves
to LEAVE THEM TO GLOBAL SEARCH**, on three independent sources: **(a)** Branko **Q6=A** *"Test
it under Global Search, not here"*; **(b)** spec **v1.6 has no command-palette requirement** —
Story 13 is the in-toolbar input (`S13-R12` *"Results replace the table contents in place.
There is no separate results view or results page"*) and §4 gives cross-page lookup to the
global header search; **(c)** the **Filters Figma file contains no palette board** (it lives
on a separate "Global search" page — this corrects our own 2026-07-27 mislabelling of node
`11829-8908`).
**`FLT-SRCH-01…09` RETIRED locally.** Each C-id was **asserted BLANK before the write**, so
there was **NO `delete_case` and nothing to remove from TestRail**; bodies are **kept** with
the ruling + all three pieces of evidence recorded in each. Coverage lives in the Global
Search project's **86-case suite** — but say it out loud: **Global Search is POSTPONED**
(user ruling 2026-07-27), so that coverage is **parked, not running**.
**CONTRADICTION CLUSTER CLOSED** — 0 active command-palette cases remain (asserted by the
sweep), so the suite no longer holds two incompatible descriptions of "page search".

### ⛔ THE 13 `FLT-PSRCH` CASES WERE NOT TOUCHED — verified by C-id
**C38883, C38884, C38886, C38888, C38889, C38891, C38893, C38898, C38899, C38900, C38901,
C38902, C38903.** Different component: Filters' own **Story 13** in-toolbar page search, **29
ratified requirements in v1.6** — genuinely in scope. `cases-H-page-search-toolbar.json` shows
**no diff** for this pass. **Flag F2:** one clause of Branko's answer (*"This release only
removes global search's page-filtering behaviour (Story 14)"*), read literally and in
isolation, would descope Story 13 — the correct response is question **NEW-Q1**, not an edit.

### 🆕 DURABLE GOTCHA LEARNED (cost one HTTP 400 mid-run)
**TestRail's `refs` (References) field has a MAX LENGTH of 250 characters.** Over it →
**HTTP 400 `{"error":"Field :refs does not match the required pattern."}`**. 6 of this pass's
10 refs strings were 265–391 chars and were shortened to ≤240, keeping **both Rule-20 halves
(ticket + spec anchor)** plus the Branko attribution; everything trimmed out of `refs` was
moved into `notes` so nothing was lost. **This sits alongside the older gotcha that TestRail
strips the space after every comma in `refs`** (so write refs comma-free, or re-GET verifies
will falsely MISMATCH).

### STILL OPEN after this pass
- **2 NEW questions for Branko** (fold into the next sheet, layman per Rule 7):
  **NEW-Q1** — confirm the **in-page toolbar search box (Story 13) stays in this Filters
  release** (flag F2 — a literal reading of his answer would descope 13 live cases; priority).
  **NEW-Q2** — he says the new filter behaviour is *"fully displayed in the design"*, but every
  Parts/Reports board we can open pins **button names only** and the six new filter types
  (Location, Transaction Type, Invoice Status, Type, User, Mention) are **enumerated nowhere in
  v1.6** — ask for the exact board. *(**NEW-Q3**, asking him to add Parts/Reports to the
  numbered requirements — the Q1-blank residue — is a nice-to-have on the same sheet.)*
- **His answers settled NOT ONE of the 6 questions already in
  `PO-Questions-Branko-Filters-TechPlan_2026-07-30.md`** — that sheet goes out **unchanged**.
  Still open there: the Parts **"Vendors"** page design/scope · **sorting** (he never mentioned
  it; the design section is marked *Work In Progress*, so **do not author sorting cases**) ·
  the per-page **searchable-field list (`S13-R23`)** · the **mobile individual-filter "Apply"
  button** (genuine design-vs-tech-plan conflict on FLT-MOB-04 = C29624) · **which tab opens
  first** (Estimates default, absent from v1.6).
- **No live VIU is possible yet** — still **no Filters QA branch/env** and **no epic key
  (OQ-3)**, so every `refs` ticket half reads `Filters (Epic key TBD)` and the Parts/Reports
  spec anchors are **prose sections, not `S#-R#`** (because Q1 was left blank). Neither is
  invented (Rule 20).
- **Pre-existing, found by the sweep but OUTSIDE this pass's authorization** — recommended for
  the next authorized push: stale `spec v1.3` refs on **FLT-STAT-07 = C38877** and
  **FLT-API-06 = C38895**; an internal-id leak in the References of **FLT-EMPTY-02 = C29607**.
- **37 over-length titles** (Rule 19 trim queue) — none of them touched this pass.
- **Cross-project flag, NOT written (needs its own authorization):** record Branko's ownership
  ruling + his *"'Ask a question' is not in this PRD's scope"* line in
  `build/global-search/PROJECT-STATE.md` (that project's **OQ-3**).
- ~~**Rule-35 Figma queue may still be open**~~ — **CLOSED 2026-07-31T08:58:40Z: 85/85 boards
  now have a rendered PNG** (the last 6 via REST `/v1/images` with a QA-lead-supplied token).
  The Filters **design source is COMPLETE**. Reconciliation of all 85 boards against the 110
  cases: `build/filters/design-2026-07-31/RECONCILIATION-FINAL-2026-07-31.md` — **0 TestRail
  operations** (everything the last 6 show either confirms an existing case, is Work-In-Progress
  sorting, or is a superseded "v1" exploration).

---

## 0.1 PRIOR — SPEC v1.6 FIX + AUTHORING PASS **EXECUTED** (2026-07-31, earlier the same day)

**Read this section first.** Source docs: `fixes-2026-07-31/` (manifest, execution log,
authoring coverage, Rule-28 audit, backups, snapshots, run-352 evidence),
`ahtesham-review-2026-07-31/FIX-PLAN.md` + `VERIFICATION.md`,
`spec-current-2026-07-31/Filters-spec-current.md` + `SPEC-DIFF.md`.

**SPEC BASELINE IS NOW v1.6** — Confluence page **572030978**, version **12**, updated
**2026-07-28** by Branko Cicovic. Every case touched this pass records
`[spec v1.6 2026-07-28]` in its References. ⚠️ `build/filters/requirements.md` is still
the **stale V1.0 ingest** and should be re-ingested from the v1.6 pull.

### NEW TALLY: **145 authored → 118 ACTIVE / 27 Retired** (all 118 `VIU-Pending`)
**102 live in TestRail** under group 4110 (id-map 118 rows, **102 C-ids, 16 deliberately
blank** = FLT-PARTS ×4, FLT-RPTS ×3, FLT-SRCH ×9). Live count reconciles **equal both
ways** with the id-map (0 live-not-in-map / 0 map-not-live).

### What was executed
1. **The 4 immediate FIX-PLAN fixes.** Status-chip consistency **FLT-BAR-03 = C29559** +
   **FLT-TAB-05 = C29612** (the word "hidden" removed; both now say *shown greyed out,
   pre-filled, not clickable* per Branko Q4=B + the QA-lead ruling); **FLT-URL-05 =
   C38879** now uses the ratified label **"Back to my view"** and tests the `S11-R7`
   query-clearing clause; **NEW FLT-URL-06 = C38896** covers the `S11-N3` negative.
   **FLT-BAR-02 = C29558 was already correct and was not touched** (its precondition
   already said "shown greyed out and already filled in").
2. **8 new cases for the v1.6 gaps** (honest number — not padded to the ~25 in the brief;
   26 uncovered requirements collapse into 8 distinct behaviours + 7 extensions):
   FLT-URL-06 = C38896, FLT-EMPTY-03 = C38897, FLT-PSRCH-08 = C38898, FLT-PSRCH-09 =
   C38899, FLT-PSRCH-10 = C38900, FLT-PSRCH-11 = C38901, FLT-PSRCH-12 = C38902,
   FLT-PSRCH-13 = C38903. Rationale per case: `fixes-2026-07-31/AUTHORING-COVERAGE-2026-07-31.md`.
3. **7 existing cases extended/corrected instead of duplicated.** Most important:
   **FLT-PSRCH-03 = C38886 was WRONG** — it asserted the search text is saved per account
   "just like the filters"; `S13-R25` ratifies the opposite (browser-tab session only,
   never saved, each tab independent, gone after the session). Rewritten. Also
   FLT-PSRCH-05 = C38889 (+`S13-R17`/`R20`), FLT-PSRCH-06 = C38891 (extended to the
   ratified `S14-R6` 42-surface / 39-component sweep), and the FIX-PLAN **F7 refs sweep**
   on FLT-PSRCH-01/02/04/07 = C38883/C38884/C38888/C38893.
4. **Rule-28 three-dimension audit + the first CROSS-CASE consistency sweep.**
   20 KEEP / 0 CUT / 0 MERGE; 20 SENSIBLE / 0 NONSENSE; 20 GENUINE+layman PASS. Sweep of
   all 118 cases across 6 behaviour groups closed the Status-chip, query-persistence and
   "Clear filters" contradictions (2 extra repairs: **FLT-CHIP-04 = C29598** and
   **FLT-EMPTY-02 = C29607** now require an empty Search box). **Zero contradictions
   remain among the 102 cases in TestRail.** Report:
   `fixes-2026-07-31/RULE28-AUDIT-2026-07-31.md`.
5. **TestRail: 15 `update_case` calls over 12 cases + 8 `add_case`, every op HTTP 200 +
   re-GET verified. 0 delete, 0 add_section, 0 result writes.** Two self-corrected
   deviations are logged honestly (TestRail strips the space after commas in `refs` → all
   refs rewritten comma-free and re-pushed; 3 tester-facing "(VIU-confirm …)" phrases
   reworded and re-pushed). Log: `fixes-2026-07-31/testrail-execution-log-2026-07-31.md`.
6. **Run 352 synced (Standing Rule 34): 94 → 102 tests**, all 94 prior case_ids still
   present, 0 extra, **result records unchanged 395 → 395**, `include_all` still false.
   No other run touched. Evidence: `fixes-2026-07-31/run352/`.

### STILL PENDING after this pass
- **No live VIU is possible yet** — there is still **no Filters QA branch/env (OQ-3)** and
  **no epic key (OQ-2)**. All 118 cases are `VIU-Pending`; every spec-sourced on-screen
  label is flagged VIU-confirm in the internal notes.
- **Blocked on the spec:** `S13-R23` — the per-table searchable-field list is marked
  *Pending* from engineering in the PRD itself, and 5 client-side surfaces have no field
  list at all. **No per-page "searching X finds Y" case was invented.**
- **Branko / spec-watch items** (question sheet owned separately): align the PRD's
  "hidden" Status-chip prose (6 places) to his own Q4=B answer; Story 12 vs the mobile
  "All Filters" + "Apply filters" sheet; ownership of the 9 `FLT-SRCH` palette cases;
  `S13-R23` field list; FLT-TAB-06 = C38876's Estimates default tab (absent from v1.6).
- **Not authorized this pass:** FIX-PLAN **F2** (mobile Apply-button flag parity on
  C29622/C29623) and **F3** (C38877 refs/note). **Sorting: there are NO sorting cases** — only
  a design-backed proposal for ~6–8 (**0 authored, no internal IDs, no C-ids, never pushed**),
  held by the QA lead's 2026-07-31 ruling *"Lets wait for Brankos answers"* (Rule 48).
- **39 pre-existing over-length titles** (Rule 19) — standing trim queue.
- **12 Figma boards still have no PNG** — see the open queue note below (Rule 35).

---

Last updated: 2026-07-31 (**earlier the same day — AUTHORIZED *PARTIAL* EXECUTION OF THE
RULE-28 USEFULNESS AUDIT**). The user authorized a deliberately partial execution of
`quality-audit-2026-07-31/` (audit report + `MERGE-PLAN.md`, both now carry
EXECUTED / HELD markers per portion).

> ✅ **FIGMA FETCH QUEUE CLOSED — 85/85 — `build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md`**
> **Every one of the 85 design boards has a rendered PNG as of `2026-07-31T08:58:40Z`.** No
> DUE-AT is armed and **nothing needs re-running**. The last 6 were pulled over REST
> `/v1/images` with a Figma personal access token the QA lead supplied (kept in `/tmp` only,
> never committed), using the existing resumable fetcher — one call, no 429, exit 0.
> **Ordering lesson recorded:** the Figma MCP needs no token but its per-seat call cap is low;
> a REST token has no such cap. **Ask for a token early.**
> **Reading the 6 renders corrected 4 of our own tree-derived claims** (Sorting steps 1–2 DO
> have the toolbar sort control; `11884:15901` has NO sort button and is NOT a duplicate of
> `11884:20807`) and confirmed 2 (`Add Sort` absent on Sorting step 4; the search box's clear-x
> is Filled-state-only). All 11 "control X is absent" claims we held were re-checked against
> pixels — `BOARD-NOTES-12-2026-07-31.md` §6. **The Filters design pass may now be reported
> COMPLETE.**

**TEST RUN SYNCED 2026-07-31 (Standing Rule 34, user-authorized):** Ahtesham's run **352
"Filters - Ahtasham (Awaiting QA- ENV)"** now contains the COMPLETE active Filters suite —
**+15 cases, 79 → 94 tests**, result records unchanged (395 → 395, nothing lost), and the run's
case set is **EQUAL both ways** to the 94 live cases in `testrail-id-map.csv` (0 missing, 0
extra). The 15 added include the **7 page-search cases** plus the rest of the 2026-07-30 push —
the coverage the reviewer reported as missing. Evidence:
`build/testrail-run-sync-2026-07-31/run-sync-execution-log-2026-07-31.md`.

**NEW TALLY: 137 authored → 110 ACTIVE / 27 Retired** (all 110 still VIU-Pending;
94 of them live in TestRail, 16 blank C-ids). Live count under group 4110 = **94,
UNCHANGED** (expected 94, actual 94, reconciled 0 live-not-in-map / 0 map-not-live)
— because everything consolidated this pass had a blank C-id.

**WHAT WAS EXECUTED**
- **The 12 FIX-WORDING repairs.** 3 applied directly: **FLT-BAR-02 = C29558**
  (https://shopview.testrail.io/index.php?/cases/view/29558 — new precondition 3
  "You are on the All tab"), **FLT-ASSET-02 = C29590**
  (https://shopview.testrail.io/index.php?/cases/view/29590 — dropped the over-broad
  expected 3; the "No" direction is FLT-ASSET-07 = C38878), and **FLT-RPTS-21** (new,
  no C-ID yet — added the missing choose-a-value step + grammar fix). The other **9**
  (FLT-RPTS-04/09/11/12/13/14/15/16/20, all new/no C-ID) were delivered BY the MG15
  merge exactly as the audit predicted (clean 1–22 expected numbering + explicit
  switch-tab steps).
- **The presence-matrix merges, LOCAL-ONLY.** **MG14-PARTS-CHIP-MATRIX** — survivor
  **FLT-PARTS-01** (new, no C-ID yet) retitled "Every Parts list page shows its
  designed filter buttons", absorbing 8 members (FLT-PARTS-02/03/04/05/06/07/08/10).
  **MG15-REPORTS-CHIP-MATRIX** — survivor **FLT-RPTS-01** (new, no C-ID yet) retitled
  "Every report page shows its designed filter buttons", absorbing 19 members
  (FLT-RPTS-02..20). All 29 cases carry blank C-ids and were never in TestRail, so
  **no `delete_case` was needed** — these consolidations are purely local. Table-column
  and "New …" button assertions were demoted to reference notes inside the survivors'
  internal notes (nothing lost).
- **TestRail: 2 `update_case`, both HTTP 200 + re-GET MATCH. 0 add, 0 delete, 0
  section ops, 0 run/result writes.** Nothing outside group 4110 touched (C29558 →
  section 4111, C29590 → section 4116, both direct children of 4110). Manifest
  (written before the first write) =
  `quality-audit-2026-07-31/testrail-execution-manifest-2026-07-31.md`; per-op log =
  `.../testrail-execution-log-2026-07-31.md`; pre/post snapshots =
  `.../pre-push-snapshot/` + `.../post-push-verify/`; executor `exec_push_2026-07-31.py`.
- **Backups + recovery:** `consolidation-backup-2026-07-31/` (33 pre-edit case bodies +
  5 whole-file copies + `MANIFEST.md` with group → members → survivor → what it gained,
  and step-by-step recovery). The local edit is reproducible via
  `quality-audit-2026-07-31/apply_consolidation_2026-07-31.py` (refuses to re-run).
- **Generator change:** `gen_import.py` now EXCLUDES `viu_status` "Retired — …" cases
  (same convention as fees-discounts / simple-flow / schedule). Import + id-map
  regenerated over **110** (header byte-identical to the other project imports, 0
  VIU/flag words, no duplicate titles, no C-id column, 6 API cases in the API section);
  id-map C-ids re-merged **94/94** (⚠️ `gen_import.py` still blanks the id-map C-id
  column on every run — always re-merge after regenerating).

**⚠️ STILL PENDING — NOTHING BELOW WAS TOUCHED**
1. **The 19-case dropdown merges MG1 / MG2 / MG5 / MG6 — HELD awaiting a LIVE VIU.**
   They rest on the audit's own not-live-verified assumption that "the five filter
   dropdowns are one shared component". Re-open only after the QA branch lets us verify
   it live. Cases untouched: MG1 = FLT-CHIP-05 **C29599** (survivor) + FLT-STAT-04
   **C29563**, FLT-CUST-06 **C29571**, FLT-TECH-04 **C29578**, FLT-ADV-04 **C29585**,
   FLT-ASSET-04 **C29592**; MG2 = FLT-STAT-05 **C29564** (survivor) + FLT-CUST-07
   **C29572**, FLT-TECH-05 **C29579**, FLT-ADV-05 **C29586**, FLT-ASSET-05 **C29593**;
   MG5 = FLT-CUST-01 **C29566** (survivor) + FLT-TECH-01 **C29575**, FLT-ADV-01
   **C29582**; MG6 = FLT-CUST-02 **C29567** (survivor) + FLT-TECH-02 **C29576**,
   FLT-ADV-02 **C29583**.
2. **The 9 page-search cases — HELD by USER RULING 2026-07-31**, verbatim: *"OK do not
   delete those cases unless Branko confirms that they are related to Global search
   only."* **FLT-SRCH-01, FLT-SRCH-02, FLT-SRCH-03, FLT-SRCH-04, FLT-SRCH-05,
   FLT-SRCH-06, FLT-SRCH-07, FLT-SRCH-08, FLT-SRCH-09 — all nine "new, no C-ID yet"
   (none has ever been pushed to TestRail).** They STAY in the Filters suite and must
   NOT be deleted or moved unless and until **Branko explicitly confirms they belong to
   Global Search only**; his answer to **Q6** of
   `PO-Questions-Branko-PartsReports-2026-07-27.md` ("The pop-up search box") decides
   move-vs-keep. Honesty note: FLT-SRCH-09 was briefly retired locally earlier the same
   day under the audit's "single NONSENSE case" item; that retirement was **REVERTED**
   on this ruling and the case is ACTIVE again (it was never in TestRail, so nothing was
   deleted anywhere). The audit's CUT recommendation for all nine — and its NONSENSE
   verdict on FLT-SRCH-09 — stand as RECOMMENDATIONS ONLY, re-tabled on Branko's answer.
   Recorded in `MERGE-PLAN.md` (Cuts), the audit-report headline footnote, and both
   Branko sheets.
3. **The 39 over-80-char title trims — NOT authorized this pass.** Full list in the
   audit report appendix; worst offenders FLT-TAB-02 **C29609** (179), FLT-TAB-03
   **C29610** (177), FLT-PERS-02 **C29614** (151), FLT-COLL-04 **C29604** (128).
   FLT-BAR-02 **C29558** (87) was touched this pass but NOT retitled.
4. **The optional under-merge findings MG16 / MG17 / MG18 — NOT authorized.** MG16 =
   FLT-CHIP-04 **C29597** + FLT-CHIP-03 **C29596**; MG17 = FLT-COLL-05 **C29605** +
   FLT-COLL-04 **C29604**; MG18 = FLT-PARTS-11 + FLT-PARTS-12 (both new, no C-ID yet).
5. Also untouched (not in the authorization): the 2 in-suite duplicate CUTs FLT-BAR-03
   **C29559** and FLT-COLL-03 **C29603** (both still live), and merge groups MG3 / MG4 /
   MG7 / MG8 / MG10 / MG11 / MG12 / MG13.
6. Everything from the 2026-07-30 entry below still stands: the **spec v1.3 export**
   request (Branko Q7) → Rule-11 ask → SPEC-RELEVANCE-RECONCILIATION; the FLT-RPTS-23
   **C38882** section move; **live VIU is still pending the QA branch + Epic key** (no
   live-build check was run in this pass either — the audit and this execution are
   desk work on case text, per Rule 12).

Prior update: 2026-07-30 (**TECH-PLAN PUSH QUEUE EXECUTED, user-authorized
"Push all three"**): the ChangeList §E queue is now LIVE in TestRail — **15
`add_case` + 1 `update_case` (FLT-PERS-02 = C29614) + 1 `add_section` ("Page Search
Toolbar" = 5410, per §E), ALL HTTP 200 + re-GET MATCH; 0 deletes, run(s) untouched,
only group 4110 touched.** New C-ids: FLT-TAB-06=C38876, FLT-STAT-07=C38877,
FLT-ASSET-07=C38878, FLT-URL-05=C38879, FLT-PERS-05=C38880, FLT-PERS-06=C38881,
FLT-RPTS-23=C38882 (temporarily in section 4117 — "Reports Page Filters" not live
yet; move when the Parts/Reports queue pushes), FLT-PSRCH-01..07 =
C38883/C38884/C38886/C38888/C38889/C38891/C38893 (section 5410), FLT-API-06=C38895
(section 4124). **Live count under group 4110 = 94** (79 + 15, per-section
re-count). id-map: 137 rows, 94 C-ids populated, 43 blank (the pending
design-level Parts/Reports/⌘K queue). Import regenerated (137 rows, header
byte-identical, hygiene clean, C-ids re-merged 94/94). Audit =
`tech-plan-2026-07-29/testrail-execution-log-2026-07-30.md`; executor
`exec_sync_2026-07-30.py`; C29614 pre-push snapshot saved. Follow-ups: FLT-RPTS-23
section move; FLT-PERS-02 title 151 chars — shorten at the next authorized
tester-facing touch.

Prior update: 2026-07-29 (**TECH-PLAN RECONCILIATION APPLIED, LOCAL ONLY,
NO TestRail writes**). The user provided the engineering tech plan for the
app-wide filter redesign (`tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md`,
verbatim ingest). Full analysis = `tech-plan-2026-07-29/TECH-PLAN-DELTAS.md`;
change list + push queue = `tech-plan-2026-07-29/ChangeList.md`; quality gate =
`tech-plan-2026-07-29/RULE28-AUDIT-2026-07-29.md` (15 KEEP / 0 CUT, 15 SENSIBLE,
15 genuine+layman). Headlines:
- **Confluence spec is now v1.3 — we hold V1.0.** Spec v1.3 (2026-07-20) adds
  Parts filters (8 views), Reports filters (~21), **Story 13 Page Search (23
  reqs)**, **Story 14 nav search stops filtering lists**, a date-range chip type
  and per-view/per-tab state scoping — this IS the awaited "Branko PRD update".
  Request the export (Questions Q7) → then Rule-11 ask →
  SPEC-RELEVANCE-RECONCILIATION over the whole suite.
- **OQ-2 RESOLVED:** canonical spec URL =
  https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/572030978/Filters.
- **Status-chip conflict RESOLVED by user ruling 2026-07-30** (hidden ==
  greyed-out/disabled; FLT-TAB-02/03 C29609/C29610 stand correct as pushed, no
  case change, no TestRail write); Branko doc now 6 open questions incl. the
  v1.3 spec-export request (Questions Q1 marked RESOLVED).
- **15 NEW cases authored** (blank C-ids, VIU-Pending): FLT-TAB-06 (default tab
  Estimates D10), FLT-STAT-07 (Imported exclusivity G1), FLT-ASSET-07 (Asset on
  Site "No" G4), FLT-URL-05 (link view runtime-only + back-to-saved G7),
  FLT-PERS-05 (per-view/per-tab scoping D20), FLT-PERS-06 (localStorage→account
  migration §4-3.3), FLT-RPTS-23 (date-range chip D19), FLT-PSRCH-01..07 (page
  toolbar search Story 13 + Story 14 decoupling; NEW section "Page Search
  Toolbar"), FLT-API-06 (prefs endpoint contract §4-1.3). **12 edit groups**
  (FLT-PERS-02/C29614 gains the cross-device leg — the only tester-facing content
  edit; the rest are QA-notes/metadata: FLT-STAT-03, FLT-CUST-05, FLT-TECH-07,
  FLT-ADV-07, FLT-EMPTY-01, FLT-MOB-04 conflict note, FLT-API-01..04 contract
  notes, FLT-PARTS-08/11/12 + FLT-RPTS-21/22 rollout notes, FLT-SRCH-01..09
  ownership notes). Pre-edit backups + apply script in
  `tech-plan-2026-07-29/backup/` (+ MANIFEST).
- **FLT-SRCH-01..08 flagged for transfer/retire:** per engineering (G8/D22) the
  spotlight/⌘K palette = Global Search v2 project; Filters ships the page-toolbar
  search instead — pending Branko Q6.
- **NEW TOTAL: 137 cases** (79 in TestRail C29557–C29635 + 58 blank C-ids).
  Import + id-map regenerated over 137, hygiene verified (header byte-identical,
  0 VIU/flag words, 79 C-ids re-merged). **PUSH QUEUE (awaiting authorization):
  15 add_case + 1 update_case (C29614).**
- **Questions doc READY:** `tech-plan-2026-07-29/Questions-for-Branko-dev.md`
  (Q1–Q6 A/B layman + Q7 spec-export request; QA mapping on the QA-only section).
- VIU-prep facts (no flag — D13 straight replace; prefs endpoint + pageKeys;
  test-ids; debounces; date-range URL form) recorded in TECH-PLAN-DELTAS.md §5.
- Report Suite crossover confirmed end-to-end (prefs endpoint is the shared
  cross-device layer; Phase 8 re-skins ~24 legacy report pages) — flagged in
  TECH-PLAN-DELTAS.md §7, NOT written into build/report-suite/.

Prior update: 2026-07-27 (**OPTION A: DESIGN-LEVEL Parts + Reports +
page-search cases AUTHORED, VIU-Pending, NO TestRail writes**). The user chose
Option A (author now from the captured designs rather than wait for the PRD).
**43 new cases authored** (all `viu_status` = VIU-Pending, design-only, not
live-verified — Rules 12/22), assigned next-free FLT- ids, added to
`testrail-id-map.csv` with **BLANK C-ids (need `add_case` later)**:
- **Parts filters — 12** (`cases/cases-E-parts-filters.json`, FLT-PARTS-01..12):
  one chip+column case per Parts page (Inventory / Part Sales / Catalog / Returns /
  Credits / Purchase Orders / Vendor Invoices / Vendors), the Part Type dropdown
  (Core / Non Core / Clear selection), the shared toolbar icons, + 2 behaviour
  cases flagged pending-PRD.
- **Reports filters — 22** (`cases/cases-F-reports-filters.json`, FLT-RPTS-01..22):
  one title+tabs+chips case per report screen (23 screens, tabbed ones folded:
  Technician Efficiency Invoiced+Completed = 1; QB Unexported 3 tabs = 1), + 2
  behaviour cases pending-PRD. New filter types noted: Location, Transaction Type,
  Invoice Status, Type, User, Mention.
- **Page search (⌘K) — 9** (`cases/cases-G-page-search.json`, FLT-SRCH-01..09):
  spotlight palette states (placeholder "Search or ask a question", entity tabs,
  grouped results + highlighting, recent searches, persisting search, hover
  quick-actions, keyboard footer, Refresh) + FLT-SRCH-09 scope-decision case.
  **Every page-search case carries an OVERLAP note: this component is also the
  Global Search project (86 cases already authored there, postponed) — reconcile /
  de-duplicate before any push.**

Behaviours the designs don't pin (which chips actually apply, option lists, new
filter-type logic, results behaviour, WO-parity) are written to the visible design
and carry a plain flag in the case ("Behaviour to confirm — pending Branko's
product write-up; to be checked live once the feature is available"). Titles all
≤ 80 chars. Refs = "Filters (Epic key TBD); Figma <node>; design-notes anchor"
(Epic key still unavailable — not invented, Rule 20).

**NEW TOTAL: 122 Filters cases** (79 existing WO cases C29557–C29635 + 43 new
design-level). Import + id-map regenerated over 122 (`gen_import.py`; SECTION_ORDER
extended with the 3 new sections). **Import hygiene RE-VERIFIED: header
byte-identical to the other project imports, 0 VIU/flag words in tester content,
no dup titles, no C-id column; id-map re-merged 79 existing C-ids preserved + 43
new blank.** ⚠️ `gen_import.py` blanks id-map C-ids on rerun — re-merge after any
regenerate.

**Branko PO-questions doc READY** (Option A deliverable) —
`PO-Questions-Branko-PartsReports-2026-07-27.md`/`.xlsx` (generator
`gen_po_questions_partsreports.py`; mirrors the prior PO sheets 1:1, layman/Rule 7,
QA-only mapping on a separate tab). 7 product questions: (1) the PRD/behaviour
write-up for Parts + Reports; (2) which shown filter buttons actually filter each
page; (3) full option lists per filter; (4) how the new filter types work;
(5) do Parts/Reports filters behave like Work Orders (multi-pick/clear/collapse/
remember/shareable/mobile); (6) page-search scope = Filters vs Global Search
(+ AI "ask a question"); (7) do filter choices differ by role on Parts/Reports.
**NOTHING pushed to TestRail; no secrets.**

**NEXT:** Branko's PRD/answers → then run SPEC-RELEVANCE-RECONCILIATION +
build-accurate wording + live VIU on the new cases (they are DESIGN-ONLY today);
resolve page-search scope with the Global Search project; then an authorized
`add_case` push for the 43 new cases (assign C-ids, re-merge id-map).

---

## 2026-07-28 — Cross-squad note from Report Suite kickoff (persistence)

**Documentation only — NO case edits, NO TestRail writes.** Mirrored here so the
Filters and Report Suite projects stay aligned (the CLAUDE.md + PROJECT-STATE docs
are the shared brain across parallel sessions — Standing Rule 20).

**The clash (flagged in Chris Ward's Report Suite kickoff video, 2026-07-28):**
engineer **Stefan Mitrovic** flagged a cross-squad overlap between the two persistence
models:
- **Report Suite** saves each user's filters / columns / sort **PER-USER-PER-COMPUTER
  (local only)** — it does NOT follow the user across devices.
- **The Filters squad (Branko + Miloš)** is building **account-level saved views +
  shareable links** that persist **ACROSS devices** (cloud-backed, tied to the user
  account, not the browser/machine).

**Decision from the call:** leave the **Report Suite persistence LOCAL for now**;
**sync and delegate the cross-device saved-view work to the Filters squad once the
Filters feature is on staging**, then Report Suite reuses / merges into it rather than
building its own cross-device layer. **Chris Ward will sync with Branko and report back
in Slack.**

**Who's involved:** Filters squad = **Branko (PO) + Miloš** (account-level +
shareable-link cross-device persistence, i.e. the owning squad). Report Suite = **Chris
Ward (PO) + Parth**. **Stefan Mitrovic** flagged the clash in the kickoff.

**ACTION for the Filters project:** when Filters' **account-level saved-views +
shareable-link** feature is built, it is **expected to be reused by the Report Suite**
(cross-device persistence for reports delegates to it). **Coordinate with the Report
Suite squad so the work is not duplicated** — Filters owns the shared cross-device
persistence layer; Report Suite consumes it. Track this when the feature reaches
staging / VIU.

**Impact on existing Filters persistence cases (FLAG ONLY — do NOT edit any case now):**
this relates to the existing **FLT-PERS-\*** cases. Those may need a **scope note** once
the cross-device / shareable-link behaviour is finalized WITH the Report Suite (e.g. to
clarify whether "remembered permanently" is per-account/cross-device vs per-device, and
how shareable links interact). **Flag only — no case changes this pass.** The cases:
- **FLT-PERS-01 = C29613** — page round-trip restore of filters + bar state.
- **FLT-PERS-02 = C29614** — filter selections remembered permanently (across app
  navigation + browser close + sign-back-in). ← most directly touched by the
  cross-device/account-level question.
- **FLT-PERS-03 = C29615** — saved filters are per-user (one user's filters don't
  appear for another).
- **FLT-PERS-04 = C29616** — a remembered value that no longer exists is silently
  dropped on return.

**Source docs (Report Suite project — cross-reference):**
- `build/report-suite/chris-answers-2026-07-28/video-deltas-2026-07-28.md` (item **P19**).
- `build/report-suite/chris-answers-2026-07-28/loom-kickoff-transcript.md` (~22:00–25:30).

---

Prior update: 2026-07-20 (**Branko's ROUND-2 ANSWERS INGESTED 2026-07-20
— Q1=A / Q2=A / Q3=A, all three CONFIRM the suite as-is; ZERO case edits and
ZERO TestRail writes required.** Source of record:
`branko-answers-round2-2026-07-20/answers-ingested.md` (+ raw xlsx). Q1=A he'll
fix both stale write-up sentences in the PRD update (PRD itself STILL AWAITED —
not attached); Q2=A "Imported" correct, demo "Reported" = typo → design-system
prototype anomaly CLOSED (FLT-STAT-01/06 + FLT-MOB-03 already correct); Q3=A
filter lists role-independent → **OQ-4 RESOLVED**, no role-based cases needed
(optional notes-only annotation on FLT-CUST-01/TECH-01/ADV-01 C29566/C29575/
C29582 — bundle with the next authorized push, not standalone). Earlier
2026-07-17: Round-2 question sheet + the PRD-update
request SENT to Branko by the user. Earlier
same day: Q2/Q4 case edits APPLIED + PUSHED TO TESTRAIL —
FLT-PERS-02/C29614, FLT-TAB-02/C29609, FLT-TAB-03/C29610, 3/3 update_case
200 + re-GET confirmed, user-authorized pass, audit log at
`branko-answers-2026-07-17/testrail-update-log.md`; import + id-map
regenerated, id-map re-merged 79/79. Earlier same day: superseded-reshare
question RESOLVED — user ruling A, ZIP=final baseline confirmed unchanged;
Branko's 4 answers ingested + new design inputs [design-system zip + 9 PDFs]
reconciled; JE-tab frame captured → final set 50/50; IMPORTED TO TESTRAIL by
the user, id-map 79/79).

## §0 STATUS / WHAT'S LEFT TO DO — read first

**STATUS: IMPORTED TO TESTRAIL 2026-07-17 (BY THE USER)** — the 79 cases are
live in TestRail **suite 1, section group_id 4110 "Filters - (VIU Pending)"**,
with the 14 sections nested under it (4111–4124; API cases in section 4124
"API — Work Orders List Filtering"). Canonical TestRail URL:
https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=4110
**id-map POPULATED 79/79** (`build/filters/testrail-id-map.csv`, C29557–C29635;
matched by exact title, 0 unmatched; read-only API fetch — no TestRail writes).
Authoring recap: 79 cases / 14 sections, 81/81 spec lines + 18/18 final WO
design frames covered, 24 VIU-confirm notes, adversarial audit CLEAN 7/7,
Rule-16 import delivered at `testrail-import/filters-v1-testrail-import.csv`/`.xlsx`.

**NEW 2026-07-17: the user has SENT Branko (a) the Round-2 question sheet
(3 questions: stale-spec cleanup confirm, "Reported vs Imported" status,
role-based filter visibility) and (b) the explicit request to deliver the
promised PRD update covering the Parts + Reports pages (which filter chips per
page + option lists incl. new filter types Location / Transaction Type /
Invoice Status / Type / User / Date / Mention; whether all WO-page behaviors
[persistence/URL/clear/collapse/real-time] apply identically; page-specific
specials). **UPDATE 2026-07-20: (a) ANSWERED + INGESTED (Q1=A/Q2=A/Q3=A, see
LATEST above); (b) the PRD update is STILL AWAITED.**

**WHAT'S LEFT TO DO — the definitive waiting list (recite on resume):**
1. ✅ **DONE 2026-07-20: Branko's Round-2 answers INGESTED** (Q1=A/Q2=A/Q3=A —
   all confirmatory, zero case edits / zero TestRail writes required; OQ-4
   resolved [lists role-independent], prototype "Reported" anomaly closed
   [Imported correct]; source of record
   `branko-answers-round2-2026-07-20/answers-ingested.md`; optional Q3
   notes-only annotation on C29566/C29575/C29582 to bundle with the next
   authorized push).
2. **Branko's updated PRD** (request SENT 2026-07-17; NOT attached to his
   Round-2 answers — still awaited, incl. the two Q1 text fixes) → unlocks
   authoring the
   Parts/Reports case set (~30–50 cases from the 31 captured screens; run the
   standard pipeline: ask which process per Rule 11 → author → adversarial
   review → canonical Rule-16 import → user imports or authorized push).
3. **Feature on QA env → VIU** (ask the user for the Epic/Jira key + which
   process(es) per Rule 11; resolve the 24 VIU-confirm placeholders + confirm
   the exact on-screen strings for the 3 Branko-updated cases
   C29609/C29610/C29614).
4. **Housekeeping:** OQ-2 — canonical Confluence spec URL still to confirm.

Everything else is DONE as recorded below (79 cases in TestRail C29557–C29635;
3 cases updated per the Q2/Q4 rulings, audit-logged; import + id-map
regenerated intact; design baseline ZIP=final 50/50; Round-1 + Round-2 sheets
delivered).

**Detail (prior definitive list — all still accurate, kept for context):**
1. ✅ **DONE:** spec ingested (V1.0 confirmed current) · design final set
   **50/50 captured** (49 ZIP + the QB Journal-Entries tab 11982:8998
   captured-from-PDF-export 2026-07-17 — the one known gap, closed) ·
   79 cases authored + adversarial-reviewed CLEAN · Rule-16 import delivered ·
   **imported to TestRail by the user 2026-07-17 (suite 1, group 4110)** ·
   **id-map populated 79/79 by title-match (read-only)** ·
   **Branko's 4 PO answers INGESTED 2026-07-17**
   (`branko-answers-2026-07-17/answers-ingested.md` = source of record) ·
   new design inputs (design-system zip + 9 PDFs) inventoried + reconciled
   (`new-inputs-inventory-2026-07-17.md`; design-notes §E) ·
   **ROUND-2 PO QUESTIONS READY FOR BRANKO 2026-07-17**
   (`PO-Questions-Filters-Round2_2026-07-17.xlsx` + `.md`, generator
   `gen_po_questions_round2.py`; same two-sheet layman format as round 1):
   Q1 = spec-cleanup reminder for his PRD update (stale S2-N1/N2, S9-R2/R3,
   S10-R2 sentences vs his Q4=B/Q2=B rulings), Q2 = the zip-prototype
   "Reported"-vs-"Imported" status anomaly (item 4), Q3 = role-based filter
   lists (OQ-4). **SENT to Branko by the user 2026-07-17 (together with the
   PRD-update request) — awaiting his answers.**
2. **Apply Branko's answers (consequences, per the ingestion doc):**
   **Q1=A — Parts/Reports filter screens ARE IN SCOPE** (9 Parts + 22 Reports
   screens) but authoring is **GATED ON Branko's PRD update** (no spec text
   yet — Standing Rule 1; est. +30–50 cases; then add_case push = fresh user
   authorization). **Q2=B — ✅ DONE 2026-07-17: FLT-PERS-02 (C29614) tightened
   to permanent per-user persistence** (browser-close + sign-back-in leg added;
   resolves OQ-5) **and PUSHED to TestRail (update_case 200, re-GET confirmed,
   user-authorized)** — at VIU only the exact on-screen labels remain to
   confirm. **Q3=A — "Lead Technician" everywhere; NO case changes** (cases
   already answer-proof; bug only if the build shows "Tehnician" at VIU).
   **Q4=B — ✅ DONE 2026-07-17: FLT-TAB-02/03 (C29609/C29610) rewritten**
   (Status chip shown greyed out, pre-filled, not clickable; "chip hidden"
   spec phrasing removed) **and PUSHED to TestRail (2/2 update_case 200,
   re-GET confirmed, user-authorized)** — at VIU still capture the exact
   disabled-chip labels live, esp. the Completed tab's pre-filled string (no
   design frame; the case note flags it). **Audit log:**
   `branko-answers-2026-07-17/testrail-update-log.md` (per-case before/after +
   HTTP statuses). Import + id-map regenerated same day (id-map re-merged
   79/79). **⚠️ Spec-stale flags for Branko's PRD update: S2-N1/S2-N2,
   S9-R2/S9-R3 (chip hidden → superseded by Q4=B) and S10-R2 ("browser
   session" → superseded by Q2=B).**
3. ✅ **RESOLVED (2026-07-17, user ruling A — design-notes §E c):** the
   superseded-reshare question is CLOSED. The 9 PDFs were a **completeness
   export only** — the **"ZIP = final" design baseline is CONFIRMED
   UNCHANGED**; Sorting stays OUT of scope (separate WIP feature); the older
   mobile variants and the Customer-v1 leading-checkbox dropdown variant
   remain SUPERSEDED (final right-side-✓ pattern wins). No scope revision.
4. ✅ **RESOLVED (2026-07-20, Round-2 Q2=A): design-system zip anomaly CLOSED** —
   "Imported" is correct; the prototype's "Reported" is a demo typo. The zip
   stays a REFERENCE AID only (Claude-Code skill package + coded prototype, not
   authoritative frames), now with a known-wrong status list on this point.
   FLT-STAT-01/06 (C29560/C29565) + FLT-MOB-03 (C29623) already use the correct
   9-status list incl. Imported — no changes.
5. **VIU when the feature reaches a QA env (OQ-7):** ⚠️ ASK the user for the
   Epic/Jira key (OQ-3) AND which process(es) to run per Standing Rule 11
   (BUILD-ACCURATE-WORDING-VIU and/or SPEC-RELEVANCE-RECONCILIATION); resolve
   the 24 VIU-confirm placeholders live with evidence + confirm the exact
   on-screen strings for the already-pushed Q2/Q4 edits (item 2 — esp. the
   Completed tab's pre-filled Status-chip text); live-observe everything per
   Rules 10/12/13/14 (seed data yourself, never NOT-VERIFIED).
6. **Post-VIU deliverables per house conventions:** Blockers Tracker + results
   workbook (tab per status + Summary) with TestRail C-ID + link columns
   (Rule 8 — now possible via the populated id-map); bug drafts in layman form
   for any deviations (Rule 7); update the import to final (VIU-word-free stays).
7. **Housekeeping:** canonical Confluence spec URL still TO CONFIRM (OQ-2);
   permissions/role behavior unspecified in spec (OQ-4) — **now carried by
   the Round-2 sheet as PO Question 3** (awaiting Branko); env/access facts to record at VIU
   (OQ-7); WAIT on Branko's updated PRD (Parts/Reports sections + the Q2/Q4
   text corrections).

⚠️ **id-map protection:** `gen_import.py` REGENERATES `testrail-id-map.csv`
with BLANK C-ids — the map is now populated, so do NOT rerun gen_import.py
without preserving/re-merging the C-id column.

Last updated 2026-07-17 (post-import). Detail bullets below.

- **Cases AUTHORED 2026-07-17: 79 cases / 14 sections (13 functional + 1 API)** →
  `build/filters/cases/cases-A..D-*.json` (schema mirrors global-search; all
  `viu_status: VIU-Pending`; 24 cases carry explicit VIU-confirm notes for
  labels/behaviors unconfirmable from the design). Section breakdown: Filter Bar
  Layout and Visibility 3, Status 6, Customer 9, Lead Technician 7, Service
  Advisor 7, Asset on Site 6, Active Chips & Clear Filters 6, Collapse and
  Expand 5, Empty State 2, Tab Behaviour 5, Persistence 4, URL State 4, Mobile
  10, API — Work Orders List Filtering 5 (Standing Rule 4).
- **SCOPE RULING (recorded 2026-07-17):** cases cover the WORK ORDERS PAGE
  feature only — all 12 spec stories × the 18 final WO design frames (desktop +
  mobile). The **9 Parts + 22 Reports screens in the final ZIP design set are
  NOT covered by any spec story → NO cases authored for them** (no invention,
  Standing Rules 1/9); they are excluded-with-reason in `coverage-matrix.md` §C
  and raised as **PO Question 1 to Branko**. (This supersedes the onboarding
  note that the zip screens "ARE in scope because they are in the zip" — in the
  final design set yes, but case-authoring scope = spec coverage.)
- **Coverage: 100%** — every spec requirement line (81 S#-R#/N#/E# across
  Stories 1–12) and every final WO design frame (18) maps to ≥1 FLT- case:
  `build/filters/coverage-matrix.md` (§A spec, §B frames, §C exclusions).
- **Typo rule applied:** design's recurring "Lead Tehnician" is NOT codified —
  all cases say "Lead Technician" and carry typo-flag notes; PO Question 3
  confirms the ship spelling (design-notes §C.1).
- **Import READY (Rule 16, canonical):**
  `testrail-import/filters-v1-testrail-import.csv` + `.xlsx` via
  `build/filters/gen_import.py` — 79 rows, header BYTE-IDENTICAL to the
  fees-discounts / simple-flow / global-search imports (verified), 8 named
  columns + 2 trailing blanks, CRLF rows/LF cells, VIU-word-free +
  feature-flag-free (0 occurrences), API cases only in the em-dash
  "API — Work Orders List Filtering" section, deterministic ordering.
- **ID map (Rule 8):** `build/filters/testrail-id-map.csv` — **POPULATED
  79/79 (2026-07-17)** with the real TestRail C-ids (C29557–C29635) after the
  user's import; matched by exact title against `cases/*.json`, 0 unmatched;
  the 5 FLT-API cases confirmed in section 4124 "API — Work Orders List
  Filtering". ⚠️ gen_import.py regenerates this file with BLANK C-ids — don't
  rerun it without re-merging the C-id column.
- **PO questions ANSWERED BY BRANKO 2026-07-17** (were:
  `build/filters/PO-Questions-Filters_2026-07-17.xlsx` + `.md`, generator
  `gen_po_questions.py`). Verbatim answers + full consequence map =
  `build/filters/branko-answers-2026-07-17/answers-ingested.md` (raw export
  alongside): **Q1=A** Parts/Reports IN SCOPE (gated on his PRD update),
  **Q2=B** permanent per-user persistence (resolves OQ-5), **Q3=A** "Lead
  Technician" spelling confirmed, **Q4=B** disabled pre-filled Status chip on
  Estimates/Completed (supersedes spec S2-N1/N2, S9-R2/R3; S10-R2 superseded
  by Q2). Case-edit consequences in WHAT'S-LEFT item 2.
- **TestRail: cases IMPORTED BY THE USER 2026-07-17** (suite 1, group 4110,
  sections 4111–4124). **Q2/Q4 case updates PUSHED 2026-07-17 (user-authorized
  pass, exactly 3 update_case: C29614/C29609/C29610, 3/3 HTTP 200 + re-GET
  confirmed; audit log `branko-answers-2026-07-17/testrail-update-log.md`).**
  No other writes ever made (id-map fetch was read-only GETs).
  **NO TestRail writes without explicit user permission** — any future edit
  (Parts/Reports add_case, wording pass) needs fresh authorization + audit log.
- **VIU: PENDING** — needs the QA env/flag/API facts (OQ-7) + the Epic/Jira key
  (OQ-3, ASK THE USER at VIU) + canonical Confluence URL (OQ-2). Per Standing
  Rule 11 ASK which process(es) to run before starting.

## §1 Project identity

- **Feature:** Filters — a persistent multi-criteria filter bar on the Work Orders
  page (ShopView App): Status / Customer / Lead Technician / Service Advisor /
  Asset on Site chips, multi-select + search, Clear filters / Clear selection,
  collapse/expand toggle, per-user persistence, URL state, tab behaviour, mobile.
- **PO: Branko** (full name TBC — same PO as Global Search; NEVER mix PO
  attributions across projects: Filters=Branko, Global Search=Branko,
  Fees&Discounts=Chris Ward, Simple Flow=Milos).
- **Canonical spec URL (Confluence): TO CONFIRM — user provided the exported .doc
  2026-07-16** (when obtained: reference pointer only, do NOT fetch —
  Atlassian-SSO login-walled). Spec V1.0 confirmed CURRENT (designer via user,
  2026-07-17).
- **Epic / Jira key: ⚠️ NOT AVAILABLE — ASK THE USER when VIU begins** (all story
  Jira fields "TBD"; do NOT invent).
- **Figma source:** file `DR4gEODShYgJqkozs3mF5q` node **11854-23562** "Work Order
  Explorations 20.4.2026"; the user's export zip `50219798-Filters.zip` (49 PNGs)
  = the FINAL design set (designer ruling 2026-07-17; design-notes §D/§Z).

## §2 Deliverables index

| Artifact | Path | State |
|---|---|---|
| Complete spec | `build/filters/requirements.md` | DONE 2026-07-17 (V1.0 confirmed current) |
| Design notes | `build/filters/design-notes.md` | DONE 2026-07-17 — ZIP-authoritative; §Z map (50/50) + §D completeness + §E new-inputs section |
| Design screenshots | `build/filters/design-screens/` | DONE — 59 PNGs (49 ZIP final set + 1 PDF-sourced JE tab + 9 retained superseded API renders) |
| New-inputs inventory | `build/filters/new-inputs-inventory-2026-07-17.md` | DONE 2026-07-17 — design-system zip + 9-PDF reconciliation verdicts + open questions |
| Branko answers ingestion (Round 1) | `build/filters/branko-answers-2026-07-17/answers-ingested.md` (+ raw xlsx) | DONE 2026-07-17 — source of record for Q1–Q4 rulings |
| Branko answers ingestion (Round 2) | `build/filters/branko-answers-round2-2026-07-20/answers-ingested.md` (+ raw xlsx) | DONE 2026-07-20 — Q1=A/Q2=A/Q3=A, all confirmatory; zero case edits/TestRail writes required |
| TestRail update audit log | `build/filters/branko-answers-2026-07-17/testrail-update-log.md` | DONE 2026-07-17 — Q2/Q4 push, per-case before/after, 3/3 200 |
| Case source (79) | `build/filters/cases/cases-A..D-*.json` + `README.md` | DONE 2026-07-17 — all VIU-Pending; Q2/Q4 rulings applied to FLT-PERS-02 / FLT-TAB-02/03 |
| Coverage matrix | `build/filters/coverage-matrix.md` | DONE — 81/81 spec lines + 18/18 WO frames mapped; exclusions in §C |
| ID map | `build/filters/testrail-id-map.csv` | POPULATED 79/79 (2026-07-17, C29557–C29635) |
| TestRail import | `testrail-import/filters-v1-testrail-import.csv`/`.xlsx` | DELIVERED — IMPORTED BY THE USER 2026-07-17 (suite 1, group 4110); regenerated same day after the Q2/Q4 edits (matches TestRail) |
| Import generator | `build/filters/gen_import.py` | DONE (also regenerates the ID map) |
| PO questions | `build/filters/PO-Questions-Filters_2026-07-17.xlsx`/`.md` (+ `gen_po_questions.py`) | ANSWERED 2026-07-17 — see branko-answers-2026-07-17/ |
| This state doc | `build/filters/PROJECT-STATE.md` | current |

## §3 Open questions

Reader-facing product questions → the PO sheet (Q1 Parts/Reports scope, Q2
persistence duration, Q3 spelling, Q4 Estimates/Completed Status chip). QA-side
OQs live in `requirements.md` §"Open Questions": OQ-1 RESOLVED (numbering
artifact), **OQ-2** canonical Confluence URL TBC, **OQ-3** Epic/Jira key TBD (ask
at VIU), **OQ-4 RESOLVED 2026-07-20 (Branko Round-2 Q3=A: filter lists are
role-independent — same options for every role; no role-based cases needed;
glance-check across roles at VIU)**, **OQ-5 RESOLVED 2026-07-17 (Branko Q2=B:
permanent per-user persistence)**, **OQ-6**
"Asset on Site" data source in the build (FLT-ASSET-02 note), **OQ-7** QA env /
feature-flag / API surface unknown (FLT-API-01..05 worded generically,
VIU-confirm), **OQ-8** spec↔Figma reconciliation — DONE via authoring: deltas
found = the Estimates-tab Status chip conflict (PO Q4), the chip truncation
composition (list+ellipsis vs count, FLT-CHIP-02 note), and the Parts/Reports
screens with no spec (PO Q1).

## §4 Env / access

- ⚠️ **SUPERSEDED 2026-08-04 — SEE §0-QA-ENV AT THE TOP OF THIS DOC.** A QA branch now
  exists (`https://sv8785.qa.shopview.com`, filter bar on `/workorders`) and credentials
  are supplied in `/tmp/filters-viu/cookies.json` (path only — never a value in this repo).
  The API host `https://sv8785api.qa.shopview.com` is **inferred, not verified**. The
  feature-flag/settings state is **still unknown**. **No VIU has begun — the QA lead's
  explicit go-ahead is required and he has reserved it until Report Suite is complete.**
- ~~**TBD** — no QA environment, feature-flag status, or API endpoint known yet~~
  (OQ-7 — the environment half is now answered). Reuse the shared infra when VIU begins: `build/TESTING-RUNBOOK.md`,
  `build/APP-ACTIONS-PLAYBOOK.md`, quick-login/cookie method, harness scripts,
  TestRail API patterns. Secrets in `/tmp` only — never in the repo.

## §5 HOW TO RESUME (ordered)

1. Read this doc, then `build/filters/coverage-matrix.md` (scope + exclusions),
   then `requirements.md` / `design-notes.md` as needed.
2. **PO questions ANSWERED + Q2/Q4 APPLIED (2026-07-17):** Branko's answers
   are ingested (`branko-answers-2026-07-17/answers-ingested.md`); the Q2/Q4
   rewrites of FLT-PERS-02 / FLT-TAB-02/03 are DONE and PUSHED to TestRail
   (audit log `branko-answers-2026-07-17/testrail-update-log.md`). Still open
   from the answers: Q1 scope extension (Parts/Reports cases — WAIT for
   Branko's PRD update) and the VIU confirmation of the exact on-screen
   strings (esp. the Completed tab's pre-filled Status chip).
3. **TestRail: import DONE (user, 2026-07-17) + id-map populated** — cases live
   under suite 1 / group 4110; use `testrail-id-map.csv` for C-ids/links in all
   deliverables (Rule 8). Any TestRail EDIT still needs explicit user
   permission + a per-case audit log.
4. Before any VIU: ASK the user which process(es) to run (Standing Rule 11 —
   BUILD-ACCURATE-WORDING-VIU-PROCESS and/or SPEC-RELEVANCE-RECONCILIATION), and
   ASK for the Epic/Jira key (OQ-3) + canonical Confluence URL (OQ-2) + QA
   env/flag facts (OQ-7). VIU = live-observed with evidence only (Rules
   10/12/13/14); 24 cases carry explicit VIU-confirm notes to resolve first.
5. Regeneration: `python3 build/filters/gen_import.py` (import + ID map —
   ⚠️ blanks the C-id column; re-merge the populated C-ids afterwards),
   `python3 build/filters/gen_po_questions.py` (PO sheet).
