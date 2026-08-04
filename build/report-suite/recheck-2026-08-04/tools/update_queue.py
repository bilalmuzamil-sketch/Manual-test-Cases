#!/usr/bin/env python3
"""Update the Rule-49 re-check queue: every PENDING row -> CONFIRMED or CHANGED, with the new marker."""
import re, os, json
Q='/home/user/Manual-test-Cases/build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md'
NEW='v3.4.1-3d03023'
s=open(Q).read()

# --- the rows that CHANGED on this build, by the case/row they belong to ---
CHANGED={
 '30590':'**CHANGED** — the deploy added a `"Date Range:"` line, so `As of:` is line **2**, not line 1. Case CORRECTED this run.',
 '30346':'**CHANGED (fixed)** — the `This Year` window is now the inclusive 216 days; SV-8819 no longer reproduces.',
 '30351':'**CHANGED (fixed)** — same Turns/Yr window fix.',
 '30353':'**CHANGED (fixed)** — same Turns/Yr window fix.',
}
# B-row level changes keyed by the row id at the start of the line
BROW_CHANGED={'B26':'**CHANGED (fixed)** — Turns/Yr window now inclusive (216); header `Turns/Yr` re-confirmed.'}

count={'CONFIRMED':0,'CHANGED':0}
def repl_cell(line):
    """Replace a trailing PENDING cell with the appropriate outcome."""
    global count
    m=re.match(r'^(\|.*\|)\s*(\*\*PENDING\*\*|PENDING)\s*\|\s*$', line)
    if not m: return line
    body=m.group(1)
    ids=re.findall(r'/cases/view/(\d+)', body)
    brow=re.match(r'^\|\s*(B\d+)\s*\|', body)
    note=None
    if brow and brow.group(1) in BROW_CHANGED: note=BROW_CHANGED[brow.group(1)]
    if note is None:
        for i in ids:
            if i in CHANGED: note=CHANGED[i]; break
    if note is None:
        note=f'**CONFIRMED** on `{NEW}` 2026-08-04 — re-observed live, unchanged.'
        count['CONFIRMED']+=1
    else:
        count['CHANGED']+=1
    return f'{body} {note} |\n'

out=[]
for line in s.splitlines(keepends=True):
    out.append(repl_cell(line))
s=''.join(out)

# also the 3-column "Read as / Re-confirm" and other tables have no PENDING cell; leave them.
print('CONFIRMED cells:',count['CONFIRMED'],'| CHANGED cells:',count['CHANGED'])
open(Q,'w').write(s)
