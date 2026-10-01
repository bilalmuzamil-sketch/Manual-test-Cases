#!/usr/bin/env python3
"""The damage patterns PRD v1.5 section 7 actually supports, and whether the spec says each
variant MUST match. Nothing is tested that the spec does not promise.

Section 7, verbatim:
  "Among trigram-eligible candidates, compute edit distance against the closest token in the
   candidate. The similarity score is `1 - (distance / max(len(query), len(token)))`. Accept the
   candidate as a fuzzy match when similarity >= 0.70 for queries of length >= 4, and >= 0.80 for
   shorter queries... Damerau handles transpositions, so `freihgtliner` -> `freightliner` works."

So the valid operations are the Damerau-Levenshtein set: SUBSTITUTION, DELETION, INSERTION and
ADJACENT TRANSPOSITION - each a single edit, so distance = 1 in every case.
"""
def variants(w):
    """Four single-edit variants, each with the similarity the spec's own formula gives."""
    out = []
    n = len(w)
    mid = n // 2
    # transposition - the spec calls this out by name
    if n >= 4:
        a = list(w); a[mid-1], a[mid] = a[mid], a[mid-1]
        t = ''.join(a)
        if t.lower() != w.lower(): out.append(('transposition', t))
    # substitution
    a = list(w); a[mid] = 'x' if a[mid].lower() != 'x' else 'z'
    out.append(('substitution', ''.join(a)))
    # deletion - the spec's own example, Petersn for Peterson
    out.append(('deletion', w[:mid] + w[mid+1:]))
    # insertion
    out.append(('insertion', w[:mid] + 'e' + w[mid:]))
    res = []
    for kind, v in out:
        # one edit => distance 1; similarity = 1 - 1/max(len(query), len(token))
        sim = 1 - 1 / max(len(v), len(w))
        need = 0.70 if len(v) >= 4 else 0.80
        res.append({'kind': kind, 'typed': v, 'similarity': round(sim, 3),
                    'threshold': need, 'spec_says_must_match': sim >= need})
    return res

if __name__ == '__main__':
    import json, sys
    for w in sys.argv[1:] or ['Crankshaft', 'Peterson', 'Freightliner', 'Bilal']:
        print(w)
        for v in variants(w):
            flag = 'MUST MATCH' if v['spec_says_must_match'] else 'below threshold - not promised'
            print(f"   {v['kind']:<14} {v['typed']:<16} similarity {v['similarity']:.2f} vs {v['threshold']:.2f}  {flag}")
