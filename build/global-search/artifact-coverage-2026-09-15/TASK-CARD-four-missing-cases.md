# TASK CARD — author the four missing V1-regression cases (Global Search)

> **THIS IS A TASK CARD, NOT A LANE BRIEFING.** It is issued **with**
> [`build/handoffs/HANDOFF-1-TEST-CASE-CREATION.md`](../../handoffs/HANDOFF-1-TEST-CASE-CREATION.md),
> which carries the **Token Discipline Charter (Rule 95)**, **Search Before You Give Up (Rule 97)** and
> **§1a "I cannot observe this on the build is not blocked"** in full. **Paste that file first, then
> this one.** This card carries only what is specific to these four cases.
>
> **Lane:** authoring. You create cases. You do **not** run a build-verification pass, you do **not**
> rewrite other people's wording, and you do **not** file anything in Jira (Rule 62 — the hold stands).

---

## 1 · Why these four exist

The old search was rebuilt as a runnable page — *How the old search behaved*, 42 keywords, each naming
the field it comes from and the records that should come back, rebuilt from the V1 product at commit
`55767168`. On 15 September 2026 all 42 were reconciled against the **65 V1-regression cases in run
415**, read live from the run.

**38 of 42 are covered. Four are not** — and "covered" was judged strictly: a case counts only if one
of its **steps actually types that kind of thing into the search box**. Naming the field in passing
does not count, and a title that promises what the steps do not do does not count.

Full working: `COVERAGE-REPORT.md` in this folder (the per-preset table), `MAPPING.json` (the verified
preset → case mapping), `PRESETS.json` (the 42), `reconcile.py` (re-runnable).

**Three of the four gaps have one cause, and it is the thing to avoid repeating: a case justified
leaving something out by pointing at another case, and nobody followed the pointer.** One pointer was
to a case that does not exist; one to a FEATURE case judged against a different standard that has
never been run; one case pointed at itself while typing something else. **If you write "another case
covers X", open that case and check it before the sentence goes in.**

---

## 2 · Before you write anything — the collision check (Rule 83)

A parallel session is running a marker sweep over this same suite (correcting
`AUTOMATION: Not available on Build to test Yet` → `AUTOMATION: READY` on the 62 executed cases,
through the TestRail UI editor, in batches of eight).

* **You may create new cases freely.** New cases are not in the sweep's plans.
* **Do NOT edit C53605, C55662, C55664 or C55670 while that sweep is running.** Two sessions in the
  same case's editor is how a body gets clobbered. The three corrections they need are in §6 of this
  card and are **handed back, not done by you**.
* Check first: `bash build/testing-tools/run_queue.sh --status sweepB` — `FINISHED` means it is safe.

---

## 3 · The four cases

All four go in **section 6769** (*Global Search V2 — V1 Regression*), alongside their siblings.

**Copy the shape from a sibling, do not invent one.** `get_case/55662` is the closest model: same
suite, same standard, same two-form structure. Its preconditions open with the suite's standard
five-second data check and the modal-behaviour note — **reuse that block verbatim** and change only
the record facts. Rule 16: mirror the established format 1:1.

### Seeded records these cases rely on — verified live from the sibling cases, 15 September 2026

| Record | Facts |
|---|---|
| Customer **ZZAUTOTEST Bridgeport Hauling** | company telephone **(419) 555-0143** |
| Its contact **Marlene Okonkwo** | contact telephone **(419) 555-0177** — deliberately different from the company's |
| Asset **2019 Freightliner Cascadia** | unit **ZZT-4471**, owned by ZZAUTOTEST Bridgeport Hauling |

> The demo page's example records are **illustrative and not the live seed** — do not take values from
> it. Everything in the table above comes from the preconditions of C55662, C55670, C53605 and C55664,
> which were written against this branch. **Re-read those preconditions before you paste**, because a
> re-seed changes them (Rule 100 — measure, never remember).

---

### CASE 1 — Finding a customer by part of its phone number

**Title:** `Finding a customer by only part of its phone number still works`

**Preconditions:** the standard block, then —
1. The customer `ZZAUTOTEST Bridgeport Hauling` exists with the company telephone `(419) 555-0143`.
2. This is the COMPANY's own number, not a contact's.
3. Customers access: View.

**Steps:**
1. Open global search.
2. Type only the last part of the company's number: `555-0143`
3. Read the Customers group.
4. Clear the input and type only the last four digits: `0143`
5. Read the Customers group again.

**Expected:** Both searches return the customer `ZZAUTOTEST Bridgeport Hauling`. In V1 the second
matching pass looked for the typed text **anywhere** inside the record's search text, so part of a
phone number was enough — which is how people search, because nobody has the whole number in front of
them.

**V1 source (verified, quote it):** `useGlobalSearch.ts:92` — the second pass, which matches with
`.includes()`, the typed text anywhere inside the search text — together with
`FetchDataQueryHandler.php:235`, which folds `c.telephone` into the customer search text with the
brackets normalised. Both lines are already cited by C55659 and C55662 respectively.

**Where V2 stands, and what the tester does on failure.** Specification v1.5 §4 lists customer
telephone as an indexed field, and §7 *What is not fuzzy* does **not** include telephone in the
exact-identifier list. The whole number already fails on this build and is raised as **SV-10057**, so
this case is expected to fail for the same underlying reason. Carry
`AUTOMATION: READY - EXPECT FAIL (SV-10057)` **with the three outcomes in plain words** (Rule 61):
exactly that symptom ⇒ mark Failed and raise nothing new · fails differently ⇒ a new problem, report
it · passes ⇒ the fix shipped, tell the QA lead.

---

### CASE 2 — Finding a customer by a contact's own phone number

**Title:** `Finding a customer by a contact's own phone number`

**Preconditions:** the standard block, then —
1. The customer `ZZAUTOTEST Bridgeport Hauling` has the contact person **Marlene Okonkwo**.
2. That contact has her **own** telephone `(419) 555-0177`, different from the company's
   `(419) 555-0143`. **If the contact's number is blank, the case proves nothing — set it first
   (Rule 14, seeding is pre-authorised on this branch) and say in the run that you did.**
3. Customers access: View.

**Steps:**
1. Open global search.
2. Type the contact's own number with its formatting: `(419) 555-0177`
3. Read the Customers group.
4. Clear the input and type the same number as plain digits: `4195550177`
5. Read the Customers group again.

**Expected:** Both searches return the customer `ZZAUTOTEST Bridgeport Hauling`. The row is the
**company**, carrying the *Contact match* label — a contact is not a result group of its own. In V1 a
contact's telephone was folded into the customer's searchable text alongside the contact's names and
title, so the number of the person you actually speak to found the business.

**V1 source (verified range, quote it):** the contact block at `FetchDataQueryHandler.php:240-243`,
which folds every contact field into the customer search text. The two ends of that range are already
cited by sibling cases — C55670 cites `:240-243` for contact first and last names, C53603 cites `:241`
for `COALESCE(cu.title, "")`. **Pin the exact line for the telephone only if you can read it; if you
cannot, cite the block and say so. Do not invent a line number.**

**Where V2 stands.** Specification v1.5 §4 is explicit: *"Contact telephone and email stay indexed in
v1"*, and the contact-field match returns the company row. So this is required by **both** standards —
a failure here is a real defect, not a Product Owner question. Marker: `AUTOMATION: READY`.

---

### CASE 3 — Finding an asset by its make

**Title:** `Finding an asset by its make`

**Preconditions:** the standard block, then —
1. The asset `2019 Freightliner Cascadia`, unit `ZZT-4471`, owned by `ZZAUTOTEST Bridgeport Hauling`,
   exists.
2. **Freightliner is the MAKE. Cascadia is the model. This case tests the make.** (C55664 tests the
   model; mirror its wording so the pair reads as a pair.)
3. Customers access: View — assets are shown under Customers access.

**Steps:**
1. Open global search.
2. Type the make on its own: `Freightliner`
3. Read the Assets group.

**Expected:** The asset `2019 Freightliner Cascadia` is returned under the Assets group. In V1 the
make was folded into the asset's searchable text alongside the year, model, unit, chassis number and
plate.

**V1 source (verified range, quote it):** the asset block at `FetchDataQueryHandler.php:287-292`,
which folds year, make, model, unit, VIN and licence plate into the asset search text. Three points in
that range are already pinned by siblings: `:287` year (C53605, V1 invariant INV-04), `:289` model
(C55664), `:292` licence plate (C53516). **Pin the make's own line only if you can read it.**

**Where V2 stands.** Specification v1.5 §4 lists Assets indexed as *"year, make, model, VIN/serial #,
unit number, owning customer name"* — the make is required by both standards, so a failure is a real
defect. Marker: `AUTOMATION: READY`.

**Correct the false sentence while you are here — but in YOUR case, not in C55664.** C55664's Expected
currently says *"The suite has a case that searches a misspelled MAKE (Freightliner), which proves the
make is searchable"*. It means **C44841**, a feature case judged against the V2 specification which has
**never been run**. Your new case is what actually proves it. See §6.

---

### CASE 4 — Finding an asset by its year alone

**Title:** `Finding an asset by its year on its own`

**Preconditions:** the standard block, then —
1. The asset `2019 Freightliner Cascadia`, unit `ZZT-4471`, owned by `ZZAUTOTEST Bridgeport Hauling`,
   exists.
2. **This case types the year and nothing else.** A separate case (C53605) types the year and the make
   together, which is a different behaviour with a different finding against it.
3. Customers access: View.

**Steps:**
1. Open global search.
2. Type the year on its own: `2019`
3. Read the Assets group.

**Expected:** The asset `2019 Freightliner Cascadia` is returned under the Assets group. In V1 the year
was folded into the asset's searchable text in its own right. On a real shop's data this returns many
vehicles; on this branch it should return at least the seeded one.

**V1 source (verified, quote it):** `FetchDataQueryHandler.php:287` — `v.year` is folded into the asset
search text (**V1 invariant INV-04**). Already cited verbatim by C53605.

**Where V2 stands.** Specification v1.5 §4 lists the year as indexed, so a failure is a real defect.
**Do not merge this with the year-and-make finding**: typing `2019 Freightliner` returns no vehicles
and is already raised as **SV-10055**; whether the year **alone** works is unknown and is the whole
point of this case. Marker: `AUTOMATION: READY`.

---

## 4 · The house rules that bind the write

| | |
|---|---|
| **Section** | **6769** — *Global Search V2 - V1 Regression Suite* — with the siblings. **Not 8056**, which is the second regression section (*derived from V1 automated tests*) and holds different material. |
| **Standard** | These are **V1 regression** cases. Every one carries the suite's source block: *"SOURCE — THIS CASE IS TESTED AGAINST V1, NOT AGAINST THE V2 SPECIFICATION … the shipped V1 product IS the specification (Standing Rule 109)"*, then the V1 file and line, then the V2 position **as context only, never as the authority**. Copy the block from C55662 and change the citation. |
| **Rule 106 (extended 2026-09-15)** | Reconcile each case's Expected against the **live** source **before it is judged**, not only before a defect is proposed. §3 above already carries that reconciliation for all four — **repeat it if the specification has moved** (page `576978945`, was version 1.5, last modified 8 September 2026). A case whose Expected disagrees with the source is a **false pass waiting to happen**. |
| **Automation type** | `custom_automation_type: 2` (Functional — single-feature UI behaviour). **Never 0.** Standing ruling, QA lead 2026-09-02. |
| **Automation status** | `custom_atmstatus: 1` (not yet automated), matching the siblings. |
| **Other fields** | `priority_id: 2`, `type_id: 7`, to match every sibling in 6769. |
| **Marker** | Exactly one `AUTOMATION:` line, the **last thing** in Expected, after the source block. Case 1 takes `READY - EXPECT FAIL (SV-10057)` **plus the three outcomes**; the other three take `READY`. **No build-check sentence** — these have never been run against a build, so Rule 54's second sentence is omitted, not faked. |
| **Formatting** | Block tags only — `<p>`, `<ol>/<ul><li>`, `<hr />`. **Never `<br>` and never an inline styling tag in an API payload**: `<br>` renders from a UI save and shows literally from the API. Playbook §J. |
| **Layman-runnable** | Skill 18: the preconditions carry the route as UI clicks, and the steps are followable by a tester who has never seen the feature. `python3 build/testing-tools/check_runnable_cases.py --section-prefix "Global Search V2 - V1 Regression Suite"` must come back clean (it reads TestRail live and exits 1 on any failure — drive it to zero). |

### 🛑 The render trap — this one will bite you

**Every case in this suite is served in `markdown fr-view` today** (checked live, 15 September 2026:
C53579, C55684, C45142, C55686 all render). **A case created through the API lands in the ESCAPING
container**, where the tester literally reads `<ol><li><p>`. `check_case_render.py` **cannot see this**
— it reads the stored value, not the served page.

**So the write is not finished when `add_case` returns 200.** After creating the four:
1. `python3 build/testing-tools/check_case_render.py <ids>` — the stored-value check.
2. **Then open each case's served page and require `markdown fr-view`.** A one-off scanner is in this
   session's history; the recipe is Playwright → log into the TestRail UI → `GET
   /index.php?/cases/view/<id>` → read the `div.markdown` class list.
3. Any case still in the plain `markdown` container is **repaired through the UI editor**
   (Playwright → Froala `html.set`, deadlock-retry), **never by another API write**. Proven recipes:
   `build/inline-add-edit-parts/render-repair-2026-08-31/` and
   `build/build-verify-session-2026-08-21/repair-2026-08-25/`.

---

## 5 · Put them in the run (Rule 34 — union only)

The four belong in **run 415** or they will never be executed.

**A partial `case_ids` list passed to `update_run` DELETES every test not in it, and their results.
That is unrecoverable.** Read the run's existing tests, compute the **union** with your four, and pass
that. `build/testing-tools/push_results_to_run.py` already does the union and refuses to shrink —
read how it does it rather than hand-rolling the call.

Do **not** write results for them. They are authored, not executed; the execution lane runs them.

---

## 6 · Three corrections that are NOT yours to make — hand them back

These are edits to existing cases, and the lane rule is that the creation session does not rewrite
other people's wording. Write them up and hand them to the main session.

| Case | What is wrong | What it should say |
|---|---|---|
| **C55662** | *"An existing case covers a CONTACT's phone number."* **No such case exists** — that is gap 2. | Once your Case 2 exists the sentence becomes true; it should name it. |
| **C55664** | *"The suite has a case that searches a misspelled MAKE (Freightliner), which proves the make is searchable."* It means **C44841**, a **feature** case judged against the V2 specification, and **Untested**. A capability is not proved by a test nobody has run, against a different standard. | Point at your Case 3 instead. |
| **C53605** | Titled *"Finding an asset by its year"*; its only step types **`2019 Freightliner`** — the year **and** the make. The title promises what the steps do not do. | Retitle to say what it types — the year and make together — now that Case 4 covers the year alone. |

**Also worth reporting, not fixing:** every sibling in 6769 carries `custom_automation_type: 0`, which
the 2026-09-02 ruling forbids for new cases. They predate or missed the backfill. **Do not sweep them
as part of this task** — Rule 41 means touching a case means re-verifying the whole case, and that is
its own pass.

---

## 7 · Done looks like

- [ ] Four cases live in section 6769, created with type 2 and status 1, each carrying the V1 source
      block with a citation you actually verified.
- [ ] `check_runnable_cases.py` clean for the suite.
- [ ] `check_case_render.py` clean **and** all four served pages showing `markdown fr-view`.
- [ ] All four added to run 415 by union, with the run's existing 164 tests intact.
- [ ] The three corrections in §6 written up and handed back — **not** applied by you.
- [ ] A short report in the five-table shape (Rule 98), in the QA lead's language (Rule 103 —
      `python3 build/testing-tools/plain_check.py <draft>` before it is sent), naming the four C-ids
      **with the run link** (Rule 8: a case number never travels alone).

---REFERENCE---
Run 415 — https://shopview.testrail.io/index.php?/runs/view/415 — QA branch sv9160, build
v26.36.4-7869ff2. Section 6769. Sibling cases to copy from: C55662, C55670, C55664, C53605, C55659,
C53603, C53516. Related tickets: SV-10057 *a customer cannot be found by its own telephone number* (Open, under
story SV-9163) and SV-10055 *a vehicle cannot be found by typing its year together with its make*
(Open, under story SV-9164) — both read live 15 September 2026. Feature case wrongly cited by
C55664: C44841.
Evidence for this card: COVERAGE-REPORT.md, MAPPING.json, PRESETS.json, reconcile.py in this folder.
Specification: https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945/Global+Search+-+Product+Requirements (v1.5, last modified 8 September 2026).
