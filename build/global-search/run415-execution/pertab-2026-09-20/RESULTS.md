# Per-tab prefix ranking — C72120 · C72121 · C72122 (20 September 2026)

Handoff: `RUN-HANDOFF-PERTAB-3-2026-09-20.md`. Build **v26.36.8-d146c39**, branch `sv9160`, run **415**.
Each keyword read **twice**, identical both times (`pertab.mjs`). Judged by the **match label**, as the
handoff instructs, and against each case's own Expected read live from TestRail first (Rule 106).

| Case | Keyword / tab | Row 1 (begins with) | Row 2 (contains) | Row 3 (typo) | Result |
|---|---|---|---|---|---|
| **C72120** | `ZZKRYPTON` / Parts | `ZZKRYPTON Brake Kit` — **`word` / description** — 1.00 | `Heavy Duty ZZKRYPTON Filter` — `word` / description — 1.00 | `ZZKRYPTOM Wheel Seal` — `fuzzy` — 0.41 | **Failed** |
| **C72121** | `ZZMAGENTA` / Vendors | `ZZMAGENTA Supply Co` — **`prefix` / name** — 1.00 | `Northgate ZZMAGENTA Parts` — `word` / name — 1.00 | `ZZMAGENTO Traders` — `fuzzy` — 0.36 | **Passed** |
| **C72122** | `ZZOBSIDIAN` / Assets | `2019 ZZOBSIDIAN Trucks Hauler` — **`prefix` / make** — 1.00 | `2019 Western Heavy ZZOBSIDIAN Hauler` — `word` / model — 1.00 | `2019 ZZOBSIDIAM Trucks Hauler` — `fuzzy` — 0.41 | **Passed** |

## C72120 — outcome (1) of the three its Expected lists
The case carries `EXPECT FAIL (SV-10279, open)` and predicts *"the begins-with row and the contains row
are credited EQUALLY"*. That is exactly what was observed. **Failed, referenced to SV-10279.** No new
defect raised, no Expected rewritten (Rule 57), as the handoff requires — and independently as my own
rules require, since SV-10279 already covers it.

## C72121 and C72122 — Passed, with the caveat recorded on the result
Both ask for the begins-with row to be credited more strongly and to appear first. Both do. **But rows 1
and 2 are both on 1.00**, so the order is held by the recency tie-break rather than by the score
difference. Recorded on each result in plain words, pointing at **SV-10277**. This is the Rule 106
false-pass trap: a check that passes while the rule it protects is inert.

## Rule 111 — what came from the handoff and what came from my rules
The handoff supplied the **work list** and the judging method (read the match label, not row order),
which matches my own evidence. Everything about **how the results are written** — the plain-language
comment, the caveat, naming the existing ticket instead of "held", the three-outcome reading of the
Expected — comes from my rules. **Nothing in the handoff was overridden.**

Run 415 now: 175 passed · 14 failed · 10 blocked · 3 retest · 1 untested.
