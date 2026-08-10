#!/usr/bin/env python3
"""
repair_c38909.py — the ONE authorised update_case of 2026-08-10.

C38909 (FLT-RPTS-01) asserted working filter buttons across NINETEEN report surfaces.
Only FIVE are unambiguously in this epic. The repair is SCOPE-CONDITIONAL WORDING
(Rule 42) — the out-of-scope reports are named, explained in tester-facing words, and
kept as a stated exclusion rather than deleted or rewritten to build behaviour
(Rules 25 / 57).

Guards:
  * All three text fields are sent EXPLICITLY — update_case re-renders any text field
    omitted from the payload (playbook §J).
  * SHAPE is checked before sending: exactly one provenance line, exactly one marker,
    marker LAST, no raw HTML markup.
  * Byte verification after: re-GET, compare every field against the intended payload,
    and prove every field we did not intend to change byte-identical to the pre-write
    snapshot. `refs` is compared under the declared comma normalisation.
  * On ANY mismatch: STOP and print both byte sequences.
"""
import base64
import json
import os
import sys
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SNAP = os.path.join(HERE, 'snapshots')
BASE = 'https://shopview.testrail.io/index.php?/api/v2/'
CASE = 38909

_C = json.load(open('/tmp/testrail/creds.json'))
AUTH = 'Basic ' + base64.b64encode(
    f"{_C['email']}:{_C.get('password') or _C.get('key')}".encode()).decode()


def api(path, body=None):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(body).encode() if body is not None else None,
        headers={'Authorization': AUTH, 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            raw = r.read().decode()
            return r.status, (json.loads(raw) if raw.strip() else {})
    except urllib.error.HTTPError as e:
        return e.code, {'error': e.read().decode()[:600]}


TITLE = 'Report filter bars appear on the reports this change covers'

REFS = ('SV-8785 [epic] (spec v19 §2 Reports Filters; §4 Key Decisions date-range '
        '+ multi-select; S1-R3 chip type-icon); Branko answers 2026-07-31 Q2/Q3/Q5/Q7; '
        'Figma 11903-10573; eng handover SV-8785-app-wide-filter-redesign §3+§8 2026-08-10')

PRECONDS = """1. You are signed in to the ShopView App on a desktop browser.
2. You are on the Reports area of the app with some sample data present."""

STEPS = """1. Open the Reports area and go to the Shop Efficiency report, and look at the filter buttons shown above the report table.
2. Go to the Timesheet Activities report and look at its filter buttons.
3. Go to the My Timesheets report and look at its filter buttons. This is the report called 'My Timesheets' - it is not the separate 'Timesheets (Payroll Timesheet)' report.
4. Go to the Notes report and look at its filter buttons and the icons in its toolbar.
5. Go to the Reminders report and look at its filter buttons.
6. Go to the Sales Tax report. Look at the filter buttons on the Collected tab, then open the All Tax Rates tab and look at them again.
7. On each report above, look at how each filter button is drawn - its icon, its name and its arrow.
8. On each report above, open one of its filter buttons, look at the list of choices inside it, and pick a value to check the report changes.
9. On each report above, open the Date filter and check whether a date range is already chosen when the report first opens."""

EXPECTED = """1. Each of the six reports in the steps shows a filter bar under the report header, with filter buttons on it.
2. Shop Efficiency includes a Date filter button.
3. Timesheet Activities includes these filter buttons: Staff, Date, Status and Modified by.
4. My Timesheets includes a Date filter button. No product document lists any other filter button for this report, so if you see more, do not treat that as a failure - write down what you see and report it.
5. Notes includes these filter buttons: Author, Date and Mention (the Mention button uses an @ icon), and its toolbar also shows a search icon, a filter icon and a sort icon.
6. Reminders includes a Date filter button, and when nothing matches the chosen dates the report shows the message 'There are no reminders for selected date range'.
7. Sales Tax has two view tabs: the Collected tab includes Date, Invoice Status and Customer filter buttons, and the All Tax Rates tab includes an Invoice Status filter button.
8. Each report tab keeps its own filter buttons and its own selections, so a selection made on one tab does not carry across to another.
9. Each filter button shows a small icon for the kind of filter, then the filter name, then a down arrow.
10. Every filter button listed above is a working filter on that report - none of them is display-only.
11. The choices inside each filter come from your own shop's data (for example your real customers or staff), so there is no fixed list to compare against - check that the choices you see match the data in your shop.
12. The Date filter opens with a date range already chosen rather than empty, and it offers ready-made ranges as well as a custom start and end date.

13. The reports below are NOT part of this piece of work. If they have no filter bar, or still show their older controls, that is correct. Do not raise a bug and do not mark this test failed because of them:
- Sales, Technician Efficiency, Advisor Analysis and Work in Progress. These belong to a separate piece of work (the Reporting Suite) and are deliberately being left alone here.
- The six ageing reports: A/R Aging Summary, A/R Aging Detail, A/R Aging Collection, A/P Aging Summary, A/P Aging Detail and A/P Unpaid Invoices. These pick a single 'as of' date, and no filter button of that kind has been built yet. The decision on them is still open.
- Timesheets (Payroll Timesheet) and Sales Follow Up. These are not currently reachable from the menu and no decision has been taken on them. 'Timesheets (Payroll Timesheet)' is a different report from the 'My Timesheets' report in step 3.
- IBS Batch Transactions and QB Unexported. There is no date information behind these two reports, so they cannot be given a Date filter.

14. The list of reports in this test is the list this piece of work covers today. If a report named in item 13 later gains the new filter bar, that is a change of what the work covers rather than a failure of this test - check the current product write-up before raising anything.

15. Still to check on the live build: the real columns of the Sales Tax report. The design uses a sample placeholder table for it and the written description does not list its columns.

16. If a report in steps 1 to 6 is missing the filter bar this test needs, mark this test BLOCKED - do not mark it failed. On the build last checked (named below) only Timesheet Activities was seen to have a filter bar, showing a Date Range button and a Filter by Staff button, and no report had a page search box. The engineering handover says all six reports above were migrated by that same build, so this difference needs one live check on the current build before it is treated either way.

---
This is the expected behaviour as per epic SV-8785, the Reports filters design and the product owner's answers named below. The Filters specification at Confluence version 19 describes the Reports filter bar in section 2 'Reports Filters' and in its Key Decisions, but it has no numbered requirement saying which reports are covered or which filter buttons each report has, so there is no requirement reference to give for those points; the requirement that each filter button carries a leading type-icon is S1-R3, which was added in Confluence version 19. Which reports this piece of work covers is taken from the engineering handover for the app-wide filter redesign (branch SV-8785-app-wide-filter-redesign), sections 3 and 8, read on 10 August 2026 - that is an engineering handover, not a specification, and our reading of it is recorded in this file: build/handover-ingest-2026-08-10/FILTERS-RECONCILIATION.md (https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/HEAD/build/handover-ingest-2026-08-10/FILTERS-RECONCILIATION.md). The filter buttons named for each report come from Branko's answers, in this file: build/filters/branko-answers-2026-08-04/answers-ingested.md (https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/HEAD/build/filters/branko-answers-2026-08-04/answers-ingested.md). Last checked against build v3.4.2-d00239b on 8/5/2026.

AUTOMATION: HOLD - Branko's Parts and Reports write-up is still outstanding, so no product source states which filter buttons each report should show"""


def shape_check(expected, steps, preconds, title, refs):
    """A byte check proves fidelity to the payload, not that the payload was right."""
    problems = []
    if expected.count('\n---\n') != 1:
        problems.append(f'provenance separator count = {expected.count(chr(10) + "---" + chr(10))}, want 1')
    prov = 'This is the expected behaviour as per'
    if expected.count(prov) != 1:
        problems.append(f'provenance sentence count = {expected.count(prov)}, want 1')
    if expected.count('AUTOMATION:') != 1:
        problems.append(f'marker count = {expected.count("AUTOMATION:")}, want 1')
    lines = [l for l in expected.split('\n') if l.strip()]
    if not lines[-1].startswith('AUTOMATION: '):
        problems.append(f'marker is not the last non-empty line; last = {lines[-1][:60]!r}')
    if not any(lines[-1].startswith(p) for p in
               ('AUTOMATION: READY', 'AUTOMATION: HOLD - ')):
        problems.append(f'marker string not one of the three permitted forms: {lines[-1][:60]!r}')
    idx = expected.index('AUTOMATION:')
    if not expected[:idx].endswith('\n\n'):
        problems.append('marker is not preceded by a blank line')
    for name, txt in (('expected', expected), ('steps', steps), ('preconds', preconds)):
        for tag in ('<ol', '<li', '<p>', '<br', '<hr', '<strong', '</'):
            if tag in txt:
                problems.append(f'raw markup {tag!r} present in {name}')
    if len(title) > 80:
        problems.append(f'title {len(title)} chars > 80')
    for entry in refs.split(','):
        if len(entry.strip()) > 248:
            problems.append(f'refs entry {len(entry.strip())} chars > 248')
    # the build sentence must NOT have been re-stamped
    if 'Last checked against build v3.4.2-d00239b on 8/5/2026.' not in expected:
        problems.append('the build sentence was altered - it must be carried over verbatim')
    return problems


def norm_refs(s):
    return ','.join(p.strip() for p in (s or '').split(','))


def main():
    problems = shape_check(EXPECTED, STEPS, PRECONDS, TITLE, REFS)
    if problems:
        print('SHAPE CHECK FAILED - nothing sent:')
        for p in problems:
            print('   *** ' + p)
        raise SystemExit(1)
    print('shape check PASSED (one provenance line, one marker, marker last, no raw markup, '
          'title <= 80, refs entries <= 248, build sentence carried over verbatim)')

    before = json.load(open(os.path.join(SNAP, 'C38909-before.json')))

    payload = {'title': TITLE, 'refs': REFS, 'custom_preconds': PRECONDS,
               'custom_steps': STEPS, 'custom_expected': EXPECTED}

    if '--authorized' not in sys.argv:
        print('DRY RUN - no write made.')
        return

    st, body = api(f'update_case/{CASE}', payload)
    print(f'update_case/{CASE} -> HTTP {st}')
    if st != 200:
        print(json.dumps(body, indent=1)[:900])
        raise SystemExit('WRITE FAILED - stopping (Rule 50)')

    _, after = api(f'get_case/{CASE}')
    json.dump(after, open(os.path.join(SNAP, 'C38909-after.json'), 'w'),
              indent=1, sort_keys=True)

    bad, checked = [], 0
    for k in sorted(set(before) | set(after)):
        checked += 1
        if k in payload:
            want, got = payload[k], after.get(k)
            if k == 'refs':
                want, got = norm_refs(want), norm_refs(got)
            if want != got:
                bad.append(('INTENDED FIELD NOT STORED AS SENT', k, want, got))
        elif k in ('updated_on', 'updated_by'):
            continue
        else:
            if before.get(k) != after.get(k):
                bad.append(('COLLATERAL CHANGE', k, before.get(k), after.get(k)))

    print(f'byte verification: {checked} fields compared '
          f'({len(payload)} intended, {checked - len(payload) - 2} proven untouched, '
          f'updated_on/updated_by excluded by design)')
    if bad:
        for kind, k, w, g in bad:
            print(f'\n*** {kind}: field {k}')
            print(f'    expected bytes: {w!r}')
            print(f'    stored bytes  : {g!r}')
        raise SystemExit('VERIFICATION FAILED - STOPPING (Rule 50)')
    print('VERIFIED: every intended field stored byte-for-byte as sent; '
          'every other field byte-identical to the pre-write snapshot.')


if __name__ == '__main__':
    main()
