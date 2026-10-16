# SV-11322 — Switcher tooltip covers the column header row

**Verdict: PASSED, 4 of 4.** Jira comment **78915**, 16 Oct 2026.

## Matrix (18 cells, all observed)
3 views (List, Tech View, Board View) × 3 buttons × 2 widths (1440, 1536): every tooltip ends at y 78 px, the
switcher buttons start at y 86 px, header row at 140 px (List/Tech View) / column headers at 161 px (Board View).
Texts exactly "List", "Tech View", "Board View". Film 43.5 → 32.8 s.

## Source currency
| Source | Version | Checked | Verdict |
|---|---|---|---|
| PRD page 845185030 | v64 | start + posting | CURRENT |
| Ticket | TESTING STAGE, Slavcho Mitrov, only Chris Ward 14 Oct comment | posting | CURRENT, no other tester |
| Build | staging v26.40.19-754919e (last-modified 16 Oct 20:22:02 GMT); production v26.40.19-d2441a9 for the List compare | start + posting | unchanged |

Measurement pass: `../scripts/p22.mjs` (staging + prod, 1280/1440/1536/1920) and `x22.mjs` (2x hover/rest shots) → `data/`.
Exhibits: `../build_exhibits_22_23_24.py`. Film: `../scripts/VR2x.mjs <n>`, anchored + `idle_cut_voiced.py`.
Pre-post gate passed (build, ticket, PRD v64, fingerprint, files); read-back PASSED panel first, image + video as attachments. No technical section.
