#!/usr/bin/env python3
"""Rule-amendment divergence sweep — precision-first. READ-ONLY, writes nothing.

Failure mode hunted: an amendment recorded in CLAUDE.md (or a skill) but never
written into the rule's OWN body in build/rules/RULES-*.md, so a session told
"read the rule in its file, amendments included" has nothing to read. That is
the Rule 38 / 2026-08-31 failure (a check built on the un-amended rule rejected
all 30 of the named manual QA tester's cases) and the Rule 61 / Rule 69 failure
(a gate coded with three automation-marker literals when a fourth is sanctioned
flagged 4 correct cases).

Usage:  python3 build/testing-tools/check_rule_amendments.py     # from repo root

Attribution is PRIMARY-rule only: an atom is charged to the rule named in the
bullet's own headline, or the rule whose §2 index row it sits in, or the rule
named in the same SENTENCE in a skill/handoff. Paragraph-level attribution was
tried first and produced 92/99 flagged — unusable.

HONEST LIMITS — read before trusting the count:
  * This is TEXT SIMILARITY. It finds a missing verbatim quote / date / name.
    It does NOT find a missing MEANING: a rule whose amendment was reworded
    rather than quoted will pass. A rule it does not flag is not proven clean.
  * The flag count is a SHORTLIST, not a finding count. On 2026-09-02 it
    flagged 23 of 99; hand-adjudication (targeted grep per row) confirmed 11,
    of which 8 were HIGH severity. The 12 discarded rows were skill-local
    phrasing, a filename read as a date (CLAUDE-FULL-ARCHIVE-2026-08-21.md for
    rule 88), and dates belonging to a neighbouring rule in the same sentence.
    ALWAYS adjudicate the shortlist by hand before reporting anything.
  * The ORPHAN §1 BULLETS block is a second, independent finding: a §1 ruling
    whose headline names no numbered rule has no rule body to amend at all.

Full adjudicated output for 2026-09-02:
  build/rules/SECTION1-AND-AMENDMENT-AUDIT-2026-09-02.md
"""
import re, glob, os, unicodedata, sys

ROOT = os.getcwd()
RULEFILES = ['build/rules/RULES-01-20.md', 'build/rules/RULES-21-40.md',
             'build/rules/RULES-41-60.md', 'build/rules/RULES-61-99.md']
NAMES = ['Mudassir', 'Qamar', 'Viktoria', 'Videnovic', 'Vladimir Tomovic',
         'Sasha', 'Grosman', 'Grossman', 'Branko', 'Chris Ward', 'Milos']
AMEND = ['amend', 'corrected', 'correction', 'supersede', 'clarif', 'carve-out',
         'carve out', 'exception', 're-confirm', 'reconfirm', 'no longer',
         'was wrong', 'never was', 'and never was']


def norm(s):
    s = unicodedata.normalize('NFKC', s)
    for a, b in [('’', "'"), ('‘', "'"), ('“', '"'),
                 ('”', '"'), ('—', '-'), ('–', '-'),
                 ('‑', '-')]:
        s = s.replace(a, b)
    s = re.sub(r'[*_`>#|\[\]]', '', s)
    return re.sub(r'\s+', ' ', s).lower().strip()


def read(p):
    return open(os.path.join(ROOT, p), encoding='utf-8').read()


# ---- rule bodies ----
bodies = {}
for f in RULEFILES:
    lines = read(f).split('\n')
    st = [(int(m.group(1)), i) for i, l in enumerate(lines)
          for m in [re.match(r'^(\d{1,3})\.\s+\*\*', l)] if m]
    for k, (n, i) in enumerate(st):
        end = st[k + 1][1] if k + 1 < len(st) else len(lines)
        raw = '\n'.join(lines[i:end])
        bodies[n] = {'file': f, 'line': i + 1, 'raw': raw,
                     'norm': norm(raw), 'bytes': len(raw.encode())}
missing = [n for n in range(1, 100) if n not in bodies]

# ---- CLAUDE.md ----
cml = read('CLAUDE.md').split('\n')
sec = {int(m.group(1)): i for i, l in enumerate(cml)
       for m in [re.match(r'^## (\d) ', l)] if m}

bullets, cur = [], None
for i in range(sec[1], sec[2]):
    l = cml[i]
    if l.startswith('- '):
        if cur:
            bullets.append(cur)
        cur = {'line': i + 1, 'lines': [l]}
    elif cur:
        cur['lines'].append(l)
if cur:
    bullets.append(cur)

HEAD_RE = re.compile(r'^- \*\*(.+?)\*\*', re.S)
for b in bullets:
    b['raw'] = '\n'.join(b['lines']).rstrip()
    b['bytes'] = len(('\n'.join(b['lines']) + '\n').encode())
    m = HEAD_RE.match(b['raw'])
    head = m.group(1) if m else b['raw'][:120]
    b['head'] = re.sub(r'\s+', ' ', head)
    prim = set()
    for grp in re.findall(r'\(([^()]*?)\)', head):
        if re.fullmatch(r'[\d/,\s]*\d', grp.strip()):
            prim |= {int(x) for x in re.findall(r'\d{1,2}', grp)}
        else:
            m2 = re.match(r'^(\d{1,3})\s*[,;]', grp.strip())
            if m2:
                prim.add(int(m2.group(1)))
    for grp in re.findall(r'[Rr]ules?\s+([\d/,\s]*\d)', head):
        prim |= {int(x) for x in re.findall(r'\d{1,2}', grp)}
    b['primary'] = sorted(n for n in prim if 1 <= n <= 99)
    allc = set(b['primary'])
    for grp in re.findall(r'[Rr]ules?\s+([\d/,\s]*\d)', b['raw']):
        allc |= {int(x) for x in re.findall(r'\d{1,2}', grp)}
    for grp in re.findall(r'\(([\d/]+)\)', b['raw']):
        allc |= {int(x) for x in re.findall(r'\d{1,2}', grp)}
    b['all'] = sorted(n for n in allc if 1 <= n <= 99)

index_rows = {}
for i in range(sec[2], sec[3]):
    m = re.match(r'^\|\s*\*\*(\d{1,3})\*\*\s*\|\s*(.*?)\s*\|\s*$', cml[i])
    if m:
        index_rows[int(m.group(1))] = m.group(2)
# §2 trailing narrative paragraphs (after the tables)
s2 = '\n'.join(cml[sec[2]:sec[3]])
narr = {}
for para in re.split(r'\n\s*\n', s2):
    if para.lstrip().startswith('|') or para.lstrip().startswith('###'):
        continue
    for n in {int(x) for x in re.findall(r'[Rr]ule\s+(\d{1,2})', para)}:
        if 1 <= n <= 99:
            narr.setdefault(n, []).append(para)

# ---- skills / handoffs, SENTENCE-level ----
cite_files = sorted(glob.glob(os.path.join(ROOT, 'build/skills/*.md')) +
                    glob.glob(os.path.join(ROOT, 'build/handoffs/*.md')))
skill_sent = {}
for p in cite_files:
    rel = os.path.relpath(p, ROOT)
    txt = open(p, encoding='utf-8').read()
    for sent in re.split(r'(?<=[.!?])\s+|\n', txt):
        if len(sent) < 30:
            continue
        ns = set()
        for grp in re.findall(r'[Rr]ules?\s+([\d/,\s]*\d)', sent):
            ns |= {int(x) for x in re.findall(r'\d{1,2}', grp)}
        if not ns:
            continue
        if not (any(a in sent.lower() for a in AMEND)
                or re.search(r'2026-0\d-\d\d', sent)
                or re.search(r'[*_]{1,2}"', sent)):
            continue
        for n in sorted(x for x in ns if 1 <= x <= 99):
            skill_sent.setdefault(n, []).append((rel, sent.strip()))

# ---- atoms ----
QUOTE = re.compile(r'[*_]{1,2}"(.{18,400}?)"[*_]{1,2}', re.S)
DATE = re.compile(r'2026-0\d-\d\d')


def atoms(text):
    out = []
    for q in QUOTE.findall(text):
        out.append(('quote', ' '.join(q.split())))
    for d in sorted(set(DATE.findall(text))):
        out.append(('date', d))
    for nm in NAMES:
        if nm.lower() in text.lower():
            out.append(('name', nm))
    for a in AMEND:
        if a in text.lower():
            out.append(('amend-word', a))
            break
    return out


def carried(kind, val, bn):
    n = norm(val)
    if kind == 'quote':
        for L in (100, 70, 45, 30):
            if len(n) >= L and n[:L] in bn:
                return True
        return n in bn
    return n in bn


rows = []
for n in range(1, 100):
    bn = bodies[n]['norm']
    srcs = [('CLAUDE.md §1 L%d' % b['line'], b['raw'], 'S1')
            for b in bullets if n in b['primary']]
    if n in index_rows:
        srcs.append(('CLAUDE.md §2 index row', index_rows[n], 'S2'))
    for para in narr.get(n, []):
        srcs.append(('CLAUDE.md §2 narrative', para, 'S2N'))
    for rel, sent in skill_sent.get(n, []):
        srcs.append((rel, sent, 'SK'))
    miss, seen = [], set()
    for where, text, tag in srcs:
        for kind, val in atoms(text):
            if kind == 'amend-word':
                continue
            if carried(kind, val, bn):
                continue
            key = (kind, norm(val)[:50])
            if key in seen:
                continue
            seen.add(key)
            miss.append((where, tag, kind, val))
    aw = sorted({a for where, text, tag in srcs for a in AMEND
                 if a in text.lower()})
    if miss:
        rows.append({'n': n, 'file': os.path.basename(bodies[n]['file']),
                     'bytes': bodies[n]['bytes'], 'miss': miss,
                     'amend_words': aw,
                     'tags': sorted({m[1] for m in miss})})

print('== RULE-AMENDMENT DIVERGENCE SWEEP v2 ==')
print('rule bodies parsed 1..99: %d   missing: %s' % (len(bodies), missing or 'NONE'))
print('§1 bullets: %d   §2 index rows: %d   skill/handoff files: %d'
      % (len(bullets), len(index_rows), len(cite_files)))
print('rules checked: 99   flagged (>=1 uncarried atom): %d' % len(rows))
s1only = [r for r in rows if 'S1' in r['tags'] or 'S2' in r['tags']]
print('  of which the divergence is in CLAUDE.md itself (§1/§2): %d' % len(s1only))
print()
print('== ORPHAN §1 BULLETS (no rule number in the headline) ==')
for b in bullets:
    if not b['primary']:
        print('  L%-4d %5dB  cites-in-body=%s  %s'
              % (b['line'], b['bytes'], b['all'] or '-', b['head'][:88]))
print()
for r in sorted(rows, key=lambda x: (0 if ('S1' in x['tags'] or 'S2' in x['tags']) else 1, -len(x['miss']))):
    print('--- RULE %d (%s, body %dB) tags=%s amend-words=%s'
          % (r['n'], r['file'], r['bytes'], ','.join(r['tags']), ','.join(r['amend_words']) or '-'))
    for where, tag, kind, val in r['miss'][:12]:
        print('    [%-5s] %-26s %s' % (kind, where[:26], val[:130]))
