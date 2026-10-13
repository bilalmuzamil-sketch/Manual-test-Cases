#!/usr/bin/env python3
"""LEARNING GATE — learnings are saved automatically, not when asked (Rule 127 amendment, QA lead 2026-10-13).

Runs as the project's Stop hook (.claude/settings.json). Each time Claude is about to stop, it looks at the commits made
since the last time learning was saved (or consciously declared "nothing new"). If work was committed but NONE of the
learning stores changed, it blocks the stop once and says what to do. It never blocks twice in a row (stop_hook_active).

Learning stores: build/LEARNINGS-LOG.md · build/APP-ACTIONS-PLAYBOOK.md · build/KNOWLEDGE-MAP.md · build/*/PROJECT-STATE.md
                 · build/rules/* · build/skills/*
Work           : any other committed change under build/ (results, scripts, evidence, case edits …)

Manual use:
  python3 build/testing-tools/learning_gate.py --status          what the gate sees now
  python3 build/testing-tools/learning_gate.py --ack "why"       nothing new was learned in this stretch; move the marker
The marker lives in .git/learning-gate-marker (per checkout; a fresh container starts a new marker at its first stop).
"""
import json, os, subprocess, sys, datetime

ROOT = subprocess.run(['git', 'rev-parse', '--show-toplevel'], capture_output=True, text=True).stdout.strip() or os.getcwd()
GITDIR = subprocess.run(['git', '-C', ROOT, 'rev-parse', '--git-dir'], capture_output=True, text=True).stdout.strip()
MARK = os.path.join(ROOT, GITDIR, 'learning-gate-marker') if GITDIR and not os.path.isabs(GITDIR) else os.path.join(GITDIR or '.git', 'learning-gate-marker')
STORE = ('build/LEARNINGS-LOG.md', 'build/APP-ACTIONS-PLAYBOOK.md', 'build/KNOWLEDGE-MAP.md')

def git(*a):
    return subprocess.run(['git', '-C', ROOT, *a], capture_output=True, text=True).stdout.strip()

def is_store(p):
    return p in STORE or p.endswith('/PROJECT-STATE.md') or p.startswith(('build/rules/', 'build/skills/', 'build/kb/'))

def state():
    head = git('rev-parse', 'HEAD')
    mark = open(MARK).read().strip() if os.path.exists(MARK) else ''
    if not mark or git('cat-file', '-t', mark) != 'commit':
        return head, None, [], []
    files = [f for f in git('diff', '--name-only', f'{mark}..{head}').split('\n') if f]
    work = [f for f in files if f.startswith('build/') and not is_store(f)]
    stores = [f for f in files if is_store(f)]
    return head, mark, work, stores

def write_mark(sha):
    with open(MARK, 'w') as f: f.write(sha + '\n')

def main():
    if '--ack' in sys.argv:
        head = git('rev-parse', 'HEAD'); write_mark(head)
        why = sys.argv[sys.argv.index('--ack') + 1] if len(sys.argv) > sys.argv.index('--ack') + 1 else ''
        with open(MARK + '.log', 'a') as f: f.write(f'{datetime.datetime.utcnow():%Y-%m-%d %H:%M} ack {head[:9]} {why}\n')
        print('learning gate: acknowledged at', head[:9], '-', why or '(no reason given)'); return 0
    if '--status' in sys.argv:
        head, mark, work, stores = state()
        print(f'marker {mark[:9] if mark else "(none)"} -> HEAD {head[:9]}: {len(work)} work file(s), {len(stores)} learning-store file(s) changed')
        for f in stores[:10]: print('  store', f)
        for f in work[:10]: print('  work ', f)
        return 0
    # Stop-hook mode
    try: inp = json.load(sys.stdin)
    except Exception: inp = {}
    if inp.get('stop_hook_active'): return 0
    head, mark, work, stores = state()
    if not head: return 0
    # Rule 128: a store that has grown past its budget is split before it becomes unreadable
    hc = subprocess.run([sys.executable, os.path.join(ROOT, 'build/testing-tools/knowledge_health.py'), '--check'],
                        capture_output=True, text=True)
    if hc.returncode == 1:
        sys.stderr.write('Rule 128 (no file may grow too big to use): a knowledge store is over its size budget:\n' + hc.stdout +
                         'Split it now (byte-verified, the index stays at the same path): python3 build/testing-tools/knowledge_health.py '
                         'shard <file>, then commit and push.\n')
        return 2
    if mark is None or stores or not work:
        write_mark(head); return 0          # first run, learning already saved, or nothing worked on
    n = len(set(git('log', '--format=%h', f'{mark}..{head}').split()))
    sys.stderr.write(
        f'Rule 127 (learning is saved automatically): {n} commit(s) since the last learning save changed {len(work)} work file(s) '
        f'(e.g. {", ".join(work[:3])}) but no learning store. Before stopping, ask: what did this stretch teach that would '
        'save time or avoid a mistake next time (a trap, a route, a fix, a tool, a fact about a site, a ruling)? Save each '
        'in the place build/KNOWLEDGE-MAP.md names (new "## L0nnn" at the bottom of build/LEARNINGS-LOG.md; how-tos in '
        'build/APP-ACTIONS-PLAYBOOK.md; suite facts in that suite\'s PROJECT-STATE.md; a map row if nothing would lead to it), '
        'commit and push. If genuinely nothing new was learned, run: python3 build/testing-tools/learning_gate.py --ack "<why>"\n')
    return 2

if __name__ == '__main__':
    sys.exit(main())
