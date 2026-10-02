# Pre-post bite-proof gate — SV-10086 (Standing Rule 72)

Run 2 October 2026, immediately before preparing the Jira comment.

| # | Check | Result |
|---|---|---|
| 1 | **Build marker re-read live** | `v26.40.3-36ebbb0`, last-modified Fri, 02 Oct 2026 08:14:25 GMT, etag `W/"93d2b678509110cd4613a81d515af033"` |
| 2 | **Did the build move during the pass?** | **YES — and it is disclosed.** Staging started the pass on `v26.40.2-d1bd078` (Thu 01 Oct 13:34:57) and redeployed at 08:14:25 to `v26.40.3-36ebbb0`. The verdict is stated against `v26.40.3-36ebbb0` only, and the one measurement taken before the deploy is labelled as such (Standing Rule 59) |
| 3 | **Decisive measurement taken with the marker proven stable** | run 4 read the marker immediately before and after the go-live — **byte-identical**, so nothing redeployed under that measurement |
| 4 | **Ticket re-read live** | SV-10086 — Bug, **High**, `Merged to Staging`, parent SV-10360, **0 comments**; the QA lead confirmed no handoff exists, so the description's Verification paragraph is the checklist |
| 5 | **Every figure traces to a live measurement this pass** | request durations (11,510 / 563 / 531 / 457 ms), preview durations (3.3 / 1.7 / 2.8 / 3.9 s), activation and job timestamps, `estimated_total` transitions, and the 230 kill-test observations were all captured in this run and saved to `/tmp/qa10086/*.json` |
| 6 | **Named test data confirmed live** | workspace *Foothills Group Inc* `01a09126-ee05-724a-942e-ee943aa20afc`; fixture customer *Zapata Fleet Maintenance Inc*; fixtures seeded and later removed, both confirmed by the tool's own response |
| 7 | **Exhibits** | 2 built, annotated on the pixels at coordinates read from the live DOM (`card_onboarding_backfill`, `text_onboarding_backfill_estimate`), each labelled with environment, build and date. The two panels of exhibit 1 are **two different runs and say so** — they are not presented as one before/after |
| 8 | **No simulated before** | a deliberate pre-fix capture was impossible (production refuses the admin tooling); the single pre-deploy observation is reported as an observation, with `n = 1` and the missing marker re-read stated |
| 9 | **Human voice / no AI fingerprint** | reader-facing text scanned — no model name, no AI self-reference, no attribution footer |
| 10 | **Format** | verdict is the first line; no "Technical details for developers" section unless the QA lead approves one for this ticket (Standing Rule 84) |
| 11 | **Environment restored** | fixtures removed; books reset and taken live again — final state recorded in FINDINGS.md |

Outcome: clear, with the mid-pass redeploy disclosed rather than smoothed over.
