#!/usr/bin/env python3
"""RULE 133 (QA lead 2026-10-20): every Failed, Retest or Blocked test whose result names a ticket has that ticket at the
start of its case title — "SV-11545 - <title>". No ticket, no prefix.

His words: "Always do this (Prefix with the case number) for the failed/retest/blocked test cases make it the rule. When there
is no ticket no need to prefix such cases." — "the case number" is the TICKET number, as in his order just before it:
"... should have the prefix in their title like this SV-{{Ticket number which is causing them to stay blocked}}".

  python3 build/testing-tools/prefix_ticket_titles.py --run 498 --dry-run      what would change, writes nothing
  python3 build/testing-tools/prefix_ticket_titles.py --run 498                sweep the run: prefix every Failed/Retest/Blocked case
  python3 build/testing-tools/prefix_ticket_titles.py --run 498 --include-automated   also Automated cases (only on his go-ahead)

Where the ticket comes from: the test's NEWEST results, newest first, up to and including the newest result in the test's
current status — the "defects" field and every SV-nnnnn in their comments ("Follow the status here <link>", Rule 123).
Several tickets → "SV-a, SV-b - <title>". A title already carrying an "SV-… - " prefix is brought up to date (the old prefix
is replaced, never stacked).
Never touched: Vladimir Tomovic's cases (created_by 1, Rule 38) · cases TestRail flags Automated (custom_atmstatus 3) unless
--include-automated, and then tell Vlad (Rules 65/71) · a test with no ticket.
Only the title is sent (update_case {title}), so the escaping-container trap of the text fields is not touched; every write is
read back and logged. push_results_to_run.py calls prefix_case() for every non-Passed result it posts with a ticket link.
"""
import argparse, datetime, json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
KEY = re.compile(r'\bSV-\d{3,6}\b')
PREFIX = re.compile(r'^(SV-\d{3,6}(?:,\s*SV-\d{3,6})*)\s+-\s+')
STATUS = {2: 'Blocked', 4: 'Retest', 5: 'Failed'}


def titled(title, keys):
    """The title with exactly one up-to-date ticket prefix (pure; tested by selftest_workspace.py)."""
    base = PREFIX.sub('', title, count=1)
    return '%s - %s' % (', '.join(keys), base) if keys else title


def unprefixed(title):
    """The title with its ticket prefix removed (Rule 133 amendment: a Passed test loses its prefix)."""
    return PREFIX.sub('', title, count=1)


def unprefix_case(t, case_id, include_automated=False, dry=False):
    s, c = t.get('get_case/%d' % case_id)
    old = c.get('title', '')
    row = {'case': case_id, 'tickets': [], 'old': old}
    new = unprefixed(old)
    if new == old:
        return {**row, 'skipped': 'no prefix'}
    if c.get('created_by') == 1:
        return {**row, 'skipped': "Vladimir Tomovic's case — never changed (Rule 38)"}
    if c.get('custom_atmstatus') == 3 and not include_automated:
        return {**row, 'held': 'Automated — needs the QA lead\'s go-ahead, then tell Vlad (Rules 71/65)'}
    if dry:
        return {**row, 'would': new}
    s2, _ = t.post('update_case/%d' % case_id, {'title': new})
    s3, b = t.get('get_case/%d' % case_id)
    return {**row, 'new': new, 'http': s2, 'readBack': b.get('title'), 'verified': b.get('title') == new,
            'automated': c.get('custom_atmstatus') == 3}


def tickets_for(t, test):
    """Distinct SV keys named by the test's newest results down to the newest one in its current status."""
    s, r = t.get('get_results/%d&limit=25' % test['id'])
    rows = r.get('results', r) if isinstance(r, dict) else r
    keys = []
    for x in rows or []:
        keys += KEY.findall(x.get('defects') or '') + KEY.findall(x.get('comment') or '')
        if x.get('status_id') == test['status_id']:
            break
    return list(dict.fromkeys(keys))


def prefix_case(t, case_id, keys, include_automated=False, dry=False):
    s, c = t.get('get_case/%d' % case_id)
    old = c.get('title', '')
    row = {'case': case_id, 'tickets': keys, 'old': old}
    if not keys:   # "When there is no ticket no need to prefix": a prefix left from an earlier ticket comes off (20 Oct 2026)
        if PREFIX.match(old):
            return {**unprefix_case(t, case_id, include_automated, dry), 'tickets': []}
        return {**row, 'skipped': 'no ticket — no prefix (Rule 133)'}
    if c.get('created_by') == 1:
        return {**row, 'skipped': "Vladimir Tomovic's case — never changed (Rule 38)"}
    new = titled(old, keys)
    if new == old:   # checked BEFORE the Automated hold: an already-correct title needs nobody's go-ahead
        return {**row, 'skipped': 'already prefixed'}
    if c.get('custom_atmstatus') == 3 and not include_automated:
        return {**row, 'held': 'Automated — needs the QA lead\'s go-ahead, then tell Vlad (Rules 71/65)'}
    if dry:
        return {**row, 'would': new}
    s2, _ = t.post('update_case/%d' % case_id, {'title': new})
    s3, b = t.get('get_case/%d' % case_id)
    return {**row, 'new': new, 'http': s2, 'readBack': b.get('title'), 'verified': b.get('title') == new,
            'automated': c.get('custom_atmstatus') == 3, 'over80': len(new) > 80}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--run', type=int, required=True)
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--include-automated', action='store_true')
    ap.add_argument('--audit', help='write the log here (JSON)')
    a = ap.parse_args()
    import tr_client as t
    tests, off = [], 0
    while True:
        s, b = t.get('get_tests/%d&limit=250&offset=%d' % (a.run, off))
        tests += b.get('tests', []) if isinstance(b, dict) else b
        if not isinstance(b, dict) or not (b.get('_links') or {}).get('next'):
            break
        off += 250
    log = []
    for x in [x for x in tests if x['status_id'] in STATUS or x['status_id'] == 1]:
        if x['status_id'] == 1:   # Passed: the prefix comes off (amendment 2026-10-20)
            row = unprefix_case(t, x['case_id'], a.include_automated, a.dry_run)
            if row.get('skipped') == 'no prefix':
                continue
            row.update({'test': x['id'], 'status': 'Passed'}); log.append(row)
            print(json.dumps({k: row[k] for k in row if k not in ('old', 'readBack')})); continue
        row = prefix_case(t, x['case_id'], tickets_for(t, x), a.include_automated, a.dry_run)
        row.update({'test': x['id'], 'status': STATUS[x['status_id']]})
        log.append(row)
        print(json.dumps({k: row[k] for k in row if k not in ('old', 'readBack')}))
    if a.audit:
        json.dump({'when': datetime.datetime.utcnow().isoformat() + 'Z', 'run': a.run, 'dry': a.dry_run, 'log': log},
                  open(a.audit, 'w'), indent=1)
    held = [r for r in log if r.get('held')]
    if held:
        print('HELD (Automated, ask the QA lead): ' + ', '.join('C%d' % r['case'] for r in held))
    if any(r.get('automated') for r in log):
        print('AUTOMATED CASES CHANGED — tell Vlad (Rule 65): ' + ', '.join('C%d' % r['case'] for r in log if r.get('automated')))


if __name__ == '__main__':
    main()
