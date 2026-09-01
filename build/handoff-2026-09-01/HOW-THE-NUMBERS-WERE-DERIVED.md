# How every number in the tester brief was derived

Companion to `TESTER-BRIEF-Inline-Add-and-Edit-Parts-and-Printer-Friendly-Work-Orders-2026-09-01.md`, 1 September 2026. **Nothing here is transcribed** — every figure is printed by `build/handoff-2026-09-01/census.py` and `gen_brief.py`, which read TestRail live.

## 0 · The one thing to read if you read nothing else

**The marker count is a MARKER COUNT, not a coverage claim.** "161 tests to run" says how many tests
have steps a person can follow on this version. It does **not** say 161 requirements are covered, and
it does **not** say anything passed. Coverage and outcome are separate questions, answered by the
per-case verdict files and the tester's own run.

## Inline Add and Edit Parts

### Marker census, read live from TestRail

| Marker found in the case | Cases |
|---|---|
| `AUTOMATION: READY` | 118 |
| `NO MARKER` | 1 |
| **suite total** | **119** |

### The arithmetic gate, shown BOTH ways

A gate shown one way is not a gate. Over the cases this pass actually wrote:

```
READY 118  +  EXPECT-FAIL 0   =  118
total 118  -  HOLD 0            =  118
                                       -> CLOSES
```

**Excluded from the gate, and why:** C45220: foreign — written by Vladimir Tomovic (Rule 38). Counting a case this pass was not permitted to write would fail the gate for a reason that has nothing to do with the markers, so the exclusion is named rather than hidden. Suite total including it: 119.

### Foreign cases, named with their author

- **C45220** — Adding a part to a completed line reopens the line — author **Vladimir Tomovic** (TestRail user lookup, not inference). Hands-off per the foreign-case rule.

### Cases TestRail flags as Automated

- **C45220** — HELD, not written: needs a per-case go-ahead.
- **C45005** — written under the go-ahead given on 1 Sep 2026.
- **C45026** — written under the go-ahead given on 1 Sep 2026.
- **C45223** — written under the go-ahead given on 1 Sep 2026.
- **C45224** — written under the go-ahead given on 1 Sep 2026.
- **C45227** — written under the go-ahead given on 1 Sep 2026.
- **C45237** — written under the go-ahead given on 1 Sep 2026.

### The run, and the set-equality proof

- Run **418** holds **119** tests; the area holds **119** cases.
- Set-equal in **both** directions: `True`. Cases missing from the run: `none`. Tests in the run with no case: `none`.
- Results already recorded against any test in it: **0**. So no held case is sitting on a Passed result from an earlier pass, and every result the tester records will be the first.

### Runnability, run live against TestRail

`check_runnable_cases.py` read all 119 cases from the live API: **118 runnable, 1 not**.
- **C45220** fails it, and is one we are not permitted to rewrite (foreign). It is on the outstanding list, not quietly excluded.

### Where the verdicts came from

| Verdict | Cases | What it means |
|---|---|---|
| PASS | 112 | observed on the build, behaving as the document requires |
| FAIL | 3 | observed on the build, NOT behaving as the document requires |
| PARTIAL | 2 | part of the case was observed; the rest needs data this system does not have |
| FOREIGN | 1 | someone else's case, deliberately untouched |
| NOTVER | 1 | not observed — the data state or account it needs does not exist here |
| **total** | **119** | |

---

## Printer Friendly Work Orders

### Marker census, read live from TestRail

| Marker found in the case | Cases |
|---|---|
| `AUTOMATION: READY` | 38 |
| `AUTOMATION: HOLD - a work order cannot be created without a customer ("Customer is a required field"), so this printout can never be reached; awaiting a product-owner ruling` | 1 |
| `AUTOMATION: HOLD - a work order cannot be created without a vehicle ("Asset is a required field"), so this printout can never be reached; awaiting a product-owner ruling` | 1 |
| `AUTOMATION: HOLD - the product has no Cancelled line status (only Authorization required, Declined, Authorized and Complete), so this state cannot be reached; awaiting a product-owner ruling` | 1 |
| `AUTOMATION: HOLD - a work order with no line items cannot be printed at all, so this printout can never be reached; awaiting a product-owner ruling on the contradiction` | 1 |
| `AUTOMATION: HOLD - a work order with no line items cannot be printed at all, so this summary can never be reached; awaiting a product-owner ruling on the contradiction` | 1 |
| `AUTOMATION: Not available on Build to test Yet - Last checked 8/25/2026` | 1 |
| **suite total** | **44** |

### The arithmetic gate, shown BOTH ways

A gate shown one way is not a gate. Over the cases this pass actually wrote:

```
READY 38  +  EXPECT-FAIL 0   =  38
total 43  -  HOLD 5            =  38
                                       -> CLOSES
```

**Excluded from the gate, and why:** C45123: flagged Automated and no per-case go-ahead given (Rule 71). Counting a case this pass was not permitted to write would fail the gate for a reason that has nothing to do with the markers, so the exclusion is named rather than hidden. Suite total including it: 44.

### Foreign cases, named with their author

- none. Every case in this area was written by us, so the count of ours equals the suite total.

### Cases TestRail flags as Automated

- **C45123** — HELD, not written: needs a per-case go-ahead.

### The run, and the set-equality proof

- Run **419** holds **44** tests; the area holds **44** cases.
- Set-equal in **both** directions: `True`. Cases missing from the run: `none`. Tests in the run with no case: `none`.
- Results already recorded against any test in it: **0**. So no held case is sitting on a Passed result from an earlier pass, and every result the tester records will be the first.

### Runnability, run live against TestRail

`check_runnable_cases.py` read all 44 cases from the live API: **43 runnable, 1 not**.
- **C45123** fails it, and is one we are not permitted to rewrite (Automated, awaiting a per-case go-ahead). It is on the outstanding list, not quietly excluded.

### Where the verdicts came from

| Verdict | Cases | What it means |
|---|---|---|
| PASS | 38 | observed on the build, behaving as the document requires |
| UNREACHABLE | 5 | cannot be observed by anyone: the document contradicts itself |
| PARTIAL | 1 | part of the case was observed; the rest needs data this system does not have |
| **total** | **44** | |

---

## The can-the-tester-read-it gate

The served page — not the stored value — was fetched for all **4** cases written by this pass, on a logged-in browser session, and the container class of each text field was read. **Fields in an escaping container: 0.**

Every field is served in the rendering container, so what the tester opens shows formatted text and not raw tags. This is checked on the served page because the stored value cannot tell you the difference — a case can be stored perfectly and still display every tag.

## Every gate that was run before the suites left, and how to re-run it

| Gate | What it proves | Result | Re-run it with |
|---|---|---|---|
| Marker census + arithmetic gate | the marker counts balance both ways over the cases in scope | CLOSES on both suites | `python3 build/handoff-2026-09-01/census.py` |
| Runnability | a person can follow every case from the screen; read LIVE from TestRail, not from a saved copy | Inline Add and Edit Parts: 118/119 · Printer Friendly Work Orders: 43/44 — the shortfalls are the two cases we are not permitted to rewrite | `python3 build/testing-tools/check_runnable_cases.py --cases <ids>` |
| Served-page render | what the tester actually SEES is formatted text, not raw tags — checked on the served page because the stored value cannot tell you | 4 cases, 0 escaping | `node build/inline-add-edit-parts/build-verify-2026-09-01/tools/served_page_scan.mjs` |
| Marker / provenance / formatting | one marker, last in Expected Results; provenance present; no barred phrase; no styling tag; no empty field; no contradiction candidates | ALL CLEAR | `python3 build/handoff-2026-09-01/handover_gates.py` |
| Self-explaining held cases | every case the brief does not send the tester through end to end carries that reason in its OWN words, so a tester working straight from the run is still told | ALL CLEAR — 14 of 14, with C45220 named and excluded | `python3 build/handoff-2026-09-01/check_self_explains.py` |
| Run sync | the run holds exactly our cases, in both directions, with no result pre-recorded | run 418: 119 tests, set-equal True, 0 results · run 419: 44 tests, set-equal True, 0 results | `census.py` prints it |

**One correction worth recording, because it nearly went out as a finding.** The formatting gate's
first version flagged 350 "inline tags" and 124 "entities" across the 161 cases. That was wrong.
`<p>` and `<br>` are what the TestRail editor itself emits and they render correctly; `&amp;`
renders as `&`. The 161 cases use nothing else — measured — and the served-page scan showed zero
literal tags. The gate was rewritten to look only for tags TestRail will not honour.

**And one thing this pass added rather than found.** 14 cases the brief tells the tester to skip or
to run only partly carried no such note inside the case. They now do — written through the editor,
re-scanned, and re-gated. Two of them (the printout of a work order with no line items) also moved
from `AUTOMATION: READY` to `AUTOMATION: HOLD`, because nobody can run them: the print option is
greyed out in exactly that situation. Both suites' gates were re-derived afterwards and still close.

## What this working does NOT establish

- **That the routes are correct.** The runnability check proves a route is present and
  tester-shaped, not that it still exists on a later build. It is paired with the per-case
  observations, which were made on this build.
- **That the features work.** That is what the run is for.
- **That coverage is complete.** An outside-in gap hunt against the specification is a separate
  pass and has not been claimed here.
