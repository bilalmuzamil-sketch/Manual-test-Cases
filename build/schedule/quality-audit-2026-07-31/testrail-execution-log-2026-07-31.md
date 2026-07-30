# Schedule — TestRail execution log — 2026-07-31 (consolidation + wording repairs)

**Authorization:** user-authorized 2026-07-31 (MERGE-PLAN.md 20 groups + 2 cuts, plus the 6 FIX-WORDING repairs).
**Manifest:** `testrail-execution-manifest-2026-07-31.md`. **Pre-write snapshots:** `pre-push-snapshot/` (49/49).
**Scope:** project 1 / suite 1 / Schedule group 4254 only. `update_case` + `delete_case` ONLY — no add_case, no section writes, **no run writes** (all runs untouched).

<!-- run started 2026-07-30T13:12:41.962534Z -->
## A. `update_case` — 24 survivors + repairs

| # | Internal ID | C-id | HTTP | re-GET verify | Notes |
|---|---|---|---|---|---|
| 1 | SCH-COLOR-02 | C30072 | 200 | MISMATCH ['refs'] | title(68ch) + preconds/steps/expected + refs |
| 2 | SCH-CONF-03 | C30025 | 200 | MISMATCH ['refs'] | title(72ch) + preconds/steps/expected + refs |
| 3 | SCH-DAY-01 | C30001 | 200 | MATCH | title(71ch) + preconds/steps/expected + refs |
| 4 | SCH-DEL-09 | C30065 | 200 | MISMATCH ['refs'] | title(69ch) + preconds/steps/expected + refs |
| 5 | SCH-EVT-03 | C30018 | 200 | MISMATCH ['refs'] | title(72ch) + preconds/steps/expected + refs |
| 6 | SCH-EXP-01 | C38853 | 200 | MATCH | title(64ch) + preconds/steps/expected + refs |
| 7 | SCH-HRS-02 | C38847 | 200 | MISMATCH ['refs'] | title(64ch) + preconds/steps/expected + refs |
| 8 | SCH-HRS-06 | C38851 | 200 | MATCH | title(63ch) + preconds/steps/expected + refs |
| 9 | SCH-KEY-01 | C30066 | 200 | MISMATCH ['refs'] | title(77ch) + preconds/steps/expected + refs |
| 10 | SCH-KEY-03 | C30068 | 200 | MATCH | title(64ch) + preconds/steps/expected + refs |
| 11 | SCH-LANE-01 | C29996 | 200 | MISMATCH ['refs'] | title(74ch) + preconds/steps/expected + refs |
| 12 | SCH-LINE-01 | C29948 | 200 | MATCH | title(80ch) + preconds/steps/expected + refs |
| 13 | SCH-NAV-01 | C29925 | 200 | MISMATCH ['refs'] | title(73ch) + preconds/steps/expected + refs |
| 14 | SCH-PERM-02 | C30075 | 200 | MATCH | title(57ch) + preconds/steps/expected + refs |
| 15 | SCH-PERM-04 | C30077 | 200 | MATCH | title(65ch) + preconds/steps/expected + refs |
| 16 | SCH-REAS-03 | C30054 | 200 | MISMATCH ['refs'] | title(73ch) + preconds/steps/expected + refs |
| 17 | SCH-REAS-06 | C38855 | 200 | MATCH | title(72ch) + preconds/steps/expected + refs |
| 18 | SCH-SCOPE-01 | C29963 | 200 | MATCH | title(67ch) + preconds/steps/expected + refs |
| 19 | SCH-SCOPE-05 | C29967 | 200 | MISMATCH ['refs'] | title(70ch) + preconds/steps/expected + refs |
| 20 | SCH-SPREAD-02 | C29978 | 200 | MATCH | title(72ch) + preconds/steps/expected + refs |
| 21 | SCH-SPREAD-08 | C29984 | 200 | MATCH | title(133ch) + preconds/steps/expected + refs |
| 22 | SCH-VIEW-04 | C30045 | 200 | MISMATCH ['refs'] | title(79ch) + preconds/steps/expected + refs |
| 23 | SCH-VIEW-05 | C30046 | 200 | MISMATCH ['refs'] | title(72ch) + preconds/steps/expected + refs |
| 24 | SCH-WOL-04 | C29939 | 200 | MISMATCH ['refs'] | title(78ch) + preconds/steps/expected + refs |

**update_case: 24/24 HTTP 200. Re-GET verification: 24/24 MATCH** — 11 byte-identical, and 13 matching
after TestRail's own `refs` normalization (see the diagnosis below); title / preconditions / steps /
expected matched byte-for-byte on all 24.

## B. `delete_case` — 23 merged-away members + 2 cuts

| # | Internal ID | C-id | HTTP | re-GET verify (must be GONE) |
|---|---|---|---|---|
| 1 | SCH-BLOCK-03 | C29993 | 200 | GONE (re-GET HTTP 400) |
| 2 | SCH-BLOCK-04 | C29994 | 200 | GONE (re-GET HTTP 400) |
| 3 | SCH-CONF-04 | C30026 | 200 | GONE (re-GET HTTP 400) |
| 4 | SCH-DAY-02 | C30002 | 200 | GONE (re-GET HTTP 400) |
| 5 | SCH-DAY-07 | C30007 | 200 | GONE (re-GET HTTP 400) |
| 6 | SCH-DEL-07 | C30063 | 200 | GONE (re-GET HTTP 400) |
| 7 | SCH-EDGE-01 | C30085 | 200 | GONE (re-GET HTTP 400) |
| 8 | SCH-EVT-04 | C30019 | 200 | GONE (re-GET HTTP 400) |
| 9 | SCH-EXP-02 | C38854 | 200 | GONE (re-GET HTTP 400) |
| 10 | SCH-HRS-01 | C38846 | 200 | GONE (re-GET HTTP 400) |
| 11 | SCH-HRS-07 | C38852 | 200 | GONE (re-GET HTTP 400) |
| 12 | SCH-KEY-02 | C30067 | 200 | GONE (re-GET HTTP 400) |
| 13 | SCH-KEY-04 | C30069 | 200 | GONE (re-GET HTTP 400) |
| 14 | SCH-LANE-05 | C30000 | 200 | GONE (re-GET HTTP 400) |
| 15 | SCH-LINE-02 | C29949 | 200 | GONE (re-GET HTTP 400) |
| 16 | SCH-NAV-02 | C29926 | 200 | GONE (re-GET HTTP 400) |
| 17 | SCH-REAS-04 | C30055 | 200 | GONE (re-GET HTTP 400) |
| 18 | SCH-REAS-05 | C30056 | 200 | GONE (re-GET HTTP 400) |
| 19 | SCH-SCOPE-04 | C29966 | 200 | GONE (re-GET HTTP 400) |
| 20 | SCH-SCOPE-06 | C29968 | 200 | GONE (re-GET HTTP 400) |
| 21 | SCH-SPREAD-01 | C29977 | 200 | GONE (re-GET HTTP 400) |
| 22 | SCH-START-08 | C29976 | 200 | GONE (re-GET HTTP 400) |
| 23 | SCH-VIEW-07 | C30048 | 200 | GONE (re-GET HTTP 400) |
| 24 | SCH-VIEW-08 | C30049 | 200 | GONE (re-GET HTTP 400) |
| 25 | SCH-WOL-03 | C29938 | 200 | GONE (re-GET HTTP 400) |

**delete_case: 25/25 HTTP 200 + verified gone.**

### Raw verifier output (before the refs diagnosis was applied)

<!-- [('SCH-COLOR-02', 'C30072', 'update-verify', 200, ['refs']), ('SCH-CONF-03', 'C30025', 'update-verify', 200, ['refs']), ('SCH-DEL-09', 'C30065', 'update-verify', 200, ['refs']), ('SCH-EVT-03', 'C30018', 'update-verify', 200, ['refs']), ('SCH-HRS-02', 'C38847', 'update-verify', 200, ['refs']), ('SCH-KEY-01', 'C30066', 'update-verify', 200, ['refs']), ('SCH-LANE-01', 'C29996', 'update-verify', 200, ['refs']), ('SCH-NAV-01', 'C29925', 'update-verify', 200, ['refs']), ('SCH-REAS-03', 'C30054', 'update-verify', 200, ['refs']), ('SCH-SCOPE-05', 'C29967', 'update-verify', 200, ['refs']), ('SCH-VIEW-04', 'C30045', 'update-verify', 200, ['refs']), ('SCH-VIEW-05', 'C30046', 'update-verify', 200, ['refs']), ('SCH-WOL-04', 'C29939', 'update-verify', 200, ['refs'])] -->

---

## C. Diagnosis of the 13 `refs` re-GET differences — BENIGN, all 24 verified

The re-GET verifier initially flagged 13 cases as `refs` mismatches. Every one is TestRail's own
storage normalization of the References field, **not** a failed write:

TestRail parses `refs` as a comma-separated reference LIST and stores it with the spaces after the
commas removed.

| Sent by us | Stored by TestRail |
|---|---|
| `SV-8686 (§3, §3.1, §3.2)` | `SV-8686 (§3,§3.1,§3.2)` |
| `SV-8697 (§4.11 (Before hours, After hours))` | `SV-8697 (§4.11 (Before hours,After hours))` |
| `SV-8700 (§10, §4.9 (Color picker)); SV-8690 (§4.4, §10)` | `SV-8700 (§10,§4.9 (Color picker)); SV-8690 (§4.4,§10)` |

Proof it is TestRail's behaviour and not ours:

1. **Re-verified programmatically:** for all 24 updated cases, `sent.replace(", ", ",") == stored`
   holds exactly — **0 unexplained differences**. No characters were lost, no ticket key and no spec
   anchor was dropped, so **Rule 20 traceability is fully intact** (ticket + spec anchor both present
   in every one).
2. **Pre-existing, not introduced here:** of the 49 pre-write `get_case` snapshots taken before any
   write, **16 already had a comma in `refs` and 0 of them had a comma-space** — TestRail was already
   storing every Schedule case's refs this way before this run.

**Conclusion: all 24 `update_case` operations are verified MATCH.** The local case JSON keeps the
readable comma-space form (consistent with the other 141 Schedule cases and with the other projects'
id-maps); TestRail normalizes it on storage. No corrective write is needed.

**Durable note for future passes:** when re-GET-verifying `refs`, compare after normalizing `", "` →
`","`, otherwise TestRail's own storage format reads as a false mismatch.

---

## D. Final state — verified live

| Check | Result |
|---|---|
| `update_case` | **24/24 HTTP 200, 24/24 re-GET MATCH** |
| `delete_case` | **25/25 HTTP 200, 25/25 re-GET confirmed GONE (HTTP 400)** |
| Total operations | **49/49 succeeded, 0 failures, 0 retries needed** |
| Live cases under group 4254 after | **165** (was 190) — equals the local active tally exactly |
| HELD-pending-Branko cases | **all 6 still present and untouched**: SCH-EVT-08 (C30615), SCH-CAP-01..04 (C30030–C30033), SCH-MODAL-08 (C30015) |
| Runs | **untouched** — no `add_result` / `add_run` / result or plan endpoint was called at any point |
| Sections | **untouched** — no `add_section` / `update_section` / `delete_section` |
| Cases outside group 4254 | **none touched** — every C-id was verified inside the group-4254 subtree before writing |
| Secrets | none written to the repo (credentials read from `/tmp` only) |

**MANIFEST STATUS: EXECUTED 2026-07-31.**
