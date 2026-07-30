#!/usr/bin/env python3
import json, pathlib, collections
BASE = pathlib.Path('build/schedule/coverage-rederivation-2026-07-31')
M = json.load(open(BASE / 'coverage-matrix.json'))
secs = sorted({r['section'] for r in M}, key=lambda s: [int(x) for x in s.split('.')])
lines = []
w = lines.append
w('## APPENDIX A — the full 243-statement matrix (every statement, every verdict)\n')
w('Verdicts: **COVERED** · **COVERED-FLAGGED** (covered, but the spec text conflicts with a')
w('higher-precedence ruling — see §6) · **GAP** · **NOT-TESTABLE** (with the reason).\n')
for s in secs:
    rs = [r for r in M if r['section'] == s]
    c = collections.Counter(r['verdict'] for r in rs)
    w('### §%s — %d statements (%s)\n' % (s, len(rs), ', '.join('%s %d' % (k, v) for k, v in sorted(c.items()))))
    w('| # | Kind | Statement (verbatim) | Verdict | Case(s) |')
    w('|---|---|---|---|---|')
    for r in rs:
        txt = r['text'].replace('|', '\\|')
        if len(txt) > 300: txt = txt[:297] + '…'
        v = r['verdict'] + (' — ' + r['subtype'] if r['subtype'] else '')
        w('| %s | %s | %s | %s | %s |' % (r['id'], r['kind'], txt, v, ', '.join(r['cases']) or '—'))
    w('')
    notes = [r for r in rs if r['note'] and r['verdict'] != 'COVERED']
    if notes:
        for r in notes:
            w('- **%s** — %s' % (r['id'], r['note']))
        w('')
(BASE / 'APPENDIX-A-full-matrix.md').write_text('\n'.join(lines))
tot = collections.Counter(r['verdict'] for r in M)
print(dict(tot))
per = {s: len([r for r in M if r['section'] == s]) for s in secs}
print(' · '.join('§%s=%d' % (s, per[s]) for s in secs))
