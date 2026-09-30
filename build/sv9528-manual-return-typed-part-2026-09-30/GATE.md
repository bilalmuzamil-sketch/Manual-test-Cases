# SV-9528 — pre-post gate (Standing Rule 72)

Run immediately before posting comment **77687** on 2026-09-30.

| Check | Result |
|---|---|
| Branch build marker re-read live | `v26.39.2-0ab2729`, last-modified Wed 30 Sep 2026 09:30:34 GMT, etag `W/"a27b3ebad515836944b5bd6ffeb47a3b"` — identical to the start of the pass, no redeploy under us |
| Ticket state re-read | TESTING QA · priority Medium · 2 comments, latest still Stefan Vukovic's handoff (30 Sep 04:32) — nothing new to answer |
| Named test data still live on the branch | return `SV9528-QA-01` present · return `F40010212` present · credit memo `SV9528-CM-01` present |
| Figures traced to this pass | every number in the comment comes from the tables in FINDINGS.md §3/§5, measured today |
| Evidence images | uploaded as **real Jira attachments** (61599–61602), not external links (Standing Rule 81) |
| Human voice / no AI fingerprint | text-node scan clean |
| Format | verdict is the first line; no "Technical details for developers" section (Standing Rule 84 — the QA lead declined one for this ticket) |
| Scope divergence disclosed | yes — the comment states plainly that the dropdown stays inventory-only, and cites Chris Ward's 26 Aug ruling and spec SV-2315 (Standing Rules 56/78) |
| Read back after posting | 4 media nodes, all `type: file`, correct order and `width=900` with per-image height; 7-row table; first line is the verdict |

Nothing was saved on production, so there was nothing to restore.
