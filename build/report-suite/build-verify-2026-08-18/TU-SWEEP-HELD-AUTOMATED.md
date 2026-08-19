# TU RE-VERIFY SWEEP — Automated cases HELD (2026-08-19)

**Rule 71: never change/delete a case TestRail flags as Automated (`custom_atmstatus = 3`) without asking
the QA lead first — INCLUDING our own cases.** These were verified present live on **v3.8-d0e135e** but
**NOT written** (no marker/provenance/text change). Re-GET confirms every one still `atm=3`, `created_by=3`.

**Live `custom_atmstatus` re-read is authoritative — the 8/18 doc recorded 8; the live count is 9.**
C38915 (TU-LOC-06) was written 8/18 as EXPECT-FAIL→READY and has since been **re-flagged Automated** by
Vladimir Tomovic's automation, so it is now HELD.

| C-id | internal (from 8/18 records) | atm live |
|---|---|---|
| C30398 | TU-* (Automated) | 3 |
| C30399 | TU-* (Automated) | 3 |
| C30401 | TU-* (Automated) | 3 |
| C30404 | TU-* (Automated) | 3 |
| C30410 | TU-* (Automated) | 3 |
| C30424 | TU-* (Automated) | 3 |
| C30429 | TU-LINK (Automated; asserts the Total Hours link) | 3 |
| C30449 | TU-* (Automated) | 3 |
| C38915 | TU-LOC-06 (Location column 2nd; re-flagged Automated since 8/18) | 3 |

**Intended change put to the QA lead for ask-first ratification (Rule 71, coupled build-verify hand-off):**
- **C30429** asserts the Total Hours link works — the link feature is **still absent** on v3.8-d0e135e, so
  when ratified it should move to the deferred `Not available on Build to test Yet` treatment (like
  C30428/30430/30432/30433), not READY.
- The other 8 need only a live re-confirm + build-stamp refresh, which is done in the coupled build-verify
  pass once ratified (then handed to Vlad via `AUTOMATED-CASES-REGISTER.md`).

**0 writes to any of these 9. Foreign C38919 (Vladimir Tomovic id 1) also untouched (Rule 38).**
