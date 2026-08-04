#!/usr/bin/env python3
"""
Standing Rule 49 — merge the three batches' RECHECK-ROWS.md into the master
build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md, keeping it STATUS: OPEN with the
build marker v3.4.1-0ed4433.

Additive only: the master's own 35 rows are untouched; the three batch tables are
appended as clearly-labelled sections before <!-- RECHECK-ROWS-END -->, plus the rows
this push created (the 37 edited + 3 new cases, each PROVISIONAL against a non-final
build).
"""
import os, re, json, csv

RS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIU = os.path.join(RS, 'viu-2026-08-03')
MASTER = os.path.join(VIU, 'RECHECK-QUEUE.md')
PUSH = os.path.join(RS, 'viu-push-2026-08-04')

BATCHES = [('batch-sbc-sbr', 'Sales By Customer + Sales By Representative'),
           ('batch-pv-tu', 'Parts Velocity + Technician Utilization'),
           ('batch-wip-iv', 'Work In Progress + Inventory Value')]


def tables(path):
    """Return every markdown table in the file that is a CASE table (its header row
    mentions a case or C-id column), as (header, sep, rows)."""
    lines = open(path).read().split('\n')
    out, i = [], 0
    while i < len(lines):
        if lines[i].startswith('|') and i + 1 < len(lines) and re.match(r'^\|[\s\-:|]+\|$', lines[i + 1]):
            hdr, sep, rows = lines[i], lines[i + 1], []
            j = i + 2
            while j < len(lines) and lines[j].startswith('|'):
                rows.append(lines[j]); j += 1
            low = hdr.lower()
            if ('c-id' in low or 'case' in low) and 'marker' not in low:
                out.append((hdr, sep, rows))
            i = j
        else:
            i += 1
    return out


def main():
    master = open(MASTER).read()
    assert 'STATUS: **OPEN**' in master
    assert 'v3.4.1-0ed4433' in master
    assert '<!-- RECHECK-ROWS-END -->' in master

    idmap = {int(r['testrail_case_id'].lstrip('C')): r['internal_id']
             for r in csv.DictReader(open(os.path.join(RS, 'testrail-id-map.csv')))}
    recs = [json.loads(l) for l in open(os.path.join(PUSH, 'exec-log.jsonl'))]

    blocks, total = [], 0
    for d, label in BATCHES:
        p = os.path.join(VIU, d, 'RECHECK-ROWS.md')
        ts = tables(p)
        n = sum(len(r) for _, _, r in ts)
        total += n
        blocks.append(f'\n### MERGED {label} — {n} rows\n\n'
                      f'*Source `{d}/RECHECK-ROWS.md`, merged 2026-08-04. Build marker '
                      f'`v3.4.1-0ed4433`, unchanged at the start and the end of that pass. '
                      f'Every row PENDING.*\n')
        for hdr, sep, rows in ts:
            blocks.append('\n'.join([hdr, sep] + rows) + '\n')

    # rows created by the 2026-08-04 push itself
    pushed = [(r['cid'], r['fields_changed']) for r in recs if r['op'] == 'update_case']
    added = [(r['cid'], r['internal_id']) for r in recs if r['op'] == 'add_case']
    L = [f'\n### MERGED the 2026-08-04 authorised push — {len(pushed) + len(added)} rows\n',
         '*Every case CHANGED or CREATED on 2026-08-04 was changed **on the strength of a '
         'non-final build**, so each carries its own re-check obligation: when the build settles, '
         'confirm the wording we adopted is still what the build shows. A row that flips to '
         'CHANGED is a reportable finding, not a silent correction. Audit: '
         '`../viu-push-2026-08-04/testrail-execution-log.md`.*\n',
         '| Internal ID | C-id | What was changed on the strength of this build | Re-check obligation | Re-check outcome |',
         '|---|---|---|---|---|']
    FN = {'title': 'title', 'custom_preconds': 'preconditions', 'custom_steps': 'steps',
          'custom_expected': 'expected result', 'refs': 'refs'}
    WHAT = {
        30104: 'steps rewritten: a custom range is picked on the calendar inside the picker (no "Custom" item exists)',
        30202: 'same steps fix',
        30313: 'Standing Rule 24 tester note added — the back end still accepts the sales-rep change',
        30346: 'header label "Turns / Yr" -> "Turns/Yr"', 30351: 'same label', 30353: 'same label',
        30386: 'made layman-runnable: no devtools, no pixel measurement',
        30423: 'filter label "Filter by Technician" -> "Technician"',
        30425: '"Select all" -> "All technicians" (no Select all control exists)',
        30442: '"All Locations" -> "All locations" + "Clear all"; the Rule-42 hedge replaced with the observed Location column and "Multiple"',
        30452: 'tab labels title-cased and each shown with its count',
        30457: 'the Declined status dropped — the build has no such status',
        30466: 'precondition: Location is a column-selector toggle, not automatic',
        30467: 'Location IS in the column selector, off by default (also resolved an internal contradiction with C30466/C30507)',
        30469: 'status label "In Progress" -> "In progress"',
        30495: 'tester note — the Inv. Hrs total cannot be checked in a download on this build',
        30502: 'steps made executable + the build\'s refusal message quoted; the 366-vs-367 cap deliberately not asserted',
        30511: 'the Location mechanism corrected + the Inv. Hrs export refusal noted',
        30538: 'steps made executable — no pagination control exists; S1-R8 KEPT',
        30551: '"Qty on Hand" -> "Qty" + the Location mechanism',
        30552: '"Qty on Hand" -> "Qty"', 30554: 'the Location mechanism only (items 1-2 held as a build defect)',
        30555: 'tester note — no part exists without a category on this build',
        30556: 'totals label "Total" -> "Totals"',
        30557: 'the server sums unrounded values, so a hand sum can differ by a few cents; also "Qty on Hand" -> "Qty"',
        30566: 'steps: dates are picked on the inline calendar',
        30570: 'steps made executable (scrolling, not pages)',
        30580: '"Qty on Hand" -> "Qty" + the Location mechanism',
        30585: '"Qty on Hand" -> "Qty" (found by the Rule-28 sweep, in no batch list)',
        30588: 'the Location mechanism only (item 1 held as a build defect)',
        30590: 'tester note — the PDF and the CSV phrase the as-of line differently',
        30593: 'tester note — the cap is unreachable on this estate',
        30595: 'tester note — a large PDF fails with a plain error after ~30 s',
        38916: 'the Location mechanism corrected',
        38917: 'the Location mechanism corrected (added by the Rule-28 sweep)',
        38918: 'tester note — the cap is unreachable on this estate',
    }
    for cid, flds in sorted(pushed):
        iid = idmap.get(cid, '?')
        L.append(f'| `{iid}` | [C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid}) | '
                 f'{WHAT.get(cid, ", ".join(FN.get(f, f) for f in flds))} | Re-read the same surface on the '
                 f'settled build and confirm the adopted wording still matches | **PENDING** |')
    for cid, iid in sorted(added):
        L.append(f'| `{iid}` | [C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid}) | '
                 f'NEW case authored from this build\'s behaviour | Re-drive it end to end; if the '
                 f'behaviour it describes is fixed, the case becomes a regression guard | **PENDING** |')
    blocks.append('\n'.join(L) + '\n')
    total += len(pushed) + len(added)

    marker = '<!-- RECHECK-ROWS-END -->'
    add = ('\n## MERGED BATCH ROWS (2026-08-04)\n\n'
           f'The three per-report batches and the authorised push of 2026-08-04 add **{total} '
           'further rows** to this queue. They are appended here rather than folded into the 35 '
           'rows above, so the provenance of each row stays readable. **This queue stays OPEN.**\n'
           + '\n'.join(blocks) + '\n')
    master = master.replace(marker, add + '\n' + marker)
    master = master.replace(
        '**35 rows · 0 re-checked · 35 PENDING.**',
        f'**35 rows in the original table + {total} merged batch/push rows = '
        f'{35 + total} rows · 0 re-checked · ALL PENDING.**')
    open(MASTER, 'w').write(master)
    print(f'merged {total} rows into RECHECK-QUEUE.md (still OPEN, marker v3.4.1-0ed4433)')


if __name__ == '__main__':
    main()
