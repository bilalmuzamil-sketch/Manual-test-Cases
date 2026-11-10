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

## 26 Oct 2026 — Preconditions rewritten as a scenario (Rule 117 thirteenth amendment), DRAFT
- All 357 cases: a hand-written "Scenario:" line now opens the Preconditions (`authoring/scenarios.py`, attached by `ar_lib.C()` by key,
  rendered first; `build.py` gates it: exactly one, first, ≤ 40 words, no requirement code, placeholder, "QA lead" or "ask your").
- Standard Admin line reworded to "You are an Admin user (the "Admin" role) working at {Location-A}, your current location."; S5-39's
  organization moved into its own bullet ("Your organization has 8 vendors or fewer in total."). No other precondition changed.
- Every other field byte-identical to before (`scenario-preconditions-2026-10-26/make_pass_report.py`, PASS-REPORT.md). Setup file
  regenerated. Not written to TestRail (needs the QA lead's go-ahead, together with the v9 pass).
- 26 Oct 2026: Rule 117 thirteenth amendment (QA lead: "Preconditions should be like a scenario") applied to every case of this suite: one "Scenario:" line first, then what must exist in setup order; only custom_preconds changed (script-checked), every case updated in TestRail with an edit lock and read back clean.

## 26 Oct 2026 — every case in the QA lead's own pattern (Rule 117 fourteenth amendment), DRAFT
- Worker brief `build/pattern-format-2026-10-26/WORKER-BRIEF.md`. All 357 cases rendered in the pattern: plain Preconditions bullets in setup
  order (no Scenario line, placeholder, "For example:" line or setup-file link; records named "customer A", "location B", "date A"; Blocked line
  last, reworded "If you cannot set up any of the above, ..."), Steps, "Expected Result" with "Step N:" and one bullet per fact, `<p></p>`, then
  the note / quotes / design / AUTOMATION block byte-identical to before.
- How: `authoring/pattern.py` (mechanical conversion of the case model) + `authoring/pattern_layout.py` (47 cases corrected by hand after reading
  every converted case; RES_SPLIT for shared multi-fact sentences). `ar_lib.render` uses it; `build.py` PATTERN GATE replaced the Scenario gate
  (0 PROBLEM lines). The case model and the setup file keep the placeholders and examples; the setup file maps each placeholder to its plain name.
- Proof: `pattern-format-2026-10-26/PASS-REPORT.md` (make_pass_report.py): byte identity below the blank line PASS 357/357, no fact lost PASS
  357/357; example values kept as facts where a result depends on them (S1-01 to S1-04 and S1-07 names, S2-23 due days, S5-38 and DATA-16/17
  amounts). Before-state: `pattern-format-2026-10-26/proposals-before.json`. Not written to TestRail (needs the QA lead's go-ahead).
- Same day, relevance and independence pass (coordinator notes; QA lead: preconditions "must make sense and relate to the steps and expected
  results", "if one test case fails that does not block the other test case"): pattern.relate() + pattern_layout (TWO_LOC reasons, EXACT,
  PRE_ADD, hand corrections). Records the steps never name are unnamed ("a customer", "your current location"); unneeded two-location blocks,
  long-name customers, second buckets and enrolment lines removed; reasons ("so ...") added where a record is needed but not named; 26 cases that
  add up or change their records now create them "for this test"; D-33, D-34, D-56, D-59 gained the two-location data their results need.
  Notes of S1-16, S3-17, S5-18 now use plain names. Permanent gate in build.py (relevance, no case key or C-id, changed/summed records created
  for this test): 0 PROBLEM lines. Per-case list in pattern-format-2026-10-26/PASS-REPORT.md.

## 26 Oct 2026 — tester read-through (QA lead "GO"; brief build/tester-readthrough-2026-10-26/WORKER-BRIEF.md), DRAFT
- All 356 remaining cases read as a manual tester would (title, preconditions, steps, results, notes; design cases with their quotes and design
  words). Report: `build/tester-readthrough-2026-10-26/ar-ap-report-sorting/READTHROUGH-REPORT.md` (reading coverage, per-case checks 1-8,
  old vs new for every case, the two lists, enrolment findings). Nothing written to TestRail, Jira, Slack or Google; nothing committed.
- DATA-21 (C715470, deleted from TestRail today by the coordinator on the QA lead's order) removed from the library: cases_data.py (the
  counter still steps past it, so DATA-22 onwards keep their keys), scenarios.py, pattern_layout.py, tech_plan.py (TP-06, TP-10, TP-45).
  `ar_lib.DELETED` records it; S3-N2, UFS-2 and OOS-1 (covered only by it) read "No manual case: deleted 26 Oct 2026 on the QA lead's order
  (a manual tester cannot set it up); left to the developers' own checks" in REPORT.md; S3-N3 and S3-R9 stay covered by DATA-18 to DATA-20.
- Rule 117 fifteenth amendment applied: the "If you cannot set up any of the above, mark this test Blocked" line is gone from every case and
  from the setup file (its large-data procedure also no longer says "mark Blocked" or "ask the user"); DATA-13's note variant removed and
  DATA-20's note no longer says "tell the QA lead". build.py fails on the line or any variant in any case field, note or the setup file.
- Read-through corrections (180 cases): new layer `authoring/readthrough_layout.py` (applied after the relevance pass) plus model edits:
  "Make sure the report has open documents" replaced by what to have and why; vague words made concrete ("native", "looks as described",
  "as in the layout being checked", "The header shows it", "Rule 96/136" in notes); design titles made concrete; enrolment line kept only in
  22 cases whose steps need it (PRD v9: organization-wide), removed in 62; the unused "current location" clause removed; S3-26/S3-27 gain a
  retry step; S7-05/S7-20 move "note the rows" into the preconditions; S7-12 reordered; S8-07/S8-07b gain a control step with a new PRD v9
  S3-R3 quote (their only quotes-block change; refs SV-11533,SV-11538). New permanent gates in build.py: Blocked line, deleted case,
  vague words, enrolment. build.py: 0 PROBLEM lines. check_tail_identity.py: 354 byte-identical, 2 changed only by the added quote.
- Not done in this pass: lines 3,359-9,356 of pattern-format-2026-10-26/PASS-REPORT.md were not read line by line (session context limit);
  their new text was verified by script equal to the TestRail read-back (237/237), which was read in full. Needs the QA lead's go-ahead
  before any TestRail write (Rules 6, 123).
- 4 Nov 2026: QA lead ordered the project's execution run (in milestone 5) deleted: run deleted (record build/milestone-5-2026-11-03/). The cases are unchanged.
- 4 Nov 2026 (QA lead "Yes, named sets"): applied from build/answers-2026-11-04/ (lock held, read back): 9 cases given AUTOMATION: READY - EXPECT FAIL (SV-12138..SV-12141) with the Rule 61 block.
- 4 Nov 2026 (QA lead "Yes, create it"): run 557 "A/R and A/P Report Sorting, Export and Location Filter - Execution" created for build verification before the 19 Nov 2026 release: 356 tests = all mapped cases, milestone 5, assigned to Mudassir (user 6), description starts "Owner: Mudassir." (applied-run-2026-11-04.json). Tickets swept 4 Nov: SV-12136 (Mudassir, A/P Aging Open Balance a few cents above Amount; staging and sv10647) is a defect from execution, not a spec change.

## 10 Nov 2026 — V1 currency check against PRD v11 (5 Nov), Jira (26 tickets) and the 5 Nov design
- QA lead: "Source verify them" (section 90418); chose V1 (Rule 125). Assessment: `currency-2026-11-10/ASSESSMENT.md` — 224 confirmed,
  131 change, 1 retire (REL-08 C715478, S1-R5a / SV-11441), 25 new. Live vs library: 9 cases differ, all our 4 Nov expect-fail lines.
  QA build now exists: sv11315.qa.shopview.com, v26.45.2-6a8b89c.
- QA lead's decisions (10 Nov, all as recommended): "Named set" (rewrite the 132, stamp-only on the 224 after reading each in full);
  "Yes, both" (delete REL-08, add the 25 new cases to TestRail and run 557); "Yes, add Q1 only" (PDF "As of" date format, to the
  existing sheet in a new colour; its one case held); "Remove old, add later" (the 3 re-shot design pictures cannot be downloaded:
  remove the old ones from the cases, quote the new captions, attach the new pictures when available).
- Round 2 drafting with the worker; TestRail writes by the coordinator after the gates.
- Round 2 drafted 10 Nov 2026 (worker; nothing written to TestRail/Jira/Google, nothing committed): `currency-2026-11-10/PASS-REPORT.md`.
  Library 380 cases: 133 CHANGE, 222 stamp-only, 25 new (no C-id yet), REL-08 C715478 proposed for deletion. Marker: Rule 69
  "Not available on Build to test Yet - Last checked 11/10/2026" (356); expect-fail 9, release-day HOLD 13, DATA-19 HOLD, S3-32 held
  on question 18. Gates: build.py 0 PROBLEM; readiness 0 hard; ticket_sweep 0 unhandled (PRD 11; ledger 26 tickets, refreshed by
  `currency-2026-11-10/scripts/ledger_update.py`; render_outputs.py no longer overwrites the ledger once the PRD handled is above 9).
  Dry-run write scripts in `currency-2026-11-10/write/` (update, create, delete REL-08, run 557 union sync, 46 old picture attachments).
  Question 18 row text in PASS-REPORT section 7; question 18 is on Chris Ward's sheet (rows 26-27, light pink, added by the coordinator
  10 Nov 2026) and in build/PO-QUESTIONS-OPEN.md, unanswered; S3-32 held on it.

## 10 Nov 2026 — written to TestRail (named set, PRD v11)
- 355 cases updated (133 rewritten, 222 source/build lines only), every one read back, 0 skipped by the edit lock. 25 new cases
  C1062566-C1062590. REL-08 C715478 deleted (copy `currency-2026-11-10/applied/C715478-before-delete.json`). Live: 380 cases in 90418,
  all ours, all citing PRD v11. Run 557: 379 tests, all assigned to Mudassir; S3-32 C1062581 held out (question 18).
- The 3 outdated design pictures could NOT be removed from the 46 cases: TestRail answers "Attachment can't be deleted or replaced as
  the file is attached to a closed/archived run." The case text no longer names them (References from Design quotes the 5 Nov captions).
- Question 18 added to Chris Ward's sheet (rows 26-27, light pink). Production capture list for Mudassir:
  `release-2026-11-19/PRODUCTION-PREP-FOR-MUDASSIR.md`. Build-verification list: `build/BUILD-VERIFICATION-LIST-AR-AP-2026-11-10.md`.
- Round 3 (10 Nov 2026): the 46 old picture attachments cannot be deleted (TestRail: "attached to a closed/archived run"); permanent.
  The QA lead sent the 3 re-shot pictures; copied to `currency-2026-11-10/design-2026-11-05/images/*-reshot-2026-11-05.png`. Library:
  the 46 cases list the new picture and tell the tester not to use the old one (References from Design only, plus the "open the design picture" precondition back on D-63, D-68, D-73; D-04 also prints DD-07).
  Dry runs `currency-2026-11-10/write/update_refs.py` (locked on the live text round 2 wrote) and `write/attach_reshot.py`.
- 10 Nov 2026: 46 cases point to the 3 re-shot pictures (sent by the QA lead); new pictures attached, old ones stay (TestRail refuses).
  Folder "Waiting on Chris Ward's answers" 133627 under 90418: S3-32 C1062581 moved (question 18). Chris's sheet checked 10 Nov: 1-17
  answered and applied, 18 open (E27 empty).
- 10 Nov 2026: Chris Ward on vacation for a week. QA lead: S3-32 C1062581 released without the PDF "As of" line (checks the document
  dates only; the As-of check is added when question 18 is answered) — back in S3 (90421), in run 557 (now 380 tests, all Mudassir).
  The 13 release-day cases moved to folder "Run on Production After Release" 133628 (REL-01, -02, -05, -05b, -05c, -06, -10, -11, -12,
  -12b, -12c, -13, -14). Folder "Waiting on Chris Ward's answers" 133627 is now empty (kept for future waiting cases).
- 10 Nov 2026 (17:57-18:10 UTC, production v26.45.3-fc08f23): before-release captures done by Mudassir's side, saved on branch
  claude/global-search-v1-baseline-6ax9ul, folder build/ar-ap-report-sorting/release-2026-11-19/"A-R A-P before release 2026-11-19"
  (74 files, all 8 tasks; README + NOTES per task; RE-CHECK-AFTER-RELEASE.md). Credit memo CM1-4411 ($5.00, 18 Nov 2026, customer
  "ZZAUTOTEST SV11744 Q3") must not be touched before the after-release check (C1062590). Found: Sales By Customer has a date range and
  four downloads (Download Summary/Expanded View, PDF/CSV), not "Download (PDF)/(CSV)" (affects C715617, C715476); the production user
  could switch to only one location (affects C715480); A/R Detail has no customer filter before the release (C1062590 fine: it ticks the
  customer after the release); offline CSV export on Sales By Customer showed "Network Error" plus "This report is too large to export.
  Narrow the date range or filters, then try again." (the second is misleading; existing production behaviour, not ours to file).
- 10 Nov 2026, QA lead: C715617 and C715476 keep their wording ("Leave as is"; the tester picks the right Sales By Customer download).
  C715480: "Re-capture" — Mudassir enrols the user at a second location and retakes the switcher screenshot by 18 Nov (added to the
  prep file); no case change.
