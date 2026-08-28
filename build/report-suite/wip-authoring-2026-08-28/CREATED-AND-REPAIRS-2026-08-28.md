# JOB 2 — WIP coverage: three new cases, eight citation repairs, run 359 synced

**Date 2026-08-28 · QA lead approved · Report Suite / Work In Progress · WIP specification version 28 (2026-08-24), epic SV-8582.**

---

## 1 · The three cases created

`add_case` with `custom_atmstatus: 1` (Not Automated) via the canonical builder `build/testing-tools/testrail_add_case.py`, which **raises** if anything tries to send `3`.

| Internal ID | C-id | Link | Section | Covers | Anchor it closes |
|---|---|---|---|---|---|
| `WIP-STR-REC-05` | **C45208** | https://shopview.testrail.io/index.php?/cases/view/45208 | 4356 · WIP — Summary Strip | S4a-R3 | per-work-order reconciliation between the summary strip and the table, which C30489/C30490 only proved at tab-aggregate level |
| `WIP-STR-NEG-06` | **C45209** | https://shopview.testrail.io/index.php?/cases/view/45209 | 4356 · WIP — Summary Strip | S4a-N2 | the direct negative assertion, which was only implied by C30490 |
| `WIP-ADJ-OUT-07` | **C45210** | https://shopview.testrail.io/index.php?/cases/view/45210 | 4354 · WIP — Earned & Remaining | S5a-R4 | the negative invariant for the reports that carry no Adjustments, which had no asserting case at all |

No new section was created.

### Per-case verification (Rule 50 — "200 OK" alone is non-compliant)

| Check | C45208 | C45209 | C45210 |
|---|---|---|---|
| `add_case` HTTP | 200 | 200 | 200 |
| Re-`get_case` HTTP | 200 | 200 | 200 |
| title / refs / preconditions / steps / expected match the draft | ✅ | ✅ | ✅ |
| landed in the intended section | ✅ | ✅ | ✅ |
| `custom_atmstatus` = **1** (Not Automated) | ✅ | ✅ | ✅ |
| `custom_automation_type` = 0 | ✅ | ✅ | ✅ |
| title length (≤80) | 72 | 71 | 66 |
| Rendered page: container is `markdown fr-view` on all three fields | ✅ | ✅ | ✅ |
| Rendered page: literal `&lt;br&gt;` / `&lt;p&gt;` in visible text | **0** | **0** | **0** |
| Rendered page: automation marker present exactly once and LAST | ✅ | ✅ | ✅ |
| Rendered page: provenance line present exactly once, no build sentence | ✅ | ✅ | ✅ |
| Rendered visible lines (preconditions / steps / expected) | 5 / 8 / 10 | 4 / 8 / 10 | 5 / 7 / 11 |
| Mechanical readiness gate (`check_tester_readiness.py --no-build`, live) | **PASS** | **PASS** | **PASS** |

**Readiness result: 3 of 3 PASS, 100%% scored, no sampling.** That is the **mechanical subset** of Rule 84 — checks 6, 8 and 9 are human cold reads and are not claimed here.

**Rule 54 — provenance names DOCUMENTS ONLY.** Each case's provenance line names the WIP specification version 28, the anchor, the epic SV-8582 and the owning story, and **no case carries a build sentence**: none of the three has been checked against a build yet, and saying so would be a false claim (Rule 12).

**A note recorded rather than assumed:** the specification gives Story 4a and Story 5a no Jira key of their own (Story 4a says only *"Raised by SV-9119"*). Rather than invent one, each case names the owning story that specifies the surface it tests — SV-8661 for the summary strip — and **says in plain words that Story 4a/5a carries no story key**. That is a statement of what the documents show, not a guess.

### Placement of C45210

C45210 asserts a WIP-specification requirement about **other** reports, so there is no obviously right home for it. It sits in *WIP — Earned & Remaining* beside **C43821**, the case that already tests the affirmative half of the same anchor. Flagged below in case you would rather it sat elsewhere.

---

## 2 · The eight citation repairs

The assessment's finding was that **the real defect is citation drift, not missing tests** — eight of the nine anchors were tested by cases that never name them, so every coverage check reads them as gaps. **Eight anchors were repaired, across seven cases.** `refs` was the ONLY field sent.

| Case | Anchor(s) now cited | Automation status | Bodies byte-identical after the write |
|---|---|---|---|
| [C45205](https://shopview.testrail.io/index.php?/cases/view/45205) | S4a-R1 · S4a-N1 | 1 — Not Automated | yes |
| [C30489](https://shopview.testrail.io/index.php?/cases/view/30489) | S4a-R3 | 1 — Not Automated | yes |
| [C30490](https://shopview.testrail.io/index.php?/cases/view/30490) | S4a-R3 · S4a-N2 | 1 — Not Automated | yes |
| [C30493](https://shopview.testrail.io/index.php?/cases/view/30493) | S5a-R1 · S5a-R2 | 1 — Not Automated | yes |
| [C30491](https://shopview.testrail.io/index.php?/cases/view/30491) | S5a-R2 | 1 — Not Automated | yes |
| [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | S5a-R3 | **3 — Automated** | yes |
| [C43821](https://shopview.testrail.io/index.php?/cases/view/43821) | S5a-R4 | 1 — Not Automated | yes |

**Eight anchors: S4a-R1 · S4a-R3 · S4a-N1 · S4a-N2 · S5a-R1 · S5a-R2 · S5a-R3 · S5a-R4.** (S4a-R2 was already correctly cited on C43821 and needed nothing.)

**Why S5a-R4 landed on C43821 and not on the SBC/SBR sets.** The assessment suggested *"the SBC/SBR Adjustments sets"*. A coverage check scores a spec's anchors against **that report's own cases**, so a WIP anchor string written onto a Sales By Customer case would not move WIP's coverage arithmetic at all — it would only pollute SBC's `refs`. The anchor therefore went on **C43821**, the WIP case that carries the affirmative half, and it is also carried by the new **C45210**. The SBC and SBR Adjustments cases were left untouched.

### Proof the repair actually fixes the reported coverage

All 102 cases under the Work In Progress report were re-read live afterwards and searched for each anchor string. **All nine anchors are now cited:**

| Anchor | Cited on | Anchor | Cited on |
|---|---|---|---|
| S4a-R1 | C45205 | S4a-R2 | C43821 |
| S4a-R3 | C30489 · C30490 · C45208 | S4a-N1 | C45205 |
| S4a-N2 | C30490 · C45209 | S5a-R1 | C30493 |
| S5a-R2 | C30491 · C30493 | S5a-R3 | C30452 |
| S5a-R4 | C43821 · C45210 |  |  |

Before this pass **one** of the nine was cited. Now **nine of nine** are.

---

## 3 · Run 359 sync — union only

A partial `case_ids` list on `update_run` **deletes** the tests it omits and every result attached to them, so the run's tests **and its results** were snapshotted by ID before the write, the **full union** was sent, and the result was checked by ID afterwards.

| | Before | After |
|---|---|---|
| Tests in run 359 | **513** | **516** |
| Results in run 359 | **535** | **535** |

**Every one of the 513 test IDs present before the write is still present after it, and every one of the 535 result IDs is still present.** The three new cases are in the run; the test count rose by exactly three; **nothing was deleted**. Union size sent: 516 case IDs. Evidence: `RUN-359-SYNC.json`.

C45204–C45207 from the earlier pass were checked at the same time and **are already in run 359**, so the gap that pass reported has since been closed.

---

## 4 · Automated cases changed — FOR VLAD (Rule 65)

**One: [C30452](https://shopview.testrail.io/index.php?/cases/view/30452)** (`custom_atmstatus = 3`, Automated). **Only `refs` was sent**; its preconditions, steps and expected result are byte-identical before and after, and the rendered page is clean. A row has been added to `build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`.

---

## OUTSTANDING — what I need from you

1. **Where should C45210 live?** It is a WIP-specification requirement about Technician Utilization, Parts Velocity and Inventory Value. It is filed with C43821 in *WIP — Earned & Remaining*; say the word and it moves, or splits into one case per report.
2. **Story 4a and Story 5a have no Jira story key in the specification.** The cases say so plainly and name SV-8661 as the owning story for the surface. If those two stories do have keys, tell me and the `refs` and provenance lines get them.
3. **The three new cases have never been checked against a build**, so they carry no build sentence. They are ready to be run whenever you want them run.
4. **The assessment's third recommendation is still open** — re-running the anchor check with the lettered-anchor regex fix across every report's spec, since the blind spot was generic (S10-R5a, S4-R15a, S4-R16a, S4-R18a, S7-R7a, S7-R8a, S9-R10a, S9-R10b, S9-E1/E2 all use the same form). Not done here; it was not in this batch.
