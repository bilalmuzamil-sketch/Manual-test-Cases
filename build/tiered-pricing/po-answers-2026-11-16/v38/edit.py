"""Apply exact, once-only text replacements to a library file. python3 edit.py <file> <pairs.json>  (pairs: [[old, new], ...])"""
import sys, json
f, pairs = sys.argv[1], json.load(open(sys.argv[2]))
s = open(f).read()
for i, (o, n) in enumerate(pairs):
    c = s.count(o)
    if c != 1: sys.exit(f"pair {i}: old text found {c} times: {o[:90]!r}")
    s = s.replace(o, n)
open(f, 'w').write(s); print(f"{f}: {len(pairs)} replacements")
