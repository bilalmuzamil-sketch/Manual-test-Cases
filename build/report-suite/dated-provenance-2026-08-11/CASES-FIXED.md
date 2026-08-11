# The two cases — before and after, with the source quoted

Both sit in the three **handed-off** Report Suite reports, so a deviation here is a defect in a
finished feature, not an unfinished one (Rule 49 as amended 2026-08-10).

**Sources read live today, 11 August 2026** — each is what the new read-date on the case refers to:

| Source | Identifier | State read | Verdict |
|---|---|---|---|
| Epic | `SV-8582` | Open | CURRENT |
| Story (C30452) | `SV-8657` — *WIP - Story 1 - Report Access and Tabs* | Open | CURRENT |
| Story (C30434) | `SV-8654` — *Tech Util - Story 7 - Export to PDF and CSV* | Open | CURRENT |
| WIP specification | Confluence `703660034` | **version 11** (2026-08-10) | CURRENT — **we held v10; it had moved** |
| TU specification | Confluence `641400833` | **version 7** | CURRENT |
| Build | `sv8582api.qa.shopview.com` | **HTTP 401 — session dead** | **NOT OBSERVED BY THIS PASS** |

**Honesty on the build (Rule 12).** The QA session is dead, so **this pass observed nothing on the
build**. Build facts below are quoted from **evidence captured earlier today and committed to this
repository** (`build/report-suite/label-vs-behaviour-2026-08-11/evidence/`) — they are our team's
observation from today, not this pass's. **Neither case's sentence 2 was re-stamped**, because
re-stamping a build date we did not earn is precisely what the amended Rule 54 forbids.

---

## C30452 — [Four tabs in a fixed order…](https://shopview.testrail.io/index.php?/cases/view/30452)
### Work In Progress · section 4350 · a **verdict flip**

**The source, quoted verbatim** — WIP specification **Confluence version 11**, read 11 August 2026:

> **S1-R2:** Opening the report shows four tabs, labeled (in order) **"Approved - partially
> completed"**, **"Approved - not started"**, "Completed", and "Estimates".

> **S1-R3:** The **"Approved - partially completed"** tab is selected by default on load.

**Rule 31 trap (c) applied — the requirement was dated, not the page.** `S1-R2` and `S1-R3` were
fetched from spec versions **8, 9, 10 and 11** and are **byte-identical in all four**. The lower-case
wording is not new, so there is no latest-wins argument for the Title Case: our case was simply wrong.

**Before → after (expected result):**

| | Before | After |
|---|---|---|
| item 1 | `"Approved - Partially Completed"`, `"Approved - Not Started"` | `"Approved - partially completed"`, `"Approved - not started"` |
| item 2 | `"Approved - Partially Completed"` tab selected | `"Approved - partially completed"` tab selected |

Item 2 moved as well, deliberately: leaving items 1 and 2 disagreeing on the same label inside one
case would be a Rule-28 coherence defect in a case we had just touched.

Items 3 and 4 were re-read whole (Rule 41) and **stand unchanged** — the §3 Key Decisions text still
supports item 3 verbatim in v11: *"Jobs are separated into four tabs by progress, and there is no
on-screen status filter. The tab a job lands in is derived from its status and whether any work has
started."*

**What v11 actually changed**, since our records said v10: three new Key Decisions (line-state
bucketing, fixed-price valuation, core-charge rule) and a changelog line. **None touches S1-R2/R3/R4.**
The bucketing decision governs where a line's *value* sits, not which tab a work order appears in.

**Provenance — before → after:**

- **Before:** `…as per epic SV-8582 and the Work In Progress report specification version 10 (S1-R2, S1-R3, S1-R4).`
- **After:** `…as per epic SV-8582 and its story SV-8657, read on 11 August 2026, and the Work In Progress report specification version 11 (S1-R2, S1-R3, S1-R4), read on 11 August 2026.`

**`refs`** now pins `WIP spec v11 read 2026-08-11` (was `v10 2026-08-06`), ticket + anchor intact.

**No Rule-56 divergence sentence** — the case follows the specification and nothing later contradicts
it. Adding one would manufacture a conflict that does not exist, which Rule 56 calls a defect in its
own right.

### 🔴 THE VERDICT FLIPPED — and that is the correct outcome

The build shows **Title Case**: `Approved - Partially Completed (34)` · `Approved - Not Started (4)` ·
`Completed (4)` · `Estimates (14)` (captured today, committed evidence). So this case **now fails**
where it previously passed.

**Marker stays `AUTOMATION: READY`** — under today's Rule 61 amendment there is **no backing ticket**
for the capitalisation defect, and the creation hold bars filing one, so **no expect-fail marker is
set and the tester records what they find.**

**Five sibling cases already follow the spec here** (C30488, C30489, C30490, C30462, C30464 — moved by
this morning's pass). **This brings C30452 into line with them, not out of it**; it was the last case
in the report still asserting the build's capitalisation against its own specification.

---

## C30434 — [Three-dot menu is leftmost…](https://shopview.testrail.io/index.php?/cases/view/30434)
### Technician Utilization · section 4346 · **stale expect-fail removed; case now passes**

**The source, quoted verbatim** — TU specification **Confluence version 7**, read 11 August 2026:

> **S7-R2:** The menu has an option labeled "Download Summary (PDF)".
> **S7-R3:** The menu has an option labeled "Download Expanded View (PDF)".
> **S7-R4:** The menu has an option labeled "Download Summary (CSV)".
> **S7-R4a:** The menu has an option labeled "Download Expanded View (CSV)".

> **S8-R2:** The three-dot download menu sits leftmost in the toolbar's action cluster, followed by
> the Column Selection control.

**Three findings, in the order they matter.**

**(1) The expect-fail marker had no backing.** `SV-8881` was read live today:
**type Bug · status OBSOLETE · resolution Done · resolved 2026-08-07**, titled *"Technician
Utilization download menu drops the word Download from all four options…"*. The symptom it names is
**gone from the build** — the menu now reads `Download Summary (PDF)` · `Download Summary (CSV)` ·
`Download Expanded View (PDF)` · `Download Expanded View (CSV)`. Under today's Rule 61 amendment the
marker comes **off**, and the whole *"What you should see today…"* block with it. **`SV-8881` was not
touched** — no comment, no transition, no field change (creation hold + Rule 53's corollary).

**(2) The order was never a requirement — so the case must not assert one.** The specification pins
**column** order (`S2-R1`) and **toolbar** order (`S8-R3`), but **nowhere pins the menu's item order**.
The old item 2 implied parity with Sales By Customer (*"worded exactly as they are on Sales By
Customer and Sales By Representative"*), which is a **wording** claim being read as an **order** claim.
Per Rules 25/57 the repair is to **remove the unsupported assertion — never to substitute what the
build does**. Item 3 now says the order is not part of the check, so a tester does not fail a
conforming build.

**(3) The provenance claimed a divergence that no longer exists.** It read *"…where the Technician
Utilization report specification version 7 … differs, his decision is the authority"*. **Spec v7 now
carries Chris Ward's four-item wording verbatim**, so the two **agree**. Under Rule 56's honesty half
a divergence sentence where nothing diverges is itself a defect — it is now written as a
**confirmation**, with his answer file and its date retained for traceability.

**Before → after:**

| | Before | After |
|---|---|---|
| title | `…; three download options` | `…; four download options` |
| item 2 | four items *"worded exactly as they are on Sales By Customer and Sales By Representative"* | four options **labeled exactly**, cited to S7-R2/R3/R4/R4a |
| item 3 | *(none)* | the order is **not** part of this check — the spec fixes labels, not order |
| symptom block | *"What you should see today: … 'Summary (PDF)' … without the word 'Download'"* + three outcomes | **removed** — backing ticket is OBSOLETE and the symptom no longer reproduces |
| provenance | *"…where the specification differs, his decision is the authority"* | spec + story dated **read on 11 August 2026**; Chris's answer recorded as a **confirmation** |
| marker | `AUTOMATION: READY - EXPECT FAIL (SV-8881)` | `AUTOMATION: READY` |

**`refs`** now pins `TU spec v7 read 2026-08-11` and **adds the missing `S7-R4a`**, which governs the
fourth menu item and was absent before — a traceability gap closed in passing.

**The title was changed** because *"three download options"* contradicted the case's own body and both
sources, which require **four**. Recorded rather than left, per Rule 41; it is a Rule-28 title-vs-expected
defect in a case under repair. Its only side effect is the **declared** `case_title` read-time echo on
run 359, proven below to have moved no graded field.

### The verdict: this case now PASSES

Item 1 holds (`btn_dropdown_tu_export` then `button_column_selection`, per S8-R2) and item 2 holds —
all four labels are present exactly. **No deviation remains**, and the menu order, which is what the
earlier pass flagged, turns out not to be required by anything.

**One question goes to Chris Ward** (register row **D2**): *should* the menu order match Sales By
Customer? No source says. We assert neither reading (Rule 57 — where no source speaks, the gap is a
question, not an invented requirement).
