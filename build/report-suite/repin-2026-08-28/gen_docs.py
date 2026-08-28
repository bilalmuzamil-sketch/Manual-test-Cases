#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate the two list deliverables from CLASSIFICATION.csv. No TestRail call."""
import csv, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
L = 'https://shopview.testrail.io/index.php?/cases/view/%s'
rows = {r['cid']: r for r in csv.DictReader(open(os.path.join(HERE, 'CLASSIFICATION.csv')))}
written = {json.loads(l)['cid'] for l in open(os.path.join(HERE, 'REPINNED.jsonl'))}
assess = json.load(open(os.path.join(HERE, 'assessment.json')))

CAT = {'impacted-hold': 'cites a changed anchor (hand-assessed this pass)',
       'multi-block-cleared': 'content proven current by the anchor diff',
       'no-anchor': 'cites no spec anchor, so currency is unproven'}

ui, auto = [], []
for cid, r in sorted(rows.items(), key=lambda x: int(x[0][1:])):
    if cid in written:
        continue
    if r['automated'] == 'YES':
        auto.append(r)
        continue
    ui.append(r)


def reason(r):
    if r['container_expected'] != 'markdown fr-view':
        return ('Escaping container. Its Expected Result renders in a bare `markdown` '
                'container, so any API write turns the wrapper TestRail adds into literal '
                '`<p>` text on the tester\'s screen.')
    if r['expected_top_level_blocks'] != '1':
        return ('Multi-block body (%s top-level blocks). The API sanitiser keeps only one '
                'top-level block and nests the rest inside it, silently restructuring the '
                'body.' % r['expected_top_level_blocks'])
    return assess.get(r['cid'], {}).get('why', 'held')


out = ['# Report Suite re-pins that must NOT go through the API — 2026-08-28',
       '',
       'These cases are **approved for a re-pin and still un-re-pinned**. Each one is listed with',
       'the pin it needs. None was written this pass, and none may be written through',
       '`update_case`: the reason is in the last column and it is a property of the case, not a',
       'preference.',
       '',
       'The safe route for all of them is the **TestRail UI editor** (the route proven on the 71',
       'cases repaired on 2026-08-28 — `build/report-suite/damage-2026-08-26/ui_repair_batch.mjs`).',
       'A UI save also flips the field to the rendering container, so a case repaired that way',
       'stops being fragile.',
       '',
       '**Nothing here is done without the QA lead\'s go-ahead (Rule 6).**',
       '',
       '| C-id | Report | Pin now → needs | Expected container | Blocks | Why the API is barred | Link |',
       '|---|---|---|---|---|---|---|']
for r in ui:
    out.append('| %s | %s | %s → **%s** | `%s` | %s | %s | %s |' % (
        r['cid'], r['report'], r['current_pin'], r['intended_pin'],
        r['container_expected'], r['expected_top_level_blocks'],
        reason(r).replace('\n', ' '), L % r['cid'][1:]))
out += ['', '## Count', '',
        '**%d cases** need the UI route.' % len(ui), '',
        '| Reason | Count |', '|---|---|']
esc = [r for r in ui if r['container_expected'] != 'markdown fr-view']
mb = [r for r in ui if r['container_expected'] == 'markdown fr-view' and r['expected_top_level_blocks'] != '1']
other = [r for r in ui if r not in esc and r not in mb]
out += ['| Escaping `markdown` container — an API write is visible damage | %d |' % len(esc),
        '| Renders fine but the body is multi-block — an API write restructures it | %d |' % len(mb),
        '| Renders fine and single-block, but held on content/judgement (see the assessment) | %d |' % len(other),
        '',
        '## OUTSTANDING — what I need from you', '',
        '1. Go-ahead to run the proven UI editor route over the %d cases above.' % len(ui),
        '2. The %d content/judgement holds are separate — they are in `HELD-25-ASSESSMENT.md` and'
        ' need a decision before any route is used.' % len(other)]
open(os.path.join(HERE, 'NEEDS-UI-ROUTE.md'), 'w').write('\n'.join(out) + '\n')

out = ['# Report Suite — Automated cases held for the QA lead — 2026-08-28',
       '',
       'Rule 71: a case TestRail flags as **Automated** (`custom_atmstatus = 3`) is read-assessed',
       'and then held. **Not one of these was written, and not one was opened for editing.**',
       '',
       'All of them are in the approved Group C re-pin set — the change each needs is the cited',
       'specification version bumped to the live version. **Bookkeeping only; no behaviour changes.**',
       '',
       'The `Expected container` column matters: **%d of the %d** render their Expected Result in a'
       % (sum(1 for r in auto if r['container_expected'] != 'markdown fr-view'), len(auto)),
       'bare `markdown` container, so even with permission they must go through the TestRail UI',
       'editor, never the API.',
       '',
       '| C-id | Report | Pin now → needs | Expected container | Safe route if released | Link |',
       '|---|---|---|---|---|---|']
for r in auto:
    route = 'UI editor only' if r['container_expected'] != 'markdown fr-view' else (
        'API is safe' if r['expected_top_level_blocks'] == '1' else 'UI editor only (multi-block)')
    out.append('| %s | %s | %s → **%s** | `%s` | %s | %s |' % (
        r['cid'], r['report'], r['current_pin'], r['intended_pin'],
        r['container_expected'], route, L % r['cid'][1:]))
out += ['', '**%d Automated cases, %d untouched.**' % (len(auto), len(auto)), '',
        'Separately, **C30518** (also Automated) is still carrying render damage from the',
        '2026-08-26 pass and still needs its own go-ahead — see',
        '`build/report-suite/damage-2026-08-26/FINAL-SUMMARY.md` §3.',
        '',
        '## OUTSTANDING — what I need from you', '',
        '1. Per-case (or blanket) go-ahead to re-pin these %d Automated cases.' % len(auto),
        '2. Vlad still needs to be told, per Rule 65, for any of them we do change.']
open(os.path.join(HERE, 'AUTOMATED-HELD.md'), 'w').write('\n'.join(out) + '\n')
print('UI route:', len(ui), ' (escaping %d, multi-block %d, judgement %d)' % (len(esc), len(mb), len(other)))
print('Automated held:', len(auto))
