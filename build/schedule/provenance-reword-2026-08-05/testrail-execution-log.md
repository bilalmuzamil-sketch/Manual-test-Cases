# Schedule — TestRail execution log, 5 August 2026 (provenance re-word + three coverage gaps + run sync)

**Sources read at pass start: 2026-08-05T17:11:48Z (build) / 17:12:21Z (spec).
Sources re-read at write start: 2026-08-05T17:33Z — verdict UNCHANGED** (Standing Rule 59; both
timestamps recorded, as the rule requires).

Build marker read **17:11:48Z** and **17:29:54Z** — `index.html` **sha256 identical**
(`d422adc92219e16c908b4c2bdea2e7e4c80bbd81c288bfde385b9d1d6fc4dc62`), so nothing redeployed under
this pass. Marker: **`v3.5-d122eef`**.

## Totals

| Operation | Count | HTTP | Verification |
|---|---:|---|---|
| `update_case` (provenance re-stamp) | **241 ops over 165 distinct cases** | **200 on every one** | **MATCH on every one**, 28 fields compared each |
| `add_case` (the three coverage gaps) | **3** | **200 on every one** | **MATCH on every one**, 11 fields compared each |
| `update_run` (run 357 union) | **1** | **200** | **VERIFIED OK** — see below |
| `add_result` / `delete_case` / `delete_section` / `add_section` | **0** | — | — |
| Jira issues created | **0** | — | every Jira call was a read |

## Why 241 operations for 165 cases — owned, not hidden

The first executor run was launched in the foreground with a 2-minute limit. **The limit killed the
foreground wait, not the process**, so it ran on and completed all 165. A resume was then started from
index 89 and re-wrote **76 cases a second time with a byte-identical payload**.

**Consequences, stated exactly:** the stored content is correct (all 241 ops re-GET and byte-verified
MATCH, and the final full-suite read confirms 165/165 equal the intended text); the cost is that
**76 cases carry an extra `updated_on` bump that achieved nothing**. No content was harmed, and no
other field moved on any case. The lesson for the next long batch: **check whether a timed-out
foreground job is still alive before resuming it.**

## The omit-field re-render did NOT fire

Playbook §J normalisation #3 — `update_case` re-renders any text field omitted from the payload,
wrapping `custom_preconds` / `custom_steps` in `<p>` and converting `\n` to `\r\n`, **intermittently**.
**Every one of the 241 payloads carried all three text fields** (`custom_expected`,
`custom_preconds`, `custom_steps`). Verified on the final full read of all 168 cases:

> **0 cases contain `<p>`, `<ol>`, `<li>` or `\r\n` in any of the three text fields.**

## Declared normalisation relied upon

`refs` only, verified under `','.join(p.strip() for p in s.split(','))` — the one recorded TestRail
transformation. Every `refs` entry on the three new cases is **≤ 248 characters** (the pattern limit),
so no `400 Field :refs does not match the required pattern` was possible.

## The provenance re-stamp: what changed, per case

**Removed** — exactly two variants, and nothing else:

| Removed text | Cases |
|---|---:|
| `It was last checked against build v3.5-4873abe on 8/4/2026; the branch has since been rebuilt to v3.5-be42149 and this case has not been re-checked against it.` | **157** |
| `It was verified against the build v3.5-be42149 on 8/5/2026.` | **8** |

**Written** — the canonical sentence 2, with an honest per-case build and date:

| Written | Cases | Why that build |
|---|---:|---|
| `Last checked against build v3.5-be42149 on 8/5/2026.` | **8** | genuinely re-observed live on that build in the previous pass |
| `Last checked against build v3.5-4873abe on 8/4/2026.` | **157** | verdict carried forward from 4 August; **nobody looked at these on any later build** |

**Sentence 1 was not touched on any case.** A live check does not change where an expectation comes
from, so every honesty variant survived byte-for-byte: the 4 that follow a later product-owner
decision, the 4 where the specification states the point both ways, the 6 anchored on the engineering
technical plan, the 2 whose limits come from that plan, and the shop-closure pair whose HOLD marker
still says in plain words that **the question has never been sent, so the blocker is us.**

### Two defects in our own text that this pass removed, recorded as findings

1. **8 cases said the expectation was *"verified against the build"*.** That makes the build the agent
   of verification, which Rule 54 bars outright — and **two of the eight are EXPECT-FAIL cases that
   fail on that very build**, so the line contradicted the case's own body.
2. **157 cases named `v3.5-be42149` as "the branch has since been rebuilt to".** That was true when
   written and became **false within hours**: the branch is now on `v3.5-d122eef`.

**The judgement call, stated as one.** The replacement sentence names only the build the case was
**checked against** and deliberately does **not** name the currently-deployed build. Embedding "the
current build is X" in 165 cases guarantees all 165 go stale on every redeploy — and there have been
**three markers in two days**. The current-build comparison therefore lives in
`READINESS-2026-08-05.md` and the Rule-49 queue, which are one file each to keep current. A reader can
still see the gap, because the sentence carries a specific build **and** a specific date.

### Verified across all 165 after the write

| Check | Result |
|---|---|
| `custom_expected` equals the intended text | **165 / 165** |
| Collateral change on any other field (excluding `updated_on`/`updated_by`) | **0** |
| Exactly one provenance line per case | **165 / 165** |
| Exactly one checking sentence per case | **165 / 165** |
| Exactly one automation marker per case | **165 / 165** |
| `"as per the build"` · `"verified against"` · `"tested on"` · `"as the build behaves"` | **0 · 0 · 0 · 0** |
| Raw markup or CRLF in any text field | **0** |

## The three new cases

| Internal ID | C-id | Section | Marker | Verdict |
|---|---|---|---|---|
| **SCH-NAV-08** | **[C43554](https://shopview.testrail.io/index.php?/cases/view/43554)** | 4255 Navigation and Layout | `READY - EXPECT FAIL (SV-8863)` | DEVIATION, ticketed |
| **SCH-DND-09** | **[C43555](https://shopview.testrail.io/index.php?/cases/view/43555)** | 4260 Drag-and-Drop Scheduling | `HOLD - waiting on the product owner's answer on SV-8870…` | waiting on the PO |
| **SCH-REAS-07** | **[C43556](https://shopview.testrail.io/index.php?/cases/view/43556)** | 4275 Reassignment and Context Menu | `READY - EXPECT FAIL (SV-8867)` | DEVIATION, ticketed |

`custom_atmstatus: 3` + `custom_automation_type: 0` + `template_id: 1` on all three, as `add_case`
requires. Titles 73 / 73 / 71 characters. **None is an API case** — the QA lead ruled *"No test cases
for API only findings please"*, and none of the three names an endpoint, a verb or a status code, so
none went to section 5409. Sources, live evidence and the reason each internal ID is safe:
`NEW-CASES.md`.

## Run 357 — union-only sync, and the proof

Executor: `tools/run_sync_357_only.py`, a copy of the proven
`build/testrail-run-sync-2026-08-05/tools/run_sync_2026_08_05.py` with **`SCOPE` cut to run 357
alone**, because this worker owns `build/schedule/**` and other workers were live on Report Suite and
Filters. The unsafe 2026-07-31 script was not used. Every verification line below is the executor's
own output.

| Check | Result |
|---|---|
| `include_all` | **false** before and after — a fixed selection, which is why the sync was needed |
| Test count | **165 → 168** (expected 168) |
| `case_id` set equality | **both directions empty** — got−want and want−got |
| Prior tests present **by id** | **165 of 165**, 0 lost, 0 rebound to a different case |
| **Prior results present BY ID** | **429 of 429, 0 missing** |
| Graded-field changes on those 429 | **0** |
| Declared echoes (`case_title`, `case_refs`) that moved | **0** |
| New results since the snapshot | **0** — we call no `add_result` |
| Run record | 35 fields compared; only `untested_count` and `updated_on` moved, both derived |
| Foreign cases in the group | **0** (all 168 `created_by = 3`) |

Snapshots: `snapshots-before/run-357-before.json` (committed **before** the write) and
`snapshots-after/run-357-after.json`. Plan: `sync-plan.json`. Verdict: `verification.json`.

## Deliverables

| Check | Result |
|---|---|
| Local source re-synced **from live before** regenerating | 165 cases refreshed from the live text, then the 3 new bodies added |
| **Shredding guard** (`joinlines` newline-between-every-character) | **RAN and PASSED — 0 of 168 rows carry the signature**, independently re-checked with a 6-character regex |
| Import rows | **168** |
| id-map | **168 rows, 0 blank C-ids, refs 168/168**; C-ids re-merged after the generator blanked them, then **proven equal to live in both directions**, with **0 title and 0 refs mismatches** against live |
| Import header sha256 | **`f2d76051d8a42e62` — identical to all five peer imports** |
| Four counts | **live 168 · local active 168 (195 bodies − 27 retired) · id-map 168 · import 168, set-equal in every direction** |
| Import hygiene | 0 duplicate titles · 0 titles over 80 characters · 0 occurrences of "VIU" · 0 feature-flag words · 0 internal IDs leaked |

## Marker tally and the arithmetic gate

| Marker | Count |
|---|---:|
| `AUTOMATION: READY` | **137** |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | **23** |
| `AUTOMATION: HOLD - <reason>` | **8** |
| **Total** | **168** |

```
  cases                            168
  - waiting on the product owner     3   (2 shop closures + SCH-DND-09)
  - cannot be set up here            2
  - not built yet                    3
  ------------------------------------
  READY TO AUTOMATE                160

  markers: READY 137 + READY-EXPECT-FAIL 23 = 160
```

**The two figures agree. THE GATE PASSES.** The figure moved 158 → 160: two of the three new cases
are automatable-and-expected-to-fail, and the third is held on the product owner.

## Environment

Nothing seeded. One all-day event was reassigned by an imprecisely-targeted early drag and was
**restored through the interface and proven byte-identical**: 366 shifts / 33 events / 7 series, 0
added, 0 removed, 0 changed, id sets equal both directions. Told in full in `NEW-CASES.md`. No role
was changed, so none needed resetting to template.
