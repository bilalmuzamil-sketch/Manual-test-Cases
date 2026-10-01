# SV-10586 — pre-post gate (Standing Rule 72)

Run immediately before posting the QA comment, 2026-10-01.

| # | Check | Result |
|---|---|---|
| 1 | Branch build marker re-read live | **CAUGHT A REAL ERROR — MINE.** The findings draft carried `v26.39.2-ad6deec`, which is the **SV-8552** branch's build, copied across. The sv10586 branch is `v26.39.2-f170641`, last-modified Thu, 01 Oct 2026 07:04:50 GMT, etag `W/"11ad9e15e2e152756b40a609b3249f89"`. Corrected in `FINDINGS.md` and the exhibits before anything was posted, and the correction is recorded in the document rather than silently fixed. |
| 1b | Was the branch stable during testing? | **Yes.** `last-modified` is 07:04:50 GMT and the QA env was announced as created at 07:08 GMT (comment 77697); every reading was taken after that, and the marker read identically at the end of the pass. No redeploy happened under the testing. |
| 2 | Ticket state re-read live | **TESTING QA**, priority **Medium**, 2 comments, newest 77697 ("QA env has been created") — no scope change |
| 3 | Evidence images | uploaded as **real Jira attachments** (61628–61630); the posted comment re-read in ADF shows **3 media, every one `"type":"file"`**, correct order and aspect, **0 external links** |
| 4 | Figures traceable | every number in the comment comes from a measurement in `FINDINGS.md` taken this pass |
| 5 | Named test data still live | the branch's saved view and the four linked roles were read in the final capture run |
| 6 | Human voice / no AI fingerprint | flattened comment scanned — clean |
| 7 | Format | first line is the verdict in a success panel; **no "Technical details for developers" section** (declined for this ticket), confirmed absent in the read-back |
| 8 | Read back after posting | comment **77709**: first text node `OVERALL QA STATUS: PASSED`, **23 table rows** (1+17 checks, 1+4 roles), 3 media as sent, correct build marker present and the stale one absent |

**Production restore verified separately:** the saved Staff view is back to Sales Representative /
All locations / All departments, confirmed after leaving Staff and returning from the menu.
