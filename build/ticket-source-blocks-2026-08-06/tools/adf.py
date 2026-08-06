def txt(node, out=None):
    if out is None: out=[]
    if isinstance(node, dict):
        t = node.get('type')
        if t == 'text': out.append(node.get('text',''))
        elif t == 'hardBreak': out.append('\n')
        for c in (node.get('content') or []): txt(c, out)
        if t in ('paragraph','heading','listItem','tableRow','blockquote','codeBlock','rule'):
            out.append('\n')
        if t == 'heading': out.insert(len(out)-1,'')
        if t == 'tableCell' or t=='tableHeader': out.append(' | ')
    elif isinstance(node, list):
        for c in node: txt(c, out)
    return out

def to_text(adf):
    s = ''.join(txt(adf))
    lines = [l.rstrip() for l in s.split('\n')]
    res=[]
    for l in lines:
        if l=='' and res and res[-1]=='': continue
        res.append(l)
    return '\n'.join(res).strip()
