# Report Suite — TestRail EXECUTION LOG, final pass 2026-08-05

**Operation type:** `update_case` ONLY. **0 `add_case` · 0 `delete_case` · 0 `add_section` ·
0 run writes of any kind** (no `add_result`, no `update_run`, no `add_run`).

**Verification method (Standing Rule 50, exhaustive then exact).** Every write goes through
`tr.update_case_verified`, which for each operation:

1. snapshots the FULL case body **before** the write;
2. performs the `update_case`;
3. **re-GETs** the case and compares **every field** against the intended payload;
4. proves **every field the pass did not intend to change is byte-identical** to the pre-write snapshot,
   with only `updated_on` / `updated_by` exempt (they move on any write by definition);
5. **raises on any mismatch — the write is treated as FAILED, the batch stops, and both byte sequences are
   reported.** It never retries blindly.

**Declared normalisation relied on:** `refs` is compared under
`','.join(p.strip() for p in s.split(','))` — TestRail splits on commas, trims and rejoins. **This pass
wrote `refs` on no case**, so the normalisation was not exercised.

**⚠️ A SECOND ECHO FIELD FOUND THIS PASS — `case_refs` on a run result.** The 2026-08-04 pass recorded
`case_title` as a read-time echo of the case title on a result record. **`case_refs` is the same kind of
field** — a result record carries `case_refs` echoing the case's References at read time. Neither is a
graded field and neither can be written by us. **Recorded here and in the playbook so a future pass does
not read an echo change as evidence of a run write.** This pass wrote no `refs`, so neither echo moved for
that reason.

---

## 1 · WHAT WAS WRITTEN

| | |
|---|---|
| Cases written | **473 of 473** (every one of our cases; one write per case) |
| Field written | `custom_expected` only |
| Fields compared per operation | **30** |
| Mismatches | **0** |
| Collateral changes | **0** |
| HTTP status | **200 on every operation** |

**One write per case, carrying every intent for that case** — the repairs, the marker, and the two spec
version bumps were applied to **one final text** and written **once**, rather than as separate operations.

## 2 · WHAT CHANGED IN THE TEXT

| Change | Cases |
|---|---|
| `AUTOMATION:` marker added or standardised | **473** |
| Location column-selector boilerplate removed; the report's own documented rule restored | 13 |
| "for now" / "confirmed in the build" hedges removed, spec cited instead | 25 |
| The invented on-screen scope indicator deleted (removed, **not** replaced) | 6 |
| Provenance moved to Sales By Customer **v14** | all SBC cases citing it |
| Provenance moved to Parts Velocity **v5** | all PV cases citing it |
| Individual repairs (C30156, C30538, C30470, C30362, C30384, C30391, C30352) | 7 |
| The `---` separator before the provenance line preserved or restored | 473 |

**Rule 41 compliance.** Every case opened was re-read whole. Each operation's log entry records
**"re-verified whole against the live Confluence specs read this pass (SBC v14, SBR v15, PV v5, TU v5,
WIP v6, IV v3)"** — not merely the field edited. The machine-readable per-operation log with the intended
payload, HTTP status and field-comparison result for each of the 473 is
`/tmp/rs-viu/exec/oplog.json` (kept out of the repo: it embeds full case bodies, and `/tmp` is the
secrets-and-bulk store).

## 3 · WHAT WAS DELIBERATELY **NOT** WRITTEN

| Not written | Why |
|---|---|
| **The build clause in the provenance line** — all 473 still read `8/4/2026 (build v3.4.1-3d03023)` | We did not re-observe these cases on `v3.5-16cf83f`. Re-dating without re-observing asserts a test that did not happen (Rule 12). **A stale date is honest; a fresh false one is not.** |
| **`refs` on any case** | Nothing in this pass changed a case's traceability. |
| **C30265 (SBR-COL-01)** | It is **correct** against SBR S21-R7 + S20-R1 + S20-R3. The brief asked for it to be changed; changing it would have imported Sales By Customer's rules into Sales By Representative. |
| **The 5 foreign cases C38919–C38923** | Vladimir Tomovic's. Rule 38 — never edited, moved or deleted; proven byte-identical including `updated_on` and `updated_by`. |
| **Any run** | Run 359 belongs to Nebojsa and Viktoria. |
