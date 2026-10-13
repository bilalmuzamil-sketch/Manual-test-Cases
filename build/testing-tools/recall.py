#!/usr/bin/env python3
"""RECALL — "have I done something like this before, and where is it written down?" (Rule 127, QA lead 2026-10-13).

Run this BEFORE starting any new suite, task, probe or fix, with the words of the feature or the problem:

    python3 build/testing-tools/recall.py "drag a card to another technician"
    python3 build/testing-tools/recall.py "google analytics events" --top 20
    python3 build/testing-tools/recall.py "staging sign in cookie" --kind playbook,learning
    python3 build/testing-tools/recall.py "time zone" --ref origin/claude/slack-session-0sxnd9   # facts only (Rule 119)

It searches, without reading anything whole into your context (Rule 88):
  learning  build/LEARNINGS-LOG.md            one block per L-entry
  playbook  build/APP-ACTIONS-PLAYBOOK.md     one block per heading / dated bullet
  map       build/KNOWLEDGE-MAP.md            one row per "I am about to ..." line
  skill     build/skills/*.md                 one block per heading
  rule      build/rules/RULES-*.md            one block per heading (never the 738 KB archive)
  project   build/*/PROJECT-STATE.md, RESUME-HERE.md, STAGING-READY.md, INTAKE-*.md, ANALYTICS-*.md, *-READY.md
  tool      build/testing-tools/* and build/*/run*/*.{mts,mjs,py,sh}   (file name + first comment lines)
and prints the best matches: score · kind · file:line · title · the line that matched. Open only what it points at.

Scoring: each query word (and its listed synonyms) found in a block counts once; a hit in the block's title counts
three times; a whole-phrase hit adds a bonus. Short stop-words are ignored. Prefix matching (first 5 letters) lets
"seeding" find "seed", "timezone" find "time zone" via the synonym list.
"""
import argparse, glob, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
STOP = set('a an the and or of to in on for with from by is are be was it this that as at into not no do does how what '
           'when where which who we i my me our you your can could should would will just then than there their'.split())
# Words people use for the same thing in this workspace. Extend freely: the cost of a missing synonym is a re-discovery.
SYN = {
    'login': ['sign-in', 'signin', 'sign in', 'quick-login', 'cookie', 'session', 'sso'],
    'signin': ['login', 'sign-in', 'quick-login', 'cookie', 'sso'],
    'cookie': ['sv_sso_session', 'phpsessid', 'cf_clearance', 'session'],
    'analytics': ['google analytics', 'ga4', 'g/collect', 'collect', 'debugview', 'event'],
    'ga': ['google analytics', 'analytics', 'g/collect', 'ga4'],
    'timezone': ['time zone', 'tz', 'utc', 'asia/karachi', 'edmonton'],
    'zone': ['timezone', 'tz', 'utc'],
    'drag': ['drop', 'dragging', 'reorder', 'reassign'],
    'drop': ['drag'],
    'testrail': ['case', 'run', 'add_case', 'update_case', 'result'],
    'ticket': ['jira', 'story defect', 'defect'],
    'jira': ['ticket', 'story defect'],
    'defect': ['ticket', 'story defect', 'bug'],
    'screenshot': ['picture', 'annotate', 'annotated', 'png'],
    'picture': ['screenshot', 'annotate'],
    'role': ['permission', 'roles & permissions', 'reset to template'],
    'permission': ['role', 'fe_permissions'],
    'staging': ['app.staging', 'staging-all', 'staging-ready'],
    'production': ['prod', 'app.shopview.com'],
    'prod': ['production', 'app.shopview.com'],
    'seed': ['seeding', 'zzautotest', 'test data', 'create'],
    'blocked': ['blocker', 'unblock', 'blocker_gate'],
    'offline': ['network error', 'sleep page', 'setoffline'],
    'keyboard': ['focus', 'tab', 'tabindex'],
    'technician': ['tech', 'lead technician', 'staff'],
    'lead': ['lead technician', 'reassign'],
    'schedule': ['shift', 'shifts'],
    'filter': ['search', 'filters'],
    'report': ['reports'],
    'ruling': ['decision', 'qa lead', 'po'],
    'po': ['product owner', 'chris ward', 'question sheet'],
    'question': ['po', 'question sheet', 'ask'],
    'precondition': ['preconds', 'setup', 'custom_preconds'],
    'preconditions': ['preconds', 'setup'],
    'automated': ['automation', 'atmstatus', 'vlad', 'vladimir'],
    'branch': ['qa branch', 'qa.shopview.com'],
    'sleep': ['wake up', 'asleep', 'sleeping'],
    'impersonate': ['impersonation', 'view as', 'switch-user'],
    'render': ['fr-view', 'served-page', 'escaping'],
}

def words(q):
    return [w for w in re.findall(r"[a-z0-9_/.\-]+", q.lower()) if w not in STOP and len(w) > 1]

def read(path, ref):
    if ref:
        rel = os.path.relpath(path, ROOT)
        r = subprocess.run(['git', '-C', ROOT, 'show', f'{ref}:{rel}'], capture_output=True, text=True)
        return r.stdout if r.returncode == 0 else ''
    try:
        with open(path, encoding='utf-8', errors='replace') as f: return f.read()
    except OSError: return ''

def files(ref):
    pats = {
        'learning': ['build/LEARNINGS-LOG.md'],
        'playbook': ['build/APP-ACTIONS-PLAYBOOK.md'],
        'map': ['build/KNOWLEDGE-MAP.md'],
        'skill': ['build/skills/*.md'],
        'rule': ['build/rules/RULES-*.md'],
        'project': ['build/*/PROJECT-STATE.md', 'build/*/*/RESUME-HERE.md', 'build/*/*/STAGING-READY.md',
                    'build/*/INTAKE-*.md', 'build/*/*/ANALYTICS-*.md', 'build/BLOCKED-*.md', 'build/*-METHOD.md',
                    'build/*-PROCESS.md', 'build/TESTING-RUNBOOK.md', 'build/OUTSTANDING-ITEMS-REGISTER.md'],
        'tool': ['build/testing-tools/*', 'build/*/run*/*.mts', 'build/*/run*/*.mjs', 'build/*/run*/*.py', 'build/*/run*/*.sh',
                 'build/*/e2e/*.ts', 'build/*/*/tools/*'],
    }
    if ref:
        ls = subprocess.run(['git', '-C', ROOT, 'ls-tree', '-r', '--name-only', ref, 'build/'], capture_output=True, text=True).stdout.split()
        import fnmatch
        for kind, ps in pats.items():
            for p in ps:
                for rel in ls:
                    if fnmatch.fnmatch(rel, p) and 'ARCHIVE' not in rel: yield kind, os.path.join(ROOT, rel)
        return
    for kind, ps in pats.items():
        for p in ps:
            for path in sorted(glob.glob(os.path.join(ROOT, p))):
                if os.path.isfile(path) and 'ARCHIVE' not in path and not path.endswith('recall.py') and os.path.getsize(path) < 3_000_000: yield kind, path

HEAD = re.compile(r'^(#{1,4} |- \*\*\(\d{1,2} \w{3} 20\d\d|- \*\*\(20\d\d-|\| \*\*)')

def blocks(kind, path, text):
    lines = text.splitlines()
    if kind == 'tool':
        head = '\n'.join(lines[:12])
        yield 1, os.path.basename(path), head
        return
    if kind == 'map':
        for i, l in enumerate(lines, 1):
            if l.startswith('|') and not set(l) <= set('|- '): yield i, l[:160], l
        return
    start, title, buf = 1, (lines[0] if lines else ''), []
    for i, l in enumerate(lines, 1):
        if HEAD.match(l) and buf:
            yield start, title, '\n'.join(buf)
            start, title, buf = i, l, []
        if not buf: title = l
        buf.append(l)
    if buf: yield start, title, '\n'.join(buf)

def score(qws, phrase, title, body):
    tl, bl = title.lower(), body.lower()
    s, hit = 0, []
    for w in qws:
        alts = [w] + SYN.get(w, []) + ([w[:5]] if len(w) > 6 else [])
        if any(a in tl for a in alts): s += 3; hit.append(w)
        elif any(a in bl for a in alts): s += 1; hit.append(w)
    if phrase and phrase in bl: s += 4
    # every query word matched counts more than many hits of one word
    return s + (2 if len(set(hit)) == len(set(qws)) and len(qws) > 1 else 0), set(hit)

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('query', nargs='+')
    ap.add_argument('--top', type=int, default=15)
    ap.add_argument('--kind', help='comma list: learning,playbook,map,skill,rule,project,tool')
    ap.add_argument('--ref', help='search another branch (git ref) instead of the working tree — facts only (Rule 119)')
    ap.add_argument('--min', type=int, default=2, help='minimum score to show')
    a = ap.parse_args()
    q = ' '.join(a.query); qws = words(q); phrase = q.lower().strip() if len(qws) > 1 else ''
    kinds = set(a.kind.split(',')) if a.kind else None
    res = []
    for kind, path in files(a.ref):
        if kinds and kind not in kinds: continue
        text = read(path, a.ref)
        if not text: continue
        for line, title, body in blocks(kind, path, text):
            s, hit = score(qws, phrase, title, body)
            if s < a.min: continue
            # the first body line that carries a query word, as a pointer of what matched
            snip = next((l.strip() for l in body.splitlines()[1:] if any(w in l.lower() for w in hit)), '')
            res.append((s, kind, os.path.relpath(path, ROOT), line, title.strip()[:120], snip[:170]))
    res.sort(key=lambda r: (-r[0], r[1] != 'map', r[2], r[3]))
    if not res:
        print(f'RECALL "{q}": nothing found. Try other words (the feature name, the screen, the error text) or --ref '
              'origin/claude/slack-session-0sxnd9. If it really is new, write what you learn into the right file in the '
              'same pass (Rule 93/127) so the next search finds it.')
        return 0
    print(f'RECALL "{q}" — {len(res)} matching blocks, best {min(a.top, len(res))} shown (open only what you need):')
    for s, kind, rel, line, title, snip in res[:a.top]:
        print(f'{s:>3} {kind:<8} {rel}:{line}  {title}')
        if snip and snip != title: print(f'             ↳ {snip}')
    return 0

if __name__ == '__main__':
    sys.exit(main())
