#!/usr/bin/env python3
"""Diff our 85 asserted label strings against the vocabulary harvested from the build.

Emits, per string: EXACT (build shows it verbatim) / CASE (build shows it with
different capitalisation) / VARIANT (build shows a near string) / ABSENT (not seen
on the surfaces harvested -- which is NOT the same as 'not in the build').
"""
import json, sys, re, difflib, os

EV = os.path.join(os.path.dirname(__file__), '..', 'evidence')

def norm(s):
    return re.sub(r'\s+', ' ', s or '').strip()

def load_vocab(files):
    vocab = set()
    for f in files:
        p = os.path.join(EV, f)
        if not os.path.exists(p):
            continue
        h = json.load(open(p))
        for key in ('page', 'after_toolbar'):
            blk = h.get(key)
            if not blk:
                continue
            for t in blk.get('texts', []):
                vocab.add(norm(t))
            for t in blk.get('tids', []):
                for v in (t.get('txt'), t.get('al')):
                    if v:
                        vocab.add(norm(v))
            body = blk.get('body') or ''
            for line in body.split('\n'):
                line = norm(line)
                if line and len(line) < 90:
                    vocab.add(line)
    vocab.discard('')
    return vocab

def main():
    labels = [norm(l.split(None, 1)[1]) for l in
              open(os.path.join(EV, 'distinct_labels.txt')) if l.strip()]
    vocab = load_vocab(sys.argv[1:] or ['harvest3.json', 'harvest2.json', 'harvest1.json'])
    lower = {v.lower(): v for v in vocab}
    out = []
    for lab in labels:
        if lab in vocab:
            out.append((lab, 'EXACT', lab))
        elif lab.lower() in lower:
            out.append((lab, 'CASE', lower[lab.lower()]))
        else:
            near = difflib.get_close_matches(lab, list(vocab), n=1, cutoff=0.82)
            out.append((lab, 'VARIANT', near[0]) if near else (lab, 'ABSENT', ''))
    counts = {}
    for _, v, _ in out:
        counts[v] = counts.get(v, 0) + 1
    print('vocab strings harvested:', len(vocab))
    print('verdicts:', counts)
    print()
    for lab, v, b in out:
        if v != 'EXACT':
            print(f'{v:8} ours={lab!r}  build={b!r}')
    json.dump([{'ours': a, 'verdict': b, 'build': c} for a, b, c in out],
              open(os.path.join(EV, 'label_diff.json'), 'w'), indent=1)

if __name__ == '__main__':
    main()
