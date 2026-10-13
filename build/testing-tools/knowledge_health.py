#!/usr/bin/env python3
"""KNOWLEDGE HEALTH — the more we learn, the faster we work, whatever the file sizes (Rule 128, QA lead 2026-10-13).

Growth is expected; reading a whole file never is. This tool keeps every knowledge file usable at any size:

  python3 build/testing-tools/knowledge_health.py                 report: every knowledge file vs its size budget + remedy
  python3 build/testing-tools/knowledge_health.py --check         exit 10 if a shardable store is over budget (used by hooks)
  python3 build/testing-tools/knowledge_health.py shard <file>    split an over-budget store into byte-verified parts,
                                                                  leaving a small index at the SAME path (links keep working)
  python3 build/testing-tools/knowledge_health.py verify <file>   re-prove that index + parts == the original bytes
  python3 build/testing-tools/knowledge_health.py logical <file>  print the whole logical file (index preface + all parts),
                                                                  for a tool that must parse it whole

Two split modes, chosen per file:
  sections  split at every level-2 heading ("## "); the index keeps each "## " and "### " heading line with a pointer to its
            part, so a grep for a section name (e.g. "§J", "WO Board") still lands in the index.   (APP-ACTIONS-PLAYBOOK.md)
  entries   split at learning entries ("## L0nnn" / "### L0nnn"); entries from the last HOT_DAYS stay in the file in full, older
            ones move to parts of ≤ MAX_PART_KB, and build/kb/<stem>/INDEX.md lists every moved entry's title.  (LEARNINGS-LOG.md)
Parts live in build/kb/<stem>/; build/kb/<stem>/INTEGRITY.md records sha256 of the original, of the moved region and of the
parts re-joined — they must match, or nothing is written. Nothing is ever deleted; content is MOVED and pointed at.
Files that tools parse whole (rule files, the core skill) are NOT split here — read them per rule / per section with
`recall.py --rule N` / `recall.py --section "<heading>" --file <path>` (no size limit), and switch their parsers to
`logical` before ever splitting them.
"""
import hashlib, os, re, subprocess, sys, datetime, glob

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
KB = os.path.join(ROOT, 'build', 'kb')
HOT_DAYS, MAX_PART_KB = 14, 120
# file -> (budget KB, mode or None, note)
STORES = {
    'build/APP-ACTIONS-PLAYBOOK.md': (150, 'sections', 'how-to store'),
    'build/LEARNINGS-LOG.md': (150, 'entries', 'learning store'),
    'build/KNOWLEDGE-MAP.md': (60, None, 'read whole by design — keep rows short; split into topic maps if it grows'),
}
PARSED = {  # read whole by tools: do not split until the tools read `logical`
    'build/rules/RULES-61-ONWARD.md': 'automation_markers.py, scan_secrets.py, check_rule_amendments.py',
    'build/skills/00-COMMON-CORE.md': 'automation_markers.py, verify_suite.py, check_tester_readiness.py',
}
READ_FIRST_BUDGET = 100   # skills, PROJECT-STATE, RESUME-HERE: meant to be read at the start of work
REFERENCE_BUDGET = 200    # rules and other reference files: read per section

def sha(b): return hashlib.sha256(b).hexdigest()
def rel(p): return os.path.relpath(p, ROOT)
def kb(n): return f'{n/1024:.0f} KB'

def files():
    out = set(STORES) | set(PARSED)
    for p in ['build/skills/*.md', 'build/rules/RULES-*.md', 'build/*/PROJECT-STATE.md', 'build/*/*/RESUME-HERE.md', 'CLAUDE.md']:
        out |= {rel(f) for f in glob.glob(os.path.join(ROOT, p))}
    return sorted(out)

def budget(f):
    if f in STORES: return STORES[f][0]
    if f.startswith('build/skills/') or f.endswith(('PROJECT-STATE.md', 'RESUME-HERE.md')): return READ_FIRST_BUDGET
    return REFERENCE_BUDGET

def report(check=False):
    over_shardable = []
    print(f'{"file":<62} {"size":>8} {"budget":>7}  status / remedy')
    for f in files():
        p = os.path.join(ROOT, f)
        if not os.path.exists(p): continue
        n = os.path.getsize(p); b = budget(f)
        if n <= b * 1024:
            if not check: print(f'{f:<62} {kb(n):>8} {b:>4} KB  ok')
            continue
        if f in STORES and STORES[f][1]:
            if movable(f):
                over_shardable.append(f); r = f'OVER — run: knowledge_health.py shard {f}'
            else:
                r = 'OVER, NOTHING LEFT TO MOVE — the index itself is too big: split it into topic indexes (warning, not a block)'
        elif f in PARSED:
            r = f'OVER — read per rule/section with recall.py; parsed whole by {PARSED[f]} (switch them to `logical` before splitting)'
        elif f.startswith('build/rules/'):
            r = 'OVER — read per rule: recall.py --rule N (prints the rule and every amendment)'
        else:
            r = 'OVER — read per section: recall.py --section "<heading>" --file ' + f + '; move history/archive sections to a dated file'
        print(f'{f:<62} {kb(n):>8} {b:>4} KB  {r}')
    if check:
        return 10 if over_shardable else 0   # 10 = over budget (1 would be confused with a crash)
    return 0

def movable(f):
    """Would a shard move anything? (only then may a hook block on this file)"""
    text = open(os.path.join(ROOT, f)).read()
    if STORES[f][1] == 'sections':
        return any('→ part `build/kb/' not in b for _, b in split_sections(text)[1])
    return bool(split_entries(text, datetime.date.today())[1])

def split_sections(text):
    lines = text.split('\n'); cut = [i for i, l in enumerate(lines) if l.startswith('## ')]
    if not cut: return text, []
    pre = '\n'.join(lines[:cut[0]]) + '\n'
    parts = []
    for k, i in enumerate(cut):
        j = cut[k + 1] if k + 1 < len(cut) else len(lines)
        body = '\n'.join(lines[i:j]) + ('\n' if j < len(lines) else '')
        parts.append((lines[i], body))
    return pre, parts

ENTRY = re.compile(r'^#{2,3} L\d{4}\b')
DATE = re.compile(r'20\d\d-\d\d-\d\d')

def split_entries(text, today):
    lines = text.split('\n'); starts = [i for i, l in enumerate(lines) if ENTRY.match(l)]
    if not starts: return text, [], ''
    # hot tail: the longest run of trailing entries dated within HOT_DAYS
    cutoff = today - datetime.timedelta(days=HOT_DAYS)
    hot_from = len(starts)
    for k in range(len(starts) - 1, -1, -1):
        m = DATE.search(lines[starts[k]])
        if m and datetime.date.fromisoformat(m.group()) >= cutoff: hot_from = k
        else: break
    # a burst of learning: if the recent entries alone exceed half the budget, move the older of them as well
    limit = STORES['build/LEARNINGS-LOG.md'][0] * 1024 // 2
    while hot_from < len(starts) - 1 and len('\n'.join(lines[starts[hot_from]:]).encode()) > limit:
        hot_from += 1
    if hot_from == 0: return text, [], ''
    pre = '\n'.join(lines[:starts[0]]) + '\n'
    tail_start = starts[hot_from] if hot_from < len(starts) else len(lines)
    tail = '\n'.join(lines[tail_start:])
    entries = []
    for k in range(hot_from):
        i = starts[k]; j = starts[k + 1] if k + 1 < len(starts) else len(lines)
        entries.append((lines[i], '\n'.join(lines[i:j]) + ('\n' if j < len(lines) else '')))   # the file's last entry keeps the file's own ending
    return pre, entries, tail

def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:40] or 'part'

def shard(f):
    p = os.path.join(ROOT, f); mode = STORES.get(f, (0, None))[1]
    if not mode: sys.exit(f'{f}: not a shardable store (see STORES in this tool)')
    raw = open(p, 'rb').read(); text = raw.decode('utf-8')
    stem = os.path.splitext(os.path.basename(f))[0]; d = os.path.join(KB, stem); os.makedirs(d, exist_ok=True)
    existing = sorted(glob.glob(os.path.join(d, '[0-9][0-9][0-9]-*.md')))
    # number AFTER the highest existing part (never by count: a removed part would make the next split overwrite another)
    n0 = max([int(os.path.basename(x)[:3]) for x in existing] or [0])
    if mode == 'sections':
        pre, secs = split_sections(text)
        # a previous shard left pointer stubs: only real sections (with body beyond a pointer) move
        moved = [(h, b) for h, b in secs if '→ part `build/kb/' not in b]
        if not moved: print(f'{f}: nothing new to move'); return
        keep = [(h, b) for h, b in secs if '→ part `build/kb/' in b]
        out_parts, index_lines = [], []
        for k, (h, b) in enumerate(moved):
            name = f'{n0 + k + 1:03d}-{slug(h[3:])}.md'; out_parts.append((name, b))
            subs = [l for l in b.split('\n')[1:] if l.startswith('### ')][:40]
            index_lines.append(h + '\n→ part `build/kb/' + stem + '/' + name + f'` ({kb(len(b.encode()))})'
                               + (''.join('\n  - ' + s[4:].strip()[:140] for s in subs)) + '\n')
        assert pre + ''.join(b for _, b in secs) == text, 'sections split lost bytes'
        region = ''.join(b for _, b in moved)
        new_index = pre + ''.join(b for _, b in keep) + '\n'.join(index_lines) + '\n'
        tail = ''
    else:
        pre, entries, tail = split_entries(text, datetime.date.today())
        if not entries: print(f'{f}: nothing old enough to move (hot window {HOT_DAYS} days)'); return
        out_parts, cur, size = [], [], 0
        for h, b in entries:
            if cur and size + len(b.encode()) > MAX_PART_KB * 1024:
                out_parts.append(cur); cur, size = [], 0
            cur.append((h, b)); size += len(b.encode())
        if cur: out_parts.append(cur)
        named = []
        for k, grp in enumerate(out_parts):
            ids = [re.search(r'L\d{4}', h).group() for h, _ in grp]
            named.append((f'{n0 + k + 1:03d}-{ids[0]}-{ids[-1]}.md', ''.join(b for _, b in grp), grp))
        region = ''.join(b for _, b, _ in named)
        out_parts = [(n, b) for n, b, _ in named]
        idx = os.path.join(d, 'INDEX.md')
        old_idx = open(idx).read() if os.path.exists(idx) else f'# {stem} — every moved entry, by part (titles only; recall.py searches the parts)\n'
        with open(idx, 'w') as fh:
            fh.write(old_idx + ''.join(f'\n## build/kb/{stem}/{n}\n' + ''.join(f'- {h.lstrip("# ")[:160]}\n' for h, _ in grp) for n, _, grp in named))
        pointer = (f'\n> **Older entries moved (byte-verified) — {datetime.date.today()}:** ' +
                   ', '.join(f'`build/kb/{stem}/{n}`' for n, _ in out_parts) +
                   f'. Titles: `build/kb/{stem}/INDEX.md`. Search all of them: `python3 build/testing-tools/recall.py "<words>"`.\n\n')
        new_index = pre + pointer + tail
    rejoined = ''.join(b for _, b in out_parts)
    assert rejoined == region, 'parts do not re-join to the moved region'
    # the moved region + what stays must account for every byte of the original
    if mode == 'entries':
        assert pre + region + tail == text, 'entries split lost bytes'
    clash = [n for n, _ in out_parts if os.path.exists(os.path.join(d, n))]
    if clash: sys.exit(f'REFUSED: part file(s) already exist, nothing written: {clash}')
    for name, b in out_parts:
        with open(os.path.join(d, name), 'x') as fh: fh.write(b)   # 'x' = never overwrite
    with open(p, 'w') as fh: fh.write(new_index)
    with open(os.path.join(d, 'INTEGRITY.md'), 'a') as fh:
        fh.write(f'\n## {datetime.datetime.utcnow():%Y-%m-%d %H:%M} UTC — shard of `{f}` ({mode})\n'
                 f'- original: {len(raw)} bytes, sha256 `{sha(raw)}`\n'
                 f'- moved region: {len(region.encode())} bytes, sha256 `{sha(region.encode())}`\n'
                 f'- parts re-joined: sha256 `{sha(rejoined.encode())}` — {"MATCH" if rejoined == region else "MISMATCH"}\n'
                 f'- parts: ' + ', '.join(n for n, _ in out_parts) + f'\n- index left at `{f}`: {len(new_index.encode())} bytes\n')
    print(f'{f}: {kb(len(raw))} → index {kb(len(new_index.encode()))} + {len(out_parts)} part(s) in build/kb/{stem}/ (verified)')

def logical(f):
    p = os.path.join(ROOT, f); stem = os.path.splitext(os.path.basename(f))[0]
    text = open(p).read(); parts = sorted(glob.glob(os.path.join(KB, stem, '[0-9][0-9][0-9]-*.md')))
    return text + ''.join('\n' + open(x).read() for x in parts)

def verify(f):
    stem = os.path.splitext(os.path.basename(f))[0]; d = os.path.join(KB, stem)
    log = open(os.path.join(d, 'INTEGRITY.md')).read()
    ok = True
    for blk in log.split('\n## ')[1:]:
        names = re.search(r'- parts: (.*)', blk).group(1).split(', ')
        want = re.search(r'moved region: \d+ bytes, sha256 `([0-9a-f]+)`', blk).group(1)
        missing = [n for n in names if not os.path.exists(os.path.join(d, n))]
        if missing:
            print('FAIL ' + blk.split('\n')[0] + ' — part(s) missing: ' + ', '.join(missing)); ok = False; continue
        got = sha(''.join(open(os.path.join(d, n)).read() for n in names).encode())
        # Parts are live content: editing one later is allowed. The split itself was proved lossless when it was made
        # (the assertion in shard() refuses to write otherwise); a later edit is reported, not treated as damage.
        print(('OK   ' if got == want else 'EDITED SINCE SPLIT (allowed) ') + blk.split('\n')[0])
    return 0 if ok else 1

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a or a[0] in ('--check', 'report'): sys.exit(report(check=bool(a) and a[0] == '--check'))
    if a[0] == 'shard': shard(a[1])
    elif a[0] == 'verify': sys.exit(verify(a[1]))
    elif a[0] == 'logical': sys.stdout.write(logical(a[1]))
    else: sys.exit(__doc__)
