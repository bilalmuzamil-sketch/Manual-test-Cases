"""Check the tech plan's §1 PRD extract (first sentence of every S<n>-R/N/E id) against our PRD v1.0 copy."""
import re, sys, json
plan = open(sys.argv[1], encoding='utf-8').read().split('\n')
prd = open(sys.argv[2], encoding='utf-8').read()
def norm(s):
    s = s.replace('\\', '').replace('**', '').replace('`', '')
    s = re.sub(r'\s+', ' ', s)
    return s.strip()
P = norm(prd)
rows, bad = 0, []
for i, line in enumerate(plan[80:324], start=81):
    m = re.match(r'- \*\*(S\d+-[RNE]\d+a?)\*\* \(SV-\d+\): (.*)$', line)
    if not m: continue
    rows += 1
    code, text = m.group(1), m.group(2)
    text = re.sub(r'\s*➖ out of this plan.*$', '', text)
    text = text.rstrip('…').rstrip()
    t = norm(text)
    # the PRD carries the code before the text
    if t not in P:
        bad.append((i, code, t[:120]))
print(json.dumps({"rows": rows, "not_found": bad}, indent=1))
