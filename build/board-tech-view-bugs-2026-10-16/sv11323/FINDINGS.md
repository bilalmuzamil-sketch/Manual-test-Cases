# SV-11323 — Board View: run full width, no grey rounded panel

**Verdict: PASSED, 3 of 3.** Jira comment **78916**, 16 Oct 2026.

## Matrix (4 widths)
`board_view` spans 0 → window width at 1280/1440/1536/1920; background transparent, radius 0, no shadow, no border,
padding 8 px each side; first column panel (`.board-column__panel`, 1 px border, radius 12) at x 16 px — design
attachment's first column also starts at 16 px (pixels read). The 17 px first reported was the header inside the card;
corrected in picture, comment and film before posting. Film re-recorded: 23.1 → 21.8 s.

## Source currency
| Source | Version | Checked | Verdict |
|---|---|---|---|
| PRD page 845185030 | v64 | start + posting | CURRENT |
| Ticket | TESTING STAGE, Slavcho Mitrov, only Chris Ward 14 Oct comment | posting | CURRENT, no other tester |
| Build | staging v26.40.19-754919e (last-modified 16 Oct 20:22:02 GMT); production v26.40.19-d2441a9 for the List compare | start + posting | unchanged |

Measurement pass: `../scripts/p22.mjs` (staging + prod, 1280/1440/1536/1920) and `x22.mjs` (2x hover/rest shots) → `data/`.
Exhibits: `../build_exhibits_22_23_24.py`. Film: `../scripts/VR2x.mjs <n>`, anchored + `idle_cut_voiced.py`.
Pre-post gate passed (build, ticket, PRD v64, fingerprint, files); read-back PASSED panel first, image + video as attachments. No technical section.
