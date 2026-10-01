# SV-8552 — pre-post gate (Standing Rule 72)

Run immediately before posting the QA comment, 2026-10-01.

| # | Check | Result |
|---|---|---|
| 1 | Branch build marker re-read live | `v26.39.2-ad6deec`, last-modified Thu, 01 Oct 2026 06:33:58 GMT, etag `W/"8e105b535998a74a7df91420a0171400"` — **identical** to the marker the findings were taken on |
| 2 | Ticket state re-read live | **TESTING QA**, priority **Medium**; newest comment 77694 (Dipesh Changawala, 01:39) read — it hands the branch over and changes no scope |
| 3 | Evidence images | uploaded as **real Jira attachments** (61617–61621), then the posted comment re-read in ADF: **5 media, every one `"type":"file"`**, correct order and aspect, **0 external links** |
| 4 | Figures traceable | every number in the comment comes from a measurement in `RESULTS.md` taken this pass |
| 5 | Named test data still live | the three `ZZAUTOTEST SV8552` events on Thursday 1 October, and both locations' hours, confirmed in the final run |
| 6 | Human voice / no AI fingerprint | flattened comment scanned — clean |
| 7 | Format | first line is the verdict in a success panel; **no "Technical details for developers" section** (the QA lead declined one for this ticket); no ticket created or edited, so the priority rule does not apply |
| 8 | Read back after posting | comment **77703**: first text node `OVERALL QA STATUS: PASSED`, **29 table rows** = 1 header + 28 checks, media count and order as sent |

**Production restore verified separately:** business hours read back as `ranges: null`, identical to
what was there before the BEFORE capture.
