# Global Search — SOURCE CURRENCY (read 2026-09-07)

| Source | Identifier | Version / last updated | Date checked | Verdict |
|---|---|---|---|---|
| Specification | Confluence page **576978945** | **v1.4**, Last Updated 2026-09-04, author Branko Cicovic | 2026-09-07 | **MOVED** — we held v1.3 (2026-09-02). v1.3→v1.4 diff in `SPEC-DIFF-2026-09-07.md` (5 deltas). |
| Epic + stories | **SV-9160** | 25 children (parent= query, no page remainder), epic updated 2026-09-02; SV-9167 telemetry = **Blocked** | 2026-09-07 | CURRENT — consistent with v1.4; child count 26→25 (one removed), no new requirement beyond v1.4. |
| Designs | Claude Design share links in the spec header (`fac6efcf-…` global-search / Global Search Page / Mobile) | **undated, editable share links** | 2026-09-07 | PARTIAL — an undated share link cannot be dated (skill 02); spec v1.4 is explicit on the changed behaviour, so cases follow the spec (Rule 57). Behavioural source `global-search.jsx` held from 2026-09-02. |
| Tech plan | Unified Search Framework tech plan (held) | 2026-08 | 2026-09-07 | reference only (Rule 30, informs not overrules); no contradiction with v1.4 acted on. |
| PO / Slack answers | Branko (designer+PO), Milos (PO); 2 Slack threads held from 2026-09-02 | 2026-09-02 | 2026-09-07 | v1.4 (2026-09-04) is newer than the Slack threads; where they conflict (Show-all hand-off R5; Assets no-Show-all R6) the spec v1.4 wins (latest) and the reversal is disclosed + raised (PO-GS-ASSET-SHOWALL). |

**Sources read at pass start: 2026-09-07T~19:2x UTC** (Confluence v1.4, epic SV-9160, census live).
**Re-read at write start: 2026-09-07T~19:4x UTC** — Confluence 576978945 re-fetched immediately before
the write pass; **still v1.4, Last Updated 2026-09-04, unchanged** (Rule 59 second-read verdict: no
movement between pass start and write start).

**Verdict:** the suite was **STALE by one spec version** (v1.3 → v1.4) and is brought current this pass:
10 cases rewritten to v1.4 + 1 new case (count-cap) + provenance re-stamped v1.3→v1.4 on the whole
suite. No QA build exists (Rule 85) — the suite remains SOURCE-VERIFIED ONLY; every case keeps
`AUTOMATION: Not available on Build to test Yet`.
