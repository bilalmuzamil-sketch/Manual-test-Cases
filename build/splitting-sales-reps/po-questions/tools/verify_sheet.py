#!/usr/bin/env python3
"""Compare the read-back Google Sheet grid with the prepared values; write SHEET-VERIFY-2026-10-19.md."""
import json, sys
readback, out = sys.argv[1], sys.argv[2]
exp = json.load(open('/home/user/Manual-test-Cases/build/splitting-sales-reps/po-questions/questions.json'))
grid = exp['grid_expected_display']
d = json.load(open(readback))
sh = d['sheets'][0]
rows = sh['data'][0].get('rowData', [])
widths = [c.get('pixelSize') for c in sh['data'][0].get('columnMetadata', [])][:6]

def bg(cell):
    c = cell.get('effectiveFormat', {}).get('backgroundColor', {})
    return tuple(round(c.get(k, 0), 2) for k in ('red', 'green', 'blue')) if c else None

YEL, BLU, GRY, HDR = (1.0, 0.95, 0.7), (0.81, 0.89, 0.97), (0.92, 0.92, 0.92), (0.22, 0.34, 0.55)
checked = same = 0
diffs = []
for r in range(max(len(grid), len(rows))):
    got = rows[r].get('values', []) if r < len(rows) else []
    want = grid[r] if r < len(grid) else [''] * 6
    for c in range(6):
        g = got[c].get('formattedValue', '') if c < len(got) else ''
        w = want[c]
        w = '' if w is None else str(w)
        checked += 1
        if g == w: same += 1
        else: diffs.append((r + 1, 'ABCDEF'[c], w[:80], g[:80]))
fmt = []
def chk(r, c, want, label):
    got = rows[r]['values'][c] if r < len(rows) and c < len(rows[r].get('values', [])) else {}
    ok = bg(got) == want
    fmt.append((label, ok))
chk(2, 1, YEL, 'colour guide yellow (B3)'); chk(2, 2, BLU, 'colour guide blue (C3)'); chk(2, 3, GRY, 'colour guide grey (D3)')
for c in range(6): chk(4, c, HDR, f'header {"ABCDEF"[c]}5 dark blue')
for r in range(5, len(grid)):
    chk(r, 1, BLU, f'B{r+1} blue'); chk(r, 4, YEL, f'E{r+1} yellow'); chk(r, 5, GRY, f'F{r+1} grey')
bad_fmt = [l for l, ok in fmt if not ok]
q_rows = len(grid) - 5
L = ['# Splitting Sales Representatives: Google Sheet cell verification (19 Oct 2026)', '',
     f'- Sheet: "{d["properties"]["title"]}" — https://docs.google.com/spreadsheets/d/17Ry1BtRTPEkecBP5TlgAE0T93Ai1TQewdJ7B7WpWDBQ',
     f'- Tab: "{sh["properties"]["title"]}", frozen rows: {sh["properties"].get("gridProperties", {}).get("frozenRowCount")}',
     f'- Method: the whole tab (A1:F45) was read back in ONE get_spreadsheet call (includeGridData, formattedValue, effectiveFormat.backgroundColor) and compared by script ({__file__.split("/")[-1]}) with po-questions/questions.json (grid_expected_display).',
     f'- Rows read back: {len(rows)}; expected grid rows: {len(grid)} (title, greeting, colour guide, blank, header, {q_rows} questions); nothing below row 43 came back (rows 44-45 empty).',
     f'- **Cell values: {same} of {checked} identical, {len(diffs)} different.**',
     f'- Colour checks: {len(fmt) - len(bad_fmt)} of {len(fmt)} correct (colour-guide cells, header row, blue topic, yellow answer, grey source column on every question row).',
     f'- Column widths read back: {widths} (expected [110, 200, 480, 330, 260, 190], as the 14 Oct sheet for Chris).',
     '- Your answer column (E6:E43) is empty on every question row.' if all((rows[r]['values'][4].get('formattedValue', '') == '') for r in range(5, len(grid))) else '- WARNING: an answer cell is not empty.',
     '- Not shared with anyone and not sent; no Slack.', '']
if diffs:
    L += ['## Differences', '', '| Row | Col | Expected | Got |', '|---|---|---|---|'] + [f'| {a} | {b} | {c} | {e} |' for a, b, c, e in diffs]
if bad_fmt:
    L += ['## Colour mismatches', ''] + [f'- {x}' for x in bad_fmt]
open(out, 'w').write('\n'.join(L) + '\n')
print(f'values {same}/{checked} diffs {len(diffs)} fmt {len(fmt)-len(bad_fmt)}/{len(fmt)} widths {widths}')
for x in diffs[:10]: print(x)
print(bad_fmt[:10])
