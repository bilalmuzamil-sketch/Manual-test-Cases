# Dashboard setup Docs — ONE-TIME job (QA lead, 10 Oct 2026). Not a rule, not a skill.

Scope: Dashboard group 12166, created by Bilal (user 3), not Automated (`custom_atmstatus` 3), not E2E
(`custom_automation_type` 1) — 70 tests, read live 10 Oct (`/tmp/cln/scope-1010.txt`).

QA lead: *"For all those test cases which I have filtered for you I need the setup and detailed preconditions to go
into that separate google doc file and linked at the top of the test case and for Ayesha who is the manual QA tester
the precondition should be the best standard preconditions. Make sure you do not change the steps and anything below
that."* Then: *"The preconditions inside the test should have what it needs to be for a manual qa tester to know but
the details should be in that file."*

- Layout follows the existing "Setup (manual QA tester and Claude session) - C<id> <title>" Docs (Drive folder
  `1zdj0d1RqpI1julHfiPPhTgDR_iUAKj3e`), one Doc per test.
- Setup text = the Setup section the test carried until 9 Oct 12:25 UTC, when the authoring session removed it on the
  QA lead's order ("Dashboard -> Just remove the SETUP section keep the rest the way it is"); copies taken from
  `origin/claude/slack-session-setup-7v5itm:build/setup-to-doc-2026-10-09/dashboard/C<id>-before.json`.
- Test's Preconditions = link + the same list, each line given a plain label (User / Browser / Location / Timing /
  People / Data). Wording otherwise unchanged. Steps, Expected, markers, stamps untouched (checked on write).
- `gen.py` builds `docs/C<id>.html` + `pre/C<id>.json`; `write_pre.py` = guarded write of Preconditions only.
- Pilot 10 Oct: C351706, C88601, C88641 — Docs created, written, display check fr-view, links verified.

## Change 10 Oct: ONE Doc, a heading per test (QA lead: "One doc with the heading per test")
- Combined Doc `1qjMO77Hv5prqm6aZNl_NEGQy-cux7qWIBkDspQRl6kQ` ("Setup (manual QA tester and Claude session) - Dashboard
  (all tests)"), built by `gen_one.py` → `dashboard-setup-all.html`; Contents list links every heading, which is what makes
  Google give each heading a bookmark id (an HTML import without internal links exports no heading ids — checked).
- Read back via export: text identical to the file (175,500 chars); 70 contents links in test order → `heading-links.json`
  (`…/edit#bookmark=id.…`).
- Trial C351706, C88601, C88641 relinked to their headings; display fr-view; links verified on the served page.
- Now unused in Drive (not deleted, QA lead to decide): 3 per-test trial Docs, the first combined Doc without contents
  (`13X4jdSup0k5LKKgU43MpSJaMgjPF9i1U7p0lsajKwuI`), scratch check Doc `1I8U8BQzXg4GhFkjDlwztJDryiaUxEk2RP0BQixrZPA8`.

## Final (10 Oct): one Doc per test (QA lead: "keep each doc separate for each test case")
- 70 per-test Docs in folder `1zdj0d1RqpI1julHfiPPhTgDR_iUAKj3e` (map: `docs-created.jsonl` + `results-1/2/3.jsonl`);
  the folder is already "anyone with the link can view", so Ayesha can open them (checked permissions).
- QA lead "Go with what's best to make the test runnable": in 5 setups (C88633, C88641, C88642, C88651, C88652) the
  undefined "Advisor A" became "any name in the list" — those tests' results do not depend on the advisor. Where the
  test defines Advisor A (8 other tests) it is unchanged.
- Read back: all 70 Docs match their files word for word (`compare.py`, readback/).
- TestRail: 70 Preconditions written (guarded; Steps, Expected, title, automation fields re-read identical to the morning
  copies in `before/`); display fr-view 70/70 (`served-45.json`, `served-25.json`); every link opens its own Doc
  (`links-70.txt`).
- Unused in Drive, not deleted (QA lead to decide): see `unused-docs.txt` (C88641 first per-test Doc, two combined Docs,
  scratch Doc).
