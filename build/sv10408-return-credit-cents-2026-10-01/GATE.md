# SV-10408 — pre-post gate (Standing Rule 72)

Run immediately before posting the QA comment, 2026-10-01.

| # | Check | Result |
|---|---|---|
| 1 | Branch build marker re-read live | `v26.39.2-998e506`, last-modified Thu, 01 Oct 2026 04:27:42 GMT, etag `W/"736df3fb526413d198717221673cc027"` — **identical** to the marker every reading was taken on, so no redeploy happened under the testing |
| 2 | Ticket state re-read live | **TESTING QA**, priority **Medium**, 1 comment (parth fadadu, 25 Sep) — nothing new, no scope change |
| 3 | Evidence images | uploaded as **real Jira attachments** (61631, 61632); the posted comment re-read in ADF shows **2 media, both `"type":"file"`**, correct order and aspect, **0 external links** |
| 4 | Figures traceable | every amount in the comment was read back from the application this pass and is recorded in `FINDINGS.md` |
| 5 | Named test data still live | the two branch credit memos and the production leftover were re-read in the final runs |
| 6 | Human voice / no AI fingerprint | flattened comment scanned — clean |
| 7 | Format | first line is the verdict in a success panel; **no "Technical details for developers" section** (declined for this ticket), confirmed absent in the read-back |
| 8 | Read back after posting | comment **77716**: first text node `OVERALL QA STATUS: PASSED`, **9 table rows** (1 header + 8 checks), 2 media as sent, build marker present |

**Honesty check specific to this ticket:** the comment states plainly that no before-picture exists
because the defect does not reproduce on production, and labels the "already shipped to production"
explanation as an inference from the version numbers rather than something verified.

**Production state recorded:** unconfirmed test return cancelled and confirmed gone; the posted
credit `ZZAUTOTEST-CM-10408-P1` remains and is named in the comment.
