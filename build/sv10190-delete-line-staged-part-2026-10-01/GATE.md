# SV-10190 / SV-10737 — pre-post gate (Standing Rule 72)

Run immediately before posting comment **77690** on SV-10190 and before publishing SV-10737's steps,
on 2026-10-01.

| Check | Result |
|---|---|
| Staging build marker re-read live | `v26.39.2-538dd8d`, last-modified Wed 30 Sep 2026 15:50:45 GMT, etag `W/"a7ed1984fe1c2eebda9ebbcf19239b3a"` — unchanged across the whole pass |
| SV-10190 state re-read | TESTING STAGE · High · 1 comment (parth's repro) — nothing new to answer |
| Duplicate search before filing | **Initially gave a FALSE ALL-CLEAR** — `/rest/api/2/search` has been removed by Atlassian and returns an error the wrapper swallowed as "no results". Re-run on `/rest/api/3/search/jql`: nothing exists for this defect; SV-10442 (tooltip wording) is Done and is a different thing |
| **Named test data still live** | **CAUGHT A REAL PROBLEM** — the part on S3-34508 had been received by something else within ~20 minutes of seeding, so the published steps would have failed at step 2. Steps repointed at S3-34509 (verified pristine: `deletable true`, 1 part request, 0 parts) and four spares seeded and listed |
| Evidence work orders still intact | S2-34499 line `f0b11b89` present with 1 staged part; S2-34483 all 9 lines present. (My first gate script reported these missing — it had queried a Heavy Duty work order while the session was pinned to Lethbridge. My bug, not the data's.) |
| Figures traced to this pass | 6 of 6, 3 of 3, 1 of 1 all come from the run logs in `/tmp/qa10190/race3-results.json` and `single-results.json` |
| Evidence images | uploaded as **real Jira attachments** (61609, 61610 on SV-10737; 61611 on SV-10190), verified `type: file` on read-back |
| Human voice / no AI fingerprint | text-node scan clean on both the comment and the ticket description |
| Format | verdict is the first line; no "Technical details for developers" section (Standing Rule 84 — not approved for this ticket) |
| New ticket shape | SV-10737 · Bug · **Medium** · Product Area Work Orders · **no parent**, matching parentless SV-10190 (Standing Rule 52) · linked *Relates* to SV-10190 |
| Read back after posting | comment 77690: verdict first line, 1 media `type: file`, 9-row table, SV-10737 linked. SV-10737: 2 media `type: file`, names S3-34509 and no longer S3-34508 |
| Transition | SV-10190 moved TESTING STAGE → **Ready for Production** (the only "fixed" transition offered; the others were Blocked, Close→OBSOLETE, Rejected from Testing) |

**Two things this gate caught that would have reached the reader:** the stale reproduction data, and the
silently-broken duplicate search.
