# Ticket type audit — 2026-08-06

**Read [`TYPE-AUDIT.md`](TYPE-AUDIT.md) first.** It opens with a plain-English summary and holds the
table of tickets to convert.

**The question:** which tickets that WE created are still an `issuetype` of **Bug** and should, under
Standing Rule 52 as amended 2026-08-05, be a **Story Defect** parented to their owning story?

**The answer in one line:** of **87** tickets in our records, **8** qualify — and **we cannot convert
them from here**, because the Jira REST API refuses and the only route is the web-page
"Change work type" wizard.

| Bucket | Count |
|---|---|
| (A) already correct | 61 |
| **(B) ours, still a Bug, should convert** | **8** |
| (C) ours, a Bug, deliberately left alone (all closed) | 6 |
| (D) converted by someone else already | 12 |
| (E) examined and excluded as not ours | 1 (SV-8910, flagged) |

**Priorities: 0 changed. Jira writes: exactly 1** — the authorised probe re-confirming the API
refusal, which returned HTTP 400 and left its target byte-identical across all 59 fields.
**TestRail calls: 0.**

## Files

| File | What it is |
|---|---|
| `TYPE-AUDIT.md` | the deliverable — summary, conversion steps, the 8-row table, the honest "does it matter" assessment, and the outstanding asks |
| `type-audit.json` | machine-readable classification, one record per ticket with every live field |
| `VERIFICATION.json` | 71 checks of the markdown's claims against the live snapshots — 71 PASS / 0 FAIL |
| `snapshots/live-state.json` | all 87 tickets as read live today |
| `snapshots/bug-detail.json` | full changelogs for the 14 Bugs, plus their target stories |
| `snapshots/API-REFUSAL-PROBE.json` | the one write: payload, HTTP 400, before/after byte comparison |
| `snapshots/rollup-and-sweep.json` | epic roll-up measurements + the outside-in Bug sweep |
| `snapshots/parent-stories.json` | all 50 distinct parent stories verified level-0 under the right epic |
| `snapshots/project-convention.json` | all 575 Story Defects in project SV, by parent type |
| `tools/` | every script. All read-only except `probe.py`, which is the single authorised write. |

## Reproduce

```bash
python3 tools/population.py   # the 87, and where each key comes from in our records
python3 tools/pull.py         # read all 87 live            (read-only)
python3 tools/detail.py       # changelogs + target stories (read-only)
python3 tools/rollup.py       # roll-up + outside-in sweep  (read-only)
python3 tools/classify.py     # emit type-audit.json        (no network)
python3 tools/verify.py       # check the markdown           (no network)
# tools/probe.py is the ONE write -- do not re-run it without authorisation
```

Jira session cookies come from `/tmp/atlassian/cookies.json` (secrets, never committed).
