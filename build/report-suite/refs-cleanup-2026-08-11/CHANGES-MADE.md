# Report Suite — what changed, refs-cleanup pass, 2026-08-11

**95 `update_case` operations, every one HTTP 200 and byte-verified, 0 mismatches, 0 collateral
changes. One field changed: `refs`. Nothing else moved on any case.**

**0 `add_case` · 0 `delete_case` · 0 section writes · 0 run writes · 0 results logged · 0 Jira
calls.** `update_run` was never called.

---

## 1 · GAP 1 — 35 version pins added, 2 variant forms normalised (37 cases)

The pin is written in the suite's **own house style**, learned from the 442 citations that already
carried one — `<REPORT> spec v<N> <YYYY-MM-DD>` — inserted immediately after `<REPORT> spec `.
**Nothing else in any entry moved**: not the ticket key, not an anchor, not a source, not a date in
descriptive text.

| Report | Live version pinned | Cases |
|---|---|---|
| Sales By Customer | **v17 2026-08-10** | 8 |
| Sales By Representative | **v18 2026-08-07** | 7 |
| Parts Velocity | **v6 2026-08-07** | 9 |
| Technician Utilization | **v7 2026-08-07** | 2 |
| Work In Progress | **v11 2026-08-10** | 7 |
| Inventory Value | **v5 2026-08-07** | 4 |
| | | **37** |

**Two of the 37 were NORMALISED, not added to.** [C30434](https://shopview.testrail.io/index.php?/cases/view/30434)
read `TU spec v7 read 2026-08-11` and [C30452](https://shopview.testrail.io/index.php?/cases/view/30452)
read `WIP spec v11 read 2026-08-11`. **Both already carried the correct version integer** — they
were never unpinned in the sense that mattered — but in a date form no pin-detector in this
workspace matches, which is precisely why the earlier pass's scan reported them as having none.
They are now in house style, and both **got shorter**. This is explained further in `FINDINGS.md` §2.

## 2 · GAP 2 — the Technician Utilization pin date, 58 cases

`TU spec v7 2026-08-06` → **`TU spec v7 2026-08-07`**. **Version integer untouched — it was always
correct.** The reasoning is in `FINDINGS.md` §3; in one line: TU v7 was published **four seconds
after** Sales By Representative v18, and those two were being dated a day apart inside the same
suite.

**This is a same-length substitution**, so **not one of the 58 entries moved a character closer to
the 248 ceiling** — which matters on a suite already sitting on it.

---

## 3 · The five condensations, in full

Only five entries could not take a pin at their existing length. **Every condensation removed
redundant text and nothing else — no ticket key, no anchor, no version, no source, no meaning.**
Full justification per case in `OVER-LIMIT.md`.

| Case | Was | Over by | Removed | Now |
|---|---|---|---|---|
| [C30111](https://shopview.testrail.io/index.php?/cases/view/30111) | 242 | 9 | `Story 4 ` · `msg ` · a stray `;` | **244** (4 spare) |
| [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) | 234 | 1 | `msg ` | **245** (3 spare) |
| [C30215](https://shopview.testrail.io/index.php?/cases/view/30215) | 238 | 5 | `Story 21 ` | **244** (4 spare) |
| [C30327](https://shopview.testrail.io/index.php?/cases/view/30327) | 239 | 5 | `the old ` | **245** (3 spare) |
| [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | 240 | 7 | `Story 9 ` | **247** (1 spare) |

**Nothing was left unwritten for length. `OVER-LIMIT.md` records a nil return, and says so plainly
rather than being omitted.**

---

## 4 · What was deliberately NOT touched

| | Cases | Why |
|---|---|---|
| **Rule 54 provenance line — both sentences** | all 480 | Not this pass's field. **Sentence 2 especially: there is no build session, so a build claim would have been invented** (Rule 12). The writer asserted Expected Results byte-identical on every write. |
| **Prose mentions of a version** | 3 | *"his SBR spec edit is pending"* · *"the SBC spec carries no error-state story"* · *"WIP spec Story 11 is silent on re-runs"*. These say what the document DOESN'T do; pinning a version into them would turn three true sentences false. Detail in `FINDINGS.md` §4. |
| **Historical version markers in descriptive text** | several | `rewritten in v10`, `the v9 contradiction`, `(SBR v16 2026-08-05)`, `spec v6 2026-07-29`. These record **when** something landed. Re-pointing them at today's version would make them lie. |
| **Expectations, steps, preconditions, titles** | all 480 | A version pin points at a document. It is not a licence to change what a case asserts (Rule 57). |
| **The 12 foreign cases** | 12 | Vladimir Tomovic's (Rule 38). Proven byte-identical including `updated_on`/`updated_by`. |

---

## 5 · Proof, all by content

| Check | Result |
|---|---|
| Our cases NOT written by this pass | **385, byte-identical, 0 drifted** (`updated_on`/`updated_by` included) |
| Foreign cases (Vladimir Tomovic) | **12, byte-identical, 0 drifted** — C38919–C38923, C43567–C43573 |
| Run 359 `include_all` | **false → false** |
| Run 359 tests | **476 → 476**, test-id and case-id sets **equal in BOTH directions** |
| Run 359 results | **535 → 535**, **all present BY ID**, 0 missing, 0 new |
| Run 359 graded-field changes | **0** |
| Run 359 `case_refs` echo | 97 rows moved across **89 distinct cases, every one traced to a case this pass wrote**; `case_title` moved on none |
| `update_run` | **never called** |

**The re-sync is an independent confirmation of scope.** Re-syncing the local case source FROM live
found **exactly 95 `refs` differing and ZERO titles, preconditions, steps or expected results** —
measured against live, not against our own intentions.

### Deliverables

| Check | Result |
|---|---|
| Four counts | live **480** · local **480** · id-map **480** · import **480**, set-equal **both ways** |
| Ours / live | **ours 480 / live 492** (the 12 foreign) |
| Shredding guard | **0 rows** carrying the signature |
| id-map | 480 rows, **0 blank C-ids**, **refs 480/480**, header unchanged |
| Import header sha256 | `a45eae40ec73b8ac`, **identical across all 13 project imports** |
| Citations still unpinned | **0** |
| Stale pins anywhere in the suite | **0** |
| `refs` entries over 248 characters | **0** |
| `refs` entries containing a comma | **0** |

The id-map C-ids and the `refs` column were **re-merged from live** after regeneration, because
`gen_import.py` blanks the one and drops the other on every rerun — a documented gotcha, handled,
not a surprise.
