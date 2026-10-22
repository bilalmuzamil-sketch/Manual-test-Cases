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
