# C29600 and C29632 — the recording fix, before and after

**Filters project. 2026-08-11.** Investigation:
`build/filters/c29600-sourcing-2026-08-11/FINDINGS.md` (commit `6087a31a`).

**WHAT THIS PASS CHANGED: `refs` and the provenance material. NOTHING ELSE.**
**Titles, preconditions, steps and every assertion are byte-identical to what was live before the
write — proven field by field below, not asserted.** See `FOR-VLAD.md`.

**Scope actually executed: 2 × `update_case`. 0 `add_case` · 0 `delete_case` · 0 section ops ·
0 run writes · 0 results logged · 0 Jira calls of any kind.** No build was opened; `quick-login` and
`switch-user` were **not** called, and **no build stamp was added or refreshed** (this is a documents
fix — Rule 57: the build is not a source of expected behaviour).

---

## SOURCE CURRENCY (Standing Rule 31)

| Source | Identifier | Version / date | Read | Verdict |
|---|---|---|---|---|
| Filters specification | Confluence page **572030978** | **version 19**, published 2026-08-06T11:48:47Z | 2026-08-11 (via FINDINGS, which fetched it live at HTTP 200) | **CURRENT** |
| Engineering technical design | `build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md` | **no version of its own**; records `Spec baseline: v1.3` (line 124); uploaded 2026-07-29 | 2026-08-11, quotes re-verified line by line for this pass | **PARTIAL — undated, and its own baseline predates spec v17–v19. Recorded as such on both cases rather than dressed up as a version.** |
| TestRail C29600 / C29632 | live `get_case` | — | 2026-08-11 | **CURRENT** |
| Run 352 | live `get_run` / `get_tests` / `get_results_for_run` | — | 2026-08-11, before and after | **CURRENT** |

**The two technical-design quotes were re-verified verbatim for this pass, not taken on trust from
the findings file:**

> **§1.8 Tests + phase gate** (heading at line 319; quote at line 323): *"**Functional — WO listing
> filters:** repeated-eq `status` values OR'd; `tech_assigned_id` + `service_advisor_id` repeated-eq
> (UUID→bytes conversion) return the right WOs **and AND across fields**; `vehicleHere=0` per 1.6;
> non-whitelisted field still rejected (`FilterException`)."*

> **§0.3 FilterDecorator multi-value convention** (heading at line 215; quotes at lines 218 and 221):
> *"Same-field filters are grouped and OR'd (`decorateQuery()` lines 37–55) — repeated `eq` on one
> field is a de-facto IN."* and *"send ALL multi-select filters as repeated same-field `eq` entries —
> statuses as `filters[N][field]=status&filters[N][value]=estimate`, UUIDs as repeated `eq` too"*.

**That second quote is the literal origin of C29632's request shape**, which is why the case now
cites it.

---

## 1. C29600 — [C29600](https://shopview.testrail.io/index.php?/cases/view/29600)

**Section 4117 · `custom_atmstatus = 3` (AUTOMATED) · `custom_automation_type = 0`**

### 1a. `refs`

**BEFORE**

```
SV-8793 (§2 Feature Overview (multi-criteria); S8-R3 ('combination of active filters')) [spec v19 2026-08-06]
```

**AFTER** (246 characters — inside TestRail's 248-char per-comma-entry limit, and comma-free per
house style)

```
SV-8793 (§2 Feature Overview: active chips + 'Clear filters' button; Tech Plan §0.3 + §1.8 'AND across fields' for the intersection - the specification states no cross-filter rule) [spec v19 2026-08-06; tech plan 2026-07-29 undated baseline v1.3]
```

### 1b. Why each part of that changed

| Change | The source, quoted | Why |
|---|---|---|
| `(multi-criteria)` → `: active chips + 'Clear filters' button` | **The phrase "multi-criteria" is not in §2 and never has been.** Its two occurrences are §1 Business Case (*"Adding a persistent, **multi-criteria** filter bar…"*) and §3 Goals (*"Allow **multi-criteria** filtering in a single interaction"*) — and that is the count in **every** version checked: v4, v12, v17, v18, v19. | A factual mis-attribution. §2 **does** source two of the case's three assertions, so it is now cited for what it actually says: *"When one or more values are selected in a filter, the chip updates to display the selected values and a 'Clear filters' button appears in the filter bar"*. |
| `S8-R3 ('combination of active filters')` **dropped** | **S8-R3 verbatim:** *"When the combination of active filters and any active search query produces **no matching records**, the table shows an **empty state** with a message indicating no results were found for the current filters and search"* | **S8-R3 is the empty-state requirement.** *"The combination of active filters"* is the grammatical **subject** — the thing that produces no matches — not a definition of how the combination is computed. It **presupposes** that filters combine; it never says how. The correct user of that anchor is [C29606](https://shopview.testrail.io/index.php?/cases/view/29606), which tests the empty state. |
| **Tech Plan §0.3 + §1.8 added** | §1.8: *"…return the right WOs **and AND across fields**"* | **This is the case's third assertion, exactly.** Under Standing Rule 57(d3) the technical design is an authoritative source, so the case **is** sourced — it was simply pointing at the wrong document. |
| `- the specification states no cross-filter rule` added | Boolean `AND` appears **exactly once** in the whole specification, at **S13-R10** — *"Search and filters are additive (AND)"* — which is **search-versus-filters**, not filter-versus-filter. | Rule 42 honesty: the reader must be able to see that the PRD is silent, rather than discover it by checking. |

### 1c. Expected Results

**BEFORE — the entire field was one sentence, with no provenance line and no automation marker:**

```
Two active chips, a visible Clear Filters button, and exactly the intersection of both filters in the table
```

**AFTER**

```
Two active chips, a visible Clear Filters button, and exactly the intersection of both filters in the table

Note on where each part comes from: the two active chips and the Clear Filters button are both stated in the product description. The "matching both" part is not - the product description never says what should happen when two different filters are used at the same time. That rule is stated in the engineering technical design, which requires the filters to combine with "AND across fields".

---
This is the expected behaviour as per story SV-8793 and the Filters specification at Confluence version 19 (published 6 August 2026) (§2 Feature Overview), read on 11 August 2026, and as per the engineering technical design for the app-wide filter redesign (§0.3 and §1.8), read on 11 August 2026 - that document carries no version number of its own and records its own baseline as "Spec baseline: v1.3".

AUTOMATION: READY
```

**Line 1 is byte-identical to the whole of the previous field.** Everything after it is new
recording: the Rule-42 honesty note, the Rule-54 provenance line, and the Rule-61/marker line.

**Three deliberate choices in that provenance line:**

1. **Sentence 2 is OMITTED.** No build check happened in this pass, and the case carries no record of
   one ever having happened, so a *"Last checked against build …"* sentence would assert an
   observation we did not make (Rules 12 and 54).
2. **The technical design is named as undated**, with its own `Spec baseline: v1.3` line quoted,
   rather than given an invented version number (Rule 12).
3. **The marker is plain `AUTOMATION: READY`, not `READY - EXPECT FAIL`.** Nothing backs an
   expect-fail: no ticket exists for this, the behaviour reportedly matches, and Rule 61 as amended
   requires an expect-fail marker to name an **observed symptom** — we have none, because we did not
   open the build.

---

## 2. C29632 — [C29632](https://shopview.testrail.io/index.php?/cases/view/29632)

**Section 4124 (API) · `custom_atmstatus = 1` · `custom_automation_type = 0`**

### 2a. `refs`

**BEFORE**

```
SV-8785 [epic] (S2-R2; S3-R6; S8-R3 (backend view)) [spec v19 2026-08-06]
```

**AFTER** (212 characters, comma-free)

```
SV-8785 [epic] (S2-R2; S3-R6; Tech Plan §0.3 repeated-eq request shape + §1.8 'AND across fields' - the specification states no cross-filter rule) [spec v19 2026-08-06; tech plan 2026-07-29 undated baseline v1.3]
```

### 2b. What was kept, and why

**`S2-R2` and `S3-R6` are KEPT EXACTLY AS THEY WERE**, because they genuinely source the case's
`B3b` assertion, verbatim:

| The case asserts | The cited requirement, verbatim | Verdict |
|---|---|---|
| *"the two statuses **combine as either-or**"* | **S2-R2:** *"The user can select one or more statuses; the table updates to show only work orders matching **any** of the selected statuses"* | ✅ **STATED, verbatim.** *"any of"* is OR. |
| (the same for customers) | **S3-R6:** *"…belonging to **any** of the selected customers"* | ✅ **STATED, verbatim.** |

**Only `S8-R3 (backend view)` was replaced.** It is the empty-state requirement (quoted in §1b above)
and it does not describe a backend view of anything. In its place sit the two technical-design
sections that **do** carry the case's claims — §0.3 for the `filters[N][field]=…` request shape
asserted in item 1, and §1.8 for the *"both restrict the result"* half of item 3.

### 2c. Expected Results

**BEFORE**

```
1. One request carries both filters together (both statuses and the customer).
2. The response returns customer A's Estimate and Approved work orders only.
3. Customer B's work orders are absent - the customer filter and status filter both restrict the result, while the two statuses combine as either-or.

---
This is the expected behaviour as per epic SV-8785 and the Filters specification at Confluence version 19 (published 6 August 2026) (S2-R2, S3-R6, S8-R3). Last checked against build v3.4.2-d00239b on 8/5/2026.

AUTOMATION: READY
```

**AFTER**

```
1. One request carries both filters together (both statuses and the customer).
2. The response returns customer A's Estimate and Approved work orders only.
3. Customer B's work orders are absent - the customer filter and status filter both restrict the result, while the two statuses combine as either-or.

Note on where each part comes from: the "either-or" part of item 3 - that ticking two statuses shows work orders matching either of them - is stated in the product description. The part that says the customer filter and the status filter both restrict the result is not, and neither is the shape of the single request in item 1. Both of those come from the engineering technical design, which requires the filters to combine with "AND across fields" and sets out how the request is put together.

---
This is the expected behaviour as per epic SV-8785 and the Filters specification at Confluence version 19 (published 6 August 2026) (S2-R2, S3-R6), read on 11 August 2026, and as per the engineering technical design for the app-wide filter redesign (§0.3 and §1.8), read on 11 August 2026 - that document carries no version number of its own and records its own baseline as "Spec baseline: v1.3". Last checked against build v3.4.2-d00239b on 8/5/2026.

AUTOMATION: READY
```

**Items 1, 2 and 3 are byte-identical.** Three things moved: `S8-R3` came out of the provenance
line's anchor list, the technical design and the read dates went in, and the Rule-42 honesty note was
added.

**The existing build stamp — *"Last checked against build v3.4.2-d00239b on 8/5/2026"* — was KEPT
BYTE-IDENTICAL.** It is a true historical record of a check that did happen, and this pass was
instructed neither to add nor to refresh a build stamp. Deleting a true record would have been the
only way to get it wrong.

---

## 3. WHAT WAS DELIBERATELY *NOT* DONE

| Not done | Why |
|---|---|
| **No assertion, step, precondition or title touched on either case** | The finding was that the cases are **correctly supported claims pointing at the wrong document**. The wrong document is the defect; the claim is not. |
| **No case deleted or retired** | Both carry real coverage, and both are sourced (Rule 57(d3)). Rule 64 does not bite. |
| **No `AUTOMATION: HOLD`, no `EXPECT FAIL`** | Neither case is waiting on anything, and nothing observed backs an expect-fail. |
| **No Rule-56 divergence sentence** | Rule 56's honesty half **bars** one where nothing diverged. The specification is **SILENT here, not contradictory** — there is nothing for the technical design to overrule, so writing a divergence sentence would have manufactured a conflict that does not exist. |
| **No build opened, no build stamp added or refreshed** | This is a documents fix. Under Rule 57 the build could not answer the question anyway. |
| **The superseded 2026-08-06 workbook pair was not regenerated** | Its SUPERSEDED banner lives in the emitted files, not in `gen_branko_sheet.py`, so running that generator would have **wiped the banner**. Proven untouched: both files byte-identical after this pass (`diff` and `cmp` both clean). |
| **`build/unsourced-cases-2026-08-11/CANDIDATES.md` not edited** | It wrongly states C29600 is already on Branko's sheet. **It is not** — zero hits across both markdown files, the README and every XML part of both workbooks. Flagged, not rewritten: silently correcting another pass's recorded verdict is not ours to do (Rules 33 and 44). |

---

## 4. THE OPEN QUESTION THESE TWO CASES NOW SIT UNDER

**Standing Rule 57 records an OPEN question for the QA lead, and expressly does not answer it: does a
TECHNICAL DESIGN carry PRD-level authority on what the product should do, or does Rule 30's
*"informs but never overrules"* still hold for it?**

**These two cases now turn on that question**, alongside the nine in class C-3 of
`build/unsourced-cases-2026-08-11/CANDIDATES.md` — **eleven in total, not nine.**

**The mitigating fact, and it is why nothing is held:** the specification is **silent**, not
contradictory. There is nothing for the technical design to overrule, so on the strictest reading of
Rule 30 these cases still stand. **If the answer ever comes back the other way, both cases lose their
source and would need re-deriving** — which is exactly why the technical design is now named on them
instead of being invisible.
