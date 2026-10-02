# Pre-post bite-proof gate — SV-10406 follow-up (Standing Rule 72)

Run 2 October 2026, immediately before preparing the Jira comment.

| # | Check | Result |
|---|---|---|
| 1 | **Build marker re-read live** | `v26.40.3-e9ae339`, last-modified Fri, 02 Oct 2026 09:34:01 GMT, etag `2d055567fe4d618b8d86fc29d52a3f31` — **identical to the start-of-pass read, `index.html` sha256 `3d6dedfab1ad6c40…` byte-identical**, so nothing redeployed under the run |
| 2 | **The branch moved since the last pass** | yes — `v26.39.2-998e506` → `v26.40.3-e9ae339`. The earlier verdicts were therefore **re-run from scratch**, not carried forward. `sv10406.qa.shopview.com` does not resolve; `sv10408` is the branch, confirmed by the QA lead |
| 3 | **Ticket re-read live** | SV-10406 — Bug, Medium, **TESTING QA**, 5 comments, latest Stefan Mitrovic 77785 (2 Oct 07:13) enabling the flag. Nothing newer |
| 4 | **Every figure traces to a live measurement this pass** | the six stored returns, the vendor credit C-13673, journal entry #4390 and both of its lines, the event counts (1 vendor_credit_created vs 9,672 vendor_bill_created), the 16,636 backfilled records and the three `change-item` request ids were all read from the running build in this run |
| 5 | **Named test data confirmed live** | all eight ZZAUTOTEST credit memos read back from `GET /api/inventory/returns`; the three probe items read back from the return detail |
| 6 | **A wrong conclusion caught before it was written** | mid-pass AccountingHub showed zero vendor credits and I was close to reporting that returns never post. The backfill was still running; the event appeared ~9 minutes later. The observation was only taken once onboarding reported `completed` (Standing Rules 75/93) |
| 7 | **Side observations bucketed** | three observations, each labelled — one UNVERIFIED cause (1 of 8 posting), one not-filed out-of-scope defect (go-live button), one explained-not-a-defect (over-quantity warning). Jira searched first; SV-10370 and SV-10374 cited rather than re-raised |
| 8 | **Exhibit** | 1, annotated on the pixels at coordinates read from the live DOM in the same page state as each screenshot, both halves labelled with environment, build and date; a clipped caption from the first build was fixed |
| 9 | **Human voice / no AI fingerprint** | reader-facing text scanned — no model name, no AI self-reference, no attribution footer |
| 10 | **Format** | verdict is the first line; **no "Technical details for developers" section** — not asked for on this ticket (Standing Rule 84). The two API routes and the request ids appear in the body because they are the answer to a question the developer asked for |
| 11 | **Mentions** | account ids read off the issue (`fields=reporter,assignee`), never hand-written — the lesson from this morning's `@unknown` |
| 12 | **Environment** | books taken live deliberately and recorded; three probe items left on a ZZAUTOTEST credit and named; location tax unchanged (both attempts failed, still GST) |

Outcome: clear.
