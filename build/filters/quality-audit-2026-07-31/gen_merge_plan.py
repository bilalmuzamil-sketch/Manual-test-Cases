#!/usr/bin/env python3
"""Filters audit 2026-07-31 — generates MERGE-PLAN.md from gen_verdicts data.
Recommendation only — nothing edited locally or in TestRail (Standing Rule 6)."""
import csv, json, glob, os
import gen_verdicts as G

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'MERGE-PLAN.md')

idmap = {r['internal_id']: r['testrail_case_id'].strip()
         for r in csv.DictReader(open(G.IDMAP))}
titles = {}
for f in sorted(glob.glob(G.CASES_GLOB)):
    for c in json.load(open(f)):
        titles[c['id']] = c['title']

def ref(cid):
    tr = idmap.get(cid, '')
    if tr:
        return '%s (%s, https://shopview.testrail.io/index.php?/cases/view/%s)' % (cid, tr, tr.lstrip('C'))
    return '%s (new, no C-ID yet — design-level pending queue)' % cid

lines = []
lines.append('# Filters — Consolidation (Merge/Cut) Plan — 2026-07-31')
lines.append('')
lines.append('**Companion to:** `USEFULNESS-AUDIT-2026-07-31.md` + `per-case-verdicts.csv` (same folder).')
lines.append('**Source snapshot:** `build/filters/cases/*.json` at git SHA `7eeb74548eae665f5ac5110512fddc0c8550db41` (working tree clean for `build/filters` at snapshot time).')
lines.append('**Status: PROPOSAL ONLY — nothing has been edited.** No case JSON was touched, no TestRail writes were made (Standing Rule 6). Approve wholesale or per-group.')
lines.append('')
lines.append('## What this plan does')
lines.append('')
n_members = sum(len(m) for _, m, _ in G.MERGES.values())
lines.append('- **%d merge groups** absorb **%d member cases** into their named survivors (the survivor gains the members\' checks — no coverage is lost).' % (len(G.MERGES), n_members))
lines.append('- **%d outright cuts** (2 in-suite duplicates + the 9-case Command-K block that duplicates the Global Search project\'s suite — that block is PENDING BRANKO Q6; the PO decides, this plan only flags).' % len(G.CUTS))
lines.append('- Result: **137 → 74 cases** with identical behavioural coverage (71 KEEP + 3 WEAK-KEEP).')
lines.append('- **3 WEAK-KEEP** cases stay, flagged low-value; dropping them too would give 71.')
lines.append('')
lines.append('Execution note (if approved): 25 of the 52 merge members and 2 of the 11 cuts are LIVE in TestRail'
             ' (an `update_case` on each survivor + `delete_case` on members/cuts, fresh explicit authorization,'
             ' per-case audit log, re-GET verification, id-map + import regeneration, bodies kept locally marked'
             ' Retired). The other 27 members + the 9-case Command-K block have NO C-ids — those merges/cuts are'
             ' a LOCAL edit only, cheapest applied at the Branko-PRD reconciliation BEFORE any push.')
lines.append('')
lines.append('## Merge groups')
lines.append('')
for g, (surv, members, gains) in G.MERGES.items():
    lines.append('### %s' % g)
    lines.append('- **Survivor:** %s — "%s"' % (ref(surv), titles[surv]))
    lines.append('- **Absorbs:**')
    for m in members:
        lines.append('  - %s — "%s"' % (ref(m), titles[m]))
    lines.append('- **What the survivor gains:** %s' % gains)
    lines.append('')
lines.append('## Cuts')
lines.append('')
for cid, reason in G.CUTS.items():
    lines.append('- %s — "%s" — %s' % (ref(cid), titles[cid], reason))
lines.append('')
lines.append('## Weak-keeps (kept, flagged)')
lines.append('')
for cid, reason in G.WEAK.items():
    lines.append('- %s — "%s" — %s' % (ref(cid), titles[cid], reason))
lines.append('')

open(OUT, 'w').write('\n'.join(lines))
print('Wrote', OUT, '-', len(lines), 'lines')
