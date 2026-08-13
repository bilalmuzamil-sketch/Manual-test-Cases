# COLD-RUN VERIFICATION — `08-RECOVER.md` · forensic drill against the REAL kill of 2026-08-12

**Drill run 2026-08-13, from cold: a session knowing nothing but `00-COMMON-CORE.md` +
`08-RECOVER.md`, treating the Filters finish5 kill (container restart, folder
`build/filters/finish5-2026-08-12/`) as if it had just happened and no recovery existed.**
Read-only everywhere: TestRail `get_*` only · 0 Jira calls · 0 app access · 0 case edits ·
0 run writes. Oplog + committed evidence: `evidence-08-recover/` (commit `71c9ecc9`). Drill start
SHA `bfb72066`; live TestRail read at **2026-08-13 07:44:47 UTC**.

## VERDICT: **PASSES WITH FIXES APPLIED**

The seven-step procedure worked end to end from cold and produced **the same substantive verdict as
the real recovery** — no disagreement on any LANDED / NOT LANDED / needs-re-running classification.
Three cold-start defects were found (one of them a **recurrence** the morning's 05-drill had already
logged without the fix landing), plus one evidential gap and one trivial record inaccuracy **in the
original recovery itself** (reported below, history not corrected). All three skill defects are
fixed additively in this turn.

---

## 1 · COLD-START DEFECT LOG

| # | Defect | Where it bit | Fix applied |
|---|---|---|---|
| **D1 — RECURRING** | **Neither skill file says how to authenticate to TestRail or where the credentials live.** Step 4 ("verify every claimed operation against live") is unrunnable without them. Core §17 gives the API URL and the `&`-separator rule; §6 covers only the *application* cookies. Found `/tmp/testrail/creds.json` only via the prior drill's oplog — a reach outside the two files. **The 05-drill logged this same defect earlier today (its oplog, 05:58 line) and no fix landed in the skill** — a logged-but-unfixed defect is exactly the *"guardrail written down but not read"* failure of core §7.5. | Step 4, immediately | Core **§17** now names `/tmp/testrail/creds.json` (keys, ephemerality, and what to ask for when it is absent) |
| **D2** | **Step 3 (sweep `/tmp`) says what to do while the container is alive, but not what to do when `/tmp` is already gone** — which is the *normal* state for a recovery running in a fresh container. The honesty notes ("contemporaneous or reconstructed") gesture at the consequence, but no procedural step says: enumerate what the dead pass's records say lived in `/tmp`, classify each item recoverable-elsewhere / genuinely lost, and carry the loss into the verdict's second half. This drill hit it directly: `/tmp/testrail/f5/`, `/tmp/r2.log`, `/tmp/q*.log` are gone. | Step 3 | `08` step 3 gains a dated "WHEN `/tmp` IS ALREADY GONE" clause |
| **D3** | **Step 4 assumes the kill is recent.** When recovering a pass that is not the most recent, live content may legitimately differ because a LATER pass wrote to the same cases — the skill never says to establish, from git, whether anything later touched them before classifying LANDED / LANDED BUT WRONG. This drill had to invent that check (result: only Report Suite was written after finish5, so live Filters content is attributable to the recovery). Without it, a legitimate later edit would misread as LANDED BUT WRONG. | Step 4 | `08` step 4 gains a dated "date the evidence" clause |

**Reaches outside the two files that were NOT defects:** the pass folder's own contents, the git
history of the pass, and the finish4 completion report — the skill explicitly sends the recoverer to
the pass folder and to "the live suite and the git history alone" when no oplog exists.

**Paths the drill exercised that the skill already covers correctly:** the no-oplog path (at kill
time the folder held only `evidence/` + `tools/` — no oplog file existed; position rebuilt from
checkpoint commits + committed probe output, as step 2 prescribes) · the `&`-only paging (§3.3;
`get_sections` returned 626 — an unpaged call would silently have found zero Filters sections) ·
verify-by-content-never-timestamp (G4) · the graded-fields-only run check (§3.4) · G8 path-scoped
commits (a sibling committed `f96f40a4` mid-drill; nothing of theirs was swept).

---

## 2 · THE INDEPENDENT RECOVERY VERDICT (derived cold, before comparing)

**Kill timeline from git:** killed worker's commits `e882d1c6` 16:51:30Z (checkpoint 1, Status-chip
four) · `b3e3aeb6` 17:03:09Z (checkpoint 2, all 14 Parts/Reports surfaces) · `649224f4` 17:09:34Z
(restore contradiction settled). Kill between **17:10:26Z** (probeR2.json's own timestamp — written
after the last commit, so genuinely orphaned) and **17:50:40Z** (first recovery commit `c82afbe8`).

**What the pass intended** (from finish4's remainder + the checkpoint record): walk the falsely-
blocked Filters remainder (Status-chip four · 14 Parts/Reports surfaces · the restore contradiction ·
the session-cost cases C29581/C29588/C38876), re-stamp only what it drove end to end, produce the
deliverables.

**What landed, by content against live TestRail (read 07:44:47Z), never `updated_on`:**

| Claim | My independent finding | How verified |
|---|---|---|
| Killed pass made **ZERO TestRail writes** before the kill | **CORROBORATED — but no longer provable from committed evidence** (see §3, F1). The four target cases' pre-write stamps (recorded in the committed `restamp5-oplog.json` "replaced" strings) were still the OLD `v3.4.2-d00239b on 8/5/2026` values at 18:15Z, and the live stamp census shows no anomalous writes | oplog "replaced" strings + live census |
| Orphaned in git working tree: `probeR2.json`, `probeR2.cjs`, `probeR3.cjs` | **CONFIRMED** — committed by `c82afbe8`; probeR2.json's content shows C29614 steps 1–6 and C43560 driven pre-kill, matching the recovery's claim | commit content + probe JSON read |
| Orphaned in `/tmp`: `r2.log`, `q*.log`, TestRail census `/tmp/testrail/f5/` | **GONE TODAY** — all absent; the census was used by the real recovery but never committed | `ls` |
| The 4 re-stamps (C29614, C43560, C29581, C29588) landed | **CONFIRMED LIVE** — each carries exactly the oplog's "with" string `Last checked against build v3.7-20e801b on 12 August 2026.`, **exactly once**, one provenance sentence, one `AUTOMATION:` marker, 0 raw markup (§2.4 invariant census), `updated_by` 3 at 18:15/18:33Z, and **no later pass wrote to Filters** so the content is the recovery's | `get_case` ×4 + git since finish5 |
| C29614's stale hedge "(to confirm live once built)" deliberately left | **CONFIRMED LIVE** — still present | `get_case` |
| Run 352 untouched | **CORROBORATED** — `include_all` false, 120 tests, case-id sets equal both ways vs the suite, **648 results** = the recovery's post-write count = the 05-drill's 05:58Z count. The "0 graded fields moved vs the pre-write snapshot" half is **reconstructed-only** (snapshot lived in `/tmp`, gone) | `get_run/tests/results` |
| Foreign five (C43576–C43580) never touched | **CORROBORATED BY CONTENT** — all `created_by`/`updated_by` 7, expected results empty, nothing of ours (no provenance, no marker) on any; `updated_on` 2026-08-10 predates the pass (context only, per G4) | `get_case` ×5 |
| Tallies: ours 115 / live 120 · markers 90/7/18 · stamps 74/23/12/6 | **REPRODUCED EXACTLY, LIVE** | full census |
| Needed re-running: probeR3 · every `.md` deliverable · the re-stamps | **CONFIRMED** — all landed in `06752c92` → `3650f4a7`; nothing else was owed | git + live |

**Did we lose anything?** — the two-half verdict, in the skill's canonical shape:

> **NO QA WORK WAS LOST.** Everything the killed pass measured survived (committed checkpoints +
> the orphaned probe output, committed by the recovery), and everything it still owed was completed
> and is live-verified today by content.
>
> **ONE THING WAS GENUINELY LOST AND CANNOT BE GOT BACK — and it was lost by the RECOVERY, not the
> kill:** the killed pass's 16:41Z TestRail census (`/tmp/testrail/f5/`), the 120-case zero-writes
> byte-comparison output, and the run-352 pre-write snapshot were used from `/tmp` and never
> committed. The conclusions they supported are corroborated today from other committed evidence —
> but the contemporaneous proof is gone, and this drill's confirmation of the zero-writes claim is
> **an after-the-fact reconstruction, and says so here on its own line.**

---

## 3 · DISAGREEMENT-BY-DISAGREEMENT COMPARISON WITH THE REAL RECOVERY

**On every substantive classification — what landed, what was orphaned, what needed re-running, what
the runs and foreign cases show — the independent verdict MATCHES the real recovery.** Zero
wrong-verdict findings against the skill. Two findings against the original recovery's record,
reported and NOT corrected (history is never silently rewritten):

| # | Finding | Class |
|---|---|---|
| **F1** | **The real recovery's central proof was left in `/tmp` and is now unrecoverable.** RESUME.md §2: *"All 120 cases were byte-compared against the census it took at 16:41Z — 0 fields differed"* — that census and the comparison output were never committed; the same applies to the run-352 and foreign-case pre-write snapshots (the committed evidence holds only the two restamp oplogs and probe output). Under core §8 R4 / G7 — **written the day after this recovery** — that evidence *"did not happen, evidentially"*. The recovery pre-dates the skill, so this is not a breach of a rule that existed; it IS the exact loss-shape G7 was written against, now proven a second time. The claim itself stands, corroborated indirectly (§2 above). | Original-recovery evidential gap — **reported, not corrected** |
| **F2** | **Trivial record inaccuracy:** `testrail-execution-log.md` says *"Batch 2 (C29581, C29588) at 18:31Z"*; the committed `restamp5b-oplog.json` and the live `updated_on` both say **18:32:59–18:33:03Z**. No consequence — the machine oplog is correct and the prose is off by two minutes. | Original-recovery record inaccuracy — **reported, not corrected** |

**And one comparison in the skill's favour, worth recording:** the real recovery was performed
*before* `08-RECOVER.md` existed, and the skill — assembled afterwards — reproduced its result from
cold with no access to `/tmp`. The procedure is sufficient even when the evidence environment is
worse than the original recoverer had.

---

## 4 · FIXES APPLIED (all additive, dated, superseded wording kept)

1. **Core §17** — TestRail credentials location + absent-creds instruction (D1).
2. **`08-RECOVER.md` step 3** — the "WHEN `/tmp` IS ALREADY GONE" clause (D2).
3. **`08-RECOVER.md` step 4** — the "date the evidence" clause for non-recent kills (D3).
4. **`COVERAGE-MATRIX.md`** — one row per fix, same turn, per the house rule.

## OUTSTANDING — what I need from you

**Nothing is blocked on you from this drill.** The three skill fixes are applied and pushed; F1/F2
are records about a past pass, not work. (The register's standing items — the read-date sweep S7/D1
and the Jira creation hold H1 — are unchanged by this drill and remain as recorded.)
