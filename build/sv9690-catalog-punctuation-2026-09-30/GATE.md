# SV-9690 — pre-post gate (Standing Rule 72)

Run immediately before posting comment **77686** on 2026-09-30.

| Check | Result |
|---|---|
| Branch build marker re-read live | `v26.39.1-99a393c`, last-modified Mon 28 Sep 2026 13:48:01 GMT, etag `W/"240dcba03e23b564f25abe61db06a4a1"` — identical to the start of the pass, no redeploy under us |
| Ticket state re-read | TESTING QA · priority Medium · 5 comments, latest still Stefan Vukovic's handoff (28 Sep) — nothing new to answer |
| Named test data still live on the branch | all four invoices present (SV9690-A-001, CA63QE6D28EUI, SV9690-B-002, SV9690-C-003) at both locations |
| Figures traced to this pass | every number in the comment comes from the tables in FINDINGS.md §3/§5, measured today |
| Evidence images | uploaded as **real Jira attachments** (61595–61598), not external links (Standing Rule 81) |
| Human voice / no AI fingerprint | text-node scan clean |
| Format | verdict is the first line; no "Technical details for developers" section (Standing Rule 84 — the QA lead declined one for this ticket) |
| Read back after posting | 4 media nodes, all `type: file`, correct order and `width=900` with per-image height; tables 5 and 7 rows; first line is the verdict |

Production was restored before posting: delivery line part number, quantity, price and description
each re-read and compared against the pre-change snapshot — all four match.
