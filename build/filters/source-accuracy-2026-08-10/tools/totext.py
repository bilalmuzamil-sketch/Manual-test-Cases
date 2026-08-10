import json, re, html, sys
def body(path):
    d=json.load(open(path)); return d['body']['storage']['value']
def totext(x):
    x=re.sub(r'<ac:structured-macro[^>]*ac:name="(?:code|noformat)".*?</ac:structured-macro>', ' ', x, flags=re.S)
    x=re.sub(r'<br\s*/?>', '\n', x, flags=re.I)
    x=re.sub(r'</(p|li|h1|h2|h3|h4|h5|tr|div)>', '\n', x, flags=re.I)
    x=re.sub(r'</t[dh]>', ' | ', x, flags=re.I)
    x=re.sub(r'<[^>]+>', '', x)
    x=html.unescape(x)
    x=re.sub(r'[ \t\xa0]+', ' ', x)
    x=re.sub(r'\n\s*\n+', '\n', x)
    return x.strip()
if __name__=='__main__':
    t=totext(body(sys.argv[1]))
    print(t[:int(sys.argv[2]) if len(sys.argv)>2 else 3000])
