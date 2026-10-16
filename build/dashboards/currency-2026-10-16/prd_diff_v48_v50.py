"""Diff PRD v48 copy vs v50 copy by requirement code + every non-code line (normalised). Read-only. Same method as prd_diff_v44_v46.py."""
import re, json, difflib, os
D = os.path.dirname(os.path.abspath(__file__))
OLD = f"{D}/../currency-2026-10-14/CONFLUENCE-788430850-v48-2026-10-14c.md"; NEW = f"{D}/CONFLUENCE-788430850-v50-2026-10-16.md"
def strip_hdr(t): return re.sub(r'^<!--.*?-->\s*', '', t, flags=re.S)
def norm(s):
    s = s.replace('\\*', '*').replace('_\\*', '*').replace('\\', '')
    s = re.sub(r'<custom[^>]*>(.*?)</custom>', r'\1', s)
    s = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'\1', s)
    s = re.sub(r'<(https?://[^>]+)>', r'\1', s)
    s = re.sub(r'^\s*[-*•]\s+', '', s); s = s.replace('**', '')
    s = re.sub(r'\s+', ' ', s).strip()
    return s
CODE = re.compile(r'^\s*[-*]\s+\*\*(S\d+-[RNE]\d+[a-z]?)(\s*\([^)]*\))?:?\*\*:?\s*(.*)$')
def parse(t):
    codes, other = {}, []
    for line in strip_hdr(t).split('\n'):
        m = CODE.match(line)
        if m: codes[m.group(1)] = norm((m.group(2) or '') + ' ' + m.group(3))
        elif line.strip() and norm(line) not in ('| | |', '| --- | --- |', ''): other.append(norm(line))
    return codes, other
o, oo = parse(open(OLD).read()); n, no = parse(open(NEW).read())
added = sorted(set(n) - set(o)); removed = sorted(set(o) - set(n))
reworded = sorted(c for c in set(o) & set(n) if o[c] != n[c]); same = sorted(c for c in set(o) & set(n) if o[c] == n[c])
nd = [l for l in difflib.unified_diff(oo, no, lineterm='', n=0) if not l.startswith(('---', '+++', '@@'))]
out = {"old_version": 48, "new_version": 50, "counts": {"old": len(o), "new": len(n), "added": len(added), "removed": len(removed),
       "reworded": len(reworded), "identical": len(same)}, "added": {c: n[c] for c in added}, "removed": {c: o[c] for c in removed},
       "reworded": {c: {"old": o[c], "new": n[c]} for c in reworded}, "non_code_diff": nd}
json.dump(out, open(f"{D}/PRD-DIFF-v48-vs-v50.json", "w"), indent=1, ensure_ascii=False)
print(json.dumps(out["counts"]))
for c in added: print("ADDED", c, n[c])
for c in removed: print("REMOVED", c, o[c])
for c in reworded: print("REWORDED", c, "\n  OLD:", o[c], "\n  NEW:", n[c])
print("non-code diff lines:", len(nd)); [print(' ', l[:400]) for l in nd]
