import json, re, html
from scope import group
def unmarkup(s):
    """Plain-text view of a field for PARSING ONLY (never written back)."""
    s = re.sub(r'<br\s*/?>', '\n', s or '', flags=re.I)
    s = re.sub(r'</(p|li|div)>', '\n', s, flags=re.I)
    s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(s).replace('\xa0',' ')
def ours(root):
    return [c for c in group(root) if c['created_by']==3]
def prov(c):
    t = unmarkup(c.get('custom_expected') or '')
    hits=[]
    for l in t.splitlines():
        l=l.strip()
        if l.startswith('This is the expected behaviour'):
            hits.append(l)
    return hits, t
