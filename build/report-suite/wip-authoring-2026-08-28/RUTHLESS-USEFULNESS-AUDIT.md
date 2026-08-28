# Ruthless Usefulness Audit (Rule 28) — WIP authoring 2026-08-28

**Population:** 4 authored cases. **Read cold:** 4 of 4 (100%). No sampling.

## (1) USEFUL

| Case | Verdict | Why |
|---|---|---|
| `WIP-ERN-NEG-01` (S4-E3, S4-R14) | **KEEP** | Distinct observable behaviour; failure (a clamped-at-zero or unsigned Total) is a real reportable money bug. Not covered elsewhere: C30474 formats *"a negative money value **if one exists**"* and never produces one; C43817 gives the Total formula with no negative case |
| `WIP-ERN-CMP-02` (S4-R15a/R16a/R18a) | **KEEP** | Load-bearing calculation contract, and the exact defect SV-9119 raised. C43821 asserts only the row-level `Earned = Total − Adjustments`; the under-clocked/part-received scenario and the labor/parts column split are untested |
| `WIP-SRT-NUL-03` (S4-R9 null placement) | **KEEP** | A sort-null contract, not a sort-direction explosion: it asserts *grouping*, which the existing four sorting cases never do. The only case for the 2026-08-13 ruling |
| `WIP-EXP-UNI-04` (S9-R14) | **KEEP** | Export-vs-screen fidelity with a blank-cell failure mode. Distinct from C30516 (headings) and C30511 (columns/filters/totals). Not an "export pair duplicating a whole filter matrix" — it asserts two cells only |

**MERGE / WEAK-KEEP / CUT: 0.** Slop patterns checked and none present: no near-duplicate across
areas, no sort-direction explosion (one case, both directions in one run), no per-column display
filler, no tooltip present-vs-text split, no empty-state triplet, no permission case, no export pair.

**Deliberate non-authoring — 28 requirements were NOT given a case on purpose.** Authoring them would
have created exactly the slop this audit exists to prevent (see `COVERAGE-MATRIX.md`). They are
`update_case`/refs-backfill work instead.

## (2) MAKES SENSE — cold read, 4 of 4

| Case | Verdict | Cold-read notes |
|---|---|---|
| `WIP-ERN-NEG-01` | **SENSIBLE** | Preconditions reachable (seed one $100 approved line + a $250 work-order discount). Every step is one action. Expected follows arithmetically and states the worked example. No absolute enumeration |
| `WIP-ERN-CMP-02` | **SENSIBLE** | The before/after structure makes the assertion falsifiable. Numbers are internally consistent ($400 quoted / 1.0 h clocked → $100 earned before, $400 after; $200 parts / 2 of 4 received → $100 before, $200 after). Step 3 (set status to Complete) is a real user action |
| `WIP-SRT-NUL-03` | **SENSIBLE** | Both sort directions in one run; the "never interleaved" assertion is stated as its own numbered line so a tester cannot pass on grouping alone |
| `WIP-EXP-UNI-04` | **SENSIBLE** | Three seeded data states each map to a numbered expectation. §6 pre-empts the known "Unit"/"Branch" heading difference so a tester does not fail a correct build on it |

**NONSENSE: 0. FIX-WORDING: 0.**

### Cross-case consistency sweep (mandatory)

| Check | Result |
|---|---|
| Cases grouped by the control they assert on, expected results diffed | No pair asserts opposite things |
| Opposite-assertion keyword sweep (shown/hidden, $0.00/non-zero, last/first) | `WIP-ERN-CMP-02` says Remaining is `$0.00` on the Completed tab — **agrees** with C43821 §1 and with S4a-R1/R2 |
| TITLE-vs-EXPECTED on every case | All 4 titles are entailed by their expected results |
| Cases sharing a `refs` anchor diffed | `S4-R9`: `WIP-SRT-NUL-03` (null placement) vs **C30485** §4 (*"The Asset column sorts by the Unit #"*) — **compatible, not contradictory**; the new case re-states the same key in §5 and adds the placement rule |
| Surface-split check (Rule 40) | `S9-R14` is export-only by its own text; the on-screen half is S4-R8, already covered by C30470. `S4-E3` is on-screen; its export surface inherits from C30511 §1 (downloads carry the shown columns) and C30512 (downloaded money keeps on-screen formats) — no split created |
| **Contradictions found / unresolved** | **1 found, 0 unresolved-and-shipped** — S10-R2 vs C30520 was found and **HELD** rather than authored (`HELD-AND-PO-QUESTIONS.md` item 1) |

## (3) GENUINE + LAYMAN-RUNNABLE

| Check | Result |
|---|---|
| Traceable to ticket + spec | 4/4 — every `refs` carries the owning story key + `WIP spec v28 2026-08-24` + the anchors |
| Rule-54 provenance, sentence 1 documents only, sentence 2 omitted | 4/4 |
| Executable by a non-technical tester | 4/4 — no developer tools, no back-end access, no query. `WIP-EXP-UNI-04` needs only opening a downloaded file |
| Jargon / case-IDs / spec anchors in tester-facing prose | 0 occurrences (mechanical check 7 clean; anchors appear only inside the provenance line, which Rule 54 requires) |
| Mechanical readiness gate (`check_tester_readiness.py`) | **4/4 PASS**, 0 failures, 0 notes |

## IS THE CRITIC RIGHT?

| Half of the claim | This pass |
|---|---|
| *"more than 70% useless test cases"* | **0% waste** — 4 authored, 4 KEEP, 0 CUT/MERGE. And **28 requirements were deliberately NOT turned into cases** precisely because they would have been waste |
| *"some tests just do not make sense"* | **0% nonsense** — 4/4 SENSIBLE on a 100% cold read |

The audit **recommends only**. No merge, cut, delete or edit was executed in TestRail.
