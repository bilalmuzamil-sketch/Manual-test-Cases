# Pre-post bite-proof gate — SV-9568 (Standing Rule 72)

Run 1 October 2026, immediately before preparing the Jira comment.

| # | Check | Result |
|---|---|---|
| 1 | **Build marker re-read live** on the fix branch | `v26.40.2-fbe37e3`, last-modified Thu, 01 Oct 2026 12:59:08 GMT, etag `W/"82c7c00d7336b9e2fb51ce2f2acb7b6a"` — **identical to the reading taken at the start of the pass**, so the branch did not redeploy under the run |
| 2 | **Production build marker recorded** for the BEFORE half | `v26.40.2-95f3172`, last-modified Thu, 01 Oct 2026 12:47:08 GMT |
| 3 | **Ticket re-read live** | SV-9568 still **TESTING QA**, priority **Medium**, 2 comments, the latest still Stefan Vukovic's handoff (77717, 08:00:13) — no new comment since testing began, nothing has changed scope |
| 4 | **Every figure traces to a live measurement this pass** | header counts (14 / 11 / 8 / 7), preference-write counts (3 on branch, 0 on production), the stored preference bodies, and the cycle-count header list were all read from the running build in this run |
| 5 | **Named test data confirmed live** | the second user (Krystal Davis) was impersonated successfully this pass; the Administrator role id `73f72525-…` was edited and restored this pass |
| 6 | **Permission restored** | `GET /api/auth/me/fe-permissions` confirms `seeFinancialData` is present again after the restore |
| 7 | **Exhibits** | 4 built, all annotated on the pixels at coordinates measured from the live DOM (`thead th` and `.q-menu` rects), each labelled with environment + build marker + date |
| 8 | **Human voice / no AI fingerprint** | reader-facing text scanned — no model name, no AI self-reference, no attribution footer |
| 9 | **Format** | verdict is the first line; no "Technical details for developers" section unless the QA lead approves one for this ticket (Standing Rule 84) |

Outcome: clear. Nothing was found that changes the verdict.

---

## Post and read-back (Standing Rules 72 / 81)

Comment **77741** posted to SV-9568 on 1 October 2026, then re-fetched from Jira in ADF and checked
as the reader receives it — not as the source serves it:

| Check | Result |
|---|---|
| First line | `OVERALL QA STATUS: PASSED` |
| Media count and order | 4, in the intended order |
| Media type | all four are `{"type":"file"}` — real Jira attachments (ids 61646–61649), not external links |
| Media dimensions | 900×583, 900×852, 900×583, 900×529 — as sent, correct aspect |
| Checks table | 18 rows = 1 header + **17** checks, matching the "all 17 checks passed" claim in the opening line |
| Human voice | fingerprint scan over the reader-facing text nodes — clean |
| Technical details section | **absent**, as the QA lead directed for this ticket (Standing Rule 84) |
