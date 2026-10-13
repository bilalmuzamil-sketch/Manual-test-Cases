#!/usr/bin/env python3
"""Every file named in build/KNOWLEDGE-MAP.md must exist (Rule 127). A map that points at nothing is worse than no map.
Resolves `path` tokens directly, then by suffix anywhere under build/ (the map shortens long run folders), and globs (*).
Usage: python3 build/testing-tools/check_knowledge_map.py   → exit 1 and the list of dead pointers if any."""
import glob, os, re, subprocess, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
t = open(os.path.join(ROOT, 'build/KNOWLEDGE-MAP.md')).read()
toks = set(re.findall(r'`([^`\s]+\.(?:md|py|mjs|mts|sh|json|html|ts))`', t) + re.findall(r'`(build/[^`\s]+/)`', t))
allf = subprocess.run(['git', '-C', ROOT, 'ls-files', 'build'], capture_output=True, text=True).stdout.split('\n')
allf += [os.path.relpath(p, ROOT) for p in glob.glob(os.path.join(ROOT, 'build/**/*'), recursive=True) if 'node_modules' not in p]
dead = []
for tok in sorted(toks):
    tok = tok.split(' ')[0]
    if '<' in tok: continue   # placeholders like build/<project>/
    if os.path.exists(os.path.join(ROOT, tok)) or glob.glob(os.path.join(ROOT, tok)): continue
    pat = tok.replace('*', '')
    if '*' in tok:
        rx = re.compile(re.escape(tok).replace(r'\*', '.*') + '$')
        if any(rx.search(f) for f in allf): continue
    elif any(f.endswith('/' + tok) or f.endswith(tok) for f in allf): continue
    dead.append(tok)
print(f'{len(toks)} pointers checked, {len(dead)} dead'); [print('  DEAD', d) for d in dead]
sys.exit(1 if dead else 0)
