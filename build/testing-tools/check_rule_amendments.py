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
# 🛑 THE RULE FILES ARE DISCOVERED, NEVER LISTED. Failure this prevents: the file
# holding rules 61+ has been renamed on every rule addition (RULES-61-93 -> -94 ->
# -95 -> -96 -> -97 -> -98 -> -99), so a hard-coded filename silently drops every
# rule in it and the sweep reports a clean run over a corpus it never read.
RULEFILES = sorted(os.path.relpath(p, ROOT) for p in
                   glob.glob(os.path.join(ROOT, 'build/rules/RULES-*.md')))
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
seen_at = {}
dupes = []
for f in RULEFILES:
    lines = read(f).split('\n')
    st = [(int(m.group(1)), i) for i, l in enumerate(lines)
          for m in [re.match(r'^(\d{1,3})\.\s+\*\*', l)] if m]
    for k, (n, i) in enumerate(st):
        end = st[k + 1][1] if k + 1 < len(st) else len(lines)
        raw = '\n'.join(lines[i:end])
        if n in bodies:
            dupes.append((n, seen_at[n], '%s:%d' % (f, i + 1)))
        seen_at[n] = '%s:%d' % (f, i + 1)
        bodies[n] = {'file': f, 'line': i + 1, 'raw': raw,
                     'norm': norm(raw), 'bytes': len(raw.encode())}

# 🛑 THE RANGE IS MEASURED FROM THE BODIES, NEVER WRITTEN DOWN. Failure this
# prevents: a literal ceiling (this line used to read `range(1, 100)`) makes the
# sweep report "missing: NONE" over rules 1..99 while never looking at rule 100 —
# a completeness check that passes by ignoring the newest rule. Same failure shape
# as the 2026-08-21 CLAUDE.md truncation and as INTEGRITY.md's hard-coded
# assertion; this derivation deliberately mirrors the no-loss assertion in
# build/rules/INTEGRITY.md (max of the rule numbers the bodies actually carry) so
# the two cannot diverge.
if not bodies:
    sys.exit('FATAL: no rule bodies found in %s — expected lines of the form\n'
             '       "<n>. **<TITLE>" in build/rules/RULES-*.md. Nothing swept.'
             % (', '.join(RULEFILES) or 'build/rules/RULES-*.md'))
RULE_MAX = max(bodies)
missing = [n for n in range(1, RULE_MAX + 1) if n not in bodies]

# A gap or a duplicate means a rule body is absent or double-counted, so every
# "carried / not carried" verdict below is computed over a corpus we cannot vouch
# for. FAIL LOUDLY — never print a clean sweep over a broken corpus.
if missing or dupes:
    print('== RULE-AMENDMENT DIVERGENCE SWEEP v2 — CORPUS CHECK FAILED ==')
    print('rule files (globbed): %s' % ', '.join(RULEFILES))
    print('rule bodies found: %d   highest rule number: %d'
          % (len(bodies), RULE_MAX))
    if missing:
        print('GAPS — no body for rule(s): %s'
              % ', '.join(str(n) for n in missing))
    for n, first, second in dupes:
        print('DUPLICATE — rule %d has bodies at %s and %s' % (n, first, second))
    sys.exit('REFUSING TO SWEEP: the rule corpus is incomplete, so no result '
             'from this tool would be trustworthy. Fix the corpus, then re-run.')

# 🛑 A CITED RULE NUMBER HAS NO DIGIT LIMIT. Failure this prevents: every attribution regex
# below used to read `\d{1,2}`, so the moment rule 100 exists a citation to "Rule 100" parses
# as `10` and the atom is charged to RULE 10 — a SILENT MISATTRIBUTION that simultaneously
# hides rule 100's real divergence and invents one against rule 10. The sweep range was
# uncapped on 2026-09-02 so rule 100 WILL be swept; without this, it would be swept and then
# mis-filed. Same failure class as the three-literal marker gate and INTEGRITY.md's
# hard-coded rule range: a hard limit that passes by ignoring anything new.
#
# ANCHORING — why `\b\d+\b` and not a bare `\d+`:
#   * a case id cannot leak in: 'C45068' yields NOTHING (no word boundary after 'C'),
#     where `\d{1,2}` yielded 45, 06 and 8.
#   * a date or ticket id degrades safely: '8/5/2026' yields 2026 and 'SV-8582' yields 8582,
#     both rejected by the corpus clamp below — where `\d{1,2}` invented rules 20/26 and
#     85/82 out of the same strings.
#   * the clamp `1 <= n <= RULE_MAX` is the real guard, and RULE_MAX is MEASURED from the
#     bodies, so it widens by itself as rules are added.
CITE_NUM = re.compile(r'\b\d+\b')


def cited(text):
    """Rule numbers cited in `text`: whole numbers of ANY length, clamped to the live corpus."""
    return {n for n in (int(x) for x in CITE_NUM.findall(text)) if 1 <= n <= RULE_MAX}


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
            prim |= cited(grp)
        else:
            m2 = re.match(r'^(\d+)\s*[,;]', grp.strip())
            if m2:
                prim.add(int(m2.group(1)))
    for grp in re.findall(r'[Rr]ules?\s+([\d/,\s]*\d)', head):
        prim |= cited(grp)
    b['primary'] = sorted(n for n in prim if 1 <= n <= RULE_MAX)
    allc = set(b['primary'])
    for grp in re.findall(r'[Rr]ules?\s+([\d/,\s]*\d)', b['raw']):
        allc |= cited(grp)
    for grp in re.findall(r'\(([\d/]+)\)', b['raw']):
        allc |= cited(grp)
    b['all'] = sorted(n for n in allc if 1 <= n <= RULE_MAX)

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
    for n in {int(x) for x in re.findall(r'[Rr]ule\s+(\d+)', para)}:
        if 1 <= n <= RULE_MAX:
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
            ns |= cited(grp)
        if not ns:
            continue
        if not (any(a in sent.lower() for a in AMEND)
                or re.search(r'2026-0\d-\d\d', sent)
                or re.search(r'[*_]{1,2}"', sent)):
            continue
        for n in sorted(x for x in ns if 1 <= x <= RULE_MAX):
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
# Sweep the MEASURED range, not a literal one: `range(1, 100)` here checked 1..99
# and would have skipped rule 100 the day it landed, while still printing
# "missing: NONE" — the newest rule is the one most likely to be un-backfilled.
for n in range(1, RULE_MAX + 1):
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
# Every label below reports a MEASURED value. A literal in a label is a lie the
# moment a rule is added: "rule bodies parsed 1..99" kept claiming 99 was the top
# of the corpus no matter how many rules existed above it.
print('rule bodies parsed 1..%d: %d   missing: %s'
      % (RULE_MAX, len(bodies), missing or 'NONE'))
print('rule files (globbed): %s' % ', '.join(os.path.basename(f) for f in RULEFILES))
print('§1 bullets: %d   §2 index rows: %d   skill/handoff files: %d'
      % (len(bullets), len(index_rows), len(cite_files)))
print('rules checked: %d   flagged (>=1 uncarried atom): %d' % (RULE_MAX, len(rows)))
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
