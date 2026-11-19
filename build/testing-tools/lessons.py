#!/usr/bin/env python3
"""Rule 127 — use what was already learned. Searches, ranked by the task's own words:
  * build/knowledge/*.md            knowledge cards (one durable fact / recipe / tool each, with keywords)
  * build/rules/MISTAKES-AND-CHECKS.md   every mistake and the check it produced (M1, M2, ...)
  * build/APP-ACTIONS-PLAYBOOK.md   section headings only (the file is too big to read whole) -> file:line to read
Usage:
  python3 build/testing-tools/lessons.py "re-test the A/R aging exports on staging"     top hits for a task (step 0)
  python3 build/testing-tools/lessons.py --hook        (UserPromptSubmit hook: reads {"prompt":...} on stdin)
  python3 build/testing-tools/lessons.py --new "Title" --keywords "a,b,c"               scaffold a new card
  python3 build/testing-tools/lessons.py --check       every card has title/keywords/learned/evidence; evidence paths exist
"""
import json, os, re, sys, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
K, MIS, PB = f'{ROOT}/build/knowledge', f'{ROOT}/build/rules/MISTAKES-AND-CHECKS.md', f'{ROOT}/build/APP-ACTIONS-PLAYBOOK.md'
STOP = set('the and for with that this from into when what where which have has are was were you your our not but all any can use run get set new old one two out off its per via too also then than them they there their about after before again should would could please make sure give tell show just like need want each every some more most very will shall into onto over under'.split())
words = lambda s: [w for w in re.findall(r"[a-z0-9][a-z0-9/_\-]{2,}", s.lower()) if w not in STOP]
def cards():
    out = []
    if not os.path.isdir(K): return out
    for f in sorted(os.listdir(K)):
        if not f.endswith('.md') or f == 'README.md': continue
        t = open(f'{K}/{f}').read(); m = re.match(r'---\n(.*?)\n---\n(.*)', t, re.S)
        meta = dict(re.findall(r'^(\w+):\s*(.*)$', m.group(1), re.M)) if m else {}
        body = m.group(2) if m else t
        out.append({'kind': 'CARD', 'path': f'build/knowledge/{f}', 'line': 1, 'title': meta.get('title', f), 'kw': meta.get('keywords', ''),
                    'meta': meta, 'body': body, 'first': next((l.strip('-* ').strip() for l in body.splitlines() if l.strip()), '')})
    return out
def mistakes():
    out = []
    if not os.path.exists(MIS): return out
    lines = open(MIS).read().splitlines()
    for i, l in enumerate(lines, 1):
        m = re.match(r'\*\*(M\d+)\.\s*(.*?)\*\*(.*)', l)
        if m:
            body = ' '.join(lines[i - 1:i + 8]); chk = re.search(r'\*Check:\*\s*(.*?)(?:\*\*M\d|$)', body)
            out.append({'kind': m.group(1), 'path': 'build/rules/MISTAKES-AND-CHECKS.md', 'line': i, 'title': m.group(2), 'kw': '', 'body': body,
                        'first': ('Check: ' + chk.group(1)[:220]) if chk else m.group(3)[:200]})
    return out
def playbook():
    out = []
    if not os.path.exists(PB): return out
    for i, l in enumerate(open(PB).read().splitlines(), 1):
        if l.startswith('## ') or l.startswith('### '):
            out.append({'kind': 'PLAYBOOK', 'path': 'build/APP-ACTIONS-PLAYBOOK.md', 'line': i, 'title': l.lstrip('# ').strip(), 'kw': '', 'body': l, 'first': 'read this section only (grep/sed by line), never the whole file'})
    return out
def rank(q, items):
    qw = set(words(q)); res = []
    for it in items:
        kw, ti, bo = set(words(it['kw'])), set(words(it['title'])), set(words(it['body']))
        s = 3 * len(qw & kw) + 2 * len(qw & ti) + min(len(qw & bo), 6) + (1 if it['kind'] == 'CARD' else 0)
        if s >= 3: res.append((s, it))
    return [it for s, it in sorted(res, key=lambda x: -x[0])]
def show(q, n=8, compact=False):
    hits = rank(q, cards() + mistakes() + playbook())[:n]
    if not hits: return 'lessons.py: no earlier lesson matches this task (say so, and write a card if you learn something durable).'
    head = 'LESSONS ALREADY LEARNED for this task (Rule 127) - read each before planning:' if not compact else '[Rule 127] Earlier lessons matching this request - read before acting:'
    return '\n'.join([head] + [f"- [{h['kind']}] {h['title'][:110]} -> {h['path']}:{h['line']}" + ('' if compact else f"\n    {h['first'][:240]}") for h in hits])
def new(title, kw):
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')[:60]; p = f'{K}/{slug}.md'
    if os.path.exists(p): sys.exit(f'exists: {p}')
    open(p, 'w').write(f'---\ntitle: {title}\nkeywords: {kw}\nlearned: {datetime.date.today()}\nevidence: <path to the committed evidence>\n---\n- <the fact, recipe or tool, in a few lines; how to use it; the trap it avoids>\n')
    print(p)
def check():
    bad = []
    for c in cards():
        for k in ('title', 'keywords', 'learned', 'evidence'):
            if not c['meta'].get(k): bad.append(f"{c['path']}: missing {k}")
        for e in re.split(r'[;,]\s*', c['meta'].get('evidence', '')):
            e = e.strip().split(' ')[0]
            if e.startswith('build/') and not os.path.exists(f'{ROOT}/{e}'): bad.append(f"{c['path']}: evidence path not found: {e}")
    print('\n'.join(bad) or f'OK: {len(cards())} cards, {len(mistakes())} mistakes, {len(playbook())} playbook sections indexed'); sys.exit(1 if bad else 0)
if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    if a[0] == '--hook':
        try: q = json.load(sys.stdin).get('prompt', '')
        except Exception: q = ''
        if len(words(q)) >= 3: print(show(q, 6, compact=True))
    elif a[0] == '--new': new(a[1], a[a.index('--keywords') + 1] if '--keywords' in a else '')
    elif a[0] == '--check': check()
    else: print(show(' '.join(a)))
