#!/usr/bin/env python3
"""SV-11885: scan downloaded report CSVs (raw text, as a plain text editor shows it) for formula-trigger cells.
Classes per cell: UNGUARDED text starting with = + - @ TAB CR; GUARDED = one apostrophe then one of those; DOUBLE = two apostrophes;
NUMBER = a plain/negative number or money (must NOT carry an apostrophe); GUARDED_NUMBER = an apostrophe in front of a number (a defect too).
Prints a bounded summary; writes <dir>/_scan.json. Usage: sv11885_scan.py <dir>"""
import csv, json, os, re, sys, io
D = sys.argv[1]; TRIG = ('=', '+', '-', '@', '\t', '\r')
NUM = re.compile(r'^[-+]?\(?\$?-?[\d,]*\.?\d+\)?%?$')
res = {}
for f in sorted(os.listdir(D)):
    if not f.endswith('.csv'): continue
    raw = open(os.path.join(D, f), 'rb').read().decode('utf-8-sig', errors='replace')
    rows = list(csv.reader(io.StringIO(raw, newline='')))
    head = rows[0] if rows else []; body = rows[1:]
    r = {'rows': len(body), 'columns': head, 'unguarded': [], 'guarded': [], 'double': [], 'guarded_number': [], 'numbers_signed': 0}
    for i, row in enumerate(body):
        for j, c in enumerate(row):
            col = head[j] if j < len(head) else f'col{j}'
            if not c: continue
            if NUM.match(c.strip()):
                if c[0] in '-+': r['numbers_signed'] += 1
                continue
            if c.startswith("''"): r['double'].append([i + 2, col, c[:60]])
            elif c.startswith("'") and len(c) > 1 and (c[1] in TRIG):
                (r['guarded_number'] if NUM.match(c[1:].strip()) else r['guarded']).append([i + 2, col, c[:60]])
            elif c[0] in TRIG: r['unguarded'].append([i + 2, col, c[:60]])
    res[f] = r
    print(f"{f[:60]:60} rows {r['rows']:4} | unguarded {len(r['unguarded']):3} guarded {len(r['guarded']):3} double {len(r['double'])} guarded_number {len(r['guarded_number'])} signed_numbers {r['numbers_signed']}")
    for k in ('unguarded', 'guarded', 'double', 'guarded_number'):
        for x in r[k][:4]: print(f'   {k:15} line {x[0]} [{x[1]}] {x[2]!r}')
json.dump(res, open(os.path.join(D, '_scan.json'), 'w'), indent=1)
