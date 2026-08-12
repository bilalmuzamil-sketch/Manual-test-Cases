#!/usr/bin/env python3
"""Emit the per-case three-dimension verdicts CSV for the 2026-08-11 quality gate.

Dimension 1  USEFUL             KEEP / MERGE / WEAK-KEEP / CUT
Dimension 2  MAKES SENSE        SENSIBLE / FIX-WORDING / NONSENSE / CONTRADICTION
Dimension 3  GENUINE+LAYMAN     PASS / FIX-WORDING / CUT

Every case in the population was cold-read by hand; this file records the verdicts
and the reasons. The default is KEEP / SENSIBLE / PASS and the EXCEPTIONS dict below
carries every case that departs from it, with its reason. That shape is deliberate:
it makes the exception list auditable, and the count of exceptions IS the tally.
"""
import csv
import json
import re

LIVE = '/tmp/qg/live-3proj.json'
POP = 'build/quality-gate-2026-08-11/evidence/population.json'
OUT = 'build/quality-gate-2026-08-11/per-case-verdicts.csv'
MARK = re.compile(r'^\s*AUTOMATION:\s*(.+?)\s*$', re.M)

# cid -> (d1, d2, d3, reason)
EXCEPTIONS = {
    # ---- Dimension 2: CONTRADICTION (Stage 2b) ----
    '30510': ('KEEP', 'CONTRADICTION', 'PASS',
              'WIP download family split. Says each menu option downloads a file (marker READY); '
              'C30512/13/14/18 say nothing downloads on any non-empty tab (EXPECT FAIL SV-8907). '
              'Both cannot be true. Flipped to READY today with NO build session.'),
    '30515': ('KEEP', 'CONTRADICTION', 'PASS',
              'Same group as C30510. Asserts the downloaded file names, i.e. that a file is '
              'produced; flipped EXPECT FAIL -> READY today with no build observation.'),
    '30516': ('KEEP', 'CONTRADICTION', 'PASS',
              'Same group. Asserts export header labels - contents of a downloaded file - while '
              'four siblings say no file is produced. Flipped today with no build observation.'),
    '30517': ('KEEP', 'CONTRADICTION', 'PASS',
              'Same group. Asserts the PDF shows the logo, i.e. a PDF exists. Flipped today with '
              'no build observation.'),
    '30511': ('KEEP', 'CONTRADICTION', 'PASS',
              'Same group, moved the OTHER way today (HOLD -> EXPECT FAIL SV-8907).'),
    '30512': ('KEEP', 'CONTRADICTION', 'PASS', 'Same group: asserts total download failure.'),
    '30513': ('KEEP', 'CONTRADICTION', 'PASS', 'Same group: asserts total download failure.'),
    '30514': ('KEEP', 'CONTRADICTION', 'PASS', 'Same group: asserts total download failure.'),
    '30518': ('KEEP', 'CONTRADICTION', 'PASS', 'Same group: asserts total download failure.'),

    # ---- Dimension 2: NONSENSE / FIX-WORDING ----
    '29945': ('KEEP', 'NONSENSE', 'PASS',
              'F1 precondition unreachable: "Work orders exist with different priorities (High and '
              'Low at minimum)". C38871 records that the work-order form has NO Priority field, and '
              'the 4 Aug live check recorded all three priority counts at 0. No BLOCKED path given.'),
    '30102': ('KEEP', 'NONSENSE', 'FIX-WORDING',
              'Expected result is numbered 1, 3, 3 - item 2 is missing. The title promises "nine '
              'periods in the specified order" and no item enumerates them. PREDATES today; three '
              'sibling cases (IV-DATE-01, PV-FILT-03, WIP-FLT-04) carry the full sentence.'),
    '30162': ('KEEP', 'FIX-WORDING', 'PASS',
              'REPAIRED THIS PASS. Carried an Inventory Value symptom block on a Sales By Customer '
              'case. Introduced today; absent from the baseline.'),
    '30287': ('KEEP', 'FIX-WORDING', 'PASS',
              'REPAIRED THIS PASS. Same wrong-report block on a Sales By Representative case.'),
    '38914': ('KEEP', 'FIX-WORDING', 'PASS',
              'REPAIRED THIS PASS. Only EXPECT-FAIL case of 107 with no Rule-61 symptom and no '
              'three outcomes.'),
    '30551': ('KEEP', 'FIX-WORDING', 'FIX-WORDING',
              '"...non-identity columns.The question is in the round-3 question sheet:" - no space, '
              'and the sentence introducing the question is missing, so "the question" has no '
              'antecedent. C30511/C30156 carry the complete three-sentence pattern.'),
    '30554': ('KEEP', 'FIX-WORDING', 'FIX-WORDING',
              'Same orphaned fragment as C30551, AND its body says "Known issue: the product does '
              'not currently do this ... SV-8927" while the marker is plain READY.'),
    '30588': ('KEEP', 'FIX-WORDING', 'PASS',
              'Body says "Known issue: the product does not currently do this ... SV-8823" while '
              'the marker is plain READY, with no Rule-61 three outcomes.'),
    '29962': ('KEEP', 'FIX-WORDING', 'PASS',
              'Click-to-arm regression re-confirmed live on 11 Aug (SV-8957: "no arm test-id, no '
              'aria-label containing by click, no arm markup anywhere") - the case says nothing '
              'about it and carries plain READY.'),
    '29600': ('KEEP', 'FIX-WORDING', 'FIX-WORDING',
              'The only case in all 771 whose preconditions and expected result are unnumbered '
              'run-on lines; "(all API-seeded)" is mild jargon. One of Vlad\'s Automated cases.'),
    '29584': ('KEEP', 'FIX-WORDING', 'PASS',
              'Garbled clause: "as a small removable tag above the list in the list".'),
    '38882': ('KEEP', 'SENSIBLE', 'FIX-WORDING',
              'Provenance dates Confluence version 19 to "the afternoon of 4 August"; 108 sibling '
              'cases and the cached Confluence metadata say 6 August. 4 August afternoon is v18, '
              'and v18 is what carried the date-filter change this case describes.'),
    '29624': ('KEEP', 'SENSIBLE', 'FIX-WORDING',
              'refs carries the superseded 4 Aug position ("single-filter sheet applies instantly '
              'with no Apply button") which its own expected result contradicts. The expected '
              'result is the correct side (Branko 5 Aug, SV-8825). Metadata only - a tester never '
              'sees refs. Same stale note appended to C29621/23/25/26/27/28.'),
    '43555': ('KEEP', 'FIX-WORDING', 'PASS',
              'Body says "The question has been put to the product owner on SV-8870" while the '
              'marker says "the question has not been sent yet". Reads as self-contradictory even '
              'though both can be true (ticket exists; question sheet unsent).'),
}
# the six new Schedule panel cases: marker convention differs from the rest of the suite
for c in ('43582', '43583', '43584', '43585', '43586', '43587'):
    EXCEPTIONS[c] = ('KEEP', 'SENSIBLE', 'FIX-WORDING',
                     'Marked AUTOMATION: READY for a feature the case itself records as absent '
                     'from the build. The same suite uses "HOLD - <feature> does not exist in the '
                     'build" for exactly this (C38868, C38869, C38871). Tester is safe - the body '
                     'says plainly to mark it failed - so the cost falls on the automation '
                     'worklist, not on tomorrow\'s run.')


def main():
    live = json.load(open(LIVE))
    pop = json.load(open(POP))
    by = {str(c['id']): (p, c) for p in live for c in live[p]}
    rows = []
    for proj in ('Filters', 'Schedule', 'ReportSuite'):
        d = pop[proj]
        for cid in sorted(set(list(d['created']) + list(d['material'].keys())), key=int):
            _, c = by[cid]
            m = MARK.findall(c.get('custom_expected') or '')
            d1, d2, d3, why = EXCEPTIONS.get(cid, ('KEEP', 'SENSIBLE', 'PASS', ''))
            rows.append({
                'C-ID': 'C' + cid,
                'Link': 'https://shopview.testrail.io/index.php?/cases/view/' + cid,
                'Project': proj,
                'How it entered scope': 'CREATED today' if cid in d['created'] else 'CHANGED today',
                'Title': c['title'],
                'D1 USEFUL': d1,
                'D2 MAKES SENSE': d2,
                'D3 GENUINE+LAYMAN': d3,
                'Automation marker': m[-1] if m else 'NONE',
                'Reason (blank = no exception found)': why,
            })
    with open(OUT, 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    from collections import Counter
    print('rows:', len(rows))
    for k in ('D1 USEFUL', 'D2 MAKES SENSE', 'D3 GENUINE+LAYMAN'):
        print(' ', k, dict(Counter(r[k] for r in rows)))
    print('written:', OUT)


if __name__ == '__main__':
    main()
