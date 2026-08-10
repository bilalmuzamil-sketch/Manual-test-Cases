# TestRail execution log — three handed-off reports, 2026-08-10

**Authorisation:** `update_case` on our own cases. **Not authorised and not used:** `add_case`,
`delete_case`, section operations, run writes, results.

**Build during the whole window:** `v3.5-4795eee`, etag `a80113cf3856c5fedf63be893e8b41c7` — read at
start, mid and end, body byte-identical each time.

## Operations — 5 writes, all verified

Every write went through `update_case_verified`: full pre-write snapshot → write → re-GET →
**every field compared against the intended payload**, with every field not intended to change proven
byte-identical (Rule 50). `refs` compared under the declared comma normalisation.

**All three text fields (`custom_preconds`, `custom_steps`, `custom_expected`) were sent explicitly on
every payload**, per DECLARED NORMALISATION #3 — an omitted text field can be silently re-rendered
through TestRail's HTML pipeline, which these projects show literally to the tester.

| # | Case | C-id | HTTP | Verification |
|---|---|---|---|---|
| 1 | SBC-LOC-04 | C38912 | 200 | 30 fields compared, 5 intended, **0 mismatch** |
| 2 | WIP-COL-02 | C30467 | 200 | 30 fields compared, 5 intended, **0 mismatch** |
| 3 | WIP-PERS-05 | C43551 | 200 | 30 fields compared, 5 intended, **0 mismatch** |
| 4 | TU-LOC-06 | C38915 | 200 | 30 fields compared, 5 intended, **0 mismatch** |
| 5 | WIP-FLT-09 | C38916 | 200 | 30 fields compared, 5 intended, **0 mismatch** |

**Pre-send shape checks** (a byte-check proves fidelity to the payload, not that the payload was
right): marker present exactly once · marker is the last line · title ≤ 80 characters · the `---`
provenance separator present · no HTML markup introduced. All 5 passed before sending.

## Proofs after the writes

- **The other 220 cases of the 225: byte-identical, including `updated_on` and `updated_by`.** 0 with
  any field different.
- **Run 359 untouched, proven by content, not by timestamp** — 476 tests, `case_id` sets equal in both
  directions; **535 result records before and after, every one present BY ID, 0 with any graded field
  changed, 0 new**. `include_all` still false. Graded fields compared: `status_id`, `comment`,
  `defects`, `elapsed`, `version`, `assignedto_id`, `created_by`, `created_on`, `test_id`, `id`.
  `case_title` and `case_refs` treated as read-time echoes per the playbook's declared normalisations.
- **Marker census reconciles exactly**: READY 150→**149**, EXPECT-FAIL 52→**53**, HOLD 23→**23**,
  total **225** — the single move is C38916, which was marked ready while asserting something the
  build fails.
- **Foreign cases:** none of the 225 is foreign (all `created_by = 3`). The 9 cases by Vladimir
  Tomovic elsewhere under group 4281 were not read, not counted and not touched.
