# SOURCE-CURRENCY — Filters, Vlad's eleven-row coverage-gap review, 2026-08-06

Standing Rule 31 pre-flight, run **before** any analysis, and Standing Rule 59's second read run
again immediately **before** the writes began.

| Source | Identifier | Version / last updated | Checked (UTC) | Verdict |
|---|---|---|---|---|
| Specification | Confluence page **572030978** "Filters" | **version 19**, published **2026-08-06T11:48:47Z**, comment *"S1-R3: filter chips display a leading type-icon per filter (align PRD with design decision / SV-8986)"* | 11:52Z, re-read 13:—Z before the writes | **CURRENT — and it MOVED under us: our 110 cases all pin `[spec v18 2026-08-04]`** |
| Epic + child stories | **SV-8785** | **23 direct children**, verified two independent ways (`parent=SV-8785` → 23 and `"Epic Link"=SV-8785` → 23, **key sets equal**, `isLast: true`, no paging remainder) | 11:58Z | **CURRENT** |
| Branko's recorded answers | 2026-07-17 (Round 1, Q4) · 2026-07-20 (Round 2) · **2026-07-31 (Round 3, Q5)** · 2026-08-04 | all read from the committed ingest files | 12:05Z | **CURRENT** |
| Engineering tech plan | `build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md` | 2026-07-29 | 12:20Z | **CURRENT but PARTLY SUPERSEDED** — its decision **D19** ("no presets, no default range") was overturned by spec v18; see row 8 |
| Build | `sv8785.qa.shopview.com` | **`v3.4.2-280ca5a`**, last-modified **Thu 06 Aug 2026 09:37:49 GMT**, etag `720a7f1f55332d16b2541429acf23b01`, `index.html` sha256 `07cf9760c641e4eaf53ae6a7c788eb8d136d740971df07bf94946299e6e58adb` | 12:10Z | **REDEPLOYED — this is NOT the build our 110 verdicts were taken on** |
| Build API (needed to observe anything) | `sv8785api.qa.shopview.com` | — | 12:10Z | **DEAD — HTTP 401 `sso_required`.** Probed once, as instructed. `switch-user` and `quick-login {"key":"tech"}` were **not** called |
| Designs (Figma) | file `DR4gEODShYgJqkozs3mF5q` | no Rule-35 queue open for Filters (closed 85/85 on 2026-07-31) | 12:00Z | **CURRENT** |
| PO product write-up for **Parts and Reports** | Branko | **STILL NEVER SUPPLIED** | — | **MISSING** — this is why 10 cases are on HOLD, and it is row 7 of Vlad's table |

## Three things the currency check found that change the picture

### 1. The specification moved this morning, four hours before this review began

**v18 → v19 at 11:48:47Z today.** The whole diff is **one sentence**, and it is a **new requirement**:

> **S1-R3, v18:** *"Each chip displays the filter name and a chevron icon indicating it opens a dropdown"*
>
> **S1-R3, v19:** *"Each chip displays **a leading type-icon identifying the filter**, the filter name, and a chevron icon indicating it opens a dropdown"*

Consequence: **all 110 `refs` now pin a superseded spec version** (`[spec v18 2026-08-04]`). That is a
Rule-31 finding in its own right and is recorded in the outstanding list at the end of `ROOT-CAUSE.md`.
It is **not** one of Vlad's rows.

**Ahtasham Amjad had already covered it before Branko published it.** He rewrote **C29558** at
**11:27:20Z** — twenty-one minutes *before* the PRD caught up — to assert the leading icon. He filed
**[SV-8986](https://shopview.atlassian.net/browse/SV-8986)** (Story Defect, Open, parent SV-8786) at
06:16 today for the icons being absent from the build, and Branko then aligned the PRD to the design
and closed **[SV-8904](https://shopview.atlassian.net/browse/SV-8904)** as Done. His edit is right; it
**stripped the case's Rule-54 provenance line and its automation marker**, which this pass restores
without touching his assertion.

### 2. The build redeployed this morning, so the 5 August verdicts name a build that no longer exists

`v3.4.2-d00239b` → **`v3.4.2-280ca5a`** (09:37:49 GMT today). Under **Standing Rule 60** that
invalidates **layer 1** (on-screen labels and the navigation path), **layer 2** (the pass/fail verdict)
and the **`HOLD` half of layer 3** — it does **not** invalidate any expectation, because expectations
come from documents (Rule 57). **No verdict in this document rests on a live observation**, because the
API is dead; every row is settled from the specification, the epic and Branko's answers, which is
exactly what a coverage question needs.

### 3. Other people are editing OUR cases, and 15 of the 110 now show raw markup to the tester

By `updated_by` on the live 110: **user 3 (us) 105 · user 1 (Vladimir Tomovic) 4 · user 7 (Ahtasham
Amjad) 1.**

- **Vladimir Tomovic** edited **C29560** (07:45Z), **C29600**, **C29614** and **C38877** (all 11:30Z today).
- **Ahtasham Amjad** edited **C29558** (11:27Z today).

**15 of the 110 currently render raw `<ol>`/`<li>`/`<p>` markup literally to the tester** — C29558,
C29560, C29561, C29562, C29563, C29564, C29565, C29583, C29584, C29585, C29586, C29587, C29588,
C38877, C38882. **Eleven of those fifteen were last written by our own 5 August pass** (21:35–21:39Z),
so the PROJECT-STATE claim *"RAW MARKUP IS NOW 0 OF 110"* is **not true of the live suite**. Reported,
**not repaired here** — it is 15 writes with no bearing on Vlad's rows and belongs in its own
authorised pass.

## The staleness trap, in a NEW form — and it is the root cause of row 1

Rule 31(a) already warns that a Confluence page's **in-body** "Version" field lies (this page's body
still reads `1.6` while the page is at **19**). Row 1 exposes a **second, sharper** version of the same
trap:

> **A page version being new does NOT mean the requirement inside it is new.**

`S9-R2` and `S9-R3` were fetched at **every one of versions 4, 5, 6, 7, 9, 12, 14, 17, 18 and 19** and
the sentence is **byte-identical in all ten**. That text has not been touched since **version 4,
2026-05-14**. Our 5 August pass reversed two cases on the stated ground that *"the specification is the
newer authoritative source"* — the specification **page** was newer; the **requirement** was two and a
half months older than the answer it was used to override.
