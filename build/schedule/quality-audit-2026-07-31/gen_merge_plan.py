#!/usr/bin/env python3
"""Generates MERGE-PLAN.md from gen_verdicts.py's verdict data (deterministic, Rule 16
mirror of build/report-suite/quality-audit-2026-07-28/MERGE-PLAN.md)."""
import json, glob, csv, os
import gen_verdicts as V

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'MERGE-PLAN.md')

cases = {c['id']: c for c in V.load()}
idmap = {r['internal_id']: r for r in csv.DictReader(open(os.path.join(V.BASE, 'testrail-id-map.csv')))}

def ref(cid):
    tr = idmap.get(cid, {}).get('testrail_case_id', '').strip()
    link = 'https://shopview.testrail.io/index.php?/cases/view/%s' % tr.lstrip('C') if tr else 'new, no C-ID yet'
    return tr or 'new, no C-ID yet', link

member_reasons = {  # one-line why each member folds in
 'SCH-NAV-02': 'Layout read happens in the same open-the-page sitting as the nav click; two assertions, not a separate flow.',
 'SCH-REAS-04': "Same observation as the survivor (right-click, read the menu) — the 'no View Day' negative is one expected line.",
 'SCH-REAS-05': "Same observation as the survivor — the 'no New Shift' negative is one expected line.",
 'SCH-WOL-03': 'WO-number search is a fourth keystroke sequence in the same search box the survivor already exercises three times.',
 'SCH-LINE-02': 'The header is read the moment the drill-down opens in the survivor; two assertions, same sitting.',
 'SCH-SCOPE-04': 'Reading the line rows happens while reading the pinned whole-order row — one read-the-picker case.',
 'SCH-SCOPE-06': "Select-all and Cancel are exercised inside the same 'Select multiple' session the survivor opens.",
 'SCH-SPREAD-01': 'The header is read on arriving at the spread step, immediately before the survivor clicks its back-link.',
 'SCH-BLOCK-03': "Duplicates the survivor's block-VIN assertions (day/week add, month omits) — the survivor already states all of it.",
 'SCH-DAY-07': "The day-view lane growth is one expected line the survivor's day-view step already passes through.",
 'SCH-BLOCK-04': 'Default blue = SCH-COLOR-01; picker recolour = the survivor; the one NEW assertion (per-shift, not per-WO) folds in.',
 'SCH-LANE-05': 'Same observable as the survivor (two non-overlapping same-day shifts, one lane, no conflict) — only the two-WO setup differs.',
 'SCH-DAY-02': 'The not-overridden half of the same auto-scroll contract, tested in the same day-view session.',
 'SCH-EVT-04': 'The all-day toggle is one of the fields the survivor already fills; its behaviour is one more step.',
 'SCH-CONF-04': 'Mirror of the survivor (after- vs before-hours) — same shift, same day-view sitting, second drag.',
 'SCH-VIEW-07': 'Pure show/hide flip on the popover the survivor already has open.',
 'SCH-VIEW-08': 'Pure show/hide flip on the popover the survivor already has open.',
 'SCH-DEL-07': 'Each action in the survivor already ends with the toast + the Undo click — the toast-presence sweep adds no new observation.',
 'SCH-KEY-02': "Contained in the survivor's layered-Escape contract; the in-modal sub-pickers become explicit layers.",
 'SCH-KEY-04': 'The exception half of the same Enter contract, tested in the same dialogs session.',
 'SCH-HRS-01': 'The toggle reveal is step 1 of reaching the editor the survivor tests.',
 'SCH-HRS-07': 'A second scenario in the same validation editor the survivor already has open.',
 'SCH-EXP-02': 'Reading the exported content happens in the same export the survivor opens.',
}

lines = []
lines.append('# Schedule — Consolidation (Merge/Cut) Plan — 2026-07-31\n')
lines.append('**Companion to:** `USEFULNESS-AUDIT-2026-07-31.md` + `per-case-verdicts.csv` (same folder).')
lines.append('**Source snapshot:** `build/schedule/cases/*.json` at git SHA `%s` (working tree clean for this folder at snapshot time).' % V.SNAP_SHA)
lines.append('**Status: PROPOSAL ONLY — nothing has been edited.** No case JSON was touched, no TestRail writes were made (Standing Rule 6). The user can approve the whole plan, per-group, or reject it.\n')
lines.append('## What this plan does\n')
lines.append('- **%d merge groups** absorb **%d member cases** into their named survivors (the survivor gains the members\' steps/expected lines — no coverage is lost).' % (len(V.MERGES), sum(len(m) for _, m, _ in V.MERGES.values())))
lines.append('- **%d outright cuts** (literal duplicates, named).' % len(V.CUTS))
lines.append('- Result: **190 → 165 cases** with identical behavioural coverage.')
lines.append('- A further **19 WEAK-KEEP** cases are flagged (legitimate but low-value / verify-once); dropping them too would give **146**. The recommendation is to KEEP them but tag them "build-acceptance / verify once" rather than per-cycle regression.')
lines.append('- **HELD-pending-Branko cases are NOT touched by any group:** SCH-EVT-08 (C30615), SCH-CAP-01..04 (C30030–C30033), SCH-MODAL-08 (C30015) keep their held status; this plan proposes no edit to them.\n')
lines.append('Execution note (if approved): this is a TestRail `update_case` (survivor gains steps) + `delete_case` (members/cuts, bodies kept locally marked Retired) pass — it requires fresh explicit authorization per Standing Rule 6, a per-case audit log with re-GET verification, refs preserved onto the survivor (Rule 20), and regeneration of the import + id-map afterwards. The suite is still pre-VIU (spec-only) — merging BEFORE the live VIU pass is the cheap moment to do it.\n')
lines.append('## Merge groups\n')
for g, (surv, members, gain) in V.MERGES.items():
    tr, link = ref(surv)
    lines.append('### %s' % g)
    lines.append('- **Survivor:** %s (%s, %s) — "%s"' % (surv, tr, link, cases[surv]['title']))
    lines.append('- **Absorbs:**')
    for m in members:
        mtr, mlink = ref(m)
        lines.append('  - %s (%s, %s) — "%s" — %s' % (m, mtr, mlink, cases[m]['title'], member_reasons[m]))
    lines.append('- **What the survivor gains:** %s' % gain)
    lines.append('- **Refs to fold into the survivor (Rule 20):** %s' % '; '.join('%s: `%s`' % (m, cases[m].get('refs', '')) for m in members))
    lines.append('')
lines.append('## Outright cuts\n')
for cid, why in V.CUTS.items():
    tr, link = ref(cid)
    lines.append('- **%s** (%s, %s) — "%s"\n  - %s\n  - Refs recorded for the audit trail: `%s`' % (cid, tr, link, cases[cid]['title'], why, cases[cid].get('refs', '')))
lines.append('')
lines.append('## Approval\n')
lines.append('Reply per-group (e.g. "approve G-CELL-MENU, G-VIN-TOGGLE; hold the rest"), or "approve all", or "reject". Nothing is executed without that authorization (Standing Rule 6).')

open(OUT, 'w').write('\n'.join(lines) + '\n')
print('wrote', OUT, len(lines), 'lines')
