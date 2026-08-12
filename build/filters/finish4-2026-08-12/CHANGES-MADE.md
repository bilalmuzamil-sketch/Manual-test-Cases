# FILTERS — CHANGES MADE (finish4), 2026-08-12

**Build `v3.7-20e801b`.** Every change below is a **route** correction or a **provenance** re-stamp.
**No expectation was altered on any case**, and no marker was changed.

---

## 1 · TEXT CHANGED — one case, one sentence

### [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) — step 2

| | |
|---|---|
| **Before** | `2. Sort the table by a column, then move to the next page of results.` |
| **After** | `2. Sort the table by a column, then scroll down through the results to see more.` |

**Why.** There is **no pagination anywhere on the Work Orders list** — no `.q-table__bottom`, no
`.q-pagination`, no rows-per-page control, no next/previous, no "load more". The table is a Quasar
virtual scroll and results are advanced by scrolling its container. A tester following the old step
would have hunted for a control that does not exist.

**Why this is a correction and not a defect report.** Spec **S13-R14** says the query *"survives
sorting, pagination"*, but its subject is the **query's retention**, not the existence of a pager,
and **nothing in the specification requires the table to be paginated**. So no requirement is
breached. A reader of *"move to the next page"* would recognise *"scroll down through the results"*
as the same act — **cosmetic**, corrected to the minimum that makes the step executable.

**What was deliberately left alone:** expectation 1 still reads *"Sorting and paging keep your
search applied…"*. That is **spec language from S13-R14** and not ours to rewrite (Rule 57). The
residual wording point is raised in `DIVERGENCES.md` §2.

---

## 2 · PROVENANCE RE-STAMPED — six cases

Rule-54 **sentence 2 only**, replaced (never appended), on the six cases this pass walked end to
end:

| Case | sentence 2 before | sentence 2 after |
|---|---|---|
| [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | `…build v3.4.2-d00239b on 8/5/2026.` | `Last checked against build v3.7-20e801b on 12 August 2026.` |
| [C29569](https://shopview.testrail.io/index.php?/cases/view/29569) | `…build v3.4.2-d00239b on 8/5/2026.` | same as above |
| [C29594](https://shopview.testrail.io/index.php?/cases/view/29594) | `…build v3.4.2-d00239b on 8/5/2026.` | same as above |
| [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) | `…build v3.6-3e9dd6d on 8/11/2026.` | same as above |
| [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | `…build v3.4.2-d00239b on 8/5/2026.` | same as above |
| [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) | `…build v3.6-3e9dd6d on 12 August 2026.` | same as above |

**Sentence 1 was not touched on any of them.** It names documents only — the epic, the owning story
where there is one, and the specification at Confluence v19 with each source's read-date. Putting a
build into it is exactly what Rule 54's 2026-08-05 amendment forbids.

**Verified after every write:** each case carries the new sentence **exactly once**, **zero**
mentions of any older build, and **no** leftover "not yet checked" wording.

---

## 3 · WHAT WAS DELIBERATELY **NOT** CHANGED

Recorded so a deliberate omission cannot later look like a miss (Rule 46).

| | why |
|---|---|
| **[C29614](https://shopview.testrail.io/index.php?/cases/view/29614) — no stamp** | Step 6 was not completed. It depends on a saved filter being restored on load, which this pass could not settle (`DIVERGENCES.md` §3). A build line would assert a check we did not finish (Rule 12). **It also carries `custom_atmstatus = 3`** — Vlad's flag — so completing it later owes him a note (Rule 65). |
| **[C43560](https://shopview.testrail.io/index.php?/cases/view/43560) — no stamp** | Steps 5–6 not completed; the first cause was **our own** implementation error, and underneath it the same restore question. **Its honest *"This test has not yet been checked against any build."* was left in place** rather than replaced with a build line. |
| **[C29568](https://shopview.testrail.io/index.php?/cases/view/29568) expectation 3** | An **unsourced** ellipsis assertion — the spec requires no truncation on tags. The repair is removal or scope-conditional wording, i.e. an **expectation** edit. Recommended wording is in `DIVERGENCES.md` §1; **the QA lead's call**, on release eve. |
| **C38886 expectation 1's word "paging"** | Spec-sourced from S13-R14. Raised, not rewritten. |
| **Every `AUTOMATION:` marker** | Nothing observed justified a marker change. Census unchanged: **90 READY · 7 EXPECT-FAIL · 18 HOLD = 115**, gate passing both ways. |
| **The 21 cases outside this pass's scope** | 14 waiting on Branko, 2 needing a staff deactivation, 4 held for recorded reasons, C38876 already raised. Untouched by instruction. |
| **The 5 foreign cases** | C43576–C43580 are Ahtasham Amjad's. Never opened for editing; proven byte-identical including `updated_on`/`updated_by` (Rule 38). |
| **Run 352** | Never written to. `include_all` still false, 645 results all present by id, 0 graded-field changes, 0 new results. The tester is grading it live. |
| **Jira** | **Nothing created.** The hold stands. C38897 still needs a ticket when it lifts — it stays written up, not filed. |

---

## 4 · ENVIRONMENT

**Seeded and left in place** (tagged; the QA lead has ruled cleanup unnecessary): one customer,
**`ZZAUTOTEST Extraordinarily And Exceedingly Long Customer Business Name For Tag Ellipsis
Truncation Verification Incorporated Limited Liability Partnership Of Southern Alberta And
Region`** — 185 characters, id `5b4b41b9-a34a-45b4-957b-9299edfc14fa`, no work orders. Created so
C29568's overflow question could be answered with a name long enough to actually overflow.

**One failed create attempt made nothing** — the API returned `{"errors":[{"error":"Name is
missing."}]}` and no customer was created. Checked rather than assumed.

**No role, staff record or organisation setting was touched at any point.** Such an edit destroys
the session of every holder.

**The saved filter preference was returned to `filters: []` and proven so.** That is **baseline
hygiene, not tidying**: a polluted preference wrecked finish3's C43560 attempts and produced this
pass's own false scare.
