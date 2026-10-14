"""Diff PRD v44 copy vs v46 copy by requirement code + every non-code line (normalised). Read-only."""
import re, json, sys, difflib
OLD = "CONFLUENCE-788430850-2026-10-14.md"
NEW = "CONFLUENCE-788430850-v46-2026-10-14b.md"
def strip_hdr(t): return re.sub(r'^<!--.*?-->\s*', '', t, flags=re.S)
def norm(s):
    s = s.replace('\\*', '*').replace('_\\*', '*')
    s = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'\1', s)
    s = re.sub(r'<(https?://[^>]+)>', r'\1', s)
    s = re.sub(r'^\s*[-*•]\s+', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s
CODE = re.compile(r'^\s*[-*]\s+\*\*(S\d+-[RNE]\d+[a-z]?)(\s*\([^)]*\))?:?\*\*:?\s*(.*)$')
def parse(t):
    codes, other = {}, []
    for line in strip_hdr(t).split('\n'):
        m = CODE.match(line)
        if m: codes[m.group(1)] = norm((m.group(2) or '') + ' ' + m.group(3))
        elif line.strip(): other.append(norm(line))
    return codes, other
o, oo = parse(open(OLD).read()); n, no = parse(open(NEW).read())
added = sorted(set(n) - set(o), key=lambda c: (int(c.split('-')[0][1:]), c)); removed = sorted(set(o) - set(n))
reworded = sorted([c for c in set(o) & set(n) if o[c] != n[c]]); same = sorted([c for c in set(o) & set(n) if o[c] == n[c]])
nd = [l for l in difflib.unified_diff(oo, no, lineterm='', n=0) if not l.startswith(('---', '+++', '@@'))]
out = {"old_file": OLD, "new_file": NEW, "old_version": 44, "new_version": 46,
       "counts": {"old": len(o), "new": len(n), "added": len(added), "removed": len(removed), "reworded": len(reworded), "identical": len(same)},
       "added": {c: n[c] for c in added}, "removed": {c: o[c] for c in removed},
       "reworded": {c: {"old": o[c], "new": n[c]} for c in reworded}, "identical": same, "non_code_diff": nd}
json.dump(out, open("PRD-DIFF-v44-vs-now.json", "w"), indent=1, ensure_ascii=False)
print(json.dumps(out["counts"])); print("added", added); print("removed", removed); print("reworded", reworded)
print("non-code diff lines:", len(nd)); [print(' ', l[:300]) for l in nd]
