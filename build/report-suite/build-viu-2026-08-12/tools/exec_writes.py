"""Apply the WIP download-family corrections. Rule 50: exhaustive then exact.

Every payload carries all three text fields (TestRail re-renders an omitted text
field into <p>-wrapped HTML with CRLF). Every write is re-GET and byte-compared
field by field; every field we did not intend to change is proven byte-identical
to its pre-write snapshot. Any mismatch STOPS the batch.

An HTTP 500 can come back from a write that already landed, so a failure is
followed by a READ, never a blind retry.
"""
import json
import sys
import time

sys.path.insert(0, 'build/report-suite/build-viu-2026-08-12/tools')
import tr  # noqa: E402

BUILD_LINE = 'Last checked against build v3.6-8c28eed on 12 August 2026.'
LOG = 'build/report-suite/build-viu-2026-08-12/testrail-execution-log.md'
DROP_BLOCK = ['What you should see today:']
DROP_BULLET = ('· If you see exactly that', '- If you see exactly that',
               '· If it fails in a DIFFERENT way', '- If it fails in a DIFFERENT way',
               '· If it PASSES', '- If it PASSES')

# case -> what this pass does to it
PLAN = {
    30510: {'restamp': True},
    30511: {'restamp': True, 'drop_expectfail': True},
    30512: {'restamp': True, 'drop_expectfail': True},
    30513: {'restamp': True, 'drop_expectfail': True},
    30514: {'restamp': True, 'drop_expectfail': True},
    30515: {'restamp': True},
    30516: {'restamp': True},
    30518: {'restamp': True, 'drop_expectfail': True},
    # C30517 is DELIBERATELY ABSENT: the PDF logo was never observed as a logo,
    # only as one embedded image, so its build line is left exactly as found.
}
TEXT_FIELDS = ('custom_preconds', 'custom_steps', 'custom_expected')


def rebuild(expected, plan):
    if '<p' in expected or '<li' in expected or '<ol' in expected:
        raise SystemExit('REFUSING: case stores raw markup; a plain-text writer would double-stamp')
    out, changed = [], []
    for line in expected.splitlines():
        s = line.strip()
        if plan.get('drop_expectfail'):
            if any(s.startswith(p) for p in DROP_BLOCK) or s.startswith(DROP_BULLET):
                changed.append('dropped: ' + s[:60])
                continue
            if s == 'AUTOMATION: READY - EXPECT FAIL (SV-8907)':
                out.append('AUTOMATION: READY')
                changed.append('marker: EXPECT FAIL (SV-8907) -> READY')
                continue
        if plan.get('restamp') and s.startswith('Last checked against build '):
            if s != BUILD_LINE:
                out.append(BUILD_LINE)
                changed.append('build line: %s -> v3.6-8c28eed / 12 August 2026' % s.split()[4])
                continue
        out.append(line)
    return '\n'.join(out), changed


def main():
    rows, stop = [], None
    for cid, plan in sorted(PLAN.items()):
        st, pre = tr.get_case(cid)
        if st != 200:
            stop = 'C%s pre-read HTTP %s' % (cid, st)
            break
        new_exp, changed = rebuild(pre.get('custom_expected') or '', plan)
        if not changed:
            rows.append({'cid': cid, 'op': 'skipped', 'why': 'nothing to change'})
            continue
        payload = {f: (new_exp if f == 'custom_expected' else pre.get(f)) for f in TEXT_FIELDS}
        st2, post = tr.call('update_case/%d' % cid, payload)
        if st2 != 200:
            st3, post = tr.get_case(cid)   # a 500 can follow a write that landed: READ, do not retry
            rows.append({'cid': cid, 'op': 'write HTTP %s -> re-read %s' % (st2, st3)})
        time.sleep(0.4)
        st4, live = tr.get_case(cid)
        if st4 != 200:
            stop = 'C%s verify HTTP %s' % (cid, st4)
            break
        # (a) intended field byte-exact
        if live.get('custom_expected') != new_exp:
            stop = ('C%s MISMATCH on custom_expected\nINTENDED:\n%r\nSTORED:\n%r'
                    % (cid, new_exp, live.get('custom_expected')))
            break
        # (b) every other field byte-identical to the pre-write snapshot
        collateral = [k for k in pre
                      if k not in ('updated_on', 'updated_by', 'custom_expected')
                      and pre.get(k) != live.get(k)]
        if collateral:
            stop = 'C%s COLLATERAL CHANGE on %s' % (cid, collateral)
            break
        rows.append({'cid': cid, 'title': pre['title'], 'http': st2, 'verify': 'MATCH',
                     'fields_compared': len(pre), 'collateral': 0, 'changes': changed})
        print('C%s HTTP %s  MATCH  %d fields compared, 0 collateral  | %s'
              % (cid, st2, len(pre), '; '.join(changed)))
    json.dump(rows, open('/tmp/rs812/writelog.json', 'w'), indent=1)
    if stop:
        print('\n*** BATCH STOPPED ***\n' + stop)
        sys.exit(2)
    print('\nAll %d operations verified.' % len([r for r in rows if r.get('verify') == 'MATCH']))


if __name__ == '__main__':
    main()
