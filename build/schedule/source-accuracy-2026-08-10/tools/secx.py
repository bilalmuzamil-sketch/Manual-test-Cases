"""Split the Schedule spec into numbered sections and compare them across versions."""
import re, json
from totext import body, totext
HEAD = re.compile(r'^\s*(\d+(?:\.\d+)*)\.?\s+(\S.*)$')
def sections(path):
    t = totext(body(path))
    lines = t.splitlines()
    idx = []
    for i,l in enumerate(lines):
        m = HEAD.match(l)
        if m and len(m.group(2)) < 80 and not re.match(r'^\d', m.group(2)):
            idx.append((i, m.group(1), m.group(2).strip()))
    out = {}
    for n,(i,num,title) in enumerate(idx):
        end = idx[n+1][0] if n+1 < len(idx) else len(lines)
        out[num] = {'title': title, 'text': '\n'.join(lines[i+1:end]).strip()}
    return out
if __name__=='__main__':
    import sys
    s=sections(sys.argv[1])
    print(len(s),'sections')
    for k,v in s.items(): print(' ', k, '|', v['title'][:60], '|', len(v['text']))
