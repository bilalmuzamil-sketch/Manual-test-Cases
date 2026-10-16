# SV-11324 — Tech View: run edge to edge on white, no side gutter

**Verdict: PASSED, 4 of 4.** Jira comment **78917**, 16 Oct 2026.

## Matrix
Tech View `table_tech_view` x 0 → window width at 1280/1440/1536/1920, white, no shadow/border; its 4 px corner radius
sits on the white `tech_view` wrapper, so no corner or panel is visible. Group header rows start at x 0.
Sideways scroll when wider than the window: default columns at 1024–1536, all columns at every width; no header label
clipped (from SV-11321's `h21.json`). List: staging = production at all four widths (x 30 → width−30, bg
rgb(249,250,251), radius 4). Status column widths = SV-11318. Film 28.1 → 23.9 s.

## Source currency
| Source | Version | Checked | Verdict |
|---|---|---|---|
| PRD page 845185030 | v64 | start + posting | CURRENT |
| Ticket | TESTING STAGE, Slavcho Mitrov, only Chris Ward 14 Oct comment | posting | CURRENT, no other tester |
| Build | staging v26.40.19-754919e (last-modified 16 Oct 20:22:02 GMT); production v26.40.19-d2441a9 for the List compare | start + posting | unchanged |

Measurement pass: `../scripts/p22.mjs` (staging + prod, 1280/1440/1536/1920) and `x22.mjs` (2x hover/rest shots) → `data/`.
Exhibits: `../build_exhibits_22_23_24.py`. Film: `../scripts/VR2x.mjs <n>`, anchored + `idle_cut_voiced.py`.
Pre-post gate passed (build, ticket, PRD v64, fingerprint, files); read-back PASSED panel first, image + video as attachments. No technical section.
