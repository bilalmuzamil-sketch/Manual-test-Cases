# Invoice UI Refresh — new case: Customer edit → Bill To hides empty fields (2026-09-08)

**QA lead request (2026-09-08):** create a Customer-Edit case mirroring the Location-Edit case
(test 2724070 = **C44907** "Masthead identity fields each hide when empty", story SV-9140 / S1-N1),
but for the customer side, and add it to the suite's run.

## Case created: [C53480](https://shopview.testrail.io/index.php?/cases/view/53480)
- **Title:** "Customer edit: Bill To address fields hide when emptied; name always shows"
- **Section:** Addresses (6742) · **refs:** SV-9141 (S2-N1) · **created_by 3** · **atmstatus 1** ·
  **automation_type 2 (Functional)** · **AUTOMATION: READY**
- **Belongs to the Addresses story** (SV-9141), not the Masthead story of the location case — per the
  QA lead's note ("it belongs to the Addresses story rather than this one").
- **Expected sourced from the document (Rule 57):** S2-R1 (Bill To shows name, street address, city,
  state/province, postal code) + S2-N1 (each address field hidden when empty; name line always shows),
  live spec Confluence 755990532 **v64**, read 2026-09-08. Phone and country are on the customer record
  but NOT part of the Bill To block, so the case does not check them on the document.
- **Concrete data (QA lead's live example):** customer "4 Star Truck Repair"
  (app.staging.shopview.com/customers/6a7b6afc-084d-4584-aacb-773bcd71cbcd/work-orders), all address
  fields empty; its Bill To on invoice INV-S2-31594
  (app.staging.shopview.com/workorders/0fc91f4d-86f0-4e98-af2e-5a6177eec850/finance) shows the name
  alone. Route + edit-then-clear steps mirror C44907.
- **No "Last checked against build" line:** the behaviour is confirmed by the QA lead's live staging
  observation + the doc + sibling C44912, but WE have not build-verified this new case, so sentence 2
  is omitted (Rule 12). The suite's build-verify session / tester (Mudassir) records the run result.

## Verification
- Runnable gate `check_runnable_cases.py --cases 53480` → RUNNABLE 1/1.
- `check_case_render.py` clean; served-page scan: all 3 fields `markdown fr-view`, marker last.
- atm/type/section/refs confirmed live.

## Run
- **R417 union-synced 120 → 121** (union-only, Rule 34): C53480 added, all prior tests kept, 0 dropped.

## Notes
- Suite is actively being worked today by another session (C44907 re-stamped to spec v64 / build
  v26.35.6→v26.35.9-9812433 on 2026-09-08). This pass touched ONLY the one new case + the union run
  sync — no existing case edited (no collision).
