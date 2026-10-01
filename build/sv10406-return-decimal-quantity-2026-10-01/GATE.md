# SV-10406 — pre-post gate (Standing Rule 72)

Run immediately before posting, 2026-10-01. Two comments were posted at the QA lead's request:
the QA result, and the outstanding work with what needs enabling.

| # | Check | Result |
|---|---|---|
| 1 | Branch build marker re-read live | `v26.39.2-998e506`, last-modified Thu, 01 Oct 2026 04:27:42 GMT, etag `W/"736df3fb526413d198717221673cc027"` — **identical** to the marker every reading was taken on |
| 2 | Ticket state re-read live | **TESTING QA**, priority **Medium**, 2 comments (Chris Ward 23 Sep, parth fadadu 25 Sep) — nothing new, no scope change |
| 3 | Evidence images | four uploaded as **real Jira attachments** (61639–61642); both posted comments re-read in ADF show **2 media each, every one `"type":"file"`**, correct order and aspect, **0 external links** |
| 4 | Figures traceable | every quantity and amount was read back from the application this pass and is recorded in `FINDINGS.md` |
| 5 | Named test data still live | the four branch credit memos and the two production leftovers were read in the final runs |
| 6 | Human voice / no AI fingerprint | both comments scanned — clean |
| 7 | Format | each comment leads with its own heading line; **no "Technical details for developers" section** in either, confirmed absent in the read-back |
| 8 | Read back after posting | **77727** — first text `OVERALL QA STATUS: PASSED`, 13 table rows (4 returns + 7 checks + 2 headers), 2 media · **77728** — first text `STILL TO BE TESTED…`, 2 media |

**Two comments rather than one:** the standing convention is a single complete comment, and the QA
lead asked explicitly for the outstanding work to go in a separate comment. The second is not a
correction of the first — it is the remainder and the environment asks.

**Honesty checks specific to this ticket:** the first comment states that no before-picture exists
because the defect does not reproduce on production, labels the "already shipped" explanation as an
inference from version numbers, and says plainly that correct behaviour on the branch does not by
itself prove the branch carries this change. The second comment asks that question directly.
