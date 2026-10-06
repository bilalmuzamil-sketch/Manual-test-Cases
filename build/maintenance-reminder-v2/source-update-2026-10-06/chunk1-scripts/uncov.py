import json,re,collections
exec(open("/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/qcheck.py").read().split("cited=collections")[0])
rows=json.load(open("/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/qrows.json"))
q=collections.defaultdict(list)
for r in rows: q[r[2]].append(r[4])
for a,t in anc.items():
    sents=[s.strip() for s in re.split(r"(?<=[.;:])\s+(?=[A-Z])",t) if s.strip()]
    allq=" ".join(q.get(a,[]))
    miss=[s for s in sents if s.rstrip(".") not in allq]
    if miss: print(a,"::",miss)
