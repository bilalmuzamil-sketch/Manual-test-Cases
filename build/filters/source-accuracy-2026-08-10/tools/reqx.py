"""Extract requirement definitions. Permissive on purpose: allows a parenthetical
or any short qualifier between the anchor id and the colon (the Report Suite pass's
first extractor produced 8 false positives by disallowing exactly that)."""
import re, json
from totext import body, totext
DEF = re.compile(r'^\s*(S\d+[A-Za-z]?-[A-Z]+\d+[a-z]?)\s*([^:\n]{0,60})?:\s*(.*)$')
def reqs(path):
    t = totext(body(path))
    out = {}
    order = []
    for line in t.splitlines():
        m = DEF.match(line)
        if not m: continue
        aid, qual, text = m.group(1), (m.group(2) or '').strip(), m.group(3).strip()
        if aid in out:
            if isinstance(out[aid], str): out[aid] = [out[aid]]
            out[aid].append(text)
        else:
            out[aid] = text
        order.append(aid)
    return out, order
def flat(path):
    r,_ = reqs(path)
    return {k: (v if isinstance(v,str) else ' || '.join(v)) for k,v in r.items()}
if __name__=='__main__':
    import sys
    r,o = reqs(sys.argv[1])
    dups=[k for k,v in r.items() if not isinstance(v,str)]
    print(len(r), 'definitions;', len(o), 'lines; duplicate ids:', dups)
