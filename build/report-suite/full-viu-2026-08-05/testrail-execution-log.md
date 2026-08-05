# TestRail execution log — Report Suite full live-observation pass, 2026-08-05

**Sources read at pass start:** 2026-08-05T19:51:00Z (build) / 19:54Z (all six specs).
**Sources RE-READ at write start (Standing Rule 59):** 2026-08-05T20:0(x)Z — build marker re-read
`v3.5-16cf83f`, `index.html` byte-identical to the 19:51:00Z read; all six spec versions re-confirmed
SBC 15 / SBR 17 / PV 5 / TU 6 / WIP 9 / IV 4. **Verdict of the second read: UNCHANGED — nothing moved,
nothing re-derived.**

**Scope of writes:** `update_case` only. **0 add_case · 0 delete_case · 0 section ops · 0 run writes · 0 results logged.**
Every payload carried **all three text fields** (`custom_preconds`, `custom_steps`, `custom_expected`) as
playbook §J normalisation #3 requires, so no omitted field could be re-rendered.

## What each write changed
- **All 32:** Rule-54 sentence 2 re-stamped from `v3.4.1-3d03023` / `8/4/2026` to **`v3.5-16cf83f` / `8/5/2026`** —
  the build actually observed and today's date. Sentence 1 (the documents) was left exactly as it stood.
- **5 of the 32 also had their automation marker corrected** from `AUTOMATION: HOLD - this part of the report is
  not built yet` to `AUTOMATION: READY`, because the feature was proven live to be built:
  **C30191 · C30442 · C30506 · C30592 · C38859**.
- **No expected-result BODY was altered on any case** (Standing Rule 57 — expectations come from the documents,
  and no document moved).

## Per-operation record

| # | Operation | C-id | HTTP | Verification | Marker corrected |
|---|---|---|---|---|---|
| 1 | update_case | [C30162](https://shopview.testrail.io/index.php?/cases/view/30162) | 200 | update_case C30162: 30 fields compared, 3 intended, 0 mismatch | no |
| 2 | update_case | [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) | 200 | update_case C30172: 30 fields compared, 3 intended, 0 mismatch | no |
| 3 | update_case | [C30191](https://shopview.testrail.io/index.php?/cases/view/30191) | 200 | update_case C30191: 30 fields compared, 3 intended, 0 mismatch | YES |
| 4 | update_case | [C30194](https://shopview.testrail.io/index.php?/cases/view/30194) | 200 | update_case C30194: 30 fields compared, 3 intended, 0 mismatch | no |
| 5 | update_case | [C30287](https://shopview.testrail.io/index.php?/cases/view/30287) | 200 | update_case C30287: 30 fields compared, 3 intended, 0 mismatch | no |
| 6 | update_case | [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) | 200 | update_case C30290: 30 fields compared, 3 intended, 0 mismatch | no |
| 7 | update_case | [C30320](https://shopview.testrail.io/index.php?/cases/view/30320) | 200 | update_case C30320: 30 fields compared, 3 intended, 0 mismatch | no |
| 8 | update_case | [C30442](https://shopview.testrail.io/index.php?/cases/view/30442) | 200 | update_case C30442: 30 fields compared, 3 intended, 0 mismatch | YES |
| 9 | update_case | [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) | 200 | update_case C30500: 30 fields compared, 3 intended, 0 mismatch | no |
| 10 | update_case | [C30506](https://shopview.testrail.io/index.php?/cases/view/30506) | 200 | update_case C30506: 30 fields compared, 3 intended, 0 mismatch | YES |
| 11 | update_case | [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | 200 | update_case C30510: 30 fields compared, 3 intended, 0 mismatch | no |
| 12 | update_case | [C30512](https://shopview.testrail.io/index.php?/cases/view/30512) | 200 | update_case C30512: 30 fields compared, 3 intended, 0 mismatch | no |
| 13 | update_case | [C30513](https://shopview.testrail.io/index.php?/cases/view/30513) | 200 | update_case C30513: 30 fields compared, 3 intended, 0 mismatch | no |
| 14 | update_case | [C30514](https://shopview.testrail.io/index.php?/cases/view/30514) | 200 | update_case C30514: 30 fields compared, 3 intended, 0 mismatch | no |
| 15 | update_case | [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | 200 | update_case C30515: 30 fields compared, 3 intended, 0 mismatch | no |
| 16 | update_case | [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | 200 | update_case C30516: 30 fields compared, 3 intended, 0 mismatch | no |
| 17 | update_case | [C30517](https://shopview.testrail.io/index.php?/cases/view/30517) | 200 | update_case C30517: 30 fields compared, 3 intended, 0 mismatch | no |
| 18 | update_case | [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | 200 | update_case C30518: 30 fields compared, 3 intended, 0 mismatch | no |
| 19 | update_case | [C30562](https://shopview.testrail.io/index.php?/cases/view/30562) | 200 | update_case C30562: 30 fields compared, 3 intended, 0 mismatch | no |
| 20 | update_case | [C30564](https://shopview.testrail.io/index.php?/cases/view/30564) | 200 | update_case C30564: 30 fields compared, 3 intended, 0 mismatch | no |
| 21 | update_case | [C30565](https://shopview.testrail.io/index.php?/cases/view/30565) | 200 | update_case C30565: 30 fields compared, 3 intended, 0 mismatch | no |
| 22 | update_case | [C30566](https://shopview.testrail.io/index.php?/cases/view/30566) | 200 | update_case C30566: 30 fields compared, 3 intended, 0 mismatch | no |
| 23 | update_case | [C30589](https://shopview.testrail.io/index.php?/cases/view/30589) | 200 | update_case C30589: 30 fields compared, 3 intended, 0 mismatch | no |
| 24 | update_case | [C30592](https://shopview.testrail.io/index.php?/cases/view/30592) | 200 | update_case C30592: 30 fields compared, 3 intended, 0 mismatch | YES |
| 25 | update_case | [C30593](https://shopview.testrail.io/index.php?/cases/view/30593) | 200 | update_case C30593: 30 fields compared, 3 intended, 0 mismatch | no |
| 26 | update_case | [C30595](https://shopview.testrail.io/index.php?/cases/view/30595) | 200 | update_case C30595: 30 fields compared, 3 intended, 0 mismatch | no |
| 27 | update_case | [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) | 200 | update_case C38859: 30 fields compared, 3 intended, 0 mismatch | YES |
| 28 | update_case | [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) | 200 | update_case C38885: 30 fields compared, 3 intended, 0 mismatch | no |
| 29 | update_case | [C38887](https://shopview.testrail.io/index.php?/cases/view/38887) | 200 | update_case C38887: 30 fields compared, 3 intended, 0 mismatch | no |
| 30 | update_case | [C38918](https://shopview.testrail.io/index.php?/cases/view/38918) | 200 | update_case C38918: 30 fields compared, 3 intended, 0 mismatch | no |
| 31 | update_case | [C43547](https://shopview.testrail.io/index.php?/cases/view/43547) | 200 | update_case C43547: 30 fields compared, 3 intended, 0 mismatch | no |
| 32 | update_case | [C43548](https://shopview.testrail.io/index.php?/cases/view/43548) | 200 | update_case C43548: 30 fields compared, 3 intended, 0 mismatch | no |

**32 operations, every one HTTP 200, 30 fields compared each, 0 mismatches, 0 failures.**
`refs` was not written on any operation, so the declared comma normalisation never came into play.

## Post-write proofs (Standing Rule 50)

- **Written cases:** collateral field changes beyond `custom_expected` = **0**.
- **Foreign cases C38919–C38923** (Vladimir Tomovic): **0 differences on any field, `updated_on` and
  `updated_by` included** — proven untouched, not merely asserted.
- **Run 359:** `include_all` still **false**; **476 tests → 476**; **535 results → 535**; test-id and case-id
  sets **equal in BOTH directions**; **0 prior results missing by id**; **0 non-echo field changes**;
  **0 declared-echo changes**; **0 new results**; counters unchanged at 6 passed / 470 untested.
- **Marker census:** READY 419 → **424** · READY-EXPECT-FAIL 27 → **27** · HOLD 30 → **25** = 476.

## An unexplained change to 14 cases I never wrote — reported, not fixed

Fourteen of our cases differ between the 19:53Z pre-snapshot and the post-write read, and **I did not write
to any of them**: **C30341 · C30392 · C30451 · C30456 · C30457 · C30460 · C30487 · C30490 · C30491 · C30493 ·
C30519 · C30522 · C30526 · C30528**.

On each, all three text fields changed from plain numbered text into raw `<ol>` / `<li>` HTML.
**Their `updated_on` and `updated_by` did NOT move** — every one still reads its earlier 17:40–18:14Z value
with `updated_by=3`, i.e. timestamps from before this pass began at 19:51Z. Confirmed with a direct
`get_case/30341`, which now returns the markup while still reporting `updated_on=1785951654` (17:40:54Z).

**Two consequences, and the second one is the important one:**
1. This project renders markup **literally to the tester**, so those 14 cases now show `<ol>` and `<li>` on screen.
2. **`updated_on` is therefore NOT a reliable proof that a case is untouched.** A stored value changed while the
   timestamp stood still. Standing Rule 50 leans on byte-identical snapshots *including* `updated_on` as the
   evidence that we did not write to something — that proof is weaker than we believed, and this belongs in
   `build/APP-ACTIONS-PLAYBOOK.md` §J. **I did not edit the playbook** (not my path this pass).

I have **not** repaired the 14. That is 42 field writes on cases outside this pass's brief, and it needs the
QA lead's go-ahead.