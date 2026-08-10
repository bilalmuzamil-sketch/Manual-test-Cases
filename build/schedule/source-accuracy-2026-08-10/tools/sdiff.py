import json, difflib
from secx import sections
V=[23,24,25,26,27]
S={v: sections(f'spec/713031682-v{v}.json') for v in V}
for a,b in zip(V, V[1:]):
    A,B = S[a], S[b]
    added = [k for k in B if k not in A]
    removed = [k for k in A if k not in B]
    changed = [k for k in A if k in B and A[k]['text'] != B[k]['text']]
    retitled = [k for k in A if k in B and A[k]['title'] != B[k]['title']]
    print(f'== v{a} -> v{b}: sections {len(A)} -> {len(B)} | added {added} | removed {removed} | retitled {retitled} | text-changed {changed}')
json.dump({str(v): {k: S[v][k]['text'] for k in S[v]} for v in V}, open('sched-sections.json','w'), indent=1)
