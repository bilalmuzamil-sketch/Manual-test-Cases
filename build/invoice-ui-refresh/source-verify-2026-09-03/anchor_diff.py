#!/usr/bin/env python3
"""Anchor-level diff, HELD v39 body vs the LIVE body pulled 2026-09-03.

Method inherited verbatim from build/report-suite/source-verify-2026-08-26/tools/verify.py
(Rule 27 - reuse the recorded recipe): the requirement unit is the spec's own anchor
(S<n>-R<n>, S<n>-N<n>, S<n>-E<n>), its text is the span from that anchor to the NEXT anchor, and
EVERY occurrence is kept - an anchor is often cross-referenced before it is defined, and a
`setdefault` here produced a FALSE ALL-CLEAR on one report in August.

Nothing here reads a spec body into the session's context: bodies go file-to-file and only
anchor IDs, counts and explicitly-requested anchors are printed.
"""
import re, sys, os
D = os.path.dirname(os.path.abspath(__file__))
HELD = f'{D}/../intake-2026-08-21/sources/spec-body-confluence-v39-755990532.md'
LIVE = f'{D}/spec-body-confluence-LIVE-2026-09-03-755990532.md'
ANCHOR = re.compile(r'\*\*(S\d+-[RNE]\d+[a-z]?)')


def norm(s):
    """Normalise MARKUP, never wording. The live page comes back as markdown and the held body was
    saved in a slightly different flavour, so `*` vs `-` list markers and `_\\*` vs `*\\*` emphasis
    made the first run report ALL 109 anchors as changed - a statement about the diff, not the spec
    (skill 03 §8.0-a). Everything removed here is punctuation that cannot carry a requirement."""
    s = re.sub(r'\s+', ' ', s)
    s = re.sub(r'[*_]+', '', s)          # emphasis of any flavour
    s = re.sub(r'\\(.)', r'\1', s)        # backslash escapes
    s = re.sub(r'(?m)^\s*[-*+\u2022]\s+', '', s)
    s = re.sub(r'\s*[-*+\u2022]\s*$', '', s)
    return s.strip()

def anchors(path):
    t = open(path, encoding='utf-8').read()
    hits = [(m.group(1), m.start()) for m in ANCHOR.finditer(t)]
    out = {}
    for i, (a, pos) in enumerate(hits):
        end = hits[i+1][1] if i+1 < len(hits) else len(t)
        # STOP AT THE STORY BOUNDARY. Running the span to the next anchor makes the LAST anchor of
        # every story swallow that story's trailing context note AND the next story's heading, so a
        # change anywhere downstream lit up an unrelated anchor - 13 of the first run's 26 "changes"
        # were the "-N" negatives, which are always last in their block.
        seg = t[pos:end]
        cut = min([m.start() for m in re.finditer(r'\n\s*(?:---|###)', seg)] or [len(seg)])
        span = norm(seg[:cut])
        out.setdefault(a, []).append(span)
    return out, t

held, held_t = anchors(HELD)
live, live_t = anchors(LIVE)
print(f'HELD v39 : {len(held_t):,} chars, {len(held)} distinct anchors')
print(f'LIVE     : {len(live_t):,} chars, {len(live)} distinct anchors')
added   = sorted(set(live) - set(held))
removed = sorted(set(held) - set(live))
changed = sorted(a for a in set(held) & set(live) if held[a] != live[a])
print(f'\nANCHORS ADDED   ({len(added)}): {added}')
print(f'ANCHORS REMOVED ({len(removed)}): {removed}')
print(f'ANCHORS CHANGED ({len(changed)}): {changed}')
# only the anchors named on the command line get their text printed
for a in sys.argv[1:]:
    print(f'\n===== {a} =====')
    print(' HELD v39 :', (held.get(a) or ['<absent>'])[0][:600])
    print(' LIVE     :', (live.get(a) or ['<absent>'])[0][:600])

def wordlevel(a, b, width=210):
    """Print only the fragments that differ, so a delta can be judged without reading the spec."""
    import difflib
    sm = difflib.SequenceMatcher(None, a.split(), b.split())
    out = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            continue
        was = ' '.join(a.split()[i1:i2])[:width]
        now = ' '.join(b.split()[j1:j2])[:width]
        out.append(f'      - was: {was or "(nothing)"}\n        now: {now or "(nothing)"}')
    return '\n'.join(out) or '      (no word-level difference)'

if os.environ.get('DELTA'):
    print('\n================ WORD-LEVEL DELTA, v39 -> LIVE ================')
    for a in sorted(set(held) & set(live)):
        if held[a] != live[a]:
            print(f'\n  {a}:')
            print(wordlevel(held[a][0], live[a][0]))
    for a in sorted(set(live) - set(held)):
        print(f'\n  {a}  ** NEW **:\n      {live[a][0][:420]}')
