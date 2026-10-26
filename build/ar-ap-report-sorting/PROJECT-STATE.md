# A/R and A/P Report Sorting, Export and Location Filter — PROJECT STATE

## 22 Oct 2026 — intake
- QA lead, 22 Oct 2026: new suite; create the cases now; design and tech plan come later, then a full pass (edit/delete/add) and
  design cases that miss nothing (Rule 133).
- Epic **SV-11315** (25 tickets, `sources/JIRA-EPIC-SV-11315-2026-10-22.json`); stories SV-11531 to SV-11539 (Stories 1 to 9).
- PRD Confluence **947650561 version 5** (21 Oct 2026, Chris Ward). PO and design authority: **Chris Ward**.
- Design: https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4 — **not readable** (artifact not shared with this account, 22 Oct 2026).
- Tech plan: **not available yet** (QA lead will share).
- Project type: an upgrade of six existing reports (A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P Unpaid
  Invoices) — treated as type (ii) V2/upgrade from the PRD's own "What changes for existing users"; QA lead to confirm.
- TestRail: group **90418** (under 20434); sections created 22 Oct: S1 90419 … S9 90427, DATA 90428, REL 90429, DESIGN 90430
  (`sections.json`). No test run, no build yet.
- Drafting by worker: `WORKER-BRIEF.md`.

## 22 Oct 2026 — suite created, run 549
- Drafted by worker (257 cases, build.py 0 PROBLEM lines); my own independent check: 782 quotes word for word in the saved PRD v5 /
  Jira sources, steps = results, placeholders defined, one AUTOMATION line last, titles <= 80, design titles "Design: ".
- Rule 59 re-check before writing: PRD last modified 21 Oct 2026 (v5); all 25 epic tickets unchanged since 21 Oct 12:16.
- **257 cases created** in group 90418 (C715273-C715529 range; `testrail-id-map.csv`), each read back (`applied/create-log.jsonl`,
  257 x HTTP 200, read-back OK). Live count 257, all created by us, matches the map.
  S1 15 · S2 39 · S3 27 · S4 21 · S5 34 · S6 5 · S7 19 · S8 13 · S9 4 · DATA 21 · REL 10 · DESIGN 49.
- **Run 549** "A/R and A/P Report Sorting, Export and Location Filter - Execution", milestone 5, assigned to Bilal: 251 tests.
  Held out (waiting on Chris Ward's answers, join when acted on): S1-07 C715279, S2-35 C715322, DATA-13 C715462, DATA-14 C715463,
  DATA-15 C715464, REL-08 C715478. https://shopview.testrail.io/index.php?/runs/view/549
- Held markers: 6 on PO questions, 3 on test data (DATA-19 to DATA-21: exact 2,000/2,001 and 50,000/50,001 rows), 5 needing
  records/screenshots captured before the release is installed.
- PO question draft `PO-QUESTIONS-DRAFT.md` (18 questions for Chris Ward): NOT sent; asked the QA lead whether to put them in a new
  colour-coded sheet.
- Still to come: design (readable copy) and tech plan → full pass (Rules 120, 122, 124, 126, 130, 133). Findings for the QA lead:
  SV-11597 and SV-11600 are word-for-word the same developer task.

## 22 Oct 2026 — question sheet sent; export-limit answer
- QA lead: "Create the file the same you do and share it with Chris Ward with Editor rights" + asked whether the 2,000 / 50,000 test
  data is really needed and whether asking the developers would be authentic.
- Answer (record): the limits ARE PRD requirements (S3-N1 "Exactly 2,000 rows is allowed.", S3-N2 "Exactly 50,000 rows is allowed.",
  S3-R9, the error-message table). No request to the developers is needed: (1) the PDF 2,000 / 2,001 boundary is reachable on the
  QA organization (PRD: 13,540 open A/P lines) by ticking vendors whose lines add up to 2,000 — DATA-20 (C715469) rewritten that way;
  (2) the 2,000-customer Summary boundary (DATA-19, C715468) and the 50,000 / 50,001 CSV boundary (DATA-21, C715470) cannot be
  reached on any test site, and the developers already check the limits in their own verify tasks (SV-11595 "PDF over 2,000 rows and
  CSV over 50,000 are refused with exactly one message"; SV-11598 covers the Detail exports) — those two cases stay marked
  AUTOMATION: HOLD with that reason. Question 14 was dropped.
- Before sending, all 18 drafted questions were tested against skill 07 §6; 8 dropped as answerable by our own sources or
  self-service (authoring/po_questions.py DROPPED): first-column heading, groups' opening state, link wording, one-name chip,
  long-name chip, export-limit data, overpaid invoice (self-service setup), credit on the as-of date (out of scope → must not change).
- 41 cases updated (notes, markers, DATA-20 rewritten), each read back (applied/update-2026-10-22-log.jsonl). Run 549: C715462 and
  C715478 added (no longer held) → 253 tests; held out: C715279, C715322, C715463, C715464.
- Sheet https://docs.google.com/spreadsheets/d/11_3z_TpKkOL-MiAWqxrj1jlHP1rn9QXu_h3uCR0SjVA — 10 questions, same layout as the
  Splitting Sales Representatives sheet; shared with chris.w@shopview.com (Editor). Mapping: questions-2026-10-22/QUESTION-SHEET-2026-10-22.md.

## 22 Oct 2026 — design received; full pass started
- QA lead shared the design link with a share key: https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4?sk=… (readable now). Tech plan still
  missing. Saved: `design-2026-10-22/` (canvas.json, 7 boards, DESIGN-FIGURES-2026-10-22.json = 45 figures, 43 screenshots). The design
  is annotated before/after screenshots: production today vs "this build (round 13, 2026-10-19)".
- QA lead chose "Full pass now" (Rule 122 asked): drive the whole design, re-check all 257 cases, held design-version cases, new design
  cases (Rule 133), design questions into Chris's sheet in a new colour; a second full pass when the tech plan arrives. Worker brief:
  `design-2026-10-22/WORKER-BRIEF.md`.
- Incident: commit 256d8c4c7 pushed the design tool's runtime files, one of which (fast-edit-worker.js) bundles a private-key block
  (claude.ai's public viewer code, not a ShopView secret). Cause: the secret scan was piped into `tail`, so its failure did not stop
  the commit. Removed from the branch in f1d80b658 (.gitignore fixed). QA lead: leave history as is.
- Full pass against the design done by worker, reviewed by me (289 cases, 907 quotes verbatim, build 0 PROBLEM; text inventory 794 rows
  and visual inventory 97 rows, 0 unclassified; §6d checklist done): 257 existing cases updated (28 with result/step changes from the
  design, 228 navigation/labels from the pictures, every case gets a "References from Design" block), 32 new design cases D-50 to D-81
  (6 held design-version cases D-76 to D-81 out of the run). Pictures uploaded to each case under readable names (ar-ap-p<page>-<figure>.png).
- Design differences DD-01 to DD-05 → questions 11-15 added to Chris's sheet 22 Oct 2026 (rows 16-21, light green, colour guide E3);
  DD-06 = question 4 (today's A/R headings already use capitals, so its options (a) and (b) give the same headings).
- TestRail write done 22 Oct 2026 (applied/design-2026-10-22-log.jsonl): 257 updated + 32 added (C715532-C715563), all read back OK;
  555 pictures uploaded, attachments read back OK on all 259 cases with pictures. Run 549: 253 → 279 tests (26 new non-held design
  cases), none lost. Held out of run 549: C715279, C715322, C715463, C715464 (q1, q6, q9) and C715558-C715563 (q11-q15, q4).
- 22 Oct 2026 tech-plan pass applied (Rule 134; tech-plan-pass-2026-10-22/PASS-REPORT.md, per-part record per case): plan (21 Oct,
  against PRD v4) read in full. 259 confirmed, 30 updated (incl. C715279 S1-07 released: plan D4 gives the accent tie order; question 1
  stays open and Chris's answer wins), 0 retired, 12 new C715573-C715584 (S1-16 C715573 held on question 16). All read back OK; 24
  pictures uploaded. Run 549: 279 → 291 (11 new + C715279), none lost. Question 16 added to sheet rows 22-23 (light orange, F3).
  For the QA lead: the plan says the developers will add 7 cases and edit C27260-C27264, C26553-C26560, C29451 (not ours; C26553-C26560
  describe the reports as gated by the A/R and A/P permissions, which the plan says is wrong). Not touched.
- 22 Oct 2026 one action per step (QA lead "Yes, fix all 113 cases"; Rule 135): 92 cases rewritten (steps 550 → 698; 6 filler
  "Look across the page again." steps removed from D-03/06/09/12/15/18), all read back OK (applied/onestep-2026-10-22-log.jsonl); run 549
  unchanged (291). Over-10-step cases kept whole and asked (Rule 127): S3-01, S3-02, S5-10, S5-11, S5-20, REL-12. The build's over-10
  check now prints OVER-TARGET instead of PROBLEM (Rule 127: ask, not fail).
- 22 Oct 2026 Rule 136 pass applied (rule136-2026-10-22/): 42 cases split into 96 (54 new C715585-C715638 range, see map), 146 shortened,
  steps 1,734 → 1,438; 20 cases fixed that quoted PRD Change Log rows instead of the requirement (parser fix; all 771 requirement quotes
  now match their requirement line). 204 updated + 54 added, all read back OK; 98 pictures uploaded. Run 549: 291 → 345, none lost.

## 26 Oct 2026 — Chris Ward answered all 16 questions; PRD v9; full pass (QA lead chose "Full pass")
- Answers saved verbatim: questions-2026-10-22/chris-answers-2026-10-26.json (row 17's text repeats question 14; PRD v9 S5-R13
  settles question 12). PRD v9 (23 Oct 2026) saved and diffed: 15 requirements changed, 4 new (S2-R4a, S3-R8b, S5-R18a, S5-R18b).
- Deleted with the QA lead's go-ahead (snapshots in v9-pass-2026-10-26/deleted/): C715558–C715562 (design versions that lost, q11–15).
- Applied (applied/v9-2026-10-26-log.jsonl): 350 updated (176 rewritten top to bottom, 174 From-line v9 re-stamps), 7 new
  (C797940–C797946: S2-40, S2-41, S2-42, S5-39, S7-20, DATA-23, DATA-24), every read-back equal; 25 pictures uploaded, all read back.
- Released into run 549: C715322 (S2-35), C715463 (DATA-14), C715464 (DATA-15), C715573 (S1-16), C715563 (D-81).
  Run 549: 345 → 357 = every case of the suite (union, nothing lost).
- Stories SV-11531…SV-11539 re-read 26 Oct (6 updated 23 Oct): requirement lines match v9 except SV-11538 "Transaction type"
  (PRD: "Transaction Type"; PRD wins, answer 10). Saved: sources/JIRA-SV-11315-stories-2026-10-26.md.
- Expected build differences (no ticket numbers yet): same-day order by time (S1-10, S1-11); "Switch Location" capital L (S7-03, S7-04,
  D-39, D-40, D-64); punctuation name order (S1-16); export Locations tick order (S3-17). S5-39 needs an org with ≤ 8 vendors.
- 26 Oct 2026, QA lead: ticket numbers for the build differences → ask Chris on his sheet, tagged. Done: question 17 (rows 24-25, light
  purple, colour guide G3, person chip for chris.w@shopview.com) asks for tickets for (1) same-day order by time (C715282, C715283),
  (2) "Switch Location" capital L (C715416, C715417, C715519, C715520, C715546), (3) punctuation order (C715573), (4) export
  Locations tick order (C715343). Jira searched 26 Oct: no ticket for any of the four.
- 26 Oct 2026: the ≤ 8-vendor organization for C797943 (S5-39) is the tester's precondition (already written so); no reminder to the QA lead.
