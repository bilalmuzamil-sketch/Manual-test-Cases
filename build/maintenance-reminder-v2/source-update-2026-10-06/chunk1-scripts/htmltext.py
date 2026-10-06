import re,html,sys
t=open(sys.argv[1],encoding='utf-8').read()
t=re.sub(r'<(script|style|svg)[^>]*>.*?</\1>','',t,flags=re.S)
attrs=re.findall(r'\b(?:title|placeholder|aria-label|alt)="([^"]*)"',t)
s=[re.sub(r'\s+',' ',html.unescape(x)).strip() for x in re.split(r'<[^>]+>',t)]
s=[x for x in s if x]
print('\n'.join(s)); print('--- ATTRS ---'); print('\n'.join(sorted(set(html.unescape(a) for a in attrs))))
