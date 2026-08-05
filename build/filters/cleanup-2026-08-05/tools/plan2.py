#!/usr/bin/env python3
"""Corrective pass over the 8 phone cases, on the coordinator's mid-task ruling.

Two things change, and nothing else:
 1. provenance goes to Rule-54 STATE 1 - epic + spec version + requirement + Branko's
    answer with its link and date - because we have NO live session, so no case may
    claim a build-tested date for behaviour we did not observe.
 2. the automation marker becomes HOLD, because READY asserts the build passes and
    EXPECT FAIL asserts the build fails, and we have seen neither.
The body, the steps, the title and the divergence sentence stay exactly as written.
"""
import json, re, sys

PRE = json.load(open('/tmp/clean/snap/PRE2-cases.json'))
MOB8 = ['29621', '29622', '29623', '29624', '29625', '29626', '29627', '29630']

SV8825 = 'https://shopview.atlassian.net/browse/SV-8825'
SV8875 = 'https://shopview.atlassian.net/browse/SV-8875'
SPEC = 'the Filters specification version 1.6 as revised on 4 August 2026'
ANSWER = ('Branko settled how filters apply on a phone on 5 August 2026: he said it is written in '
          'the specification and closed the question (' + SV8825 + ').')
NOTLIVE = ('This has not been checked against the running app in this pass, so no build or test date '
           'is claimed for it.')

ANCHORS = {
    '29621': 'S12-R1',
    '29622': 'S12-R3, S12-R6',
    '29623': 'S12-R2, S12-R3, S12-R6, S2-R1',
    '29624': 'S12-R2, S12-R6, S2-R2',
    '29625': 'S12-R2, S12-R6, S3-R2, S3-R3',
    '29626': 'S12-R2, S12-R6, S4-R1, S5-R1',
    '29627': 'S12-R2, S12-R6, S6-R1',
    '29630': 'S12-N1, S8-R3',
}
HOLD = ('HOLD - needs one live check on the current build to confirm whether the '
        "'Apply filters' button is present on a phone")

# C29624's known-issue line asserted a build fact as ours. Re-attributed to the ticket
# that actually reports it, and it asks the tester to record what they see.
OLD_KI = re.compile(r'Known issue: on the build tested a single filter.*?SV-8875', re.S)
NEW_KI = ("Known issue reported by the test team: a single filter's own sheet is reported to allow "
          "only one value and to have no 'Apply filters' button, filtering the list the moment you "
          "tap a value, while only the combined 'All Filters' sheet holds your choices until you "
          "press a button. That is reported as " + SV8875 + " and it is still open. We have not "
          "re-checked it on the current build, so if you can run this test, write down what you "
          "actually see.")

PLAN = {}
for cid in MOB8:
    e = PRE[cid]['custom_expected']
    if cid == '29624':
        e = OLD_KI.sub(NEW_KI, e)
        assert NEW_KI in e, cid
    # split off everything from the provenance separator onward
    head, sep, tail = e.partition('\n\n---\n')
    assert sep, cid
    diverge = ''
    m = re.search(r'\n\nPlease note this is a change.*?(?=\n\nAUTOMATION: )', tail, re.S)
    if m:
        diverge = m.group(0)
    prov = (f'This is the expected behaviour as per epic SV-8785 and {SPEC} '
            f'({ANCHORS[cid]}). {ANSWER} {NOTLIVE}')
    new = head.rstrip('\n') + '\n\n---\n' + prov + diverge + '\n\nAUTOMATION: ' + HOLD + '\n'
    PLAN[cid] = {'custom_expected': new}

errs = []
for cid, d in PLAN.items():
    e = d['custom_expected']
    pre = PRE[cid]['custom_expected']
    if 'build tested on' in e:
        errs.append(f'C{cid}: still claims a build-tested date')
    if len(re.findall(r'^AUTOMATION: ', e, re.M)) != 1:
        errs.append(f'C{cid}: marker not exactly once')
    if not e.rstrip('\n').endswith(HOLD):
        errs.append(f'C{cid}: marker not last')
    if len(re.findall(r'This is the expected behaviour', e)) != 1:
        errs.append(f'C{cid}: provenance not exactly once')
    if re.search(r'<(ol|li|ul|p|hr|br)\b', e, re.I):
        errs.append(f'C{cid}: raw markup')
    if 'bmuzamil-shopview' in e:
        errs.append(f'C{cid}: dead link')
    if 'DO NOT AUTOMATE YET' in e:
        errs.append(f'C{cid}: false open-question line')
    # the numbered body must be untouched
    if pre.partition('\n\n---\n')[0].split('\n\nKnown issue')[0] != e.partition('\n\n---\n')[0].split('\n\nKnown issue')[0]:
        errs.append(f'C{cid}: numbered body changed - not allowed')
    if cid == '29624' and 'Please note this is a change' not in e:
        errs.append('C29624: divergence sentence lost')

json.dump(PLAN, open('/tmp/clean/plan2.json', 'w'), indent=1)
print('cases in corrective plan:', len(PLAN))
print('GUARDS:', 'CLEAN' if not errs else 'FAILED')
for e in errs:
    print('  !!', e)
print('\n--- C29621 after ---'); print(PLAN['29621']['custom_expected'])
sys.exit(1 if errs else 0)
