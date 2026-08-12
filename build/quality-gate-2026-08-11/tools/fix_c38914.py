#!/usr/bin/env python3
"""C38914 -- add the Standing Rule 61 symptom + three-outcome block.

WHAT THIS CHANGES: it INSERTS the Rule-61 instruction block that Rule 61 requires
on every `AUTOMATION: READY - EXPECT FAIL` case. It is the only one of the 107
EXPECT-FAIL cases in the audit population missing it.

WHAT THIS DOES NOT CHANGE: no expectation. Items 1-5 of the expected result, the
tester note, the Rule-54 provenance line (both sentences, verbatim) and the marker
are all preserved byte-for-byte. Title, preconditions, steps and refs untouched.

The symptom is quoted from our OWN recorded live observation on the SAME build the
case already names (v3.5-16cf83f, 8/6/2026):
  build/report-suite/full-viu-2026-08-06/FINDINGS.md line 65 --
  "Sixth in all three places (values themselves are correct, incl. 'Multiple')"
so no new build fact is asserted. This pass has no build session.

All three text fields are sent on the payload because update_case re-renders any
omitted text field into <p>-wrapped HTML with CRLF (playbook section J).
custom_atmstatus is NOT sent -- the Automated flag is Vlad's alone (Rule 65).
"""
import json
import sys

sys.path.insert(0, '/tmp/testrail')
import tr  # noqa: E402

CID = 38914

BLOCK = (
    "What you should see today: the Location column is not the leftmost column. It sits sixth, "
    "after Vendor, in all three places - on screen and in both downloads. The values themselves are "
    "right, including \"Multiple\" on the merged Special Order row. This is a known problem and it is "
    "already reported - see https://shopview.atlassian.net/browse/SV-8938\n"
    "- If you see exactly that, mark this test FAILED and do not raise anything new.\n"
    "- If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please "
    "report it.\n"
    "- If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note "
    "removed."
)


def main():
    apply_ = '--apply' in sys.argv
    st, c = tr.get_case(CID)
    assert st == 200, (st, c)
    exp = c['custom_expected']

    # Insert the block immediately BEFORE the '---' that opens the provenance,
    # which is where Rule 61 places it and where every sibling case carries it.
    marker = '\n\n---\n'
    assert exp.count(marker) == 1, 'expected exactly one provenance separator'
    head, tail = exp.split(marker)
    assert 'What you should see today' not in exp, 'block already present'
    new_exp = head.rstrip('\n') + '\n' + BLOCK + marker + tail

    # Prove nothing else moved: the only difference is the inserted block.
    assert new_exp.replace('\n' + BLOCK, '', 1) == exp, 'insertion is not additive'
    print('--- INSERTED BLOCK ---')
    print(BLOCK)
    print('--- len before/after:', len(exp), len(new_exp))

    if not apply_:
        print('\nDRY RUN -- nothing written. Re-run with --apply')
        return

    payload = {
        'custom_preconds': c['custom_preconds'],   # sent verbatim, must not re-render
        'custom_steps': c['custom_steps'],         # sent verbatim, must not re-render
        'custom_expected': new_exp,
    }
    st, report, before, after = tr.update_case_verified(CID, payload, label='rule61-block')
    print('HTTP', st, '|', report)
    for k in ('title', 'refs', 'custom_preconds', 'custom_steps', 'custom_atmstatus',
              'custom_automation_type', 'section_id'):
        assert before.get(k) == after.get(k), 'COLLATERAL CHANGE on %s' % k
        print('  unchanged, byte-identical:', k)
    assert after['custom_expected'] == new_exp
    assert after['custom_expected'].count('Last checked against build v3.5-16cf83f on 8/6/2026') == 1
    assert after['custom_expected'].rstrip().endswith('AUTOMATION: READY - EXPECT FAIL (SV-8938)')
    print('OK: provenance sentence 2 preserved exactly; marker still last.')
    json.dump({'before': before, 'after': after},
              open('/tmp/qg/C38914-write.json', 'w'), indent=1)


if __name__ == '__main__':
    main()
