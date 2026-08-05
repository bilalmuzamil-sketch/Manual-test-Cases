# Filters full live VIU 2026-08-05 — RESUME

## STATUS: **COMPLETE.** All 110 cases observed live and written. Nothing left in flight.

**Build every verdict belongs to:** `v3.4.2-d00239b` · last-modified Tue 04 Aug 2026 22:51:02 GMT ·
etag `b9ab1d41718b5e871432064ed914e2e7` · read at **19:53Z, 21:00Z and 21:34Z**, `index.html`
**byte-identical by sha256 all three times** — no redeploy under this pass.

**Spec:** Confluence page 572030978 **version 18** (the in-body field reads `1.6` and is the known
trap). **Epic:** SV-8785, **23** children, verified two ways.

## What was done

| | |
|---|---|
| Cases observed live | **110 of 110** — no sampling, nothing carried forward |
| Batches | 11, each committed and pushed by explicit reviewed SHA |
| TestRail writes | **110 × `update_case`**, all HTTP 200, all byte-verified, 30 fields compared each, 0 mismatches |
| Fields on every payload | all four — `custom_preconds`, `custom_steps`, `custom_expected`, `refs` |
| add / delete / section / run writes | **0 / 0 / 0 / 0**; no result logged anywhere |
| Tickets filed | **1** — SV-8912 |
| Verdicts | PASS 81 · DEVIATION 14 · HOLD 15 |
| Markers | READY 81 · READY-EXPECT-FAIL 14 · HOLD 15 → **ready to automate 95**, gate passes |

## Read in this order

1. `SOURCE-CURRENCY.md` — what was current, and the ticket status table
2. `FINDINGS.md` — **all 110 rows** with verdict, evidence and build marker
3. `../READINESS-2026-08-05-FULL-LIVE.md` — the rebuilt figures, every row sums
4. `testrail-execution-log.md` — 110 operations, both Rule-59 timestamps
5. `FILED.md` — SV-8912, and why nothing else was filed
6. `DELIBERATE-DECISIONS.md` — 15 entries, including the two MEDIUM-risk judgement calls
7. `CHANGES-MADE.md` — everything altered on the branch, with before values
8. `RECHECK-QUEUE.md` — OPEN, and the Rule-60 layer split
9. `API-ASK.md` — one API-only finding, asked not filed

## If this has to be re-run

Nothing is part-done, so a re-run is a fresh Rule-49 re-check rather than a resume. The cheap path
is Rule 60's layer split: **re-check only the labels, the verdicts and the 14 expect-fail markers.**
The documented expectations, requirement anchors, spec version, epic and story references do **not**
need re-deriving on a redeploy.

Tooling used, all reusable: `/tmp/fv2/b.mjs` (Chromium boot on raw cookies — **never calls
quick-login**), `/tmp/fv2/lib.mjs` (the resilient per-observation wrapper that writes incrementally
so a timeout never loses earlier work), `/tmp/fv2/w/ledger.py` (the 110-row verdict ledger),
`/tmp/fv2/w/gen.py` (payload builder — markup repair, note handling, provenance re-stamp, marker),
`/tmp/fv2/w/exec.py` (resumable executor, appends to `exec-log.jsonl` and stops the batch on any
mismatch). `/tmp` is ephemeral; the evidence and logs in this folder are the durable record.

## Env state left behind

See `CHANGES-MADE.md`. In short: **nothing created, nothing deleted, no role touched.** Two saved
preference objects were changed and both are recorded with their before values — the Work Orders
filter state is left **empty**, and the Parts Inventory page still carries a pre-existing
**Category: COCtest** filter that is not ours.
