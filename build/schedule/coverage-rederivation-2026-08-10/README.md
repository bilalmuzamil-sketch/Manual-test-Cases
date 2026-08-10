# Schedule — the requirement → case map. Built 2026-08-10. **Read this first.**

**Schedule had never had a requirement→case map.** This folder is the first one. It exists so that
anyone — a reviewer, an automation engineer, a PO, a QA who has never seen the project — can check
our coverage themselves instead of taking our word for it.

**Everything here is READ-ONLY.** No TestRail write, no Jira write, no run write, no ticket created
(Rules 6 and 62). Every proposed change is staged and unexecuted.

---

## The answer in one table

| | |
|---|---|
| Live specification | **Confluence v27**, 2026-08-07T15:01:20Z (the in-body "Version: 1.0" is a lie — Rule 31 trap (a)) |
| Requirement lines · **assertions** | 234 · **397** |
| **Covered** | **282** |
| **Partial** | **4** |
| **Uncovered** | **19** — all of them the new §5.3 Panel collapse and its two cross-references |
| **Blocked** | **1** — the spec contradicts itself on shop closures |
| Not independently testable (label cells, data model, framing, cross-refs, goals) | **91** |
| Cases examined, both directions | **168 of 168** |
| Cases with a **stale § anchor** | **0** |
| Cases with a **stale spec version stamp** | **168** — every one says "version 23" |

**Can Schedule coverage be called complete? Not yet — for one reason and one only: §5.3.**

---

## Where to look

| File | What it answers |
|---|---|
| **`COVERAGE-MAP.md`** | **the map.** Both directions, all 397 assertions, every COVERED row quoting the requirement and the case's own text side by side (Rule 45(e)). Start at *"The rows that are NOT plain COVERED"*. |
| `SOURCE-CURRENCY.md` | what version every source is at, how we read it, and the two Rule-31 traps this page is the standing example of |
| `SPEC-DIFF.md` | v25 → v27, with a verdict row per changed requirement (Rule 43) |
| `GAPS.md` | the uncovered and partial rows, split **ours / not built / not V1**, each with the case that would cover it — **proposed, not authored** |
| `ORPHANS.md` | Direction 2: stale anchors (0), and the sharper find — **5 cases citing a source that does not support the assertion** |
| `PROPOSED-CHANGES.md` | 5 staged items, **none executed** |
| `DELIBERATE-DECISIONS.md` | 16 entries, HIGH 3 / MEDIUM 6 / LOW 7 — every deliberate omission, before anyone asks |
| `QUESTIONS-FOR-BRANKO.md` | **2 new questions**, and a list of what is already asked so nothing is sent twice |
| `tools/` | read-only and reusable: `fetch_spec.py` (any Confluence version + history) · `extract_requirements.py` · `assertions.py` · `map_coverage.py` · `verdicts.py` · `tr.py` (GET-only) |
| `evidence/` | v23–v27 bodies · the diff · the 27-version string-dating matrix · the raw match and verdict data |

---

## The three things worth knowing

**1 · The gap is §5.3, and it is three days old.** Confluence v27 added a whole new section — the
button that collapses the work-order panel — on 7 August. **No case covers it**, and the five cases
that mention *collapse* are all about other controls. Two cases are written out ready in `GAPS.md`.

**2 · One word changed in v26 and it left a case half-right.** The capacity tooltip went from *"a
per-technician breakdown"* to *"a per-**assigned** technician breakdown"* — with **no version
comment**, against wording that had stood since v1. **SCH-CAP-04 =
[C30033](https://shopview.testrail.io/index.php?/cases/view/30033)** still says *per-technician*, so
it would pass a build showing all 15 technicians or only the 3 who are booked.
**This is invisible at line level and is the reason this map is built per assertion.**

**3 · Every case is stamped four spec versions behind.** All 168 provenance lines say *"specification
version 23"*. Rule 54 says a stale stamp is itself a finding, so it is reported here rather than
quietly fixed — the re-stamp is 168 writes and needs a go-ahead.

---

## What this map does NOT claim

- **No build was observed.** Under Rule 57 a coverage question is document-side, and no Schedule QA
  sign-in was available. `quick-login` and `switch-user` were **deliberately not called** — they
  rotate the shared token and would have signed a colleague out of the Reports branch. **Nothing here
  says whether the build satisfies any requirement.**
- **The Rule-49 obligation is untouched.** `build/schedule/full-viu-2026-08-05/RECHECK-QUEUE.md` stays
  **OPEN**, the branch is not declared final, and the 168 build verdicts from 5–6 August remain
  **PROVISIONAL**.
- **The design is a PARTIAL source** and was not fetched — the three review tickets cite a live,
  editable link with no version and no date. `DELIBERATE-DECISIONS.md` entry 14, risk **HIGH**.
- **The assertion split is mechanical.** 234 lines became 397 assertions by script; every assertion
  keeps its parent line's full text so the split itself can be checked. Entry 11.

---

## OUTSTANDING — what I need from you

1. **Author the two §5.3 cases?** The one real gap.
2. **Re-stamp the spec version on all 168?** 168 writes; build markers left untouched.
3. **Fix the five provenance lines** that cite a source not supporting their assertion — the first
   three matter (`ORPHANS.md` §2).
4. **Send the 6 August Branko sheet.** Eight Schedule items including the shop-closure contradiction
   that has two cases on hold. **The blocker is us, not Branko** — one case says so in its own
   automation marker.
5. **Share this map with the two reviewers?** It is what it was built for.
