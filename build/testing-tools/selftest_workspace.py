#!/usr/bin/env python3
"""WORKSPACE SELF-TEST — a change that makes things better must never make anything worse (Rule 129, QA lead 2026-10-13).

Proves that the shared machinery still works: hooks, knowledge stores and their parts, the search, the map, every shared tool,
the tools that parse the rules and the core skill, and the ready-to-run staging suite. Run it BEFORE and AFTER any change to
shared things; the Stop hook (learning_gate.py) runs it automatically whenever such a change was committed and blocks on a FAIL.

  python3 build/testing-tools/selftest_workspace.py              all checks, PASS/FAIL per line, exit 1 on any FAIL
  python3 build/testing-tools/selftest_workspace.py --quick      skip the slower tool self-tests
  python3 build/testing-tools/selftest_workspace.py --compare <git-ref>
                                                                 run the same checks on <git-ref> (a throwaway worktree) and
                                                                 list every check that passed there but fails now = a regression

Add a check here whenever something new becomes load-bearing (a new hook, store, shared tool, a suite made "ready to run").
"""
import glob, json, os, re, subprocess, sys, tempfile

ROOT = subprocess.run(['git', 'rev-parse', '--show-toplevel'], capture_output=True, text=True).stdout.strip() or os.getcwd()
T = os.path.join(ROOT, 'build/testing-tools')
RESULTS = []

def run(cmd, cwd=None, inp=None, timeout=120):
    try:
        r = subprocess.run(cmd, cwd=cwd or ROOT, input=inp, capture_output=True, text=True, timeout=timeout, shell=isinstance(cmd, str))
        return r.returncode, r.stdout + r.stderr
    except subprocess.TimeoutExpired:
        return 124, 'timeout'

def check(name, ok, detail=''):
    RESULTS.append((name, bool(ok), detail))

def main(quick=False):
    # 1 · hooks: valid JSON, and they never block when the repo or a script is missing
    p = os.path.join(ROOT, '.claude/settings.json')
    try:
        s = json.load(open(p)); stop = s['hooks']['Stop'][0]['hooks'][0]['command']; start = s['hooks']['SessionStart'][0]['hooks'][0]['command']
        check('hooks: settings.json is valid and has Stop + SessionStart', True)
        rc, _ = run(['bash', '-c', stop], cwd=tempfile.gettempdir(), inp='{}'); check('hooks: Stop hook outside the repo exits 0', rc == 0, f'exit {rc}')
        rc, _ = run(['bash', '-c', start], cwd=tempfile.gettempdir(), inp='{}'); check('hooks: SessionStart hook outside the repo exits 0', rc == 0, f'exit {rc}')
        rc, out = run(['bash', '-c', start], inp='{}')
        try: json.loads(out.strip().splitlines()[-1]); check('hooks: SessionStart prints valid JSON in the repo', True)
        except Exception as e: check('hooks: SessionStart prints valid JSON in the repo', False, repr(e)[:120])
        rc, _ = run(['python3', f'{T}/learning_gate.py'], inp='{"stop_hook_active": true}'); check('hooks: Stop gate never blocks twice (stop_hook_active)', rc == 0, f'exit {rc}')
    except Exception as e:
        check('hooks: settings.json is valid and has Stop + SessionStart', False, repr(e)[:160])
    # 2 · knowledge stores: budgets, parts present, map pointers alive
    rc, out = run(['python3', f'{T}/knowledge_health.py', '--check']); check('knowledge: no splittable store over budget', rc == 0, out[-200:] if rc else '')
    for f in ('build/APP-ACTIONS-PLAYBOOK.md', 'build/LEARNINGS-LOG.md'):
        stem = os.path.splitext(os.path.basename(f))[0]
        if os.path.exists(os.path.join(ROOT, 'build/kb', stem, 'INTEGRITY.md')):
            rc, out = run(['python3', f'{T}/knowledge_health.py', 'verify', f]); check(f'knowledge: every part of {f} present', rc == 0 and 'FAIL' not in out, out[-200:])
    rc, out = run(['python3', f'{T}/check_knowledge_map.py']); check('knowledge: every file named in KNOWLEDGE-MAP exists', rc == 0, out[-200:])
    # 3 · search: finds known anchors in every kind of store, rules with amendments, single sections
    for q, want in [('google analytics without access', 'APP-ACTIONS-PLAYBOOK'), ('sign in to staging', 'KNOWLEDGE-MAP'),
                    ('keyword search is not a filter', 'LEARNINGS-LOG'), ('test case link at the bottom of the ticket', 'RULES-61-ONWARD')]:
        rc, out = run(['python3', f'{T}/recall.py', q, '--top', '10']); check(f'search: "{q}" finds {want}', rc == 0 and want in out, out[:160] if want not in out else '')
    rc, out = run(['python3', f'{T}/recall.py', '--rule', '114']); check('search: --rule 114 returns the rule and its amendment', out.count('=====') >= 2, f'{out.count("=====")} blocks')
    rc, out = run(['python3', f'{T}/recall.py', '--section', 'J. TestRail API', '--file', 'build/APP-ACTIONS-PLAYBOOK.md'])
    check('search: --section reads a section of a split store', rc == 0 and '=====' in out)
    # 4 · instructions never send a session to search only the small index of a split store
    bad = []
    for f in [os.path.join(ROOT, 'CLAUDE.md')] + glob.glob(os.path.join(ROOT, 'build/skills/*.md')) + glob.glob(os.path.join(ROOT, 'build/handoffs/*.md')) + glob.glob(os.path.join(ROOT, 'build/rules/RULES-*.md')):
        for n, l in enumerate(open(f, errors='replace'), 1):
            m = re.search(r'\bgrep\s+(?:-\w+\s+)*"[^"]*"\s+([^`|;]*)', l)   # a real search command and the paths it searches
            if m and re.search(r'(APP-ACTIONS-PLAYBOOK|LEARNINGS-LOG)\.md', m.group(1)) and 'build/kb' not in m.group(1):
                bad.append(f'{os.path.relpath(f, ROOT)}:{n}')
    check('instructions: every search of a split store also searches build/kb/', not bad, ', '.join(bad[:5]))
    # 5 · every shared tool still parses
    bad = [os.path.basename(f) for f in glob.glob(f'{T}/*.py') if run(['python3', '-m', 'py_compile', f])[0]]
    check('tools: every Python tool compiles', not bad, ', '.join(bad))
    bad = [os.path.basename(f) for f in glob.glob(f'{T}/*.mjs') if run(['node', '--check', f])[0]]
    check('tools: every Node tool parses', not bad, ', '.join(bad))
    bad = [os.path.relpath(f, ROOT) for f in glob.glob(f'{T}/*.sh') + glob.glob(os.path.join(ROOT, 'build/*/run*/*.sh')) if run(['bash', '-n', f])[0]]
    check('tools: every shell script parses (shared + suite runners)', not bad, ', '.join(bad))
    # 6 · tools that read the rules / core skill whole still work
    if not quick:
        rc, out = run(['python3', f'{T}/automation_markers.py']); check('parsers: automation_markers.py reads CLAUDE.md, rules and core skill', rc == 0, out[-200:])
        rc, out = run(['python3', f'{T}/check_tester_readiness.py', '--selftest']); check('parsers: check_tester_readiness.py --selftest', rc == 0, out[-200:])
    # 7 · every suite that is "ready to run" still has every script its ready list names
    for ready in glob.glob(os.path.join(ROOT, 'build/*/run*/STAGING-READY.md')):
        d = os.path.dirname(ready); names = set(re.findall(r'`([A-Za-z0-9_.-]+\.(?:mts|mjs|sh|py))`', open(ready).read()))
        missing = sorted(n for n in names if not os.path.exists(os.path.join(d, n)) and not os.path.exists(os.path.join(T, n)))
        check(f'suites: every script named in {os.path.relpath(ready, ROOT)} exists', not missing, ', '.join(missing[:8]))
    for name, ok, detail in RESULTS:
        print(('PASS ' if ok else 'FAIL ') + name + (f'  — {detail}' if detail and not ok else ''))
    fails = [r for r in RESULTS if not r[1]]
    print(f'\n{len(RESULTS) - len(fails)} passed, {len(fails)} failed')
    return 1 if fails else 0

def compare(ref):
    wt = tempfile.mkdtemp(prefix='selftest-')
    os.rmdir(wt)
    subprocess.run(['git', '-C', ROOT, 'worktree', 'add', '-q', wt, ref], check=True)
    try:
        # run TODAY's checks against the old tree, so the same checks are compared
        rc, before = run(['python3', os.path.join(T, 'selftest_workspace.py'), '--quick'], cwd=wt, timeout=600)
    finally:
        subprocess.run(['git', '-C', ROOT, 'worktree', 'remove', '--force', wt])
    rc2, after = run(['python3', os.path.join(T, 'selftest_workspace.py'), '--quick'], timeout=600)
    b = {l[5:].split('  — ')[0] for l in before.splitlines() if l.startswith('PASS ')}
    a = {l[5:].split('  — ')[0] for l in after.splitlines() if l.startswith('FAIL ')}
    reg = sorted(b & a)
    print(after); print('REGRESSIONS against', ref, ':', reg or 'none')
    return 1 if reg else 0

if __name__ == '__main__':
    if '--compare' in sys.argv: sys.exit(compare(sys.argv[sys.argv.index('--compare') + 1]))
    sys.exit(main(quick='--quick' in sys.argv))
