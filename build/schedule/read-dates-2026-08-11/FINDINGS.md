# Schedule — FINDINGS from the read-dates pass (2026-08-11)

Everything the Rule-41 whole-case re-read surfaced, plus everything else this pass learned. **Nothing
here was silently fixed and nothing here was silently left** — each item says which it is.

---

## 1. The whole-case re-read of all 174 came back CLEAN — 0 real defects

All 174 cases were re-read end to end against the current specification (Confluence **v27**) before
any write. Every check passed on every case:

| Check | Result |
|---|---|
| Every `§` anchor cited anywhere in the case exists as a heading in spec v27 | **174/174 pass** |
| Every provenance line names specification version **27** | **174/174** |
| Exactly one provenance sentence-1 per case | **174/174** |
| Exactly one `AUTOMATION:` marker, one of the three permitted forms, and **last** | **174/174** |
| Raw HTML markup shown to the tester | **0** |
| The barred phrase *"as per the build tested on"*, or any wording crediting the build for the expectation | **0** |
| The word "VIU" or a feature-flag name in tester-facing text | **0** |
| API content (HTTP verbs / status codes / `/api/`) outside an API-titled section — Rule 4 | **0** |
| Titles over 80 characters | **0** |
| The `---` separator before the provenance block | **174/174** |
| `refs` carries a Jira key | **174/174** |

**This is a genuinely good result and it is worth saying so plainly:** the suite's provenance
discipline held up under a field-by-field re-read, which is not what earlier passes on other projects
found.

---

## 2. Two checker FALSE POSITIVES — recorded so a future pass does not "fix" them

My Rule-41 checker flagged two cases for *"refs carries no spec anchor"*. **Both cases are correct as
written; the checker's regex was too narrow**, because it only recognised a `§` or an `S<n>-R<n>`
anchor and both of these legitimately anchor to something else.

| Case | `refs` | Why it is right |
|---|---|---|
| **SCH-NAV-08 = [C43554](https://shopview.testrail.io/index.php?/cases/view/43554)** | `SV-8863 (SV-8686 acceptance criterion - grid displays with day view as default)` | The specification **is silent** on which view the page opens on. The expectation comes from **story SV-8686's acceptance criterion**, and that is exactly what `refs` names. Rule 20 wants the ticket **and the source anchor**; the source here is a story AC, not a spec section. |
| **SCH-API-04 = [C38875](https://shopview.testrail.io/index.php?/cases/view/38875)** | `SV-8685 [epic - cross-cutting,no single-story owner] (tech-plan NFR-001 location scoping)` | The expectation comes from the **engineering technical plan**, so the anchor is a tech-plan anchor (`NFR-001`). The epic key is correct for a cross-cutting case with no single-story owner, and it says so. |

**Not changed.** Recorded here so the next pass to run a traceability sweep does not read these as
gaps and "repair" them into something less accurate.

---

## 3. A correction to this pass's own first measurement — 167 cite the specification, not 174

`SOURCE-CURRENCY.md`'s first draft said **174 of 174** cases cite the specification. That came from a
loose substring match and **it is wrong. The figure is 167.**

**Seven cases mention the specification only to say it does NOT cover the point:**

* **C38867, C38868, C38869, C38870, C38871, C38875** — *"No numbered requirement in the Schedule
  specification version 27 covers this point."* Their source is the engineering technical plan.
* **C43554** — *"The Schedule specification version 27 does not say which view the page opens on, so
  this expectation comes from the story rather than the specification."*

**A negative mention is not a citation.** Stamping a read-date onto one would have made the case read
as though the specification supports an expectation it explicitly does not — a false-authority defect
of exactly the kind Rules 46 and 54 exist to prevent. **The stamper skips them by design**, and the
rule that separates them is mechanical and was verified across all 174 first: **every genuine
specification citation in this suite carries a section anchor in parentheses, and every negative
mention carries none.**

`SOURCE-CURRENCY.md` carries the correction inline rather than being silently overwritten.

---

## 4. The `trlib.getall()` pagination bug — the real cause, and it is not what the brief describes

The brief says `getall()` *"appends `?limit=` to a URL that already contains `?`"*. **That is the
symptom; the cause is one level down and worth recording properly** (Rule 27 — the books are the shared
brain, and a wrong diagnosis gets re-derived).

**TestRail's real URL shape is `index.php?/api/v2/<endpoint>&param=…`.** The whole API path lives
*inside* the `index.php` query string, so **every parameter after the endpoint is joined with `&`,
never `?`** — including the first one. Sending `?` anywhere in it returns:

```
HTTP 400  {"error": "Invalid characters in URI: [/api/v2/get_cases/1?suite_id]"}
```

**So `get_cases/1?suite_id=1` fails for the same reason `…&limit=` appended after a `?` fails.** The
fix in `tools/tr.py` is to build the query with `&` throughout and to follow `_links.next` exactly as
TestRail returns it, splitting on `/api/v2/`. **No sampling was used anywhere to work around it** — the
full unpaged population is 4,089 cases across 626 sections, and both were pulled complete.

**This belongs in `build/APP-ACTIONS-PLAYBOOK.md` §J.** It is **not edited from here** — that file is
shared across the parallel workers and this pass has no charter to touch it. Flagged for the QA lead.

---

## 5. Run 357 has moved since our last record — Ayesha's grading, not damage

Recorded because the next reader will otherwise diff against the 2026-08-10 note and see a
discrepancy.

| | 2026-08-10 record | Now (2026-08-11) |
|---|---|---|
| Tests | 168 | **174** |
| Result records | 429 | **458** |
| Counters | 0 passed / 0 failed / 0 blocked / 168 untested | **25 passed / 1 blocked / 148 untested** |

The **+6 tests** are the panel-collapse cases synced in on 11 August. The **+29 results and the 25
passes** are **Ayesha Khan grading her own run**. None of it is ours, and this pass changed none of it:
all 458 prior results are present by id with **0 graded-field changes and 0 non-graded changes**.

---

## 6. The bulk `get_cases` endpoint does NOT differ from `get_case`, measured on all 174

A known hazard elsewhere in this workspace is a bulk-read returning different text from the
per-case read. **Ruled out here exhaustively rather than by sample:** all 174 cases were fetched
individually and **every field byte-compared against the bulk response — 0 differences.** So the
pre-write snapshot this pass reasoned on is authoritative.

---

## 7. What this pass did NOT establish, said plainly

1. **No build fact.** The build was never opened. **Sentence 2 was not added to any case**, because
   **0 of 174 Schedule cases have been verified against the build now running** — the 11 August
   verification attempt observed 0 of 174 before its session died. Every case's existing
   `Last checked against build …` line is byte-identical to what it said before this pass, and those
   lines name **`v3.5-d122eef`** (which no longer exists), **`v3.5-7ec992f`** and, on the six
   panel-collapse cases, **`v3.5-af3a6e1`**.
2. **The design source is still PARTIAL and undatable.** SV-8915/8916/8917 cite a live, editable
   `claude.ai/design/p/…?via=share` link with no version and no date. **It cannot be given a read-date
   at all**, which is the sharp edge of this whole amendment: a source with no identity of its own
   cannot be pinned to a state. **No Schedule case cites a design**, so nothing was stamped for it —
   but if one ever does, this is unresolved. Standing outstanding item.
3. **The tech plan's currency cannot be asserted.** It is a file we were handed, not a source we can
   poll. Its read-date is honest; *"current"* is not claimed (Rule 12).

---

## OUTSTANDING — what I need from you

1. **A read-dates sweep is owed on the other two projects.** This pass covered **Schedule only**.
   **Filters (114 cases) and the Report Suite (476 cases) carry no read-dates at all**, so neither may
   be described as compliant with the 2026-08-11 amendment. Already logged in
   `build/OUTSTANDING-ITEMS-REGISTER.md`; this pass adds the evidence that the method works and is
   cheap — 174 cases in about nine minutes of writes.
2. **The playbook §J note on the TestRail pagination cause** (finding 4). One paragraph, not edited
   from here because that file is shared with the workers running in parallel.
3. **Which design artefact is canonical for Schedule** — the prototype we hold, or the undated
   editable share link on SV-8915/8916/8917. Outstanding since 6 August, and this amendment makes it
   worse: an undated source cannot carry a read-date.
4. **A Schedule build verification.** All 174 cases are **final but not build-verified** (0 of 174
   observed on the running build), and the release is Thursday. Not this pass's charter; stated because
   the read-date work does not reduce it by one case.
