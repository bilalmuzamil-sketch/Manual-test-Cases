import json, sys, os, collections
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import setup as S
L = json.load(open(f'{D}/live.json')); H = json.load(open(f'{D}/../hard-classes.json'))
MANUAL = getattr(__import__('manual'), 'MANUAL', {}) if os.path.exists(f'{D}/manual.py') else {}
U = collections.Counter(); per = {}
for k in H:
    items, unseen, un = S.setup_for(L[k], MANUAL); per[k] = (items, unseen, un)
    for u in un: U[u] += 1
print('unhandled distinct', len(U), 'lines', sum(U.values()))
for u, c in U.most_common(): print(c, '|', u[:200])
if '--show' in sys.argv:
    k = sys.argv[sys.argv.index('--show') + 1]; it, un, _ = per[k]
    for a, b in it: print('*', a, ':', b)
    print('UNSEEN', un)
