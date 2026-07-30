# Filters — Branko's ANSWERS to the Parts / Reports / page-search sheet — INGESTED 2026-07-31

**This file is the SOURCE OF RECORD for what Branko actually said.** Verbatim only.
Consequences live in `DELTAS.md`; the executable change list lives in `APPLY-PLAN.md`.

| | |
|---|---|
| Sheet he answered | `build/filters/PO-Questions-Branko-PartsReports-2026-07-27.md` / `.xlsx` (7 questions, issued 2026-07-27) |
| Raw file received | `branko-answers-partsreports-raw-export.xlsx` (single sheet **"Questions for PO"**, 10 rows × 6 columns — read with `openpyxl`, every row, nothing skipped) |
| Ingested | 2026-07-31 |
| PO | **Branko** (Filters / Schedule / Global Search — never mix: Chris Ward = Report Suite + Fees & Discounts; Milos = Simple Flow) |
| Answered | **6 of 7** (Q2, Q3, Q4, Q5, Q6, Q7) |
| **Left blank** | **Q1** — see the flag below |
| Case edits made this pass | **ZERO** |
| id-map / import touched | **NO** |
| TestRail writes | **ZERO** |

> **Scope of this pass (per the user's instruction 2026-07-31):** ingest + analysis
> ONLY. A sibling worker is concurrently editing `build/filters/cases/**`, the id-map
> and the import, so nothing outside this folder was written. Everything actionable is
> staged in `APPLY-PLAN.md` for a follow-up pass and awaits user authorization.

---

## 1. Verbatim answers, question by question

Column order in his file: `# | Topic | What happens now | The question | Options | Your answer`.
Only the **"Your answer"** cell is his; everything else is our own sheet text (unchanged
by him — he edited no other cell).

### Q1 — "A written description for the Parts and Reports filters"

- **What we asked:** *"Can you share a written description (the same kind we have for the Work Orders page) for the Parts filters and the Reports filters, so we can test them properly?"*
- **Options offered:** A) Yes - a write-up exists or will be provided. · B) No write-up yet
- **HIS ANSWER — verbatim:** *(cell is EMPTY — no letter, no free text)*

> ⚠️ **FLAGGED UNANSWERED (Rule 32(iii) — ambiguity stays a question, it is never
> inferred).** We do **not** record this as "A". See `DELTAS.md` §Q1 for the honest
> read: his Q4 answer says *"The links are in the PRD"*, and the PRD we pulled live
> from Confluence on 2026-07-31 (**v1.6, Confluence version 12, updated 2026-07-28**)
> **does** now contain "Parts Filters" and "Reports Filters" sections — so the
> *substance* largely exists. But the literal ask — a **numbered per-page description
> of the same kind as the Work Orders stories** — does **not** exist: spec §7
> Requirements contains **Stories 1–14 with no Parts story and no Reports story**, so
> there is not a single `S#-R#` anchor for any Parts view or any report. Q1 stays OPEN.

---

### Q2 — "Which filter buttons actually filter each page"

- **What we asked:** *"On each Parts page and each Reports page, should every filter button shown in the design actually filter the list or the report when used?"*
- **Options offered:** A) Yes - every button shown filters that page. · B) Some are not active yet (please tell us which ones).
- **HIS ANSWER — verbatim:**

> **A - Yes, every chip shown filters that page.**

---

### Q3 — "The full list of choices inside each filter"

- **What we asked:** *"Can you give us the full list of choices for each filter on the Parts and Reports pages (for example all the statuses, all the vendor options, the date options)?"*
- **Options offered:** A) Yes - here is the list / it will be provided. · B) The choices come from the shop's own data (for example the list of real vendors), so there is no fixed list.
- **HIS ANSWER — verbatim (free text, no letter picked):**

> **We should support all the filters we have right now in the app as well as all choices per filter. There is no specific list of choices.**

- **Reading (stated, not assumed):** two distinct rulings in one sentence —
  1. a **SCOPE / parity rule:** every filter that the app offers on those pages **today**, and every choice each of those filters offers today, must be supported by the new filter bar (nothing may be lost in the redesign);
  2. an **option-list rule** = the substance of option **B**: *"There is no specific list of choices"* → the choices are data-driven, so there is no fixed expected list to assert.
  He picked no letter; item 2 is the substance of B and is recorded as such, item 1 is
  additional to both offered options.

---

### Q4 — "How the new kinds of filter work"

- **What we asked:** *"For each of these new filter buttons [Location, Transaction Type, Invoice Status, Type, User, Mention, Core / Non Core], what choices should it offer and how should it narrow the page - can you pick more than one choice, and does the page update right away?"*
- **Options offered:** A) Yes - here is how each one works / it will be described in the write-up. · B) Something else (please explain).
- **HIS ANSWER — verbatim (free text, no letter picked):**

> **Filter behavior and types are fully displayed in the design. The links are in the PRD.**

- **Pointer he is referring to (recorded, not verified by him):** the PRD's design links —
  `Parts filters design: …node-id=11884-16885`, `Reports filters design: …node-id=11903-10573`,
  `Page search component: …node-id=11829-8908` (spec v1.6, page body, header block).
- ⚠️ **See `DELTAS.md` §Q4 flag F1:** our own live design read
  (`design-2026-07-31/DESIGN-NOTES.md` §5.7) records that those boards pin **button
  names only** and that Parts/Reports **behaviour is design-silent**; 12 of the 85
  boards are also still un-rendered (Rule-35 queue). His claim and our observation do
  not agree; recorded here verbatim, evaluated there.

---

### Q5 — "Do the Parts and Reports filters work the same way as Work Orders"

- **What we asked:** *"Should the Parts and Reports filters behave exactly like the Work Orders filters for these things (multiple choices, clearing, collapsing, remembering, shareable link, phone)?"*
- **Options offered:** A) Yes - they should behave the same as the Work Orders filters. · B) No - there are differences (please tell us which).
- **HIS ANSWER — verbatim:**

> **A - Yes - multi-select, clearing, collapse, persistence, shareable URL and mobile all match Work Orders. One difference: filters don't carry across Parts views or Report tabs; each view keeps its own set. Date-range is a single range, not multi-select.**

- **Three separate statements, recorded separately:**
  1. **A** — full parity on multi-select / clearing / collapse / persistence / shareable URL / mobile.
  2. **Exception 1** — filters do **not** carry across Parts views or Report tabs; **each view keeps its own set**.
  3. **Exception 2** — the **date-range** filter is a **single range**, not multi-select.

---

### Q6 — "The pop-up search box (\"Search or ask a question\")"

- **What we asked:** *"Is this pop-up search box part of THIS filters release (so we test it here), or is it owned by the separate Global Search work? And does the 'ask a question' part (an AI answer) go live now, or later?"*
- **Options offered:** A) Test it as part of Global Search (not here) - and 'ask a question' is for later. · B) It is part of this filters release … · C) Something else (please explain).
- **HIS ANSWER — verbatim:**

> **A - Test it under Global Search, not here. This release only removes global search's page-filtering behaviour (Story 14). "Ask a question" is not in this PRD's scope.**

- **This is the answer the user's 2026-07-31 ruling was waiting on.** The ruling was,
  verbatim: *"OK do not delete those cases unless Branko confirms that they are related
  to Global search only."* → verdict in `DELTAS.md` §Verdict-2.
- **Three separate statements:** (1) the pop-up search box is **Global Search's**, not
  Filters'; (2) the only search-box work in **this** release, as far as the *pop-up /
  global search* is concerned, is the **Story 14** removal of its page-filtering
  behaviour; (3) **"Ask a question" (AI) is NOT in this PRD's scope.**
- ⚠️ **Ambiguity flagged (see `DELTAS.md` §Q6 flag F2):** sentence 2 read *literally and
  in isolation* ("This release only removes global search's page-filtering behaviour")
  would also descope **Story 13 Page Search** — which spec v1.6 ratifies with **29
  requirements** and which 13 of our cases test. That reading is almost certainly not
  what he means (he is answering a question about the pop-up box), but because his
  answer is **newer than v1.6** and Rule 32 makes the newest source win, we do **not**
  resolve it by inference — it becomes a one-line confirmation question.

---

### Q7 — "Do the filter choices depend on the person's role"

- **What we asked:** *"On the Parts and Reports pages, should the filter buttons and their choices be the same for every user, or should some be hidden or limited depending on the person's role?"*
- **Options offered:** A) Same for everyone - the person's role does not change the filters. · B) Some filters or choices depend on the role (please tell us which).
- **HIS ANSWER — verbatim:**

> **A - Same for everyone - role does not change chips or their options**

- Extends his Round-2 Q3 ruling of 2026-07-20 (Work Orders page: filter lists are
  role-independent, **OQ-4 RESOLVED**) to the **Parts and Reports** pages as well.

---

## 2. Answer summary table

| Q# | Topic | His answer | Answered? |
|---|---|---|---|
| **Q1** | Written description for Parts/Reports filters | *(blank)* | ❌ **NO — flagged, stays a question** |
| **Q2** | Do all shown chips actually filter | **A** — every chip shown filters that page | ✅ yes, clean letter |
| **Q3** | Full option list per filter | free text — support **all filters the app has today + all their choices**; **"no specific list of choices"** | ✅ yes (substance of **B** + an extra scope rule); no letter picked |
| **Q4** | How the new filter types work | free text — *"fully displayed in the design. The links are in the PRD."* | ⚠️ **partly** — a pointer, not a description; contradicts our design read (F1) |
| **Q5** | Parity with Work Orders filters | **A** + 2 named exceptions (per-view/per-tab scoping; date-range = single range) | ✅ yes, clean letter + detail |
| **Q6** | Pop-up "Search or ask a question" ownership | **A** — test under **Global Search**, not here; this release only removes global search's page-filtering (Story 14); **"Ask a question" out of scope** | ✅ yes, clean letter — ⚠️ one clause ambiguous (F2) |
| **Q7** | Role-dependence of filter choices | **A** — same for everyone; role changes neither chips nor options | ✅ yes, clean letter |

**Unanswered / ambiguous list (kept as open questions, never inferred — Rule 32(iii)):**

1. **Q1 — completely blank.** The numbered per-page write-up for Parts and Reports.
2. **Q4 — answered by pointer only.** "Fully displayed in the design" is not borne out
   by the 73 boards we have rendered; and the 6 new filter types (Location, Transaction
   Type, Invoice Status, Type, User, Mention) are enumerated **nowhere** in spec v1.6.
3. **Q6 clause 2** — does "this release only removes global search's page-filtering
   behaviour" apply to the pop-up box only (our reading), or does it descope **Story 13
   page search** from Filters too? Must be confirmed, not inferred.
4. **The "ask a question" / AI timing** — he said it is *not in this PRD's scope*; he did
   **not** say when or where it lands. That belongs to the Global Search project (its
   OQ-3), not Filters.

**Things he did NOT touch at all** (so they are NOT answered and must not be recorded as
such): **sorting** (no mention anywhere in his sheet), the **Parts "Vendors" page**
design/scope, the **per-page list of searchable fields** (`S13-R23`), the **mobile
individual-filter "Apply" button**, and **which tab opens first**. All five remain live
questions in `PO-Questions-Branko-Filters-TechPlan_2026-07-30.md` — see `DELTAS.md` §4.

---

## 3. Honesty / provenance notes

- **Every answer above is a copy of his cell text**, whitespace-trimmed, nothing
  paraphrased, nothing reordered. The raw file is preserved beside this doc.
- **No live-build check was run this pass** (Standing Rules 12/22): Filters is still not
  on a QA branch, so every consequence in `DELTAS.md` is desk analysis against the spec,
  the design capture and the case text — **not** live-verified. Nothing here may be
  recorded as VIU-Verified.
- **His answers are dated later than spec v1.6 (2026-07-28)**, so under Rule 32 they
  outrank the PRD prose where the two differ — but where his answer is *ambiguous*, Rule
  32(iii) applies and it stays a question rather than being resolved by us.
- **Precedence used throughout** (Rule 33): PO ruling (Branko) → QA-lead ruling (the
  user) → our own live-observed findings → a reviewer's spec-reading claims.
