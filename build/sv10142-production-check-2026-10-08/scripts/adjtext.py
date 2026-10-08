import sys, pymupdf, re
for f in sys.argv[1:]:
    d=pymupdf.open(f); t='\n'.join(p.get_text() for p in d)
    i=t.find('Adjustments'); 
    print('=====',f, 'pages',len(d))
    if i<0: print('  no Adjustments heading'); 
    seg=t[i:i+900] if i>=0 else ''
    print('  '+seg.replace('\n',' | ')[:900])
