# Global Search — Expected-layout reformat progress (2026-09-22)

Applying the QA lead's 2026-09-22 layout (Rule 113 amendment) to the GS suite: Expected Results become
(1) plain results, one per line; (2) Source; (3) exact verbatim quotes. GS specifics honoured:
- **Each case's AUTOMATION marker is preserved** (GS cases are build-verified — READY, or READY - EXPECT
  FAIL). Not changed to HOLD.
- **EXPECT-FAIL blocks preserved verbatim** (Rule 61 symptom + three outcomes), e.g. C72120 (SV-10279).
- **Two source universes:** palette cases quote **PRD 576978945 v1.5**; the V1-regression suite
  (sections 6769, 8056) sources the **V1 product repo** (Rule 109) — handled in a separate tranche.
- Foreign cases (created_by=1, Vladimir) are NOT touched (Rule 38).
- Snapshot before any write: `SNAPSHOT-gs-bodies-2026-09-22.json` (Rule 87).

## Tranches
| Tranche | Section(s) | Cases | Status |
|---|---|---|---|
| Ranking | 6726 | 23 | ✅ DONE (gs_ranking.py) — structure+quotes+marker verified, fr-view |
| Fuzzy | 6725 | 18 | pending (PRD §7) |
| Permissions | 6734 | 23 | pending (PRD §9 + §4/§6.2) |
| Per-entity shape | 6724 | 9 | pending (PRD §4, §5.3) |
| Scope tabs / grouped / counts | 6722, 6723 | 21 | pending (PRD §5.2) |
| Palette open / states / recent / persist / no-results / error | 6721,6727,6728,6729,6730,6733 | ~23 | pending (PRD §5.1, §5.2, §8) |
| Hover quick-actions / quick actions v1 | 6731, 6774 | ~16 | pending (PRD §5.4) |
| In-page WO list search | 6732 | 2 | pending (PRD §5.2/§8) |
| Contacts / PO / VI entities (v2) | 6736, 6739, 6740 | ~4 | pending (PRD §4) |
| Page-search cutover / Mobile (v2) | 6737, 6738 | ~8 | pending (PRD §5.6) |
| Out-of-V1 / Telemetry | 6767, 6768 | ~1 | pending (out-of-scope footer) |
| **V1-regression suite** | 6769, 8056 | ~67 | pending — sources V1 repo (Rule 109), separate method |

Total ours to reformat: 201. Done so far: 23.
