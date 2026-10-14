import json,sys
r=json.load(open(sys.argv[1])); out=[]
for f in r:
    out.append(f"\n## {f['flow']}  ({f['board']}, {f['secs']}s)")
    prev=f.get('start_text','')
    for s in f['steps']:
        a=[l for l in s['text'].split('\n') if l.strip()]; b=set(l for l in prev.split('\n') if l.strip())
        added=[l for l in a if l not in b]; removed=[l for l in b if l not in set(a)]
        out.append(f"- {s['step']} -> {s['result'][:80]}\n    + {' | '.join(added)[:700]}\n    - {' | '.join(sorted(removed))[:400]}")
        prev=s['text']
    if f.get('console'): out.append("  console: "+' ; '.join(f['console'])[:300])
open(sys.argv[2],'w').write('\n'.join(out))
