# FILTERS — COMPLETION REPORT, 2026-08-12

**Every figure below was derived LIVE from TestRail and the build at report time — read at
`2026-08-12T11:49:19Z`.** Counts on this project have moved *during* the session (see the run row), so
the read time is part of the number.

**Build: `v3.6-3e9dd6d`** · last-modified Tue 11 Aug 2026 07:45:44 GMT · etag `b1b2623f07bec03883f57a0e17204431`
· `index.html` sha256 `fa01a52544d9fc96113f6785bec26bb43771af57fe2bc8c6120d4b6fbb11d4cb` — **unmoved
across the session.** Location: **Staging Heavy Duty - 9919**.

---

## THE TABLE

| # | Measure | Figure |
|---|---|---|
| 1 | **Total cases — ours / live incl. foreign** | **115 ours / 120 live** (5 foreign, C43576–C43580, Ahtasham Amjad, `created_by = 7`) |
| 2 | **Source-verified** — a per-source read-date **and** a current spec version pin | **115 of 115** — every case carries `read on …` dates and pins Filters spec **Confluence v19 (6 Aug 2026)**, the live version |
| 3a | **Build-verified — naming the build NOW RUNNING** (`v3.6-3e9dd6d`) | **13 of 115** (12 inherited + C43590 re-confirmed today) |
| 3b | **Build-verified — naming an EARLIER build** | **92** name `v3.4.2-d00239b` (5 Aug) — *93 before C43590 was corrected* |
| 3c | **No build line at all** | **10** — and this is not a defect: each says in its own text that it has not been checked against a build |
| 4 | **Steps AND preconditions actually walked on the build** | **9 with every step verified** · **13 more with the navigation path and every named control verified** · **97 never walked** |
| 5a | **Runnable vs held** | **97 runnable · 18 held** |
| 5b | **Marker arithmetic, both ways** | `READY 90 + READY-EXPECT-FAIL 7 = 97` **and** `115 − HOLD 18 = 97` — **the gate closes** |
| 6 | **Created / updated / deleted** | **0 created · 1 updated · 0 deleted** |
| 7 | **What is left** | itemised below |

**Row 4 is the number that answers "can a tester pick this up tomorrow?", and it is deliberately the
smallest one in the table.** An unverified step is an unverified case, so the 13 are not folded into
the 9. Rows 3 and 4 are different questions: row 3 is what a case *says* it was last checked against;
row 4 is what this session actually drove.

---

## WHAT WAS DONE

- **The 29 untested-and-runnable cases were taken first** — what the tester opens first — and **9 were
  driven end to end**, with 13 more having every screen, tab, chip and button they name confirmed
  present where the step says it is.
- **One correction pushed: [C43590](https://shopview.testrail.io/index.php?/cases/view/43590)**, whose
  precondition sent the tester to Parts → Part Sales as the example of a one-filter page. That page now
  has **no filter bar at all**; **Reports → Technician Efficiency** has exactly one filter button and no
  collapse control — the state the case exists to observe. Corrected as **cosmetic**, and the escape
  hatch widened to cover zero-filter pages, which the old wording did not anticipate. Without it a
  runnable test would have been marked BLOCKED tomorrow.
- **One substantive divergence recorded and raised, with the case deliberately left alone:**
  **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897)**. The specification (v19,
  `S8-R4`/`S8-R5`) requires the empty state to offer a separate way to clear the search; the build
  offers **`Clear Filters`** and nothing else, and its message names filters only. The case keeps the
  documented expectation and the **tester will fail it, which is correct** — adding a hold would have
  disarmed a case doing its job.
- **Eleven false absences were caught before reporting**, each traced to our own harness rather than the
  product — including the Search-button hover, which the first check **could not** have detected because
  Quasar paints hover on a child element.
- **The `text-transform` trap was ruled out**: the tabs' outer element says `uppercase` but the inner
  `.q-tab__label` says `capitalize` and wins, so **All / Estimates / Create Work Order are right as
  written** and nothing was "corrected" into being wrong.

## WHAT WAS NOT DONE, AND WHY

- **93 of the 115 cases were not walked at all.** The 29-case priority set was the brief's ordering and
  it was not exhausted either — 7 of the 29 remain.
- **No re-stamp campaign was run.** 92 cases still name the 5 August build. **Re-stamping them would
  have been unsupportable**: the bar is that a case's labels were actually compared against a harvest
  from this build, and this session harvested surfaces rather than adjudicating all 115 cases against
  them. A stamp asserting a check nobody made is worth less than an honest stale one.
- **No ticket was filed** — the creation hold is active.

---

## WHAT IS LEFT — itemised, with what each item waits on

| # | Item | Waiting on | Who can clear it |
|---|---|---|---|
| 1 | **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897) needs a defect ticket** — the empty state does not offer a separate clear-the-search control, against spec v19 `S8-R4`/`S8-R5` | **The Jira creation hold**, re-stated 2026-08-12: *"However for now the Jira ticket creation is still on hold."* | **The QA lead** — one word lifts it |
| 2 | **7 of the 29 priority cases still unwalked** — C29581, C29588, C29619, C38876, C38879, C38886, C43560 | Session time; and for **C29581/C29588** specifically, a **staff-record deactivation**, which is barred here because such an edit destroys the session of every holder | A tester can do C29581/C29588 directly; the rest need another pass |
| 3 | **86 of the 115 never examined by any runnability walk** (115 − 29) | Session time | Another pass |
| 4 | **92 cases still name the 5 August build** in their Rule-54 sentence 2 | A pass that actually compares each case's labels against a harvest from `v3.6-3e9dd6d` | Another pass — **not** a bulk re-stamp |
| 5 | **[C38891](https://shopview.testrail.io/index.php?/cases/view/38891) — the 42-surface walk** — two names known wrong (`IBS Batch Transactions` → **IBS Batches**, `Sales Tax Invoices` → **Sales Tax Collected**) | One pass that walks all 42 surfaces at once, by URL not by name | Another pass; the case is held on the page-search rollout anyway |
| 6 | **8 of the 18 held cases wait on Branko's Parts and Reports product write-up** | **Branko** — outstanding since **27 July** | The PO |
| 7 | **5 held cases already carry a `Passed` result** — C29559, C29609, C29610, C29612, C29615 — graded by user 7 with empty comments, including one whose whole assertion is that one person's saved filters do not reach another | **The QA lead's judgement.** Reported, not touched — another author's result on our case | The QA lead |
| 8 | **[C38880](https://shopview.testrail.io/index.php?/cases/view/38880) is held on a QA-lead ruling** | A ruling. The behaviour **is** documented (`S10-R4`), so this may simply be releasable | The QA lead |

---

## PROOFS

| | |
|---|---|
| Writes | **1 `update_case`**, byte-verified on all three text fields; only `custom_preconds` and `custom_steps` moved |
| Collateral | The other **114** of ours: **0** with a moved `updated_on`/`updated_by` |
| Foreign five | **30 fields each, 0 differing**, `updated_by = 7` intact — never edited |
| Run 352 | `include_all` still **false**; **0** run writes, **0** results logged; every prior test and result present **by id**, **0** fields changed on any prior result |
| Jira | **0 calls that create anything** |
| `custom_atmstatus` | **never sent**; reads `1` before and after on the one case written |
| Secrets | `scan_secrets.py` clean on every staged diff; no `Cookie` or `Authorization` header in any evidence file |

**One thing this pass did NOT do and must be read as such: run 352 changed before it started** —
115 → 120 tests and 473 → 632 results between the 06:15Z baseline and 11:05Z, and **all 115 of our
tests are now assigned to user 7**. That is somebody preparing the run for the tester, under our shared
account. It is not ours, and it is why runnability was the right thing to spend the session on.
