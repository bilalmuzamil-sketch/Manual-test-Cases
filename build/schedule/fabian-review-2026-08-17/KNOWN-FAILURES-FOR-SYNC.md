# KNOWN FAILURES / OBSERVATIONS to re-establish at the build-verify sync — 2026-08-17

This pass **deferred build verification** (Rule 69) and set the
`AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026` marker on all touched cases.
In doing so it **removed the pre-v30 build-observation / expect-fail / three-outcome paragraphs** that
several cases carried, because they were observed against a **superseded build (v3.5-65d6500, 12 Aug)**
and against **v27 expectations** (the content is now v30). **The knowledge is preserved here so the
later build-verify sync re-checks each against the live build and, where still valid, re-adds the
symptom + three-outcome block (Rule 61) with the right marker.**

**No ticket was created or closed this pass (Jira creation hold active). Nothing below is asserted as a
current build fact — each is a *previously observed* item to re-verify.**

| Case | Previously carried | Ticket | Re-check at the sync |
|---|---|---|---|
| **SCH-SPREAD-08 = [C29984](https://shopview.testrail.io/index.php?/cases/view/29984)** | `READY - EXPECT FAIL (SV-9006)` — skipped days not struck through / not listed in the spread preview breakdown | **SV-9006** (was Open) | Still a v30 requirement (*"skipped days struck through"*). If the fault persists → `READY - EXPECT FAIL (SV-9006)` with the symptom + 3 outcomes; if fixed → `READY`. |
| **SCH-SPREAD-04 = [C29980](https://shopview.testrail.io/index.php?/cases/view/29980)** | a note that the finish-by date arrows now work (older report SV-9005 said they did not) | **SV-9005** (reported fixed) | Confirm the derive-fields behaviour on the build; if it works → `READY`; if the arrows do nothing again → re-open the discussion. |
| **SCH-DAY-04 = [C30004](https://shopview.testrail.io/index.php?/cases/view/30004)** | `HOLD` — after a horizontal move, **no toast with Undo appeared** (observed on the build, **no ticket number**) | none (needs the QA lead's go-ahead to file, hold active) | Re-check whether the move toast appears; if the fault persists it is a filing candidate (creation hold); if fixed → `READY`. |
| **SCH-START-07 = [C29975](https://shopview.testrail.io/index.php?/cases/view/29975)** | `HOLD` — "there is no Unassigned row in the grid" (old design) | none | v30 model = the department header row IS the unassigned lane. Re-check whether the dept-lane + chip + assign path is built; set marker accordingly. |
| **SCH-PANEL-01…06 = C43582–C43587** | `HOLD` — "the panel button does not exist in this build" (observed 12 Aug) | none | v30 §5.3 requires the collapse toggle (story SV-9243). Re-check whether it shipped; if present and working → `READY`; if absent → the observation is filable (creation hold). **Per core §15.1, an observable absence is NOT a genuine HOLD — after the sync these should be `READY` (tester runs and fails) unless a live ticket backs an expect-fail.** |

**Also for the sync (out of this pass's scope but noted):**
- **SCH-EDGE-05 / SCH-SPREAD-07** — the shop-closures question is **resolved by spec v30** (weekends
  only skipped), so their old `HOLD - waiting on PO` is gone; the sync just build-verifies "closures
  receive shifts".
- **SCH-WOL-04** — the old SV-8841 note (shop-prefixed WO-number search returns nothing) was removed as
  a build observation; re-check at the sync.
