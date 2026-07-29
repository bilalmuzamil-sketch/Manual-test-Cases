#!/usr/bin/env python3
"""Report Suite SENSE-CHECK supplement 2026-07-28 — adds sense_verdict + sense_reason
columns to per-case-verdicts.csv (all prior columns preserved, same row order).

Source snapshot for the case bodies read: git SHA 674af301527c691c000e7063eca7f184fc0e2a89
(case content byte-identical to ddf8c16, the usefulness-audit snapshot; verified by an
empty `git diff ddf8c16 674af30 -- build/report-suite/cases/`). Bodies were read from a
read-only checkout at /tmp/rs-sense/cases-snapshot — the WORKING TREE case files were NOT
read and NOT touched (a concurrent worker was mid-edit; their edits landed as 3bd08a7
mid-run: 27 cases changed + SBC-EXP-16 added — those are flagged below for re-check).

Sense verdicts (exactly one per case, 100% of 515 — Rule 17):
  SENSIBLE     — a competent manual QA tester, reading the case cold, can execute it and
                 knows what PASS looks like; no fail condition triggered.
  FIX-WORDING  — the underlying test is sound but the wording would confuse/mislead a
                 cold tester; repairable — the reason says exactly what to fix.
  NONSENSE     — fails one of the 6 fail conditions (quoted); recommend CUT or rewrite.

The 6 fail conditions (from the user's directive):
  F1 steps not executable in order / precondition unreachable in the product
  F2 expected result does not follow from the steps
  F3 internal contradiction (precondition vs step, step vs expectation)
  F4 references a control/screen/field in NEITHER the spec NOR the kickoff video
  F5 domain nonsense (impossible math, wrong calc direction, cost/sell conflation,
     impossible snapshot logic)
  F6 not actionable — tester cannot tell what to DO or what PASS looks like

NO TestRail writes, NO case edits — this script only rewrites per-case-verdicts.csv.
"""
import csv, os

HERE = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(HERE, 'per-case-verdicts.csv')

# ---------------------------------------------------------------- NONSENSE (2)
NONSENSE = {
 'PV-COL-07': ('F6 (not actionable as written): precondition says "seed by editing the stored '
               'value\'s version marker in browser storage" but no storage key or format is given '
               '(the case\'s own note admits it must be "found at VIU") — a cold manual tester '
               'cannot perform the seeding step. Recommend CUT (matches the usefulness audit\'s '
               'existing CUT verdict).'),
 'SBR-EXP-09': ('F6 (pass not determinable by a manual tester): the pass criterion is that the PDF '
                'body font "shifts ONE step smaller than the positive value\'s tier, clamped at '
                'the 8px floor" — distinguishing 8px vs 9px body text in a PDF requires tooling '
                'the case does not provide, and the required "view with no positive dollar value '
                'at all" is barely seedable. Recommend CUT (matches the usefulness audit\'s '
                'existing CUT verdict).'),
}

# ---------------------------------------------------------------- FIX-WORDING (9)
FIX = {
 'IV-PERS-04': ('Expected line 1 asserts the GENERAL rule "an invalid saved value falls back to '
                'its default" but the steps only drive the stale-category/vendor path — scope the '
                'Expected to what the steps produce, or add the concrete route per value class '
                '(as SBC-PERS-03 does with its provocable-vs-not note).'),
 'PV-EXP-08':  ('Step 2 says "Open the CSV in a spreadsheet tool and check the produced alignment" '
                '— a CSV file carries no alignment (the spreadsheet applies its own); scope the '
                'alignment assertions to the PDF only and drop the CSV step.'),
 'SBC-PERM-04': ('Step 3 "attempt to request a location you are not assigned to (for example by '
                 'editing the page link if the location is carried there, or any other means '
                 'available)" is conditional/vague for a cold tester — name the concrete probe '
                 'route(s) (URL parameter edit; restored saved view) in the steps themselves.'),
 'SBC-EXP-08': ('Expected asserts "25px margins" and px font conformance with no measurement '
                'method in the steps — a tester cannot eyeball 25px; either state the tooling '
                '(PDF inspector) or reduce the pass criterion to the observable claims (A4 '
                'landscape + footer text + page numbers).'),
 'SBR-NAV-01': ('Precondition/steps require comparing the nav order against "before this report '
                'was added" — a state a cold tester cannot observe on a build where the report '
                'already exists; reword to compare against production/the prior release, or move '
                'the additive-placement comparison to a VIU note.'),
 'SBR-CALC-08': ('Seeding hint "seed ZZAUTOTEST data with values like $10.005" is misleading — '
                 'money fields take 2 decimals, so sub-cent values cannot be typed in; reword the '
                 'seeding to derive sub-cent intermediates (hours × rate, percentage lines). The '
                 'expected-behaviour trap itself (one-last-decimal totals difference = expected) '
                 'is sound and valuable.'),
 'SBR-EXP-08': ('The tier table (11/10/9/8px by longest-dollar-string) is not verifiable by eye; '
                'the case\'s own note concedes only "the relative step-downs and the no-overflow '
                'guarantee" are checkable — promote that fallback into the Expected as the pass '
                'criterion and demote the px values to metadata.'),
 'TU-SUM-02':  ('Expected says eye-summing "MAY differ from the displayed Summary by a cent" — '
                'the values are HOURS, not money; say "by 0.01 (one unit in the last decimal)" '
                'so a cold tester is not left hunting for currency.'),
 'TU-LINK-03': ('Title/Expected say the totals "reconcile to the cent" — the compared totals are '
                'HOURS (two decimals), not currency; reword to "match exactly, to two decimals". '
                'The reconciliation contract itself is one of the suite\'s best cases.'),
}

# Cases whose text changed in commit 3bd08a7 (video-authoritative edits, landed mid-run)
# + the one added case (SBC-EXP-16, outside this 515 population). Sense verdicts below
# apply to the PRE-EDIT text at snapshot 674af30 — re-check these after the video edits.
VIDEO_EDITED = {
 'IV-LOC-01','IV-LOC-04','PV-API-01','PV-API-02','PV-EXP-08','PV-FILT-01','PV-FILT-09',
 'PV-FILT-10','PV-FILT-13','PV-ROW-05','SBC-EXP-01','SBC-EXP-13','SBC-EXP-14','SBC-LBL-01',
 'SBC-LBL-02','SBC-LBL-03','SBC-LBL-04','SBC-LOC-03','SBR-LOC-03','SBR-LOC-04','TU-LOC-01',
 'TU-LOC-05','TU-NAV-01','WIP-COL-05','WIP-EXP-07','WIP-FLT-03','WIP-SORT-03',
}

SENSIBLE_REASON = ('Cold-read PASS: preconditions reachable (seeding stated where needed), steps '
                   'executable in order, expected follows, no contradiction, every control '
                   'spec-traceable, domain logic sound, pass/fail observable.')

def main():
    with open(CSV_PATH, newline='') as fh:
        rows = list(csv.DictReader(fh))
    assert len(rows) == 515, len(rows)

    import collections
    counts = collections.Counter()
    per = collections.defaultdict(collections.Counter)
    for r in rows:
        cid = r['internal_id']
        if cid in NONSENSE:
            v, reason = 'NONSENSE', NONSENSE[cid]
        elif cid in FIX:
            v, reason = 'FIX-WORDING', FIX[cid]
        else:
            v, reason = 'SENSIBLE', SENSIBLE_REASON
        if cid in VIDEO_EDITED:
            reason += (' [NOTE: this case was video-edited concurrently (commit 3bd08a7) — this '
                       'sense verdict applies to the PRE-EDIT text; re-check after the video '
                       'edits land.]')
        r['sense_verdict'] = v
        r['sense_reason'] = reason
        counts[v] += 1
        per[r['report']][v] += 1

    fieldnames = list(rows[0].keys())
    with open(CSV_PATH, 'w', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)

    print('TOTAL', sum(counts.values()), dict(counts))
    for rep in ['SBC', 'SBR', 'PV', 'TU', 'WIP', 'IV']:
        print(rep, dict(per[rep]), 'total', sum(per[rep].values()))
    # embarrassment check: any KEEP that is NONSENSE?
    bad = [r['internal_id'] for r in rows if r['verdict'] == 'KEEP' and r['sense_verdict'] == 'NONSENSE']
    print('KEEP-but-NONSENSE (embarrassment check):', bad or 'none')

if __name__ == '__main__':
    main()
