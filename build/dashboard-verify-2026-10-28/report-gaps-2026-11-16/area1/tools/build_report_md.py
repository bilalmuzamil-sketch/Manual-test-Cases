"""Write the consolidated findings report (markdown) from findings_data.py — same data as the workbook."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from findings_data import FINDINGS, CHECKS
from build_workbook import TABS
ROOT = os.path.dirname(HERE)
L = ['# ShopView — Dashboard and Reports full check · 28 Oct 2026', '',
     '**Build:** staging `v26.43.2-f8698cb` (checked at start, after the container restart, and at the end) · **Role:** Admin · '
     '**Locations:** Staging Heavy Duty - 9919, Staging Lethbridge - 4310, QB Location, DVI Test · **TestRail:** not touched · **Jira:** nothing created.',
     '', 'Workbook with the same content: `ShopView-Dashboard-and-Reports-Full-Check-Findings-2026-10-28.xlsx` (Summary tab, one tab per outcome, PO questions).', '',
     '## Checks run', '', '| Area | Checks | Passed | Failed / held | Notes |', '|---|---|---|---|---|']
fmt = lambda v: '—' if v is None else f'{v:,}'
L += [f'| {a} | {fmt(b)} | {fmt(c)} | {fmt(d)} | {e} |' for a, b, c, d, e in CHECKS]
for key, name, meaning in TABS:
    rows = [f for f in FINDINGS if f['status'] == key]
    L += ['', f'## {name} ({len(rows)})', '', meaning, '', '| # | Report / tile | What is wrong | Written source | PO question | Draft |', '|---|---|---|---|---|---|']
    L += [f"| {f['id']} | {f['report']} | {f['finding']} | {f['source']} | {f['question']} | `{f['files']}` |" for f in rows]
open(os.path.join(ROOT, 'ShopView-Dashboard-and-Reports-Full-Check-2026-10-28.md'), 'w').write('\n'.join(L) + '\n')
print('ok', len(FINDINGS))
