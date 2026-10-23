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
import shutil, time
HAVE = {x: bool(shutil.which(x)) for x in ('node', 'bash', 'git')}

def run(cmd, cwd=None, inp=None, timeout=120):
    try:
        r = subprocess.run(cmd, cwd=cwd or ROOT, input=inp, capture_output=True, text=True, timeout=timeout, shell=isinstance(cmd, str))
        return r.returncode, r.stdout + r.stderr
    except subprocess.TimeoutExpired:
        return 124, 'timeout'

def check(name, ok, detail='', level='FAIL'):
    """level FAIL blocks; WARN is printed but never blocks (slow drift, sizes); SKIP when this machine lacks the tool."""
    RESULTS.append((name, bool(ok), detail, level))

def skip(name, why):
    RESULTS.append((name, True, why, 'SKIP'))

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
    if HAVE['node']:
        bad = [os.path.basename(f) for f in glob.glob(f'{T}/*.mjs') if run(['node', '--check', f])[0]]
        check('tools: every Node tool parses', not bad, ', '.join(bad))
    else: skip('tools: every Node tool parses', 'node is not installed on this machine')
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
    # 7b · scenarios that once broke or could break the split (each proved lossless on today's real files)
    try:
        import importlib.util, datetime as _dt
        sp = importlib.util.spec_from_file_location('kh', f'{T}/knowledge_health.py'); kh = importlib.util.module_from_spec(sp); sp.loader.exec_module(kh)
        log = open(os.path.join(ROOT, 'build/LEARNINGS-LOG.md')).read(); pb = open(os.path.join(ROOT, 'build/APP-ACTIONS-PLAYBOOK.md')).read()
        ok = True
        for days in (0, 15, 3650):                                   # today, after the hot window, ten years on
            for txt in (log, log.rstrip('\n'), log + '\n\n'):          # normal / odd file endings
                pre, ent, tail = kh.split_entries(txt, _dt.date.today() + _dt.timedelta(days=days))
                ok &= pre + ''.join(b for _, b in ent) + tail == txt
        burst = log + ''.join(f'\n## L{9000+i} — {_dt.date.today()} — burst\n' + 'x' * 1500 + '\n' for i in range(200))
        pre, ent, tail = kh.split_entries(burst, _dt.date.today())
        ok &= pre + ''.join(b for _, b in ent) + tail == burst and len(tail.encode()) < kh.STORES['build/LEARNINGS-LOG.md'][0] * 1024
        for txt in (pb, pb.rstrip('\n'), pb + '\n## X\nnew\n'):
            pre, secs = kh.split_sections(txt); ok &= pre + ''.join(b for _, b in secs) == txt
        check('scenarios: splits are lossless (today, +15 d, +10 y, odd endings, a 200-entry burst)', ok)
        src = open(f'{T}/knowledge_health.py').read()
        check('scenarios: the split never overwrites a part and numbers after the highest', "'x')" in src and 'max([int(' in src)
    except Exception as e:
        check('scenarios: splits are lossless', False, repr(e)[:160])
    # 7c · recording results: a Passed "None." is hidden, nothing is ever hidden on Failed/Blocked
    try:
        sp = importlib.util.spec_from_file_location('pr', f'{T}/push_results_to_run.py'); pr = importlib.util.module_from_spec(sp)
        _argv = sys.argv; sys.argv = ['x']; sp.loader.exec_module(pr); sys.argv = _argv
        c = [('None.' in pr.comment_for({'verdict': v, 'observed': ['a']}, td, 'H')) == want for v, td, want in
             [('Passed', 'None.', False), ('Blocked', 'None.', True), ('Failed', 'None.', True)]]
        check('results: run comments hide a Passed "None." and never hide a Failed/Blocked to-do', all(c), str(c))
    except Exception as e:
        check('results: run comments', False, repr(e)[:160])
    # 7c2 · Rule 132 (2026-10-20): a non-Passed result opens with the failing step(s) in bold and bolds those steps' bullets; refused without them
    try:
        h = pr.comment_for({'verdict': 'Failed', 'failed_steps': 'Failed at step 2: x.', 'bold_steps': [2], 'observed': ['Step 1: a', 'Step 2: b', 'Step 20: c']}, 'td', 'H')
        ok = h.startswith('<p><strong>Failed at step 2') and '<li><strong>Step 2: b</strong></li>' in h and '<li>Step 20: c</li>' in h and '<li>Step 1: a</li>' in h
        src132 = open(f'{T}/push_results_to_run.py').read()
        check('results: a non-Passed result opens with its failing step(s) in bold and is refused without them (Rule 132)', ok and 'no "failed_steps"' in src132)
    except Exception as e:
        check('results: Rule 132 bold failing steps', False, repr(e)[:160])
    # 7c2b · Rule 135 (2026-10-23): a Failed comment says only what failed — a "Step N" bullet outside bold_steps is refused
    try:
        base = {'verdict': 'Failed', 'failed_steps': 'Failed at step 7: x', 'bold_steps': [7], 'ticket': 'with the QA lead', 'ticket_held': True, 'todo': 'What needs to be done: wait.', 'pictures': [], 'source': 'PRD v1 S1: "x"'}
        outs = {}
        for k, obs in (('bad', ['Steps 1-4: fine.', 'Step 7: wrong.']), ('good', ['Set-up: window 1600 x 1000.', 'Step 7: wrong.']), ('nosrc', ['Step 7: wrong.'])):
            fp = tempfile.NamedTemporaryFile('w', suffix='.json', delete=False); json.dump({'results': {'C1': dict(base, observed=obs, **({'source': ''} if k == 'nosrc' else {}))}}, fp); fp.close()
            outs[k] = run([sys.executable, f'{T}/push_results_to_run.py', '--run', '0', '--results', fp.name, '--build-marker', 'x', '--date', 'x',
                           '--no-sync', '--screenshots', 'no', '--allow-non-passed', '--dry-run'])
            os.unlink(fp.name)
        o = {k: v[1] for k, v in outs.items()}
        check('results: a Failed comment that talks about a passed step, or names no source, is refused; one about the failure with its source is not (Rule 135, 135(8))',
              'REFUSING (Rule 135)' in o['bad'] and 'Rule 135' not in o['good'] and 'REFUSING (Rule 135(8))' in o['nosrc'] and 'Fails against:</strong> PRD v1' in pr.comment_for(dict(base, observed=['Step 7: wrong.']), 'td', 'H'), o['bad'][-160:] + ' | ' + o['nosrc'][-160:])
    except Exception as e:
        check('results: Rule 135 failed-only comment', False, repr(e)[:160])
    # 7c3 · Rule 133 (2026-10-20): Failed/Retest/Blocked cases with a ticket carry "SV-n - " in their title; one prefix, kept current
    try:
        sp3 = importlib.util.spec_from_file_location('ptt', f'{T}/prefix_ticket_titles.py'); ptt = importlib.util.module_from_spec(sp3); sp3.loader.exec_module(ptt)
        c3 = [ptt.titled('Lock note shows', ['SV-11545']) == 'SV-11545 - Lock note shows',
              ptt.titled('SV-11326 - Lock note shows', ['SV-11545']) == 'SV-11545 - Lock note shows',
              ptt.titled('Lock note shows', []) == 'Lock note shows',
              ptt.titled('SV-11326 - X', ['SV-11545', 'SV-11546']) == 'SV-11545, SV-11546 - X',
              ptt.unprefixed('SV-11545, SV-11546 - X') == 'X', ptt.unprefixed('Plain title - X') == 'Plain title - X']
        src133 = open(f'{T}/push_results_to_run.py').read()
        # 20 Oct 2026: a non-Passed result with NO ticket must take an old prefix off (a Retest that becomes Blocked-on-a-question)
        class _T:
            def __init__(s): s.title = 'SV-11326 - X'; s.posted = []
            def get(s, p): return 200, {'title': s.title, 'created_by': 3, 'custom_atmstatus': 1}
            def post(s, p, b): s.posted.append(b); s.title = b['title']; return 200, {}
        ft = _T(); c3.append(ptt.prefix_case(ft, 1, []).get('verified') is True and ft.title == 'X')
        check('results: a Failed/Retest/Blocked case with a ticket gets one current "SV-n - " title prefix, none without, removed on a pass (Rule 133)',
              all(c3) and 'prefix_case(t,' in src133 and 'unprefix_case(t,' in src133 and "custom_atmstatus') == 3" in open(f'{T}/prefix_ticket_titles.py').read(), str(c3))
    except Exception as e:
        check('results: Rule 133 title prefix', False, repr(e)[:160])
    # 7d · Rule 130 (2026-10-14): results are refused until the QA lead's screenshot answer is recorded; "yes" attaches pictures
    src_pr = open(f'{T}/push_results_to_run.py').read()
    check('results: a write without his screenshot answer is refused, and "yes" attaches the pictures (Rule 130)',
          "if not a.dry_run and not a.screenshots" in src_pr and "add_attachment_to_result" in src_pr and "'pictures'" in src_pr)
    # 8 · scale and drift (warnings: they never block, they say what to do before it hurts)
    t0 = time.time(); run(['python3', f'{T}/recall.py', 'staging sign in cookie', '--top', '3'])
    dt = time.time() - t0
    check('scale: a search answers in under 15 s (else give recall.py a cached index)', dt < 15, f'{dt:.1f} s', level='WARN')
    cm = os.path.getsize(os.path.join(ROOT, 'CLAUDE.md'))
    check('scale: CLAUDE.md under 150 KB so it loads whole (it was once truncated at 738 KB)', cm < 150 * 1024, f'{cm/1024:.0f} KB', level='WARN')
    idx = open(os.path.join(ROOT, 'CLAUDE.md')).read()
    hi = max(int(x) for x in re.findall(r'^\| \*\*(\d+)\*\* \|', idx, re.M))
    tail = re.findall(r'^## RULE (\d+) ', open(os.path.join(ROOT, 'build/rules/RULES-61-ONWARD.md')).read(), re.M)
    newest = max(int(x) for x in tail)
    check(f'index: CLAUDE.md lists the newest rule ({newest})', hi >= newest, f'index stops at {hi}')
    for stem in ('APP-ACTIONS-PLAYBOOK', 'LEARNINGS-LOG'):
        nums = [os.path.basename(x)[:3] for x in glob.glob(os.path.join(ROOT, 'build/kb', stem, '[0-9][0-9][0-9]-*.md'))]
        check(f'knowledge: part numbers of {stem} are unique', len(nums) == len(set(nums)), str(sorted(n for n in set(nums) if nums.count(n) > 1)))
    hot = len(re.findall(r'^#{2,3} L\d{4}', open(os.path.join(ROOT, 'build/LEARNINGS-LOG.md')).read(), re.M))
    check('knowledge: the learnings log still holds recent entries for the session-start summary', hot > 0, f'{hot} entries', level='WARN')
    for name, ok, detail, level in RESULTS:
        if level == 'SKIP': print(f'SKIP {name}  — {detail}'); continue
        if level == 'WARN' and not ok: print(f'WARN {name}  — {detail}'); continue
        print(('PASS ' if ok else 'FAIL ') + name + (f'  — {detail}' if detail and not ok else ''))
    fails = [r for r in RESULTS if not r[1] and r[3] == 'FAIL']
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
