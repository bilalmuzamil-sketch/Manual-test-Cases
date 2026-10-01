#!/usr/bin/env python3
"""PRD section 7 has TWO gates, and I only coded the second one.

Verbatim: "The query is also trigrammed; candidates with Jaccard similarity >= 0.35 against the
query trigrams are eligible for fuzzy match... AMONG TRIGRAM-ELIGIBLE CANDIDATES, compute edit
distance..."

So the edit-distance threshold (>= 0.70) is only reached by candidates that ALREADY cleared the
trigram gate. My damage generator checked the second and ignored the first, so it declared variants
"the spec promises this must match" that the spec's own algorithm would never even consider.

A transposition destroys trigrams on BOTH sides of the swap. On a long word that is a small
fraction of the total; on a short word it can destroy all of them.
"""
def tri(w):
    w = w.lower()
    return {w[i:i+3] for i in range(len(w)-2)} if len(w) >= 3 else {w}

def jaccard(a, b):
    A, B = tri(a), tri(b)
    return len(A & B) / len(A | B) if (A | B) else 0.0

def report(word, variants):
    print(f'\n{word!r}  ({len(word)} letters, {len(tri(word))} trigrams)')
    for kind, v in variants:
        j = jaccard(word, v)
        sim = 1 - 1/max(len(word), len(v))
        gate1 = j >= 0.35
        verdict = ('spec PROMISES a match' if gate1 and sim >= 0.70
                   else 'spec does NOT promise it — fails the trigram gate' if not gate1
                   else 'fails the edit-distance threshold')
        print(f'   {kind:<14} {v:<14} trigram overlap {j:.2f} vs 0.35  |  similarity {sim:.2f} vs 0.70  ->  {verdict}')

report('master',       [('transposition','matser'),('substitution','masxer'),('deletion','maser'),('insertion','maseter')])
report('Freightliner', [('transposition','rFeightliner'),('substitution','Freighxliner'),('deletion','Freighliner'),('insertion','Freighetliner')])
report('Bilal',        [('transposition','Blial'),('substitution','Bixal'),('deletion','Bial'),('insertion','Bielal')])
report('Peterson',     [('deletion','Petersn')])
report('freightliner', [('transposition','freihgtliner')])
