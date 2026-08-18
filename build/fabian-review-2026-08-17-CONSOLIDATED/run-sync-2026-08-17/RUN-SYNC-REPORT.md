# RUN-SYNC REPORT — Fabian design-review cases → active execution runs (2026-08-17 authorised)

**Authorisation:** the QA lead explicitly authorised syncing the three active-project execution runs
(357 Schedule · 359 Report Suite · 352 Filters) to include the new Fabian-review cases. These runs
belong to other testers; per-ask authorisation granted, executed 2026-08-18.

**Protocol:** union-only (Common-core §4.1 / Standing Rule 34). `update_run` REPLACES the selection,
so a partial `case_ids` list DELETES omitted tests and their results — every write sent the FULL
union (`sorted(set(current) | set(new))`). Each run: snapshot BEFORE (committed), compute union
(proven superset of current, added set == exactly the new ids), `update_run` with the full union,
verify AFTER (case_id sets equal both ways, every prior result present BY ID, 0 graded field changed,
include_all still false). Runs done ONE AT A TIME. No results written (no `add_result`). No case
modified. No foreign case touched. `include_all` never changed from false.

Run's own status-count (`get_run`) was asserted equal to the `get_tests` count BEFORE building each
union, to guard against a silent empty-page paginator turning the union into a partial list
(Common-core §3.3 / §4.1). Paginator used `&` separator unconditionally (base URL already carries
`index.php?`).

Snapshots committed alongside this report: `<run>-before.json` / `<run>-after.json` (TestRail case/
result metadata only; graded result fields; secret-scanned — no cookies/tokens/authorization).

---

## Run 357 — Schedule ("Schedule - Ayesha", Ayesha Khan)  ✅ PASS

| | Before | After |
|---|---|---|
| include_all | false | **false** (unchanged) |
| Tests (case_ids) | **176** | **195** |
| Result records | **549** | **549** |
| Status split | 90 P / 11 F / 7 B / 68 U | (unchanged graded results) |

- **New cases added: 19** — C43795–C43813 (all verified live, all `created_by`=3 ours, none already
  present). Union = 176 ∪ 19 = **195**.
- **0 prior tests dropped** — union proven superset of current (current − union = ∅).
- **added set == exactly the 19 new ids** (union − current == the 19).
- **0 prior results lost** — all 549 result records present BY ID after the write (both directions).
- **0 graded field changed** — `status_id/comment/defects/elapsed/version/assignedto_id/created_by/
  created_on/test_id/case_id/id` byte-identical for every prior result.
- case_id sets equal BOTH ways (after == union, 195/195).
- **VERDICT: PASS — 0 dropped, 0 results lost.**

---

## Run 359 — Report Suite ("Reports Suite - Nebojsa & Viktoria (Partially VIU'd)", Nebojsa Glavinic / Viktoria Videnovic)  ✅ PASS

| | Before | After |
|---|---|---|
| include_all | false | **false** (unchanged) |
| Tests (case_ids) | **480** | **507** |
| Result records | **535** | **535** |

- **New cases added: 27** — C43814–C43840 (Adjustments money column batch of 18: C43814–C43831,
  plus the CSV-export/visual batch of 9: C43832–C43840). All verified live, all `created_by`=3 ours,
  none already present. Union = 480 ∪ 27 = **507**.
- **0 prior tests dropped** — union proven superset of current (current − union = ∅).
- **added set == exactly the 27 new ids** (union − current == the 27).
- **0 prior results lost** — all 535 result records present BY ID after the write (both directions).
- **0 graded field changed** — every prior result byte-identical on graded fields.
- case_id sets equal BOTH ways (after == union, 507/507).
- **VERDICT: PASS — 0 dropped, 0 results lost.**

---

## Run 352 — Filters ("Filters - Ahtasham", Ahtasham Amjad)  ✅ PASS

| | Before | After |
|---|---|---|
| include_all | false | **false** (unchanged) |
| Tests (case_ids) | **120** | **129** |
| Result records | **648** | **648** |

- **New cases added: 9** — C43841–C43849. All verified live, all `created_by`=3 ours, none already
  present. Union = 120 ∪ 9 = **129**.
- **0 prior tests dropped** — union proven superset of current (current − union = ∅).
- **added set == exactly the 9 new ids** (union − current == the 9).
- **0 prior results lost** — all 648 result records present BY ID after the write (both directions).
- **0 graded field changed** — every prior result byte-identical on graded fields.
- case_id sets equal BOTH ways (after == union, 129/129).
- **VERDICT: PASS — 0 dropped, 0 results lost.**

---

## SUMMARY — all three runs PASS

| Run | Project | Tester | Before | After | New added | Dropped | Results before→after | Results lost | include_all | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| 357 | Schedule | Ayesha Khan | 176 | 195 | 19 (C43795–C43813) | 0 | 549 → 549 | 0 | false (unchanged) | ✅ PASS |
| 359 | Report Suite | Nebojsa / Viktoria | 480 | 507 | 27 (C43814–C43840) | 0 | 535 → 535 | 0 | false (unchanged) | ✅ PASS |
| 352 | Filters | Ahtasham Amjad | 120 | 129 | 9 (C43841–C43849) | 0 | 648 → 648 | 0 | false (unchanged) | ✅ PASS |

**Total new cases synced into runs: 55.** No results written (0 `add_result`). No case modified. No
foreign case touched. `include_all` remained false on all three. Every prior result verified present
BY ID both directions; 0 graded fields changed on any run. Snapshots secret-scanned before commit —
no cookies/tokens/authorization headers/token-bearing bodies written to disk.
