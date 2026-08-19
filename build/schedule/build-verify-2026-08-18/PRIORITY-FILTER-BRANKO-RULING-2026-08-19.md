# Schedule — Priority filter REMOVED (Branko ruling 2026-08-19): proposal (READ-ONLY, NOTHING EXECUTED)

**Status:** PROPOSAL only. **No TestRail write, no Jira, no staging** was performed for this document.
Ticket/case creation and edits remain on hold (Rule 62 / hold H1). This doc is decision-ready for the
QA lead to authorise.

## The ruling that triggers this

Branko (PO for Schedule, epic **SV-8685**) ruled **2026-08-19**, verbatim:

> **"Proceed without it, I'll remove that part from the PRD."**

…referring to the Schedule work-order sidebar filter **Priority** group (spec **v30 §5.1**). So the
Priority filter group is **intentionally removed**, not merely pending development. The live build
already omits it: the Filters popover shows **only Assignment + Status** (observed on `v3.8-bd246fd`,
8/18/2026 — batch-A finding **D1**, `A-FINDINGS.md`).

This **resolves batch-A flag D1 / register row SCH-BV-3's Priority line**: C29945 had been Rule-69
**DEFERRED as "feature not found — under development"**, which is now **wrong** — the feature is
deliberately removed, so the correct treatment is a positive test of its **absence**, not a deferral.

---

## 1. Test → case mapping

- **TestRail test `1845401`** (run **357**, status **Blocked**) → **case_id `29945`** =
  **SCH-FILT-04**, title *"Priority filter offers High, Medium, Low and narrows the list accordingly"*.

## 2. Every Schedule case touching "Priority" in the filter context

Full scan of Schedule group **4254** (sections 4254–4281): **exactly 3** cases mention priority, all in
section **4258 "Sidebar - Work Order Filters"**.

### C29945 = SCH-FILT-04 — the dedicated Priority filter case  (refs `SV-8687 (§5.1)`)
- **Title:** *Priority filter offers High, Medium, Low and narrows the list accordingly*
- **Preconds (relevant):** `2. Work orders exist with different priorities (High and Low at minimum).`
- **Steps:** `1. Open the 'Filter' panel. / 2. Choose High under Priority. / 3. Read the list.`
- **Expected:** `1. The Priority group offers High, Medium, and Low. / 2. Only High-priority work orders remain in the list.`
- **AUTOMATION marker (current):** `AUTOMATION: Not available on Build to test Yet - Last checked 8/18/2026`
  (the case body says it *"could not be build-verified … because the feature it tests was not found in
  the build yet — the related story is still under development"*).

### C29942 = SCH-FILT-01 — the popover-composition case  (refs `SV-8687 (§5.1)`)
- **Title:** *The 'Filters' button opens Assignment / Status / **Priority** filter groups*
- **Preconds (relevant):** `2. Several work orders exist in mixed statuses and priorities.`
- **Steps:** `1. Click the 'Filters' button on the sidebar. / 2. Read the filter groups offered. / 3. Apply one filter option and look at the 'Filters' button.`
- **Expected (relevant):** `1. The filter panel offers three groups: Assignment (Assigned, Unassigned), Status (the work order statuses supported in the app), and **Priority (High, Medium, Low)**.`
  (`2.` narrows list; `3.` badge count.)
- **AUTOMATION marker (current):** `AUTOMATION: READY`, provenance *"Last checked against build
  v3.8-bd246fd on 8/18/2026."*
- **⚠️ This case currently ASSERTS Priority IS shown (3 groups) — contradicts the build and Branko's
  ruling.** Batch-A D1 already noted a tester running it "will see 2 of the 3 groups" — i.e. as worded
  it fails a build-accurate check. **It needs a wording tweak (see §4).**

### C29946 = SCH-FILT-05 — "'Clear all' resets every applied sidebar filter" (refs `SV-8687 (§5.1)`)
- Priority appears **only as an example in a precondition**: *"…have applied at least two filters (for
  example an Assignment and a **Priority** filter)."* The case's actual assertion is about **Clear all**,
  not Priority. **AUTOMATION: READY.** Minor optional tweak only (see §4).

---

## 3. Recommendation: RE-SCOPE C29945 to a NEGATIVE assertion (do NOT retire)

**No existing case asserts the popover shows *only* Assignment + Status.** C29942 today asserts the
opposite (Priority IS shown). Once C29942 is corrected (§4) it will state the popover's contents
positively — but a **dedicated negative case** ("Priority is NOT offered") gives sharper, findable,
regression-proof coverage of a **deliberate removal** Branko is taking out of the PRD (real risk of it
being re-added later). Retiring C29945 would discard that. **Prefer RE-SCOPE.**

> **Rule 28 note (no true duplicate):** corrected-C29942 = general popover/badge/narrowing case;
> re-scoped-C29945 = focused negative that Priority (High/Med/Low) is absent. Distinct assertions,
> not a duplicate → both kept. (If the QA lead disagrees and wants a single case, the fallback is
> RETIRE C29945 and rely on corrected-C29942 — but that loses the explicit "no Priority" assertion.)

### Proposed C29945 (SCH-FILT-04) — full replacement text
**refs (unchanged):** `SV-8687 (§5.1)`

**Title (≤80 chars):**
`Schedule filter popover offers only Assignment and Status - no Priority group`

**Preconditions:**
```
1. You are signed in on a desktop browser.
2. You are on the Schedule page with the work order list visible.
```

**Steps:**
```
1. Click the 'Filters' button on the sidebar.
2. Read the filter groups offered in the panel.
```

**Expected Results:**
```
1. The filter panel offers only two groups: Assignment (Assigned, Unassigned) and Status (the work order statuses supported in the app).
2. There is no Priority group anywhere in the panel - High, Medium, and Low priority options are not shown.

---
This is the expected behaviour as per Branko's (the Product Owner's) ruling on 19 August 2026, verbatim "Proceed without it, I'll remove that part from the PRD", which removes the Priority filter group; and as per epic SV-8685 and story SV-8687. Last checked against build v3.8-bd246fd on 8/18/2026.

This case follows Branko's newer decision of 19 August 2026. The Schedule specification version 30 (§5.1) still lists a Priority filter group (High, Medium, Low); the Product Owner's later decision is the most recent authoritative source and prevails, and the PRD is to be updated to drop Priority.

AUTOMATION: READY
```

- **Rule 54 sentence 1** names only documents (Branko's ruling + epic + story) as the source — the
  build is NOT named as a source. **Sentence 2** ("Last checked against…") records the 8/18/2026
  build-verify observation that the popover showed only Assignment + Status (batch-A D1). *At execution,
  re-confirm the build marker/date per Rule 59; if not re-observed, drop sentence 2.*
- **Rule 56 divergence sentence** discloses that the case follows Branko's newer decision while spec
  v30 §5.1 still lists Priority; latest authoritative source (the PO decision) prevails; PRD to be updated.
- **AUTOMATION: READY** — the build correctly omits Priority; this is automatable now. **No deferral,
  no EXPECT-FAIL** — it is not "under development", it is intentionally absent and matches expectation.

---

## 4. C29942 (SCH-FILT-01) DOES need a wording tweak — YES

Its title and Expected #1 currently assert **three groups including Priority**, which now contradicts
both the build and Branko's ruling. Proposed changes:

- **Title →** `The 'Filters' button opens Assignment and Status filter groups`
- **Expected #1 →** `The filter panel offers two groups: Assignment (Assigned, Unassigned) and Status (the work order statuses supported in the app).` (drop "and Priority (High, Medium, Low)"; "three" → "two"). Expected #2 (narrows) and #3 (badge) unchanged.
- **Precondition #2 →** drop "and priorities": `Several work orders exist in mixed statuses.` (optional tidy; Priority still exists as a WO attribute, just not a filter).
- **Provenance:** carry the **same Branko-ruling provenance + Rule-56 divergence sentence** as C29945
  (naming Branko's 19 Aug ruling as the source of the "only two groups" wording; spec v30 §5.1 still
  lists Priority, latest decision prevails, PRD to be updated). Keep `Last checked against build
  v3.8-bd246fd on 8/18/2026.` and `AUTOMATION: READY`.

## 5. C29946 (SCH-FILT-05) — optional minor tweak only

Change the precondition example from *"an Assignment and a Priority filter"* to *"an Assignment and a
Status filter"* so no case implies Priority is a filterable group. Not required (it is an illustrative
example, not an assertion); bundle with the above if authorised.

---

## Summary of proposed treatment (all pending QA-lead authorisation — Rule 6 / hold H1)

| Case | Internal | Now | Proposed |
|---|---|---|---|
| C29945 | SCH-FILT-04 | Priority filter; DEFERRED "not built" | **RE-SCOPE → negative: popover offers only Assignment + Status; AUTOMATION: READY** |
| C29942 | SCH-FILT-01 | asserts 3 groups incl Priority | **TWEAK → 2 groups (Assignment + Status); Branko-ruling provenance; AUTOMATION: READY** |
| C29946 | SCH-FILT-05 | precond example mentions Priority | optional example wording tidy |

**Sources:** test `get_test/1845401` (case 29945, run 357) · `get_case` C29945/C29942/C29946 ·
section-4258 + full group-4254 scan (read-only) · batch-A `A-FINDINGS.md` D1 · Branko ruling 2026-08-19.
