# SV-11326 split → SV-11575 (20 Oct 2026)

**Why:** Chris answered both questions in SV-11326 comment 79135 (option A for both) and wrote them into the PRD
(Confluence 845185030, **v69**, 15:31:32 UTC): S1-R15 (deactivated leads with a column are listed, after active,
grey "Inactive") and new S1-R15c (50-value message only when a tick would exceed 50; never on open, never at ≤50).
QA lead: create a new ticket, same parent, split line at the top, tag Slavcho + Chris, assign Slavcho.

**Live re-check immediately before filing** (`/tmp/qa11310/capq2.mjs board_view recheck`, staging
v26.40.20-0509710, last-modified 14:23:34 GMT, etag 06a9cd71…):
- Darrell Martinez column: "DM / Darrell Martinez / Inactive / 113 work orders".
- Search "Darrell" → only "Darrell Thomas". 328 options, 0 inactive listed; last three ZZOLD Esther Howard / Jenny Wilson / Ralph Edwards.
- 0 ticked → red 50-value message shows; after 1 tick → still shows, tick applied.
- Tech View: same (tvq.mjs, earlier the same build).
- Prefs and location restored by the script.

**Duplicate search:** JQL project=SV, last 3 days, text ~ Inactive / 50-value / deactivated → nothing relevant (only SV-11479, unrelated).

**Ticket:** [SV-11575](https://shopview.atlassian.net/browse/SV-11575), "Technician filter: inactive techs missing,
50-value warning shows too early" (75 chars). Bug · parent SV-10043 (same as SV-11326, which has no story link) ·
Medium · Product Area Work Orders (10120) · labels QA_Validation_Required, board-tech-view · assignee Slavcho Mitrov ·
mentions Slavcho + Chris · Relates SV-11326. Two attachments (01-deactivated-tech-missing.png 660x1259 shown,
02-limit-message-before-any-tick.png 640x740 shown), description re-PUT after upload (204). Read back: all fields as
sent, both images are file attachments, step list one list of 9, mentions render.
**Pointer comment** on SV-11326: 79138 (tags Chris + Slavcho, links SV-11575).

## TestRail (QA lead: "add the result in those test case runs and mark them as passed")
Read before writing: both tests already had a Passed result added **2026-10-20T15:48:36Z (10:48 CDT)** under our shared
account (user 3), with exhibits — SV-11119 test 4062446 result 530478, SV-11326 test 3995736 result 530477, both
on build v26.40.20-0509710. That was not done by this session; so **no new result was added** (a second identical
Passed result would only duplicate it). Nothing written to TestRail in this step.

## Ticket state, re-read live 15:52 UTC
All six Done; each one's newest verdict comment is PASSED: SV-11541 79105, SV-11498 79108, SV-11454 79109,
SV-11422 79136 (78952/79031 PARTIALLY PASSED kept as history), SV-11326 79132 (then 79133 questions, 79135 Chris,
79138 pointer), SV-11119 79134 (78986 FAILED kept as history).

Pre-post gate: build marker re-read unchanged before filing; ticket and Chris comment re-read; images read back as
attachments; voice scan clean; priority Medium; no technical section. Learning check: one new item — check a test's
result history before logging a result the QA lead asked for (it may already be there) → LESSONS-INDEX.
