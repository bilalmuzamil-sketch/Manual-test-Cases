# STATUS LEDGER — corrected 2026-08-04 by the final push

The authoritative per-case ledger is
`../audit-exhaustive-2026-08-04/VERDICT-LEDGER.md` (rows in `per-case-verdicts.csv`,
column `status_ledger`). **This pass changes three of its rows.** The change is recorded here
rather than by editing that pass's own files, so its output stays intact and the correction is
attributable.

## THE THREE CORRECTIONS — a recorded PASS that contradicted the case's own evidence

| Case | C-id | Was | Now | Why |
|---|---|---|---|---|
| SBR-EXP-06 | [C30281](https://shopview.testrail.io/index.php?/cases/view/30281) | VIU-Observed-PASS | **DEVIATION** | the recorded PASS contradicts the evidence captured for it |
| SBR-VIS-03 | [C30307](https://shopview.testrail.io/index.php?/cases/view/30307) | VIU-Observed-PASS | **DEVIATION** | same — flagged in the audit's own `layman_note`: *"the VIU recorded PASS while …"* |
| SBC-EXP-09 | [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) | VIU-Observed-PASS | **DEVIATION** | same |

**LOCAL ONLY — no TestRail field carries this.** TestRail has no status field for a case
(only a test inside a run does), so these are recorded in the local case source
`../cases/*.json` `viu_status`, which is where every other ledger status lives, and in the
`notes` field with the reason and the date.

## THE CORRECTED TOTALS

| Status | Was | Now |
|---|---:|---:|
| VIU-Observed-PASS | 327 | **324** |
| DEVIATION | 109 | **112** |
| NOT-BUILT | 13 | 13 |
| EXTERNAL-DEPENDENCY | 20 | 20 |
| BLOCKED-BY-DEFECT | 9 | 9 |
| **TOTAL** | **478** | **478** |

Arithmetic check: 327 − 3 = 324 · 109 + 3 = 112 · 324 + 112 + 13 + 20 + 9 = **478**. The
population is unchanged; only three rows moved between two columns.

## WHY THIS MATTERS TODAY

The automation engineers start from this suite. A case recorded as **PASS** when its own
evidence says otherwise is worse than an honest DEVIATION: it tells whoever automates it that
the build is right, so the automated version is written to the wrong expectation and the
defect becomes permanently invisible. Three rows is a small number; the direction of the error
is the point.

## HONESTY NOTE (Rules 12 / 49)

These three were **not re-observed live** by this pass. The correction is a **desk correction**:
the recorded verdict was compared with the evidence recorded alongside it and found to
disagree, so the verdict was changed to match the evidence. All three remain **PENDING** in
`../viu-2026-08-03/RECHECK-QUEUE.md` and are due a fresh live observation when the build
settles — at which point they may move again.
