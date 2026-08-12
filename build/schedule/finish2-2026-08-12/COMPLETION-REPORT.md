# Schedule — completion report, 2026-08-12 (finish2 pass)

**Every figure below was derived LIVE from TestRail and the running build, not from notes.**
Case state, markers and the gate all read at **2026-08-12T08:24:22Z**, after the last write.
Build marker read at **07:11:17Z**.

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag `3250d285ffcf50626363a578fe273071` ·
`index.html` sha256 `9348ca09d6167375dc52bfc29bf3b9f8c4163dede2ea5ea62269b186c9cc5f6f`.
**Unmoved since 11 August.**

## The table

| | |
|---|---|
| **Cases — ours / live** | **176 / 176.** Every case under group 4254 has `created_by = 3`; **there are no foreign cases in this group** |
| **Source-verified** | **176 / 176** (established by the previous passes; not re-derived here) |
| **Build line naming the RUNNING build** | **118 of 176** — up from 76. The other **58**: 36 name `v3.5-7ec992f`, 21 name `v3.5-d122eef`, and 1 ([C43589](https://shopview.testrail.io/index.php?/cases/view/43589)) names none, correctly, because it has never been checked against any build |
| **Preconditions and steps ACTUALLY WALKED** | **96 of 176** — **63 this pass**, of which **62 were new**. This is the smaller, honest number and it is never added to the label-check figure |
| — of which walked **this** pass | **63** fully · **11** partly, each with the reason stated |
| **Runnable vs held** | **144 runnable · 32 held** |
| **The gate** | `READY` **140** + `READY - EXPECT FAIL` **4** = **144**, and **176 − 32 HOLD = 144**. **It closes both ways.** Read back from the live cases, not computed from these notes |
| **Cases created** | **0** |
| **Cases updated** | **44 distinct** (46 operations — one case written twice by a resume, and repaired) |
| **Cases deleted** | **0** |
| **Jira issues created** | **0** — the creation hold is active |
| **Run 357** | **untouched, proven by content**: 176 tests, **529 results all present by id**, sets equal both directions, **0 graded and 0 echo field changes** |
| **Hygiene** (re-read live at the end) | 0 raw markup · 0 doubled markers · 0 doubled provenance lines · 0 titles over 80 characters · `refs` on 176/176 |

## What is left, itemised, with what each item waits on

**80 cases have never been walked by anybody.** Of those, **25 already carry `AUTOMATION: HOLD`** with
a stated blocker, so **55 are the real remaining work**.

| Area | Cases | What it waits on |
|---|---|---|
| **Drag-and-Drop Scheduling** | 8 | **a drag our tooling cannot perform.** The click-to-arm alternative was removed from the build between `v3.5-be42149` and `v3.5-7ec992f` ([SV-8957](https://shopview.atlassian.net/browse/SV-8957)), so there is no keyboard or click route left. **Needs a human, or the fix** |
| **Multi-Day Spread Scheduling** | 8 | the spread step is only reachable **through a drag-create**. Same blocker |
| **Scope Picker** | 4 | same — the picker only opens during a drag-create |
| **Shift Start Times and Unassigned Shifts** | 7 | mostly reachable by **seeding shifts through the API** rather than dragging. **Nothing blocks this but worker time** |
| **Deletion, Series Scopes and Undo** | 6 | **worker time, carefully.** `button_shift_detail_delete` destroys a non-series shift on the first click with no confirmation — two workers have lost a shift to it. Seed a throwaway shift and delete that |
| **Edge Cases and Responsiveness** | 3 | worker time |
| **Events** | 4 | **worker time plus one seeded event.** Creating a `ZZAUTOTEST` event unblocks the create/preview/colour cases together |
| **Reassignment and Context Menu** | 2 | the two remaining need a **drag**; the cell menu itself is proven to open and both its items work |
| **Conflict Detection** | 1 | [C30024](https://shopview.testrail.io/index.php?/cases/view/30024) — needs a shift **seeded onto a non-working day**. The build reports double-booking and business-hours reasons; no working-day reason appears in this range, which is not evidence the rule is missing |
| **Working Hours Settings** | 3 | **a Save on a staff record** — which invalidates that user's session. Needs a throwaway staff member, or your say-so |
| **Colour System** | 2 | worker time; choosing a colour is a write |
| **Permissions** | 2 | **the three configured users** — item 2 of the outstanding list |
| **API — Schedule** | 1 | [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) — **its precondition cannot be met on this estate**: location B has no technicians at all, and its work order details return 404, so no shift can be created there to test cross-location scoping with. [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) is now **done** |
| **Capacity Bars · Day View · Keyboard · Cross-Module** | 4 | worker time. The Sidebar-filters one is now done — see `AUTOMATED-CASES-CHANGED.md` |

**And two decisions are waiting on you**, both in `FINDINGS.md`: **permission to raise the two Story
Defects** (C29929, C30050), and **the three permission users**.

## The honest limits of this report

- **96 of 176 walked is not 176 of 176**, and no sentence here should be read as saying the suite is
  finished. **80 cases have never been walked**, and they are itemised above rather than summarised.
- **Only 118 of 176 build lines name the running build.** The other 58 carry their own honest earlier
  build marker, which under Standing Rule 60 is the record, not a defect.
- **The branch has not been declared final**, so **every verdict here is PROVISIONAL** (Standing Rule
  49). The Rule-49 queue for this project stays **OPEN**.
- **Source currency was not re-derived this pass.** The specification was last established at
  **Confluence v27** by the 11 August pass and has not been re-fetched today; if it has moved, the
  provenance lines on all 176 cases name a superseded version.
