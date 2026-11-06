# SV-7898 — note photo upload (take photo) — FINDINGS (2026-11-06)

Branch https://sv7898.qa.shopview.com build v26.45.1-a5c66b3 (last-modified Thu 05 Nov 2026 10:26:11 GMT). Production v26.45.1-753355c (test org, WO S2-1926). Branch WO S2-4219 (04ab678b…).
Mode: API mode / unattended — no recording, no technical section. No Powertools plan (QA Test Plan empty); the developer's test plan is in PR #4134 (ShopView/shopview), read in full. QA assignee was empty, labels bug-report + source-intercom.
Device: Playwright "iPhone 12 Pro" preset, Chrome for Testing 153.0.8010.12. Photo = 4032x3024 JPEG 1.45 MB named image.jpg (iOS "Take Photo" hands the app a JPEG; no physical phone available).
Harness disclosure: QA branches redirect to "QA env is sleeping" on any Network Error (bundle: `ef==="qa"` + setTimeout(window.location.href=…)); that timer was suppressed by an init script in the test browser. Failures made with Playwright route abort/fulfil, CDP throttling, context offline.

## Matrix (branch) — every row confirmed with the server note's own attachments
| scenario | result |
|---|---|
| paperclip / card / New Note upload, connection drop | banner "1 file wasn't attached…" + Retry/Discard, one toast; Retry 201 attaches, survives reload |
| Discard | banner gone, note kept, 0 attachments |
| 503 on upload | hedged "may not have been attached" banner; Retry works |
| 400/403/404/413 | one clear message each, nothing kept |
| paperclip create abort / 503 | "The note may not have been created…" toast with Retry; Retry -> create 201 + upload 201 |
| paperclip offline after pick | "No note was created… tap Retry" toast; Retry after reconnect works |
| card offline after pick | banner, Retry works |
| slow 40 KB/s | "Uploading 1 file… 20% / 47% / 54%", then "Saving 1 file…" |
| held request (no progress) | aborted at exactly +30.0 s, "Upload stalled…", Retry works |
| 150 s latency (all bytes sent, no answer) | aborted at ~120 s, "may not have been attached" banner, Retry works |
| logout -> login without reload | banner cleared (same page proven by window marker) |
| **New Note window: photo attached, offline, Save** | **FAIL: Save spins 3 min, no message/banner/Retry; saves after reconnect. Branch 3/3 (6 s, 180 s, 180 s), production 2/2 (180 s). PR test plan step 1 expects toast + banner.** |

Production before: paperclip/card/new note drop -> "Network Error" (+ "Error uploading attachments" / "Your note was saved, but its files weren't attached…"), empty note with 0 attachments, no Retry; 503 -> "Ooooops! An error occurred".

## Posted
Comment 80286 (WHAT PASSED, 15 rows, exh-1 + exh-2) and 80287 (PARTIALLY PASSED, failure + exh-3). Read back: order ok, 3 media, 15 rows.
QA Assignee set to Bilal (was empty); moved to REJECTED FROM TESTING (transition 15).

## Pre-post gate
Build markers re-read at post time (branch v26.45.1-a5c66b3, prod v26.45.1-753355c) = as tested. Ticket re-read: TESTING QA, only Ammar's 14 Oct comment. Fingerprint scan clean. Images attached as Jira media and read back.

## Test data left on the branch/prod (no cleanup by rule)
Many "_files_" notes and ZZAUTOTEST SV7898 notes on S2-4219 (branch) and S2-1926 (production).

Learning check: playbook gets the QA-branch sleep-redirect note and the notes endpoints.
