# Report Suite — VIU PUSH MANIFEST · 2026-08-04

**STATUS: EXECUTED** (see `testrail-execution-log.md` for the per-operation audit).

**Authorisation (QA lead, 2026-08-04):** *"Yes, Push the ~200 staged wording and note
corrections"* and *"Yes, Add the 3 proposed new cases (permission surface, PDF failure boundary,
one more)"*.

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| SBC spec | Confluence 577634305 | **v13**, 2026-07-31 | 2026-08-03 | CURRENT |
| SBR spec | Confluence 585629698 | **v15**, 2026-07-29 | 2026-08-03 | CURRENT |
| PV spec | Confluence 620888066 | **v4**, 2026-07-29 | 2026-08-03 | CURRENT |
| TU spec | Confluence 641400833 | **v5**, 2026-07-29 | 2026-08-03 | CURRENT |
| WIP spec | Confluence 703660034 | **v6**, 2026-07-29 | 2026-08-03 | CURRENT |
| IV spec | Confluence 720142338 | **v3**, 2026-07-29 | 2026-08-03 | CURRENT |
| Epic | SV-8582 | Tier-1 checked 2026-08-03; 6 stories reopened since our 2026-07-27 ingest | 2026-08-03 | **PARTIAL** — no full re-read (Rule 37 Tier 2 not authorised) |
| Designs | — | N/A, spec-only project, no Rule-35 queue | — | N/A |
| Tech plan | `tech-plan-2026-07-29/` | 2026-07-29, not re-fetched this run | — | **PARTIAL** |
| PO answers | Chris Ward | through 2026-08-01 | 2026-08-03 | CURRENT |
| **Live build** | `sv8582.qa.shopview.com` `v3.4.1-0ed4433` | index.html last-modified 2026-08-03 13:40:38 GMT | 2026-08-03/04 | **PARTIAL — DECLARED NOT FINAL (Rule 49)** |

Nothing in this pass may be called VIU-complete: the build is non-final and
`viu-2026-08-03/RECHECK-QUEUE.md` is **OPEN**.

---

## 1. THE OPERATION LIST — TOTALS

| Operation | Count |
|---|---:|
| `update_case` (wording / label / steps / tester-note corrections) | **35** |
| `add_case` | **3** |
| Section moves | **0** |
| `delete_case` | **0** (forbidden this pass) |
| `update_run` (run 359 union sync, Rule 34/47) | **1** |
| **TOTAL TestRail writes** | **39** |
| Rule-49 build-marker notes — **LOCAL ONLY, see §2** | **475** |

### The 35 `update_case` operations, by report

| Report | Cases |
|---|---|
| SBC / SBR | C30104 · C30202 · C30313 |
| PV / TU | C30346 · C30351 · C30353 · C30386 · C30423 · C30425 · C30442 |
| WIP | C30452 · C30457 · C30466 · C30467 · C30495 · C30502 · C30511 · C38916 · C38918 |
| IV | C30538 · C30551 · C30552 · C30554 · C30555 · C30556 · C30557 · C30566 · C30570 · C30580 · C30588 · C30590 · C30593 · C30595 · C38917 |

59 individual field changes across the 35 cases (title 5 · preconditions 6 ·
steps 12 · expected 36 · refs 0).

### The 3 `add_case` operations

| Internal ID | Section | Covers |
|---|---|---|
| **SBC-API-06** | `SBC — API` (4305) | **the permission surface** — the back end serves SBC report data **and** its export to a user holding only ordinary reports access, and refuses both without it. The SBC twin of PV-API-04 (C30391); the surface SV-8780 concerns. |
| **PV-EXP-12** | `PV — Exports` (4335) | **the PDF failure boundary** — a medium-sized Parts Velocity view whose CSV downloads but whose PDF fails outright, well below the 10,000-row cap that is supposed to refuse politely. |
| **IV-EXP-10** | `IV — Exports` (4373) | **one more** — the same failure class on Inventory Value, characterised as a ~30 s server-side timeout (31–33 s on every failure; the CSV of the identical scope returns in 0.8–2.2 s). |

All three: `custom_atmstatus: 3`, `custom_automation_type: 0`, `template_id: 1`.

---

## 2. RECONCILIATION AGAINST THE BATCHES' OWN COUNTS — AND TWO DISCREPANCIES

The QA lead's *"~200"* does **not** reconcile with the batches, and the batches do not
reconcile with each other or with TestRail. Both discrepancies are stated here rather than
quietly resolved.

### 2a. What the three batches counted

| Batch | Notes markers | Wording / refs edits | New cases | Its own stated write total |
|---|---:|---:|---:|---|
| `batch-sbc-sbr` | 195 | 3 refs + 27 Rule-42 + 9 rewords + 1 Rule-24 note = **40** | 0 | not stated |
| `batch-pv-tu` | 131 | **6** | 1 | "A (131) + B (6)" |
| `batch-wip-iv` | 149 | **34** (28 numbered entries, 6 covering two or three cases) | 2 | "**149 `update_case`**, 0 `add_case`" |
| **TOTAL** | **475** | **80** | **3** | — |

475 + the wording edits merged into the same cases = **475 `update_case`** if the notes
markers are TestRail writes. **That is not ~200, and it is not what happened.** Reason:

### 2b. DISCREPANCY 1 — there is no Notes field on TestRail for this project, so the 475 build markers cannot be TestRail writes

Verified with `get_case_fields` (read-only) on 2026-08-04. The whole field set available to
these cases is:

`refs` · `estimate` · `milestone_id` · `custom_expected` · `custom_goals` · `custom_mission` ·
`custom_preconds` · `custom_steps` · `custom_steps_separated` · `custom_testrail_bdd_scenario` ·
`custom_atmstatus` · `custom_automation_type` · `custom_ai_type` · `custom_ai_model`

**There is no Notes field.** The three batches each staged the Rule-49 marker "to the notes /
metadata layer", and `batch-wip-iv` costed it as 149 `update_case`; that plan assumed a
TestRail field that does not exist here. The three places it could otherwise go were each
rejected:

- **`refs`** — the marker is ~250 characters and the longest live `refs` in the group is
  already **245**. `refs` also splits on commas (playbook §J) and the marker contains commas,
  so it would fragment into pseudo-references. Refused.
- **`custom_mission` / `custom_goals`** — technically writable, but they are **null on all 480
  cases in the group and on every case in the entire workspace**; repurposing a field labelled
  "Mission" to hold build markers is a **new suite-wide convention on 475 cases and every
  future pass**. That is the QA lead's decision, not ours (Rule 6). **Refused — raised as an
  outstanding ask instead.**
- **`custom_expected`** — tester-facing. Forbidden by Rules 9/20.

**What was done instead:** all 475 build markers are written to the **local case source**
`build/report-suite/cases/*.json` `notes` field — which is the metadata layer that actually
exists, is committed to git (the only durable store, Rule 29), and is *stripped from the
TestRail import by design* (`gen_import.py`: "VIU-word-free: internal `viu_status`, `notes`,
`design_ref`") — plus the master `RECHECK-QUEUE.md`. Rule 49's obligations 1, 2 and 4 are
fully met; obligation 3 ("stamp the provenance on the case itself") is met **locally** and is
**flagged as PARTIAL on TestRail** pending the QA lead's ruling on which field to use.

### 2c. DISCREPANCY 2 — 45 of the 80 staged wording edits were NOT applied

They are itemised in §3. Nothing was dropped silently. The short version: the Rule-41
whole-case re-read found that **3 of them were already done**, **10 would have asserted build
behaviour over a spec requirement with no ruling behind it**, **6 are explicitly held for
Chris Ward**, and **30 (the Rule-42 sweep) offer two mutually exclusive treatments with no
per-case text and are contradicted by the master ledger's own field sweep**.

**Final reconciliation:** 80 staged wording items → **35 applied** (34 staged + 1 added by the
mandatory Rule-28 consistency sweep) · **45 held, each with a reason and an owner**.

---

## 3. WHAT WAS **NOT** APPLIED, AND WHY

The governing principle, applied uniformly, is the one `batch-pv-tu` used in its own section C
and `batch-wip-iv` used in its own section C:

> **Where the build's LABEL or MECHANISM differs and the tester otherwise cannot run the case,
> we adopt the build's wording (Rule 9). Where the build DEVIATES FROM A SPEC REQUIREMENT, our
> case stands and the build is reported (Rules 25/32/33) — a test case that fails a wrong build
> is doing its job.**

`batch-wip-iv`'s section B did not apply that line as consistently as its own section C did;
this pass applies it uniformly and says so.

### 3a. HELD FOR CHRIS WARD — explicitly flagged in the batches (6 cases)

| Case | What it asserts | Why held |
|---|---|---|
| WIP-COL-05 = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) | the Asset cell identifies the asset by its VIN | **asset-identifier chain.** Chris Ward 2026-07-29: *"A is the correct answer"* on VIN → Unit # → plate. Build shows unit number first per the un-updated WIP S4-R7. Third pass this edit has been owed. |
| WIP-SORT-03 = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) | the Asset column sorts by the identifier it shows | same ruling |
| WIP-FLT-03 = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) | each Asset filter option identifies by VIN | same ruling |
| WIP-FLT-06 = [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) **item 5** | the Location filter is not shown at all for a one-location user | **single-location filter.** Chris Ward 2026-07-31 Q1=A: hidden. Build follows the stale IV S7-N1 / WIP text. |
| IV-LOC-04 = [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) | same | same ruling |
| WIP-SUM-05 = [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) | the Estimates figure is the tab's total **quoted** value | **Estimates quoted value.** WIP S5-R8 verbatim; the build shows $0.00 (it is showing approved value). Our case is right — do not weaken it. |

### 3b. ALREADY CORRECT — the staged edit was written against stale case text (3 cases)

Caught by the Rule-41 end-to-end re-read. **Applying these would have introduced
contradictions**, because the Location coverage the batch wanted to add is already present and
already scope-conditional.

| Case | Staged proposal | What the case already says |
|---|---|---|
| SBR-EXP-10 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) | "OUR case needs Location adding to the header list" | expected **item 7** already reads *"When more than one location is in scope the file also carries a Location column…"*, and item 2's enumeration is already scope-conditional (*"With a single location in scope the headers…"*). Adding Location to item 2 would contradict item 2's own condition and duplicate item 7. |
| SBR-EXP-11 = [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) | same | expected **item 5** already reads *"…the file also carries a Location column immediately after Status — the position it holds on screen…"* |
| SBR-ROW-02 = [C30218](https://shopview.testrail.io/index.php?/cases/view/30218) | "PROPOSED: 13 columns in order… OUR case is the stale side" | expected item 1 already reads *"…12 columns. When more than one location is in scope the automatic Location column is added immediately after Status, making 13."* |

These three were fixed by the authorised 2026-07-31 push (the Rule-40/44 lesson push); the
`batch-sbc-sbr` proposal predates that state. **Residual, reported not fixed:** C30218's
*title* still says "12 columns" while its expected result is 12-or-13 — a title-vs-expected
nit, not a defect, left for the title-trim pass.

### 3c. THE BUILD DEVIATES FROM A SPEC REQUIREMENT — our case stands (10 cases)

`batch-wip-iv` section B proposed rewriting each of these to the build. Each is a build defect
or an unbuilt requirement that the batch **itself** describes as such, so rewriting it would
delete the only thing that catches it.

| Case | Requirement | Build | The batch's own words |
|---|---|---|---|
| IV-COL-04 = [C30554](https://shopview.testrail.io/index.php?/cases/view/30554) items 1–2 | IV S3-R13 / S8-R3: Margin and Total Sell hidden by default | all twelve columns show | *"an unbuilt default"* |
| WIP-FLT-06 = [C30503](https://shopview.testrail.io/index.php?/cases/view/30503) item 2 | WIP S7-R9: first visit defaults to the active location | reads "All locations" | `batch-pv-tu` §C#9 calls the identical PV/TU behaviour *"Build defect on the default"* |
| IV-NAV-03 = [C30536](https://shopview.testrail.io/index.php?/cases/view/30536) | IV S1-R3 | same | same |
| IV-LOC-01 = [C30574](https://shopview.testrail.io/index.php?/cases/view/30574) | IV S7-R2 | same | same |
| IV-DATE-05 = [C30565](https://shopview.testrail.io/index.php?/cases/view/30565) | IV S5-R6: the "As of" indicator is **not** shown when the day matches | always shown | — |
| IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) item 1 | IV S10-R3: file columns = screen columns, screen order, Total Cost last | export ignores the column selection and re-orders | CHANGE-LEDGER row 18: *"Implementation slip"* |
| IV-EXP-03 = [C30589](https://shopview.testrail.io/index.php?/cases/view/30589) | IV Story 10: CSV money as plain numbers | writes `"$11,176.88"` — money imports as **text** | *"a genuine deviation with a real user cost"* |
| IV-VIS-02 = [C30597](https://shopview.testrail.io/index.php?/cases/view/30597) | IV S12-R3: date control first | part search first | — |
| WIP-VIS-01 = [C30519](https://shopview.testrail.io/index.php?/cases/view/30519) | WIP S10-R1: white column headers | `rgb(249,250,251)` | `batch-pv-tu` §C#12 calls the same token drift *"a design decision for the PO"* |
| IV-VIS-01 = [C30596](https://shopview.testrail.io/index.php?/cases/view/30596) | IV S12-R1: same | same | same |

**Consequence for the new cases:** because C30589 was **not** rewritten, the IV spec's
plain-number CSV requirement is still covered, so `batch-wip-iv`'s proposed **E2** ("money
columns import as text") is **unnecessary** and was not authored. Its slot went to **E1**, the
IV PDF failure, which nothing covers.

### 3d. THE SHARED DATE-PICKER PRESET LIST — a product decision Chris Ward owes (6 cases)

`batch-pv-tu`'s own OUTSTANDING item 3 names this: *"A ruling on the two product questions in
section C, which are Chris Ward's to answer, not ours: … the shared date-picker preset list
(#13). Both are shipped strings; our cases follow the spec and currently fail the build."*
The specs close an **eleven**-option list (SBC S2-R2 · SBR S2-R2 · WIP S7-R6 · IV S5-R1); the
build ships **nine** plus an inline calendar, in **one shared component serving all six
reports**. Rewriting six cases to nine would assert the build over four current specs with no
ruling.

**Enumerations HELD:** SBC-DATE-01 = [C30102](https://shopview.testrail.io/index.php?/cases/view/30102) ·
SBR-DATE-01 = [C30201](https://shopview.testrail.io/index.php?/cases/view/30201) ·
WIP-FLT-04 = [C30501](https://shopview.testrail.io/index.php?/cases/view/30501) ·
IV-DATE-01 = [C30561](https://shopview.testrail.io/index.php?/cases/view/30561) ·
plus the cap figure in WIP-FLT-05 = [C30502](https://shopview.testrail.io/index.php?/cases/view/30502)
(spec S7-R8 says 366; observed 367 accepted / 368 refused — a one-day difference in the same
shared component).

**But the un-runnable STEPS were fixed**, because a step a tester cannot perform is a hard
Rule-28 failure independent of any product decision: **C30104** and **C30202** told the tester
to choose a *"Custom"* item that does not exist (the master ledger flags C30104 as the suite's
one non-executable step), and **C30502** / **C30566** did the same. All four now say how a
custom range is actually picked on this build; **not one expected-result enumeration was
touched.**

### 3e. THE REP LABEL — three sources, three words (2 cases)

CHANGE-LEDGER row 17, verbatim: *"**Three different words from three sources.** Do not edit
until Chris rules."* Spec says `Sales Rep`; Chris ruled `Sales Representative`; the build's CSV
says `Representative` and the work-order field says `Sales rep`.
**Held:** SBR-WO-01 = [C30310](https://shopview.testrail.io/index.php?/cases/view/30310) (the
staged "Sales rep" relabel) · SBR-WO-06 = [C30315](https://shopview.testrail.io/index.php?/cases/view/30315).
`batch-sbc-sbr` proposed relabelling both; the ledger forbids it. Latest ruling wins (Rule 32),
and the ledger is the pass's own consolidated position.
**SBR-WO-04 = [C30313](https://shopview.testrail.io/index.php?/cases/view/30313) WAS applied** —
its edit is the Standing Rule 24 tester note, not a label.

### 3f. TWO SOURCES CONTRADICT EACH OTHER — needs a ruling (2 cases)

| Case | CHANGE-LEDGER row 3 says | `batch-sbc-sbr` §4 says |
|---|---|---|
| SBC-EXP-15 = [C30173](https://shopview.testrail.io/index.php?/cases/view/30173) | *"**No file downloads.** A warning appears reading 'Empty export'"* | *"the file **does** download with the 'Locations:' line and the column headers, but there is NO totals row"* |
| SBR-EXP-16 = [C30291](https://shopview.testrail.io/index.php?/cases/view/30291) | — | same shape; *"QA lead's call"* |

Two documents from the same pass disagree about what the build does on an empty export. Not
resolvable by picking one. **Held for a re-observation** (queued in the recheck queue).

### 3g. THE PO SHOULD SEE IT FIRST — the batch says so (2 cases)

| Case | Staged proposal | The batch's own caveat |
|---|---|---|
| SBC-VIS-02 = [C30186](https://shopview.testrail.io/index.php?/cases/view/30186) | every row uses the same light background | *"but confirm with the PO first, because this may be a styling gap rather than the intended design"* |
| SBC-NAV-01 = [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) | listed under the SALES heading | *"but ASK the PO first: the spec says Performance, the build says SALES, and Chris's companion video described a new grouping"* |

CHANGE-LEDGER row 2 argues C30096 is safe (*"the spec names no group at all"*); the later batch
says ask first. Latest wins (Rule 32) → **held**.

### 3h. NO PROPOSED TEXT AT ALL (7 cases)

`batch-sbc-sbr` §4 marks each **HOLD** with *"no proposed text"* — in every case because the
build offers nothing to write the case against (no empty-state message exists to quote, no
totals bar exists, no inline error with a Retry control exists, and no range can be put in a
page link). Nothing to apply.

SBC-DATE-04 = [C30105](https://shopview.testrail.io/index.php?/cases/view/30105) ·
SBC-PERS-06 = [C30179](https://shopview.testrail.io/index.php?/cases/view/30179) ·
SBC-EMPTY-01 = [C30181](https://shopview.testrail.io/index.php?/cases/view/30181) ·
SBC-EMPTY-02 = [C30182](https://shopview.testrail.io/index.php?/cases/view/30182) ·
SBR-TOT-03 = [C30239](https://shopview.testrail.io/index.php?/cases/view/30239) ·
SBR-STATE-01 = [C30298](https://shopview.testrail.io/index.php?/cases/view/30298) ·
SBR-STATE-04 = [C30301](https://shopview.testrail.io/index.php?/cases/view/30301)

### 3i. THE RULE-42 SWEEP — 27 enumerations + 3 missing anchors (30 cases)

`batch-sbc-sbr` §3 lists 27 cases containing the word "exactly" and §2 lists 3 whose `refs`
cite a spec **section** in prose but no `Sn-Rn` anchor. **Neither was applied**, for three
reasons together:

1. **No per-case text, and two mutually exclusive treatments.** §3 says each needs *"either a
   version-pinned anchor in `refs` **or** scope-conditional wording"* — choosing per case, for
   27 cases, is authoring, not applying. §2 says in as many words that the anchor convention
   *"needs the QA lead's call"*.
2. **The master ledger of the same pass says the opposite.** Its field sweep reads: *"Rule 42
   compliance is good: the closed 'exactly this list' enumerations I checked … are all
   scope-conditional or version-pinned with the anchor that closes them"*, and *"**No reference
   change is needed anywhere**"* with PV-PREC-02 as the single documented exception. Two
   documents from one pass disagree on whether these 30 are compliant.
3. **Most of the 27 hits are not enumerations at all.** The list was built by keyword: *"sum
   **exactly** to that asset's row total"*, *"restored **exactly** as set"*, *"**exactly** one
   summary row"*, *"drop by **exactly** that invoice's amounts"* — pinning a spec version into
   the `refs` of those adds noise, not traceability. On the ones that genuinely close a label
   list, several already carry the closing anchor (C30102's `refs` reads *"S2-R2 CLOSES the
   eleven-option list … re-check this case whenever S2-R2 changes"*).

**Also blocking mechanically:** the longest live `refs` in the group is **245 characters** and
TestRail rejects any entry over 248 with HTTP 400 *"Field :refs does not match the required
pattern."* Several of the 27 could not take a version pin without being rewritten.

Full list carried into the outstanding register.

---

## 4. WHAT PROTECTED THE PASS

- **Rule 41 (whole-case re-read):** every one of the 35 touched cases was re-read end to end
  against its current spec before saving, and the per-case line is in the execution log. This
  found §3b — three staged edits that were already done and would have created contradictions.
- **Rule 28 (cross-case consistency):** a sweep for the refuted *"Location is automatic / not
  in the column selector"* assertion found **18 cases across all six reports**. Only the **9**
  in WIP and IV were corrected, because the mechanism was live-proven only there — the PV
  picker's 20 entries were read live and contain no Location, so PV/SBC/SBR/TU keep the
  automatic model. **C38917 (IV-LOC-06) was not in any batch's list** and makes the same
  refuted assertion; leaving it out would have shipped a self-contradiction, so the sweep added
  it. See `CONTRADICTION-SWEEP.md`.
- **Rule 50 (exhaustive then exact):** every replacement asserts its `old` text occurs
  **exactly once** in the pre-write snapshot, so no payload can be built from a fuzzy match;
  every write is re-GET and compared field by field, with every untouched field proven
  byte-identical.
- **Rule 38 (foreign cases):** the executor refuses any case whose `created_by != 3`, and
  C38919–C38923 are proven byte-identical after the run, `updated_on`/`updated_by` included.

## 5. RUN SYNC (Standing Rules 34 / 47)

Run **359** — *"Reports Suite - Nebojsa/Viktoria (VIU Pending)"* — is `include_all: false`, so
it does **not** pick up new cases. Before: **475 tests / 539 result records**. The three new
cases are added by sending the **FULL UNION** of the run's current `case_ids` and the three new
ids. Snapshots `snapshots/PRE-run359-tests.json` and `snapshots/PRE-run359-results.json` were
taken **before** the write; afterwards the test count, the case_id sets in **both directions**
and **every one of the 539 result records BY ID** are verified.
