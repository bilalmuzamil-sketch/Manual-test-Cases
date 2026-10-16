# SV-11338 — Tech/Board View header avatars solid blue instead of grey initials — staging retest, 16 Oct 2026

**Ticket:** [SV-11338](https://shopview.atlassian.net/browse/SV-11338) — Story Defect, parent SV-10045, TESTING STAGE, assignee Slavcho Mitrov, reporter Ahtasham Amjad. No comments before ours → not tested by anyone else.
**Builds:** measured first on staging v26.40.19-1493c63; **staging redeployed mid-pass at 20:22:02 GMT to v26.40.19-754919e** (caught by the recording caption) → every check re-run on 754919e; results identical. Exhibit and recording are both on 754919e.
**Source:** PRD v62 → v63 (20:17Z; v63 only adds S3-E2 board scrollbar — S2-R23, S6-R4, S6-R2a, S2-R22, S2-R19 verified word-identical). S2-R23: "a technician avatar without a photo is a light-grey circle (--sv-grey-100, #EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode … dark mode uses the design's dark colors; group and column header names are 14px, weight 600, in the design's slate text color (#364152)".

## Matrix (754919e)
| Surface | Population | Result |
|---|---|---|
| Tech View group headers, Compact/Regular/Comfortable | 67 headers each | #EEF2F6 / #4B5565 all; name 14px/600/#364152; avatar 24/28/36 px (density sizing now present — SV-11397 area) |
| Board View column headers, 3 densities | 272 unique columns | 266 initials #EEF2F6/#4B5565, 6 photos (Teresa Smith + 5 ZZAUTOTEST photo techs); name 14px/600/#364152; avatar 28 px |
| Reassign lead technician dialog (Approved card S2-33043) | 261 avatars | 255 initials #EEF2F6/#4B5565, 6 photos |
| Dark theme: Tech headers / Board headers / dialog | 67 / 13 visible / 255 | #3A404B circle, #A9B1BE initials (≈4.8:1), name #E6E9EF; never blue. Exact design dark values not in the spec — stated in comment. |
On 1493c63 the only difference was Tech View header avatars at 28 px for every density.
Theme restored to Light, density to Regular. Nothing seeded; reassign dialog closed without saving.

**Verdict: PASSED** (5/5).

## Recording
`ev/sv11338-header-avatars-staging-recording-voiceover.mp4` — 45.9 s, 5 voice lines anchored to caption-change times detected in the raw film (wall clock drifts 1.3–3 s on this board). Captions verified at each onset (`voiceover/capstrip.png`); speech −20.4 to −23.1 dB; decode OK.

## Pre-post gate
Build re-read (754919e, 20:22:02 GMT); ticket re-read (TESTING STAGE, 0 comments); PRD v63 diffed (no change to our rules → comment cites v63); voice scan clean; no technical section.

## Posted
Comment **78906**; attachments 62479 (exhibit), 62480 (recording). Read back: panel first, image file 1110x1580, table 6 rows, 1 quote, 5 steps, mp4 last.
