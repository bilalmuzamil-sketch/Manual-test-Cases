# TestRail execution log — Filters, 2026-08-12

**5 `update_case`. 0 `add_case`. 0 `delete_case`. 0 section writes. 0 run writes. 0 results.
0 Jira calls of any kind.**

## The operations

| Time (UTC) | Operation | Case | HTTP | Fields compared | Mismatches | Result |
|---|---|---|---|---|---|---|
| 2026-08-12T03:08:36Z | `update_case/38880` | [C38880](https://shopview.testrail.io/index.php?/cases/view/38880) | **200** | 30 | **0** | OK |
| 2026-08-12T03:08:38Z | `update_case/38881` | [C38881](https://shopview.testrail.io/index.php?/cases/view/38881) | **200** | 30 | **0** | OK |
| 2026-08-12T03:08:39Z | `update_case/38891` | [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | **200** | 30 | **0** | OK |
| 2026-08-12T03:08:40Z | `update_case/38901` | [C38901](https://shopview.testrail.io/index.php?/cases/view/38901) | **200** | 30 | **0** | OK |
| 2026-08-12T03:08:41Z | `update_case/43561` | [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) | **200** | 30 | **0** | OK |
**Every write was logged to `oplog.json` BEFORE the request was sent**, then updated with the HTTP
status and the verification outcome, so a session killed mid-batch leaves its exact position in git.

## Verification method (Rule 50)

- **All three text fields on every payload** — `custom_preconds`, `custom_steps`, `custom_expected` —
  because TestRail re-renders any omitted text field into `<p>`-wrapped HTML with CRLF, and **this
  project shows markup literally to the tester**.
- After each write, `get_case` and a **field-by-field byte comparison**: the three text fields against
  the intended payload, and **every other field against the pre-write snapshot**, `updated_on` and
  `updated_by` excluded as the only two expected to move. **30 fields per case, 0 mismatches, 0
  collateral changes.**
- **`refs` was not sent on any payload** and was verified byte-identical afterwards on all five, so
  the comma-normalisation trap was never engaged.
- **`custom_atmstatus` was not sent on any payload.** Distribution after the pass is unchanged:
  **111 cases at `1`, 4 at `3`** — C29600, C29614, C29623 and C38877, which Vladimir Tomovic set by
  hand. **None of the four was touched.**
- The batch was set to **STOP on the first mismatch**. It never triggered.

## Untouched-proofs, by content

**Run 352 — proven undamaged, not assumed:**

| | before | after |
|---|---|---|
| `include_all` | false | false |
| tests | 115 | 115 |
| case_id set equal in **both** directions | — | **yes** |
| result records | 473 | 473 |
| prior results **missing by id** | — | **0** |
| new results during the write window | — | **0** |
| field changes across all 473 prior results | — | **0** |
| counters passed / failed / untested | 65 / 7 / 43 | 65 / 7 / 43 |

**`update_run` was never called.** The run was already in sync at 115, so there was nothing to union —
and it replaces the selection, which would have destroyed 473 of another tester's results.

**The 5 foreign cases — byte-identical, including `updated_on` and `updated_by`:**
C43576, C43577, C43578, C43579, C43580 — **0 differing fields on all five** (Rule 38).

## Post-write census, re-read live

| | |
|---|---|
| ours / live total under group 4110 | **115 / 120** |
| raw markup shown literally to a tester | **0 of 115** |
| exactly one `AUTOMATION` marker, and it is the last line | **115 of 115** |
| exactly one Rule-54 provenance line | **115 of 115** |
| markers | 88 `READY` · 7 `READY - EXPECT FAIL` · 20 `HOLD` |
| arithmetic gate | **88 + 7 = 95**, and **115 − 20 = 95** — passes both ways |

**The markup census was re-run AFTER the writes**, not only before, because TestRail can re-render
hours later without moving `updated_on`.

## Rule-54 sentence 2 — deliberately NOT written

**No build stamp was added, changed or refreshed on any case.** This session observed nothing on the
build, so a `Last checked against build …` line would have been a fabricated claim. The five edited
cases keep the stamps they already had.

**This is worth being explicit about**, because ~89 cases *were* checked against the running build
yesterday and their stamps still name the 5 August build. That re-stamp is real, outstanding work —
see `FINDINGS.md` §3 — and it belongs to a pass that can either observe the build itself or is
explicitly authorised to stamp on yesterday's evidence.

## Local source

The five edited bodies were **re-synced FROM LIVE** into `build/filters/cases/`, verbatim.

⚠️ **The false-drift trap fired and was caught.** Local case files store these fields in **two**
formats — some as a numbered **string**, some as a **list of lines**. A first re-sync converted five
string-format cases into lists, producing a 107-line diff that looked like sweeping change and was
purely a storage-format artefact. **It was reverted with `git checkout` and redone with the type
asserted per case**, giving a **6-line diff**: five expected fields and one steps field, exactly the
text that was written to TestRail. This is the same class of trap the brief warned about.

---

# ADDENDUM — the second half of 2026-08-12, after fresh cookies arrived

**4 further `update_case`, bringing the day to 9.** All HTTP 200, 30 fields compared each, **0
mismatches, 0 collateral changes**. Still **0 add · 0 delete · 0 section · 0 run writes · 0 results ·
0 Jira calls**. `custom_atmstatus` never sent; distribution unchanged at **111 × `1`, 4 × `3`**.

| Time (UTC) | Case | HTTP | Fields | Mismatches | What and why |
|---|---|---|---|---|---|
| 03:35 | [C29615](https://shopview.testrail.io/index.php?/cases/view/29615) | **200** | 30 | **0** | verified live as the Technician → marker `HOLD` → `READY`; sentence 2 stamped to the observed build |
| 03:35 | [C38895](https://shopview.testrail.io/index.php?/cases/view/38895) | **200** | 30 | **0** | same, plus its stale *"we could not run it for you"* note replaced with what was found |
| 03:39 | [C43590](https://shopview.testrail.io/index.php?/cases/view/43590) | **200** | 30 | **0** | observed live (Part Sales one chip / no toggle, Inventory as control) → sentence 2 added |
| 03:39 | [C43561](https://shopview.testrail.io/index.php?/cases/view/43561) | **200** | 30 | **0** | `Sales Tax Collected` confirmed in the live Reports nav → sentence 2 added |

**Rule-54 discipline held: sentence 2 was written on exactly the 4 cases observed today, and on no
others.** 93 cases still name `v3.4.2-d00239b`, 10 name no build, 12 now name `v3.6-3e9dd6d`.

**Untouched-proofs re-run at the end of the session:**

- **Run 352** — `include_all` still false, 115 tests, **473 results, 0 missing by id, 0 field
  changes of any kind**, counters unchanged 65 / 7 / 43. `update_run` never called.
- **Foreign 5** (C43576–C43580) — **byte-identical, `updated_on` and `updated_by` included**.
- **Raw markup 0 of 115**, one marker and one provenance line on every case, **gate 97 = 97**.
- **Build `v3.6-3e9dd6d` byte-identical at start, mid-run and end** — no redeploy under the pass.

**One harness trap worth recording:** deep-linking straight to `/parts/part-sales` bounces to
`/workorders`, so a control read as "absent" there would have been an artefact. The page was reached
by **in-app navigation** instead, and **Inventory was used as a control group** — it has three chips
and **does** show the collapse toggle, which is what makes Part Sales' missing toggle a real
observation rather than a failed page load.
