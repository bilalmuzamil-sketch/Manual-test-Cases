import json, re, collections, sys
d = json.load(open('unique-lines.json'))
def norm(l):
    l = re.sub(r"\b(part|parts|user|role|vendor|location|work order|part sale|purchase order|window|tab|invoice|core|bin|entry|line|staff member) ([A-Z0-9])\b", r"\1 X", l)
    l = re.sub(r"\$?\d[\d,\.]*", "N", l); l = re.sub(r'"[^"]*"', '"Q"', l)
    return l
kind = sys.argv[1]; pat = re.compile(sys.argv[2], re.I) if len(sys.argv) > 2 else None
T = collections.Counter()
for l, n in d[kind]:
    if pat and not pat.search(l): continue
    T[norm(l)] += n
for t, n in T.most_common(int(sys.argv[3]) if len(sys.argv) > 3 else 400): print(n, t[:230])
print('templates', len(T))
