# State — SV-11466 / SV-11467 / SV-11422 / SV-11452 (saved 20 Oct 2026)

## Done
| Ticket | Jira state (live 20 Oct) | Our comment(s) | TestRail (run 498) |
|---|---|---|---|
| SV-11466 Board View sideways scrollbar | Done | 79018 PASSED | test 4053764 (case 682419, reworded 19 Oct: "clearly thicker", "how much longer depends on the window width", spec v66) Passed 527989 + corrected 527992; test 3481897 Passed (other session's 527988) |
| SV-11467 Tech View count bubbles | Done | 79022 PASSED | new test 4054407 (case 682420) Passed 527990 |
| SV-11422 first Tab, off-screen work order | Ready for QA (with Slavcho) | 79031 PARTIALLY PASSED (edited 22:30 CDT 19 Oct, check 10 FAILED); question 79033; Chris's answer 79047 "not acceptable" | new test 4054408 (case 682421, expected updated to Chris's ruling, spec v68) **Failed 530263** (20 Oct re-check); C614719 / test 4007027 made layman-runnable (plain preconditions, steps 8-13 added; Vladimir's Automated flag kept) |
| SV-11452 invalid status in the link (production) | Ready to Fix | description rewritten (on-screen steps, 3 annotated pictures, Filters spec v23 quotes, 6-link table; Ahtasham's original kept) | — |

## In flight / waiting
- **SV-11422:** waiting on Slavcho's fix (row must sit just below the sticky heading, ring visible). Staging front-end still v26.40.19-c850386 on 20 Oct. When it changes: re-run `/tmp/qa11310/walkB.mjs compact,regular,comfortable` + `z22.mjs` (copies in `sv11422/` and `testcases-2026-10-19/ev/`). Then update 79031 (dated note) and log the result on test 4054408. If it passes, also run C614719 (test 4007027) steps 8-13.
- **Run 498:** another session removed 20 lead-dialog tests (116 results left the run) and added 23 overnight. QA lead asked whether that's OK.

## How to resume
- Harness: `/tmp/qa11310` (ephemeral). Staging cookies are in `/tmp/qa11398/cookies.json` (never committed). Bridge: `node build/testing-tools/staging-bridge.mjs` → port into `/tmp/qa11310/port.txt`. Production: `open({env:'prod',user:'bilal.muzamil@shopview.com'})`, password `/tmp/sv-prod-pw.txt`.
- Scripts that change density must restore `density` too (playbook §AK-VIS addendum).
- Evidence: `sv11422/ev`, `sv11422/ev-1020`, `testcases-2026-10-19/ev`, `../sv11452-invalid-status-url-2026-10-20/ev`.
