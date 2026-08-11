import json, re, html
secs=json.load(open('sections.json'))
kids={}
for s in secs: kids.setdefault(s.get('parent_id'),[]).append(s['id'])
def subtree(root):
    out=[];st=[root]
    while st:
        x=st.pop();out.append(x);st.extend(kids.get(x,[]))
    return set(out)
cases=json.load(open('all-cases.json'))
def group(root):
    ss=subtree(root); return [c for c in cases if c['section_id'] in ss]
def unmarkup(s):
    s=re.sub(r'<br\s*/?>','\n',s or '',flags=re.I)
    s=re.sub(r'</(p|li|div|ol|ul)>','\n',s,flags=re.I)
    s=re.sub(r'<[^>]+>','',s)
    return html.unescape(s).replace('\xa0',' ')
