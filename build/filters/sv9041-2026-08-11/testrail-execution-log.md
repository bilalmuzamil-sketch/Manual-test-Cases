# TESTRAIL EXECUTION LOG — Filters / SV-9041 — 2026-08-11

**`update_case` ONLY. 2 operations, 2 cases.**

**0 `add_case` · 0 `delete_case` · 0 section writes · 0 run writes (`update_run` never called) ·
0 results logged · 0 Jira calls of any kind.**

---

## Per operation — Rule 50 (exhaustive, then exact)

### OP 1 — [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) — FLT-COLL-01

| | |
|---|---|
| Operation | `update_case/29601` |
| **HTTP** | **200** |
| Fields **sent** | `custom_preconds`, `custom_steps`, `custom_expected`, `refs` |
| Fields **changed** | `custom_expected`, `refs` |
| Pre-read before write (Rule 59) | all 4 text fields byte-matched the snapshot |
| **Fields compared on re-GET** | **30** |
| **Intended-field mismatches** | **0** |
| **Collateral changes** | **0** |
| `custom_atmstatus` at write time | **1** (not Automated) |
| Verification | **byte-identical MATCH** |
| Timestamp | 2026-08-11T17:56:51Z |

### OP 2 — [C43562](https://shopview.testrail.io/index.php?/cases/view/43562) — FLT-PR-PAR-01

| | |
|---|---|
| Operation | `update_case/43562` |
| **HTTP** | **200** |
| Fields **sent** | `custom_preconds`, `custom_steps`, `custom_expected`, `refs` |
| Fields **changed** | `custom_steps`, `custom_expected`, `refs` |
| Pre-read before write (Rule 59) | all 4 text fields byte-matched the snapshot |
| **Fields compared on re-GET** | **30** |
| **Intended-field mismatches** | **0** |
| **Collateral changes** | **0** |
| `custom_atmstatus` at write time | **1** (not Automated) |
| Verification | **byte-identical MATCH** |
| Timestamp | 2026-08-11T17:56:53Z |

**Totals: 2 ops · 2 × HTTP 200 · 60 field comparisons · 0 mismatches · 0 collateral changes.**

## How verification was done — both halves, not one

1. **Intended fields** re-GET and byte-compared against the exact payload dict.
2. **Every other field** compared against the pre-write snapshot and proven **byte-identical** — this
   is the half a `200 OK` can never tell you. Only `updated_on` / `updated_by` were exempt.
3. **The batch was built to STOP on any mismatch** and report both byte sequences. It did not need to.

**`refs` was verified under the declared TestRail normalisation** — split on comma, strip each entry,
rejoin — as recorded in `APP-ACTIONS-PLAYBOOK.md` §J. Both values are **comma-free**, so the
normalisation is the identity here and the comparison is a plain byte compare.

## `refs` — measured, not estimated

| Case | New `refs` | Length | Commas | ≤ 248 |
|---|---|---|---|---|
| C29601 | `SV-8786; SV-9041 (S1-R4; S1-R5; SV-9041 - toggle shown only when the page has more than one filter) [spec v19 2026-08-06]` | **121** | **0** | ✅ |
| C43562 | `SV-8785 [epic]; SV-9041 (Branko 2026-07-31 R3 Q5=A - collapse; URL and mobile match Work Orders; SV-9041 - collapse control only where a page has >1 filter; spec v19 §4 Key Decisions - context-specific filter sets) [spec v19 2026-08-06]` | **236** | **0** | ✅ |

**C43562's first draft came out at 288 characters and was rejected by the plan's own guard.** It was
**condensed, not truncated** — every element survives (the epic, SV-9041, Branko's ruling with its
date and question number, the URL/mobile parity, the new condition, the Key Decisions anchor and the
version pin); only wording was tightened. **No reference was dropped to make it fit.**

## Rule 54 — sentence 2 preserved EXACTLY on both cases

Asserted programmatically before the write, not by eye:

| Case | Sentence 2, before and after |
|---|---|
| C29601 | `Last checked against build v3.4.2-d00239b on 8/5/2026.` — **unchanged** |
| C43562 | `This test has not yet been checked against any build.` — **unchanged** |

**None added, none removed, none re-dated.** **No build was opened in this pass**, so re-dating either
would have claimed an observation that did not happen (Rule 12). Sentence 1 gained the **SV-9041 read
date of 11 August 2026** on both, alongside the existing per-source dates, which were left as they
stood.

## Automation markers — unchanged, and asserted so

| Case | Marker before | Marker after |
|---|---|---|
| C29601 | `AUTOMATION: READY` | `AUTOMATION: READY` |
| C43562 | `AUTOMATION: HOLD - the new filter bar has reached only some Parts views and one report tab, so most of this cannot be run yet` | **identical** |

The plan asserted the marker list was unchanged **and that the marker is the last thing in Expected
Results**, refusing to emit otherwise.

**No `EXPECT FAIL` marker was added to either case** (Rule 61). SV-9041's behaviour is **built and
working** — Ahtasham's QA comment records it Passed on 11 August — so there is no known failure to
describe and nothing for a tester to expect.

## Markup and CRLF — guarded at plan time

**All three text fields were sent on every payload**, because TestRail re-renders an omitted text
field into `<p>`-wrapped HTML with CRLF — and **this project shows markup literally to the tester**.
The plan additionally refused to emit any payload containing `<p>`, `<li>`, `<ol>` or `\r\n`.
Post-write live read: **0 raw markup, 0 CRLF** on both cases.

---

## RUN 352 — PROVEN UNDAMAGED, BY ID

Snapshotted before the writes and re-read after.

| Check | PRE | POST | Verdict |
|---|---|---|---|
| `include_all` | `false` | `false` | ✅ unchanged |
| Tests | 114 | 114 | ✅ |
| `case_id` sets | — | — | ✅ **equal both directions** (pre\post = [], post\pre = []) |
| Result records | **473** | **473** | ✅ |
| **Prior results missing BY ID** | — | **0 of 473** | ✅ |
| New results during the window | — | **0** | ✅ |
| **Graded-field changes on prior results** | — | **0** | ✅ |

Graded fields checked per record: `status_id`, `comment`, `defects`, `created_by`, `created_on`,
`assignedto_id`, `version`, `elapsed`, `test_id`.

**The only movement is 6 × `case_refs`** — the **declared read-time echo** of a case's `refs` onto its
run results, recorded in `APP-ACTIONS-PLAYBOOK.md` §J. **All 6 trace to C29601**, which holds exactly
6 results; **C43562 holds 0 results** (it is `HOLD` and has never been run), so nothing could echo for
it. The echo set is therefore a **strict subset of the two cases we edited**, with no unexplained
remainder.

**`update_run` was never called.** Run 352 is Ahtasham's and holds graded results; syncing it is not
in this brief and would need the QA lead's authorisation (Rules 6/34/47). **No sync was needed anyway
— the run already holds all 114 of our cases**, set-equal both ways.

---

## Post-write reconciliation

| | Count |
|---|---|
| Live (ours) | 114 |
| Local active | 114 |
| id-map | 114 |
| Import rows | 114 |

Set-equal in **both** directions on every pair. Local re-synced from live after the writes (**2 bodies
moved: `steps` 1, `expected` 2, `refs` 2**), deliverables regenerated, **id-map C-ids and `refs`
re-merged from live** after the generator blanked and dropped them, **shredding guard PASSED** plus an
independent re-check at 0, **import header sha256 `a45eae40ec73b8ac`, identical to all six peers**.

## Foreign cases

**Ahtasham Amjad's 5 (C43576–C43580) were not read into our source, not counted as ours, and not
written to.** No write of any kind was issued against them. **Ours 114 / live 119.**
