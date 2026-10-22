# Running notes — design full pass (22 Oct 2026, worker)

Restart-safe log. Each step appends what was done and where its output is.

## Step 0 — started
- Brief read in full (WORKER-BRIEF.md, 76 lines).
- Read in full: LESSONS-REGISTER (L-01..L-05), skill 21 (whole), Rules 113-133 (RULES-61-96.md lines 2391-3438), IDEAL-TEST-CASE-STANDARD.
- PRD v5 read in full (447 lines, 49,125 bytes).
- Design boards read in full: canvas.json (118 lines), Main/Export/Grouped/Location/Links/Layout/Filters .dc.html (57-77 lines each),
  DESIGN-FIGURES json (45 figures, 43 unique images; 6e4079.. used on Main+Filters, 99736a.. on Grouped+Filters).
- Early candidate differences from captions (to confirm on images): fig32 "Switch Location" (capital L) vs PRD "Switch location";
  fig11 alt "Search vendor" vs PRD "Search vendors"; board-3 h2 "Collapse all, Expand all and pinned group rows" vs page name
  "3 Collapse all and pinned group rows"; fig12 customer menu shows "2 selected" + tags (PRD S5-R13 silent on count).
- Transcribing images into TRANSCRIPTS.md (I01 done).
- DIFF candidate: I15 same-date rows in CMLZ group not in number order (PRD S1-R6 ties by document number, S2-R4).
- DIFF candidates: I29 button 'Switch Location' (capital L) vs PRD 'Switch location'; I29 extra '×' close icon not in PRD's button list.
- DIFF candidate (look): Totals row background grey band on I14,I15,I16,I23,I25,I32 but page colour on I03,I04,I10,I19,I28,I30 (I30 vs I32 same screen).
- DIFF candidate: I34 Location menu lists the unticked location before the ticked one (PRD S5-R2 ticked ones first).
- DIFF candidate: I35 empty state with No locations still draws 'Totals $0.00 $0.00' (PRD S5-R6a: no totals).
- DIFF candidate: I40 vendor search placeholder 'Search vendor' vs PRD S5-R13 'Search vendors'.
- ALL 43 images viewed and transcribed (TRANSCRIPTS.md, I01-I43). OCR in ocr/ for cross-check.
- More DIFF candidates: Location chip "All locations" drawn in blue (active) while Customer/Past due rest grey (PRD silent -> design look);
  Totals row shows "$0.00" for empty buckets (rows blank); vendor menu list not A-Z (native); chip with one name keeps prefix
  ("Customer: 10 Trucking", "Location: Staging Lethbri...").
- Read: SKILL.md (145 lines), thumbnail.json, reference/*.md (9 files, all lines), google-fonts json (by script: font-name lists +
  gzip licence blob), index.html (983 lines, viewer loader) — none holds ShopView content.
- DS library read: components.css (627 lines: all comments + every section), colors_and_type.css/tokens.css/tokens.json (values; comments
  extracted). Library always/never sentences listed for the visual inventory. Library styles are NOT what the report screenshots are built
  from (PRD reuse rule: native report components); in scope only where the design names them (hourglass icon, chevron, link colour,
  totals row, chips).
- Look finds: links drawn REGULAR weight (PRD S7-R7 says semi-bold) -> question; sort marker small dark triangle.
- NEXT: study authoring library (ar_lib.py, common.py, build.py, cases_*.py) then inventories, register, cases.
- All case files read (s1..s9, data, rel, design; ar_lib, common, build, po_questions, render_*).
- DECISIONS so far:
  * Differences to ask (new Q11-Q15): dialog wording/order/x (I29); "Search vendor" (I40); Totals $0.00 with No locations (I35);
    same-day order on A/R Collection (I15); link weight regular vs semi-bold (all link pictures). Held design-version cases for each,
    plus one for A/R heading capitals held on existing Q4.
  * Dropped (own sources answer): Totals band look (PRD S8-R4: native style, compare with Sales By Customer); Location menu order while
    open (PRD "ticked first" + picture of an open menu do not conflict; case closes and reopens); chip prefix with one name (design shows it;
    PRD native chip); Customer menu "N selected"/tags (PRD: exactly as Sales By Customer).
  * Q4 (sent): design production pictures show today's A/R headings already Title Case -> options (a)/(b) coincide; tell QA lead.
  * Navigation: on screen the reports sit under Reports > left menu ACCOUNTS RECEIVABLE / ACCOUNTS PAYABLE ("A/R Aging Summary" ...);
    PRD says "Reports > Finance" -> START and steps updated to on-screen labels.
- PLAN: authoring/design_data.py (figures, report map, diffs, silent list) -> ar_lib design_block structured; ui() nav transform;
  new D-50..D-75 picture cases; held D-76..D-81; NEW-QUESTIONS.py; inventories; register; checklist; reading record; PASS-REPORT.
- DONE: authoring/design_data.py (figures, I-ids, report per picture, DIFFS DD-01..06, RULED DR-01..05, SILENT list);
  ar_lib: structured "References from Design" (pictures, captions, board titles, differences, design notes), ui() navigation
  transform (Reports > Finance -> on-screen left-menu labels), DESIGN_HOLD marker; wording fixes in S1-14, S2 blank credit (dash),
  S5 one-name chips (prefix kept), S6-01 (today's Title Case headings). build.py 0 PROBLEM.
- NEXT: cases_design.py: figs for D-01..D-49, new picture cases D-50..D-75, held D-76..D-81.
- DONE: NEW-QUESTIONS.py (Q11-Q15), D-50..D-81 written, build 0 PROBLEM (289 cases).
- DONE: screen_text.py + make_inventory.py -> DESIGN-TEXT-INVENTORY.json/.md (794 texts, 0 unclassified).
- DONE: register (authoring/design_register.py via render_outputs), checklist, setup file; spec_to_design_check exit 1 only on S5-R13 'Search vendors' (QUESTION-READY, Q12 unsent).
- DONE: DESIGN-VISUAL-INVENTORY.md (97 rows, 0 unclassified; keys verified).
- DONE: DESIGN-READING-RECORD.md.
- held-case References wording fixed; all generators rerun.

## Final state (22 Oct 2026, end of worker pass)
- 289 cases (257 existing re-checked: 28 changed, 228 changed navigation-only, 1 confirmed; 32 new: D-50..D-75 picture cases, D-76..D-81 held).
- build.py 0 PROBLEM; text inventory 794 texts 0 unclassified; visual inventory 97 rows 0 unclassified; spec_to_design_check exit 1 only on
  S5-R13 "Search vendors" (QUESTION-READY until Q12 is sent).
- Outputs: DESIGN-READING-RECORD.md, DESIGN-TEXT-INVENTORY.json/.md, DESIGN-VISUAL-INVENTORY.md, DESIGN-CASE-CHECKLIST-2026-10-22.md (here and
  at project root), ../DESIGN-DIVERGENCE-REGISTER.json, NEW-QUESTIONS.py (Q11-Q15), PASS-REPORT.md; regenerated AR-AP-SETUP-FILE.md, REPORT.md,
  TICKET-LEDGER.json, cases/design/DESIGN-CASES.json, authoring/proposals.json. Nothing written to TestRail/Jira/Slack/Google; no commits.
