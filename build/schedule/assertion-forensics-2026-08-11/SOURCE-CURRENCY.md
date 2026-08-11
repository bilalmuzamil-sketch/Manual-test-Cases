# SOURCE CURRENCY — Schedule assertion-forensics pass — 2026-08-11

**Standing Rule 31: the currency of EVERY source is established BEFORE any work, and again immediately
before anything is relied on (Rule 59).** Per source: identifier · version / last-updated · date
checked · **CURRENT / STALE / PARTIAL**, and a PARTIAL source names its exact shortfall.

**READ-ONLY pass: 0 TestRail writes · 0 Jira calls · 0 Confluence writes.**

| # | Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|---|
| **A** | **Specification** | Confluence page **713031682** | **version 27**, `2026-08-07T15:01:20.801Z`, by Branko Cicovic | **2026-08-11 13:45Z** | ✅ **CURRENT** |
| **B** | **Epic + child stories** | **SV-8685** and its children | not re-fetched by this pass | — | ⚠️ **PARTIAL** — see B below |
| **C** | **Designs** | `build/schedule/design-2026-07-27/` (Claude prototype) | **undated and undatable** | 2026-08-11 | ⚠️ **PARTIAL** — see C below |
| **D** | **Engineering tech plan** | `build/schedule/tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md` | 2026-07-29 | 2026-08-11 | ✅ **CURRENT** for the one use made of it |
| **E** | **PO answers / messages** | `branko-answers-2026-07-31/`, `branko-questions-2026-08-05/` | as committed | 2026-08-11 | ✅ **CURRENT** |
| **F** | **The 174 live cases** | TestRail group 4254 | `updated_on` 2026-08-11 13:24:37Z → 13:30:21Z | **2026-08-11 13:39Z** | ✅ **CURRENT** — read by this pass |
| **G** | **The 27 historical spec bodies** | `coverage-gaps-2026-08-11/evidence/versions/raw-v1..27.xml` | v1 → v27 | 2026-08-11 | ✅ **CURRENT**, and re-verified — see A |
| **H** | **The build** | `sv8685` QA branch | **NOT READ. Deliberately.** | — | 🔴 **NOT A SOURCE OF EXPECTED BEHAVIOUR (Rule 57), and no build fact is claimed (Rule 12)** |

---

## A · The specification — CURRENT, and the mirror is byte-identical

Re-read **live** at **2026-08-11T13:45:01Z**, read-only, `GET /wiki/rest/api/content/713031682?expand=version,body.storage`:

| | |
|---|---|
| HTTP | **200** |
| `version.number` | **27** |
| `version.when` | `2026-08-07T15:01:20.801Z` |
| `version.by` | Branko Cicovic |
| body | **43,064 chars · sha256 `4c51fb7239c84987…`** |
| vs the cached v27 mirror | ✅ **BYTE-IDENTICAL** |

Saved at `evidence/spec-live-reread-2026-08-11.xml`.

**⚠️ The Rule-31(a) trap, confirmed again: the page BODY still reads "Version: 1.0" and has for its whole
life.** Every number here is the Confluence `version.number`.

### The 27 historical bodies were REUSED, not re-fetched (Rule 27)

All 27 were cached by today's coverage pass at
`build/schedule/coverage-gaps-2026-08-11/evidence/versions/`. **Re-fetching them would have been 27
avoidable calls**; the v27 member of the set was re-verified byte-identical against the live read above,
which is the check that makes reuse safe.

### 🔴 TWO DATING TRAPS FOUND IN THE VERSION HISTORY ITSELF — both would corrupt a Rule-32 latest-wins call

**(1) v10, v12 and v14 ARE TRUNCATED PARTIAL SAVES, NOT REQUIREMENT REMOVALS.** They hold **7,314 /
8,632 / 5,918** characters against a neighbouring ~36,000, and **Branko's own next version messages say
so**: v11 *"Fix: restore full page content with correct section order"*, v13 *"Restore complete page with
all 15 sections…"*, v15 *"Restore complete PRD with all 15 sections…"*. **A naive first-appearance scan
reads them as a requirement vanishing and returning.** They are **excluded from all first-appearance
dating in this pass**, and the exclusion is recorded in `evidence/requirement-dating.json`.

**(2) v26 → v27 LOST 15,477 CHARACTERS AND LOST NO CONTENT.** 58,541 → 43,064 chars looks alarming for a
version whose message is merely *"Add §5.3 Panel collapse; toolbar row and cross-references"*. **Checked
rather than assumed: v27 has MORE content lines than v26 (349 vs 338), gained 12 lines and lost exactly
one** — *"Responsiveness. Minimum supported width is 960px …"*, which was **reworded in place** to add
*"(§5.3)"*. The byte drop is markup/attribute noise. **v27 is a strict content superset of v26. No
requirement was lost.**

---

## B · Epic and stories — PARTIAL, and the shortfall is named

**Not re-fetched by this pass.** The epic and its children were established live earlier today by the
coverage pass — **SV-8685, 26 direct children, verified two ways with equal key sets and no paging
remainder** — and nothing in this pass turns on a story's *status*, only on story *text* already quoted
in committed evidence.

**EXACT SHORTFALL: one live finding rests on a story's text that this pass did not itself re-read.**
Section 4.7 of `AUDIT.md` records that **story SV-8686 still asks for the search fade/highlight
behaviour** that the PRD deleted at v24. That fact is taken from
`build/schedule/c30041-latest-wins-2026-08-11/` (which read the story changelog and description live and
cached four before/after description snapshots), **not from a read of our own.** It is quoted as a prior
pass's finding, and the PRD-vs-story divergence it implies is carried as an open question (`Q2`), not as
a settled verdict.

---

## C · Designs — PARTIAL, and it cannot be improved by fetching

**Our baseline is `build/schedule/design-2026-07-27/` (the Claude prototype Branko ruled authoritative),
and ~48 Schedule labels were pinned from it.** Since 2026-08-06 the design is an **authoritative source
of expected behaviour** (Rule 57 as amended), which makes an undated baseline a **bigger** problem than
it was, not a smaller one.

**EXACT SHORTFALL:** SV-8915 / SV-8916 / SV-8917 and story SV-8700's own UI/UX field all cite
`claude.ai/design/p/d3cdcf5c-…?via=share` — **live, editable, no version, no date** — so **Rule 32's
latest-wins cannot be applied to it at all** (Rule 57 follow-up (i)), and fetching it again would not
tell us which artefact is current. **Which design artefact is canonical is an unanswered question**,
already outstanding.

**Bearing on this pass: none of the 9 assertion transitions in `AUDIT.md` rests on a design.** Each was
dated against the specification. The design was searched for the C29944 multi-select question and does
not speak to it.

---

## D · Tech plan — CURRENT for the one use made of it

Searched for any statement that the Status filter supports selecting more than one value. **The only
`multi-select` in the document is about a technician roster control on `LineDialog.vue`** — unrelated.
**It does not source the C29944 assertion.** Recorded because Rule 30 makes the tech plan a standard
input and a search that found nothing is a result worth stating.

---

## E · PO answers — CURRENT

`branko-answers-2026-07-31/` and `branko-questions-2026-08-05/` were searched for multi-select /
multiple-status language. **Nothing.** The only hit in the whole tree is a **pre-edit backup of the case
file itself**, carrying the case's own authoring note *"Single vs multi-select within a group is not
pinned - confirm live."*

---

## F · The 174 live cases — CURRENT, read by this pass

`get_cases` over project 1 / suite 1, filtered to the 31 sections descending from group **4254**,
read-only at **2026-08-11T13:39:44Z**:

| | |
|---|---|
| Schedule cases live | **174** |
| `created_by` | **{3} — every one ours; 0 foreign cases** (Rule 38 has nothing to exclude) |
| `custom_atmstatus` | **{1} — all 174 Not Automated** |
| `updated_on` range | 2026-08-11 13:24:37Z → 13:30:21Z |

**The suite moved under this pass, and it is recorded rather than glossed.** The snapshot the coverage
pass committed earlier today already had a stale tail — the read-on-date sweep finished at 13:30Z, nine
minutes before this read. **That is exactly why the live state was read again rather than taken from a
sibling's file** (Rule 59), and it is why `T8` in the audit is our own read.

---

## G · Local case source vs live — one genuine desync, reported not fixed

| Check | Result |
|---|---|
| Live cases with a local counterpart | **174 of 174** |
| Cases whose local **assertion body** differs from live | **1 — [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** |
| Cases whose local **full expected text** differs from live | **174** — the provenance/marker layer only (read-on dates, marker changes) |

**⚠️ C30041 IS THE ONE THAT MATTERS, AND IT IS A LIVE HAZARD.** The local source still carries all four
original assertions, **including the fade/highlight sentence the PRD deleted at v24** and the two
unsourced corollaries. **The generators run off the local source**, so **regenerating the import or the
deliverables today would resurrect a deleted requirement** and silently undo this morning's correct
trim. Carried as `STAGED-REPAIRS.md` **R3**.

The 174-case full-text difference is **not** a defect in itself — the local source simply has not
absorbed the read-on dates and marker changes written live on 2026-08-10/11 — but it means the same
hazard applies generally: **a regeneration today would also restore removed expect-fail markers and
symptom blocks.** Stated so nobody regenerates casually.

---

## H · The build — NOT read, and that is deliberate

`quick-login` and `switch-user` were **never called**: they rotate the shared session and a sibling
worker is live on this estate. **No build was opened, no build fact is claimed** (Rule 12), and under
Rule 57 the build is not a source of expected behaviour in any case — which is the entire subject of
this pass.

**For completeness, and as a quotation only:** the six §5.3 panel cases name `v3.5-af3a6e1 on 8/11/2026`
as what they were last checked against, while other cases name `v3.5-7ec992f` or `v3.5-d122eef`. **We did
not verify any of those markers**, and **0 of 174 cases are verified against the build now running**
(`build/schedule/build-verify-2026-08-11/BUILD-VERIFICATION.md`).

---

## Rule 59 — the second read, and its verdict

| | |
|---|---|
| Sources read at pass start | **2026-08-11 ~13:39Z** (live cases) |
| Sources re-read immediately before conclusions were relied on | **2026-08-11 13:45Z** (live spec) |
| **Verdict of the second read** | **UNCHANGED — spec still v27, body byte-identical to the mirror. No conclusion needed re-deriving.** |

**No writes were made, so there is no write-start read to record.** The pass that executes
`STAGED-REPAIRS.md` owes its own second read at the moment its writes begin.
