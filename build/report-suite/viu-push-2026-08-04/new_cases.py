#!/usr/bin/env python3
"""
Report Suite — the 3 authorised NEW cases (2026-08-04).

Authorisation (QA lead): "Yes, Add the 3 proposed new cases (permission surface,
PDF failure boundary, one more)".

Sources:
  SBC-API-06  build/report-suite/spec-watch-verification-2026-08-03/ADDENDUM-full-versions-SBC-delta-epic.md §4
              + build/report-suite/viu-2026-08-03/CHANGE-LEDGER.md "NEW CASE NEEDED"
  PV-EXP-12   build/report-suite/viu-2026-08-03/batch-pv-tu/STAGED-CHANGES.md §D
  IV-EXP-10   build/report-suite/viu-2026-08-03/batch-wip-iv/STAGED-CHANGES.md §E1

`refs` is deliberately COMMA-FREE (house style: one entry <= 248 chars) because
TestRail splits `refs` on commas — playbook §J.
"""

# every one: custom_atmstatus 3 + custom_automation_type 0 (CLAUDE.md, add_case rule)
NEW = [
    dict(
        internal_id='SBC-API-06',
        section_id=4305,           # SBC — API
        area='SBC — API',
        template_id=1, type_id=6, priority_id=2,
        title='The back end serves SBC report data and export on ordinary reports access',
        refs='SV-8600 (SBC spec v13 2026-07-31 S1-R2; S1-N1 — the back-end half of the ordinary-reports-access gate; the SBC twin of the Parts Velocity back-end case C30391; Chris Ward Q1=A; SV-8780 Ready to Fix)',
        preconds="""1. Two sign-ins are available: one user whose role has the ordinary reports access, and one whose role does not have it (for example a Foreman).
2. You can see the requests the browser makes (the browser's network panel) so you can read the response code.""",
        steps="""1. Sign in as the user WHO HAS ordinary reports access and open Sales By Customer.
2. In the network panel, find the request the page makes for the report's data and read its response code.
3. From the three-dot menu choose "Download Summary (CSV)" and read the response code of the export request.
4. Sign out and sign in as the user WITHOUT reports access.
5. Try to open Sales By Customer by typing its address directly, and read the response code of the data request.
6. Ask for the same export by its address and read that response code too.""",
        expected="""1. For the user WITH ordinary reports access, the report's data request succeeds (HTTP 200) and the report fills with rows.
2. For that same user, the export request also succeeds (HTTP 200) and a file is produced.
3. For the user WITHOUT reports access, the data request is refused with HTTP 403 and a message reading "Access denied." — no report data comes back.
4. For that same user, the export request is refused with HTTP 403 as well — no file is produced.
5. Note for the tester: one single permission controls all four of these. If you find the report data refused but the export allowed (or the other way round), that is a failure — record both response codes.""",
        notes='NEW 2026-08-04. Covers the permission surface at the back end — the SBC twin of PV-API-04 (C30391). Live evidence taken 2026-08-03 on QA branch sv8582 build v3.4.1-0ed4433: with an 8-atom role holding only reportsPageAccess BOTH endpoints returned 200; with Foreman (no such atom) BOTH returned 403 "Access denied." Build declared NOT FINAL, so this is PROVISIONAL (Rule 49) and is queued in build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md.',
    ),
    dict(
        internal_id='PV-EXP-12',
        section_id=4335,           # PV — Exports
        area='PV — Exports',
        template_id=1, type_id=6, priority_id=2,
        title='A large PDF download fails outright while the CSV of the same view works',
        refs='SV-8646 (PV spec v4 2026-07-29 Story 6 exports — the spec is silent on a renderer size limit; tech-plan-2026-07-29 A3/FR-F4 covers only the ten-thousand-row export cap)',
        preconds="""1. You are signed in with ordinary reports access, on a desktop browser.
2. Parts Velocity is open with a date range that returns a few hundred rows — narrow with the toolbar search until the list is roughly 300 to 500 rows.""",
        steps="""1. Narrow the report with the toolbar search so it shows a few hundred rows.
2. Open the three-dot menu and choose "Download (CSV)". Wait for the file.
3. Open the three-dot menu again and choose "Download (PDF)". Wait up to a minute.
4. Narrow the search further, to a couple of dozen rows, and choose "Download (PDF)" again.""",
        expected="""1. The CSV downloads successfully at that size.
2. The PDF also downloads successfully. If instead nothing downloads and a message appears saying something went wrong, that is a failure — record roughly how many rows were on screen.
3. The small PDF downloads successfully, which shows the failure depends on size.
4. Note for the tester: a very large view is refused politely with "This report is too large to export. Narrow the date range or filters, then try again." — that message is expected and is NOT this failure. This test is about a medium-sized view where the CSV works but the PDF errors.""",
        notes='NEW 2026-08-04, from the automation-engineer lens (Rule 45b). Live evidence 2026-08-03/04 on QA branch sv8582 build v3.4.1-0ed4433: Parts Velocity one location This Year — 344 rows / 31 pages produced a PDF TWICE byte-identical (308,830 bytes, 37.9 s and 55.4 s); 449 rows failed TWICE with HTTP 500 (35.1 s and 36.0 s). A 55 s success beside a 36 s failure means it is NOT a wall-clock timeout — it is size-driven. The CSV of every one of those scopes succeeded, including the full 6,219-row list. Same class on Technician Utilization: This-Year Expanded PDF returns HTTP 500 after 32.8 s (requestId 87142301-9ebe-4330-9f3d-c23c91837800) while its Summary PDF returns in 1.95 s. PV failure requestIds 4059eddd-e295-4876-9fc5-7f6c9c473342, 7c5c451a-e845-459b-bdd4-4f3ff1aa3021, 1f6ec1cd-458f-4144-822f-ef27c5772267, 36af28ab-0a4e-456d-8be5-ba1e33837d0b, 767a0020-a8ac-4452-8ae3-bb654a4594c1. Renderer WeasyPrint 69.0. Evidence build/report-suite/viu-2026-08-03/batch-pv-tu/evidence/pv/exports/exports-log.jsonl. Also a dev ticket in its own right. Build declared NOT FINAL — PROVISIONAL (Rule 49), queued in RECHECK-QUEUE.md.',
    ),
    dict(
        internal_id='IV-EXP-10',
        section_id=4373,           # IV — Exports
        area='IV — Exports',
        template_id=1, type_id=6, priority_id=2,
        title='A large Inventory Value PDF fails instead of being refused politely',
        refs='SV-8677 (IV spec v3 2026-07-29 S10-R11; S10-R12; S10-R14 — the observed failure path is a roughly 30-second server-side timeout and not the S10-R12 row cap; observed on build v3.4.1-0ed4433)',
        preconds="""1. You are signed in with ordinary reports access, on a desktop browser.
2. The Inventory Value report is open and the whole list runs to several thousand rows.""",
        steps="""1. Use the part search to narrow the list to a few hundred rows. Open the three-dot menu and choose the PDF download. Note how long it takes.
2. Clear the search so the whole list is shown again. Choose the PDF download and wait up to a minute.
3. With the whole list still shown, choose the CSV download and note how long that takes.
4. Narrow the list again with the part search, or pick a single location, and ask for the PDF once more.""",
        expected="""1. The narrowed PDF downloads successfully.
2. On the whole list the PDF does not download. After roughly half a minute a plain error appears reading "An error occurred. We're sorry for this inconvenience, please try again a bit later later." — record that this happened and roughly how many rows were in the view.
3. The CSV of that same whole list downloads successfully and quickly.
4. Once the view is narrowed the PDF works again.
5. Note for the tester: this is NOT the too-large-to-export message. If you see "This report is too large to export. Narrow the date range or filters, then try again." instead, that is the polite refusal working correctly and belongs to the export-cap test, not this one.""",
        notes='NEW 2026-08-04. Reproduced repeatedly on QA branch sv8582 build v3.4.1-0ed4433 and characterised as a roughly 30-second server-side timeout rather than a row cap. PDF returned 200 in 18-29 s at 1 / 11 / 149 / 269 / 276 / 320 / 396 / 408 / 411 / 532 filtered rows; non-deterministic at 538 rows (200 at 25 s then 500 at 31 s) and at 578 rows (200 at 25.4 s then 500 at 32.2 s); ALWAYS 500 at 648 / 725 / 793 / 896 / 1339 / 3872 / 4416 / 4811 / 5154 / 5657 / 9275 rows, every failure landing at 31-33 s. The CSV of the identical scope returns in 0.8-2.2 s and always 200. The whole list is 5,657 rows (one location) / 9,275 rows (two) — both UNDER the spec cap, so the friendly guard is never reached. RequestIds captured per probe in build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/api/iv-pdf-boundary.json and pdfprobe.json (e.g. dde055bf-3d20-4be9-83d1-9ddd2f024e9c, dfaec4f6-2dd0-4127-bb28-794b3f860946). Nothing else covers this: IV-EXP-07 (C30593) covers the cap message and IV-EXP-09 (C30595) the notification strings. Build declared NOT FINAL — PROVISIONAL (Rule 49), queued in RECHECK-QUEUE.md.',
    ),
]


def payload(n):
    """The exact add_case body."""
    return {
        'title': n['title'],
        'refs': n['refs'],
        'template_id': n['template_id'],
        'type_id': n['type_id'],
        'priority_id': n['priority_id'],
        'custom_atmstatus': 3,
        'custom_automation_type': 0,
        'custom_preconds': n['preconds'],
        'custom_steps': n['steps'],
        'custom_expected': n['expected'],
    }


if __name__ == '__main__':
    for n in NEW:
        assert len(n['title']) <= 80, (n['internal_id'], len(n['title']))
        for part in n['refs'].split(','):
            assert len(part.strip()) <= 248, (n['internal_id'], len(part.strip()))
        assert ',' not in n['refs'], f"{n['internal_id']}: refs must be comma-free (house style)"
        print(f"{n['internal_id']:12s} sec {n['section_id']}  title {len(n['title'])}c  refs {len(n['refs'])}c  OK")
