#!/usr/bin/env python3
"""Derive the INTENDED plain-text content for the 5 cases my writes damaged.

The intended value is NOT "what is stored now" (that is the damage) and NOT "whatever the
API returns" — it is the case's ORIGINAL PLAIN TEXT, taken from the pre-write snapshot this
session committed BEFORE it wrote, plus only the substitutions the QA lead approved.

No <br>. No <p>. The UI editor supplies the block structure itself, and a UI save moves the
case into the `markdown fr-view` container, which is what actually ends the damage.

Blocks format required by the repair runner (reused from the proven 2026-08-26 script):
  fields[f].blocks = [ block, block, … ]  where block = [ line, line, … ]
  -> Enter between blocks, Shift+Enter between lines inside a block.
"""
import json, os, re, sys

PASS = '/home/user/Manual-test-Cases/build/build-verify-session-2026-08-21'
OUT = f'{PASS}/repair-2026-08-25'
os.makedirs(OUT, exist_ok=True)

# case -> (snapshot filename, {field: [(old, new), …]})
PLAN = {
    '44874': ('snapshots/batch/PRE-C44874.json', {
        'custom_expected': [("matching \\'Fib\\'", 'matching "Fib"')]}),
    '44875': ('snapshots/batch/PRE-C44875.json', {
        'custom_preconds': [("banner 'Showing N work orders matching ' is visible",
                             "banner 'Showing N work orders matching [q]' is visible")],
        'custom_expected': [("The 'Showing N work orders matching ' banner is removed",
                             "The 'Showing N work orders matching [q]' banner is removed")]}),
    '45032': ('snapshots/batch/PRE-C45032.json', {}),
    '45055': ('snapshots/batch/PRE-C45055.json', {
        'custom_expected': [("“Create  as a new part”", "“Create [typed text] as a new part”")]}),
    '45066': ('snapshots/batch/PRE-C45066.json', {}),
}
FIELDS = ('custom_preconds', 'custom_steps', 'custom_expected')
TAG = re.compile(r'<[^>]+>')


def to_blocks(text):
    """blank line separates blocks; single newline separates lines within a block"""
    text = text.replace('\r\n', '\n').strip('\n')
    return [[ln for ln in blk.split('\n')] for blk in re.split(r'\n\s*\n', text) if blk.strip()]


intended, blocks_out, report = {}, {}, []
for cid, (snap, subs) in PLAN.items():
    p = f'{PASS}/{snap}'
    if not os.path.exists(p):
        print(f'C{cid}: MISSING SNAPSHOT {p} — STOP, never guess intended content')
        sys.exit(1)
    d = json.load(open(p))
    fields = {}
    for f in FIELDS:
        v = d.get(f) or ''
        if TAG.search(v):
            print(f'C{cid} {f}: pre-write snapshot already contains a tag — STOP, wrong snapshot')
            sys.exit(1)
        for old, new in subs.get(f, []):
            if old not in v:
                print(f'C{cid} {f}: approved substitution not found in the snapshot — STOP')
                print(f'   looking for: {old!r}')
                sys.exit(1)
            v = v.replace(old, new)
        fields[f] = {'text': v, 'blocks': to_blocks(v)}
    intended[cid] = {f: fields[f]['text'] for f in FIELDS}
    blocks_out[cid] = {'fields': fields}
    report.append((cid, {f: len(fields[f]['blocks']) for f in FIELDS}))

json.dump(intended, open(f'{OUT}/intended.json', 'w'), indent=1, ensure_ascii=False)
json.dump(blocks_out, open(f'{OUT}/intended-blocks.json', 'w'), indent=1, ensure_ascii=False)

print('INTENDED CONTENT DERIVED FROM PRE-WRITE SNAPSHOTS — no tags, approved substitutions only\n')
for cid, counts in report:
    print(f'C{cid}: blocks per field {counts}')
    exp = blocks_out[cid]['fields']['custom_expected']['text']
    assert 'AUTOMATION:' in exp, f'C{cid}: AUTOMATION marker missing'
    assert exp.rstrip().split('\n')[-1].startswith('AUTOMATION:'), f'C{cid}: marker not last'
    assert '<' not in exp and '>' not in exp, f'C{cid}: a tag survived into intended text'
    print(f'   marker last: OK | expected tail: {exp.rstrip().splitlines()[-1][:70]!r}')
print('\nall five: marker present and LAST, zero tags, substitutions applied')
print(f'wrote {OUT}/intended.json and intended-blocks.json')
