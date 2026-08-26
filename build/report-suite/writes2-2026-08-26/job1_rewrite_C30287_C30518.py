#!/usr/bin/env python3
"""JOB 1 - rewrite the TWO per-case-approved Automated cases: C30287 and C30518.

Rule 71 is satisfied by the QA lead's explicit per-case approval for these two ONLY.
Rule 41: each case is re-read whole and re-derived from the CURRENT live spec.
Rule 54: provenance re-stamped to the live version.
The AUTOMATION marker text is preserved BYTE-IDENTICAL (Rule 71 / 65).
Rule 50: every field byte-verified by a re-GET; atmstatus re-confirmed as 3.

Write style is set by the JOB 4 experiment run today (logs/job4-field-preservation.log):
omitted fields are PRESERVED, so only the fields that actually change are sent.
"""
import json, hashlib, sys
import tr

LOG = []


def say(*a):
    line = ' '.join(str(x) for x in a)
    print(line)
    LOG.append(line)


def sha(v):
    return hashlib.sha256((v or '').encode()).hexdigest()[:16]


def sub(text, old, new, tag):
    """Replace exactly once; abort the whole run if the anchor is not found."""
    n = text.count(old)
    if n != 1:
        say(f'  FATAL {tag}: anchor found {n} times, expected 1')
        say(f'         anchor={old!r}')
        sys.exit(1)
    say(f'  edit {tag}: OK (1 occurrence replaced)')
    return text.replace(old, new)


def process(cid, builder, changed_fields):
    say('')
    say('=' * 78)
    s, before = tr.call(f'get_case/{cid}')
    if s != 200:
        say(f'FATAL get_case/{cid} HTTP {s}'); sys.exit(1)
    say(f'C{cid} | {before["title"]}')
    say(f'  Rule 71 gate: custom_atmstatus = {before.get("custom_atmstatus")} '
        f'(3 = Automated; per-case approval held for this case only)')
    if before.get('custom_atmstatus') != 3:
        say('  FATAL: this case is not the Automated case the approval names. Aborting.')
        sys.exit(1)
    json.dump(before, open(f'logs/C{cid}-before.json', 'w'), indent=1)

    marker_before = [l for l in (before.get('custom_expected') or '').split('<br>')
                     for l in l.split('\n') if 'AUTOMATION:' in l]
    say(f'  AUTOMATION marker before: {marker_before!r}')

    payload = builder(before)
    for f in changed_fields:
        say(f'  {f}: before sha={sha(before.get(f))} len={len(before.get(f) or "")} '
            f'-> sending sha={sha(payload[f])} len={len(payload[f])}')
    untouched = [f for f in ('custom_preconds', 'custom_steps', 'custom_expected')
                 if f not in changed_fields]
    say(f'  fields OMITTED from the payload (preserved, per the Job 4 finding): {untouched}')

    s, r = tr.call(f'update_case/{cid}', payload)
    say(f'  update_case HTTP {s}')
    if s != 200:
        say(f'  FATAL update failed: {r!r}'); sys.exit(1)

    # ---- Rule 50 byte verification ----
    s, after = tr.call(f'get_case/{cid}')
    say(f'  re-GET HTTP {s}')
    json.dump(after, open(f'logs/C{cid}-after.json', 'w'), indent=1)
    ok = True
    for f in ('custom_preconds', 'custom_steps', 'custom_expected'):
        want = payload[f] if f in changed_fields else before.get(f)
        got = after.get(f)
        good = got == want
        ok &= good
        say(f'  VERIFY {f}: {"PASS" if good else "FAIL"} '
            f'({"changed as sent" if f in changed_fields else "untouched, preserved"}) '
            f'| want sha={sha(want)} got sha={sha(got)}')
        if not good:
            say(f'     WANT repr={want!r}')
            say(f'     GOT  repr={got!r}')
    atm_ok = after.get('custom_atmstatus') == 3
    ok &= atm_ok
    say(f'  VERIFY custom_atmstatus still 3: {"PASS" if atm_ok else "FAIL"} '
        f'(= {after.get("custom_atmstatus")})')
    marker_after = [l for l in (after.get('custom_expected') or '').split('<br>')
                    for l in l.split('\n') if 'AUTOMATION:' in l]
    m_ok = marker_after == marker_before
    ok &= m_ok
    say(f'  VERIFY AUTOMATION marker byte-unchanged: {"PASS" if m_ok else "FAIL"} '
        f'| after {marker_after!r}')
    say(f'  VERIFY title unchanged: {"PASS" if after["title"] == before["title"] else "FAIL"}')
    say(f'  C{cid} OVERALL: {"PASS" if ok else "FAIL"}')
    return ok


# ===================================================================== C30287
# Sales By Representative - CSV cell formatting. Live spec: SBR v24 (page 585629698,
# lastmod 2026-08-24), fetched 2026-08-26.
#
# WHAT THE SPEC CHANGED since the case's v22 pin (SBR change log, verbatim):
#   2026-08-21 (v23) "Shop Supplies given its own column and credited to the rep, per
#   SV-9423 ... A Shop Supplies column is added immediately to the left of Adjustments
#   on screen, in both PDFs, and in both CSVs; it counts toward Subtotal (S5-R12), is
#   defined in S5-R13, joins the column selector as the ninth toggleable metric column,
#   and carries the accounting-parentheses rule ... Shop Supplies stays out of Margin".
#   2026-08-24 (v24) "Margin % denominator corrected to the Margin base, and precision
#   corrected to two decimals, per SV-9423 ... Margin % divides by the Margin base
#   (Labor Invoiced + Parts Invoiced + Adjustments, i.e. Subtotal minus Shop Supplies)
#   and renders to two decimals ... Corrected in ... S14-R17 ... and the "—" condition
#   changed from Subtotal <= 0 to Margin base <= 0."
# Live S14-R17, verbatim on the operative clause: "Margin % is a number to two decimals
#   (e.g., 45.23), left empty when Margin % is undefined (Margin base <= 0)."
# Live S14-R15/S14-R16: both CSVs' header lists now include "Shop Supplies".
def build_30287(c):
    pre = sub(
        c['custom_preconds'],
        'a rep whose Margin % shows "—" on screen (Subtotal ≤ 0)',
        'a row carrying a Shop Supplies charge, a rep whose Margin % shows "—" on '
        'screen (its Margin base — Labor Invoiced + Parts Invoiced + Adjustments, '
        'which is Subtotal minus Shop Supplies — is 0 or less)',
        '30287.preconds: undefined-Margin-% condition + a Shop Supplies row to read')
    stp = sub(
        c['custom_steps'],
        'Read a money cell, the negative value',
        'Read a money cell, the Shop Supplies cell, the negative value',
        '30287.steps: read the new Shop Supplies cell')
    exp = c['custom_expected']
    exp = sub(exp,
              '2. Money values carry two decimals;',
              '2. Money values, including the Shop Supplies column, carry two decimals;',
              '30287.expected.2: Shop Supplies is one of the money columns')
    exp = sub(exp,
              'and the cell is EMPTY where Margin % is undefined (Subtotal &le; 0).',
              'and the cell is EMPTY where Margin % is undefined — that is, where the '
              'Margin base (Labor Invoiced + Parts Invoiced + Adjustments, which is Subtotal '
              'minus Shop Supplies) is 0 or less.',
              '30287.expected.3: undefined condition is now the Margin base, not Subtotal')
    exp = sub(exp,
              'This is the expected behaviour as per epic SV-8582 and the Sales By '
              'Representative report specification version 22 (S14-R17), both read on '
              '17 August 2026.',
              'This is the expected behaviour as per epic SV-8582, read on 17 August 2026, '
              'and the Sales By Representative report specification version 24 (S14-R17, '
              'with the Shop Supplies column added by S5-R12 and S5-R13 and carried into '
              'both CSVs by S14-R15 and S14-R16), read on 26 August 2026.',
              '30287.expected: Rule 54 provenance re-stamped v22 -> v24')
    # The trailing SV-9069 divergence paragraph is REMOVED: version 24 of the
    # specification now states the two-decimal Margin % itself (S14-R17), so the case no
    # longer follows a decision that differs from its cited source and Rule 56 no longer
    # applies. Removing it also puts the AUTOMATION marker last again. The marker text
    # itself is untouched.
    exp = sub(exp,
              '<br><br>SV-9069 superseded the one-decimal wording: Margin % on Sales By '
              'Customer and Sales By Representative reads to two decimals in EVERY format '
              '&mdash; screen, PDF and CSV &mdash; so the file matches the report it was '
              'exported from. Parts Velocity and Inventory Value keep the suite\'s '
              'one-decimal default.',
              '',
              '30287.expected: drop the now-redundant SV-9069 divergence paragraph '
              '(v24 S14-R17 states two decimals itself)')
    return {'custom_preconds': pre, 'custom_steps': stp, 'custom_expected': exp}


# ===================================================================== C30518
# Work In Progress - export notifications. Live spec: WIP v28 (page 703660034,
# lastmod 2026-08-24), fetched 2026-08-26.
#
# RE-DERIVATION RESULT: the three asserted strings are UNCHANGED between v21 and v28.
# Live v28, verbatim, under "Error Handling":
#   S9-R11: "On a successful download the user sees a success notification with the
#            caption "Data exported successfully.""
#   S9-R12: "If a download yields no rows, the user sees a warning notification titled
#            "Empty export" with the caption "Export didn't yield any results"."
#   S9-R13: "If a download fails, the user sees an error notification: "An error occurred
#            while exporting the report. Please try again.""
# So NOTHING in the expectation is superseded; only the Rule-54 version pin is stale
# (v21 -> v28), and the source-caution sentence names the wrong version number ("11").
# The duplicate S9-R11 anchor (row-cap vs success message) still exists in v28, so the
# caution is kept - with the version number corrected and the cap value stated.
def build_30518(c):
    exp = c['custom_expected']
    exp = sub(exp,
              'and the Work In Progress report specification version 21 (S9-R11, S9-R12, '
              'S9-R13), read on 17 August 2026.',
              'and the Work In Progress report specification version 28 (S9-R11, S9-R12 and '
              'S9-R13, under Error handling), read on 26 August 2026. These three '
              'requirements are worded identically in version 28 to the version this test '
              'was written against, so the expectation above is unchanged.',
              '30518.expected: Rule 54 provenance re-stamped v21 -> v28')
    exp = sub(exp,
              'One caution for anyone checking the source: version 11 of that specification '
              'uses the number S9-R11 for two different requirements — one about a size '
              'limit on downloads, one about the success message.',
              'One caution for anyone checking the source: version 28 of that specification '
              'still uses the number S9-R11 for two different requirements — one about '
              'the 10,000-row limit on downloads, one about the success message.',
              '30518.expected: correct the caution\'s version number 11 -> 28')
    return {'custom_expected': exp}


if __name__ == '__main__':
    results = {}
    results['C30287'] = process(30287, build_30287,
                                ('custom_preconds', 'custom_steps', 'custom_expected'))
    results['C30518'] = process(30518, build_30518, ('custom_expected',))

    say('')
    say('SUMMARY: ' + ', '.join(f'{k}={"PASS" if v else "FAIL"}' for k, v in results.items()))
    open('logs/job1-rewrites.log', 'w').write('\n'.join(LOG) + '\n')
    json.dump(results, open('logs/job1-result.json', 'w'), indent=1)
