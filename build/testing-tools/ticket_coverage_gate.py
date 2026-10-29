"""ticket_coverage_gate.py — 29 Oct 2026. QA lead, after SV-11567 had to be retested "based on the exact ticket description":
"never leave such gaps behind, make sure you do the proper thorough testing, your work should never bite me" (L0606).

A ticket is PASSED only when EVERY line of its description and of its "How to check" has been observed on EVERY surface the ticket
names ("both Board View and Tech View"), each with evidence on disk AND a read-back proving the set-up really held (the 28 Oct shift
was not actually in progress, so "a shift ended at the moment of the change" was never tested although it was reported as passed).

  python3 ticket_coverage_gate.py --skeleton desc.txt --ticket SV-1 --surfaces "Board View,Tech View" > coverage.json   # draft the grid
  python3 ticket_coverage_gate.py coverage.json                                                                      # judge it

coverage.json: {"ticket": "SV-1", "build": "...", "surfaces": [...], "lines": [{"id": "D1", "quote": "<the ticket's own sentence>",
  "surfaces": [optional subset — only where the ticket itself limits it, with "limit_reason"],
  "cells": {"<surface>": {"verdict": "pass|fail", "evidence": ["file.png", "run.json"], "setup_readback": "what was read back to prove
  the precondition held", "observed": "what was seen"}}}]}
Exit 0 = every cell pass (Passed may be posted) · 2 = complete but something failed (post Failed) · 1 = GAPS (nothing may be posted)."""
import json, os, re, sys

def skeleton(desc_path, ticket, surfaces):
    text = open(desc_path, encoding='utf-8').read()
    bullets = [re.sub(r'\s+', ' ', m).strip() for m in re.findall(r'^\s*[*\-•]\s+(.+)$', text, re.M)]
    lines = [{'id': f'D{i + 1}', 'quote': b, 'cells': {s: {'verdict': '', 'evidence': [], 'setup_readback': '', 'observed': ''} for s in surfaces}}
             for i, b in enumerate(bullets)]
    return {'ticket': ticket, 'build': '', 'surfaces': surfaces, 'lines': lines}

def judge(cov, base):
    gaps, fails, ok = [], [], 0
    surfaces = cov.get('surfaces') or []
    if not surfaces: gaps.append('no surfaces named — list every view/screen the ticket names (one surface is still a list)')
    if not cov.get('build'): gaps.append('no build marker recorded')
    if not cov.get('lines'): gaps.append('no description lines — every bullet of the description and of "How to check" is a line')
    for ln in cov.get('lines', []):
        lid = ln.get('id', '?')
        if not (ln.get('quote') or '').strip(): gaps.append(f'{lid}: no quote of the ticket sentence')
        want = ln.get('surfaces') or surfaces
        if ln.get('surfaces') and set(ln['surfaces']) != set(surfaces) and not (ln.get('limit_reason') or '').strip():
            gaps.append(f'{lid}: checked on fewer surfaces than the ticket names, with no limit_reason quoting where the ticket limits it')
        for s in want:
            c = (ln.get('cells') or {}).get(s)
            if not c: gaps.append(f'{lid} × {s}: never checked'); continue
            v = (c.get('verdict') or '').lower()
            if v not in ('pass', 'fail'): gaps.append(f'{lid} × {s}: no verdict'); continue
            ev = c.get('evidence') or []
            missing = [e for e in ev if not os.path.isfile(os.path.join(base, e.split('#')[0]))]
            if not ev: gaps.append(f'{lid} × {s}: no evidence file')
            elif missing: gaps.append(f'{lid} × {s}: evidence not on disk: {missing}')
            if not (c.get('setup_readback') or '').strip(): gaps.append(f'{lid} × {s}: no read-back proving the set-up held (a request that returned 200 is not proof)')
            if not (c.get('observed') or '').strip(): gaps.append(f'{lid} × {s}: nothing written for what was seen')
            if v == 'fail': fails.append(f'{lid} × {s}: {c.get("observed", "")[:120]}')
            elif not any(g.startswith(f'{lid} × {s}') for g in gaps): ok += 1
    return gaps, fails, ok

if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == '--skeleton':
        desc = a[1]; ticket = a[a.index('--ticket') + 1]; surf = [s.strip() for s in a[a.index('--surfaces') + 1].split(',') if s.strip()]
        print(json.dumps(skeleton(desc, ticket, surf), indent=1, ensure_ascii=False)); sys.exit(0)
    if not a: sys.exit(__doc__)
    p = a[0]; cov = json.load(open(p, encoding='utf-8')); gaps, fails, ok = judge(cov, os.path.dirname(os.path.abspath(p)))
    print(f'{cov.get("ticket")} on {cov.get("build")}: {ok} cell(s) passed with evidence, {len(fails)} failed, {len(gaps)} gap(s)')
    for g in gaps: print('  GAP  ', g)
    for f in fails: print('  FAIL ', f)
    sys.exit(1 if gaps else 2 if fails else 0)
